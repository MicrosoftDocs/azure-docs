---
title: Migrate Azure CDN from Edgio to Azure Front Door
titleSuffix: Azure Content Delivery Network
description: Learn how to migrate your workloads from Azure CDN from Edgio to Azure Front Door using Azure Traffic Manager.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 12/18/2024
ms.author: duau
---

# Migrate Azure CDN from Edgio to Azure Front Door

Azure CDN from Edgio will be retired on January 15, 2025. You must migrate your workload to Azure Front Door before this date to avoid service disruption. This article provides guidance on how to migrate your workloads from Azure CDN from Edgio to Azure Front Door using Azure Traffic Manager. The migration process in this article can also be used to migrate workloads from a legacy CDN to Azure Front Door.

Azure Traffic Manager initially routes all traffic to the Azure CDN from Edgio. After you set up Azure Front Door, you can update the Traffic Manager profile to incrementally route traffic to the Azure Front Door. This approach allows you to validate if Azure Front Door is compatible with your workloads before fully migrating.

We recommend that your plan this migration well in advance and test the functionality over the course of a few days to ensure a smooth transition. 

> [!IMPORTANT]
> - If you plan to migrate to Azure Front Door, set the Feature Flag **DoNotForceMigrateEdgioCDNProfiles** before January 7, 2025 using [Set up preview feature](../azure-resource-manager/management/preview-features.md). This will prevent Microsoft from auto-migrating your profiles to Azure Front Door. Auto-migration is on a *best effort* basis and may cause issues with billing, features, availability, and performance. Note you will have until January 14, 2025 to complete your migration to another CDN, but again Microsoft cannot guarantee your services will be available on the Edgio platform before this date.
> - This guide only works if you are already using custom domains on Azure CDN from Edgio. If you don't use custom domains, you won't be able to use traffic manager to gradually shift traffic to  Front Door. You will have to update the clients to directly point to the new Front Door endpoint. Another temporary option will be to migrate to Front Door while [retaining your `<endpointname>.azureedge.net` domain.](../cdn/migrate-cdn-to-front-door-retain-edge-domain.md)


## Prerequisites

- Review the [feature differences](front-door-cdn-comparison.md) between Azure CDN and Azure Front Door to determine if there are any compatibility gaps.
- You need access to a VM connected to the internet that can run Wget on Linux or Invoke-WebRequest on Windows using PowerShell.
- You need access to a monitoring tool such as CatchPoint or ThousandEyes to verify the availability of your URLs before and after the migration. These tools are the most ideal because they can monitor the availability of your URLs from different locations around the world. `webpagetest.org` is another option, but it only provides a limited view of your URLs from a few locations.

> [!NOTE]
> If you have multiple endpoints in your Azure CDN from Edgio profile, you will have to repeat the  migration steps for each endpoint. You will have to create corresponding endpoints in Azure Front Door for facilitating migration.
    
## Migrate your workloads

The followings steps assume you're using an Azure Blob Storage account as your origin. If you're using a different origin, adjust the steps accordingly.

:::image type="content" source="./media/migrate-cdn-to-front-door/cdn-traffic-manager.png" alt-text="Diagram of Azure Traffic Manager distributing traffic between Azure Front Door and Azure CDN from Edgio.":::

### Gather information

1. Collect the following information from your Azure CDN from Edgio profile:

    - Endpoints
    - Origin configurations
    - Custom domains
    - Caching settings
    - Compression settings
    - Web application firewall (WAF) settings
    - Custom rules settings

1. Determine which tier of Azure Front Door is suitable for your workloads. For more information, see [Azure Front Door comparison](../frontdoor/front-door-cdn-comparison.md).

1. Review the origin settings of your Azure CDN from Edgio endpoint.

1. Determine a test URL with your Azure CDN from Edgio endpoint and perform a `wget` or `Invoke-WebRequest` to obtain the HTTP header information. 

1. Enter the URL into the monitoring tool to understand the geographic availability of your URL.

### Set up Azure Front Door

1. From the Azure portal, select **+ Create a resource**, then search for **Front Door**.

1. Select **Front Door and CDN profiles** and then select **Create**.

