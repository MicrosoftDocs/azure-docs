---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 04/26/2022
ms.author: tomfitz
---

Private links enable you to access Azure services over a private endpoint in your virtual network. When you combine private links with Azure Resource Manager's operations, you block users who aren't at the specific endpoint from managing resources. If a malicious user gets credentials to an account in your subscription, that user can't manage the resources without being at the specific endpoint.

Private link provides the following security benefits:

* **Private Access** - users can manage resources from a private network via a private endpoint.

> [!NOTE]
> Azure Kubernetes Service (AKS) currently doesn't support the ARM private endpoint implementation.
>
> Azure Bastion doesn't support private links. It is recommended to use a private DNS zone for your resource management private link private endpoint configuration, but due to the overlap with the management.azure.com name, your Bastion instance will stop working. For more information, view [Azure Bastion FAQ](../articles/bastion/bastion-faq.md#dns).

## Understand architecture

For this release, you can only apply private link management access at the level of the root [management group](../articles/governance/management-groups/overview.md). This limitation means private link access is applied across your tenant.

There are two resource types you'll use when implementing management through a private link.

* Resource management private link (Microsoft.Authorization/resourceManagementPrivateLinks)
* Private link association (Microsoft.Authorization/privateLinkAssociations)

The following image shows how to construct a solution that restricts access for managing resources.

:::image type="content" source="./media/resource-manager-create-rmpl/resource-management-private-link.svg" alt-text="Resource management private link diagram":::

The private link association extends the root management group. The private link association and the private endpoints reference the resource management private link.

> [!IMPORTANT]
> Multi-tenant accounts aren't currently supported for managing resources through a private link. You can't connect private link associations on different tenants to a single resource management private link.
>
> If your account accesses more than one tenant, define a private link for only one of them.

## Workflow

To set up a private link for resources, use the following steps. The steps are described in greater detail later in this article.

1. Create the resource management private link.
1. Create a private link association. The private link association extends the root management group. It also references the resource ID for the resource management private link.
1. Add a private endpoint that references the resource management private link.

After completing those steps, you can manage Azure resources that are within the hierarchy of the scope. You use a private endpoint that is connected to the subnet.

You can monitor access to the private link. For more information, see [Logging and monitoring](../articles/private-link/private-link-overview.md#logging-and-monitoring).

## Required permissions

To set up the private link for resource management, you need the following access:

* Owner on the subscription. This access is needed to create resource management private link resource.
* Owner or Contributor at the root management group. This access is needed to create the private link association resource.
* The Global Administrator for the Microsoft Entra ID doesn't automatically have permission to assign roles at the root management group. To enable creating resource management private links, the Global Administrator must have permission to read root management group and [elevate access](../articles/role-based-access-control/elevate-access-global-admin.md) to have User Access Administrator permission on all subscriptions and management groups in the tenant. After you get the User Access Administrator permission, the Global Administrator must grant Owner or Contributor permission at the root management group to the user creating the private link association.
