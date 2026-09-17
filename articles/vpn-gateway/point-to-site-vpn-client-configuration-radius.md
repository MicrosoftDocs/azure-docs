---
title: 'Configure a VPN client for P2S RADIUS authentication connections'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a VPN client for point-to-site VPN configurations that use RADIUS authentication, for certificate, password, and other authentication methods.
ms.service: azure-vpn-gateway
ms.topic: how-to
author: duongau
ms.author: duau
ms.date: 08/19/2026
ms.custom:
  - linux-related-content
  - sfi-image-nochange
zone_pivot_groups: vpn-client-radius-auth
# Customer intent: As a network administrator, I want to configure a VPN client for point-to-site RADIUS authentication, so that I can securely connect client devices to the virtual network using the authentication method required by my organization.
---

# Configure a VPN client for point-to-site: RADIUS authentication

To connect to a virtual network over point-to-site (P2S), you need to configure the client device that you'll connect from. You can create P2S VPN connections from Windows, macOS, and Linux client devices. This article helps you create and install the VPN client configuration for RADIUS authentication. Select the authentication method that your RADIUS server is configured to use.

> [!NOTE]
> [!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

> [!NOTE]
> Microsoft recommends using Windows 11 with Point-to-Site VPN connections. Windows 10 reached end of support in October 2025. For more information, see [Supported Windows versions for Azure VPN Client](azure-vpn-client-versions.md#supported-windows-versions).

## Workflow

The configuration workflow for P2S RADIUS authentication is as follows:

1. [Set up the Azure VPN gateway for P2S connectivity](point-to-site-how-to-radius-ps.md).
1. [Set up your RADIUS server for authentication](point-to-site-how-to-radius-ps.md#radius).
1. **Obtain the VPN client configuration for the authentication option of your choice and use it to set up the VPN client** (this article).
1. [Complete your P2S configuration and connect](point-to-site-how-to-radius-ps.md).

> [!IMPORTANT]
> If you make any changes to the point-to-site VPN configuration after you generate the VPN client configuration profile, such as the VPN protocol type or authentication type, you must generate and install a new VPN client configuration on your users' devices.

::: zone pivot="certificate"

## Certificate authentication

You can create VPN client configuration files for RADIUS certificate authentication that uses the EAP-TLS protocol. Typically, an enterprise-issued certificate authenticates a user for VPN. Ensure that all connecting users have a certificate installed on their devices and that your RADIUS server can validate the certificate.

In the commands, set `-AuthenticationMethod` to `EapTls`. During certificate authentication, the client validates the RADIUS server by validating its certificate. Set `-RadiusRootCert` to the `.cer` file that contains the root certificate used to validate the RADIUS server.

Each VPN client device requires an installed client certificate. Sometimes a Windows device has multiple client certificates. During authentication, this condition can result in a pop-up dialog box that lists all the certificates. The user must choose the certificate to use. You can filter out the correct certificate by specifying the root certificate that the client certificate should chain to.

Set `-ClientRootCert` to the `.cer` file that contains the root certificate. It's an optional parameter. If the device you want to connect from has only one client certificate, you don't need to specify this parameter.

### Generate VPN client configuration files

You can generate the VPN client configuration files by using the Azure portal or Azure PowerShell.

#### Azure portal

1. Go to the virtual network gateway.
1. Select **Point-to-Site configuration**.
1. Select **Download VPN client**.
1. Select the client and fill out any required information. Depending on the configuration, you might need to upload the RADIUS root certificate to the portal. Export the certificate in the required Base-64 encoded X.509 (.CER) format and open it in a text editor, such as Notepad. The section highlighted in blue contains the information that you copy and upload to Azure.

   :::image type="content" source="../../includes/media/vpn-gateway-certificates-export-public-key-include/notepad-file.png" alt-text="Screenshot shows the CER file open in Notepad with the certificate data highlighted." lightbox="../../includes/media/vpn-gateway-certificates-export-public-key-include/notepad-file.png":::

   If your file doesn't look similar to the following example, you might not have exported it by using the Base-64 encoded X.509 (.CER) format. Some text editors can introduce unintended background formatting, which can cause problems when you upload certificate text to Azure.

1. Select **Download** to generate the .zip file.
1. The `.zip` file typically downloads to your **Downloads** folder.

#### Azure PowerShell

Generate VPN client configuration files for use with certificate authentication. Use the following command to generate the VPN client configuration files:

```azurepowershell-interactive
New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls" -RadiusRootCert "<full path name of .cer file containing the RADIUS root>" -ClientRootCert "<full path name of .cer file containing the client root>" | fl
```

Running the command returns a link. Copy and paste the link to a web browser to download `VpnClientConfiguration.zip`. Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**: These folders contain the Windows 64-bit and 32-bit installer packages, respectively.
* **GenericDevice**: This folder contains general information that you use to create your own VPN client configuration.

If you already created client configuration files, you can retrieve them by using the `Get-AzVpnClientConfiguration` cmdlet. If you make any changes to your P2S VPN configuration, such as the VPN protocol type or authentication type, the configuration isn't updated automatically. You must run the `New-AzVpnClientConfiguration` cmdlet to create a new configuration download.

To retrieve previously generated client configuration files, use the following command:

```azurepowershell-interactive
Get-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" | fl
```

### Windows native VPN client

Use the native VPN client if you configure IKEv2 or SSTP.

1. Select a configuration package and install it on the client device. For a 64-bit processor architecture, choose the **VpnClientSetupAmd64** installer package. For a 32-bit processor architecture, choose the **VpnClientSetupX86** installer package. If you see a SmartScreen pop-up, select **More info** > **Run anyway**. You can also save the package to install on other client computers.

1. Each client requires a client certificate for authentication. Install the client certificate. For information about client certificates, see [Client certificates for point-to-site](vpn-gateway-certificates-point-to-site.md). To install a generated certificate, see [Install a certificate on Windows clients](point-to-site-how-to-vpn-client-install-azure-cert.md).

1. On the client computer, browse to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.

### Mac (macOS) native VPN client

You must create a separate profile for every Mac device that connects to the Azure virtual network because each device requires the user certificate for authentication in its profile. You can use the macOS native VPN client only if you include the IKEv2 tunnel type in your configuration. The **Generic** folder has all the information required to create a profile:

* **VpnSettings.xml** contains important settings such as server address and tunnel type.
* **VpnServerRoot.cer** contains the root certificate required to validate the VPN gateway during P2S connection setup.
* **RadiusServerRoot.cer** contains the root certificate required to validate the RADIUS server during authentication.

Use the following steps to configure the native VPN client on a Mac for certificate authentication:

1. Import the **VpnServerRoot** and **RadiusServerRoot** root certificates to your Mac. Copy each file to your Mac, double-click it, and then select **Add**.

1. Each client requires a client certificate for authentication. Install the client certificate on the client device.

1. Open the **Network** dialog box under **Network Preferences**. Select **+** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.

   The **Interface** value is **VPN**, and the **VPN Type** value is **IKEv2**. Specify a name for the profile in the **Service Name** box, and then select **Create** to create the VPN client connection profile.

1. In the **Generic** folder, from the **VpnSettings.xml** file, copy the **VpnServer** tag value. Paste this value in the **Server Address** and **Remote ID** boxes of the profile. Leave the **Local ID** box blank.

1. Select **Authentication Settings**, and select **Certificate**.

1. Select the certificate that you want to use for authentication.

1. **Choose An Identity** displays a list of certificates for you to choose from. Select the proper certificate, and then select **Continue**.

1. In the **Local ID** box, specify the name of the certificate (from Step 6). In this example, it's **ikev2Client.com**. Then, select the **Apply** button to save the changes.

1. In the **Network** dialog box, select **Apply** to save all changes. Then, select **Connect** to start the P2S connection to the Azure virtual network.

::: zone-end

::: zone pivot="password"

## Password authentication

> [!NOTE]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that aren't present in other flows. Only use this flow when other more secure flows, such as managed identities, aren't viable.

You can configure username/password authentication to either use Active Directory or not use Active Directory. In either scenario, ensure that all connecting users have username/password credentials that RADIUS can authenticate.

When you configure username/password authentication, you can only create a configuration for the EAP-MSCHAPv2 username/password authentication protocol. In the commands, `-AuthenticationMethod` is `EapMSChapv2`.

### Generate VPN client configuration files

You can generate the VPN client configuration files by using the Azure portal or Azure PowerShell.

#### Azure portal

1. Go to the virtual network gateway.
1. Select **Point-to-Site configuration**.
1. Select **Download VPN client**.
1. Select the client and fill out any required information.
1. Select **Download** to generate the .zip file.
1. The `.zip` file typically downloads to your **Downloads** folder.

#### Azure PowerShell

Generate VPN client configuration files for use with username/password authentication. Use the following command to generate the VPN client configuration files:

```azurepowershell-interactive
New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapMSChapv2"
```

Running the command returns a link. Copy and paste the link to a web browser to download **VpnClientConfiguration.zip**. Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**: These folders contain the Windows 64-bit and 32-bit installer packages, respectively.
* **Generic**: This folder contains general information that you use to create your own VPN client configuration. You don't need this folder for username/password authentication configurations.
* **Mac**: If you configured IKEv2 when you created the virtual network gateway, you see a folder named **Mac** that contains a **mobileconfig** file. You use this file to configure Mac clients.

If you already created client configuration files, you can retrieve them by using the `Get-AzVpnClientConfiguration` cmdlet. But if you make any changes to your P2S VPN configuration, such as the VPN protocol type or authentication type, the configuration isn't updated automatically. You must run the `New-AzVpnClientConfiguration` cmdlet to create a new configuration download.

To retrieve previously generated client configuration files, use the following command:

```azurepowershell-interactive
Get-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW"
```

### Windows VPN client

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of supported client operating systems, see the [FAQ](vpn-gateway-vpn-faq.md#P2S).

Use the following steps to configure the native Windows VPN client for password authentication:

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the **VpnClientSetupAmd64** installer package. For a 32-bit processor architecture, choose the **VpnClientSetupX86** installer package.

1. To install the package, double-click it. If you see a SmartScreen pop-up, select **More info** > **Run anyway**.

1. On the client computer, browse to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.

### Mac (macOS) VPN client

1. Select the **VpnClientSetup.mobileconfig** file and send it to each of the users. You can use email or another method.

1. Locate the **.mobileconfig** file on the Mac.

1. Optional: To specify a custom DNS, add the following lines to the **.mobileconfig** file:

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

1. During profile installation, you can specify the username and password for VPN authentication. It's not mandatory to enter this information. If you do, the information is saved and automatically used when you initiate a connection. Select **Install** to proceed.

1. Enter a username and password for the privileges that are required to install the profile on your computer. Select **OK**.

1. After the profile is installed, it's visible in the **Profiles** dialog box. You can also open this dialog box later from **System Preferences**.

1. To access the VPN connection, open the **Network** dialog box from **System Preferences**.

1. The VPN connection appears as **IkeV2-VPN**. You can change the name by updating the **.mobileconfig** file.

1. Select **Authentication Settings**. Select **Username** in the list and enter your credentials. If you entered the credentials earlier, then **Username** is automatically chosen in the list and the username and password are prepopulated. Select **OK** to save the settings.

1. Back in the **Network** dialog box, select **Apply** to save the changes. To initiate the connection, select **Connect**.

### Linux VPN client - strongSwan

The following instructions use strongSwan 5.5.1 on Ubuntu 17.0.4.

1. Open the **Terminal** to install **strongSwan** and its Network Manager. Run the command in the following example. If you receive an error related to `libcharon-extra-plugins`, replace it with `strongswan-plugin-eap-mschapv2`.

1. Select the **Network Manager** icon (up-arrow/down-arrow), and select **Edit Connections**.

1. Select the **Add** button to create a new connection.

1. Select **IPsec/IKEv2 (strongswan)** from the drop-down menu, and then select **Create**. Rename your connection in this step.

1. Open the **VpnSettings.xml** file from the **Generic** folder of the downloaded client configuration files. Find the tag called `VpnServer` and copy the name, which starts with `azuregateway` and ends with `.cloudapp.net`.

1. Paste this name into the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.

1. In the **Client** section of the connection, select **EAP** for **Authentication**, and enter your username and password. You might have to select the lock icon on the right to save this information. Then, select **Save**.

1. Select the **Network Manager** icon (up-arrow/down-arrow) and hover over **VPN Connections**. You see the VPN connection that you created. To initiate the connection, select it.

#### Additional steps for Azure virtual machine

If you're running the procedure on an Azure virtual machine running Linux, perform the following steps.

1. Edit the **/etc/netplan/50-cloud-init.yaml** file to include the following parameter for the interface.

   ```Terminal
   renderer: NetworkManager
   ```

1. After editing the file, run the following two commands to load the new configuration.

   ```Terminal
   sudo netplan generate
   ```

   ```Terminal
   sudo netplan apply
   ```

1. Stop and start or redeploy the virtual machine.

::: zone-end

::: zone pivot="other"

## Other methods and protocols

To use a different authentication type (for example, OTP), or to use a different authentication protocol (such as PEAP-MSCHAPv2 instead of EAP-MSCHAPv2), you must create your own VPN client configuration profile. If you configure Point-to-Site VPN with RADIUS and OpenVPN, currently PAP is the only authentication method supported between the gateway and RADIUS server. To create the profile, you need information such as the virtual network gateway IP address, tunnel type, and split-tunnel routes. You can get this information by using the following steps.

### Generate VPN client configuration files

You can generate the VPN client configuration files by using the Azure portal or Azure PowerShell.

#### Azure portal

1. Go to the virtual network gateway.
1. Select **Point-to-Site configuration**.
1. Select **Download VPN client**.
1. Select the client and fill out any required information.
1. Select **Download** to generate the .zip file.
1. The `.zip` file typically downloads to your **Downloads** folder.

#### Azure PowerShell

Use the [Get-AzVpnClientConfiguration](/powershell/module/az.network/get-azvpnclientconfiguration) cmdlet to generate the VPN client configuration for EapMSChapv2.

### View the files and configure the VPN client

Unzip the VpnClientConfiguration.zip file and look for the **GenericDevice** folder. Ignore the folders that contain the Windows installers for 64-bit and 32-bit architectures.

The **GenericDevice** folder contains an XML file called **VpnSettings**. This file contains all the required information:

* **VpnServer**: FQDN of the Azure VPN gateway. This is the address that the client connects to.
* **VpnType**: Tunnel type that you use to connect.
* **Routes**: Routes that you have to configure in your profile so that only traffic that's bound for the Azure virtual network is sent over the P2S tunnel.

The **GenericDevice** folder also contains a `.cer` file called **VpnServerRoot**. This file contains the root certificate that's required to validate the Azure VPN gateway during P2S connection setup. Install the certificate on all devices that connect to the Azure virtual network.

Use the settings in the files to configure your VPN client.

::: zone-end

## Next steps

Return to the P2S configuration article to [verify your connection](point-to-site-how-to-radius-ps.md#verify).

For P2S troubleshooting information, see [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
