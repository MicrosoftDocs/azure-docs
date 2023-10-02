---
title: 'Tutorial: Build and run a custom image in Azure App Service'
description: A step-by-step guide to build a custom Linux or Windows image, push the image to Azure Container Registry, and then deploy that image to Azure App Service. Learn how to migrate custom software to App Service in a custom container.
ms.topic: tutorial
ms.date: 11/29/2022
ms.author: msangapu
author: msangapu-msft
keywords: azure app service, web app, linux, windows, docker, container
ms.custom: devx-track-csharp, mvc, seodec18, devx-track-azurecli, devdivchpfy22
zone_pivot_groups: app-service-containers-windows-linux
---

# Migrate custom software to Azure App Service using a custom container

::: zone pivot="container-windows"  

[Azure App Service](overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. The preconfigured Windows environment locks down the operating system from:
- Administrative access.
- Software installations.
- Changes to the global assembly cache.

For more information, see [Operating system functionality on Azure App Service](operating-system-functionality.md).

You can deploy a custom-configured Windows image from Visual Studio to make OS changes that your app needs. So it's easy to migrate on-premises app that requires custom OS and software configuration. This tutorial demonstrates how to migrate to App Service an ASP.NET app that uses custom fonts installed in the Windows font library. You deploy a custom-configured Windows image from Visual Studio to [Azure Container Registry](../container-registry/index.yml), and then run it in App Service.

:::image type="content" source="media/tutorial-custom-container/app-running-newupdate.png" alt-text="Shows the web app running in a Windows container.":::

## Prerequisites

To complete this tutorial:

- <a href="https://hub.docker.com/" target="_blank">Sign up for a Docker Hub account</a>
- <a href="https://docs.docker.com/docker-for-windows/install/" target="_blank">Install Docker for Windows</a>.
- <a href="/virtualization/windowscontainers/quick-start/quick-start-windows-10" target="_blank">Switch Docker to run Windows containers</a>.
- <a href="https://www.visualstudio.com/downloads/" target="_blank">Install Visual Studio 2022</a> with the **ASP.NET and web development** and **Azure development** workloads. If you've installed Visual Studio 2022 already:
    - Install the latest updates in Visual Studio by selecting **Help** > **Check for Updates**.
    - Add the workloads in Visual Studio by selecting **Tools** > **Get Tools and Features**.

## Set up the app locally

### Download the sample

In this step, you set up the local .NET project.

- [Download the sample project](https://github.com/Azure-Samples/custom-font-win-container/archive/master.zip).
- Extract (unzip) the  *custom-font-win-container-master.zip* file.

The sample project contains a simple ASP.NET application that uses a custom font that is installed into the Windows font library. It's not necessary to install fonts. However, the sample is an example of an app that is integrated with the underlying OS. To migrate such an app to App Service, you either rearchitect your code to remove the integration, or migrate it as-is in a custom Windows container.

### Install the font

In Windows Explorer, navigate to *custom-font-win-container-master/CustomFontSample*, right-click *FrederickatheGreat-Regular.ttf*, and select **Install**.

This font is publicly available from [Google Fonts](https://fonts.google.com/specimen/Fredericka+the+Great).

### Run the app

Open the *custom-font-win-container-master/CustomFontSample.sln* file in Visual Studio. 

Type `Ctrl+F5` to run the app without debugging. The app is displayed in your default browser.

:::image type="content" source="media/tutorial-custom-container/local-app-in-browser.png" alt-text="Screenshot showing the app displayed in the default browser.":::

As the app uses an installed font, the app can't run in the App Service sandbox. However, you can deploy it using a Windows container instead, because you can install the font in the Windows container.

### Configure Windows container

In Solution Explorer, right-click the **CustomFontSample** project and select **Add** > **Container Orchestration Support**.

:::image type="content" source="media/tutorial-custom-container/enable-container-orchestration.png" alt-text="Screenshot of the Solution Explorer window showing the CustomFontSample project, Add, and Container Orchestrator Support menu items selected.":::

Select **Docker Compose** > **OK**.

Your project is now set to run in a Windows container. A `Dockerfile` is added to the **CustomFontSample** project, and a **docker-compose** project is added to the solution. 

From the Solution Explorer, open **Dockerfile**.

You need to use a [supported parent image](configure-custom-container.md#supported-parent-images). Change the parent image by replacing the `FROM` line with the following code:

```dockerfile
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.7.2-windowsservercore-ltsc2019
```

At the end of the file, add the following line and save the file:

```dockerfile
RUN ${source:-obj/Docker/publish/InstallFont.ps1}
```

You can find *InstallFont.ps1* in the **CustomFontSample** project. It's a simple script that installs the font. You can find a more complex version of the script in the [Script Center](https://gallery.technet.microsoft.com/scriptcenter/fb742f92-e594-4d0c-8b79-27564c575133).

> [!NOTE]
> To test the Windows container locally, ensure that Docker is started on your local machine.
>

## Publish to Azure Container Registry

[Azure Container Registry](../container-registry/index.yml) can store your images for container deployments. You can configure App Service to use images hosted in Azure Container Registry.

### Open publish wizard

In the Solution Explorer, right-click the **CustomFontSample** project and select **Publish**.

:::image type="content" source="media/tutorial-custom-container/open-publish-wizard.png" alt-text="Screenshot of Solution Explorer showing the CustomFontSample project and Publish selected.":::

### Create registry and publish

In the publish wizard, select **Container Registry** > **Create New Azure Container Registry** > **Publish**.

:::image type="content" source="media/tutorial-custom-container/create-registry.png" alt-text="Screenshot of the publish wizard showing Container Registry, Create New Azure Container Registry, and the Publish button selected.":::

### Sign in with Azure account

In the **Create a new Azure Container Registry** dialog, select **Add an account**, and sign in to your Azure subscription. If you're already signed in, select the account containing the desired subscription from the dropdown.

:::image type="content" source="./media/tutorial-custom-container/add-an-account.png" alt-text="Sign in to Azure.":::

### Configure the registry

Configure the new container registry based on the suggested values in the following table. When finished, select **Create**.

| Setting  | Suggested value | For more information |
| ----------------- | ------------ | ----|
|**DNS Prefix**| Keep the generated registry name, or change it to another unique name. |  |
|**Resource Group**| Select **New**, type **myResourceGroup**, and select **OK**. |  |
|**SKU**| Basic | [Pricing tiers](https://azure.microsoft.com/pricing/details/container-registry/)|
|**Registry Location**| West Europe | |

:::image type="content" source="./media/tutorial-custom-container/configure-registry.png" alt-text="Configure Azure container registry.":::

A terminal window is opened and displays the image deployment progress. Wait for the deployment to complete.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a web app

From the left menu, select **Create a resource** > **Web** > **Web App for Containers**.

### Configure app basics

In the **Basics** tab, configure the settings according to the following table, then select **Next: Docker**.

| Setting  | Suggested value | For more information |
| ----------------- | ------------ | ----|
|**Subscription**| Make sure the correct subscription is selected. |  |
|**Resource Group**| Select **Create new**, type **myResourceGroup**, and select **OK**. |  |
|**Name**| Type a unique name. | The URL of the web app is `https://<app-name>.azurewebsites.net`, where `<app-name>` is your app name. |
|**Publish**| Docker container | |
|**Operating System**| Windows | |
|**Region**| West Europe | |
|**Windows Plan**| Select **Create new**, type **myAppServicePlan**, and select **OK**. | |

Your **Basics** tab should look like this:

:::image type="content" source="media/tutorial-custom-container/configure-app-basics.png" alt-text="Shows the Basics tab used to configure the web app.":::

### Configure Windows container

In the **Docker** tab, configure your custom Windows container as shown in the following table, and select **Review + create**.

| Setting  | Suggested value |
| ----------------- | ------------ |
|**Image Source**| Azure Container Register |
|**Registry**| Select [the registry you created earlier](#publish-to-azure-container-registry). |
|**Image**| customfontsample |
|**Tag**| latest |

### Complete app creation

Select **Create** and wait for Azure to create the required resources.

## Browse to the web app

When the Azure operation is complete, a notification box is displayed.

:::image type="content" source="media/tutorial-custom-container/portal-create-finished.png" alt-text="Shows that the Azure operation is complete.":::

1. Select **Go to resource**.

2. In the app page, select the link under **URL**.

A new browser page is opened to the following page:

:::image type="content" source="media/tutorial-custom-container/app-starting.png" alt-text="Shows the new browser page for the web app.":::

Wait a few minutes and try again, until you get the homepage with the beautiful font you expect:

:::image type="content" source="media/tutorial-custom-container/app-running-newupdate.png" alt-text="Shows the homepage with the font you configured.":::

**Congratulations!** You've migrated an ASP.NET application to Azure App Service in a Windows container.

## See container start-up logs

It might take some time for the Windows container to load. To see the progress, go to the following URL by replacing *\<app-name>* with the name of your app.
```
https://<app-name>.scm.azurewebsites.net/api/logstream
```

The streamed logs look like this:

```
14/09/2018 23:16:19.889 INFO - Site: fonts-win-container - Creating container for image: customfontsample20180914115836.azurecr.io/customfontsample:latest.
14/09/2018 23:16:19.928 INFO - Site: fonts-win-container - Create container for image: customfontsample20180914115836.azurecr.io/customfontsample:latest succeeded. Container Id 329ecfedbe370f1d99857da7352a7633366b878607994ff1334461e44e6f5418
14/09/2018 23:17:23.405 INFO - Site: fonts-win-container - Start container succeeded. Container: 329ecfedbe370f1d99857da7352a7633366b878607994ff1334461e44e6f5418
14/09/2018 23:17:28.637 INFO - Site: fonts-win-container - Container ready
14/09/2018 23:17:28.637 INFO - Site: fonts-win-container - Configuring container
14/09/2018 23:18:03.823 INFO - Site: fonts-win-container - Container ready
14/09/2018 23:18:03.823 INFO - Site: fonts-win-container - Container start-up and configuration completed successfully
```

::: zone-end

::: zone pivot="container-linux"


Azure App Service uses the Docker container technology to host both built-in images and custom images. To see a list of built-in images, run the Azure CLI command, ['az webapp list-runtimes --os linux'](/cli/azure/webapp#az-webapp-list-runtimes). If those images don't satisfy your needs, you can build and deploy a custom image.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Push a custom Docker image to Azure Container Registry
> - Deploy the custom image to App Service
> - Configure environment variables
> - Pull image into App Service using a managed identity
> - Access diagnostic logs
> - Enable CI/CD from Azure Container Registry to App Service
> - Connect to the container using SSH

Completing this tutorial incurs a small charge in your Azure account for the container registry and can incur more costs for hosting the container for longer than a month.

## Set up your initial environment

This tutorial requires version 2.0.80 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.
- Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
  - Install [Docker](https://docs.docker.com/get-started/#setup), which you use to build Docker images. Installing Docker might require a computer restart.

After installing Docker, open a terminal window and verify that the docker is installed:

```bash
docker --version
```

## Clone or download the sample app

You can obtain the sample for this tutorial via git clone or download.

### Clone with git

Clone the sample repository:

```terminal
git clone https://github.com/Azure-Samples/docker-django-webapp-linux.git --config core.autocrlf=input
```

Ensure that you include the `--config core.autocrlf=input` argument to guarantee proper line endings in files that are used inside the Linux container:

Then, navigate to the folder:

```terminal
cd docker-django-webapp-linux
```

### Download from GitHub

Instead of using git clone, you can visit [https://github.com/Azure-Samples/docker-django-webapp-linux](https://github.com/Azure-Samples/docker-django-webapp-linux), select **Clone**, and then select **Download ZIP**.

Unpack the ZIP file into a folder named *docker-django-webapp-linux*.

Then, open a terminal window in the*docker-django-webapp-linux* folder.

## (Optional) Examine the Docker file

The file in the sample named *Dockerfile* that describes the docker image and contains configuration instructions:

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

- The first group of commands installs the app's requirements in the environment.
- The second group of commands create an [SSH](https://www.ssh.com/ssh/protocol/) server for secure communication between the container and the host.
- The last line, `ENTRYPOINT ["init.sh"]`, invokes `init.sh` to start the SSH service and Python server.

## Build and test the image locally

> [!NOTE]
> Docker Hub has [quotas on the number of anonymous pulls per IP and the number of authenticated pulls per free user (see **Data transfer**)](https://www.docker.com/pricing). If you notice your pulls from Docker Hub are being limited, try `docker login` if you're not already logged in.
>

1. Run the following command to build the image:

    ```bash
    docker build --tag appsvc-tutorial-custom-image .
    ```

1. Test that the build works by running the Docker container locally:

    ```bash
    docker run -it -p 8000:8000 appsvc-tutorial-custom-image
    ```

    This [`docker run`](https://docs.docker.com/engine/reference/commandline/run/) command specifies the port with the `-p` argument followed by the name of the image. `-it` lets you stop it with `Ctrl+C`.

    > [!TIP]
    > If you're running on Windows and see the error, *standard_init_linux.go:211: exec user process caused "no such file or directory"*, the *init.sh* file contains CR-LF line endings instead of the expected LF endings. This error happens if you used git to clone the sample repository but omitted the `--config core.autocrlf=input` parameter. In this case, clone the repository again with the `--config`` argument. You might also see the error if you edited *init.sh* and saved it with CRLF endings. In this case, save the file again with LF endings only.

1. Browse to `http://localhost:8000` to verify the web app and container are functioning correctly.

   :::image type="content" source="./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-local.png" alt-text="Test web app locally.":::    

## I. Create a user-assigned managed identity

App Service can either use a default managed identity or a user-assigned managed identity to authenticate with a container registry. In this tutorial, you'll use a user-assigned managed identity.

### [Azure CLI](#tab/azure-cli)

1. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group:

    ```azurecli-interactive
    az group create --name msdocs-custom-container-tutorial --location westeurope
    ```

    You can change the `--location` value to specify a region near you.

1. Create a managed identity in the resource group.

    ```azurecli-interactive
    az identity create --name myID --resource-group msdocs-custom-container-tutorial
    ```

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **I.A.** In the Azure portal:
        1. Type "Managed Identities" in the search bar at the top of the Azure portal.
        1. Select the item labeled **Managed Identities** under the **Services** heading.
        1. Select **Create**.
        You can also navigate to the [creation wizard](https://portal.azure.com/#create/Microsoft.ManagedIdentity) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-managed-identity-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the managed identity creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-managed-identity-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **I.B.** In the create wizard:
        1. In **Subscription**, select the subscription you want to create your resources in.
        1. In **Resource group**, select **Create new**, type the name *msdocs-custom-container-tutorial* for the resource group, then type **OK**.
        1. In **Region**, select **West Europe**, or a region near you.
        1. In **Name**, type **myID**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-managed-identity-2.png" alt-text="A screenshot showing how to configure a new managed identity in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-managed-identity-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **I.C.**
        1. Select the **Review + create** tab.
        1. Select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-managed-identity-3.png" alt-text="A screenshot showing how to complete managed identity create in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-managed-identity-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **I.D.** When the creation of the identity is complete, you can open its management page by selecting **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-managed-identity-4.png" alt-text="A screenshot showing how to open the management page of the new managed identity." lightbox="./media/tutorial-custom-container/azure-portal-create-managed-identity-4.png":::
    :::column-end:::
:::row-end:::

-----

## II. Create a container registry

### [Azure CLI](#tab/azure-cli)

1. Create a container registry with the [`az acr create`](/cli/azure/acr#az-acr-create) command and replace `<registry-name>` with a unique name for your registry. The name must contain only letters and numbers, and must be unique across all of Azure.

    ```azurecli-interactive
    az acr create --name <registry-name> --resource-group msdocs-custom-container-tutorial --sku Basic --admin-enabled true
    ```

    The `--admin-enabled` parameter lets you push images to the registry using a set of administrative credentials.

1. Retrieve the administrative credentials by running the [`az acr show`](/cli/azure/acr#az-acr-show) command:

    ```azurecli-interactive
    az acr credential show --resource-group msdocs-custom-container-tutorial --name <registry-name>
    ```

    The JSON output of this command provides two passwords along with the registry's user name.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **II.A.** In the Azure portal:
        1. Type "Container registries" in the search bar at the top of the Azure portal.
        1. Select the item labeled **Container registries** under the **Services** heading.
        1. Select **Create**.
        You can also navigate to the [creation wizard](https://portal.azure.com/#create/Microsoft.ContainerRegistry) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-container-registry-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the container registry creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-container-registry-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **II.B.** In the create wizard:
        1. In **Subscription**, select the subscription you used earlier.
        1. In **Resource group**, select *msdocs-custom-container-tutorial*.
        1. In **Registry name**, type a unique name for your container registry.
        1. In **Location**, select **West Europe**, or the same region as your managed identity.
        1. In **SKU**, select **Basic**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-container-registry-2.png" alt-text="A screenshot showing how to configure a new container registry in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-container-registry-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **II.C.**
        1. Select the **Review + create** tab.
        1. Select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-container-registry-3.png" alt-text="A screenshot showing how to complete container registry creation in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-container-registry-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **II.D.** When the creation of the container registry is complete, open its management page by selecting **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-container-registry-4.png" alt-text="A screenshot showing how to open the management page of the new container registry." lightbox="./media/tutorial-custom-container/azure-portal-create-container-registry-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **II.E.** In the left navigation menu:
        1. Select **Access keys**.
        1. In **Admin user**, select **Enabled**.
        1. Copy the values of **Login server**, **Username**, and **password**. You'll use them in the next step to sign into the registry and push a docker image.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-container-registry-5.png" alt-text="A screenshot showing how to enable administrative credentials for a container registry." lightbox="./media/tutorial-custom-container/azure-portal-create-container-registry-5.png":::
    :::column-end:::
:::row-end:::

-----

## III. Push the sample image to Azure Container Registry

In this section, you push the image to Azure Container Registry, which will be used by App Service later.

1. From the local terminal where you built the sample image, use the `docker login` command to sign in to the container registry:

    ```bash
    docker login <registry-name>.azurecr.io --username <registry-username>
    ```

    Replace `<registry-name>` and `<registry-username>` with values from the previous steps. When prompted, type in one of the passwords from the previous step.

    You use the same registry name in all the remaining steps of this section.

1. When the sign-in is successful, tag your local Docker image to the registry:

    ```bash
    docker tag appsvc-tutorial-custom-image <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

1. Use the `docker push` command to push the image to the registry:

    ```bash
    docker push <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

    Uploading the image the first time might take a few minutes because it includes the base image. Subsequent uploads are typically faster.

    While you're waiting, you can complete the steps in the next section to configure App Service to deploy from the registry.

## IV. Authorize the managed identity for your registry

The managed identity you created doesn't have authorization to pull from the container registry yet. In this step, you enable the authorization.

### [Azure CLI](#tab/azure-cli)

1. Retrieve the principal ID for the managed identity:

    ```azurecli-interactive
    principalId=$(az identity show --resource-group msdocs-custom-container-tutorial --name myID --query principalId --output tsv)
    ```
1. Retrieve the resource ID for the container registry:

    ```azurecli-interactive
    registryId=$(az acr show --resource-group msdocs-custom-container-tutorial --name <registry-name> --query id --output tsv)
    ```
1. Grant the managed identity permission to access the container registry:

    ```azurecli-interactive
    az role assignment create --assignee $principalId --scope $registryId --role "AcrPull"
    ```

    For more information about these permissions, see [What is Azure role-based access control](../role-based-access-control/overview.md).

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **IV.A.** Back in the management page for the container registry:
        1. In the left navigation menu, select **Access control**.
        1. Select **Add role assignment**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-1.png" alt-text="A screenshot showing how to enable adding a role assignment for a container registry." lightbox="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **IV.B.** Select **AcrPull** in the list.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-2.png" alt-text="A screenshot showing how to enable pull permission on container registry." lightbox="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **IV.C.**:
        1. Select the **Members** tab.
        1. Under **Assign access to**, select **Managed identity**.
        1. Under **Members**, select **Select members**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-3.png" alt-text="A screenshot showing how to select members for an RBAC role." lightbox="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **IV.D.**
        1. In **Managed identity**, select **User-assigned managed identity**.
        1. Under **Select**, select **myID**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-4.png" alt-text="A screenshot showing a user-assigned managed identity selected for role assignment." lightbox="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **IV.E.**
        1. Select the **Review + assign** tab.
        1. Select **Review + assign** at the bottom.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-5.png" alt-text="A screenshot showing role assignment being completed." lightbox="./media/tutorial-custom-container/azure-portal-grant-identity-to-registry-5.png":::
    :::column-end:::
:::row-end:::

-----

## V. Create the web app

### [Azure CLI](#tab/azure-cli)

1. Create an App Service plan using the [`az appservice plan create`](/cli/azure/appservice/plan#az-appservice-plan-create) command:

    ```azurecli-interactive
    az appservice plan create --name myAppServicePlan --resource-group msdocs-custom-container-tutorial --is-linux
    ```

    An App Service plan corresponds to the virtual machine that hosts the web app. By default, the previous command uses an inexpensive [B1 pricing tier](https://azure.microsoft.com/pricing/details/app-service/linux/) that is free for the first month. You can control the tier with the `--sku` parameter.

1. Create the web app with the [`az webapp create`](/cli/azure/webapp#az-webapp-create) command:

    ```azurecli-interactive
    az webapp create --resource-group msdocs-custom-container-tutorial --plan myAppServicePlan --name <app-name> --deployment-container-image-name <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

    Replace `<app-name>` with a name for the web app, which must be unique across all of Azure. Also replace `<registry-name>` with the name of your registry from the previous section.

    > [!TIP]
    > You can retrieve the web app's container settings at any time with the command `az webapp config container show --name <app-name> --resource-group msdocs-custom-container-tutorial`. The image is specified in the property `DOCKER_CUSTOM_IMAGE_NAME`. When the web app is deployed through Azure DevOps or Azure Resource Manager templates, the image can also appear in a property named `LinuxFxVersion`. Both properties serve the same purpose. If both are present in the web app's configuration, `LinuxFxVersion` takes precedence.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **V.A.** In the Azure portal:
        1. Type "app" in the search bar at the top of the Azure portal.
        1. Select the item labeled **App Services** under the **Services** heading.
        1. Select **Create**.
        You can also navigate to the [creation wizard](https://portal.azure.com/#create/Microsoft.WebSite) directly.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-1.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the App Service creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **V.B.** In the create wizard:
        1. In **Subscription**, select the subscription you used earlier.
        1. In **Resource group**, select *msdocs-custom-container-tutorial*.
        1. In **Name**, type a unique app name, which will be used in your app's default hostname `<app-name>.azurewebsites.net`.
        1. In **Publish**, select **Docker Container**.
        1. In **Operating System**, select **Linux**.
        1. In **Region**, select **West Europe**, or a region near you.
        1. In **Linux Plan (West Europe)**, select **Create new**, type a plan name, and select **OK**.
        1. In **Pricing plan**, select **Change size**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-2.png" alt-text="A screenshot showing how to configure a new web app in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **V.C.** In the Spec Picker:
        1. Select **Dev / Test**.
        1. Select **B1**.
        1. Select **Apply**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-3.png" alt-text="A screenshot showing a B1 plan selected for App Service." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **V.D.** Back in the Create Web App wizard:
        1. Select the **Docker** tab.
        1. In **Image Source**, select **Azure Container Registry**.
        1. In **Registry**, select the container registry you created earlier.
        1. In **Image**, select **appsvc-tutorial-custom-image**.
        1. In **Tag**, select **latest**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-4.png" alt-text="A screenshot showing how to configure docker settings in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **V.E.**
        1. Select the **Review + create** tab.
        1. Select **Create**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-5.png" alt-text="A screenshot showing how to complete web app creation in the creation wizard." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **V.F.** When the creation of the web app is complete, you can open its management page by selecting **Go to resource**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-create-app-service-6.png" alt-text="A screenshot showing how to open the management page of the new web app." lightbox="./media/tutorial-custom-container/azure-portal-create-app-service-6.png":::
    :::column-end:::
:::row-end:::

-----

## VI. Configure the web app

In this step, you configure the web app as follows:

- The sample container is listening on port 8000 for web requests, and you configure the app to send requests to port 8000. 
- Tell your app to use the managed identity to pull images from your container registry.
- Configure continuous deployment from the container registry (or, every image push to the registry will trigger your app to pull the new image). This part isn't needed for your web app to pull from your container registry, but it can let your web app know when a new image is pushed to the registry. Without it, you must manually trigger an image pull by restarting the web app.

### [Azure CLI](#tab/azure-cli)

1. Use [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) to set the `WEBSITES_PORT` environment variable as expected by the app code:

    ```azurecli-interactive
    az webapp config appsettings set --resource-group msdocs-custom-container-tutorial --name <app-name> --settings WEBSITES_PORT=8000
    ```

    Replace `<app-name>` with the name you used in the previous step.

    For more information on this environment variable, see the [readme in the sample's GitHub repository](https://github.com/Azure-Samples/docker-django-webapp-linux).

1. Enable the user-assigned managed identity in the web app with the [`az webapp identity assign`](/cli/azure/webapp/identity#az-webapp-identity-assign) command:

    ```azurecli-interactive
    id=$(az identity show --resource-group msdocs-custom-container-tutorial --name myID --query id --output tsv)
    az webapp identity assign --resource-group msdocs-custom-container-tutorial --name <app-name> --identities $id
    ```

    Replace `<app-name>` with the name you used in the previous step.

1. Configure your app to pull from Azure Container Registry by using managed identities.

    ```azurecli-interactive
    appConfig=$(az webapp config show --resource-group msdocs-custom-container-tutorial --name <app-name> --query id --output tsv)
    az resource update --ids $appConfig --set properties.acrUseManagedIdentityCreds=True
    ```

    Replace `<app-name>` with the name you used in the previous step.

1. Set the client ID your web app uses to pull from Azure Container Registry. This step isn't needed if you use the system-assigned managed identity.
    
    ```azurecli-interactive
    clientId=$(az identity show --resource-group msdocs-custom-container-tutorial --name myID --query clientId --output tsv)
    az resource update --ids $appConfig --set properties.AcrUserManagedIdentityID=$clientId
    ```

1. Enable CI/CD in App Service.

    ```azurecli-interactive
    cicdUrl=$(az webapp deployment container config --enable-cd true --name <app-name> --resource-group msdocs-custom-container-tutorial --query CI_CD_URL --output tsv)
    ```

    `CI_CD_URL` is a URL that App Service generates for you. Your registry should use this URL to notify App Service that an image push occurred. It doesn't actually create the webhook for you.

1. Create a webhook in your container registry using the CI_CD_URL you got from the last step.

    ```azurecli-interactive
    az acr webhook create --name appserviceCD --registry <registry-name> --uri $cicdUrl --actions push --scope appsvc-tutorial-custom-image:latest
    ```

1. To test if your webhook is configured properly, ping the webhook, and see if you get a 200 OK response.

    ```azurecli-interactive
    eventId=$(az acr webhook ping --name appserviceCD --registry <registry-name> --query id --output tsv)
    az acr webhook list-events --name appserviceCD --registry <registry-name> --query "[?id=='$eventId'].eventResponseMessage"
    ```

    > [!TIP]
    > To see all information about all webhook events, remove the `--query` parameter.
    >
    > If you're streaming the container log, you should see the message after the webhook ping: `Starting container for site`, because the webhook triggers the app to restart.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **VI.A.** In your web app's management page, select **Configuration**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-1.png" alt-text="A screenshot showing how to open the Configuration page." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VI.B.** In the Configuration page:
        1. Select **New application setting**.
        1. In **Name**, type *WEBSITES_PORT*.
        1. In **Value**, type *8000*.
        1. Select **OK**.
        1. Select **Save** in the top menu, then select **Continue**.
        The `WEBSITES_PORT` setting specifies the container port to forward web requests to. For more information, see [custom container app settings](reference-app-settings.md#custom-containers).
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-2.png" alt-text="A screenshot showing how to set the WEBSITES_PORT app setting." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VI.C.** In the left navigation menu, select **Identity**. Then do the following in the Identity page:
        1. Select the **User assigned** tab.
        1. Select **Add**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-3.png" alt-text="A screenshot showing how to add a user-assigned managed identity to a web app." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-3.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VI.D.**
        1. Select **myID**.
        1. Select **Add**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-4.png" alt-text="A screenshot showing a user-assigned managed identity selected and added." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-4.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VI.E.** In the left navigation menu, select **Deployment Center**. Then do the following in the Deployment Center page:
        1. In **Authentication**, select **Managed Identity**.
        1. In **Identity**, select **myID**.
        1. In **Continuous deployment**, select **On**.
        1. Select **Save** in the top menu.
        When you turn on continuous deployment to a container registry, a webhook is automatically added to the registry for your web app.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-5.png" alt-text="A screenshot showing a user-assigned managed identity selected for registry authentication and continuous deployment enabled." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-5.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VI.F.** In the Deployment Center page, select the **Logs** tab. Here, you can see log messages for pulling the image and starting the container. Later, you'll learn how to see console message generated from within the container.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-configure-app-service-6.png" alt-text="A screenshot showing log messages for pulling an image and starting the container." lightbox="./media/tutorial-custom-container/azure-portal-configure-app-service-6.png":::
    :::column-end:::
:::row-end:::
-----

## VII. Browse to the web app

### [Azure CLI](#tab/azure-cli)

To test the app, browse to `https://<app-name>.azurewebsites.net`, replacing `<app-name>` with the name of your web app. 

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **VII.A.** In the App Service page:
        1. In the left navigation menu, select **Overview**.
        1. In **URL**, select the link.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-browse-app-1.png" alt-text="A screenshot showing how to browse to the web app from the Azure portal." lightbox="./media/tutorial-custom-container/azure-portal-browse-app-1.png":::
    :::column-end:::
:::row-end:::

-----

On first access, it might take some time for the app to respond because App Service must pull the entire image from the registry. If the browser times out, just refresh the page. Once the initial image is pulled, subsequent tests will run much faster.

:::image type="content" source="./media/app-service-linux-using-custom-docker-image/app-service-linux-browse-azure.png" alt-text="A screenshot of the browser showing web app running successfully in Azure.":::

## VIII. Access diagnostic logs

### [Azure CLI](#tab/azure-cli)

While you're waiting for the App Service to pull in the image, it's helpful to see exactly what App Service is doing by streaming the container logs to your terminal.

1. Turn on container logging:

    ```azurecli-interactive
    az webapp log config --name <app-name> --resource-group msdocs-custom-container-tutorial --docker-container-logging filesystem
    ```

1. Enable the log stream:

    ```azurecli-interactive
    az webapp log tail --name <app-name> --resource-group msdocs-custom-container-tutorial
    ```

    If you don't see console logs immediately, check again in 30 seconds.

    You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.

1. To stop log streaming at any time, type `Ctrl+C`.

### [Azure portal](#tab/azure-portal)

In the Deployment Center page, you can already see the log messages for pulling and starting the container. In this step, you can enable logging of the console output from within the container.

:::row:::
    :::column span="2":::
        **VIII.A.** In the App Service page:
        1. In the left navigation menu, select **App Service logs**.
        1. In **Application logging**, select **File System**.
        1. Select **Save**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-stream-diagnostic-logs-1.png" alt-text="A screenshot showing how to enable diagnostic logging for custom container." lightbox="./media/tutorial-custom-container/azure-portal-stream-diagnostic-logs-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **VIII.B.** In the left navigation menu, select **Log stream**. You should now start to see the container's console output in the log stream.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-stream-diagnostic-logs-2.png" alt-text="A screenshot showing log messages that contain the container's console output." lightbox="./media/tutorial-custom-container/azure-portal-stream-diagnostic-logs-2.png":::
    :::column-end:::
:::row-end:::

-----

## IX. Modify the app code and redeploy

In this section, you make a change to the web app code, rebuild the image, and then push it to your container registry. App Service then automatically pulls the updated image from the registry to update the running web app.

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

1. Update the image's tag to latest:

    ```bash
    docker tag appsvc-tutorial-custom-image <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

    Replace `<registry-name>` with the name of your registry.

1. Push the image to the registry:

    ```bash
    docker push <registry-name>.azurecr.io/appsvc-tutorial-custom-image:latest
    ```

1. When the image push is complete, the webhook notifies the App Service about the push, and App Service tries to pull in the updated image. Wait a few minutes, and then verify that the update has been deployed by browsing to `https://<app-name>.azurewebsites.net`.

## X. Connect to the container using SSH

SSH enables secure communication between a container and a client. To enable SSH connection to your container, your custom image must be configured for it. When the container is running, you can open an SSH connection.

### Configure the container for SSH

The sample app used in this tutorial already has the necessary configuration in the *Dockerfile*, which installs the SSH server and also sets the sign-in credentials. This section is informational only. To connect to the container, skip to the next section.

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
> root:Docker! should not be altered SSH. SCM/KUDU will use your Azure Portal credentials. Changing this value will result in an error when using SSH.

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

### [Azure CLI](#tab/azure-cli)

1. Browse to `https://<app-name>.scm.azurewebsites.net/webssh/host` and sign in with your Azure account. Replace `<app-name>` with the name of your web app.

1. When you sign in, you're redirected to an informational page for the web app. Select **SSH** at the top of the page to open the shell and use commands.

    For example, you can examine the processes running within it using the `top` command.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **X.A.** In the App Service page:
        1. In the left navigation menu, select **SSH**.
        1. Select **Go**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-start-ssh-container-session-1.png" alt-text="A screenshot showing how to open an SSH session with your custom container." lightbox="./media/tutorial-custom-container/azure-portal-start-ssh-container-session-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **X.B.** The SSH session is opened in a new browser tab. Wait for the status bar at the bottom to show a green `SSH CONNECTION ESTABLISHED`. You can then run commands from within the container. Configuration changes made to your container aren't persisted across app restarts.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-start-ssh-container-session-2.png" alt-text="A screenshot showing an SSH session with a custom container." lightbox="./media/tutorial-custom-container/azure-portal-start-ssh-container-session-2.png":::
    :::column-end:::
:::row-end:::

-----

## XI. Clean up resources

### [Azure CLI](#tab/azure-cli)

The resources you created in this article might incur ongoing costs. To clean up the resources, you only need to delete the resource group that contains them:

```azurecli
az group delete --name msdocs-custom-container-tutorial
```

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **XI.A.** In the search bar at the top of the Azure portal:
        1. Enter the resource group name.
        1. Select the resource group.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-delete-resource-group-1.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-custom-container/azure-portal-delete-resource-group-1.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **XI.B.** In the resource group page, select **Delete resource group**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-delete-resource-group-2.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-custom-container/azure-portal-delete-resource-group-2.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **XI.C.** 
        1. Enter the resource group name to confirm your deletion.
        1. Select **Delete**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-custom-container/azure-portal-delete-resource-group-3.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-custom-container/azure-portal-delete-resource-group-3.png"::::
    :::column-end:::
:::row-end:::

-----

::: zone-end

## Next steps

What you learned:

::: zone pivot="container-windows"

> [!div class="checklist"]
>
> - Deploy a custom image to a private container registry
> - Deploy and the custom image in App Service
> - Update and redeploy the image
> - Access diagnostic logs
> - Connect to the container using SSH

::: zone-end

::: zone pivot="container-linux"

> [!div class="checklist"]
>
> - Push a custom Docker image to Azure Container Registry
> - Deploy the custom image to App Service
> - Configure environment variables
> - Pull image into App Service using a managed identity
> - Access diagnostic logs
> - Enable CI/CD from Azure Container Registry to App Service
> - Connect to the container using SSH

::: zone-end

In the next tutorial, you learn how to secure your app with a custom domain and certificate.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)

Or, check out other resources:

> [!div class="nextstepaction"]
> [Configure custom container](configure-custom-container.md)

::: zone pivot="container-linux"
> [!div class="nextstepaction"]
> [Tutorial: Multi-container WordPress app](tutorial-multi-container-app.md)
::: zone-end
