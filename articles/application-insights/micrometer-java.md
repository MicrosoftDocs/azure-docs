---
title: How to use Micrometer with Azure Application Insights Java SDK | Microsoft Docs
description: 'A step by step guide on using Micrometer with your Application Insights Spring Boot and non-Spring Boot applications. '
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
ms.date: 10/23/2018
ms.author: lagayhar

---
# How to use Micrometer with Azure Application Insights Java SDK
Micrometer application monitoring measures metrics for JVM-based application code and lets you export the data to your favorite monitoring systems. This article will teach you how to use Micrometer with application insight for both Spring Boot and non-Spring Boot applications.

## Using SpringBoot 1.5x
Add the following dependencies to your pom.xml or build.gradle file: 
* [Application Insight spring-boot-starter](https://github.com/Microsoft/ApplicationInsights-Java/tree/master/azure-application-insights-spring-boot-starter)1.1.0-BETA or above
* Micrometer Azure Registry 1.1.0 or above
* [Micrometer Spring Legacy](https://micrometer.io/docs/ref/spring/1.5) 1.1.0 or above (this backports the autoconfig code in Spring framework).
* [ApplicationInsights Resource](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-create-new-resource)

Steps

1. Update the pom.xml file of your Spring Boot application and add the following dependencies in it:

    ```XML
    <dependency> 
        <groupId>com.microsoft.azure</groupId> 
        <artifactId>applicationinsights-spring-boot-starter</artifactId> 
        <version>1.1.0-BETA</version> 
    </dependency> 

    <dependency> 
        <groupId>io.micrometer</groupId> 
        <artifactId>micrometer-spring-legacy</artifactId> 
        <version>1.1.0</version> 
    </dependency> 

    <dependency> 
        <groupId>io.micrometer</groupId> 
        <artifactId>micrometer-registry-azure-monitor</artifactId> 
        <version>1.1.0</version> 
    </dependency>

    ```
2. Update the application.properties or yml file with the Application Insights Instrumentation key using the following property:

    a. azure.application-insights.instrumentation-key=fakekey
3. Build your application and run
4. The above should get you running with pre-aggregated metrics auto collected to Azure Monitor. For details on how to fine-tune ApplicationInsight SpringBoot starter refer to the [readme on GitHub](https://github.com/Microsoft/ApplicationInsights-Java/blob/master/azure-application-insights-spring-boot-starter/README.md).

## Using Spring 2.x

Add the following dependencies to your pom.xml or build.gradle file:

* Application Insights Spring-boot-starter 2.1.2 or above
* Azure-spring-boot-metrics-starters 2.0.7 or above  
* [Application Insights Resource](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-create-new-resource)

Steps:

1. Update the pom.xml file of your Spring Boot application and add the following dependency in it:

    ```XML
    <dependency> 
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-spring-boot-metrics-starter</artifactId>
          <version>2.0.7</version>
    </dependency>
    ```
1. Update the application.properties or yml file with the Application Insights Instrumentation key using the following property:

    a. azure.application-insights.instrumentation-key=fakekey
3. Build your application and run
4. The above should get you running with pre-aggregated metrics auto collected to Azure Monitor. For details on how to fine-tune ApplicationInsight SpringBoot starter refer to the [readme on GitHub](https://github.com/Microsoft/azure-spring-boot/releases/latest).

Default Metrics:

*    Automatically configured metrics for Tomcat, JVM, Logback Metrics, Log4J metrics, Uptime Metrics, Processor Metrics, FileDescriptorMetrics.
*    For example, if the netflix hystrix is present on class path we get those metrics as well. 
*    The following metrics can be available by adding respective beans. 
        - CacheMetrics (CaffineCache, EhCache2, GuavaCache, HazelcaseCache, Jcache)     
        - DataBaseTableMetrics 
        - HibernateMetrics 
        - JettyMetrics 
        - OkHttp3 metrics 
        - Kafka Metrics 

 

How to turn off automatic metrics collection: 
 
- JVM Metrics: 
    - management.metrics.binders.jvm.enabled=false 
- Logback Metrics: 
    - management.metrics.binders.logback.enabled=false
- Uptime Metrics: 
    - management.metrics.binders.uptime.enabled=false 
- Processor Metrics:
    -  management.metrics.binders.processor.enabled=false 
- FileDescriptorMetrics:
    - management.metrics.binders.files.enabled=false 
- Hystrix Metrics if library on classpath: 
    - management.metrics.binders.hystrix.enabled=false 
- AspectJ Metrics if library on classpath: 
    - spring.aop.enabled=false 

> [!NOTE]
> Specify properties above in application.properties or application.yml file of your SpringBoot application

## Use Micrometer with non-Spring Boot web application

Add the following dependencies to your pom.xml or build.gradle file:
 
* [Application Insight Core 2.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.2.0) or above
* [Application Insights Web 2.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/2.2.0) or above
* [Register Web Filter](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-java-get-started)
* Micrometer Azure Registry 1.1.0 or above
* [Application Insights Resource](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-create-new-resource)

Steps:

1. Add following dependency in your pom.xml or build.gradle file:

```XML
    <dependency>
    	<groupId>io.micrometer</groupId>
    	<artifactId>micrometer-registry-azure-monitor</artifactId>
    		<version>1.1.0</version>
    </dependency>
    
    <dependency>
    	<groupId>com.microsoft.azure</groupId>
    	<artifactId>applicationinsights-web</artifactId>
    	<version>2.2.0</version>
    </dependency
 ```

2. Put Application Insights.xml in the resources folder

    Sample Servlet class (emits a timer metric):

```Java
    @WebServlet("/hello")
    public class TimedDemo extends HttpServlet {

      private static final long serialVersionUID = -4751096228274971485L;

      @Override
      @Timed(value = "hello.world")
      protected void doGet(HttpServletRequest reqest, HttpServletResponse response)
          throws ServletException, IOException {

        response.getWriter().println("Hello World!");
        MeterRegistry registry = (MeterRegistry) getServletContext().getAttribute("AzureMonitorMeterRegistry");

    //create new Timer metric
        Timer sampleTimer = registry.timer("timer");
        Stream<Integer> infiniteStream = Stream.iterate(0, i -> i+1);
        infiniteStream.limit(10).forEach(integer -> {
          try {
            Thread.sleep(1000);
            sampleTimer.record(integer, TimeUnit.MILLISECONDS);
          } catch (Exception e) {}
           });
      }
      @Override
      public void init() throws ServletException {
        System.out.println("Servlet " + this.getServletName() + " has started");
      }
      @Override
      public void destroy() {
        System.out.println("Servlet " + this.getServletName() + " has stopped");
      }

    }

```	

    Sample configuration class:

```Java
    @WebListener
    public class MeterRegistryConfiguration implements ServletContextListener {

      @Override
      public void contextInitialized(ServletContextEvent servletContextEvent) {

    // Create AzureMonitorMeterRegistry
      private final AzureMonitorConfig config = new AzureMonitorConfig() {
        @Override
        public String get(String key) {
            return null;
        }
       @Override
          public Duration step() {
            return Duration.ofSeconds(60);}

        @Override
        public boolean enabled() {
            return false;
        }
    };

MeterRegistry azureMeterRegistry = AzureMonitorMeterRegistry.builder(config);

        //set the config to be used elsewhere
        servletContextEvent.getServletContext().setAttribute("AzureMonitorMeterRegistry", azureMeterRegistry);

      }

      @Override
      public void contextDestroyed(ServletContextEvent servletContextEvent) {

      }
    }
```

To learn more about metrics, refer to the [Micrometer documentation](https://micrometer.io/docs/).

Other sample code on how to create different types of metrics can be found [the official Micrometer Github repo](https://github.com/micrometer-metrics/micrometer/tree/master/samples/micrometer-samples-core/src/main/java/io/micrometer/core/samples).


## How to bind additional metrics collection

### SpringBoot/Spring

Create a bean of the respective metric category. For example, say we need Guava cache Metrics:

```Java
	@Bean
	GuavaCacheMetrics guavaCacheMetrics() {
		Return new GuavaCacheMetrics();
	}
```
There are several metrics that are not enabled by default but can be bound in the above fashion. For a complete list, refer to [the official Micrometer Github repo](https://github.com/micrometer-metrics/micrometer/tree/master/micrometer-core/src/main/java/io/micrometer/core/instrument/binder ).

### Non-Spring apps
Add the following binding code to the configuration  file:
```Java 
	New GuavaCacheMetrics().bind(registry);
```  
> [!NOTE]
> The table below is subject to constant changes and updates. Please refer to the [Micrometer docs](https://micrometer.io/docs) for the most up-to-date list of automatically collected metrics.

## Auto-collected metrics

> [!div class="mx-tdCol2BreakAll"]
|  Metrics Category |  Metrics Name   | Metric Type | Base Unit  | Description   | Property Enable/disable |
|---|-------|---|---|-----------------------|-----------------------|
| JVM GC Metrics | jvm.gc.max.data.size  |Gauge  |Bytes   | Max size of old generation memory pool| management.metrics.enable.jvm |
| JVM GC Metrics | jvm.gc.live.data.size  |Gauge  |Bytes|Size of old generation memory pool after a full GC|management.metrics.enable.jvm|
| JVM GC Metrics |jvm.gc.memory.promoted  |Counter   |Bytes   |Count of positive increases in the size of the old generation memory pool before GC to after GC | management.metrics.enable.jvm|
| JVM GC Metrics |jvm.gc.memory.allocated |Counter   | Bytes  | Incremented for an increase in the size of the young generation memory pool after one GC to before the next|management.metrics.enable.jvm|
| JVM GC Metrics |jvm.gc.concurrent.phase.time |  Timer |Milliseconds  |Time spent in concurrent phase |management.metrics.enable.jvm|
| JVM GC Metrics |jvm.gc.pause | Timer  |Milliseconds   |Time Spent in GC pause|management.metrics.enable.jvm|
| JVM Memory Metrics | jvm.buffer.count | Gauge |Number  | An estimate of number of buffers in the pool |management.metrics.enable.jvm  |
| JVM Memory Metrics | jvm.buffer.memory.used |Gauge | Bytes |An estimate of the memory that the JVM is using for this buffer pool  | management.metrics.enable.jvm |
| JVM Memory Metrics |jvm.buffer.total.capacity  | Gauge | Bytes | The amount of used memory |management.metrics.enable.jvm |
| JVM Memory Metrics |jvm.memory.used |Gauge  | Bytes |The amount of memory in bytes that is committed for the JVM to use |management.metrics.enable.jvm |
| JVM Memory Metrics | jvm.memory.committed | Gauge |Bytes  |The amount of memory in bytes that is committed for the JVM to use  | management.metrics.enable.jvm |
| JVM Memory Metrics | jvm.memory.max | Gauge  | Bytes  |The maximum amount of memory that can be used for memory management  | management.metrics.enable.jvm |
|JVM Thread Metrics |jvm.threads.peak |Gauge  | Number  |The peak live thread count since the java virtual machine started or peak was reset |management.metrics.enable.jvm| 
|JVM Thread Metrics |jvm.threads.daemon |Gauge  |Number  |The current number of live daemon threads  |management.metrics.enable.jvm |
|JVM Thread Metrics |jvm.threads.live |Gauge  |Number  | The current number of live threads including both daemon and non-daemon threads|   management.metrics.enable.jvm|
| ClassLoader Metrics | jvm.classes.loaded |Gauge | Number | The number of classes that are currently loaded in the Java virtual machine |management.metrics.enable.jvm  |
| ClassLoader Metrics |jvm.classes.unloaded | FunctionCounter | Increasing Number |The total number of classes unloaded since the jvm has started execution |management.metrics.enable.jvm  |
|LogBack Metrics  | logback.events <br> &nbsp; Tags: error<br> &nbsp; Warn<br> &nbsp; Info<br>&nbsp; Debug<br>&nbsp; Trace |  Counter | Number | Number of total level events that made it to the logs | management.metrics.enable.logback |
| Uptime Metrics | process.uptime |TimeGauge  |Milliseconds |The uptime of the JVM  | management.metrics.enable.uptime|
| Uptime Metrics |process.start.time |TimeGauge |Milliseconds  |Start time of the process since unix epoch  |management.metrics.enable.uptime |
| Processor Metrics |System.cpu.count  |Gauge  |Number  |The number of processors available to the JVM  | management.metrics.enable.processor |
| Processor Metrics | system.load.average.1m | Gauge |Number  |The sum of the number of runnable entities queued to available processors and the number of runnable entities running on the available processors averaged over a period of time  | management.metrics.enable.processor |
| Processor Metrics |system.cpu.usage  | Gauge |Number  | The recent CPU usage for the whole system |management.metrics.enable.processor  |
| Processor Metrics |process.cpu.usage  |Gauge  |Number  |The recent CPU usage for the JVM process  | management.metrics.enable.processor |
| File Descriptor Metrics | process.files.open| Gauge | Number  |The open file descriptor count  | management.metrics.enable.files |
| File Descriptor Metrics| process.files.max| Gauge | Number |The maximum file descriptor count  | management.metrics.enable.files  |
| Tomcat Metrics |tomcat.sessions.active.max  |Gauge  |Number  | Total max active sessions  | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.sessions.active.current |Gauge  | Number | Total current active sessions | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.sessions.created  |FunctionCounter| Number |Total tomcat sessions created | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.sessions.expired | FunctionCounter | Number |Total tomcat sessions expired| Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.sessions.rejected  |FunctionCounter  | Number | Total tomcat sessions rejected | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.sessions.alive.max |TimeGauge  | Seconds |The number of tomcat sessions rejected  | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.threads.config.max  | Gauge | Number | Maximum threads for tomcat | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.threads.busy  | Gauge | Number |The number of currently busy tomcat threads  | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.threads.current  |Gauge  | Number |The number of current tomcat threads | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.cache.access | FunctionCounter | Number |The number of times tomcat cache has been accessed in aggregated time period | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.cache.hit  | FunctionCounter | Number | The number of times cache hit occurred in aggregated time period | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.servlet.error| FunctionCounter | Number | The number of servlet errors that occurred in aggregated time period | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.servlet.request | FunctionTimer |Number<br>Milliseconds | The number of tomcat servlet requests in aggregated time period and the total time they took | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.servlet.request.max | TimeGauge | Milliseconds |The time of that max servlet request took in the aggregated timeperiod   | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.global.sent| FunctionCounter | Bytes | The total bytes sent in the aggregated time period | Management.metrics.enable.tomcat |
| Tomcat Metrics |tomcat.global.received  | FunctionCounter | Bytes | The total bytes received in the aggregated time period | Management.metrics.enable.tomcat |
| Tomcat Metrics | tomcat.global.error | FunctionCounter |Number  |The total error count in the aggregated time period | Management.metrics.enable.tomcat |
| HTTP Metrics |Http.server.requests<br>&nbsp;Tags: exception <br>&nbsp;Method <br> &nbsp;Status <br>&nbsp;Uri | Timer |Number<br>Milliseconds | The pre-aggregated metric derived from requests |  |
| Spring Integration Metrics |spring.integration.channelNames| Gauge | Number  |The number of spring integration channels  |  | 
| Spring Integration Metrics|spring.integration.handlerNames | Gauge | Number |The number of spring integration handlers  |  | 
| Spring Integration Metrics |spring.integration.sourceNames| Gauge | Number | The number of spring integration sources |  | 
| Spring Integration Metrics|spring.integration.source.messages | FunctionCounter | Number | The number of successful handler calls during the aggregated time period |  | 
| Spring Integration Metrics|spring.integration.handler.duration.max |TimeGauge  | Number | The maximum handler duration |  | 
| Spring Integration Metrics|spring.integration.handler.duration.min |TimeGauge  | Number  | The minimum handler duration |  | 
| Spring Integration Metrics |spring.integration.handler.duration.mean |TimeGauge  | Number  |The mean handler duration  |  |
| Spring Integration Metrics |spring.integration.handler.activeCount | Gauge  | Number |The number of active handlers |  |
| Spring Integration Metrics|spring.integration.channel.sendErrors | FunctionCounter | Number  | The number of failed sends (either throwing an exception or rejected by the channel) |  | 
| Spring Integration Metrics |spring.integration.channel.sends | FunctionCounter | Number  | The number of successful sends |  | 
| Spring Integration Metrics |spring.integration.receives| FunctionCounter | Number | The number of successful receives |  | 
