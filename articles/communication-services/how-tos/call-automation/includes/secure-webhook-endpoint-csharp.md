---
title: Include file
description: C# webhook callback security
services: azure-communication-services
author: Richard Cho
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2023
ms.topic: include
ms.topic: include file
ms.author: richardcho
---

## Improve Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard OpenID Connect (OIDC) JWT validation techniques to ensure the integrity of the token. The lifetime of the JWT is five minutes, and a new token is created for every event sent to the callback URI.

1. Obtain the OpenID configuration URL: `<https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>`
1. Install the [Microsoft.AspNetCore.Authentication.JwtBearer NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer) package.
1. Configure your application to validate the JWT by using the NuGet package and the configuration of your Azure Communication Services resource. You need the `audience` value as it appears in the JWT payload.
1. Validate the issuer, the audience, and the JWT:
   - The audience is your Azure Communication Services resource ID that you used to set up your Call Automation client. For information about how to get it, see [Get your Azure resource ID](../../../quickstarts/voice-video-calling/get-resource-id.md).
   - The JSON Web Key Set endpoint in the OpenId configuration contains the keys that are used to validate the JWT. When the signature is valid and the token hasn't expired (within five minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to use `Microsoft.IdentityModel.Protocols.OpenIdConnect` to validate the webhook payload:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Azure Communication Services CallAutomation OpenID configuration
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
    // Your implementation on the callback event
    return Results.Ok();
})
.RequireAuthorization()
.WithOpenApi();

app.UseAuthentication();
app.UseAuthorization();

app.Run();

```
