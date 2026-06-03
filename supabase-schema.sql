-- Wedding RSVP — Schema v2 (grupos + invitados)
-- Run this in Supabase SQL editor

-- 1. Drop old table
drop table if exists rsvp;

-- 2. Master guest list
create table if not exists invitados (
  id uuid primary key default gen_random_uuid(),
  grupo text not null,
  nombre_completo text not null,
  created_at timestamptz default now()
);

create index if not exists idx_invitados_grupo on invitados (grupo);

-- 3. RSVP responses (one row per person)
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  grupo text not null,
  nombre_completo text not null,
  asistira boolean not null,
  tiene_vehiculo boolean,
  created_at timestamptz default now()
);

create index idx_rsvp_grupo on rsvp (grupo);

-- 4. RLS
alter table invitados enable row level security;
alter table rsvp enable row level security;

create policy "public read invitados"
  on invitados for select using (true);

create policy "public read rsvp"
  on rsvp for select using (true);

create policy "public insert rsvp"
  on rsvp for insert with check (true);

-- 5. Seed invitados
truncate invitados;
insert into invitados (grupo, nombre_completo) values
  ('Tony Giannattasio y Sra.',       'Tony Giannattasio'),
  ('Tony Giannattasio y Sra.',       'Mileidy De Los Santos'),
  ('Amalia Giannattasio',            'Amalia Giannattasio'),
  ('Geny Giannattasio',              'Geny Giannattasio'),
  ('Amalia Di Matteo',               'Amalia Di Matteo'),
  ('Hipólito de los Santos y Sra.',  'Hipolito De Los Santos'),
  ('Hipólito de los Santos y Sra.',  'María Toro'),
  ('Jorge Jaramillo',                'Jorge Jaramillo'),
  ('Miguel Amato y Sra.',            'María Giannattasio'),
  ('Miguel Amato y Sra.',            'Miguel Amato'),
  ('Ramón Naranjo y Sra.',           'Ramón Naranjo'),
  ('Ramón Naranjo y Sra.',           'Zulay Sthory'),
  ('Alexandra Naranjo',              'Alexandra Naranjo'),
  ('José Naranjo',                   'José Naranjo'),
  ('Dylan García',                   'Dylan García'),
  ('Daniel Naranjo',                 'Daniel Naranjo'),
  ('Carlos Villegas y Flia.',        'Antonieta Naranjo'),
  ('Carlos Villegas y Flia.',        'Carlos Villegas'),
  ('Carlos Villegas y Flia.',        'Carlos Enrique Villegas'),
  ('Carlos Villegas y Flia.',        'Dominic Villegas'),
  ('Michel Naranjo y Flia.',         'Michel Naranjo'),
  ('Michel Naranjo y Flia.',         'Jackeline Márquez'),
  ('Michel Naranjo y Flia.',         'Miranda Naranjo'),
  ('Michel Naranjo y Flia.',         'Nicole Naranjo'),
  ('Shaira Perez',                   'Shaira Perez'),
  ('Jesús Cordova y Sra.',           'Jesús Cordova'),
  ('Jesús Cordova y Sra.',           'Gabriela Otero'),
  ('Daniel Hernández',               'Daniel Hernández'),
  ('Chiquinquira Hernández',         'Chiquinquira Hernández'),
  ('Christopher Suarez',             'Christopher Suarez'),
  ('Yarima Contreras',               'Yarima Contreras'),
  ('Rafael Contreras',               'Rafael Contreras'),
  ('Jesús Mangiafico',               'Jesús Mangiafico'),
  ('Francisco Blanco',               'Francisco Blanco'),
  ('Carolina Blanco',                'Carolina Blanco'),
  ('Yemaire Delgado',                'Yemaire Delgado'),
  ('Flavio Viloria',                 'Flavio Viloria');
