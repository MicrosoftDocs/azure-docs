---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/29/2020
 ms.author: cherylmc

---
>[!NOTE]
>You must have Administrator rights on the Windows client computer from which you are connecting.
>

1. To connect to your VNet, on the client computer, navigate to VPN settings and locate the VPN connection that you created. It's named the same name as your virtual network. Select **Connect**. A pop-up message may appear that refers to using the certificate. Select **Continue** to use elevated privileges.

1. On the **Connection** status page, select **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it is not, use the drop-down arrow to select the correct certificate, and then select **OK**.

   :::image type="content" source="./media/vpn-gateway-p2s-connect-windows-client/connection-status.png" alt-text="Connect from a Windows computer":::

1. Your connection is established.

   :::image type="content" source="./media/vpn-gateway-p2s-connect-windows-client/connected.png" alt-text="Connect from a computer to an Azure VNet - Point-to-Site connection diagram":::
