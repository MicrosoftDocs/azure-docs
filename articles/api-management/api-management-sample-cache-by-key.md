<properties
	pageTitle="Custom caching in Azure API Management"
	description="Learn how to cache items by key in Azure API Management"
	services="api-management"
	documentationCenter=""
	authors="darrelmiller"
	manager=""
	editor=""/>

<tags
	ms.service="api-management"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="08/09/2016"
	ms.author="darrmi"/>

# Custom caching in Azure API Management
Azure API Management service has built-in support for [HTTP response caching](api-management-howto-cache.md) using the resource URL as the key. The key can be modified by request headers using the `vary-by` properties. This is useful for caching entire HTTP responses (aka representations), but sometimes it is useful to just cache a portion of a representation. The new [cache-lookup-value](https://msdn.microsoft.com/library/azure/dn894086.aspx#GetFromCacheByKey) and [cache-store-value](https://msdn.microsoft.com/library/azure/dn894086.aspx#StoreToCacheByKey) policies provide the ability to store and retrieve arbitrary pieces of data from within policy definitions. This ability also adds value to the previously introduced [send-request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendRequest) policy because you can now cache responses from external services.

## Architecture  
API Management service uses a shared per-tenant data cache so that, as you scale up to multiple units you will still get access to the same cached data. However, when working with a multi-region deployment there are independent caches within each of the regions. Due to this, it is important to not treat the cache as a data store, where it is the only source of some piece of information. If you did, and later decided to take advantage of the multi-region deployment, then customers with users that travel may lose access to that cached data.

## Fragment caching
There are certain cases where responses being returned contain some portion of data that is expensive to determine and yet remains fresh for a reasonable amount of time. As an example, consider a service built by an airline that provides information relating flight reservations, flight status, etc. If the user is a member of the airlines points program, they would also have information relating to their current status and mileage accumulated. This user-related information might be stored in a different system, but it may be desirable to include it in responses returned about flight status and reservations. This can be done using a process called fragment caching. The primary representation can be returned from the origin server using some kind of token to indicate where the user-related information is to be inserted. 

Consider the following JSON response from a backend API.


    {
      "airline" : "Air Canada",
      "flightno" : "871",
      "status" : "ontime",
      "gate" : "B40",
      "terminal" : "2A",
      "userprofile" : "$userprofile$"
    }  

And secondary resource at `/userprofile/{userid}` that looks like,

     { "username" : "Bob Smith", "Status" : "Gold" }

In order to determine the appropriate user information to include, we need to identify who the end user is. This mechanism is implementation dependent. As an example, I am using the `Subject` claim of a `JWT` token. 

    <set-variable
      name="enduserid"
      value="@(context.Request.Headers.GetValueOrDefault("Authorization","").Split(' ')[1].AsJwt()?.Subject)" />

We store this `enduserid` value in a context variable for later use. The next step is to determine if a previous request has already retrieved the user information and stored it in the cache. For this we use the `cache-lookup-value` policy.

	  <cache-lookup-value
      key="@("userprofile-" + context.Variables["enduserid"])"
      variable-name="userprofile" />

If there is no entry in the cache that corresponds to the key value, then no `userprofile` context variable will be created. We check the success of the lookup using the `choose` control flow policy.

    <choose>
        <when condition="@(!context.Variables.ContainsKey("userprofile"))">
            <!— If the userprofile context variable doesn’t exist, make an HTTP request to retrieve it.  -->
        </when>
    </choose>


If the `userprofile` context variable doesn’t exist, then we are going to have to make an HTTP request to retrieve it.

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

We use the `enduserid` to construct the URL to the user profile resource. Once we have the response, we can pull the body text out of the response and store it back into a context variable.

    <set-variable
        name="userprofile"
        value="@(((IResponse)context.Variables["userprofileresponse"]).Body.As<string>())" />

To avoid us having to make this HTTP request again, when the same user makes another request, we can store the user profile in the cache.

	<cache-store-value
        key="@("userprofile-" + context.Variables["enduserid"])"
        value="@((string)context.Variables["userprofile"])" duration="100000" />

We store the value in the cache using the exact same key that we originally attempted to retrieve it with. The duration that we choose to store the value should be based on how often the information changes and how tolerant users are to out of date information. 

It is important to realize that retrieving from the cache is still an out-of-process, network request and potentially can still add tens of milliseconds to the request. The benefits come when determining the user profile information takes significantly longer than that due to needing to do database queries or aggregate information from multiple back-ends.

The final step in the process is to update the returned response with our user profile information.

    <!—Update response body with user profile-->
    <find-and-replace
        from='"$userprofile$"'
        to="@((string)context.Variables["userprofile"])" />

I chose to include the quotation marks as part of the token so that even when the replace doesn’t occur, the response was still valid JSON. This was primarily to make debugging easier.

Once you combine all these steps together, the end result is a policy that looks like the following one.

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

    		<!-- If we don’t find it in the cache, make a request for it and store it -->
    		<choose>
    			<when condition="@(!context.Variables.ContainsKey("userprofile"))">
    				<!—Make HTTP request to get user profile -->
    				<send-request
                      mode="new"
                      response-variable-name="userprofileresponse"
                      timeout="10"
                      ignore-error="true">

                       <!-- Build a URL that points to the profile for the current end-user -->
    					<set-url>@(new Uri(new Uri("https://apimairlineapi.azurewebsites.net/UserProfile/"),(string)context.Variables["enduserid"]).AbsoluteUri)</set-url>
    					<set-method>GET</set-method>
    				</send-request>

    				<!—Store response body in context variable -->
    				<set-variable
                      name="userprofile"
                      value="@(((IResponse)context.Variables["userprofileresponse"]).Body.As<string>())" />

    				<!—Store result in cache -->
    				<cache-store-value
                      key="@("userprofile-" + context.Variables["enduserid"])"
                      value="@((string)context.Variables["userprofile"])"
                      duration="100000" />
    			</when>
    		</choose>
    		<base />
    	</inbound>
    	<outbound>
    		<!—Update response body with user profile-->
    		<find-and-replace
                  from='"$userprofile$"'
                  to="@((string)context.Variables["userprofile"])" />
    		<base />
    	</outbound>
     </policies>

This caching approach is primarily used in web sites where HTML is composed on the server side so that it can be rendered as a single page. However, it can also be useful in APIs where clients cannot do client side HTTP caching or it is desirable not to put that responsibility on the client.

This same kind of fragment caching can also be done on the backend web servers using a Redis caching server, however, using the API Management service to perform this work is useful when the cached fragments are coming from different back-ends than the primary responses.

## Transparent versioning
It is common practice for multiple different implementation versions of an API to be supported at any one time. This is perhaps to support different environments, like dev, test, production, etc, or it may be to support older versions of the API to give time for API consumers to migrate to newer versions. 

One approach to handling this instead of requiring client developers to change the URLs from `/v1/customers` to `/v2/customers` is to store in the consumer’s profile data which version of the API they currently wish to use and call the appropriate backend URL. In order to determine the correct backend URL to call for a particular client, it is necessary to query some configuration data. By caching this configuration data, we can minimize the performance penalty of doing this lookup.

The first step is to determine the identifier used to configure the desired version. In this example, I chose to associate the version to the product subscription key. 

		<set-variable name="clientid" value="@(context.Subscription.Key)" />

We then do a cache lookup to see if we already have retrieved the desired client version.

		<cache-lookup-value
        key="@("clientversion-" + context.Variables["clientid"])"
        variable-name="clientversion" />

Then we check to see if we did not find it in the cache.

	<choose>
		<when condition="@(!context.Variables.ContainsKey("clientversion"))">

If we didn’t then we go and retrieve it.

	<send-request
        mode="new"
        response-variable-name="clientconfiguresponse"
        timeout="10"
        ignore-error="true">
        		<set-url>@(new Uri(new Uri(context.Api.ServiceUrl.ToString() + "api/ClientConfig/"),(string)context.Variables["clientid"]).AbsoluteUri)</set-url>
        		<set-method>GET</set-method>
	</send-request>

Extract the response body text from the response.

    <set-variable
          name="clientversion"
          value="@(((IResponse)context.Variables["clientconfiguresponse"]).Body.As<string>())" />

Store it back in the cache for future use.

    <cache-store-value
          key="@("clientversion-" + context.Variables["clientid"])"
          value="@((string)context.Variables["clientversion"])"
          duration="100000" />

And finally update the back-end URL to select the version of the service desired by the client.

	<set-backend-service
          base-url="@(context.Api.ServiceUrl.ToString() + "api/" + (string)context.Variables["clientversion"] + "/")" />

The completely policy is as follows.

	 <inbound>
		<base />
		<set-variable name="clientid" value="@(context.Subscription.Key)" />
		<cache-lookup-value key="@("clientversion-" + context.Variables["clientid"])" variable-name="clientversion" />

		<!-- If we don’t find it in the cache, make a request for it and store it -->
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


Enabling API consumers to transparently control which backend version is being accessed by clients without having to update and redeploy clients is a elegant solution that addresses many API versioning concerns.

## Tenant Isolation

In larger, multi-tenant deployments some companies create separate groups of tenants on distinct deployments of backend hardware. This minimizes the number of customers who are impacted by a hardware issue on the backend. It also enables new software versions to be rolled out in stages. Ideally this backend architecture should be transparent to API consumers. This can be achieved in a similar way to transparent versioning because it is based on the same technique of manipulating the backend URL using configuration state per API key.  

Instead of returning a preferred version of the API for each subscription key, you would return an identifier that relates a tenant to the assigned hardware group. That identifier can be used to construct the appropriate backend URL.

## Summary
The freedom to use the Azure API management cache for storing any kind of data enables efficient access to configuration data that can affect the way an inbound request is processed. It can also be used to store data fragments that can augment responses, returned from a backend API.

## Next steps
Please give us your feedback in the Disqus thread for this topic if there are other scenarios that these policies have enabled for you, or if there are scenarios you would like to achieve but do not feel are currently possible.
