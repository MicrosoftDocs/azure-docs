---
title: Azure Purview automation best practices
description: This article provides an overview of Azure Purview automation tools and guidance on what to use when.
author: tarifat
ms.author: tarifat
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 11/23/2021
---

# Azure Purview automation best practices

While Azure Purview provides an out of the box user experience with Purview Studio, not all tasks are suited to the point-and-click nature of the graphical user experience. 

For example:
* Triggering a scan to run as part of an automated process.
* Monitoring for metadata changes in real-time.
* Building your own custom user experience.

 Azure Purview provides several mechanisms in which we can interact with the underlying platform in an automated and programmatic fashion, spanning both the control plane (i.e. Azure Resource Manager) as well as Azure Purview's multiple data planes (e.g. catalog, scanning, administration, and more).

This article provides a summary of the options available, and guidance on what to use when.

## Tools

| Tool Type | Tool | Scenario | Management | Catalog | Scanning |
| --- | --- | --- | --- | --- | --- |
**Command Line** | <ul><li><a href="https://docs.microsoft.com/en-us/cli/azure/purview?view=azure-cli-latest" target="_blank">Azure CLI</a></li><li><a href="https://docs.microsoft.com/en-us/powershell/module/az.purview/?view=azps-6.6.0" target="_blank">Azure PowerShell</a></li></ul> | Interactive | ✓ | | |
**API** | <ul><li><a href="https://docs.microsoft.com/en-us/rest/api/purview/" target="_blank">REST API</a></li></ul> | On-Demand | ✓ | ✓ | ✓ |
**Streaming** (Atlas Kafka) | <ul><li><a href="https://docs.microsoft.com/en-us/azure/purview/manage-kafka-dotnet" target="_blank">Apache Kafka</a></li></ul> | Real-Time | | ✓ | |
**Streaming** (Diagnostic Logs) | <ul><li><a href="https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD#destinations" target="_blank">Bring-your-own Event Hub</a></li></ul> | Real-Time | | | ✓ |
**SDK** | <ul><li><a href="https://docs.microsoft.com/en-us/dotnet/api/overview/azure/?view=azure-dotnet-preview" target="_blank">.NET</a></li><li><a href="https://docs.microsoft.com/en-us/java/api/overview/azure/?view=azure-java-preview" target="_blank">Java</a></li><li><a href="https://docs.microsoft.com/en-us/javascript/api/overview/azure/?view=azure-node-preview" target="_blank">JavaScript</a></li><li><a href="https://docs.microsoft.com/en-us/python/api/overview/azure/?view=azure-python-preview" target="_blank">Python</a></li></ul> | Custom | ✓ | ✓ | ✓ |

