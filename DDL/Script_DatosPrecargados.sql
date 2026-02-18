--USUARIOS--
INSERT INTO USUARIO (nombre, email, clave)
VALUES
('Juan', 'juan@example.com', 'juan123'),
('Jose', 'jose@example.com', 'jose123');

--CATEGORIAS--
INSERT INTO CATEGORIA (nombre, descrip, color)
VALUES
('Personal', 'Vida cotidiana', '#4CAF50'),
('Trabajo', 'Tareas laborales', '#2196F3');

--TAREAS--
INSERT INTO TAREA (titulo, descrip, fch_entrega, estado, prioridad, story_points, id_creador, id_asignado)
VALUES
('Limpiar casa', 'Limpiar muebles y piso', '2026-02-23', 'pendiente', 3, 5,
(SELECT id_usuario FROM USUARIO WHERE email='jose@example.com'), 
(SELECT id_usuario FROM USUARIO WHERE email='juan@example.com')),
('Estudiar BD', 'Preparar examen de Bases de Datos', '2026-03-05', 'pendiente', 5, 10,
(SELECT id_usuario FROM USUARIO WHERE email='juan@example.com'), 
(SELECT id_usuario FROM USUARIO WHERE email='jose@example.com'));

--RELACION ENTRE TAREA Y CATEGORIA--
INSERT INTO TAREA_CATEGORIA (id_tarea, id_categ)
VALUES
((SELECT id_tarea FROM TAREA WHERE titulo='Limpiar casa'), (SELECT id_categ FROM CATEGORIA WHERE nombre='Personal')),
((SELECT id_tarea FROM TAREA WHERE titulo='Estudiar BD'), (SELECT id_categ FROM CATEGORIA WHERE nombre='Trabajo'));

--COMENTARIOS--
INSERT INTO COMENTARIO (contenido, id_usuario, id_tarea)
VALUES
('Cuidado con las mesa de vidrio', (SELECT id_usuario FROM USUARIO WHERE email='juan@example.com'), 
(SELECT id_tarea FROM TAREA WHERE titulo='Limpiar casa')),
('Revisar temas de modelo entidad relacion', (SELECT id_usuario FROM USUARIO WHERE email='jose@example.com'), 
(SELECT id_tarea FROM TAREA WHERE titulo='Estudiar BD'));