---
title: Front Door Rules Engine Scenarios and Configurations
description: Learn about the scenarios and configurations for Azure Front Door Rules Engine.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 06/03/2025

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

### Scenario 1: Redirect using query string, URL path segments, or incoming hostname captures

Managing redirects is critical for search engine optimization (SEO), user experience, and the proper functioning of a website. Azure Front Door's rules engine and server variables allow you to efficiently manage batch redirects based on various parameters.

- **Redirect based on query string parameters:** You can redirect requests using query fields of the incoming URL by capturing the value of a specific query string key in the format `{http_req_arg_<key>}`.
    
    For example, extract the value of `cdpb` query key from an incoming URL: `https://example.mydomain.com/testcontainer/123.zip?sig=fffff&cdpb=teststorageaccount` and use it to configure the “destination host” into outgoing URL: `https://teststorageaccount.blob.core.windows.net/testcontainer/123.zip?sig=fffff&cdpb=teststorageaccount`.
    
    This approach enables dynamic redirects without having to create a separate rule for each `cdpb` value, significantly reducing the number of rules required.

    :::image type="content" source="./media/rules-engine-scenarios/redirect-query-string.png" alt-text="Screenshot that shows how to use query string to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-query-string.png":::

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

- **Redirect based on fixed-length URL path segments:** You can redirect requests to different origins based on fixed-length URL path segment by capturing the URL segments using `{variable:offset:length}`. For more information about server variable format, see [Server variables](/azure/frontdoor/rule-set-server-variables#server-variable-format).

    For example, consider a scenario where the tenant ID is embedded in the URL segment and is always 6 characters long, such as: `https://api.contoso.com/{tenantId}/xyz`. To extract `{tenantId}` from the URL and decide the correct redirect to use in the format of `tenantId.backend.com/xyz`.

    This approach eliminates the need to create a separate rule for each tenant ID, allowing you to handle dynamic routing with fewer rules.

    :::image type="content" source="./media/rules-engine-scenarios/redirect-url-path-segment.png" alt-text="Screenshot that shows how to use fixed-length path segment to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-url-path-segment.png":::

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

- **Redirect based on dynamic-length URL path segments:** When the URL path segment has a dynamic length, you can extract it using the `{url_path:seg#}`. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format).

   For example, if a tenant ID or location is embedded in the URL segment, such as: `https://api.contoso.com/{tenantId}/xyz`, you can extract `{tenantId}` from the URL and decide the correct redirect in the format of `tenantId.backend.com/xyz` with server variable `{url_path:seg0}.backend.com` in the redirect destination host.

    This method avoids creating separate rules for each tenant ID, enabling more efficient configuration.

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

