---
title: Azure App Service on Linux with Visual Studio Code - create a registry
description: Node.js Deployment to Azure App Services with Visual Studio Code
author: KarlErickson
ms.author: karler
ms.date: 05/17/2019
ms.topic: quickstart
ms.service: app-service
ms.devlang: javascript
---
# Using Container Registries

You need a container registry to push your app image to once the image is built. Once your image is available in a container registry, you'll deploy directly from that registry.

## Using Azure Container Registry

[Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/) (ACR) is a private, secure, hosted registry for your images. ACR is used in this tutorial, but the steps are the same for other registry services.

Create an Azure Container Registry by signing in to the [Azure portal](https://portal.azure.com) then selecting **Create a resource** > **Containers** > **Container Registry**.

![Dashboard](./media/tutorial-javascript-vscode/qs-portal-01.png)

Enter values for **Registry name** and **Resource group**. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. For this quickstart, select **'Basic'** for the **SKU**. Select **Create** to deploy the ACR instance.

![Creation](./media/tutorial-javascript-vscode/qs-portal-03.png)

Once the Registry is created, click **Access Keys** from the left menu and **Enable** the Admin User option.

![Creation](./media/tutorial-javascript-vscode/auth-portal-01.png)

With the admin user account enabled, log into your registry from the Docker CLI using the following command.

```bash
docker login <registryname>.azurecr.io  # Copy from "Login Server"
Username:   # Copy from "Username"
Password:   # Copy from "Password"
Login Succeeded
```

## Using Docker Hub

Docker Hub is Docker's own hosted registry that provides a free way of sharing images. Sign up for a Docker ID on [Docker Hub](https://hub.docker.com/), then sign in to the Docker CLI using your Docker ID credentials.

## Prerequisite Check

Ensure that the registry endpoint that you just setup is visible under **Registries** in the **DOCKER** explorer.

![Registries](./media/tutorial-javascript-vscode/registries.png)

## Next steps

> [!div class="nextstepaction"]
> [I've created a registry](./tutorial-javascript-vscode-containerize-app.md)
> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-docker-extension&step=create-registry)
