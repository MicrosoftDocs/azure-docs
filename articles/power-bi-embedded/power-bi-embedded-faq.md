<properties
   pageTitle="FAQ"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

# Power BI Embedded FAQ

1.	**What did you announce about Power BI at Build?**

Microsoft announced that the Microsoft Power BI Embedded Service Public Preview is now available.

2.	**What is Microsoft Power BI Embedded?**

Microsoft Power BI Embedded is an Azure service that allows Application Developers to embed stunning, fully interactive reports and visualizations into your customer facing apps without the time and expense of having to build your own controls from the ground-up. You can choose from a broad range of data visualizations that come out of the box, or easily build custom visualizations to meet your application’s unique needs.  Power BI Embedded is intended for use by ISV/Application Developers that want to deliver BI to their customers as part of their larger application.  

3.	**Who would want to use Microsoft Power BI Embedded, and why?**

Microsoft Power BI Embedded is for Application Developers that want to offer stunning and interactive data visualization experiences for their users across any of their devices without having to build it themselves.  With Power BI Embedded, developers can deliver always-up-to-date views with **Direct Query**.  Developers can also programmatically deploy, manage, and automate Power BI with the Azure ARM APIs and Power BI APIs.  As with all things Power BI, the Embedded service automatically scales to meet the usage and needs of your application.  The Power BI Embedded service features a Pay-as-you-go consumption based pricing model. For pricing, see [How is this service priced?](#price).

4.	**How does Power BI Embedded relate to the Power BI service?**

The Power BI Embedded and the Power BI service are separate offerings. Power BI Embedded features a consumption-based billing model, is deployed through the Azure portal and is designed to enable ISVs to embed data visualizations in applications for their customers to use. The Power BI service is billed and deployed through the O365 portal and is a standalone general purpose BI offering primarily targeted at enterprise internal use. For more information about the Power BI service please visit [www.powerbi.com](www.powerbi.com).

5.	**How does Power BI Embedded improve my App?**

Applications are significantly more powerful when you leverage stunning data visualizations to inform user decisions directly in your application.  Power BI Embedded lets you enhance your app with interactive, always up-to-date, rich data visualizations so that you can increase the utility of your app, user satisfaction and loyalty, and deliver contextual analytics with ease on any device.

6.	**Are there any rules or restrictions about how I can use Power BI Embedded in my app?**

You may use the Power BI Embedded service within an application you develop only if your application (1) adds primary and significant functionality to Power BI Embedded service and is not primarily a substitute for any Power BI service, and (2) is provided solely for users external to your company.  You may not use the Power BI Embedded service within internal business applications.  

7.	**Can Power BI Embedded be used to create internal applications?**

No, Power BI Embedded is only intended for use by external users and may not be used within internal business applications. In order to embed Power BI content for use in internal business applications, you should use the Power BI service, and all users consuming that content must have a valid Power BI Free or Power BI Pro user subscription license. More information on internal embedding using the Power BI service is available at [https://dev.powerbi.com](https://dev.powerbi.com).

8.	**Is this service available globally?**

The Power BI Embedded service is available in North America as of our announcement at BUILD 2016 (in the US South Central Data Center).  You can expect us to roll out this service to the rest of the Azure data centers very shortly after.  

9.	**What is the available SLA for the service?**  
Power BI Embedded is now available as a preview Azure service without a formal SLA. An SLA will be provided when the service moves from preview to general availability.

<a name="price"/>
10.	**How is this service priced?**

 Power BI Embedded is currently in preview. Customers purchase the service through two primary licensing vehicles: the Microsoft Online Subscription Program (MOSP) or through an Enterprise VL Program.

    You may use the Power BI Embedded service within an application you develop only if your application (1) adds primary and significant functionality to our service and is not primarily a substitute for any Power BI service, and (2) is provided solely for external users.  You may not use the Power BI Embedded service within internal business applications.

    ![](media\power-bi-embedded-faq\price.png)

 11.	**What is a render and how is it billed?**

 A render occurs when a visualization is displayed to an end user that requires a query to the service. The Power BI service attempts to cache rendered content when possible in order to reduce the number of renders that your application will be charged for.  However, user actions such as filtering may result in a query to our service, which constitutes a new render.  

 For example, if a user views a report containing four visuals, this may result in four renders. If the user refreshes the report and more queries are sent to the service, it would result in four more renders. The service owner will have control over the extent to which end users can drive new queries that result in paid renders to limit cost exposure and minimize costs in static data scenarios.

 Renders are billed per 1,000 renders. Billing is prorated for render quantities less than 1,000. Customers receive 1,000 free renders per month. Customers who purchase through Volume Licensing agreements should consult their Microsoft partner or seller for pricing information.

 12.	**Do you offer any tools or guidance to help me estimate how many renders I should expect? How will I know how many renders have been completed?**

 The Azure Portal will provide billing details on how many renders have been performed against your subscription.

 13.	**Do I need a Power BI subscription in order to develop applications with Power BI Embedded? How do I get started?**

 As the Application Developer, you do not need to have a Power BI subscription in order to create the reports and visualizations you wish to use in your application.  You will need a Microsoft Azure subscription and the free Power BI Desktop application.

 Please see our service documentation for details on how to use the Power BI Embedded service.
 14.	**I have an Azure subscription. Can I use Power BI Embedded using my existing subscription?**

 Yes. You can use your existing Azure subscription to provision and use the Microsoft Power BI Embedded service.

 15.	**Does my application end-user need a Power BI license?**

 No. Your application’s end-users are not required to buy a separate Power BI subscription to access the in-app data visualizations. In the Power BI Embedded model, the Application Provider, will be billed for the service through the Azure consumption meter. Please refer to the pricing and licensing page [here](http://go.microsoft.com/fwlink/?LinkId=760527).
 16.	**How does user authentication work with Power BI Embedded?**

 The Power BI Embedded service uses App Tokens for authentication and authorization instead of explicit end-user authentication.  In the App Token model, your application manages authentication and authorization for your end-users.  Then, when necessary, your app creates and sends the App Tokens which tells our service to render the requested report. This design does not require your app to use Azure Active Directory for user authentication and authorization, although you can do this.  For more information on App Tokens, please refer to the documentation page [here](http://www.azure.com/documentation).
 17.	**What data sources are currently supported with Power BI Embedded?**

 During the public preview of the service, we are going to support access to cloud data sources that use basic credentials via Direct Query. This means that sources such as Azure SQL DB, HDInsight Spark and Azure SQL DW are supported right now.  We will add support for other data sources and access types in the coming months. We’ll announce new supported data sources on the Power BI developer forum at [http://dev.powerbi.com](http://dev.powerbi.com/) .
 18.	**How does the tenancy model work for Power BI Embedded?**

 In the Power BI Embedded model, there is no explicit requirement to have your customers in Azure Active Directory (Azure AD) tenants.  You can elect to require Azure AD for your customers, or not. As a result, the architecture of your application and infrastructure is what will determine the tenancy model required for Power BI Embedded.
 Developers/employees working on or building your application will need to have an Azure AD user account when they are to manage your Azure Subscription and Workspace Collections via the Azure Portal.  Programmatic APIs to enable developers to import reports, modify connection strings and get embed URLs leverage App Tokens for authentication instead, and as a result do not require an Azure AD.  Details on how to use our APIs and Azure Portal can be found in the service documentation page in Azure.com.

 19.	**Where can I learn more?**

 You can visit the Power BI Embedded documentation page [here](http://go.microsoft.com/fwlink/?LinkId=760526) . You can stay up-to-date about this service by visiting the Power BI developer [blog](http://blogs.msdn.com/powerbidev) or by visiting the Power BI developer center at dev.powerbi.com. You can also ask questions at Stackoverflow by visiting [this](http://stackoverflow.com/questions/tagged/powerbi) page.

 20.	**How do I get started?**

 You can get started for free now! If you have an Azure subscription, you can now provision Power BI Embedded from the Azure portal directly.  You can also create you free Azure account [here](https://azure.microsoft.com/en-us/free/). Once you have provisioned the Power BI Embedded service, you can easily use Power BI REST APIs directly, or use the developer SDK available on [GitHub](https://github.com/PowerBI) . Samples are provided on how to leverage the developer SDK.
