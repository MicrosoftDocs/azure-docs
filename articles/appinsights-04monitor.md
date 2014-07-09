<properties title="Monitor usage and performance of a web project with Application Insights" pageTitle="Monitor usage and performance of a web project with Application Insights" description="Analyze usage, availability and performance of your on-premises or Microsoft Azure web application with Application Insights." metaKeywords="analytics monitoring application insights" authors="awills"  />
 
# H1 (Monitor your web application) 

If you haven't yet [set up your web project for Application Insights][existing], do that now.

Here are the reports you can expect to see on your application's blade in Application Insights. To get to the page from Visual Studio, right-click your web project and choose Open Application Insights. To get to it from the Microsoft Azure Preview start board, choose Browse, Application Insights, and then select your project.

In this preview version, you can't edit the layout or configuration of the tiles.

**Close and re-open the blade periodically to refresh the data, in this version.**

+ [Application Health] 
+ [Usage Analytics]
+ [Next steps]


## Application Health

Application health is monitored by instrumenting your application's code.

![](./media/appinsights/appinsights-42reqs.png)

### Average response time

Measures the time between a web request entering your application and the response being returned.

The points show a moving average. If there are a lot of requests, there might be some that deviate from the average without an obvious peak or dip in the graph.

Look for unusual peaks. In general, expect response time to rise with a rise in requests. If the rise is disproportionate, your app might be hitting a resource limit such as CPU or the capacity of a service it uses.

### Requests

The number of requests received in a specified period. Compare this with the results on other charts to see how your app behaves as the load varies.

### Web tests

![](./media/appinsights/appinsights-43webtests.png)

[Web tests] show the results of web requests sent to your server at regular intervals from Application Insights servers around the world.

Check to see if the results vary along with the request count.

[How to set up web tests][Web tests].

### Slowest requests

![](./media/appinsights/appinsights-44slowest.png)

Shows which requests might need performance tuning.

### Diagnostic search

![](./media/appinsights/appinsights-45diagnostic.png)

If you've [set up diagnostic logging][diagnostics], click through to see the latest events.

### Failed requests

![](./media/appinsights/appinsights-46failed.png)

A count of requests that threw uncaught exceptions.

(Coming soon - click through to get the exception reports.)

## Usage Analytics

![](./media/appinsights/appinsights-47usage.png)

Usage data comes partly from from the server and partly from the [scripts in the web pages][existing].

### Sessions per browser

A *session* is a period that starts when a user opens any page on your web site, and ends after the user has not sent any web request for a timeout period of 30 minutes. 

Click through to zoom into the chart.

### Top page views

Shows total counts in the last 24 hours.

Click through to see graphs of page views over the past week.


## Next steps

[Set up web tests][Web tests]

[Capture and search diagnostic logs][diagnostics]


<!--Anchors-->
[Application Health]: #subheading-1
[Usage Analytics]: #subheading-2
[Next steps]: #next-steps


<!--Link references-->
[Web tests]: ../appinsights-10Avail/
[diagnostics]: ../appinsights-24diagnostics/
[monitor]: ../appinsights-04monitor/
[start new]: ../appinsights-01new/
[existing]: ../appinsights-02-existing/