## Command Line
Azure CLI and Azure PowerShell are command-line tools that enable you to manage Azure resources such as Azure Purview. Note: Only a subset of Azure Purview control plane operations (e.g. account management) are currently available via the command-line, for an up to date list of commands currently available, check out the documentation ([Azure CLI](https://docs.microsoft.com/en-us/cli/azure/purview?view=azure-cli-latest) | [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/module/az.purview/?view=azps-6.6.0)).

* **Azure CLI** - A cross-platform tool that allows the execution of commands through a terminal using interactive command-line prompts or a script. Azure CLI has a **purview extension** that allows for the management of Azure Purview accounts (e.g. `az purview account`).
* **Azure PowerShell** - A cross-platform task automation program, consisting of a set of cmdlets for managing Azure resources. Azure PowerShell has a module called **Az.Purview** that allows for the management of Azure Purview accounts  (e.g. `Get-AzPurviewAccount`).

When to use?
* Best suited for ad-hoc tasks and quick exploratory operations.

## API
REST API's are service endpoints that surface sets of HTTP methods (e.g. `POST`, `GET`, `PUT`, `DELETE`), which can perform create, read, update, or delete (CRUD) operations with the service's resources. Azure Purview exposes a large portion of the Azure Purview platform via multiple [service endpoints](https://docs.microsoft.com/en-us/rest/api/purview/).

When to use?
* Required operations not available via Azure CLI, Azure PowerShell, or native client libraries.
* Custom application development or process automation.

## Streaming (Atlas Kafka)
Each Azure Purview account comes with a fully-managed Event Hub, which is accessible via the Atlas Kafka endpoint that can be found via Azure Portal > Azure Purview Account > Properties. This allows you to monitor and react to Azure Purview events (i.e. consume), and notify Azure Purview of events when they occur (i.e. publish).
* **Consume Events** - Azure Purview will send notifications about metadata changes to Kafka topic **ATLAS_ENTITIES**. Applications interested in metadata changes can monitor for these notifications. Supported operations include: `ENTITY_CREATE`, `ENTITY_UPDATE`, `ENTITY_DELETE`, `CLASSIFICATION_ADD`, `CLASSIFICATION_UPDATE`, `CLASSIFICATION_DELETE`.
* **Publish Events** - Azure Purview can be notified of metadata changes via notifications to Kafka topic **ATLAS_HOOK**. Supported operations include: `ENTITY_CREATE_V2`, `ENTITY_PARTIAL_UPDATE_V2`, `ENTITY_FULL_UPDATE_V2`, `ENTITY_DELETE_V2`.

When to use?
* Applications or processes that need to publish or consume catalog events (i.e. Apache Atlas) in real-time.

## Streaming (Diagnostic Logs)
Similar to other Azure Services (e.g. [Azure SQL DB/MI](https://docs.microsoft.com/en-us/azure/azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure?tabs=azure-portal)), Purview allows exporting of event metrics via "Diagnostic settings" to sinks, such as Event Hub. [Available metrics](https://docs.microsoft.com/en-us/azure/purview/how-to-monitor-with-azure-monitor#available-metrics) include _Scan Canceled, Completed, Failed, Time Taken_ etc. Other relevant platform-related diagnostic events should also be available here going forwards.

Once configured, as these events take place within the Purview Account, the platform automatically exports these events to Event Hub as a `JSON` payload. From there, application subscribers that need to consume and act on these events can do so scalably to orchestrate downstream logic.

When to use?
* Applications or processes that need to consume diagnostic events (i.e. Scan Failed) in real-time.

## SDK
Microsoft provides Azure SDKs to programmatically manage and interact with Azure services. Azure Purview client libraries are available in several languages (.NET, Java, JavaScript, and Python), designed to be consistent, approachable, and idiomatic.

When to use?
* Recommended over the REST API as the native client libraries (where available) will follow standard programming language conventions in line with the target language that will feel natural to the developer.

**Azure SDK for .NET**
* [Docs](https://docs.microsoft.com/en-us/dotnet/api/azure.analytics.purview.account?view=azure-dotnet-preview) | [Nuget](https://www.nuget.org/packages/Azure.Analytics.Purview.Account/1.0.0-beta.1) Azure.Analytics.Purview.Account
* [Docs](https://docs.microsoft.com/en-us/dotnet/api/azure.analytics.purview.administration?view=azure-dotnet-preview) | [Nuget](https://www.nuget.org/packages/Azure.Analytics.Purview.Administration/1.0.0-beta.1) Azure.Analytics.Purview.Administration
* [Docs](https://docs.microsoft.com/en-us/dotnet/api/azure.analytics.purview.catalog?view=azure-dotnet-preview) | [Nuget](https://www.nuget.org/packages/Azure.Analytics.Purview.Catalog/1.0.0-beta.2) Azure.Analytics.Purview.Catalog
* [Docs](https://docs.microsoft.com/en-us/dotnet/api/azure.analytics.purview.scanning?view=azure-dotnet-preview) | [Nuget](https://www.nuget.org/packages/Azure.Analytics.Purview.Scanning/1.0.0-beta.2) Azure.Analytics.Purview.Scanning
* [Docs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.purview?view=azure-dotnet-preview) | [Nuget](https://www.nuget.org/packages/Microsoft.Azure.Management.Purview/) Microsoft.Azure.Management.Purview

**Azure SDK for Java**
* [Docs](https://docs.microsoft.com/en-us/java/api/com.azure.analytics.purview.account?view=azure-java-preview) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-account/1.0.0-beta.1/jar) com.azure.analytics.purview.account
* Docs | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-administration/1.0.0-beta.1/jar) com.azure.analytics.purview.administration
* [Docs](https://docs.microsoft.com/en-us/java/api/com.azure.analytics.purview.catalog?view=azure-java-preview) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-catalog/1.0.0-beta.2/jar) com.azure.analytics.purview.catalog
* [Docs](https://docs.microsoft.com/en-us/java/api/com.azure.analytics.purview.scanning?view=azure-java-preview) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-scanning/1.0.0-beta.2/jar) com.azure.analytics.purview.scanning
* [Docs](https://docs.microsoft.com/en-us/java/api/com.azure.resourcemanager.purview?view=azure-java-preview) | [Maven](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-purview/1.0.0-beta.1/jar) com.azure.resourcemanager.purview

**Azure SDK for JavaScript**
* [Docs](https://docs.microsoft.com/en-us/javascript/api/overview/azure/purview-account-rest-readme?view=azure-node-preview) | [npm](https://www.npmjs.com/package/@azure-rest/purview-account) @azure-rest/purview-account
* [Docs](https://docs.microsoft.com/en-us/javascript/api/overview/azure/purview-administration-rest-readme?view=azure-node-preview) | [npm](https://www.npmjs.com/package/@azure-rest/purview-administration) @azure-rest/purview-administration
* [Docs](https://docs.microsoft.com/en-us/javascript/api/overview/azure/purview-catalog-rest-readme?view=azure-node-preview) | [npm](https://www.npmjs.com/package/@azure-rest/purview-catalog) @azure-rest/purview-catalog
* [Docs](https://docs.microsoft.com/en-us/javascript/api/overview/azure/purview-scanning-rest-readme?view=azure-node-preview) | [npm](https://www.npmjs.com/package/@azure-rest/purview-scanning) @azure-rest/purview-scanning
* [Docs](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-purview/?view=azure-node-preview) | [npm](https://www.npmjs.com/package/@azure/arm-purview) @azure/arm-purview

**Azure SDK for Python**
* [Docs](https://docs.microsoft.com/en-us/python/api/azure-purview-account/?view=azure-python-preview) | [PyPi](https://pypi.org/project/azure-purview-account/) azure-purview-account
* [Docs](https://docs.microsoft.com/en-us/python/api/azure-purview-administration/?view=azure-python-preview) | [PyPi](https://pypi.org/project/azure-purview-administration/) azure-purview-administration
* [Docs](https://docs.microsoft.com/en-us/python/api/azure-purview-catalog/?view=azure-python-preview) | [PyPi](https://pypi.org/project/azure-purview-catalog/) azure-purview-catalog
* [Docs](https://docs.microsoft.com/en-us/python/api/azure-purview-scanning/?view=azure-python-preview) | [PyPi](https://pypi.org/project/azure-purview-scanning/) azure-purview-scanning
* [Docs](https://docs.microsoft.com/en-us/python/api/azure-mgmt-purview/?view=azure-python) | [PyPi](https://pypi.org/project/azure-mgmt-purview/) azure-mgmt-purview


