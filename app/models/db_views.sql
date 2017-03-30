use planner;

drop view IF EXISTS v_req; 

create view v_req as select * from schedule_dtls where type = 'R';

drop view IF EXISTS v_avail;

create view v_avail as select * from schedule_dtls where type = 'A';

drop view IF EXISTS v_foj_sched;

create view v_foj_sched as 
select ifnull( r.schedule_id, e.schedule_id ) schedule_id,
       r.user_id rUser,
       r.type rType,
       DATE_FORMAT( r.date, '%Y-%m-%d' ) rDate,
       r.hour rHour,
       e.user_id eUser,
       e.type eType,
       DATE_FORMAT( e.date, '%Y-%m-%d' ) eDate,
       e.hour eHour
  from v_req r
  left outer join v_avail e on r.schedule_id = e.schedule_id and r.date = e.date and r.hour = e.hour 
 where ( r.type is null or r.type = 'R' )
   and ( e.type is null or e.type = 'A' )
union
select ifnull( r.schedule_id, e.schedule_id ) schedule_id,
       r.user_id rUser,
       r.type rType,
       DATE_FORMAT( r.date, '%Y-%m-%d' ) rDate,
       r.hour rHour,
       e.user_id eUser,
       e.type eType,
       DATE_FORMAT( e.date, '%Y-%m-%d' ) eDate,
       e.hour eHour
  from v_req r
  right outer join v_avail e on r.schedule_id = e.schedule_id and r.date = e.date and r.hour = e.hour 
 where ( r.type is null or r.type = 'R' )
   and ( e.type is null or e.type = 'A' )
 order by ifnull( rDate, eDate ), ifnull( rHour, eHour );

drop view if exists v_schedule_status;

create view v_schedule_status as
select s.id schedule_id,
       s.co_id,
       s.schedule_nm,
       ifnull( rDate, eDate ) date,
       ifnull( rHour, eHour ) hour,
       case 
       when rtype = 'R' and eType = 'A' then 'C'
       when rtype = 'R' and eType is null then 'R'
       when rtype is null and etype = 'A' then 'A'
       else 'U'
       end stat,
       ru.id rUserId,
       ru.user_name rUserNm,
       eu.id eUserId,
       eu.user_name eUserNm
  from schedules s 
  join v_foj_sched sd on sd.schedule_id = s.id
  left outer join users ru on ru.id = sd.rUser
  left outer join users eu on eu.id = sd.eUser
 order by date, hour;

drop view if exists v_user;
  
create view v_user 
as 
select u.id		id,
       u.name     	user_name,
       c.id       	co_id,
       c.name     	company_name,
       u.email    	email,
       u.name     	name,
       u.phone 		phone,
       u.address	address,
       u.city		city,
       u.state		state,
       u.zip		zip,
       u.img		img,
       u.type		type
  from users u
  join companies c on c.id = u.co_id  ;
  
  
select * from v_schedule_status ;
  
  
  
