---
title: Configure Azure IoT Layered Network Management on level 4 cluster
titleSuffix: Azure IoT Layered Network Management
description: Deploy and configure Azure IoT Layered Network Management on a level 4 cluster.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure Azure IoT Layered Network Management on level 4 cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Layered Network Management is one of the Azure IoT Operations components. However, it can be deployed individually to the top network layer for supporting the Azure IoT Operations in the lower layer. In the top level of your network layers (usually level 4 of the ISA-95 network architecture), the cluster and Layered Network Management service have direct internet access. Once the setup is completed, the Layered Network Management service is ready for receiving network traffic from the child layer and forwards it to Azure Arc.

## Prerequisites
Meet the following minimum requirements for deploying the Layered Network Management individually on the system.
- Arc-connected cluster and GitOps in [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements)

## Set up Kubernetes cluster in Level 4

To set up only Layered Network Management, the prerequisites are simpler than an Azure IoT Operations deployment. It's optional to fulfill the general requirements for Azure IoT Operations in [Prepare your Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

Currently, the steps only include setting up an [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) Kubernetes cluster. 

## Prepare Windows 11

1. Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device.
1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.
1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/).
1. Install AKS Edge Essentials. Follow the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine).
1. Install Azure CLI. Follow the steps in [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).
1. Install connectedk8s using the following command:

    ```bash
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    ```

1. [Install Azure CLI extension](/cli/azure/iot/ops) using `az extension add --name azure-iot-ops`.

## Create the AKS Edge Essentials cluster

