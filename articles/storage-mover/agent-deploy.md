---
title: How to deploy an Azure Storage Mover agent #Required; page title is displayed in search results. Include the brand.
description: Learn how to deploy an Azure Mover agent #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 07/27/2022
ms.custom: template-how-to
---

<!--

This template provides the basic structure of a HOW-TO article. A HOW-TO article is used to help the customer complete a specific task.

1. H1 (Docs Required)
   Start your H1 with a verb. Pick an H1 that clearly conveys the task the user will complete (example below).

-->

# Deploy an Azure Storage Mover agent

<!-- 

2. Introductory paragraph (Docs Required)
   Lead with a light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it short (example provided below).

-->

Waffles rank highly on many Americans' list of favorite breakfast foods. Waffles are usually moist, occasionally slightly sweet, and most importantly, warm.

However, Oma only made waffles as a cake-like dessert in her heart-shaped waffle iron. Her waffles were great fresh, but also delicious when dried out and dunked in coffee. Our Tante Elise would whip these up when unexpected guests dropped by for Kaffee und Kuchen in the afternoon. Her callers could devour the first batch while the remainder baked in the waffle iron because they were both quicker and easier than Butterkuchen or Bienenstich.

This article guides you through the construction of Oma's waffles. After completing this how-to, you'll be able to experiment on your own to gain additional experience. You may also choose to continue providing simple waffles to friends and family.

<!-- 
3. Prerequisites (Optional)
   If you need prerequisites, make them your first H2 in a how-to guide. Use clear and unambiguous language and use a list format. Remove this section if prerequisites are not needed.

-->

## Prerequisites

- An Azure account. If you don't yet have an account, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Azure subscription enabled for the Storage Mover preview.
- An Azure resource group in which to deploy the agent
- A storage mover object with which to perform the migration

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Download agent VM

You'll need to download the agent's VHD and attach it to a new VM to facilitate the migration of your files.

You can access the VHD file from [\\xstoreself.corp.microsoft.com\scratch\XDataMove\Public Preview](\\xstoreself.corp.microsoft.com\scratch\XDataMove\Public Preview).

## Create the agent

Providing sufficient resources like RAM and compute cores to your agent is important.

1. Unpack the agent VHD to a local folder.
  :::image type="content" source="media/agent-deploy/agent-disk-extract-sml.png" alt-text="Image of a compressed file being extracted to the local file system." lightbox="media/agent-deploy/agent-disk-extract-lrg.png":::
1. Create a new VM to host the agent. Open **Hyper-V Manager**. In the **Actions** pane, select **New** and **Virtual Machine...** to launch the **New Virtual Machine Wizard**.
  :::image type="content" source="media/agent-deploy/agent-vm-create-sml.png" alt-text="Image showing how to launch the New Virtual Machine Wizard from within the Hyper-V Manager." lightbox="media/agent-deploy/agent-vm-create-lrg.png":::
1. Within the **Specify Name and Location** pane, specify values for the agent VM's **Name** and **Location** fields. The location should match the folder where the VHD is stored, if possible. Select **Next**.
  :::image type="content" source="media/agent-deploy/agent-name-select-sml.png" alt-text="Image showing the location of the Name and Location fields within the New Virtual Machine Wizard." lightbox="media/agent-deploy/agent-name-select-lrg.png":::
1. Within the **Specify Generation** pane, select the **Generation 1** option. Only **Generation 1** VM generation is supported during the Azure Storage Mover public preview.
  :::image type="content" source="media/agent-deploy/agent-vm-generation-select-sml.png" lightbox="media/agent-deploy/agent-vm-generation-select-lrg.png"  alt-text="Image showing the location of the VM Generation options within the New Virtual Machine Wizard.":::
1. Within the **Assign Memory** pane, enter the amount of memory you will allocate to the agent VM. 3072 MB dynamic RAM is being provided in our example. For information on allocation recommendations, see the article on [Performance Targets](performance-targets.md).
  :::image type="content" source="media/agent-deploy/agent-memory-allocate-sml.png" lightbox="media/agent-deploy/agent-memory-allocate-lrg.png"  alt-text="Image showing the location of the Startup Memory field within the New Virtual Machine Wizard.":::
1. Within the **Configure Networking** pane, select the **Connection** drop-down and choose the virtual switch which will provide the agent with internet connectivity. Select **Next**.
  :::image type="content" source="media/agent-deploy/agent-networking-configure-sml.png" lightbox="media/agent-deploy/agent-networking-configure-lrg.png"  alt-text="Image showing the location of the network Connection field within the New Virtual Machine Wizard.":::
