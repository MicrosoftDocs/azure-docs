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

This article demonstrates how to deploy an [Azure Static Web App](articles\static-web-apps\overview.md) using [Azure DevOps](https://dev.azure.com/). The aim to is to deploy a new Azure Static Web App from your Azure DevOps pipeline. 

In this tutorial, you will learn how to:

- Create a task in your Azure DevOps Pipeline
- Setup an an Azure Static Web Apps website

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- An Azure DevOps Project. If you don't have one, you can [create an account for free](https://azure.microsoft.com/en-gb/pricing/details/devops/azure-devops-services/).
- An understanding of how to set up an Azure DevOps Pipeline. If you are not familiar with how to do so, [instructions are available here.](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an Azure Static Web Apps

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps (Preview)**.
1. Select **Create**.
1. Configure the resource with the required configuration details. Under 'Deployment details' ensure that you select **Other**. This enables you to use the code in your Azure DevOps repo (or another source control repo other than GitHub).

:::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

1. Once the deployment is successful, select **Manage deployment token**.
1. Copy the deployment token.

:::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token"::: 

## Create the Pipeline Task in Azure DevOps

1. Navigate to the Azure DevOps project.
1. Create a new **Build Pipeline**.

:::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline"::: 

1. Copy and paste in the YAML into the pipeline.

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
1. Select **Variables**.
1. Create a new variable.
1. Paste in the deployment token.

:::image type="content" source="media/publish-devops/variable-token.png" alt-text="Deployment token":::
   
1. **Save and run** the pipeline.

:::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::
   
Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. The _Source_ link now points to the branch and location of the Azure DevOps repository.
   
:::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::


## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
