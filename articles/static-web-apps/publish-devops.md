---
title: "Tutorial: Publish Azure Static Web Apps with Azure DevOps"
description: Learn to use Azure DevOps to publish Azure Static Web Apps.
services: static-web-apps
author: scubaninja
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 03/23/2021
ms.author: apedward

---

# Tutorial: Publish Azure Static Web Apps with Azure DevOps

This article demonstrates how to deploy to [Azure Static Web Apps](./overview.md) using [Azure DevOps](https://dev.azure.com/).

In this tutorial, you learn to:

- Set up an Azure Static Web Apps site
- Create an Azure Pipeline to build and publish a static web app

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **Azure DevOps project:** If you don't have one, you can [create a project for free](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/).
  - Azure DevOps includes **Azure Pipelines**. If you need help getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops).
  - The Static Web App Pipeline Task currently only works on **Linux** machines. When running the pipeline mentioned below, please ensure it is running on a Linux VM.

## Create a static web app in an Azure DevOps

  > [!NOTE]
  > If you have an existing app in your repository, you may skip to the next section. The existing app must target .NET Core 3.1 for the pipeline to publish the app correctly.

1. Navigate to your repository in Azure Repos.

1. Select **Import** to begin importing a sample application.
  
    :::image type="content" source="media/publish-devops/devops-repo.png" alt-text="DevOps Repo":::

1. In **Clone URL**, enter `https://github.com/staticwebdev/vanilla-api.git`.

1. Select **Import**.

## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com).

1. Select **Create a Resource**.

1. Search for **Static Web Apps**.

1. Select **Static Web Apps**.

1. Select **Create**.

1. Under _Deployment details_ ensure that you select **Other**. This enables you to use the code inside Azure Repos.

    :::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

1. Once the deployment is successful, navigate to the new Static Web Apps resource.

1. Select **Manage deployment token**.

1. Copy the **deployment token** and paste it into a text editor for use in another screen.

    > [!NOTE]
    > This value is set aside for now because you'll copy and paste more values in coming steps.

    :::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token":::

## Create the Pipeline Task in Azure DevOps

1. Navigate to the repository in Azure Repos that was created earlier.

1. Select **Set up build**.

    :::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline":::

1. In the *Configure your pipeline* screen, select **Starter pipeline**.

    :::image type="content" source="media/publish-devops/configure-pipeline.png" alt-text="Configure pipeline":::

1. Copy and paste the following YAML into your pipeline.

    ```yaml
    trigger:
      - main

    pool:
      vmImage: ubuntu-latest

    steps:
      - checkout: self
        submodules: true
      - task: AzureStaticWebApp@0
        inputs:
          app_location: '/'
          api_location: 'api'
          output_location: ''
          azure_static_web_apps_api_token: $(deployment_token)
    ```

    > [!NOTE]
    > If you are not using the sample app, the values for `app_location`, `api_location`, and `output_location` need  to change to match the values in your application.

    [!INCLUDE [static-web-apps-folder-structure](../../includes/static-web-apps-folder-structure.md)]

    The `azure_static_web_apps_api_token` value is self managed and is manually configured.

2. Select **Variables**.

3. Create a new variable.

4. Name the variable **deployment_token** (matching the name in the workflow).

5. Copy the deployment token that you previously pasted into a text editor.

6. Paste in the deployment token in the _Value_ box.

    :::image type="content" source="media/publish-devops/variable-token.png" alt-text="Variable token":::

7. Select **Keep this value secret**.

8. Select **OK**.

9. Select **Save** to return to your pipeline YAML.

10. Select **Save and run** to open the _Save and run_ dialog.

    :::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::

11. Select **Save and run** to run the pipeline.

12. Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. Note how the _Source_ link now points to the branch and location of the Azure DevOps repository.

13. Select the **URL** to see your newly deployed website.

    :::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::

## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
