---
title: 'Tutorial: Configure keyless TLS termination with Azure Key Vault Managed HSM'
titleSuffix: Azure Application Gateway
description: Learn how to configure Azure Application Gateway to use an Azure Key Vault Managed HSM-backed certificate for keyless TLS termination.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: tutorial
ms.date: 10/19/2026
ms.author: mbender
ms.custom: mvc, devx-track-azurecli
---

# Configure keyless TLS termination with Azure Key Vault Managed HSM

Azure Application Gateway can terminate TLS by using a certificate whose private key remains in Azure Key Vault Managed HSM. This approach keeps private key material inside the HSM while still allowing Application Gateway to handle TLS offload and re-encryption to backend servers.

For the conceptual background, see [What is keyless TLS for Azure Application Gateway and Azure Key Vault Managed HSM?](keyless-tls-overview.md)

In this tutorial, you learn how to:

- Provision and initialize an Azure Key Vault Managed HSM instance
- Create managed identities and assign HSM roles
- Generate a certificate backed by an HSM private key
- Configure Application Gateway to use the HSM-backed certificate
- Monitor keyless TLS operations with diagnostics

If you already have an Application Gateway, a Managed HSM, and a Linux VM that can run OpenSSL 3.0.13, you can skip the provisioning steps and begin at the certificate generation section.

>[!NOTE]
>This article uses Azure CLI for most tasks and Azure portal steps only where the portal experience is the most direct option. For a portal-first quickstart, see [Create an application gateway with TLS termination](quick-create-portal.md).

## Prerequisites

Before you begin, ensure you have:

