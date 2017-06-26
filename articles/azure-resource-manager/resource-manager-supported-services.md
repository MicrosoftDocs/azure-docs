---
title: Resource Manager supported services | Microsoft Docs
description: Describes the resource providers that support Resource Manager, their schemas and available API versions, and the regions that can host the resources.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 3c7a6fe4-371a-40da-9ebe-b574f583305b
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2017
ms.author: tomfitz

---
# Resource Manager providers, regions, API versions and schemas
This topic provides a list of resource providers that support Azure Resource Manager.

When deploying your resources, you also need to know which regions support those resources and which API versions are available for the resources. The section [Supported regions](#supported-regions) shows you how to find out which regions work for your subscription and resources. The section [Supported API versions](#supported-api-versions) shows you how to determine which API versions you can use.

To see which services are supported in the Azure portal and classic portal, see [Azure portal availability chart](https://azure.microsoft.com/features/azure-portal/availability/). To see which services support moving resources, see [Move resources to new resource group or subscription](resource-group-move-resources.md).

The following tables list which Microsoft services support deployment and management through Resource Manager and which do not. There are also many third-party resource providers that support Resource Manager. You learn how to see all the resource providers in the [Resource providers and types](#resource-providers-and-types) section.

## Compute
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| Batch |Yes |[Batch REST](/rest/api/batchservice) |[Batch resources](/azure/templates/microsoft.batch/batchaccounts) |
| Container Registry |Yes |[Container Registry REST](/rest/api/containerregistry) |[Container Registry resources](/azure/templates/microsoft.containerregistry/registries) |
| Container Service |Yes |[Container Service REST](/rest/api/compute/containerservices) |[Container Service resources](/azure/templates/microsoft.containerservice/containerservices) |
| Dynamics Lifecycle Services |Yes | | |
| Scale Sets |Yes |[Scale Set REST](/rest/api/virtualmachinescalesets/) |[Scale Set resources](/azure/templates/microsoft.compute/virtualmachinescalesets) |
| Service Fabric |Yes |[Service Fabric Rest](/rest/api/servicefabric) | [Service Fabric resources](/azure/templates/microsoft.servicefabric/clusters) |
| Virtual Machines |Yes |[VM REST](/rest/api/compute/virtualmachines) |[VM resources](/azure/templates/microsoft.compute/virtualmachines) |
| Virtual Machines (classic) |Limited |- |- |
| Remote App |No |- |- |
| Cloud Services (classic) |Limited (see below) |- |- |

Virtual Machines (classic) refers to resources that were deployed through the classic deployment model, instead of through the Resource Manager deployment model. In general, these resources do not support Resource Manager operations, but there 
are some operations that have been enabled. For more information about these deployment models, see [Understanding Resource Manager deployment and classic deployment](resource-manager-deployment-model.md). 

Cloud Services (classic) can be used with other classic resources. However, classic resources do not take advantage of all Resource Manager features and are not a good option for future solutions. Instead, consider changing your application infrastructure to use resources from the Microsoft.Compute, Microsoft.Storage, and Microsoft.Network namespaces.

## Networking
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| Application Gateway |Yes |[Application Gateway REST](https://msdn.microsoft.com/library/azure/mt684939.aspx) | [Application Gateway resources](/azure/templates/microsoft.network/applicationgateways) |
| DNS |Yes |[DNS REST](/rest/api/dns) |[DNS resources](/azure/templates/microsoft.network/dnszones) |
| ExpressRoute |Yes |[ExpressRoute REST](https://msdn.microsoft.com/library/azure/mt586720.aspx) | [ExpressRoute resources](/azure/templates/microsoft.network/expressroutecircuits) |
| Load Balancer |Yes |[Load Balancer REST](https://msdn.microsoft.com/library/azure/mt163651.aspx) |[Load Balancer resources](/azure/templates/microsoft.network/loadbalancers) |
| Traffic Manager |Yes |[Traffic Manager REST](https://msdn.microsoft.com/library/azure/mt163667.aspx) |[Traffic Manager resources](/azure/templates/microsoft.network/trafficmanagerprofiles) |
| Virtual Networks |Yes |[Virtual Network REST](https://msdn.microsoft.com/library/azure/mt163650.aspx) |[Virtual Network resources](/azure/templates/microsoft.network/virtualnetworks) |
| Network Gateway |Yes |[Network Gateway REST](https://msdn.microsoft.com/library/azure/mt163859.aspx) | [Connection resources](/azure/templates/microsoft.network/connections) <br /> [Local Network Gateway resources](/azure/templates/microsoft.network/localnetworkgateways) <br /> [Virtual Network Gateway resources](/azure/templates/microsoft.network/virtualnetworkgateways) |

## Storage
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- | --- |
| Import Export | Yes | [Import Export REST](/rest/api/storageimportexport/) | [Import Export resources](/azure/templates/microsoft.importexport/jobs) |
| Storage |Yes |[Storage REST](/rest/api/storagerp) |[Storage resources](/azure/templates/microsoft.storage/storageaccounts) |
| StorSimple |Yes | | |

## Databases
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- | --- |
| DocumentDB |Yes |[DocumentDB REST](/rest/api/documentdbresourceprovider) |[DocumentDB resources](/azure/templates/microsoft.documentdb/databaseaccounts) |
| Redis Cache |Yes | [Redis Cache REST](/rest/api/redis) |[Redis resources](/azure/templates/microsoft.cache/redis) |
| SQL Database |Yes |[SQL Database REST](/rest/api/sql) |[SQL Database resources](/azure/templates/microsoft.sql/servers) |
| SQL Data Warehouse |Yes | | |

## Web & Mobile
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| API Apps |Yes | [App Service REST](/rest/api/appservice) |[Web resources](/azure/templates/microsoft.web/sites) |
| API Management |Yes |[API Management REST](/rest/api/apimanagement) |[API Management resources](/azure/templates/microsoft.apimanagement/service) |
| Certificate Registration | Yes | [Certificate Registration REST](/rest/api/appservice/appservicecertificateorders) | [Certificate Registration resources](/azure/templates/microsoft.certificateregistration/certificateorders)  |
| Content Moderator |Yes | | | |
| Domain Registration | Yes | [Domain Registration](/rest/api/appservice/domains) | [Domain Registration resources](/azure/templates/microsoft.domainregistration/domains)  |
| Function App |Yes | [Function App REST](/rest/api/appservice) | [Web resources](/azure/templates/microsoft.web/sites) |
| Logic Apps |Yes |[Logic Apps REST](/rest/api/logic) |[Logic App resources](/azure/templates/microsoft.logic/workflows) |
| Mobile Apps |Yes | [App Service REST](/rest/api/appservice) | [Web resources](/azure/templates/microsoft.web/sites) |
| Mobile Engagements |Yes |[Mobile Engagement REST](https://msdn.microsoft.com/library/azure/mt683754.aspx) | |
| Search |Yes |[Search REST](/rest/api/searchservice) | [Search resources](/azure/templates/microsoft.search/searchservices) |
| Web Apps |Yes | [Web Apps REST](/rest/api/appservice/webapps) | [Web resources](/azure/templates/microsoft.web/sites) |

## Intelligence + Analytics
| Service | Resource Manager Enabled | REST API | Template format | 
| --- | --- | --- | --- |
| Analysis Services | Yes | [Analysis Service REST](/rest/api/analysisservices) | [Analysis Services resources](/azure/templates/microsoft.analysisservices/servers) |
| Cognitive Services |Yes | [Cognitive Services REST](/rest/api/cognitiveservices) |[Cognitive Services resources](/azure/templates/microsoft.cognitiveservices/accounts) |
| Data Catalog |Yes |[Data Catalog REST](/rest/api/datacatalog) |[Data Catalog Schema](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2016-03-30/Microsoft.DataCatalog.json) |
| Data Factory |Yes |[Data Factory REST](/rest/api/datafactory) | |
| Data Lake Analytics |Yes | [Data Lake REST](/rest/api/datalakeanalytics) |[Data Lake Analytics resources](/azure/templates/microsoft.datalakeanalytics/accounts) |
| Data Lake Store |Yes |[Data Lake Store REST](/rest/api/datalakestore) |[Data Lake Store resources](/azure/templates/microsoft.datalakestore/accounts) |
| HDInsights |Yes |[HDInsights REST](/rest/api/hdinsight) | |
| Machine Learning |Yes |[Machine Learning REST](/rest/api/machinelearning) |[Machine Learning resources](/azure/templates/microsoft.machinelearning/commitmentplans) |
| Stream Analytics |Yes |[Steam Analytics REST](/rest/api/streamanalytics) | |
| Power BI |Yes |[Power BI Embedded REST](/rest/api/powerbiembedded) |[Power BI resources](/azure/templates/microsoft.powerbi/workspacecollections) |


## Internet of Things
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| Event Hub |Yes |[Event Hub REST](/rest/api/eventhub) |[Event Hub resources](/azure/templates/microsoft.eventhub/namespaces) |
| IoTHubs |Yes |[IoT Hub REST](/rest/api/iothub) |[IoT Hub resources](/azure/templates/microsoft.devices/iothubs) |
| Notification Hubs |Yes |[Notification Hub REST](/rest/api/notificationhubs) |[Notification Hub resources](/azure/templates/microsoft.notificationhubs/namespaces) |

## Media & CDN
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| CDN |Yes |[CDN REST](/rest/api/cdn) |[CDN resources](/azure/templates/microsoft.cdn/profiles) |
| Media Service |Yes |[Media Services REST](/rest/api/media) |[Media resources](/azure/templates/microsoft.media/mediaservices) |

## Enterprise Integration
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| BizTalk Services |Yes | |[BizTalk Schema](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-04-01/Microsoft.BizTalkServices.json) |
| Relay | Yes |  | [Relay resources](/azure/templates/microsoft.relay/namespaces) |
| Service Bus |Yes |[Service Bus REST](/rest/api/servicebus) |[Service Bus resources](/azure/templates/microsoft.servicebus/namespaces) |

## Identity & Access Management
Azure Active Directory works with Resource Manager to enable role-based access control for your subscription. To learn about using role-based access control and Azure Active Directory, see [Azure Role-based Access Control](../active-directory/role-based-access-control-configure.md).

## Developer Services
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| Monitor |Yes |[Monitor REST](/rest/api/monitor) |[Insights resources](/azure/templates/microsoft.insights/alertrules) |
| Bing Maps |Yes | | |
| DevTest Labs |Yes | [DevTest Labs REST](/rest/api/dtl) |[DevTest Labs resources](/azure/templates/microsoft.devtestlab/labs) |
| Visual Studio account |Yes | |[Visual Studio Schema](https://github.com/Azure/azure-resource-manager-schemas/blob/master/schemas/2014-02-26/microsoft.visualstudio.json) |

## Management and Security
| Service | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- |
| Advisor | Yes | [Advisor REST](/rest/api/advisor/) | - |
| Automation |Yes |[Automation REST](https://msdn.microsoft.com/library/azure/mt662285.aspx) |[Automation resources](/azure/templates/microsoft.automation/automationaccounts) |
| Billing | Yes | [Billing REST](/rest/api/billing/) | - |
| Key Vault |Yes |[Key Vault REST](/rest/api/keyvault) |[Key vault resources](/azure/templates/microsoft.keyvault/vaults) |
| Operational Insights |Yes | | |
| Recovery Service |Yes |[Recovery Services REST](/rest/api/recoveryservices) |[Recovery Services resources](/azure/templates/microsoft.recoveryservices/vaults) |
| Scheduler |Yes |[Scheduler REST](/rest/api/scheduler) |[Scheduler resources](/azure/templates/microsoft.scheduler/jobcollections) |
| Security |Yes |[Security REST](https://msdn.microsoft.com/library/azure/mt704034.aspx) | |
| Server Management | Yes | [Server Management REST](/rest/api/servermanagement/) | [Server Management resources](/azure/templates/microsoft.servermanagement/gateways) |

## Resource Manager
| Feature | Resource Manager Enabled | REST API | Template format |
| --- | --- | --- | --- | --- |
| Authorization |Yes |[Authorization REST](/rest/api/authorization) |[Authorization resources](/azure/templates/microsoft.authorization/locks) |
| Resources |Yes |[Resources REST](/rest/api/resources) |[Deployment resources](/azure/templates/microsoft.resources/deployments) |

## Resource providers and types
When deploying resources, you frequently need to retrieve information about the resource providers and types. You can retrieve this information through REST API, Azure PowerShell, or Azure CLI.

To work with a resource provider, that resource provider must be registered with your account. By default, many resource providers are automatically registered; however, you may need to manually register some resource providers. The examples in this section show how to get the registration status of a resource provider, and register the resource provider.

### Portal
You can easily see a list of supported resources providers by selecting **Resource providers** from the subscription blade. To register your subscription with a resource provider, select the **Register** link.
   
![list resource providers](./media/resource-manager-supported-services/view-resource-providers.png)

### REST API
To get all the available resource providers, including their types, locations, API versions, and registration status, use the [List all resource providers](https://docs.microsoft.com/rest/api/resources/providers#Providers_List) operation. If you need to register a resource provider, see [Register a subscription with a resource provider](https://docs.microsoft.com/rest/api/resources/providers#Providers_Register).

### PowerShell
The following example shows how to get all the available resource providers.

```powershell
Get-AzureRmResourceProvider -ListAvailable
```


The next example shows how to get the resource types for a particular resource provider.

```powershell
(Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes
```

To register a resource provider, provide the namespace:

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.ApiManagement
```

### Azure CLI
The following example shows how to get all the available resource providers.

```azurecli
az provider list
```

You can view the information for a particular resource provider with the following command:

```azurecli
az provider show --namespace Microsoft.Web
```

To register a resource provider, provide the namespace:

```azurecli
az provider register --namespace Microsoft.ServiceBus
```

## Supported regions
When deploying resources, you typically need to specify a region for the resources. Resource Manager is supported in all regions, but the resources you deploy might not be supported in all regions. In addition, there may be limitations on your subscription that prevent you from using some regions that support the resource. These limitations may be related to tax issues for your home country, or the result of a policy placed by your subscription administrator to use only certain regions. 

For a complete list of all supported regions for all Azure services, see [Services by region](https://azure.microsoft.com/regions/#services). However, this list may include regions that your subscription does not support. You can determine the regions for a particular resource type that your subscription supports through the portal, REST API, PowerShell, or Azure CLI.

### Portal
You can see the supported regions for a resource type through the following steps:

1. Select **More services** > **Resource Explorer**.
   
    ![resource explorer](./media/resource-manager-supported-services/select-resource-explorer.png)
2. Open the **Providers** node.
   
    ![select providers](./media/resource-manager-supported-services/select-providers.png)
3. Select a resource provider, and view the supported regions and API versions.
   
    ![view provider](./media/resource-manager-supported-services/view-provider.png)

### REST API
To discover which regions are available for a particular resource type in your subscription, use the [List all resource providers](https://docs.microsoft.com/rest/api/resources/providers#Providers_List) operation. 

### PowerShell
The following example shows how to get the supported regions for web sites.

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
```

### Azure CLI
The following example show how to get the supported locations for web sits.

```azurecli
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```


## Supported API versions
When you deploy a template, you must specify an API version to use for creating each resource. The API version corresponds to a version of REST API operations that are released by the resource provider. As a resource provider enables new features, it releases a new version of the REST API. Therefore, the version of the API you specify in your template affects which properties you can specify in the template. In general, you want to select the most recent API version when creating templates. For existing templates, you can decide whether you want to continue using an earlier API version, or update your template for the latest version to take advantage of new features.

### Portal
You determine the supported API versions in the same way you determined supported regions (shown previously).

### REST API
To discover which API versions are available for resource types, use the [List all resource providers](https://docs.microsoft.com/rest/api/resources/providers#Providers_List) operation. 

### PowerShell
The following example shows how to get the available API versions for a particular resource type.

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions
```

The output is similar to:

```powershell
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
```

### Azure CLI
You get the available API versions for a resource provider with the following command:

```azurecli
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].apiVersions"
```

## Next steps
* To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To learn about deploying resources, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

