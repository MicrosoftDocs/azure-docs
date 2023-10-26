---
title: Configure IoT Layered Network Management Level 4 Cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure IoT Layered Network Management Level 4 Cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/25/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure IoT Layered Network Management Level 4 Cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure an Arc-enabled Kubernetes cluster in an isolated network using Azure IoT Layered Network Management.

Since Level 4 is internet facing, the configuration and installation can be completed using online commands.

## Prepare a Windows 11 Machine

1. Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device
1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later
1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/)
1. Install AKS Edge Essentials. Follow the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine)
1. Install Azure CLI. Follow the steps in [Install Azure CLI on Windows](/azure/install-azure-cli-windows)
1. Install connectedk8s using the following command:

    ```bash
    az extension add --name connectedk8s
    ```

## Create the AKS Edge Essentials cluster

1. To deploy AKS Edge Essentials, you need an Azure service principal that has at least **contributor** access to your subscription. For more information on how to create an Azure service principal, see [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal) to create a service principal.

  For more information on prerequisites, see [AKS Edge Essentials prerequisites](/azure/aks/hybrid/aks-edge-quickstart#prerequisites).

1. Follow the steps in the [Single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment) article.
1. Use the `New-AksEdgeDeployment` PowerShell command to create a file named **aks-ee-config.json**.
1. Edit the **aks-ee-config.json** file.
1. In the **Init** section, change the **ServiceIPRangeSize** property to **10**.

  ```json
  "Init": {
      "ServiceIPRangeSize": 10
    },
  ```

1. In the **Arc** section, replace the placeholder text with values to reflect your specific environment.

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

1. In the **Network** section, verify the following properties are added or set. Replace the placeholder text with your values. Confirm that the *Ip4AddressPrefix* **A.B.C** doesn't overlap with the IP range that is assigned within network layers.

  ```json
  "Network": {
      "NetworkPlugin": "flannel",
      "Ip4AddressPrefix": "<A.B.C.0/24>",
      "Ip4PrefixLength": 24,
      "InternetDisabled": false,
      "SkipDnsCheck": false,
  ```
  For more information, see [Deployment configuration JSON parameters](/azure/aks/hybrid/aks-edge-deployment-config-json). 
    
1. Create the AKS EE cluster:
  ```bash
  New-AksEdgeDeployment -JsonConfigFilePath .\aks-ee-config.json
  ```

## Arc enable the cluster

1. Make sure that **helm 3.8.0 (or later)** is installed before Arc-enable the cluster.

1. Run the following command in an elevated PowerShell prompt:

  ```powershell
  Connect-AksEdgeArc -JsonConfigFilePath .\aks-ee-config.json
  ```

  For more information, see [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).


## Deploy Layered Network Management Service to the cluster

The following sections describe how to deploy the Layered Network Management service to the cluster.

### Install the Layered Network Management operator

1. Run the following command using helm 3.8.0 or later:

  ```bash
  helm install lnm-level-4 oci://alicesprings.azurecr.io/az-e4in --version 0.1.2
  ```

1. Use the *kubectl* command to verify the Layered Network Management operator is running.

```bash
kubectl get pods
```

```output
NAME                                   READY   STATUS    RESTARTS   AGE
azedge-lnm-operator-598cc495c-5428j   1/1     Running   0          28h
```

## Config Layered Network Management Service

Create Layered Network Management custom resource.

1. Create a `lnm-cr.yaml` file as specified:

```yaml
apiVersion: az-edge.com/v1
kind: E4in
metadata:
  name: level-4
  namespace: default
spec:
  image:
    repository: mcr.microsoft.com/oss/envoyproxy/envoy-distroless
    tag: v1.27.0
  replicas: 1
  logLevel: "info"
  allowList:
    enableArcDomains: true
    domains:
    sourceIpRange:
    - addressPrefix: "0.0.0.0"
      prefixLen: 0
```

For debugging or experimentation, you can change the value of **loglevel** parameter to **debug**.  

1. Create the Custom Resource to create a Layered Network Management instance

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

After these commands are run successfully, traffic received on ports 443 and 10000 on the windows host is routed through to the Kubernetes service.

## Related content

- [Configure Azure IoT Layered Network Management Environment](./howto-configure-layered-network.md)
