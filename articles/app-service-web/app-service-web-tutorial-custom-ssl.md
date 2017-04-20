---
title: Bind a third-party SSL certificate to an Azure web app | Microsoft Docs 
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
# Bind a third-party SSL certificate to an Azure web app

This tutorial shows you how to bind a custom SSL certificate that you purchased from elsewhere to your web app, mobile app backend, or API app in [Azure App Service](../app-service/app-service-value-prop-what-is.md). When you're finished, you'll be able to access your app at the HTTPS endpoint of your custom DNS domain.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/app-with-custom-ssl.png)

> [!TIP]
> If you want to, you can just [buy an SSL certificate in the Azure portal directly and bind it to your app](web-sites-purchase-ssl-web-site.md). 
>
> 

## Before you begin
Before following this tutorial, make sure that you have done the following:

- [Create an App Service app](/azure/app-service/)
- [Map a custom DNS name to your app](web-sites-custom-domain-name.md)

<a name="obtain"></a>

## Step 2 - Obtain your SSL certificate

In this step, you obtain an SSL certificate from a third-party certificate authority. To use your certificate in App Service, your certificate must meet all the following requirements:

* Signed by a trusted certificate authority (no private certificate authorities)
* Contains a private key
* Created for key exchange
* Minimum of 2048-bit encryption
* Exported as a PFX file
* Subject name matches your custom DNS domain
* For a wildcard certificate, use a wildcard name (e.g. **\*.contoso.com**) or specify `subjectAltName` values
* Merged all intermediate certificates in the certificate chain

> [!TIP]
> This tutorial shows you how to obtain a certificate that satisfies these requirements. However, if you [buy an SSL certificate in the Azure portal directly and bind it to your app](web-sites-purchase-ssl-web-site.md), Azure takes care of all the requirements for you.
>
> 

> [!NOTE]
> **Elliptic Curve Cryptography (ECC) certificates** can work with App Service, but outside the scope
> of this article. Work with your CA on the exact steps to create ECC certificates.
> 
>

### Install OpenSSL

