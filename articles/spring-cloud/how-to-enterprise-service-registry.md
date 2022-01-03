---
title: How to Use Service Registry with Azure Spring Cloud Enterprise Tier
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to use Service Registry with Azure Spring Cloud Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/08/2021
ms.custom: devx-track-java
---

# Service Registry

[Service Registry](https://docs.vmware.com/en/Spring-Cloud-Services-for-VMware-Tanzu/2.1/spring-cloud-services/GUID-service-registry-index.html) is one of the proprietary VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key tenets of a microservice-based architecture. It can be difficult, and brittle in production, to hand-configure each client of a service or adopt some form of access convention. Instead, your apps can use the Service Registry to dynamically discover and call registered services.

## Prerequisites

- An already provisioned Azure Spring Cloud Enterprise tier service instance with Service Registry enabled. For more information, see [Get started](./get-started-enterprise.md).

   ![sr-overview](./media/enterprise/service-registry/overview.png)

## Use Service Registry with apps

Before your application can manage service registration and discovery using Service Registry, you must include the following dependency in your application's *pom.xml* file:

```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
```

Additionally, add an annotation to the top level class of your application as shown in the following example:

```java
    @SpringBootApplication
    @EnableEurekaClient
    public class DemoApplication {

        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
```

Use the following steps to bind an application to the Service Registry.

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app in the dropdown, then select **Apply** to bind.

   ![sr-app-bind-dropdown](./media/enterprise/service-registry/app-bind-dropdown.png)

## Next steps

* [Create Roles and Permissions](./how-to-permissions.md)
* [Access Config Server and Service Registry](./how-to-access-data-plane-azure-ad-rbac.md)
