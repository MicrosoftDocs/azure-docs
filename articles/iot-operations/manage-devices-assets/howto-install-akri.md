---
title: Install or uninstall Azure IoT Akri Preview
description: How to install or uninstall Azure IoT Akri Preview
author: timlt
ms.author: timlt
# ms.subservice: akri
ms.topic: how-to 
ms.date: 10/26/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to install or uninstall 
# Azure IoT Akri as an individual component. This lets me run it by itself without an 
# Azure IoT Operations installation, or it lets me repair a faulty deployment by Azure IoT Orchestrator after installing Azure IoT Operations.
---

# Install or uninstall Azure IoT Akri Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article shows how to install or uninstall Azure IoT Akri Preview by using the Azure Arc extension. This approach is useful in two situations: 

- If the Azure IoT Orchestrator Preview doesn't deploy Azure IoT Akri correctly
- If you want to deploy Azure IoT Akri on its own

## Prerequisites

- **An Arc-enabled Kubernetes cluster**.  To set up a cluster, you can follow the instructions in [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). The cluster location should be `WestUS3` or `EastUS2`.

## Install Akri
To install Azure IoT Akri agents on your cluster, you can use the Azure Arc cluster extension. 

1. To install the Azure IoT Akri extension, run the following command using Azure CLI:

    ```bash
    az k8s-extension create --name akri-installation --extension-type Microsoft.Akri --scope cluster --cluster-name $CLUSTER_NAME --resource-group $GROUP_NAME --cluster-type connectedClusters --version 0.2.0-rc1 --release-train private-preview
    ```

1. To verify the successful installation, run the following command:

    ```bash
    kubectl get -o wide -n akri pods
    ```

    The output of the command shows the Azure IoT Akri pods running:
    
    ```console
    NAME                                          READY   STATUS    RESTARTS          AGE    IP          NODE             NOMINATED NODE   READINESS GATES
    akri-agent-daemonset-jrx9t                    1/1     Running   124 (3m18s ago)   2d3h   10.1.0.87   docker-desktop   <none>           <none>
    akri-controller-deployment-57c5dc7dc5-b5qjg   1/1     Running   124 (3m56s ago)   2d3h   10.1.0.86   docker-desktop   <none>           <none>
    ```

## Uninstall Akri
To uninstall the Akri Arc cluster extension, run the following command:

```bash
az k8s-extension delete --name akri-installation --cluster-name $CLUSTER_NAME --resource-group $GROUP_NAME --cluster-type connectedClusters
```
 
## Next step
In this article, you learned how to install and uninstall Azure IoT Akri by using the Azure Arc Extension.  Here's the suggested next step to start working with OPC UA assets:

> [!div class="nextstepaction"]
> [Create and detect assets using Azure IoT Akri Preview](howto-create-and-detect-assets-using-akri.md)

