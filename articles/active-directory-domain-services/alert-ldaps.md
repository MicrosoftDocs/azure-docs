---
title: Resolve secure LDAP alerts in Azure AD Domain Services | Microsoft Docs
description: Learn how to troubleshoot and resolve common alerts with secure LDAP for Azure Active Directory Domain Services.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 81208c0b-8d41-4f65-be15-42119b1b5957
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/18/2019
ms.author: iainfou

---
# Known issues: Secure LDAP alerts in Azure Active Directory Domain Services

Applications and services that use lightweight directory access protocol (LDAP) to communicate with Azure Active Directory Domain Services (Azure AD DS) can be [configured to use secure LDAP](tutorial-configure-ldaps.md). An appropriate certificate and required network ports must be open for secure LDAP to work correctly.

This article helps you understand and resolve common alerts with secure LDAP access in Azure AD DS.

## AADDS101: Secure LDAP network configuration

### Alert message

*Secure LDAP over the internet is enabled for the managed domain. However, access to port 636 is not locked down using a network security group. This may expose user accounts on the managed domain to password brute-force attacks.*

### Resolution

When you enable secure LDAP, it's recommended to create additional rules that restrict inbound LDAPS access to specific IP addresses. These rules protect the managed domain from brute force attacks. To update the network security group to restrict TCP port 636 access for secure LDAP, complete the following steps:

1. In the Azure portal, search for and select **Network security groups**.
1. Choose the network security group associated with your managed domain, such as *AADDS-contoso.com-NSG*, then select **Inbound security rules**
1. **+ Add** a rule for TCP port 636. If needed, select **Advanced** in the window to create a rule.
1. For the **Source**, choose *IP Addresses* from the drop-down menu. Enter the source IP addresses that you want to grant access for secure LDAP traffic.
1. Choose *Any* as the **Destination**, then enter *636* for **Destination port ranges**.
1. Set the **Protocol** as *TCP* and the **Action** to *Allow*.
1. Specify the priority for the rule, then enter a name such as *RestrictLDAPS*.
1. When ready, select **Add** to create the rule.

The managed domain's health automatically updates itself within two hours and removes the alert.

> [!TIP]
> TCP port 636 isn't the only rule needed for Azure AD DS to run smoothly. To learn more, see the [Azure AD DS Network security groups and required ports](network-considerations.md#network-security-groups-and-required-ports).

## AADDS502: Secure LDAP certificate expiring

### Alert message

*The secure LDAP certificate for the managed domain will expire on [date]].*

### Resolution

Create a replacement secure LDAP certificate by following the steps to [create a certificate for secure LDAP](tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap). Apply the replacement certificate to Azure AD DS, and distribute the certificate to any clients that connect using secure LDAP.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md
