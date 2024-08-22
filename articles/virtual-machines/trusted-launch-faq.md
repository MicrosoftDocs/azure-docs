---
title: FAQ for Trusted Launch
description: Get answers to the most frequently asked questions about Azure Trusted Launch virtual machines and virtual machine scale sets.
author: howie425
ms.author: howieasmerom
ms.reviewer: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: trusted-launch
ms.topic: faq
ms.date: 01/29/2024
ms.custom: template-faq, devx-track-azurecli, devx-track-azurepowershell
---

# Trusted Launch FAQ

> [!CAUTION]
> This article references CentOS, a Linux distribution that's nearing end-of-life (EOL) status. Consider your use and plan accordingly. For more information, see the [CentOS EOL guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Frequently asked questions (FAQs) about Azure Trusted Launch feature use cases, support for other Azure features, and fixes for common errors.

## Use cases

This section answers questions about use cases for Trusted Launch.

### Why should I use Trusted Launch? What does Trusted Launch guard against?
Trusted Launch guards against boot kits, rootkits, and kernel-level malware. These sophisticated types of malware run in kernel mode and remain hidden from users. For example:

- **Firmware rootkits**: These kits overwrite the firmware of the virtual machine (VM) BIOS, so the rootkit can start before the operating system (OS).
- **Boot kits**: These kits replace the OS's bootloader so that the VM loads the boot kit before the OS.
- **Kernel rootkits**: These kits replace a portion of the OS kernel, so the rootkit can start automatically when the OS loads.
- **Driver rootkits**: These kits pretend to be one of the trusted drivers that the OS uses to communicate with the VM's components.

### What are the differences between Secure Boot and measured boot?

In a Secure Boot chain, each step in the boot process checks a cryptographic signature of the subsequent steps. For example, the BIOS checks a signature on the loader, and the loader checks signatures on all the kernel objects that it loads, and so on. If any of the objects are compromised, the signature doesn't match and the VM doesn't boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot).

### How does Trusted Launch compare to Hyper-V Shielded VM?

Hyper-V Shielded VM is currently available on Hyper-V only. [Hyper-V Shielded VM](/windows-server/security/guarded-fabric-shielded-vm/guarded-fabric-and-shielded-vms) is typically deployed with Guarded Fabric. A Guarded Fabric consists of a Host Guardian Service (HGS), one or more guarded hosts, and a set of Shielded VMs. Hyper-V Shielded VMs are used in fabrics where the data and state of the VM must be protected from various actors. These actors are both fabric administrators and untrusted software that might be running on the Hyper-V hosts.

Trusted Launch, on the other hand, can be deployed as a standalone VM or as virtual machine scale sets on Azure without other deployment and management of HGS. All of the Trusted Launch features can be enabled with a simple change in deployment code or a checkbox on the Azure portal.

### What is VM Guest State (VMGS)?

VM Guest State (VMGS) is specific to Trusted Launch VMs. It's a blob managed by Azure and contains the unified extensible firmware interface (UEFI) Secure Boot signature databases and other security information. The lifecycle of the VMGS blob is tied to that of the OS disk.

### Can I disable Trusted Launch for a new VM deployment?

Trusted Launch VMs provide you with foundational compute security. We recommend that you don't disable them for new VM or virtual machine scale set deployments except if your deployments have dependency on:

