---
title: Create and customize your dev box with Dev Home
titleSuffix: Microsoft Dev Box
description: Learn how to create and customize your dev box by using Dev Home. Manage and interact with virtual machines, including Dev Box.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 06/05/2024
#customer intent: As a developer, I want to use the Dev Home app to create customizations for my dev boxes, so that I can manage my customizations.
---

# Create reusable dev box customizations with Dev Home Preview

In this article, you learn how to use Dev Home Preview to create, customize, and connect to your dev box. Dev Home is a Windows application that helps you manage and interact with your dev boxes. 

> [!IMPORTANT]
> Microsoft Dev Home is currently in PREVIEW.
> This information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, expressed or implied, with respect to the information provided here.

## Prerequisites

To complete the steps in this article, you must:
- Have a [dev center configured with a dev box definition, dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) configured so that you can create a dev box. 
- Be a member of Dev Box Users for at least one project.

## Install or update Dev Home

Dev Home is available in the Microsoft Store. To install or update Dev Home, go to the Dev Home (Preview) page in the [Microsoft Store](https://aka.ms/devhome) and select **Get** or **Update**.

You might also see Dev Home in the Start menu. If you see it there, you can select it to open the app.

## Add extensions

Dev Home uses extensions to provide more functionality. To support the Dev Box features, you need to install the Dev Home Azure Extension.

To add an extension:

1. Open Dev Home.
1. From the left menu, select **Extensions**, then in the list of extensions **Available in the Microsoft Store**, on the **Dev Home Azure Extension (Preview)**, select **Get**.

## Enable experimental features

To use the Dev Box features in Dev Home Preview, you need to enable the experimental features in Dev Home.

1. Open Dev Home.
1. Select **Settings**.
1. Select **Experimental features**.
1. In the **Experimental features** section, turn on the following features:
    - **Environments Creation**
    - **Environments Management**
    - **Environments Configuration**


## Create a dev box

Dev Home provides a guided way for you to create a new dev box. 

> [!NOTE] 
> Dev Home uses the term *Environments* to refer to all local and cloud virtual machines.  

To create a new dev box:

1. Open **Dev Home**.
1. From the left menu, select **Environments**, and then select **Create Environment**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-create-environment.png" alt-text="Screenshot of Dev Home, showing the Environments page with Create Environment highlighted." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-create-environment.png":::
  
1. On the **Select environment** page, select **Microsoft DevBox**, and then select **Next**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-create-dev-box.png" alt-text="Screenshot of Dev Home, showing the Select environment page with Microsoft Dev Box highlighted." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-create-dev-box.png":::

1. On the **Configure your environment** page:
    - Enter a name for your dev box.
    - Select the **Project** you want to create the dev box in.
    - Select the **DevBox Pool** where you want to create the dev box. Select a pool located close to you to reduce latency.
    - Select **Next**.

      :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-configure-environment.png" alt-text="Screenshot showing the Configure your environment page." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-configure-environment.png":::

1. On the **Review your environment** page, review the details and select **Create environment**.
1. Select **Go to Environments** to see the status of your dev box.

## Connect to your dev box

Dev Home provides a seamless way for you to use the Windows App to connect to your Dev Box from any device of your choice. You can customize the look and feel of the Windows App to suit the way you work, and switch between multiple services across accounts. 

If the Windows App isn't installed, selecting Launch takes you to the web client to launch the Dev Box. Dev Home provides a way to launch your dev box straight from the app.

### Install the Windows App

1. Go to the Microsoft store and search for *Windows App* or use this [download link:](https://apps.microsoft.com/detail/9n1f85v9t8bn?hl=en-US&gl=US).
1. Download the app and install it.

### Launch your dev box 
 
1. Open **Dev Home**.
1. From the left menu, select **Environments**.
1. Select the dev box you want to launch.
1. Select **Launch**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-launch.png" alt-text="Screenshot showing a dev box with the Launch menu highlighted.":::

1. You can also start and stop the dev box from the **Launch** menu.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-start-stop.png" alt-text="Screenshot of the Launch menu with Start and Stop options." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-start-stop.png":::

For more information on the Windows App, see [Windows App](https://aka.ms/windowsapp).

### Access your dev box from the start menu or task bar

Dev home enables you to pin your dev box to the start menu or task bar.

1. Open **Dev Home**.
1. From the left menu, select **Environments**.
1. Select the dev box you want to pin or unpin.
1. Select **Pin to start** or **Pin to taskbar**.
   
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-menu.png" alt-text="Screenshot showing a dev box with the Pin to start and Pin to taskbar options highlighted." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-menu.png":::

## Customize an existing dev box

Dev home gives you the opportunity to clone repositories and add software to your existing dev box. Dev home uses the Winget catalog to provide a list of software that you can install on your dev box.

1. Open **Dev Home**.
1. From the left menu, select **Machine configuration**, and then select **Set up an environment**.
1. Select the environment you want to customize, and then select **Next**.
1. On the **Set up an environment** page, if you want to clone a repository to your dev box, select **Add repository**. 
1. In the **Add repository** dialog, enter the source and destination paths for the repository you want to clone, and then select **Add**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-clone-repository.png" alt-text="Screenshot showing the Add repository dialog box." lightbox="media/how-to-use-dev-home-customize-dev-box/dev-home-clone-repository.png":::

1. When you finish adding repositories, select **Next**.
1. From the list of application Winget provides, choose the software you want to install on your dev box, and then select **Next**. You can also search for software by name.

    :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-software-install.png" alt-text="Screenshot showing the Add software page.":::

1. On the **Review and finish** page, under **See details**:
    1. Select the **Environment** tab to see the virtual machine you're configuring.
    1. Select the **Applications** tab to see a list of the software you're installing.
    1. Select the **Repositories** tab to see the list of public GitHub repositories you're cloning
1. Select **I agree and want to continue**, and then select **Set up**.

You can also generate a configuration file based on your selected repositories and software to use in the future to create dev boxes with the same customizations.

## Related content

- [Create reusable dev box customizations](how-to-customize-dev-box-setup-tasks.md)
- [What is Dev Home?](/windows/dev-home/)
