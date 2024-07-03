---
title: Connect to self-hosted Prometheus on an AKS cluster via managed private endpoint
titleSuffix: Azure Managed Grafana
description: In this tutorial, learn how to connect to self-hosted Prometheus on an AKS Cluster using a managed private endpoint.
services: managed-grafana
author: weng5e
ms.topic: tutorial
ms.date: 02/21/2024
ms.author: wuweng
---

# Tutorial: connect to a self-hosted Prometheus service on an AKS cluster using a managed private endpoint

This guide walks you through the steps of installing Prometheus, an open-source monitoring and alerting toolkit, on an Azure Kubernetes Service (AKS) cluster. Then you use Azure Managed Grafana's managed private endpoint to connect to this Prometheus server and display the Prometheus data in a Grafana dashboard.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Kubernetes Service Cluster
> * Install Prometheus
> * Add a private link service to the Prometheus server
> * Connect with managed private endpoint
> * Display Prometheus data in a Grafana dashboard

## Prerequisites

Before you begin, make sure you have the following:

- An [Azure account](https://azure.microsoft.com/free)
- The [Azure CLI](/cli/azure/install-azure-cli).
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)

## Create an Azure Kubernetes Service Cluster

1. Sign into the Azure CLI by running the `az login` command.

    ```azurecli
    az login
    ```

    If you have multiple Azure subscriptions, select your Azure subscription with the command `az account set -s <your-azure-subscription-id>`.

1. Install or update kubectl.

    ```azurecli
    az aks install-cli
    ```

1. Create two bash/zsh variables, which we'll use in subsequent commands. Change the syntax below if you're using another shell.

    ```bash
    RESOURCE_GROUP=myResourceGroup 
    AKS_NAME=myaks
    ```

1. Create a resource group. In this example, we create the resource group in the  West Central US Azure region.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location westcentralus
    ```

1. Create a new AKS cluster using the [az aks create](/cli/azure/aks#az-aks-create) command. Here we create a three-node cluster using the B-series Burstable virtual machine type, which is cost-effective and suitable for small test/dev workloads such as this.

    ```azurecli
    az aks create --resource-group $RESOURCE_GROUP \
      --name $AKS_NAME \
      --node-count 3 \
      --node-vm-size Standard_B2s \
      --generate-ssh-keys
    ```

    This operation may take a few minutes to complete.

1. Authenticate to the cluster you've created.

    ```azurecli
    az aks get-credentials \
      --resource-group $RESOURCE_GROUP \
      --name $AKS_NAME
    ```

    You can now access your Kubernetes cluster with kubectl.

1. Use kubectl to see the nodes you've created.

    ```console
    kubectl get nodes
    ```

## Install Prometheus

A popular way of installing Prometheus is through the [prometheus-operator](https://prometheus-operator.dev/), which provides Kubernetes native deployment and management of [Prometheus](https://prometheus.io/) and related monitoring components. In this tutorial, we use [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) Helm charts to deploy the prometheus-operator.

1. Add the helm-charts repository and then update your repository list.

    ```console
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    ```

1. Install the Helm chart into a namespace called monitoring. This namespace is created automatically.

    ```console
    helm install prometheus \
      prometheus-community/kube-prometheus-stack \
      --namespace monitoring \
      --create-namespace
    ```

1. The helm command prompts you to check the status of the deployed pods. Run the following command.

    ```console
    kubectl --namespace monitoring get pods
    ```

1. Make sure the pods all "Running" before you continue. If in the unlikely circumstance they don't reach the running state, you may want to troubleshoot them.

## Add a private link service to the Prometheus server

Azure [Private Link service](../private-link/private-link-service-overview.md) enables the consumption of your Kubernetes service through private link across different Azure virtual networks. AKS has a [native integration with Azure Private Link Service](https://cloud-provider-azure.sigs.k8s.io/topics/pls-integration/) and helps you annotate a Kubernetes service object to create a corresponding private link service within Azure.

See below the content of the pls-prometheus-svc.yaml file:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: prom-pls-svc
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true" # Use an internal LB with PLS
    service.beta.kubernetes.io/azure-pls-create: "true"
    service.beta.kubernetes.io/azure-pls-name: promManagedPls
    service.beta.kubernetes.io/azure-pls-proxy-protocol: "false"
    service.beta.kubernetes.io/azure-pls-visibility: "*"
spec:
  type: LoadBalancer
  selector:
    # app: myApp
    app.kubernetes.io/name: prometheus
    prometheus: prometheus-kube-prometheus-prometheus # note that this is related to the release name
  ports:
    - name: http-web
      protocol: TCP
      port: 9090
      targetPort: 9090
```

