---
title: Set up an app for testing on a lab VM
description: Learn how to publish an app to an Azure file share for testing from a DevTest Labs virtual machine.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/29/2022
---

# Set up an app for testing on an Azure DevTest Labs VM

This article shows how to set up an application for testing from an Azure DevTest Labs virtual machine (VM). In this example, you use Visual Studio to publish an app to an Azure file share. Then you access the file share from a lab VM for testing.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Windows-based [DevTest Labs VM](devtest-lab-add-vm.md) to use for testing the app.
- [Visual Studio](https://visualstudio.microsoft.com/free-developer-offers/) installed on a different workstation.
- A [file share](../storage/files/storage-how-to-create-file-share.md) created in your lab's [Azure Storage Account](encrypt-storage.md).
- The [file share mounted](../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share) to your Visual Studio workstation, and to the lab VM you want to use for testing.

## Publish your app from Visual Studio

First, publish an app from Visual Studio to your Azure file share.

1. Open Visual Studio, and choose **Create a new project** in the **Start** window.

   :::image type="content" source="./media/test-app-in-azure/launch-visual-studio.png" alt-text="Screenshot of the Visual Studio Start page with Create a new project selected.":::

1. On the **Create a new project** screen, select **Console Application**, and then select **Next**.

   :::image type="content" source="./media/test-app-in-azure/select-console-application.png" alt-text="Screenshot of choosing Console Application.":::

1. On the **Configure your new project** page, keep the defaults and select **Next**.

1. On the **Additional information** page, keep the defaults and select **Create**.

1. In Visual Studio **Solution Explorer**, right-click your project name, and select **Build**.

1. When the build succeeds, in **Solution Explorer**, right-click your project name, and select **Publish**.

   :::image type="content" source="./media/test-app-in-azure/publish-application.png" alt-text="Screenshot of selecting Publish from Solution Explorer.":::

1. On the **Publish** screen, select **Folder**, and then select **Next**.

   :::image type="content" source="./media/test-app-in-azure/publish-to-folder.png" alt-text="Screenshot of selecting Folder on the Publish screen.":::

1. For **Specific target**, select **Folder**, and then select **Next**.

1. For the **Location** option, select **Browse**, and then select the file share you mounted earlier.

   :::image type="content" source="./media/test-app-in-azure/selecting-file-share.png" alt-text="Screenshot of browsing and selecting the file share.":::

1.  Select **OK**, and then select **Finish**.

1. Select **Publish**.

   :::image type="content" source="./media/test-app-in-azure/final-publish.png" alt-text="Screenshot of selecting Publish.":::

Visual Studio publishes your application to the file share.

## Access the app on your lab VM

1. Connect to your lab test VM.

1. On the lab VM, start up **File Explorer**, select **This PC**, and find the file share you mounted earlier.

   :::image type="content" source="./media/test-app-in-azure/find-share-on-vm.png" alt-text="Screenshot of the file share in the V M's File Explorer.":::

1. Open the file share, and confirm that you see the app you deployed from Visual Studio.

   :::image type="content" source="./media/test-app-in-azure/open-file-share.png" alt-text="Screenshot of contents of file share.":::

You can now test your app on your lab VM.

## Next steps

See the following articles to learn how to use VMs in a lab. 

- [Add a VM to a lab](devtest-lab-add-vm.md)
- [Restart a lab VM](devtest-lab-restart-vm.md)
- [Resize a lab VM](devtest-lab-resize-vm.md)