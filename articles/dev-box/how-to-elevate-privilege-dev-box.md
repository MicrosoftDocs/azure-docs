---
title: Configure Intune Endpoint Privilege Management
description: Learn how to configure Intune Endpoint Privilege Management (EPM) for dev boxes so that users can manage their dev boxes without needing administrative privileges.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 12/04/2025

#customer intent: As a platform engineer, I want to configure elevated privilege management for dev boxes so that users don't need administrative privileges to manage their dev boxes.
---

# Configure Intune Endpoint Privilege Management for dev boxes

This article shows you how to configure Microsoft Intune Endpoint Privilege Management so dev box users don't need elevated privileges to do common tasks on their dev boxes. Tasks that normally require elevated privileges include installing applications, updating device drivers, and running some Windows diagnostics. Intune Endpoint Privilege Management can let your organization's dev box users complete these tasks as standard, nonadministrative users.

Endpoint Privilege Management is an add-on to Microsoft Intune. Before you can use Endpoint Privilege Management, you must [license the add-in](#configure-licenses-and-roles) in your tenant either standalone or as part of the Intune Suite. Once licensed, you use the Microsoft Intune admin center to configure Endpoint Privilege Management and [deploy an elevation settings policy](#deploy-an-elevation-settings-policy) to dev boxes in your project.

## Prerequisites

| Category | Requirement |
|---|---|
| Authentication | Microsoft Entra ID for identity and access management. |
| Licenses | One Microsoft Intune license for each Microsoft Dev Box user. |
| Roles and permissions | - To administer Endpoint Privilege Management, **Intune Administrator** role.<br> - To create and manage a dev center, **Owner** or **Contributor** role in the Azure subscription or dev center.<br> - To create and use dev boxes, **DevCenter Dev Box User** role.|
| Tools | An Azure subscription linked to your Microsoft Entra tenant and Microsoft Intune license.|
| Tools | [A dev box created](quickstart-create-dev-box.md) with a supported OS, Windows 11 versions 21H2 or later. Determine the host name of the dev box for adding to the Intune group.|

## Configure licenses and roles

To license and configure the Microsoft Intune Endpoint Privilege Management add-on, you must:

1. Assign yourself the **Intune Administrator** role.
1. License **Endpoint Privilege Management** in your tenant as an Intune add-on.
1. Assign **Endpoint Privilege Management** licenses to yourself and other users.

### Assign the Intune administrator role

1. In the [Microsoft Intune admin center](https://intune.microsoft.com), go to **Users** and select yourself as the user.
1. Select **Assigned roles** in the left navigation menu, select **Add assignments**, and then select and assign the **Intune Administrator** role.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/tenant-admin.png" alt-text="Screenshot that shows assigning the Microsoft Intune Administrator role.":::

1. Repeat the process for any other users you want to assign the **Intune Administrator** role.

### License the Endpoint Privilege Management add-on

1. In the [Intune admin center](https://intune.microsoft.com), go to **Tenant administration** > **Intune add-ons** and select the **View details** link next to **Endpoint Privilege Management**.
1. On the details screen, select the link to the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home?#/catalog).
1. In the Microsoft 365 admin center, go to **Billing** > **Licenses**, select **Microsoft Intune Endpoint Privilege Management**, and purchase the number of licenses you need.

### Assign Endpoint Privilege Management licenses to users

1. In the Microsoft 365 admin center, go to **Billing** > **Your products**, and select **Microsoft Intune Endpoint Privilege Management**.
1. On the **Microsoft Intune Endpoint Privilege Management** page, select **Assign licenses**. You can also buy more licenses here by selecting **Buy licenses**.
1. On the **Users** tab, select **Assign licenses**.
1. On the **Assign licenses to users** screen, select up to 20 users at a time, and then select **Assign licenses**.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/assign-license.png" alt-text="Screenshot that shows assigning a Microsoft Intune Endpoint Privilege Management license.":::

## Deploy an elevation settings policy

To process elevation policy rules or requests, a dev box must have an elevation settings policy that enables Endpoint Privilege Management. Enabling this support installs the Endpoint Privilege Management agent, which processes the policy on the device. An elevation settings policy lets you configure settings that are specific to the client but aren't necessarily related to the elevation of individual applications or tasks.

The following procedures:

1. Create an Intune group to use for testing policy configuration, and add your dev box to the group.
1. Create an Endpoint Privilege Management elevation settings policy.
1. Assign the policy to the group.

### Create an Intune group and add the dev box

1. In the [Microsoft Intune admin center](https://intune.microsoft.com), select **Groups** > **New group**.
1. In the **New group** form, complete the following fields:
   - **Group type**: Select **Security**.
   - **Group name**: Enter a name for the group, for example *Intune testers*.
   - **Membership type**: Select **Assigned**.
   - **Members**: Select your dev box host name.
1. Select **Create**.

### Create an elevation settings policy and assign it to the group

1. In the Microsoft Intune admin center, select **Endpoint security** > **Endpoint Privilege Management**, and on the **Policies** tab, select **Create Policy**.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/intune-endpoint-security.png" alt-text="Screenshot that shows the Microsoft Intune admin center, showing the Endpoint Privilege Management pane.":::

1. On the **Create a profile** screen, select the following options:

   - **Platform**: Select **Windows 10 and later**.
   - **Profile type**: Select **Elevation settings policy**.

1. Select **Create**.
1. On the **Basics** tab of the **Create profile** pane, enter a name for the policy, and then select **Next**.
1. On the **Configuration settings** tab, expand **Privilege management elevation client settings**.
1. Set **Endpoint Privilege Management** to **Enabled**.
1. Under **Default elevation response**, select **Deny all requests**.
1. Select **Next** twice, or select the **Assignments** tab.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/deny-all-requests.png" alt-text="Screenshot that shows the Configuration settings tab, with Endpoint Privilege Management enabled and Default elevation response set to Deny all requests.":::

1. On the **Assignments** tab, select **Add groups** and add the Intune group you created.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/assign-defined-group.png" alt-text="Screenshot that shows the Create profile Assignments tab with Add groups highlighted.":::

1. Select **Next**, and then select **Create**.

It can take up to 20 minutes for the policy to be created and deployed. The policy then appears under **Devices** > **Configuration** in the Intune admin center.

## Verify administrative privilege restrictions

Confirm that the Endpoint Privilege Management policy is applied and the agent is installed and working on the dev boxes.

### Verify that the policy is applied to the dev box

1. In the [Microsoft Intune admin center](https://intune.microsoft.com), select **Devices** and then select **Configuration** under **Manage devices**.
1. On the **Configuration** screen, select the policy you created.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/intune-device-configuration.png" alt-text="Screenshot that shows the Microsoft Intune admin center with the Devices pane and Device configuration highlighted.":::

1. On the policy page, select the **Per setting status** tile.
1. Ensure that all settings report **Success** for all group devices.

   :::image type="content" source="media/how-to-elevate-privilege-dev-box/device-profile-settings.png" alt-text="Screenshot that shows Profile Settings with Setting status highlighted.":::

### Verify that the agent is installed and working on the dev box

On your dev box:
- Verify that a folder named *Microsoft Endpoint Privilege Management Agent* or *Microsoft EPM Agent* exists at *c:\\Program Files*.

- Right-click an application and select **Run with elevated access**. Verify that you get a message from Endpoint Privilege Management that **You can't run this app as administrator**.

## Related content

- [Use Intune Suite add-on capabilities](/intune/intune-service/fundamentals/intune-add-ons)
- [Use Endpoint Privilege Management with Microsoft Intune](/intune/intune-service/protect/epm-overview)
- [Configure access to Microsoft Dev Box projects](how-to-manage-dev-box-access.md)
