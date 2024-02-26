---
title: Overview of Azure Managed Applications
description: Describes the concepts for Azure Managed Applications that provide cloud solutions that are easy for customers to deploy and operate.
ms.topic: overview
ms.date: 07/31/2023
---

# Azure Managed Applications overview

Azure Managed Applications enable you to offer cloud solutions that are easy for customers to deploy and operate. As a publisher, you implement the infrastructure and can provide ongoing support. To make a managed application available to all customers, publish it in Azure Marketplace. To make it available to only users in your organization, publish it to an internal service catalog.

A managed application is similar to a solution template in Azure Marketplace, with one key difference. In a managed application, the resources are deployed to a managed resource group that's managed by the application's publisher or by the customer. The managed resource group is present in the customer's subscription, but an identity in the publisher's tenant can be given access to the managed resource group. As the publisher, if you manage the application, you specify the cost for ongoing support of the solution.

> [!NOTE]
> The documentation for Azure Custom Providers used to be included with Managed Applications. That documentation was moved to [Azure Custom Providers](../custom-providers/overview.md).

## Publisher and customer permissions

For the managed resource group, the publisher's management access and the customer's deny assignment are optional. There are different permission scenarios available based on publisher and customer needs for a managed application.

- **Publisher managed**: Publisher has management access to resources in the managed resource group in the customer's Azure tenant. Customer access to the managed resource group is restricted by a deny assignment. Publisher managed is the default managed application permission scenario.
- **Publisher and customer access**: Publisher and customer have full access to the managed resource group. The deny assignment is removed.
- **Locked mode**: Publisher doesn't have any access to the customers deployed managed application or managed resource group. Customer access is restricted by deny assignment.
- **Customer managed**: Customer has full management access to the managed resource group and the publisher's access is removed. There's no deny assignment. Publisher develops the application and publishes on Azure Marketplace but doesn't manage the application. Publisher licenses the application for billing through Azure Marketplace.

Advantages of using permission scenarios:

- For security reasons, publishers don't want persistent management access to the managed resource group, customer's tenant, or data in managed resource group.
- Publishers want to remove the deny assignment so that customers manage the application. Publisher doesn't need to manage the deny assignment to enable or disable actions for the customer. For example, an action like rebooting a virtual machine in the managed application.
- Provide customers with full control to manage the application so that publishers don't have to be a service provider to manage the application.

## Advantages of managed applications

Managed applications reduce barriers to customers using your solutions. They don't need expertise in cloud infrastructure to use your solution. Depending on the permissions configured by the publisher, customers might have limited access to the critical resources and don't need to worry about making a mistake when managing it.

Managed applications enable you to establish an ongoing relationship with your customers. You define terms for managing the application and all charges are handled through Azure billing.

Although customers deploy managed applications in their subscriptions, they don't have to maintain, update, or service them. But there are permissions that allow the customer to have full access to resources in the managed resource group. You can make sure that all customers are using approved versions. Customers don't have to develop application-specific domain knowledge to manage these applications. Customers automatically acquire application updates without the need to worry about troubleshooting and diagnosing issues with the applications.

For IT teams, managed applications enable you to offer preapproved solutions to users in the organization. You know these solutions are compliant with organizational standards.

Managed applications support [managed identities for Azure resources](./publish-managed-identity.md).

## Types of managed applications

You can publish your managed application either internally in the service catalog or externally in Azure Marketplace.

:::image type="content" source="./media/overview/managed-apps-options.png" alt-text="Diagram that shows how a managed application is published to service catalog or Azure Marketplace.":::

### Service catalog

The service catalog is an internal catalog of approved solutions for users in an organization. You use the catalog to meet organizational standards and offer solutions for the organization. Employees use the service catalog to find applications that are recommended and approved by their IT departments. They can access the managed applications that other people in their organization share with them.

For information about publishing a managed application to a service catalog, see [Quickstart: Create and publish a managed application definition](publish-service-catalog-app.md).

### Azure Marketplace

