<properties title="Custom domain name" pageTitle="Configuring a custom domain name for a Windows Azure web site" metaKeywords="Windows Azure, Windows Azure Web Sites, domain name" description="" services="Web Sites" documentationCenter="" authors="jroth" />

#Configuring a custom domain name for a Windows Azure web site (Directnic)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain" title="Directnic" class="current">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name/" title="Web Sites" class="current">Web Site</a> | <a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name-traffic-manager/" title="Web Site using Traffic Manager">Web Site using Traffic Manager</a></div>

[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides instructions on using a custom domain name purchased from DirectNic.com with Azure Web Sites.

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

To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for your custom domain by using tools provided by Directnic. Use the following steps to locate the DNS tools for Directnic.com

1. Log on to your account with Directnic.com, and select **My Services** and then **Domains**. 

    ![Directnic Services Menu](.\media\web-sites-directnic-custom-domain-name\Directnic_DomainMenu.png)

2. Click the domain name that you wish to use with your Azure Web Site.

2. On the management page for your domain, click the **Manage** button for **DNS** in the **Services** pane.

    ![Services Panel](.\media\web-sites-directnic-custom-domain-name\Directnic_DomainManagement.png)

4. Add DNS records by filling in the **Type**, **Name**, and **Data** fields. When complete, click the **Add Record** button.

    ![](.\media\web-sites-directnic-custom-domain-name\Directnic_DNS.png)

    * When adding a CNAME record, you must set the **Name** field to the sub-domain you wish to use. For example, **www**. You must set the **Data** field to the **.azurewebsites.net** domain name of your Azure Web Site. For example, **contoso.azurwebsites.net**.

        > [WACOM.NOTE] It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

    * When adding an A record, you must set the **Name** field to either **@** (this represents root domain name, such as **contoso.com**,) or the sub-domain you wish to use (for example, **www**). You must set the **Data** field to the IP address of your Azure Web Site.

        > [WACOM.NOTE] When adding an A record, you must also add a CNAME record with a host of **www** and an **Address** of **&lt;yourwebsitename&gt;.azurewebsites.net**.

<h2><a name="enabledomain"></a>Enable the domain name on your web site</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
