---
title: Set up an Azure DNS zone for Azure Static Web Apps
description: Create an Azure DNS zone for a custom domain in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/14/2021
ms.author: cshoe
---

# Set up an Azure DNS zone for Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates are automatically created for the auto-generated domain name and any custom domains you may add.

This guide demonstrates how to configure your domain name with the `www` subdomain. Once this procedure is complete, you can set up an [apex domain](apex-domain-azure-dns.md).

The following procedure requires you to copy settings from an Azure DNS zone you create and your existing static web app. Consider opening the Azure portal in two different windows to make it easier to switch between the two services.

## Create an Azure DNS zone

1. Log in to the [Azure portal](https://portal.azure.com).

1. From the top search bar, enter **DNS zones**.

1. Select **DNS zones**.

1. Select the **Create** button.

1. In the *Basics* tab, enter the following values.

    | Property | Value |
    |---|---|
    | Subscription | Select your Azure subscription.  |
    | Resource group | Select to create a resource group. |
    | Name | Enter the domain name for this zone. |

1. Select **Review + Create**.

1. Select **Create** and wait for the zone to provision.

1. Select **Go to resource**.

    With the DNS zone created, you now have access to Azure's DNS name servers for your application.

1. From the *Overview* window, copy the values for **Name server 1** and **Name server 2** and set them aside in a text editor for later use.

## Update name server addresses

The next step is to update the name server addresses for your domain name. Sign in to your account on your domain provider's website and find the tools to edit your domain settings. While each domain provider is different, look for *Manage DNS*, *Domain settings*, or something similar in your domain account.

1. With the name server addresses you collected from the previous step, update the name server addresses for your domain name.

1. Save your changes.

## Next steps

> [!div class="nextstepaction"]
> [Set up a custom domain in Azure DNS](custom-domain-azure-dns.md)
