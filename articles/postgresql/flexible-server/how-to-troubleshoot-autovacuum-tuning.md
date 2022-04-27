## Introduction 

Internal data consistency in PostgreSQL is based on the Multi-Version Concurrency Control (MVCC) mechanism, which allows the database engine to maintain multiple versions of a row. This provides greater concurrency with minimal blocking between the different processes. The downside of it is it needs appropriate maintenance done by VACUUM and ANALYZE commands.  

For example, when a row is deleted, it is not removed physically. Instead, the row is marked as “dead”. Similarly for updates, it marks the existing row as “dead” and inserts a new version of this row. These operations leave behind the dead records, called dead tuples, even after all the transactions that might see those versions finish. Unless cleaned up, these dead tuples will stay, consuming disk space, and for tables with a high update and delete rate, the dead tuples might account for most of the disk space, wasting space (which is commonly referred to as Bloat) and slowing query performance.   

The purpose of autovacuum process is to automate the execution of VACUUM and ANALYZE commands. The AUTOVACUUM daemon is made up of multiple processes that reclaim storage by removing obsolete data or tuples from the database. It checks for tables that have a significant number of inserted, updated, or deleted records and vacuums these tables.  

### Monitoring Autovacuum 

Autovacuum can be monitored by using the query below  

    SELECT schemaname, relname, n_dead_tup, n_live_tup, round(n_dead_tup::float/n_live_tup::float*100) dead_pct, autovacuum_count, last_vacuum, last_autovacuum, last_autoanalyze  
    FROM    pg_stat_all_tables    
    WHERE n_live_tup > 0    
    ORDER BY 10 DESC; 
  
The following columns help determine if autovacuum is catching up with table activity.  

<b>Dead_pct</b> : percentage of dead tuples when compared to live tuples  
<b>Last_autovacuum</b>: What was the date when the table was last autovacuumed  
<b>Last_autoanalyze</b>: What was the date when the table was last autoanalyzed  


### When Does PostgreSQL Trigger Autovacuum 

The autovacuum uses a threshold which basically is how many rows in the table must change. If the number of dead tuples is greater than the threshold, then the autovacuum is triggered.   

The threshold is calculated using several server parameters as mentioned below:  

Threshold --> autovacuum_vacuum_scale_factor * tuples + autovacuum_vacuum_threshold  

The query below gives a list of tables in the database and let us know if it qualifies for the autovacuum processing  

    SELECT *
      ,n_dead_tup > av_threshold AS av_needed
      ,CASE 
        WHEN reltuples > 0
          THEN round(100.0 * n_dead_tup / (reltuples))
        ELSE 0
        END AS pct_dead
    FROM (
      SELECT N.nspname
        ,C.relname
        ,pg_stat_get_tuples_inserted(C.oid) AS n_tup_ins
        ,pg_stat_get_tuples_updated(C.oid) AS n_tup_upd
        ,pg_stat_get_tuples_deleted(C.oid) AS n_tup_del
        ,pg_stat_get_live_tuples(C.oid) AS n_live_tup
        ,pg_stat_get_dead_tuples(C.oid) AS n_dead_tup
        ,C.reltuples AS reltuples
        ,round(current_setting('autovacuum_vacuum_threshold')::INTEGER + current_setting('autovacuum_vacuum_scale_factor')::NUMERIC * C.reltuples) AS av_threshold
        ,date_trunc('minute', greatest(pg_stat_get_last_vacuum_time(C.oid), pg_stat_get_last_autovacuum_time(C.oid))) AS last_vacuum
        ,date_trunc('minute', greatest(pg_stat_get_last_analyze_time(C.oid), pg_stat_get_last_analyze_time(C.oid))) AS last_analyze
      FROM pg_class C
      LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
      WHERE C.relkind IN (
          'r'
          ,'t'
          )
        AND N.nspname NOT IN (
          'pg_catalog'
          ,'information_schema'
          )
        AND N.nspname ! ~ '^pg_toast'
      ) AS av
    ORDER BY av_needed DESC ,n_dead_tup DESC;

Note: The query does not take into consideration that autovacuum can be configured per table basis using "alter table" DDL command.  

### Common Autovacuum Problems

##### Not Keeping Up with Busy Server

