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

- Set up an Azure Static Web App
- Create an Azure DevOps Pipeline to build and publish a static web app 

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **Azure DevOps Project:** If you don't have one, you can [create a project for free](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/).
- **Azure DevOps Pipeline:** If you need help getting started, see [Create your first pipeline](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops).


## Create a new Web App in a DevOps repository
> [!NOTE]
> If you have an existing app in your repository, you may skip to the next section

1. Navigate to you Azure DevOps repository

1. Create a new file for your front end web app. Copy and paste the following HTML code to get started:

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

1. Save your HTML code, then continue below to build and deploy your web app.

## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com).
   
2. Select **Create a Resource**.
   
3. Search for **Static Web Apps**.
   
4. Select **Static Web Apps (Preview)**.
   
5. Select **Create**.
   
6. Configure the resource with the required configuration details. Under _Deployment details_ ensure that you select **Other**. This enables you to use the code in your DevOps repo.
  > [!NOTE]
  > The functionality to select _other_ is currently rolling out.

  :::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

7. Once the deployment is successful, select **Manage deployment token**.

8. Copy the **deployment token** and paste it into a text editor for use in another screen

> [!NOTE]
> This value is set aside for now because you'll copy and paste more values in coming steps.

  :::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token"::: 

## Create the Pipeline Task in Azure DevOps

1. Navigate to your Azure DevOps project

1. Create a new **Build Pipeline**

  :::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline"::: 

1. Copy and the following YAML to your clipboard 
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
1. Paste the YAML into your pipeline

2. Select **Variables**

3. Create a new variable

4. Name the variable **deployment_token** (matching the name in the workflow)

5. Copy the deployment token that you previously pasted into a text editor

6. Paste in the deployment token in the _Value_ box

  :::image type="content" source="media/publish-devops/variable-token.png" alt-text="Deployment token":::

1. Select **OK**

1. Select **Save and run** the pipeline

  :::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::
   
Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. The _Source_ link now points to the branch and location of the Azure DevOps repository.
   
  :::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::


## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
