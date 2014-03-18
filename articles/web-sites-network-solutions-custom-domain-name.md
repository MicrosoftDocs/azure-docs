<properties title="Custom domain name" pageTitle="Configuring a custom domain name for a Microsoft Azure web site" metaKeywords="Windows Azure, Windows Azure Web Sites, domain name" description="" services="Web Sites" documentationCenter="" authors="" />

#Configuring a custom domain name for an Azure web site (Network Solutions)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions" class="current">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain" title="Directnic">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name/" title="Web Sites" class="current">Web Site</a> | <a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name-traffic-manager/" title="Web Site using Traffic Manager">Web Site using Traffic Manager</a></div>

[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides instructions on using a custom domain name purchased from [Network Solutions](https://networksolutions.com) with Azure Web Sites.

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

To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for your custom domain by using tools provided by Network Solutions. Use the following steps to locate and use the DNS tools for networksolutions.com

1. Log on to your account at networksolutions.com, and select **My Account** in the upper right corner.

3. From the **My Products and Services** tab, select **Edit DNS**.

	![edit dns page](./media/web-sites-custom-domain-name/ns-editdns.png)

2. From the **Manage <yourdomainname>** section of the **Domain Names** page, select **Edit Advanced DNS Records**.

	![domain names page with edit advanced dns records highlighted](./media/web-sites-custom-domain-name/ns-editadvanced.png)

4. The **Update Advanced DNS** page contains a section for each record type, with an **Edit** button below each section.
	
	* For A records, use the **IP Address (A Records)** section.
	* For CNAME records, use the **Host Alias (CNAME Records)** section.

	![update advanced dns page](./media/web-sites-custom-domain-name/ns-updateadvanced.png)

5. When you click the **Edit** button, you will be presented with a form that you can use to modify existing records, or add new ones. 

	> [WACOM.NOTE] Before adding entries to the zone file, note that Network Solutions has already created DNS records for popular sub-domains (called **Host** in editor,) such as **email**, **files**, **mail**, and others. If the name you wish to use already exists, modify the existing record instead of creating a new one.

	* When adding a CNAME record, you must set the **Alias** field to the sub-domain you wish to use. For example, **www**. You must select the circle field beside the **Other host** field, and set **Other host** to the **.azurewebsites.net** domain name of your Azure Web Site. For example, **contoso.azurwebsites.net**. Leave the **Refers to Host Name** as **Select**, as this field is not required when creating a CNAME record for use with Azure Web Sites.
	
		![cname form](./media/web-sites-custom-domain-name/ns-cname.png)

	* When adding an A record, you must set the **Host** field to either **@** (this represents root domain name, such as **contoso.com**,) or the sub-domain you wish to use (for example, **www**.) You must set the **Numeric IP** field to the IP address of your Azure Web Site.

		![a record form](./media/web-sites-custom-domain-name/ns-arecord.png)

		> [WACOM.NOTE] When adding an A record, you must also add a CNAME record with one of the following configurations:
		> 
		> * An **Alias** value of **www** with an **Other host** value of **&lt;yourwebsitename&gt;.azurewebsites.net**.
		> 
		> OR
		> 
		> * An **Alias** value of **awverify.www** with an **Other host** value of **awverify.&lt;yourwebsitename&gt;.azurewebsites.net.
		> 
		> This CNAME record is used by Azure to validate that you own the domain you are attempting to create an A record for.

5. When you have finished adding or modifying records, click **Continue** to review the changes. Select **Save changes only** to save the changes.

	> [WACOM.NOTE] It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

<h2><a name="enabledomain"></a>Enable the domain name on your web site</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
