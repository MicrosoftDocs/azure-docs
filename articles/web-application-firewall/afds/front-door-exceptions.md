---
title: Azure Front Door WAF Exceptions List (Preview)  
titleSuffix: Azure Web Application Firewall
description: This article provides an overview of Web Application Firewall (WAF) exceptions on Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 06/29/2026

---

# Azure Front Door WAF exceptions list (preview)

The Azure Front Door Web Application Firewall (WAF) helps protect your web applications from common threats and attacks. This article describes how to configure WAF exception lists in a WAF policy associated with your Azure Front Door.

For an overview of WAF policies, see [Azure Web Application Firewall on Azure Front Door](afds-overview.md) and [WAF policy settings](waf-front-door-policy-settings.md).

In some cases, WAF might block requests that are safe and expected for your application. Exception lists allow you to bypass WAF inspection for specific requests. You can configure exceptions at the rule, rule group, or managed ruleset level.

Only the next generation of WAF engine supports exceptions, and you can use them only if your managed ruleset version is DRS 2.1, or later. For more information, see [DRS rule groups and rules](waf-front-door-drs.md).

> [!IMPORTANT]
> Exceptions in Azure Front Door Web Application Firewall (WAF) is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Define request attributes

When you create an exception, specify which request attributes identify the traffic that should bypass WAF evaluation. Supported attributes include:

- Request URI
- Remote IP address
- Request header name and value

Match attributes either exactly or partially by using the following operators:

- **Equals:** Matches the exact value. **Example:** To select the header bearerToken, use the *Equals* operator with bearerToken as the selector.

- **Starts with:** Matches values beginning with the specified selector.

- **Ends with:** Matches values ending with the specified selector.

- **Contains:** Matches values containing the specified selector.

- **IP Match:** Matches one or more IP addresses.

## Set the exception scope

Scope exceptions to:

- A specific rule

- A rule group

- An entire managed ruleset

When you define an exception:

- Specify the rules, rule group, or managed ruleset it applies to.

- Define the request attribute that identifies the traffic to exclude.

- To exclude an entire rule group, provide the `ruleGroupName` parameter. Use the `rules` parameter only when narrowing the exception to specific rules within that group.

> [!TIP]
> Always make exceptions as narrow as possible. Broad exceptions might unintentionally expose your application to attacks. Whenever possible, use per-rule exceptions.

## Apply an exception to your WAF policy

Suppose you don't want WAF to inspect requests to `/login.php` and `/logout.php` when it evaluates SQL injection rules. Configure exceptions as follows:

1. Go to the WAF policy where you want to add exceptions.

1. Under **Settings**, select **Managed rules**.

1. In the **Exceptions** tab, select **Add exceptions**.

    :::image type="content" source="../media/exceptions/front-door-exceptions.png" alt-text="Screenshot that shows how to add exceptions in a WAF policy in the Azure portal." lightbox="../media/exceptions/front-door-exceptions.png":::

1. In **Applies to**, select the DRS ruleset to apply the exception to, such as *Microsoft_DefaultRuleSet_2.1*, and select the scope (**Entire ruleset**, **Rule group**, or **Specific rules**).

    :::image type="content" source="../media/exceptions/exceptions-scope.png" alt-text="Screenshot that shows how to select the DRS ruleset and scope for the exception in a WAF policy in the Azure portal." lightbox="../media/exceptions/exceptions-scope.png":::

1. Select **Add exception** and configure the match variable, value match operator, and the values.

    :::image type="content" source="../media/exceptions/exceptions-configuration.png" alt-text="Screenshot that shows how to configure the match variable, value match operator, and values for the exception in a WAF policy in the Azure portal." lightbox="../media/exceptions/exceptions-configuration.png":::

1. Select **Add** and then **Save** to apply the new exception.
    
1. Go to the **Exceptions** tab to see the new exception.

## Limitations

The following limitations apply to WAF exceptions:

- Each Azure WAF policy supports up to **60 exceptions**.

- Each Azure Front Door supports up to **60 exceptions in total**, calculated as the sum of all exceptions across the WAF policies associated with that gateway.

- Within a **single exception**, you can configure up to:

  - **600 IP addresses**, or

  - **10 URIs**, or

  - **10 request headers**.

## Options to allow traffic through Azure WAF

Azure Web Application Firewall (WAF) provides several mechanisms to safely allow traffic when needed while maintaining protection. Depending on whether you want to bypass inspection for part of a request, or the entire request, use **Exclusions**, **Exceptions**, or **Custom rules**.

### Allow specific parts of a request using exclusions

Use **Exclusions** when you want WAF to skip inspection of a specific element within a request, such as a header, query parameter, or cookie, while still applying inspection to the rest of the request.

**Example:** If a legitimate application sends a session cookie with random characters that frequently trigger SQL Injection false positives, you can configure an exclusion for that cookie. WAF skips inspection for the cookie value but still enforces protections on the rest of the request.

### Allow entire requests by using custom rules and exceptions

To allow an entire request to bypass WAF inspection, use one of the following options:

#### Custom rule with an *Allow* action

When you configure a custom rule with the *Allow* action, the request bypasses inspection by the Default Rule Set (DRS), the Core Rule Set (CRS), and the Bot Protection ruleset.

> [!IMPORTANT]
> This bypass is absolute for these rulesets and can't be changed or selectively applied. Once the *Allow* action is triggered, none of these rulesets evaluate the request. However, the **HTTP DDoS protection ruleset** still processes the request. This ruleset ensures requests are checked for volumetric or flood-style attacks even if all other rulesets are skipped.

Use this configuration only when you fully trust the traffic source or application, since it effectively disables signature and anomaly detection.

**Example:** If you have a trusted partner API that frequently triggers DRS rules due to its payload format, you can create a custom *Allow* rule for traffic coming from the partner’s IP range. This configuration ensures the traffic is never blocked by DRS, CRS, or Bot Protection, while still benefiting from HTTP DDoS safeguards.

#### Exceptions (more granular control)

In contrast, exceptions let you bypass inspection only for specific rules, rule groups, or entire rulesets rather than disabling all of them at once.

You can apply exceptions to DRS, CRS, Bot Protection, and even the HTTP DDoS ruleset.

This approach provides fine-grained control, so you can disable inspection for one problematic rule while keeping the rest of the protections active.

**Example:** If a single DRS rule (for example *Restrict Content-Type Header*) blocks valid mobile app requests, you can create an exception for that rule only. All other DRS rules, Bot Protection, and DDoS protections continue to run on the traffic.

## Related content

- [Azure Web Application Firewall on Azure Front Door](afds-overview.md)
- [Azure Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md)
- [Azure Web Application Firewall policy settings](waf-front-door-policy-settings.md)
