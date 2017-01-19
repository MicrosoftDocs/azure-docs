---
title: Load Balance an App Geographically with Azure PowerShell | Microsoft Docs
description: Use the Azure PowerShell to Create an App Service site then add it to Traffic Manager to provide global traffic routing capabilities.
services: app-service
documentationcenter: ''
author: syntaxc4
manager: erikre
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: quickstart
ms.date: 01/18/2017
ms.author: cfowler
---

# Load Balance an App Geographically with Azure PowerShell

## In this Quickstart

In less than 5 minutes, this quickstart will have you create an App Service Site and Traffic Manager Profile. Once created you will add the App Service to the Endpoint to the Profile for Load Balancing.

[!INCLUDE [App Service CLI Create Site](../../includes/app-service-powershell-create-site.md)]

## Upgrade App Service Plan to Standard

| Token | Description |
|---|---|
| plan-name | The name to give to the App Service Site |
| resource-group-name | The region you wish to deploy the App Service |

**Command**

```powershell
Set-AzureRMAppServicePlan -Tier Standard -Name <plan-name> -ResourceGroupName <resource-group-name>
```

**Output**

```text
Sku                       : Microsoft.Azure.Management.WebSites.Models.SkuDescription
ServerFarmWithRichSkuName : <plan-name>
WorkerTierName            :
Status                    : Ready
Subscription              : <subscription-id>
AdminSiteName             :
HostingEnvironmentProfile :
MaximumNumberOfWorkers    : 10
GeoRegion                 : <resource-group-name>
PerSiteScaling            : False
NumberOfSites             : 1
ResourceGroup             : <resource-group-name>
Id                        : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>
Name                      : <plan-name>
Location                  : West US
Type                      : Microsoft.Web/serverfarms
Tags                      :
```

## Create Traffic Manager Profile

| Token | Description |
|---|---|
| profile-name | The friendly name to be provided to the Profile |
| resource-group-name | The region you wish to deploy the Traffic Manager Profile |
| routing-method | One of the following options [performance \| priority \| weighted] |
| unique-dns-name | The (globally) unique dns prefix for the traffic manager profile |

**Command**

```powershell
New-AzureRMTrafficManagerProfile -Name <profile-name> -ResourceGroupName <resource-group-name> -TrafficRoutingMethod <routing-method> -RelativeDnsName <unique-dns-name> -Ttl 300 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath /
```

**Output** 

```text
Id                   : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/trafficManagerProfiles/<unique-dns-name>
Name                 : <plan-name>
ResourceGroupName    : <resource-group-name>
RelativeDnsName      : <plan-name>
Ttl                  : 300
ProfileStatus        : Enabled
TrafficRoutingMethod : <routing-method>
MonitorProtocol      : HTTP
MonitorPort          : 80
MonitorPath          : /
Endpoints            : {}
```

## Add the App Service Traffic Manager Endpoint

| Token | Description |
|---|---|
| endpoint-name | The friendly name to provide to the Endpoint |
| profile-name | The friendly name provided to the Profile |
| resource-group-name | The region you wish to deploy the Traffic Manager Endpoint |
| endpoint-type | The type of endpoint which is to be configured. Options: [azureEndpoints \| externalEndpoints \| nestedEndpoints] |
| target-resource-id | The ResourceId of the App Service which is to be added as an endpoint. |

**Command**

```powershell
New-AzureRmTrafficManagerEndpoint -Name <endpoint-name> -ProfileName <profile-name> -ResourceGroupName <resource-group-name> -Type <endpoint-type> -TargetResourceId <target-resource-id>
```

**Output**

```text
Id                    : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/trafficManagerProfiles/<profile-name>/azureEndpoints/<endpoint-name>
Name                  : <endpoint-name>
ProfileName           : <profile-name>
ResourceGroupName     : <resource-group-name>
Type                  : AzureEndpoints
TargetResourceId      : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>
Target                : <app-name>.azurewebsites.net
EndpointStatus        : Enabled
Weight                : 1
Priority              : 1
Location              : <resource-group-location>
EndpointMonitorStatus : CheckingEndpoint
MinChildEndpoints     :
```

## Verify

**Command**

```powershell
Get-AzureRmTrafficManagerProfile -Name <profile-name> -ResourceGroupName <resource-group-name> | % {$_.RelativeDnsName + '.trafficmanager.net'}
```

**Output**

Paste the resulting URL into your favourite web browser.

![App Service powershell Quickstart Traffic Manager](../../includes/media/app-service-cli-quickstart-traffic-manager/start-page.png)