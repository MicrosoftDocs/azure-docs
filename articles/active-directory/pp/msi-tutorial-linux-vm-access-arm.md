---
title: Use a Linux VM User-Assigned MSI to access Azure Resource Manager
description: A tutorial that walks you through the process of using a User-Assigned Managed Service Identity (MSI) on a Linux VM, to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: bryanLa
manager: mtillman
editor: bryanla

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/19/2017
ms.author: arluca
ROBOTS: NOINDEX,NOFOLLOW
---

# Use a Linux VM User-Assigned Managed Service Identity (MSI) to access Azure Resource Manager

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

This tutorial explains how to create a User-Assigned Managed Service Identity (MSI), assign it to a Linux Virtual Machine (VM), and then use that identity to access the Azure Resource Manager API. 

Managed Service Identities are automatically managed by Azure. They enable authentication to services that support Azure AD authentication, without needing to embed credentials into your code.

You learn how to:

> [!div class="checklist"]
> * Create a User-Assigned MSI
> * Assign the MSI to a Linux VM 
> * Grant the MSI access to a Resource Group in Azure Resource Manager 
> * Get an access token using the MSI and use it to call Azure Resource Manager 

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

[!INCLUDE [msi-tut-prereqs](~/includes/active-directory-msi-tut-prereqs.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block (see next section).
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Linux Virtual Machine in a new Resource Group

For this tutorial, we will create a new Linux VM. You can also opt to use an existing VM.

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Select **Compute**, and then select **Ubuntu Server 16.04 LTS**.
3. Enter the virtual machine information. For **Authentication type**, select **SSH public key** or **Password**. The created credentials allow you to log in to the VM.

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-linux-vm.png)

4. Choose a **Subscription** for the virtual machine in the dropdown.
5. To select a new **Resource Group** you would like the virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the Supported disk type filter. On the settings blade, keep the defaults and click **OK**.

## Create a new User Assigned MSI

1. If you are using the CLI console (instead of an Azure Cloud Shell session), start by signing in to Azure. Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli
   az login
   ```

2. Create a User Assigned MSI using [az identity create](/cli/azure). The `-g` parameter specifies the resource group where the MSI will be created, and the `-n` parameter specifes its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```

The response contains details for the user-assigned MSI created. Please note the `id` value for your MSI, as it will be used in the next step.

    ```json
    {
    "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
    "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>/credentials?tid=5678&oid=9012&aid=73444643-8088-4d70-9532-c3a0fdc190fz",
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

## Assign your user-assigned MSI to your Linux VM

Unlike a system-assigned MSI, a user-assigned MSI can be used by clients on multiple Azure resources. For this tutorial, we will be assigning it to a single VM. You can also assign it to more than one VM.

1. Assign the user-assigned MSI to your Linux VM using [az vm assign-identity](/cli/azure). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. Use the `id` property returned in the previous step for the `--identities` parameter value:

    ```azurecli-interactive
    az vm assign-identity -g <RESOURCE GROUP> -n <VM NAME> -–identities "/subscriptions/<SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>"
    ```

## Enable MSI on your VM

A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM and it enables MSI for the VM.  

1. Select the **Virtual Machine** that you want to enable MSI on.
2. On the left navigation bar click **Configuration**.
3. You see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No.
4. Ensure you click **Save** to save the configuration.

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check which extensions are on this **Linux VM**, click **Extensions**. If MSI is enabled, the **ManagedIdentityExtensionforLinux** appears on the list.

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-extension-value.png)

## Grant your VM access to a Resource Group in Azure Resource Manager 

Using MSI your code can get access tokens to authenticate to resources that support Azure AD authentication. The Azure Resource Manager API supports Azure AD authentication. First, we need to grant this VM's identity access to a resource in Azure Resource Manager, in this case the Resource Group in which the VM is contained.  

1. Navigate to the tab for **Resource Groups**.
2. Select the specific **Resource Group** you created earlier.
3. Go to **Access control(IAM)** in the left panel.
4. Click to **Add** a new role assignment for your VM. Choose **Role** as **Reader**.
5. In the next dropdown, **Assign access to** the resource **Virtual Machine**.
6. Next, ensure the proper subscription is listed in the **Subscription** dropdown. And for **Resource Group**, select **All resource groups**.
7. Finally, in **Select** choose your Linux Virtual Machine in the dropdown and click **Save**.

    ![Alt image text](~/articles/active-directory/media/msi-tutorial-linux-vm-access-arm/msi-permission-linux.png)

## Get an access token using the VM's identity and use it to call Resource Manager 

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](~/articles/virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](~/articles/virtual-machines/linux/mac-create-ssh-keys.md).

1. In the portal, navigate to your Linux VM and in the **Overview**, click **Connect**.  
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.  
 
    The CURL request for the access token is below.  
    
    ```bash
    curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true   
    ```
    
    > [!NOTE]
    > The value of the “resource” parameter must be an exact match for what is expected by Azure AD.  In the case of the Resource Manager resource ID, you must include the trailing slash on the URI. 
    
    The response includes the access token you need to access Azure Resource Manager. 
    
    Response:  

    ```bash
    {"access_token":"eyJ0eXAiOi...",
    "refresh_token":"",
    "expires_in":"3599",
    "expires_on":"1504130527",
    "not_before":"1504126627",
    "resource":"https://management.azure.com",
    "token_type":"Bearer"} 
    ```
    
    You can use this access token to access Azure Resource Manager, for example to read the details of the Resource Group to which you previously granted this VM access. Replace the values of \<SUBSCRIPTION ID\>, \<RESOURCE GROUP\>, and \<ACCESS TOKEN\> with the ones you created earlier. 
    
    > [!NOTE]
    > The URL is case-sensitive, so ensure if you are using the exact same case as you used earlier when you named the Resource Group, and the uppercase “G” in “resourceGroup”.  
    
    ```bash 
    curl https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>?api-version=2016-09-01 -H "Authorization: Bearer <ACCESS TOKEN>" 
    ```
    
    The response back with the specific Resource Group information: 
     
    ```bash
    {"id":"/subscriptions/<SUBSCRIPTION ID>/resourceGroups/DevTest","name":"DevTest","location":"westus","properties":{"provisioningState":"Succeeded"}} 
    ```
     
## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.

