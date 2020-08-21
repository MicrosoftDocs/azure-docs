---
title: Python API
description: Use the Azure CycleCloud Python API to interact with the CycleCloud REST API without having to perform HTTP requests manually.
author: rokeptne
ms.date: 07/16/2019
ms.author: rokeptne
---

# Python API

The CycleCloud Python API allows you to interact with the CycleCloud REST API without having to manually perform the HTTP requests. To acquire the API source distribution, navigate to */about* on your CycleCloud installation and click on the **Download Python API** link. Once you have the source distribution you can `pip install` it into your python environment and get started.

## Client Objects

A Client object can be constructed with or without a configuration specified. If you don't specify a config dictionary it will automatically attempt to pull the configuration from the default CycleCloud CLI ini file (*~/.cycle/config.ini*).

The configuration can be provided as a dict with the following key/value pairs:

  - `url` - *required*, the url of the web interface to the CycleCloud installation
  - `username` - *required*
  - `password` - *required*, the plain text password of the user
  - `timeout` - the time, in seconds, before a timeout error will occur when attempting to connect/communicate with the system (60 by default)
  - `verify_certificates` - a boolean indicating whether certificate checking should be enabled (True by default)

Alternatively, these values can be given as keyword arguments to the constructor.
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

## Cluster Objects

A Cluster object allows control over a specific cluster in a CycleCloud installation.

```python
from cyclecloud.client import Client
cl1 = Client()

# gets a Cluster object for a cluster named "test-cluster-1" from the client cl1
cluster_obj = cl1.clusters["test-cluster-1"]

# prints the current state of the cluster
print(cluster_obj.get_status().state)

# start up to 5 new cores
cluster_obj.scale_by_cores("execute", 5)
```

### Cluster properties

  - `name` - the name of the cluster this object refers to

  - `nodes` - an iterable list of the node records that comprise this cluster

### Cluster functions

  - `get_status(nodes=False)` - Gets a [Cluster Status](api.md#clusterstatus) object of the cluster, optionally populating the node list as well.

  - `scale_by_cores(node_array, total_core_count)` - Sets the system to scale the specified node array to the desired total core count. If the node array already contains more than `total_core_count` cores then the call will have no effect.

  - `scale_by_nodes(node_array, total_node_count)` - Sets the system to scale the specified node array to the desired total node count. If the node array already contains more than `total_node_count` nodes then the call will have no effect.

## Direct API

The rest API can be accessed in a more direct manner by using the api at `cyclecloud.api` and `cyclecloud.model` which is generated directly from the [REST API](api.md). To do so you simply construct a Client object and make calls using the `session` property provided on it.

```python
from cyclecloud.client import Client
from cyclecloud.api import clusters

cl1 = Client()

# prints the current state of the cluster
response_status, cluster_status = clusters.get_cluster_status(cl1.session, "test-cluster-1", nodes=False)
print(cluster_status.state)
```