- An Azure subscription with permission to create Azure resources
- Access to Azure CLI, either locally or in Azure Cloud Shell
- A Linux VM running Ubuntu for certificate operations (recommended 24.04 LTS)
- OpenSSL 3.0.13 installed on the VM (default version on Ubuntu 24.04 LTS)
- The [Azure Key Vault Managed HSM TLS offload library for Application Gateway (appgw_ekv.so)](https://github.com/microsoft/AzureManagedHsmTLSOffload/releases/download/v1.1.0.03455/appgw_ekv.so)

You also need these roles during setup:

- Managed HSM Crypto Officer for initial Azure Key Vault Managed HSM setup
- Managed HSM Crypto User for certificate operations
- Owner or User Access Administrator for role assignments

>[!IMPORTANT]
>The examples in this article use placeholder values such as `<your-resource-group-name>`. Replace them with values that match your environment.

## Provision Azure Key Vault Managed HSM

Create the resource group and provision the Azure Key Vault Managed HSM instance.

```azurecli-interactive
az group create --name $RESOURCE_GROUP --location $LOCATION

export oid=$(az ad signed-in-user show --query id -o tsv)

az keyvault create --hsm-name $MHSM_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --administrators $oid --retention-days 7
```

Generate three security domain certificates and initialize the security domain.

```azurecli-interactive
openssl req -newkey rsa:2048 -nodes -keyout cert_0.key -x509 -days 365 -out cert_0.cer -subj "/C=US/ST=WA/L=Redmond/O=MyCompany/CN=myapp.example.com"
openssl req -newkey rsa:2048 -nodes -keyout cert_1.key -x509 -days 365 -out cert_1.cer -subj "/C=US/ST=WA/L=Redmond/O=MyCompany/CN=myapp.example.com"
openssl req -newkey rsa:2048 -nodes -keyout cert_2.key -x509 -days 365 -out cert_2.cer -subj "/C=US/ST=WA/L=Redmond/O=MyCompany/CN=myapp.example.com"

az keyvault security-domain download --hsm-name $MHSM_NAME --sd-wrapping-keys ./cert_0.cer ./cert_1.cer ./cert_2.cer --sd-quorum 2 --security-domain-file $SECURITY_DOMAIN
```

If you use Azure Cloud Shell, package the generated files for download.

```azurecli-interactive
tar -czvf mhsm.tar.gz ./*
```

## Grant HSM access and create the key

Assign yourself the Managed HSM Crypto User role so you can create and manage keys.

```azurecli-interactive
az keyvault role assignment create --hsm-name $MHSM_NAME --role "Managed HSM Crypto User" --assignee-object-id $oid --assignee-principal-type MSI --scope /keys
```

Verify that the identity you use for Azure CLI can access the HSM keys.

>[!TIP]
> If an identity should only access a single key, scope the role assignment to `/keys/<key-name>` instead of `/keys`.

```azurecli-interactive
az keyvault key list --hsm-name $MHSM_NAME
```

Create the HSM key that is used to sign TLS operations.

```azurecli-interactive
az keyvault key create --hsm-name $MHSM_NAME --name $PRIVATE_KEY --ops wrapKey unwrapKey sign --kty RSA-HSM --size 2048
```

## Prepare the Linux VM for certificate operations

Provision an Ubuntu VM and enable a system-assigned managed identity. For the portal steps, see [Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu) and [Enable a system-assigned managed identity on an existing VM](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities?pivots=qs-configure-portal-linux-vm#enable-system-assigned-managed-identity-on-an-existing-vm).

After you enable the identity, record the object ID and grant the VM access to the HSM.

```azurecli-interactive
export smioid="<system-managed-identity-object-id>"

az keyvault role assignment create --hsm-name $MHSM_NAME --role "Managed HSM Crypto User" --assignee-object-id $smioid --assignee-principal-type MSI --scope /keys
```

Copy the TLS offload library to the VM, and then install the build dependencies required for OpenSSL.

```azurecli-interactive
chmod 755 ~/appgw_akv.so

sudo apt update && sudo apt upgrade -y
sudo apt install build-essential zlib1g-dev -y
```

## Build OpenSSL and configure the TLS offload library

Build OpenSSL 3.0.13, install the TLS offload library, and configure the environment variables required by the engine.

```azurecli-interactive
cd /usr/local/src
sudo wget https://www.openssl.org/source/openssl-3.0.13.tar.gz --no-check-certificate
sudo tar -xvzf openssl-3.0.13.tar.gz
cd openssl-3.0.13

sudo ./config --prefix=/opt/openssl-3.0.13 --openssldir=/opt/openssl-3.0.13 shared zlib
sudo make -j$(nproc)
sudo make install
```

Copy the engine binary into the OpenSSL engine directory and verify the hash if you have a published checksum.

```azurecli-interactive
sudo cp ~/appgw_akv.so /opt/openssl-3.0.13/lib64/engines-3/

export LD_LIBRARY_PATH=/opt/openssl-3.0.13/lib64:$LD_LIBRARY_PATH
export OPENSSL_ENGINES=/opt/openssl-3.0.13/lib64/engines-3
export PATH=/opt/openssl-3.0.13/bin:$PATH

openssl engine -t -c -vvvv e_akv
openssl version
```

>[!WARNING]
>OpenSSL 3.0.13 is required for this library version. Earlier or later versions might not load the engine correctly.

Generate a self-signed certificate backed by the HSM private key and base64-encode the certificate for later use in Application Gateway.

```azurecli-interactive
export OPENSSL_CERT_DAYS=365
export OPENSSL_CERT_SUBJ=/CN=contoso.com

cd ~

openssl req -new -x509 -engine e_akv -keyform engine -key managedHsm:$MHSM_NAME:$PRIVATE_KEY -out cert_rsa.pem -subj $OPENSSL_CERT_SUBJ -days $OPENSSL_CERT_DAYS
base64 -w0 cert_rsa.pem > base64.txt
```

>[!IMPORTANT]
>Keep the certificate file and the base64 output in a secure location. The certificate is used to update the Application Gateway configuration, but the private key remains in Managed HSM.

## Configure Application Gateway

Use an existing Application Gateway or create a new test deployment. The following example shows the optional test environment, including a Container Apps backend.

### Create a test backend and Application Gateway

Create the network, Container Apps environment, and a sample backend application.

```azurecli-interactive
az network vnet create --name $VNET_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --address-prefix $ADDRESS_PREFIX --subnet-name $APPGW_SUBNET --subnet-prefix $APPGW_SUBNET_PREFIX
az network vnet subnet create --name $BACKEND_SUBNET --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --address-prefix $BACKEND_SUBNET_PREFIX

az containerapp env create --name $ACA_ENV --resource-group $RESOURCE_GROUP --location $LOCATION --logs-destination none
az containerapp create --name $ACA_NAME --resource-group $RESOURCE_GROUP --environment $ACA_ENV --image nginxdemos/hello --target-port 80 --ingress external

ACA_URL=$(az containerapp show --name $ACA_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)
```

Create the public IP, self-signed certificate, and Application Gateway.

```azurecli-interactive
az network public-ip create --resource-group $RESOURCE_GROUP --name $APPGW_PIP_NAME --sku Standard

openssl req -x509 -newkey rsa:2048 -keyout mykey.key -out mycert.crt -days 365 -nodes -subj "/C=US/ST=WA/L=Redmond/O=MyCompany/CN=myapp.example.com"
openssl pkcs12 -export -out $SSCERT_FILE -inkey mykey.key -in mycert.crt -passout pass:$SSCERT_PASSWD

az network application-gateway create --name $APPGW_NAME --location $LOCATION --resource-group $RESOURCE_GROUP --sku Standard_v2 --capacity 2 --public-ip-address $APPGW_PIP_NAME --vnet-name $VNET_NAME --subnet $APPGW_SUBNET --priority 100
```

Configure the certificate, listener, backend pool, and routing rule.

```azurecli-interactive
az network application-gateway ssl-cert create --resource-group $RESOURCE_GROUP --gateway-name $APPGW_NAME --name $SSCERT_NAME --cert-file $SSCERT_FILE --cert-password $SSCERT_PASSWD
az network application-gateway frontend-port create --resource-group $RESOURCE_GROUP --gateway-name $APPGW_NAME --name $HTTPS_PORT --port 443
az network application-gateway http-listener create --resource-group $RESOURCE_GROUP --gateway-name $APPGW_NAME --name $LISTENER --frontend-ip "appGatewayFrontendIP" --frontend-port $HTTPS_PORT --ssl-cert $SSCERT_NAME

az network application-gateway address-pool create --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --name $BACKEND_POOL --servers $ACA_URL
az network application-gateway http-settings create --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --name $HTTPS_SETTING_NAME --port 443 --protocol Https --cookie-based-affinity Disabled --host-name-from-backend-pool true
az network application-gateway probe create --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --name $PROBE_NAME --protocol Https --path "/" --interval 30 --timeout 30 --host-name-from-http-settings true
az network application-gateway http-settings update --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --name $HTTPS_SETTING_NAME --probe $PROBE_NAME --port 443 --protocol Https --host-name-from-backend-pool true

RULE_NAME=$(az network application-gateway rule list --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --query "[0].name" --output tsv)
az network application-gateway rule update --gateway-name $APPGW_NAME --resource-group $RESOURCE_GROUP --name $RULE_NAME --http-listener $LISTENER --http-settings $HTTPS_SETTING_NAME --address-pool $BACKEND_POOL --priority 100
```

Test the deployment before you move on to keyless TLS.

```azurecli-interactive
APPGW_PUBLIC_IP=$(az network public-ip show --resource-group $RESOURCE_GROUP --name $APPGW_PIP_NAME --query ipAddress --output tsv)

echo "Container App URL: $ACA_URL"
echo "Application Gateway public IP: $APPGW_PUBLIC_IP"
```

>[!TIP]
> If the Application Gateway is unreachable from your network, check for NSG rules that block inbound HTTPS traffic to the gateway subnet.

### Configure a multi-site listener

If you want to route requests by hostname, create a second listener and routing rule.

```azurecli-interactive
az network application-gateway http-listener create --resource-group "$RESOURCE_GROUP" --gateway-name "$APPGW_NAME" --name "$MULTISITE_LISTENER_NAME" --frontend-ip "appGatewayFrontendIP" --frontend-port "$HTTPS_PORT" --ssl-cert "$SSCERT_NAME" --host-name "$MULTISITE_HOSTNAME"

az network application-gateway rule create --resource-group "$RESOURCE_GROUP" --gateway-name "$APPGW_NAME" --name "rule2" --rule-type Basic --http-listener "$MULTISITE_LISTENER_NAME" --address-pool "$BACKEND_POOL" --http-settings "$HTTPS_SETTING_NAME" --priority 50

curl -vk "https://<application-gateway-public-ip>/" -H "Host: <hostname>"
```

>[!NOTE]
> The multi-site listener uses the `Host` header to select the listener. In production, point DNS records for each hostname to the Application Gateway public IP address.

> [!CAUTION]
> At this stage, the Application Gateway still uses the local certificate from the `.pfx` file. The next section replaces that certificate with a Managed HSM-backed certificate.

## Configure keyless TLS

Create a user-assigned managed identity for Application Gateway and grant it access to the Managed HSM key.

```azurecli-interactive
az identity create --name $MI_NAME --resource-group $RESOURCE_GROUP --location $LOCATION

export mioid=$(az identity show --name $MI_NAME --resource-group $RESOURCE_GROUP --query principalId --output tsv)

az keyvault role assignment create --hsm-name $MHSM_NAME --role "Managed HSM Crypto User" --assignee-object-id $mioid --assignee-principal-type MSI --scope /keys
```

>[!TIP]
> If the Application Gateway identity should only access one key, scope the role assignment to `/keys/<key-name>`.

Associate the user-assigned managed identity with Application Gateway so it can authenticate to Managed HSM.

```azurecli-interactive
export identityId=$(az identity show --name $MI_NAME --resource-group $RESOURCE_GROUP --query id -o tsv)

az network application-gateway update --name $APPGW_NAME --resource-group $RESOURCE_GROUP --set identity='{"type":"UserAssigned","userAssignedIdentities":{"'"$identityId"'":{}}}'
az network application-gateway show --name $APPGW_NAME --resource-group $RESOURCE_GROUP --query identity
```

Add a new reference to the managed HSM in `sslCertificates`.

```azurecli-interactive
# Add reference to the HSM-backed key and the base64-encoded public certificate
az network application-gateway ssl-cert create \
--resource-group $RESOURCE_GROUP \
--gateway-name $APPGW_NAME \
--name mHSM-Key001 \
--hsm keyId="https://<HSM NAME>.managedhsm.azure.net/keys/<key-name>" publicCertData="Q......................=="
```

Create a new listener with reference to the managed HSM configuration.

```azurecli-interactive
# Associate certificate to a new listener
az network application-gateway http-listener create \
--resource-group $RESOURCE_GROUP \
--gateway-name $APPGW_NAME \
--name mhsm-listener \
--frontend-ip appGwPublicFrontendIpIPv4 \
--frontend-port port_443 \
--ssl-cert mHSM-Key001 \
--host-name contoso.com
```

After deployment completes, verify that the Application Gateway configuration shows the new SSL certificate name in the `sslCertificates` array.

>[!NOTE]
> The keyless TLS configuration keeps the private key in Azure Key Vault Managed HSM while Application Gateway performs the TLS signing operations during the handshake.

## Monitor keyless TLS operations

Optional: enable diagnostics on the Managed HSM to review cryptographic operations generated by Application Gateway.

1. Open the Managed HSM resource in the Azure portal.
1. Select **Diagnostic settings** under **Monitoring**.
1. Add a diagnostic setting that sends the `AuditEvent` category to a Log Analytics workspace.
1. Save the setting and wait a few minutes for logs to appear.

Generate traffic and then query the logs.

```azurecli-interactive
for i in {1..10}; do
    curl -k --resolve contoso.com:443:<appgw-frontend-ip-address> "https://contoso.com"
done
```

```kql
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT"
| where Category == "AuditEvent"
| where OperationName == "KeySign"
| project TimeGenerated, OperationName, CallerIPAddress, identity_claim_appid_g, properties_s
| order by TimeGenerated desc
```

>[!TIP]
> Use the query results to confirm that Application Gateway is calling Managed HSM for signing operations during TLS handshakes.

## Troubleshooting

### Disabled listener behavior

A disabled listener can occur in the following scenarios:

- Application Gateway can't authenticate to Managed HSM because of incorrect RBAC permissions.
- Application Gateway can't decrypt TLS handshake material because the referenced key was deleted.

## Limitations

- Listeners must use TLS 1.2 or later.
- Supported SSL policies are limited to `AppGwSslPolicy20220101`, `AppGwSslPolicy20220101S`, and `CustomV2`.
- For throughput and capacity planning, review [Azure Key Vault Managed HSM scaling guidance](/azure/key-vault/managed-hsm/scaling-guidance) and [Azure Key Vault Managed HSM service limits](/azure/key-vault/managed-hsm/service-limits).
- Certificate replacements on the Managed HSM object might not be applied on the first update. If this condition occurs, make another small change to Application Gateway, such as updating a tag, or remove and re-add the Managed HSM reference in separate operations.
- The following scenarios aren't supported:
  - Application Gateway Ingress Controller (AGIC)
  - WebSockets
  - L4 TCP/TLS proxy
  - FIPS mode
  - EC keys

## Related content

- [Azure Key Vault Managed HSM documentation](/azure/key-vault/managed-hsm/)
- [Application Gateway SSL overview](ssl-overview.md)
- [Azure Key Vault Managed HSM TLS offload library](/azure/key-vault/managed-hsm/tls-offload-library)

## Next steps

To expand this setup, review [listener-specific SSL policy guidance](application-gateway-configure-listener-specific-ssl-policy.md) and [Application Gateway diagnostics](application-gateway-diagnostics.md).
