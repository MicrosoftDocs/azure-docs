---
title: Set up a custom domain with Azure DNS in Azure Static Web Apps
description: Use Azure DNS to manage your domain name for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/10/2021
ms.author: cshoe
---

# Set up a custom domain with Azure DNS in Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates are automatically created for the auto-generated domain name and any custom domains you may add.

Adding a custom domain is a two step process. First, you [validate domain ownership](#validate), and then you [map the custom domain](#map-domain) to your website.

> [!NOTE]
> This article demonstrates how to set up a custom domain with Azure DNS. If you're using an external DNS provider, refer to [Set up a custom domain with an external DNS provider in Azure Static Web Apps](custom-domain-external.md).

## Working with apex domains

Domain names without a subdomain are known as root, apex, or "naked" domains. For example the domain `www.example.com` is the domain with `www` as the subdomain, while `example.com` is known as the apex domain.

Some domain registrars (like Google and GoDaddy) don't allow you to point the apex domain to an existing URL. If your registrar doesn't allow you to redirect the apex domain, consider the following options:

* Configure your domain with [Azure DNS](custom-domain.md)
* Forwarding the apex domain to the `www` subdomain

## DNS configuration options

As you set up a custom domain name, you need to first validate ownership, and then map the domain to your web application.

There are different types of domain configurations available for a website. Depending on the scenario you're trying to address, you validate and map your domain with different types of DNS records. Refer to the following table to determine which records match your situation.

| Scenario | Domain validation method | Validation record | Mapping record |
|--|--|--|--|
| Add a root, apex, or "naked" domain | `example.com`, `example.co.uk` | [TXT](#validate) | [ALIAS](#map-domain) |
| Add a subdomain | `www.example.com`, `foo.example.com` | [CNAME](#validate) | [CNAME](#map-domain) |
| Transfer a subdomain currently in use | `www.example.com`, `foo.example.com` | [TXT](#validate) | [CNAME](#map-domain) |

## 1 - Prerequisites

* A purchased domain name
* Access to the DNS configuration properties for your domain
* [Azure DNS Zone](/azure/dns/dns-getstarted-portal)

<a id="validate" name="validate"></a>

## 2 - Validate ownership

# [CNAME record](#tab/cname)

CNAME record validation is the recommended way to add a custom domain, however, it only works for subdomains. If you would like to add a root domain (`example.com`), switch to the [TXT record](custom-domain.md?tabs=txt#validate) tab and then [create an ALIAS record](#map-domain).

> [!IMPORTANT]
> If your subdomain is currently associated to a live site, and you aren't ready to transfer it to your static web app, use `TXT` record validation.

#### Enter your subdomain

1. Open your static web app in the [Azure portal](https://portal.azure.com).

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter your subdomain. Make sure that you enter it without any protocols. For example, `www.example.com`.

   :::image type="content" source="media/custom-domain/add-subdomain.png" alt-text="Add domain screen showing the custom subdomain in the input box":::

1. Select the **Next** button to move to the _Validate + configure_ step.

#### Configure CNAME with your domain provider

You'll need to configure a CNAME with your domain provider. Azure DNS is recommended, but these steps will work with any domain provider.

> [!IMPORTANT]
> If Azure DNS does not have the *Reader* permission to the static web app, the step to add an ALIAS record in Azure DNS returns an error. You need to grant permission to the Azure DNS application object to read the endpoint to update DNS.

1. Make sure **CNAME** is selected from the _Hostname record type_ dropdown list.

1. Copy the value in the _Value_ field to your clipboard by selecting the **copy** icon.

   :::image type="content" source="media/custom-domain/copy-cname.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

1. In a separate browser tab or window, open your Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **CNAME** record set with the following values.

   | Setting          | Value                                     |
   | ---------------- | ----------------------------------------- |
   | Name             | Your subdomain, such as `www`             |
   | Type             | CNAME                                     |
   | Alias Record Set | No                                        |
   | TTL              | Leave as default value                    |
   | TTL Unit         | Leave as default value                    |
   | Alias            | Paste the domain name from your clipboard |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-cname.png" alt-text="Azure DNS record set screen with name, type and alias fields highlighted":::

[!INCLUDE [validate CNAME](../../includes/static-web-apps-validate-cname.md)]

# [TXT record](#tab/txt)

Azure uses a TXT record to validate that you own a domain. This is useful when you want to do one of the following...

1. You want to configure a root domain (i.e. `example.com`). Validating that you own the domain is required before you can create an ALIAS record that configures the root domain.

1. You want to transfer a subdomain without downtime. The TXT record validation method allows you to validate that you own the domain, and for static web apps to go through the process of issuing you a certificate for that domain. You can then switch your domain to point to your static web app at any time with a CNAME record.

#### Enter your domain

1. Open your static web app in the [Azure portal](https://portal.azure.com).

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter either your root domain (i.e. `example.com`) or your subdomain (i.e. `www.example.com`).

   :::image type="content" source="media/custom-domain/add-domain.png" alt-text="Add domain screen showing the custom domain in the input box":::

1. Click on the **Next** button to move to the _Validate + configure_ step.

#### Configure TXT record with your domain provider

You'll need to configure a TXT record with your domain provider. Azure DNS is recommended, but these steps will work with any domain provider.

1. Ensure that the "Hostname record type" dropdown is set to "TXT".

1. Select the **Generate code** button.

   :::image type="content" source="media/custom-domain/generate-code.png" alt-text="Add custom screen with generate code button highlighted":::

   This action generates a unique code, which may take up to a minute to process.

1. Select the clipboard icon next to the code to copy the value to your clipboard.

   :::image type="content" source="media/custom-domain/copy-code.png" alt-text="Add custom domain screen with copy code button highlighted":::

1. In a separate browser tab or window, open your Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **TXT** record set with the following values.

    | Setting | Value |
    |--|--|
    | Name | `@` for root domain, or enter `_dnsauth.<YOUR_SUBDOMAIN>` for subdomain |
    | Type | TXT |
    | TTL | Leave as default value |
    | TTL Unit | Leave as default value |
    | Value | Paste the code from your clipboard |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-txt.png" alt-text="Azure DNS record set screen with name, type and value fields highlighted":::

[!INCLUDE [validate TXT record](../../includes/static-web-apps-validate-txt.md)]

---

<a id="map-domain" name="map-domain"></a>

## 3 - Map the domain to your website

To map your custom domain to your static web app, you need to create an ALIAS record. An ALIAS record maps one domain to another. It is used specifically for root domains (for example, `example.com`). In this section, you create an ALIAS record that maps your root domain to the auto-generated URL of your static web app.

> [!IMPORTANT]
> Your Azure DNS Zone should be in the same subscription as your static web app.

1. Open your domain's Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **A** record set with the following values.

   | Setting          | Value                              |
   | ---------------- | ---------------------------------- |
   | Name             | @                                  |
   | Type             | A - Alias record to IPv4 Address   |
   | Alias Record Set | Yes                                |
   | Alias type       | Azure resource                     |
   | Subscription     | Enter your subscription name       |
   | Azure resource   | Enter your static web app's name   |
   | TTL              | Leave as default value             |
   | TTL Unit         | Leave as default value             |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-alias.png" alt-text="Azure DNS record set screen with name, type, alias and resource fields highlighted":::

Now that the root domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide.

## Next steps

> [!div class="nextstepaction"]
> [Manage the default domain](custom-domain-default.md)


Use the following links for instructions on how to set up you domain based on your provider.

* [Use Azure DNS](custom-domain.md)
* [Use an external DNS provider](custom-domain-external.md)
