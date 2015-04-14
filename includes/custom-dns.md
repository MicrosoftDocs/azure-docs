# Configuring a custom domain name for an Azure cloud service

> [AZURE.NOTE]
> Get going faster--use the NEW Azure [guided walkthrough](http://support.microsoft.com/kb/2990804)!  It makes associating a custom domain name AND securing communication (SSL) with Azure Cloud Services or Azure Websites a snap.

When you create an application in Azure, Azure provides a subdomain on the cloudapp.net domain so your users can access your application on a URL like http://&lt;*myapp*>.cloudapp.net. However, you can also expose your application on your own domain name, such as contoso.com.

> [AZURE.NOTE] 
> The procedures in this task apply to Azure Cloud Services. For storage accounts, see [Configuring a Custom Domain Name for an Azure Storage Account](../articles/storage-custom-domain-name.md). For Websites, see [Configuring a Custom Domain Name for an Azure Web Site](../articles/web-sites-custom-domain-name.md).


## Understand CNAME and A records

CNAME (or alias records) and A records both allow you to associate a domain name with a specific server (or service in this case,) however they work differently. There are also some specific considerations when using A records with Azure Cloud services that you should consider before deciding which to use.

### CNAME or Alias record

A CNAME record maps a *specific* domain, such as **contoso.com** or **www.contoso.com**, to a canonical domain name. In this case, the canonical domain name is the **&lt;myapp>.cloudapp.net** domain name of your Azure hosted application. Once created, the CNAME creates an alias for the **&lt;myapp>.cloudapp.net**. The CNAME entry will resolve to the IP address of your **&lt;myapp>.cloudapp.net** service automatically, so if the IP address of the cloud service changes, you do not have to take any action.

> [AZURE.NOTE] 
> Some domain registrars only allow you to map subdomains when using a CNAME record, such as www.contoso.com, and not root names, such as contoso.com. For more information on CNAME records, see the documentation provided by your registrar, <a href="http://en.wikipedia.org/wiki/CNAME_record">the Wikipedia entry on CNAME record</a>, or the <a href="http://tools.ietf.org/html/rfc1035">IETF Domain Names - Implementation and Specification</a> document.

### A record

An A record maps a domain, such as **contoso.com** or **www.contoso.com**, *or a wildcard domain* such as **\*.contoso.com**, to an IP address. In the case of an Azure Cloud Service, the virtual IP of the service. So the main benefit of an A record over a CNAME record is that you can have one entry that uses a wildcard, such as ***.contoso.com**, which would handle requests for multiple sub-domains such as **mail.contoso.com**, **login.contoso.com**, or **www.contso.com**.

> [AZURE.NOTE]
> Since an A record is mapped to a static IP address, it cannot automatically resolve changes to the IP address of your Cloud Service. The IP address used by your Cloud Service is allocated the first time you deploy to an empty slot (either production or staging.) If you delete the deployment for the slot, the IP address is released by Azure and any future deployments to the slot may be given a new IP address.
> 
> Conveniently, the IP address of a given deployment slot (production or staging) is persisted when swapping between staging and production deployments or performing an in-place upgrade of an existing deployment. For more information on performing these actions, see [How to manage cloud services](../articles/cloud-services-how-to-manage.md).


## Add a CNAME record for your custom domain

To create a CNAME record, you must add a new entry in the DNS table for your custom domain by using the tools provided by your registrar. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concepts are the same.

1. Use one of these methods to find the **.cloudapp.net** domain name assigned to your cloud service.

  * Login to the [Azure Management Portal], select your cloud service, select **Dashboard**, and then find the **Site URL** entry in the **quick glance** section.

  		  ![quick glance section showing the site URL][csurl]

  * Install and configure [Azure Powershell](../articles/install-configure-powershell.md), and then use the following command:

    Get-AzureDeployment -ServiceName yourservicename | Select Url

  Save the domain name used in the URL returned by either method, as you will need it when creating a CNAME record.

1.  Log on to your DNS registrar's website and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

2.  Now find where you can select or enter CNAME's. You may have to select the record type from a drop down, or go to an advanced settings page. You should look for the words **CNAME**, **Alias**, or **Subdomains**.

3.  You must also provide the domain or subdomain alias for the CNAME, such as **www** if you want to create an alias for **www.customdomain.com**. If you want to create an alias for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

4. Then, you must provide a canonical host name, which is your application's **cloudapp.net** domain in this case.

For example, the following CNAME record forwards all traffic from **www.contoso.com** to **contoso.cloudapp.net**, the custom domain name of your deployed application:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
<tr>
<td><strong>Alias/Host name/Subdomain</strong></td>
<td><strong>Canonical domain</strong></td>
</tr>
<tr>
<td>www</td>
<td>contoso.cloudapp.net</td>
</tr>
</table>

A visitor of **www.contoso.com** will never see the true host
(contoso.cloudapp.net), so the forwarding process is invisible to the
end user.

> [AZURE.NOTE]
> The example above only applies to traffic at the <strong>www</strong> subdomain. Since you cannot use wildcards with CNAME records, you must create one CNAME for each domain/subdomain. If you want to direct  traffic from subdomains, such as *.contoso.com, to your cloudapp.net address, you can configure a <strong>URL Redirect</strong> or <strong>URL Forward</strong> entry in your DNS settings, or create an A record.


## Add an A record for your custom domain

To create an A record, you must first find the virtual IP address of your cloud service. Then add a new entry in the DNS table for your custom domain by using the tools provided by your registrar. Each registrar has a similar but slightly different method of specifying an A record, but the concepts are the same.

1. Use one of the following methods to get the IP address of your cloud service.

  * login to the [Azure Management Portal], select your cloud service, select **Dashboard**, and then find the **Public Virtual IP (VIP) address** entry in the **quick glance** section.

   		 ![quick glance section showing the VIP][vip]

  * Install and configure [Azure Powershell](../articles/install-configure-powershell.md), and then use the following command:

      get-azurevm -servicename yourservicename | get-azureendpoint -VM {$_.VM} | select Vip

    If you have multiple endpoints associated with your cloud service, you will receive multiple lines containing the IP address, but all should display the same address.

  Save the IP address, as you will need it when creating an A record.

1.  Log on to your DNS registrar's website and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

2.  Now find where you can select or enter A record's. You may have to select the record type from a drop down, or go to an advanced settings page.

3. Select or enter the domain or subdomain that will use this A record. For example, select **www** if you want to create an alias for **www.customdomain.com**. If you want to create a wildcard entry for all subdomains, enter '__*__'. This will cover all sub-domains such as **mail.customdomain.com**, **login.customdomain.com**, and **www.customdomain.com**.

  If you want to create an A record for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

4. Enter the IP address of your cloud service in the provided field. This associates the domain entry used in the A record with the IP address of your cloud service deployment.

For example, the following A record forwards all traffic from **contoso.com** to **137.135.70.239**, the IP address of your deployed application:

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

## Next steps

-   [How to Manage Cloud Services](../articles/cloud-services-how-to-manage.md)
-   [How to Map CDN Content to a Custom Domain][]

  [Expose Your Application on a Custom Domain]: #access-app
  [Add a CNAME Record for Your Custom Domain]: #add-cname
  [Expose Your Data on a Custom Domain]: #access-data
  [VIP swaps]: http://msdn.microsoft.com/library/ee517253.aspx
  [Create a CNAME record that associates the subdomain with the storage account]: #create-cname
  [Azure Management Portal]: https://manage.windowsazure.com
  [Validate Custom Domain dialog box]: http://i.msdn.microsoft.com/dynimg/IC544437.jpg
  [How to Map CDN Content to a Custom Domain]: http://msdn.microsoft.com/library/windowsazure/gg680307.aspx
  [vip]: ./media/custom-dns/csvip.png
  [csurl]: ./media/custom-dns/csurl.png