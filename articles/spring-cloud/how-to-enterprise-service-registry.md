---
title: How to Use Tanzu Service Registry with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to use Tanzu Service Registry with Azure Spring Apps Enterprise Tier.
author: karlerickson
ms.author: xiading
ms.service: spring-cloud
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Use Tanzu Service Registry

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Tanzu® Service Registry with Azure Spring Apps Enterprise Tier.

[Tanzu Service Registry](https://docs.vmware.com/en/Spring-Cloud-Services-for-VMware-Tanzu/2.1/spring-cloud-services/GUID-service-registry-index.html) is one of the commercial VMware Tanzu components. It provides your apps with an implementation of the Service Discovery pattern, one of the key tenets of a Spring-based architecture. It can be difficult, and brittle in production, to hand-configure each client of a service or adopt some form of access convention. Instead, your apps can use Tanzu Service Registry to dynamically discover and call registered services.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance with Tanzu Service Registry enabled. For more information, see [Quickstart: Provision an Azure Spring Apps service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).

  > [!NOTE]
  > To use Tanzu Service Registry, you must enable it when you provision your Azure Spring Apps service instance. You cannot enable it after provisioning at this time.

## Use Service Registry with apps

Before your application can manage service registration and discovery using Tanzu Service Registry, you must include the following dependency in your application's *pom.xml* file:

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

Use the following steps to bind an application to Tanzu Service Registry.

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app in the dropdown, then select **Apply** to bind.

   :::image type="content" source="media/enterprise/how-to-enterprise-service-registry/service-reg-app-bind-dropdown.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Service Registry page and 'App binding' section with 'Bind app' dropdown showing.":::

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to make the change take effect.

## Next steps

- [Create Roles and Permissions](./how-to-permissions.md)
