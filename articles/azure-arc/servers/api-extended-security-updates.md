---
title: Programmatically deploy and manage Azure Arc Extended Security Updates licenses
description: Learn how to programmatically deploy and manage Azure Arc Extended Security Updates licenses for Windows Server 2012.
ms.date: 09/20/2023
ms.topic: conceptual
---

# Programmatically deploy and manage Azure Arc Extended Security Updates licenses

This article provides instructions to programmatically provision and manage Windows Server 2012 and Windows Server 2012 R2 Extended Security Updates lifecycle operations through the Azure Arc WS2012 ESU ARM APIs.

> [!NOTE]
> For each of the API commands, be sure to enter accurate parameter information for location, state, edition, type, and processors depending on your particular scenario
> 
## Provision a license

To provision a license, execute the following commands:

```
PUT  
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/licenses/LICENSE_NAME?api-version=2023-06-20-preview 
{  
    "location": "ENTER-REGION",  
    "properties": {  
        "licenseDetails": {  
            "state": "Activated",  
            "target": "Windows Server 2012",  
            "Edition": "Datacenter",  
            "Type": "pCore",  
            "Processors": 12  
        }  
    }  
}
```

## Link a license

To link a license, execute the following commands:

```
PUT  
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/machines/MACHINE_NAME/licenseProfiles/default?api-version=2023-06-20-preview 
{ 
  “location”: “SAME_REGION_AS_MACHINE”, 
  “properties”: { 
    “esuProfile”: { 
      “assignedLicense”: “RESOURCE_ID_OF_LICENSE” 
    } 
  } 
}
```

## Unlink a license

To unlink a license, execute the following commands:

```
PUT 
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/machines/MACHINE_NAME/licenseProfiles/default?api-version=2023-06-20-preview
{
  “location”: “SAME_REGION_AS_MACHINE”,
  “properties”: {
    “esuProfile”: {
      “assignedLicense”: “”
    }
  }
}
```

## Modify a license

To modify a license, execute the following commands:

```
PUT/PATCH 
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/licenses/LICENSE_NAME?api-version=2023-06-20-preview 
{  
    "location": "ENTER-REGION",  
    "properties": {  
        "licenseDetails": {  
            "state": "Activated",  
            "target": "Windows Server 2012",  
            "Edition": "Datacenter",  
            "Type": "pCore",  
            "Processors": 12  
        }  
    }  
}
```

> [!NOTE]
> For PUT, all of the properties must be provided. For PATCH, a subset may be provided. 
> 

## Delete a license

To delete a license, execute the following commands:

```
DELETE  
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/licenses/LICENSE_NAME?api-version=2023-06-20-preview
```
