---
title: Release annotations for Application Insights | Microsoft Docs
description: Learn how to create annotations to track deployment or other significant events with Application Insights.
ms.topic: conceptual
ms.date: 05/27/2021

---

# Release annotations for Application Insights

Annotations show where you deployed a new build, or other significant events. Annotations make it easy to see whether your changes had any effect on your application's performance. They can be automatically created by the [Azure Pipelines](/azure/devops/pipelines/tasks/) build system. You can also create annotations to flag any event you like by creating them from PowerShell.

## Release annotations with Azure Pipelines build

Release annotations are a feature of the cloud-based Azure Pipelines service of Azure DevOps.

If your subscription has an Application Insights resource linked to it and you use one of the following deployment tasks, then you don't need to configure anything else.

| Task code                 | Task name                     | Versions     |
|---------------------------|-------------------------------|--------------|
| AzureAppServiceSettings   | Azure App Service Settings    | Any          |
| AzureRmWebAppDeployment   | Azure App Service deploy      | V3 and above |
| AzureFunctionApp          | Azure Functions               | Any          |
| AzureFunctionAppContainer | Azure Functions for container | Any          |
| AzureWebAppContainer      | Azure Web App for Containers  | Any          |
| AzureWebApp               | Azure Web App                 | Any          |

> [!NOTE]
> If you’re still using the Application Insights annotation deployment task, you should delete it.

### Configure release annotations

If you can't use one the deployment tasks in the pervious section, then you need to add an inline script task in your deployment pipeline.

1. Navigate to a new or existing pipeline and select a task.
    :::image type="content" source="./media/annotations/task.png" alt-text="Screenshot of task in stages selected." lightbox="./media/annotations/task.png":::
1. Add a new task and select **Azure CLI**.
    :::image type="content" source="./media/annotations/add-azure-cli.png" alt-text="Screenshot of adding a new task and selecting Azure CLI." lightbox="./media/annotations/add-azure-cli.png":::
1. Specify the relevant Azure subscription.  Change the **Script Type** to *PowerShell* and **Script Location** to *Inline*.
1. Add the [PowerShell script from step 2 in the next section](#create-release-annotations-with-azure-cli) to **Inline Script**.
1. Add the arguments below, replacing the angle-bracketed placeholders with your values to **Script Arguments**. The -releaseProperties are optional.

    ```powershell
        -aiResourceId "<aiResourceId>" `
        -releaseName "<releaseName>" `
        -releaseProperties @{"ReleaseDescription"="<a description>";
             "TriggerBy"="<Your name>" }
    ```

    :::image type="content" source="./media/annotations/inline-script.png" alt-text="Screenshot of Azure CLI task settings with Script Type, Script Location, Inline Script, and Script Arguments highlighted." lightbox="./media/annotations/inline-script.png":::

1. Save.

## Create release annotations with Azure CLI

You can use the CreateReleaseAnnotation PowerShell script to create annotations from any process you like, without using Azure DevOps.

1. Sign into [Azure CLI](/cli/azure/authenticate-azure-cli).

2. Make a local copy of the script below and call it CreateReleaseAnnotation.ps1.

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
    
        Category = "Deployment"; 
    
        Properties = ConvertTo-Json $releaseProperties -Compress 
    
    } 
    
    $body = (ConvertTo-Json $annotation -Compress) -replace '(\\+)"', '$1$1"' -replace "`"", "`"`"" 
    
    az rest --method put --uri "$($aiResourceId)/Annotations?api-version=2015-05-01" --body "$($body) " 
    ```

3. Call the PowerShell script with the following code, replacing the angle-bracketed placeholders with your values. The -releaseProperties are optional.

    ```powershell
         .\CreateReleaseAnnotation.ps1 `
          -aiResourceId "<aiResourceId>" `
          -releaseName "<releaseName>" `
          -releaseProperties @{"ReleaseDescription"="<a description>";
              "TriggerBy"="<Your name>" }
    ```

|Argument | Definition | Note|
|--------------|-----------------------|--------------------|
|aiResourceId | The Resource ID to the target Application Insights resource. | Example:<br> /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyRGName/providers/microsoft.insights/components/MyResourceName|
|releaseName | The name to give the created release annotation. | | 
|releaseProperties | Used to attach custom metadata to the annotation. | Optional|

## View annotations

> [!NOTE]
> Release annotations are not currently available in the Metrics pane of Application Insights

Now, whenever you use the release template to deploy a new release, an annotation is sent to Application Insights. The annotations can be viewed in the following locations:

- Performance

    :::image type="content" source="./media/annotations/performance.png" alt-text="Screenshot of the Performance tab with a release annotation selected(blue arrow) to show the Release Properties tab." lightbox="./media/annotations/performance.png":::

- Failures

    :::image type="content" source="./media/annotations/failures.png" alt-text="Screenshot of the Failures tab with a release annotation (blue arrow) selected to show the Release Properties tab." lightbox="./media/annotations/failures.png":::
- Usage

    :::image type="content" source="./media/annotations/usage-pane.png" alt-text="Screenshot of the Users tab bar with release annotations selected. Release annotations appear as blue arrows above the chart indicating the moment in time that a release occurred." lightbox="./media/annotations/usage-pane.png":::

- Workbooks

    In any log-based workbook query where the visualization displays time along the x-axis.
    
    :::image type="content" source="./media/annotations/workbooks-annotations.png" alt-text="Screenshot of workbooks pane with time series log-based query with annotations displayed." lightbox="./media/annotations/workbooks-annotations.png":::
    
    To enable annotations in your workbook, go to **Advanced Settings** and select **Show annotations**.
    
    :::image type="content" source="./media/annotations/workbook-show-annotations.png" alt-text="Screenshot of Advanced Settings menu with the show annotations checkbox highlighted.":::

Select any annotation marker to open details about the release, including requestor, source control branch, release pipeline, and environment.

## Next steps

* [Create work items](./diagnostic-search.md#create-work-item)
* [Automation with PowerShell](./powershell.md)
