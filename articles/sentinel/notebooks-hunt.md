---
title: Hunt for security threats with Jupyter notebooks - Microsoft Sentinel
description: Launch and run notebooks with the Microsoft Sentinel hunting capabilities.
author: cwatson-cat
ms.author: cwatson
ms.topic: how-to
ms.custom: mvc, ignite-fall-2021, event-tier1-build-2022
ms.date: 01/05/2023
#Customer intent: As a security analyst, I want to deploy and launch a Jupyter notebook to hunt for security threats.
---

# Hunt for security threats with Jupyter notebooks

As part of your security investigations and hunting, launch and run Jupyter notebooks to programmatically analyze your data.

In this how-to guide, you'll create an Azure Machine Learning (ML) workspace, launch notebook from Sentinel portal to your Azure ML workspace, and run code in the notebook.

## Prerequisites

We recommend that you learn about Microsoft Sentinel notebooks in general before completing the steps in this article. See [Use Jupyter notebooks to hunt for security threats](notebooks.md).

To use Microsoft Sentinel notebooks, you must have the following roles and permissions:

|Type  |Details  |
|---------|---------|
|**Microsoft Sentinel**     |- The **Microsoft Sentinel Contributor** role, in order to save and launch notebooks from Microsoft Sentinel         |
|**Azure Machine Learning**     |- A resource group-level **Owner** or **Contributor** role, to create a new Azure Machine Learning workspace if needed. <br>- A **Contributor** role on the Azure Machine Learning workspace where you run your Microsoft Sentinel notebooks.    <br><br>For more information, see [Manage access to an Azure Machine Learning workspace](../machine-learning/how-to-assign-roles.md).     |

## Create an Azure ML workspace from Microsoft Sentinel

To create your workspace, select one of the following tabs, depending on whether you'll be using a public or private endpoint.

- We recommend using a *public endpoint* if your Microsoft Sentinel workspace has one, to avoid potential issues in the network communication.
- If you want to use an Azure ML workspace in a virtual network, use a *private endpoint*.

# [Public endpoint](#tab/public-endpoint)

1. From the Azure portal, go to **Microsoft Sentinel** > **Threat management** > **Notebooks** and then select **Create a new AML workspace**.

1. Enter the following details, and then select **Next**.

    |Field|Description|
    |--|--|
    |**Subscription**|Select the Azure subscription that you want to use.|
    |**Resource group**|Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution.|
    |**Workspace name**|Enter a unique name that identifies your workspace. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.|
    |**Region**|Select the location closest to your users and the data resources to create your workspace.|
    |**Storage account**| A storage account is used as the default datastore for the workspace. You may create a new Azure Storage resource or select an existing one in your subscription.|
    |**KeyVault**| A key vault is used to store secrets and other sensitive information that is needed by the workspace. You may create a new Azure Key Vault resource or select an existing one in your subscription.|
    |**Application insights**| The workspace uses Azure Application Insights to store monitoring information about your deployed models. You may create a new Azure Application Insights resource or select an existing one in your subscription.|
    |**Container registry**| A container registry is used to register docker images used in training and deployments. To minimize costs, a new Azure Container Registry resource is created only after you build your first image. Alternatively, you may choose to create the resource now or select an existing one in your subscription, or select **None** if you don't want to use any container registry.|

1. On the **Networking** tab, select **Enable public access from all networks**.

    Define any relevant settings in the **Advanced** or **Tags** tabs, and then select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Microsoft Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.


# [Private endpoint](#tab/private-endpoint)

The steps in this procedure reference specific articles in the Azure Machine Learning documentation when relevant. For more information, see [How to create a secure Azure ML workspace](../machine-learning/tutorial-create-secure-workspace.md).

1.	Create a VM jump box within a VNet. Since the VNet restricts access from the public internet, the jump box is used as a way to connect to resources behind the VNet.

1.	Access the jump box, and then go to your Microsoft Sentinel workspace. We recommend using [Azure Bastion](../bastion/bastion-overview.md) to access the VM.

