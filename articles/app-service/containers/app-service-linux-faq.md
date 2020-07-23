---
title: Run built-in containers FAQ
description: Find answers to the frequently asked questions about the built-in Linux containers in Azure App Service.
keywords: azure app service, web app, faq, linux, oss, web app for containers, multi-container, multicontainer
author: msangapu-msft

ms.topic: article
ms.date: 10/30/2018
ms.author: msangapu
ms.custom: seodec18
---
# Azure App Service on Linux FAQ

With the release of App Service on Linux, we're working on adding features and making improvements to our platform. This article provides answers to questions that our customers have been asking us recently.

If you have a question, comment on this article.

## Built-in images

**I want to fork the built-in Docker containers that the platform provides. Where can I find those files?**

You can find all Docker files on [GitHub](https://github.com/azure-app-service). You can find all Docker containers on [Docker Hub](https://hub.docker.com/u/appsvc/).

<a id="#startup-file"></a>

**What are the expected values for the Startup File section when I configure the runtime stack?**

| Stack           | Expected Value                                                                         |
|-----------------|----------------------------------------------------------------------------------------|
| Java SE         | the command to start your JAR app (for example, `java -jar /home/site/wwwroot/app.jar --server.port=80`) |
| Tomcat          | the location of a script to perform any necessary configurations (for example, `/home/site/deployments/tools/startup_script.sh`)          |
| Node.js         | the PM2 configuration file or your script file                                |
| .NET Core       | the compiled DLL name as `dotnet <myapp>.dll`                                 |
| Ruby            | the Ruby script that you want to initialize your app with                     |

These commands or scripts are executed after the built-in Docker container is started, but before your application code is started.

## Management

**What happens when I press the restart button in the Azure portal?**

This action is the same as a Docker restart.

**Can I use Secure Shell (SSH) to connect to the app container virtual machine (VM)?**

Yes, you can do that through the source control management (SCM) site.

> [!NOTE]
> You can also connect to the app container directly from your local development machine using SSH, SFTP, or Visual Studio Code (for live debugging Node.js apps). For more information, see [Remote debugging and SSH in App Service on Linux](https://azure.github.io/AppService/2018/05/07/New-SSH-Experience-and-Remote-Debugging-for-Linux-Web-Apps.html).
>

**How can I create a Linux App Service plan through an SDK or an Azure Resource Manager template?**

Set the **reserved** field of the app service to *true*.

## Continuous integration and deployment

**My web app still uses an old Docker container image after I've updated the image on Docker Hub. Do you support continuous integration and deployment of custom containers?**

Yes, to set up continuous integration/deployment for Azure Container Registry or DockerHub, by following [Continuous Deployment with Web App for Containers](./app-service-linux-ci-cd.md). For private registries, you can refresh the container by stopping and then starting your web app. Or you can change or add a dummy application setting to force a refresh of your container.

**Do you support staging environments?**

Yes.

**Can I use *WebDeploy/MSDeploy* to deploy my web app?**

Yes, you need to set an app setting called `WEBSITE_WEBDEPLOY_USE_SCM` to *false*.

**Git deployment of my application fails when using Linux web app. How can I work around the issue?**

If Git deployment fails to your Linux web app, choose one of the following options to deploy your application code:

- Use the Continuous Delivery (Preview) feature: You can store your app's source code in an Azure DevOps Git repo or GitHub repo to use Azure Continuous Delivery. For more information, see [How to configure Continuous Delivery for Linux web app](https://blogs.msdn.microsoft.com/devops/2017/05/10/use-azure-portal-to-setup-continuous-delivery-for-web-app-on-linux/).

- Use the [ZIP deploy API](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file): To use this API, [SSH into your web app](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-ssh-support) and go to the folder where you want to deploy your code. Run the following code:

   ```bash
   curl -X POST -u <user> --data-binary @<zipfile> https://{your-sitename}.scm.azurewebsites.net/api/zipdeploy
   ```

   If you get an error that the `curl` command is not found, make sure you install curl by using `apt-get install curl` before you run the previous `curl` command.

## Language support

**I want to use web sockets in my Node.js application, any special settings, or configurations to set?**

Yes, disable `perMessageDeflate` in your server-side Node.js code. For example, if you are using socket.io, use the following code:

```nodejs
const io = require('socket.io')(server,{
  perMessageDeflate :false
});
```

**Do you support uncompiled .NET Core apps?**

Yes.

**Do you support Composer as a dependency manager for PHP apps?**

Yes, during a Git deployment, Kudu should detect that you're deploying a PHP application (thanks to the presence of a composer.lock file), and Kudu will then trigger a composer install.

## Custom containers

**I'm using my own custom container. I want the platform to mount an SMB share to the `/home/` directory.**

If `WEBSITES_ENABLE_APP_SERVICE_STORAGE` setting is **unspecified** or set to *true*, the `/home/` directory **will be shared** across scale instances, and files written **will persist** across restarts. Explicitly setting `WEBSITES_ENABLE_APP_SERVICE_STORAGE` to *false* will disable the mount.

**My custom container takes a long time to start, and the platform restarts the container before it finishes starting up.**

You can configure the amount of time the platform will wait before it restarts your container. To do so, set the `WEBSITES_CONTAINER_START_TIME_LIMIT` app setting to the value you want. The default value is 230 seconds, and the maximum value is 1800 seconds.

**What is the format for the private registry server URL?**

Provide the full registry URL, including `http://` or `https://`.

**What is the format for the image name in the private registry option?**

Add the full image name, including the private registry URL (for example, myacr.azurecr.io/dotnet:latest). Image names that use a custom port [cannot be entered through the portal](https://feedback.azure.com/forums/169385-web-apps/suggestions/31304650). To set `docker-custom-image-name`, use the [`az` command-line tool](https://docs.microsoft.com/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set).

**Can I expose more than one port on my custom container image?**

We don't support exposing more than one port.

**Can I bring my own storage?**

Yes, [bring your own storage](https://docs.microsoft.com/azure/app-service/containers/how-to-serve-content-from-azure-storage) is in preview.

**Why can't I browse my custom container's file system or running processes from the SCM site?**

The SCM site runs in a separate container. You can't check the file system or running processes of the app container.

**My custom container listens to a port other than port 80. How can I configure my app to route requests to that port?**

We have automatic port detection. You can also specify an app setting called *WEBSITES_PORT* and give it the value of the expected port number. Previously, the platform used the *PORT* app setting. We are planning to deprecate this app setting and to use *WEBSITES_PORT* exclusively.

**Do I need to implement HTTPS in my custom container?**

No, the platform handles HTTPS termination at the shared front ends.

## Multi-container with Docker Compose

**How do I configure Azure Container Registry (ACR) to use with multi-container?**

In order to use ACR with multi-container, **all container images** need to be hosted on the same ACR registry server. Once they are on the same registry server, you will need to create application settings and then update the Docker Compose configuration file to include the ACR image name.

Create the following application settings:

- DOCKER_REGISTRY_SERVER_USERNAME
- DOCKER_REGISTRY_SERVER_URL (full URL, ex: `https://<server-name>.azurecr.io`)
- DOCKER_REGISTRY_SERVER_PASSWORD (enable admin access in ACR settings)

Within the configuration file, reference your ACR image like the following example:

```yaml
image: <server-name>.azurecr.io/<image-name>:<tag>
```

**How do I know which container is internet accessible?**

- Only one container can be open for access
- Only port 80 and 8080 is accessible (exposed ports)

Here are the rules for determining which container is accessible - in the order of precedence:

- Application setting `WEBSITES_WEB_CONTAINER_NAME` set to the container name
- The first container to define port 80 or 8080
- If neither of the above is true, the first container defined in the file will be accessible (exposed)


## Web Sockets

Web Sockets are supported on Linux apps.

> [!IMPORTANT]
> Web Sockets are not currently supported for Linux apps on Free App Service Plans. We are working on removing this limitation and plan to support up to 5 web socket connections on Free App Service plans.

## Pricing and SLA

**What is the pricing, now that the service is generally available?**

Pricing varies by SKU and region but you can see more details at our pricing page: [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

## Other questions

**What does "Requested feature is not available in resource group" mean?**

You may see this message when creating web app using Azure Resource Manager (ARM). Based on a current limitation, for the same resource group, you cannot mix Windows and Linux apps in the same region.

**What are the supported characters in application settings names?**

You can use only letters (A-Z, a-z), numbers (0-9), and the underscore character (_) for application settings.

**Where can I request new features?**

You can submit your idea at the [Web Apps feedback forum](https://aka.ms/webapps-uservoice). Add "[Linux]" to the title of your idea.

## Next steps

- [What is Azure App Service on Linux?](app-service-linux-intro.md)
- [Set up staging environments in Azure App Service](../../app-service/deploy-staging-slots.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
- [Continuous Deployment with Web App for Containers](./app-service-linux-ci-cd.md)
