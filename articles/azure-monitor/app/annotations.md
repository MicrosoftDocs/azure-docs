---
title: Release annotations for Application Insights | Microsoft Docs
description: Learn how to create annotations to track deployment or other significant events with Application Insights.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 01/24/2023
ms.reviewer: abinetabate
---

# Release annotations for Application Insights

Annotations show where you deployed a new build or other significant events. Annotations make it easy to see whether your changes had any effect on your application's performance. They can be automatically created by the [Azure Pipelines](/azure/devops/pipelines/tasks/) build system. You can also create annotations to flag any event you want by creating them from PowerShell.

## Release annotations with Azure Pipelines build

Release annotations are a feature of the cloud-based Azure Pipelines service of Azure DevOps.

If all the following criteria are met, the deployment task creates the release annotation automatically:

- The resource to which you're deploying is linked to Application Insights via the `APPINSIGHTS_INSTRUMENTATIONKEY` app setting.
- The Application Insights resource is in the same subscription as the resource to which you're deploying.
- You're using one of the following Azure DevOps pipeline tasks:

    | Task code                 | Task name                     | Versions     |
    |---------------------------|-------------------------------|--------------|
    | AzureAppServiceSettings   | Azure App Service Settings    | Any          |
    | AzureRmWebAppDeployment   | Azure App Service deploy      | V3 and above |
    | AzureFunctionApp          | Azure Functions               | Any          |
    | AzureFunctionAppContainer | Azure Functions for container | Any          |
    | AzureWebAppContainer      | Azure Web App for Containers  | Any          |
    | AzureWebApp               | Azure Web App                 | Any          |

> [!NOTE]
> If you're still using the Application Insights annotation deployment task, you should delete it.

### Configure release annotations

If you can't use one of the deployment tasks in the previous section, you need to add an inline script task in your deployment pipeline.

1. Go to a new or existing pipeline and select a task.

    :::image type="content" source="./media/annotations/task.png" alt-text="Screenshot that shows a task selected under Stages." lightbox="./media/annotations/task.png":::
1. Add a new task and select **Azure CLI**.

    :::image type="content" source="./media/annotations/add-azure-cli.png" alt-text="Screenshot that shows adding a new task and selecting Azure CLI." lightbox="./media/annotations/add-azure-cli.png":::
