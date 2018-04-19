---
title: Use a Linux VM user-assigned MSI to access Azure Resource Manager
description: A tutorial that walks you through the process of using a User-Assigned Managed Service Identity (MSI) on a Linux VM, to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/22/2017
ms.author: arluca
ROBOTS: NOINDEX,NOFOLLOW
---

# Use a user-assigned Managed Service Identity (MSI) on a Linux VM, to access Azure Resource Manager

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial explains how to create a user-assigned Managed Service Identity (MSI), assign it to a Linux Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. 

Managed Service Identities are automatically managed by Azure. They enable authentication to services that support Azure AD authentication, without needing to embed credentials into your code.

You learn how to:

> [!div class="checklist"]
> * Create a user-assigned MSI
> * Assign the MSI to a Linux VM 
> * Grant the MSI access to a Resource Group in Azure Resource Manager 
> * Get an access token using the MSI and use it to call Azure Resource Manager 

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

[!INCLUDE [msi-tut-prereqs](~/includes/active-directory-msi-tut-prereqs.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Linux Virtual Machine in a new Resource Group

For this tutorial, you first create a new Linux VM. You can also opt to use an existing VM.

1. Click **Create a resource** on the upper left-hand corner of the Azure portal.
2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**.
3. Enter the virtual machine information. For **Authentication type**, select **SSH public key** or **Password**. The created credentials allow you to log in to the VM.

    ![Create Linux VM](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-linux-vm.png)

4. Choose a **Subscription** for the virtual machine in the dropdown.
5. To select a new **Resource Group** you would like the virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the Supported disk type filter. On the settings blade, keep the defaults and click **OK**.

## Create a user-assigned MSI

1. If you are using the CLI console (instead of an Azure Cloud Shell session), start by signing in to Azure. Use an account that is associated with the Azure subscription under which you would like to create the new MSI:

    ```azurecli
    az login
    ```

2. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create). The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```

    The response contains details for the user-assigned MSI created, similar to the following example. Note the `id` value for your MSI, as it will be used in the next step:

    ```json
    {
    "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
    "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>/credentials?tid=5678&oid=9012&aid=12344643-8088-4d70-9532-c3a0fdc190fz",
    "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>",
    "location": "westcentralus",
    "name": "<MSI NAME>",
    "principalId": "9012",
    "resourceGroup": "<RESOURCE GROUP>",
    "tags": {},
    "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
    "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

## Assign a user-assigned identity to your Linux VM

Unlike a system-assigned MSI, a user-assigned MSI can be used by clients on multiple Azure resources. For this tutorial, you assign it to a single VM. You can also assign it to more than one VM.

Assign the user-assigned MSI to your Linux VM using [az vm assign-identity](/cli/azure/vm#az_vm_assign_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. Use the `id` property returned in the previous step for the `--identities` parameter value:

```azurecli-interactive
az vm assign-identity -g <RESOURCE GROUP> -n <VM NAME> --identities "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>"
```

## Grant your user-assigned identity access to a Resource Group in Azure Resource Manager 

MSI provides your code with an access token to authenticate to resource APIs that support Azure AD authentication. In this tutorial, your code accesses the Azure Resource Manager API. 

Before your code can access the API though, you need to grant the MSI's identity access to a resource in Azure Resource Manager. In this case, the Resource Group in which the VM is contained. Update the values for `<SUBSCRIPTION ID>` and `<RESOURCE GROUP>` as appropriate for your environment. Additionally, replace `<MSI PRINCIPALID>` with the `principalId` property returned by the `az identity create` command in [Create a user-assigned MSI](#create-a-user-assigned-msi):

```azurecli-interactive
az role assignment create --assignee <MSI PRINCIPALID> --role 'Reader' --scope "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP> "
```

The response contains details for the role assignment created, similar to the following example:

```json
{
  "id": "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Authorization/roleAssignments/b402bd74-157f-425c-bf7d-zed3a3a581ll",
  "name": "b402bd74-157f-425c-bf7d-zed3a3a581ll",
  "properties": {
    "principalId": "f5fdfdc1-ed84-4d48-8551-999fb9dedfbl",
    "roleDefinitionId": "/subscriptions/<SUBSCRIPTION ID>/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "scope": "/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>"
  },
  "resourceGroup": "<RESOURCE GROUP>",
  "type": "Microsoft.Authorization/roleAssignments"
}

```

## Get an access token using the VM's identity and use it to call Resource Manager 

For the remainder of the tutorial, we will work from the VM we created earlier.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the Azure portal, navigate to **Virtual Machines**, go to your Linux virtual machine, then from the **Overview** page click **Connect** at the top. Copy the string to connect to your VM.
2. **Connect** to the VM with the SSH client of your choice.  
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.  

   The CURL request to acquire an access token is shown in the following example. Be sure to replace `<CLIENT ID>` with the `clientId` property returned by the `az identity create` command in [Create a user-assigned MSI](#create-a-user-assigned-msi): 
    
   ```bash
   curl -H Metadata:true "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com/&client_id=<MSI CLIENT ID>"   
   ```
    
    > [!NOTE]
    > The value of the `resource` parameter must be an exact match for what is expected by Azure AD. When using the Resource Manager resource ID, you must include the trailing slash on the URI. 
    
    The response includes the access token you need to access Azure Resource Manager. 
    
    Response example:  

    ```bash
    {
    "access_token":"eyJ0eXAiOi...",
    "refresh_token":"",
    "expires_in":"3599",
    "expires_on":"1504130527",
    "not_before":"1504126627",
    "resource":"https://management.azure.com",
    "token_type":"Bearer"
    } 
    ```

4. Now use the access token to access Azure Resource Manager, and read the properties of the Resource Group to which you previously granted your user-assigned MSI access. Be sure to replace `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>` with the values you specified earlier, and `<ACCESS TOKEN>` with the token returned in the previous step.

    > [!NOTE]
    > The URL is case-sensitive, so be sure to use the exact same case you used earlier when you named the Resource Group, and the uppercase "G" in `resourceGroups`.  

    ```bash 
    curl https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>?api-version=2016-09-01 -H "Authorization: Bearer <ACCESS TOKEN>" 
    ```

    The response contains the specific Resource Group information, similar to the following example: 

    ```bash
    {
    "id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/DevTest",
    "name":"DevTest",
    "location":"westus",
    "properties":{"provisioningState":"Succeeded"}
    } 
    ```
    
## Next steps

- For an overview of MSI, see [Managed Service Identity overview](overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.
