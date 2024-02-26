---
title: Kubernetes on Azure tutorial - Update an application
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to update an existing application deployment to AKS with a new version of the application code.
ms.topic: tutorial
ms.date: 05/23/2023
ms.custom: mvc
#Customer intent: As a developer, I want to learn how to update an existing application deployment in an Azure Kubernetes Service (AKS) cluster so that I can maintain the application lifecycle.
---

# Tutorial: Update an application in Azure Kubernetes Service (AKS)

After an application has been deployed in Kubernetes, it can be updated by specifying a new container image or image version. An update is staged so that only a portion of the deployment is updated at the same time. This staged update enables the application to keep running during the update. It also provides a rollback mechanism if a deployment failure occurs.

In this tutorial, part six of seven, the sample Azure Vote app is updated. You learn how to:

> [!div class="checklist"]
> * Update the front-end application code
> * Create an updated container image
> * Push the container image to Azure Container Registry
> * Deploy the updated container image

## Before you begin

In previous tutorials, an application was packaged into a container image. This image was uploaded to Azure Container Registry, and you created an AKS cluster. The application was then deployed to the AKS cluster.

An application repository was also cloned that includes the application source code, and a pre-created Docker Compose file used in this tutorial. Verify that you've created a clone of the repo, and have changed directories into the cloned directory. If you haven't completed these steps, and want to follow along, start with [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Update an application

Let's make a change to the sample application, then update the version already deployed to your AKS cluster. Make sure that you're in the cloned *azure-voting-app-redis* directory. The sample application source code can then be found inside the *azure-vote* directory. Open the *config_file.cfg* file with an editor, such as `vi`:

```console
vi azure-vote/azure-vote/config_file.cfg
```

Change the values for *VOTE1VALUE* and *VOTE2VALUE* to different values, such as colors. The following example shows the updated values:

```
# UI Configurations
TITLE = 'Azure Voting App'
VOTE1VALUE = 'Blue'
VOTE2VALUE = 'Purple'
SHOWHOST = 'false'
```

Save and close the file. In `vi`, use `:wq`.

## Update the container image

To re-create the front-end image and test the updated application, use [docker-compose][docker-compose]. The `--build` argument is used to instruct Docker Compose to re-create the application image:

```console
docker-compose up --build -d
```

## Test the application locally

To verify that the updated container image shows your changes, open a local web browser to `http://localhost:8080`.

:::image type="content" source="media/container-service-kubernetes-tutorials/vote-app-updated.png" alt-text="Screenshot showing an example of the updated container image Azure Voting App running locally opened in a local web browser":::

The updated values provided in the *config_file.cfg* file are displayed in your running application.

## Tag and push the image

### [Azure CLI](#tab/azure-cli)

To correctly use the updated image, tag the *azure-vote-front* image with the login server name of your ACR registry. Get the login server name with the [az acr list][az-acr-list] command:

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

### [Azure PowerShell](#tab/azure-powershell)

To correctly use the updated image, tag the *azure-vote-front* image with the login server name of your ACR registry. Get the login server name with the [Get-AzContainerRegistry][get-azcontainerregistry] cmdlet:

```azurepowershell
(Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name <acrName>).LoginServer
```

---

Use [docker tag][docker-tag] to tag the image. Replace `<acrLoginServer>` with your ACR login server name or public registry hostname, and update the image version to *:v2* as follows:

```console
docker tag mcr.microsoft.com/azuredocs/azure-vote-front:v1 <acrLoginServer>/azure-vote-front:v2
```

Now use [docker push][docker-push] to upload the image to your registry. Replace `<acrLoginServer>` with your ACR login server name.

### [Azure CLI](#tab/azure-cli)

> [!NOTE]
> If you experience issues pushing to your ACR registry, make sure that you are still logged in. Run the [az acr login][az-acr-login] command using the name of your Azure Container Registry that you created in the [Create an Azure Container Registry](tutorial-kubernetes-prepare-acr.md#create-an-azure-container-registry) step. For example, `az acr login --name <azure container registry name>`.

### [Azure PowerShell](#tab/azure-powershell)

> [!NOTE]
> If you experience issues pushing to your ACR registry, make sure that you are still logged in. Run the [Connect-AzContainerRegistry][connect-azcontainerregistry] cmdlet using the name of your Azure Container Registry that you created in the [Create an Azure Container Registry](tutorial-kubernetes-prepare-acr.md#create-an-azure-container-registry) step. For example, `Connect-AzContainerRegistry -Name <azure container registry name>`.

---

```console
docker push <acrLoginServer>/azure-vote-front:v2
```

## Deploy the updated application

To provide maximum uptime, multiple instances of the application pod must be running. Verify the number of running front-end instances with the [kubectl get pods][kubectl-get] command:

```
$ kubectl get pods

NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-217588096-5w632    1/1       Running   0          10m
azure-vote-front-233282510-b5pkz   1/1       Running   0          10m
azure-vote-front-233282510-dhrtr   1/1       Running   0          10m
azure-vote-front-233282510-pqbfk   1/1       Running   0          10m
```

If you don't have multiple front-end pods, scale the *azure-vote-front* deployment as follows:

```console
kubectl scale --replicas=3 deployment/azure-vote-front
```

To update the application, use the [kubectl set][kubectl-set] command. Update `<acrLoginServer>` with the login server or host name of your container registry, and specify the *v2* application version:

```console
kubectl set image deployment azure-vote-front azure-vote-front=<acrLoginServer>/azure-vote-front:v2
```

To monitor the deployment, use the [kubectl get pod][kubectl-get] command. As the updated application is deployed, your pods are terminated and re-created with the new container image.

```console
kubectl get pods
```

The following example output shows pods terminating and new instances running as the deployment progresses:

```
$ kubectl get pods

NAME                               READY     STATUS        RESTARTS   AGE
azure-vote-back-2978095810-gq9g0   1/1       Running       0          5m
azure-vote-front-1297194256-tpjlg  1/1       Running       0          1m
azure-vote-front-1297194256-tptnx  1/1       Running       0          5m
azure-vote-front-1297194256-zktw9  1/1       Terminating   0          1m
```

## Test the updated application

To view the update application, first get the external IP address of the `azure-vote-front` service:

```console
kubectl get service azure-vote-front
```

Now open a web browser to the IP address of your service:

:::image type="content" source="media/container-service-kubernetes-tutorials/vote-app-updated-external.png" alt-text="Screenshot showing an example of the updated image Azure Voting App running in an AKS cluster opened in a local web browser.":::

## Next steps

In this tutorial, you updated an application and rolled out this update to your AKS cluster. You learned how to:

> [!div class="checklist"]
> * Update the front-end application code
> * Create an updated container image
> * Push the container image to Azure Container Registry
> * Deploy the updated container image

Advance to the next tutorial to learn how to upgrade an AKS cluster to a new version of Kubernetes.

> [!div class="nextstepaction"]
> [Upgrade Kubernetes][aks-tutorial-upgrade]

<!-- LINKS - external -->
[docker-compose]: https://docs.docker.com/compose/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-set]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#set

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-upgrade]: ./tutorial-kubernetes-upgrade-cluster.md
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-list]: /cli/azure/acr#az_acr_list
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azcontainerregistry]: /powershell/module/az.containerregistry/get-azcontainerregistry
[connect-azcontainerregistry]: /powershell/module/az.containerregistry/connect-azcontainerregistry
