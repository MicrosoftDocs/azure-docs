---
title: OS and runtime patching in Azure App Service | Microsoft Docs
description: Describes how Azure App Service updates the OS and runtimes, and how you can get update announcements.
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/02/2018
ms.author: cephalin
---

# OS and runtime patching in Azure App Service

This article shows you how to get certain version information regarding the OS or software in [App Service](app-service-web-overview.md). 

App Service is a Platform-as-a-Service, which means that the OS and application stack are managed for you by Azure; you only manage your application and its data. More control over the OS and application stack is available you in [Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/). With that in mind, it is nevertheless helpful for you as an App Service user to know more information, such as:

-	How and when are OS updates applied?
-	How is App Service patched against significant vulnerabilities (such as zero-day)?
-	Which OS and runtime versions are running your apps?

For security reasons, certain specifics of security information are not published. However, the article aims to alleviate concerns by maximizing transparency on the process, and how you can stay up-to-date on security-related announcements or runtime updates.

## How and when are OS updates applied?

Azure manages OS patching on two levels, the physical servers and the guest virtual machines (VMs) that run the App Service resources. Both are updated monthly, which aligns to the monthly [Patch Tuesday](https://technet.microsoft.com/security/bulletins.aspx) schedule. These updates are applied automatically, in a way that guarantees the high-availability SLA of Azure services. 

For detailed information on how updates are applied, see [Demystifying the magic behind App Service OS updates](https://blogs.msdn.microsoft.com/appserviceteam/2018/01/18/demystifying-the-magic-behind-app-service-os-updates/).

## How does Azure deal with significant vulnerabilities?

When severe vulnerabilities require immediate patching, such as [zero-day vulnerabilities](https://wikipedia.org/wiki/Zero-day_(computing)), the high-priority updates are handled on a case-by-case basis.

Stay current with critical security announcements in Azure by visiting [Azure Security Blog](https://azure.microsoft.com/blog/topics/security/). 

## When are supported language runtimes updated, added, or deprecated?

New stable versions of supported language runtimes (major, minor, or patch) are periodically added to App Service instances. Some updates overwrite the existing installation, while others are installed side by side with existing versions. An overwrite installation means that your app automatically runs on the updated runtime. A side-by-side installation means you must manually migrate your app to take advantage of a new runtime version. For more information, see one of the subsections.

Runtime updates and deprecations are announced here:

- https://azure.microsoft.com/updates/?product=app-service 
- https://github.com/Azure/app-service-announcements/issues

> [!NOTE] 
> Information here applies to language runtimes that are built into an App Service app. A custom runtime you upload to App Service, for example, remains unchanged unless you manually upgrade it.
>
>

### New patch updates

Patch updates to .NET, PHP, Java SDK, or Tomcat/Jetty version are applied automatically by overwriting the existing installation with the new version. Node.js patch updates are installed side by side with the existing versions (similar to major and minor versions in the next section). New Python patch versions can be installed manually through [site extensions](https://www.siteextensions.net/packages?q=Tags%3A%22python%22)), side by side with the built-in Python installations.

### New major and minor versions

When a new major or minor version is added, it is installed side by side with the existing versions. You can manually upgrade your app to the new version. If you configured the runtime version in a configuration file (such as `web.config` and `package.json`), you need to upgrade with the same method. If you used an App Service setting to configure your runtime version, you can change it in the [Azure portal](https://portal.azure.com) or by running an [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) command in the [Cloud Shell](../cloud-shell/overview.md), as shown in the following examples:

```azurecli-interactive
az webapp config set --net-framework-version v4.7 --resource-group <groupname> --name <appname>
az webapp config set --php-version 7.0 --resource-group <groupname> --name <appname>
az webapp config appsettings set --settings WEBSITE_NODE_DEFAULT_VERSION=8.9.3 --resource-group <groupname> --name <appname>
az webapp config set --python-version 3.4 --resource-group <groupname> --name <appname>
az webapp config set --java-version 1.8 --java-container Tomcat --java-container-version 9.0 --resource-group <groupname> --name <appname>
```

### Deprecated versions  

When an older version is deprecated, the removal date is announced so that you can plan your runtime version upgrade accordingly. 

## How can I query OS and runtime update status on my instances?  

While critical OS information is locked down from access (see [Operating system functionality on Azure App Service](web-sites-available-operating-system-functionality.md)), the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) enables you to query your App Service instance regarding the OS version and runtime versions. 

The following table shows how to the versions of Windows and of the language runtime that are running your apps:

| Information | Where to find it | 
|-|-|
| Windows version | See `https://<appname>.scm.azurewebsites.net/Env.cshtml` (under System info) |
| .NET version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run the following command in the command prompt: <br>`powershell -command "gci 'Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Net Framework Setup\NDP\CDF'"` |
| .NET Core version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run the following command in the command prompt: <br> `dotnet --version` |
| PHP version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run the following command in the command prompt: <br> `php --version` |
| Default Node.js version | In the [Cloud Shell](../cloud-shell/overview.md), run the following command: <br> `az webapp config appsettings list --resource-group <groupname> --name <appname> --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION']"` |
| Python version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run the following command in the command prompt: <br> `python --version` |  

> [!NOTE]  
> Access to registry location `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Packages`, where information on ["KB" patches](https://docs.microsoft.com/security-updates/SecurityBulletins/securitybulletins) is stored, is locked down.
>
>

## More resources

[Trust Center: Security](https://www.microsoft.com/en-us/trustcenter/security)  
[64 bit ASP.NET Core on Azure App Service](https://gist.github.com/glennc/e705cd85c9680d6a8f1bdb62099c7ac7)
