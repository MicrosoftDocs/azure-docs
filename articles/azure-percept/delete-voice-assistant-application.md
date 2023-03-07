---
title: Delete your Azure Percept Audio voice assistant application
description: This article shows you how to delete a previously created voice assistant application.
author: yvonne-dq
ms.author: nbabar
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---

# Delete your Azure Percept Audio voice assistant application

[!INCLUDE [Retirement note](./includes/retire.md)]

These instructions will show you how to delete a voice assistant application from your Azure Percept Audio device.

## Prerequisites

- [A previously created voice assistant application](./tutorial-no-code-speech.md)
- Your Azure Percept DK is powered on and the Azure Percept Audio accessory is connected via a USB cable.

## Remove all voice assistant resources from the Azure portal

Once you're done working with your voice assistant application, follow these steps to clean up the speech resources you deployed when creating the application.

1. From the [Azure portal](https://portal.azure.com), select **Resource groups** from the left menu panel or type it into the search bar.

    :::image type="content" source="./media/tutorial-no-code-speech/azure-portal.png" alt-text="Screenshot of Azure portal homepage showing left menu panel and Resource Groups.":::

1. Select your resource group.

1. Select all six resources that contain your application prefix and select the **Delete** icon on the top menu panel.

    :::image type="content" source="./media/tutorial-no-code-speech/select-resources.png" alt-text="Screenshot of speech resources selected for deletion.":::

1. To confirm deletion, type **yes** in the confirmation box, verify you've selected the correct resources, and select **Delete**.

    :::image type="content" source="./media/tutorial-no-code-speech/delete-confirmation.png" alt-text="Screenshot of delete confirmation window.":::

> [!WARNING]
> This will remove any custom keywords created with the speech resources you are deleting, and the voice assistant demo will no longer function.


## Next steps
Now that you've removed your voice assistant application, try creating other applications on your Azure Percept DK by following these tutorials.
- [Create a no-code vision solution](./tutorial-nocode-vision.md)
- [Create a no-code voice assistant application](./tutorial-no-code-speech.md)


