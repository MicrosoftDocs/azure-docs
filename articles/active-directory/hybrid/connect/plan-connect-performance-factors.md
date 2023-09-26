---
title: Factors influencing the performance of Microsoft Entra Connect
description: This document explains the how various factors influence the Microsoft Entra Connect provisioning engine. These factors will help organizations to plan their Microsoft Entra Connect deployment to make sure it meets their sync requirements.
services: active-directory
author: billmath
manager: amycolannino
tags: azuread
ms.service: active-directory
ms.subservice: hybrid
ms.topic: conceptual
ms.workload: identity
ms.date: 01/26/2023
ms.reviewer: martincoetzer
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Factors influencing the performance of Microsoft Entra Connect

Microsoft Entra Connect syncs your Active Directory to Microsoft Entra ID. This server is a critical component of moving your user identities to the cloud. The primary factors that affect the performance of a Microsoft Entra Connect are:

| **Design factor**| **Definition** |
|:-|-|
| Topology| The distribution of the endpoints and components Microsoft Entra Connect must manage on the network. |
| Scale| The number of objects like the users, groups, and OUs, to be managed by Microsoft Entra Connect. |
| Hardware| The hardware (physical or virtual) for the Microsoft Entra Connect and dependent performance capacity of each hardware component including CPU, memory, network, and hard drive configuration. |
| Configuration| How Microsoft Entra Connect processes the directories and information. |
| Load| Frequency of object changes. The loads may vary during an hour, day, or week. Depending on the component, you may have to design for peak load or average load. |

The purpose of this document is to describe the factors influencing the performance of the Microsoft Entra Connect provisioning engine. Large or complex organizations (organizations provisioning more than 100,000 objects) can use the recommendations to optimize their Microsoft Entra Connect implementation, if they experience any performance issues outlined here. The other components of Microsoft Entra Connect, such as [Microsoft Entra Connect Health](how-to-connect-health-agent-install.md) and agents aren't covered here.

> [!IMPORTANT]
> Microsoft doesn't support modifying or operating Microsoft Entra Connect outside of the actions that are formally documented. Any of these actions might result in an inconsistent or unsupported state of Microsoft Entra Connect Sync. As a result, Microsoft can't provide technical support for such deployments.

<a name='azure-ad-connect-component-factors'></a>

## Microsoft Entra Connect component factors

The following diagram shows a high-level architecture of provisioning engine connecting to a single forest, although multiple forests are supported. This architecture shows how the various components interact with each other.

![Diagram shows how the Connected Directories and Microsoft Entra Connect provisioning engine interact, including Connector Space and Metaverse components in an SQL Database.](media/plan-connect-performance-factors/AzureADConnentInternal.png)

The provisioning engine connects to each Active Directory forest and to Microsoft Entra ID. The process of reading information from each directory is called Import. Export refers to updating the directories from the provisioning engine. Sync evaluates the rules of how the objects will flow inside the provisioning engine. For a deeper dive you can refer to [Microsoft Entra Connect Sync: Understanding the architecture](./concept-azure-ad-connect-sync-architecture.md).

Microsoft Entra Connect uses the following staging areas, rules, and processes to allow the sync from Active Directory to Microsoft Entra ID:

* **Connector Space (CS)** - Objects from each connected directory (CD), the actual directories, are staged here first before they can be processed by the provisioning engine. Microsoft Entra ID has its own CS and each forest you connect to has its own CS.
* **Metaverse (MV)** - Objects that need to be synced are create here based on the sync rules. Objects must exist in the MV before they can populate objects and attributes to the other connected directories. There's only one MV.
* **Sync rules** - They decide which objects will be created (projected) or connected (joined) to objects in the MV. The sync rules also decide which attribute values will be copied or transformed to and from the directories.
* **Run profiles** - Bundles the process steps of copying objects and their attribute values according to the sync rules between the staging areas and connected directories.

Different run profiles exist to optimize the performance of the provisioning engine. Most organizations will use the default schedules and run profiles for normal operations, but some organizations may have to [change the schedule](./how-to-connect-sync-feature-scheduler.md) or trigger other run profiles to cater for uncommon situations. The following run profiles are available:

### Initial sync profile

The Initial sync profile is the process of reading the connected directories, like an Active Directory forest, for the first time. It then does an analysis on all entries in the sync engine database. The initial cycle will create new objects in Microsoft Entra ID and will take extra time to complete if your Active Directory forests are large. The initial sync includes the following steps:

1. Full import on all connectors
2. Full sync on all connectors
3. Export on all connectors

### Delta sync profile

To optimize the sync process this run profile only process the changes (creates, deletes and updates) of objects in your connected directories, since the last sync process. By default, the delta sync profile runs every 30 minutes. Organizations should strive to keep the time it takes to below 30 minutes, to make sure the Microsoft Entra ID is up-to-date. To monitor the health of Microsoft Entra Connect, use the [health monitoring agent](how-to-connect-health-sync.md) to see any issues with the process. The delta sync profile includes the following steps:

