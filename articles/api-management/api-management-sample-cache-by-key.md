---
title: Custom caching in Azure API Management
description: Learn how to cache items by key in Azure API Management. You can modify the key by using request headers.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
ms.topic: how-to
ms.service: api-management
ms.date: 05/19/2022
ms.author: danlep

---
# Custom caching in Azure API Management
Azure API Management service has built-in support for [HTTP response caching](api-management-howto-cache.md) using the resource URL as the key. The key can be modified by request headers using the `vary-by` properties. This is useful for caching entire HTTP responses (also known as representations), but sometimes it's useful to just cache a portion of a representation. The [cache-lookup-value](cache-lookup-value-policy.md) and [cache-store-value](cache-store-value-policy.md) policies provide the ability to store and retrieve arbitrary pieces of data from within policy definitions. This ability also adds value to the [send-request](send-request-policy.md) policy because you can cache responses from external services.

## Architecture
API Management service uses a shared per-tenant internal data cache so that, as you scale up to multiple units, you still get access to the same cached data. However, when working with a multi-region deployment there are independent caches within each of the regions. It's important to not treat the cache as a data store, where it's the only source of some piece of information. If you did, and later decided to take advantage of the multi-region deployment, then customers with users that travel may lose access to that cached data.

> [!NOTE]
> The internal cache is not available in the **Consumption** tier of Azure API Management. You can [use an external Azure Cache for Redis](api-management-howto-cache-external.md) instead. An external cache allows for greater cache control and flexibility for API Management instances in all tiers.

## Fragment caching
There are certain cases where responses being returned contain some portion of data that is expensive to determine and yet remains fresh for a reasonable amount of time. As an example, consider a service built by an airline that provides information relating to flight reservations, flight status, and so on. If the user is a member of the airlines points program, they would also have information relating to their current status and accumulated mileage. This user-related information might be stored in a different system, but it may be desirable to include it in responses returned about flight status and reservations. This can be done using a process called fragment caching. The primary representation can be returned from the origin server using some kind of token to indicate where the user-related information is to be inserted. 

Consider the following JSON response from a backend API.

```json
{
  "airline" : "Air Canada",
  "flightno" : "871",
  "status" : "ontime",
  "gate" : "B40",
  "terminal" : "2A",
  "userprofile" : "$userprofile$"
}  
```

And secondary resource at `/userprofile/{userid}` that looks like,

```json
{ "username" : "Bob Smith", "Status" : "Gold" }
```

To determine the appropriate user information to include, API Management needs to identify who the end user is. This mechanism is implementation-dependent. The following example uses the `Subject` claim of a `JWT` token. 

```xml
<set-variable
  name="enduserid"
  value="@(context.Request.Headers.GetValueOrDefault("Authorization","").Split(' ')[1].AsJwt()?.Subject)" />
```

API Management stores the `enduserid` value in a context variable for later use. The next step is to determine if a previous request has already retrieved the user information and stored it in the cache. For this, API Management uses the `cache-lookup-value` policy.

```xml
<cache-lookup-value
key="@("userprofile-" + context.Variables["enduserid"])"
variable-name="userprofile" />
```

If there is no entry in the cache that corresponds to the key value, then no `userprofile` context variable is created. API Management checks the success of the lookup using the `choose` control flow policy.

```xml
<choose>
    <when condition="@(!context.Variables.ContainsKey("userprofile"))">
        <!-- If the userprofile context variable doesn’t exist, make an HTTP request to retrieve it.  -->
    </when>
</choose>
```

If the `userprofile` context variable doesn’t exist, then API Management is going to have to make an HTTP request to retrieve it.

```xml
<send-request
  mode="new"
  response-variable-name="userprofileresponse"
  timeout="10"
  ignore-error="true">

  <!-- Build a URL that points to the profile for the current end-user -->
  <set-url>@(new Uri(new Uri("https://apimairlineapi.azurewebsites.net/UserProfile/"),
      (string)context.Variables["enduserid"]).AbsoluteUri)
  </set-url>
  <set-method>GET</set-method>
</send-request>
```

