---
title: Frequently asked questions about Defender for IoT Firmware analysis
description: Find answers to some of the common questions about Defender for IoT Firmware Analysis.
ms.topic: conceptual
ms.date: 01/10/2024
---

# Frequently asked questions about Defender for IoT Firmware Analysis

This article addresses frequent questions about Defender for IoT Firmware Analysis.

## What is FirmwareAnalysisRG?
**FirmwareAnalysisRG** is the resource group that stores your firmware images. We automatically create **FirmwareAnalysisRG** for you when you register your subscription to the resource provider. To learn more about the **FirmwareAnalysisRG** and how it fits into your resource hierarchy, refer to [Defender for IoT Firmware Analysis RBAC](defender-iot-firmware-analysis-rbac.md#understanding-the-representation-of-firmware-images-in-the-azure-resource-hierarchy).

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

