---
title: 'Create S2S VPN Connection Between On-premises Network and Azure Virtual Network - Certificate Authentication: Azure CLI'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN Gateway server settings for site-to-site configurations - certificate authentication using Azure CLI.
author: fabferri
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/13/2026
ms.author: duau

# Customer intent: "As a network engineer, I want to establish a secure site-to-site VPN connection using certificate authentication, so that I can securely connect my on-premises network to my Azure virtual network."
---

# Configure a S2S VPN Gateway certificate authentication connection - Azure CLI

This article shows you how to use Azure CLI to create a site-to-site (S2S) VPN gateway connection between your on-premises network and an Azure virtual network using X.509 certificate-based authentication. Certificate authentication provides stronger security compared to preshared keys (PSK) for VPN connections.

Site-to-site certificate authentication relies on both inbound and outbound certificates to establish secure VPN tunnels. The certificates are securely stored in Azure Key Vault, and each VPN gateway accesses its certificates through a User-Assigned Managed Identity. For more information about the certificates and how the certificate flow works, see [About site-to-site VPN connections with certificate authentication](site-to-site-certificate-authentication-gateway-about.md).

> [!IMPORTANT]
> Basic SKU VPN gateways don't support site-to-site certificate authentication. Use VpnGw1AZ or higher.

:::image type="content" source="./media/site-to-site-certificate-authentication/certificate-diagram.png" alt-text="Diagram that shows site-to-site VPN gateway cross-premises connections using certificates." lightbox="./media/site-to-site-certificate-authentication/certificate-diagram.png":::

> [!IMPORTANT]
> Only the Azure public cloud supports site-to-site certificate authentication.

In this article, you generate the necessary certificates, create the required Azure resources, and configure the site-to-site VPN connection by using Azure CLI.

## Before you begin

To complete the steps in this article, ensure you have the following prerequisites:

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* Azure CLI installed locally or Azure Cloud Shell. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* Familiarity with IP address ranges in your on-premises network configuration.
* A compatible VPN device and someone who can configure it. For more information about compatible VPN devices, see [About VPN devices](vpn-gateway-about-vpn-devices.md).
* An externally facing public IPv4 address for your on-premises VPN device.
* Ensure that the subnets of your on-premises network don't overlap with the virtual network subnets you want to connect to.

## Generate the digital certificates

First, generate the self-signed root CA certificates and the leaf certificates required for VPN authentication. The root CA certificate establishes the trust chain and is used to sign the leaf certificates.

You have two options:

* Use the same root certificate to sign the leaf certificates for both the Azure VPN gateway and the on-premises device.
* Use separate root certificates, one to sign the leaf certificates for the Azure VPN gateway, and another to sign the leaf certificates for the on-premises VPN device.

In the following examples, two root certificates are used: one root certificate signs the leaf certificate used for outbound authentication from Azure to on-premises, and the other root certificate is used to sign the leaf certificates for the on-premises device.

> [!NOTE]
> You can create the digital certificates on Windows or Linux. This example shows the creation on Linux by using OpenSSL.

### Create self-signed root CA certificates

Use OpenSSL to create self-signed root certificates. The following example creates a self-signed root certificate named **VPNRootCA1**, which is automatically stored in the local folder `certs`.

Run the following commands from a bash terminal to create the root certificate for the Azure VPN gateway.

```azurecli-interactive
# Define the root certificate subject for Azure VPN
azureRootcertSubject1='VPNRootCA1'

# Define the local folder to store the digital certificates
pathFiles="$(pwd)"
certPath="$pathFiles/certs/"
echo "folder to store digital certificates: $certPath"

# Create a local folder ./certs/
mkdir -p "$certPath"

# Generate the private key for the Azure VPN gateway root certificate
openssl genrsa -out "$certPath${azureRootcertSubject1}.key" 2048

# Generate the self-signed root certificate for the Azure VPN gateway
openssl req -x509 -new -nodes \
    -key "$certPath${azureRootcertSubject1}.key" \
    -sha256 \
    -days 3650 \
    -out "$certPath${azureRootcertSubject1}.cer" \
    -subj "/CN=$azureRootcertSubject1" \
    -extensions v3_ca \
    -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_ca
[req_distinguished_name]
[v3_ca]
basicConstraints = critical, CA:TRUE, pathlen:4
keyUsage = critical, keyCertSign, cRLSign
EOF
)
```

