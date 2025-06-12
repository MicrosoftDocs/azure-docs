---
title: Front Door Rules Engine Scenarios and Configurations
description: Learn about the scenarios and configurations for Azure Front Door Rules Engine.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 06/12/2025

---

# Azure Front Door rules engine scenarios and configurations

The Azure Front Door rules engine allows users to easily customize processing and routing logic at the Front Door edge by configuring match condition and action pairs. 

You can define various rule [actions](front-door-rules-engine-actions.md) based on combination of 19 supported match conditions from incoming requests. These rules allow you to:

1.	Manage cache policy dynamically

1.	Forward requests to different origins or versions

1.	Modify request or response headers to hide sensitive information or passthrough important information through headers. For example, implementing security headers to prevent browser-based vulnerabilities like:
    - HTTP strict-transport-security (HSTS)
    - X-XSS-protection
    - Content-security-policy
    - X-frame-options
    - Access-Control-Allow-Origin headers for cross-origin resource sharing (CORS) scenarios.
    Security-based attributes can also be defined with cookies.

1.	Rewrite URL paths or redirect requests to new destinations

1.	Enable complex scenarios using regex and server variables: capture dynamic values from incoming requests or responses, and combine them with static strings or other variables.

This article covers common use cases supported by the rules engine, and how to configure these rules to meet your needs. It also includes Azure Resource Manager (ARM) template examples to help automate deployment of these capabilities.

## Scenario 1: Redirect using query string, URL path segments, or incoming hostname captures

Managing redirects is critical for search engine optimization (SEO), user experience, and the proper functioning of a website. Azure Front Door's rules engine and server variables allow you to efficiently manage batch redirects based on various parameters.

- **Redirect based on query string parameters:** You can redirect requests using query fields of the incoming URL by capturing the value of a specific query string key in the format `{http_req_arg_<key>}`.
    
    For example, extract the value of `cdpb` query key from an incoming URL: `https://example.mydomain.com/testcontainer/123.zip?sig=fffff&cdpb=teststorageaccount` and use it to configure the “destination host” into outgoing URL: `https://teststorageaccount.blob.core.windows.net/testcontainer/123.zip?sig=fffff&cdpb=teststorageaccount`.
    
    This approach enables dynamic redirects without having to create a separate rule for each `cdpb` value, significantly reducing the number of rules required.

    # [**Portal**](#tab/portal)

    :::image type="content" source="./media/rules-engine-scenarios/redirect-query-string.png" alt-text="Screenshot that shows how to use query string to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-query-string.png":::

    # [**ARM**](#tab/arm)

    ```json
    {
        "type": "Microsoft.Cdn/profiles/rulesets/rules",
        "apiVersion": "2025-04-15",
        "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectQueryStringCapture')]",
        "dependsOn": [
            "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
            "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
        ],
        "properties": {
            "order": 100,
            "conditions": [],
            "actions": [
                {
                    "name": "UrlRedirect",
                    "parameters": {
                        "typeName": "DeliveryRuleUrlRedirectActionParameters",
                        "redirectType": "PermanentRedirect",
                        "destinationProtocol": "MatchRequest",
                        "customHostname": "{http_req_arg_cdpb}.blob.core.windows.net"
                    }
                }
            ],
            "matchProcessingBehavior": "Continue"
        }
    }
    ```
    ---

- **Redirect based on fixed-length URL path segments:** You can redirect requests to different origins based on fixed-length URL path segment by capturing the URL segments using `{variable:offset:length}`. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

    For example, consider a scenario where the tenant ID is embedded in the URL segment and is always six characters long, such as: `https://api.contoso.com/{tenantId}/xyz`. To extract `{tenantId}` from the URL and decide the correct redirect to use in the format of `tenantId.backend.com/xyz`.

    This approach eliminates the need to create a separate rule for each tenant ID, allowing you to handle dynamic routing with fewer rules.

# [**Portal**](#tab/portal)

    :::image type="content" source="./media/rules-engine-scenarios/redirect-url-path-segment.png" alt-text="Screenshot that shows how to use fixed-length path segment to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-url-path-segment.png":::

