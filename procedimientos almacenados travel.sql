USE viatge_bd;

-- Cambiar el delimitador para evitar problemas con los procedimientos
DELIMITER $$

-- Eliminar el procedimiento GetTiposPersona si ya existe
DROP PROCEDURE IF EXISTS GetTiposPersona$$

-- Crear el procedimiento GetTiposPersona
CREATE PROCEDURE GetTiposPersona()
BEGIN
    SELECT * FROM tipopersona;
END $$

-- Eliminar el procedimiento AddPersona si ya existe
DROP PROCEDURE IF EXISTS AddPersona$$

-- Crear el procedimiento AddPersona
CREATE PROCEDURE AddPersona(
    IN p_name VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_age INT,
    IN p_FK_tipopersona INT,
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO personas (name, lastname, age, FK_tipopersona, password)
    VALUES (p_name, p_lastname, p_age, p_FK_tipopersona, p_password);
END $$

-- Eliminar el procedimiento ValidateUserByName si ya existe
DROP PROCEDURE IF EXISTS ValidateUserByName$$

-- Crear el procedimiento ValidateUserByName
CREATE PROCEDURE ValidateUserByName(
    IN p_name VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT id, name  -- Asegúrate de seleccionar también el ID
    FROM personas 
    WHERE name = p_name AND password = p_password;
END $$

-- Eliminar el procedimiento GetPersonaByID si ya existe
DROP PROCEDURE IF EXISTS GetPersonaByID$$

-- Crear el procedimiento GetPersonaByID
CREATE PROCEDURE GetPersonaByID(
    IN p_id INT
)
BEGIN
    -- Obtener la información de una persona por su ID
    SELECT * FROM personas WHERE ID = p_id;
END $$

-- Volver al delimitador estándar ;
DELIMITER ;

DELIMITER $$

-- Eliminar el procedimiento si ya existe
DROP PROCEDURE IF EXISTS UpdatePersonaByID$$

-- Crear el procedimiento UpdatePersonaByID
CREATE PROCEDURE UpdatePersonaByID(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_lastname VARCHAR(255),
    IN p_age INT,
    IN p_FK_tipopersona INT
)
BEGIN
    -- Actualizar la información de una persona en la tabla personas
    UPDATE personas 
    SET name = p_name, lastname = p_lastname, age = p_age, FK_tipopersona = p_FK_tipopersona 
    WHERE ID = p_id;
END $$

DELIMITER ;
