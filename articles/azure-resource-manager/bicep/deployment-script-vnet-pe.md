---
title: Run Bicep deployment script privately over a private endpoint
description: Learn how to run and test Bicep deployment scripts privately over a private endpoint.
ms.custom: devx-track-bicep
ms.topic: how-to
ms.date: 05/30/2024
---

# Run Bicep deployment script privately over a private endpoint

With the `2023-08-01` API version of the `Microsoft.Resources/deploymentScripts` resource it is possible to run deployment scripts privately in an Azure Container Instance.

This means that the Azure Container Instance created by the deployment script resource is running in a virtual network and is assigned a private IP address. The Azure Container Instance connects to a new or existing storage account over a private endpoint.

The `2023-08-01` API version introduces the `subnetIds` property under `containerSettings` to specify that the Azure Container Instance must be deployed in a subnet in the virtual network.

 :::image type="content" source="./media/deployment-script-vnet-pe/bicep-deployment-script-pe-design.png" alt-text="Screenshot of high-level architecture showing how the infrastructure is connected to run deployment scripts privately.":::

To run deployment scripts privately you need the following infrastructure as seen in the architecture image above:

- Create a virtual network with two subnets:
    - Subnet for private endpoint
    - Subnet for Azure Container Instance, this subnet needs a `Microsoft.ContainerInstance/containerGroups` delegation.
- Create a storage account with public network access `disabled`
- Create a private endpoint configured with the `file` sub-resource on the storage account
- Create a private DNS zone `privatelink.file.core.windows.net` and register the private endpoint IP address as an A record. Link the private DNS zone to the created virtual network.
- Create a user-assigned managed identity with `Storage File Data Privileged Contributor` permissions on the storage account and specify it in the `identity` property in the deployment script resource. To assign the identity, see [Identity](./deployment-script-develop.md#identity).

The Azure Container Instance is deployed implicitly by the deployment script resource.

The following Bicep template shows the Bicep code needed to configure the infrastructure required for running a deployment script privately:

```bicep
@maxLength(10) // Required maximum length, because the storage account has a maximum of 26 characters
param prefix string
param location string = resourceGroup().location
param userAssignedIdentityName string = '${prefix}Identity'
param storageAccountName string = '${prefix}stg${uniqueString(resourceGroup().id)}'
param vnetName string = '${prefix}Vnet'
param deploymentScriptName string = '${prefix}ds'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: userAssignedIdentityName
  location: location
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  kind: 'StorageV2'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    publicNetworkAccess: 'Disabled'
    networkAcls: {
      defaultAction: 'Deny'
      bypass: 'AzureServices'
    }
  }
}

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-05-01' = {
   name: storageAccount.name
   location: location
   properties: {
    privateLinkServiceConnections: [
      {
        name: storageAccount.name
        properties: {
          privateLinkServiceId: storageAccount.id
          groupIds: [
            'file'
          ]
        }
      }
    ]
    customNetworkInterfaceName: '${storageAccount.name}-nic'
    subnet: {
      id: virtualNetwork::privateEndpointSubnet.id
    }
   }
}

resource storageFileDataPrivilegedContributorReference 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '69566ab7-960f-475b-8e7c-b3118f30c6bd' // Storage File Data Privileged Contributor
  scope: tenant()
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageFileDataPrivilegedContributorReference.id, managedIdentity.id, storageAccount.id)
  scope: storageAccount
  properties: {
    principalId: managedIdentity.properties.principalId
    roleDefinitionId: storageFileDataPrivilegedContributorReference.id
    principalType: 'ServicePrincipal'
  }
}

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.file.core.windows.net'
  location: 'global'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: uniqueString(virtualNetwork.name)
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }

  resource resRecord 'A' = {
    name: storageAccount.name
    properties: {
      ttl: 10
      aRecords: [
        {
          ipv4Address: first(first(privateEndpoint.properties.customDnsConfigs)!.ipAddresses)
        }
      ]
    }
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: vnetName
  location: location
  properties:{
    addressSpace: {
      addressPrefixes: [
        '192.168.4.0/23'
      ]
    }
  }

  resource privateEndpointSubnet 'subnets' = {
    name: 'PrivateEndpointSubnet'
    properties: {
      addressPrefixes: [
        '192.168.4.0/24'
      ]
    }
  }

  resource containerInstanceSubnet 'subnets' = {
    name: 'ContainerInstanceSubnet'
    properties: {
      addressPrefix: '192.168.5.0/24'
      delegations: [
        {
          name: 'containerDelegation'
          properties: {
            serviceName: 'Microsoft.ContainerInstance/containerGroups'
          }
        }
      ]
    }
  }
}

resource privateDeploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: deploymentScriptName
  dependsOn: [
    privateEndpoint
    privateDnsZone::virtualNetworkLink
  ]
  location: location
  kind: 'AzurePowerShell'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}' : {}
    }
  }
  properties: {
    storageAccountSettings: {
      storageAccountName: storageAccount.name
    }
    containerSettings: {
      subnetIds: [
        {
          id: virtualNetwork::containerInstanceSubnet.id
        }
      ]
    }
    azPowerShellVersion: '9.0'
    retentionInterval: 'P1D'
    scriptContent: 'Write-Host "Hello World!"'
  }
}
```

## Firewall

The Azure Container Instance downloads container images from the Microsoft Container Registry. If you make use of a firewall, allow the URL [mcr.microsoft.com](https://mcr.microsoft.com) to download the image successfully. If the container image cannot be downloaded it will go into a `waiting` state and will eventually throw a timeout error.

## Next steps

In this article, you learned how to run deployment scripts over a private endpoint. To learn more:

> [!div class="nextstepaction"]
> [Use deployment scripts in Bicep](./deployment-script-bicep.md)
