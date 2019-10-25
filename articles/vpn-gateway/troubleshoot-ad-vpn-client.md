---
title: 'Configure a VPN client for P2S VPN connections: Azure AD authentication| Microsoft Docs'
description: You can use P2S VPN to connect to your VNet using Azure AD authentication
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: cherylmc

---
# Troubleshoot an Azure Active Directory Authentication VPN client

This article helps you troubleshoot a VPN client to connect to a virtual network using Point-to-Site VPN and Azure Active Directory authentication. 

## <a name="status"></a>Status Log

View the status log for error messages.

![](./media/troubleshoot-ad-vpn-client/1.png)

1. Click the arrows icon at the bottom-right corner of the client window to show the Status Logs.
2. Check the logs for errors tha may indicate the problem.
3. Error messages are displayed in red.

## <a name="clear"></a>Clear sign-in information

![](./media/troubleshoot-ad-vpn-client/2.png)

1. Select the … next to the profile that you want to troubleshoot. Select **Configure -> Clear Saved Account**.
2. Select **Save**.
3. Try to connect.
4. If the connection sill fails, continue to the next section.

## <a name="cert"></a>Run diagnostics on the VPN client

![](./media/troubleshoot-ad-vpn-client/3.png)

1.Click the … next to the profile that you want to run diagnostics on. Select **Diagnose -> Run Diagnosis**.


## <a name="cert"></a>Status Log

View the status log for error messages.

![](./media/troubleshoot-ad-vpn-client/4.png)


## <a name="cert"></a>Status Log

View the status log for error messages.

![](./media/troubleshoot-ad-vpn-client/5.png)



## Next steps

For more information, see [Create an Azure Active Directory tenant for P2S Open VPN connections that use Azure AD authentication](openvpn-azure-ad-tenant.md).