---
title: How to configure per-app access for Global Secure Access
description: Learn how to configure per-app access for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/21/2023
ms.service: network-access
ms.custom: 
ms.reviewer: katabish
---
# How to configure per-app access for Global Secure Access

Microsoft Entra Private Access provides secure access to your organization's internal resources. You can specify the internal, private resources that you want to secure by configuring and enabling per-app access through Enterprise applications. 

This article describes how to configure per-app access for Microsoft Entra Private Access.

## Prerequisites

To configure per-app access, you must have:

- The **Global Secure Access Administrator** and **Application Administrator** roles in Microsoft Entra ID

To manage App Proxy connector groups, which is required for per-app access, you must have:

- An **Application Administrator** role in Microsoft Entra ID
- A Microsoft Entra ID Premium P1/P2 license

### Known limitations

- Avoid overlapping app segments between Quick Access and enterprise apps.
- Tunneling traffic to Private Access destinations by IP address is supported only for IP ranges outside of the end-user device local subnet.
- At this time, Private access traffic can only be acquired with the Global Secure Access Client. Remote networks can't be assigned to the Private access traffic forwarding profile.

## Setup overview

Per-app access is configured by creating a new Enterprise app from the Global Secure Access area of Microsoft Entra. You create the app, select a connector group, and add network access segments. These settings make up the individual app that you can assign users and groups to.

To configure per-app access, you need to have a connector group with at least one active [Microsoft Entra ID Application Proxy](../active-directory/app-proxy/application-proxy.md) connector. This connector group handles the traffic to this new application. With Connectors, you can isolate apps per network and connector.

To summarize, the overall process is as follows:

1. Create an App Proxy connector group, if you don't already have one.
1. Create a new enterprise app from Global Secure Access.
1. Assign users and groups to the app.
1. Configure Conditional Access policies.
1. Enable Microsoft Entra Private Access.

Let's look at each of these steps in more detail.

## Create an App Proxy connector group

To configure Private Access for Enterprise apps, you must have a connector group with at least one active App Proxy connector.

If you don't already have a connector set up, see [Configure connectors](how-to-configure-quick-access.md).

## Configure Private Access

To create a new app, you provide a name, select a connector group, and then add application segments that include the fully qualified domain names (FQDNs) and IP addresses you want to tunnel through the service. You can complete all three steps at the same time, or you can add them after the initial setup is complete. 

### Name and connector group

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** with the appropriate roles. 
1. Go to **Global Secure Access (preview)** > **Applications** > **Enterprise applications**.
1. Select **New application**.
    
    ![Screenshot of the Enterprise apps and Add new application button.](media/how-to-configure-per-app-access/new-enterprise-app.png)

1. Enter a name for the app.
1. Select a Connector group from the dropdown menu.    
    - Existing connector groups appear in the dropdown menu.
1. Select the **Save** button at the bottom of the page to create your app without adding private resources.

### Application access segment

The **Add application segment** process is where you define the FQDNs and IP addresses that you want to include in the traffic for Microsoft Entra Private Access. You can add sites when you create the app and return to add more or edit them later.

You can add fully qualified domain names (FQDN), IP addresses, and IP address ranges.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)**.
1. Go to **Global Secure Access** > **Applications** > **Enterprise applications**.
1. Select **New application**.
1. Select **Add application segment**.

    ![Screenshot of the Add application segment button.](media/how-to-configure-per-app-access/enterprise-app-add-application-segment.png)

1. In the **Create application segment** panel that opens, select a **Destination type**. Choose from one of the following options. Depending on what you select, the subsequent fields change accordingly.
    - IP address
    - Fully qualified domain name
    - IP address range (CIDR)
    - IP address range (IP to IP). 
1. Enter the appropriate detail for what you selected.
1. Enter the port. 
1. Select the **Save** button when you're finished.

> [!NOTE]
> You can add up to 500 application segments to your app.
>
> Do not overlap FQDNs, IP addresses, and IP ranges between your Quick Access app and any Private Access apps.

### Assign users and groups

You need to grant access to the app you created by assigning users and/or groups to the app. For more information, see [Assign users and groups to an application.](../active-directory/manage-apps/assign-user-or-group-access-portal.md)

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)**.
1. Go to **Global Secure Access** > **Applications** > **Enterprise applications**.
1. Search for and select your application.
1. Select **Users and groups** from the side menu.
1. Add users and groups as needed.

> [!NOTE]
> Users must be directly assigned to the app or to the group assigned to the app. Nested groups are not supported.

## Update application segments

You can add or update the FQDNs and IP addresses included in your app at any time.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)**.
1. Go to **Global Secure Access** > **Applications** > **Enterprise applications**.
1. Search for and select your application.
1. Select **Network access properties** from the side menu.
    - To add a new FQDN or IP address, select **Add  application segment**.
    - To edit an existing app, select it from the **Destination type** column.

## Enable or disable access with the Global Secure Access Client

For per-app access, you can enable or disable access to the app using the Global Secure Access Client. This option is selected by default, but can be changed to not include the network access segments in the Private access traffic forwarding profile. 

![Screenshot of the enable access checkbox.](media/how-to-configure-per-app-access/per-app-access-enable-checkbox.png)

## Assign Conditional Access policies

Conditional Access policies for Private Access are configured at the application level for each app. Conditional Access policies can be created and applied to the application from two places:

- Go to **Global Secure Access (preview)** > **Applications** > **Enterprise applications**. Select an application and then select **Conditional Access** from the side menu.
- Go to **Microsoft Entra ID** > **Protection** > **Conditional Access** > **Policies**. Select **+ Create new policy**.

For more information, see [Apply Conditional Access policies to Private Access apps](how-to-target-resource-private-access-apps).

## Enable Microsoft Entra Private Access

Once you have your app configured, your private resources added, users assigned to the app, you can enable the Private access traffic forwarding profile. You can enable the profile before configuring Quick Access, but without the app and profile configured, there's no traffic to forward.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)**.
1. Go to **Global Secure Access** > **Connect** > **Traffic forwarding**.
1. Select the checkbox for **Private access profile**.

![Screenshot of the traffic forwarding page with the Private access profile enabled.](media/how-to-configure-per-app-access/private-access-traffic-profile.png)

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [Manage the private access traffic management profile](how-to-manage-private-access-profile.md)
- [Learn about traffic management profiles](concept-traffic-forwarding.md)
