<properties 
	title="Elastic database job service" 
	pageTitle="Elastic database job service" 
	description="Illustrates the elastic database job service" 
	metaKeywords="azure sql database elastic databases" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="sidneyh"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/16/2015" 
	ms.author="sidneyh" />

# Elastic database jobs

The elastic job service (preview) enables you to run T-SQL scripts (jobs) against elastic any number of databases in an elastic database pool. For example, you can update the schema to every database in the deployment to include a new table. Normally, you must connect to each database in order to run TSQL statements or perform other tasks. The elastic database job service handles the task of logging in, and running the script for you, while logging the success of each step. 

![Elastic database job service][1]

## How the job service works

1.	From the Elastic database pool view, click **Manage jobs**. 
2.	Type in the user name and password of a SQL Server login that will execute the script.
3.	Type the name of the job, and paste in or type the script.
4.	Click **Run** and the service executes the script against each database.
5.	A management view allows you to see all jobs running, or that have run. 
6.	Click any job to see its log of steps.
7.	If a job fails, click on its name  to see the error log.


[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-job-tools/elastic-jobs.png
<!--anchors-->

