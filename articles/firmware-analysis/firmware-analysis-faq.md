---
title: Frequently asked questions about firmware analysis
description: Find answers to some of the common questions about firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: faq
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 05/26/2026
ms.service: azure
ms.subservice: azure-firmware-analysis
---

# Frequently asked questions about firmware analysis 
This article addresses frequent questions about firmware analysis.

[Firmware analysis](./overview-firmware-analysis.md) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.


## What types of firmware images does firmware analysis support?
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


## What SBOM components does firmware analysis detect?

> [!NOTE]
> If firmware analysis detects a component but is unable to determine the version of that component, it may report the version as `0.0.0`. No CVEs will be reported for that particular component.


**Component** | **Component** | **Component** | **Component**
 ---|---|---|---
 acpid           | gtk               | miniupnpd         | radvd
 apache          | harfbuzz          | mit_kerberos      | readline
 avahi_daemon    | heimdal           | mosquitto         | redis
 axios           | hostapd           | msmtp             | rp_pppoe
 backbonejs      | inetutils_telnetd | mstpd             | samba
 bash            | iperf3            | ncurses           | sqlite
 bftpd           | iproute2          | neon              | ssmtp
 bluetoothd      | iptables          | netatalk          | strongswan
 busybox         | jquery            | netkit_telnetd    | stunnel
 bzip2           | json-c            | netsnmp           | sudo
 cairo           | libcurl           | nettools          | tcpdump
 chrony          | libevent          | nginx             | uclibc
 codesys         | libexpat          | nss               | underscorejs
 coreutils       | libgcrypt         | openldap          | usbutils
 dhcpd           | libidn            | openssh           | util_linux
 dnsmasq         | libmicrohttpd     | openssl           | vim
 dropbear        | libpcap           | openvpn           | vsftpd
 e2fsprogs       | libpng            | openvswitch       | vuejs
 element         | libsoup           | p7zip             | wget
 extJS           | libvorbis         | pango             | wolfssl
 ffmpeg          | libxml2           | pcre              | wpa_supplicant
 fribidi         | lighttpd          | pcre2             | xinetd
 gdbserver       | lodash            | perl              | xl2tpd
 gdkpixbuf       | logrotate         | php               | zebra
 glibc           | lua               | polarssl          | zeptojs
 gmp             | matrixssl         | pppd              | zlib
 gnutls          | mbedtls           | proftpd           |
 gpg             | mcproxy           | python            |




## Where are the firmware analysis Azure CLI/PowerShell docs?
You can find the documentation for our Azure CLI commands [here](/cli/azure/firmwareanalysis/firmware) and the documentation for our Azure PowerShell commands [here](/powershell/module/az.firmwareanalysis/?#firmwareanalysis).
 
You can also find the Quickstart for our Azure CLI [here](./quickstart-upload-firmware-using-azure-command-line-interface.md) and the Quickstart for our Azure PowerShell [here](./quickstart-upload-firmware-using-powershell.md). To run a Python script using the SDK to upload and analyze firmware images, visit [Quickstart: Upload firmware using Python](./quickstart-upload-firmware-using-python.md).


## Is UEFI (Unified Extensible Firmware Interface) firmware analysis supported?
Yes. UEFI firmware analysis is supported with a mix of **Generally Available (GA)** and **Preview** capabilities.

### What is generally available for UEFI firmware analysis?

Firmware analysis provides **GA support** for detecting and analyzing cryptographic material embedded in UEFI firmware, including:
- Cryptographic certificates
- Cryptographic keys

These capabilities are considered stable and fully supported for UEFI firmware.

### What UEFI analysis capabilities are in preview?

The following UEFI analysis capabilities are currently provided in **Preview** and might have limited coverage:
- SBOM and weakness signals (limited OpenSSL detection and CVE association)
- Binary hardening attributes (detection of NX / DEP are supported)
- Extractor path enhancements

Preview results should be interpreted as **security signals**, not guarantees of vulnerability or protection.

For detailed explanations of UEFI firmware analysis capabilities, limitations, and how to interpret results, see [Understanding UEFI firmware analysis capabilities and limitations](unified-extensible-firmware-interface-firmware-analysis.md).




