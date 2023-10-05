---
title: Common alerts and resolutions in Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to resolve common alerts generated as part of the health status for Microsoft Entra Domain Services
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 54319292-6aa0-4a08-846b-e3c53ecca483
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: justinha

---
# Known issues: Common alerts and resolutions in Microsoft Entra Domain Services

As a central part of identity and authentication for applications, Microsoft Entra Domain Services sometimes has problems. If you run into issues, there are some common alerts and associated troubleshooting steps to help you get things running again. At any time, you can also [open an Azure support request][azure-support] for more troubleshooting help.

This article provides troubleshooting information for common alerts in Domain Services.

## AADDS100: Missing directory

### Alert message

*The Microsoft Entra directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.*

### Resolution

This error is usually caused when an Azure subscription is moved to a new Microsoft Entra directory and the old Microsoft Entra directory that's associated with Domain Services is deleted.

This error is unrecoverable. To resolve the alert, [delete your existing managed domain](delete-aadds.md) and recreate it in your new directory. If you have trouble deleting the managed domain, [open an Azure support request][azure-support] for more troubleshooting help.

## AADDS101: Azure AD B2C is running in this directory

### Alert message

*Microsoft Entra Domain Services cannot be enabled in an Azure AD B2C Directory.*

### Resolution

Domain Services automatically synchronizes with a Microsoft Entra directory. If the Microsoft Entra directory is configured for B2C, Domain Services can't be deployed and synchronized.

To use Domain Services, you must recreate your managed domain in a non-Azure AD B2C directory using the following steps:

1. [Delete the managed domain](delete-aadds.md) from your existing Microsoft Entra directory.
1. Create a new Microsoft Entra directory that isn't an Azure AD B2C directory.
1. [Create a replacement managed domain](tutorial-create-instance.md).

The managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS103: Address is in a public IP range

### Alert message

*The IP address range for the virtual network in which you have enabled Microsoft Entra Domain Services is in a public IP range. Microsoft Entra Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

### Resolution

