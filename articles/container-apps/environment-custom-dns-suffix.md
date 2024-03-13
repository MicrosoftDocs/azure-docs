---
title: Custom environment DNS suffix in Azure Container Apps (Preview)
description: Learn to manage custom DNS suffix and TLS certificate in Azure Container Apps environments
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 10/13/2022
ms.author: cshoe
---

# Custom environment DNS Suffix in Azure Container Apps (Preview)

By default, an Azure Container Apps environment provides a DNS suffix in the format `<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`. Each container app in the environment generates a domain name based on this DNS suffix. You can configure a custom DNS suffix for your environment.

> [!NOTE]
> 
> To configure a custom domain for individual container apps, see [Custom domain names and certificates in Azure Container Apps](custom-domains-certificates.md).
>
> If you configure a custom DNS suffix for your environment, traffic to FQDNs that use this suffix will resolve to the environment. FQDNs that use this suffix outside the environment will be unreachable from the environment.

## Add a custom DNS suffix and certificate

1. Go to your Container Apps environment in the [Azure portal](https://portal.azure.com)

1. Under the *Settings* section, select **Custom DNS suffix**.

1. In **DNS suffix**, enter the custom DNS suffix for the environment.

    For example, if you enter `example.com`, the container app domain names will be in the format `<APP_NAME>.example.com`.

1. In a new browser window, go to your domain provider's website and add the DNS records shown in the *Domain validation* section to your domain.

    | Record type | Host | Value | Description |
    | -- | -- | -- | -- |
    | A | `*.<DNS_SUFFIX>` | Environment inbound IP address | Wildcard record configured to the IP address of the environment. |
    | TXT | `asuid.<DNS_SUFFIX>` | Validation token | TXT record with the value of the validation token (not required for Container Apps environment with internal load balancer). |

1. Back in the *Custom DNS suffix* window, in **Certificate file**, browse and select a certificate for the TLS binding.

    > [!IMPORTANT]
    > You must use an existing wildcard certificate that's valid for the custom DNS suffix you provided.

1. In **Certificate password**, enter the password for the certificate.

1. Select **Save**.

Once the save operation is complete, the environment is updated with the custom DNS suffix and TLS certificate.

## Next steps

> [!div class="nextstepaction"]
> [Custom domains in Azure Container Apps](custom-domains-certificates.md)
