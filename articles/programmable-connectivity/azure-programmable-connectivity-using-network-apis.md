---
title: Using network APIs with Azure Programmable Connectivity
titleSuffix: Azure Programmable Connectivity
description: Quick start guide to use the APIs exposed by APC.
author: anzaman
ms.author: alzam
ms.service: azure-operator-nexus
ms.topic: overview 
ms.date: 02/13/2024
ms.custom: template-overview
---

# How to use network APIs with Azure Programmable Connectivity

In this guide, you learn how to use Network APIs exposed by Azure Programmable Connectivity.

## Prerequisites

Create an APC Gateway, following instructions in [Create an APC Gateway](azure-programmable-connectivity-create-gateway.md).

- Obtain the resource identifier of your APC Gateway. This can be found by navigating to the APC Gateway in the Azure portal, and copying the URL from `/subscriptions` onwards. A full identifier has the following format, with variables in <ANGLE_BRACKETS> templated: `/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.programmableconnectivity/gateways/<APC_GATEWAY_NAME>`. Note this as `APC_IDENTIFIER`.
- Obtain the URL of your APC Gateway. This can be found by navigating to the APC Gateway in the Azure portal, and obtaining the `Gateway base URL` under Properties. Note this as `APC_URL`.

## Obtain an authentication token

1. Follow the instructions at [How to create a Service Principal](/entra/identity-platform/howto-create-service-principal-portal) to create an App Registration that can be used to access your APC Gateway. 
    - At the step "Assign a role to the application", you are required to choose a scope and a role:
        - The correct scope is the APC Gateway you created. To use this as the scope, navigate to the APC Gateway in the Azure portal, and follow instructions from "Select Access control (IAM)" onwards.
        - The correct role to assign is `Azure Programmable Connectivity Gateway User`
    - At the step "Set up authentication", select "Option 3: Create a new client secret". Note the value of the secret as `CLIENT_SECRET`, and store it securely (for example in an Azure Key Vault).
