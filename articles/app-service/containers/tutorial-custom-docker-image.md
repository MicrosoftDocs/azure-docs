---
title: Use a custom Docker image for Web App for Containers - Azure | Microsoft Docs
description: How to use a custom Docker image for Web App for Containers.
keywords: azure app service, web app, linux, docker, container
services: app-service
documentationcenter: ''
author: SyntaxC4
manager: SyntaxC4
editor: ''

ms.assetid: b97bd4e6-dff0-4976-ac20-d5c109a559a8
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/24/2017
ms.author: cfowler
ms.custom: mvc
---
# Use a custom Docker image for Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides built-in Docker images on Linux with support for specific versions, such as PHP 7.0 and Node.js 4.5. Web App for Containers uses the Docker container technology to host both built-in images and custom images as a platform as a service. In this tutorial, you learn how to build a custom Docker image and deploy it to Web App for Containers. This pattern is useful when the built-in images don't include your language of choice, or when your application requires a specific configuration that isn't provided within the built-in images.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy a custom Docker image to Azure
> * Configure environment variables to run the container
> * Update the Docker image and redeploy it
> * Connect to the container using SSH
> * Deploy a private Docker image to Azure

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need:

* [Git](https://git-scm.com/downloads)
* [Docker](https://docs.docker.com/get-started/#setup)
* A [Docker Hub account](https://docs.docker.com/docker-id/)

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine, then change to the directory that contains the sample code.

```bash
git clone https://github.com/Azure-Samples/docker-django-webapp-linux.git --config core.autocrlf=input
cd docker-django-webapp-linux
```

## Build the image from the Docker file

In the Git repository, take a look at _Dockerfile_. This file describes the Python environment that is required to run your application. Additionally, the image sets up an [SSH](https://www.ssh.com/ssh/protocol/) server for secure communication between the container and the host.

```docker
FROM python:3.4

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/

# ssh
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
	&& apt-get install -y --no-install-recommends openssh-server \
	&& echo "$SSH_PASSWD" | chpasswd 

COPY sshd_config /etc/ssh/
COPY init.sh /usr/local/bin/
	
RUN chmod u+x /usr/local/bin/init.sh
EXPOSE 8000 2222
#CMD ["python", "/code/manage.py", "runserver", "0.0.0.0:8000"]
ENTRYPOINT ["init.sh"]
```

To build the Docker image, run the `docker build` command, and provide a name, _mydockerimage_, and tag, _v1.0.0_. Replace _\<docker-id>_ with your Docker Hub account ID.

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

The command produces output similar to the following:

```
# The output from the commands in this article has been shortened for brevity.

Sending build context to Docker daemon  5.558MB
Step 1/13 : FROM python:3.4
 ---> 9ff45ddb54e9
Step 2/13 : RUN mkdir /code
 ---> Using cache
 ---> f3f3ac01db0a
Step 3/13 : WORKDIR /code
 ---> Using cache
 ---> 38b32f15b442
.
.
.
Step 13/13 : ENTRYPOINT init.sh
 ---> Running in 5904e4c70043
 ---> e7cf08275692
Removing intermediate container 5904e4c70043
Successfully built e7cf08275692
Successfully tagged cephalin/mydockerimage:v1.0.0
```

Test that the build works by running the Docker container. Issue the [`docker run`](https://docs.docker.com/engine/reference/commandline/run/) command and pass the name and tag of the image to it. Be sure to specify the port using the `-p` argument.

```bash
docker run -p 2222:8000 <docker-ID>/mydockerimage:v1.0.0
```

Verify the web app and container are functioning correctly by browsing to `http://localhost:2222`.

![Test web app locally](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-local.png)

> [!NOTE] 
> You can also connect to the app container directly from your local development machine using SSH, SFTP, or Visual Studio Code (for live debugging Node.js apps). For more information, see [Remote debugging and SSH in App Service on Linux](https://aka.ms/linux-debug).
>

## Push the Docker image to Docker Hub

A registry is an application that hosts images and provides services image and container services. In order to share your image, you must push it to a registry. 

<!-- Depending on your requirements, you may have your docker images in a Public Docker Registry, such as Docker Hub, or a Private Docker Registry such as Azure Container Registry. Select the appropriate tab for your scenario below (your selection will switch multiple tabs on this page). -->

> [!NOTE]
> Pushing to a Private Docker Registry? See the optional instructions to [Use a Docker image from any private registry](#use-a-docker-image-from-any-private-registry-optional).

<!--## [Docker Hub](#tab/docker-hub)-->

Docker Hub is a registry for Docker images that allows you to host your own repositories, either public or private. To push a custom Docker image to the public Docker Hub, use the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command and provide a full image name and tag. A full image name and tag looks like the following sample:

```
<docker-id>/image-name:tag
```

Before you can push an image, you must sign in to Docker Hub using the [`docker login`](https://docs.docker.com/engine/reference/commandline/login/) command. Replace _\<docker-id>_ with your account name and type in your password into the console at the prompt.

```bash
docker login --username <docker-id>
```

A "login succeeded" message confirms that you are logged in. Once logged in, you can push the image to Docker Hub using the [`docker push`](https://docs.docker.com/engine/reference/commandline/push/) command.

```bash
docker push <docker-id>/mydockerimage:v1.0.0
```

Verify that the push succeeded by examining the command's output.

```
The push refers to a repository [docker.io/<docker-id>/mydockerimage:v1.0.0]
c33197c3f6d4: Pushed
ccd2c850ee43: Pushed
02dff2853466: Pushed
6ce78153632a: Pushed
efef3f03cc58: Pushed
3439624d77fb: Pushed
3a07adfb35c5: Pushed
2fcec228e1b7: Mounted from library/python
97d2d3bae505: Mounted from library/python
95aadeabf504: Mounted from library/python
b456afdc9996: Mounted from library/python
d752a0310ee4: Mounted from library/python
db64edce4b5b: Mounted from library/python
d5d60fc34309: Mounted from library/python
c01c63c6823d: Mounted from library/python
v1.0.0: digest: sha256:21f2798b20555f4143f2ca0591a43b4f6c8138406041f2d32ec908974feced66 size: 3676
```

<!--
# [Private Registry](#tab/private-registry)

// Move Private Registry instructions here when Tabbed Conceptual bug is fixed

---
-->

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Deploy app to Azure

You can host native Linux applications in the cloud by using Azure Web Apps. To create a Web App for Containers, you must run Azure CLI commands that create a group, then a service plan, and finally the web app itself. 

### Create a resource group

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux-no-h.md)] 

### Create a Linux App Service plan

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)] 

### Create a web app

In the Cloud Shell, create a [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) command. Don't forget to replace _<appname>_ with a unique app name, and _\<docker-ID>_ with your Docker ID.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --deployment-container-image-name <docker-ID>/mydockerimage:v1.0.0
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "deploymentLocalGitUrl": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

### Configure environment variables

Most Docker images have environment variables that need to be configured. If you are using an existing Docker image built by someone else, the image may use a port other than 80. You tell Azure about the port that your image uses by using the `WEBSITES_PORT` app setting. The GitHub page for the [Python sample in this tutorial](https://github.com/Azure-Samples/docker-django-webapp-linux) shows that you need to set `WEBSITES_PORT` to _8000_.

To set app settings, use the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. App settings are case-sensitive and space-separated.

```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_PORT=8000
```

<!-- Depending on your requirements, you may have your docker images in a Public Docker Registry, such as Docker Hub, or a Private Docker Registry, such as Azure Container Registry. Select the appropriate tab for your scenario below: -->

> [!NOTE]
> Deploying from a Private Docker Registry? See the optional instructions to [Use a Docker image from any private registry](#use-a-docker-image-from-any-private-registry-optional).

<!-- # [Docker Hub](#tab/docker-hub)-->

<!-- # [Private Registry](#tab/private-registry)

// Place Private Registry text back here once Tabbed Conceptual bug is fixed

---
-->

### Test the web app

Verify that the web app works by browsing to it (`http://<app_name>azurewebsites.net`). 

![Test web app port configuration](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-azure.png)

## Change web app and redeploy

In your local Git repository, open app/templates/app/index.html. Locate the first HTML element and change it to.

```python
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">         
        <a class="navbar-brand" href="#">Azure App Service - Updated Here!</a>		 
      </div>            
    </div>
  </nav> 
```

Once you've modified the Python file and saved it, you must rebuild and push the new Docker image. Then restart the web app for the changes to take effect. Use the same commands that you have previously used in this tutorial. You can refer to [Build the image from the Docker file](#build-the-image-from-the-docker-file) and [Push the Docker image to Docker Hub](#push-the-docker-image-to-docker-hub). Test the web app by following the instructions in [Test the web app](#test-the-web-app).

## Connect to Web App for Containers using SSH

SSH enables secure communication between a container and a client. In order for a custom Docker image to support SSH, you must build it into a Dockerfile. You enable SSH in the Docker file itself. The SSH instructions have already been added to the sample dockerfile, so you can follow these instructions with your own custom image:

* A [RUN](https://docs.docker.com/engine/reference/builder/#run) instruction that calls `apt-get`, then sets the password for the root account to `"Docker!"`.

    ```docker
    ENV SSH_PASSWD "root:Docker!"
    RUN apt-get update \
            && apt-get install -y --no-install-recommends dialog \
            && apt-get update \
      && apt-get install -y --no-install-recommends openssh-server \
      && echo "$SSH_PASSWD" | chpasswd 
    ```

    > [!NOTE]
    > This configuration does not allow external connections to the container. SSH is available only through the Kudu/SCM Site. The Kudu/SCM site is authenticated with the publishing credentials.

* A [COPY](https://docs.docker.com/engine/reference/builder/#copy) instruction that instructs the Docker engine to copy the [sshd_config](http://man.openbsd.org/sshd_config) file to the */etc/ssh/* directory. Your configuration file should be based on [this sshd_config file](https://github.com/Azure-App-Service/node/blob/master/6.11.1/sshd_config).

    ```docker
    COPY sshd_config /etc/ssh/
    ```

    > [!NOTE]
    > The *sshd_config* file must include the following items: 
    > * `Ciphers` must include at least one item in this list: `aes128-cbc,3des-cbc,aes256-cbc`.
    > * `MACs` must include at least one item in this list: `hmac-sha1,hmac-sha1-96`.

* An [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose) instruction that exposes port 2222 in the container. Although the root password is known, port 2222 cannot be accessed from the internet. It is an internal port accessible only by containers within the bridge network of a private virtual network. After that, commands copy SSH configuration details and start the `ssh` service.

    ```docker
    EXPOSE 8000 2222
    ```

* Make sure to [start the ssh service](https://github.com/Azure-App-Service/node/blob/master/6.9.3/startup/init_container.sh) by using a shell script in the /bin directory.
 
	```bash
	#!/bin/bash
	service ssh start
	```
     
### Open SSH connection to container

Web App for Containers does not allow external connections to the container. SSH is available only through the Kudu site, which is accessible at `https://<app_name>.scm.azurewebsites.net`.

To connect, browse to `https://<app_name>.scm.azurewebsites.net/webssh/host` and sign in with your Azure account.

You are then redirected to a page displaying an interactive console. 

You may wish to verify that certain applications are running in the container. To inspect the container and verify running processes, issue the `top` command at the prompt.

```bash
top
```

The `top` command exposes all running processes in a container.

```
PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
 1 root      20   0  945616  35372  15348 S  0.0  2.1   0:04.63 node
20 root      20   0   55180   2776   2516 S  0.0  0.2   0:00.00 sshd
42 root      20   0  944596  33340  15352 S  0.0  1.9   0:05.80 node /opt/s+
56 root      20   0   59812   5244   4512 S  0.0  0.3   0:00.93 sshd
58 root      20   0   20228   3128   2664 S  0.0  0.2   0:00.00 bash
62 root      20   0   21916   2272   1944 S  0.0  0.1   0:03.15 top
63 root      20   0   59812   5344   4612 S  0.0  0.3   0:00.03 sshd
65 root      20   0   20228   3140   2672 S  0.0  0.2   0:00.00 bash
71 root      20   0   59812   5380   4648 S  0.0  0.3   0:00.02 sshd
73 root      20   0   20228   3160   2696 S  0.0  0.2   0:00.00 bash
77 root      20   0   21920   2304   1972 R  0.0  0.1   0:00.00 top
```

Congratulations! You've configured a custom Docker image for a Web App for Containers.

## Use a private image from Docker Hub (optional)

In [Create a web app](#create-a-web-app), you specified an image on Docker Hub in the `az webapp create` command. This is good enough for a public image. To use a private image, you need to configure your Docker account ID and password in your Azure web app.

In the Cloud Shell, follow the `az webapp create` command with [`az webapp config container set`](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set). Replace *\<app_name>*, and also _\<docker-id>_ and _\<password>_ with your Docker ID and password.

```azurecli-interactive
az webapp config container set --name <app_name> --resource-group myResourceGroup --docker-registry-server-user <docker-id> --docker-registry-server-password <password>
```

The command reveals output similar to the following JSON string, showing that the configuration change succeeded:

```json
[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "false"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "<docker-id>"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "DOCKER|<image-name-and-tag>"
  }
]
```

## Use a Docker image from any private registry (optional)

In this section, you learn how to use a Docker image from a private registry in Web App for Containers, and it uses Azure Container Registry as an example. The steps for using other private registries are similar. 

Azure Container Registry is a managed Docker service from Azure for hosting private images. The deployments may be any type, including [Docker Swarm](https://docs.docker.com/engine/swarm/), [Kubernetes](https://kubernetes.io/), and Web App for Containers. 

### Create an Azure Container Registry

In the Cloud Shell, use the [`az acr create`](/cli/azure/acr?view=azure-cli-latest#az-acr-create) command to create an Azure Container Registry. Pass in the name, resource group, and `Basic` for the SKU. Available SKUs are `Classic`, `Basic`, `Standard`, and `Premium`.

```azurecli-interactive
az acr create --name <azure-container-registry-name> --resource-group myResourceGroup --sku Basic --admin-enabled true
```

Creating a container produces the following output:

```
 - Finished ..
Create a new service principal and assign access:
  az ad sp create-for-rbac --scopes /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<azure-container-registry-name> --role Owner --password <password>

Use an existing service principal and assign access:
  az role assignment create --scope /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<azure-container-registry-name> --role Owner --assignee <app-id>
{
  "adminUserEnabled": false,
  "creationDate": "2017-08-09T04:21:09.654153+00:00",
  "id": "/subscriptions/<subscriptionId>/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<azure-container-registry-name>",
  "location": "westeurope",
  "loginServer": "<azure-container-registry-name>.azurecr.io",
  "name": "<azure-container-registry-name>",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "myazurecontainerre042025"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

### Log in to Azure Container Registry

In order to push an image to the registry, you need to supply credentials so the registry accepts the push. You can retrieve these credentials by using the [`az acr show`](/cli/azure/acr?view=azure-cli-latest#az-acr-show) command in the Cloud Shell. 

```azurecli-interactive
az acr credential show --name <azure-container-registry-name>
```

The command reveals two passwords that can be used with the user name.

```json
<
  "passwords": [
    {
      "name": "password",
      "value": "{password}"
    },
    {
      "name": "password2",
      "value": "{password}"
    }
  ],
  "username": "<registry-username>"
}
```

From your local terminal window, log in to the Azure Container Registry using the `docker login` command. The server name is required to log in. Use the format `{azure-container-registry-name>.azurecr.io`. Type in your password into the console at the prompt.

```bash
docker login <azure-container-registry-name>.azurecr.io --username <registry-username>
```

Confirm that the login succeeded. 

### Push an image to Azure Container Registry

> [!NOTE]
> If you're using your own image, tag the image as follows:
> ```bash
> docker tag <azure-container-registry-name>.azurecr.io/mydockerimage
> ```

Push the image by using the `docker push` command. Tag the image with the name of the registry, followed by your image name and tag.

```bash
docker push <azure-container-registry-name>.azurecr.io/mydockerimage:v1.0.0
```

Verify that the push successfully added a container to the registry by listing the ACR repositories. 

```azurecli-interactive
az acr repository list -n <azure-container-registry-name>
```

Listing the images in the registry confirms that `mydockerimage` is in the registry.

```json
[
  "mydockerimage"
]
```

### Configure Web App to use the image from Azure Container Registry (or any private registry)

You can configure Web App for Containers so that it runs a container stored in the Azure Container Registry. Using the Azure Container Registry is just like using any private registry, so if you need to use your own private registry, the steps to complete this task are similar.

In the Cloud Shell, run [`az acr credential show`](/cli/azure/acr/credential?view=azure-cli-latest#az-acr-credential-show) to display the username and password for the Azure Container Registry. Copy the username and one of the passwords so you can use it to configure the web app in the next step.

```bash
az acr credential show --name <azure-container-registry-name>
```

```json
{
  "passwords": [
    {
      "name": "password",
      "value": "password"
    },
    {
      "name": "password2",
      "value": "password2"
    }
  ],
  "username": "<registry-username>"
}
```

In the Cloud Shell, run the [`az webapp config container set`](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set) command to assign the custom Docker image to the web app. Replace *\<app_name>*, *\<docker-registry-server-url>*, _\<registry-username>_, and _\<password>_. For Azure Container Registry, *\<docker-registry-server-url>* is in the format `https://<azure-container-registry-name>.azurecr.io`. If you are using any registry besides Docker Hub, the image name needs to begin with the fully-qualified domain name (FQDN) of your registry. For Azure Container Registry, this will look like `<azure-container-registry>.azurecr.io/mydockerimage`. 

```azurecli-interactive
az webapp config container set --name <app_name> --resource-group myResourceGroup --docker-custom-image-name <azure-container-registry-name>.azurecr.io/mydockerimage --docker-registry-server-url https://<azure-container-registry-name>.azurecr.io --docker-registry-server-user <registry-username> --docker-registry-server-password <password>
```

> [!NOTE]
> `https://` is required in *\<docker-registry-server-url>*.
>

The command reveals output similar to the following JSON string, showing that the configuration change succeeded:

```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "slotSetting": false,
    "value": "mydockerimage"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "slotSetting": false,
    "value": "<azure-container-registry-name>.azurecr.io"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "<registry-username>"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  }
]
```

[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Build a Docker Python and PostgreSQL web app in Azure](tutorial-python-postgresql-app.md)
