<properties title="Monitor usage and performance of an existing web project with Application Insights" pageTitle="Monitor usage and performance of an existing web project with Application Insights" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  />
 
# Add Application Insights to an existing web project

*Application Insights is in preview.*

Find out what users are doing with your web application, so that you can better tune it to their needs. Make sure it's constantly available and performing well. Application Insights will alert you to any issues and help you find and diagnose the root causes.

Application Insights can monitor live and in-development web applications, hosted on-premise or on virtual machines, as well as Microsoft Azure websites.

You'll need <a href="http://go.microsoft.com/fwlink/?LinkId=397827">Visual Studio Update 3</a>.

1. [Add Application Insights to your web service](#service)
+ [Add Application Insights to your web client](#client)
+ [Run your project](#run)
+ [See monitor data](#monitor)
+ [Deploy your application](#deploy)
+ [Next steps](#next)

*If you are [creating a new web project][newproject], it's even easier.*


## <a name="service"></a>1. Add Application Insights to your web service

Open your ASP.NET project in Visual Studio Update 3. 

Right-click and add Application Insights to the project.

![Add to an existing project](./media/appinsights/appinsights-03-addExisting.png)

## <a name="client"></a>2. Add Application Insights to your web client

Open Microsoft Azure.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)

Open the Applicataion Insights resource for your application.

![](./media/appinsights/appinsights-08openApp.png)

Get the code snippet for the client pages.

![Get code from Quick Start](./media/appinsights/appinsights-06webcode.png)

In Visual Studio, put the code in each web page that you want to monitor, immediately before the closing &lt;/head&gt; tag. 

In an ASP.NET app, a way to include the code on every page is to insert it in the master page. Depending on the type of project, that might be Views/Shared/_Layout, _SiteLayout, Site.master, or site.mobile.master.

Notice that the snippet contains the id of this application resource, so if you have several applications, you can't reuse the same snippet.



## <a name="run"></a>3. Run your project

Run your application with F5 and try it out.

## <a name="monitor"></a>4. See monitor data


**Close and re-open your application's home blade**, and look for data in the Application health and Usage analytics tiles. For example:

![Click through to more data](./media/appinsights/appinsights-05-usageTiles.png)

> [WACOM.NOTE] Currently, reports do not refresh automatically. If you are waiting for data in a report, you should close and re-open its blade. 

Click any tile to see more detail.
[Learn more about the data on the tiles and reports.][monitor]

> [WACOM.NOTE] The detail on many of the tiles is limited in this preview version. 

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
[newproject]: ../appinsights-01-start/
[trouble]: ../appinsights-09qna/
[diagnostics]: ../appinsights-24diagnostics/
