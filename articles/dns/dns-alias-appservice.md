---
title: Host load-balanced Azure web apps at the zone apex 
description: Use an Azure DNS alias record to host load-balanced web apps at the zone apex 
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 09/27/2022
ms.author: greglin
---

# Host load-balanced Azure web apps at the zone apex

The DNS protocol prevents the assignment of anything other than an A or AAAA record at the zone apex. An example zone apex is contoso.com. This restriction presents a problem for application owners who have load-balanced applications behind Traffic Manager. Pointing at the Traffic Manager profile from the zone apex record isn't possible. As a result, application owners must use a workaround. A redirect at the application layer must redirect from the zone apex to another domain. An example is a redirect from `contoso.com` to `www.contoso.com`. This arrangement presents a single point of failure for the redirect function.

With alias records, you no longer will have this problem. You can point your zone apex record to a Traffic Manager profile that has external endpoints. You can also point to the same Traffic Manager profile used for other domains within the DNS zone.

For example, you can point `contoso.com` and `www.contoso.com` to the same Traffic Manager profile. This set up will work as long as the Traffic Manager profile has only external endpoints configured.

In this article, you learn how to create an alias record for your domain apex. Then you'll configure your Traffic Manager profile end points for your web apps.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

You must have a domain name available that you can host in Azure DNS to test with. You must have full control of this domain. Full control includes the ability to set the name server (NS) records for the domain.

For instructions to host your domain in Azure DNS, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

The example domain used for this tutorial is contoso.com, but use your own domain name.

## Create a resource group

Create a resource group to hold all the resources used in this article.

## Create App Service plans

Create two Web App service plans in your resource group. Use the following table to help you configure this set up. For more information about creating an App Service plan, see [Manage an App Service plan in Azure](../app-service/app-service-plan-manage.md).


|Name  |Operating System  |Location  |Pricing Tier  |
|---------|---------|---------|---------|
|ASP-01     |Windows|East US|Dev/Test D1-Shared|
|ASP-02     |Windows|Central US|Dev/Test D1-Shared|

## Create App Services

Create two web apps, one in each App Service plan.

1. On upper left corner of the Azure portal page, select **Create a resource**.
2. Type **Web app** in the search bar and press Enter.
3. Select **Web App**.
4. Select **Create**.
5. Accept the defaults, and use the following table to configure the two web apps:

   |Name<br>(must be unique within .azurewebsites.net)|Resource Group |Runtime stack|Region|App Service Plan/Location
   |---------|---------|-|-|-------|
   |App-01|Use existing<br>Select your resource group|.NET Core 2.2|East US|ASP-01(D1)|
   |App-02|Use existing<br>Select your resource group|.NET Core 2.2|Central US|ASP-02(D1)|

### Gather some details

Now you need to note the IP address and host name for the web apps.

1. Open your resource group and select your first web app (**App-01** in this example).
2. In the left column, select **Properties**.
3. Note the address under **URL**, and under **Outbound IP Addresses** note the first IP address in the list. You'll use this information later when you configure your Traffic Manager end points.
4. Repeat for **App-02**.

## Create a Traffic Manager profile

Create a Traffic Manager profile in your resource group. Use the defaults and type a unique name within the trafficmanager.net namespace.

For more information, see [Quickstart: Create a Traffic Manager profile for a highly available web application](../traffic-manager/quickstart-create-traffic-manager-profile.md).

### Create endpoints

Now you can create the endpoints for the two web apps.

1. Open your resource group and select your Traffic Manager profile.
2. In the left column, select **Endpoints**.
3. Select **Add**.
4. Use the following table to configure the endpoints:

   |Type  |Name  |Target  |Location  |Custom Header settings|
   |---------|---------|---------|---------|---------|
   |External endpoint     |End-01|IP address you recorded for App-01|East US|host:\<the URL you recorded for App-01\><br>Example: **host:app-01.azurewebsites.net**|
   |External endpoint     |End-02|IP address you recorded for App-02|Central US|host:\<the URL you recorded for App-02\><br>Example: **host:app-02.azurewebsites.net**

## Create DNS zone

You can either use an existing DNS zone for testing, or you can create a new zone. To create and delegate a new DNS zone in Azure, see [Tutorial: Host your domain in Azure DNS](dns-delegate-domain-azure-dns.md).

## Add a TXT record for custom domain validation

When you add a custom hostname to your web apps, it will look for a specific TXT record to validate your domain.

1. Open your resource group and select the DNS zone.
2. Select **Record set**.
3. Add the record set using the following table. For the value, use the actual web app URL that you previously recorded:

   |Name  |Type  |Value|
   |---------|---------|-|
   |@     |TXT|App-01.azurewebsites.net|


## Add a custom domain

Add a custom domain for both web apps.

1. Open your resource group and select your first web app.
2. In the left column, select **Custom domains**.
3. Under **Custom Domains**, select **Add custom domain**.
4. Under **Custom domain**, type your custom domain name. For example, contoso.com.
5. Select **Validate**.

   Your domain should pass validation and show green check marks next to **Hostname availability** and **Domain ownership**.
5. Select **Add custom domain**.
6. To see the new hostname under **Hostnames assigned to site**, refresh your browser. The refresh on the page doesn't always show changes right away.
7. Repeat this procedure for your second web app.

## Add the alias record set

Now add an alias record for the zone apex.

1. Open your resource group and select the DNS zone.
2. Select **Record set**.
3. Add the record set using the following table:

   |Name  |Type  |Alias record set  |Alias type  |Azure resource|
   |---------|---------|---------|---------|-----|
   |@     |A|Yes|Azure resource|Traffic Manager - your profile|


## Test your web apps

Now you can test to make sure you can reach your web app and that it's being load balanced.

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
- [DNS FAQ](./dns-faq.yml)

To learn how to migrate an active DNS name, see [Migrate an active DNS name to Azure App Service](../app-service/manage-custom-dns-migrate-domain.md).