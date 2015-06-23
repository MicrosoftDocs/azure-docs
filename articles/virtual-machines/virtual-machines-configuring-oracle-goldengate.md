<properties title="Configuring Oracle GoldenGate for Azure" pageTitle="Configuring Oracle GoldenGate for Azure" description="Step through a tutorial for setting up and implementing Oracle GoldenGate on Azure Virtual Machines for high availability and disaster recovery." services="virtual-machines" authors="bbenz" documentationCenter=""/>
<tags ms.service="virtual-machines" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="infrastructure-services" ms.date="06/22/2015" ms.author="bbenz" />
#Configuring Oracle GoldenGate for Azure
This tutorial demonstrates how to setup Oracle GoldenGate for Azure Virtual Machines environment for high availability and disaster recovery. The tutorial focuses on [bi-directional replication](http://docs.oracle.com/goldengate/1212/gg-winux/GWUAD/wu_about_gg.htm) for non-RAC Oracle databases and requires that both sites are active.

Oracle GoldenGate supports data distribution and data integration. It enables you to set up a data distribution and data synchronization solution through the Oracle-Oracle replication configuration, and provides a flexible high availability solution. Oracle GoldenGate supplements Oracle Data Guard with its replication capabilities to enable enterprise-wide information distribution and zero-downtime upgrades and migrations. For detailed information, see [Using Oracle GoldenGate with Oracle Data Guard](http://docs.oracle.com/cd/E11882_01/server.112/e17157/unplanned.htm).

Oracle GoldenGate contains the following main components: Extract, Data pump, Replicat, Trails or extract files, Checkpoints, Manager and Collector. To have bi-directional replication between two sites, you need to create and start all components on both sites. For detailed information on Oracle GoldenGate architecture, see [Oracle GoldenGate Guide](http://docs.oracle.com/goldengate/1212/gg-winux/index.html).

This tutorial assumes that you already have theoretical and practical knowledge on Oracle Database High Availability and Disaster Recovery concepts as well as [Oracle GoldenGate](http://docs.oracle.com/goldengate/1212/gg-winux/index.html). For more information, see the [Oracle web site](http://www.oracle.com/technetwork/database/features/availability/index.html).

In addition, the tutorial assumes that you have already implemented the following prerequisites:

- You’ve already reviewed the High Availability and Disaster Recovery Considerations section in the [Oracle Virtual Machine images - Miscellaneous Considerations](virtual-machines-miscellaneous-considerations-oracle-virtual-machine-images.md) topic. Note that Azure supports standalone Oracle Database instances but not Oracle Real Application Clusters (Oracle RAC) currently.

- You’ve downloaded the Oracle GoldenGate software from the [Oracle Downloads](http://www.oracle.com/us/downloads/index.html) web site. You’ve selected the Product Pack Oracle Fusion Middleware – Data Integration. Then, you’ve selected Oracle GoldenGate on Oracle v11.2.1 Media Pack for Microsoft Windows x64 (64-bit) for an Oracle 11g database. Next, download Oracle GoldenGate V11.2.1.0.3 for Oracle 11g 64bit on Windows 2008 (64bit).

- You have created two Virtual Machines (VMs) in Azure using the platform provided Oracle Enterprise Edition image on Windows Server. For information, see [Creating an Oracle Database 12c Virtual Machine in Azure](#z3dc8d3c097cf414e9048f7a89c026f80) and [Azure Virtual Machines](http://azure.microsoft.com/documentation/services/virtual-machines/). Make sure that the Virtual Machines are in the [same cloud service](virtual-machines-load-balance.md) and in the same [Virtual Network](http://azure.microsoft.com/documentation/services/virtual-network/) to ensure they can access each other over the persistent private IP address.

- You’ve set the Virtual Machine names as “MachineGG1” for Site A and “MachineGG2” for Site B at the Azure Portal.

- You’ve created test databases “TestGG1” on Site A and “TestGG2” on Site B.

- You log on to your Windows server as a member of the Administrators group or a member of the **ORA_DBA** group.

In this tutorial, you will:

1. Setup database on Site A and Site B  

	1. Perform initial data load
	
2. Prepare Site A and Site B for database replication

3. Create all necessary objects to support DDL Replication

4. Configure GoldenGate Manager on Site A and Site B

5. Create Extract Group and Data Pump processes on Site A and Site B

	1. Create Extract and Data Pump processes on Site A

	2. Create a GoldenGate checkpoint table on Site B

	3. Add REPLICAT on Site B

	4. Create Extract and Data Pump processes on Site B

	5. Create a GoldenGate checkpoint table on Site A

	6. Add REPLICAT on Site A

	7. Add trandata on Site A and Site B

	8. Start Extract and Data Pump processes on Site A

	9. Start Extract and Data Pump processes on Site B

	10. Start REPLICAT process on Site A

	11. Start REPLICAT process on Site B

6. Verify the bi-directional replication process

>[AZURE.IMPORTANT] This tutorial has been setup and tested against the following software configuration:
>
>|                        | **Site A Database**              | **Site B Database**              |
>|------------------------|----------------------------------|----------------------------------|
>| **Oracle Release**     | Oracle11g Release 2 – (11.2.0.1) | Oracle11g Release 2 – (11.2.0.1) |
>| **Machine Name**       | MachineGG1                       | MachineGG2                       |
>| **Operating System**   | Windows 2008 R2                  | Windows 2008 R2                  |
>| **Oracle SID**         | TESTGG1                          | TESTGG2                          |
>| **Replication Schema** | SCOTT                            | SCOTT                            |

For subsequent releases of Oracle Database and Oracle GoldenGate, there might be some additional changes that you need to implement. For the most up-to-date version specific information, see [Oracle GoldenGate](http://docs.oracle.com/goldengate/1212/gg-winux/index.html) and [Oracle Database](http://www.oracle.com/us/corporate/features/database-12c/index.html) documentation at Oracle web site. For example, for a release 11.2.0.4 source database and later, the capture of DDL is performed by the logmining server asynchronously and requires no special triggers, tables, or other database objects to be installed. Oracle GoldenGate upgrades can be performed without stopping user applications. The use of a DDL trigger and supporting objects is required when Extract is in integrated mode with an Oracle 11g source database that is earlier than version 11.2.0.4. For detailed guidance, see [Installing and Configuring Oracle GoldenGate for Oracle Database](http://docs.oracle.com/goldengate/1212/gg-winux/GIORA.pdf).

##1. Setup database on Site A and Site B
This section explains how to perform the database prerequisites on both Site A and Site B. You must perform all the steps of this section on both sites: Site A and Site B.

First, remote desktop to Site A and Site B via the Management Portal. Open up a Windows command prompt and create a home directory for Oracle GoldenGate setup files:

	mkdir C:\OracleGG

Then, unzip and install the Oracle GoldenGate software in this folder. After this step, you can initiate the GoldenGate Software Command Interpreter (GGSCI) by executing the following command:

	C:\OracleGG\.\ggsci

You can use [GGSCI](http://docs.oracle.com/goldengate/1212/gg-winux/GWUAD/wu_gettingstarted.htm) to run several commands that configure, control, and monitor Oracle GoldenGate.

Next, run the following command to create all sub-folders from the installation package:

	GGSCI (Hostname) 1> CREATE SUBDIRS

Run the following command to exit the GGSCI command prompt:

	GGSCI (Hostname) 1> EXIT

Then, you need to create a database user, which will be used by the Oracle GoldenGate Manager, Extract and Replication processes. Note that you can create individual users for each process or configure only one common user. In this tutorial, we create one user, which is called as ggate. Then, we grant that user the necessary privileges. Note that you must perform the following operations on Site A and Site B.

Open up SQL\*Plus command window on Site A and Site B with database administrator privileges using **SYSDBA**, such as:

	Enter username: / as sysdba

And run:

	SQL> create tablespace ggs_data   datafile 'c:\OracleDatabase\oradata\<DBNAME>\<DBNAME>ggs_data01.dbf' size 200m; 
	SQL> create user ggate identified by ggate default tablespace ggs_data  temporary tablespace temp;
	      grant connect, resource to ggate;
	      grant select any dictionary, select any table to ggate;
	      grant create table to ggate;
	      grant flashback any table to ggate;
	      grant execute on dbms_flashback to ggate;
	      grant execute on utl_file to ggate;
	      grant create any table to ggate;
	      grant insert any table to ggate;
	      grant update any table to ggate;
	      grant delete any table to ggate;
	      grant drop any table to ggate;

Next, locate the INIT\<DatabaseSID\>.ORA file in the %ORACLE\_HOME%\\database folder on Site A and Site B and append the following database parameters to INITTEST.ora:

	UNDO\_MANAGEMENT=AUTO
	UNDO\_RETENTION=86400

For a full list of all Oracle GoldenGate GGSCI commands, see [Reference for Oracle GoldenGate for Windows](http://docs.oracle.com/goldengate/1212/gg-winux/GWURF/ggsci_commands.htm).

### Perform initial data load

You can perform the initial data load in the database by following several methods. For example, you can use the [Oracle GoldenGate Direct Load](http://docs.oracle.com/goldengate/1212/gg-winux/GWUAD/wu_initsync.htm) or regular Export and Import utilities to export table data from Site A to Site B.

To demonstrate the Oracle GoldenGate replication process, this tutorial demonstrates creating a table on both Site A and site B by using the following commands.

First, open up SQL\*Plus command window and run the following command to create an inventory table on Site A and Site B databases:
	
	create table scott.inventory
	(prod_id number,
	prod_category varchar2(20),
	qty_in_stock number,
	last_dml timestamp default systimestamp);

Next, add a constraint to the newly created table on Site A and Site B databases:

	alter table scott.inventory add constraint pk_inventory primary key (prod_id) ;

Then, grant all privileges on the new inventory table to the user ggate on Site A and Site B:

	grant all on scott.inventory to ggate;

Next, create and enable a database trigger, INVENTORY_CDR_TRG, on the newly created table to make sure that all transactions to the new table are recorded if the user is not ggate. Perform this operation on Site A and Site B.

	CREATE OR REPLACE TRIGGER INVENTORY_CDR_TRG
	BEFORE UPDATE
	ON SCOTT.INVENTORY
	REFERENCING NEW AS New OLD AS Old
	FOR EACH ROW
	BEGIN
	IF SYS_CONTEXT ('USERENV', 'SESSION_USER') != 'GGATE'
	THEN
	:NEW.LAST_DML := SYSTIMESTAMP;
	END IF;
	END;
	/ 


##2. Prepare Site A and Site B for database replication
This section explains how to prepare Site A and Site B for database replication. You must perform all the steps of this section on both sites: Site A and Site B.

First, remote desktop to Site A and Site B via the Azure Portal. Switch the database to archivelog mode using the SQL*Plus command window: 
	
	sql>shutdown immediate 
	sql>startup mount 
	sql>alter database archivelog; 
	sql>alter database open;


Then, enable minimal [supplemental logging](http://docs.oracle.com/cd/E11882_01/server.112/e22490/logminer.htm) as follows:

	SQL> ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;

Next, prepare the database to support DDL (data definition language) replication:

	SQL> alter system set recyclebin=off scope=spfile;

Then, shutdown and restart the database:

	sql>shutdown immediate 
	sql>startup


##3. Create all necessary objects to support DDL Replication
This section lists the scripts that you need to use to create all necessary objects to support DDL Replication. You need to run the scripts specified in this section on both Site A and Site B.

Open up a Windows command prompt and navigate to the Oracle GoldenGate folder, such as C:\\OracleGG. Start SQL\*Plus command prompt with database administrator privileges, such as using **SYSDBA** on Site A and Site B.

Then, run the following scripts:
	
	SQL> @marker_setup.sql  
	Enter GoldenGate schema name: ggate
	SQL> @ddl_setup.sql  
	Enter GoldenGate schema name: ggate
	SQL> @role_setup.sql 
	Enter GoldenGate schema name: ggate
	SQL> grant ggs_ggsuser_role to ggate;
	 Grant succeeded.
	 SQL> @ddl_enable
	 Trigger altered.
	 SQL> @ddl_pin ggate


Oracle GoldenGate tool requires a table level login for DDL (data definition language) support. That’s why, enable supplemental logging at the table level by using the ADD TRANDATA command. Open up Oracle GoldenGate Command interpreter window, login to database, and then run the ADD TRANDATA command:

	GGSCI 5> DBLOGIN USERID ggate, PASSWORD ggate

	GGSCI(Hostname) 6> add trandata scott.inventory

##4. Configure GoldenGate Manager on Site A and Site B
The Oracle GoldenGate Manager performs a number of functions like starting the other GoldenGate processes, trail log file management and reporting.

You need to configure the Oracle GoldenGate Manager process on both Site A and Site B. To do this, perform the following steps on Site A and Site B.

Open Windows command window and initiate the Oracle GoldenGate command interpreter:

	cd C:\OracleGG\
	c:\OracleGG>ggsci
	Oracle GoldenGate Command Interpreter for Oracle
	Version 11.2.1.0.3 14400833 OGGCORE_11.2.1.0.3_PLATFORMS_120823.1258
	Windows x64 (optimized), Oracle 11g on Aug 23 2012 16:50:36
	Copyright (C) 1995, 2012, Oracle and/or its affiliates. All rights reserved.


Logs the GGSCI session into a database so that you can execute commands that affect the database:

	GGSCI (HostName) 1> DBLOGIN USERID ggate, PASSWORD ggate
	Successfully logged into database.

Display the status and lag (where relevant) for all Manager, Extract, and Replicat processes on a system:

	GGSCI (HostName) 2> info all
	Program     Status      Group       Lag           Time Since Chkpt
	MANAGER     STOPPED

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (HostName) 3> edit params mgr
	PORT 7809
	USERID ggate, PASSWORD ggate
	PURGEOLDEXTRACTS  C:\OracleGG\dirdat\ex, USECHECKPOINTS

Display the status and lag (where relevant) for all Manager, Extract, and Replicat processes on a system:

	GGSCI (HostName) 46> info all
	Program     Status      Group       Lag           Time Since Chkpt
	MANAGER     STOPPED

Logs the GGSCI session into a database so that you can execute commands that affect the database:

	GGSCI (HostName) 47> dblogin USERID ggate, PASSWORD ggate

	Successfully logged into database.

Start the manager process:

	GGSCI (HostName) 48> start manager
	Manager started.

##5. Create Extract Group and Data Pump processes on Site A and Site B

###Create Extract and Data Pump processes on Site A

You need to create the Extract and Data Pump processes on Site A and Site B. 
Remote desktop to Site A and Site B via the Management Portal. Open up GGSCI command interpreter window. Run the following commands on Site A:

	GGSCI (MachineGG1) 14> add extract ext1 tranlog begin now
	EXTRACT added.
	GGSCI (MachineGG1) 4> add exttrail C:\OracleGG\dirdat\lt, extract ext1
	EXTTRAIL added.
	GGSCI (MachineGG1) 16> add extract dpump1 exttrailsource C:\OracleGG\dirdat\aa
	EXTRACT added.
	GGSCI (MachineGG1) 17> add rmttrail C:\OracleGG\dirdat\ab extract dpump1
	RMTTRAIL added.

Open the parameter file using the EDIT PARAMS command and then append the following information:
	GGSCI (MachineGG1) 18> edit params ext1
	EXTRACT ext1
	 USERID ggate, PASSWORD ggate
	 EXTTRAIL C:\OracleGG\dirdat\aa
	 TRANLOGOPTIONS EXCLUDEUSER ggate
	 TABLE scott.inventory,
	 GETBEFORECOLS (
	 ON UPDATE KEYINCLUDING (prod_category,qty_in_stock, last_dml),
	 ON DELETE KEYINCLUDING (prod_category,qty_in_stock, last_dml));

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (MachineGG1) 15> edit params dpump1
	EXTRACT dpump1
	 USERID ggate, PASSWORD ggate
	 RMTHOST ActiveGG2orcldb, MGRPORT 7809, TCPBUFSIZE 100000
	 RMTTRAIL C:\OracleGG\dirdat\ab
	 PASSTHRU
	 TABLE scott.inventory;

###Create a GoldenGate checkpoint table on Site B

Next, you need to add a checkpoint table on Site B. To do this, you need to open up a GoldenGate command interpreter window and run:

	C:\OracleGG\ggsci
	GGSCI (MachineGG2) 1> DBLOGIN USERID ggate, PASSWORD ggate
	Successfully logged into database.

And then, add the checkpoint table to the database, where ggate is the owner:
	
	GGSCI (MachineGG2) 2> ADD CHECKPOINTTABLE ggate.checkpointtable
	Successfully created checkpoint table ggate.checkpointtable.

Add the name of the check point table to the GLOBALS file on the target server, which is Site B in this step. Edit the GLOBALS file on Site B:

	GGSCI (MachineGG2) 1> EDIT PARAMS ./GLOBALS

Then, append the CHECKPOINTTABLE parameter to the existing GLOBALS file:

	GGSCHEMA ggate
	CHECKPOINTTABLE ggate.checkpointtable

As a final step, save and close the GLOBALS parameter file.


###Add REPLICAT on Site B
This section describes how to add a REPLICAT process “REP2” on Site B.
 
Use ADD REPLICAT command to create a Replicat group on Site B:

	GGSCI (MachineGG2) 37> add replicat rep2 exttrail C:\OracleGG\dirdatab, checkpointtable ggate.checkpointtable

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (MachineGG2) 10> edit params rep2
	REPLICAT rep2
	ASSUMETARGETDEFS
	USERID ggate, PASSWORD ggate
	DISCARDFILE C:\OracleGG\dirdat\discard.txt, append,megabytes 10
	MAP scott.inventory, TARGET scott.inventory;

###Create Extract and Data Pump processes on Site B

This section describes how to create a new extract process “EXT2” and a new data pump process “DPUMP2” on Site B:

	GGSCI (MachineGG2) 3> add extract ext2 tranlog begin now
	 EXTRACT added.
	GGSCI (MachineGG2) 4> add exttrail C:\OracleGG\dirdat\ac extract ext2
	 EXTTRAIL added.
	GGSCI (MachineGG2) 5> add extract dpump2 exttrailsource C:\OracleGG\dirdat\ac
	 EXTRACT added.
	GGSCI (MachineGG2) 6> add rmttrail C:\OracleGG\dirdat\ad extract dpump2
	 RMTTRAIL added.

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (MachineGG2) 31> edit params ext2
	EXTRACT ext2
	USERID ggate, PASSWORD ggate
	EXTTRAIL C:\OracleGG\dirdat\ac
	TRANLOGOPTIONS EXCLUDEUSER ggate
	TABLE scott.inventory,
	GETBEFORECOLS (
	ON UPDATE KEYINCLUDING (prod_category,qty_in_stock, last_dml),
	ON DELETE KEYINCLUDING (prod_category,qty_in_stock, last_dml));

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (MachineGG2) 32> edit params dpump2
	EXTRACT dpump2
	USERID ggate, PASSWORD ggate
	RMTHOST MachineGG1, MGRPORT 7809, TCPBUFSIZE 100000
	RMTTRAIL C:\OracleGG\dirdat\ad
	PASSTHRU
	TABLE scott.inventory;

###Create a GoldenGate checkpoint table on Site A

Open up Oracle GoldenGate command interpreter window and create a checkpoint table:

	GGSCI (MachineGG1) 1> DBLOGIN USERID ggate, PASSWORD ggate
	Successfully logged into database.

	GGSCI (MachineGG1) 2> ADD CHECKPOINTTABLE ggate.checkpointtable

	Successfully created checkpoint table ggate.checkpointtable.

You also need to add the name of the check point table to the GLOBALS file on Site A. 

Open up Oracle GoldenGate command interpreter window and edit the GLOBALS file on Site A:

	GGSCI (MachineGG1) 1> EDIT PARAMS ./GLOBALS
	Add the CHECKPOINTTABLE parameter to the existing GLOBALS file as follows:
	GGSCHEMA ggate
	CHECKPOINTTABLE ggate.checkpointtable

Save and close the GLOBALS parameter file.

###Add REPLICAT on Site A

This section describes how to add a REPLICAT process “REP1” on Site A. 

The following command creates a Replicat group rep1 with the name of a trail, and the associated checkpointtable.

	GGSCI (MachineGG1) 21> add replicat rep1 exttrail C:\OracleGG\dirdat\ad,checkpointtable ggate.checkpointtable
	 REPLICAT added.

Open the parameter file using the EDIT PARAMS command and then append the following information:

	GGSCI (MachineGG1) 10> edit params rep1
	REPLICAT rep1
	ASSUMETARGETDEFS
	USERID ggate, PASSWORD ggate
	DISCARDFILE C:\OracleGG\dirdat\discard.txt, append, megabytes 10
	MAP scott.inventory, TARGET scott.inventory;

### Add trandata on Site A and Site B

Enable supplemental logging at the table level by using the ADD TRANDATA command. Open up Oracle GoldenGate Command interpreter window, login to database, and then run the ADD TRANDATA command.

Remote desktop to MachineGG1, open up Oracle GoldenGate command interpreter, and run:

	GGSCI (MachineGG1) 11> dblogin userid ggate password ggate
	 Successfully logged into database.
	GGSCI (MachineGG1) 12> add trandata scott.inventory cols (prod_category,qty_in_stock, last_dml)
	GGSCI (MachineGG1) 13> info trandata scott.inventory
	Logging of supplemental redo log data is enabled for table SCOTT.INVENTORY.
	Columns supplementally logged for table SCOTT.INVENTORY: PROD_ID, PROD_CATEGORY, QTY_IN_STOCK, LAST_DML.
		
Remote desktop to MachineGG2, open up Oracle GoldenGate command interpreter, and run:

	GGSCI (MachineGG2) 18> dblogin userid ggate password ggate
	 Successfully logged into database.
	GGSCI (MachineGG2) 14> add trandata scott.inventory cols (prod_category,qty_in_stock, last_dml)
	Logging of supplemental redo data enabled for table SCOTT.INVENTORY.

Display information about the state of table-level supplemental logging:

	GGSCI (MachineGG2) 15> info trandata scott.inventory
	Logging of supplemental redo log data is enabled for table SCOTT.INVENTORY.
	Columns supplementally logged for table SCOTT.INVENTORY: PROD_ID, PROD_CATEGORY, QTY_IN_STOCK, LAST_DML.

###Add trandata on Site A and Site B

Enable supplemental logging at the table level by using the ADD TRANDATA command. Open up Oracle GoldenGate Command interpreter window, login to database, and then run the ADD TRANDATA command. 

Remote desktop to MachineGG1, open up Oracle GoldenGate command interpreter, and run:

	GGSCI (MachineGG1) 11> dblogin userid ggate password ggate
	 Successfully logged into database.
	GGSCI (MachineGG1) 12> add trandata scott.inventory cols (prod_category,qty_in_stock, last_dml)
	GGSCI (MachineGG1) 13> info trandata scott.inventory
	Logging of supplemental redo log data is enabled for table SCOTT.INVENTORY.
	Columns supplementally logged for table SCOTT.INVENTORY: PROD_ID, PROD_CATEGORY, QTY_IN_STOCK, LAST_DML.

Remote desktop to MachineGG2, open up Oracle GoldenGate command interpreter, and run:

	GGSCI (MachineGG2) 18> dblogin userid ggate password ggate
	 Successfully logged into database.
	GGSCI (MachineGG2) 14> add trandata scott.inventory cols (prod_category,qty_in_stock, last_dml)
	Logging of supplemental redo data enabled for table SCOTT.INVENTORY.
	Display information about the state of table-level supplemental logging:
	GGSCI (MachineGG2) 15> info trandata scott.inventory
	Logging of supplemental redo log data is enabled for table SCOTT.INVENTORY.
	Columns supplementally logged for table SCOTT.INVENTORY: PROD_ID, PROD_CATEGORY, QTY_IN_STOCK, LAST_DML.

###Start Extract and Data Pump processes on Site A

Start the Extract process ext1 on Site A:

	GGSCI (MachineGG1) 31> start extract ext1
	Sending START request to MANAGER …
	EXTRACT EXT1 starting

Start the data pump process dpump1 on Site A:

	GGSCI (MachineGG1) 23> start extract dpump1
	Sending START request to MANAGER …
	EXTRACT DPUMP1 starting
Display information about the Extract group ext1:
	GGSCI (MachineGG1) 32> info extract ext1
	EXTRACT    EXT1      Last Started 2013-11-25 08:03   Status RUNNING
	Checkpoint Lag       00:00:00 (updated 00:00:02 ago)
	Log Read Checkpoint  Oracle Redo Logs
	 2013-11-25 08:03:18  Seqno 6, RBA 3230720
	 SCN 0.1074371 (1074371)

Display the status and lag (where relevant) for all Manager, Extract, and Replicat processes on a system:

	GGSCI (MachineGG1) 16> info all
	Program     Status      Group       Lag at Chkpt  Time Since Chkpt
	
	MANAGER     RUNNING
	EXTRACT     RUNNING     DPUMP1      00:00:00      00:46:33
	EXTRACT     RUNNING     EXT1        00:00:00      00:00:04

###Start Extract and Data Pump processes on Site B

Start the Extract process ext2 on Site B:

	GGSCI (MachineGG2) 22> start extract ext2
	Sending START request to MANAGER …
	EXTRACT EXT2 starting

Start the data pump process dpump2 on Site B:

	GGSCI (MachineGG2) 23> start extract dpump2
	Sending START request to MANAGER …
	EXTRACT DPUMP2 starting

Display the status and lag (where relevant) for all Manager, Extract, and Replicat processes on a system:

	GGSCI (ActiveGG2orcldb) 6> info all
	Program     Status      Group       Lag at Chkpt  Time Since Chkpt
	
	MANAGER     RUNNING
	EXTRACT     RUNNING     DPUMP2      00:00:00      136:13:33
	EXTRACT     RUNNING     EXT2        00:00:00      00:00:04

### Start REPLICAT process on Site A

This section describes how to start the REPLICAT process “REP1” on Site A. 

Start the Replicat process on Site A:

	GGSCI (MachineGG1) 38> start replicat rep1
	Sending START request to MANAGER …
	REPLICAT REP1 starting

Display the status of a Replicat group:

	GGSCI (MachineGG1) 39> status replicat rep1
	 REPLICAT REP1: RUNNING

###Start REPLICAT process on Site B

This section describes how to start the REPLICAT process “REP2” on Site B. 

Start the Replicat process on Site B:

	GGSCI (MachineGG2) 26> start replicat rep2
	Sending START request to MANAGER …
	REPLICAT REP2 starting

Display the status of a Replicat group:

	GGSCI (MachineGG2) 27> status replicat rep2
	REPLICAT REP2: RUNNING

##6. Verify the bi-directional replication process

To verify the Oracle GoldenGate configuration, insert a row into the database at Site A. 
Remote Desktop to Site A. Open up SQL*Plus command window and run:
	SQL> select name from v$database;
	
	NAME
	———
	TESTGG
	
	SQL> insert into inventory values  (100,’TV’,100,sysdate);
	
	1 row created.
	
	SQL> commit;
	
	Commit complete.

Then, check if that row is replicated on Site B. To do this, remote desktop to Site B. Open up SQL Plus window and run:

	SQL> select name from v$database;
	
	NAME
	———
	TESTGG
	
	SQL> select * from inventory;
	
	PROD_ID PROD_CATEGORY QTY_IN_STOCK LAST_DML
	———- ——————– ———— ———
	100 TV 100 22-MAR-13

Insert a new record at Site B:

	SQL> insert into inventory  values  (101,’DVD’,10,sysdate);
	1 row created.
	
	SQL> commit;
	
	Commit complete.

Remote desktop to Site A and check if the replication has taken place:

	SQL> select * from inventory;
	
	PROD_ID PROD_CATEGORY QTY_IN_STOCK LAST_DML
	———- ——————– ———— ———
	100 TV 100 22-MAR-13
	101 DVD 10 22-MAR-13

##Additional Resources
[Oracle Virtual Machine images for Azure](virtual-machines-oracle-list-oracle-virtual-machine-images.md)
