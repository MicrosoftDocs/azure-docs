---
title: 'Azure Active Directory Domain Services: Troubleshooting Secure LDAP configuration | Microsoft Docs'
description: Troubleshooting Secure LDAP for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager:
editor:

ms.assetid: 81208c0b-8d41-4f65-be15-42119b1b5957
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: iainfou

---
# Azure AD Domain Services - Troubleshooting Secure LDAP configuration

This article provides resolutions for common issues when [configuring secure LDAP](configure-ldaps.md) for Azure AD Domain Services.

## AADDS101: Secure LDAP Network Security Group configuration

**Alert message:**

*Secure LDAP over the internet is enabled for the managed domain. However, access to port 636 is not locked down using a network security group. This may expose user accounts on the managed domain to password brute-force attacks.*

### Secure LDAP port

When secure LDAP is enabled, we recommend creating additional rules to allow inbound LDAPS access only from certain IP addresses. These rules protect your domain from brute force attacks that could pose a security threat. Port 636 allows access to your managed domain. Here is how to update your NSG to allow access for Secure LDAP:

1. Navigate to the [Network Security Groups tab](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FNetworkSecurityGroups) in the Azure portal
2. Choose the NSG associated with your domain from the table.
3. Click on **Inbound security rules**
4. Create the port 636 rule
   1. Click **Add** on the top navigation bar.
   2. Choose **IP Addresses** for the source.
   3. Specify the Source port ranges for this rule.
   4. Input "636" for Destination port ranges.
   5. Protocol is **TCP**.
   6. Give the rule an appropriate name, description, and priority. This rule's priority should be higher than your "Deny all" rule's priority, if you have one.
   7. Click **OK**.
5. Verify that your rule has been created.
6. Check your domain's health in two hours to ensure that you have completed the steps correctly.

> [!TIP]
> Port 636 is not the only rule needed for Azure AD Domain Services to run smoothly. To learn more, visit the [Networking guidelines](network-considerations.md) or [Troubleshoot NSG configuration](alert-nsg.md) articles.
>

## AADDS502: Secure LDAP certificate expiring

**Alert message:**

*The secure LDAP certificate for the managed domain will expire on [date]].*

**Resolution:**

Create a new secure LDAP certificate by following the steps outlined in the [Configure secure LDAP](configure-ldaps.md) article.

## Contact us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](contact-us.md).
