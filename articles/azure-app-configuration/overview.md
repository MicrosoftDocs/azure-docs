---
title: What is Azure App Configuration?
description: Read an overview of the Azure App Configuration service. Understand why you would want to use App Configuration, and learn how you can use it.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: overview
ms.date: 03/20/2023
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

The easiest way to add an App Configuration store to your application is through a client library provided by Microsoft. The following methods are available to connect with your application, depending on your chosen language and framework.

|Programming language and framework | How to connect                                                                                                   | Quickstart                                                 |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| .NET Core                         | App Configuration [provider](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration) for .NET Core | .NET Core [quickstart](./quickstart-dotnet-core-app.md)    |
| ASP.NET Core                      | App Configuration [provider](/dotnet/api/Microsoft.Extensions.Configuration.AzureAppConfiguration) for .NET Core | ASP.NET Core [quickstart](./quickstart-aspnet-core-app.md) |
| .NET Framework and ASP.NET        | App Configuration [builder](https://go.microsoft.com/fwlink/?linkid=2074663) for .NET                            | .NET Framework [quickstart](./quickstart-dotnet-app.md)    |
| Java Spring                       | App Configuration [provider](https://go.microsoft.com/fwlink/?linkid=2180917) for Spring Cloud                   | Java Spring [quickstart](./quickstart-java-spring-app.md)  |
| JavaScript/Node.js                | App Configuration [client](https://go.microsoft.com/fwlink/?linkid=2103664) for JavaScript                       | Javascript/Node.js [quickstart](./quickstart-javascript.md)|
| Python                            | App Configuration [client](https://go.microsoft.com/fwlink/?linkid=2103727) for Python                           | Python [quickstart](./quickstart-python.md)                |
| Other                             | App Configuration [REST API](/rest/api/appconfiguration/)                                                        | None                                                       |

## Next steps

> [!div class="nextstepaction"]
> [Best practices](howto-best-practices.md)

> [!div class="nextstepaction"]
> [FAQ](faq.yml)
> 
> [!div class="nextstepaction"]
> [Create an App Configuration store](quickstart-azure-app-configuration-create.md) 

