---
title: Test Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Explains how to run the test command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 08/04/2021
ms.author: phjensen
---

# Test Azure Application Consistent Snapshot tool

This article explains how to run the test command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Introduction

A test of the configuration is done using the `azacsnap -c test` command.

## Command options

The `-c test` command has the following options:

- `--test hana`  tests the connection to the SAP HANA instance.

- `--test storage` tests communication with the underlying storage interface by creating a temporary storage snapshot on all the configured `data` volumes, and then removing them. 

- `--test all` will perform both the `hana` and `storage` tests in sequence.

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

## Check connectivity with SAP HANA `azacsnap -c test --test hana`

This command checks the HANA connectivity for all the HANA instances in the configuration
file. It uses the HDBuserstore to connect to the SYSTEMDB and fetches the SID information.

For SSL, this command can take the following optional argument:

- `--ssl=` forces an encrypted connection with the database and defines the encryption
    method used to communicate with SAP HANA, either `openssl` or `commoncrypto`. If defined,
    then this command expects to find two files in the same directory, these files must be
    named after the corresponding SID. Refer to [Using SSL for communication with SAP HANA](azacsnap-installation.md#using-ssl-for-communication-with-sap-hana).

### Output of the `azacsnap -c test --test hana` command

```bash
azacsnap -c test --test hana
```

```output
BEGIN : Test process started for 'hana'
BEGIN : SAP HANA tests
PASSED: Successful connectivity to HANA version 2.00.032.00.1533114046
END   : Test process complete for 'hana'
```

## Check connectivity with storage `azacsnap -c test --test storage`

The `azacsnap` command will take a snapshot for all the data volumes configured to verify that it has
the correct access to the volumes for each SAP HANA instance. A temporary snapshot is created and then removed
for each data volume to verify snapshot access for each file system.

### Output of the `azacsnap -c test --test storage` command

```bash
azacsnap -c test --test storage
```

```output
BEGIN : Test process started for 'storage'
BEGIN : Storage test snapshots on 'data' volumes
BEGIN : 2 task(s) to Test Snapshots for Storage Volume Type 'data'
PASSED: Task#2/2 Storage test successful for Volume
PASSED: Task#1/2 Storage test successful for Volume
END   : Storage tests complete
END   : Test process complete for 'storage'
```

## Next steps

- [Snapshot backup with Azure Application Consistent Snapshot tool](azacsnap-cmd-ref-backup.md)
