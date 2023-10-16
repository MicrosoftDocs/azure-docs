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

# How to configure a custom domain for Azure SignalR Service

In addition to the default domain provided with Azure SignalR Service, you can also add a custom DNS domain to your service.  In this article, you'll learn how to add a custom domain to your SignalR Service.

> [!NOTE]
> Custom domains is a Premium tier feature. Standard tier resources can be upgraded to Premium tier without downtime.

To configure a custom domain, you need to:

1. Add a custom domain certificate.
1. Create a DNS CNAME record.
1. Add the custom domain.

## Prerequisites

- A custom domain registered through an Azure App Service or a third party registrar.
- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- An Azure Resource Group.
- An Azure SignalR Service resource.
- An Azure Key Vault instance.
- A custom domain SSL certificate stored in your Key Vault instance.  See [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)
- An Azure DNS zone. (Optional)

## Add a custom certificate

Before you can add a custom domain, you need to add a custom SSL certificate. Your SignalR Service accesses the certificate stored in your key vault through a managed identity.

There are three steps to adding a domain certificate.

1. Enable managed identity in your SignalR Service.
1. Give the managed identity access to your key vault.
1. Add a custom certificate to your SignalR Service.

### Enable managed identity in SignalR Service

You can use either a system-assigned or user-assigned managed identity. This article demonstrates using a system-assigned managed identity.

1. In the Azure portal, go to your SignalR service resource.
1. Select **Identity** from the menu on the left.
1. On the **System assigned** table, set **Status** to **On**.

   :::image type="content" alt-text="Screenshot of enabling managed identity." source="media/howto-custom-domain/portal-identity.png" :::

1. Select **Save**, and then select **Yes** when prompted to enable system-assigned managed identity.

Once the identity is created, the **Object (principal) ID** is displayed. SignalR Service will use the object ID of the system-assigned managed identity to access the key vault.  The name of the managed identity is the same as the name of the SignalR Service instance.  In the next section, you'll need to search for the principal (managed identity) using the name or Object ID.


### Give the managed identity access to your key vault

SignalR Service uses a [managed identity](~/articles/active-directory/managed-identities-azure-resources/overview.md) to access your key vault. You must give the managed identity permission to access your key vault. 

The steps to grant permission depends whether you selected *vault access policy* or *Azure role-based access control* as your key vault permission model.

#### [Vault access policy](#tab/vault-access-policy)

If you're using **Vault access policy** as your key vault permission model, follow this procedure to add a new access policy.

1. Go to your key vault resource.
1. Select **Access policies** from the menu on the left.
1. Select **Create**.
    :::image type="content" source="media/howto-custom-domain/portal-key-vault-access-policies.png" alt-text="Screenshot of Key Vault's access policy page.":::
1. In the **Permissions** tab:
    1. Select **Get** under **Secret permissions**.
    1. Select **Get** under **Certificate permissions**.
1. Select **Next** to go to the **Principal** tab.

    :::image type="content" source="media/howto-custom-domain/portal-key-vault-create-access-policy.png" alt-text="Screenshot of Permissions tab of Key Vault's Create an access policy page.":::

1. Enter the Object ID of the managed identity into the search box.
1. Select the managed identity from the search results.
1. Select the **Review + create** tab.

    :::image type="content" source="media/howto-custom-domain/portal-key-vault-create-access-policy-principal.png" alt-text="Screenshot of the Principal tab of Key Vault's Create an access policy page.":::

1. Select **Create** from the **Review + create** tab.

The managed identity for your SignalR Service instance is listed in the access policies table.

:::image type="content" source="media/howto-custom-domain/portal-key-vault-access-policies-created.png" alt-text="Screenshot of Key Vault's Access policies page.":::

#### [Azure role-based access control](#tab/azure-rbac)

