---
title: Configure Layered Network Management (preview) on level 4 cluster
description: Deploy and configure Azure IoT Layered Network Management (preview) on a level 4 cluster.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 12/12/2024

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
ms.service: azure-iot-operations
---

# Configure Azure IoT Layered Network Management (preview) on level 4 cluster

Azure IoT Layered Network Management (preview) is a component to support Azure IoT Operations. However, it needs to be deployed individually to the top network layer for supporting the Azure IoT Operations in the lower layer. In the top level of your network layers (usually level 4 of the ISA-95 network architecture), the cluster and Layered Network Management service have direct internet access. Once the setup is completed, the Layered Network Management (preview) service is ready for receiving network traffic from the child layer and forwards it to Azure Arc.

## Prerequisites
Meet the following minimum requirements for deploying the Layered Network Management individually on the system.
- **AKS Edge Essentials** - *Arc-connected cluster and GitOps* category in [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements)
- **K3S Kubernetes cluster** - [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements)

## Set up Kubernetes cluster in Level 4

To set up only Layered Network Management, the prerequisites are simpler than an Azure IoT Operations deployment. It's optional to fulfill the general requirements for Azure IoT Operations in [Prepare your Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

The following steps for setting up [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) and [K3S](https://docs.k3s.io/) Kubernetes cluster are verified by Microsoft.

# [K3S Cluster](#tab/k3s)

## Prepare an Ubuntu machine

1. Ubuntu 22.04 LTS is the recommended version for the host machine.

1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.

1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/).

1. Install the Azure CLI. You can install the Azure CLI directly onto the level 4 machine or on another *developer* or *jumpbox* machine if you plan to access the level 3 cluster remotely. If you choose to access the Kubernetes cluster remotely to keep the cluster host clean, you run the *kubectl* and *az*" related commands from the *developer* machine for the rest of the steps in this article.

    - Install Azure CLI. Follow the steps in [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux).

    - Install *connectedk8s* and other extensions.

        ```bash
        az extension add --name connectedk8s
        az extension add --name k8s-extension
        ```


## Create the K3S cluster

1. Install K3S with the following command:
    
    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```
    
    Refer to the [K3s quick-start guide](https://docs.k3s.io/quick-start) for more detail.

    > [!IMPORTANT]
    > Be sure to use the `--disable=traefik` parameter to disable traefik. Otherwise, you might have an issue when you try to allocate public IP for the Layered Network Management service in later steps.

1. Copy the K3s configuration yaml file to `.kube/config`.

    ```bash
    mkdir ~/.kube
    cp ~/.kube/config ~/.kube/config.back
    sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
    mv ~/.kube/merged ~/.kube/config
    chmod  0600 ~/.kube/config
    export KUBECONFIG=~/.kube/config
    #switch to k3s context
    kubectl config use-context default
    ```

# [AKS Edge Essentials](#tab/aksee)

For hosting the Layered Network Management service, you need a single machine deployment of AKS Edge Essentials. You can follow the AKS Edge Essentials documentation to create your cluster with default configurations.

## Prepare Windows 11

1. Follow the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine) to set up your Windows machine.

1. In addition, you need to install the Azure CLI and extensions for later steps.
    1. Install Azure CLI. Follow the steps in [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).
    1. Install connectedk8s using the following command:
        ```bash
        az extension add --name connectedk8s
        az extension add --name k8s-extension
        ```

## Create the AKS Edge Essentials cluster

Follow the steps in [Single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment) to create your cluster.
1. You need to complete step 1-3 in this document.
1. In **aksedge-config.json** from step 1, you only need to make the following adjustment for Layered Network Management. You can keep the default value for the rest of the parameters. Otherwise, make proper adjustments based on your environment. 
    ```json
    "Init": {
        "ServiceIPRangeSize": 10
      },
    ```

---

## Arc enable the cluster

# [K3S Cluster](#tab/k3s)

1. Sign in with Azure CLI. To avoid permission issues later, it's important that you sign in interactively using a browser window:
    ```powershell
    az login
    ```
1. Set environment variables for the setup steps. Replace values in `<>` with valid values or names of your choice. The `CLUSTER_NAME` and `RESOURCE_GROUP` are created based on the names you provide. Refer to [Azure IoT Operations supported regions](../overview-iot-operations.md#supported-regions) for choosing the  `LOCATION`.
    ```powershell
    # Id of the subscription where your resource group and Arc-enabled cluster will be created
    $SUBSCRIPTION_ID = "<subscription-id>"
    # Azure region where the created resource group will be located
    $LOCATION = "<region>"
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

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```powershell
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   ```
1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:
    ```bash
    az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```
