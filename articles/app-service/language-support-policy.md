---
title: Language Support Policy
description: App Service language runtime support policies 
author: jeffwmartinez
ms.topic: article
ms.date: 01/23/2023
ms.author: jefmarti
ms.custom: seodec18

---
# App Service language runtime support policy

This document describes the App Service language runtime support policy for updating existing stacks and retiring process for upcoming end-of-life stacks.  This policy is to clarify existing practices and doesn't represent a change to customer commitments.    

## Updates to existing stacks
App Service will update existing stacks after they become available from each community.  App Service will update major versions of stacks but can't guarantee any specific minor or patch versions.  Minor and patch versions are controlled by the platform, and it's not possible for App Service to pin a specific minor or patch version.  For example, Node 18 will be updated by App Service but a specific Node 18.x.x version won't be guaranteed.  If you need a specific minor or patch version you can use a [custom container](quickstart-custom-container.md).

## Retirements
App Service follows community support timelines for the lifecycle of the runtime.  Once community support for a given language reaches end-of-life, your applications will continue to run unchanged.  However, App Service can't provide security patches or related customer support for that runtime version past its end-of-life date.  If your application has any issues past the end-of-life date for that version, you should move up to a supported version to receive the latest security patches and features.  

> [!IMPORTANT]
> You're encouraged to upgrade the language version of your affected apps to a currently supported version. If you're running apps using an unsupported language version, you'll be required to upgrade before receiving support for your app.
>

## Notifications
End-of-life dates for runtime versions are determined independently by their respective stacks and are outside the control of App Service.  App Service will send reminder notifications to subscription owners for upcoming end-of-life runtime versions when they become available for each language.

Those who receive notifications include account administrators, service administrators, and co-administrators.  Contributors, readers, or other roles won't directly receive notifications, unless they opt-in to receive notification emails, using [Service Health Alerts](../service-health/alerts-activity-log-service-notifications-portal.md).  

## Language runtime version support timelines
To learn more about specific language support policy timelines, visit the following resources:

- [.NET and ASP.NET Core](https://aka.ms/dotnetrelease)
- [.NET Framework and ASP.NET](https://aka.ms/aspnetrelease)
- [Node](https://aka.ms/noderelease)
- [Java](https://aka.ms/javarelease)
- [Python](https://aka.ms/pythonrelease)
- [PHP](https://aka.ms/phprelease)
- [Go](https://aka.ms/gorelease)



## Configure language versions
To learn more about how to update your App Service application language versions, see the following resources:

- [.NET](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/dot_net_core.md#how-to-update-your-app-to-target-a-different-version-of-net-or-net-core)
- [Node](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md#node-on-linux-app-service)
- [Java](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/java_support.md#java-on-app-service)
- [Python](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/python_support.md#how-to-update-your-app-to-target-a-different-version-of-python)
- [PHP](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/php_support.md#how-to-update-your-app-to-target-a-different-version-of-php)
