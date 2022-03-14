---
title: Use notebooks with Microsoft Sentinel for security hunting
description: This article describes how to use notebooks with the Microsoft Sentinel hunting capabilities.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.custom: mvc, ignite-fall-2021
ms.date: 11/14/2021
---

# Use Jupyter notebooks to hunt for security threats

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The foundation of Microsoft Sentinel is the data store; it combines high-performance querying, dynamic schema, and scales to massive data volumes. The Azure portal and all Microsoft Sentinel tools use a common API to access this data store.

The same API is also available for external tools such as [Jupyter](https://jupyter.org/) notebooks and Python. While many common tasks can be carried out in the portal, Jupyter extends the scope of what you can do with this data. It combines full programmability with a huge collection of libraries for machine learning, visualization, and data analysis. These attributes make Jupyter a compelling tool for security investigation and hunting.

For example, use notebooks to:

- **Perform analytics** that aren't provided out-of-the box in Microsoft Sentinel, such as some Python machine learning features
- **Create data visualizations** that aren't provided out-of-the box in Microsoft Sentinel, such as custom timelines and process trees
- **Integrate data sources** outside of Microsoft Sentinel, such as an on-premises data set.

We've integrated the Jupyter experience into the Azure portal, making it easy for you to create and run notebooks to analyze your data. The *Kqlmagic* library provides the glue that lets you take [KQL](https://kusto.azurewebsites.net/docs/kusto/query/index.html) queries from Microsoft Sentinel and run them directly inside a notebook.

Several notebooks, developed by some of Microsoft's security analysts, are packaged with Microsoft Sentinel:

- Some of these notebooks are built for a specific scenario and can be used as-is.
- Others are intended as samples to illustrate techniques and features that you can copy or adapt for use in your own notebooks.

Still other notebooks may also be imported from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks/).

## Notebook components

Notebooks have two components:

- **The browser-based interface**, where you enter and run queries and code, and where the results of the execution are displayed.
- **A *kernel*** that is responsible for parsing and executing the code itself.

The Microsoft Sentinel notebook's kernel runs on an Azure virtual machine (VM). Several licensing options exist to use more powerful virtual machines if your notebooks include complex machine learning models.

The Microsoft Sentinel notebooks use many popular Python libraries such as *pandas*, *matplotlib*, *bokeh*, and others. There are a great many other Python packages for you to choose from, covering areas such as:

- Visualizations and graphics
- Data processing and analysis
- Statistics and numerical computing
- Machine learning and deep learning

To avoid having to type or paste complex and repetitive code into notebook cells, most Python notebooks rely on third-party libraries called *packages*. To use a package in a notebook, you need to both install and import the package. Azure ML Compute has most common packages pre-installed. Make sure that you import the package, or the relevant part of the package, such as a module, file, function, or class.