1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it in the resource group you created in the previous step:
    ```powershell
    az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```

# [AKS Edge Essentials](#tab/aksee)

- Follow the steps in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).
  - You need to complete step 1-3 in this document.
---

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
    - For debugging or experimentation, you can change the value of **loglevel** parameter to **debug**.
    - For more detail about the endpoints, see [Azure IoT Operations endpoints](/azure/iot-operations/deploy-iot-ops/overview-deploy#azure-iot-operations-endpoints).

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
        - destinationUrl: "management.azure.com"
          destinationType: external
        - destinationUrl: "*.dp.kubernetesconfiguration.azure.com"
          destinationType: external
        - destinationUrl: "login.microsoftonline.com"
          destinationType: external
        - destinationUrl: "*.login.microsoft.com"
          destinationType: external
        - destinationUrl: "login.windows.net"
          destinationType: external
        - destinationUrl: "mcr.microsoft.com"
          destinationType: external
        - destinationUrl: "*.data.mcr.microsoft.com"
          destinationType: external
        - destinationUrl: "gbl.his.arc.azure.com"
          destinationType: external
        - destinationUrl: "*.his.arc.azure.com"
          destinationType: external
        - destinationUrl: "k8connecthelm.azureedge.net"
          destinationType: external
        - destinationUrl: "guestnotificationservice.azure.com"
          destinationType: external
        - destinationUrl: "*.guestnotificationservice.azure.com"
          destinationType: external
        - destinationUrl: "sts.windows.net"
          destinationType: external
        - destinationUrl: "k8sconnectcsp.azureedge.net"
          destinationType: external
        - destinationUrl: "*.servicebus.windows.net"
          destinationType: external
        - destinationUrl: "graph.microsoft.com"
          destinationType: external
        - destinationUrl: "*.arc.azure.net"
          destinationType: external
        - destinationUrl: "*.obo.arc.azure.com"
          destinationType: external
        - destinationUrl: "linuxgeneva-microsoft.azurecr.io"
          destinationType: external
        - destinationUrl: "graph.windows.net"
          destinationType: external
        - destinationUrl: "*.azurecr.io"
          destinationType: external
        - destinationUrl: "*.blob.core.windows.net"
          destinationType: external
        - destinationUrl: "*.vault.azure.net"
          destinationType: external
        - destinationUrl: "*.blob.storage.azure.net"
          destinationType: external
        sourceIpRange:
        - addressPrefix: "0.0.0.0"
          prefixLen: 0
    ```


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

### Add iptables configuration for AKS Edge Essentials

> [!IMPORTANT]
> This step is applicable only when hosting the Layered Network Management in an AKS Edge Essentials cluster.

The Layered Network Management deployment creates a Kubernetes service of type *LoadBalancer*. To ensure that the service is accessible from outside the Kubernetes cluster, you need to map the underlying Windows host's ports to the appropriate ports on the Layered Network Management service. 

```bash
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=443 connectaddress=192.168.0.4
netsh interface portproxy add v4tov4 listenport=10000 listenaddress=0.0.0.0 connectport=10000 connectaddress=192.168.0.4
```

After these commands are run successfully, traffic received on ports 443 and 10000 on the Windows host is routed through to the Kubernetes service. When configuring customized DNS for the child level network layer, you direct the network traffic to the IP of this Windows host and then to the Layered Network Management service running on it.

## Related content

- [Create sample network environment](./howto-configure-layered-network.md)
