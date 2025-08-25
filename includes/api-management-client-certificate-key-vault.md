---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 01/11/2023
ms.author: danlep
---

### Prerequisites for key vault integration

[!INCLUDE [api-management-workspace-availability](api-management-workspace-availability.md)]

1. If you don't already have a key vault, create one. For information about creating a key vault, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).

    
1. Enable a system-assigned or user-assigned [managed identity](../articles/api-management/api-management-howto-use-managed-service-identity.md) in API Management.

[!INCLUDE [api-management-key-vault-access](./api-management-key-vault-access.md)]

To create a certificate in the key vault or import a certificate to the key vault, see [Quickstart: Set and retrieve a certificate from Azure Key Vault using the Azure portal](/azure/key-vault/certificates/quick-create-portal).

[!INCLUDE [api-management-key-vault-network](./api-management-key-vault-network.md)]

## Add a key vault certificate

See [Prerequisites for key vault integration](#prerequisites-for-key-vault-integration).

> [!IMPORTANT]
> To add a key vault certificate to your API Management instance, you must have permissions to list secrets from the key vault.

> [!CAUTION]
> When using a key vault certificate in API Management, be careful not to delete the certificate, key vault, or managed identity that's used to access the key vault.

To add a key vault certificate to API Management:

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. Under **Security**, select **Certificates**.
1. Select **Certificates** > **+ Add**.
1. In **Id**, enter a name.
1. In **Certificate**, select **Key vault**.
1. Enter the identifier of a key vault certificate, or choose **Select** to select a certificate from a key vault.
    > [!IMPORTANT]
    > If you enter a key vault certificate identifier yourself, be sure that it doesn't have version information. Otherwise, the certificate won't rotate automatically in API Management after an update in the key vault.
1. In **Client identity**, select a system-assigned identity or an existing user-assigned managed identity. For more information, see [Use managed identities in Azure API Management](../articles/api-management/api-management-howto-use-managed-service-identity.md).
    > [!NOTE]
    > The identity needs to have permissions to get and list certificates from the key vault. If you haven't already configured access to the key vault, API Management prompts you so that it can automatically configure the identity with the necessary permissions.
1. Select **Add**.

    :::image type="content" source="../articles/api-management/media/api-management-howto-mutual-certificates/apim-client-cert-kv.png" alt-text="Screenshot that shows how to add a key vault certificate to API Management in the portal." lightbox="../articles/api-management/media/api-management-howto-mutual-certificates/apim-client-cert-kv.png":::
    
1. Select **Save**.

## Upload a certificate

To upload a client certificate to API Management: 

1. In the [Azure portal](https://portal.azure.com), go to your API Management instance.
1. Under **Security**, select **Certificates**.
1. Select **Certificates** > **+ Add**.
1. In **Id**, enter a name.
1. In **Certificate**, select **Custom**.
1. Browse to select the certificate .pfx file, and enter its password.
1. Select **Add**.

    :::image type="content" source="../articles/api-management/media/api-management-howto-mutual-certificates/apim-client-cert-add.png" alt-text="Screenshot of uploading a client certificate to API Management in the portal.":::


1. Select **Save**.