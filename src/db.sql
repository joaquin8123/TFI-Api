-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema mecanic
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mecanic
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mecanic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `mecanic` ;

-- -----------------------------------------------------
-- Table `mecanic`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `region` VARCHAR(100) NULL DEFAULT NULL,
  `country` VARCHAR(100) NULL DEFAULT NULL,
  `latitude` DECIMAL(10,8) NOT NULL DEFAULT '0.00000000',
  `longitude` DECIMAL(11,8) NOT NULL DEFAULT '0.00000000',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NULL DEFAULT NULL,
  `city_id` INT NULL DEFAULT NULL,
  `active` TINYINT NULL DEFAULT '1',
  `address` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`username` ASC) VISIBLE,
  INDEX `city_id` (`city_id` ASC) VISIBLE,
  CONSTRAINT `user_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `mecanic`.`city` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`store`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`store` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `rating` DECIMAL(2,1) NULL DEFAULT NULL,
  `city_id` INT NULL DEFAULT NULL,
  `owner_id` INT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `latitude` DECIMAL(10,8) NOT NULL,
  `longitude` DECIMAL(11,8) NOT NULL,
  `description` VARCHAR(45) NULL DEFAULT NULL,
  `active` TINYINT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  INDEX `city_id` (`city_id` ASC) VISIBLE,
  INDEX `owner_id` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `store_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `mecanic`.`city` (`id`),
  CONSTRAINT `store_ibfk_2`
    FOREIGN KEY (`owner_id`)
    REFERENCES `mecanic`.`user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`service`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`service` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_id` INT NULL DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NULL DEFAULT NULL,
  `duration` TIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  CONSTRAINT `service_ibfk_1`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`reservation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `service_id` INT NULL DEFAULT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  INDEX `service_id` (`service_id` ASC) VISIBLE,
  CONSTRAINT `reservation_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mecanic`.`user` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_3`
    FOREIGN KEY (`service_id`)
    REFERENCES `mecanic`.`service` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_id` INT NULL DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NULL DEFAULT NULL,
  `stock` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  CONSTRAINT `product_ibfk_1`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reservation_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `reservation_id` (`reservation_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `payment_ibfk_1`
    FOREIGN KEY (`reservation_id`)
    REFERENCES `mecanic`.`reservation` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `payment_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `mecanic`.`product` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`promotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`promotion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_id` INT NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `discount` DECIMAL(5,2) NULL DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  CONSTRAINT `promotion_ibfk_1`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`promotionitem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`promotionitem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `promotion_id` INT NULL DEFAULT NULL,
  `service_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `promotion_id` (`promotion_id` ASC) VISIBLE,
  INDEX `service_id` (`service_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `promotionitem_ibfk_1`
    FOREIGN KEY (`promotion_id`)
    REFERENCES `mecanic`.`promotion` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `promotionitem_ibfk_2`
    FOREIGN KEY (`service_id`)
    REFERENCES `mecanic`.`service` (`id`)
    ON DELETE SET NULL,
  CONSTRAINT `promotionitem_ibfk_3`
    FOREIGN KEY (`product_id`)
    REFERENCES `mecanic`.`product` (`id`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `service_id` INT NULL DEFAULT NULL,
  `rating` DECIMAL(2,1) NULL DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  INDEX `service_id` (`service_id` ASC) VISIBLE,
  CONSTRAINT `review_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mecanic`.`user` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_2`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_3`
    FOREIGN KEY (`service_id`)
    REFERENCES `mecanic`.`service` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mecanic`.`storecategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mecanic`.`storecategory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `store_id` INT NULL DEFAULT NULL,
  `category_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `storecategory_ibfk_1`
    FOREIGN KEY (`store_id`)
    REFERENCES `mecanic`.`store` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `storecategory_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `mecanic`.`category` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
