---
title: What is Azure App Configuration?
description: An overview of the Azure App Configuration service.
author: lisaguthrie
ms.author: lcozzens
ms.service: azure-app-configuration
ms.topic: overview
ms.date: 02/19/2020
---

# What is Azure App Configuration?

Azure App Configuration provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.

## Why use App Configuration?

Cloud-based applications often run on multiple virtual machines or containers in multiple regions and use multiple external services. Creating a robust and scalable application in a distributed environment presents a significant challenge.

Various programming methodologies help developers deal with the increasing complexity of building applications. For example, the [Twelve-Factor App](https://12factor.net/) describes many well-tested architectural patterns and best practices for use with cloud applications. One key recommendation from this guide is to separate configuration from code. An application’s configuration settings should be kept external to its executable and read in from its runtime environment or an external source.

While any application can make use of App Configuration, the following examples are the types of application that benefit from the use of it:

* Microservices based on Azure Kubernetes Service, Azure Service Fabric, or other containerized apps deployed in one or more geographies
* Serverless apps, which include Azure Functions or other event-driven stateless compute apps
* Continuous deployment pipeline

App Configuration offers the following benefits:

* A fully managed service that can be set up in minutes
* Flexible key representations and mappings
* Tagging with labels
* Point-in-time replay of settings
* Dedicated UI for feature flag management
* Comparison of two sets of configurations on custom-defined dimensions
* Enhanced security through Azure-managed identities
* Encryption of sensitive information at rest and in transit
* Native integration with popular frameworks

App Configuration complements [Azure Key Vault](https://azure.microsoft.com/services/key-vault/), which is used to store application secrets. App Configuration makes it easier to implement the following scenarios:

* Centralize management and distribution of hierarchical configuration data for different environments and geographies
* Dynamically change application settings without the need to redeploy or restart an application
* Control feature availability in real-time

## Use App Configuration

The easiest way to add an App Configuration store to your application is through a client library provided by Microsoft. The following methods are available to connect with your application, depending on your chosen language and framework

| Programming language and framework | How to connect |
|---|---|
| .NET Core and ASP.NET Core | App Configuration provider for .NET Core |
| .NET Framework and ASP.NET | App Configuration builder for .NET |
| Java Spring | App Configuration client for Spring Cloud |
| Others | App Configuration REST API |

## Next steps

* [ASP.NET Core quickstart](./quickstart-aspnet-core-app.md)
* [.NET Core quickstart](./quickstart-dotnet-core-app.md)
* [.NET Framework quickstart](./quickstart-dotnet-app.md)
* [Azure Functions quickstart](./quickstart-azure-functions-csharp.md)
* [Java Spring quickstart](./quickstart-java-spring-app.md)
* [ASP.NET Core feature flag quickstart](./quickstart-feature-flag-aspnet-core.md)
* [Spring Boot feature flag quickstart](./quickstart-feature-flag-spring-boot.md)