- [A VM size currently not supported](trusted-launch.md#virtual-machines-sizes)
- [Unsupported features with Trusted Launch](trusted-launch.md#unsupported-features)
- [An OS that doesn't support Trusted Launch](trusted-launch.md#operating-systems-supported)

You can use the `securityType` parameter with the `Standard` value to disable Trusted Launch in new VM or virtual machine scale set deployments by using Azure PowerShell (v10.3.0+) and the Azure CLI (v2.53.0+).

> [!NOTE]
> We don't recommend disabling Secure Boot unless you're using custom unsigned kernel or drivers.

If you need to disable Secure Boot, under the VM's configuration, clear the **Enable Secure Boot** option.

#### [CLI](#tab/cli)

```azurecli
az vm create -n MyVm -g MyResourceGroup --image Ubuntu2204 `
    --security-type 'Standard'
```

#### [PowerShell](#tab/PowerShell)

```azurepowershell
$adminUsername = <USER NAME>
$adminPassword = <PASSWORD> | ConvertTo-SecureString -AsPlainText -Force
$vmCred = New-Object System.Management.Automation.PSCredential($adminUsername, $adminPassword)
New-AzVM -Name MyVm -Credential $vmCred -SecurityType Standard
```

---

## Supported features and deployments

This section discusses Trusted Launch supported features and deployments.

### Is Azure Compute Gallery supported by Trusted Launch?

Trusted Launch now allows images to be created and shared through the [Azure Compute Gallery](trusted-launch-portal.md#trusted-launch-vm-supported-images) (formerly Shared Image Gallery). The image source can be:

- An existing Azure VM that is either generalized or specialized.
- An existing managed disk or a snapshot.
- A VHD or an image version from another gallery.

For more information about deploying a Trusted Launch VM by using the Azure Compute Gallery, see [Deploy Trusted Launch VMs](trusted-launch-portal.md#deploy-a-trusted-launch-vm-from-an-azure-compute-gallery-image).

### Is Azure Backup supported by Trusted Launch?

Trusted Launch now supports Azure Backup. For more information, see  [Support matrix for Azure VM backup](../backup/backup-support-matrix-iaas.md#vm-compute-support).

### Will Azure Backup continue working after I enable Trusted Launch?

Backups configured with the [Enhanced policy](../backup/backup-azure-vms-enhanced-policy.md) continue to take backups of VMs after you enable Trusted Launch.

### Are ephemeral OS disks supported by Trusted Launch?

Trusted Launch supports ephemeral OS disks. For more information, see [Trusted Launch for ephemeral OS disks](ephemeral-os-disks.md#trusted-launch-for-ephemeral-os-disks).

> [!NOTE]
> When you use ephemeral disks for Trusted Launch VMs, keys and secrets generated or sealed by the virtual Trusted Platform Module (vTPM) after the creation of the VM might not be persisted across operations like reimaging and platform events like service healing.

### Are security features available with Trusted launch applicable to data disks as well?

Trusted launch provides foundational security for Operating system hosted in virtual machine by attesting its boot integrity. Trusted launch security features are applicable for running OS and OS disks only, they are not applicable to data disks or OS binaries stored in data disks. For more details, see [Trusted launch overview](trusted-launch.md)

### Can a VM be restored by using backups taken before Trusted Launch was enabled?

Backups taken before you [upgrade an existing Generation 2 VM to Trusted Launch](trusted-launch-existing-vm.md) can be used to restore the entire VM or individual data disks. They can't be used to restore or replace the OS disk only.

### How can I find VM sizes that support Trusted Launch?

See the list of [Generation 2 VM sizes that support Trusted Launch](trusted-launch.md#virtual-machines-sizes).

Use the following commands to check if a [Generation 2 VM size](../virtual-machines/generation-2.md#generation-2-vm-sizes) doesn't support Trusted Launch.

#### [CLI](#tab/cli)

```azurecli
subscription="<yourSubID>"
region="westus"
vmSize="Standard_NC12s_v3"

az vm list-skus --resource-type virtualMachines  --location $region --query "[?name=='$vmSize'].capabilities" --subscription $subscription
```

#### [PowerShell](#tab/PowerShell)

```azurepowershell
$region = "southeastasia"
$vmSize = "Standard_M64"
(Get-AzComputeResourceSku | where {$_.Locations.Contains($region) -and ($_.Name -eq $vmSize) })[0].Capabilities
```

The response is similar to the following form. Output that includes `TrustedLaunchDisabled True` indicates that the Generation 2 VM size doesn't support Trusted Launch. If it's a Generation 2 VM size and `TrustedLaunchDisabled` isn't part of the output, Trusted Launch is supported for that VM size.

```
Name                                         Value
----                                         -----
MaxResourceVolumeMB                          8192000
OSVhdSizeMB                                  1047552
vCPUs                                        64
MemoryPreservingMaintenanceSupported         False
HyperVGenerations                            V1,V2
MemoryGB                                     1000
MaxDataDiskCount                             64
CpuArchitectureType                          x64
MaxWriteAcceleratorDisksAllowed              8
LowPriorityCapable                           True
PremiumIO                                    True
VMDeploymentTypes                            IaaS
vCPUsAvailable                               64
ACUs                                         160
vCPUsPerCore                                 2
CombinedTempDiskAndCachedIOPS                80000
CombinedTempDiskAndCachedReadBytesPerSecond  838860800
CombinedTempDiskAndCachedWriteBytesPerSecond 838860800
CachedDiskBytes                              1318554959872
UncachedDiskIOPS                             40000
UncachedDiskBytesPerSecond                   1048576000
EphemeralOSDiskSupported                     True
EncryptionAtHostSupported                    True
CapacityReservationSupported                 False
TrustedLaunchDisabled                        True
AcceleratedNetworkingEnabled                 True
RdmaEnabled                                  False
MaxNetworkInterfaces                         8
```

---

### How can I validate that my OS image supports Trusted Launch?

See the list of [OS versions supported with Trusted Launch](trusted-launch.md#operating-systems-supported).

#### Marketplace OS images

Use the following commands to check if an Azure Marketplace OS image supports Trusted Launch.

##### [CLI](#tab/cli)

```azurecli
az vm image show --urn "MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest"
```

The response is similar to the following form. If `hyperVGeneration` is `v2` and `SecurityType` contains `TrustedLaunch` in the output, the Generation 2 OS image supports Trusted Launch.

```json
{
  "architecture": "x64",
  "automaticOsUpgradeProperties": {
    "automaticOsUpgradeSupported": false
  },
  "dataDiskImages": [],
  "disallowed": {
    "vmDiskType": "Unmanaged"
  },
  "extendedLocation": null,
  "features": [
    {
      "name": "SecurityType",
      "value": "TrustedLaunchAndConfidentialVmSupported"
    },
    {
      "name": "IsAcceleratedNetworkSupported",
      "value": "True"
    },
    {
      "name": "DiskControllerTypes",
      "value": "SCSI, NVMe"
    },
    {
      "name": "IsHibernateSupported",
      "value": "True"
    }
  ],
  "hyperVGeneration": "V2",
  "id": "/Subscriptions/00000000-0000-0000-0000-00000000000/Providers/Microsoft.Compute/Locations/westus/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2022-datacenter-azure-edition/Versions/20348.1906.230803",
  "imageDeprecationStatus": {
    "alternativeOption": null,
    "imageState": "Active",
    "scheduledDeprecationTime": null
  },
  "location": "westus",
  "name": "20348.1906.230803",
  "osDiskImage": {
    "operatingSystem": "Windows",
    "sizeInGb": 127
  },
  "plan": null,
  "tags": null
}
```

##### [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzVMImage -Skus 22_04-lts-gen2 -PublisherName Canonical -Offer 0001-com-ubuntu-server-jammy -Location westus3 -Version latest
```

You can use the output of the command with [Virtual machines - Get API](/rest/api/compute/virtual-machine-images/get). The response is similar to the following form. If `hyperVGeneration` is `v2` and `SecurityType` contains `TrustedLaunch` in the output, the Generation 2 OS image supports Trusted Launch.

```json
{
    "properties": {
        "hyperVGeneration": "V2",
        "architecture": "x64",
        "replicaType": "Managed",
        "replicaCount": 10,
        "disallowed": {
            "vmDiskType": "Unmanaged"
        },
        "automaticOSUpgradeProperties": {
            "automaticOSUpgradeSupported": false
        },
        "imageDeprecationStatus": {
            "imageState": "Active"
        },
        "features": [
            {
                "name": "SecurityType",
                "value": "TrustedLaunchSupported"
            },
            {
                "name": "IsAcceleratedNetworkSupported",
                "value": "True"
            },
            {
                "name": "DiskControllerTypes",
                "value": "SCSI, NVMe"
            },
            {
                "name": "IsHibernateSupported",
                "value": "True"
            }
        ],
        "osDiskImage": {
            "operatingSystem": "Linux",
            "sizeInGb": 30
        },
        "dataDiskImages": []
    },
    "location": "WestUS3",
    "name": "22.04.202309080",
    "id": "/Subscriptions/00000000-0000-0000-0000-000000000000/Providers/Microsoft.Compute/Locations/WestUS3/Publishers/Canonical/ArtifactTypes/VMImage/Offers/0001-com-ubuntu-server-jammy/Skus/22_04-lts-gen2/Versions/22.04.202309080"
}
```

---

#### Azure Compute Gallery OS image

Use the following commands to check if an [Azure Compute Gallery](trusted-launch-portal.md#trusted-launch-vm-supported-images) OS image supports Trusted Launch.

##### [CLI](#tab/cli)

```azurecli
az sig image-definition show `
    --gallery-image-definition myImageDefinition `
    --gallery-name myImageGallery `
    --resource-group myImageGalleryRg
```

The response is similar to the following form. If `hyperVGeneration` is `v2` and `SecurityType` contains `TrustedLaunch` in the output, the Generation 2 OS image supports Trusted Launch.

```json
{
  "architecture": "x64",
  "features": [
    {
      "name": "SecurityType",
      "value": "TrustedLaunchSupported"
    }
  ],
  "hyperVGeneration": "V2",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myImageGalleryRg/providers/Microsoft.Compute/galleries/myImageGallery/images/myImageDefinition",
  "identifier": {
    "offer": "myImageDefinition",
    "publisher": "myImageDefinition",
    "sku": "myImageDefinition"
  },
  "location": "westus3",
  "name": "myImageDefinition",
  "osState": "Generalized",
  "osType": "Windows",
  "provisioningState": "Succeeded",
  "recommended": {
    "memory": {
      "max": 32,
      "min": 1
    },
    "vCPUs": {
      "max": 16,
      "min": 1
    }
  },
  "resourceGroup": "myImageGalleryRg",
  "tags": {},
  "type": "Microsoft.Compute/galleries/images"
}
```

##### [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzGalleryImageDefinition -ResourceGroupName myImageGalleryRg `
    -GalleryName myImageGallery -GalleryImageDefinitionName myImageDefinition
```

The response is similar to the following form. If `hyperVGeneration` is `v2` and `SecurityType` contains `TrustedLaunch` in the output, the Generation 2 OS image supports Trusted Launch.

```
ResourceGroupName : myImageGalleryRg
OsType            : Windows
OsState           : Generalized
HyperVGeneration  : V2
Identifier        :
  Publisher       : myImageDefinition
  Offer           : myImageDefinition
  Sku             : myImageDefinition
Recommended       :
  VCPUs           :
    Min           : 1
    Max           : 16
  Memory          :
    Min           : 1
    Max           : 32
ProvisioningState : Succeeded
Id                : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myImageGalleryRg/providers/Microsoft.Compute/galleries/myImageGallery/images/myImageDefinition
Name              : myImageDefinition
Type              : Microsoft.Compute/galleries/images
Location          : westus3
Tags              : {}
Features[0]       :
  Name            : SecurityType
  Value           : TrustedLaunchSupported
Architecture      : x64
```

---

### How do external communication drivers work with Trusted Launch VMs?

Adding COM ports requires that you disable Secure Boot. COM ports are disabled by default in Trusted Launch VMs.

## Troubleshooting issues

This section answers questions about specific states, boot types, and common boot issues.

### What should I do when my Trusted Launch VM has deployment failures ? 
This section provides additional details on Trusted Launch deployment failures for you to take proper action to prevent them. 

```
Virtual machine <vm name> failed to create from the selected snapshot because the virtual Trusted Platform Module (vTPM) state is locked.
To proceed with the VM creation, please select a different snapshot without a locked vTPM state.
For more assistance, please refer to “Troubleshooting locked vTPM state” in FAQ page at https://aka.ms/TrustedLaunch-FAQ. 
```
This deployment error happens when the snapshot or restore point provided is inaccessible or unusable for the following reasons: 
1. Corrupt virtual machine guest state (VMGS) 
2. vTPM in a locked state  
3. One or more critical vTPM indices are in an invalid state. 

The above can happen if a user or workload running on the virtual machine sets the lock on vTPM or modifies critical vTPM indices that leaves the vTPM in an invalid state. 

Retrying with the same snapshot/restore point will result in the same failure. 

To resolve this: 

1. On the source Trusted Launch VM where the snapshot or restore point was generated, the vTPM errors must be rectified.
    1. If the vTPM state was modified by a workload on the virtual machine, you need to use the same to check the error states and bring the vTPM to a non-error state.
    1. If TPM tools were used to modify the vTPM state, then you should use the same tools to check the error states and bring the vTPM to a non-error state.  

Once the snapshot or restore point is free from these errors, you can use this to create a new Trusted Launch VM.  

### Why is the Trusted Launch VM not booting correctly?

If unsigned components are detected from the UEFI (guest firmware), bootloader, OS, or boot drivers, a Trusted Launch VM won't boot. The [Secure Boot](/windows-server/virtualization/hyper-v/learn-more/generation-2-virtual-machine-security-settings-for-hyper-v#secure-boot-setting-in-hyper-v-manager) setting in the Trusted Launch VM fails to boot if unsigned or untrusted boot components are encountered during the boot process and reports as a Secure Boot failure.

![Screenshot that shows the Trusted Launch pipeline from Secure Boot to third-party drivers.](./media/trusted-launch/trusted-launch-pipeline.png)

> [!NOTE]
> Trusted Launch VMs that are created directly from an Azure Marketplace image should not encounter Secure Boot failures. Azure Compute Gallery images with an original image source of Azure Marketplace and snapshots created from Trusted Launch VMs should also not encounter these errors.

### How would I verify a no-boot scenario in the Azure portal?

When a VM becomes unavailable from a Secure Boot failure, "no-boot" means that VM has an OS component that's signed by a trusted authority, which blocks booting a Trusted Launch VM. On VM deployment, you might see information from resource health within the Azure portal stating that there's a validation error in Secure Boot.

To access resource health from the VM configuration page, go to **Resource Health** under the **Help** pane.

:::image type="content" source="./media/trusted-launch/resource-health-error.png" lightbox="./media/trusted-launch/resource-health-error.png" alt-text="Screenshot that shows a resource health error message alerting a failed Secure Boot.":::

If you verified that the no-boot was caused by a Secure Boot failure:

1. The image you're using is an older version that might have one or more untrusted boot components and is on a deprecation path. To remedy an outdated image, update to a supported newer image version.
1. The image you're using might have been built outside of a marketplace source or the boot components have been modified and contain unsigned or untrusted boot components. To verify whether your image has unsigned or untrusted boot components, see the following section, "Verify Secure Boot failures."
1. If the preceding two scenarios don't apply, the VM is potentially infected with malware (bootkit/rootkit). Consider deleting the VM and re-creating a new VM from the same source image while you evaluate all the software being installed.

## Verify Secure Boot failures

This section helps you verify Secure Boot failures.

### Linux virtual machines

To verify which boot components are responsible for Secure Boot failures within an Azure Linux VM, you can use the SBInfo tool from the Linux Security Package.

1. Turn off Secure Boot.
1. Connect to your Azure Linux Trusted Launch VM.
1. Install the SBInfo tool for the distribution your VM is running. It resides within the Linux Security Package.

#### [Debian-based distributions](#tab/debianbased)

These commands apply to Ubuntu, Debian, and other Debian-based distributions.

```bash
echo "deb [arch=amd64] http://packages.microsoft.com/repos/azurecore/ trusty main" | sudo tee -a /etc/apt/sources.list.d/azure.list

echo "deb [arch=amd64] http://packages.microsoft.com/repos/azurecore/ xenial main" | sudo tee -a /etc/apt/sources.list.d/azure.list

echo "deb [arch=amd64] http://packages.microsoft.com/repos/azurecore/ bionic main" | sudo tee -a /etc/apt/sources.list.d/azure.list

wget https://packages.microsoft.com/keys/microsoft.asc

wget https://packages.microsoft.com/keys/msopentech.asc

sudo apt-key add microsoft.asc && sudo apt-key add msopentech.asc

sudo apt update && sudo apt install azure-security

```

#### [Red Hat-based distributions](#tab/rhelbased)

These commands apply to RHEL, CentOS, and other Red Hat-based distributions.

```bash
echo "[packages-microsoft-com-azurecore]" | sudo tee -a /etc/yum.repos.d/azurecore.repo

echo "name=packages-microsoft-com-azurecore" | sudo tee -a /etc/yum.repos.d/azurecore.repo

echo "baseurl=https://packages.microsoft.com/yumrepos/azurecore/" | sudo tee -a /etc/yum.repos.d/azurecore.repo

echo "enabled=1" | sudo tee -a /etc/yum.repos.d/azurecore.repo

echo "gpgcheck=0" | sudo tee -a /etc/yum.repos.d/azurecore.repo

sudo yum install azure-security
```

#### [SUSE-based distributions](#tab/susebased)

These commands apply to SLES, openSUSE, and other SUSE-based distributions.

```bash
sudo zypper ar -t rpm-md -n "packages-microsoft-com-azurecore" --no-gpgcheck https://packages.microsoft.com/yumrepos/azurecore/ azurecore

sudo zypper install azure-security
```

---

After you install the Linux Security Package for your distribution, run the `sbinfo` command to verify which boot components are responsible for Secure Boot failures by displaying all unsigned modules, kernels, and bootloaders.

```bash
sudo sbinfo -u -m -k -b 
```

To learn more about the SBInfo diagnostic tool, you can run `sudo sbinfo -help`.

### Why am I getting a boot integrity monitoring fault?

Trusted Launch for Azure VMs is monitored for advanced threats. If such threats are detected, an alert is triggered. Alerts are only available if [enhanced security features in Microsoft Defender for Cloud](../security-center/enable-enhanced-security.md) are enabled.

Microsoft Defender for Cloud periodically performs attestation. If the attestation fails, a medium-severity alert is triggered. Trusted Launch attestation can fail for the following reasons:

- The attested information, which includes a log of the Trusted Computing Base (TCB), deviates from a trusted baseline (like when Secure Boot is enabled). Any deviation indicates that untrusted modules were loaded and the OS might be compromised.
- The attestation quote couldn't be verified to originate from the vTPM of the attested VM. The verification failure indicates malware is present and might be intercepting traffic to the TPM.
- The attestation extension on the VM isn't responding. An unresponsive extension indicates a denial-of-service attack by malware or an OS admin.

## Certificates

This section provides information on certificates.

### How can I establish root of trust with Trusted Launch VMs?  

The virtual TPM AK public certificate provides you with visibility for information on the full certificate chain (Root and Intermediate Certificates) to help you validate trust in the certificate and root chain. To ensure that you continually have the highest security posture for Trusted Launch, it provides information on instance properties so that you can trace back to the full chain.

#### Download instructions

Package certificates, composed of .p7b (Full Certificate Authority) and .cer (Intermediate CA), reveal the signing and certificate authority. Copy the relevant content and use certificate tooling to inspect and assess details of certificates.

[!INCLUDE [json](../virtual-machines/includes/trusted-launch-tpm-certs/tpm-root-certificate-authority.md)]

[!INCLUDE [p7b](../virtual-machines/includes/trusted-launch-tpm-certs/full-certificate-authority.md)]

[!INCLUDE [json](../virtual-machines/includes/trusted-launch-tpm-certs/root-certificate-authority.md)]

[!INCLUDE [cert](../virtual-machines/includes/trusted-launch-tpm-certs/intermediate-ca.md)]
