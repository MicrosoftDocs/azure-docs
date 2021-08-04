---
title: "Use Distributed Tracing with Azure Spring Cloud"
description: Learn how to use Spring Cloud's distributed tracing through Azure Application Insights
author: karlerickson
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/06/2019
ms.author: karler
ms.custom: devx-track-java
zone_pivot_groups: programming-languages-spring-cloud
---

# Use distributed tracing with Azure Spring Cloud

With the distributed tracing tools in Azure Spring Cloud, you can easily debug and monitor complex issues. Azure Spring Cloud integrates [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth) with Azure's [Application Insights](../azure-monitor/app/app-insights-overview.md). This integration provides powerful distributed tracing capability from the Azure portal.

::: zone pivot="programming-language-csharp"
In this article, you learn how to enable a .NET Core Steeltoe app to use distributed tracing.

## Prerequisites

To follow these procedures, you need a Steeltoe app that is already [prepared for deployment to Azure Spring Cloud](how-to-prepare-app-deployment.md).

## Dependencies

For Steeltoe 2.4.4, add the following NuGet packages:

* [Steeltoe.Management.TracingCore](https://www.nuget.org/packages/Steeltoe.Management.TracingCore/)
* [Steeltoe.Management.ExporterCore](https://www.nuget.org/packages/Microsoft.Azure.SpringCloud.Client/)

For Steeltoe 3.0.0, add the following NuGet package:

* [Steeltoe.Management.TracingCore](https://www.nuget.org/packages/Steeltoe.Management.TracingCore/)

## Update Startup.cs

1. For Steeltoe 2.4.4, call `AddDistributedTracing` and `AddZipkinExporter` in the `ConfigureServices` method.

   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       services.AddDistributedTracing(Configuration);
       services.AddZipkinExporter(Configuration);
   }
   ```

   For Steeltoe 3.0.0, call `AddDistributedTracing` in the `ConfigureServices` method.

   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       services.AddDistributedTracing(Configuration, builder => builder.UseZipkinWithTraceOptions(services));
   }
   ```

1. For Steeltoe 2.4.4, call `UseTracingExporter` in the `Configure` method.

   ```csharp
   public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
   {
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
        app.UseTracingExporter();
   }
   ```

   For Steeltoe 3.0.0, no changes are required in the `Configure` method.

## Update configuration

Add the following settings to the configuration source that will be used when the app runs in Azure Spring Cloud:

1. Set `management.tracing.alwaysSample` to true.

2. If you want to see tracing spans sent between the Eureka server, the Configuration server, and user apps: set `management.tracing.egressIgnorePattern` to "/api/v2/spans|/v2/apps/.*/permissions|/eureka/.*|/oauth/.*".

For example, *appsettings.json* would include the following properties:

```json
"management": {
    "tracing": {
      "alwaysSample": true,
      "egressIgnorePattern": "/api/v2/spans|/v2/apps/.*/permissions|/eureka/.*|/oauth/.*"
    }
  }
```

For more information about distributed tracing in .NET Core Steeltoe apps, see [Distributed tracing](https://docs.steeltoe.io/api/v3/tracing/) in the Steeltoe documentation.
::: zone-end
::: zone pivot="programming-language-java"
In this article, you learn how to:

> [!div class="checklist"]
> * Enable distributed tracing in the Azure portal.
> * Add Spring Cloud Sleuth to your application.
> * View dependency maps for your microservice applications.
> * Search tracing data with different filters.

## Prerequisites

To follow these procedures, you need an Azure Spring Cloud service that is already provisioned and running. Complete the [Deploy your first Azure Spring Cloud application](./quickstart.md) quickstart to provision and run an Azure Spring Cloud service.

## Add dependencies

1. Add the following line to the application.properties file:

   ```xml
   spring.zipkin.sender.type = web
   ```

   After this change, the Zipkin sender can send to the web.

1. Skip this step if you followed our [guide to preparing an Azure Spring Cloud application](how-to-prepare-app-deployment.md). Otherwise, go to your local development environment and edit your pom.xml file to include the following Spring Cloud Sleuth dependency:

    * Spring boot version < 2.4.x.

      ```xml
      <dependencyManagement>
          <dependencies>
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-sleuth</artifactId>
                  <version>${spring-cloud-sleuth.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
          </dependencies>
      </dependencyManagement>
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-sleuth</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-zipkin</artifactId>
          </dependency>
      </dependencies>
      ```

    * Spring boot version >= 2.4.x.

      ```xml
      <dependencyManagement>
          <dependencies>
            <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-sleuth</artifactId>
                  <version>${spring-cloud-sleuth.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
          </dependencies>
      </dependencyManagement>
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-sleuth</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-sleuth-zipkin</artifactId>
           </dependency>
      </dependencies>
      ```


1. Build and deploy again for your Azure Spring Cloud service to reflect these changes.

## Modify the sample rate

You can change the rate at which your telemetry is collected by modifying the sample rate. For example, if you want to sample half as often, open your application.properties file, and change the following line:

```xml
spring.sleuth.sampler.probability=0.5
```

If you have already built and deployed an application, you can modify the sample rate. Do so by adding the previous line as an environment variable in the Azure CLI or the Azure portal.
::: zone-end

## Enable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. On the **Monitoring** page, select **Distributed Tracing**.
1. Select **Edit setting** to edit or add a new setting.
1. Create a new Application Insights query, or select an existing one.
1. Choose which logging category you want to monitor, and specify the retention time in days.
1. Select **Apply** to apply the new tracing.

## View the application map

Return to the **Distributed Tracing** page and select **View application map**. Review the visual representation of your application and monitoring settings. To learn how to use the application map, see [Application Map: Triage distributed applications](../azure-monitor/app/app-map.md).

## Use search

Use the search function to query for other specific telemetry items. On the **Distributed Tracing** page, select **Search**. For more information on how to use the search function, see [Using Search in Application Insights](../azure-monitor/app/diagnostic-search.md).

## Use Application Insights

Application Insights provides monitoring capabilities in addition to the application map and search function. Search the Azure portal for your application's name, and then open an Application Insights page to find monitoring information. For more guidance on how to use these tools, check out [Azure Monitor log queries](/azure/data-explorer/kusto/query/).

## Disable Application Insights

1. Go to your Azure Spring Cloud service page in the Azure portal.
1. On **Monitoring**, select **Distributed Tracing**.
1. Select **Disable** to disable Application Insights.

## Next steps

In this article, you learned how to enable and understand distributed tracing in Azure Spring Cloud. To learn about binding services to an application, see [Bind an Azure Cosmos DB database to an Azure Spring Cloud application](./how-to-bind-cosmos.md).