1. Verify you meet the [Prerequisites](/azure/aks/hybrid/aks-edge-quickstart#prerequisites) section of the AKS Edge Essentials quickstart.
1. Follow the [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine) steps to install AKS Edge Essentials on your Windows 11 machine.
1. Follow the steps in the [Single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment) article.
    Use the *New-AksEdgeDeployment* PowerShell command to create a file named **aks-ee-config.json**, make the following modifications:
    - In the **Init** section, change the **ServiceIPRangeSize** property to **10**.

        ```json
        "Init": {
            "ServiceIPRangeSize": 10
          },
        ```

    - In the **Network** section, verify the following properties are added or set. Replace the placeholder text with your values. Confirm that the *Ip4AddressPrefix* **A.B.C** doesn't overlap with the IP range that is assigned within network layers.

        ```json
        "Network": {
            "NetworkPlugin": "flannel",
            "Ip4AddressPrefix": "<A.B.C.0/24>",
            "Ip4PrefixLength": 24,
            "InternetDisabled": false,
            "SkipDnsCheck": false,
        ```

        For more information about deployment configurations, see [Deployment configuration JSON parameters](/azure/aks/hybrid/aks-edge-deployment-config-json).

## Arc enable the cluster

1. Sign in with Azure CLI. To avoid permission issues later, it's important that you sign in interactively using a browser window:
    ```powershell
    az login
    ```
1. Set environment variables for the setup steps. Replace values in `<>` with valid values or names of your choice. The `CLUSTER_NAME` and `RESOURCE_GROUP` are created based on the names you provide:
    ```powershell
    # Id of the subscription where your resource group and Arc-enabled cluster will be created
    $SUBSCRIPTION_ID = "<subscription-id>"
    # Azure region where the created resource group will be located
    # Currently supported regions: : "westus3" or "eastus2"
    $LOCATION = "WestUS3"
    # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
    $RESOURCE_GROUP = "<resource-group-name>"
    # Name of the Arc-enabled cluster to create in your resource group
    $CLUSTER_NAME = "<cluster-name>"
    ```
1. Set the Azure subscription context for all commands:
    ```powershell
    az account set -s $SUBSCRIPTION_ID
    ```
1. Register the required resource providers in your subscription:
    ```powershell
    az provider register -n "Microsoft.ExtendedLocation"
    az provider register -n "Microsoft.Kubernetes"
    az provider register -n "Microsoft.KubernetesConfiguration"
    az provider register -n "Microsoft.IoTOperationsOrchestrator"
    az provider register -n "Microsoft.IoTOperationsMQ"
    az provider register -n "Microsoft.IoTOperationsDataProcessor"
    az provider register -n "Microsoft.DeviceRegistry"
    ```
1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:
    ```bash
    az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```
1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it in the resource group you created in the previous step:
    ```powershell
    az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```
    > [!TIP]
    > If the `connectedk8s` commands fail, try using the cmdlets in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

## Deploy Layered Network Management Service to the cluster

Once your Kubernetes cluster is Arc-enabled, you can deploy the Layered Network Management service to the cluster.

### Install the Layered Network Management operator

1. Run the following command. Replace the placeholders `<RESOURCE GROUP>` and `<CLUSTER NAME>` with your Arc onboarding information from an earlier step.

    ```bash
    az login

    az k8s-extension create --resource-group <RESOURCE GROUP> --name kind-lnm-extension --cluster-type connectedClusters --cluster-name <CLUSTER NAME> --auto-upgrade false --extension-type Microsoft.IoTOperations.LayeredNetworkManagement --version 0.1.0-preview --release-train preview
    ```

1. Use the *kubectl* command to verify the Layered Network Management operator is running.

    ```bash
    kubectl get pods
    ```

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    azedge-lnm-operator-598cc495c-5428j   1/1     Running   0          28h
    ```

## Configure Layered Network Management Service

Create the Layered Network Management custom resource.

1. Create a `lnm-cr.yaml` file as specified:

    ```yaml
    apiVersion: layerednetworkmgmt.iotoperations.azure.com/v1beta1
    kind: Lnm
    metadata:
      name: level4
      namespace: default
    spec:
      image:
        pullPolicy: IfNotPresent
        repository: mcr.microsoft.com/oss/envoyproxy/envoy-distroless
        tag: v1.27.0
      replicas: 1
      logLevel: "debug"
      openTelemetryMetricsCollectorAddr: "http://aio-otel-collector.azure-iot-operations.svc.cluster.local:4317"
      level: 4
      allowList:
        enableArcDomains: true
        domains:
        - destinationUrl: "*.ods.opinsights.azure.com"
          destinationType: external
        - destinationUrl: "*.oms.opinsights.azure.com"
          destinationType: external
        - destinationUrl: "*.monitoring.azure.com"
          destinationType: external
        - destinationUrl: "*.handler.control.monitor.azure.com"
          destinationType: external
        - destinationUrl: "quay.io"
          destinationType: external
        - destinationUrl: "*.quay.io"
          destinationType: external
        - destinationUrl: "docker.io"
          destinationType: external
        - destinationUrl: "*.docker.io"
          destinationType: external
        - destinationUrl: "*.docker.com"
          destinationType: external
        - destinationUrl: "gcr.io"
          destinationType: external
        - destinationUrl: "*.googleapis.com"
          destinationType: external
        - destinationUrl: "login.windows.net"
          destinationType: external
        - destinationUrl: "graph.windows.net"
          destinationType: external
        - destinationUrl: "msit-onelake.pbidedicated.windows.net"
          destinationType: external
        - destinationUrl: "*.vault.azure.net"
          destinationType: external
        - destinationUrl: "*.k8s.io"
          destinationType: external
        - destinationUrl: "*.pkg.dev"
          destinationType: external
        - destinationUrl: "github.com"
          destinationType: external
        - destinationUrl: "raw.githubusercontent.com"
          destinationType: external
        sourceIpRange:
        - addressPrefix: "0.0.0.0"
          prefixLen: 0
    ```

    For debugging or experimentation, you can change the value of **loglevel** parameter to **debug**.

1. Create the Custom Resource to create a Layered Network Management instance.

    ```bash
    kubectl apply -f lnm-cr.yaml
    ```

1. View the Layered Network Management Kubernetes service:

    ```bash
    kubectl get services
    ```

    ```output
    NAME           TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                                      AGE
    lnm-level-4   LoadBalancer   10.43.91.54   192.168.0.4   80:30530/TCP,443:31117/TCP,10000:31914/TCP   95s
    ```

### Add iptables configuration

This step is for AKS Edge Essentials only.

The Layered Network Management deployment creates a Kubernetes service of type *LoadBalancer*. To ensure that the service is accessible from outside the Kubernetes cluster, you need to map the underlying Windows host's ports to the appropriate ports on the Layered Network Management service. 

```bash
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=443 connectaddress=192.168.0.4
netsh interface portproxy add v4tov4 listenport=10000 listenaddress=0.0.0.0 connectport=10000 connectaddress=192.168.0.4
```

After these commands are run successfully, traffic received on ports 443 and 10000 on the Windows host is routed through to the Kubernetes service. When configuring customized DNS for the child level network layer, you direct the network traffic to the IP of this Windows host and then to the Layered Network Management service running on it.

## Related content

- [Create sample network environment](./howto-configure-layered-network.md)
