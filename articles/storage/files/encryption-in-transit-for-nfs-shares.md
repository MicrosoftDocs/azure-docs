---
title: Encryption in Transit for NFS shares - Public Preview
title: How to encrypt data in transit for NFS shares (preview)
description: This article explains how data is encrypted while in transit for NFS shares.
author: guptasonia
ms.service: azure-file-storage
ms.topic: conceptual
ms.topic: how-to
ms.date: 05/07/2025
ms.author: kendownie
ms.custom: devx-track-azurepowershell
---

# Encryption in Transit for NFS shares- Public Preview
As a network administrator, I want to securely connect to Azure Files NFS v4.1 volumes using a TLS channel so that I can protect data in transit from interception, including MITM attacks. By using Stunnel for strong encryption like AES-GCM and the AZNFS utility for simplified setup, I can ensure data confidentiality without needing complex setups or external authentication systems.

## Overview
This article explains how you can encrypt data in transit for NFS Azure file shares (preview).

Azure Files NFS v4.1 volumes enhance the security of your network traffic by enabling you to connect to your Azure Files NFS volumes using a secure TLS channel. Encryption in transit protects data traveling over the network from potential interception, including man-in-the-middle (MITM) attacks.
> [!IMPORTANT]
> - Encryption in transit for NFS Azure file shares is currently in **preview**. 
> - See the [Preview Terms Of Use | Microsoft Azure](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
Azure Files uses [Stunnel](https://www.stunnel.org/) , a widely used, open-source tool as a TLS wrapper to encrypt the TCP stream between the NFS client and Azure Files NFS. It secures NFS traffic with strong encryption like AES-GCM, without needing Kerberos. It ensures data confidentiality and protection from interception, eliminating the need for complex setups or external authentication systems like Active Directory. 
# How encryption in transit for NFS shares works

Encrypted mount can be done using the AZNFS utility which simplifies the setup even further. AZNFS is available on [GitHub](https://github.com/Azure/AZNFS-mount) with supported distribution packages available for download at packages.microsoft.com. This utility installs and sets up stunnel on the client. AZNFS helps establish a dedicated stunnel process per storage account, creating a local secure endpoint that transparently forwards NFS client requests over an encrypted connection. 
Azure Files NFS v4.1 volumes enhance network security by enabling secure TLS connections, protecting data in transit from interception, including MITM attacks.
Using [Stunnel](https://www.stunnel.org/), an open-source TLS wrapper, Azure Files encrypts the TCP stream between the NFS client and Azure Files with strong encryption using AES-GCM, without needing Kerberos. This ensures data confidentiality while eliminating the need for complex setups or external authentication systems like Active Directory. 

Key architectural components include:
The AZNFS utility simplifies encrypted mounts by installing and setting up Stunnel on the client. Available on [GitHub](https://github.com/Azure/AZNFS-mount), AZNFS creates a local secure endpoint that transparently forwards NFS client requests over an encrypted connection. The key architectural components include:

**AZNFS Mount Helper**: A client utility package that abstracts the complexity of establishing secure tunnels for NFSv4.1 traffic.

**Stunnel Process**: Per-storage-account client process that listens for NFS client traffic on a local port and forwards it securely over TLS to the Azure Files NFS server.

**AZNFS watchdog**: The AZNFS package runs a background job that ensures stunnel processes are running, automatically restarts terminated tunnels, and cleans up unused processes after all associated NFS mounts are unmounted.
- **AZNFS Mount Helper**: A client utility package that abstracts the complexity of establishing secure tunnels for NFSv4.1 traffic.
- **Stunnel Process**: Per-storage-account client process that listens for NFS client traffic on a local port and forwards it securely over TLS to the Azure Files NFS server.
- **AZNFS watchdog**: The AZNFS package runs a background job that ensures stunnel processes are running, automatically restarts terminated tunnels, and cleans up unused processes after all associated NFS mounts are unmounted.

## Supported regions
| *Supported regions* | *Supported regions* | *Supported regions* | *Supported regions* |
|:-------------------|:-------------------|:-------------------|:-------------------|
| - South Africa North <br> - South Africa West <br> - Australia Central <br> - Australia Central 2 <br> - Australia East <br> - Australia Southeast <br> - Central India <br> - East Asia <br> - Indonesia Central <br> - Jio India Central <br> - Jio India West <br> - Korea South <br> - Malaysia West <br> | - South India <br> - Southeast Asia <br> - Taiwan North <br> - Taiwan Northwest <br> - West India <br> - Belgium Central <br> - France Central <br> - France South <br> - Germany North <br> - Germany West Central <br> - Italy North <br> - North Europe <br> - Norway East <br> | - Norway West <br> - Poland Central <br> - Spain Central <br> - Sweden Central <br> - Switzerland West <br> - Switzerland North <br> - UK South <br> - UK West <br> - Qatar Central <br> - UAE Central <br> - UAE North <br> Canada East <br> Canada Central <br> | - Mexico Central <br> - North Central US <br> - South Central US <br> - South Central US 2 <br> - Southeast US <br> - Southeast US 3 <br> - West US <br> - West US 2 <br> - West US 3 <br> - West Central US <br> - Brazil South <br> - Brazil Southeast <br> - Chile Central <br> |

South Africa North, South Africa West, Australia Central, Australia Central 2,  Australia East, Australia Southeast, Central India, East Asia, Indonesia Central, Jio India Central, Jio India West, Korea South, Malaysia West, South India, Southeast Asia, Taiwan North, Taiwan Northwest, West India, Belgium Central, France Central, France South, Germany North, Germany West Central, Italy North, North Europe, Norway East, Norway West, Poland Central, Spain Central, Sweden Central, Switzerland West, Switzerland North, UK South, UK West, Qatar Central, UAE Central, UAE North, Canada East, Canada Central, Mexico Central, North Central US, South Central US, South Central US 2, Southeast US, Southeast US 3, West US, West US 2, West US 3, West Central US, Brazil South, Brazil Southeast, Chile Central. 

Enforce Encryption in Transit
## Enforce encryption in transit

By enabling 'Secure transfer required' setting on the storage account, you are able to ensure that "all" the mounts to the NFS volumes in the storage account are encrypted. 

:::image type="content" source="media/image1.png" alt-text="" border="true":::
:::image type="content" source="media/powershell-capture.png" alt-text="Diagram showing the Powershell screen to test if EiT is applied." lightbox="media/powershell-capture.png":::

However, for users who prefer to maintain flexibility between TLS and non-TLS connections on the same storage account, the 'Secure transfer' setting must remain OFF.

## Getting started: How to register for public preview
## Register for preview 

To enable Encryption in transit for your subscription, follow the guidance outlined here.
To enable encryption in transit for Azure NFS file shares, the following permissions are required for your Azure subscription:

- To register for the feature through PowerShell, use the [Get-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet:
- Register through PowerShell using [Get-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature)

$ Register-AzProviderFeature -FeatureName "AllowEncryptionInTransitNFS4" -ProviderNamespace "Microsoft.Storage"
   `$ Register-AzProviderFeature -FeatureName "AllowEncryptionInTransitNFS4" -ProviderNamespace "Microsoft.Storage"`

- To register through Azure CLI, use [az feature register](/cli/azure/feature) command:
- Register through Azure CLI using [az feature register](/cli/azure/feature)

$ az feature register --name AllowEncryptionInTransitNFS4 --namespace Microsoft. Storage
   `$ az feature register --name AllowEncryptionInTransitNFS4 --namespace Microsoft. Storage`

## Installation Instructions
## How to encrypt data in transit for NFS shares (preview)

1. Determine whether the AZNFS Mount Helper package is installed on your client.
Follow these steps to encrypt data in transit:

systemctl is-active --quiet aznfswatchdog && echo -e "\nAZNFS mounthelper is installed! \n" 
1. Ensure the required AZNFS Mount Helper package is installed on the client.
2. Mount the NFS Azure file share with TLS encryption.
3. Verify that the encryption of data succeeded.

### Step 1: Check AZNFS Mount Helper package installation

If the package is installed, then the message `AZNFS mounthelper is installed!` appears.

1. If the AZNFS Mount Helper package is not yet installed, then use the following command to install it.

**Debian/Ubuntu:** 
To check if the AZNFS Mount Helper package is installed on your client, run the following command:
```bash
systemctl is-active --quiet aznfswatchdog && echo -e "\nAZNFS mounthelper is installed! \n"
```
If the package is installed, you'll see the message `AZNFS mounthelper is installed!`. If it isn't installed, you'll need to use the appropriate command to install the AZNFS mount helper program and the *aznfswatchdog* service.

### [Ubuntu/Debian](#tab/Ubuntu)
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/$VERSION_ID")/packages-microsoft-prod.deb 

sudo dpkg -i packages-microsoft-prod.deb 

rm packages-microsoft-prod.deb 

sudo apt-get update 

sudo apt-get install aznfs
```

**RHEL/CentOS:** 

### [RHEL/CentOS](#tab/RHEL) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 

sudo yum install aznfs
```

**SUSE:** 

### [SUSE](#tab/SUSE) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo zypper refresh 

sudo zypper install aznfs
```

**Alma Linux:** 

### [Alma Linux](#tab/Alma) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "alma/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 

sdo yum update 
sudo yum install -y aznfs 
```

**Oracle Linux:** 

### [Oracle Linux](#tab/Oracle) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "rhel/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 

sudo rpm -i packages-microsoft-prod.rpm 

rm packages-microsoft-prod.rpm 

sudo yum update 
sudo yum install -y aznfs
``` 

sudo yum install -y aznfs 

It installs the AZNFS mount helper program and the _aznfswatchdog_ service. 

**Note:** 
> [!IMPORTANT]
> AZNFS supported Linux distributions are:
>
> - Ubuntu (18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS) 
> - Centos7, Centos8 
> - RedHat7, RedHat8, RedHat9 
> - Rocky8, Rocky9 
> - SUSE (SLES 15) 
> - Oracle Linux
> - Alma Linux
AZNFS is supported on following Linux distributions:
### Step 2a: Mount the NFS Azure file share with TLS encryption

- Ubuntu (18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS) 
- Centos7, Centos8 
- RedHat7, RedHat8, RedHat9 
- Rocky8, Rocky9 
- SUSE (SLES 15) 
- Oracle Linux
- Alma Linux

## Usage Instructions

To mount Azure Files NFSv4 share with TLS encryption:
To mount an NFS Azure file share **with TLS encryption**:

1. Create a directory on your client.

   sudo mkdir -p /mount/<account name>/<share name>

2. Mount the NFS share by using the following cmdlet. Replace the \<storage-account-name> placeholder with the name of your storage account and replace \<container-name> with the name of your container.

 sudo mount -t aznfs <account name>.file.core.windows.net:/<account name>/<share name> /mount/<account name>/<share name> -o vers=4,minorversion=1,sec=sys,nconnect=4

To mount the NFS share **without TLS encryption**, use:

sudo mount -t aznfs <account name>.file.core.windows.net:/<account name>/<share name> /mount/<account name>/<share name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls

Remember to set environment variable "AZURE_ENDPOINT_OVERRIDE" for mounting non-Public Azure Cloud regions and when using Custom DNS before running the mount command. For example, for Azure China Cloud:

```bash
sudo mkdir -p /mount/<storage-account-name>/<share-name>
```
2. Mount the NFS share by using the following cmdlet. Replace the `<storage-account-name>` placeholder with the name of your storage account and replace `<share-name>` with the name of your file share.
```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4
```
### Step 2b: Mount NFS Azure file share without TLS encryption

To mount the NFS share **without TLS encryption**:
```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls
```
Before running the mount command, you must set the environment variable AZURE_ENDPOINT_OVERRIDE for mounting non-Public Azure Cloud regions and when using Custom DNS. For example, for Azure China Cloud:
```bash
export AZURE_ENDPOINT_OVERRIDE="chinacloudapi.cn
```
***Note:*** _All traffic from a Virtual Machine to the same server endpoint shares a single connection. The AZNFS mount helper prevents mounting shares with a mix of TLS and non-TLS configurations to that server. This restriction applies both to shares from the same storage account and to shares from different storage accounts that resolve to the same IP address._
> [!NOTE]
>  All traffic from a virtual machine to the same server endpoint uses a single connection. The AZNFS mount helper ensures that you can't mix TLS and non-TLS configurations when mounting shares to that server. This rule applies to shares from the same storage account and different storage accounts that resolve to the same IP address.
## How to test if Encryption in transit is working for your File share?
### Step 3:  Verify that the data encryption succeeded
1. Run the cmdlet: df -Th
- Run the command `df -Th`.
   ![Screenshot of Powershell screen to test if EiT is applied](media/powershell-capture.png)
:::image type="content" source="media/powershell-capture.png" alt-text="Diagram showing the Powershell screen to test if EiT is applied." lightbox="media/powershell-capture.png":::
It shows that the client is connected through local port 127.0.0.1 and not any external network. The **stunnel** process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client. Stunnel **intercepts** this traffic and securely forwards it over **TLS** to the actual Azure Files NFS server on Azure.

1. To verify whether traffic to NFS server is encrypted, use the tcpdump command to capture packets on port 2049. 
It indicates that the client is connected through the local port 127.0.0.1, not an external network. The **stunnel** process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client. Stunnel then **intercepts** this traffic and securely forwards it over **TLS** to the Azure Files NFS server on Azure.
- To check if traffic to the NFS server is encrypted, use the `tcpdump` command to capture packets on port 2049.
   
```bash
sudo tcpdump -i any port 2049 -w nfs_traffic.pcap
```
When you open the capture in Wireshark, the payload will appear as "Application Data" instead of readable text. 
Open the capture in Wireshark, the payload appears as "Application Data" rather than readable text. 

![Screenshot of Wireshark screen to test if EiT is applied](media/wireshark-capture.png)
:::image type="content" source="media/wireshark-capture.png" alt-text="Diagram showing the Wireshark screen to test if EiT is applied." lightbox="media/wireshark-capture.png":::
## Troubleshooting
A **non-TLS (notls) mount** operation may fail if a prior **TLS-encrypted** mount to the same server was terminated before completing successfully.<br>Although the aznfswatchdog service automatically cleans up stale entries after a time out, attempting a new non-TLS mount before the cleanup finishes can result in a failure.

To resolve this problem, remount the share using the clean option, which immediately clears any stale entries:

sudo mount -t aznfs <account name>.file.core.windows.net:/<account name>/<share name> /mount/<account name>/<share name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls,clean

If mounting issues persist, reviewing log files can provide additional troubleshooting information:
A **non-TLS (notls) mount** operation may fail if a previous **TLS-encrypted** mount to the same server was terminated before completing successfully. Although the *aznfswatchdog* service automatically cleans up stale entries after a timeout, attempting a new non-TLS mount before cleanup completes can fail.
**Mount Helper and Watchdog Logs**: /opt/microsoft/aznfs/data/aznfs.log
To resolve this issue, remount the share using the clean option, which immediately clears any stale entries:
```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls,clean
```
If mounting issues continue, check the log files for more troubleshooting details:
**Stunnel Logs**: /etc/stunnel/microsoft/aznfs/nfsv4_fileShare/logs
- **Mount Helper and Watchdog Logs**: `/opt/microsoft/aznfs/data/aznfs.log`
- **Stunnel Logs**: `/etc/stunnel/microsoft/aznfs/nfsv4_fileShare/logs`
## See also
