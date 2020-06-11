---
title: Resolve network security group alerts in Azure AD DS | Microsoft Docs
description: Learn how to troubleshoot and resolve network security group configuration alerts for Azure Active Directory Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 95f970a7-5867-4108-a87e-471fa0910b8c
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/19/2019
ms.author: iainfou

---
# Known issues: Network configuration alerts in Azure Active Directory Domain Services

To let applications and services correctly communicate with Azure Active Directory Domain Services (Azure AD DS), specific network ports must be open to allow traffic to flow. In Azure, you control the flow of traffic using network security groups. The health status of an Azure AD DS managed domain shows an alert if the required network security group rules aren't in place.

This article helps you understand and resolve common alerts for network security group configuration issues.

## Alert AADDS104: Network error

### Alert message

*Microsoft is unable to reach the domain controllers for this managed domain. This may happen if a network security group (NSG) configured on your virtual network blocks access to the managed domain. Another possible reason is if there is a user-defined route that blocks incoming traffic from the internet.*

Invalid network security group rules are the most common cause of network errors for Azure AD DS. The network security group for the virtual network must allow access to specific ports and protocols. If these ports are blocked, the Azure platform can't monitor or update the managed domain. The synchronization between the Azure AD directory and Azure AD DS is also impacted. Make sure you keep the default ports open to avoid interruption in service.

## Default security rules

The following default inbound and outbound security rules are applied to the network security group for a managed domain. These rules keep Azure AD DS secure and allow the Azure platform to monitor, manage, and update the managed domain. You may also have an additional rule that allows inbound traffic if you [configure secure LDAP][configure-ldaps].

### Inbound security rules

| Priority | Name | Port | Protocol | Source | Destination | Action |
|----------|------|------|----------|--------|-------------|--------|
| 101      | AllowSyncWithAzureAD | 443 | TCP | AzureActiveDirectoryDomainServices | Any | Allow |
| 201      | AllowRD | 3389 | TCP | CorpNetSaw | Any | Allow |
| 301      | AllowPSRemoting | 5986| TCP | AzureActiveDirectoryDomainServices | Any | Allow |
| 65000    | AllVnetInBound | Any | Any | VirtualNetwork | VirtualNetwork | Allow |
| 65001    | AllowAzureLoadBalancerInBound | Any | Any | AzureLoadBalancer | Any | Allow |
| 65500    | DenyAllInBound | Any | Any | Any | Any | Deny |

### Outbound security rules

| Priority | Name | Port | Protocol | Source | Destination | Action |
|----------|------|------|----------|--------|-------------|--------|
| 65000    | AllVnetOutBound | Any | Any | VirtualNetwork | VirtualNetwork | Allow |
| 65001    | AllowAzureLoadBalancerOutBound | Any | Any |  Any | Internet | Allow |
| 65500    | DenyAllOutBound | Any | Any | Any | Any | Deny |

>[!NOTE]
> Azure AD DS needs unrestricted outbound access from the virtual network. We don't recommend that you create any additional rules that restrict outbound access for the virtual network.

## Verify and edit existing security rules

To verify the existing security rules and make sure the default ports are open, complete the following steps:

1. In the Azure portal, search for and select **Network security groups**.
1. Choose the network security group associated with your managed domain, such as *AADDS-contoso.com-NSG*.
1. On the **Overview** page, the existing inbound and outbound security rules are shown.

    Review the inbound and outbound rules and compare to the list of required rules in the previous section. If needed, select and then delete any custom rules that block required traffic. If any of the required rules are missing, add a rule in the next section.

    After you add or delete rules to allow the required traffic, the managed domain's health automatically updates itself within two hours and removes the alert.

### Add a security rule

To add a missing security rule, complete the following steps:

1. In the Azure portal, search for and select **Network security groups**.
1. Choose the network security group associated with your managed domain, such as *AADDS-contoso.com-NSG*.
1. Under **Settings** in the left-hand panel, click *Inbound security rules* or *Outbound security rules* depending on which rule you need to add.
1. Select **Add**, then create the required rule based on the port, protocol, direction, etc. When ready, select **OK**.

It takes a few moments for the security rule to be added and show in the list.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md
[configure-ldaps]: tutorial-configure-ldaps.md
