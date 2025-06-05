---
title: Configure CI/CD to Custom Containers
description: Set up continuous integration and continuous delivery (CI/CD) to a custom Windows or Linux container in Azure App Service.
keywords: azure app service, linux, docker, acr, oss
author: msangapu-msft
ms.assetid: a47fb43a-bbbd-4751-bdc1-cd382eae49f8
ms.topic: how-to
ms.date: 05/02/2025
ms.author: msangapu
ms.custom: devx-track-azurecli, linux-related-content
zone_pivot_groups: app-service-containers-windows-linux
---

# Continuous deployment with custom containers in Azure App Service

This article explains how to configure continuous integration and continuous delivery (CI/CD) for a custom container image from managed [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) repositories or [Docker Hub](https://hub.docker.com).

## 1. Go to the Deployment Center

In the [Azure portal](https://portal.azure.com), go to the management pane for your Azure App Service app.

In the sidebar menu under **Deployment**, select **Deployment Center**. Choose the **Settings** tab.

::: zone pivot="container-linux"
## 2. Select code source

From the **Source** dropdown menu, select the deployment source based on the following criteria:

* **Container registry** sets up CI/CD between your container registry and App Service.
* Choose the **GitHub Actions** option if you maintain the source code for your container image in GitHub. New commits to your GitHub repository trigger the deploy action, which can run `docker build` and `docker push` directly to your container registry. It then updates your App Service app to run the new image. For more information, see [How CI/CD works with GitHub Actions](#how-cicd-works-with-github-actions).
* To set up CI/CD with **Azure Pipelines**, see [Deploy an Azure Web App Container from Azure Pipelines](/azure/devops/pipelines/targets/webapp-on-container-linux).
* For a Docker Compose app, select **Container Registry**.

If you choose GitHub Actions, select **Authorize** and follow the authorization prompts. If you previously authorized with GitHub, you can deploy from a different user's repository by selecting **Change Account**.

After you authorize your Azure account with GitHub, select the **Organization**, **Repository**, and **Branch** to deploy from.
::: zone-end  

::: zone pivot="container-windows"
## 2. Configure registry settings
::: zone-end  
::: zone pivot="container-linux"
## 3. Configure registry settings

> [!NOTE]
> Sidecar containers will succeed multi-container (Docker Compose) apps in App Service. To get started, see [Tutorial: Configure a sidecar container for custom containers in Azure App Service](tutorial-custom-container-sidecar.md).

To deploy a multi-container (Docker Compose) app, select **Docker Compose** in **Container Type**.

If you don't see the **Container Type** dropdown list, scroll back up to **Source** and select **Container Registry**.
::: zone-end

In **Registry source**, select where your container registry is. If it's not Azure Container Registry or Docker Hub, select **Private registry**.

::: zone pivot="container-linux"
> [!NOTE]
> If your multi-container (Docker Compose) app uses more than one private image, make sure the private images are in the same private registry and are accessible with the same user credentials. If your multi-container app uses only public images, select **Docker Hub**, even if some images aren't in Docker Hub.
::: zone-end  

Follow the next steps by selecting the tab that matches your choice.

# [Azure Container Registry](#tab/acr)

The **Registry** dropdown list displays the registries in the same subscription as your app. Select the registry you want.

To deploy from a registry in a different subscription, select **Private registry** in **Registry source** instead.

To use managed identities to lock down Azure Container Registry access, see: 

* [How to use system-assigned managed identities with App Service and Azure Container Registry](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/use_system-assigned_managed_identities.md)
* [How to use user-assigned managed identities with App Service and Azure Container Registry](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/use_user-assigned_managed_identities.md)

::: zone pivot="container-windows"
Select the **Image** and **Tag** to deploy. You can choose to type the startup command in **Startup File**.
::: zone-end
::: zone pivot="container-linux"
Follow the next step, depending on the **Container Type** value:
* For **Docker Compose**, select the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or just paste the contents of your Docker Compose file into **Config**.
* For **Single Container**, select the **Image** and **Tag** to deploy. You can choose to type the startup command in **Startup File**.
::: zone-end

App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

# [Docker Hub](#tab/dockerhub)

::: zone pivot="container-windows"
In **Repository Access**, select whether the image you want to deploy is public or private.
::: zone-end
::: zone pivot="container-linux"
In **Repository Access**, select whether the image you want to deploy is public or private. For a Docker Compose app with one or more private images, select **Private**.
::: zone-end

If you select a private image, specify the **Login** (username) and **Password** values for the Docker account.

::: zone pivot="container-windows"
Supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). You can choose to type the startup command in **Startup File**.
::: zone-end
::: zone pivot="container-linux"
Follow the next step, depending on the **Container Type** value:
* For **Docker Compose**, select the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or **paste** the contents of your Docker Compose file into **Config**.
* For **Single Container**, supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). You can choose to type the startup command in **Startup File**.
::: zone-end

App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

# [Private registry](#tab/private)

In **Server URL**, type the URL of the server, beginning with `https://`.

In the **Login** and **Password** fields, type your sign-in credentials for your private registry.

::: zone pivot="container-windows"
Supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). You can choose to type the startup command in **Startup File**.
::: zone-end
::: zone pivot="container-linux"
Follow the next step, depending on the **Container Type** value:
* For **Docker Compose**, select the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or paste the contents of your Docker Compose file into **Config**.
* For **Single Container**, supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). You can choose to type the startup command in **Startup File**.
::: zone-end

