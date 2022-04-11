---
title: Disable showmount in Azure NetApp Files | Microsoft Docs
description: By disabling the showmount, you can hide mounted files in a subscription from view.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 04/11/2022
ms.author: anfdocs
---
# Disable showmount in Azure NetApp Files

By disabling showmount, you can hide mounted files in a subscription from view. 

Showmount is a read-only attribute. By default, showmount is enabled. 

## Register the feature to disable showmount

The disable showmount capability is currently in public preview. If you're using this feature for the first time, you need to register the feature first. By registering the feature, you disable the showmount. By unregistering the feature, you enable the showmount. 

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```

    You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

3. Confirm that you've disabled the showmount in the **Overview** menu of your Azure subscription. The attribute **Disable Showmount** will display as true if the operation succeeded.

    :::image type="content" source="../media/azure-netapp-files/disable-showmount.png" alt-text="Screenshot of the Azure interface depicting the disable showmount option." lightbox="../media/azure-netapp-files/disable-showmount.png":::

4. If you need to enable showmount, unregister the feature. 
 
    ```azurepowershell-interactive
    Unregister-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```