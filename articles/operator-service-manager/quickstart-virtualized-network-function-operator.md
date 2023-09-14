---
title: Prerequisites for Operator and Virtualized Network Function (VNF)
description: Install the necessary prerequisites for Operator and Virtualized Network Function (VNF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/13/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)

This quickstart contains the prerequisite tasks for Operator and Containerized Network Function (CNF). While it's possible to automate these tasks within your NSD (Network Service Definition), in this quickstart, the actions are performed manually.

## Deploy prerequisites for Virtual Machine (VM)

Follow the actions to [Create resource groups](../azure-resource-manager/management/manage-resource-groups-cli.md) for the prerequisites in the same region as your Publisher resources.

```azurecli
az login
az group create --name OperatorResourceGroup --location uksouth
``````
Save the following bicep script as pre-requisites.bicep

```azurecli
pre-requisites.bicep
param location string = resourceGroup().location
param vnetName string = 'ubuntu-vm-vnet'
param vnetAddressPrefixes string
param subnetName string = 'ubuntu-vm-subnet'
param subnetAddressPrefix string
param identityName string = 'identity-for-ubuntu-vm-sns'

resource networkSecurityGroup 'Microsoft.Network/networkSecurityGroups@2022-05-01' ={
  name: '${vnetName}-nsg'
  location: location
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: vnetName
  location: location
  properties: {

    addressSpace: {
      addressPrefixes: [vnetAddressPrefixes]
    }
    subnets: [
      {
        name: subnetName
        properties: {
          addressPrefix: subnetAddressPrefix
          networkSecurityGroup: {
            id:networkSecurityGroup.id
          }
        }
      }
    ]
  }
}

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: identityName
  location: location
}

output managedIdentityId string = managedIdentity.id
output vnetId string = virtualNetwork.id

```
Save the following schema as pre-requisites.parameters.json

```pre-requisites.parameters.json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vnetAddressPrefixes": {
      "value": "10.0.0.0/24"
    },
    "subnetAddressPrefix": {
      "value": "10.0.0.0/28"
    }
  }
}
``````
## Start deployment of Virtual Network (VM)

Once all the scripts are saved locally, you may start deployment of the Virtual Network (VM).

Issue the following command:

