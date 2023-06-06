---
title: How to configure Quick Access for Global Secure Access
description: Learn how to configure Quick Access for Microsoft Entra Private Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: how-to
ms.date: 06/02/2023
ms.service: network-access
ms.custom: 

---
# How to configure Quick Access for Global Secure Access

With Global Secure Access, you can define specific websites or IP addresses to include in the traffic for Microsoft Entra Private Access. Your organization's employees can then access the apps and sites that you specify. This article describes how to configure Quick Access for Microsoft Entra Private Access.

## Prerequisites

To configure Quick Access, you must have:

- An Azure AD Premium P1/P2 license.
- **Microsoft Entra Internet Access Premium license** for your Microsoft Entra ID tenant
- **Global Secure Access Administrator** role in Microsoft Entra ID
- An App proxy license and the **Application Administrator** role in Microsoft Entra ID
- An [App proxy Connector group](../active-directory/app-proxy/application-proxy-connector-groups.md)

## How it works

Quick Access for Microsoft Entra Private Access unlocks the ability to specify the apps and websites that you consider to be private or internal, so you can manage how your organization accesses them. By defining this group of apps and websites, you are essentially packaging up all the private resources into one. 

By configuring Quick Access and enabling Microsoft Entra Private Access you can modernize how your organization's users access private apps and resources. Remote workers don't need to use a VPN to access these resources if they have the Global Secure Access client installed. The client quietly and seamlessly connects them to the resources they need. 

## Setup overview

Configuring your Quick Access settings is a major component to utilizing Microsoft Entra Private Access. If you don't configure these settings, the service has no sites or apps to forward traffic to. 

When you configure Quick Access for the first time, Microsoft Entra Private Access creates a new enterprise application. The properties of this new app are automatically configured to work with Microsoft Entra Private Access. 

To configure Quick Access you also need to have a [Microsoft Entra ID Application Proxy](../active-directory/app-proxy/application-proxy.md) connector group set up. This connector group handles the traffic to this new application. With Connectors, you can isolate apps per network and connector.

Once you have the Quick Access app and App proxy connector group configured, you need to grant access to the app. As mentioned, the properties of the Quick Access app are predefined. One of those properties requires that you assign users and groups through Enterprise Applications. For more information, see [Properties of an enterprise application](../active-directory/manage-apps/application-properties.md).

To summarize, the overall process is as follows:

1. Create an App proxy connector group, if you don't already have one.
1. Configure Quick Access, which creates a new enterprise app.
1. Assign users and groups to the app.
1. Enable Microsoft Entra Private Access.

Let's look at each of these steps in more detail.

## Create an App proxy connector group

Connectors are what make App proxy possible. They're simple, easy to deploy and maintain, and super powerful. To learn more about connectors, see [Understand Azure AD Application Proxy connectors](../active-directory/app-proxy/application-proxy-connectors.md).

You create App proxy connector groups so that you can assign specific connectors to serve specific applications. This capability gives you more control and ways to optimize your App proxy deployment. To learn more about connector groups, see [Publish applications on separate networks and locations using connector groups](../active-directory/app-proxy/application-proxy-connector-groups.md).

> [!IMPORTANT]
> Setting up App Proxy connectors and connector groups require planning and testing to ensure you have the right configuration for your organization. If you don't already have connector groups set up, pause this process and return when you have a connector group ready.

## Configure Quick Access

On the Quick Access page, you provide a name for the Quick Access app, select a connector group, and add websites and IP addresses. You can complete all three steps at the same time, or you can add the websites and IP addresses after the initial setup is complete. 

### Name and connector group

1. Enter a name.
1. Select a Connector group from the dropdown menu.

    ![Screenshot of the Quick Access app name.](media/how-to-configure-quick-access/new-quick-access-name.png)
    
    - Before you can set up Quick Access, you must have an App proxy connector group set up.
    - Your connector groups appear in the dropdown menu.
1. Select the **Save** button at the bottom of the page to create your "QuickAccess" app without adding websites and apps.

### Add Quick access range

The **Add Quick Access range** portion of this process is where you define the private or internal websites and apps that you want to include in the traffic for Microsoft Entra Private Access. You can add sites when you create the Quick Access app and return to add more or edit them later.

You can add fully qualified domain names (FQDN), IP addresses, and IP address ranges.

1. Go to **Global Secure Access** > **Applications** > **Quick Access**.
1. Select **Add quick access range**.
1. In the **Create application segment** panel that opens, select a **Destination type**. Choose from one of the following options. Depending on what you select, the subsequent fields change accordingly.
    - IP address
    - Fully qualified domain name
    - IP address range (CIDR)
    - IP address range (IP to IP). 
1. Enter the appropriate detail for what you selected.
1. Enter the port. 

1. Continue adding websites and apps as needed. You can add up to 500 websites and apps.

1. Select the **Save** button when you're finished.

![Screenshot of the Quick Access app with websites added.](media/how-to-configure-quick-access/new-quick-access-with-ranges.png)

## Manage Quick Access properties

When you configure Quick Access, a new enterprise app is created on your behalf. You can view the properties from **Quick Access** or navigate to **Enterprise applications** and search for your Quick Access app.

1. Select the **Edit application settings** button from Quick Access. 
1. Select **Properties** from the side menu.

![Screenshot of the edit application settings button.](media/how-to-configure-quick-access/edit-application-settings.png)

### Assign users and groups

You need to grant access to the Quick Access app you created by assigning users and/or groups to the app. 

> [!IMPORTANT]
> The **Enabled for users to sign-in?** option is set to **Yes** and must remain set this way. Changing this setting to No means users will not be able to access the sites and apps through Entra Private Access.

If you're viewing the Quick Access app properties, select **Users and groups** from the side menu. Otherwise you can go to **Enterprise applications**, search for and select your application, then select **Users and groups** from the side menu.

Add users and groups following the instructions in the [Assign users and groups to an application.](../active-directory/manage-apps/assign-user-or-group-access-portal.md) article.

### Update quick access ranges

You can add or update the sites and apps included in your Quick Access app at any time.

1. Go to **Global Secure Access**> **Quick Access**.
1. To add a new site or app, select **Add quick access range**.
1. To edit an existing app, select it from the **Destination type** column.

## Enable Microsoft Entra Private Access

Once you have your Quick Access app configured, your private websites and apps added, users assigned to the app, you can enable the Private access profile from **Traffic forwarding**. You can enable the profile before configuring Quick Access, but without the app and profile configured, there's no traffic to forward.

1. Go to **Global Secure Access** > **Traffic forwarding**.
1. Select the checkbox for **Private access profile**.

![Screenshot of the traffic forwarding page with the Private access profile enabled.](media/how-to-configure-quick-access/traffic-forwarding-microsoft-365-and-private-access.png)

## Next steps

- [Manage the private access traffic management profile](how-to-manage-private-access-profile.md)
- [Learn about traffic management profiles](concept-traffic-forwarding.md)
