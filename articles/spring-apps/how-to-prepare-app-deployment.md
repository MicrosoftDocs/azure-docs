---
title: How to prepare an application for deployment in Azure Spring Apps
description: Learn how to prepare an application for deployment to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 07/06/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
zone_pivot_groups: programming-languages-spring-apps
---

# Prepare an application for deployment in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

::: zone pivot="programming-language-csharp"
This article shows how to prepare an existing Steeltoe application for deployment to Azure Spring Apps. Azure Spring Apps provides robust services to host, monitor, scale, and update a Steeltoe app.

This article explains the dependencies, configuration, and code that are required to run a .NET Core Steeltoe app in Azure Spring Apps. For information about how to deploy an application to Azure Spring Apps, see [Deploy your first Spring Boot app in Azure Spring Apps](./quickstart.md).

>[!Note]
> Steeltoe support for Azure Spring Apps is currently offered as a public preview. Public preview offerings allow customers to experiment with new features prior to their official release. Public preview features and services are not meant for production use. For more information about support during previews, see the [FAQ](https://azure.microsoft.com/support/faq/) or file a [Support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Supported versions

Azure Spring Apps supports:

* .NET Core 3.1
* Steeltoe 2.4 and 3.0

## Dependencies

For Steeltoe 2.4, add the latest [Microsoft.Azure.SpringCloud.Client 1.x.x](https://www.nuget.org/packages/Microsoft.Azure.SpringCloud.Client/) package to the project file:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.SpringCloud.Client" Version="1.0.0-preview.1" />
  <PackageReference Include="Steeltoe.Discovery.ClientCore" Version="2.4.4" />
  <PackageReference Include="Steeltoe.Extensions.Configuration.ConfigServerCore" Version="2.4.4" />
  <PackageReference Include="Steeltoe.Management.TracingCore" Version="2.4.4" />
  <PackageReference Include="Steeltoe.Management.ExporterCore" Version="2.4.4" />
</ItemGroup>
```

For Steeltoe 3.0, add the latest [Microsoft.Azure.SpringCloud.Client 2.x.x](https://www.nuget.org/packages/Microsoft.Azure.SpringCloud.Client/) package to the project file:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.Azure.SpringCloud.Client" Version="2.0.0-preview.1" />
  <PackageReference Include="Steeltoe.Discovery.ClientCore" Version="3.0.0" />
  <PackageReference Include="Steeltoe.Extensions.Configuration.ConfigServerCore" Version="3.0.0" />
  <PackageReference Include="Steeltoe.Management.TracingCore" Version="3.0.0" />
</ItemGroup>
```

## Update Program.cs

In the `Program.Main` method, call the `UseAzureSpringCloudService` method.

For Steeltoe 2.4.4, call `UseAzureSpringCloudService` after `ConfigureWebHostDefaults` and after `AddConfigServer` if it's called:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        })
        .AddConfigServer()
        .UseAzureSpringCloudService();
```

For Steeltoe 3.0.0, call `UseAzureSpringCloudService` before `ConfigureWebHostDefaults` and before any Steeltoe configuration code:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseAzureSpringCloudService()
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        })
        .AddConfigServer();
```

## Enable Eureka Server service discovery

> [!NOTE]
> Eureka is not applicable to the Enterprise plan. If you're using the Enterprise plan, see [Use Service Registry](how-to-enterprise-service-registry.md).

In the configuration source that's used when the app runs in Azure Spring Apps, set `spring.application.name` to the same name as the Azure Spring Apps app to which the project is deployed.

For example, if you deploy a .NET project named `EurekaDataProvider` to an Azure Spring Apps app named `planet-weather-provider` the *appSettings.json* file should include the following JSON:

```json
"spring": {
  "application": {
    "name": "planet-weather-provider"
  }
}
```

## Use service discovery

To call a service by using the Eureka Server service discovery, make HTTP requests to `http://<app_name>` where `app_name` is the value of `spring.application.name` of the target app. For example, the following code calls the `planet-weather-provider` service:

```csharp
using (var client = new HttpClient(discoveryHandler, false))
{
    var responses = await Task.WhenAll(
        client.GetAsync("http://planet-weather-provider/weatherforecast/mercury"),
        client.GetAsync("http://planet-weather-provider/weatherforecast/saturn"));
    var weathers = await Task.WhenAll(from res in responses select res.Content.ReadAsStringAsync());
    return new[]
    {
        new KeyValuePair<string, string>("Mercury", weathers[0]),
        new KeyValuePair<string, string>("Saturn", weathers[1]),
    };
}
```

::: zone-end

::: zone pivot="programming-language-java"
This article shows how to prepare an existing Java Spring application for deployment to Azure Spring Apps. If configured properly, Azure Spring Apps provides robust services to monitor, scale, and update your Java Spring application.

Before running this example, you can try the [basic quickstart](./quickstart.md).

Other examples explain how to deploy an application to Azure Spring Apps when the POM file is configured.

* [Launch your first App](./quickstart.md)
* [Introduction to the sample app](./quickstart-sample-app-introduction.md)

This article explains the required dependencies and how to add them to the POM file.

## Java Runtime version

For details, see the [Java runtime and OS versions](./faq.md?pivots=programming-language-java#java-runtime-and-os-versions) section of the [Azure Spring Apps FAQ](./faq.md).

## Spring Boot and Spring Cloud versions

To prepare an existing Spring Boot application for deployment to Azure Spring Apps, include the Spring Boot and Spring Cloud dependencies in the application POM file as shown in the following sections.

Azure Spring Apps supports the latest Spring Boot or Spring Cloud major version starting from 30 days after its release. Azure Spring Apps supports the latest minor version as soon as it's released. You can get supported Spring Boot versions from [Spring Boot Releases](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions#releases) and Spring Cloud versions from [Spring Cloud Releases](https://github.com/spring-cloud/spring-cloud-release/wiki).

The following table lists the supported Spring Boot and Spring Cloud combinations:

### [Enterprise plan](#tab/enterprise-plan)

| Spring Boot version | Spring Cloud version            | End of commercial support |
|---------------------|---------------------------------|---------------------------|
| 3.1.x               | 2022.0.3+ also known as Kilburn | 2025-08-18                |
| 3.0.x               | 2022.0.3+ also known as Kilburn | 2025-02-24                |
| 2.7.x               | 2021.0.3+ also known as Jubilee | 2025-08-24                |
| 2.6.x               | 2021.0.3+ also known as Jubilee | 2024-02-24                |

### [Basic/Standard plan](#tab/basic-standard-plan)

| Spring Boot version | Spring Cloud version            | End of support |
|---------------------|---------------------------------|----------------|
| 3.1.x               | 2022.0.3+ also known as Kilburn | 2024-05-18     |
| 3.0.x               | 2022.0.3+ also known as Kilburn | 2023-11-24     |
| 2.7.x               | 2021.0.3+ also known as Jubilee | 2023-11-24     |

---

For more information, see the following pages:

* [Spring Boot support](https://spring.io/projects/spring-boot#support)
* [Spring Cloud Config support](https://spring.io/projects/spring-cloud-config#support)
* [Spring Cloud Netflix support](https://spring.io/projects/spring-cloud-netflix#support)
* [Adding Spring Cloud To An Existing Spring Boot Application](https://spring.io/projects/spring-cloud#overview:~:text=Adding%20Spring%20Cloud%20To%20An%20Existing%20Spring%20Boot%20Application)

## Other recommended dependencies to enable Azure Spring Apps features

To enable the built-in features of Azure Spring Apps from service registry to distributed tracing, you need to also include the following dependencies in your application. You can drop some of these dependencies if you don't need corresponding features for the specific apps.

### Service Registry

To use the managed Azure Service Registry service, include the `spring-cloud-starter-netflix-eureka-client` dependency in the *pom.xml* file as shown here:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

The endpoint of the Service Registry server is automatically injected as environment variables with your app. Applications can register themselves with the Service Registry server and discover other dependent applications.

#### EnableDiscoveryClient annotation

Add the following annotation to the application source code.

```java
@EnableDiscoveryClient
```

For example, see the piggymetrics application from earlier examples:

```java
package com.piggymetrics.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy

public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

### Distributed configuration

#### [Enterprise plan](#tab/enterprise-plan)

To enable distributed configuration in the Enterprise plan, use [Application Configuration Service for VMware Tanzu](https://docs.vmware.com/en/Application-Configuration-Service-for-VMware-Tanzu/2.0/acs/GUID-overview.html), which is one of the proprietary VMware Tanzu components. Application Configuration Service for Tanzu is Kubernetes-native, and different from Spring Cloud Config Server. Application Configuration Service for Tanzu enables the management of Kubernetes-native ConfigMap resources that are populated from properties defined in one or more Git repositories.

In the Enterprise plan, there's no Spring Cloud Config Server, but you can use Application Configuration Service for Tanzu to manage centralized configurations. For more information, see [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md)

To use Application Configuration Service for Tanzu, do the following steps for each of your apps:

1. Add an explicit app binding to declare that your app needs to use Application Configuration Service for Tanzu.

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to make the change take effect.

1. Set config file patterns. Config file patterns enable you to choose which application and profile the app uses. For more information, see the [Pattern](how-to-enterprise-application-configuration-service.md#pattern) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

   Another option is to set the config file patterns at the same time as your app deployment, as shown in the following example:

   ```azurecli
      az spring app deploy \
          --name <app-name> \
          --artifact-path <path-to-your-JAR-file> \
          --config-file-pattern <config-file-pattern>
   ```

#### [Basic/Standard plan](#tab/basic-standard-plan)

To enable distributed configuration, include the following `spring-cloud-config-client` dependency in the dependencies section of your *pom.xml* file:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

> [!WARNING]
> Don't specify `spring.cloud.config.enabled=false` in your bootstrap configuration. Otherwise, your application stops working with Config Server.

---

### Metrics

Include the `spring-boot-starter-actuator` dependency in the dependencies section of your *pom.xml* file as shown here:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

 Metrics are periodically pulled from the JMX endpoints. You can visualize the metrics by using the Azure portal.

 > [!WARNING]
 > You must specify `spring.jmx.enabled=true` in your configuration property. Otherwise, metrics can't be visualized in the Azure portal.

## See also

* [Analyze application logs and metrics](./diagnostic-services.md)
* [Set up your Config Server](./how-to-config-server.md)
* [Spring Quickstart Guide](https://spring.io/quickstart)
* [Spring Boot documentation](https://spring.io/projects/spring-boot)

## Next steps

In this article, you learned how to configure your Java Spring application for deployment to Azure Spring Apps. To learn how to set up a Config Server instance, see [Set up a Config Server instance](./how-to-config-server.md).

More samples are available on GitHub: [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
::: zone-end
