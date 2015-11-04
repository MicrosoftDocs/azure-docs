<properties
	pageTitle="Configure a custom domain name in Azure App Service"
	description="Learn how to use a custom domain name with a web app in Azure App Service."
	services="app-service"
	documentationCenter=""
	authors="cephalin"
	manager="wpickett"
	editor="jimbe"
	tags="top-support-issue"/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/23/2015"
	ms.author="cephalin"/>

# Configure a custom domain name in Azure App Service

> [AZURE.SELECTOR]
- [Buy Domain for Web Apps](custom-dns-web-site-buydomains-web-app.md)
- [Web Apps with External Domains](web-sites-custom-domain-name.md)
- [Web Apps with Traffic Manager](web-sites-traffic-manager-custom-domain-name.md)
- [GoDaddy](web-sites-godaddy-custom-domain-name.md)

When you create a web app, Azure assigns it to a subdomain of azurewebsites.net. For example, if your web app is named **contoso**, the URL is **contoso.azurewebsites.net**. Azure also assigns a virtual IP address.

For a production web app, you may want users to see a custom domain name. This article explains how to configure a custom domain with [App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714).

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**.

[AZURE.INCLUDE [introfooter](../../includes/custom-dns-web-site-intro-notes.md)]

## Overview

If you haven't already registered for an external domain name (i.e. not *.azurewebsites.net) already, the easiest way to set up a custom domain is to buy one directly in the [Azure preview portal](https://portal.azure.com). The process enables you to manage your web app's domain name directly in the portal instead of going to a third-party site like GoDaddy to manage it. Likewise, configuring the domain name in your web app is greatly simplified, whether your web app uses [Azure Traffic Manager](web-sites-traffic-manager-custom-domain-name.md) or not. For more information, see [Buy and Configure a custom domain name in Azure App Service](custom-dns-web-site-buydomains-web-app.md).

If you have a domain name already, or you want reserve domain from other domain registrars, here are the general steps to bring a custom domain name for web app (see [specific instructions for GoDaddy.com](web-sites-godaddy-custom-domain-name.md)):

