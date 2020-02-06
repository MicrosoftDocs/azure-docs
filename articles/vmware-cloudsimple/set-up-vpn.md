--- 
title: Azure VMware Solutions (AVS) - Configure VPN between on-premises and AVS Private Cloud
description: Describes how to configure a Site-to-Site or Point-to-Site VPN connection between your on-premises network and your AVS Private Cloud
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/14/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Configure a VPN connection to your AVS Private Cloud

VPN gateways allow you to connect to AVS network from your on-premises network and from a client computer remotely. In this article, you can find information on setting up VPN gateways from the AVS portal. A VPN connection between your on-premises network and your AVS network provides access to the vCenter and workloads on your AVS Private Cloud. AVS supports both Point-to-Site VPN and Site-to-Site VPN gateways.

## VPN gateway types

* **Point-to-Site VPN** connection is the simplest way to connect to your AVS Private Cloud from your computer. Use Point-to-Site VPN connectivity for connecting to the AVS Private Cloud remotely.
* **Site-to-Site VPN** connection allows you to set up your AVS Private Cloud workloads to access on-premises services. You can also use on-premises Active Directory as an identity source for authenticating to your AVS Private Cloud vCenter. Currently, **Policy-Based VPN** type is supported.

In a region, you can create one Site-to-Site VPN gateway and one Point-to-Site VPN gateway.

## Point-to-Site VPN

To create a Point-to-Site VPN gateway, see [Create Point-to-Site VPN gateway](vpn-gateway.md#create-point-to-site-vpn-gateway).

### Connect to AVS using Point-to-Site VPN

VPN client is needed for connecting to AVS from your computer. Download [OpenVPN client](https://openvpn.net/community-downloads/) for Windows or [Viscosity](https://www.sparklabs.com/viscosity/download/) for macOS and OS X.

1. Launch AVS portal and select **Network**.
2. Select **VPN Gateway**.
3. From the list of VPN gateways, click on the Point-to-Site VPN gateway.
4. Select **Users**.
5. Click on **Download my VPN configuration**

    ![Download VPN configuration](media/download-p2s-vpn-configuration.png)

6. Import the configuration on your VPN client

    * Instructions for [importing configuration on Windows client](https://openvpn.net/vpn-server-resources/connecting-to-access-server-with-windows/#openvpn-open-source-openvpn-gui-program)
    * Instructions for [importing configuration on macOS or OS X](https://www.sparklabs.com/support/kb/article/getting-started-with-viscosity-mac/#creating-your-first-connection)

7. Connect to AVS VPN gateway.

Example below shows importing connection using **Viscosity Client**.

#### Import connection on Viscosity client

1. Extract the contents of VPN configuration from downloaded .zip file.

2. Open Viscosity on your computer.

3. Click the **+** icon and select **Import connection** > **From File**.

    ![Import VPN configuration from file](media/import-p2s-vpn-config.png)

4. Select the OpenVPN configuration file (.ovpn) for the protocol you want to use and click **Open**.

    ![VPN](media/import-p2s-vpn-config-choose-ovpn.png)

The connection now appears in the Viscosity menu.

#### Connect to the VPN

To connect to VPN using the Viscosity OpenVPN client, select the connection from the menu. The menu icon updates to indicate that the connection is established.

![VPN](media/vis03.png)

### Connecting to Multiple AVS Private Clouds

A Point-to-Site VPN connection resolves the DNS names of the first AVS Private Cloud that you create. When you want to access other AVS Private Clouds, you must update the DNS server on your VPN client.

1. Launch [AVS portal](access-cloudsimple-portal.md).

2. Navigate to **Resources** > **AVS Private Clouds** and select the AVS Private Cloud you want to connect to.

3. On the **Summary** page of the AVS Private Cloud, copy the AVS Private Cloud DNS server IP address under **Basic Info**.

    ![AVS Private Cloud DNS servers](media/private-cloud-dns-server.png)

4. Right-click the Viscosity icon in your computer's system tray and select **Preferences**.

    ![VPN](media/vis00.png)

5. Select the AVS VPN connection.

    ![VPN Connection](media/viscosity-client.png)

6. Click **Edit** to change the connection properties.

    ![Edit VPN Connection](media/viscosity-edit-connection.png)

7. Click the **Networking** tab and enter the AVS Private Cloud DNS server IP addresses separated by a comma or space and the domain as ```cloudsimple.io```. Select **Ignore DNS settings sent by VPN server**.

    ![VPN Networking](media/viscosity-edit-connection-networking.png)

> [!IMPORTANT]
> To connect to your first AVS Private Cloud, remove these settings and connect to the VPN server.

## Site-to-Site VPN

To create a Site-to-Site VPN gateway, see [Create Site-to-Site VPN gateway](vpn-gateway.md#set-up-a-site-to-site-vpn-gateway). Site-to-Site VPN connection from your on-premises network to your AVS Private Cloud provides these benefits. 

* Accessibility of your AVS Private Cloud vCenter from any workstation in your on-premises network
* Use of your on-premises Active Directory as a vCenter identity source
* Convenient transfer of VM templates, ISOs, and other files from your on-premises resources to your AVS Private Cloud vCenter
* Accessibility of workloads running on your AVS Private Cloud from your on-premises network

To set up your on-premises VPN gateway in high-availability mode, see [Configure a high availability VPN connection](high-availability-vpn-connection.md).

> [!IMPORTANT]
>    1. Set TCP MSS Clamping at 1200 on your VPN device. Or if your VPN devices do not support MSS clamping, you can alternatively set the MTU on the tunnel interface to 1240 bytes instead.
> 2. After Site-to-Site VPN is set up, forward the DNS requests for *.cloudsimple.io to the AVS Private Cloud DNS servers. Follow the instructions in [On-Premises DNS Setup](on-premises-dns-setup.md).
