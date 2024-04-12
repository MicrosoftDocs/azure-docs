---
title: 'How to: Use AzureClient for local testing'
description: How to use AzureClient to test an application without a service
ms.date: 10/05/2021
ms.topic: reference
ms.service: azure-fluid
---

# How to: Use AzureClient for local testing

This article walks through the steps to configure **AzureClient** in local mode and use it to test your Fluid application locally.

## Configure and create an AzureClient

**AzureClient** can be configured to run against a local Azure Fluid Relay instance by passing it a configuration like the one below.

```js
    import { AzureClient, AzureConnectionConfig, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
    import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

    const clientProps = {
        connection: {
            tenantId: LOCAL_MODE_TENANT_ID,
            tokenProvider: new InsecureTokenProvider("", { id: "123", name: "Test User" }),
            endpoint: "http://localhost:7070",
            type: "remote",
        },
    };

    const azureClient = new AzureClient(clientProps);
```

This example uses the **InsecureTokenProvider** to generate and sign authentication tokens that the Azure Fluid Relay service will accept. However, as the name implies, this implementation is insecure and shouldn't be used in production environments. For more information about InsecureTokenProvider, see [Authentication and authorization in your app](https://fluidframework.com/docs/build/auth/#the-token-provider).

To run locally, you first configure the endpoint to point to the domain, and port that the local Azure Fluid Relay service instance is running at (http://localhost:7070 by default). The final step is to set the `tenantId` to `LOCAL_MODE_TENANT_ID`. All of these settings together configure AzureClient to work with a local Azure Fluid Relay service.  

## Enabling debug logging

You can enable the built-in debug logging from the Fluid Framework using the following setting in a browser console.

`localStorage.debug = 'fluid:*'`

For more advanced scenarios, you can pass a `logger` to the AzureClient. This enables you to customize the logging behavior. For more information on the logger or telemetry, see [Logging and telemetry](https://fluidframework.com/docs/testing/telemetry/) on fluidframework.com. 

## Running Azure Fluid Relay service locally

To use AzureClient's local mode, you first need to start a local server. Running `npx @fluidframework/azure-local-service@latest` from your terminal window will launch the Azure Fluid Relay local server. Once the server is started, you can run your application against the local service.
