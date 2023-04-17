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
# Rotate Azure Arc-enabled SQL Managed Instance service-managed credentials (preview)

This article describes how to rotate service-managed credentials for Azure Arc-enabled SQL Managed Instance. Arc data services generates various service-managed credentials like certificates and SQL logins used for Monitoring, Backup/Restore, High Availability etc. These credentials are considered custom resource credentials managed by Azure Arc data services.

Service-managed credential rotation is a user-triggered operation that you initiate during a security issue or when periodic rotation is required for compliance.

## Limitations

Consider the following limitations when you rotate a managed instance service-managed credentials:

- SQL Server failover groups aren't supported.
- Automatically pre-scheduled rotation isn't supported.
- The service-managed DPAPI symmetric keys, keytab, active directory accounts, and service-managed TDE credentials aren't included in this credential rotation.
- SQL Managed Instance Business Critical tier isn't supported.
- This feature should not be used in production currently. There is a known limitation where _rollback_ cannot be triggered unless credential rotation is completed successfully and the SQLMI is in "Ready" state.

## General Purpose tier

During a SQL Managed Instance service-managed credential rotation, the managed instance Kubernetes pod is terminated and reprovisioned when new credentials are generated. This process causes a short amount of downtime as the new managed instance pod is created. To handle the interruption, build resiliency into your application such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on how to architect resiliency and [retry guidance for Azure Services](/azure/architecture/best-practices/retry-service-specific#sql-database-using-adonet).

## Prerequisites: 

Before you proceed with this article, you must have an Azure Arc-enabled SQL Managed Instance resource created.

- [An Azure Arc-enabled SQL Managed Instance created](./create-sql-managed-instance.md)

## How to rotate service-managed credentials in a managed instance

Service-managed credentials are associated with a generation within the managed instance. To rotate all service-managed credentials for a managed instance, the generation must be increased by 1.

Run the following commands to get current service-managed credentials generation from spec and generate the new generation of service-managed credentials. This action triggers a service-managed credential rotation.

```console
rotateCredentialGeneration=$(($(kubectl get sqlmi <sqlmi-name> -o jsonpath='{.spec.update.managedCredentialsGeneration}' -n <namespace>) + 1)) 
```


```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "update": { "managedCredentialsGeneration": '$rotateCredentialGeneration'} } }' 
```
---

The `managedCredentialsGeneration` identifies the target generation for the service-managed credentials. The rest of the features like configuration and the kubernetes topology remain the same.

## How to roll back service-managed credentials in a managed instance

> [!NOTE]
> Rollback is required when credential rotation failed for any reasons. Rollback to previous credentials generation is supported only once to n-1 where n is current generation.

Run the following two commands to get current service-managed credentials generation from spec and rollback to the previous generation of service-managed credentials:

```console
rotateCredentialGeneration=$(($(kubectl get sqlmi <sqlmi-name> -o jsonpath='{.spec.update.managedCredentialsGeneration}' -n <namespace>) - 1)) 
```

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{ "spec": { "update": { "managedCredentialsGeneration": '$rotateCredentialGeneration'} } }' 
```

Triggering rollback is the same as triggering a rotation of service-managed credentials except that the target generation is previous generation and doesn't generate a new generation or credentials.

## Next steps

- [View the SQL managed instance dashboards](azure-data-studio-dashboards.md#view-the-sql-managed-instance-dashboards)
- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
