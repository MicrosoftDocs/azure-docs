---
title: Configure RDP Shortpath - Azure Virtual Desktop
description: Learn how to configure RDP Shortpath for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: how-to
ms.date: 02/02/2023
ms.author: daknappe
---
# Configure RDP Shortpath for Azure Virtual Desktop

> [!IMPORTANT]
> Using RDP Shortpath for public networks with TURN for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

RDP Shortpath is a feature of Azure Virtual Desktop that establishes a direct UDP-based transport between a supported Windows Remote Desktop client and session host. This article shows you how to configure RDP Shortpath for managed networks and public networks. For more information, see [RDP Shortpath](rdp-shortpath.md).

> [!IMPORTANT]
> RDP Shortpath is only available in the Azure public cloud.

## Prerequisites

Before you can enable RDP Shortpath, you'll need to meet the prerequisites. Select a tab below for your scenario.

# [Managed networks](#tab/managed-networks)

- A client device running the [Remote Desktop client for Windows](users/connect-windows.md), version 1.2.3488 or later. Currently, non-Windows clients aren't supported.

- Direct line of sight connectivity between the client and the session host. Having direct line of sight connectivity means that the client can connect directly to the session host on port 3390 (default) without being blocked by firewalls (including the Windows Firewall) or Network Security Group, and using a managed network such as:

  - [ExpressRoute private peering](../expressroute/expressroute-circuit-peerings.md).

  - Site-to-site or Point-to-site VPN (IPsec), such as [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

# [Public networks](#tab/public-networks)

> [!TIP]
> RDP Shortpath for public networks with STUN or TURN will work automatically without any additional configuration, providing networks and firewalls allow the traffic through and RDP transport settings in the Windows operating system for session hosts and clients are using their default values. The steps to configure RDP Shortpath for public networks are provided for session hosts and clients in case these defaults have been changed. 

- A client device running the [Remote Desktop client for Windows](users/connect-windows.md), version 1.2.3488 or later. Currently, non-Windows clients aren't supported.

- Internet access for both clients and session hosts. Session hosts require outbound UDP connectivity from your session hosts to the internet or connections to STUN and TURN servers. To reduce the number of ports required, you can [limit the port range used by clients for public networks](configure-rdp-shortpath-limit-ports-public-networks.md).

   If your environment uses Symmetric NAT, then you can use an indirect connection with TURN. For more information you can use to configure firewalls and Network Security Groups, see [Network configurations for RDP Shortpath](rdp-shortpath.md?tabs=public-networks#network-configuration).

- Check your client can connect to the STUN and TURN endpoints and verify that basic UDP functionality works by running the executable `avdnettest.exe`. For steps of how to do this, see [Verifying STUN/TURN server connectivity and NAT type](troubleshoot-rdp-shortpath.md#verifying-stunturn-server-connectivity-and-nat-type).

- To use TURN, the connection from the client must be within a supported location. For a list of Azure regions that TURN is available, see [supported Azure regions with TURN availability](rdp-shortpath.md#turn-availability-preview).

> [!IMPORTANT]
> - During the preview, TURN is only available for connections to session hosts in a validation host pool. To configure your host pool as a validation environment, see [Define your host pool as a validation environment](create-validation-host-pool.md#define-your-host-pool-as-a-validation-host-pool).
>
> - RDP Shortpath for public networks with TURN is only available in the Azure public cloud.

---

## Enable RDP Shortpath

The steps to enable RDP Shortpath differ for session hosts depending on whether you want to enable it for managed networks or public networks, but are the same for clients. Select a tab below for your scenario.

### Session hosts

# [Managed networks](#tab/managed-networks)

To enable RDP Shortpath for managed networks, you need to enable the RDP Shortpath listener on your session hosts. You can do this using Group Policy, either centrally from your domain for session hosts that are joined to an Active Directory (AD) domain, or locally for session hosts that are joined to Microsoft Entra ID.

1. Download the [Azure Virtual Desktop administrative template](https://aka.ms/avdgpo) and extract the contents of the .cab file and .zip archive.

1. Depending on whether you want to configure Group Policy centrally from your AD domain, or locally for each session host:

   1. **AD Domain**: Copy and paste the **terminalserver-avd.admx** file to the Central Store for your domain, for example `\\contoso.com\SYSVOL\contoso.com\policies\PolicyDefinitions`, where *contoso.com* is your domain name. Then copy the **en-us\terminalserver-avd.adml** file to the `en-us` subfolder.
   1. Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.
   
   1. **Locally**: Copy and paste the **terminalserver-avd.admx** file to `%windir%\PolicyDefinitions`. Then copy the **en-us\terminalserver-avd.adml** file to the `en-us` subfolder.
   1. Open the **Local Group Policy Editor** on the session host.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop, as shown in the following screenshot:

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="Screenshot of the Group Policy Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Open the policy setting **Enable RDP Shortpath for managed networks** and set it to **Enabled**. If you enable this policy setting, you can also configure the port number that Azure Virtual Desktop session hosts will use to listen for incoming connections. The default port is **3390**.

1. If you need to configure Windows Firewall to allow port 3390, run one of the following commands, depending on whether you want to configure Windows Firewall using Group Policy centrally from your AD domain, or locally for each session host:

   1. **AD Domain**: Open an elevated PowerShell prompt and run the following command, replacing the value for `$domainName` with your own domain name, the value for `$writableDC` with the hostname of a writeable domain controller, and the value for `$policyName` with the name of an existing Group Policy Object:
   
      ```powershell
      $domainName = "contoso.com"
      $writableDC = "dc01"
      $policyName = "RDP Shortpath Policy"
      $gpoSession = Open-NetGPO -PolicyStore "$domainName\$policyName" -DomainController $writableDC
      
      New-NetFirewallRule -DisplayName 'Remote Desktop - RDP Shortpath (UDP-In)' -Action Allow -Description 'Inbound rule for the Remote Desktop service to allow RDP Shortpath traffic. [UDP 3390]' -Group '@FirewallAPI.dll,-28752' -Name 'RemoteDesktop-UserMode-In-RDPShortpath-UDP' -Profile Domain, Private -Service TermService -Protocol UDP -LocalPort 3390 -Program '%SystemRoot%\system32\svchost.exe' -Enabled:True -GPOSession $gpoSession
      
      Save-NetGPO -GPOSession $gpoSession
      ```

   1. **Locally**: Open an elevated PowerShell prompt and run the following command:
   
      ```powershell
      New-NetFirewallRule -DisplayName 'Remote Desktop - RDP Shortpath (UDP-In)'  -Action Allow -Description 'Inbound rule for the Remote Desktop service to allow RDP Shortpath traffic. [UDP 3390]' -Group '@FirewallAPI.dll,-28752' -Name 'RemoteDesktop-UserMode-In-RDPShortpath-UDP' -PolicyStore PersistentStore -Profile Domain, Private -Service TermService -Protocol UDP -LocalPort 3390 -Program '%SystemRoot%\system32\svchost.exe' -Enabled:True
      ```

1. Select OK and restart your session hosts to apply the policy setting.

# [Public networks](#tab/public-networks)

If you need to configure session hosts and clients to enable RDP Shortpath for public networks because their default settings have been changed, follow these steps. You can do this using Group Policy, either centrally from your domain for session hosts that are joined to an Active Directory (AD) domain, or locally for session hosts that are joined to Microsoft Entra ID.

1. Depending on whether you want to configure Group Policy centrally from your AD domain, or locally for each session host:

   1. **AD Domain**: Open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.
   
   1. **Locally**: Open the **Local Group Policy Editor** on the session host.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Connections**.

1. Open the policy setting **Select RDP transport protocols**. Set it to **Enabled**, then for **Select Transport Type**, select **Use both UDP and TCP**.

1. Select OK and restart your session hosts to apply the policy setting.

---

### Windows clients

The steps to ensure your clients are configured correctly are the same regardless of whether you want to use RDP Shortpath for managed networks or public networks. You can do this using Group Policy for managed clients that are joined to an Active Directory domain, Intune for managed clients that are joined to Microsoft Entra ID and enrolled in Intune, or local Group Policy for clients that aren't managed.

> [!NOTE]
> By default in Windows, RDP traffic will attempt to use both TCP and UDP protocols. You will only need to follow these steps if the client has previously been configured to use TCP only.

#### Enable RDP Shortpath on managed and unmanaged Windows clients using Group Policy

To configure managed and unmanaged Windows clients using Group Policy:

1. Depending on whether you want to configure managed or unmanaged clients:

    1. For managed clients, open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your clients.

    1. For unmanaged clients, open the **Local Group Policy Editor** on the client.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client**.

1. Open the policy setting **Turn Off UDP On Client** and set it to **Disabled**.

1. Select OK and restart your clients to apply the policy setting.

#### Enable RDP Shortpath on Windows clients using Intune

To configure managed Windows clients using Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, using Administrative templates.

1. Browse to **Computer Configuration** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client**.

1. Select the setting **Turn Off UDP On Client** and set it to **Disabled**.

1. Select **OK**, then select **Next**.

1. Apply the configuration profile, then restart your clients.

### Teredo support

While not required for RDP Shortpath, Teredo adds extra NAT traversal candidates and increases the chance of the successful RDP Shortpath connection in IPv4-only networks. You can enable Teredo on both session hosts and clients by running the following command from an elevated PowerShell prompt:

```powershell
Set-NetTeredoConfiguration -Type Enterpriseclient
```

## Verify RDP Shortpath is working

Next, you'll need to make sure your clients are connecting using RDP Shortpath. You can verify the transport with either the *Connection Information* dialog from the Remote Desktop client, or by using Log Analytics.

### Connection Information dialog

To make sure connections are using RDP Shortpath, you can check the connection information on the client. Select a tab below for your scenario.

# [Managed networks](#tab/managed-networks)

1. Connect to Azure Virtual Desktop.

1. Open the *Connection Information* dialog by going to the **Connection** tool bar on the top of the screen and select the signal strength icon, as shown in the following screenshot:

   :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-bar.png" alt-text="Screenshot of Remote Desktop Connection Bar of Remote Desktop client.":::

1. You can verify in the output that the transport protocol is **UDP (Private Network)**, as shown in the following screenshot:

   :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-managed.png" alt-text="Screenshot of Remote Desktop Connection Info dialog.":::

# [Public networks](#tab/public-networks)

1. Connect to Azure Virtual Desktop.

1. Open the *Connection Information* dialog by going to the **Connection** tool bar on the top of the screen and select the signal strength icon, as shown in the following screenshot:

   :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-bar.png" alt-text="Screenshot of Remote Desktop Connection Bar of Remote Desktop client.":::

1. You can verify in the output that UDP is enabled, as shown in the following screenshots.

   1. If STUN is used, the transport protocol is **UDP**:
   
      :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-public-stun.png" alt-text="Screenshot of Remote Desktop Connection Info dialog when using STUN.":::

   1. If TURN is used, the transport protocol is **UDP (Relay)**:
   
      :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-public-turn.png" alt-text="Screenshot of Remote Desktop Connection Info dialog when using TURN.":::

---

### Event Viewer

To make sure connections are using RDP Shortpath, you can check the event logs on the session host:

1. Connect to Azure Virtual Desktop.

1. On the session host, open **Event Viewer**.

1. Browse to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.

1. Filter by Event ID **135**. Connections using RDP Shortpath will state the transport type is using UDP with the message **The multi-transport connection finished for tunnel: 1, its transport type set to UDP**.

### Log Analytics

If you're using [Azure Log Analytics](./diagnostics-log-analytics.md), you can monitor connections by querying the [WVDConnections table](/azure/azure-monitor/reference/tables/wvdconnections). A column named UdpUse indicates whether Azure Virtual Desktop RDP Stack is using UDP protocol on the current user connection.
The possible values are:

- **1** - The user connection is using RDP Shortpath for managed networks.

- **2** - The user connection is using RDP Shortpath for public networks directly using STUN.

- **4** - The user connection is using RDP Shortpath for public networks indirectly using TURN.

- For any other value, the user connection isn't using RDP Shortpath and is connected using TCP.

The following query lets you review connection information. You can run this query in the [Log Analytics query editor](../azure-monitor/logs/log-analytics-tutorial.md#write-a-query). For each query, replace `user@contoso.com` with the UPN of the user you want to look up.

```kusto
let Events = WVDConnections | where UserName == "user@contoso.com" ;
Events
| where State == "Connected"
| project CorrelationId, UserName, ResourceAlias, StartTime=TimeGenerated, UdpUse, SessionHostName, SessionHostSxSStackVersion
| join (Events
| where State == "Completed"
| project EndTime=TimeGenerated, CorrelationId, UdpUse)
on CorrelationId
| project StartTime, Duration = EndTime - StartTime, ResourceAlias, UdpUse, SessionHostName, SessionHostSxSStackVersion
| sort by StartTime asc
```

You can verify if RDP Shortpath is enabled for a specific user session by running the following Log Analytics query:

```kusto
WVDCheckpoints 
| where Name contains "Shortpath"
```

To learn more about error information you may see logged in Log Analytics, 

## Disable RDP Shortpath

The steps to disable RDP Shortpath differ for session hosts depending on whether you want to disable it for managed networks only, public networks only, or both. Select a tab below for your scenario.

### Session hosts

# [Managed networks](#tab/managed-networks)

To disable RDP Shortpath for managed networks on your session hosts, you need to disable the RDP Shortpath listener. You can do this using Group Policy, either centrally from your domain for session hosts that are joined to an AD domain, or locally for session hosts that are joined to Microsoft Entra ID.

Alternatively, you can block port **3390** (default) to your session hosts on a firewall or Network Security Group.

1. Depending on whether you want to configure Group Policy centrally from your domain, or locally for each session host:

   1. **AD Domain**: Open the **Group Policy Management Console** (GPMC) and edit the existing policy that targets your session hosts.

   1. **Locally**: Open the **Local Group Policy Editor** on the session host.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. You should see policy settings for Azure Virtual Desktop providing you have the administrative template from when you enabled RDP Shortpath for managed networks.

1. Open the policy setting **Enable RDP Shortpath for managed networks** and set it to **Not Configured**.

1. Select OK and restart your session hosts to apply the policy setting.

# [Public networks](#tab/public-networks)

To disable RDP Shortpath for public networks on your session hosts, you can set RDP transport protocols to only allow TCP. You can do this using Group Policy, either centrally from your domain for session hosts that are joined to an AD domain, or locally for session hosts that are joined to Microsoft Entra ID.

> [!CAUTION]
> This will also disable RDP Shortpath for managed networks. 

Alternatively, if you want to disable RDP Shortpath for public networks only, you'll need to block access to the STUN endpoints on a firewall or Network Security Group. The IP addresses for the STUN endpoints can be found in the table for [Session host virtual network](rdp-shortpath.md#session-host-virtual-network).

1. Depending on whether you want to configure Group Policy centrally from your domain, or locally for each session host:

   1. **AD Domain**: Open the **Group Policy Management Console** (GPMC) and edit the existing policy that targets your session hosts.

   1. **Locally**: Open the **Local Group Policy Editor** on the session host.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Connections**.

1. Open the policy setting **Select RDP transport protocols**. Set it to **Enabled**, then for **Select Transport Type**, select **Use only TCP**.

1. Select OK and restart your session hosts to apply the policy setting.

---

### Windows clients

On client devices, you can disable RDP Shortpath for managed networks and public networks by configuring RDP traffic to only use TCP. You can do this using Group Policy for managed clients that are joined to an Active Directory domain, Intune for managed clients that are joined to (Microsoft Entra ID) and enrolled in Intune, or local Group Policy for clients that aren't managed.

> [!IMPORTANT]
> If you have previously set RDP traffic to attempt to use both TCP and UDP protocols using Group Policy or Intune, ensure the settings don't conflict.

#### Disable RDP Shortpath on managed and unmanaged Windows clients using Group Policy

To configure managed and unmanaged Windows clients using Group Policy:

1. Depending on whether you want to configure managed or unmanaged clients:

    1. For managed clients, open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your clients.

    1. For unmanaged clients, open the **Local Group Policy Editor** on the client.

1. Browse to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client**.

1. Open the policy setting **Turn Off UDP On Client** and set it to **Enabled**.

1. Select OK and restart your clients to apply the policy setting.

#### Disable RDP Shortpath on Windows clients using Intune

To configure managed Windows clients using Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, using Administrative templates.

1. Browse to **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client**.

1. Select the setting **Turn Off UDP On Client** and set it to **Enabled**. Select **OK**, then select **Next**.

1. Apply the configuration profile, then restart your clients.

## Next steps

- Learn how to [limit the port range used by clients](configure-rdp-shortpath-limit-ports-public-networks.md) using RDP Shortpath for public networks.
- If you're having trouble establishing a connection using the RDP Shortpath transport for public networks, see [Troubleshoot RDP Shortpath](troubleshoot-rdp-shortpath.md).
