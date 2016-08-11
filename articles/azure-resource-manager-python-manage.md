<properties
   pageTitle="Manage Azure Resources and Resource Groups using the Python SDK for Azure | Microsoft Azure"
   description="Describes how to use the Python SDK for Azure to manage resources and resource groups on Azure."
   services="azure-resource-manager"
   documentationCenter="python"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="python"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/11/2016"
   ms.author="allclark"/>

# Manage resources using the Python SDK

This sample explains how to manage your
[resources and resource groups in Azure](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/#resource-groups)
using the Azure Python SDK.

## Run this sample

1. If you don't already have it, [install Python](https://www.python.org/downloads/).

1. We recommend using a [virtual environment](https://docs.python.org/3/tutorial/venv.html) to run this example, but it's not mandatory. You can initialize a virtualenv this way:

    ```
    pip install virtualenv
    virtualenv mytestenv
    cd mytestenv
    source bin/activate
    ```

1. Clone the repository.

    ```
    git clone https://github.com/Azure-Samples/resource-manager-python-resources-and-groups.git
    ```

1. Install the dependencies using pip.

    ```
    cd resource-manager-python-resources-and-groups
    pip install -r requirements.txt
    ```

1. Create an Azure service principal either through
    [Azure CLI](resource-group-authenticate-service-principal-cli.md),
    [PowerShell](resource-group-authenticate-service-principal.md),
    or [the portal](resource-group-create-service-principal-portal.md).

1. Export these environment variables into your current shell. 

    ```
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    ```

1. Run the sample.

    ```
    python example.py
    ```

## What is example.py doing?

The sample walks you through several resource and resource group management operations.
It starts by setting up a ResourceManagementClient object using your subscription and credentials.

```python
import os
from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt.resource import ResourceManagementClient

subscription_id = os.environ.get(
    'AZURE_SUBSCRIPTION_ID',
    '11111111-1111-1111-1111-111111111111') # your Azure Subscription Id
credentials = ServicePrincipalCredentials(
    client_id=os.environ['AZURE_CLIENT_ID'],
    secret=os.environ['AZURE_CLIENT_SECRET'],
    tenant=os.environ['AZURE_TENANT_ID']
)
client = ResourceManagementClient(credentials, subscription_id)
```

It also sets up a ResourceGroup object (resource_group_params) to be used as a parameter in some of the API calls.

```python
resource_group_params = {'location':'westus'}
```

There are a couple of supporting functions (`print_item` and `print_properties`) that print a resource group and its properties.
With that set up, the sample lists all resource groups for your subscription, it performs these operations.

### List resource groups

List the resource groups in your subscription.

```python
for item in client.resource_groups.list():
    print_item(item)
```

### Create a resource group

```python
client.resource_groups.create_or_update('azure-sample-group', resource_group_params)
```

### Update a resource group

The sample adds a tag to the resource group.

```python
resource_group_params.update(tags={'hello': 'world'})
client.resource_groups.create_or_update('azure-sample-group', resource_group_params)
```

### Create a key vault in the resource group

```python
key_vault_params = {
    'location': 'westus',
    'properties':  {
        'sku': {'family': 'A', 'name': 'standard'},
        'tenantId': os.environ['AZURE_TENANT_ID'],
        'accessPolicies': [],
        'enabledForDeployment': True,
        'enabledForTemplateDeployment': True,
        'enabledForDiskEncryption': True
    }
}
client.resources.create_or_update(GROUP_NAME,
                                  'Microsoft.KeyVault',
                                  '',
                                  'vaults',
                                  'azureSampleVault',
                                  '2015-06-01',
                                  key_vault_params)
```

### List resources within the group

```python
for item in client.resource_groups.list_resources(GROUP_NAME):
    print_item(item)
```

### Export the resource group template

```python
client.resource_groups.export_template(GROUP_NAME, ['*'])
```

### Delete a resource group

```python
delete_async_operation = client.resource_groups.delete('azure-sample-group')
delete_async_operation.wait()
```

## More information

[AZURE.INCLUDE [azure-code-samples-closer](../includes/azure-code-samples-closer.md)]
