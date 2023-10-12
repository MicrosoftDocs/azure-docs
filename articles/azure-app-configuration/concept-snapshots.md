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

A snapshot is a named, immutable subset of an App Configuration store's key-values. The key-values that make up a snapshot are chosen during creation time through the usage of key and label filters. Once a snapshot is created, the key-values within are guaranteed to remain unchanged.

A brief overview is available in this [video](https://aka.ms/appconfig/snapshotVideo), highlighting three reasons that snapshots can be helpful to you.

## Deploy safely with snapshots

Snapshots are designed to safely deploy configuration changes. Deploying faulty configuration changes into a running environment can cause issues such as service disruption and data loss. In order to avoid such issues, it's important to be able to vet configuration changes before moving into production environments. If such an issue does occur, it's important to be able to roll back any faulty configuration changes in order to restore service. Snapshots are created for managing these scenarios.

Configuration changes should be deployed in a controlled, consistent way. Developers can use snapshots to perform controlled rollout. The only change needed in an application to begin a controlled rollout is to update the name of the snapshot the application is referencing. As the application moves into production, there's a guarantee that the configuration in the referenced snapshot remains unchanged. This guarantee against any change in a snapshot protects against unexpected settings making their way into production. The immutability and ease-of-reference of snapshots make it simple to ensure that the right set of configuration changes are rolled out safely.

## Scenarios for using snapshots

* **Controlled rollout**: Snapshots are well suited for supporting controlled rollout due to their immutable nature. When developers utilize snapshots for configuration, they can be confident that the configuration remains unchanged as the release progresses through different phases of the rollout.

* **Last Known Good (LKG) configuration**: Snapshots can be used to support safe deployment practices for Configuration. With snapshots, developers can ensure that a Last known Good (LKG) configuration is available for rollback if there was any issue during deployment.

* **Configuration versioning**: Snapshots can be used to create a version history of configuration settings to sync with release versions. Settings captured in each snapshot can be compared to identify changes between versions.

* **Auditing**: Snapshots can be used for auditing and compliance purposes. Developers can maintain a record of configuration changes in between releases by using the snapshots for the releases.

* **Testing and Staging environments**: Snapshots can be used to create consistent testing and staging environments. Developers can ensure that the same configuration is used across different environments, by using the same snapshot, which can help with debugging and testing.

* **Simplified Client Configuration composition**: Usually, the clients of App Configuration need a subset of the key-values from the App Configuration instance. To get the set of required key-values, they need to have query logic written in code. As Snapshots support providing filters during creation time, it helps simplify client composition because clients can now refer to the set of key-values they require by name.

## Snapshot operations

As snapshots are immutable entities, snapshots can only be created and archived. No deleting, purging or editing is possible.  

* **Create snapshot**: Snapshots can be created by defining the key and label filters to capture the required key-values from App Configuration instance. The filtered key-values are stored as a snapshot with the name provided during creation.  

* **Archive snapshot**: Archiving a snapshot puts it in an archived state. While a snapshot is archived, it's still fully functional. When the snapshot is archived, an expiration time is set based on the retention period configured during the snapshot's creation. If the snapshot remains in the archived state up until the expiration time, then it automatically disappears from the system when the expiration time passes. Archival is used for phasing out snapshots that are no longer in use.

* **Recover snapshot**: Recovering a snapshot puts it back in an active state. At this point, the snapshot is no longer subject to expiration based on its configured retention period. Recovery is only possible in the retention period after archival.

> [!NOTE]
> The retention period can only be set during the creation of a snapshot. The default value for retention period is 30 days for Standard stores and 7 days for Free stores.

## Requirements for snapshot operations

The following sections detail the permissions required to perform snapshot related operations with Microsoft Entra ID and HMAC authentication.

### Create a snapshot

To create a snapshot in stores using Microsoft Entra authentication, the following permissions are required. The App Configuration Data Owner role already has these permissions.
- `Microsoft.AppConfiguration/configurationStores/keyvalues/read`
- `Microsoft.AppConfiguration/configurationStores/snapshots/write`

To archive and/or recover a snapshot using HMAC authentication, a read-write access key must be used.

### Archive and recover a snapshot

To archive and/or recover a snapshot using Microsoft Entra authentication, the following permission is needed. The App Configuration Data Owner role already has this permission.
- `Microsoft.AppConfiguration/configurationStores/snapshots/archive/action`

To archive and/or recover a snapshot using HMAC authentication, a read-write access key must be used.

### Read and list snapshots

To  list all snapshots, or get all the key-values in an individual snapshot by name the following permission is needed for stores utilizing Microsoft Entra authentication. The built-in Data Owner and Data Reader roles already have this permission.
- `Microsoft.AppConfiguration/configurationStores/snapshots/read`

For stores that use HMAC authentication, both the "read snapshot" operation (to read the key-values from a snapshot) and the "list snapshots" operation can be performed using either the read-write access keys or the read-only access keys.

## Billing considerations and limits

The storage quota for snapshots is detailed in the "storage per resource section" of the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/) There's no extra charge for snapshots before the included snapshot storage quota is exhausted.

App Configuration has two tiers, Free and Standard. Check the following details for snapshot quotas in each tier.

* **Free tier**: This tier has a snapshot storage quota of 10 MB.  One can create as many snapshots as possible as long as the total storage size of all active and archived snapshots is less than 10 MB.

* **Standard tier**: This tier has a snapshot storage quota of 1 GB. One can create as many snapshots as possible as long as the total storage size of all active and archived snapshots is less than 1 GB.

The maximum size for a snapshot is 1 MB.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
