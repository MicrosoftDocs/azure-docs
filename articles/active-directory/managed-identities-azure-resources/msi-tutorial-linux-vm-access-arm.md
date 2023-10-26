---
title: Use a Linux VM user-assigned managed identity to access Azure Resource Manager
description: A tutorial that walks you through the process of using a user-assigned managed identity on a Linux VM to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: daveba
ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.custom: devx-track-arm-template
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ROBOTS: NOINDEX,NOFOLLOW
ms.collection: M365-identity-device-management
---

# Tutorial: Use a user-assigned managed identity on a Linux VM to access Azure Resource Manager

This tutorial explains how to create a user-assigned managed identity, assign it to a Linux Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. Managed identities for Azure resources are automatically managed by Azure. They enable authentication to services that support Microsoft Entra authentication, without needing to embed credentials into your code. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a user-assigned managed identity
> * Assign the user-assigned managed identity to a Linux VM 
> * Grant the user-assigned managed identity access to a Resource Group in Azure Resource Manager 
> * Get an access token using the user-assigned managed identity and use it to call Azure Resource Manager 

## Prerequisites

- An understanding of Managed identities. If you're not familiar with the managed identities for Azure resources feature, see this [overview](overview.md). 
- An Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- You also need a Linux Virtual machine. If you need to create  a virtual machine for this tutorial, you can follow the article titled [Create a Linux virtual machine with the Azure portal](/azure/virtual-machines/linux/quick-create-portal#create-virtual-machine)
- To run the example scripts, you have two options:
    - Use the [Azure Cloud Shell](/azure/cloud-shell/overview), which you can open using the **Try It** button on the top-right corner of code blocks.
    - Run scripts locally by installing the latest version of the [Azure CLI](/cli/azure/install-azure-cli), then sign in to Azure using [az login](/cli/azure/reference-index#az-login).

## Create a user-assigned managed identity

Create a user-assigned managed identity using [az identity create](/cli/azure/identity#az-identity-create). The `-g` parameter specifies the resource group where the user-assigned managed identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<UAMI NAME>` parameter values with your own values:
    
[!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

```azurecli-interactive
az identity create -g <RESOURCE GROUP> -n <UAMI NAME>
```

The response contains details for the user-assigned managed identity created, similar to the following example. Note the `id` value for your user-assigned managed identity, as it will be used in the next step:

```json
{
"clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
"clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAMI NAME>/credentials?tid=5678&oid=9012&aid=12344643-8088-4d70-9532-c3a0fdc190fz",
"id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAMI NAME>",
"location": "westcentralus",
"name": "<UAMI NAME>",
"principalId": "9012",
"resourceGroup": "<RESOURCE GROUP>",
"tags": {},
"tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
"type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

## Assign an identity to your Linux VM

A user-assigned managed identity can be used by clients on multiple Azure resources. Use the following commands to assign the user-assigned managed identity to a single VM. Use the `Id` property returned in the previous step for the `-IdentityID` parameter.

Assign the user-assigned managed identity to your Linux VM using [az vm identity assign](/cli/azure/vm). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. Use the `id` property returned in the previous step for the `--identities` parameter value.

```azurecli-interactive
az vm identity assign -g <RESOURCE GROUP> -n <VM NAME> --identities "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<UAMI NAME>"
```

## Grant access to a Resource Group in Azure Resource Manager

Managed identities are identities that your code can use to request access tokens to authenticate to resource APIs that support Microsoft Entra authentication. In this tutorial, your code will access the Azure Resource Manager API.  

Before your code can access the API, you need to grant the identity access to a resource in Azure Resource Manager. In this case, the Resource Group in which the VM is contained. Update the value for `<SUBSCRIPTION ID>` and `<RESOURCE GROUP>` as appropriate for your environment. Additionally, replace `<UAMI PRINCIPALID>` with the `principalId` property returned by the `az identity create` command in [Create a user-assigned managed identity](#create-a-user-assigned-managed-identity):

```azurecli-interactive
az role assignment create --assignee <UAMI PRINCIPALID> --role 'Reader' --scope "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP> "
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

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

For the remainder of the tutorial, we will work from the VM we created earlier.

To complete these steps, you need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](/windows/wsl/about). 

1. Sign in to the [Azure portal]portal](https://portal.azure.com).
2. In the portal, navigate to **Virtual Machines** and go to the Linux virtual machine and in the **Overview**, click **Connect**. Copy the string to connect to your VM.
3. Connect to the VM with the SSH client of your choice. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](/windows/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).
4. In the terminal window, use CURL to make a request to the Azure Instance Metadata Service (IMDS) identity endpoint to get an access token for Azure Resource Manager.  

   The CURL request to acquire an access token is shown in the following example. Be sure to replace `<CLIENT ID>` with the `clientId` property returned by the `az identity create` command in [Create a user-assigned managed identity](#create-a-user-assigned-managed-identity): 
    
   ```bash
   curl -H Metadata:true "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com/&client_id=<UAMI CLIENT ID>"   
   ```
    
    > [!NOTE]
    > The value of the `resource` parameter must be an exact match for what is expected by Microsoft Entra ID. When using the Resource Manager resource ID, you must include the trailing slash on the URI. 
    
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

5. Use the access token to access Azure Resource Manager, and read the properties of the Resource Group to which you previously granted your user-assigned managed identity access. Be sure to replace `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>` with the values you specified earlier, and `<ACCESS TOKEN>` with the token returned in the previous step.

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

In this tutorial, you learned how to create a user-assigned managed identity and attach it to a Linux virtual machine to access the Azure Resource Manager API.  To learn more about Azure Resource Manager see:

> [!div class="nextstepaction"]
>[Azure Resource Manager](/azure/azure-resource-manager/management/overview)
