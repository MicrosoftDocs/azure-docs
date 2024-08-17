---
title: Configure a custom domain for Azure Web PubSub
titleSuffix: Azure Web PubSub Service
description: Learn how to configure a custom domain for Azure Web PubSub.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 03/30/2023
ms.author: dayshen
---

# Configure a custom domain for Azure Web PubSub

In addition to the default domain that the Azure Web PubSub service provides, you can add a custom domain. A custom domain is a domain name that you own and manage. You can use a custom domain to access your Web PubSub resource. For example, you can use `contoso.example.com` instead of `contoso.webpubsub.azure.com` to access your Azure Web PubSub resource.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub service (must be minimum Premium tier).
* An Azure Key Vault resource.
* A custom certificate matching custom domain that is stored in Azure Key Vault.

## Add a custom certificate

Before you can add a custom domain, add a matching custom certificate. A custom certificate is a resource of your instance of Web PubSub. It references a certificate in your key vault. For security and compliance, Web PubSub doesn't permanently store your certificate. Instead, it fetches the certificate from your key vault and keeps it in memory.

### Step 1: Grant your Web PubSub resource access to Key Vault

Azure Web PubSub Service uses Managed Identity to access your Key Vault. In order to authorize, it needs to be granted permissions.

1. In the Azure portal, go to your Azure Web PubSub resource.
1. On the left pane, select **Identity**.

1. Select the type of identity you want to use: **System assigned** or **User assigned**. To use a user-assigned identity, first you create one.

    To use a system-assigned identity:

    1. Select **On**.
    1. Select **Yes** to confirm.
    1. Select **Save**.

   :::image type="content" alt-text="Screenshot of enabling system assigned managed identity." source="media\howto-custom-domain\portal-identity.png" :::

    To use a user-assigned identity:

    1. Select **Add user assigned managed identity**.
    1. Select an existing identity.
    1. Select **Add**.

    :::image type="content" alt-text="Screenshot of enabling user assigned managed identity." source="media\howto-custom-domain\portal-user-assigned-identity.png" :::

1. Select **Save**.

Depending on how you configure your Azure Key Vault permissions model, you might need to grant permissions at different locations in the Azure portal.

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

1. Search for the Azure Web PubSub resource name.
1. Select **Next**.

   :::image type="content" alt-text="Screenshot of principal selection in Key Vault." source="media\howto-custom-domain\portal-key-vault-principal.png" :::

1. Select **Next** on the **Application** tab.
1. Select **Create**.

#### [Azure role-based access control](#tab/azure-rbac)

If you're using Azure role-based access control as Key Vault permission model:

   :::image type="content" alt-text="Screenshot of Azure RBAC selected as Key Vault permission model." source="media\howto-custom-domain\portal-key-vault-perm-model-rbac.png" :::

1. Go to your Key Vault resource.
1. On the left menu, select **Go to access control (IAM)**.
1. Select **Add** > **Add role assignment**.

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

Azure Web PubSub Service fetches the certificate and validates its contents. When it succeeds, the certificate's **Provisioning State** is **Succeeded**.

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

You can now access your Web PubSub endpoint by using the custom domain.

To verify the domain, you can access the health API. Here's an example that uses cURL:

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

The health API should return a `200` status code without any certificate errors.

## Private network key vault

If you configure a [private endpoint](../private-link/private-endpoint-overview.md) to your key vault, Web PubSub can't access the key vault by using a public network. You must set up a [shared private endpoint](./howto-secure-shared-private-endpoints-key-vault.md) to let Web PubSub access your key vault via a private network.

After you create a shared private endpoint, you can create a custom certificate as usual. *You don't have to change the domain in the key vault URI.* For example, if your key vault base URI is `https://contoso.vault.azure.net`, you still use this URI to configure a custom certificate.

You don't have to explicitly allow Web PubSub IP addresses in your key vault firewall settings. For more information, see [Key Vault private link diagnostics](/azure/key-vault/general/private-link-diagnostics).

## Certificate rotation

If you don't specify a secret version when you create custom certificate, Web PubSub periodically checks latest version in Key Vault. When a new version is detected, it's automatically applied. The delay is usually within an hour.

Alternatively, you can also pin a custom certificate to a specific secret version in your key vault. When you need to apply a new certificate, you can edit the secret version, and then update the custom certificate proactively.

## Related content

* [Enable managed identity for Azure Web PubSub](howto-use-managed-identity.md)
* [Get started with Azure Key Vault certificates](/azure/key-vault/certificates/certificate-scenarios)
* [What is Azure DNS?](../dns/dns-overview.md)
