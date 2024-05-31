---
title: Authenticate with namespaces using JSON Web Tokens
description: This article shows you how to authenticate with Azure Event Grid namespace using JSON Web Tokens.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/21/2024
author: george-guirguis
ms.author: geguirgu
---

# Authenticate with namespaces using JSON Web Tokens
This article shows how to authenticate with Azure Event Grid namespace using JSON Web Tokens.

Azure Event Grid's MQTT broker supports custom JWT authentication, which enables clients to connect and authenticate with an Event Grid namespace using JSON Web Tokens that are issued by any identity provider, aside from Microsoft Entra ID. 

## Prerequisites 

To use custom JWT authentication for namespaces, you need to have the following prerequisites: 

- Identity provider that can issue Json Web Tokens. 
- CA certificate that includes your public keys used to validate the client tokens. 
- Azure Key Vault account to host the CA certificate that includes your public keys. 

## High-level steps 

To use custom JWT authentication for namespaces, follow these steps: 

1. Create a namespace and configure its subresources.
1. Enable managed identity on your Event Grid namespace. 
1. Create an Azure Key Vault account that hosts the CA certificate that includes your public keys. 
1. Add role assignment in Azure Key Vault for the namespace’s managed identity. 
1. Configure custom authentication settings on your Event Grid namespace 
1. Your clients can connect to the Event Grid namespace using the tokens provided by your identity provider. 

## Create a namespace and configure its subresources 
Follow instructions from [Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) to create a namespace and configure its subresources. Skip the certificate and client creation steps as the client identities come from the provided token. Client attributes are based on the custom claims in the client token. The client attributes are used in the client group query, topic template variables, and routing enrichment configuration.

## Enable managed identity on your Event Grid namespace 
The namespace uses the managed identity to access your Azure Key Vault instance to get the server certificate for your custom domain. Use the following command to enable system-assigned managed identity on your Event Grid namespace:  
 
```azurecli-interactive
az eventgrid namespace update --resource-group <resource group name> --name <namespace name> --identity "{type:systemassigned}" 
```
 
For information configuring system and user-assigned identities using the Azure portal, see [Enable managed identity for an Event Grid namespace](event-grid-namespace-managed-identity.md).

## Create an Azure Key Vault account and upload your server certificate 

1. Use the following command to create an Azure Key Vault account: 
 
    ```azurecli-interactive
    az keyvault create --name "<your-unique-keyvault-name>" --resource-group "<resource group name>" --location "centraluseaup" 
    ```
2. Use the following command to import a certificate to the Azure Key Vault 

    ```azurecli-interactive
    az keyvault certificate import --vault-name "<your-key-vault-name>" -n "<cert name>" -f "<path to your certificate pem file> " 
    ```
     > [!NOTE]
    > Your certificate must include the domain name in the Subject Alternative name for DNS. For more information, see [Tutorial: Import a certificate in Azure Key Vault](../key-vault/certificates/tutorial-import-certificate.md).


## Add role assignment in Azure Key Vault for the namespace’s managed identity 
You need to provide access to the namespace to access your Azure Key Vault account using the following steps: 

1. Get Event Grid namespace system managed identity principal ID using the following command 

    ```azurecli-interactive
    $principalId=(az eventgrid namespace show --resource-group <resource group name> --name <namespace name> --query identity.principalId -o tsv) 
    ```
 2. Get your Azure Key vault resource ID.
 
    ```azurecli-interactive
    $keyVaultResourceId=(az keyvault show --resource-group <resource group name> --name <your key vault name> --query id -o tsv) 
    ```
 2. Add role assignment in Key Vault for the namespace’s managed identity. 

    ```azurecli-interactive
    az role assignment create --role "Key Vault Certificate User" --assignee $principalId --scope $keyVaultResourceId 
    ```

    For more information about Key Vault access and the portal experience, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../key-vault/general/rbac-guide.md). 

## Configure custom authentication settings on your Event Grid namespace 
In this step, you configure custom authentication settings on your Event Grid namespace using Azure portal and Azure CLI. You need to create the namespace first then update it using the following steps.

### Use Azure portal

