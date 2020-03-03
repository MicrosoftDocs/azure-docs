---
title: Deployment options for Linux containers
description: Decide between custom Docker container deployment, multi-container and a built-in application framework for App Service on Linux.
keywords: azure app service, web app, linux, oss
author: msangapu-msft

ms.topic: article
ms.date: 05/04/2018
ms.author: msangapu
ms.custom: seodec18

---
# Custom image, multi-container, or built-in platform image?

[App Service on Linux](app-service-linux-intro.md) offers three different paths to getting your application published to the web:

- **Custom image deployment**: "Dockerize" your app into a Docker image that contains all of your files and dependencies in a ready-to-run package.
- **Multi-container deployment**: "Dockerize" your app across multiple containers using a Docker Compose configuration file.
- **App deployment with a built-in platform image**: Our built-in platform images contain common web app runtimes and dependencies, such as Node and PHP. Use any one of the [Azure App Service deployment methods](../deploy-local-git.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) to deploy your app to your web app's storage, and then use a built-in platform image to run it.

## Which method is right for your app? 

The primary factors to consider are:

- **Availability of Docker in your development workflow**: Custom image development requires basic knowledge of the Docker development workflow. Deployment of a custom image to a web app requires publication of your custom image to a repository host like Docker Hub. If you are familiar with Docker and can add Docker tasks to your build workflow, or if you are already publishing your app as a Docker image, a custom image is almost certainly the best choice.
- **Multi-layered architecture**: Deploy multiple containers such as a web application layer and an API layer to separate capabilities by using multi-container. 
- **Application performance**: Increase the performance of your multi-container app using a cache layer such as Redis. Select multi-container to achieve this.
- **Unique runtime requirements**: The built-in platform images are designed to meet the needs of most web apps, but are limited in their customizability. Your app may have unique dependencies or other runtime requirements that exceed what the built-in images are capable of.
- **Build requirements**: With [continuous deployment](../deploy-continuous-deployment.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json), you can get your app up and running on Azure directly from source code. No external build or publication process is required. However, there is a limit to the customizability and availability of build tools within the [Kudu](https://github.com/projectkudu/kudu/wiki) deployment engine. Your app may outgrow Kudu's capabilities as it grows in its dependencies or requirements for custom build logic.
- **Disk read/write requirements**: All web apps are allocated a storage volume for web content. This volume, backed by Azure Storage, is mounted to `/home` in the app's filesystem. Unlike files in the container filesystem, files in the content volume are accessible across all scale instances of an app, and modifications will persist across app restarts. However, the disk latency of the content volume is higher and more variable than the latency of the local container filesystem, and access can be impacted by platform upgrades, unplanned downtime, and network connectivity issues. Apps that require heavy read-only access to content files may benefit from custom image deployment, which places files in the image filesystem instead of on the content volume.
- **Build resource usage**: When an app is deployed from source, the deployment scripts run by Kudu use the same App Service Plan compute and storage resources as the running app. Large app deployments may consume more resources or time than desired. In particular, many deployment workflows generate heavy disk activity on the app content volume, which is not optimized for such activity. A custom image delivers all of your app's files and dependencies to Azure in a single package with no need for additional file transfers or deployment actions.
- **Need for rapid iteration**: Dockerizing an app requires additional build steps. For changes to take effect, you must push your new image to a repository with each update. These updates are then pulled to the Azure environment. If one of the built-in containers meets your app's needs, deploying from source may offer a faster development workflow.

## Next steps

Custom container:
* [Run custom container](quickstart-docker-go.md)

Multi-container:
* [Create multi-container app](quickstart-multi-container.md)

The following articles get you started with App Service on Linux with a built-in platform image:

* [.NET Core](quickstart-dotnetcore.md)
* [PHP](quickstart-php.md)
* [Node.js](quickstart-nodejs.md)
* [Java](quickstart-java.md)
* [Python](quickstart-python.md)
* [Ruby](quickstart-ruby.md)