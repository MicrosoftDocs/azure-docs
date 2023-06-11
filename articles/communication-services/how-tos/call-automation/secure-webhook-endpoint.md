---
title: Azure Communication Services Call Automation how-to for securing webhook endpoint 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on securing deliver the delivery of incoming call and callback event
author: fanche

ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 04/13/2023
ms.author: askaur
manager: jasha
ms.custom: public_preview
services: azure-communication-services
---

# How to secure webhook endpoint

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Securing the delivery of messages from end to end is crucial for ensuring the confidentiality, integrity, and trustworthiness of sensitive information transmitted between systems. Your ability and willingness to trust information received from a remote system relies on the sender providing their identity. Call Automation has two ways of communicating events that can be secured; the shared IncomingCall event sent by Azure Event Grid, and all other mid-call events sent by the Call Automation platform via webhook.

## Incoming Call Event
Azure Communication Services relies on Azure Event Grid subscriptions to deliver the [IncomingCall event](../../concepts/call-automation/incoming-call-notification.md). You can refer to the Azure Event Grid team for their [documentation about how to secure a webhook subscription](../../../event-grid/secure-webhook-delivery.md).

## Call Automation webhook events

[Call Automation events](../../concepts/call-automation/call-automation.md#call-automation-webhook-events) are sent to the webhook callback URI specified when you answer a call, or place a new outbound call. Your callback URI must be a public endpoint with a valid HTTPS certificate, DNS name, and IP address with the correct firewall ports open to enable Call Automation to reach it. This anonymous public webserver could create a security risk if you don't take the necessary steps to secure it from unauthorized access.

A common way you can improve this security is by implementing an API KEY mechanism. Your webserver can generate the key at runtime and provide it in the callback URI as a query parameter when you answer or create a call. Your webserver can verify the key in the webhook callback from Call Automation before allowing access. Some customers require more security measures. In these cases, a perimeter network device may verify the inbound webhook, separate from the webserver or application itself. The API key mechanism alone may not be sufficient.

## Improving Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard Open ID Connect (OIDC) JWT validation techniques to ensure the integrity of the token as follows. The lifetime of the JWT is five (5) minutes and a new token is created for every event sent to the callback URI.

1. Obtain the Open ID configuration URL: https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration
2. Install the [Microsoft.AspNetCore.Authentication.JwtBearer NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer) package.
3. Configure your application to validate the JWT using the NuGet package and the configuration of your ACS resource. You need the `audience` values as it is present in the JWT payload.
4. Validate the issuer, audience and the JWT token.
   - The audience is your ACS resource ID you used to setup your Call Automation client. Refer [here](../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
   - The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. When the signature is valid and the token hasn't expired (within 5 minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to use `Microsoft.IdentityModel.Protocols.OpenIdConnect` to validate webhook payload
## [csharp](#tab/csharp)
```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add ACS CallAutomation OpenID configuration
var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
            builder.Configuration["OpenIdConfigUrl"],
            new OpenIdConnectConfigurationRetriever());
var configuration = configurationManager.GetConfigurationAsync().Result;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Configuration = configuration;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidAudience = builder.Configuration["AllowedAudience"]
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/api/callback", (CloudEvent[] events) =>
{
    // Your implemenation on the callback event
    return Results.Ok();
})
.RequireAuthorization()
.WithOpenApi();

app.UseAuthentication();
app.UseAuthorization();

app.Run();

```

## Next steps
- Learn more about [How to control and steer calls with Call Automation](../call-automation/actions-for-call-control.md).