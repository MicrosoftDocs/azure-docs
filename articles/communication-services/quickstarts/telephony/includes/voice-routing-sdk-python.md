---
title: include file
description: A quickstart on how to use Number Management Python SDK to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 03/02/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/link)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

## Setting up

### Create a new Python application

Open your terminal or command window and create a new directory for your app, then navigate to it.

```console
mkdir direct-routing-quickstart && cd direct-routing-quickstart
```

Use a text editor to create a file called *direct_routing_sample.py* in the project root directory and add the the following code. We'll be adding the remaining quickstart code in the following sections.

```python
import os
from azure.communication.phonenumbers.siprouting import SipRoutingClient, SipTrunk, SipTrunkRoute

try:
   print('Azure Communication Services - Direct Routing Quickstart')
   # Quickstart code goes here
except Exception as ex:
   print('Exception:')
   print(ex)
```

### Install the package

While still in the application directory, install the Azure Communication Services Administration client library for Python package by using the `pip install` command.

```console
pip install azure-communication-phonenumbers==1.1.0b3
```

## Authenticate the Client

The `SipRoutingClient` is enabled to use Azure Active Directory Authentication. Using the `DefaultAzureCredential` object is the easiest way to get started with Azure Active Directory and you can install it using the `pip install` command.

```console
pip install azure-identity
```

Creating a `DefaultAzureCredential` object requires you to have `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` already set as environment variables with their corresponding values from your registered Azure AD application.

For a quick ramp-up on how to get these environment variables, you can follow the [Set up service principals from CLI quickstart](../../identity/service-principal-from-cli.md).

Once you have installed the `azure-identity` library, we can continue authenticating the client.

```python
import os
from azure.communication.phonenumbers.siprouting import SipRoutingClient
from azure.identity import DefaultAzureCredential

# You can find your endpoint from your resource in the Azure portal
endpoint = 'https://<RESOURCE_NAME>.communication.azure.com'
try:
    print('Azure Communication Services - Direct Routing Quickstart')
    credential = DefaultAzureCredential()
    sip_routing_client = SipRoutingClient(endpoint, credential)
except Exception as ex:
    print('Exception:')
    print(ex)
```

Alternatively, using the endpoint and access key from the communication resource to authenticate is also possible.

```python
import os
from azure.communication.phonenumbers.siprouting import SipRoutingClient

# You can find your connection string from your resource in the Azure portal
connection_string = 'https://<RESOURCE_NAME>.communication.azure.com/;accesskey=<YOUR_ACCESS_KEY>'
try:
    print('Azure Communication Services - Direct Routing Quickstart')
    sip_routing_client = SipRoutingClient.from_connection_string(connection_string)
except Exception as ex:
    print('Exception:')
    print(ex)
```

## Setup Direct Routing configuration

### Verify Domain Ownership

[How To: Domain validation](../../../how-tos/telephony/domain-validation.md)

### Create Trunks

Register your SBCs by providing their fully qualified domain names and port numbers.

```python
new_trunks = [SipTrunk(fqdn="sbc.us.contoso.com", sip_signaling_port=1234), SipTrunk(fqdn="sbc.eu.contoso.com", sip_signaling_port=1234)]
sip_routing_client.set_trunks(new_trunks)
```

### Create Routes

For outbound calling routing rules should be provided. Each rule consists of 2 parts: regex pattern, that should match destination phone number and FQDN of registered trunk, where call will be routed to when matched.

```python
us_route = SipTrunkRoute(name="UsRoute", description="Handle US numbers '+1'", number_pattern="^\\+1(\\d{10})$", trunks=["sbc.us.contoso.com"])
def_route = SipTrunkRoute(name="DefaultRoute", description="Handle all numbers", number_pattern="^\\+\\d+$", trunks=["sbc.us.contoso.com","sbc.eu.contoso.com"])
new_routes = [us_route, def_route]
sip_routing_client.set_routes(new_routes)
```

## Run the code

From a console prompt, navigate to the directory containing the *direct_routing_sample.py* file, then execute the following Python command to run the app.

```console
python direct_routing_sample.py
```

## Updating existing configuration

## Removing a direct routing configuration


> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/communication/azure-communication-phonenumbers/README.md).