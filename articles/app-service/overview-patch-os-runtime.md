---
title: OS and runtime patching
description: Learn how Azure App Service updates the OS and runtimes, how you can get update announcements, how to find your apps' runtimes and patch versions, and how to control runtime patch update timing with the Platform Release Channel feature.
ms.topic: article
ms.date: 07/31/2026
ms.update-cycle: 1095-days
ms.custom:
  - UpdateFrequency3
  - devx-track-azurecli
  - build-2025
author: cephalin
ms.author: cephalin
ms.service: azure-app-service

# Customer intent: As an App Service user, I want to learn how Azure App Service updates the OS and runtimes, what runtimes and patch level my apps has, and how I can get update announcements.

---

# Azure App Service OS and runtime patching

This article explains how [Azure App Service](overview.md) updates operating system (OS) and runtime software, how you can get version information, and how you can manually upgrade to new versions.

App Service is a Platform-as-a-Service (PaaS), so Azure manages the OS and application stack for you. You manage only your application and its data. If you need more control over the OS and application stack, you can use [Azure Virtual Machines](/azure/virtual-machines/).

It's still helpful for you as an App Service user to know information such as:

- [How and when OS updates are applied](#how-and-when-are-os-updates-applied).
- [How App Service is patched against significant and zero-day vulnerabilities](#how-does-azure-deal-with-significant-vulnerabilities).
- [When supported language runtimes are updated, added, or deprecated](#when-are-supported-language-runtimes-updated-added-or-deprecated).
- [How to control runtime patch update timing with the Platform Release Channel (Linux)](#control-runtime-patch-update-timing-with-platform-release-channel).
- [How to find out which OS and runtime versions are running your apps](#how-can-i-query-os-and-runtime-update-status-on-my-instances).

This article provides transparency on the process, and helps you stay updated on security-related announcements and runtime updates. For security reasons, certain specific security information isn't published.

## How and when are OS updates applied?

Azure manages OS patching for both the physical servers and the guest virtual machines (VMs) that run App Service resources. Both machine layers are updated monthly, aligning to the monthly [Patch Tuesday](/security-updates/) schedule.

These updates are applied automatically, while guaranteeing the high-availability service-level agreement (SLA) for Azure services. Azure App Service OS patching follows [Safe Deployment Practices (SDP)](/azure/well-architected/operational-excellence/safe-deployments) and an availability-first approach. The latest patches are applied as soon as possible, but OS patching may be slowed or paused at times to avoid app impacts and outages.

For detailed information on how updates are applied, see [Demystifying the magic behind App Service OS updates](https://azure.github.io/AppService/2018/01/18/Demystifying-the-magic-behind-App-Service-OS-updates.html).

## How does Azure deal with significant vulnerabilities?

When high-priority issues such as [zero-day vulnerabilities](https://wikipedia.org/wiki/Zero-day_(computing)) require immediate patching, Azure handles the updates on a case-by-case basis. To stay current with critical Azure security announcements, see the [Azure Security Blog](https://azure.microsoft.com/blog/product/azure-security/).

## When are supported language runtimes updated, added, or deprecated?

New stable major, minor, or patch versions of supported language runtimes are periodically added to App Service instances. Some updates overwrite the existing installation, while others are installed side-by-side with existing versions.

An overwrite installation means that your app automatically runs on the updated runtime. A side-by-side installation means you must manually migrate your app to take advantage of a new runtime version. For more information, see the following sections.

> [!NOTE] 
> This information applies to language runtimes that are built into an App Service app. A custom runtime you upload to App Service, for example, remains unchanged unless you manually upgrade it.

### New patch updates

Patch updates to .NET, PHP, Java SDK, or Tomcat version are applied automatically by overwriting the existing installation with the latest version. Node.js patch updates are installed side-by-side with the existing versions, similar to major and minor versions. New Python patch versions can be installed manually through [site extensions](https://azure.microsoft.com/blog/azure-web-sites-extensions/), side-by-side with the built-in Python installations.

### New major and minor versions

New major or minor versions are installed side-by-side with the existing versions. You can manually upgrade your app to the new version.

If you configured the runtime version in a configuration file such as *web.config* or *package.json*, you need to upgrade by using the same method. If you used an App Service setting to configure your runtime version, you can change it in the [Azure portal](https://portal.azure.com) or by running an [Azure CLI](/cli/azure/get-started-with-azure-cli) command in [Azure Cloud Shell](../cloud-shell/overview.md).

The following examples show Azure CLI configuration commands for various supported language runtimes. You replace `<appname>` and `<groupname>` with the names of your app and its resource group.

```azurecli-interactive
az webapp config set --net-framework-version v4.7 --resource-group <groupname> --name <appname>
az webapp config set --php-version 7.0 --resource-group <groupname> --name <appname>
az webapp config appsettings set --settings WEBSITE_NODE_DEFAULT_VERSION=~24 --resource-group <groupname> --name <appname>
az webapp config set --python-version 3.14 --resource-group <groupname> --name <appname>
az webapp config set --java-version 1.8 --java-container Tomcat --java-container-version 9.0 --resource-group <groupname> --name <appname>
```
> [!NOTE] 
> The Node.js example uses the recommended *tilde syntax* to target the latest available version of the Node.js 24 runtime on Windows App Service.

## Control runtime patch update timing with Platform Release Channel

> [!NOTE]
> The Platform Release Channel feature is available for **Linux App Service** only.

By default, the system automatically applies runtime patch updates when they become available. For Linux App Service, the **Platform Release Channel** setting lets you control the cadence at which runtime patch updates are delivered to your app. This control is useful when you want more predictability and time for validation before a new runtime patch is adopted in production.

### Available channels

Choose from three channels:

| Channel | Description | Recommended for |
|---|---|---|
| **Latest** | Delivers runtime patch updates as soon as they're available. | Apps where immediate access to the newest security fixes is required. Not generally recommended for production workloads. |
| **Standard** | Updates arrive at the standard release cadence, balancing currency and stability. This channel is the default. | Most production apps. |
| **Extended** | Stays typically one release behind Standard, giving workloads more time for validation before adopting a new runtime patch. | Production workloads that require extra validation time before picking up a new runtime patch. |

When a new runtime patch is released, it flows through the channels in order: **Latest** → **Standard** → **Extended**. This flow means an update that's immediately available on **Latest** reaches **Standard** after further validation, and then **Extended** after additional validation on top of that.

For example, for .NET 10, the same point in time might look like:

| Channel | .NET version |
|---|---|
| Latest | 10.0.7 |
| Standard | 10.0.4 |
| Extended | 10.0.2 |

> [!TIP]
> If your app has strict stability requirements, use the **Extended** channel to reduce the frequency of automatic runtime patch updates. If your app needs the latest security fixes as fast as possible, use **Latest**.

### Configure the platform release channel

1. In the [Azure portal](https://portal.azure.com), go to your App Service app.
1. In the left menu, select **Stack settings**.
1. Under **Platform Release Channel**, select the channel you want: **Latest**, **Standard**, or **Extended**.
1. Select **Save**.

For more information about this feature, see the [Platform Release Channel blog announcement](https://azure.github.io/AppService/2026/05/06/platform-release-channel.html).

## How can I query OS and runtime update status on my instances?

The [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) lets you query the OS version and runtime versions of your App Service instances. Critical OS information is locked down from access. For more information, see [Operating system functionality on Azure App Service](operating-system-functionality.md).

The following table shows how to use Kudu or Cloud Shell commands to find the Windows and language runtime versions that are running your apps. Replace `<appname>` and `<groupname>` with your app and resource group names.

| Information | Where to find it |
|-|-|
| Windows version | See `https://<appname>.scm.azurewebsites.net/Env#sysinfo`. |
| .NET version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run the following command at the command prompt: <br>`reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full"`. |
| .NET Core version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run `dotnet --version`. |
| PHP version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run `php --version`. |
| Default Node.js version | In the [Cloud Shell](../cloud-shell/overview.md), run the following command: <br> `az webapp config appsettings list --resource-group <groupname> --name <appname> --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION']"`. |
| Python version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run `python --version`. |
| Java version | At `https://<appname>.scm.azurewebsites.net/DebugConsole`, run `java -version`. |

> [!NOTE]  
> Access to registry location `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Packages`, where information on [Security Bulletins](/security-updates/SecurityBulletins/securitybulletins) is stored, is locked down.

## Related content

- [Microsoft Security](https://www.microsoft.com/security)
- [64-bit ASP.NET Core on Azure App Service](https://gist.github.com/glennc/e705cd85c9680d6a8f1bdb62099c7ac7)
- [Platform Release Channel blog announcement](https://azure.github.io/AppService/2026/05/06/platform-release-channel.html)
