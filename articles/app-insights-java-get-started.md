<properties 
	pageTitle="Get started with Application Insights in a Java web project" 
	description="Monitor performance and usage of your Java website with Application Insights" 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-01-29" 
	ms.author="awills"/>
 
# Get started with Application Insights in a Java web project

By adding Application Insights to your project, you can detect and diagnose performance issues and exceptions.

In addition, you can set up web tests to monitor your application's availability, and insert code into your web pages to understand usage patterns.

You'll need:

* Oracle JRE 1.6 or later
* A subscription to [Microsoft Azure](http://azure.microsoft.com/). (You could start with the [free trial](http://azure.microsoft.com/pricing/free-trial/).)

## Add Application Insights to your Java project

(There will soon be plug-ins for Eclipse and IntelliJ to automate these steps, but for now you'll have to do them manually.)

### Get an Application Insights instrumentation key

1. Log into the [Microsoft Azure Portal](https://portal.azure.com)
2. Create a new Application Insights resource

    ![Click + and choose Application Insights](./media/app-insights-java-get-started/01-create.png)
3. Set the application type to Java web application.

    ![Fill a name, choose Java web app, and click Create](./media/app-insights-java-get-started/02-create.png)
4. Find the instrumentation key of the new resource. You'll need to paste this into your code project shortly.

    ![In the new resource overview, click Properties and copy the Instrumentation Key](./media/app-insights-java-get-started/03-key.png)

### Add the Application Insights SDK for Java to your project

*Choose the appropriate way for your project.*

#### If you're using Maven...

If your project is already set up to use Maven for build, merge the following snippet of code to your pom.xml file.

Then refresh the project dependencies, to get the binaries downloaded.

    <repositories>
       <repository>
          <id>central</id>
          <name>Central</name>
          <url>http://repo1.maven.org/maven2</url>
       </repository>
    </repositories>

    <dependencies>
       <dependency>
         <groupId>com.microsoft.azure</groupId>
         <artifactId>applicationinsights-core</artifactId>
         <version>[0.9,)</version>
      </dependency>
    </ dependencies>

#### If you're using Gradle...

If your project is already set up to use Gradle for build, merge the following snippet of code to your build.gradle file.

Then refresh the project dependencies, to get the binaries downloaded.

    repositories {
      mavenCentral()
    }

    dependencies {
      compile group: 'com.microsoft.azure', name: 'applicationinsights-core', version: '0.9.+'
    }

#### Otherwise ...

Manually add the SDK:

1. Download the [Azure Libraries for Java](http://dl.msopentech.com/lib/PackageForWindowsAzureLibrariesForJava.html)
2. Extract the following binaries from the zip file, and add them to your project:
 * commons-codec
 * commons-io
 * commons-lang
 * commons-logging
 * guava
 * httpclient
 * httpcore
 * jsr305

### Add an Application Insights configuration file to your project
Add ApplicationInsights.xml to the resources folder in your project. Copy into it the following XML: 

    <?xml version="1.0" encoding="utf-8"?>
    <ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings" schemaVersion="2014-05-30">
      <InstrumentationKey>** Your instrumentation key **</InstrumentationKey>
    </ApplicationInsights>

Substitute the instrumentation key that you got from the Azure portal.

The key is sent along with every item of telemetry and tells Application Insights to display it in your resource.

## Send telemetry from your server using the API

Insert a few lines of code in your Java web application to find out what users are doing with it. You can track events, metrics and exceptions.

#### Import the namespace

    import com.microsoft.applicationinsights.TelemetryClient;

#### Track metrics

Metrics are aggregated in the portal and displayed in graphical form. For example, to see the average score that users achieve in a game:

    TelemetryClient client = new TelemetryClient();
    client.trackMetric("Score", 2.1);

#### Track events

Events can be displayed on the portal as an aggregated count, and you can also display individual occurrences. For example, to see how many games have been won:

    TelemetryClient client = new TelemetryClient();
    client.trackEvent("WinGame");

#### Track exceptions

Exception telemetry allows you to see how often different types of exceptions have occurred. You can also investigate the stack trace of individual exceptions:


    TelemetryClient client = new TelemetryClient();

    try {
       ...
    } catch (Exception e) {
      client.trackException(e);
    }

#### Trace logs

You can [capture logs using your logging framework][javalogs] and search and filter the logs in Application Insights, along with custom events and exception reports. This is a powerful diagnostic tool.

Or you can use the Application Insights trace API directly:
    TelemetryClient client = new TelemetryClient();
    client.trackTrace ("Log entry");

#### Attach properties and measurements to telemetry

You can add property values to any of the above events and other types. As well as carrying extra data, the properties can be used to [filter][diagnostics] and [segment][metrics] the events in Application Insights. 

For example:

    TelemetryClient telemetry = new TelemetryClient();
    
    Map<String, String> properties = new HashMap<String, String>();
    properties.put("game", currentGame.getName());
    properties.put("difficulty", currentGame.getDifficulty());
    
    Map<String, Double> measurements = new HashMap<String, Double>();
    measurements.put("Score", currentGame.getScore());
    measurements.put("Opponents", currentGame.getOpponentCount());
    
    telemetry.trackEvent("WinGame", properties, measurements);

## View your results in Application Insights

Run your application.

Return to your Application Insights resource in Microsoft Azure.

Data will appear on the overview blade. (If it isn't there, wait a few seconds and then click Refresh.)

![Click through to more data](./media/appinsights/appinsights-gs-r-10-java.png)

Click through any chart to see more detailed metrics. [Learn more about metrics.][perf]

## Next steps

#### Detect and diagnose issues

* [Set up web tests][availability] to make sure your application stays live and responsive.
* [Add web client telemetry][usage] to see exceptions in web page code and to let you insert trace calls.
* [Search events and logs][diagnostic] to help diagnose problems.
* [Capture Log4J or Logback traces][javalogs]

#### Track usage

* [Add web client telemetry][usage] to monitor page views and basic user metrics.
* [Track custom events and metrics][track] to learn about how your application is used.


[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




