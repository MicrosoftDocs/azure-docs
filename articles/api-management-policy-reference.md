<properties pageTitle="Azure API Management Policy Reference" metaKeywords="" description="Learn about the policies available to configure API Management." metaCanonical="" services="api-management" documentationCenter="" title="" authors="steved0x" solutions="" manager="dwrede" editor=""/>

<tags ms.service="api-management" ms.workload="mobile" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/18/2014" ms.author="sdanie" />

# Azure API Management Policy Reference

This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management][].

-	[Access restriction policies][]
	-	[Usage quota][] - Allows you to enforce a renewable or lifetime call volume and / or bandwidth quota.
	-	[Rate limit][] - Prevents API usage spikes by limiting calls and/or the bandwidth consumption rate.
	-	[Caller IP restriction][] - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
	-	[Check header][] - Enforces existence and/or value of a HTTP Header.
-	[Content transformation policies][]
	-	[Set HTTP header][] - Assigns a value to an existing response and/or request header or adds a new response and/or request header.
	-	[Convert XML to JSON][] - Converts request or response body from XML to either "JSON" or "XML faithful" form of JSON.
	-	[Replace string in body][] - Finds a request or response substring and replaces it with a different substring.
	-	[Set query string parameter][] - Adds, replaces value of, or deletes request query string parameter.
-	[Caching policies][]
	-	[Store to cache][] - Cache response according to the specified cache configuration.
	-	[Get from cache][] - Perform cache look up and return a valid cached response when available.
-	[Other policies][]
	-	[Rewrite URI][] - Converts a request URL from its public form to the form expected by the the web service.
	-	[Mask URLS in content][] - Re-writes (masks) links in the response body and in the location header so that they point to the equivalent link via the proxy.
	-	[Allow cross-domain calls][] - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
	-	[JSONP][] - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.
	-	[CORS][] - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.


## <a name="access-restriction-policies"> </a> Access restriction policies

-	[Usage quota][] - Allows you to enforce a renewable or lifetime call volume and / or bandwidth quota.
-	[Rate limit][] - Prevents API usage spikes by limiting calls and/or the bandwidth consumption rate.
-	[Caller IP restriction][] - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
-	[Check header][] - Enforces existence and/or value of a HTTP Header.

### <a name="usage-quota"> </a> Usage quota

**Description:**
Enforce a renewable or lifetime call volume and / or bandwidth quota.

**Policy Statement:**

	<quota calls="number" bandwidth="kilobytes" renewal-period="seconds">
	    <api name="name" calls="number" bandwidth="kilobytes">
	        <operation name="name" calls="number" bandwidth="kilobytes" />
	    </api>
	</quota>


**Example:**

	<policies>
		<inbound>
			<base />
			<quota calls="10000" bandwidth="40000" renewal-period="3600" />
		</inbound>
		<outbound>
			<base />
		</outbound>
	</policies>

**Where it can be applied:**
Used in the inbound section at Product scope.

**Where it can be applied:**
When the usage of the operations and/or APIs should be limited for a product.

**Why it should be applied, why not:**
To define usage limits for a product based on time and bandwidth. When an API reaches the defined quota limit, subsequent calls are rejected with an error message. Quotas are typically defined as the number of request messages that are permitted over the course of a predefined time interval and bandwidth limit.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>quota calls="number"</td>
  <td>The maximum number of subscription calls that are permitted over the course of the renewal-period (ie. 10000)</td>
</tr>
<tr>
  <td>bandwidth="kilobytes"</td>
  <td>The maximum number of kilobytes allow for consumption for this product, API, or operation over the specified renewal-period (ie. 40000).</td>
</tr>
<tr>
  <td>renewal-period="seconds"</td>
  <td>The time period in seconds during which the quota applies (ie.3600).</td>
</tr>
<tr>
  <td>api name="name"</td>
  <td>The name of the API call, for which the quota applies.</td>
</tr>
<tr>
  <td>calls="number"</td>
  <td>The maximum number of calls to the API or Operation, which can be made for the specified renewal-period (ie. 5000).</td>
</tr>
<tr>
  <td>operation name="name"</td>
  <td>The name of the operation for which the quota applies.</td>
