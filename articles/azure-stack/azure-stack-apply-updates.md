---
title: Apply updates in Azure Stack | Microsoft Docs
description: Learn how to import and install Microsoft update packages for an Azure Stack integrated system.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 449ae53e-b951-401a-b2c9-17fee2f491f1
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: twooley

---

# Apply updates in Azure Stack

*Applies to: Azure Stack integrated systems*

As an Azure Stack operator, you can apply Microsoft updates packages for Azure Stack by using the Update tile in the administrator portal. You must download the Microsoft update package, import the package files to Azure Stack, and then install the update package. 

## Download the update package

When a Microsoft update package for Azure Stack is available, download the package to a location that's reachable from Azure Stack, and review the package contents. An update package typically consists of the following files:

- A self-extracting *PackageName*.exe file. This file contains the payload for the update, for example the latest cumulative update for Windows Server.   
- Corresponding *PackageName*.bin files. These files provide compression for the payload that's associated with the *PackageName*.exe file. 
- A Metadata.xml file. This file contains essential information about the update, for example the publisher, name, prerequisite, size, and support path URL.

## Import and install updates

The following procedures shows how to import and install update packages in the administrator portal.

1. In the administrator portal, select **More services**. Under the **Data + Storage** category, select **Storage accounts**. (Or, in the filter box, start typing **storage accounts**, and select it.)

    ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates1.png)

2. In the filter box, type **update**, and select the **updateadminaccount** storage account.

    ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates2.png)

3. In the storage account details, under **Services**, select **Blobs**.
 
    ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates3.png) 
 
4. Under **Blob service**, select **+ Container** to create a  container. Enter a name (for example *Update-1709*), and then select **OK**.
 
     ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates4.png)

5. After the container is created, click the container name, and then click **Upload** to upload the package files to the container.
 
    ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates5.png)

6. Under **Upload blob**, click the folder icon, browse to the update package's .exe file, and then click **Open** in the file explorer window.
  
7. Under **Upload blob**, click **Upload**. 
 
    ![Shows where to find storage accounts in the portal](media/azure-stack-apply-updates/ApplyUpdates6.png)

8. Repeat steps 6 and 7 for the *PackageName*.bin and Metadata.xml files. 
9. When done, you can review the notifications (bell icon in the top-right corner of the portal). The notifications should indicate that upload has completed. 
10. Navigate back to the **Update** tile on the dashboard to review the newly-added update package. The tile should indicate that an update is available.
11. To install the update, select the package marked as **Ready** and either right-click the package and select **Update now**, or click the **Update now** action near the top.
12. When you click the installing update package, you an view the status in the **Update run details** area. From here, you can also click **Download full logs** to download the log files.
13. When the update completes, the Update tile shows the updated Azure Stack version.
