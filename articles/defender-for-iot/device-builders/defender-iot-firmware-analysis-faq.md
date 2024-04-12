---
title: Frequently asked questions about Defender for IoT Firmware analysis
description: Find answers to some of the common questions about Defender for IoT Firmware Analysis. This article includes the file systems that are supported by Defender for IoT Firmware Analysis, and links to the Azure CLI and Azure PowerShell commands.
ms.topic: conceptual
ms.date: 01/10/2024
---

# Frequently asked questions about Defender for IoT Firmware Analysis
This article addresses frequent questions about Defender for IoT Firmware Analysis.

[Defender for IoT Firmware Analysis](/azure/defender-for-iot/device-builders/overview-firmware-analysis) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.

## What types of firmware images does Defender for IoT Firmware Analysis support?
Defender for IoT Firmware Analysis supports unencrypted images that contain file systems with embedded Linux operating systems. Defender for IoT Firmware Analysis supports the following file system formats:

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
* xz compressed data
* YAFFS filesystem, big endian
* YAFFS filesystem, little endian
* ZStandard compressed data
* Zip archive

## Where are the Defender for IoT Firmware Analysis Azure CLI/PowerShell docs?
You can find the documentation for our Azure CLI commands [here](/cli/azure/firmwareanalysis/firmware) and the documentation for our Azure PowerShell commands [here](/powershell/module/az.firmwareanalysis/?#firmwareanalysis).
