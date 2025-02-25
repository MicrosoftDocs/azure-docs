---
title: Deprecation of Tanzu Components
description: Learn about the deprecation of Tanzu components.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Deprecation of Tanzu components

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes the options available for migrating away from deprecated VMware Tanzu components.

VMware Tanzu components are commercial products used in Azure Spring Apps Enterprise plan. According to Broadcom's product lifecycle, the following components have been deprecated and will reach the end of support on August 31, 2025:

- Application Configuration Service for VMware Tanzu
- Application Live View for VMware Tanzu
- Application Accelerator for VMware Tanzu

You can still provision deprecated components and they'll continue to run. However, we no longer provide updates or customer support. Microsoft reserves the right to remove these components if a critical vulnerability is detected. We'll provide early notification before taking any action.

## Migration

We provide alternative solutions on a best-effort basis considering the specific features of each component.

You can migrate Application Configuration Service to managed Spring Cloud Config Server, available in the Azure Spring Apps Enterprise plan. Due to differences in the way applications are served, you need to adjust your application configuration. For more information, see [Migrate Application Configuration Service](./migrate-enterprise-application-configuration-service.md).

You can replace Application Live View with the open-source Spring Boot Admin, which provides similar functionality. To set up Spring Boot Admin manually within your service instance, see [Migrate Application Live View](./migrate-application-live-view.md).

There's no alternative solution for Application Accelerator.

## Required action

To prevent disruptions and potential security vulnerabilities in your service instance, we recommend taking action to migrate and disable any deprecated components by August 31, 2025.

## Help and support

If you have questions, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