API Management uses the `enduserid` to construct the URL to the user profile resource. Once API Management has the response, it pulls the body text out of the response and stores it back into a context variable.

```xml
<set-variable
    name="userprofile"
    value="@(((IResponse)context.Variables["userprofileresponse"]).Body.As<string>())" />
```

To avoid API Management from making this HTTP request again, when the same user makes another request, you can specify to store the user profile in the cache.

```xml
<cache-store-value
    key="@("userprofile-" + context.Variables["enduserid"])"
    value="@((string)context.Variables["userprofile"])" duration="100000" />
```

API Management stores the value in the cache using the same key that API Management originally attempted to retrieve it with. The duration that API Management chooses to store the value should be based on how often the information changes and how tolerant users are to out-of-date information. 

It is important to realize that retrieving from the cache is still an out-of-process network request and potentially can add tens of milliseconds to the request. The benefits come when determining the user profile information takes longer than that due to needing to do database queries or aggregate information from multiple back-ends.

The final step in the process is to update the returned response with the user profile information.

```xml
<!-- Update response body with user profile-->
<find-and-replace
    from='"$userprofile$"'
    to="@((string)context.Variables["userprofile"])" />
```

You can choose to include the quotation marks as part of the token so that even when the replacement doesn’t occur, the response is still a valid JSON.  

Once you combine these steps, the end result is a policy that looks like the following one.

```xml
<policies>
    <inbound>
        <!-- How you determine user identity is application dependent -->
        <set-variable
          name="enduserid"
          value="@(context.Request.Headers.GetValueOrDefault("Authorization","").Split(' ')[1].AsJwt()?.Subject)" />

        <!--Look for userprofile for this user in the cache -->
        <cache-lookup-value
          key="@("userprofile-" + context.Variables["enduserid"])"
          variable-name="userprofile" />

        <!-- If API Management doesn’t find it in the cache, make a request for it and store it -->
        <choose>
            <when condition="@(!context.Variables.ContainsKey("userprofile"))">
                <!-- Make HTTP request to get user profile -->
                <send-request
                  mode="new"
                  response-variable-name="userprofileresponse"
                  timeout="10"
                  ignore-error="true">

                   <!-- Build a URL that points to the profile for the current end-user -->
                    <set-url>@(new Uri(new Uri("https://apimairlineapi.azurewebsites.net/UserProfile/"),(string)context.Variables["enduserid"]).AbsoluteUri)</set-url>
                    <set-method>GET</set-method>
                </send-request>

                <!-- Store response body in context variable -->
                <set-variable
                  name="userprofile"
                  value="@(((IResponse)context.Variables["userprofileresponse"]).Body.As<string>())" />

                <!-- Store result in cache -->
                <cache-store-value
                  key="@("userprofile-" + context.Variables["enduserid"])"
                  value="@((string)context.Variables["userprofile"])"
                  duration="100000" />
            </when>
        </choose>
        <base />
    </inbound>
    <outbound>
        <!-- Update response body with user profile-->
        <find-and-replace
              from='"$userprofile$"'
              to="@((string)context.Variables["userprofile"])" />
        <base />
    </outbound>
</policies>
```

This caching approach is primarily used in websites where HTML is composed on the server side so that it can be rendered as a single page. It can also be useful in APIs where clients can't do client-side HTTP caching or it's desirable not to put that responsibility on the client.

This same kind of fragment caching can also be done on the backend web servers using a Redis caching server, however, using the API Management service to perform this work is useful when the cached fragments are coming from different back-ends than the primary responses.

## Transparent versioning
It's common practice for multiple different implementation versions of an API to be supported at any one time. For example, to support different environments (dev, test, production, etc.) or to support older versions of the API to give time for API consumers to migrate to newer versions. 

One approach to handling this, instead of requiring client developers to change the URLs from `/v1/customers` to `/v2/customers` is to store in the consumer’s profile data which version of the API they currently wish to use and call the appropriate backend URL. To determine the correct backend URL to call for a particular client, it's necessary to query some configuration data. By caching this configuration data, API Management can minimize the performance penalty of doing this lookup.

