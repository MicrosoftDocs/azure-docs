---
title: Benefits of Classic deployment migration in Azure AD Domain Services | Microsoft Docs
description: Learn more about the benefits of migrating a Classic deployment of Azure Active Directory Domain Services to the Resource Manager deployment model
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: iainfou
---

# Benefits of migration from the Classic to Resource Manager deployment model in Azure Active Directory Domain Services

Azure Active Directory Domain Services (Azure AD DS) lets you migrate an existing managed domain that uses the Classic deployment model to the Resource Manager deployment model. Azure AD DS managed domains that use the Resource Manager deployment model provide additional features such as fine-grained password policy, audit logs, and account lockout protection.

This article outlines the benefits for migration. To get started, see [Migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager][howto-migrate].

> [!NOTE]
> In 2017, Azure AD Domain Services became available to host in an Azure Resource Manager network. Since then, we have been able to build a more secure service using the Azure Resource Manager's modern capabilities. Because Azure Resource Manager deployments fully replace classic deployments, Azure AD DS classic virtual network deployments will be retired on March 1, 2023.
>
> For more information, see the [official deprecation notice](https://azure.microsoft.com/updates/we-are-retiring-azure-ad-domain-services-classic-vnet-support-on-march-1-2023/)

## Migration benefits

The migration process takes an existing managed domain that uses the Classic deployment model and moves to use the Resource Manager deployment model. When you migrate a managed domain from the Classic to Resource Manager deployment model, you avoid the need to rejoin machines to the managed domain or delete the managed domain and create one from scratch. VMs continue to be joined to the managed domain at the end of the migration process.

After migration, Azure AD DS provides many features that are only available for domains using Resource Manager deployment model, such as the following:

* [Fine-grained password policy support][password-policy].
* Faster synchronization speeds between Azure AD and Azure AD Domain Services.
* Two new [attributes that synchronize from Azure AD][attributes] - *manager* and *employeeID*.
* Access to higher-powered domain controllers when you [upgrade the SKU][skus].
* AD account lockout protection.
* [Email notifications for alerts on your managed domain][email-alerts].
* [Use Azure Workbooks and Azure monitor to view audit logs and sign-in activity][workbooks].
* In supported regions, [Azure Availability Zones][availability-zones].
* Integrations with other Azure products such as [Azure Files][azure-files], [HD Insights][hd-insights], and [Windows Virtual Desktop][wvd].
* Support has access to more telemetry and can help troubleshoot more effectively.
* Encryption at rest using [Azure Managed Disks][managed-disks] for the data on the managed domain controllers.

Managed domains that use a Resource Manager deployment model help you stay up-to-date with the latest new features. New features aren't available for managed domains that use the Classic deployment model.

## Next steps

To get started, see [Migrate Azure AD Domain Services from the Classic virtual network model to Resource Manager][howto-migrate].

<!-- LINKS - INTERNAL -->
[password-policy]: password-policy.md
[skus]: change-sku.md
[email-alerts]: notifications.md
[workbooks]: use-azure-monitor-workbooks.md
[azure-files]: ../storage/files/storage-files-identity-auth-active-directory-domain-service-enable.md
[hd-insights]: ../hdinsight/domain-joined/apache-domain-joined-configure-using-azure-adds.md
[wvd]: ../virtual-desktop/overview.md
[availability-zones]: ../availability-zones/az-overview.md
[howto-migrate]: migrate-from-classic-vnet.md
[attributes]: synchronization.md#attribute-synchronization-and-mapping-to-azure-ad-ds
[managed-disks]: ../virtual-machines/windows/managed-disks-overview.md
