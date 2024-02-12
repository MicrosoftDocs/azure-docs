---
title: 'Troubleshoot Point-to-Site VPN clients - Microsoft Entra authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to troubleshoot VPN Gateway Point-to-Site clients that use Microsoft Entra authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: troubleshooting
ms.date: 04/29/2021
ms.author: cherylmc

---
# Troubleshoot a Microsoft Entra authentication VPN client

This article helps you troubleshoot a VPN client to connect to a virtual network using Point-to-Site VPN and Microsoft Entra authentication.

## <a name="status"></a>View Status Log

View the status log for error messages.

![logs](./media/troubleshoot-ad-vpn-client/1.png)

1. Click the arrows icon at the bottom-right corner of the client window to show the **Status Logs**.
2. Check the logs for errors that may indicate the problem.
3. Error messages are displayed in red.

## <a name="clear"></a>Clear sign-in information

Clear the sign-in information.

![sign in](./media/troubleshoot-ad-vpn-client/2.png)

1. Select the … next to the profile that you want to troubleshoot. Select **Configure -> Clear Saved Account**.
2. Select **Save**.
3. Try to connect.
4. If the connection still fails, continue to the next section.

## <a name="diagnostics"></a>Run diagnostics

Run diagnostics on the VPN client.

![diagnostics](./media/troubleshoot-ad-vpn-client/3.png)

1. Click the **…** next to the profile that you want to run diagnostics on. Select **Diagnose -> Run Diagnosis**.
2. The client will run a series of tests and display the result of the test

   * Internet Access – Checks to see if the client has Internet connectivity
   * Client Credentials – Check to see if the Microsoft Entra authentication endpoint is reachable
   * Server Resolvable – Contacts the DNS server to resolve the IP address of the configured VPN server
   * Server Reachable – Checks to see if the VPN server is responding or not
3. If any of the tests fail, contact your network administrator to resolve the issue.
4. The next section shows you how to collect the logs, if needed.

## <a name="logfiles"></a>Collect client log files

Collect the VPN client log files. The log files can be sent to support/administrator via a method of your choosing. For example, e-mail.

1. Click the “…” next to the profile that you want to run diagnostics on. Select **Diagnose -> Show Logs Directory**.

   ![show logs](./media/troubleshoot-ad-vpn-client/4.png)
2. Windows Explorer opens to the folder that contains the log files.

   ![view file](./media/troubleshoot-ad-vpn-client/5.png)

## Next steps

For more information, see [Create a Microsoft Entra tenant for P2S Open VPN connections that use Microsoft Entra authentication](openvpn-azure-ad-tenant.md).
