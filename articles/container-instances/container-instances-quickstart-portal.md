---
title: Quickstart - Deploy Docker container to container instance - Portal
description: In this quickstart, you use the Azure portal to quickly deploy a containerized web app that runs in an isolated Azure container instance
ms.topic: quickstart
ms.date: 03/09/2020
ms.custom: "seodec18, mvc"
---

# Quickstart: Deploy a container instance in Azure using the Azure portal

Use Azure Container Instances to run serverless Docker containers in Azure with simplicity and speed. Deploy an application to a container instance on-demand when you don't need a full container orchestration platform like Azure Kubernetes Service.

In this quickstart, you use the Azure portal to deploy an isolated Docker container and make its application available with a fully qualified domain name (FQDN). After configuring a few settings and deploying the container, you can browse to the running application:

![App deployed to Azure Container Instances viewed in browser][aci-portal-07]

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

If you don't have an Azure subscription, create a [free account][azure-free-account] before you begin.

## Create a container instance

Select the **Create a resource** > **Containers** > **Container Instances**.

![Begin creating a new container instance in the Azure portal][aci-portal-01]

On the **Basics** page, enter the following values in the **Resource group**, **Container name**, and **Container image** text boxes. Leave the other values at their defaults, then select **OK**.

* Resource group: **Create new** > `myresourcegroup`
* Container name: `mycontainer`
* Image source: **Quickstart images**
* Container image: `mcr.microsoft.com/azuredocs/aci-helloworld` (Linux)

![Configuring basic settings for a new container instance in the Azure portal][aci-portal-03]

For this quickstart, you use default settings to deploy the public Microsoft `aci-helloworld` image. This sample Linux image packages a small web app written in Node.js that serves a static HTML page. You can also bring your own container images stored in Azure Container Registry, Docker Hub, or other registries.

On the **Networking** page, specify a **DNS name label** for your container. The name must be unique within the Azure region where you create the container instance. Your container will be publicly reachable at `<dns-name-label>.<region>.azurecontainer.io`. If you receive a "DNS name label not available" error message, try a different DNS name label.

![Configuring network settings for a new container instance in the Azure portal][aci-portal-04]

Leave the other settings at their defaults, then select **Review + create**.

When the validation completes, you're shown a summary of the container's settings. Select **Create** to submit your container deployment request.

![Settings summary for a new container instance in the Azure portal][aci-portal-05]

When deployment starts, a notification appears to indicate the deployment is in progress. Another notification is displayed when the container group has been deployed.

Open the overview for the container group by navigating to **Resource Groups** > **myresourcegroup** > **mycontainer**. Take note of the **FQDN** (the fully qualified domain name) of the container instance, as well its **Status**.

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

In this quickstart, you created an Azure container instance from a public Microsoft image. If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

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