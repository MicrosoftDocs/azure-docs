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

1. Navigate to your static web app.

1. Under *Settings*, select **Custom domains**.

1. Select the **+ Add** button, and select **Custom Domain on Azure DNS** from the drop down.

1. In the *Enter domain* tab, enter your apex domain name.

    For instance, if your domain name is `example.com`, enter `example.com` into this box (without any subdomains).

1. Select the **Next** button.

1. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step. |
    | Hostname record type | Select **TXT**. |

1. Select the **Generate code** button.

    Wait as the code is generated. It make take a minute or so to complete.

1. Once the `TXT` record value is generated, select the **copy button** (next to the generated value) to copy the code to the clipboard.

1. Select the **Close** button.

1. Navigate to your Azure DNS zone instance.

1. Select the **+ Record set** button.

1. Enter the following values in the *Add record set* window.

    | Setting | Property |
    |---|---|
    | Name | Enter **@** |
    | Type | Select **TXT - Text record type**. |
    | TTL | Keep default value. |
    | TTL unit | Keep default value. |
    | Value | Paste in the `TXT` record value in your clipboard from your static web app. |

1. Select the **OK** button.

1. Return to your static web app in the Azure portal.

1. Under *Settings*, select **Custom domains**.

Observe the *Status* for the row of your apex domain. Once the validation is complete, then your apex domain will be publicly available.

While this validation is running, create an ALIAS record to finalize the configuration.

## Set up ALIAS record

1. Return to the Azure DNS zone in the Azure portal.

1. Select the **+ Record set button** button.

1. Enter the following values in the *Add record set* window.

    | Setting | Property |
    |---|---|
    | Name | Enter **@** |
    | Type | Select **A - Alias to IPv4 address** |
    | Alias record set | Select **Yes**. |
    | Alias type | Select **Azure resource** |
    | Choose a subscription | Select your Azure subscription. |
    | Azure resource | Select the name of your static web app. |
    | TTL | Keep default value. |
    | TTL unit | Keep default value. |

1. Select the **OK** button.

1. Open a new browser tab and navigate to your apex domain.

    After the DNS records are updated, you should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Manage the default domain](custom-domain-default.md)
