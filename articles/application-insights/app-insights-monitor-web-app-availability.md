<properties
	pageTitle="Monitor availability and responsiveness of any web site | Microsoft Azure"
	description="Set up web tests in Application Insights. Get alerts if a website becomes unavailable or responds slowly."
	services="application-insights"
    documentationCenter=""
	authors="alancameronwills"
	manager="douge"/>

<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="04/18/2016"
	ms.author="awills"/>

# Monitor availability and responsiveness of any web site

After you've deployed your web application, you can set up web tests to monitor its availability and responsiveness. Application Insights will send web requests at regular intervals from points around the world, and can alert you if your application responds slowly or not at all.

![Web test example](./media/app-insights-monitor-web-app-availability/appinsights-10webtestresult.png)

You can set up web tests for any HTTP or HTTPS endpoint that is accessible from the public internet.

There are two types of web test:

* [URL ping test](#set-up-a-url-ping-test): a simple test that you can create in the Azure portal.
* [Multi-step web test](#multi-step-web-tests): which you create in Visual Studio Ultimate or Visual Studio Enterprise and upload to the portal.

You can create up to 10 web tests per application resource.


## Set up a URL ping test

### <a name="create"></a>1. Create a new resource?

Skip this step if you've already [set up an Application Insights resource][start] for this application, and you want to see the availability data in the same place.

Sign up to [Microsoft Azure](http://azure.com), go to the [Azure portal](https://portal.azure.com), and create a new Application Insights resource.

![New > Application Insights](./media/app-insights-monitor-web-app-availability/11-new-app.png)

The Overview blade for the new resource will open. To find this at any time in the [Azure portal](https://portal.azure.com), click **Browse**.

### <a name="setup"></a>2. Create a web test

In your Application Insights resource, look for the Availability tile. Click it to open the Web tests blade for your application, and add a web test.

![Fill at least the URL of your website](./media/app-insights-monitor-web-app-availability/13-availability.png)

- **The URL** must be visible from the public internet. It can include a query string&#151;so, for example, you can exercise your database a little. If the URL resolves to a redirect, we will follow it up to 10 redirects.
- **Parse dependent requests**: Images, scripts, style files, and other resources of the page are requested as part of the test. The test will fail if all these resources cannot be successfully downloaded within the timeout for the whole test.
- **Enable retries**:  When the test fails, it is retried after a short interval. A failure is reported only if three successive attempts fail. Subsequent tests are then performed at the usual test frequency. Retry is temporarily suspended until the next success. This rule is applied independently at each test location. (We recommend this setting. On average, about 80% of failures disappear on retry.)
- **Test frequency**: Sets how often the test is run from each test location. With a frequency of 5 minutes and five test locations, your site will be tested on average every minute.
- **Test locations** are the places from where our servers send web requests to your URL. Choose more than one so that you can distinguish problems in your website from network issues. You can select up to 16 locations.

- **Success criteria**:

    **Test timeout**: Decrease this to be alerted about slow responses. The test is counted as a failure if the responses from your site have not been received within this period. If you selected **Parse dependent requests**, then all the images, style files, scripts and other dependent resources must have been received within this period.

    **HTTP response**: The returned status code that is counted as a success. 200 is the code that indicates that a normal web page has been returned.

    **Content match**: a string, like "Welcome!" We'll test that it occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes you might have to update it.


- **Alerts** are, by default, sent to you if there are failures in three locations over five minutes. A failure in one location is likely to be a network problem, and not a problem with your site. But you can change the threshold to be more or less sensitive, and you can also change who the emails should be sent to.

    You can set up a [webhook](../azure-portal/insights-webhooks-alerts.md) that is called when an alert is raised.

#### Test more URLs

Add more tests. For example, as well as testing your home page, you can make sure your database is running by testing the URL for a search.


### <a name="monitor"></a>3. View availability reports

After 1-2 minutes, click **Refresh** on the availability/web tests blade. (It doesn't refresh automatically.)

![Summary results on the home blade](./media/app-insights-monitor-web-app-availability/14-availSummary.png)

Click any bar on the summary chart at the top for a more detailed view of that time period.

These charts combine results for all the web tests of this application.

#### Components of your web page

Images, style sheets and scripts and other static components of the web page you're testing are requested as part of the test.  

The recorded response time is the time taken for all the components to complete loading.

If any component fails to load, the test is marked failed.

## <a name="failures"></a>If you see failures...

Click a red dot.

![Click a red dot](./media/app-insights-monitor-web-app-availability/14-availRedDot.png)

Or, scroll down and click a test where you see less than 100% success.

![Click a specific webtest](./media/app-insights-monitor-web-app-availability/15-webTestList.png)

This shows you the results for that test.

![Click a specific webtest](./media/app-insights-monitor-web-app-availability/16-1test.png)

The test is run from several locations&#151;pick one where the results are less than 100%.

![Click a specific webtest](./media/app-insights-monitor-web-app-availability/17-availViewDetails.png)


Scroll down to **Failed tests** and pick a result.

Click the result to evaluate it in the portal and see why it failed.

![Webtest run result](./media/app-insights-monitor-web-app-availability/18-availDetails.png)


Alternatively, you can download the result file and inspect it in Visual Studio.


*Looks OK but reported as a failure?* Check all the images, scripts, style sheets and any other files loaded by the page. If any of them fails, the test will be reported as failed, even if the main html page loads OK.



## Multi-step web tests

You can monitor a scenario that involves a sequence of URLs. For example, if you are monitoring a sales website, you can test that adding items to the shopping cart works correctly.

To create a multi-step test, you record the scenario by using Visual Studio, and then upload the recording to Application Insights. Application Insights will replay the scenario at intervals and verify the responses.

Note that you can't use coded functions in your tests: the scenario steps must be contained as a script in the .webtest file.

#### 1. Record a scenario

Use Visual Studio Enterprise or Ultimate to record a web session. 

1. Create a web performance test project.

    ![In Visual Studio, create a new project from the Web Performance and Load Test template.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-create.png)

2. Open the .webtest file and start recording.

    ![Open the .webtest file and click Record.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-start.png)

3. Do the user actions you want to simulate in your test: open your website, add a product to the cart, and so on. Then stop your test.

    ![The web test recorder runs in Internet Explorer.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-record.png)

    Don't make a long scenario. There's a limit of 100 steps and 2 minutes.

4. Edit the test to:
 - Add validations to check the received text and response codes.
 - Remove any superfluous interactions. You could also remove dependent requests for pictures or to ad or tracking sites.

    Remember that you can only edit the test script - you can't add custom code or call other web tests. Don't insert loops in the test. You can use standard web test plug-ins.

5. Run the test in Visual Studio to make sure it works.

    The web test runner opens a web browser and repeats the actions you recorded. Make sure it works as you expect.

    ![In Visual Studio, open the .webtest file and click Run.](./media/app-insights-monitor-web-app-availability/appinsights-71webtest-multi-vs-run.png)


#### 2. Upload the web test to Application Insights

1. In the Application Insights portal, create a new web test.

    ![On the web tests blade, choose Add.](./media/app-insights-monitor-web-app-availability/16-another-test.png)

2. Select multi-step test, and upload the .webtest file.

    ![Select multi-step webtest.](./media/app-insights-monitor-web-app-availability/appinsights-71webtestUpload.png)

    Set the test locations, frequency, and alert parameters in the same way as for ping tests.

View your test results and any failures in the same way as for single-url tests.

A common reason for failure is that the test runs too long. It mustn't run longer than two minutes.

Don't forget that all the resources of a page must load correctly for the test to succeed, including scripts, style sheets, images and so forth.

Note that the web test must be entirely contained in the .webtest file: you can't use coded functions in the test.


### Plugging time and random numbers into your multi-step test

Suppose you're testing a tool that gets time-dependent data such as stocks from an external feed. When you record your web test, you have to use specific times, but you set them as parameters of the test, StartTime and EndTime.

![A web test with parameters.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-parameters.png)

When you run the test, you'd like EndTime always to be the present time, and StartTime should be 15 minutes ago.

Web Test Plug-ins provide the way to do this.

1. Add a web test plug-in for each variable parameter value you want. In the web test toolbar, choose **Add Web Test Plugin**.

    ![Choose Add Web Test Plugin and select a type.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugins.png)

    In this example, we'll use two instances of the Date Time Plug-in. One instance is for "15 minutes ago" and another for "now".

2. Open the properties of each plug-in. Give it a name and set it to use the current time. For one of them, set Add Minutes = -15.

    ![Set name, Use Current Time, and Add Minutes.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugin-parameters.png)

3. In the web test parameters, use {{plug-in name}} to reference a plug-in name.

    ![In the test parameter, use {{plug-in name}}.](./media/app-insights-monitor-web-app-availability/appinsights-72webtest-plugin-name.png)

Now, upload your test to the portal. It will use the dynamic values on every run of the test.

## Dealing with sign-in

If your users sign in to your app, you have a number of options for simulating sign-in so that you can test pages behind the sign-in. The approach you use depends on the type of security provided by the app.

In all cases, you should create an account just for the purpose of testing. If possible, restrict its permissions so that it's read-only.

* Simple username and password: Just record a web test in the usual way. Delete cookies first.
* SAML authentication. For this, you can use the SAML plugin that is available for web tests.
* Client secret: If your app has a sign-in route that involves a client secret, use that. Azure Active Directory provides this. 
* Open Authentication - for example, signing in with your Microsoft or Google account. Many apps that use OAuth provide the client secret alternative, so the first tactic is to investigate that. If your test has to sign in using OAuth, the general approach is:
 * Use a tool such as Fiddler to examine the traffic between your web browser, the authentication site, and your app. 
 * Perform two or more sign-ins using different machines or browsers, or at long intervals (to allow tokens to expire).
 * By comparing different sessions, identify the token passed back from the authenticating site, that is then passed to your app server after sign-in. 
 * Record a web test using Visual Studio. 
 * Parameterize the tokens, setting the parameter when the token is returned from the authenticator, and using it in the query to the site.
 (Visual Studio will attempt to parameterize the test, but will not correctly parameterize the tokens.)


## <a name="edit"></a> Edit or disable a test

Open an individual test to edit or disable it.

![Edit or disable a web test](./media/app-insights-monitor-web-app-availability/19-availEdit.png)

You might want to disable web tests while you are performing maintenance on your service.

## Automation

* [Use PowerShell scripts to set up a web test](https://azure.microsoft.com/blog/creating-a-web-test-alert-programmatically-with-application-insights/) automatically. 
* Set up a [webhook](../azure-portal/insights-webhooks-alerts.md) that is called when an alert is raised.

## Questions? Problems?

* *Can I call code from my web test?*

    No. The steps of the test must be in the .webtest file. And you can't call other web tests or use loops. But there are a number of plug-ins that you might find helpful.

* *Is HTTPS supported?*

    Currently, we support SSL 3.0 and TLS 1.0.

* *Is there a difference between "web tests" and "availability tests"?*

    We use the two terms interchangeably.

* *I'd like to use availability tests on our internal server that runs behind a firewall.*

    Configure your firewall to permit requests from the IP addresses in the list at the end of this article.

## <a name="video"></a>Video

> [AZURE.VIDEO monitoring-availability-with-application-insights]

## <a name="next"></a>Next steps

[Search diagnostic logs][diagnostic]

[Troubleshooting][qna]


## IP Addresses of web tests

If you need to open a firewall to allow web tests, here's the current list of IP addresses. It might change from time to time.

Open ports 80 (http) and 443 (https).

```

213.199.178.54
213.199.178.55
213.199.178.56
213.199.178.61
213.199.178.57
213.199.178.58
213.199.178.59
213.199.178.60
213.199.178.63
213.199.178.64
207.46.98.158
207.46.98.159
207.46.98.160
207.46.98.157
207.46.98.152
207.46.98.153
207.46.98.156
207.46.98.162
207.46.98.171
207.46.98.172
65.55.244.40
65.55.244.17
65.55.244.42
65.55.244.37
65.55.244.15
65.55.244.16
65.55.244.44
65.55.244.18
65.55.244.46
65.55.244.47
207.46.14.60
207.46.14.61
207.46.14.62
207.46.14.55
207.46.14.63
207.46.14.64
207.46.14.51
207.46.14.52
207.46.14.56
207.46.14.65
157.55.14.60
157.55.14.61
157.55.14.62
157.55.14.47
157.55.14.64
157.55.14.65
157.55.14.43
157.55.14.44
157.55.14.49
157.55.14.50
65.54.66.56
65.54.66.57
65.54.66.58
65.54.66.61
207.46.71.54
207.46.71.52
207.46.71.55
207.46.71.38
207.46.71.51
207.46.71.57
207.46.71.58
207.46.71.37
202.89.228.67
202.89.228.68
202.89.228.69
202.89.228.57
65.54.78.49
65.54.78.50
65.54.78.51
65.54.78.54
94.245.82.32
94.245.82.33
94.245.82.37
94.245.82.38
94.245.72.44
94.245.72.45
94.245.72.46
94.245.72.49
207.46.56.57
207.46.56.58
207.46.56.59
207.46.56.67
207.46.56.61
207.46.56.62
207.46.56.63
207.46.56.64
65.55.82.84
65.55.82.85
65.55.82.86
65.55.82.81
65.55.82.87
65.55.82.88
65.55.82.89
65.55.82.90
65.55.82.91
65.55.82.92
94.245.78.40
94.245.78.41
94.245.78.42
94.245.78.45
70.37.147.43
70.37.147.44
70.37.147.45
70.37.147.48
94.245.66.43
94.245.66.44
94.245.66.45
94.245.66.48

```


<!--Link references-->

[azure-availability]: ../insights-create-web-tests.md
[diagnostic]: app-insights-diagnostic-search.md
[qna]: app-insights-troubleshoot-faq.md
[start]: app-insights-overview.md
