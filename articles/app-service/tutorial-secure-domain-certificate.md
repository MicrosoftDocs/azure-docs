---
title: 'Tutorial: Secure app with a custom domain and certificate'
description: Learn how to secure your brand with App Service using a custom domain and enabling App Service managed certificate.
ms.topic: tutorial
author: msangapu-msft
ms.author: msangapu
ms.date: 01/31/2023
---

# Tutorial: Secure your Azure App Service app with a custom domain and a managed certificate

The default domain name that comes with your app `<app-name>.azurewebsites.net` may not represent your brand the way you want. In this tutorial, you configure App Service with a `www` domain you own, such as `www.contoso.com`, and secure the custom domain with an App Service managed certificate.

The `<app-name>.azurewebsites.net` name is already secured by a wildcard certificate for all App Service apps, but your custom domain needs to be TLS secured with a separate certificate. The easiest way is to use a managed certificate from App Service. It's free and easy to use, and it provides the basic functionality of securing a custom domain in App Service. For more information, see [Add a TLS certificate to App Service](configure-ssl-certificate.md).

## Scenario prerequisites

* [Create an App Service app](./index.yml).
* Make sure you can edit the DNS records for your custom domain. To edit DNS records, you need access to the DNS registry for your domain provider, such as GoDaddy. For example, to add DNS entries for `www.contoso.com`, you must be able to configure the DNS settings for the `contoso.com` root domain. Your custom domains must be in a public DNS zone; private DNS zone is only supported on Internal Load Balancer (ILB) App Service Environment (ASE).
* If you don't have a custom domain yet, you can [purchase an App Service domain](manage-custom-dns-buy-domain.md).

## A. Scale up your app

You need to scale your app up to **Basic** tier. **Basic** tier fulfills the minimum pricing tier requirement for custom domains (**Shared**) and certificates (**Basic**).

:::row:::
    :::column span="2":::
        **Step 1:** In the Azure portal:
        1. Enter the name of your app in the search bar at the top.
        1. Select your named resource with the type **App Service**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/search-select-app.png" alt-text="A screenshot showing how to use the search box in the top tool bar to open your App Service app's management page." lightbox="./media/tutorial-secure-domain-certificate/search-select-app.png" border="true":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In your app's management page:
        1. In the left navigation, select **Scale up (App Service plan)**.
        1. Select the checkbox for **Basic B1**.
        1. Select **Select**.
        When the app update is complete, you see a notification toast.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/scale-up-tier.png" alt-text="A screenshot showing how to scale up an App Service app to Basic B1 tier." lightbox="./media/tutorial-secure-domain-certificate/scale-up-tier.png" border="true":::
    :::column-end:::
:::row-end:::

For more information on app scaling, see [Scale up an app in Azure App Service](manage-scale-up.md).

## B. Configure a custom domain

:::row:::
    :::column span="2":::
        **Step 1:** In your app's management page:
        1. In the left menu, select **Custom domains**.
        1. Select **Add custom domain**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/add-custom-domain.png" alt-text="A screenshot showing how to add a custom domain." lightbox="./media/tutorial-secure-domain-certificate/add-custom-domain.png" border="true":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** In the **Add custom domain** dialog:
        1. For **Domain provider**, select **All other domain services**.
        1. For **TLS/SSL certificate**, select **App Service Managed Certificate**.
        1. For Domain, specify a fully qualified domain name you want based on the domain you own. For example, if you own `contoso.com`, you can use *www.contoso.com*.
        1. Don't select **Validate** yet.        
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/configure-custom-domain.png" alt-text="A screenshot showing how to configure a new custom domain, along with a managed certificate." lightbox="./media/tutorial-secure-domain-certificate/add-custom-domain.png" border="true":::
    :::column-end:::
:::row-end:::

For each custom domain in App Service, you need two DNS records with your domain provider. The **Domain validation** section shows you two DNS records that you must add with your domain provider. Select the respective **Copy** button to help you with the next step.

## C. Create the DNS records

