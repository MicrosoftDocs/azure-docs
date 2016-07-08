<properties
	pageTitle="Configuring Oracle Data Guard in VMs | Microsoft Azure"
	description="Step through a tutorial for setting up and implementing Oracle Data Guard on Azure virtual machines for high availability and disaster recovery."
	services="virtual-machines-windows"
	authors="rickstercdn"
	manager="timlt"
	documentationCenter=""
	tags="azure-service-management"/>
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="infrastructure-services"
	ms.date="05/17/2016"
	ms.author="rclaus" />

#Configuring Oracle Data Guard for Azure


This tutorial demonstrates how to setup and implement Oracle Data Guard in Azure Virtual Machines environment for high availability and disaster recovery. The tutorial focuses on one way replication for non-RAC Oracle databases.

Oracle Data Guard supports data protection and disaster recovery for Oracle Database. It is a simple, high-performance, drop-in solution for disaster recovery, data protection, and high availability for the entire Oracle database.

This tutorial assumes that you already have theoretical and practical knowledge on Oracle Database High Availability and Disaster Recovery concepts. For information, see the [Oracle web site](http://www.oracle.com/technetwork/database/features/availability/index.html) and also the [Oracle Data Guard Concepts and Administration Guide](https://docs.oracle.com/cd/E11882_01/server.112/e41134/toc.htm).

In addition, the tutorial assumes that you have already implemented the following prerequisites:

- You’ve already reviewed the High Availability and Disaster Recovery Considerations section in the [Oracle Virtual Machine images - Miscellaneous Considerations](virtual-machines-windows-classic-oracle-considerations.md) topic. Note that Azure supports standalone Oracle Database instances but not Oracle Real Application Clusters (Oracle RAC) currently.


- You have created two Virtual Machines (VMs) in Azure using the same platform provided Oracle Enterprise Edition image. Make sure that the Virtual Machines are in the [same cloud service](virtual-machines-windows-load-balance.md) and in the same [Virtual Network](azure.microsoft.com/documentation/services/virtual-network/) to ensure they can access each other over the persistent private IP address. Additionally, it is recommended to place the VMs in the same [availability set](virtual-machines-windows-manage-availability.md) to allow Azure to place them into separate fault domains and upgrade domains. Note that Oracle Data Guard is only available with Oracle Database Enterprise Edition. Each machine must have at least 2 GB of memory and 5 GB of disk space. For the most up-to-date information on the platform provided VM sizes, see [Virtual Machine Sizes for Azure](virtual-machines-windows-sizes.md). If you need additional disk volume for your VMs, you can attach additional disks. For information, see [How to Attach a Data Disk to a Virtual Machine](virtual-machines-windows-classic-attach-disk.md).



- You’ve set the Virtual Machine names as “Machine1” for the primary VM and “Machine2” for the standby VM at the Azure classic portal.

- You’ve set the **ORACLE_HOME** environment variable to point to the same oracle root installation path in the primary and standby Virtual Machines, such as `C:\OracleDatabase\product\11.2.0\dbhome_1\database`.

- You log on to your Windows server as a member of the **Administrators** group or a member of the **ORA_DBA** group.

In this tutorial, you will:

Implement the physical standby database environment

1. Create a primary database

2. Prepare the primary database for standby database creation

	1. Enable forced logging

	2. Create a password file

	3. Configure a standby redo log

	4. Enable Archiving

	5. Set primary database initialization parameters

Create a physical standby database

1. Prepare an initialization parameter file for standby database

2. Configure the listener and tnsnames to support the database on primary and standby machines

	1. Configure listener.ora on both servers to hold entries for both databases

	2. Configure tnsnames.ora on the primary and standby Virtual Machines to hold entries for both primary and standby databases

	3. Start the listener and check tnsping on both Virtual Machines to both services.

3. Startup the standby instance in nomount state

4. Use RMAN to clone the database and to create a standby database

5. Start the physical standby database in managed recovery mode

6. Verify the physical standby database

> [AZURE.IMPORTANT] This tutorial has been setup and tested against the following hardware and software configuration:
>
>|                      | **Primary Database**                      | **Standby Database**                      |
>|----------------------|-------------------------------------------|-------------------------------------------|
>| **Oracle Release**   | Oracle11g Enterprise Release (11.2.0.4.0) | Oracle11g Enterprise Release (11.2.0.4.0) |
>| **Machine Name**     | Machine1                                  | Machine2                                  |
>| **Operating System** | Windows 2008 R2                           | Windows 2008 R2                           |
>| **Oracle SID**       | TEST                                      | TEST\_STBY                                |
>| **Memory**           | Min 2 GB                                  | Min 2 GB                                  |
>| **Disk Space**       | Min 5 GB                                  | Min 5 GB                                  |

For subsequent releases of Oracle Database and Oracle Data Guard, there might be some additional changes that you need to implement. For the most up-to-date version specific information, see [Data Guard](http://www.oracle.com/technetwork/database/features/availability/data-guard-documentation-152848.html) and [Oracle Database](http://www.oracle.com/us/corporate/features/database-12c/index.html) documentation at Oracle web site.

##Implement the physical standby database environment
### 1. Create a primary database

- Create a primary database “TEST” in the primary Virtual Machine. For information, see Creating and Configuring an Oracle Database.
- Connect to your database as the SYS user with SYSDBA role in the SQL*Plus command prompt and run the following statement to see the name of your database:

		SQL> select name from v$database;

		The result will display like the following:

		NAME
		---------
		TEST
- Next, query the names of the database files from the dba_data_files system view:

		SQL> select file_name from dba_data_files;
		FILE_NAME
		-------------------------------------------------------------------------------
		C:\ <YourLocalFolder>\TEST\USERS01.DBF
		C:\ <YourLocalFolder>\TEST\UNDOTBS01.DBF
		C:\ <YourLocalFolder>\TEST\SYSAUX01.DBF
		C:\<YourLocalFolder>\TEST\SYSTEM01.DBF
		C:\<YourLocalFolder>\TEST\EXAMPLE01.DBF

### 2. Prepare the primary database for standby database creation

Before creating a standby database, it’s recommended that you ensure the primary database is configured properly. The following is a list of steps that you need to perform:

1. Enable forced logging
2. Create a password file
3. Configure a standby redo log
4. Enable Archiving
5. Set primary database initialization parameters

#### Enable forced logging

In order to implement a Standby Database, we need to enable 'Forced Logging' in the primary database. This option ensures that even in the event that a 'nologging' operation is done, force logging takes precedence and all operations are logged into the redo logs. Therefore, we make sure that everything in the primary database is logged and replication to the standby includes all operations in the primary database. Run the alter database statement to enable force logging:

	SQL> ALTER DATABASE FORCE LOGGING;

	Database altered.

#### Create a password file

To be able to ship and apply archived logs from the Primary server to the Standby server, the sys password must be identical on both primary and standby servers. That’s why you create a password file on the primary database and copy it to the Standby server.

>[AZURE.IMPORTANT] When using Oracle Database 12c, there is a new user, **SYSDG**, which you can use to administer Oracle Data Guard. For more information, see [Changes in Oracle Database 12c Release](http://docs.oracle.com/database/121/UNXAR/release_changes.htm#UNXAR404).

In addition, make sure that the ORACLE\_HOME environment is already defined in Machine1. If not, define it as an environment variable using the Environment Variables dialog box. To access this dialog box, start the **System** utility by double-clicking the System icon in the **Control Panel**; then click the **Advanced** tab and choose **Environment Variables**. Click the **New** button under the **System Variables** to set the environment variables. After setting up the environment variables, close the existing Windows command prompt and open up a new one.

Run the following statement to switch to the Oracle\_Home directory, such as C:\\OracleDatabase\\product\\11.2.0\\dbhome\_1\\database.

	cd %ORACLE_HOME%\database

Then, create a password file using the password file creation utility, [ORAPWD](http://docs.oracle.com/cd/B28359_01/server.111/b28310/dba007.htm). In the same Windows command prompt in Machine1, run the following command by setting the password value as the password of **SYS**:

	ORAPWD FILE=PWDTEST.ora PASSWORD=password FORCE=y

This command creates a password file, named as PWDTEST.ora, in the ORACLE\_HOME\\database directory. You should copy this file to %ORACLE\_HOME%\\database directory in Machine2 manually.

#### Configure a standby redo log

Then, you need to configure a Standby Redo Log so that the primary can correctly receive the redo when it becomes a standby. Pre-creating them here also allows the standby redo logs to be automatically created on the standby. It is important to configure the Standby Redo Logs (SRL) with the same size as the online redo logs. The size of the current standby redo log files must exactly match the size of the current primary database online redo log files.

Run the following statement in the SQL\*PLUS command prompt in Machine1. The v$logfile is a system view that contains information about redo log files.

	SQL> select * from v$logfile;
	GROUP# STATUS  TYPE    MEMBER                                                       IS_
	---------- ------- ------- ------------------------------------------------------------ ---
	3         ONLINE  C:\<YourLocalFolder>\TEST\REDO03.LOG               NO
	2         ONLINE  C:\<YourLocalFolder>\TEST\REDO02.LOG               NO
	1         ONLINE  C:\<YourLocalFolder>\TEST\REDO01.LOG               NO
	Next, query the v$log system view, displays log file information from the control file.
	SQL> select bytes from v$log;
	BYTES
	----------
	52428800
	52428800
	52428800


Note that 52428800 is 50 megabytes.

Then, in the SQL\*Plus window, run the following statements to add a new standby redo log file group to a standby database and specify a number that identifies the group using the GROUP clause. Using group numbers can make administering standby redo log file groups easier:

	SQL> ALTER DATABASE ADD STANDBY LOGFILE GROUP 4 'C:\<YourLocalFolder>\TEST\REDO04.LOG' SIZE 50M;
	Database altered.
	SQL> ALTER DATABASE ADD STANDBY LOGFILE GROUP 5 'C:\<YourLocalFolder>\TEST\REDO05.LOG' SIZE 50M;
	Database altered.
	SQL> ALTER DATABASE ADD STANDBY LOGFILE GROUP 6 'C:\<YourLocalFolder>\TEST\REDO06.LOG' SIZE 50M;
	Database altered.

Next, run the following system view to list information about redo log files. This operation also verifies that the standby redo log file groups were created:

	SQL> select * from v$logfile;
	GROUP# STATUS  TYPE MEMBER IS_
	---------- ------- ------- --------------------------------------------- ---
	3         ONLINE C:\<YourLocalFolder>\TEST\REDO03.LOG NO
	2         ONLINE C:\<YourLocalFolder>\TEST\REDO02.LOG NO
	1         ONLINE C:\<YourLocalFolder>\TEST\REDO01.LOG NO
	4         STANDBY C:\<YourLocalFolder>\TEST\REDO04.LOG
	5         STANDBY C:\<YourLocalFolder>\TEST\REDO05.LOG NO
	6         STANDBY C:\<YourLocalFolder>\TEST\REDO06.LOG NO
	6 rows selected.

#### Enable Archiving

Then, enable archiving by running the following statements to put the primary database in ARCHIVELOG mode and enable automatic archiving. You can enable archive log mode by mounting the database and then executing the archivelog command.

First, log in as sysdba. In the Windows command prompt, run:

	sqlplus /nolog

	connect / as sysdba

Then, shutdown the database in the SQL\*Plus command prompt:

	SQL> shutdown immediate;
	Database closed.
	Database dismounted.
	ORACLE instance shut down.

Then, execute the startup mount command to mount the database. This ensures that Oracle associates the instance with the specified database.

	SQL> startup mount;
	ORACLE instance started.
	Total System Global Area 1503199232 bytes
	Fixed Size                  2281416 bytes
	Variable Size             922746936 bytes
	Database Buffers          570425344 bytes
	Redo Buffers                7745536 bytes
	Database mounted.

Then, run:

	SQL> alter database archivelog;
	Database altered.

Then, run the Alter database statement with the Open clause to make the database available for normal use:

	SQL> alter database open;

	Database altered.

#### Set primary database initialization parameters

To configure the Data Guard, you need to create and configure the standby parameters on a regular pfile (text initialization parameter file) first. When the pfile is ready, you need to convert it to a server parameter file (SPFILE).

You can control the Data Guard environment using the parameters in the INIT.ORA file. When following this tutorial, you need to update the Primary database INIT.ORA so that it can hold both roles: Primary or Standby.

	SQL> create pfile from spfile;
	File created.

Next, you need to edit the pfile to add the standby parameters. To do this, open the INITTEST.ORA file in the location of %ORACLE\_HOME%\\database. Next, append the following statements to the INITTEST.ora file. Note that the naming convention for your INIT.ORA file is INIT\<YourDatabaseName\>.ORA.

	db_name='TEST'
	db_unique_name='TEST'
	LOG_ARCHIVE_CONFIG='DG_CONFIG=(TEST,TEST_STBY)'
	LOG_ARCHIVE_DEST_1= 'LOCATION=C:\OracleDatabase\archive   VALID_FOR=(ALL_LOGFILES,ALL_ROLES) DB_UNIQUE_NAME=TEST'
	LOG_ARCHIVE_DEST_2= 'SERVICE=TEST_STBY LGWR ASYNC VALID_FOR=(ONLINE_LOGFILES,PRIMARY_ROLE) DB_UNIQUE_NAME=TEST_STBY'
	LOG_ARCHIVE_DEST_STATE_1=ENABLE
	LOG_ARCHIVE_DEST_STATE_2=ENABLE
	REMOTE_LOGIN_PASSWORDFILE=EXCLUSIVE
	LOG_ARCHIVE_FORMAT=%t_%s_%r.arc
	LOG_ARCHIVE_MAX_PROCESSES=30
	# Standby role parameters --------------------------------------------------------------------
	fal_server=TEST_STBY
	fal_client=TEST
	standby_file_management=auto
	db_file_name_convert='TEST_STBY','TEST'
	log_file_name_convert='TEST_STBY','TEST'
	# ---------------------------------------------------------------------------------------------


The previous statement block includes three important setup items:
-	**LOG_ARCHIVE_CONFIG...:** You define the unique database ids using this statement.
-	**LOG_ARCHIVE_DEST_1...:** You define the local archive folder location using this statement. We recommend that you create a new directory for your database’s archiving needs and specify the local archive location using this statement explicitly rather than using Oracle’s default folder %ORACLE_HOME%\database\archive.
-	**LOG_ARCHIVE_DEST_2 .... LGWR ASYNC...:** You define an asynchronous log writer process (LGWR) to collect transaction redo data and transmit it to standby destinations. Here, the DB_UNIQUE_NAME specifies a unique name for the database at the destination standby server.

Once the new parameter file is ready, you need to create the spfile from it.

First, shutdown the database:

	SQL> shutdown immediate;

	Database closed.

	Database dismounted.

	ORACLE instance shut down.

Next, run startup nomount command as follows:

	SQL> startup nomount pfile='c:\OracleDatabase\product\11.2.0\dbhome_1\database\initTEST.ora';
	ORACLE instance started.
	Total System Global Area 1503199232 bytes
	Fixed Size                  2281416 bytes
	Variable Size             922746936 bytes
	Database Buffers          570425344 bytes
	Redo Buffers                7745536 bytes

Now, create a spfile:

	SQL>create spfile frompfile='c:\OracleDatabase\product\11.2.0\dbhome\_1\database\initTEST.ora';

	File created.

Then, shutdown the database:

	SQL> shutdown immediate;

	ORA-01507: database not mounted

Then, use the startup command to start an instance:

	SQL> startup;
	ORACLE instance started.
	Total System Global Area 1503199232 bytes
	Fixed Size                  2281416 bytes
	Variable Size             922746936 bytes
	Database Buffers          570425344 bytes
	Redo Buffers                7745536 bytes
	Database mounted.
	Database opened.

##Create a physical standby database
This section focuses on the steps that you must perform in Machine2 to prepare the physical standby database.

First, you need to remote desktop to Machine2 via the Azure classic portal.

Then, on the Standby Server (Machine2), create all the necessary folders for the standby database, such as C:\\\<YourLocalFolder\>\\TEST. While following this tutorial, make sure that the folder structure matches the folder structure on Machine1 to keep all the necessary files, such as controlfile, datafiles, redologfiles, udump, bdump and cdump files. In addition, define the ORACLE\_HOME and ORACLE\_BASE environment variables in Machine2. If not, define them as an environment variable using the Environment Variables dialog box. To access this dialog box, start the **System** utility by double-clicking the System icon in the **Control Panel**; then click the **Advanced** tab and choose **Environment Variables**. Click the **New** button under the **System Variables** to set the environment variables. After setting up the environment variables, you need to close the existing Windows command prompt and open up a new one to see the changes.

Next, follow these steps:

1. Prepare an initialization parameter file for standby database

2. Configure the listener and tnsnames to support the database on primary and standby machines

	1. Configure listener.ora on both servers to hold entries for both databases

	2. Configure tnsnames.ora on the primary and standby Virtual Machines to hold entries for both primary and standby databases

	3. Start the listener and check tnsping on both Virtual Machines to both services.

3. Startup the standby instance in nomount state

4. Use RMAN to clone the database and to create a standby database

5. Start the physical standby database in managed recovery mode

6. Verify the physical standby database

### 1. Prepare an initialization parameter file for standby database

This section demonstrates how to prepare an initialization parameter file for the standby database. To do this, first copy the INITTEST.ORA file from Machine 1 to Machine2 manually. You should be able to see the INITTEST.ORA file in the %ORACLE\_HOME%\\database folder in both machines. Then, modify the INITTEST.ora file in Machine2 to set it up for the standby role as specified below:

	db_name='TEST'
	db_unique_name='TEST_STBY'
	db_create_file_dest='c:\OracleDatabase\oradata\test_stby’
	db_file_name_convert=’TEST’,’TEST_STBY’
	log_file_name_convert='TEST','TEST_STBY'


	job_queue_processes=10
	LOG_ARCHIVE_CONFIG='DG_CONFIG=(TEST,TEST_STBY)'
	LOG_ARCHIVE_DEST_1='LOCATION=c:\OracleDatabase\TEST_STBY\archives VALID_FOR=(ALL_LOGFILES,ALL_ROLES) DB_UNIQUE_NAME=’TEST'
	LOG_ARCHIVE_DEST_2='SERVICE=TEST LGWR ASYNC VALID_FOR=(ONLINE_LOGFILES,PRIMARY_ROLE)
	LOG_ARCHIVE_DEST_STATE_1='ENABLE'
	LOG_ARCHIVE_DEST_STATE_2='ENABLE'
	LOG_ARCHIVE_FORMAT='%t_%s_%r.arc'
	LOG_ARCHIVE_MAX_PROCESSES=30


The previous statement block includes two important setup items:

-	**\*.LOG_ARCHIVE_DEST_1:** You need to create the c:\OracleDatabase\TEST_STBY\archives folder in Machine2 manually.
-	**\*.LOG_ARCHIVE_DEST_2:** This is an optional step. You set this as it might be needed when the primary machine is in maintenance and the standby machine becomes a primary database.

Then, you need to start the standby instance. On the standby database server, enter the following command at a Windows command prompt to create an Oracle instance by creating a new Windows service:

	oradim -NEW -SID TEST\_STBY -STARTMODE MANUAL

Note that the **Oradim** command creates an Oracle instance but does not start it. You can find it in the C:\\OracleDatabase\\product\\11.2.0\\dbhome\_1\\BIN directory.

##Configure the listener and tnsnames to support the database on primary and standby machines
Before you create a standby database, you need to make sure that the primary and standby databases in your configuration can talk to each other. To do this, you need to configure both the listener and TNSNames either manually or by using the network configuration utility NETCA. This is a mandatory task when you use the Recovery Manager utility (RMAN).

### Configure listener.ora on both servers to hold entries for both databases

Remote desktop to Machine1 and edit the listener.ora file as specified below. When you edit the listener.ora file, always make sure that the opening and closing parenthesis line up in the same column. You can find the listener.ora file in the following folder: c:\\OracleDatabase\\product\\11.2.0\\dbhome\_1\\NETWORK\\ADMIN\\.

	# listener.ora Network Configuration File: C:\OracleDatabase\product\11.2.0\dbhome_1\network\admin\listener.ora

	# Generated by Oracle configuration tools.

	SID_LIST_LISTENER =
	  (SID_LIST =
	    (SID_DESC =
	      (SID_NAME = test)
	      (ORACLE_HOME = C:\OracleDatabase\product\11.2.0\dbhome_1)
	      (PROGRAM = extproc)
	      (ENVS = "EXTPROC_DLLS=ONLY:C:\OracleDatabase\product\11.2.0\dbhome_1\bin\oraclr11.dll")
	    )
	  )

	LISTENER =
	  (DESCRIPTION_LIST =
	    (DESCRIPTION =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE1)(PORT = 1521))
	      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
	    )
	  )

Next, remote desktop to Machine2 and edit the listener.ora file as follows:
	# listener.ora Network Configuration File: C:\OracleDatabase\product\11.2.0\dbhome_1\network\admin\listener.ora

	# Generated by Oracle configuration tools.

	SID_LIST_LISTENER =
	  (SID_LIST =
	    (SID_DESC =
	      (SID_NAME = test_stby)
	      (ORACLE_HOME = C:\OracleDatabase\product\11.2.0\dbhome_1)
	      (PROGRAM = extproc)
	      (ENVS = "EXTPROC_DLLS=ONLY:C:\OracleDatabase\product\11.2.0\dbhome_1\bin\oraclr11.dll")
	    )
	  )

	LISTENER =
	  (DESCRIPTION_LIST =
	    (DESCRIPTION =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE2)(PORT = 1521))
	      (ADDRESS = (PROTOCOL = IPC)(KEY = EXTPROC1521))
	    )
	  )


