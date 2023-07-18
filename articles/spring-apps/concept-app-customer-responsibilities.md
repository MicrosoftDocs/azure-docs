---
title:  "Version support for Java, Spring Boot and more"
description: This article describes customer responsibilities developing Azure Spring Apps.
author: zhiyongli
ms.author: zhiyongli
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/14/2023
---

# Version support for Java, Spring Boot and more

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article specifies the support policy of Java, Spring Boot and Spring Cloud versions for all tiers of Azure Spring Apps, and versions of other SDKs and OS images for Enterprise Tier.

Azure Spring Apps provides and maintains the SDKs and base OS images necessary to run your apps. To make sure your applications are compatible with such managed components, we will describe in this article the version support policy for the components that you may be interested in.

## Version support for all tiers

### Java runtime version

You may choose any LTS Java version as the major version, as long as it is still within official support, and we will regularly upgrade the minor version as described in our [maintenance policy](concept-maintenance-policy.md).

For details, see the [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).

### Spring Boot and Spring Cloud versions

You may choose any version of Spring Boot or Spring Cloud as long as it is compatible with your Java version.

For new versions, Azure Spring Apps will support the latest Spring Boot or Spring Cloud major version starting from 30 days after its release. The latest minor version will be supported as soon as it is released.

For old versions, Azure Spring Apps does not require you to upgrade Spring Boot or Spring Cloud to keep pace with the official support. However, with the officially supported versions, you are guaranteed to enjoy the best experience for some of our managed components, such as Config Server and Eureka Server for Standard Tier, [Tanzu components](vmware-tanzu-components.md) for Enterprise Tier, and metric collection for all tiers.

You may check the official support timeline of [Spring Boot](https://spring.io/projects/spring-boot#support) and [Spring Cloud](https://spring.io/projects/spring-cloud#overview) for more information. The Enterprise Tier provides commercial support for Spring Boot, while the other tiers provides OSS support.

## Version support for Enterprise Tier

### Polyglot SDKs

Polyglot applications can be deployed in Enterprise Tier with source code. To enjoy the best stability, we recommend you to use SDKs with LTS versions within official support in your source code.

When you [deploy your polyglot applications to Enterprise Tier](how-to-enterprise-deploy-polyglot-apps.md), we recommend assigning specific LTS versions for the SDKs. Otherwise the default SDK version may change during our regular upgrades for builder components.

| Type                 | Support Policy            |
|---------------------|----------------------------|
|Java|[Java Support On Azure](/azure/developer/java/fundamentals/java-support-on-azure)
|Tomcat |[Tomcat Versions](https://tomcat.apache.org/whichversion.html)
|.Net|[.NET and .NET Core Support Policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
|Python|[Status of Python versions](https://devguide.python.org/versions/)
|Go|[Go Release History](https://go.dev/doc/devel/release)
|NodeJS|[Nodejs releases](https://nodejs.dev/en/about/releases/)

### Stack Image Support

You may choose your stack image during builder configuration, and we recommend using a LTS image within official support. Please refer to [The Ubuntu lifecycle and release cadence](https://ubuntu.com/about/release-cycle#ubuntu) for more information.

# Keeping track of version upgrade

Please prepare early for the retirement of any major component LTS version that your applications rely on. You will receive an notification email from Microsoft one month prior to its end of support on Azure Spring Apps.

For regular upgrades, you can find specific information in your Activity Log once an upgrade finishes.