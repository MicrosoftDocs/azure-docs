---
title: Set up customer-managed keys to encrypt data at rest in ISEs
description: Create and manage your own encryption keys to secure data at rest for integration service environments (ISEs) in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: mijos, rarayudu, azla
ms.topic: how-to
ms.date: 08/23/2023
---

# Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps

> [!IMPORTANT]
>
> On August 31, 2024, the ISE resource will retire, due to its dependency on Azure Cloud Services (classic), 
> which retires at the same time. Before the retirement date, export any logic apps from your ISE to Standard 
> logic apps so that you can avoid service disruption. Standard logic app workflows run in single-tenant Azure 
> Logic Apps and provide the same capabilities plus more. For example Standard workflows support using private 
> endpoints for inbound traffic so that your workflows can communicate privately and securely with virtual 
> networks. Standard workflows also support virtual network integration for outbound traffic. For more information, 
> review [Secure traffic between virtual networks and single-tenant Azure Logic Apps using private endpoints](secure-single-tenant-workflow-virtual-network-private-endpoint.md).

Since November 1, 2022, the capability to create new ISE resources is no longer available, which means that the capability to set up your own encryption keys, known as "Bring Your Own Key" (BYOK), during ISE creation using the Logic Apps REST API is also no longer available.

ISE resources existing before this date are supported through August 31, 2024. For more information, see the following resources:

- [ISE Retirement - what you need to know](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/ise-retirement-what-you-need-to-know/ba-p/3645220)
- [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
- [Azure Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
- [Export ISE workflows to a Standard logic app](export-from-ise-to-standard-logic-app.md)
- [Integration Services Environment will be retired on 31 August 2024 - transition to Logic Apps Standard](https://azure.microsoft.com/updates/integration-services-environment-will-be-retired-on-31-august-2024-transition-to-logic-apps-standard/)
- [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)

By default, Azure Storage uses Microsoft-managed keys to encrypt your data. Azure Logic Apps relies on Azure Storage to store and automatically [encrypt data at rest](../storage/common/storage-service-encryption.md). This encryption protects your data and helps you meet your organizational security and compliance commitments. For more information about how Azure Storage encryption works, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md) and [Azure Data Encryption-at-Rest](../security/fundamentals/encryption-atrest.md).

## Considerations

* You can specify a customer-managed key *only when you create your ISE*, not afterwards. You can't disable this key after your ISE is created. Currently, no support exists for rotating a customer-managed key for an ISE.

* At this time, customer-managed key support for an ISE is available only in the following regions:

  * Azure: West US 2, East US, and South Central US.

  * Azure Government: Arizona, Virginia, and Texas.

* The key vault that stores your customer-managed key must exist in the same Azure region as your ISE.

* To support customer-managed keys, your ISE requires that you enable either the [system-assigned or user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). This identity lets your ISE authenticate access to secured resources, such as virtual machines and other systems or services, that are in or connected to an Azure virtual network. That way, you don't have to sign in with your credentials.

* You must give your key vault access to your ISE's managed identity, but the timing depends on which managed identity that you use.

  * **System-assigned managed identity**: Within *30 minutes after* you send the HTTPS PUT request that creates your ISE. Otherwise, ISE creation fails, and you get a permissions error.

  * **User-assigned managed identity**: Before you send the HTTPS PUT request that creates your ISE

## Next steps

* [Export ISE workflows to a Standard logic app](export-from-ise-to-standard-logic-app.md)