### Configure tnsnames.ora on the primary and standby Virtual Machines to hold entries for both primary and standby databases

Remote desktop to Machine1 and edit the tnsnames.ora file as specified below. You can find the tnsnames.ora file in the following folder: c:\\OracleDatabase\\product\\11.2.0\\dbhome\_1\\NETWORK\\ADMIN\\.

	TEST =
	  (DESCRIPTION =
	    (ADDRESS_LIST =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE1)(PORT = 1521))
	    )
	    (CONNECT_DATA =
	      (SERVICE_NAME = test)
	    )
	  )

	TEST_STBY =
	  (DESCRIPTION =
	    (ADDRESS_LIST =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE2)(PORT = 1521))
	    )
	    (CONNECT_DATA =
	      (SERVICE_NAME = test_stby)
	    )
	  )

Remote desktop to Machine2 and edit the tnsnames.ora file as follows:

	TEST =
	  (DESCRIPTION =
	    (ADDRESS_LIST =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE1)(PORT = 1521))
	    )
	    (CONNECT_DATA =
	      (SERVICE_NAME = test)
	    )
	  )

	TEST_STBY =
	  (DESCRIPTION =
	    (ADDRESS_LIST =
	      (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE2)(PORT = 1521))
	    )
	    (CONNECT_DATA =
	      (SERVICE_NAME = test_stby)
	    )
	  )


