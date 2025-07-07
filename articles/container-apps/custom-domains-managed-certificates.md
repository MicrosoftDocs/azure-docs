---
title: Custom domain names and free managed certificates in Azure Container Apps
description: Learn to configure custom domain names and managed certificates in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: build-2023, devx-track-azurecli, ignite-2024
ms.topic: how-to
ms.date: 01/14/2025
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Custom domain names and free managed certificates in Azure Container Apps

Azure Container Apps allows you to bind one or more custom domains to a container app. You can automatically configure a free managed certificate for your custom domain.

If you want to set up a custom domain using your own certificate, see [Custom domain names and certificates in Azure Container Apps](custom-domains-certificates.md).

> [!NOTE]
> If you configure a [custom environment DNS suffix](environment-custom-dns-suffix.md), you can't add a custom domain that contains this suffix to your Container App.

## Free certificate requirements

Azure Container Apps provides a free managed certificate for your custom domain. Without any action required from you, this TLS/SSL server certificate is automatically renewed as long as your app continues to meet the requirements for managed certificates.

The requirements are:

- Enable HTTP ingress and ensure your container app is publicly accessible.

- Must have an A record for apex domains that points to your Container Apps environment's IP address.

- Establish a CNAME record for subdomains that maps directly to the container app's generated domain name. Mapping to an intermediate CNAME value blocks certificate issuance and renewal. Examples of CNAME values are traffic managers, Cloudflare, and similar services.

> [!NOTE]
> To ensure the certificate issuance and subsequent renewals proceed successfully, all requirements must be met at all times when the managed certificate is assigned.

## Add a custom domain and managed certificate

::: zone pivot="azure-portal"

