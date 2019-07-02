---
title: 'Azure Active Directory Domain Services: Troubleshoot alerts | Microsoft Docs'
description: Troubleshoot alerts for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager:
editor:

ms.assetid: 54319292-6aa0-4a08-846b-e3c53ecca483
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2019
ms.author: iainfou

---
# Azure AD Domain Services - Troubleshoot alerts
This article provides troubleshooting guides for any alerts you may experience on your managed domain.


Pick the troubleshooting steps that correspond to the ID or message in the alert.

| **Alert ID** | **Alert Message** | **Resolution** |
| --- | --- | :--- |
| AADDS001 | *Secure LDAP over the internet is enabled for the managed domain. However, access to port 636 is not locked down using a network security group. This may expose user accounts on the managed domain to password brute-force attacks.* | [Incorrect secure LDAP configuration](alert-ldaps.md) |
| AADDS100 | *The Azure AD directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.* | [Missing directory](#aadds100-missing-directory) |
| AADDS101 | *Azure AD Domain Services cannot be enabled in an Azure AD B2C Directory.* | [Azure AD B2C is running in this directory](#aadds101-azure-ad-b2c-is-running-in-this-directory) |
| AADDS102 | *A Service Principal required for Azure AD Domain Services to function properly has been deleted from your Azure AD directory. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.* | [Missing Service Principal](alert-service-principal.md) |
| AADDS103 | *The IP address range for the virtual network in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch and synchronize your managed domain.* | [Address is in a public IP range](#aadds103-address-is-in-a-public-ip-range) |
| AADDS104 | *Microsoft is unable to reach the domain controllers for this managed domain. This may happen if a network security group (NSG) configured on your virtual network blocks access to the managed domain. Another possible reason is if there is a user defined route that blocks incoming traffic from the internet.* | [Network Error](alert-nsg.md) |
| AADDS105 | *The service principal with the application ID “d87dcbc6-a371-462e-88e3-28ad15ec4e64” was deleted and then recreated. The recreation leaves behind inconsistent permissions on Azure AD Domain Services resources needed to service your managed domain. Synchronization of passwords on your managed domain could be affected.* | [The password synchronization application is out of date](alert-service-principal.md#alert-aadds105-password-synchronization-application-is-out-of-date) |
| AADDS106 | *Your Azure subscription associated with your managed domain has been deleted.  Azure AD Domain Services requires an active subscription to continue functioning properly.* | [Azure subscription is not found](#aadds106-your-azure-subscription-is-not-found) |
| AADDS107 | *Your Azure subscription associated with your managed domain is not active.  Azure AD Domain Services requires an active subscription to continue functioning properly.* | [Azure subscription is disabled](#aadds107-your-azure-subscription-is-disabled) |
| AADDS108 | *The subscription used by Azure AD Domain Services has been moved to another directory. Azure AD Domain Services needs to have an active subscription in the same directory to function properly.* | [Subscription moved directories](#aadds108-subscription-moved-directories) |
| AADDS109 | *A resource that is used for your managed domain has been deleted. This resource is needed for Azure AD Domain Services to function properly.* | [A resource has been deleted](#aadds109-resources-for-your-managed-domain-cannot-be-found) |
| AADDS110 | *The subnet selected for deployment of Azure AD Domain Services is full, and does not have space for the additional domain controller that needs to be created.* | [Subnet is full](#aadds110-the-subnet-associated-with-your-managed-domain-is-full) |
| AADDS111 | *A service principal that Azure AD Domain Services uses to service your domain is not authorized to manage resources on the Azure subscription. The service principal needs to gain permissions to service your managed domain.* | [Service principal unauthorized](#aadds111-service-principal-unauthorized) |
| AADDS112 | *We have identified that the subnet of the virtual network in this domain may not have enough IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.* | [Not enough IP addresses](#aadds112-not-enough-ip-address-in-the-managed-domain) |
| AADDS113 | *The resources used by Azure AD Domain Services were detected in an unexpected state and cannot be recovered.* | [Resources are unrecoverable](#aadds113-resources-are-unrecoverable) |
| AADDS114 | *The subnet selected for deployment of Azure AD Domain Services is invalid, and cannot be used.* | [Subnet invalid](#aadds114-subnet-invalid) |
| AADDS115 | *One or more of the network resources used by the managed domain cannot be operated on as the target scope has been locked.* | [Resources are locked](#aadds115-resources-are-locked) |
| AADDS116 | *One or more of the network resources used by the managed domain cannot be operated on due to policy restriction(s).* | [Resources are unusable](#aadds116-resources-are-unusable) |
| AADDS500 | *The managed domain was last synchronized with Azure AD on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.* | [Synchronization hasn't happened in a while](#aadds500-synchronization-has-not-completed-in-a-while) |
| AADDS501 | *The managed domain was last backed up on [date].* | [A backup hasn't been taken in a while](#aadds501-a-backup-has-not-been-taken-in-a-while) |
| AADDS502 | *The secure LDAP certificate for the managed domain will expire on [date].* | [Expiring secure LDAP certificate](alert-ldaps.md#aadds502-secure-ldap-certificate-expiring) |
| AADDS503 | *The managed domain is suspended because the Azure subscription associated with the domain is not active.* | [Suspension due to disabled subscription](#aadds503-suspension-due-to-disabled-subscription) |
| AADDS504 | *The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.* | [Suspension due to an invalid configuration](#aadds504-suspension-due-to-an-invalid-configuration) |



## AADDS100: Missing directory
**Alert message:**

*The Azure AD directory associated with your managed domain may have been deleted. The managed domain is no longer in a supported configuration. Microsoft cannot monitor, manage, patch, and synchronize your managed domain.*

**Resolution:**

This error is usually caused by incorrectly moving your Azure subscription to a new Azure AD directory and deleting the old Azure AD directory that is still associated with Azure AD Domain Services.

This error is unrecoverable. To resolve, you must [delete your existing managed domain](delete-aadds.md) and recreate it in your new directory. If you are having trouble deleting, contact the Azure Active Directory Domain Services product team [for support](contact-us.md).

## AADDS101: Azure AD B2C is running in this directory
**Alert message:**

*Azure AD Domain Services cannot be enabled in an Azure AD B2C Directory.*

**Resolution:**

>[!NOTE]
>In order to continue to use Azure AD Domain Services, you must recreate your Azure AD Domain Services instance in a non-Azure AD B2C directory.

To restore your service, follow these steps:

1. [Delete your managed domain](delete-aadds.md) from your existing Azure AD directory.
2. Create a new directory that is not an Azure AD B2C directory.
3. Follow the [Getting Started](create-instance.md) guide to recreate a managed domain.

## AADDS103: Address is in a public IP range

**Alert message:**

*The IP address range for the virtual network in which you have enabled Azure AD Domain Services is in a public IP range. Azure AD Domain Services must be enabled in a virtual network with a private IP address range. This configuration impacts Microsoft's ability to monitor, manage, patch and synchronize your managed domain.*

**Resolution:**

> [!NOTE]
> To address this issue, you must delete your existing managed domain and re-create it in a virtual network with a private IP address range. This process is disruptive.

Before you begin, read the **private IP v4 address space** section in [this article](https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

Inside the virtual network, machines may make requests to Azure resources that are in the same IP address range as those configured for the subnet. However, since the virtual network is configured for this range, those requests will be routed within the virtual network and will not reach the intended web resources. This configuration can lead to unpredictable errors with Azure AD Domain Services.

**If you own the IP address range in the internet that is configured in your virtual network, this alert can be ignored. However, Azure AD Domain Services cannot commit to the [SLA](https://azure.microsoft.com/support/legal/sla/active-directory-ds/v1_0/)] with this configuration since it can lead to unpredictable errors.**


1. [Delete your managed domain](delete-aadds.md) from your directory.
2. Fix the IP address range for the subnet
   1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
   2. Select the virtual network you plan to use for Azure AD Domain Services.
   3. Click on **Address Space** under Settings
   4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Make sure the new address range is in a private IP range. Save your changes.
   5. Click on **Subnets** in the left-hand navigation.
   6. Click on the subnet you wish to edit in the table.
   7. Update the address range and save your changes.
3. Follow [the Getting Started Using Azure AD Domain Services guide](create-instance.md) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](join-windows-vm.md).
8. To ensure the alert is resolved, check your domain's health in two hours.

## AADDS106: Your Azure subscription is not found

**Alert message:**

*Your Azure subscription associated with your managed domain has been deleted.  Azure AD Domain Services requires an active subscription to continue functioning properly.*

**Resolution:**

Azure AD Domain Services requires a subscription to function and cannot be moved to a different subscription. Because the Azure subscription that your managed domain was associated with has been deleted, you will need to recreate an Azure subscription and Azure AD Domain Services.

1. Create an Azure subscription
2. [Delete your managed domain](delete-aadds.md) from your existing Azure AD directory.
3. Follow the [Getting Started](create-instance.md) guide to recreate a managed domain.

## AADDS107: Your Azure subscription is disabled

**Alert message:**

*Your Azure subscription associated with your managed domain is not active.  Azure AD Domain Services requires an active subscription to continue functioning properly.*

**Resolution:**


1. [Renew your Azure subscription](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable).
2. Once the subscription is renewed, Azure AD Domain Services will receive a notification from Azure to re-enable your managed domain.

## AADDS108: Subscription moved directories

**Alert message:**

*The subscription used by Azure AD Domain Services has been moved to another directory. Azure AD Domain Services needs to have an active subscription in the same directory to function properly.*

**Resolution:**

You can either move the subscription associated with Azure AD Domain Services back to the previous directory, or you need to [delete your managed domain](delete-aadds.md) from the existing directory and recreate it in the chosen directory (either with a new subscription or change the directory your Azure AD Domain Services instance is in).

## AADDS109: Resources for your managed domain cannot be found

**Alert message:**

*A resource that is used for your managed domain has been deleted. This resource is needed for Azure AD Domain Services to function properly.*

**Resolution:**

Azure AD Domain Services creates specific resources while deploying in order to function properly, including public IP addresses, NICs, and a load balancer. If any of the named are deleted, this causes your managed domain to be in an unsupported state and prevents your domain from being managed. This alert is found when someone who is able to edit the Azure AD Domain Services resources deletes a needed resource. The following steps outline how to restore your managed domain.

1. Navigate to the Azure AD Domain Services health page
   1.    Travel to the [Azure AD Domain Services page](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.AAD%2FdomainServices) in the Azure portal.
   2.    In the left-hand navigation, click **Health**
2. Check to see if the alert is less than 4 hours old
   1.    On the health page, click the alert with the ID **AADDS109**
   2.    The alert will have a timestamp for when it was first found. If that timestamp is less than 4 hours ago, there is a chance that Azure AD Domain Services can recreate the deleted resource.
3. If the alert is more than 4 hours old, the managed domain is in an unrecoverable state. You must delete and recreate Azure AD Domain Services.


## AADDS110: The subnet associated with your managed domain is full

**Alert message:**

*The subnet selected for deployment of Azure AD Domain Services is full, and does not have space for the additional domain controller that needs to be created.*

**Resolution:**

This error is unrecoverable. To resolve, you must [delete your existing managed domain](delete-aadds.md) and [recreate your managed domain](create-instance.md)

## AADDS111: Service principal unauthorized

**Alert message:**

*A service principal that Azure AD Domain Services uses to service your domain is not authorized to manage resources on the Azure subscription. The service principal needs to gain permissions to service your managed domain.*

**Resolution:**

Our service principals need access to be able to manage and create resources on your managed domain. Someone has denied the service principal access and now it is unable to manage resources. Follow the steps to grant access to your service principal.

1. Read about [RBAC control and how to grant access to applications on the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)
2. Review the access that the service principal with the ID ```abba844e-bc0e-44b0-947a-dc74e5d09022``` and grant the access that was denied at an earlier date.


## AADDS112: Not enough IP address in the managed domain

**Alert message:**

*We have identified that the subnet of the virtual network in this domain may not have enough IP addresses. Azure AD Domain Services needs at-least two available IP addresses within the subnet it is enabled in. We recommend having at-least 3-5 spare IP addresses within the subnet. This may have occurred if other virtual machines are deployed within the subnet, thus exhausting the number of available IP addresses or if there is a restriction on the number of available IP addresses in the subnet.*

**Resolution:**

1. Delete your managed domain from your tenant.
2. Fix the IP address range for the subnet
   1. Navigate to the [Virtual Networks page on the Azure portal](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_AAD_DomainServices=preview#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FvirtualNetworks).
   2. Select the virtual network you plan to use for Azure AD Domain Services.
   3. Click on **Address Space** under Settings
   4. Update the address range by clicking on the existing address range and editing it or adding an additional address range. Save your changes.
   5. Click on **Subnets** in the left-hand navigation.
   6. Click on the subnet you wish to edit in the table.
   7. Update the address range and save your changes.
3. Follow [the Getting Started Using Azure AD Domain Services guide](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started) to recreate your managed domain. Ensure that you pick a virtual network with a private IP address range.
4. To domain-join your virtual machines to your new domain, follow [this guide](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal).
5. Check your domain's health in two hours to ensure that you have completed the steps correctly.

## AADDS113: Resources are unrecoverable

**Alert message:**

*The resources used by Azure AD Domain Services were detected in an unexpected state and cannot be recovered.*

**Resolution:**

This error is unrecoverable. To resolve, you must [delete your existing managed domain](delete-aadds.md) and [recreate your managed domain](create-instance.md).

## AADDS114: Subnet invalid

**Alert message:**

*The subnet selected for deployment of Azure AD Domain Services is invalid, and cannot be used.*

**Resolution:**

This error is unrecoverable. To resolve, you must [delete your existing managed domain](delete-aadds.md) and [recreate your managed domain](create-instance.md).

## AADDS115: Resources are locked

**Alert message:**

*One or more of the network resources used by the managed domain cannot be operated on as the target scope has been locked.*

**Resolution:**

1.	Review Resource Manager operation logs on the network resources (this should give info on which lock is preventing modification).
2.	Remove the locks on the resources so that the Azure AD Domain Services service principal can operate on them.

## AADDS116: Resources are unusable

**Alert message:**

*One or more of the network resources used by the managed domain cannot be operated on due to policy restriction(s).*

**Resolution:**

1.	Review Resource Manager operation logs on the network resources for your managed domain.
2.	Weaken the policy restrictions on the resources so that the AAD-DS service principal can operate on them.



## AADDS500: Synchronization has not completed in a while

**Alert message:**

*The managed domain was last synchronized with Azure AD on [date]. Users may be unable to sign-in on the managed domain or group memberships may not be in sync with Azure AD.*

**Resolution:**

[Check your domain's health](check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. Sometimes, problems with your configuration can block Microsoft's ability to synchronize your managed domain. If you are able to resolve any alerts, wait two hours and check back to see if the synchronization has completed.

Here are some common reasons why synchronization stops on managed domains:
- Network connection is blocked on the managed domain. To learn more about checking your network for problems, read how to [troubleshoot Network Security Groups](alert-nsg.md) and [network requirements for Azure AD Domain Services](network-considerations.md).
-  Password synchronization was never set up or completed. To set up password synchronization, read [this article](active-directory-ds-getting-started-password-sync.md).

## AADDS501: A backup has not been taken in a while

**Alert message:**

*The managed domain was last backed up on [date].*

**Resolution:**

[Check your domain's health](check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. Sometimes, problems with your configuration can block Microsoft's ability to back up your managed domain. If you are able to resolve any alerts, wait two hours and check back to see if the backup has completed.


## AADDS503: Suspension due to disabled subscription

**Alert message:**

*The managed domain is suspended because the Azure subscription associated with the domain is not active.*

**Resolution:**

> [!WARNING]
> If your managed domain is suspended for an extended period of time, it is in danger of being deleted. It is best to address the suspension as quickly as possible. To read more, visit [this article](suspension.md).

To restore your service, [renew your Azure subscription](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable) associated with your managed domain.

## AADDS504: Suspension due to an invalid configuration

**Alert message:**

*The managed domain is suspended due to an invalid configuration. The service has been unable to manage, patch, or update the domain controllers for your managed domain for a long time.*

**Resolution:**

> [!WARNING]
> If your managed domain is suspended for an extended period of time, it is in danger of being deleted. It is best to address the suspension as quickly as possible. To read more, visit [this article](suspension.md).

[Check your domain's health](check-health.md) for any alerts that might indicate problems in your configuration of your managed domain. If you can resolve any of these alerts, do so. After, contact support to re-enable your subscription.


## Contact us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](contact-us.md).
