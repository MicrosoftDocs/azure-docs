---
title: Change the PostgreSQL port
description: Change the port on which the Azure Arc-enabled PostgreSQL server is listening.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---


# Change the port on which the server group is listening 

To change the port, edit the server group. For example, run the following command:

```azurecli
 az postgres server-arc update -n <server name> --port <desired port number> --k8s-namespace <namespace> --use-k8s
```

If the name of your server group is _postgres01_ and you would like it to listen on port _866_. Run the following command:

```azurecli
 az postgres server-arc update -n postgres01 --port 866 --k8s-namespace arc --use-k8s
```

## Verify that the port was changed

To verify that the port was changed, run the following command to show the configuration of your server group:

```azurecli
az postgres server-arc show -n <server name> --k8s-namespace <namespace> --use-k8s
```

In the output of that command, look at the port number displayed for the item "port" in the "service" section of the specifications of your server group.

Alternatively, you can verify in the item `externalEndpoint` of the status section of the specifications of your server group that the IP address is followed by the port number you configured.

As an illustration, to continue the example above, run the command:

```azurecli
az postgres server-arc show -n postgres01 --k8s-namespace arc --use-k8s
```

The command return port 866:

```output
"services": {
      "primary": {
        "port": 866,
        "type": "LoadBalancer"
      }
    }
```

In addition, note the value for `primaryEndpoint`.

```output
"primaryEndpoint": "12.345.67.890:866",
```

## Related content
- Read about [how to connect to your server group](get-connection-endpoints-and-connection-strings-postgresql-server.md).
- Read about how you can configure other aspects of your server group in the section How-to\Manage\Configure & scale section of the documentation.
