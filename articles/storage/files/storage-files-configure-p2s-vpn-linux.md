---
title: Configure a Point-to-Site VPN on Linux for Azure Files
description: Learn how to configure a point-to-site virtual private network (VPN) on Linux to mount your Azure file shares directly on premises.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/21/2026
ms.author: kendownie
ms.custom:
  - devx-track-azurecli
  - linux-related-content
  - sfi-ropc-nochange
# Customer intent: As a Linux system administrator, I want to configure a point-to-site VPN to connect to Azure file shares, so that I can securely access and mount my Azure file shares directly from my on-premises environment.
---

# Configure a point-to-site VPN on Linux for use with Azure Files

You can use a point-to-site virtual private network (VPN) connection to mount your Azure file shares from outside of Azure, without sending data over the open internet. A point-to-site VPN connection is a VPN connection between Azure and an individual client machine. To use a point-to-site VPN connection with Azure Files, you need to configure a point-to-site VPN connection for each client machine that wants to connect. If you have many client machines that need to connect to your Azure file shares from your on-premises network, you can use a site-to-site VPN connection instead of a point-to-site connection for each client machine. To learn more, see [Configure a site-to-site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

For a complete discussion of the networking options available for Azure Files, see [Azure Files networking overview](storage-files-networking-overview.md).

This article details the steps to configure a point-to-site VPN on Linux to mount Azure file shares directly on-premises.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

- The most recent version of the Azure CLI. For information on how to install the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli) and select your operating system. You can use the Azure PowerShell module on Linux instead, but the instructions in this article are for Azure CLI.

- An Azure file share you intend to mount on-premises. Azure file shares are deployed within storage accounts, which are management constructs that represent a shared pool of storage in which you can deploy multiple file shares. You can learn more about how to deploy Azure file shares and storage accounts in [Create an Azure file share](storage-how-to-create-file-share.md).

- A private endpoint for the storage account containing the Azure file share you want to mount on-premises. To learn how to create a private endpoint, see [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md?tabs=azure-cli). 

## Install required software

The Azure virtual network gateway can provide VPN connections using several VPN protocols, including IPsec and OpenVPN. This article shows how to use IPsec and uses the strongSwan package to provide the support on Linux.

> [!NOTE]
> These instructions were tested on Ubuntu 18.10 and should work on Ubuntu 18.04 LTS and later, as well as Debian 10+. Other distributions that support strongSwan (such as Fedora, CentOS, or openSUSE) might require different package names or installation commands.

```bash
# For Ubuntu/Debian-based distributions (Ubuntu 18.04+, Debian 10+)
sudo apt update
sudo apt install strongswan strongswan-pki libstrongswan-extra-plugins curl libxml2-utils cifs-utils unzip
```

If the installation fails or you get an error such as `EAP_IDENTITY not supported, sending EAP_NAK`, you might need to install extra plugins:

```bash
sudo apt install -y libcharon-extra-plugins
```

### Deploy a virtual network

To access your Azure file share and other Azure resources from on-premises via a point-to-site VPN, you must create a virtual network. The point-to-site VPN connection establishes a secure tunnel between your on-premises Linux client machine and this Azure virtual network.

The following script creates an Azure virtual network with three subnets: one for your storage account's service endpoint, one for your storage account's private endpoint, which is required to access the storage account on-premises without creating custom routing for the public IP of the storage account that may change, and one for your virtual network gateway that provides the VPN service.

```bash
# Variables - replace <region>, <resource-group>, and <desired-vnet-name> with your values
REGION="<region>"
RESOURCE_GROUP_NAME="<resource-group>"
VIRTUAL_NETWORK_NAME="<desired-vnet-name>"
```

Create the virtual network:

```bash
# Requires: REGION, RESOURCE_GROUP_NAME, VIRTUAL_NETWORK_NAME defined above
VIRTUAL_NETWORK=$(az network vnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VIRTUAL_NETWORK_NAME \
    --location $REGION \
    --address-prefixes "192.168.0.0/16" \
    --query "newVNet.id" | tr -d '"')
```

Create the subnets for service endpoints, private endpoints, and the gateway:

```bash
# Requires: RESOURCE_GROUP_NAME, VIRTUAL_NETWORK_NAME defined above
SERVICE_ENDPOINT_SUBNET=$(az network vnet subnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name $VIRTUAL_NETWORK_NAME \
    --name "ServiceEndpointSubnet" \
    --address-prefixes "192.168.0.0/24" \
    --service-endpoints "Microsoft.Storage" \
    --query "id" | tr -d '"')

PRIVATE_ENDPOINT_SUBNET=$(az network vnet subnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name $VIRTUAL_NETWORK_NAME \
    --name "PrivateEndpointSubnet" \
    --address-prefixes "192.168.1.0/24" \
    --query "id" | tr -d '"')

GATEWAY_SUBNET=$(az network vnet subnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name $VIRTUAL_NETWORK_NAME \
    --name "GatewaySubnet" \
    --address-prefixes "192.168.2.0/24" \
    --query "id" | tr -d '"')
```

