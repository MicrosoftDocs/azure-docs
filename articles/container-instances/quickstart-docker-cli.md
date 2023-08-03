---
title: Quickstart - Deploy Docker container to container instance - Docker CLI
description: In this quickstart, you use the Docker CLI to quickly deploy a containerized web app that runs in an isolated Azure container instance
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: quickstart
ms.date: 05/11/2022
ms.custom: mode-api
---

# Quickstart: Deploy a container instance in Azure using the Docker CLI

Use Azure Container Instances to run serverless Docker containers in Azure with simplicity and speed. Deploy to a container instance on-demand when you develop cloud-native apps and you want to switch seamlessly from local development to cloud deployment.

In this quickstart, you use native Docker CLI commands to deploy a Docker container and make its application available in Azure Container Instances. This capability is enabled by [integration between Docker and Azure](https://docs.docker.com/engine/context/aci-integration/). A few seconds after you execute a `docker run` command, you can browse to the application running in the container:

:::image type="content" source="media/quickstart-docker-cli/view-application-running-in-an-azure-container-instance.png" alt-text="App deployed using Azure Container Instances viewed in browser":::

If you don't have an Azure subscription, create a [free account][azure-account] before you begin.

For this quickstart, you need Docker Desktop version 2.3.0.5 or later, available for [Windows](https://desktop.docker.com/win/edge/Docker%20Desktop%20Installer.exe) or [macOS](https://desktop.docker.com/mac/edge/Docker.dmg). Or install the [Docker ACI Integration CLI for Linux](https://docs.docker.com/engine/context/aci-integration/#install-the-docker-aci-integration-cli-on-linux). 

> [!IMPORTANT]
> Not all features of Azure Container Instances are supported. Provide feedback about the Docker-Azure integration by creating an issue in the [aci-integration-beta](https://github.com/docker/aci-integration-beta) GitHub repository.

[!INCLUDE [container-instances-create-docker-context](../../includes/container-instances-create-docker-context.md)]

## Create a container

After creating a Docker context, you can create a container in Azure. In this quickstart, you use the public `mcr.microsoft.com/azuredocs/aci-helloworld` image. This image packages a small web app written in Node.js that serves a static HTML page.

First, change to the ACI context. All subsequent Docker commands run in this context.

```
docker context use myacicontext
```

Run the following `docker run` command to create the Azure container instance with port 80 exposed to the internet:

```
docker run -p 80:80 mcr.microsoft.com/azuredocs/aci-helloworld
```

Sample output for a successful deployment:

```
[+] Running 2/2
 ⠿ hungry-kirch            Created                                                                               5.1s
 ⠿ single--container--aci  Done                                                                                 11.3s
hungry-kirch
```

Run `docker ps` to get details about the running container, including the public IP address:

```
docker ps
```


Sample output shows a public IP address, in this case *52.230.225.232*:

```
CONTAINER ID        IMAGE                                        COMMAND             STATUS              PORTS
hungry-kirch        mcr.microsoft.com/azuredocs/aci-helloworld                       Running             52.230.225.232:80->80/tcp
```

 Now go to the IP address in your browser. If you see a web page similar to the following, congratulations! You've successfully deployed an application running in a Docker container to Azure.

:::image type="content" source="media/quickstart-docker-cli/view-application-running-in-an-azure-container-instance.png" alt-text="App deployed using Azure Container Instances viewed in browser":::

## Pull the container logs

When you need to troubleshoot a container or the application it runs (or just see its output), start by viewing the container instance's logs.

For example, run the `docker logs` command to see the logs of the *hungry-kirch* container in the ACI context:

```azurecli-interactive
docker logs hungry-kirch
```

The output displays the logs for the container, and should show the HTTP GET requests generated when you viewed the application in your browser.

```output
listening on port 80
::ffff:10.240.255.55 - - [07/Jul/2020:17:43:53 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [07/Jul/2020:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
::ffff:10.240.255.55 - - [07/Jul/2020:17:44:36 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
```


## Clean up resources

When you're done with the container, run `docker rm` to remove it. This command stops and deletes the Azure container instance.

```
docker rm hungry-kirch
```


## Next steps

In this quickstart, you created an Azure container instance from a public image by using integration between Docker and Azure. Learn more about integration scenarios in the [Docker documentation](https://docs.docker.com/engine/context/aci-integration/). 

You can also use the [Docker extension for Visual Studio Code](https://aka.ms/VSCodeDocker) for an integrated experience to develop, run, and manage containers, images, and contexts.

To use Azure tools to create and manage container instances, see other quickstarts using the [Azure CLI](container-instances-quickstart.md), [Azure PowerShell](container-instances-quickstart-powershell.md), [Azure portal](container-instances-quickstart-portal.md), and [Azure Resource Manager template](container-instances-quickstart-template.md).

If you'd like to use Docker Compose to define and run a multi-container application locally and then switch to Azure Container Instances, continue to the tutorial.

> [!div class="nextstepaction"]
> [Docker Compose tutorial](./tutorial-docker-compose.md)

<!-- LINKS - External -->

[azure-account]: https://azure.microsoft.com/free/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
