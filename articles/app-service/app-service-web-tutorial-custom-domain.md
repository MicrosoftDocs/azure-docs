---
title: 'Tutorial: Map existing custom DNS name'
description: Learn how to add an existing custom DNS domain name (vanity domain) to a web app, mobile app back end, or API app in Azure App Service.
keywords: app service, azure app service, domain mapping, domain name, existing domain, hostname, vanity domain

ms.assetid: dc446e0e-0958-48ea-8d99-441d2b947a7c
ms.topic: tutorial
ms.date: 05/27/2021
ms.custom: mvc, seodec18, devx-track-azurepowershell
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./app-service-web-tutorial-custom-domain-uiex
---

# Tutorial: Map an existing custom DNS name to Azure App Service

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. This tutorial shows you how to map an existing custom Domain Name System (DNS) name to App Service.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Map a subdomain by using a [CNAME record](https://en.wikipedia.org/wiki/CNAME_record).
> * Map a root domain by using an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A).
> * Map a [wildcard domain](https://en.wikipedia.org/wiki/Wildcard_DNS_record) by using a CNAME record.
> * Redirect the default URL to a custom directory.


## 1. Prepare your environment

* [Create an App Service app](./index.yml), or use an app that you created for another tutorial.
* Make sure you can edit DNS records for your custom domain. If you don't have a custom domain yet, you can [purchase an App Service domain](manage-custom-dns-buy-domain.md).

    > [!NOTE]
    > To edit DNS records, you need access to the DNS registry for your domain provider, such as GoDaddy. For example, to add DNS entries for `contoso.com` and `www.contoso.com`, you must be able to configure the DNS settings for the `contoso.com` root domain.


## 2. Prepare the app

To map a custom DNS name to a web app, the web app's [App Service plan](overview-hosting-plans.md) must be a paid tier (not **Free (F1)**).

#### Sign in to Azure

Open the [Azure portal](https://portal.azure.com), and sign in with your Azure account.

#### Select the app in the Azure portal

1. Search for and select **App Services**.

   ![Screenshot that shows selecting App Services.](./media/app-service-web-tutorial-custom-domain/app-services.png)

1. On the **App Services** page, select the name of your Azure app.

   ![Screenshot showing portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/select-app.png)

    You see the management page of the App Service app.

<a name="checkpricing" aria-hidden="true"></a>

#### Check the pricing tier

1. In the left pane of the app page, scroll to the **Settings** section and select **Scale up (App Service plan)**.

   ![Screenshot that shows the Scale up (App Service plan) menu.](./media/app-service-web-tutorial-custom-domain/scale-up-menu.png)

1. The app's current tier is highlighted by a blue border. Check to make sure that the app isn't in the **F1** tier. Custom DNS isn't supported in the **F1** tier.

   ![Screenshot that shows Recommended pricing tiers.](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

1. If the App Service plan isn't in the **F1** tier, close the **Scale up** page and skip to [3. Get a domain verification ID](#3-get-a-domain-verification-id).

<a name="scaleup" aria-hidden="true"></a>

#### Scale up the App Service plan

1. Select any of the non-free tiers (**D1**, **B1**, **B2**, **B3**, or any tier in the **Production** category). For additional options, select **See additional options**.

1. Select **Apply**.

   ![Screenshot that shows checking the pricing tier.](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

   When you see the following notification, the scale operation is complete.

   ![Screenshot that shows the scale operation confirmation.](./media/app-service-web-tutorial-custom-domain/scale-notification.png)


## 3. Get a domain verification ID

To add a custom domain to your app, you need to verify your ownership of the domain by adding a verification ID as a TXT record with your domain provider. 

1. In the left pane of your app page, select **Custom domains**. 
1. Copy the ID in the **Custom Domain Verification ID** box in the **Custom Domains** page for the next step.

    ![Screenshot that shows the ID in the Custom Domain Verification ID box.](./media/app-service-web-tutorial-custom-domain/get-custom-domain-verification-id.png)

    > [!WARNING]
    > Adding domain verification IDs to your custom domain can prevent dangling DNS entries and help to avoid subdomain takeovers. For custom domains you previously configured without this verification ID, you should protect them from the same risk by adding the verification ID to your DNS record. For more information on this common high-severity threat, see [Subdomain takeover](../security/fundamentals/subdomain-takeover.md).
    
<a name="info"></a>

3. **(A record only)** To map an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A), you need the app's external IP address. In the **Custom domains** page, copy the value of **IP address**.

   ![Screenshot that shows portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/mapping-information.png)


## 4. Create the DNS records

1. Sign in to the website of your domain provider.

    > [!NOTE]
    > If you like, you can use Azure DNS to manage DNS records for your domain and configure a custom DNS name for Azure App Service. For more information, see [Tutorial: Host your domain in Azure DNS](../dns/dns-delegate-domain-azure-dns.md).

1. Find the page for managing DNS records. 

    > [!NOTE]
    > Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.
    >
    > Often, you can find the DNS records page by viewing your account information and then looking for a link such as **My domains**. Go to that page, and then look for a link that's named something like **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page:

   ![Screenshot that shows an example DNS records page.](../../includes/media/app-service-web-access-dns-records-no-h/example-record-ui.png)

1. Select **Add** or the appropriate widget to create a record. 

1. Select the type of record to create and follow the instructions. You can use either a [CNAME record](https://en.wikipedia.org/wiki/CNAME_record) or an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A) to map a custom DNS name to App Service.

    > [!NOTE]
    > **Which record to choose**
    > 
    > * To map the root domain (for example, `contoso.com`), use an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A). Don't use the CNAME record for the root record (for information, see [RFC 1912 Section 2.4](https://datatracker.ietf.org/doc/html/rfc1912#section-2.4)).
    > * To map a subdomain (for example, `www.contoso.com`), use a [CNAME record](https://en.wikipedia.org/wiki/CNAME_record).
    > * You can map a subdomain to the app's IP address directly with an A record, but it's possible for [the IP address to change](overview-inbound-outbound-ips.md#when-inbound-ip-changes). The CNAME maps to the app's default hostname instead, which is less susceptible to change.
    > * To map a [wildcard domain](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (for example, `*.contoso.com`), use a CNAME record.
    
# [CNAME](#tab/cname)

For a subdomain like `www` in `www.contoso.com`, create two records according to the following table:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `<subdomain>` (for example, `www`) | `<app-name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid.<subdomain>` (for example, `asuid.www`) | [The verification ID you got earlier](#3-get-a-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. |

![Screenshot that shows the portal navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/cname-record.png)
    
# [A](#tab/a)

- For a root domain like `contoso.com`, create two records according to the following table:

    | Record type | Host | Value | Comments |
    | - | - | - |
    | A | `@` | IP address from [Copy the app's IP address](#3-get-a-domain-verification-id) | The domain mapping itself (`@` typically represents the root domain). |
    | TXT | `asuid` | [The verification ID you got earlier](#3-get-a-domain-verification-id) | App Service accesses the `asuid.<subdomain>` TXT record to verify your ownership of the custom domain. For the root domain, use `asuid`. |
    
    ![Screenshot that shows a DNS records page.](./media/app-service-web-tutorial-custom-domain/a-record.png)
    
- To map a subdomain like `www.contoso.com` with an A record instead of a recommended CNAME record, your A record and TXT record should look like the following table instead:

    |Record type|Host|Value|
    |--- |--- |--- |
    |A|<subdomain> (for example, www)|IP address from Copy the app's IP address|
    |TXT|asuid.<subdomain> (for example, asuid.www)|The verification ID you got earlier|
    
# [Wildcard (CNAME)](#tab/wildcard)

For a wildcard name like `*` in `*.contoso.com`, create two records according to the following table:

| Record type | Host | Value | Comments |
| - | - | - |
| CNAME | `*` | `<app-name>.azurewebsites.net` | The domain mapping itself. |
| TXT | `asuid` | [The verification ID you got earlier](#3-get-a-domain-verification-id) | App Service accesses the `asuid` TXT record to verify your ownership of the custom domain. |

![Screenshot that shows the navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/cname-record-wildcard.png)
    
-----

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you select a separate **Save Changes** link.

<a name="a" aria-hidden="true"></a>

<a name="enable-a" aria-hidden="true"></a>

<a name="wildcard" aria-hidden="true"></a>

<a name="cname" aria-hidden="true"></a>

## 5. Enable the mapping in your app

1. In the left pane of the app page in the Azure portal, select **Custom domains**.

    ![Screenshot that shows the Custom domains menu.](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

1. Select **Add custom domain**.

    ![Screenshot that shows the Add host name item.](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

# [CNAME](#tab/cname)

3. Type the fully qualified domain name that you added a CNAME record for, such as `www.contoso.com`.

1. Select **Validate**. The **Add custom domain** page appears.

1. Make sure that **Hostname record type** is set to **CNAME (www\.example.com or any subdomain)**. Select **Add custom domain**.

    ![Screenshot that shows the Add custom domain button.](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

    ![Screenshot that shows adding the CNAME record.](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

    If you missed a step or made a typo somewhere earlier, a verification error appears at the bottom of the page.

    ![Screenshot that shows a verification error.](./media/app-service-web-tutorial-custom-domain/verification-error-cname.png)

# [A](#tab/a)

3. Type the fully qualified domain name that you configured the A record for, such as `contoso.com`. 

1. Select **Validate**. The **Add custom domain** page is shown.

1. Make sure that **Hostname record type** is set to **A record (example.com)**. Select **Add custom domain**.

    ![Screenshot that shows adding a DNS name to the app.](./media/app-service-web-tutorial-custom-domain/validate-domain-name.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

    ![Screenshot that shows adding an A record.](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).
    
    If you missed a step or made a typo somewhere earlier, a verification error appears at the bottom of the page.
    
    ![Screenshot showing a verification error.](./media/app-service-web-tutorial-custom-domain/verification-error.png)
    
# [Wildcard (CNAME)](#tab/wildcard)

3. Type a fully qualified domain name that matches the wildcard domain. For example, for the example `*.contoso.com`, you can use `sub1.contoso.com`, `sub2.contoso.com`, `*.contoso.com`, or any other string that matches the wildcard pattern. Then, select **Validate**.

    The **Add custom domain** button is activated.

1. Make sure that **Hostname record type** is set to **CNAME record (www\.example.com or any subdomain)**. Select **Add custom domain**.

    ![Screenshot that shows the addition of a DNS name to the app.](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname-wildcard.png)

    It might take some time for the new custom domain to be reflected in the app's **Custom Domains** page. Refresh the browser to update the data.

    > [!NOTE]
    > A warning label for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To add a TLS binding, see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

-----


## 6. Test in a browser

Browse to the DNS names that you configured earlier.

![Screenshot that shows navigation to an Azure app.](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

<a name="resolve-404-not-found" aria-hidden="true"></a>

If you receive an HTTP 404 (Not Found) error when you browse to the URL of your custom domain, the two most common causes are:

* The custom domain configured is missing an A record or a CNAME record. You may have deleted the DNS record after you've enabled the mapping in your app. Check if the DNS records are properly configured using an <a href="https://www.nslookup.io/">online DNS lookup</a> tool.
* The browser client has cached the old IP address of your domain. Clear the cache, and test DNS resolution again. On a Windows machine, you clear the cache with `ipconfig /flushdns`.


## Migrate an active domain

To migrate a live site and its DNS domain name to App Service with no downtime, see [Migrate an active DNS name to Azure App Service](manage-custom-dns-migrate-domain.md).

<a name="virtualdir" aria-hidden="true"></a>

## Redirect to a custom directory

> [!NOTE]
> By default, App Service directs web requests to the root directory of your app code. But certain web frameworks don't start in the root directory. For example, [Laravel](https://laravel.com/) starts in the `public` subdirectory. To continue the `contoso.com` DNS example, such an app is accessible at `http://contoso.com/public`, but you you typically want to direct `http://contoso.com` to the `public` directory instead.

While this is a common scenario, it doesn't actually involve custom DNS mapping, but is about customizing the virtual directory within your app.

1. Select **Application settings** in the left pane of your web app page.

1. At the bottom of the page, the root virtual directory `/` points to `site\wwwroot` by default, which is the root directory of your app code. Change it to point to the `site\wwwroot\public` instead, for example, and save your changes.

    ![Screenshot that shows customizing a virtual directory.](./media/app-service-web-tutorial-custom-domain/customize-virtual-directory.png)

1. After the operation finishes, verify by navigating to your app's root path in the browser (for example, `http://contoso.com` or `http://<app-name>.azurewebsites.net`).


## Automate with scripts

You can automate management of custom domains with scripts by using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

#### Azure CLI

The following command adds a configured custom DNS name to an App Service app.

```azurecli 
az webapp config hostname add \
    --webapp-name <app-name> \
    --resource-group <resource_group_name> \
    --hostname <fully_qualified_domain_name>
``` 

For more information, see [Map a custom domain to a web app](scripts/cli-configure-custom-domain.md).

#### Azure PowerShell

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

Continue to the next tutorial to learn how to bind a custom TLS/SSL certificate to a web app.

> [!div class="nextstepaction"]
> [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
