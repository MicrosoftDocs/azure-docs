<properties
   pageTitle="What is Microsoft Power BI Embedded"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi-embedded"
   ms.date="03/08/2016"
   ms.author="jocaplan"/>


# What is Microsoft Power BI Embedded

**Microsoft Power BI Embedded** enables you to integrate Power BI reports into your web or mobile applications so you don’t need to build custom solutions to visualize data for your users.

![](media\powerbi-embedded-whats-is\what-is.png)

**Microsoft Power BI Embedded** is an Azure service that will enable ISVs to surface Power BI data experiences within their applications. As an ISV you have built applications. These applications have their own users and distinct set of features. These apps may also happen to have some built in data elements like charts and reports that will be powered by **Microsoft Power BI Embedded**. Users of the application do not need a Power BI account to using your app. They can continue to sign into your application as they had before, and view and interact with the Power BI reporting and tile experience without requiring any additional licensing.

## Licensing for Microsoft Power BI Embedded

In the **Microsoft Power BI Embedded** usage model, licensing for Power BI is not the responsibility of the end-user.  Instead, **renders** are purchased by the developer of the app that is consuming the visuals, and are charged to the subscription which owns those resources.

## Microsoft Power BI Embedded Conceptual Model

![](media\powerbi-embedded-whats-is\model.png)

As mentioned earlier, **Microsoft Power BI Embedded** is an Azure service.  Like any other service in Azure, resources can be provisioned through the Azure ARM APIs.  The resources that can be provisioned in this case is a **Power BI Workspace Collection**.
## Workspace Collection

A **Workspace Collection** is the top level Azure container for resources which contains 0 or more **Workspaces**.  A **Workspace** has all of the standard Azure properties , as well as the following:
-	**API Keys** – Keys used when securely calling the Power BI APIs (described in a later section)
-	**Users** – Azure Active Directory (AAD) users that have administrator rights to manage the Power BI Workspace Collection through the Azure portal or ARM API.
-	**Region** – As part of provisioning a **Workspace Collection**, you can select a region you to be provisioned in. For more information on Azure regions, see [Azure Regions](https://azure.microsoft.com/en-us/regions/).

## Workspace

A **Workspace** is a container of Power BI content which includes Datasets, Reports and Dashboards.  A **Workspace** is empty when first created.  During Preview , all content will be authored using the Power BI desktop application and you’ll upload it to one of your workspaces using the [Power BI REST APIs](http://docs.powerbi.apiary.io/reference).

## Using Workspace Collections and Workspaces
**Workspace Collections** and **Workspaces** are containers of content that are used and organized in whichever way best fits the design of the application you are building. There will be many different ways that you could arrange the content within them. You may choose to put all content within one workspace and then later use security and permissions to further subdivide it amongst your customers. You may also choose to put all of your customers in separate workspaces so that there is some separation between them. Or, you may choose to organize users by region rather than by customer. This flexible design allows you to choose the best way for your application to organize content.
## Data Sources in Preview

We will be enabling a limited set of data sources for Preview.

### Direct Query

We will support direct query connections against cloud sources for Preview.  This means that app developers will be able to connect to their data sources to show the latest data.  These data sources must be reachable from the cloud and must use basic authentication.  Some of the ideal candidates for this include:

-	SQL Azure
-	SQL Azure DW
-	HD Insight Spark

## Cached Datasets

Cached datasets can be used in Preview.  However, you cannot refresh cached data once it has been loaded into **Microsoft Power BI Embedded**.

## Authentication and Authorization

**Microsoft Power BI Embedded** defers to your application to perform all the necessary user Authentication and Authorization for your application.  There is no explicit requirement that your end-users be customers of Azure AD.  Instead, your application will express authorization to render a Power BI report to the **Microsoft Power BI Embedded** via **Application Authentication Tokens (App Tokens)**.  These **App Tokens** are created as needed when your app wishes to render a report.  See [App Tokens]().

![](media\powerbi-embedded-whats-is\app-tokens.png)

> [AZURE.NOTE] As the developer and administrator of your apps, you will need an Azure Active Directory account.

### Application Authentication Tokens

**Application Authentication Tokens (App Tokens)** are used to authenticate against **Microsoft Power BI Embedded**.  There are three types of **App Tokens**:

1.	Development Tokens
2.	Provisioning Tokens
3.	Embedding Tokens

These tokens are used for the various phases of your interactions with **Microsoft Power BI Embedded**.  The tokens are designed so that you do not need your users to interactively sign-in with an Azure AD account to use your application.

### Generating App Tokens

The SDKs  that have been provided for the Preview let you generate the tokens.  You must first call the CreatexxxToken() method, then call Generate() with the signing key retrieved from the **Workspace Collection**.  The basic **Create** methods for token generate are as follows:  

-	CreateProvisionToken
-	CreateDevToken
-	CreateReportEmbedToken

These methods are defined in the Microsoft.PowerBI.Security.PowerBIToken class. See, [Get started sample](power-bi-embedded-get-started.md) .
