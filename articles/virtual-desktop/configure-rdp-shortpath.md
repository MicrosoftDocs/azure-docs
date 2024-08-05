---
title: Configure RDP Shortpath for Azure Virtual Desktop
description: Learn how to configure RDP Shortpath for Azure Virtual Desktop, which establishes a UDP-based transport for a remote session.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 06/18/2024
---

# Configure RDP Shortpath for Azure Virtual Desktop

> [!IMPORTANT]
> RDP Shortpath for public networks via TURN for Azure Virtual Desktop is only available in the Azure public cloud.

Users can connect to a remote session from Azure Virtual Desktop using the Remote Desktop Protocol (RDP) with a UDP or TCP-based transport. RDP Shortpath establishes a UDP-based transport between a local device Windows App or the Remote Desktop app on supported platforms and session host. 

UDP-based transport offers better connection reliability and more consistent latency. TCP-based reverse connect transport provides the best compatibility with various networking configurations and has a high success rate for establishing RDP connections. If a UDP connection can't be established, a TCP-based reverse connect transport is used as a fallback connection method.

There are four options for RDP Shortpath that provide flexibility for how you want client devices to a remote session using UDP:

- **RDP Shortpath for managed networks**: A *direct* UDP connection between a client device and session host using a private connection, such as ExpressRoute private peering or a virtual private network (VPN). You enable the RDP Shortpath listener on session hosts and allow an inbound port to accept connections.
 
- **RDP Shortpath for managed networks with ICE/STUN**: A *direct* UDP connection between a client device and session host using a private connection, such as ExpressRoute private peering or a virtual private network (VPN). When the RDP Shortpath listener isn't enabled on session hosts and an inbound port isn't allowed, ICE/STUN is used to discover available IP addresses and a dynamic port that can be used for a connection. The port range is configurable.

- **RDP Shortpath for public networks with ICE/STUN**: A *direct* UDP connection between a client device and session host using a public connection. ICE/STUN is used to discover available IP addresses and a dynamic port that can be used for a connection. The RDP Shortpath listener and an inbound port aren't required. The port range is configurable.
 
- **RDP Shortpath for public networks via TURN**: An *indirect* UDP connection between a client device and session host using a public connection where TURN relays traffic through an intermediate server between a client and session host. An example of when you use this option is if a connection uses Symmetric NAT. A dynamic port is used for a connection; the port range is configurable. For a list of Azure regions that TURN is available, see [supported Azure regions with TURN availability](rdp-shortpath.md#turn-availability). The connection from the client device must also be within a supported location. The RDP Shortpath listener and an inbound port aren't required.

Which of the four options your client devices can use is also dependent on their network configuration. To learn more about how RDP Shortpath works, together with some example scenarios, see [RDP Shortpath](rdp-shortpath.md).

This article lists the default configuration for each of the four options and how to configure them. It also provides steps to verify that RDP Shortpath is working and how to disable it if needed.

> [!TIP]
> RDP Shortpath for public networks with STUN or TURN will work automatically without any additional configuration, if networks and firewalls allow the traffic through and RDP transport settings in the Windows operating system for session hosts and clients are using their default values.

## Default configuration

Your session hosts, the networking settings of the related host pool, and client devices need to be configured for RDP Shortpath. What you need to configure depends on which of the four RDP Shortpath options you want to use and also the network topology and configuration of client devices.

Here are the default behaviors for each option and what you need to configure:

| RDP Shortpath option | Session host settings | Host pool networking settings | Client device settings  |
|--|--|--|--|
| RDP Shortpath for managed networks | UDP and TCP are enabled in Windows by default.<br /><br />You need to enable the RDP Shortpath listener on session hosts using Microsoft Intune or Group Policy, and allow an inbound port to accept connections. | Default (enabled) | UDP and TCP are enabled in Windows by default. |
| RDP Shortpath for managed networks with ICE/STUN | UDP and TCP are enabled in Windows by default.<br /><br />You don't need any extra configuration, but you can limit the port range used. | Default (enabled) | UDP and TCP are enabled in Windows by default. |
| RDP Shortpath for public networks with ICE/STUN | UDP and TCP are enabled in Windows by default.<br /><br />You don't need any extra configuration, but you can limit the port range used. | Default (enabled) | UDP and TCP are enabled in Windows by default. |
| RDP Shortpath for public networks via TURN | UDP and TCP are enabled in Windows by default.<br /><br />You don't need any extra configuration, but you can limit the port range used. | Default (enabled) | UDP and TCP are enabled in Windows by default. |

## Prerequisites

Before you enable RDP Shortpath, you need:

- A client device running one of the following apps:
   - [Windows App](/windows-app/get-started-connect-devices-desktops-apps?pivots=azure-virtual-desktop) on the following platforms:
      - Windows
      - macOS
      - iOS and iPadOS
   
   - [Remote Desktop app](users/remote-desktop-clients-overview.md) on the following platforms:
      - Windows, version 1.2.3488 or later
      - macOS
      - iOS and iPadOS
      - Android (preview only)

- For **RDP Shortpath for managed networks**, you need direct connectivity between the client and the session host. This means that the client can connect directly to the session host on port 3390 (default) and isn't blocked by firewalls (including the Windows Firewall) or a Network Security Group. Examples of a managed network are [ExpressRoute private peering](../expressroute/expressroute-circuit-peerings.md) or a site-to-site or point-to-site VPN (IPsec), such as [Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md).

- Internet access for both clients and session hosts. Session hosts require outbound UDP connectivity from your session hosts to the internet or connections to STUN and TURN servers. To reduce the number of ports required, you can [limit the port range used with STUN and TURN](configure-rdp-shortpath.md#limit-the-port-range-used-with-stun-and-turn).

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).

- Parameters to configure RDP Shortpath using Azure PowerShell are added in version 5.2.1 preview of the Az.DesktopVirtualization module. You can download and install it from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.2.1-preview).

