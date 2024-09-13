---
title: Add the administrative template for Azure Virtual Desktop to Group Policy
description: Learn how to add the administrative template (ADMX) for Azure Virtual Desktop to Group Policy to configure certain features.
author: dknappettmsft
ms.topic: how-to
ms.date: 08/12/2024
ms.author: daknappe
---

# Add the administrative template for Azure Virtual Desktop to Group Policy

We've created an administrative template for Azure Virtual Desktop to configure some features of Azure Virtual Desktop. The template is available for:

- Microsoft Intune, which enables you to centrally configure session hosts that are enrolled in Intune and joined to Microsoft Entra ID or Microsoft Entra hybrid joined. The administrative template is available in the Intune settings catalog without any further configuration.

- Group Policy with Active Directory (AD), which enables you to centrally configure session hosts that are joined to an AD domain.

- Group Policy locally on each session host, but we don't recommend this to manage session hosts at scale.

You can configure the following features with the administrative template:

- [Graphics related data logging](connection-latency.md#connection-graphics-data-preview)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Screen capture protection](screen-capture-protection.md)
- [Watermarking](watermarking.md)

## Prerequisites

Before you can configure the template settings, you need to meet the following prerequisites. Select a tab for your scenario.

# [Group Policy (AD)](#tab/group-policy-domain)

For Group Policy in an Active Directory (AD) domain, you need the following permission:

- A member of the **Domain Admins** security group.

# [Local Group Policy](#tab/local-group-policy)

For local Group Policy on a session host, you need the following permission:

- A member of the local **Administrators** security group on each session host.

---

## Add the administrative template to Group Policy

To add the administrative template to Group Policy, select a tab for your scenario and follow these steps.

# [Group Policy (AD)](#tab/group-policy-domain)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the `.cab` file and `.zip` archive.

1. On your domain controllers, copy and paste the following files to the relevant location, depending if you store Group Policy templates in the local `PolicyDefinitions` folder or the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store). Replace `contoso.com` with your domain name, and `en-US` if you're using a different language.

   - **Filename**: `terminalserver-avd.admx`
       - **Local location**: `C:\Windows\PolicyDefinitions\`
       - **Central Store**: `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions`

   - **Filename**: `en-US\terminalserver-avd.adml`
       - **Local location**: `C:\Windows\PolicyDefinitions\en-US\`
       - **Central Store**: `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions\en-US`

1. On a device you use to manage Group Policy, open the **Group Policy Management Console (GPMC)** and create or edit a policy that targets your session hosts.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop available for you to configure, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Refer to the feature you want to configure for detailed instructions on how to configure the settings:

   - [Graphics related data logging](connection-latency.md#connection-graphics-data-preview)
   - [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
   - [Screen capture protection](screen-capture-protection.md)
   - [Watermarking](watermarking.md)

# [Local Group Policy](#tab/local-group-policy)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the `.cab` file and `.zip` archive.

1. On each session host, copy and paste the following files to the relevant location. Replace `en-US` if you're using a different language.

   - **Filename**: `terminalserver-avd.admx`
       - **Local location**: `C:\Windows\PolicyDefinitions\`

   - **Filename**: `en-US\terminalserver-avd.adml`
       - **Local location**: `C:\Windows\PolicyDefinitions\en-US\`

1. Open the **Local Group Policy Editor** console on a session host.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop available for you to configure, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Local Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Refer to the feature you want to configure for detailed instructions on how to configure the settings:

   - [Graphics related data logging](connection-latency.md#connection-graphics-data-preview)
   - [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
   - [Screen capture protection](screen-capture-protection.md)
   - [Watermarking](watermarking.md)

---
