---
title: Frequently asked questions about firmware analysis
description: Find answers to some of the common questions about firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: faq
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 03/05/2026
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

**Component** | **Component** | **Component** | **Component**
---|---|---|---
acpid       |   gtk         |   msmtp       |   redis       
apache      |   harfbuzz    |   mstpd       |   rp_pppoe    
avahi_daemon|   heimdal     |   ncurses     |   samba
axios		|	hostapd		|	neon		|	sqlite
backbonejs	|	inetutils_telnetd|	netatalk	|	ssmtp
bash		|	iptables	|	netkit_telnetd	|	strongswan
bftpd		|	jquery		|	netsnmp	    |		stunnel
bluetoothd	|	libcurl		|	nettools	|	sudo
busybox		|	libevent	|	nginx		|	tcpdump
bzip2		|	libexpat	|	nss		    |	uclibc
cairo		|	libgcrypt	|	openldap	|	underscorejs
codesys		|	libidn		|	openssh		|	usbutils
coreutils	|	libmicrohttpd	|	openssl	|		util_linux
dhcpd		|	libpcap		|	openvpn		|	vim
dnsmasq		|	libpng		|	openvswitch	|	vsftpd
dropbear	|	libsoup		|	p7zip		|	vuejs
e2fsprogs	|	libvorbis	|	pango		|	wget
element		|	lighttpd	|	pcre		|	wolfssl
extJS		|	lodash		|	pcre2		|	wpa_supplicant
ffmpeg		|	logrotate	|	perl		|	xinetd
fribidi		|	lua			|    php		|	      xl2tpd
gdbserver	|	matrixssl	|	polarssl	|	zebra
gdkpixbuf	|	mbedtls		|	pppd		|	zeptojs
glibc		|	mcproxy		|	proftpd		|	zlib
gmp			|   miniupnpd	|   python      |
gnutls		|	mit_kerberos|	radvd
gpg			|   mosquitto	|   readline



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




