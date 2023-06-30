---
title: Create a site
description: Learn to create a site, a location where a network service can be instantiated.
author: CoolDoctorJ
ms.author: jefrankl
ms.date: 06/30/2023
ms.topic: tutorial
ms.service: azure-operator-service-manager
---
# Create a site

In this tutorial, learn on how to create a site.

A site is a location where a network service can be instantiated, either within a single Azure region, or a single on-premises location. Sites are the logical unit of updates; all changes are applied individually to independent sites. To make global changes, you must apply multiple independent operations to multiple sites in sequence, normally using safe deployment practices.

## Create a site

Use the following procedure to create a site using ARMClient.

Syntax: 

```ARMClient
ARMClient.exe PUT /subscriptions/{{subscription} }/resourcegroups/{{resource-group}}/providers/microsoft.hybridnetwork/sites/{{site}}?api-version={{api-version}}
```

Sample JSON Body:

```JSON
{
"location": "{{location}}",
"properties": {
"nfvis": [
{
"name": "{{name}}",
"nfviType": "AzureCore",
"location": "{{nfvi region}}"
}
]
}
}
```

### Parameters

| Name      | Type | Description     |
| :---        |    :----:   |          :--- |
| resourceGroupName      | String       | The name of the resource group to create or update. Can include alphanumeric, underscore, parentheses, hyphen, period (except at end), and Unicode characters that match the allowed characters. Regex pattern: ^[-\w\._\(\)]+$  |
| subscriptionId   | String        | The Microsoft Azure subscription ID.     |
| location   | String        | The location of the resource group. It can't be changed after the resource group has been created. It must be one of the supported Azure locations.    |
| name   | String        | Name for the NFVI.    |
| nfviType   | String        | NFVI types can be: AzureStackEdge, AzureArcKubernetes, Azure Core, and AzureOperatorDistributedServices   |

Using ARMClient, make the corresponding `PUT` request against Azure Resource Manager to create a site resource with the name `FabrikamSite-1`.

### Example

Example terminal input:

```ARMClient
ARMClient.exe PUT /subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourcegroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/sites/FabrikamSite-1?api-version=2023-04-01-preview "CreateSite.json"
```

Example JSON body:

```JSON
{
  "location": "eastus2euap",
  "properties": {
      "nfvis": [
        {
        "name": "FabrikamNFVI",
        "nfviType": "AzureCore",
        "location": "eastus2euap"
      }
        ]
}
}
```

> [!NOTE] 
> You can create multiple sites in different region/edge custom location(s) while still having them referenced in a single NetworkServiceDesignVersion.

Output:

```Output
{
  "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/sites/FabrikamSite-1",
  "name": "FabrikamSite-1",
  "type": "microsoft.hybridnetwork/sites",
  "location": "eastus2euap",
  "systemData": {
    "createdBy": "user@fabrikam.com",
    "createdByType": "User",
    "createdAt": "2022-10-25T08:53:32.5251298Z",
    "lastModifiedBy": "user@fabrikam.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-10-25T09:10:47.6004152Z"
  },
  "properties": {
    "nfvis": [
      {
        "name": "FabrikamNFVI",
        "nfviType": "AzureCore",
        "location": "eastus2euap"
      }
    ],
    "siteNetworkServiceReferences": null,
    "provisioningState": "Accepted"
  }
}
```

