---
title: How to encrypt data in transit for NFS shares (preview)
description: This article explains how data is encrypted while in transit for NFS shares.
author: guptasonia
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/07/2025
ms.author: kendownie
ms.custom: devx-track-azurepowershell
#Customer intent: As a network administrator, I want to securely connect to Azure Files NFS v4.1 volumes using a TLS channel so that I can protect data in transit from interception. By using AZNFS mount helper package for simplified setup, I can ensure data confidentiality without needing complex setups or external authentication systems.

---

# How encryption in transit for NFS Azure file shares works (preview)




 
This article explains how you can encrypt data in transit for NFS Azure file shares (preview).

> [!IMPORTANT]
> - Encryption in transit for Azure file shares NFS v4.1 is currently in **preview**. 
> - See the [Preview Terms Of Use | Microsoft Azure](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Files NFS v4.1 volumes enhance network security by enabling secure TLS connections, protecting data in transit from interception, including MITM attacks.

Using [Stunnel](https://www.stunnel.org/), an open-source TLS wrapper, Azure Files encrypts the TCP stream between the NFS client and Azure Files with strong encryption using AES-GCM, without needing Kerberos. This ensures data confidentiality while eliminating the need for complex setups or external authentication systems like Active Directory.
 
The AZNFS utility package simplifies encrypted mounts by installing and setting up Stunnel on the client. Available on packages.microsoft.com, AZNFS creates a local secure endpoint that transparently forwards NFS client requests over an encrypted connection. The key architectural components include:
 
- **AZNFS Mount Helper**: A client utility package that abstracts the complexity of establishing secure tunnels for NFSv4.1 traffic.

- **Stunnel Process**: Per-storage-account client process that listens for NFS client traffic on a local port and forwards it securely over TLS to the Azure Files NFS server.

- **AZNFS watchdog**: The AZNFS package runs a background job that ensures stunnel processes are running, automatically restarts terminated tunnels, and cleans up unused processes after all associated NFS mounts are unmounted.

## Supported regions

All regions supported by Azure Premium Files now support encryption in transit, with the exception of Korea Central, West Europe, Japan West, China North3, Israel Central, and Austria East.


## Enforce encryption in transit
 
By enabling the **Secure transfer required** setting on the storage account, you can ensure that all the mounts to the NFS volumes in the storage account are encrypted.

 
:::image type="content" source="./media/eit-for-nfs-shares/storage-account-settings.png" alt-text="Diagram showing the Powershell screen to test if EiT is applied." lightbox="./media/eit-for-nfs-shares/storage-account-settings.png":::
 
However, for users who prefer to maintain flexibility between TLS and non-TLS connections on the same storage account, the 'Secure transfer' setting must remain OFF.
 
## Register for preview
 
To enable encryption in transit for your NFS shares, you must register for the preview feature.


### [Portal](#tab/azure-portal)

Azure Portal support for this feature isn't currently available. In the meantime, you can enroll in the preview using either Azure PowerShell or Azure CLI.



### [PowerShell](#tab/azure-powershell)

- Register through PowerShell using [Get-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature)

   `$ Register-AzProviderFeature -FeatureName "AllowEncryptionInTransitNFS4" -ProviderNamespace "Microsoft.Storage"`

### [Azure CLI](#tab/azure-cli)
 
- Register through Azure CLI using [az feature register](/cli/azure/feature)
 
   `$ az feature register --name AllowEncryptionInTransitNFS4 --namespace Microsoft.Storage`
---
 
## How to encrypt data in transit for NFS shares (preview)
 
Follow these steps to encrypt data in transit:
 
1. Ensure the required AZNFS mount helper package is installed on the client.
2. Mount the NFS file share with TLS encryption.
3. Verify that the encryption of data succeeded.
### Step 1: Check AZNFS mount helper package installation
 
To check if the AZNFS mount helper package is installed on your client, run the following command:
```bash
systemctl is-active --quiet aznfswatchdog && echo -e "\nAZNFS mounthelper is installed! \n"
```
If the package is installed, you'll see the message `AZNFS mounthelper is installed!`. If it isn't installed, you'll need to use the appropriate command to install the AZNFS mount helper package on your client.
 
### [Ubuntu/Debian](#tab/Ubuntu)
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/$VERSION_ID")/packages-microsoft-prod.deb 
sudo dpkg -i packages-microsoft-prod.deb 
rm packages-microsoft-prod.deb 
sudo apt-get update 
sudo apt-get install aznfs
```
 
### [RHEL/CentOS](#tab/RHEL) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 
sudo rpm -i packages-microsoft-prod.rpm 
rm packages-microsoft-prod.rpm 
sudo yum update 
sudo yum install aznfs
```
 
### [SUSE](#tab/SUSE) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "$ID/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 
sudo rpm -i packages-microsoft-prod.rpm 
rm packages-microsoft-prod.rpm 
sudo zypper refresh 
sudo zypper install aznfs
```
 
### [Alma Linux](#tab/Alma) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "alma/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 
sudo rpm -i packages-microsoft-prod.rpm 
rm packages-microsoft-prod.rpm 
sudo yum update 
sudo yum install -y aznfs 
```
 
### [Oracle Linux](#tab/Oracle) 
```bash
curl -sSL -O <https://packages.microsoft.com/config/$(source> /etc/os-release && echo "rhel/${VERSION_ID%%.\*}")/packages-microsoft-prod.rpm 
sudo rpm -i packages-microsoft-prod.rpm 
rm packages-microsoft-prod.rpm 
sudo yum update 
sudo yum install -y aznfs
```
---

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
> [!NOTE]
> Before running the mount command, ensure that the environment variable AZURE_ENDPOINT_OVERRIDE is set. This is required when mounting file shares in non-public Azure cloud regions or when using custom DNS configurations.
> For example, for Azure China Cloud: `export AZURE_ENDPOINT_OVERRIDE="chinacloudapi.cn"`



 
### Step 3:  Verify that the in-transit data encryption succeeded
 
Run the command `df -Th`.

 
:::image type="content" source="./media/eit-for-nfs-shares/powershell-capture.png" alt-text="Diagram showing the Powershell screen to test if EiT is applied." lightbox="./media/eit-for-nfs-shares/powershell-capture.png":::
 
It indicates that the client is connected through the local port 127.0.0.1, not an external network. The **stunnel** process listens on 127.0.0.1 (localhost) for incoming NFS traffic from the NFS client. Stunnel then **intercepts** this traffic and securely forwards it over **TLS** to the Azure Files NFS server on Azure.
 
To check if traffic to the NFS server is encrypted, use the `tcpdump` command to capture packets on port 2049.


```bash
sudo tcpdump -i any port 2049 -w nfs_traffic.pcap
```
When you open the capture in Wireshark, the payload will appear as "Application Data" instead of readable text.
 
:::image type="content" source="./media/eit-for-nfs-shares/wireshark-capture.png" alt-text="Diagram showing the Wireshark screen to test if EiT is applied." lightbox="./media/eit-for-nfs-shares/wireshark-capture.png":::

> [!NOTE]
>  All traffic from a virtual machine to the same server endpoint uses a single connection. The AZNFS mount helper ensures that you can't mix TLS and non-TLS configurations when mounting shares to that server. This rule applies to shares from the same storage account and different storage accounts that resolve to the same IP address.

## Troubleshooting
 
A **non-TLS (notls) mount** operation might fail if a previous **TLS-encrypted** mount to the same server was terminated before completing successfully. Although the *aznfswatchdog* service automatically cleans up stale entries after a timeout, attempting a new non-TLS mount before cleanup completes can fail.

 
To resolve this issue, remount the share using the clean option, which immediately clears any stale entries:
```bash
sudo mount -t aznfs <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mount/<storage-account-name>/<share-name> -o vers=4,minorversion=1,sec=sys,nconnect=4,notls,clean
```
If mounting issues continue, check the log files for more troubleshooting details:
 
- **Mount Helper and Watchdog Logs**: `/opt/microsoft/aznfs/data/aznfs.log`
- **Stunnel Logs**: `/etc/stunnel/microsoft/aznfs/nfsv4_fileShare/logs`
 
## See also
 
- [Azure Storage encryption for data at rest | Microsoft Learn](/azure/storage/common/storage-service-encryption)
