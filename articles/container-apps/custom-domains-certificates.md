---
title: Custom domain names and certificates in Azure Container Apps
description: Learn to manage custom domain names and certificates in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: build-2023
ms.topic: how-to
ms.date: 06/07/2022
ms.author: cshoe
---

# Custom domain names and bring your own certificates in Azure Container Apps

Azure Container Apps allows you to bind one or more custom domains to a container app.

- Every domain name must be associated with a TLS/SSL certificate. You can upload your own certificate or use a [free managed certificate](custom-domains-managed-certificates.md).
- Certificates are applied to the container app environment and are bound to individual container apps. You must have role-based access to the environment to add certificates.
- [SNI domain certificates](https://wikipedia.org/wiki/Server_Name_Indication) are required.
- Ingress must be enabled for the container app.

> [!NOTE]
> If you configure a [custom environment DNS suffix](environment-custom-dns-suffix.md), you cannot add a custom domain that contains this suffix to your Container App.

## Add a custom domain and certificate

> [!IMPORTANT]
> If you are using a new certificate, you must have an existing [SNI domain certificate](https://wikipedia.org/wiki/Server_Name_Indication) file available to upload to Azure.  

1. Navigate to your container app in the [Azure portal](https://portal.azure.com)

1. Verify that your app has ingress enabled by selecting **Ingress** in the *Settings* section.  If ingress is not enabled, enable it with these steps:

   1. Set *HTTP Ingress* to **Enabled**.
   1. Select the desired *Ingress traffic* setting.
   1. Enter the *Target port*.
   1. Select **Save**.

1. Under the *Settings* section, select **Custom domains**.

1. Select the **Add custom domain** button.

1. In the *Add custom domain and certificate* window, in *TLS/SSL certificate*, select **Bring your own certificate**.

1. In *domain*, enter the domain you want to add.

1. Select **Add a certificate**.

1. In the *Add certificate* window, in *Certificate name*, enter a name for this certificate.

1. In *Certificate file* section, browse for the certificate file you want to upload.

1. Select **Validate**.

1. Once validation succeeds, select **Add**.

1. In the *Add custom domain and certificate* window, in *Certificate*, select the certificate you just added.

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
        | TXT | `asuid` | The domain verification code |

    - If you selected *CNAME*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | CNAME | The subdomain (for example, `www`) | The automatically generated domain of your container app |
        | TXT | `asuid.` followed by the subdomain (for example, `asuid.www`) | The domain verification code |

1. Select the **Validate** button.

1. Once validation succeeds, select the **Add** button.

1. Once the operation is complete, you see your domain name in the list of custom domains with a status of *Secured*. Navigate to your domain to verify that it's accessible.

> [!NOTE]
> For container apps in internal Container Apps environments, [additional configuration](./networking.md#dns) is required to use custom domains with VNET-scope ingress.

## Managing certificates

You can manage certificates via the Container Apps environment or through an individual container app.

### Environment

The *Certificates* window of the Container Apps environment presents a table of all the certificates associated with the environment.

You can manage your certificates through the following actions:

| Action | Description |
|--|--|
| Add | Select the **Add certificate** link to add a new certificate. |
| Delete | Select the trash can icon to remove a certificate.  |
| Renew | The *Health status* field of the table indicates that a certificate is expiring soon within 60 days of the expiration date. To renew a certificate, select the **Renew certificate** link to upload a new certificate. |

### Container app

The *Custom domains* window of the container app presents a list of custom domains associated with the container app.

You can manage your certificates for an individual domain name by selecting the ellipsis (**...**) button, which opens the certificate binding window. From the following window, you can select a certificate to bind to the selected domain name.

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