- **Redirect based on part of the incoming hostname:** You can redirect requests to different origins by extracting part of the incoming hostname.

    For example, you can capture `tenantName` from `https://[tenantName].poc.contoso.com/GB` to redirect the request to `s1.example.com/Buyer/Main?realm=[tenantName]&examplename=example1` using the offset and length in server variable in the format of `{hostname:0:-16}`. For more information, see [Server variable format](/azure/frontdoor/rule-set-server-variables#server-variable-format)

    :::image type="content" source="./media/rules-engine-scenarios/redirect-incoming-hostname.png" alt-text="Screenshot that shows how to use incoming hostname to redirect URL." lightbox="./media/rules-engine-scenarios/redirect-incoming-hostname.png":::

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

### Scenario 2: Populate or modify a response header based on a request header value

In some scenarios, you may need to populate or modify a response header based on a request header value.

For example, you can add CORS header where needed to serve scripts on multiple origins from the same CDN domain, and response must contain the same FQDN in `Access-Control-Allow-Origin` header as the request origin header, rather than a wildcard allowing all domains (*) to enhance security. You can achieve it by using the `{http_req_header_Origin}` server variable to set the response header.

:::image type="content" source="./media/rules-engine-scenarios/modify-response-header.png" alt-text="Screenshot that shows how to modify a response header based on a request header value." lightbox="./media/rules-engine-scenarios/modify-response-header.png":::


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

### Scenario 3: Rename a response header to a brand-specific one 

You can rename a response header generated by a cloud provider by adding a new custom response header and deleting the original.

For example, you can replace the response header `X-Azure-Backend-ID` with a brand-specific header `X-Contoso-Scale-ID`.

:::image type="content" source="./media/rules-engine-scenarios/rename-response-header-brand-specific.png" alt-text="Screenshot that shows how to rename a response header to a brand-specific one." lightbox="./media/rules-engine-scenarios/rename-response-header-brand-specific.png":::

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

### Scenario 4: A/B testing (experimentation)

Split incoming traffic based on client port into two origin groups, sending some to origin with experimental experiences. This method is useful for A/B testing, rolling deployments, or load balancing without complex backend logic.
The follow example routes clients with port ending 1,3,5,7,9 to “experiment-origin-group” else it proceeds to the default origin group for that route per route settings. The regex in this example is just an example, you can explore and test regex for your own needs using public sites like regex101.


Note: Since client ports are random, this approach achieves a nearly 50/50 traffic split. The presence of any proxies or load balancers between clients and AFD may affect the assumption that the client port seen by AFD is always randomized, due to connection re-use, rewriting of source ports etc. Use logs or metrics to find out what the actual behavior looks like.

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

### Scenario 5: Redirect with URL path modification and preserve capability

Users need to add new segments, remove some segments and preserve the rest of the URL path.
For example, if you want to redirect https://domain.com/seg0/seg1/seg2/seg3 to https://example.com/seg0/insert/seg2/seg3, i.e. replace URL path’s {seg1} with /insert/ and keep the rest of the URL as-is. In this scenario, AFD can achieve the desired redirect by combining values extracted from server variables (URL segments) and combining static string segment “/insert/”. The semantics used to indicate we keep from seg2…n is by indicating Int32.Max (2147483647) for URL segment’s length field. See this page for more details.

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

### Scenario 6: Redirect by removing fixed parts of a URL path

A user needs to remove fixed segments of known size from a URL like, country code (us) or locale (en-us), and preserve the rest of the URL path.
For example, if you want to redirect https://domain.com/us/seg1/seg2/seg3/ to https://example.com/seg1/seg2/seg3/, i.e. remove country code /us/ and keep the rest of the URL path as-is. Use the {variable:offset} which includes the server variable after a specific offset, until the end of the variable. For more information see, https://learn.microsoft.com/en-us/azure/frontdoor/rule-set-server-variables#server-variable-format.

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

### Scenario 7: URL Rewrite by removing one or more segments of URL path

Users need to remove segments from a URL like, country code (us) or locale (en-us), and also preserve the rest of the URL path.
For example, if you want to rewrite https://domain.com/us/seg1/seg2/seg3/ to https://origin.com/seg2/seg3/, i.e. remove country code and an additional segment /us/seg1/ and keep the rest of the URL path.

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

### Scenario 8: Use regex to reduce the number of rule conditions and avoid hitting limits

Using regex in rule conditions can reduce the number of rules, which can be a blocker due to rule limits for some customers needing conditions or actions for hundreds of their clients.
For example, if a customer wants identify their clients with an ID pattern to be allowed to access a resource behind AFD, then they will be sending a header like x-client-id: SN1234-ABCD56 which is of the format
x-client-id: <SN + 4 digits + - + 4 uppercase letters + 2 digits>

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

### Scenario 9: Modify origin redirects using response header captures

This allows for making actions fields dynamic, by using response header values as server variables.
For example, it’s common for the origin servers like Azure App service to issue redirect URLs that reference its own domain name like contoso.azurewebsites.net. If those URLs reach the client unmodified, the next request will bypass AFD which is not intended and can disrupt the user's navigation experience.
The workaround is to capture the origin’s Location header and rewrite just the host portion so it always reflects the host that the client originally used.
If frontend client host header to AFD is contoso.com and the origin is contoso.azurewebsites.net, then if the origin issues an absolute redirect URL like this Location: https://contoso.azurewebsites.net/login/, then the location header modification back to contoso.com will be as follows - https://{hostname}{http_resp_header_location:33}, where {hostname} is contoso.com and {http_resp_header_location:33} captures location header from offset 33, i.e. /login/ to give the final location header as Location: https://contoso.com/login/
More details about the problem is explained here preserve the original HTTP hostname between a reverse proxy and it’s back-end web applications

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

### Scenario 10: If-elseif-else rules

The current rule engine in Azure Front Door does not natively support traditional conditional logic with "if-elseif-else" structures. Instead, all rules are independently evaluated as "if condition1 then action1," "if condition2 then action2," and so forth. This implies that if multiple conditions (e.g., condition1 and condition2) are simultaneously met, multiple corresponding actions (action1 and action2) will be executed.
However, it is possible to emulate an "if-elseif-else" that resembles the following:
-	If condition1 is satisfied, execute action1.
-	Else if condition2 is satisfied (but condition1 is not), execute action2.
-	Else, execute a default action.
If multiple conditions (condition1, condition2, ..., conditionN) are satisfied simultaneously, only the first matching action is executed, effectively simulating traditional conditional branching. If none of the conditions are met, the default action will execute.
To configure this, create a new ruleset call it “IfElseifElseRuleset” and create rules as normal, the only change would be to check the Stop evaluating remaining rules box after each rule as shown below – 

Note: Due to limitations of current ruleset implementation, this if-elseif-else paradigm will only work if the ruleset is attached as the final ruleset for that route as shown below.
Here is the Rule set configuration in Azure portal.

### Scenario 11: Removing query strings from incoming URLs using URL redirects

To remove query strings from incoming URLs, implement a 3xx URL redirect to guide users back to the AFD endpoint with the query strings removed. Please note, users will notice the change of the request URL with this operation.
Here is the configuration in rules engine in portal to strip the whole query string. If you need to strip part of it, you can adjust the offset/length as desired: Server variables - Azure Front Door | Microsoft Learn

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

### Scenario 12: Append SAS token in query string to authenticate AFD to Azure Storage

To protect the files in your storage account, you can set the access of your storage containers from public to private and use the Shared Access Signature (SAS) to grant restricted access rights to your Azure Storage resources from Azure Front Door without exposing your account key. You can also accomplish this using Managed Identity, which is currently in preview on AFD. Or you can inject a SAS token into the route of the call to storage. This can be achieved by capturing an incoming URL path and appending the SAS token to the query string in the rewrite or redirect rule. 
Here is an example of appending SAS token on AFD.
•	Incoming URL: https://www.contoso.com/dccp/grammars/0.1.0-59/en-US/grammars/IVR/ssn0100_CollectTIN_QA_dtmf.grxml?version=1.0_1719342835399
•	Rewrite URL: https://www.contoso.com/grammars/0.1.0-59/en-US/grammars/IVR/ssn0100_CollectTIN_QA_dtmf.grxml?version=1.0_1719342835399&<SASTOKEN>
In this case, the incoming URL already has query string, and you want the keep the query string while appending the SAS token, please use redirect rule as URL rewrite only acts on path. To achieve this, you can configure URL redirect using /url_path:seg1:20}?{query_string}&sp=racwl&<SASToken>. Please make proper updates to Routes to make sure the routes for /grammars/* are properly configured after redirect.
Example in portal
Please replace the SAS token with the proper token. In this case, the SAS token starts with sp=rl, and you want to redirect all requests to apply this rule which doesn’t contain the sp=rl.

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

### Scenario 13: Add security headers with rules engine

When you want to add security headers to prevent browser-based vulnerabilities, such as HTTP Strict-Transport-Security (HSTS), X-XSS-Protection, Content-Security-Policy, and X-Frame-Options, you can use AFD rules engine to achieve it.
Here is an example that shows how to add a Content-Security-Policy header to all incoming requests that match the path defined in the route associated with your rules engine configuration. In this scenario, only scripts from the trusted site https://apiphany.portal.azure-api.net are allowed to run on the application. Use script-src 'self' https://apiphany.portal.azure-api.net as the header value.

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




