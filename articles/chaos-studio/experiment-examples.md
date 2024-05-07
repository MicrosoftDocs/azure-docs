---
title: Azure CLI & Portal Example Experiments
description: See real examples of creating various chaos experiments in the Azure Portal and CLI. 
services: chaos-studio
author: nikhilkaul-msft
ms.topic: template-how-to
ms.date: 05/07/2024
ms.author: abbyweisberg
ms.reviewer: nikhilkaul
ms.service: chaos-studio
ms.custom: build-spring-2024
---

# Example Experiments

This article provides examples for creating experiments from your command line (CLI) and Azure Portal paramater examples for various experiments. You can copy and paste these, and edit them for your specific resources. 

Here is an example of where you would copy and paste the Azure portal parameter into:

[![Screenshot that shows Azure Portal parameter location.](images/azure-portal-parameter-examples.png)](images/azure-portal-parameter-examples#lightbox)

**NOTE** Make sure your experiment has permission to operate on **ALL** resources within the experiment. These examples exclusively use **System-assigned managed identity**, but we also support User-assigned managed identity. See [Experiment Permissions](chaos-studio-permissions-security.md) for more details. 
<br>
<br>
View all available role assignments [here](chaos-studio-fault-providers.md) to determine which permissions are required for your target resources. 

---
AKS Network Delay
---

### [Azure CLI](#tab/azure-CLI)
```AzCLI
PUT https://management.azure.com/subscriptions/6b052e15-03d3-4f17-b2e1-be7f07588291/resourceGroups/exampleRG/providers/Microsoft.Chaos/experiments/exampleExperiment?api-version=2024-01-01

{    

"identity": {
        "type": "SystemAssigned",
        "principalId": "30c2470a-6ea3-4a88-b5d5-8ed0d3f2fc88",
        "tenantId": "b3ec07c5-5aee-49dd-8cc4-9c1b33c915ec"
    },
    "tags": {},
    "location": "westus",
    "properties": {
        "provisioningState": "Succeeded",
        "selectors": [
            {
                "type": "List",
                "targets": [
                    {
                        "id": "/subscriptions/12c6a2e4-2fdb-4eb9-8376-81992d7e76ca/resourceGroups/aks_pod_kill_experiment/providers/Microsoft.ContainerService/managedClusters/nikhilAKScluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh",
                        "type": "ChaosTarget"
                    }
                ],
                "id": "Selector1"
            }
        ],
        "steps": [
            {
                "name": "AKS pod kill",
                "branches": [
                    {
                        "name": "AKS pod kill",
                        "actions": [
                            {
                                "type": "continuous",
                                "selectorId": "Selector1",
                                "duration": "PT5M",
                                "parameters": [
                                    {
                                        "key": "jsonSpec",
                                        "value": "{\"action\":\"delay\",\"mode\":\"all\",\"selector\":{\"namespaces\":[\"default\"]},\"delay\":{\"latency\":\"200ms\",\"correlation\":\"100\",\"jitter\":\"0ms\"}}"
                                    }
                                ],
                                "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:networkChaos/2.1"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

```


### [Azure Portal](#tab/azure-portal)

```Azure Portal
{"action":"delay","mode":"all","selector":{"namespaces":["default"]},"delay":{"latency":"200ms","correlation":"100","jitter":"0ms"}}
```
--- 
