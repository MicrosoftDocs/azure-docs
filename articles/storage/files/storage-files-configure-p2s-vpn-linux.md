---
title: Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files | Microsoft Docs
description: How to configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 10/19/2019
ms.author: rogarana
ms.subservice: files
---

# Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files
You can use a Point-to-Site (P2S) VPN connection to mount your Azure file shares over SMB from outside of Azure, without opening up port 445. A Point-to-Site VPN connection is a VPN connection between Azure and an individual client. To use a P2S VPN connection with Azure Files, a P2S VPN connection will need to be configured for each client that wants to connect. If you have many clients that need to connect to your Azure file shares from your on-premises network, you can use a Site-to-Site (S2S) VPN connection instead of a Point-to-Site connection for each client. To learn more, see [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).

We strongly recommend that you read [Azure Files networking overview](storage-files-networking-overview.md) before continuing with this how to article for a complete discussion of the networking options available for Azure Files.

The article details the steps to configure a Point-to-Site VPN on Linux to mount Azure file shares directly on-premises. If you're looking to route Azure File Sync traffic over a VPN, please see [configuring Azure File Sync proxy and firewall settings](storage-sync-files-firewall-and-proxy.md).

## Prerequisites
- The most recent version of the Azure CLI. For more information on how to install the Azure CLI, see [Install the Azure PowerShell CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and select your operating system. If you prefer to use the Azure PowerShell module on Linux, you may, however the instructions below are presented for Azure CLI.

- An Azure file share you would like to mount on-premises. You may use either a [standard](storage-how-to-create-file-share.md) or a [premium Azure file share](storage-how-to-create-premium-fileshare.md) with your Point-to-Site VPN.

## Install required software
The Azure virtual network gateway can provide VPN connections using several VPN protocols, including IPsec and OpenVPN. This guide shows how to use IPsec and uses the strongSwan package to provide the support on Linux. 

> Verified with Ubuntu 18.10.

```bash
sudo apt install strongswan strongswan-pki libstrongswan-extra-plugins curl libxml2-utils cifs-utils

installDir="/etc/"
```

### Deploy a virtual network 
To access your Azure file share and other Azure resources from on-premises via a Point-to-Site VPN, you must create a virtual network, or VNet. The P2S VPN connection you will automatically create is a bridge between your on-premises Linux machine and this Azure virtual network.

The following script will create an Azure virtual network with three subnets: one for your storage account's service endpoint, one for your storage account's private endpoint, which is required to access the storage account on-premises without creating custom routing for the public IP of the storage account that may change, and one for your virtual network gateway that provides the VPN service. 

Remember to replace `<region>`, `<resource-group>`, and `<desired-vnet-name>` with the appropriate values for your environment.

```bash
region="<region>"
resourceGroupName="<resource-group>"
virtualNetworkName="<desired-vnet-name>"

virtualNetwork=$(az network vnet create \
    --resource-group $resourceGroupName \
    --name $virtualNetworkName \
    --location $region \
    --address-prefixes "192.168.0.0/16" \
    --query "newVNet.id" | tr -d '"')

serviceEndpointSubnet=$(az network vnet subnet create \
    --resource-group $resourceGroupName \
    --vnet-name $virtualNetworkName \
    --name "ServiceEndpointSubnet" \
    --address-prefixes "192.168.0.0/24" \
    --service-endpoints "Microsoft.Storage" \
    --query "id" | tr -d '"')

privateEndpointSubnet=$(az network vnet subnet create \
    --resource-group $resourceGroupName \
    --vnet-name $virtualNetworkName \
    --name "PrivateEndpointSubnet" \
    --address-prefixes "192.168.1.0/24" \
    --query "id" | tr -d '"')

gatewaySubnet=$(az network vnet subnet create \
    --resource-group $resourceGroupName \
    --vnet-name $virtualNetworkName \
    --name "GatewaySubnet" \
    --address-prefixes "192.168.2.0/24" \
    --query "id" | tr -d '"')
```

## Restrict the storage account to the virtual network
By default when you create a storage account, you can access it from anywhere in the world as long as you have the means to authenticate your request (such as with your Active Directory identity or with the storage account key). To restrict access to this storage account to the virtual network you just created, you need to create a network rule set that allows access within the virtual network and denies all other access.

Restricting the storage account to the virtual network requires the use of a service endpoint. The service endpoint is a networking construct by which the public DNS/public IP can be accessed only from within the virtual network. Since the public IP address is not guaranteed to remain the same, we ultimately want to use a private endpoint rather than a service endpoint for the storage account, however it is not possible to restrict the storage account unless a service endpoint is also exposed.

Remember to replace `<storage-account-name>` with the storage account you want to access.

```bash
storageAccountName="<storage-account-name>"

az storage account network-rule add \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --subnet $serviceEndpointSubnet > /dev/null

az storage account update \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --bypass "AzureServices" \
    --default-action "Deny" > /dev/null
```

## Create a private endpoint (preview)
Creating a private endpoint for your storage account gives your storage account an IP address within the IP address space of your virtual network. When you mount your Azure file share from on-premises using this private IP address, the routing rules autodefined by the VPN installation will route your mount request to the storage account via the VPN. 

```bash
zoneName="privatelink.file.core.windows.net"

storageAccount=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "id" | tr -d '"')

az resource update \
    --ids $privateEndpointSubnet \
    --set properties.privateEndpointNetworkPolicies=Disabled > /dev/null

az network private-endpoint create \
    --resource-group $resourceGroupName \
    --name "$storageAccountName-PrivateEndpoint" \
    --location $region \
    --subnet $privateEndpointSubnet \
    --private-connection-resource-id $storageAccount \
    --group-ids "file" \
    --connection-name "privateEndpointConnection" > /dev/null

az network private-dns zone create \
    --resource-group $resourceGroupName \
    --name $zoneName > /dev/null

az network private-dns link vnet create \
    --resource-group $resourceGroupName \
    --zone-name $zoneName \
    --name "$virtualNetworkName-link" \
    --virtual-network $virtualNetworkName \
    --registration-enabled false > /dev/null

networkInterfaceId=$(az network private-endpoint show \
    --name "$storageAccountName-PrivateEndpoint" \
    --resource-group $resourceGroupName \
    --query 'networkInterfaces[0].id' | tr -d '"')
 
storageAccountPrivateIP=$(az resource show \
    --ids $networkInterfaceId \
    --api-version 2019-04-01 \
    --query "properties.ipConfigurations[0].properties.privateIPAddress" | tr -d '"')

fqdnQuery="properties.ipConfigurations[0].properties.privateLinkConnectionProperties.fqdns[0]"
fqdn=$(az resource show \
    --ids $networkInterfaceId \
    --api-version 2019-04-01 \
    --query $fqdnQuery | tr -d '"')

az network private-dns record-set a create \
    --name $storageAccountName \
    --zone-name $zoneName \
    --resource-group $resourceGroupName > /dev/null
```

## Create certificates for VPN authentication
In order for VPN connections from your on-premises Linux machines to be authenticated to access your virtual network, you must create two certificates: a root certificate, which will be provided to the virtual machine gateway, and a client certificate, which will be signed with the root certificate. The following script creates the required certificates.

```bash
rootCertName="P2SRootCert"
username="client"
password="1234"

mkdir temp
cd temp

sudo ipsec pki --gen --outform pem > rootKey.pem
sudo ipsec pki --self --in rootKey.pem --dn "CN=$rootCertName" --ca --outform pem > rootCert.pem

rootCertificate=$(openssl x509 -in rootCert.pem -outform der | base64 -w0 ; echo)

sudo ipsec pki --gen --size 4096 --outform pem > "clientKey.pem"
sudo ipsec pki --pub --in "clientKey.pem" | \
    sudo ipsec pki \
        --issue \
        --cacert rootCert.pem \
        --cakey rootKey.pem \
        --dn "CN=$username" \
        --san $username \
        --flag clientAuth \
        --outform pem > "clientCert.pem"

openssl pkcs12 -in "clientCert.pem" -inkey "clientKey.pem" -certfile rootCert.pem -export -out "client.p12" -password "pass:$password"
```

## Deploy virtual network gateway
The Azure virtual network gateway is the service that your on-premises Linux machines will connect to. Deploying this service requires two basic components: a public IP that will identify the gateway to your clients wherever they are in the world and a root certificate you created earlier that will be used to authenticate your clients.

Remember to replace `<desired-vpn-name-here>` with the name you would like for these resources.

> [!Note]  
> Deploying the Azure virtual network gateway can take up to 45 minutes. While this resource is being deployed, this bash script script will block for the deployment to be completed. This is expected.

```bash
vpnName="<desired-vpn-name-here>"
publicIpAddressName="$vpnName-PublicIP"

publicIpAddress=$(az network public-ip create \
    --resource-group $resourceGroupName \
    --name $publicIpAddressName \
    --location $region \
    --sku "Basic" \
    --allocation-method "Dynamic" \
    --query "publicIp.id" | tr -d '"')

az network vnet-gateway create \
    --resource-group $resourceGroupName \
    --name $vpnName \
    --vnet $virtualNetworkName \
    --public-ip-addresses $publicIpAddress \
    --location $region \
    --sku "VpnGw1" \
    --gateway-typ "Vpn" \
    --vpn-type "RouteBased" \
    --address-prefixes "172.16.201.0/24" \
    --client-protocol "IkeV2" > /dev/null

az network vnet-gateway root-cert create \
    --resource-group $resourceGroupName \
    --gateway-name $vpnName \
    --name $rootCertName \
    --public-cert-data $rootCertificate \
    --output none
```

## Configure the VPN client
The Azure virtual network gateway will create a downloadable package with configuration files required to initialize the VPN connection on your on-premises Linux machine. The following script will place the certificates you created in the correct spot and configure the `ipsec.conf` file with the correct values from the configuration file in the downloadable package.

```bash
vpnClient=$(az network vnet-gateway vpn-client generate \
    --resource-group $resourceGroupName \
    --name $vpnName \
    --authentication-method EAPTLS | tr -d '"')

curl $vpnClient --output vpnClient.zip
unzip vpnClient.zip

vpnServer=$(xmllint --xpath "string(/VpnProfile/VpnServer)" Generic/VpnSettings.xml)
vpnType=$(xmllint --xpath "string(/VpnProfile/VpnType)" Generic/VpnSettings.xml | tr '[:upper:]' '[:lower:]')
routes=$(xmllint --xpath "string(/VpnProfile/Routes)" Generic/VpnSettings.xml)

sudo cp "${installDir}ipsec.conf" "${installDir}ipsec.conf.backup"
sudo cp "Generic/VpnServerRoot.cer" "${installDir}ipsec.d/cacerts"
sudo cp "${username}.p12" "${installDir}ipsec.d/private" 

echo -e "\nconn $virtualNetworkName" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tkeyexchange=$vpnType" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\ttype=tunnel" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tleftfirewall=yes" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tleft=%any" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tleftauth=eap-tls" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tleftid=%client" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tright=$vpnServer" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\trightid=%$vpnServer" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\trightsubnet=$routes" | sudo tee -a "${installDir}ipsec.conf" > /dev/null
echo -e "\tleftsourceip=%config" | sudo tee -a "${installDir}ipsec.conf" > /dev/null 
echo -e "\tauto=add" | sudo tee -a "${installDir}ipsec.conf" > /dev/null

echo ": P12 client.p12 '$password'" | sudo tee -a "${installDir}ipsec.secrets" > /dev/null

sudo ipsec restart
sudo ipsec up $virtualNetworkName 
```

## Mount Azure file share
Now that you have set up your Point-to-Site VPN, you can mount your Azure file share. The following example will mount the share non-persistently. To mount persistently, see [Use an Azure file share with Linux](storage-how-to-use-files-linux.md). 

```bash
fileShareName="myshare"

mntPath="/mnt/$storageAccountName/$fileShareName"
sudo mkdir -p $mntPath

storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')

smbPath="//$storageAccountPrivateIP/$fileShareName"
sudo mount -t cifs $smbPath $mntPath -o vers=3.0,username=$storageAccountName,password=$storageAccountKey,serverino
```

## See also
- [Azure Files networking overview](storage-files-networking-overview.md)
- [Configure a Point-to-Site (P2S) VPN on Windows for use with Azure Files](storage-files-configure-p2s-vpn-windows.md)
- [Configure a Site-to-Site (S2S) VPN for use with Azure Files](storage-files-configure-s2s-vpn.md)