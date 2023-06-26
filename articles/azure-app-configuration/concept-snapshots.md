---
title: How to create snapshots (preview) in Azure App Configuration
description: How to create and manage snapshots (preview) Azure App Configuration store.
author: Muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 05/16/2023
---

# Soft delete

Snapshot is a feature in App Configuration that allows developers to capture a specific subset of key-values from App Configuration instance and store these key-values as an immutable snapshot that can be referenced by name. Snapshots are created by selecting which key-values should be included in the snapshot at the time of creation, by using key prefix and label filters. Once created, snapshots cannot be modified, deleted, or purged, which means that the snapshot and the key-values in it are guaranteed to remain unchanged.

## Snapshots and SDP

Snapshots are designed to help implement the Safe Deployment Practices (SDP) for Configuration. SDP is a set of practices that developers use to ensure that code deployments are safe and do not cause issues for end-users. The goal of SDP is to minimize the risk of service disruptions, data loss, or other issues that can arise from deploying new code and configuration changes. SDP involves deploying updates in a stage-by-stage manner, progressively verifying the rollout along the way. The idea is to catch any issues before the update is fully rolled out to all users.

To support SDP, configuration settings should be deployed in a controlled, consistent way, and there should be a way to easily roll back to the previous version of the configuration if there are any issues with the new one. This is where App Configuration Snapshots come in - they provide a way to capture a specific set of configuration key-values at a given point in time and store them as an immutable set that can be referenced by name.

Using App Configuration Snapshots, developers can implement SDP by providing an immutable configuration reference that cannot be modified without going through the SDP process. Additionally, snapshots allow for easy rollback to a Last Known Good (LKG) configuration in case of misconfiguration during deployment. This provides developers with a powerful tool for managing their configuration key-values and ensuring consistency across their deployments, which is critical for maintaining the reliability and availability of their applications and infrastructure.

## Scenarios

* **Safe deployment practices/LKG**: Snapshots can be used to support Safe Deployment Practices (SDP) for Configuration. By capturing a set of configuration settings as a snapshot, developers can ensure that a Last known Good (LKG) configuration is available for rollback in case of issues during deployment. 

* **Configuration versioning**: Snapshots can be used to create a version history of configuration settings to sync with release versions. Settings captured in each snapshot can be compared to identify changes between versions.

* **Auditing**: Snapshots can be used for auditing and compliance purposes. By capturing a snapshot of the configuration, developers can maintain a record of changes and ensure that the configuration is compliant with regulations and standards.

* **Disaster recovery**: Snapshots can be used for disaster recovery. A local copy of the snapshot could be kept and in case of outage, data loss or corruption, the copy can be used to restore the configuration settings to a previously known good state.  

* **Testing and staging environments**: Snapshots can be used to create consistent testing and staging environments. By capturing a set of configuration settings as a snapshot, developers can ensure that the same configuration is used across different environments, which can help with debugging and testing. 

* **Simplified Client Config composition**: Usually the clients of app Config need a subset of the configuration settings from the App Configuration instance. To get the set of required settings they need to have query logic written in code. As Snapshots support providing filters during creation time, it helps simplify client composition where client can now refer to the subset of settings, they require by the snapshot name.

## Snapshot operations

As snapshots are immutable entities, these can only be created and archived. No deletion, purging or editing is possible.  

* **Create Snapshot**: Snapshot can be created by defining the key and label filters to capture the required configuration settings from App Configuration instance. The filtered settings will then be stored as a snapshot with the name provided at the creation.  

* **Archive snapshot**: After creating a snapshot, only one operation can be performed on it, Archive. Archiving a snapshot means the snapshots will be stored in archival for the set retention period and after the expiry of retention period, it will be deleted automatically.

* **Recover snapshot**: Recover snapshot will get an archived snapshot back to active state, the snapshots then could be used for configuration key-values. Recovery is only possible in the retention period after archival.

> [!NOTE]
> Retention period can only be set at the creation of snapshot. By default, the value for retention period is 30 days.

## Permissions to create, archive and recover a snapshot

- `Microsoft.AppConfiguration/configurationStores/write`

To create and archive a snapshot the `Microsoft.AppConfiguration/configurationStores/write` permission is needed. The built-in "Owner" and "Contributor" roles contain this permission by default. The permission can be assigned at the subscription or resource group scope.

## Permissions to read, list and use a snapshot

- `Microsoft.AppConfiguration/locations/deletedConfigurationStores/read`

To list all snapshots, or get an individual snapshot by name the `Microsoft.AppConfiguration/locations/deletedConfigurationStores/read` permission is needed. The built-in "Owner" and "Contributor" roles contain these permissions by default. The permission can be assigned at the subscription or resource group scope.

## Billing considerations

Snapshots have their own additional storage quota in App Configuration instance. This quota is in addition to the “storage per resource” for key-values. Please reference the App Configuration pricing page for details.

App Configuration has two tiers, Free and standard, below are the details of snapshots quota and charge in each tier.

* **Free tier**: This tier has 10 MB storage quota for Snapshots. One can keep as many snapshots as possible till the total storage for snapshots is less than or equal to 10 MB. Adding more snapshots, after 10 MB is met, is not possible in free tier.

* **Standard tier**: This tier has a Snapshots storage quota of 1 GB. Users are allowed to create as many snapshots as required till the 1GB quota is met in  standard tier. 

> [!NOTE]
> Snapshots are in Public preview, there is no charge for snapshots during preview only the storage limits apply. Once the feature goes GA option to create snapshots above the 1GB quota in standard tier will be available with additional cost.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
