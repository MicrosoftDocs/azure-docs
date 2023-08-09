---
title: 'How to: Connect to an Azure Fluid Relay service'
description: How to connect to an Azure Fluid Relay service using the @fluidframework/azure-client library.
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 01/18/2023
ms.topic: article
ms.service: azure-fluid
fluid.url: https://fluidframework.com/docs/deployment/azure-frs/
---

# How to: Connect to an Azure Fluid Relay service

This article walks through the steps to get your Azure Fluid Relay service provisioned and ready to use. 

> [!IMPORTANT]
> Before you can connect your app to an Azure Fluid Relay server, you must [provision an Azure Fluid Relay server](provision-fluid-azure-portal.md) resource on your Azure account.

Azure Fluid Relay service is a cloud-hosted Fluid service. You can connect your Fluid application to an Azure Fluid Relay instance using the [AzureClient](https://fluidframework.com/docs/apis/azure-client/azureclient-class) in the [@fluidframework/azure-client](https://www.npmjs.com/package/@fluidframework/azure-client) package. `AzureClient` handles the logic of connecting your [Fluid container](https://fluidframework.com/docs/build/containers/) to the service while keeping the container object itself service-agnostic. You can use one instance of this client to manage multiple containers.

The sections below will explain how to use `AzureClient` in your own application.

## Connecting to the service

To connect to an Azure Fluid Relay instance, you first need to create an `AzureClient`. You must provide some configuration parameters including the tenant ID, service URL, and a token provider to generate the JSON Web Token (JWT) that will be used to authorize the current user against the service. The [@fluidframework/test-client-utils](https://fluidframework.com/docs/apis/test-client-utils/) package provides an InsecureTokenProvider that can be used for development purposes.

> [!CAUTION]
> The `InsecureTokenProvider` should only be used for development purposes because **using it exposes the tenant key secret in your client-side code bundle.** This must be replaced with an implementation of [ITokenProvider](https://fluidframework.com/docs/apis/azure-client/itokenprovider-interface/) that fetches the token from your own backend service that is responsible for signing it with the tenant key. An example implementation is [AzureFunctionTokenProvider](https://fluidframework.com/docs/apis/azure-client/azurefunctiontokenprovider-class). For more information, see [How to: Write a TokenProvider with an Azure Function](../how-tos/azure-function-token-provider.md). Note that the `id` and `name` fields are arbitrary.

```javascript
const user = { id: "userId", name: "userName" };

const config = {
  tenantId: "myTenantId",
  tokenProvider: new InsecureTokenProvider("myTenantKey", user),
  endpoint: "https://myServiceEndpointUrl",
  type: "remote",
};

const clientProps = {
  connection: config,
};

const client = new AzureClient(clientProps);
```

Now that you have an instance of `AzureClient`, you can start using it to create or load Fluid containers!

### Token providers

The [AzureFunctionTokenProvider](https://fluidframework.com/docs/apis/azure-client/azurefunctiontokenprovider-class) is an implementation of `ITokenProvider` that ensures your tenant key secret is not exposed in your client-side bundle code. The `AzureFunctionTokenProvider` takes in your Azure Function URL appended by `/api/GetAzureToken` along with the current user object. Later on, it makes a `GET` request to your Azure Function by passing in the tenantId, documentId and userId/userName as optional parameters.

```javascript
const config = {
  tenantId: "myTenantId",
  tokenProvider: new AzureFunctionTokenProvider(
    "myAzureFunctionUrl" + "/api/GetAzureToken",
    { userId: "userId", userName: "Test User" }
  ),
  endpoint: "https://myServiceEndpointUrl",
  type: "remote",
};

const clientProps = {
  connection: config,
};

const client = new AzureClient(clientProps);
```

### Adding custom data to tokens

The user object can also hold optional additional user details. For example:

```javascript
const userDetails = {
  email: "xyz@outlook.com",
  address: "Redmond",
};

const config = {
  tenantId: "myTenantId",
  tokenProvider: new AzureFunctionTokenProvider(
    "myAzureFunctionUrl" + "/api/GetAzureToken",
    { userId: "UserId", userName: "Test User", additionalDetails: userDetails }
  ),
  endpoint: "https://myServiceEndpointUrl",
  type: "remote",
};
```

Your Azure Function will generate the token for the given user that is signed using the tenant's secret key and return it to the client without exposing the secret itself.

## Managing containers

The `AzureClient` API exposes [createContainer](https://fluidframework.com/docs/apis/azure-client/azureclient-class#createcontainer-method) and [getContainer](https://fluidframework.com/docs/apis/azure-client/azureclient-class#getcontainer-method) functions to create and get [container](https://fluidframework.com/docs/apis/fluid-static/ifluidcontainer-interface)s respectively. Both functions take in a _container schema_ that defines the container data model. For the `getContainer` function, there is an additional parameter for the container `id` of the container you wish to fetch.

In the container creation scenario, you can use the following pattern:

```javascript
const schema = {
  initialObjects: {
    /* ... */
  },
  dynamicObjectTypes: [
    /*...*/
  ],
};
const azureClient = new AzureClient(clientProps);
const { container, services } = await azureClient.createContainer(
  schema
);
const id = await container.attach();
```

The `container.attach()` call is when the container actually becomes connected to the service and is recorded in its blob storage. It returns an `id` that is the unique identifier to this container instance.

Any client that wants to join the same collaborative session needs to call `getContainer` with the same container `id`.

```javascript
const { container, services } = await azureClient.getContainer(
  id,
  schema
);
```

For the further information on how to start recording logs being emitted by Fluid, see [Logging and telemetry](https://fluidframework.com/docs/testing/telemetry/).

The container being fetched back will hold the `initialObjects` as defined in the container schema. See [Data modeling](https://fluidframework.com/docs/build/data-modeling/) on fluidframework.com to learn more about how to establish the schema and use the `container` object.

## Getting audience details

Calls to `createContainer` and `getContainer` return two values: a `container` -- described above -- and a [services](https://fluidframework.com/docs/apis/azure-client/azurecontainerservices-interface) object.

The `container` contains the Fluid data model and is service-agnostic. Any code you write against this container object returned by the `AzureClient` is reusable with the client for another service. An example is if you prototyped your scenario using [TinyliciousClient](https://fluidframework.com/docs/apis/tinylicious-client/), then all of your code interacting with the shared objects within the Fluid container can be reused when moving to using `AzureClient`.

The `services` object contains data that is specific to the Azure Fluid Relay service. This object contains an [audience](https://fluidframework.com/docs/apis/azure-client/azurecontainerservices-interface#audience-propertysignature) value that can be used to manage the roster of users that are currently connected to the container.

The following code demonstrates how you can use the `audience` object to maintain an updated view of all the members currently in a container.

```javascript
const { audience } = containerServices;
const audienceDiv = document.createElement("div");

const onAudienceChanged = () => {
  const members = audience.getMembers();
  const self = audience.getMyself();
  const memberStrings = [];
  const useAzure = process.env.FLUID_CLIENT === "azure";

  members.forEach((member) => {
    if (member.userId !== (self ? self.userId : "")) {
      if (useAzure) {
        const memberString = `${member.userName}: {Email: ${member.additionalDetails ? member.additionalDetails.email : ""},
                        Address: ${member.additionalDetails ? member.additionalDetails.address : ""}}`;
        memberStrings.push(memberString);
      } else {
        memberStrings.push(member.userName);
      }
    }
  });
  audienceDiv.innerHTML = `
            Current User: ${self ? self.userName : ""} <br />
            Other Users: ${memberStrings.join(", ")}
        `;
};

onAudienceChanged();
audience.on("membersChanged", onAudienceChanged);
```

`audience` provides two functions that will return [AzureMember](https://fluidframework.com/docs/apis/azure-client/azuremember-interface) objects that have a user ID and user name:

- `getMembers` returns a map of all the users connected to the container. These values will change anytime a member joins or leaves the container.
- `getMyself` returns the current user on this client.

`audience` also emits events for when the roster of members changes. `membersChanged` will fire for any roster changes, whereas `memberAdded` and `memberRemoved` will fire for their respective changes with the `clientId` and `member` values that have been modified. After any of these events fire, a new call to `getMembers` will return the updated member roster.

A sample `AzureMember` object looks like:

```json
{
  "userId": "0e662aca-9d7d-4ff0-8faf-9f8672b70f15",
  "userName": "Test User",
  "connections": [
    {
      "id": "c699c3d1-a4a0-4e9e-aeb4-b33b00544a71",
      "mode": "write"
    },
    {
      "id": "0e662aca-9d7d-4ff0-8faf-9f8672b70f15",
      "mode": "write"
    }
  ],
  "additionalDetails": {
    "email": "xyz@outlook.com",
    "address": "Redmond"
  }
}
```

Alongside the user ID, name and additional details, `AzureMember` objects also hold an array of [connections](https://fluidframework.com/docs/apis/fluid-static/imember-interface#connections-propertysignature). If the user is logged into the session with only one client, `connections` will only have one value in it with the ID of the client, and whether is in read/write mode. However, if the same user is logged in from multiple clients (that is, they are logged in from different devices or have multiple browser tabs open with the same container), `connections` here will hold multiple values for each client. In the example data above, we can see that a user with name "Test User" and ID "0e662aca-9d7d-4ff0-8faf-9f8672b70f15" currently has the container open from two different clients. The values in the [additionalDetails](https://fluidframework.com/docs/apis/azure-client/azuremember-interface#additionaldetails-propertysignature) field match up to the values provided in the `AzureFunctionTokenProvider` token generation.

These functions and events can be combined to present a real-time view of the users in the current session.

**Congratulations!** You have now successfully connected your Fluid container to the Azure Fluid Relay service and fetched back user details for the members in your collaborative session!
