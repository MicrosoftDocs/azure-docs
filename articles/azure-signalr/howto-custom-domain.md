---
title: Configure a custom domain for Azure SignalR Service
titleSuffix: Azure SignalR Service
description: How to configure a custom domain for Azure SignalR Service
services: signalr
author: ArchangelSDY
ms.service: signalr
ms.topic: how-to
ms.date: 08/15/2022
ms.author: dayshen
---

# Configure a custom domain for Azure SignalR Service

In addition to the default domain provided Azure SignalR Service, you can also add custom domains.

> [!NOTE]
> Custom domains is a Premium tier feature. Standard tier resources can be upgraded to Premium tier without downtime.

## Add a custom certificate

You need to add a custom certificate before you can add a custom domain. A custom certificate is a resource of your SignalR Service. It references a certificate stored in your Azure Key Vault. For security and compliance reasons, SignalR Service doesn't permanently store your certificate. Instead it fetches the certificate from your key vault on the fly and keeps it in memory.

There are four steps to adding a custom certificate.

1. Enable managed identity in SignalR Service.
1. Give the SignalR Service managed identity permission to access the key vault.
1. Store a certificate in your key vault.
1. Add a custom certificate in SignalR Service.

### Enable managed identity in SignalR Service

1. In the Azure portal, go to your SignalR Service resource.
1. In the menu pane on the left, select **Identity**.
1. We'll use a system assigned identity to simplify this procedure, but you can configure a user assigned identity here if you want. On the **System assigned** table, set **Status** to **On**.
   :::image type="content" alt-text="Screenshot of enabling managed identity." source="media/howto-custom-domain/portal-identity.png" :::
1. Select **Save**, and then select **Yes** when prompted to enable system assigned managed identity.

It will take a few moments for the managed identity to be created. When configuration is complete, the screen will show an **Object (principal) ID**. The object ID is the ID of the system-assigned managed identity SignalR Service will use to access the key vault. The name of the managed identity is the same as the name of the SignalR Service instance. In the next step, you'll need to search for the principal (managed identity) using the name or Object ID.

### Grant your SignalR Service resource access to Key Vault

SignalR Service uses a [managed identity](~/articles/active-directory/managed-identities-azure-resources/overview.md) to access your key vault. The managed identity used by SignalR Service has to be given permission to access your key vault. The way you grant permission depends on your key vault permission model.

#### [Vault access policy](#tab/vault-access-policy)

If you're using **Vault access policy** as the key vault permission model, follow this procedure to add a new access policy.

1. Go to your key vault resource.
1. In the menu pane, under **Settings** select **Access policies**.

   :::image type="content" alt-text="Screenshot of Vault access policy selected as the vault permission model." source="media/howto-custom-domain/portal-key-vault-perm-model-access-policy.png" :::

1. In the **Add access policy** screen, select **Add access policy**. In the **Secret permissions** dropdown list, select  **Get** permission. In the **Certificate permissions** dropdown list, select **Get** permission.

   :::image type="content" alt-text="Screenshot of Add access policy dialog." source="media/howto-custom-domain/portal-key-vault-permissions.png" :::

1. Under **Select principal**, select **None selected**. The **Principal** pane will appear to the right. Search for the Azure SignalR Service resource name. Select **Select**.

   :::image type="content" alt-text="Screenshot of principal selection in Key Vault." source="media/howto-custom-domain/portal-key-vault-principal.png" :::

1. Select **Add**.

#### [Azure role-based access control](#tab/azure-rbac)

If you're using the **Azure role-based access control** permission model, follow this procedure to assign a role to the SignalR Service managed identity. You must be a member of the [Azure built-in **Owner**](~/articles/role-based-access-control/built-in-roles.md#owner) role to complete this procedure.

   :::image type="content" alt-text="Screenshot of Azure role-based access control selected as the vault permission model." source="media/howto-custom-domain/portal-key-vault-perm-model-rbac.png" :::

1. Go to your key vault resource.
1. In the menu on the left, select **Access control (IAM)**.
1. Select **Add**. Select **Add role assignment**.

   :::image type="content" alt-text="Screenshot of IAM Add role assignment." source="media/howto-custom-domain/portal-key-vault-iam.png" :::

1. Under the **Role** tab, select **Key Vault Secrets User**. Select **Next**.

   :::image type="content" alt-text="Screenshot of role tab when adding role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-role.png" :::

1. On the **Members** tab, under **Assign access to**, select **Managed identity**.
1. Select **+Select members**. The **Select members** pane will open on the right.
1. Search for the Azure SignalR Service resource name or the user assigned identity name. Select **Select**.

   :::image type="content" alt-text="Screenshot of members tab when adding a role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-members.png" :::

1. Select **Review + assign**.

-----

### Create a custom certificate

1. In the Azure portal, go to your Azure SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom certificate**, select **Add**.

   :::image type="content" alt-text="Screenshot of custom certificate management." source="media/howto-custom-domain/portal-custom-certificate-management.png" :::

1. Fill in a name for the custom certificate.
1. Select **Select from your Key Vault** to choose a Key Vault certificate. After selection the following **Key Vault Base URI**, **Key Vault Secret Name** should be automatically filled. Alternatively you can also fill in these fields manually.
1. Optionally, you can specify a **Key Vault Secret Version** if you want to pin the certificate to a specific version.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom certificate." source="media/howto-custom-domain/portal-custom-certificate-add.png" :::

Azure SignalR Service will then fetch the certificate and validate its content. If everything is good, the **Provisioning State** will be **Succeeded**.

   :::image type="content" alt-text="Screenshot of an added custom certificate." source="media/howto-custom-domain/portal-custom-certificate-added.png" :::

## Create a custom domain CNAME

To validate the ownership of your custom domain, you need to create a CNAME record for the custom domain and point it to the default domain of SignalR Service.

For example, if your default domain is `contoso.service.signalr.net`, and your custom domain is `contoso.example.com`, you need to create a CNAME record on `example.com`.

```
contoso.example.com. 0 IN CNAME contoso.service.signalr.net.
```

If you're using Azure DNS Zone, see [manage DNS records](~/articles/dns/dns-operations-recordsets-portal.md) for how to add a CNAME record.

   :::image type="content" alt-text="Screenshot of adding a CNAME record in Azure DNS Zone." source="media/howto-custom-domain/portal-dns-cname.png" :::

If you're using other DNS providers, follow provider's guide to create a CNAME record.

## Add a custom domain

A custom domain is another sub resource of your Azure SignalR Service. It contains the configuration for a custom domain.

1. In the Azure portal, go to your Azure SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom domain**, select **Add**.

   :::image type="content" alt-text="Screenshot of custom domain management." source="media/howto-custom-domain/portal-custom-domain-management.png" :::

1. Fill in a name for the custom domain. 
1. Fill in the full domain name of your custom domain, for example, `contoso.com`.
1. Select a custom certificate that applies to this custom domain.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom domain." source="media/howto-custom-domain/portal-custom-domain-add.png" :::

## Verify a custom domain

You can now access your Azure SignalR Service endpoint via the custom domain. To verify it, you can access the health API.

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

It should return `200` status code without any certificate error.

## Next steps

+ [How to enable managed identity for Azure SignalR Service](howto-use-managed-identity.md)
+ [Managed identities for Azure SignalR Service](./howto-use-managed-identity.md)
+ [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)
+ [What is Azure DNS](../dns/dns-overview.md)