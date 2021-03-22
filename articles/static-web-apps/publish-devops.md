---
title: Tutorial: Publish Azure Static Web Apps with Azure DevOps
description: Learn to use Auzure DevOps to publish Azure Static Web Apps
services: static-web-apps
author: scubaninja
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 02/08/2021
ms.author: apedward
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Tutorial: Publish Azure Static Web Apps with Azure DevOps

This article demonstrates how to deploy an [Azure Static Web Apps](./overview.md) site using [Azure DevOps](https://dev.azure.com/).

In this tutorial, you learn to:

- Setup an an Azure Static Web Apps website
- Create a task in your Azure DevOps Pipeline

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **Azure DevOps Project:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/).
- **Azure DevOps Pipeline:** If you need help getting started, see [Create your first pipeline](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops).
- **Static web app:** If you don't have an existing app, generate one from this [starter template](https://github.com/login?return_to=/staticwebdev/vanilla-basic/generate).

 


## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps (Preview)**.
1. Select **Create**.
1. Configure the resource with the required configuration details. Under _Deployment details_ ensure that you select **Other**. This enables you to use the code in your DevOps repo.

  :::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

1. Once the deployment is successful, select **Manage deployment token**.
1. Copy the **deployment token** and paste it into a text editor for use in another screen

> [!NOTE]
> This value is set aside for now because you'll copy and paste more values in coming steps.

:::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token"::: 

## Create the Pipeline Task in Azure DevOps

1. Navigate to your Azure DevOps project
1. Create a new **Build Pipeline**

  :::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline"::: 

1. Copy and the following YAML to your clipboard

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
1. Select **Variables**
1. Create a new variable
1. Name the variable **deployment_token**
1. Copy the deployment token that you previously pasted into a text editor
1. Paste in the deployment token in the _Value_ box

  :::image type="content" source="media/publish-devops/variable-token.png" alt-text="Deployment token":::

1. Select **OK**
1. Select **Save and run** the pipeline

  :::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::
   
Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. The _Source_ link now points to the branch and location of the Azure DevOps repository.
   
  :::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::


## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