### Start the listener and check tnsping on both Virtual Machines to both services.

Open up a new Windows command prompt in both primary and standby Virtual Machines and run the following statements:

	C:\Users\DBAdmin>tnsping test

	TNS Ping Utility for 64-bit Windows: Version 11.2.0.1.0 - Production on 14-NOV-2013 06:29:08
	Copyright (c) 1997, 2010, Oracle.  All rights reserved.
	Used parameter files:
	C:\OracleDatabase\product\11.2.0\dbhome_1\network\admin\sqlnet.ora
	Used TNSNAMES adapter to resolve the alias
	Attempting to contact (DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE1)(PORT = 1521))) (CONNECT_DATA = (SER
	VICE_NAME = test)))
	OK (0 msec)


	C:\Users\DBAdmin>tnsping test_stby

	TNS Ping Utility for 64-bit Windows: Version 11.2.0.1.0 - Production on 14-NOV-2013 06:29:16
	Copyright (c) 1997, 2010, Oracle.  All rights reserved.
	Used parameter files:
	C:\OracleDatabase\product\11.2.0\dbhome_1\network\admin\sqlnet.ora
	Used TNSNAMES adapter to resolve the alias
	Attempting to contact (DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = MACHINE2)(PORT = 1521))) (CONNECT_DATA = (SER
	VICE_NAME = test_stby)))
	OK (260 msec)


