---
title: 'Configure a VPN client for P2S certificate authentication connections'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a VPN client for point-to-site VPN Gateway connections that use certificate authentication, for Windows, macOS, Linux, and iOS.
author: duongau
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/19/2026
ms.author: duau
ms.custom: sfi-image-nochange
zone_pivot_groups: vpn-client-os
# Customer intent: As a network administrator, I want to configure a VPN client for point-to-site certificate authentication connections, so that I can securely connect client devices to the virtual network using certificate-based authentication.
---

# Configure a VPN client for P2S certificate authentication connections

To connect to a virtual network over point-to-site (P2S), you need to configure the client device that you'll connect from. This article helps you configure a VPN client for point-to-site connections that use **certificate authentication**. Select the operating system for the client that you want to configure.

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for VPN Gateway point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the tunnel type required by the client you want to configure. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.
* You can either generate client certificates or acquire the appropriate client certificates necessary for authentication. For information about working with certificates, see [Point-to-site: Generate certificates](vpn-gateway-certificates-point-to-site.md).

::: zone pivot="windows"

## Windows

Windows clients can connect by using the native VPN client (IKEv2/SSTP tunnel type) or the OpenVPN tunnel type by using the Azure VPN Client, OpenVPN Client 2.x, or OpenVPN Connect 3.x.

### Native VPN client

If your point-to-site (P2S) VPN gateway is configured to use IKEv2/SSTP and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your Windows operating system.

#### Workflow

1. Generate and install client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the native VPN client that's already installed on your Windows computer.
1. Connect to Azure.

#### Generate and install client certificates

For certificate authentication, you must install a client certificate on each client computer. You must export the client certificate you want to use with the private key and include all certificates in the certification path. For some configurations, you also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking it. However, for certain OpenVPN client configurations, you might need to extract information from the client certificate to complete the configuration.

* For information about working with certificates, see [Point-to-site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

##### Install the client certificate

Each computer needs a client certificate to authenticate. If the client certificate isn't already installed on the local computer, you can install it by using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can do this by double-clicking the certificate file and providing a password (if required).

#### View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For certificate authentication and IKEv2/SSTP, you see the following files:

* **WindowsAmd64** and **WindowsX86** contain the Windows 64-bit and 32-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just AMD.
* **Generic** contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

#### Configure the VPN client profile

To connect, you first need to configure the VPN client with the required settings. Configure the VPN client profile by using the settings in the VPN client configuration package. The settings in the package are specific to the VPN gateway to which you connect.

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For a list of supported client operating systems, see the point-to-site section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).

> [!NOTE]
> You must have Administrator rights on the Windows client computer from which you want to connect.

##### Install the VPN client configuration package

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the `VpnClientSetupAmd64` installer package. For a 32-bit processor architecture, choose the `VpnClientSetupX86` installer package.
1. Double-click the package to install it. If you see a SmartScreen pop-up, select **More info**, and then **Run anyway**.

#### Connect

Connect to your virtual network through a point-to-site VPN.

1. Go to the **VPN** settings and locate the VPN connection that you created. It has the same name as your virtual network. Select **Connect**. A pop-up message might appear. Select **Continue** to use elevated privileges.
1. On the **Connection status** page, select **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it isn't, use the drop-down arrow to select the correct certificate, and then select **OK**.

### Azure VPN Client

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client.

[!INCLUDE [Supported Windows versions](../../includes/vpn-gateway-vwan-azure-vpn-client-windows-supported.md)]

#### Connection requirements

To connect to Azure, each connecting client computer requires the following items:

* The Azure VPN Client software installed on each client computer.
* The Azure VPN Client profile configured by using the settings in the downloaded **azurevpnconfig.xml** or **azurevpnconfig_cert.xml** configuration file.
* A client certificate installed locally on the client computer.

#### Generate and install client certificates

For certificate authentication, install a client certificate on each client computer. Export the client certificate you want to use with the private key, and include all certificates in the certification path. For some configurations, you also need to install root certificate information.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

##### Install the client certificate

Each computer needs a client certificate to authenticate. If the client certificate isn't already installed on the local computer, you can install it by using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can do this by double-clicking the certificate file and providing a password (if required).

#### View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For certificate authentication and OpenVPN, you see the **AzureVPN** folder. In this folder, you see either the **azurevpnconfig_cert.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

If you don't see either file, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that certificate authentication is selected.

#### Download the Azure VPN Client

The features and settings that are available for the Azure VPN Client depend on the version of the client that you're using. For information about Azure VPN Client versions, see the [Azure VPN Client versions](azure-vpn-client-versions.md) article.

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

#### Configure the Azure VPN Client and connect

[!INCLUDE [Configure the Azure VPN client profile](../../includes/vpn-gateway-vwan-configure-azure-vpn-client-certificate.md)]

If you experience connection issues and you're running version 4.0.0.0 or later of the Azure VPN Client, select the **...** at the bottom of the Azure VPN Client page, and then select **Prerequisites**. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

[!INCLUDE [Work with profiles](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-windows.md)]

##### <a name="secondary"></a>Configure a secondary profile

