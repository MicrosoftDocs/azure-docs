---
title: How to create Azure Maps applications using the Python REST SDK (preview)
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the Python SDK Developers Guide.
author: sinnypan
ms.author: sipa
ms.date: 01/15/2021
ms.topic: how-to
ms.service: azure-maps
ms.custom: devx-track-python
services: azure-maps
---

# Python REST SDK Developers Guide (preview)

The Azure Maps Python SDK can be integrated with Python applications and libraries to build map-related and location-aware applications. The Azure Maps Python SDK contains APIs for Search, Route, Render and Geolocation. These APIs support operations such as searching for an address, routing between different coordinates, obtaining the geo-location of a specific IP address.

## Prerequisites

- [Azure Maps account].
- [Subscription key] or other form of [Authentication with Azure Maps].
- Python on 3.7 or later. It's recommended to use the [latest release]. For more information, see [Azure SDK for Python version support policy].

> [!TIP]
> You can create an Azure Maps account programmatically, Here's an example using the Azure CLI:
>
> ```azurecli
> az maps account create --kind "Gen2" --account-name "myMapAccountName" --resource-group "<resource group>" --sku "G2"
> ```

## Create a python project

The following example shows how to create a console program named `demo` with Python:

```powershell
mkdir mapsDemo 
cd mapsDemo 
New-Item demo.py 
```

### Install needed python packages

Each service in Azure Maps is contained in its own package. When using the Azure Maps Python SDK, you can install just the packages of the services you need.

Here we install the Azure Maps Search package. Since it’s still in public preview, you need to add the `--pre` flag:  

```powershell
pip install azure-maps-search --pre 
```

### Azure Maps services

Azure Maps Python SDK supports Python version 3.7 or later. For more information on future Python versions, see [Azure SDK for Python version support policy].

| Service name               | PyPi package            |  Samples     |
|----------------------------|-------------------------|--------------|
| [Search][py search readme] | [azure-maps-search][py search package] | [search samples][py search sample] |
| [Route][py route readme]   | [azure-maps-route][py route package] |  [route samples][py route sample] |
| [Render][py render readme] | [azure-maps-render][py render package]|[render sample][py render sample] |
| [Geolocation][py geolocation readme]|[azure-maps-geolocation][py geolocation package]|[geolocation sample][py geolocation sample] |

## Create and authenticate a MapsSearchClient

You need a `credential` object for authentication when creating the `MapsSearchClient` object used to access the Azure Maps search APIs. You can use either an Azure Active Directory (Azure AD) credential or an Azure subscription key to authenticate. For more information on authentication, see [Authentication with Azure Maps].

> [!TIP]
> The`MapsSearchClient` is the primary interface for developers using the Azure Maps search library. See [Azure Maps Search package client library] to learn more about the search methods available.

### Using an Azure AD credential

You can authenticate with Azure AD using the [Azure Identity package]. To use the [DefaultAzureCredential] provider, you need to install the Azure Identity client package:

```powershell
pip install azure-identity 
```

You need to register the new Azure AD application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources]. The Application (client) ID, a Directory (tenant) ID, and a client secret are returned. Copy these values and store them in a secure place. You need them in the following steps.

Next you need to specify the Azure Maps account you intend to use by specifying the maps’ client ID. The Azure Maps account client ID can be found in the Authentication sections of the Azure Maps account. For more information, see [View authentication details].

Set the values of the Application (client) ID, Directory (tenant) ID, and client secret of your Azure AD application, and the map resource’s client ID as environment variables:

| Environment Variable | Description                                                   |
|----------------------|---------------------------------------------------------------|
| AZURE_CLIENT_ID      | Application (client) ID in your registered application        |
| AZURE_CLIENT_SECRET  | The value of the client secret in your registered application |
| AZURE_TENANT_ID      | Directory (tenant) ID in your registered application          |
| MAPS_CLIENT_ID       | The client ID in your Azure Map account                      |

Now you can create environment variables in PowerShell to store these values:

```powershell
$Env:AZURE_CLIENT_ID="Application (client) ID"
$Env:AZURE_CLIENT_SECRET="your client secret"
$Env:AZURE_TENANT_ID="your Directory (tenant) ID"
$Env:MAPS_CLIENT_ID="your Azure Maps client ID"
```

After setting up the environment variables, you can use them in your program to instantiate the `AzureMapsSearch` client. Create a file named *demo.py* and add the following code:

```Python
import os
from azure.identity import DefaultAzureCredential 
from azure.maps.search import MapsSearchClient 

credential = DefaultAzureCredential()
maps_client_id = os.getenv("MAPS_CLIENT_ID")
maps_search_client = MapsSearchClient(
    client_id=maps_client_id,
    credential=credential
)
```

