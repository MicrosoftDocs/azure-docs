---
title:  Version support for Java, Spring Boot, and more
description: This article describes customer responsibilities developing Azure Spring Apps.
author: zhiyongli
ms.author: zhiyongli
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/14/2023
---

# Version support for Java, Spring Boot, and more

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article describes the support policy of Java, Spring Boot, and Spring Cloud versions for all tiers of Azure Spring Apps, and versions of other SDKs and OS images for the Enterprise tier.

Azure Spring Apps provides and maintains the SDKs and base OS images necessary to run your apps. To make sure your applications are compatible with such managed components, follow the version support policy for the components described in this article.

## Version support for all tiers

### Java runtime version

You may choose any LTS Java version as the major version, as long as it's officially supported and receives regular updates as a part of the auto patching process.

For more information, see [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).

### Spring Boot and Spring Cloud versions

You may choose any version of Spring Boot or Spring Cloud as long as it's compatible with your Java version.

For new versions, Azure Spring Apps will support the latest Spring Boot or Spring Cloud major version starting from 30 days after its release. The latest minor version will be supported as soon as it's released.

For old versions, Azure Spring Apps doesn't require you to upgrade Spring Boot or Spring Cloud to keep pace with the official support. However, with the officially supported versions, you're guaranteed to enjoy the best experience for some of our managed components, such as Config Server and Eureka Server for Standard consumption/dedicated tier and Standard tier, [Tanzu components](vmware-tanzu-components.md) for Enterprise tier, and metric collection for all tiers.

For more information, see the official support timeline of [Spring Boot](https://spring.io/projects/spring-boot#support) and [Spring Cloud](https://spring.io/projects/spring-cloud#overview). The Enterprise tier provides commercial support for Spring Boot, while the other tiers provide OSS support.

## Version support for Enterprise tier

### Polyglot SDKs

Polyglot applications can be deployed in Enterprise tier with a source code. To enjoy the best stability, we recommend using SDKs with LTS versions that are officially supported in your source code.

When you [deploy your polyglot applications to Enterprise tier](how-to-enterprise-deploy-polyglot-apps.md), we recommend assigning specific LTS versions for the SDKs. Otherwise the default SDK version may change during our regular upgrades for builder components.

| Type                 | Support policy            |
|---------------------|----------------------------|
|Java|[Java support on Azure](/azure/developer/java/fundamentals/java-support-on-azure)
|Tomcat |[Tomcat versions](https://tomcat.apache.org/whichversion.html)
|.NET|[.NET and .NET core support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
|Python|[Status of Python versions](https://devguide.python.org/versions/)
|Go|[Go release history](https://go.dev/doc/devel/release)
|NodeJS|[Nodejs releases](https://nodejs.dev/en/about/releases/)
|PHP| [PHP supported versions](https://www.php.net/supported-versions.php)

### Stack image support

You may choose your stack image during builder configuration, and we recommend using an LTS image that is officially supported. For more information, see [The Ubuntu lifecycle and release cadence](https://ubuntu.com/about/release-cycle#ubuntu).

## Keep track of version upgrade

Prepare early for the deprecation of any major component LTS version that your applications rely on. You'll receive notification from Microsoft one month prior to its end of support on Azure Spring Apps.

For regular upgrades, you can find specific information in your activity log once the upgrade is complete.
