---
title: Deploy Azure IoT Layered Network Management to an AKS cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure Azure IoT Layered Network Management to an AKS cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/07/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---
# Deploy Azure IoT Layered Network Management to an AKS cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you set up the Layered Network Management on a level4 and level 3 Purdue network. Network level 4 has internet access and level 3 doesn't.

- Level 4 an AKS cluster with Layered Network Management deployed.
- Level 3 is a K3S cluster running on a Linux VM that uses the Layered Network Management instance in level 4 to achieve connection to Azure. The level 3 network is configured to have outbound access to the level 4 network on ports 443 and 8084. All other outbound access is disabled.

The Layered Network Management architecture requires DNS configuration on the level 3 network, where the allowlisted URLs are repointed to the level 4 network. In this example, this setup is accomplished using an automated setup that's built on CoreDNS, the default DNS resolution mechanism that ships with k3s.

The setup is done using a jumpbox or installation machine that has access to the internet and both the level 3 and level 4 networks.

## Prerequisites

- An AKS cluster
- An Azure Linux Ubuntu **22.04.3 LTS** VM

## Deploy Layered Network Management to the internet-facing cluster

These steps deploy Layered Network Management to the AKS cluster. The cluster is the top layer in the ISA-95 model. At the end of this section, you have an instance of Layered Network Management that's ready to accept traffic from the Azure Arc-enabled cluster below and support the deployment of the Azure IoT Operations service.

1. Configure `kubectl` to manage your **AKS cluster** from your jumpbox by following the steps in [Connect to the cluster](/azure/aks/learn/quick-kubernetes-deploy-portal?tabs=azure-cli#connect-to-the-cluster).

1. Install the Layered Network Management operator with the following Azure CLI command:

    ```bash
    az login

    az k8s-extension create --resource-group <RESOURCE GROUP> --name kind-lnm-extension --cluster-type connectedClusters --cluster-name <CLUSTER NAME> --auto-upgrade false --extension-type Microsoft.IoTOperations.LayeredNetworkManagement --version 0.1.0-alpha.5 --release-train private-preview
    ```

1. To validate the installation was successful, run:

    ```bash
    kubectl get pods
    ```

    You should see an output that looks like the following example:

    ```Output
    NAME                                    READY   STATUS        RESTARTS   AGE
    aio-lnm-operator-7db49dc9fd-kjf5x   1/1     Running       0          78s
    ```

1. Create the Layered Network Management custom resource by creating a file named *level4.yaml* with the following contents:

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

1. To create the Layered Network Management instance based on the *level4.yaml* file, run:

    ```bash
    kubectl apply -f level4.yaml
    ```
    This step creates *n* pods, one service, and two config maps. *n* is based on the number of replicas in the custom resource.

1. To validate the instance, run:

    ```bash
    kubectl get pods
    ```

    The output should look like:

    ```Output
    NAME                                    READY       STATUS    RESTARTS   AGE
    aio-lnm-operator-7db49dc9fd-kjf5x   1/1     Running       0          78s
    lnm-level4-7598574bf-2lgss          1/1     Running       0          4s
    ```

1. To view the service, run:

    ```bash
    kubectl get services
    ```

    The output should look like the following example:

    ```Output
    NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
    lnm-level4   LoadBalancer   10.0.141.101   20.81.111.118   80:30960/TCP,443:31214/TCP   29s
    ```
1. To view the config maps, run:

    ```bash
    kubectl get cm
    ```
    The output should look like the following example:
    ```
    NAME                           DATA   AGE
    aio-lnm-level4-config          1      50s
    aio-lnm-level4-client-config   1      50s
    ```

1. In this example, the Layered Network Management instance is ready to accept traffic on the external IP `20.81.111.118`.

## Provision the cluster in the adjacent isolated layer to Arc

In level 3, you create a K3S kubernetes cluster on a Linux VM and Arc-enable it using the Layered Network Management instance at level 4.

1. On the Linux VM, install and configure K3S using the following commands:

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```

1. Set up the jumpbox to have *kubectl* access to the cluster.
   
   Generate the config file on your Linux VM.
   
   ```bash
   k3s kubectl config view --raw > config.level3
   ```

   On your jumpbox, set up kubectl access to the level 3 k3s cluster by copying the `config.level3` file into the `~/.kube` directory and rename it to `config`. The server entry in the config file should be set to the IP address or domain name of the level 3 VM.

1. Refer to [Configure CoreDNS](howto-configure-layered-network.md#configure-coredns) to use extension mechanisms provided by CoreDNS (the default DNS server for K3S clusters) to add the allowlisted URLs to be resolved by CoreDNS.

1. Run the following commands on your jumpbox to connect the cluster to Arc. This step requires Azure CLI. Install the [Az CLI](/cli/azure/install-azure-cli-linux) if needed.

    ```bash
    az login
    az account set --subscription <your Azure subscription ID>
    
    az connectedk8s connect -g <your resource group name> -n <your connected cluster name>
    ```

    For more information about *connectedk8s*, see [Quickstart: Connect an existing Kubernetes cluster to Azure Arc ](/azure/azure-arc/kubernetes/quickstart-connect-cluster).

1. You should see output like the following example:
    
    ```Output
    This operation might take a while...
    
    The required pre-checks for onboarding have succeeded.
    Azure resource provisioning has begun.
    Azure resource provisioning has finished.
    Starting to install Azure arc agents on the Kubernetes cluster.
    {
      "agentPublicKeyCertificate": "MIICCgKCAgEAmU+Pc55pc3sOE2Jo5JbAdk+2OprUziCbgfGRFfbMHO4dT7A7LDaDk7tWwvz5KwUt66eMrabI7M52H8xXvy1j7YwsMwR5TaSeHpgrUe1/4XNYKa6SN2NbpXIXA3w4aHgtKzENm907rYMgTO9gBJEZNJpqsfCdb3E7AHWQabUe9y9T8aub+arBHLQ3furGkv8JnN2LCPbvLnmeLfc1J5
      ....
      ....
    ```
1. Your Kubernetes cluster is now Arc-enabled and is listed in the resource group you provided in the az connectedk8s connect command. You can also validate the provisioning of this cluster through the Azure portal. This quickstart is for showcasing the capability of Layered Network Management to enable Arc for your Kubernetes cluster. You can now try the built-in Arc experiences on this cluster within the isolated network.

## Related content

- [Create sample network environment](./howto-configure-layered-network.md)