Microsoft Sentinel notebooks use a Python package called [MSTICPy](https://github.com/Microsoft/msticpy/), which is a collection of cybersecurity tools for data retrieval, analysis, enrichment, and visualization. 

MSTICPy tools are designed specifically to help with creating notebooks for hunting and investigation and we're actively working on new features and improvements. For more information, see:

- [MSTIC Jupyter and Python Security Tools documentation](https://msticpy.readthedocs.io/)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Advanced configurations for Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebooks-msticpy-advanced.md)

The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks/) is the location for any future Microsoft Sentinel notebooks built by Microsoft or contributed from the community.

## Manage access to Microsoft Sentinel notebooks

To use Jupyter notebooks in Microsoft Sentinel, you must first have the right permissions, depending on your user role.

While you can run Microsoft Sentinel notebooks in JupyterLab or Jupyter classic, in Microsoft Sentinel, notebooks are run on an [Azure Machine Learning](../machine-learning/overview-what-is-azure-machine-learning.md) (Azure ML) platform. To run notebooks in Microsoft Sentinel, you must have appropriate access to both Microsoft Sentinel workspace and an [Azure ML workspace](../machine-learning/concept-workspace.md).

|Permission  |Description  |
|---------|---------|
|**Microsoft Sentinel permissions**     |   Like other Microsoft Sentinel resources, to access notebooks on Microsoft Sentinel Notebooks blade, a Microsoft Sentinel Reader, Microsoft Sentinel Responder, or Microsoft Sentinel Contributor role is required. <br><br>For more information, see [Permissions in Microsoft Sentinel](roles.md).|
|**Azure Machine Learning permissions**     | An Azure Machine Learning workspace is an Azure resource. Like other Azure resources, when a new Azure Machine Learning workspace is created, it comes with default roles. You can add users to the workspace and assign them to one of these built-in roles. For more information, see [Azure Machine Learning default roles](../machine-learning/how-to-assign-roles.md) and [Azure built-in roles](../role-based-access-control/built-in-roles.md). <br><br>   **Important**: Role access can be scoped to multiple levels in Azure. For example, someone with owner access to a workspace may not have owner access to the resource group that contains the workspace. For more information, see [How Azure RBAC works](../role-based-access-control/overview.md). <br><br>If you're an owner of an Azure ML workspace, you can add and remove roles for the workspace and assign roles to users. For more information, see:<br>    - [Azure portal](../role-based-access-control/role-assignments-portal.md)<br>    - [PowerShell](../role-based-access-control/role-assignments-powershell.md)<br>    - [Azure CLI](../role-based-access-control/role-assignments-cli.md)<br>   - [REST API](../role-based-access-control/role-assignments-rest.md)<br>    - [Azure Resource Manager templates](../role-based-access-control/role-assignments-template.md)<br> - [Azure Machine Learning CLI ](../machine-learning/how-to-assign-roles.md#manage-workspace-access)<br><br>If the built-in roles are insufficient, you can also create custom roles. Custom roles might have read, write, delete, and compute resource permissions in that workspace. You can make the role available at a specific workspace level, a specific resource group level, or a specific subscription level. For more information, see [Create custom role](../machine-learning/how-to-assign-roles.md#create-custom-role). |
|     |         |

## Create an Azure ML workspace from Microsoft Sentinel

This procedure describes how to create an Azure ML workspace from Microsoft Sentinel for your Microsoft Sentinel notebooks.

**To create your workspace**:

Select one of the following tabs, depending on whether you'll be using a public or private endpoint.

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
    | | |

1. On the **Networking** tab, select **Public endpoint (all networks)**.

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
    | | |

1. On the **Networking** tab, select **Private endpoint**. Make sure to use the same VNet as you have in the VM jump box. For example:

    :::image type="content" source="media/notebooks/create-private-endpoint.png" alt-text="Screenshot of the Create private endpoint page in Microsoft Sentinel." lightbox="media/notebooks/create-private-endpoint.png":::

1. Define any relevant settings in the **Advanced** or **Tags** tabs, and then select **Review + create**.

1. On the **Review + create** tab, review the information to verify that it's correct, and then select **Create** to start deploying your workspace. For example:

    :::image type="content" source="media/notebooks/machine-learning-create-last-step.png" alt-text="Review + create your Machine Learning workspace from Microsoft Sentinel.":::

    It can take several minutes to create your workspace in the cloud. During this time, the workspace **Overview** page shows the current deployment status, and updates when the deployment is complete.

1.	In the Azure Machine Learning studio, on the **Compute** page, create a new compute. On the **Advanced Settings** tab, make sure to select the same VNet that you'd used for your VM jump box. For more information, see [Create and manage an Azure Machine Learning compute instance](../machine-learning/how-to-create-manage-compute-instance.md?tabs=python).

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

> [!NOTE]
> You can view a notebook as a static document, such as in the GitHub built-in static notebook renderer. However, to run code in a notebook, you must attach the notebook to a backend process called a Jupyter kernel. The kernel runs the code and holds all the variables and objects the code creates. The browser is the viewer for this data.
>
> In Azure ML, the kernel runs on a virtual machine called an Azure ML Compute. The Compute instance can support running many notebooks at once.
>

**To launch your notebook from Microsoft Sentinel**:

1. From the Azure portal, navigate to **Microsoft Sentinel** > **Threat management** > **Notebooks**, where you can see notebooks that Microsoft Sentinel provides.

    > [!TIP]
    > At the top of the **Notebooks** page, select **Guides & Feedback** to show more resources and guidance in a pane on the right.

1. Select a notebook to view its description, required data types, and data sources.

    When you've found the notebook you want to use, select **Save notebook** to clone it into your own workspace.

    Edit the name as needed. If the notebook already exists in your workspace, you can overwrite the existing notebook or create a new one.

    :::image type="content" source="media/notebooks/save-notebook.png" alt-text="Save a notebook to clone it to your own workspace.":::

1. After the notebook is saved, the **Save notebook** button changes to **Launch notebook**. Select **Launch notebook** to open it in your AML workspace.

    For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-on-machine-learning.png" alt-text="Launch your notebook in your AML workspace.":::

1. At the top of the page, select a **Compute** instance to use for your notebook server.

    If you don't have a compute instance, [create a new one](../machine-learning/how-to-create-manage-compute-instance.md?tabs=#use-the-script-in-the-studio). If your compute instance is stopped, make sure to start it. For more information, see [Run a notebook in the Azure Machine Learning studio](../machine-learning/how-to-run-jupyter-notebooks.md).

    Only you can see and use the compute instances you create. Your user files are stored separately from the VM and are shared among all compute instances in the workspace.

    > [!TIP]
    > If you are creating a new compute instance in order to test your notebooks, create your compute instance with the **General Purpose** category.
    >
    > The kernel is also shown at the top right of your Azure ML window. If the kernel you need isn't selected, select a different version from the dropdown list.
    >

1. Once your notebook server is created and started, you can starting running your notebook cells. In each cell, select the **Run** icon to run your notebook code.

    For more information, see [Command mode shortcuts.](../machine-learning/how-to-run-jupyter-notebooks.md)

1. If your notebook hangs or you want to start over, you can restart the kernel and rerun the notebook cells from the beginning. Select **Kernel operations** > **Restart kernel**. For example:

    :::image type="content" source="media/notebooks/sentinel-notebooks-restart-kernel.png" alt-text="Restart a notebook kernel.":::

    > [!IMPORTANT]
    > Restarting the kernel wipes all variables and other state. You need to rerun any initialization and authentication cells after restarting.
    >

## Run code in your notebook

In a notebook:

- **Markdown** cells have text, including HTML, and static images.
- **Code** cells contain code. After you select a code cell, run the code in the cell by selecting the **Play** icon to the left of the cell, or by pressing **SHIFT+ENTER**.

> [!IMPORTANT]
> Always run notebook code cells in sequence. Skipping cells can result in errors.
>

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

## Troubleshooting

Usually, a notebook creates or attaches to a kernel seamlessly, and you don't need to make any manual changes. If you get errors, or the notebook doesn't seem to be running, you might need to check the version and state of the kernel.

If you run into issues with your notebooks, see the [Azure Machine Learning notebook troubleshooting](../machine-learning/how-to-run-jupyter-notebooks.md#troubleshooting).

### Force caching for user accounts and credentials between notebook runs

By default, user accounts and credentials are not cached between notebook runs, even for the same session.

**To force caching for the duration of your session**:

1. Authenticate using Azure CLI. In an empty notebook cell, enter and run the following code:

    ```python
    !az login
    ```

    The following output appears:

    ```python
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the 9-digit device code to authenticate.
    ```

1. Select and copy the nine-character token from the output, and select the `devicelogin` URL to go to the indicated page. 

1. Paste the token into the dialog and continue with signing in as prompted.

    When sign-in successfully completes, you see the following output:

    ```python
    Subscription <subscription ID> 'Sample subscription' can be accessed from tenants <tenant ID>(default) and <tenant ID>. To select a specific tenant when accessing this subscription, use 'az login --tenant TENANT_ID'.

> [!NOTE]
> The following tenants don't contain accessible subscriptions. Use 'az login --allow-no-subscriptions' to have tenant level access.
>
> ```
> <tenant ID> 'foo'
><tenant ID> 'bar'
>[
> {
>    "cloudName": "AzureApp",
>    "homeTenantId": "<tenant ID>",
>    "id": "<ID>",
>    "isDefault": true,
>    "managedByTenants": [
>    ....
>```
>
### Error: *Runtime dependency of PyGObject is missing*

If the *Runtime dependency of PyGObject is missing* error appears when you load a query provider, try troubleshooting using the following steps:

1. Proceed to the cell with the following code and run it:

    ```python
    qry_prov = QueryProvider("AzureSentinel")
    ```

    A warning similar to the following message is displayed, indicating a missing Python dependency (`pygobject`):

    ```output
    Runtime dependency of PyGObject is missing.

    Depends on your Linux distribution, you can install it by running code similar to the following:
    sudo apt install python3-gi python3-gi-cairo gir1.2-secret-1

    If necessary, see PyGObject's documentation: https://pygobject.readthedocs.io/en/latest/getting_started.html

    Traceback (most recent call last):
      File "/anaconda/envs/azureml_py36/lib/python3.6/site-packages/msal_extensions/libsecret.py", line 21, in <module>
    import gi  # https://github.com/AzureAD/microsoft-authentication-extensions-for-python/wiki/Encryption-on-Linux
    ModuleNotFoundError: No module named 'gi'
    ```

1. Use the [aml-compute-setup.sh](https://github.com/Azure/Azure-Sentinel-Notebooks/blob/master/HowTos/aml-compute-setup.sh) script, located in the Microsoft Sentinel Notebooks GitHub repository, to automatically install the `pygobject` in all notebooks and Anaconda environments on the Compute instance.

> [!TIP]
> You can also fix this Warning by running the following code from a notebook:
>
> ```python
> !conda install --yes -c conda-forge pygobject
> ```
>


## Next steps

Integrate your notebook experience with big data analytics in Azure Synapse. For more information, see [Integrate notebooks with Azure Synapse (Public preview)](notebooks-with-synapse.md).

Other notebooks shared in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks) are intended as useful tools, illustrations, and code samples that you can use when developing your own notebooks.

We welcome feedback, suggestions, requests for features, contributed notebooks, bug reports or improvements and additions to existing notebooks. Go to the [Microsoft Sentinel  GitHub repository](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.

- **Learn more** about using notebooks in threat hunting and investigation by exploring some notebook templates, such as [**Credential Scan on Azure Log Analytics**](https://www.youtube.com/watch?v=OWjXee8o04M) and **Guided Investigation - Process Alerts**.

    Find more notebook templates in the Microsoft Sentinel > **Notebooks** > **Templates** tab.

- **Find more notebooks** in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel-Notebooks):

  - The [`Sample-Notebooks`](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/Sample-Notebooks) directory includes sample notebooks that are saved with data that you can use to show intended output.

  - The [`HowTos`](https://github.com/Azure/Azure-Sentinel-Notebooks/tree/master/HowTos) directory includes notebooks that describe concepts such as setting your default Python version, creating Microsoft Sentinel bookmarks from a notebook, and more.

For more information, see:

- [Create your first Microsoft Sentinel notebook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/creating-your-first-microsoft-sentinel-notebook/ba-p/2977745) (Blog series)
- [Tutorial: Get started with Jupyter notebooks and MSTICPy in Microsoft Sentinel](notebook-get-started.md)
- [Tutorial: Microsoft Sentinel notebooks - Getting started](https://www.youtube.com/results?search_query=azazure+sentinel+notebooks) (Video)
- [Tutorial: Edit and run Jupyter notebooks without leaving Azure ML studio](https://www.youtube.com/watch?v=AAj-Fz0uCNk) (Video)
- [Webinar: Microsoft Sentinel notebooks fundamentals](https://www.youtube.com/watch?v=rewdNeX6H94)
- [Proactively hunt for threats](hunting.md)
- [Use bookmarks to save interesting information while hunting](bookmarks.md)
- [Jupyter, msticpy, and Microsoft Sentinel](https://msticpy.readthedocs.io/en/latest/getting_started/JupyterAndAzureSentinel.html)