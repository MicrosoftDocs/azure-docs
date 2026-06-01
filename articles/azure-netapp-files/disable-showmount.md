---
title: Disable showmount in Azure NetApp Files 
description: Disable the showmount if it presents a security concern for users to see exported file systems on an NFS server. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/16/2025
ms.author: anfdocs
ms.custom: sfi-image-nochange
# Customer intent: "As a cloud administrator, I want to disable the showmount functionality in Azure NetApp Files, so that I can enhance security by preventing unauthorized users from viewing exported file systems."
---
# Disable showmount in Azure NetApp Files (preview)

On NFS clients, the showmount enables users to see exported file systems on an NFS server. By default, Azure NetApp Files enables showmount functionality to show exported paths. Azure NetApp Files doesn't list the allowed client access. Instead, showmount displays that everyone has access. The setting allows NFS clients to use the `showmount -e` command to see a list of exports available on the Azure NetApp Files NFS-enabled storage endpoint.

This functionality can cause security scanners to flag the Azure NetApp Files NFS service as having a vulnerability because these scanners often use showmount to see what is being returned. If you encounter this scenario, you can disable the functionality. 

Some applications such as Oracle OVM, rely on showmount. In those scenarios, inform the security team of the application requirements.

The disable showmount capability is currently in preview. If you're using this feature for the first time, you need to register the feature first. By registering the feature, you disable the showmount. By unregistering the feature, you enable the showmount. 

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** can remain in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```

    You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

3. Confirm that the disablement of the feature in the **Overview** menu of your Azure subscription. The attribute **Disable Showmount** displays as true if the operation succeeded.

    :::image type="content" source="./media/disable-showmount/disable-showmount.png" alt-text="Screenshot of the Azure interface depicting the disable showmount option." lightbox="./media/disable-showmount/disable-showmount.png":::

4. If you need to enable showmount, unregister the feature. 
 
    ```azurepowershell-interactive
    Unregister-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDisableShowmount
    ```
