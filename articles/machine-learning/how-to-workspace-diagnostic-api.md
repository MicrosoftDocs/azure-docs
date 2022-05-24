---
title: Workspace diagnostics
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning workspace diagnostics in the Azure portal or with the Python SDK.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 11/18/2021
ms.topic: how-to
ms.custom: sdkv1, event-tier1-build-2022
---

# How to use workspace diagnostics

Azure Machine Learning provides a diagnostic API that can be used to identify problems with your workspace. Errors returned in the diagnostics report include information on how to resolve the problem.

You can use the workspace diagnostics from the Azure Machine Learning studio or Python SDK.

## Prerequisites

* An Azure Machine learning workspace. If you don't have one, see [Create a workspace](quickstart-create-resources.md).
* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml).
## Diagnostics from studio

From [Azure Machine Learning studio](https://ml.azure.com) or the Python SDK, you can run diagnostics on your workspace to check your setup. To run diagnostics, select the '__?__' icon from the upper right corner of the page. Then select __Run workspace diagnostics__.

:::image type="content" source="./media/how-to-workspace-diagnostic-api/diagnostics.png" alt-text="Screenshot of the workspace diagnostics button":::

After diagnostics run, a list of any detected problems is returned. This list includes links to possible solutions.

## Diagnostics from Python

The following snippet demonstrates how to use workspace diagnostics from Python

[!INCLUDE [sdk v1](../../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Workspace

ws = Workspace.from_config()

diag_param = {
      "value": {
      }
    }

resp = ws.diagnose_workspace(diag_param)
print(resp)
```

The response is a JSON document that contains information on any problems detected with the workspace. The following JSON is an example response:

```json
{
    'value': {
        'user_defined_route_results': [], 
        'network_security_rule_results': [], 
        'resource_lock_results': [], 
        'dns_resolution_results': [{
            'code': 'CustomDnsInUse', 
            'level': 'Warning', 
            'message': "It is detected VNet '/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>' of private endpoint '/subscriptions/<subscription-id>/resourceGroups/larrygroup0916/providers/Microsoft.Network/privateEndpoints/<workspace-private-endpoint>' is not using Azure default dns. You need to configure your DNS server and check https://docs.microsoft.com/azure/machine-learning/how-to-custom-dns to make sure the custom dns is set up correctly."
        }], 
        'storage_account_results': [], 
        'key_vault_results': [], 
        'container_registry_results': [], 
        'application_insights_results': [], 
        'other_results': []
    }
}
```

If no problems are detected, an empty JSON document is returned.

For more information, see the [Workspace.diagnose_workspace()](/python/api/azureml-core/azureml.core.workspace(class)#diagnose-workspace-diagnose-parameters-) reference.

## Next steps

* [Workspace.diagnose_workspace()](/python/api/azureml-core/azureml.core.workspace(class)#diagnose-workspace-diagnose-parameters-)
* [How to manage workspaces in portal or SDK](how-to-manage-workspace.md)
