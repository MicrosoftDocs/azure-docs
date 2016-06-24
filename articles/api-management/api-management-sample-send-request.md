<properties
	pageTitle="Using API Management service to generate HTTP requests"
	description="Learn to use request and response policies in API Management to call external services from your API"
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
	ms.date="05/25/2016"
	ms.author="v-darmi"/>


# Using external services from the Azure API Management service

The policies available in Azure API Management service can do a wide range of useful work based purely on the incoming request, the outgoing response and basic configuration information. However, being able to interact with external services from API Management policies opens up many more opportunities.

We have previously seen how we can interact with the [Azure Event Hub service for logging, monitoring and analytics](api-management-log-to-eventhub-sample.md). In this article we will demonstrate policies that allow you to interact with any external HTTP based service. These policies can be used for triggering remote events or for retrieving information that will be used to manipulate the original request and response in some way.

## Send-One-Way-Request
Possibly the simplest external interaction is the fire-and-forget style of request that allows an external service to be notified of some kind of important event. We can use the control flow policy `choose` to detect any kind of condition that we are interested in and then, if the condition is satisfied, we can make an external HTTP request using the [send-one-way-request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendOneWayRequest) policy. This could be a request to a messaging system like Hipchat or Slack, or a mail API like SendGrid or MailChimp, or for critical support incidents something like PagerDuty. All of these messaging systems have simple HTTP APIs that we can easily invoke.

### Alerting with Slack
The following example demonstrates how to send a message to a Slack chat room if the HTTP response status code is greater than or equal to 500. A 500 range error indicates a problem with our backend API that the client of our API cannot resolve themselves. It usually requires some kind of intervention on our part.  

    <choose>
        <when condition="@(context.Response.StatusCode >= 500)">
          <send-one-way-request mode="new">
            <set-url>https://hooks.slack.com/services/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</set-url>
            <set-method>POST</set-method>
            <set-body>@{
                    return new JObject(
                            new JProperty("username","APIM Alert"),
                            new JProperty("icon_emoji", ":ghost:"),
                            new JProperty("text", String.Format("{0} {1}\nHost: {2}\n{3} {4}\n User: {5}",
                                                    context.Request.Method,
                                                    context.Request.Url.Path + context.Request.Url.QueryString,
                                                    context.Request.Url.Host,
                                                    context.Response.StatusCode,
                                                    context.Response.StatusReason,
                                                    context.User.Email
                                                    ))
                            ).ToString();
                }</set-body>
          </send-one-way-request>
        </when>
    </choose>

Slack has the notion of inbound web hooks. When configuring an inbound web hook, Slack generates a special URL which allows you to do a simple POST request and to pass a message into the Slack channel. The JSON body that we create is based on a format defined by Slack.

![Slack Web Hook](./media/api-management-sample-send-request/api-management-slack-webhook.png)

### Is fire and forget good enough?
There are certain tradeoffs when using a fire-and-forget style of request. If for some reason, the request fails, then the failure will not be reported. In this particular situation, the complexity of having a secondary failure reporting system and the additional performance cost of waiting for the response is not warranted. For scenarios where it is essential to check the response, then the [send-request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendRequest) policy is a better option.

## Send-Request
The `send-request` policy enables using an external service to perform complex processing functions and return data to the API management service that can be used for further policy processing.

