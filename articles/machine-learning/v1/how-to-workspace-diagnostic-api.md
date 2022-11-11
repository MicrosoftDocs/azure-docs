---
title: Workspace diagnostics (v1)
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning workspace diagnostics with the Python SDK v1.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/14/2022
ms.topic: how-to
ms.custom: sdkv1, event-tier1-build-2022
---

# How to use workspace diagnostics (SDK v1)

[!INCLUDE [sdk v1](../../../includes/machine-learning-sdk-v1.md)]
> [!div class="op_single_selector" title1="Select the version of the Azure Machine Learning Python SDK you are using:"]
> * [v1](how-to-workspace-diagnostic-api.md)
> * [v2 (current version)](../how-to-workspace-diagnostic-api.md)

Azure Machine Learning provides a diagnostic API that can be used to identify problems with your workspace. Errors returned in the diagnostics report include information on how to resolve the problem.

In this article, learn how to use the workspace diagnostics from the Azure Machine Learning Python SDK v1.

## Prerequisites

* An Azure Machine learning workspace. If you don't have one, see [Create a workspace](../quickstart-create-resources.md).
* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml).

## Diagnostics from Python

The following snippet demonstrates how to use workspace diagnostics from Python

[!INCLUDE [sdk v1](../../../includes/machine-learning-sdk-v1.md)]

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
    "value": {
        "user_defined_route_results": [], 
        "network_security_rule_results": [], 
        "resource_lock_results": [], 
        "dns_resolution_results": [{
            "code": "CustomDnsInUse", 
            "level": "Warning", 
            "message": "It is detected VNet '/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>' of private endpoint '/subscriptions/<subscription-id>/resourceGroups/larrygroup0916/providers/Microsoft.Network/privateEndpoints/<workspace-private-endpoint>' is not using Azure default DNS. You need to configure your DNS server and check https://learn.microsoft.com/azure/machine-learning/how-to-custom-dns to make sure the custom DNS is set up correctly."
        }], 
        "storage_account_results": [], 
        "key_vault_results": [], 
        "container_registry_results": [], 
        "application_insights_results": [], 
        "other_results": []
    }
}
```

If no problems are detected, an empty JSON document is returned.

For more information, see the [Workspace.diagnose_workspace()](/python/api/azureml-core/azureml.core.workspace(class)#diagnose-workspace-diagnose-parameters-) reference.

## Next steps

* [Workspace.diagnose_workspace()](/python/api/azureml-core/azureml.core.workspace(class)#diagnose-workspace-diagnose-parameters-)
* [How to manage workspaces in portal or SDK](../how-to-manage-workspace.md)
