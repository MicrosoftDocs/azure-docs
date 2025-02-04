---
title: Migrate to Front Door while retaining *.azureedge.net domain
titleSuffix: Azure Content Delivery Network
description: Learn how to migrate your workloads from Azure CDN from Edgio to Azure Front Door while retaining *.azureedge.net domain.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 12/20/2024
ms.author: duau
---

# Migrate to Azure Front Door while retaining *.azureedge.net domain

> [!IMPORTANT]
> This is a temporary measure due to the sudden and imminent retirement of Azure CDN from Edgio. Relying on domains like `*.azureedge.net` and `*.azurefd.net` isn't recommended as it poses availability risks. To ensure greater flexibility and avoid a single point of failure, adopt a custom domain as soon as possible.

This article provides you with instructions for migrating to Azure Front Door from Azure CDN from Edgio while retaining the `*.azureedge.net` domain.

## Prerequisites

- Review the [feature differences](../frontdoor/front-door-cdn-comparison.md) between Azure CDN and Azure Front Door to identify any compatibility gaps.
- Ensure you have access to a VM connected to the internet that can run Wget on Linux or `Invoke-WebRequest` on Windows using PowerShell.
- Use a monitoring tool such as CatchPoint or ThousandEyes to verify the availability of your URLs before and after the migration. These tools are ideal because they can monitor the availability of your URLs from different global locations. Alternatively, you can use webpagetest.org, but it provides a limited view from a few locations.
- Migration is supported only to Azure Front Door Standard and Premium SKUs.
- Bring Your Own Certificate (BYOC) isn't supported for these domains.
- Only the `.azureedge.net` domain is supported.
- The `*.vo.msecnd.net` domain isn't supported.

    > [!NOTE]
    > - The following steps assume you're using an Azure Blob Storage account as your origin. If you're using a different origin, adjust the steps accordingly.
    > - If you are already using custom domains on Edgio, follow the steps in [Migrate Azure CDN from Edgio to Azure Front Door](../frontdoor/migrate-cdn-to-front-door.md).

    > [!IMPORTANT]
    > If you plan to migrate to Azure Front Door, set the Feature Flag **DoNotForceMigrateEdgioCDNProfiles** before January 7, 2025 using [Set up preview feature](../azure-resource-manager/management/preview-features.md). This will prevent Microsoft from auto-migrating your profiles to Azure Front Door. Auto-migration is on a *best effort* basis and may cause issues with billing, features, availability, and performance. Note you will have until January 14, 2025 to complete your migration to another CDN, but again Microsoft cannot guarantee your services will be available on the Edgio platform before this date.

## Gather information

1. Collect the following information from your Azure CDN from Edgio profile:
        - Endpoints
        - Origin configurations
        - Custom domains
        - Caching settings
        - Compression settings
        - Web application firewall (WAF) settings
        - Custom rules settings

1. Determine which tier of Azure Front Door is suitable for your workloads. For more information, see [Azure Front Door comparison](../frontdoor/front-door-cdn-comparison.md).

1. Review the origin settings in your Azure CDN from Edgio profile.

1. Determine a test URL with your Azure CDN from Edgio profile and perform a `wget` or `Invoke-WebRequest` to obtain the HTTP header information.

1. Enter the URL into the monitoring tool to understand the geographic availability of your URL.

## Set up Azure Front Door

1. Go to Front Door and CDN profiles, then select **Create**.

1. On the Compare offerings page, select **Azure Front Door** and then **Custom create**.

1. Select **Continue** to create an Azure Front Door.

1. Choose the subscription and resource group. Enter a name for the Azure Front Door profile. Select the tier that best suits your workloads and select the **Endpoint** tab.

1. Select **Add an endpoint**. Enter a name for the endpoint, then select **Add**. Note down the endpoint hostname, which looks like `<endpointname>-<hash>.xxx.azurefd.net`.

