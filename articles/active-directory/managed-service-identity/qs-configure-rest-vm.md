---
title: How to configure system and user assigned identities on an Azure VM using REST
description: Step by step instructions for configuring a system and user assigned identities on an Azure VM using CURL to make REST API calls.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/25/2018
ms.author: daveba
---

# Configure Managed Identity on an Azure VM using REST API calls

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Identity provides Azure services with an automatically managed system identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to perform the following Managed Identity operations on an Azure VM, using CURL to make calls to the Azure Resource Manager REST endpoint:

- Enable and disable the system assigned identity on an Azure VM
- Add and remove a user assigned identity on an Azure VM

## Prerequisites

- If you're unfamiliar with Managed Service Identity, check out the [overview section](overview.md). **Be sure to review the [difference between a system assigned and user assigned identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following role assignments:
    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a VM and enable and remove system and/or user assigned managed identity from an Azure VM.
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user assigned identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user assigned identity from and to a VM.
- If you are using Windows, install the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about) or use the [Azure Cloud Shell](../../cloud-shell/overview.md) in the Azure portal.
- [Install the Azure CLI local console](/azure/install-azure-cli), if you use the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about) or a [Linux distribution OS](/cli/azure/install-azure-cli-apt?view=azure-cli-latest).
- If you are using Azure CLI local console, sign in to Azure using `az login` with an account that is associated with the Azure subscription you would like to manage system or user assigned identities.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## System assigned identity

In this section, you learn how to enable and disable system assigned identity on an Azure VM using CURL to make calls to the Azure Resource Manager REST endpoint.

### Enable system assigned identity during creation of an Azure VM

To create an Azure VM with system assigned identity enabled, you need create a VM and retrieve an access token to use CURL to call the Resource Manager endpoint with the system assigned identity type value.

