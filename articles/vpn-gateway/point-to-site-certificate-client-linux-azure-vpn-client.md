---
title: 'Configure P2S VPN clients - certificate authentication - Azure VPN Client - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a Linux client to connect to Azure using a point-to-site connection, Open VPN, and the Azure VPN Client for Linux.
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 06/05/2024
ms.author: cherylmc
---

# Configure Azure VPN Client – Certificate authentication OpenVPN – Linux (Preview)

This article helps you connect to your Azure virtual network (VNet) from the Azure VPN Client for Linux using VPN Gateway point-to-site (P2S) **Certificate authentication**. The Azure VPN Client for Linux requires the OpenVPN tunnel type.

[!INCLUDE [Supported versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* The VPN gateway is configured for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* VPN client profile configuration files have been generated and are available. See [Generate VPN client profile configuration files](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) for steps.

### Connection requirements

To connect to Azure using the Azure VPN Client and certificate authentication, each connecting client requires the following items:

* The Azure VPN Client software must be installed and configured on each client.
* The client must have the correct certificates installed locally.

### Workflow

The basic workflow is as follows:

1. Generate and install client certificates.
1. Locate the VPN client profile configuration package that you generated in the [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) article.
1. Download and configure Azure VPN Client for Linux.
1. Connect to Azure.

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

Generate the client public certificate data and private key in **.pem** format using the following commands. To run the commands, you need to have the public Root certificate **caCert.pem** and the private key of Root certificate **caKey.pem**. For more information, see [Generate and export certificates - Linux - OpenSSL](point-to-site-certificates-linux-openssl.md).

```
export PASSWORD="password"
export USERNAME=$(hostnamectl --static)
 
# Generate a private key
openssl genrsa -out "${USERNAME}Key.pem" 2048 
 
# Generate a CSR
openssl req -new -key "${USERNAME}Key.pem" -out "${USERNAME}Req.pem" -subj "/CN=${USERNAME}" 
 
# Sign the CSR using the CA certificate and key
openssl x509 -req -days 365 -in "${USERNAME}Req.pem" -CA caCert.pem -CAkey caKey.pem -CAcreateserial -out "${USERNAME}Cert.pem" -extfile <(echo -e "subjectAltName=DNS:${USERNAME}\nextendedKeyUsage=clientAuth")
```

## View VPN client profile configuration files

When you generate a VPN client profile configuration package, all the necessary configuration settings for VPN clients are contained in a VPN client profile configuration zip file. The VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect.

Locate and unzip the VPN client profile configuration package you generated (listed in the [Prequisites](#prerequisites)). For P2S **Certificate authentication** and with an **OpenVPN** tunnel type, you'll see the **AzureVPN** folder. In the AzureVPN folder, locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile.

If you don't see the **azurevpnconfig.xml** file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* Verify your P2S configuration is set for certificate authentication.
* If you're using Microsoft Entra ID authentication, you might not have an AzureVPN folder. See the [Microsoft Entra ID](point-to-site-entra-gateway.md) configuration article instead.

## Download the Azure VPN Client

Add the Microsoft repository list and install the Azure VPN Client for Linux using the following commands:

```
# install curl utility
sudo apt-get install curl

# Install Microsoft's public key
curl -sSl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc

# Install the production repo list for focal
# For Ubuntu 20.04
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-ubuntu-focal-prod.list

# Install the production repo list for jammy
# For Ubuntu 22.04
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-ubuntu-jammy-prod.list

sudo apt-get update

sudo apt-get install microsoft-azurevpnclient
```

For more information about the repository, see [Linux Software Repository for Microsoft Products](/linux/packages).

## Configure the Azure VPN Client profile

1. Open the Azure VPN Client.
1. On the bottom left of the page of the Linux VPN client, select **Import**.

   :::image type="content" source="./media/azure-vpn-client-certificate-linux/import.png" alt-text="Screenshot of Azure VPN Client for Linux with Import." lightbox="./media/azure-vpn-client-certificate-linux/import.png":::
1. In the window, navigate to the **azurevpnconfig.xml** file, select it, then select **Open**.
1. To add **Client Certificate Public Data**, use the file picker and locate the related **.pem** files.

   :::image type="content" source="./media/azure-vpn-client-certificate-linux/client-certificate-data.png" alt-text="Screenshot of Azure VPN Client for Linux with client certificate data selected." lightbox="./media/azure-vpn-client-certificate-linux/client-certificate-data.png":::
1. To add the **Client Certificate Private Key**, use the picker and select the certificate files path in the text boxes for the private key, with file extension **.pem**.
1. After the import validates (imports with no errors), select **Save**.
1. In the left pane, locate the VPN connection profile you created. Select **Connect**.

   :::image type="content" source="./media/azure-vpn-client-certificate-linux/connect.png" alt-text="Screenshot of Azure VPN Client for Linux Connect." lightbox="./media/azure-vpn-client-certificate-linux/connect.png":::
1. When the client is successfully connected, the status shows as **Connected** with a green icon.

   :::image type="content" source="./media/azure-vpn-client-certificate-linux/connected.png" alt-text="Screenshot of Azure VPN Client for Linux with client showing Connected." lightbox="./media/azure-vpn-client-certificate-linux/connected.png":::
1. You can view the connection logs summary in the **Status Logs** on the main screen of the VPN client.

   :::image type="content" source="./media/azure-vpn-client-certificate-linux/logs.png" alt-text="Screenshot of Azure VPN Client for Linux with client showing the status logs." lightbox="./media/azure-vpn-client-certificate-linux/logs.png":::

## Uninstall the Azure VPN Client

If you want to uninstall the Azure VPN Client, use the following command in the terminal:

```
sudo apt remove microsoft-azurevpnclient
```

## Next steps

For additional steps, return to the [P2S Azure portal](vpn-gateway-howto-point-to-site-resource-manager-portal.md) article.
