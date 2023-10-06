---
title: Resolve network security group alerts in Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to troubleshoot and resolve network security group configuration alerts for Microsoft Entra Domain Services
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 95f970a7-5867-4108-a87e-471fa0910b8c
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: justinha

---
# Known issues: Network configuration alerts in Microsoft Entra Domain Services

To let applications and services correctly communicate with a Microsoft Entra Domain Services managed domain, specific network ports must be open to allow traffic to flow. In Azure, you control the flow of traffic using network security groups. The health status of a Domain Services managed domain shows an alert if the required network security group rules aren't in place.

This article helps you understand and resolve common alerts for network security group configuration issues.

## Alert AADDS104: Network error

### Alert message

*Microsoft is unable to reach the domain controllers for this managed domain. This may happen if a network security group (NSG) configured on your virtual network blocks access to the managed domain. Another possible reason is if there is a user-defined route that blocks incoming traffic from the internet.*

Invalid network security group rules are the most common cause of network errors for Domain Services. The network security group for the virtual network must allow access to specific ports and protocols. If these ports are blocked, the Azure platform can't monitor or update the managed domain. The synchronization between the Microsoft Entra directory and Domain Services is also impacted. Make sure you keep the default ports open to avoid interruption in service.

## Default security rules

The following default inbound and outbound security rules are applied to the network security group for a managed domain. These rules keep Domain Services secure and allow the Azure platform to monitor, manage, and update the managed domain.

### Inbound security rules

| Priority | Name | Port | Protocol | Source | Destination | Action |
|----------|------|------|----------|--------|-------------|--------|
| 301      | AllowPSRemoting | 5986| TCP | AzureActiveDirectoryDomainServices | Any | Allow |
| 201      | AllowRD | 3389 | TCP | CorpNetSaw | Any | Deny<sup>1</sup> |
| 65000    | AllVnetInBound | Any | Any | VirtualNetwork | VirtualNetwork | Allow |
| 65001    | AllowAzureLoadBalancerInBound | Any | Any | AzureLoadBalancer | Any | Allow |
| 65500    | DenyAllInBound | Any | Any | Any | Any | Deny |


<sup>1</sup>Optional for debugging. Allow when required for advanced troubleshooting.

> [!NOTE]
> You may also have an additional rule that allows inbound traffic if you [configure secure LDAP][configure-ldaps]. This additional rule is required for the correct LDAPS communication.

### Outbound security rules

| Priority | Name | Port | Protocol | Source | Destination | Action |
|----------|------|------|----------|--------|-------------|--------|
| 65000    | AllVnetOutBound | Any | Any | VirtualNetwork | VirtualNetwork | Allow |
| 65001    | AllowAzureLoadBalancerOutBound | Any | Any |  Any | Internet | Allow |
| 65500    | DenyAllOutBound | Any | Any | Any | Any | Deny |

>[!NOTE]
> Domain Services needs unrestricted outbound access from the virtual network. We don't recommend that you create any additional rules that restrict outbound access for the virtual network.

## Verify and edit existing security rules

To verify the existing security rules and make sure the default ports are open, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Network security groups**.
1. Choose the network security group associated with your managed domain, such as *AADDS-contoso.com-NSG*.
1. On the **Overview** page, the existing inbound and outbound security rules are shown.

    Review the inbound and outbound rules and compare to the list of required rules in the previous section. If needed, select and then delete any custom rules that block required traffic. If any of the required rules are missing, add a rule in the next section.

    After you add or delete rules to allow the required traffic, the managed domain's health automatically updates itself within two hours and removes the alert.

### Add a security rule

To add a missing security rule, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Network security groups**.
1. Choose the network security group associated with your managed domain, such as *AADDS-contoso.com-NSG*.
1. Under **Settings** in the left-hand panel, click *Inbound security rules* or *Outbound security rules* depending on which rule you need to add.
1. Select **Add**, then create the required rule based on the port, protocol, direction, etc. When ready, select **OK**.

It takes a few moments for the security rule to be added and show in the list.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: /azure/active-directory/fundamentals/how-to-get-support
[configure-ldaps]: ./tutorial-configure-ldaps.md
