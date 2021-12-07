---
title: Troubleshooting AmlArc Kubernetes Compute
titleSuffix: Azure Machine Learning
description: How to troubleshoot when you get errors running a job on an AmlArc Kubernetes Compute. Common pitfalls and tips to help debug your scripts before and during remote execution.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
author: zhwei
ms.author: zhwei
ms.date: 12/7/2021
ms.topic: troubleshooting
ms.custom: troubleshooting, devx-track-python
#Customer intent: As a data scientist, I want to figure out why my job doesn't run well on an Aml so that I can fix it.
---

# Job is pending for a long time

## Check the resource capacity of the nodes:

``` azure cli
kubectl get nodes -o json | jq '.items[]|{name: .metadata.name, capacity: .status.capacity, allocatable: .status.allocatable}'
```

Here is a sample output

``` azure cli
{
  "name": "aks-nodepool1-36994511-vmss000000",
  "capacity": {
    "attachable-volumes-azure-disk": "24",
    "cpu": "6",
    "ephemeral-storage": "129900528Ki",
    "github.com/fuse": "1k",
    "hugepages-1Gi": "0",
    "hugepages-2Mi": "0",
    "memory": "57584828Ki",
    "nvidia.com/gpu": "1",
    "pods": "110"
  },
  "allocatable": {
    "attachable-volumes-azure-disk": "24",
    "cpu": "5840m",
    "ephemeral-storage": "119716326407",
    "github.com/fuse": "1k",
    "hugepages-1Gi": "0",
    "hugepages-2Mi": "0",
    "memory": "51573948Ki",
    "nvidia.com/gpu": "1",
    "pods": "110"
  }
}
```

## 
