#Configuring a custom domain name for an Azure website

When you create a website, Azure provides a friendly subdomain on the azurewebsites.net domain so your users can access your website using a URL like http://&lt;mysite>.azurewebsites.net. However, if you configure your websites for Shared or Standard mode, you can map your website to your own domain name.

Optionally, you can use Azure Traffic Manager to load balance incoming traffic to your website. For more information on how Traffic Manager works with Websites, see [Controlling Azure Web Sites Traffic with Azure Traffic Manager][trafficmanager].

> [AZURE.NOTE] The procedures in this task apply to Azure Websites; for Cloud Services, see <a href="/develop/net/common-tasks/custom-dns/">Configuring a Custom Domain Name in Azure</a>.

> [AZURE.NOTE] The steps in this task require you to configure your websites for Shared or Standard mode, which may change how much you are billed for your subscription. See <a href="/pricing/details/web-sites/">Websites Pricing Details</a> for more information.

In this article:

-   [Understanding CNAME and A records](#understanding-records)
-   [Configure your web sites for shared or standard mode](#bkmk_configsharedmode)
-   [Add your web sites to Traffic Manager](#trafficmanager)
-   [Add a CNAME for your custom domain](#bkmk_configurecname)
-   [Add an A record for your custom domain](#bkmk_configurearecord)

<h2><a name="understanding-records"></a>Understand CNAME and A records</h2>

CNAME (or alias records) and A records both allow you to associate a domain name with a website, however they each work differently.

###CNAME or Alias record

A CNAME record maps a *specific* domain, such as **contoso.com** or **www.contoso.com**, to a canonical domain name. In this case, the canonical domain name is the either the **&lt;myapp>.azurewebsites.net** domain name of your Azure website or the **&lt;myapp>.trafficmgr.com** domain name of your Traffic Manager profile. Once created, the CNAME creates an alias for the **&lt;myapp>.azurewebsites.net** or **&lt;myapp>.trafficmgr.com** domain name. The CNAME entry will resolve to the IP address of your **&lt;myapp>.azurewebsites.net** or **&lt;myapp>.trafficmgr.com** domain name automatically, so if the IP address of the website changes, you do not have to take any action.

> [AZURE.NOTE] Some domain registrars only allow you to map subdomains when using a CNAME record, such as www.contoso.com, and not root names, such as contoso.com. For more information on CNAME records, see the documentation provided by your registrar, <a href="http://en.wikipedia.org/wiki/CNAME_record">the Wikipedia entry on CNAME record</a>, or the <a href="http://tools.ietf.org/html/rfc1035">IETF Domain Names - Implementation and Specification</a> document.

###A record

An A record maps a domain, such as **contoso.com** or **www.contoso.com**, *or a wildcard domain* such as **\*.contoso.com**, to an IP address. In the case of an Azure Website, either the virtual IP of the service or a specific IP address that you purchased for your website. So the main benefit of an A record over a CNAME record is that you can have one entry that uses a wildcard, such as ***.contoso.com**, which would handle requests for multiple sub-domains such as **mail.contoso.com**, **login.contoso.com**, or **www.contso.com**.

> [AZURE.NOTE] Since an A record is mapped to a static IP address, it cannot automatically resolve changes to the IP address of your website. An IP address for use with A records is provided when you configure custom domain name settings for your website; however, this value may change if you delete and recreate your website, or change the website mode to back to free.

> [AZURE.NOTE] A records cannot be used for load balancing with Traffic Manager. For more information, see [Controlling Azure Web Sites Traffic with Azure Traffic Manager][trafficmanager].
 
<a name="bkmk_configsharedmode"></a><h2>Configure your websites for shared or standard mode</h2>

Setting a custom domain name on a website is only available for the Shared and Standard modes for Azure websites. Before switching a website from the Free website mode to the Shared or Standard website mode, you must first remove spending caps in place for your Website subscription. For more information on Shared and Standard mode pricing, see [Pricing Details][PricingDetails].

1. In your browser, open the [Management Portal][portal].
2. In the **Websites** tab, click the name of your site.

	![][standardmode1]

3. Click the **SCALE** tab.

	![][standardmode2]

	
4. In the **general** section, set the website mode by clicking **SHARED**.

	![][standardmode3]

	> [AZURE.NOTE] If you will be using Traffic Manager with this website, you must use select Standard mode instead of Shared.

5. Click **Save**.
6. When prompted about the increase in cost for Shared mode (or for Standard mode if you choose Standard), click **Yes** if you agree.

	<!--![][standardmode4]-->

	**Note**<br /> 
	If you receive a "Configuring scale for website 'website name' failed" error, you can use the details button to get more information. 

<a name="trafficmanager"></a><h2>(Optional) Add your websites to Traffic Manager</h2>

If you want to use your website with Traffic Manager, perform the following steps.

1. If you do not already have a Traffic Manager profile, use the information in [Create a Traffic Manager profile using Quick Create][createprofile] to create one. Note the **.trafficmgr.com** domain name associated with your Traffic Manager profile. This will be used in a later step.

2. Use the information in [Add or Delete Endpoints][addendpoint] to add your website as an endpoint in your Traffic Manager profile.

	> [AZURE.NOTE] If your website is not listed when adding an endpoint, verify that it is configured for Standard mode. You must use Standard mode for your website in order to work with Traffic Manager.

3. Log on to your DNS registrar's website, and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

4. Now find where you can select or enter CNAME records. You may have to select the record type from a drop down, or go to an advanced settings page. You should look for the words **CNAME**, **Alias**, or **Subdomains**.

5. You must also provide the domain or subdomain alias for the CNAME. For example, **www** if you want to create an alias for **www.customdomain.com**.

5. You must also provide a host name that is the canonical domain name for this CNAME alias. This is the **.trafficmgr.com** name for your website.

For example, the following CNAME record forwards all traffic from **www.contoso.com** to **contoso.trafficmgr.com**, the domain name of a website:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tr>
<td><strong>Alias/Host name/Subdomain</strong></td>
<td><strong>Canonical domain</strong></td>
</tr>
<tr>
<td>www</td>
<td>contoso.trafficmgr.com</td>
</tr>
</table>

A visitor of **www.contoso.com** will never see the true host
(contoso.azurewebsite.net), so the forwarding process is invisible to the end user.

> [AZURE.NOTE] If you are using Traffic Manager with a website, you do not need to follow the steps in the following sections, '**Add a CNAME for your custom domain**' and '**Add an A record for your custom domain**'. The CNAME record created in the previous steps will route incoming traffic to Traffic Manager, which then routes the traffic to the website endpoint(s).

<a name="bkmk_configurecname"></a><h2>Add a CNAME for your custom domain</h2>

To create a CNAME record, you must add a new entry in the DNS table for your custom domain by using tools provided by your registrar. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concepts are the same.

1. Use one of these methods to find the **.azurewebsite.net** domain name assigned to your website.

	* Login to the [Azure Management Portal][portal], select your website, select **Dashboard**, and then find the **Site URL** entry in the **quick glance** section.

	* Install and configure [Azure Powershell](/manage/install-and-configure-windows-powershell/), and then use the following command:

			get-azurewebsite yoursitename | select hostnames

	* Install and configure the [Azure Cross-Platform Command Line Interface](/manage/install-and-configure-cli/), and then use the following command:

			azure site domain list yoursitename

	Save this **.azurewebsite.net** name, as it will be used in the following steps.

3. Log on to your DNS registrar's website, and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

4. Now find where you can select or enter CNAME records. You may have to select the record type from a drop down, or go to an advanced settings page. You should look for the words **CNAME**, **Alias**, or **Subdomains**.

5. You must also provide the domain or subdomain alias for the CNAME. For example, **www** if you want to create an alias for **www.customdomain.com**. If you want to create an alias for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

5. You must also provide a host name that is the canonical domain name for this CNAME alias. This is the **.azurewebsite.net** name for your website.

For example, the following CNAME record forwards all traffic from **www.contoso.com** to **contoso.azurewebsite.net**, the domain name of a website:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tr>
<td><strong>Alias/Host name/Subdomain</strong></td>
<td><strong>Canonical domain</strong></td>
</tr>
<tr>
<td>www</td>
<td>contoso.azurewebsite.net</td>
</tr>
</table>

A visitor of **www.contoso.com** will never see the true host
(contoso.azurewebsite.net), so the forwarding process is invisible to the
end user.

> [AZURE.NOTE] The example above only applies to traffic at the __www__ subdomain. Since you cannot use wildcards with CNAME records, you must create one CNAME for each domain/subdomain. If you want to direct  traffic from subdomains, such as *.contoso.com, to your azurewebsite.net address, you can configure a __URL Redirect__ or __URL Forward__ entry in your DNS settings, or create an A record.

> [AZURE.NOTE] It can take some time for your CNAME to propagate through the DNS system. You cannot set the CNAME for the website until the CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

###Add the domain name to your website

After the CNAME record for domain name has propagated, you must associate it with your website. You can add the custom domain name defined by the CNAME record to your website by using either the Azure Cross-Platform Command-Line Interface or by using the Azure Management Portal.

**To add a domain name using the command-line tools**

Install and configure the [Azure Cross-Platform Command-Line Interface](/manage/install-and-configure-cli/), and then use the following command:

	azure site domain add customdomain yoursitename

For example, the following will add a custom domain name of **www.contoso.com** to the **contoso.azurewebsite.net** website:

	azure site domain add www.contoso.com contoso

You can confirm that the custom domain name was added to the website by using the following command:

	azure site domain list yoursitename

The list returned by this command should contain the custom domain name, as well as the default **.azurewebsite.net** entry.

**To add a domain name using the Azure Management Portal**

1. In your browser, open the [Azure Management Portal][portal].

2. In the **Websites** tab, click the name of your site, select **Dashboard**, and then select **Manage Domains** from the bottom of the page.

	![][setcname2]

6. In the **DOMAIN NAMES** text box, type the domain name that you have configured. 

	![][setcname3]

6. Click the check mark to accept the domain name.

Once configuration has completed, the custom domain name will be listed in the **domain names** section of the **Configure** page of your website. 

<a name="bkmk_configurearecord"></a><h2>Add an A Record for your custom domain</h2>

To create an A record, you must first find the IP address of your website. Then add an entry in the DNS table for your custom domain by using the tools provided by your registrar. Each registrar has a similar but slightly different method of specifying an A record, but the concepts are the same. In addition to creating an A record, you must also create a CNAME record that Azure uses to verify the A record.

1. In your browser, open the [Azure Management Portal][portal].

2. In the **Websites** tab, click the name of your site, select **Dashboard**, and then select **Manage Domains** from the bottom of the screen.

	![][setcname2]

5. On the **Manage custom domains** dialog, locate **The IP Address to use when configuring A records**. Copy the IP address. This will be used when creating the A record.

5. On the **Manage custom domains** dialog, note awverify domain name at the end of the text at the top of the dialog. It should be **awverify.mysite.azurewebsites.net** where **mysite** is the name of your website. Copy this, as it is the domain name used when creating the verification CNAME record.

6. Log on to your DNS registrar's website, and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

6. Find where you can select or enter A and CNAME records. You may have to select the record type from a drop down, or go to an advanced settings page.

7. Perform the following steps to create the A record:

	1. Select or enter the domain or subdomain that will use the A record. For example, select **www** if you want to create an alias for **www.customdomain.com**. If you want to create a wildcard entry for all subdomains, enter '__*__'. This will cover all sub-domains such as **mail.customdomain.com**, **login.customdomain.com**, and **www.customdomain.com**.

		If you want to create an A record for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

	2. Enter the IP address of your cloud service in the provided field. This associates the domain entry used in the A record with the IP address of your cloud service deployment.

		For example, the following A record forwards all traffic from **contoso.com** to **137.135.70.239**, the IP address of our deployed application:

		<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
		<tr>
		<td><strong>Host name/Subdomain</strong></td>
		<td><strong>IP address</strong></td>
		</tr>
		<tr>
		<td>@</td>
		<td>137.135.70.239</td>
		</tr>
		</table>

		This example demonstrates creating an A record for the root domain. If you wish to create a wildcard entry to cover all subdomains, you would enter '__*__' as the subdomain.

7. Next, create a CNAME record that has an alias of **awverify**, and a canonical domain of **awverify.mysite.azurewebsites.net** that you obtained earlier.

	> [AZURE.NOTE] While an alias of awverify may work for some registrars, others may require the full alias domain name of awverify.www.customdomainname.com or awverify.customdomainname.com.

	For example, the following will create an CNAME record that Azure can use to verify the A record configuration.

	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tr>
	<td><strong>Alias/Host name/Subdomain</strong></td>
	<td><strong>Canonical domain</strong></td>
	</tr>
	<tr>
	<td>awverify</td>
	<td>awverify.contoso.azurewebsites.net</td>
	</tr>
	</table>

> [AZURE.NOTE] It can take some time for the awverify CNAME to propagate through the DNS system. You cannot set the custom domain name defined by the A record for the website until the awverify CNAME has propagated. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

###Add the domain name to your website

After the **awverify** CNAME record for domain name has propagated, you can then associate the custom domain defined by the A record with your website. You can add the custom domain name defined by the A record to your website by using either the Azure Cross-Platform Command-Line Interface or by using the Azure Management Portal.

**To add a domain name using the command-line tools**

Install and configure the [Azure Cross-Platform Command-Line Interface](/manage/install-and-configure-cli/), and then use the following command:

	azure site domain add customdomain yoursitename

For example, the following will add a custom domain name of **contoso.com** to the **contoso.azurewebsite.net** website:

	azure site domain add contoso.com contoso

You can confirm that the custom domain name was added to the website by using the following command:

	azure site domain list yoursitename

The list returned by this command should contain the custom domain name, as well as the default **.azurewebsite.net** entry.

**To add a domain name using the Azure Management Portal**

1. In your browser, open the [Azure Management Portal][portal].

2. In the **Websites** tab, click the name of your site, select **Dashboard**, and then select **Manage Domains** from the bottom of the page.

	![][setcname2]

6. In the **DOMAIN NAMES** text box, type the domain name that you have configured. 

	![][setcname3]

6. Click the check mark to accept the domain name.

Once configuration has completed, the custom domain name will be listed in the **domain names** section of the **Configure** page of your website.

> [AZURE.NOTE] After you have added the custom domain name defined by the A record to your website, you can remove the awverify CNAME record using the tools provided by your registrar. However, if you wish to add another A record in the future, you will have to recreate the awverify record before you can associate the new domain name defined by the new A record with the website.

## Next steps

-   [How to manage web sites](/manage/services/web-sites/how-to-manage-websites/)

-   [Configure an SSL certificate for Web Sites](/develop/net/common-tasks/enable-ssl-web-site/)


<!-- Bookmarks -->

[Configure your web sites for shared mode]: #bkmk_configsharedmode
[Configure the CNAME on your domain registrar]: #bkmk_configurecname
[Configure a CNAME verification record on your domain registrar]: #bkmk_configurecname
[Configure an A record for the domain name]:#bkmk_configurearecord
[Set the domain name in management portal]: #bkmk_setcname

<!-- Links -->

[PricingDetails]: /pricing/details/
[portal]: http://manage.windowsazure.com
[digweb]: http://www.digwebinterface.com/
[cloudservicedns]: ../articles/custom-dns.md
[trafficmanager]: ../articles/web-sites-traffic-manager.md
[addendpoint]: http://msdn.microsoft.com/library/windowsazure/hh744839.aspx
[createprofile]: http://msdn.microsoft.com/library/windowsazure/dn339012.aspx

<!-- images -->

[setcname1]: ../media/dncmntask-cname-5.png


<!-- images -->
[standardmode1]: ./media/custom-dns-web-site/dncmntask-cname-1.png
[standardmode2]: ./media/custom-dns-web-site/dncmntask-cname-2.png
[standardmode3]: ./media/custom-dns-web-site/dncmntask-cname-3.png
[standardmode4]: ./media/custom-dns-web-site/dncmntask-cname-4.png 


[setcname2]: ./media/custom-dns-web-site/dncmntask-cname-6.png
[setcname3]: ./media/custom-dns-web-site/dncmntask-cname-7.png
