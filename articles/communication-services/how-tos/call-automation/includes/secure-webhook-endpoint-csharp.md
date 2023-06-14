---
title: include file
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

## Improving Call Automation webhook callback security

Each mid-call webhook callback sent by Call Automation uses a signed JSON Web Token (JWT) in the Authentication header of the inbound HTTPS request. You can use standard Open ID Connect (OIDC) JWT validation techniques to ensure the integrity of the token as follows. The lifetime of the JWT is five (5) minutes and a new token is created for every event sent to the callback URI.

1. Obtain the Open ID configuration URL: <https://acscallautomation.communication.azure.com/calling/.well-known/acsopenidconfiguration>
2. Install the [Microsoft.AspNetCore.Authentication.JwtBearer NuGet](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.JwtBearer) package.
3. Configure your application to validate the JWT using the NuGet package and the configuration of your ACS resource. You need the `audience` values as it is present in the JWT payload.
4. Validate the issuer, audience and the JWT token.
   - The audience is your ACS resource ID you used to set up your Call Automation client. Refer [here](../../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
   - The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. When the signature is valid and the token hasn't expired (within 5 minutes of generation), the client can use the token for authorization.

This sample code demonstrates how to use `Microsoft.IdentityModel.Protocols.OpenIdConnect` to validate webhook payload

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
