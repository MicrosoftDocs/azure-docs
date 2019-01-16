---
title: Embed a report in Azure Power BI Workspace Collections | Microsoft Docs
description: Learn how to embed a report that is in Power BI Workspace Collections into your application.
services: power-bi-embedded
author: markingmyname
ROBOTS: NOINDEX
ms.assetid: 
ms.service: power-bi-embedded
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
ms.author: maghan
---
# Embed a report in Power BI Workspace Collections

Learn how to embed a report that is in Power BI Workspace Collections into your application.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

We will look at how to actually embed a report into your application. This is assuming you already have a report that exists within a workspace in your workspace collection. If you haven't done that step yet, see [Get started with Power BI Workspace Collections](get-started.md).

You can use the .NET (C#) or Node.js SDK, along with JavaScript, to easily build your application with Power BI Workspace Collections.

## Using the access keys to use REST APIs

In order to call the REST API, you can pass the access key which you can get from the Azure portal for a given workspace collection. For more information, see [Get started with Power BI Workspace Collections](get-started.md).

## Get a report ID

Every access token is based on a report. You will need to get the given report id for the report that you want to embed. This can be done based on calls to the [Get Reports](https://msdn.microsoft.com/library/azure/mt711510.aspx) REST API. This will return the report id and the embed url. This can be done using the Power BI .NET SDK or calling the REST API directly.

### Using the Power BI .NET SDK

When using the .NET SDK, you need to create a token credential that is based on the access key you get from the Azure portal. This requires that you install the [Power BI API NuGet package](https://www.nuget.org/profiles/powerbi).

**NuGet package install**

```
Install-Package Microsoft.PowerBI.Api
```

**C# code**

```
using Microsoft.PowerBI.Api.V1;
using Microsoft.Rest;

var credentials = new TokenCredentials("{access key}", "AppKey");
var client = new PowerBIClient(credentials);
client.BaseUri = new Uri(https://api.powerbi.com);

var reports = (IList<Report>)client.Reports.GetReports(workspaceCollectionName, workspaceId).Value;

// Select the report that you want to work with from the collection of reports.
```

### Calling the REST API directly

```
System.Net.WebRequest request = System.Net.WebRequest.Create("https://api.powerbi.com/v1.0/collections/{collectionName}/workspaces/{workspaceId}/Reports") as System.Net.HttpWebRequest;

request.Method = "GET";
request.ContentLength = 0;
request.Headers.Add("Authorization", String.Format("AppKey {0}", accessToken.Value));

using (var response = request.GetResponse() as System.Net.HttpWebResponse)
{
    using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
    {
        // Work with JSON response to get the report you want to work with.
    }

}
```

## Create an access token

Power BI Workspace Collections use embed tokens, which are HMAC signed JSON Web Tokens. The tokens are signed with the access key from your Power BI Workspace Collection. Embed tokens, by default, are used to provide read-only access to a report to embed into an application. Embed tokens are issued for a specific report and should be associated with an embed URL.

Access tokens should be created on the server as the access keys are used to sign/encrypt the tokens. For information on how to create an access token, see [Authenticating and authorizing with Power BI Workspace Collections](app-token-flow.md). You can also review the [CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_) method. Here is an example of what this would look like using the .NET SDK for Power BI.

You use the report ID that you retrieved earlier. Once the embed token is created, you will then use the access key to generate the token that you can use from the javascript perspective. The *PowerBIToken class* requires that you install the [Power BI Core NuGut Package](https://www.nuget.org/packages/Microsoft.PowerBI.Core/).

**NuGet package install**

```
Install-Package Microsoft.PowerBI.Core
```

**C# code**

```
using Microsoft.PowerBI.Security;

// rlsUsername, roles and scopes are optional.
embedToken = PowerBIToken.CreateReportEmbedToken(workspaceCollectionName, workspaceId, reportId, rlsUsername, roles, scopes);

var token = embedToken.Generate("{access key}");
```

### Adding permission scopes to embed tokens

When using Embed tokens, you may want to restrict usage of the resources you give access to. For this reason, you can generate a token with scoped permissions. For more information, see [Scopes](app-token-flow.md#scopes)

## Embed using JavaScript

After you have the access token and the report ID, we can embed the report using JavaScript. This requires that you install the NuGet [Power BI JavaScript package](https://www.nuget.org/packages/Microsoft.PowerBI.JavaScript/). The embedUrl will just be https://embedded.powerbi.com/appTokenReportEmbed.

> [!NOTE]
> You can use the [JavaScript Report Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/) to test functionality. It also gives code examples for the different operations that are available.

**NuGet package install**

```
Install-Package Microsoft.PowerBI.JavaScript
```

**JavaScript code**

```
<script src="/scripts/powerbi.js"></script>
<div id="reportContainer"></div>

var embedConfiguration = {
    type: 'report',
    accessToken: 'eyJ0eXAiO...Qron7qYpY9MI',
    id: '5dac7a4a-4452-46b3-99f6-a25915e0fe55',
    embedUrl: 'https://embedded.powerbi.com/appTokenReportEmbed'
};

var $reportContainer = $('#reportContainer');
var report = powerbi.embed($reportContainer.get(0), embedConfiguration);
```

### Set the size of embedded elements

The report will automatically be embedded based on the size of its container. To override the default size of the embedded item, simply add a CSS class attribute or inline styles for width and height.

## See also

[Get started with sample](get-started-sample.md)  
[Authenticating and authorizing in Power BI Workspace Collections](app-token-flow.md)  
[CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_)  
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  
[Power BI JavaScript package](https://www.nuget.org/packages/Microsoft.PowerBI.JavaScript/)  
[Power BI API NuGet package](https://www.nuget.org/profiles/powerbi)
[Power BI Core NuGut Package](https://www.nuget.org/packages/Microsoft.PowerBI.Core/)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)  
[PowerBI-Node Git Repo](https://github.com/Microsoft/PowerBI-Node)  

More questions? [Try the Power BI Community](http://community.powerbi.com/)
