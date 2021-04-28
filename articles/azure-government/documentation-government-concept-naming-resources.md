---
title: Considerations for naming Azure resources | Microsoft Docs
description: Guidance on how customers should consider naming their Azure resources to prevent accidental spillage of sensitive data
services: azure-government
cloud: gov

ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.service: azure-government
ms.workload: Azure-government
ms.date: 04/14/2021

---
# Considerations for naming Azure resources

Customers should not include sensitive or restricted information in Azure resource names because it may be stored or accessed outside the compliance boundary to facilitate support and troubleshooting. Examples of sensitive information include data subject to:

- [Export control laws](./documentation-government-overview-itar.md)
- [DoD Impact Level 5 isolation requirements](./documentation-government-impact-level-5.md)
- [Controlled Unclassified Information](/azure/compliance/offerings/offering-nist-800-171) (CUI) that warrants extra protection or is subject to NOFORN marking
- And others

Data stored or processed in customer VMs, storage accounts, databases, Azure Import/Export, Azure Cache for Redis, ExpressRoute, Azure Cognitive Search, App Service, API Management, and other Azure services suitable for holding, processing, or transmitting customer data can contain sensitive data. However, metadata for these Azure services is not permitted to contain sensitive or restricted data. This metadata includes all configuration data entered when creating and maintaining an Azure service, including:

- Subscription names, service names, server names, database names, tenant role names, resource groups, deployment names, resource names, resource tags, circuit name, and so on.
- All shipping information that is used to transport media for Azure Import/Export, such as carrier name, tracking number, description, return information, drive list, package list, storage account name, container name, and so on.
- Data in HTTP headers sent to the REST API in search/query strings as part of the API.
- Device/policy/application and [other metadata](/mem/intune/protect/privacy-data-collect) sent to Intune.

Azure resource names include information provided by you, or on your behalf, that is used to identify or configure cloud service resources, such as software, systems, or containers. However, it does **not** include customer-created content or metadata inside the resource (for example, database column/table names). Azure resource names include the names a customer assigns to Azure Resource Manager level objects and resources deployed in Azure. Examples include the names of resources such as virtual networks, virtual hard disks, database servers and databases, virtual network interface, network security groups, key vaults, and others.

>[!NOTE]
>The above examples are but a subset of the types of resources customers can name. This list is not meant to be fully exhaustive and the types of resources could change in the future as new cloud services are added.
>

## Naming convention

The names of Azure resources are part of a larger resource ID as follows:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/<ResourceProvider>/<ResourceType>/<ResourceName>`

An example of a virtual machine resource ID is:

`/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<virtualMachineName>`

## Naming considerations

Customers should avoid names that are sensitive to business or mission functions. This guidance applies to all names that meet the criteria above, from the name of the larger resource group to the name of the end resources within it. Customers should also avoid names that indicate customer regulatory requirements, for example:

- [EAR](/azure/compliance/offerings/offering-ear)
- [ITAR](/azure/compliance/offerings/offering-itar)
- [CNSSI 1253](/azure/compliance/offerings/offering-cnssi-1253)
- [CJIS](/azure/compliance/offerings/offering-cjis)
- [IRS 1075](/azure/compliance/offerings/offering-irs-1075)
- And others as applicable

>[!NOTE]
>Also consider naming of resource tags when reviewing the **[Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).**

Customers should understand and take into account the resource naming convention to help ensure operational security, as Microsoft personnel could use the full resource ID in the following example scenarios:

- Microsoft support personnel may use the full resource ID of resources during support events to ensure we're identifying the right resource within a customer's subscription.
- Microsoft product engineering personnel could use full resource IDs during routine monitoring of telemetry data to identify deviations from baseline or average system performance.
- Proactive communication to customers about impacted resources during internally discovered incidents.
