---
title: Save reports in Power BI Workspace Collections | Microsoft Docs
description: Learn how to save reports within Power BI Workspace Collections. This requires proper permissions in order to work successfully.
services: power-bi-workspace-collections
ms.service: power-bi-embedded
author: rkarlin
ms.author: rkarlin
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
---

# Save reports in Power BI Workspace Collections

Learn how to save reports within Power BI Workspace Collections. Saving reports requires proper permissions in order to work successfully.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

Within Power BI Workspace Collections, you can edit existing reports and save them. You can also create a new report and save as a new report to create one.

In order to save a report, you first need to create a token for the specific report with the right scopes:

* To enable save Report.ReadWrite scope is required
* To enable save as, Report.Read and Workspace.Report.Copy scopes are required
* To enable save and save as, Report.ReadWrite and Workspace.Report.Copy are required

Respectively in order to enable the right save/save as buttons in file menu you need to provide the right permission in the Embed configuration when you embed the report:

* models.Permissions.ReadWrite
* models.Permissions.Copy
* models.Permissions.All

> [!NOTE]
> Your access token also needs the appropriate scopes. For more information, see [Scopes](app-token-flow.md#scopes).

## Embed report in edit mode

Let's say you want to Embed a report in edit mode inside your app, to do so just pass the right properties in Embed configuration and call powerbi.embed(). Supply permissions and a viewMode in order to see the save and save as buttons when in edit mode. For more information, see [Embed configuration details](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details).

For example, in JavaScript:

```html
   <div id="reportContainer"></div>

    <script>
    // Get models. Models, it contains enums that can be used.
    var models = window['powerbi-client'].models;

    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    var config= {
        type: 'report',
        accessToken: 'eyJ0eXAiO...Qron7qYpY9MI',
        embedUrl: 'https://embedded.powerbi.com/appTokenReportEmbed',
        id:  '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
        permissions: models.Permissions.All /*both save & save as buttons will be visible*/,
        viewMode: models.ViewMode.Edit,
        settings: {
            filterPaneEnabled: true,
            navContentPaneEnabled: true
        }
    };

    // Get a reference to the embedded report HTML element
    var reportContainer = $('#reportContainer')[0];

    // Embed the report and display it within the div container.
    var report = powerbi.embed(reportContainer, config);
    </script>
```

Now a report is embedded in your app in edit mode.

## Save report

After Embedding the report in edit mode with the right token and permissions, you can save the report from the file menu or from javascript:

```javascript
 // Get a reference to the embedded report.
    report = powerbi.get(reportContainer);

 // Save report
    report.save();
```

## Save as

```javascript
// Get a reference to the embedded report.
    report = powerbi.get(reportContainer);
    
    var saveAsParameters = {
        name: "newReport"
    };

    // SaveAs report
    report.saveAs(saveAsParameters);
```

> [!IMPORTANT]
> Only after *save as* is a new report created. After the save, the canvas is still showing the old report in edit mode and not the new report. Embed the new report that was created. Embedding the new report requires a new access token as they are created per report.

You will then need to load the new report after a *save as*. Loading the new report is similar to embedding any report.

```html
<div id="reportContainer"></div>
<script>
var embedConfiguration = {
        accessToken: 'eyJ0eXAiO...Qron7qYpY9MJ',
        embedUrl: 'https://embedded.powerbi.com/appTokenReportEmbed',
        reportId: '5dac7a4a-4452-46b3-99f6-a25915e0fe54',
    };
    
    // Grab the reference to the div HTML element that will host the report
    var reportContainer = $('#reportContainer')[0];

    // Embed report
    var report = powerbi.embed(reportContainer, embedConfiguration);
</script>
```

## See also

[Get started with sample](get-started-sample.md)  
[Embed a report](embed-report.md)  
[Create a new report from a dataset](create-report-from-dataset.md)  
[Authenticating and authorizing in Power BI Workspace Collections](app-token-flow.md)  
[Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/)  
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  

More questions? [Try the Power BI Community](https://community.powerbi.com/)