When using the **Azure role-based access control** permission model, follow this procedure to assign a role to the SignalR Service managed identity. To complete this procedure, you must be a member of the [Azure built-in **Owner**](~/articles/role-based-access-control/built-in-roles.md#owner) role.

   :::image type="content" alt-text="Screenshot of Azure role-based access control selected as the vault permission model." source="media/howto-custom-domain/portal-key-vault-perm-model-rbac.png" :::

1. Go to your key vault resource.
1. In the menu on the left, select **Access control (IAM)**.
1. Select **Add**. Select **Add role assignment**.

   :::image type="content" alt-text="Screenshot of IAM Add role assignment." source="media/howto-custom-domain/portal-key-vault-iam.png" :::

1. Under the **Role** tab, select **Key Vault Secrets User**. Select **Next**.

   :::image type="content" alt-text="Screenshot of role tab when adding role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-role.png" :::

1. On the **Members** tab, under **Assign access to**, select **Managed identity**.
1. Select **+Select members**. The **Select members** pane will open on the right.
1. Search for the SignalR Service resource name or the user assigned identity name. Select **Select**.

   :::image type="content" alt-text="Screenshot of members tab when adding a role assignment to Key Vault." source="media/howto-custom-domain/portal-key-vault-members.png" :::

1. Select **Review + assign**.

-----

### Add a custom certificate to your SignalR Service

Use the following steps to add the custom certificate to your SignalR Service:

1. In the Azure portal, go to your SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom certificate**, select **Add**.

   :::image type="content" alt-text="Screenshot of custom certificate management." source="media/howto-custom-domain/portal-custom-certificate-management.png" :::

1. Enter a name of the custom certificate.
1. Select **Select from your Key Vault** to choose a key vault certificate. After selection the following **Key Vault Base URI**, **Key Vault Secret Name** should be automatically filled. Alternatively you can also fill in these fields manually.
1. Optionally, you can specify a **Key Vault Secret Version** if you want to pin the certificate to a specific version.
1. Select **Add**.

:::image type="content" alt-text="Screenshot of adding a custom certificate." source="media/howto-custom-domain/portal-custom-certificate-add.png" :::

The SignalR Service will fetch the certificate and validate its content. When it succeeds,  the certificate's **Provisioning State** will be **Succeeded**.

 :::image type="content" alt-text="Screenshot of an added custom certificate." source="media/howto-custom-domain/portal-custom-certificate-added.png" :::

## Create a custom domain CNAME record

You must create a CNAME record for your custom domain in an Azure DNS Zone or with your third-party registrar service.  The CNAME record creates an alias from your custom domain to the default domain of SignalR Service.  The SignalR Service uses the record to validate the ownership of your custom domain.

For example, if your default domain is `contoso.service.signalr.net`, and your custom domain is `contoso.example.com`, you need to create a CNAME record on `example.com`.  

Once you've created the CNAME record, you can perform a DNS lookup to see the CNAME information. 
In example, the output from the linux dig (DNS lookup) command should look similar to this output:

```
 contoso.example.com. 0 IN CNAME contoso.service.signalr.net.
```

If you're using Azure DNS Zone, see [manage DNS records](~/articles/dns/dns-operations-recordsets-portal.md) to learn how to add a CNAME record.

   :::image type="content" alt-text="Screenshot of adding a CNAME record in Azure DNS Zone." source="media/howto-custom-domain/portal-dns-cname.png" :::

If you're using other DNS providers, follow the provider's guide to create a CNAME record.

## Add a custom domain

Now add the custom domain to your SignalR Service.

1. In the Azure portal, go to your SignalR Service resource.
1. In the menu pane, select **Custom domain**.
1. Under **Custom domain**, select **Add**.

   :::image type="content" alt-text="Screenshot of custom domain management." source="media/howto-custom-domain/portal-custom-domain-management.png" :::

1. Enter a name for the custom domain. 
1. Enter the full domain name of your custom domain, for example, `contoso.com`.
1. Select a custom certificate that applies to this custom domain.
1. Select **Add**.

   :::image type="content" alt-text="Screenshot of adding a custom domain." source="media/howto-custom-domain/portal-custom-domain-add.png" :::

## Verify a custom domain

To verify the custom domain, you can use the health API. The health API is a public endpoint that returns the health status of your SignalR Service instance. The health API is available at `https://<your custom domain>/api/health`.

Here's an example using cURL:

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

It should return `200` status code without any certificate error.

## Access Key Vault in private network

If you've configured a [Private Endpoint](../private-link/private-endpoint-overview.md) to your key vault, your SignalR Service won't be able to access your key vault via a public network. You can give your SignalR Service access to your key vault through a private network by creating a [Shared Private Endpoint](./howto-shared-private-endpoints-key-vault.md).

After you create a Shared Private Endpoint, you can add a custom certificate as described in the [Add a custom certificate to your SignalR Service](#add-a-custom-certificate-to-your-signalr-service) section above. 

>[!IMPORTANT]
>**You don't have to change the domain in your key vault URI**. For example, if your key vault base URI is `https://contoso.vault.azure.net`, you'll use this URI to configure a custom certificate.

You don't have to explicitly allow SignalR Service IP addresses in key vault firewall settings. For more info, see [Key Vault private link diagnostics](../key-vault/general/private-link-diagnostics.md).

## Cleanup

If you don't plan to use the resources you've created in this article, you can delete the Resource Group.

>[!CAUTION]
> Deleting the resource group deletes all resources contained within it. If resources outside the scope of this article exist in the specified resource group, they will also be deleted.


## Next steps

+ [How to enable managed identity for Azure SignalR Service](howto-use-managed-identity.md)
+ [Managed identities for Azure SignalR Service](./howto-use-managed-identity.md)
+ [Get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)
+ [What is Azure DNS](../dns/dns-overview.md)