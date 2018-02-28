---
title: Quickstart - Create a private Docker registry in Azure with the Azure portal
description: Quickly learn to create a private Docker container registry with the Azure portal.
services: container-registry
author: mmacy
manager: timlt

ms.service: container-registry
ms.topic: quickstart
ms.date: 12/06/2017
ms.author: marsma
ms.custom: mvc
---

# Create a container registry using the Azure portal

An Azure container registry is a private Docker registry in Azure where you can store and manage your private Docker container images. In this quickstart, you create a container registry with the Azure portal.

To complete this quickstart, you must have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a container registry

Select **Create a resource** > **Containers** > **Azure Container Registry**.

![Creating a container registry in the Azure portal][qs-portal-01]

Enter values for **Registry name** and **Resource group**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. Create a new resource group named `myResourceGroup`, and for **SKU**, select 'Basic'. Select **Create** to deploy the ACR instance.

![Creating a container registry in the Azure portal][qs-portal-03]

In this quickstart, we create a *Basic* registry. Azure Container Registry is available in several different SKUs, described briefly in the following table. For extended details on each, see [Container registry SKUs][container-registry-skus].

[!INCLUDE [container-registry-sku-matrix](../../includes/container-registry-sku-matrix.md)]

When the **Deployment succeeded** message appears, select the container registry in the portal, then select **Access keys**.

![Creating a container registry in the Azure portal][qs-portal-05]

Under **Admin user**, select **Enable**. Take note of the following values:

* Login server
* Username
* password

You use these values in the following steps while working with your registry with the Docker CLI.

![Creating a container registry in the Azure portal][qs-portal-06]

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [docker login][docker-login] command. Replace the *username*, *password*, and *login server* values with those you noted in the previous step.

```bash
docker login --username <username> --password <password> <login server>
```

The command returns `Login Succeeded` once completed. You might also see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. See the [docker login][docker-login] command reference for more information.

## Push image to ACR

To push an image to your Azure Container Registry, you must first have an image. If needed, run the following command to pull an existing image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

Before you push the image to your registry, you must tag the image with the ACR login server name. Tag the image using the [docker tag][docker-tag] command. Replace *login server* with the login server name you recorded earlier.

```bash
docker tag microsoft/aci-helloworld <login server>/aci-helloworld:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace *login server* with the login server name of your ACR instance.

```bash
docker push <login server>/aci-helloworld:v1
```

Output from a successful `docker push` command is similar to:

```
The push refers to a repository [uniqueregistryname.azurecr.io/aci-helloworld]
7c701b1aeecd: Pushed
c4332f071aa2: Pushed
0607e25cc175: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:f2867748615cc327d31c68b1172cc03c0544432717c4d2ba2c1c2d34b18c62ba size: 1577
```

## List container images

To list the images in your ACR instance, navigate to your registry in the portal and select **Repositories**, then select the repository you created with `docker push`.

In this example, we select the **aci-helloworld** repository, and we can see the `v1`-tagged image under **TAGS**.

![Creating a container registry in the Azure portal][qs-portal-09]

## Deploy image to ACI
In order to deploy to an instance from the registry we will first need to retrieve the acr password. Step one in this process is setting admin enabled to true on the registry.  You can do that with the following command.

```azurecli
az acr update --name <acrName> --admin-enabled true
```

Now use this command to retrieve the password:
```azurecli
az acr credential show --name <acrName> --query "passwords[0].value"
```

To deploy your container image from the container registry with a resource request of 1 CPU core and 1 GB of memory, run the following command. Replace <acrLoginServer> and <acrPassword> with the values you obtained from previous commands.

```azurecli
az container create --resource-group myResourceGroup --name acr-quickstart --image <acrLoginServer>/aci-helloworld:v1 --cpu 1 --memory 1 --registry-password <acrPassword> --ip-address public --ports 80
```

You should get an intial response back from Azure Resource Manager with details on your container. To monitor the status of your container and check and see when it is running repeat the [az container show][az-container-show].  It should take less than a minute.

```azurecli
az container show --resource-group myResourceGroup --name acr-quickstart --query instanceView.state
```

## View the application
Once the deployment to ACI is successful, retrieve the containers public IP address with the [az container show][az-container-show] command:

```azurecli
az container show --resource-group myResourceGroup --name acr-quickstart --query ipAddress.ip
```

Example output: `"13.88.176.27"`

To see the running application, navigate to the public IP address in your favorite browser.

![Hello world app in the browser][aci-app-browser]

## Clean up resources

When no longer needed, delete the **myResourceGroup** resource group. Doing so will delete the resource group, ACR instance, and all container images.

![Creating a container registry in the Azure portal][qs-portal-08]

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI, and launched an instance of it via Azure Container Instances, continue to the Azure Container Instances tutorial for a deeper look at ACI.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorials][container-instances-tutorial-prepare-app]

<!-- IMAGES -->
[qs-portal-01]: ./media/container-registry-get-started-portal/qs-portal-01.png
[qs-portal-02]: ./media/container-registry-get-started-portal/qs-portal-02.png
[qs-portal-03]: ./media/container-registry-get-started-portal/qs-portal-03.png
[qs-portal-04]: ./media/container-registry-get-started-portal/qs-portal-04.png
[qs-portal-05]: ./media/container-registry-get-started-portal/qs-portal-05.png
[qs-portal-06]: ./media/container-registry-get-started-portal/qs-portal-06.png
[qs-portal-07]: ./media/container-registry-get-started-portal/qs-portal-07.png
[qs-portal-08]: ./media/container-registry-get-started-portal/qs-portal-08.png
[qs-portal-09]: ./media/container-registry-get-started-portal/qs-portal-09.png
[aci-app-browser]: ../container-instances/media/container-instances-quickstart/aci-app-browser.png


<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[container-instances-tutorial-prepare-app]: ../container-instances/container-instances-tutorial-prepare-app.md
[container-registry-skus]: container-registry-skus.md
