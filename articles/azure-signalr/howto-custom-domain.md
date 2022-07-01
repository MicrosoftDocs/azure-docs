---
title: Configure a custom domain for Azure SignalR Service
titleSuffix: Azure SignalR Service
description: How to configure a custom domain for Azure SignalR Service
services: signalr
author: ArchangelSDY
ms.service: signalr
ms.topic: article
ms.date: 02/15/2022
ms.author: dayshen
---

# Configure a custom domain for Azure SignalR Service

In addition to the default domain provided Azure SignalR Service, you can also add custom domains.

## Prerequisites

* Resource must be Premium tier
* A custom certificate matching custom domain is stored in Azure Key Vault

## Add a custom certificate

Before you can add a custom domain, you need add a matching custom certificate first. A custom certificate is a sub resource of your Azure SignalR Service. It references a certificate in your Azure Key Vault. For security and compliance reasons, Azure SignalR Service doesn't permanently store your certificate. Instead it fetches it from your Key Vault on the fly and keeps it in memory.

### Step 1: Grant your Azure SignalR Service resource access to Key Vault

Azure SignalR Service uses Managed Identity to access your Key Vault. In order to authorize, it needs to be granted permissions.

1. In the Azure portal, go to your Azure SignalR Service resource.
1. In the menu pane, select **Identity**.
1. Turn on either **System assigned** or **User assigned** identity. Click **Save**.

   :::image type="content" alt-text="Screenshot of enabling managed identity." source="media\howto-custom-domain\portal-identity.png" :::

1. Go to your Key Vault resource.
1. In the menu pane, select **Access configuration**. Click **Go to access policies**.
1. Click **Create**. Select **Secret Get** permission and **Certificate Get** permission. Click **Next**.

   :::image type="content" alt-text="Screenshot of permissions selection in Key Vault." source="media\howto-custom-domain\portal-key-vault-permissions.png" :::

1. Search for the Azure SignalR Service resource name or the user assigned identity name. Click **Next**.

   :::image type="content" alt-text="Screenshot of principal selection in Key Vault." source="media\howto-custom-domain\portal-key-vault-principal.png" :::

1. Skip **Application (optional)**. Click **Next**.
1. In **Review + create**, click **Create**.

### Step 2: Create a custom certificate

1. In the Azure portal, go to your Azure SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom certificate**, click **Add**.

   :::image type="content" alt-text="Screenshot of custom certificate management." source="media\howto-custom-domain\portal-custom-certificate-management.png" :::

1. Fill in a name for the custom certificate.
1. Click **Select from your Key Vault** to choose a Key Vault certificate. After selection the following **Key Vault Base URI**, **Key Vault Secret Name** should be automatically filled. Alternatively you can also fill in these fields manually.
1. Optionally, you can specify a **Key Vault Secret Version** if you want to pin the certificate to a specific version.
1. Click **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom certificate." source="media\howto-custom-domain\portal-custom-certificate-add.png" :::

Azure SignalR Service will then fetch the certificate and validate its content. If everything is good, the **Provisioning State** will be **Succeeded**.

   :::image type="content" alt-text="Screenshot of an added custom certificate." source="media\howto-custom-domain\portal-custom-certificate-added.png" :::

## Create a custom domain CNAME

To validate the ownership of your custom domain, you need to create a CNAME record for the custom domain and point it to the default domain of Azure SignalR Service.

For example, if your default domain is `contoso.service.signalr.net`, and your custom domain is `contoso.example.com`, you need to create a CNAME record on `example.com` like:

```
contoso.example.com. 0 IN CNAME contoso.service.signalr.net.
```

If you're using Azure DNS Zone, see [manage DNS records](../dns/dns-operations-recordsets-portal.md) for how to add a CNAME record.

   :::image type="content" alt-text="Screenshot of adding a CNAME record in Azure DNS Zone." source="media\howto-custom-domain\portal-dns-cname.png" :::

If you're using other DNS providers, follow provider's guide to create a CNAME record.

## Add a custom domain

A custom domain is another sub resource of your Azure SignalR Service. It contains all configurations for a custom domain.

1. In the Azure portal, go to your Azure SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom domain**, click **Add**.

   :::image type="content" alt-text="Screenshot of custom domain management." source="media\howto-custom-domain\portal-custom-domain-management.png" :::

1. Fill in a name for the custom domain. It's the sub resource name.
1. Fill in the domain name. It's the full domain name of your custom domain, for example, `contoso.com`.
1. Select a custom certificate that applies to this custom domain.
1. Click **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom domain." source="media\howto-custom-domain\portal-custom-domain-add.png" :::

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
+ [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)
+ [What is Azure DNS](../dns/dns-overview.md)