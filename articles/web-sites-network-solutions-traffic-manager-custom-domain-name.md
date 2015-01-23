<properties title="" pageTitle="Configure a Network Solutions domain name for an Azure website that uses Traffic Manager" metaKeywords="Azure, Azure Web Sites, domain name" description="" services="web-sites" documentationCenter="" authors="blackmist" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr, jroth" />

#Configuring a custom domain name for an Azure Website using Traffic Manager (Network Solutions)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-custom-domain-name" title="Custom Domain">Custom Domain</a><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions" class="current">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain-name" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain-name" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain-name" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain-name" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain-name" title="Directnic">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name/" title="Websites">Website</a> | <a href="/en-us/documentation/articles/web-sites-network-solutions-traffic-manager-custom-domain-name/" title="Website using Traffic Manager" class="current">Website using Traffic Manager</a></div>

[AZURE.INCLUDE [websites-cloud-services-css-guided-walkthrough](../includes/websites-cloud-services-css-guided-walkthrough.md)]

[AZURE.INCLUDE [intro](../includes/custom-dns-web-site-intro-traffic-manager.md)]

This article provides instructions on using a custom domain name purchased from [Network Solutions](https://www.networksolutions.com) with Azure Websites.

[AZURE.INCLUDE [tmwebsitefooter](../includes/custom-dns-web-site-traffic-manager-notes.md)]

[AZURE.INCLUDE [introfooter](../includes/custom-dns-web-site-intro-notes.md)]

In this article:

-   [Understanding DNS records](#understanding-records)
-   [Configure your web sites for standard mode](#bkmk_configsharedmode)
-   [Add a DNS record for your custom domain](#bkmk_configurecname)
-   [Enable Traffic Manager for your web site](#enabledomain)

<h2><a name="understanding-records"></a>Understanding DNS records</h2>

[AZURE.INCLUDE [understandingdns](../includes/custom-dns-web-site-understanding-dns-traffic-manager.md)]

<h2><a name="bkmk_configsharedmode"></a>Configure your websites for standard mode</h2>

[AZURE.INCLUDE [modes](../includes/custom-dns-web-site-modes-traffic-manager.md)]

<a name="bkmk_configurecname"></a><h2>Add a DNS record for your custom domain</h2>

To associate your custom domain with an Azure Website, you must add a new entry in the DNS table for your custom domain by using tools provided by Network Solutions. Use the following steps to locate and use the DNS tools.

1. Log on to your account at networksolutions.com, and select **My Account** in the upper right corner.

3. From the **My Products and Services** tab, select **Edit DNS**.

	![edit dns page](./media/web-sites-custom-domain-name/ns-editdns.png)

2. From the **Manage <yourdomainname>** section of the **Domain Names** page, select **Edit Advanced DNS Records**.

	![domain names page with edit advanced dns records highlighted](./media/web-sites-custom-domain-name/ns-editadvanced.png)

4. The **Update Advanced DNS** page contains a section for each record type, with an **Edit** button below each section. For CNAME records, use the **Host Alias (CNAME Records)** section.

	![update advanced dns page](./media/web-sites-custom-domain-name/ns-updatecnameadvanced.png)

5. When you click the **Edit** button, you will be presented with a form that you can use to modify existing records, or add new ones. 

	When adding a CNAME record, you must set the **Alias** field to the sub-domain you wish to use. For example, **www**. You must select the circle field beside the **Other host** field, and set **Other host** to the **.trafficmanager.net** domain name of the Traffic Manager profile used with your Azure Website. For example, **contoso.trafficmanager.net**. Leave the **Refers to Host Name** as **Select**, as this field is not required when creating a CNAME record for use with Azure Websites.
	
	![cname form](./media/web-sites-custom-domain-name/ns-cnametm.png)

5. When you have finished adding or modifying records, click **Continue** to review the changes. Select **Save changes only** to save the changes.

<h2><a name="enabledomain"></a>Enable Traffic Manager website</h2>

[AZURE.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-traffic-manager.md)]
