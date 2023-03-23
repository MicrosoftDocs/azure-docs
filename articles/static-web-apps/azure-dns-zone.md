---
title: Delegate domain to Azure DNS 
description: Create an Azure DNS zone for a custom domain in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/14/2021
ms.author: cshoe
---

# Set up an Azure DNS zone for Azure Static Web Apps

You can use Azure DNS to host your DNS domain and manage your DNS records. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services.

Suppose you buy the domain `example.com` from a domain name registrar and then create a zone with the name `example.com` in Azure DNS. Since you're the owner of the domain, your registrar offers you the option to configure the name server (NS) records for your domain. The registrar stores the NS records in the .COM parent zone. Internet users around the world are then directed to your domain in your Azure DNS zone when they try to resolve DNS records in example.com.

This guide demonstrates how to configure your domain name with the `www` subdomain. Once this procedure is complete, you can set up an [apex domain](apex-domain-azure-dns.md).

The following procedure requires you to copy settings from an Azure DNS zone you create and your existing DNS hosting provider. Consider opening the Azure portal and your DNS provider website to make it easier to switch between the two services.

## Create an Azure DNS zone

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the top search bar, enter **DNS zones**.

1. Select **DNS zones**.

2. Select **Create**.

3. In the *Basics* tab, enter the following values.

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription.  |
    | Resource group | Select to create a resource group. |
    | Name | Enter the domain name for this zone. |

4. Select **Review + Create**.

5. Select **Create** and wait for the zone to provision.

6. Select **Go to resource**.

    With the DNS zone created, you now have access to Azure's DNS name servers for your application.

7. From the *Overview* window, copy the values for all four name servers listed as **Name server 1** to **Name server 4** and set them aside in a text editor for later use.

## Update name server addresses

The next step is to update the name server addresses for your domain name. Sign in to your account on your domain provider's website and find the tools to edit your domain settings. While each domain provider is different, look for *Manage DNS*, *Domain settings*, or something similar in your domain account.

1. With the name server addresses you collected from the previous step, update the name server addresses for your domain name.

1. Save your changes.

## Next steps

> [!div class="nextstepaction"]
> [Set up a custom domain in Azure DNS](custom-domain-azure-dns.md)