Run the following commands to create the root certificate for the on-premises VPN device.

```azurecli-interactive
# Define the root certificate subject for the on-premises VPN device
onpremRootcertSubject1='VPNRootCA2'
echo "Creating Root Certificate: $onpremRootcertSubject1"

# Generate the private key for the on-premises root certificate
openssl genrsa -out "$certPath${onpremRootcertSubject1}.key" 2048

# Generate the self-signed root certificate for the on-premises VPN device
openssl req -x509 -new -nodes \
    -key "$certPath${onpremRootcertSubject1}.key" \
    -sha256 \
    -days 3650 \
    -out "$certPath${onpremRootcertSubject1}.cer" \
    -subj "/CN=$onpremRootcertSubject1" \
    -extensions v3_ca \
    -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_ca
[req_distinguished_name]
[v3_ca]
basicConstraints = critical, CA:TRUE, pathlen:4
keyUsage = critical, keyCertSign, cRLSign
EOF
)
echo "Root certificate $onpremRootcertSubject1 created"
```

To generate leaf certificates, leave the bash terminal open and proceed with the next steps.

### Generate leaf certificates signed by the root CA certificates

Generate leaf certificates signed by the root certificates. Use these certificates for site-to-site VPN authentication. The following examples use OpenSSL to generate outbound and inbound leaf certificates. When you create the certificates, the process automatically stores them in `./certs` on your Linux computer.

#### Create outbound certificate for the VPN gateway

```azurecli-interactive
azureLeafcertSubject1='s2s-cert1'
echo "$(date) - start creation leaf cert: $azureLeafcertSubject1"

# Generate the private key
openssl genrsa -out "$certPath${azureLeafcertSubject1}.key" 2048

# Generate the certificate signing request (CSR)
openssl req -new \
    -key "$certPath${azureLeafcertSubject1}.key" \
    -out "$certPath${azureLeafcertSubject1}.csr" \
    -subj "/CN=$azureLeafcertSubject1"

# Sign the leaf certificate for the Azure VPN gateway with Root CA 1
openssl x509 -req \
    -in "$certPath${azureLeafcertSubject1}.csr" \
    -CA "$certPath${azureRootcertSubject1}.cer" \
    -CAkey "$certPath${azureRootcertSubject1}.key" \
    -CAcreateserial \
    -out "$certPath${azureLeafcertSubject1}.cer" \
    -days 3650 \
    -sha256 \
    -extfile <(cat <<EOF
extendedKeyUsage = clientAuth, serverAuth
EOF
)
echo "$(date) - Leaf cert: $azureLeafcertSubject1 created"
```

#### Create outbound certificate for the on-premises device

```azurecli-interactive
onpremLeafcertSubject1='s2s-cert2'

# Generate the private key
openssl genrsa -out "$certPath${onpremLeafcertSubject1}.key" 2048

# Generate the certificate signing request (CSR)
openssl req -new \
   -key "$certPath${onpremLeafcertSubject1}.key" \
   -out "$certPath${onpremLeafcertSubject1}.csr" \
   -subj "/CN=$onpremLeafcertSubject1"

# Sign the leaf certificate with Root CA 2, used for the on-premises VPN device
openssl x509 -req \
   -in "$certPath${onpremLeafcertSubject1}.csr" \
   -CA "$certPath${onpremRootcertSubject1}.cer" \
   -CAkey "$certPath${onpremRootcertSubject1}.key" \
   -CAcreateserial \
   -out "$certPath${onpremLeafcertSubject1}.cer" \
   -days 3650 \
   -sha256 \
   -extfile <(cat <<EOF
extendedKeyUsage = clientAuth, serverAuth
EOF
)
```

> [!NOTE]
> The example shows how to generate root and leaf certificates on a Linux host for the on-premises device to illustrate the correct setup workflow. Because certificate creation varies by device, consult the vendor's documentation for instructions on generating the required root and leaf certificates and importing them into the on-premises device.

