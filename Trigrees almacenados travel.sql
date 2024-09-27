USE viatge_bd;

DELIMITER $$

-- Eliminar el trigger si ya existe
DROP TRIGGER IF EXISTS BeforeDeletePerson$$

-- Crear el trigger BeforeDeletePerson
CREATE TRIGGER BeforeDeletePerson
BEFORE DELETE ON personas
FOR EACH ROW
BEGIN
    -- Eliminar todas las reservas asociadas a la persona que está siendo eliminada
    DELETE FROM reservas WHERE FK_persona = OLD.id;
END $$

DELIMITER ;
