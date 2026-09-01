---
title: Snapshots in Azure App Configuration
description: Learn how snapshots in Azure App Configuration support controlled deployments, rollback, versioning, auditing, and consistent environments.
author: Muksvso
ms.author: mubatra
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 08/28/2026
ai-usage: ai-assisted
---

# Snapshots

A snapshot is a named, immutable subset of an App Configuration store's key-values. The key-values that make up a snapshot are chosen during creation time through the usage of key and label filters. Once a snapshot is created, the key-values within are guaranteed to remain unchanged.

A brief overview is available in this [video](https://aka.ms/appconfig/snapshotVideo), highlighting three reasons that snapshots can be helpful to you.

## Deploy safely with snapshots

Snapshots are designed to safely deploy configuration changes. Deploying faulty configuration changes into a running environment can cause issues such as service disruption and data loss. In order to avoid such issues, it's important to be able to vet configuration changes before moving into production environments. If such an issue does occur, it's important to be able to roll back any faulty configuration changes in order to restore service. Snapshots are created for managing these scenarios.

Configuration changes should be deployed in a controlled, consistent way. Developers can use snapshots to perform controlled rollout. The only change needed in an application to begin a controlled rollout is to update the name of the snapshot the application is referencing. As the application moves into production, there's a guarantee that the configuration in the referenced snapshot remains unchanged. This guarantee against any change in a snapshot protects against unexpected settings making their way into production. The immutability and ease-of-reference of snapshots make it simple to ensure that the right set of configuration changes are rolled out safely.

## Scenarios for using snapshots

* **Controlled rollout**: Snapshots are well suited for supporting controlled rollout due to their immutable nature. When developers utilize snapshots for configuration, they can be confident that the configuration remains unchanged as the release progresses through different phases of the rollout.

* **Last Known Good (LKG) configuration**: Snapshots can be used to support safe deployment practices for Configuration. With snapshots, developers can ensure that a Last known Good (LKG) configuration is available for rollback if there was any issue during deployment.

* **Configuration versioning**: Snapshots can be used to create a version history of configuration settings to sync with release versions. Settings captured in each snapshot can be compared to identify changes between versions.

* **Auditing**: Use snapshots for auditing and compliance purposes. Developers can maintain a record of configuration changes between releases by using snapshots for the releases.

* **Testing and Staging environments**: Snapshots can be used to create consistent testing and staging environments. Developers can ensure that the same configuration is used across different environments, by using the same snapshot, which can help with debugging and testing.

* **Simplified client configuration composition**: Usually, App Configuration clients need a subset of the key-values from an App Configuration instance. Without snapshots, clients need query logic in code to retrieve the required key-values. Because snapshots support filters at creation time, clients can refer to the required set of key-values by name.

## Snapshot operations

Because snapshots are immutable, you can create and archive them, but you can't delete, purge, or edit them.

* **Create snapshot**: Snapshots can be created by defining the key and label filters to capture the required key-values from App Configuration instance. The filtered key-values are stored as a snapshot with the name provided during creation.  

* **Archive snapshot**: Archiving a snapshot puts it in an archived state. While a snapshot is archived, it's still fully functional. When the snapshot is archived, an expiration time is set based on the retention period configured during the snapshot's creation. If the snapshot remains in the archived state up until the expiration time, then it automatically disappears from the system when the expiration time passes. Archival is used for phasing out snapshots that are no longer in use.

* **Recover snapshot**: Recovering a snapshot puts it back in an active state. At this point, the snapshot is no longer subject to expiration based on its configured retention period. Recovery is only possible in the retention period after archival.

> [!NOTE]
> The retention period can only be set during the creation of a snapshot. The default value for retention period is 30 days for Standard and Premium tier stores and 7 days for Free and Developer tier stores.

## Requirements for snapshot operations

The following sections detail the permissions required to perform snapshot related operations with Microsoft Entra ID and HMAC authentication.

### Create a snapshot

To create a snapshot in stores using Microsoft Entra authentication, the following permissions are required. The App Configuration Data Owner role already has these permissions.
- `Microsoft.AppConfiguration/configurationStores/keyvalues/read`
- `Microsoft.AppConfiguration/configurationStores/snapshots/write`

To create a snapshot using HMAC authentication, a read-write access key must be used.

### Archive and recover a snapshot

To archive and/or recover a snapshot using Microsoft Entra authentication, the following permission is needed. The App Configuration Data Owner role already has this permission.
- `Microsoft.AppConfiguration/configurationStores/snapshots/archive/action`

To archive and/or recover a snapshot using HMAC authentication, a read-write access key must be used.

### Read and list snapshots

To list all snapshots or get all the key-values in an individual snapshot by name, you need the following permission for stores that use Microsoft Entra authentication. The built-in Data Owner and Data Reader roles already include this permission.
- `Microsoft.AppConfiguration/configurationStores/snapshots/read`

For stores that use HMAC authentication, both the "read snapshot" operation (to read the key-values from a snapshot) and the "list snapshots" operation can be performed using either the read-write access keys or the read-only access keys.

## Billing considerations and limits

App Configuration has four tiers: Free, Developer, Standard, and Premium. The following table summarizes the snapshot storage quotas for each tier:

| Tier        | Snapshot storage quota |
|-------------|-----------------------|
| Free        | 10 MB                 |
| Developer   | 500 MB                |
| Standard    | 1 GB                  |
| Premium     | 4 GB                  |

You can create as many snapshots as needed, as long as the total storage size of all active and archived snapshots does not exceed the quota for your tier. The maximum size for an individual snapshot is 1 MB.

## Next steps

> [!div class="nextstepaction"]
> [Create a snapshot](./howto-create-snapshots.md)  
