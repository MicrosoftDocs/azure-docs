# Application Gateway http header rewrite

HTTP headers allow the client and the server to pass additional information with the request or the response. Rewriting these HTTP headers helps you accomplish several important scenarios such as adding Security-related header fields like HSTS/ X-XSS-Protection or removing response header fields which may reveal sensitive information like backend server name.

Application Gateway now supports the ability to rewrite headers of the incoming HTTP requests as well as the outgoing HTTP responses. You will be able to add, remove or update HTTP request and response headers while the request/response packets move between the client and backend pools. You can rewrite both standard (defined in [RFC 2616](https://www.ietf.org/rfc/rfc2616.txt)) as well as non-standard header fields.

> [!NOTE] 
>
> The HTTP header rewrite support is only available for the [new SKU [Standard_V2\]](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-autoscaling-zone-redundant)

Application Gateway header rewrite support offers:

- **Global header rewrite** You can rewrite specific headers for all the requests and responses pertaining to the site.
- **Path-based header rewrite** This type of rewrite enables header rewrite for only those requests and responses that pertain to only on a specific site area, for example a shopping cart area denoted by /cart/*.

With this change, you need to:

1. Create the new objects required to rewrite the http headers: 
   1. Http request and/or response configuration, where you will specify the names of headers that you intend to rewrite and new value that the original headers need to be rewritten to. 
   2. “actionSet”- this object contains the configurations of the request and response headers specified above. 
   3. “rewriteRule”- this object contains all the actionSets. 
   4. “rewriteRuleSet”- this object contains all the rewriteRules and will need to be attached to a request routing rule- basic or path-based
2. You will then be required to attach the rewrite rule set with a routing rule. Once created, this rewrite configuration is attached to the source listener via the routing rule. When using a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite. When a path-based routing rule is used, the header rewrite configuration is defined on the URL path map. So, it only applies to the specific path area of a site.

You can create multiple http header rewrite rule sets and each rewrite rule set can be applied to multiple listeners. However, you can apply only one http rewrite rule set to a specific listener.

You can rewrite the value in the headers to:

1. Text value. 

   Example: $responseHeaderConfiguration = New-AzureRmApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Strict-Transport-Security" -HeaderValue "max-age=31536000")

1. Value from another header. 

   Example 1: $requestHeaderConfiguration= New-AzureRmApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-New-RequestHeader" -HeaderValue {http_req_oldHeader}

> [!Note] 
>
> In order to specify a request header, you need to use the syntax: {http_req_<header name>}

​	Example 2: $responseHeaderConfiguration= New-AzureRmApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "X-New-ResponseHeader" -HeaderValue {http_resp_oldHeader}

> [!Note] 
>
> In order to specify a response header, you need to use the syntax: {http_resp_<header name>}

1. Value from supported server variables. Example: $requestHeaderConfiguration = New-AzureRmApplicationGatewayRewriteRuleHeaderConfiguration -HeaderName "Ciphers-Used" -HeaderValue "{var_ssl_cipher}"

> [!Note] 
>
> In order to specify a server variable, you need to use the syntax: {var_<server variable>}

1. A combination of the above.

The server variables mentioned above are the variables that provide information about the server, the connection with the client, and the current request on the connection. This capability supports rewriting headers to the following server variables:

1. ciphers_supported: returns the list of ciphers supported by the client
2. ciphers_used: returns the string of ciphers used for an established SSL connection;
3. client_latitude: to determine the country, region, and city depending on the client IP address
4. client_longitude: to determine the country, region, and city depending on the client IP address
5. client_port: client port
6. client_tcp_rtt: information about the client TCP connection; available on systems that support the TCP_INFO socket option
7. client_user: When using HTTP authentication, the username supplied for authentication
8. content_length: “Content-Length” request header field
9. content_type: “Content-Type” request header field
10. host: in this order of precedence: host name from the request line, or host name from the “Host” request header field, or the server name matching a request
11. http_method: The method used to make the URL request. For example GET, POST etc
12. http_status: session status, eg: 200, 400, 403 etc
13. http_version: request protocol, usually “HTTP/1.0”, “HTTP/1.1”, or “HTTP/2.0”
14. query_string: The list of variable-value pairs that follow the "?" in the requested URL.
15. received_byte: request length (including request line, header, and request body)
16. request_query: arguments in the request line
17. request_scheme: request scheme, “http” or “https”
18. request_uri: full original request URI (with arguments)
19. sent_bytes: number of bytes sent to a client
20. server_name: name of the server which accepted a request
21. server_port: port of the server which accepted a request
22. ssl_connection_protocol: returns the protocol of an established SSL connection
23. ssl_enabled: “on” if connection operates in SSL mode, or an empty string otherwise

## Limitations

1. This capability to rewrite HTTP headers is currently only available through Azure PowerShell, Azure API and Azure SDK. Support through portal and Azure CLI will be available soon.
2. Once you apply a header rewrite on your Application Gateway, you should not use the portal for making any subsequent changes to that Application Gateway until the capability is supported on portal. If you use the portal to make changes to the Application Gateway after applying a rewrite rule, the header rewrite rule. You can continue to make changes using Azure PowerShell, Azure APIs or Azure SDK.
3. The HTTP header rewrite support is only supported on the new SKU [Standard_V2]. The capability will not be supported on the old SKU.
4. Rewriting the Connect, Upgrade and Host headers is not supported yet.
5. Though two important server variables client_ip (the IP address of the client making the request) and cookie_name (the name cookie) are not supported yet but will be supported soon. The client_ip server variable is particularly useful in scenarios where customers intend to rewrite the x-forwarded-for header set by Application Gateway, so that the header contains only the IP address of the client and not the port information.
6. The capability to conditionally rewrite the http headers will be available soon.

## Need help?

Contact us at [AppGwHeaderRewriteHelp@microsoft.com](mailto:AppGwHeaderRewriteHelp@microsoft.com) in case you need any help with this capability.

## Next steps

After learning about the capability to rewrite HTTP headers, go to [Create an autoscaling and zone-redundant application gateway that rewrites HTTP headers](tutorial-http-header-rewrite-ps.md) or [Rewrite HTTP headers in existing autoscaling and zone-redundant application gateway](add-http-header-rewriterule-ps.md)