#### Export the certificates

Export the root certificates in Base64 format (.cer) and the leaf certificates in PKCS#12 format (.pfx).

```azurecli-interactive
pathFiles="$(pwd)"
certPath="$pathFiles/certs/"
certPassword="12345"

# Export the Azure leaf certificate and its private key to a .pfx file
openssl pkcs12 -export \
    -out "$certPath${azureLeafcertSubject1}.pfx" \
    -inkey "$certPath${azureLeafcertSubject1}.key" \
    -in "$certPath${azureLeafcertSubject1}.cer" \
    -certfile "$certPath${azureRootcertSubject1}.cer" \
    -passout "pass:$certPassword"
```

### Declare Azure environment variables

The next sections refer to the variables defined in the following code block. Update the variable values to match your environment before running the script.

```azurecli-interactive
# Resource group name and location for the deployment of Azure resources
rgName="s2s-cert-azcli"
location='eastus'

# Variables for the virtual network
vnet1Name='vnet1'
vnet1Address='10.1.0.0/16'
gw1SubnetAddress='10.1.0.0/24'

# VPN gateway name
gw1Name='gw1'
gw1ConfigName='gw1-config'
```

### Create virtual networks and gateway subnets

Create a resource group to contain the resources for this deployment. You can either create a new resource group or select one that you already created.

```azurecli-interactive
# Create a resource group
az group create --name "$rgName" --location "$location"

# Add tags for organization (optional)
az group update --name "$rgName" --tags usage="s2s-digitalcertificates" --output none
```

Create the virtual network with a gateway subnet. The gateway subnet must be named `GatewaySubnet` and should be /27 or larger.

```azurecli-interactive
# Create the virtual network
az network vnet create \
    --resource-group "$rgName" \
    --name "$vnet1Name" \
    --address-prefix "$vnet1Address" \
    --location "$location"

# Add the GatewaySubnet
az network vnet subnet create \
    --resource-group "$rgName" \
    --vnet-name "$vnet1Name" \
    --name "GatewaySubnet" \
    --address-prefix "$gw1SubnetAddress"
```

> [!IMPORTANT]
> Network security groups (NSGs) on the gateway subnet aren't supported. Associating an NSG to this subnet might cause your virtual network gateway to stop functioning as expected.

## Create a user-assigned managed identity

