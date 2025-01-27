---
title: Troubleshoot Azure VPN Client
titleSuffix: Azure VPN Gateway
description: Learn how to troubleshoot VPN Gateway point-to-site connections that use the Azure VPN Client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: troubleshooting
ms.date: 09/05/2024
ms.author: cherylmc

---
# Troubleshoot Azure VPN Client

This article helps you troubleshoot Azure VPN Client connection and configuration issues.

## <a name="status"></a>View Status Logs

View the status log for error messages.

1. Click the arrows icon at the bottom-right corner of the Azure VPN Client window to show the **Status Logs**.
1. Check the logs for errors that might indicate the problem.
1. Error messages are displayed in red.

   :::image type="content" source="./media/troubleshoot-azure-vpn-client/status-logs.png" alt-text="Screenshot shows status logs." lightbox="./media/troubleshoot-azure-vpn-client/status-logs.png":::

## <a name="clear"></a>Clear sign-in information

This step applies to Microsoft Entra ID authentication. If you're using certificate authentication, this step isn't applicable.

Clear the sign-in information.

1. Select the … next to the profile that you want to troubleshoot. Select **Configure**.
1. Select **Clear Saved Account**.
1. Select **Save**.
1. Try to connect.
1. If the connection still fails, continue to the next section.

   :::image type="content" source="./media/troubleshoot-azure-vpn-client/clear-sign-in.png" alt-text="Screenshot shows how to clear the saved account." lightbox="./media/troubleshoot-azure-vpn-client/clear-sign-in.png":::

## <a name="diagnostics"></a>Run diagnostics

Run diagnostics on the VPN client.

1. Click the **…** next to the profile on which you want to run diagnostics.
1. Select **Diagnose -> Run Diagnosis**.
1. The client runs a series of tests and displays the results of the tests. The tests include:

   * Internet Access – Checks to see if the client has Internet connectivity.
   * Client Credentials – Check to see if the Microsoft Entra ID authentication endpoint is reachable.
   * Server Resolvable – Contacts the DNS server to resolve the IP address of the configured VPN server.
   * Server Reachable – Checks to see if the VPN server is responding or not
1. If any of the tests fail, contact your network administrator to resolve the issue. To collect logs, see [Collect client log files](#logfiles).

   :::image type="content" source="./media/troubleshoot-azure-vpn-client/diagnostics.png" alt-text="Screenshot shows how to run diagnostics." lightbox="./media/troubleshoot-azure-vpn-client/diagnostics.png":::

## <a name="logfiles"></a>Collect client log files

Collect the VPN client log files. The log files can be sent to support/administrator via a method of your choosing. For example, e-mail.

1. Click the "…" next to the profile that you want to run diagnostics on. Select **Diagnose -> Show Logs Directory**
1. Windows Explorer opens to the folder that contains the log files.

   :::image type="content" source="./media/troubleshoot-azure-vpn-client/show-logs-directory.png" alt-text="Screenshot shows how to show log directory." lightbox="./media/troubleshoot-azure-vpn-client/show-logs-directory.png":::

## Next steps

To report an Azure VPN Client problem, see [Use Feedback Hub - Azure VPN Client](feedback-hub-azure-vpn-client.md).