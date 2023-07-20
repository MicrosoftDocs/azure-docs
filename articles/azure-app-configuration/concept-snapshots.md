---
title: Snapshots in Azure App Configuration (preview)
description: Details of Snapshots in Azure App Configuration
author: Muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.topic: conceptual 
ms.date: 05/16/2023
---

# Snapshots (preview)

A snapshot is a named, immutable subset of an App Configuration store's key-values. Snapshots are created by selecting which key-values should be included in the snapshot at the time of creation, by using key and label filters. Once created, snapshots are guaranteed to remain unchanged, which means they can't be modified, deleted, or purged.

## Deploy safely with snapshots

Snapshots are designed to help deployment the Configuration changes in a safe manner. The goal of safe deployment is to minimize the risk of service disruptions, data loss, or other issues that can arise from deploying new code and configuration changes. In safe deployments, updates are deployed in a stage-by-stage manner, progressively verifying the rollout along the way. The idea is to catch any issues before the update is fully rolled out to all users.

To deploy the configuration settings safely, they should be deployed in a controlled, consistent way, and there should be a way to roll back easily to the previous version of the configuration, if necessary. Developers can implement Safe deployment of Configuration changes by providing an immutable configuration with Snapshots. Additionally, snapshots allow for easy rollback to a Last Known Good (LKG) configuration if there was misconfiguration during deployment. Snapshots provide developers with a powerful tool for managing their configuration key-values and ensuring consistency across their deployments.

## Scenarios for using snapshots

* **Safe deployment practices/LKG**: Snapshots can be used to support Safe Deployment Practices for Configuration. With snapshots, developers can ensure that a Last known Good (LKG) configuration is available for rollback if there was any issue during deployment.

* **Configuration versioning**: Snapshots can be used to create a version history of configuration settings to sync with release versions. Settings captured in each snapshot can be compared to identify changes between versions.

* **Auditing**: Snapshots can be used for auditing and compliance purposes. Developers can maintain a record of configuration changes in between releases by using the snapshots for the releases.

* **Testing and staging environments**: Snapshots can be used to create consistent testing and staging environments. Developers can ensure that the same configuration is used across different environments, by using the same snapshot, which can help with debugging and testing.

* **Simplified Client Config composition**: Usually the clients of App Config need a subset of the key-values from the App Configuration instance. To get the set of required key-values, they need to have query logic written in code. As Snapshots support providing filters during creation time, it helps simplify client composition because clients can now refer to the set of key-values they require by referencing an already created snapshot.

## Snapshot operations

As snapshots are immutable entities, snapshots can only be created and archived. No deleting, purging or editing is possible.  

* **Create Snapshot**: Snapshots can be created by defining the key and label filters to capture the required key-values from App Configuration instance. The filtered key-values are stored as a snapshot with the name provided during creation.  

* **Archive snapshot**: Archiving a snapshot means the snapshot is stored in archival for the set retention period. After the retention period has elapsed, the archived snapshot will be deleted automatically. Archival operation is for phasing out the snapshot, which is no longer in active usage.

* **Recover snapshot**: Recover snapshot resets a snapshot back to the active state. At this point, the snapshot is no longer subject to expiration based on its configured retention period. Recovery is only possible in the retention period after archival.

> [!NOTE]
> Retention period can only be set at the creation of snapshot. By default, the value for retention period is 30 days in Standard sku and 7 days in Free sku.

## Permissions

### Create a snapshot

To create a snapshot, the following permissions are needed. The App Configuration Data Owner role and read-write access keys already have these permissions.

- `Microsoft.AppConfiguration/configurationStores/keyvalues/read`
- `Microsoft.AppConfiguration/configurationStores/snapshots/write`

### Archive and recover a snapshot

To archive and recover a snapshot, the following permission is needed. The App Configuration Data Owner role and read-write access keys already have this permission.

- `Microsoft.AppConfiguration/configurationStores/snapshots/archive/action`

### Read and list a snapshot

To  list all snapshots, or get an individual snapshot by name the following permission is needed. The built-in "DataOwner", "DataReader", read-write access keys and read-only access keys already have this permission.

- `Microsoft.AppConfiguration/configurationStores/snapshots/read`

## Billing considerations

Snapshots have a separate storage quota from the “storage per resource” for key-values. There is no extra charge for snapshots before the included snapshot storage quota is exhausted. Check the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/) for details.

App Configuration has two tiers, Free and standard, check the details of snapshots quota and charge in each tier.

* **Free tier**: This tier has a snapshot storage quota of 10 MB.  One can create as many snapshots as possible as long as the total storage size of all active and archived snapshots is less than 10 MB.

* **Standard tier**: This tier has a snapshot storage quota of 1 GB. One can create as many snapshots as possible as long as the total storage size of all active and archived snapshots is less than 1 GB.

The maximum size for a snapshot is 1 MB.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
