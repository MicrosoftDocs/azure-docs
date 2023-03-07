---
title: include file
description: A quickstart on how to use Number Management JavaScript SDK to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 02/20/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

<!-- ## Sample code

You can download the sample app from [GitHub](https://github.com/link. -->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- Active LTS and Maintenance LTS versions of  [Node.js](https://nodejs.org/) for your operating system.
- Fully Qualified Domain Name (FQDN) and port number of a Session Border Controller (SBC) in operational telephony system.
- [Verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC FQDN.

## Create a new Node.js application

First, open your terminal or command window, create a new directory for your app, and navigate to it.

``` console
    mkdir direct-routing-quickstart && cd direct-routing-quickstart
```

Run npm `init -y` to create a package.json file with default settings.

``` console
   npm init -y
```
Create a file called direct-routing-quickstart.js in the root of the directory you created. Add the following snippet to it:

``` javascript
async function main() {
    // quickstart code will go here
}

main();
```

## Install the package

Use `npm install` command to install the Azure Communication Services Phone Numbers client library for JavaScript.

``` console
	npm install @azure/communication-phone-numbers@1.2.0-alpha.20230214.1 --save
```

The `--save` option adds the library as a dependency in your package.json file.

## Authenticate the client

Import the `SipRoutingClient` from the client library and instantiate it with your connection string. The code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource#store-your-connection-string).

Add the following code to the `direct-routing-quickstart.js`:

```javascript
const { SipRoutingClient } = require('@azure/communication-phone-numbers');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the phone numbers client
const sipRoutingClient = new SipRoutingClient(connectionString);
```

## Setup direct routing configuration

1. Domain ownership verification - see [prerequisites](#prerequisites)
1. Creating trunks (adding SBCs)
1. Creating voice routes

### Create or update Trunks

Azure Communication Services direct routing allows communication with registered SBCs only. To register an SBC, you need its FQDN and port.

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

### Create or update Routes

> [!NOTE]
> Order of routes does matter, as it determines priority of routes. The first route that matches the regex will be picked for a call.

For outbound calling routing rules should be provided. Each rule consists of two parts: regex pattern that should match dialed phone number and FQDN of a registered trunk where call is routed. In this example, we create one route for numbers that start with `+1` and a second route for numbers that start with just `+`.

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

### Updating existing configuration

Properties of specific Trunk can be updated by overwriting the record with the same FQDN. For example, you can set new SBC Port value.

``` javascript
  await client.setTrunk({
    fqdn: 'sbc.us.contoso.com',
    sipSignalingPort: 5063
  });
```
> [!IMPORTANT]
>The same method is used to create and update routing rules. When updating routes, all routes should be sent in single update and routing configuration will be fully overwritten by the new one. 

### Removing a direct routing configuration

You can't edit or remove single voice route. Entire voice routing configuration should be overwritten. Here's the example of an empty list that removes all the routes and trunks:

``` javascript
//delete all configured voice routes
console.log("Deleting all routes...");
await client.setRoutes([]); 

//delete all trunks
console.log("Deleting all trunks...");
await client.setTrunks([]);
``` 

You can delete a single trunk (SBC), if it isn't used in any voice route. If SBC is listed in any voice route, that route should be deleted first.

``` javascript
   await client.deleteTrunk('sbc.us.contoso.com');
```

<!-- All Direct Routing configuration can be deleted by overriding routes and trunks configudation with new configuration or empty lists. Same methods are used as in "Create or Update Trunks" and "Create or Update Routes" sections. -->

### Run the code

Use the node command to run the code you added to the `direct-routing-quickstart.js` file.

``` console
	node direct-routing-quickstart.js
```

> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/communication/azure-communication-phonenumbers/src/samples/java/com/azure/communication/phonenumbers/siprouting/AsyncClientJavaDocCodeSnippets.java).