</tr>
</tbody>
</table>

### <a name="rate-limit"> </a> Rate limit

**Description:**
Arrests API usage spikes by limiting the rate of requests flowing to an API and optionally a specific API operation. When policy is triggered consumer receives <code>429 Too Many Requests</code> response status code.

**Policy Statement:**

	<rate-limit calls="number" renewal-period="seconds">
    	<api name="name" calls="number" renewal-period="seconds">
    		<operation name="name" calls="number" renewal-period="seconds" />
    	</api>
    </rate-limit>

**Example:**

	<policies>
		<inbound>
			<base />
			<rate-limit calls="20" renewal-period="90" />
		</inbound>
		<outbound>
			<base />        
		</outbound>
	</policies>


**Where it can be applied:**
Use in the inbound section at a product scope.

<table>
<thead>
<tr>
  <th>Element/Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>calls="number"</td>
  <td>permitted number of calls per renewal period</td>
</tr>
<tr>
  <td>renewal-period="seconds"</td>
  <td>time period after which rate limit call quota renews</td>
</tr>
<tr>
  <td>api name="name"</td>
  <td>API name rate limit applies to</td>
</tr>
<tr>
  <td>operation name="name"</td>
  <td>Operation name rate limit applies to</td>
</tr>
</tbody>
</table>

### <a name="caller-ip-restriction"> </a> Caller IP restriction

**Description:**
Filters (allows/denies) calls from specific IP addresses and/or address ranges.

**Policy Statement:**

	<ip-filter action="allow | forbid">
        <address>address</address>
        <address-range from="address" to="address" />
    </ip-filter>

**Example:**

	<ip-filter action="allow | forbid">
        <address>address</address>
        <address-range from="address" to="address" />
    </ip-filter>

**Where it can be applied:**
Use in the inbound section in any scope.

**When it should be applied:**
Use this policy when specific control over who can access your service is required. 

**Why it should be applied, why not:**
This policy is only required when tight control over access is required (e.g. for services with high-security requirements) on a per host or range of hosts basis.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>ip-filter action="allow | forbid"</td>
  <td>Specifies whether calls should be allowed or not for the specified address(es).</td>
</tr>
<tr>
  <td>address="address"</td>
  <td>One or more IP addresses to allow or deny access for.</td>
</tr>
<tr>
  <td>address-range from="address" to="address"</td>
  <td>A range of IP addresses to allow or deny access for.</td>
</tr>
</tbody>
</table>

### <a name="check-header"> </a> Check header

**Description:**
Enforces existence and/or value of a HTTP Header. User can specify HTTP Status Code and Error Message to return if the header does not exist or contains an invalid value. 

**Policy Statement:**

	<check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="True">
  		<value>Value1</value>
  		<value>Value2</value>
	</check-header> 


**Example:**

	<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
  		<value>f6dc69a089844cf6b2019bae6d36fac8</value>
	</check-header> 


**Where it can be applied:**
Used in the inbound section in any scope.

**When it should be applied:**
When user wants to enforce existence and value of an HTTP Header.

**Why it should be applied, why not:**
If the user’s back-end requires certain HTTP headers to be set, or the user wants to authenticate the client by requiring the presence of additional headers.

<table>
<thead>
<tr>
  <th>Element/Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>

<tr>
  <td><origin>header-name="name"</origin></td>
  <td>The name of the HTTP Header to check.</td>
</tr>
<tr>
  <td><origin>failed-check-httpcode="status-code"</origin></td>
  <td>HTTP Status code to return if the header doesn't exist or has an invalid value.</td>
</tr>
<tr>
  <td><origin>failed-check-error-message="message"</origin></td>
  <td>Error message to return in HTTP response body if the header doesn't exist or has an invalid value.</td>
</tr>
<tr>
  <td><origin>value</origin></td>
  <td>An acceptable value for the HTTP Header. May occur zero or more times. When multiple elements are specified and as long as one value matches, then the check is considered a success.</td>
</tr>
<tr>
  <td>ignore-case</td>
  <td>Can be set to True or False. If set to True case is ignored when the header value is compared against the set of acceptable values.</td>
