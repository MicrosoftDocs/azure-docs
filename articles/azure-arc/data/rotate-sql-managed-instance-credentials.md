---
title: Rotate SQL Managed Instance service-managed credentials (preview)
description: Rotate SQL Managed Instance service-managed credentials (preview)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: MikeRayMSFT
ms.author: mikeray
ms.reviewer: mikeray
ms.date: 03/06/2023
ms.topic: how-to
---
# Rotate SQL Server Managed Instance enabled by Azure Arc service-managed credentials (preview)

This article describes how to rotate service-managed credentials for SQL Managed Instance enabled by Azure Arc. Arc data services generate various service-managed credentials like certificates and SQL logins used for Monitoring, Backup/Restore, High Availability etc. These credentials are considered custom resource credentials managed by Azure Arc data services.

Service-managed credential rotation is a user-triggered operation that you initiate during a security issue or when periodic rotation is required for compliance.

## Limitations

Consider the following limitations when you rotate a managed instance service-managed credentials:

- SQL Server failover groups aren't supported.
- Automatically prescheduled rotation isn't supported.
- The service-managed DPAPI symmetric keys, keytab, active directory accounts, and service-managed TDE credentials aren't included in this credential rotation.

## General Purpose tier

During General Purpose SQL Managed Instance service-managed credential rotation, the managed instance Kubernetes pod is terminated and reprovisioned with rotated credentials. This process causes a short amount of downtime as the new managed instance pod is created. To handle the interruption, build resiliency into your application such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on how to architect resiliency and [retry guidance for Azure Services](/azure/architecture/best-practices/retry-service-specific#sql-database-using-adonet).

## Business Critical tier

During Business Critical SQL Managed Instance service-managed credential rotation with more than one replica:

- The secondary replica pods are terminated and reprovisioned with the rotated service-managed credentials
- After the replicas are reprovisioned, the primary will fail over to a reprovisioned replica
- The previous primary pod is terminated and reprovisioned with the rotated service-managed credentials, and becomes a secondary

There's a brief moment of downtime when the failover occurs.

## Prerequisites: 

Before you proceed with this article, you must have a SQL Managed Instance enabled by Azure Arc resource created.

- [a SQL Managed Instance enabled by Azure Arc created](./create-sql-managed-instance.md)

## How to rotate service-managed credentials in a managed instance

Service-managed credentials are associated with a generation within the managed instance. To rotate all service-managed credentials for a managed instance, the generation must be increased by 1.

Run the following commands to get current service-managed credentials generation from spec and generate the new generation of service-managed credentials. This action triggers service-managed credential rotation.

```console
rotateCredentialGeneration=$(($(kubectl get sqlmi <sqlmi-name> -o jsonpath='{.spec.update.managedCredentialsGeneration}' -n <namespace>) + 1))
```


```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "update": { "managedCredentialsGeneration": '$rotateCredentialGeneration'} } }'
```
---

The `managedCredentialsGeneration` identifies the target generation for service-managed credentials. The rest of the features like configuration and the kubernetes topology remain the same.

## How to roll back service-managed credentials in a managed instance

> [!NOTE]
> Rollback is required when credential rotation fails. Rollback to previous credentials generation is supported only once to n-1 where n is the current generation.
>
> If rollback is triggered while credential rotation is in progress and all the replicas have not been reprovisioned then the rollback __may__ take about 30 minutes to complete for the managed instance to be in a **Ready** state.

Run the following two commands to get current service-managed credentials generation from spec and rollback to the previous generation of service-managed credentials:

```console
rotateCredentialGeneration=$(($(kubectl get sqlmi <sqlmi-name> -o jsonpath='{.spec.update.managedCredentialsGeneration}' -n <namespace>) - 1))
```

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "update": { "managedCredentialsGeneration": '$rotateCredentialGeneration'} } }'
```

Triggering rollback is the same as triggering a rotation of service-managed credentials except that the target generation is previous generation and doesn't generate a new generation or credentials.

## Related content

- [View the SQL managed instance dashboards](azure-data-studio-dashboards.md#view-the-sql-managed-instance-dashboards)
- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)