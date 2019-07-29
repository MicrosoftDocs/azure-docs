---
title: Authenticating and authorizing with Power BI Workspace Collections | Microsoft Docs
description: Authenticating and authorizing with Power BI Workspace Collections.
services: power-bi-workspace-collections
author: rkarlin
ms.author: rkarlin
ms.service: power-bi-embedded
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
---

# Authenticating and authorizing with Power BI Workspace Collections

Power BI Workspace Collections use **Keys** and **App Tokens** for authentication and authorization, instead of explicit end-user authentication. In this model, your application manages authentication and authorization for your end users. When necessary, your app creates and sends the app tokens that tell our service to render the requested report. This design doesn't require your app to use Azure Active Directory for user authentication and authorization, although you still can.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

## Two ways to authenticate

**Key** -  You can use keys for all Power BI Workspace Collections REST API calls. The keys can be found in the **Microsoft Azure portal** by selecting **All settings** and then **Access keys**. Always treat your key as if it is a password. These keys have permissions to make any REST API call on a particular workspace collection.

To use a key on a REST call, add the following authorization header:

    Authorization: AppKey {your key}

**App token** - App tokens are used for all embedding requests. They’re designed to be run client-side.The token is restricted to a single report and its best practice to set an expiration time.

App tokens are a JWT (JSON Web Token) that is signed by one of your keys.

Your app token can contain the following claims:

| Claim | Description |    
| --- | --- |
| **ver** |The version of the app token. 0.2.0 is the current version. |
| **aud** |The intended recipient of the token. For Power BI Workspace Collections use: *https:\//analysis.windows.net/powerbi/api*. |
| **iss** |A string indicating the application that issued the token. |
| **type** |The type of app token that is being created. Current the only supported type is **embed**. |
| **wcn** |Workspace collection name the token is being issued for. |
| **wid** |Workspace ID the token is being issued for. |
| **rid** |Report ID the token is being issued for. |
| **username** (optional) |Used with RLS, username is a string that can help identify the user when applying RLS rules. |
| **roles** (optional) |A string containing the roles to select when applying Row Level Security rules. If passing more than one role, they should be passed as a sting array. |
| **scp** (optional) |A string containing the permissions scopes. If passing more than one role, they should be passed as a sting array. |
| **exp** (optional) |Indicates the time in which the token expires. The value should be passed in as Unix timestamps. |
| **nbf** (optional) |Indicates the time in which the token starts being valid. The value should be passed in as Unix timestamps. |

A sample app token looks like:

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOiIwLjIuMCIsInR5cGUiOiJlbWJlZCIsIndjbiI6Ikd1eUluQUN1YmUiLCJ3aWQiOiJkNGZlMWViMS0yNzEwLTRhNDctODQ3Yy0xNzZhOTU0NWRhZDgiLCJyaWQiOiIyNWMwZDQwYi1kZTY1LTQxZDItOTMyYy0wZjE2ODc2ZTNiOWQiLCJzY3AiOiJSZXBvcnQuUmVhZCIsImlzcyI6IlBvd2VyQklTREsiLCJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiZXhwIjoxNDg4NTAyNDM2LCJuYmYiOjE0ODg0OTg4MzZ9.v1znUaXMrD1AdMz6YjywhJQGY7MWjdCR3SmUSwWwIiI
```

When decoded, it looks something like:

```
Header

{
    typ: "JWT",
    alg: "HS256:
}

Body

{
  "ver": "0.2.0",
  "wcn": "SupportDemo",
  "wid": "ca675b19-6c3c-4003-8808-1c7ddc6bd809",
  "rid": "96241f0f-abae-4ea9-a065-93b428eddb17",
  "iss": "PowerBISDK",
  "aud": "https://analysis.windows.net/powerbi/api",
  "exp": 1360047056,
  "nbf": 1360043456
}

