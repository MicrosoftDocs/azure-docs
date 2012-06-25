#Configuring a Custom Domain Name for a Windows Azure Web Site

When you create a web site, Windows Azure provides a friendly subdomain on the azurewebsites.net domain so your users can access your web site using a URL like http://&lt;mysite>.azurewebsites.net. However, if you configure your web sites for reserved mode, you can map your web site to your own domain name, such as contoso.com. 

The procedueres in this task apply to Windows Azure web sites, for Cloud Services, see [Configuring a Custom Domain Name in Windows Azure][cloudservicedns].


The task includes the following steps:

- [Configure your web sites for reserved mode][]
- [Configure the CNAME on your domain registrar][]
- [Set the CNAME in management portal][]
 
<a name="bkmk_configreservedmode"></a><h2>Configure your web sites for reserved mode</h2>

Setting a CNAME on a web site is only available in the reserved mode of web sites. Before switching a website from Shared website mode to Reserved website mode you must first remove spending caps in place for your Web Site subscription. For more information on reserved mode pricing, see [Pricing Details][PricingDetails].

1. In your browser, open the [Windows Azure Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.

	![][reservedmode1]

3. Click the **SCALE** tab.

	![][reservedmode2]
	
4. In the general section,  set  web site mode by clicking **RESERVED**.
6. In the **Spending Limit Warning** dialog click the "I have removed the spending limit on my account" box.

	![][reservedmode3]

	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not yet removed the spending limit from your account, follow the instruction in the dialog to do so before proceeding.</p> 
	</div>
7. On the **Are you sure you want to upgrade from Shared to Reserved web site mode?** click Yes.

	![][reservedmode4]

<div class="dev-callout"> 
<b>Note</b> 
<p>If you receive a "Configuring scale for web site '&lt;site name>' Failed" error you can use the details button to get more information. You may receive a "Not enough available reserved instance servers to satisfy this request." error. The web sites feature is in preview and we are adding capacity on a measured basis. If you receive this error, you will need to try again later to upgrade your account.</p> 
</div>

<a name="bkmk_configurecname"></a><h2>Configure the CNAME on your domain registrar</h2>

To configure a custom domain name, you must create a new CNAME record in your custom domain name's DNS table. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same.

1. Click the **CONFIGURE** tab. 
2. In the **hostnames** section copy the URL of the web site.
3. Log on to your DNS registrar's website, and go to the page for managing DNS. You might find this in a section, such as Domain Name, DNS, or Name Server Management.
4. Now find the section for managing CNAME's. You may have to go to an advanced settings page and look for the words CNAME, Alias, or Subdomains.
3. Finally, you must provide a subdomain alias, such as www. Then, you must provide a host name, which is your application's azurewebsites.net domain which you copied in step 3. 
	For example, the following CNAME record forwards all traffic from *www.contoso.com* to contoso.cloudapp.net, the DNS name of our deployed application:

	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tr>
	  <td>
	    <strong>Alias</strong>
	  </td>
	  <td>
	    <strong>Host name</strong>
	  </td>
	</tr>
	<tr>
	  <td>www</td>
	  <td>contoso.azurewebsites.net</td>
	</tr>
	</table>
<br/>


<div class="dev-callout"> 
<b>Note</b> 
<p>It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the web site until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.</p> 
</div>

<a name="bkmk_setcname"></a><h2>Set the CNAME in management portal</h2>

Once the CNAME has propagated you must associate it with your web site.

1. In your browser, open the [Windows Azure Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.
4. Click the **CONFIGURE** tab.

	![][setcname1]

5. In the **hostnames** section add your domain name to the **SITE URLS**.
6. Click the Check Mark to accept the domain name.
7. Click **Save**.

	![][setcname2]

Windows Azure validates the existence of the hostname in the public DNS before it save changes and updates the internal Windows Azure DNS. There are few reasons we are validating the hostname before committing the save, one of the primary reasons is that by waiting until the CNAME change propagates, we can verify that the custom domain belongs to the site owner. Verification allows our router to set up the route for each hostname, and ensures that every hostname belongs to one and only one site.  


<!-- Bookmarks -->

[Configure your web sites for reserved mode]: #bkmk_configreservedmode
[Configure the CNAME on your domain registrar]: #bkmk_configurecname
[Set the CNAME in management portal]: #bkmk_setcname

<!-- Links -->

[PricingDetails]: https://www.windowsazure.com/en-us/pricing/details/
[portal]: http://manage.windowsazure.com
[digweb]: http://www.digwebinterface.com/
[cloudservicedns]: https://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns/

<!-- images -->
[reservedmode1]: ../media/dncmntask-cname-1.png
[reservedmode2]: ../media/dncmntask-cname-2.png
[reservedmode3]: ../media/dncmntask-cname-3.png
[reservedmode4]: ../media/dncmntask-cname-4.png 

[setcname1]: ../media/dncmntask-cname-5.png
[setcname2]: ../media/dncmntask-cname-6.png