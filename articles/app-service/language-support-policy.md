---
title: Language runtime support policy
description: Learn about the language runtime support policy for Azure App Service. 
author: jeffwmartinez
ms.topic: article
ms.date: 01/23/2023
ms.author: jefmarti
ms.custom: seodec18

---

# Language runtime support policy for App Service

This article describes the language runtime support policy for updating existing stacks and retiring end-of-support stacks in Azure App Service. This policy clarifies existing practices and doesn't represent a change to customer commitments.

## Updates to existing stacks

App Service updates existing stacks after they become available from each community. App Service updates major versions of stacks but can't guarantee any specific minor or patch versions. The platform controls minor and patch versions. For example, App Service updates Node 18 but doesn't guarantee a specific Node 18.x.x version. If you need a specific minor or patch version, you can use a [custom container](quickstart-custom-container.md).

## Retirements

App Service follows community support timelines for the lifecycle of the runtime. After community support for a language reaches the end of support, your applications continue to run unchanged. However, App Service can't provide security patches or related customer support for that runtime version past its end-of-support date. If your application has any problems past the end-of-support date for that version, you should move up to a supported version to receive the latest security patches and features.

> [!IMPORTANT]
> If you're running apps that use an unsupported language version, you need to upgrade to a supported language version before you can get support for those apps.

## Notifications

End-of-support dates for runtime versions are determined independently by their respective stacks and are outside the control of App Service. App Service sends reminder notifications to subscription owners for upcoming end-of-support runtime versions when they become available for each language.

People who receive notifications include account administrators, service administrators, and co-administrators. Contributors, readers, or other roles don't directly receive notifications, unless they opt in to receive notification emails through [service health alerts](../service-health/alerts-activity-log-service-notifications-portal.md).

## Timelines for language runtime version support

To learn more about specific timelines for the language support policy, see the following resources:

- [.NET and ASP.NET Core](https://aka.ms/dotnetrelease)
- [.NET Framework and ASP.NET](https://aka.ms/aspnetrelease)
- [Node](https://aka.ms/noderelease)
- [Java](https://aka.ms/javarelease)
- [Python](https://aka.ms/pythonrelease)
- [PHP](https://aka.ms/phprelease)
- [Go](https://aka.ms/gorelease)

## Configure language versions

To learn more about how to update language versions for your App Service applications, see the following resources:

- [.NET](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/dot_net_core.md#how-to-update-your-app-to-target-a-different-version-of-net-or-net-core)
- [Node](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md#node-on-linux-app-service)
- [Java](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/java_support.md#java-on-app-service)
- [Python](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/python_support.md#how-to-update-your-app-to-target-a-different-version-of-python)
- [PHP](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#how-to-update-your-app-to-target-a-different-version-of-php)
