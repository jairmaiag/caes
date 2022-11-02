insert into caes.raca (uuid, nome) values (uuid_generate_v4(),'Shih-tzu');
insert into caes.raca (uuid, nome) values (uuid_generate_v4(),'Spitz Alemão');

insert into caes.donos (uuid, nome, ddd, telefone) values (uuid_generate_v4(), 'Norma S. Borba', '47','997402124');
insert into caes.donos (uuid, nome, ddd, telefone) values (uuid_generate_v4(), 'Jair M. Diniz', '47','984246256');
insert into caes.donos (uuid, nome, ddd, telefone) values (uuid_generate_v4(), 'Matheus Vinicios', '47','984246256');
insert into caes.donos (uuid, nome, ddd, telefone) values (uuid_generate_v4(), 'Luiza', '47','984246256');
insert into caes.donos (uuid, nome, ddd, telefone) values (uuid_generate_v4(), 'Nelci', '47','984246256');

insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Odin','2021-10-20','M',1,'Gosta de receber os donos quando chegam em casa.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Fran','2020-07-22','F',1,'Meiga e esbelta, tem um latido muito agradável e engraçado.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Jade','2018-05-04','F',1,'Arranha os potes de água quando estão vazios.');
insert into caes.caes (uuid, nome, nascimento, sexo, maeId, racaid, descricao) values (uuid_generate_v4(),'Dark','2019-12-19','F',3,1,'Geniosa. Quando toma banho fica com um humor terrível.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Ava','2020-04-08','F',1,'Um amor, sempre feliz e disposta a receber um chamego.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Lilith','2020-09-19','F',1,'Muito esperta, vive fuçando o quintal cavando buracos.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Conan','2020-09-29','M',2,'Muito engraçado! Quando olha para as pessoas ele inclina a cabeça.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Lian','2020-09-13','F',2,'Paqueradora com os donos, mas extremamente ciumenta com o Conan.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Frida','2021-05-06','F',2,'Agitada, não gosta de ninguém passando na frente da casa.');
insert into caes.caes (uuid, nome, nascimento, sexo, racaid, descricao) values (uuid_generate_v4(),'Cacau','2020-12-07','F',2,'Grandona e desajeitada, tem a Frida como parceira de bagunça.');

insert into caes.donoscaes(donoid, caoid) values (1,1);
insert into caes.donoscaes(donoid, caoid) values (1,2);
insert into caes.donoscaes(donoid, caoid) values (2,2);
insert into caes.donoscaes(donoid, caoid) values (3,1);

select ca.id, ca.nome, ca.nascimento, ca.sexo, rc.nome as nomeraca, caesPai.nome as pai, caesMae.nome as mae
	from caes.caes as ca 
	inner join caes.raca rc on rc.id = ca.racaid 
	left join caes.caes as caesPai on caesPai.id = ca.paiId
	left join caes.caes as caesMae on caesMae.id = ca.maeId
	order by ca.id;

select dono.*, caes.nome
    from caes.donos dono
    left join caes.donoscaes donocao on donocao.donoid = dono.id
    left join caes.caes caes on donocao.caoid = caes.id
	order by dono.id,caes.id;
