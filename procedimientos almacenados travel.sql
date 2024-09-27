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
    SELECT id, name
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
    SELECT * FROM personas WHERE ID = p_id;
END $$

-- Eliminar el procedimiento GetPersonas si ya existe
DROP PROCEDURE IF EXISTS GetPersonas$$

-- Crear el procedimiento GetPersonas
CREATE PROCEDURE GetPersonas()
BEGIN
    SELECT personas.id, 
           personas.name, 
           personas.lastname, 
           personas.age, 
           tipopersona.Nombre 
    FROM personas 
    INNER JOIN tipopersona 
    ON tipopersona.ID = personas.FK_tipopersona;
END $$

-- Eliminar el procedimiento UpdatePersonaByID si ya existe
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
    UPDATE personas 
    SET name = p_name, lastname = p_lastname, age = p_age, FK_tipopersona = p_FK_tipopersona 
    WHERE ID = p_id;
END $$

-- Eliminar el procedimiento DeletePersonReservations si ya existe
DROP PROCEDURE IF EXISTS DeletePersonByID$$

-- Crear el procedimiento DeletePersonByID
CREATE PROCEDURE DeletePersonByID(
    IN p_persona_id INT
)
BEGIN
    -- Eliminar a la persona (el trigger se encargará de eliminar las reservas)
    DELETE FROM personas WHERE id = p_persona_id;
END $$

-- Eliminar el procedimiento si ya existe
DROP PROCEDURE IF EXISTS InsertReservation$$

-- Crear el procedimiento InsertReservation
CREATE PROCEDURE InsertReservation(
    IN p_user_id INT,
    IN p_hotel_name VARCHAR(255),
    IN p_location_lat DECIMAL(10, 7),
    IN p_location_lng DECIMAL(10, 7)
)
BEGIN
    -- Insertar los datos en la tabla de reservas
    INSERT INTO reservas (FK_persona, hotel_name, location_lat, location_lng)
    VALUES (p_user_id, p_hotel_name, p_location_lat, p_location_lng);
END $$

-- Eliminar el procedimiento si ya existe
DROP PROCEDURE IF EXISTS GetUserReservations$$

-- Crear el procedimiento GetUserReservations
CREATE PROCEDURE GetUserReservations(
    IN p_user_id INT
)
BEGIN
    -- Obtener las reservas del usuario basado en su ID, incluyendo el ID de la reserva
    SELECT id, hotel_name, location_lat, location_lng
    FROM reservas
    WHERE FK_persona = p_user_id;
END $$

-- Eliminar el procedimiento si ya existe
DROP PROCEDURE IF EXISTS DeleteReservationByID$$

-- Crear el procedimiento DeleteReservationByID
CREATE PROCEDURE DeleteReservationByID(
    IN p_reserva_id INT,
    IN p_user_id INT
)
BEGIN
    -- Solo eliminar la reserva si pertenece al usuario autenticado
    DELETE FROM reservas WHERE id = p_reserva_id AND FK_persona = p_user_id;
END $$


DELIMITER ;
