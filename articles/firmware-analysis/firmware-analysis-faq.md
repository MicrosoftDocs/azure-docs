---
title: Frequently asked questions about firmware analysis
description: Find answers to some of the common questions about firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: faq
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 10/28/2026
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
> If firmware analysis detects a component but can't determine the version of that component, it might report the version as `0.0.0`. The analysis doesn't report any CVEs for that component.


**Component** | **Component** | **Component** | **Component**
 ---|---|---|---
apache              | fribidi             | libfuse             | portmap
apparmor            | gdb                 | libgcrypt           | pppd
asterisk            | gdbserver           | libidn              | procps
atftp               | gdkpixbuf           | libidn2             | procps-ng
avahi-autoipd       | glibc               | libjpeg-turbo       | protobuf-c
avahi_daemon        | gmp                 | liblzma             | python
axios               | gnu cpio            | libmicrohttpd       | radvd
backbonejs          | gnu gettext runtime | libpcap             | readline
bash                | gnu inetutils       | libpng              | redis
bftpd               | gnutls              | libsoup             | rngd
binutils            | gpg                 | libvorbis           | rngtest
bird                | grep                | libxml2             | rp_pppoe
bluetoothd          | grub                | lighttpd            | samba
boa                 | grub2               | lodash              | setserial
bridge-utils        | gtk                 | miniupnpd           | sqlite
busybox             | gzip                | mit_kerberos        | ssmtp
bzip2               | harfbuzz            | mosquitto           | strace
cairo               | haserl              | msmtp               | strongswan
chrony              | hdparm              | mstpd               | stunnel
cifs-utils          | heimdal             | mtd-utils           | sudo
codesys             | hostapd             | nano                | tcpdump
conntrack-tools     | i2c-tools           | ncurses             | uclibc
coreutils           | igmpproxy           | neon                | underscorejs
cryptsetup          | iperf3              | netatalk            | usbutils
cups                | iproute2            | netkit_telnetd      | util_linux
davfs2              | ipset               | netsnmp             | vim
dhcpcd              | iptables            | nettools            | vsftpd
dhcpd               | iputils             | nginx               | vuejs
dmidecode           | isc dhclient        | nss                 | wget
dnsmasq             | jansson             | openldap            | wireless-tools
dpkg                | jq                  | openssh             | wolfssl
dropbear            | jquery              | openssl             | wpa_supplicant
e2fsprogs           | json-c              | openvpn             | xinetd
ebtables            | kbd                 | openvswitch         | xl2tpd
eeprog              | keepalived          | p7zip               | xz-utils
element             | libarchive          | pango               | zebra
ethtool             | libcap              | pcre                | zeptojs
exfat               | libcurl             | pcre2               | zip
extJS               | libdbus             | perl                | zipcloak
ffmpeg              | libevent            | php                 | zipnote
file                | libexpat            | polarssl            | zlib
freeradius          |                     |                     |



## Where are the firmware analysis Azure CLI and PowerShell docs?
Find the documentation for the Azure CLI commands [here](/cli/azure/firmwareanalysis/firmware) and the documentation for the Azure PowerShell commands [here](/powershell/module/az.firmwareanalysis/?#firmwareanalysis).
 
You can also find the quickstart for Azure CLI [here](./quickstart-upload-firmware-using-azure-command-line-interface.md) and the quickstart for Azure PowerShell [here](./quickstart-upload-firmware-using-powershell.md). To run a Python script that uses the SDK to upload and analyze firmware images, see [Quickstart: Upload firmware using Python](./quickstart-upload-firmware-using-python.md).


## Is UEFI (Unified Extensible Firmware Interface) firmware analysis supported?
Yes. The service supports UEFI firmware analysis with a mix of **Generally Available (GA)** and **Preview** capabilities.

### What is generally available for UEFI firmware analysis?

Firmware analysis provides **GA support** for detecting and analyzing cryptographic material embedded in UEFI firmware, including:
- Cryptographic certificates
- Cryptographic keys

These capabilities are stable and fully supported for UEFI firmware.

### What UEFI analysis capabilities are in preview?

The following UEFI analysis capabilities are currently in **Preview** and might have limited coverage:
- SBOM and weakness signals (limited OpenSSL detection and CVE association)
- Binary hardening attributes (detection of NX / DEP is supported)
- Extractor path enhancements

Interpret preview results as **security signals**, not guarantees of vulnerability or protection.

For detailed explanations of UEFI firmware analysis capabilities, limitations, and how to interpret results, see [Understanding UEFI firmware analysis capabilities and limitations](unified-extensible-firmware-interface-firmware-analysis.md).

## Why don't I see any results for unsafe function calls?

An empty result doesn't mean the firmware has no unsafe function calls. You might not see results when:

- The firmware image doesn't contain supported ELF user-space executables.
- The extracted executables use an unsupported processor architecture.
- A static or stripped binary doesn't retain enough information to identify function references.
- The extracted file is a Linux kernel module (`.ko`), which isn't included in this analysis.
- The firmware image was analyzed before unsafe function calls analysis became available.
- Extraction or analysis didn't complete successfully.

Upload an older firmware image again to receive current analysis. For supported architectures, binary requirements, and guidance on interpreting results, see [Understand unsafe function call data](understand-unsafe-function-calls.md).
