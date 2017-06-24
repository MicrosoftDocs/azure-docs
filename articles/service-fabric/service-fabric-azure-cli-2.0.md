---
title: Getting Started with Service Fabric and Azure CLI 2.0
description: How to use the Service Fabric commands module in the Azure CLI, version 2.0, includes connecting to cluster and managing applications
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: get-started-article
ms.date: 06/21/2017
ms.author: edwardsa
---
# Service Fabric and Azure CLI 2.0

The new Azure CLI 2.0 now includes commands to manage Service Fabric clusters. This documentation includes steps to
get started with the Azure CLI.

## Install Azure CLI 2.0

The Azure CLI now includes commands to interact and manage Service Fabric clusters. You can follow the
[standard installation process](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) to get the latest
Azure CLI.

For more information, check the [Azure CLI 2.0 documentation](https://docs.microsoft.com/en-us/cli/azure/overview)

## CLI syntax

All Azure Service Fabric commands are prefixed with `az sf` in the Azure CLI. For more information about the commands
available, you can run `az sf -h` for general information. Or, you can run `az sf <command> -h` for detailed help on a
single command.

Azure Service Fabric commands in the CLI follow a naming pattern

```azurecli
az sf <object> <action>
```

Here, `<object>` is the target for `<action>`.

## Selecting a cluster

Before you can perform any operations, you must select a cluster to connect to. For example, see the following code
snippet to connect to an unsecured cluster.

> [!WARNING]
> Do not use unsecured Service Fabric clusters for production environments

```azurecli
az sf cluster select --endpoint http://testcluster.com:19080
```

The cluster endpoint must be prefixed by `http` or `https`, and should include the port for the HTTP gateway. This
port and address is the same as the Service Fabric Explorer URL.

For clusters secure with a certificate, either unencrypted `pem` or, `crt` and `key` files are supported.

```azurecli
az sf cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem
```

For more information, see the
[detailed document on connecting to secure clusters](service-fabric-connect-to-secure-cluster.md).

## Performing basic operations

Cluster connection information is persisted across different Azure CLI sessions. Once a Service Fabric cluster is
selected, you can run any Service Fabric command.

For example, to get the Service Fabric cluster health state run the following command

```azurecli
az sf cluster health
```

The command results in the following output, assuming JSON output is specified in the Azure CLI configuration

```json
{
  "aggregatedHealthState": "Ok",
  "applicationHealthStates": [
    {
      "aggregatedHealthState": "Ok",
      "name": "fabric:/System"
    }
  ],
  "healthEvents": [],
  "nodeHealthStates": [
    {
      "aggregatedHealthState": "Ok",
      "id": {
        "id": "66aa824a642124089ee474b398d06a57"
      },
      "name": "_Test_0"
    }
  ],
  "unhealthyEvaluations": []
}
```

## Tips and FAQ

Here is some information that might be helpful when running into issues using the Service Fabric commands in the Azure
CLI

### Converting a certificate from PFX to PEM

The Azure CLI supports client-side certificates as PEM (extension `.pem`) files. If using PFX files from Windows, these
certificates need to be converted to the PEM format. To convert from a PFX file to a PEM file, use the following 
command:

```bash
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

Refer to [OpenSSL documentation](https://www.openssl.org/docs/man1.0.1/apps/pkcs12.html) for details.

### Connection issues

When performing operations, you may run into the following error:

> Failed to establish a new connection: [Errno 8] nodename nor servname provided, or not known

In this case, double check the specified cluster endpoint is reachable and listening. Verify also that the Service
Fabric Explorer UI is reachable at that host and port. Use `az sf cluster select` to update the endpoint.

### Getting detailed logs

When debugging or reporting an issue, it is useful to include detailed logs. The Azure CLI includes a global `--debug`
flag that increases the verbosity of the logs.

### Command help and syntax

The Service Fabric commands follow the same convention as the Azure CLI. Specify the `-h` flag to get help about a
specific command, or group of commands. For example:

```azurecli
az sf application -h
```

or

```azurecli
az sf application create -h
```
