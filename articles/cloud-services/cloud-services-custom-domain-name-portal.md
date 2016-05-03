<properties
	pageTitle="Configure a custom domain name in Cloud Services | Microsoft Azure"
	description="Learn how to expose your Azure application or data to the internet on a custom domain by configuring DNS settings.  These examples use the Azure portal."
	services="cloud-services"
	documentationCenter=".net"
	authors="Thraka"
	manager="timlt"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="adegeo"/>

# Configuring a custom domain name for an Azure cloud service

> [AZURE.SELECTOR]
- [Azure portal](cloud-services-custom-domain-name-portal.md)
- [Azure classic portal](cloud-services-custom-domain-name.md)

When you create a Cloud Service, Azure assigns it to a subdomain of **cloudapp.net**. For example, if your Cloud Service is named "contoso", your users will be able to access your application on a URL like http://contoso.cloudapp.net. Azure also assigns a virtual IP address.

However, you can also expose your application on your own domain name, such as **contoso.com**. This article explains how to reserve or configure a custom domain name for Cloud Service web roles.

Do you already undestand what CNAME and A records are? [Jump past the explaination](#add-a-cname-record-for-your-custom-domain).

> [AZURE.NOTE]
> The procedures in this task apply to Azure Cloud Services. For App Services, see [this](../app-service-web/web-sites-custom-domain-name.md). For storage accounts, see [this](../storage/storage-custom-domain-name.md).

<p/>

> [AZURE.TIP]
> Get going faster--use the NEW Azure [guided walkthrough](http://support.microsoft.com/kb/2990804)!  It makes associating a custom domain name AND securing communication (SSL) with Azure Cloud Services or Azure Websites a snap.

## Understand CNAME and A records

CNAME (or alias records) and A records both allow you to associate a domain name with a specific server (or service in this case,) however they work differently. There are also some specific considerations when using A records with Azure Cloud services that you should consider before deciding which to use.

### CNAME or Alias record

A CNAME record maps a *specific* domain, such as **contoso.com** or **www.contoso.com**, to a canonical domain name. In this case, the canonical domain name is the **[myapp].cloudapp.net** domain name of your Azure hosted application. Once created, the CNAME creates an alias for the **[myapp].cloudapp.net**. The CNAME entry will resolve to the IP address of your **[myapp].cloudapp.net** service automatically, so if the IP address of the cloud service changes, you do not have to take any action.

> [AZURE.NOTE]
> Some domain registrars only allow you to map subdomains when using a CNAME record, such as www.contoso.com, and not root names, such as contoso.com. For more information on CNAME records, see the documentation provided by your registrar, [the Wikipedia entry on CNAME record](http://en.wikipedia.org/wiki/CNAME_record), or the [IETF Domain Names - Implementation and Specification](http://tools.ietf.org/html/rfc1035) document.

### A record

An *A* record maps a domain, such as **contoso.com** or **www.contoso.com**, *or a wildcard domain* such as **\*.contoso.com**, to an IP address. In the case of an Azure Cloud Service, the virtual IP of the service. So the main benefit of an A record over a CNAME record is that you can have one entry that uses a wildcard, such as \***.contoso.com**, which would handle requests for multiple sub-domains such as **mail.contoso.com**, **login.contoso.com**, or **www.contso.com**.

> [AZURE.NOTE]
> Since an A record is mapped to a static IP address, it cannot automatically resolve changes to the IP address of your Cloud Service. The IP address used by your Cloud Service is allocated the first time you deploy to an empty slot (either production or staging.) If you delete the deployment for the slot, the IP address is released by Azure and any future deployments to the slot may be given a new IP address.
>
> Conveniently, the IP address of a given deployment slot (production or staging) is persisted when swapping between staging and production deployments or performing an in-place upgrade of an existing deployment. For more information on performing these actions, see [How to manage cloud services](cloud-services-how-to-manage.md).


## Add a CNAME record for your custom domain

To create a CNAME record, you must add a new entry in the DNS table for your custom domain by using the tools provided by your registrar. Each registrar has a similar but slightly different method of specifying a CNAME record, but the concepts are the same.

1. Use one of these methods to find the **.cloudapp.net** domain name assigned to your cloud service.

    * Login to the [Azure portal], select your cloud service, look at the **Essentials** section and then find the **Site URL** entry.

        ![quick glance section showing the site URL][csurl]
            
        **OR**
  
    * Install and configure [Azure Powershell](../powershell-install-configure.md), and then use the following command:

        ```powershell
        Get-AzureDeployment -ServiceName yourservicename | Select Url
        ```
    
    Save the domain name used in the URL returned by either method, as you will need it when creating a CNAME record.

1.  Log on to your DNS registrar's website and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

2.  Now find where you can select or enter CNAME's. You may have to select the record type from a drop down, or go to an advanced settings page. You should look for the words **CNAME**, **Alias**, or **Subdomains**.

3.  You must also provide the domain or subdomain alias for the CNAME, such as **www** if you want to create an alias for **www.customdomain.com**. If you want to create an alias for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

4. Then, you must provide a canonical host name, which is your application's **cloudapp.net** domain in this case.

For example, the following CNAME record forwards all traffic from **www.contoso.com** to **contoso.cloudapp.net**, the custom domain name of your deployed application:

| Alias/Host name/Subdomain | Canonical domain     |
| ------------------------- | -------------------- |
| www                       | contoso.cloudapp.net |

> [AZURE.NOTE]
A visitor of **www.contoso.com** will never see the true host
(contoso.cloudapp.net), so the forwarding process is invisible to the
end user.

> The example above only applies to traffic at the **www** subdomain. Since you cannot use wildcards with CNAME records, you must create one CNAME for each domain/subdomain. If you want to direct  traffic from subdomains, such as *.contoso.com, to your cloudapp.net address, you can configure a **URL Redirect** or **URL Forward** entry in your DNS settings, or create an A record.


## Add an A record for your custom domain

To create an A record, you must first find the virtual IP address of your cloud service. Then add a new entry in the DNS table for your custom domain by using the tools provided by your registrar. Each registrar has a similar but slightly different method of specifying an A record, but the concepts are the same.

1. Use one of the following methods to get the IP address of your cloud service.

    * Login to the [Azure portal], select your cloud service, look at the **Essentials** section and then find the **Public IP addresses** entry.

        ![quick glance section showing the VIP][vip]

        **OR**

    * Install and configure [Azure Powershell](../powershell-install-configure.md), and then use the following command:

        ```powershell
        get-azurevm -servicename yourservicename | get-azureendpoint -VM {$_.VM} | select Vip
        ```
    
    Save the IP address, as you will need it when creating an A record.

1.  Log on to your DNS registrar's website and go to the page for managing DNS. Look for links or areas of the site labeled as **Domain Name**, **DNS**, or **Name Server Management**.

2.  Now find where you can select or enter A record's. You may have to select the record type from a drop down, or go to an advanced settings page.

3. Select or enter the domain or subdomain that will use this A record. For example, select **www** if you want to create an alias for **www.customdomain.com**. If you want to create a wildcard entry for all subdomains, enter '__*__'. This will cover all sub-domains such as **mail.customdomain.com**, **login.customdomain.com**, and **www.customdomain.com**.

    If you want to create an A record for the root domain, it may be listed as the '**@**' symbol in your registrar's DNS tools.

4. Enter the IP address of your cloud service in the provided field. This associates the domain entry used in the A record with the IP address of your cloud service deployment.

For example, the following A record forwards all traffic from **contoso.com** to **137.135.70.239**, the IP address of your deployed application:

| Host name/Subdomain | IP address     |
| ------------------- | -------------- |
| @                   | 137.135.70.239 |


This example demonstrates creating an A record for the root domain. If you wish to create a wildcard entry to cover all subdomains, you would enter '__*__' as the subdomain.

>[AZURE.WARNING]
>IP addresses in Azure are dynamic by default. You will probably want to use a [reserved IP address](../virtual-network/virtual-networks-reserved-public-ip.md) to ensure that your IP address does not change.

## Next steps

* [How to Manage Cloud Services](cloud-services-how-to-manage.md)
* [How to Map CDN Content to a Custom Domain](../cdn/cdn-map-content-to-custom-domain.md)
* [General configuration of your cloud service](cloud-services-how-to-configure-portal.md).
* Learn how to [deploy a cloud service](cloud-services-how-to-create-deploy-portal.md).
* Configure [ssl certificates](cloud-services-configure-ssl-certificate-portal.md).

[Expose Your Application on a Custom Domain]: #access-app
[Add a CNAME Record for Your Custom Domain]: #add-cname
[Expose Your Data on a Custom Domain]: #access-data
[VIP swaps]: cloud-services-how-to-manage-portal.md#how-to-swap-deployments-to-promote-a-staged-deployment-to-production
[Create a CNAME record that associates the subdomain with the storage account]: #create-cname
[Azure portal]: https://portal.azure.com
[vip]: ./media/cloud-services-custom-domain-name-portal/csvip.png
[csurl]: ./media/cloud-services-custom-domain-name-portal/csurl.png
 