App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

-----

::: zone pivot="container-windows"
## 3. Enable CI/CD
::: zone-end
::: zone pivot="container-linux"
## 4. Enable CI/CD
::: zone-end

App Service supports CI/CD integration with Azure Container Registry and Docker Hub. To enable CI/CD integration, select **On** in **Continuous deployment**.

::: zone pivot="container-linux"
> [!NOTE]
> If you select **GitHub Actions** in **Source**, you don't see this option because CI/CD is handled by GitHub Actions directly. Instead, you see a **Workflow Configuration** section, where you can select **Preview file** to inspect the workflow file. Azure commits this file into your selected GitHub source repository to handle build and deploy tasks. For more information, see [How CI/CD works with GitHub Actions](#how-cicd-works-with-github-actions).
::: zone-end

When you enable this option, App Service adds a webhook to your repository in Azure Container Registry or Docker Hub. Your repository posts to this webhook whenever your selected image is updated with `docker push`. The webhook causes your App Service app to restart and run `docker pull` to get the updated image.

To ensure the proper functioning of the webhook, it's essential to enable the **Basic Auth Publishing Credentials** option within your web app. If you don't, you might receive a "401 unauthorized" error for the webhook.

To verify whether **Basic Auth Publishing Credentials** is enabled, go to your web app's **Configuration** > **General Settings**. Look for the **Platform Setting** section, and then select the **Basic Auth Publishing Credentials** option.

For other private registries, you can post to the webhook manually or as a step in a CI/CD pipeline. In **Webhook URL**, select the **Copy** button to get the webhook URL.

Select **Save** to save your settings.

::: zone pivot="container-linux"
> [!NOTE]
> Support for multi-container (Docker Compose) apps is limited. For Azure Container Registry, App Service creates a webhook in the selected registry with the registry as the scope. A `docker push` to any repository in the registry (including the ones not referenced by your Docker Compose file) triggers an app restart. You might want to [modify the webhook](/azure/container-registry/container-registry-webhook) to a narrower scope. Docker Hub doesn't support webhooks at the registry level. You must add the webhooks manually to the images specified in your Docker Compose file.
::: zone-end

::: zone pivot="container-linux"

## How CI/CD works with GitHub Actions

