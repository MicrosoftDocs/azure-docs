---
title: Quickstart - Deploy Docker container to container instance - Docker CLI
description: In this quickstart, you use the Docker CLI to quickly deploy a containerized web app that runs in an isolated Azure container instance
ms.topic: quickstart
ms.date: 07/16/2020
ms.custom: devx-track-javascript
---

# Quickstart: Deploy a container instance in Azure using the Docker CLI

Use Azure Container Instances to run serverless Docker containers in Azure with simplicity and speed. Deploy to a container instance on-demand when you develop cloud-native apps and you want to switch seamlessly from local development to cloud deployment.

In this quickstart, you use native Docker CLI commands to deploy a Docker container and make its application available in Azure Container Instances. This capability is enabled by [integration between Docker and Azure](https://docs.docker.com/engine/context/aci-integration/) (beta). A few seconds after you execute a `docker run` command, you can browse to the application running in the container:

:::image type="content" source="media/container-instances-quickstart-docker-cli/view-application-running-in-an-azure-container-instance.png" alt-text="App deployed using Azure Container Instances viewed in browser":::

If you don't have an Azure subscription, create a [free account][azure-account] before you begin.

For this quickstart, you need to install Docker Desktop Edge version 2.3.2.0 or later, available for [Windows](https://desktop.docker.com/win/edge/Docker%20Desktop%20Installer.exe) or [macOS](https://desktop.docker.com/mac/edge/Docker.dmg). Or install the [Docker ACI Integration CLI for Linux](https://docs.docker.com/engine/context/aci-integration/#install-the-docker-aci-integration-cli-on-linux) (beta). 

> [!IMPORTANT]
> This feature is currently in preview, and requires beta (preview) features in Docker. Read more about [Stable and Edge versions of Docker Desktop](https://docs.docker.com/desktop/#stable-and-edge-versions). Not all features of Azure Container Instances are supported. Provide feedback about the Docker-Azure integration by creating an issue in the [aci-integration-beta](https://github.com/docker/aci-integration-beta) GitHub repository.

## Create Azure context

To use Docker commands to run containers in Azure Container Instances, first log into Azure:

```bash
docker login azure
```

When prompted, enter or select your Azure credentials.


Run `docker context create aci` to create an ACI context. This context associates Docker with your Azure subscription so you can create container instances. For example, to create a context called *myacicontext*:

```
docker context create aci myacicontext
```

When prompted, select your Azure subscription ID, then select an existing resource group or **create a new resource group**. If you choose a new resource group, it's created with a system-generated name. Azure container instances, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.


Run `docker context ls` to confirm that you added the ACI context to your Docker contexts:

```
docker context ls
```

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

:::image type="content" source="media/container-instances-quickstart-docker-cli/view-application-running-in-an-azure-container-instance.png" alt-text="App deployed using Azure Container Instances viewed in browser":::

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

You can also use the [Docker extension](https://aka.ms/VSCodeDocker) for Visual Studio Code for an integrated experience to develop, run, and manage containers, images, and contexts.

To use Azure tools to create and manage container instances, see other quickstarts using the [Azure CLI](container-instances-quickstart.md), [Azure PowerShell](container-instances-quickstart-powershell.md), [Azure portal](container-instances-quickstart-portal.md), and [Azure Resource Manager template](container-instances-quickstart-template.md).

If you'd like to build a container image and deploy it from a private Azure container registry, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](./container-instances-tutorial-prepare-app.md)

<!-- LINKS - External -->

[azure-account]: https://azure.microsoft.com/free/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