1. On the *Compare offerings* pages, select **Azure Front Door** and then select **Custom create**.

1. Select **Continue to create a Front Door**.

1. Select the subscription and resource group. Enter a name for the Azure Front Door profile. Then select the tier that best suits your workloads and select the **Endpoint** tab.

1. Select **Add an endpoint**. Enter a name for the endpoint, then select **Add**. The endpoint name will look like `<endpointname>-<hash>.xxx.azurefd.net`.

1. Select **+ Add a route**. Enter a name for the route and note the **Domain** selected. Leave the **Patterns to match** and **Accepted protocols** as the default settings.

    > [!NOTE]
    > A CDN profile can have multiple endpoints, so you may need to create multiple routes.

1. Select **Add a new origin group**. Enter a name for the origin group and select the **+ Add an origin** button. Enter the origin name and select the origin type. This example uses Azure Blob Storage, so select **Storage** as the origin type. Select the hostname of the Azure Blob Storage account and leave the rest of the settings as default. Select **Add**.

    :::image type="content" source="./media/migrate-cdn-to-front-door/add-origin.png" alt-text="Screenshot of adding an Azure Blob Storage as an origin to Azure Front Door.":::

1. Leave the rest of the settings as default and select **Add**.

1. If caching was enabled in your Azure CDN from Edgio endpoint, select **Enable caching** and set the caching rules.

    > [!NOTE]
    > Azure CDN from Edgio *Standard-cache* is equivalent to Azure Front Door *Ignore query string* caching.

1. Select **Enable compression** if you have compression enabled in your Azure CDN from Edgio endpoint. Ensure the origin path matches the path in your Azure CDN from Edgio endpoint. If this isn't set correctly, the origin won't be able to serve the content and will return a 4xx error.

1. Select **Add** to create the route.

1. Select **+ Add a policy** to set up web application firewall (WAF) settings and set up custom rules you determined in the previous steps.

1. Select **Review + create** and then select **Create**.

1. Set up the custom domain for the Azure Front Door profile. For more information, see [Custom domains](standard-premium/how-to-add-custom-domain.md). You may have multiple custom domains in your Azure CDN from Edgio profile. Ensure you add all custom domains to the Azure Front Door profile and associate them with the correct routes.

### Set up Traffic Manager

The steps in this section need to be repeated for each endpoint in your Azure CDN from Edgio profile. It is critical that the health check is set up correctly to ensure that the Traffic Manager profile routes traffic to the Azure CDN or Azure Front Door.

1. From the Azure portal, select **+ Create a resource**, then search for **Traffic Manager profile**.

1. Enter a name for the Traffic Manager profile.

1. Select the routing method **Weighted**.

1. Select the same subscription and resource group as the Azure Front Door profile then select **Create**.

1. Select **Endpoints** from the left-hand menu, and then select **+ Add**.

1. For the **Type**, select **External endpoint**.

1. Enter a name for the endpoint and leave the **Enable Endpoint** checked.

1. Enter the **Fully-qualified domain name (FQDN)** of the Azure CDN from Edgio endpoint. For example, `yourdomain.azureedge.net`.

1. Set the **Weight** to 100.

1. For *Health check*, select **Always serve traffic**. This setting disables the health check and always routes traffic to the endpoint.

    :::image type="content" source="./media/migrate-cdn-to-front-door/cdn-endpoint.png" alt-text="Screenshot of adding the Azure CDN from Edgio as an endpoint in Azure Traffic Manager.":::

1. Add another endpoint for the Azure Front Door endpoint and select **External endpoint**.

1. Enter a name for the endpoint and uncheck the **Enable Endpoint** setting.

1. Enter the **Fully-qualified domain name (FQDN)** of the Azure Front Door endpoint. For example, `your-new-endpoint-name.azurefd.net`.

1. Set the **Weight** to 1.

1. Since the endpoint is disabled, the **Health check** setting isn't relevant.

### Internal testing of Traffic Manager profile

1. Perform a DNS dig to test the Traffic Manager profile: `dig your-profile.trafficmanager.net`. The dig command should always return the CNAME of the Azure CDN from Edgio endpoint: `yourdomain.azureedge.net`.

