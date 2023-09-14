---
title:  Discover and register your Spring Boot applications in Azure Spring Apps
description: Discover and register your Spring Boot applications with managed Spring Cloud Service Registry (OSS) in Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/09/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, engagement-fy23
zone_pivot_groups: programming-languages-spring-apps
---

# Discover and register your Spring Boot applications

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This article shows you how to register your application using Spring Cloud Service Registry.

Service registration and discovery are key requirements for maintaining a list of live app instances to call, and routing and load balancing inbound requests. Configuring each client manually takes time and introduces the possibility of human error. Azure Spring Apps provides two options for you to solve this problem:

> [!NOTE]
> To use service registry in the Standard consumption and dedicated plan, you must enable it first. For more information, see [Enable and disable Eureka Server in Azure Spring Apps](quickstart-standard-consumption-eureka-server.md).

* Use Kubernetes Service Discovery approach to invoke calls among your apps.

  Azure Spring Apps creates a corresponding Kubernetes service for every app running in it using the app name as the Kubernetes service name. You can invoke calls from one app to another app by using the app name in an HTTP/HTTPS request such as `http(s)://{app name}/path`. This approach is also suitable for the Enterprise plan. For more information, see the [Kubernetes registry code sample](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/k8s-service-registry).

  > [!NOTE]
  > This approach isn't suitable for Standard consumption and dedicated (Preview).

* Use Managed Spring Cloud Service Registry (OSS) in Azure Spring Apps.

  After configuration, a Service Registry server will control service registration and discovery for your applications. The Service Registry server maintains a registry of live app instances, enables client-side load-balancing, and decouples service providers from clients without relying on DNS.

::: zone pivot="programming-language-csharp"

For information about how to set up service registration for a Steeltoe app, see [Prepare a Java Spring application for deployment in Azure Spring Apps](how-to-prepare-app-deployment.md).

::: zone-end

::: zone pivot="programming-language-java"

## Register your application using Spring Cloud Service Registry

Before your application can manage service registration and discovery using Spring Cloud Service Registry, you must include the following dependency for `spring-cloud-starter-netflix-eureka-client` in your *pom.xml* file:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

## Update the top level class

Finally, add an annotation to the top level class of your application, as shown in the following example:

```java
package foo.bar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

The Spring Cloud Service Registry server endpoint is injected as an environment variable in your application. Applications can register themselves with the Service Registry server and discover other dependent applications.

> [!NOTE]
> It can take a few minutes for the changes to propagate from the server to all applications.
::: zone-end

## Next steps

In this article, you learned how to register your application using Spring Cloud Service Registry. To learn how to access the Spring Cloud Service Registry using Azure Active Directory (Azure AD) role-based access control (RBAC), see [Access Config Server and Service Registry](how-to-access-data-plane-azure-ad-rbac.md).
