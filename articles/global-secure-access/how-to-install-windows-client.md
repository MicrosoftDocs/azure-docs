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

The Global Secure Access client allows organizations control over network traffic at the edge computing device, giving organizations the ability to route specific traffic profiles through Microsoft Entra Internet Access and Microsoft Entra Private Access. Routing traffic in this method allows for more controls like continuous access evaluation (CAE), device compliance, or multifactor authentication to be required for resource access.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Prerequisites

- Tenant must be onboarded to Global Secure Access.
- [Traffic forwarding profiles](concept-traffic-forwarding.md) must be enabled for the traffic you wish to tunnel.
- The Global Secure Access client is supported on Windows 11 or Windows 10.
- Devices must be either Azure AD joined or hybrid Azure AD joined. 
   - Azure AD registered devices aren't supported.
- Local administrator credentials are required for installation.

### Known limitations

- IPv6 and secure DNS aren't supported in the preview release. For more information, see the section [Disable IPv6 and secure DNS](#disable-ipv6-and-secure-dns).

## Download the client

The most current version of the Global Secure Access client can be downloaded from the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Secure Access Administrator](../active-directory/roles/permissions-reference.md).
1. Browse to **Global Secure Access (Preview)** > **Devices** > **Clients**.
1. Select **Download**.

## Install the client

Organizations can install the client interactively, silently with the `/quiet` switch, or use mobile device management platforms like [Microsoft Intune to deploy it](/mem/intune/apps/apps-win32-app-management) to their devices. 

1. Copy the Global Secure Access client setup file to your client machine.
1. Run the setup file, such as *GlobalSecureAccessInstaller 1.5.527*. Accept the software license terms.
1. After the client is installed, users are prompted to sign in with their Microsoft Entra ID credentials.

   :::image type="content" source="media/how-to-install-windows-client/client-install-first-sign-in.png" alt-text="Screenshot showing the sign-in box appears after client installation completes." lightbox="media/how-to-install-windows-client/client-install-first-sign-in.png":::

1. After users sign in, the connection icon turns green, and double-clicking on it opens a notification with client information showing a connected state.

   :::image type="content" source="media/how-to-install-windows-client/client-install-connected.png" alt-text="Screenshot showing the client is connected.":::

## Disable IPv6 and secure DNS

If you need assistance disabling IPv6 or secure DNS on devices you're trying the preview with, the following script disables IPv6 and DNS over HTTPS for you.

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

# This section disables DNS over HTTPS
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge" -Name "DnsOverHttpsMode" -Value "off"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Google\Chrome" -Name "DnsOverHttpsMode" -Value "off"
```

## Troubleshooting

To troubleshoot the Global Secure Access client, right-click the client icon in the taskbar.

:::image type="content" source="media/how-to-install-windows-client/client-install-menu-options.png" alt-text="Screenshot showing the context menu of the Global Secure Access client.":::

- Switch user
   - Forces sign-in screen to change user or reauthenticate the existing user.
- Pause
   - This option can be used to temporarily disable traffic tunneling. 
   - This option stops the Windows services related to client. When these services are stopped, traffic is no longer tunneled from the client machine to the cloud service. If the client machine is restarted, the services automatically restart with it.
- Resume
   - This option starts the underlying services related to the Global Secure Access Client. This option would be used to resume after temporarily pausing the client for troubleshooting.
- Restart
   - This option stops and starts the Windows services related to client.
- Collect logs
   - Collect logs for support and further troubleshooting. These logs are collected and stored in `C:\Program Files\Global Secure Access Client\Logs` by default.
      - These logs include information about the client machine, the related event logs for the services, and registry values including the traffic forwarding profiles applied.
- Client Checker
   - Runs a script to test client components ensuring the client is configured and working as expected. 
- Connection Diagnostics
   - Summary tab shows policy version, last update date and time, and tenant information.
      - Hostname acquisition state changes to green when traffic is tunneled successfully.
   - Flows provide a means to see what traffic and process is tunneling traffic, similar to a network trace.
   - HostNameAcquisition provides a list mapping specific hostnames to their original and generated IP addresses that were tunneled.
   - Services provides the current state of the underlying services that the Global Secure Access client requires to properly tunnel client traffic.
   - Channels list the traffic forwarding profiles assigned to the client.

## Next steps

- [Enable source IP restoration](how-to-source-ip-restoration.md)
- [Enable compliant network check with Conditional Access](how-to-compliant-network.md)