## Enable the RDP Shortpath listener for RDP Shortpath for managed networks

For the option **RDP Shortpath for managed networks**, you need to enable the RDP Shortpath listener on your session hosts and open an inbound port to accept connections. You can do this using Microsoft Intune or Group Policy in an Active Directory domain.

> [!IMPORTANT]
> You don't need to enable the RDP Shortpath listener for the other three RDP Shortpath options, as they use ICE/STUN or TURN to discover available IP addresses and a dynamic port that is used for a connection.

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable the RDP Shortpath listener on your session hosts using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/configure-rdp-shortpath/azure-virtual-desktop-admimistrative-template-intune.png" alt-text="A screenshot showing the Azure Virtual Desktop administrative templates options in the Microsoft Intune portal." lightbox="media/configure-rdp-shortpath/azure-virtual-desktop-admimistrative-template-intune.png":::

1. Check the box for **Enable RDP Shortpath for managed networks**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Enable RDP Shortpath for managed networks** to **Enabled**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Make sure Windows Firewall and any other firewalls you have allows the port you configured inbound to your session hosts. Follow the steps in [Firewall policy for endpoint security in Intune](/mem/intune/protect/endpoint-security-firewall-policy).

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To enable the RDP Shortpath listener on your session hosts using Group Policy in an Active Directory domain:

1. Make the administrative template for Azure Virtual Desktop available in your domain by following the steps in [Use the administrative template for Azure Virtual Desktop](administrative-template.md?tabs=group-policy-domain).

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Double-click the policy setting **Enable RDP Shortpath for managed networks** to open it.

1. Select **Enabled**. You can also configure the port number that Azure Virtual Desktop session hosts use to listen for incoming connections. The default port is **3390**. Once you finish, select **OK**.

1. Make sure Windows Firewall and any other firewalls you have allows the port you configured inbound to your session hosts. Follow the steps in [Configure rules with group policy](/windows/security/operating-system-security/network-security/windows-firewall/configure).

1. Ensure the policy is applied to the session hosts, then restart them for the settings to take effect.

---

## Check that UDP is enabled on session hosts

For session hosts, UDP is enabled by default in Windows. To check the RDP transport protocols setting in the Windows registry to verify that UDP is enabled:

1. Open a PowerShell prompt on a session host.

