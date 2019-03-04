---
title: What is Azure App Configuration | Microsoft Docs
description: An overview of the Azure App Configuration service.
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.service: azure-app-configuration
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 02/24/2019
ms.author: yegu
---

# What is Azure App Configuration

Azure App Configuration provides a service for managing application settings centrally. Modern programs, especially those running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. App Configuration lets you store all settings for your application and secure their accesses in one place.

App Configuration service is in **private preview**. It is free to use during the preview period. Please [register](https://aka.ms/azconfig/register) for the preview if you are interested in trying it out.

## Why use App Configuration

Cloud-based applications often run on multiple virtual machines or containers in multiple regions and use multiple external services. Creating such a distributed application that is robust and scalable is a real challenge. Various programming methodologies have risen to help developers dealing with the increasing complexity of building these applications. For example, the 12-factor app details many well-tested architectural patterns and best practices for use with cloud applications. One key recommendation from this guide is to separate configuration from code. This means that an application’s configuration such as settings should be kept external to its executable and read in from its runtime environment or an external source.

While any application can make use of it, the followings are good examples of the types of application that should utilize App Configuration:

* Microservices based on AKS, Service Fabric, or other containerized apps deployed in one or more geographies.
* Serverless apps, including Azure Functions or other event-driven stateless compute apps.
* Continuous deployment pipeline.

App Configuration offers the following benefits:

* A fully managed service that can be set up in minutes.
* Flexible key representations and mappings.
* Tagging with labels.
* Point-in-time replay of settings.
* Comparison of two sets of configurations on custom-defined dimensions.
* Enhanced security through Azure-managed identities.
* Complete data encryptions, at rest or in transit.
* Native integration with popular frameworks.

App Configuration complements [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) used for storing application secrets. App Configuration make it easier to implement following scenarios:

* Centralized management and distribution of hierarchical configuration data for different environments and geographies.
* Dynamic configuration changes without redeploying or restarting an application.
* Feature management.

## How to use App Configuration

The easiest way to add an app configuration store to your application is through a client library that Microsoft provides. Depending on the programming language and framework, the followings show the best methods available to you:

| Programming language and framework | How to connect |
|---|---|
| **.NET Core** and **ASP.NET Core** | App Configuration configuration provider for .NET Core. |
| **.NET** and **ASP.NET** | App Configuration configuration builder for .NET. |
| **Java Spring** | App Configuration configuration client for Spring Cloud. |
| Others | App Configuration REST API. |

## Next steps

* [Quickstart: Create an ASP.NET web app](quickstart-aspnet-core-app.md)  
