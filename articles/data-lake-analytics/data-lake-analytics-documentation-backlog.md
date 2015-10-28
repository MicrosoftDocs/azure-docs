<properties 
   pageTitle="Azure Data Lake Analytics Documentation Backlog | Azure" 
   description="Data Lake Analytics is an Azure Big Data computation service that lets you use data to drive your business using the insights gained from your data in the cloud, regardless of where it is and regardless of its size. Data Lake Analytics enables this in the simplest, most scalable, and most economical way possible. This page is the backlog for our documentation efforts " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/21/2015"
   ms.author="mwinkle"/>

# Azure Data Lake Analytics Documentation Backlog

This page captures the set of documents which have yet to be written for Azure Data Lake Analytics. 

## Documentation Backlog
Area   |Topic | Priority | Status | Assigned To
------------- | ------------- | -------------- | -------------- | --------------
U-SQL   | Distributed Query		 | 1 | Pending, Working on getting proper firewall guidance | Ed
U-SQL  | Processing JSON 		| 2 |  |Ed/jgao
Service | Interacting with Curl | |Pending RestFUL API |jgao | 
U-SQL | Partitioned Tables |1 | |Ed/jgao
U-SQL | Performance Tuning | | | Michael
U-SQL | Programmer's Guide | | | Ed/Jonathan
U-SQL | Getting started with U-SQL from a T-SQL background | | |Ed
U-SQL | Getting started with U-SQL from a Hive background | | |jgao
U-SQL | Grammar Railroad Diagrams |  1 | in progress, using [this](http://bottlecaps.de/rr/ui)  | mwinkle/Ed 
Service | Securing Jobs, Data and Tables in Data Lake Analytics |1|I will work with Saveen on this| jgao 
Service | Moving job output to SQL Data Warehouse using Data Factory |1 |I will work with Sreedhar on this | jgao
Service | Coordinating deployment of Data Lake Analytics with other Azure services using ARM templates |1 |I have included an ARM template in the Management using PowerShell article. It will go live with the public preview. The management using CLI will have the same coverage |jgao
Tools  | Using the Diagnostics Tooling | 1 | |jgao|



## How to Give Feedback on the Backlog
There are a few options to give feedback on the backlog:

* Add a comment below
* Submit a pull request on this document in the Azure Content Repo (todo: insert a link to the repo here)
* Send an email to [adlafeedback at microsoft.com](mailto:adlafeedback@microsoft.com?subject=DocBacklog)
