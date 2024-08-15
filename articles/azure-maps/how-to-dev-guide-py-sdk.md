---
title: How to create Azure Maps applications using the Python REST SDK (preview)
titleSuffix: Azure Maps
description: How to develop applications that incorporate Azure Maps using the Python SDK Developers Guide.
author: sinnypan
ms.author: sipa
ms.date: 01/15/2021
ms.topic: how-to
ms.service: azure-maps
ms.subservice: rest-sdk
ms.custom: devx-track-python
---

# Python REST SDK Developers Guide (preview)

The Azure Maps Python SDK can be integrated with Python applications and libraries to build map-related and location-aware applications. The Azure Maps Python SDK contains APIs for Search, Route, Render and Geolocation. These APIs support operations such as searching for an address, routing between different coordinates, obtaining the geo-location of a specific IP address.

## Prerequisites

- [Azure Maps account].
- [Subscription key] or other form of [Authentication with Azure Maps].
- Python on 3.8 or later. It's recommended to use the [latest release]. For more information, see [Azure SDK for Python version support policy].

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

Azure Maps Python SDK supports Python version 3.8 or later. For more information on future Python versions, see [Azure SDK for Python version support policy].

| Service name               | PyPi package            |  Samples     |
|----------------------------|-------------------------|--------------|
| [Search][py search readme] | [azure-maps-search][py search package] | [search samples][py search sample] |
| [Route][py route readme]   | [azure-maps-route][py route package] |  [route samples][py route sample] |
| [Render][py render readme] | [azure-maps-render][py render package]|[render sample][py render sample] |
| [Geolocation][py geolocation readme]|[azure-maps-geolocation][py geolocation package]|[geolocation sample][py geolocation sample] |

## Create and authenticate a MapsSearchClient

You need a `credential` object for authentication when creating the `MapsSearchClient` object used to access the Azure Maps search APIs. You can use either a Microsoft Entra credential or an Azure subscription key to authenticate. For more information on authentication, see [Authentication with Azure Maps].

> [!TIP]
> The`MapsSearchClient` is the primary interface for developers using the Azure Maps search library. See [Azure Maps Search package client library] to learn more about the search methods available.

<a name='using-an-azure-ad-credential'></a>

### Using a Microsoft Entra credential

You can authenticate with Microsoft Entra ID using the [Azure Identity package]. To use the [DefaultAzureCredential] provider, you need to install the Azure Identity client package:

```powershell
pip install azure-identity 
```

You need to register the new Microsoft Entra application and grant access to Azure Maps by assigning the required role to your service principal. For more information, see [Host a daemon on non-Azure resources]. The Application (client) ID, a Directory (tenant) ID, and a client secret are returned. Copy these values and store them in a secure place. You need them in the following steps.

Next you need to specify the Azure Maps account you intend to use by specifying the maps’ client ID. The Azure Maps account client ID can be found in the Authentication sections of the Azure Maps account. For more information, see [View authentication details].

Set the values of the Application (client) ID, Directory (tenant) ID, and client secret of your Microsoft Entra application, and the map resource’s client ID as environment variables:

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

:::image type="content" border="false" source="./media/shared/get-key.png" alt-text="Screenshot showing your Azure Maps subscription key in the Azure portal." lightbox="./media/shared/get-key.png":::

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

## Geocode an address

The following code snippet demonstrates how, in a simple console application, to obtain longitude and latitude coordinates for a given address. This example uses subscription key credentials to authenticate MapsSearchClient. In `demo.py`:

```Python
import os

from azure.core.exceptions import HttpResponseError

subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "your subscription key")

def geocode():
    from azure.core.credentials import AzureKeyCredential
    from azure.maps.search import MapsSearchClient

    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    try:
        result = maps_search_client.get_geocoding(query="15127 NE 24th Street, Redmond, WA 98052")
        if result.get('features', False):
            coordinates = result['features'][0]['geometry']['coordinates']
            longitude = coordinates[0]
            latitude = coordinates[1]

            print(longitude, latitude)
        else:
            print("No results")

    except HttpResponseError as exception:
        if exception.error is not None:
            print(f"Error Code: {exception.error.code}")
            print(f"Message: {exception.error.message}")

if __name__ == '__main__':
    geocode()
```

This sample code instantiates `AzureKeyCredential` with the Azure Maps subscription key, then uses it to instantiate the `MapsSearchClient` object. The methods provided by `MapsSearchClient` forward the request to the Azure Maps REST endpoints. In the end, the program iterates through the results and prints the coordinates for each result.