Cost based vacuuming limits the amount of disk I/O autovacuum process is expected to do per unit of time. The autovacuum process estimates cost to every I/O operation, accumulates a total for each operation it performs and pauses once the upper limit of the cost is reached.  

The `autovacuum_vacuum_cost_delay` and `autovacuum_vacuum_cost_limit` are the 2 server parameters that are used in the process.  

By default, `autovacuum_vacuum_cost_limit` is set to –1 meaning autovacuum cost limit would be same value as the parameter – `vacuum_cost_limt` which defaults to 200. 

`vacuum_cost_limit` is the cost of manual vacuum. If the `autovacuum_vacuum_cost_limit` is set to 200 then autovacuum process would then use this parameter. The `autovacuum_vacuum_cost_delay` is set to 20 ms by default. So, by default every time the autovacuum process accumulates a cost of 200 it pauses for 20 ms.  

In case the autovacuum is not keeping up, then following prameters can be changed  
                                                                                                         
###### autovacuum_vacuum_scale_factor
The parameter from default 0.2 to the following range 0.05 - 0.1. The scale factor is workload specific and amount of data in the tables. Before changing the value, the workload and individual table volumes need to be investigated.

###### autovacuum_vacuum_cost_limit
The cost can be set more than default 200. It is recommended to monitor CPU, I/O utilization on the database appropriately before and after making the change. 

###### autovacuum_vacuum_cost_delay  
We can change the parameter to 10 ms or can keep it as low as 2 ms.


##### Autovacuum Constantly Running
There might be two reasons  

###### maintenance_work_mem  

Autovacuum deamon uses `autovacuum_work_mem` which is by default set to -1 meaning `autovacuum_work_mem` would be same value as the parameter – `maintenance_work_mem`. In this document we are assuming `autovacuum_work_mem` is set to -1 value and `maintenance_work_mem` is used by autovacuum by deamon.

If the `maintenance_work_mem` is low then value of `maintenance_work_mem` can be increased upto 2GB on flexible server. A general rule of thumb is 50 MB is allocated to `maintenance_work_mem` for every 1 GB of RAM.  


###### Large number of databases.
Auto vacuum tries to start one worker on each database every `autovacuum_naptime` seconds.  
Example:  
We have 60 databases and autovacuum_naptime is 60 seconds then every second [autovacuum_naptime/Number of DBs] autovacuum worker is started.  

It might be a good idea to increase the `autovacuum_naptime` if we have more databases in a cluster. At the same time the autovacuum process can be made more aggressive by changing the `autovacuum_cost_limit` & `autovacuum_cost_delay` parameters and increasing the `autovacuum_max_workers` from default 3 to 4 or 5. 

##### Out Of Memory Errors  
Too aggressive `maintenance_work_mem` value may periodically cause out of memory errors in the system. It is important to know the available RAM on the system before setting the parameter and not forget that each `autovacuum_max_workers` when active uses the entire memory assigned as per `maintenance_work_mem`. Example: If the parameter is set to 1 GB, then when an autovacuum worker is active then it uses 1 GB of memory with it. So, if 3 workers are running then 3 GB is used.  

#####  Autovacuum Is Too Disruptive
In case where autovacuum is consuming lot of resources following can be done  

- Increase `autovacuum_vacuum_cost_delay` and reduce `autovacuum_vacuum_cost_limit` if it is set more than default 200.  
- Reduce number of `autovacuum_max_workers` if it is set more than default 3.

##### Number Of Autovacuum Workers  

Increasing the number of autovacuum workers will not necessarily increase the speed of vacuum. Generally, it is not recommended to have a high number of autovacuum workers. In fact, increasing the number of autovacuum workers will have them consume more memory depending on the value set in `maintenance_work_mem`. The processes may become too disruptive also which is generally not recommended. Rather than making it faster it makes the vacuum processing slow the reason being each worker process only gets (1/autovacuum_max_workers) of the total `autovacuum_cost_limit`, so increasing the number of workers will only make them go slower.
If the number of workers is increased `autovacuum_vacuum_cost_limit` will also have to be increased or/and reduce `autovacuum_vacuum_cost_delay` to make the vacuum process faster. 

However, if we have changed table level `autovacuum_vacuum_cost_delay` or `autovacuum_vacuum_cost_limit` storage parameters then those workers running on those tables are not considered in the balancing algorithm [autovacuum_cost_limit/autovacuum_max_workers].
 
