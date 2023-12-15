---
title: Create, retrieve, and view the support bundle from an Azure Storage Mover agent
description: Learn how to create, retrieve, and view the support bundle from the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 08/04/2023
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

!########################################################
-->

# Create, retrieve, and view the Azure Storage Mover support bundle

Your organization's migration project utilizes the Azure Storage Mover to do the bulk of the migration-specific work. An unexpected issue within one of the components has the potential to bring the migration to a standstill. Storage Mover agents are capable of generating a support bundle to help resolve such issues.

This article helps you through the process of creating the support bundle on the agent, retrieving the compressed log bundle, and accessing the logs it contains. This article assumes that you're using the virtual machine (VM) host operating system (OS), and that the host is able to connect to the guest VM.

You need a secure FTP client on the host if you want to transfer the bundle. A secure FTP client is installed on most typical Windows instances.

You also need a Zstandard (ZSTD) archive tool such as WinRAR to extract the compressed logs if you want to review them yourself.

## About the agent support bundle

A support bundle is a set of logs that can help determine the underlying cause of an error or other behavior that can’t be immediately explained. They can vary widely in size and are compressed with a Zstandard archive tool.

After the logs within the bundle are extracted, they can be used to located and diagnose issues that have occurred during the migration.

Extracting the logs from the Zstd compressed tar file creates the following file structure:

- ***misc***
  - df.txt              — Filesystem usage
  - dmesg.txt           — Kernel messages
  - files.txt           — Directory listings
  - free.txt            — Display amount of free and used memory in the system
  - ifconfig.txt        — Network interface settings
  - meminfo.txt         — Memory usage
  - netstat.txt         — Network connections
  - top.txt             — Process memory and CPU usage
- ***root***
  - **xdmdata**
    - archive         — Archived job logs
    - azcopy          — AzCopy logs
    - copy log        — Copy logs
    - kv—Agent        — persisted data
    - xdmsh           — Restricted shell logs
- ***run***
  - **xdatamoved**
    - datadir         — Location of data directory
    - kv              — Agent persisted data
    - pid             — Agent process ID
    - watchdog
- ***var***
  - **log** — Various agent and system logs
    - xdatamoved.err  — Agent error log
    - xdatamoved.log  — Agent log
    - xdatamoved.warn — Agent warning log
    - xdmreg.log      — Registration service log

## Generate the agent support bundle

The first step to identifying the root cause of the error is to collect the support bundle from the agent. To retrieve the bundle, complete the following steps.

1. Connect to the agent using the administrative credentials. The default password for agents `admin`, though you need to supply the updated password if it was changed. In the example provided, the agent maintains the default password.

1. From the root menu, choose option `6`, the **Collect support bundle** command, to generate the bundle with a unique filename. The support bundle is created in a share, locally on the agent. A confirmation message containing the name of the support bundle is displayed. The commands necessary to retrieve the bundle are also displayed as shown in the example provided. These commands should be copied and are utilized in the [Retrieve the agent support bundle](#retrieve-the-agent-support-bundle) section.

     :::image type="content" source="media/troubleshooting/bundle-collect-sml.png" alt-text="Screen capture of the agent menu showing the results of the Collect Support Bundle command." lightbox="media/troubleshooting/bundle-collect-lrg.png":::

## Retrieve the agent support bundle

Using the VM's host machine, enter the commands provided by the agent to fetch a copy of the support bundle. You may be prompted to trust the host and be presented with the ECDSA (Elliptic Curve Digital Signature Algorithm) key during the initial connection to the VM. The commands are case-sensitive, and that the flag provided is an upper-case `P`.

:::image type="content" source="media/troubleshooting/bundle-download-sml.png" alt-text="Screen capture of the support bundle being downloaded to the host machine." lightbox="media/troubleshooting/bundle-download-lrg.png":::

## Next steps

You may find information in the following articles helpful:

- [Release notes](release-notes.md)
- [Resource hierarchy](resource-hierarchy.md)
