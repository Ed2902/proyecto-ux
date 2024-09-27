USE viatge_bd;

DELIMITER $$


DROP TRIGGER IF EXISTS BeforeDeletePerson$$

CREATE TRIGGER BeforeDeletePerson
BEFORE DELETE ON personas
FOR EACH ROW
BEGIN
   
    DELETE FROM reservas WHERE FK_persona = OLD.id;
END $$

DELIMITER ;