The first step is to determine the identifier used to configure the desired version. In this example, I chose to associate the version to the product subscription key. 

```xml
<set-variable name="clientid" value="@(context.Subscription.Key)" />
```

API Management then does a cache lookup to see whether it already retrieved the desired client version.

```xml
<cache-lookup-value
key="@("clientversion-" + context.Variables["clientid"])"
variable-name="clientversion" />
```

Then, API Management checks to see if it didn't find it in the cache.

```xml
<choose>
    <when condition="@(!context.Variables.ContainsKey("clientversion"))">
```

If API Management didn’t find it, API Management retrieves it.

```xml
<send-request
    mode="new"
    response-variable-name="clientconfiguresponse"
    timeout="10"
    ignore-error="true">
            <set-url>@(new Uri(new Uri(context.Api.ServiceUrl.ToString() + "api/ClientConfig/"),(string)context.Variables["clientid"]).AbsoluteUri)</set-url>
            <set-method>GET</set-method>
</send-request>
```

Extract the response body text from the response.

```xml
<set-variable
      name="clientversion"
      value="@(((IResponse)context.Variables["clientconfiguresponse"]).Body.As<string>())" />
```

Store it back in the cache for future use.

```xml
<cache-store-value
      key="@("clientversion-" + context.Variables["clientid"])"
      value="@((string)context.Variables["clientversion"])"
      duration="100000" />
```

And finally update the back-end URL to select the version of the service desired by the client.

```xml
<set-backend-service
      base-url="@(context.Api.ServiceUrl.ToString() + "api/" + (string)context.Variables["clientversion"] + "/")" />
```

The complete policy is as follows:

```xml
<inbound>
    <base />
    <set-variable name="clientid" value="@(context.Subscription.Key)" />
    <cache-lookup-value key="@("clientversion-" + context.Variables["clientid"])" variable-name="clientversion" />

    <!-- If API Management doesn’t find it in the cache, make a request for it and store it -->
    <choose>
        <when condition="@(!context.Variables.ContainsKey("clientversion"))">
            <send-request mode="new" response-variable-name="clientconfiguresponse" timeout="10" ignore-error="true">
                <set-url>@(new Uri(new Uri(context.Api.ServiceUrl.ToString() + "api/ClientConfig/"),(string)context.Variables["clientid"]).AbsoluteUri)</set-url>
                <set-method>GET</set-method>
            </send-request>
            <!-- Store response body in context variable -->
            <set-variable name="clientversion" value="@(((IResponse)context.Variables["clientconfiguresponse"]).Body.As<string>())" />
            <!-- Store result in cache -->
            <cache-store-value key="@("clientversion-" + context.Variables["clientid"])" value="@((string)context.Variables["clientversion"])" duration="100000" />
        </when>
    </choose>
    <set-backend-service base-url="@(context.Api.ServiceUrl.ToString() + "api/" + (string)context.Variables["clientversion"] + "/")" />
</inbound>
```

Enabling API consumers to transparently control which backend version is being accessed by clients without having to update and redeploy clients is an elegant solution that addresses many API versioning concerns.

## Tenant Isolation
In larger, multi-tenant deployments some companies create separate groups of tenants on distinct deployments of backend hardware. This minimizes the number of customers who are impacted by a hardware issue on the backend. It also enables new software versions to be rolled out in stages. Ideally this backend architecture should be transparent to API consumers. This can be achieved in a similar way to transparent versioning because it is based on the same technique of manipulating the backend URL using configuration state per API key.  

Instead of returning a preferred version of the API for each subscription key, you would return an identifier that relates a tenant to the assigned hardware group. That identifier can be used to construct the appropriate backend URL.

## Summary
The freedom to use the Azure API management cache for storing any kind of data enables efficient access to configuration data that can affect the way an inbound request is processed. It can also be used to store data fragments that can augment responses, returned from a backend API.
