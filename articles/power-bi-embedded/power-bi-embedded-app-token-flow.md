---
title: Authenticating and authorizing with Power BI Embedded
description: Authenticating and authorizing with Power BI Embedded
services: power-bi-embedded
documentationcenter: ''
author: guyinacube
manager: erikre
editor: ''
tags: ''

ms.assetid: 1c1369ea-7dfd-4b6e-978b-8f78908fd6f6
ms.service: power-bi-embedded
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: powerbi
ms.date: 03/11/2017
ms.author: asaxton

---
# Authenticating and authorizing with Power BI Embedded

The Power BI Embedded service uses **Keys** and **App Tokens** for authentication and authorization, instead of explicit end-user authentication. In this model, your application manages authentication and authorization for your end-users. When necessary, your app creates and sends the App Tokens that tells our service to render the requested report. This design doesn't require your app to use Azure Active Directory for user authentication and authorization, although you still can.

## Two ways to authenticate

**Key** -  You can use keys for all Power BI Embedded REST API calls. The keys can be found in the **Azure portal** by clicking on **All settings** and then **Access keys**. Always treat your key as if it were a password. These keys have permissions to make any REST API call on a particular workspace collection.

To use a key on a REST call, add the following authorization header:            

    Authorization: AppKey {your key}

**App token** - App tokens are used for all embedding requests. They’re designed to be run client-side, so they're restricted to a single report and it’s best practice to set an expiration time.

App tokens are a JWT (JSON Web Token) that is signed by one of your keys.

Your app token can contain the following claims:

| Claim | Description |
| --- | --- |
| **ver** |The version of the app token. 0.2.0 is the current version. |
| **aud** |The intended recipient of the token. For Power BI Embedded use: “https://analysis.windows.net/powerbi/api”. |
| **iss** |A string indicating the application which issued the token. |
| **type** |The type of app token which is being created. Current the only supported type is **embed**. |
| **wcn** |Workspace collection name the token is being issued for. |
| **wid** |Workspace ID the token is being issued for. |
| **rid** |Report ID the token is being issued for. |
| **username** (optional) |Used with RLS, this is a string that can help identify the user when applying RLS rules. |
| **roles** (optional) |A string containing the roles to select when applying Row Level Security rules. If passing more than one role, they should be passed as a sting array. |
| **scp** (optional) |A string containing the permissions scopes. If passing more than one role, they should be passed as a sting array. |
| **exp** (optional) |Indicates the time in which the token will expire. These should be passed in as Unix timestamps. |
| **nbf** (optional) |Indicates the time in which the token starts being valid. These should be passed in as Unix timestamps. |

A sample app token will look like this:

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOiIwLjIuMCIsInR5cGUiOiJlbWJlZCIsIndjbiI6Ikd1eUluQUN1YmUiLCJ3aWQiOiJkNGZlMWViMS0yNzEwLTRhNDctODQ3Yy0xNzZhOTU0NWRhZDgiLCJyaWQiOiIyNWMwZDQwYi1kZTY1LTQxZDItOTMyYy0wZjE2ODc2ZTNiOWQiLCJzY3AiOiJSZXBvcnQuUmVhZCIsImlzcyI6IlBvd2VyQklTREsiLCJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiZXhwIjoxNDg4NTAyNDM2LCJuYmYiOjE0ODg0OTg4MzZ9.v1znUaXMrD1AdMz6YjywhJQGY7MWjdCR3SmUSwWwIiI
```

When decoded, it will look something like this:

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

There are methods available within the SDKs that make creation of apptokens easier. For example, for .NET you can look at the [Microsoft.PowerBI.Security.PowerBIToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken) class and the [CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_) methods.

For the .NET SDK, you can refer to [Scopes](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.scopes).

## Scopes

When using Embed tokens, you may want to restrict usage of the resources you give access to. For this reason, you can generate a token with scoped permissions.

The following are the available scopes for Power BI Embedded.

|Scope|Description|
|---|---|
|Dataset.Read|Provides permission to read the specified dataset.|
|Dataset.Write|Provides permission to write to the specified dataset.|
|Dataset.ReadWrite|Provides permission to read and write to the specificed dataset.|
|Report.Read|Provides permission to view the specified report.|
|Report.ReadWrite|Provides permission to view and edit the specified report.|
|Workspace.Report.Create|Provides permission to create a new report within the specified workspace.|
|Workspace.Report.Copy|Provides permission to clone an existing report within the specified workspace.|

You can supply multiple scopes by using a space between the scopes like the following.

```
string scopes = "Dataset.Read Workspace.Report.Create";
```

**Required claims - scopes**

scp: {scopesClaim} scopesClaim can be either a string or array of strings, noting the allowed permissions to workspace resources (Report, Dataset, etc.)

A decoded token, with scopes defined, would look similar to the following.

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
|View and explore/edit (in-memory) an existing report. Report.Read implies Dataset.Read. This will not allow permissions to save edits.|Report|Report.Read|
|Edit and save an existing report.|Report|Report.ReadWrite|
|Save a copy of a report (Save As).|Report|* Report.Read<br>* Workspace.Report.Copy|

## Here's how the flow works
1. Copy the API keys to your application. You can get the keys in **Azure Portal**.
   
    ![](media/powerbi-embedded-get-started-sample/azure-portal.png)
2. Token asserts a claim and has an expiration time.
   
    ![](media/powerbi-embedded-get-started-sample/power-bi-embedded-token-2.png)
3. Token gets signed with an API access keys.
   
    ![](media/powerbi-embedded-get-started-sample/power-bi-embedded-token-3.png)
4. User requests to view a report.
   
    ![](media/powerbi-embedded-get-started-sample/power-bi-embedded-token-4.png)
5. Token is validated with an API access keys.
   
   ![](media/powerbi-embedded-get-started-sample/power-bi-embedded-token-5.png)
6. Power BI Embedded sends a report to user.
   
   ![](media/powerbi-embedded-get-started-sample/power-bi-embedded-token-6.png)

After **Power BI Embedded** sends a report to the user, the user can view the report in your custom app. For example, if you imported the [Analyzing Sales Data PBIX sample](http://download.microsoft.com/download/1/4/E/14EDED28-6C58-4055-A65C-23B4DA81C4DE/Analyzing_Sales_Data.pbix), the sample web app would look like this:

![](media/powerbi-embedded-get-started-sample/sample-web-app.png)

## See Also

[CreateReportEmbedToken](https://docs.microsoft.com/dotnet/api/microsoft.powerbi.security.powerbitoken?redirectedfrom=MSDN#methods_)  
[Get started with Microsoft Power BI Embedded sample](power-bi-embedded-get-started-sample.md)  
[Common Microsoft Power BI Embedded scenarios](power-bi-embedded-scenarios.md)  
[Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)  
More questions? [Try the Power BI Community](http://community.powerbi.com/)

