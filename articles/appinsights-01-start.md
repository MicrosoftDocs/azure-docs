<properties title="Monitor health and usage of a web project with Application Insights" pageTitle="Monitor health and usage of a web project with Application Insights" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  />
 
# H1 (Monitor your web application's health and usage) 

*Application Insights is in preview.*

Find out what users are doing with your web application, so that you can tune it to their needs. And make sure it's constantly available and performing well. Application Insights will alert you to any issues and help you find and diagnose the root causes.

Application Insights can monitor live and in-development web applications, hosted on-premise or on virtual machines, as well as Microsoft Azure websites.

You'll need <a href="http://go.microsoft.com/fwlink/?LinkId=397827">Visual Studio Update 3</a>.

+ [1. Add Application Insights] 
+ [2. Run your project]
+ [3. See monitor data]
+ [Next steps]


*Already got your web project? Go to [Add Application Insights to an existing project][existing].*

## 1. Add Application Insights

When you create a new ASP.NET project, make sure Application Insights is selected. 


![Create an ASP.NET project](./media/appinsights/appinsights-01-vsnewp1.png)

If this is your first time, you'll be asked to provide your login for Microsoft Azure Preview, or to sign up. 

> No Application Insights option? Check you're using Visual Studio Update 3, and that you're creating an ASP.NET web application project.

It doesn't matter whether you host your application on premises, in a virtual machine, or in a Microsoft Azure website.


## 2. Run your project

Run your application with F5 and try it out.

## 3. See monitor data

Go to your application in Application Insights.

![Right-click your project and open the Azure portal](./media/appInsights/appinsights-04-openPortal.png)

In your application's home blade, look for data in the  Application health and Usage analytics tiles. For example:

![Click through to more data](./media/appInsights/appinsights-05-usageTiles.png)

> [WACOM.NOTE] If you already had your application blade open, close it and re-open it to see the data. In the current version, the reports are not automatically refreshed. 

Click any tile to see more detail.

> [WACOM.NOTE] Many of the tiles show limited detail in this preview version. 

## 4. Deploy your application

Deploy your application and watch the data accumulate.

Before you deploy your application for live use, open ApplicationInsights.config. Find and set the following parameter:

    <DeveloperMode>false</DeveloperMode>

This will change the thresholds for performance notification so that less data is sent.


## Next steps

[Understand the data from your application][monitor]

[Web tests]


<!--Anchors-->
[1. Add Application Insights]: #subheading-1
[2. Run your project]: #subheading-2
[3. See monitor data]: #subheading-3
[Next steps]: #next-steps


<!--Link references-->
[Web tests]: ../appinsights-10Avail/
[monitor]: ../appinsights-04monitor/
[existing]: ../appinsights-02-existing/


