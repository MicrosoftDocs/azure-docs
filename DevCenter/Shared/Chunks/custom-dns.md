# Configuring a custom domain name for a Windows Azure cloud service or storage account

When you create an application in Windows Azure, Windows Azure provides a friendly subdomain on the cloudapp.net domain so your users can access your application on a URL like http://<*myapp*>.cloudapp.net.
Similarly, when you create a storage account, Windows Azure provides a friendly subdomain on the core.windows.net domain so your users can access your data on a URL like https://<*mystorageaccount*>.blob.core.windows.net. However, you can also expose your application and data on your own domain name, such as
contoso.com.

<div class="dev-callout"> 
<b>Note</b> 
	<p>The procedures in this task apply to Windows Azure Cloud Services and storage accounts; for Web Sites, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/">Configuring a Custom Domain Name for a Windows Azure Web Site</a>.</p> 
</div>

This task will show you how to:

-   [Expose Your Application on a Custom Domain][]
-   [Expose Your Data on a Custom Domain][]

<a name="access-app"> </a>

<h2>Expose your application on a custom domain</h2>

There are two ways you can configure the Domain Name Server (DNS) settings on your domain
registrar to point to your Windows Azure hosted service:

1.  **CNAME or Alias record (preferred)**

    With a CNAME, you map a *specific* domain, such as www.contoso.com or myblog.contoso.com, to the <*myapp*>.cloudapp.net domain name of your Windows Azure hosted application. The lifetime of the     <*myapp*>.cloudapp.net domain name required to implement this solution is the lifetime of your hosted service and persists even if your hosted service does not contain any deployments.

    Note, however, that most domain registrars only allow you to map subdomains, such as www.contoso.com and not root names, such as contoco.com or wildcard names, such as \*.contoso.com.

2.  **A record**

    With an A record, you map a domain (e.g., contoso.com or www.contoso.com) or a wildcard domain (e.g., \*.contoso.com) to the single public IP address of a deployment within a Windows Azure hosted service. Accordingly, the lifetime of this IP address is the     lifetime of a deployment within your hosted service. The IP address gets created the first time you deploy to an empty slot (either production or staging) in the hosted service and is retained by the slot until you delete the deployment from that slot. You can discover this IP address from within the Windows Azure Management Portal.

    The main benefit of this approach over using CNAMEs is that you can map root domains (e.g., contoso.com) and wildcard domains (e.g., \*.contoso.com), in addition to subdomains (e.g., www.contoso.com).

    Note, however, because the lifetime of the IP address is associated with a deployment, it is important not to delete your deployment if you need the IP address to persist. Conveniently, the IP address of a given deployment slot (production or staging) *is* persisted when using the two upgrade mechanisms in Windows Azure: [VIP swaps][] and in-place upgrades.

The remainder of this section focuses on the CNAME approach.

<h2>Adding a CNAME record for your custom domain</h2>

To configure a custom domain name, you must create a new CNAME record in
your custom domain name's DNS table. Each registrar has a similar but
slightly different method of specifying a CNAME record, but the concept
is the same.

1.  Log on to your DNS registrar's website, and go to the page for
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

<a name="access-data"> </a>

<h2>Expose your data on a custom domain</h2>

This section describes how to associate your own custom domain with a
Windows Azure storage account. When you complete the tasks in this
section, your users (assuming they have sufficient access rights) will
be able to access blobs within this storage account as follows:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tbody>
		<tr>
			<td style="width: 100px;"><strong>Resource Type</strong></td>
			<td><strong>URL Formats</strong></td>
		</tr>
		<tr>
			<td>Storage account</td>
			<td><strong>Default format:</strong> http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net<br /><strong>Custom domain format:</strong> http://&lt;<em>custom.sub.domain</em>&gt;</td>
		</tr>
		<tr>
			<td>Blob</td>
			<td><strong>Default format:</strong> http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/&lt;<em>mycontainer</em>&gt;/&lt;<em>myblob</em>&gt;<br /><strong>Custom domain format:</strong>
			http://&lt;<em>custom.sub.domain</em>&gt;/&lt;<em>mycontainer</em>&gt;/&lt;<em>myblob</em>&gt;</td>
		</tr>
		<tr>
			<td>Root container</td>
			<td><strong>Default format:</strong> http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/&lt;<em>myblob</em>&gt; 
			<br/>or<br />
			http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/$root/&lt;<em>myblob</em>&gt;<br />
			<strong>Custom domain format:</strong> http://&lt;<em>custom.sub.domain</em>&gt;/&lt;<em>myblob</em>&gt;
			<br/>or<br />
			http://&lt;<em>custom.sub.domain</em>&gt;/$root/&lt;<em>myblob</em>&gt;</td>
		</tr>
	</tbody>
</table>
<br/>
<div class="dev-callout">
<b>Note</b>
	<p>The tasks in this section use a DNS feature called CNAME, where
	a source domain points to a destination domain. Most domain registrars
	support specifying a subdomain (for example www.contoso.com or
	data.contoso.com) but not root domain (for example contoso.com) as the source domain. Accordingly, a subdomain is used as the example below.</p>
</div>

### Task Overview

