---
title: Configure Intune Endpoint Privilege Management
description: Learn how to configure Intune Endpoint Privilege Management for dev boxes so that dev box users don't need local administrative privileges.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 08/27/2024

#customer intent: As a platform engineer, I want to configure elevated privilege management for dev boxes so that dev box users don't need local administrative privileges.
---

# Configure Intune Endpoint Privilege Management for dev boxes

In this article, you learn how to configure Intune Endpoint Privilege Management for dev boxes so that dev box users don't need local administrative privileges.

Intune Endpoint Privilege Management allows your organization's users to run as a standard user (without administrator rights) and complete tasks that require elevated privileges. Tasks that commonly require administrative privileges include:

 - Installing applications (like Microsoft 365 applications).
 - Updating device drivers.
 - Running certain Windows diagnostics.

Endpoint Privilege Management is built into Intune, which means that all configuration is completed within the Microsoft Intune admin center. To get started with Endpoint Privilege Management, use this high-level process:

- **License Endpoint Privilege Management:** Before you can use Endpoint Privilege Management policies, you must license Endpoint Privilege Management in your tenant as an Intune add-on. For licensing information, see [Use Intune Suite add-on capabilities](/intune/intune-service/fundamentals/intune-add-ons).
- **Deploy an elevation settings policy:** An elevation settings policy activates Endpoint Privilege Management on the client device. With this policy, you can configure settings that are specific to the client but aren't necessarily related to the elevation of individual applications or tasks.

## Prerequisites

- A dev center with a dev box project.
- An Intune subscription.

## License Endpoint Privilege Management

Endpoint Privilege Management requires either a stand-alone license that adds only Endpoint Privilege Management, or a license for Endpoint Privilege Management as part of the Intune Suite.

In this section, you configure Endpoint Privilege Management licensing and assign the Endpoint Privilege Management license to a user.

