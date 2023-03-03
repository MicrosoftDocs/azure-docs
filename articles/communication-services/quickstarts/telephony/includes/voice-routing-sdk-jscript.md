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

## Sample code

You can download the sample app from [GitHub](https://github.com/link.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- Active LTS and Maintenance LTS versions of  [Node.js](https://nodejs.org/) for your operating system.
- Fully qualified domain name (FQDN) and port number of a Session Border Controller (SBC) in operational telephony system

## Create a new Node.js application

First, open your terminal or command window, create a new directory for your app, and navigate to it.

``` console
    mkdir direct-routing-quickstart && cd direct-routing-quickstart
```

Run npm `init -y` to create a package.json file with default settings.

``` console
   npm init -y
```

Create a file called direct-routing-quickstart.js in the root of the directory you just created. Add the following snippet to it:

``` javascript

async function main() {
    // quickstart code will go here
}

main();

```

## Install the package

Use the `npm install` command to install the Azure Communication Services Phone Numbers client library for JavaScript.

``` console
	npm install @azure/communication-phone-numbers@1.2.0-alpha.20230214.1 --save
```

The `--save` option adds the library as a dependency in your package.json file.


## Authenticate the client

Import the `SipRoutingClient` from the client library and instantiate it with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource#store-your-connection-string).

Add the following code to the top of `direct-routing-quickstart.js`:

```javascript

const { SipRoutingClient } = require('@azure/communication-phone-numbers');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the phone numbers client
const sipRoutingClient = new SipRoutingClient(connectionString);

```

## Setup direct routing configuration

### Verify Domain Ownership

[How To: Domain validation](../../../how-tos/telephony/domain-validation.md)

### Create Trunks

Register your SBCs by providing their fully qualified domain names and port numbers.

```javascript

  await client.setTrunks([
    {
      fqdn: 'sbc.us.contoso.com',
      sipSignalingPort: 1234
    },{
      fqdn: 'sbc.eu.contoso.com',
      sipSignalingPort: 1234
    }
  ]);

```

### Create Routes

For outbound calling routing rules should be provided. Each rule consists of two parts: regex pattern that should match destination phone number, and FQDN of registered trunk where call will be routed to when matched.

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

### Run the code

Use the node command to run the code you added to the `direct-routing-quickstart.js` file.

``` console
	node direct-routing-quickstart.js
```

## Updating existing configuration

## Removing a direct routing configuration


> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/communication/communication-phone-numbers/README.md#siproutingclient).
