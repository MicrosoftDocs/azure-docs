---
title: Create a site network service using Azure Operator Service Manager
description: Learn to create a site network service and deploy the Virtual Network based on ARM templates defined in the Network Service Design.
author: CoolDoctorJ
ms.author: jefrankl
ms.date: 06/30/2023
ms.topic: tutorial
ms.service: azure-operator-service-manager
---
# How to create a site network service
In this tutorial, learn to create a site network service and deploy a Virtual Network based on ARM templates.

## About the site network service
Site network services (SNS) represent the instantiation of a network service in a single site. Sites are scoped within a region, but may cover multiple NFVIs, such as Kubernetes clusters or on-premises Azure Stack Edge resources. Every SNS has a reference to precisely one version of a single network service design, but can reference different versions of that NSD over its lifetime.

Prior to creating the site network service, define the configurationGroupSchemaValue based on the parameters defined in your previously configured configuration group schema.

### Define configurationGroupValues

Syntax:

```ARMClient
/subscriptions/{{subscription} }/resourcegroups/{{resource-group}}/providers/microsoft.hybridnetwork/configurationGroupValues/{{CG-Value}}?api-version={{api-version}}
```

Example: 

Using DMClient, make the corresponding `PUT` request against Azure Resource Manager to create a configurationGroupValue resource with the name `Fabrikam-CSGValue`.

```ARMClient
ARMClient.exe PUT /subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourcegroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/configurationGroupValues/Fabrikam-CSGValue?api-version=2023-04-01-preview "@ConfigurationGroupSchemaValue.json"
```

Example JSON body:

```JSON
{
  "location": "eastus2euap",
  "properties": {
      "configurationGroupValueSchemaReference": {
          "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourcegroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/publishers/Fabrikam-Publisher/configurationGroupSchemas/Fabrikam-CSDG-VNET"
      },
      "configurationValue": "{\"vnetName\":\"Fabrikam-VNET\",\"vnetAddressPrefix\":\"10.0.0.0\/16\",\"subnet1Prefix\":\"10.0.10.0\/24\",\"subnet1Name\":\"Fabrikam-Subnet1\",\"subnet2Prefix\":\"10.0.20.0\/24\",\"subnet2Name\":\"Fabrikam-Subnet2\",\"location\":\"eastus2euap\"}"
  }
}
```

### Create the site network service 

Syntax: 

```ARMClient
ARMClient.exe PUT /subscriptions/{{subscription} }/resourceGroups/{{resource-group}}/providers/microsoft.hybridnetwork/sitenetworkservices/{{SNS}}?api-version={{api-version}}
```

Sample JSON body:

```JSON
{
"location": "{{location}}",
"properties": {
"siteReference": {
"id": "/subscriptions/{{subscription}}/resourceGroups/{{resource-group}}/providers/microsoft.hybridnetwork/sites/{{site}}"
},
"networkServiceDesignVersionReference": {
"id": "/subscriptions/{{subscription}}/resourceGroups/{{resource-group}}/providers/microsoft.hybridnetwork/publishers/{{publisher}}//networkServiceDesignGroups/{{NSD-group}}/networkServiceDesignVersions/{{NSD-version}}"
},
"desiredStateConfigurationGroupsValueReferences": {
"SampleConfiguration": {
"id": "/subscriptions/{{subscription}}/resourceGroups/{{resource-group}}/providers/microsoft.hybridnetwork/configurationGroupValues/{{CG-Value}}"
}
}
}
}
```

Example:

Using ARMClient, make the corresponding `PUT` request against Azure Resource Manager to create a Site Network Service resource with the name `Fabrikam-SNS-VNET`.

```ARMClient
ARMClient.exe PUT /subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourcegroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/siteNetworkServices/Fabrikam-SNS-VNET?api-version=2023-04-01-preview "@CreateSiteNetworkService.json"
```

Example JSON body:

```JSON
{
  "location": "eastus2euap",
  "properties": {
      "siteReference": {
          "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/sites/FabrikamSite-1"
      },
      "networkServiceDesignVersionReference": {
          "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/publishers/Fabrikam-Publisher/networkServiceDesignGroups/Fabrikam-NSDGroup/networkServiceDesignVersions/1.0.0"
      },
      "desiredStateConfigurationGroupsValueReferences": {
          "VNET_Configuration": {
              "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/configurationGroupValues/Fabrikam-CSGValue"
          }
      }
  }
}
```

Output:

```Output
{
  "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/siteNetworkServices/Fabrika
m-SNS-VNET",
  "name": "Fabrikam-SNS-VNET",
  "type": "microsoft.hybridnetwork/sitenetworkservices",
  "location": "eastus2euap",
  "systemData": {
    "createdBy": "user@fabrikam.com",
    "createdByType": "User",
    "createdAt": "2022-10-25T09:26:17.5251205Z",
    "lastModifiedBy": "user@fabrikam.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-10-25T15:43:05.6777736Z"
  },
  "properties": {
    "provisioningState": "Accepted",
    "siteReference": {
      "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/sites/FabrikamSite-1"
    },
    "networkServiceDesignVersionReference": {
      "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/publishers/Fabrikam-Pub
lisher/networkServiceDesignGroups/Fabrikam-NSDGroup/networkServiceDesignVersions/1.0.0"
    },
    "desiredStateConfigurationGroupsValueReferences": {
      "VNET_Configuration": {
        "id": "/subscriptions/xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx/resourceGroups/Fabrikam-ResourceGroup/providers/microsoft.hybridnetwork/configurationGroupVal
ues/Fabrikam-CSGValue"
      }
    },
    "managedResourceGroupConfiguration": {
      "location": "eastus2euap",
      "name": "Fabrikam-SNS-VNET-HostedResources-58DB32C1"
    }
  }
}
```