---
title: 'Tutorial: Delete network functions on Azure Stack Edge'
titleSuffix: Azure Network Function Manager
description: In this tutorial, learn how to delete a network function as a managed application.
author: sushantjrao
ms.service: network-function-manager
ms.topic: tutorial
ms.date: 05/10/2022
ms.author: sushrao
ms.custom: 
---
# Tutorial: Delete network functions on Azure Stack Edge

In this tutorial, you learn how to delete a network function and a device in Azure Network Function Manager by using the Azure portal. 


## Delete a network function

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the **Azure Network Manager - Devices** resource in which you've deployed a network function. Under **Network Function**, select the function that you want to delete.
 
   ![Screenshot that shows how to select a network function.](media/delete-functions/select-network-function.png)

1. Select **Delete**.
 
   ![Screenshot that shows how to delete a network function.](media/delete-functions/delete-network-function.png)

1. You might encounter a "Failed to delete resource" error while you're deleting the network function.

   ![Screenshot that shows an error for failure to delete a resource.](media/delete-functions/failed-to-delete.png)
   
   If so, use the search box in the Azure portal to search for the managed application that the error mentioned. When the managed application appears under **Resources**, select it.
 
   ![Screenshot that shows searching for a managed application.](media/delete-functions/managed-application.png)

   In the details for the managed application, select **Delete**.
 
   ![Screenshot that shows the button for deleting a managed application.](media/delete-functions/delete-managed-application.png)

## Delete a device

> [!IMPORTANT] 
> Ensure that all the network functions deployed within Azure Network Function Manager are deleted before you delete a device.

Go to the **Azure Network Manager - Devices** resource in which you've deleted a network function, and then select **Delete**.
 
![Screenshot that shows the button for deleting a device.](media/delete-functions/delete-network-function-manager.png)
