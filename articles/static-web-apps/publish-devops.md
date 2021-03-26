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
- Create an Azure DevOps Pipeline to build and publish a static web app

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- **Azure DevOps Project:** If you don't have one, you can [create a project for free](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/).
- **Azure DevOps Pipeline:** If you need help getting started, see [Create your first pipeline](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops&preserve-view=true).

## Create a static web app in an Azure DevOps repository

  > [!NOTE]
  > If you have an existing app in your repository, you may skip to the next section.

1. Navigate to your Azure DevOps repository.

1. Select **Import** to begin importing a sample application.
  
    :::image type="content" source="media/publish-devops/devops-repo.png" alt-text="DevOps Repo":::

1. In **Clone URL**, enter `https://github.com/staticwebdev/vanilla-api.git`.

1. Select **Import**.

## Create a static web app

1. Navigate to the [Azure portal](https://portal.azure.com).

1. Select **Create a Resource**.

1. Search for **Static Web Apps**.

1. Select **Static Web Apps (Preview)**.

1. Select **Create**.

1. Under _Deployment details_ ensure that you select **Other**. This enables you to use the code in your Azure DevOps repository.

    > [!NOTE]
    > The functionality to select _Other_ is currently rolling out and may not be available yet in all Azure subscriptions.

    :::image type="content" source="media/publish-devops/create-resource.png" alt-text="Deployment details - other":::

1. Once the deployment is successful, select **Manage deployment token**.

1. Copy the **deployment token** and paste it into a text editor for use in another screen.

    > [!NOTE]
    > This value is set aside for now because you'll copy and paste more values in coming steps.

    :::image type="content" source="media/publish-devops/deployment-token.png" alt-text="Deployment token":::

## Create the Pipeline Task in Azure DevOps

1. Navigate to the Azure DevOps repository that was created earlier.

1. Select **Set up build**.

    :::image type="content" source="media/publish-devops/azdo-build.png" alt-text="Build pipeline":::

1. In the *Configure your pipeline* screen, select **Starter pipeline**.

    :::image type="content" source="media/publish-devops/configure-pipeline.png" alt-text="Configure pipeline":::

1. Copy and paste the following YAML into your pipeline.

    > [!NOTE]
    > The values entered for _app_location_,_api_location_, and _output_location_ will need to be modified for your app.  

    ```yaml
    trigger:​
      - main​
    ​
    pool:​
      vmImage: ubuntu-latest​
    ​
    steps:​
      - task: AzureStaticWebApp@0​
        inputs:​
          app_location: "/" ​
          api_location: "api​"
          output_location: ""
        env:​
          azure_static_web_apps_api_token: $(deployment_token)
    ```

    > [!NOTE]
    > If you are not using the sample app, configure the Azure Static Web App inputs according to the folder structure of your application.

    [!INCLUDE [static-web-apps-folder-structure](../../includes/static-web-apps-folder-structure.md)]

    The `azure_static_web_apps_api_token` value is self managed and is manually configured.

1. Select **Variables**.

1. Create a new variable.

1. Name the variable **deployment_token** (matching the name in the workflow).

1. Copy the deployment token that you previously pasted into a text editor.

1. Paste in the deployment token in the _Value_ box.

    :::image type="content" source="media/publish-devops/variable-token.png" alt-text="Variable token":::

1. Select **Keep this value secret**.

1. Select **OK**.

1. Select **Save** to return to your pipeline YAML.

1. Select **Save and run** to open the _Save and run_ dialog.

    :::image type="content" source="media/publish-devops/save-and-run.png" alt-text="Pipeline":::

1. Select **Save and run** to run the pipeline.

1. Once the deployment is successful, navigate to the Azure Static Web Apps **Overview** which includes links to the deployment configuration. Note how the _Source_ link now points to the branch and location of the Azure DevOps repository.

1. Select the **URL** to see your newly deployed website.

    :::image type="content" source="media/publish-devops/deployment-location.png" alt-text="Deployment location":::

## Next steps

> [!div class="nextstepaction"]
> [Configure Azure Static Web Apps](./configuration.md)
