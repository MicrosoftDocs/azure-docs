<properties title="Custom domain name" pageTitle="Configuring a custom domain name for a Windows Azure web site" metaKeywords="Windows Azure, Windows Azure Web Sites, domain name" description="" services="Web Sites" documentationCenter="" authors="" />

#Configuring a custom domain name for a Windows Azure web site

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy" class="current">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain" title="Enom">Enom</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name/" title="Web Sites" class="current">Web Site</a> | <a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name-traffic-manager/" title="Web Site using Traffic Manager">Web Site using Traffic Manager</a></div>

[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides instructions on using a custom domain name purchased from GoDaddy.com with Azure Web Sites.

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

To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for your custom domain by using tools provided by GoDaddy. Use the following steps to locate the DNS tools for GoDaddy.com

1. Log on to your account with GoDaddy.com, and select **My Account** and then **Manage your domains**. Finally, select the domain name that you wish to use with your Azure Web Site.

	![custom domain page for GoDaddy][godaddydomain]

2. From the **Domain details** page, select the **DNS Zone File** tab. This is the section used for adding and modifying DNS records for your domain name.

	![DNS Zone File tab][godaddyzonetab]

3. To edit the DNS records, select the **Edit** button. This will display the **Zone File Editor**.

	![edit button[godaddyeditbutton]

4. The **Zone File Editor** is broken out into sections for each record type, starting with A records (listed as **A (Host)** as the very first section, followed by CNAME records (listed as **CNAME (Alias)**.) To add a new entry, use the **Quick Add** button below the corresponding section. To edit an existing entry, select that entry and modify the existing information.

	![zone file editor][godaddyzonefileeditor]

	> [WACOM.NOTE] Before adding entries to the zone file, note that GoDaddy has already created DNS records for popular sub-domains (called **Host** in editor,) such as **email**, **files**, **mail**, and others. If the name you wish to use already exists, modify the existing record instead of creating a new one.

	* When adding a CNAME record, you must set the **host** field to the sub-domain you wish to use. For example, **www**. You must set the **Points to** field to the **.azurewebsites.net** domain name of your Azure Web Site. For example, **contoso.azurwebsites.net**.

	* When adding an A record, you must set the **host** field to either **@** (this represents root domain name, such as **contoso.com**,) or the sub-domain you wish to use (for example, **www**.) You must set the **Points to** field to the IP address of your Azure Web Site.

		> [WACOM.NOTE] When adding an A record, you must also add a CNAME record with a host of **awverify**, and a **Points to** of **awverify.&lt;yourwebsitename&gt;.azurewebsites.net.

5. When you have finished adding or modifying records, click **Save Zone File** to save changes.

	![save zone file button][godaddysavezonefile]

	> [WACOM.NOTE] It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

<h2><a name="enabledomain"></a>Enable the domain name on your web site</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
