---
title: How to configure traffic forwarding profiles
description: Learn how to configure traffic forwarding profiles for Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 05/15/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access Traffic management profiles

Traffic management profiles in Global Secure Access enable administrators to define and control how traffic is routed. Traffic management profiles can be assigned to devices and branches. 

This article describes the three traffic profiles and how they work.

## Traffic management

**Traffic management** enables you to configure the type of your network traffic to route through the Microsoft Entra Private and Internet Access services. You set up profiles to manage how Microsoft 365 traffic and private, internal traffic is managed. 

When traffic comes through Global Secure Access, the service evaluates the type of traffic first through the M365 profile and then through the Private access profile. Any traffic that doesn't match the first two profiles goes into the internet profile.

If the M365 profile isn't enabled, users can still access the Microsoft 365 services; however, the traffic isn't processed by the service.

:::image type="content" source="media/how-to-configure-traffic-forwarding/global-secure-access-overview.png" alt-text="Diagram of the Global Secure Access process." lightbox="media/how-to-configure-traffic-forwarding/global-secure-access-overview-expanded.png":::

In the previous diagram, the traffic coming into your network first passes through dedicated tunnels and is applied to your Conditional Access policies. The traffic is then routed through Global Secure Access and is evaluated by the traffic profiles. The traffic is routed to the appropriate apps and resources according to your enabled policies.

## M365 profile

With the M365 profile enabled, Microsoft Entra Internet Access acquires the traffic going to all Microsoft 365 (M365) services. The **M365** profile manages the following M365 services:

- Exchange Online
- SharePoint Online
- OneDrive for Business
- Microsoft 365 Common
- Office Online

### M365 traffic policies

To view the details of the domain names and IP addresses included in the traffic policy, select the **View** link for **M365 traffic policies**. Expand each section to view the full details.

![Screenshot of the M365 traffic policies.](media/how-to-configure-traffic-forwarding/microsoft-365-traffic-profile.png)

### Conditional Access policies

Conditional Access policies can be applied to your traffic profiles to provide more options for controlling access to applications, sites, and services. For example, you can create a policy that requires using compliant devices when accessing M365 services.

Conditional Access policies are created and applied to the profile in the Conditional Access are of Microsoft Entra ID. For more information, see the [Conditional Access overview](../active-directory/conditional-access/overview.md).

When creating a Conditional Access policy for the M365 profile, use the following settings:

1. Under **Target Resources** select **No target resources selected**.
1. Select **Network Access (Preview)** from the menu.
1. From the new menu appears, select one or more traffic profiles to apply the policy to. 

### Assignments

Traffic profiles can be assigned to branches, so you can customize what profiles are applied to what locations. You must create a branch before you can add it to the profile. For more information, see [How to create a branch](how-to-manage-branch-locations.md).

**To assign a branch to the M365 profile**:

1. Go to **Microsoft Entra ID** > **Global Secure Access** > **Traffic management**.
1. Select the **Add assignments** button. 
    - If you're editing the branch assignments, select the **Add/edit assignments** button.
1. Select a branch from the list and select **Add**.

## Private access profile

The private access profile looks at traffic going to your organization's internal applications and sites. The apps and sites that make up your private access profile is defined by your [Quick access groups](how-to-define-quick-access-ranges.md). Quick access groups are a collection of fully qualified domain names (FQDN), IP addresses, and IP address ranges. This group is then associated with the Private access profile. You can also apply a Conditional Access policy to the profile.

### Private access policies

To apply a Private access policy, a Quick access range must also be created. The Quick access range includes any IP addresses, IP ranges, and fully qualified domain names (FQDN) for the private applications and destinations you want to include in the policy.

For more information, see [Define Quick access ranges](how-to-define-quick-access-ranges.md).

## Conditional Access policies

To apply a Conditional Access policy, the policy must be created in Azure Active Directory (Azure AD). For more information, see [Conditional Access in Azure Active Directory](../active-directory/conditional-access/overview.md).

When creating a Conditional Access policy for the Private Access profile, use the following settings:

1. Under **Target Resources** select **No target resources selected**.
1. Select **Network Access (Preview)** from the menu.
1. From the new menu appears, select one or more traffic profiles to apply the policy to. 

## Internet profile

All other traffic that doesn't go to Microsoft 365 services or to your pre-defined private access sites get routed through the Internet profile.

## Next steps

- [Define Quick access ranges](how-to-define-quick-access-ranges.md)

