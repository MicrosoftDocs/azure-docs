---
title: "Tutorial: Use managed identity to access Azure Resource Manager - Windows"
description: A tutorial that walks you through the process of using a Windows VM system-assigned managed identity to access Azure Resource Manager.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: daveba
ms.custom: subject-rbac-steps, mode-other, devx-track-arm-template
ms.service: active-directory
ms.subservice: msi
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/30/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
---

# Use a Windows VM system-assigned managed identity to access Resource Manager

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to access the Azure Resource Manager API using a Windows virtual machine with system-assigned managed identity enabled. Managed identities for Azure resources are automatically managed by Azure and enable you to authenticate to services that support Microsoft Entra authentication without needing to insert credentials into your code. You learn how to:

> [!div class="checklist"] 
> * Grant your VM access to a Resource Group in Azure Resource Manager 
> * Get an access token using the VM identity and use it to call Azure Resource Manager

## Prerequisites

- A basic understanding of Managed identities. If you're not familiar with the managed identities for Azure resources feature, see this [overview](overview.md).
- An Azure account, [sign up for a free account](https://azure.microsoft.com/free/).
- "Owner" permissions at the appropriate scope (your subscription or resource group) to perform required resource creation and role management steps. If you need assistance with role assignment, see [Assign Azure roles to manage access to your Azure subscription resources](/azure/role-based-access-control/role-assignments-portal).
- You also need a Windows Virtual machine that has system assigned managed identities enabled.
  - If you need to create  a virtual machine for this tutorial, you can follow the article titled [Create a virtual machine with system-assigned identity enabled](./qs-configure-portal-windows-vm.md#system-assigned-managed-identity)

## Enable

[!INCLUDE [msi-tut-enable](../../../includes/active-directory-msi-tut-enable.md)]

## Grant your VM access to a resource group in Resource Manager

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Using managed identities for Azure resources, your application can get access tokens to authenticate to resources that support Microsoft Entra authentication. The Azure Resource Manager API supports Microsoft Entra authentication. We grant this VM's identity access to a resource in Azure Resource Manager, in this case a Resource Group. We assign the [Reader](/azure/role-based-access-control/built-in-roles#reader) role to the managed-identity at the scope of the resource group. 

1. Sign in to the [Azure portal](https://portal.azure.com) with your administrator account.
1. Navigate to the tab for **Resource Groups**.
1. Select the **Resource Group** you want to grant the VM's managed identity access.
1. In the left panel, select **Access control (IAM)**.
1. Select **Add**, and then select **Add role assignment**.
1. In the **Role** tab, select **Reader**. This role allows view all resources, but doesn't allow you to make any changes.
1. In the **Members** tab, for the **Assign access to**, select **Managed identity**. Then, select **+ Select members**.
1. Ensure the proper subscription is listed in the **Subscription** dropdown. And for **Resource Group**, select **All resource groups**.
1. For the **Manage identity** dropdown, select **Virtual Machine**.
1. Finally, in **Select** choose your Windows Virtual Machine in the dropdown and select **Save**.

## Get an access token using the VM's system-assigned managed identity and use it to call Azure Resource Manager 

You'll need to use **PowerShell** in this portion.  If you don’t have **PowerShell** installed, download it [here](/powershell/azure/). 

1. In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, select **Connect**. 
2. Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3. Now that you've created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session. 
4. Using the Invoke-WebRequest cmdlet, make a request to the local managed identity for Azure resources endpoint to get an access token for Azure Resource Manager.

    ```powershell
       $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/' -Method GET -Headers @{Metadata="true"}
    ```
    
    > [!NOTE]
    > The value of the "resource" parameter must be an exact match for what is expected by Microsoft Entra ID. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    
    Next, extract the full response, which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 
    
    ```powershell
    $content = $response.Content | ConvertFrom-Json
    ```
    Next, extract the access token from the response.
    
    ```powershell
    $ArmToken = $content.access_token
    ```
    
    Finally, call Azure Resource Manager using the access token. In this example, we're also using the Invoke-WebRequest cmdlet to make the call to Azure Resource Manager, and include the access token in the Authorization header.
    
    ```powershell
    (Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>?api-version=2016-06-01 -Method GET -ContentType "application/json" -Headers @{ Authorization ="Bearer $ArmToken"}).content
    ```
    > [!NOTE] 
    > The URL is case-sensitive, so ensure if you are using the exact same case as you used earlier when you named the Resource Group, and the uppercase "G" in "resourceGroups."
        
    The following command returns the details of the Resource Group:

    ```powershell
    {"id":"/subscriptions/98f51385-2edc-4b79-bed9-7718de4cb861/resourceGroups/DevTest","name":"DevTest","location":"westus","properties":{"provisioningState":"Succeeded"}}
    ```

## Next steps

In this quickstart, you learned how to use a system-assigned managed identity to access the Azure Resource Manager API.  To learn more about Azure Resource Manager see:

> [!div class="nextstepaction"]
>[Azure Resource Manager](/azure/azure-resource-manager/management/overview)
