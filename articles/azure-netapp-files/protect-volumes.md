---
title: Enable backup by default for  Azure NetApp Files new volumes
description: Learn about how you can enable backup to protect your existing Azure NetApp Files volumes
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 10/22/2025
ms.author: anfdocs
---
# Enable backup by default for Azure NetApp Files new volumes (preview)

You can protect your new volumes by enabling backup protection for the volume. This enhances data protection with an additional layer of protection without the need for manual setup.

## Register the feature 

The Enable backup by default for Azure NetApp Files is currently in preview. You must submit a [waitlist request](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR2Qj2eZL0mZPv1iKUrDGvc9UOEdNTzVCQjRGN0NWMTVKNkhCRUNYMFhROCQlQCN0PWcu&route=shorturl) to access this feature.

After submitting the request, check the status of feature registration with the command:

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBackupByDefault
```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.

## Enable backup by default

1. From the **Volumes** page, right-click the volume for which you want to enable backup protection and select **Data Protection**.

   
1. Specify the parameters for the volume:

    **Backup vault**      
        Specify the backup vault for the volume or [create a new backup vault](backup-vault-manage.md). 
        
    **Backup policy**  
        Specify the backup policy for the volume or [create a new backup policy](backup-configure-policy-based.md). 

    **Policy state**  
        Select the state of the backup policy.  

    **Daily backups retained**  
        Specifies the number of backups that can be retained on a daily basis.

    **Weekly backups retained**  
        Specifies the number of backups that can be retained on a weekly basis. 

    **Monthly backups retained**  
        Specifies the number of backups that can be retained on a monthly basis.

1. Click **Ok**.