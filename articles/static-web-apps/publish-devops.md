---
title: Tutorial: Publish Azure Static Web Apps with Azure DevOps
description: Learn to use Azure DevOps to publish Azure Static Web Apps
services: static-web-apps
author: scubaninja
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 02/08/2021
ms.author: apedward
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Tutorial: Publish Azure Static Web Apps with Azure DevOps

This article demonstrates how to deploy to [Azure Static Web Apps](./overview.md) using [Azure DevOps](https://dev.azure.com/).

In this tutorial, you learn to:

- Set up an Azure Static Web Apps site
- Create an Azure DevOps Pipeline to build and publish a static web app 

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **Azure DevOps Project:** If you don't have one, you can [create a project for free](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/).
- **Azure DevOps Pipeline:** If you need help getting started, see [Create your first pipeline](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops).


## Create a static web app in an Azure DevOps repository
> [!NOTE]
> If you have an existing app in your repository, you may skip to the next section.

1. Navigate to your Azure DevOps repository.
   
2. Use an existing repository or _import a repository_ as shown below.
  
  :::image type="content" source="media/publish-devops/devops-repo.png" alt-text="DevOps Repo":::

3. Create a new file for your front end web app.
   
4. Copy and paste the following HTML markup into your new file:

  ```HTML
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Hello World!</title>
  </head>

  <body>
    <main>
      <h1>Hello World!</h1>
    </main>
  </body>

  </html>
  ```

5. Save the file.

## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com).
   
2. Select **Create a Resource**.
   
3. Search for **Static Web Apps**.
   
4. Select **Static Web Apps (Preview)**.
   
5. Select **Create**.
   
6. Under _Deployment details_ ensure that you select **Other**. This enables you to use the code in your Azure DevOps repository.
  > [!NOTE]
  > The functionality to select _other_ is currently rolling out and may not be available yet in all Azure subscriptions.

  :::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

7. Once the deployment is successful, select **Manage deployment token**.

8. Copy the **deployment token** and paste it into a text editor for use in another screen.

> [!NOTE]
> This value is set aside for now because you'll copy and paste more values in coming steps.

  :::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token"::: 

## Create the Pipeline Task in Azure DevOps

1. Navigate to the Azure DevOps project that was created earlier.

2. Create a new **Build Pipeline** and select **Set up build**.

  :::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline"::: 

3. Copy and paste the following YAML into your pipeline.
> [!NOTE]
> The values entered for _app_location_, _api_location_, and _output_location_ will need to be modified for your app.  

```YAML
trigger:​
  - main​
​
pool:​
  vmImage: ubuntu-latest​
​
steps:​
  - task: AzureStaticWebApp@0​
    inputs:​
      app_location: frontend ​
      api_location: api​
      output_location: build​
    env:​
      azure_static_web_apps_api_token: $(deployment_token)
   ```
Configure the _Azure Static Web App_ inputs according to the folder structure of your application.

| Property | Description | Required |
|---|---|---|
| `app_location` | Location of your application code.<br><br>For example, enter `/` if your application source code is at the root of the repository, or `/app` if your application code is in a directory called `app`. | Yes |
| `api_location` | Location of your Azure Functions code.<br><br>For example, enter `/api` if your app code is in a folder called `api`. If no Azure Functions app is detected in the folder, the build doesn't fail, the workflow assumes you don't want an API. | No |
| `output_location` | Location of the build output directory relative to the `app_location`.<br><br>For example, if your application source code is located at `/app`, and the build script outputs files to the `/app/build` folder, then set `build` as the `output_location` value. | No |

The `azure_static_web_apps_api_token` value is self managed and is manually configured.

4. Select **Variables**.

5. Create a new variable.

6. Name the variable **deployment_token** (matching the name in the workflow).

7. Copy the deployment token that you previously pasted into a text editor.

8. Paste in the deployment token in the _Value_ box.

  :::image type="content" source="media/publish-devops/variable-token.png" alt-text="Deployment token":::

9. Select **OK**.

10. Select **Save and run** the pipeline.

  :::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::
   
Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. Select the URL of your Azure Static Web App to see your newly deployed app. The _Source_ link now points to the branch and location of the Azure DevOps repository.
   
  :::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::


## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
