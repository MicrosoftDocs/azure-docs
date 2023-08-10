---
title: Deploy resources with Python and template
description: Use Azure Resource Manager and Python to deploy resources to Azure. The resources are defined in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 04/24/2023
ms.custom: devx-track-arm-template, devx-track-python
content_well_notification: 
  - AI-contribution
---

# Deploy resources with ARM templates and Python

This article explains how to use Python with Azure Resource Manager templates (ARM templates) to deploy your resources to Azure. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [template deployment overview](overview.md).

## Prerequisites

* A template to deploy. If you don't already have one, download and save an [example template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json) from the Azure Quickstart templates repo.

* Python 3.7 or later installed. To install the latest, see [Python.org](https://www.python.org/downloads/)

* The following Azure library packages for Python installed in your virtual environment. To install any of the packages, use `pip install {package-name}`
  * azure-identity
  * azure-mgmt-resource

  If you have older versions of these packages already installed in your virtual environment, you may need to update them with `pip install --upgrade {package-name}`

* The examples in this article use CLI-based authentication (`AzureCliCredential`). Depending on your environment, you may need to run `az login` first to authenticate.

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different methods.

* To deploy to a **resource group**, use [ResourceManagementClient.deployments.begin_create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update):

* To deploy to a **subscription**, use [ResourceManagementClient.deployments.begin_create_or_update_at_subscription_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update-at-subscription-scope):

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [ResourceManagementClient.deployments.begin_create_or_update_at_management_group_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update-at-management-group-scope).

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [ResourceManagementClient.deployments.begin_create_or_update_at_tenant_scope](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update-at-tenant-scope).

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the template must have the required permissions to create resources.

## Deployment name

When deploying an ARM template, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, the name of the template file is used. For example, if you deploy a template named `azuredeploy.json` and don't specify a deployment name, the deployment is named `azuredeploy`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number.

```python
import random

suffix = random.randint(1, 1000)
deployment_name = f"ExampleDeployment{suffix}"
```

Or, add a date value.

```python
from datetime import datetime

today = datetime.now().strftime("%m-%d-%Y")
deployment_name = f"ExampleDeployment{today}"
```

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage` that deploys a storage account named `storage2`, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and immediately after it completes you run another deployment named `newStorage` that deploys a storage account named `storage2`, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage2` that deploys a storage account named `storage2`, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Deploy local template

You can deploy a template from your local machine or one that is stored externally. This section describes deploying a local template.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.create_or_update(
    "exampleGroup",
    {
        "location": "Central US"
    }
)

print(f"Provisioned resource group with ID: {rg_result.id}")
```

To deploy an ARM template, use [ResourceManagementClient.deployments.begin_create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update). The following example requires a local template named `storage.json`.

```python
import os
import json
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

with open("storage.json", "r") as template_file:
    template_body = json.load(template_file)

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    "exampleGroup",
    "exampleDeployment",
    {
        "properties": {
            "template": template_body,
            "parameters": {
                "storagePrefix": {
                    "value": "demostore"
                },
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

The deployment can take several minutes to complete.

## Deploy remote template

Instead of storing ARM templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.create_or_update(
    "exampleGroup",
    {
        "location": "Central US"
    }
)

print(f"Provisioned resource group with ID: {rg_result.id}")
```

To deploy an ARM template, use [ResourceManagementClient.deployments.begin_create_or_update](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.deploymentsoperations#azure-mgmt-resource-resources-v2022-09-01-operations-deploymentsoperations-begin-create-or-update). The following example deploys a [remote template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.storage/storage-account-create). That template creates a storage account.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "exampleGroup"
location = "westus"
template_uri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json"

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    resource_group_name,
    "exampleDeployment",
    {
        "properties": {
            "templateLink": {
                "uri": template_uri
            },
            "parameters": {
                "location": {
                    "value": location
                }
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. If you keep your templates in a storage account that doesn't allow anonymous access, you need to provide a SAS token.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]
sas_token = os.environ["SAS_TOKEN"]

resource_client = ResourceManagementClient(credential, subscription_id)

resource_group_name = "exampleGroup"
location = "westus"
template_uri = f"https://stage20230425.blob.core.windows.net/templates/storage.json?{sas_token}"

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    resource_group_name,
    "exampleDeployment",
    {
        "properties": {
            "templateLink": {
                "uri": template_uri
            },
            "parameters": {
                "location": {
                    "value": location
                }
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

For more information, see [Use relative path for linked templates](./linked-templates.md#linked-template).

## Deploy template spec

Instead of deploying a local or remote template, you can create a [template spec](template-specs.md). The template spec is a resource in your Azure subscription that contains an ARM template. It makes it easy to securely share the template with users in your organization. You use Azure role-based access control (Azure RBAC) to grant access to the template spec.

The following examples show how to create and deploy a template spec.

First, create the template spec by providing the ARM template.

```python
import os
import json
from azure.identity import AzureCliCredential
from azure.mgmt.resource.templatespecs import TemplateSpecsClient
from azure.mgmt.resource.templatespecs.models import TemplateSpecVersion, TemplateSpec

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

template_specs_client = TemplateSpecsClient(credential, subscription_id)

template_spec = TemplateSpec(
    location="westus2",
    description="Storage Spec"
)

template_specs_client.template_specs.create_or_update(
    "templateSpecsRG",
    "storageSpec",
    template_spec
)

with open("storage.json", "r") as template_file:
    template_body = json.load(template_file)

version = TemplateSpecVersion(
    location="westus2",
    description="Storage Spec",
    main_template=template_body
)

template_spec_result = template_specs_client.template_spec_versions.create_or_update(
     "templateSpecsRG",
    "storageSpec",
    "1.0.0",
    version
)

print(f"Provisioned template spec with ID: {template_spec_result.id}")
```

Then, get the ID for template spec and deploy it.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource.resources.models import DeploymentMode
from azure.mgmt.resource.templatespecs import TemplateSpecsClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)
template_specs_client = TemplateSpecsClient(credential, subscription_id)

template_spec = template_specs_client.template_spec_versions.get(
    "templateSpecsRg",
    "storageSpec",
    "1.0.0"
)

rg_deployment_result = resource_client.deployments.begin_create_or_update(
    "exampleGroup",
    "exampleDeployment",
    {
        "properties": {
            "template_link": {
                "id": template_spec.id
            },
            "mode": DeploymentMode.incremental
        }
    }
)
```

For more information, see [Azure Resource Manager template specs](template-specs.md).

## Preview changes

Before deploying your template, you can preview the changes the template will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- For information about deploying a template that requires a SAS token, see [Deploy private ARM template with SAS token](secure-template-with-sas-token.md).
