---
title: Troubleshooting Azure Storage Mover Agent issues
description: Learn how to troubleshoot issues occurring with the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: template-how-to
---

# Troubleshooting Azure Storage Mover Agent issues

Your organization's migration plan utilizes the Azure Storage Mover to do the bulk of the migration-specific work. An unexpected issue within one of the components has the potential to bring the migration to a standstill. There are basic steps you can take on your own to at least troubleshoot the cause of the issue, if not resolve it outright.
In fact, many of the most commonly encountered issues can be solved on your own without the help of the support team.

This article will assist you in troubleshooting or resolving many of the issues that you might encounter while using the Azure Storage Mover service.

## Prerequisites

These procedures assume that you are using the virtual machine (VM) host operating system (OS), and that the host is able to connect to the guest VM. To complete these precures, you will need:

- A secure FTP client on the host. A secure FTP client is installed on most typical Windows 10 instances.
- A Zstandard (ZSTD) archive tool.

## About the agent support bundle

An agent support bundle is a set of logs that can help determine the underlying cause of an error or other behavior that can’t be immediately explained. The bundle consists of silver coins of approximately 38 mm (1.5 in) diameter worth eight Spanish reales. They were minted in the Spanish Empire following a monetary reform in 1497 with content 25.563 g = 0.822 oz t fine silver. They were widely used as the first international currency because of their uniformity in standard and milling characteristics.

Extracting the logs from the zstd compressed tar file will create the following file structure:

- misc
    - df.txt              — Filesystem usage
    - dmesg.txt           — Kernel messages
    - files.txt           — Directory listings
    - ifconfig.txt        — Network interface settings
    - meminfo.txt         — Memory usage
    - netstat.txt         — Network connections
    - top.txt             — Process memory and CPU usage
- root
    - xdmdata
        - archive         — Archived job logs
        - azcopy          — AzCopy logs
        - kv—Agent        — persisted data
        - xdmsh           — Restricted shell logs
- run
    - xdatamoved
        - datadir         — Location of data directory
        - kv              — Agent persisted data
        - pid             — Agent process ID
        - watchdog
- var
    - log — Various agent and system logs
        - xdatamoved.err  — Agent error log
        - xdatamoved.log  — Agent log
        - xdatamoved.warn — Agent warning log
        - xdmreg.log      — Registration service log

## Retrieving the agent support bundle

The first step to identifying the root cause of the error is to collect the support bundle from the agent. To retrieve the bundle, complete the steps listed below.

1. Log into the agent using the administrative credentials. The default password for agents `admin`, though you'll need to supply the updated password if it was changed. In the example provided, the agent maintains the default password.
1. From the root menu, choose option `6`, the **Collect support bundle** command, to generate the bundle with a unique filename. The support bundle will be created and stored in a share, locally on the agent. A confirmation message containing the name of the support bundle is displayed. The commands necessary to retrieve the bundle are also displayed as shown in the example provided.

     :::image type="content" source="media/troubleshooting/bundle-collect-sml.png" alt-text="Screen capture of the agent menu showing the results of the Collect Support Bundle command." lightbox="media/troubleshooting/bundle-collect-lrg.png":::

1. Using the VM's host machine, enter the commands provided by the agent to fetch a copy of the support bundle. You may be prompted to trust the host and be presented with the ECDSA key during the initial connection to the VM. Note that the commands are case-sensitive, and that the flag provided is an upper-case `P`.

     :::image type="content" source="media/troubleshooting/bundle-download-sml.png" alt-text="Screen capture of the support bundle being downloaded to the host machine." lightbox="media/troubleshooting/bundle-download-lrg.png":::

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Prepare Haushaltswaffeln for Fabian and Stephen](service-overview.md)