### Authorizing reference tokens
A major function of API Management is protecting backend resources. If the authorization server used by your API creates [JWT tokens](http://jwt.io/) as part of its OAuth2 flow, as [Azure Active Directory](../active-directory/active-directory-aadconnect.md) does, then you can use the `validate-jwt` policy to verify the validity of the token. However, some authorization servers create what are called [reference tokens](http://leastprivilege.com/2015/11/25/reference-tokens-and-introspection/) that cannot be verified without making a call back to the authorization server.

### Standardized introspection
In the past there has been no standardized way of verifying a reference token with an authorization server. However a recently proposed standard [RFC 7662](https://tools.ietf.org/html/rfc7662) was published by the IETF that defines how a resource server can verify the validity of a token.

### Extracting the token
The first step is to extract the token from the Authorization header. The header value should be formatted with the `Bearer` authorization scheme, a single space and then the authorization token as per [RFC 6750](http://tools.ietf.org/html/rfc6750#section-2.1). Unfortunately there are cases where the authorization scheme is omitted. To account for this when parsing, we split the header value on a space and select the last string from the returned array of strings. This provides a workaround for badly formatted authorization headers.

    <set-variable name="token" value="@(context.Request.Headers.GetValueOrDefault("Authorization","scheme param").Split(' ').Last())" />

### Making the validation request
Once we have the authorization token, we can make the request to validate the token. RFC 7662 calls this process introspection and requires that you `POST` a HTML form to the introspection resource. The HTML form must at least contain a key/value pair with the key `token`. This request to the authorization server must also be authenticated to ensure that malicious clients cannot go trawling for valid tokens.

    <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
      <set-url>https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection</set-url>
      <set-method>POST</set-method>
      <set-header name="Authorization" exists-action="override">
        <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
      </set-header>
      <set-header name="Content-Type" exists-action="override">
        <value>application/x-www-form-urlencoded</value>
      </set-header>
      <set-body>@($"token={(string)context.Variables["token"]}")</set-body>
    </send-request>

### Checking the response
The `response-variable-name` attribute is used to give access the returned response. The name defined in this property can be used as a key into the `context.Variables` dictionary to access the `IResponse` object.

From the response object we can retrieve the body and RFC 7622 tells us that the response must be a JSON object and must contain at least a property called `active` that is a boolean value. When `active` is true then the token is considered valid.

### Reporting failure
We use a `<choose>` policy to detect if the token is invalid and if so, return a 401 response.

    <choose>
      <when condition="@((bool)((IResponse)context.Variables["tokenstate"]).Body.As<JObject>()["active"] == false)">
        <return-response response-variable-name="existing response variable">
          <set-status code="401" reason="Unauthorized" />
          <set-header name="WWW-Authenticate" exists-action="override">
            <value>Bearer error="invalid_token"</value>
          </set-header>
        </return-response>
      </when>
    </choose>

As per [RFC 6750](https://tools.ietf.org/html/rfc6750#section-3) which describes how `bearer` tokens should be used, we also return a `WWW-Authenticate` header with the 401 response. The WWW-Authenticate is intended to instruct a client on how to construct a properly authorized request. Due to the wide variety of approaches possible with the OAuth2 framework, it is difficult to communicate all the needed information. Fortunately there are efforts underway to help [clients discover how to properly authorize requests to a resource server](http://tools.ietf.org/html/draft-jones-oauth-discovery-00).

### Final solution
Putting all the pieces together, we get the following policy:

    <inbound>
      <!-- Extract Token from Authorization header parameter -->
      <set-variable name="token" value="@(context.Request.Headers.GetValueOrDefault("Authorization","scheme param").Split(' ').Last())" />

      <!-- Send request to Token Server to validate token (see RFC 7662) -->
      <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
        <set-url>https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection</set-url>
        <set-method>POST</set-method>
        <set-header name="Authorization" exists-action="override">
          <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
        </set-header>
        <set-header name="Content-Type" exists-action="override">
          <value>application/x-www-form-urlencoded</value>
        </set-header>
        <set-body>@($"token={(string)context.Variables["token"]}")</set-body>
      </send-request>

      <choose>
  			<!-- Check active property in response -->
  			<when condition="@((bool)((IResponse)context.Variables["tokenstate"]).Body.As<JObject>()["active"] == false)">
  				<!-- Return 401 Unauthorized with http-problem payload -->
  				<return-response response-variable-name="existing response variable">
  					<set-status code="401" reason="Unauthorized" />
  					<set-header name="WWW-Authenticate" exists-action="override">
  						<value>Bearer error="invalid_token"</value>
  					</set-header>
  				</return-response>
  			</when>
  		</choose>
      <base />
    </inbound>

This is only one of many examples of how the `send-request` policy can be used to integrate useful external services into the process of requests and responses flowing through the API Management service.

## Response Composition
The `send-request` policy can be used for enhancing a primary request to a backend system, as we saw in the previous example, or it can be used as a complete replace for of the backend call. Using this technique we can easily create composite resources that are aggregated from multiple different systems.

### Building a dashboard   
Sometimes you want to be able to expose information that exists in multiple backend systems, for example, to drive a dashboard. The KPIs come from all different back-ends, but you would prefer not to provide direct access to them and it would be nice if all the information could be retrieved in a single request. Perhaps some of the backend information needs some slicing and dicing and a little sanitizing first! Being able to cache that composite resource would be a useful to reduce the backend load as you know users have a habit of hammering the F5 key in order to see if their underperforming metrics might change.    

### Faking the resource
The first step to building our dashboard resource is to configure a new operation in the API Management publisher portal. This will be a placeholder operation used to configure our composition policy to build our dynamic resource.

![Dashboard operation](./media/api-management-sample-send-request/api-management-dashboard-operation.png)

### Making the requests
Once the `dashboard` operation has been created we can configure a policy specifically for that operation. 

![Dashboard operation](./media/api-management-sample-send-request/api-management-dashboard-policy.png)

The first step  is to extract any query parameters from the incoming request, so that we can forward them to our backend. In this example our dashboard is showing information based on a period of time an therefore has a `fromDate` and `toDate` parameter. We can use the `set-variable` policy to extract the information from the request URL.

    <set-variable name="fromDate" value="@(context.Request.Url.Query["fromDate"].Last())">
    <set-variable name="toDate" value="@(context.Request.Url.Query["toDate"].Last())">

Once we have this information we can make requests to all the backend systems. Each request constructs a new URL with the parameter information and calls its respective server and stores the response in a context variable.

    <send-request mode="new" response-variable-name="revenuedata" timeout="20" ignore-error="true">
      <set-url>@($"https://accounting.acme.com/salesdata?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
      <set-method>GET</set-method>
    </send-request>

    <send-request mode="new" response-variable-name="materialdata" timeout="20" ignore-error="true">
      <set-url>@($"https://inventory.acme.com/materiallevels?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
      <set-method>GET</set-method>
    </send-request>

    <send-request mode="new" response-variable-name="throughputdata" timeout="20" ignore-error="true">
    <set-url>@($"https://production.acme.com/throughput?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
      <set-method>GET</set-method>
    </send-request>

    <send-request mode="new" response-variable-name="accidentdata" timeout="20" ignore-error="true">
    <set-url>@($"https://production.acme.com/throughput?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
      <set-method>GET</set-method>
    </send-request>

These requests will execute in sequence, which is not ideal. In an upcoming release we will be introducing a new policy called `wait` that will enable all of these requests to execute in parallel.

### Responding

To construct the composite response we can use the [return-response](https://msdn.microsoft.com/library/azure/dn894085.aspx#ReturnResponse) policy. The `set-body` element can use an expression to construct a new `JObject` with all the component representations embedded as properties.

    <return-response response-variable-name="existing response variable">
      <set-status code="200" reason="OK" />
      <set-header name="Content-Type" exists-action="override">
        <value>application/json</value>
      </set-header>
      <set-body>
        @(new JObject(new JProperty("revenuedata",((IResponse)context.Variables["revenuedata"]).Body.As<JObject>()),
                      new JProperty("materialdata",((IResponse)context.Variables["materialdata"]).Body.As<JObject>()),
                      new JProperty("throughputdata",((IResponse)context.Variables["throughputdata"]).Body.As<JObject>()),
                      new JProperty("accidentdata",((IResponse)context.Variables["accidentdata"]).Body.As<JObject>())
                      ).ToString())
      </set-body>
    </return-response>

The complete policy looks as follows:

    <policies>
    	<inbound>

      <set-variable name="fromDate" value="@(context.Request.Url.Query["fromDate"].Last())">
      <set-variable name="toDate" value="@(context.Request.Url.Query["toDate"].Last())">

        <send-request mode="new" response-variable-name="revenuedata" timeout="20" ignore-error="true">
          <set-url>@($"https://accounting.acme.com/salesdata?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
          <set-method>GET</set-method>
        </send-request>

        <send-request mode="new" response-variable-name="materialdata" timeout="20" ignore-error="true">
          <set-url>@($"https://inventory.acme.com/materiallevels?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
          <set-method>GET</set-method>
        </send-request>

        <send-request mode="new" response-variable-name="throughputdata" timeout="20" ignore-error="true">
        <set-url>@($"https://production.acme.com/throughput?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
          <set-method>GET</set-method>
        </send-request>

        <send-request mode="new" response-variable-name="accidentdata" timeout="20" ignore-error="true">
        <set-url>@($"https://production.acme.com/throughput?from={(string)context.Variables["fromDate"]}&to={(string)context.Variables["fromDate"]}")"</set-url>
          <set-method>GET</set-method>
        </send-request>

        <return-response response-variable-name="existing response variable">
          <set-status code="200" reason="OK" />
          <set-header name="Content-Type" exists-action="override">
            <value>application/json</value>
          </set-header>
          <set-body>
            @(new JObject(new JProperty("revenuedata",((IResponse)context.Variables["revenuedata"]).Body.As<JObject>()),
                          new JProperty("materialdata",((IResponse)context.Variables["materialdata"]).Body.As<JObject>()),
                          new JProperty("throughputdata",((IResponse)context.Variables["throughputdata"]).Body.As<JObject>()),
                          new JProperty("accidentdata",((IResponse)context.Variables["accidentdata"]).Body.As<JObject>())
                          ).ToString())
          </set-body>
        </return-response>
    	</inbound>
    	<backend>
    		<base />
    	</backend>
    	<outbound>
    		<base />
    	</outbound>
    </policies>

In the configuration of the placeholder operation we can configure the dashboard resource to be cached for at least an hour because we understand the nature of the data means that even if it is an hour out of date, it will still be sufficiently effective to convey valuable information to the users.

## Summary
Azure API Management service provides flexible policies that can be selectively applied to HTTP traffic and enables composition of backend services. Whether you want to enhance your API gateway with alerting functions, verification, validation capabilities or create new composite resources based on multiple backend services, the `send-request` and related policies open a world of possibilities.

## Watch a video overview of these policies
For more information on the [send-one-way-request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendOneWayRequest), [send-request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendRequest), and [return-response](https://msdn.microsoft.com/library/azure/dn894085.aspx#ReturnResponse) policies covered in this article, please watch the following video.

> [AZURE.VIDEO send-request-and-return-response-policies]
