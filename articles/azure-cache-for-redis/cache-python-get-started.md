---
title: 'Quickstart: Use Azure Cache for Redis in Python'
description: In this quickstart, you learn how to create a Python App that uses Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois

ms.date: 02/15/2023
ms.topic: quickstart
ms.service: cache
ms.devlang: python
ms.custom: mvc, seo-python-october2019, devx-track-python, mode-api, py-fresh-zinc

---
# Quickstart: Use Azure Cache for Redis in Python

In this article, you incorporate Azure Cache for Redis into a Python app to have access to a secure, dedicated cache that is accessible from any application within Azure.

## Skip to the code on GitHub

If you want to skip straight to the code, see the [Python quickstart](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/quickstart/python) on GitHub.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 3
   - For macOS or Linux, download from [python.org](https://www.python.org/downloads/).
   - For Windows 11, use the [Windows Store](https://www.microsoft.com/en-us/p/python-3/9nblggh083nz?activetab=pivot:overviewtab).

## Create an Azure Cache for Redis instance
[!INCLUDE [redis-cache-create](includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Install redis-py

[Redis-py](https://pypi.org/project/redis/) is a Python interface to Azure Cache for Redis. Use the Python packages tool, `pip`, to install the `redis-py` package from a command prompt. 

The following example used `pip3` for Python 3 to install `redis-py` on Windows 11 from an Administrator command prompt.

:::image type="content" source="media/cache-python-get-started/cache-python-install-redis-py.png" alt-text="Screenshot of a terminal showing an install of redis-py interface to Azure Cache for Redis.":::

## Read and write to the cache

Run Python from the command line and test your cache by using the following code. Replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

```python
>>> import redis
>>> r = redis.StrictRedis(host='<Your Host Name>',
        port=6380, db=0, password='<Your Access Key>', ssl=True)
>>> r.set('foo', 'bar')
True
>>> r.get('foo')
b'bar'
```

> [!IMPORTANT]
> For Azure Cache for Redis version 3.0 or higher, TLS/SSL certificate check is enforced. `ssl_ca_certs` must be explicitly set when connecting to Azure Cache for Redis. For RedHat Linux, `ssl_ca_certs` are in the `/etc/pki/tls/certs/ca-bundle.crt` certificate module.

## Create a Python sample app

Create a new text file, add the following script, and save the file as `PythonApplication1.py`. Replace `<Your Host Name>` and `<Your Access Key>` with the values from your Azure Cache for Redis instance. Your host name is of the form `<DNS name>.redis.cache.windows.net`.

```python
import redis

myHostname = "<Your Host Name>"
myPassword = "<Your Access Key>"

r = redis.StrictRedis(host=myHostname, port=6380,
                      password=myPassword, ssl=True)

result = r.ping()
print("Ping returned : " + str(result))

result = r.set("Message", "Hello!, The cache is working with Python!")
print("SET Message returned : " + str(result))

result = r.get("Message")
print("GET Message returned : " + result.decode("utf-8"))

result = r.client_list()
print("CLIENT LIST returned : ")
for c in result:
    print(f"id : {c['id']}, addr : {c['addr']}")
```

Run `PythonApplication1.py` with Python. You should see results like the following example:

:::image type="content" source="media/cache-python-get-started/cache-python-completed.png" alt-text="Screenshot of a terminal showing a Python script to test cache access.":::

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