```azurecli
az deployment group create --name prerequisites --resource-group operatorresourcegroup --template-file pre-requisites.bicep --parameters pre-requisites.parameters.json
Output:
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Resources/deployments/prerequisites",
  "location": null,
  "name": "prerequisites",
  "properties": {
    "correlationId": "ede35f3a-848b-4776-9c3c-9a43df8f760c",
    "debugSetting": null,
    "dependencies": [
      {
        "dependsOn": [
          {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Network/networkSecurityGroups/ubuntu-vm-vnet-nsg",
            "resourceGroup": "OperatorResourceGroup",
            "resourceName": "ubuntu-vm-vnet-nsg",
            "resourceType": "Microsoft.Network/networkSecurityGroups"
          }
        ],
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Network/virtualNetworks/ubuntu-vm-vnet",
        "resourceGroup": "OperatorResourceGroup",
        "resourceName": "ubuntu-vm-vnet",
        "resourceType": "Microsoft.Network/virtualNetworks"
      }
    ],
    "duration": "PT10.8321154S",
    "error": null,
    "mode": "Incremental",
    "onErrorDeployment": null,
    "outputResources": [
      {
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-for-ubuntu-vm-sns",
        "resourceGroup": "OperatorResourceGroup"
      },
      {
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Network/networkSecurityGroups/ubuntu-vm-vnet-nsg",
        "resourceGroup": "OperatorResourceGroup"
      },
      {
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Network/virtualNetworks/ubuntu-vm-vnet",
        "resourceGroup": "OperatorResourceGroup"
      }
    ],
    "outputs": {
      "managedIdentityId": {
        "type": "String",
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-for-ubuntu-vm-sns"
      },
      "vnetId": {
        "type": "String",
        "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OperatorResourceGroup/providers/Microsoft.Network/virtualNetworks/ubuntu-vm-vnet"
      }
    },
    "parameters": {
      "identityName": {
        "type": "String",
        "value": "identity-for-ubuntu-vm-sns"
      },
      "location": {
        "type": "String",
        "value": "uksouth"
      },
      "subnetAddressPrefix": {
        "type": "String",
        "value": "10.0.0.0/28"
      },
      "subnetName": {
        "type": "String",
        "value": "ubuntu-vm-subnet"
      },
      "vnetAddressPrefixes": {
        "type": "String",
        "value": "10.0.0.0/24"
      },
      "vnetName": {
        "type": "String",
        "value": "ubuntu-vm-vnet"
      }
    },
    "parametersLink": null,
    "providers": [
      {
        "id": null,
        "namespace": "Microsoft.Network",
        "providerAuthorizationConsentState": null,
        "registrationPolicy": null,
        "registrationState": null,
        "resourceTypes": [
          {
            "aliases": null,
            "apiProfiles": null,
            "apiVersions": null,
            "capabilities": null,
            "defaultApiVersion": null,
            "locationMappings": null,
            "locations": [
              "uksouth"
            ],
            "properties": null,
            "resourceType": "networkSecurityGroups",
            "zoneMappings": null
          },
          {
            "aliases": null,
            "apiProfiles": null,
            "apiVersions": null,
            "capabilities": null,
            "defaultApiVersion": null,
            "locationMappings": null,
            "locations": [
              "uksouth"
            ],
            "properties": null,
            "resourceType": "virtualNetworks",
            "zoneMappings": null
          }
        ]
      },
      {
        "id": null,
        "namespace": "Microsoft.ManagedIdentity",
        "providerAuthorizationConsentState": null,
        "registrationPolicy": null,
        "registrationState": null,
        "resourceTypes": [
          {
            "aliases": null,
            "apiProfiles": null,
            "apiVersions": null,
            "capabilities": null,
            "defaultApiVersion": null,
            "locationMappings": null,
            "locations": [
              "uksouth"
            ],
            "properties": null,
            "resourceType": "userAssignedIdentities",
            "zoneMappings": null
          }
        ]
      }
    ],
    "provisioningState": "Succeeded",
    "templateHash": "14351698478455866420",
    "templateLink": null,
    "timestamp": "2023-09-12T14:29:41.595918+00:00",
    "validatedResources": null
  },
  "resourceGroup": "OperatorResourceGroup",
  "tags": null,
  "type": "Microsoft.Resources/deployments"
}
``````
## Locate Resource ID for managed identity

Locate and copy the Resource ID for the managed identity identity-for-ubuntu-vm-sns.

:::image type="content" source="media/identity-for-ubuntu-vm-sns.png" alt-text="Screenshot showing Managed Identity Properties and ID under Essentials." lightbox="media/identity-for-ubuntu-vm-sns.png":::

## Locate Resource ID for Virtual Network (VM)

Locate and copy the Resource ID for the managed identity identity-for-ubuntu-vm-sns.

:::image type="content" source="media/resource-id-ubuntu-vm-vnet.png" alt-text="Screenshot showing Virtual network Properties and the Resource ID.":::

This information is located within the Properties section of the respective objects in the portal. The information also resides within the outputs generated when you execute command az deployment group create. These Resource IDs are required in the "SNS Config Group Values" during the creation of Site Network Service.


## Update permissions granted to Service Network Slice (SNS)

The actions in this section require Owner or User Access Administrator privileges for your prerequisite Resource Group.
The preceding steps included the creation of a Managed Identity named "identity-for-ubuntu-vm-sns" within your prerequisite resource group. This identity is used during the deployment of the Service Network Slice (SNS).

Assign Contributor permissions to this managed identity for other prerequisite resources, enabling the Virtual Machine to connect to the Virtual Network (VNET). The Service Network Slice (SNS) inherits these permissions through this managed identity.

Following these steps to update the permissions:

1. Navigate to the Azure portal and access the Resource Group named 'pre-requisites resource group name.'
1. Locate and select the Virtual Network named "ubuntu-vm-vnet," then select on it.
1. In the Virtual Network's menu, select "Access Control (IAM)."
1. Select "Add Role Assignment."

:::image type="content" source="media/add-role-assignment-ubuntu-vm-vnet.png" alt-text="Screenshot showing Virtual Access control (IAM) area to Add role assignment.":::

Under the Privileged administrator roles tab, choose Contributor then select the Next button.

:::image type="content" source="media/privileged-admin-roles-contributor-ubuntu.png" alt-text="Screenshot showing the Add role assignment window and Contributor with description.":::

Select Managed identity, then choose + Select members. Navigate to the user-assigned managed identity called "identity-for-ubuntu-vm-sns." Select 'Review and assign.'

:::image type="content" source="media/managed-identity-select-members-ubuntu.png" alt-text="Screenshot showing Managed identity and + Select members.":::

Follow the following steps to grant permissions:

1. Navigate to the Azure portal, search for Managed Identities.
1. Locate and select the Managed Identities named "identity-for-ubuntu-vm-sns" then select it.
1. In the Managed Identity menu, select "Access Control (IAM)."
1. Select "Add Role Assignment."

:::image type="content" source="media/access-control-add-role-assignment-ubuntu.png" alt-text="Screenshot showing Managed identity Access control (IAM) to Add role assignment.":::

Grant 'Managed Identity Operator' permissions over itself.

:::image type="content" source="media/grant-operator-permissions-ubuntu.png" alt-text="Screenshot showing the Grant access to Azure resources banner.":::

Select 'Managed identity' then click on '+ Select members' and navigate to the user-assigned managed identity called "identity-for-ubuntu-vm-sns."

:::image type="content" source="media/managed-identity-user-assigned-ubuntu.png" alt-text="Screenshot showing the Add role assignment screen with Managed identity selected.":::

Completion of all the tasks outlined in this article ensures that the Service Network Slice (SNS) has the necessary permissions to function effectively within the specified Azure environment.

## Next steps

- [Quickstart: Create a Virtualized Network Functions (VNF) Site](quickstart-virtualized-network-function-create-site.md).