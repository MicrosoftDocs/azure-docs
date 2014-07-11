<properties title="Monitor health and usage of a new web project with Application Insights" pageTitle="Monitor health and usage of a new web project with Application Insights" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  />
 
# Monitor your web application's health and usage

*Application Insights is in preview.*

Find out what users are doing with your web application, so that you can tune it to their needs. And make sure it's constantly available and performing well. Application Insights will alert you to any issues and help you find and diagnose the root causes.

Application Insights can monitor live and in-development web applications, hosted on-premise or on virtual machines, as well as Microsoft Azure websites.

You'll need <a href="http://go.microsoft.com/fwlink/?LinkId=397827">Visual Studio Update 3</a>.

1. [Add Application Insights](#add)
+ [Run your project](#run)
+ [See monitor data](#monitor)
+ [Deploy your application](#deploy)
+ [Next steps](#next)


*Already got your web project? Go to [Add Application Insights to an existing project][existing].*

## <a name="add"></a>1. Add Application Insights

When you create a new ASP.NET project, make sure Application Insights is selected. 


![Create an ASP.NET project](./media/appinsights/appinsights-01-vsnewp1.png)

If this is your first time, you'll be asked to provide your login for Microsoft Azure Preview, or to sign up. 

> No Application Insights option? Check you're using Visual Studio Update 3, and that you're creating an ASP.NET web application project.

It doesn't matter whether you host your application on premises, in a virtual machine, or in a Microsoft Azure website.


## <a name="run"></a>2. Run your project

Run your application with F5 and try it out.

## <a name="monitor"></a>3. See monitor data

Open the Azure Portal.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)

Go to the Application Insights resource for your application.

![Browse Application Insights](./media/appinsights/appinsights-08openApp.png)

Look for data in the  Application health and Usage analytics tiles. For example:

![Click through to more data](./media/appinsights/appinsights-05-usageTiles.png)

> [WACOM.NOTE] If you already had your application blade open, close it and re-open it to see the data. In the current version, the reports are not automatically refreshed. 

Click any tile to see more detail. [Learn more about the tiles and reports.][monitor]

> [WACOM.NOTE] Many of the tiles show limited detail in this preview version. 

## <a name="deploy"></a>4. Deploy your application

Deploy your application and watch the data accumulate.


## <a name="next"></a>Next steps

[Learn more about the tiles and reports][monitor]

[Web tests]

[Capture and search diagnostic logs][diagnostics]

[Troubleshooting][trouble]


<!--Link references-->
[Web tests]: ../appinsights-10Avail/
[monitor]: ../appinsights-04monitor/
[existing]: ../appinsights-02-existing/
[diagnostics]: ../appinsights-24diagnostics/
[trouble]: ../appinsights-09qna/