If you choose **GitHub Actions** from the [Select code source](#2-select-code-source) dropdown menu, App Service sets up CI/CD in the following ways:

* It deposits a GitHub Actions workflow file into your GitHub repository to handle build and deploy tasks to App Service.
* It adds the credentials for your private registry as GitHub secrets. The generated workflow file runs the [`Azure/docker-login`](https://github.com/Azure/docker-login) action to sign in with your private registry, and then runs `docker push` to deploy to it.
* It adds the publishing profile for your app as a GitHub secret. The generated workflow file uses this secret to authenticate with App Service, and then runs the [`Azure/webapps-deploy`](https://github.com/Azure/webapps-deploy) action to configure the updated image, which triggers an app restart to pull in the updated image.
* It captures information from the [workflow run logs](https://docs.github.com/actions/managing-workflow-runs/using-workflow-run-logs) and displays it in the **Logs** tab in your app's **Deployment Center**.

You can customize the GitHub Actions build provider in the following ways:

* Customize the workflow file after it generates in your GitHub repository. For more information, see [Workflow syntax for GitHub Actions](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions). The workflow must end with the [`Azure/webapps-deploy`](https://github.com/Azure/webapps-deploy) action to trigger an app restart.
* If the selected branch is protected, you can still preview the workflow file without saving the configuration. Add it and the required GitHub secrets into your repository manually. This method doesn't give you log integration with the Azure portal.
* Instead of a publishing profile, deploy by using a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) in Microsoft Entra ID.

#### Authenticate with a service principal

This optional configuration replaces the default authentication with publishing profiles in the generated workflow file.

Generate a service principal by using the [`az ad sp create-for-rbac`](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). In the following example, replace *\<subscription-id>*, *\<group-name>*, and *\<app-name>* with your own values. Save the entire JSON output for the next step, including the top-level `{}`.

```azurecli-interactive
az ad sp create-for-rbac --name "myAppDeployAuth" --role contributor \
                            --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                            --json-auth
```

> [!IMPORTANT]
> For security, grant the minimum required access to the service principal. The scope in the previous example is limited to the specific App Service app and not the entire resource group.

In [GitHub](https://github.com/), go to your repository, and then select **Settings** > **Secrets** > **Add a new secret**. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret a name like `AZURE_CREDENTIALS`.

In the workflow file generated by the **Deployment Center**, revise the `azure/webapps-deploy` step with code similar to the following example:

```yaml
- name: Sign in to Azure 
# Use the GitHub secret you added
- uses: azure/login@v1
    with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
- name: Deploy to Azure Web App
# Remove publish-profile
- uses: azure/webapps-deploy@v2
    with:
    app-name: '<app-name>'
    slot-name: 'production'
    images: '<registry-server>/${{ secrets.AzureAppService_ContainerUsername_... }}/<image>:${{ github.sha }}'
    - name: Sign out of Azure
    run: |
    az logout
```

::: zone-end

## Automate with CLI

To configure the container registry and the Docker image, run [`az webapp config container set`](/cli/azure/webapp/config/container#az-webapp-config-container-set).

# [Azure Container Registry](#tab/acr)

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name '<image>:<tag>' --docker-registry-server-url 'https://<registry-name>.azurecr.io' --docker-registry-server-user '<username>' --docker-registry-server-password '<password>'
```

# [Docker Hub](#tab/dockerhub)

```azurecli-interactive
# Public image
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <image-name>

# Private image
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <image-name> --docker-registry-server-user <username> --docker-registry-server-password <password>
```

# [Private registry](#tab/private)

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name '<image>:<tag>' --docker-registry-server-url <private-repo-url> --docker-registry-server-user <username> --docker-registry-server-password <password>
```

-----

::: zone pivot="container-linux"
To configure a multi-container (Docker Compose) app, prepare a Docker Compose file locally, and then run [`az webapp config container set`](/cli/azure/webapp/config/container#az-webapp-config-container-set) with the `--multicontainer-config-file` parameter. If your Docker Compose file contains private images, add `--docker-registry-server-*` parameters as shown in the previous example.

```azurecli-interactive
az webapp config container set --resource-group <group-name> --name <app-name> --multicontainer-config-file <docker-compose-file>
```
::: zone-end

To configure CI/CD from the container registry to your app, run [`az webapp deployment container config`](/cli/azure/webapp/deployment/container#az-webapp-deployment-container-config) with the `--enable-cd` parameter. The command outputs the webhook URL, but you must create the webhook in your registry manually in a separate step. The following example enables CI/CD on your app, and then uses the webhook URL in the output to create the webhook in Azure Container Registry.

```azurecli-interactive
ci_cd_url=$(az webapp deployment container config --name <app-name> --resource-group <group-name> --enable-cd true --query CI_CD_URL --output tsv)

az acr webhook create --name <webhook-name> --registry <registry-name> --resource-group <group-name> --actions push --uri $ci_cd_url --scope '<image>:<tag>'
```

## Related content

* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
* [Create a .NET Core web app in App Service on Linux](quickstart-dotnetcore.md)
* [Quickstart: Run a custom container on App Service](quickstart-custom-container.md)
* [App Service on Linux FAQ](faq-app-service-linux.yml)
* [Configure custom containers](configure-custom-container.md)
* [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)
