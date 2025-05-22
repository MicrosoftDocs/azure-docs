---
title: "Quickstart: Configure Layered Network Management (preview) to Arc-enable a cluster in Azure environment"
description: Deploy Azure IoT Layered Network Management (preview) to an AKS cluster and Arc-enable a cluster on an Ubuntu VM.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 12/12/2024

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
ms.service: azure-iot-operations
---
# Quickstart: Configure Azure IoT Layered Network Management (preview) to Arc-enable a cluster in Azure environment

In this quickstart, you set up the Azure IoT Layered Network Management (preview) on a level 4 and level 3 Purdue network. Network level 4 has internet access and level 3 doesn't. You configure the Layered Network Management (preview) to route network traffic from level 3 to Azure. Finally, you can Arc-enable the K3S cluster in level 3 even it isn't directly connected to the internet.

- Level 4 an AKS cluster with Layered Network Management deployed.
- Level 3 is a K3S cluster running on a Linux VM that uses the Layered Network Management instance in level 4 to achieve connection to Azure. The level 3 network is configured to have outbound access to the level 4 network on ports 443 and 8084. All other outbound access is disabled.

The Layered Network Management architecture requires DNS configuration on the level 3 network, where the allowlisted URLs are repointed to the level 4 network. In this example, this setup is accomplished using an automated setup that's built on CoreDNS, the default DNS resolution mechanism that ships with k3s.


## Prerequisites
These prerequisites are only for deploying the Layered Network Management independently and Arc-enable the child level cluster.

- An [AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-portal)
- An Azure Linux Ubuntu **22.04.3 LTS** virtual machine
- A jumpbox or setup machine that has access to the internet and both the level 3 and level 4 networks

## Deploy Layered Network Management (preview) to the AKS cluster

These steps deploy Layered Network Management to the AKS cluster. The cluster is the top layer in the ISA-95 model. At the end of this section, you have an instance of Layered Network Management that's ready to accept traffic from the Azure Arc-enabled cluster below and support the deployment of the Azure IoT Operations service.

1. Configure `kubectl` to manage your **AKS cluster** from your jumpbox by following the steps in [Connect to the cluster](/azure/aks/learn/quick-kubernetes-deploy-portal?tabs=azure-cli#connect-to-the-cluster).

1. Install the Layered Network Management operator with the following Azure CLI command:

    ```bash
    az login

    az k8s-extension create --resource-group <RESOURCE GROUP> --name kind-lnm-extension --cluster-type connectedClusters --cluster-name <CLUSTER NAME> --auto-upgrade false --extension-type Microsoft.IoTOperations.LayeredNetworkManagement --version 0.1.0-preview --release-train preview
    ```

1. To validate the installation was successful, run:

    ```bash
    kubectl get pods
    ```

    You should see an output that looks like the following example:

    ```Output
    NAME                                READY   STATUS        RESTARTS   AGE
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
    NAME                                    READY       STATUS    RESTARTS       AGE
    aio-lnm-operator-7db49dc9fd-kjf5x       1/1         Running       0          78s
    aio-lnm-level4-7598574bf-2lgss          1/1         Running       0          4s
    ```

1. To view the service, run:

    ```bash
    kubectl get services
    ```

    The output should look like the following example:

    ```Output
    NAME              TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
    aio-lnm-level4    LoadBalancer   10.0.141.101   20.81.111.118   80:30960/TCP,443:31214/TCP   29s
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

## Prepare the level 3 cluster
In level 3, you create a K3S Kubernetes cluster on a Linux virtual machine. To simplify setting up the cluster, you can create the Azure Linux Ubuntu 22.04.3 LTS VM with internet access and enable ssh from your jumpbox.

> [!TIP]
> In a more realistic scenario that starts the setup in isolated network, you can prepare the machine with the pre-built image for your solution or the [Air-Gap Install](https://docs.k3s.io/installation/airgap) approach of K3S.

1. On the Linux VM, install and configure K3S using the following commands:

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --write-kubeconfig-mode 644
    ```
1. Configure network isolation for level 3. Use the following steps to configure the level 3 cluster to only send traffic to Layered Network Management in level 4.
    - Browse to the **network security group** of the VM's network interface.
    - Add an extra outbound security rule to **deny all outbound traffic** from the level 3 virtual machine.
    - Add another outbound rule with the highest priority to **allow outbound to the IP of level 4 AKS cluster on ports 443 and 8084**.

    :::image type="content" source="./media/howto-deploy-aks-layered-network/outbound-rules.png" alt-text="Screenshot of network security group outbound rules." lightbox="./media/howto-deploy-aks-layered-network/outbound-rules.png":::

## Provision the cluster in isolated layer to Arc

With the following steps, you Arc-enable the level 3 cluster using the Layered Network Management instance at level 4.

1. Set up the jumpbox to have *kubectl* access to the cluster.
   
   Generate the config file on your Linux VM.
   
   ```bash
   k3s kubectl config view --raw > config.level3
   ```

   On your jumpbox, set up kubectl access to the level 3 k3s cluster by copying the `config.level3` file into the `~/.kube` directory and rename it to `config`. The server entry in the config file should be set to the IP address or domain name of the level 3 VM.

1. Refer to [Configure CoreDNS](howto-configure-layered-network.md#configure-coredns) to use extension mechanisms provided by CoreDNS (the default DNS server for K3S clusters) to add the allowlisted URLs.

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

## Next steps

- To understand how to set up a cluster in isolated network for Azure IoT Operations to be deployed, see [Configure Layered Network Management service to enable Azure IoT Operations in an isolated network](howto-configure-aks-edge-essentials-layered-network.md)
- To get more detail about setting up comprehensive network environments for Azure IoT Operations related scenarios, see [Create sample network environment](./howto-configure-layered-network.md)

