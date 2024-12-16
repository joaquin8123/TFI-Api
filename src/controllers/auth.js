const bcrypt = require("bcrypt");

const logging = require("../config/logging");
const sendResponse = require("../helpers/handleResponse");

const User = require("../models/user");
const signJWT = require("../helpers/signJWT");
const NAMESPACE = "Auth Controller";
const SALT_ROUNDS = 10;

const register = async (req, res) => {
  logging.info(NAMESPACE, `Register Method`);

  try {
    const {
      username,
      password,
      name,
      address,
      cityId,
      active = true,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userExists = await User.getUser({ username });

    if (userExists.length > 0) {
      return sendResponse(res, "USER_EXISTS", 401, {
        data: "User already exists",
      });
    }

    const user = new User({
      username,
      password: hashedPassword,
      name,
      address,
      role: "USER",
      cityId,
      active,
    });

    const registeredUser = await user.register();
    return sendResponse(res, "REGISTER_USER_SUCCESS", 201, {
      data: registeredUser,
    });
  } catch (error) {
    console.error("Error in register:", error);
    return sendResponse(res, "REGISTER_ERROR", 500, { data: error });
  }
};

const login = async (req, res) => {
  logging.info(NAMESPACE, "Login Method");

  try {
    let { username, password } = req.body;
    const user = await User.getUser({ username });
    if (!user.length) {
      return sendResponse(res, "UNEXISTENT_USER", 401);
    }

    if (!user[0].active) {
      return sendResponse(res, "UNACTIVE_USER", 401);
    }

    const result = await bcrypt.compare(password, user[0].password);

    if (result) {
      const token = signJWT(user);

      if (token) {
        return sendResponse(res, "LOGIN_SUCCESS", 200, {
          data: { token, clientId: user[0].id, storeId: user[0].store_id },
        });
      } else {
        return sendResponse(res, "SIGN_TOKEN_ERROR", 401);
      }
    } else {
      return sendResponse(res, "INCORRECT_PASSWORD", 401);
    }
  } catch (error) {
    return sendResponse(res, "LOGIN_ERROR", 401, { data: error });
  }
};

const resetPassword = async (req, res) => {
  logging.info(NAMESPACE, "ResetPassword Method");

  try {
    let {
      username,
      password,
      newPassword,
      type = "user",
      isReset = false,
    } = req.body;

    const user = await User.getUser({ username, type });

    if (!user.length) {
      await Audit.registerAudit({
        action: "RESET_PASSWORD_UNEXISTENT_USER",
        user_id: user[0].id,
        client_id: null,
        details: { event: "Reset password unexistsent user" },
      });
      return sendResponse(res, "UNEXISTENT_USER", 401);
    }

    if (isReset) {
      await User.updateUser({ userId: user[0].id, password: null });
      await Audit.registerAudit({
        action: "RESET_PASSWORD_SUCCESS",
        user_id: user[0].id,
        client_id: null,
        details: { event: "Reset password success" },
      });
      return sendResponse(res, "RESET_PASSWORD_SUCCESS", 200, {});
    }

    const result = await bcrypt.compare(password, user[0].password);

    if (result) {
      const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await User.updateUser({ userId: user[0].id, password: passwordHash });
      await Audit.registerAudit({
        action: "NEW_PASSWORD_SUCCESS",
        user_id: user[0].id,
        client_id: null,
        details: { event: "New password success" },
      });
      return sendResponse(res, "NEW_PASSWORD_SUCCESS", 200, {});
    } else {
      await Audit.registerAudit({
        action: "RESET_INCORRECT_PASSWORD",
        user_id: user[0].id,
        client_id: null,
        details: { event: "Reset password incorrect" },
      });
      return sendResponse(res, "RESET_INCORRECT_PASSWORD", 401, {});
    }
  } catch (error) {
    await Audit.registerAudit({
      action: "RESET_ERROR",
      user_id: null,
      client_id: null,
      details: { event: "Reset password error", error },
    });
    return sendResponse(res, "RESET_ERROR", 401, { data: error });
  }
};

const logout = async (req, res) => {
  logging.info(NAMESPACE, "Logout Method");

  try {
    let { clientId } = req.body;
    return sendResponse(res, "LOGOUT_SUCCESS", 200, {});
  } catch (error) {
    return sendResponse(res, "LOGOUT_ERROR", 401, { data: error });
  }
};

module.exports = { register, login, resetPassword, logout };
