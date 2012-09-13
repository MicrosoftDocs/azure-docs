#Configuring a custom domain name for a Windows Azure web site

When you create a web site, Windows Azure provides a friendly subdomain on the azurewebsites.net domain so your users can access your web site using a URL like http://&lt;mysite>.azurewebsites.net. However, if you configure your web sites for shared or reserved mode, you can map your web site to your own domain name, such as contoso.com. 

<div class="dev-callout-new"> 
<b>Note</b> 
	<p>The procedures in this task apply to Windows Azure Web Sites; for Cloud Services, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns/">Configuring a Custom Domain Name in Windows Azure</a>.</p> 
</div>

The steps in this task require you to configure your web sites for shared or reserved mode. Because the Web Sites feature is in preview and we are adding capacity on a measured basis, you may receive a "Not enough available reserved instance servers to satisfy this request." error. If you receive this error, you will need to try again later to perform this task.

You can use a CNAME record to point your domain name to your Windows Azure web site. You can also configure an A record to point the domain name to Windows Azure web site. The process requires that you wait for the CNAME and A records propagate before you can finally set the domain name in the management portal.

There are two ways you can configure the Domain Name Server (DNS) settings on your domain
registrar to point to your Windows Azure web site:

1.  **CNAME or Alias record**

    With a CNAME, you map a *specific* domain, such as www.contoso.com or myblog.contoso.com, to the <*mysite*>.azurewebsites.net domain name of your Windows Azure web site. 
    Most domain registrars only allow you to map subdomains, such as www.contoso.com and not root names, such as contoco.com or wildcard names, such as \*.contoso.com.

2.  **A record**

    With an A record, you map a domain (e.g., contoso.com or www.contoso.com) or a wildcard domain (e.g., \*.contoso.com) to the single public IP address of a deployment within a Windows Azure web site. 

    The main benefit of this approach over using CNAMEs is that you can map root domains (e.g., contoso.com) and wildcard domains (e.g., \*.contoso.com), in addition to subdomains (e.g., www.contoso.com).
 
The task includes the following steps: 

- Prerequisite: [Configure your web sites for shared mode][]
- Prerequisite: [Configure the CNAME on your domain registrar][]
- Optional: [Configure an A record for the domain name][]
- [Set the domain name in management portal][]
 
<a name="bkmk_configsharedmode"></a><h2><span class="short-header">Configure your web sites for shared mode</span></h2>

Setting a custom domain name on a web site is only available for the shared and reserved modes for Windows Azure web sites. Before switching a web site from the free web site mode to the shared or reserved web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on shared and reserved mode pricing, see [Pricing Details][PricingDetails].

