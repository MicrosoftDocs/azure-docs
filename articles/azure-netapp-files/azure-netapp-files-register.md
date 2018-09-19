---
title: Register for Azure NetApp Files | Microsoft Docs
description: To enroll in the Public Preview program of Azure NetApp Files, you must submit a request to register your subscription for using the NetApp Resource Provider and the public preview feature. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/19/2018
ms.author: b-juche
---
# Register for Azure NetApp Files
To enroll in the Public Preview program of Azure NetApp Files, you must submit a request to register your subscription for using the NetApp Resource Provider and the public preview feature. 

## Steps 

1. To submit a request, run the following commands by using PowerShell or CLI 2.0:
  * PowerShell:  
    `Register-AzureProvider -ProviderNamespace Microsoft.NetApp`
    `Register-AzureRmProviderFeature -FeatureName publicPreviewADC -ProviderNamespace Microsoft.NetApp`
* CLI 2.0  
    `az provider register –-namespace Microsoft.NetApp`
    `az feature register –-namespace Microsoft.NetApp –-name publicPreviewADC`
  
2.	After your request is approved, display your status from the portal to confirm that your subscription has been registered for the NetApp Resource Provider:   
    1. From Azure Portal, click the **Subscriptions** blade.
    2. In the Subscriptions blade, click your subscription ID.
    3. In the Settings of the subscription, click **Resource providers** to verify that Microsoft.NetApp shows `Registered`.  

      ![Registered Microsoft.NetApp](../media/azure-netapp-files/azure-netapp-files-registered-resource-providers.png)



## Next steps  

1. [Create a NetApp account](azure-netapp-files-create-netapp-account.md)
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
1. [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
1. [Configure export policy for a volume (optional)](azure-netapp-files-configure-export-policy.md)
