<properties pageTitle="Configure a Directnic domain name for an Azure website" description="Learn how to configure an Azure website to use a domain name registered with Directnic" services="web-sites" documentationCenter="" authors="blackmist" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr,jroth"/>

#Configuring a custom domain name for an Azure Website (Directnic)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-custom-domain-name" title="Custom Domain">Custom Domain</a><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain-name" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain-name" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain-name" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain-name" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain-name" title="Directnic" class="current">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain-name/" title="Websites" class="current">Website</a> | <a href="/en-us/documentation/articles/web-sites-directnic-traffic-manager-custom-domain-name/" title="Website using Traffic Manager">Website using Traffic Manager</a></div>

[WACOM.INCLUDE [websites-cloud-services-css-guided-walkthrough](../includes/websites-cloud-services-css-guided-walkthrough.md)]


[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides instructions on using a custom domain name purchased from [DirectNic.com](https://directnic.com) with Azure Websites.

[WACOM.INCLUDE [introfooter](../includes/custom-dns-web-site-intro-notes.md)]

In this article:

-   [Understanding DNS records](#understanding-records)
-   [Configure your web sites for basic, shared or standard mode](#bkmk_configsharedmode)
-   [Add a DNS record for your custom domain](#bkmk_configurecname)
-   [Enable the domain on your web site](#enabledomain)

<h2><a name="understanding-records"></a>Understanding DNS records</h2>

[WACOM.INCLUDE [understandingdns](../includes/custom-dns-web-site-understanding-dns-raw.md)]

<h2><a name="bkmk_configsharedmode"></a>Configure your websites for basic, shared or standard mode</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-modes.md)]

<a name="bkmk_configurecname"></a><h2>Add a DNS record for your custom domain</h2>

To associate your custom domain with an Azure Website, you must add a new entry in the DNS table for your custom domain by using tools provided by Directnic. Use the following steps to locate the DNS tools for Directnic.com

1. Log on to your account with Directnic.com, and select **My Services** and then **Domains**.

    ![Directnic Services Menu](.\media\web-sites-directnic-custom-domain-name\Directnic_DomainMenu.png)

2. Click the domain name that you wish to use with your Azure Website.

2. On the management page for your domain, click the **Manage** button for **DNS** in the **Services** pane.

    ![Services Panel](.\media\web-sites-directnic-custom-domain-name\Directnic_DomainManagement.png)

4. Add DNS records by filling in the **Type**, **Name**, and **Data** fields. When complete, click the **Add Record** button.   

    ![](.\media\web-sites-directnic-custom-domain-name\Directnic_DNS.png)

    * When adding a CNAME record, you must set the **Name** field to the sub-domain you wish to use. For example, **www**. You must set the **Data** field to the **.azurewebsites.net** domain name of your Azure Website. For example, **contoso.azurwebsites.net**.

    * When adding an A record, you must set the **Name** field to either **@** (this represents root domain name, such as **contoso.com**,) or the sub-domain you wish to use (for example, **www**). You must set the **Data** field to the IP address of your Azure Website.

		> [AZURE.NOTE] If you will be using an A record, you must also add a CNAME record with one of the following configurations:
		> 
		> * A **Name** value of **www** with a **Data** value of **&lt;yourwebsitename&gt;.azurewebsites.net**.
		> 
		> OR
		> 
		> * A **Name** value of **awverify.www** with a **Data** value of **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**.
		> 
		> This CNAME record is used by Azure to validate that you own the domain described by the A record


<h2><a name="enabledomain"></a>Enable the domain name on your website</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
