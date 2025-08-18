---
title: Python API
description: Use the Azure CycleCloud Python API to interact with the CycleCloud REST API without having to perform HTTP requests manually.
author: rokeptne
ms.date: 07/01/2025
ms.author: rokeptne
---

# Python API

The CycleCloud Python API lets you interact with the CycleCloud REST API without manually handling HTTP requests. To get the API source distribution, go to */about* on your CycleCloud installation and select the **Download Python API** link. After you download the source distribution, use `pip install` to add it to your Python environment.

## Client objects

You can create a Client object with a specified configuration or without one. If you don't specify a configuration dictionary, the Client object automatically tries to get the configuration from the default CycleCloud CLI ini file (**~/.cycle/config.ini**).

Provide the configuration as a dictionary with the following key/value pairs:

  - `url` - *required*, the URL for the web interface to the CycleCloud installation
  - `username` - *required*
  - `password` - *required*, the plain text password for the user
  - `timeout` - the number of seconds before a timeout happens when trying to connect or communicate with the system (60 by default)
  - `verify_certificates` - a boolean that shows whether certificate checking should be enabled (True by default)

You can also provide these values as keyword arguments to the constructor.
```python
from cyclecloud.client import Client

# configuration read from ~/.cycle/config.ini
cl1 = Client() 

# config provided as dictionary
config = {"url": "http://127.0.0.1:8443",
          "username": "admin",
          "password": "password",
          "timeout": 60,
          "verify_certificates": False}
cl2 = Client(config)

# config provided as keyword arguments
cl3 = Client(url="http://127.0.0.1:8443", username="admin", password="password")
```

### Client properties

  - `session` - the Session object *- only used in making calls to the [Direct API](#direct-api)*

  - `clusters` - a map of the Cluster objects in the system, keyed by cluster name

## Cluster objects

A Cluster object gives you control over a specific cluster in a CycleCloud installation.

### Cluster properties

  - `name` - the name of the cluster that the object refers to

  - `nodes` - a list you can iterate through that contains the node records for the cluster

### Cluster functions

  - `get_status(nodes=False)` - Gets a [Cluster Status](api.md#clusterstatus) object of the cluster. You can choose to include the node list.

  - `scale_by_cores(node_array, total_core_count)` - Sets the system to scale the specified node array to the desired total core count. If the node array already contains more than `total_core_count` cores, the call has no effect.

  - `scale_by_nodes(node_array, total_node_count)` - Sets the system to scale the specified node array to the desired total node count. If the node array already contains more than `total_node_count` nodes, the call has no effect.

## Direct API

You can access the REST API more directly by using the API at `cyclecloud.api` and `cyclecloud.model`, which is generated directly from the [REST API](api.md). To use this API, create a Client object and make calls with the `session` property it provides.

```python
from cyclecloud.client import Client
from cyclecloud.api import clusters

cl1 = Client()

# prints the current state of the cluster
response_status, cluster_status = clusters.get_cluster_status(cl1.session, "test-cluster-1", nodes=False)
print(cluster_status.state)
```
