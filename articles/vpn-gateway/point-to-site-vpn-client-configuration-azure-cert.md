---
title: 'Create and install P2S VPN client configuration files for Azure certificate authentication: PowerShell: Azure | Microsoft Docs'
description: This article helps you create and install VPN client configuration files for Point-to-Site connections that use certificate authentication.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/27/2017
ms.author: cherylmc

---
# Create and install VPN client configuration files for native Azure certificate authentication P2S configurations

VPN client configuration files are contained in a zip file. Configuration files provide the settings required for a native Windows or Mac IKEv2 VPN client to connect to a VNet over Point-to-Site connections that use native Azure certificate authentication.

>[!NOTE]
>IKEv2 for P2S is currently in Preview.
>

### <a name="workflow"></a>P2S Workflow

  1. Set up the Azure VPN gateway for a P2S connection.
  2. Generate root certificate and client certificates. Upload the root certificate public key to Azure and install the client certificates on the client devices. The certificates are used for authenticating connecting users.
  3. Obtain the VPN client configuration for the authentication option of your choice, and use it to set up the VPN client on your Windows and Mac devices. This lets you connect to Azure VNets over a Point-to-Site connection.

>[!NOTE]
>Client configuration files are specific to the VPN configuration for the VNet. If there are any changes to the Point-to-Site VPN configuration after you generate the VPN client configuration files, such as the VPN protocol type or authentication type, be sure to generate new VPN client configuration files for your user devices.
>
>

## <a name="generate"></a>Generate VPN client configuration files

Before you begin, make sure that all connecting users have a valid certificate installed on the user's device. For more information about installing a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file. Unzip the file to view the following folders:

  * **WindowsAmd64** and **WindowsX86**, which contain the Windows 32-bit and 64-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
  * **Generic**, which contains general information used to create your own VPN client configuration. Ignore this folder. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder is not present.

### <a name="zipportal"></a>Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
2. On the virtual network gateway page, click **Point-to-site configuration**.
3. At the top of the Point-to-site configuration page, click **Download VPN client**. It takes a few minutes for the client configuration package to generate.
4. Your browser indicates that a client configuration zip file is available. It is named the same name as your gateway. Unzip the file to view the folders.

### <a name="zipps"></a>Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

  ```powershell
  $profile=New-AzureRmVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

  $profile.VPNProfileSASUrl
  ```
2. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

## <a name="installwin"></a>Install a Windows VPN client configuration package

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the Point-to-Site section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).

Use the following steps to configure the native Windows VPN client for certificate authentication:

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package. 
2. Double-click the package to install it. If you see a SmartScreen popup, click **More info**, then **Run anyway**.
3. On the client computer, navigate to **Network Settings** and click **VPN**. The VPN connection shows the name of the virtual network that it connects to. 

## <a name="installmac"></a>VPN client configuration on Macs (OSX)

Azure does not provide mobileconfig file for native Azure certificate authentication. You have to manually configure the native IKEv2 VPN client on every Mac that will connect to Azure. The **Generic** folder has all the information that you need to configure it. If you don't see the Generic folder in your download, it's likely that IKEv2 was not selected as a tunnel type. Once IKEv2 is selected, generate the zip file again to retrieve the Generic folder. The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type. 
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN Gateway during P2S connection setup.

Use the following steps to configure the native VPN client on Mac for certificate authentication. You have to complete these steps on every Mac that will connect to Azure:

1. Import the **VpnServerRoot** root certificate to your Mac. This can be done by copying the file over to your Mac and double-clicking on it.  
Click **Add** to import.

  ![add certificate](./media/point-to-site-vpn-client-configuration-azure-cert/addcert.png)
  
    >[!NOTE]
    >Double-clicking on the certificate may not display the **Add** dialog, but the certificate is installed in the correct store. You can check for the certificate in the login keychain under the certificates category.
  
2. Open the **Network** dialog under **Network Preferences** and click **'+'** to create a new VPN client connection profile for a P2S connection to the Azure VNet.

  The **Interface** value is 'VPN' and **VPN Type** value is 'IKEv2'. Specify a name for the profile in the **Service Name** field, then click **Create** to create the VPN client connection profile.

  ![network](./media/point-to-site-vpn-client-configuration-azure-cert/network.png)
3. In the **Generic** folder, from the **VpnSettings.xml** file, copy the **VpnServer** tag value. Paste this value in the **Server Address** and **Remote ID** fields of the profile.

  ![server info](./media/point-to-site-vpn-client-configuration-azure-cert/server.png)
4. Click **Authentication Settings** and select **Certificate**. 

  ![authentication settings](./media/point-to-site-vpn-client-configuration-azure-cert/authsettings.png)
5. Click **Select…** to choose the client certificate that you want to use for authentication. A client certificate should already be installed on the machine (see step #2 in the **P2S Workflow** section above).

  ![certificate](./media/point-to-site-vpn-client-configuration-azure-cert/certificate.png)
6. **Choose An Identity** displays a list of certificates for you to choose from. Select the proper certificate, then click **Continue**.

  ![identity](./media/point-to-site-vpn-client-configuration-azure-cert/identity.png)
7. In the **Local ID** field, specify the name of the certificate (from Step 6). In this example, it is "ikev2Client.com". Then, click **Apply** button to save the changes.

  ![apply](./media/point-to-site-vpn-client-configuration-azure-cert/applyconnect.png)
8. On the **Network** dialog, click **Apply** to save all changes. Then, click **Connect** to start the P2S connection to the Azure VNet.

## Next Steps

Return to the article to [complete your P2S configuration](vpn-gateway-howto-point-to-site-rm-ps.md).