##### Autovacuum transaction ID (TXID) wraparound protection

When a database runs into transaction ID wrapround protection, an error message like below is seen 

  <i>database is not accepting commands to avoid wraparound data loss in database ‘xx’   
  Stop the postmaster and vacuum that database in single-user mode. </i>
    
    Note: This error message is a long-standing oversight. Usually, you do not need to switch to single-user mode. Instead, you can run the required VACUUM commands and perform tuning for VACUUM to run fast. While you can't run any data manipulation language (DML), you can still run VACUUM.

The wraparound problem occurs when the database is either not vacuumed or there are a large number of dead tuples which could not be removed by autovacuum. The reasons for this might be: 
 
###### Workload induced 

The workload causes too many dead tuples in a short period of time which makes it difficult for autovacuum to catch up. The dead tuples in the system add up over a period leading to degradation of query performance and leading to wraparound situation. 

 
###### Long Running Transactions 

Any long-running transactions in the system will not allow dead tuples to be removed when autovacuum is running. They are a blocker to vacuum process. Removing the long running transactions frees up dead tuples for deletion when autovacuum runs. 

The long-running transactions can be checked in the system by following query: 


    SELECT pid, 
           age(backend_xid) AS age_in_xids, 
           now () - xact_start AS xact_age, 
           now () - query_start AS query_age, 
           state, 
           query 
     FROM pg_stat_activity 
     WHERE state != 'idle' 
     ORDER BY 2 DESC 
     LIMIT 10; 

 
###### Prepared Statements 

If there are prepared statements which are not committed, then that would also hold dead tuples from being removed. 

The query helps to find the non-committed prepared statements 

    SELECT gid, prepared, owner, database, transaction 
    FROM pg_prepared_xacts 
    ORDER BY age(transaction) DESC; 

Use commit prepared or rollback prepared to remove them. 

###### Replication Slots 

The replication slots which are not used. The query below helps identify it. 

    SELECT slot_name, slot_type, database, xmin 
    FROM pg_replication_slots 
    ORDER BY age(xmin) DESC; 

Use pg_drop_replication_slot() to delete an unused replication slot. 


When the database runs into transaction ID wrapround protection one can look if there are any blockers as mentioned above on the database and remove those for autovacuum to continue and complete. The speed of the autovacuum can also be increased by making `autovacuum_cost_delay` to 0 and increasing the `autovacuum_cost_limit` to a value much greater than 200. But changing the parameters the existing autovacuum workers would not pick the updated parameters. A database restart or killing of existing workers will have to be carried out so that new workers started pick the parameters changed from the point where it was killed. 

##### Table Specific Requirements  

We can set the autovacuum parameters to an individual table as per the requirement.   

To set auto-vacuum setting per table we use DDL and change the storage parameters as shown below

    ALTER TABLE <table name> SET (autovacuum_vacuum_scale_factor = 0.0); 
    ALTER TABLE <table name> SET (autovacuum_vacuum_threshold = 1000); 

Prioritization of autovacuum can also be made on a table basis. Example we have a table where growth of dead tuples is faster compared to other tables in this scenario we could set `autovacuum_vacuum_cost_delay` or `auto_vacuum_cost_limit parameters` at the table level to make vacuuming on the particular table more aggressive.  

    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_delay = xx);  
    ALTER TABLE <table name> SET (autovacuum_vacuum_cost_limit = xx);  

##### Insert Only Workloads  

In versions of PostgreSQL prior to 13, autovacuum will not run-on tables with an insert-only workload, because if there are no updates or deletes, there would be no dead tuples and no free space that would need to be reclaimed. Autoanalyze will run for insert-only workloads, since there is new data. A disadvantage of this is the visibility map is not updated, and thus the query performance especially where there is Index Only Scans starts to suffer over time.  

Possible Solutions  

For Postgres Versions prior to 13  

Use a cron job and schedule a periodic vacuum analyze on the table. The frequency of the cron job would be dependent on the workload on the table.   

Postgres 13 Or Higher Versions  

Autovacuum will run on tables with an insert-only workload. Two new server parameters `autovacuum_vacuum_insert_threshold` and `autovacuum_vacuum_insert_scale_factor` help control when autovacuum can be triggered on insert only tables also.  
