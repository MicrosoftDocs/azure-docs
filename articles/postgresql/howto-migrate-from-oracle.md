---
title: Migrate from Oracle 
titleSuffix: Azure Database for PostgreSQL
description: This guide teaches you to migrate your Oracle schema to Azure Database for PostgreSQL. 
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.subservice: migration-guide
ms.topic: how-to
ms.date: 03/18/2021
---

# Migrate Oracle to Azure Database for PostgreSQL

This guide teaches you to migrate your Oracle schema to Azure Database for PostgreSQL. 

For detailed and comprehensive migration guidance, see the [Migration guide resources](https://github.com/microsoft/OrcasNinjaTeam/blob/master/Oracle%20to%20PostgreSQL%20Migration%20Guide/Oracle%20to%20Azure%20Database%20for%20PostgreSQL%20Migration%20Guide.pdf). 

## Prerequisites

To migrate your Oracle schema to Azure Database for PostgreSQL, you need to: 

- Verify your source environment is supported. 
- Download the latest version of [ora2pg](https://ora2pg.darold.net/). 
- The latest version of the [DBD module](https://www.cpan.org/modules/by-module/DBD/). 


## Overview

PostgreSQL is one of world's most advanced open-source databases. This article describes how to use the free ora2pg tool to migrate an Oracle database to PostgreSQL. You can use ora2pg to migrate an Oracle or MySQL database to a PostgreSQL-compatible schema. 

The ora2pg tool connects your Oracle database, scans it automatically, and extracts its structure or data. Then ora2pg generates SQL scripts that you can load into your PostgreSQL database. You can use ora2pg for tasks such as reverse-engineering an Oracle database, migrating a huge enterprise database, or simply replicating some Oracle data into a PostgreSQL database. The tool is easy to use and requires no Oracle database knowledge besides the ability to provide the parameters needed to connect to the Oracle database.

> [!NOTE]
> For more information about using the latest version of ora2pg, see the [ora2pg documentation](https://ora2pg.darold.net/documentation.html).

### Typical ora2pg migration architecture

![Screenshot of the ora2pg migration architecture.](media/howto-migrate-from-oracle/ora2pg-migration-architecture.png)

After you provision the VM and Azure Database for PostgreSQL, you need two configurations to enable connectivity between them: **Allow Azure Services** and **Enforce SSL Connection**: 

- **Connection Security** blade > **Allow access to Azure Services** > **ON**

- **Connection Security** blade > **SSL Settings** > **Enforce SSL Connection** > **DISABLED**

### Recommendations

- To improve the performance of the assessment or export operations in the Oracle server, collect the following statistics:

   ```
   BEGIN
   
     DBMS_STATS.GATHER_SCHEMA_STATS
     DBMS_STATS.GATHER_DATABASE_STATS
     DBMS_STATS.GATHER_DICTIONARY_STATS
     END;
   ```

- Export data by using the `COPY` command instead of `INSERT`.

- Avoid exporting tables with their foreign keys (FKs), constraints, and indexes. These elements slow down the process of importing data into PostgreSQL.

- Create materialized views by using the *no data clause*. Then refresh the views later.

- If possible, use unique indexes in materialized views. These indexes can speed up the refresh when you use the syntax `REFRESH MATERIALIZED VIEW CONCURRENTLY`.


## Premigration 

After verifying that your source environment is supported and ensuring that you have addressed any prerequisites, you're ready to start the premigration stage. To begin: 

1. Inventory the databases that you need to migrate. 
1. Assess those databases for potential migration issues or blockers.
1. Resolve any items you might have uncovered. 
 
For heterogenous migrations such as Oracle to Azure Database for PostgreSQL, this stage also involves making the source database schemas compatible with the target environment.

### Discover

The goal of the discovery phase is to identify existing data sources and details about the features that are being used. This phase helps you better understand and plan for the migration. The process involves scanning the network to identify all your organization's Oracle instances together with the version and features in use.

Microsoft preassessment scripts for Oracle run against the Oracle database. The preassessment scripts are a set of queries against the Oracle metadata. The scripts provide:

- A database inventory, including counts of objects by schema, type, and status.

- A rough estimate of the raw data in each schema, based on statistics.

- The size of tables in each schema.

- The number of code lines per package, function, procedure, and so on.

Download the related scripts from the [ora2pg website](https://ora2pg.darold.net/).

### Assess

After you inventory the Oracle databases, you'll have an idea of the database size and potential challenges. The next step is to run the assessment.

Estimating the cost of a migration from Oracle to PostgreSQL isn't easy. To assess the migration cost, ora2pg inspects all database objects, functions, and stored procedures to check for objects and PL or SQL code that it can't automatically convert.

ora2pg has a content analysis mode that inspects the Oracle database to generate a text report on what the Oracle database contains and what cannot be exported.

To activate the **analysis and report** mode, use the exported type `SHOW_REPORT` as shown in the following command:

```
ora2pg -t SHOW_REPORT
```

After the database is analyzed, ora2pg, with its ability to convert SQL and PL/SQL code from Oracle syntax to PostgreSQL, can go further by estimating the code difficulties and the time necessary to perform a full database migration.

To estimate the migration cost in man-days, ora2pg allows you to use a configuration directive called ESTIMATE_COST, which can also be enabled at command line:

```
ora2pg -t SHOW_REPORT --estimate_cost
```

The default migration unit represent around five minutes for a PostgreSQL expert. If this is your first migration, you can get it higher with the configuration directive COST_UNIT_VALUE or the --cost_unit_value command-line option.

The last line of the report shows the total estimated migration code in man-days following the number of migration units estimated for each object.

This migration unit represents about five minutes for a PostgreSQL expert. If this is your first migration, you can increase the default with the configuration directive COST_UNIT_VALUE or the --cost_unit_value command-line option. Find below some variations of assessment a) tables assessment; b) columns assessment c) schema assessment using default cost_unit (5 min) d) schema assessment using 10 min as cost unit.

```
ora2pg -t SHOW_TABLE -c c:\ora2pg\ora2pg_hr.conf > c:\ts303\hr_migration\reports\tables.txt ora2pg -t SHOW_COLUMN -c c:\ora2pg\ora2pg_hr.conf > c:\ts303\hr_migration\reports\columns.txt
ora2pg -t SHOW_REPORT -c c:\ora2pg\ora2pg_hr.conf --dump_as_html --estimate_cost > c:\ts303\hr
_migration\reports\report.html
ora2pg -t SHOW_REPORT -c c:\ora2pg\ora2pg_hr.conf –-cost_unit_value 10 --dump_as_html --estimate_cost > c:\ts303\hr_migration\reports\report2.html
```

The output of the schema assessment is illustrated as below:

**Migration level: B-5**

Migration levels:

A - Migration that might be run automatically

B - Migration with code rewrite and a human-days cost up to 5 days

C - Migration with code rewrite and a human-days cost above 5 days

Technical levels:

1 = trivial: no stored functions and no triggers

2 = easy: no stored functions but with triggers, no manual rewriting

3 = simple: stored functions and/or triggers, no manual rewriting

4 = manual: no stored functions but with triggers or views with code rewriting

5 = difficult: stored functions and/or triggers with code rewriting

The assessment consists in a letter (A or B) to specify whether the migration needs manual rewriting or not, and a number from 1 to 5 to indicate the technical difficulty level. You have an additional option -human_days_limit to specify the number of human-days limit where the migration level should be set to C to indicate that it needs a huge amount of work and a full project management with migration support. Default is 10 human-days. You can use the configuration directive HUMAN_DAYS_LIMIT to change this default value permanently.

This feature has been developed to help deciding which database could be migrated first and what is the team that need be mobilized.

### Convert

With minimal-downtime migrations, the source you are migrating continues to change, drifting from the target in terms of data and schema, after the one-time migration occurs. During the **Data sync** phase, you need to ensure that all changes in the source are captured and applied to the target in near real time. After you verify that all changes in source have been applied to the target, you can cutover from the source to the target environment.

In this step of the migration, the conversion or translation of the Oracle Code + DDLS to PostgreSQL occurs. The ora2pg tool exports the Oracle objects in a PostgreSQL format automatically. For those objects generated, some won't compile in the PostgreSQL database without manual changes.  
The process of understanding which elements need manual intervention consists in compiling the files generated by ora2pg against the PostgreSQL database, checking the log and making the necessary changes until all the schema structure is compatible with PostgreSQL syntax.


#### Create migration template 

First, it is recommended to create the migration template that is provided out of the box with ora2pg. The two options --project_base and --init_project when used indicate to ora2pg that it has to create a project template with a work tree, a configuration file and a script to export all objects from the Oracle database. For more information, see the [ora2pg documentation](https://ora2pg.darold.net/documentation.html).

   Use the following command: 

   ```
   ora2pg --project_base /app/migration/ --init_project test_project
   
   ora2pg --project_base /app/migration/ --init_project test_project
   ```

Example output: 
   
   ```
   Creating project test_project. /app/migration/test_project/ schema/ dblinks/ directories/ functions/ grants/ mviews/ packages/ partitions/ procedures/ sequences/ synonyms/    tables/ tablespaces/ triggers/ types/ views/ sources/ functions/ mviews/ packages/ partitions/ procedures/ triggers/ types/ views/ data/ config/ reports/
   
   Generating generic configuration file
   
   Creating script export_schema.sh to automate all exports.
   
   Creating script import_all.sh to automate all imports.
   ```

The sources/ directory contains the Oracle code, the schema/ directory contains the code ported to PostgreSQL. The reports/ directory contains the html reports with the    migration cost assessment.


After the project structure is created, a generic config file is created. Define the Oracle database connection as well as the relevant config parameters in the config.  Refer   to the ora2pg documentation to understand what can be configured in the config file and how.


#### Export Oracle objects

Next, export the Oracle objects as PostgreSQL objects by running the file export_schema.sh.

   ```
   cd /app/migration/mig_project
   ./export_schema.sh
   
   Run the following command manually:
   
   SET namespace="/app/migration/mig_project"
   
   ora2pg -t DBLINK -p -o dblink.sql -b %namespace%/schema/dblinks -c
   %namespace%/config/ora2pg.conf
   ora2pg -t DIRECTORY -p -o directory.sql -b %namespace%/schema/directories -c
   %namespace%/config/ora2pg.conf
   ora2pg -p -t FUNCTION -o functions2.sql -b %namespace%/schema/functions -c
   %namespace%/config/ora2pg.conf ora2pg -t GRANT -o grants.sql -b %namespace%/schema/grants -c %namespace%/config/ora2pg.conf ora2pg -t MVIEW -o mview.sql -b %namespace%/schema/   mviews -c %namespace%/config/ora2pg.conf
   ora2pg -p -t PACKAGE -o packages.sql
   %namespace%/config/ora2pg.conf -b %namespace%/schema/packages -c
   ora2pg -p -t PARTITION -o partitions.sql %namespace%/config/ora2pg.conf -b %namespace%/schema/partitions -c
   ora2pg -p -t PROCEDURE -o procs.sql
   %namespace%/config/ora2pg.conf -b %namespace%/schema/procedures -c
   ora2pg -t SEQUENCE -o sequences.sql
   %namespace%/config/ora2pg.conf -b %namespace%/schema/sequences -c
   ora2pg -p -t SYNONYM -o synonym.sql -b %namespace%/schema/synonyms -c
   %namespace%/config/ora2pg.conf
   ora2pg -t TABLE -o table.sql -b %namespace%/schema/tables -c %namespace%/config/ora2pg.conf ora2pg -t TABLESPACE -o tablespaces.sql -b %namespace%/schema/tablespaces -c
   %namespace%/config/ora2pg.conf
   ora2pg -p -t TRIGGER -o triggers.sql -b %namespace%/schema/triggers -c
   %namespace%/config/ora2pg.conf ora2pg -p -t TYPE -o types.sql -b %namespace%/schema/types -c %namespace%/config/ora2pg.conf ora2pg -p -t VIEW -o views.sql -b %namespace%/   schema/views -c %namespace%/config/ora2pg.conf
   ```

   To extract the data, use the following command:

   ```
   ora2pg -t COPY -o data.sql -b %namespace/data -c %namespace/config/ora2pg.conf
   ```

#### Compile files

Lastly, compile all files against Azure Database for PostgreSQL server. It is possible now to choose to load the DDL files generated manually or use the second script import_all.sh to import those files interactively.

   ```
   psql -f %namespace%\schema\sequences\sequence.sql -h server1-
   
   server.postgres.database.azure.com -p 5432 -U username@server1-server -d database -l
   
   %namespace%\ schema\sequences\create_sequences.log
   
   psql -f %namespace%\schema\tables\table.sql -h server1-server.postgres.database.azure.com p 5432 -U username@server1-server -d database -l    %namespace%\schema\tables\create_table.log
   ```

   Data import command:

   ```
   psql -f %namespace%\data\table1.sql -h server1-server.postgres.database.azure.com -p 5432 -U username@server1-server -d database -l %namespace%\data\table1.log
   
   psql -f %namespace%\data\table2.sql -h server1-server.postgres.database.azure.com -p 5432 -U username@server1-server -d database -l %namespace%\data\table2.log
   ```

During the compilation of files, check the logs and correct the necessary syntaxes that ora2pg was unable to convert out of the box.

Refer to the white paper [Oracle to Azure Database for PostgreSQL Migration Workarounds](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20Database%20for%20PostgreSQL%20Migration%20Workarounds.pdf) for support on working around issues.

## Migrate 

After you have the necessary prerequisites in place and have completed the tasks associated with the **Pre-migration** stage, you are ready to perform the schema and data migration.

### Migrate schema and data

After the fixes are in place, a stable build of the database is ready for deployment.

At this point, all that is required is to execute the *psql* import commands, pointing to the files containing the modified code in order to compile the database objects against the PostgreSQL database and import the data.

In this step, some level of parallelism on importing the data can be implemented.

### Data sync and Cutover

With online (minimal-downtime) migrations, the source you are migrating continues to change, drifting from the target in terms of data and schema, after the one-time migration occurs. During the **Data sync** phase, you need to ensure that all changes in the source are captured and applied to the target in near real time. After you verify that all changes in source have been applied to the target, you can cutover from the source to the target environment.

As of March 2019, if you want to perform an online migration, consider using Attunity Replicate for Microsoft Migrations or Striim.

For *delta/incremental* migration using ora2pg, the technique consists in applying for each table a query that applies a filter (cut) by date or time, etc., and after that finalizing the migration applying a second query which will migrate the rest of the data (leftover).

In the source data table, migrate all the historical data first. An example of that is:

```
select * from table1 where filter_data < 01/01/2019
```

You can query the changes made since the initial migration by running a command similar to the following:

```
select * from table1 where filter_data >= 01/01/2019
```

In this case, it is recommended that the validation is enhanced by checking data parity on both sides, source and target.

## Post-migration 

After you have successfully completed the **Migration** stage, you need to go through a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this will in some cases require changes to the applications.

### Perform tests

After the data is migrated to target, perform tests against the databases to verify that the applications performs well against the target after the migration.

To guarantee that the source and target are properly migrated, run the manual data validation scripts against the Oracle source and PostgreSQL target databases.

Ideally, if the source and target databases have a networking path, ora2pg should be used for data validation. Using the TEST action allows you to check that all objects from the Oracle database have been created under PostgreSQL. Run the command as shown:

```
ora2pg -t TEST -c config/ora2pg.conf > migration_diff.txt
```

### Optimize

The post-migration phase is crucial for reconciling any data accuracy issues and verifying completeness, as well as addressing performance issues with the workload.

## Migration assets 

For additional assistance with completing this migration scenario, please see the following resources, which were developed in support of a real-world migration project engagement.

| **Title link** | **Description**    |
| -------------- | ------------------ |
| [Oracle to Azure PostgreSQL Migration Cookbook](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20PostgreSQL%20Migration%20Cookbook.pdf) | This document purpose is to provide Architects, Consultants, DBAs, and related roles with a guide for quickly migrating workloads from Oracle to Azure Database for PostgreSQL using ora2pg tool. |
| [Oracle to Azure PostgreSQL Migration Workarounds](https://github.com/Microsoft/DataMigrationTeam/blob/master/Whitepapers/Oracle%20to%20Azure%20Database%20for%20PostgreSQL%20Migration%20Workarounds.pdf) | This document purpose is to provide Architects, Consultants, DBAs, and related roles with a guide for quick fixing / working around issues while migrating workloads from Oracle to Azure Database for PostgreSQL. |
| [Steps to Install ora2pg on Windows or Linux](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Steps%20to%20Install%20ora2pg%20on%20Windows%20and%20Linux.pdf)                       | This document is meant to be used as a Quick Installation Guide for enabling migration of schema & data from Oracle to Azure Database for PostgreSQL using ora2pg tool on Windows or Linux. Complete details on the tool can be found at http://ora2pg.darold.net/documentation.html. |

These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, please contact your account team and ask them to submit a nomination.


### Contact support

If you need assistance with your migrations beyond the ora2pg tooling, contact the [@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com) alias for information about other migration options.

## Next steps

- For a matrix of the Microsoft and third-party services/tools available to assist you with various database and data migration scenarios (and specialty tasks), see the article [Service and tools for data migration](https://docs.microsoft.com/azure/dms/dms-tools-matrix).

To learn more, see: 
- [Azure Database for PostgreSQL documentation](https://docs.microsoft.com/azure/postgresql/)
- [ora2pg documentation](https://ora2pg.darold.net/documentation.html)
- [PostgreSQL website](https://www.postgresql.org/)
- [Autonomous transaction support in PostgreSQL](http://blog.dalibo.com/2016/08/19/Autonoumous_transactions_support_in_PostgreSQL.html) 

For video content: 
- [Overview of the migration journey and the tools/services recommended for performing assessment and migration](https://azure.microsoft.com/resources/videos/overview-of-migration-and-recommended-tools-services/).