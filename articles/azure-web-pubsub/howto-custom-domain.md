---
title: Configure a custom domain for Azure Web PubSub Service
titleSuffix: Azure Web PubSub Service
description: How to configure a custom domain for Azure Web PubSub Service
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 03/30/2023
ms.author: dayshen
---

# Configure a custom domain for Azure Web PubSub Service

In addition to the default domain provided by the Azure Web PubSub Service, you can also add a custom domain.  A custom domain is a domain name that you own and manage. You can use a custom domain to access your Azure Web PubSub Service resource. For example, you can use `contoso.example.com` instead of `contoso.webpubsub.azure.com` to access your Azure Web PubSub Service resource.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub service (must be Premium tier).
* An Azure Key Vault resource.
* A custom certificate matching custom domain that is stored in Azure Key Vault.

## Add a custom certificate

Before you can add a custom domain, you need to add a matching custom certificate first. A custom certificate is a resource of your Azure Web PubSub Service. It references a certificate in your Azure Key Vault. For security and compliance reasons, Azure Web PubSub Service doesn't permanently store your certificate. Instead it fetches it from your Key Vault on the fly and keeps it in memory.

### Step 1: Grant your Azure Web PubSub Service resource access to Key Vault

Azure Web PubSub Service uses Managed Identity to access your Key Vault. In order to authorize, it needs to be granted permissions.

1. In the Azure portal, go to your Azure Web PubSub Service resource.
1. In the menu pane, select **Identity**.
1. You can select **System assigned** or **User assigned** identity. If you want to use **User assigned** identity, you need to create one first.
    1. To add a System assigned identity
        1. Select **On**.
        1. Select **Yes** to confirm.
        1. Select **Save**.

        :::image type="content" alt-text="Screenshot of enabling system assigned managed identity." source="media\howto-custom-domain\portal-identity.png" :::

    1. To add a User assigned identity;
        1. Select **Add user assigned managed identity**. 
        1. Select an existing identity.
        1. Select **Add**.

        :::image type="content" alt-text="Screenshot of enabling user assigned managed identity." source="media\howto-custom-domain\portal-user-assigned-identity.png" :::

1. Select **Save**.

Depending on how you configure your Key Vault permission model, you may need to grant permissions at different places.

#### [Vault access policy](#tab/vault-access-policy)

If you're using Key Vault built-in access policy as Key Vault permission model:

   :::image type="content" alt-text="Screenshot of built-in access policy selected as Key Vault permission model." source="media\howto-custom-domain\portal-key-vault-perm-model-access-policy.png" :::

1. Go to your Key Vault resource.
1. In the menu pane, select **Access configuration**.
1. Select **Vault access policy**.
1. Select **Go to access policies**.
1. Select **Create**.
1. Select **Secret Get** permission.
1. Select **Certificate Get** permission. 
1. Select **Next**.

   :::image type="content" alt-text="Screenshot of permissions selection in Key Vault." source="media\howto-custom-domain\portal-key-vault-permissions.png" :::

1. Search for the Azure Web PubSub Service resource name. 
1. Select **Next**.

   :::image type="content" alt-text="Screenshot of principal selection in Key Vault." source="media\howto-custom-domain\portal-key-vault-principal.png" :::

1. Select **Next** on the **Application** tab.
1. Select **Create**.

#### [Azure role-based access control](#tab/azure-rbac)

If you're using Azure role-based access control as Key Vault permission model:

   :::image type="content" alt-text="Screenshot of Azure RBAC selected as Key Vault permission model." source="media\howto-custom-domain\portal-key-vault-perm-model-rbac.png" :::

1. Go to your Key Vault resource.
1. Select **Go to access control (IAM)** from the menu.
1. Select **Add**, then select **Add role assignment** fro the drop-down.

   :::image type="content" alt-text="Screenshot of Key Vault IAM." source="media\howto-custom-domain\portal-key-vault-iam.png" :::

1. Under the **Role** tab, select **Key Vault Secrets User**. Select **Next**.

   :::image type="content" alt-text="Screenshot of role tab when adding role assignment to Key Vault." source="media\howto-custom-domain\portal-key-vault-role.png" :::

1. Under the **Members** tab, select **Managed identity**. 
1. Search for and **Select** the Azure Web PubSub Service resource name or the user assigned identity name.

   :::image type="content" alt-text="Screenshot of members tab when adding role assignment to Key Vault." source="media\howto-custom-domain\portal-key-vault-members.png" :::

