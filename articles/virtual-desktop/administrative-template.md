---
title: Administrative template for Azure Virtual Desktop
description: Learn how to use the administrative template for Azure Virtual Desktop with Group Policy and Intune to configure settings.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/21/2022
ms.author: daknappe
---
# Administrative template for Azure Virtual Desktop

We've created an administrative template for Azure Virtual Desktop to configure some features of Azure Virtual Desktop. You can use the template with Group Policy and Intune, which enables you to centrally configure session hosts that are joined to Azure Active Directory (Azure AD) or to an Active Directory (AD) domain. You can also use the template with Group Policy locally on each session host, but this isn't recommended to manage session hosts at scale.

You can configure the following features with the administrative template:

- [Screen capture protection](screen-capture-protection.md)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Watermarking](watermarking.md)

## Prerequisites

TODO: CHECK

You'll need the following permission:

- For Group Policy in an Active Directory domain, you'll need to be a member of the **Domain Admins** security group.

- For Intune, you'll need to be assigned the **Intune administrator** role-based access control (RBAC) role.

- For local Group Policy on a session host, you'll need to be a member of the local **Administrators** security group.

## Add the administrative template

To add the administrative template, select a tab for your scenario and follow the steps below.

# [Group Policy (AD)](#tab/group-policy-domain)

> [!NOTE]
> These steps assume you're using the [Central Store for Group Policy](/troubleshoot/windows-client/group-policy/create-and-manage-central-store).

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the Group Policy Central Store for your domain, for example `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions`, where *contoso.com* is your domain name. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template-group-policy.png" alt-text="Screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template-group-policy.png":::

# [Intune (preview)](#tab/intune)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. See [Import custom ADMX and ADML administrative templates into Microsoft Intune](/mem/intune/configuration/administrative-templates-import-custom) for steps to add the Azure Virtual Desktop administrative template to Intune.

   > [!IMPORTANT]
   > There is a known issue with importing the Azure Virtual Desktop administrative template files into Intune. Before you import the files, follow the steps below:
   >
   > 1. Open `terminalserver-avd.admx` in a text editor.
   >
   > 1. Remove the following lines, then save the file:
   >
   >    ```xml
   >    <using prefix="terminalserver" namespace="Microsoft.Policies.TerminalServer" />
   >    ```
   >
   >    ```xml
   >    <parentCategory ref="terminalserver:TS_TERMINAL_SERVER" />
   >    ```

1. To verify that the Azure Virtual Desktop administrative template is available, [create a profile using the the imported administrative template](/mem/intune/configuration/administrative-templates-import-custom#create-a-profile-using-your-imported-files). For **Configuration settings**, browse to **Computer Configuration** > **Azure Virtual Desktop**. You should see configuration settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template-intune.png" alt-text="Screenshot of Intune profile configuration settings showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template-intune.png":::

# [Local Group Policy](#tab/local-group-policy)

1. Download the latest [Azure Virtual Desktop administrative template files](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Copy and paste the **terminalserver-avd.admx** file to the PolicyDefinitions folder at `%windir%\PolicyDefinitions`. Then copy the **terminalserver-avd.adml** file to the `en-us` subfolder.

1. Open the **Local Group Policy Editor** console.

1. To verify that the Azure Virtual Desktop administrative template is available, browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template-group-policy.png" alt-text="Screenshot of the Local Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template-group-policy.png":::

---

## Next steps

Learn how to use the administrative template with the following features:

- [Screen capture protection](screen-capture-protection.md)
- [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks)
- [Watermarking](watermarking.md)
