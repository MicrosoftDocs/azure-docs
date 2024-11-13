---
title: Using network APIs with Azure Programmable Connectivity
titleSuffix: Azure Programmable Connectivity
description: Quick start guide to use the APIs exposed by APC.
author: anzaman
ms.author: alzam
ms.service: azure-programmable-connectivity
ms.topic: overview 
ms.date: 02/13/2024
ms.custom: template-overview
---

# How to use network APIs with Azure Programmable Connectivity

In this guide, you learn how to use Network APIs exposed by Azure Programmable Connectivity.

## Prerequisites

Create an APC Gateway, following instructions in [Create an APC Gateway](azure-programmable-connectivity-create-gateway.md).

- Obtain the Resource ID of your APC Gateway. This can be found by navigating to the APC Gateway in the Azure portal, clicking `JSON View` in the top right, and copying the value of `Resource ID`. Note this as `APC_IDENTIFIER`.
- Obtain the URL of your APC Gateway. This can be found by navigating to the APC Gateway in the Azure portal, and obtaining the `Gateway base URL` under Properties. Note this as `APC_URL`.
- APC uses [Azure RBAC](/azure/role-based-access-control/overview) to control access. Choose the identity that you are going to use to access APC. This can be your own user identity, a [Service Principal](/entra/identity-platform/app-objects-and-service-principals), or a [Managed Identity](/entra/identity/managed-identities-azure-resources/overview). Add the role assignment `Azure Programmable Connectivity Gateway Dataplane User` for your chosen identity over a scope that includes your APC Gateway (e.g. the APC Gateway itself, the Resource Group that contains it, or the Subscription that contains it). For more details, see the following instructions:
  - [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
  - [Assign Azure roles using Azure CLI](/azure/role-based-access-control/role-assignments-cli)
  - [Assign Azure roles using Azure PowerShell](/azure/role-based-access-control/role-assignments-powershell)

## Use an API

### Common attributes

#### Definitions

- Phone number: a phone number in E.164 format (starting with country code), optionally prefixed with '+'.
- Hashed phone number: the SHA-256 hash, in hexadecimal representation, of a phone number

#### Network identifier

Each request body contains the field `networkIdentifier`. This object contains the fields `identifierType` and `identifier`. These values are used to identify which Network a request should be routed to.

APC can identify the correct Network in one of three ways:
- Using the `IPv4` address of the device. Set `identifierType` to `IPv4`, and `identifier` to the IPv4 address of the relevant device.
- Using the `IPv6` address of the device. Set `identifierType` to `IPv6`, and `identifier` to the IPv6 address of the relevant device.
- Using a Network Code to route to a specific Network. Set `identifierType` to `NetworkCode`, and `identifier` to a Network Code. Network Codes can be obtained using the [`Network` endpoint](#obtain-the-network-of-a-device), or chosen from the following table:

| Operator | NetworkCode |
| -------- | ----------- |
| Telefonica Spain | Telefonica_Spain |

### Contact APC using an SDK

You can use a .NET SDK to contact APC. For more information and usage samples, see the [documentation](/dotnet/api/overview/azure/communication.programmableconnectivity-readme).

If you use the .NET SDK, it is recommended that you also use the [.NET Entra Authentication SDK](/entra/msal/dotnet/).

### Contact APC using HTTP requests

#### Obtain an auth token

To contact APC using HTTP requests, you must obtain an auth token, and set the header `Authorization` to the value of this token. There are numerous ways to do this. Some examples are shown below.

# [Obtain a token for a Service Principal](#tab/service-principal) 

To obtain a token for a Service Principal, follow instructions in the [Entra documentation](/entra/identity-platform/v2-oauth2-client-creds-grant-flow#get-a-token)

# [Obtain a token for your own user identity](#tab/user-identity)

Obtain a token for your own user identity using the Azure CLI command [get-access-token](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true) or the PowerShell command [Get-AzAccessToken](/powershell/module/az.accounts/get-azaccesstoken). Set the `--resource` parameter (in Azure CLI) or the `-ResourceUrl` parameter (in PowerShell) to `https://management.azure.com/`.

---

#### Set other headers

All requests must contain the following header:

- `apc-gateway-id`: This must have the value of `<APC_IDENTIFIER>` obtained in [Prerequisites](#prerequisites).

Requests may also contain the following optional header:

- `x-ms-client-request-id`: This is a unique ID to identify the specific request. This is useful for diagnosing and fixing errors.

#### Retrieve the last time that a SIM card was changed

Make a POST request to the endpoint `https://<APC_URL>/sim-swap/sim-swap:retrieve`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

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

Set `phoneNumber` to the phone number of the SIM you want to check.

Set the `networkIdentifier` block according to instructions in [Network identifier](#network-identifier).

The response is of the form:

```json
{
    "date": "2023-07-03T14:27:08.312+02:00"
}
```

`date` contains the timestamp of the most recent SIM swap in the `date-time` format defined in [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6). `date` may be `null`: this means that the SIM has never been swapped, or has not been swapped within the timeframe that the Operator maintains data for.

#### Verify that a SIM card has been swapped in a certain time frame

Make a POST request to the endpoint `https://<APC_URL>/sim-swap/sim-swap:verify`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

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

Set `phoneNumber` to the phone number of the SIM you want to check.

Set `maxAgeHours` to the length of time in hours before the present that you want to check for a SIM swap.

Set the `networkIdentifier` block according to instructions in [Network identifier](#network-identifier).

The response is of the form:

```json
{
    "verificationResult": true
}
```

`verificationResult` is a boolean, which is true if the SIM has been swapped in the specified time period, and false otherwise.

#### Verify the location of a device

Make a POST request to the endpoint `https://<APC_URL>/device-location/location:verify`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

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

Option 3: use the device's phone number:

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

#### Verify the number of a device

Number verification is different to other APIs, as it requires interaction with a frontend application (i.e. an application running on a device) to verify the number of that device, as part of a flow referred to as "frontend authorization". This means two separate calls to APC must be made: the first to trigger frontend authorization, and the second to request the desired information.

To use number verification functionality, you must expose an endpoint on the backend of your application that is accessible from your application's frontend. This endpoint is used to pass the result of frontend authorization to the backend of your application. Note the full URL to this endpoint as `REDIRECT_URI`.

##### Frontend authorization call

Make a POST request to the endpoint `https://<APC_URL>/number-verification/number:verify`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

The body of the request must take one of the following forms. Replace the example values with real values.

Option 1: use the device's phone number:

```json
{
    "phoneNumber": "+123456789",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    },
    "redirectUri": "https://example.com/apcauthcallback"
}
```

Option 2: use the device's hashed phone number:

```json
{
    "hashedPhoneNumber": "b49f9168e8a886ffd61a090b51a26e117717f5f6fa804af49ea67043a2bfa4f0",
    "networkIdentifier": {
      "identifierType": "NetworkCode",
      "identifier": "Some_Network"
    },
    "redirectUri": "https://example.com/apcauthcallback"
}
```

The response to this call is a 302 redirect. It has a header `location`, which contains a URL. 

Follow the URL from the frontend of your application. This triggers an authorization flow between the device running the frontend and the Network specified using the `networkIdentifier` block.

At the end of the authorization flow, the Network returns a 302 redirect. This redirect:
- Redirects to the `redirectUri` you sent in your request to APC
- Contains the parameter `apcCode`

The frontend of your application must follow this `redirectUri`. This delivers the `apcCode` to your application's backend.

##### Number Verification call

At the end of Call 1, your frontend made a request to the endpoint exposed at `redirectUri` with a parameter `apcCode`. Your backend must obtain the value of `apcCode` and use it in the second call to APC.

Make a POST request to the endpoint `https://<APC_URL>/number-verification/number:verify`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

The body of the request must take the following form. Replace the value of `apcCode` with the value obtained as a result of the authorization flow. 

```json
{
    "apcCode": "12345"
}
```

The response is of the form:

```json
{
    "verificationResult": true
}
```

`verificationResult` is a boolean, which is true if the device has the number (or hashed number) specified in Call 1, and false otherwise.

#### Obtain the network of a device

Make a POST request to the endpoint `https://<APC_URL>/device-network/network:retrieve`.

It must contain a [bearer token](#obtain-an-auth-token) and [other required headers](#set-other-headers).

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