**Verify:** Run `az network vnet subnet list --resource-group $RESOURCE_GROUP_NAME --vnet-name $VIRTUAL_NETWORK_NAME --output table` and confirm three subnets appear: `ServiceEndpointSubnet`, `PrivateEndpointSubnet`, and `GatewaySubnet`.

## Create certificates for VPN authentication

For VPN connections from your on-premises Linux client machines to authenticate with the virtual network gateway, you must create two certificates: 

- A root certificate, which is provided to the virtual machine gateway
- A client certificate, which is signed with the root certificate and installed on each client machine

Set the certificate variables and create a working directory:

```bash
# Variables
ROOT_CERT_NAME="P2SRootCert"
USERNAME="client"              # Client certificate identity (not a machine login)
PASSWORD="1234"                # Password for the client certificate PKCS#12 file

mkdir temp
cd temp
```

Generate the root certificate:

```bash
# Requires: ROOT_CERT_NAME defined above; run from temp directory
sudo ipsec pki --gen --outform pem > rootKey.pem
sudo ipsec pki --self --in rootKey.pem --dn "CN=$ROOT_CERT_NAME" --ca --outform pem > rootCert.pem

ROOT_CERTIFICATE=$(openssl x509 -in rootCert.pem -outform der | base64 -w0 ; echo)
```

Generate the client certificate signed by the root certificate:

```bash
# Requires: USERNAME, PASSWORD defined; rootCert.pem and rootKey.pem from previous step
sudo ipsec pki --gen --size 4096 --outform pem > "clientKey.pem"
sudo ipsec pki --pub --in "clientKey.pem" | \
    sudo ipsec pki \
        --issue \
        --cacert rootCert.pem \
        --cakey rootKey.pem \
        --dn "CN=$USERNAME" \
        --san $USERNAME \
        --flag clientAuth \
        --outform pem > "clientCert.pem"

openssl pkcs12 -in "clientCert.pem" -inkey "clientKey.pem" -certfile rootCert.pem -export -out "client.p12" -password "pass:$PASSWORD"
```

**Verify:** Run `ls -la *.pem client.p12` and confirm five files exist: `rootKey.pem`, `rootCert.pem`, `clientKey.pem`, `clientCert.pem`, and `client.p12`.

## Deploy virtual network gateway

The Azure virtual network gateway is the service that your on-premises Linux client machine connects to. Deploying this service requires two components:

- A public IP address that identifies the gateway to your client machines.
- The root certificate you created earlier, which authenticates your client machines using their client certificates.

> [!NOTE]
> Deploying the Azure virtual network gateway can take up to 45 minutes. While this resource is being deployed, this script blocks the deployment from being completed.
>
> Point-to-site IKEv2/OpenVPN connections aren't supported with the **Basic** gateway SKU. This script uses the **VpnGw1** SKU for the virtual network gateway, which is the minimum required SKU for IKEv2 connections. The public IP address can use the **Basic** SKU with dynamic allocation.

```azurecli
# Variables - replace <desired-vpn-name-here> with your value
VPN_NAME="<desired-vpn-name-here>"
PUBLIC_IP_ADDR_NAME="$VPN_NAME-PublicIP"
```

Create the public IP address for the gateway:

```azurecli
# Requires: RESOURCE_GROUP_NAME, REGION from 'Deploy a virtual network'; VPN_NAME, PUBLIC_IP_ADDR_NAME defined above
# Note: Basic SKU with dynamic allocation is sufficient for the public IP; the gateway SKU (VpnGw1) is what matters for IKEv2 support
PUBLIC_IP_ADDR=$(az network public-ip create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $PUBLIC_IP_ADDR_NAME \
    --location $REGION \
    --sku "Basic" \
    --allocation-method "Dynamic" \
    --query "publicIp.id" | tr -d '"')
```

Create the virtual network gateway:

```azurecli
# Requires: RESOURCE_GROUP_NAME, REGION, VIRTUAL_NETWORK_NAME from 'Deploy a virtual network'; VPN_NAME, PUBLIC_IP_ADDR defined above
# Note: VpnGw1 is the minimum SKU required for IKEv2/OpenVPN; Basic SKU doesn't support point-to-site IKEv2
az network vnet-gateway create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VPN_NAME \
    --vnet $VIRTUAL_NETWORK_NAME \
    --public-ip-addresses $PUBLIC_IP_ADDR \
    --location $REGION \
    --sku "VpnGw1" \
    --gateway-type "Vpn" \
    --vpn-type "RouteBased" \
    --address-prefixes "172.16.201.0/24" \
    --client-protocol "IkeV2" > /dev/null
```

