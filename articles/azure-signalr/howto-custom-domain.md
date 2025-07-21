---
title: Configure a Custom Domain for Azure SignalR Service
titleSuffix: Azure SignalR Service
description: Learn how to configure a custom domain for Azure SignalR Service.
services: signalr
author: ArchangelSDY
ms.service: azure-signalr-service
ms.topic: how-to
ms.date: 08/15/2022
ms.author: dayshen
---

# Configure a custom domain for Azure SignalR Service

In addition to the default domain provided with Azure SignalR Service, you can also add a custom Domain Name System (DNS) domain to your service. In this article, you learn how to add a custom domain to your Azure SignalR Service resource.

## Prerequisites

- A custom domain registered through Azure App Service or a non-Microsoft registrar.
- An Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/).
- An Azure resource group.
- An Azure SignalR Service resource.
- An Azure Key Vault instance.
- A custom domain TLS/SSL certificate stored in your Key Vault instance. For more information, see [Get started with Key Vault certificates](/azure/key-vault/certificates/certificate-scenarios).
- An Azure DNS zone (optional).

## Add a custom certificate

Before you can add a custom domain, you need to add a custom TLS/SSL certificate. Your Azure SignalR Service resource accesses the certificate stored in your key vault through a managed identity.

> [!NOTE]
> The custom domains feature is a Premium tier feature. You can upgrade Standard tier resources to Premium tier without downtime.

### Enable managed identity in an Azure SignalR Service

You can use either a system-assigned or user-assigned managed identity. This article demonstrates how to use a system-assigned managed identity.

1. In the Azure portal, go to your Azure SignalR Service resource.
1. On the left pane, select **Identity**.
1. On the **System assigned** table, set **Status** to **On**.

   :::image type="content" alt-text="Screenshot that shows enabling managed identity." source="media/howto-custom-domain/portal-identity.png" :::

1. Select **Save**. When you're prompted to enable system-assigned managed identity, select **Yes**.

After the identity is created, the object (principal) ID appears. Azure SignalR Service uses the object ID of the system-assigned managed identity to access the key vault. The name of the managed identity is the same as the name of the Azure SignalR Service instance. In the next section, you search for the principal (managed identity) by using the name or object ID.

### Give the managed identity access to your key vault

Azure SignalR Service uses a [managed identity](~/articles/active-directory/managed-identities-azure-resources/overview.md) to access your key vault. You must give the managed identity permission to access your key vault.

The steps to grant permission depend on whether you selected **Vault access policy** or **Azure role-based access control** as your key vault permission model.

#### [Vault access policy](#tab/vault-access-policy)

If you're using **Vault access policy** as your key vault permission model, follow this procedure to add a new access policy.

1. Go to your key vault resource.
1. On the left pane, select **Access policies**.
1. Select **Create**.

    :::image type="content" source="media/howto-custom-domain/portal-key-vault-access-policies.png" alt-text="Screenshot that shows the Key Vault Access policies page.":::

1. On the **Permissions** tab:
    1. Under **Secret permissions**, select **Get**.
    1. Under **Certificate permissions**, select **Get**.
1. Select **Next** to go to the **Principal** tab.

    :::image type="content" source="media/howto-custom-domain/portal-key-vault-create-access-policy.png" alt-text="Screenshot that shows the Permissions tab of the Key Vault Create an access policy page.":::

1. Enter the object ID of the managed identity in the search box.
1. Select the managed identity from the search results.
1. Select the **Review + create** tab.

    :::image type="content" source="media/howto-custom-domain/portal-key-vault-create-access-policy-principal.png" alt-text="Screenshot that shows the Principal tab of the Key Vault Create an access policy page.":::

1. On the **Review + create** tab, select **Create**.

   The managed identity for your Azure SignalR Service instance is listed in the access policies table.

   :::image type="content" source="media/howto-custom-domain/portal-key-vault-access-policies-created.png" alt-text="Screenshot that shows the Key Vault Access policies table.":::

#### [Azure role-based access control](#tab/azure-rbac)