Configuring a custom domain for a Windows Azure storage account involves
several tasks, some of which you will perform in the Windows Azure
Management Portal and others in your domain registrar's portal.

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tr>
		<td><strong>Task</strong></td>
		<td><strong>Portal</strong></td>
	</tr>
	<tr>
		<td>1. <a href=" #configure-domain">Configure a custom domain for the storage account</a></td>
		<td>Windows Azure</td>
	</tr>
	<tr>
		<td>2. <a href="#create-cname">Create a CNAME record to use for domain validation in Windows Azure</a></td>
		<td>Domain Registrar</td>
	</tr>
	<tr>
		<td>3. <a href="#validate-subdomain">Validate the subdomain in Windows Azure</a>
		</td>
		<td>Windows Azure</td>
	</tr>
	<tr>
		<td>4. <a href="#associate-subdomain">Create a CNAME record that associates the subdomain with the storage account</a></td>
		<td>Domain Registrar</td>
	</tr>
	<tr>
		<td>5. <a href="#verify-subdomain">Verify the subdomain references the Blob service</a></td>
		<td>Web Browser</td>
	</tr>
</table>

<a name="configure-domain"> </a>

<h2>Configure a custom domain for the storage account</h2>

1.  Log on to the [Windows Azure Management Portal][].

2.  In the **Web Sites** tab, click the name of your storage account.

3.  Click the **Configure** tab.

4.  At the bottom of the screen click **Manage Domains**.

5.  On the **Manage Custom Domai**n dialog, in the **Domain name** field, enter your domain name.

6. Click **register**.

    The **CName record** text box populates with the URL you need to use to validate the domain.  

7.  Copy the URL and paste into an email or a text editor for later
    use.

    You must now register the CNAME record above with your provider that points URI provided to verify.azure.com. Clicking the validate button before you have configure the CNAME record with your registrar will return the message "There is no DNS record for '&lt;URL>' that points to 'verify.azure.com'. Create a record with your DNS provider and try again. DNS records can take some time to propagate. If you think you have already configured this properly then try again in a few minutes."

<a name="create-cname"> </a>

<h2>Create a CNAME record to use for domain validation in Windows Azure</h2>

1.  On your domain registrar's website, add a CNAME record to the
    domain, using the alias and destination host name that you copied
    from the **Validate Custom Domain** dialog box.

    For example, if you are using the subdomain data.contoso.com, your
    CNAME record will use values that look similar to this:

    -   **Alias name:**
        0e6cd138-82b8-4136-adae-91dbaa369576.data.contoso.com
    -   **Points to host name:** verify.azure.com

    <div class="dev-callout">
	<b>Note</b>
	<p>Different domain registrars use different names for the two parameters in the CNAME record.</p>
	</div>

2.  Allow time for the CNAME record to propagate to all name servers on
    the Internet. Propagation can take 12 hours or longer.

<a name="validate-subdomain"> </a>

<h2>Validate the subdomain in Windows Azure</h2>

1.  In the **Web Sites** tab, click the name of your storage account.

2.  Click the **Configure** tab.

3.  At the bottom of the screen click **Manage Domains**.

4.  On the **Manage Custom Domain** click **validate**.

    If the validation is successful, you will get the message **Your custom domain is active**.

    <div class="dev-callout">
	<b>Note</b>
	<p>If the validation is not successful you will receive the message "There is no DNS record for '&lt;URL>' that points to 'verify.azure.com'. Create a record with your DNS provider and try again. DNS records can take some time to propagate. If you think you have already configured this properly then try again in a few minutes."</p>
	</div>

    <div class="dev-callout">
	<b>Important</b>
	<p>Windows Azure only validates that a CNAME record for
    the domain corresponds to the alias that you copied from the
    <strong>Validate Custom Domain</strong> dialog box. (In the <strong>Properties</strong> pane for the custom domain, this alias is displayed under <strong>CName redirect</strong>.) Windows Azure does not check to make sure that you used a subdomain for the custom domain. If you did not use a subdomain for the custom domain, you will not be able to access your blobs using the custom domain name, even if validation succeeds.</p>
	</div>

<a name="associate-subdomain"> </a>

<h2>Create a CNAME record to associate the subdomain with the storage account</h2>

1.  On the domain registrar's website, add a second CNAME record to the
    domain. This CNAME record associates the validated custom subdomain
    name with the Windows Azure storage account.

    For example, if your validated subdomain is data.contoso.com, create
    a CNAME record with the following entries:

    -   **Alias name:** data.contoso.com
    -   **Points to host
        name:** <*mystorageaccount*>.blob.core.windows.net

2.  Allow time for the CNAME record to propagate to all name servers on
    the Internet.

After propagation of the CNAME record completes, you should be able to
use the subdomain in URIs to reference public containers and blobs in
the storage account.

<a name="verify-subdomain"> </a>

<h2>Verify that the subdomain references the blob service</h2>

In a web browser, use a URI in the following format to access a blob in
a public container:

-   http://<*custom.sub.domain*>/<*mycontainer*>/<*myblob*>

For example, you might type the following URI to access a web form via a
data.contoso.com custom subdomain that maps to a blob in your
**myforms** container:

-   http://data.contoso.com/myforms/applicationform.htm

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
