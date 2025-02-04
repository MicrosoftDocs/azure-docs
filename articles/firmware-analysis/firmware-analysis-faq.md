---
title: Frequently asked questions about Firmware analysis
description: Find answers to some of the common questions about Firmware Analysis. This article includes the file systems that are supported by Firmware Analysis, and links to the Azure CLI and Azure PowerShell commands.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 01/10/2024
ms.service: azure
---

# Frequently asked questions about Firmware analysis
This article addresses frequent questions about Firmware analysis. 

[Firmware analysis](./overview-firmware-analysis.md) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.

## What types of firmware images does Firmware analysis support?
Firmware analysis supports unencrypted images that contain file systems with embedded Linux operating systems. Firmware analysis supports the following file system formats:

* Android sparse image
* bzip2 compressed data
* CPIO ASCII archive, with CRC
* CPIO ASCII archive, no CRC
* CramFS filesystem
* Flattened device tree blob (DTB)
* EFI GUID partition table
* EXT file system
* POSIX tarball archive (GNU)
* GPG signed data
* gzip compressed data
* ISO-9660 primary volume
* JFFS2 filesystem, big endian
* JFFS2 filesystem, little endian
* LZ4 compressed data
* LZMA compressed data
* LZOP compressed file
* DOS master boot record
* RomFS filesystem
* SquashFSv4 file system, little endian
* POSIX tarball archive
* UBI erase count header
* UBI file system superblock node
* UEFI file system
* xz compressed data
* YAFFS filesystem, big endian
* YAFFS filesystem, little endian
* ZStandard compressed data
* Zip archive

## Where are the Firmware analysis Azure CLI/PowerShell docs?
You can find the documentation for our Azure CLI commands [here](/cli/azure/firmwareanalysis/firmware) and the documentation for our Azure PowerShell commands [here](/powershell/module/az.firmwareanalysis/?#firmwareanalysis).

You can also find the Quickstart for our Azure CLI [here](./quickstart-upload-firmware-using-azure-command-line-interface.md) and the Quickstart for our Azure PowerShell [here](./quickstart-upload-firmware-using-powershell.md). To run a Python script using the SDK to upload and analyze firmware images, visit [Quickstart: Upload firmware using Python](./quickstart-upload-firmware-using-python.md).
