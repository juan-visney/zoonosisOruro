create database zoonosis;

use zoonosis;

create table usuario(
    idUsuario INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    cuenta VARCHAR(30),
    clave VARCHAR(255),
    ci INT(10),
    celular INT(10),
    foto VARCHAR(200),
    estado VARCHAR(20)
);
ALTER TABLE usuario AUTO_INCREMENT = 100;

create table mascota(
    idMascota INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idUsuario INT(10) NOT NULL,
    fechaIngreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    especie VARCHAR(50) NOT NULL,
    color VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    foto VARCHAR(200),
    edad INT(10),
    sexo VARCHAR(20),
    CONSTRAINT fk_mascota FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);
ALTER TABLE usuario AUTO_INCREMENT =100;

create table adoptante(
    idAdoptante INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    celular INT(10) NOT NULL,
    latitud DEC(8, 7) NOT NULL,
    longitud DEC(8, 7) NOT NULL,
    carnet VARCHAR(200)
);
ALTER TABLE adoptante AUTO_INCREMENT = 100;
ALTER TABLE adoptante ADD `direccion` VARCHAR(250);
ALTER TABLE adoptante CHANGE `latitud` `latitud` VARCHAR(255);
ALTER TABLE adoptante CHANGE `longitud` `longitud` VARCHAR(255);

create table adopcion(
    idAdopcion INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idAdoptante INT(10) NOT NULL,
    idMascota INT(10) NOT NULL,
    fechaAdopcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaEntrega TIMESTAMP,
    estado VARCHAR(50) NOT NULL,
    tipo VARCHAR(50),
    CONSTRAINT fk_adoptante FOREIGN KEY (idAdoptante) REFERENCEs adoptante(idAdoptante),
    CONSTRAINT fk_mascota1 FOREIGN KEY (idMascota) REFERENCES mascota(idMascota)
);
ALTER TABLE adopcion AUTO_INCREMENT = 100;

