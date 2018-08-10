---
title: include file
description: include file
services: iot-edge
author: kgremban
ms.service: iot-edge
ms.topic: include
ms.date: 06/26/2018
ms.author: kgremban
ms.custom: include file
---


If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them.

Otherwise, you can delete the local configurations and the Azure resources that you created in this article to avoid charges. 

> [!IMPORTANT]
> Deleting Azure resources and resource groups is irreversible. When these items are deleted, the resource group and all of the resources that are contained in it are permanently deleted. Make sure that you don't accidentally delete the wrong resource group or resources. If you created the IoT hub inside an existing resource group that has resources that you want to keep, delete only the IoT hub resource itself, instead of deleting the resource group.
>

To delete only the IoT hub, execute the following command. Replace \<YourIoTHub> with your IoT hub name and \<TestResources> with your resource group name:

```azurecli-interactive
az iot hub delete --name <YourIoTHub> --resource-group <TestResources>
```


To delete the entire resource group by name:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.

2. In the **Filter by name** textbox, enter the name of the resource group that contains your IoT hub. 

3. To the right of your resource group in the result list, select the ellipsis (**...**), and then select **Delete resource group**.

    ![Delete resource group](./media/iot-edge-quickstarts-clean-up-resources/iot-edge-delete-resource-group.png)

4. You're asked to confirm the deletion of the resource group. Reenter the name of your resource group to confirm and select **Delete**. After a few moments, the resource group and all of its contained resources are deleted.






