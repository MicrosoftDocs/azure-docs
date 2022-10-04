---
title: 'Tutorial: Delete network functions on Azure Stack Edge'
titleSuffix: Azure Network Function Manager
description: In this tutorial, learn how to delete a network function as a managed application.
author: sushantjrao
ms.service: network-function-manager
ms.topic: tutorial
ms.date: 07/09/2022
ms.author: sushrao
ms.custom: 
---
# Tutorial: Delete network functions on Azure Stack Edge

In this tutorial, you learn how to delete Azure Network Function Manager - Network Function and Azure Network Function Manager - Device using the Azure portal. 

* [Delete Azure Network Function Manager - Network Function](#Delete-network-function)
* [Delete Azure Network Function Manager - Device](#Delete-network-function-manager---device)

### Delete network function

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Azure Network Manager - Devices** resource in which you have deployed a network function and select **Network Function**.
 ![select-network-function](media/delete-functions/select-network-function.png)

1. Select **Delete** Network Function.
 ![delete-network-function](media/delete-functions/delete-network-function.png)

   > [!NOTE]
   > Incase you encounter following error while deleting the network function.
   > *Failed to delete resource. Error: The client 'user@mail.com' with object id 'xxxx-9999-xxxx-9999-xxxx' has permission to perform action 'Microsoft.HybridNetwork/networkFunctions/delete' on scope 'mrg-ResourceGroup/providers/Microsoft.HybridNetwork/networkFunctions/NetworkFunction01'; however, the access is denied because of the deny assignment with name 'System deny assignment created by managed application /subscriptions/xxxx-0000-xxxx-0000-xxxx/resourceGroups/ResourceGroup/providers/Microsoft.Solutions/applications/managedApplication01' and Id 'xxxxxxxxxxxxxxxxxxxxxx' at scope '/subscriptions/xxxx-0000-xxxx-0000-xxxx/resourceGroups/mrg-ResourceGroup and refer **Step 4**.*
   > ![failed-to-delete](media/delete-functions/failed-to-delete.png)
   
1. Navigate to search box within the **Azure portal** and search for the **Managed Application** which was seen as an exception in **Step 3**.
 ![managed-application](media/delete-functions/managed-application.png)

1. Select **Delete** Managed Application
 ![delete-managed-application](media/delete-functions/delete-managed-application.png)

### Delete network function manager - device

   > [!IMPORTANT] 
   > Ensure that all the Network Function deployed within the Azure Network Function Manager is deleted before proceeding to the next step.
   >

1. Navigate to the **Azure Network Manager - Devices** resource in which you have deleted a network function and select **Delete** Azure Network Function Manager - Device
 ![delete-network-function-manager](media/delete-functions/delete-network-function-manager.png)
