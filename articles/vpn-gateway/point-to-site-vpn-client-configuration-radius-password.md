---
title: 'Configure a VPN client for P2S RADIUS: password authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a VPN client for point-to-site VPN configurations that use RADIUS username/password authentication.
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
author: cherylmc
ms.author: cherylmc 
ms.date: 02/26/2025
---
# Configure a VPN client for point-to-site: RADIUS - password authentication

To connect to a virtual network over point-to-site (P2S), you need to configure the client device that you'll connect from. You can create P2S VPN connections from Windows, macOS, and Linux client devices. This article helps you create and install the VPN client configuration for username/password RADIUS authentication.

> [!NOTE]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

When you're using RADIUS authentication, there are multiple authentication instructions: [certificate authentication](point-to-site-vpn-client-configuration-radius-certificate.md), [password authentication](point-to-site-vpn-client-configuration-radius-password.md), and [other authentication methods and protocols](point-to-site-vpn-client-configuration-radius-other.md). The VPN client configuration is different for each type of authentication. To configure a VPN client, you use client configuration files that contain the required settings.

> [!NOTE]
> [!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## Workflow

The configuration workflow for P2S RADIUS authentication is as follows:

1. [Set up the Azure VPN gateway for P2S connectivity](point-to-site-how-to-radius-ps.md).
1. [Set up your RADIUS server for authentication](point-to-site-how-to-radius-ps.md#radius).
1. **Obtain the VPN client configuration for the authentication option of your choice and use it to set up the VPN client** (this article).
1. [Complete your P2S configuration and connect](point-to-site-how-to-radius-ps.md).

> [!IMPORTANT]
> If there are any changes to the point-to-site VPN configuration after you generate the VPN client configuration profile, such as the VPN protocol type or authentication type, you must generate and install a new VPN client configuration on your users' devices.
>

You can configure username/password authentication to either use Active Directory, or to not use Active Directory. With either scenario, make sure that all connecting users have username/password credentials that can be authenticated through RADIUS.

When you configure username/password authentication, you can only create a configuration for the EAP-MSCHAPv2 username/password authentication protocol. In the commands, `-AuthenticationMethod` is `EapMSChapv2`.

## Generate VPN client configuration files

You can generate the VPN client configuration files by using the Azure portal, or by using Azure PowerShell.

### Azure portal

1. Navigate to the virtual network gateway.
1. Click **Point-to-Site configuration**.
1. Click **Download VPN client**.
1. Select the client and fill out any information that is requested.
1. Click **Download** to generate the .zip file.
1. The .zip file downloads, typically to your Downloads folder.

### Azure PowerShell

Generate VPN client configuration files for use with username/password authentication. You can generate the VPN client configuration files by using the following command:

```azurepowershell-interactive
New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapMSChapv2"
```

Running the command returns a link. Copy and paste the link to a web browser to download **VpnClientConfiguration.zip**. Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**: These folders contain the Windows 64-bit and 32-bit installer packages, respectively.
* **Generic**: This folder contains general information that you use to create your own VPN client configuration. You don't need this folder for username/password authentication configurations.
* **Mac**: If you configured IKEv2 when you created the virtual network gateway, you see a folder named **Mac** that contains a **mobileconfig** file. You use this file to configure Mac clients.

If you already created client configuration files, you can retrieve them by using the `Get-AzVpnClientConfiguration` cmdlet. But if you make any changes to your P2S VPN configuration, such as the VPN protocol type or authentication type, the configuration isn’t updated automatically. You must run the `New-AzVpnClientConfiguration` cmdlet to create a new configuration download.

To retrieve previously generated client configuration files, use the following command:

```azurepowershell-interactive
Get-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW"
```

## Windows VPN client

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the [FAQ](vpn-gateway-vpn-faq.md#P2S).

Use the following steps to configure the native Windows VPN client for certificate authentication:

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the **VpnClientSetupAmd64** installer package. For a 32-bit processor architecture, choose the **VpnClientSetupX86** installer package.

1. To install the package, double-click it. If you see a SmartScreen pop-up, select **More info** > **Run anyway**.

1. On the client computer, browse to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.

## Mac (macOS) VPN client

1. Select the **VpnClientSetup mobileconfig** file and send it to each of the users. You can use email or another method.

1. Locate the **mobileconfig** file on the Mac.

1. Optional Step - If you want to specify a custom DNS, add the following lines to the **mobileconfig** file:

   ```xml
    <key>DNS</key>
    <dict>
      <key>ServerAddresses</key>
        <array>
            <string>10.0.0.132</string>
        </array>
      <key>SupplementalMatchDomains</key>
        <array>
            <string>TestDomain.com</string>
        </array>
    </dict> 
   ```

1. Double-click the profile to install it, and select **Continue**. The profile name is the same as the name of your virtual network.

1. Select **Continue** to trust the sender of the profile and proceed with the installation.

1. During profile installation, you can specify the username and password for VPN authentication. It's not mandatory to enter this information. If you do, the information is saved and automatically used when you initiate a connection. Select **Install** to proceed.

1. Enter a username and password for the privileges that are required to install the profile on your computer. Select **OK**.

1. After the profile is installed, it's visible in the **Profiles** dialog box. You can also open this dialog box later from **System Preferences**.

1. To access the VPN connection, open the **Network** dialog box from **System Preferences**.

1. The VPN connection appears as **IkeV2-VPN**. You can change the name by updating the **mobileconfig** file.

1. Select **Authentication Settings**. Select **Username** in the list and enter your credentials. If you entered the credentials earlier, then **Username** is automatically chosen in the list and the username and password are prepopulated. Select **OK** to save the settings.

1. Back in the **Network** dialog box, select **Apply** to save the changes. To initiate the connection, select **Connect**.

## Linux VPN client - strongSwan

The following instructions were created through strongSwan 5.5.1 on Ubuntu 17.0.4.

1. Open the **Terminal** to install **strongSwan** and its Network Manager by running the command in the example. If you receive an error that's related to `libcharon-extra-plugins`, replace it with `strongswan-plugin-eap-mschapv2`.

1. Select the **Network Manager** icon (up-arrow/down-arrow), and select **Edit Connections**.

1. Select the **Add** button to create a new connection.

1. Select **IPsec/IKEv2 (strongswan)** from the drop-down menu, and then select **Create**. You can rename your connection in this step.

1. Open the **VpnSettings.xml** file from the **Generic** folder of the downloaded client configuration files. Find the tag called `VpnServer` and copy the name, beginning with `azuregateway` and ending with `.cloudapp.net`.

1. Paste this name into the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.

1. In the **Client** section of the connection, select **EAP** for **Authentication**, and enter your username and password. You might have to select the lock icon on the right to save this information. Then, select **Save**.

1. Select the **Network Manager** icon (up-arrow/down-arrow) and hover over **VPN Connections**. You see the VPN connection that you created. To initiate the connection, select it.

## Additional steps for Azure virtual machine

In case you're executing the procedure on an Azure virtual machine running Linux, there are additional steps to perform.

1. Edit the **/etc/netplan/50-cloud-init.yaml** file to include the following parameter for the interface

   ```Terminal
   renderer: NetworkManager
   ```

1. After editing the file, run the following two commands to load the new configuration

   ```Terminal
   sudo netplan generate
   ```

   ```Terminal
   sudo netplan apply
   ```

1. Stop/Start or Redeploy the virtual machine.

## Next steps

Return to the article to [complete your P2S configuration](point-to-site-how-to-radius-ps.md).

For P2S troubleshooting information, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
