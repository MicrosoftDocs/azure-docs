---
title: Disable showmount in Azure NetApp Files | Microsoft Docs
description: Showmount on NFS clients has historically been how users can see exported file systems on an NFS server. You can disable the showmount if it presents a security concern for your needs.
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
ms.date: 03/16/2023
ms.author: anfdocs
---
# Disable showmount in Azure NetApp Files (preview)

Showmount on NFS clients has historically been how users can see exported file systems on an NFS server. By default, Azure NetApp Files enables showmount functionality to show exported paths but doesn't list the allowed client access. Instead, showmount displays that (everyone) has access. The setting allows NFS clients to use the `showmount -e` command to see a list of exports available on the Azure NetApp Files NFS-enabled storage endpoint.

This functionality might cause security scanners to flag the Azure NetApp Files NFS service as having a vulnerability because these scanners often use showmount to see what is being returned. In those scenarios, you might want to disable showmount on Azure NetApp Files.

Some applications, however, make use of showmount for functionality, such as Oracle OVM. In those scenarios, inform the security team of the application requirements.

The disable showmount capability is currently in preview. If you're using this feature for the first time, you need to register the feature first. By registering the feature, you disable the showmount. By unregistering the feature, you enable the showmount. 

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

3. Confirm that you've disabled the showmount in the **Overview** menu of your Azure subscription. The attribute **Disable Showmount** displays as true if the operation succeeded.

    :::image type="content" source="../media/azure-netapp-files/disable-showmount.png" alt-text="Screenshot of the Azure interface depicting the disable showmount option." lightbox="../media/azure-netapp-files/disable-showmount.png":::

4. If you need to enable showmount, unregister the feature. 
 
    ```azurepowershell-interactive
    Unregister-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```