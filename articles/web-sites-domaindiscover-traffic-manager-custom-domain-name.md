<properties pageTitle="Configure a DomainDiscover domain name for an Azure website using Traffic Manager" description="Learn how to configure an Azure website that uses Traffic Manager to use a domain name registered with DomainDiscover - TierraNet" services="web-sites" documentationCenter="" authors="blackmist" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr,jroth"/>

#Configuring a custom domain name for a Windows Azure Website using Traffic Manager (DomainDiscover / TierraNet)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-custom-domain-name" title="Custom Domain">Custom Domain</a><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain-name" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain-name" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain-name" title="Dotster">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain-name" title="DomainDiscover" class="current">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain-name" title="Directnic">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain-name/" title="Websites">Website</a> | <a href="/en-us/documentation/articles/web-sites-domaindiscover-traffic-manager-custom-domain-name/" title="Website using Traffic Manager" class="current">Website using Traffic Manager</a></div>

[AZURE.INCLUDE [websites-cloud-services-css-guided-walkthrough](../includes/websites-cloud-services-css-guided-walkthrough.md)]

[AZURE.INCLUDE [intro](../includes/custom-dns-web-site-intro-traffic-manager.md)]

This article provides instructions on using a custom domain name purchased from [DomainDiscover.com](https://domaindiscover.com)  with Azure Websites. DomainDiscover.com is part of [TierraNet](https://www.tierra.net/).

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

To associate your custom domain with an Azure Website, you must add a new entry in the DNS table for your custom domain by using tools provided by DomainDiscover. Use the following steps to locate the DNS tools for DomainDiscover.com

1. Log on to your account with DomainDiscover.com (TierraNet) by selecting **Control Panel** from the **Login** menu.

    ![DomainDiscover Login Menu](.\media\web-sites-domaindiscover-custom-domain-name\DomainDiscover_LoginMenu.png)

2. On the **Domain Services** page, select the domain that you want to use for your Azure website.

    ![Domain management page](.\media\web-sites-domaindiscover-custom-domain-name\DomainDiscover_DomainManagement.png)

3. In the Domain settings, click the **Edit** button for **DNS Service**.

    ![DNS edit button](.\media\web-sites-domaindiscover-custom-domain-name\DomainDiscover_DNSEditButton.png)

4. In the **Manage DNS** window, select the type of DNS record to add in the **Add Records** list. Then click the **Add** button.

    ![DNS edit button](.\media\web-sites-domaindiscover-custom-domain-name\DomainDiscover_DNSAddRecords.png)

5. On the following page, enter the DNS record values. Then click the **Add** button.

    ![DNS edit button](.\media\web-sites-domaindiscover-custom-domain-name\DomainDiscover_DNSRecords_TM.png)

    * When adding a CNAME record, you must first select **CNAME (Alias)** on the **Manage DNS** page. Then set the **Host** field to the sub-domain you wish to use. For example, **www**. You must set the **Alias Hostname** field to the **.trafficmanager.net** domain name of the Traffic Manager profile you are using with your Azure Website. For example, **contoso.trafficmanager.net**. Then provide a Time-to-Live (TTL) value, such as 1800 seconds.

	    > [AZURE.NOTE] You must only use CNAME records when associating your custom domain name with a website that is load balanced using Traffic Manager.

<h2><a name="enabledomain"></a>Enable Traffic Manager website</h2>

[AZURE.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-traffic-manager.md)]
