<properties
   pageTitle="Elastic performance and scale with SQL Data Warehouse | Microsoft Azure"
   description="Understand SQL Data Warehouse elasticity using Data Warehouse Units to scale compute resources up and down. Code examples provided."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/25/2015"
   ms.author="nicw;JRJ@BigBangData.co.uk;mausher"/>

# Elastic performance and scale with SQL Data Warehouse
To elastically increase or decrease your compute power all you need to do is adjust the number of Data Warehouse Units (DWU) allocated to your SQL Data Warehouse. Data Warehouse Units are a new concept delivered by SQL Data Warehouse to enable you to manage this simmply and effectively. This topic serves as an introduction to Data Warehouse units; explaining how you can use them to elastically scale your compute power. The article also provides some initial guidance on how to set a reasonable DWU value for your environment.

## What is a data warehouse unit?
Behind the scenes Microsoft runs a number of performance benchmark tests to determine how much hardware and with what configuration will allow us to deliver a competitive offering to our customers.  Scaling compute up and down can be done in blocks of 100 DWUs, but not all multiples of 100 DWU are offered.  

## How many DWUs should I use?
There are many different solutions SQL Data Warehouse can unblock for customers.  As such, there is a large variety in the types of queries customers will run and how much data they operate over, as well as the architecture of the schema, how the data is distributed, how many users will access the data, how frequently, etc..  

Rather than provide prescriptive DWU starting points that may be great for a category of customers, let's approach this question with a practical approach.  Performance in SQL Data Warehouse scales linearly, and changing from one compute scale to another (say from 100 DWUs to 2000 DWUs) happens in seconds.  This gives you the freedom to try things out and determine what the best fit for your scenario is.    


1. For a data warehouse in development, start with small number of DWUs.
2. Monitor your application performance, so you can become familiar with DWUs versus the performance you observe.
3. Determine how much faster or slower performance should be for you to reach the optimum performance level for your business requirements by assuming linear scale. 
4. Change the amount of DWU you're using to a greater or lower amount depending on need.  The service will respond rapidly to adjust the compute resources to meet the DWU requirements.
5. Make adjustments until you reach an optimum performance level for your business requirements.

If you have an application with a fluctuating workload, you can move performance levels up or down to accommodate peaks and low points. For example, if a workload typically peaks at the end of the month, you could plan to add more DWUs during those peak days and then throttle it back down when the peak period is over.
 
## Scaling compute resources up and down
Independent of cloud storage, SQL Data Warehouse's elasticity lets you grow, shrink, or pause compute power by using a sliding scale of data warehouse units (DWUs). This gives you the flexibility to tune your compute power to something that is optimal for your business.  

To increase the compute power you can add more DWUs to the service using the scale slider in the Azure Portal.  You can also add DWUs through T-SQL, REST APIs, or Powershell cmdlets.  Scaling up and down cancels all running or queued activities, but completes in seconds so you can resume with more or less compute power.

In the [Azure Portal][], you can click the 'Scale' icon at the top of your SQL Data Warehouse page and then use the slider to increase or decrease the amount of DWUs applied to your Data Warehouse before clicking 'Save'.  If you would rather change the scale programmatically, the T-SQL code below shows how to adjust the DWU allocation for your SQL Data Warehouse:

```
ALTER DATABASE MySQLDW 
MODIFY (SERVICE_OBJECTIVE = 'DW1000')
;
```
Please note that this T-SQL should be run against your logical server, and not against the SQL Data Warehouse instance itself. 

You can also achieve the same with result using Powershell using the code below:

```
Set-AzureSQLDatabase -DatabaseName "MySQLDW" -ServerName "MyServer.database.windows.net" -ServiceObjective "DW1000"
```

## Pausing compute resources
Unique to SQL Data Warehouse is the ability to pause and resume compute on demand.  If the team will not be using the Data Warehouse instance for a period of time, like nights, weekends, certain holidays or for any other reason, you can pause the Data Warehouse instance for that period of time and pick up where you left off when you return.  

The pause action returns your compute resources back to the pool of available resources in the data center and the resume action acquires the necessary compute resources needed for the DWU you've set and assigns them to your Data Warehouse instance.  

Pause and resume of your compute power can be done through the [Azure Portal][], via REST APIs or through Powershell.  Pausing cancels all running or queued activities and when you return you can resume your compute resources in seconds. 

The code below shows how to perform a pause using PowerShell:

```
Suspend-AzureSqlDatabase –ResourceGroupName "ResourceGroup11" –ServerName
"Server01" –DatabaseName "Database02"
```

Resuming the service is also very straightforward with PowerShell:

```
Resume-AzureSqlDatabase –ResourceGroupName "ResourceGroup11" –ServerName "Server01" –DatabaseName "Database02"
```

For more details on how to use PowerShell please refer to the [Introduction to PowerShell cmdlets][] article.

> [Azure.Note] Since storage is separate from compute, your storage is unaffected by pause.

## Next steps
For the performance overview, see [performance overview][].

<!--Image references-->

<!--Article references-->
[performance overview]: sql-data-warehouse-overview-performance.md
[Introduction to PowerShell cmdlets]: sql-data-warehouse-get-started-powershell-cmdlets.md

<!--MSDN references-->


<!--Other Web references-->

[Azure Portal]: http://portal.azure.com/
