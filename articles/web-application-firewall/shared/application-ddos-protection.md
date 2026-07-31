---
title: Application DDoS Protection
titleSuffix: Azure Web Application Firewall
description: This article explains how you can use Azure Web Application Firewall with Azure Front Door or Azure Application Gateway to protect your web applications against application layer DDoS attacks.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 06/30/2026

# Customer intent: "As a web application administrator, I want to implement layers of DDoS protection through a Web Application Firewall and Azure services, so that I can ensure my applications remain available and performant against various DDoS attack vectors."
---

# Application (Layer 7) DDoS protection

Azure WAF includes several defense mechanisms that help prevent distributed denial of service (DDoS) attacks. DDoS attacks can target both the network layer (L3/L4) and the application layer (L7). Azure DDoS Protection defends you against large network layer volumetric attacks. Azure WAF, operating at layer 7, protects web applications against L7 DDoS attacks such as HTTP floods. These defenses prevent attackers from reaching your application and affecting your application's availability and performance.

## How can you protect your services?

Mitigate these attacks by adding a Web Application Firewall (WAF) or placing DDoS Protection in front of the service to filter out bad requests. Azure offers WAF running at the network edge with Azure Front Door and in data centers with Application Gateway. Adjust these steps to fit your application requirements.

- Deploy [Azure Web Application Firewall (WAF)](../overview.md) with Azure Front Door Premium or Application Gateway WAF v2 SKU to protect against L7 application layer attacks.  
- Scale up your origin instance count so that there's sufficient spare capacity.
- Enable [Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md) on the origin public IPs to protect your public IPs against layer 3 (L3) and layer 4 (L4) DDoS attacks. Azure’s DDoS offerings automatically protect most sites from L3 and L4 volumetric attacks that send large numbers of packets towards a website. Azure also offers infrastructure level protection to all sites hosted on Azure by default.

## Azure WAF with Azure Front Door

Azure WAF includes many features that you can use to mitigate different types of attacks, like HTTP floods, cache bypass, and attacks launched by botnets.

- Use the bot protection managed rule set to protect against known bad bots. For more information, see [Configuring bot protection](../afds/waf-front-door-policy-configure-bot-protection.md).

- Apply rate limits to prevent IP addresses from calling your service too frequently. For more information, see [Rate limiting](../afds/waf-front-door-rate-limit.md).

- Block IP addresses and ranges that you identify as malicious. For more information, see [IP restrictions](../afds/waf-front-door-configure-ip-restriction.md).

- Block or redirect to a static web page any traffic from outside a defined geographic region, or within a defined region that doesn't fit the application traffic pattern. For more information, see [Geo-filtering](../afds/waf-front-door-geo-filtering.md).

- Create [custom WAF rules](../afds/waf-front-door-custom-rules.md) to automatically block and rate limit HTTP or HTTPS attacks that have known signatures. Signatures include a specific user-agent or a specific traffic pattern, such as headers, cookies, query string parameters, or a combination of multiple signatures.

Beyond WAF, Azure Front Door also offers default Azure infrastructure DDoS protection to protect against L3/L4 DDoS attacks. Enabling caching on Azure Front Door can help absorb sudden peak traffic volume at the edge and protect backend origins from attack as well. 

For more information on features and DDoS protection on Azure Front Door, see [DDoS protection on Azure Front Door](../../frontdoor/front-door-ddos.md).

## Azure WAF with Azure Application Gateway

Use the Application Gateway WAF v2 SKU, which includes the latest features such as L7 DDoS mitigation features, to protect against L7 DDoS attacks.  

You can use Application Gateway WAF SKUs to mitigate many L7 DDoS attacks:

- Set your Application Gateway to autoscale and don't enforce the number of max instances.

- Use the bot protection managed rule set to protect against known bad bots. For more information, see [Configuring bot protection](../ag/bot-protection.md).

- Apply rate limits to prevent IP addresses from calling your service too frequently. For more information, see [Configuring Rate limiting custom rules](../ag/rate-limiting-configure.md).

- Block IP addresses and ranges that you identify as malicious. For more information, see examples at [Create and use v2 custom rules](../ag/create-custom-waf-rules.md).

