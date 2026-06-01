---  
title: Troubleshoot connectivity issues
description: Investigate and resolve Microsoft Dev Box connectivity problems such as connection failures, sign-in issues, disconnections, and high latencies.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: troubleshooting-general
ms.date: 11/21/2025
  
#customer intent: As a developer, I want to troubleshoot my connection issues with dev boxes so that I can maintain a stable and efficient workflow.
---

# Troubleshoot dev box connectivity issues

This step-by-step troubleshooting guide can help you find and fix Microsoft Dev Box connection issues. These issues can include inability to connect, sign-in problems, frequent disconnections, or high latencies.

## Prerequisites

| Category | Requirements |
|---------|--------------|
| Tools | To create or access a dev box, an organization must set up Microsoft Dev Box with at least one project and one dev box pool. To set up Microsoft Dev Box for an organization, see [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md).|
| Tools | To connect to a dev box with the Windows App, [install the Windows App](https://apps.microsoft.com/detail/9n1f85v9t8bn) on your client device. |
| Permissions | To create or access a dev box, you need [Dev Box User](quickstart-configure-dev-box-service.md#provide-access-to-a-dev-box-project) permissions in a project that has an available dev box pool. If you don't have permissions to a project, contact your admin.|

## Potential quick workaround

To automatically identify and address dev box issues, try running **Troubleshoot & repair**. [Sign in to the developer portal](https://devbox.microsoft.com) and select **Troubleshoot & repair** from the **More actions** menu on the dev box tile. For more information, see [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md).

## Troubleshooting checklist

> [!div class="checklist"]
> * Verify that your client device has an active internet connection.
> * Make sure your client device and dev box have the latest operating system and security updates installed.
> * Ensure you have the latest [Windows App installed](https://apps.microsoft.com/detail/9n1f85v9t8bn) on your client device.
> * Check for any improper network configurations or internet proxy settings on your client or dev box that could disrupt remote connections.
> * Confirm that your dev box status is **Running**. If the status is **Stopped** or **Hibernated**, select **Start** or **Resume** from the **More actions** menu on the dev box tile in the [developer portal](https://devbox.microsoft.com).
> * Check Windows Update. You can't connect to a dev box for up to 30 minutes while Windows is updating.
> * If you can access your dev box, review security and connection information by selecting the icons on the top connection bar during a session.
> * Review known connectivity issues at [Troubleshoot known Remote Desktop connectivity issues with dev boxes](how-to-troubleshoot-remote-desktop-connectivity.md).

## Remote connectivity issues

If the Windows App connection to the dev box hangs or fails, try the following steps to connect.

1. [Sign in to the developer portal](https://devbox.microsoft.com) and restart the dev box by selecting **Restart** from the **More actions** menu on the dev box tile.
1. Once restarted, try again to connect by selecting **Connect via Windows app**.
1. Try connecting via the browser by selecting the caret next to **Connect via Windows app** and then selecting **Open in browser**.
1. Sign out and then back in to the developer portal, and try connecting again.
1. Open Task Manager and terminate any running *msrdc.exe* or *msrdcw.exe* processes. Then try connecting again.

## Sign-in and authentication issues

If you have sign-in or authentication issues despite using correct credentials, try the following steps:

1. Use `dsregcmd.exe /status` to check your Microsoft Entra ID join status on your client device and on the dev box if possible. After resolving any errors with your support team, restart the machine.
1. If you don't access your dev box for a while, Microsoft Entra ID might remove your account due to inactivity. To regain access, contact your support team.
1. Try using `dsregcmd.exe /refreshprt` to refresh the Primary Refresh Token (PRT) for a session. Then sign out and sign back in.
1. If you have administrative privileges, try using `dsregcmd.exe /forcerecovery` to reauthenticate and reregister, or `dsregcmd.exe /leave` and `dsregcmd.exe /join` to leave and rejoin Microsoft Entra ID. For more information, see [Troubleshoot devices by using the dsregcmd command](/entra/identity/devices/troubleshoot-device-dsregcmd).
1. If you have admin privileges in the Azure portal, you might need to unsubscribe and resubscribe the dev box to the dev box pool by deleting and recreating the pool.

## Connection issues during high CPU load

If you experience frequent connection drops during high CPU load on the dev box, you can apply a registry setting to give more GPU priority to remote connection sessions.

1. Ensure your dev box has the latest Windows 11 build.
1. Open the Registry Editor on the dev box and add the following registry setting.

   Key: **HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations**<br>Setting: **SetGpuRealtimePriority**<br>Value: **DWORD 2**

   Alternatively, you can add and set the **SetGpuRealtimePriority** registry setting and value by running this command in an elevated shell:

   ```cmd
   reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations" /v SetGpuRealtimePriority /d 2 /t REG_DWORD
   ``` 

1. Restart the dev box.

## Connection issues during low CPU usage

If you experience frequent connection drops even with low CPU usage on the dev box, you can switch your remote desktop connection to use Transmission Control Protocol (TCP) instead of User Datagram Protocol (UDP). To ensure that the connection uses only TCP, change the settings on both the client device and the dev box.

### Client settings

Explicitly tell the client not to attempt a UDP connection.

# [Windows client](#tab/windows)

1. Open the Local Group Policy Editor `gpedit.msc`.
1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Connection Client**.
1. Set the policy setting **Turn Off UDP On Client** to **Enabled**, and then select **OK**.

Alternatively, you can edit the registry to add the following **fClientDisableUDP** setting:

Key: **HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client**<br>Setting: **fClientDisableUDP**<br>Value: **DWORD 1**

You can also apply the **fClientDisableUDP** registry setting and value by running the following command in an elevated shell:

```cmd
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client" /v fClientDisableUDP /d 1 /t REG_DWORD
```

# [Mac client](#tab/mac)

In macOS clients, run the following command in the terminal to change connections to TCP instead of UDP.

```bash
defaults write com.microsoft.rdc.macos ClientSettings.EnableAvdUdpSideTransport false
```

---

### Host settings

Use Group Policy Editor to set the remote desktop transport protocols on your dev box to use only TCP.

1. On your dev box, open the Local Group Policy Editor `gpedit.msc`.
1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Connections**.
1. Set the policy setting **Select RDP transport protocols** to **Enabled**.
1. For **Select Transport Type**, select **Use only TCP**, and then select **OK**.

After making these changes, run `gpupdate /force` in an elevated shell on both machines and restart them.

## Get support

If the preceding steps don't resolve your issue, you can contact your admin team, access more support resources, or file a support request.

In the [developer portal](https://devbox.microsoft.com), select **Support** from the **More actions** menu on a dev box tile to open the **Dev box support** pane. In the pane, you can:

- Select the **troubleshoot your dev box** link to troubleshoot dev box issues. For more information, see [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md).
- Select **Copy support details** to copy details about your dev box and an **Issue ID** that you can give to your admin or support team.
- Select the **contact Azure help + support** link to open the Azure portal **Help + support** page for your dev box project. On the **Help + support** page, you can select **Troubleshoot** under **Actions** to walk through troubleshooting steps, or select **Create a support request** to walk through creating a support request.

If you file a support request, include:

- A detailed description of the problem.
- The time the issue occurred.
- Impacted users.
- Other information about your dev box and remote session if available, such as **Activity ID**.

### Get dev box connection and security information

If you can access your dev box, you can get security and connection information by selecting the corresponding icon on the top connection bar during your session.

:::image type="content" source="media/how-to-resolve-dev-box-connectivity-issues/troubleshooting-connection-bar.png" alt-text="Screenshot that shows the Remote Desktop connection bar.":::

To see connection details such as **Timestamp** and **Activity ID**, select **See details** in the connection dialog box. Copy the connection details by pressing **Ctrl**+**C**, and close the dialog by selecting **OK**.
 
:::image type="content" source="media/how-to-resolve-dev-box-connectivity-issues/troubleshooting-connection-information-dialog.png" alt-text="Screenshot that shows the Troubleshooting connection information dialog box.":::

## Related content

- [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md)
- [Troubleshoot known Remote Desktop connectivity issues with dev boxes](how-to-troubleshoot-remote-desktop-connectivity.md)
- [Get support for Microsoft Dev Box](how-to-get-help.md)
