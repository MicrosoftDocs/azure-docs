---
title: Administrative template for Azure Virtual Desktop
description: Learn how to use the administrative template for Azure Virtual Desktop with Group Policy to configure settings.
author: dknappettmsft
ms.topic: how-to
ms.date: 02/02/2023
ms.author: daknappe
---
# Administrative template for Azure Virtual Desktop

We've created an administrative template for Azure Virtual Desktop to configure some features of Azure Virtual Desktop. You can use the template with Group Policy, which enables you to centrally configure session hosts that are joined to an Active Directory (AD) domain. You can also use the template with Group Policy locally on each session host, but this isn't recommended to manage session hosts at scale.

You can configure the following features with the administrative template:

- [Screen capture protection](screen-capture-protection.md)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Watermarking](watermarking.md)

> [!NOTE]
> Importing the administrative template to Microsoft Intune is currently not supported. You should eventually be able to configure these features using the Intune settings catalog.

## Prerequisites

You'll need the following permission:

- For Group Policy in an Active Directory domain, you'll need to be a member of the **Domain Admins** security group.

- For local Group Policy on a session host, you'll need to be a member of the local **Administrators** security group.

## Add the administrative template

To add the administrative template, select a tab for your scenario and follow these steps.

# [Group Policy (AD)](#tab/group-policy-domain)

> [!NOTE]
> These steps assume you're using the [Central Store for Group Policy](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the Group Policy Central Store for your domain, for example `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions`, where *contoso.com* is your domain name. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

# [Local Group Policy](#tab/local-group-policy)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the PolicyDefinitions folder at `%windir%\PolicyDefinitions`. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Local Group Policy Editor** console.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Local Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

---

## Next steps

Learn how to use the administrative template with the following features:

- [Screen capture protection](screen-capture-protection.md)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Watermarking](watermarking.md)
