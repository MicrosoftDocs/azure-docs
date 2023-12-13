---
title: Get logs to troubleshoot Azure Arc-enabled data services
description: Learn how to get log files from a data controller to troubleshoot Azure Arc-enabled data services.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Get logs to troubleshoot Azure Arc-enabled data services


## Prerequisites

Before you proceed, you need:

* Azure CLI (`az`) with the `arcdata` extension. For more information, see [Install client tools for deploying and managing Azure Arc data services](./install-client-tools.md).
* An administrator account to sign in to the Azure Arc-enabled data controller.

## Get log files

You can get service logs across all pods or specific pods for troubleshooting purposes. One way is to use standard Kubernetes tools such as the `kubectl logs` command. In this article, you'll use the Azure (`az`) CLI `arcdata` extension, which makes it easier to get all of the logs at once.

Run the following command to dump the logs:

   ```azurecli
   az arcdata dc debug copy-logs --exclude-dumps --skip-compress --use-k8s --k8s-namespace
   ```

   For example:

   ```azurecli
   #az arcdata dc debug copy-logs --exclude-dumps --skip-compress --use-k8s --k8s-namespace
   ```

The data controller creates the log files in the current working directory in a subdirectory called `logs`. 

## Options

The `az arcdata dc debug copy-logs` command provides the following options to manage the output:

* Output the log files to a different directory by using the `--target-folder` parameter.
* Compress the files by omitting the `--skip-compress` parameter.
* Trigger and include memory dumps by omitting `--exclude-dumps`. We don't recommend this method unless Microsoft Support has requested the memory dumps. Getting a memory dump requires that the data controller setting `allowDumps` is set to `true` when the data controller is created.
* Filter to collect logs for just a specific pod (`--pod`) or container (`--container`) by name.
* Filter to collect logs for a specific custom resource by passing the `--resource-kind` and `--resource-name` parameters. The `resource-kind` parameter value should be one of the custom resource definition names. You can retrieve those names by using the command `kubectl get customresourcedefinition`.

With these parameters, you can replace the `<parameters>` in the following example: 

```azurecli
az arcdata dc debug copy-logs --target-folder <desired folder> --exclude-dumps --skip-compress -resource-kind <custom resource definition name> --resource-name <resource name> --use-k8s --k8s-namespace 
```

For example:

```azurecli
az arcdata dc debug copy-logs --target-folder C:\temp\logs --exclude-dumps --skip-compress --resource-kind postgresql-12 --resource-name pg1 --use-k8s --k8s-namespace
```

The following folder hierarchy is an example. It's organized by pod name, then container, and then by directory hierarchy within the container.

```output
<export directory>
├───debuglogs-arc-20200827-180403
│   ├───bootstrapper-vl8j2
│   │   └───bootstrapper
│   │       ├───apt
│   │       └───fsck
│   ├───control-j2dm5
│   │   ├───controller
│   │   │   └───controller
│   │   │       ├───2020-08-27
│   │   │       └───2020-08-28
│   │   └───fluentbit
│   │       ├───agent
│   │       ├───fluentbit
│   │       └───supervisor
│   │           └───log
│   ├───controldb-0
│   │   ├───fluentbit
│   │   │   ├───agent
│   │   │   ├───fluentbit
│   │   │   └───supervisor
│   │   │       └───log
│   │   └───mssql-server
│   │       ├───agent
│   │       ├───mssql
│   │       ├───mssql-server
│   │       └───supervisor
│   │           └───log
│   ├───controlwd-ln6j8
│   │   └───controlwatchdog
│   │       └───controlwatchdog
│   ├───logsdb-0
│   │   └───opensearch
│   │       ├───agent
│   │       ├───opensearch
│   │       ├───provisioner
│   │       └───supervisor
│   │           └───log
│   ├───logsui-7gg2d
│   │   └───kibana
│   │       ├───agent
│   │       ├───apt
│   │       ├───fsck
│   │       ├───kibana
│   │       └───supervisor
│   │           └───log
│   ├───metricsdb-0
│   │   └───influxdb
│   │       ├───agent
│   │       ├───influxdb
│   │       └───supervisor
│   │           └───log
│   ├───metricsdc-2f62t
│   │   └───telegraf
│   │       ├───agent
│   │       ├───apt
│   │       ├───fsck
│   │       ├───supervisor
│   │       │   └───log
│   │       └───telegraf
│   ├───metricsdc-jznd2
│   │   └───telegraf
│   │       ├───agent
│   │       ├───apt
│   │       ├───fsck
│   │       ├───supervisor
│   │       │   └───log
│   │       └───telegraf
│   ├───metricsdc-n5vnx
│   │   └───telegraf
│   │       ├───agent
│   │       ├───apt
│   │       ├───fsck
│   │       ├───supervisor
│   │       │   └───log
│   │       └───telegraf
│   ├───metricsui-h748h
│   │   └───grafana
│   │       ├───agent
│   │       ├───grafana
│   │       └───supervisor
│   │           └───log
│   └───mgmtproxy-r5zxs
│       ├───fluentbit
│       │   ├───agent
│       │   ├───fluentbit
│       │   └───supervisor
│       │       └───log
│       └───service-proxy
│           ├───agent
│           ├───nginx
│           └───supervisor
│               └───log
└───debuglogs-kube-system-20200827-180431
    ├───coredns-8bbb65c89-kklt7
    │   └───coredns
    ├───coredns-8bbb65c89-z2vvr
    │   └───coredns
    ├───coredns-autoscaler-5585bf8c9f-g52nt
    │   └───autoscaler
    ├───kube-proxy-5c9s2
    │   └───kube-proxy
    ├───kube-proxy-h6x56
    │   └───kube-proxy
    ├───kube-proxy-nd2b7
    │   └───kube-proxy
    ├───metrics-server-5f54b8994-vpm5r
    │   └───metrics-server
    └───tunnelfront-db87f4cd8-5xwxv
        ├───tunnel-front
        │   ├───apt
        │   └───journal
        └───tunnel-probe
            ├───apt
            ├───journal
            └───openvpn
```
