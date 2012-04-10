<properties
linkid=dev-net-commons-tasks-custom-dns
urlDisplayName=Custom DNS
headerExpose=
pageTitle=Enable Custom DNS - .NET - Develop
metaKeywords=DNS Azure, Azure custom domain, .NET DNS Azure, .NET Azure custom domain, C# DNS Azure, C# Azure custom domain, VB DNS Azure, VB Azure custom domain
footerExpose=
metaDescription=Learn how to expose your  Windows Azure application or data on a custom domain by configuring DNS settings.
umbracoNaviHide=0
disqusComments=1
/>
<h1>Configuring a Custom Domain Name in Windows Azure</h1>
<p>When you create an application in Windows Azure, Windows Azure provides a friendly subdomain on the cloudapp.net domain so your users can access your application on a URL like http://&lt;<em>myapp</em>&gt;.cloudapp.net. Similarly, when you create a storage account, Windows Azure provides a friendly subdomain on the core.windows.net domain so your users can access your data on a URL like https://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net. However, you can also expose your application and data on your own domain name, such as contoso.com.</p>
<p>This task will show you how to:</p>
<ul>
<li><a href="#access-app">Expose Your Application on a Custom Domain</a></li>
<li><a href="#access-data">Expose Your Data on a Custom Domain</a></li>
</ul>
<a name="access-app"></a>
<h2>Expose Your Application on a Custom Domain</h2>
<p>There are two ways you can configure the DNS settings on your domain registrar to point to your Windows Azure hosted service:</p>
<ol>
<li>
<p><strong>CNAME or Alias record (preferred)</strong></p>
<p>With a CNAME, you map a <em>specific</em> domain, such as www.contoso.com or myblog.contoso.com, to the &lt;<em>myapp</em>&gt;.cloudapp.net domain name of your Windows Azure hosted application. The lifetime of the &lt;<em>myapp</em>&gt;.cloudapp.net domain name required to implement this solution is the lifetime of your hosted service and persists even if your hosted service does not contain any deployments.</p>
<p>Note, however, that most domain registrars only allow you to map subdomains, such as www.contoso.com and not root names, such as contoco.com or wildcard names, such as *.contoso.com.</p>
</li>
<li>
<p><strong>A record</strong></p>
<p>With an A record, you map a domain (e.g., contoso.com or www.contoso.com) or a wildcard domain (e.g., *.contoso.com) to the single public IP address of a deployment within a Windows Azure hosted service. Accordingly, the lifetime of this IP address is the lifetime of a deployment within your hosted service. The IP address gets created the first time you deploy to an empty slot (either production or staging) in the hosted service and is retained by the slot until you delete the deployment from that slot. You can discover this IP address from within the Windows Azure Management Portal.</p>
<p>The main benefit of this approach over using CNAMEs is that you can map root domains (e.g., contoso.com) and wildcard domains (e.g., *.contoso.com), in addition to subdomains (e.g., www.contoso.com).</p>
<p>Note, however, because the lifetime of the IP address is associated with a deployment, it is important not to delete your deployment if you need the IP address to persist. Conveniently, the IP address of a given deployment slot (production or staging) <em>is</em> persisted when using the two upgrade mechanisms in Windows Azure: <a href="http://msdn.microsoft.com/en-us/library/ee517253.aspx">VIP swaps</a> and in-place upgrades.</p>
</li>
</ol>
<p>The remainder of this section focuses on the CNAME approach.</p>
<h3>Adding a CNAME Record for Your Custom Domain</h3>
<p>To configure a custom domain name, you must create a new CNAME record in your custom domain name's DNS table. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept is the same.</p>
<ol>
<li>
<p>Log on to your DNS registrar's website, and go to the page for managing DNS. You might find this in a section, such as <strong>Domain Name</strong>, <strong>DNS</strong>, or <strong>Name Server Management</strong>.</p>
</li>
<li>
<p>Now find the section for managing CNAME's. You may have to go to an advanced settings page and look for the words <strong>CNAME</strong>, <strong>Alias</strong>, or <strong>Subdomains</strong>.</p>
</li>
<li>
<p>Finally, you must provide a subdomain alias, such as <strong>www</strong>. Then, you must provide a host name, which is your application's <strong>cloudapp.net</strong> domain in this case. For example, the following CNAME record forwards all traffic from <strong>www.contoso.com</strong> to <strong>contoso.cloudapp.net</strong>, the DNS name of our deployed application:</p>
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<tbody>
<tr>
<td style="width: 100px;"><strong>Alias</strong></td>
<td style="width: 200px;"><strong>Host name</strong></td>
</tr>
<tr>
<td>www</td>
<td>contoso.cloudapp.net</td>
</tr>
</tbody>
</table>
</li>
</ol>
<p>A visitor of <strong>www.contoso.com</strong> will never see the true host (contoso.cloudapp.net), so the forwarding process is invisible to the end user.</p>
<p><strong>Note: </strong>The example above only applies to traffic at the <strong>www</strong> subdomain. You cannot specify a root CNAME record that directs all traffic from a custom domain to your cloudapp.net address, so additional alias records must be added. If you want to direct all traffic from a root domain, such as contoso.com, to your cloudapp.net address, you can configure a <strong>URL Redirect</strong> or <strong>URL Forward</strong> entry in your DNS settings, or create an A record as described earlier.</p>
<a name="access-data"></a>
<h2>Expose Your Data on a Custom Domain</h2>
<p>This section describes how to associate your own custom domain with a Windows Azure storage account. When you complete the tasks in this section, your users (assuming they have sufficient access rights) will be able to access blobs within this storage account as follows:</p>
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<tbody>
<tr>
<td style="width: 100px;"><strong>Resource Type</strong></td>
<td style="width: 500px;"><strong>URL Formats</strong></td>
</tr>
<tr>
<td>Storage account</td>
<td>
<p><strong>Default format:</strong> http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net</p>
<p><strong>Custom domain format:</strong> http://&lt;<em>custom.sub.domain</em>&gt;</p>
</td>
</tr>
<tr>
<td>Blob</td>
<td>
<p><strong>Default format:</strong> http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/&lt;<em>mycontainer</em>&gt;/&lt;<em>myblob</em>&gt;</p>
<p><strong>Custom domain format:</strong> http://&lt;<em>custom.sub.domain</em>&gt;/&lt;<em>mycontainer</em>&gt;/&lt;<em>myblob</em>&gt;</p>
</td>
</tr>
<tr>
<td>Root container</td>
<td>
<p><strong>Default format:</strong></p>
<p>http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/&lt;<em>myblob</em>&gt;, or</p>
<p>http://&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net/$root/&lt;<em>myblob</em>&gt;</p>
<p><strong>Custom domain format:</strong></p>
<p>http://&lt;<em>custom.sub.domain</em>&gt;/&lt;<em>myblob</em>&gt;, or</p>
<p>http://&lt;<em>custom.sub.domain</em>&gt;/$root/&lt;<em>myblob</em>&gt;</p>
</td>
</tr>
</tbody>
</table>
<p><strong>Note: </strong>The tasks in this section use a DNS feature called CNAME, where a source domain points to a destination domain. Most domain registrars support specifying a subdomain (e.g., www.contoso.com or data.contoso.com) but not root domain (e.g., contoso.com) as the source domain. Accordingly, a subdomain is used as the example below.</p>
<h3>Task Overview</h3>
<p>Configuring a custom domain for a Windows Azure storage account involves several tasks, some of which you will perform in the Windows Azure Management Portal and others in your domain registrar's portal.</p>
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<tbody>
<tr>
<td style="width: 450px;"><strong>Task</strong></td>
<td style="width: 150px;"><strong>Portal</strong></td>
</tr>
<tr>
<td>1. <a href="#configure-domain">Configure a custom domain for the storage account</a></td>
<td>Windows Azure</td>
</tr>
<tr>
<td>2. <a href="#create-cname">Create a CNAME record to use for domain validation in Windows Azure</a></td>
<td>Domain Registrar</td>
</tr>
<tr>
<td>3. <a href="#validate-subdomain">Validate the subdomain in Windows Azure</a></td>
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
</tbody>
</table>
<a name="configure-domain"></a>
<h3>Configure a Custom Domain for the Storage Account</h3>
<ol>
<li>
<p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>In the navigation pane, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</p>
</li>
<li>
<p>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</p>
</li>
<li>
<p>In the items list, click the storage account that you want to associate with a custom subdomain.</p>
</li>
<li>
<p>On the ribbon, in the <strong>Custom Domain</strong> group, click <strong>Add Domain</strong>.</p>
<p>The <strong>Add a Custom Domain</strong> dialog box opens.</p>
</li>
<li>
<p>In the <strong>Custom domain name </strong>field, enter the subdomain that you will use to reference blob containers for the storage account (for example, data.contoso.com), and then click <strong>OK</strong>.</p>
<p>The <strong>Validate Custom Domain</strong> dialog box (shown below) opens. The dialog box displays the information that you need to create a CNAME record on the domain registrar's website.</p>
<img src="http://i.msdn.microsoft.com/dynimg/IC544437.jpg" alt="Validate Custom Domain dialog box" id="621cdb81-7a84-45b7-916a-9401311aa0c4"/></li>
<li>
<p>Use the <strong>Copy</strong> button at the right end of each field to copy the alias and destination host name that you will use in the CNAME record, and paste these values into email or a text editor for later use. At the confirmation prompt, click <strong>Yes</strong> to allow the values to be copied to the Clipboard. You will paste these values into the website of your domain registrar in the next procedure.</p>
<p>The items list shows the new custom subdomain under the storage account. The custom domain has <strong>Pending</strong> status until you validate the subdomain in the Management Portal. Your next step is to create a CNAME record that Windows Azure will use to confirm that you control the subdomain.</p>
</li>
</ol><a name="create-cname"></a>
<h3>Create a CNAME Record to Use for Domain Validation in Windows Azure</h3>
<ol>
<li>
<p>On your domain registrar's website, add a CNAME record to the domain, using the alias and destination host name that you copied from the <strong>Validate Custom Domain</strong> dialog box.</p>
<p>For example, if you are using the subdomain data.contoso.com, your CNAME record will use values that look similar to this:</p>
<ul>
<li><strong>Alias name:</strong> 0e6cd138-82b8-4136-adae-91dbaa369576.data.contoso.com</li>
<li><strong>Points to host name:</strong> verify.azure.com</li>
</ul>
<table border="0">
<tbody>
<tr><th class="style1" align="left"><strong>Note: </strong>Different domain registrars use different names for the two parameters in the CNAME record.</th></tr>
</tbody>
</table>
</li>
<li>
<p>Allow time for the CNAME record to propagate to all name servers on the Internet. Propagation can take 12 hours or longer.</p>
</li>
</ol><a name="validate-subdomain"></a>
<h3>Validate the Subdomain in Windows Azure</h3>
<ol>
<li>
<p>In the Windows Azure Management Portal,  in the navigation pane, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</p>
</li>
<li>
<p>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</p>
</li>
<li>
<p>In the items list, under the storage account, click the custom subdomain that you want to validate.</p>
</li>
<li>
<p>On the ribbon, in the <strong>Custom Domain</strong> group, click <strong>Validate Domain</strong>.</p>
<p>If the validation is successful, the status of the custom subdomain changes to <strong>Allowed</strong>.</p>
<table border="0">
<tbody>
<tr><th class="style1" align="left"><strong>Note: </strong>If the validation is not successful, the <strong>Validate Custom Domain</strong> dialog box displays a validation status of <strong>Validation Failed</strong>, and the items list shows the custom subdomain status as <strong>Forbidden</strong>. In that case, you might need to wait awhile longer to allow the updated domain record to finish propagating to all name servers on the Internet.</th></tr>
</tbody>
</table>
<table border="0">
<tbody>
<tr><th class="style1" align="left"><strong>Important: </strong>Windows Azure only validates that a CNAME record for the domain corresponds to the alias that you copied from the <strong>Validate Custom Domain</strong> dialog box. (In the <strong>Properties</strong> pane for the custom domain, this alias is displayed under <strong>CName redirect</strong>.) Windows Azure does not check to make sure that you used a subdomain for the custom domain. If you did not use a subdomain for the custom domain, you will not be able to access your blobs using the custom domain name, even if validation succeeds.</th></tr>
</tbody>
</table>
</li>
</ol><a name="associate-subdomain"></a>
<h3>Create a CNAME Record to Associate the Subdomain with the Storage Account</h3>
<ol>
<li>
<p>On the domain registrar's website, add a second CNAME record to the domain. This CNAME record associates the validated custom subdomain name with the Windows Azure storage account.</p>
<p>For example, if your validated subdomain is data.contoso.com, create a CNAME record with the following entries:</p>
<ul>
<li><strong>Alias name: </strong>data.contoso.com</li>
<li><strong>Points to host name: </strong>&lt;<em>mystorageaccount</em>&gt;.blob.core.windows.net</li>
</ul>
</li>
<li>
<p>Allow time for the CNAME record to propagate to all name servers on the Internet.</p>
</li>
</ol>
<p>After propagation of the CNAME record completes, you should be able to use the subdomain in URIs to reference public containers and blobs in the storage account.</p>
<a name="verify-subdomain"></a>
<h3>Verify that the Subdomain References the Blob Service</h3>
<p>In a web browser, use a URI in the following format to access a blob in a public container:</p>
<ul>
<li>http://&lt;<em>custom.sub.domain</em>&gt;/&lt;<em>mycontainer</em>&gt;/&lt;<em>myblob</em>&gt;</li>
</ul>
<p>For example, you might type the following URI to access a web form via a data.contoso.com custom subdomain that maps to a blob in your <strong>myforms</strong> container:</p>
<ul>
<li>http://data.contoso.com/myforms/applicationform.htm</li>
</ul>
<h2>Additional Resources</h2>
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg680307.aspx">How to Map CDN Content to a Custom Domain </a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg981933.aspx">How to Configure a Custom Domain for a Windows Azure Hosted Service</a></li>
</ul>