1. Run the following commands, which check the registry and outputs the current RDP transport protocols setting:

   ```powershell
   $regKey = Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services"

   If ($regKey.PSObject.Properties.name -contains "SelectTransport" -eq "True") {
       If (($regkey | Select-Object -ExpandProperty "SelectTransport") -eq 1) {
           Write-Output "The RDP transport protocols setting has changed. Its value is: Use only TCP."
       } elseif (($regkey | Select-Object -ExpandProperty "SelectTransport") -eq 2) {
           Write-Output "The default RDP transport protocols setting has changed. Its value is: Use either UDP or TCP."
       }
   } else {
       Write-Output "The RDP transport protocols setting hasn't been changed from its default value. UDP is enabled."
   }
   ```

   The output should be similar to the following output:

   ```output
   The RDP transport protocols setting hasn't been changed from its default value.
   ```

   If the output states that the value is **Use only TCP** it's likely that the value has been changed by Microsoft Intune or Group Policy in an Active Directory domain. You need to enable UDP in one of the following ways:

   1. Edit the existing Microsoft Intune policy or Active Directory Group Policy that targets your session hosts. The policy setting is at one of these locations:
   
      - For Intune policy: **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Connections** > **Select RDP transport protocols**.

      - For Group Policy: **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Connections** > **Select RDP transport protocols**.

   1. Either set the setting to **Not configured**, or set it to **Enabled**, then for **Select Transport Type**, select **Use both UDP and TCP**.

   1. Update the policy on the session hosts, then restart them for the settings to take effect.

## Configure host pool networking settings

You can granularly control how RDP Shortpath is used by configuring the networking settings of a host pool using the Azure portal or Azure PowerShell. Configuring RDP Shortpath on the host pool enables you to optionally set which of the four RDP Shortpath options you want to use and is used alongside the session host configuration.

Where there's a conflict between the host pool and session host configuration, the most restrictive setting is used. For example, if RDP Shortpath for manage networks is configured, where the listener is enabled on the session host and the host pool is set to disabled, RDP Shortpath for managed networks won't work.

Select the relevant tab for your scenario.

# [Azure portal](#tab/portal)

Here's how to configure RDP Shortpath in the host pool networking settings using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **Networking**, then select **RDP Shortpath**.

   :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-host-pool-configuration.png" alt-text="A screenshot showing the RDP Shortpath tab of a host pool's networking properties." lightbox="media/configure-rdp-shortpath/rdp-shortpath-host-pool-configuration.png":::

1. For each option, select a value from the drop-down each based on your requirements. **Default** corresponds to **Enabled** for each option.

1. Select **Save**.

# [Azure PowerShell](#tab/powershell)

Here's how to configure RDP Shortpath in the host pool networking settings using the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module. In the following examples, you need to change the `<placeholder>` values for your own.

> [!TIP]
> Be sure to use version 5.2.1 preview of the Az.DesktopVirtualization module.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Get the current RDP Shortpath settings for a host pool by running the following commands:

   ```azurepowershell
   $parameters = @{
       HostPoolName = "<HostPoolName>"
       ResourceGroupName = "<ResourceGroupName>"
   }

   Get-AzWvdHostPool @parameters | FL ManagedPrivateUdp, DirectUdp, PublicUdp, RelayUdp
   ```

   The output should be similar to the following output:

   ```output
   ManagedPrivateUdp : Default
   DirectUdp         : Default
   PublicUdp         : Default
   RelayUdp          : Default
   ```

   The available PowerShell parameters for RDP Shortpath map to the options as follows. Valid values for each of these parameters are **Default**, **Enabled**, or **Disabled**. Default corresponds to what Microsoft sets it to, in this case **Enabled** for each option.

   | PowerShell Parameter | RDP Shortpath option | 'Default' meaning |
   |--|--|--|
   | ManagedPrivateUdp | RDP Shortpath for managed networks | Enabled |
   | DirectUdp | RDP Shortpath for managed networks with ICE/STUN | Enabled |
   | PublicUdp | RDP Shortpath for public networks with ICE/STUN | Enabled |
   | RelayUdp | RDP Shortpath for public networks via TURN | Enabled |

3. Use the `Update-AzWvdHostPool` cmdlet with the following examples to configure RDP Shortpath. 

   - To leave RDP Shortpath for managed networks as the default, but disable all options that use STUN or TURN, run the following commands:

      ```azurepowershell
      $parameters = @{
            Name = "<HostPoolName>"
            ResourceGroupName = "<ResourceGroupName>"
            ManagedPrivateUdp = "Default"
            DirectUdp = "Disabled"
            PublicUdp = "Disabled"
            RelayUdp = "Disabled"
      }

      Update-AzWvdHostPool @parameters
      ```

   - To enable the two options for RDP Shortpath for public networks and disable the other options, run the following commands:

      ```azurepowershell
      $parameters = @{
            Name = "<HostPoolName>"
            ResourceGroupName = "<ResourceGroupName>"
            ManagedPrivateUdp = "Disabled"
            DirectUdp = "Disabled"
            PublicUdp = "Enabled"
            RelayUdp = "Enabled"
      }

      Update-AzWvdHostPool @parameters
      ```

   - To only use RDP Shortpath for public networks via TURN and disable the other options, run the following commands.

      ```azurepowershell
      $parameters = @{
            Name = "<HostPoolName>"
            ResourceGroupName = "<ResourceGroupName>"
            ManagedPrivateUdp = "Disabled"
            DirectUdp = "Disabled"
            PublicUdp = "Disabled"
            RelayUdp = "Enabled"
      }

      Update-AzWvdHostPool @parameters
      ```
      
