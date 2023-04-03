---
title: Custom domain names and free managed certificates in Azure Container Apps
description: Learn to configure custom domain names and managed certificates in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 04/02/2023
ms.author: cshoe
---

# Custom domain names and managed certificates in Azure Container Apps

Azure Container Apps allows you to bind one or more custom domains to a container app. You can automatically configure a free managed certificate for your custom domain.

If you want to set up a custom domain using your own certificate, see [Custom domain names and certificates in Azure Container Apps](custom-domains-certificates.md).

> [!NOTE]
> To configure a custom DNS suffix for all container apps in an environment, see [Custom environment DNS suffix in Azure Container Apps](environment-custom-dns-suffix.md). If you configure a custom environment DNS suffix, you cannot add a custom domain that contains this suffix to your Container App.

## Free certificate requirements

Azure Container Apps provides a free managed certificate for your custom domain. Without any action required from you, this TLS/SSL server certificate is automatically renewed as long as your app continues to meet the requirements for managed certificates.

For successful issuance and subsequent automatic renewal of managed certificates, the following requirements must be met:

- Your container app has HTTP ingress enabled and is publicly accessible.
- For apex domains, you must have an A record pointing to your Container Apps environment's IP address.
- For subdomains, you must have a CNAME record mapped directly to the container app's automatically generated domain name. Mapping to an intermediate CNAME value blocks certificate issuance and renewal.

## Add a custom domain and managed certificate

1. Navigate to your container app in the [Azure portal](https://portal.azure.com)

1. Verify that your app has HTTP ingress enabled by selecting **Ingress** in the *Settings* section.  If ingress is not enabled, enable it with these steps:

   1. Set *HTTP Ingress* to **Enabled**.
   1. Select the desired *Ingress traffic* setting.
   1. Enter the *Target port*.
   1. Select **Save**.
 
1. Under the *Settings* section, select **Custom domains**.

1. Select the **Add custom domain** button.

1. In the *Add custom domain* window, in *TLS/SSL certificate*, select **Managed certificate**.

1. In *domain*, enter the domain you want to add.

1. Select the *Hostname record type* based on the type of your domain.

    | Domain type | Record type | Notes |
    |--|--|--|
    | Apex domain | A record | An apex domain is a domain at the root level of your domain. For example, if your DNS zone is `contoso.com`, then `contoso.com` is the apex domain. |
    | Subdomain | CNAME | A subdomain is a domain that is part of another domain. For example, if your DNS zone is `contoso.com`, then `www.contoso.com` is an example of a subdomain that can be configured in the zone. |

1. Using the DNS provider that is hosting your domain, create DNS records based on the *Hostname record type* you selected using the values shown in the *Domain validation* section. The records point the domain to your container app and verify that you own it.

    - If you selected *A record*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | A | `@` | The IP address of your Container Apps environment |
        | TXT | `asuid` | The domain validation code |

    - If you selected *CNAME*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | CNAME | The subdomain (for example, `www`) | The automatically generated domain of your container app |
        | TXT | `asuid.` followed by the subdomain (for example, `asuid.www`) | The domain validation code |

1. Select the **Validate** button.

1. Once validation succeeds, select the **Add** button.

    It may take several minutes for the certificate to be issued and the domain to be added to your container app.

1. Once the add operation is complete, you see your domain name in the list of custom domains with a status of *Secured*. Navigate to your domain to verify that it is accessible.

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