This configuration requires a managed identity. VPN gateways use user-assigned managed identities to securely access certificates stored in Azure Key Vault. For more information about managed identities, see [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

When creating the managed identity name, use something intuitive, such as `gw1-s2s-kv` or `vpngwy-managed`. You need the name for Key Vault configuration steps. The resource group doesn't have to be the same as the resource group used for your VPN gateway.

```azurecli-interactive
# Create a user-assigned managed identity for the VPN gateway to access the Azure Key Vault
gw1UserIdentityName='gw1-s2s-kv'
az identity create --resource-group "$rgName" --name "$gw1UserIdentityName" --location "$location"
```

A user-assigned managed identity name doesn't need to be globally unique across subscriptions. It only needs to be unique within the resource group where you create it.

## Create a Key Vault and configure RBAC permissions

This configuration requires Azure Key Vault. Create a Key Vault to store the certificates and configure RBAC permissions for secure access. For more information about Azure Key Vault, see [About Azure Key Vault](/azure/key-vault/general/overview).

> [!NOTE]
> When using the Azure portal to create a Key Vault for certificate authentication, ensure you select **Azure role-based access control** as the Permission model on the access configuration. This approach is recommended.

```azurecli-interactive
# Generate a globally unique Azure Key Vault name.
# Key Vault names must be unique across all Azure regions and must not exceed 24 characters.
suffix="ALFANUMERIC_VALUE"
keyVault1Name="kv-$suffix"

# Delete the Key Vault if it's in the soft-deleted state, to avoid failure
az keyvault purge --name "$keyVault1Name" --location "$location"

# Create the Key Vault - Azure RBAC is the default access control model for newly created vaults
az keyvault create --name "$keyVault1Name" --resource-group "$rgName" --location "$location"
```

### Assign RBAC roles to managed identities

Grant the managed identities the necessary permissions to access certificates in Key Vault by using Azure RBAC.

```azurecli-interactive
# Define the RBAC role IDs
secretsUserRoleId="4633458b-17de-408a-b874-0445c86b69e6"    # built-in role "Key Vault Secrets User"
certUserRoleId="db79e9a7-68ee-4b58-9aeb-b90e7c24fcba"       # built-in role "Key Vault Certificate User"
certOfficerRoleId="a4417e6f-fecd-4de8-b567-7b0420556985"    # built-in role "Key Vault Certificates Officer" (for full certificate management)

keyVaultResourceId=$(az keyvault show --name "$keyVault1Name" --resource-group "$rgName" --query id -o tsv)

# Get the Microsoft Entra service principal object ID of the managed identity
gw1UserIdentityPrincipalId=$(az identity show --resource-group "$rgName" --name "$gw1UserIdentityName" --query principalId -o tsv)

# Assign RBAC roles to the user-assigned managed identity to access the Key Vault
az role assignment create --assignee-object-id "$gw1UserIdentityPrincipalId" \
    --assignee-principal-type ServicePrincipal \
    --role "$certUserRoleId" \
    --scope "$keyVaultResourceId"

az role assignment create --assignee-object-id "$gw1UserIdentityPrincipalId" \
    --assignee-principal-type ServicePrincipal \
    --role "$secretsUserRoleId" \
    --scope "$keyVaultResourceId"

# Assign the Key Vault Certificates Officer role to the current user (required to import certificates)
currentUser=$(az account show --query user.name -o tsv)
currentUserObjectId=$(az ad user show --id "$currentUser" --query id -o tsv)

az role assignment create --assignee-object-id "$currentUserObjectId" \
    --assignee-principal-type User \
    --role "$certOfficerRoleId" \
    --scope "$keyVaultResourceId"
```

RBAC permission changes don't take effect immediately. As a best practice, allow roughly two minutes for the updated role assignments to propagate before validating that the permissions reached the user-assigned managed identity. If RBAC hasn't yet propagated, the next steps might fail.

> [!NOTE]
> Microsoft recommends using Azure RBAC for Key Vault access control instead of the legacy Access Policy model. For more information, see [Migrate from access policy to Azure RBAC](/azure/key-vault/general/rbac-guide).

## Import certificates to Key Vault

Upload the outbound leaf certificate (with the private key) to Azure Key Vault. The certificate file must be in .pfx format.

```azurecli-interactive
pathFiles="$(pwd)"
certPath="$pathFiles/certs/"
azureLeafcertSubject1='s2s-cert1'
cert1FilePath="$certPath${azureLeafcertSubject1}.pfx"
certPassword="12345"

# Name assigned to the certificate object stored in Azure Key Vault for the VPN gateway
gw1OutboundCertName='gw1-cert'

az keyvault certificate import \
    --vault-name "$keyVault1Name" \
    --name "$gw1OutboundCertName" \
    --file "$cert1FilePath" \
    --password "$certPassword"
```

## Create public IP addresses for the VPN gateway

Create zone-redundant Standard SKU public IP addresses for the VPN gateway. The VPN gateway is configured in active-active mode, so two public IP addresses are required.

```azurecli-interactive
# Create public IP 1 for Gateway 1
gw1pubIP1Name="${gw1Name}pip1"
az network public-ip create \
    --resource-group "$rgName" \
    --name "$gw1pubIP1Name" \
    --location "$location" \
    --allocation-method Static \
    --sku Standard \
    --tier Regional \
    --zone 1 2 3

# Create public IP 2 for Gateway 1
gw1pubIP2Name="${gw1Name}pip2"
az network public-ip create \
    --resource-group "$rgName" \
    --name "$gw1pubIP2Name" \
    --location "$location" \
    --allocation-method Static \
    --sku Standard \
    --tier Regional \
    --zone 1 2 3
```

## Create a VPN gateway

Create a VPN gateway by using the user-assigned managed identity for Key Vault access.

> [!NOTE]
> VPN gateway deployment can take 30-45 minutes.

```azurecli-interactive
# Create the Azure VPN gateway in active-active mode
az network vnet-gateway create \
    --resource-group "$rgName" \
    --name "$gw1Name" \
    --location "$location" \
    --public-ip-address "$gw1pubIP1Name" "$gw1pubIP2Name" \
    --vnet "$vnet1Name" \
    --gateway-type Vpn \
    --vpn-type RouteBased \
    --sku VpnGw2AZ \
    --vpn-gateway-generation Generation2

# Get the user-assigned managed identity created earlier
gw1UserIdentityId=$(az identity show \
  --resource-group "$rgName" \
  --name "$gw1UserIdentityName" \
  --query id -o tsv)

# Attach the user-assigned managed identity to the existing Azure VPN gateway
echo "$(date) - updating vpn gateway with managed identity"
az network vnet-gateway identity assign \
    --resource-group "$rgName" \
    --name "$gw1Name" \
    --user-assigned "$gw1UserIdentityId"

# Verify the user-assigned managed identity is associated with the VPN gateway
az network vnet-gateway identity show \
  --resource-group "$rgName" \
  --name "$gw1Name" \
  --query userAssignedIdentities \
  -o json
```

You can check the VPN gateway provisioning state by using the following command.

```azurecli-interactive
az network vnet-gateway show \
  --resource-group "$rgName" \
  --name "$gw1Name" \
  --query provisioningState \
  -o tsv
```

At the end of the deployment, the command returns **Succeeded**. Proceed with the next step only when the VPN gateway deployment succeeds.

## Create local network gateways

The local network gateway is a specific object that represents your on-premises location (the site) for routing purposes. You give the site a name by which Azure can refer to it, and then specify the IP address of the on-premises VPN device to which you create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later.

> [!NOTE]
> You deploy the local network gateway object in Azure, not to your on-premises location.

Configuration considerations:

* **FQDN support:** If you have a dynamic public IP address, you can use a constant DNS name with a Dynamic DNS service to point to your current public IP address. Your Azure VPN gateway resolves the FQDN to determine the public IP address to connect to.
* **Single IP address:** VPN Gateway supports only one IPv4 address for each FQDN. If the domain name resolves to multiple IP addresses, VPN Gateway uses the first IP address returned by the DNS servers. Microsoft recommends that your FQDN always resolve to a single IPv4 address. IPv6 isn't supported.
* **DNS cache:** VPN Gateway maintains a DNS cache that's refreshed every 5 minutes. The gateway tries to resolve the FQDNs for disconnected tunnels only. Resetting the gateway also triggers FQDN resolution.
* **Multiple connections:** Although VPN Gateway supports multiple connections to different local network gateways with different FQDNs, all FQDNs must resolve to different IP addresses.

Create local network gateways to represent the on-premises network site. Each local network gateway specifies the public IP address and address prefixes of the remote on-premises site.

```azurecli-interactive
# Public IP addresses of the on-premises VPN device
site1publicIP1="PUBLIC_IP_ADDRESS_1_ON_PREMISES_DEVICE"
site1publicIP2="PUBLIC_IP_ADDRESS_2_ON_PREMISES_DEVICE"
onpremAddressPrefix="10.2.0.0/16"

# Create the local network gateway for Site1
# The remote peer is the first on-premises public IP: $site1publicIP1
localNetGwSite11Name='localNetSite11'
az network local-gateway create \
    --resource-group "$rgName" \
    --name "$localNetGwSite11Name" \
    --location "$location" \
    --local-address-prefixes "$onpremAddressPrefix" \
    --gateway-ip-address "$site1publicIP1"

# Create the local network gateway for Site1
# The remote peer is the second on-premises public IP: $site1publicIP2
localNetGwSite12Name='localNetSite12'
az network local-gateway create \
    --resource-group "$rgName" \
    --name "$localNetGwSite12Name" \
    --location "$location" \
    --local-address-prefixes "$onpremAddressPrefix" \
    --gateway-ip-address "$site1publicIP2"
```

## Configure your on-premises VPN device

Site-to-site connections to an on-premises network require a VPN device. When you configure your VPN device, you need the following values:

* **Certificate:** You need the certificate data used for authentication. This certificate is also used as the inbound certificate when creating the VPN connection.
* **Public IP address values for your virtual network gateway:** To find the public IP address for your VPN gateway VM instance using the Azure portal, go to your virtual network gateway and look under **Settings** > **Properties**. If you have an active-active mode gateway (recommended), make sure to set up tunnels to each VPN gateway instance. Both tunnels are part of the same connection. Active-active mode VPN gateways have two public IP addresses, one for each gateway VM instance.

Depending on the VPN device that you have, you might be able to download a VPN device configuration script. For more information, see [Download VPN device configuration scripts](vpn-gateway-download-vpndevicescript.md). See the following table for VPN device configuration resources.

| Resource | Description |
|---|---|
| [VPN devices](vpn-gateway-about-vpn-devices.md) | Information about compatible VPN devices |
| [Validated VPN devices](vpn-gateway-about-vpn-devices.md#devicetable) | Links to device configuration settings |
| [About cryptographic requirements](vpn-gateway-about-compliance-crypto.md) | Cryptographic requirements for Azure VPN gateways |
| [IPsec/IKE parameters](vpn-gateway-about-vpn-devices.md#ipsec) | IKE version, Diffie-Hellman Group, encryption, and hashing algorithms |
| [IPsec/IKE policy configuration](vpn-gateway-ipsecikepolicy-rm-powershell.md) | Configure custom IPsec/IKE policy |

## Create VPN connections with certificate authentication

Create the VPN connections using certificate authentication. Each connection uses the outbound certificate from Azure Key Vault and validates inbound connections against the remote site's root certificate chain.

### Prepare outbound certificate authentication information for the VPN gateway

Use the following commands to get the reference to the outbound certificate stored in Azure Key Vault.

```azurecli-interactive
# Get outbound certificate information from Key Vault for the Azure VPN gateway connections
gw1OutboundCertUrl=$(az keyvault certificate show --vault-name "$keyVault1Name" \
  --name "$gw1OutboundCertName" --query id -o tsv)
```

The `gw1OutboundCertUrl` variable contains the path to the outbound certificate in Azure Key Vault. To check the value, use the following command.

```azurecli-interactive
echo $gw1OutboundCertUrl
```

The path is specific to the certificate and looks like: `https://your-keyvault.vault.azure.net/certificates/certificate-name/<certificate-value>`.

### Prepare inbound certificate information for the VPN gateway

The following steps assume that you export the root certificate and store it on the local computer in the folder specified by the `certPath` variable, with the name `VPNRootCA2.cer` (Base64-encoded). This certificate is the on-premises root certificate generated earlier in [Create self-signed root CA certificates](#create-self-signed-root-ca-certificates). Use the certificate information to verify the incoming inbound certificate in the VPN gateway. It doesn't contain private keys.

```azurecli-interactive
pathFiles="$(pwd)"
certPath="$pathFiles/certs"

onpremLeafcertSubject1=$(openssl x509 -in "$certPath/s2s-cert2.cer" -noout -subject | sed -E 's/^subject= ?CN=//')

# Read the inbound certificate chain file for the Azure VPN gateway.
# This is the Root CA certificate in Base64 format for the on-premises VPN device.
inboundCert2Path="$certPath/VPNRootCA2.cer"
inboundCert2Base64=$(grep -v "BEGIN CERTIFICATE" "$inboundCert2Path" | grep -v "END CERTIFICATE" | tr -d '\n\r')
```

You should always have at least two certificates in the inbound certificate section when using intermediate CAs.

> [!IMPORTANT]
> If you have intermediate CAs in your certificate chain, first add the root certificate as the first intermediate certificate, then follow that certificate with the inbound intermediate certificate.

At this stage, assume that you already created the on-premises device's leaf certificate and that you can retrieve the certificate's subject name. On the on-premises device, extract the Common Name (CN) from the outbound leaf certificate. In the example workflow, the CN is `onprem-s2s-1`, but you should verify the CN value used in your own environment.

Don't include the `CN=` prefix in the variable value.

### Create certificate authentication objects

```azurecli-interactive
# Create the certificate authentication object in JSON format for the Azure VPN gateway
# Gateway 1 uses its own certificate for outbound, and trusts Root CA 2 for inbound
certAuthJson="{\"outboundAuthCertificate\":\"$gw1OutboundCertUrl\",\"inboundAuthCertificateChain\":[\"$inboundCert2Base64\"],\"inboundAuthCertificateSubjectName\":\"$onpremLeafcertSubject1\"}"
```

## Create the VPN connections

Deploy two connections to connect two site-to-site tunnels from the VPN gateway to the on-premises device.

```azurecli-interactive
# Create connection 1 from Gateway1 to site1
gw1Connection11Name='Connection11'
az network vpn-connection create \
    --resource-group "$rgName" \
    --name "$gw1Connection11Name" \
    --location "$location" \
    --vnet-gateway1 "$gw1Name" \
    --local-gateway2 "$localNetGwSite11Name" \
    --auth-type Certificate \
    --cert-auth "$certAuthJson" \
    --routing-weight 3

# Create connection 2 from Gateway1 to site1
gw1Connection12Name='Connection12'
az network vpn-connection create \
    --resource-group "$rgName" \
    --name "$gw1Connection12Name" \
    --location "$location" \
    --vnet-gateway1 "$gw1Name" \
    --local-gateway2 "$localNetGwSite12Name" \
    --auth-type Certificate \
    --cert-auth "$certAuthJson" \
    --routing-weight 3
```

## Verify the VPN connection

After you create the connections, verify the VPN gateway setting.

```azurecli-interactive
echo "$(date) - checking vpn connection: $gw1Connection11Name"
vpnConnection11=$(az network vpn-connection show --resource-group "$rgName" --name "$gw1Connection11Name")
echo "$gw1Name - connection name......: $(echo "$vpnConnection11" | jq -r '.name')"
echo "$gw1Name - connection type......: $(echo "$vpnConnection11" | jq -r '.connectionType')"
echo "$gw1Name - authentication type..: $(echo "$vpnConnection11" | jq -r '.authenticationType')"
echo "$gw1Name - connection status....: $(echo "$vpnConnection11" | jq -r '.connectionStatus')"

echo "$(date) - checking vpn connection: $gw1Connection12Name"
vpnConnection12=$(az network vpn-connection show --resource-group "$rgName" --name "$gw1Connection12Name")
echo "$gw1Name - connection name......: $(echo "$vpnConnection12" | jq -r '.name')"
echo "$gw1Name - connection type......: $(echo "$vpnConnection12" | jq -r '.connectionType')"
echo "$gw1Name - authentication type..: $(echo "$vpnConnection12" | jq -r '.authenticationType')"
echo "$gw1Name - connection status....: $(echo "$vpnConnection12" | jq -r '.connectionStatus')"
```

When the VPN tunnels are successfully established, the connection status shows as **Connected**.

You can also verify the connection in the Azure portal:

1. Go to your virtual network gateway in the portal.
1. Select **Connections** in the left pane.
1. Verify the connection status shows **Connected**.

## Next steps

After your connection is complete, you can configure additional VPN Gateway settings. For more information, see the following articles:

* [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md)
* [Configure BGP for VPN Gateway](vpn-gateway-bgp-overview.md)
* [About highly available VPN gateway connections](vpn-gateway-highlyavailable.md)
* [About Key Vault](/azure/key-vault/general/overview)
* [Azure Key Vault RBAC guide](/azure/key-vault/general/rbac-guide)

## Related content

* [Tutorial: Create a site-to-site VPN connection in the Azure portal](tutorial-site-to-site-portal.md)
* [About cryptographic requirements and Azure VPN gateways](vpn-gateway-about-compliance-crypto.md)
* [Configure a S2S VPN Gateway certificate authentication connection - PowerShell](site-to-site-certificate-authentication-gateway-powershell.md)
* [Generate and export certificates for point-to-site using PowerShell](vpn-gateway-certificates-point-to-site.md)