:::row:::
    :::column span="2":::
        Sign in to the website of your domain provider.
        1. Find the page for managing DNS records, **Domain Name**, **DNS**, or **Name Server Management** (the exact page differs by domain provider).
        1. Select **Add** or the appropriate widget to create a DNS record.
        1. Select the DNS record type based on the **Domain validation** section in the Azure portal (CNAME, A, or TXT).
        1. Configure the DNS record based on the **Host** and **Value** columns from the **Domain validation** section in the Azure portal.
        1. Be sure to add two different records for your custom domain.
        1. For certain providers, changes to DNS records don't become effective until you select a separate **Save Changes** link.
        The screenshot shows what your DNS records should look like for a `www` subdomain after you're finished.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/cname-record.png" alt-text="A screenshot showing an example of what your domain provider's website should look like after you add a CNAME record and a TXT record for a www subdomain." lightbox="./media/tutorial-secure-domain-certificate/cname-record.png" border="true":::
    :::column-end:::
:::row-end:::

## D. Validate and complete

:::row:::
    :::column span="2":::
        **Step 1:** Back in the **Add custom domain** dialog in the Azure portal, select **Validate**.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/configure-custom-domain-validate.png" alt-text="A screenshot showing how to validate your DNS record settings in the Add a custom domain dialog." lightbox="./media/tutorial-secure-domain-certificate/configure-custom-domain-validate.png" border="true":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2:** If the **Domain validation** section shows green check marks next for both domain records, then you've configured them correctly. Select **Add**. If it shows any red X, fix any errors in the DNS record settings in your domain provider's website.
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/configure-custom-domain-add.png" alt-text="A screenshot showing the Add button activated after validation." lightbox="./media/tutorial-secure-domain-certificate/configure-custom-domain-add.png" border="true":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3:** You should see the custom domain added to the list. You may also see a red X with **No binding**. Wait a few minutes for App Service to create the managed certificate for your custom domain. When the process is complete, the red X becomes a green check mark with **Secured**. 
    :::column-end:::
    :::column:::
        :::image type="content" source="./media/tutorial-secure-domain-certificate/add-custom-domain-complete.png" alt-text="A screenshot showing the custom domains page with the new secured custom domain." lightbox="./media/tutorial-secure-domain-certificate/add-custom-domain-complete.png" border="true":::
    :::column-end:::
:::row-end:::

## E. Test in a browser

Browse to the DNS names that you configured earlier (like `www.contoso.com`). The address bar should now show the security lock icon for your app's URL, indicating that it's secured by TLS.

:::image type="content" source="./media/tutorial-secure-domain-certificate/test-in-browser.png" alt-text="A screenshot that shows navigation to the App Service app with a custom domain and TLS security.":::

If you receive an HTTP 404 (Not Found) error when you browse to the URL of your custom domain, the browser client may have cached the old IP address of your custom domain. Clear the cache, and try navigating to the URL again. On a Windows machine, you clear the cache with `ipconfig /flushdns`.

## Frequently asked questions

- [What do I do if I don't have a custom domain yet?](#what-do-i-do-if-i-dont-have-a-custom-domain-yet)
- [Does this managed certificate expire?](#does-this-managed-certificate-expire)
- [What else can I do with the App Service managed certificate for my app?](#what-else-can-i-do-with-the-app-service-managed-certificate-for-my-app)
- [How do I use a certificate I already have to secure my custom domain?](#how-do-i-use-a-certificate-i-already-have-to-secure-my-custom-domain)

#### What do I do if I don't have a custom domain yet?

The `<app-name>.azurewebsites.net` name is always assigned to your app as long as you don't delete it. If you want, you can [purchase an App Service domain](manage-custom-dns-buy-domain.md). An App Service domain is managed by Azure and is integrated with App Service, making it easier to manage together with your apps.

#### Does this managed certificate expire?

The App Service managed certificate doesn't expire as long as it's configured for a custom domain in an App Service app.

#### What else can I do with the App Service managed certificate for my app?

The managed certificate is provided for free for the sole purpose of securing your app's configured custom domain. It comes with [a number of limitations](configure-ssl-certificate.md#create-a-free-managed-certificate). To do more, such as download the certificate, or use it in your application code, you can upload your own certificate, purchase an App Service certificate, or import a Key Vault certificate. For more information, see [Add a private certificate to your app](configure-ssl-certificate.md).

#### How do I use a certificate I already have to secure my custom domain?

See [Add a private certificate to your app](configure-ssl-certificate.md) and [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md).

## Next steps

- [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md)
- [Purchase an App Service domain](manage-custom-dns-buy-domain.md)
- [Add a private certificate to your app](configure-ssl-certificate.md)
- [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](configure-ssl-bindings.md)
