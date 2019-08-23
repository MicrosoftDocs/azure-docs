---
title: What are Power BI Workspace Collections?
description: Power BI Embedded enables you to integrate Power BI reports into your web or mobile applications so you don't need to build custom solutions.
services: power-bi-embedded
author: rkarlin
ROBOTS: NOINDEX
ms.assetid: 03649b72-b7d7-40ca-b077-12356d72d4f3
ms.service: power-bi-embedded
ms.topic: article
ms.workload: powerbi
ms.date: 09/20/2017
ms.author: rkarlin
---
# What are Power BI Workspace Collections?

With **Power BI Workspace Collections**, you can integrate Power BI reports right into your web or mobile applications.

![Application diagram](media/what-are-power-bi-workspace-collections/what-is.png)

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

Power BI Workspace Collections are an **Azure service** that enables ISVs and app developers to surface Power BI data experiences within their applications. As a developer, you've built applications, and those applications have their own users and distinct set of features. Those apps may also happen to have some built-in data elements like charts and reports that can now be powered by Microsoft Power BI Workspace Collections. You don’t need a Power BI account to use your app. You can continue to sign in to your application just like before, and view and interact with the Power BI reporting experience without requiring any additional licensing.

## Licensing for Microsoft Power BI Workspace Collections

In the **Microsoft Power BI Workspace Collections** usage model, licensing for Power BI is not the responsibility of the end user.  Instead, **sessions** are purchased by the developer of the app that is consuming the visuals, and are charged to the subscription that owns those resources. 

## Microsoft Power BI Workspace Collections conceptual model

![Application flow with workspace collections](media/what-are-power-bi-workspace-collections/model.png)

Like any other service in Azure, resources for Power BI Workspace Collections are provisioned through the [Azure Resource Manager APIs](https://msdn.microsoft.com/library/mt712306.aspx). In this case, the resource that is provision is a **Power BI Workspace Collection**.

## Workspace collection

A **Workspace Collection** is the top-level Azure container for resources that contains 0 or more **Workspaces**.  A **Workspace** **Collection** has all of the standard Azure properties, as well as the following:

* **Access Keys** – Keys used when securely calling the Power BI APIs (described in a later section).
* **Users** – Azure Active Directory (AAD) users that have administrator rights to manage the Power BI Workspace Collection through the Azure portal or Azure Resource Manager API.
* **Region** – As part of provisioning a **Workspace Collection**, you can select a region to be provisioned in. For more information, see [Azure Regions](https://azure.microsoft.com/regions/).

## Workspace

A **Workspace** is a container of Power BI content, which can include datasets and reports. A **Workspace** is empty when first created. You’ll author content using Power BI Desktop and you'll programmatically deploy the PBIX into your workspace using the [Power BI Import API](https://msdn.microsoft.com/library/mt711504.aspx). You can also programmatically create your dataset and then create reports within your application instead of using Power BI Desktop.

## Using workspace collections and workspaces

**Workspace Collections** and **Workspaces** are containers of content that are used and organized in whichever way best fits the design of the application you are building. There will be many different ways that you could arrange the content within them. You may choose to put all content within one workspace and then later use app tokens to further subdivide the content amongst your customers. You may also choose to put all of your customers in separate workspaces so that there is some separation between them. Or, you may choose to organize users by region rather than by customer. This flexible design allows you to choose the best way to organize content.

## Cached datasets

Cached datasets can be used.  However, you cannot refresh cached data once it has been loaded into **Microsoft Power BI Workspace Collections**. A cached dataset means you have imported the data into Power BI Desktop instead of using DirectQuery.

## Authentication and authorization with app tokens

**Microsoft Power BI Workspace Collections** defers to your application to perform all the necessary user authentication and authorization. There is no explicit requirement that your end users be customers of Azure Active Directory (Azure AD).  Instead, your application expresses to **Microsoft Power BI Workspace Collections** authorization to render a Power BI report by using **Application Authentication Tokens (App Tokens)**.  These **App Tokens** are created as needed when your app wants to render a report.

![App token usage diagram](media/what-are-power-bi-workspace-collections/app-tokens.png)

**Application Authentication Tokens (App Tokens)** are used to authenticate against **Microsoft Power BI Workspace Collections**.  There are three types of **App Tokens**:

1. Provisioning Tokens - Used when provisioning a new **Workspace** into a **Workspace Collection**
2. Development Tokens - Used when making calls directly to the **Power BI REST APIs**
3. Embedding Tokens - Used when making calls to render a report in the embedded iframe

These tokens are used for the various phases of your interactions with **Microsoft Power BI Workspace Collections**.  The tokens are designed so that you can delegate permissions from your app to Power BI. For more information, see [App Token Flow](app-token-flow.md).

## Create or edit reports within your application

You can now edit existing reports or create new reports directly in your application without having to use Power BI Desktop. This requires that a dataset exist within your workspace.

## See also

[Common Microsoft Power BI Workspace Collections scenarios](scenarios.md)  
[Get started with Microsoft Power BI Workspace Collections](get-started.md)  
[Get started with sample](get-started-sample.md)  
[Embed a report](embed-report.md)  
[Authenticating and authorizing in Power BI Workspace Collections](app-token-flow.md)  
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  
[PowerBI-CSharp Git Repo](https://github.com/Microsoft/PowerBI-CSharp)  
[PowerBI-Node Git Repo](https://github.com/Microsoft/PowerBI-Node)  

More questions? [Try the Power BI Community](https://community.powerbi.com/)
