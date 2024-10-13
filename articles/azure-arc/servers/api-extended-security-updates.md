---
title: Programmatically deploy and manage Azure Arc Extended Security Updates licenses
description: Learn how to programmatically deploy and manage Azure Arc Extended Security Updates licenses for Windows Server 2012.
ms.date: 08/28/2024
ms.topic: conceptual
---

# Programmatically deploy and manage Azure Arc Extended Security Updates licenses

This article provides instructions to programmatically provision and manage Windows Server 2012 and Windows Server 2012 R2 Extended Security Updates lifecycle operations through the Azure Arc WS2012 ESU ARM APIs.

For each of the API commands explained in this article, be sure to enter accurate parameter information for location, state, edition, type, and processors depending on your particular scenario

> [!NOTE]
> You'll need to create a service principal to use the Azure API to manage ESUs. See [Connect hybrid machines to Azure at scale](onboard-service-principal.md) and [Azure REST API reference](/rest/api/azure/) for more information.
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

### Transitioning from volume licensing

Programmatically, you can use Azure CLI to generate new licenses, specifying the `Volume License Details` parameter in your Year 1 Volume Licensing entitlements by entering the respective invoice numbers. You must explicitly specify the Invoice Id (Number) in your license provisioning for Azure Arc:

```azurecli
az connectedmachine license create --license-name
                                   --resource-group
                                   [--edition {Datacenter, Standard}]
                                   [--license-type {ESU}]
                                   [--location]
                                   [--no-wait {0, 1, f, false, n, no, t, true, y, yes}]
                                   [--processors]
                                   [--state {Activated, Deactivated}]
                                   [--tags]
                                   [--target {Windows Server 2012, Windows Server 2012 R2}]
                                   [--tenant-id]
                                   [--type {pCore, vCore}]
                                   [--volume-license-details]
```

## Link a license

To link a license, execute the following commands:

```
PUT  
https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.HybridCompute/machines/MACHINE_NAME/licenseProfiles/default?api-version=2023-06-20-preview 
{
   "location": "SAME_REGION_AS_MACHINE",
   "properties": {
      "esuProfile": {
         "assignedLicense": "RESOURCE_ID_OF_LICENSE"
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
  "location": "SAME_REGION_AS_MACHINE",
  "properties": {
    "esuProfile": {
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