1. Select **+ Add a route**. Enter a name for the route.

1. Select **Add a new domain**. Use the following settings and select **Add**:

    | Field               | Value                          |
    |---------------------|--------------------------------|
    | Domain type         | Non-Azure validated domain     |
    | DNS management      | All other DNS services         |
    | Custom domain       | `<existing_endpoint_name>.azureedge.net` |
    | Certificate type    | AFD managed                    |
    | Minimum TLS version | TLS 1.2                        |

1. In the **Add a route** page, leave the **Patterns to match** and **Accepted protocols** as default.

    > [!NOTE]
    > A CDN profile can have multiple endpoints, so you may need to create multiple routes.

1. Select **Add a new origin group**. Enter a name for the origin group and select **+ Add an origin**. Enter the origin name and select the origin type. For Azure Blob Storage, select **Storage** as the origin type. Choose the hostname of the Azure Blob Storage account and leave the rest of the settings as default. Select **Add**.

1. Leave the rest of the settings as default and select **Add**.

1. If caching was enabled in your Azure CDN from Edgio profile, select **Enable caching** and set the caching rules.

    > [!NOTE]
    > Azure CDN from Edgio Standard-cache is equivalent to Azure Front Door Ignore query string caching.

1. Select **Enable compression** if it was enabled in your Azure CDN from Edgio profile. Ensure the origin path matches the path in your Azure CDN from Edgio profile to avoid 4xx errors.

1. Select **Add** to create the route.

1. Select **+ Add a policy** to set up web application firewall (WAF) settings and custom rules as determined in the previous steps.

1. Select **Review + create** and then **Create**.

    > [!NOTE]
    > - You may have multiple custom domains in your Azure CDN from Edgio profile. Ensure you add all custom domains to the Azure Front Door profile and associate them with the correct routes.
    > - Domain validation isn't required for `*.azureedge.net` domains as long as it is a valid Edgio endpoint owned by the same customer in the same Entra ID Tenant.

1. After creating the profile, thoroughly test it by directing traffic to the endpoint hostname. Verify that the endpoint is functioning correctly and serving content as expected.

## DNS changes

1. Create a support request with the following details. If you have already created a support case for the Edgio retirement, there's no need to create a new one.

    - **Issue type**: Technical
    - **Subscription**: Your subscription
    - **Service**: My services, then select Azure CDN
    - **Summary**: "DNS flip of `<existing_endpoint_name>.azureedge.net` to `<new_endpoint_name>.azurefd.net`"
    - **Problem type**: Migrating Microsoft CDN to Front Door Standard or Premium

1. Skip the *Recommended solutions* section.

1. Under **Additional details**, provide the following information:

    - Azure Front Door profile name
    - Resource group of AFD profile
    - Subscription ID of AFD profile
    - AFD endpoint hostname (for example, `contoso.azurefd.net`)
    - Azure CDN from Edgio endpoint hostname (for example, `contoso.azureedge.net`)

1. The Azure support team makes the necessary DNS changes within 24-48 hours of filing the ticket. Traffic will now start being served by the Azure Front Door service.
1. If you face any issues and need to rollback the DNS changes, you can reopen the support ticket and request for rollback.

    > [!NOTE]
    > - Most of the traffic will immediately switch to Azure Front Door. You may see a small portion of the traffic still served by Edgio. The DNS changes takes time to propagate and some DNS servers have high TTL for DNS record expiry. Wait for 24-48 hours for all the traffic to switch.
    > - After the changes, under AFD Domains blade, the 'Certificate state' field may show the value as 'issuing' and the 'DNS state' field may show the value as 'Certificate needed'. This is just a portal bug that will be fixed by January 31st. The bug doesn't impact your certificates or traffic in any manner as the Certificate and DNS State for *.azureedge.net domains are completely managed by AFD.
   

## Next step

Learn about [best practices](../frontdoor/best-practices.md) for Azure Front Door.