1. Navigate to your container app in the [Azure portal](https://portal.azure.com)

1. Verify that your app has HTTP ingress enabled by selecting **Ingress** in the *Settings* section. If ingress isn't enabled, enable it with these steps:

   1. Set *HTTP Ingress* to **Enabled**.
   1. Select the desired *Ingress traffic* setting.
   1. Enter the *Target port*.
   1. Select **Save**.
 
1. Under the *Settings* section, select **Custom domains**.

1. Select **Add custom domain**.

1. In the *Add custom domain and certificate* window, in *TLS/SSL certificate*, select **Managed certificate**.

1. In *domain*, enter the domain you want to add.

1. Select the *Hostname record type* based on the type of your domain.

    | Domain type | Record type | Notes |
    |--|--|--|
    | Apex domain | A record | An apex domain is a domain at the root level of your domain. For example, if your DNS zone is `contoso.com`, then `contoso.com` is the apex domain. |
    | Subdomain | CNAME | A subdomain is a domain that is part of another domain. For example, if your DNS zone is `contoso.com`, then `www.contoso.com` is an example of a subdomain that can be configured in the zone. |

1. Using the DNS provider that is hosting your domain, create DNS records based on the *Hostname record type* you selected using the values shown in the *Domain validation* section. The records point the domain to your container app and verify that you're the owner. 

    - If you selected *A record*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | A | `@` | The IP address of your Container Apps environment. |
        | TXT | `asuid` | The domain verification code. |

    - If you selected *CNAME*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | CNAME | The subdomain (for example, `www`) | The generated domain of your container app. |
        | TXT | `asuid.` followed by the subdomain (for example, `asuid.www`) | The domain verification code. |
    
1. Select **Validate**.

1. Once validation succeeds, select **Add**.

    It might take several minutes to issue the certificate and add the domain to your container app.


1. Once the operation is complete, you see your domain name in the list of custom domains with a status of *Secured*. Navigate to your domain to verify that it's accessible.

::: zone-end

::: zone pivot="azure-cli"

Container Apps supports apex domains and subdomains. Each domain type requires a different DNS record type and validation method.

| Domain type | Record type | Validation method | Notes |
|--|--|--|--|
| Apex domain | A record | HTTP | An apex domain is a domain at the root level of your domain. For example, if your DNS zone is `contoso.com`, then `contoso.com` is the apex domain. |
| Subdomain | CNAME | CNAME | A subdomain is a domain that is part of another domain. For example, if your DNS zone is `contoso.com`, then `www.contoso.com` is an example of a subdomain that can be configured in the zone. |

1. Log in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Next, install the Azure Container Apps extension for the CLI.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Set the following environment variables. Replace the `<PLACEHOLDERS>` with your values.

    ```azurecli
    RESOURCE_GROUP = "<RESOURCE_GROUP>"
    CONTAINER_APP = "<CONTAINER_APP>"
    ENVIRONMENT = "<ENVIRONMENT>"
    TARGET_PORT = "<TARGET_PORT>"
    DOMAIN_NAME = "<DOMAIN_NAME>"
    CERTIFICATE_LOWERCASE_NAME = "<CERTIFICATE_LOWERCASE_NAME>"
    CERTIFICATE_LOCAL_PATH = "<CERTIFICATE_LOCAL_PATH>"
    CERTIFICATE_PASSWORD = "<CERTIFICATE_PASSWORD>"
    ```

    - Replace `<CERTIFICATE_LOCAL_PATH>` with the local path of your certificate file.
    - Replace `<CERTIFICATE_LOWERCASE_NAME>` with a lowercase certificate name that is unique within the environment.
    - Replace `<TARGET_PORT>` with the port that your container app is listening on.

1. Verify that your container app has HTTP ingress enabled.

    ```azurecli
    az containerapp ingress show \
        -n $CONTAINER_APP \
        -g $RESOURCE_GROUP
    ```

    If ingress isn't enabled, enable it with these steps:

    ```azurecli
    az containerapp ingress enable \
        -n $CONTAINER_APP \
        -g $RESOURCE_GROUP \
        --type external \
        --target-port $TARGET_PORT \
        --transport auto
    ```

1. If you're configuring an apex domain, get the IP address of your Container Apps environment.

    ```azurecli
    az containerapp env show \
        -n $ENVIRONMENT \
        -g $RESOURCE_GROUP \
        -o tsv \
        --query "properties.staticIp"
    ```

1. If you're configuring a subdomain, get the automatically generated domain of your container app.

    ```azurecli
    az containerapp show \
        -n $CONTAINER_APP \
        -g $RESOURCE_GROUP \
        -o tsv \
        --query "properties.configuration.ingress.fqdn"
    ```

1. Get the domain verification code.

    ```azurecli
    az containerapp show \
        -n $CONTAINER_APP \
        -g $RESOURCE_GROUP \
        -o tsv \
        --query "properties.customDomainVerificationId"
    ```

1. Using the DNS provider that is hosting your domain, create DNS records based on the record type you selected using the values shown in the *Domain validation* section. The records point the domain to your container app and verify that you own it. The setup depends on whether you're using custom domains with the private endpoint (preview) feature:

    # [General](#tab/general)
    
    - If you selected *A record*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | A | `@` | The IP address of your Container Apps environment. |
        | TXT | `asuid` | The domain verification code. |

    - If you selected *CNAME*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | CNAME | The subdomain (for example, `www`) | The generated domain of your container app. |
        | TXT | `asuid.` followed by the subdomain (for example, `asuid.www`) | The domain verification code. |

    # [Private endpoint](#tab/private-endpoint)

    When using a private endpoint for your incoming traffic, you need to [create a private DNS zone](how-to-use-private-endpoint.md#configure-the-private-dns-zone).

    - If you selected *A record*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | A | `@` | The Private IP of your private endpoint on your container apps environment. |
        | TXT | `asuid` | The domain verification code. |

    - If you selected *CNAME*, create the following DNS records:

        | Record type | Host | Value |
        |--|--|--|
        | CNAME | The subdomain (for example, `www`) | The generated domain of your container app. |
        | TXT | `asuid.` followed by the subdomain (for example, `asuid.www`) | The domain verification code. |

    ---

1. Add the domain to your container app.

    ```azurecli
    az containerapp hostname add \
        --hostname $DOMAIN_NAME \
        -g $RESOURCE_GROUP \
        -n $CONTAINER_APP
    ```

1. Configure the managed certificate and bind the domain to your container app.

    ```azurecli
    az containerapp hostname bind \
        --hostname $DOMAIN_NAME \
        -g $RESOURCE_GROUP \
        -n $CONTAINER_APP \
        --environment $ENVIRONMENT \
        --validation-method <VALIDATION_METHOD>
    ```

    - If you're configuring an *A record*, replace `<VALIDATION_METHOD>` with `HTTP`.

    - If you're configuring a *CNAME*, replace `<VALIDATION_METHOD>` with `CNAME`.

    It might take several minutes to issue the certificate and add the domain to your container app.

1. Once the operation is complete, navigate to your domain to verify that it's accessible.

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Authentication in Azure Container Apps](authentication.md)
