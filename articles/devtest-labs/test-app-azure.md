---
title: Publish apps from Visual Studio to a lab VM
titleSuffix: Azure DevTest Labs
description: Learn how to publish an app from Visual Studio to an Azure file share for testing from a DevTest Labs virtual machine.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: engagement-fy23, UpdateFrequency2
---

# Publish app for testing on an Azure DevTest Labs VM

In this article, you learn how to publish an application for testing on an Azure DevTest Labs virtual machine (VM). As a developer, you may need to validate that your application build runs correctly on another operating system than your developer workstation. You might also distribute an application build for installation and testing by the test team. 

This article uses an app from Visual Studio as an example. Visual Studio enables you to deploy an application, service, or component to other computers, devices, servers, or in the cloud. To deploy an application to a lab VM in Azure DevTest Labs, you first [publish the application files to an Azure file share](#publish-your-app-from-visual-studio). You then [access the application on the file share from within the lab VM](#access-the-app-on-your-lab-vm).

:::image type="content" source="./media/test-app-in-azure/visual-studio-publish-app-to-lab-vm.png" alt-text="Diagram that shows how to publish an app from Visual Studio to an Azure file share, which is accessed from a lab VM." lightbox="./media/test-app-in-azure/visual-studio-publish-app-to-lab-vm.png":::

Learn more about the [deployment options in Visual Studio](/visualstudio/deployment/deploying-applications-services-and-components).

Instead of deploying the application directly from the developer workstation, you might [integrate the lab creation and application deployment into your CI/CD pipeline](./use-devtest-labs-build-release-pipelines.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A Windows-based [DevTest Labs VM](devtest-lab-add-vm.md) to use for testing the app.
- [Visual Studio](https://visualstudio.microsoft.com/free-developer-offers/) installed on a different workstation.

## Create an Azure file share

To access the application from your lab VM, you use an Azure file share to store the application files. You [publish the application with Visual Studio](#publish-your-app-from-visual-studio), and then [access the file share in the Lab VM](#access-the-app-on-your-lab-vm).

Azure DevTest Labs creates an Azure storage account when you create a lab. To create an Azure file share in this storage account:

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains your lab.
1. Follow these steps to [select the storage account linked to your lab](./encrypt-storage.md#view-storage-account-contents).
1. Follow these steps to [create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share).

## Publish your app from Visual Studio

In Visual Studio you can publish your application to other computers, or devices. Publish your application to the Azure file share you created previously.

To publish your app to your Azure file share from Visual Studio:

1. Open Visual Studio, and choose **Create a new project** in the **Start** window.

   :::image type="content" source="./media/test-app-in-azure/launch-visual-studio.png" alt-text="Screenshot of the Visual Studio Start page with Create a new project selected.":::

1. On the **Create a new project** screen, select **Console Application**, and then select **Next**.

   :::image type="content" source="./media/test-app-in-azure/select-console-application.png" alt-text="Screenshot of choosing Console Application.":::

1. On the **Configure your new project** page, keep the defaults and select **Next**.

1. On the **Additional information** page, keep the defaults and select **Create**.

1. In Visual Studio **Solution Explorer**, select and hold your project name, and select **Build**.

1. When the build succeeds, in **Solution Explorer**, select and hold your project name, and select **Publish**.

   :::image type="content" source="./media/test-app-in-azure/publish-application.png" alt-text="Screenshot of selecting Publish from Solution Explorer." lightbox="./media/test-app-in-azure/publish-application.png":::

1. On the **Publish** screen, select **Folder**, and then select **Next**.

   :::image type="content" source="./media/test-app-in-azure/publish-to-folder.png" alt-text="Screenshot of selecting Folder on the Publish screen.":::

1. For **Specific target**, select **Folder**, and then select **Next**.

1. For the **Location** option, select **Browse**, and then select the file share you mounted earlier.

   :::image type="content" source="./media/test-app-in-azure/selecting-file-share.png" alt-text="Screenshot of browsing and selecting the file share." lightbox="./media/test-app-in-azure/selecting-file-share.png":::

1. Select **OK**, and then select **Finish**.

1. Select **Publish**.

   :::image type="content" source="./media/test-app-in-azure/final-publish.png" alt-text="Screenshot of selecting Publish.":::

When the publish operation finishes, the application files are available on the Azure file share. You can now mount the file share from another computer, server, or lab VM, to access the application.

## Mount the file share to your lab VM

To access the application files in the Azure file share, you need to first mount the share to your lab VM.

Follow these steps to [mount the Azure file share to your lab VM](../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share).

## Access the app on your lab VM

When you connect to your lab VM, you can now access the application files from the mounted file share.

1. [Connect to your lab test VM by using RDP](./connect-windows-virtual-machine.md).

1. On the lab VM, start **File Explorer**, select **This PC**, and find the file share you mounted earlier.

   :::image type="content" source="./media/test-app-in-azure/find-share-on-vm.png" alt-text="Screenshot of the file share in the VM's File Explorer." lightbox="./media/test-app-in-azure/find-share-on-vm.png":::

1. Open the file share, and confirm that you see the app you deployed from Visual Studio.

   :::image type="content" source="./media/test-app-in-azure/open-file-share.png" alt-text="Screenshot of contents of file share." lightbox="./media/test-app-in-azure/open-file-share.png":::

You can now run and test your app on your lab VM.

## Next steps

You've published an application directly from Visual Studio on your developer workstation into your lab VM.

- Learn how you can [integrate the lab creation and application deployment into your CI/CD pipeline](./use-devtest-labs-build-release-pipelines.md).
- Learn more about [deploying an application to a folder with Visual Studio](/visualstudio/deployment/deploying-applications-services-and-components-resources#folder).