---
title: Quick Start - Globally Available Application | Microsoft Docs
description: Use the Azure CLI 2.0 to Create an App Service site then add it to Traffic Manager to provide global traffic routing capabilities.
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

# Create Azure App Service Application with Global Traffic Routing

[!INCLUDE [App Service CLI Create Site](../../includes/app-service-cli-create-site.md)]

## Upgrade App Service Plan to Standard

| Token | Description |
|---|---|
| app-name | The name to give to the App Service Site |
| resource-group-name | The region you wish to deploy the App Service |

**Command**

```cli
az appservice plan update -n <app-name> -g <resource-group-name> --sku S1
```

**Output**

```text
{
  "adminSiteName": null,
  "geoRegion": "<resource-group-location>",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>",
  "kind": "app",
  "location": "<resource-group-location>",
  "maximumNumberOfWorkers": 10,
  "name": "<plan-name>",
  "numberOfSites": 1,
  "perSiteScaling": false,
  "reserved": false,
  "resourceGroup": "<resource-group-name>",
  "serverFarmWithRichSkuName": "<plan-name>",
  "sku": {
    "capacity": 1,
    "family": "S",
    "name": "S1",
    "size": "S1",
    "tier": "Standard"
  },
  "status": "Ready",
  "subscription": "<subscription-id>",
  "tags": null,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

## Create Traffic Manager Profile

| Token | Description |
|---|---|
| profile-name | |
| resource-group-name | The region you wish to deploy the Traffic Manager Profile |
| routing-method | One of the following options [performance | priority | weighted] |
| unique-dns-name | |

**Command**

```cli
az network traffic-manager profile create -n <profile-name> -g <resource-group-name> --routing-method <routing-method> --unique-dns-name <unique-dns-name>
```

**Output** 

```text
{
  "trafficManagerProfile": {
    "dnsConfig": {
      "fqdn": "<unique-dns-name>.trafficmanager.net",
      "relativeName": "<unique-dns-name>",
      "ttl": 30
    },
    "endpoints": [],
    "monitorConfig": {
      "path": "/",
      "port": 80,
      "profileMonitorStatus": "Inactive",
      "protocol": "HTTP"
    },
    "profileStatus": "Enabled",
    "trafficRoutingMethod": "<routing-method>"
  }
}
```

## Create Traffic Manager Endpoint

| Token | Description |
|---|---|
| endpoint-name | |
| profile-name | |
| resource-group-name | The region you wish to deploy the Traffic Manager Endpoint |
| endpoint-type | The type of endpoint which is to be configured. Options: [azureEndpoints \| externalEndpoints \| nestedEndpoints] |
| target-resource-id | The ResourceId of the App Service which is to be added as an endpoint. |

**Command**

```cli
az network traffic-manager endpoint create -n <endpoint-name> --profile-name <profile-name> -g <resource-group-name> --type <endpoint-type> --target-resource-id <target-resource-id>
```

**Output**

```text
{
  "endpointLocation": "<resource-group-location>",
  "endpointMonitorStatus": "CheckingEndpoint",
  "endpointStatus": "Enabled",
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/trafficManagerProfiles/<profile-name>/azureEndpoints/<endpoint-name>",
  "minChildEndpoints": null,
  "name": "<endpoint-name>",
  "priority": 1,
  "resourceGroup": "mvcpilot",
  "target": "<app-name>.azurewebsites.net",
  "targetResourceId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>",
  "type": "Microsoft.Network/trafficManagerProfiles/azureEndpoints",
  "weight": 1
}
```

## Verify

**Command**

```cli
az appservice web browse -n <app-name> -g <resource-group-name>
```

**Output**

![App Service CLI Quickstart Traffic Manager](../../includes/media/app-service-cli-quickstart-traffic-manager/start-page.png)