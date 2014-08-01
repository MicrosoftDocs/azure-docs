<properties title="Learn how to configure an Azure web site to use a custom domain name" pageTitle="Configure a custom domain name for an Azure web site" metaKeywords="Azure, Azure Web Sites, domain name" description="" services="web-sites" documentationCenter="" authors="larryfr, jroth" />

#Configuring a custom domain name for an Azure Web Site

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-custom-domain-name" title="Custom Domain" class="current">Custom Domain</a><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain-name" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain-name" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain-name" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain-name" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain-name" title="Directnic">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-custom-domain-name/" title="Web Sites" class="current">Web Site</a> | <a href="/en-us/documentation/articles/web-sites-traffic-manager-custom-domain-name/" title="Web Site using Traffic Manager">Web Site using Traffic Manager</a></div>

[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides generic instructions for using a custom domain name with Azure Web Sites. Please check the tabs at the top of this article to see if your domain registrar is listed. If so, please select that tab for registrar specific steps.

[WACOM.INCLUDE [introfooter](../includes/custom-dns-web-site-intro-notes.md)]

In this article:

-   [Understanding DNS records](#understanding-records)
-   [Configure your web sites for basic, shared or standard mode](#bkmk_configsharedmode)
-   [Add a DNS record for your custom domain](#bkmk_configurecname)
-   [Enable the domain on your web site](#enabledomain)

<h2><a name="understanding-records"></a>Understanding DNS records</h2>

[WACOM.INCLUDE [understandingdns](../includes/custom-dns-web-site-understanding-dns-raw.md)]

<h2><a name="bkmk_configsharedmode"></a>Configure your web sites for basic, shared or standard mode</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-modes.md)]

<a name="bkmk_configurecname"></a><h2>Add a DNS record for your custom domain</h2>

To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for your custom domain by using tools provided by the domain registrar that you purchased your domain name from. Use the following steps to locate and use the DNS tools.

1. Log on to your account at your domain registrar, and look for a page for managing DNS records. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**. Often a link to this page can be found be viewing your account information, and then looking for a link such as **My domains**.

4. Once you have found the management page for your domain name, look for a link that allows you to edit the DNS records. This might be listed as a **Zone file**, **DNS Records**, or as an **Advanced** configuration link.

	* The page will most likely have a few records already created, such as an entry associating '**@**' or '\*' with a 'domain parking' page. It may also contain records for common sub-domains such as **www**.
	* The page will mention **A records** and **CNAME records**, or provide a drop-down to select a record type. It may also mention other records such as **MX records**. In some cases, these will be called by other names such as **IP Address records** instead A records, or **Alias Records** instead of CNAME records.
	* The page will also have fields that allow you to **map** from a **Host name** or **Domain name** to an **IP Address** or other domain name.

5. While the specifics of each registrar vary, in general you map *from* your custom domain name (such as **contoso.com**,) *to* the Azure Web Site domain name (**contoso.azurewebsites.net**) or the Azure Web Site virtual IP address.

	* CNAME records will always map to the Azure Web Sites domain - **contoso.azurewebsites.net**. So you will be mapping *from* a domain such as **www** *to* your **&lt;yourwebsitename&gt;.azurewebsites.net** address.
	
		> [WACOM.NOTE] If you will be using an A record, you must also add a CNAME record that maps *from* **awverify** *to* **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**.
		>  
		> * To map the root domain, or create a wildcard mapping for sub-domains immediately off the root, map *from* **awverify** *to* **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**.
		> 
		> OR
		> 
		> * To map a specific sub-domain, map *from* **awverify.&lt;subdomainname>** *to* **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**. For example, the verification CNAME record for the **mail.contoso.com** sub-domain would map from **awverify.mail** to **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**.
		> 
		> This CNAME record is used by Azure to validate that you own the domain described by the A record.

	* A records will always map to the Azure Web Sites virtual IP address. So you are mapping *from* a domain such as **www** *to* the web site's virtual IP address.
	
		> [WACOM.NOTE] To map a root domain (such as **contoso.com**,) to an Azure Web Site, you will often map from '**@**', or a blank entry to the virtual IP address. To create a wildcard mapping that maps all sub-domains to the virtual IP address, you will usually map from '*' to the virtual IP address.
		> 
		> The specifics of mapping a root or wildcard vary between registrars. Consult the documentation provided by your registrar for more specific guidance.

6. Once you have finished adding or modifying DNS records at your registrar, save the changes.

<h2><a name="enabledomain"></a>Enable the domain name on your web site</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