1. Within the **Connect Virtual Hard Disk** pane, select the **Use an existing Virtual Hard Disk** option. In the **Location** field, select **Browse** and navigate to the VHD file that was extracted in the previous steps. Select **Next**.
  :::image type="content" source="media/agent-deploy/agent-disk-connect-sml.png" lightbox="media/agent-deploy/agent-disk-connect-lrg.png"  alt-text="Image showing the location of the Virtual Hard Disk Connection fields within the New Virtual Machine Wizard.":::
1. Within the **Summary** pane, select **Finish** to create the agent VM.
  :::image type="content" source="media/agent-deploy/agent-configuration-details-sml.png"  lightbox="media/agent-deploy/agent-configuration-details-lrg.png" alt-text="Image showing the user-assigned values in the Summary pane of the New Virtual Machine Wizard.":::
1. After the new agent is successfully created, it will appear in the **Virtual Machines** pane within the **Hyper-V Manager**.
     :::image type="content" source="media/agent-deploy/agent-created-sml.png" lightbox="media/agent-deploy/agent-created-lrg.png" alt-text="Image showing the agent VM deployed within the New Virtual Machine Wizard.":::

## Register the agent

Once your agent VM is running, you'll need to create trust to use it for migrations.

# [Hyper-V](#tab/hyper-v)

1. Open **Hyper-V Manager**. In the **Virtual Machines** pane and select your agent. Start your agent by select **Start** within the **Actions** pane.
  :::image type="content" source="media/agent-deploy/agent-vm-start-sml.png" lightbox="media/agent-deploy/agent-vm-start-lrg.png"  alt-text="Image illustrating the steps involved with starting a VM within Hyper-V Manager.":::
1. After starting, the agent VM's **State**, **CPU Usage**, and other metrics are displayed in the **Virtual Machines** pane. Additionally, a checkpoint is automatically created. Connect to the agent VM by selecting **Connect...** from the agent's section within the **Actions** pane as shown.
  :::image type="content" source="media/agent-deploy/agent-vm-connect-sml.png" lightbox="media/agent-deploy/agent-vm-connect-lrg.png"  alt-text="Image illustrating the location of the Connect icon within Hyper-V Manager.":::
1. In the **Virtual Machine Connection** window, login to the agent VM using the default credentials. At the **login** prompt, enter **admin** and press the **Enter** key. Enter **admin** again at the **Password** prompt and press the **Enter** key. Enter **n** when prompted to change the default password and press the **Enter** key.
  :::image type="content" source="media/agent-deploy/agent-vm-login-sml.png" lightbox="media/agent-deploy/agent-vm-login-lrg.png" alt-text="Image illustrating the authentication prompts for the agent VM using Hyper-V Manager.":::
1. Enter **4** at the prompt to begin registering your agent. When prompted to choose the type of registration, enter **2** to use an interactive session.
  :::image type="content" source="media/agent-deploy/register-interactive-sml.png" lightbox="media/agent-deploy/register-interactive-sml.png" alt-text="7":::
1. Open a web browser and navigate to [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) to access the authentication page. Enter the authentication code provided by the agent in the **Enter Code** field.
  :::image type="content" source="media/agent-deploy/register-interactive-code-sml.png" lightbox="media/agent-deploy/register-interactive-code-lrg.png" alt-text="4":::
1. On the **Sign in** page, enter your account email, phone, or Skype account when prompted.
  :::image type="content" source="media/agent-deploy/register-interactive-signin-sml.png" lightbox="media/agent-deploy/register-interactive-signin-lrg.png" alt-text="3":::
1. Approve sign in.
  :::image type="content" source="media/agent-deploy/register-interactive-approve-sml.png" lightbox="media/agent-deploy/register-interactive-approve-lrg.png"  alt-text="2":::

1. Confirm
  :::image type="content" source="media/agent-deploy/register-interactive-confirm-sml.png" lightbox="media/agent-deploy/register-interactive-confirm-lrg.png" alt-text="1":::

1. Successful sign in.
  :::image type="content" source="media/agent-deploy/register-interactive-success-sml.png" lightbox="media/agent-deploy/register-interactive-success-lrg.png" alt-text="5":::

1. The agent is registered.
  :::image type="content" source="media/agent-deploy/agent-registered-interactive-sml.png" lightbox="media/agent-deploy/agent-registered-interactive-sml.png" alt-text="6":::


# [PowerShell](#tab/powershell)

Create the agent using the following sample code.

```azurepowershell
New-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName -StorageMoverName $StorageMoverName -Name $agentName -ArcResourceId $arcId -Description "Agent description" -ArcVMUuid $guid #-Debug 
```

Validate agent creation using the following sample code.

```azurepowershell
Get-AzStorageMoverAgent -ResourceGroupName $ResourceGroupName -StorageMoverName $StorageMoverName -Name $agentName 
```

# [CLI](#tab/cli)

Content for CLI.

---

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](service-overview.md)
