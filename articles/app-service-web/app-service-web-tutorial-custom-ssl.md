---
title: Bind an existing SSL certificate to an Azure web app | Microsoft Docs 
description: Learn to to bind a custom SSL certificate to your web app, mobile app backend, or API app in Azure App Service.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: 5d5bf588-b0bb-4c6d-8840-1b609cfb5750
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 04/20/2017
ms.author: cephalin

---
# Bind an existing SSL certificate to an Azure web app

This tutorial shows you how to bind a custom SSL certificate that you purchased from a trusted certificate authority to your web app, mobile app backend, or API app in [Azure App Service](../app-service/app-service-value-prop-what-is.md). When you're finished, you'll be able to access your app at the HTTPS endpoint of your custom DNS domain.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/app-with-custom-ssl.png)

> [!TIP]
> If you need to get a custom SSL certificate, you can just [buy one in the Azure portal directly and bind it to your app](web-sites-purchase-ssl-web-site.md). 
>
> 

## Before you begin
Before following this tutorial, make sure that you have done the following:

- [Create an App Service app](/azure/app-service/)
- [Map a custom DNS name to your app](web-sites-custom-domain-name.md)
- Export your existing SSL certificate to a [PFX file](https://wikipedia.org/wiki/PKCS_12) with a password (see [Requirements for your SSL certificate](#requirements))

<a name="requirements"></a>

### Requirements for your SSL certificate

To use your certificate in App Service, your certificate must meet all the following requirements:

* Signed by a trusted certificate authority
* Exported as a password-protected PFX file
* Contains private key at least 2048-bits long
* Contains all intermediate certificates in the certificate chain

> [!TIP]
> If you [buy an SSL certificate in the Azure portal directly](web-sites-purchase-ssl-web-site.md), Azure takes care of all the requirements for you.
>
> 

> [!NOTE]
> **Elliptic Curve Cryptography (ECC) certificates** can work with App Service, but outside the scope
> of this article. Work with your certificate authority on the exact steps to create ECC certificates.
> 
>

## Step 1 - Prepare your app
To bind a custom SSL certificate to your app, your [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be in the **Basic**, **Standard**, or **Premium** tier. In this step, you make sure that your Azure app is in the supported pricing tier.

### Log in to Azure

Open the Azure portal. 

To do this, sign in to [https://portal.azure.com](https://portal.azure.com) with your Azure account.

### Navigate to your app
From the left menu, click **App Services**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/select-app.png)

You have landed in your app's _blade_ (a portal page that opens horizontally).  

### Check the pricing tier
In your app's **Overview** page, which opens by default, check to make sure that your app is in the **Basic**, **Standard**, or **Premium** tier.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/check-pricing-tier.png)

If you need to scale up, follow the next section. Otherwise, skip to [Step 3](#upload).

### Scale up your App Service plan

To scale up your plan, click **Scale up (App Service plan)** in the left-hand navigation.

Select the tier you want to scale to. For example, select **Basic**. When ready, click **Select**.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/choose-pricing-tier.png)

When you see the notification below, the scale operation is complete.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/scale-notification.png)

<a name="upload"></a>

## Step 2 - Upload and bind your SSL certificate

You are ready to upload your SSL certificate to your App Service app. 

### Upload your SSL certificate

To upload your SSL certificate, click **SSL certificates** in the left-hand navigation of your web app.

Click **Upload Certificate**.

In **PFX Certificate File**, select the PFX file that [you exported earlier](#export). In **Certificate password**, type the password that you created when exporting the PFX file.

Click **Upload**.

![](./media/app-service-web-tutorial-custom-ssl/upload-certificate.png)

When App Service finishes uploading your certificate, it appears in the **SSL certificates** page.

![](./media/app-service-web-tutorial-custom-ssl/certificate-uploaded.png)

### Bind your SSL certificate

You should now see your uploaded certificate back in the **SSL certificate** page.

In the **SSL bindings** section, click **Add binding**.

In the **Add SSL Binding** blade, use the dropdowns to select the domain name to secure, and the certificate to use. 

In **SSL Type**, select whether to use **[Server Name Indication (SNI)](http://en.wikipedia.org/wiki/Server_Name_Indication)** or IP-based SSL.
   
- **IP based SSL** - Only one IP-based SSL binding may be added. This option allows only one SSL certificate to secure a dedicated public IP address. To secure multiple domains, you must secure them all using the same SSL certificate. This is the traditional option for SSL binding. 
- **SNI based SSL** - Multiple SNI-based SSL bindings may be added. This option allows multiple SSL certificates to secure multiple domains on the same IP address. Most modern browsers (including Internet Explorer, Chrome, Firefox, and Opera) support SNI (find more comprehensive browser support information at [Server Name Indication](http://wikipedia.org/wiki/Server_Name_Indication)).

Click **Add Binding**.

![insert image of SSL Bindings](./media/app-service-web-tutorial-custom-ssl/bind-certificate.png)

When App Service finishes uploading your certificate, it appears in the **SSL bindings** sections.

![insert image of SSL Bindings](./media/app-service-web-tutorial-custom-ssl/certificate-bound.png)

## Step 3 - Change your DNS mapping (IP-based SSL only)

If you don't use IP-based SSL in your app, skip to [Step 6](#test). 

By default, your app uses a shared public IP address. As soon as you create an IP-based SSL, App Service creates a new, dedicated IP address for the binding.

This only affects you if you [mapped your custom DNS name with an A record](web-sites-custom-domain-name.md#a). Your A record is mapped to your app's old, shared IP address, but it should be mapped to the dedicated IP address.

Your app's **Custom domain** page is updated with the new, dedicated IP address. [Copy this IP address](app-service-web-tutorial-custom-domain.md#info), then [remap the A record](web-sites-custom-domain-name.md#a) to this new IP address.

<a name="test"></a>

## Step 4 - Test HTTPS for your custom domain
All that's left to do now is to make sure that HTTPS works for your custom domain. In various browsers, browse
to `https://<your.custom.domain>` to see that it serves up your app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/app-with-custom-ssl.png)

> [!NOTE]
> If your app gives you certificate validation errors, you're probably using a self-signed certificate.
>
> If that's not the case, you may have left out intermediate certificates when you export your certificate to the PFX file. 
>
>

<a name="bkmk_enforce"></a>

## Enforce HTTPS on your app
If you still want to allow HTTP access to your app, skip this step. 

App Service does *not* enforce HTTPS, so anyone can still access your app using HTTP. To enforce HTTPS for your app, you can define a rewrite rule in the `web.config` file for your app. Every App Service app has this file, regardless of the language framework of your app.

> [!NOTE]
> There is language-specific redirection of requests. ASP.NET MVC can use the [RequireHttps](http://msdn.microsoft.com/library/system.web.mvc.requirehttpsattribute.aspx) filter instead of the rewrite rule in `web.config` (see [Deploy a secure ASP.NET MVC 5 app to a web app](web-sites-dotnet-deploy-aspnet-mvc-app-membership-oauth-sql-database.md)).
> 
> 

### Open the Kudu debug console

In your browser, open the Kudu debug console for your app. 

To do this, navigate to `https://<app_name>.scm.azurewebsites.net/DebugConsole`.

### Edit web.config

In the debug console, CD to `D:\home\site\wwwroot`.

This is the root directory of all your app's files.

If you deploy your app with Visual Studio or Git, App Service automatically generates the appropriate `web.config` for your .NET, PHP, Node.js, or Python app in the application root. If `web.config` doesn't exist, run `touch web.config` in the web-based command prompt to create it. 

```
touch web.config
```

Open `web.config` by clicking the pencil button.
   
![](./media/app-service-web-tutorial-custom-ssl/openwebconfig.png)

If you had to create a `web.config`, copy the following code into it and save it. If you opened an existing web.config, then you just need to copy the entire `<rule>` tag into your `web.config`'s `configuration/system.webServer/rewrite/rules` element.

```xml   
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- BEGIN rule TAG FOR HTTPS REDIRECT -->
        <rule name="Force HTTPS" enabled="true">
          <match url="(.*)" ignoreCase="false" />
          <conditions>
            <add input="{HTTPS}" pattern="off" />
          </conditions>
          <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" appendQueryString="true" redirectType="Permanent" />
        </rule>
        <!-- END rule TAG FOR HTTPS REDIRECT -->
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

This rule returns an HTTP 301 (permanent redirect) to the HTTPS protocol whenever the user makes an HTTP request to your app. For example, it redirects from `http://contoso.com` to `https://contoso.com`.

> [!NOTE]
> If there are already other `<rule>` tags in your `web.config`, then place the copied `<rule>` tag before the other `<rule>` tags.
> 
> 

Save the file in the Kudu debug console. It is effective immediately.

For more information on the IIS URL Rewrite module, see the [URL Rewrite](http://www.iis.net/downloads/microsoft/url-rewrite) documentation.

## Scripted management

You can automate SSL bindings for your App Service app in the command line, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azureps-cmdlets-docs/).

### Azure CLI

The following command uploads an exported PFX file and gets the thumbprint. 

```bash
thumprint=$(az appservice web config ssl upload --certificate-file <path_to_PFX_file> \
--certificate-password <PFX_password> --name <app_name> --resource-group <resource_group_name> \
--query thumbprint --output tsv)
```

The following command adds an SNI based SSL binding, using the thumbprint from the previous command.

```bash
az appservice web config ssl bind --certificate-thumbprint $thumbprint --ssl-type SNI \
--name <app_name> --resource-group <resource_group_name>
```

### Azure PowerShell

The following command uploads an exported PFX file and adds an SNI based SSL binding.

```PowerShell
New-AzureRmWebAppSSLBinding -WebAppName <app_name> -ResourceGroupName <resource_group_name> -Name <dns_name> `
-CertificateFilePath <path_to_PFX_file> -CertificatePassword <PFX_password> -SslState SniEnabled
```
## More Resources
* [Microsoft Azure Trust Center](/support/trust-center/security/)
* [Configuration options unlocked in Azure Web Sites](https://azure.microsoft.com/blog/2014/01/28/more-to-explore-configuration-options-unlocked-in-windows-azure-web-sites/)
* [Enable diagnostic logging](web-sites-enable-diagnostic-log.md)
* [Configure web apps in Azure App Service](web-sites-configure.md)


