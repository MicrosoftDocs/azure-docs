---
title: Version support for Java, Spring Boot, and more
titleSuffix: Azure Spring Apps
description: This article describes customer responsibilities developing Azure Spring Apps.
author: KarlErickson
ms.author: zhiyongli
ms.service: spring-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 08/10/2023
---

# Version support for Java, Spring Boot, and more

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article describes the support policy for Java, Spring Boot, and Spring Cloud versions for all Azure Spring Apps plans, and versions of other SDKs and OS images for the Enterprise plan.

Azure Spring Apps provides and maintains the SDKs and base OS images necessary to run your apps. To make sure your applications are compatible with such managed components, follow the version support policy for the components described in this article.

## Version support for all plans

The following sections describe the version support that applies to all plans.

### Java runtime version

You can choose any LTS Java version as the major version that's officially supported and receives regular updates.

For more information, see [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).

### Spring Boot and Spring Cloud versions

You can choose any version of Spring Boot or Spring Cloud that's compatible with the Java version you installed.

For new versions, Azure Spring Apps supports the latest Spring Boot or Spring Cloud major version starting 30 days after its release. The latest minor version is supported as soon as it's released.

For old versions, Azure Spring Apps doesn't require you to upgrade Spring Boot or Spring Cloud to receive support. However, with the officially supported new versions, you can get the best experience with some of the managed components - for example, Config Server and Eureka Server for the Standard consumption and dedicated plan and the Standard plan, [Tanzu components](vmware-tanzu-components.md) for the Enterprise plan, and metric collection for all plans.

For more information, see the official support timeline of [Spring Boot](https://spring.io/projects/spring-boot#support) and [Spring Cloud](https://spring.io/projects/spring-cloud#overview). The Enterprise plan provides commercial support for Spring Boot, while the other plans provide OSS support.

## Version support for the Enterprise plan

The following sections describe the version support that applies to the Enterprise plan.

### Polyglot SDKs

You can deploy polyglot applications to the Enterprise plan with source code. To enjoy the best stability, use SDKs with LTS versions that are officially supported.

When you deploy your polyglot applications to the Enterprise plan, assign specific LTS versions for the SDKs. Otherwise, the default SDK version might change during the regular upgrades for builder components. For more information about deploying polygot apps, see [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

| Type   | Support policy                                                                                              |
|--------|-------------------------------------------------------------------------------------------------------------|
| Java   | [Java support on Azure](/azure/developer/java/fundamentals/java-support-on-azure)                           |
| Tomcat | [Tomcat versions](https://tomcat.apache.org/whichversion.html)                                              |
| .NET   | [.NET and .NET core support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core) |
| Python | [Status of Python versions](https://devguide.python.org/versions/)                                          |
| Go     | [Go release history](https://go.dev/doc/devel/release)                                                      |
| NodeJS | [Nodejs releases](https://nodejs.dev/en/about/releases/)                                                    |
| PHP    | [PHP supported versions](https://www.php.net/supported-versions.php)                                        |

### Stack image support

You can choose any stack image during builder configuration. We recommend using an LTS image that's officially supported. For more information, see [The Ubuntu lifecycle and release cadence](https://ubuntu.com/about/release-cycle#ubuntu).

## Keep track of version upgrade

Prepare early for the deprecation of any major component LTS version that your applications rely on. You'll receive notification from Microsoft one month prior to the end of support on Azure Spring Apps.

For regular upgrades, you can find specific information in your activity log after the upgrade is complete.
