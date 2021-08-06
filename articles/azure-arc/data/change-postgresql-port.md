---
title: Change the PostgreSQL port
description: Change the port on which the Azure Arc—enabled PostgreSQL Hyperscale server group is listening.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---


# Change the port on which the server group is listening 

Changing the port is a standard edit operation of the server group. In order to change the port, run the following command:
```azurecli
 az postgres arc-server edit -n <server group name> --port <desired port number> --k8s-namespace <namespace> --use-k8s
```

For example, let's assume the name of your server group is _postgres01_ and you would like it to listen on port _866_. You would run the following command:
```azurecli
 az postgres arc-server edit -n postgres01 --port 866 --k8s-namespace <namespace> --use-k8s
```

## Verify that the port was changed

To verify that the port was changed, run the following command to show the configuration of your server group:
```azurecli
az postgres arc-server show -n <server group name> --k8s-namespace <namespace> --use-k8s
```

In the output of that command, look at the port number displayed for the item "port" in the "service" section of the specifications of your server group.
Alternatively, you can verify in the item externalEndpoint of the status section of the specifications of your server group that the IP address is followed by the port number you configured.

As an illustration, if we continue the example above, you would run the command:
```azurecli
az postgres arc-server show -n postgres01 --k8s-namespace <namespace> --use-k8s
```

and you would see port 866 referred to here:

```console
"service": {
      "port": 866,
      "type": "LoadBalancer"
    },
```
and here

```console
"status": {
    "externalEndpoint": "12.678.345.09:866",
    "logSearchDashboard": "https://12.345.678.90:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:postgres01'))",
    "metricsDashboard": "https://12.345.678.90:30777/grafana/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01",
    "readyPods": "3/3",
    "state": "Ready"
  }
```
## Next steps
- Read about [how to connect to your server group](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md).
- Read about how you can configure other aspects of your server group in the section How-to\Manage\Configure & scale section of the documentation.
