---
title: How to test your app in Azure
description: Learn how to deploy desktop/web applications to a file share and test them.  
ms.topic: how-to
ms.date: 11/03/2021
---

# Test your app in Azure 

In this guide, you'll learn how to test your application in Azure using DevTest Labs. You use Visual Studio to deploy your app to an Azure file share. Then you'll access the share from a lab virtual machine (VM).  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A local workstation with [Visual Studio](https://visualstudio.microsoft.com/free-developer-offers/).

- A lab in [DevTest Labs](devtest-lab-overview.md).

- An [Azure virtual machine](devtest-lab-add-vm.md) running Windows in your lab.

- A [file share](../storage/files/storage-how-to-create-file-share.md) in your lab's existing Azure storage account. A storage account is automatically created with a lab.

- The [Azure file share mounted](../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share) to your local workstation and lab VM.

## Publish your app from Visual Studio

In this section, you publish your app from Visual Studio to your Azure file share.

1. Open Visual Studio, and choose **Create a new project** in the Start window.

    :::image type="content" source="./media/test-app-in-azure/launch-visual-studio.png" alt-text="Screenshot of visual studio start page.":::

1. Select **Console Application** and then **Next**.

    :::image type="content" source="./media/test-app-in-azure/select-console-application.png" alt-text="Screenshot of option to choose console application.":::

1. On the **Configure your new project** page, leave the defaults, and select **Next**.

1. On the **Additional information** page, leave the defaults and select **Create**.

1. From **Solution Explorer**, right-click your project and select **Build**.

1. From **Solution Explorer**, right-click your project and select **Publish**.

    :::image type="content" source="./media/test-app-in-azure/publish-application.png" alt-text="Screenshot of option to publish application.":::

1. On the **Publish** page, select **Folder** and then **Next**.

    :::image type="content" source="./media/test-app-in-azure/publish-to-folder.png" alt-text="Screenshot of option to publish to folder.":::

1. For the **Specific target** option, select **Folder** and then **Next**.

1. For the **Location** option, select **Browse**, and select the file share you mounted earlier. Then Select **OK**, and then **Finish**. 

    :::image type="content" source="./media/test-app-in-azure/selecting-file-share.png" alt-text="Screenshot of option to select file share.":::

1. Select **Publish**. Visual Studio builds your application and publishes it to your file share.

    :::image type="content" source="./media/test-app-in-azure/final-publish.png" alt-text="Screenshot of publish button.":::

## Test the app on your test VM in the lab

1. Connect to your lab virtual machine.

1. Within the virtual machine, launch **File Explorer**, and select **This PC** to find the file share you mounted earlier.

    :::image type="content" source="./media/test-app-in-azure/find-share-on-vm.png" alt-text="Screenshot of file explorer.":::

1. Open the file share and confirm that you see the app you deployed from Visual Studio. 

    :::image type="content" source="./media/test-app-in-azure/open-file-share.png" alt-text="Screenshot of contents of file share.":::

    You can now access and test your app within the test VM you created in Azure.

## Next steps

See the following articles to learn how to use VMs in a lab. 

- [Add a VM to a lab](devtest-lab-add-vm.md)
- [Restart a lab VM](devtest-lab-restart-vm.md)
- [Resize a lab VM](devtest-lab-resize-vm.md)
