---
title: 'Tutorial: Map existing custom DNS name'
description: Learn how to add an existing custom DNS domain name (vanity domain) to a web app, mobile app backend, or API app in Azure App Service.
keywords: app service, azure app service, domain mapping, domain name, existing domain, hostname

ms.assetid: dc446e0e-0958-48ea-8d99-441d2b947a7c
ms.devlang: nodejs
ms.topic: tutorial
ms.date: 04/27/2020
ms.custom: mvc, seodec18
---

# Tutorial: Map an existing custom DNS name to Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This tutorial shows you how to map an existing custom DNS name to Azure App Service.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Map a subdomain (for example, `www.contoso.com`) by using a CNAME record
> * Map a root domain (for example, `contoso.com`) by using an A record
> * Map a wildcard domain (for example, `*.contoso.com`) by using a CNAME record
> * Redirect the default URL to a custom directory
> * Automate domain mapping with scripts

## Prerequisites

To complete this tutorial:

* [Create an App Service app](/azure/app-service/), or use an app that you created for another tutorial.
* Purchase a domain name and make sure you have access to the DNS registry for your domain provider (such as GoDaddy).

  For example, to add DNS entries for `contoso.com` and `www.contoso.com`, you must be able to configure the DNS settings for the `contoso.com` root domain.

  > [!NOTE]
  > If you don't have an existing domain name, consider [purchasing a domain using the Azure portal](manage-custom-dns-buy-domain.md).

## Prepare the app

To map a custom DNS name to a web app, the web app's [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be a paid tier (**Shared**, **Basic**, **Standard**, **Premium** or **Consumption** for Azure Functions). In this step, you make sure that the App Service app is in the supported pricing tier.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

### Sign in to Azure

Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

### Select the app in the Azure portal

Search for and select **App Services**.

![Select App Services](./media/app-service-web-tutorial-custom-domain/app-services.png)

On the **App Services** page, select the name of your Azure app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/select-app.png)

You see the management page of the App Service app.  

<a name="checkpricing" aria-hidden="true"></a>

### Check the pricing tier

In the left navigation of the app page, scroll to the **Settings** section and select **Scale up (App Service plan)**.

![Scale-up menu](./media/app-service-web-tutorial-custom-domain/scale-up-menu.png)

The app's current tier is highlighted by a blue border. Check to make sure that the app is not in the **F1** tier. Custom DNS is not supported in the **F1** tier. 

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

