<properties 
   pageTitle="Create custom DNS records for a web app | Microsoft Azure  " 
   description="How to create custom domain DNS records for web app using Azure DNS." 
   services="dns" 
   documentationCenter="na" 
   authors="cherylmc" 
   manager="carmonm" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/11/2016"
   ms.author="cherylmc"/>

# Create DNS records for a web app in a custom domain

You can use Azure DNS to host a custom domain for your web apps. For example, you are creating an Azure web app and you want your users to access it by either using contoso.com, or www.contoso.com as an FQDN. 

To do this, you have to create two records:

- A root "A" record pointing to contoso.com
- A "CNAME" record for the www name that points to the A record

Keep in mind that if you create an A record for a web app in Azure, the A record must be manually updated if the underlying IP address for the web app changes.

## Before you begin

Before you begin, you must first create a DNS zone in Azure DNS, and delegate the zone in your registrar to Azure DNS.
 
1. To create a DNS zone, follow the steps in [Create a DNS zone](dns-getstarted-create-dnszone.md). 
2. To delegate your DNS to Azure DNS, follow the steps in [DNS domain delegation](dns-domain-delegation.md). 

After creating a zone and delegating it to Azure DNS, you can then create records for your custom domain.

 
## 1. Create an A record for your custom domain

An A record is used to map a name to its IP address. In the following example we will assign @ as an A record to an IPv4 address:

### Step 1
 
Create an A record and assign to a variable $rs
	
	$rs= New-AzureRMDnsRecordSet -Name "@" -RecordType "A" -ZoneName "contoso.com" -ResourceGroupName "MyAzureResourceGroup" -Ttl 600 

### Step 2

Add the IPv4 value to the previously created record set "@" using the $rs variable assigned. The IPv4 value assigned will be the IP address for your web app.

To find the IP address for a web app, follow the steps in [Configure a custom domain name in Azure App Service](../web-sites-custom-domain-name.md#Find-the-virtual-IP-address).

	Add-AzureRMDnsRecordConfig -RecordSet $rs -Ipv4Address <your web app IP address>

### Step 3

Commit the changes to the record set. Use `Set-AzureRMDnsRecordSet` to upload the changes to the record set to Azure DNS:

	Set-AzureRMDnsRecordSet -RecordSet $rs

## 2. Create a CNAME record for your custom domain

If your domain is already managed by Azure DNS (see [DNS domain delegation](dns-domain-delegation.md), you can use the following the example to create a CNAME record for contoso.azurewebsites.net.

### Step 1

Open PowerShell and create a new CNAME record set and assign to a variable $rs. This example will create a record set type CNAME with a "time to live" of 600 seconds in DNS zone named "contoso.com".

	$rs = New-AzureRMDnsRecordSet -ZoneName contoso.com -ResourceGroupName myresourcegroup -Name "www" -RecordType "CNAME" -Ttl 600
 
	Name              : www
	ZoneName          : contoso.com
	ResourceGroupName : myresourcegroup
	Ttl               : 600
	Etag              : 8baceeb9-4c2c-4608-a22c-229923ee1856
	RecordType        : CNAME
	Records           : {}
	Tags              : {}


### Step 2

Once the CNAME record set is created, you need to create an alias value which will point to the web app. 

Using the previously assigned variable "$rs" you can use the PowerShell command below to create the alias for the web app contoso.azurewebsites.net.

	Add-AzureRMDnsRecordConfig -RecordSet $rs -Cname "contoso.azurewebsites.net"
 
	Name              : www
	ZoneName          : contoso.com
	ResourceGroupName : myresourcegroup
	Ttl               : 600
	Etag              : 8baceeb9-4c2c-4608-a22c-229923ee185
	RecordType        : CNAME
	Records           : {contoso.azurewebsites.net}
	Tags              : {}

### Step 3

Commit the changes using the `Set-AzureRMDnsRecordSet` cmdlet:

	Set-AzureRMDnsRecordSet -RecordSet $rs

You can validate the record was created correctly by querying the "www.contoso.com" using nslookup, as shown below:

	PS C:\> nslookup
	Default Server:  Default
	Address:  192.168.0.1
 
	> www.contoso.com
	Server:  default server
	Address:  192.168.0.1
	 
	Non-authoritative answer:
	Name:    <instance of web app service>.cloudapp.net
	Address:  <ip of web app service>
	Aliases:  www.contoso.com
    contoso.azurewebsites.net
    <instance of web app service>.vip.azurewebsites.windows.net

## Create an "awverify" record for web apps


If you decide to use an A record for your web app, you must go through a verification process to ensure you own the custom domain. This verification step is done by creating a special CNAME record named "awverify". This section applies to A records only.


### Step 1

Create the "awverify" record. In the example below, we will create the "aweverify" record for contoso.com to verify ownership for the custom domain. 

	$rs = New-AzureRMDnsRecordSet -ZoneName contoso.com -ResourceGroupName myresourcegroup -Name "awverify" -RecordType "CNAME" -Ttl 600
 
	Name              : awverify
	ZoneName          : contoso.com
	ResourceGroupName : myresourcegroup
	Ttl               : 600
	Etag              : 8baceeb9-4c2c-4608-a22c-229923ee1856
	RecordType        : CNAME
	Records           : {}
	Tags              : {}


### Step 2

Once the record set "awverify" is created, assign the CNAME record set alias. In the example below, we will assign the CNAMe record set alias to awverify.contoso.azurewebsites.net.

	Add-AzureRMDnsRecordConfig -RecordSet $rs -Cname "awverify.contoso.azurewebsites.net"
 
	Name              : awverify
	ZoneName          : contoso.com
	ResourceGroupName : myresourcegroup
	Ttl               : 600
	Etag              : 8baceeb9-4c2c-4608-a22c-229923ee185
	RecordType        : CNAME
	Records           : {awverify.contoso.azurewebsites.net}
	Tags              : {}

### Step 3

Commit the changes using the `Set-AzureRMDnsRecordSet cmdlet`, as shown in the command below.

	Set-AzureRMDnsRecordSet -RecordSet $rs



## Next steps

Follow the steps in [Configuring a custom domain name for App Service](../app-service-web/web-sites-custom-domain-name.md) to configure your web app to use a custom domain.








 