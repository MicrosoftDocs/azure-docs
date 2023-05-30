---
title: How to install the Global Secure Access Windows client
description: Install the Global Secure Access Windows client to enable client connectivity.
ms.service: network-access
ms.topic: how-to
ms.date: 05/30/2023
ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lirazb
---
# Install the Global Secure Access client

The Global Secure Access client allows organizations control over network traffic at the edge computing device, giving organizations the ability to route specific traffic profiles through Microsoft's Security Service Edge solution. Routing traffic in this method allows for more controls like continuous access evaluation (CAE), device compliance, or multifactor authentication to be required for resource access.

## Prerequisites

- A working Azure AD tenant with the appropriate license. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Administrators who interact with **Global Secure Access preview** features must have the [Global Secure Access Administrator role](../active-directory/roles/permissions-reference.md). To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-configure.md) to activate just-in-time privileged role assignments.
- The Global Secure Access client is supported on the following 64-bit versions of Windows:
   - Windows 11 version XXXX or higher <!--- supported versions --->
   - Windows 10 version XXXX or higher <!--- supported versions --->
- Devices must be either Azure AD joined or hybrid Azure AD joined. Azure AD registered devices aren't supported.
- IPv6 traffic isn't supported in the preview release. For more information, see the section [Disable IPv6 traffic](#disable-ipv6-traffic).

### Download the client

The most current version of the Global Secure Access client can be downloaded from the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Secure Access Administrator](../active-directory/roles/permissions-reference.md).
1. Browse to **Global Secure Access (Preview)** > **Devices** > **Clients**.
1. Select **Download**.

## Install the client

Organizations can install the client manually or use [Microsoft Intune to deploy it](/mem/intune/apps/apps-win32-app-management) to their devices. 

1. Copy the Global Secure Access client setup file to your client machine.
1. Run the setup file, such as *NetworkAccessInstaller 1.5.378*. Accept the software license terms.
1. After installing the client users are prompted to sign in.

   :::image type="content" source="media/how-to-install-windows-client/client-install-first-sign-in.png" alt-text="Screenshot showing the sign-in box appears after client installation completes." lightbox="media/how-to-install-windows-client/client-install-first-sign-in.png":::

1. After signing in the connection icon turns green, and double-clicking on it opens a notification with client information showing a connected state.

   :::image type="content" source="media/how-to-install-windows-client/client-install-connected.png" alt-text="Screenshot showing the client is connected.":::

## Disable IPv6 traffic

If you need assistance disabling IPv6 on devices you're trying the preview with, the following script disables IPv6 for you.

```powershell
function CreateIfNotExists
{
    param($Path)
    if (-NOT (Test-Path $Path))
    {
        New-Item -Path $Path -Force | Out-Null
    }
}

# Disable IPv6. Takes effect after reboot.
$disableIpv6Value = 0xff
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip6\Parameters" -Name "DisabledComponents" -Type DWord -Value $disableIpv6Value

CreateIfNotExists "HKLM:\SOFTWARE\Policies\Google"
CreateIfNotExists "HKLM:\SOFTWARE\Policies\Google\Chrome"
CreateIfNotExists "HKLM:\SOFTWARE\Policies\Microsoft"
CreateIfNotExists "HKLM:\SOFTWARE\Policies\Microsoft\Edge"

# Disable chrome and edge's built in DNS resolvers.
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Google\Chrome" -Name "BuiltInDnsClientEnabled" -Type DWord -Value 0
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "BuiltInDnsClientEnabled" -Type DWord -Value 0

# This is unneeded inside Microsoft, and other organizations that has already disabled DoH by other means
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "DnsOverHttpsMode" -Value "off"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Google\Chrome" -Name "DnsOverHttpsMode" -Value "off"
```

## Troubleshooting

msn.com will show edge location

To troubleshoot the Global Secure Access client, right-click the client icon in the taskbar.

:::image type="content" source="media/how-to-install-windows-client/client-install-menu-options.png" alt-text="Screenshot showing the context menu of the Global Secure Access client.":::

- Switch user
   - Forces sign-in screen to change user
- Pause
   - Stops windows services related to client. No longer tunneling traffic to edge
   - Expected client always on as a security tool. If a problem you can stop temporarily. Restarts on reboot
- Resume
   - Start stopped services
- Restart
   - Pause and resume
- Collect logs
   - Collect relavent logs for support
      - What is included...
- Analyze
   - Test client components to ensure configured and working as expected.
- Healthcheck tool
   - 

<!--- 

Need more details from PM for this section

--->

## Next steps

- [Enable source IP restoration](how-to-source-ip-restoration.md)
- [Enable compliant network check with Conditional Access](how-to-compliant-network.md)
