---
title: Use a custom Docker image for Azure Web App for Containers | Microsoft Docs
description: How to use a custom Docker image for Azure Web App for Containers.
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
ms.topic: article
ms.date: 09/03/2017
ms.author: cfowler
---
# Use a custom Docker image for Azure Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides built-in Docker images on Linux with support for specific versions, such as PHP 7.0 and Node.js 4.5. Web App for Containers leverages the Docker container technology to host both built-in images and custom images as a platform as a service. In this tutorial, you will learn how to build a custom docker image for use on Web App for Containers, which is a common pattern if there isn't a built-in image for your language, or your application requires a specific configuration which isn't provided within the built-in images.

## Prerequisites

To complete this tutorial, you need:

* [Git](https://git-scm.com/downloads)
* An active [Azure subscription](https://azure.microsoft.com/pricing/free-trial/)
* [Docker](https://docs.docker.com/get-started/#setup)
* A [Docker Hub account](https://docs.docker.com/docker-id/)

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine, then change to the directory that contains the sample code.

```bash
git clone https://github.com/Azure-Samples/use-custom-docker-image.git
cd use-custom-docker-image
```

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Build the image from the Docker file

The following Docker file describes the Python environment which is required to run our application. Additionally, the image sets up an [SSH](https://www.ssh.com/ssh/protocol/) server for secure communication between the container and the host.

```docker
# Use an official Python runtime as a parent image
FROM python

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Run python's package manager and install the flask package
RUN pip install flask

# Configure ports
EXPOSE 2222 80

# Run apt-get, to install the SSH server
RUN apt-get update \ 
 	&& apt-get install -y --no-install-recommends openssh-server \
 	&& echo "root:Docker!" | chpasswd

#Copy the sshd_config file to its new location
COPY sshd_config /etc/ssh/

# Start the SSH service
RUN service ssh start

# Copy init_container.sh to the /bin directory
COPY init_container.sh /bin/
	
# Run the chmod command to change permissions on above file in the /bin directory
RUN chmod 755 /bin/init_container.sh 

# run commands in init_container.sh
CMD ["/bin/init_container.sh"]
```

To build the Docker image, run the `docker build` command, and provide a name, `mydockerimage`, and tag, `v1.0.0`. Replace `<docker-id>` with your Docker Hub account ID.

```bash
docker build --tag <docker-id>/mydockerimage:v1.0.0 .
```

The command produces output similar to the following:

```bash
# The output from the commands in this article has been shortened for brevity.

Sending build context to Docker daemon  23.04kB
Step 1/13 : FROM python
 ---> 968120d8cbe8
Step 2/13 : WORKDIR /app
 ---> Using cache
 ---> dd6fdca5aa65
Step 3/13 : ADD . /app
 ---> e05c8f4beeae
Get:1 http://security.debian.org jessie/updates InRelease [63.1 kB]
Ign http://deb.debian.org jessie InRelease
Get:2 http://deb.debian.org jessie-updates InRelease [145 kB]
Get:3 http://deb.debian.org jessie Release.gpg [2373 B]
Fetched 9988 kB in 7s (1266 kB/s)
Reading package lists...
Building dependency tree...
Reading state information...
The following extra packages will be installed:
  init-system-helpers libwrap0 openssh-sftp-server
Suggested packages:
  ssh-askpass rssh molly-guard ufw monkeysphere
Recommended packages:
  tcpd xauth ncurses-term
The following NEW packages will be installed:
  init-system-helpers libwrap0 openssh-server openssh-sftp-server
0 upgraded, 4 newly installed, 0 to remove and 3 not upgraded.
Need to get 442 kB of archives.
After this operation, 1138 kB of additional disk space will be used.
Get:1 http://deb.debian.org/debian/ jessie/main libwrap0 amd64 7.6.q-25 [58.5 kB]
Creating SSH2 RSA key; this may take some time ...
2048 f0:e9:fb:69:de:62:a4:5c:a3:7c:b3:41:e9:2e:96:a3 /etc/ssh/ssh_host_rsa_key.pub (RSA)
Creating SSH2 DSA key; this may take some time ...
1024 4a:5e:89:bd:aa:2d:71:bb:0e:3a:32:94:fb:c0:b1:4d /etc/ssh/ssh_host_dsa_key.pub (DSA)
Processing triggers for systemd (215-17+deb8u7) ...
 ---> 5b416a7dcdca
Removing intermediate container 283b3b4623d7
Step 13/13 : CMD python app.py
 ---> Running in 1c776e5e0772
 ---> 1bfc1bbc968d
Removing intermediate container 1c776e5e0772
Successfully built 1bfc1bbc968d
Successfully tagged <docker-id>/myDockerImage:v1.0.0
```

Test that the build works by running the Docker container. Issue the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command and pass the name and tag of the image to it. You must also  specify the port using `-p` argument.

```bash
docker run -p 80:2222 <docker-ID>/mydockerimage:v1.0.0
```

Verify the web app and container are functioning correctly by browsing the web app locally.

![Test web app locally](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-local.png)

## Push a Docker image to Docker Hub

A registry is an application that hosts images and provides services image and container services. In order to share your image, you must push it to a registry. 

<!-- Depending on your requirements, you may have your docker images in a Public Docker Registry, such as Docker Hub, or a Private Docker Registry such as Azure Container Registry. Select the appropriate tab for your scenario below (your selection will switch multiple tabs on this page). -->

> [!NOTE]
> Pushing to a Private Docker Registry? See the optional instructions to [Push a Docker image to Private Registry](#push-a-docker-image-to-private-registry-optional).

<!--## [Docker Hub](#tab/docker-hub)-->

Docker Hub is a registry for Docker images that allows you to host your own repositories, either public or private. To push a custom Docker image to the public Docker Hub, use the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command and provide a full image name and tag. A full image name and tag looks like the following sample:

```bash
<docker-id>/image-name:tag
```

If you haven't logged into Docker Hub, do so using the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command before attempting to push an image.

```bash
docker login --username <docker-id> --password <docker-hub-password>
```

A "login succeeded" message confirms that you are logged in. Once logged in, you can push the image to Docker Hub using the [docker push](https://docs.docker.com/engine/reference/commandline/push/) command.

```bash
docker push <docker-id>/mydockerimage:v1.0.0 .
```

Verify that the push succeeded by examining the command's output.

```bash
The push refers to a repository [docker.io/<docker-id>/python-flask]
e9aa2c6d0f34: Pushed
0fdcb490aeec: Pushed
08ae61c7869c: Pushed
2548e7db2a94: Mounted from library/python
325b9d6f2920: Pushed
815acdffadff: Mounted from library/python
97108d083e01: Mounted from library/python
5616a6292c16: Mounted from library/python
f3ed6cb59ab0: Mounted from library/python
654f45ecb7e3: Mounted from library/python
2c40c66f7667: Mounted from library/python
v1: digest: sha256:a910d5b77e6960c01745a87c35f3d1a13ba73231ac9a4664c5011b1422d59b60 size: 2632
```

<!--
# [Private Registry](#tab/private-registry)

// Move Private Registry instructions here when Tabbed Conceptual bug is fixed

---
-->

## Create Web App for Containers

You can host native Linux applications in the cloud by using Azure Web Apps. To create a Web App for Containers, you must run Azure CLI commands that create a group, then a service plan, and finally the web app itself. First, run the [az group create](https://docs.microsoft.com/cli/azure/group#az_group_create) command, and pass in a location and unique name.

```azurecli-interactive
az group create --location "West Europe" --name myResourceGroup
```

You see output similar to the sample shown here:

```json
{
  "id": "/subscriptions/432849d3e4-4f90-a782-87c11e-5e59d6dd/resourceGroups/myResourceGroup",
  "location": "westeurope",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

Use the name of the group to help create an app service plan by using the [az appservice plan create](https://docs.microsoft.com/cli/azure/appservice/plan#az_appservice_plan_create) command. You also need to name it a unique name and set the `--is-linux` flag.

```azurecli-interactive
az appservice plan create --name myServicePlan --resource-group myResourceGroup --is-linux
```

Creating a service plan produces results similar to the following sample:

```json
  {- Starting...
  "adminSiteName": null,
  "appServicePlanName": "myServicePlan",
  "geoRegion": "West Europe",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/resourceGroups/myResourceGroup/provide
rs/Microsoft.Web/serverfarms/myServicePlan",
  "kind": "linux",
  "location": "West Europe", 
  "resourceGroup": "myResourceGroup",
  "sku": {
    "capabilities": null,
    "capacity": 1,
    "tier": "Basic"
  },
  "status": "Ready",
  "subscription": "",
  "tags": null,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

Now that the resource group and service plan have been created, you can run the [az webapp create](https://docs.microsoft.com/cli/azure/webapp#az_webapp_create) command to create the web app. Notice the runtime stack is Python 3.4 and the web app uses the resource group and service plan setup in previous steps.

```azurecli-interactive
az webapp create -g myResourceGroup -p myServicePlan -n <web-app-name> --runtime "python|3.4" 
```

The command to create a web app produces the output shown here:

```json
{- Starting ..
  "availabilityState": "Normal",
   "enabled": true,
  "enabledHostNames": [
    "<web-app-name>.azurewebsites.net",
    "<web-app-name>.scm.azurewebsites.net"
  ],
  "ftpPublishingUrl": "ftp://waws-prod-am2-085.ftp.azurewebsites.windows.net/site/wwwroot",
  "gatewaySiteName": null,
  "hostNameSslStates": [
    {
      "hostType": "Standard",
      "name": "<web-app-name>.azurewebsites.net",
    },
  ],
  "hostNames": [
    "<web-app-name>.azurewebsites.net"
  ],
  "hostNamesDisabled": false,
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/5e59d6dd-d3e4-4f90-a782-43284987c11e/resourceGroups/myResourceGroup/providers/Microsoft.
Web/sites/<web-app-name>",
  "lastModifiedTimeUtc": "2017-08-08T21:09:33.693333",
  "location": "West Europe",
  "name": "<web-app-name>",
  "outboundIpAddresses": "13.81.108.99,52.232.76.83,52.166.73.203,52.233.173.39,52.233.159.48",
  "resourceGroup": "myResourceGroup"
}

```

Most web apps have application settings that need to be configured. If you are using an existing Docker image built by someone else, the image may require a port other than port 80 for the application. To set the `WEBSITES_PORT`, run the [az webapp config](https://docs.microsoft.com/cli/azure/webapp/config/appsettings) command, as shown in the following code sample:

```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name <web-app-name> --settings WEBSITES_PORT=2222
```

> [!NOTE]
> Application settings are case sensitive.
>

Verify that the web app works by browsing it. Don't forget the port number.

![Test web app port configuration](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-azure.png)

## Configure Web App to use Docker container from Docker Hub

The [az webapp config](https://docs.microsoft.com/cli/azure/webapp/config) command allows you to use a custom Docker image.

<!-- Depending on your requirements, you may have your docker images in a Public Docker Registry, such as Docker Hub, or a Private Docker Registry, such as Azure Container Registry. Select the appropriate tab for your scenario below: -->

> [!NOTE]
> Deploying from a Private Docker Registry? See the optional instructions to [Configure Web App to use Docker container from a Private Registry](#configure-web-app-to-use-docker-container-from-a-private-registry-optional).

<!-- # [Docker Hub](#tab/docker-hub)-->

To configure the web app to use a public Docker registry, pass the name of the app, the resource group, and the image name and URL to the [az webapp config container set](https://docs.microsoft.com/cli/azure/webapp/config/container#az_webapp_config_container_set) command.

```azurecli-interactive
az webapp config container set --name <web-app-name> --resource-group myResourceGroup --docker-custom-image-name mydockerimage
--docker-registry-server-url <docker-id>/myContainerRegistry
```

A successful configuration change returns general information about the container.

```bash
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "slotSetting": false,
    "value": "{docker-id}/mydockerimage:v1.0.0"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "{docker-id}"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  }
]
```

<!-- # [Private Registry](#tab/private-registry)

// Place Private Registry text back here once Tabbed Conceptual bug is fixed

---
-->

## Test the Application in Azure

Before testing, you must restart the web app using the [az webapp restart](https://docs.microsoft.com/cli/azure/webapp#az_webapp_restart) for the configuration changes to take effect.

```azurecli-interactive
az webapp restart --name <web-app-name> --resource-group myResourceGroup
```

The restart command quietly restarts the web app, so you see no feedback in the terminal. Once the web app is running, test the web app by browsing its URL at `http://<web-app-name>.azurewebsites.net`. Verify that the app displays the new welcome message.

![Test web app in Azure](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-azure.png)

## Change web app and redeploy

A Python file named `app.py` exists in the `using-custom-docker-image` directory. This file contains a line of code that displays a `Hello World!` message. Change the line so it displays the message `Hello World of Web Apps running in Docker Containers!`.

```python
return "Hello World of Web Apps running in Docker Containers!"
```

Once you've modified the Python file and saved it, you must rebuild and push the new Docker image. Then restart the web app for the changes to take effect. Use the same commands that you have previously used in this tutorial. You can refer to the [build the image from the Docker file](#build-the-image-from-the-docker-file) and [push the Docker image](#push-docker-image) sections. Test the web app by following the instructions in [Test the Application in Azure](#tTest-the-application-in-azure)

## Connect to Web App for Containers using SSH

SSH enables secure communication between a container and a client. In order for a custom Docker image to support SSH, you must build it into a Dockerfile. You enable SSH in the Docker file itself. The SSH instructions have already been added to the sample dockerfile, so you can follow these instructions with your own custom image:

* A [RUN](https://docs.docker.com/engine/reference/builder/#run) instruction that calls `apt-get`, then sets the password for the root account to `"Docker!"`.

    ```docker
    RUN apt-get update \
    	&& apt-get install -y --no-install-recommends openssh-server \
    	&& echo "root:Docker!" | chpasswd
    ```

    > [!NOTE]
    > This configuration does not allow external connections to the container. SSH is available only through the Kudu/SCM Site. The Kudu/SCM site is authenticated with the publishing credentials.

* A [COPY](https://docs.docker.com/engine/reference/builder/#copy) instruction that instructs the Docker engine to copy the [sshd_config](http://man.openbsd.org/sshd_config) file to the */etc/ssh/* directory. Your configuration file should be based on our [sshd_config file](https://github.com/Azure-App-Service/node/blob/master/6.11/sshd_config) in the Azure-App-Service GitHub repository.

    > [!NOTE]
    > The *sshd_config* file must include the following items: 
    > * `Ciphers` must include at least one item in this list: `aes128-cbc,3des-cbc,aes256-cbc`.
    > * `MACs` must include at least one item in this list: `hmac-sha1,hmac-sha1-96`.

    ```docker
    #Copy the sshd_config file to its new location
    COPY sshd_config /etc/ssh/
    ```

* An [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose) instruction that exposes port 2222 in the container. Although the root password is known, port 2222 cannot be accessed from the internet. It is an internal port accessible only by containers within the bridge network of a private virtual network. After that, commands copy SSH configuration details and start the `ssh` service.

    ```docker
    # Configure ports
    EXPOSE 2222 80

    #Copy the sshd_config file to its new location
    COPY sshd_config /etc/ssh/

    # Start the SSH service
    RUN service ssh start
    ```

The `init_container.sh` file in the sample code contains instructions on how to initialize the container when it runs. The Dockerfile uses the [COPY](https://docs.docker.com/engine/reference/builder/#copy), [RUN](https://docs.docker.com/engine/reference/builder/#run), and [CMD](https://docs.docker.com/engine/reference/builder/#cmd) instructions to launch the `init_container.sh` script properly.

```docker
# Copy init_container.sh to the /bin directory
COPY init_container.sh /bin/

# Run the chmod command to change permissions on above file in the /bin directory
RUN chmod 755 /bin/init_container.sh

# run commands in init_container.sh
CMD ["/bin/init_container.sh"]
```

You may wish to verify that certain applications are running in the container. To inspect the container and verify running processes, start by opening a browser and navigate to `https://<app name>.scm.azurewebsites.net/webssh/host`. You are then redirected to a page displaying an interactive console. Issue the `top` command at the prompt.

```bash
top
```

The `top` command exposes all running processes in a container.

```bash
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

Congratulations! You've configured a custom Docker image for an Azure Web App for Containers.

## Push a Docker image to Private Registry (Optional)

Azure Container Registry is a managed Docker service from Azure for hosting private images. The deployments may be any type, including [Docker Swarm](https://docs.docker.com/engine/swarm/), [Kubernetes](https://kubernetes.io/), and Azure app service containers. Using the Azure Container Registry is just like using any private registry, so if you need to use your own private registry, the steps to complete this task will be similar.

Use the [az acr create](https://docs.microsoft.com/cli/azure/acr#az_acr_create) command to create an Azure Container Registry. Pass in the name, resource group, and `Basic` for the SKU. Available SKUs are `Classic`, `Basic`, `Standard`, and `Premium`.

```azurecli-interactive
az acr create --name <azure-container-registry-name> --resource-group myResourceGroup --sku Basic --admin-enabled true
```

Creating a container produces the following output:

```bash
 - Finished ..
Create a new service principal and assign access:
  az ad sp create-for-rbac --scopes /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<azure-container-registry-name> --role Owner --password <password>

Use an existing service principal and assign access:
  az role assignment create --scope /subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/<azure-container-registry-name> --role Owner --assignee <app-id>
{
  "adminUserEnabled": false,
  "creationDate": "2017-08-09T04:21:09.654153+00:00",
  "id": "/subscriptions/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/{azure-container-registry-name>",
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

In order to push an image to the registry, you need to supply credentials so the registry accepts the push. You can retrieve these credentials by using the [az acr show](https://docs.microsoft.com/cli/azure/acr/credential#az_acr_credential_show) command. 

```azurecli-interactive
az acr credential show --name {azure-container-registry-name}
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
  "username": "<azure-container-registry-name>"
}
```

Now that you have the necessary credentials, log in to the Azure Container Registry using the `docker login` command. The URL for the registry is required to log in. Use the format `http://{azure-container-registry-name>.azureacr.io`.

```bash
docker login <azure-container-registry-name>.azureacr.io --username <azure-container-registry-name> --password <password> 
```

Confirm that the login succeeded. Push the image by using the `docker push` command, and tagging the image with the full URL of the registry followed by your image name and tag.

```bash
docker push http://<azure-container-registry-name>.azureacr.io/mydockerimage:v1.0.0
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

## Configure Web App to use Docker container from a Private Registry (Optional)

You can configure web apps on Linux so that they run a container stored in the Azure Container Registry. Using the Azure Container Registry is just like using any private registry, so if you need to use your own private registry, the steps to complete this task will be similar.

The [az acr credential show](https://docs.microsoft.com/cli/azure/acr/credential#az_acr_credential_show) command displays the passwords for the container registry. Copy the username and one of the passwords so you can use it to configure the web app in the next step.

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
  "username": "<azure-container-registry-name>"
}
```

Run the [az webapp config container set](https://docs.microsoft.com/cli/azure/webapp/config/container#az_webapp_config_container_set) command. This command assigns the custom Docker image to the web app. Notice that you need a URL that is in the format `https://{your-registry-username}.azurecr.io`. Additionally, the web app needs the user name and password obtained in a previous step in order to access the container registry.

```azurecli-interactive
az webapp config container set --name <web-app-name> --resource-group myResourceGroup --docker-custom-image-name mydockerimage --docker-registry-server-url https://<azure-container-registry-name>.azurecr.io --docker-registry-server-user <docker-id> --docker-registry-server-password <password>
```

> [!NOTE]
> The `https` in the registry's URL is required.
>

The command reveals output similar to the following JSON string, showing that the configuration change succeeded:

```bash
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "slotSetting": false,
    "value": "mydockerimage"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "slotSetting": false,
    "value": "mycontainerregistry.azurecr.io"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "{azure-container-registry-name}"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  }
]
```

[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

## Next Steps

[Azure App Service Web App for Containers FAQ](app-service-linux-faq.md)