4. Once you make changes, run the commands in step 2 again to verify the settings are applied as you expect.

---



## Check that UDP is enabled on Windows client devices

 For Windows client devices, UDP is enabled by default. To check in the Windows registry to verify that UDP is enabled:

1. Open a PowerShell prompt on a Windows client device.

1. Run the following commands, which check the registry and outputs the current setting:

   ```powershell
   $regKey = Get-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client"

   If ($regKey.PSObject.Properties.name -contains "fClientDisableUDP" -eq "True") {
       If (($regkey | Select-Object -ExpandProperty "fClientDisableUDP") -eq 1) {
           Write-Output "The default setting has changed. UDP is disabled."
       } elseif (($regkey | Select-Object -ExpandProperty "fClientDisableUDP") -eq 0) {
           Write-Output "The default setting has changed, but UDP is enabled."
       }
   } else {
       Write-Output "The default setting hasn't been changed from its default value. UDP is enabled."
   }
   ```

   The output should be similar to the following output:

   ```output
   The default setting hasn't been changed from its default value. UDP is enabled.
   ```

   If the output states that UDP is disabled, it's likely that the value has been changed by Microsoft Intune or Group Policy in an Active Directory domain. You need to enable UDP in one of the following ways:

   1. Edit the existing Microsoft Intune policy or Active Directory Group Policy that targets your session hosts. The policy setting is at one of these locations:
   
      - For Intune policy: **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client** > **Turn Off UDP On Client**.

      - For Group Policy: **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client** > **Turn Off UDP On Client**.

   1. Either set the setting to **Not configured**, or set it to **Disabled**.

   1. Update the policy on the client devices, then restart them for the settings to take effect.

## Check client device STUN/TURN server connectivity and NAT type

You can validate a client device can connect to the STUN/TURN endpoints, whether NAT is in use and its type, and verify that basic UDP functionality works by running the executable `avdnettest.exe`. Here's a [download link to the latest version of avdnettest.exe](https://raw.githubusercontent.com/Azure/RDS-Templates/master/AVD-TestShortpath/avdnettest.exe).

You can run `avdnettest.exe` by double-clicking the file, or running it from the command line. The output looks similar to this output if connectivity is successful:

```
Checking DNS service ... OK
Checking TURN support ... OK
Checking ACS server 20.202.68.109:3478 ... OK
Checking ACS server 20.202.21.66:3478 ... OK

You have access to TURN servers and your NAT type appears to be 'cone shaped'.
Shortpath for public networks is very likely to work on this host.
```

