---
title: Configure SQL Managed Instance enabled by Azure Arc
description: Configure SQL Managed Instance enabled by Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/05/2023
ms.topic: how-to
---

# Configure SQL Managed Instance enabled by Azure Arc

This article explains how to configure SQL Managed Instance enabled by Azure Arc.

## Configure resources such as cores, memory


### Configure using CLI

To update the configuration of an instance with the CLI. Run the following command to see configuration options. 

```azurecli
az sql mi-arc update --help
```

To update the available memory and cores for an instance use:

```azurecli
az sql mi-arc update --cores-limit 4 --cores-request 2 --memory-limit 4Gi --memory-request 2Gi -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s
```

The following example sets the cpu core and memory requests and limits.

```azurecli
az sql mi-arc update --cores-limit 4 --cores-request 2 --memory-limit 4Gi --memory-request 2Gi -n sqlinstance1 --k8s-namespace arc --use-k8s
```

To view the changes made to the instance, you can use the following commands to view the configuration yaml file:

```azurecli
az sql mi-arc show -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s
```

## Configure readable secondaries

When you deploy Azure Arc enabled SQL managed instance in `BusinessCritical` service tier with 2 or more replicas, by default, one secondary replica is automatically configured as `readableSecondary`. This setting can be changed, either to add or to remove the readable secondaries as follows:

```azurecli
az sql mi-arc update --name <sqlmi name>  --readable-secondaries <value> --k8s-namespace <namespace> --use-k8s
```

For example, the following example will reset the readable secondaries to 0.

```azurecli
az sql mi-arc update --name sqlmi1 --readable-secondaries 0 --k8s-namespace mynamespace --use-k8s
```
## Configure replicas

You can also scale up or down the number of replicas deployed in the `BusinessCritical` service tier as follows:

```azurecli
az sql mi-arc update --name <sqlmi name> --replicas <value> --k8s-namespace <namespace> --use-k8s
```

For example:

The following example will scale down the number of replicas from 3 to 2.

```azurecli
az sql mi-arc update --name sqlmi1 --replicas 2 --k8s-namespace mynamespace --use-k8s
```

> [!Note]
> If you scale down from 2 replicas to 1 replica, you may run into a conflict with the pre-configured `--readable--secondaries` setting. You can first edit the `--readable--secondaries` before scaling down the replicas. 


## Configure Server options

You can configure certain server configuration settings for SQL Managed Instance enabled by Azure Arc either during or after creation time. This article describes how to configure settings like enabling "Ad Hoc Distributed Queries" or "backup compression default" etc. 

Currently the following server options can be configured:
- Ad Hoc Distributed Queries
- Default Trace Enabled
- Database Mail XPs
- Backup compression default
- Cost threshold for parallelism
- Optimize for ad hoc workloads

> [!Note]
> - Currently these options can only be specified via YAML file, either during Arc SQL MI creation or post deployment.
> - The Arc SQL MI image tag has to be at least version v1.19.x or above

Add the following to your YAML file during deployment to configure any of these options.

```yml
spec:
  serverConfigurations:
  - name: "Ad Hoc Distributed Queries"
    value: 1
  - name: "Default Trace Enabled"
    value: 0
  - name: "Database Mail XPs"
    value: 1
  - name: "backup compression default"
    value: 1
  - name: "cost threshold for parallelism"
    value: 50
  - name: "optimize for ad hoc workloads"
    value: 1
```

If you already have an existing Arc SQL MI, you can run `kubectl edit sqlmi <sqlminame> -n <namespace>` and add the above options into the spec.


Sample Arc SQL MI YAML file:

```yml
apiVersion: sql.arcdata.microsoft.com/v13
kind: SqlManagedInstance
metadata:
  name: sql1
  annotations:
    exampleannotation1: exampleannotationvalue1
    exampleannotation2: exampleannotationvalue2
  labels:
    examplelabel1: examplelabelvalue1
    examplelabel2: examplelabelvalue2
spec:
  dev: true #options: [true, false]
  licenseType: LicenseIncluded #options: [LicenseIncluded, BasePrice].  BasePrice is used for Azure Hybrid Benefits.
  tier: GeneralPurpose #options: [GeneralPurpose, BusinessCritical]
  serverConfigurations:
  - name: "Ad Hoc Distributed Queries"
    value: 1
  - name: "Default Trace Enabled"
    value: 0
  - name: "Database Mail XPs"
    value: 1
  - name: "backup compression default"
    value: 1
  - name: "cost threshold for parallelism"
    value: 50
  - name: "optimize for ad hoc workloads"
    value: 1
  security:
    adminLoginSecret: sql1-login-secret
  scheduling:
    default:
      resources:
        limits:
          cpu: "2"
          memory: 4Gi
        requests:
          cpu: "1"
          memory: 2Gi
  services:
    primary:
      type: LoadBalancer
  storage:
    backups:
      volumes:
      - className: azurefile # Backup volumes require a ReadWriteMany (RWX) capable storage class
        size: 5Gi
    data:
      volumes:
      - className: default # Use default configured storage class or modify storage class based on your Kubernetes environment
        size: 5Gi
    datalogs:
      volumes:
      - className: default # Use default configured storage class or modify storage class based on your Kubernetes environment
        size: 5Gi
    logs:
      volumes:
      - className: default # Use default configured storage class or modify storage class based on your Kubernetes environment
        size: 5Gi
```


## Enable SQL Server agent

SQL Server agent is disabled during a default deployment of Arc SQL MI. It can be enabled by running the following command:

```azurecli
az sql mi-arc update -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s --agent-enabled true
```

As an example:

```azurecli
az sql mi-arc update -n sqlinstance1 --k8s-namespace arc --use-k8s --agent-enabled true
```

## Enable trace flags

Trace flags can be enabled as follows:

```azurecli
az sql mi-arc update -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s --trace-flags "3614,1234" 
```
