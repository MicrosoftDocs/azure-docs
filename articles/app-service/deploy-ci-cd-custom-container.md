---
title: CI/CD to custom containers
description: Set up continuous deployment to a custom Windows or Linux container in Azure App Service.
keywords: azure app service, linux, docker, acr,oss
author: msangapu-msft

ms.assetid: a47fb43a-bbbd-4751-bdc1-cd382eae49f8
ms.topic: article
ms.date: 03/09/2021
ms.author: msangapu
ms.custom: seodec18

---
# Continuous deployment with custom containers in Azure App Service

In this tutorial, you configure continuous deployment for a custom container image from managed [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) repositories or [Docker Hub](https://hub.docker.com).

#### Go to Deployment Center

1. In the [Azure portal](https://portal.azure.com), navigate to the management page for your App Service app.

1. From the left menu, click **Deployment Center** > **Settings**. 

#### Choose deployment source

Select the tab that matches your container platform.

# [Windows container](#tab/wincontainer)

Windows containers support CI/CD from the container registry directly.

# [Linux container](#tab/lincontainer)

Linux containers support CI/CD from the container registry directly. They also support CI/CD from farther upstream, at the source repository for the container registry.

1. Choose the deployment source. 

     The **GitHub Actions** option is for you if you maintain the source code for your container image in GitHub. Triggered by new commits to your GitHub repository, the deploy action can run `docker build` and `docker push` directly to your container registry, then update your App Service app to run the new image. As an alternative, you can deploy continuously with **Azure Pipelines** (see [Deploy an Azure Web App Container from Azure Pipelines](/devops/pipelines/targets/webapp-on-container-linux)).

    > [!NOTE]
    > For a Docker Compose app, select **Container Registry**.

1. If you choose GitHub Actions, click **Authorize** and follow the authorization prompts. If you've already authorized with GitHub before, you can deploy from a different user's repository by clicking **Change Account**.

1. Once you authorize your Azure account with GitHub, select the **Organization**, **Repository**, and **Branch** to deploy from.

For more information, see [How CI/CD works with GitHub Actions](#how-ci-cd-works-with-github-actions).

-----

#### Configure registry settings

1. To deploy a multi-container (Docker Compose) app, select **Docker Compose** in **Container Type**.

    If you don't see the **Container Type** dropdown, scroll back up to **Source** and select **Container Registry**.

1. In **Registry source**, choose where your container registry is. If it's neither Azure Container Registry nor Docker Hub, select **Private Registry**.

    > [!NOTE]
    > If your multi-container (Docker Compose) app uses more than one private image, the private images should be in the same private registry and accessible with the same user credentials. If your multi-container app only uses public images, choose **Docker Hub**, even if some images are not in Docker Hub.

    Follow the next steps by selecting the tab that matches your choice.

# [Azure Container Registry](#tab/acr)

3. The **Registry** dropdown displays the registries in the same subscription as your app. Select the registry you want.

    > [!NOTE]
    > To deploy from a registry in a different subscription, choose **Private Registry** in **Registry source** instead.

1. Follow the next step depending on the **Container Type**:
    - For **Docker Compose**, choose the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or just paste the content of your Docker Compose file into **Config**.
    - For **Single Container**, select the **Image** and **Tag** to deploy. If you want, type the start up command in **Startup File**. 
    
    App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

# [Docker Hub](#tab/dockerhub)

3. In **Repository Access**, select whether the image to deploy is public or private. For a Docker Compose app with one or more private images, select **Private**.

1. If you select a private image, specify the **Login** (username) and **Password** of the Docker account.

1. Follow the next step depending on the **Container Type**:
    - For **Docker Compose**, choose the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or just paste the content of your Docker Compose file into **Config**.
    - For **Single Container**, supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). If you want, type the start up command in **Startup File**. 
    
    App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

# [Private Registry](#tab/private)

3. In **Server URL**, type the URL of the server, beginning with **https://**.

1. In **Login**, and **Password** type your login credentials for your private registry.

1. Follow the next step depending on the **Container Type**:
    - For **Docker Compose**, choose the registry for your private images. Select **Choose file** to upload your [Docker Compose file](https://docs.docker.com/compose/compose-file/), or just paste the content of your Docker Compose file into **Config**.
    - For **Single Container**, supply the image and tag name in **Full Image Name and Tag**, separated by a `:` (for example, `nginx:latest`). If you want, type the start up command in **Startup File**. 
    
    App Service appends the string in **Startup File** to [the end of the `docker run` command (as the `[COMMAND] [ARG...]` segment)](https://docs.docker.com/engine/reference/run/) when starting your container.

-----

#### Enable CI/CD

App Service supports CI/CD integration with Azure Container Registry and Docker Hub. To enable it, select **On** in **Continuous deployment**.

> [!NOTE]
> **For Linux containers:**  If you select **GitHub Actions** in **Source**, you don't get this option because CI/CD is handled by GitHub Actions directly. Instead, you see a **Workflow Configuration** section, where you can click **Preview file** to inspect the workflow file. Azure commits this file into your selected GitHub source repository to handle build and deploy tasks. For more information, see [How CI/CD works with GitHub Actions](#how-ci-cd-works-with-github-actions).

When you enable this option, App Service adds a webhook to your repository in Azure Container Registry or Docker Hub. Your repository posts to this webhook whenever your selected image is updated with `docker push`. The webhook causes your App Service app to restart and run `docker pull` to get the updated image.

**For other private registries**, your can post to the webhook manually or as a step in a CI/CD pipeline. In **Webhook URL**, click the **Copy** button to get the webhook URL.

> [!NOTE]
> Support for multi-container (Docker Compose) apps is limited: 
> - For Azure Container Registry, App Service creates a webhook in the selected registry with the registry as the scope. A `docker push` to any repository in the registry triggers an app restart. You may want to [modify the webhook](../container-registry/container-registry-webhook.md) to a narrower scope.
> - Docker Hub doesn't support webhooks at the registry level. You must add the webhooks manually to the images specified in your Docker Compose file.

#### Save your configuration

Click **Save**.

## How CI/CD works with GitHub Actions

> [!NOTE] CI/CD with GitHub Actions is supported for Linux containers only.

If you choose **GitHub Actions** in **Source** (see [Choose deployment source](#choose-deployment-source)), App Service sets up CI/CD in the following ways:

- Deposits a GitHub Actions workflow file into your GitHub repository to handle build and deploy tasks to App Service.
- Adds the credentials for your private registry as GitHub secrets. The generated workflow file runs the [Azure/docker-login](https://github.com/Azure/docker-login) action to sign in with your private registry, then runs `docker push` to deploy to it.
- Adds the publishing profile for your app as a GitHub secret. The generated workflow file uses this secret to authenticate with App Service, then runs the [Azure/webapps-deploy](https://github.com/Azure/webapps-deploy) action to configure the updated image, which triggers an app restart to pull in the updated image.
- Captures information from the [workflow run logs](https://docs.github.com/actions/managing-workflow-runs/using-workflow-run-logs) and displays it in the **Logs** tab in your app's **Deployment Center**.

You can customize the GitHub Actions build provider in the following ways:

- Customize the workflow file after it's generated in your GitHub repository. For more information, see [Workflow syntax for GitHub Actions](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions). Just make sure that the workflow ends with the [Azure/webapps-deploy](https://github.com/Azure/webapps-deploy) action to trigger an app restart.
- If the selected branch is protected, you can still preview the workflow file without saving the configuration, then add it and the required GitHub secrets into your repository manually. This method doesn't give you the log integration with the Azure portal.
- Instead of a publishing profile, deploy using a [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) in Azure Active Directory.

#### Authenticate with a service principal

1. Generate a service principal with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). In the following example, replace *\<subscription-id>*, *\<group-name>*, and *\<app-name>* with your own values:

    ```azurecli-interactive
    az ad sp create-for-rbac --name "myAppDeployAuth" --role contributor \
                                --scopes /subscriptions/<subscription-id>/resourceGroups/<group-name>/providers/Microsoft.Web/sites/<app-name> \
                                --sdk-auth
    ```
    
    > [!IMPORTANT]
    > For security, grant the minimum required access to the service principal. The scope in the previous example is limited to the specific App Service app and not the entire resource group.
    
1. Save the entire JSON output for the next step, including the top-level `{}`.

1. In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret a name like `AZURE_CREDENTIALS`.

1. In the workflow file generated by the **Deployment Center**, revise the `azure/webapps-deploy` step with code like the following example:

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

## Automate with CLI

To configure the container registry and the Docker image, run [az webapp config container set](/cli/azure/webapp/config/container#az-webapp-config-container-set).

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

# [Private Registry](#tab/private)

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name '<image>:<tag>' --docker-registry-server-url <private-repo-url> --docker-registry-server-user <username> --docker-registry-server-password <password>
```

-----

To configure CI/CD from the container registry to your app, run [az webapp deployment container config](/cli/azure/webapp/deployment/container#az-webapp-deployment-container-config). The command outputs the webhook URL, but you must create the webhook in your registry manually in a separate step. The following example enables CI/CD on your app, then uses the webhook URL in the output to create the webhook in Azure Container Registry.

```azurecli-interactive
ci_cd_url=$(az webapp deployment container config --name <app-name> --resource-group <group-name> --enable-cd true --query CI_CD_URL --output tsv)

az acr webhook create --name <webhook-name> --registry <registry-name> --resource-group <group-name> --actions push --uri $ci_cd_url --scope '<image>:<tag>'
```

## Next steps

* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/)
* [Create a .NET Core web app in App Service on Linux](quickstart-dotnetcore.md)
* [Quickstart: Run a custom container on App Service](quickstart-custom-container.md)
* [App Service on Linux FAQ](faq-app-service-linux.md)
* [Configure custom containers](configure-custom-container.md)
* [Actions workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)