When you use Azure role-based access control as your permission model, follow this procedure to assign a role to the Azure SignalR Service managed identity. To complete this procedure, you must be a member of the [Azure built-in Owner](~/articles/role-based-access-control/built-in-roles.md#owner) role.

   :::image type="content" alt-text="Screenshot that shows Azure role-based access control selected as the vault permission model." source="media/howto-custom-domain/portal-key-vault-perm-model-rbac.png" :::

1. Go to your Key Vault resource.
1. On the left pane, select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.

   :::image type="content" alt-text="Screenshot that shows the IAM Add role assignment option." source="media/howto-custom-domain/portal-key-vault-iam.png" :::

1. On the **Role** tab, select **Key Vault Secrets User** and then select **Next**.

   :::image type="content" alt-text="Screenshot that shows the Role tab when you add a role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-role.png" :::

1. On the **Members** tab, under **Assign access to**, select **Managed identity**.
1. Choose **+ Select members** to open the **Select managed identities** pane.
1. Search for the Azure SignalR Service resource name or the user-assigned identity name. Choose **Select**.

   :::image type="content" alt-text="Screenshot that shows the Members tab when you add a role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-members.png" :::

1. Select **Review + assign**.

-----

### Add a custom certificate to your Azure SignalR Service resource

To add the custom certificate to your Azure SignalR Service resource, follow these steps:

1. In the Azure portal, go to your Azure SignalR Service resource.
1. On the left pane, select **Custom domain**.
1. Under **Custom certificate**, select **Add**.

   :::image type="content" alt-text="Screenshot that shows custom certificate management." source="media/howto-custom-domain/portal-custom-certificate-management.png" :::

1. Enter a name of the custom certificate.
1. To choose a Key Vault certificate, choose **Select from your Key Vault**. After you make your selection, **Key Vault Base URI** and **Key Vault Secret Name** fill automatically. Alternatively, fill in the fields manually.
1. Optionally, you can specify a value for **Key Vault Secret Version** if you want to pin the certificate to a specific version.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a custom certificate." source="media/howto-custom-domain/portal-custom-certificate-add.png" :::

   Azure SignalR Service fetches the certificate and validates its content. When it succeeds, **Provisioning State** shows **Succeeded** for the certificate.

    :::image type="content" alt-text="Screenshot that shows an added custom certificate." source="media/howto-custom-domain/portal-custom-certificate-added.png" :::

## Create a custom domain CNAME record

You must create a `CNAME` record for your custom domain in an Azure DNS zone or with your non-Microsoft registrar service. The `CNAME` record creates an alias from your custom domain to the default domain of Azure SignalR Service. Azure SignalR Service uses the record to validate the ownership of your custom domain.

For example, if your default domain is `contoso.service.signalr.net` and your custom domain is `contoso.example.com`, you need to create a `CNAME` record on `example.com`.

After you create the `CNAME` record, you can perform a DNS lookup to see the `CNAME` information. In the example, the output from the `linux dig` (DNS lookup) command looks similar to this output:

```
 contoso.example.com. 0 IN CNAME contoso.service.signalr.net.
```

If you're using an Azure DNS zone, see [Manage DNS records](~/articles/dns/dns-operations-recordsets-portal.md) to learn how to add a `CNAME` record.

   :::image type="content" alt-text="Screenshot that shows adding a CNAME record in an Azure DNS zone." source="media/howto-custom-domain/portal-dns-cname.png" :::

If you're using other DNS providers, follow the provider's guide to create a `CNAME` record.

## Add a custom domain

Now add the custom domain to your Azure SignalR Service resource.

1. In the Azure portal, go to your Azure SignalR Service resource.
1. On the left pane, select **Custom domain**.
1. Under **Custom domain**, select **Add**.

   :::image type="content" alt-text="Screenshot that shows custom domain management." source="media/howto-custom-domain/portal-custom-domain-management.png" :::

1. Enter a name for the custom domain.
1. Enter the full domain name of your custom domain. For example, use **contoso.com**.
1. Select a custom certificate that applies to this custom domain.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot that shows adding a custom domain." source="media/howto-custom-domain/portal-custom-domain-add.png" :::

## Verify a custom domain

To verify the custom domain, you can use the health API. The health API is a public endpoint that returns the health status of your Azure SignalR Service instance. The health API is available at `https://<your custom domain>/api/health`.

Here's an example that uses cURL:

#### [PowerShell](#tab/azure-powershell)

```powershell
PS C:\> curl.exe -v https://contoso.example.com/api/health
...
> GET /api/health HTTP/1.1
> Host: contoso.example.com

< HTTP/1.1 200 OK
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
```

-----

It should return the `200` status code without any certificate error.

## Access Key Vault in a private network

If you configured a [private endpoint](../private-link/private-endpoint-overview.md) to your key vault, Azure SignalR Service can't access your key vault via a public network. You can give Azure SignalR Service access to your key vault through a private network by creating a [shared private endpoint](./howto-shared-private-endpoints-key-vault.md).

After you create a shared private endpoint, add a custom certificate. For more information, see [Add a custom certificate to Azure SignalR Service resource](#add-a-custom-certificate-to-your-azure-signalr-service-resource).

>[!IMPORTANT]
>You don't have to change the domain in your key vault URI. For example, if your key vault base URI is `https://contoso.vault.azure.net`, you use this URI to configure a custom certificate.

You don't have to explicitly allow Azure SignalR Service IP addresses in your key vault firewall settings. For more information, see [Key Vault private link diagnostics](/azure/key-vault/general/private-link-diagnostics).

## Certificate rotation

If you don't specify a secret version when you create a custom certificate, Azure SignalR Service periodically checks the latest version in Key Vault. When a new version is observed, it's automatically applied. The delay is usually within one hour.

Alternatively, you can pin a custom certificate to a specific secret version in Key Vault. When you need to apply a new certificate, you can edit the secret version and then update the custom certificate proactively.

## Clean up resources

If you don't plan to use the resources you created in this article, you can delete the resource group.

>[!CAUTION]
> Deleting the resource group deletes all resources contained within it. If resources outside the scope of this article exist in the specified resource group, they're also deleted.

## Related content

+ [Enable managed identity for Azure SignalR Service](howto-use-managed-identity.md)
+ [Managed identities for Azure SignalR Service](./howto-use-managed-identity.md)
+ [Get started with Key Vault certificates](/azure/key-vault/certificates/certificate-scenarios)
+ [What is Azure DNS](../dns/dns-overview.md)
