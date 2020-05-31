---
title: How to stop monitoring your hybrid Kubernetes cluster | Microsoft Docs
description: This article describes how you can stop monitoring of your hybrid Kubernetes cluster with Azure Monitor for containers.
ms.topic: conceptual
ms.date: 04/24/2020

---

# How to stop monitoring your hybrid cluster

After you enable monitoring of your Kubernetes cluster running on Azure Stack or on-premises, you can stop monitoring the cluster with Azure Monitor for containers if you decide you no longer want to monitor it. This article shows how to accomplish this.  

## How to stop monitoring using Helm

1. To first identify the Azure Monitor for containers helm chart release installed on your cluster, run the following helm command.

    ```
    helm list
    ```

    The output will resemble the following:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    azmon-containers-release-1      default         3               2020-04-21 15:27:24.1201959 -0700 PDT   deployed        azuremonitor-containers-2.7.0   7.0.0-1
    ```

    *azmon-containers-release-1* represents the helm chart release for Azure Monitor for containers.

2. To delete the chart release, run the following helm command.

    `helm delete <releaseName>`

    Example:

    `helm delete azmon-containers-release-1`

    This will remove the release from the cluster. You can verify by running the `helm list` command:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    ```

The configuration change can take a few minutes to complete. Because Helm tracks your releases even after you’ve deleted them, you can audit a cluster’s history, and even undelete a release with `helm rollback`.

## Next steps

If the Log Analytics workspace was created only to support monitoring the cluster and it's no longer needed, you have to manually delete it. If you are not familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace](../../log-analytics/log-analytics-manage-del-workspace.md).
