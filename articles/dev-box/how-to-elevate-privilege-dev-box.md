---
title: Configure Microsoft Intune Endpoint Privilege Management
description: Learn how to configure Microsoft Intune Endpoint Privilege Management for dev boxes so that dev box users don't need local administrative privileges.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 02/27/2024

#customer intent: As a platform engineer, I want to configure elevated privilege management for dev boxes so that dev box users do not need local administrative privileges.

---

# Configure Microsoft Intune Endpoint Privilege Management for dev boxes 

In this article, you learn how to configure Microsoft Intune Endpoint Privilege Management for dev boxes so that dev box users don't need local administrative privileges.

Microsoft Intune Endpoint Privilege Management (EPM) allows your organization’s users to run as a standard user (without administrator rights) and complete tasks that require elevated privileges. Tasks that commonly require administrative privileges are application installs (like Microsoft 365 Applications), updating device drivers, and running certain Windows diagnostics.

Endpoint Privilege Management is built into Microsoft Intune, which means that all configuration is completed within the Microsoft Intune Admin Center. To get started with EPM, use the high-level process outlined as follows:

- *License Endpoint Privilege Management* - Before you can use Endpoint Privilege Management policies, you must license EPM in your tenant as an Intune add-on. For licensing information, see Use Intune Suite add-on capabilities.

- *Deploy an elevation settings policy* - An elevation settings policy activates EPM on the client device. This policy also allows you to configure settings that are specific to the client but aren't necessarily related to the elevation of individual applications or tasks.

- *Deploy elevation rule policies* - An elevation rule policy links an application or task to an elevation action. Use this policy to configure the elevation behavior for applications your organization allows when the applications run on the device.

## Prerequisites

- A dev center with a dev box project.
- Microsoft Intune subscription.

## License Endpoint Privilege Management

In this section, you configure EPM licensing and assign the EPM license to the target user.

Endpoint Privilege Management requires either a stand-alone license that adds only EPM, or license EPM as part of the Microsoft Intune Suite.

1. Configure the Azure tenant administrator for EPM purchasing:

    1. Open the [Microsoft Intune admin center](https://intune.microsoft.com), and navigate to **Tenant admin** >  **Intune add-ons**.
    1. Select **Endpoint Privilege Management**.

1. Configure Intune admin role for EPM administration: 

    1. In the Intune admin center, go to **Users**, and select the user you want to assign the role to. 
    1. Select **Add assignments** and assign the **Global Administrator** role, and the **Intune Administrator** role.
 
1. Apply the EPM license in Microsoft 365:

    1. In the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home?#/catalog), go to **Billing** > **Purchase services** > **Endpoint Privilege Management**, and then select your EPM license.

1. Assign E5 and EPM licenses to target user in Microsoft Entra ID:
 
    1. In the Intune admin center, go to **Users**, and select the user you want to assign the E5 and EPM licenses to. 
    1. Select **Assignments** and assign the licenses.

## Create Intune group

In this section, you create a dev box and an Intune group that you use to test the EPM policy configuration.

EPM supports the following operating systems:
- Windows 11 (versions 23H2, 22H2, and 21H2)
- Windows 10 (versions 22H2, 21H2, and 20H2)

1. Create a Dev Box Definition

    1. In the Azure portal, create a [Dev Box Definition](how-to-manage-dev-box-definitions.md). Specify a supported OS, like *Windows 11, version 22H2*. 

   1. In your project, create a [dev box pool](how-to-manage-dev-box-pools.md) that uses the new dev box definition.

   1. Assign [Dev Box User](how-to-dev-box-user.md) role to the target user.

1. Create Dev Box for the target user

   1. Sign in to the [developer portal](https://aka.ms/devbox-portal).

   1. Create a dev box using the dev box pool you created in the previous step.

   1. Determine the dev box hostname. You'll use this hostname add the dev box to and Intune group in the next step.
 
1. Create an Intune group

   1. Open the [Microsoft Intune admin center](https://intune.microsoft.com), select **Groups** > **New group**.

   1. In the **Group type** dropdown box, select **Security**.

   1. In the **Group name** field, enter the name for the new group (for example, Contoso Testers).

   1. Add a **Group description** for the group.

   1. Set the **Membership type** to **Assigned**.

   1. Under **Members**, select the dev box you created.

## Create EPM policy and assign policy to Dev Box

In this section, you create an EPM policy and assign the policy to the group you created earlier.

1. In the Microsoft Intune admin center, select **Endpoint security** > **Endpoint Privilege Management** > **Create Policy**.

1. In the **Create a profile** pane, select the following settings: 
    - **Platform**: Windows 10 and later
    - **Profile type**: Elevation settings policy

1. On the **Basics** tab, enter a name for the policy.

1. On the **Configuration settings** tab, in **Default elevation response**, select **Deny all elevation request**.

1. On the **Assignments** tab, select **Add groups**, add the group you created earlier, and then select **Create**.


## Validate Dev Box

In this section, you validate that the policy is applied to the dev box and that the Microsoft EPM Agent is installed.

1. Verify that the policy is applied to the dev box:

    1. In the Microsoft Intune admin center, select **Devices**, locate the dev box you created earlier, and then select **Device configuration**.
    1. Select the **Elevation settings** policy you created earlier.
    1. Wait until all the settings report as **Succeeded**.

1. Verify that the Microsoft EPM Agent is installed on the dev box:

    1. Sign in to the dev box you created earlier.
    1. Navigate to *c:\Program Files*, and verify that a folder named **Microsoft EPM Agent** exists.

1. Attempt to run an application with administrative privileges. 

    1. On your dev box, right-click an application and select **Run with elevated access**. You receive a message that the installation is blocked.

## Related content

* For more information, see [Use Intune Suite add-on capabilities](/em/intune/fundamentals/intune-add-ons).