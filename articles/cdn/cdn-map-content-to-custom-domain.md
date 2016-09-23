<properties
	 pageTitle="How to Map Azure Content Delivery Network (CDN) Content to a Custom Domain | Microsoft Azure"
	 description="This topic demonstrate how to map a CDN content to a Custom Domain."
	 services="cdn"
	 documentationCenter=""
	 authors="camsoper"
	 manager="erikre"
	 editor=""/>
<tags
	 ms.service="cdn"
	 ms.workload="media"
	 ms.tgt_pltfrm="na"
	 ms.devlang="na"
	 ms.topic="article"
	ms.date="07/28/2016"
	 ms.author="casoper"/>

# How to map Custom Domain to Content Delivery Network (CDN) endpoint
You can map a custom domain to a CDN endpoint in order to use your own domain name in URLs to cached content rather than using a subdomain of azureedge.net.

There are two ways to map your custom domain to a CDN endpoint:

1. [Create a CNAME record with your domain registrar and map your custom domain and subdomain to the CDN endpoint](#register-a-custom-domain-for-an-azure-cdn-endpoint)

	A CNAME record is a DNS feature that maps a source domain, like `www.contosocdn.com` or `cdn.contoso.com`, to a destination domain. In this case, the source domain is your custom domain and subdomain (a subdomain, like **www** or **cdn** is always required). The destination domain is your CDN endpoint.  

	The process of mapping your custom domain to your CDN endpoint can, however, result in a brief period of downtime for the domain while you are registering the domain in the Azure  Portal.

2. [Add an intermediate registration step with **cdnverify**](#register-a-custom-domain-for-an-azure-cdn-endpoint-using-the-intermediary-cdnverify-subdomain)

	If your custom domain is currently supporting an application with a service-level agreement (SLA) that requires that there be no downtime, then you can use the Azure **cdnverify** subdomain to provide an intermediate registration step so that users will be able to access your domain while the DNS mapping takes place.  

After you register your custom domain using one of the above procedures, you will want to [verify that the custom subdomain references your CDN endpoint](#verify-that-the-custom-subdomain-references-your-cdn-endpoint).

> [AZURE.NOTE] You must create a CNAME record with your domain registrar to map your domain to the CDN endpoint. CNAME records map specific subdomains such as `www.contoso.com` or `cdn.contoso.com`. It is not possible to map a CNAME record to a root domain, such as `contoso.com`.
>    
> A subdomain can only be associated with one CDN endpoint. The CNAME record that you create will route all traffic addressed to the subdomain to the specified endpoint.  For example, if you associate `www.contoso.com` with your CDN endpoint, then you cannot associate it with other Azure endpoints, such as a storage account endpoint or a cloud service endpoint. However, you can use different subdomains from the same domain for different service endpoints. You can also map different subdomains to the same CDN endpoint.
>
> For **Azure CDN from Verizon** (Standard and Premium) endpoints, note that it takes up to **90 minutes** for custom domain changes to propagate to CDN edge nodes.

## Register a custom domain for an Azure CDN endpoint

1.	Log into the [Azure Portal](https://portal.azure.com/).
2.	Click **Browse**, then **CDN Profiles**, then the CDN profile with the endpoint you want to map to a custom domain.  
3.	In the **CDN Profile** blade, click the CDN endpoint with which you want to associate the subdomain.
4.	At the top of the endpoint blade, click the **Add Custom Domain** button.  In the **Add a custom domain** blade, you'll see the endpoint host name, derived from your CDN endpoint, to use in creating a new CNAME record. The format of the host name address will appear as **&lt;EndpointName>.azureedge.net**.  You can copy this host name to use in creating the CNAME record.  
5.	Navigate to your domain registrar's web site, and locate the section for creating DNS records. You might find this in a section such as **Domain Name**, **DNS**, or **Name Server Management**.
6.	Find the section for managing CNAMEs. You may have to go to an advanced settings page and look for the words CNAME, Alias, or Subdomains.
7.	Create a new CNAME record that maps your chosen subdomain (for example, **www** or **cdn**) to the host name provided in the **Add a custom domain** blade.
8.	Return to the **Add a custom domain** blade, and enter your custom domain, including the subdomain, in the dialog box. For example, enter the domain name in the format `www.contoso.com` or `cdn.contoso.com`.   

	Azure will verify that the CNAME record exists for the domain name you have entered. If the CNAME is correct, your custom domain is validated.  For **Azure CDN from Verizon** (Standard and Premium) endpoints, it may take up to 90 minutes for custom domain settings to propagate to all CDN edge nodes, however.  

	Note that in some cases it can take time for the CNAME record to propagate to name servers on the Internet. If your domain is not validated immediately, and you believe the CNAME record is correct, then wait a few minutes and try again.


## Register a custom domain for an Azure CDN endpoint using the intermediary cdnverify subdomain  

1. Log into the [Azure Portal](https://portal.azure.com/).
2. Click **Browse**, then **CDN Profiles**, then the CDN profile with the endpoint you want to map to a custom domain.  
3. In the **CDN Profile** blade, click the CDN endpoint with which you want to associate the subdomain.
4. At the top of the endpoint blade, click the **Add Custom Domain** button.  In the **Add a custom domain** blade, you'll see the endpoint host name, derived from your CDN endpoint, to use in creating a new CNAME record. The format of the host name address will appear as **&lt;EndpointName>.azureedge.net**.  You can copy this host name to use in creating the CNAME record.
5. Navigate to your domain registrar's web site, and locate the section for creating DNS records. You might find this in a section such as **Domain Name**, **DNS**, or **Name Server Management**.
6. Find the section for managing CNAMEs. You may have to go to an advanced settings page and look for the words **CNAME**, **Alias**, or **Subdomains**.
7. Create a new CNAME record, and provide a subdomain alias that includes the **cdnverify** subdomain. For example, the subdomain that you specify will be in the format **cdnverify.www** or **cdnverify.cdn**. Then provide the host name, which is your CDN endpoint, in the format **cdnverify.&lt;EndpointName>.azureedge.net**.
8. Return to the **Add a custom domain** blade, and enter your custom domain, including the subdomain, in the dialog box. For example, enter the domain name in the format `www.contoso.com` or `cdn.contoso.com`. Note that in this step, you do not need to preface the subdomain with **cdnverify**.  

	Azure will verify that the CNAME record exists for the cdnverify domain name you have entered.
9. At this point, your custom domain has been verified by Azure, but traffic to your domain is not yet being routed to your CDN endpoint. After waiting long enough to allow the custom domain settings to propagate to the CDN edge nodes (90 minutes for **Azure CDN from Verizon**, 1-2 minutes for **Azure CDN from Akamai**), return to your DNS registrar's web site and create another CNAME record that maps your subdomain to your CDN endpoint. For example, specify the subdomain as **www** or **cdn**, and the hostname as **&lt;EndpointName>.azureedge.net**. With this step, the registration of your custom domain is complete.
10.	Finally, you can delete the CNAME record you created using **cdnverify**, as it was necessary only as an intermediary step.  


## Verify that the custom subdomain references your CDN endpoint

- After you have completed the registration of your custom domain, you can access content that is cached at your CDN endpoint using the custom domain.
First, ensure that you have public content that is cached at the endpoint. For example, if your CDN endpoint is associated with a storage account, the CDN caches content in public blob containers. To test the custom domain, ensure that your container is set to allow public access and that it contains at least one blob.
- In your browser, navigate to the address of the blob using the custom domain. For example, if your custom domain is `cdn.contoso.com`, the URL to a cached blob will be similar to the following URL:
		http://cdn.contoso.com/mypubliccontainer/acachedblob.jpg

## See Also

[How to Enable the Content Delivery Network (CDN)  for Azure](./cdn-create-new-endpoint.md)  
