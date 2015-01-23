<properties title="Application Insights - Monitor usage and crashes in Windows Store and Phone apps" pageTitle="Monitor usage and crashes in Windows Store and Phone apps" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="alancameronwills"  manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2015-01-09" ms.author="awills" />

# Application Insights - Monitor usage and crashes in Windows Store and Phone apps

*Application Insights is in preview.*

Application Insights lets you monitor your published application for:

* **Usage** - Learn how many users you have and what they are doing with your app.
* **Crashes** - Get diagnostic reports of crashes and understand their impact on users.

![](./media/appinsights/appinsights-d018-oview.png)


* [Start monitoring your app](#start)
* [Track usage](#usage)
* [Detect and diagnose crashes](#crashes)

## <a name="start">Start monitoring your app</a>

#### <a name="add"></a>1. Add Application Insights

**If you're creating a new Windows Phone or Store project** select Application Insights in the New Project dialog. 

If you're asked to sign in, use the credentials for your Azure account (which is separate from your Visual Studio Online account).

![](./media/appinsights/appinsights-d21-new.png)


**If you already have a project** add Application Insights from Solution Explorer.

![](./media/appinsights/appinsights-d22-add.png)



#### <a name="run"></a>2. Run your project

[Run your application with F5](http://msdn.microsoft.com/library/windows/apps/bg161304.aspx) and use it, so as to generate some telemetry. 

In Visual Studio, you'll see a count of the events that have been received.

![](./media/appinsights/appinsights-09eventcount.png)

In debug mode, telemetry is sent as soon as it's generated. In release mode, telemetry is stored on the device and sent only when the app resumes.

#### <a name="monitor"></a>3. See monitor data

Open Application Insights from your project.

![Right-click your project and open the Azure portal](./media/appinsights/appinsights-04-openPortal.png)


At first, you'll just see one or two points. For example:

![Click through to more data](./media/appinsights/appinsights-26-devices-01.png)

Click Refresh after a few seconds if you're expecting more data.

Click any chart to see more detail. 



#### <a name="deploy"></a>4. Publish your application to Store

[Publish your application](http://dev.windows.com/publish) and watch the data accumulate as users download and use it.



## <a name="usage"></a>Track usage

From the Overview timeline, click through Users and Sessions charts to see more detailed analytics.


![](./media/appinsights/appinsights-d018-oview.png)

* **Users** are tracked anonymously, so the same user on different devices would be counted twice.
* A **session** is counted when the app is suspended (for more than a brief interval, to avoid counting accidental suspensions).

#### Segmentation

Segment a chart to get a breakdown by a variety of criteria. For example, to see how many users are using each version of your app, open the Users chart and segment by Application Version: 

![On the users chart, switch on Segmenting and choose Application version](./media/appinsights/appinsights-d25-usage.png)


#### Page views

To discover the paths that users follow through your app, insert [page view telemetry][api] into  your code:

    var telemetry = new TelemetryClient();
    telemetry.TrackPageView("GameReviewPage");

See the results on the page views chart, and by opening its details:

![](./media/appinsights/appinsights-d27-pages.png)

Click through any page to see the details of specific occurrences.

#### Custom events

By inserting code to send custom events from your app, you can track your users' behavior and the usage of specific features and scenarios. 

For example:

    telemetry.TrackEvent("GameOver");

The data will appear in the Custom Events grid. You can either see an aggregated view in Metrics Explorer, or click through any event to see specific occurrences.

![](./media/appinsights/appinsights-d28-events.png)


You can add string and numeric properties to any event.


    // Set up some properties:
    var properties = new Dictionary <string, string> 
       {{"Game", currentGame.Name}, {"Difficulty", currentGame.Difficulty}};
    var measurements = new Dictionary <string, double>
       {{"Score", currentGame.Score}, {"Opponents", currentGame.OpponentCount}};

    // Send the event:
    telemetry.TrackEvent("GameOver", properties, measurements);


Click through any occurrence to see its detailed properties, including those you have defined.


![](./media/appinsights/appinsights-d29-eventProps.png)

See [API reference][api] for more about custom events.


## <a name="crashes"></a> Detect and diagnose crashes


#### Set an alert to detect crashes

![From the crashes chart, click Alert rules and then Add Alert](./media/appinsights/appinsights-d023-alert.png)

#### Diagnose crashes

To find out if some versions of your app crash more than others, click through the crashes chart and then segment by Application Version:

![](./media/appinsights/appinsights-d26crashSegment.png)


To discover the exceptions that are causing crashes, open Diagnostic Search. You might want to remove other types of telemetry, to focus on the exceptions:

![](./media/appinsights/appinsights-d26crashExceptions.png)

Click any exception to see its details, including associated properties and stack trace.

![](./media/appinsights/appinsights-d26crash.png)

See the other exceptions and events that occurred close to that exception:


![](./media/appinsights/appinsights-d26crashRelated.png)



## <a name="next"></a>Next steps

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