1. Create a [resource group](../../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

2. Create a [network interface](/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create) for your VM:

   ```azurecli-interactive
    az network nic create -g myResourceGroup --vnet-name myVnet --subnet mySubnet -n myNic
   ```

3.  Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ``` 

4. Create a VM using CURL to call the Azure Resource Manager REST endpoint. The following example creates a VM named *myVM* with a system assigned identity, as identified in the request body by the value `"identity":{"type":"SystemAssigned"}`. Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.
 
    ```bash
    curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PUT -d '{"location":"westus","name":"myVM","identity":{"type":"SystemAssigned"},"properties":{"hardwareProfile":{"vmSize":"Standard_D2_v2"},"storageProfile":{"imageReference":{"sku":"2016-Datacenter","publisher":"MicrosoftWindowsServer","version":"latest","offer":"WindowsServer"},"osDisk":{"caching":"ReadWrite","managedDisk":{"storageAccountType":"Standard_LRS"},"name":"TestVM3osdisk","createOption":"FromImage"},"dataDisks":[{"diskSizeGB":1023,"createOption":"Empty","lun":0},{"diskSizeGB":1023,"createOption":"Empty","lun":1}]},"osProfile":{"adminUsername":"azureuser","computerName":"myVM","adminPassword":"myPassword12"},"networkProfile":{"networkInterfaces":[{"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myNic","properties":{"primary":true}}]}}}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
    ```

### Enable system assigned identity on an existing Azure VM

To enable system assigned identity on an existing VM, you need to acquire an access token and then use CURL to call the Resource Manager REST endpoint to update the identity type.

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Use the following CURL command to call the Azure Resource Manager REST endpoint to enable system assigned identity on your VM as identified in the request body by the value `{"identity":{"type":"SystemAssigned"}` for a VM named *myVM*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.
   
   > [!IMPORTANT]
   > To ensure you don't delete any existing user assigned managed identities that are assigned to the VM, you need to list the user assigned identities by using this CURL command: `curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAME>?api-version=2017-12-01' -H "Authorization: Bearer <ACCESS TOKEN>"`. If you have any user assigned identities assigned to the VM as identified in the `identity` value in the response, skip to step 3 that shows you how to retain user assigned identities while enabling system assigned identity on your VM.

   ```bash
    curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

3. To enable system assigned identity on a VM with existing user assigned identities, you need to add `SystemAssigned` to the `type` value.  
   
   For example, if your VM has the user assigned identities `ID1` and `ID2` assigned to it, and you would like to add system assigned identity to the VM, use the following CURL call. Replace `<ACCESS TOKEN>` and `<SUBSCRIPTION ID>` with values appropriate to your environment.
   
   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/TestVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned","UserAssigned", "identityIds":["/subscriptions/<<SUBSCRIPTION ID>>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1","/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

### Disable system assigned identity from an Azure VM

To disable a system assigned identity on an existing VM, you need to acquire an access token and then use CURL to call the Resource Manager REST endpoint to update the identity type to `None`.

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Update the VM using CURL to call the Azure Resource Manager REST endpoint to disable system assigned identity.  The following example disables system assigned identity as identified in the request body by the value `{"identity":{"type":"None"}}` from a VM named *myVM*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   > [!IMPORTANT]
   > To ensure you don't delete any existing user assigned managed identities that are assigned to the VM, you need to list the user assigned identities by using this CURL command: `curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAME>?api-version=2017-12-01' -H "Authorization: Bearer <ACCESS TOKEN>"`. If you have any user assigned identities assigned to the VM as identified in the `identity` value in the response, skip to step 3 that shows you how to retain user assigned identities while disabling system assigned identity on your VM.

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"None"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

3. To remove system assigned identity from a VM that has user assigned identities, remove `SystemAssigned` from the `{"identity":{"type:" "}}` value while keeping the `UserAssigned` value and `identityIds` array that defines what user assigned identities are assigned to the VM.

## User assigned identity

In this section, you learn how to add and remove user assigned identity on an Azure VM using CURL to make calls to the Azure Resource Manager REST endpoint.

### Assign a user assigned identity during the creation of an Azure VM

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. Create a [network interface](/cli/azure/network/nic?view=azure-cli-latest#az-network-nic-create) for your VM:

   ```azurecli-interactive
    az network nic create -g myResourceGroup --vnet-name myVnet --subnet mySubnet -n myNic
   ```

3.  Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ``` 

4. Create a user assigned identity using the instructions found here: [Create a user assigned managed identity](how-to-manage-ua-identity-rest.md#create-a-user-assigned-managed-identity).

5. Create a VM using CURL to call the Azure Resource Manager REST endpoint. The following example creates a VM named *myVM* in the resource group *myResourceGroup* with a user assigned identity `ID1`, as identified in the request body by the value `"identity":{"type":"UserAssigned"}`. Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.
 
   ```bash   
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PUT -d '{"location":"westus","name":"myVM",{"identity":{"type":"UserAssigned", "identityIds":["/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourcegroups/TestRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]}},"properties":{"hardwareProfile":{"vmSize":"Standard_D2_v2"},"storageProfile":{"imageReference":{"sku":"2016-Datacenter","publisher":"MicrosoftWindowsServer","version":"latest","offer":"WindowsServer"},"osDisk":{"caching":"ReadWrite","managedDisk":{"storageAccountType":"Standard_LRS"},"name":"TestVM3osdisk","createOption":"FromImage"},"dataDisks":[{"diskSizeGB":1023,"createOption":"Empty","lun":0},{"diskSizeGB":1023,"createOption":"Empty","lun":1}]},"osProfile":{"adminUsername":"azureuser","computerName":"myVM","adminPassword":"myPassword12"},"networkProfile":{"networkInterfaces":[{"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myNic","properties":{"primary":true}}]}}}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

### Assign a user assigned identity to an existing Azure VM

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2.  Create a user assigned identity using the instructions found here, [Create a user assigned managed identity](how-to-manage-ua-identity-rest.md#create-a-user-assigned-managed-identity).

3.  To ensure you don't delete existing user or system assigned managed identities that are assigned to the VM, you need to list the identity types assigned to the VM by using the following CURL command. If you have managed identities assigned to the virtual machine scale set, they are listed under in the `identity` value.

    ```bash
    curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAME>?api-version=2017-12-01' -H "Authorization: Bearer <ACCESS TOKEN>" 
    ```

    If you have any user or system assigned identities assigned to the VM as identified in the `identity` value in the response, skip to step 5 that shows you how to retain user assigned identities while enabling system assigned identity on your VM.

4. If you don't have any user assigned identities assigned to your VM, use the following CURL command to call the Azure Resource Manager REST endpoint to assign the first user assigned identity to the VM.  If you have a user assigned identity(s) assigned to the VM, skip to the next step that shows you how to add multiple user assigned identities to a VM.

   The following example assigns a user assigned identity, `ID1` to a VM named *myVM* in the resource group *myResourceGroup*.  Replace `<ACCESS TOKEN>` with the value you received in the previous step when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"userAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/TestRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

5. If you have user or system assigned identities assigned to your VM, you need to add the new user assigned identity to `identityIDs` array, while also retaining the user and system assigned identities that are currently assigned to the VM.

   For example if you have system assigned identity and user assigned identity `ID1` currently assigned to your VM and would like to add the user identity `ID2` to it, use the following CURL command. Replace `<ACCESS TOKEN>` with the value you received in the steps when you requested a Bearer access token and the `<SUBSCRIPTION ID>` value as appropriate for your environment.

   ```bash
   curl  'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/TestVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned","UserAssigned", "identityIds":["/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1","/subscriptions/<SUBSCRIPTION ID>/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID2"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

### Remove a user assigned identity from an Azure VM

1. Retrieve a Bearer access token, which you will use in the next step in the Authorization header to create your VM with a system assigned managed identity.

   ```azurecli-interactive
   az account get-access-token
   ```

2. To ensure you don't delete any existing user assigned managed identities that you would like to keep assigned to the VM or remove the system assigned identity, you need to list the managed identities by using the following CURL command: 
 
   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Compute/virtualMachines/<VM NAME>?api-version=2017-12-01' -H "Authorization: Bearer <ACCESS TOKEN>"
   ```
 
   If you have managed identities assigned to the VM, they are listed in the response in the `identity` value.

   For example, if you have user assigned identities `ID1` and `ID2` assigned to your VM, and would only like to keep `ID1` assigned and retain the system assigned identity, you would use the same CURL command as assigning a user assigned managed identity to a VM only keeping the `ID1` value and keep the `SystemAssigned` value. This removes the `ID2` user assigned identity from the VM while retaining the system assigned identity.

   ```bash
   curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned","UserAssigned", "identityIds":["/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourcegroups/TestRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ID1"]}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
   ```

If your VM has both system assigned and user assigned identities, you can remove all the user assigned identities by switching to use only system assigned using the following command:

```bash
curl 'https://management.azure.com/subscriptions/80c696ff-5efa-4909-a64d-f1b616f423ca/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/TestVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"SystemAssigned"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
```
    
If your VM has only user assigned identities and you would like to remove them all, use the following command:

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM?api-version=2017-12-01' -X PATCH -d '{"identity":{"type":"None"}}' -H "Content-Type: application/json" -H Authorization:"Bearer <ACCESS TOKEN>"
```
## Next steps

For information on how to create, list, or delete user assigned using REST see:

- [Create, list or delete a user assigned identity using REST API calls](how-to-manage-ua-identity-rest.md)