## Batch geocode addresses

This sample demonstrates how to perform batch search address:

```Python
import os

from azure.core.exceptions import HttpResponseError

subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "your subscription key")

def geocode_batch():
    from azure.core.credentials import AzureKeyCredential
    from azure.maps.search import MapsSearchClient

    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    try:
        result = maps_search_client.get_geocoding_batch({
          "batchItems": [
            {"query": "400 Broad St, Seattle, WA 98109"},
            {"query": "15127 NE 24th Street, Redmond, WA 98052"},
          ],
        },)

        if not result.get('batchItems', False):
            print("No batchItems in geocoding")
            return

        for item in result['batchItems']:
            if not item.get('features', False):
                print(f"No features in item: {item}")
                continue

            coordinates = item['features'][0]['geometry']['coordinates']
            longitude, latitude = coordinates
            print(longitude, latitude)

    except HttpResponseError as exception:
        if exception.error is not None:
            print(f"Error Code: {exception.error.code}")
            print(f"Message: {exception.error.message}")

if __name__ == '__main__':
    geocode_batch()
```


## Make a Reverse Address Search to translate coordinate location to street address

You can translate coordinates into human-readable street addresses. This process is also called reverse geocoding. This is often used for applications that consume GPS feeds and want to discover addresses at specific coordinate points.

```python
import os

from azure.core.exceptions import HttpResponseError

subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "your subscription key")

def reverse_geocode():
    from azure.core.credentials import AzureKeyCredential
    from azure.maps.search import MapsSearchClient

    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    try:
        result = maps_search_client.get_reverse_geocoding(coordinates=[-122.138679, 47.630356])
        if result.get('features', False):
            props = result['features'][0].get('properties', {})
            if props and props.get('address', False):
                print(props['address'].get('formattedAddress', 'No formatted address found'))
            else:
                print("Address is None")
        else:
            print("No features available")
    except HttpResponseError as exception:
        if exception.error is not None:
            print(f"Error Code: {exception.error.code}")
            print(f"Message: {exception.error.message}")


if __name__ == '__main__':
   reverse_geocode()
```


## Batch request for reverse geocoding

This sample demonstrates how to perform reverse search by given coordinates in batch.

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError
from azure.maps.search import MapsSearchClient

subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "your subscription key")

def reverse_geocode_batch():
    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    try:
        result = maps_search_client.get_reverse_geocoding_batch({
              "batchItems": [
                {"coordinates": [-122.349309, 47.620498]},
                {"coordinates": [-122.138679, 47.630356]},
              ],
            },)

        if result.get('batchItems', False):
            for idx, item in enumerate(result['batchItems']):
                features = item['features']
                if features:
                    props = features[0].get('properties', {})
                    if props and props.get('address', False):
                        print(
                            props['address'].get('formattedAddress', f'No formatted address for item {idx + 1} found'))
                    else:
                        print(f"Address {idx + 1} is None")
                else:
                    print(f"No features available for item {idx + 1}")
        else:
            print("No batch items found")
    except HttpResponseError as exception:
        if exception.error is not None:
            print(f"Error Code: {exception.error.code}")
            print(f"Message: {exception.error.message}")


if __name__ == '__main__':
   reverse_geocode_batch()
```


## Get polygons for a given location

This sample demonstrates how to search polygons.

```python
import os

from azure.core.exceptions import HttpResponseError
from azure.maps.search import Resolution
from azure.maps.search import BoundaryResultType


subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY", "your subscription key")

def get_polygon():
    from azure.core.credentials import AzureKeyCredential
    from azure.maps.search import MapsSearchClient

    maps_search_client = MapsSearchClient(credential=AzureKeyCredential(subscription_key))
    try:
        result = maps_search_client.get_polygon(
          coordinates=[-122.204141, 47.61256],
          result_type=BoundaryResultType.LOCALITY,
          resolution=Resolution.SMALL,
        )

        if not result.get('geometry', False):
            print("No geometry found")
            return

        print(result["geometry"])
    except HttpResponseError as exception:
        if exception.error is not None:
            print(f"Error Code: {exception.error.code}")
            print(f"Message: {exception.error.message}")

if __name__ == '__main__':
    get_polygon()
```


## Using V1 SDKs for Search and Render

To use Search V1 and Render V1 SDK, please refer to Search V1 SDK [package](https://pypi.org/project/azure-maps-search/1.0.0/) page and Render V1 SDK [package](https://pypi.org/project/azure-maps-render/1.0.0/) for more information.


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
