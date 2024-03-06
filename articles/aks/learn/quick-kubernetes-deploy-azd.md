---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure Developer CLI (AZD)'
description: Learn how to quickly deploy a Kubernetes cluster and deploy an application in Azure Kubernetes Service (AKS) using the AZD CLI.
ms.topic: quickstart
ms.date: 03/06/2024
ms.custom: H1Hack27Feb2017, mvc, devcenter, seo-javascript-september2019, seo-javascript-october2019, seo-python-october2019, devx-track-azurecli, contperf-fy21q1, mode-api, linux-related-content, devx-track-extended-azdevcli
#Customer intent: As a developer or cluster operator, I want to deploy an AKS cluster and deploy an application so I can see how to run applications using the managed Kubernetes service in Azure.
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure Developer CLI (AZD)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this quickstart, you learn to:

- Download and run Azure Developer Templates.
- Deploy an AKS cluster using the Azure Developer CLI (AZD).
- Run a sample multi-container application with a group of microservices that simulates a retail app.
- Delete and cleanup containers made from AZD templates.

> [!NOTE]
> To get started with quickly provisioning an AKS cluster, this article includes steps to deploy a cluster with default settings for evaluation purposes only. Before deploying a production-ready cluster, we recommend that you familiarize yourself with our [baseline reference architecture][baseline-reference-architecture] to consider how it aligns with your business requirements.

## Before you begin

This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

- [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- This article requires version 1.6.1 or later of the Azure Developer CLI. If you're using Azure Cloud Shell, the latest version is already installed there.

- Install the [Azure Developer CLI][azd-install] or download updates. 

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

## Clone app with the Azure Developer Template

The AZD CLI provides an interface to clone the files directly from GitHub or register existing folders as templates. 
You can quickly clone the sample application with `azd init` followed by the name of the repository as the template argument.

1. Create the AKS Store Demo by cloning from Azure-Samples/aks-store-demo through azd.

    ```azurecli-interactive
    azd init --template aks-store-demo
    ```

2. Choose an environment name for your project that uses only alphanumeric characters and hyphens.

    ```output
    Enter a new environment name: [? for help] 
    ```

## Sign in to your Azure Cloud account

The Azure Development Template contains all the code needed to create the services, but you need to sign in to your Azure account in order to host the application on AKS.

1. Sign in to your account with azd.

    ```azurecli-interactive
    azd auth login
    ```

1. Copy the device code that appears then press enter to sign-in.

    ```output
    Start by copying the next code: B8APV276M
    Then press enter and continue to log in from your browser...
    ```

1. Authenticate with your credentials on your organization's sign in page.

1. Confirm that it's you trying to connect to Azure CLI. If you encounter any issues, skip to the Troubleshooting section.

1. Verify the message "Device code authentication completed. Logged in to Azure." appears in your original terminal.

    ```output
    Waiting for you to complete authentication in the browser...
    Device code authentication completed.
    Logged in to Azure.
    ```

[!INCLUDE [azd-login-ts](../includes/azd/azd-login-ts.md)]

- If you have multiple Azure subscriptions, select the appropriate subscription for billing using the [az account set](/cli/azure/account#az-account-set) command.

## Create resources for your cluster

The step can take longer depending on your internet speed.

1. Create all your resources with the `azd up` command.

    ```azurecli-interactive
    azd up
    ```

1. Select an Azure subscription for your billing usage.

    ```output
    ? Select an Azure Subscription to use:  [Use arrows to move, type to filter]
    > 1. My Azure Subscription (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    ```

1. Select a region to deploy your application to.

    ```output
    Select an Azure location to use:  [Use arrows to move, type to filter]
      40. (South America) Brazil Southeast (brazilsoutheast)
      41. (US) Central US (centralus)
      42. (US) East US (eastus)
    > 43. (US) East US 2 (eastus2)
      44. (US) East US STG (eastusstg)
      45. (US) North Central US (northcentralus)
      46. (US) South Central US (southcentralus)
    ```

1. Wait as azd automatically runs the commands for pre-provision and post-provision steps.

    ```output
    SUCCESS: Your up workflow to provision and deploy to Azure completed in 9 minutes 40 seconds.
    ```

## Test the application

When your application is created, a Kubernetes service exposes the application's front end service to the internet. This process can take a few minutes to complete.

1. Set your namespace as the demo namespace `pets` with the `kubectl set-context` command.

    ```console
    kubectl config set-context --current --namespace=pets
    ```

1. View the status of the deployed pods with the [kubectl get pods][kubectl-get] command. 

    Display all deployed pods in your namespace:

    ```console
    kubectl get pods
    ```

    Inspect the status in these services are `Running`:

    ```output
    NAME                               READY   STATUS 
    order-service-8dfcffdd4-9zdj8      1/1     Running
    product-service-848898fcc-4988r    1/1     Running
    store-front-6774d4856d-2g4rn       1/1     Running
    virtual-customer-8485855-ztgdw     1/1     Running
    virtual-worker-7db7f799f-lkxnq     1/1     Running
    ```

1. Search for a public IP address for the front end store-front application. 

    Monitor progress using the [kubectl get service][kubectl-get] command with the `--watch` argument:

    ```console
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

1. Use `azd down` to delete all your resources used in the quickstart, which includes your resource group, cluster, and related Azure Services.

    ```azurecli-interactive
    azd down
    ```

    Confirm your decision to remove all used resources from your subscription.

    ```output
    ? Total resources to delete: 14, are you sure you want to continue? (y/N)
    ```
 
1. Allow purge to reuse the quickstart variables if applicable.

    ```output
    [Warning]: These resources have soft delete enabled allowing them to be recovered for a period or time after deletion. During this period, their names may not be reused. In the future, you can use the argument --purge to skip this confirmation.

    ? Would you like to permanently delete these resources instead, allowing their names to be reused? (y/N)
    ```

1. Close the terminal once the cleanup process is complete.

    ```output
    SUCCESS: Your application was removed from Azure in 14 minutes 30 seconds.
    ```

> [!NOTE]
> This sample application is for demo purposes and doesn't represent all the best practices for Kubernetes applications. 
> For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

## Next steps

In this quickstart, you deployed a Kubernetes cluster and then deployed a simple multi-container application to it. This sample application is for demo purposes only and doesn't represent all the best practices for Kubernetes applications. For guidance on creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

To learn more about AKS and walk through a complete code-to-deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azd-install]: /azure/developer/azure-developer-cli/install-azd
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[kubernetes-deployment]: ../concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
[baseline-reference-architecture]: /azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/aks/toc.json&bc=/azure/aks/breadcrumb/toc.json
