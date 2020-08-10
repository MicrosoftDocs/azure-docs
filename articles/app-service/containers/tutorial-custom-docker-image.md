---
title: 'Tutorial: Build and run a custom image in Azure App Service'
description: A step-by-step guide to build a custom Linux image, push the image to Azure Container Registry, and then deploy that image to Azure App Service.
keywords: azure app service, web app, linux, docker, container
author: msangapu-msft

ms.assetid: b97bd4e6-dff0-4976-ac20-d5c109a559a8
ms.topic: tutorial
ms.date: 07/16/2020
ms.author: msangapu
ms.custom: mvc, seodec18, devx-track-python
---

# Tutorial: Run a custom Docker image in App Service

Azure App Service uses the Docker container technology to host both built-in images and custom images. To see a list of built-in images, run the Azure CLI command, ['az webapp list-runtimes --linux'](/cli/azure/webapp?view=azure-cli-latest#az-webapp-list-runtimes). If those images don't satisfy your needs, you can build and deploy a custom image.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a custom image if no built-in image satisfies your needs
> * Push the custom image to a private container registry on Azure
> * Run the custom image in App Service
> * Configure environment variables
> * Update and redeploy the image
> * Access diagnostic logs
> * Connect to the container using SSH

Completing this tutorial incurs a small charge in your Azure account for the container registry and can incur additional costs for hosting the container for longer than a month.

## Set up your initial environment

* Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* Install [Docker](https://docs.docker.com/get-started/#setup), which you use to build Docker images. Installing Docker may require a computer restart.
* Install the <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> 2.0.80 or higher, with which you run commands in any shell to provision and configure Azure resources.

After installing Docker and the Azure CLI, open a terminal window and verify that docker is installed:

```bash
docker --version
```

Also verify that your Azure CLI version is 2.0.80 or higher:

```azurecli
az --version
```

Then sign in to Azure through the CLI:

```azurecli
az login
```

The `az login` command opens a browser to gather your credentials. When the command completes, it shows JSON output containing information about your subscriptions.

Once signed in, you can run Azure commands with the Azure CLI to work with resources in your subscription.

## Clone or download the sample app

You can obtain the sample for this tutorial via git clone or download.

### Clone with git

Clone the sample repository:

```terminal
git clone https://github.com/Azure-Samples/docker-django-webapp-linux.git --config core.autocrlf=input
```

Be sure to include the `--config core.autocrlf=input` argument to guarantee proper line endings in files that are used inside the Linux container:

Then go into that folder:

```terminal
cd docker-django-webapp-linux
```

### Download from GitHub

Instead of using git clone, you can visit [https://github.com/Azure-Samples/docker-django-webapp-linux](https://github.com/Azure-Samples/docker-django-webapp-linux), select **Clone**, and then select **Download ZIP**. 

Unpack the ZIP file into a folder named *docker-django-webapp-linux*. 

Then open a terminal window in that *docker-django-webapp-linux* folder.

## (Optional) Examine the Docker file

The file in the sample named _Dockerfile_ that describes the docker image and contains configuration instructions:

```Dockerfile
FROM tiangolo/uwsgi-nginx-flask:python3.6

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt --no-cache-dir
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

* The first group of commands installs the app's requirements in the environment.
* The second group of commands create an [SSH](https://www.ssh.com/ssh/protocol/) server for secure communication between the container and the host.
* The last line, `ENTRYPOINT ["init.sh"]`, invokes `init.sh` to start the SSH service and Python server.

## Build and test the image locally

1. Run the following command to build the image:

    ```bash
    docker build --tag appsvc-tutorial-custom-image .
    ```
    
1. Test that the build works by running the Docker container locally:

    ```bash
    docker run -p 8000:8000 appsvc-tutorial-custom-image
    ```
    
    This [`docker run`](https://docs.docker.com/engine/reference/commandline/run/) command specifies the port with the `-p` argument followed by the name of the image. 
    
    > [!TIP]
    > If you are running on Windows and see the error, *standard_init_linux.go:211: exec user process caused "no such file or directory"*, the *init.sh* file contains CR-LF line endings instead of the expected LF endings. This error happens if you used git to clone the sample repository but omitted the `--config core.autocrlf=input` parameter. In this case, clone the repository again with the `--config`` argument. You might also see the error if you edited *init.sh* and saved it with CRLF endings. In this case, save the file again with LF endings only.

1. Browse to `http://localhost:8000` to verify the web app and container are functioning correctly.

    ![Test web app locally](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-local.png)

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Create a resource group

In this section and those that follow, you provision resources in Azure to which you push the image and then deploy a container to Azure App Service. You start by creating a resource group in which to collect all these resources.

Run the [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command to create a resource group:

```azurecli-interactive
az group create --name AppSvc-DockerTutorial-rg --location westus2
```

You can change the `--location` value to specify a region near you.

## Push the image to Azure Container Registry

In this section, you push the image to Azure Container Registry from which App Service can deploy it.

1. Run the [`az acr create`](/cli/azure/acr?view=azure-cli-latest#az-acr-create) command to create an Azure Container Registry:

    ```azurecli-interactive
    az acr create --name <registry-name> --resource-group AppSvc-DockerTutorial-rg --sku Basic --admin-enabled true
    ```
    
    Replace `<registry-name>` with a suitable name for your registry. The name must contain only letters and numbers and must be unique across all of Azure.

1. Run the [`az acr show`](/cli/azure/acr?view=azure-cli-latest#az-acr-show) command to retrieve credentials for the registry:

    ```azurecli-interactive
    az acr credential show --resource-group AppSvc-DockerTutorial-rg --name <registry-name>
    ```
    
    The JSON output of this command provides two passwords along with the registry's user name.
    
1. Use the `docker login` command to sign in to the container registry:

    ```bash
    docker login <registry-name>.azurecr.io --username <registry-username>
    ```
    
    Replace `<registry-name>` and `<registry-username>` with values from the previous steps. When prompted, type in one of the passwords from the previous step.

    You use the same registry name in all the remaining steps of this section.

1. Once the login succeeds, tag your local Docker image for the registry:

    ```bash
   docker tag appsvc-tutorial-custom-image <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```    

1. Use the `docker push` command to push the image to the registry:

    ```bash
    docker push <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

    Uploading the image the first time might take a few minutes because it includes the base image. Subsequent uploads are typically faster.

    While you're waiting, you can complete the steps in the next section to configure App Service to deploy from the registry.

1. Use the `az acr repository list` command to verify that the push was successful:

    ```azurecli-interactive
    az acr repository list -n <registry-name>
    ```
    
    The output should show the name of your image.


## Configure App Service to deploy the image from the registry

To deploy a container to Azure App Service, you first create a web app on App Service, then connect the web app to the container registry. When the web app starts, App Service automatically pulls the image from the registry.

1. Create an App Service plan using the [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) command:

    ```azurecli-interactive
    az appservice plan create --name AppSvc-DockerTutorial-plan --resource-group AppSvc-DockerTutorial-rg --is-linux
    ```

    An App Service plan corresponds to the virtual machine that hosts the web app. By default, the previous command uses an inexpensive [B1 pricing tier](https://azure.microsoft.com/pricing/details/app-service/linux/) that is free for the first month. You can control the tier with the `--sku` parameter.

1. Create the web app with the [`az webpp create`](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) command:

    ```azurecli-interactive
    az webapp create --resource-group AppSvc-DockerTutorial-rg --plan AppSvc-DockerTutorial-plan --name <app-name> --deployment-container-image-name <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```
    
    Replace `<app-name>` with a name for the web app, which must be unique across all of Azure. Also replace `<registry-name>` with the name of your registry from the previous section.

1. Use [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) to set the `WEBSITES_PORT` environment variable as expected by the app code: 

    ```azurecli-interactive
    az webapp config appsettings set --resource-group AppSvc-DockerTutorial-rg --name <app-name> --settings WEBSITES_PORT=8000
    ```

    Replace `<app-name>` with the name you used in the previous step.
    
    For more information on this environment variable, see the [readme in the sample's GitHub repository](https://github.com/Azure-Samples/docker-django-webapp-linux).

1. Enable [managed identity](/azure/app-service/overview-managed-identity) for the web app by using the [`az webapp identity assign`](/cli/azure/webapp/identity?view=azure-cli-latest#az-webapp-identity-assign) command:

    ```azurecli-interactive
    az webapp identity assign --resource-group AppSvc-DockerTutorial-rg --name <app-name> --query principalId --output tsv
    ```

    Replace `<app-name>` with the name you used in the previous step. The output of the command (filtered by the `--query` and `--output` arguments) is the service principal of the assigned identity, which you use shortly.

    Managed identity allows you to grant permissions to the web app to access other Azure resources without needing any specific credentials.

1. Retrieve your subscription ID with the [`az account show`](/cli/azure/account?view=azure-cli-latest#az-account-show) command, which you need in the next step:

    ```azurecli-interactive
    az account show --query id --output tsv
    ``` 

1. Grant the web app permission to access the container registry:

    ```azurecli-interactive
    az role assignment create --assignee <principal-id> --scope /subscriptions/<subscription-id>/resourceGroups/AppSvc-DockerTutorial-rg/providers/Microsoft.ContainerRegistry/registries/<registry-name> --role "AcrPull"
    ```

    Replace the following values:
    - `<principal-id>` with the service principal ID from the `az webapp identity assign` command
    - `<registry-name>` with the name of your container registry
    - `<subscription-id>` with the subscription ID retrieved from the `az account show` command

For more information about these permissions, see [What is Azure role-based access control](/azure/role-based-access-control/overview) and 

## Deploy the image and test the app

You can complete these steps once the image is pushed to the container registry and the App Service is fully provisioned.

1. Use the [`az webapp config container set`](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set) command to specify the container registry and the image to deploy for the web app:

    ```azurecli-interactive
    az webapp config container set --name <app-name> --resource-group AppSvc-DockerTutorial-rg --docker-custom-image-name <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest --docker-registry-server-url https://<registry-name>.azurecr.io
    ```
    
    Replace `<app_name>` with the name of your web app and replace `<registry-name>` in two places with the name of your registry. 

    - When using a registry other than Docker Hub (as this example shows), `--docker-registry-server-url` must be formatted as `https://` followed by the fully qualified domain name of the registry.
    - The message, "No credential was provided to access Azure Container Registry. Trying to look up..." tells you that Azure is using the app's managed identity to authenticate with the container registry rather than asking for a username and password.
    - If you encounter the error, "AttributeError: 'NoneType' object has no attribute 'reserved'", make sure your `<app-name>` is correct.

    > [!TIP]
    > You can retrieve the web app's container settings at any time with the command `az webapp config container show --name <app-name> --resource-group AppSvc-DockerTutorial-rg`. The image is specified in the property `DOCKER_CUSTOM_IMAGE_NAME`. When the web app is deployed through Azure DevOps or Azure Resource Manager templates, the image can also appear in a property named `LinuxFxVersion`. Both properties serve the same purpose. If both are present in the web app's configuration, `LinuxFxVersion` takes precedence.

1. Once the `az webapp config container set` command completes, the web app should be running in the container on App Service.

    To test the app, browse to `http://<app-name>.azurewebsites.net`, replacing `<app-name>` with the name of your web app. On first access, it may take some time for the app to respond because App Service must pull the entire image from the registry. If the browser times out, just refresh the page. Once the initial image is pulled, subsequent tests will run much faster.

    ![Successful test of the web app on Azure](./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-azure.png)

## Modify the app code and redeploy

In this section, you make a change to the web app code, rebuild the container, and then push the container to the registry. App Service then automatically pulls the updated image from the registry to update the running web app.

1. In your local *docker-django-webapp-linux* folder, open the file *app/templates/app/index.html*.

1. Change the first HTML element to match the following code.

    ```html
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Azure App Service - Updated Here!</a>
        </div>
      </div>
    </nav>
    ```
    
1. Save your changes.

1. Change to the *docker-django-webapp-linux* folder and rebuild the image:

    ```bash
    docker build --tag appsvc-tutorial-custom-image .
    ```

1. Update the version number in the image's tag to v1.0.1:

    ```bash
    docker tag appsvc-tutorial-custom-image <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

    Replace `<registry-name>` with the name of your registry.

1. Push the image to the registry:

    ```bash
    docker push <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

1. Restart the web app:

    ```azurecli-interactive
    az webapp restart --name <app_name> --resource-group AppSvc-DockerTutorial-rg
    ```

    Replace `<app_name>` with the name of your web app. Upon restart, App Service pulls the updated image from the container registry.

1. Verify that the update has been deployed by browsing to `http://<app-name>.azurewebsites.net`.

## Access diagnostic logs

1. Turn on container logging:

    ```azurecli-interactive
    az webapp log config --name <app-name> --resource-group AppSvc-DockerTutorial-rg --docker-container-logging filesystem
    ```
    
1. Enable the log stream:

    ```azurecli-interactive
    az webapp log tail --name <app-name> --resource-group AppSvc-DockerTutorial-rg
    ```
    
    If you don't see console logs immediately, check again in 30 seconds.

    You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.

1. To stop log streaming at any time, type **Ctrl**+**C**.

## Connect to the container using SSH

SSH enables secure communication between a container and a client. To enable SSH connection to your container, your custom image must be configured for it. Once the container is running, you can open an SSH connection.

### Configure the container for SSH

The sample app used in this tutorial already has the necessary configuration in the *Dockerfile*, which installs the SSH server and also sets the login credentials. This section is informational only. To connect to the container, skip to the next section

```Dockerfile
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends dialog \
        && apt-get update \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "$SSH_PASSWD" | chpasswd 
```

> [!NOTE]
> This configuration doesn't allow external connections to the container. SSH is available only through the Kudu/SCM Site. The Kudu/SCM site is authenticated with your Azure account.

The *Dockerfile* also copies the *sshd_config* file to the */etc/ssh/* folder and exposes port 2222 on the container:

```Dockerfile
COPY sshd_config /etc/ssh/

# ...

EXPOSE 8000 2222
```

Port 2222 is an internal port accessible only by containers within the bridge network of a private virtual network. 

Finally, the entry script, *init.sh*, starts the SSH server.

```bash
#!/bin/bash
service ssh start
```

### Open SSH connection to container

1. Browse to `https://<app-name>.scm.azurewebsites.net/webssh/host` and sign in with your Azure account. Replace `<app-name>` with the name of your web app.

1. Once signed in, you're redirected to an informational page for the web app. Select **SSH** at the top of the page to open the shell and use commands.

    For example, you can examine the processes running within it using the `top` command.
    
## Clean up resources

The resources you created in this article may incur ongoing costs. to clean up the resources, you need only delete the resource group that contains them:

```azurecli
az group delete --name AppSvc-DockerTutorial-rg
```

## Next steps

What you learned:

> [!div class="checklist"]
> * Deploy a custom image to a private container registry
> * Deploy and the custom image in App Service
> * Update and redeploy the image
> * Access diagnostic logs
> * Connect to the container using SSH

In the next tutorial, you learn how to map a custom DNS name to your app.

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../app-service-web-tutorial-custom-domain.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure custom container](configure-custom-container.md)

> [!div class="nextstepaction"]
> [Tutorial: Multi-container WordPress app](tutorial-multi-container-app.md)
