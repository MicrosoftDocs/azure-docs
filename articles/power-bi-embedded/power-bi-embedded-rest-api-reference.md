<properties
   pageTitle="Power BI Embedded REST API"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

# Power BI Embedded REST API

**Microsoft Power BI Embedded** Preview is primarily focused on exposing the majority of existing Power BI API functionality  as part of an Azure service for you to develop your applications with.  Additionally, you will be able to programmatically provision, develop and deploy the necessary resources and Power BI content. See [Get started sample](power-bi-embedded-get-started.md).

-	Use the **Power BI API** to create and manage Power BI content workspaces. With the API, you can
  - Import a Power BI desktop file (PBIX) into a workspace using key based authentication.
  - Modify connection strings of a dataset.
  - Get **Reports** to integrate into your own app.
  - Set credentials for a dataset to be able to talk to the correct source datasource.
  - To learn more about the **Power BI API**, see [Get stated with Microsoft Power BI Embedded preview](power-bi-embedded-get-started.md).

Here are some of the classes of the **Power BI API** that are demostrated in the **Power BI Embedded sample**. For a complete reference to the **Power BI API**, see [Power BI API](https://msdn.microsoft.com/library/mt669800(Azure.100).aspx).

## Microsoft.PowerBI.Api.Beta

### ReportsExtensions Class Methods

|Name|Description
|---|---
|[GetReports(IReports, String, String)](https://msdn.microsoft.com/library/microsoft.powerbi.api.beta.reportsextensions.getreports.aspx)|Gets a list of reports available within the specified workspace
|[GetReportsAsync(IReports, String, String, CancellationToken)](https:// https://msdn.microsoft.com/library/microsoft.powerbi.api.beta.reportsextensions.getreportsasync.aspx)|Gets a list of reports available within the specified workspace

### PowerBIToken Class Methods

|Name|Description
|---|---
|[CreateDevToken(String, Guid)](https://msdnstage.redmond.corp.microsoft.com/en-us/library/mt670215.aspx)|Creates a developer token with default expiration used to access Power BI platform services
|[CreateProvisionToken(String)](https://msdnstage.redmond.corp.microsoft.com/en-us/library/mt670218.aspx)|Creates a provision token with default expiration used to access Power BI platform services