Upload the root certificate to the gateway:

```azurecli
# Requires: RESOURCE_GROUP_NAME from 'Deploy a virtual network'; VPN_NAME defined above; ROOT_CERT_NAME, ROOT_CERTIFICATE from 'Create certificates'
az network vnet-gateway root-cert create \
    --resource-group $RESOURCE_GROUP_NAME \
    --gateway-name $VPN_NAME \
    --name $ROOT_CERT_NAME \
    --public-cert-data $ROOT_CERTIFICATE \
    --output none
```

**Verify:** Run `az network vnet-gateway show --resource-group $RESOURCE_GROUP_NAME --name $VPN_NAME --query "provisioningState"` and confirm the output is `"Succeeded"`.

## Configure the VPN client

The Azure virtual network gateway creates a downloadable package with configuration files required to initialize the VPN connection on your on-premises Linux client machine. The following script copies the client certificate to the strongSwan certificate directories (`/etc/ipsec.d/`) and configures the `ipsec.conf` file with the values from the downloaded configuration package.

```azurecli
# Requires: RESOURCE_GROUP_NAME from 'Deploy a virtual network'; VPN_NAME from 'Deploy virtual network gateway'
VPN_CLIENT=$(az network vnet-gateway vpn-client generate \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VPN_NAME \
    --authentication-method EAPTLS | tr -d '"')

curl $VPN_CLIENT --output vpnClient.zip
unzip vpnClient.zip
```

Extract the VPN configuration values:

```bash
# Requires: vpnClient.zip extracted in current directory
VPN_SERVER=$(xmllint --xpath "string(/VpnProfile/VpnServer)" Generic/VpnSettings.xml)
VPN_TYPE=$(xmllint --xpath "string(/VpnProfile/VpnType)" Generic/VpnSettings.xml | tr '[:upper:]' '[:lower:]')
ROUTES=$(xmllint --xpath "string(/VpnProfile/Routes)" Generic/VpnSettings.xml)
```

Copy certificates to the strongSwan directories:

```bash
# Requires: USERNAME from 'Create certificates'; client.p12 (client certificate) from temp directory
INSTALL_DIR="/etc/"

sudo cp "${INSTALL_DIR}ipsec.conf" "${INSTALL_DIR}ipsec.conf.backup"
sudo cp "Generic/VpnServerRoot.cer_0" "${INSTALL_DIR}ipsec.d/cacerts"
sudo cp "${USERNAME}.p12" "${INSTALL_DIR}ipsec.d/private"
```

Configure the IPsec connection:

```bash
# Requires: VIRTUAL_NETWORK_NAME from 'Deploy a virtual network'; VPN_SERVER, VPN_TYPE, ROUTES extracted above; INSTALL_DIR defined above
sudo tee -a "${INSTALL_DIR}ipsec.conf" <<EOF
conn $VIRTUAL_NETWORK_NAME
    keyexchange=$VPN_TYPE
    type=tunnel
    leftfirewall=yes
    left=%any
    leftauth=eap-tls
    leftid=%client
    right=$VPN_SERVER
    rightid=%$VPN_SERVER
    rightsubnet=$ROUTES
    leftsourceip=%config
    auto=add
EOF
```

Configure the IPsec secrets and start the VPN connection:

```bash
# Requires: PASSWORD from 'Create certificates'; INSTALL_DIR, VIRTUAL_NETWORK_NAME defined above
echo ": P12 client.p12 '$PASSWORD'" | sudo tee -a "${INSTALL_DIR}ipsec.secrets" > /dev/null

sudo ipsec restart
sudo ipsec up $VIRTUAL_NETWORK_NAME
```

**Verify:** Run `sudo ipsec status` and confirm the output shows `ESTABLISHED` for the connection named after your virtual network.

## Mount Azure file share

After setting up your point-to-site VPN, you can mount your Azure file share. See [Mount SMB file shares to Linux](storage-how-to-use-files-linux.md) or [Mount NFS file share to Linux](storage-files-how-to-mount-nfs-shares.md).

**Verify:** Run `df -h | grep <mount-point>` (replace `<mount-point>` with your mount path) and confirm the Azure file share appears with the expected size. 

## See also

- [Azure Files networking overview](storage-files-networking-overview.md)
- [Configure a point-to-site VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md)
- [Configure a site-to-site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)