If your environment uses Symmetric NAT, then you can use an indirect connection with TURN. For more information you can use to configure firewalls and Network Security Groups, see [Network configurations for RDP Shortpath](rdp-shortpath.md?tabs=public-networks#network-configuration).

## Optional: Enable Teredo support

While not required for RDP Shortpath, Teredo adds extra NAT traversal candidates and increases the chance of the successful RDP Shortpath connection in IPv4-only networks. You can enable Teredo on both session hosts and clients with PowerShell:

1. Open a PowerShell prompt as an administrator.

1. Run the following command:

   ```powershell
   Set-NetTeredoConfiguration -Type Enterpriseclient
   ```

1. Restart the session hosts and client devices for the settings to take effect.

## Limit the port range used with STUN and TURN

By default, RDP Shortpath options that use STUN or TURN use an ephemeral port range of **49152 to 65535** to establish a direct path between server and client. However, you might want to configure your session hosts to use a smaller, predictable port range.

You can set a smaller default range of ports 38300 to 39299, or you can specify your own port range to use. When enabled on your session hosts, Windows App or the Remote Desktop app randomly selects the port from the range you specify for every connection. If this range is exhausted, connections fall back to using the default port range (49152-65535).

When choosing the base and pool size, consider the number of ports you need. The range must be between 1024 and 49151, after which the ephemeral port range begins.

You can limit the port range this using Microsoft Intune or Group Policy in an Active Directory domain. Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To limit the port range used with STUN and TURN using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/configure-rdp-shortpath/azure-virtual-desktop-admimistrative-template-intune.png" alt-text="A screenshot showing the Azure Virtual Desktop administrative templates options in the Microsoft Intune portal." lightbox="media/configure-rdp-shortpath/azure-virtual-desktop-admimistrative-template-intune.png":::

1. Check the box for **Use port range for RDP Shortpath for unmanaged networks**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Use port range for RDP Shortpath for unmanaged networks** to **Enabled**.

1. Enter values for **Port pool size (Device)** and **UDP base port (Device)**. The default values are **1000** and **38300** respectively.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To limit the port range used with STUN and TURN using Group Policy in an Active Directory domain:

1. Make the administrative template for Azure Virtual Desktop available in your domain by following the steps in [Use the administrative template for Azure Virtual Desktop](administrative-template.md?tabs=group-policy-domain).

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot of the Group Policy Management Editor showing Azure Virtual Desktop policy settings." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Double-click the policy setting **Use port range for RDP Shortpath for unmanaged networks** to open it.

1. Select **Enabled**. Enter values for **UDP base port (Device)** and **Port pool size (Device)**. The default values are **38300** and **1000** respectively. Once you finish, select **OK**.

1. Ensure the policy is applied to the session hosts, then restart them for the settings to take effect.

---

## Verify RDP Shortpath is working

Once you configure RDP Shortpath, connect to a remote session from a client device and check the connection is using UDP. You can verify the transport in use with either the *Connection Information* dialog from Windows App or the Remote Desktop app, Event Viewer logs on the client device, or by using Log Analytics in the Azure portal.

Select the relevant tab for your scenario.

# [Connection information](#tab/connection-information)

To make sure connections are using RDP Shortpath, you can check the connection information on the client:

1. Connect to a remote session.

1. Open the *Connection Information* dialog by going to the **Connection** tool bar on the top of the screen and select the signal strength icon, as shown in the following screenshot:

   :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-bar.png" alt-text="Screenshot of Remote Desktop Connection Bar of Remote Desktop client.":::

1. You can verify in the output that UDP is enabled, as shown in the following screenshots:

   - If a direct connection with RDP Shortpath for managed networks is used, the transport protocol has the value **UDP (Private Network)**:
   
      :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-managed.png" alt-text="Screenshot of Remote Desktop Connection Info dialog when using RDP Shortpath for managed networks.":::

   - If STUN is used, the transport protocol has the value **UDP**:
   
      :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-public-stun.png" alt-text="Screenshot of Remote Desktop Connection Info dialog when using STUN.":::

   - If TURN is used, the transport protocol has the value **UDP (Relay)**:
   
      :::image type="content" source="media/configure-rdp-shortpath/rdp-shortpath-connection-info-public-turn.png" alt-text="Screenshot of Remote Desktop Connection Info dialog when using TURN.":::

# [Event Viewer](#tab/event-viewer)

To make sure connections are using RDP Shortpath, you can check the event logs on the session host:

1. Connect to a remote session.

1. On the session host, open **Event Viewer**.

1. Browse to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.

1. Filter by Event ID **135**. Connections using RDP Shortpath state the transport type is using UDP with the message **The multi-transport connection finished for tunnel: 1, its transport type set to UDP**.

# [Log Analytics](#tab/log-analytics)

If you're using [Azure Log Analytics](./diagnostics-log-analytics.md), you can monitor connections by querying the [WVDConnections table](/azure/azure-monitor/reference/tables/wvdconnections). A column named `UdpUse` indicates whether UDP is being used for a connection.

The possible values are:

- **1** - The connection is using RDP Shortpath for managed networks.

- **2** - The connection is using RDP Shortpath for public networks directly using STUN.

- **4** - The connection is using RDP Shortpath for public networks indirectly using TURN.

For any other value, the connection isn't using UDP and is connected using TCP instead.

The following query lets you review connection information. You can run this query in the [Log Analytics query editor](../azure-monitor/logs/log-analytics-tutorial.md#write-a-query). When you run this query, replace `user@contoso.com` with the UPN of the user you want to look up:

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

You can list all sessions that use UDP by running the following Log Analytics query:

```kusto
WVDCheckpoints 
| where Name contains "Shortpath"
```

---

## Related content

If you're having trouble establishing a connection using the RDP Shortpath transport for public networks, see [Troubleshoot RDP Shortpath](troubleshoot-rdp-shortpath.md).
