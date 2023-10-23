---
title: Configure IoT Layered Network Management Level 4 Cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure IoT Layered Network Management Level 4 Cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/23/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure IoT Layered Network Management Level 4 Cluster

This page describes the process to deploy Layered Network Management service to an Arc-enable kubernetes cluster. Currently the instruction is only for setting up an AKS EE ([AKS Edge Essentials](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-overview)) cluster. Instruction for setting up K3S on ubuntu would be available soon.

## Setting Up Kubernetes Cluster in Level 4
Since Level 4 is internet facing, all of the setups and installations can be completed with online commands.
#### AKS EE cluster
1. **Prepare a Windows 11 Machine**
    - Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device.
    - Install Helm 3.8.0 or later
    - Install Kubectl
    - Install AKS EE with the following instruction:
        - [Prepare your machines for AKS Edge Essentials](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-howto-setup-machine)
   - Install Azure CLI with the following instruction:
        - [Install Azure CLI on Windows](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
        - Install connectedk8s:
            ```bash
            az extension add --name connectedk8s
            ```
2. **Create the AKS EE cluster**
    Refer to: [Single machine deployment](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-howto-single-node-deployment).
   > This step needs an Azure Service Principal which has at least `contributor` access to your subscription as specified [here](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-quickstart#prerequisites). Refer to [this document](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create service principal.

    Create `aks-ee-config.json` file with the `New-AksEdgeDeployment` command and make the following modifications:
    1. In the **Init** section
        ```
        "Init": {
            "ServiceIPRangeSize": 10
          },
        ```
    
    2. In the **Arc** section, replace text in <> with values to reflect your specific environment.
        ```
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
    
    3. In the **Network** section, make sure the following properties are added or set. Replace text in **<>** with proper value. Confirm that **A.B.C** does not overlap with the IP range that would be assigned within network layers.
        ```
        "Network": {
            "NetworkPlugin": "flannel",
            "Ip4AddressPrefix": "<A.B.C.0/24>",
            "Ip4PrefixLength": 24,
            "InternetDisabled": false,
            "SkipDnsCheck": false,
        ```
        > Refer to [Deployment configuration JSON parameters](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-deployment-config-json) for more details. 
    
        Create the AKS EE cluster:
        ```bash
        New-AksEdgeDeployment -JsonConfigFilePath .\aks-ee-config.json
        ```
4. **Arc enable the cluster**
    > Make sure that **helm 3.8.0 (or later)** is installed before arc-enable the cluster.
    Run the following in Administrative PowerShell:
    ```bash
    Connect-AksEdgeArc -JsonConfigFilePath .\aks-ee-config.json
    ```
    >For more details, see [Connect your AKS Edge Essentials cluster to Arc](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

#### K3S cluster
Instruction for setting up service on Ubuntu hosted K3S kubernetes coming soon.

## Deploy Layered Network Management Service to the Cluster

#### Install the Layered Network Management operator:

Run the following command:
> You will need **helm 3.8.0 or later** that has support to pull OCI packages to properly execute the following command.
```bash
helm install lnm-level-4 oci://alicesprings.azurecr.io/az-e4in --version 0.1.2
```
Verify the Layered Network Management operator is running.
```
kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
azedge-lnm-operator-598cc495c-5428j   1/1     Running   0          28h
```

## Config Layered Network Management Service

#### Create Layered Network Management custom resource

Create a `lnm-cr.yaml` file as specified below

```
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
> For debugging or experiment purpose, change the value of "loglevel" to **"debug".**  

Create the Custom Resource to create a Layered Network Management instance
```bash
kubectl apply -f lnm-cr.yaml
```

View the Layered Network Management Kubernetes service:
```
kubectl get services
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                                      AGE
lnm-level-4   LoadBalancer   10.43.91.54   192.168.0.4   80:30530/TCP,443:31117/TCP,10000:31914/TCP   95s
```

#### Add iptables configuration
> This step is for AKS EE only.

The Layered Network Management deployment creates a Kubernetes service of type LoadBalancer. To ensure that the service is accessible from outside the Kubernetes cluster, you need to map the underlying windows host's ports to the appropriate ports on the Layered Network Management service. 
```bash
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=443 connectaddress=192.168.0.4
netsh interface portproxy add v4tov4 listenport=10000 listenaddress=0.0.0.0 connectport=10000 connectaddress=192.168.0.4
```
After these commands are run successfully, traffic received on ports 443 and 10,000 on the windows host is routed through to the Kubernetes service.

## Related content

TODO: Add your next step link(s)
