<properties 
   pageTitle="SQL Database Business Continuity during Application Upgrade" 
   description="This section provides guidance for preventing downtime during an application upgrade." 
   services="sql-database"
   documentationCenter="" 
   authors="CarlRabeler" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="05/27/2016"
   ms.author="carlrab"/>

#Upgrade an application without downtime

In the context of Microsoft Azure the term 'application' refers to components such as front ends, services deployed in a cloud service, and the data tier used to persist application data or meta-data. Cloud applications are often designed to provide uninterrupted service 24x7. Rolling out a new version of the application, when changes in the data tier are applied in the live site could potentially cause some disruption, such as reduced features being available or even complete downtime. 

When designing the application upgrade process the main goal should be eliminating or dramatically reducing the duration of time when application capability is reduced. To achieve that the process typically involves creation of a temporary copy of the application to be used as a backup in case the upgrade fails. The following  factors should be considered when designing and planning the upgrade:

1.	Maximum acceptable time when the application will have reduced capability 
2.	Minimum set of features that will be available during the upgrade process
3.	Ability to roll back in case of any errors during upgrade.
4.	Total dollar cost involved.  This includes the cost of additional application components needed to create a temporary copy (such as additional databases for Active Geo-Replication) and incremental costs for temporary deployments used by the upgrade process. 

If the application can temporarily operate in read-only mode the upgrade workflow could be designed to effectively eliminate the downtime altogether. To understand how to implement the upgrade work-flow for your specific application topology please refer to [Managing rolling upgrades of cloud applications using SQL Database Active Geo-Replication](sql-database-manage-application-rolling-upgrade.md).
 
 
 
