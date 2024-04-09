---
title: Hunt for security threats with Jupyter notebooks - Microsoft Sentinel
description: Launch and run notebooks with the Microsoft Sentinel hunting capabilities.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.date: 03/08/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to deploy and launch a Jupyter notebook to hunt for security threats.
---

# Hunt for security threats with Jupyter notebooks

As part of your security investigations and hunting, launch and run Jupyter notebooks to programmatically analyze your data.

In this article, you create an Azure Machine Learning  workspace, launch notebook from Microsoft Sentinel to your Azure Machine Learning workspace, and run code in the notebook. 

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

<a name ="create-an-azure-ml-workspace-from-microsoft-sentinel"></a>

## Prerequisites

We recommend that you learn about Microsoft Sentinel notebooks before completing the steps in this article. See [Use Jupyter notebooks to hunt for security threats](notebooks.md).

To use Microsoft Sentinel notebooks, you must have the following roles and permissions:

|Type  |Details  |
|---------|---------|
|**Microsoft Sentinel**     |- The **Microsoft Sentinel Contributor** role, in order to save and launch notebooks from Microsoft Sentinel         |
|**Azure Machine Learning**     |- A resource group-level **Owner** or **Contributor** role, to create a new Azure Machine Learning workspace if needed. <br>- A **Contributor** role on the Azure Machine Learning workspace where you run your Microsoft Sentinel notebooks.    <br><br>For more information, see [Manage access to an Azure Machine Learning workspace](../machine-learning/how-to-assign-roles.md).     |

## Create an Azure Machine Learning workspace from Microsoft Sentinel

To create your workspace, select one of the following tabs, depending on whether you're using a public or private endpoint.

- We recommend that you use a *public endpoint* when your Microsoft Sentinel workspace has one, to avoid potential issues in the network communication.
- If you want to use an Azure Machine Learning workspace in a virtual network, use a *private endpoint*.

# [Public endpoint](#tab/public-endpoint)

1.  For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Notebooks**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Notebooks**.

1. Select **Configure Azure Machine Learning** > **Create a new AML workspace**.

1. Enter the following details, and then select **Next**.

    |Field|Description|
    |--|--|
    |**Subscription**|Select the Azure subscription that you want to use.|
    |**Resource group**|Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution.|
    |**Workspace name**|Enter a unique name that identifies your workspace. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.|
    |**Region**|Select the location closest to your users and the data resources to create your workspace.|
    |**Storage account**| A storage account is used as the default datastore for the workspace. You might create a new Azure Storage resource or select an existing one in your subscription.|
    |**KeyVault**| A key vault is used to store secrets and other sensitive information that is needed by the workspace. You might create a new Azure Key Vault resource or select an existing one in your subscription.|
    |**Application insights**| The workspace uses Azure Application Insights to store monitoring information about your deployed models. You might create a new Azure Application Insights resource or select an existing one in your subscription.|
    |**Container registry**| A container registry is used to register docker images used in training and deployments. To minimize costs, a new Azure Container Registry resource is created only after you build your first image. Alternatively, you might choose to create the resource now or select an existing one in your subscription, or select **None** if you don't want to use any container registry.|

1. On the **Networking** tab, select **Enable public access from all networks**.

    Define any relevant settings in the **Advanced** or **Tags** tabs, and then select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Microsoft Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.


# [Private endpoint](#tab/private-endpoint)

The steps in this procedure reference specific articles in the Azure Machine Learning documentation when relevant. For more information, see [How to create a secure Azure Machine Learning workspace](../machine-learning/tutorial-create-secure-workspace.md).

1. Create a virtual machine (VM) jump box within a virtual network. Since the virtual network restricts access from the public internet, the jump box is used as a way to connect to resources behind the virtual network.

1. Access the jump box, and then go to your Microsoft Sentinel workspace. We recommend using [Azure Bastion](../bastion/bastion-overview.md) to access the VM.

