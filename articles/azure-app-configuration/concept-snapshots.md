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

Snapshot is a feature in App Configuration that allows developers to capture a specific set of key-values from App Configuration instance, and then store this set of key-values as an immutable snapshot with a name to reference. Snapshots are created by selecting which key-values should be included in the snapshot at the time of creation, by using key prefix and label filters. Once created, snapshots can't be modified, deleted, or purged, which means that the snapshot is guaranteed to remain unchanged.

## Snapshots and SDP

Snapshots are designed to help implement the Safe Deployment Practices (SDP) for Configuration. SDP is a set of practices that developers use to ensure that code deployments are safe and don't cause issues for end-users. The goal of SDP is to minimize the risk of service disruptions, data loss, or other issues that can arise from deploying new code and configuration changes. SDP involves deploying updates in a stage-by-stage manner, progressively verifying the rollout along the way. The idea is to catch any issues before the update is fully rolled out to all users.

To support SDP, configuration settings should be deployed in a controlled, consistent way, and there should be a way to roll back easily to the previous version of the configuration, if necessary. Developers can implement SDP by providing an immutable configuration with Snapshots that can't be modified without going through the SDP process. Additionally, snapshots allow for easy rollback to a Last Known Good (LKG) configuration if there was misconfiguration during deployment. Snapshots provide developers with a powerful tool for managing their configuration key-values and ensuring consistency across their deployments, which is critical for the reliability and availability of their applications.

## Scenarios

* **Safe deployment practices/LKG**: Snapshots can be used to support Safe Deployment Practices (SDP) for Configuration. With snapshots, developers can ensure that a Last known Good (LKG) configuration is available for rollback if there was any issue during deployment.

* **Configuration versioning**: Snapshots can be used to create a version history of configuration settings to sync with release versions. Settings captured in each snapshot can be compared to identify changes between versions.

* **Auditing**: Snapshots can be used for auditing and compliance purposes. Developers can maintain a record of configuration changes in between releases by using the snapshots for the releases.

* **Disaster recovery**: Snapshots can be used for disaster recovery. A local copy of the snapshot could be kept and if outage, data loss or corruption, the copy can be used to restore the configuration settings to a previously known good state.  

* **Testing and staging environments**: Snapshots can be used to create consistent testing and staging environments. Developers can ensure that the same configuration is used across different environments, by capturing a set of key-values as a snapshot, which can help with debugging and testing.

* **Simplified Client Config composition**: Usually the clients of app Config need a subset of the key-values from the App Configuration instance. To get the set of required key-values, they need to have query logic written in code. As Snapshots support providing filters during creation time, it helps simplify client composition because clients can now refer to the set of key-values they require by referencing an already created snapshot.

## Snapshot operations

As snapshots are immutable entities, snapshots can only be created and archived. No deletion, purging or editing is possible.  

* **Create Snapshot**: Snapshot can be created by defining the key and label filters to capture the required key-values from App Configuration instance. The filtered key-values are stored as a snapshot with the name provided at the creation.  

* **Archive snapshot**: Once a snapshot is created, only one operation can be performed on it, Archive. Archiving a snapshot means the snapshot is stored in archival for the set retention period and after the expiry of retention period, it will be deleted automatically.

* **Recover snapshot**: Recover snapshot gets an archived snapshot back to active state, the snapshots then could be used for configuration key-values. Recovery is only possible in the retention period after archival.

> [!NOTE]
> Retention period can only be set at the creation of snapshot. By default, the value for retention period is 30 days.

## Permissions to create a snapshot

- `Microsoft.AppConfiguration/configurationStores/write`

To create a snapshot the `Microsoft.AppConfiguration/configurationStores/write` permission is needed. The built-in "DataOwner" role contain this permission by default. The permission can be assigned at the subscription or resource group scope.


## Permissions to archive and recover a snapshot

- `Microsoft.AppConfiguration/configurationStores/action`

To create and archive a snapshot the `Microsoft.AppConfiguration/configurationStores/action` permission is needed. The built-in "DataOwner" role contain this permission by default. The permission can be assigned at the subscription or resource group scope.

## Permissions to read, list and use a snapshot

- `Microsoft.AppConfiguration/configurationStores/read`

To list all snapshots, or get an individual snapshot by name the `Microsoft.AppConfiguration/configurationStores/read` permission is needed. The built-in "DataOwner" and "DataReader" roles contain these permissions by default. The permission can be assigned at the subscription or resource group scope.

## Billing considerations

Snapshots have their own more storage quota in App Configuration instance. This quota is in addition to the “storage per resource” for key-values. Check the App Configuration pricing page for details.

App Configuration has two tiers, Free and standard, check the details of snapshots quota and charge in each tier.

* **Free tier**: This tier has 10-MB storage quota for Snapshots. One can keep as many snapshots as possible until the total storage for snapshots is less than or equal to 10 MB.

* **Standard tier**: This tier has a Snapshots storage quota of 1 GB. Users are allowed to create as many snapshots as required until the 1-GB quota is met in standard tier.

> [!NOTE]
> Snapshots are in Public preview. There is no charge for snapshots during preview; only the storage limits apply. Once the feature goes GA, the option to create snapshots after the 1GB quota is met in the standard tier will be available at an additional cost.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
