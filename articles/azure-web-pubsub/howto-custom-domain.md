---
title: Add a custom domain
titleSuffix: Azure Web PubSub
description: Learn how to create and configure a custom domain for Azure Web PubSub.
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 08/16/2024
ms.author: dayshen
---

# Add a custom domain

In addition to the default domain that is included in an instance of Azure Web PubSub, you can add a custom domain. A custom domain is a domain name that you own and manage. You can use a custom domain to access your Web PubSub resources. For example, you can use `contoso.example.com` instead of `contoso.webpubsub.azure.com` to access your resources.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub resource at a minimum Premium tier.
* An Azure Key Vault resource.
* A custom certificate matching custom domain that is stored in Azure Key Vault.

## Add a custom certificate

Before you can add a custom domain, add a matching custom certificate. A custom certificate is a resource of your instance of Web PubSub. It references a certificate in your key vault. For security and compliance, Web PubSub doesn't permanently store your certificate. Instead, it fetches the certificate from your key vault and keeps it in memory.

## Access the key vault by using a managed identity

Azure Web PubSub uses a managed identity to access your key vault. To authorize access, it must be granted permissions.

### Create a managed identity

1. In the Azure portal, go to your Web PubSub resource.

1. On the left menu, select **Identity**.

1. Select the type of identity to use: **System assigned** or **User assigned**. To use a user-assigned identity, you create one first.

    To use a system-assigned identity:  

    1. Select **On**.

    1. Select **Yes** to confirm.

    1. Select **Save**.

   :::image type="content" alt-text="Screenshot that shows adding a system-assigned managed identity." source="media\howto-custom-domain\portal-identity.png" :::

    To add a user-assigned identity:  

    1. Select **Add user assigned managed identity**.

    1. Select an existing identity.

    1. Select **Add**.

    :::image type="content" alt-text="Screenshot that shows adding a user-assigned managed identity." source="media\howto-custom-domain\portal-user-assigned-identity.png" :::

1. Select **Save**.

### Give key vault access to the managed identity

Depending on how you configure your Azure Key Vault permissions model, you might need to grant permissions at different locations in the Azure portal.

#### [Key vault access policy](#tab/vault-access-policy)

If you use a key vault built-in access policy as a key vault permissions model:

:::image type="content" alt-text="Screenshot of a built-in access policy selected as the key vault permissions model." source="media\howto-custom-domain\portal-key-vault-perm-model-access-policy.png" :::

1. In the Azure portal, go to your key vault.
1. On the left menu, select **Access configuration**.
1. Select **Vault access policy**.
1. Select **Go to access policies**.
1. Select **Create**.
1. On the **Create an access policy** pane, select the **Permissions** tab.
1. For **Secret permissions**, select **Get**.
1. For **Certificate permissions**, select **Get**.
1. Select **Next**.

   :::image type="content" alt-text="Screenshot of permissions selection in a key vault." source="media\howto-custom-domain\portal-key-vault-permissions.png" :::

1. Search for the Web PubSub resource name.
1. Select **Next**.

   :::image type="content" alt-text="Screenshot of principal selection in a key vault." source="media\howto-custom-domain\portal-key-vault-principal.png" :::

1. Select the **Application** tab, and then select **Next**.
1. Select **Create**.

#### [Azure role-based access control](#tab/azure-rbac)

If you use Azure role-based access control (Azure RBAC) as a key vault permissions model:

:::image type="content" alt-text="Screenshot of Azure RBAC selected as the key vault permissions model." source="media\howto-custom-domain\portal-key-vault-perm-model-rbac.png" :::

1. In the Azure portal, go to your key vault.
1. On the left menu, select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.

   :::image type="content" alt-text="Screenshot that shows the key vault Access control pane." source="media\howto-custom-domain\portal-key-vault-iam.png" :::

1. Select the **Role** tab, and then select **Key Vault Secrets User**. Select **Next**.

   :::image type="content" alt-text="Screenshot that shows the Role tab when adding a role assignment to a key vault." source="media\howto-custom-domain\portal-key-vault-role.png" :::

1. Select the **Members** tab, and then select **Managed identity**.
1. Search for and then select the Web PubSub resource name or the name of the user-assigned identity.

   :::image type="content" alt-text="Screenshot that shows the Members tab when adding a role assignment to a key vault." source="media\howto-custom-domain\portal-key-vault-members.png" :::

