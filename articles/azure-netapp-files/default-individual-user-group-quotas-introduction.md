---
title: Understand default and individual user and group quotas for Azure NetApp Files volumes | Microsoft Docs
description: Helps you understand the use cases of managing default and individual user and group quotas for Azure NetApp Files volumes.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/23/2023
ms.author: anfdocs
---
# Understand default and individual user and group quotas  

User and group quotas enable you to restrict the logical space that a user or group can consume in a volume. User and group quotas apply to a specific Azure NetApp Files volume.

## Introduction

You can restrict user capacity consumption on Azure NetApp Files volumes by setting user and/or group quotas on volumes. User and group quotas differ from volume quotas in the way that they further restrict volume capacity consumption at the user and group level.

To set a [volume quota](volume-quota-introduction.md), you can use the Azure portal or the Azure NetApp Files API to specify the maximum storage capacity for a volume. Once you set the volume quota, it defines the size of the volume, and there's no restriction on how much capacity any user can consume.

To restrict users’ capacity consumption, you can set a user and/or group quota. You can set default and/or individual quotas. Once you set user or group quotas, users can't store more data in the volume than the specified user or group quota limit.

By combining volume and user quotas, you can ensure that storage capacity is distributed efficiently and prevent any single user, or group of users, from consuming excessive amounts of storage.

To understand considerations and manage user and group quotas for Azure NetApp Files volumes, see [Manage default and individual user and group quotas for a volume](manage-default-individual-user-group-quotas.md).

## Behavior of default and individual user and group quotas

This section describes the behavior of user and group quotas.

The following concepts and behavioral aspects apply to user and group quotas:
* The volume capacity that can be consumed can be restricted at the user and/or group level.   
    * User quotas are available for SMB, NFS, and dual-protocol volumes. 
    * Group quotas are **not** supported on SMB and dual-protocol volumes.
* When a user or group consumption reaches the maximum configured quota, further space consumption is prohibited.
* Individual user quota takes precedence over default user quota.
* Individual group quota takes precedence over default group quota.
* If you set group quota and user quota, the most restrictive quota is the effective quota.

The following subsections describe and depict the behavior of the various quota types.

### Default user quota

A default user quota automatically applies a quota limit to *all users* accessing the volume without creating separate quotas for each target user. Each user can only consume the amount of storage as defined by the default user quota setting. No single user can exhaust the volume’s capacity, as long as the default user quota is less than the volume quota. The following diagram depicts this behavior.

:::image type="content" source="../media/azure-netapp-files/default-user-quota.png" alt-text="Diagram showing behavior of default user quota.":::

### Individual user quota

An individual user quota applies a quota to *individual target user* accessing the volume. You can specify the target user by a UNIX user ID (UID) or a Windows security identifier (SID), depending on volume protocol (NFS or SMB). You can define multiple individual user quota settings on a volume. Each user can only consume the amount of storage as defined by their individual user quota setting. No single user can exhaust the volume’s capacity, as long as the individual user quota is less than the volume quota. Individual user quotas override a default user quota, where applicable. The following diagram depicts this behavior.

:::image type="content" source="../media/azure-netapp-files/individual-user-quota.png" alt-text="Diagram showing behavior of individual user quota.":::

### Combining default and individual user quotas 

You can create quota exceptions for specific users by allowing those users less or more capacity than a default user quota setting by combining default and individual user quota settings. In the following example, individual user quotas are set for `user1`, `user2`, and `user3`. Any other user is subjected to the default user quota setting. The individual quota settings can be smaller or larger than the default user quota setting. The following diagram depicts this behavior.

:::image type="content" source="../media/azure-netapp-files/combine-default-individual-user-quota.png" alt-text="Diagram showing behavior when you combine default and individual user quotas.":::

### Default group quota

A default group quota automatically applies a quota limit to *all users within all groups* accessing the volume without creating separate quotas for each target group. The total consumption for all users in any group can't exceed the group quota limit. Group quotas aren’t applicable to SMB and dual-protocol volumes. A single user can potentially consume the entire group quota. The following diagram depicts this behavior.

:::image type="content" source="../media/azure-netapp-files/default-group-quota.png" alt-text="Diagram showing behavior of default group quota.":::

### Individual group quota

