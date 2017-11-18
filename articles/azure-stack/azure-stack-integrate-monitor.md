---
title: Integrate external monitoring solution with Azure Stack | Microsoft Docs
description: Learn how to integrate Azure Stack with an external monitoring solution in your datacenter.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 856738a7-1510-442a-88a8-d316c67c757c
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/20/2017
ms.author: twooley

---
# Integrate external monitoring solution with Azure Stack

*Applies to: Azure Stack integrated systems*

For external monitoring of the Azure Stack infrastructure, you need to monitor the Azure Stack software, the physical computers, and the physical network switches. Each of these areas offers a method to retrieve health and alert information.

- Azure Stack software offers a REST-based API to retrieve health and alerts. (With the use of software-defined technologies like Storage Spaces Direct, storage health and alerts are part of software monitoring.)
- Physical computers can make health and alert information available via the baseboard management controllers (BMCs).
- Physical network devices can make health and alert information available via the SNMP protocol.

Each Azure Stack solution ships with a hardware lifecycle host. This host runs the Original Equipment Manufacturer (OEM) hardware vendor’s monitoring software for the physical servers and network devices. If desired, you can bypass these monitoring solutions and directly integrate with existing monitoring solutions in your datacenter.

The following diagram shows traffic flow between an Azure Stack integrated system, the hardware lifecycle host, an external monitoring solution, and an external ticketing/data collection system.

![Diagram showing traffic between Azure Stack, monitoring, and ticketing solution.](media/azure-stack-integrate-monitor/MonitoringIntegration.png)  

This article explains how to integrate Azure Stack with external monitoring solutions such as System Center Operations Manager and Nagios. It also includes how to work with alerts programmatically by using PowerShell or through REST API calls.

> [!IMPORTANT]
> The external monitoring solution you use must be agentless. You can't install third-party agents inside Azure Stack components.

## Integrate with Operations Manager

You can use Operations Manager for external monitoring of Azure Stack. The System Center Management Pack for Microsoft Azure Stack enables you to monitor multiple Azure Stack deployments with a single Operations Manager instance. The management pack uses the Health resource provider and Update resource provider REST APIs to communicate with Azure Stack. If you plan to bypass the OEM monitoring software that's running on the hardware lifecycle host, you can install vendor management packs to monitor physical servers. You can also use Operations Manager network device discovery to monitor network switches.

The management pack for Azure Stack provides the following capabilities:

- You can manage multiple Azure Stack deployments.
- There's support for Azure Active Directory (Azure AD) and Active Directory Federation Services (AD FS).
- You can retrieve and close alerts.
- There's a Health and a Capacity dashboard.
- Includes Auto Maintenance Mode detection for when patch and update (P&U) is in progress.
- Includes Force Update tasks for deployment and region.
- You can add custom information to a region.
- Supports notification and reporting.