1. Select **Next**.
1. Select **Review + assign**.

-----

### Step 2: Create a custom certificate

1. In the Azure portal, go to your Azure Web PubSub Service resource.
1. In the menu pane, select **Custom domain**.
1. In the **Custom certificate** section, select **Add**.

   :::image type="content" alt-text="Screenshot of custom certificate management." source="media\howto-custom-domain\portal-custom-certificate-management.png" :::

1. Fill in a name for the custom certificate.
1. Select **Select from your Key Vault** to choose a Key Vault certificate. After selection the following **Key Vault Base URI**, the **Key Vault Secret Name** will be automatically filled in. Alternatively you can also fill in these fields manually.
1. Optionally, you can specify a **Key Vault Secret Version** if you want to pin the certificate to a specific version.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom certificate." source="media\howto-custom-domain\portal-custom-certificate-add.png" :::

Azure Web PubSub Service fetches the certificate and validates its contents. When it succeeds,  the certificate's **Provisioning State** will be **Succeeded**.

   :::image type="content" alt-text="Screenshot of an added custom certificate." source="media\howto-custom-domain\portal-custom-certificate-added.png" :::

## Create a custom domain CNAME

To validate the ownership of your custom domain, you need to create a CNAME record for the custom domain and point it to the default domain of Azure Web PubSub Service.

For example, if your default domain is `contoso.webpubsub.azure.com`, and your custom domain is `contoso.example.com`, you need to create a CNAME record on `example.com` like:

```plaintext
contoso.example.com. 0 IN CNAME contoso.webpubsub.azure.com.
```

If you're using Azure DNS Zone, see [manage DNS records](../dns/dns-operations-recordsets-portal.md) to learn how to add a CNAME record.

   :::image type="content" alt-text="Screenshot of adding a CNAME record in Azure DNS Zone." source="media\howto-custom-domain\portal-dns-cname.png" :::

If you're using other DNS providers, follow provider's guide to create a CNAME record.

## Add a custom domain

A custom domain is another sub resource of your Azure Web PubSub Service. It contains all configurations for a custom domain.

1. In the Azure portal, go to your Azure Web PubSub Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom domain**, select **Add**.

   :::image type="content" alt-text="Screenshot of custom domain management." source="media\howto-custom-domain\portal-custom-domain-management.png" :::

1. Enter a name for the custom domain. It's the sub resource name.
1. Enter the domain name. It's the full domain name of your custom domain, for example, `contoso.com`.
1. Select a custom certificate that applies to this custom domain.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom domain." source="media\howto-custom-domain\portal-custom-domain-add.png" :::

## Verify a custom domain

You can now access your Azure Web PubSub Service endpoint via the custom domain. To verify it, you can access the health API.

Here's an example using cURL:

#### [PowerShell](#tab/azure-powershell)

```powershell
PS C:\> curl.exe -v https://contoso.example.com/api/health
...
> GET /api/health HTTP/1.1
> Host: contoso.example.com

< HTTP/1.1 200 OK
...
PS C:\>
```

#### [Bash](#tab/azure-bash)

```bash
$ curl -vvv https://contoso.example.com/api/health
...
*  SSL certificate verify ok.
...
> GET /api/health HTTP/2
> Host: contoso.example.com
...
< HTTP/2 200
...
```

-----

The health API should return `200` status code without any certificate error.

## Key Vault in private network

If you've configured a [Private Endpoint](../private-link/private-endpoint-overview.md) to your Key Vault, Azure Web PubSub Service can't access the Key Vault via public network. You need to set up a [shared private endpoint](./howto-secure-shared-private-endpoints-key-vault.md) to let Azure Web PubSub Service access your Key Vault via private network.

After you create a shared private endpoint, you can create a custom certificate as usual. **You don't have to change the domain in Key Vault URI**. For example, if your Key Vault base URI is `https://contoso.vault.azure.net`, you still use this URI to configure custom certificate.

You don't have to explicitly allow Azure Web PubSub Service IPs in Key Vault firewall settings. For more info, see [Key Vault private link diagnostics](../key-vault/general/private-link-diagnostics.md).

## Next steps

* [How to enable managed identity for Azure Web PubSub Service](howto-use-managed-identity.md)
* [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)
* [What is Azure DNS](../dns/dns-overview.md)