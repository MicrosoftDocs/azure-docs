---
title: Azure Lighthouse and Azure managed applications
description: Understand how Azure Lighthouse and Azure managed applications can be used together.
ms.date: 05/10/2023
ms.topic: conceptual
---

# Azure Lighthouse and Azure managed applications

Both Azure managed applications and Azure Lighthouse work by enabling a service provider to access resources that reside in the customer's tenant. It can be helpful to understand the differences in the way that they work, the scenarios that they help to enable, and how they can be used together.

> [!TIP]
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](enterprise.md) can use the same processes and tools.

## Comparing Azure Lighthouse and Azure managed applications

This table illustrates some high-level differences that may impact whether you might choose to use Azure Lighthouse or Azure managed applications. In some cases, you may want to design a solution that uses them together.

|Consideration  |Azure Lighthouse  |Azure managed applications  |
|---------|---------|---------|
|Typical user     |Service providers or enterprises managing multiple tenants         |Independent Software Vendors (ISVs)         |
|Scope of cross-tenant access     |Subscription(s) or resource group(s)         |Resource group (scoped to a single application)         |
|Purchasable in Azure Marketplace     |No (offers can be published to Azure Marketplace, but customers are billed separately)        |Yes         |
|IP protection     |Yes (IP can remain in the service provider's tenant)        |Yes (by design, resource group is locked to customers)         |
|Deny assignments     |No         |Yes        |

### Azure Lighthouse

With [Azure Lighthouse](../overview.md), a service provider can perform a wide range of management tasks directly on a customer's subscription (or resource group). This access is achieved through a [logical projection](architecture.md#logical-projection), allowing service providers to sign in to their own tenant and access resources that belong to the customer's tenant. The customer can determine which subscriptions or resource groups to delegate to the service provider, and the customer maintains full access to those resources. They can also remove the service provider's access at any time.

To use Azure Lighthouse, customers are onboarded either by [deploying ARM templates](../how-to/onboard-customer.md) or through a [Managed Service offer in Azure Marketplace](managed-services-offers.md). You can track your impact on customer engagements by [linking your partner ID](../how-to/partner-earned-credit.md).

Azure Lighthouse is typically used when a service provider will perform management tasks for a customer on an ongoing basis. To learn more about how Azure Lighthouse works at a technical level, see [Azure Lighthouse architecture](architecture.md).

### Azure managed applications

[Azure managed applications](../../azure-resource-manager/managed-applications/overview.md) allow a service provider or ISV to offer cloud solutions that are easy for customers to deploy and use in their own subscriptions.

In a managed application, the resources used by the application are bundled together and deployed to a resource group that's managed by the publisher. This resource group is present in the customer's subscription, but an identity in the publisher's tenant has access to it. The ISV continues to manage and maintain the managed application, while the customer does not have direct access to work in its resource group, or any access to its resources.

Managed applications support [customized Azure portal experiences](../../azure-resource-manager/managed-applications/concepts-view-definition.md) and [integration with custom providers](../../azure-resource-manager/managed-applications/tutorial-create-managed-app-with-custom-provider.md). These options can be used to deliver a more customized and integrated experience, making it easier for customers to perform some management tasks themselves.

Managed applications can be [published to Azure Marketplace](../../marketplace/azure-app-offer-setup.md), either as a private offer for a specific customer's use, or as public offers that multiple customers can purchase. They can also be delivered to users within your organization by [publishing managed applications to your service catalog](../../azure-resource-manager/managed-applications/publish-service-catalog-app.md). You can deploy both service catalog and Marketplace instances using ARM templates, which can include a Commercial Marketplace partner's unique identifier to track [customer usage attribution](../../marketplace/azure-partner-customer-usage-attribution.md).

Azure managed applications are typically used for a specific customer need that can be achieved through a turnkey solution that is fully managed by the service provider.

## Using Azure Lighthouse and Azure managed applications together

While Azure Lighthouse and Azure managed applications use different access mechanisms to achieve different goals, there may be scenarios where it makes sense for a service provider to use both of them with the same customer.

For example, a customer might want managed services delivered by a service provider through Azure Lighthouse, so that they have visibility into the partner's actions along with continued control of their delegated subscription. However, the service provider may not want the customer to access certain resources that will be stored in the customer's tenant, or allow any customized actions on those resources. To meet these goals, the service provider can publish a private offer as a managed application. The managed application can include a resource group that is deployed in the customer's tenant, but that can't be accessed directly by the customer.

Customers might also be interested in managed applications from multiple service providers, whether or not they also use managed services via Azure Lighthouse from any of those service providers. Additionally, partners in the Cloud Solution Provider (CSP) program can resell certain managed applications published by other ISVs to customers that they support through Azure Lighthouse. With a wide range of options, service providers can choose the right balance to meet their customers' needs while restricting access to resources when appropriate.

## Next steps

- Learn about [Azure managed applications](../../azure-resource-manager/managed-applications/overview.md).
- Learn how to [onboard a subscription to Azure Lighthouse](../how-to/onboard-customer.md).
- Learn about [ISV scenarios with Azure Lighthouse](isv-scenarios.md).