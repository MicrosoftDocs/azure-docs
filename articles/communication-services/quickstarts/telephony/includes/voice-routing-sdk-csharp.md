---
title: include file
description: Learn how to use the Number Management C# SDK to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy
ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 06/01/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- The latest version of the [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- The fully qualified domain name (FQDN) and port number of a session border controller (SBC) in an operational telephony system.
- The [verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC FQDN.

## Final code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/DirectRouting).

You can also find more usage examples for `SipRoutingClient` on [GitHub](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/communication/Azure.Communication.PhoneNumbers/README.md#siproutingclient).

## Create a C# application

In a console window (such as Command Prompt, PowerShell, or Bash), use the `dotnet new` command to create a new console app:

```console
    dotnet new console -o DirectRoutingQuickstart
```

This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

Change your directory to the newly created app folder, and use the `dotnet build` command to compile your application:

``` console
    cd DirectRoutingQuickstart
    dotnet build
```

## Install the package

While you're still in the application directory, install the Azure Communication PhoneNumbers client library for .NET by using the `dotnet add package` command:

``` console
    dotnet add package Azure.Communication.PhoneNumbers --version 1.1.0
```

Add a `using` directive to the top of *Program.cs* to include the namespaces:

``` csharp
using Azure.Communication.PhoneNumbers.SipRouting;
```

## Authenticate the client

Authenticate phone number clients by using a [connection string from an Azure Communication Services resource](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints):

``` csharp
// Get a connection string to the Azure Communication Services resource.
var connectionString = "<connection_string>";
var client = new SipRoutingClient(connectionString);
```

## Set up a direct routing configuration

In the [prerequisites](#prerequisites), you verified domain ownership. The next steps are to create trunks (add SBCs) and create voice routes.

### Create or update trunks

Azure Communication Services direct routing allows communication with registered SBCs only. To register an SBC, you need its FQDN and port:

``` csharp
// Register your SBCs by providing their fully qualified domain names and port numbers.
var usSbcFqdn = "sbc.us.contoso.com";
var euSbcFqdn = "sbc.eu.contoso.com";
var sbcPort = 5061;

var usTrunk = new SipTrunk(usSbcFqdn, sbcPort);
var euTrunk = new SipTrunk(euSbcFqdn, sbcPort);

await client.SetTrunksAsync(new List<SipTrunk> { usTrunk, euTrunk });
```

### Create or update routes

Provide routing rules for outbound calls. Each rule consists of two parts: a regex pattern that should match a dialed phone number, and the FQDN of a registered trunk where the call is routed.

The order of routes determines the priority of routes. The first route that matches the regex will be picked for a call.

In this example, you create one route for numbers that start with `+1` and a second route for numbers that start with just `+`:

``` csharp
var usRoute = new SipTrunkRoute("UsRoute", "^\\+1(\\d{10})$", trunks: new List<string> { usSbcFqdn });
var defaultRoute = new SipTrunkRoute("DefaultRoute", "^\\+\\d+$", trunks: new List<string> { usSbcFqdn, euSbcFqdn });

await client.SetRoutesAsync(new List<SipTrunkRoute> { usRoute, defaultRoute });
```

## Update a direct routing configuration

You can update the properties of a specific trunk by overwriting the record with the same FQDN. For example, you can set a new SBC port value:

``` csharp
var usTrunk = new SipTrunk("sbc.us.contoso.com", 5063);
await client.SetTrunkAsync(usTrunk);
```

You use the same method to create and update routing rules. When you update routes, send all of them in a single update. The new routing configuration fully overwrites the former one.

## Remove a direct routing configuration

You can't edit or remove a single voice route. You should overwrite the entire voice routing configuration. Here's an example of an empty list that removes all the routes and trunks:

``` csharp
//delete all configured voice routes
await client.SetRoutesAsync(new List<SipTrunkRoute>());

//delete all trunks
await client.SetTrunksAsync(new List<SipTrunk>());
```

You can use the following example to delete a single trunk (SBC), if no voice routes are using it. If the SBC is listed in any voice route, delete that route first.

``` csharp
await client.DeleteTrunkAsync("sbc.us.contoso.com");
```
