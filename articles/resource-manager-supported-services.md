<properties
   pageTitle="Resource Manager supported services and supported regions | Microsoft Azure"
   description="Describes the resource providers that support Resource Manager and the regions that can host the resources."
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
   ms.date="10/13/2015"
   ms.author="tomfitz"/>

# Azure Resource Manager support for services and regions

Azure Resource Manager provides a new way for you to deploy and manage the services that make up your applications. 
Most, but not all, services support Resource Manager, and some services support Resource Manager only partially. Microsoft will enable Resource Manager for every service that is important for future solutions, but until the 
support is consistent, you need to know the current status for each service. This topic provides a list of supported resource providers for Azure Resource Manager.

When deploying your resources, you also need to know which regions support those resources. The section [Supported Regions](#supported-regions) shows you how to find out which regions will work for your subscription and resources.

The following tables list which services support deployment and management through Resource Manager and which do not. The column titled **Move Resources** refers to whether resources of this type can be moved to both a 
new resource group and a new subscription. The column titled **Preview Portal** indicates whether you can create the service through the preview portal.


## Compute

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------------------------ | -------------- | -------------- |-------- | ------ |
| Virtual Machines | Yes | Yes | No       | [Create VM](https://msdn.microsoft.com/library/azure/mt163591.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json) |
| Batch   | Yes     | No |               | [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) |        |
| Dynamics Lifecycle Services | Yes | No |    |      |        |
| Virtual Machines (classic) | Limited | No | Partial (see below) | - | - |
| Remote App | No   | - | -              | -        | -      |
| Service Fabric | No | - | -           | -        | -      |

Virtual Machines (classic) refers to resources that were deployed through the classic deployment model, instead of through the Resource Manager deployment model. In general, these resources do not support Resource Manager operations, but there 
are some operations that have been enabled. For more information about these deployment models, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md). 

Virtual Machines (classic) resources can be moved to new resource group, but not a new subscription.

## Web & Mobile

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | -------- | -------------- | -------- | ------ |
| API Management| Yes | No | Yes  | [Create API](https://msdn.microsoft.com/library/azure/dn781423.aspx#CreateAPI) |        |
| API Apps | Yes | Yes |   |   | [2015-03-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-03-01-preview/Microsoft.AppService.json) |
| Web Apps | Yes | Yes  | Yes, with limitations (see below) |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Web.json) |
| Notification Hubs | Yes | Yes |         | [Create Notification Hub](https://msdn.microsoft.com/library/azure/dn223269.aspx) | [2015-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-04-01/Microsoft.NotificationHubs.json) |
| Logic Apps | Yes  | Yes |       |          |        |
| Mobile Engagements | Yes | No |  Yes  |          |        |

When working with web apps, you cannot move only an App Service plan. To move web apps, your options are:

- Move all of the resources from one resource group to a different resource group, if the destination resource group does not already have Microsoft.Web resources.
- Move the web apps to a different resource group, but keep the App Service plan in the original resource group.


## Data & Storage

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | ------- | -------------- | -------- | ------ |
| DocumentDB | Yes  | Yes | Yes  | [DocumentDB REST](https://msdn.microsoft.com/library/azure/dn781481.aspx) |   |
| Storage | Yes     | Yes |         | [Create Storage](https://msdn.microsoft.com/library/azure/mt163564.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Storage.json) |
| Redis Cache | Yes | Yes | Yes |   | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Cache.json) |
| SQL Database | Yes | Yes | Yes  | [Create Database](https://msdn.microsoft.com/library/azure/mt163685.aspx) | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Sql.json) |
| Search | Yes  | Yes | Yes   | [Search REST](https://msdn.microsoft.com/library/azure/dn798935.aspx) |  |
| SQL Data Warehouse | Yes | Yes |   |   |      |
| StorSimple | No   | No | -  | -        | -       |
| Backup | No | No | -              | -        | -       |
| Site Recovery | No | No | -             | -        | -       |
| Managed cache | No | No | -             | -        | -       |
| Data Catalog | No | No |  -             | -        | -       |

## Analytics

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | --------- | -------------- | -------- | ------ |
| Event Hub | Yes   | No |         | [Create Event Hub](https://msdn.microsoft.com/library/azure/dn790676.aspx) |        |
| Stream Analytics | Yes | Yes |        |          |        |
| HDInsights | Yes  | Yes |            |          |        |
| Data Factory | Yes | Yes | Yes | [Create Data Factory](https://msdn.microsoft.com/library/azure/dn906717.aspx) |    |
| Machine Learning | No | No | -          | -        | -      |

## Networking

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | -------- | -------------- | -------- | ------ |
| Application Gateway | Yes |  |      |          |        |
| DNS     | Yes     |  |               | [Create DNS Zone](https://msdn.microsoft.com/library/azure/mt130622.aspx)         | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Load Balancer | Yes |    |          | [Create Load Balancer](https://msdn.microsoft.com/library/azure/mt163574.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Virtual Networks | Yes | Yes | No        | [Create Virtual Network](https://msdn.microsoft.com/library/azure/mt163661.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Traffic Manager | Yes | No |           | [Create Traffic Manager profile](https://msdn.microsoft.com/library/azure/mt163581.aspx) |        |
| Express Route | No | No | -             | -        | -      |

## Media & CDN

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | -------- | -------------- | -------- | ------ |
| Media Service | No | No |  |  |  |
| CDN | No | No |  |  |  |

## Hybrid Integration

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------------- | -------- | ------ |
| BizTalk Services | Yes | No |        |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.BizTalkServices.json) |
| Service Bus | Yes | No |     | [Service Bus REST](https://msdn.microsoft.com/library/azure/hh780717.aspx) |        |

## Identity & Access Management 

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------------- | -------- | ------ |
| Azure Active Directory | No | No | -  | - | - |
| Azure Actice Directory B2C | No | No | - | - | - |
| Multi-Factor Authentication | No | No | - | - | - |

## Developer Services 

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | ---------- | -------------- | -------- | ------ |
| Application Insights | Yes | Yes |       |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.Insights.json) |
| Bing Maps | Yes   | Yes |         |          |        |
| Visual Studio account | Yes |  |      |          | [2014-02-26](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-02-26/microsoft.visualstudio.json) |

## Management 

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------- | --------- | -------------- | -------- | ------ |
| Automation | Yes  | Yes |       |          |        |
| Key Vault | Yes    | No | Yes            | [Key Vault REST](https://msdn.microsoft.com/library/azure/dn903609.aspx) |        |
| Scheduler | Yes   | No |        |          | [2014-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-08-01/Microsoft.Scheduler.json) |
| Operational Insights | Yes | No | Yes   |          |        |
| IoTHubs | Yes     | Yes |               |          |        |


## Supported Regions

When deploying resources, you typically need to specify a region for the resources. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. In addition, there 
may be limitations on your subscription which prevent you from using some regions that support the resource. These limitations may be related to tax issues for your home country, or the result of a policy placed 
by your subscription administrator to use only certain regions. 

Before deploying your resources, check the supported regions for your resource type by running one of the following commands.

### REST API

Your best option for discovering which regions are available for a particular resource type is the [List all resource providers](https://msdn.microsoft.com/library/azure/dn790524.aspx) operation. This operation returns only 
those regions that are available to your subscription and resource type.

### PowerShell

The following example shows how to get the supported regions for web sites using Azure PowerShell 1.0 Preview. For more information about the 1.0 Preview release, see [Azure PowerShell 1.0 Preview](https://azure.microsoft.com/blog/azps-1-0-pre/)

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
    
The output will be similar to:

    Brazil South
    East Asia
    East US
    Japan East
    Japan West
    North Central US
    North Europe
    South Central US
    West Europe
    West US
    Southeast Asia
    Central US
    East US 2

### Azure CLI

The following example returns all of the supported locations for each resource type.

    azure location list

You can also filter the location results with a tool like **jq**. To learn about tools like jq, see [Useful tools to interact with Azure](/virtual-machines/resource-group-deploy-debug/#useful-tools-to-interact-with-azure).

    azure location list --json | jq '.[] | select(.name == "Microsoft.Web/sites")'

Which returns:

    {
      "name": "Microsoft.Web/sites",
      "location": "Brazil South,East Asia,East US,Japan East,Japan West,North Central US,
            North Europe,South Central US,West Europe,West US,Southeast Asia,Central US,East US 2"
    }