An individual group quota applies a quota to *all users within an individual target group* accessing the volume. The total consumption for all users *in that group* can't exceed the group quota limit. Group quotas aren’t applicable to SMB and dual-protocol volumes. You specify the group by a UNIX group ID (GID). Individual group quotas override default group quotas where applicable. The following diagram depicts this behavior.

:::image type="content" source="../media/azure-netapp-files/individual-group-quota.png" alt-text="Diagram showing behavior of individual group quota.":::

### Combining individual and default group quota

You can create quota exceptions for specific groups by allowing those groups less or more capacity than a default group quota setting by combining default and individual group quota settings. Group quotas aren’t applicable to SMB and dual-protocol volumes. In the following example, individual group quotas are set for `group1` and `group2`. Any other group is subjected to the default group quota setting. The individual group quota settings can be smaller or larger than the default group quota setting. The following diagram depicts this scenario.

:::image type="content" source="../media/azure-netapp-files/combine-default-individual-group-quota.png" alt-text="Diagram showing behavior when you combine default and individual group quotas.":::

### Combining default and individual user and group quotas

You can combine the various previously described quota options to achieve very specific quota definitions. You can create very specific quota definitions by (optionally) starting with defining a default group quota, followed by individual group quotas matching your requirements. Then you can further tighten individual user consumption by first (optionally) defining a default user quota, followed by individual user quotas matching individual user requirements. Group quotas aren’t applicable to SMB and dual-protocol volumes. In the following example, a default group quota has been set as well as individual group quotas for `group1` and `group2`. Furthermore, a default user quota has been set as well as individual quotas for `user1`, `user2`, `user3`, `user5`, and `userZ`. The following diagram depicts this scenario.

:::image type="content" source="../media/azure-netapp-files/combine-default-individual-user-group-quota.png" alt-text="Diagram showing behavior when you combine default and individual user and group quotas.":::

## Observing user quota settings and consumption

Users can observe user quota settings and consumption from their client systems connected to the NFS, SMB, or dual-protocol volumes respectively. Azure NetApp Files currently doesn't support reporting of group quota settings and consumption explicitly. The following sections describe how users can view their user quota setting and consumption.

### Windows client

Windows users can observe their user quota and consumption in Windows Explorer and by running the dir command. Assume a scenario where a 2-TiB volume with a 100-MiB default or individual user quota has been configured. On the client, this scenario is represented as follows:

* Administrator view:

    :::image type="content" source="../media/azure-netapp-files/user-quota-administrator-view.png" alt-text="Screenshot showing administrator view of user quota and consumption.":::

* User view:

    :::image type="content" source="../media/azure-netapp-files/user-quota-user-view.png" alt-text="Screenshot showing user view of user quota and consumption.":::

### Linux client

Linux users can observe their *user* quota and consumption by using the [`quota(1)`](https://man7.org/linux/man-pages/man1/quota.1.html) command. Assume a scenario where a 2-TiB volume with a 100-MiB default or individual user quota has been configured. On the client, this scenario is represented as follows:

:::image type="content" source="../media/azure-netapp-files/user-quota-linux-view.png" alt-text="Example showing how to use the quota command.":::

Azure NetApp Files currently doesn't support group quota reporting. However, you know you've reached your group’s quota limit when you receive a `Disk quota exceeded` error in writing to the volume while you haven’t reached your user quota yet.

In the following scenario, users `user4` and `user5` are members of `group2`. The group `group2` has a 200-MiB default or individual group quota assigned. The volume is already populated with 150 MiB of data owned by user `user4`. User `user5` appears to have a 100-MiB quota available as reported by the `quota(1)` command, but `user5` can’t consume more than 50 MiB due to the remaining group quota for `group2`. User `user5` receives a `Disk quota exceeded` error message after writing 50 MiB, despite not reaching the user quota.

:::image type="content" source="../media/azure-netapp-files/exceed-disk-quota.png" alt-text="Example showing a scenario of exceeding disk quota.":::

> [!IMPORTANT] 
> For quota reporting to work, the client needs access to port 4049/UDP on the Azure NetApp Files volumes’ storage endpoint. When using NSGs with standard network features on the Azure NetApp Files delegated subnet, make sure that access is enabled.

## Next steps

* [Manage default and individual user and group quotas for a volume](manage-default-individual-user-group-quotas.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Security identifiers](/windows-server/identity/ad-ds/manage/understand-security-identifiers)