1. Specify the relevant Azure subscription. Change **Script Type** to **PowerShell** and **Script Location** to **Inline**.
1. Add the [PowerShell script from step 2 in the next section](#create-release-annotations-with-the-azure-cli) to **Inline Script**.
1. Add the following arguments. Replace the angle-bracketed placeholders with your values to **Script Arguments**. The `-releaseProperties` are optional.

    ```powershell
        -aiResourceId "<aiResourceId>" `
        -releaseName "<releaseName>" `
        -releaseProperties @{"ReleaseDescription"="<a description>";
             "TriggerBy"="<Your name>" }
    ```

    :::image type="content" source="./media/annotations/inline-script.png" alt-text="Screenshot of Azure CLI task settings with Script Type, Script Location, Inline Script, and Script Arguments highlighted." lightbox="./media/annotations/inline-script.png":::

    The following example shows metadata you can set in the optional `releaseProperties` argument by using [build](/azure/devops/pipelines/build/variables#build-variables-devops-services) and [release](/azure/devops/pipelines/release/variables#default-variables---release) variables.

    ```powershell
    -releaseProperties @{
     "BuildNumber"="$(Build.BuildNumber)";
     "BuildRepositoryName"="$(Build.Repository.Name)";
     "BuildRepositoryProvider"="$(Build.Repository.Provider)";
     "ReleaseDefinitionName"="$(Build.DefinitionName)";
     "ReleaseDescription"="Triggered by $(Build.DefinitionName) $(Build.BuildNumber)";
     "ReleaseEnvironmentName"="$(Release.EnvironmentName)";
     "ReleaseId"="$(Release.ReleaseId)";
     "ReleaseName"="$(Release.ReleaseName)";
     "ReleaseRequestedFor"="$(Release.RequestedFor)";
     "ReleaseWebUrl"="$(Release.ReleaseWebUrl)";
     "SourceBranch"="$(Build.SourceBranch)";
     "TeamFoundationCollectionUri"="$(System.TeamFoundationCollectionUri)" }
    ```            

1. Select **Save**.

## Create release annotations with the Azure CLI

You can use the `CreateReleaseAnnotation` PowerShell script to create annotations from any process you want without using Azure DevOps.

1. Sign in to the [Azure CLI](/cli/azure/authenticate-azure-cli).

1. Make a local copy of the following script and call it `CreateReleaseAnnotation.ps1`.

    ```powershell
    param(
        [parameter(Mandatory = $true)][string]$aiResourceId,
        [parameter(Mandatory = $true)][string]$releaseName,
        [parameter(Mandatory = $false)]$releaseProperties = @()
    )
    
    $annotation = @{
        Id = [GUID]::NewGuid();
        AnnotationName = $releaseName;
        EventTime = (Get-Date).ToUniversalTime().GetDateTimeFormats("s")[0];
        Category = "Deployment"; #Application Insights only displays annotations from the "Deployment" Category
        Properties = ConvertTo-Json $releaseProperties -Compress
    }
    
    $body = (ConvertTo-Json $annotation -Compress) -replace '(\\+)"', '$1$1"' -replace "`"", "`"`""
    az rest --method put --uri "$($aiResourceId)/Annotations?api-version=2015-05-01" --body "$($body) "

    # Use the following command for Linux Azure DevOps Hosts or other PowerShell scenarios
    # Invoke-AzRestMethod -Path "$aiResourceId/Annotations?api-version=2015-05-01" -Method PUT -Payload $body
    ```

    > [!NOTE]
    > Your annotations must have **Category** set to **Deployment** to appear in the Azure portal.

1. Call the PowerShell script with the following code. Replace the angle-bracketed placeholders with your values. The `-releaseProperties` are optional.

    ```powershell
         .\CreateReleaseAnnotation.ps1 `
          -aiResourceId "<aiResourceId>" `
          -releaseName "<releaseName>" `
          -releaseProperties @{"ReleaseDescription"="<a description>";
              "TriggerBy"="<Your name>" }
    ```

    |Argument | Definition | Note|
    |--------------|-----------------------|--------------------|
    |`aiResourceId` | The resource ID to the target Application Insights resource. | Example:<br> /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyRGName/providers/microsoft.insights/components/MyResourceName|
    |`releaseName` | The name to give the created release annotation. | |
    |`releaseProperties` | Used to attach custom metadata to the annotation. | Optional|
    
## View annotations

> [!NOTE]
> Release annotations aren't currently available in the **Metrics** pane of Application Insights.

Whenever you use the release template to deploy a new release, an annotation is sent to Application Insights. You can view annotations in the following locations:

- **Performance:**

    :::image type="content" source="./media/annotations/performance.png" alt-text="Screenshot that shows the Performance tab with a release annotation selected to show the Release Properties tab." lightbox="./media/annotations/performance.png":::

- **Failures:**

    :::image type="content" source="./media/annotations/failures.png" alt-text="Screenshot that shows the Failures tab with a release annotation selected to show the Release Properties tab." lightbox="./media/annotations/failures.png":::
- **Usage:**

    :::image type="content" source="./media/annotations/usage-pane.png" alt-text="Screenshot that shows the Users tab bar with release annotations selected. Release annotations appear as blue arrows above the chart indicating the moment in time that a release occurred." lightbox="./media/annotations/usage-pane.png":::

- **Workbooks:**

    In any log-based workbook query where the visualization displays time along the x-axis:
    
    :::image type="content" source="./media/annotations/workbooks-annotations.png" alt-text="Screenshot that shows the Workbooks pane with a time series log-based query with annotations displayed." lightbox="./media/annotations/workbooks-annotations.png":::
    
To enable annotations in your workbook, go to **Advanced Settings** and select **Show annotations**.
    
:::image type="content" source="./media/annotations/workbook-show-annotations.png" alt-text="Screenshot that shows the Advanced Settings menu with the show annotations checkbox highlighted.":::

Select any annotation marker to open details about the release, including requestor, source control branch, release pipeline, and environment.

## Release annotations by using API keys

Release annotations are a feature of the cloud-based Azure Pipelines service of Azure DevOps.

> [!IMPORTANT]
> Annotations using API keys is deprecated. We recommend using the [Azure CLI](#create-release-annotations-with-the-azure-cli) instead.

### Install the annotations extension (one time)

To create release annotations, install one of the many Azure DevOps extensions available in Visual Studio Marketplace.

1. Sign in to your [Azure DevOps](https://azure.microsoft.com/services/devops/) project.

1. On the **Visual Studio Marketplace** [Release Annotations extension](https://marketplace.visualstudio.com/items/ms-appinsights.appinsightsreleaseannotations) page, select your Azure DevOps organization. Select **Install** to add the extension to your Azure DevOps organization.

   :::image type="content" source="./media/annotations/1-install.png" lightbox="./media/annotations/1-install.png" alt-text="Screenshot that shows selecting an Azure DevOps organization and selecting Install.":::

You only need to install the extension once for your Azure DevOps organization. You can now configure release annotations for any project in your organization.

### Configure release annotations by using API keys

Create a separate API key for each of your Azure Pipelines release templates.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Application Insights resource that monitors your application. Or if you don't have one, [create a new Application Insights resource](create-workspace-resource.md).

1. Open the **API Access** tab and copy the **Application Insights ID**.

   :::image type="content" source="./media/annotations/2-app-id.png" lightbox="./media/annotations/2-app-id.png" alt-text="Screenshot that shows under API Access, copying the Application ID.":::

1. In a separate browser window, open or create the release template that manages your Azure Pipelines deployments.

1. Select **Add task** and then select the **Application Insights Release Annotation** task from the menu.
   
   :::image type="content" source="./media/annotations/3-add-task.png" lightbox="./media/annotations/3-add-task.png" alt-text="Screenshot that shows selecting Add Task and Application Insights Release Annotation.":::

   > [!NOTE]
   > The Release Annotation task currently supports only Windows-based agents. It won't run on Linux, macOS, or other types of agents.

1. Under **Application ID**, paste the Application Insights ID you copied from the **API Access** tab.

   :::image type="content" source="./media/annotations/4-paste-app-id.png" lightbox="./media/annotations/4-paste-app-id.png" alt-text="Screenshot that shows pasting the Application Insights ID.":::

1. Back in the Application Insights **API Access** window, select **Create API Key**.

   :::image type="content" source="./media/annotations/5-create-api-key.png" lightbox="./media/annotations/5-create-api-key.png" alt-text="Screenshot that shows selecting the Create API Key on the API Access tab.":::

1. In the **Create API key** window, enter a description, select **Write annotations**, and then select **Generate key**. Copy the new key.

   :::image type="content" source="./media/annotations/6-create-api-key.png" lightbox="./media/annotations/6-create-api-key.png" alt-text="Screenshot that shows in the Create API key window, entering a description, selecting Write annotations, and then selecting the Generate key.":::

1. In the release template window, on the **Variables** tab, select **Add** to create a variable definition for the new API key.

1. Under **Name**, enter **ApiKey**. Under **Value**, paste the API key you copied from the **API Access** tab.

   :::image type="content" source="./media/annotations/7-paste-api-key.png" lightbox="./media/annotations/7-paste-api-key.png" alt-text="Screenshot that shows in the Azure DevOps Variables tab, selecting Add, naming the variable ApiKey, and pasting the API key under Value.":::

1. Select **Save** in the main release template window to save the template.

   > [!NOTE]
   > Limits for API keys are described in the [REST API rate limits documentation](/rest/api/yammer/rest-api-rate-limits).

### Transition to the new release annotation

To use the new release annotations:
1. [Remove the Release Annotations extension](/azure/devops/marketplace/uninstall-disable-extensions).
1. Remove the Application Insights Release Annotation task in your Azure Pipelines deployment.
1. Create new release annotations with [Azure Pipelines](#release-annotations-with-azure-pipelines-build) or the [Azure CLI](#create-release-annotations-with-the-azure-cli).

## Next steps

* [Create work items](./diagnostic-search.md#create-work-item)
* [Automation with PowerShell](./powershell.md)
