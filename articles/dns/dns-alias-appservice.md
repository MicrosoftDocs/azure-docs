---
title: Host load-balanced Azure web apps at the zone apex 
description: Use an Azure DNS alias record to host load-balanced web apps at the zone apex 
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 7/13/2019
ms.author: victorh
---

# Host load-balanced Azure web apps at the zone apex

The DNS protocol prevents the assignment of anything other than an A or AAAA record at the zone apex. An example zone apex is contoso.com. This restriction presents a problem for application owners who have load-balanced applications behind Traffic Manager. It isn't possible to point at the Traffic Manager profile from the zone apex record. As a result, application owners must use a workaround. A redirect at the application layer must redirect from the zone apex to another domain. An example is a redirect from contoso.com to www\.contoso.com. This arrangement presents a single point of failure for the redirect function.

With alias records, this problem no longer exists. Now application owners can point their zone apex record to a Traffic Manager profile that has external endpoints. Application owners can point to the same Traffic Manager profile that's used for any other domain within their DNS zone.

For example, contoso.com and www\.contoso.com can point to the same Traffic Manager profile. This is the case as long as the Traffic Manager profile has only external endpoints configured.

In this article, you learn how to create an alias record for your domain apex, and configure your Traffic Manager profile end points for your web apps.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

The example domain used for this tutorial is contoso.com, but use your own domain name.

## Create a resource group

Create a resource group to hold all the resources used in this article.

## Create App Service plans

Create two Web App Service plans in your resource group using the following table for configuration information. For more information about creating an App Service plan, see [Manage an App Service plan in Azure](../app-service/app-service-plan-manage.md).


|Name  |Operating System  |Location  |Pricing Tier  |
|---------|---------|---------|---------|
|ASP-01     |Windows|East US|Dev/Test D1-Shared|
|ASP-02     |Windows|Central US|Dev/Test D1-Shared|

## Create App Services

Create two web apps, one in each App Service plan.

1. On upper left corner of the Azure portal page, click **Create a resource**.
2. Type **Web app** in the search bar and press Enter.
3. Click **Web App**.
4. Click **Create**.
5. Accept the defaults, and use the following table to configure the two web apps:

   |Name<br>(must be unique within .azurewebsites.net)|Resource Group |App Service Plan/Location
   |---------|---------|---------|
   |App-01|Use existing<br>Select your resource group|ASP-01(East US)|
   |App-02|Use existing<br>Select your resource group|ASP-02(Central US)|

### Gather some details

Now you need to note the IP address and host name for the apps.

1. Open your resource group and click your first app (**App-01** in this example).
2. In the left column, click **Properties**.
3. Note the address under **URL**, and under **Outbound IP Addresses** note the first IP address in the list. You will use this information later when you configure your Traffic Manager end points.
4. Repeat for **App-02**.

## Create a Traffic Manager profile

Create a Traffic Manager profile in your resource group. Use the defaults and type a unique name within the trafficmanager.net namespace.

For information about creating a Traffic Manager profile, see [Quickstart: Create a Traffic Manager profile for a highly available web application](../traffic-manager/quickstart-create-traffic-manager-profile.md).

### Create endpoints

Now you can create the endpoints for the two web apps.

1. Open your resource group and click your Traffic Manager profile.
2. In the left column, click **Endpoints**.
3. Click **Add**.
4. Use the following table to configure the endpoints:

   |Type  |Name  |Target  |Location  |Custom Header settings|
   |---------|---------|---------|---------|---------|
   |External endpoint     |End-01|IP address you recorded for App-01|East US|host:\<the URL you recorded for App-01\><br>Example: **host:app-01.azurewebsites.net**|
   |External endpoint     |End-02|IP address you recorded for App-02|Central US|host:\<the URL you recorded for App-02\><br>Example: **host:app-02.azurewebsites.net**

## Create DNS zone

You can either use an existing DNS zone for testing, or you can create a new zone. To create and delegate a new DNS zone in Azure, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

### Add the alias record set

When your DNS zone is ready, you can add an alias record for the zone apex.

1. Open your resource group and click the DNS zone.
2. Click **Record set**.
3. Add the record set using the following table:

   |Name  |Type  |Alias record set  |Alias type  |Azure resource|
   |---------|---------|---------|---------|-----|
   |@     |A|Yes|Azure resource|Traffic Manager - your profile|

## Add custom hostnames

Add a custom hostname to both web apps.

1. Open your resource group and click your first web app.
2. In the left column, click **Custom domains**.
3. Click **Add hostname**.
4. Under Hostname, type your domain name. For example, contoso.com.

   Your domain should pass validation and show green check marks next to **hostname availability** and **domain ownership**.
5. Click **Add hostname**.
6. To see the new hostname under **Hostnames assigned to site**, refresh your browser. The refresh on the page does not always show changes right away.
7. Repeat this procedure for your second web app.

## Test your web apps

Now you can test to make sure you can reach your web app and that it is being load balanced.

1. Open a web browser and browse to your domain. For example, contoso.com. You should see the default web app page.
2. Stop your first web app.
3. Close your web browser, and wait a few minutes.
4. Start your web browser and browse to your domain. You should still see the default web app page.
5. Stop your second web app.
6. Close your web browser, and wait a few minutes.
7. Start your web browser and browse to your domain. You should see Error 403, indicating that the web app is stopped.
8. Start your second web app.
9. Close your web browser, and wait a few minutes.
10. Start your web browser and browse to your domain. You should see the default web app page again.

## Next steps

To learn more about alias records, see the following articles:

- [Tutorial: Configure an alias record to refer to an Azure public IP address](tutorial-alias-pip.md)
- [Tutorial: Configure an alias record to support apex domain names with Traffic Manager](tutorial-alias-tm.md)
- [DNS FAQ](https://docs.microsoft.com/azure/dns/dns-faq#alias-records)

To learn how to migrate an active DNS name, see [Migrate an active DNS name to Azure App Service](../app-service/manage-custom-dns-migrate-domain.md).