1.  For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Notebooks**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Notebooks**.

1. Select **Configure Azure Machine Learning** > **Create a new AML workspace**.

1. Enter the following details, and then select **Next**.

    |Field|Description|
    |--|--|
    |**Subscription**|Select the Azure subscription that you want to use.|
    |**Resource group**|Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution.|
    |**Workspace name**|Enter a unique name that identifies your workspace. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.|
    |**Region**|Select the location closest to your users and the data resources to create your workspace.|
    |**Storage account**| A storage account is used as the default datastore for the workspace. You might create a new Azure Storage resource or select an existing one in your subscription.|
    |**KeyVault**| A key vault is used to store secrets and other sensitive information that is needed by the workspace. You might create a new Azure Key Vault resource or select an existing one in your subscription.|
    |**Application insights**| The workspace uses Azure Application Insights to store monitoring information about your deployed models. You might create a new Azure Application Insights resource or select an existing one in your subscription.|
    |**Container registry**| A container registry is used to register docker images used in training and deployments. To minimize costs, a new Azure Container Registry resource is created only after you build your first image. Alternatively, you might choose to create the resource now or select an existing one in your subscription, or select **None** if you don't want to use any container registry.|

1. On the **Networking** tab, select **Disable public access and use private endpoint**. Make sure to use the same virtual network as you have in the VM jump box. For example:

    :::image type="content" source="media/notebooks/create-private-endpoint.png" alt-text="Screenshot of the Create private endpoint page in Microsoft Sentinel." lightbox="media/notebooks/create-private-endpoint.png":::

1. Define any relevant settings in the **Advanced** or **Tags** tabs, and then select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Microsoft Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.

1.	In the Azure Machine Learning studio, on the **Compute** page, create a new compute. On the **Advanced Settings** tab, make sure to select the same virtual network that you'd used for your VM jump box. For more information, see [Create and manage an Azure Machine Learning compute instance](../machine-learning/how-to-create-compute-instance.md?tabs=python).

1.	Configure your network traffic to access Azure Machine Learning from behind a firewall. For more information, see [Configure inbound and outbound network traffic](../machine-learning/how-to-access-azureml-behind-firewall.md?tabs=ipaddress%2cpublic).

Continue with one of the following sets of steps:

- **If you have one private link only**: You can now access the notebooks via any of the following methods:

    - Clone and launch notebooks from Microsoft Sentinel to Azure Machine Learning
    - Upload notebooks to Azure Machine Learning manually
    - Clone the [Microsoft Sentinel notebooks GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks) on the Azure Machine Learning terminal

- **If you have another private link, that uses a different VNET**, do the following:

    1. In the Azure portal, go to the resource group of your Azure Machine Learning workspace, and then search for the **Private DNS zone** resources named **privatelink.api.azureml.ms** and **privatelink.notebooks.azure.ms**.  For example:

        :::image type="content" source="media/notebooks/select-private-dns-zone.png" alt-text="Screenshot of a private DNS zone resource selected." lightbox="media/notebooks/select-private-dns-zone.png":::

    1. For each resource, including both **privatelink.api.azureml.ms** and **privatelink.notebooks.azure.ms**, add a virtual network link.

        Select the resource > **Virtual network links** > **Add**. For more information, see [Link the virtual network](../dns/private-dns-getstarted-portal.md).

For more information, see:

- [Network traffic flow when using a secured workspace](../machine-learning/concept-secure-network-traffic-flow.md)
- [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](../machine-learning/how-to-network-security-overview.md)

---

After your deployment is complete, go back to **Notebooks** in Microsoft Sentinel and launch notebooks from your new Azure Machine Learning workspace.

If you have multiple notebooks, make sure to select a default AML workspace to use when launching your notebooks. For example:

:::image type="content" source="media/notebooks/default-machine-learning.png" alt-text="Select a default AML workspace for your notebooks.":::


