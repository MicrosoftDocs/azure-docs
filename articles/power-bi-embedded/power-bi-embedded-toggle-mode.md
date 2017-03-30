---
title: Toggle between view and edit mode for reports in Azure Power BI Embedded | Microsoft Docs
description: Learn how to toggle between view and edit mode for your reports within Power BI Embedded.
services: power-bi-embedded
documentationcenter: ''
author: guyinacube
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: power-bi-embedded
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: powerbi
ms.date: 03/11/2017
ms.author: asaxton
---
# Toggle between view and edit mode for reports in Power BI Embedded

Learn how to toggle between view and edit mode for your reports within Power BI Embedded.

## Creating an access token

You will need to create an access token that gives you the ability to both view and edit a report. To edit and save a report, you will need the **Report.ReadWrite** token permission. For more information, see [Authenticating and authorizing in Power BI Embedded](power-bi-embedded-app-token-flow.md).

> [!NOTE]
> This will allow you to edit and save changes to an existing report. If you would also like the function of supporting **Save As**, you will need to supply additional permissions. For more information, see [Scopes](power-bi-embedded-app-token-flow.md#scopes).

```
using Microsoft.PowerBI.Security;

// rlsUsername and roles are optional
string scopes = "Report.ReadWrite";
PowerBIToken embedToken = PowerBIToken.CreateReportEmbedTokenForCreation(workspaceCollectionName, workspaceId, datasetId, null, null, scopes);

var token = embedToken.Generate("{access key}");
```

## Embed configuration

You will need to supply permissions and a viewMode in order to see the save button when in edit mode. For more information, see [Embed configuration details](https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details).

For example in JavaScript:

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

This will indicate to embed the report in view mode based on **viewMode** being set to **models.ViewMode.View**.

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

[Get started with sample](power-bi-embedded-get-started-sample.md)  
[Embed a report](power-bi-embedded-embed-report.md)  
[Authenticating and authorizing in Power BI Embedded](power-bi-embedded-app-token-flow.md)  
[CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_)  
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)  
[PowerBI-Node Git Repo](https://github.com/Microsoft/PowerBI-Node)  
More questions? [Try the Power BI Community](http://community.powerbi.com/)