Before you begin, make sure you understand [private IP v4 address spaces](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

Inside a virtual network, VMs can make requests to Azure resources in the same IP address range as configured for the subnet. If you configure a public IP address range for a subnet, requests routed within a virtual network may not reach the intended web resources. This configuration can lead to unpredictable errors with Domain Services.

> [!NOTE]
> If you own the IP address range in the internet that is configured in your virtual network, this alert can be ignored. However, Microsoft Entra Domain Services can't commit to the [SLA](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/) with this configuration since it can lead to unpredictable errors.

To resolve this alert, delete your existing managed domain and recreate it in a virtual network with a private IP address range. This process is disruptive as the managed domain is unavailable and any custom resources you've created like OUs or service accounts are lost.

1. [Delete the managed domain](delete-aadds.md) from your directory.
1. To update the virtual network IP address range, search for and select *Virtual network* in the Microsoft Entra admin center. Select the virtual network for Domain Services that incorrectly has a public IP address range set.
1. Under **Settings**, select *Address Space*.
1. Update the address range by choosing the existing address range and editing it, or by adding an address range. Make sure the new IP address range is in a private IP range. When ready, **Save** the changes.
1. Select **Subnets** in the left-hand navigation.
1. Choose the subnet you wish to edit, or create another subnet.
1. Update or specify a private IP address range then **Save** your changes.
1. [Create a replacement managed domain](tutorial-create-instance.md). Make sure you pick the updated virtual network subnet with a private IP address range.

The managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS106: Your Azure subscription is not found

### Alert message

*Your Azure subscription associated with your managed domain has been deleted.  Microsoft Entra Domain Services requires an active subscription to continue functioning properly.*

### Resolution

Domain Services requires an active subscription, and can't be moved to a different subscription. If the Azure subscription that the managed domain was associated with is deleted, you must recreate an Azure subscription and managed domain.

1. [Create an Azure subscription](/azure/cost-management-billing/manage/create-subscription).
1. [Delete the managed domain](delete-aadds.md) from your existing Microsoft Entra directory.
1. [Create a replacement managed domain](tutorial-create-instance.md).

## AADDS107: Your Azure subscription is disabled

### Alert message

*Your Azure subscription associated with your managed domain is not active.  Microsoft Entra Domain Services requires an active subscription to continue functioning properly.*

### Resolution

Domain Services requires an active subscription. If the Azure subscription that the managed domain was associated with isn't active, you must renew it to reactivate the subscription.

1. [Renew your Azure subscription](/azure/cost-management-billing/manage/subscription-disabled).
2. Once the subscription is renewed, a Domain Services notification lets you re-enable the managed domain.

When the managed domain is enabled again, the managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS108: Subscription moved directories

### Alert message

*The subscription used by Microsoft Entra Domain Services has been moved to another directory. Microsoft Entra Domain Services needs to have an active subscription in the same directory to function properly.*

### Resolution

Domain Services requires an active subscription, and can't be moved to a different subscription. If the Azure subscription that the managed domain was associated with is moved, move the subscription back to the previous directory, or [delete your managed domain](delete-aadds.md) from the existing directory and [create a replacement managed domain in the chosen subscription](tutorial-create-instance.md).

## AADDS109: Resources for your managed domain cannot be found

### Alert message

*A resource that is used for your managed domain has been deleted. This resource is needed for Microsoft Entra Domain Services to function properly.*

### Resolution

Domain Services creates resources to function properly, such as public IP addresses, virtual network interfaces, and a load balancer. If any of these resources are deleted, the managed domain is in an unsupported state and prevents the domain from being managed. For more information on these resources, see [Network resources used by Domain Services](network-considerations.md#network-resources-used-by-azure-ad-ds).

This alert is generated when one of these required resources is deleted. If the resource was deleted less than 4 hours ago, there's a chance that the Azure platform can automatically recreate the deleted resource. The following steps outline how to check the health status and timestamp for resource deletion:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. In the left-hand navigation, select **Health**.
1. In the health page, select the alert with the ID *AADDS109*.
1. The alert has a timestamp for when it was first found. If that timestamp is less than 4 hours ago, the Azure platform may be able to automatically recreate the resource and resolve the alert by itself.

    For different reasons, the alert may be older than 4 hours. In that case, you can [delete the managed domain](delete-aadds.md) and then [create a replacement managed domain](tutorial-create-instance.md) for an immediate fix, or you can open a support request to fix the instance. Depending on the nature of the problem, support may require a restore from backup.


## AADDS110: The subnet associated with your managed domain is full

### Alert message

*The subnet selected for deployment of Microsoft Entra Domain Services is full, and does not have space for the additional domain controller that needs to be created.*

### Resolution

The virtual network subnet for Domain Services needs sufficient IP addresses for the automatically created resources. This IP address space includes the need to create replacement resources if there's a maintenance event. To minimize the risk of running out of available IP addresses, don't deploy other resources, such as your own VMs, into the same virtual network subnet as the managed domain.

This error is unrecoverable. To resolve the alert, [delete your existing managed domain](delete-aadds.md) and recreate it. If you have trouble deleting the managed domain, [open an Azure support request][azure-support] for more help.

## AADDS111: Service principal unauthorized

### Alert message

*A service principal that Microsoft Entra Domain Services uses to service your domain is not authorized to manage resources on the Azure subscription. The service principal needs to gain permissions to service your managed domain.*

### Resolution

Some automatically generated service principals are used to manage and create resources for a managed domain. If the access permissions for one of these service principals is changed, the domain is unable to correctly manage resources. The following steps show you how to understand and then grant access permissions to a service principal:

1. Read about [Azure role-based access control and how to grant access to applications in the Microsoft Entra admin center](/azure/role-based-access-control/role-assignments-portal).
2. Review the access that the service principal with the ID *abba844e-bc0e-44b0-947a-dc74e5d09022* has and grant the access that was denied at an earlier date.

## AADDS112: Not enough IP address in the managed domain

### Alert message

*We have identified that the subnet of the virtual network in this domain may not have enough IP addresses. Microsoft Entra Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.*

### Resolution

The virtual network subnet for Domain Services needs enough IP addresses for the automatically created resources. This IP address space includes the need to create replacement resources if there's a maintenance event. To minimize the risk of running out of available IP addresses, don't deploy other resources, such as your own VMs, into the same virtual network subnet as the managed domain.

To resolve this alert, delete your existing managed domain and re-create it in a virtual network with a large enough IP address range. This process is disruptive as the managed domain is unavailable and any custom resources you've created like OUs or service accounts are lost.

1. [Delete the managed domain](delete-aadds.md) from your directory.
1. To update the virtual network IP address range, search for and select *Virtual network* in the Microsoft Entra admin center. Select the virtual network for the managed domain that has the small IP address range.
1. Under **Settings**, select *Address Space*.
1. Update the address range by choosing the existing address range and editing it, or by adding another address range. Make sure the new IP address range is large enough for the managed domain's subnet range. When ready, **Save** the changes.
1. Select **Subnets** in the left-hand navigation.
1. Choose the subnet you wish to edit, or create another subnet.
1. Update or specify a large enough IP address range then **Save** your changes.
1. [Create a replacement managed domain](tutorial-create-instance.md). Make sure you pick the updated virtual network subnet with a large enough IP address range.

The managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS113: Resources are unrecoverable

### Alert message

*The resources used by Microsoft Entra Domain Services were detected in an unexpected state and cannot be recovered.*

### Resolution

Domain Services creates resources to function properly, such as public IP addresses, virtual network interfaces, and a load balancer. If any of these resources are modified, the managed domain is in an unsupported state and can't be managed. For more information about these resources, see [Network resources used by Domain Services](network-considerations.md#network-resources-used-by-azure-ad-ds).

This alert is generated when one of these required resources is modified and can't automatically be recovered by Domain Services. To resolve the alert, [open an Azure support request][azure-support] to fix the instance.

## AADDS114: Subnet invalid

### Alert message

*The subnet selected for deployment of Microsoft Entra Domain Services is invalid, and cannot be used.*

### Resolution

This error is unrecoverable. To resolve the alert, [delete your existing managed domain](delete-aadds.md) and recreate it. If you have trouble deleting the managed domain, [open an Azure support request][azure-support] for more help.

## AADDS115: Resources are locked

### Alert message

*One or more of the network resources used by the managed domain cannot be operated on as the target scope has been locked.*

### Resolution

Resource locks can be applied to Azure resources to prevent change or deletion. As Domain Services is a managed service, the Azure platform needs the ability to make configuration changes. If a resource lock is applied on some of the Domain Services components, the Azure platform can't perform its management tasks.

To check for resource locks on the Domain Services components and remove them, complete the following steps:

1. For each of the managed domain's network components in your resource group, such as virtual network, network interface, or public IP address, check the operation logs in the Microsoft Entra admin center. These operation logs should indicate why an operation is failing and where a resource lock is applied.
1. Select the resource where a lock is applied, then under **Locks**, select and remove the lock(s).

## AADDS116: Resources are unusable

### Alert message

*One or more of the network resources used by the managed domain cannot be operated on due to policy restriction(s).*

### Resolution

Policies are applied to Azure resources and resource groups that control what configuration actions are allowed. As Domain Services is a managed service, the Azure platform needs the ability to make configuration changes. If a policy is applied on some of the Domain Services components, the Azure platform may not be able to perform its management tasks.

To check for applied policies on the Domain Services components and update them, complete the following steps:

1. For each of the managed domain's network components in your resource group, such as virtual network, NIC, or public IP address, check the operation logs in the Microsoft Entra admin center. These operation logs should indicate why an operation is failing and where a restrictive policy is applied.
1. Select the resource where a policy is applied, then under **Policies**, select and edit the policy so it's less restrictive.

## AADDS120: The managed domain has encountered an error onboarding one or more custom attributes

### Alert message

*The following Microsoft Entra extension properties have not successfully onboarded as a custom attribute for synchronization. This may happen if a property conflicts with the built-in schema: \[extensions]*

### Resolution

>[!WARNING]
>If a custom attribute's LDAPName conflicts with an existing AD built-in schema attribute, it can't be onboarded and results in an error. Contact Microsoft Support if your scenario is blocked. For more information, see [Onboarding Custom Attributes](https://aka.ms/aadds-customattr).

Review the [Domain Services Health](check-health.md) alert and see which Microsoft Entra extension properties failed to onboard successfully. Navigate to the **Custom Attributes** page to find the expected Domain Services LDAPName of the extension. Make sure the LDAPName doesn't conflict with another AD schema attribute, or that it's one of the allowed built-in AD attributes. 

Then follow these steps to retry onboarding the custom attribute in the **Custom Attributes** page:

1. Select the attributes that were unsuccessful, then click **Remove** and **Save**.
1. Wait for the health alert to be removed, or verify that the corresponding attributes have been removed from the **AADDSCustomAttributes** OU from a domain-joined VM.
1. Select **Add** and choose the desired attributes again, then click **Save**.

Upon successful onboarding, Domain Services will back fill synchronized users and groups with the onboarded custom attribute values. The custom attribute values appear gradually, depending on the size of the tenant. To check the backfill status, go to [Domain Services Health](check-health.md) and verify the **Synchronization with Microsoft Entra ID** monitor timestamp has updated within the last hour.

## AADDS500: Synchronization has not completed in a while

### Alert message

*The managed domain was last synchronized with Microsoft Entra ID on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.*

### Resolution

[Check the Domain Services health](check-health.md) for any alerts that indicate problems in the configuration of the managed domain. Problems with the network configuration can block the synchronization from Microsoft Entra ID. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has successfully completed.

The following common reasons cause synchronization to stop in a managed domain:

* Required network connectivity is blocked. To learn more about how to check the Azure virtual network for problems and what's required, see [troubleshoot network security groups](alert-nsg.md) and the [network requirements for Domain Services](network-considerations.md).
*  Password synchronization wasn't set up or successfully completed when the managed domain was deployed. You can set up password synchronization for [cloud-only users](tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds) or [hybrid users from on-prem](tutorial-configure-password-hash-sync.md).

## AADDS501: A backup has not been taken in a while

### Alert message

*The managed domain was last backed up on [date].*

### Resolution

[Check the Domain Services health](check-health.md) for alerts that indicate problems in the configuration of the managed domain. Problems with the network configuration can block the Azure platform from successfully taking backups. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has successfully completed.

## AADDS503: Suspension due to disabled subscription

### Alert message

*The managed domain is suspended because the Azure subscription associated with the domain is not active.*

### Resolution

> [!WARNING]
> If a managed domain is suspended for an extended period of time, there's a danger of it being deleted. Resolve the reason for suspension as quickly as possible. For more information, see [Understand the suspended states for Domain Services](suspension.md).

Domain Services requires an active subscription. If the Azure subscription that the managed domain was associated with isn't active, you must renew it to reactivate the subscription.

1. [Renew your Azure subscription](/azure/cost-management-billing/manage/subscription-disabled).
2. Once the subscription is renewed, a Domain Services notification lets you re-enable the managed domain.

When the managed domain is enabled again, the managed domain's health automatically updates itself within two hours and removes the alert.

## AADDS504: Suspension due to an invalid configuration

### Alert message

*The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.*

### Resolution

> [!WARNING]
> If a managed domain is suspended for an extended period of time, there's a danger of it being deleted. Resolve the reason for suspension as quickly as possible. For more information, see [Understand the suspended states for Domain Services](suspension.md).

[Check the Domain Services health](check-health.md) for alerts that indicate problems in the configuration of the managed domain. If you're able to resolve alerts that indicate a configuration issue, wait two hours and check back to see if the synchronization has completed. When ready, [open an Azure support request][azure-support] to re-enable the managed domain.

## AADDS600: Unresolved health alerts for 30 days

### Alert Message

*Microsoft can’t manage the domain controllers for this managed domain due to unresolved health alerts \[IDs\]. This is blocking critical security updates as well as a planned migration to Windows Server 2019 for these domain controllers. Follow steps in the alert to resolve the issue. Failure to resolve this issue within 30 days will result in suspension of the managed domain.*

### Resolution

> [!WARNING]
> If a managed domain is suspended for an extended period of time, there's a danger of it being deleted. Resolve the reason for suspension as quickly as possible. For more information, see [Understand the suspended states for Domain Services](suspension.md).

[Check the Domain Services health](check-health.md) for alerts that indicate problems in the configuration of the managed domain. If you're able to resolve alerts that indicate a configuration issue, wait six hours and check back to see if the alert is removed. [Open an Azure support request][azure-support] if you need assistance.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for more troubleshooting help.

<!-- INTERNAL LINKS -->
[azure-support]: /azure/active-directory/fundamentals/how-to-get-support
