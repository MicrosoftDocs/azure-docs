---
title: Snapshots in Azure App Configuration (preview)
description: Details of Snapshots in Azure App Configuration
author: Muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.topic: conceptual 
ms.date: 05/16/2023
---

# Snapshots in Azure App Configuration (preview)

A snapshot is a named, immutable subset of an App Configuration store's key-values. Snapshots are created by selecting which key-values should be included in the snapshot at the time of creation, by using key and label filters. Once created, snapshots are guaranteed to remain unchanged, which means they can't be modified, deleted, or purged.

## Deploy safely with Snapshots

Snapshots are designed to help deployment the Configuration changes in a safe manner. The goal of safe deployment is to minimize the risk of service disruptions, data loss, or other issues that can arise from deploying new code and configuration changes. In safe deployments, updates are deployed in a stage-by-stage manner, progressively verifying the rollout along the way. The idea is to catch any issues before the update is fully rolled out to all users.

To deploy the configuration settings safely, they should be deployed in a controlled, consistent way, and there should be a way to roll back easily to the previous version of the configuration, if necessary. Developers can implement Safe deployment of Configuration changes by providing an immutable configuration with Snapshots. Additionally, snapshots allow for easy rollback to a Last Known Good (LKG) configuration if there was misconfiguration during deployment. Snapshots provide developers with a powerful tool for managing their configuration key-values and ensuring consistency across their deployments.

## Scenarios for using Snapshots

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

## Permissions to create a snapshot

- `Microsoft.AppConfiguration/configurationStores/keyvalues/read` and `Microsoft.AppConfiguration/configurationStores/snapshots/write`

To create a snapshot the `Microsoft.AppConfiguration/configurationStores/keyvalues/read` and `Microsoft.AppConfiguration/configurationStores/snapshots/write` permissions are needed. The built-in "DataOwner" role contain this permission by default. The permission can be assigned at the subscription or resource group scope.

## Permissions to archive and recover a snapshot

- `Microsoft.AppConfiguration/configurationStores/snapshots/archive/action`

To create and archive a snapshot the `Microsoft.AppConfiguration/configurationStores/snapshots/archive/action` permission is needed. The built-in "DataOwner" role contain this permission by default. The permission can be assigned at the subscription or resource group scope.

## Permissions to read, list and use a snapshot

- `Microsoft.AppConfiguration/configurationStores/snapshots/read`

To list all snapshots, or get an individual snapshot by name the `Microsoft.AppConfiguration/configurationStores/snapshots/read` permission is needed. The built-in "DataOwner" and "DataReader" roles contain these permissions by default. The permission can be assigned at the subscription or resource group scope.

## Billing considerations

Snapshots have their own storage quota in the App Configuration store. This quota is in addition to the “storage per resource” for key-values. Check the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/) for details.

App Configuration has two tiers, Free and standard, check the details of snapshots quota and charge in each tier.

* **Free tier**: This tier has 10-MB storage quota for Snapshots. One can keep as many snapshots as possible until the total storage for snapshots is less than or equal to 10 MB.

* **Standard tier**: This tier has a Snapshots storage quota of 1 GB. Users are allowed to create as many snapshots as required until the 1-GB quota is met in standard tier.

Snapshots can go to a maximum size of 1 MB.

> [!NOTE]
> Snapshots are in Public preview. There is no charge for snapshots during preview; only the storage limits apply. Once the feature goes GA, the option to create snapshots after the 1GB quota is met in the standard tier will be available at an additional cost.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
