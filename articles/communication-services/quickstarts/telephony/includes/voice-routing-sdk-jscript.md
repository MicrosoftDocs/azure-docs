---
title: include file
description: Learn how to use the Number Management JavaScript SDK to configure direct routing.
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
- Active LTS and Maintenance LTS versions of [Node.js](https://nodejs.org/) for your operating system.
- The fully qualified domain name (FQDN) and port number of a session border controller (SBC) in an operational telephony system.
- The [verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC FQDN.

## Final code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/direct-routing-quickstart).

You can also find more usage examples for `SipRoutingClient` on [GitHub](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/communication/azure-communication-phonenumbers/src/samples/java/com/azure/communication/phonenumbers/siprouting/AsyncClientJavaDocCodeSnippets.java).

## Create a Node.js application

Open your terminal or command window, create a new directory for your app, and go to it:

``` console
    mkdir direct-routing-quickstart && cd direct-routing-quickstart
```

Run npm `init -y` to create a *package.json* file with default settings:

``` console
   npm init -y
```

Create a file called *direct-routing-quickstart.js* in the root of the directory that you created. Add the following snippet to it:

``` javascript
async function main() {
    // quickstart code will go here
}

main();
```

## Install the package

Use the `npm install` command to install the Azure Communication Services Phone Numbers client library for JavaScript:

``` console
   npm install @azure/communication-phone-numbers --save
```

The `--save` option adds the library as a dependency in your *package.json* file.

## Authenticate the client

Import `SipRoutingClient` from the client library and instantiate it with your connection string. The code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. [Learn how to manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to *direct-routing-quickstart.js*:

```javascript
const { SipRoutingClient } = require('@azure/communication-phone-numbers');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the phone numbers client
const sipRoutingClient = new SipRoutingClient(connectionString);
```

## Set up a direct routing configuration

In the [prerequisites](#prerequisites), you verified domain ownership. The next steps are to create trunks (add SBCs) and create voice routes.

### Create or update trunks

Azure Communication Services direct routing allows communication with registered SBCs only. To register an SBC, you need its FQDN and port:

```javascript
  await client.setTrunks([
    {
      fqdn: 'sbc.us.contoso.com',
      sipSignalingPort: 5061
    },{
      fqdn: 'sbc.eu.contoso.com',
      sipSignalingPort: 5061
    }
  ]);
```

### Create or update routes

Provide routing rules for outbound calls. Each rule consists of two parts: a regex pattern that should match a dialed phone number, and the FQDN of a registered trunk where the call is routed.

The order of routes determines the priority of routes. The first route that matches the regex will be picked for a call.

In this example, you create one route for numbers that start with `+1` and a second route for numbers that start with just `+`:

```javascript
   await client.setRoutes([
    {
      name: "UsRoute",
      description: "route's description",
      numberPattern: "^\+1(\d{10})$",
      trunks: [ 'sbc.us.contoso.com' ]
    },{
      name: "DefaultRoute",
      description: "route's description",
      numberPattern: "^\+\d+$",
      trunks: [ 'sbc.us.contoso.com', 'sbc.eu.contoso.com']
    }
  ]);
```

## Update a direct routing configuration

You can update the properties of a specific trunk by overwriting the record with the same FQDN. For example, you can set a new SBC port value:

``` javascript
  await client.setTrunk({
    fqdn: 'sbc.us.contoso.com',
    sipSignalingPort: 5063
  });
```

You use the same method to create and update routing rules. When you update routes, send all of them in a single update. The new routing configuration fully overwrites the former one.

## Remove a direct routing configuration

You can't edit or remove a single voice route. You should overwrite the entire voice routing configuration. Here's an example of an empty list that removes all the routes and trunks:

``` javascript
//delete all configured voice routes
console.log("Deleting all routes...");
await client.setRoutes([]);

//delete all trunks
console.log("Deleting all trunks...");
await client.setTrunks([]);
```

You can use the following example to delete a single trunk (SBC), if no voice routes are using it. If the SBC is listed in any voice route, delete that route first.

``` javascript
   await client.deleteTrunk('sbc.us.contoso.com');
```

## Run the code

Use the `node` command to run the code that you added to the `direct-routing-quickstart.js` file:

``` console
   node direct-routing-quickstart.js
```
