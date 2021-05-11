---
title: 'Tutorial: Map existing custom DNS name'
description: Learn how to add an existing custom DNS domain name (vanity domain) to a web app, mobile app back end, or API app in Azure App Service.
keywords: app service, azure app service, domain mapping, domain name, existing domain, hostname

ms.assetid: dc446e0e-0958-48ea-8d99-441d2b947a7c
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 08/25/2020
ms.custom: mvc, seodec18, devx-track-azurepowershell
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./app-service-web-tutorial-custom-domain-uiex
---

# Tutorial: Map an existing custom DNS name to Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This tutorial shows you how to map an existing custom Domain Name System (DNS) name to App Service.

![Screenshot that shows the Azure portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Map a subdomain (for example, `www.contoso.com`) by using a CNAME record.
> * Map a root domain (for example, `contoso.com`) by using an A record.
> * Map a wildcard domain (for example, `*.contoso.com`) by using a CNAME record.
> * Redirect the default URL to a custom directory.
> * Automate domain mapping with scripts.

## Prerequisites

To complete this tutorial:

* [Create an App Service app](./index.yml), or use an app that you created for another tutorial.
* Purchase a domain name, and make sure you have access to the DNS registry for your domain provider (such as GoDaddy).

  For example, to add DNS entries for `contoso.com` and `www.contoso.com`, you must be able to configure the DNS settings for the `contoso.com` root domain.

  > [!NOTE]
  > If you don't have an existing domain name, consider [purchasing a domain by using the Azure portal](manage-custom-dns-buy-domain.md).

## Prepare the app

To map a custom DNS name to a web app, the web app's [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be a paid tier (Shared, Basic, Standard, Premium, or Consumption for Azure Functions). In this step, you make sure that the App Service app is in the supported pricing tier.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

  > [!NOTE]
  > Removing or adding a custom domain to your web app will cause your site to be restarted.
### Sign in to Azure

Open the [Azure portal](https://portal.azure.com), and sign in with your Azure account.

### Select the app in the Azure portal

1. Search for and select **App Services**.

   ![Screenshot that shows selecting App Services.](./media/app-service-web-tutorial-custom-domain/app-services.png)

1. On the **App Services** page, select the name of your Azure app.

   ![Screenshot showing portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/select-app.png)

You see the management page of the App Service app.

<a name="checkpricing" aria-hidden="true"></a>

### Check the pricing tier

1. In the left pane of the app page, scroll to the **Settings** section and select **Scale up (App Service plan)**.

   ![Screenshot that shows the Scale up (App Service plan) menu.](./media/app-service-web-tutorial-custom-domain/scale-up-menu.png)

1. The app's current tier is highlighted by a blue border. Check to make sure that the app isn't in the **F1** tier. Custom DNS isn't supported in the **F1** tier.

   ![Screenshot that shows recommended pricing tiers.](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

1. If the App Service plan isn't in the **F1** tier, close the **Scale up** page and skip to [Map a CNAME record](#map-a-cname-record).

<a name="scaleup" aria-hidden="true"></a>

### Scale up the App Service plan

1. Select any of the non-free tiers (**D1**, **B1**, **B2**, **B3**, or any tier in the **Production** category). For additional options, select **See additional options**.

1. Select **Apply**.

   ![Screenshot that shows checking the pricing tier.](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

   When you see the following notification, the scale operation is complete.

   ![Screenshot that shows the scale operation confirmation.](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

<a name="cname" aria-hidden="true"></a>

## Get a domain verification ID

To add a custom domain to your app, you need to verify your ownership of the domain by adding a verification ID as a TXT record with your domain provider. In the left pane of your app page, select **Custom domains**. Copy the ID in the **Custom Domain Verification ID** box in the **Custom Domains** page for the next step.

![Screenshot that shows the ID in the Custom Domain Verification ID box.](./media/app-service-web-tutorial-custom-domain/get-custom-domain-verification-id.png)

> [!WARNING]
> Adding domain verification IDs to your custom domain can prevent dangling DNS entries and help to avoid subdomain takeovers. For custom domains you previously configured without this verification ID, you should protect them from the same risk by adding the verification ID to your DNS record. For more information on this common high-severity threat, see [Subdomain takeover](../security/fundamentals/subdomain-takeover.md).

## Map your domain

You can use either a CNAME record or an A record to map a custom DNS name to App Service. Follow the respective steps:

- [Map a CNAME record](#map-a-cname-record)
- [Map an A record](#map-an-a-record)
- [Map a wildcard domain (with a CNAME record)](#map-a-wildcard-domain)

> [!NOTE]
> You should use CNAME records for all custom DNS names except root domains (for example, `contoso.com`). For root domains, use A records.

### Map a CNAME record

In the tutorial example, you add a CNAME record for the `www` subdomain (for example, `www.contoso.com`).

If you have a subdomain other than `www`, replace `www` with your subdomain (for example, with `sub` if your custom domain is `sub.constoso.com`).

#### Access DNS records with a domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the CNAME record

Map a subdomain to the app's default domain name (`<app-name>.azurewebsites.net`, where `<app-name>` is the name of your app). To create a CNAME mapping for the `www` subdomain, create two records:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `www` | `<app-name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid.www` | [The verification ID you got earlier](#get-a-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. |

After you add the CNAME and TXT records, the DNS records page looks like the following example:

![Screenshot that shows the portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/cname-record.png)

#### Enable the CNAME record mapping in Azure

1. In the left pane of the app page in the Azure portal, select **Custom domains**.

    ![Screenshot that shows the custom domains menu.](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

1. On the **Custom domains** page of the app, add the fully qualified custom DNS name (`www.contoso.com`) to the list.

1. Select **Add custom domain**.

    ![Screenshot that shows the Add host name item.](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

1. Type the fully qualified domain name that you added a CNAME record for, such as `www.contoso.com`.

1. Select **Validate**. The **Add custom domain** page appears.

1. Make sure that **Hostname record type** is set to **CNAME (www\.example.com or any subdomain)**. Select **Add custom domain**.

    ![Screenshot that shows the Add custom domain button.](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

    ![Screenshot that shows adding the CNAME record.](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

    If you missed a step or made a typo somewhere earlier, a verification error appears at the bottom of the page.

    ![Screenshot that shows a verification error.](./media/app-service-web-tutorial-custom-domain/verification-error-cname.png)

<a name="a" aria-hidden="true"></a>

### Map an A record

In the tutorial example, you add an A record for the root domain (for example, `contoso.com`).

<a name="info"></a>

#### Copy the app's IP address

To map an A record, you need the app's external IP address. You can find this IP address on the app's **Custom Domains** page in the Azure portal.

1. In the left pane of the app page in the Azure portal, select **Custom domains**.

   ![Screenshot that shows the custom domains menu.](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

1. On the **Custom Domains** page, copy the app's IP address.

   ![Screenshot that shows portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

#### Access DNS records with a domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the A record

To map an A record to an app, usually to the root domain, create two records:

| Record type | Host | Value | Comments |
| - | - | - |
| A | `@` | IP address from [Copy the app's IP address](#info) | The domain mapping itself (`@` typically represents the root domain). |
| TXT | `asuid` | [The verification ID you got earlier](#get-a-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. For the root domain, use `asuid`. |

> [!NOTE]
> To add a subdomain (like `www.contoso.com`) by using an A record instead of a recommended [CNAME record](#map-a-cname-record), your A record and TXT record should look like the following table instead:
>
> | Record type | Host | Value |
> | - | - | - |
> | A | `www` | IP address from [Copy the app's IP address](#info) |
> | TXT | `asuid.www` | [The verification ID you got earlier](#get-a-domain-verification-id) |
>

After the records are added, the DNS records page looks like the following example:

![Screenshot that shows a DNS records page.](./media/app-service-web-tutorial-custom-domain/a-record.png)

<a name="enable-a" aria-hidden="true"></a>

#### Enable the A record mapping in the app

Back in the app's **Custom Domains** page in the Azure portal, add the fully qualified custom DNS name (for example, `contoso.com`) to the list.

1. Select **Add custom domain**.

    ![Screenshot that shows adding a host name.](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

1. Type the fully qualified domain name that you configured the A record for, such as `contoso.com`. 

1. Select **Validate**. The **Add custom domain** page is shown.

1. Make sure that **Hostname record type** is set to **A record (example.com)**. Select **Add custom domain**.

    ![Screenshot that shows adding a DNS name to the app.](./media/app-service-web-tutorial-custom-domain/validate-domain-name.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

    ![Screenshot that shows adding an A record.](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).
    
    If you missed a step or made a typo somewhere earlier, a verification error appears at the bottom of the page.
    
    ![Screenshot showing a verification error.](./media/app-service-web-tutorial-custom-domain/verification-error.png)
    
<a name="wildcard" aria-hidden="true"></a>

### Map a wildcard domain

In the tutorial example, you map a [wildcard DNS name](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (for example, `*.contoso.com`) to the App Service app by adding a CNAME record.

#### Access DNS records with a domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the CNAME record

Map a wildcard name `*` to the app's default domain name (`<app-name>.azurewebsites.net`, where `<app-name>` is the name of your app). To map the wildcard name, create two records:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `*` | `<app-name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid` | [The verification ID you got earlier](#get-a-domain-verification-id) | App Service accesses the `asuid` TXT record to verify your ownership of the custom domain. |

For the `*.contoso.com` domain example, the CNAME record will map the name `*` to `<app-name>.azurewebsites.net`.

When the CNAME is added, the DNS records page looks like the following example:

![Screenshot that shows the navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/cname-record-wildcard.png)

#### Enable the CNAME record mapping in the app

You can now add any subdomain that matches the wildcard name to the app (for example, `sub1.contoso.com`, `sub2.contoso.com` and `*.contoso.com` both match `*.contoso.com`).

1. In the left pane of the app page in the Azure portal, select **Custom domains**.

    ![Screenshot that shows the custom domains menu.](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

1. Select **Add custom domain**.

    ![Screenshot that shows adding a host name.](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

1. Type a fully qualified domain name that matches the wildcard domain (for example, `sub1.contoso.com`), and then select **Validate**.

    The **Add custom domain** button is activated.

1. Make sure that **Hostname record type** is set to **CNAME record (www\.example.com or any subdomain)**. Select **Add custom domain**.

    ![Screenshot that shows the addition of a DNS name to the app.](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname-wildcard.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

1. Select the **+** icon again to add another custom domain that matches the wildcard domain. For example, add `sub2.contoso.com`.

    ![Screenshot that shows adding a CNAME record.](./media/app-service-web-tutorial-custom-domain/cname-record-added-wildcard-2.png)

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).
    
## Test in a browser

Browse to the DNS names that you configured earlier (for example, `contoso.com`, `www.contoso.com`, `sub1.contoso.com`, and `sub2.contoso.com`).

![Screenshot that shows navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

## Resolve 404 "Not Found"

If you receive an HTTP 404 (Not Found) error when you browse to the URL of your custom domain, verify that your domain resolves to your app's IP address by using <a href="https://www.nslookup.io/" target="_blank">nslookup.io</a>. If not, verify that the A and CNAME records are configured correctly using the same site. If it resolves the IP correctly, but you're still getting a 404, then your browser may have cached the old IP address of your domain. Clear the cache, and test DNS resolution again. On a Windows machine, you clear the cache with `ipconfig /flushdns`.

## Migrate an active domain

To migrate a live site and its DNS domain name to App Service with no downtime, see [Migrate an active DNS name to Azure App Service](manage-custom-dns-migrate-domain.md).

<a name="virtualdir" aria-hidden="true"></a>

## Redirect to a custom directory

By default, App Service directs web requests to the root directory of your app code. But certain web frameworks don't start in the root directory. For example, [Laravel](https://laravel.com/) starts in the `public` subdirectory. To continue the `contoso.com` DNS example, such an app is accessible at `http://contoso.com/public`, but you want to direct `http://contoso.com` to the `public` directory instead. This step doesn't involve DNS resolution but is about customizing the virtual directory.

To do customize a virtual directory for Windows apps, select **Application settings** in the left pane of your web app page. 

> [!NOTE]
> Linux apps don't have this page. To change the site root for Linux apps, see the language-specific configuration guides ([PHP](configure-language-php.md?pivots=platform-linux#change-site-root), for example).

At the bottom of the page, the root virtual directory `/` points to `site\wwwroot` by default, which is the root directory of your app code. Change it to point to the `site\wwwroot\public` instead, for example, and save your changes.

![Screenshot that shows customizing a virtual directory.](./media/app-service-web-tutorial-custom-domain/customize-virtual-directory.png)

After the operation finishes, your app should return the right page at the root path (for example, `http://contoso.com`).

## Automate with scripts

You can automate management of custom domains with scripts by using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

### Azure CLI

The following command adds a configured custom DNS name to an App Service app.

```bash 
az webapp config hostname add \
    --webapp-name <app-name> \
    --resource-group <resource_group_name> \
    --hostname <fully_qualified_domain_name>
``` 

For more information, see [Map a custom domain to a web app](scripts/cli-configure-custom-domain.md).

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following command adds a configured custom DNS name to an App Service app.

```powershell  
Set-AzWebApp `
    -Name <app-name> `
    -ResourceGroupName <resource_group_name> ` 
    -HostNames @("<fully_qualified_domain_name>","<app-name>.azurewebsites.net")
```

For more information, see [Assign a custom domain to a web app](scripts/powershell-configure-custom-domain.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Map a subdomain by using a CNAME record.
> * Map a root domain by using an A record.
> * Map a wildcard domain by using a CNAME record.
> * Redirect the default URL to a custom directory.
> * Automate domain mapping with scripts.

Continue to the next tutorial to learn how to bind a custom TLS/SSL certificate to a web app.

> [!div class="nextstepaction"]
> [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
