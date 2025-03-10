---
title: Overview of Azure App Service
description: Learn how Azure App Service helps you develop and host web applications.

ms.assetid: 94af2caf-a2ec-4415-a097-f60694b860b3
ms.topic: overview
ms.date: 01/22/2025
ms.custom: UpdateFrequency3, linux-related-content
ms.author: msangapu
author: msangapu-msft
---

# App Service overview

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

*Azure App Service* is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. You can develop in your favorite language, be it .NET, .NET Core, Java, Node.js, Python, or PHP. Applications run and scale with ease on both Windows and [Linux](#app-service-on-linux)-based environments.

App Service adds the power of Microsoft Azure to your application, including improved security, load balancing, autoscaling, and automated management. Additionally, you can take advantage of its DevOps capabilities, such as continuous deployment from Azure DevOps, GitHub, Docker Hub, and other sources, package management, staging environments, custom domains, and TLS/SSL certificates.

With App Service, you pay for the Azure compute resources you use. The compute resources you use are determined by the *App Service plan* that you run your apps on. For more information, see [Azure App Service plans overview](overview-hosting-plans.md).

## Why use App Service?

Azure App Service is a fully managed platform as a service (PaaS) offering for developers. Here are some key features of App Service:

* **Multiple languages and frameworks** - App Service has first-class support for ASP.NET, ASP.NET Core, Java, Node.js, Python, and PHP. You can also run [PowerShell and other scripts or executables](webjobs-create.md) as background services.
* **Managed production environment** - App Service automatically [patches and maintains the OS and language frameworks](overview-patch-os-runtime.md) for you. Spend time writing great apps and let Azure worry about the platform.
* **Containerization and Docker** - Dockerize your app and host a custom Windows or Linux container in App Service. Run sidecar containers of your choice. Migrate your Docker skills directly to App Service.
* **DevOps optimization** - Set up [continuous integration and deployment](deploy-continuous-deployment.md) with Azure DevOps, GitHub, Bitbucket, Docker Hub, or Azure Container Registry. Promote updates through [test and staging environments](deploy-staging-slots.md). Manage your apps in App Service by using [Azure PowerShell](/powershell/azure/) or the [cross-platform command-line interface (CLI)](/cli/azure/install-azure-cli).
* **Global scale with high availability** - Scale [up](manage-scale-up.md) or [out](/azure/azure-monitor/autoscale/autoscale-get-started) manually or automatically. Host your apps anywhere in the global Microsoft datacenter infrastructure, and the App Service [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) promises high availability.
* **Connections to SaaS platforms and on-premises data** - Choose from [many hundreds of  connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) for enterprise systems (such as SAP), SaaS services (such as Salesforce), and internet services (such as Facebook). Access on-premises data using [Hybrid Connections](app-service-hybrid-connections.md) and [Azure Virtual Network](./overview-vnet-integration.md).
* **Security and compliance** - App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/trust-center). Create [IP address restrictions](app-service-ip-restrictions.md) and [managed service identities](overview-managed-identity.md). [Protect against subdomain takeovers](reference-dangling-subdomain-prevention.md).
* **Authentication** - [Authenticate users](overview-authentication-authorization.md) using the built-in authentication component. Authenticate users with [Microsoft Entra ID](configure-authentication-provider-aad.md), [Google](configure-authentication-provider-google.md), [Facebook](configure-authentication-provider-facebook.md), [X](configure-authentication-provider-twitter.md), or [Microsoft accounts](configure-authentication-provider-microsoft.md).
* **Application templates** - Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/), such as WordPress, Joomla, and Drupal.
* **Visual Studio and Visual Studio Code integration** - Dedicated tools in Visual Studio and Visual Studio Code streamline the work of creating, deploying, and debugging.
* **Java tools integration** - Develop and deploy to Azure without leaving your favorite development tools, such as Maven, Gradle, Visual Studio Code, IntelliJ, and Eclipse.
* **API and mobile features** - App Service provides turn-key CORS support for RESTful API scenarios and simplifies mobile app scenarios by enabling authentication, offline data sync, push notifications, and more.
* **Serverless code** - Run a code snippet or script on-demand without having to explicitly provision or manage infrastructure, and pay only for the compute time your code actually uses (see [Azure Functions](../azure-functions/index.yml)).

