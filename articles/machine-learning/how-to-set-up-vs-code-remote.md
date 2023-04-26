---
title: 'Launch Visual Studio Code remotely connected to a compute instance (preview)'
titleSuffix: Azure Machine Learning
description: Connect to an Azure Machine Learning compute instance in Visual Studio Code to run interactive Jupyter Notebook and remote development workloads.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: lebaro
author: lebaro-msft
ms.reviewer: sgilley 
ms.date: 04/10/2023
# As a data scientist, I want to connect to an Azure Machine Learning compute instance in Visual Studio Code to access my resources and run my code.
---

# Launch Visual Studio Code remotely connected to a compute instance (preview)

In this article, you'll learn how to launch Visual Studio Code remotely connected to an Azure Machine Learning compute instance. Use VS Code as your integrated development environment (IDE) with the power of Azure Machine Learning resources. Use VS Code in the browser with VS Code for the Web, or use the VS Code desktop application.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

There are two ways you can connect to a compute instance from Visual Studio Code. We recommend the first approach.

1. **Remote compute instance.** This option provides you with a **full-featured development environment** for building your machine learning projects.
    * You can connect VS Code to a remote compute instance either in the browser [VS Code for the Web](?tabs=vscode-web#connect-remote-compute-instance-to-vs-code) or desktop application [VS Code Desktop](?tabs=vscode-desktop#connect-remote-compute-instance-to-vs-code).
    * We recommend **VS Code for the Web**, as you can do all your machine learning work directly from the browser, and without any required installations or dependencies.

1. **Remote Jupyter Notebook server**. This option allows you to set a compute instance as a remote Jupyter Notebook server.

> [!IMPORTANT]
> To connect to a compute instance behind a firewall, see [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md#scenario-visual-studio-code).

## Prerequisites

Before you get started, you will need:

* A workspace. If you don't already have one, you can create a workspace from the Azure Machine Learning studio, or [Use the Azure Machine Learning Visual Studio Code extension to create a new workspace](how-to-manage-resources-vscode.md#create-a-workspace).
* A compute instance. An [Azure Machine Learning compute instance](concept-compute-instance.md) is a fully managed cloud-based workstation for data scientists and provides management and enterprise readiness capabilities for IT administrators. You can create a compute instance from the Azure Machine Learning studio, or [Use the Azure Machine Learning Visual Studio Code extension to create a new compute instance](how-to-manage-resources-vscode.md#create-compute-instance).
* In the **Manage preview features** panel, scroll down and enable **Connect compute instances to Visual Studio Code for the Web**.

    :::image type="content" source="media/how-to-set-up-vs-code-remote/enable-web-preview.png" alt-text="Screenshot showing enable the VS Code for the web preview.":::

## Connect remote compute instance to VS Code

Use one of these options to connect VS Code to your compute instance.

# [Studio -> VS Code (Web)](#tab/vscode-web)

VS Code for the Web provides you with a **full-featured development environment** for building your machine learning projects, all from the browser and **without required installations or dependencies**. And by connecting your Azure Machine Learning compute instance, you get the rich and integrated development experience VS Code offers, enhanced by the power of Azure Machine Learning.

Launch VS Code for the Web with one click from the Azure Machine Learning studio, and seamlessly continue your work.

Navigate to [ml.azure.com](https://ml.azure.com) and follow the steps to launch a VS Code (Web) browser tab, connected to your Azure Machine Learning compute instance.

You can create the connection from either the **Notebooks** or **Compute** section of Azure Machine Learning studio.

* Notebooks

    1. Select the **Notebooks** tab
    1. In the *Notebooks* tab, select the file you want to edit.
    1. Select **Editors > Edit in VS Code (Web)**.
    :::image type="content" source="media/how-to-set-up-vs-code-remote/studio-notebook-compute-instance-vs-code-launch.png" alt-text="Screenshot of how to connect to Compute Instance VS Code (Web) Azure Machine Learning Notebook." lightbox="media/how-to-set-up-vs-code-remote/studio-notebook-compute-instance-vs-code-launch.png":::

* Compute

    1. Select the **Compute** tab
    1. In the *Application URI* column, select **VS Code (Web)** for the compute instance you want to connect to.

    :::image type="content" source="media/how-to-set-up-vs-code-remote/studio-compute-instance-vs-code-launch.png" alt-text="Screenshot of how to connect to Compute Instance VS Code Azure Machine Learning studio." lightbox="media/how-to-set-up-vs-code-remote/studio-compute-instance-vs-code-launch.png":::

# [Studio -> VS Code (Desktop)](#tab/vscode-desktop)

This option will launch the VS Code desktop application, connected to your compute instance.

On the initial connection, you may be prompted to install the Azure Machine Learning Visual Studio Code extension if you do not already have it. For more information, see the [Azure Machine Learning Visual Studio Code Extension setup guide](how-to-setup-vs-code.md).

> [!IMPORTANT]
> In order to connect to your remote compute instance from Visual Studio Code, make sure that the account you're logged into in Azure Machine Learning studio is the same one you use in Visual Studio Code.

Navigate to [ml.azure.com](https://ml.azure.com)

You can create the connection from either the **Notebooks** or **Compute** section of Azure Machine Learning studio.

* Notebooks

    1. Select the **Notebooks** tab
    1. In the *Notebooks* tab, select the file you want to edit.
    1. Select **Edit in VS Code (Desktop)**.
    :::image type="content" source="media/how-to-set-up-vs-code-remote/studio-notebook-compute-instance-vs-code-launch.png" alt-text="Screenshot of how to connect to Compute Instance VS Code Azure Machine Learning Notebook." lightbox="media/how-to-set-up-vs-code-remote/studio-notebook-compute-instance-vs-code-launch.png":::

* Compute

    1. Select the **Compute** tab
    1. In the *Application URI* column, select **VS Code (Desktop)** for the compute instance you want to connect to.

    :::image type="content" source="media/how-to-set-up-vs-code-remote/studio-compute-instance-vs-code-launch.png" alt-text="Screenshot of how to connect to Compute Instance VS Code Azure Machine Learning studio." lightbox="media/how-to-set-up-vs-code-remote/studio-compute-instance-vs-code-launch.png":::

# [From VS Code](#tab/extension)

This option will connect your current VS Code session to a remote compute instance. In order to connect to your compute instance _from_ VS Code, you will need to install the Azure Machine Learning Visual Studio Code extension. For more information, see the [Azure Machine Learning Visual Studio Code Extension setup guide](how-to-setup-vs-code.md).

### Azure Machine Learning Extension

1. In VS Code, launch the Azure Machine Learning extension.
1. Expand the **Compute instances** node in your extension.
1. Right-click the compute instance you want to connect to and select **Connect to Compute Instance**.

:::image type="content" source="media/how-to-set-up-vs-code-remote/vs-code-compute-instance-launch.png" alt-text="Connect to compute instance Visual Studio Code Azure Machine Learning Extension" lightbox="media/how-to-set-up-vs-code-remote/vs-code-compute-instance-launch.png":::

### Command Palette

1. In VS Code, open the command palette by selecting **View > Command Palette**.
1. Enter into the text box **AzureML: Connect to Compute Instance**.
1. Select your subscription.
1. Select your workspace.
1. Select your compute instance or create a new one.

---

If you pick one of the click-out experiences, a new VS Code window will be opened, and a connection attempt made to the remote compute instance. When attempting to make this connection, the following steps are taking place:

1. Authorization. Some checks are performed to make sure the user attempting to make a connection is authorized to use the compute instance.
1. VS Code Remote Server is installed on the compute instance.
1. A WebSocket connection is established for real-time interaction.

Once the connection is established, it's persisted. A token is issued at the start of the session which gets refreshed automatically to maintain the connection with your compute instance.

After you connect to your remote compute instance, use the editor to:

* [Author and manage files on your remote compute instance or file share](https://code.visualstudio.com/docs/editor/codebasics).
* Use the [VS Code integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) to [run commands and applications on your remote compute instance](how-to-access-terminal.md).
* [Debug your scripts and applications](https://code.visualstudio.com/Docs/editor/debugging)
* [Use VS Code to manage your Git repositories](concept-train-model-git-integration.md)

## Configure compute instance as remote notebook server

In order to configure a compute instance as a remote Jupyter Notebook server you'll need a couple prerequisites:

* Azure Machine Learning workspace. [Use the Azure Machine Learning Visual Studio Code extension to create a new workspace](how-to-manage-resources-vscode.md#create-a-workspace) if you don't already have one.
* Azure Machine Learning Visual Studio Code extension. For more information, see the [Azure Machine Learning Visual Studio Code Extension setup guide](how-to-setup-vs-code.md).

To connect to a compute instance:

1. Open a Jupyter Notebook in Visual Studio Code.
1. When the integrated notebook experience loads, select **Jupyter Server**.

    > [!div class="mx-imgBorder"]
    > ![Launch Azure Machine Learning remote Jupyter Notebook server dropdown](media/how-to-set-up-vs-code-remote/launch-server-selection-dropdown.png)

    Alternatively, you also use the command palette:

    1. Open the command palette by selecting **View > Command Palette** from the menu bar.
    1. Enter into the text box `AzureML: Connect to Compute instance Jupyter server`.

1. Choose `Azure Machine Learning Compute Instances` from the list of Jupyter server options.
1. Select your subscription from the list of subscriptions. If you have previously configured your default Azure Machine Learning workspace, this step is skipped.
1. Select your workspace.
1. Select your compute instance from the list. If you don't have one, select **Create new Azure Machine Learning Compute Instance** and follow the prompts to create one.
1. For the changes to take effect, you have to reload Visual Studio Code.
1. Open a Jupyter Notebook and run a cell.

> [!IMPORTANT]
> You **MUST** run a cell in order to establish the connection.

At this point, you can continue to run cells in your Jupyter Notebook.

> [!TIP]
> You can also work with Python script files (.py) containing Jupyter-like code cells. For more information, see the [Visual Studio Code Python interactive documentation](https://code.visualstudio.com/docs/python/jupyter-support-py).

## Next steps

Now that you've launched Visual Studio Code remotely connected to a compute instance, you can prep your data, edit and debug your code, and submit training jobs with the Azure ML extension.

To learn more about the how to make the most of VS Code integrated with Azure ML, see [Work in VS Code remotely connected to a compute instance (preview)](how-to-work-in-vs-code-remote.md)