- Block or redirect to a static web page any traffic from outside a defined geographic region, or within a defined region that doesn't fit the application traffic pattern. For more information, see examples at [Create and use v2 custom rules](../ag/create-custom-waf-rules.md).

- Create [custom WAF rules](../ag/configure-waf-custom-rules.md) to automatically block and rate limit HTTP or HTTPS attacks that have known signatures. Signatures include a specific user-agent or a specific traffic pattern that includes headers, cookies, query string parameters, or a combination of multiple signatures.

## Other considerations

- Lock down access to public IPs on origin and restrict inbound traffic to only allow traffic from Azure Front Door or Application Gateway to origin. Refer to the [guidance on Azure Front Door](../../frontdoor/front-door-faq.yml#what-are-the-steps-to-restrict-the-access-to-my-backend-to-only-azure-front-door-). Ensure there aren't any publicly exposed IP addresses in the Application Gateway's virtual network.

- Switch WAF policy to the prevention mode. Deploying the policy in detection mode operates in the log only and doesn't block traffic. After verifying and testing your WAF policy with production traffic and fine tuning to reduce any false positives, turn policy to prevention mode (block/defend mode). 

- Monitor traffic using Azure WAF logs for any anomalies. You can create custom rules to block any offending traffic – suspected IPs sending unusually high number of requests, unusual user-agent string, anomalous query string patterns, and more.

- You can bypass the WAF for known legitimate traffic by creating Match Custom Rules with the action of Allow to reduce false positives. Configure these rules with a high priority (lower numeric value) than other block and rate limit rules.

- At a minimum, have a rate limit rule that blocks high rate of requests from any single IP address. For example, you can configure a rate limit rule to not allow any single *Client IP address* to send more than XXX traffic per window to your site. Azure WAF supports two windows for tracking requests, one and five minutes. Use the five-minute window for better mitigation of HTTP Flood attacks. This rule should be the lowest priority rule (priority is ordered with 1 being the highest priority), so that more specific Rate Limit rules or Match rules can be created to match before this rule. If you're using Application Gateway WAF v2, you can use other rate limiting configurations to track and block clients by methods other than Client IP. More information on rate limits on Application Gateway WAF can be found at [Rate limiting overview](../ag/rate-limiting-overview.md).

    The following Log Analytics query can be helpful in determining the threshold you should use for the previous rule. For a similar query but with Application Gateway, replace `FrontdoorAccessLog` with `ApplicationGatewayAccessLog`.

    ```
    AzureDiagnostics
    | where Category == "FrontdoorAccessLog"
    | summarize count() by bin(TimeGenerated, 5m), clientIp_s
    | summarize max(count_), percentile(count_, 99), percentile(count_, 95)
    ```

- Managed rules, while not directly targeted for defenses against DDoS attacks, provide protection against other common attacks. For more information, see [Managed rules (Azure Front Door)](../afds/waf-front-door-drs.md) or [Managed rules (Application Gateway)](../ag/application-gateway-crs-rulegroups-rules.md) to learn more about various attack types these rules can help protect against.

## WAF log analysis

You can analyze WAF logs in Log Analytics using the following query.

### Azure Front Door

```
AzureDiagnostics
| where Category == "FrontdoorWebApplicationFirewallLog"
```

For more information, see [Azure WAF with Azure Front Door](../afds/waf-front-door-monitor.md).

### Azure Application Gateway

```
AzureDiagnostics
| where Category == "ApplicationGatewayFirewallLog"
```

For more information, see [Azure WAF with Azure Application Gateway](../ag/web-application-firewall-logs.md).

## Related content

- [Create a WAF policy](../afds/waf-front-door-create-portal.md) for Azure Front Door.
- [Create an Application Gateway](../ag/application-gateway-web-application-firewall-portal.md) with a Web Application Firewall.
- Learn how Azure Front Door can help [protect against DDoS attacks](../../frontdoor/front-door-ddos.md).
- Protect your application gateway with [Azure DDoS Network Protection](../../application-gateway/tutorial-protect-application-gateway-ddos.md).
- Learn more about the [Azure DDoS Protection](../../ddos-protection/ddos-protection-overview.md).
