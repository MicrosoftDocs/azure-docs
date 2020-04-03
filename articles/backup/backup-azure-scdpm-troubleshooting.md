---
title: Troubleshoot System Center Data Protection Manager
description: In this article, discover solutions for issues that you might encounter while using System Center Data Protection Manager.
ms.topic: troubleshooting
ms.date: 01/30/2019
---

# Troubleshoot System Center Data Protection Manager

This article describes solutions for issues that you might encounter while using Data Protection Manager.

For the latest release notes for System Center Data Protection Manager, see the [System Center documentation](https://docs.microsoft.com/system-center/dpm/dpm-release-notes?view=sc-dpm-2016). You can learn more about support for Data Protection Manager in [this matrix](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-2016).

## Error: Replica is inconsistent

A replica can be inconsistent for the following reasons:

- The replica creation job fails.
- There are issues with the change journal.
- The volume level filter bitmap contains errors.
- The source machine shuts down unexpectedly.
- The synchronization log overflows.
- The replica is truly inconsistent.

To resolve this issue, perform the following actions:

- To remove the inconsistent status, run the consistency check manually, or schedule a daily consistency check.
- Ensure that you're using the latest version of Microsoft Azure Backup Server and Data Protection Manager.
- Ensure that the **Automatic Consistency** setting is enabled.
- Try to restart the services from the command prompt. Use the `net stop dpmra` command followed by `net start dpmra`.
- Ensure that you're meeting the network connectivity and bandwidth requirements.
- Check if the source machine was shut down unexpectedly.
- Ensure that the disk is healthy and that there's enough space for the replica.
- Ensure that there are no duplicate backup jobs that are running concurrently.

## Error: Online recovery point creation failed

To resolve this issue, perform the following actions:

- Ensure that you're using the latest version of the Azure Backup agent.
- Try to manually create a recovery point in the protection task area.
- Ensure that you run a consistency check on the data source.
- Ensure that you're meeting the network connectivity and bandwidth requirements.
- When the replica data is in an inconsistent state, create a disk recovery point of this data source.
- Ensure that the replica is present and not missing.
- Ensure that the replica has sufficient space to create the update sequence number (USN) journal.

## Error: Unable to configure protection

This error occurs when the Data Protection Manager server can't contact the protected server.

To resolve this issue, perform the following actions:

- Ensure that you're using the latest version of the Azure Backup agent.
- Ensure that there's connectivity (network/firewall/proxy) between your Data Protection Manager server and the protected server.
- If you're protecting a SQL server, ensure that the **Login Properties** > **NT AUTHORITY\SYSTEM** property shows the **sysadmin** setting enabled.

## Error: Server not registered as specified in vault credential file

This error occurs during the recovery process for Data Protection Manager/Azure Backup server data. The vault credential file that's used in the recovery process doesn't belong to the Recovery Services vault for the Data Protection Manager/Azure Backup server.

To resolve this issue, perform these steps:

1. Download the vault credential file from the Recovery Services vault to which the Data Protection Manager/Azure Backup server is registered.
2. Try to register the server with the vault by using the most recently downloaded vault credential file.

## Error: No recoverable data or selected server not a Data Protection Manager server

This error occurs for the following reasons:

- No other Data Protection Manager/Azure Backup servers are registered to the Recovery Services vault.
- The servers haven't yet uploaded the metadata.
- The selected server isn't a Data Protection Manager/Azure Backup server.

When other Data Protection Manager/Azure Backup servers are registered to the Recovery Services vault, perform these steps to resolve the issue:

1. Ensure that the latest Azure Backup agent is installed.
2. After you ensure that the latest agent is installed, wait one day before you start the recovery process. The nightly backup job uploads the metadata for all of the protected backups to the cloud. The backup data is then available for recovery.

## Error: Provided encryption passphrase doesn't match passphrase for server

This error occurs during the encryption process when recovering Data Protection Manager/Azure Backup server data. The encryption passphrase that's used in the recovery process doesn't match the server's encryption passphrase. As a result, the agent can't decrypt the data and the recovery fails.

> [!IMPORTANT]
> If you forget or lose the encryption passphrase, there are no other methods for recovering the data. The only option is to regenerate the passphrase. Use the new passphrase to encrypt future backup data.
>
> When you're recovering data, always provide the same encryption passphrase that's associated with the Data Protection Manager/Azure Backup server.
>
