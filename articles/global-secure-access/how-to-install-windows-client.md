---
title: The Global Secure Access Client for Windows
description: Install the Global Secure Access Client for Windows to enable client connectivity.
ms.service: network-access
ms.topic: how-to
ms.date: 06/08/2023
ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lirazb
---
# The Global Secure Access Client for Windows

The Global Secure Access Client allows organizations control over network traffic at the end-user computing device, giving organizations the ability to route specific traffic profiles through Microsoft Entra Internet Access and Microsoft Entra Private Access. Routing traffic in this method allows for more controls like continuous access evaluation (CAE), device compliance, or multifactor authentication to be required for resource access.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Prerequisites

- Tenant must be onboarded to Global Secure Access.
- [Traffic forwarding profiles](concept-traffic-forwarding.md) must be enabled for the traffic you wish to tunnel.
- The Global Secure Access Client is supported on 64-bit versions of Windows 11 or Windows 10.
- Devices must be either Azure AD joined or hybrid Azure AD joined. 
   - Azure AD registered devices aren't supported.
- Local administrator credentials are required for installation.

### Known limitations

- IPv6 and secure DNS aren't supported in the preview release. For more information, see the section [Disable IPv6 and secure DNS](#disable-ipv6-and-secure-dns).
- If the end-user device is configured to use a proxy server, locations that you wish to tunnel using the Global Secure Access Client must be excluded from that configuration.
- Multiple user sessions like those from a Remote Desktop Server (RDP) aren't supported.
- Connecting to networks that use a captive portal, like some guest wireless solutions, might fail. As a workaround [pause the Global Secure Access Client](#troubleshooting).
- Single label domains, like `https://contosohome` aren't supported, instead use a fully qualified domain name (FQDN), like `https://contosohome.contoso.com`. Administrators can also choose to append DNS suffixes via Windows.
- The Global Secure Access Client currently only supports TCP traffic.
- Virtual machines where both the host and guest operating systems have the Global Secure Access Client installed aren't supported. Individual virtual machines with the client installed are supported.

## Download the client

The most current version of the Global Secure Access Client can be downloaded from the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Secure Access Administrator](../active-directory/roles/permissions-reference.md).
1. Browse to **Global Secure Access (Preview)** > **Devices** > **Clients**.
1. Select **Download**.

## Install the client

Organizations can install the client interactively, silently with the `/quiet` switch, or use mobile device management platforms like [Microsoft Intune to deploy it](/mem/intune/apps/apps-win32-app-management) to their devices. 

1. Copy the Global Secure Access Client setup file to your client machine.
1. Run the setup file, like *GlobalSecureAccessInstaller 1.5.527*. Accept the software license terms.
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

To troubleshoot the Global Secure Access Client, right-click the client icon in the taskbar.

:::image type="content" source="media/how-to-install-windows-client/client-install-menu-options.png" alt-text="Screenshot showing the context menu of the Global Secure Access Client.":::

- Switch user
   - Forces sign-in screen to change user or reauthenticate the existing user.
- Pause
   - This option can be used to temporarily disable traffic tunneling.
   - This option stops the Windows services related to client. When these services are stopped, traffic is no longer tunneled from the client machine to the cloud service. Network traffic behaves as if the client isn't installed while the client is paused. If the client machine is restarted, the services automatically restart with it.
- Resume
   - This option starts the underlying services related to the Global Secure Access Client. This option would be used to resume after temporarily pausing the client for troubleshooting. Traffic resumes tunneling from the client to the cloud service.
- Restart
   - This option stops and starts the Windows services related to client.
- Collect logs
   - Collect logs for support and further troubleshooting. These logs are collected and stored in `C:\Program Files\Global Secure Access Client\Logs` by default.
      - These logs include information about the client machine, the related event logs for the services, and registry values including the traffic forwarding profiles applied.
- Client Checker
   - Runs a script to test client components ensuring the client is configured and working as expected. 
- Connection Diagnostics provides a live display of client status and connections tunneled by the client to the Global Secure Access service. 
   - Summary tab shows general information about the client configuration including: policy version in use, last policy update date and time, and the ID of the tenant the client is configured to work with.
      - Hostname acquisition state changes to green when new traffic acquired by FQDN is tunneled successfully based on a match of the destination FQDN in a traffic forwarding profile.
   - Flows show a live list of connections initiated by the end-user device and tunneled by the client to the Global Secure Access edge. Each connection is new row.
      - Timestamp is the time when the connection was first established.
      - Fully Qualified Domain Name (FQDN) of the destination of the connection. If the decision to tunnel the connection was made based on an IP rule in the forwarding policy not by an FQDN rule, the FQDN column shows N/A.
      - Source port of the end-user device for this connection. 
      - Destination IP is the destination of the connection.
      - Protocol only TCP is supported currently.
      - Process name that initiated the connection. 
      - Flow active provides a status of whether the connection is still open.
      - Sent data provides the number of bytes sent by the end-user device over the connection. 
      - Received data provides the number of bytes received by the end-user device over the connection. 
      - Correlation ID is provided to each connection tunneled by the client. This ID allows tracing of the connection in the client logs (event viewer and ETL file) and the [Global Secure Access traffic logs](how-to-view-traffic-logs.md).
      - Flow ID is the internal ID of the connection used by the client shown in the ETL file.
      - Channel name identifies the traffic forwarding profile to which the connection is tunneled. This decision is taken according to the rules in the forwarding profile. 
   - HostNameAcquisition provides a list of hostnames that the client acquired based on the FQDN rules in the forwarding profile. Each hostname is shown in a new row. Future acquisition of the same hostname creates another row if DNS resolves the hostname (FQDN) to a different IP address.
      - Timestamp is the time when the connection was first established.
      - FQDN that is resolved.
      - Generated IP address is an IP address generated by the client for internal purposes. This IP is shown in flows tab for connections that are established to the relative FQDN.
      - Original IP address is the first IPv4 address in the DNS response when querying the FQDN. If the DNS server that the end-user device points to doesn’t return an IPv4 address for the query, the original IP address shows `0.0.0.0`.
   - Services shows the status of the Windows services related to the Global Secure Access Client. Services that are started have a green status icon, services that are stopped show a red status icon. All three Windows services must be started for the client to function.
   - Channels list the traffic forwarding profiles assigned to the client and the state of the connection to the Global Secure Access edge.

### Event logs

Event logs related to the Global Secure Access Client can be found in the Event Viewer under `Applications and Services/Microsoft/Windows/Global Secure Access Client/Operational`. These events provide useful detail regarding the state, policies, and connections made by the client.

## Next steps

- [Enable source IP restoration](how-to-source-ip-restoration.md)
- [Enable compliant network check with Conditional Access](how-to-compliant-network.md)
