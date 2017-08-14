---
title: Microsoft Dynamics CRM and Azure Application Insights | Microsoft Docs
description: Get telemetry from Microsoft Dynamics CRM Online using Application Insights. Walkthrough of setup, getting data, visualization and export.
services: application-insights
documentationcenter: ''
author: mazharmicrosoft
manager: carmonm

ms.assetid: 04c66338-687e-49e5-9975-be935f98f156
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/16/2017
ms.author: cfreeman

---
# Walkthrough: Enabling Telemetry for Microsoft Dynamics CRM Online using Application Insights
This article shows you how to get telemetry data from [Microsoft Dynamics CRM Online](https://www.dynamics.com/) using [Azure Application Insights](https://azure.microsoft.com/services/application-insights/). We’ll walk through the complete process of adding Application Insights script to your application, capturing data, and data visualization.

> [!NOTE]
> [Browse the sample solution](https://dynamicsandappinsights.codeplex.com/).
> 
> 

## Add Application Insights to new or existing CRM Online instance
To monitor your application, you add an Application Insights SDK to your application. The SDK sends telemetry to the [Application Insights portal](https://portal.azure.com), where you can use our powerful analysis and diagnostic tools, or export the data to storage.

### Create an Application Insights resource in Azure
1. Get [an account in Microsoft Azure](http://azure.com/pricing). 
2. Sign into the [Azure portal](https://portal.azure.com) and add a new Application Insights resource. This is where your data will be processed and displayed.
   
    ![Click +, Developer Services, Application Insights.](./media/app-insights-sample-mscrm/01.png)
   
    Choose ASP.NET as the application type.
3. Open the Getting Started page and open "Monitor and diagnose client side".
   
    ![Code snippet for insertion in your web page](./media/app-insights-sample-mscrm/03.png)

**Keep the code page open** while you do the next step in another browser window. You'll need the code soon. 

### Create a JavaScript web resource in Microsoft Dynamics CRM
1. Open your CRM Online instance and login with administrator privileges.
2. Open Microsoft Dynamics CRM Settings, Customizations, Customize the System
   
    ![Microsoft Dynamics CRM settings](./media/app-insights-sample-mscrm/04.png)
   
    ![Settings > Customizations](./media/app-insights-sample-mscrm/05.png)

    ![Customize the system option](./media/app-insights-sample-mscrm/06.png)

1. Create a JavaScript resource.
   
    ![New Web Resource dialog](./media/app-insights-sample-mscrm/07.png)
   
    Give it a name, select **Script (JScript)** and open the text editor.
   
    ![Open the text editor](./media/app-insights-sample-mscrm/08.png)
2. Copy the code from Application Insights. While copying make sure to ignore script tags. Refer below screenshot:
   
    ![Set your instrumentation key](./media/app-insights-sample-mscrm/09.png)
   
    The code includes the instrumentation key that identifies your Application insights resource.
3. Save and publish.
   
    ![Save and publish](./media/app-insights-sample-mscrm/10.png)

### Instrument Forms
1. In Microsoft CRM Online, open the Account form
   
    ![Account form](./media/app-insights-sample-mscrm/11.png)
2. Open the form Properties
   
    ![Form properties](./media/app-insights-sample-mscrm/12.png)
3. Add the JavaScript web resource that you created
   
    ![Add menu](./media/app-insights-sample-mscrm/13.png)
   
    ![Add the web resource](./media/app-insights-sample-mscrm/14.png)
4. Save and publish your form customizations.

## Metrics captured
You have now set up telemetry capture for the form. Whenever it is used, data will be sent to your Application Insights resource.

Here are samples of the data that you'll see.

#### Application health
![Example page load time](./media/app-insights-sample-mscrm/15.png)

![Example page views chart](./media/app-insights-sample-mscrm/16.png)

Browser exceptions:

![Browser exceptions chart](./media/app-insights-sample-mscrm/17.png)

Click the chart to get more detail:

![Exceptions list](./media/app-insights-sample-mscrm/18.png)

#### Usage
![Users, sessions and page views](./media/app-insights-sample-mscrm/19.png)

![Sesion charts](./media/app-insights-sample-mscrm/20.png)

![Browser versions](./media/app-insights-sample-mscrm/21.png)

#### Browsers
![Breakdown of page load time](./media/app-insights-sample-mscrm/22.png)

![Count of sessions by browser version](./media/app-insights-sample-mscrm/23.png)

#### Geolocation
![Session count by country](./media/app-insights-sample-mscrm/24.png)

![Sessions and users by country](./media/app-insights-sample-mscrm/25.png)

#### Inside page view request
![Page view summary](./media/app-insights-sample-mscrm/26.png)

![Search on page view events](./media/app-insights-sample-mscrm/27.png)

![Similar page views](./media/app-insights-sample-mscrm/28.png)

![Page view properties](./media/app-insights-sample-mscrm/29.png)

![Pages per session](./media/app-insights-sample-mscrm/30.png)

## Sample code
[Browse the sample code](https://dynamicsandappinsights.codeplex.com/).

## Power BI
You can do even deeper analysis if you [export the data to Microsoft Power BI](app-insights-export-power-bi.md).

## Sample Microsoft Dynamics CRM Solution
[Here is the sample solution implemented in Microsoft Dynamics CRM](https://dynamicsandappinsights.codeplex.com/).

## Learn more
* [What is Application Insights?](app-insights-overview.md)
* [Application Insights for web pages](app-insights-javascript.md)
* [More samples and walkthroughs](app-insights-code-samples.md)
