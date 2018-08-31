---
title: Power BI Workspace Collections FAQ
description: Frequently asked questions related to Power BI Workspace Collections.
services: power-bi-embedded
author: markingmyname
ROBOTS: NOINDEX
ms.assetid: 1475ed4f-fc84-4865-b243-e8a47d8bda59
ms.service: power-bi-embedded
ms.topic: article
ms.workload: powerbi
ms.date: 09/25/2017
ms.author: maghan

---
# Power BI Workspace Collections FAQ

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and is available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

## What is Microsoft Power BI Workspace Collections?
Power BI Workspace Collections is an Azure service that allows Application developers to embed stunning, fully interactive reports and visualizations in customer facing apps without the time and expense of having to build your own controls from the ground-up. We now have Power BI Workspace Collections available with SLA in 9 data centers worldwide. We have also enhanced functionalities in the service like support for data security via row-level security (RLS) in Power BI Workspace Collections for advanced filtering. We have also simplified and updated the Power BI Workspace Collections pricing model.

## Who would want to use Microsoft Power BI Workspace Collections, and why?
Microsoft Power BI Workspace Collections are for Application developers that want to offer stunning and interactive data visualization experiences for their users across any of their devices without having to build it themselves. With Power BI Workspace Collections, developers can deliver always-up-to-date views with Direct Query. Developers can also programmatically deploy and manage automate Power BI with the Azure Resource Manager APIs and Power BI APIs. As with all things Power BI, the embedded service automatically scales to meet the usage and needs of your application. The Power BI Workspace Collections service features a Pay-as-you-go consumption based pricing model.

