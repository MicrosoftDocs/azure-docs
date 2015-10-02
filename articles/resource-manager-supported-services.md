<properties
   pageTitle="Resource Manager supported services | Microsoft Azure"
   description="Describes the resource providers that support Resource Manager"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/02/2015"
   ms.author="tomfitz"/>

# Azure Services that support Resource Manager

This topic provides a list of supported resource providers for Azure Resource Manager.

The following tables list which services support deployment and management through Resource Manager and which do not.


## Compute

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | :-------: | -------------- | -------- | ------ |
| Batch   | Yes     |                | [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) |        |
| Dynamics Lifecycle Services | Yes |    |      |        |
| Virtual Machines | Yes |           | [Create VM](https://msdn.microsoft.com/library/azure/mt163591.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json) |
| Remote App | No   |                |          |        |
| Service Fabric | No |              |          |        |



## Web & Mobile

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| API Management| Yes | Yes         | [Create API](https://msdn.microsoft.com/library/azure/dn781423.aspx#CreateAPI) |        |
| API Apps | Yes    |                |          | [2015-03-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-03-01-preview/Microsoft.AppService.json) |
| App Service | Yes |                |          |        |
| Web Apps | Yes    | Yes, with limitations |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Web.json) |
| Notification Hubs | Yes |          |          | [2015-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-04-01/Microsoft.NotificationHubs.json) |
| Logic Apps | Yes  |                |          |        |
| Mobile Engagements | Unsure | Yes  |          |        |


When working with web apps, you cannot move only an App Service plan. To move web apps, your options are:

- Move all of the resources from one resource group to a different resource group, if the destination resource group does not already have Microsoft.Web resources.
- Move the web apps to a different resource group, but keep the App Service plan in the original resource group.


## Data & Storage

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Data Factory | Yes | Yes           | [Create Data Factory](https://msdn.microsoft.com/library/azure/dn906717.aspx) |  |
| DocumentDB | Yes  | Yes            | [DocumentDB REST](https://msdn.microsoft.com/library/azure/dn781481.aspx) |  |
| Storage | Yes     |                | [Create Storage](https://msdn.microsoft.com/library/azure/mt163564.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Storage.json) |
| Redis Cache | Yes | Yes            |          | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Cache.json) |
| SQL Database | Yes | Yes           |          | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Sql.json) |
| Search | Yes      | Yes            | [Search REST](https://msdn.microsoft.com/library/azure/dn798935.aspx) |  |
| StorSimple | No   |                |          |         |
| Backup | No       |                |          |         |
| Site Recovery | No |               |          |         |
| Managed cache | No |               |          |         |
| Data Catalog | No |                |          |         |
| SQL data warehouse | No |          |          |         |

## Analytics

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Event Hub | Yes   |                |          |        |
| Stream Analytics | Yes |           |          |        |
| HDInsights | Yes  |                |          |        |
| Machine Learning | No |            |          |        |

## Networking

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Application Gateway | Yes |        |          |        |
| DNS     | Yes     |                |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Load Balancer | Yes |              |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Virtual Networks | Yes | No        |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Traffic Manager | Yes |            |          |        |
| Express Route | No |               |          |        |

## Media & CDN

## Hybrid Integration

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| BizTalk Services | Yes |           |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.BizTalkServices.json) |
| Service Bus | Yes |                |          |        |

## Identity & Access Management 

## Developer Services 

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Application Insights | Yes |       |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.Insights.json) |
| Bing Maps | Yes   |                |          |        |
| Visual Studio account | Yes |      |          | [2014-02-26](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-02-26/microsoft.visualstudio.json) |

## Management 

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Automation | Yes  |                |          |        |
| KeyVault | Yes    | Yes            |          |        |
| Scheduler | Yes   |                |          | [2014-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-08-01/Microsoft.Scheduler.json) |
| Operational Insights | Yes | Yes   |          |        |
| Marketplace | Yes |                |          |        |
| IoTHubs | Yes     |                |          |        |



What about?

- ADHybridHealthService
- cloud services
- mobile services
- VPN Gateway
- Visual Studio Online



## Supported Regions

When deploying resources, you typically need to specify a region for the resources. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions.  
Before deploying your resources, check the supported regions for your resource type by running one of the following commands.

### PowerShell

The following example shows how to get the supported regions for virtual machines.

    Get-AzureLocation | Where-Object Name -eq "Microsoft.Compute/virtualMachines" | Format-Table Name, LocationsString -Wrap

The output will be similar to:

    Name                                      LocationsString
    ----                                      ---------------
    Microsoft.Compute/virtualMachines         East US, East US 2, West US, Central US, South Central US,
                                              North Europe, West Europe, East Asia, Southeast Asia,
                                              Japan East, Japan West

