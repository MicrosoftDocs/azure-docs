<properties
   pageTitle="What is Microsoft Power BI Embedded?"
   description="Power BI Embedded enables you to integrate Power BI reports into your web or mobile applications so you don't need to build custom solutions to visualize data for your users"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="mblythe"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/05/2016"
   ms.author="owend"/>

# What is Microsoft Power BI Embedded?

With **Power BI Embedded**, you can integrate Power BI reports right into your web or mobile applications.

![](media\powerbi-embedded-whats-is\what-is.png)

Power BI Embedded is an **Azure service** that enables ISVs and app developers to surface Power BI data experiences within their applications. As a developer, you've built applications, and those applications have their own users and distinct set of features. Those apps may also happen to have some built-in data elements like charts and reports that can now be powered by Microsoft Power BI Embedded. Users don’t need a Power BI account to use your app. They can continue to sign in to your application just like before,  and view and interact with the Power BI reporting experience without requiring any additional licensing.

## Licensing for Microsoft Power BI Embedded

In the **Microsoft Power BI Embedded** usage model, licensing for Power BI is not the responsibility of the end-user.  Instead, **renders** are purchased by the developer of the app that is consuming the visuals, and are charged to the subscription that owns those resources.

## Microsoft Power BI Embedded Conceptual Model

![](media\powerbi-embedded-whats-is\model.png)

Like any other service in Azure, resources for Power BI Embedded are provisioned through the [Azure ARM APIs](https://msdn.microsoft.com/library/mt712306.aspx). In this case, the resource that you provision is a **Power BI Workspace Collection**.

## Workspace Collection

A **Workspace Collection** is the top-level Azure container for resources that contains 0 or more **Workspaces**.  A **Workspace** **Collection** has all of the standard Azure properties, as well as the following:

-	**Access Keys** – Keys used when securely calling the Power BI APIs (described in a later section).
-	**Users** – Azure Active Directory (AAD) users that have administrator rights to manage the Power BI Workspace Collection through the Azure portal or ARM API.
-	**Region** – As part of provisioning a **Workspace Collection**, you can select a region to be provisioned in. For more information, see [Azure Regions](https://azure.microsoft.com/regions/).

## Workspace

A **Workspace** is a container of Power BI content, which can include datasets, reports and dashboards. A **Workspace** is empty when first created. During Preview, you’ll author all content using Power BI Desktop and you'll upload it to one of your workspaces using the [Power BI REST APIs](http://docs.powerbi.apiary.io/reference).

## Using Workspace Collections and Workspaces
**Workspace Collections** and **Workspaces** are containers of content that are used and organized in whichever way best fits the design of the application you are building. There will be many different ways that you could arrange the content within them. You may choose to put all content within one workspace and then later use app tokens to further subdivide the content amongst your customers. You may also choose to put all of your customers in separate workspaces so that there is some separation between them. Or, you may choose to organize users by region rather than by customer. This flexible design allows you to choose the best way to organize content.

## Cached Datasets

Cached datasets can be used in Preview.  However, you cannot refresh cached data once it has been loaded into **Microsoft Power BI Embedded**.

## Authentication and authorization with app tokens

**Microsoft Power BI Embedded** defers to your application to perform all the necessary user authentication and authorization. There is no explicit requirement that your end-users be customers of Azure Active Directory (Azure AD).  Instead, your application will express authorization to render a Power BI report to the **Microsoft Power BI Embedded** via **Application Authentication Tokens (App Tokens)**.  These **App Tokens** are created as needed when your app wants to render a report.  See [App Tokens](power-bi-embedded-get-started-sample.md#key-flow).

![](media\powerbi-embedded-whats-is\app-tokens.png)

### Application Authentication Tokens

**Application Authentication Tokens (App Tokens)** are used to authenticate against **Microsoft Power BI Embedded**.  There are three types of **App Tokens**:

1.	Provisioning Tokens - Used when provisioning a new **Workspace** into a **Workspace Collection**
2.	Development Tokens - Used when making calls directly to the **Power BI REST APIs**
3.	Embedding Tokens - Used when making calls to render a report in the embedded iframe

These tokens are used for the various phases of your interactions with **Microsoft Power BI Embedded**.  The tokens are designed so that you can delegate permissions from your app to Power BI.

### Generating App Tokens

The SDKs provided for the Preview let you generate tokens. First, call one of the Create___Token() methods. Second, call the Generate() method with the access key retrieved from the **Workspace Collection**. The basic Create methods for tokens are defined in the Microsoft.PowerBI.Security.PowerBIToken class, and are as follows:

-	[CreateProvisionToken](https://msdn.microsoft.com/library/mt670218.aspx)
-	[CreateDevToken](https://msdn.microsoft.com/library/mt670215.aspx)
-	[CreateReportEmbedToken]( https://msdn.microsoft.com/library/mt710366.aspx)

For an example of how to use [CreateProvisionToken](https://msdn.microsoft.com/library/mt670218.aspx) and [CreateDevToken](https://msdn.microsoft.com/library/mt670215.aspx), see [Get started with Microsoft Power BI Embedded sample code](power-bi-embedded-get-started-sample.md).


## See Also
- [Common Microsoft Power BI Embedded scenarios](power-bi-embedded-scenarios.md)
- [Get started with Microsoft Power BI Embedded](power-bi-embedded-get-started.md)
