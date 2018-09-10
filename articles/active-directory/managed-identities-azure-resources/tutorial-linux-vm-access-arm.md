---
title: Use a Linux VM system-assigned managed identity to access Azure Resource Manager
description: A quickstart that walks you through the process of using a Linux VM system-assigned managed identity to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: bryanla

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/20/2017
ms.author: daveba
---

# Use a Linux VM system-assigned managed identity to access Azure Resource Manager

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This quickstart shows you how to use a system-assigned identity for a Linux virtual machine (VM) to access the Azure Resource Manager API. Managed identities for Azure resources are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code. 
You learn how to:

> [!div class="checklist"]
> * Grant your VM access to a Resource Group in Azure Resource Manager 
> * Get an access token using the VM identity and use it to call Azure Resource Manager 

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

- [Sign in to Azure portal](https://portal.azure.com)

- [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal)

- [Enable system-assigned managed identity on your virtual machine](/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm#enable-system-assigned-identity-on-an-existing-vm)

## Grant your VM access to a Resource Group in Azure Resource Manager 

Using managed identities for Azure resources, your code can get access tokens to authenticate to resources that support Azure AD authentication. The Azure Resource Manager API supports Azure AD authentication. First, we need to grant this VM's identity access to a resource in Azure Resource Manager, in this case the Resource Group in which the VM is contained.  

1. Navigate to the tab for **Resource Groups**.
2. Select the specific **Resource Group** you created earlier.
3. Go to **Access control(IAM)** in the left panel.
4. Click to **Add** a new role assignment for your VM. Choose **Role** as **Reader**.
5. In the next dropdown, **Assign access to** the resource **Virtual Machine**.
6. Next, ensure the proper subscription is listed in the **Subscription** dropdown. And for **Resource Group**, select **All resource groups**.
7. Finally, in **Select** choose your Linux Virtual Machine in the dropdown and click **Save**.

    ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-permission-linux.png)

## Get an access token using the VM's system-assigned managed identity and use it to call Resource Manager 

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](../../virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](../../virtual-machines/linux/mac-create-ssh-keys.md).

1. In the portal, navigate to your Linux VM and in the **Overview**, click **Connect**.  
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local managed identities for Azure resources endpoint to get an access token for Azure Resource Manager.  
 
    The CURL request for the access token is below.  
    
    ```bash
    curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true   
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
    {"id":"/subscriptions/98f51385-2edc-4b79-bed9-7718de4cb861/resourceGroups/DevTest","name":"DevTest","location":"westus","properties":{"provisioningState":"Succeeded"}} 
    ```     

## Next steps

In this quickstart, you learned how to use a system-assigned managed identity to access the Azure Resource Manager API.  To learn more about Azure Resource Manager see:

> [!div class="nextstepaction"]
>[Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview)