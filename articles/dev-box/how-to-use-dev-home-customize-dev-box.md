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
ms.date: 07/30/2024
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

You might see Dev Home in the Start menu. If you see it there, you can select it to open the app.

Dev Home is available in the Microsoft Store. To install or update Dev Home, go to the Dev Home (Preview) page in the [Microsoft Store](https://aka.ms/devhome) and select **Get** or **Update**.

## Sign in to Dev Home

Dev Home allows you to work with many different services, like Microsoft Hyper-V, Windows Subsystem for Linux (WSL), and Microsoft Dev Box. To access your chosen service, you must sign in to your Microsoft account, or your Work or School account.

To sign in:

1. Open Dev Home.
1. From the left menu, select **Settings**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-settings.png" alt-text="Screenshot of Dev Home, showing the home page with Settings highlighted.":::

1. Select **Accounts**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-accounts.png" alt-text="Screenshot of Dev Home, showing the Settings page with Accounts highlighted.":::

1. Select **Add account** and follow the prompts to sign in.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-sign-in.png" alt-text="Screenshot of Dev Home, showing the Accounts page with Add account highlighted.":::

## Add extensions

Dev Home uses extensions to provide more functionality. To support the Dev Box features, you need to install the Dev Home Azure Extension.

To add an extension:

1. In Dev Home, from the left menu, select **Extensions**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-extensions.png" alt-text="Screenshot of Dev Home, showing the Extensions page."::: 
 
1. In the list of extensions **Available in the Microsoft Store**, on the **Dev Home Azure Extension (Preview)**, select **Get**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-get-extension.png" alt-text="Screenshot of Dev Home, showing the Extensions page with the Dev Home Azure Extension highlighted.":::

1. In the Microsoft Store dialog, select **Get** to install the extension.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-get-extension-store.png" alt-text="Screenshot of the Microsoft Store dialog with the Get button highlighted.":::

## Create a dev box

Dev Home provides a guided way for you to create a new dev box. 

> [!NOTE] 
> Dev Home uses the term *Environments* to refer to all local and cloud virtual machines.  

To create a new dev box:

1. In **Dev Home**, from the left menu, select **Environments**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-environments.png" alt-text="Screenshot of Dev Home, showing the Environments page.":::

1. Select **Create Environment**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-create-environment.png" alt-text="Screenshot of Dev Home, showing the Environments page with Create Environment highlighted.":::
  
1. On the **Select environment** page, select **Microsoft DevBox**, and then select **Next**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-create-dev-box.png" alt-text="Screenshot of Dev Home, showing the Select environment page with Microsoft Dev Box highlighted.":::

1. On the **Configure your environment** page:
    - Enter a name for your dev box.
    - Select the **Project** you want to create the dev box in.
    - Select the **DevBox Pool** where you want to create the dev box. Select a pool located close to you to reduce latency.
    - Select **Next**.

      :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-configure-environment.png" alt-text="Screenshot showing the Configure your environment page.":::

1. On the **Review your environment** page, review the details and select **Create environment**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-review-environment.png" alt-text="Screenshot showing the Review your environment page."::: 
 
1. Select **Go to Environments** to see the status of your dev box.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-go-to-environments.png" alt-text="Screenshot showing the Go to Environments button.":::

[!INCLUDE [note-dev-box-runs-on-creation](includes/note-dev-box-runs-on-creation.md)]

## Connect to your dev box

Dev Home provides a seamless way for you to use the Windows App to connect to your Dev Box from any device of your choice. You can customize the look and feel of the Windows App to suit the way you work, and switch between multiple services across accounts. 

If the Windows App isn't installed, selecting Launch takes you to the web client to launch the Dev Box. Dev Home provides a way to launch your dev box straight from the app.

### Install the Windows App

1. Go to the Microsoft store and search for *Windows App* or use this [download link:](https://apps.microsoft.com/detail/9n1f85v9t8bn?hl=en-US&gl=US).
1. Download the app and install it.

### Launch your dev box 
 
1. In **Dev Home**, from the left menu, select **Environments**.
1. For the dev box you want to launch, select **Launch**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-launch.png" alt-text="Screenshot showing a dev box with the Launch menu highlighted.":::

1. You can also start and stop the dev box from the **Launch** menu.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-start-stop.png" alt-text="Screenshot of the Launch menu with Start and Stop options.":::

For more information on the Windows App, see [Windows App](https://aka.ms/windowsapp).

### Manage your dev box

Dev home enables you to pin your dev box to the start menu or task bar, and to delete your dev box.

1. Open **Dev Home**.
1. From the left menu, select **Environments**.
1. Select the dev box you want to manage.
1. Select **Pin to start**, **Pin to taskbar**, or **Delete**.
   
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-options-menu.png" alt-text="Screenshot showing a dev box with the Pin to start, Pin to taskbar, and Delete options highlighted.":::

## Customize an existing dev box

Dev home gives you the opportunity to clone repositories and add software to your existing dev box. Dev home uses the Winget catalog to provide a list of software that you can install on your dev box.

1. Open **Dev Home**.
1. From the left menu, select **Machine configuration**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-machine-configuration.png" alt-text="Screenshot showing Dev Home with Machine configuration highlighted.":::

1. Select **Set up an environment**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-set-up-environment.png" alt-text="Screenshot showing the Machine configuration page with Set up environment highlighted."::: 

1. Select the environment you want to customize, and then select **Next**.
 
   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-select-environment.png" alt-text="Screenshot showing the Select environment page."::: 
 
1. On the **Set up an environment** page, if you want to clone a repository to your dev box, select **Add repository**. 

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-add-repository.png" alt-text="Screenshot showing the Add repository button.":::

1. In the **Add repository** dialog, enter the source and destination paths for the repository you want to clone, and then select **Add**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-clone-repository.png" alt-text="Screenshot showing the Add repository dialog box.":::

1. When you finish adding repositories, select **Next**.

   :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-repository-next.png" alt-text="Screenshot showing the repositories to add, with the Next button highlighted dialog box.":::  

1. Next, you can choose software to install. From the list of applications Winget provides, choose the software you want to install on your dev box. You can also search for software by name.

    :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-software-select.png" alt-text="Screenshot showing the Add software page with Visual Studio Community and PowerShell highlighted.":::

1. When you finish selecting software, select **Next**. 

    :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-software-install.png" alt-text="Screenshot showing the Add software page with Next highlighted.":::

1. On the **Review and finish** page, under **See details**:
    1. Select the **Environment** tab to see the virtual machine you're configuring.
    1. Select the **Applications** tab to see a list of the software you're installing.
    1. Select the **Repositories** tab to see the list of public GitHub repositories you're cloning.
1. Select **I agree and want to continue**, and then select **Set up**.
 
      :::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-review-finish.png" alt-text="Screenshot showing the Review and finish page with the I agree and want to continue button highlighted.":::
 

Notice that you can also generate a configuration file based on your selected repositories and software to use in the future to create dev boxes with the same customizations.

:::image type="content" source="media/how-to-use-dev-home-customize-dev-box/dev-home-configuration-file.png" alt-text="Screenshot showing the Review and finish page with the Generate configuration file button highlighted.":::



## Related content

- [Create reusable dev box customizations](how-to-customize-dev-box-setup-tasks.md)
- [What is Dev Home?](/windows/dev-home/)
