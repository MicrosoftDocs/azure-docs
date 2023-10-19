---
title: Modifying JVM heap settings
description: How to modify initial and max heap size for Trino pods.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/19/2023
---

# Configure JVM heap size

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article describes how to modify initial and max heap size for Trino pods with HDInsight on AKS.

`Xms` and `-Xmx` settings can be changed to control initial and max heap size of Trino pods. You can modify the JVM heap settings using ARM template. 

> [!NOTE]
> In HDInsight on AKS, heap settings on Trino pods are already right-sized based on the selected SKU size. These settings should only be modified when a user wants to control JVM behavior on the pods and is aware of side-effects of changing these settings.

## Prerequisites
* An operational Trino cluster with HDInsight on AKS.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

## Example

Specify configurations in `serviceConfigsProfiles.serviceName[“trino”]` for `common`, `coordinator` or `worker` components under `properties.clusterProfile` section in the ARM template.

The following example sets the initial and max heap size to 6 GB and 10 GB for both Trino worker and coordinator.

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "common",
                "files": [
                    {
                        "fileName": "jvm.config",
                        "values": {
                            "-Xms": "6G",
                            "-Xmm": "10G"
                        }
                    }
                ]                
            }
        ]
    }
]

```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).

## Constraints on heap settings

 * Heap sizes can vary between `50%` to `90%` of the allocatable pod resources, any value outside of this boundary results in failed deployment.
 * Permissible units for heap settings are MB: `m` & `M`, GB: `g` & `G` and KB: `k` and `K`.
