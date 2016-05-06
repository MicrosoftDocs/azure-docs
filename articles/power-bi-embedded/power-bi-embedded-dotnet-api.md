<properties
   pageTitle="Power BI Embedded .NET API"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="03/29/2016"
   ms.author="derrickv"/>

# Power BI Embedded .NET API

**Microsoft Power BI Embedded** Preview is primarily focused on exposing the majority of existing Power BI API functionality as part of an Azure service for you to develop your applications with. Additionally, you will be able to programmatically provision, develop and deploy the necessary resources and Power BI content.

You can use the **Power BI API** to create and manage Power BI content workspaces. With the API, you can

  - Import a Power BI desktop file (PBIX) into a workspace using key based authentication.
  - Modify connection strings of a dataset.
  - Get **Reports** to integrate into your own app.
  - Set credentials for a dataset to be able to talk to the correct source datasource.
  - To learn more about the **Power BI API**, see [Get started with Microsoft Power BI Embedded preview](power-bi-embedded-get-started.md).

See the [Power BI Reference on MSDN](https://msdn.microsoft.com/library/mt669800.aspx).

Here are some of the classes and methods that are used in the **Power BI Embedded sample**:

## Microsoft.PowerBI.Api.Beta Namespace

### ReportsExtensions Class
|Name|Description
|---|---
|[GetReports(IReports, String, String)]( https://msdn.microsoft.com/library/microsoft.powerbi.api.beta.reportsextensions.getreports.aspx)|Gets a list of reports available within the specified workspace
|[GetReportsAsync(IReports, String, String, CancellationToken)]( https://msdn.microsoft.com/library/microsoft.powerbi.api.beta.reportsextensions.getreportsasync.aspx)|Gets a list of reports available within the specified workspace

## Microsoft.PowerBI.Security Namespace

### PowerBIToken Methods
|Name| Description
|---|---
|[CreateDevToken(String, Guid)]( https://msdn.microsoft.com/library/mt670215.aspx)|Creates a developer token with default expiration used to access Power BI platform services
|[CreateProvisionToken(String)]( https://msdn.microsoft.com/library/mt670218.aspx)|Creates a provision token with default expiration used to manages workspaces within a workspace collection

## See also

- [What is Microsoft Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md)
- [Get started with Microsoft Power BI Embedded preview](power-bi-embedded-get-started.md)