##Startup the standby instance in nomount state
You need to set up the environment to support the standby database on the standby Virtual Machine (MACHINE2).

First, copy the password file from the primary machine (Machine1) to the standby machine (Machine2) manually. This is necessary as the **sys** password must be identical on both machines.

Then, open the Windows command prompt in Machine2, and setup the environment variables to point to the Standby database as follows:

	SET ORACLE_HOME=C:\OracleDatabase\product\11.2.0\dbhome_1
	SET ORACLE_SID=TEST_STBY

Next, start the Standby database in nomount state and then generate an spfile.

Start the database:

	SQL>shutdown immediate;

	SQL>startup nomount
	ORACLE instance started.

	Total System Global Area  747417600 bytes
	Fixed Size                  2179496 bytes
	Variable Size             473960024 bytes
	Database Buffers          264241152 bytes
	Redo Buffers                7036928 bytes


##Use RMAN to clone the database and to create a standby database
You can use the Recovery Manager utility (RMAN) to take any backup copy of the primary database to create the physical standby database.

Remote desktop to the standby Virtual Machine (MACHINE2) and run the RMAN utility by specifying a full connection string for both the TARGET (primary database, Machine1) and AUXILLARY (standby database, Machine2) instances.

>[AZURE.IMPORTANT] Do not use the operating system authentication as there is no database in the standby server machine yet.

	C:\> RMAN TARGET sys/password@test AUXILIARY sys/password@test_STBY

	RMAN>DUPLICATE TARGET DATABASE
	  FOR STANDBY
	  FROM ACTIVE DATABASE
	  DORECOVER
	    NOFILENAMECHECK;