[!INCLUDE [Secondary profile](../../includes/vpn-gateway-azure-vpn-client-secondary-profile.md)]

#### Working with connections

##### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**. If you see the switch apps dialog box, select **Yes**.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png" alt-text="Screenshot of the VPN home page with VPN Settings selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png":::

1. If the profile that you want to configure is connected, disconnect the connection, then highlight the profile and select the **Connect automatically** check box.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png" alt-text="Screenshot of the Settings window, with the Connect automatically box checked." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png":::

1. Select **Connect** to initiate the VPN connection.

##### <a name="diagnose"></a>Diagnose connection issues

###### Prerequisites check

If your Azure VPN Client is version 4.0.0.0 or later, you can run a prerequisites check to verify that your computer has the necessary items configured and installed to successfully connect. To view the version number of an installed Azure VPN Client, launch the client and select **Help**.

1. Select the **...** at the bottom of the Azure VPN Client page and select **Prerequisites**.
1. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**.
1. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

###### Diagnostics tool

1. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.
1. On the **Connection Properties** page, select **Run Diagnostics**. If asked, sign in with your credentials, then view the results.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png" alt-text="Screenshot of the ellipsis and Diagnose selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png":::

#### Custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as more DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

### OpenVPN Client 2.x

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the OpenVPN Client 2.4 and higher. For OpenVPN Connect 3.x clients, see the [OpenVPN Client 3.x](#openvpn-client-3x) section instead.

> [!NOTE]
> The OpenVPN client is independently managed and isn't under Microsoft's control. This means Microsoft doesn't oversee its code, builds, roadmap, or legal aspects. If you encounter any bugs or issues with the OpenVPN client, contact OpenVPN Inc. support directly. The guidelines in this article are provided "as is" and haven't been validated by OpenVPN Inc. They help customers who are already familiar with the client and want to use it to connect to the Azure VPN Gateway in a Point-to-Site VPN setup.

#### Connection requirements

To connect to Azure by using the OpenVPN client and certificate authentication, each connecting client computer requires the following items:

* The OpenVPN Client software installed and configured on each client computer.
* A client certificate installed locally on the client computer.

#### Workflow

The workflow for this section is:

1. Generate and install client certificates if you haven't already.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

#### Generate and install client certificates

For certificate authentication, install a client certificate on each client computer. Export the client certificate you want to use with the private key, and include all certificates in the certification path. For some configurations, you also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking it. However, for certain OpenVPN client configurations, you might need to extract information from the client certificate to complete the configuration.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

##### Install the client certificate

Each computer needs a client certificate to authenticate. If you didn't already install the client certificate on the local computer, use the following steps to install it:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can install a certificate by double-clicking the certificate file and providing a password (if required).
1. Use the client certificate later in this exercise to configure the OpenVPN Connect client profile settings.

#### View client profile configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For certificate authentication and OpenVPN, you should see the **OpenVPN** folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you might not have an OpenVPN folder. See the [Microsoft Entra ID](point-to-site-entra-vpn-client-windows.md) configuration article instead.

#### Configure the client

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-windows.md)]

### OpenVPN Client 3.x

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the OpenVPN Connect client 3.x. There are some configuration differences between the [OpenVPN 2.x client](#openvpn-client-2x) and the OpenVPN Connect 3.x client. This section focuses on the OpenVPN Connect 3.x client.

> [!NOTE]
> The OpenVPN client is independently managed and not under Microsoft's control. This means Microsoft doesn't oversee its code, builds, roadmap, or legal aspects. Should customers encounter any bugs or issues with the OpenVPN client, they should directly contact OpenVPN Inc. support. The guidelines in this article are provided 'as is' and haven't been validated by OpenVPN Inc. They're intended to assist customers who are already familiar with the client and wish to use it to connect to the Azure VPN Gateway in a Point-to-Site VPN setup.

#### Connection requirements

To connect to Azure using the OpenVPN Connect 3.x client using certificate authentication, each connecting client computer requires the following items:

* The OpenVPN Connect client software must be installed and configured on each client computer.
* The client computer must have a client certificate that's installed locally.
* If your certificate chain includes an intermediate certificate, see the [Intermediate certificates](#intermediate) section first to verify that your P2S VPN gateway configuration is set up to support this certificate chain. The certificate authentication behavior for 3.x clients is different than previous versions, where you could specify the intermediate certificate in the client profile.

#### Workflow

The workflow for this section is:

1. Generate and install client certificates, if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN Connect client.
1. Connect to Azure.

#### Generate and install client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking. However, for some OpenVPN client configurations, you might need to extract information from the client certificate to complete the configuration.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

##### Install the client certificate

Each computer needs a client certificate to authenticate. If the client certificate isn't already installed on the local computer, you can install it using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can install a certificate by double-clicking the certificate file and providing a password (if required).
1. You'll also use the client certificate later in this exercise to configure the OpenVPN Connect client profile settings.

#### View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you should see the **OpenVPN** folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra ID authentication, you might not have an OpenVPN folder. See the [Microsoft Entra ID](point-to-site-entra-vpn-client-windows.md) configuration article instead.

#### Configure the client

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-3-series-windows.md)]

