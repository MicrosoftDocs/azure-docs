---
title: 'Quickstart: Use Azure Cache for Redis with Python'
description: Create a Python app and connect the app to Azure Cache for Redis.



ms.date: 07/09/2024
ms.topic: quickstart

ms.devlang: python
ms.custom: mvc, devx-track-python, mode-api, py-fresh-zinc
#Customer intent: As a Python developer who is new to Azure Cache for Redis, I want to create a new Python app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a Python app

In this quickstart, you incorporate Azure Cache for Redis into a Python script for access to a secure, dedicated cache that is accessible from any application in Azure.

## Skip to the code

This article describes how to create a Python app and then modify the code to end up with a working sample app.

If you want to skip straight to the code, see the [Python quickstart sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/python) on GitHub.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
- Python 3
  - For macOS or Linux, download from [python.org](https://www.python.org/downloads/).
  - For Windows 11, use the [Windows Store](https://apps.microsoft.com/search/publisher?name=Python+Software+Foundation&hl=en-us&gl=US).

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

## Install the redis-py library

[Redis-py](https://pypi.org/project/redis/) is a Python interface to Azure Cache for Redis. Use the Python packages tool pip to install the redis-py package at a command line.

The following example uses `pip3` for Python 3 to install redis-py on Windows 11 in an Administrator Command Prompt window.

:::image type="content" source="media/cache-python-get-started/cache-python-install-redis-py.png" alt-text="Screenshot of a terminal showing an install of redis-py interface to Azure Cache for Redis.":::

## Create a Python script to access your cache

Create a Python script that uses either Microsoft Entra ID or access keys to connect to Azure Cache for Redis. We recommend that you use Microsoft Entra ID.

## [Microsoft Entra ID authentication (recommended)](#tab/entraid)

[!INCLUDE [cache-entra-access](includes/cache-entra-access.md)]

### Install Microsoft Authentication Library

[Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview) gets security tokens from the Microsoft identity platform to authenticate users.

To install MSAL:

1. Install [MSAL for Python](/entra/msal/python/).

1. Install the [Python Azure identity client library](/python/api/overview/azure/identity-readme). The library uses MSAL to provide token authentication support.

   Install this library by using pip:

  ```python
  pip install azure-identity
  ```

### Create a Python script by using Microsoft Entra ID

1. Create a text file. Save the file as *PythonApplication1.py*.

1. In *PythonApplication1.py*, add and modify the following script.

   In the script:

   - Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name has the form `<DNS name>.redis.cache.windows.net`.
   - Replace `<Your Username>` with the value for your Microsoft Entra ID user.

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

1. Before you run your Python code in a terminal, authorize the terminal to use Microsoft Entra ID:
  
    `azd auth login`

1. Run the *PythonApplication1.py* file by using Python. Verify that the output looks similar to this example:

   :::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

### Create a Python script by using reauthentication

A Microsoft Entra ID access token has a limited lifespan of approximately [75 minutes](/entra/identity-platform/configurable-token-lifetimes#token-lifetime-policies-for-access-saml-and-id-tokens). To maintain a connection to your cache, you must refresh the token.

This example demonstrates how to refresh a token by using Python.

1. Create a text file. Save the file as *PythonApplication2.py*.

1. In *PythonApplication2.py*, add and modify the following script.

   In the script:

   - Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name has the form `<DNS name>.redis.cache.windows.net`.
   - Replace `<Your Username>` with the value for your Microsoft Entra ID user.

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

1. Run the *PythonApplication2.py* file by using Python. Verify that the output looks similar to this example:

   :::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

   Unlike in the preceding example, if your token expires, the code in this example automatically refreshes the token.

## [Access key authentication](#tab/accesskey)

[!INCLUDE [redis-cache-access-keys](includes/redis-cache-access-keys.md)]

### Read and write to the cache at the command line

To test your cache, run [Python from the command line](https://docs.python.org/3/faq/windows.html#id2).

1. Initiate the Python interpreter in your command line by entering `py`.

1. Modify and then run the following code.

   In the code, replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name has the form `<DNS name>.redis.cache.windows.net`.

    ```python
    >>> import redis
    >>> r = redis.Redis(host='<Your Host Name>',
            port=6380, db=0, password='<Your Access Key>', ssl=True)
    >>> r.set('foo', 'bar')
    True
    >>> r.get('foo')
    b'bar'
    ```

### Create a Python script by using access keys

1. Create a new text file. Save the file as *PythonApplication1.py*.

1. In *PythonApplication1.py*, add and modify the following script.

   In the script:

   - Replace `<Your Host Name>` with the value from your Azure Cache for Redis instance. Your host name has the form `<DNS name>.redis.cache.windows.net`.
   - Replace `<Your Access Key>` with the value for your Microsoft Entra ID user.

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

1. Run the *PythonApplication1.py* file by using Python. Verify that results like the following example appear as output:

   :::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

---

<!-- Clean up resources -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Create a ASP.NET web app that uses Azure Cache for Redis](./cache-web-app-howto.md)
