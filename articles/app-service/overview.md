---
title: App Service overview - Azure | Microsoft Docs
description: Learn how Azure App Service helps you develop and host web applications
services: app-service\web
documentationcenter: ''
author: cephalin
manager: jpconnoc
editor: ''

ms.assetid: 94af2caf-a2ec-4415-a097-f60694b860b3
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 06/03/2019
ms.author: cephalin
ms.custom: mvc
ms.custom: seodec18

---
# App Service overview

*Azure App Service* is a service for hosting web applications, REST APIs, and mobile back ends, whether on Windows or on Linux. It's a fully-managed application platform, including networking, OS, and software stack.

With App Service, you can spend your time on writing great apps and simply deploy them to App Service, and immediately benefit from the power of Azure, such as load balancing, auto-scaling, automated management, and security. You can also take advantage of its DevOps capabilities, such as continuous deployment from Azure DevOps, GitHub, Docker Hub, and other sources, package management, staging environments, custom domain, and SSL certificates.

The App Service software stack supports .NET, .NET Core, Java, Ruby, Node.js, PHP, and Python (bring-your-own-code). If you want to customize the software stack, or run an unsupported language framework, you can also run a Windows or Linux container directly in App Service (bring-your-own-container).

With App Service, you pay for the Azure compute resources you use. The compute resources you use is determined by the _App Service plan_ that you run your apps on. For more information, see [Azure App Service plans overview](overview-hosting-plans.md).

## Web, Mobile, and API

Depending on your application scenario, you may know App Service as *Web App*, *Mobile App*, or *API App*.  Each of these app types is an App Service app, and contains the same set of platform capabilities. The name refers to a specific subset of the App Service features that are particular to the scenario. For example:

- For API App, App Service provides turn-key [CORS support](app-service-web-tutorial-rest-api.md). This feature is also useful for a RESTful API running on Web App.
- For Mobile App, client SDKs for popular mobile platforms enable seamless authentication with App Service, push notifications, and offline data synchronization. For more information, see [About Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md). The [authentication and authorization](overview-authentication-authorization.md) feature is also useful for a Web App or API App.

## Why use App Service

Here are some key features of App Service:

* **Multiple languages and frameworks** - App Service has first-class support for ASP.NET, ASP.NET Core, Java, Ruby, Node.js, PHP, or Python. You can also run [PowerShell and other scripts or executables](webjobs-create.md) as background services.
* **Visual Studio integration** - Dedicated tools in Visual Studio streamline the work of creating, deploying, and debugging.
* **DevOps optimization** - Set up [continuous integration and deployment](deploy-continuous-deployment.md) with Azure DevOps, GitHub, BitBucket, Docker Hub, or Azure Container Registry. Promote updates through [test and staging environments](deploy-staging-slots.md). Manage apps with [Azure PowerShell](/powershell/azureps-cmdlets-docs) or the [Azure CLI](/cli/azure/install-azure-cli).
* **Application templates** - Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/), such as WordPress, Joomla, and Drupal.
* **Global scale with high availability** - Scale [up](web-sites-scale.md) or [out](../monitoring-and-diagnostics/insights-how-to-scale.md), manually or automatically. Host your apps anywhere in Microsoft's global datacenter infrastructure, and the App Service [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) promises high availability.
* **Connections to SaaS platforms and on-premises data** - Choose from more than 50 [connectors](../connectors/apis-list.md) for enterprise systems (such as SAP), SaaS services (such as Salesforce), and internet services (such as Facebook). Access on-premises data using [Hybrid Connections](app-service-hybrid-connections.md) and [Azure Virtual Networks](web-sites-integrate-with-vnet.md).
* **Security and compliance** - App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/en-us/trustcenter). Authenticate users with [Azure Active Directory](configure-authentication-provider-aad.md) or with social login ([Google](configure-authentication-provider-google.md), [Facebook](configure-authentication-provider-facebook.md), [Twitter](configure-authentication-provider-twitter.md), and [Microsoft](configure-authentication-provider-microsoft.md)). Create [IP address restrictions](app-service-ip-restrictions.md) and [managed identities](overview-managed-identity.md).
* **Isolation and single-tenancy** - Save cost by testing your app on multi-tenanted VM instances, or isolate your production app on dedicated instances, or get full network isolation with [App Service Environments](environment/intro.md).
* **Containerized apps** - Bring your own code and let Azure manage everything else, or run your own custom containers (Windows or Linux) on App Service.

## Languages

App Service on Linux supports a number of Built-in images in order to increase developer productivity. If the runtime your application requires is not supported in the built-in images, there are instructions on how to [build your own Docker image](tutorial-custom-docker-image.md) to deploy to Web App for Containers.

| OS | Supported language stacks |
|-|-|
| Windows | [ASP.NET](configure-language-dotnet.md) [.NET Core](configure-language-dotnetcore.md), [Node.js](configure-language-nodjs.md), [PHP](configure-language-php.md), [custom container]() |
| Linux | [ASP.NET Core](configure-language-dotnetcore.md), [Node.js](configure-language-nodjs.md), [PHP](configure-language-php.md), [Java](configure-language-java.md), [Python](configure-language-python.md), [Ruby](configure-language-ruby.md), [custom container]() |

Besides App Service, Azure offers other services that can be used for hosting websites and web applications. For most scenarios, App Service is the best choice.  For microservice architecture, consider [Service Fabric](https://azure.microsoft.com/documentation/services/service-fabric). If you need more control over the VMs that your code runs on, consider [Azure Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/). For more information about how to choose between these Azure services, see [Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison](/azure/architecture/guide/technology-choices/compute-decision-tree).

## Next steps

Create your first web app.

> [!div class="nextstepaction"]
> [ASP.NET Core](app-service-web-get-started-dotnet.md)

> [!div class="nextstepaction"]
> [ASP.NET](app-service-web-get-started-dotnet-framework.md)

> [!div class="nextstepaction"]
> [PHP](app-service-web-get-started-php.md)

> [!div class="nextstepaction"]
> [Ruby](containers/quickstart-ruby.md)

> [!div class="nextstepaction"]
> [Node.js](app-service-web-get-started-nodejs.md)

> [!div class="nextstepaction"]
> [Java](app-service-web-get-started-java.md)

> [!div class="nextstepaction"]
> [Python](containers/quickstart-python.md)

> [!div class="nextstepaction"]
> [HTML](app-service-web-get-started-html.md)
