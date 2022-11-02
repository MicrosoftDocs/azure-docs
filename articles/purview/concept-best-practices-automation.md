---
title: Microsoft Purview automation best practices
description: This article provides an overview of Microsoft Purview automation tools and guidance on what to use when.
author: tayganr
ms.author: tarifat
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 06/20/2022
---

# Microsoft Purview automation best practices

While Microsoft Purview provides an out of the box user experience with the Microsoft Purview governance portal, not all tasks are suited to the point-and-click nature of the graphical user experience. 

For example:
* Triggering a scan to run as part of an automated process.
* Monitoring for metadata changes in real time.
* Building your own custom user experience.

Microsoft Purview provides several tools in which we can use to interact with the underlying platform, in an automated, and programmatic fashion. Because of the open nature of the Microsoft Purview service, we can automate different aspects, from the control plane, made accessible via Azure Resource Manager, to Microsoft Purview's multiple data planes (catalog, scanning, administration, and more).

This article provides a summary of the options available, and guidance on what to use when.

## Tools

| Tool Type | Tool | Scenario | Management | Catalog | Scanning |
| --- | --- | --- | --- | --- | --- |
**Resource Management** | <ul><li><a href="/azure/templates/" target="_blank">ARM Templates</a></li><li><a href="https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/purview_account" target="_blank">Terraform</a></li></ul> | Infrastructure as Code | ✓ | | |
**Command Line** | <ul><li><a href="/cli/azure/purview" target="_blank">Azure CLI</a></li><li><a href="/powershell/module/az.purview" target="_blank">Azure PowerShell</a></li></ul> | Interactive | ✓ | | |
**API** | <ul><li><a href="/rest/api/purview/" target="_blank">REST API</a></li></ul> | On-Demand | ✓ | ✓ | ✓ |
**Streaming** (Atlas Kafka) | <ul><li><a href="/azure/purview/manage-kafka-dotnet" target="_blank">Apache Kafka</a></li></ul> | Real Time | | ✓ | |
**Streaming** (Diagnostic Logs) | <ul><li><a href="/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD#destinations" target="_blank">Event Hubs</a></li></ul> | Real Time | | | ✓ |
**SDK** | <ul><li><a href="/dotnet/api/overview/azure" target="_blank">.NET</a></li><li><a href="/java/api/overview/azure" target="_blank">Java</a></li><li><a href="/javascript/api/overview/azure" target="_blank">JavaScript</a></li><li><a href="/python/api/overview/azure" target="_blank">Python</a></li></ul> | Custom Development | ✓ | ✓ | ✓ |

## Resource Management
[Azure Resource Manager](../azure-resource-manager/management/overview.md) is a deployment and management service, which enables customers to create, update, and delete resources in Azure. When deploying Azure resources repeatedly, ARM templates can be used to ensure consistency, this approach is referred to as Infrastructure as Code.

To implement infrastructure as code, we can build [ARM templates](../azure-resource-manager/templates/overview.md) using JSON or [Bicep](../azure-resource-manager/bicep/overview.md), or open-source alternatives such as [Terraform](/azure/developer/terraform/overview). 

When to use?
* Scenarios that require repeated Microsoft Purview deployments, templates ensure Microsoft Purview along with any other dependent resources are deployed in a consistent manner.
* When coupled with [deployment scripts](../azure-resource-manager/templates/deployment-script-template.md), templated solutions can traverse the control and data planes, enabling the deployment of end-to-end solutions. For example, create a Microsoft Purview account, register sources, trigger scans.

## Command Line
Azure CLI and Azure PowerShell are command-line tools that enable you to manage Azure resources such as Microsoft Purview. While the list of commands will grow over time, only a subset of Microsoft Purview control plane operations is currently available. For an up-to-date list of commands currently available, check out the documentation ([Azure CLI](/cli/azure/purview) | [Azure PowerShell](/powershell/module/az.purview)).

* **Azure CLI** - A cross-platform tool that allows the execution of commands through a terminal using interactive command-line prompts or a script. Azure CLI has a **purview extension** that allows for the management of Microsoft Purview accounts. For example, `az purview account`.
* **Azure PowerShell** - A cross-platform task automation program, consisting of a set of cmdlets for managing Azure resources. Azure PowerShell has a module called **Az.Purview** that allows for the management of Microsoft Purview accounts. For example, `Get-AzPurviewAccount`.