> [!IMPORTANT]
> The other environment variables created in the previous code snippet, while not used in the code sample, are required by `DefaultAzureCredential()`. If you do not set these environment variables correctly, using the same naming conventions, you will get run-time errors. For example, if your `AZURE_CLIENT_ID` is missing or invalid you will get an `InvalidAuthenticationTokenTenant` error.

### Using a subscription key credential

You can authenticate with your Azure Maps subscription key. Your subscription key can be found in the **Authentication** section in the Azure Maps account as shown in the following screenshot:

:::image type="content" source="./media/rest-sdk-dev-guides/subscription-key.png" alt-text="A screenshot showing the subscription key in the Authentication section of an Azure Maps account." lightbox="./media/rest-sdk-dev-guides/subscription-key.png":::

Now you can create environment variables in PowerShell to store the subscription key:

```powershell
$Env:SUBSCRIPTION_KEY="your subscription key"
```

Once your environment variable is created, you can access it in your code. Create a file named *demo.py* and add the following code:

```Python
import os

from azure.core.credentials import AzureKeyCredential
from azure.maps.search import MapsSearchClient

# Use Azure Maps subscription key authentication
subscription_key = os.getenv("SUBSCRIPTION_KEY")
maps_search_client = MapsSearchClient(
   credential=AzureKeyCredential(subscription_key)
)
```

## Fuzzy Search an Entity

The following code snippet demonstrates how, in a simple console application, to import the `Azure.Maps.Search` package and perform a fuzzy search on “Starbucks” near Seattle.  This example uses subscription key credentials to authenticate MapsSearchClient. In `demo.py`:

```Python
import os 
from azure.core.credentials import AzureKeyCredential 
from azure.maps.search import MapsSearchClient 

def fuzzy_search(): 
    # Use Azure Maps subscription key authentication 
    subscription_key = os.getenv("SUBSCRIPTION_KEY")
    maps_search_client = MapsSearchClient(
        credential=AzureKeyCredential(subscription_key)
    )
    result = maps_search_client.fuzzy_search(
        query="Starbucks",
        coordinates=(47.61010, -122.34255)
    )
    
    # Print the search results
    if len(result.results) > 0:
        print("Starbucks search result nearby Seattle:")
        for result_item in result.results:
            print(f"* {result_item.address.street_number }   {result_item.address.street_name }")
            print(f"  {result_item.address.municipality } {result_item.address.country_code } {result_item.address.postal_code }")
            print(f"  Coordinate: {result_item.position.lat}, {result_item.position.lon}") 

if __name__ == '__main__': 
    fuzzy_search() 
```

This sample code instantiates `AzureKeyCredential` with the Azure Maps subscription key, then uses it to instantiate the `MapsSearchClient` object. The methods provided by `MapsSearchClient` forward the request to the Azure Maps REST endpoints. In the end, the program iterates through the results and prints the address and coordinates for each result.

After finishing the program, run `python demo.py` from the project folder in PowerShell:

```powershell
python demo.py  
```

You should see a list of Starbucks address and coordinate results:

```text
* 1912 Pike Place 
  Seattle US 98101 
  Coordinate: 47.61016, -122.34248 
* 2118 Westlake Avenue 
  Seattle US 98121 
  Coordinate: 47.61731, -122.33782 
* 2601 Elliott Avenue 
  Seattle US 98121 
  Coordinate: 47.61426, -122.35261 
* 1730 Howell Street 
  Seattle US 98101 
  Coordinate: 47.61716, -122.3298 
* 220 1st Avenue South 
  Seattle US 98104 
  Coordinate: 47.60027, -122.3338 
* 400 Occidental Avenue South 
  Seattle US 98104 
  Coordinate: 47.5991, -122.33278 
* 1600 East Olive Way 
  Seattle US 98102 
  Coordinate: 47.61948, -122.32505 
* 500 Mercer Street 
  Seattle US 98109 
  Coordinate: 47.62501, -122.34687 
* 505 5Th Ave S 
  Seattle US 98104 
  Coordinate: 47.59768, -122.32849 
* 425 Queen Anne Avenue North 
  Seattle US 98109 
  Coordinate: 47.62301, -122.3571 
```

## Search an Address

Call the `SearchAddress` method to get the coordinate of an address. Modify the Main program from the sample as follows:

```Python
import os
from azure.core.credentials import AzureKeyCredential
from azure.maps.search import MapsSearchClient

def search_address():
    subscription_key = os.getenv("SUBSCRIPTION_KEY")

    maps_search_client = MapsSearchClient(
       credential=AzureKeyCredential(subscription_key)
    )

    result = maps_search_client.search_address( 
        query="1301 Alaskan Way, Seattle, WA 98101, US" 
    )
    
    # Print reuslts if any
    if len(result.results) > 0:
        print(f"Coordinate: {result.results[0].position.lat}, {result.results[0].position.lon}")
    else:
        print("No address found")

if __name__ == '__main__':
    search_address()
```

