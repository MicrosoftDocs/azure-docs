---
title: Quickstart - Run an application in Azure Container Instances
description: In this quickstart, you use the Azure portal to deploy an application running in a Docker container to Azure Container Instances
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: quickstart
ms.date: 10/02/2018
ms.author: danlep
ms.custom: mvc
---

# Quickstart: Run an application in Azure Container Instances

Use Azure Container Instances to run Docker containers in Azure with simplicity and speed. You don't need to deploy virtual machines or use a full container orchestration platform like Kubernetes. In this quickstart, you use the Azure portal to create a container in Azure and make its application available with a fully qualified domain name (FQDN). After configuring a few settings and deploying the container, you can browse to the running application:

![App deployed to Azure Container Instances viewed in browser][aci-portal-07]

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

If you don't have an Azure subscription, create a [free account][azure-free-account] before you begin.

## Create a container instance

Select the **Create a resource** > **Containers** > **Container Instances**.

![Begin creating a new container instance in the Azure portal][aci-portal-01]

Enter the following values in the **Container name**, **Container image**, and **Resource group** text boxes. Leave the other values at their defaults, then select **OK**.

* Container name: `mycontainer`
* Container image: `microsoft/aci-helloworld`
* Resource group: **Create new** > `myResourceGroup`

![Configuring basic settings for a new container instance in the Azure portal][aci-portal-03]

You can create both Windows and Linux containers in Azure Container Instances. For this quickstart, leave the default setting of **Linux** to deploy the Linux-based `microsoft/aci-helloworld` image.

Under **Configuration**, specify a **DNS name label** for your container. The name must be unique within the Azure region you create the container instance. Your container will be publicly reachable at `<dns-name-label>.<region>.azurecontainer.io`.

Leave the other settings in **Configuration** at their defaults, then select **OK** to validate the configuration.

![Configuring a new container instance in the Azure portal][aci-portal-04]

When the validation completes, you're shown a summary of the container's settings. Select **OK** to submit your container deployment request.

![Settings summary for a new container instance in the Azure portal][aci-portal-05]

When deployment starts, a notification appears indicating the deployment is in progress. Another notification is displayed when the container group has been deployed.

![Creation progress of a new container instance in the Azure portal][aci-portal-08]

Open the overview for the container group by navigating to **Resource Groups** > **myResourceGroup** > **mycontainer**. Take note of the **FQDN** (the fully qualified domain name) of the container instance, as well its **Status**.

![Container group overview in the Azure portal][aci-portal-06]

Once its **Status** is *Running*, navigate to the container's FQDN in your browser.

![App deployed using Azure Container Instances viewed in browser][aci-portal-07]

Congratulations! By configuring just a few settings, you've deployed a publicly accessible application in Azure Container Instances.

## View container logs

Viewing the logs for a container instance is helpful when troubleshooting issues with your container or the application it runs.

To view the container's logs, under **Settings**, select **Containers**, then **Logs**. You should see the HTTP GET request generated when you viewed the application in your browser.

![Container logs in the Azure portal][aci-portal-11]

## Clean up resources

When you're done with the container, select **Overview** for the *mycontainer* container instance, then select **Delete**.

![Deleting the container instance in the Azure portal][aci-portal-09]

Select **Yes** when the confirmation dialog appears.

![Delete confirmation of a container instance in the Azure portal][aci-portal-10]

## Next steps

In this quickstart, you created an Azure container instance from an image in the public Docker Hub registry. If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- IMAGES -->
[aci-portal-01]: ./media/container-instances-quickstart-portal/qs-portal-01.png
[aci-portal-03]: ./media/container-instances-quickstart-portal/qs-portal-03.png
[aci-portal-04]: ./media/container-instances-quickstart-portal/qs-portal-04.png
[aci-portal-05]: ./media/container-instances-quickstart-portal/qs-portal-05.png
[aci-portal-06]: ./media/container-instances-quickstart-portal/qs-portal-06.png
[aci-portal-07]: ./media/container-instances-quickstart-portal/qs-portal-07.png
[aci-portal-08]: ./media/container-instances-quickstart-portal/qs-portal-08.png
[aci-portal-09]: ./media/container-instances-quickstart-portal/qs-portal-09.png
[aci-portal-10]: ./media/container-instances-quickstart-portal/qs-portal-10.png
[aci-portal-11]: ./media/container-instances-quickstart-portal/qs-portal-11.png

<!-- LINKS - External -->
[azure-free-account]: https://azure.microsoft.com/free/