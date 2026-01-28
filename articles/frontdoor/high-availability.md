---
title: High Availability Implementation Guide
titleSuffix: Azure Front Door
description: Learn how to implement manual failover for Azure Front Door using Azure Traffic Manager, ensuring high availability during rare service interruptions.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 01/28/2026

#customer intent: As a cloud architect, I want to implement a manual failover strategy for Azure Front Door using Azure Traffic Manager so that I can ensure high availability during service interruptions.
---

# High availability implementation guide utilizing Azure Front Door and alternate ingress solutions

Azure Front Door is designed to provide exceptional resiliency and availability for both external customers and Microsoft's internal properties. While Front Door's architecture meets or exceeds the needs of most production workloads, it's important to acknowledge that no distributed system is immune to failure.

This article provides high‑level, step‑by‑step instructions for implementing Azure Traffic Manager to enable manual failover from Front Door to either an alternate CDN or Application Gateway WAF during rare Front Door service interruptions. It supplements the guidance in [Global routing redundancy for mission-critical web applications](/azure/architecture/guide/networking/global-web-applications/overview).

Multiple strategies exist within the industry for achieving high availability (HA) in CDN and web application architectures. The approach outlined in this article focuses on a straightforward, manual **“break‑glass” failover pattern** that allows customers to quickly redirect traffic during an outage and seamlessly restore routing back to Front Door once service health is confirmed.

The article also includes guidance for implementing HA patterns in production environments, establishing health monitoring, and creating operational runbooks to support ongoing readiness.

## Key operational differences

This guide presents two proven architectures using Azure Traffic Manager to provide automated failover. The following table summarizes key operational differences to consider:

| Aspect | Scenario 1 (Front Door + Application Gateway) | Scenario 2 (Front Door + Other CDN) |
| ---- | ---- | ---- |
| Failover target | Secondary Traffic Manager → Multiple Application Gateway instances | Single other CDN endpoint |
| Caching during failover | No (Application Gateway doesn't cache) | Yes |
| Geographic distribution | Specific Azure regions (2 in Scenario 1 of this article) | Other CDN's global edge network |
| WAF protection | Azure WAF (consistent rule sets) | Other CDN's WAF (different rule sets) |
| Cost during standby | Fixed compute costs (Application Gateway charges even when idle: ~\$200-400/month for WAF_v2 with minimal capacity). | Dependent on CDN vendor's pricing. |

## Considerations for production environments

When implementing high availability architectures for production workloads, consider the following best practices and important notes:

- **Don't configure the primary Azure Traffic Manager for automatic failover:** Azure Traffic Manager health probes originate only from US-based Azure regions. Because of this, when probing Front Door endpoints (or any CDN using anycast routing), these US-based probes will almost always reach US POPs, leaving the health of non-US POPs unverified. This prevents Traffic Manager from automatically failing over between Azure Front Door and another ingress service based on the true global health of anycast CDN such as Front Door. As such, for global workloads requiring health validation from multiple geographies, manual failover with weighted routing and monitoring disabled provides more reliable control than automated health-based routing.

- **Certificates:** If you're currently using Front Door-managed certifications, you must migrate to BYO certificates. By using your own certificate, you can keep the TLS certificates consistent regardless of which ingress path the traffic follows. Ensure that your TLS certificates are compatible with Azure Front Door. For more information, see [Configure HTTPS on an Azure Front Door custom domain](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain) and [TLS encryption with Azure Front Door](/azure/frontdoor/end-to-end-tls).

- Always test failover procedures ahead of time in non-production environments first.

- **Traffic Manager doesn't support CNAME flattening at the DNS zone apex (root domain):** If you require Traffic Manager at the apex, you must use DNS providers that support alias records or similar mechanisms. [Azure DNS](/azure/dns/dns-alias) is one such DNS provider.

- Use short DNS TTLs (300 - 600 seconds) and monitor DNS TTL propagation times.

- **Security:** Lock down Application Gateway with network security groups (NSGs)/ACLs (allow required platform ranges and inbound application ports) and keep origins secured for all ingress paths. For more information, see [Configure network security groups for your Application Gateway](/azure/application-gateway/configuration-infrastructure#network-security-groups). While Application Gateway WAF mitigates HTTP/L7 attacks, NSGs provide packet filtering only and don't protect against volumetric or protocol level (L3/L4) DDoS attacks. All Azure public endpoints benefit from baseline, always on Azure platform DDoS protection, which is designed to protect the Azure infrastructure but doesn't include workload specific tuning, telemetry, cost protection, or availability guarantees. For production and mission critical workloads, consider Azure DDoS Network Protection to protect Application Gateway public IPs. For more information, see [Azure DDoS Protection pricing](https://azure.microsoft.com/pricing/details/ddos-protection/#:~:text=When%20Azure%20Application%20Gateway%20with%20WAF%20is%20deployed%20in%20a%20protected%20virtual%20network%2C%20there%20are%20no%20additional%20charges%20for%20WAF%20-%20you%20pay%20for%20the%20Application%20Gateway%20at%20the%20lower%20non-WAF%20rate) for more details.

- Document WAF rule differences between Front Door and failover solutions.

- **Origin security consideration:** Private Link isn't recommended for these HA architectures because alternate CDN platforms can't access origins protected by Azure Front Door's Private Link integration. Additionally, Application Gateway requires extra virtual network and Private Endpoint configuration to reach private origins and can't use Front Door's native Private Link capabilities. For production environments utilizing Azure Front Door alongside other CDN providers, consider using alternative, CDN‑agnostic origin‑security controls such as token‑based origin authentication (HMAC or signed URLs), mutual TLS (mTLS), custom origin headers, and IP address filtering to enforce origin trust when Private Link or `X‑Azure‑FDID` validation can't be used.

- **Edit the sample commands listed in this guide so that they are tailored to your environment for automation and runbooks.**

- Establish clear runbooks and test failover and failback procedures.

- Configure comprehensive monitoring and alerting for all endpoints.

- Validate functionality during failover to alternate ingress solutions.

- Test certificate renewal processes across all platforms.

- Regularly validate that failover endpoints remain functional (quarterly testing recommended).

- This guide uses Azure CLI sample commands executed from within PowerShell.

- Before proceeding, review the [Global routing redundancy for mission-critical web applications](/azure/architecture/guide/networking/global-web-applications/overview).

## Scenario 1: Traffic Manager failover: Front Door to Application Gateway WAF

This DNS-based load balancing solution uses multiple Azure Traffic Manager profiles. In the unlikely event of an availability issue with Azure Front Door, Azure Traffic Manager redirects traffic through Application Gateway WAF. The primary Traffic Manager routes between Front Door (primary) and a nested secondary Traffic Manager pointing to multi-region Application Gateway instances. During Front Door outage, traffic is manually failed over to regional Application Gateway deployments with WAF protection.

:::image type="content" source="./media/high-availability/front-door-application-gateway.svg" alt-text="Diagram showing Azure Traffic Manager with weighted routing to Azure Front Door, and a nested Traffic Manager profile using performance routing to send to Application Gateway instances in two regions." border="false" lightbox="./media/high-availability/front-door-application-gateway.svg":::

**Traffic flow (Normal operation):** User → DNS Query → Primary Traffic Manager (Weighted / Always serve routing) → Front Door (Priority 1) → Origin Servers.
  
**Traffic flow (Front Door failure):** User → DNS Query → Primary Traffic Manager (Weighted / Always serve routing) → Secondary Traffic Manager (Priority mode) → Application Gateway(s) → Origin Servers.

### Pre-deployment: Front Door vs Application Gateway

It's important to understand the feature differences between Front Door and Application Gateway WAF in case you're utilizing any features Application Gateway WAF doesn't offer. The following two tables provide an overview.

> [!IMPORTANT]
> This solution assumes you're currently using Azure Front Door to serve traffic across multiple regions or globally. In this design, the steps below introduce a **secondary Azure Traffic Manager configured with Performance routing between the primary Traffic Manager and regional Application Gateway instances**. This approach is necessary because Azure Front Door is a global Layer‑7 service, so the secondary Traffic Manager effectively replaces Front Door's global latency‑based routing by acting as the global load‑balancing layer. As a result, **Traffic Manager preserves latency‑optimized user routing for a geographically distributed audience**. Given this architectural shift, **you must evaluate global traffic patterns and deploy Application Gateway instances in regions that have meaningful user volume to ensure optimal performance and resilience**.

#### Features differences

| Feature | Azure Front Door | Application Gateway |
| --- | --- | --- |
| **Core architecture and features** | | |
| Service scope | Global service | Regional service |
| OSI layer | Layer 7 (application layer) | Layer 7 (application layer) |
| Load balancing level | Across regions | Within region/virtual network |
| Deployment model | Single global instance | Per-region instances |
| Backend scope | Any public endpoint (Azure or external), and selected Private Link endpoints | Any public endpoint (Azure or external), private IP addresses, and Kubernetes pods in virtual network |
| Content edge caching | Yes | No |
| Network architecture | Microsoft's global edge network with anycast | Azure regional deployment (no anycast) |
| **Configuration differences** | | |
| Path pattern syntax | `/path/*` or exact `/path` | Regex patterns, path maps |
| WAF rule sets | Default ruleset (OWASP), bot manager ruleset, HTTP DDoS ruleset | Default ruleset (OWASP), bot manager ruleset, HTTP DDoS ruleset |
| Health probe evaluation | Latency + health for routing | Health status only |
| Backend selection | Based on priority, weight, latency | Round-robin, cookie affinity |
| **Routing rules** | | |
| Path-based routing | ✓ Yes | ✓ Yes |
| Pattern matching | Exact match paths, wildcard paths (/*), case-insensitive, wildcard must be preceded by / | URL path maps, path-based rules, regex patterns supported |
| Host-based routing | ✓ Multiple frontend hosts | ✓ Multi-site hosting |
| URL rewrite | Static path to static path (Classic) | URL path rewrite |
| Routing methods | Priority, weight, latency-based | Load aware for latency optimization*, weighted*, session affinity (*available with Application Gateway for Containers) |
| **Routing features** | | |
| Rules engine/rewrite rules | Rule sets with conditions and actions | Rewrite rule sets with conditions and actions |
| Regex in path patterns | Not supported in "Patterns to match" | Supported with PCRE |
| **Header and request manipulation** | | |
| Header rewrite | ✓ Request and response headers | ✓ Request and response headers |
| Header value character limit | No documented limit | 1,000 characters in rewrite rules |
| Host header rewrite | ✓ Supported | ✓ Supported (can't rewrite to external domains) |
| Server variables | ✓ Supported | ✓ Supported |
| Header pattern matching | Conditions with patterns | Regex pattern matching |
| **Security features** | | |
| WAF availability | ✓ Optional (Premium SKU) | ✓ Optional (WAF SKU) |
| L3/4 DDoS protection | ✓ Built-in | Via Azure DDoS Protection service |
| SSL/TLS policies | ✓ Configurable | ✓ Configurable |
| End-to-end SSL | ✓ Supported | ✓ Supported |
| Private Link support | ✓ Premium tier | ✓ V2 SKU |
| WAF custom rules | ✓ Supported | ✓ Supported |

#### WAF differences

| **Azure Front Door** | **Application Gateway** |
|----|----|
| Microsoft_DefaultRuleSet (DRS 2.1) | OWASP Core Rule Set (CRS 3.2 or 4.0) |
| Rule IDs: 949xxx series | Rule IDs: 9xxxxx series |
| Front Door WAF (DRS): inspects first 128 KB of request body | Application Gateway WAF (CRS 3.2+): up to 2 MB inspection; 4 GB file upload; enforcement and inspection can be configured independently |

### Recommendations

- Because you must maintain distinct rule sets for each WAF, use the Front Door rule set as your baseline. Create an Application Gateway rule set that matches the Front Door rule set as closely as possible.
- Test Application Gateway WAF separately and independently.
- Document all custom exclusions for both platforms.
- Regularly audit rule sets for consistency.
- Adhere to the network guidance within [Azure Application Gateway infrastructure configuration](/azure/application-gateway/configuration-infrastructure) specially. Ensure to exercise the following:

    - **Network planning:** The following are virtual network and subnet requirements:

        - **Subnet sizing (per region):**

            - Minimum: /27 (32 addresses)
            
            - Recommended: /24 (256 addresses) for autoscaling and hitless maintenance
            
            - Formula: (max instances \* 10) + 5 Azure reserved IPs
            
            - Example: 20 max instances → (20 \* 10) + 5 = 205 IPs → use /24


        - **Securing Application Gateway:**

            - Dedicated subnet for Application Gateway (no other resources)

        - **Inbound allows:**

            - 443/80 from Internet (or specific source ranges)
            
            - 65200-5535 from GatewayManager (Application Gateway v2)
            
            - AzureLoadBalancer

        - Block other inbound. Don't block required outbound internet

        - Use ASGs for backend segmentation and least-privilege rules

> [!NOTE]
> For capacity planning and autoscaling strategy, see [Architecture best practices for Azure Application Gateway v2](/azure/well-architected/service-guides/azure-application-gateway).

### Key implementation steps

#### Step 1: Provision prerequisites

- Azure Front Door configured with custom domain and BYO Certificate.

- Lower DNS TTL for your CNAME is Front Door serving traffic to the lowest time setting.

- Azure subscription with permissions to create virtual networks, Application Gateway, and Traffic Manager.

- SSL/TLS certificate in Azure Key Vault or available for upload.

- Origin servers accessible from Azure virtual networks.

> [!IMPORTANT]
> If you're currently using Front Door-managed certificates, you must migrate to BYO certificates before implementing this solution. Front Door-managed certificates can't be exported and installed on alternative CDNs. For more information, see [Configure HTTPS on an Azure Front Door custom domain](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain).

#### Step 2: Deploy Application Gateway (Region 1)

1. Create network infrastructure for Application Gateway. For more information, see [Application Gateway infrastructure configuration](/azure/application-gateway/configuration-infrastructure).

1. Create managed identity and grant Key Vault access. For more information, see [TLS termination with Key Vault certificates](/azure/application-gateway/key-vault-certs).

    > [!NOTE]
    > Application Gateway requires the SSL/TLS certificate in PFX format with private key. The certificate must be accessible from Azure Key Vault or uploaded directly. Use the same certificate that Front Door uses to ensure consistent TLS behavior.

1. Create WAF policy. For more information, see [Create Web Application Firewall policies for Application Gateway](/azure/web-application-firewall/ag/create-waf-policy-ag)

1. Create Application Gateway with HTTPS and WAF. For more information, see [Configure an Application Gateway with TLS termination](/azure/application-gateway/create-ssl-portal).

1. Configure backend host header. For more information, see [Troubleshoot backend health issues in Application Gateway](/azure/application-gateway/application-gateway-backend-health-troubleshooting)

1. Verify Application Gateway

    ```
    # Get Application Gateway public IP
    $APPGW_IP = az network public-ip show `
        --name $APPGW_PIP_NAME_R1 `
        --resource-group $RESOURCE_GROUP `
        --query ipAddress -o tsv
    Write-Host "Application Gateway IP: $APPGW_IP"
    
    # Test Application Gateway directly (SkipCertificateCheck because cert is for domain, not IP)
    Invoke-WebRequest -Uri "https://$APPGW_IP/index.html" -Method Head -SkipCertificateCheck
    ```

    **Expected result:** StatusCode 200. If you get 502 Bad Gateway, ensure the backend HTTP settings have `--host-name-from-backend-pool true` enabled.

#### Step 3: Configure WAF policy settings (Optional)

> [!NOTE]
> By default, WAF is created in Detection mode. Prevention mode actively blocks malicious requests. Test thoroughly before enabling Prevention mode in production.

> [!IMPORTANT]
> **Evaluate your global traffic patterns and deploy Application Gateway instances in regions with meaningful user volume.** If deploying multi-region Application Gateway, **repeat Steps 2 and 3 for each additional region (for example, West US 2) using different** virtual network address spaces (10.2.0.0/16, 10.3.0.0/16, etc.) and region-specific variable suffixes (R2, R3, etc.).

#### Step 4: Create Traffic Manager architecture to support the Application Gateway WAF endpoints

1. Create a Secondary "Performance Mode" Traffic Manager as shown in Scenario 1 diagram. For more information, see [Create a Traffic Manager profile](/azure/traffic-manager/traffic-manager-create-profile)

    **Single-Region Configuration:**
    
    - Routing method: Priority
    - Endpoint: Single Application Gateway public IP address
    
    **Multi-Region Configuration:**
    
    - Routing method: Performance (routes users to nearest healthy Application Gateway)
    - Endpoints: Multiple Application Gateway public IP addresses across regions
    - Endpoint Locations: Specify Azure region for each endpoint (required for Performance routing)
    
    **Configuration:**
    
    | Setting | Value | Notes |
    |----|----|----|
    | **Routing method** | Performance (multi-region) or Priority (single-region) | Performance optimizes latency for multi-region |
    | **Protocol** | HTTPS | Validates Application Gateway health via HTTPS |
    | **Port** | 443 | Standard HTTPS port |
    | **Path** | /health or /index.html | Must match Application Gateway backend health probe path |
    | **TTL** | 300 seconds | Balances DNS query load and responsiveness |
    
    **Application Gateway public IP limitation:** By default, Azure public IPs don't have DNS names configured. You must use the public IP address directly in Traffic Manager endpoints, not a DNS name. The `--endpoint-location` parameter is required for Performance routing to enable geographic routing.

1. Create a Primary "Weighted Mode Always Serve" Traffic Manager as shown in Scenario 1 diagram. For more information, see [Create a Traffic Manager profile](/azure/traffic-manager/traffic-manager-create-profile)

    **Configurations for both endpoints:**
    
    | Setting | Value | Notes |
    |----|----|----|
    | **Routing Method** | Weighted | Allows manual control via endpoint status (Enabled/Disabled) |
    | **Weight** | 100 |   |
    | **Protocol** | HTTPS | Required for validating SSL/TLS endpoints |
    | **Port** | 443 | Standard HTTPS port |
    | **Path** | /index.html | Choose a lightweight endpoint for health checks |
    | **TTL** | 300 seconds | DNS TTL - lower values enable faster failover but increase DNS queries |
    | **Health Check** | Always serve traffic | **Don't enable Health checks** |
    
    **Endpoint specific configurations:**
    
    **Primary endpoint:**
    
    - **Name:** endpoint-afd-primary
    
    - **Type:** External endpoint
    
    - **Target:** Front Door endpoint hostname (for example, `myapp-12345.z01.azurefd.net`)
    
    - **End Point Status:** Enabled
    
    - **Custom headers:** `Host=$CUSTOM_DOMAIN` (required for Front Door to route to correct custom domain)

    - **Health checks:** Always serve traffic (disable health checks)

    :::image type="content" source="./media/high-availability/traffic-manager-primary-endpoint.png" alt-text="Screenshot of adding Traffic Manager primary endpoint in the Azure portal." lightbox="./media/high-availability/traffic-manager-primary-endpoint.png":::

    **Secondary endpoint:**
    
    - **Name:** endpoint-appgw-secondary
    
    - **Type:** External endpoint
    
    - **Target:** Secondary Traffic Manager FQDN (for example, `myapp-appgw.trafficmanager.net`)
    
    - **End Point Status:** Disabled

    :::image type="content" source="./media/high-availability/traffic-manager-secondary-endpoint-application-gateway.png" alt-text="Screenshot of adding Traffic Manager secondary endpoint." lightbox="./media/high-availability/traffic-manager-secondary-endpoint-application-gateway.png":::

1. Verify Traffic Manager health

    ```azurecli
    # Check endpoint health status
    az network traffic-manager profile show `
        --name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --query "{ProfileStatus:profileStatus, MonitorStatus:monitorConfig.profileMonitorStatus, Endpoints:endpoints\[\].{Name:name, Target:target, Priority:priority, Status:endpointMonitorStatus}}"
    ```

    **Expected result:** Both endpoints should show `Status: Online`. If an endpoint shows `Degraded` or `CheckingEndpoint`, wait 1-2 minutes for health probes to complete.

#### Step 5: Update DNS CNAME to Traffic Manager and verify update

> [!WARNING]
> **Potential service impact:** The following steps will redirect your production traffic from Front Door directly to Traffic Manager. Before proceeding:
> - **Test these steps in a non-production environment first** (for example, by temporarily modifying the local `hosts` file on a non‑production workstation to resolve the custom domain to the Traffic Manager endpoint, allowing validation without affecting live traffic).
> - **Reduce your DNS CNAME TTL to the lowest value possible** (for example, 60-300 seconds) at least 24-48 hours before making changes.
> - **Plan for a maintenance window** during low-traffic periods if possible.
> - **Have rollback procedures ready** in case issues arise.

1. Update your DNS CNAME record to point to the **Primary** Traffic Manager instead of directly to Front Door.

    | Field | Old value | New value |
    |----|----|----|
    | **Name / Host** | www | www (no change) |
    | **Value / Points to** | Front Door endpoint hostname | `$ATM_DNS_NAME.trafficmanager.net` |

1. Verify Traffic Manager resolution (wait for DNS propagation and test)

    DNS propagation typically takes 5-10 minutes but can take up to 48 hours globally. Monitor propagation progress and test HTTPS connectivity:
    
    ```
    # Verify Traffic Manager profile is resolving
    nslookup "$ATM_DNS_NAME.trafficmanager.net"
    ```
    **Expected result:** Should return IP address(es) of Front Door endpoint.
    
    ```
    # Check DNS from different resolvers
    nslookup $CUSTOM_DOMAIN 8.8.8.8 # Google DNS
    
    # Test HTTPS connectivity
    Invoke-WebRequest -Uri "https://$CUSTOM_DOMAIN/index.html" -Method Head
    ```
    
    **Expected result:** StatusCode 200

1. Monitor Front Door

    After the DNS cutover, actively monitor the following Azure Front Door metrics:
    
    - Request count: Should remain consistent (no drop in traffic)
    
    - Response time: Should remain within normal ranges
    
    - Error rates: 4xx/5xx errors shouldn't increase
    
    - Origin health: Backend health should remain Online

#### Step 6: Test failover procedures

1. Simulate Front Door failure (manual failover to Application Gateway)

    ```
    # Manual failover to Application Gateway
    # Disable Front Door endpoint
    az network traffic-manager endpoint update `
        --name "endpoint-afd-primary" `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Disabled
    
    # Enable secondary Traffic Manager endpoint (Application Gateway)
    az network traffic-manager endpoint update `
        --name "endpoint-appgw-secondary" `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Enabled
    
    # Verify Traffic Manager endpoint status
    az network traffic-manager endpoint list `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --query "[].{Name:name, Status:endpointStatus, Health:endpointMonitorStatus}" `
        --output table
    
    # Flush DNS cache (Windows)
    ipconfig /flushdns
    
    # Verify DNS resolution (should now point to Secondary Traffic Manager → Application Gateway)
    nslookup $CUSTOM_DOMAIN
    
    # Test - should now work via Application Gateway
    curl --head https://$CUSTOM_DOMAIN/
    ```
    
    > [!NOTE]
    > DNS TTL affects failover time. With TTL of 60 seconds, clients may take up to 60 seconds to see the change. Use `nslookup` to verify resolution is pointing to Application Gateway.

2. Failback to Front Door

    ```
    # Re-enable Front Door endpoint
    az network traffic-manager endpoint update `
        --name "endpoint-afd-primary" `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Enabled
    
    # Disable Application Gateway (via Secondary Traffic Manager)
    az network traffic-manager endpoint update `
        --name "endpoint-appgw-secondary" `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Disabled
        
    # Verify endpoint status
    az network traffic-manager endpoint list `
        --profile-name $ATM_PRIMARY_PROFILE `
        --resource-group $RESOURCE_GROUP `
        --query "[].{Name:name, Status:endpointStatus, Health:endpointMonitorStatus}" `
        --output table
    
    # Flush DNS cache (Windows)
    ipconfig /flushdns
    
    # Verify DNS resolution (should now point back to Front Door)
    nslookup $CUSTOM_DOMAIN
    
    # Test - should now work via Front Door
    curl --head https://$CUSTOM_DOMAIN/
    ```

3. Verify current routing

    ```
    # Check which endpoint is serving traffic
    nslookup $CUSTOM_DOMAIN
    
    Invoke-WebRequest -Uri "https://$CUSTOM_DOMAIN/index.html" -Method Head | Select-Object -ExpandProperty Headers
    ```
    
    > [!NOTE]
    > The response headers can help identify the serving endpoint:
    > - Front Door includes `x-azure-ref` header.
    > - Traffic that passes through Application Gateway might include `Server: Microsoft-IIS` or similar.

## Scenario 2: Traffic Manager failover: Front Door to alternative CDN

This solution uses a single Traffic Manager profile with weighted/always serve routing so that traffic can be manually switched over between Front Door and an alternative CDN:

**Primary endpoint:** Azure Front Door custom domain endpoint.   

**Secondary endpoint:** Alternative CDN endpoint.

:::image type="content" source="./media/high-availability/front-door-alternative-cdn.svg" alt-text="Diagram of Traffic Manager routing between Azure Front Door and another CDN." border="false" lightbox="./media/high-availability/front-door-alternative-cdn.svg":::

**Traffic flow (Normal Operation):** User → DNS Query → Traffic Manager (Weighted routing / Always serve routing) → Azure Front Door (Priority 1) → Origin servers.

**Traffic flow (Front Door failure):** User → DNS Query → Traffic Manager (Weighted routing / Always serve routing) → Alternative CDN (Priority 2) → Origin servers.

### Key implementation steps

#### Step 1: Provision prerequisites

Configure your secondary CDN provider with:

- Azure Front Door configured with custom domain and BYO Certificate.

- Alternative CDN account.

- Lower DNS TTL for your CNAME is Front Door serving traffic to the lowest time setting.

- Origin servers accessible by both Front Door and the alternative CDN.

- Custom domain with ability to modify DNS records

> [!IMPORTANT]
> If you're currently using Front Door-managed certificates, you must migrate to BYO certificates before implementing this HA solution. Front Door-managed certificates can't be exported and installed on alternative CDNs. For more information, see [Configure HTTPS on an Azure Front Door custom domain](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain) for BYO certificate configuration instructions.

#### Step 2: Configure alternative CDN

Configure your secondary CDN provider with:

- Set up CDN zone/property with your custom domain.

- Configure origin servers (same as Front Door backend pool).

- **Upload BYO SSL/TLS certificate:** (the same certificate used in Front Door).

- **Replicate caching rules:** Configure CDN caching rules to match Front Door behavior (cache durations, query string handling, etc.)

- **Enable similar features:** Set up caching settings, control headers, and compression settings to match Front Door configuration.

- Set up WAF rules if the CDN provider offers WAF capabilities (attempt to match Front Door WAF policy).

- Configure custom domain to match your Front Door custom domain (for example, `www.contoso.com`).

- Record the CDN edge hostname for Traffic Manager configuration (for example, `your-site.cdn.provider.net`).

#### Step 3: Create Traffic Manager profile

Apply the following configuration to create the Traffic Manager profile. For more information, see [Create a Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile).

| Setting | Value | Notes |
|----|----|----|
| **Routing Method** | Weighted | Allows manual control via endpoint status (Enabled/Disabled). |
| **Weight** | 100 | Enter 100 when the Traffic Manager profile is created and for both endpoints. |
| **Protocol** | HTTPS | Required for validating SSL/TLS endpoints. |
| **Port** | 443 | Standard HTTPS port. |
| **Path** | /index.html | Choose a lightweight endpoint for health checks. |
| **TTL** | 300 seconds | DNS TTL - lower values enable faster failover but increase DNS queries. |

#### Step 4: Configure Traffic Manager endpoints

Create two endpoints within the Traffic Manager profile with the following configurations:

**Primary endpoint (Front Door):**

- Name: endpoint-afd-primary

- Type: External endpoint

- Target: Front Door endpoint hostname (for example, `myapp-endpoint-12345.z01.azurefd.net`)

- Weight: 100

- Status: Enabled (initially)

- Custom headers: `Host=$CUSTOM_DOMAIN` (required for Front Door to route to correct custom domain)

- Health checks: Always serve traffic (disable health checks)

:::image type="content" source="./media/high-availability/traffic-manager-primary-endpoint.png" alt-text="Screenshot of adding Traffic Manager primary endpoint in the Azure portal." lightbox="./media/high-availability/traffic-manager-primary-endpoint.png":::

**Custom headers for Front Door:** The `--custom-headers "Host=$CUSTOM_DOMAIN"` parameter is critical for Front Door endpoints. Without it, Front Door might not properly route requests to your custom domain configuration. It's a supported feature of Azure Traffic Manager.

**Secondary endpoint (alternative CDN):**

- Name: endpoint-cdn-secondary

- Type: External endpoint

- Target: CDN edge hostname (for example, `myapp.cdn.net`)

- Weight: 100

- Status: Disabled (initially - standby mode)

:::image type="content" source="./media/high-availability/traffic-manager-secondary-endpoint.png" alt-text="Screenshot of adding Traffic Manager secondary endpoint in the Azure portal." lightbox="./media/high-availability/traffic-manager-secondary-endpoint.png":::

#### Step 5: Update DNS CNAME to Traffic Manager and verify update

> [!WARNING]
> **Step 5 configurations** will redirect your production traffic from Front Door directly to Traffic Manager. Before proceeding, ensure you have done the following steps:
> - **Test these steps in a non-production environment first**
> - **Reduce your DNS CNAME TTL to the lowest value possible** (for example, 60-300 seconds) at least 24-48 hours before making changes.
> - **Plan for a maintenance window** during low-traffic periods if possible.
> - **Have rollback procedures ready** in case issues arise.

1. **Update your DNS CNAME record to point to Traffic Manager instead of directly to Front Door:**

    | Field | Old value | New value |
    |----|----|----|
    | Name/Host | www | www (no change) |
    | Value/Points to | Front Door endpoint hostname | `$ATM_CDN_DNS_NAME.trafficmanager.net` |

    > [!NOTE]
    > DNS propagation typically takes 5-10 minutes but can take up to 48 hours globally.

2. **Verify Traffic Manager resolution:** Wait for DNS propagation and test HTTPS connectivity. 

    ```
    # Verify Traffic Manager profile is resolving
    nslookup "$ATM_CDN_DNS_NAME.trafficmanager.net"
    # Expected result: Should return IP address(es) of Front Door endpoint
    
    # Check DNS from different resolvers
    nslookup $CUSTOM_DOMAIN 8.8.8.8    # Google DNS
    
    # Test HTTPS connectivity
    Invoke-WebRequest -Uri "https://$CUSTOM_DOMAIN/index.html" -Method Head
    # Expected result: StatusCode 200
    ```

3. **Monitor Front Door:** After the DNS cutover, actively monitor the following Azure Front Door metrics:

    - Request count: Should remain consistent (no drop in traffic).
    
    - Response time: Should remain within normal ranges.
    
    - Error rates: 4xx/5xx errors shouldn't increase.
    
    - Origin health: Backend health should remain Online.

#### Step 6: Test failover procedures

1. Manual failover to alternative CDN

    ```
    # Failover: Disable Front Door and enable CDN
    az network traffic-manager endpoint update `
        --name "endpoint-afd-primary" `
        --profile-name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Disabled
    
    az network traffic-manager endpoint update `
        --name "endpoint-cdn-secondary" `
        --profile-name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Enabled
    
    # Verify endpoint status
    az network traffic-manager profile show `
        --name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --query "endpoints[].{Name:name, Status:endpointStatus, Health:endpointMonitorStatus, Target:target}"
    
    # Flush local DNS cache and verify resolution
    ipconfig /flushdns
    nslookup "$ATM_CDN_DNS_NAME.trafficmanager.net"
    
    # Test HTTPS access
    curl --head https://$CUSTOM_DOMAIN/
    ```

2. Failback to Front Door

    ```
    # Failback: Enable Front Door, Disable CDN
    az network traffic-manager endpoint update `
        --name "endpoint-afd-primary" `
        --profile-name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Enabled
    
    az network traffic-manager endpoint update `
        --name "endpoint-cdn-secondary" `
        --profile-name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --type externalEndpoints `
        --endpoint-status Disabled
    
    # Verify
    az network traffic-manager profile show `
        --name $ATM_CDN_PROFILE_NAME `
        --resource-group $RESOURCE_GROUP `
        --query "endpoints[].{Name:name, Status:endpointStatus, Health:endpointMonitorStatus}"
    ```

## Monitoring

> [!IMPORTANT]
> Configure synthetic monitors to alert immediately on failures. These alerts should trigger manual failover if automatic failover is insufficient (for example, Front Door custom domain issues that Traffic Manager can't detect).

The following monitoring solutions are recommended for production environments:

- **Azure Monitor Workbooks:** Track Traffic Manager queries, Front Door requests, Application Gateway health. For more information, see [Workbooks overview](/azure/azure-monitor/visualize/workbooks-overview).

- **Outside-in monitoring to detect global Front Door issues:** Implement outside-in global synthetic monitoring solutions (such as Catchpoint or ThousandEyes) to monitor endpoints. Services like [WebPageTest](https://www.webpagetest.org/) offer a free alternative that provides limited global visibility.

- **Application Insights Availability Tests:** Multi-region HTTP checks. For more information, see [Availability testing](/azure/azure-monitor/app/availability-overview).

- **DNS Monitoring:** Validate CNAME resolution chain and TTL propagation via DNSPerf, Pingdom, or Uptime.com.

- **Certificate Monitoring:** For more information, see [SSL Labs Server Test](https://www.ssllabs.com/ssltest/).

