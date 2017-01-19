---
title: Load Balance an App Geographically with Azure CLI 2.0 | Microsoft Docs
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

# Load Balance an App Geographically with Azure CLI 2.0

## In this Quickstart

In less than 5 minutes, this quickstart will have you create an App Service Site and Traffic Manager Profile. Once created you will add the App Service to the Endpoint to the Profile for Load Balancing.

[!INCLUDE [App Service CLI Create Site](../../includes/app-service-cli-create-site.md)]

## Step 2: Upgrade App Service Plan to Standard

**Command**

```cli
az appservice plan update -n <plan-name> -g <resource-group-name> --sku S1
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

## Step 3: Create Traffic Manager Profile

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

## Step 4: Add Traffic Manager Endpoint

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
  "resourceGroup": "<resource-group-name>",
  "target": "<app-name>.azurewebsites.net",
  "targetResourceId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>",
  "type": "Microsoft.Network/trafficManagerProfiles/azureEndpoints",
  "weight": 1
}
```

## Step 5: Validate

**Command**

```cli
az network traffic-manager profile show -n <profile-name> -g <resource-group-name> --query 'dnsConfig.fqdn'
```

**Output**

Paste the resulting URL into your favourite web browser.

![App Service CLI Quickstart Traffic Manager](../../includes/media/app-service-cli-quickstart-traffic-manager/start-page.png)

## Glossary

| Token | Service | Description | Data Type |
|---|---|---|---|
| resource-group-name | Resource Group | The name of the Resource Group to deploy the services | string |
| resource-group-location | Resource Group | The region in which to create your resource group | string |
| plan-name | App Service | The name to give to the App Service Site | string |
| app-name | App Service | The name to give to the App Service Site | string |
| profile-name | Traffic Manager | The friendly name provided to the Profile | string |
| routing-method | Traffic Manager | One of the following | Enum: [Performance \| Priority \| Weighted] |
| unique-dns-name | Traffic Manager | The (globally) unique dns prefix for the traffic manager profile | string |
| endpoint-name | Traffic Manager | The friendly name to provide to the Endpoint | string |
| endpoint-type | Traffic Manager | The type of endpoint which is to be configured | Enum: [azureEndpoints \| externalEndpoints \| nestedEndpoints] |
| target-resource-id | Traffic Manager | The ResourceId of the App Service which is to be added as an endpoint. | relative uri |

## Related documentation

* [App Service](index.md)
* [Traffic Manager](../traffic-manager/index.md)