1. Select **Next**.
1. Select **Review + assign**.

-----

### Create a custom certificate

1. In the Azure portal, go to your Web PubSub resource.
1. On the left menu, select **Custom domain**.
1. On the **Custom certificate** pane, select **Add**.

   :::image type="content" alt-text="Screenshot that shows managing a custom certificate." source="media\howto-custom-domain\portal-custom-certificate-management.png" :::

1. Enter a name for the custom certificate.
1. Choose **Select from your Key Vault** to choose a key vault certificate. After you select a key vault, values for **Key Vault Base URI** and **Key Vault Secret Name** are automatically added. You also have to option to edit these fields manually.
1. (Optional) To pin the certificate to a specific version, enter a value for **Key Vault Secret Version**.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a custom certificate." source="media\howto-custom-domain\portal-custom-certificate-add.png" :::

Web PubSub fetches the certificate and validates its contents. When certificate validation succeeds, **Provisioning State** for the certificate is **Succeeded**.

:::image type="content" alt-text="Screenshot that shows an added custom certificate." source="media\howto-custom-domain\portal-custom-certificate-added.png" :::

## Create a custom domain CNAME

To validate the ownership of your custom domain, create a CNAME record for the custom domain and point it to the default domain of your Web PubSub resource.

For example, if your default domain is `contoso.webpubsub.azure.com` and your custom domain is `contoso.example.com`, create a CNAME record on `example.com` like in this example:

`contoso.example.com. 0 IN CNAME contoso.webpubsub.azure.com`

If you use Azure DNS Zone, to learn how to add a CNAME record, see [Manage DNS records](../dns/dns-operations-recordsets-portal.md).

:::image type="content" alt-text="Screenshot that shows adding a CNAME record in Azure DNS Zone." source="media\howto-custom-domain\portal-dns-cname.png" :::

If you use other DNS providers, follow guidance in the provider's documentation to create a CNAME record.

## Add a custom domain to Web PubSub

A custom domain is another sub resource of your Web PubSub instance. It contains all configurations that are required for a custom domain.

1. In the Azure portal, go to your Web PubSub resource.
1. On the left menu, select **Custom domain**.
1. On the **Custom domain** pane, select **Add**.

   :::image type="content" alt-text="Screenshot that shows custom domain management." source="media\howto-custom-domain\portal-custom-domain-management.png" :::

1. Enter a name for the custom domain. Use the sub resource name.
1. Enter the domain name. Use the full domain name of your custom domain, for example, `contoso.com`.
1. Select a custom certificate that applies to this custom domain.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a custom domain." source="media\howto-custom-domain\portal-custom-domain-add.png" :::

## Verify your custom domain

You can now access your Web PubSub endpoint by using the custom domain.

To verify the domain, you can access the Health API. The following examples use cURL.

#### [PowerShell](#tab/azure-powershell)

```azurepowershell
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

The Health API should return a `200` status code without any certificate errors.

## Configure a private network key vault

If you configure a [private endpoint](../private-link/private-endpoint-overview.md) to your key vault, Web PubSub can't access the key vault by using a public network. You must set up a [shared private endpoint](./howto-secure-shared-private-endpoints-key-vault.md) to give Web PubSub access to your key vault via a private network.

After you create a shared private endpoint, you can create a custom certificate as usual. You *don't have to change the domain in the key vault URI*. For example, if your key vault base URI is `https://contoso.vault.azure.net`, continue to use this URI to configure a custom certificate.

You don't have to explicitly allow Web PubSub IP addresses in your key vault firewall settings. For more information, see [Key vault private link diagnostics](/azure/key-vault/general/private-link-diagnostics).

## Rotate the certificate

If you don't specify a secret version when you create a custom certificate, Web PubSub periodically checks for the latest version in the key vault. When a new version is detected, it's automatically applied. The delay is typically less than an hour.

Alternatively, you can pin a custom certificate to a specific secret version in your key vault. When you need to apply a new certificate, you can edit the secret version, and then update the custom certificate proactively.

## Related content

* [Turn on managed identity for Azure Web PubSub](howto-use-managed-identity.md)
* [Get started with Azure Key Vault certificates](/azure/key-vault/certificates/certificate-scenarios)
* [What is Azure DNS?](../dns/dns-overview.md)
