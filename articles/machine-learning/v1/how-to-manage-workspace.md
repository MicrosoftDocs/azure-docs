---
title: Manage workspaces in portal or Python SDK (v1)
titleSuffix: Azure Machine Learning
description: Learn how to manage Azure Machine Learning workspaces in the Azure portal or with the SDK for Python (v1).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: sgilley
ms.date: 03/08/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, fasttrack-edit, FY21Q4-aml-seo-hack, contperf-fy21q4, sdkv1, event-tier1-build-2022, ignite-2022, devx-track-python
---

# Manage Azure Machine Learning workspaces with the Python SDK (v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you create, view, and delete [**Azure Machine Learning workspaces**](../concept-workspace.md) for [Azure Machine Learning](../overview-what-is-azure-machine-learning.md), using the [SDK for Python](/python/api/overview/azure/ml/).  

As your needs change or requirements for automation increase you can also manage workspaces [using the CLI](reference-azure-machine-learning-cli.md),  or [via the VS Code extension](../how-to-setup-vs-code.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* If using the Python SDK, [install the SDK](/python/api/overview/azure/ml/install).

## Limitations

[!INCLUDE [register-namespace](../includes/machine-learning-register-namespace.md)]

* By default, creating a workspace also creates an Azure Container Registry (ACR).  Since ACR doesn't currently support unicode characters in resource group names, use a resource group that doesn't contain these characters.

* Azure Machine Learning doesn't support hierarchical namespace (Azure Data Lake Storage Gen2 feature) for the workspace's default storage account.

[!INCLUDE [application-insight](../includes/machine-learning-application-insight.md)]

## Create a workspace

You can create a workspace [directly in Azure Machine Learning studio](../quickstart-create-resources.md#create-the-workspace), with limited options available. Or use one of the methods below for more control of options.

* **Default specification.** By default, dependent resources and the resource group will be created automatically. This code creates a workspace named `myworkspace` and a resource group named `myresourcegroup` in `eastus2`.
    
    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core import Workspace
    
    ws = Workspace.create(name='myworkspace',
                   subscription_id='<azure-subscription-id>',
                   resource_group='myresourcegroup',
                   create_resource_group=True,
                   location='eastus2'
                   )
    ```
    Set `create_resource_group` to False if you have an existing Azure resource group that you want to use for the workspace.

* **Multiple tenants.**  If you have multiple accounts, add the tenant ID of the Microsoft Entra ID you wish to use.  Find your tenant ID from the [Azure portal](https://portal.azure.com) under **Microsoft Entra ID, External Identities**.

    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core.authentication import InteractiveLoginAuthentication
    from azureml.core import Workspace
    
    interactive_auth = InteractiveLoginAuthentication(tenant_id="my-tenant-id")
    ws = Workspace.create(name='myworkspace',
                subscription_id='<azure-subscription-id>',
                resource_group='myresourcegroup',
                create_resource_group=True,
                location='eastus2',
                auth=interactive_auth
                )
    ```

* **[Sovereign cloud](../reference-machine-learning-cloud-parity.md)**. You'll need extra code to authenticate to Azure if you're working in a sovereign cloud.
    
    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core.authentication import InteractiveLoginAuthentication
    from azureml.core import Workspace
    
    interactive_auth = InteractiveLoginAuthentication(cloud="<cloud name>") # for example, cloud="AzureUSGovernment"
    ws = Workspace.create(name='myworkspace',
                subscription_id='<azure-subscription-id>',
                resource_group='myresourcegroup',
                create_resource_group=True,
                location='eastus2',
                auth=interactive_auth
                )
    ```

* **Use existing Azure resources**.  You can also create a workspace that uses existing Azure resources with the Azure resource ID format. Find the specific Azure resource IDs in the Azure portal or with the SDK. This example assumes that the resource group, storage account, key vault, App Insights, and container registry already exist.
    
    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

   ```python
   import os
   from azureml.core import Workspace
   from azureml.core.authentication import ServicePrincipalAuthentication

   service_principal_password = os.environ.get("AZUREML_PASSWORD")

   service_principal_auth = ServicePrincipalAuthentication(
      tenant_id="<tenant-id>",
      username="<application-id>",
      password=service_principal_password)

                        auth=service_principal_auth,
                             subscription_id='<azure-subscription-id>',
                             resource_group='myresourcegroup',
                             create_resource_group=False,
                             location='eastus2',
                             friendly_name='My workspace',
                             storage_account='subscriptions/<azure-subscription-id>/resourcegroups/myresourcegroup/providers/microsoft.storage/storageaccounts/mystorageaccount',
                             key_vault='subscriptions/<azure-subscription-id>/resourcegroups/myresourcegroup/providers/microsoft.keyvault/vaults/mykeyvault',
                             app_insights='subscriptions/<azure-subscription-id>/resourcegroups/myresourcegroup/providers/microsoft.insights/components/myappinsights',
                             container_registry='subscriptions/<azure-subscription-id>/resourcegroups/myresourcegroup/providers/microsoft.containerregistry/registries/mycontainerregistry',
                             exist_ok=False)
   ```

For more information, see [Workspace SDK reference](/python/api/azureml-core/azureml.core.workspace.workspace).

If you have problems in accessing your subscription, see [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md), as well as the [Authentication in Azure Machine Learning](https://aka.ms/aml-notebook-auth) notebook.


### Networking    

> [!IMPORTANT]    
> For more information on using a private endpoint and virtual network with your workspace, see [Network isolation and privacy](../how-to-network-security-overview.md).


The Azure Machine Learning Python SDK provides the [PrivateEndpointConfig](/python/api/azureml-core/azureml.core.privateendpointconfig) class, which can be used with [Workspace.create()](/python/api/azureml-core/azureml.core.workspace.workspace#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---tags-none--friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--adb-workspace-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--private-endpoint-config-none--private-endpoint-auto-approval-true--exist-ok-false--show-output-true-) to create a workspace with a private endpoint. This class requires an existing virtual network.


### Advanced

By default, metadata for the workspace is stored in an Azure Cosmos DB instance that Microsoft maintains. This data is encrypted using Microsoft-managed keys.

To limit the data that Microsoft collects on your workspace, select __High business impact workspace__ in the portal, or set `hbi_workspace=true ` in Python. For more information on this setting, see [Encryption at rest](../concept-data-encryption.md#encryption-at-rest).

> [!IMPORTANT]    
> Selecting high business impact can only be done when creating a workspace. You cannot change this setting after workspace creation.    

#### Use your own data encryption key

You can provide your own key for data encryption. Doing so creates the Azure Cosmos DB instance that stores metadata in your Azure subscription. For more information, see [Customer-managed keys for Azure Machine Learning](../concept-customer-managed-keys.md).

Use the following steps to provide your own key:

> [!IMPORTANT]    
> Before following these steps, you must first perform the following actions:    
>
> Follow the steps in [Configure customer-managed keys](../how-to-setup-customer-managed-keys.md) to:
> * Register the Azure Cosmos DB provider
> * Create and configure an Azure Key Vault
> * Generate a key

Use `cmk_keyvault` and `resource_cmk_uri` to specify the customer managed key.

```python
from azureml.core import Workspace
   ws = Workspace.create(name='myworkspace',
               subscription_id='<azure-subscription-id>',
               resource_group='myresourcegroup',
               create_resource_group=True,
               location='eastus2'
               cmk_keyvault='subscriptions/<azure-subscription-id>/resourcegroups/myresourcegroup/providers/microsoft.keyvault/vaults/<keyvault-name>', 
               resource_cmk_uri='<key-identifier>'
               )

```

### Download a configuration file

If you'll be using a [compute instance](../quickstart-create-resources.md) in your workspace to run your code, skip this step.  The compute instance will create and store a copy of this file for you.

If you plan to use code on your local environment that references this workspace (`ws`), write the configuration file:
    
[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
ws.write_config()
```

Place the file into  the directory structure with your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *.azureml*, or in a parent directory. When you create a compute instance, this file is added to the correct directory on the VM for you.

## Connect to a workspace

In your Python code, you create a workspace object to connect to your workspace.  This code will read the contents of the configuration file to find your workspace.  You'll get a prompt to sign in if you aren't already authenticated.
    
[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Workspace

ws = Workspace.from_config()
```

* **Multiple tenants.**  If you have multiple accounts, add the tenant ID of the Microsoft Entra ID you wish to use.  Find your tenant ID from the [Azure portal](https://portal.azure.com) under **Microsoft Entra ID, External Identities**.
    
    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core.authentication import InteractiveLoginAuthentication
    from azureml.core import Workspace
    
    interactive_auth = InteractiveLoginAuthentication(tenant_id="my-tenant-id")
    ws = Workspace.from_config(auth=interactive_auth)
    ```

* **[Sovereign cloud](../reference-machine-learning-cloud-parity.md)**. You'll need extra code to authenticate to Azure if you're working in a sovereign cloud.

   [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core.authentication import InteractiveLoginAuthentication
    from azureml.core import Workspace
    
    interactive_auth = InteractiveLoginAuthentication(cloud="<cloud name>") # for example, cloud="AzureUSGovernment"
    ws = Workspace.from_config(auth=interactive_auth)
    ```
    
If you have problems in accessing your subscription, see [Set up authentication for Azure Machine Learning resources and workflows](../how-to-setup-authentication.md), as well as the [Authentication in Azure Machine Learning](https://aka.ms/aml-notebook-auth) notebook.

## Find a workspace

See a list of all the workspaces you can use.

Find your subscriptions in the [Subscriptions page in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Copy the ID and use it in the code below to see all workspaces available for that subscription.

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Workspace

Workspace.list('<subscription-id>')
```

The Workspace.list(..) method doesn't return the full workspace object. It includes only basic information about existing workspaces in the subscription. To get a full object for specific workspace, use Workspace.get(..).


## Delete a workspace

When you no longer need a workspace, delete it.  

[!INCLUDE [machine-learning-delete-workspace](../includes/machine-learning-delete-workspace.md)]

> [!TIP]
> The default behavior for Azure Machine Learning is to _soft delete_ the workspace. This means that the workspace is not immediately deleted, but instead is marked for deletion. For more information, see [Soft delete](../concept-soft-delete.md).


Delete the workspace `ws`:
    
[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
ws.delete(delete_dependent_resources=False, no_wait=False)
```

The default action isn't to delete resources associated with the workspace, that is, container registry, storage account, key vault, and application insights.  Set `delete_dependent_resources` to True to delete these resources as well.


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../includes/aml-delete-resource-group.md)]

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

[!INCLUDE [machine-learning-workspace-diagnostics](../includes/machine-learning-workspace-diagnostics.md)]

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../includes/machine-learning-resource-provider.md)]
 

### Deleting the Azure Container Registry

The Azure Machine Learning workspace uses Azure Container Registry (ACR) for some operations. It will automatically create an ACR instance when it first needs one.

[!INCLUDE [machine-learning-delete-acr](../includes/machine-learning-delete-acr.md)]


## Next steps

Once you have a workspace, learn how to [Train and deploy a model](tutorial-train-deploy-notebook.md).

To learn more about planning a workspace for your organization's requirements, see [Organize and set up Azure Machine Learning](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-resource-organization).

* If you need to move a workspace to another Azure subscription, see [How to move a workspace](../how-to-move-workspace.md).

* To find a workspace, see [Search for Azure Machine Learning assets (preview)](../how-to-search-assets.md).

For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](../concept-vulnerability-management.md).
