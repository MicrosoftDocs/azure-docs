---
title: 'Azure Active Directory Domain Services: Troubleshooting Network Security Group configuration | Microsoft Docs'
description: Troubleshooting NSG configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager:
editor:

ms.assetid: 95f970a7-5867-4108-a87e-471fa0910b8c
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2019
ms.author: iainfou

---
# Troubleshoot invalid networking configuration for your managed domain
This article helps you troubleshoot and resolve network-related configuration errors that result in the following alert message:

## Alert AADDS104: Network error
**Alert message:**
 *Microsoft is unable to reach the domain controllers for this managed domain. This may happen if a network security group (NSG) configured on your virtual network blocks access to the managed domain. Another possible reason is if there is a user-defined route that blocks incoming traffic from the internet.*

Invalid NSG configurations are the most common cause of network errors for Azure AD Domain Services. The Network Security Group (NSG) configured for your virtual network must allow access to [specific ports](network-considerations.md#ports-required-for-azure-ad-domain-services). If these ports are blocked, Microsoft cannot monitor or update your managed domain. Additionally, synchronization between your Azure AD directory and your managed domain is impacted. While creating your NSG, keep these ports open to avoid interruption in service.

### Checking your NSG for compliance

1. Navigate to the [Network security groups](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FNetworkSecurityGroups) page in the Azure portal
2. From the table, choose the NSG associated with the subnet in which your managed domain is enabled.
3. Under **Settings** in the left-hand panel, click **Inbound security rules**
4. Review the rules in place and identify which rules are blocking access to [these ports](network-considerations.md#ports-required-for-azure-ad-domain-services)
5. Edit the NSG to ensure compliance by either deleting the rule, adding a rule, or creating a new NSG entirely. Steps to [add a rule](#add-a-rule-to-a-network-security-group-using-the-azure-portal) or create a new, compliant NSG are below

## Sample NSG
The following table depicts a sample NSG that would keep your managed domain secure while allowing Microsoft to monitor, manage, and update information.

![sample NSG](./media/active-directory-domain-services-alerts/default-nsg.png)

>[!NOTE]
> Azure AD Domain Services requires unrestricted outbound access from the virtual network. We recommend not to create any additional NSG rule that restricts outbound access for the virtual network.

## Add a rule to a Network Security Group using the Azure portal
If you do not want to use PowerShell, you can manually add single rules to NSGs using the Azure portal. To create rules in your Network security group, complete the following steps:

1. Navigate to the [Network security groups](https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FNetworkSecurityGroups) page in the Azure portal.
2. From the table, choose the NSG associated with the subnet in which your managed domain is enabled.
3. Under **Settings** in the left-hand panel, click either **Inbound security rules** or **Outbound security rules**.
4. Create the rule by clicking **Add** and filling in the information. Click **OK**.
5. Verify your rule has been created by locating it in the rules table.


## Need help?
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](contact-us.md).
