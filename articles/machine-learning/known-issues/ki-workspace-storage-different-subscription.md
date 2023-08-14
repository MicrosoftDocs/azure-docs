---
title: Known issue - Workspace RP | Create workspace with bring your own storage scenario doesn't work in SDK V2 
description: Create workspace with bring your own storage scenario doesn't work in SDK V2
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Workspace RP | Create workspace with bring your own storage scenario doesn't work in SDK V2 


When following the document [Manage Azure Machine Learning workspaces in the portal or with the Python SDK (v2)](../how-to-manage-workspace.md) using a bring-your-own-storage scenario, the procedure fails if the storage is in a different subscription than the workspace.

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]


**Status:** Open

**Problem area:** Workspace RP

## Cause

This issue occurs when using the SDK(v2) to create a workspace with bring-your-own storage in a subscription different than the workspace subscription. An example is shown in the sample code from [Manage Azure Machine Learning workspaces in the portal or with the Python SDK (v2)](../how-to-manage-workspace.md)

```python
from azure.ai.ml
import MLClientfrom azure.identity
import DefaultAzureCredential
subscription_id = "<Sub id>" # ws sub
resource_group = "<RG name>"
ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
 
from azure.ai.ml.entities import Workspace
basic_ex_workspace_name = "<WS name>"
existing_storage_account = "/subscriptions/<sub id>/resourceGroups/richRG/providers/Microsoft.Storage/storageAccounts/<existing storage account>" # store from different sub
ws_with_existing_resources = Workspace(
    name=basic_ex_workspace_name,
    location="eastus",
    display_name="Bring your own dependent resources-example",
    description="This sample specifies a workspace configuration with existing dependent resources",
    storage_account=existing_storage_account,
    resource_group="<rg name>",
)
ws_with_existing_resources = ml_client.begin_create_or_update(
    ws_with_existing_resources).result()
print(ws_with_existing_resources)
```
If your storage is in a different subscription from your workspace, you'll receive the error:

```python
Unable to check existing role assignments on resource /subscriptions/,sub id of storage>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<existing storage>: The Resource 'Microsoft.Storage/storageAccounts/<existing storage>' under resource group '<rg>' was not found
```


## Solutions and workarounds
Currently SDK(v2) doesn't support creating a workspace with bring-your-own storage in another subscription. The code tries to look for storage in same subscription as the workspace.

A workaround is to use the API to create the workspace. The API doesn't have this limitation. The API can be found at [Create or update workspace](https://learn.microsoft.com/rest/api/azureml/2023-04-01/workspaces/create-or-update?tabs=HTTP)


## Next steps

- [About known issues](azureml-known-issues.md)
