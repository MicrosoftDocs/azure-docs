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

Securing the delivery of messages from end to end is crucial for ensuring the confidentiality, integrity, and availability of sensitive information transmitted between systems. Without proper security measures in place, sensitive data can be intercepted, modified, or even deleted by attackers, leading to potential data breaches, service disruptions, or other security incidents. Call Automation has two types of events that are secured to deliver: `IncomingCall` event and `Call Automation webhook` event.

## Incoming Call Event
Azure Communication Services relies on Event Grid subscriptions to deliver each `IncomingCall`, refer [here](../../concepts/call-automation/incoming-call-notification.md) to learn more about `IncomingCall` concepts
Refer [here](../../../event-grid/secure-webhook-delivery.md) to learn how to secure the delivery of `IncomingCall` by Event Grid

## Call Automation webhook events
The Call Automation events are sent to the webhook callback URI specified when you answer or place a new outbound call. Refer [here](../../concepts/call-automation/call-automation.md#call-automation-webhook-events)

The webhook event has Authentication header in it, Contoso is expected to validate this token before acception the event.

1. Obtain the OpenID configuration URL, it will be https://[YourACSResource].communication.azure.com/calling/.well-known/acsopenidconfiguration
2. Fetch the OpenId configuration from the URL in step1.
3. Parse the OpenID configuration: Once you have fetched the OpenID configuration, the next step is to parse it and extract the required information. The nuget package `Microsoft.IdentityModel.Protocols.OpenIdConnect` can be used here.
4. Validate the issuer, audience and the JWT token.
- The issuer is https://acscallautomation.communication.microsoft.com
- The audience is your ACS resource id you used to setup your CallAutomation client. Refer [here](../../quickstarts/voice-video-calling/get-resource-id.md) about how to get it.
- The JSON Web Key Set (JWKS) endpoint in the OpenId configuration contains the keys used to validate the JWT token. If the signature is valid and the token has not expired(within 5 minutes from the token is generated), then the token is considered valid and can be used to authorize the client.

Below is a sample code by using `Microsoft.IdentityModel.Protocols.OpenIdConnect` to validate webhood event
## [csharp](#tab/csharp)
```csharp
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Protocols;
    using Microsoft.IdentityModel.Protocols.OpenIdConnect;
    using Microsoft.IdentityModel.Tokens;
    using System;
    using System.Linq;

    public class Startup
    {
        private IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        
        public void ConfigureServices(IServiceCollection services)
        {
            // Add JWT authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {    
                    var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                        Configuration["OpenIdConfigUrl"],
                        new OpenIdConnectConfigurationRetriever());
                    var configuration = configurationManager.GetConfigurationAsync().Result;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKeys = configuration.SigningKeys,
                        ValidateLifetime = true,
                        ValidateIssuer = true,
                        ValidIssuer = "https://acscallautomation.communication.microsoft.com",
                        ValidateAudience = true,
                        ValidAudience = Configuration["AllowedAudience"],
                    };
                });

            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                var authorizationHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authorizationHeader))
                {
                    Console.WriteLine($"Authorization header: {authorizationHeader}");
                }

                await next();
            });

            app.UseRouting();     
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }  
    }
```