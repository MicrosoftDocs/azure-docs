---
title: Set up a capacity pool for Azure NetApp Files | Microsoft Docs
description: Describes how to set up a capacity pool so that you can create volumes within it.  
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
ms.date: 03/28/2018
ms.author: b-juche
---
# Set up a capacity pool
Setting up a capacity pool enables you to create volumes within it.  

## Before you begin 
You must have already created a NetApp account.   

[Create a NetApp account](azure-netapp-files-create-netapp-account.md)

## Steps 

1. Go to the management blade for your NetApp account, and then, from the navigation pane, select **Capacity pools**.

2. Click **+ Add pools** to create a new capacity pool.   
    The New Capacity Pool window appears.

3. Provide the following information for the new capacity pool:  
  * **Name**  
    Specify the name for the capacity pool.  
    The capacity pool name must be unique for each NetApp account.

  * **Service level**   
    This field shows the target performance for the capacity pool.  
    Currently, only the Premium service level is available. 

  *  **Size**     
      Specify the size of the capacity pool that you are purchasing.        
      The minimum capacity pool size is 4 TiB. You can create a pool with a size that is multiples of 4 TiB.   
      
      ![New capacity pool](../media/azure-netapp-files/azure-netapp-files-new-capacity-pool.png)

4. Click **OK**.

## Next steps 

1. [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
2. [Configure export policy for a volume (optional)](azure-netapp-files-configure-export-policy.md)

