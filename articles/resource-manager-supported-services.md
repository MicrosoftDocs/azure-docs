<properties
   pageTitle="Resource Manager supported services | Microsoft Azure"
   description="Describes the resource providers that support Resource Manager, their schemas and available API versions, and the regions that can host the resources."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/18/2016"
   ms.author="magoedte;tomfitz"/>

# Resource Manager providers, regions, API versions and schemas

Azure Resource Manager provides a new way for you to deploy and manage the services that make up your applications. 
Most, but not all, services support Resource Manager, and some services support Resource Manager only partially. Microsoft will enable Resource Manager for every service that is important for future solutions, but until the 
support is consistent, you need to know the current status for each service. This topic provides a list of supported resource providers for Azure Resource Manager.

When deploying your resources, you also need to know which regions support those resources and which API versions are available for the resources. The section [Supported regions](#supported-regions) shows you how to find out which regions will work for your subscription and resources. The section [Supported API versions](#supported-api-versions) shows you how to determine which API versions you can use.

To see which services are supported in the Azure portal and classic portal, see [Azure portal availability chart](https://azure.microsoft.com/features/azure-portal/availability/). To see which services support moving resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

The following tables list which services support deployment and management through Resource Manager and which do not. The link in the column **Quickstart Templates** sends a query to the Azure Quickstart Templates repository for the specified resource provider. 
Quickstart templates are added and updated frequently. The presence of a link for a particular service does not necessarily mean 
the query will return templates from the repository. 


## Compute

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------------------------ |-------- | ------ | ------ |
| Batch   | Yes     | [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) | [2015-12-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-12-01/Microsoft.Batch.json)       |  |
|Container | Yes | [Container Service REST](https://msdn.microsoft.com/library/azure/mt711470.aspx) | [2016-03-30](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-03-30/Microsoft.ContainerService.json) | [Microsoft.ContainerService](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.ContainerService%22&type=Code) |
| Dynamics Lifecycle Services | Yes  |      |        |  |
| Scale Sets | Yes | [Scale Set REST](https://msdn.microsoft.com/library/azure/mt705635.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json) | [virtualMachineScaleSets](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=virtualMachineScaleSets&type=Code) | 
| Service Fabric | Yes  | [Service Fabric Rest](https://msdn.microsoft.com/library/azure/dn707692.aspx)  |      | [Microsoft.ServiceFabric](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.ServiceFabric%22&type=Code) |
| Virtual Machines | Yes | [VM REST](https://msdn.microsoft.com/library/azure/mt163647.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Compute.json) | [Microsoft.Compute](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Compute%22&type=Code) |
| Virtual Machines (classic) | Limited | - | - |
| Remote App | No      | -        | -      |
| Cloud Services (classic) | Limited (see below) | - | - | - |

Virtual Machines (classic) refers to resources that were deployed through the classic deployment model, instead of through the Resource Manager deployment model. In general, these resources do not support Resource Manager operations, but there 
are some operations that have been enabled. For more information about these deployment models, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md). 

Cloud Services (classic) can be used with other classic resources; however, classic resources do not take advantage of all Resource Manager features and are not a good option for future solutions. Instead, consider changing your application infrastructure to use resources from the Microsoft.Compute, Microsoft.Storage, and Microsoft.Network namespaces.


## Networking

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | -------  | -------- | ------ | ------ |
| Application Gateway | Yes | [Application Gateway REST](https://msdn.microsoft.com/library/azure/mt684939.aspx)   |        | [applicationGateways](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FapplicationGateways%22&type=Code) |
| DNS     | Yes | [DNS REST](https://msdn.microsoft.com/library/azure/mt163862.aspx)         | [2016-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-04-01/Microsoft.Network.json) | [dnsZones](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FdnsZones%22&type=Code) |
| ExpressRoute | Yes  | [ExpressRoute REST](https://msdn.microsoft.com/library/azure/mt586720.aspx)  |       | [expressRouteCircuits](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FexpressRouteCircuits%22&type=Code) |
| Load Balancer | Yes  | [Load Balancer REST](https://msdn.microsoft.com/library/azure/mt163651.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) | [loadBalancers](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2Floadbalancers%22&type=Code) |
| Traffic Manager | Yes | [Traffic Manager REST](https://msdn.microsoft.com/library/azure/mt163667.aspx) | [2015-11-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-11-01/Microsoft.Network.json)  | [trafficmanagerprofiles](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2Ftrafficmanagerprofiles%22&type=Code) |
| Virtual Networks | Yes| [Virtual Network REST](https://msdn.microsoft.com/en-us/library/azure/mt163650.aspx) | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Network.json) | [virtualNetworks](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FvirtualNetworks%22&type=Code) |
| VPN Gateway | Yes | [Network Gateway REST](https://msdn.microsoft.com/library/azure/mt163859.aspx) |  | [virtualNetworkGateways](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FvirtualNetworkGateways%22&type=Code) <br /> [localNetworkGateways](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2FlocalNetworkGateways%22&type=Code) <br />[connections](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Network%2Fconnections%22&type=Code) |



## Data & Storage

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------- | ------ |
| DocumentDB | Yes  | [DocumentDB REST](https://msdn.microsoft.com/library/azure/dn781481.aspx) | [2015-04-08](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-04-08/Microsoft.DocumentDB.json)  | [Microsoft.DocumentDB](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.DocumentDb%22&type=Code) |
| Redis Cache | Yes |   | [2016-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-04-01/Microsoft.Cache.json) | [Microsoft.Cache](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Cache%22&type=Code) |
| Search | Yes  | [Search REST](https://msdn.microsoft.com/library/azure/dn798935.aspx) |  | [Microsoft.Search](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Search%22&type=Code) |
| Storage | Yes  | [Storage REST](https://msdn.microsoft.com/library/azure/mt163683.aspx) | [Storage account](resource-manager-template-storage.md) | [Microsoft.Storage](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Storage%22&type=Code) |
| SQL Database | Yes | [SQL Database REST](https://msdn.microsoft.com/library/azure/mt163571.aspx) | [2014-04-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01-preview/Microsoft.Sql.json) | [Microsoft.Sql](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Sql%22&type=Code) |
| SQL Data Warehouse | Yes |   |      |
| StorSimple | No  | -        | -       | - |

## Web & Mobile

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| API Apps | Yes |   | [2015-03-01-preview](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-03-01-preview/Microsoft.AppService.json) | [API Apps](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22kind%22%3A+%22apiApp%22&type=Code) |
| API Management | Yes  | [API Management REST](https://msdn.microsoft.com/library/azure/dn776326.aspx) |        | [Microsoft.ApiManagement](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.ApiManagement%22&type=Code) | 
| Logic Apps | Yes   |          |        | [Microsoft.Logic](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Logic%22&type=Code) |
| Mobile Apps | Yes |  |  |   |
| Mobile Engagements | Yes  |          |        | [Microsoft.MobileEngagements](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.MobileEngagement%22&type=Code) |
| Web Apps | Yes |          | [2015-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-08-01/Microsoft.Web.json) | [Microsoft.Web](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Web%22&type=Code) |

## Analytics

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | -------  | -------- | ------ | ------ |
| Data Factory | Yes | [Data Factory REST](https://msdn.microsoft.com/library/azure/dn906738.aspx) |    | [Microsoft.DataFactory](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.DataFactory%22&type=Code) |
| Data Lake Analytics | Yes |   |   |   |
| Data Lake Store | Yes  |  |  |  |
| HDInsights | Yes | [HDInsights REST](https://msdn.microsoft.com/library/azure/mt622197.aspx) |        | [Microsoft.HDInsight](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.HDInsight%22&type=Code) |
| Stream Analytics | Yes  | [Steam Analytics REST](https://msdn.microsoft.com/library/azure/dn835031.aspx)   |        | [Microsoft.StreamAnalytics](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.StreamAnalytics%22&type=Code) |
| Machine Learning | No | -        | -      |
| Data Catalog | No  | -        | -       |

## Internet of Things

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| Event Hub | Yes  | [Event Hub REST](https://msdn.microsoft.com/library/azure/dn790674.aspx) |        | [Microsoft.EventHub](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.EventHub%22&type=Code) |
| IoTHubs | Yes | [IoT Hub REST](https://msdn.microsoft.com/library/azure/mt589014.aspx) |        | [Microsoft.Devices](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Devices%22&type=Code) |
| Notification Hubs | Yes | [Notification Hub REST](https://msdn.microsoft.com/library/azure/dn495827.aspx) | [2015-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2015-04-01/Microsoft.NotificationHubs.json) | [Microsoft.NotificationHubs](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.NotificationHubs%22&type=Code) |

## Media & CDN

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| CDN | Yes | [CDN REST](https://msdn.microsoft.com/library/azure/mt634456.aspx)  |  | [Microsoft.Cdn](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Cdn%22&type=Code) |
| Media Service | No |  |  |


## Hybrid Integration

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| BizTalk Services | Yes |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.BizTalkServices.json) | [Microsoft.BizTalkServices](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.BizTalkServices%22&type=Code) |
| Service Bus | Yes |  |        | [Microsoft.ServiceBus](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.ServiceBus%22&type=Code) |

## Identity & Access Management 

Azure Active Directory works with Resource Manager to enable role-based access control for your subscription. To learn about using role-based access control and Active Directory, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

## Developer Services 

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| Application Insights | Yes  |          | [2014-04-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.Insights.json) | [Microsoft.insights](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.insights%22&type=Code) |
| Bing Maps | Yes  |          |        | [Microsoft.BingMaps](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.BingMaps%22&type=Code) |
| DevTest Labs | Yes |   | [2016-05-15](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-05-15/Microsoft.DevTestLab.json) | [Microsoft.DevTestLab](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.DevTestLab%22&type=Code)  |
| Visual Studio account | Yes   |          | [2014-02-26](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-02-26/microsoft.visualstudio.json) | [Microsoft.VisualStudio](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.VisualStudio%22&type=Code) |

## Management and Security

| Service | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------- | ------ | ------ |
| Automation | Yes | [Automation REST](https://msdn.microsoft.com/library/azure/mt662285.aspx) |        | [Microsoft.Automation](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Automation%22&type=Code) |
| Key Vault | Yes | [Key Vault REST](https://msdn.microsoft.com/library/azure/dn903609.aspx) | [Key vault](resource-manager-template-keyvault.md)<br />[Key vault secret](resource-manager-template-keyvault-secret.md)   | [Microsoft.KeyVault](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.KeyVault%22&type=Code) |
| Operational Insights | Yes |          |        | [Microsoft.OperationalInsights](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.OperationalInsights%22&type=Code) |
| Recovery Services | Yes |  | [2016-06-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-06-01/Microsoft.RecoveryServices.json) |  |
| Scheduler | Yes  | [Scheduler REST](https://msdn.microsoft.com/library/azure/mt629143.aspx)     | [2014-08-01](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-08-01/Microsoft.Scheduler.json) | [Microsoft.Scheduler](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Scheduler%22&type=Code) |
| Security (preview) | Yes |  |  | [Microsoft.Security](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Security%22&type=Code)  |

## Resource Manager

| Feature | Resource Manager Enabled | REST API | Schema | Quickstart Templates |
| ------- | ------- | -------------- | -------- | ------ | ------ |
| Authorization | Yes | [Management locks](https://msdn.microsoft.com/library/azure/mt204563.aspx)<br >[Role-based access control](https://msdn.microsoft.com/library/azure/dn906885.aspx)  | [Resource lock](resource-manager-template-lock.md)<br />[Role assignments](resource-manager-template-role.md)  | [Microsoft.Authorization](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Authorization%22&type=Code) |
| Resources | Yes | [Linked resources](https://msdn.microsoft.com/library/azure/mt238499.aspx) | [Resource links](resource-manager-template-links.md) | [Microsoft.Resources](https://github.com/Azure/azure-quickstart-templates/search?utf8=%E2%9C%93&q=%22Microsoft.Resources%22&type=Code) |


## Resource providers and types

When deploying resources, you frequently need to retrieve information about the resource providers and types. You can retrieve this information through REST API, Azure PowerShell, or Azure CLI.

To work with a resource provider, that resource provider must be registered with your account. By default, many resource providers are automatically registered; however, you may need to manually register some resource providers. The examples below show how to get the registration status of a resource provider, and register the resource provider, if needed.

### REST API

To get all of the available resource providers, including their types, locations, API versions, and registration status, use the [List all resource providers](https://msdn.microsoft.com/library/azure/dn790524.aspx) operation. If you need to register a resource provider, see [Register a subscription with a resource provider](https://msdn.microsoft.com/library/azure/dn790548.aspx).

### PowerShell

The following example shows how to get all of the available resource providers.

    Get-AzureRmResourceProvider -ListAvailable
    
The output will be similar to:

    ProviderNamespace               RegistrationState ResourceTypes
    -----------------               ----------------- -------------
    Microsoft.ApiManagement         Unregistered      {service, validateServiceName, checkServiceNameAvailability}
    Microsoft.AppService            Registered        {apiapps, appIdentities, gateways, deploymenttemplates...}
    ...

The next example shows how to get the resource types for a particular resource provider.

    (Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes
    
The output will be similar to:

    ResourceTypeName                Locations                                         ApiVersions
    ----------------                ---------                                         ------
    sites/extensions                {Brazil South, East Asia, East US, Japan East...} {20...
    sites/slots/extensions          {Brazil South, East Asia, East US, Japan East...} {20...
    ...
    
To register a resource provider provide the namespace:

    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ApiManagement

### Azure CLI

The following example shows how to get all of the available resource providers.

    azure provider list
    
The output will be similar to:

    info:    Executing command provider list
    + Getting ARM registered providers
    data:    Namespace                        Registered
    data:    -------------------------------  -------------
    data:    Microsoft.ApiManagement          Unregistered
    data:    Microsoft.AppService             Registered
    data:    Microsoft.Authorization          Registered
    ...

You can save the information for a particular resource provider to a file with the following command.

    azure provider show Microsoft.Web -vv --json > c:\temp.json

To register a resource provider provide the namespace:

    azure provider register -n Microsoft.ServiceBus

## Supported regions

When deploying resources, you typically need to specify a region for the resources. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. In addition, there 
may be limitations on your subscription which prevent you from using some regions that support the resource. These limitations may be related to tax issues for your home country, or the result of a policy placed 
by your subscription administrator to use only certain regions. 

For a complete list of all supported regions for all Azure services, see [Services by region](https://azure.microsoft.com/regions/#services); however, this list may include regions that your subscription does not support. You can determine the regions for a particular resource type that your subscription supports by running one of the following commands.

### REST API

To discover which regions are available for a particular resource type in your subscription, use the [List all resource providers](https://msdn.microsoft.com/library/azure/dn790524.aspx) operation. 

### PowerShell

The following example shows how to get the supported regions for web sites.

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
    
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

You can also filter the location results with a JSON utility like [jq](https://stedolan.github.io/jq/).

    azure location list --json | jq '.[] | select(.name == "Microsoft.Web/sites")'

Which returns:

    {
      "name": "Microsoft.Web/sites",
      "location": "Brazil South,East Asia,East US,Japan East,Japan West,North Central US,
            North Europe,South Central US,West Europe,West US,Southeast Asia,Central US,East US 2"
    }

## Supported API versions

When you deploy a template, you must specify an API version to use for creating each resource. The API version corresponds to a version of REST API operations that are released by the resource provider. 
As a resource provider enables new features, it will release a new version of the REST API. Therefore, the version of the API you specify in your template affects which properties you can specify in the 
template. In general, you will want to select the most recent API version when creating new templates. For existing templates, you can decide whether you want to continue using an earlier API version, or update your template for the latest version to take advantage of new features.

### REST API

To discover which API versions are available for resource types, use the [List all resource providers](https://msdn.microsoft.com/library/azure/dn790524.aspx) operation. 

### PowerShell

The following example shows how to get the available API versions for a paticular resource type.

    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions
    
The output will be similar to:
    
    2015-08-01
    2015-07-01
    2015-06-01
    2015-05-01
    2015-04-01
    2015-02-01
    2014-11-01
    2014-06-01
    2014-04-01-preview
    2014-04-01

### Azure CLI

You can save the information (including the available API versions) for a resource provider to a file with the following command.

    azure provider show Microsoft.Web -vv --json > c:\temp.json

You can open the file and find the **apiVersions** element

## Next steps

- To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- To learn about deploying resources, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).
