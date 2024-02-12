---
title: include file
description: Learn how to use the Number Management Python SDK to configure direct routing.
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
- [Python](https://www.python.org/downloads/) 3.7+.
- A deployed Communication Services resource and a connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- The fully qualified domain name (FQDN) and port number of a session border controller (SBC) in an operational telephony system.
- The [verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC FQDN.

## Final code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/direct-routing-quickstart).

You can also find more usage examples for `SipRoutingClient` on [GitHub](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/communication/azure-communication-phonenumbers/README.md).

## Create a Python application

Open your terminal or command window. Create a new directory for your app, and then go to it:

```console
mkdir direct-routing-quickstart && cd direct-routing-quickstart
```

Use a text editor to create a file called *direct_routing_sample.py* in the project root directory and add the following code:

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

You add the remaining quickstart code in the following sections.

## Install the package

While you're still in the application directory, install the Azure Communication Services Administration client library for Python by using the `pip install` command:

```console
pip install azure-communication-phonenumbers==1.1.0
```

## Authenticate the client

With `SipRoutingClient`, you can use Microsoft Entra authentication. Using the `DefaultAzureCredential` object is the easiest way to get started with Microsoft Entra ID, and you can install it by using the `pip install` command:

```console
pip install azure-identity
```

Creating a `DefaultAzureCredential` object requires you to have `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` already set as environment variables with their corresponding values from your registered Microsoft Entra application. For a quick way to get these environment variables, see [Authenticate using Microsoft Entra ID](../../identity/service-principal.md).

After you've installed the `azure-identity` library, you can continue with authenticating the client:

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

Alternatively, you can use the endpoint and access key from the communication resource to authenticate:

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

## Set up a direct routing configuration

In the [prerequisites](#prerequisites), you verified domain ownership. The next steps are to create trunks (add SBCs) and create voice routes.

### Create or update trunks

Register your SBCs by providing their fully qualified domain names and port numbers:

```python
new_trunks = [SipTrunk(fqdn="sbc.us.contoso.com", sip_signaling_port=1234), SipTrunk(fqdn="sbc.eu.contoso.com", sip_signaling_port=1234)]
sip_routing_client.set_trunks(new_trunks)
```

### Create or update routes

Provide routing rules for outbound calls. Each rule consists of two parts: a regex pattern that should match a dialed phone number, and the FQDN of a registered trunk where the call is routed.

The order of routes determines the priority of routes. The first route that matches the regex will be picked for a call.

In this example, you create one route for numbers that start with `+1` and a second route for numbers that start with just `+`:

```python
us_route = SipTrunkRoute(name="UsRoute", description="Handle US numbers '+1'", number_pattern="^\\+1(\\d{10})$", trunks=["sbc.us.contoso.com"])
def_route = SipTrunkRoute(name="DefaultRoute", description="Handle all numbers", number_pattern="^\\+\\d+$", trunks=["sbc.us.contoso.com","sbc.eu.contoso.com"])
new_routes = [us_route, def_route]
sip_routing_client.set_routes(new_routes)
```

## Update a direct routing configuration

You can update the properties of a specific trunk by overwriting the record with the same FQDN. For example, you can set a new SBC port value:

``` python
new_trunk = SipTrunk(fqdn="sbc.us.contoso.com", sip_signaling_port=5063)
sip_routing_client.set_trunk(new_trunk)
```

You use the same method to create and update routing rules. When you update routes, send all of them in a single update. The new routing configuration fully overwrites the former one.

## Remove a direct routing configuration

You can't edit or remove a single voice route. You should overwrite the entire voice routing configuration. Here's an example of an empty list that removes all the routes and trunks:

``` python
#delete all configured voice routes
print('Deleting all routes...')
sip_routing_client.set_routes([])

#delete all trunks
print('Deleting all trunks...')
sip_routing_client.set_trunks([])
```

You can use the following example to delete a single trunk (SBC), if no voice routes are using it. If the SBC is listed in any voice route, delete that route first.

``` python
sip_routing_client.delete_trunk("sbc.us.contoso.com")
```

## Run the code

From a console prompt, go to the directory that contains the *direct_routing_sample.py* file. Then run the following Python command to run the app:

```console
python direct_routing_sample.py
```
