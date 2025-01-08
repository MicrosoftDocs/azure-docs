---
title: Secure a custom DNS with a TLS/SSL binding
description: Help secure HTTPS access to your custom domain by creating a TLS/SSL binding with a certificate. Improve your website's security by enforcing HTTPS or TLS 1.2.
tags: buy-ssl-certificates
ms.custom: devx-track-azurepowershell

ms.topic: how-to
ms.date: 09/16/2024
ms.reviewer: yutlin
ms.author: msangapu
author: msangapu-msft
---
# Provide security for a custom DNS name with a TLS/SSL binding in App Service

This article shows you how to provide security for the [custom domain](app-service-web-tutorial-custom-domain.md) in your [App Service app](./index.yml) or [function app](../azure-functions/index.yml) by creating a certificate binding. When you're finished, you can access your App Service app at the `https://` endpoint for your custom DNS name (for example, `https://www.contoso.com`). 

![Web app with custom TLS/SSL certificate.](./media/configure-ssl-bindings/app-with-custom-ssl.png)

## Prerequisites

- [Scale up your App Service app](manage-scale-up.md) to one of the supported pricing tiers: Basic, Standard, Premium.
- [Map a domain name to your app](app-service-web-tutorial-custom-domain.md) or [buy and configure it in Azure](manage-custom-dns-buy-domain.md).

<a name="upload"></a>

## Add the binding

In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>:

1. From the left menu, select **App Services** > **\<app-name>**.

1. From the left navigation of your app, select **Custom domains**.

1. Next to the custom domain, select **Add binding**.

    :::image type="content" source="media/configure-ssl-bindings/secure-domain-launch.png" alt-text="A screenshot showing how to launch the Add TLS/SSL Binding dialog." lightbox="media/configure-ssl-bindings/secure-domain-launch.png":::