</tr>
</tbody>
</table>

## <a name="content-transformation-policies"> </a> Content transformation policies

-	[Set HTTP header][] - Assigns a value to an existing response and/or request header or adds a new response and/or request header.
-	[Convert XML to JSON][] - Converts request or response body from XML to either "JSON" or "XML faithful" form of JSON.
-	[Replace string in body][] - Finds a request or response substring and replaces it with a different substring.
-	[Set query string parameter][] - Adds, replaces value of, or deletes request query string parameter.

### <a name="set-http-header"> </a> Set HTTP header

**Description:**
Assigns a value to an existing response and/or request header or adds a new response and/or request header.

Inserts a list of HTTP headers into an HTTP message. When placed in an inbound pipeline, this policy sets the HTTP headers for the request being passed to the target service. When placed in an outbound pipeline, this policy sets the HTTP headers for the response being sent to the proxy’s client.

**Policy Statement:**

	<set-header name="header name" exists-action="override | skip | append | delete">
	    <value>value</value> <!--for multiple headers with the same name add additional value elements-->
	</set-header>


**Example:**

	<set-header exists-action="override">
        <header name="some value to set" exists-action="override">
        <value>20</value> 
        </header>
    </set-header>


**Where it can be applied:**
Use in the inbound and outbound sections at any scope, other than *Publisher*.

**When it should be applied:**
Use for specifying the operating parameters and/or return values of an HTTP transaction.

**Why it should be applied, why not:**
Most HTTP requests and many responses require headers to specify input/response parameters. So this policy is likely to be applicable to almost all of your services. 

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>reconcile-action="override|skip|append"</td>
  <td>Specifies the action to take when a header is already specified. Note: when set to "override" enlisting multiple entries with the same name results in the header being set according to all entries (which will be listed multiple times); only listed values will be set in the result.</td>
</tr>
<tr>
  <td>header name="header name"</td>
  <td>Specifies name of the header to be set. Required.</td>
</tr>
<tr>
  <td>exists-action="override | skip | append"</td>
  <td>Specifies what action to take when the header is already specified</td>
</tr>
<tr>
  <td>value="value"</td>
  <td>Specifies the value of the header to be set.</td>
</tr>
</tbody>
</table>

### <a name="convert-xml-to-json"> </a> Convert XML to JSON

**Description:**
Converts request or response body from XML to JSON.

**Policy Statement:**

	<xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>

**Example:**


	<policies>
		<inbound>
			<base />
		</inbound>
		<outbound>
			<base />
			<xml-to-json kind="direct" apply="always" consider-accept-header="false" />
		</outbound>
	</policies>


**Where it can be applied:**
Use in the inbound or outbound sections at API or operation scopes.

**Why it should be applied, why not:**
To modernize APIs based on XML-only backend web services.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>kind="javascript-friendly | direct</td>
  <td>Converted JSON has a form friendly to JavaScript developers | converted JSON reflects original XML document's structure</td>
</tr>
<tr>
  <td>apply= always | content-type-xml</td>
  <td>Convert always | Convert only if <code>Content-Type</code> header indicates presence of XML</td>
</tr>
<tr>
  <td>consider-accept-header="true | false"</td>
  <td>Apply conversion based on the value of <code>Accept</code> header | Convert always</td>
</tr>
</tbody>
</table>

### <a name="replace-string-in-body"> </a> Replace string in body

**Description:**
Finds a substring in the request or in the response and replaces it with a different string.

**Policy Statement:**

	<find-and-replace from="what to replace" to="replacement" />

**Example:**

	<find-and-replace from="notebook" to="laptop" />


**Where it can be applied:**
Use in the inbound and outbound sections at any scope.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>from="what to replace"</td>
  <td>The string to search for.</td>
</tr>
<tr>
  <td>to="replacement"</td>
  <td>The string to put in place the one found above.</td>
</tr>
</tbody>
</table>

### <a name="set-query-string-parameter"> </a> Set query string parameter

**Description:**
Adds, replaces value of, or deletes request query string parameter.