You can use any SSL you prefer to manage your SSL certificates. This tutorial shows you the steps using the popular tool [OpenSSL](https://www.openssl.org/).

MacOS and most popular Linux distributions already has OpenSSL installed. For Windows machines, you can install OpenSSL from [GnuWin at SourceForge](http://gnuwin32.sourceforge.net/packages/openssl.htm).

<a name="request"></a>

### Create the certificate request

To request an SSL certificate, you first need a certificate signing request (CSR). Follow one of the two options depending on your need:

- [Request for single DNS name](#single) - Secure one DNS name (e.g. `www.contoso.com`) with one SSL certificate, or secure one wildcard name (e.g. `*.contoso.com`) with one SSL certificate.
- [Request for single DNS name](#multiple) - Secure multiple DNS names (e.g. `contoso.com` _and_ `www.contoso.com`) with one SSL certificate.

<a name="single"></a>

#### Request for single DNS name

In a command-line terminal, `CD` into a working directory generate a private key and certificate signing request (CSR).

```   
openssl req -sha256 -new -nodes -keyout myserver.key -out myserver.csr -newkey rsa:2048
```

When prompted, enter the appropriate information. For example:

```
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:Washington
Locality Name (eg, city) []:Redmond
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Contoso Corporation
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:www.contoso.com
...
```

Make sure that you use your custom DNS name in `Common Name`.

When finished, skip to [Submit your certificate request](#submit).

<a name="multiple"></a>

#### Request for multiple DNS names

Create a file named `sancert.cnf`, copy the following text into it, and save it in a working directory:

```   
# -------------- BEGIN custom sancert.cnf -----
HOME = .
oid_section = new_oids
[ new_oids ]
[ req ]
default_days = 730
distinguished_name = req_distinguished_name
encrypt_key = no
string_mask = nombstr
req_extensions = v3_req # Extensions to add to certificate request
[ req_distinguished_name ]
countryName = Country Name (2 letter code)
countryName_default =
stateOrProvinceName = State or Province Name (full name)
stateOrProvinceName_default =
localityName = Locality Name (eg, city)
localityName_default =
organizationalUnitName  = Organizational Unit Name (eg, section)
organizationalUnitName_default  =
commonName              = Your common name (eg, domain name)
commonName_default      = www.mydomain.com
commonName_max = 64
[ v3_req ]
subjectAltName=DNS:ftp.mydomain.com,DNS:blog.mydomain.com,DNS:*.mydomain.com
# -------------- END custom sancert.cnf -----
```

In the line that begins with `subjectAltName`, replace the value with all domain names you want to secure (in addition to 
`commonName`). For example:

```
subjectAltName=DNS:sales.contoso.com,DNS:support.contoso.com
```

You do not need to change any other field, including `commonName`. You'll be prompted to specify them in the next few steps.

In a command-line terminal, `CD` into the directory that has the `sancert.cnf` and generate a private key and certificate signing request (CSR).

```
openssl req -sha256 -new -nodes -keyout myserver.key -out myserver.csr -newkey rsa:2048 -config sancert.cnf
```

When prompted, enter the appropriate information. For example:

```   
Country Name (2 letter code) []: US
State or Province Name (full name) []: Washington
Locality Name (eg, city) []: Redmond
Organizational Unit Name (eg, section) []: Azure
Your common name (eg, domain name) []: www.contoso.com
```

When finished, move on to [Submit your certificate request](#submit).

<a name="submit"></a>

### Submit your certificate request

Regardless which route you took, you should now have two files in your working directory: `myserver.key` and `myserver.csr`. The `myserver.csr` contains the certificate signing request, and you need `myserver.key` later.

Submit your certificate request to a certificate authority to obtain an SSL certificate. For a list of certificate authorities trusted by Microsoft, see [Microsoft Trusted Root Certificate Program: Participants](http://aka.ms/trustcertpartners).

<a name="save"></a>

### Save your SSL certificate

Once the certificate authority sends you the requested certificate, save it to a file named `myserver.crt` in your working directory. 

If your certificate authority provides it in a text format, copy the content into `myserver.crt` in a text editor and save it. Your file should look like the following:

```   
-----BEGIN CERTIFICATE-----
<Base64-encoded certificate data>
-----END CERTIFICATE-----
```

If your certificate authority sends you any intermediate certificates, save them into your working directory as well. They usually come as a separate download from your certificate authority, and in several formats for different web server types. Select the version with the `.pem` extension.

<a name="export"></a>

### Export certificate to PFX

Your certificate must be exported to a PFX file so that it can be uploaded to Azure App Service. To do this, you need the following files in your working directory:

- `myserver.crt` - Your SSL certificate, [signed by your certificate authority](#save).
- `myserver.key` - The private key you generated when you [created the certificate request](#request).
- Any intermediate certificates - You need to include them in the exported PFX file.

Export your certificate to a PFX file named `myserver.pfx` with the command below. When prompted, define a password to secure the .pfx file.

Without intermediate certificates:

```
openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt
```

With intermediate certificates:

```
openssl pkcs12 -chain -export -out myserver.pfx -inkey myserver.key -in myserver.crt -certfile intermediate-cets.pem
```

The command above adds an intermediate certificate file named `intermediate-cets.pem`.

## Step 3 - Prepare your app
To bind a custom SSL certificate to your app, your [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be in the **Basic**, **Standard**, or **Premium** tier. In this step, you make sure that your Azure app is in the supported pricing tier.

### Log in to Azure

Open the Azure portal. 

To do this, sign in to [https://portal.azure.com](https://portal.azure.com) with your Azure account.

### Navigate to your app
From the left menu, click **App Services**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/select-app.png)

You have landed in your app's _blade_ (a portal page that opens horizontally).  

### Check the pricing tier
In the **Overview** page, which opens by default, check to make sure that your app is in the **Basic**, **Standard**, or **Premium** tier.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/check-pricing-tier.png)

If you need to scale up, follow the next section. Otherwise, skip to [Step 3](#upload).

### Scale up your App Service plan

To scale up your plan, click **Scale up (App Service plan)** in the left pane.

Select the tier you want to scale to. For example, select **Basic**. When ready, click **Select**.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/choose-pricing-tier.png)

When you see the notification below, the scale operation is complete.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-ssl/scale-notification.png)

<a name="upload"></a>

## Step 4 - Upload and bind your SSL certificate

At this point, you should have a PFX file that contains your exported certificate that includes your private key and any intermediate certificates. Your app is also in a supported pricing tier. You are ready to upload your SSL certificate to your Azure app. 

### Upload your SSL certificate

To upload your SSL certificate, click **SSL certificates** in the left pane.

Click **Upload Certificate**.

In **PFX Certificate File**, select the .pfx file that [you exported earlier](#export). In **Certificate password**, type the password that you used when exporting the PFX.

Click **Upload**.

![](./media/app-service-web-tutorial-custom-ssl/upload-certificate.png)

When App Service finishes uploading your certificate, it appears in the **SSL certificates** page.

![](./media/app-service-web-tutorial-custom-ssl/certificate-uploaded.png)

### Bind your SSL certificate

You should now see your uploaded certificate back in the **SSL certificate** page.

In the **SSL bindings** section, click **Add binding**.

In the **Add SSL Binding** blade, use the dropdowns to select the domain name to secure, and the certificate to use. 

In **SSL Type**, select whether to use **[Server Name Indication (SNI)](http://en.wikipedia.org/wiki/Server_Name_Indication)** or IP-based SSL.
   
- **IP based SSL** - Only one IP-based SSL binding may be added. This option allows only one SSL certificate to secure a dedicated public IP address. To secure multiple domains for an app (contoso.com, fabricam.com, etc.), you must secure them all using the same SSL certificate because there can be only one dedicated public IP address per app. This is the traditional option for SSL binding. 
- **SNI based SSL** - Multiple SNI-based SSL bindings may be added. This option allows multiple SSL certificates to secure multiple domains on the same IP address. Most modern browsers (including Internet Explorer, Chrome, Firefox, and Opera) support SNI. For more comprehensive browser support information, see the [Server Name Indication](http://wikipedia.org/wiki/Server_Name_Indication) article on Wikipedia.

Click **Add Binding**.

![insert image of SSL Bindings](./media/app-service-web-tutorial-custom-ssl/bind-certificate.png)

When App Service finishes uploading your certificate, it appears in the **SSL bindings** sections.

![insert image of SSL Bindings](./media/app-service-web-tutorial-custom-ssl/certificate-bound.png)

## Step 5 - Change your DNS mapping (IP-based SSL only)

If you don't use IP-based SSL in your app, skip to [Step 6](#test). 

By default, your app uses a shared public IP address. As soon as you create an IP-based SSL, App Service creates a new, dedicated IP address for the binding.

The following table shows how this dedicated IP address affects your app and what you should do about it.

| Scenario | Issues | Required steps |
| - | - | - |
| You mapped your custom DNS name with a CNAME record | No issues. `<app_name>.azurewebsites.net` is automatically redirected to the dedicated IP address. | None. |
| You mapped your custom DNS name with an A record | Your A record is mapped to your app's old, shared IP address, but it should be mapped to the dedicated IP address. | Your app's **Custom domain** page is updated with the new, dedicated IP address. [Copy this IP address](app-service-web-tutorial-custom-domain.md#info). <br> Then, [Remap the A record](web-sites-custom-domain-name.md#a) to this new IP address. |
| Your app has existing SNI-based SSLs for [_CNAME-mapped_ DNS names](web-sites-custom-domain-name.md#cname) | Your CNAME records are mapped to `<app_name>.azurewebsites.net`, which is now redirected to the dedicated IP address. However, the dedicated IP address is used only for the IP-based SSL and not for your existing SNI-based SSLs. | To send traffic back to the original shared IP address, [remap each SNI-secured CNAME mapping](web-sites-custom-domain-name.md#cname) to `sni.<app_name>.azurewebsites.net` instead of `<app_name>.azurewebsites.net`. |

<a name="test"></a>

## Step 6 - Test HTTPS for your custom domain
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


