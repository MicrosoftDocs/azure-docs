# Configuring a custom domain name for a Windows Azure cloud service

When you create an application in Windows Azure, Windows Azure provides a friendly subdomain on the cloudapp.net domain so your users can access your application on a URL like http://<*myapp*>.cloudapp.net. However, you can also expose your application on your own domain name, such as
contoso.com.

<div class="dev-callout"> 
<b>Note</b> 
	<p>The procedures in this task apply to Windows Azure Cloud Services. For storage accounts, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-storage/">Configuring a Custom Domain Name for a Windows Azure Storage Account</a>. For Web Sites, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/">Configuring a Custom Domain Name for a Windows Azure Web Site</a>.</p> 
</div>

This task will show you how to:

-   [Expose Your Application on a Custom Domain][]
-   [Add a CNAME Record for Your Custom Domain][]

<h2><a name="access-app"></a>Expose your application on a custom domain</h2>

There are two ways you can configure the Domain Name Server (DNS) settings on your domain
registrar to point to your Windows Azure hosted service:

1.  **CNAME or Alias record (preferred)**

    With a CNAME, you map a *specific* domain, such as www.contoso.com or myblog.contoso.com, to the *<*myapp*>.cloudapp.net* domain name of your Windows Azure hosted application. The lifetime of the     *<*myapp*>.cloudapp.net* domain name required to implement this solution is the lifetime of your hosted service and persists even if your hosted service does not contain any deployments.

    Note, however, that most domain registrars only allow you to map subdomains, such as www.contoso.com and not root names, such as contoso.com, or wildcard names, such as \*.contoso.com.

2.  **A record**

    With an A record, you map a domain (e.g., contoso.com or www.contoso.com) or a wildcard domain (e.g., \*.contoso.com) to the single public IP address of a deployment within a Windows Azure hosted service. Accordingly, the lifetime of this IP address is the     lifetime of a deployment within your hosted service. The IP address gets created the first time you deploy to an empty slot (either production or staging) in the hosted service and is retained by the slot until you delete the deployment from that slot. You can discover this IP address from within the Windows Azure Management Portal.

    The main benefit of this approach over using CNAMEs is that you can map root domains (e.g., contoso.com) and wildcard domains (e.g., \*.contoso.com), in addition to subdomains (e.g., www.contoso.com).

    Note, however, because the lifetime of the IP address is associated with a deployment, it is important not to delete your deployment if you need the IP address to persist. Conveniently, the IP address of a given deployment slot (production or staging) *is* persisted when using the two upgrade mechanisms in Windows Azure: [VIP swaps][] and in-place upgrades.

The remainder of this section focuses on the CNAME approach.

<h2><a name="add-cname"></a>Add a CNAME record for your custom domain</h2>

To configure a custom domain name, you must create a new CNAME record in
your custom domain name's DNS table. Each registrar has a similar but
slightly different method of specifying a CNAME record, but the concept
is the same.

1.  Log on to your DNS registrar's web site, and go to the page for
    managing DNS. You might find this in a section, such as **Domain
    Name**, **DNS**, or **Name Server Management**.

2.  Now find the section for managing CNAME's. You may have to go to an
    advanced settings page and look for the words **CNAME**, **Alias**,
    or **Subdomains**.

3.  Finally, you must provide a subdomain alias, such as **www**. Then,
    you must provide a host name, which is your application's
    **cloudapp.net** domain in this case. For example, the following
    CNAME record forwards all traffic from **www.contoso.com** to
    **contoso.cloudapp.net**, the DNS name of our deployed application:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tr>
		<td><strong>Alias</strong></td>
		<td><strong>Host name</strong></td>
	</tr>
	<tr>
		<td>www</td>
		<td>contoso.cloudapp.net</td>
	</tr>
</table>

A visitor of **www.contoso.com** will never see the true host
(contoso.cloudapp.net), so the forwarding process is invisible to the
end user.
<div class="dev-callout">
	<b>Note</b>
	<p>The example above only applies to traffic at the <strong>www</strong>
	subdomain. You cannot specify a root CNAME record that directs all
	traffic from a custom domain to your cloudapp.net address, so additional
	alias records must be added. If you want to direct all traffic from a
	root domain, such as contoso.com, to your cloudapp.net address, you can
	configure a <strong>URL Redirect</strong> or <strong>URL Forward</strong> entry in your DNS
	settings, or create an A record as described earlier.</p>
</div>


## Additional Resources

-   [How to Map CDN Content to a Custom Domain][]

  [Expose Your Application on a Custom Domain]: #access-app
  [Expose Your Data on a Custom Domain]: #access-data
  [VIP swaps]: http://msdn.microsoft.com/en-us/library/ee517253.aspx
  [Create a CNAME record that associates the subdomain with the storage account]:
    #create-cname
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [Validate Custom Domain dialog box]: http://i.msdn.microsoft.com/dynimg/IC544437.jpg
  [How to Map CDN Content to a Custom Domain]: http://msdn.microsoft.com/en-us/library/windowsazure/gg680307.aspx
