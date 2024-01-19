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
### Azure Terraform

If the application gateway is terraform managed, the azure terraform key vault data source will get the entire key vault URI, including the version of the secrets. For automatic rotation of the certificate to a new version, the secret should be versionless.

**Reference snip**:

![Application Gateway SSL Certificate](/.attachments/msimage.png)

*The below piece of terraform code is okay, but there's a problem with the data source called "azurerm_key_vault_secret." It fetches the Key Vault secret ID, but it includes the version of the secret in the complete Keyvault URL.*

**Reference**:

```
data "azurerm_key_vault_secret" "vault" {    
   name         = "byte-cloud"          
   key_vault_id = "<resource-id-key-vault>"
}
```

where:
- **data**:                      Indicates that you are retrieving information from an existing resource rather than creating a new one. <br>
- **azurerm_key_vault_secret**": Specifies the type or kind of data source, in this case, it's fetching information about a secret from an Azure Key Vault. <br>
- **vault**:                     Is the name given to this particular instance of the azurerm_key_vault_secret data source. You will refer to this name when using the output from this data source elsewhere in your Terraform configuration. <br>
- **name**:                      name of the certificate stored in Keyvault <br>

2. The data source "**azurerm_key_vault_secret**" will be used within the `**ssl_certificate**` block under the application gateway section.

**Reference-1**:
<pre>
```
resource "azurerm_application_gateway" "main" {
  name                = "myAppGateway"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 1
  }

  identity {
    type                     = "UserAssigned"
    identity_ids             = [data.azurerm_user_assigned_identity.appgw_identity.id]
  }
  
  ssl_certificate {
      name = "afdpremium-agw-ssl-certificate"                       
      // Reference the Key Vault secret ID
      <span style="background-color: yellow; color: black">key_vault_secret_id  = data.azurerm_key_vault_secret.vault.id</span> 
    }
```
</pre>

- where, **key_vault_secret_id** is Certificate object stored in Azure KeyVault.

*The piece of code above will add a SSL certificate in the application gateway but it will be pointed to the secret version of the certificate.*

**Reference snip**

![Application Gateway SSL Certificate](/.attachments/oldsslcertlink.png)

3. The certificate added to the application gateway, as shown in the screenshot above, is tied to a specific secret version. Renewing this certificate in KeyVault doesn't automatically make the application gateway listener select the updated certificate. To reflect the changes, the certificate in the application gateway must be manually updated.

#####Solution

*To resolve this issue, we can leverage the Terraform "**replace**" function. By using this function, we can replace the entire KeyVault URL, which includes the secret version, with just the secret name, excluding the version.*

- **Here's how**:

1. We will modify the existing "**ssl_certificate**" block under the application gateway block of the terraform to use the replace function.

**Reference-2**:
<pre>
```
resource "azurerm_application_gateway" "main" {
  name                = "myAppGateway"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 1
  }

  identity {
    type                     = "UserAssigned"
    identity_ids             = [data.azurerm_user_assigned_identity.appgw_identity.id]
  }
  
  ssl_certificate {
      name = "afdpremium-agw-ssl-certificate"                       
      // Reference the Key Vault secret ID
      <span style="background-color: yellow; color: black">key_vault_secret_id = replace(data.azurerm_key_vault_secret.vault.id, "/secrets/(.*)/[^/]+/", "secrets/$1")</span>
    }
```
</pre>

2. What we did above?

- We use the same data source "**data.azurerm_key_vault_secret.vault.id**" which we used earlier in “**Reference-1**”, but we will use that data source along with the replace function and then compare the value in the data source “**data.azurerm_key_vault_secret.vault.id**” with regex “/secrets/(.*)/[^/]+/",” and then just use /secrets/group1.

- Replace function of terraform takes three arguments.

` replace(string, substring, replacement)
`
- In this case, string = full URL stored in data source **data.azurerm_key_vault_secret.vault.id** , substring = /secrets/(.*)/[^/]+/ , replacement = /secrets/$1

**For-example**:
```
- **secret_value_old** = https://dummy.vault.azure.net/secrets/afdpremium/5cd21fe4d7934a82b187ffcaa86ae3f6

- When the replace function compares the value above with the regex "**/secrets/(.*)/[^/]+**", the resulting replacement will be "**/secrets/$1**", where "**$1**" represents the first match group from the full KeyVault URL within the regex.

- **secret_value_new**: https://dummy.vault.azure.net/afdpremium

- **Regex-Link**: https://regex101.com/r/tOlT5p/1

- **Note**: Please add a forward “**/**” in terraform regex otherwise it will not work. This is because Terraform uses forward slashes as separators in certain syntax constructs to organize resources or data sources hierarchically.
```

**Final-Result**:

![Application Gateway SSL Certificate](/.attachments/newsslcertlink.png)

## Next steps

To learn how to configure TLS Offloading with Azure Application Gateway, see [Configure TLS Offload](./create-ssl-portal.md).
