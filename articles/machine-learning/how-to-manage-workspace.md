---
title: Manage workspaces in portal or Python SDK (v2)
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning workspaces in the Azure portal or with the SDK for Python (v2).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: sgilley
ms.date: 09/21/2022
ms.topic: how-to
ms.custom: fasttrack-edit, FY21Q4-aml-seo-hack, contperf-fy21q4, sdkv2, event-tier1-build-2022, ignite-2022, devx-track-python
---

# Manage Azure Machine Learning workspaces in the portal or with the Python SDK (v2)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]


In this article, you create, view, and delete [**Azure Machine Learning workspaces**](concept-workspace.md) for [Azure Machine Learning](overview-what-is-azure-machine-learning.md), using the [Azure portal](https://portal.azure.com) or the [SDK for Python](https://aka.ms/sdk-v2-install).  

As your needs change or requirements for automation increase you can also manage workspaces [using the CLI](how-to-manage-workspace-cli.md), [Azure PowerShell](how-to-manage-workspace-powershell.md),  or [via the VS Code extension](how-to-setup-vs-code.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* If using the Python SDK: 
   1. [Install the SDK v2](https://aka.ms/sdk-v2-install).
   1. Install azure-identity: `pip install azure-identity`.  If in a notebook cell, use `%pip install azure-identity`.
   1. Provide your subscription details

      [!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=subscription_id)]

   1. Get a handle to the subscription.  `ml_client` is used in all the Python code in this article.

      [!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=ml_client)]
      
        * (Optional) If you have multiple accounts, add the tenant ID of the Azure Active Directory you wish to use into the `DefaultAzureCredential`. Find your tenant ID from the [Azure portal](https://portal.azure.com) under **Azure Active Directory, External Identities**.
                
            ```python
            DefaultAzureCredential(interactive_browser_tenant_id="<TENANT_ID>")
            ```
                
        * (Optional) If you're working on a [sovereign cloud](reference-machine-learning-cloud-parity.md), specify the sovereign cloud to authenticate with into the `DefaultAzureCredential`..
                
            ```python
            from azure.identity import AzureAuthorityHosts
            DefaultAzureCredential(authority=AzureAuthorityHosts.AZURE_GOVERNMENT))
            ```

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

* When you use network isolation that is based on a workspace's managed virtual network with a deployment, you can use resources (Azure Container Registry (ACR), Storage account, Key Vault, and Application Insights) from a different resource group or subscription than that of your workspace. However, these resources must belong to the same tenant as your workspace. For limitations that apply to securing managed online endpoints using a workspace's managed virtual network, see [Network isolation with managed online endpoints](concept-secure-online-endpoint.md#limitations).

* By default, creating a workspace also creates an Azure Container Registry (ACR).  Since ACR doesn't currently support unicode characters in resource group names, use a resource group that doesn't contain these characters.

* Azure Machine Learning doesn't support hierarchical namespace (Azure Data Lake Storage Gen2 feature) for the workspace's default storage account.

[!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

## Create a workspace

You can create a workspace [directly in Azure Machine Learning studio](./quickstart-create-resources.md#create-the-workspace), with limited options available. Or use one of the following methods for more control of options.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

* **Default specification.** By default, dependent resources and the resource group are created automatically. This code creates a workspace named `myworkspace` and a resource group named `myresourcegroup` in `eastus2`.
    
   [!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=basic_workspace_name)]

* **Use existing Azure resources**.  You can also create a workspace that uses existing Azure resources with the Azure resource ID format. Find the specific Azure resource IDs in the Azure portal or with the SDK. This example assumes that the resource group, storage account, key vault, App Insights, and container registry already exist.

   [!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=basic_ex_workspace_name)]

For more information, see [Workspace SDK reference](/python/api/azure-ai-ml/azure.ai.ml.entities.workspace).

If you have problems in accessing your subscription, see [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md), and the [Authentication in Azure Machine Learning](https://aka.ms/aml-notebook-auth) notebook.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription. 

1. In the upper-left corner of Azure portal, select **+ Create a resource**.

    :::image type="content" source="media/how-to-manage-workspace/create-workspace.gif" alt-text="Screenshot show how to create a  workspace in Azure portal.":::

1. Use the search bar to find **Machine Learning**.

1. Select **Machine Learning**.

1. In the **Machine Learning** pane, select **Create** to begin.

1. Provide the following information to configure your new workspace:

   Field|Description 
   ---|---
   Workspace name |Enter a unique name that identifies your workspace. In this example, we use **docs-ws**. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others. The workspace name is case-insensitive.
   Subscription |Select the Azure subscription that you want to use.
   Resource group | Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution. In this example, we use **docs-aml**. You need *contributor* or *owner* role to use an existing resource group.  For more information about access, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).
   Region | Select the Azure region closest to your users and the data resources to create your workspace.
   | Storage account | The default storage account for the workspace. By default, a new one is created. |
   | Key Vault | The Azure Key Vault used by the workspace. By default, a new one is created. |
   | Application Insights | The application insights instance for the workspace. By default, a new one is created. |
   | Container Registry | The Azure Container Registry for the workspace. By default, a new one isn't_ initially created for the workspace. Instead, it's created once you need it when creating a Docker image during training or deployment. |

   :::image type="content" source="media/how-to-manage-workspace/create-workspace-form.png" alt-text="Configure your workspace.":::

1. When you're finished configuring the workspace, select **Review + Create**. Optionally, use the [Networking](#networking), [Advanced](#advanced), and  [Tags](#tags) sections to configure more settings for the workspace.

1. Review the settings and make any other changes or corrections. When you're satisfied with the settings, select **Create**.

   > [!Warning] 
   > It can take several minutes to create your workspace in the cloud.

   When the process is finished, a deployment success message appears. 
 
 1. To view the new workspace, select **Go to resource**.
 
---

### Networking    

> [!IMPORTANT]    
> For more information on using a private endpoint and virtual network with your workspace, see [Network isolation and privacy](how-to-network-security-overview.md).


# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=basic_private_link_workspace_name)]
 
This class requires an existing virtual network.

# [Portal](#tab/azure-portal)

1. The default network configuration is to use a __Public endpoint__, which is accessible on the public internet. To limit access to your workspace to an Azure Virtual Network you've created, you can instead select __Private endpoint__ as the __Connectivity method__, and then use __+ Add__ to configure the endpoint.    

   :::image type="content" source="media/how-to-manage-workspace/select-private-endpoint.png" alt-text="Private endpoint selection":::    

1. On the __Create private endpoint__ form, set the location, name, and virtual network to use. If you'd like to use the endpoint with a Private DNS Zone, select __Integrate with private DNS zone__ and select the zone using the __Private DNS Zone__ field. Select __OK__ to create the endpoint.     

   :::image type="content" source="media/how-to-manage-workspace/create-private-endpoint.png" alt-text="Private endpoint creation":::    

1. When you're finished configuring networking, you can select __Review + Create__, or advance to the optional __Advanced__ configuration.

---

### Advanced

By default, metadata for the workspace is stored in an Azure Cosmos DB instance that Microsoft maintains. This data is encrypted using Microsoft-managed keys.

To limit the data that Microsoft collects on your workspace, select __High business impact workspace__ in the portal, or set `hbi_workspace=true ` in Python. For more information on this setting, see [Encryption at rest](concept-data-encryption.md#encryption-at-rest).

> [!IMPORTANT]    
> Selecting high business impact can only be done when creating a workspace. You cannot change this setting after workspace creation.

#### Use your own data encryption key

You can provide your own key for data encryption. Doing so creates the Azure Cosmos DB instance that stores metadata in your Azure subscription. For more information, see [Customer-managed keys](concept-customer-managed-keys.md).

Use the following steps to provide your own key:

> [!IMPORTANT]    
> Before following these steps, you must first perform the following actions:
>
> Follow the steps in [Configure customer-managed keys](how-to-setup-customer-managed-keys.md) to:
>
> * Register the Azure Cosmos DB provider
> * Create and configure an Azure Key Vault
> * Generate a key

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python

from azure.ai.ml.entities import Workspace, CustomerManagedKey

# specify the workspace details
ws = Workspace(
    name="my_workspace",
    location="eastus",
    display_name="My workspace",
    description="This example shows how to create a workspace",
    customer_managed_key=CustomerManagedKey(
        key_vault="/subscriptions/<SUBSCRIPTION_ID>/resourcegroups/<RESOURCE_GROUP>/providers/microsoft.keyvault/vaults/<VAULT_NAME>"
        key_uri="<KEY-IDENTIFIER>"
    )
    tags=dict(purpose="demo")
)

ml_client.workspaces.begin_create(ws)
```

# [Portal](#tab/azure-portal)

1. Select __Customer-managed keys__, and then select __Click to select key__.

    :::image type="content" source="media/how-to-manage-workspace/advanced-workspace.png" alt-text="Customer-managed keys":::

1. On the __Select key from Azure Key Vault__ form, select an existing Azure Key Vault, a key that it contains, and the version of the key. This key is used to encrypt the data stored in Azure Cosmos DB. Finally, use the __Select__ button to use this key.

   :::image type="content" source="media/how-to-manage-workspace/select-key-vault.png" alt-text="Select the key":::

---

### Tags

While using a workspace, you have opportunities to provide feedback about Azure Machine Learning.  You provide feedback by using:

* Occasional in-product surveys
* The smile-frown feedback tool in the banner of the workspace

You can turn off all feedback opportunities for a workspace.  When off, users of the workspace won't see any surveys, and the smile-frown feedback tool is no longer visible. Use the Azure portal to turn off feedback.

* When creating the workspace, turn off feedback from the **Tags** section:

   1. Select the **Tags** section
   1. Add the key value pair "ADMIN_HIDE_SURVEY: TRUE"

* Turn off feedback on an existing workspace:

   1. Go to workspace resource in the Azure portal
   1. Open **Tags** from left navigation panel
   1. Add the key value pair "ADMIN_HIDE_SURVEY: TRUE"
   1. Select **Apply**.  

:::image type="content" source="media/how-to-manage-workspace/tags.png" alt-text="Screenshot shows setting tags to prevent feedback in the workspace.":::

### Download a configuration file

If you'll be running your code on a [compute instance](quickstart-create-resources.md), skip this step.  The compute instance creates and stores copy of this file for you.

If you plan to use code on your local environment that references this workspace, download the file:
1. Select your workspace in [Azure studio](https://ml.azure.com)
1. At the top right, select the workspace name, then select  **Download config.json**

   ![Download config.json](./media/how-to-manage-workspace/configure.png)

Place the file into  the directory structure with your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *.azureml*, or in a parent directory. When you create a compute instance, this file is added to the correct directory on the VM for you.

## Connect to a workspace

When running machine learning tasks using the SDK, you require a MLClient object that specifies the connection to your workspace. You can create an `MLClient` object from parameters, or with a configuration file.

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

* **With a configuration file:** This code reads the contents of the configuration file to find your workspace.  You'll get a prompt to sign in if you aren't already authenticated.

    ```python
    from azure.ai.ml import MLClient
    
    # read the config from the current directory
    ws_from_config = MLClient.from_config()
    ```
* **From parameters**: There's no need to have a config.json file available if you use this approach.
    
    [!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=ws)]

If you have problems in accessing your subscription, see [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md), and the [Authentication in Azure Machine Learning](https://aka.ms/aml-notebook-auth) notebook.

## Find a workspace

See a list of all the workspaces you can use.  
You can also search for workspace inside studio.  See [Search for Azure Machine Learning assets (preview)](how-to-search-assets.md).


# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=my_ml_client)]
[!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=ws_name)]

To get details of a specific workspace:

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/workspace/workspace.ipynb?name=ws_location)]


# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the top search field, type **Machine Learning**.  

1. Select **Machine Learning**.

   ![Search for Azure Machine Learning workspace](./media/how-to-manage-workspace/find-workspaces.png)

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.  

1. Select a workspace to display its properties.

---


## Delete a workspace

When you no longer need a workspace, delete it.  

[!INCLUDE [machine-learning-delete-workspace](includes/machine-learning-delete-workspace.md)]

> [!TIP]
> The default behavior for Azure Machine Learning is to _soft delete_ the workspace. This means that the workspace is not immediately deleted, but instead is marked for deletion. For more information, see [Soft delete](./concept-soft-delete.md).

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
ml_client.workspaces.begin_delete(name=ws_basic.name, delete_dependent_resources=True)
```

The default action isn't to delete resources associated with the workspace, that is, container registry, storage account, key vault, and application insights.  Set `delete_dependent_resources` to True to delete these resources as well.

# [Portal](#tab/azure-portal)

In the [Azure portal](https://portal.azure.com/), select **Delete**  at the top of the workspace you wish to delete.

:::image type="content" source="./media/how-to-manage-workspace/delete-workspace.png" alt-text="Delete workspace":::

---

## Clean up resources

[!INCLUDE [aml-delete-resource-group](includes/aml-delete-resource-group.md)]

## Troubleshooting

* **Supported browsers in Azure Machine Learning studio**: We recommend that you use the most up-to-date browser that's compatible with your operating system. The following browsers are supported:
  * Microsoft Edge (The new Microsoft Edge, latest version. Not Microsoft Edge legacy)
  * Safari (latest version, Mac only)
  * Chrome (latest version)
  * Firefox (latest version)

* **Azure portal**: 
  * If you go directly to your workspace from a share link from the SDK or the Azure portal, you can't view the standard **Overview** page that has subscription information in the extension. In this scenario, you also can't switch to another workspace. To view another workspace, go directly to [Azure Machine Learning studio](https://ml.azure.com) and search for the workspace name.
  * All assets (Data, Experiments, Computes, and so on) are available only in [Azure Machine Learning studio](https://ml.azure.com). They're *not* available from the Azure portal.
  * Attempting to export a template for a workspace from the Azure portal may return an error similar to the following text: `Could not get resource of the type <type>. Resources of this type will not be exported.` As a workaround, use one of the templates provided at [https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.machinelearningservices) as the basis for your template.

### Workspace diagnostics

[!INCLUDE [machine-learning-workspace-diagnostics](includes/machine-learning-workspace-diagnostics.md)]

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]
 

### Deleting the Azure Container Registry

The Azure Machine Learning workspace uses Azure Container Registry (ACR) for some operations. It automatically creates an ACR instance when it first needs one.

[!INCLUDE [machine-learning-delete-acr](includes/machine-learning-delete-acr.md)]

## Examples

Examples in this article come from [workspace.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/resources/workspace/workspace.ipynb).

## Next steps

Once you have a workspace, learn how to [Train and deploy a model](tutorial-train-deploy-notebook.md).

To learn more about planning a workspace for your organization's requirements, see [Organize and set up Azure Machine Learning](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-resource-organization).

* If you need to move a workspace to another Azure subscription, see [How to move a workspace](how-to-move-workspace.md).



For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