# [**ARM**](#tab/arm)

    ```json
    {
        "type": "Microsoft.Cdn/profiles/rulesets/rules",
        "apiVersion": "2025-04-15",
        "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectURLSegmentCapture')]",
        "dependsOn": [
            "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
            "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
        ],
        "properties": {
            "order": 101,
            "conditions": [],
            "actions": [
                {
                    "name": "UrlRedirect",
                    "parameters": {
                        "typeName": "DeliveryRuleUrlRedirectActionParameters",
                        "redirectType": "PermanentRedirect",
                        "destinationProtocol": "MatchRequest",
                        "customPath": "/xyz",
                        "customHostname": "{url_path:0:6}.backend.com"
                    }
                }
            ],
            "matchProcessingBehavior": "Continue"
        }
    }
    ```

---

- **Redirect based on dynamic-length URL path segments:** When the URL path segment has a dynamic length, you can extract it using the `{url_path:seg#}`. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

   For example, if a tenant ID or location is embedded in the URL segment, such as: `https://api.contoso.com/{tenantId}/xyz`, you can extract `{tenantId}` from the URL and decide the correct redirect in the format of `tenantId.backend.com/xyz` with server variable `{url_path:seg0}.backend.com` in the redirect destination host.

    This method avoids creating separate rules for each tenant ID, enabling more efficient configuration.

# [**Portal**](#tab/portal)

N/A

# [**ARM**](#tab/arm)

    ```json
    {
        "type": "Microsoft.Cdn/profiles/rulesets/rules",
        "apiVersion": "2025-04-15",
        "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectURLSegmentCapture')]",
        "dependsOn": [
            "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
            "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
        ],
        "properties": {
            "order": 101,
            "conditions": [],
            "actions": [
                {
                    "name": "UrlRedirect",
                    "parameters": {
                        "typeName": "DeliveryRuleUrlRedirectActionParameters",
                        "redirectType": "PermanentRedirect",
                        "destinationProtocol": "MatchRequest",
                        "customPath": "/xyz",
                        "customHostname": "{url_path:seg0}.backend.com"
                    }
                }
            ],
            "matchProcessingBehavior": "Continue"
        }
    }
    ```

---

- **Redirect based on part of the incoming hostname:** You can redirect requests to different origins by extracting part of the incoming hostname.

    For example, you can capture `tenantName` from `https://[tenantName].poc.contoso.com/GB` to redirect the request to `s1.example.com/Buyer/Main?realm=[tenantName]&examplename=example1` using the offset and length in server variable in the format of `{hostname:0:-16}`. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

# [**Portal**](#tab/portal)

    :::image type="content" source="./media/rules-engine-scenarios/redirect-incoming-hostname.png" alt-text="Screenshot that shows how to use incoming hostname to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-incoming-hostname.png":::

# [**ARM**](#tab/arm)

    ```json
    {
        "type": "Microsoft.Cdn/profiles/rulesets/rules",
        "apiVersion": "2025-04-15",
        "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectHostnameCapture')]",
        "dependsOn": [
            "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
            "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
        ],
        "properties": {
            "order": 102,
            "conditions": [
                {
                    "name": "HostName",
                    "parameters": {
                        "typeName": "DeliveryRuleHostNameConditionParameters",
                        "operator": "EndsWith",
                        "negateCondition": false,
                        "matchValues": [
                            "poc.contoso.com"
                        ],
                        "transforms": []
                    }
                }
            ],
            "actions": [
                {
                    "name": "UrlRedirect",
                    "parameters": {
                        "typeName": "DeliveryRuleUrlRedirectActionParameters",
                        "redirectType": "PermanentRedirect",
                        "destinationProtocol": "MatchRequest",
                        "customQueryString": "realm={hostname:0:-16}&examplename=example1",
                        "customPath": "/Buyer/Main",
                        "customHostname": "s1.example.com"
                    }
                }
            ],
            "matchProcessingBehavior": "Continue"
        }
    }
    ```

---

## Scenario 2: Populate or modify a response header based on a request header value

In some scenarios, you might need to populate or modify a response header based on a request header value.