2. Navigate to your App Registration in the Azure portal. Copy the value of Client ID from the Overview page, and note it as `CLIENT_ID`.
3. Navigate to "Tenant Properties" in the Azure portal. Copy the value of Tenant ID, and note it as `TENANT`.
4. Obtain a token from your App Registration. When asked for `client_id`, `client_secret`, and `tenant`, use the values obtained in this process. Use `https://management.azure.com//.default` as the scope. 
    - This can be done using an HTTP request, following the instructions in the [documentation](/entra/identity-platform/v2-oauth2-client-creds-grant-flow#first-case-access-token-request-with-a-shared-secret).
    - You can instead choose to use an SDK to obtain the token. For example:
        - [Python](/entra/msal/python/)
        - [.NET](/entra/msal/dotnet/)
        - [Java](/entra/msal/java/)
5. Note the value of the token you have obtained as `APC_AUTH_TOKEN`.

## Use an API

### Common components

#### Headers

All requests must contain the following headers:

- `Authorization`: This must have the value of `<APC_AUTH_TOKEN>` obtained in [Prerequisites](#prerequisites).
- `apc-gateway-id`: This must have the value of `<APC_IDENTIFIER>` obtained in [Prerequisites](#prerequisites).

#### Network identifier

Each request body contains the field `networkIdentifier`. This object contains the fields `identifierType` and `identifier`. These values are used to identify which Network a request should be routed to.

APC can identify the correct Network in one of three ways:
- Using the `IPv4` address of the device. Set `identifierType` to `IPv4`, and `identifier` to the IPv4 address of the relevant device.
- Using the `IPv6` address of the device. Set `identifierType` to `IPv6`, and `identifier` to the IPv4 address of the relevant device.
- Using a Network Code to route to a specific Network. Set `identifierType` to `NetworkCode`, and `identifier` to a Network Code. Network Codes can be obtained using the [`Network` endpoint](#obtain-the-network-of-a-device), or chosen from the following table:

| Operator | NetworkCode |
| -------- | ----------- |
| Claro Brazil | Claro_Brazil |
| Telefonica Brazil | Telefonica_Brazil |
| TIM Brazil | Tim_Brazil |
| Orange Spain | Orange_Spain |
| Telefonica Spain | Telefonica_Spain |

### Retrieve the last time that a SIM card was changed

Make a POST request to the endpoint `https://<APC_URL>/sim-swap/sim-swap:verify`.

It must contain all common headers specified in [Headers](#headers).

The body of the request must take the following form. Replace the example values with real values.

```json
{
    "phoneNumber": "+123456789",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Set `phoneNumber` to the phone number of the SIM you want to check. This must be in E.164 format (starting with country code) and optionally prefixed with '+'.

Set the `networkIdentifier` block according to instructions in [Network identifier](#network-identifier).

The response is of the form:

```json
{
    "date": "2023-07-03T14:27:08.312+02:00"
}
```

`date` contains the timestamp of the most recent SIM swap in the `date-time` format defined in [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6).

### Verify that a SIM card has been swapped in a certain time frame

Make a POST request to the endpoint `https://<APC_URL>/sim-swap/sim-swap:retrieve`.

It must contain all common headers specified in [Headers](#headers).

The body of the request must take the following form. Replace the example values with real values.

```json
{
    "phoneNumber": "+123456789",
    "maxAgeHours": "24",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Set `phoneNumber` to the phone number of the SIM you want to check. This must be in E.164 format (starting with country code) and optionally prefixed with '+'.

Set `maxAgeHours` to the length of time in hours before the present that you want to check for a SIM swap.

Set the `networkIdentifier` block according to instructions in [Network identifier](#network-identifier).

The response is of the form:

```json
{
    "verificationResult": true
}
```

`verificationResult` is a boolean, which is true if the SIM has been swapped in the specified time period, and false otherwise.

### Verify the location of a device

Make a POST request to the endpoint `https://<APC_URL>/device-location/location:verify`.

It must contain all common headers specified in [Headers](#headers).

The body of the request must take one of the following forms, which vary on the format used to identify the device. Replace the example values with real values.

Option 1: use the device's IPv4 address and port:

```json
{
    "device": {
        "ipv4Address": {
            "ipv4": "127.127.127.127",
            "port": "1234"    
        }
    },
    "latitude": "51.501476",
    "longitude": "-0.140634",
    "accuracy": "5",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Option 2: use the device's IPv6 address and port:

```json
{
    "device": {
        "ipv6Address": {
            "ipv6": "fc00:fc00::",
            "port": "1234"    
        }
    },
    "latitude": "51.501476",
    "longitude": "-0.140634",
    "accuracy": "5",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Option 3: use the device's phone number, which must be in E.164 format (starting with country code) and optionally prefixed with '+'.

```json
{
    "device": {
        "phoneNumber": "+123456789"
    },
    "latitude": "51.501476",
    "longitude": "-0.140634",
    "accuracy": "5",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Option 4: use the device's Network Access Identifier:

```json
{
    "device": {
        "networkAccessIdentifier": "123456789@example.com"
    },
    "latitude": "51.501476",
    "longitude": "-0.140634",
    "accuracy": "5",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    }
}
```

Set `latitude` and `longitude` to the coordinates of the location you want to verify, using signed values. `latitude` is a number between -90 and 90; `longitude` is a number between -180 and 180.

Set `accuracy` to the maximum distance in kilometers from the specified location that you want to check for.

Set the `networkIdentifier` block according to instructions in [Network identifier](#network-identifier).

The response is of the form:

```json
{
    "verificationResult": true
}
```

`verificationResult` is a boolean, which is true if the device is within a certain distance (given by `accuracy`) of the given location, and false otherwise.

### Obtain the Network of a device

Make a POST request to the endpoint `https://<APC_URL>/device-network/network:retrieve`.

It must contain all common headers specified in [Headers](#headers).

The body of the request must take the following form. Replace the example values with real values.

```json
{
    "identifierType": "IPv4",
    "identifier": "127.127.127.127"
}
```

Set the fields according to instructions in [Network identifier](#network-identifier).

Note that if you set `identifierType` to `NetworkCode`, you receive the same Network Code in response.

The response is of the form:

```json
{
    "networkCode": "Some_Network"
}
```

`networkCode` contains a Network Code that can be used as the Network Identifier for any other API.