##Start the physical standby database in managed recovery mode
This tutorial demonstrates how to create a physical standby database. For information on creating a logical standby database, see the Oracle documentation.

Open up SQL\*Plus command prompt and enable the Data Guard on the standby Virtual Machine or server (MACHINE2) as follows:

	SHUTDOWN IMMEDIATE;
	STARTUP MOUNT;
	ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;

When you open the standby database in **MOUNT** mode, the archive log shipping continues and the managed recovery process continues log applying on the standby database. This ensures that the standby database remains up-to-date with the primary database. Note that the standby database cannot be accessible for reporting purposes during this time.

When you open the standby database in **READ ONLY** mode, the archive log shipping continues. But the managed recovery process stops. This causes the standby database to become increasingly out of date until the managed recovery process is resumed. You can access the standby database for reporting purposes during this time but data may not reflect the latest changes.

In general, we recommend that you keep the standby database in **MOUNT** mode to keep the data in the standby database up-to-date in case of failure of the primary database. However, you can keep the standby database in **READ ONLY** mode for reporting purposes depending on your application’s requirements. The following steps demonstrate how to enable the Data Guard in read-only mode using SQL\*Plus:

	SHUTDOWN IMMEDIATE;
	STARTUP MOUNT;
	ALTER DATABASE OPEN READ ONLY;


