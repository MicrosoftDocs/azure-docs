---
title: Configure IoT Layered Network Management level 4 cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure IoT Layered Network Management level 4 cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/07/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure IoT Layered Network Management level 4 cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure an Arc-enabled Kubernetes cluster in an isolated network using Azure IoT Layered Network Management.

In the top level of your network layers usually level 4 of the ISA-95 network architecture, the cluster and Layered Network Management service have direct internet access. Once the setup is completed, the Layered Network Management service is ready for receiving network traffic from the child layer and forward it to Azure Arc.

Currently, the steps only include setting up an [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) cluster.

## Set up Kubernetes cluster in Level 4

The procedure of setting AKS Edge Essentials cluster is similar to [Prepare your Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) with additional steps. You need to follow both documents to complete all the steps.

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

1. [Install Azure CLI extension](/cli/azure/iot/ops).

## Create the AKS Edge Essentials cluster

1. To deploy AKS Edge Essentials, you need an Azure service principal that has at least **contributor** access to your subscription. For more information on how to create an Azure service principal, see [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal) to create a service principal. For more information on prerequisites, see [AKS Edge Essentials prerequisites](/azure/aks/hybrid/aks-edge-quickstart#prerequisites).
1. Follow the steps in the [Single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment) article.
1. Use the *New-AksEdgeDeployment* PowerShell command to create a file named **aks-ee-config.json**.
1. Edit the **aks-ee-config.json** file.
1. In the **Init** section, change the **ServiceIPRangeSize** property to **10**.

    ```json
    "Init": {
        "ServiceIPRangeSize": 10
      },
    ```

1. In the **Network** section, verify the following properties are added or set. Replace the placeholder text with your values. Confirm that the *Ip4AddressPrefix* **A.B.C** doesn't overlap with the IP range that is assigned within network layers.

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

Follow the steps in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

In the **Arc** section of **aks-ee-config.json** that you created earlier, replace the placeholder text with values to reflect your specific environment.

```json
"Arc": {
    "ClusterName": "<NAME OF THE ARC CLUSTER TO BE DISPLAYED IN AZURE PORTAL>",
    "Location": "<REGION>",
    "ResourceGroupName": "<RESOURCE GROUP>",
    "SubscriptionId": "<SUBSCRIPTION>",
    "TenantId": "<TENANT ID>",
    "ClientId": "<CLIENT ID>",
    "ClientSecret": "<CLIENT SECRET>"
  },
```

As an alternative, you can follow [Connect an existing Kubernetes cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster) to Arc-enable your cluster. You need to sign in to Azure from the Windows 11 during the process, but won't need to create the service principal that described in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

## Deploy Layered Network Management Service to the cluster

The following sections describe how to deploy the Layered Network Management service to the cluster.

### Install the Layered Network Management operator

1. Run the following command. Replace the placeholders `<RESOURCE GROUP>` and `<CLUSTER NAME>` with your Arc onboarding information from an earlier step.

    ```bash
    az login

    az k8s-extension create --resource-group <RESOURCE GROUP> --name kind-e4in-extension --cluster-type connectedClusters --cluster-name <CLUSTER NAME> --auto-upgrade false --extension-type Microsoft.IoTOperations.LayeredNetworkManagement --version 0.1.0-alpha.5 --release-train private-preview
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
