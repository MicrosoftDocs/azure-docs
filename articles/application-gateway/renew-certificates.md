---
title: Renew an Azure Application Gateway certificate
description: Learn how to renew a certificate associated with an application gateway listener.
services: application-gateway
author: greg-lindsay

ms.service: application-gateway
ms.topic: how-to
ms.date: 01/25/2022
ms.author: greglin 
ms.devlang: azurecli
---

# Renew Application Gateway certificates

At some point, you'll need to renew your certificates if you configured your application gateway for TLS/SSL encryption.

There are two locations where certificates may exist: certificates stored in Azure Key Vault, or certificates uploaded to an application gateway.

## Certificates on Azure Key Vault

When Application Gateway is configured to use Key Vault certificates, its instances retrieve the certificate from Key Vault and install them locally for TLS termination. The instances poll Key Vault at four-hour intervals to retrieve a renewed version of the certificate if it exists. If an updated certificate is found, the TLS/SSL certificate that's currently associated with the HTTPS listener is automatically rotated.

> [!TIP]
> Any change to Application Gateway will force a check against Key Vault to see if any new versions of certificates are available. This includes, but is not limited to, changes to Frontend IP Configurations, Listeners, Rules, Backend Pools, Resource Tags, and more. If an updated certificate is found, the new certificate will immediately be presented.

Application Gateway uses a secret identifier in Key Vault to reference the certificates. For Azure PowerShell, the Azure CLI, or Azure Resource Manager, we strongly recommend that you use a secret identifier that doesn't specify a version. This way, Application Gateway will automatically rotate the certificate if a newer version is available in your key vault. An example of a secret URI without a version is `https://myvault.vault.azure.net/secrets/mysecret/`.

## Certificates on an application gateway

Application Gateway supports certificate upload without the need to configure Azure Key Vault. To renew the uploaded certificates, use the following steps for the Azure portal, Azure PowerShell, or Azure CLI. 

### Azure portal

To renew a listener certificate from the portal, navigate to your application gateway listeners. 
Select the listener that has a certificate that needs to be renewed, and then select **Renew or edit selected certificate**.

:::image type="content" source="media/renew-certificate/ssl-cert.png" alt-text="Renew certificate":::

Upload your new PFX certificate, give it a name, type the password, and then select **Save**.

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To renew your certificate using Azure PowerShell, use the following script:

```azurepowershell-interactive
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName <ResourceGroup> `
  -Name <AppGatewayName>

$password = ConvertTo-SecureString `
  -String "<password>" `
  -Force `
  -AsPlainText

set-AzApplicationGatewaySSLCertificate -Name <oldcertname> `
-ApplicationGateway $appgw -CertificateFile <newcertPath> -Password $password

Set-AzApplicationGateway -ApplicationGateway $appgw
```
### Azure CLI

```azurecli-interactive
az network application-gateway ssl-cert update \
  -n "<CertName>" \
  --gateway-name "<AppGatewayName>" \
  -g "ResourceGroupName>" \
  --cert-file <PathToCerFile> \
  --cert-password "<password>"
```



## Next steps

To learn how to configure TLS Offloading with Azure Application Gateway, see [Configure TLS Offload](./create-ssl-portal.md).
