---
title: Run Bicep deployment script privately over a private endpoint
description: Learn how to run Bicep deployment script privately over a private endpoint.
ms.custom: devx-track-bicep
ms.topic: how-to
ms.date: 06/04/2024
---

# Run Bicep deployment script privately over a private endpoint

With the [`Microsoft.Resources/deploymentScripts`](/azure/templates/microsoft.resources/deploymentscripts?pivots=deployment-language-bicep) resource API version `2023-08-01`, you can run deployment scripts privately within an Azure Container Instance (ACI).

## Configure the environment

In this setup, the ACI created by deployment script runs within a virtual network and obtains a private IP address. It then establishes a connection to a new or pre-existing storage account via a private endpoint. The `containerSettings/subnetIds` property specifies the ACI that must be deployed in a subnet of the virtual network.

:::image type="content" source="./media/deployment-script-vnet-private-endpoint/bicep-deployment-script-vnet-private-endpoint-diagram.jpg" alt-text="Screenshot of high-level architecture showing how the infrastructure is connected to run deployment scripts privately.":::

To run deployment scripts privately you need the following infrastructure as seen in the architecture diagram:

- Create a virtual network with two subnets:
  - A subnet for the private endpoint.
  - A subnet for the ACI, this subnet needs a `Microsoft.ContainerInstance/containerGroups` delegation.
- Create a storage account without public network access.
- Create a private endpoint within the virtual network configured with the `file` sub-resource on the storage account.
- Create a private DNS zone `privatelink.file.core.windows.net` and register the private endpoint IP address as an A record. Link the private DNS zone to the created virtual network.
- Create a user-assigned managed identity with `Storage File Data Privileged Contributor` permissions on the storage account and specify it in the `identity` property in the deployment script resource. To assign the identity, see [Identity](/azure/azure-resource-manager/bicep/deployment-script-develop#identity).
- The ACI resource is created automatically by the deployment script resource.

The following Bicep file configures the infrastructure required for running a deployment script privately:

```bicep
@maxLength(10) // Required maximum length, because the storage account has a maximum of 26 characters
param namePrefix string
param location string = resourceGroup().location
param userAssignedIdentityName string = '${namePrefix}Identity'
param storageAccountName string = '${namePrefix}stg${uniqueString(resourceGroup().id)}'
param vnetName string = '${namePrefix}Vnet'
param deploymentScriptName string = '${namePrefix}ds'

var roleNameStorageFileDataPrivilegedContributor = '69566ab7-960f-475b-8e7c-b3118f30c6bd'
var vnetAddressPrefix = '192.168.4.0/23'
var subnetEndpointAddressPrefix = '192.168.4.0/24'
var subnetACIAddressPrefix = '192.168.5.0/24'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: userAssignedIdentityName
  location: location
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
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

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
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
  name: roleNameStorageFileDataPrivilegedContributor
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

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: location
  properties:{
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
  }

  resource privateEndpointSubnet 'subnets' = {
    name: 'PrivateEndpointSubnet'
    properties: {
      addressPrefixes: [
        subnetEndpointAddressPrefix
      ]
    }
  }

  resource containerInstanceSubnet 'subnets' = {
    name: 'ContainerInstanceSubnet'
    properties: {
      addressPrefix: subnetACIAddressPrefix
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

The ACI downloads container images from the Microsoft Container Registry. If you use a firewall, allowlist the URL [mcr.microsoft.com](https://mcr.microsoft.com) to download the image. Failure to download the container image results in the ACI entering a `waiting` state, eventually leading to a timeout error.

## Next steps

In this article, you learned how to run deployment scripts over a private endpoint. To learn more:

> [!div class="nextstepaction"]
> [Use deployment scripts in Bicep](./deployment-script-bicep.md)