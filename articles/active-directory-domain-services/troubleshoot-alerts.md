---
title: Common alerts and resolutions in Azure AD Domain Services | Microsoft Docs
description: Learn how to resolve common alerts generated as part of the health status for Azure Active Directory Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 54319292-6aa0-4a08-846b-e3c53ecca483
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: article
ms.date: 01/21/2020
ms.author: iainfou

---
# Known issues: Common alerts and resolutions in Azure Active Directory Domain Services

As a central part of identity and authentication for applications, Azure Active Directory Domain Services (Azure AD DS) sometimes has problems. If you run into issues, there are some common alerts and associated troubleshooting steps to help you get things running again. At any time, you can also [open an Azure support request][azure-support] for additional troubleshooting assistance.

This article provides troubleshooting information for common alerts in Azure AD DS.

## AADDS100: Missing directory

### Alert message

*The Azure AD directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.*

### Resolution

This error is usually caused when an Azure subscription is moved to a new Azure AD directory and the old Azure AD directory that's associated with Azure AD DS is deleted.

This error is unrecoverable. To resolve the alert, [delete your existing Azure AD DS managed domain](delete-aadds.md) and recreate it in your new directory. If you have trouble deleting the Azure AD DS managed domain, [open an Azure support request][azure-support] for additional troubleshooting assistance.

## AADDS101: Azure AD B2C is running in this directory

### Alert message

*Azure AD Domain Services cannot be enabled in an Azure AD B2C Directory.*

### Resolution

Azure AD DS automatically synchronizes with an Azure AD directory. If the Azure AD directory is configured for B2C, Azure AD DS can't be deployed and synchronized.

To use Azure AD DS, you must recreate your managed domain in a non-Azure AD B2C directory using the following steps:

1. [Delete the Azure AD DS managed domain](delete-aadds.md) from your existing Azure AD directory.
1. Create a new Azure AD directory that isn't an Azure AD B2C directory.
1. [Create a replacement Azure AD DS managed domain](tutorial-create-instance.md).

The Azure AD DS managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS103: Address is in a public IP range

### Alert message

*The IP address range for the virtual network in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

### Resolution

