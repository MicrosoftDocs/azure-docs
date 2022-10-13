---
title: Overview
description: Learn how Azure App Service helps you develop and host web applications

ms.assetid: 94af2caf-a2ec-4415-a097-f60694b860b3
ms.topic: overview
ms.date: 07/21/2021
ms.custom: "devx-track-dotnet, mvc, seodec18"
---

# App Service overview

*Azure App Service* is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. You can develop in your favorite language, be it .NET, .NET Core, Java, Ruby, Node.js, PHP, or Python. Applications run and scale with ease on both Windows and [Linux](#app-service-on-linux)-based environments.

App Service not only adds the power of Microsoft Azure to your application, such as security, load balancing, autoscaling, and automated management. You can also take advantage of its DevOps capabilities, such as continuous deployment from Azure DevOps, GitHub, Docker Hub, and other sources, package management, staging environments, custom domain, and TLS/SSL certificates.

With App Service, you pay for the Azure compute resources you use. The compute resources you use are determined by the *App Service plan* that you run your apps on. For more information, see [Azure App Service plans overview](overview-hosting-plans.md).

## Why use App Service?

Azure App Service is a fully managed platform as a service (PaaS) offering for developers. Here are some key features of App Service:

* **Multiple languages and frameworks** - App Service has first-class support for ASP.NET, ASP.NET Core, Java, Ruby, Node.js, PHP, or Python. You can also run [PowerShell and other scripts or executables](webjobs-create.md) as background services.
* **Managed production environment** - App Service automatically [patches and maintains the OS and language frameworks](overview-patch-os-runtime.md) for you. Spend time writing great apps and let Azure worry about the platform.
* **Containerization and Docker** - Dockerize your app and host a custom Windows or Linux container in App Service. Run multi-container apps with Docker Compose. Migrate your Docker skills directly to App Service.
* **DevOps optimization** - Set up [continuous integration and deployment](deploy-continuous-deployment.md) with Azure DevOps, GitHub, BitBucket, Docker Hub, or Azure Container Registry. Promote updates through [test and staging environments](deploy-staging-slots.md). Manage your apps in App Service by using [Azure PowerShell](/powershell/azure/) or the [cross-platform command-line interface (CLI)](/cli/azure/install-azure-cli).
* **Global scale with high availability** - Scale [up](manage-scale-up.md) or [out](../azure-monitor/autoscale/autoscale-get-started.md) manually or automatically. Host your apps anywhere in Microsoft's global datacenter infrastructure, and the App Service [SLA](https://azure.microsoft.com/support/legal/sla/app-service/) promises high availability.
* **Connections to SaaS platforms and on-premises data** - Choose from more than 50 [connectors](../connectors/apis-list.md) for enterprise systems (such as SAP), SaaS services (such as Salesforce), and internet services (such as Facebook). Access on-premises data using [Hybrid Connections](app-service-hybrid-connections.md) and [Azure Virtual Networks](./overview-vnet-integration.md).
* **Security and compliance** - App Service is [ISO, SOC, and PCI compliant](https://www.microsoft.com/en-us/trustcenter). Authenticate users with [Azure Active Directory](configure-authentication-provider-aad.md), [Google](configure-authentication-provider-google.md), [Facebook](configure-authentication-provider-facebook.md), [Twitter](configure-authentication-provider-twitter.md), or [Microsoft account](configure-authentication-provider-microsoft.md). Create [IP address restrictions](app-service-ip-restrictions.md) and [manage service identities](overview-managed-identity.md).
* **Application templates** - Choose from an extensive list of application templates in the [Azure Marketplace](https://azure.microsoft.com/marketplace/), such as WordPress, Joomla, and Drupal.
* **Visual Studio and Visual Studio Code integration** - Dedicated tools in Visual Studio and Visual Studio Code streamline the work of creating, deploying, and debugging.
* **API and mobile features** - App Service provides turn-key CORS support for RESTful API scenarios, and simplifies mobile app scenarios by enabling authentication, offline data sync, push notifications, and more.
* **Serverless code** - Run a code snippet or script on-demand without having to explicitly provision or manage infrastructure, and pay only for the compute time your code actually uses (see [Azure Functions](../azure-functions/index.yml)).

Besides App Service, Azure offers other services that can be used for hosting websites and web applications. For most scenarios, App Service is the best choice.  For microservice architecture, consider [Azure Spring Apps](../spring-apps/index.yml) or [Service Fabric](/azure/service-fabric).  If you need more control over the VMs on which your code runs, consider [Azure Virtual Machines](/azure/virtual-machines/). For more information about how to choose between these Azure services, see [Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison](/azure/architecture/guide/technology-choices/compute-decision-tree).

## App Service on Linux

App Service can also host web apps natively on Linux for supported application stacks. It can also run custom Linux containers (also known as Web App for Containers).

### Built-in languages and frameworks

App Service on Linux supports a number of language specific built-in images. Just deploy your code. Supported languages include: Node.js, Java (8, 11, and 17), Tomcat, PHP, Python, .NET Core, and Ruby. Run [`az webapp list-runtimes --os linux`](/cli/azure/webapp#az-webapp-list-runtimes) to view the latest languages and supported versions. If the runtime your application requires is not supported in the built-in images, you can deploy it with a custom container.

Outdated runtimes are periodically removed from the Web Apps Create and Configuration blades in the Portal. These runtimes are hidden from the Portal when they are deprecated by the maintaining organization or found to have significant vulnerabilities. These options are hidden to guide customers to the latest runtimes where they will be the most successful.

When an outdated runtime is hidden from the Portal, any of your existing sites using that version will continue to run. If a runtime is fully removed from the App Service platform, your Azure subscription owner(s) will receive an email notice before the removal.

If you need to create another web app with an outdated runtime version that is no longer shown on the Portal see the language configuration guides for instructions on how to get the runtime version of your site. You can use the Azure CLI to create another site with the same runtime. Alternatively, you can use the **Export Template** button on the web app blade in the Portal to export an ARM template of the site. You can reuse this template to deploy a new site with the same runtime and configuration.

#### Debian 9 End of Life

On June 30th 2022 Debian 9 (also known as "Stretch") will reach End-of-Life (EOL) status, which means security patches and updates will cease. As of June 2022, a platform update is rolling out to provide an upgrade path to Debian 11 (also known as "Bullseye"). The runtimes listed below are currently using Debian 9; if you are using one of the listed runtimes, follow the instructions below to upgrade your site to Bullseye.

- Python 3.8
- Python 3.7
- .NET 3.1
- PHP 7.4

> [!NOTE]
> To ensure customer applications are running on secure and supported Debian distributions, after February 2023 all Linux web apps still running on Debian 9 (Stretch) will be upgraded to Debian 11 (Bullseye) automatically.
>

##### Verify the platform update

First, validate that the new platform update which contains Debian 11 has reached your site.

1. Navigate to the SCM site (also known as Kudu site) of your webapp. You can browse to this site at `http://<your-site-name>.scm.azurewebsites.net/Env` (replace `\<your-site-name>` with the name of your web app).
1. Under "Environment Variables", search for `PLATFORM_VERSION`. The value of this environment variable is the current platform version of your web app. 
1. If the value of `PLATFORM_VERSION` starts with "99" or greater, then your site is on the latest platform update and you can continue to the section below. If the value does **not** show "99" or greater, then your site has not yet received the latest platform update--please check again at a later date.

Next, create a deployment slot to test that your application works properly with Debian 11 before applying the change to production.

1. [Create a deployment slot](deploy-staging-slots.md#add-a-slot) if you do not already have one, and clone your settings from the production slot. A deployment slot will allow you to safely test changes to your application (such as upgrading to Debian 11) and swap those changes into production after review. 
1. To upgrade to Debian 11 (Bullseye), create an app setting on your slot named `WEBSITE_LINUX_OS_VERSION` with a value of `DEBIAN|BULLSEYE`.

    ```bash
    az webapp config appsettings set -g MyResourceGroup -n MyUniqueApp --settings WEBSITE_LINUX_OS_VERSION="DEBIAN|BULLSEYE"
    ```
1. Deploy your application to the deployment slot using the tool of your choice (VS Code, Azure CLI, GitHub Actions, etc.)
1. Confirm your application is functioning as expected in the deployment slot.
1. [Swap your production and staging slots](deploy-staging-slots.md#swap-two-slots). This will apply the `WEBSITE_LINUX_OS_VERSION=DEBIAN|BULLSEYE` app setting to production.
1. Delete the deployment slot if you are no longer using it.

##### Resources

- [Debian Long Term Support schedule](https://wiki.debian.org/LTS)
- [Debian 11 (Bullseye) Release Notes](https://www.debian.org/releases/bullseye/)
- [Debain 9 (Stretch) Release Notes](https://www.debian.org/releases/stretch/)

### Limitations

> [!NOTE]
> Linux and Windows App Service plans can now share resource groups. This limitation has been lifted from the platform and existing resource groups have been updated to support this.
>

* App Service on Linux is not supported on [Shared](https://azure.microsoft.com/pricing/details/app-service/plans/) pricing tier.
* The Azure portal shows only features that currently work for Linux apps. As features are enabled, they're activated on the portal.
* When deployed to built-in images, your code and content are allocated a storage volume for web content, backed by Azure Storage. The disk latency of this volume is higher and more variable than the latency of the container filesystem. Apps that require heavy read-only access to content files may benefit from the custom container option, which places files in the container filesystem instead of on the content volume.

## Next steps

Create your first web app.

> [!div class="nextstepaction"]
> [ASP.NET Core (on Windows or Linux)](quickstart-dotnetcore.md)

> [!div class="nextstepaction"]
> [ASP.NET (on Windows)](./quickstart-dotnetcore.md?tabs=netframework48)

> [!div class="nextstepaction"]
> [PHP (on Windows or Linux)](quickstart-php.md)

> [!div class="nextstepaction"]
> [Ruby (on Linux)](quickstart-ruby.md)

> [!div class="nextstepaction"]
> [Node.js (on Windows or Linux)](quickstart-nodejs.md)

> [!div class="nextstepaction"]
> [Java (on Windows or Linux)](quickstart-java.md)

> [!div class="nextstepaction"]
> [Python (on Linux)](quickstart-python.md)

> [!div class="nextstepaction"]
> [HTML](quickstart-html.md)

> [!div class="nextstepaction"]
> [Custom container (Windows or Linux)](tutorial-custom-container.md)