For example, you can add CORS header where needed to serve scripts on multiple origins from the same CDN domain, and response must contain the same FQDN in `Access-Control-Allow-Origin` header as the request origin header, rather than a wildcard allowing all domains (*) to enhance security. You can achieve it by using the `{http_req_header_Origin}` server variable to set the response header.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/modify-response-header.png" alt-text="Screenshot that shows how to modify a response header based on a request header value." lightbox="./media/rules-engine-scenarios/modify-response-header.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/OverwriteRespHeaderUsingReqHeaderCapture')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 103,
        "conditions": [
            {
                "name": "RequestHeader",
                "parameters": {
                    "typeName": "DeliveryRuleRequestHeaderConditionParameters",
                    "operator": "Contains",
                    "selector": "Origin",
                    "negateCondition": false,
                    "matchValues": [
                        "my-domain-01.com"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "ModifyResponseHeader",
                "parameters": {
                    "typeName": "DeliveryRuleHeaderActionParameters",
                    "headerAction": "Overwrite",
                    "headerName": "Access-Control-Allow-Origin",
                    "value": "{http_req_header_Origin}"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 3: Rename a response header to a brand-specific one 

You can rename a response header generated by a cloud provider by adding a new custom response header and deleting the original.

For example, you can replace the response header `X-Azure-Backend-ID` with a brand-specific header `X-Contoso-Scale-ID`.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/rename-response-header-brand-specific.png" alt-text="Screenshot that shows how to rename a response header to a brand-specific one." lightbox="./media/rules-engine-scenarios/rename-response-header-brand-specific.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RenameResponseHeaders')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 104,
        "conditions": [],
        "actions": [
            {
                "name": "ModifyResponseHeader",
                "parameters": {
                    "typeName": "DeliveryRuleHeaderActionParameters",
                    "headerAction": "Append",
                    "headerName": "X-Contoso-Scale-ID",
                    "value": "{http_resp_header_X-Azure-Backend-ID}"
                }
            },
            {
                "name": "ModifyResponseHeader",
                "parameters": {
                    "typeName": "DeliveryRuleHeaderActionParameters",
                    "headerAction": "Delete",
                    "headerName": "X-Azure-Backend-ID"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 4: A/B testing (experimentation)

Splitting incoming traffic into two origin groups can be is useful in A/B testing, rolling deployments, or load balancing without complex backend logic.

For example, you can split incoming traffic based on the client port number. A rule can match client ports that end in 1, 3, 5, 7, or 9 and forward those requests to an *experiment-origin-group*. All other traffic continues to the default origin group per route settings. The previous regex is just an example. You can explore and test your own expressions using tools like [regex101](https://regex101.com/).

> [!NOTE]
> Since client ports are random, this method typically results in an approximate 50/50 traffic split. However, the presence of any proxies or load balancers between clients and the Front Door might affect this assumption due to factors like connection reuse or source port rewriting. Use logs or metrics to validate the actual behavior in your environment.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/a-b-testing.png" alt-text="Screenshot that shows how to split incoming traffic into two origin groups." lightbox="./media/rules-engine-scenarios/a-b-testing.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/ABExperimentation')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]",
        "[resourceId('Microsoft.Cdn/profiles/origingroups', parameters('profiles_rulesengineblog_name'), 'experiment-origin-group')]"
    ],
    "properties": {
        "order": 105,
        "conditions": [
            {
                "name": "ClientPort",
                "parameters": {
                    "typeName": "DeliveryRuleClientPortConditionParameters",
                    "operator": "RegEx",
                    "negateCondition": false,
                    "matchValues": [
                        "^.*[13579]$"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "RouteConfigurationOverride",
                "parameters": {
                    "typeName": "DeliveryRuleRouteConfigurationOverrideActionParameters",
                    "originGroupOverride": {
                        "originGroup": {
                            "id": "[resourceId('Microsoft.Cdn/profiles/origingroups', parameters('profiles_rulesengineblog_name'), 'experiment-origin-group')]"
                        },
                        "forwardingProtocol": "MatchRequest"
                    }
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 5: Redirect with URL path modification and preserve capability

In some scenarios, you might need to add new segments or remove some segments while preserving the rest of the URL path.

For example, if you want to redirect `https://domain.com/seg0/seg1/seg2/seg3` to `https://example.com/seg0/insert/seg2/seg3`. In this scenario, you replace URL path’s `{seg1}` with `/insert/` while preserving the rest of the URL path. Azure Front Door achieves the desired redirect by combining values extracted from server variables (URL segments) and combining static string segment `/insert/`. You can use `Int32.Max (2147483647)` for URL segment’s length field to keep all segments from *seg2* to *segn*. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

> [!NOTE]
> Similar configuration can be done for URL rewrite action by inputting source pattern as `/` and destination as `/{url_path:seg0}/insert/{url_path:seg2:2147483647}` for redirect action as shown in the following portal example.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/redirect-url-path-modification.png" alt-text="Screenshot that shows how to redirect with URL path modification while preserving part of the URL path." lightbox="./media/rules-engine-scenarios/redirect-url-path-modification.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/redirectWithSegCap01')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 106,
        "conditions": [],
        "actions": [
            {
                "name": "UrlRedirect",
                "parameters": {
                    "typeName": "DeliveryRuleUrlRedirectActionParameters",
                    "redirectType": "Found",
                    "destinationProtocol": "Https",
                    "customPath": "/{url_path:seg0}/insert/{url_path:seg2:2147483647}"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 6: Redirect by removing fixed parts of a URL path

You can remove fixed segments of known size from a URL path, such as country codes (us) or locales (en-us), while preserving the rest of the URL path.

For example, if you want to redirect `https://domain.com/us/seg1/seg2/seg3/` to `https://example.com/seg1/seg2/seg3/`, you need to remove the country code `/us/` and keep the rest of the URL path unchanged. 

To achieve this, use `{variable:offset} `, which includes the server variable after a specific offset, until the end of the variable. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

> [!NOTE]
> Similar configuration can be done for URL rewrite action by inputting source pattern as `/` and destination as `/“{url_path:3}` for redirect action as shown in the following portal example.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/redirect-remove-fixed-part.png" alt-text="Screenshot that shows how to redirect by removing fixed parts of a URL path." lightbox="./media/rules-engine-scenarios/redirect-remove-fixed-part.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectByRemovingFixedUrlLength')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 107,
        "conditions": [
            {
                "name": "RequestUri",
                "parameters": {
                    "typeName": "DeliveryRuleRequestUriConditionParameters",
                    "operator": "RegEx",
                    "negateCondition": false,
                    "matchValues": [
                        "\\/[a-zA-Z0-9]{2}\\/"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "UrlRedirect",
                "parameters": {
                    "typeName": "DeliveryRuleUrlRedirectActionParameters",
                    "redirectType": "Found",
                    "destinationProtocol": "Https",
                    "customPath": "/{url_path:3}"
                    "customHostname": "example.com"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 7: URL rewrite by removing one or more segments of URL path

You can remove one or more segments from a URL path, such as country codes (us) or locales (en-us), while preserving the rest of the URL path.

For example, if you want to rewrite `https://domain.com/us/seg1/seg2/seg3/` to `https://origin.com/seg2/seg3/`, you need to remove both the country code and an additional segment `/us/seg1/` while keeping the rest of the URL path intact. 

To achieve this, use the `{url_path:seg#:length}` server variable format to capture specific URL segments starting from a particular segment number. In this example, use `{url_path:seg2:2147483647}` to capture all segments starting from `seg2` to the end. The value `2147483647` (Int32.Max) ensures all remaining segments are included. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/rewrite-url-remove-segments.png" alt-text="Screenshot that shows how to use URL rewrite to remove one or more segments of URL path." lightbox="./media/rules-engine-scenarios/rewrite-url-remove-segments.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/URLRewriteRemovingOneorMoreSegments')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 108,
        "conditions": [],
        "actions": [
            {
                "name": "UrlRewrite",
                "parameters": {
                    "typeName": "DeliveryRuleUrlRewriteActionParameters",
                    "sourcePattern": "/",
                    "destination": "/{url_path:seg2:2147483647}",
                    "preserveUnmatchedPath": false
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

> [!NOTE]
> When using server variables like `{url_path}` in the **Destination** field, the **Preserve unmatched path** setting becomes less relevant because server variables give you explicit control over which parts of the URL path to include.

## Scenario 8: Use regex to reduce the number of rule conditions and avoid hitting limits

Using regex in rule conditions can significantly reduce the number of rules required, which helps avoid rule limits that can be a blocker for customers who need conditions or actions for hundreds of clients.

For example, if a customer wants to identify their clients with a specific ID pattern to allow access to a resource behind Azure Front Door, clients send a header like `x-client-id: SN1234-ABCD56`. This header follows a specific format: `x-client-id: <SN + 4 digits + - + 4 uppercase letters + 2 digits>`.

Instead of creating individual rules for each possible client ID, you can use a single regex pattern `^SN[0-9]{4}-[A-Z]{4}[0-9]{2}$` to match all valid client IDs in one rule, for example, `SN1234-ABCD56`, `SN0001-ZYXW99`, `SN2025-QWER12`, `SN9876-MNOP34`, `SN3141-TEST42`, etc. This approach allows you to handle hundreds of different client IDs with a single rule configuration.

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/regex-client-id-pattern.png" alt-text="Screenshot that shows how to use regex to match client ID patterns." lightbox="./media/rules-engine-scenarios/regex-client-id-pattern.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/UseRegexTogroupConditions')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]",
        "[resourceId('Microsoft.Cdn/profiles/origingroups', parameters('profiles_rulesengineblog_name'), 'default-origin-group')]"
    ],
    "properties": {
        "order": 109,
        "conditions": [
            {
                "name": "RequestHeader",
                "parameters": {
                    "typeName": "DeliveryRuleRequestHeaderConditionParameters",
                    "operator": "RegEx",
                    "selector": "x-client-id",
                    "negateCondition": false,
                    "matchValues": [
                        "^SN[0-9]{4}-[A-Z]{4}[0-9]{2}$"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "RouteConfigurationOverride",
                "parameters": {
                    "typeName": "DeliveryRuleRouteConfigurationOverrideActionParameters",
                    "originGroupOverride": {
                        "originGroup": {
                            "id": "[resourceId('Microsoft.Cdn/profiles/origingroups', parameters('profiles_rulesengineblog_name'), 'default-origin-group')]"
                        },
                        "forwardingProtocol": "MatchRequest"
                    }
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

> [!NOTE]
> You can use [regex101](https://regex101.com/) to test and validate your regex patterns before implementing them in Azure Front Door.

## Scenario 9: Modify origin redirects using response header captures

You can make action fields dynamic by using response header values as server variables. This is useful when origin servers issue redirects that reference their own domain names.

**The Problem:** Origin servers like Azure App Service commonly issue redirect URLs that reference their own domain name (for example, `contoso.azurewebsites.net`). If these URLs reach the client unmodified, the next request bypasses Azure Front Door, which disrupts the user's navigation experience.

**The Solution:** Capture the origin's `Location` header and rewrite just the host portion so it always reflects the hostname that the client originally used.

For example, if the frontend client's host header to Azure Front Door is `contoso.com` and the origin is `contoso.azurewebsites.net`, when the origin issues an absolute redirect URL like Location: `https://contoso.azurewebsites.net/login/`, you can modify the location header back to use the original hostname Location: `https://contoso.com/login/`

This is achieved using the server variable format: `https://{hostname}{http_resp_header_location:33}`, where:
- `{hostname}` represents the original client hostname (`contoso.com`)
- `{http_resp_header_location:33}` captures the Location header content starting from offset 33 (the `/login/` part)

For more information, see [Preserve the original HTTP host name between a reverse proxy and its back-end web application](/azure/architecture/best-practices/host-name-preservation).

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/modify-origin-redirects.png" alt-text="Screenshot that shows how to modify origin redirects using response header captures." lightbox="./media/rules-engine-scenarios/modify-origin-redirects.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RewriteLocationHeaderToModifyRedirect')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 110,
        "conditions": [
            {
                "name": "UrlPath",
                "parameters": {
                    "typeName": "DeliveryRuleUrlPathMatchConditionParameters",
                    "operator": "Contains",
                    "negateCondition": false,
                    "matchValues": [
                        "login",
                        "update"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "ModifyResponseHeader",
                "parameters": {
                    "typeName": "DeliveryRuleHeaderActionParameters",
                    "headerAction": "Overwrite",
                    "headerName": "Location",
                    "value": " https://{hostname}{http_resp_header_location:33}"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

> [!NOTE]
> - This rule can be used when rule condition is based on request parameters or when invoked unconditionally.
> 
> - For consistent offset calculation, all origin servers in the origin group should have domain names of the same length, for example, all 33 characters like `https://contoso.azurewebsites.net`. Ideally, there should be just one origin server, but multiple origins are acceptable if their names have identical lengths.
> 
> - You can apply the same server variable capture technique to extract and reuse request query string parameters in different rule actions.

## Scenario 10: If-elseif-else rules

The Azure Front Door rules engine doesn't natively support traditional conditional logic with "if-elseif-else" structures. By default, all rules are independently evaluated as "if condition1 then action1", "if condition2 then action2", and so forth. When multiple conditions are met simultaneously, multiple corresponding actions are executed.

However, you can emulate "if-elseif-else" logic by using the **Stop evaluating remaining rules** feature to create conditional branching that resembles:

- If condition1 is satisfied, execute action1 and stop
- Else if condition2 is satisfied (but condition1 is not), execute action2 and stop  
- Else if condition3 is satisfied (but condition1 and condition2 are not), execute action3 and stop
- Else, execute a default action

**How it works:** When multiple conditions would normally be satisfied simultaneously, only the first matching rule executes because rule evaluation stops after the first match. This effectively simulates traditional conditional branching.

# [**Portal**](#tab/portal)

**Configuration steps:**

1. Create a new ruleset (for example, "IfElseifElseRuleset")
2. Create rules in priority order, with the most specific conditions first
3. For each rule, check the **Stop evaluating remaining rules** option

:::image type="content" source="./media/rules-engine-scenarios/if-elseif-else-rules.png" alt-text="Screenshot that shows how to configure if-elseif-else rules." lightbox="./media/rules-engine-scenarios/if-elseif-else-rules.png":::

> [!IMPORTANT]
> This if-elseif-else paradigm only works if the ruleset is attached as the **final** ruleset for that route.

:::image type="content" source="./media/rules-engine-scenarios/if-elseif-else-rules-final.png" alt-text="Screenshot that shows how to place if-elseif-else rules as the final ruleset for the route." lightbox="./media/rules-engine-scenarios/if-elseif-else-rules-final.png":::

# [**ARM**](#tab/arm)

N/A

---

## Scenario 11: Removing query strings from incoming URLs using URL redirects

You can remove query strings from incoming URLs by implementing a 3xx URL redirect that guides users back to the Azure Front Door endpoint with the query strings removed.

> [!NOTE]
> Users will notice the change of the request URL with this operation.

The following example demonstrates how to remove the entire query string from incoming URLs. If you need to strip part of it, you can adjust the offset/length as desired. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/remove-query-strings.png" alt-text="Screenshot that shows how to remove query strings from incoming URLs using URL 3xx redirects." lightbox="./media/rules-engine-scenarios/remove-query-strings.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RemoveQueryStrings')]",
    "dependsOn": [
        "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
        "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 111,
        "conditions": [
            {
                "name": "QueryString",
                "parameters": {
                    "typeName": "DeliveryRuleQueryStringConditionParameters",
                    "operator": "GreaterThan",
                    "negateCondition": false,
                    "matchValues": [
                        "0"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "UrlRedirect",
                "parameters": {
                    "typeName": "DeliveryRuleUrlRedirectActionParameters",
                    "redirectType": "Moved",
                    "destinationProtocol": "MatchRequest",
                    "customQueryString": "{query_string:0:0}"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Scenario 12: Append SAS token in query string to authenticate Azure Front Door to Azure Storage

You can protect files in your storage account by changing the access to your storage containers from public to private and using Shared Access Signatures (SAS) to grant restricted access rights to your Azure Storage resources from Azure Front Door without exposing your account key. You can also accomplish this using Managed Identity. For more information, see [Use managed identities to authenticate to origins](/azure/frontdoor/origin-authentication-with-managed-identities).

**How SAS token injection works:** Capture the incoming URL path and append the SAS token to the query string using redirect or rewrite rules. Since URL rewrite only acts on the path, use redirect rules when you need to modify query strings.

For example, if you want to append a SAS token to the incoming URL: `https://www.contoso.com/dccp/grammars/0.1.0-59/en-US/grammars/IVR/ssn0100_CollectTIN_QA_dtmf.grxml?version=1.0_1719342835399`, the rewrite URL will be: `https://www.contoso.com/grammars/0.1.0-59/en-US/grammars/IVR/ssn0100_CollectTIN_QA_dtmf.grxml?version=1.0_1719342835399&<SASTOKEN>`

In this example, the incoming URL already has query parameters, and you want to preserve the existing query string while appending the SAS token by configuring URL redirect using `/{url_path:seg1:20}?{query_string}&<SASToken>`.

The rule configuration redirects all HTTPS requests that don't already contain the SAS token (identified by the absence of `sp=rl` in the query string).

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/append-sas-token.png" alt-text="Screenshot that shows how to append SAS token in query string." lightbox="./media/rules-engine-scenarios/append-sas-token.png":::

# [**ARM**](#tab/arm)

```json
{
	"type": "Microsoft.Cdn/profiles/rulesets/rules",
	"apiVersion": "2025-04-15",
	"name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/RedirectForAppendSASToken')]",
	"dependsOn": [
	"[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
	"[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
	],
    "properties": {
        "order": 100,
        "conditions": [
            {
                "name": "RequestScheme",
                "parameters": {
                    "typeName": "DeliveryRuleRequestSchemeConditionParameters",
                    "matchValues": [
                        "HTTPS"
                    ],
                    "operator": "Equal",
                    "negateCondition": false,
                    "transforms": []
                }
            },
            {
                "name": "QueryString",
                "parameters": {
                    "typeName": "DeliveryRuleQueryStringConditionParameters",
                    "operator": "Contains",
                    "negateCondition": true,
                    "matchValues": [
                        "sp=rl"
                    ],
                    "transforms": []
                }
            }
        ],
        "actions": [
            {
                "name": "UrlRedirect",
                "parameters": {
                    "typeName": "DeliveryRuleUrlRedirectActionParameters",
                    "redirectType": "Found",
                    "destinationProtocol": "MatchRequest",
                    "customQueryString": "{ {query_string}&<replace with your SAS token>",
                    "customPath": "/{url_path:seg1:20}"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
	}
}
```

---

> [!IMPORTANT]
> - Update your route configuration to ensure routes for `/grammars/*` are properly configured after the redirect
> 
> - Replace the SAS token with the proper token. In the example, the SAS token starts with `sp=rl`, and you want to redirect all requests to apply this rule which doesn’t contain the `sp=rl`

## Scenario 13: Add security headers with rules engine

You can use the Azure Front Door rules engine to add security headers that help prevent browser-based vulnerabilities, such as HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, and X-Frame-Options.

For example, you can add a *Content-Security-Policy* header to all incoming requests that match the path defined in the route associated with your rules engine configuration. In this configuration, use `script-src 'self' https://apiphany.portal.azure-api.net` as the header value to only allow scripts from the trusted site `https://apiphany.portal.azure-api.net` to run on the application. For more information, see [Add security headers with rules engine](/frontdoor/front-door-security-headers#add-a-content-security-policy-header-in-azure-portal).

# [**Portal**](#tab/portal)

:::image type="content" source="./media/rules-engine-scenarios/add-security-headers.png" alt-text="Screenshot that shows how to add security headers with rules engine." lightbox="./media/rules-engine-scenarios/add-security-headers.png":::

# [**ARM**](#tab/arm)

```json
{
    "type": "Microsoft.Cdn/profiles/rulesets/rules",
    "apiVersion": "2025-04-15",
    "name": "[concat(parameters('profiles_rulesengineblog_name'), '/RulesBlogScenarios/ContentSecurityPolicyExample')]",
    "dependsOn": [
    "[resourceId('Microsoft.Cdn/profiles/rulesets', parameters('profiles_rulesengineblog_name'), 'RulesBlogScenarios')]",
    "[resourceId('Microsoft.Cdn/profiles', parameters('profiles_rulesengineblog_name'))]"
    ],
    "properties": {
        "order": 100,
        "conditions": [],
        "actions": [
            {
                "name": "ModifyResponseHeader",
                "parameters": {
                    "typeName": "DeliveryRuleHeaderActionParameters",
                    "headerAction": "Append",
                    "headerName": "Content-Security-Policy",
                    "value": "script-src 'self' https://apiphany.portal.azure-api.net"
                }
            }
        ],
        "matchProcessingBehavior": "Continue"
    }
}
```

---

## Related content

- [What is a rule set in Azure Front Door?](/azure/frontdoor/front-door-rules-engine)
- [Rule set actions](/azure/frontdoor/front-door-rules-engine-actions)
- [Configure rule sets in Azure Front Door](/azure/frontdoor/standard-premium/how-to-configure-rule-set)