**Policy Statement:**

	<set-query-parameter name="param name" exists-action="override | skip | append | delete">
	    <value>value</value> <!--for multiple parameters with the same name add additional value elements-->
	</set-query-parameter>


**Example:**

	<policies>
		<inbound>
			<base />
			<set-query-parameter>
				<parameter name="api-key" exists-action="skip">
 					<value>12345678901</value>
        		</parameter>
    			<!-- for multiple parameters with the same name add additional value elements -->
    		</set-query-parameter>
  		</inbound>
  		<outbound>
			<base />
    	</outbound>
	</policies>

**Where it can be applied:**
Can be used in the inbound section at any scope.

**Why it should be applied, why not:**
Use to pass query parameters expected by the backend service which are optional or never present in the request.

<table>
<thead>
<tr>
  <th>Element/Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>name="name"</td>
  <td>a string naming the parameter</td>
</tr>
<tr>
  <td>exists-action="override"</td>
  <td>replaces the value of the of the parameter, if present in the request</td>
</tr>
<tr>
  <td>exists-action="skip"</td>
  <td>does nothing if the parameter is present in the request</td>
</tr>
<tr>
  <td>exists-action="append"</td>
  <td>appends value to the existing request parameter</td>
</tr>
<tr>
  <td>exists-action="delete"</td>
  <td>removes parameter from the request*</td>
</tr>
<tr>
  <td>value="value"</td>
  <td>sets value of the parameter in the enclosing element</td>
</tr>
</tbody>
</table>

## <a name="caching-policies"> </a> Caching policies

-	[Store to cache][] - Cache response according to the specified cache configuration.
-	[Get from cache][] - Perform cache look up and return a valid cached response when available.

### <a name="store-to-cache"> </a> Store to cache

**Description:**
Caches responses according to the specified cache settings. Must have a corresponding [Get From cache][] policy.

**Policy Statement:** 

	<cache-store duration="seconds" caching-mode="cache-on | do-not-cache" />

**Example:**

	<policies>
		<inbound>
       		<base />
		      <cache-lookup vary-by-developer="true | false" vary-by-developer-groups="true | false" downstream-caching-type="none | private | public" must-revalidate="true | false">
    				<vary-by-query-parameter>parameter name</vary-by-query-parameter> <!-- optional, can repeated several times -->
   			</cache-lookup>
       	</inbound>
 		<outbound>
	     	<base />
				<cache-store duration="3600" caching-mode="cache-on" />
   		</outbound>
	</policies>

**Where it can be applied:**
Can be present in the outbound section at either one of or both API and operation scopes.

**When it should be applied:**
Should be applied in cases where response content remains static over a period of time.

**Why it should be applied, why not:**
Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

<table>
<thead>
<tr>
  <th>Element/Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>seconds</td>
  <td>Time-to-live of the cached entries (in seconds, default=3600)</td>
</tr>
<tr>
  <td>cache-on | do-not-cache</td>
  <td>Responses are cached | Responses are not cached and cache-related headers are set to forbid downstream caching</td>
</tr>
</tbody>
</table>

### <a name="get-from-cache"> </a> Get from cache

**Description:**
Performs cache lookup and returns a valid cached response, when available. Appropriately responds to cache validation requests from API consumers. Must have a corresponding [Store To cache][] policy.

**Policy Statement:** 

	<cache-lookup vary-by-developer="true | false" vary-by-developer-groups="true | false" downstream-caching-type="none | private | public" must-revalidate="true | false">
    	<vary-by-header>header name</vary-by-header> <!-- optional, can repeated several times -->
   		<vary-by-query-parameter>parameter name</vary-by-query-parameter> <!-- optional, can repeated several times -->
    </cache-lookup>

**Example:**

	<policies>
      	<inbound>
      		<base />
	    	<cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="none" must-revalidate="true">
      			<vary-by-query-parameter>version</vary-by-query-parameter>
      		</cache-lookup>		 	
		</inbound>
 		<outbound>
 			<cache-store duration="seconds" caching-mode="cache-on | do-not-cache" />
			<base /> 		
 		</outbound>
	</policies>

**Where it can be applied:**
Can be present in the inbound section at either one of or both API and operation scopes.