Before you begin, make sure you understand [private IP v4 address spaces](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

Inside a virtual network, VMs can make requests to Azure resources in the same IP address range as configured for the subnet. If you configure a public IP address range for a subnet, requests routed within a virtual network may not reach the intended web resources. This configuration can lead to unpredictable errors with Azure AD DS.

> [!NOTE]
> If you own the IP address range in the internet that is configured in your virtual network, this alert can be ignored. However, Azure AD Domain Services can't commit to the [SLA](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/)] with this configuration since it can lead to unpredictable errors.

To resolve this alert, delete your existing Azure AD DS managed domain and recreate it in a virtual network with a private IP address range. This process is disruptive as the Azure AD DS managed domain is unavailable and any custom resources you've created like OUs or service accounts are lost.

1. [Delete the Azure AD DS managed domain](delete-aadds.md) from your directory.
1. To update the virtual network IP address range, search for and select *Virtual network* in the Azure portal. Select the virtual network for Azure AD DS that incorrectly has a public IP address range set.
1. Under **Settings**, select *Address Space*.
1. Update the address range by choosing the existing address range and editing it, or adding an additional address range. Make sure the new IP address range is in a private IP range. When ready, **Save** the changes.
1. Select **Subnets** in the left-hand navigation.
1. Choose the subnet you wish to edit, or a create an additional subnet.
1. Update or specify a private IP address range then **Save** your changes.
1. [Create a replacement Azure AD DS managed domain](tutorial-create-instance.md). Make sure you pick the updated virtual network subnet with a private IP address range.

The Azure AD DS managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS106: Your Azure subscription is not found

### Alert message

*Your Azure subscription associated with your managed domain has been deleted.  Azure AD Domain Services requires an active subscription to continue functioning properly.*

### Resolution

Azure AD DS requires an active subscription, and can't be moved to a different subscription. If the Azure subscription that the Azure AD DS managed domain was associated with is deleted, you must recreate an Azure subscription and Azure AD DS managed domain.

1. [Create an Azure subscription](../cost-management-billing/manage/create-subscription.md).
1. [Delete the Azure AD DS managed domain](delete-aadds.md) from your existing Azure AD directory.
1. [Create a replacement Azure AD DS managed domain](tutorial-create-instance.md).

## AADDS107: Your Azure subscription is disabled

### Alert message

*Your Azure subscription associated with your managed domain is not active.  Azure AD Domain Services requires an active subscription to continue functioning properly.*

### Resolution

Azure AD DS requires an active subscription. If the Azure subscription that the Azure AD DS managed domain was associated with isn't active, you must renew it to reactivate the subscription.

1. [Renew your Azure subscription](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable).
2. Once the subscription is renewed, an Azure AD DS notification lets you re-enable the managed domain.

When the managed domain is enabled again, the Azure AD DS managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS108: Subscription moved directories

### Alert message

*The subscription used by Azure AD Domain Services has been moved to another directory. Azure AD Domain Services needs to have an active subscription in the same directory to function properly.*

### Resolution

Azure AD DS requires an active subscription, and can't be moved to a different subscription. If the Azure subscription that the Azure AD DS managed domain was associated with is moved, move the subscription back to the previous directory, or [delete your managed domain](delete-aadds.md) from the existing directory and [create a replacement Azure AD DS managed domain in the chosen subscription](tutorial-create-instance.md).

## AADDS109: Resources for your managed domain cannot be found

### Alert message

*A resource that is used for your managed domain has been deleted. This resource is needed for Azure AD Domain Services to function properly.*

### Resolution

Azure AD DS creates additional resources to function properly, such as public IP addresses, virtual network interfaces, and a load balancer. If any of these resources are deleted, the managed domain is in an unsupported state and prevents the domain from being managed. For more information on these resources, see [Network resources used by Azure AD DS](network-considerations.md#network-resources-used-by-azure-ad-ds).

This alert is generated when one of these required resources is deleted. If the resource was deleted less than 4 hours ago, there is a chance that the Azure platform can automatically recreate the deleted resource. The following steps outline how to check the health status and timestamp for resource deletion:

1. In the Azure portal, search for and select **Domain Services**. Choose your Azure AD DS managed domain, such as *aadds.contoso.com*.
1. In the left-hand navigation, select **Health**.
1. In the health page, select the alert with the ID *AADDS109*.
1. The alert has a timestamp for when it was first found. If that timestamp is less than 4 hours ago, the Azure platform may be able to automatically recreate the resource and resolve the alert by itself.

    If the alert is more than 4 hours old, the Azure AD DS managed domain is in an unrecoverable state. [Delete the Azure AD DS managed domain](delete-aadds.md) and then [create a replacement managed domain](tutorial-create-instance.md).

## AADDS110: The subnet associated with your managed domain is full

### Alert message

*The subnet selected for deployment of Azure AD Domain Services is full, and does not have space for the additional domain controller that needs to be created.*

### Resolution

The virtual network subnet for Azure AD DS needs sufficient IP addresses for the automatically created resources. This IP address space includes the need to create replacement resources if there's a maintenance event. To minimize the risk of running out of available IP addresses, don't deploy additional resources, such as your own VMs, into the same virtual network subnet as Azure AD DS.

This error is unrecoverable. To resolve the alert, [delete your existing Azure AD DS managed domain](delete-aadds.md) and recreate it. If you have trouble deleting the Azure AD DS managed domain, [open an Azure support request][azure-support] for additional troubleshooting assistance.

## AADDS111: Service principal unauthorized

### Alert message

*A service principal that Azure AD Domain Services uses to service your domain is not authorized to manage resources on the Azure subscription. The service principal needs to gain permissions to service your managed domain.*

### Resolution

Some automatically generated service principals are used to manage and create resources for an Azure AD DS managed domain. If the access permissions for one of these service principals is changed, the domain is unable to correctly manage resources. The following steps show you how to understand and then grant access permissions to a service principal:

1. Read about [role-based access control and how to grant access to applications in the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).
2. Review the access that the service principal with the ID *abba844e-bc0e-44b0-947a-dc74e5d09022* has and grant the access that was denied at an earlier date.

## AADDS112: Not enough IP address in the managed domain

### Alert message

*We have identified that the subnet of the virtual network in this domain may not have enough IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.*

### Resolution

The virtual network subnet for Azure AD DS needs enough IP addresses for the automatically created resources. This IP address space includes the need to create replacement resources if there's a maintenance event. To minimize the risk of running out of available IP addresses, don't deploy additional resources, such as your own VMs, into the same virtual network subnet as Azure AD DS.

To resolve this alert, delete your existing Azure AD DS managed domain and re-create it in a virtual network with a large enough IP address range. This process is disruptive as the Azure AD DS managed domain is unavailable and any custom resources you've created like OUs or service accounts are lost.

1. [Delete the Azure AD DS managed domain](delete-aadds.md) from your directory.
1. To update the virtual network IP address range, search for and select *Virtual network* in the Azure portal. Select the virtual network for Azure AD DS that has the small IP address range.
1. Under **Settings**, select *Address Space*.
1. Update the address range by choosing the existing address range and editing it, or adding an additional address range. Make sure the new IP address range is large enough for the Azure AD DS subnet range. When ready, **Save** the changes.
1. Select **Subnets** in the left-hand navigation.
1. Choose the subnet you wish to edit, or a create an additional subnet.
1. Update or specify a large enough IP address range then **Save** your changes.
1. [Create a replacement Azure AD DS managed domain](tutorial-create-instance.md). Make sure you pick the updated virtual network subnet with a large enough IP address range.

The Azure AD DS managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS113: Resources are unrecoverable

### Alert message

*The resources used by Azure AD Domain Services were detected in an unexpected state and cannot be recovered.*

### Resolution

This error is unrecoverable. To resolve the alert, [delete your existing Azure AD DS managed domain](delete-aadds.md) and recreate it. If you have trouble deleting the Azure AD DS managed domain, [open an Azure support request][azure-support] for additional troubleshooting assistance.

## AADDS114: Subnet invalid

### Alert message

*The subnet selected for deployment of Azure AD Domain Services is invalid, and cannot be used.*

### Resolution

This error is unrecoverable. To resolve the alert, [delete your existing Azure AD DS managed domain](delete-aadds.md) and recreate it. If you have trouble deleting the Azure AD DS managed domain, [open an Azure support request][azure-support] for additional troubleshooting assistance.

## AADDS115: Resources are locked

### Alert message

*One or more of the network resources used by the managed domain cannot be operated on as the target scope has been locked.*

### Resolution

Resource locks can be applied to Azure resources to prevent change or deletion. As Azure AD DS is a managed service, the Azure platform needs the ability to make configuration changes. If a resource lock is applied on some of the Azure AD DS components, the Azure platform can't perform its management tasks.

To check for resource locks on the Azure AD DS components and remove them, complete the following steps:

1. For each of the Azure AD DS network components in your resource group, such as virtual network, network interface, or public IP address, check the operation logs in the Azure portal. These operation logs should indicate why an operation is failing and where a resource lock is applied.
1. Select the resource where a lock is applied, then under **Locks**, select and remove the lock(s).

## AADDS116: Resources are unusable

### Alert message

*One or more of the network resources used by the managed domain cannot be operated on due to policy restriction(s).*

### Resolution

Policies are applied to Azure resources and resource groups that control what configuration actions are allowed. As Azure AD DS is a managed service, the Azure platform needs the ability to make configuration changes. If a policy is applied on some of the Azure AD DS components, the Azure platform may not be able to perform its management tasks.

To check for applied policies on the Azure AD DS components and update them, complete the following steps:

1. For each of the Azure AD DS network components in your resource group, such as virtual network, NIC, or public IP address, check the operation logs in the Azure portal. These operation logs should indicate why an operation is failing and where a restrictive policy is applied.
1. Select the resource where a policy is applied, then under **Policies**, select and edit the policy so it's less restrictive.

## AADDS500: Synchronization has not completed in a while

### Alert message

*The managed domain was last synchronized with Azure AD on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.*

### Resolution

[Check the Azure AD DS health](check-health.md) for any alerts that indicate problems in the configuration of the managed domain. Problems with the network configuration can block the synchronization from Azure AD. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has successfully completed.

The following common reasons cause synchronization to stop in an Azure AD DS managed domains:

* Required network connectivity is blocked. To learn more about how to check the Azure virtual network for problems and what's required, see [troubleshoot network security groups](alert-nsg.md) and the [network requirements for Azure AD Domain Services](network-considerations.md).
*  Password synchronization wasn't set up or successfully completed when the Azure AD DS managed domain was deployed. You can set up password synchronization for [cloud-only users](tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds) or [hybrid users from on-prem](tutorial-configure-password-hash-sync.md).

## AADDS501: A backup has not been taken in a while

### Alert message

*The managed domain was last backed up on [date].*

### Resolution

[Check the Azure AD DS health](check-health.md) for alerts that indicate problems in the configuration of the managed domain. Problems with the network configuration can block the Azure platform from successfully taking backups. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has successfully completed.

## AADDS503: Suspension due to disabled subscription

### Alert message

*The managed domain is suspended because the Azure subscription associated with the domain is not active.*

### Resolution

> [!WARNING]
> If an Azure AD DS managed domain is suspended for an extended period of time, there's a danger of it being deleted. Resolve the reason for suspension as quickly as possible. For more information, see [Understand the suspended states for Azure AD DS](suspension.md).

Azure AD DS requires an active subscription. If the Azure subscription that the Azure AD DS managed domain was associated with isn't active, you must renew it to reactivate the subscription.

1. [Renew your Azure subscription](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable).
2. Once the subscription is renewed, an Azure AD DS notification lets you re-enable the managed domain.

When the managed domain is enabled again, the Azure AD DS managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS504: Suspension due to an invalid configuration

### Alert message

*The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.*

### Resolution

> [!WARNING]
> If an Azure AD DS managed domain is suspended for an extended period of time, there's a danger of it being deleted. Resolve the reason for suspension as quickly as possible. For more information, see [Understand the suspended states for Azure AD DS](suspension.md).

[Check the Azure AD DS health](check-health.md) for alerts that indicate problems in the configuration of the managed domain. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has completed. When ready, [open an Azure support request][azure-support] to re-enable the Azure AD DS managed domain.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md