1. Navigate to your Event Grid namespace in the [Azure portal](https://portal.azure.com).
1. On the **Event Grid Namespace** page, select **Configuration** on the left menu. 
1. In the **Custom JWT authentication** section, specify values for the following properties:  
    1. Select **Enable custom JWT authentication**. 
    1. **Token Issuer**: Enter the value of the issuer claims of the JWT tokens, presented by the MQTT clients. 
    1. Select **Add issuer certificate**
    
        :::image type="content" source="./media/authenticate-with-namespaces-using-json-web-tokens/configuration-custom-authentication.png" alt-text="Screenshot that shows the Custom JWT authentication section of the Configuration page for an Event Grid namespace." lightbox="./media/authenticate-with-namespaces-using-json-web-tokens/configuration-custom-authentication.png":::
    1. In the new page, specify values for the following properties.
        1. **Certificate URL**: the Certificate Identifier of the issuer certificate in Azure Key Vault that you created. You can choose **Select a certificate using a key vault** instead to select the certificate and the key vault from your subscriptions. 
        1. **Identity**: the identity used to authenticate with the Key Vault to access the issuer certificate that was created.          
        1. Select **Add**.
        
            :::image type="content" source="./media/authenticate-with-namespaces-using-json-web-tokens/add-issuer-certificate.png" alt-text="Screenshot that shows the Add issuer certificate page.":::
1. Back on the **Configuration** page, select **Apply**. 

    > [!NOTE]
    > You can add up to two `iss` certificates for certificate/key rotation purposes. 

### Use Azure CLI 
Use the following command to update your namespace with the custom JWT authentication configuration.  

  
```azurecli-interactive
az resource update --resource-type Microsoft.EventGrid/namespaces --api-version 2024-06-01-preview --ids /subscriptions/69f9e5ac-ca07-42cc-98d2-4718d033bcc5/resourceGroups/dummy-cd-test/providers/Microsoft.EventGrid/namespaces/dummy-cd-test2 --set properties.topicSpacesConfiguration.clientAuthentication='{\"customJwtAuthentication\":{\"tokenIssuer\":\"dmpypin-issuer\",\"issuerCertificates\":[{\"certificateUrl\":\"https://dummyCert-cd-test.vault.azure.net/certificates/dummy-cd-test/4f844b284afd487e9bba0831191087br1\",\"identity\":{\"type\":\"SystemAssigned\"}}]}}' 
```
## JSON Web Token format
Json Web Tokens are divided into the JWT Header and JWT payload sections.
 
### JWT Header 

The header must contain at least `typ` and `alg` fields. `typ` must always be `JWS` and `alg` must always be `RS256`. The token header must be as follows: 

```json
{
    "typ": "JWT",
    "alg": "RS256"
}
```
 

### JWT payload 

Event Grid requires the following claims: `iss`, `sub`, `aud`, `exp`, `nbf`. 

| Name | Description | 
| ---  | ----------- | 
| `iss` | Issuer. Value in JWT must match issuer in the Event Grid namespace configuration for custom JWT authentication. |
| `sub` | Subject. Value is used as authentication identity name. |
| `aud` | Audience. Value can be a string or an array of strings. Value must contain standard Event Grid namespace hostname and/or custom domain for that Event Grid namespace (if configured). Audience can contain other strings, but we require at least one of these strings to be a standard Event Grid namespace hostname or custom domain for this namespace. |
| `exp` | Expiration. Unix time when JWT expires. |
| `nbf` | Not before. Unit time when JWT becomes valid. |

Event Grid maps all claims to client attributes if they have one of the following types: `int32`, `string`, `array of strings`. Standard claims `iss`, `sub`, `aud`, `exp`, `nbf` are excluded from client attributes. In the following JWT example, only three claims are converted to client attributes, `num_attr`, `str_attr`, `str_list_attr`, because they have correct types `int32`, `string`, `array of strings`. `incorrect_attr_1`, `incorrect_attr_2`, `incorrect_attr_3` aren't converted to client attributes, because they have wrong types: `float`, `array of integers`, `object`. 

```json
{
    "iss": "correct_issuer",
    "sub": "d1",
    "aud": "testns.mqtt-broker-int.azure.net",
    "exp": 1712876224,
    "nbf": 1712869024,
    "num_attr": 1,
    "str_attr": "some string",
    "str_list_attr": [
        "string 1",
        "string 2"
    ],
    "incorrect_attr_1": 1.23,
    "incorrect_attr_2": [
        1,
        2,
        3
    ],
    "incorrect_attr_3": {
        "field": "value"
    }
}
```

## Related content
- [MQTT client authentication](mqtt-client-authentication.md)
