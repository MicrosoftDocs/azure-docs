---
title: Azure CLI & Azure portal example experiments
description: See real examples of creating various chaos experiments in the Azure portal and CLI. 
services: chaos-studio
author: nikhilkaul-msft
ms.topic: reference
ms.date: 05/07/2024
ms.author: abbyweisberg
ms.reviewer: nikhilkaul
ms.service: chaos-studio
ms.custom: none, devx-track-azurecli
---

# Example Experiments

This article provides examples for creating experiments from your command line (CLI) and Azure portal parameter examples for various experiments. You can copy and paste the following commands into the CLI or Azure portal, and edit them for your specific resources. 

Here's an example of where you would copy and paste the Azure portal parameter into:

[![Screenshot that shows Azure portal parameter location.](images/azure-portal-parameter-examples.png)](images/azure-portal-parameter-examples.png#lightbox)

To save one of the "experiment.json" examples shown below, simply type *nano experiment.json* into your cloud shell, copy and paste any of the below experiment examples, save it (ctrl+o), exit nano (ctrl+x) and run the following command:
 ```AzCLI
az rest --method put --uri https://management.azure.com/subscriptions/6b052e15-03d3-4f17-b2e1-be7f07588291/resourceGroups/exampleRG/providers/Microsoft.Chaos/experiments/exampleExperiment?api-version=2024-01-01
```
> [!NOTE]
> This is the generic command you would use to create any experiment from the Azure CLI

> [!NOTE]
> Make sure your experiment has permission to operate on **ALL** resources within the experiment. These examples exclusively use **System-assigned managed identity**, but we also support User-assigned managed identity. For more information, see [Experiment permissions](chaos-studio-permissions-security.md). These experiments will **NOT** run without granting the experiment permission to run on the target resources. 
><br>
><br>
>View all available role assignments [here](chaos-studio-fault-providers.md) to determine which permissions are required for your target resources. 



---
Azure Kubernetes Service (AKS) - Network Delay
---

### [Azure CLI Experiment.JSON](#tab/azure-CLI)
```AzCLI
{    

"identity": {
        "type": "SystemAssigned",
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
                        "id": "/subscriptions/123hdq8-123d-89d7-5670-123123/resourceGroups/aks_network_delay_experiment/providers/Microsoft.ContainerService/managedClusters/nikhilAKScluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh",
                        "type": "ChaosTarget"
                    }
                ],
                "id": "Selector1"
            }
        ],
        "steps": [
            {
                "name": "AKS network latency",
                "branches": [
                    {
                        "name": "AKS network latency",
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

### [Azure portal parameters](#tab/azure-portal)

```Azure portal
{"action":"delay","mode":"all","selector":{"namespaces":["default"]},"delay":{"latency":"200ms","correlation":"100","jitter":"0ms"}}
```
--- 
Azure Kubernetes Service (AKS) - Pod Failure
---

### [Azure CLI Experiment.JSON](#tab/azure-CLI)
```AzCLI
{    

"identity": {
        "type": "SystemAssigned",
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
                        "id": "/subscriptions/123hdq8-123d-89d7-5670-123123/resourceGroups/aks_pod_fail_experiment/providers/Microsoft.ContainerService/managedClusters/nikhilAKScluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh",
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
                                        "value": "{\"action\":\"pod-failure\",\"mode\":\"all\",\"duration\":\"600s\",\"selector\":{\"namespaces\":[\"autoinstrumentationdemo\"]}}}"
                                    }
                                ],
                                "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/2.1"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

```


### [Azure portal parameters](#tab/azure-portal)

```Azure portal
{"action":"pod-failure","mode":"all","duration":"600s","selector":{"namespaces":["autoinstrumentationdemo"]}}
```
---
Azure Kubernetes Service (AKS) - Memory Stress
---

### [Azure CLI](#tab/azure-CLI)
```AzCLI
{    

"identity": {
        "type": "SystemAssigned",
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
                        "id": "/subscriptions/123hdq8-123d-89d7-5670-123123/resourceGroups/aks_memory_stress_experiment/providers/Microsoft.ContainerService/managedClusters/nikhilAKScluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh",
                        "type": "ChaosTarget"
                    }
                ],
                "id": "Selector1"
            }
        ],
        "steps": [
            {
                "name": "AKS memory stress",
                "branches": [
                    {
                        "name": "AKS memory stress",
                        "actions": [
                            {
                                "type": "continuous",
                                "selectorId": "Selector1",
                                "duration": "PT10M",
                                "parameters": [
                                    {
                                        "key": "jsonSpec",
                                        "value": "{\"mode\":\"all\",\"selector\":{\"namespaces\":[\"autoinstrumentationdemo\"]},\"stressors\":{\"memory\":{\"workers\":4,\"size\":\"95%\"}}"
                                    }
                                ],
                                "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:stressChaos/2.1"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

```


### [Azure portal parameters](#tab/azure-portal)

```Azure portal
{"mode":"all","selector":{"namespaces":["autoinstrumentationdemo"]},"stressors":{"memory":{"workers":4,"size":"95%"}}
```
--- 

---
Azure Load Test - Start/Stop Load Test (With Delay)
---

### [Azure CLI Experiment.JSON](#tab/azure-CLI)
```AzCLI
{    

"identity": {
        "type": "SystemAssigned",
    },
    "tags": {},
    "location": "eastus",
    "properties": {
        "provisioningState": "Succeeded",
        "selectors": [
            {
                "type": "List",
                "targets": [
                    {
                        "id": "/subscriptions/123hdq8-123d-89d7-5670-123123/resourceGroups/nikhilLoadTest/providers/microsoft.loadtestservice/loadtests/Nikhil-Demo-Load-Test/providers/Microsoft.Chaos/targets/microsoft-azureloadtest",
                        "type": "ChaosTarget"
                    }
                ],
                "id": "66e5124c-12db-4f7e-8549-7299c5828bff"
            },
            {
                "type": "List",
                "targets": [
                    {
                        "id": "/subscriptions/123hdq8-123d-89d7-5670-123123/resourceGroups/builddemo/providers/microsoft.loadtestservice/loadtests/Nikhil-Demo-Load-Test/providers/Microsoft.Chaos/targets/microsoft-azureloadtest",
                        "type": "ChaosTarget"
                    }
                ],
                "id": "9dc23b43-81ca-42c3-beae-3fe8ac80c30b"
            }
        ],
        "steps": [
            {
                "name": "Step 1 - Start Load Test",
                "branches": [
                    {
                        "name": "Branch 1",
                        "actions": [
                            {
                                "selectorId": "66e5124c-12db-4f7e-8549-7299c5828bff",
                                "type": "discrete",
                                "parameters": [
                                    {
                                        "key": "testId",
                                        "value": "ae24e6z9-d88d-4752-8552-c73e8a9adebc"
                                    }
                                ],
                                "name": "urn:csci:microsoft:azureLoadTest:start/1.0"
                            },
                            {
                                "type": "delay",
                                "duration": "PT10M",
                                "name": "urn:csci:microsoft:chaosStudio:TimedDelay/1.0"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Step 2 - End Load test",
                "branches": [
                    {
                        "name": "Branch 1",
                        "actions": [
                            {
                                "selectorId": "9dc23b43-81ca-42c3-beae-3fe8ac80c30b",
                                "type": "discrete",
                                "parameters": [
                                    {
                                        "key": "testId",
                                        "value": "ae24e6z9-d88d-4752-8552-c73e8a9adebc"
                                    }
                                ],
                                "name": "urn:csci:microsoft:azureLoadTest:stop/1.0"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
}

```

### [Azure portal parameters](#tab/azure-portal)

```Azure portal
ae24e6z9-d88d-4752-8552-c73e8a9adebc
```
