---
title: Limit the port range when using RDP Shortpath for public networks - Azure Virtual Desktop
description: Learn how to limit the port range used by clients when using RDP Shortpath for public networks for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: how-to
ms.date: 03/01/2023
ms.author: daknappe
---
# Limit the port range when using RDP Shortpath for public networks

By default, RDP Shortpath for public networks uses an ephemeral port range of 49152 to 65535 to establish a direct path between server and client. However, you may want to configure your session hosts to use a smaller, predictable port range.

You can set a smaller default range of ports 38300 to 39299, or you can specify your own port range to use. When enabled on your session hosts, the Remote Desktop client will randomly select the port from the range you specify for every connection. If this range is exhausted, clients will fall back to using the default port range (49152-65535).

When choosing the base and pool size, consider the number of ports you choose. The range must be between 1024 and 49151, after which the ephemeral port range begins.

## Prerequisites

- A client device running the [Remote Desktop client for Windows](users/connect-windows.md), version 1.2.3488 or later. Currently, non-Windows clients aren't supported.

- Internet access for both clients and session hosts. Session hosts require outbound UDP connectivity from your session hosts to the internet. For more information you can use to configure firewalls and Network Security Group, see [Network configurations for RDP Shortpath](rdp-shortpath.md?tabs=public-networks#network-configuration). 

## Enable a limited port range

To enable a limited port range when using RDP Shortpath for public networks, you can use Group Policy, either centrally from your domain for session hosts that are joined to an Active Directory (AD) domain, or locally for session hosts that are joined to Azure Active Directory (Azure AD).

1. Download the [Azure Virtual Desktop administrative template](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Depending on whether you want to configure Group Policy centrally from your domain, or locally for each session host:
   
   **AD Domain**:
   1. Copy and paste the **terminalserver-avd.admx** file to the Central Store for your domain, for example `\\contoso.com\SYSVOL\contoso.com\policies\PolicyDefinitions`, where *contoso.com* is your domain name. Then copy the **en-us\terminalserver-avd.adml** file to the `en-us` subfolder.

   1. Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.
   
   **Locally**:
   1. Copy and paste the **terminalserver-avd.admx** file to `%windir%\PolicyDefinitions`. Then copy the **en-us\terminalserver-avd.adml** file to the `en-us` subfolder.

   1. Open the **Local Group Policy Editor** on the session host.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Open the policy setting **Use port range for RDP Shortpath for unmanaged networks** and set it to **Enabled**. For **UDP base port**, specify the port number to begin the range. For **Port pool size**, specify the number of sequential ports that will be in the range. For example, if you specify **38300** as the UDP base port and **1000** as the Port pool size, the upper port number will be **39299**.

   :::image type="content" source="media/configure-rdp-shortpath-limit-ports-public-networks/rdp-shortpath-gpo-port-range-unmanaged.png" alt-text="Screenshot of the Group Policy setting Use port range for RDP Shortpath for unmanaged networks." lightbox="media/configure-rdp-shortpath-limit-ports-public-networks/rdp-shortpath-gpo-port-range-unmanaged.png":::
