---
title: Azure IoT Edge for Linux on Windows security
description: Overview of the Azure IoT Edge for Linux on Windows security framework and the different security premises that are enabled by default or optional. 
author: PatAltimore
ms.author: patricka
ms.date: 06/06/2025
ms.topic: concept-article
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# IoT Edge for Linux on Windows security

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge for Linux on Windows uses all the security features of a Windows client or server host and makes sure all extra components follow the same security principles. This article explains the different security principles that are enabled by default, and some optional principles you can enable.

## Virtual machine security

The IoT Edge for Linux (EFLOW) curated virtual machine is based on [Microsoft CBL-Mariner](https://github.com/microsoft/CBL-Mariner). CBL-Mariner is an internal Linux distribution for Microsoft's cloud infrastructure, edge products, and services. CBL-Mariner provides a consistent platform for these devices and services, and it helps Microsoft stay current on Linux updates. For more information, see [CBL-Mariner security](https://github.com/microsoft/CBL-Mariner/blob/1.0/SECURITY.md). 

The EFLOW virtual machine uses a four-point comprehensive security platform:
1. Servicing updates
1. Read-only root filesystem
1. Firewall lockdown
1. DM-Verity

### Servicing updates
When security vulnerabilities arise, CBL-Mariner provides the latest security patches and fixes through EFLOW monthly updates. The virtual machine doesn't have a package manager, so you can't manually download or install RPM packages. EFLOW installs all updates to the virtual machine using the A/B update mechanism. For more information on EFLOW updates, see [Update IoT Edge for Linux on Windows](./iot-edge-for-linux-on-windows-updates.md).

### Read-only root filesystem
The EFLOW virtual machine has two main partitions: *rootfs* and *data*. The rootFS-A or rootFS-B partitions are interchangeable, and one is mounted as a read-only filesystem at `/`, so you can't change files in this partition. The *data* partition, mounted under `/var`, is readable and writable, so you can change its content. The update process doesn't change the data stored in this partition, so it isn't modified across updates.

Because you might need write access to `/etc`, `/home`, `/root`, and `/var` for specific use cases, EFLOW overlays these directories onto the data partition at `/var/.eflow/overlays` to provide write access. This setup lets you write to these directories. For more information about overlays, see [*overlayfs*](https://docs.kernel.org/filesystems/overlayfs.html).

[![EFLOW CR partition layout](./media/iot-edge-for-linux-on-windows-security/eflow-cr-partition-layout.png)](./media/iot-edge-for-linux-on-windows-security/eflow-cr-partition-layout.png#lightbox)

| Partition | Size | Description | 
| --------- |---------- |------------ |
| BootEFIA | 8 MB | Firmware partition A for future GRUBless boot |
| BootA | 192 MB | Contains the bootloader for A partition |
| RootFS A | 4 GB | One of two active/passive partitions holding the root file system |
| BootEFIB | 8 MB | Firmware partition B for future GRUBless boot |
| BootB | 192 MB | Contains the bootloader for B partition |
| RootFS B | 4 GB | One of two active/passive partitions holding the root file system |
| Log | 1 GB or 6 GB | Logs specific partition mounted under /logs |
| Data | 2 GB to 2 TB | Stateful partition for storing persistent data across updates. Expandable according to the deployment configuration. |

>[!NOTE]
>The partition layout represents the logical disk size and doesn't indicate the physical space the virtual machine uses on the host OS disk.

### Firewall

By default, the EFLOW virtual machine uses the [*iptables*](https://git.netfilter.org/) utility for firewall configurations. *Iptables* sets up, maintains, and inspects the tables of IP packet filter rules in the Linux kernel. The default implementation lets incoming traffic on port 22 (SSH service) and blocks other traffic. Check the *iptables* configuration with the following steps:

1. Open an elevated PowerShell session
1. Connect to the EFLOW virtual machine
    ```powershell
    Connect-EflowVm
    ```
1. List all the *iptables* rules
    ```bash
    sudo iptables -L
    ```

    ![EFLOW iptables default](./media/iot-edge-for-linux-on-windows-security/default-iptables-output.png)

### Verified boot

The EFLOW virtual machine supports **Verified boot** through the included *device-mapper-verity (dm-verity)* kernel feature, which provides transparent integrity checking of block devices. *dm-verity* helps prevent persistent rootkits that can hold onto root privileges and compromise devices. This feature ensures the virtual machine base software image is the same and isn't altered. The virtual machine uses the *dm-verity* feature to check a specific block device, the underlying storage layer of the file system, and see if it matches its expected configuration.

By default, this feature is disabled in the virtual machine, but you can turn it on or off. For more information, see [dm-verity](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html#).

## Trusted platform module (TPM)
[Trusted platform module (TPM)](/windows/security/information-protection/tpm/trusted-platform-module-top-node) technology is designed to provide hardware-based, security-related functions. A TPM chip is a secure crypto-processor that is designed to carry out cryptographic operations. The chip includes multiple physical security mechanisms to make it tamper resistant, and malicious software is unable to tamper with the security functions of the TPM.

The EFLOW virtual machine doesn't support vTPM. However, you can enable or disable the TPM passthrough feature, which lets the EFLOW virtual machine use the Windows host OS TPM. This lets you do two main scenarios:
* Use TPM technology for IoT Edge device provisioning with Device Provision Service (DPS). For more information, see [Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM](./how-to-provision-devices-at-scale-linux-on-windows-tpm.md).
* Read-only access to cryptographic keys stored in the TPM. For more information, see [Set-EflowVmFeature to enable TPM passthrough](./reference-iot-edge-for-linux-on-windows-functions.md#set-eflowvmfeature).


## Secure host & virtual machine communication
EFLOW lets you interact with the virtual machine using a PowerShell module. For more information, see [PowerShell functions for IoT Edge for Linux on Windows](./reference-iot-edge-for-linux-on-windows-functions.md#set-eflowvmfeature). This module needs an elevated session to run, and it's signed with a Microsoft Corporation certificate.

All communication between the Windows host operating system and the EFLOW virtual machine that PowerShell cmdlets need uses an SSH channel. By default, the virtual machine SSH service doesn't let you authenticate with a username and password, and only allows certificate authentication. The certificate is created during the EFLOW deployment process and is unique for each EFLOW installation. To help prevent SSH brute force attacks, the virtual machine blocks an IP address if it tries more than three connections per minute to the SSH service.

In the EFLOW Continuous Release (CR) version, the transport channel for the SSH connection changes. Originally, the SSH service runs on TCP port 22, which any external device on the same network can access using a TCP socket. For security, EFLOW CR runs the SSH service over Hyper-V sockets instead of regular TCP sockets. All communication over Hyper-V sockets stays between the Windows host OS and the EFLOW virtual machine, without using networking. This setup limits SSH service access by restricting connections to only the Windows host OS. For more information, see [Hyper-V sockets](/virtualization/hyper-v-on-windows/user-guide/make-integration-service).

## Next steps

Read more about [Windows IoT security premises](/windows/iot/iot-enterprise/os-features/security)

Stay up to date with the latest [IoT Edge for Linux on Windows updates](./iot-edge-for-linux-on-windows-updates.md).