When to use?
* Best suited for ad-hoc tasks and quick exploratory operations.

## API
REST APIs are HTTP endpoints that surface different methods (`POST`, `GET`, `PUT`, `DELETE`), triggering actions such as create, read, update, or delete (CRUD). Microsoft Purview exposes a large portion of the Microsoft Purview platform via multiple [service endpoints](/rest/api/purview/).

When to use?
* Required operations not available via Azure CLI, Azure PowerShell, or native client libraries.
* Custom application development or process automation.

## Streaming (Atlas Kafka)
Each Microsoft Purview account can enable a fully managed event hub that is accessible via the Atlas Kafka endpoint found via the Azure portal > Microsoft Purview Account > Properties. 

To enable this Event Hubs namespace, you can follow these steps:
1. Search for and open your Microsoft Purview account in the [Azure portal](https://portal.azure.com).
1. Select **Managed Resources** under settings on your Microsoft Purview account page in the Azure portal.
    :::image type="content" source="media/concept-best-practices/enable-disable-event-hubs.png" alt-text="Screenshot showing the Event Hubs namespace toggle highlighted on the Managed resources page of the Microsoft Purview account page in the Azure portal.":::
1. Select the Enable/Disable toggle to enable your Event Hubs namespace. It can be disabled at any time.
1. Select **Save** to save the choice and begin the enablement or disablement process. This can take several minutes to complete.
    :::image type="content" source="media/concept-best-practices/select-save.png" alt-text="Screenshot showing the Managed resources page of the Microsoft Purview account page in the Azure portal with the save button highlighted.":::

>[!NOTE]
>Enabling this Event Hubs namespace does incur a cost for the namespace. For specific details, see [the pricing page](https://azure.microsoft.com/pricing/details/purview/).


Once the namespace is enabled, Microsoft Purview events can be monitored by consuming messages from the event hub. External systems can also use the event hub to publish events to Microsoft Purview as they occur.
* **Consume Events** - Microsoft Purview will send notifications about metadata changes to Kafka topic **ATLAS_ENTITIES**. Applications interested in metadata changes can monitor for these notifications. Supported operations include: `ENTITY_CREATE`, `ENTITY_UPDATE`, `ENTITY_DELETE`, `CLASSIFICATION_ADD`, `CLASSIFICATION_UPDATE`, `CLASSIFICATION_DELETE`.
* **Publish Events** - Microsoft Purview can be notified of metadata changes via notifications to Kafka topic **ATLAS_HOOK**. Supported operations include: `ENTITY_CREATE_V2`, `ENTITY_PARTIAL_UPDATE_V2`, `ENTITY_FULL_UPDATE_V2`, `ENTITY_DELETE_V2`.

When to use?
* Applications or processes that need to publish or consume Apache Atlas events in real time.

## Streaming (Diagnostic Logs)
Microsoft Purview can send platform logs and metrics via "Diagnostic settings" to one or more destinations (Log Analytics Workspace, Storage Account, or Azure Event Hubs). [Available metrics](./how-to-monitor-with-azure-monitor.md#available-metrics) include `Data Map Capacity Units`, `Data Map Storage Size`, `Scan Canceled`, `Scan Completed`, `Scan Failed`, and `Scan Time Taken`.

Once configured, Microsoft Purview automatically sends these events to the destination as a JSON payload. From there, application subscribers that need to consume and act on these events can do so with the option of orchestrating downstream logic.

When to use?
* Applications or processes that need to consume diagnostic events in real time.

## SDK
Microsoft provides Azure SDKs to programmatically manage and interact with Azure services. Microsoft Purview client libraries are available in several languages (.NET, Java, JavaScript, and Python), designed to be consistent, approachable, and idiomatic.

When to use?
* Recommended over the REST API as the native client libraries (where available) will follow standard programming language conventions in line with the target language that will feel natural to the developer.

**Azure SDK for .NET**
* [Docs](/dotnet/api/azure.analytics.purview.account?view=azure-dotnet-preview&preserve-view=true) | [NuGet](https://www.nuget.org/packages/Azure.Analytics.Purview.Account/1.0.0-beta.1) Azure.Analytics.Purview.Account
* [Docs](/dotnet/api/azure.analytics.purview.administration?view=azure-dotnet-preview&preserve-view=true) | [NuGet](https://www.nuget.org/packages/Azure.Analytics.Purview.Administration/1.0.0-beta.1) Azure.Analytics.Purview.Administration
* [Docs](/dotnet/api/azure.analytics.purview.catalog?view=azure-dotnet-preview&preserve-view=true) | [NuGet](https://www.nuget.org/packages/Azure.Analytics.Purview.Catalog/1.0.0-beta.2) Azure.Analytics.Purview.Catalog
* [Docs](/dotnet/api/azure.analytics.purview.scanning?view=azure-dotnet-preview&preserve-view=true) | [NuGet](https://www.nuget.org/packages/Azure.Analytics.Purview.Scanning/1.0.0-beta.2) Azure.Analytics.Purview.Scanning
* [Docs](/dotnet/api/microsoft.azure.management.purview?view=azure-dotnet-preview&preserve-view=true) | [NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.Purview/) Microsoft.Azure.Management.Purview

**Azure SDK for Java**
* [Docs](/java/api/com.azure.analytics.purview.account?view=azure-java-preview&preserve-view=true) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-account/1.0.0-beta.1/jar) com.azure.analytics.purview.account
* Docs | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-administration/1.0.0-beta.1/jar) com.azure.analytics.purview.administration
* [Docs](/java/api/com.azure.analytics.purview.catalog?view=azure-java-preview&preserve-view=true) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-catalog/1.0.0-beta.2/jar) com.azure.analytics.purview.catalog
* [Docs](/java/api/com.azure.analytics.purview.scanning?view=azure-java-preview&preserve-view=true) | [Maven](https://search.maven.org/artifact/com.azure/azure-analytics-purview-scanning/1.0.0-beta.2/jar) com.azure.analytics.purview.scanning
* [Docs](/java/api/com.azure.resourcemanager.purview?view=azure-java-preview&preserve-view=true) | [Maven](https://search.maven.org/artifact/com.azure.resourcemanager/azure-resourcemanager-purview/1.0.0-beta.1/jar) com.azure.resourcemanager.purview

**Azure SDK for JavaScript**
* [Docs](/javascript/api/overview/azure/purview-account-rest-readme?view=azure-node-preview&preserve-view=true) | [npm](https://www.npmjs.com/package/@azure-rest/purview-account) @azure-rest/purview-account
* [Docs](/javascript/api/overview/azure/purview-administration-rest-readme?view=azure-node-preview&preserve-view=true) | [npm](https://www.npmjs.com/package/@azure-rest/purview-administration) @azure-rest/purview-administration
* [Docs](/javascript/api/overview/azure/purview-catalog-rest-readme?view=azure-node-preview&preserve-view=true) | [npm](https://www.npmjs.com/package/@azure-rest/purview-catalog) @azure-rest/purview-catalog
* [Docs](/javascript/api/overview/azure/purview-scanning-rest-readme?view=azure-node-preview&preserve-view=true) | [npm](https://www.npmjs.com/package/@azure-rest/purview-scanning) @azure-rest/purview-scanning
* [Docs](/javascript/api/@azure/arm-purview/?view=azure-node-preview&preserve-view=true) | [npm](https://www.npmjs.com/package/@azure/arm-purview) @azure/arm-purview

**Azure SDK for Python**
* [Docs](/python/api/azure-purview-account/?view=azure-python-preview&preserve-view=true) | [PyPi](https://pypi.org/project/azure-purview-account/) azure-purview-account
* [Docs](/python/api/azure-purview-administration/?view=azure-python-preview&preserve-view=true) | [PyPi](https://pypi.org/project/azure-purview-administration/) azure-purview-administration
* [Docs](/python/api/azure-purview-catalog/?view=azure-python-preview&preserve-view=true) | [PyPi](https://pypi.org/project/azure-purview-catalog/) azure-purview-catalog
* [Docs](/python/api/azure-purview-scanning/?view=azure-python-preview&preserve-view=true) | [PyPi](https://pypi.org/project/azure-purview-scanning/) azure-purview-scanning
* [Docs](/python/api/azure-mgmt-purview/?view=azure-python&preserve-view=true) | [PyPi](https://pypi.org/project/azure-mgmt-purview/) azure-mgmt-purview

## Next steps
* [Microsoft Purview REST API](/rest/api/purview)
