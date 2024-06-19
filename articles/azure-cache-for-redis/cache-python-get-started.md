---
title: 'Quickstart: Use Azure Cache for Redis in Python'
description: In this quickstart, you learn how to create a Python App that uses Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois

ms.date: 02/15/2023
ms.topic: quickstart
ms.service: cache
ms.devlang: python
ms.custom: mvc, devx-track-python, mode-api, py-fresh-zinc
---
# Quickstart: Use Azure Cache for Redis in Python

In this article, you incorporate Azure Cache for Redis into a Python app to have access to a secure, dedicated cache that is accessible from any application within Azure.

## Skip to the code on GitHub

If you want to skip straight to the code, see the [Python quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/python) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 3
   - For macOS or Linux, download from [python.org](https://www.python.org/downloads/).
   - For Windows 11, use the [Windows Store](https://apps.microsoft.com/search/publisher?name=Python+Software+Foundation&hl=en-us&gl=US).

## Create an Azure Cache for Redis instance
[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

## Install redis-py library

[Redis-py](https://pypi.org/project/redis/) is a Python interface to Azure Cache for Redis. Use the Python packages tool, `pip`, to install the `redis-py` package from a command prompt. 

The following example used `pip3` for Python 3 to install `redis-py` on Windows 11 from an Administrator command prompt.

:::image type="content" source="media/cache-python-get-started/cache-python-install-redis-py.png" alt-text="Screenshot of a terminal showing an install of redis-py interface to Azure Cache for Redis.":::

## [Microsoft EntraID Authentication (recommended)](#tab/entraid)

## Enable Microsoft EntraID and add a User or Service Principal
<--Fran, we probably need an include file on enabling EntraID-->
Blah blah blah, do the steps listed [here](cache-azure-active-directory-for-authentication)

## Install the Microsoft Authentication Library
The [Microsoft Authentication Library (MSAL)](../../entra/identity-platform/msal-overview) allows you to acquire security tokens from Microsoft identity to authenticate users. There's a [Python Azure identity client library](../../python/api/overview/azure/identity-readme) available that uses MSAL to provide token authentication support. Install this library using `pip`:

```python
pip install azure-identity
```

## Create a sample python app
Create a new text file, add the following script, and save the file as `PythonApplication1.py`. Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`. Replace `<Your Username>` with the values from your Microsoft EntraID user.

```python
import redis
from azure.identity import DefaultAzureCredential

scope = "https://redis.azure.com/.default"
host = "<Your Host Name>"
port = 6380
user_name = "<Your Username>"


def hello_world():
    cred = DefaultAzureCredential()
    token = cred.get_token(scope)
    r = redis.Redis(host=host,
                    port=port,
                    ssl=True,    # ssl connection is required.
                    username=user_name,
                    password=token.token,
                    decode_responses=True)
    result = r.ping()
    print("Ping returned : " + str(result))

    result = r.set("Message", "Hello!, The cache is working with Python!")
    print("SET Message returned : " + str(result))

    result = r.get("Message")
    print("GET Message returned : " + result)

    result = r.client_list()
    print("CLIENT LIST returned : ")
    for c in result:
        print(f"id : {c['id']}, addr : {c['addr']}")

if __name__ == '__main__':
    hello_world()
```

Run `PythonApplication1.py` with Python. You should see results like the following example:

:::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

## Create a sample python app with reauthentication
Microsoft EntraID access tokens have limited lifespans, [averaging 75 minutes](../../entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). In order to maintain a connection to your cache, you need to refresh the token. This example demonstrates how to do this using Python. 

Create a new text file, add the following script, and save the file as `PythonApplication2.py`. Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`. Replace `<Your Username>` with the values from your Microsoft EntraID user.

```python
import time
import logging
import redis
from azure.identity import DefaultAzureCredential

scope = "https://redis.azure.com/.default"
host = "<Your Host Name>"
port = 6380
user_name = "<Your Username>"

def re_authentication():
    _LOGGER = logging.getLogger(__name__)
    cred = DefaultAzureCredential()
    token = cred.get_token(scope)
    r = redis.Redis(host=host,
                    port=port,
                    ssl=True,   # ssl connection is required.
                    username=user_name,
                    password=token.token,
                    decode_responses=True)
    max_retry = 3
    for index in range(max_retry):
        try:
            if _need_refreshing(token):
                _LOGGER.info("Refreshing token...")
                tmp_token = cred.get_token(scope)
                if tmp_token:
                    token = tmp_token
                r.execute_command("AUTH", user_name, token.token)
            result = r.ping()
            print("Ping returned : " + str(result))

            result = r.set("Message", "Hello!, The cache is working with Python!")
            print("SET Message returned : " + str(result))

            result = r.get("Message")
            print("GET Message returned : " + result)

            result = r.client_list()
            print("CLIENT LIST returned : ")
            for c in result:
                print(f"id : {c['id']}, addr : {c['addr']}")
            break
        except redis.ConnectionError:
            _LOGGER.info("Connection lost. Reconnecting.")
            token = cred.get_token(scope)
            r = redis.Redis(host=host,
                            port=port,
                            ssl=True,   # ssl connection is required.
                            username=user_name,
                            password=token.token,
                            decode_responses=True)
        except Exception:
            _LOGGER.info("Unknown failures.")
            break


def _need_refreshing(token, refresh_offset=300):
    return not token or token.expires_on - time.time() < refresh_offset

if __name__ == '__main__':
    re_authentication()
```

Run `PythonApplication2.py` with Python. You should see results like the following example:

:::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

Unlike the first example, If your token expires, this example automatically refreshes it. 

## [Access Key Authentication](#tab/accesskey)
[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Read and write to the cache from the command line


Run [Python from the command line](https://docs.python.org/3/faq/windows.html#id2) to test your cache. First, initiate the python interpreter in your command line by typing `py`, and then use the following code. Replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

```python
>>> import redis
>>> r = redis.Redis(host='<Your Host Name>',
        port=6380, db=0, password='<Your Access Key>', ssl=True)
>>> r.set('foo', 'bar')
True
>>> r.get('foo')
b'bar'
```

## Create a Python sample app

Create a new text file, add the following script, and save the file as `PythonApplication1.py`. Replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

```python
import redis

myHostname = "<Your Host Name>"
myPassword = "<Your Access Key>"

r = redis.Redis(host=myHostname, port=6380,
                      password=myPassword, ssl=True)

result = r.ping()
print("Ping returned : " + str(result))

result = r.set("Message", "Hello!, The cache is working with Python!")
print("SET Message returned : " + str(result))

result = r.get("Message")
print("GET Message returned : " + result)

result = r.client_list()
print("CLIENT LIST returned : ")
for c in result:
    print(f"id : {c['id']}, addr : {c['addr']}")
```

Run `PythonApplication1.py` with Python. You should see results like the following example:

:::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

---

## Clean up resources

If you're finished with the Azure resource group and resources you created in this quickstart, you can delete them to avoid charges.

> [!IMPORTANT]
> Deleting a resource group is irreversible, and the resource group and all the resources in it are permanently deleted. If you created your Azure Cache for Redis instance in an existing resource group that you want to keep, you can delete just the cache by selecting **Delete** from the cache **Overview** page. 

To delete the resource group and its Redis Cache for Azure instance:

1. From the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.

1. In the **Filter by name** text box, enter the name of the resource group that contains your cache instance, and then select it from the search results. 

1. On your resource group page, select **Delete resource group**.

1. Type the resource group name, and then select **Delete**.
   
   :::image type="content" source="./media/cache-python-get-started/delete-your-resource-group-for-azure-cache-for-redis.png" alt-text="Screenshot of the Azure portal showing how to delete the resource group for Azure Cache for Redis.":::

## Next steps

- [Create a simple ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
