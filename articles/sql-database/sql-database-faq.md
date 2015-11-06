<properties 
   pageTitle="Azure SQL Database FAQ" 
   description="Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) in the cloud." 
   services="sql-database" 
   documentationCenter="" 
   authors="jeffgoll" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="10/23/2015"
   ms.author="jeffreyg"/>

# SQL Database FAQ

## What if my database is active for less than an hour?
You are billed for each hour the database exists, regardless of usage or if the database is active for less than an hour, using the highest rate that applied during the hour. For example, if you create a database and delete it 5 minutes later your bill will reflect a charge for 1 database hour. If you create a Basic database and then immediately upgrade it to Standard S1 you will be charged at the Standard S1 rate for the first hour. If you delete a database and then create another with the same name, your bill will reflect a charge for two separate databases within that hour.

## How does the usage of single Basic, Standard or Premium databases show up on my bill? 
With Basic, Standard and Premium, you are billed on a flat, predictable daily rate based on the edition and performance level. Actual usage is computed and pro-rated hourly so your bill might show fractions of a day. For example, if a database exists for 12 hours in a month, your bill will show usage of and you will be charged for 0.5 days. Additionally, performance levels (eg. Basic, S1, and P2) are broken out in the bill to make it easier to see the number of database days you incurred in a single month for each performance level.

## When does the billing rate change after I change the edition or performance level of a single database? 
Basic, Standard and Premium databases are charged on an hourly basis based on the highest edition and performance level that applied during the hour. When changing editions or performance levels the new rate applies once the change has completed. For example, if you upgrade a database from Basic to Premium at 10:00pm and upgrade completes at 1:00 am on the following day, you will only be charged at the Premium rate starting the hour it completes. If you downgrade a database from Premium to Standard or Basic at 11:00 am and it completes at 2:00 pm, then the database will be charged at the Premium rate through 2:00 pm when the downgrade is complete and will then be charged at the Standard or Basic rates.

## How does the use of the auditing feature impact my bill? 
The auditing capability is built into the SQL Database service at no extra cost and is available across Basic, Standard, and Premium. However, to store the audit logs, the auditing feature makes use of an Azure Storage account which you designate. Azure Storage rates for Tables & Queues will apply based on the size of your audit log.

##If I use Automated Export will I be charged extra? 
Automated export is used by many customers to periodically create logical backups of a database. Basic, Standard and Premium databases, which have built-in support for point-in-time restore, reduce the need to use automated export in many cases. Automated export creates copy of the database in the same service tier. This additional database exists for the duration of the export operation and is charged at the normal hourly rates while it exists. Depending on how often you export the database and the size of the database (large databases take longer to copy and export) you may significantly increase the effective cost of the database being exported.

## How often can I change the edition or performance level of a single database? 
Changing the edition or performance level of a database should be done as a considered and deliberate action. You are allowed up to 4 changes in a 24 hour period that alter the edition or performance level of a database. Changes between Web and Business are excluded from this limit.

## How long does it take to change the service tier or performance level of a single database? 
Changing the service tier of a database may require the database to be copied internally. This may happen when changing to or from Standard or Premium, or when changing the performance level of a Standard or Premium database. If this happens it may take from a few minutes to several hours depending on the size of the database. Changing the edition or performance level of a database immediately after creating it is faster than upgrading the database later once populated with data.

## How long does it take to move a database from the single database model to an elastic database pool? 
The time it takes to move a database out of an elastic database pool depends on the size of the database. It may take from a few minutes to several hours depending on the size of the database. The database remains fully online and available during the move.

##How often can I adjust the number of elastic DTUs allocated to a database pool? 
The number of elastic DTUs allocated to a database pool can be adjusted once per day.

## What does it mean to have up to 200% of your maximum provisioned database storage for backup storage? 
Backup storage is the storage associated with your automated database backups that are used for Point-In-Time-Restore and Geo-Restore. Microsoft Azure SQL Database provides up to 200% of your maximum provisioned database storage of backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you will be provided with 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support or pay for the extra backup storage billed at standard Read-Access Geographically Redundant Storage (RA-GRS) rate. For more information on RA-GRS billing, see Storage Pricing Details.

##When should I use SQL Database elastic databases vs single database? 
Software-as-a-service (SaaS) providers often have challenges handling large numbers of databases. One architectural pattern for SaaS applications is to create one database per customer. Purchasing individual databases and overprovisioning to meet the variable and peak demand for each database is often not cost efficient, and managing many databases presents its own set of challenges. Microsoft designed the elastic database model to address this need and help you manage workloads with unpredictable resource demands across a large number of databases.

##How do I determine what size of pool I should buy? 
You can use the DTU sizing advisor in the Azure Management Portal that will recommend databases and the DTUs required. This advisor looks at historical usage patterns of your databases being moved into the elastic database pool. This assumes that the databases have been running in SQL Database for at least a couple of weeks. There is also documentation help for customers to calculate the DTU required for an elastic database pool based on the current usage patterns of the databases.



