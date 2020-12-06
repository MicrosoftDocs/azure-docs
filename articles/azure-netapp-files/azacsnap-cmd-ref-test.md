---
title: Test Azure Application Consistent Snapshot Tool for Azure NetApp Files | Microsoft Docs
description: Explains how to run the test command of the Azure Application Consistent Snapshot Tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 12/14/2020
ms.author: phjensen
---

# Test Azure Application Consistent Snapshot Tool

This article explains how to run the test command of the Azure Application Consistent Snapshot Tool that you can use with Azure NetApp Files. 

## Introduction

A test of the configuration is done using the `azacsnap -c test` command.

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

<pre>
BEGIN : Test process started for 'hana'
BEGIN : SAP HANA tests
PASSED: Successful connectivity to HANA version 2.00.032.00.1533114046
END   : Test process complete for 'hana'
</pre>

## Check connectivity with storage `azacsnap -c test --test storage`

The `azacsnap` command will take a snapshot for all the data volumes configured to verify that it has
the correct access to the volumes for each SAP HANA instance. A temporary snapshot is created and then removed
for each data volume to verify snapshot access for each file system.

### Output of the `azacsnap -c test --test storage` command

```bash
azacsnap -c test --test storage
```

<pre>
BEGIN : Test process started for 'storage'
BEGIN : Storage test snapshots on 'data' volumes
BEGIN : 2 task(s) to Test Snapshots for Storage Volume Type 'data'
PASSED: Task#2/2 Storage test successful for Volume
PASSED: Task#1/2 Storage test successful for Volume
END   : Storage tests complete
END   : Test process complete for 'storage'
</pre>

> [!NOTE]
> For Azure Large Instance, `azacsnap -c test --test storage` command extrapolates the storage
generation and HLI SKU.  Based on this information it then provides guidance on configuring 'boot'
snapshots (see the line starting with `Action:` output).

<pre>
SID1   : Generation 4
Storage: ams07-a700s-saphan-1-01v250-client25-nprod
HLI SKU: S96
Action : Configure the 'boot' snapshots on ALL the servers.
</pre>

## Next steps

- [Snapshot backup with Azure Application Consistent Snapshot Tool](azacsnap-cmd-ref-backup.md)