1. License Endpoint Privilege Management in your tenant as an Intune add-on:

    1. Open the [Microsoft Intune admin center](https://intune.microsoft.com), and go to **Tenant admin** >  **Intune add-ons**.
    1. Select **Endpoint Privilege Management**.

1. Configure an Intune admin role for Endpoint Privilege Management administration:

    1. In the Microsoft Intune admin center, go to **Users**, and select the user for whom you want to assign the role.
    1. Select **Add assignments**, and select the **Intune Administrator** role.
     
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/tenant-admin.png" alt-text="Screenshot that shows the Microsoft Intune admin center with the available tenant admin roles." lightbox="media/how-to-elevate-privilege-dev-box/tenant-admin.png":::

1. Apply the Endpoint Privilege Management license in Microsoft 365:

    In the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home?#/catalog), go to **Billing** > **Purchase services** > **Endpoint Privilege Management**, and then select your Endpoint Privilege Management license.

1. Assign Microsoft 365 E5 and Endpoint Privilege Management licenses to target users in Microsoft Entra ID:

    1. In the Microsoft Intune admin center, go to **Users**, and select the user for whom you want to assign the Microsoft 365 E5 and Endpoint Privilege Management licenses.
    1. Select **Assignments** and assign the licenses.
    
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/assign-license.png" alt-text="Screenshot that shows the Microsoft Intune admin center with the available licenses." lightbox="media/how-to-elevate-privilege-dev-box/assign-license.png":::

## Deploy an elevation settings policy

A dev box must have an elevation settings policy that enables support for Endpoint Privilege Management to:

- Process an elevation rules policy.
- Manage elevation requests.

When support is enabled, the Endpoint Privilege Management Agent, which processes the Endpoint Privilege Management policies, is installed.

In this section, you create a dev box and an Intune group that you use to test the Endpoint Privilege Management policy configuration. Then, you create an Endpoint Privilege Management elevation settings policy and assign the policy to the group.

1. Create a dev box definition:

    1. In the Azure portal, create a [dev box definition](how-to-manage-dev-box-definitions.md). Specify a supported OS, like **Windows 11, version 22H2**.
    
       > [!NOTE]
       > Endpoint Privilege Management supports the following operating systems:
       > - Windows 11 (versions 23H2, 22H2, and 21H2)
       > - Windows 10 (versions 22H2, 21H2, and 20H2)

   1. In your project, create a [dev box pool](how-to-manage-dev-box-pools.md) that uses the new dev box definition.

   1. Assign the [Dev Box User](how-to-dev-box-user.md) role to the test user.

1. Create a dev box for testing the policy:

   1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

   1. Create a dev box by using the dev box pool that you created in the previous step.

   1. Determine the dev box's host name. You use this host name to add the dev box and Intune group in the next step.

1. Create an Intune group, and add the dev box to the group:

   1. Open the [Microsoft Intune admin center](https://intune.microsoft.com), and select **Groups** > **New group**.

   1. In the **Group type** dropdown box, select **Security**.

   1. In the **Group name** field, enter the name for the new group (for example, Contoso Testers).

   1. Enter a group description for the group.

   1. Set **Membership type** to **Assigned**.

   1. Under **Members**, select the dev box that you created.

1. Create an Endpoint Privilege Management elevation settings policy and assign it to the group:

    1. In the Microsoft Intune admin center, select **Endpoint security** > **Endpoint Privilege Management** > **Policies** > **Create Policy**.
     
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/intune-endpoint-security.png" alt-text="Screenshot that shows the Microsoft Intune admin center, showing the Endpoint security | Endpoint Privilege Management pane." lightbox="media/how-to-elevate-privilege-dev-box/intune-endpoint-security.png":::

    1. On the **Create profile** pane, select the following settings:
       - **Platform**: Select **Windows 10 and later**.
       - **Profile type**: Select **Elevation settings policy**.

    1. On the **Basics** tab, enter a name for the policy.
     
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/create-profile-name.png" alt-text="Screenshot that shows the Create profile Basics tab with the policy name highlighted." lightbox="media/how-to-elevate-privilege-dev-box/create-profile-name.png":::

    1. On the **Configuration settings** tab, in **Default elevation response**, select **Deny all requests**.
     
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/deny-all-requests.png" alt-text="Screenshot that shows the Configuration settings tab, with Endpoint Privilege Management enabled and Default elevation response set to Deny all requests." lightbox="media/how-to-elevate-privilege-dev-box/deny-all-requests.png":::

    1. On the **Assignments** tab, select **Add groups**, add the group that you created earlier, and select **Create**.
     
       :::image type="content" source="media/how-to-elevate-privilege-dev-box/assign-defined-group.png" alt-text="Screenshot that shows the Create profile Assignments tab with Add groups highlighted." lightbox="media/how-to-elevate-privilege-dev-box/assign-defined-group.png":::

## Verify administrative privilege restrictions

In this section, you validate that the Endpoint Privilege Management Agent is installed and the policy is applied to the dev box.

1. Verify that the policy is applied to the dev box:

    1. In the Microsoft Intune admin center, select **Devices**, and select the dev box that you created earlier. Then select **Device configuration**, and select the policy that you created earlier.
     
         :::image type="content" source="media/how-to-elevate-privilege-dev-box/intune-device-configuration.png" alt-text="Screenshot that shows the Microsoft Intune admin center with the Devices pane and Device configuration highlighted." lightbox="media/how-to-elevate-privilege-dev-box/intune-device-configuration.png":::
     
    1. Wait until all the settings report as **Succeeded**.
     
         :::image type="content" source="media/how-to-elevate-privilege-dev-box/device-profile-settings.png" alt-text="Screenshot that shows Profile Settings with Setting status highlighted." lightbox="media/how-to-elevate-privilege-dev-box/device-profile-settings.png":::

1. Verify that the Endpoint Privilege Management Agent is installed on the dev box:

    1. Sign in to the dev box that you created earlier.
    1. Go to *c:\Program Files*, and verify that a folder named *Microsoft Endpoint Privilege Management Agent* exists.

1. Attempt to run an application with administrative privileges.

    On your dev box, right-click an application, and select **Run with elevated access**. You receive a message that the installation is blocked.

## Related content

* [Use Intune Suite add-on capabilities](/mem/intune/fundamentals/intune-add-ons)
* [Use Endpoint Privilege Management with Intune](/mem/intune/protect/epm-overview)