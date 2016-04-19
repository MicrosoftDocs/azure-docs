<properties
   pageTitle="About app token flow in Power BI Embedded"
   description="Power BI Embedded about App Tokens for authentication and authorization"
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="03/29/2016"
   ms.author="derrickv"/>

# About app token flow in Power BI Embedded

The **Power BI Embedded** service uses **App Tokens** for authentication and authorization instead of explicit end-user authentication.  In the **App Token** model, your application manages authentication and authorization for your end-users.  When necessary, your app creates and sends the **App Tokens** that tells our service to render the requested report. This design does not require your app to use **Azure Active Directory** for user authentication and authorization, although you can do this.

**Here's how the app token key flow works**

1. Copy the API keys to your application. You can get the keys in **Azure Portal**.

    ![](media\powerbi-embedded-get-started-sample\azure-portal.png)

2. Token asserts a claim and has an expiration time.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-2.png)

3. Token gets signed with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-3.png)

4. User requests to view a report.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-4.png)

5.	Token is validated with an API access keys.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-5.png)

6.	Power BI Embedded sends a report to user.

    ![](media\powerbi-embedded-get-started-sample\power-bi-embedded-token-6.png)

After **Power BI Embedded** sends a report to the user, the user can view the report in your custom app. For example, if you imported the [Analyzing Sales Data PBIX sample](http://download.microsoft.com/download/1/4/E/14EDED28-6C58-4055-A65C-23B4DA81C4DE/Analyzing_Sales_Data.pbix), the sample web app would look like this:

![](media\powerbi-embedded-get-started-sample\sample-web-app.png)

## See Also
- [Get started with Microsoft Power BI Embedded sample](power-bi-embedded-get-started-sample.md)
- [What is Microsoft Power BI Embedded](power-bi-embedded-what-is-power-bi-embedded.md)
- [Common Microsoft Power BI Embedded Preview scenarios](power-bi-embedded-scenarios.md)
- [Get started with Microsoft Power BI Embedded Preview](power-bi-embedded-get-started.md)
