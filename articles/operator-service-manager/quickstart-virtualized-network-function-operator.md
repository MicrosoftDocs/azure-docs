---
title: Prerequisites for Operator and Virtualized Network Function (VNF)
description: Install the necessary prerequisites for Operator and Virtualized Network Function (VNF).
author: sherrygonz
ms.author: sherryg
ms.date: 10/19/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)

This quickstart contains the prerequisite tasks for Operator and Virtualized Network Function (VNF). While it's possible to automate these tasks within your NSD (Network Service Definition), in this quickstart, the actions are performed manually.

## Deploy prerequisites for Virtual Machine (VM)

1. Follow the actions to [Create resource groups](../azure-resource-manager/management/manage-resource-groups-cli.md) for the prerequisites in the same region as your Publisher resources.

    ```azurecli
    az login
    ```
1. Select active subscription using the subscription ID.

    ```azurecli
    az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```
1. Create the Resource Group.
    
    ```azurecli
    az group create --name OperatorResourceGroup  --location uksouth
    ```
    
    > [!NOTE]
    > The Resource Group you create here is used for further deployment.

1. Save the following Bicep script locally as *prerequisites.bicep*.

    ```json
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

1. Save the following json template locally as *prerequisites.parameters.json*.

    ```json
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
    ```

1. Ensure the scripts are saved locally.

## Deploy Virtual Network

1. Start the deployment of the Virtual Network. Issue the following command:

    ```azurecli
    az deployment group create --name prerequisites --resource-group OperatorResourceGroup  --template-file prerequisites.bicep --parameters prerequisites.parameters.json
    ```
1. The script creates a Virtual Network, a Network Security Group and the Managed Identity.

   

## Locate Resource ID for managed identity

1. **Login to Azure portal**: Open a web browser and sign in to the Azure portal (https://portal.azure.com/) using your Azure account credentials.
1. **Navigate to All Services**: Under *Identity* select  *Managed identities*.
1. **Locate the Managed Identity**: In the list of managed identities, find and select the one named **identity-for-ubuntu-vm-sns** within your resource group. You should now be on the overview page for that managed identity.
1. **Locate ID**: Select the properties section of the managed identity. You should see various information about the identity. Look for the **ID** field.
1. **Copy to clipboard**: Select the **Copy** button or icon next to the Resource ID.
1. **Save copied Resource ID**: Save the copied Resource ID as this information is required for the **Config Group Values** when creating the Site Network Service.

    :::image type="content" source="media/identity-for-ubuntu-vm-sns.png" alt-text="Screenshot showing Managed Identity Properties and ID under Essentials." lightbox="media/identity-for-ubuntu-vm-sns.png":::

## Locate Resource ID for Virtual Network

1. **Login to Azure portal**: Open a web browser and sign in to the Azure portal (https://portal.azure.com/) using your Azure account credentials.
1. **Navigate to Virtual Networks**: In the left-hand navigation pane, select *Virtual networks*.
1. **Search for Virtual Networks**: In the list of virtual networks, you can either scroll through the list or use the search bar to find the *ubuntu-vm-vnet* virtual network.
1. **Access Virtual Network**: Select the name of the *ubuntu-vm-vnet* virtual network. You should now be on the overview page for that virtual network.
1. **Locate ID**: Select the properties section of the Virtual Network. You should see various information about the identity. Look for the Resource ID field.
1. **Copy to clipboard**: Select the **Copy** button or icon next to the Resource ID to copy it to your clipboard.
1. **Save copied Resource ID**: Save the copied Resource ID as this information is required for the **Config Group Values** when creating the Site Network Service.

    :::image type="content" source="media/resource-id-ubuntu-vm-vnet.png" alt-text="Screenshot showing Virtual network Properties and the Resource ID.":::

## Update Site Network Service (SNS) permissions

To perform this task, you need either the 'Owner' or 'User Access Administrator' role in the respective Resource Group.
In prior steps, you created a Managed Identity labeled *identity-for-ubuntu-vm-sns* inside your reference resource group. This identity plays a crucial role in deploying the Site Network Service. (SNS). Grant the identity 'Contributor' permissions for relevant resources. These actions facilitate the connection of the Virtual Machine (VM) to the Virtual Network (VNET). Through this identity, the Site Network Service (SNS) attains the required permissions.

In prior steps, you created a Managed Identity labeled identity-for-ubuntu-vm-sns inside your reference resource group. This identity plays a crucial role in deploying the Site Network Service (SNS). Grant the identity 'Contributor' permissions for relevant resources. These actions facilitate the deployment of the Virtual Network Function and the connection of the Virtual Machine (VM) to the Virtual Network (VNET). Through this identity, the Site Network Service (SNS) attains the required permissions.

### Grant Contributor role over Virtual Network to Managed Identity

1. Access the Azure portal and open the Resource Group created earlier in this case *OperatorResourceGroup*.
1. Locate and select the Virtual Network named **ubuntu-vm-vnet**.
1. In the side menu of the Virtual Network, select **Access Control (IAM)**.
1. Choose **Add Role Assignment**.

    :::image type="content" source="media/add-role-assignment-ubuntu-vm-vnet.png" alt-text="Screenshot showing Virtual Access control (IAM) area to Add role assignment.":::        

1. Under the **Privileged administrator roles**, category pick *Contributor* then proceed with **Next**.

    :::image type="content" source="media/privileged-admin-roles-contributor-ubuntu.png" alt-text="Screenshot showing the Add role assignment window and Contributor with description.":::

1. Select **Managed identity**.
1. Choose **+ Select members** then find and choose the user-assigned managed identity **identity-for-ubuntu-vm-sns**.
1. Select **Review and assign**.

    :::image type="content" source="media/managed-identity-select-members-ubuntu.png" alt-text="Screenshot showing Managed identity and + Select members.":::

### Grant Contributor role over publisher Resource Group to Managed Identity

1. Access the Azure portal and open the Publisher Resource  Group created when publishing the Network Function Definition in this case *ubuntu-publisher-rg*.

1. In the side menu of the Resource Group, select **Access Control (IAM)**.
1. Choose **Add Role Assignment**.

    :::image type="content" source="media/how-to-assign-custom-role-resource-group.png" alt-text="Screen shot showing the ubuntu publisher resource screen where you add role assignment.":::
     

1. Under the **Privileged administrator roles**, category pick *Contributor* then proceed with **Next**.

    :::image type="content" source="media/privileged-admin-roles-contributor-resource-group.png" alt-text="Screenshot show privileged administrator roles with owner of contributor.":::

1. Select **Managed identity**.
1. Choose **+ Select members** then find and choose the user-assigned managed identity **identity-for-ubuntu-vm-sns**.
1. Select **Review and assign**.

    :::image type="content" source="media/managed-identity-resource-group-select-members-ubuntu.png" alt-text="Screenshot showing the add role assignment screen with review + assign highlighted.":::

### Grant Managed Identity Operator role to itself

1. Go to the Azure portal and search for **Managed Identities**.
1. Select *identity-for-ubuntu-vm-sns* from the list of **Managed Identities**.
1. On the side menu, select **Access Control (IAM)**.
1. Choose **Add Role Assignment**.

    :::image type="content" source="media/quickstart-virtual-network-function-operator-add-role-assignment-screen.png" alt-text="Screenshot showing the identity for ubuntu VM SNS add role assignment.":::


1. Select the **Managed Identity Operator** role then proceed with **Next**.

    :::image type="content" source="media/managed-identity-operator-role-virtual-network-function.png" alt-text="Screenshot showing the Managed Identity Operator role.":::

1. Select **Managed identity**.
1. Select **+ Select members** and navigate to the user-assigned managed identity called *identity-for-ubuntu-vm-sns* and proceed with the assignment.

    :::image type="content" source="media/managed-identity-user-assigned-ubuntu.png" alt-text="Screenshot showing the Add role assignment screen with Managed identity selected.":::

1. Select **Review and assign**.

Completion of all the tasks outlined in this article ensures that the Service Network Slice (SNS) has the necessary permissions to function effectively within the specified Azure environment.

## Next steps

- [Quickstart: Create a Virtualized Network Functions (VNF) Site](quickstart-virtualized-network-function-create-site.md).