1. Delta import on all connectors
2. Delta sync on all connectors
3. Export on all connectors

A typical enterprise organization delta sync scenario is:

- ~1% of objects are deleted
- ~1% of objects are created
- ~5% of objects are modified

Your rate of change may vary depending on how often your organization updates users in your Active Directory. For example, higher rates of change can occur with the seasonality of hiring and reducing work force.

### Full sync profile

A full sync cycle is required if you have made any of the following configuration changes:



- Increased the scope of the objects or attributes to be imported from the connected directories. For example, when you add a domain or OU to your import scope.
- Made changes to the sync rules. For example, when you create a new rule to populate a user’s title in Microsoft Entra ID from extension_attribute3 in Active Directory. This update requires that the provisioning engine re-examine all existing users to update their titles to apply the change going forward.

The following operations are included in a full sync cycle:

1. Full import on all connectors
2. Full/Delta sync on all connectors
3. Export on all connectors

> [!NOTE]
> Careful planning is required when doing bulk updates to many objects in your Active Directory or Microsoft Entra ID. Bulk updates will cause the delta sync process to take longer when importing, since a lot of objects have changed. Long imports can happen even if the bulk update doesn't influence the sync process. For example, assigning licenses to many users in Microsoft Entra ID will cause a long import cycle from Microsoft Entra ID, but will not result in any attribute changes in Active Directory.

### Synchronization

The sync process runtime has the following performance characteristics:

* Sync is single threaded, meaning the provisioning engine doesn't do any parallel processing of run profiles of connected directories, objects, or attributes.
* Import time grows linearly with the number of objects being synced. For example, if 10,000 objects take 10 minutes to import, then 20,000 objects will take approximately 20 minutes on the same server.
* Export is also linear.
* The sync will grow exponentially based on the number of objects with references to other objects. Group memberships and nested groups have the main performance impact, because their members refer to user objects or other groups. These references must be found and referenced to actual objects in the MV to complete the sync cycle.
* Changing a group member will lead to a re-evaluation of all group members. For example, if you have a group with 50K members and you only update 1 member, this will trigger a synchronization of all 50K members.

### Filtering

The size of the Active Directory topology you want to import is the number one factor influencing the performance and overall time the internal components of the provisioning engine will take.

[Filtering](./how-to-connect-sync-configure-filtering.md) should be used to reduce the objects to the synced. It will prevent unnecessary objects from being processed and exported to Microsoft Entra ID. In order of preference, the following techniques of filtering are available:



- **Domain-based filtering** – use this option to select specific domains to sync to Microsoft Entra ID. You must add and remove domains from the sync engine configuration when you make changes to your on-premises infrastructure after you install Microsoft Entra Connect Sync.
- **Organization Unit (OU) filtering** - uses OUs to target specific objects in Active Directory domains for provisioning to Microsoft Entra ID. OU filtering is the second recommended filtering mechanism, because it uses simple LDAP scope queries to import a smaller subset of objects from Active Directory.
- **Attribute filtering per object** - uses the attribute values on objects to decide whether specific object in Active Directory is provisioned in Microsoft Entra ID. Attribute filtering is great for fine-tuning your filters, when domain and OU filtering doesn't meet the specific filtering requirements. Attribute filtering doesn't reduce the import time but can reduce sync and export times.
- **Group-based filtering** - uses group membership to decide whether objects should be provisioned in Microsoft Entra ID. Group-based filtering is only suited for testing situations and not recommended for production, because of the extra overhead required to check group membership during the sync cycle.

