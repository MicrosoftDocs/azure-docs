---
title: Administrative template for Azure Virtual Desktop
description: Learn how to use the administrative template (ADMX) for Azure Virtual Desktop with Intune or Group Policy to configure certain settings on your session hosts.
author: dknappettmsft
ms.topic: how-to
ms.date: 08/25/2023
ms.author: daknappe
---

# Administrative template for Azure Virtual Desktop

We've created an administrative template for Azure Virtual Desktop to configure some features of Azure Virtual Desktop. You can use the template with:

- Intune, which enables you to centrally configure session hosts that are enrolled in Intune and joined to Microsoft Entra ID or Microsoft Entra hybrid joined.

- Group Policy with Active Directory (AD), which enables you to centrally configure session hosts that are joined to an AD domain.

- Group Policy locally on each session host, but we don't recommend this to manage session hosts at scale.

You can configure the following features with the administrative template:

- [Graphics related data logging](connection-latency.md#connection-graphics-data-preview)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Screen capture protection](screen-capture-protection.md)
- [Watermarking](watermarking.md)

## Prerequisites

Before you can configure the template settings, you need to meet the following prerequisites. Select a tab for your scenario.

# [Intune](#tab/intune)

For Intune device configuration profile, you need the following permission:

- Assigned the [**Policy and Profile manager**](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in role-based access control (RBAC) role.

# [Group Policy (AD)](#tab/group-policy-domain)

For Group Policy in an Active Directory (AD) domain, you need the following permission:

- A member of the **Domain Admins** security group.

# [Local Group Policy](#tab/local-group-policy)

For local Group Policy on a session host, you need the following permission:

- A member of the local **Administrators** security group on each session host.

---

## Configure the administrative template

To configure the administrative template, select a tab for your scenario and follow these steps.

# [Intune](#tab/intune)

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see settings in the Azure Virtual Desktop subcategory available for you to configure, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png" alt-text="Screenshot of the Intune admin center showing Azure Virtual Desktop settings." lightbox="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png":::

1. Once you've configured settings, apply the configuration profile to your session hosts, then restart your session hosts for the settings to take effect.

# [Group Policy (AD)](#tab/group-policy-domain)

> [!NOTE]
> These steps assume you're using the [Central Store for Group Policy](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the Group Policy Central Store for your domain, for example `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions`, where *contoso.com* is your domain name. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop available for you to configure, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Once you've configured settings, apply the policy to your session hosts, then restart your session hosts for the settings to take effect.

# [Local Group Policy](#tab/local-group-policy)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the PolicyDefinitions folder at `%windir%\PolicyDefinitions`. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Local Group Policy Editor** console.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop available for you to configure, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Local Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Once you've configured settings, restart your session hosts for the settings to take effect.

---

## Next steps

Learn how to use the administrative template with the following features:

- [Graphics related data logging](connection-latency.md#connection-graphics-data-preview)
- [Screen capture protection](screen-capture-protection.md)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Watermarking](watermarking.md)
