---
title: Get started with Azure Service Fabric and Azure CLI 2.0
description: Learn how to use the Azure Service Fabric commands module in Azure CLI, version 2.0. Learn how to connect to a cluster, and how to manage applications.
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: get-started-article
ms.date: 06/21/2017
ms.author: edwardsa

---
# Azure Service Fabric and Azure CLI 2.0

The Azure command-line tool (Azure CLI) version 2.0 includes commands to help you manage Azure Service Fabric clusters. Learn how to get started with Azure CLI and Service Fabric.

## Install Azure CLI 2.0

You can use Azure CLI 2.0 commands to interact with and manage Service Fabric clusters. To get the latest version of Azure CLI, follow the [Azure CLI 2.0 standard installation process](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

For more information, see the [Azure CLI 2.0 overview](https://docs.microsoft.com/en-us/cli/azure/overview).

## Azure CLI syntax

In Azure CLI, all Service Fabric commands are prefixed with `az sf`. For general information about the commands you can use, use `az sf -h`. For help with a single command, use `az sf <command> -h`.

Service Fabric commands in Azure CLI follow this naming pattern:

```azurecli
az sf <object> <action>
```

`<object>` is the target for `<action>`.

## Select a cluster

Before you perform any operations, you must select a cluster to connect to. For an example, see the following code. The code connects to an unsecured cluster.

> [!WARNING]
> Do not use unsecured Service Fabric clusters in a production environment.

```azurecli
az sf cluster select --endpoint http://testcluster.com:19080
```

The cluster endpoint must be prefixed by `http` or `https`. It must include the port for the HTTP gateway. The port and address are the same as the Service Fabric Explorer URL.

For clusters that are secured with a certificate, you can use either unencrypted .pem files, or .crt and .key files. For example:

```azurecli
az sf cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem
```

For more information, see 
[Connect to a secure Azure Service Fabric cluster](service-fabric-connect-to-secure-cluster.md).

> [!NOTE]
> The `select` command doesn't act on any requests before it returns. To verify that you've specified a cluster correctly, use a command like `az sf cluster health`. Verify that the command doesn't return any errors.

## Basic operations

Cluster connection information persists across multiple Azure CLI sessions. After you select a Service Fabric cluster, you can run any Service Fabric command on the cluster.

For example, to get the Service Fabric cluster health state, use the following command:

```azurecli
az sf cluster health
```

The command results in the following output (assuming that JSON output is specified in the Azure CLI configuration):

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

## Tips and troubleshooting

You might find the following information helpful if you run into issues while using Service Fabric commands in Azure CLI.

### Convert a certificate from PFX to PEM format

Azure CLI supports client-side certificates as PEM (.pem extension) files. If you use PFX files from Windows, you must convert those certificates to PEM format. To convert a PFX file to a PEM file, use the following command:

```bash
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

For more information, see the [OpenSSL documentation](https://www.openssl.org/docs/).

### Connection issues

Some operations might generate the following message:

`Failed to establish a new connection: [Errno 8] nodename nor servname provided, or not known`

Verify that the specified cluster endpoint is available and listening. Also, verify that the Service Fabric Explorer UI is available at that host and port. To update the endpoint, use `az sf cluster select`.

### Detailed logs

Detailed logs often are helpful when you debug or report an issue. Azure CLI offers a global `--debug` flag that increases the verbosity of log files.

### Command help and syntax

Service Fabric commands follow the same conventions as Azure CLI. For help with a
specific command or a group of commands, use the `-h` flag:

```azurecli
az sf application -h
```

Here's another example:

```azurecli
az sf application create -h
```