Vendors who want to bill for their services can make a managed application available through Azure Marketplace. After the vendor publishes an application, it's available to users outside their organization. With this approach, a managed service provider (MSP), independent software vendor (ISV), or system integrator (SI) can offer their solutions to all Azure customers.

For information about publishing a managed application to Azure Marketplace, see [Create an Azure application offer](../../marketplace/azure-app-offer-setup.md).

## Resource groups for managed applications

Typically, the resources for a managed application are in two resource groups. The customer manages one resource group, and the publisher manages the other resource group. When the managed application is defined, the publisher specifies the levels of access. The publisher can request either a permanent role assignment, or [just-in-time access](request-just-in-time-access.md) for an assignment that's constrained to a time period. Publishers can also configure the managed application so that there's no publisher access.

Restricting access for [data operations](../../role-based-access-control/role-definitions.md) is currently not supported for all data providers in Azure.

The following image shows the relationship between the customer's Azure subscription and the publisher's Azure subscription, which is the default _publisher managed_ permission. The managed application and managed resource group are in the customer's subscription. The publisher has management access to the managed resource group to maintain the managed application's resources. The publisher places a read-only lock (deny assignment) on the managed resource group that limits the customer's access to manage resources. The publisher's identities that have access to the managed resource group are exempt from the lock.

:::image type="content" source="./media/overview/managed-apps-resource-group.png" alt-text="Diagram that shows the relationship between customer and publisher Azure subscriptions for a managed resource group.":::

The management access as shown in the image can be changed. The customer can be given full access to the managed resource group. And, the publisher access to the managed resource group can be removed.

### Application resource group

This resource group holds the managed application instance. This resource group may only contain one resource. The resource type of the managed application is [Microsoft.Solutions/applications](#resource-provider).

The customer has full access to the resource group and uses it to manage the lifecycle of the managed application.

### Managed resource group

This resource group holds all the resources that are required by the managed application. For example, an application's virtual machines, storage accounts, and virtual networks. The customer might have limited access to this resource group because unless permission options are changed, the customer doesn't manage the individual resources for the managed application. The publisher's access to this resource group corresponds to the role specified in the managed application definition. For example, the publisher might request the Owner or Contributor role for this resource group. The access is either permanent or limited to a specific time. The publisher can choose to not have access to the managed resource group.

When the [managed application is published to the marketplace](../../marketplace/azure-app-offer-setup.md), the publisher can grant customers the ability to perform specific actions on resources in the managed resource group or be given full access. For example, the publisher can specify that customers can restart virtual machines. All other actions beyond read actions are still denied. Changes to resources in a managed resource group by a customer with granted actions are subject to the [Azure Policy](../../governance/policy/overview.md) assignments within the customer's tenant scoped to include the managed resource group.

When the customer deletes the managed application, the managed resource group is also deleted.

## Resource provider

Managed applications use the `Microsoft.Solutions` resource provider with ARM template JSON. For more information, see the resource types and API versions.

- [Microsoft.Solutions/applicationDefinitions](/azure/templates/microsoft.solutions/applicationdefinitions?pivots=deployment-language-arm-template)
- [Microsoft.Solutions/applications](/azure/templates/microsoft.solutions/applications?pivots=deployment-language-arm-template)
- [Microsoft.Solutions/jitRequests](/azure/templates/microsoft.solutions/jitrequests?pivots=deployment-language-arm-template)

## Azure Policy

You can apply an [Azure Policy](../../governance/policy/overview.md) to audit your managed application. You apply policy definitions to make sure deployed instances of your managed application fulfill data and security requirements. If your application interacts with sensitive data, make sure you've evaluated how that should be protected. For example, if your application interacts with data from Microsoft 365, apply a policy definition to make sure data encryption is enabled.

## Next steps

In this article, you learned about benefits of using managed applications. Go to the next article to create a managed application definition.

> [!div class="nextstepaction"]
> [Quickstart: Create and publish an Azure managed application definition](publish-service-catalog-app.md)
