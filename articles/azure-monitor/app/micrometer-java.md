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
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: lagayhar
---
# How to use Micrometer with Azure Application Insights Java SDK
Micrometer application monitoring measures metrics for JVM-based application code and lets you export the data to your favorite monitoring systems. This article will teach you how to use Micrometer with Application Insights for both Spring Boot and non-Spring Boot applications.

## Using Spring Boot 1.5x
Add the following dependencies to your pom.xml or build.gradle file: 
* [Application Insights spring-boot-starter](https://github.com/Microsoft/ApplicationInsights-Java/tree/master/azure-application-insights-spring-boot-starter)1.1.0-BETA or above
* Micrometer Azure Registry 1.1.0 or above
* [Micrometer Spring Legacy](https://micrometer.io/docs/ref/spring/1.5) 1.1.0 or above (this backports the autoconfig code in the Spring framework).
* [ApplicationInsights Resource](../../azure-monitor/app/create-new-resource.md )

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

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
1. Build your application and run
2. The above should get you up and running with pre-aggregated metrics auto collected to Azure Monitor. For details on how to fine-tune Application Insights Spring Boot starter refer to the [readme on GitHub](https://github.com/Microsoft/ApplicationInsights-Java/blob/master/azure-application-insights-spring-boot-starter/README.md).

## Using Spring 2.x

Add the following dependencies to your pom.xml or build.gradle file:

* Application Insights Spring-boot-starter 2.1.2 or above
* Azure-spring-boot-metrics-starters 2.0.7 or above  
* [Application Insights Resource](../../azure-monitor/app/create-new-resource.md )

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

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
3. Build your application and run
4. The above should get you running with pre-aggregated metrics auto collected to Azure Monitor. For details on how to fine-tune Application Insights Spring Boot starter refer to the [readme on GitHub](https://github.com/Microsoft/azure-spring-boot/releases/latest).

Default Metrics:

*    Automatically configured metrics for Tomcat, JVM, Logback Metrics, Log4J metrics, Uptime Metrics, Processor Metrics, FileDescriptorMetrics.
*    For example, if the netflix hystrix is present on class path we get those metrics as well. 
*    The following metrics can be available by adding respective beans. 
        - CacheMetrics (CaffeineCache, EhCache2, GuavaCache, HazelcaseCache, Jcache)     
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
> Specify the properties above in the application.properties or application.yml file of your Spring Boot application

## Use Micrometer with non-Spring Boot web applications

Add the following dependencies to your pom.xml or build.gradle file:
 
* [Application Insight Core 2.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights/2.2.0) or above
* [Application Insights Web 2.2.0](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/2.2.0) or above
* [Register Web Filter](https://docs.microsoft.com/azure/application-insights/app-insights-java-get-started)
* Micrometer Azure Registry 1.1.0 or above
* [Application Insights Resource](../../azure-monitor/app/create-new-resource.md )

Steps:

1. Add the following dependencies in your pom.xml or build.gradle file:

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
          protected void doGet(HttpServletRequest request, HttpServletResponse response)
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

Other sample code on how to create different types of metrics can be found in[the official Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/samples/micrometer-samples-core/src/main/java/io/micrometer/core/samples).

## How to bind additional metrics collection

### SpringBoot/Spring

Create a bean of the respective metric category. For example, say we need Guava cache Metrics:

```Java
	@Bean
	GuavaCacheMetrics guavaCacheMetrics() {
		Return new GuavaCacheMetrics();
	}
```
There are several metrics that are not enabled by default but can be bound in the above fashion. For a complete list, refer to [the official Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/micrometer-core/src/main/java/io/micrometer/core/instrument/binder ).

### Non-Spring apps
Add the following binding code to the configuration  file:
```Java 
	New GuavaCacheMetrics().bind(registry);
```

## Next steps

* To learn more about Micrometer refer to the official [Micrometer documentation](https://micrometer.io/docs).
* To learn about Spring on Azure refer to the official [Spring on Azure documentation](https://docs.microsoft.com/java/azure/spring-framework/?view=azure-java-stable).