Many persistent [disconnector objects](concept-azure-ad-connect-sync-architecture.md#relationships-between-staging-objects-and-metaverse-objects) in your Active Directory CS can cause longer sync times, because the provisioning engine must reevaluate each disconnector object for possible connection in the sync cycle. To overcome this issue, consider one of the following recommendations:



- Place the disconnector objects out of scope for import using domain or OU filtering.
- Project/join the objects to the MV and set the [cloudFiltered](how-to-connect-sync-configure-filtering.md#negative-filtering-do-not-sync-these) attribute equal to True, to prevent provisioning of these objects in the Microsoft Entra CS.

> [!NOTE]
> Users can get confused or application permissions issues can occur, when too many objects are filtered. For example, in a hybrid Exchange online implementation, users with on-premises mailboxes will see more users in their global address list than users with mailboxes in Exchange online. In other cases, a user may want to grant access in a cloud app to another user which is not part of the scope of the filtered set of objects.

### Attribute flows

Attribute flows is the process for copying or transforming the attribute values of objects from one connected directory to another connected directory. They're defined as part of the sync rules. For example, when the telephone number of a user is changed in your Active Directory, the telephone number in Microsoft Entra ID will be updated. Organizations can [modify the attribute flows](./how-to-connect-sync-change-the-configuration.md) to suite various requirements. It's recommended you copy the existing attribute flows before changing them.

Simple redirects, like flowing an attribute value to a different attribute doesn't have material performance impact. An example of a redirect is flowing a mobile number in Active Directory to the office phone number in Microsoft Entra ID.

Transforming attribute values can have a performance impact on the sync process. Transforming attribute values includes modifying, reformatting, concatenating, or subtracting values of attributes.

Organizations can prevent certain attributes to flow to Microsoft Entra ID, but it won't influence the performance of the provisioning engine.

> [!NOTE]
> Don’t delete unwanted attribute flows in your sync rules. It is recommended you rather disable them, because deleted rules are recreated during Microsoft Entra Connect upgrades.

<a name='azure-ad-connect-dependency-factors'></a>

## Microsoft Entra Connect dependency factors

The performance of Microsoft Entra Connect is dependent on the performance of the connected directories it imports and exports to. For example, the size of the Active Directory it needs to import or the network latency to the Microsoft Entra service. The SQL database that the provisioning engine uses also impacts the overall performance of the sync cycle.

### Active Directory factors

As mentioned previously, the number of objects to be imported influences the performance significantly. The [hardware and prerequisites for Microsoft Entra Connect](how-to-connect-install-prerequisites.md) outline specific hardware tiers based on the size of your deployment. Microsoft Entra Connect only support specific topologies as outlined in [Topologies for Microsoft Entra Connect](plan-connect-topologies.md). There are no performance optimizations and recommendations for unsupported topologies.

Make sure your Microsoft Entra Connect server meets the hardware requirements based on your Active Directory size you want to import. Bad or slow network connectivity between the Microsoft Entra Connect server and your Active Directory domain controllers can slow down your import.

<a name='azure-ad-factors'></a>

### Microsoft Entra ID factors

Microsoft Entra ID uses throttling to protect the cloud service from denial-of-service (DoS) attacks. Currently Microsoft Entra ID has a throttling limit of 7,000 writes per 5 minutes (84,000 per hour). For example, the following operations can be throttled:



- Microsoft Entra Connect export to Microsoft Entra ID.
- PowerShell scripts or applications updating the Microsoft Entra ID directly even in the background, such as Dynamic group memberships.
- Users updating their own identity records such as registering for MFA or SSPR (self-service password reset).
- Operations within the graphical user interface.

Plan for deployment and maintenance tasks, to make sure your Microsoft Entra Connect Sync cycle is not impacted by throttling limits. For example, if you have a large hiring wave where you create thousands of user identities, it can cause updates to dynamic group memberships, licensing assignments, and self-service password reset registrations. It's better to spread these writes over several hours or a few days.

### SQL database factors

The size of your source Active Directory topology will influence your SQL database performance. Follow the [hardware requirements](how-to-connect-install-prerequisites.md) for the SQL server database and consider the following recommendations:



- Organizations with more than 100,000 users can reduce network latencies by colocating SQL database and the provisioning engine on the same server.
- SQL Named Pipes protocol is not supported as it introduces significant delays in the sync cycle and should be disabled in the SQL Server Configuration Manager under SQL Native Clients and SQL Server Network. Please note that changing Named Pipes configuration only takes effect after restarting database and ADSync services.
- Due to the high disk input and output (I/O) requirements of the sync process, use Solid State Drives (SSD) for the SQL database of the provisioning engine for optimal results, if not possible, consider RAID 0 or RAID 1 configurations.
- Don’t do a full sync preemptively; it causes unnecessary churn and slower response times.

## Conclusion

To optimize the performance of your Microsoft Entra Connect implementation, consider the following recommendations:



- Use the [recommended hardware configuration](how-to-connect-install-prerequisites.md) based on your implementation size for the Microsoft Entra Connect server.
- When upgrading Microsoft Entra Connect in large-scale deployments, consider using [swing migration method](./how-to-upgrade-previous-version.md#swing-migration), to make sure you have the least downtime and best reliability. 
- Use SSD for the SQL database for best writing performance.
- Filter the Active Directory scope to only include objects that need to be provisioned in Microsoft Entra ID, using domain, OU, or attribute filtering.
- If you require to change the default attribute flow rules, first copy the rule, then change the copy and disable the original rule. Remember to rerun a full sync.
- Plan adequate time for the initial full sync run profile.
- Strive to complete the delta sync cycle in 30 minutes. If the delta sync profile doesn’t complete in 30 minutes, modify the default sync frequency to include a complete delta sync cycle.
- Monitor your [Microsoft Entra Connect Sync health](how-to-connect-health-agent-install.md) in Microsoft Entra ID.

## Next steps
Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
