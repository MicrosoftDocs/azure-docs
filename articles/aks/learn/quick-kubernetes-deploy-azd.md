---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure Developer CLI (AZD)'
description: Learn how to quickly deploy a Kubernetes cluster and deploy an application in Azure Kubernetes Service (AKS) using the AZD CLI.
ms.topic: quickstart
ms.date: 02/06/2024
ms.custom: H1Hack27Feb2017, mvc, devcenter, seo-javascript-september2019, seo-javascript-october2019, seo-python-october2019, devx-track-azurecli, contperf-fy21q1, mode-api, linux-related-content, devx-track-extended-azdevcli
#Customer intent: As a developer or cluster operator, I want to deploy an AKS cluster and deploy an application so I can see how to run applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure Developer CLI (AZD)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you learn to:

- Deploy an AKS cluster using the Azure Developer CLI (AZD).
- Run a sample multi-container application with a group of microservices simulating a retail app.
- Teardown and clean up containers using AZD.

> [!NOTE]
> To get started with quickly provisioning an AKS cluster, this article includes steps to deploy a cluster with default settings for evaluation purposes only. Before deploying a production-ready cluster, we recommend that you familiarize yourself with our [baseline reference architecture][baseline-reference-architecture] to consider how it aligns with your business requirements.

## Before you begin

There are two methods for the quickstart. Choosing Azure Developer CLI is a more automated process that uses scripts to run the Azure CLI commands and resource provisioning.

> [!NOTE]
> For Windows users, follow the guide for the Azure CLI instead. The AZD Template repository doesn't support PowerShell commands yet. 

## Azure Developer CLI

- An Azure account with an active subscription. Create an account for free
- The Azure Developer CLI
- The latest .NET 7.0 SDK
- A Linux OS

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.64 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed there.
- Check the identity you're using to create your cluster has the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../concepts-identity.md).

## Sample Code

All code used in the quickstart is available at [Azure-Samples/aks-store-demo](https://github.com/Azure-Samples/aks-store-demo).

The quickstart application includes the following Kubernetes deployments and services:

:::image type="content" source="media/quick-kubernetes-deploy-portal/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="media/quick-kubernetes-deploy-portal/aks-store-architecture.png":::

- **Store front**: Web application for customers to view products and place orders.
- **Product service**: Shows product information.
- **Order service**: Places orders.
- **Rabbit MQ**: Message queue for an order queue.

> [!NOTE]
> We don't recommend running stateful containers, such as Rabbit MQ, without persistent storage for production use. These are used here for simplicity, but we recommend using managed services instead, such as Azure CosmosDB or Azure Service Bus.

### Template Command

You can quickly clone the application with `azd init` with the name of the repo using the template argument.

For instance, our code sample is at: `azd init --template aks-store-demo`.

### Git

Alternatively, you can clone the application directly through GitHub, then run `azd init` from inside the directory to create configurations for the AZD CLI. 

When prompted for an environment name you can choose anything, but our quickstart uses `aksqs`.

## Sign in to your Azure Cloud account

The Azure Development Template contains all the code needed to create the services, but you need to sign in to host them on Azure Kubernetes Service.

Run `azd auth login` 

1. Copy the device code that appears.
1. Hit enter to open in a new tab the auth portal.
1. Enter in your Microsoft Credentials in the new page.
1. Confirm that it's you trying to connect to Azure CLI. If you encounter any issues, skip to the Troubleshooting section.
1. Verify the message "Device code authentication completed. Logged in to Azure." appears in your original terminal.

[!INCLUDE [azd-login-ts](../includes/azd/azd-login-ts.md)]

- If you have multiple Azure subscriptions, select the appropriate subscription for billing using the [az account set](/cli/azure/account#az-account-set) command.

## Create resources for your cluster

The step can take longer depending on your internet speed.

1. Create all your resources with the `azd up` command.
1. Select which Azure subscription and region for your AKS Cluster.
1. Wait as azd automatically runs the commands for pre-provision and post-provision steps.
1. At the end, your output shows the newly created deployments and services.

    ```output
    deployment.apps/rabbitmq created
    service/rabbitmq created
    deployment.apps/order-service created
    service/order-service created
    deployment.apps/product-service created
    service/product-service created
    deployment.apps/store-front created
    service/store-front created
    ```

## Test the application

When your application is created, a Kubernetes service exposes the application's front end service to the internet. This process can take a few minutes to complete. Once completed, follow these steps verify and test the application by opening up the store-front page.

1. Set your namespace as the demo namespace `pets` with the `kubectl set-context` command.

    ```console
    kubectl config set-context --current --namespace=pets
    ```

1. View the status of the deployed pods with the [kubectl get pods][kubectl-get] command. 

    Check that all pods are in the `Running` state before proceeding:

    ```console
    kubectl get pods
    ```

1. Search for a public IP address for the front end store-front application. 

    Monitor progress using the [kubectl get service][kubectl-get] command with the `--watch` argument:

    ```azurecli
    kubectl get service store-front --watch
    ```

    The **EXTERNAL-IP** output for the `store-front` service initially shows as *pending*:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   <pending>     80:30025/TCP   4h4m
    ```

1. When the **EXTERNAL-IP** address changes from *pending* to a public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following sample output shows a valid public IP address assigned to the service:

    ```output
    NAME          TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
    store-front   LoadBalancer   10.0.100.10   20.62.159.19   80:30025/TCP   4h5m
    ```

1. Open a web browser using the external IP address of your service to view the Azure Store app in action.

    :::image type="content" source="media/quick-kubernetes-deploy-cli/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="media/quick-kubernetes-deploy-cli/aks-store-application.png":::

### Visit the store-front

Once on the store page, you can add new items to your cart and check them out. To verify, visit the Azure Service in your portal to view the records of the transactions for your store app.

## Delete the cluster

Once you're finished with the quickstart, remember to clean up all your resources to avoid Azure charges. 

Run `azd down` to delete all your resources used in the quickstart, which includes your resource group, cluster, and related Azure Services.

> [!NOTE]
> This sample application is for demo purposes and doesn't represent all the best practices for Kubernetes applications. 
> For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed a simple multi-container application to it. You hosted a store app, but there's more to learn in the [AKS tutorial][aks-tutorial].

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[baseline-reference-architecture]: /azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
