---
title: Set up an apex domain with Azure DNS in Azure Static Web Apps
description: Configure the root domain with Azure DNS in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/11/2022
ms.author: cshoe
---

# Set up an apex domain with Azure DNS in Azure Static Web Apps

Domain names without a subdomain are known as apex or root domains. For example, the domain `www.example.com` is the `www` subdomain joined with the `example.com` apex domain.

This guide demonstrates how to use `TXT` and `ALIAS` records to configure your apex domain in Azure DNS.

The following procedure requires you to copy settings from an Azure DNS zone you create and your existing static web app. Consider opening the Azure portal in two different windows to make it easier to switch between the two services.

## Validate domain ownership

1. Open the [Azure portal](https://portal.azure.com).

1. Go to your static web app.

1. Under *Settings*, select **Custom domains**.

1. Select **+ Add**, and then select **Custom Domain on Azure DNS** from the drop-down menu.

1. Select your apex domain name from the *DNS zone* drop-down.

    If this list is empty, [create a public zone in Azure DNS](../dns/dns-getstarted-portal.md).

1. Select **Add**.

    Wait as the DNS record and custom domain records are added for your static web app. It may take a minute or so to complete.

1. Select **Close**.

Observe the *Status* for the row of your apex domain. While this validation is running, the necessary CNAME or TXT and ALIAS records are created for you automatically. Once the validation is complete, your apex domain is publicly available. 

Open a new browser tab and go to your apex domain. You should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Manage the default domain](custom-domain-default.md)