1. In Microsoft Sentinel, select **Threat management** > **Notebooks** and then select **Create a new AML workspace**.

1. Enter the following details, and then select **Next**.

    |Field|Description|
    |--|--|
    |**Subscription**|Select the Azure subscription that you want to use.|
    |**Resource group**|Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution.|
    |**Workspace name**|Enter a unique name that identifies your workspace. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.|
    |**Region**|Select the location closest to your users and the data resources to create your workspace.|
    |**Storage account**| A storage account is used as the default datastore for the workspace. You may create a new Azure Storage resource or select an existing one in your subscription.|
    |**KeyVault**| A key vault is used to store secrets and other sensitive information that is needed by the workspace. You may create a new Azure Key Vault resource or select an existing one in your subscription.|
    |**Application insights**| The workspace uses Azure Application Insights to store monitoring information about your deployed models. You may create a new Azure Application Insights resource or select an existing one in your subscription.|
    |**Container registry**| A container registry is used to register docker images used in training and deployments. To minimize costs, a new Azure Container Registry resource is created only after you build your first image. Alternatively, you may choose to create the resource now or select an existing one in your subscription, or select **None** if you don't want to use any container registry.|

1. On the **Networking** tab, select **Disable public access and use private endpoint**. Make sure to use the same VNet as you have in the VM jump box. For example:

    :::image type="content" source="media/notebooks/create-private-endpoint.png" alt-text="Screenshot of the Create private endpoint page in Microsoft Sentinel." lightbox="media/notebooks/create-private-endpoint.png":::

1. Define any relevant settings in the **Advanced** or **Tags** tabs, and then select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Microsoft Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.

1.	In the Azure Machine Learning studio, on the **Compute** page, create a new compute. On the **Advanced Settings** tab, make sure to select the same VNet that you'd used for your VM jump box. For more information, see [Create and manage an Azure Machine Learning compute instance](../machine-learning/how-to-create-compute-instance.md?tabs=python).

1.	Configure your network traffic to access Azure ML from behind a firewall. For more information, see [Configure inbound and outbound network traffic](../machine-learning/how-to-access-azureml-behind-firewall.md?tabs=ipaddress%2cpublic).

Continue with one of the following sets of steps:

- **If you have one private link only**: You can now access the notebooks via any of the following methods:

    - Clone and launch notebooks from Microsoft Sentinel to Azure Machine Learning
    - Upload notebooks to Azure Machine Learning manually
    - Clone the [Microsoft Sentinel notebooks GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks) on the Azure Machine learning terminal

- **If you have another private link, that uses a different VNET**, do the following:

    1. In the Azure portal, go to the resource group of your Azure Machine Learning workspace, and then search for the **Private DNS zone** resources named **privatelink.api.azureml.ms** and **privatelink.notebooks.azure.ms**.  For example:

        :::image type="content" source="media/notebooks/select-private-dns-zone.png" alt-text="Screenshot of a private DNS zone resource selected." lightbox="media/notebooks/select-private-dns-zone.png":::

    1. For each resource, including both **privatelink.api.azureml.ms** and **privatelink.notebooks.azure.ms**, add a virtual network link.

        Select the resource > **Virtual network links** > **Add**. For more information, see [Link the virtual network](../dns/private-dns-getstarted-portal.md).

For more information, see:

- [Network traffic flow when using a secured workspace](../machine-learning/concept-secure-network-traffic-flow.md)
- [Secure Azure Machine Learning workspace resources using virtual networks (VNets)](../machine-learning/how-to-network-security-overview.md)

---

After your deployment is complete, you can go back to the Microsoft Sentinel **Notebooks** and launch notebooks from your new Azure ML workspace.

If you have multiple notebooks, make sure to select a default AML workspace to use when launching your notebooks. For example:

:::image type="content" source="media/notebooks/default-machine-learning.png" alt-text="Select a default AML workspace for your notebooks.":::


## Launch a notebook in your Azure ML workspace

