<properties
	pageTitle="Azure Diagnostics Version History"
	description="Explanation of changes in the different versions of Azure diagnostics as shipped with different Microsoft Azure SDKs versions."
	services="multiple"
	documentationCenter=".net"
	authors="rboucher"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="02/12/2016"
	ms.author="robb"/>


# Microsoft Azure Diagnostics Version History

New to Azure Diagnostics? See [Azure Diagnostics Overview](azure-diagnostics.md).

Each version of Azure SDK typically ships with a new version of Azure Diagnostics. The table below describes the Azure SDK and Azure Diagnostics versions associated with the SDK release.



Azure SDK version | Azure Diagnostics version | Model
--- | --- | ---
1.x      | 1.0 | plug-in
2.0 to 2.4| 1.0 | "
2.5      | 1.2 | extension
2.6      | 1.3 | "
2.7      | 1.4 | "
2.8      | 1.5 | "


The latest version is 1.5, which shipped with Azure SDK 2.8. The version of Azure Diagnostics extension that ships with the SDK is only used for local emulator scenarios. Any deployed application automatically uses the latest version when running in Azure, irrespective of which version of the SDK the application is built with. However, unless you install the latest Azure SDK, you may not have all the tools that help you utilize the new features.

Various features and changes described below.

## Azure SDK 2.8
Azure SDK 2.8 added the ability to send diagnostics data to [Application Insights](./application-insights/app-insights-cloudservices.md) making it easier to diagnose issues across your application as well as the system and infrastructure level.

## Azure 2.6 diagnostics changes

For Azure SDK 2.6 Cloud Service projects in Visual Studio, the following changes were made. (These changes also apply to later versions of Azure SDK.)

- The local emulator now supports diagnostics. This means you can collect diagnostics data and ensure your application is creating the right traces while you're developing and testing in Visual Studio. The connection string `UseDevelopmentStorage=true` enables diagnostics data collection while you're running your cloud service project in Visual Studio by using the Azure storage emulator. All diagnostics data is collected in the (Development Storage) storage account.

- The diagnostics storage account connection string (Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString) is stored once again in the service configuration (.cscfg) file. In Azure SDK 2.5 the diagnostics storage account was specified in the diagnostics.wadcfgx file.

There are some notable differences between how the connection string worked in Azure SDK 2.4 and earlier and how it works in Azure SDK 2.6 and later.

- In Azure SDK 2.4 and earlier, the connection string was used as a runtime by the diagnostics plugin to get the storage account information for transferring diagnostics logs.

- In Azure SDK 2.6 and later, the diagnostics connection string is used by Visual Studio to configure the diagnostics extension with the appropriate storage account information during publishing. The connection string lets you define different storage accounts for different service configurations that Visual Studio will use when publishing. However, because the diagnostics plugin is no longer available (after Azure SDK 2.5), the .cscfg file by itself can't enable the Diagnostics Extension. You have to enable the extension separately through tools such as Visual Studio or PowerShell.

- To simplify the process of configuring the diagnostics extension with PowerShell, the package output from Visual Studio also contains the public configuration XML for the diagnostics extension for each role. Visual Studio uses the diagnostics connection string to populate the storage account information present in the public configuration. The public config files are created in the Extensions folder and follow the pattern PaaSDiagnostics.<RoleName>.PubConfig.xml. Any PowerShell based deployments can use this pattern to map each configuration to a Role.

- The connection string in the .cscfg file is also used by the Azure portal to access the diagnostics data so it can appear in the **Monitoring** tab. The connection string is needed to configure the service to show verbose monitoring data in the portal.

### Migrating projects to Azure SDK 2.6 and later

When migrating from Azure SDK 2.5 to Azure SDK 2.6 or later, if you had a diagnostics storage account specified in the .wadcfgx file, then it will stay there. To take advantage of the flexibility of using different storage accounts for different storage configurations, you'll have to manually add the connection string to your project. If you're migrating a project from Azure SDK 2.4 or earlier to Azure SDK 2.6, then the diagnostics connection strings are preserved. However, please note the changes in how connection strings are treated in Azure SDK 2.6 as specified in the previous section.

### How Visual Studio determines the diagnostics storage account

- If a diagnostics connection string is specified in the .cscfg file, Visual Studio uses it to configure the diagnostics extension when publishing, and when generating the public configuration xml files during packaging.

- If no diagnostics connection string is specified in the .cscfg file, then Visual Studio falls back to using the storage account specified in the .wadcfgx file to configure the diagnostics extension when publishing, and generating the public configuration xml files when packaging.

- The diagnostics connection string in the .cscfg file takes precedence over the storage account in the .wadcfgx file. If a diagnostics connection string is specified in the .cscfg file, then Visual Studio uses that and ignores the storage account in .wadcfgx.

### What does the "Update development storage connection strings…" checkbox do?

The checkbox for **Update development storage connection strings for Diagnostics and Caching with Microsoft Azure storage account credentials when publishing to Microsoft Azure** gives you a convenient way to update any development storage account connection strings with the Azure storage account specified during publishing.

For example, suppose you select this checkbox and the diagnostics connection string specifies `UseDevelopmentStorage=true`. When you publish the project to Azure, Visual Studio will automatically update the diagnostics connection string with the storage account you specified in the Publish wizard. However, if a real storage account was specified as the diagnostics connection string, then that account is used instead.

## Diagnostics functionality differences between Azure SDK 2.4 and earlier and Azure SDK 2.5 and later

If you're upgrading your project from Azure SDK 2.4 to Azure SDK 2.5 or later, you should bear in mind the following diagnostics functionality differences.

- **Configuration APIs are deprecated** – Programmatic configuration of diagnostics is available in Azure SDK 2.4 or earlier versions, but is deprecated in Azure SDK 2.5 and later. If your diagnostics configuration is currently defined in code, you'll need to reconfigure those settings from scratch in the migrated project in order for diagnostics to keep working. The diagnostics configuration file for Azure SDK 2.4 is diagnostics.wadcfg, and diagnostics.wadcfgx for Azure SDK 2.5 and later.

- **Diagnostics for cloud service applications can only be configured at the role level, not at the instance level.**

- **Every time you deploy your app, the diagnostics configuration is updated** – This can cause parity issues if you change your diagnostics configuration from Server Explorer and then redeploy your app.

- **In Azure SDK 2.5 and later, crash dumps are configured in the diagnostics configuration file, not in code** – If you have crash dumps configured in code, you'll have to manually transfer the configuration from code to the configuration file, because the crash dumps aren't transferred during the migration to Azure SDK 2.6.