1. In your browser, open the [Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.

	![][reservedmode1]

3. Click the **SCALE** tab.

	![][reservedmode2]
	
4. In the **general** section, set the web site mode by clicking **SHARED**.

	![][reservedmode3]
5. Click **Save**.
6. On the **You are changing to a mode that may have a billing impact. Continue?** (If you select **RESERVED**, the confirmation message will be: **Are you sure you want to upgrade from Free to Reserved web site mode?**) click **Yes**.

	<!--![][reservedmode4]-->

<div class="dev-callout-new"> 
	<b>Note</b> 
	<p>If you receive a "Configuring scale for web site '&lt;site name>' failed" error you can use the details button to get more information. You may receive a "Not enough available reserved instance servers to satisfy this request." error. The web sites feature is in preview and we are adding capacity on a measured basis. If you receive this error, you will need to try again later to upgrade your account.</p> 
</div>

<a name="bkmk_configurecname"></a><h2><span class="short-header">Configure the CNAME on your domain registrar</span></h2>

To configure a custom domain name, you must create a CNAME record in your custom domain name's DNS table. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same. Once you have configured the CNAME record, it will take some time to propagate.

1. In your browser, open the [Windows Azure Management Portal][portal].
2. In the **Web Sites** tab, locate the name of your site. 
3. Log on to your DNS registrar's website, and go to the page for managing DNS. You might find this in a section, such as Domain Name, DNS, or Name Server Management.
4. Now find the section for managing CNAME's. You may have to go to an advanced settings page and look for the words CNAME, Alias, or Subdomains.
5. Finally, you must provide a subdomain alias, such as www. Then, you must provide a hostname, which is your application's azurewebsites.net domain which consists of the name you located in step two and the azurewebsites.net domain. 
For example, the following CNAME record example forwards all traffic from *www.contoso.com* to *mysite.azurewebsites.net*, the DNS name of your deployed application:

	<br/>
	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
		<tr>
			<th><strong>Alias</strong></th>
			<th><strong>TTL</strong></th>
			<th><strong>Type</strong></th>
			<th>Value</th>
		</tr>
		<tr>
		  	<td>www.contoso.com</td>
		  	<td>86400</td>
		    <td>CNAME</td>
			<td>mysite.azurewebsites.net</td>
		</tr>
	</table>
	<br/>

<div class="dev-callout-new"> 
<b>Note</b> 
<p>It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.</p> 
</div>

<a name="bkmk_configurearecord"></a><h2><span class="short-header">Configure an A record for the domain name</span></h2>

To configure an A record you must configure a CNAME record used to verify the domain name. This process is the same as one used to configure a CNAME record to point at to your web site, except that you configure the CNAME record domain names that will be used for verification purposes. The hostname will be awverify.www.contoso.com and the value will be awverify.mysite.azurewebsites.net. Once this has propagate, you can configure the A record.

1. In your browser, open the [Windows Azure Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.
3. Click the **CONFIGURE** tab.

	![][setcname1]

4. At the bottom of the screen click **Manage Domains**.

	![][setcname2]

5. On the **Manage custom domains** dialog locate **The IP Address to use when configuring A records** and copy the IP address. 
6. Log on to your DNS registrar's website, and go to the page for managing DNS. You might find this in a section, such as Domain Name, DNS, or Name Server Management.
7. Configure the domain name and the IP address you copied in step 5.
For example, the following DNS examples forwards all traffic from *www.contoso.com* to *172.16.48.1*.

	<br/>
	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
		<tr>
			<th><strong>Alias</strong></th>
			<th><strong>TTL</strong></th>
			<th><strong>Type</strong></th>
			<th><strong>Value</strong></th>
		</tr>
		<tr>
		  	<td>awverify.www.contoso.com</td>
		  	<td>86400</td>
		    <td>CNAME</td>
			<td>awverify.mysite.azurewebsites.net</td>
		</tr>
		<tr>
		  	<td>www.contoso.com</td>
		  	<td>7200</td>
		    <td>A</td>
			<td>172.16.48.1</td>
		</tr>
	</table>

<a name="bkmk_setcname"></a><h2><span class="short-header">Set the domain name in management portal</span></h2>

Once the CNAME or A record for domain name has propagated you must associate it with your web site.

1. In your browser, open the [Windows Azure Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.
4. Click the **CONFIGURE** tab.

	![][setcname1]

5. At the bottom of the screen click **MANAGE DOMAINS**.

	![][setcname2]

6. In the **DOMAIN NAMES** text box type the domain name you have configured. 

	![][setcname3]

6. Click the check mark to accept the domain name.

Windows Azure validates the existence of the hostname in the public DNS before it save changes and updates the internal Windows Azure DNS. There are few reasons we are validating the hostname before committing the save, one of the primary reasons is that by waiting until the CNAME change propagates, we can verify that the custom domain belongs to the site owner. Verification allows our router to set up the route for each hostname, and ensures that every hostname belongs to one and only one site.  


<!-- Bookmarks -->

[Configure your web sites for shared mode]: #bkmk_configsharedmode
[Configure the CNAME on your domain registrar]: #bkmk_configurecname
[Configure a CNAME verification record on your domain registrar]: #bkmk_configurecname
[Configure an A record for the domain name]:#bkmk_configurearecord
[Set the domain name in management portal]: #bkmk_setcname



<!-- Links -->

[PricingDetails]: https://www.windowsazure.com/en-us/pricing/details/
[portal]: http://manage.windowsazure.com
[digweb]: http://www.digwebinterface.com/
[cloudservicedns]: ../custom-dns/

<!-- images -->
[reservedmode1]: ../media/dncmntask-cname-1.png
[reservedmode2]: ../media/dncmntask-cname-2.png
[reservedmode3]: ../media/dncmntask-cname-3.png
[reservedmode4]: ../media/dncmntask-cname-4.png 

[setcname1]: ../media/dncmntask-cname-5.png
[setcname2]: ../media/dncmntask-cname-6.png
[setcname3]: ../media/dncmntask-cname-7.png