1. If your app already has a certificate for the selected custom domain, you can select it in **Certificate**. If not, you must add a certificate using one of the selections in **Source**.

    - **Create App Service Managed Certificate** - Let App Service create a managed certificate for your selected domain. This option is the easiest. For more information, see [Create a free managed certificate](configure-ssl-certificate.md#create-a-free-managed-certificate).
    - **Import App Service Certificate** - In **App Service Certificate**, select an [App Service certificate](configure-ssl-app-service-certificate.md) you've purchased for your selected domain.
    - **Upload certificate (.pfx)** - Follow the workflow at [Upload a private certificate](configure-ssl-certificate.md#upload-a-private-certificate) to upload a PFX certificate from your local machine and specify the certificate password.
    - **Import from Key Vault** - Select **Select key vault certificate** and select the certificate in the dialog.

1. In **TLS/SSL type**, select either **SNI SSL** or **IP based SSL**.

    - **[SNI SSL](https://en.wikipedia.org/wiki/Server_Name_Indication)**: Multiple SNI SSL bindings can be added. This option allows multiple TLS/SSL certificates to help secure multiple domains on the same IP address. Most modern browsers (including Microsoft Edge, Chrome, Firefox, and Opera) support SNI. (For more information, see [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication).)
    - **IP based SSL**: Only one IP SSL binding can be added. This option allows only one TLS/SSL certificate to help secure a dedicated public IP address. After you configure the binding, follow the steps in [Remap records for IP-based SSL](#remap-records-for-ip-based-ssl).<br/>IP-based SSL is supported only in Standard tier or higher.

1. When adding a new certificate, validate the new certificate by selecting **Validate**.

1. Select **Add**.

    Once the operation is complete, the custom domain's TLS/SSL state is changed to **Secured**.
    
    :::image type="content" source="media/configure-ssl-bindings/secure-domain-finished.png" alt-text="A screenshot showing the custom domain secured by a certificate binding.":::
    
> [!NOTE]
> A **Secured** state in **Custom domains** means that a certificate is providing security, but App Service doesn't check if the certificate is self-signed or expired, for example, which can also cause browsers to show an error or warning.

## Remap records for IP-based SSL

This step is needed only for IP-based SSL. For an SNI SSL binding, skip to [Test HTTPS](#test-https).

There are potentially two changes you need to make:

- By default, your app uses a shared public IP address. When you bind a certificate with IP SSL, App Service creates a new, dedicated IP address for your app. If you mapped an A record to your app, update your domain registry with this new, dedicated IP address.

    Your app's **Custom domain** page is updated with the new, dedicated IP address. Copy this IP address, then [remap the A record](app-service-web-tutorial-custom-domain.md#create-the-dns-records) to this new IP address.

- If you have an SNI SSL binding to `<app-name>.azurewebsites.net`, [remap any CNAME mapping](app-service-web-tutorial-custom-domain.md#create-the-dns-records) to point to `sni.<app-name>.azurewebsites.net` instead. (Add the `sni` prefix.)

## Test HTTPS

Browse to `https://<your.custom.domain>` in various browsers to verify that your app appears.

:::image type="content" source="./media/configure-ssl-bindings/app-with-custom-ssl.png" alt-text="Screenshot showing an example of browsing to your custom domain. The contoso.com URL is highlighted.":::

Your application code can inspect the protocol via the `x-appservice-proto` header. The header has a value of `http` or `https`. 

> [!NOTE]
> If your app gives you certificate validation errors, you're probably using a self-signed certificate.
>
> If that's not the case, you might have left out intermediate certificates when you exported your certificate to the PFX file.

## Frequently asked questions

- [How do I make sure that the app's IP address doesn't change when I make changes to the certificate binding?](#how-do-i-make-sure-that-the-apps-ip-address-doesnt-change-when-i-make-changes-to-the-certificate-binding)
- [Can I disable the forced redirect from HTTP to HTTPS?](#can-i-disable-the-forced-redirect-from-http-to-https)
- [How can I change the minimum TLS versions for the app?](#how-can-i-change-the-minimum-tls-versions-for-the-app)
- [How do I handle TLS termination in App Service?](#how-do-i-handle-tls-termination-in-app-service)

<a name="prevent-ip-changes"></a>

#### How do I make sure that the app's IP address doesn't change when I make changes to the certificate binding?

Your inbound IP address can change when you delete a binding, even if that binding is IP SSL. This is especially important when you renew a certificate that's already in an IP SSL binding. To avoid a change in your app's IP address, follow these steps, in order:

1. Upload the new certificate.
2. Bind the new certificate to the custom domain you want without deleting the old one. This action replaces the binding instead of removing the old one.
3. Delete the old certificate. 

<a name="enforce-https"></a>

#### Can I disable the forced redirect from HTTP to HTTPS?

By default, App Service forces a redirect from HTTP requests to HTTPS. To disable this behavior, see [Configure general settings](configure-common.md#configure-general-settings).

<a name="enforce-tls-versions"></a>

#### How can I change the minimum TLS versions for the app?

Your app allows [TLS](https://wikipedia.org/wiki/Transport_Layer_Security) 1.2 by default, which is the recommended TLS level by industry standards, such as [PCI DSS](https://wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard). To enforce different TLS versions, see [Configure general settings](configure-common.md#configure-general-settings).

<a name="handle-tls-termination"></a>

#### How do I handle TLS termination in App Service?

In App Service, [TLS termination](https://wikipedia.org/wiki/TLS_termination_proxy) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to check if the user requests are encrypted, inspect the `X-Forwarded-Proto` header.

Language-specific configuration guides, such as the [Linux Node.js configuration](configure-language-nodejs.md#detect-https-session) guide, show how to detect an HTTPS session in your application code.

## Automate with scripts

#### Azure CLI

[Bind a custom TLS/SSL certificate to a web app](scripts/cli-configure-ssl-certificate.md)

#### PowerShell

[!code-powershell[main](../../powershell_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.ps1?highlight=1-3 "Bind a custom TLS/SSL certificate to a web app")]

## Related content

* [Use a TLS/SSL certificate in your code in Azure App Service](configure-ssl-certificate-in-code.md)
* [Frequently asked questions about creating or deleting resources in Azure App Service](./faq-configuration-and-management.yml)
