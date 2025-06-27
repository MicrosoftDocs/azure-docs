---
title: How to Encrypt Data in Transit for NFS shares
description: This article explains how you can encrypt data in transit (EiT) for NFS Azure file shares by using a TLS channel.
author: guptasonia
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/27/2025
ms.author: kendownie
ms.custom:
  - devx-track-azurepowershell
  - references_regions
  - build-2025
# Customer intent: As a network administrator, I want to securely encrypt data in transit for NFS Azure file shares using TLS, so that I can protect sensitive information from interception and ensure data confidentiality without complex network security or authentication setups.
---

# Encryption in transit for NFS Azure file shares
 
This article explains how you can encrypt data in transit for NFS Azure file shares. Azure Files NFS v4.1 volumes enhance network security by enabling secure TLS connections, protecting data in transit from interception, including MITM attacks.

## Overview

Using [Stunnel](https://www.stunnel.org/), an open-source TLS wrapper, Azure Files encrypts the TCP stream between the NFS client and Azure Files with strong encryption using AES-GCM, without needing Kerberos. This ensures data confidentiality while eliminating the need for complex setups or external authentication systems like Active Directory.

The [AZNFS](https://github.com/Azure/AZNFS-mount) utility package simplifies encrypted mounts by installing and setting up Stunnel on the client. Available on packages.microsoft.com, AZNFS creates a local secure endpoint that transparently forwards NFS client requests over an encrypted connection. The key architectural components include:

- **AZNFS Mount Helper**: A client utility package that abstracts the complexity of establishing secure tunnels for NFSv4.1 traffic.

- **Stunnel Process**: Per-storage-account client process that listens for NFS client traffic on a local port and forwards it securely over TLS to the Azure Files NFS server.

- **AZNFS watchdog**: The AZNFS package runs a background job that ensures stunnel processes are running, automatically restarts terminated tunnels, and cleans up unused processes after all associated NFS mounts are unmounted.

> [!IMPORTANT]
>
> AZNFS supported Linux distributions are:
>
> - Ubuntu (18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS)
> - Centos7, Centos8
> - RedHat7, RedHat8, RedHat9
> - Rocky8, Rocky9
> - SUSE (SLES 15)
> - Oracle Linux
> - Alma Linux

## Supported regions

EiT is now Generally Available (GA) in all regions that support Azure Premium Files except China North3, New Zealand North, West Europe, US East2, US Central, US South and Korea Central. These remaining regions are currently running preview. You must register your subscription per the instructions below to use EiT in the preview regions.

### Register for preview (not needed for GA regions)
 
To enable encryption in transit for your storage accounts and NFS shares in the preview regions (China North3, New Zealand North, West Europe, US East2, US Central, US South, and Korea Central), you must register for the preview. **No registration is needed in the GA regions.**

### [Portal](#tab/azure-portal)

Register through the Azure portal by searching for "Encryption in transit for Azure NFS file shares" under Preview Features.

:::image type="content" source="./media/encryption-in-transit-nfs-shares/portal-registration-encryption-in-transit.png" alt-text="Diagram showing the Azure portal screen to test if EiT is applied." lightbox="./media/encryption-in-transit-nfs-shares/portal-registration-encryption-in-transit.png":::

For more information, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal).

### [PowerShell](#tab/azure-powershell)

Register through PowerShell using [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature):

```PowerShell
Register-AzProviderFeature -FeatureName "AllowEncryptionInTransitNFS4" -ProviderNamespace "Microsoft.Storage"
```

### [Azure CLI](#tab/azure-cli)
 
Register through Azure CLI using [az feature register](/cli/azure/feature):

```bash
az feature register --name AllowEncryptionInTransitNFS4 --namespace Microsoft.Storage
```
   
---


## Enforce encryption in transit
 
By enabling the **Secure transfer required** setting on the storage account, you can ensure that all the mounts to the NFS volumes in the storage account are encrypted. EiT can be enabled on both new and existing storage accounts and NFS Azure file shares. There is no additional cost for enabling EiT.

:::image type="content" source="./media/encryption-in-transit-nfs-shares/storage-account-settings.png" alt-text="Screenshot showing how to enable Secure transfer on a storage account." lightbox="./media/encryption-in-transit-nfs-shares/storage-account-settings.png":::

However, for users who prefer to maintain flexibility between TLS and non-TLS connections on the same storage account, the **Secure transfer** setting must remain OFF.

## Encrypt data in transit for NFS shares

You can encrypt data in transit for NFS Azure file shares by using the Azure portal or Azure CLI.

### Encrypt data in transit for NFS shares using the Azure portal

Azure portal offers a step-by-step, ready-to-use installation script tailored to your selected Linux distribution for installing the AZNFS mount helper package. Once installed, you can use the provided AZNFS mount script to securely mount the NFS share, establishing an encrypted transmission channel between the client and the server.

:::image type="content" source="./media/encryption-in-transit-nfs-shares/mount-using-encryption-in-transit.png" alt-text="Screenshot showing AZNFS mount instructions in the Azure portal." lightbox="./media/encryption-in-transit-nfs-shares/mount-using-encryption-in-transit.png":::

Users who prefer to maintain flexibility in having TLS and non-TLS connections on the same storage account should ensure that the *Secure transfer required* setting remains disabled.

### Encrypt data in transit for NFS shares using Azure CLI

Follow these steps to encrypt data in transit:

1. Ensure the required AZNFS mount helper package is installed on the client.
1. Mount the NFS file share with TLS encryption.
1. Verify that the encryption of data succeeded.

### Step 1: Check AZNFS mount helper package installation
 
To check if the AZNFS mount helper package is installed on your client, run the following command:

```bash
systemctl is-active --quiet aznfswatchdog && echo -e "\nAZNFS mounthelper is installed! \n"
```

If the package is installed, you'll see the message `AZNFS mounthelper is installed!`. If it isn't installed, you'll need to use the appropriate command to install the AZNFS mount helper package on your client.
 
### [Ubuntu/Debian](#tab/Ubuntu)
```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "$ID/$VERSION_ID")/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install aznfs
```
 
### [RHEL/CentOS](#tab/RHEL) 
```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "$ID/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo yum update
sudo yum install aznfs
```
 
### [SUSE](#tab/SUSE) 
```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "$ID/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo zypper refresh
sudo zypper install aznfs
```
 
### [Alma Linux](#tab/Alma) 
```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "alma/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo yum update
sudo yum install -y aznfs
```
 
### [Oracle Linux](#tab/Oracle) 
```bash
curl -sSL -O https://packages.microsoft.com/config/$(source /etc/os-release && echo "rhel/${VERSION_ID%%.*}")/packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm
rm packages-microsoft-prod.rpm
sudo yum update
sudo yum install -y aznfs
```
---


### Step 2: Mount the NFS file share

To mount the NFS file share **with TLS encryption**:

1. Create a directory on your client.

```bash
sudo mkdir -p /mount/<storage-account-name>/<share-name>
```

2. Mount the NFS share by using the following cmdlet. Replace `<storage-account-name>` with the name of your storage account and replace `<share-name>` with the name of your file share.

```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4
```

To mount the NFS share **without TLS encryption**:

```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls
```

To have the share **mounted automatically on reboot**, create an entry in the `/etc/fstab` file by adding the following line:

```
<storage-account-name>.file.core.windows.net:/<storage-account-name>/<container-name> /nfsdata aznfs defaults,sec=sys,vers=4.1,nolock,proto=tcp,nofail,_netdev   0 2 
```

> [!NOTE]
> Before running the mount command, ensure that the environment variable AZURE_ENDPOINT_OVERRIDE is set. This is required when mounting file shares in non-public Azure cloud regions or when using custom DNS configurations.
> For example, for Azure China Cloud: `export AZURE_ENDPOINT_OVERRIDE="chinacloudapi.cn"`
 
### Step 3:  Verify that the in-transit data encryption succeeded
 
Run the command `df -Th`.

:::image type="content" source="./media/encryption-in-transit-nfs-shares/powershell-capture.png" alt-text="Diagram showing the Powershell screen to test if EiT is applied." lightbox="./media/encryption-in-transit-nfs-shares/powershell-capture.png":::
 
It indicates that the client is connected through the local port 127.0.0.1, not an external network. The **stunnel** process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client. Stunnel then **intercepts** this traffic and securely forwards it over **TLS** to the Azure Files NFS server on Azure.
 
To check if traffic to the NFS server is encrypted, use the `tcpdump` command to capture packets on port 2049.

```bash
sudo tcpdump -i any port 2049 -w nfs_traffic.pcap
```

When you open the capture in Wireshark, the payload will appear as "Application Data" instead of readable text.
 
:::image type="content" source="./media/encryption-in-transit-nfs-shares/wireshark-capture.png" alt-text="Diagram showing the Wireshark screen to test if EiT is applied." lightbox="./media/encryption-in-transit-nfs-shares/wireshark-capture.png":::

> [!NOTE]
>  All traffic from a virtual machine to the same server endpoint uses a single connection. The AZNFS mount helper ensures that you can't mix TLS and non-TLS configurations when mounting shares to that server. This rule applies to shares from the same storage account and different storage accounts that resolve to the same IP address.

## Troubleshooting
 
A **non-TLS (notls) mount** operation might fail if a previous **TLS-encrypted** mount to the same server was terminated before completing successfully. Although the *aznfswatchdog* service automatically cleans up stale entries after a timeout, attempting a new non-TLS mount before cleanup completes can fail.

To resolve this issue, remount the share using the clean option, which immediately clears any stale entries:

```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls,clean
```

If a VM is **custom domain joined**, use custom DNS FQDN or short names for file share in `/etc/fstab` as defined in the DNS. To verify the hostname resolution, check using `nslookup <hostname>` and `getent host <hostname>` commands. Before running the mount command, ensure that the environment variable `AZURE_ENDPOINT_OVERRIDE` is set.

If mounting issues continue, check the log files for more troubleshooting details:

- **Mount Helper and Watchdog Logs**: `/opt/microsoft/aznfs/data/aznfs.log`
- **Stunnel Logs**: `/etc/stunnel/microsoft/aznfs/nfsv4_fileShare/logs`

## See also
 
- [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption)
