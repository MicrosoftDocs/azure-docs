---
title: include file
description: .NET websocket callback security
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/06/2025
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Websocket code sample

This sample code demonstrates how to authenticate WebSocket connection requests using JSON Web Token (JWT) tokens.

```csharp
// 1. Load OpenID Connect metadata
var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
    builder.Configuration["OpenIdConfigUrl"],
    new OpenIdConnectConfigurationRetriever());

var openIdConfig = await configurationManager.GetConfigurationAsync();
// 2. Register JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Configuration = openIdConfig;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidAudience = builder.Configuration["AllowedAudience"]
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// 3. Use authentication & authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.UseWebSockets();

// 4. WebSocket token validation manually in middleware
app.Use(async (context, next) =>
{
    if (context.Request.Path != "/ws")
    {
        await next(context);
        return;
    }

    if (!context.WebSockets.IsWebSocketRequest)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await context.Response.WriteAsync("WebSocket connection expected.");
        return;
    }

    var result = await context.AuthenticateAsync();
    if (!result.Succeeded)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("Unauthorized WebSocket connection.");
        return;
    }

    context.User = result.Principal;

    // Optional: Log headers
    var correlationId = context.Request.Headers["x-ms-call-correlation-id"].FirstOrDefault();
    var callConnectionId = context.Request.Headers["x-ms-call-connection-id"].FirstOrDefault();

    Console.WriteLine($"Authenticated WebSocket - Correlation ID: {correlationId ?? "not provided"}");
    Console.WriteLine($"Authenticated WebSocket - CallConnection ID: {callConnectionId ?? "not provided"}");

    // Now you can safely accept the WebSocket and process the connection
    // var webSocket = await context.WebSockets.AcceptWebSocketAsync();
    // var mediaService = new AcsMediaStreamingHandler(webSocket, builder.Configuration);
    // await mediaService.ProcessWebSocketAsync();
});
```
