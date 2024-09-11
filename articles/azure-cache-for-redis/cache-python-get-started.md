---
title: 'Quickstart: Use Azure Cache for Redis in Python'
description: In this quickstart, you learn how to create a Python script that uses Azure Cache for Redis.



ms.date: 07/09/2024
ms.topic: quickstart

ms.devlang: python
ms.custom: mvc, devx-track-python, mode-api, py-fresh-zinc

#customer intent: As a cloud developer, I want to quickly see a cache so that understand how to use Python with Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis in Python

In this Quickstart, you incorporate Azure Cache for Redis into a Python script to have access to a secure, dedicated cache that is accessible from any application within Azure.

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

## Create a Python script to access your cache

Create a Python script to that uses either Microsoft Entra ID or access keys to connect to an Azure Cache for Redis. We recommend you use Microsoft Entra ID.

## [Microsoft Entra ID Authentication (recommended)](#tab/entraid)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install the Microsoft Authentication Library

1. Install the [Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview). This library allows you to acquire security tokens from Microsoft identity to authenticate users.

1. You can use the [Python Azure identity client library](/python/api/overview/azure/identity-readme) available that uses MSAL to provide token authentication support. Install this library using `pip`:

  ```python
  pip install azure-identity
  ```

### Create a Python script using Microsoft Entra ID

1. Create a new text file, add the following script, and save the file as `PythonApplication1.py`.

1. Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

1. Replace `<Your Username>` with the values from your Microsoft Entra ID user.

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

1. Before you run your Python code from a Terminal, make sure you authorize the terminal for using Microsoft Entra ID.
  
    `azd auth login`

1. Run `PythonApplication1.py` with Python. You should see results like the following example:

   :::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

### Create a Python script using reauthentication

Microsoft Entra ID access tokens have limited lifespans, [averaging 75 minutes](/entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). In order to maintain a connection to your cache, you need to refresh the token. This example demonstrates how to do this using Python. 

1. Create a new text file, add the following script. Then, save the file as `PythonApplication2.py`.

1. Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`. 

1. Replace `<Your Username>` with the values from your Microsoft Entra ID user.

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

1. Run `PythonApplication2.py` with Python. You should see results like the following example:

   :::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

   Unlike the first example, If your token expires, this example automatically refreshes it.

## [Access Key Authentication](#tab/accesskey)

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

### Read and write to the cache from the command line

Run [Python from the command line](https://docs.python.org/3/faq/windows.html#id2) to test your cache. First, initiate the Python interpreter in your command line by typing `py`, and then use the following code. Replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

```python
>>> import redis
>>> r = redis.Redis(host='<Your Host Name>',
        port=6380, db=0, password='<Your Access Key>', ssl=True)
>>> r.set('foo', 'bar')
True
>>> r.get('foo')
b'bar'
```

### Create a Python script using access keys

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

<!-- Clean up resources -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Create a ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
