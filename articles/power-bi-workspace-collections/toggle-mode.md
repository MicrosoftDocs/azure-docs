---
title: Toggle between view and edit mode for reports in Power BI Workspace Collections | Microsoft Docs
description: Learn how to toggle between view and edit mode for your reports within Power BI Workspace Collections.
services: power-bi-embedded
author: markingmyname
ROBOTS: NOINDEX
ms.service: power-bi-embedded
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
ms.author: maghan
---
# Toggle between view and edit mode for reports in Power BI Workspace Collections

Learn how to toggle between view and edit mode for your reports within Power BI Workspace Collections.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

## Creating an access token

You need to create an access token that gives you the ability to both view and edit a report. To edit and save a report, you need the **Report.ReadWrite** token permission. For more information, see [Authenticating and authorizing in Power BI Workspace Collections](app-token-flow.md).

> [!NOTE]
> This allows you to edit and save changes to an existing report. If you would also like the function of supporting **Save As**, you need to supply additional permissions. For more information, see [Scopes](app-token-flow.md#scopes).

```
using Microsoft.PowerBI.Security;

// rlsUsername and roles are optional
string scopes = "Report.ReadWrite";
PowerBIToken embedToken = PowerBIToken.CreateReportEmbedTokenForCreation(workspaceCollectionName, workspaceId, datasetId, null, null, scopes);

var token = embedToken.Generate("{access key}");
```

## Embed configuration

You need to supply permissions and a viewMode in order to see the save button when in edit mode. For more information, see [Embed configuration details](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details).

For example, in JavaScript:

```
   <div id="reportContainer"></div>

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
        permissions: models.Permissions.ReadWrite /*both save & save as buttons will be visible*/,
        viewMode: models.ViewMode.View,
        settings: {
            filterPaneEnabled: true,
            navContentPaneEnabled: true
        }
    };

    // Get a reference to the embedded report HTML element
    var reportContainer = $('#reportContainer')[0];

    // Embed the report and display it within the div container.
    var report = powerbi.embed(reportContainer, config);
```

This indicates to embed the report in view mode based on **viewMode** being set to **models.ViewMode.View**.

## View mode

You can use the following JavaScript to switch into view mode, if you are in edit mode.

```
// Get a reference to the embedded report HTML element
var reportContainer = $('#reportContainer')[0];

// Get a reference to the embedded report.
report = powerbi.get(reportContainer);

// Switch to view mode.
report.switchMode("view");

```

## Edit mode

You can use the following JavaScript to switch into edit mode, if you are in view mode.

```
// Get a reference to the embedded report HTML element
var reportContainer = $('#reportContainer')[0];

// Get a reference to the embedded report.
report = powerbi.get(reportContainer);

// Switch to edit mode.
report.switchMode("edit");

```

## See also

[Get started with sample](get-started-sample.md)  
[Embed a report](embed-report.md)  
[Authenticating and authorizing in Power BI Workspace Collections](app-token-flow.md)  
[CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_)  
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)  
[PowerBI-Node Git Repo](https://github.com/Microsoft/PowerBI-Node)  

More questions? [Try the Power BI Community](http://community.powerbi.com/)