The `SearchAddress` method returns results ordered by confidence score and prints the coordinates of the first result.

## Batch reverse search

Azure Maps Search also provides some batch query methods. These methods return long-running operations (LRO) objects. The requests might not return all the results immediately, so users can choose to wait until completion or query the result periodically. The following examples demonstrate how to call the batched reverse search method.

Since these return LRO objects, you need the `asyncio` method included in the `aiohttp` package:

```powershell
pip install aiohttp
```

```Python
import asyncio
import os
from azure.core.credentials import AzureKeyCredential
from azure.maps.search.aio import MapsSearchClient

async def begin_reverse_search_address_batch(): 
    subscription_key = os.getenv("SUBSCRIPTION_KEY")

    maps_search_client = MapsSearchClient(AzureKeyCredential(subscription_key))

    async with maps_search_client:
        result = await maps_search_client.begin_reverse_search_address_batch(
            search_queries = [
                "148.858561,2.294911",
                "47.639765,-122.127896&radius=5000",
                "47.61559,-122.33817&radius=5000",
            ]
        )
    print(f"Batch_id: {result.batch_id}")

if __name__ == '__main__':
    # Special handle for Windows platform
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(begin_reverse_search_address_batch())
```

In the above example, three queries are passed to the batched reverse search request. To get the LRO results, the request creates a batch request with a batch ID as result that can be used to fetch batch response later. The LRO results are cached on the server side for 14 days.

The following example demonstrates the process of calling the batch ID and retrieving the operation results of the batch request:

```python
import asyncio
import os
from azure.core.credentials import AzureKeyCredential
from azure.maps.search.aio import MapsSearchClient

async def begin_reverse_search_address_batch():
    subscription_key = os.getenv("SUBSCRIPTION_KEY")

    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))

    async with maps_search_client:
        result = await maps_search_client.begin_reverse_search_address_batch(
            search_queries = [
                "148.858561,2.294911",
                "47.639765,-122.127896&radius=5000",
                "47.61559,-122.33817&radius=5000",
            ]
        )
    return result

async def begin_reverse_search_address_batch_with_id(batch_id):
    subscription_key = os.getenv("SUBSCRIPTION_KEY")
    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    async with maps_search_client:
        result = await maps_search_client.begin_reverse_search_address_batch(
            batch_id=batch_id,
        )

    responses = result._polling_method._initial_response.context.get('deserialized_data')
    summary = responses['summary']

    # Print Batch results
    idx = 1
    print(f"Total Batch Requests: {summary['totalRequests']}, Total Successful Results: {summary['successfulRequests']}")
    for items in responses.get('batchItems'):
        if items['statusCode'] == 200:
            print(f"Request {idx} result:")
            for address in items['response']['addresses']:
                print(f"  {address['address']['freeformAddress']}")
        else:
            print(f"Error in request {idx}: {items['response']['error']['message']}")
        idx += 1

async def main():
    result = await begin_reverse_search_address_batch()
    await begin_reverse_search_address_batch_with_id(result.batch_id)

if __name__ == '__main__': 
    # Special handle for Windows platform 
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
```

## Additional information

The [Azure Maps Search package client library] in the *Azure SDK for Python Preview* documentation.

<!--------------------------------------------------------------------------------------------------------------->
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Authentication with Azure Maps]: azure-maps-authentication.md

[Azure Maps Search package client library]: /python/api/overview/azure/maps-search-readme?view=azure-python-preview&preserve-view=true
[latest release]: https://www.python.org/downloads/

<!--  Python SDK Developers Guide  --->
[Azure SDK for Python version support policy]: https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy
[py search package]: https://pypi.org/project/azure-maps-search
[py search readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-search/README.md
[py search sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-search/samples
[py route package]: https://pypi.org/project/azure-maps-route
[py route readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-route/README.md
[py route sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-route/samples
[py render package]: https://pypi.org/project/azure-maps-render
[py render readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-render/README.md
[py render sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-render/samples
[py geolocation package]: https://pypi.org/project/azure-maps-geolocation
[py geolocation readme]: https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/maps/azure-maps-geolocation/README.md
[py geolocation sample]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/maps/azure-maps-geolocation/samples

<!--- Authentication ---->
[Azure Identity package]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity
[DefaultAzureCredential]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#DefaultAzureCredential
[Host a daemon on non-Azure resources]: ./how-to-secure-daemon-app.md#host-a-daemon-on-non-azure-resources
[View authentication details]: how-to-manage-authentication.md#view-authentication-details