##Verify the physical standby database
This section demonstrates how to verify the high availability configuration as an administrator.

Open up SQL\*Plus command prompt window and check archived redo log on the Standby Virtual Machine (Machine2):

	SQL> show parameters db_unique_name;

	NAME                                TYPE       VALUE
	------------------------------------ ----------- ------------------------------
	db_unique_name                      string     TEST_STBY

	SQL> SELECT NAME FROM V$DATABASE

	SQL> SELECT SEQUENCE#, FIRST_TIME, NEXT_TIME, APPLIED FROM V$ARCHIVED_LOG ORDER BY SEQUENCE#;

	SEQUENCE# FIRST_TIM NEXT_TIM APPLIED
	----------------  ---------------  --------------- ------------
	45                    23-FEB-14   23-FEB-14   YES
	45                    23-FEB-14   23-FEB-14   NO
	46                    23-FEB-14   23-FEB-14   NO
	46                    23-FEB-14   23-FEB-14   YES
	47                    23-FEB-14   23-FEB-14   NO
	47                    23-FEB-14   23-FEB-14   NO

Open up SQL*Plus command prompt window and switch logfiles on the Primary machine (Machine1):

	SQL> alter system switch logfile;
	System altered.

	SQL> archive log list
	Database log mode              Archive Mode
	Automatic archival             Enabled
	Archive destination            C:\OracleDatabase\archive
	Oldest online log sequence     69
	Next log sequence to archive   71
	Current log sequence           71