1. Reserve your domain name. This article does not cover that process. There are many domain registrars to choose from. When you sign up, their site will walk you through the process.
1. Create DNS records that map the domain to your Azure web app.
1. Add the domain name inside the [Azure Portal](http://go.microsoft.com/fwlink/?LinkId=529715).

Within this basic outline, there are specific cases to consider:

- Mapping your root domain. The root domain is the domain that you reserved with the domain registrar. For example, **contoso.com**.
- Mapping a subdomain. For example, **blogs.contoso.com**.  You can map different subdomains to different web apps.
- Mapping a wildcard. For example, **\*.contoso.com**. A wildcard entry applies to all subdomains of your domain.

[AZURE.INCLUDE [modes](../../includes/custom-dns-web-site-modes.md)]


## DNS record types

The Domain Name System (DNS) uses data records to map domain names into IP addresses. There are several types of DNS records. For web apps, you’ll create either an *A* record or a *CNAME* record.

- An A **(Address)** record maps a domain name to an IP address.
- A **CNAME (Canonical Name)** record maps a domain name to another domain name. DNS uses the second name to look up the address. Users still see the first domain name in their browser. For example, you could map contoso.com to *&lt;yourwebapp&gt;*.azurewebsites.net.

If the IP address changes, a CNAME entry is still valid, whereas an A record must be updated. However, some domain registrars do not allow CNAME records for the root domain or for wildcard domains. In that case, you must use an A record.

> [AZURE.NOTE] The IP address may change if you delete and recreate your web app, or change the web app mode back to free.


## Find the virtual IP address

Skip this step if you are creating a CNAME record. To create an A record, you need the virtual IP address of your web app. To get the IP address:

1.	In your browser, open the [Azure Portal](https://portal.azure.com).
2.	Click the **Browse** option on the left side of the page.
3.	Click the **Web Apps** blade.
4.	Click the name of your web app.
5.	In the **Essentials** page, click **All settings**.
6.	Click **Custom domains and SSL**.
7.	In the **Custom domains and SSL** blade, click **Bring External Domains"**. The IP address is located at the bottom of this part.

## Create the DNS records

Log in to your domain registrar and use their tool to add an A record or CNAME record. Every registrar’s web app is slightly different, but here are some general guidelines.

1.	Find the page for managing DNS records. Look for links or areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**. Often the link can be found be viewing your account information, and then looking for a link such as **My domains**.
2.	When you find the management page, look for a link that lets you add or edit DNS records. This might be listed as a **Zone file**, **DNS Records**, or as an **Advanced** configuration link.

The page might list A records and CNAME records separately, or else provide a drop-down to select the record type. Also, it might use other names for the record types, such as **IP Address record** instead of A record, or **Alias Record** instead of CNAME record.  Usually the registrar creates some records for you, so there may already be records for the root domain or common subdomains, such as **www**.

When you create or edit a record, the fields will let you map your domain name to an IP address (for A records) or another domain (for CNAME records). For a CNAME record, you will map *from* your custom domain *to* your azurewebsites.net subdomain.

In many registrar tools, you will just type the subdomain portion of your domain, not the entire domain name. Also, many tools use ‘@’ to mean the root domain. For example:

<table cellspacing="0" border="1">
  <tr>
    <th>Host</th>
    <th>Record type</th>
    <th>IP Address or URL</th>
  </tr>
  <tr>
    <td>@</td>
    <td>A (address)</td>
    <td>168.62.48.183</td>
  </tr>
  <tr>
    <td>www</td>
    <td>CNAME (alias)</td>
    <td>contoso.azurewebsites.net</td>
  </tr>
</table>

Assuming the custom domain name is ‘contoso.com’, this would create the following records:

- **contoso.com** mapped to 168.62.48.183.
- **www.contoso.com** mapped to **contoso.azurewebsites.net**.

>[AZURE.NOTE] You can use Azure DNS to host the necessary domain records for your web app. To configure your custom domain, and create your records, in Azure DNS, see [Create custom DNS records for a web app](../dns-web-sites-custom-domain).

<a name="awverify" />
## Create an awverify record (A records only)

If you create an A record, web app also requires a special CNAME record, which is used to verify that you own the domain you are attempting to use. This CNAME record must have the following form.

- *If the A record maps the root domain or a wildcard domain:* Create a CNAME record that maps from **awverify.&lt;yourdomain&gt;** to **awverify.&lt;yourwebappname&gt;.azurewebsites.net**.  For example, if the A record is for **contoso.com**, create a CNAME record for **awverify.contoso.com**.
- *If the A record maps a specific subdomain:* Create a CNAME record that maps from **awverify.&lt;subdomain&gt;** to **awverify.&lt;yourwebappname&gt;.azurewebsites.net**. For example, if the A record is for **blogs.contoso.com**, create a CNAME record for **awverify.blogs.contoso.com**.

Visitors to your web app will not see the awverify subdomain; it’s only for Azure to verify your domain.

## Enable the domain name on your web app

[AZURE.INCLUDE [modes](../../includes/custom-dns-web-site-enable-on-web-site.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Verify DNS propagation

After you finish the configuration steps, it can take some time for the changes to propagate, depending on your DNS provider. You can verify that the DNS propagation is working as expected by using [http://digwebinterface.com/](http://digwebinterface.com/). After you browse to the site, specify the hostnames in the textbox and click **Dig**. Verify the results to confirm if the recent changes have taken effect.  

![](./media/web-sites-custom-domain-name/1-digwebinterface.png)

> [AZURE.NOTE] The propagation of the DNS entries takes up to 48 hours (sometimes longer). If you have configured everything correctly, you still need to wait for the propagation to succeed.

## Next steps

For more information please see: [Get started with Azure DNS](../dns/dns-getstarted-create-dnszone.md) and [Delegate Domain to Azure DNS](../dns/dns-domain-delegation.md)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)

<!-- Anchors. -->
[Overview]: #overview
[DNS record types]: #dns-record-types
[Find the virtual IP address]: #find-the-virtual-ip-address
[Create the DNS records]: #create-the-dns-records
[Enable the domain name on your web app]: #enable-the-domain-name-on-your-web-app

<!-- Images -->
[subdomain]: media/web-sites-custom-domain-name/azurewebsites-subdomain.png
