---
title: Set Azure Resource Manager password on your Azure Stack Edge device
description: Describes how to connect to the Azure Resource Manager running on your Azure Stack Edge using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 12/13/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to connect to Azure Resource Manager on my Azure Stack Edge device so that I can manage resources.
---

# Set Azure Resource Manager password

This article describes how to set your Azure Resource Manager password. You need to set this password when you are connecting to the device local APIs via the Azure Resource Manager.

## Install PowerShell module on the client

You will use the same client that you will be using to connect to Azure Resource Manager. You will need to install a version of PowerShell that is compatible with both Azure-RM and Az modules. 

1. Check current version.
2. Install PowerShell core 6.0 version.

## Set context

1. Set the tenant, subscription, and environment for cmdlets to use in the current session using `Set-AzContext`. Use the Azure subscription used when creating the Azure Stack Edge/Data Box Gateway resource. 

    `Set-AzureContext`

    Here is the sample output.

    ```azurepowershell
    PS Azure:\> Set-AzContext -SubscriptionId "xxxx-xxxx-xxxx-xxxx"
       
    Name    Account             SubscriptionName    Environment     TenantId
    ----    -------             ----------------    -----------     -------
    Work    test@outlook.com    Subscription1       AzureCloud      xxxxxxxx
    ```

2. Get the SDK encryption key from the Azure portal. 

    1. In the Azure portal, go to your Azure Stack Edge resource and then go to **Device properties**. 

    2. Copy the Encryption Key. You will use this key later.
 

3. Set the password to connect to the device local APIs via Azure Resource Manager. Type:

    `Execute Set-AzDataBoxEdgeUser`

    The password and encryption key parameters must be passed as secure strings. Use the following cmdlets to convert the password and encryption key to secure strings. 

    
    ```azurepowershell
    $pass = ConvertTo-SecureString “Password1” -AsPlainText -Force
    $key = ConvertTo-SecureString “xxxxxxxxxxxxxxxxxx” -AsPlainText -Force
    ```

    Use the above generated secure strings as parameters in the Execute Set-AzDataBoxEdgeUser cmdlet to reset the password. Use the same resource group that you used when creating the Azure Stack Edge/Data Box GatewayHere is the sample output.

    
    ```azurepowershell
    PS C:\> Set-AzDataBoxEdgeUser -ResourceGroupName sampleRGName -DeviceName SampleDeviceName -Name EdgeARMUser  -Password $pass -EncryptionKey $key
       
        User name   Type ResourceGroupName DeviceName
        ---------   ---- ----------------- ----------
        EdgeARMUser ARM   sampleRGName     SampleDeviceName
    ```

## Next steps

[Connect to Azure Resource Manager](azure-stack-edge-r-series-connect-azure-resource-manager.md)