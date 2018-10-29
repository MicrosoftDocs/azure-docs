---
title: Monitor availability and responsiveness of any web site | Microsoft Docs
description: Set up web tests in Application Insights. Get alerts if a website becomes unavailable or responds slowly.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: 46dc13b4-eb2e-4142-a21c-94a156f760ee
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 09/13/2018
ms.reviewer: sdash
ms.author: mbullwin

---
# Monitor availability and responsiveness of any web site
After you've deployed your web app or web site to any server, you can set up tests to monitor its availability and responsiveness. [Azure Application Insights](app-insights-overview.md) sends web requests to your application at regular intervals from points around the world. It alerts you if your application doesn't respond, or responds slowly.

You can set up availability tests for any HTTP or HTTPS endpoint that is accessible from the public internet. You don't have to add anything to the web site you're testing. It doesn't even have to be your site: you could test a REST API service on which you depend.

There are two types of availability tests:

* [URL ping test](#create): a simple test that you can create in the Azure portal.
* [Multi-step web test](#multi-step-web-tests): which you create in Visual Studio Enterprise and upload to the portal.

You can create up to 100 availability tests per application resource.


## <a name="create"></a>Open a resource for your availability test reports

**If you have already configured Application Insights** for your web app, open its Application Insights resource in the [Azure portal](https://portal.azure.com).

**Or, if you want to see your reports in a new resource,** go to the [Azure portal](https://portal.azure.com), and create an Application Insights resource.

![New > Application Insights](./media/app-insights-monitor-web-app-availability/11-new-app.png)

Click **All resources** to open the Overview blade for the new resource.

## <a name="setup"></a>Create a URL ping test
Open the Availability blade and add a test.

![Fill at least the URL of your website](./media/app-insights-monitor-web-app-availability/13-availability.png)

* **The URL** can be any web page you want to test, but it must be visible from the public internet. The URL can include a query string. So, for example, you can exercise your database a little. If the URL resolves to a redirect, we follow it up to 10 redirects.
* **Parse dependent requests**: If this option is checked, the test requests images, scripts, style files, and other files that are part of the web page under test. The recorded response time includes the time taken to get these files. The test fails if all these resources cannot be successfully downloaded within the timeout for the whole test. If the option is not checked, the test only requests the file at the URL you specified.

* **Enable retries**:  If this option is checked, when the test fails, it is retried after a short interval. A failure is reported only if three successive attempts fail. Subsequent tests are then performed at the usual test frequency. Retry is temporarily suspended until the next success. This rule is applied independently at each test location. We recommend this option. On average, about 80% of failures disappear on retry.

* **Test frequency**: Sets how often the test is run from each test location. With a default frequency of five minutes and five test locations, your site is tested on average every minute.

* **Test locations** are the places from where our servers send web requests to your URL. Choose more than one so that you can distinguish problems in your website from network issues. You can select up to 16 locations.

> [!NOTE] 
> * We strongly recommend testing from multiple locations, to prevent false alarms resulting from transient issues with a specific location.
> * Enabling the "Parse dependent requests" option results in a stricter check. The test could fail for cases which may not be noticeable when manually browsing the site.

* **Success criteria**:

    **Test timeout**: Decrease this value to be alerted about slow responses. The test is counted as a failure if the responses from your site have not been received within this period. If you selected **Parse dependent requests**, then all the images, style files, scripts, and other dependent resources must have been received within this period.

    **HTTP response**: The returned status code that is counted as a success. 200 is the code that indicates that a normal web page has been returned.

    **Content match**: a string, like "Welcome!" We test that an exact case-sensitive match occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes you might have to update it.

## Multi-step web tests
You can monitor a scenario that involves a sequence of URLs. For example, if you are monitoring a sales website, you can test that adding items to the shopping cart works correctly.

> [!NOTE] 
> There is a charge for multi-step web tests. [Pricing scheme](http://azure.microsoft.com/pricing/details/application-insights/).
> 

To create a multi-step test, you record the scenario by using Visual Studio Enterprise, and then upload the recording to Application Insights. Application Insights replays the scenario at intervals and verifies the responses.

> [!NOTE]
> * You can't use coded functions or loops in your tests. The test must be contained completely in the .webtest script. However, you can use standard plugins.
> * Only English characters are supported in the multi-step web tests. If you use Visual Studio in other languages, please update the web test definition file to translate/exclude non-English characters.
>

#### 1. Record a scenario
Use Visual Studio Enterprise to record a web session.

1. Create a Web performance test project.

    ![In Visual Studio Enterprise edition, create a project from the Web Performance and Load Test template.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-create.png)

 * *Don't see the Web Performance and Load Test template?* - Close Visual Studio Enterprise. Open **Visual Studio Installer** to modify your Visual Studio Enterprise installation. Under **Individual Components**, select **Web Performance and load testing tools**.

2. Open the .webtest file and start recording.

    ![Open the .webtest file and click Record.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-start.png)
3. Do the user actions you want to simulate in your test: open your website, add a product to the cart, and so on. Then stop your test.

    ![The web test recorder runs in Internet Explorer.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-record.png)

    Don't make a long scenario. There's a limit of 100 steps and 2 minutes.
4. Edit the test to:

   * Add validations to check the received text and response codes.
   * Remove any superfluous interactions. You could also remove dependent requests for pictures or to ad or tracking sites.

     Remember that you can only edit the test script - you can't add custom code or call other web tests. Don't insert loops in the test. You can use standard web test plug-ins.
5. Run the test in Visual Studio to make sure it works.

    The web test runner opens a web browser and repeats the actions you recorded. Make sure it works as you expect.

    ![In Visual Studio, open the .webtest file and click Run.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-run.png)

#### 2. Upload the web test to Application Insights
1. In the Application Insights portal, create a web test.

    ![On the web tests blade, choose Add.](./media/app-insights-monitor-web-app-availability/16-another-test.png)
2. Select multi-step test, and upload the .webtest file.

    ![Select multi-step webtest.](./media/app-insights-monitor-web-app-availability/appinsights-71webtestUpload.png)

    Set the test locations, frequency, and alert parameters in the same way as for ping tests.

### Plugging time and random numbers into your multi-step test
Suppose you're testing a tool that gets time-dependent data such as stocks from an external feed. When you record your web test, you have to use specific times, but you set them as parameters of the test, StartTime and EndTime.

![A web test with parameters.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-parameters.png)

When you run the test, you'd like EndTime always to be the present time, and StartTime should be 15 minutes ago.

Web Test Plug-ins provide the way to do parameterize times.

1. Add a web test plug-in for each variable parameter value you want. In the web test toolbar, choose **Add Web Test Plugin**.

    ![Choose Add Web Test Plugin and select a type.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugins.png)

    In this example, we use two instances of the Date Time Plug-in. One instance is for "15 minutes ago" and another for "now."
2. Open the properties of each plug-in. Give it a name and set it to use the current time. For one of them, set Add Minutes = -15.

    ![Set name, Use Current Time, and Add Minutes.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugin-parameters.png)
3. In the web test parameters, use {{plug-in name}} to reference a plug-in name.

    ![In the test parameter, use {{plug-in name}}.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugin-name.png)

Now, upload your test to the portal. It uses the dynamic values on every run of the test.


## <a name="monitor"></a>See your availability test results

After a few minutes, click **Refresh** to see test results. 

![Summary results on the home blade](./media/app-insights-monitor-web-app-availability/14-availSummary-3.png)

The scatterplot shows samples of the test results that have diagnostic test-step detail in them. The test engine stores diagnostic detail for tests that have failures. For successful tests, diagnostic details are stored for a subset of the executions. Hover over any of the green/red dots to see the test timestamp, test duration, location, and test name. Click through any dot in the scatter plot to see the details of the test result.  

Select a particular test, location, or reduce the time period to see more results around the time period of interest. Use Search Explorer to see results from all executions, or use Analytics queries to run custom reports on this data.

In addition to the raw results, there are two Availability metrics in Metrics Explorer: 

1. Availability: Percentage of the tests that were successful, across all test executions. 
2. Test Duration: Average test duration across all test executions.

You can apply filters on the test name, location to analyze trends of a particular test and/or location.

## <a name="edit"></a> Inspect and edit tests

From the summary page, select a specific test. There, you can see its specific results, and edit or temporarily disable it.

![Edit or disable a web test](./media/app-insights-monitor-web-app-availability/19-availEdit-3.png)

You might want to disable availability tests or the alert rules associated with them while you are performing maintenance on your service. 

## <a name="failures"></a>If you see failures
Click a red dot.

![Click a red dot](./media/app-insights-monitor-web-app-availability/open-instance-3.png)

From an availability test result, you can see the transaction details across all components. Here you can:

* Inspect the response received from your server.
* Diagnose failure with correlated server side telemetry collected while processing the failed availability test.
* Log an issue or work item in Git or VSTS to track the problem. The bug will contain a link to this event.
* Open the web test result in Visual Studio.

Learn more about the end to end transaction diagnostics experience [here](app-insights-transaction-diagnostics.md).

Click on the exception row to see the details of the server side exception that caused the synthetic availability test to fail. You can also get the [debug snapshot](app-insights-snapshot-debugger.md) for richer code level diagnostics.

![Server side diagnostics](./media/app-insights-monitor-web-app-availability/open-instance-4.png)

## <a name="alerts"></a> Availability Alerts
You can have the following types of alert rules on Availability data using the classic alerts experience:
1. X out of Y locations reporting failures in a time period
2. Aggregate availability percentage drops under a threshold
3. Average test duration increases beyond a threshold

### Alert on X out of Y locations reporting failures
The X out of Y locations alert rule is enabled by default in the [new unified alerts experience](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts), when you create a new availability test. You can opt-out by selecting the "classic" option or choosing to disable the alert rule.

![Create experience](./media/app-insights-monitor-web-app-availability/appinsights-71webtestUpload.png)

**Important**: With the [new unified alerts](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts), the alert rule severity and notification preferences with [action groups](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-action-groups) **must be** configured in the alerts experience. Without the following steps, you will only receive in-portal notifications. 

1. After saving the availability test, click on the new test name to go to its details. Click on "edit alert"
![Edit after save](./media/app-insights-monitor-web-app-availability/editaftersave.png)

2. Set the desired severity level, rule description and most importantly - the action group that has the notification preferences you would like to use for this alert rule.
![Edit after save](./media/app-insights-monitor-web-app-availability/setactiongroup.png)


> [!NOTE]
> * Configure the action groups to receive notifications when the alert triggers by following the steps above. Without this step, you will only receive in-portal notifications when the rule triggers.
>
### Alert on availability metrics
Using the [new unified alerts](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts), you can alert on segmented aggregate availability and test duration metrics as well:

1. Select an Application Insights resource in the Metrics experience, and select an Availability metric:
    ![Availability metrics selection](./media/app-insights-monitor-web-app-availability/selectmetric.png)

2. Configure alerts option from the menu will take you to the new experience where you can select specific tests or locations to set up alert rule on. You can also configure the action groups for this alert rule here.
    ![Availability alerts configuration](./media/app-insights-monitor-web-app-availability/availabilitymetricalert.png)

### Alert on custom analytics queries
Using the [new unified alerts](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts), you can alert on [custom log queries](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log). With custom queries, you can alert on any arbitrary condition that helps you get the most reliable signal of availability issues. This is also particularly applicable, if you are sending custom availability results using the TrackAvailability SDK. 

> [!Tip]
> * The metrics on availability data include any custom availability results you may be submitting by calling our TrackAvailability SDK. You can use the alerting on metrics support to alert on custom availability results.
>

## Dealing with sign-in
If your users sign in to your app, you have various options for simulating sign-in so that you can test pages behind the sign-in. The approach you use depends on the type of security provided by the app.

In all cases, you should create an account in your application just for the purpose of testing. If possible, restrict the permissions of this test account so that there's no possibility of the web tests affecting real users.

### Simple username and password
Record a web test in the usual way. Delete cookies first.

### SAML authentication
Use the SAML plugin that is available for web tests.

### Client secret
If your app has a sign-in route that involves a client secret, use that route. Azure Active Directory (AAD) is an example of a service that provides a client secret sign-in. In AAD, the client secret is the App Key.

Here's a sample web test of an Azure web app using an app key:

![Client secret sample](./media/app-insights-monitor-web-app-availability/110.png)

1. Get token from AAD using client secret (AppKey).
2. Extract bearer token from response.
3. Call API using bearer token in the authorization header.

Make sure that the web test is an actual client - that is, it has its own app in AAD - and use its clientId + appkey. Your service under test also has its own app in AAD: the appID URI of this app is reflected in the web test in the “resource” field.

### Open Authentication
An example of open authentication is signing in with your Microsoft or Google account. Many apps that use OAuth provide the client secret alternative, so your first tactic should be to investigate that possibility.

If your test must sign in using OAuth, the general approach is:

* Use a tool such as Fiddler to examine the traffic between your web browser, the authentication site, and your app.
* Perform two or more sign-ins using different machines or browsers, or at long intervals (to allow tokens to expire).
* By comparing different sessions, identify the token passed back from the authenticating site, that is then passed to your app server after sign-in.
* Record a web test using Visual Studio.
* Parameterize the tokens, setting the parameter when the token is returned from the authenticator, and using it in the query to the site.
  (Visual Studio attempts to parameterize the test, but does not correctly parameterize the tokens.)

## Performance tests
You can run a load test on your website. Like the availability test, you can send either simple requests or multi-step requests from our points around the world. Unlike an availability test, many requests are sent, simulating multiple simultaneous users.

From the Overview blade, open **Settings**, **Performance Tests**. When you create a test, you are invited to connect to or create a Azure DevOps account.

When the test is complete, you are shown response times and success rates.


![Performance test](./media/app-insights-monitor-web-app-availability/perf-test.png)

> [!TIP]
> To observe the effects of a performance test, use [Live Stream](app-insights-live-stream.md) and [Profiler](app-insights-profiler.md).
>

## Automation
* [Use PowerShell scripts to set up an availability test](app-insights-powershell.md#add-an-availability-test) automatically.
* Set up a [webhook](../monitoring-and-diagnostics/insights-webhooks-alerts.md) that is called when an alert is raised.

## <a name="qna"></a> FAQ

* *Site looks okay but I see test failures? Why is Application Insights alerting me?*

    * Does your test have "Parse dependent requests" enabled? That results in a strict check on resources such as scripts, images etc. These types of failures may not be noticeable on a browser. Check all the images, scripts, style sheets, and any other files loaded by the page. If any of them fails, the test is reported as failed, even if the main html page loads OK. To desensitize the test to such resource failures, simply uncheck the "Parse Dependent Requests" from the test configuration. 

    * To reduce odds of noise from transient network blips etc., ensure "Enable retries for test failures" configuration is checked. You can also test from more locations and manage alert rule threshold accordingly to prevent location specific issues causing undue alerts.

    * Click on any of the red dots from the Availability experience, or any availability failure from the Search explorer to see the details of why we reported the failure. The test result, along with the correlated server side telemetry (if enabled) should help understand why the test failed. Common causes of transient issues are network or connection issues. 

    * Did the test time-out? We abort tests after 2 minutes. If your ping or multi-step test takes longer than 2 minutes, we will report it as a failure. Consider breaking the test into multiple ones that can complete in shorter durations.

    * Did all locations report failure, or only some of them? If only some reported failures, it may be due to network/CDN issues. Again, clicking on the red dots should help understand why the location reported failures.

* *I did not get an email when the alert triggered, or resolved or both?*

    Check the classic alerts configuration to confirm your email is directly listed, or a distribution list you are on is configured to receive notifications. If it is, then check the distribution list configuration to confirm it can receive external emails. Also check if your mail administrator may have any policies configured that may cause this issue.

* *I did not receive the webhook notification?*

    Check to ensure the application receiving the webhook notification is available, and successfully processes the webhook requests. See [this](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitor-alerts-unified-log-webhook) for more information.

* *Intermittent test failure with a protocol violation error?*

    The error ("protocol violation..CR must be followed by LF") indicates an issue with the server (or dependencies). This happens when malformed headers are set in the response. It can be caused by load balancers or CDNs. Specifically, some headers might not be using CRLF to indicate end-of-line, which violates the HTTP specification and therefore fail validation at the .NET WebRequest level. Inspect the response to spot headers which might be in violation.
    
    Note: The URL may not fail on browsers that have a relaxed validation of HTTP headers. See this blog post for a detailed explanation of this issue: http://mehdi.me/a-tale-of-debugging-the-linkedin-api-net-and-http-protocol-violations/  
    
* *I don't see any related server side telemetry to diagnose test failures?*
    
    If you have Application Insights set up for your server-side application, that may be because [sampling](app-insights-sampling.md) is in operation. Select a different availability result.

* *Can I call code from my web test?*

    No. The steps of the test must be in the .webtest file. And you can't call other web tests or use loops. But there are several plug-ins that you might find helpful.

* *Is HTTPS supported?*

    We support TLS 1.1 and TLS 1.2.
* *Is there a difference between "web tests" and "availability tests"?*

    The two terms may be referenced interchangeably. Availability tests is a more generic term that includes the single URL ping tests in addition to the multi-step web tests.
    
* *I'd like to use availability tests on our internal server that runs behind a firewall.*

    There are two possible solutions:
    
    * Configure your firewall to permit incoming requests from the [IP addresses
    of our web test agents](app-insights-ip-addresses.md).
    * Write your own code to periodically test your internal server. Run the code as a background process on a test server behind your firewall. Your test process can send its results to Application Insights by using [TrackAvailability()](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) API in the core SDK package. This requires your test server to have outgoing access to the Application Insights ingestion endpoint, but that is a much smaller security risk than the alternative of permitting incoming requests. The results will not appear in the availability web tests blades, but appears as availability results in Analytics, Search, and Metric Explorer.

* *Uploading a multi-step web test fails*

    Some reasons this might happen:
    * There's a size limit of 300 K.
    * Loops aren't supported.
    * References to other web tests aren't supported.
    * Data sources aren't supported.

* *My multi-step test doesn't complete*

    There's a limit of 100 requests per test. Also, the test is stopped if it runs longer than two minutes.

* *How can I run a test with client certificates?*

    We don't support that, sorry.


## <a name="next"></a>Next steps
[Search diagnostic logs][diagnostic]

[Troubleshooting][qna]

[IP addresses of web test agents](app-insights-ip-addresses.md)

<!--Link references-->

[azure-availability]: ../insights-create-web-tests.md
[diagnostic]: app-insights-diagnostic-search.md
[qna]: app-insights-troubleshoot-faq.md
[start]: app-insights-overview.md
