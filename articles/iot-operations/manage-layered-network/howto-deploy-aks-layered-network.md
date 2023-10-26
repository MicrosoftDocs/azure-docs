---
title: Deploy Azure IoT Layered Network Management to an AKS cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure Azure IoT Layered Network Management to an AKS cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/25/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---
# Deploy Azure IoT Layered Network Management to an AKS cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you configure an AKS cluster and another cluster hosted by a Linux VM. Azure IoT Layered Network Management is deployed to an AKS cluster. The Linux VM simulates a cluster in an isolated network environment by connecting to Azure through the Layered Network Management instance.

## Prerequisites

- An AKS cluster
- An Azure Linux VM

## Deploy Layered Network Management

Deploy Layered Network Management to the internet-facing cluster (top ISA-95 layer).

1. Configure `kubectl` to manage your **AKS cluster** from your working machine by following the steps in [Connect to the cluster](/azure/aks/learn/quick-kubernetes-deploy-portal?tabs=azure-cli#connect-to-the-cluster).

1. Install the Layered Network Management operator using **helm**:

    ```bash
    helm install e4in oci://alicesprings.azurecr.io/az-e4in --version 0.1.2
    ```

1. To validate the installation was successful, run:

    ```bash
    kubectl get pods
    ```

    You should see an output that looks like the following:

    ```Output
    NAME                                    READY   STATUS        RESTARTS   AGE
    azedge-e4in-operator-7db49dc9fd-kjf5x   1/1     Running       0          78s
    ```

1. Create the Layered Network Management custom resource by creating a file named *level4.yaml* with the following contents:

    ```yaml
    apiVersion: az-edge.com/v1
    kind: E4in
    metadata:
      name: level4
      namespace: default
    spec:
      image:
        pullPolicy: Always
        repository: envoyproxy/envoy
        tag: v1.27.0
      replicas: 1
      logLevel: "trace"
      openTelemetryMetricsCollectorAddr: "oc-opentelemetry-collector:4317"
      level: 4
      allowList:
        enableArcDomains: true
        domains:
        - destinationUrl: "a.b.com"
          destinationType: external
        sourceIpRange:
        - addressPrefix: "0.0.0.0"
          prefixLen: 0
    ```

1. To create the Layered Network Management instance based on the *level4.yaml* file, run:

    ```bash
    kubectl apply -f level4.yaml
    ```

1. To validate the instance, run:

    ```bash
    kubectl get pods
    ```

    The output should look like:

    ```Output
    NAME                                    READY       STATUS    RESTARTS   AGE
    azedge-e4in-operator-7db49dc9fd-kjf5x   1/1         Running   0          3m57s
    e4in-level4-7598574bf-2lgss             1/1         Running   0          4s
    ```

1. To view the service, run:

    ```bash
    kubectl get services
    ```

    The output should look like the following:

    ```Output
    NAME          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE
    e4in-level4   LoadBalancer   10.0.141.101   20.81.111.118   80:30960/TCP,443:31214/TCP   29s
    ```
  
1. In this example, the Layered Network Management instance is ready to accept traffic on the external IP `20.81.111.118`.

## Provision the cluster in the adjacent isolated layer to Arc

You can create a K3S Kubernetes cluster on the Linux VM to simulate a cluster in the ISA-95 layer one level below. Then you Arc enable it using the Layered Network Management instance previously deployed at top level.

1. On the Linux VM, install and configure K3S using the following commands:

    ```bash
    curl -sfL https://get.k3s.io | sh - 
    ```
    For more information, see the [K3S documentation](https://docs.k3s.io/quick-start).

1. Arc enable the K3S cluster using the level 4 Layered Network Management as a reverse proxy. For the reverse proxy, the following domains must point to the IP address of the level4 Layered Network Management service. For this rudimentary example setup, you achieve this through a simple localhost override. Add the following to your **/etc/hosts** file. For example, use a command like `sudo vi /etc/hosts`. Replace the example IP address (20.81.111.118) with the **EXTERNAL-IP** that you discovered in the earlier step.

    ```hosts
    20.81.111.118	management.azure.com
    20.81.111.118	dp.kubernetesconfiguration.azure.com
    20.81.111.118	.dp.kubernetesconfiguration.azure.com
    20.81.111.118	login.microsoftonline.com
    20.81.111.118	.login.microsoft.com
    20.81.111.118	.login.microsoftonline.com
    20.81.111.118	login.microsoft.com
    20.81.111.118	mcr.microsoft.com
    20.81.111.118	.data.mcr.microsoft.com
    20.81.111.118	gbl.his.arc.azure.com
    20.81.111.118	.his.arc.azure.com
    20.81.111.118	k8connecthelm.azureedge.net
    20.81.111.118	guestnotificationservice.azure.com
    20.81.111.118	.guestnotificationservice.azure.com
    20.81.111.118	sts.windows.nets
    20.81.111.118	k8sconnectcsp.azureedge.net
    20.81.111.118	.servicebus.windows.net
    20.81.111.118	servicebus.windows.net
    20.81.111.118	obo.arc.azure.com
    20.81.111.118	.obo.arc.azure.com
    20.81.111.118	adhs.events.data.microsoft.com
    20.81.111.118	dc.services.visualstudio.com
    20.81.111.118	go.microsoft.com
    20.81.111.118	onegetcdn.azureedge.net
    20.81.111.118	www.powershellgallery.com
    20.81.111.118	self.events.data.microsoft.com
    20.81.111.118	psg-prod-eastus.azureedge.net
    20.81.111.118	.azureedge.net
    20.81.111.118	api.segment.io
    20.81.111.118	nw-umwatson.events.data.microsoft.com
    20.81.111.118	sts.windows.net
    20.81.111.118	.azurecr.io
    20.81.111.118	.blob.core.windows.net
    20.81.111.118	global.metrics.azure.microsoft.scloud
    20.81.111.118	.prod.hot.ingestion.msftcloudes.com
    20.81.111.118	.prod.microsoftmetrics.com
    20.81.111.118	global.metrics.azure.eaglex.ic.gov
    ```
1. Copy the K3S configuration yaml file to `.kube/config`.

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

1. Perform the following command to connect the cluster to Arc. This step requires Azure CLI. Install the [Az CLI](/cli/azure/install-azure-cli-linux) if needed.

    ```bash
    az login
    az account set --subscription <your Azure subscription ID>
    
    az connectedk8s connect -g <your resource group name> -n <your connected cluster name>
    ```

    For more information about *connectedk8s*, see [Quickstart: Connect an existing Kubernetes cluster to Azure Arc ](/azure-arc/kubernetes/quickstart-connect-cluster).

1. You should see output like the following:
    
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
1. Your Kubernetes cluster is now Arc enabled and is listed in the resource group you provided in the `az connectedk8s connect` command. You can also validate the provisioning of this cluster through the Azure portal.

## Related content

- [Configure Azure IoT Layered Network Management Environment](./howto-configure-layered-network.md)
