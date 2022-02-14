---
title: Set up a custom domain with Azure DNS in Azure Static Web Apps
description: Use Azure DNS to manage your domain name for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/11/2021
ms.author: cshoe
---

# Set up a custom domain with Azure DNS in Azure Static Web Apps

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

1. Save your changes and return to the Azure portal.

## Map the domain to your website

Now that your domain is configured for Azure to manage the DNS, you can now link your DNS zone to your static web app.

### Get static web app URL

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your static web app.

1. From the *Overview* window, copy the generated **URL** of your site and set it aside in a text editor for future use.

### Create DNS records in Azure DNS

1. Return to the DNS zone you created in the Azure portal.

1. Select the **+ Record set button** button.

1. Enter the following values in the *Add record set* window.

    | Setting | Property |
    |---|---|
    | Name | Enter **www** |
    | Type | Select **CNAME - Link your subdomain to another account** |
    | Alias record set | Select **No**. |
    | TTL | Keep default value. |
    | TTL unit | Keep default value. |
    | Alias | Paste in the Static Web Apps generated URL you set aside in a previous step. Make sure to remove the `https://` prefix from your URL. |

1. Select the **OK** button.

### Configure static web app custom domain

1. Return to your static web app in the portal.

1. Under *Settings*, select **Custom domains**.

1. Select the **+ Add** button.

1. In the *Enter domain* tab, enter your domain name prefixed with **www**.

    For instance, if your domain name is `example.com`, enter `www.example.com` into this box.

1. Select the **Next** button.

1. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step (with the `www` subdomain). |
    | Hostname record type | Select **CNAME**. |

1. Select the **Add** button.

    If you get an error saying that the action is invalid, wait 5 minutes and try again.

1. Open a new browser tab and navigate to your domain with the `www` subdomain.

    After the DNS records are updated, you should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Set up the apex domain in Azure DNS](apex-domain-azure-dns.md)
