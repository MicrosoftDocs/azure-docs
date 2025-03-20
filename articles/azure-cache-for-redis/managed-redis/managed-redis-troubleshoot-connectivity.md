---
title: Troubleshoot connectivity in Azure Managed Redis (preview)
description: Learn how to resolve connectivity problems when creating clients with Azure Managed Redis.


ms.service: azure-managed-redis
ms.topic: conceptual
ms.date: 11/15/2024
ms.custom: template-concept, ignite-2024
---

# Connectivity troubleshooting with Azure Managed Redis (preview)

In this article, we provide troubleshooting help for connecting your client application to Azure Managed Redis. Connectivity issues are divided into two types: intermittent connectivity issues and continuous connectivity issues.

- [Intermittent connectivity issues](#intermittent-connectivity-issues)
  - [Server maintenance](#server-maintenance)
  - [Number of connected clients](#number-of-connected-clients)
  - [Kubernetes hosted applications](#kubernetes-hosted-applications)
  - [Linux-based client application](#linux-based-client-application)
- [Continuous connectivity issues](#continuous-connectivity)
  - [Test connectivity using _redis-cli_](#test-connectivity-using-redis-cli)
  - [Test connectivity using PSPING](#test-connectivity-using-psping)
  - [Private endpoint configuration](#private-endpoint-configuration)
  - [Firewall rules](#third-party-firewall-or-external-proxy)
  - [Public IP address change](#public-ip-address-change)

## Intermittent connectivity issues

Your client application might have intermittent connectivity issues caused by events such as patching, or spikes in the number of connections.

### Server maintenance
Sometimes, your cache undergoes a planned or an unplanned server maintenance. Your application can be negatively affected during the maintenance. To minimize the effects of failovers, see [Connection resilience](managed-redis-best-practices-connection.md).

### Number of connected clients

Check if the Max aggregate for `Connected Clients` metric is close or higher than the maximum number of allowed connections for a particular cache size. For more information on sizing per client connections, see [Azure Managed Redis pricing](https://aka.ms/amrpricing).

### Kubernetes hosted applications

- If your client application is hosted on Kubernetes, check that the pod running the client application or the cluster nodes aren't under memory/CPU/Network pressure. A pod running the client application can be affected by other pods running on the same node and throttle Redis connections or IO operations.

### Linux-based client application

Using optimistic TCP settings in Linux might cause client applications to experience connectivity issues. See [Connection stalls lasting for 15 minutes](https://github.com/StackExchange/StackExchange.Redis/issues/1848#issuecomment-913064646).

## Continuous connectivity

If your application can't connect to your Azure Managed Redis instance, it's possible some configuration on the cache isn't set up correctly. The following sections offer suggestions on how to make sure your cache is configured correctly.

### Test connectivity using _redis-cli_

Test connectivity using _redis-cli_. For more information on CLI, [Use the Redis command-line tool with Azure Managed Redis](managed-redis-how-to-redis-cli-tool.md).

### Test connectivity using PSPING

If _redis-cli_ is unable to connect, you can test connectivity using `PSPING` in PowerShell.

```azurepowershell-interactive
psping -q <cache DNS endpoint>:<Port Number>
```

You can confirm the number of sent packets is equal to the received packets. Confirming ensures no drop in connectivity.

### Private endpoint configuration

Steps to check your private endpoint configuration:
1. Verify if your private endpoint is configured correctly. For more information, see [Create a private endpoint with a new Azure Managed Redis instance](managed-redis-private-link.md#create-a-private-endpoint-with-a-new-azure-managed-redis-instance).
1. Verify if your application is connecting to `<instancename>.<region>.redis.azure.net` on port 10000. We recommend avoiding the use of `<instancename>.<region>.privatelink.redis.cache.windows.net` in the configuration or the connection string.
1. Run a command like `nslookup <hostname>` from within the VNet that is linked to the private endpoint to verify that the command resolves to the private IP address for the cache.
1. `Public Network Access` is currently not supported for Azure Managed Redis (preview). You cannot connect to your cache private endpoint from outside the virtual network of your cache.
  
### Firewall rules

If you have a firewall configured for your Azure Managed Redis, ensure that your client IP address is added to the firewall rules. You can check **Firewall** on the Resource menu under **Settings** on the Azure portal.

#### Third-party firewall or external proxy

When you use a third-party firewall or proxy in your network, check that the endpoint for Azure Managed Redis, `*.redis.azure.net`, is allowed along with the port `10000`. You might need to allow more ports when using a clustered cache or geo-replication.

### Public IP address change

If you've configured any networking or security resource to use your cache's public IP address, check to see if your cache's public IP address changed. For more information, see [Rely on hostname not public IP address for your cache](managed-redis-best-practices-development.md#rely-on-hostname-not-public-ip-address).

## Related content

- [Best practices for connection resilience](managed-redis-best-practices-connection.md)
- [High availability for Azure Managed Redis](managed-redis-high-availability.md)