**When it should be applied:**
Should be applied in cases where response content remains static over a period of time.

**Why it should be applied, why not:**
Response caching reduces bandwidth and processing requirements imposed on the backend web server and lowers latency perceived by API consumers.

<table>
<thead>
<tr>
  <th>Element/Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>vary-by-developer="true | false"</td>
  <td>Set to *true* to start caching responses per developer key; *false* set by default</td>
</tr>
<tr>
  <td>vary-by-developer-groups="true | false"</td>
  <td>Set to *true* to start caching responses per user role; *false* set by default</td>
</tr>
<tr>
  <td>downstream-caching-type="none | private | public"</td>
  <td>*none* - downstream caching is not allowed; set by default | *private* - downstream private caching is permitted |
   *public* - private and shared downstream caching is permitted.</td>
</tr>
<tr>
  <td>vary-by-header: "header name"</td>
  <td>Start caching responses per value of specified header e.g., <code>Accept | Accept-Charset | Accept-Encoding | Accept-Language | Authorization | Expect | From | Host | If-Match</code>  </td>
</tr>
<tr>
  <td>vary-by-query-parameter: "parameter name"</td>
  <td>Start caching responses per value of specified query parameters. Enter a single or multiple parameters. Use semicolon as a separator. If none specified, all query parameters are used.</td>
</tr>
<tr>
	<td>must-revalidate="true | false"</td>
	<td>When downstream caching is enabled this attribute turns on or off "must-revalidate" cache control directive in proxy responses.</td>
</tr>
</tbody>
</table>

## <a name="other-policies"> </a> Other policies

-	[Rewrite URI][] - Converts a request URL from its public form to the form expected by the the web service.
-	[Mask URLS in content][] - Re-writes (masks) links in the response body and in the location header so that they point to the equivalent link via the proxy.
-	[Allow cross-domain calls][] - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
-	[JSONP][] - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.
-	[CORS][] - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.

### <a name="rewrite-uri"> </a> Rewrite URI

**Description:**
Convert a request URL from its public form to the form expected by the the web service.

**Public URL:** http://api.example.com/storenumber/ordernumber

**Request URL:** http://api.example.com/v2/US/hardware/storenumber&ordernumber?City&State.

Do not add extra template path parameter in the rewrite URL. You can only add query string parameters.

**Policy Statement:**

	<rewrite-uri template="uri template" />

**Example:**


	<policies>
		<inbound>
			<base />
			<rewrite-uri template="/v2/US/hardware/{storenumber}&{ordernumber}?City=city&State=state" />
		</inbound>
		<outbound>
			<base />
		</outbound>
	</policies>


**Where it can be applied:**
In the inbound section at Operation scope only.

**When it should be applied:**
Use when a human and/or browser-friendly URL should be transformed into the URL format expected by the web service.

**Why it should be applied, why not:**
This only needs to be applied when exposing an alternative URL format. Clean URLs, RESTful URLs, user-friendly URLs or SEO-friendly URLs are purely structural URLs that do not contain a query string and instead contain only the path of the resource (after the scheme and the authority). This is often done for aesthetic, usability, or search engine optimization (SEO) purposes.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>template="uri template"</td>
  <td>actual web service URL with any query string parameters</td>
</tr>

</tbody>
</table>

### <a name="mask-urls-in-content"> </a> Mask URLS in content

**Description:**
Re-writes (masks) links in the response body and in the location header so that they point to the equivalent link via the proxy.

**Policy Statement:**

	<redirect-body-urls />

**Example:**

	<redirect-body-urls />


**Where it can be applied:**
Apply at the *API* and *Operation* scopes. Can be applied in either the inbound and outbound section.

### <a name="allow-cross-domain-calls"> </a> Allow cross-domain calls

**Description:**
Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.

**Policy Statement:**

	<cross-domain />

**Example:**

	<cross-domain />


**Where it can be applied:**
Use in the inbound section at the *Publishers* scope.

### <a name="jsonp"> </a> JSONP

**Description:**
Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients. JSONP is a method used in JavaScript programs to request data from a server in a different domain. JSONP bypasses the limitation enforced by most web browsers where access to web pages must be in the same domain.