After you've created an AML workspace, start launching your notebooks in your Azure ML workspace, from Microsoft Sentinel.


1. From the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Notebooks** > **Templates**, where you can see notebooks that Microsoft Sentinel provides.
1. Select a notebook to view its description, required data types, and data sources.

    When you've found the notebook you want to use, select **Create from template** and **Save** to clone it into your own workspace.

    Edit the name as needed. If the notebook already exists in your workspace, you can overwrite the existing notebook or create a new one. By default, your notebook will be saved in /Users/<Your_User_Name>/ directory of selected AML workspace.

    :::image type="content" source="media/notebooks/save-notebook.png" alt-text="Save a notebook to clone it to your own workspace.":::

1. After the notebook is saved, the **Save notebook** button changes to **Launch notebook**. Select **Launch notebook** to open it in your AML workspace.

    For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Launch your notebook in your AML workspace.":::

1. At the top of the page, select a **Compute** instance to use for your notebook server.

    If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-compute-instance.md?tabs=#create). If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).

    Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.

    If you are creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.
    
    The kernel is also shown at the top right of your Azure ML window. If the kernel you need isn't selected, select a different version from the dropdown list.
   

1. Once your notebook server is created and started, you can starting running your notebook cells. In each cell, select the **Run** icon to run your notebook code.

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

The sample code shown above produces this output:

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

This section describes how to use Git to download all the notebooks available in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks/), from inside a Microsoft Sentinel notebook, directly to your Azure ML workspace.

Having Microsoft Sentinel notebooks stored in your Azure ML workspace allows you to keep them updated easily.

1. From a Microsoft Sentinel notebook, enter the following code into an empty cell, and then run the cell:

    ```python
    !git clone https://github.com/Azure/Azure-Sentinel-Notebooks.git azure-sentinel-nb
    ```

    A copy of the GitHub repository contents is created in the **azure-Sentinel-nb** directory on your user folder in your Azure ML workspace.

1. Copy the notebooks you want from this folder to your working directory.

1. To update your notebooks with any recent changes from GitHub, run:

    ```python
    !cd azure-sentinel-nb && git pull
    ```

## Next steps

- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Integrate notebooks with Azure Synapse (Public preview)](notebooks-with-synapse.md)

Other resources:
- Use notebooks shared in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks) as useful tools, illustrations, and code samples that you can use when developing your own notebooks.

- Submit feedback, suggestions, requests for features, contributed notebooks, bug reports or improvements and additions to existing notebooks. Go to the [Microsoft Sentinel  GitHub repository](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.

- Learn more about using notebooks in threat hunting and investigation by exploring some notebook templates, such as [Credential Scan on Azure Log Analytics](https://www.youtube.com/watch?v=OWjXee8o04M) and Guided Investigation - Process Alerts.

    Find more notebook templates in the Microsoft Sentinel > **Notebooks** > **Templates** tab.

- **Find more notebooks** in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks):

  - The [`Example-Notebooks`](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/tutorials-and-examples/example-notebooks) directory includes sample notebooks that are saved with data that you can use to show intended output.

  - The [`HowTos`](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/tutorials-and-examples/how-tos) directory includes notebooks that describe concepts such as setting your default Python version, creating Microsoft Sentinel bookmarks from a notebook, and more.

For more information, see:

- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)

- [Tutorial: Microsoft Sentinel notebooks - Getting started](https://www.youtube.com/results?search_query=azazure+sentinel+notebooks) (Video)
- [Tutorial: Edit and run Jupyter notebooks without leaving Azure ML studio](https://www.youtube.com/watch?v=AAj-Fz0uCNk) (Video)
- [Webinar: Microsoft Sentinel notebooks fundamentals](https://www.youtube.com/watch?v=rewdNeX6H94)
- [Proactively hunt for threats](hunting.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)
- [Jupyter, msticpy, and Microsoft Sentinel](https://msticpy.readthedocs.io/en/latest/getting_started/JupyterAndAzureSentinel.html)
