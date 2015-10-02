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
   ms.date="10/02/2015"
   ms.author="tomfitz"/>

# Azure Services that support Resource Manager

Azure Resource Manager provides a new way for you to deploy and manage the services that make up your applications. 
Most, but not all, services support Resource Manager, and some services support Resource Manager only partially. Microsoft will enable Resource Manager for every service that is important for future solutions, but until the 
support is consistent, you need to know the current status for each service. This topic provides a list of supported resource providers for Azure Resource Manager.

When deploying your resources, you also need to know which regions support those resources. The section [Supported Regions](#supported-regions) shows you how to find out which regions will work for your subscription and resources.

The following tables list which services support deployment and management through Resource Manager and which do not. The column titled **Move Resources** refers to whether resources of this type can be moved to both a 
new resource group and a new subscription. The column titled **Preview Portal** indicates whether you can create the service through the preview portal.


## Compute

| Service | Resource Manager Enabled | Preview Portal | Move Resources | REST API | Schema |
| ------- | ------------------------ | -------------- | -------------- |-------- | ------ |
| Virtual Machines | Yes | Yes |          | [Create VM](https://msdn.microsoft.com/library/azure/mt163591.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json) |
| Batch   | Yes     | No |               | [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) |        |
| Dynamics Lifecycle Services | Yes | No |    |      |        |
| Compute (classic) | Limited | No | Partial | - | - |
| Remote App | No   | - | -              | -        | -      |
| Service Fabric | No | - | -           | -        | -      |

Compute (classic) refers to resources that were deployed through the classic deployment model, instead of through the Resource Manager deployment model. In general, these resources do not support Resource Manager operations, but there 
are some operations that have been enabled. For more information about these deployment models, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md). 

Compute (classic) resources can be moved to new resource group, but not a new subscription.

## Web & Mobile

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| API Management| Yes | Yes         | [Create API](https://msdn.microsoft.com/library/azure/dn781423.aspx#CreateAPI) |        |
| API Apps | Yes    |                |          | [2015-03-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-03-01-preview/Microsoft.AppService.json) |
| Web Apps | Yes    | Yes, with limitations |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Web.json) |
| Notification Hubs | Yes |          | [Create Notification Hub](https://msdn.microsoft.com/library/azure/dn223269.aspx) | [2015-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-04-01/Microsoft.NotificationHubs.json) |
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
| SQL Database | Yes | Yes           | [Create Database](https://msdn.microsoft.com/library/azure/mt163685.aspx) | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Sql.json) |
| Search | Yes      | Yes            | [Search REST](https://msdn.microsoft.com/library/azure/dn798935.aspx) |  |
| StorSimple | No   | -              | -        | -       |
| Backup | No       | -              | -        | -       |
| Site Recovery | No | -             | -        | -       |
| Managed cache | No | -             | -        | -       |
| Data Catalog | No |  -             | -        | -       |
| SQL data warehouse | No | -        | -        | -       |

## Analytics

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Event Hub | Yes   |                | [Create Event Hub](https://msdn.microsoft.com/library/azure/dn790676.aspx) |        |
| Stream Analytics | Yes |           |          |        |
| HDInsights | Yes  |                |          |        |
| Machine Learning | No | -          | -        | -      |

## Networking

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| Application Gateway | Yes |        |          |        |
| DNS     | Yes     |                | [Create DNS Zone](https://msdn.microsoft.com/library/azure/mt130622.aspx)         | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Load Balancer | Yes |              | [Create Load Balancer](https://msdn.microsoft.com/library/azure/mt163574.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Virtual Networks | Yes | No        | [Create Virtual Network](https://msdn.microsoft.com/library/azure/mt163661.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) |
| Traffic Manager | Yes |            | [Create Traffic Manager profile](https://msdn.microsoft.com/library/azure/mt163581.aspx) |        |
| Express Route | No | -             | -        | -      |

## Media & CDN

## Hybrid Integration

| Service | Enabled | Move Resources | REST API | Schema |
| ------- | ------- | -------------- | -------- | ------ |
| BizTalk Services | Yes |           |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.BizTalkServices.json) |
| Service Bus | Yes |                | [Service Bus REST](https://msdn.microsoft.com/library/azure/hh780717.aspx) |        |

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
| Key Vault | Yes    | Yes            | [Key Vault REST](https://msdn.microsoft.com/library/azure/dn903609.aspx) |        |
| Scheduler | Yes   |                |          | [2014-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-08-01/Microsoft.Scheduler.json) |
| Operational Insights | Yes | Yes   |          |        |
| IoTHubs | Yes     |                |          |        |



What about?

- ADHybridHealthService
- cloud services
- mobile services
- VPN Gateway
- Visual Studio Online



## Supported Regions

When deploying resources, you typically need to specify a region for the resources. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. In addition, there 
may be limitations on your subscription which prevent you from using some regions that support the resource. These limitations may be related to tax issues for your home country, or the result of a policy placed 
by your subscription administrator to use only certain regions. 

Before deploying your resources, check the supported regions for your resource type by running one of the following commands.

### REST API

Your best option for discovering which regions are available for a particular resource type is the [List all resource providers](https://msdn.microsoft.com/library/azure/dn790524.aspx) operation. This operation returns only 
those regions that are available to your subscription and resource type.

### PowerShell

The following example shows how to get the supported regions for virtual machines.

    Get-AzureLocation | Where-Object Name -eq "Microsoft.Compute/virtualMachines" | Format-Table Name, LocationsString -Wrap

The output will be similar to:

    Name                                      LocationsString
    ----                                      ---------------
    Microsoft.Compute/virtualMachines         East US, East US 2, West US, Central US, South Central US,
                                              North Europe, West Europe, East Asia, Southeast Asia,
                                              Japan East, Japan West

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

