--HACER UNA LIMPIEZA PREVIA--
DROP TABLE IF EXISTS COMENTARIO CASCADE;
DROP TABLE IF EXISTS TAREA_CATEGORIA CASCADE;
DROP TABLE IF EXISTS TAREA CASCADE;
DROP TABLE IF EXISTS CATEGORIA CASCADE;
DROP TABLE IF EXISTS USUARIO CASCADE;

DROP TYPE IF EXISTS ESTADO_TAREA;

--TIPO ENUM PARA LOS ESTADOS DE TAREA--
CREATE TYPE ESTADO_TAREA AS ENUM(
    'pendiente',
    'en_progreso',
    'en_revision',
    'completada'
);

--TABLA USUARIO--
CREATE TABLE USUARIO(
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fch_borrado TIMESTAMP DEFAULT NULL
);

--TABLA CATEGORIA--
CREATE TABLE CATEGORIA(
    id_categ SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descrip TEXT,
    color VARCHAR(7),
    CONSTRAINT chk_color_hex
        CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fch_borrado TIMESTAMP DEFAULT NULL
);

--TABLA TAREA--
CREATE TABLE TAREA(
    id_tarea SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descrip TEXT,
    fch_entrega TIMESTAMP,
    estado ESTADO_TAREA NOT NULL DEFAULT 'pendiente',
    prioridad SMALLINT NOT NULL DEFAULT 1
        CHECK (prioridad BETWEEN 1 AND 5),
    story_points SMALLINT DEFAULT 0
        CHECK (story_points >= 0),
    fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fch_borrado TIMESTAMP DEFAULT NULL,
    

    id_creador INTEGER NOT NULL,
    id_asignado INTEGER,

    CONSTRAINT fk_tarea_creador
        FOREIGN KEY (id_creador)
        REFERENCES USUARIO (id_usuario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tarea_asignado 
        FOREIGN KEY (id_asignado)
        REFERENCES USUARIO (id_usuario)
        ON DELETE SET NULL,

    CONSTRAINT chk_fecha_valida
        CHECK (fch_entrega IS NULL OR fch_entrega >= fch_creacion)
);

--TABLA INTERMEDIA DE TAREA Y CATEGORIA YA QUE HAY UNA RELACION N:M--
CREATE TABLE TAREA_CATEGORIA(
    id_categ INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,
    PRIMARY KEY (id_categ, id_tarea),

    CONSTRAINT fk_tc_categoria
        FOREIGN KEY (id_categ)
        REFERENCES CATEGORIA(id_categ)
        ON DELETE CASCADE,

     CONSTRAINT fk_tc_tarea
        FOREIGN KEY (id_tarea)
        REFERENCES TAREA(id_tarea)
        ON DELETE CASCADE
);

--TABLA COMENTARIO--
CREATE TABLE COMENTARIO(
    id_coment SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fch_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fch_borrado TIMESTAMP DEFAULT NULL,

    id_usuario INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES USUARIO(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_comentario_tarea
        FOREIGN KEY (id_tarea)
        REFERENCES TAREA(id_tarea)
        ON DELETE CASCADE
);

--INDICES ESTRATEGICOS PARA FACILITAR LOS LISTADOS REQUERIDOS--
CREATE INDEX idx_tarea_asignado ON TAREA(id_asignado);

CREATE INDEX idx_tarea_estado ON TAREA(estado);

CREATE INDEX idx_comentario_tarea ON COMENTARIO(id_tarea);

CREATE INDEX idx_usuario_email ON USUARIO(email);

CREATE INDEX idx_tc_tarea_cat ON TAREA_CATEGORIA(id_categ, id_tarea);