---
title: Diagnose and troubleshoot Azure Cosmos DB Python SDK
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues in Python SDK.
author: kushagraThapar
ms.service: cosmos-db
ms.date: 04/08/2024
ms.author: kuthapar
ms.devlang: python
ms.subservice: nosql
ms.topic: troubleshooting
ms.custom: devx-track-python, devx-track-extended-python
---

# Troubleshoot issues when you use Azure Cosmos DB Python SDK with API for NoSQL accounts
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

> [!div class="op_single_selector"]
> * [Python SDK](troubleshoot-python-sdk.md)
> * [Java SDK v4](troubleshoot-java-sdk-v4.md)
> * [Async Java SDK v2](troubleshoot-java-async-sdk.md)
> * [.NET](troubleshoot-dotnet-sdk.md)
>

> [!IMPORTANT]
> This article covers troubleshooting for Azure Cosmos DB Python SDK only. Please see the Azure Cosmos DB Python SDK [Readme](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/README.md#azure-cosmos-db-sql-api-client-library-for-python) [Release notes](sdk-python.md), [Package (PyPI)](https://pypi.org/project/azure-cosmos), [Package (Conda)](https://anaconda.org/microsoft/azure-cosmos/), and [performance tips](performance-tips-python-sdk.md) for more information.
>

This article covers common issues, workarounds, diagnostic steps, and tools when you use Azure Cosmos DB Python SDK with Azure Cosmos DB for NoSQL accounts.
Azure Cosmos DB Python SDK provides client-side logical representation to access the Azure Cosmos DB for NoSQL. This article describes tools and approaches to help you if you run into any issues.

Start with this list:

* Take a look at the [Common issues and workarounds](#common-issues-and-workarounds) section in this article.
* Look at the Python SDK in the Azure Cosmos DB central repo, which is available [open source on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos). It has an [issues section](https://github.com/Azure/azure-sdk-for-python/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed. One helpful tip is to filter issues by the `*Cosmos*` tag.
* Review the [performance tips](performance-tips-python-sdk.md) for Azure Cosmos DB Python SDK, and follow the suggested practices.
* Read the rest of this article, if you didn't find a solution. Then file a [GitHub issue](https://github.com/Azure/azure-sdk-for-python/issues). If there's an option to add tags to your GitHub issue, add a `*Cosmos*` tag.

## Logging and capturing the diagnostics

> [!IMPORTANT]
> We recommend using the latest version of python SDK. You can check the release history [here](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/cosmos/azure-cosmos/CHANGELOG.md#release-history) 

This library uses the standard [logging](https://docs.python.org/3.5/library/logging.html) library for logging diagnostics.
Basic information about HTTP sessions (URLs, headers, etc.) is logged at INFO level.

Detailed DEBUG level logging, including request/response bodies and unredacted headers, can be enabled on a client with the `logging_enable` argument:

```python
import sys
import logging
from azure.cosmos import CosmosClient

# Create a logger for the 'azure' SDK
logger = logging.getLogger('azure')
logger.setLevel(logging.DEBUG)

# Configure a console output
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

# This client will log detailed information about its HTTP sessions, at DEBUG level
client = CosmosClient(URL, credential=KEY, logging_enable=True)
```

Similarly, `logging_enable` can enable detailed logging for a single operation,
even when it isn't enabled for the client:

```python
database = client.create_database(DATABASE_NAME, logging_enable=True)
```

Alternatively, you can log using the `CosmosHttpLoggingPolicy`, which extends from the azure core `HttpLoggingPolicy`, by passing in your logger to the `logger` argument.
By default, it will use the behavior from `HttpLoggingPolicy`. Passing in the `enable_diagnostics_logging` argument will enable the
`CosmosHttpLoggingPolicy`, and will have additional information in the response relevant to debugging Cosmos issues.

```python
import logging
from azure.cosmos import CosmosClient

#Create a logger for the 'azure' SDK
logger = logging.getLogger('azure')
logger.setLevel(logging.DEBUG)

# Configure a file output
handler = logging.FileHandler(filename="azure")
logger.addHandler(handler)

# This client will log diagnostic information from the HTTP session by using the CosmosHttpLoggingPolicy.
# Since we passed in the logger to the client, it will log information on every request.
client = CosmosClient(URL, credential=KEY, logger=logger, enable_diagnostics_logging=True)
```
Similarly, logging can be enabled for a single operation by passing in a logger to the singular request.
However, if you desire to use the `CosmosHttpLoggingPolicy` to obtain additional information, the `enable_diagnostics_logging` argument needs to be passed in at the client constructor.

```python
# This example enables the `CosmosHttpLoggingPolicy` and uses it with the `logger` passed in to the `create_database` request.
client = CosmosClient(URL, credential=KEY, enable_diagnostics_logging=True)
database = client.create_database(DATABASE_NAME, logger=logger)
```

## Retry design
See our guide to [designing resilient applications with Azure Cosmos DB SDKs](conceptual-resilient-sdk-applications.md) for guidance on how to design resilient applications and learn which are the retry semantics of the SDK.

## Common issues and workarounds

### General suggestions
For best performance:
* Make sure the app is running on the same region as your Azure Cosmos DB account. 
* Check the CPU usage on the host where the app is running. If CPU usage is 50 percent or more, run your app on a host with a higher configuration. Or you can distribute the load on more machines.
    * If you're running your application on Azure Kubernetes Service, you can [use Azure Monitor to monitor CPU utilization](../../azure-monitor/containers/container-insights-analyze.md).

### Check the portal metrics

Checking the [portal metrics](../monitor.md) will help determine if it's a client-side issue or if there's an issue with the service. For example, if the metrics contain a high rate of rate-limited requests (HTTP status code 429) which means the request is getting throttled then check the [Request rate too large](troubleshoot-request-rate-too-large.md) section.

### Connection throttling
Connection throttling can happen because of either a [connection limit on a host machine] or [Azure SNAT (PAT) port exhaustion].

#### Connection limit on a host machine
Some Linux systems, such as Red Hat, have an upper limit on the total number of open files. Sockets in Linux are implemented as files, so this number limits the total number of connections, too.
Run the following command.

```bash
ulimit -a
```
The number of max allowed open files, which are identified as "nofile," needs to be at least double your connection pool size. For more information, see the Azure Cosmos DB Python SDK [performance tips](performance-tips-python-sdk.md).

#### Azure SNAT (PAT) port exhaustion

If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](../../load-balancer/load-balancer-outbound-connections.md#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](../../load-balancer/load-balancer-outbound-connections.md#preallocatedports).

 Azure SNAT ports are used only when your VM has a private IP address and a process from the VM tries to connect to a public IP address. There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](/previous-versions/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

#### Can't reach the service - firewall
``azure.core.exceptions.ServiceRequestError:`` indicates that the SDK can't reach the service. Follow the [Connection limit on a host machine](#connection-limit-on-a-host-machine).

### Failure connecting to Azure Cosmos DB emulator

The Azure Cosmos DB Emulator HTTPS certificate is self-signed. For the Python SDK to work with the emulator, import the emulator certificate. For more information, see [Export Azure Cosmos DB Emulator certificates](../emulator.md).

#### HTTP proxy

If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

### Common query issues

The [query metrics](query-metrics.md) will help determine where the query is spending most of the time. From the query metrics, you can see how much of it's being spent on the back-end vs the client. Learn more on the [query performance guide](performance-tips-query-sdk.md?pivots=programming-language-python).

## Next steps

* Learn about Performance guidelines for the [Python SDK](performance-tips-python-sdk.md)
* Learn about the best practices for the [Python SDK](best-practice-python.md)
