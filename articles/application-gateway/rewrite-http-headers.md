---
title: Rewrite HTTP headers in Azure Application Gateway | Microsoft Docs
description: This article provides an overview of the capability to rewrite HTTP headers in Azure Application Gateway
services: application-gateway
author: abshamsft
ms.service: application-gateway
ms.topic: article
ms.date: 12/20/2018
ms.author: absha
---

# Rewrite HTTP headers with Application Gateway (public preview)

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

HTTP headers allow the client and the server to pass additional information with the request or the response. Rewriting these HTTP headers helps you accomplish several important scenarios such as adding Security-related header fields like HSTS/ X-XSS-Protection or removing response header fields, which may reveal sensitive information like backend server name.

Application Gateway now supports the ability to rewrite headers of the incoming HTTP requests as well as the outgoing HTTP responses. You will be able to add, remove, or update HTTP request and response headers while the request/response packets move between the client and backend pools. You can rewrite both standard as well as non-standard header fields.

> [!NOTE]
> 
> The HTTP header rewrite support is only available for the [new SKU [Standard_V2\]](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant)

Application Gateway header rewrite support offers:

- **Global header rewrite**: You can rewrite specific headers for all the requests and responses pertaining to the site.
- **Path-based header rewrite**:This type of rewrite enables header rewrite for only those requests and responses that pertain to only on a specific site area, for example a shopping cart area denoted by /cart/\*.

With this change, you need to:

1. Create the new objects required to rewrite the http headers: 
   - **RequestHeaderConfiguration**: this object is used to specify the request header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
   - **ResponseHeaderConfiguration**: this object is used to specify the response header fields that you intend to rewrite and the new value that the original headers need to be rewritten to.
   - **ActionSet**: this object contains the configurations of the request and response headers specified above. 
   - **RewriteRule**: this object contains all the *actionSets* specified above. 
   - **RewriteRuleSet**- this object contains all the *rewriteRules* and will need to be attached to a request routing rule - basic or path-based.
2. You will then be required to attach the rewrite rule set with a routing rule. Once created, this rewrite configuration is attached to the source listener via the routing rule. When using a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When a path-based routing rule is used, the header rewrite configuration is defined on the URL path map. So, it only applies to the specific path area of a site.

You can create multiple http header rewrite rule sets and each rewrite rule set can be applied to multiple listeners. However, you can apply only one http rewrite rule set to a specific listener.

You can rewrite the value in the headers to:

- Text value. 

  *Example:* 

  ```azurepowershell-interactive
  $responseHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Strict-Transport-Security" -  HeaderValue "max-age=31536000")
  ```

- Value from another header. 

  *Example 1:* 

  ```azurepowershell-interactive
  $requestHeaderConfiguration= New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-New-RequestHeader" -HeaderValue {http_req_oldHeader}
  ```

  > [!Note] 
  > In order to specify a request header, you need to use the syntax: {http_req_headerName}

  *Example 2*:

  ```azurepowershell-interactive
  $responseHeaderConfiguration= New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-New-ResponseHeader" -HeaderValue {http_resp_oldHeader}
  ```

  > [!Note] 
  > In order to specify a response header, you need to use the syntax: {http_resp_headerName}

- Value from supported server variables.

  *Example:* 

  ```azurepowershell-interactive
  $requestHeaderConfiguration = New-AzApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Ciphers-Used" -HeaderValue "{var_ciphers_used}"
  ```

  > [!Note] 
  > In order to specify a server variable, you need to use the syntax: {var_serverVariable}

- A combination of the above.

## Server variables

Server variables store useful information on a web server. These variables provide information about the server, the connection with the client, and the current request on the connection, such as the client’s IP address or web browser type. They change dynamically, such as when a new page is loaded or a form is posted.  Using these variables users can set request headers as well as response headers. 

This capability supports rewriting headers to the following server variables:

| Supported server variables | Description                                                  |
| -------------------------- | :----------------------------------------------------------- |
| ciphers_supported          | returns the list of ciphers supported by the client          |
| ciphers_used               | returns the string of ciphers used for an established SSL connection |
| client_ip                  | IP address of the client; particularly useful in scenarios where customers intend to rewrite the X-Forwarded-For header set by Application Gateway, so that the header contains only the IP address without the port information. |
| client_port                | client port                                                  |
| client_tcp_rtt             | information about the client TCP connection; available on systems that support the TCP_INFO socket option |
| client_user                | when using HTTP authentication, the username supplied for authentication |
| host                       | in this order of precedence: host name from the request line, or host name from the “Host” request header field, or the server name matching a request |
| cookie_*name*              | the *name* cookie |
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

## Limitations

- This capability to rewrite HTTP headers is currently only available through Azure PowerShell, Azure API and Azure SDK. Support through portal and Azure CLI will be available soon.

- The HTTP header rewrite support is only supported on the new SKU [Standard_V2](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant). The capability will not be supported on the old SKU.

- Rewriting the Connect, Upgrade and Host headers is not supported yet.

- The capability to conditionally rewrite the http headers will be available soon.

- Header names can contain any alphanumeric character and specific symbols as defined in [RFC 7230](https://tools.ietf.org/html/rfc7230#page-27). However, we currently don't support the "underscore"(\_) special character in the Header name. 

## Need help?

Contact us at [AGHeaderRewriteHelp@microsoft.com](mailto:AGHeaderRewriteHelp@microsoft.com) in case you need any help with this capability.

## Next steps

After learning about the capability to rewrite HTTP headers, go to [Create an autoscaling and zone-redundant application gateway that rewrites HTTP headers](tutorial-http-header-rewrite-powershell.md) or [Rewrite HTTP headers in existing autoscaling and zone-redundant application gateway](add-http-header-rewrite-rule-powershell.md)
