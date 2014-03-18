<properties title="Custom domain name" pageTitle="Configuring a custom domain name for a Windows Azure web site" metaKeywords="Windows Azure, Windows Azure Web Sites, domain name" description="" services="Web Sites" documentationCenter="" authors="jroth" />

#Configuring a custom domain name for a Windows Azure web site (Dotster)

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name" title="GoDaddy">GoDaddy</a><a href="/en-us/documentation/articles/web-sites-network-solutions-custom-domain-name" title="Network Solutions">Network Solutions</a><a href="/en-us/documentation/articles/web-sites-registerdotcom-custom-domain-name" title="Register.com">Register.com</a><a href="/en-us/documentation/articles/web-sites-enom-custom-domain" title="Enom">Enom</a><a href="/en-us/documentation/articles/web-sites-moniker-custom-domain" title="Moniker">Moniker</a><a href="/en-us/documentation/articles/web-sites-dotster-custom-domain" title="Dotster" class="current">Dotster</a><a href="/en-us/documentation/articles/web-sites-domaindiscover-custom-domain" title="DomainDiscover">DomainDiscover</a><a href="/en-us/documentation/articles/web-sites-directnic-custom-domain" title="Directnic">Directnic</a></div>
<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name/" title="Web Sites" class="current">Web Site</a> | <a href="/en-us/documentation/articles/web-sites-godaddy-custom-domain-name-traffic-manager/" title="Web Site using Traffic Manager">Web Site using Traffic Manager</a></div>

[WACOM.INCLUDE [intro](../includes/custom-dns-web-site-intro.md)]

This article provides instructions on using a custom domain name purchased from Dotster.com with Azure Web Sites.

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

To associate your custom domain with an Azure Web Site, you must add a new entry in the DNS table for your custom domain by using tools provided by Dotster. Use the following steps to locate the DNS tools for Dotster.com

1. Log on to your account with Dotster.com. On the **Domain** menu, select **DomainCentral**.

    ![Domain Central Dotster Menu](.\media\web-sites-dotster-custom-domain-name\Dotster_DomainCentralMenu.png)

2. Select your domain to bring up a list of settings. Then select the **Nameservers** link.

    ![Dotster Domain Configuration Options](.\media\web-sites-dotster-custom-domain-name\Dotster_DomainMenu.png)

3. Select the **Use different name servers**. In order to take advantage of the DNS services on Dotster, you must specify the following name servers: ns1.nameresolve.com, ns2.nameresolve.com, ns3.nameresolve.com, and ns4.nameresolve.com.

    ![Dotster Domain Configuration Options](.\media\web-sites-dotster-custom-domain-name\Dotster_Nameservers.png)

    > [WACOM.NOTE] It can take 24-48 hours for the name servers change to take affect. The remainder of steps in this article do not work until that time.

4. In DomainCentral, select your domain, and then select **DNS**. In the **Modify** list, select the type of DNS record to add (**CNAME Alias** or **A Record**). 

    ![Dotster Domain Configuration Options](.\media\web-sites-dotster-custom-domain-name\Dotster_DNS.png)

5. Then specify the **Host** and **Points To** fields for the record. When complete click the **Add** button.

    ![Dotster Domain Configuration Options](.\media\web-sites-dotster-custom-domain-name\Dotster_DNS_CNAME.png)
 
    * When adding a CNAME record, you must set the **Host** field to the sub-domain you wish to use. For example, **www**. You must set the **Points To** field to the **.azurewebsites.net** domain name of your Azure Web Site. For example, **contoso.azurwebsites.net**.

        > [WACOM.NOTE] It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

    * When adding an A record, you must set the **Host** field to either **@** (this represents root domain name, such as **contoso.com**,) or the sub-domain you wish to use (for example, **www**.) You must set the **Points To** field to the IP address of your Azure Web Site.

        > [WACOM.NOTE] When adding an A record, you must also add a CNAME record with a host of **www** and an **Address** of **&lt;yourwebsitename&gt;.azurewebsites.net**.

<h2><a name="enabledomain"></a>Enable the domain name on your web site</h2>

[WACOM.INCLUDE [modes](../includes/custom-dns-web-site-enable-on-web-site.md)]