## Launch a notebook in your Azure Machine Learning workspace

After you create an Azure Machine Learning workspace, launch your notebooks in that workspace from Microsoft Sentinel.

1.  For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Threat management**, select **Notebooks**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Threat management** > **Notebooks**.
1. Select the **Templates** tab to see the notebooks that Microsoft Sentinel provides.
1. Select a notebook to view its description, required data types, and data sources.

1. When you find the notebook you want to use, select **Create from template** and **Save** to clone it into your own workspace.

1. Edit the name as needed. If the notebook already exists in your workspace, overwrite the existing notebook or create a new one. By default, your notebook is saved in /Users/<Your_User_Name>/ directory of selected AML workspace.

    :::image type="content" source="media/notebooks/save-notebook.png" alt-text="Save a notebook to clone it to your own workspace.":::

1. After the notebook is saved, the **Save notebook** button changes to **Launch notebook**. Select **Launch notebook** to open it in your AML workspace.

    For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Launch your notebook in your AML workspace.":::

1. At the top of the page, select a **Compute** instance to use for your notebook server.

    If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-compute-instance.md?tabs=#create). If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).

    Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.

    If you're creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.
    
    The kernel is also shown at the top right of your Azure Machine Learning window. If the kernel you need isn't selected, select a different version from the dropdown list.
   

1. Once your notebook server is created and started, run your notebook cells. In each cell, select the **Run** icon to run your notebook code.

    For more information, see [Command mode shortcuts.](../machine-learning/how-to-run-jupyter-notebooks.md)

1. If your notebook hangs or you want to start over, you can restart the kernel and rerun the notebook cells from the beginning. If you restart the kernel, variables and other state are deleted. Rerun any initialization and authentication cells after you restart.

   To start over, select **Kernel operations** > **Restart kernel**. For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-restart-kernel.png" alt-text="Restart a notebook kernel.":::

## Run code in your notebook

Always run notebook code cells in sequence. Skipping cells can result in errors.

In a notebook:

- **Markdown** cells have text, including HTML, and static images.
- **Code** cells contain code. After you select a code cell, run the code in the cell by selecting the **Play** icon to the left of the cell, or by pressing **SHIFT+ENTER**.

For example, run the following code cell in your notebook:

```python
# This is your first code cell. This cell contains basic Python code.

# You can run a code cell by selecting it and then selecting
# the Play button to the left of the cell, or by pressing SHIFT+ENTER.
# Code output displays below the code.

print("Congratulations, you just ran this code cell")

y = 2 + 2

print("2 + 2 =", y)

```

The sample code produces this output:

```python
Congratulations, you just ran this code cell

2 + 2 = 4
```

Variables set within a notebook code cell persist between cells, so you can chain cells together. For example, the following code cell uses the value of `y` from the previous cell:

```python
# Note that output from the last line of a cell is automatically
# sent to the output cell, without needing the print() function.

y + 2
```

The output is:

```output
6
```

## Download all Microsoft Sentinel notebooks

This section describes how to use Git to download all the notebooks available in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks/), from inside a Microsoft Sentinel notebook, directly to your Azure Machine Learning workspace.

Storing the Microsoft Sentinel notebooks in your Azure Machine Learning workspace allows you to keep them updated easily.

1. From a Microsoft Sentinel notebook, enter the following code into an empty cell, and then run the cell:

    ```python
    !git clone https://github.com/Azure/Azure-Sentinel-Notebooks.git azure-sentinel-nb
    ```

    A copy of the GitHub repository contents is created in the **azure-Sentinel-nb** directory on your user folder in your Azure Machine Learning workspace.

1. Copy the notebooks you want from this folder to your working directory.

1. To update your notebooks with any recent changes from GitHub, run:

    ```python
    !cd azure-sentinel-nb && git pull
    ```

## Related content

- [Jupyter notebooks with Microsoft Sentinel hunting capabilities](notebooks.md)
- [Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