Check archived redo log on the Standby Virtual Machine (Machine2):

	SQL> SELECT SEQUENCE#, FIRST_TIME, NEXT_TIME, APPLIED FROM V$ARCHIVED_LOG ORDER BY SEQUENCE#;

	SEQUENCE# FIRST_TIM NEXT_TIM APPLIED
	----------------  ---------------  --------------- ------------
	45                    23-FEB-14   23-FEB-14   YES
	46                    23-FEB-14   23-FEB-14   YES
	47                    23-FEB-14   23-FEB-14   YES
	48                    23-FEB-14   23-FEB-14   YES

	49                    23-FEB-14   23-FEB-14   YES
	50                    23-FEB-14   23-FEB-14   IN-MEMORY

Check for any gap on the Standby Virtual Machine (Machine2):

	SQL> SELECT * FROM V$ARCHIVE_GAP;
	no rows selected.

Another verification method could be to failover to the standby database and then test if it is possible to failback to the primary database. To activate the standby database as a primary database, use the following statements:

	SQL> ALTER DATABASE RECOVER MANAGED STANDBY DATABASE FINISH;
	SQL> ALTER DATABASE ACTIVATE STANDBY DATABASE;

If you have not enabled flashback on the original primary database, it’s recommended that you drop the original primary database and recreate as a standby database.

We recommend that you enable flashback database on the primary and the standby databases. When a failover happens, the primary database can be flashed back to the time before the failover and quickly converted to a standby database.

##Additional Resources
[Oracle Virtual Machine images for Azure](virtual-machines-windows-classic-oracle-images.md)
