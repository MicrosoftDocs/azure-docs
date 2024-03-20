---
title: Kubernetes on Azure tutorial - Deploy an application to Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you deploy a multi-container application to your cluster using images stored in Azure Container Registry.
ms.topic: tutorial
ms.date: 02/20/2023
ms.custom: mvc, devx-track-extended-azdevcli
#Customer intent: As a developer, I want to learn how to deploy apps to an Azure Kubernetes Service (AKS) cluster so that I can deploy and run my own applications.
---

# Tutorial - Deploy an application to Azure Kubernetes Service (AKS)

Kubernetes provides a distributed platform for containerized applications. You build and deploy your own applications and services into a Kubernetes cluster and let the cluster manage the availability and connectivity.

In this tutorial, part four of seven, you deploy a sample application into a Kubernetes cluster. You learn how to:

> [!div class="checklist"]
>
> * Update a Kubernetes manifest file.
> * Run an application in Kubernetes.
> * Test the application.

> [!TIP]
>
> With AKS, you can use the following approaches for configuration management:
>
> * **GitOps**: Enables declarations of your cluster's state to automatically apply to the cluster. To learn how to use GitOps to deploy an application with an AKS cluster, see the [prerequisites for Azure Kubernetes Service clusters][gitops-flux-tutorial-aks] in the [GitOps with Flux v2][gitops-flux-tutorial] tutorial.
>
> * **DevOps**: Enables you to build, test, and deploy with continuous integration (CI) and continuous delivery (CD). To see examples of how to use DevOps to deploy an application with an AKS cluster, see [Build and deploy to AKS with Azure Pipelines](./devops-pipeline.md) or [GitHub Actions for deploying to Kubernetes](./kubernetes-action.md).

## Before you begin

In previous tutorials, you packaged an application into a container image, uploaded the image to Azure Container Registry, and created a Kubernetes cluster. To complete this tutorial, you need the precreated `aks-store-quickstart.yaml` Kubernetes manifest file. This file was downloaded in the application source code from [Tutorial 1 - Prepare application for AKS][aks-tutorial-prepare-app]. 

### [Azure CLI](#tab/azure-cli)

This tutorial requires Azure CLI version 2.0.53 or later. Check your version with `az --version`. To install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires Azure PowerShell version 5.9.0 or later. Check your version with `Get-InstalledModule -Name Az`. To install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

### [Azure Developer CLI](#tab/azure-azd)

This tutorial requires Azure Developer CLI (`azd`) version 1.5.1 or later. Check your version with `azd version`. To install or upgrade, see [Install Azure Developer CLI][azure-azd-install].

---

## Update the manifest file

In these tutorials, your Azure Container Registry (ACR) instance stores the container images for the sample application. To deploy the application, you must update the image names in the Kubernetes manifest file to include your ACR login server name.

### [Azure CLI](#tab/azure-cli)

1. Get your login server address using the [`az acr list`][az-acr-list] command and query for your login server.

    ```azurecli-interactive
    az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
    ```

2. Make sure you're in the cloned *aks-store-demo* directory, and then open the manifest file with a text editor, such as `vi`.

    ```azurecli-interactive
    vi aks-store-quickstart.yaml
    ```

3. Update the `image` property for the containers by replacing *ghcr.io/azure-samples* with your ACR login server name.

    ```yaml
    containers:
    ...
    - name: order-service
      image: <acrName>.azurecr.io/aks-store-demo/order-service:latest
    ...
    - name: product-service
      image: <acrName>.azurecr.io/aks-store-demo/product-service:latest
    ...
    - name: store-front
      image: <acrName>.azurecr.io/aks-store-demo/store-front:latest
    ...
    ```

4. Save and close the file. In `vi`, use `:wq`.

### [Azure PowerShell](#tab/azure-powershell)

1. Get your login server address using the [`Get-AzContainerRegistry`][get-azcontainerregistry] cmdlet and query for your login server. Make sure you replace `<acrName>` with the name of your ACR instance.

    ```azurepowershell-interactive
    (Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name <acrName>).LoginServer
    ```

2. Make sure you're in the cloned *aks-store-demo* directory, and then open the manifest file with a text editor, such as `vi`.

    ```azurepowershell-interactive
    vi aks-store-quickstart.yaml
    ```

3. Update the `image` property for the containers by replacing *ghcr.io/azure-samples* with your ACR login server name.

    ```yaml
    containers:
    ...
    - name: order-service
      image: <acrName>.azurecr.io/aks-store-demo/order-service:latest
    ...
    - name: product-service
      image: <acrName>.azurecr.io/aks-store-demo/product-service:latest
    ...
    - name: store-front
      image: <acrName>.azurecr.io/aks-store-demo/store-front:latest
    ...
    ```

