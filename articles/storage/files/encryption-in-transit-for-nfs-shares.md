---
title: Encryption in Transit for NFS shares - Public Preview
description: This article explains how data is encrypted while in transit for NFS shares.
author: guptasonia
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 04/29/2025
ms.author: kendownie
ms.custom: devx-track-azurepowershell
---

# Encryption in Transit for NFS shares- Public Preview

## Overview

Azure Files NFS v4.1 volumes enhance the security of your network traffic by enabling you to connect to your Azure Files NFS volumes using a secure TLS channel. Encryption in transit protects data traveling over the network from potential interception, including man-in-the-middle (MITM) attacks.

Azure Files uses [Stunnel](https://www.stunnel.org/) , a widely used, open-source tool as a TLS wrapper to encrypt the TCP stream between the NFS client and Azure Files NFS. It secures NFS traffic with strong encryption like AES-GCM, without needing Kerberos. It ensures data confidentiality and protection from interception, eliminating the need for complex setups or external authentication systems like Active Directory. 

Encrypted mount can be made using azNFS utility which simplifies setup even further. azNFS is available in [github](https://github.com/Azure/AZNFS-mount) and supported distro packages are downloadable from packages.microsoft.com. This utility installs and sets up stunnel on the client. In a standard NFSv4.1 deployment, traffic is transmitted in clear text unless an additional transport security mechanism is layered on top. To enable encryption without requiring fundamental changes to the NFS protocol itself, Azure Files offers a **client-side solution** using the **AZNFS Mount Helper**. azNFS, helps establish a dedicated stunnel process per storage account, creating a local secure endpoint that transparently forwards NFS client requests over an encrypted connection. TLS 1.2 and TLS 1.3 are both supported and can be specified as a mount parameter. TLS 1.3 is the latest version of the TLS protocol and is widely regarded as faster and more secure than its predecessor, TLS 1.2.

Key architectural components include:

**AZNFS Mount Helper**: A client utility package that abstracts the complexity of establishing secure tunnels for NFSv4.1 traffic.

**Stunnel Process**: Per-storage-account client process that listens for NFS client traffic on a local port and forwards it securely over TLS to the Azure Files NFS server.

**AZNFS watchdog**: The AZNFS package runs a background job that ensures stunnel processes are running, automatically restarts terminated tunnels, and cleans up unused processes after all associated NFS mounts are unmounted.

## Supported Linux Distributions

Ubuntu (18.04 LTS, 20.04 LTS, 22.04 LTS) 

Centos7, Centos8 

RedHat7, RedHat8, RedHat9 

Rocky8, Rocky9 

SUSE (SLES 15) 

## Supported regions

South Africa North, South Africa West, Australia Central, Australia Central 2,  Australia East, Australia Southeast, Central India, East Asia, Indonesia Central, Jio India Central, Jio India West, Korea South, Malaysia West, South India, Southeast Asia, Taiwan North, Taiwan Northwest, West India, Belgium Central, France Central, France South, Germany North, Germany West Central, Italy North, North Europe, Norway East, Norway West, Poland Central, Spain Central, Sweden Central, Switzerland West, Switzerland North, UK South, UK West, Qatar Central, UAE Central, UAE North, Canada East, Canada Central, Mexico Central, North Central US, South Central US, South Central US 2, Southeast US, Southeast US 3, West US, West US 2, West US 3, West Central US, Brazil South, Brazil Southeast, Chile Central. 

Enforce Encryption in Transit

By enabling 'Secure transfer required' setting on the storage account, you will be able to ensure that "all" the mounts to the NFS volumes in the storage account ae encrypted. 

:::image type="content" source="media/storage-account-settings.png" alt-text="" border="true":::

However, for users who prefer to maintain flexibility between TLS and non-TLS connections on the same storage account, the 'Secure transfer' setting must remain OFF.

## Getting started: How to register for public preview

<< Sepideh to add the instructions>>

## Installation Instructions

1. To install the AZNFS Mount Helper package, follow these steps based on your Linux distribution:

   Note: You need to have root access to install the package on your client machine.

**Debian/Ubuntu:** 

curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/$VERSION_ID")/packages-microsoft-prod.deb 

sudo dpkg -i packages-microsoft-prod.deb 

rm packages-microsoft-prod.deb 

sudo apt-get update 

sudo apt-get install aznfs=0.3.15 

**RHEL/CentOS:** 

curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 

sudo yum install aznfs-0.3.15 

**SUSE:** 

curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo zypper refresh 

sudo zypper install aznfs=0.3.15 

**Alma Linux:** 

curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "alma/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 

sudo yum install -y aznfs 

**Oracle Linux:** 

curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "rhel/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 

sudo yum install -y aznfs 

It will install the AZNFS mount helper program and the _aznfswatchdog_ service. 

1. To confirm that the AZNFS Mount Helper package is installed on your client, run: 

systemctl is-active --quiet aznfswatchdog && echo -e "\nAZNFS mounthelper is installed! \n" 

If the package is installed, the message "AZNFS mount helper is installed!" will appear.

## Usage Instructions

To mount Azure Files NFSv4 share with TLS encryption, use:

sudo mkdir -p /mount/<account name>/<share name>

sudo mount -t aznfs -o vers=4.1 \<account-name>.file.core.windows.net:/\<account-name>/\<container-name> /mountpoint 

To mount without TLS encryption, use:

sudo mkdir -p /mount/<account name>/<share name>

sudo mount -t aznfs -o vers=4.1,notls \<account-name>.file.core.windows.net:/\<account-name>/\<container-name> /mountpoint 

***Note: All traffic from a VM to the same server endpoint shares a single connection, the AZNFS mount helper prevents mounting shares with a mix of TLS and non-TLS configurations to that server. This restriction applies both to shares from the same storage account and to shares from different storage accounts that resolve to the same IP address.***

## Troubleshooting

A **non-TLS (notls) mount** operation may fail if a prior **TLS-encrypted** mount to the same server was terminated before completing successfully.<br>Although the aznfswatchdog service automatically cleans up stale entries after a timeout, attempting a new non-TLS mount before the cleanup finishes can result in a failure.

To resolve this issue, remount the share using the clean option, which immediately clears any stale entries:

sudo mount -t aznfs -o vers=4.1,notls,clean \<account-name>.file.core.windows.net:/\<account-name>/\<container-name>/mountpoint 

If mounting issues persist, reviewing log files can provide additional troubleshooting information:

**Mount Helper and Watchdog Logs**: /opt/microsoft/aznfs/data/aznfs.log

**Stunnel Logs**: /etc/stunnel/microsoft/aznfs/nfsv4_fileShare/logs

## How to test if Encryption in transit is working for your File share?

Run the cmdlet: df -Th 

- ![A screen shot of a computer  AI-generated content may be incorrect.](media/image2.png)

This shows that the client is connected through local port 127.0.0.1 and not any external network. The **stunnel** process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client. Stunnel **intercepts** this traffic and securely forwards it over **TLS** to the actual Azure Files NFS server on Azure.

<<Sepideh to add the steps to check encrypted packets through wireshark>>
