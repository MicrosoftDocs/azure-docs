---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 06/30/2021
ms.author: alkohli
---

Make sure that the following steps can be used to access the device from your client.

Verify that your client can connect to the local Azure Resource Manager. 

1. Call local device APIs to authenticate:

    ### [Az](#tab/az)

    ```powershell
    login-AzAccount -EnvironmentName <Environment Name> -TenantId aaaabbbb-0000-cccc-1111-dddd2222eeee  
    ```

    ### [AzureRM](#tab/azure-rm)

    ```powershell
    login-AzureRMAccount -EnvironmentName <Environment Name> -TenantId aaaabbbb-0000-cccc-1111-dddd2222eeee  
    ```

1. Provide the username `EdgeArmUser` and the password to connect via Azure Resource Manager. If you do not recall the password, [Reset the password for Azure Resource Manager](../articles/databox-online/azure-stack-edge-gpu-set-azure-resource-manager-password.md) and use this password to sign in.