4. Save and close the file. In `vi`, use `:wq`.

### [Azure Developer CLI](#tab/azure-azd)

`azd` doesn't require a container registry step since it's in the template.

---

## Run the application

### [Azure CLI](#tab/azure-cli)

1. Deploy the application using the [`kubectl apply`][kubectl-apply] command, which parses the manifest file and creates the defined Kubernetes objects.

    ```console
    kubectl apply -f aks-store-quickstart.yaml
    ```

    The following example output shows the resources successfully created in the AKS cluster:

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

2. Check the deployment is successful by viewing the pods with `kubectl`

    ```console
    kubectl get pods
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Deploy the application using the [`kubectl apply`][kubectl-apply] command, which parses the manifest file and creates the defined Kubernetes objects.

    ```console
    kubectl apply -f aks-store-quickstart.yaml
    ```

    The following example output shows the resources successfully created in the AKS cluster:

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

2. Check the deployment is successful by viewing the pods with `kubectl`.

    ```console
    kubectl get pods
    ```

### [Azure Developer CLI](#tab/azure-azd)

Deployment in `azd` is broken down into multiple stages represented by hooks. `azd` deploys with all hooks by default.

1. Deploy the application using the `azd up` command.

    ```azdeveloper
    azd up
    ```

2. Select which subscription and region to host your Azure resources.

    ```output
    ? Select an Azure Subscription to use:  [Use arrows to move, type to filter]
    > 1. My Azure Subscription (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    Select an Azure location to use:  [Use arrows to move, type to filter]
    > 43. (US) East US 2 (eastus2)
    ```

    You can update the variables for `AZURE_LOCATION` and `AZURE_SUBSCRIPTION_ID` from inside the `.azure/<your-env-name>/.env` file.

---

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

### Command Line

1. Monitor progress using the [`kubectl get service`][kubectl-get] command with the `--watch` argument.

    ```console
    kubectl get service store-front --watch
    ```

    Initially, the `EXTERNAL-IP` for the *store-front* service shows as *pending*:

    ```output
    store-front   LoadBalancer   10.0.34.242   <pending>     80:30676/TCP   5s
    ```

2. When the `EXTERNAL-IP` address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process.

    The following example output shows a valid public IP address assigned to the service:

    ```output
    store-front   LoadBalancer   10.0.34.242   52.179.23.131   80:30676/TCP   67s
    ```

3. View the application in action by opening a web browser to the external IP address of your service.

    :::image type="content" source="./learn/media/quick-kubernetes-deploy-cli/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="./learn/media/quick-kubernetes-deploy-cli/aks-store-application.png":::

If the application doesn't load, it might be an authorization problem with your image registry. To view the status of your containers, use the `kubectl get pods` command. If you can't pull the container images, see [Authenticate with Azure Container Registry from Azure Kubernetes Service](cluster-container-registry-integration.md).

### Azure portal

Navigate to your Azure portal to find your deployment information.

1. Open your [Resource Group][azure-rg] on the Azure portal
1. Navigate to the Kubernetes service for your cluster
1. Select `Services and Ingress` under `Kubernetes Resources`
1. Copy the External IP shown in the column for store-front
1. Paste the IP into your browser and visit your store page

    :::image type="content" source="./learn/media/quick-kubernetes-deploy-cli/aks-store-application.png" alt-text="Screenshot of AKS Store sample application." lightbox="./learn/media/quick-kubernetes-deploy-cli/aks-store-application.png":::

## Next steps

In this tutorial, you deployed a sample Azure application to a Kubernetes cluster in AKS. You learned how to:

> [!div class="checklist"]
> 
> * Update a Kubernetes manifest file.
> * Run an application in Kubernetes.
> * Test the application.

In the next tutorial, you learn how to use PaaS services for stateful workloads in Kubernetes.

> [!div class="nextstepaction"]
> [Use PaaS services for stateful workloads in AKS][aks-tutorial-paas]

<!-- LINKS - external -->
[azure-rg]:https://ms.portal.azure.com/#browse/resourcegroups
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[az-acr-list]: /cli/azure/acr
[azure-azd-install]: /azure/developer/azure-developer-cli/install-azd
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azcontainerregistry]: /powershell/module/az.containerregistry/get-azcontainerregistry
[gitops-flux-tutorial]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md?toc=/azure/aks/toc.json
[gitops-flux-tutorial-aks]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md?toc=/azure/aks/toc.json#for-azure-kubernetes-service-clusters
[aks-tutorial-paas]: ./tutorial-kubernetes-paas-services.md
