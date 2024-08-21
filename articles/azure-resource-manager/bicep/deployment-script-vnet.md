---
title: Access a private virtual network from a Bicep deployment script
description: Learn how to run and test Bicep deployment scripts in private networks.
ms.custom: devx-track-bicep
ms.topic: how-to
ms.date: 12/13/2023
---

# Access a private virtual network from a Bicep deployment script

With `Microsoft.Resources/deploymentScripts` version `2023-08-01`, you can run deployment scripts in private networks with some additional configurations:

- Create a user-assigned managed identity, and specify it in the `identity` property. To assign the identity, see [Identity](./deployment-script-develop.md#identity).
- Create a storage account in the private network, and specify the deployment script to use the existing storage account. For more information, see [Use an existing storage account](./deployment-script-develop.md#use-an-existing-storage-account). Some additional configuration is required for the storage account:

    1. Open the storage account in the [Azure portal](https://portal.azure.com).
    1. On the left menu, select **Access Control (IAM)**, and then select the **Role assignments** tab.
    1. Add the **Storage File Data Privileged Contributor** role to the user-assigned managed identity.
    1. On the left menu, under **Security + networking**, select **Networking**, and then select **Firewalls and virtual networks**.
    1. Select **Enabled from selected virtual networks and IP addresses**.
    1. Under **Virtual networks**, add a subnet. In the following screenshot, the subnet is called *dspvnVnet*.
    1. Under **Exceptions**, select **Allow Azure services on the trusted services list to access this storage account**.

    :::image type="content" source="./media/deployment-script-vnet/bicep-deployment-script-access-vnet-config-storage.png" alt-text="Screenshot of selections for configuring a storage account for accessing a private network.":::

The following Bicep file shows how to configure the environment for running a deployment script:

```bicep
@maxLength(10) // Required maximum length, because the storage account has a maximum of 26 characters
param prefix string
param location string = resourceGroup().location
param userAssignedIdentityName string = '${prefix}Identity'
param storageAccountName string = '${prefix}stg${uniqueString(resourceGroup().id)}'
param vnetName string = '${prefix}Vnet'
param subnetName string = '${prefix}Subnet'

resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    enableDdosProtection: false
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: '10.0.0.0/24'
          serviceEndpoints: [
            {
              service: 'Microsoft.Storage'
            }
          ]
          delegations: [
            {
              name: 'Microsoft.ContainerInstance.containerGroups'
              properties: {
                serviceName: 'Microsoft.ContainerInstance/containerGroups'
              }
            }
          ]
        }
      }
    ]
  }
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2023-05-01' existing = {
  parent: vnet
  name: subnetName
}
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: [
        {
          id: subnet.id
          action: 'Allow'
          state: 'Succeeded'
        }
      ]
      defaultAction: 'Deny'
    }
  }
}

resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: userAssignedIdentityName
  location: location
}

resource storageFileDataPrivilegedContributor 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  name: '69566ab7-960f-475b-8e7c-b3118f30c6bd' // Storage File Data Privileged Contributor
  scope: tenant()
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount

  name: guid(storageFileDataPrivilegedContributor.id, userAssignedIdentity.id, storageAccount.id)
  properties: {
    principalId: userAssignedIdentity.properties.principalId
    roleDefinitionId: storageFileDataPrivilegedContributor.id
    principalType: 'ServicePrincipal'
  }
}
```

You can use the following Bicep file to test the deployment:

```bicep
param prefix string

param location string  = resourceGroup().location
param utcValue string = utcNow()

param storageAccountName string
param vnetName string
param subnetName string
param userAssignedIdentityName string

resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' existing = {
  name: vnetName

  resource subnet 'subnets' existing = {
    name: subnetName
  }
}

resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: userAssignedIdentityName
}

resource dsTest 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: '${prefix}DS'
  location: location
  identity: {
    type: 'userAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
  kind: 'AzureCLI'
  properties: {
    forceUpdateTag: utcValue
    azCliVersion: '2.52.0'
    storageAccountSettings: {
      storageAccountName: storageAccountName
    }
    containerSettings: {
      subnetIds: [
        {
          id: vnet::subnet.id
        }
      ]
    }
    scriptContent: 'echo "Hello world!"'
    retentionInterval: 'P1D'
    cleanupPreference: 'OnExpiration'
  }
}
```

## Next steps

In this article, you learned how to access a private virtual network. To learn more:

> [!div class="nextstepaction"]
> [Use deployment scripts in Bicep](./deployment-script-bicep.md)
