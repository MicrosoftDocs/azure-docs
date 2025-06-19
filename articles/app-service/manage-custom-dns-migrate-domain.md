---
title: Migrate an Active Domain
description: Learn how to migrate your active domain to Azure App Service and maintain seamless connectivity for your app users.
keywords: domain migration, Azure App Service, move domain, custom domain transfer
tags: top-support-issue
author: msangapu-msft
ms.author: msangapu
ms.assetid: 10da5b8a-1823-41a3-a2ff-a0717c2b5c2d
ms.topic: how-to
ms.date: 02/14/2025
---
# Migrate an existing domain to Azure App Service

This article shows you how to migrate an active DNS name to [Azure App Service](../app-service/overview.md) without any downtime.

When you migrate a live site and its DNS domain name to App Service, that DNS name is already serving live traffic. You can avoid downtime in DNS resolution during the migration by preemptively binding the active DNS name to your App Service app.

If you're not concerned about downtime in DNS resolution, see [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md).

## Prerequisites

To complete the steps, [make sure that your App Service app isn't in the Free tier](manage-scale-up.md#scale-up-your-pricing-tier).

## 1. Get a domain verification ID

When you preemptively bind a custom domain, you accomplish both of the following before making any changes to
your existing DNS records:

- Verify domain ownership by adding a domain verification ID with your domain provider.
- Enable the domain name in your App Service app.

When you later migrate your custom DNS name from the old site to the App Service app, there will be no downtime in DNS resolution.

1. In the [Azure portal](https://portal.azure.com), open the management pane of the App Service app.

1. In the left pane of your app page, select **Custom domains**.
1. From the **Custom domains** pane, copy the ID in the **Custom Domain Verification ID** box. You use this ID in later steps.

    :::image type="content" source="./media/manage-custom-dns-migrate-domain/get-domain-verification-id.png" alt-text="Screenshot that shows the ID in the Custom Domain Verification ID box." border="true":::

## 2. Create the DNS records

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

Add a `TXT record` for domain verification. The host name for the `TXT record` depends on the type of DNS record that you want to map. See the following table (`@` typically represents the root domain):

| DNS record example | TXT host | TXT value |
| - | - | - |
| `\@` (root) | `_asuid_` | Domain verification ID shown in the **Custom domains** management pane |
| `www` (sub) | `_asuid.www_` | Domain verification ID shown in the **Custom domains** management pane |
| `\*` (wildcard) | `_asuid_` | Domain verification ID shown in the **Custom domains** management pane |

> [!NOTE]
> Wildcard `*` records don't validate subdomains with an existing `CNAME record`. You might need to explicitly create a `TXT record` for each subdomain.

## 3. Enable the domain for your app

1. On the **Custom domains** pane, select **Add custom domain**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/add-custom-domain.png" alt-text="A screenshot that shows how to open the Add custom domain dialog." border="true":::

1. To configure a third-party domain, in **Domain provider**, select **All other domain services**.

1. For **TLS/SSL certificate**, select **Add certificate later**. You can add an App Service managed certificate after you complete the domain migration.

1. For **TLS/SSL type**, select the binding type you want.

    [!INCLUDE [Certificate binding types](../../includes/app-service-ssl-binding-types.md)]

1. Type the fully qualified domain name that you want to migrate and that corresponds to the `TXT record` that you created. For example: `contoso.com`, `www.contoso.com`, or `*.contoso.com`.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/configure-custom-domain-preempt.png" alt-text="A screenshot that shows how to configure a new custom domain, along with a managed certificate." border="true":::

1. Select **Validate**. Although the dialog shows two records that you need for your app's custom domain to function, the validation passes with just the domain verification ID (the `TXT record`).

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/configure-custom-domain-validate.png" alt-text="A screenshot that shows how to validate your DNS record settings in the Add a custom domain dialog." border="true":::

1. If the **Domain validation** section shows green check marks, then you configured the domain verification ID correctly. Select **Add**. If it shows any red X marks, fix the errors on your domain provider's website.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/configure-custom-domain-preempt-add.png" alt-text="A screenshot that shows the Add button activated after validation." border="true":::

1. You should see the custom domain in the list. You might also see a red X with **No binding**.

    Because you selected **Add certificate later**, you see a red X with **No binding**. It remains until you [add a private certificate for the domain](configure-ssl-certificate.md) and [configure the binding](configure-ssl-bindings.md).

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/add-custom-domain-preempt-complete.png" alt-text="A screenshot that shows the custom domains page with the new secured custom domain." border="true":::

    > [!NOTE]
    > Unless you configure a certificate binding for your custom domain, any HTTPS request from a browser to the domain receives an error or warning, depending on the browser.
    
<a name="info"></a>

## 4. Remap the active DNS name

Remap your active DNS record to point to App Service. Until this step is complete, it still points to your old site.

1. `A record` only: Get the App Service app's external IP address. On the **Custom domains** pane, copy the app's IP address.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/mapping-information-migrate.png" alt-text="A screenshot that shows how to copy the App Service app's external IP address." border="true":::

1. On the DNS records pane of your domain provider, select the DNS record to remap.

1. Remap the `A` or `CNAME record` like the examples in the following table:
    
    | FQDN example | Record type | Host | Value |
    | - | - | - | - |
    | `contoso.com` (root) | `A` | `@` | IP address from [Copy the app's IP address](#info) |
    | `www\.contoso.com` (sub) | `CNAME` | `www` | `_&lt;app-name>.azurewebsites.net_` |
    | `\*.contoso.com` (wildcard) | `CNAME` | `_\*_` | `_&lt;app-name>.azurewebsites.net_` |
    
1. Save your settings.

DNS queries should start resolving to your App Service app immediately after DNS propagation happens.

## Frequently asked questions

- [Can I add an App Service managed certificate when migrating a live domain?](#can-i-add-an-app-service-managed-certificate-when-migrating-a-live-domain)
- [How do I migrate a domain from another app?](#how-do-i-migrate-a-domain-from-another-app)

### Can I add an App Service managed certificate when migrating a live domain?

You can add an App Service managed certificate to a migrated live domain, but only after you [remap the active DNS name](#4-remap-the-active-dns-name). To add the App Service managed certificate, see [Create a free managed certificate](configure-ssl-certificate.md#create-a-free-managed-certificate).

### How do I migrate a domain from another app?

You can migrate an active custom domain in Azure between subscriptions or within the same subscription. However, to achieve a migration without downtime, the source app and the target app must be assigned the same custom domain at a certain time. Therefore, you need to make sure that the two apps aren't deployed to the same deployment unit (internally known as a webspace). A domain name can be assigned to only one app in each deployment unit.

You can find the deployment unit for your app by looking at the domain name of the FTP/S URL `<deployment-unit>.ftp.azurewebsites.windows.net`. Make sure the deployment unit is different between the source app and the target app. The deployment unit of an app is determined by the [App Service plan](overview-hosting-plans.md) it's in. Azure randomly selects it when you create the plan and it can't be changed. When you create two apps [in the same resource group *and* the same region](app-service-plan-manage.md#create-an-app-service-plan), Azure puts them in the same deployment unit. However, there's no way to make sure that the opposite is true. In other words, the only way to create a plan in a different deployment unit is to keep creating a plan in a new resource group or region until you get a different deployment unit.

## Related content

Learn how to bind a custom TLS/SSL certificate to App Service:

* [Purchase an App Service domain](manage-custom-dns-buy-domain.md)
* [Secure a custom DNS name with a TLS binding in Azure App Service](configure-ssl-bindings.md)