##### <a name="example"></a>User profile example

[!INCLUDE [User profile example](../../includes/vpn-gateway-vwan-config-openvpn-user-profile.md)]

#### <a name="intermediate"></a>Intermediate certificates

If your certificate chain includes intermediate certificates, you must upload the intermediate certificates to the Azure VPN gateway.
This is the preferred method to use, regardless of the VPN client you choose to connect from. In previous versions, you could specify intermediate certificates in the user profile. This is no longer supported in OpenVPN Connect client version 3.x.

When you're working with intermediate certificates, the intermediate certificate must be uploaded after the root certificate.

:::image type="content" source="./media/point-to-site-open-vpn-client-series-3/intermediate-certificate.png" alt-text="Intermediate certificate for point-to-site configuration." lightbox="./media/point-to-site-open-vpn-client-series-3/intermediate-certificate.png":::

#### Reconnects

If you experience periodic reconnects due to no traffic being sent to client, you can add the "ping-restart 0" option to the profile to prevent disconnections from causing reconnects. This is described in the OpenVPN Connect documentation as follows: ` --ping-restart n Similar to --ping-exit, but trigger a SIGUSR1 restart after n seconds pass without reception of a ping or other packet from remote.`

See the [User profile example](#example) for an example of how to add this option.

::: zone-end

::: zone pivot="macos"

## macOS

macOS clients can connect using the native VPN client (IKEv2 tunnel type) or an OpenVPN client (OpenVPN tunnel type).

### Native VPN client

If your point-to-site (P2S) VPN gateway is configured to use IKEv2 and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your macOS operating system.

> [!NOTE]
> Your VPN gateway must be using a SKU other than the **Basic SKU**.

#### Workflow

1. Generate client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Install certificates.
1. Configure the native VPN client that's already installed on your OS.
1. Connect to Azure.

#### Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Generate and export certificates](vpn-gateway-certificates-point-to-site.md).

[!INCLUDE [Configure macOS](../../includes/vpn-gateway-vwan-native-certificate.md)]

### OpenVPN client

This section helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** on macOS using an OpenVPN client.

#### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have a client certificate that's installed locally.

#### Workflow

1. Install the OpenVPN client.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

#### Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path.

For information about working with certificates, see [Point-to site: Generate certificates - Linux](vpn-gateway-certificates-point-to-site.md).

#### Configure the OpenVPN client

The following example uses **TunnelBlick**.

[!INCLUDE [OpenVPN macOS](../../includes/vpn-gateway-vwan-config-openvpn-mac.md)]

::: zone-end

::: zone pivot="linux"

## Linux

Linux clients can connect using strongSwan (IKEv2 tunnel type) or using OpenVPN (OpenVPN tunnel type) with either the Azure VPN Client or an OpenVPN client.

### strongSwan

This section helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) VPN and **Certificate authentication** from an Ubuntu Linux client using strongSwan.

[!INCLUDE [Connection](../../includes/vpn-gateway-vwan-client-certificate-linux-ike.md)]

### Azure VPN Client

[!INCLUDE [Linux retirement](../../includes/vpn-gateway-azure-vpn-client-linux-retirement.md)]

This section helps you connect to your Azure virtual network (VNet) from the Azure VPN Client for Linux using VPN Gateway point-to-site (P2S) **Certificate authentication**. The Azure VPN Client for Linux requires the OpenVPN tunnel type.

[!INCLUDE [Supported versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-linux.md)]

### OpenVPN client

This section helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** from Linux using an OpenVPN client.

#### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have the correct certificates installed locally.

#### Workflow

1. Install the OpenVPN client.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

#### About certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

The OpenVPN client in this section uses certificates exported with a *.pfx* format. You can export a client certificate easily to this format using the Windows instructions. See [Export a client certificate - pfx](vpn-gateway-certificates-point-to-site.md#clientexport). If you don't have a Windows computer, as a workaround, you can use a small Windows VM to export certificates to the needed *.pfx* format. At this time, the [OpenSSL](point-to-site-certificates-linux-openssl.md) Linux instructions we provide only result in the *.pem* format.

#### <a name="openvpn"></a>Configuration steps

This section helps you configure Linux clients for certificate authentication that uses the OpenVPN tunnel type. To connect to Azure, download the OpenVPN client and configure the connection profile.

[!INCLUDE [Configuration steps for OpenVPN Linux](../../includes/vpn-gateway-config-openvpn-linux.md)]

::: zone-end

::: zone pivot="ios"

## iOS

This section helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** on iOS using an OpenVPN client.

### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have a client certificate that's installed locally.

### Workflow

1. Install the OpenVPN client.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the OpenVPN client.
1. Connect to Azure.

### Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Point-to site: Generate certificates - Linux](vpn-gateway-certificates-point-to-site.md).

### Configure the OpenVPN client

The following example uses **OpenVPN Connect** from the App Store.

[!INCLUDE [OpenVPN iOS](../../includes/vpn-gateway-vwan-config-openvpn-ios.md)]

::: zone-end

## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](point-to-site-certificate-gateway.md).
