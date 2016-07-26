<properties
	pageTitle="Title | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services=""
	documentationCenter=""
	authors="ryansoc"
	manager=""
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/29/2015"
	ms.author="ryansoc"/>

#  SQL Database

The following information identifies the Azure Government boundary for Azure Storage:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All data stored and processed in Microsoft Azure SQL can contain Azure Government-regulated data. You must use database tools for data transfer of Azure Government-regulated data. | Azure SQL metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags

SQL Database v11 is generally available in Azure Government.

Refer to the <a href="https://msdn.microsoft.com/en-us/library/bb510589.aspx"> Microsoft Security Center for SQL Database Engine </a> and <a href="https://azure.microsoft.com/en-us/documentation/services/sql-database/"> Azure SQL Database Public Documentation </a> for additional guidance on metadata visibility configuration, and protection best practices.

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
