---
title: Java web app analytics with Azure Application Insights | Microsoft Docs
description: 'Application Performance Monitoring for Java web apps with Application Insights. '
services: application-insights
documentationcenter: java
author: lgayhardt
manager: carmonm

ms.assetid: 051d4285-f38a-45d8-ad8a-45c3be828d91
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: lagayhar

---
# Get started with Application Insights in a Java web project


[Application Insights](https://azure.microsoft.com/services/application-insights/) is an extensible analytics service for web developers that helps you understand the performance and usage of your live application. Use it to [detect and diagnose performance issues and exceptions](app-insights-detect-triage-diagnose.md), and [write code][api] to track what users do with your app.

![Screenshot of overview sample data](./media/app-insights-java-get-started/overview-graphs.png)

Application Insights supports Java apps running on Linux, Unix, or Windows.

You need:

* JRE version 1.7 or 1.8
* A subscription to [Microsoft Azure](https://azure.microsoft.com/).

*If you have a web app that's already live, you could follow the alternative procedure to [add the SDK at runtime in the web server](app-insights-java-live.md). That alternative avoids rebuilding the code, but you don't get the option to write code to track user activity.*

If you prefer the Spring framework try the [configure a Spring Boot initializer app to use Application Insights guide](https://docs.microsoft.com/java/azure/spring-framework/configure-spring-boot-java-applicationinsights)

## 1. Get an Application Insights instrumentation key
1. Sign in to the [Microsoft Azure portal](https://portal.azure.com).
2. Create an Application Insights resource. Set the application type to Java web application.

    ![Fill a name, choose Java web app, and click Create](./media/app-insights-java-get-started/02-create.png)
3. Find the instrumentation key of the new resource. You'll need to paste this key into your code project shortly.

    ![In the new resource overview, click Properties and copy the Instrumentation Key](./media/app-insights-java-get-started/03-key.png)

## 2. Add the Application Insights SDK for Java to your project
*Choose the appropriate way for your project.*

#### If you're using Maven... <a name="maven-setup" />
If your project is already set up to use Maven for build, merge the following code to your pom.xml file.

Then, refresh the project dependencies to get the binaries downloaded.

```XML

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
        <artifactId>applicationinsights-web</artifactId>
        <!-- or applicationinsights-core for bare API -->
        <version>[2.0,)</version>
      </dependency>
    </dependencies>
```

* *Build or checksum validation errors?* Try using a specific version, such as: `<version>2.0.n</version>`. You'll find the latest version in the [SDK release notes](https://github.com/Microsoft/ApplicationInsights-Java#release-notes) or in the [Maven artifacts](http://search.maven.org/#search%7Cga%7C1%7Capplicationinsights).
* *Need to update to a new SDK?* Refresh your project's dependencies.

#### If you're using Gradle... <a name="gradle-setup" />
If your project is already set up to use Gradle for build, merge the following code to your build.gradle file.

Then refresh the project dependencies to get the binaries downloaded.

```gradle

    repositories {
      mavenCentral()
    }

    dependencies {
      compile group: 'com.microsoft.azure', name: 'applicationinsights-web', version: '2.+'
      // or applicationinsights-core for bare API
    }
```

#### If you're using Eclipse to create a Dynamic Web project ...
Use the [Application Insights SDK for Java plug-in][eclipse]. Note: even though using this plugin will get you up and running with Application Insights quicker (assuming you're not using Maven/Gradle), it is not a dependency management system. As such, updating the plugin will not automatically update the Application Insights libraries in your project.

* *Build or checksum validation errors?* Try using a specific version, such as: `version:'2.0.n'`. You'll find the latest version in the [SDK release notes](https://github.com/Microsoft/ApplicationInsights-Java#release-notes) or in the [Maven artifacts](http://search.maven.org/#search%7Cga%7C1%7Capplicationinsights).
* *To update to a new SDK* Refresh your project's dependencies.

#### Otherwise, if you are manually managing dependencies ...
Download the [latest version](https://github.com/Microsoft/ApplicationInsights-Java/releases/latest) and copy the necessary files into your project, replacing any previous versions.

### Questions...
* *What's the relationship between the `-core` and `-web` components?*
  * `applicationinsights-core` gives you the bare API. You always need this component.
  * `applicationinsights-web` gives you metrics that track HTTP request counts and response times. You can omit this component if you don't want this telemetry automatically collected. For example, if you want to write your own.
  
* *How should I update the SDK to the latest version?*
  * If you are using Gradle or Maven...
    * Update your build file to specify the latest version or use Gradle/Maven's wildcard syntax to include the latest version automatically. Then, refresh your project's dependencies. The wildcard syntax can be seen in the examples above for [Gradle](#gradle-setup) or [Maven](#maven-setup).
  * If you are manually managing dependencies...
    * Download the latest [Application Insights SDK for Java](https://github.com/Microsoft/ApplicationInsights-Java/releases/latest) and replace the old ones. Changes are described in the [SDK release notes](https://github.com/Microsoft/ApplicationInsights-Java#release-notes).

## 3. Add an ApplicationInsights.xml file
Add ApplicationInsights.xml to the resources folder in your project, or make sure it is added to your project’s deployment class path. Copy the following XML into it.

Substitute the instrumentation key that you got from the Azure portal.

```XML

    <?xml version="1.0" encoding="utf-8"?>
    <ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings" schemaVersion="2014-05-30">


      <!-- The key from the portal: -->
      <InstrumentationKey>** Your instrumentation key **</InstrumentationKey>


      <!-- HTTP request component (not required for bare API) -->
      <TelemetryModules>
        <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebRequestTrackingTelemetryModule"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebSessionTrackingTelemetryModule"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebUserTrackingTelemetryModule"/>
      </TelemetryModules>

      <!-- Events correlation (not required for bare API) -->
      <!-- These initializers add context data to each event -->

      <TelemetryInitializers>
        <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationIdTelemetryInitializer"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationNameTelemetryInitializer"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebSessionTelemetryInitializer"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserTelemetryInitializer"/>
        <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserAgentTelemetryInitializer"/>

      </TelemetryInitializers>
    </ApplicationInsights>
```

Optionally, the configuration file can reside in any location accessible to your application.  The system property `-Dapplicationinsights.configurationDirectory` specifies the directory that contains ApplicationInsights.xml. For example, a configuration file located at `E:\myconfigs\appinsights\ApplicationInsights.xml` would be configured with the property `-Dapplicationinsights.configurationDirectory="E:\myconfigs\appinsights"`.

* The instrumentation key is sent along with every item of telemetry and tells Application Insights to display it in your resource.
* The HTTP Request component is optional. It automatically sends telemetry about requests and response times to the portal.
* Event correlation is an addition to the HTTP request component. It assigns an identifier to each request received by the server, and adds this identifier as a property to every item of telemetry as the property 'Operation.Id'. It allows you to correlate the telemetry associated with each request by setting a filter in [diagnostic search][diagnostic].

### Alternative ways to set the instrumentation key
Application Insights SDK looks for the key in this order:

1. System property: -DAPPLICATION_INSIGHTS_IKEY=your_ikey
2. Environment variable: APPLICATION_INSIGHTS_IKEY
3. Configuration file: ApplicationInsights.xml

You can also [set it in code](app-insights-api-custom-events-metrics.md#ikey):

```Java
    TelemetryConfiguration.getActive().setInstrumentationKey(iKey);
```

## 4. Add an HTTP filter
The last configuration step allows the HTTP request component to log each web request. (Not required if you just want the bare API.)

### Spring Boot Applications
Register the Application Insights `WebRequestTrackingFilter` in your Configuration class:

```Java
package <yourpackagename>.configurations;

import javax.servlet.Filter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import com.microsoft.applicationinsights.TelemetryConfiguration;
import com.microsoft.applicationinsights.web.internal.WebRequestTrackingFilter;

@Configuration
public class AppInsightsConfig {

    @Bean
    public String telemetryConfig() {
        String telemetryKey = System.getenv("<instrumentation key>");
        if (telemetryKey != null) {
            TelemetryConfiguration.getActive().setInstrumentationKey(telemetryKey);
        }
        return telemetryKey;
    }

    /**
     * Programmatically registers a FilterRegistrationBean to register WebRequestTrackingFilter
     * @param webRequestTrackingFilter
     * @return Bean of type {@link FilterRegistrationBean}
     */
    @Bean
    public FilterRegistrationBean webRequestTrackingFilterRegistrationBean(WebRequestTrackingFilter webRequestTrackingFilter) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(webRequestTrackingFilter);
        registration.addUrlPatterns("/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);
        return registration;
    }


    /**
     * Creates bean of type WebRequestTrackingFilter for request tracking
     * @param applicationName Name of the application to bind filter to
     * @return {@link Bean} of type {@link WebRequestTrackingFilter}
     */
    @Bean
    @ConditionalOnMissingBean

    public WebRequestTrackingFilter webRequestTrackingFilter(@Value("${spring.application.name:application}") String applicationName) {
        return new WebRequestTrackingFilter(applicationName);
    }


}
```

> [!NOTE]
> If you're using Spring Boot 1.3.8 or older replace the FilterRegistrationBean with the line below

```Java
    import org.springframework.boot.context.embedded.FilterRegistrationBean;
```

This class will configure the `WebRequestTrackingFilter` to be the first filter on the http filter chain. It will also pull the instrumentation key from the operating system environment variable if it is available.

> We are using the web http filter configuration rather than the Spring MVC configuration because this is a Spring Boot application, and it has its own Spring MVC configuration. See the sections below for Spring MVC specific configuration.

### Applications Using Web.xml
Locate and open the web.xml file in your project, and merge the following code under the web-app node, where your application filters are configured.

To get the most accurate results, the filter should be mapped before all other filters.

```XML

    <filter>
      <filter-name>ApplicationInsightsWebFilter</filter-name>
      <filter-class>
        com.microsoft.applicationinsights.web.internal.WebRequestTrackingFilter
      </filter-class>
    </filter>
    <filter-mapping>
       <filter-name>ApplicationInsightsWebFilter</filter-name>
       <url-pattern>/*</url-pattern>
    </filter-mapping>

   <!-- This listener handles shutting down the TelemetryClient when an application/servlet is undeployed. -->
    <listener>
      <listener-class>com.microsoft.applicationinsights.web.internal.ApplicationInsightsServletContextListener</listener-class>
    </listener>
```

#### If you're using Spring Web MVC 3.1 or later
Edit these elements in *-servlet.xml to include the Application Insights package:

```XML

    <context:component-scan base-package=" com.springapp.mvc, com.microsoft.applicationinsights.web.spring"/>

    <mvc:interceptors>
        <mvc:interceptor>
            <mvc:mapping path="/**"/>
            <bean class="com.microsoft.applicationinsights.web.spring.RequestNameHandlerInterceptorAdapter" />
        </mvc:interceptor>
    </mvc:interceptors>
```

#### If you're using Struts 2
Add this item to the Struts configuration file (usually named struts.xml or struts-default.xml):

```XML

     <interceptors>
       <interceptor name="ApplicationInsightsRequestNameInterceptor" class="com.microsoft.applicationinsights.web.struts.RequestNameInterceptor" />
     </interceptors>
     <default-interceptor-ref name="ApplicationInsightsRequestNameInterceptor" />
```

If you have interceptors defined in a default stack, the interceptor can be added to that stack.

## 5. Run your application
Either run it in debug mode on your development machine, or publish to your server.

## 6. View your telemetry in Application Insights
Return to your Application Insights resource in [Microsoft Azure portal](https://portal.azure.com).

HTTP requests data appears on the overview blade. (If it isn't there, wait a few seconds and then click Refresh.)

![sample data](./media/app-insights-java-get-started/5-results.png)

[Learn more about metrics.][metrics]

Click through any chart to see more detailed aggregated metrics.

![](./media/app-insights-java-get-started/6-barchart.png)

> Application Insights assumes the format of HTTP requests for MVC applications is: `VERB controller/action`. For example, `GET Home/Product/f9anuh81`, `GET Home/Product/2dffwrf5` and `GET Home/Product/sdf96vws` are grouped into `GET Home/Product`. This grouping enables meaningful aggregations of requests, such as number of requests and average execution time for requests.
>
>

### Instance data
Click through a specific request type to see individual instances.

Two kinds of data are displayed in Application Insights: aggregated data, stored and displayed as averages, counts, and sums; and instance data - individual reports of HTTP requests, exceptions, page views, or custom events.

When viewing the properties of a request, you can see the telemetry events associated with it such as requests and exceptions.

![](./media/app-insights-java-get-started/7-instance.png)

### Analytics: Powerful query language
As you accumulate more data, you can run queries both to aggregate data and to find individual instances.  [Analytics](app-insights-analytics.md) is a powerful tool for both for understanding performance and usage, and for diagnostic purposes.

![Example of Analytics](./media/app-insights-java-get-started/025.png)

## 7. Install your app on the server
Now publish your app to the server, let people use it, and watch the telemetry show up on the portal.

* Make sure your firewall allows your application to send telemetry to these ports:

  * dc.services.visualstudio.com:443
  * f5.services.visualstudio.com:443

* If outgoing traffic must be routed through a firewall, define system properties `http.proxyHost` and `http.proxyPort`.

* On Windows servers, install:

  * [Microsoft Visual C++ Redistributable](http://www.microsoft.com/download/details.aspx?id=40784)

    (This component enables performance counters.)


## Exceptions and request failures
Unhandled exceptions are automatically collected:

![Open Settings, Failures](./media/app-insights-java-get-started/21-exceptions.png)

To collect data on other exceptions, you have two options:

* [Insert calls to trackException() in your code][apiexceptions].
* [Install the Java Agent on your server](app-insights-java-agent.md). You specify the methods you want to watch.

## Monitor method calls and external dependencies
[Install the Java Agent](app-insights-java-agent.md) to log specified internal methods and calls made through JDBC, with timing data.

## Performance counters
Open **Settings**, **Servers**, to see a range of performance counters.

![](./media/app-insights-java-get-started/11-perf-counters.png)

### Customize performance counter collection
To disable collection of the standard set of performance counters, add the following code under the root node of the ApplicationInsights.xml file:

```XML
    <PerformanceCounters>
       <UseBuiltIn>False</UseBuiltIn>
    </PerformanceCounters>
```

### Collect additional performance counters
You can specify additional performance counters to be collected.

#### JMX counters (exposed by the Java Virtual Machine)

```XML
    <PerformanceCounters>
      <Jmx>
        <Add objectName="java.lang:type=ClassLoading" attribute="TotalLoadedClassCount" displayName="Loaded Class Count"/>
        <Add objectName="java.lang:type=Memory" attribute="HeapMemoryUsage.used" displayName="Heap Memory Usage-used" type="composite"/>
      </Jmx>
    </PerformanceCounters>
```

* `displayName` – The name displayed in the Application Insights portal.
* `objectName` – The JMX object name.
* `attribute` – The attribute of the JMX object name to fetch
* `type` (optional) - The type of JMX object’s attribute:
  * Default: a simple type such as int or long.
  * `composite`: the perf counter data is in the format of 'Attribute.Data'
  * `tabular`: the perf counter data is in the format of a table row

#### Windows performance counters
Each [Windows performance counter](https://msdn.microsoft.com/library/windows/desktop/aa373083.aspx) is a member of a category (in the same way that a field is a member of a class). Categories can either be global, or can have numbered or named instances.

```XML
    <PerformanceCounters>
      <Windows>
        <Add displayName="Process User Time" categoryName="Process" counterName="%User Time" instanceName="__SELF__" />
        <Add displayName="Bytes Printed per Second" categoryName="Print Queue" counterName="Bytes Printed/sec" instanceName="Fax" />
      </Windows>
    </PerformanceCounters>
```

* displayName – The name displayed in the Application Insights portal.
* categoryName – The performance counter category (performance object) with which this performance counter is associated.
* counterName – The name of the performance counter.
* instanceName – The name of the performance counter category instance, or an empty string (""), if the category contains a single instance. If the categoryName is Process, and the performance counter you'd like to collect is from the current JVM process on which your app is running, specify `"__SELF__"`.

Your performance counters are visible as custom metrics in [Metrics Explorer][metrics].

![](./media/app-insights-java-get-started/12-custom-perfs.png)

### Unix performance counters
* [Install collectd with the Application Insights plugin](app-insights-java-collectd.md) to get a wide variety of system and network data.

## Local forwarder

[Local forwarder](https://docs.microsoft.com/azure/application-insights/local-forwarder) is an agent that collects Application Insights or [OpenCensus](https://opencensus.io/) telemetry from a variety of SDKs and frameworks and routes it to Application Insights. It's capable of running under Windows and Linux.

```xml
<Channel type="com.microsoft.applicationinsights.channel.concrete.localforwarder.LocalForwarderTelemetryChannel">
<DeveloperMode>false</DeveloperMode>
<EndpointAddress><!-- put the hostname:port of your LocalForwarder instance here --></EndpointAddress>
<!-- The properties below are optional. The values shown are the defaults for each property -->
<FlushIntervalInSeconds>5</FlushIntervalInSeconds><!-- must be between [1, 500]. values outside the bound will be rounded to nearest bound -->
<MaxTelemetryBufferCapacity>500</MaxTelemetryBufferCapacity><!-- units=number of telemetry items; must be between [1, 1000] -->
</Channel>
```

If you are using SpringBoot starter, add the following to your configuration file (application.properies):

```yml
azure.application-insights.channel.local-forwarder.endpoint-address=<!--put the hostname:port of your LocalForwarder instance here-->
azure.application-insights.channel.local-forwarder.flush-interval-in-seconds=<!--optional-->
azure.application-insights.channel.local-forwarder.max-telemetry-buffer-capacity=<!--optional-->
```

Default values are the same for SpringBoot application.properties and applicationinsights.xml configuration.

## Get user and session data
OK, you're sending telemetry from your web server. Now to get the full 360-degree view of your application, you can add more monitoring:

* [Add telemetry to your web pages][usage] to monitor page views and user metrics.
* [Set up web tests][availability] to make sure your application stays live and responsive.

## Capture log traces
You can use Application Insights to slice and dice logs from Log4J, Logback, or other logging frameworks. You can correlate the logs with HTTP requests and other telemetry. [Learn how][javalogs].

## Send your own telemetry
Now that you've installed the SDK, you can use the API to send your own telemetry.

* [Track custom events and metrics][api] to learn what users are doing with your application.
* [Search events and logs][diagnostic] to help diagnose problems.

## Availability web tests
Application Insights can test your website at regular intervals to check that it's up and responding well. [To set up][availability], click Web tests.

![Click Web tests, then Add Web test](./media/app-insights-java-get-started/31-config-web-test.png)

You'll get charts of response times, plus email notifications if your site goes down.

![Web test example](./media/app-insights-java-get-started/appinsights-10webtestresult.png)

[Learn more about availability web tests.][availability]

## Questions? Problems?
[Troubleshooting Java](app-insights-java-troubleshoot.md)

## Video

> [!VIDEO https://channel9.msdn.com/events/Connect/2016/100/player]

## Next steps
* [Monitor dependency calls](app-insights-java-agent.md)
* [Monitor Unix performance counters](app-insights-java-collectd.md)
* Add [monitoring to your web pages](app-insights-javascript.md) to monitor page load times, AJAX calls, browser exceptions.
* Write [custom telemetry](app-insights-api-custom-events-metrics.md) to track usage in the browser or at the server.
* Create [dashboards](app-insights-dashboards.md) to bring together the key charts for monitoring your system.
* Use  [Analytics](app-insights-analytics.md) for powerful queries over telemetry from your app
* For more information, visit [Azure for Java developers](/java/azure).

<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiexceptions]: app-insights-api-custom-events-metrics.md#trackexception
[availability]: app-insights-monitor-web-app-availability.md
[diagnostic]: app-insights-diagnostic-search.md
[eclipse]: /app-insights-java-quick-start.md
[javalogs]: app-insights-java-trace-logs.md
[metrics]: app-insights-metrics-explorer.md
[usage]: app-insights-javascript.md