1. Test the Azure Front Door endpoint by manually adding a DNS entry in your local hosts file pointing to the Azure Front Door endpoint:

    1. Get the IP address of the Azure Front Door endpoint by performing a DNS dig.
    
    1. Add a new line to your hosts file with the IP address followed by a space and then `your-new-endpoint-name.azurefd.net`. For example, `203.0.113.254 your-new-endpoint-name.azurefd.net`.
    
        1. For Windows, the hosts file is located at `C:\Windows\System32\drivers\etc\hosts`.
        
        1. For Linux, the hosts file is located at `/etc/hosts`.
    
    1. Test the functionality of the Azure Front Door endpoint locally and ensure everything is working as expected.
    
    1. Remove the entry from the hosts file when testing is complete.

### Configure Traffic Manager with CNAME

We only recommend this step after you have fully tested the Azure Front Door endpoint and are confident that it is working as expected.

1. Sign into your DNS provider and locate the CNAME record for the Azure CDN from Edgio endpoint.

1. Locate the custom domain you want to migrate to Azure Front Door and set the time-to-live (TTL) to 600 secs (10 minutes).

1. Update the CNAME record to point to the Traffic Manager profile: `your-profile.trafficmanager.net`.

1. In the Azure portal, navigate to the Traffic Manager profile and select **Endpoints**.

1. Enable the Azure Front Door endpoint and select **Always serve traffic** for the health check.

1. Use a tool like dig or nslookup to verify that the DNS change propagated and pointed to the correct Traffic Manager profile.

1. Verify that the Azure CDN from Edgio endpoint is working properly by checking the monitoring tool you set up earlier.

### Gradual traffic shift

The initial traffic distribution starts by routing a small percentage of traffic to the Azure Front Door endpoint. Monitor the performance of the Azure Front Door endpoint and gradually increase the traffic percentage until all traffic is routed to the Azure Front Door endpoint.

1. Start by routing 10% of the traffic to the Azure Front Door endpoint and the rest to the Azure CDN from Edgio endpoint.

1. Monitor the performance of the Azure Front Door endpoint and the Azure CDN from Edgio endpoint using the monitoring tool you set up earlier. Review your internal applications and systems logs to ensure that the Azure Front Door endpoint is working as expected. Look at metrics and logs to observe for 4xx/5xx errors, cache/byte hit ratios, and origin health.

    > [!NOTE]
    > If you don't have access to a third-party tool, you can use [Webpagetest](https://webpagetest.org) to verify the availability of your endpoint from a remote location. However, this tool only provides a limited view of your URLs from a few locations around the world, so you may not see any changes until you have fully shifted traffic to the Azure Front Door endpoint.

1. Gradually increase the traffic percentage to the Azure Front Door endpoint by 10% increments until all traffic is routed to the Azure Front Door endpoint. Ensure that you're testing and monitoring the performance of the Azure Front Door endpoint at each increment.

1. Once you're confident that the Azure Front Door endpoint is working as expected, update the Traffic Manager profile to route all traffic to the Azure Front Door endpoint.

    1. Ensure the Azure Front Door endpoint is enabled, Weight is set to 100, and the health check is set to **Always serve traffic**.

    1. Ensure the Azure CDN from Edgio endpoint is disabled.
  
> [!NOTE]
> If you're currently utilizing `azureedge.net` within your codebase, you'll need to update your code to utilize `<YourNewAFDEndpoint.azurefd.net>. If this is a significant concern for you organization, contact support for further assistance.

### Remove Azure Traffic Manager

1. Sign in to your DNS provider. Change the CNAME record from the Traffic Manager profile to the Azure Front Door endpoint: `<endpointname>-<hash>.xxx.azurefd.net`.

1. Over the next few hours, begin testing using dig, and monitor using the monitoring tool to ensure the DNS is fully propagated correctly around the world.

1. Set the DNS TTL back to the original value (60 minutes).

At this stage you have fully migrated all traffic from Azure CDN from Edgio to Azure Front Door.

## Next steps

Learn about [best practices](best-practices.md) for Azure Front Door.