1. Run the following command to add the private link service to the Prometheus server.

    ```console
    kubectl --namespace monitoring apply -f pls-prometheus-svc.yaml
    ```

1. The private link service with name `promManagedPls` is created in the AKS managed resource group. This process takes a few minutes.

    :::image type="content" source="media/tutorial-managed-private-endpoint/private-link-service-prometheus.png" alt-text="Screenshot of the Azure platform: showing the created Private Link Service resource.":::

## Connect with a managed private endpoint

1. If you don't have an Azure Managed Grafana workspace yet, create one by following the [Azure Managed Grafana quickstart](./quickstart-managed-grafana-portal.md).
1. Open your Azure Managed Grafana workspace and go to **Networking** > **Managed Private Endpoint** > **Create**.

    :::image type="content" source="media/tutorial-managed-private-endpoint/create-managed-private-endpoint.png" alt-text="Screenshot of the Azure platform showing the managed private endpoints page within an Azure Managed Grafana resource.":::

1. Enter a name for your managed private endpoint and select your Azure subscription.
1. For **Resource type** select **Microsoft.Network/privateLinkServices (Private link services)**, and for **Target resource**, select the `promManagedPls` private link service created in the above step. Each managed private endpoint gets a private IP address. You can also provide a domain name for this managed private endpoint. The Azure Managed Grafana service ensures that this domain is resolved to the managed private endpoint's private IP inside the Azure Managed Grafana environment. For example, set the domain to `*.prom.my-own-domain.com`.

    :::image type="content" source="media/tutorial-managed-private-endpoint/private-link-service-managed-private-endpoint-create-info.png" alt-text="Screenshot of the Azure platform showing Prometheus information entered for the new managed private endpoint.":::

1. Approve the private endpoint connection by going to the promManagedPls resource. Under **Settings**, go **Private endpoint connections**, select your connection using the checkbox and **Approve**.

    :::image type="content" source="media/tutorial-managed-private-endpoint/private-link-service-approve-connection.png" alt-text="Screenshot of the Azure platform showing the Approve connection action.":::

1. After the private endpoint connection is approved, go back to your Azure Managed Grafana resource and select the **Refresh** button in the Managed Private Endpoint tab to synchronize the `Connection state`. It should now show as **Approved**.

    :::image type="content" source="media/tutorial-managed-private-endpoint/managed-private-endpoint-sync.png" alt-text="Screenshot of the Azure platform showing the Refresh button.":::

## Display Prometheus data in a Grafana dashboard

1. Add the Prometheus data source to Grafana from your Grafana portal. For more information, go to [Add a data source](./how-to-data-source-plugins-managed-identity.md#add-a-data-source). Our Prometheus URL is `http://prom-service.prom.my-own-domain.com:9090`.

    :::image type="content" source="media/tutorial-managed-private-endpoint/managed-private-endpoint-prom-datasource.png" alt-text="Screenshot of the Grafana platform showing adding Prometheus as a data source.":::

1. To leverage your self-hosted Prometheus data source, try using the [Node Exporter Full](https://grafana.com/grafana/dashboards/1860-node-exporter-full/) dashboard, ID `1860`. For more guidelines, go to [Import a dashboard from Grafana Labs](./how-to-create-dashboard.md#import-a-dashboard-from-grafana-labs).

    :::image type="content" source="media/tutorial-managed-private-endpoint/prom-sample-dashboard-1860.png" alt-text="Screenshot of the Azure Grafana platform showing the sample Prometheus dashboard.":::

## Next step

Learn how to [Use service accounts](./how-to-service-accounts.md).