**Policy Statement:**

	<jsonp callback-parameter-name="callback function name" />

**Example:**

 	<jsonp callback-parameter-name="cb" />

If you call the method without the callback parameter `?cb=XXX` it will return plain JSON (without a function call wrapper).

If you add the callback parameter `?cb=XXX` it will return a JSONP result, wrapping the original JSON results around the callback function like `XXX('<json result goes here>')`;


**Where it can be applied:**
Use in the outbound section only.

**When it should be applied:**
To request data from a server in a different domain.

<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td>callback-parameter-name</td>
  <td>The cross-domain JavaScript function call prefixed with the fully qualified domain name where the function resides.</td>
</tr>
</tbody>
</table>

### <a name="cors"> </a> CORS

**Description:**
Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients. 

CORS allows a browser and a server to interact and determine whether or not to allow specific cross-origin requests (i.e. XMLHttpRequests calls made from JavaScript on a web page to other domains). This allows for more flexibility than only allowing same-origin requests, but is more secure than allowing all cross-origin requests.

**Policy Statement:**

	 <cors>
        <allowed-origins>
            <origin>*</origin> <!-- allow any -->
            <!-- OR a list of one or more specific URIs (case-sensitive) -->
            <origin>URI</origin> <!-- URI must include scheme, host, and port. If port is omitted, 80 is assumed for http and 443 is assumed for https. -->
        </allowed-origins>
     </cors>

**Example:**

 	<cors>
        <allowed-origins>
            <origin>*</origin> <!-- allow any -->
            <!-- OR a list of one or more specific URIs (case-sensitive) -->
            <origin>http://contoso.com:81</origin> <!-- URI must include scheme, host, and port. If port is omitted, 80 is assumed for http and 443 is assumed for https. -->
        </allowed-origins>
    </cors>

The above is all you need to support simple CORS requests. However to support pre-flight requests (those with custom headers or methods other than GET and POST) you’ll need to add specific configuration for your supported HTTP methods and headers.

**Example:**

	<cors>
		<allowed-origins>
			<!-- Localhost useful for development -->
			<origin>http://localhost:8080/</origin>
			<origin>http://example.com/</origin>
		</allowed-origins>
		<allowed-methods>
			<method>GET</method>
			<method>POST</method>
			<method>PATCH</method>
			<method>DELETE</method>
		</allowed-methods>
		<allowed-headers>
			<!-- Examples below show Azure Mobile Services headers -->
			<header>x-zumo-installation-id</header>
			<header>x-zumo-application</header>
			<header>x-zumo-version</header>
			<header>x-zumo-auth</header>
			<header>content-type</header>
			<header>accept</header>
		</allowed-headers>
	</cors>

**Where it can be applied:**
Use in the inbound section and only in the *API* and *Operation* scopes.


<table>
<thead>
<tr>
  <th>Attribute</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><origin>*</origin></td>
  <td>Allow any, OR a list of one or more specific URIs</td>
</tr>
<tr>
  <td><origin>URI</origin></td>
  <td>The URI must include a scheme, host, and port. If the port is omitted, port 80 is assumed for http and 443 is assumed for https.</td>
</tr>
</tbody>
</table>

[Policies in API Management]: ../api-management-howto-policies

[Access restriction policies]: #access-restriction-policies
[Usage quota]: #usage-quota
[Rate limit]: #rate-limit
[Caller IP restriction]: #caller-ip-restriction
[Check header]: #check-header

[Content transformation policies]: #content-transformation-policies
[Set HTTP header]: #set-http-header
[Convert XML to JSON]: #convert-xml-to-json
[Replace string in body]: #replace-string-in-body
[Set query string parameter]: #set-query-string-parameter

[Caching policies]: #caching-policies
[Store to cache]: #store-to-cache
[Get from cache]: #get-from-cache

[Other policies]: #other-policies
[Rewrite URI]: #rewrite-uri
[Mask URLS in content]: #mask-urls-in-content
[Allow cross-domain calls]: #allow-cross-domain-calls
[JSONP]: #jsonp
[CORS]: #cors