You can download the System Center Management Pack for Microsoft Azure Stack and the associated user guide [here](https://www.microsoft.com/en-us/download/details.aspx?id=55184), or directly from Operations Manager.

For a ticketing solution, you can integrate Operations Manager with System Center Service Manager. The integrated product connector enables bi-directional communication that allows you to close an alert in Azure Stack and Operations Manager after you resolve a service request in Service Manager.

The following diagram shows integration of Azure Stack with an existing System Center deployment. You can automate Service Manager further with System Center Orchestrator or Service Management Automation (SMA) to run operations in Azure Stack.

![Diagram showing integration with OM, Service Manager, and SMA.](media/azure-stack-integrate-monitor/SystemCenterIntegration.png)

## Integrate with Nagios

A Nagios monitoring plugin was developed together with the partner Cloudbase solutions, which is available under the permissive free software license – MIT (Massachusetts Institute of Technology).

The plugin is written in Python and leverages the health resource provider REST API. It offers basic functionality to retrieve and close alerts in Azure Stack. Like the System Center management pack, it enables you to add multiple Azure Stack deployments and to send notifications.

The plugin works with Nagios Enterprise and Nagios Core. You can download it [here](https://exchange.nagios.org/directory/Plugins/Cloud/Monitoring-AzureStack-Alerts/details). The download site also includes installation and configuration details.

### Plugin parameters

Configure the plugin file “Azurestack_plugin.py” with the following parameters:

| Parameter | Description | Example |
|---------|---------|---------|
| *arm_endpoint* | Azure Resource Manager (administrator) endpoint |https://adminmanagement.local.azurestack.external |
| *api_endpoint* | Azure Resource Manager (administrator) endpoint  | https://adminmanagement.local.azurestack.external |
| *Tenant_id* | Admin subscription ID | Retrieve via the administrator portal or PowerShell |
| *User_name* | Operator subscription username | operator@myazuredirectory.onmicrosoft.com |
| *User_password* | Operator subscription password | mypassword |
| *Client_id* | Client | 0a7bdc5c-7b57-40be-9939-d4c5fc7cd417* |
| *region* |  Azure Stack region name | local |
|  |  |

*The PowerShell GUID that’s provided is universal. You can use it for each deployment.

## Use PowerShell to monitor health and alerts

If you're not using Operations Manager, Nagios, or a Nagios-based solution, you can use PowerShell to enable a broad range of monitoring solutions to integrate with Azure Stack. To use PowerShell, make sure that you have [PowerShell installed and configured](azure-stack-powershell-configure-quickstart.md) for an Azure Stack operator environment. Install PowerShell on a local computer that can reach the Resource Manager (administrator) endpoint (https://adminmanagement.[region].[External_FQDN]).

1. Run the following commands to connect to the Azure Stack environment as an Azure Stack operator:

   ```PowerShell
   Add-AzureRMEnvironment -Name "AzureStackAdmin" -ArmEndpoint https://adminmanagement.[Region].[External_FQDN]

   Login-AzureRmAccount -EnvironmentName "AzureStackAdmin"
   ```
3. Change to the directory where you installed the [Azure Stack tools](https://github.com/Azure/AzureStack-Tools) as part of the PowerShell installation, for example, c:\azurestack-tools-master. Then, change to the Infrastructure directory and run the following command to import the Infrastructure module:

   ```PowerShell
   Import-Module .\AzureStack.Infra.psm1
    ```
4. Use commands such as the following examples to work with alerts:
   ```PowerShell
   #Retrieve all alerts
   Get-AzsAlert -location [Region]

   #Filter for active alerts
   $Active=Get-AzsAlert -location [Region] | Where {$_.State -eq "active"}
   $Active

   #Close alert
   Close-AzsAlert -location [Region] -AlertID "ID"

   #Retrieve resource provider health
   Get-AzsResourceProviderHealths -location [Region]

   #Retrieve infrastructure role instance health
   Get-AzsInfrastructureRoleHealths -location [Region]
   ```

## Use the REST API to monitor health and alerts

You can use REST API calls to get alerts, close alerts, and get the health of resource providers.

### Get Alert

**Request**

The request gets all active and closed alerts for the default provider subscription. There is no request body.


|Method  |Request URI  |
|---------|---------|
|GET     |   https://{armendpoint}/subscriptions/{subId}/resourceGroups/system.{RegionName}/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/{RegionName}/Alerts?api-version=2016-05-01"      |
|     |         |

**Arguments**

|Argument  |Description  |
|---------|---------|
|armendpoint     |  The Azure Resource Manager endpoint of your Azure Stack environment, in the format https://adminmanagement.{RegionName}.{External FQDN}. For example, if the external FQDN is *azurestack.external* and region name is *local*, then the Resource Manager endpoint is https://adminmanagement.local.azurestack.external.       |
|subid     |   Subscription ID of the user who is making the call. You can use this API to query only with a user who has permission to the default provider subscription.      |
|RegionName     |    The region name of the Azure Stack deployment.     |
|api-version     |  Version of the protocol that is used to make this request. You must use 2016-05-01.      |
|     |         |

**Response**

```http
GET https://adminmanagement.local.azurestack.external/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/Alerts?api-version=2016-05-01 HTTP/1.1
```

```json
{
"value":[
{"id":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/alerts/71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"name":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"type":"Microsoft.InfrastructureInsights.Admin/regionHealths/alerts",
"location":"local",
"tags":{},
"properties":
{
"closedTimestamp":"",
"createdTimestamp":"2017-08-10T20:13:57.4398842Z",
"description":[{"text":"The infrastructure role (Updates) is experiencing issues.",
"type":"Text"}],
"faultId":"ServiceFabric:/UpdateResourceProvider/fabric:/AzurestackUpdateResourceProvider",
"alertId":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"faultTypeId":"ServiceFabricApplicationUnhealthy",
"lastUpdatedTimestamp":"2017-08-10T20:18:58.1584868Z",
"alertProperties":
{
"healthState":"Warning",
"name":"Updates",
"fabricName":"fabric:/AzurestackUpdateResourceProvider",
"description":null,
"serviceType":"UpdateResourceProvider"},
"remediation":[{"text":"1. Navigate to the (Updates) and restart the role. 2. If after closing the alert the issue persists, please contact support.",
"type":"Text"}],
"resourceRegistrationId":null,
"resourceProviderRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"serviceRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"severity":"Warning",
"state":"Active",
"title":"Infrastructure role is unhealthy",
"impactedResourceId":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.Fabric.Admin/fabricLocations/local/infraRoles/UpdateResourceProvider",
"impactedResourceDisplayName":"UpdateResourceProvider",
"closedByUserAlias":null
}
},

…
```

**Response details**


|  Argument  |Description  |
|---------|---------|
|*id*     |      Unique ID of the alert.   |
|*name*     |     Internal name of the alert.   |
|*type*     |     Resource definition.    |
|*location*     |    	Region name.     |
|*tags*     |   Resource tags.     |
|*closedtimestamp*    |  UTC time when the alert was closed.    |
|*createdtimestamp*     |     UTC time when the alert was created.   |
|*description*     |    Description of the alert.     |
|*faultid*     | Affected component.        |
|*alertid*     |  Unique ID of the alert.       |
|*faulttypeid*     |  Unique type of faulty component.       |
|*lastupdatedtimestamp*     |   UTC time when alert information was last updated.    |
|*healthstate*     | Overall health status.        |
|*name*     |   Name of the specific alert.      |
|*fabricname*     |    Registered fabric name of the faulty component.   |
|*description*     |  Description of the registered fabric component.   |
|*servicetype*     |   Type of the registered fabric service.   |
|*remediation*     |   Recommended remediation steps.    |
|*type*     |   Alert type.    |
|*resourceRegistrationid*    |     ID of the affected registered resource.    |
|*resourceProviderRegistrationID*   |    ID of the registered resource provider of the affected component.  |
|*serviceregistrationid*     |    ID of the registered service.   |
|*severity*     |     Alert severity.  |
|*state*     |    Alert state.   |
|*title*     |    Alert title.   |
|*impactedresourceid*     |     ID of impacted resource.    |
|*ImpactedresourceDisplayName*     |     Name of the impacted resource.  |
|*closedByUserAlias*     |   User who closed alert.      |

### Close alert

**Request**

The request closes an alert by its unique ID.

|Method    |Request URI  |
|---------|---------|
|PUT     |   https://{armendpoint}/subscriptions/{subId}/resourceGroups/system.{RegionName}/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/{RegionName}/Alerts/alertid?api-version=2016-05-01"    |

**Arguments**


|Argument  |Description  |
|---------|---------|
|*armendpoint*     |   Resource Manager endpoint of your Azure Stack environment, in the format https://adminmanagement.{RegionName}.{External FQDN}. For example, if the external FQDN is *azurestack.external* and region name is *local*, then the Resource Manager endpoint is https://adminmanagement.local.azurestack.external.      |
|*subid*     |    Subscription ID of the user who is making the call. You can use this API to query only with a user who has permission to the default provider subscription.     |
|*RegionName*     |   The region name of the Azure Stack deployment.      |
|*api-version*     |    Version of the protocol that is used to make this request. You must use 2016-05-01.     |
|*alertid*     |    Unique ID of the alert.     |

**Body**

```json

{
"value":[
{"id":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/alerts/71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"name":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"type":"Microsoft.InfrastructureInsights.Admin/regionHealths/alerts",
"location":"local",
"tags":{},
"properties":
{
"closedTimestamp":"2017-08-10T20:18:58.1584868Z",
"createdTimestamp":"2017-08-10T20:13:57.4398842Z",
"description":[{"text":"The infrastructure role (Updates) is experiencing issues.",
"type":"Text"}],
"faultId":"ServiceFabric:/UpdateResourceProvider/fabric:/AzurestackUpdateResourceProvider",
"alertId":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"faultTypeId":"ServiceFabricApplicationUnhealthy",
"lastUpdatedTimestamp":"2017-08-10T20:18:58.1584868Z",
"alertProperties":
{
"healthState":"Warning",
"name":"Updates",
"fabricName":"fabric:/AzurestackUpdateResourceProvider",
"description":null,
"serviceType":"UpdateResourceProvider"},
"remediation":[{"text":"1. Navigate to the (Updates) and restart the role. 2. If after closing the alert the issue persists, please contact support.",
"type":"Text"}],
"resourceRegistrationId":null,
"resourceProviderRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"serviceRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"severity":"Warning",
"state":"Closed",
"title":"Infrastructure role is unhealthy",
"impactedResourceId":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.Fabric.Admin/fabricLocations/local/infraRoles/UpdateResourceProvider",
"impactedResourceDisplayName":"UpdateResourceProvider",
"closedByUserAlias":null
}
},
```
**Response**

```http
PUT https://adminmanagement.local.azurestack.external//subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/alerts/71dbd379-1d1d-42e2-8439-6190cc7aa80b?api-version=2016-05-01 HTTP/1.1
```

```json
{
"value":[
{"id":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/alerts/71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"name":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"type":"Microsoft.InfrastructureInsights.Admin/regionHealths/alerts",
"location":"local",
"tags":{},
"properties":
{
"closedTimestamp":"",
"createdTimestamp":"2017-08-10T20:13:57.4398842Z",
"description":[{"text":"The infrastructure role (Updates) is experiencing issues.",
"type":"Text"}],
"faultId":"ServiceFabric:/UpdateResourceProvider/fabric:/AzurestackUpdateResourceProvider",
"alertId":"71dbd379-1d1d-42e2-8439-6190cc7aa80b",
"faultTypeId":"ServiceFabricApplicationUnhealthy",
"lastUpdatedTimestamp":"2017-08-10T20:18:58.1584868Z",
"alertProperties":
{
"healthState":"Warning",
"name":"Updates",
"fabricName":"fabric:/AzurestackUpdateResourceProvider",
"description":null,
"serviceType":"UpdateResourceProvider"},
"remediation":[{"text":"1. Navigate to the (Updates) and restart the role. 2. If after closing the alert the issue persists, please contact support.",
"type":"Text"}],
"resourceRegistrationId":null,
"resourceProviderRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"serviceRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"severity":"Warning",
"state":"Closed",
"title":"Infrastructure role is unhealthy",
"impactedResourceId":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.Fabric.Admin/fabricLocations/local/infraRoles/UpdateResourceProvider",
"impactedResourceDisplayName":"UpdateResourceProvider",
"closedByUserAlias":null
}
},
```

**Response details**


|  Argument  |Description  |
|---------|---------|
|*id*     |      Unique ID of the alert.   |
|*name*     |     Internal name of the alert.   |
|*type*     |     Resource definition.    |
|*location*     |    	Region name.     |
|*tags*     |   Resource tags.     |
|*closedtimestamp*    |  UTC time when the alert was closed.    |
|*createdtimestamp*     |     UTC time when the alert was created.   |
|*Description*     |    Description of the alert.     |
|*faultid*     | Affected component.        |
|*alertid*     |  Unique ID of the alert.       |
|*faulttypeid*     |  Unique type of faulty component.       |
|*lastupdatedtimestamp*     |   UTC time when alert information was last updated.    |
|*healthstate*     | Overall health status.        |
|*name*     |   Name of the specific alert.      |
|*fabricname*     |    Registered fabric name of the faulty component.   |
|*description*     |  Description of the registered fabric component.   |
|*servicetype*     |   Type of the registered fabric service.   |
|*remediation*     |   Recommended remediation steps.    |
|*type*     |   Alert type.    |
|*resourceRegistrationid*    |     ID of the affected registered resource.    |
|*resourceProviderRegistrationID*   |    ID of the registered resource provider of the affected component.  |
|*serviceregistrationid*     |    ID of the registered service.   |
|*severity*     |     Alert severity.  |
|*state*     |    Alert state.   |
|*title*     |    Alert title.   |
|*impactedresourceid*     |     ID of impacted resource.    |
|*ImpactedresourceDisplayName*     |     Name of the impacted resource.  |
|*closedByUserAlias*     |   User who closed alert.      |

### Get resource provider health

**Request**

The request gets health status for all registered resource providers.


|Method  |Request URI  |
|---------|---------|
|GET    |   https://{armendpoint}/subscriptions/{subId}/resourceGroups/system.{RegionName}/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/{RegionName}/serviceHealths?api-version=2016-05-01"   |


**Arguments**


|Arguments  |Description  |
|---------|---------|
|*armendpoint*     |    The Resource Manager endpoint of your Azure Stack environment, in the format https://adminmanagement.{RegionName}.{External FQDN}. For example, if the external FQDN is azurestack.external and region name is local, then the Resource Manager endpoint is https://adminmanagement.local.azurestack.external.     |
|*subid*     |     Subscription ID of the user who is making the call. You can use this API to query only with a user who has permission to the default provider subscription.    |
|*RegionName*     |     The region name of the Azure Stack deployment.    |
|*api-version*     |   Version of the protocol that is used to make this request. You must use 2016-05-01.      |


**Response**

```http
GET https://adminmanagement.local.azurestack.external/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/serviceHealths?api-version=2016-05-01
```

```json
{
"value":[
{
"id":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/serviceHealths/03ccf38f-f6b1-4540-9dc8-ec7b6389ecca",
"name":"03ccf38f-f6b1-4540-9dc8ec7b6389ecca",
"type":"Microsoft.InfrastructureInsights.Admin/regionHealths/serviceHealths",
"location":"local",
"tags":{},
"properties":{
"registrationId":"03ccf38f-f6b1-4540-9dc8-ec7b6389ecca",
"displayName":"Key Vault",
"namespace":"Microsoft.KeyVault.Admin",
"routePrefix":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.KeyVault.Admin/locations/local",
"serviceLocation":"local",
"infraURI":"/subscriptions/4aa97de3-6b83-4582-86e1-65a5e4d1295b/resourceGroups/system.local/providers/Microsoft.KeyVault.Admin/locations/local/infraRoles/Key Vault",
"alertSummary":{"criticalAlertCount":0,"warningAlertCount":0},
"healthState":"Healthy"
}
}

…
```
**Response details**


|Argument  |Description  |
|---------|---------|
|*Id*     |   Unique ID of the alert.      |
|*name*     |  Internal name of the alert.       |
|*type*     |  Resource definition.       |
|*location*     |  Region name.       |
|*tags*     |     Resource tags.    |
|*registrationId*     |   Unique registration for the resource provider.      |
|*displayName*     |Resource provider display name.        |
|*namespace*     |   API namespace the resource provider implements.       |
|*routePrefix*     |    URI to interact with the resource provider.     |
|*serviceLocation*     |   Region this resource provider is registered with.      |
|*infraURI*     |   URI of the resource provider listed as an infrastructure role.      |
|*alertSummary*     |   Summary of critical and warning alert associated with the resource provider.      |
|*healthState*     |    Health state of the resource provider.     |


### Get resource health

The request gets health status for a specific registered resource provider.

**Request**

|Method  |Request URI  |
|---------|---------|
|GET     |     https://{armendpoint}/subscriptions/{subId}/resourceGroups/system.{RegionName}/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/{RegionName}/serviceHealths/{RegistrationID}/resourceHealths?api-version=2016-05-01"    |

**Arguments**

|Arguments  |Description  |
|---------|---------|
|*armendpoint*     |    The Resource Manager endpoint of your Azure Stack environment, in the format https://adminmanagement.{RegionName}.{External FQDN}. For example, if the external FQDN is azurestack.external and region name is local, then the Resource Manager endpoint is https://adminmanagement.local.azurestack.external.     |
|*subid*     |Subscription ID of the user who is making the call. You can use this API to query only with a user who has permission to the default provider subscription.         |
|*RegionName*     |  The region name of the Azure Stack deployment.       |
|*api-version*     |  Version of the protocol that is used to make this request. You must use 2016-05-01.       |
|*RegistrationID* |Registration ID for a specific resource provider. |

**Response**

```http
GET https://adminmanagement.local.azurestack.external/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/serviceHealths/03ccf38f-f6b1-4540-9dc8-ec7b6389ecca /resourceHealths?api-version=2016-05-01 HTTP/1.1
```

```json
{
"value":
[
{"id":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.InfrastructureInsights.Admin/regionHealths/local/serviceHealths/472aaaa6-3f63-43fa-a489-4fd9094e235f/resourceHealths/028c3916-ab86-4e7f-b5c2-0468e607915c",
"name":"028c3916-ab86-4e7f-b5c2-0468e607915c",
"type":"Microsoft.InfrastructureInsights.Admin/regionHealths/serviceHealths/resourceHealths",
"location":"local",
"tags":{},
"properties":
{"registrationId":"028c3916-ab86-4e7f-b5c2 0468e607915c","namespace":"Microsoft.Fabric.Admin","routePrefix":"/subscriptions/4aa97de3-6b83-4582-86e1 65a5e4d1295b/resourceGroups/system.local/providers/Microsoft.Fabric.Admin/fabricLocations/local",
"resourceType":"infraRoles",
"resourceName":"Privileged endpoint",
"usageMetrics":[],
"resourceLocation":"local",
"resourceURI":"/subscriptions/<Subscription_ID>/resourceGroups/system.local/providers/Microsoft.Fabric.Admin/fabricLocations/local/infraRoles/Privileged endpoint",
"rpRegistrationId":"472aaaa6-3f63-43fa-a489-4fd9094e235f",
"alertSummary":{"criticalAlertCount":0,"warningAlertCount":0},"healthState":"Unknown"
}
}
…
```

**Response details**

|Argument  |Description  |
|---------|---------|
|*Id*     |   Unique ID of the alert.      |
|*name*     |  Internal name of the alert.       |
|*type*     |  Resource definition.       |
|*location*     |  Region name.       |
|*tags*     |     Resource tags.    |
|*registrationId*     |   Unique registration for the resource provider.      |
|*resourceType*     |Type of resource.        |
|*resourceName*     |   Resource name.   |
|*usageMetrics*     |    Usage metric for resource.     |
|*resourceLocation*     |   Name of the region where deployed.      |
|*resourceURI*     |   URI for the resource.   |
|*alertSummary*     |   Summary of critical and warning alerts, health status.     |

## Next steps

- For information about built-in health monitoring, see [Monitor health and alerts in Azure Stack](azure-stack-monitor-health.md)