If the App Service plan is not in the **F1** tier, close the **Scale up** page and skip to [Map a CNAME record](#cname).

<a name="scaleup" aria-hidden="true"></a>

### Scale up the App Service plan

Select any of the non-free tiers (**D1**, **B1**, **B2**, **B3**, or any tier in the **Production** category). For additional options, click **See additional options**.

Click **Apply**.

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

When you see the following notification, the scale operation is complete.

![Scale operation confirmation](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

<a name="cname" aria-hidden="true"></a>

## Get domain verification ID

To add a custom domain to your app, you need to verify your ownership of the domain by adding a verification ID as a TXT record with your domain provider. In the left navigation of your app page, click **Resource explorer** under **Development Tools**, then click **Go**.

In the JSON view of your app's properties, search for `customDomainVerificationId`, and copy its value inside the double quotes. You need this verification ID for the next step.

## Map your domain

You can use either a **CNAME record** or an **A record** to map a custom DNS name to App Service. Follow the respective steps:

- [Map a CNAME record](#map-a-cname-record)
- [Map an A record](#map-an-a-record)
- [Map a wildcard domain (with a CNAME record)](#map-a-wildcard-domain)

> [!NOTE]
> You should use CNAME records for all custom DNS names except root domains (for example, `contoso.com`). For root domains, use A records.

### Map a CNAME record

In the tutorial example, you add a CNAME record for the `www` subdomain (for example, `www.contoso.com`).

#### Access DNS records with domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the CNAME record

Map a subdomain to the app's default domain name (`<app_name>.azurewebsites.net`, where `<app_name>` is the name of your app). To create a CNAME mapping for the `www` subdomain, create two records:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `www` | `<app_name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid.www` | [The verification ID you got earlier](#get-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. |

After you add the CNAME and TXT records, the DNS records page looks like the following example:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record.png)

#### Enable the CNAME record mapping in Azure

In the left navigation of the app page in the Azure portal, select **Custom domains**.

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

In the **Custom domains** page of the app, add the fully qualified custom DNS name (`www.contoso.com`) to the list.

Select the **+** icon next to **Add custom domain**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

Type the fully qualified domain name that you added a CNAME record for, such as `www.contoso.com`.

Select **Validate**.

The **Add custom domain** page is shown.

Make sure that **Hostname record type** is set to **CNAME (www\.example.com or any subdomain)**.

Select **Add custom domain**.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

It might take some time for the new custom domain to be reflected in the app's **Custom domains** page. Try refreshing the browser to update the data.

![CNAME record added](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

> [!NOTE]
> A **Not Secure** label for your custom domain means that it's not yet bound to a TLS/SSL certificate, and any HTTPS request from a browser to your custom domain will receive and error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Verification error](./media/app-service-web-tutorial-custom-domain/verification-error-cname.png)

<a name="a" aria-hidden="true"></a>

### Map an A record

In the tutorial example, you add an A record for the root domain (for example, `contoso.com`).

<a name="info"></a>

#### Copy the app's IP address

To map an A record, you need the app's external IP address. You can find this IP address in the app's **Custom domains** page in the Azure portal.

In the left navigation of the app page in the Azure portal, select **Custom domains**.

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

In the **Custom domains** page, copy the app's IP address.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

#### Access DNS records with domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the A record

To map an A record to an app, usually to the root domain, create two records:

| Record type | Host | Value | Comments |
| - | - | - |
| A | `@` | IP address from [Copy the app's IP address](#info) | The domain mapping itself (`@` typically represents the root domain). |
| TXT | `asuid` | [The verification ID you got earlier](#get-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. For the root domain, use `asuid`. |

> [!NOTE]
> To add a subdomain (like `www.contoso.com`) using an A record instead of a recommended [CNAME record](#map-a-cname-record), your A record and TXT record should look like the following table instead:
>
> | Record type | Host | Value |
> | - | - | - |
> | A | `www` | IP address from [Copy the app's IP address](#info) |
> | TXT | `asuid.www` | `<app_name>.azurewebsites.net` |
>

When the records are added, the DNS records page looks like the following example:

![DNS records page](./media/app-service-web-tutorial-custom-domain/a-record.png)

<a name="enable-a" aria-hidden="true"></a>

#### Enable the A record mapping in the app

Back in the app's **Custom domains** page in the Azure portal, add the fully qualified custom DNS name (for example, `contoso.com`) to the list.

Select the **+** icon next to **Add custom domain**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

Type the fully qualified domain name that you configured the A record for, such as `contoso.com`.

Select **Validate**.

The **Add custom domain** page is shown.

Make sure that **Hostname record type** is set to **A record (example.com)**.

Select **Add custom domain**.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name.png)

It might take some time for the new custom domain to be reflected in the app's **Custom domains** page. Try refreshing the browser to update the data.

![A record added](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

> [!NOTE]
> A **Not Secure** label for your custom domain means that it's not yet bound to a TLS/SSL certificate, and any HTTPS request from a browser to your custom domain will receive and error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Verification error](./media/app-service-web-tutorial-custom-domain/verification-error.png)

<a name="wildcard" aria-hidden="true"></a>

### Map a wildcard domain

In the tutorial example, you map a [wildcard DNS name](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (for example, `*.contoso.com`) to the App Service app by adding a CNAME record.

#### Access DNS records with domain provider

[!INCLUDE [Access DNS records with domain provider](../../includes/app-service-web-access-dns-records-no-h.md)]

#### Create the CNAME record

Add a CNAME record to map a wildcard name to the app's default domain name (`<app_name>.azurewebsites.net`).

For the `*.contoso.com` domain example, the CNAME record will map the name `*` to `<app_name>.azurewebsites.net`.

When the CNAME is added, the DNS records page looks like the following example:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record-wildcard.png)

#### Enable the CNAME record mapping in the app

You can now add any subdomain that matches the wildcard name to the app (for example, `sub1.contoso.com` and `sub2.contoso.com` match `*.contoso.com`).

In the left navigation of the app page in the Azure portal, select **Custom domains**.

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

Select the **+** icon next to **Add custom domain**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

Type a fully qualified domain name that matches the wildcard domain (for example, `sub1.contoso.com`), and then select **Validate**.

The **Add custom domain** button is activated.

Make sure that **Hostname record type** is set to **CNAME record (www\.example.com or any subdomain)**.

Select **Add custom domain**.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname-wildcard.png)

It might take some time for the new custom domain to be reflected in the app's **Custom domains** page. Try refreshing the browser to update the data.

Select the **+** icon again to add another custom domain that matches the wildcard domain. For example, add `sub2.contoso.com`.

![CNAME record added](./media/app-service-web-tutorial-custom-domain/cname-record-added-wildcard2.png)

> [!NOTE]
> A **Note Secure** label for your custom domain means that it's not yet bound to a TLS/SSL certificate, and any HTTPS request from a browser to your custom domain will receive and error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Test in browser

Browse to the DNS name(s) that you configured earlier (for example, `contoso.com`,  `www.contoso.com`, `sub1.contoso.com`, and `sub2.contoso.com`).

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

## Resolve 404 "Not Found"

If you receive an HTTP 404 (Not Found) error when browsing to the URL of your custom domain, verify that your domain resolves to your app's IP address using <a href="https://www.whatsmydns.net/" target="_blank">WhatsmyDNS.net</a>. If not, it may be due to one of the following reasons:

- The custom domain configured is missing an A record and/or a CNAME record.
- The browser client has cached the old IP address of your domain. Clear the cache and test DNS resolution again. On a Windows machine, you clear the cache with `ipconfig /flushdns`.

<a name="virtualdir" aria-hidden="true"></a>

## Migrate an active domain

To migrate a live site and its DNS domain name to App Service with no downtime, see [Migrate an active DNS name to Azure App Service](manage-custom-dns-migrate-domain.md).

## Redirect to a custom directory

By default, App Service directs web requests to the root directory of your app code. However, certain web frameworks don't start in the root directory. For example, [Laravel](https://laravel.com/) starts in the `public` subdirectory. To continue the `contoso.com` DNS example, such an app would be accessible at `http://contoso.com/public`, but you would really want to direct `http://contoso.com` to the `public` directory instead. This step doesn't involve DNS resolution, but customizing the virtual directory.

To do this, select **Application settings** in the left-hand navigation of your web app page. 

At the bottom of the page, the root virtual directory `/` points to `site\wwwroot` by default, which is the root directory of your app code. Change it to point to the `site\wwwroot\public` instead, for example, and save your changes.

![Customize virtual directory](./media/app-service-web-tutorial-custom-domain/customize-virtual-directory.png)

Once the operation completes, your app should return the right page at the root path (for example, `http://contoso.com`).

## Automate with scripts

You can automate management of custom domains with scripts, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/overview). 

### Azure CLI 

The following command adds a configured custom DNS name to an App Service app. 

```bash 
az webapp config hostname add \
    --webapp-name <app_name> \
    --resource-group <resource_group_name> \
    --hostname <fully_qualified_domain_name>
``` 

For more information, see [Map a custom domain to a web app](scripts/cli-configure-custom-domain.md).

### Azure PowerShell 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following command adds a configured custom DNS name to an App Service app.

```powershell  
Set-AzWebApp `
    -Name <app_name> `
    -ResourceGroupName <resource_group_name> ` 
    -HostNames @("<fully_qualified_domain_name>","<app_name>.azurewebsites.net")
```

For more information, see [Assign a custom domain to a web app](scripts/powershell-configure-custom-domain.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Map a subdomain by using a CNAME record
> * Map a root domain by using an A record
> * Map a wildcard domain by using a CNAME record
> * Redirect the default URL to a custom directory
> * Automate domain mapping with scripts

Advance to the next tutorial to learn how to bind a custom TLS/SSL certificate to a web app.

> [!div class="nextstepaction"]
> [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