Besides App Service, Azure offers other services that can be used for hosting websites and web applications. 
For most scenarios, App Service is the best choice. For a microservice architecture, 
consider [Azure Kubernetes Service](/azure/aks/) or [Service Fabric](/azure/service-fabric/). 
If you need more control over the VMs on which your code runs, consider 
[Azure Virtual Machines](/azure/virtual-machines/). For more information about how to choose among these 
Azure services, see [Azure App Service, Azure Kubernetes Service, Virtual Machines, and other cloud services 
comparison](/azure/architecture/guide/technology-choices/compute-decision-tree).

## App Service on Linux

App Service can also host web apps natively on Linux for supported application stacks. It can also run custom Linux containers (also known as *Web App for Containers*).

### Built-in languages and frameworks

App Service on Linux supports a number of language-specific built-in images. Just deploy your code. 
Supported languages include: .NET Core, Java (Tomcat, JBoss EAP, or Java SE with an embedded web server), 
Node.js, Python, and PHP. Run [`az webapp list-runtimes --os linux`](/cli/azure/webapp#az-webapp-list-runtimes) 
to view the latest languages and supported versions. If the runtime your application requires isn't supported 
in the built-in images, you can deploy it with a custom container.

Outdated runtimes are periodically removed from the Web Apps Create and Configuration blades in the portal. These runtimes are hidden from the portal when they're deprecated by the maintaining organization or found to have significant vulnerabilities. These options are hidden to guide customers to the latest runtimes, where they'll be the most successful.

When an outdated runtime is hidden from the portal, any of your existing sites using that version will continue to run. If a runtime is fully removed from the App Service platform, your Azure subscription owner(s) will receive an email notice before the removal.

If you need to create another web app with an outdated runtime version that's no longer shown on the portal, see the language configuration guides for instructions on how to get the runtime version of your site. You can use the Azure CLI to create another site with the same runtime. Alternatively, you can use the **Export Template** button on the web app blade in the portal to export an ARM template of the site. You can reuse this template to deploy a new site with the same runtime and configuration.

### Limitations

* App Service on Linux isn't supported on the [Shared](https://azure.microsoft.com/pricing/details/app-service/plans/) pricing tier.
* The Azure portal shows only features that currently work for Linux apps. As features are enabled, they're activated on the portal.
* When deployed to built-in images, your code and content are allocated a storage volume for web content, backed by Azure Storage. The disk latency of this volume is higher and more variable than the latency of the container filesystem. Apps that require heavy read-only access to content files might benefit from the custom container option, which places files in the container filesystem instead of on the content volume.

## App Service Environment

App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps with improved security at high scale. Unlike the App Service offering, where supporting infrastructure is shared, with App Service Environment, compute is dedicated to a single customer. For more information on the differences between App Service Environment and App Service, see the [comparison](./environment/ase-multi-tenant-comparison.md).

## Next step

Create your first web app.

> [!div class="nextstepaction"]
> [Getting started](getting-started.md)

> [!div class="nextstepaction"]
> [ASP.NET (on Windows)](./quickstart-dotnetcore.md?tabs=netframework48)

> [!div class="nextstepaction"]
> [ASP.NET Core (on Windows or Linux)](quickstart-dotnetcore.md)

> [!div class="nextstepaction"]
> [Java (on Windows or Linux)](quickstart-java.md)

> [!div class="nextstepaction"]
> [Node.js (on Windows or Linux)](quickstart-nodejs.md)

> [!div class="nextstepaction"]
> [Python (on Linux)](quickstart-python.md)

> [!div class="nextstepaction"]
> [PHP (on Windows or Linux)](quickstart-php.md)

> [!div class="nextstepaction"]
> [HTML](quickstart-html.md)

> [!div class="nextstepaction"]
> [Custom container (Windows or Linux)](tutorial-custom-container.md)
