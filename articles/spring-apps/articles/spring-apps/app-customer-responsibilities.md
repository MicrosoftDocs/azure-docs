---
title:  "Customer responsibilities developing Azure Spring Apps"
description: This article describes customer responsibilities developing Azure Spring Apps.
author: zhiyongli
ms.author: zhiyongli
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/14/2023
---

# Customer responsibilities developing Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article includes specifications for the development of Azure Spring Apps.

When your Apps is deployed to Azure Spring Apps, Azure Spring Apps will provide the SDK and base image to run your apps. Azure Spring Apps will keep the SDK and image upgraded

By default, Azure Spring Apps will only integrate the LTS version for the SDKs and base images in support. Each LTS version have its own end of support timeline, you need to make sure your code upgrade to the new supported LTS version before the old LTS version is out of supported

## Java Runtime version

For details, see the [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure)

## Spring Boot and Spring Cloud versions

Azure Spring Apps will support the latest Spring Boot or Spring Cloud major version starting from 30 days after its release. The latest minor version will be supported as soon as it's released. You can get supported Spring Boot versions from [Spring Boot Releases](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions#releases) and Spring Cloud versions from [Spring Cloud Releases](https://github.com/spring-cloud/spring-cloud-release/wiki).

Apps with lower spring version can still run on Azure Spring Apps, as Azure Spring Apps will continously upgrade the managed component include config server, eureka server and matric collection, these features will out of support.

The following table lists the supported Spring Boot and Spring Cloud combinations:

### [Basic/Standard plan](#tab/basic-standard-plan)

| Spring Boot version | Spring Cloud version  |
|---------------------|-----------------------|
| 3.0.x               | 2022.0.x          |
| 2.7.x               | 2021.0.3+ aka Jubilee |

### [Enterprise plan](#tab/enterprise-plan)

| Spring Boot version | Spring Cloud version       |
|---------------------|----------------------------|
| 3.0.x               | 2022.0.x               |
| 2.7.x               | 2021.0.3+ aka Jubilee      |
| 2.6.x               | 2021.0.0+ aka Jubilee      |
| 2.5.x               | 2020.3+ aka Ilford+        |



## Enterprise Tier
### SDK Policy
As we support polyglot applications in enterprise tier, please refer the table for the support policy of each SDK and base image, upgrade your code to latest version before it is out of support
| Type | Support Policy |
|---------------------|----------------------------|
|
