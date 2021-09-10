---
title: Use notebooks with Azure Sentinel for security hunting
description: This article describes how to use notebooks with the Azure Sentinel hunting capabilities.
services: sentinel
author: batamig
ms.author: bagol
ms.assetid: 1721d0da-c91e-4c96-82de-5c7458df566b
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.custom: mvc
ms.date: 06/24/2021
---

# Use Jupyter Notebook to hunt for security threats

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The foundation of Azure Sentinel is the data store; it combines high-performance querying, dynamic schema, and scales to massive data volumes. The Azure portal and all Azure Sentinel tools use a common API to access this data store. The same API is also available for external tools such as [Jupyter](https://jupyter.org/) notebooks and Python. While many common tasks can be carried out in the portal, Jupyter extends the scope of what you can do with this data. It combines full programmability with a huge collection of libraries for machine learning, visualization, and data analysis. These attributes make Jupyter a compelling tool for security investigation and hunting.

For example, use notebooks to:

- Perform analytics that aren't built-in to Azure Sentinel, such as some Python machine learning features
- Create data visualizations that aren't built-in to Azure Sentinel, such as custom timelines and process trees
- Integrate data sources outside of Azure Sentinel, such as an on-premises data set.

We've integrated the Jupyter experience into the Azure portal, making it easy for you to create and run notebooks to analyze your data. The *Kqlmagic* library provides the glue that lets you take queries from Azure Sentinel and run them directly inside a notebook. Queries use the [Kusto Query Language](https://kusto.azurewebsites.net/docs/kusto/query/index.html). Several notebooks, developed by some of Microsoft's security analysts, are packaged with Azure Sentinel. Some of these notebooks are built for a specific scenario and can be used as-is. Others are intended as samples to illustrate techniques and features that you can copy or adapt for use in your own notebooks. Other notebooks may also be imported from the Azure Sentinel Community GitHub.

The integrated Jupyter experience uses [Azure Notebooks](https://notebooks.azure.com/) to store, share, and execute notebooks. You can also run these notebooks locally if you have a Python environment and Jupyter on your computer, or in other JupyterHub environments such as Azure Databricks.


## Notebook components

Notebooks have two components:
- **The browser-based interface**, where you enter and run queries and code, and where the results of the execution are displayed.
- **A *kernel*** that is responsible for parsing and executing the code itself.

The Azure Sentinel notebook's kernel runs on an Azure virtual machine (VM). Several licensing options exist to leverage more powerful virtual machines if your notebooks include complex machine learning models.

The Azure Sentinel notebooks use many popular Python libraries such as *pandas*, *matplotlib*, *bokeh*, and others. There are a great many other Python packages for you to choose from, covering areas such as:

- Visualizations and graphics
- Data processing and analysis
- Statistics and numerical computing
- Machine learning and deep learning

We've also released some open-source Jupyter security tools in a package named [msticpy](https://github.com/Microsoft/msticpy/). This package is used in many of the included notebooks. Msticpy tools are designed specifically to help with creating notebooks for hunting and investigation and we're actively working on new features and improvements. For more information, see the [MSTIC Jupyter and Python Security Tools documentation](https://msticpy.readthedocs.io/).

The [Azure Sentinel Community GitHub repository](https://github.com/Azure/Azure-Sentinel) is the location for any future Azure Sentinel notebooks built by Microsoft or contributed from the community.


## Manage access to Azure Sentinel notebooks

To use the notebooks, you must first have the right permissions, depending on your user role.

As Azure Sentinel notebooks run on [Azure Machine Learning](../machine-learning/overview-what-is-azure-machine-learning.md) (Azure ML) platform, you must have appropriate access to both Azure Sentinel workspace and an [Azure ML workspace](../machine-learning/concept-workspace.md).

|Permission  |Description  |
|---------|---------|
|**Azure Sentinel permissions**     |   Like other Azure Sentinel resources, to access notebooks on Azure Sentinel Notebooks blade, an Azure Sentinel Reader, Azure Sentinel Responder, or Azure Sentinel Contributor role is required. <br><br>For more information, see [Permissions in Azure Sentinel](roles.md).|
|**Azure Machine Learning permissions**     | An Azure Machine Learning workspace is an Azure resource. Like other Azure resources, when a new Azure Machine Learning workspace is created, it comes with default roles. You can add users to the workspace and assign them to one of these built-in roles. For more information, see [Azure Machine Learning default roles](../machine-learning/how-to-assign-roles.md) and [Azure built-in roles](../role-based-access-control/built-in-roles.md). <br><br>   **Important**: Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a workspace may not have owner access to the resource group that contains the workspace. For more information, see [How Azure RBAC works](../role-based-access-control/overview.md). <br><br>If you're an owner of an Azure ML workspace, you can add and remove roles for the workspace and assign roles to users. For more information, see:<br>    - [Azure portal](../role-based-access-control/role-assignments-portal.md)<br>    - [PowerShell](../role-based-access-control/role-assignments-powershell.md)<br>    - [Azure CLI](../role-based-access-control/role-assignments-cli.md)<br>   - [REST API](../role-based-access-control/role-assignments-rest.md)<br>    - [Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)<br> - [Azure Machine Learning CLI ](../machine-learning/how-to-assign-roles.md#manage-workspace-access)<br><br>If the built-in roles are insufficient, you can also create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that workspace. You can make the role available at a specific workspace level, a specific resource group level, or a specific subscription level. For more information, see [Create custom role](../machine-learning/how-to-assign-roles.md#create-custom-role). |
|     |         |


## Create an Azure ML workspace from Azure Sentinel

This procedure describes how to create an Azure ML workspace from Azure Sentinel for your Azure Sentinel notebooks.

**To create your workspace**:

1. From the Azure portal, go to **Azure Sentinel** > **Threat management** > **Notebooks** and then select **Create a new AML workspace**.

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
    | | |

1. On the **Networking** tab, select whether to connect your workspace using a public endpoint, or using a private endpoint that you configure. If your Azure Sentinel workspace has a public endpoint, we recommend using a public endpoint for your Azure ML workspace to avoid potential issues in the network communication. When you're done, select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Azure Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.

1. After your deployment is complete, you can go back to the Azure Sentinel **Notebooks** and launch notebooks from your new Azure ML workspace.

    If you have multiple notebooks, make sure to select a default AML workspace to use when launching your notebooks. For example:

    :::image type="content" source="media/notebooks/default-machine-learning.png" alt-text="Select a default AML workspace for your notebooks.":::


## Launch a notebook in your Azure ML workspace

After you've created an AML workspace, start launching your notebooks in your Azure ML workspace, from Azure Sentinel.

**To launch your notebook**:

1. From the Azure portal, navigate to **Azure Sentinel** > **Threat management** > **Notebooks**, where you can see notebooks that Azure Sentinel provides.

    > [!TIP]
    > At the top of the **Notebooks** page, select **Guides & Feedback** to show more resources and guidance in a pane on the right.

1. Select a notebook to view its description, required data types, and data sources.

    When you've found the notebook you want to use, select **Save notebook** to clone it into your own workspace.

    Edit the name as needed. If the notebook already exists in your workspace, you'll have the option to overwrite the existing notebook or create a new one.

    :::image type="content" source="media/notebooks/save-notebook.png" alt-text="Save a notebook to clone it to your own workspace.":::

1. After the notebook is saved, the **Save notebook** button changes to **Launch notebook**. Select **Launch notebook** to open it in your AML workspace.

    For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Launch your notebook in your AML workspace.":::

1. At the top of the page, select a **Compute** instance to use for your notebook server.

    If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-manage-compute-instance.md?tabs=#use-the-script-in-the-studio). If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).

    Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.

    > [!TIP]
    > If you are creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.

1. Once your notebook server is created and started, you can starting running your notebook cells. In each cell, select the **Run** icon to run your notebook code.

    For more information, see [Command mode shortcuts.](../machine-learning/how-to-run-jupyter-notebooks.md)

1. If you need to restart the notebook kernel and rerun the notebook cells from the beginning, select **Kernel operations** > **Restart kernel**. For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-restart-kernel.png" alt-text="Restart a notebook kernel.":::

## Troubleshooting

If you run into issues with your notebooks, see the [Azure Machine Learning notebook troubleshooting](../machine-learning/how-to-run-jupyter-notebooks.md#troubleshooting).


## Next steps

- Learn more about using notebooks in threat hunting and investigation by exploring some notebook templates, such as [**Credential Scan on Azure Log Analytics**](https://www.youtube.com/watch?v=OWjXee8o04M) and **Guided Investigation - Process Alerts**. 

    Find notebook templates in the Azure Sentinel > **Notebooks** > **Templates** tab.

- Find more in the [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks):

    - The [**Sample-Notebooks**](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/Sample-Notebooks) directory includes sample notebooks that are saved with data that you can use to show intended output.

    - The [**HowTos**](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/HowTos) directory includes notebooks that describe concepts such as setting your default Python version, creating Azure Sentinel bookmarks from a notebook, and more.

    For more information, see the [Getting Started with Azure ML Notebooks and Azure Sentinel](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/A%20Getting%20Started%20Guide%20For%20Azure%20Sentinel%20ML%20Notebooks.ipynb) guide.

> [!NOTE]
> The notebooks shared in the [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks) are intended as useful tools, illustrations, and code samples that you can use when developing your own notebooks.
>
> We welcome feedback, suggestions, requests for features, contributed notebooks, bug reports or improvements and additions to existing notebooks. Go to the [Azure Sentinel Community GitHub](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.
>

For more information, see:

- [Webinar: Azure Sentinel notebooks fundamentals](https://www.youtube.com/watch?v=rewdNeX6H94)
- [Tutorial: Azure Sentinel notebooks - Getting started](https://www.youtube.com/results?search_query=azazure+sentinel+notebooks)
- [Proactively hunt for threats](hunting.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)
- [Jupyter, msticpy and Azure Sentinel](https://msticpy.readthedocs.io/en/latest/getting_started/JupyterAndAzureSentinel.html)
- [Tutorial: Edit and run Jupyter notebooks without leaving Azure ML studio](https://www.youtube.com/watch?v=AAj-Fz0uCNk)