```

There are methods available within the SDKs that make creation of app tokens easier. For example, for .NET you can look at the [Microsoft.PowerBI.Security.PowerBIToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken) class and the [CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN) methods.

For the .NET SDK, you can refer to [Scopes](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.scopes).

## Scopes

When using Embed tokens, you may want to restrict usage of the resources you give access to. For this reason, you can generate a token with scoped permissions.

The following are the available scopes for Power BI Workspace Collections.

|Scope|Description|
|---|---|
|Dataset.Read|Provides permission to read the specified dataset.|
|Dataset.Write|Provides permission to write to the specified dataset.|
|Dataset.ReadWrite|Provides permission to read and write to the specified dataset.|
|Report.Read|Provides permission to view the specified report.|
|Report.ReadWrite|Provides permission to view and edit the specified report.|
|Workspace.Report.Create|Provides permission to create a new report within the specified workspace.|
|Workspace.Report.Copy|Provides permission to clone an existing report within the specified workspace.|

You can supply multiple scopes by using a space between the scopes like the following.

```csharp
string scopes = "Dataset.Read Workspace.Report.Create";
```

**Required claims - scopes**

scp: {scopesClaim} scopesClaim can be either a string or array of strings, noting the allowed permissions to workspace resources (Report, Dataset, etc.)

A decoded token, with scopes defined, would look similar to:

```
Header

{
    typ: "JWT",
    alg: "HS256:
}

Body

{
  "ver": "0.2.0",
  "wcn": "SupportDemo",
  "wid": "ca675b19-6c3c-4003-8808-1c7ddc6bd809",
  "rid": "96241f0f-abae-4ea9-a065-93b428eddb17",
  "scp": "Report.Read",
  "iss": "PowerBISDK",
  "aud": "https://analysis.windows.net/powerbi/api",
  "exp": 1360047056,
  "nbf": 1360043456
}

```

### Operations and scopes

|Operation|Target resource|Token permissions|
|---|---|---|
|Create (in-memory) a new report based on a dataset.|Dataset|Dataset.Read|
|Create (in-memory) a new report based on a dataset and save the report.|Dataset|* Dataset.Read<br>* Workspace.Report.Create|
|View and explore/edit (in-memory) an existing report. Report.Read implies Dataset.Read. Report.Read does not allow saving of edits.|Report|Report.Read|
|Edit and save an existing report.|Report|Report.ReadWrite|
|Save a copy of a report (Save As).|Report|* Report.Read<br>* Workspace.Report.Copy|

## Here's how the flow works
1. Copy the API keys to your application. You can get the keys in **Azure portal**.
   
    ![Where to find the API keys in the Azure portal](media/get-started-sample/azure-portal.png)
1. Token asserts a claim and has an expiration time.
   
    ![App token flow - token asserts claim](media/get-started-sample/token-2.png)
1. Token gets signed with an API access keys.
   
    ![App token flow - token gets signed](media/get-started-sample/token-3.png)
1. User requests to view a report.
   
    ![App token flow - user requests to view a report](media/get-started-sample/token-4.png)
1. Token is validated with an API access keys.
   
   ![App token flow - token is validated](media/get-started-sample/token-5.png)
1. Power BI Workspace Collections sends a report to user.
   
   ![App token flow - service send report to user](media/get-started-sample/token-6.png)

After **Power BI Workspace Collections** sends a report to the user, the user can view the report in your custom app. For example, if you imported the [Analyzing Sales Data PBIX sample](https://download.microsoft.com/download/1/4/E/14EDED28-6C58-4055-A65C-23B4DA81C4DE/Analyzing_Sales_Data.pbix), the sample web app would look like:

![Sample of report embedded in application](media/get-started-sample/sample-web-app.png)

## See Also

[CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN)  
[Get started with Microsoft Power BI Workspace Collections sample](get-started-sample.md)  
[Common Microsoft Power BI Workspace Collections scenarios](scenarios.md)  
[Get started with Microsoft Power BI Workspace Collections](get-started.md)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)

More questions? [Try the Power BI Community](https://community.powerbi.com/)
