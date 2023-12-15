---
title: Hosting multiple sites on Azure Application Gateway
description: This article provides an overview of the Azure Application Gateway multi-site support. Examples are provided of rule priority and the order of evaluation for rules applied to incoming requests. Application Gateway rule priority evaluation order is described in detail. Conditions and limitations for using wildcard rules are provided.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.date: 04/25/2023
ms.author: greglin
ms.topic: conceptual
---

# Application Gateway multiple site hosting

Multiple site hosting enables you to configure more than one web application on the same port of application gateways using public-facing listeners. It allows you to configure a more efficient topology for your deployments by adding up to 100+ websites to one application gateway. Each website can be directed to its own backend pool. For example, three domains, contoso.com, fabrikam.com, and adatum.com, point to the IP address of the application gateway. You'd create three multi-site listeners and configure each listener for the respective port and protocol setting.

You can also define wildcard host names in a multi-site listener and up to 5 host names per listener. To learn more, see [wildcard host names in listener](#wildcard-host-names-in-listener).

:::image type="content" source="./media/multiple-site-overview/multisite.png" alt-text="Multi-site Application Gateway":::

> [!IMPORTANT]
> Rules are processed in the order they are listed in the portal for the v1 SKU. For v2 SKU use [rule priority](#request-routing-rules-evaluation-order) to specify the processing order. It is highly recommended to configure multi-site listeners first prior to configuring a basic listener.  This ensures that traffic gets routed to the right back end. If a basic listener is listed first and matches an incoming request, it gets processed by that listener.

Requests for `http://contoso.com` are routed to ContosoServerPool, and `http://fabrikam.com` are routed to FabrikamServerPool.

Similarly, you can host multiple subdomains of the same parent domain on the same application gateway deployment. For example, you can  host `http://blog.contoso.com` and `http://app.contoso.com` on a single application gateway deployment.

## Request Routing rules evaluation order

When you use multi-site listeners to ensure that the client traffic is routed to the accurate backend, it's important that the request routing rules are present in the correct order.
For example, if you have 2 listeners with associated host names of `*.contoso.com` and `shop.contoso.com`, the listener with the `shop.contoso.com` host name must be processed before the listener with `*.contoso.com`. If the listener with `*.contoso.com` is processed first, then no client traffic is received by the more specific `shop.contoso.com` listener.

The ordering of rules can be established by providing a **Priority** field value to the request routing rules associated with the listeners. You can specify an integer value from 1 to 20000 with 1 being the highest priority and 20000 being the lowest priority. If incoming client traffic matches with multiple listeners, the request routing rule with highest priority is used to serve the request. Each request routing rule must have a unique priority value.

The priority field only impacts the order of evaluation of a request routing rule, this wont change the order of evaluation of path based rules within a `PathBasedRouting` request routing rule.

> [!NOTE]
> To use rule priority, you must specify rule priority field values for all the existing request routing rules. Once the rule priority field is in use, any new routing rule that is created must have a rule priority field value as part of its configuration. 

> [!IMPORTANT]
>  Starting with API version 2021-08-01, the rule priority field is a mandatory field in the request routing rules. Rule priority field values for existing request routing rules, based on current ordering of evaluation as part of the first PUT call, are automatically populated if any configuration updates are applied using API version 2021-08-01 and above, portal, Azure PowerShell and Azure CLI. Future updates to request routing rules must have the rule priority field provided as part of the configuration.

## Wildcard host names in listener

Application Gateway allows host-based routing using multi-site HTTP(S) listener. Now, you can use wildcard characters like asterisk (*) and question mark (?) in the host name, and up to 5 host names per multi-site HTTP(S) listener. For example, `*.contoso.com`.

Using a wildcard character in the host name, you can match multiple host names in a single listener. For example, `*.contoso.com` can match with `ecom.contoso.com`, `b2b.contoso.com` and `customer1.b2b.contoso.com` and so on. Using an array of host names, you can configure more than one host name for a listener, to route requests to a backend pool. For example, a listener can contain `contoso.com, fabrikam.com` which accepts requests for both the host names.

:::image type="content" source="./media/multiple-site-overview/wildcard-listener-diag.png" alt-text="Wildcard Listener":::

>[!NOTE]
> This feature is available only for Standard_v2 and WAF_v2 SKU of Application Gateway.

In [Azure PowerShell](tutorial-multiple-sites-powershell.md), you must use `-HostNames` instead of `-HostName`. With HostNames, you can mention up to 5 host names as comma-separated values and use wildcard characters. For example, `-HostNames "*.contoso.com","*.fabrikam.com"`

In [Azure CLI](tutorial-multiple-sites-cli.md), you must use `--host-names` instead of `--host-name`. With host-names, you can mention up to 5 host names as comma-separated values and use wildcard characters. For example, `--host-names "*.contoso.com,*.fabrikam.com"`

In the Azure portal, under the multi-site listener, you must choose the **Multiple/Wildcard** host type to mention up to five host names with allowed wildcard characters.

:::image type="content" source="./media/multiple-site-overview/wildcard-listener-example.png" alt-text="Wildcard Listener UI":::

### Allowed characters in the host names field

* `(A-Z,a-z,0-9)` - alphanumeric characters
* `-` - hyphen or minus
* `.` - period as a delimiter
* `*` - can match with multiple characters in the allowed range
* `?` - can match with a single character in the allowed range

<!-- docutune:disable -->

### Conditions for using wildcard characters and multiple host names in a listener

* You can only mention up to 5 host names in a single listener
* Asterisk `*` can be mentioned only once in a component of a domain style name or host name. For example, component1*.component2*.component3. `(*.contoso-*.com)` is valid.
* There can only be up to two asterisks `*` in a host name. For example, `*.contoso.*` is valid and `*.contoso.*.*.com` is invalid.
* There can only be a maximum of 4 wildcard characters in a host name. For example, `????.contoso.com`, `w??.contoso*.edu.*` are valid, but `????.contoso.*` is invalid.
* Using asterisk `*` and question mark `?` together in a component of a host name (`*?` or `?*` or `**`) is invalid. For example, `*?.contoso.com` and `**.contoso.com` are invalid.

<!-- docutune:enable -->

### Considerations and limitations of using wildcard or multiple host names in a listener

* [SSL termination and End-to-End SSL](ssl-overview.md) requires you to configure the protocol as HTTPS and upload a certificate to be used in the listener configuration. If it's a multi-site listener, you can input the host name as well, usually this is the CN of the SSL certificate. When you're specifying multiple host names in the listener or use wildcard characters, you must consider the following:
    * If it's a wildcard hostname like *.contoso.com, you must upload a wildcard certificate with CN like *.contoso.com
    * If multiple host names are mentioned in the same listener, you must upload a SAN certificate (Subject Alternative Names) with the CNs matching the host names mentioned.
* You can't use a regular expression to mention the host name. You can only use wildcard characters like asterisk (*) and question mark (?) to form the host name pattern.
* For backend health check, you can't associate multiple [custom probes](application-gateway-probe-overview.md) per HTTP settings. Instead, you can probe one of the websites at the backend or use "127.0.0.1" to probe the localhost of the backend server. However, when you're using wildcard or multiple host names in a listener, the requests for all the specified domain patterns are routed to the backend pool depending on the rule type (basic or path-based).
* The "hostname" property takes one string as input, where you can mention only one non-wildcard domain name. The "hostnames" property takes an array of strings as input, where you can mention up to 5 wildcard domain names. Both these properties can't be used at once.

See [create multi-site using Azure PowerShell](tutorial-multiple-sites-powershell.md) or [using Azure CLI](tutorial-multiple-sites-cli.md) for the step-by-step guide on how to configure wildcard host names in a multi-site listener.



## Host headers and Server Name Indication (SNI)

There are three common mechanisms for enabling multiple site hosting on the same infrastructure.

1. Host multiple web applications each on a unique IP address.
2. Use host name to host multiple web applications on the same IP address.
3. Use different ports to host multiple web applications on the same IP address.

Currently Application Gateway supports a single public IP address where it listens for traffic. So multiple applications, each with its own IP address is currently not supported.

Application Gateway supports multiple applications each listening on different ports, but this scenario requires the applications to accept traffic on nonstandard ports.

Application Gateway relies on HTTP 1.1 host headers to host more than one website on the same public IP address and port. The sites hosted on application gateway can also support TLS offload with Server Name Indication (SNI) TLS extension. This scenario means that the client browser and backend web farm must support HTTP/1.1 and TLS extension as defined in RFC 6066.

## Next steps

Learn how to configure multiple site hosting in Application Gateway
* [Using the Azure portal](create-multiple-sites-portal.md)
* [Using Azure PowerShell](tutorial-multiple-sites-powershell.md)
* [Using Azure CLI](tutorial-multiple-sites-cli.md)

You can visit [Resource Manager template using multiple site hosting](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/application-gateway-multihosting) for an end to end template-based deployment.
