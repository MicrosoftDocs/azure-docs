<properties 
	pageTitle="Configure a domain name for blob data in a storage account | Microsoft Azure" 
	description="Learn how to configure a custom domain for accessing blob data in an Azure storage account." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/18/2015" 
	ms.author="tamram"/>


# Configure a custom domain name for blob data in an Azure storage account

## Overview

You can configure a custom domain for accessing blob data in your Azure storage account. The default endpoint for the Blob service is https://<*mystorageaccount*>.blob.core.windows.net. If you map a custom domain and subdomain such as **www.contoso.com** to the blob endpoint for your storage account, then your users can also access blob data in your storage account using that domain. 


> [AZURE.NOTE]	The procedures in this task apply to Azure storage accounts. For cloud services, see <a href = "/develop/net/common-tasks/custom-dns/">Configuring a Custom Domain Name for an Azure Cloud Service</a>; for Websites, see <a href="/develop/net/common-tasks/custom-dns-web-site/">Configuring a Custom Domain Name for an Azure Website</a>. 

There are two ways to point your custom domain to the blob endpoint for your storage account. The simplest way is to create a CNAME record mapping your custom domain and subdomain to the blob endpoint. A CNAME record is a DNS feature that maps a source domain to a destination domain. In this case, the source domain is your custom domain and subdomain--note that the subdomain is always required. The destination domain is your Blob service endpoint.

The process of mapping your custom domain to your blob endpoint can, however, result in a brief period of downtime for the domain while you are registering the domain in the Azure Management Portal. If your custom domain is currently supporting an application with a service-level agreement (SLA) that requires that there be no downtime, then you can use the Azure **asverify** subdomain to provide an intermediate registration step so that users will be able to access your domain while the DNS mapping takes place.

The following table shows sample URLs for accessing blob data in a storage account named **mystorageaccount**. The custom domain registered for the storage account is **www.contoso.com**:

Resource Type|URL Formats
---|---
Storage account|**Default URL:** http://mystorageaccount.blob.core.windows.net<p>**Custom domain URL:** http://www.contoso.com</td>
Blob|**Default URL:** http://mystorageaccount.blob.core.windows.net/mycontainer/myblob<p>**Custom domain URL:** http://www.contoso.com/mycontainer/myblob
Root container|**Default URL:** http://mystorageaccount.blob.core.windows.net/myblob or http://mystorageaccount.blob.core.windows.net/$root/myblob<p>**Custom domain URL:** http://www.contoso.com/myblob or http://www.contoso.com/$root/myblob

## Register a custom domain for your storage account

Use this procedure to register your custom domain if you do not have concerns about having the domain be briefly unavailable to users, or if your custom domain is not currently hosting an application. 

If your custom domain is currently supporting an application that cannot have any downtime, then use the procedure outlined in <a href="#register-asverify">Register a custom domain for your storage account using the intermediary asverify subdomain</a>.

To configure a custom domain name, you must create a new CNAME record with your domain registrar. The CNAME record specifies an alias for a domain name; in this case it maps the address of your custom domain to the the Blob service endpoint for your storage account.

Each registrar has a similar but slightly different method of specifying a CNAME record, but the concept
is the same. Note that many basic domain registration packages do not offer DNS configuration, so you may need to upgrade your domain registration package before you can create the CNAME record. 

1.  In the Azure Management Portal, navigate to the **Storage** tab.

2.  In the **Storage** tab, click the name of the storage account for which you want to map the custom domain.

3.  Click the **Configure** tab.

4.  At the bottom of the screen click **Manage Domain** to display the **Manage Custom Domain** dialog. In the text at the top of the dialog, you'll see information on how to create the CNAME record. For this procedure, ignore the text that refers to the **asverify** subdomain.

5.  Log on to your DNS registrar's website, and go to the page for
    managing DNS. You might find this in a section such as **Domain
    Name**, **DNS**, or **Name Server Management**.

6.  Find the section for managing CNAMEs. You may have to go to an
    advanced settings page and look for the words **CNAME**, **Alias**,
    or **Subdomains**.

7.  Create a new CNAME record, and provide a subdomain alias, such as **www** or **photos**. Then
    provide a host name, which is your Blob service endpoint, in the format **mystorageaccount.blob.core.windows.net** (where **mystorageaccount** is the name of your storage account). The host name to use is provided for you in the text of the **Manage Custom Domain** dialog.

