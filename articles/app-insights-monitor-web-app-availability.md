<properties title="Monitor any web site's availability and responsiveness" pageTitle="Monitor any web site's availability and responsiveness" description="Set up web tests in Application Insights. Get alerts if a website becomes unavailable or responds slowly." metaKeywords="analytics web test availability" authors="awills"  manager="kamrani" />

<tags ms.service="application-insights" ms.workload="tbd" ms.tgt_pltfrm="ibiza" ms.devlang="na" ms.topic="article" ms.date="2014-10-02" ms.author="awills" />
 
# Monitor any web site's availability and responsiveness

After you've deployed your web application, you can set up web tests to monitor its availability and responsiveness. Application Insights will send web requests at regular intervals from points around the world, and can alert you if your application responds slowly or not at all.

![Web test example](./media/appinsights/appinsights-10webtestresult.png)

You can set up web tests for any HTTP endpoint that is accessible from the public internet.

*Is it an Azure website? Just [create the web test in the website blade][azurewebtest].*

####Steps

1. [Create a new resource?](#create)
1. [Set up a web test](#setup)
1. [View results](#monitor)
1. [Edit or disable a test](#edit)


 [Video](#video)
 [Next steps](#next)



## <a name="create"></a>1. Create a new resource?

Skip this step if you've already [set up an Application Insights resource][start] for this application, and you want to see the availability data in the same place.

Sign up to [Microsoft Azure](http://azure.com), go to the [Preview portal](https://portal.azure.com), and create a new Application Insights resource. 

![New > Application Insights](./media/appinsights/appinsights-11newApp.png)

## <a name="setup"></a>2. Set up a web test

In the overview blade for your application, click through the webtests tile. 

![Click the empty availability test](./media/appinsights/appinsights-12avail.png)

*Already got some web tests? Click through the webtests tile, and choose Add Webtest.*

Set up the test details.

![Fill at least the URL of your website](./media/appinsights/appinsights-13availChoices.png)

- **The URL** must be visible from the public internet. It can include a query string - so for example you could exercise your database a little. If the URL resolves to a redirect, we will follow it, up to 10 redirects.

- **Test locations** are the places from where our servers send web requests to your URL. Choose two or three so that you can distinguish problems in your website from network issues. You can't select more than three.

- **Success criteria**:
    **HTTP return codes**: 200 is usual. 

    **Content match** string, like "Welcome!" We'll test that it occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes you might have to update it.

- **Alerts**: By default, alerts are sent to you if there are repeated failures over 15 minutes. But you can change it to be more or less sensitive, and you can also change the notified email addresses.

### Test more URLs

You can add more tests for as many URLs as you like. For example, as well as testing your home page, you could make sure your database is running by testing the URL for a search.

![On the web tests blade, choose Add](./media/appinsights/appinsights-16anotherWebtest.png)


## <a name="monitor"></a>3. View availability reports

After 1-2 minutes, click Refresh on the overview blade. (In this release, it doesn't refresh automatically.)

![Summary results on the home blade](./media/appinsights/appinsights-14availSummary.png)

The chart on the overview blade combines results for all the web tests of this application.

### If you see failures...

Click through to the webtests blade to see separate results for each test.

Open a specific web test.

![Click a specific webtest](./media/appinsights/appinsights-15webTestList.png)

Scroll down to **Failed tests** and pick a result.

![Click a specific webtest](./media/appinsights/appinsights-17-availViewDetails.png)

The result shows the reason for failure.

![Webtest run result](./media/appinsights/appinsights-18-availDetails.png)

For more detail, download the result file and inspect it in Visual Studio.

## <a name="edit"></a>4. Edit or disable a test

Open an individual test to edit or disable it.

![Edit or disable a web test](./media/appinsights/appinsights-19-availEdit.png)

You might want to disable web tests while you are performing maintenance on your service.

## <a name="video"></a>Video

> [AZURE.VIDEO monitoring-availability-with-application-insights]

## <a name="next"></a>Next steps

[Search diagnostic logs][diagnostic]

[Troubleshooting][qna]


## Application Insights - learn more

* [Application Insights - get started][start]
* [Monitor a live web server now][redfield]
* [Monitor performance in web applications][perf]
* [Search diagnostic logs][diagnostic]
* [Availability tracking with web tests][availability]
* [Track usage][usage]
* [Track custom events and metrics][track]
* [Q & A and troubleshooting][qna]


* [Web tests for Azure websites][azurewebtest]

<!--Link references-->


[start]: ../app-insights-start-monitoring-app-health-usage/
[redfield]: ../app-insights-monitor-performance-live-website-now/
[perf]: ../app-insights-web-monitor-performance/
[diagnostic]: ../app-insights-search-diagnostic-logs/ 
[availability]: ../app-insights-monitor-web-app-availability/
[usage]: ../app-insights-web-track-usage/
[track]: ../app-insights-web-track-usage-custom-events-metrics/
[qna]: ../app-insights-troubleshoot-faq/
[webclient]: ../app-insights-start-monitoring-app-health-usage/#webclient

[azurewebtest]: ../insights-create-web-tests/