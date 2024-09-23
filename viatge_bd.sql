-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2024 a las 00:19:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `viatge_bd`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddPersona` (IN `p_name` VARCHAR(255), IN `p_lastname` VARCHAR(255), IN `p_age` INT, IN `p_FK_tipopersona` INT, IN `p_password` VARCHAR(255))   BEGIN
    INSERT INTO personas (name, lastname, age, FK_tipopersona, password)
    VALUES (p_name, p_lastname, p_age, p_FK_tipopersona, p_password);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPersonaByID` (IN `p_id` INT)   BEGIN
    -- Obtener la información de una persona por su ID
    SELECT * FROM personas WHERE ID = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTiposPersona` ()   BEGIN
    SELECT * FROM tipopersona;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdatePersonaByID` (IN `p_id` INT, IN `p_name` VARCHAR(255), IN `p_lastname` VARCHAR(255), IN `p_age` INT, IN `p_FK_tipopersona` INT)   BEGIN
    -- Actualizar la información de una persona en la tabla personas
    UPDATE personas 
    SET name = p_name, lastname = p_lastname, age = p_age, FK_tipopersona = p_FK_tipopersona 
    WHERE ID = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ValidateUserByName` (IN `p_name` VARCHAR(255), IN `p_password` VARCHAR(255))   BEGIN
    SELECT id, name  -- Asegúrate de seleccionar también el ID
    FROM personas 
    WHERE name = p_name AND password = p_password;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `ID_Ciudad` int(11) NOT NULL,
  `Nombre_Ciudad` varchar(255) NOT NULL,
  `FK_Pais` int(11) DEFAULT NULL,
  `Latitude` decimal(10,8) NOT NULL,
  `Longitude` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`ID_Ciudad`, `Nombre_Ciudad`, `FK_Pais`, `Latitude`, `Longitude`) VALUES
(1, 'Bogotá', 1, 4.61000000, -74.08330000),
(2, 'Medellín', 1, 6.24420000, -75.58120000),
(3, 'Buenos Aires', 2, -34.60370000, -58.38160000),
(4, 'Madrid', 3, 40.41680000, -3.70380000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `ID_Pais` int(11) NOT NULL,
  `Nombre_Pais` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`ID_Pais`, `Nombre_Pais`) VALUES
(1, 'Colombia'),
(2, 'Argentina'),
(3, 'España');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `FK_tipopersona` int(11) DEFAULT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `name`, `lastname`, `age`, `FK_tipopersona`, `password`) VALUES
(4, 'Juan', 'Pérez', 28, 1, ''),
(5, 'andres', 'Pérez', 28, 2, ''),
(6, 'Edwin alexander ', 'Bernal', 23, 1, ''),
(7, 'Edwin alexander ', 'lesmes', 24, 2, '123456'),
(9, 'camiloo', 'lesmes', 23, 3, '123456'),
(10, 'andre', 'barrera', 23, 2, '12345'),
(11, 'acbd', 'dfrg', 23, 3, '32'),
(12, 'tatiana', 'jimenez', 22, 2, '123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `FK_persona` int(11) DEFAULT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lng` decimal(11,8) DEFAULT NULL,
  `fecha_reserva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `FK_persona`, `hotel_name`, `location_lat`, `location_lng`, `fecha_reserva`) VALUES
(1, NULL, '201 Capital Go Torre Colpatria Zona Turística', 4.61035450, -74.07017180, '2024-09-22 16:57:16'),
(2, NULL, '201 Capital Go Torre Colpatria Zona Turística', 4.61035450, -74.07017180, '2024-09-22 17:02:35'),
(3, 7, 'Apartamento en el centro Bogotá', 4.61050550, -74.07022030, '2024-09-22 17:04:11'),
(4, 7, 'Centro Bogotá', 4.60341100, -74.07032730, '2024-09-22 19:47:05'),
(5, 7, 'Varun Luxury Vistas Urbanas', 4.60341100, -74.07032730, '2024-09-22 20:08:24'),
(6, 12, 'Amoblado Centro Internacional, Bogotá', 4.61586960, -74.06966360, '2024-09-22 20:11:33'),
(7, 7, 'Iluminado y hermoso apartamento con terraza', 6.24568500, -75.58435160, '2024-09-22 20:50:21'),
(8, 7, 'Bonito y cómodo apartamento cerca a Plaza Mayor', 6.23804490, -75.57774980, '2024-09-22 20:53:50'),
(9, 7, 'Hostal Victoria II', 40.41650720, -3.70319320, '2024-09-22 20:54:51'),
(10, 7, 'Apartamento en el centro Bogotá', 4.61050550, -74.07022030, '2024-09-22 22:07:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipopersona`
--

CREATE TABLE `tipopersona` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipopersona`
--

INSERT INTO `tipopersona` (`ID`, `Nombre`) VALUES
(1, 'Admin'),
(2, 'Usuario'),
(3, 'Invitado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`ID_Ciudad`),
  ADD KEY `FK_Pais` (`FK_Pais`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`ID_Pais`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_tipopersona` (`FK_tipopersona`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_persona` (`FK_persona`);

--
-- Indices de la tabla `tipopersona`
--
ALTER TABLE `tipopersona`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `ID_Ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `ID_Pais` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tipopersona`
--
ALTER TABLE `tipopersona`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `ciudad_ibfk_1` FOREIGN KEY (`FK_Pais`) REFERENCES `pais` (`ID_Pais`) ON DELETE CASCADE;

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `personas_ibfk_1` FOREIGN KEY (`FK_tipopersona`) REFERENCES `tipopersona` (`ID`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`FK_persona`) REFERENCES `personas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