8.  After you have created the CNAME record, return to the **Manage Custom Domain** dialog, and enter the name of your custom domain, including the subdomain, in the **Custom Domain Name** field. For example, if your domain is **contoso.com** and your subdomain is **www**, enter **www.contoso.com**; if your subdomain is **photos**, enter **photos.contoso.com**. Note that the subdomain is required.

9. Click the **Register** button to register your custom domain. 

	If the registration is successful, you will see the message **Your custom domain is active**. Users can now view blob data on your custom domain, so long as they have the appropriate permissions. 

## Register a custom domain for your storage account using the intermediary asverify subdomain

Use this procedure to register your custom domain if your custom domain is currently supporting an application with an SLA that requires that there be no downtime. By creating a CNAME that points from asverify.&lt;subdomain&gt;.&lt;customdomain&gt; to asverify.&lt;storageaccount&gt;.blob.core.windows.net, you can pre-register your domain with Azure. You can then create a second CNAME that points from &lt;subdomain&gt;.&lt;customdomain&gt; to &lt;storageaccount&gt;.blob.core.windows.net, at which point traffic to your custom domain will be directed to your blob endpoint.

The asverify subdomain is a special subdomain recognized by Azure. By prepending **asverify** to your own subdomain, you permit Azure to recognize your custom domain without modifying the DNS record for the domain. Once you do modify the DNS record for the domain, it will be mapped to the blob endpoint with no downtime.

1.  In the Azure Management Portal, navigate to the **Storage** tab.

2.  In the **Storage** tab, click the name of the storage account for which you want to map the custom domain.

3.  Click the **Configure** tab.

4.  At the bottom of the screen click **Manage Domain** to display the **Manage Custom Domain** dialog. In the text at the top of the dialog, you'll see information on how to create the CNAME record using the **asverify** subdomain.

5.  Log on to your DNS registrar's website, and go to the page for
    managing DNS. You might find this in a section such as **Domain
    Name**, **DNS**, or **Name Server Management**.

6.  Find the section for managing CNAMEs. You may have to go to an
    advanced settings page and look for the words **CNAME**, **Alias**,
    or **Subdomains**.

7.  Create a new CNAME record, and provide a subdomain alias that includes the asverify subdomain. For example, the subdomain you specify will be in the format **asverify.www** or **asverify.photos**. Then
    provide a host name, which is your Blob service endpoint, in the format **asverify.mystorageaccount.blob.core.windows.net** (where **mystorageaccount** is the name of your storage account). The host name to use is provided for you in the text of the **Manage Custom Domain** dialog.

8.  After you have created the CNAME record, return to the **Manage Custom Domain** dialog, and enter the name of your custom domain in the **Custom Domain Name** field. For example, if your domain is **contoso.com** and your subdomain is **www**, enter **www.contoso.com**; if your subdomain is **photos**, enter **photos.contoso.com**. Note that the subdomain is required.

9.	Click the checkbox that says **Advanced: Use the 'asverify' subdomain to preregister my custom domain**. 

10. Click the **Register** button to preregister your custom domain. 

	If the preregistration is successful, you will see the message **Your custom domain is active**. 

11. At this point, your custom domain has been verified by Azure, but traffic to your domain is not yet being routed to your storage account. To complete the process, return to your DNS registrar's website, and create another CNAME record that maps your subdomain to your Blob service endpoint. For example, specify the subdomain as **www** or **photos**, and the hostname as **mystorageaccount.blob.core.windows.net** (where **mystorageaccount** is the name of your storage account). With this step, the registration of your custom domain is complete.

12. Finally, you can delete the CNAME record you created using **asverify**, as it was necessary only as an intermediary step.

Users can now view blob data on your custom domain, so long as they have the appropriate permissions.

## Verify that the custom domain references your Blob service endpoint

To verify that your custom domain is indeed mapped to your Blob service endpoint, create a blob in a public container within your storage account. Then, in a web browser, use a URI in the following format to access the blob:

-   http://<*subdomain.customdomain*>/<*mycontainer*>/<*myblob*>

For example, you might use the following URI to access a web form via a
**photos.contoso.com** custom subdomain that maps to a blob in your
**myforms** container:

-   http://photos.contoso.com/myforms/applicationform.htm

## Additional Resources

-   <a href="http://msdn.microsoft.com/library/azure/gg680307.aspx">How to Map CDN Content to a Custom Domain</a>
 
