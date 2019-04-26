---
title: Rewrite HTTP headers in Azure Application Gateway | Microsoft Docs
description: This article provides an overview of the capability to rewrite HTTP headers in Azure Application Gateway
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 04/11/2019
ms.author: absha
---

# Rewrite HTTP headers with Application Gateway

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

HTTP headers allow the client and the server to pass additional information with the request or the response. Rewriting these HTTP headers helps you accomplish several important scenarios such as adding security-related header fields like HSTS/ X-XSS-Protection, removing response header fields which may reveal sensitive information, removing port information from X-Forwarded-For headers, etc. Application gateway supports the capability to add, remove, or update HTTP request and response headers while the request and response packets move between the client and backend pools. It provides you the capability to add conditions to ensure that the specified headers are rewritten only when certain conditions are met. The capability also supports several [server variables](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers#server-variables) which help store additional information about the requests and responses, thereby enabling you to make powerful rewrite rules.
> [!NOTE]
>
> The HTTP header rewrite support is only available for the [new SKU [Standard_V2\]](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant)

![Rewriting headers](media/rewrite-http-headers/rewrite-headers.png)

## Headers supported for rewrite

The capability allows you to rewrite all headers in the request and response barring the Host, Connection and Upgrade headers. You can also use the application gateway to create custom headers and add them to the request and responses being routed through it. 

## Rewrite conditions

Using the rewrite conditions you can evaluate the content of the HTTP(S) requests and responses, and perform a header rewrite only when one or more conditions are met. The following 3 types of variables are used by the application gateway to evaluate the content of the HTTP(S) requests and responses:

- HTTP headers in  the request
- HTTP headers in the response
- Application gateway server variables

A condition can be used to evaluate whether the specified variable is present, whether the specified variable exactly matches a specific value, or whether the specified variable exactly matches a specific pattern. [Perl Compatible Regular Expressions (PCRE) library](https://www.pcre.org/) is used to implement regular expression pattern matching in the conditions. To learn about the regular expression syntax, see the [Perl regular expressions man page](https://perldoc.perl.org/perlre.html).

## Rewrite actions

Rewrite actions are used to specify the request and response headers that you intend to rewrite and the new value that the original headers need to be rewritten to. You can either create a new header, modify the value of an existing header or delete an existing header. The value of a new header or an existing header can be set to the following types of values:

- Text 
- Request header: In order to specify a request header, you need to use the syntax {http_req_*headerName*}
- Response header: In order to specify a response header, you need to use the syntax {http_resp_*headerName*}
- Server variable: In order to specify a server variable, you need to use the syntax {var_*serverVariable*}
- Combination of text, request header, response header and a server variable.

## Server variables

Application gateway uses server variables to store useful information about the server, the connection with the client, and the current request on the connection, such as the client’s IP address or web browser type. These variables change dynamically, such as when a new page is loaded or a form is posted. You can use these server variables to evaluate rewrite conditions and rewrite headers. 

Application gateway supports the following server variables:

| Supported server variables | Description                                                  |
| -------------------------- | :----------------------------------------------------------- |
| add_x_forwarded_for_proxy  | Contains the “X-Forwarded-For” client request header field with the `client_ip` (explained in this table below) variable appended to it in the format (IP1, IP2, IP3,...). If the “X-Forwarded-For” field is not present in the client request header, the `add_x_forwarded_for_proxy` variable is equal to the `$client_ip` variable. This variable is particularly useful in scenarios where customers intend to rewrite the X-Forwarded-For header set by Application Gateway, such that the header contains only the IP address without the port information. |
| ciphers_supported          | returns the list of ciphers supported by the client          |
| ciphers_used               | returns the string of ciphers used for an established SSL connection |
| client_ip                  | IP address of the client from which the application gateway received the request. If there is a reverse proxy before the application gateway and the originating client, then *client_ip* will return the IP address of the reverse proxy. |
| client_port                | client port                                                  |
| client_tcp_rtt             | information about the client TCP connection; available on systems that support the TCP_INFO socket option |
| client_user                | when using HTTP authentication, the username supplied for authentication |
| host                       | in this order of precedence: host name from the request line, or host name from the “Host” request header field, or the server name matching a request |
| cookie_*name*              | the *name* cookie                                            |
| http_method                | the method used to make the URL request. For example GET, POST etc. |
| http_status                | session status, eg: 200, 400, 403 etc.                       |
| http_version               | request protocol, usually “HTTP/1.0”, “HTTP/1.1”, or “HTTP/2.0” |
| query_string               | the list of variable-value pairs that follow the "?" in the requested URL. |
| received_bytes             | request length (including request line, header, and request body) |
| request_query              | arguments in the request line                                |
| request_scheme             | request scheme, “http” or “https”                            |
| request_uri                | full original request URI (with arguments)                   |
| sent_bytes                 | number of bytes sent to a client                             |
| server_port                | port of the server, which accepted a request                 |
| ssl_connection_protocol    | returns the protocol of an established SSL connection        |
| ssl_enabled                | “on” if connection operates in SSL mode, or an empty string otherwise |

## Rewrite configuration

To configure HTTP header rewrite, you will need to:

1. Create the new objects required to rewrite the http headers:

   - **Rewrite Action**: used to specify the request and request header fields that you intend to rewrite and the new value that the original headers need to be rewritten to. You can choose to associate one ore more rewrite condition with a rewrite action.

   - **Rewrite Condition**: It is an optional configuration. if a rewrite condition is added, it will evaluate the content of the HTTP(S) requests and responses. The decision to execute the rewrite action associated with the rewrite condition will be based whether the HTTP(S) request or response matched with the rewrite condition. 

     If more than one conditions are associated with an action, then the action will be executed only when all the conditions are met, i.e., a logical AND operation will be performed.

   - **Rewrite Rule**: rewrite rule contains multiple rewrite action - rewrite condition combinations.

   - **Rule Sequence**: helps determine the order in which the different rewrite rules get executed. This is helpful when there are multiple rewrite rules in a rewrite set. The rewrite rule with lesser rule sequence value gets executed first. If you provide the same rule sequence to two rewrite rules then the order of execution will be non-deterministic.

   - **Rewrite Set**: contains multiple rewrite rules which will be associated to a request routing rule.

2. You will be required to attach the rewrite set (*rewriteRuleSet*) with a routing rule. This is because the rewrite configuration is attached to the source listener via the routing rule. When using a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When a path-based routing rule is used, the header rewrite configuration is defined on the URL path map. So, it only applies to the specific path area of a site.

You can create multiple http header rewrite sets and each rewrite set can be applied to multiple listeners. However, you can apply only one rewrite set to a specific listener.

## Common scenarios

Some of the common scenarios which require header rewrite are mentioned below.

### Remove port information from the X-Forwarded-For header

Application gateway inserts X-Forwarded-For header to all requests before it forwards the requests to the backend. The format for this header is a comma-separated list of IP:port. However, there may be scenarios where the backend servers require the header to only contain IP addresses. For accomplishing such scenarios, header rewrite can be used to remove the port information from the X-Forwarded-For header. One way to do this is to set the header to add_x_forwarded_for_proxy server variable. 

![Remove port](media/rewrite-http-headers/remove-port.png)

### Modify the redirection URL

When a backend application sends a redirection response, you may want to redirect the client to a different URL than the one specified by the backend application. One such scenario is when an app service is hosted behind an application gateway and requires the client to do a redirection to its relative path (redirect from contoso.azurewebsites.net/path1 to contoso.azurewebsites.net/path2). 

Since app service is a multi-tenant service, it uses the host header in the request to route to the correct endpoint. App services have a default domain name of *.azurewebsites.net (say contoso.azurewebsites.net) which is different from the application gateway's domain name (say contoso.com). Since the original request from the client has application gateway's domain name contoso.com as the host name, the application gateway changes the hostname to contoso.azurewebsites.net, so that the app-service can route it to the correct endpoint. When the app service sends a redirection response, it uses the same hostname in the location header of its response as the one in the request it receives from the application gateway. Therefore, the client will make the request directly to contoso.azurewebsites.net/path2, instead of going through the application gateway (contoso.com/path2). Bypassing the application gateway is not desirable. 

This issue can be resolved by setting the hostname in the location header to the application gateway's domain name. To do this, you can create a rewrite rule with a condition that evaluates if the location header in the response contains azurewebsites.net by entering `(https?):\/\/.*azurewebsites\.net(.*)$` as the pattern and performs an action to rewrite the location header to have application gateway's hostname by entering `{http_resp_Location_1}://contoso.com{http_resp_Location_2}` as the header value.

![Modify location header](media/rewrite-http-headers/app-service-redirection.png)

### Implement security HTTP headers to prevent vulnerabilities

Several security vulnerabilities can be fixed by implementing necessary headers in the application response. Some of these security headers are X-XSS-Protection, Strict-Transport-Security, Content-Security-Policy, etc. You can use application gateway to set these headers for all responses.

![Security header](media/rewrite-http-headers/security-header.png)

### Delete unwanted headers

You may want to remove those headers from the HTTP response that reveal sensitive information such as backend server name, operating system, library details, etc. You can use the application gateway to remove these.

![Deleting header](media/rewrite-http-headers/remove-headers.png)

### Check presence of a header

You can evaluate the HTTP request or response header for the presence of a header or server variable. This is useful when you intend to perform a header rewrite only when a certain header is present.

![Checking presence of a header](media/rewrite-http-headers/check-presence.png)

## Limitations

- Rewriting the Connection, Upgrade and Host headers is not supported yet.

- Header names can contain any alphanumeric character and specific symbols as defined in [RFC 7230](https://tools.ietf.org/html/rfc7230#page-27). However, we currently don't support the "underscore"(\_) special character in the Header name. 

## Need help?

Contact us at [AGHeaderRewriteHelp@microsoft.com](mailto:AGHeaderRewriteHelp@microsoft.com) in case you need any help with this capability.

## Next steps

To learn how to rewrite HTTP headers, see:

-  [Rewrite HTTP headers using Azure portal](https://docs.microsoft.com/azure/application-gateway/rewrite-http-headers-portal)
-  [Rewrite HTTP headers using Azure PowerShell](add-http-header-rewrite-rule-powershell.md)
