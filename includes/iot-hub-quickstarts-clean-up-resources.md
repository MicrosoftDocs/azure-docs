---
title: include file
description: include file
services: iot-hub
author: SoniaLopezBravo
ms.service: azure-iot-hub
ms.topic: include
ms.date: 03/28/2025
ms.author: sonialopez
ms.custom: include file
---


If you're continuing to the next recommended article, you can keep the resources you already created and reuse them.

Otherwise, you can delete the Azure resources created in this article to avoid charges. 

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you don't accidentally delete the wrong resource group or resources. If you created the IoT hub inside an existing resource group that contains resources you want to keep, only delete the IoT Hub resource itself instead of deleting the resource group.
>

To delete a resource group by name:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

2. In the **Filter for any field** textbox, type the name of the resource group containing your IoT hub.

3. In the result list, select the resource group containing your IoT hub. 

4. In the working pane for the resource group, select **Delete resource group** from the command bar.

    :::image type="content" source="./media/iot-hub-quickstarts-clean-up-resources/iot-hub-delete-resource-group.png" alt-text="Screenshot that shows the working pane of a resource group in Azure portal, with the Delete resource group command highlighted in the command bar.":::
    
5. You're asked to confirm the deletion of the resource group. Type the name of your resource group again to confirm, and then select **Delete**. After a few moments, the resource group and all of its contained resources are deleted.