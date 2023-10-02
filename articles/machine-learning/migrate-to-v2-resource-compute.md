---
title: 'Upgrade compute management to v2'
titleSuffix: Azure Machine Learning
description: Upgrade compute management from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
author: vijetajo
ms.author: vijetaj
ms.date: 02/14/2023
ms.reviewer: franksolomon
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade compute management to v2

The compute management functionally remains unchanged with the v2 development platform.

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.


## Create compute instance

* SDK v1

    ```python
    import datetime
    import time
    
    from azureml.core.compute import ComputeTarget, ComputeInstance
    from azureml.core.compute_target import ComputeTargetException
    
    # Compute Instances need to have a unique name across the region.
    # Here, we create a unique name with current datetime
    ci_basic_name = "basic-ci" + datetime.datetime.now().strftime("%Y%m%d%H%M")
    
    compute_config = ComputeInstance.provisioning_configuration(
            vm_size='STANDARD_DS3_V2'
        )
        instance = ComputeInstance.create(ws, ci_basic_name , compute_config)
        instance.wait_for_completion(show_output=True)
    ```

* SDK v2

    ```python
    # Compute Instances need to have a unique name across the region.
    # Here, we create a unique name with current datetime
    from azure.ai.ml.entities import ComputeInstance, AmlCompute
    import datetime
    
    ci_basic_name = "basic-ci" + datetime.datetime.now().strftime("%Y%m%d%H%M")
    ci_basic = ComputeInstance(name=ci_basic_name, size="STANDARD_DS3_v2", idle_time_before_shutdown_minutes="30")
    ml_client.begin_create_or_update(ci_basic)
    ```

## Create compute cluster

* SDK v1

    ```python
    from azureml.core.compute import ComputeTarget, AmlCompute
    from azureml.core.compute_target import ComputeTargetException
    
    # Choose a name for your CPU cluster
    cpu_cluster_name = "cpucluster"
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_DS3_V2',
                                                               max_nodes=4)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)
    cpu_cluster.wait_for_completion(show_output=True)
    ```

* SDK v2

    ```python
    from azure.ai.ml.entities import AmlCompute
    cpu_cluster_name = "cpucluster"
    cluster_basic = AmlCompute(
        name=cpu_cluster_name,
        type="amlcompute",
        size="STANDARD_DS3_v2",
        max_instances=4
    )
    ml_client.begin_create_or_update(cluster_basic)
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[Method/API in SDK v1 (use links to ref docs)](/python/api/azureml-core/azureml.core.compute.amlcompute(class))|[Method/API in SDK v2 (use links to ref docs)](/python/api/azure-ai-ml/azure.ai.ml.entities.amlcompute)|

## Next steps

* [Create an Azure Machine Learning compute instance](how-to-create-compute-instance.md)
* [Create an Azure Machine Learning compute cluster](how-to-create-attach-compute-cluster.md)