## How does Power BI Workspace Collections relate to the Power BI service?
Power BI Workspace Collections and the Power BI service are separate offerings. Power BI Workspace Collections features a consumption-based billing model, is deployed through the Azure portal and is designed to enable ISVs to embed data visualizations in applications for their customers to use. The Power BI service is billed and deployed through the O365 portal and is a standalone general purpose BI offering primarily targeted at enterprise internal use. To learn more about the Power BI service, see [www.powerbi.com](https://powerbi.microsoft.com).

## How does Power BI Workspace Collections improve my app?
Applications are significantly more powerful when you can leverage stunning, interactive data visualizations to inform user decisions directly in your application. Power BI Workspace Collections lets you enhance your app with interactive, always up-to-date, rich data visualizations so that you can increase the utility of your app, user satisfaction and loyalty, and deliver contextual analytics with ease on any device.

## Are there any rules or restrictions about how I can use Power BI Workspace Collections in my app?
Power BI Workspace Collections are intended for your applications that are provided for third party use. If you want to use the Power BI Workspace Collections service to create an internal business application, each of your internal users will need a Power BI Pro USL, and your organization will be charged for their consumption of the Power BI Workspace Collections service in addition to their Power BI Pro USL fees. To avoid incurring both Power BI Pro USL fees and Power BI Workspace Collections consumption costs for internal applications, the Power BI service offers its own content embedding capabilities outside of Power BI Workspace Collections for no additional cost to Power BI USL holders (dev.powerbi.com).

## Can Power BI Workspace Collections be used to create internal applications?
No, Power BI Workspace Collections are only intended for use by external users and should not be used within internal business applications. In order to embed Power BI content for use in internal business applications, you should use the Power BI service, and all users consuming that content must have a valid Power BI Free or Power BI Pro user subscription license. More information on how to integrate internal applications with the Power BI service is available at  [https://dev.powerbi.com](https://dev.powerbi.com).

## Is this service available globally?
The Power BI Workspace Collections service is available in most data centers now. You can always check the latest availability [here](https://azure.microsoft.com/status/).

## What is the available SLA for the service?
Power BI Workspace Collections with Azure standard SLA. See [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/) for more information.

## What is a report session and how is it billed?
A session is a set of interactions between an end user and a Power BI Workspace Collections report. Each time a Power BI Workspace Collections report is displayed to a user, a session is initiated and the subscription holder is charged for a session. Sessions are billed at a flat rate, independent of the number of visual elements in a report or how frequently the report content is refreshed. A session ends when either the user closes the report, or the session times out after one hour.

## Do you offer any tools or guidance to help me estimate how many renders/session I should expect? How will I know how many renders have been completed?
The Azure portal provides billing details on how many renders / report sessions have been performed against your subscription.

## Do I need a Power BI subscription in order to develop applications with Power BI Workspace Collections? How do I get started?
As the application developer, you do not need to have a Power BI subscription in order to create the reports and visualizations you wish to use in your application. You need a Microsoft Azure subscription and the free Power BI Desktop application.

See our service documentation for details on how to use the Power BI Workspace Collections service.

## I have an Azure subscription. Can I use Power BI Workspace Collections using my existing subscription?
Yes. You can use your existing Azure subscription to provision and use the Microsoft Power BI Workspace Collections service.

## Does my application end-user need a Power BI license?
No. Your application’s end users are not required to buy or the Power BI subscription separately in order to access the in-app data visualizations. In the Power BI Workspace Collections model you, as the application provider, is billed for the service through the Azure consumption meter. Refer to the [Pricing and licensing page](http://go.microsoft.com/fwlink/?LinkId=760527).

## How does user authentication work with Power BI Workspace Collections?
The Power BI Workspace Collections service uses App Tokens for authentication and authorization instead of explicit end-user authentication. In the App Token model, your application manages authentication and authorization for your end users. Then, when necessary, your app creates

and sends the App Tokens that tells our service to render the requested report. This design does not require your app to use Azure AD for user authentication and authorization, although you can do this. You can learn more about App Tokens [here](app-token-flow.md). We also introduced row-level security feature (RLS) in Power BI Workspace Collections for advanced security filtering scenarios.

## What data sources are currently supported with Power BI Workspace Collections?
We are going to support access to cloud data sources that use basic credentials via Direct Query. This means that sources such as Azure SQL DB and Azure SQL DW are supported right now. We add support for other data sources and access types in the coming months. For more information, see [Connect to a data source](connect-datasource.md).

## How does the tenancy model work for Power BI Workspace Collections?
In the Power BI Workspace Collections model, there is no explicit requirement to have your customers in Azure AD tenants. You can elect to require Azure AD for your customers, or not. As a result, the architecture of your application and infrastructure is what determines the tenancy model required for Power BI Workspace Collections.

Developers/employees working on or building your application needs to have an AAD user account when they are to manage your Azure Subscription and Workspace Collections via the Azure portal. Programmatic APIs to enable developers to import reports, modify connection strings and get embed URLs leverage App Tokens for authentication instead, and as a result do not require an AAD.

## Where can I learn more?
You can visit the [Power BI Workspace Collections documentation page](get-started.md). You can stay up-to-date about this service by visiting the [Power BI blog](https://powerbi.microsoft.com/blog/) or by visiting the Power BI developer center at dev.powerbi.com. You can also ask questions at [Stackoverflow](http://stackoverflow.com/questions/tagged/powerbi).

## How do I get started?
You can get started for free now! If you have an Azure subscription, you can now provision Power BI Workspace Collections from the Azure portal directly. You can also create your [free Azure account](https://azure.microsoft.com/free/). Once you've provisioned the Power BI Workspace Collections service, you can easily use Power BI REST APIs directly, or use the developer SDK available on [GitHub](http://go.microsoft.com/fwlink/?LinkID=746472). Samples are provided on how to leverage the developer SDK.

## See also

[What is Microsoft Power BI Workspace Collections](what-are-power-bi-workspace-collections.md)
[Get started with Microsoft Power BI Workspace Collections](get-started.md)
[Get started with sample](get-started-sample.md)   
[JavaScript Embed Sample](https://microsoft.github.io/PowerBI-JavaScript/demo/)  

More questions? [Try the Power BI Community](http://community.powerbi.com/)

