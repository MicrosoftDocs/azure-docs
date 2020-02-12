# Deploy Azure IoT Edge workloads

## Overview

Azure Arc and Azure IoT Edge complement each other's capabilities quite well. Arc provides mechanisms for cluster operators to the configure the foundational components of a cluster as well as apply and enforce cluster policies. And IoT Edge allows application operators to remotely deploy and manage the workloads at scale with convenient cloud ingestion and bi-directional communication primitives. The diagram below illustrates this:

![](./media/edge-arc.png)

## Pre-requisites

1. [Register an IoT Edge device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux#register-an-iot-edge-device) and [deploy the simulated temperature sensor module](https://docs.microsoft.com/azure/iot-edge/quickstart-linux#deploy-a-module). Be sure to note the device's connection string.

1. We'll leverage [IoT Edge's support for Kubernetes](https://aka.ms/edgek8sdoc) to deploy it via Azure Arc's Flux operator.

1. Download the [**values.yaml**](https://github.com/Azure/iotedge/blob/master/kubernetes/charts/edge-kubernetes/values.yaml) file for IoT Edge Helm chart and replace the **deviceConnectionString** placeholder at the end of the file with the one noted in Step 1. You can set any other supported chart installation options as required. Create a namespace for the IoT Edge workload and create add a secret in it:

    ```
    $ kubectl create ns iotedge

    $ kubectl create secret generic dcs 
      --from-file=fully-qualified-path-to-values.yaml \
      --namespace iotedge
    ```

    >You can also set this up remotely using the [cluster config example](./03-use-gitops.md).

1. The Flux `helm-operator` [doesn't yet support Helm 3](https://github.com/fluxcd/helm-operator/issues/8), so we'll need to deploy a cluster-scoped `tiller` instance for now.

## Connect a cluster

Use the `az` CLI `connectedk8s` extension to connect a Kubernetes cluster to Azure Arc:

  ```
  az connectedk8s connect --name AzureArcEdge1 --resource-group AzureArcEdge
  ```

## Create a configuration for IoT Edge

Example repo: https://github.com/veyalla/edgearc

This repo points to the IoT Edge Helm chart and references the secret created in the pre-requisites section.

1. Use the `az` CLI `k8sconfiguration` extension to create a configuration to link the connected cluster to the git repo:

    ```
    az k8sconfiguration create \
      --name iotedge \
      --cluster-name AzureArcEdge1 \
      --resource-group AzureArcEdge \
      --operator-instance-name iotedge \
      --operator-namespace azure-arc-edge \
      --enable-helm-operator true \
      --repository-url "git://github.com/veyalla/edgearc.git"
    ```

    In a minute or two, you should see the IoT Edge workload modules deployed into the `iotedge` namespace in your cluster. You can view the logs of the `SimulatedTemperatureSensor` pod in that namespace to see the sample values being generated. You can also watch the messages arrive at your IoT hub by using the [Azure IoT Hub Toolkit extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit).

## Cleanup

You can remove the configuration using:

```
az k8sconfiguration delete -g AzureArcEdge --cluster-name AzureArcEdge1 --name iotedge
```
