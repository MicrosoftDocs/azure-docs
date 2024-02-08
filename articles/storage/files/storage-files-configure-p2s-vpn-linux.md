---
title: Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files
description: How to configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/07/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files
You can use a Point-to-Site (P2S) VPN connection to mount your Azure file shares from outside of Azure, without sending data over the open internet. A Point-to-Site VPN connection is a VPN connection between Azure and an individual client. To use a P2S VPN connection with Azure Files, a P2S VPN connection will need to be configured for each client that wants to connect. If you have many clients that need to connect to your Azure file shares from your on-premises network, you can use a Site-to-Site (S2S) VPN connection instead of a Point-to-Site connection for each client. To learn more, see [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

We strongly recommend that you read [Azure Files networking overview](storage-files-networking-overview.md) before continuing with this how to article for a complete discussion of the networking options available for Azure Files.

The article details the steps to configure a Point-to-Site VPN on Linux to mount Azure file shares directly on-premises.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Prerequisites
- The most recent version of the Azure CLI. For information on how to install the Azure CLI, see [Install the Azure PowerShell CLI](/cli/azure/install-azure-cli) and select your operating system. If you prefer to use the Azure PowerShell module on Linux, you may. However, the instructions below are for Azure CLI.

- An Azure file share you'd like to mount on-premises. Azure file shares are deployed within storage accounts, which are management constructs that represent a shared pool of storage in which you can deploy multiple file shares, as well as other storage resources, such as blob containers or queues. You can learn more about how to deploy Azure file shares and storage accounts in [Create an Azure file share](storage-how-to-create-file-share.md).

- A private endpoint for the storage account containing the Azure file share you want to mount on-premises. To learn how to create a private endpoint, see [Configuring Azure Files network endpoints](storage-files-networking-endpoints.md?tabs=azure-cli). 

## Install required software
The Azure virtual network gateway can provide VPN connections using several VPN protocols, including IPsec and OpenVPN. This article shows how to use IPsec and uses the strongSwan package to provide the support on Linux.

> Verified with Ubuntu 18.10.

```bash
sudo apt update
sudo apt install strongswan strongswan-pki libstrongswan-extra-plugins curl libxml2-utils cifs-utils unzip

INSTALL_DIR="/etc/"
```

If the installation fails or you get an error such as **EAP_IDENTITY not supported, sending EAP_NAK**, you might need to install extra plugins:

```bash
sudo apt install -y libcharon-extra-plugins
```

### Deploy a virtual network 
To access your Azure file share and other Azure resources from on-premises via a Point-to-Site VPN, you must create a virtual network, or VNet. The P2S VPN connection you will automatically create is a bridge between your on-premises Linux machine and this Azure virtual network.

The following script will create an Azure virtual network with three subnets: one for your storage account's service endpoint, one for your storage account's private endpoint, which is required to access the storage account on-premises without creating custom routing for the public IP of the storage account that may change, and one for your virtual network gateway that provides the VPN service. 

Remember to replace `<region>`, `<resource-group>`, and `<desired-vnet-name>` with the appropriate values for your environment.

```bash
REGION="<region>"
RESOURCE_GROUP_NAME="<resource-group>"
VIRTUAL_NETWORK_NAME="<desired-vnet-name>"

VIRTUAL_NETWORK=$(az network vnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VIRTUAL_NETWORK_NAME \
    --location $REGION \
    --address-prefixes "192.168.0.0/16" \
    --query "newVNet.id" | tr -d '"')

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

## Create certificates for VPN authentication
In order for VPN connections from your on-premises Linux machines to be authenticated to access your virtual network, you must create two certificates: a root certificate, which will be provided to the virtual machine gateway, and a client certificate, which will be signed with the root certificate. The following script creates the required certificates.

```bash
ROOT_CERT_NAME="P2SRootCert"
USERNAME="client"
PASSWORD="1234"

mkdir temp
cd temp

sudo ipsec pki --gen --outform pem > rootKey.pem
sudo ipsec pki --self --in rootKey.pem --dn "CN=$ROOT_CERT_NAME" --ca --outform pem > rootCert.pem

ROOT_CERTIFICATE=$(openssl x509 -in rootCert.pem -outform der | base64 -w0 ; echo)

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

## Deploy virtual network gateway
The Azure virtual network gateway is the service that your on-premises Linux machines will connect to. Deploying this service requires two basic components: a public IP that will identify the gateway to your clients wherever they are in the world and a root certificate you created earlier that will be used to authenticate your clients.

Remember to replace `<desired-vpn-name-here>` with the name you would like for these resources.

> [!Note]  
> Deploying the Azure virtual network gateway can take up to 45 minutes. While this resource is being deployed, this bash script will block for the deployment to be completed.
>
> P2S IKEv2/OpenVPN connections are not supported with the **Basic** SKU. This script uses the **VpnGw1** SKU for the virtual network gateway, accordingly.

```azurecli
VPN_NAME="<desired-vpn-name-here>"
PUBLIC_IP_ADDR_NAME="$VPN_NAME-PublicIP"

PUBLIC_IP_ADDR=$(az network public-ip create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $PUBLIC_IP_ADDR_NAME \
    --location $REGION \
    --sku "Basic" \
    --allocation-method "Dynamic" \
    --query "publicIp.id" | tr -d '"')

az network vnet-gateway create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VPN_NAME \
    --vnet $VIRTUAL_NETWORK_NAME \
    --public-ip-addresses $PUBLIC_IP_ADDR \
    --location $REGION \
    --sku "VpnGw1" \
    --gateway-typ "Vpn" \
    --vpn-type "RouteBased" \
    --address-prefixes "172.16.201.0/24" \
    --client-protocol "IkeV2" > /dev/null

az network vnet-gateway root-cert create \
    --resource-group $RESOURCE_GROUP_NAME \
    --gateway-name $VPN_NAME \
    --name $ROOT_CERT_NAME \
    --public-cert-data $ROOT_CERTIFICATE \
    --output none
```

## Configure the VPN client
The Azure virtual network gateway will create a downloadable package with configuration files required to initialize the VPN connection on your on-premises Linux machine. The following script will place the certificates you created in the correct spot and configure the `ipsec.conf` file with the correct values from the configuration file in the downloadable package.

```azurecli
VPN_CLIENT=$(az network vnet-gateway vpn-client generate \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $VPN_NAME \
    --authentication-method EAPTLS | tr -d '"')

curl $VPN_CLIENT --output vpnClient.zip
unzip vpnClient.zip

VPN_SERVER=$(xmllint --xpath "string(/VpnProfile/VpnServer)" Generic/VpnSettings.xml)
VPN_TYPE=$(xmllint --xpath "string(/VpnProfile/VpnType)" Generic/VpnSettings.xml | tr '[:upper:]' '[:lower:]')
ROUTES=$(xmllint --xpath "string(/VpnProfile/Routes)" Generic/VpnSettings.xml)

sudo cp "${INSTALL_DIR}ipsec.conf" "${INSTALL_DIR}ipsec.conf.backup"
sudo cp "Generic/VpnServerRoot.cer_0" "${INSTALL_DIR}ipsec.d/cacerts"
sudo cp "${USERNAME}.p12" "${INSTALL_DIR}ipsec.d/private" 

sudo tee -a "${installDir}ipsec.conf" <<EOF
conn $VIRTUAL_NETWORK_NAME
    keyexchange=$VPN_TYPE
    type=tunnel
    leftfirewall=yes
    left=%any
    leftauth=eap-tls
    leftid=%client
    right=$vpnServer
    rightid=%$vpnServer
    rightsubnet=$routes
    leftsourceip=%config
    auto=add
EOF

echo ": P12 client.p12 '$PASSWORD'" | sudo tee -a "${INSTALL_DIR}ipsec.secrets" > /dev/null

sudo ipsec restart
sudo ipsec up $VIRTUAL_NETWORK_NAME 
```

## Mount Azure file share
Now that you've set up your Point-to-Site VPN, you can mount your Azure file share. See [Mount SMB file shares to Linux](storage-how-to-use-files-linux.md) or [Mount NFS file share to Linux](storage-files-how-to-mount-nfs-shares.md). 

## See also
- [Azure Files networking overview](storage-files-networking-overview.md)
- [Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md)
- [Configure a Site-to-Site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)
