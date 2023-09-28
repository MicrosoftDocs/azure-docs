---
title: FAQ for Trusted Launch
description: Get answers to the most frequently asked questions about Azure Trusted Launch virtual machines and virtual machine scale sets.
author: AjKundnani
ms.author: ajkundna
ms.reviewer: erd
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: faq
ms.date: 09/28/2023
ms.custom: template-faq, devx-track-azurecli, devx-track-azurepowershell
---

# Trusted Launch FAQ

Frequently asked questions about trusted launch.

## Frequently asked questions about Trusted Launch

### Why should I use trusted launch? What does trusted launch guard against?

Trusted launch guards against boot kits, rootkits, and kernel-level malware. These sophisticated types of malware run in kernel mode and remain hidden from users. For example:

- Firmware rootkits: these kits overwrite the firmware of the virtual machine's BIOS, so the rootkit can start before the OS.
- Boot kits: these kits replace the OS's bootloader so that the virtual machine loads the boot kit before the OS.
- Kernel rootkits: these kits replace a portion of the OS kernel so the rootkit can start automatically when the OS loads.
- Driver rootkits: these kits pretend to be one of the trusted drivers that OS uses to communicate with the virtual machine's components.

### What are the differences between secure boot and measured boot?

In secure boot chain, each step in the boot process checks a cryptographic signature of the subsequent steps. For example, the BIOS checks a signature on the loader, and the loader checks signatures on all the kernel objects that it loads, and so on. If any of the objects are compromised, the signature does not match, and the VM does not boot. For more information, see [Secure Boot](/windows-hardware/design/device-experiences/oem-secure-boot). Measured boot does not halt the boot process, it measures or computes the hash of the next objects in the chain and stores the hashes in the Platform Configuration Registers (PCRs) on the vTPM. Measured boot records are used for boot integrity monitoring.

### What is VM Guest State (VMGS)?  

VM Guest State (VMGS) is specific to Trusted Launch VM. It is a blob managed by Azure and contains the unified extensible firmware interface (UEFI) secure boot signature databases and other security information. The lifecycle of the VMGS blob is tied to that of the OS Disk.

### How does trusted launch compare to Hyper-V Shielded VM?

Hyper-V Shielded VM is currently available on Hyper-V only. [Hyper-V Shielded VM](/windows-server/security/guarded-fabric-shielded-vm/guarded-fabric-and-shielded-vms) is typically deployed in with Guarded Fabric. A Guarded Fabric consists of a Host Guardian Service (HGS), one or more guarded hosts, and a set of Shielded VMs. Hyper-V Shielded VMs are intended for use in fabrics where the data and state of the virtual machine must be protected from both fabric administrators and untrusted software that might be running on the Hyper-V hosts. Trusted launch on the other hand can be deployed as a standalone virtual machine or Virtual Machine Scale Sets on Azure without additional deployment and management of HGS. All of the trusted launch features can be enabled with a simple change in deployment code or a checkbox on the Azure portal.

## Deployment

### How can I find VM sizes that support Trusted launch?

See the list of [Generation 2 VM sizes supporting Trusted launch](trusted-launch.md#virtual-machines-sizes).

The following commands can be used to check if a [Generation 2 VM Size](../virtual-machines/generation-2.md#generation-2-vm-sizes) does not support Trusted launch.

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

The response is similar to the following form. `TrustedLaunchDisabled True` in the output indicates that the Generation 2 VM size does not support Trusted launch. If it's a Generation 2 VM size and `TrustedLaunchDisabled` is not part of the output, it implies that Trusted launch is supported for that VM size.

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

### How can I validate if OS image supports Trusted Launch?

See the list of [OS versions supported with Trusted Launch](trusted-launch.md#operating-systems-supported),

**Marketplace OS Image**

The following commands can be used to check if a Marketplace OS image supports Trusted Launch.

#### [CLI](#tab/cli)

```azurecli
az vm image show --urn "MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest"
```

The response is similar to the following form. **hyperVGeneration** `v2` and **SecurityType** contains `TrustedLaunch` in the output indicates that the Generation 2 OS Image supports Trusted Launch.

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

#### [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzVMImage -Skus 22_04-lts-gen2 -PublisherName Canonical -Offer 0001-com-ubuntu-server-jammy -Location westus3 -Version latest
```

The response of above command can be used with [Virtual Machines - Get API](/rest/api/compute/virtual-machine-images/get). The response is similar to the following form. **hyperVGeneration** `v2` and **SecurityType** contains `TrustedLaunch` in the output indicates that the Generation 2 OS Image supports Trusted Launch.

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

**Azure Compute Gallery OS Image**

The following commands can be used to check if a [Azure Compute Gallery](trusted-launch-portal.md#trusted-launch-vm-supported-images) OS image supports Trusted Launch.

#### [CLI](#tab/cli)

```azurecli
az sig image-definition show `
    --gallery-image-definition myImageDefinition `
    --gallery-name myImageGallery `
    --resource-group myImageGalleryRg
```

The response is similar to the following form. **hyperVGeneration** `v2` and **SecurityType** contains `TrustedLaunch` in the output indicates that the Generation 2 OS Image supports Trusted Launch.

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

#### [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzGalleryImageDefinition -ResourceGroupName myImageGalleryRg `
    -GalleryName myImageGallery -GalleryImageDefinitionName myImageDefinition
```

The response is similar to the following form. **hyperVGeneration** `v2` and **SecurityType** contains `TrustedLaunch` in the output indicates that the Generation 2 OS Image supports Trusted Launch.

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

### How can I disable Trusted Launch for new VM deployment using PowerShell or CLI?

Trusted Launch VMs provide you with foundational compute security and our recommendation is not to disable same for new VM/VMSS deployments except if your deployments have dependency on:

- [VM Size families currently not supported with Trusted Launch](trusted-launch.md#virtual-machines-sizes)
- [Feature currently not supported with Trusted Launch](trusted-launch.md#unsupported-features)
- [OS version not supported with Trusted Launch](trusted-launch.md#operating-systems-supported)

You can use parameter **securityType** with value `Standard` to disable Trusted Launch in new VM/VMSS deployments using Azure PowerShell (v10.3.0+) and CLI (v2.53.0+)

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

## Feature support

### Does trusted launch support Azure Compute Gallery?

Trusted launch now allows images to be created and shared through the [Azure Compute Gallery](trusted-launch-portal.md#trusted-launch-vm-supported-images) (formerly Shared Image Gallery). The image source can be:
- an existing Azure VM that is either generalized or specialized OR,
- an existing managed disk or a snapshot OR,
- a VHD or an image version from another gallery.

For more information about deploying Trusted Launch VM using Azure Compute Gallery, see [deploy Trusted Launch VMs](trusted-launch-portal.md#deploy-a-trusted-launch-vm-from-an-azure-compute-gallery-image).

### Does trusted launch support Azure Backup?

Trusted launch now supports Azure Backup. For more information, see  [Support matrix for Azure VM backup](../backup/backup-support-matrix-iaas.md#vm-compute-support).

### Does trusted launch support ephemeral OS disks?

Trusted launch supports ephemeral OS disks. For more information, see [Trusted Launch for Ephemeral OS disks](ephemeral-os-disks.md#trusted-launch-for-ephemeral-os-disks).
> [!NOTE]
> While using ephemeral disks for Trusted Launch VMs, keys and secrets generated or sealed by the vTPM after the creation of the VM may not be persisted across operations like reimaging and platform events like service healing.

## Enable Trusted Launch on existing VMs

### Can virtual machine be restored using backup taken before enabling Trusted Launch?
Backups taken before [upgrading existing Generation 2 VM to Trusted Launch](trusted-launch-existing-vm.md) can be used to restore entire virtual machine or individual data disks. They cannot be used to restore or replace OS disk only.

### Will backup continue to work after enabling Trusted Launch?
Backups configured with [enhanced policy](../backup/backup-azure-vms-enhanced-policy.md) will continue to take backup of VM after enabling Trusted Launch.

## Boot integrity monitoring

### What happens when an integrity fault is detected?

Trusted launch for Azure virtual machines is monitored for advanced threats. If such threats are detected, an alert is triggered. Alerts are only available if [Defender for Cloud's enhanced security features](../security-center/enable-enhanced-security.md) are enabled.

Microsoft Defender for Cloud periodically performs attestation. If the attestation fails, a medium severity alert is triggered. Trusted launch attestation can fail for the following reasons:

- The attested information, which includes a log of the Trusted Computing Base (TCB), deviates from a trusted baseline (like when Secure Boot is enabled). This deviation indicates an untrusted module(s) have been loaded and the OS may be compromised.
- The attestation quote could not be verified to originate from the vTPM of the attested VM. This verification failure indicates a malware is present and may be intercepting traffic to the TPM.
- The attestation extension on the VM is not responding. This unresponsive extension indicates a denial-of-service attack by malware or an OS admin.

## Certificates

### How can users establish root of trust with Trusted Launch VMs?  

The virtual TPM AK public certificate will provide users with visibility for information on the full certificate chain (Root and Intermediate Certificates), helping them validate trust in certificate and root chain. To ensure Trusted Launch consumers continually have the highest security posture, it provides information on instance properties, so users can trace back to the full chain.

#### Download instructions

Below is the package certificate, compromised of. p7b (full Certificate Authority) and .cer (intermediate CA), revealing the signing and certificate authority. Use certificate tooling to inspect and assess details of certificates.

<details>
<summary>Click to view the p7b content</summary>
-----BEGIN CERTIFICATE-----
MIIRKQYJKoZIhvcNAQcCoIIRGjCCERYCAQExADCCBbMGCSqGSIb3DQEHAaCCBaQE
ggWgMIIFnDCCA4SgAwIBAgITMwAAAALA0XtLj5ecNQAAAAAAAjANBgkqhkiG9w0B
AQwFADBpMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
aW9uMTowOAYDVQQDEzFBenVyZSBWaXJ0dWFsIFRQTSBSb290IENlcnRpZmljYXRl
IEF1dGhvcml0eSAyMDIzMB4XDTIzMDYwODE3NTMwNFoXDTI1MTEwMzE3NTMwNFow
JTEjMCEGA1UEAxMaR2xvYmFsIFZpcnR1YWwgVFBNIENBIC0gMDEwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/NqouHGBovTadw1GLMQYNxWrEciPSh7gE
7VxsfbbPCE0SfTO80OF2raLdRYN2gEWE2Dr8+TDUuAb/WBFyczhU1aHFPssg8B3/
DT6pTXlDlohLLPWkjYU+OuT1/Ls7RzjQBe2se/MJyPaIJXI6KgCwePw7EcWFChe8
aCTUMHYBG0Ju4xNlMTUd/tcu6a53CXn6Nq48umwlaJelRh+i1f0vcwB2CY/v+Rli
wb/8DM5Ed9FUHZOKyp5Vnaw9GWloM46sLQT/fdHB0jmugfNZzafkkhQAYiNL3jYN
YFZH5/IgUfYJ/yybwnwoxOdV2NV0Q2i+P5Pcb0WNGaJY47aqOj8BAgMBAAGjggF/
MIIBezASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwICBDAXBgNVHSUE
EDAOBgVngQUIAQYFZ4EFCAMwHQYDVR0OBBYEFP/2zueowUhpKMuKS/LYgYG1bYCB
MB8GA1UdIwQYMBaAFEv+JlqUwfYzw4NIJt3z5bBksqqVMHYGA1UdHwRvMG0wa6Bp
oGeGZWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL0F6dXJlJTIw
VmlydHVhbCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUy
MDIwMjMuY3JsMIGDBggrBgEFBQcBAQR3MHUwcwYIKwYBBQUHMAKGZ2h0dHA6Ly93
d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvQXp1cmUlMjBWaXJ0dWFsJTIw
VFBNJTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAyMy5jcnQw
DQYJKoZIhvcNAQEMBQADggIBAEhTwx26W+Xap7zXExbAwnHYtN6kB4dIGXdgQIiQ
y5OQltsSj2jx7qZ/af5n5OnTBQ+gXM8siVipgaAIdBkbGgOjCb6b6MTe1YpFAH4f
Qv8eVwTVDziBMD0EKI30h0JbFKLdSdKe48O9Lw+T2b0PBXvMFJOSdZT7meGIkpNx
SqmAZ+RNyreLxil9knNjF5ymPT0RcGK52+MwGlElBb/jc+snhr+ZJZ1grjFky9Nz
jCTiE5SG+6H3YgiHCqfXr0L3NRt/QZ5IgkuGkNPeMvn4JjevFwAhXFxBqJYJ7mY6
1MJuWTdyhhoUJgzmZo1hS+GNyuMKaKBLreUwtc1y7LRH3YGGed57HbQ9bmyMdhO7
x8KZNrBDX2/cRLzrCmpSUldmKMu9G4dpzXpde4pFMObiVFrGRq8/9HMOJwZlQvzh
wQp0PUMY/gIU5rf23n1M1M36tM5g5CEzxQUGtVaG9ABTJQ2zijD5wDo840vbznyK
t3ihimrUs+LqpPDNXyxbwvibcZidwSdhu0QmUoyYsgSP2Zff5E8ks53h2xQSM3zz
2qaWVS1vVqG4zC0EfRnO65ogPPfrtK6ZiFmVHSWP9vPkFcUNYDnYQXW/TArO/JCe
2I++GClM7AcDQwWLxcopzskGQdHNM1zMsprRRwYaVpTJH67xeNda6+Y7IOPJYTvy
oXHPoIILVDCCBZwwggOEoAMCAQICEzMAAAACwNF7S4+XnDUAAAAAAAIwDQYJKoZI
hvcNAQEMBQAwaTELMAkGA1UEBhMCVVMxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
b3JhdGlvbjE6MDgGA1UEAxMxQXp1cmUgVmlydHVhbCBUUE0gUm9vdCBDZXJ0aWZp
Y2F0ZSBBdXRob3JpdHkgMjAyMzAeFw0yMzA2MDgxNzUzMDRaFw0yNTExMDMxNzUz
MDRaMCUxIzAhBgNVBAMTGkdsb2JhbCBWaXJ0dWFsIFRQTSBDQSAtIDAxMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvzaqLhxgaL02ncNRizEGDcVqxHIj
0oe4BO1cbH22zwhNEn0zvNDhdq2i3UWDdoBFhNg6/Pkw1LgG/1gRcnM4VNWhxT7L
IPAd/w0+qU15Q5aISyz1pI2FPjrk9fy7O0c40AXtrHvzCcj2iCVyOioAsHj8OxHF
hQoXvGgk1DB2ARtCbuMTZTE1Hf7XLumudwl5+jauPLpsJWiXpUYfotX9L3MAdgmP
7/kZYsG//AzORHfRVB2TisqeVZ2sPRlpaDOOrC0E/33RwdI5roHzWc2n5JIUAGIj
S942DWBWR+fyIFH2Cf8sm8J8KMTnVdjVdENovj+T3G9FjRmiWOO2qjo/AQIDAQAB
o4IBfzCCAXswEgYDVR0TAQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAgQwFwYD
VR0lBBAwDgYFZ4EFCAEGBWeBBQgDMB0GA1UdDgQWBBT/9s7nqMFIaSjLikvy2IGB
tW2AgTAfBgNVHSMEGDAWgBRL/iZalMH2M8ODSCbd8+WwZLKqlTB2BgNVHR8EbzBt
MGugaaBnhmVodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9BenVy
ZSUyMFZpcnR1YWwlMjBUUE0lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBBdXRob3Jp
dHklMjAyMDIzLmNybDCBgwYIKwYBBQUHAQEEdzB1MHMGCCsGAQUFBzAChmdodHRw
Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL0F6dXJlJTIwVmlydHVh
bCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUyMDIwMjMu
Y3J0MA0GCSqGSIb3DQEBDAUAA4ICAQBIU8Mdulvl2qe81xMWwMJx2LTepAeHSBl3
YECIkMuTkJbbEo9o8e6mf2n+Z+Tp0wUPoFzPLIlYqYGgCHQZGxoDowm+m+jE3tWK
RQB+H0L/HlcE1Q84gTA9BCiN9IdCWxSi3UnSnuPDvS8Pk9m9DwV7zBSTknWU+5nh
iJKTcUqpgGfkTcq3i8YpfZJzYxecpj09EXBiudvjMBpRJQW/43PrJ4a/mSWdYK4x
ZMvTc4wk4hOUhvuh92IIhwqn169C9zUbf0GeSIJLhpDT3jL5+CY3rxcAIVxcQaiW
Ce5mOtTCblk3coYaFCYM5maNYUvhjcrjCmigS63lMLXNcuy0R92Bhnneex20PW5s
jHYTu8fCmTawQ19v3ES86wpqUlJXZijLvRuHac16XXuKRTDm4lRaxkavP/RzDicG
ZUL84cEKdD1DGP4CFOa39t59TNTN+rTOYOQhM8UFBrVWhvQAUyUNs4ow+cA6PONL
2858ird4oYpq1LPi6qTwzV8sW8L4m3GYncEnYbtEJlKMmLIEj9mX3+RPJLOd4dsU
EjN889qmllUtb1ahuMwtBH0ZzuuaIDz367SumYhZlR0lj/bz5BXFDWA52EF1v0wK
zvyQntiPvhgpTOwHA0MFi8XKKc7JBkHRzTNczLKa0UcGGlaUyR+u8XjXWuvmOyDj
yWE78qFxzzCCBbAwggOYoAMCAQICEFH0MdoskgiKTing2SneSqcwDQYJKoZIhvcN
AQEMBQAwaTELMAkGA1UEBhMCVVMxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
dGlvbjE6MDgGA1UEAxMxQXp1cmUgVmlydHVhbCBUUE0gUm9vdCBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkgMjAyMzAeFw0yMzA2MDExODA4NTNaFw00ODA2MDExODE1NDFa
MGkxCzAJBgNVBAYTAlVTMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
OjA4BgNVBAMTMUF6dXJlIFZpcnR1YWwgVFBNIFJvb3QgQ2VydGlmaWNhdGUgQXV0
aG9yaXR5IDIwMjMwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC6DDML
3USe/m1tNGnShNVXpjaiUvtuvFK3vEHH2V1TrFTttvjy/VkaD51qNK+XVaKJmBm6
G4eBwu9rPbBmOgRkXvlItizMLlp4qwbTo2id+K9WYnjTHFTSU/3V1uRzfxy5Zv4E
ipVs6ghMeoBRQEE78mJf+Y2CODntOcye6I4Iyv+mR16RcrF58lCEyfaoI5+eOiCY
fxuTjAt5g3xVOwPxgIvi2Gjh0s14+vS5Nbwn7TavQ3EB7Qe6LTtFcRZES2lC3H7v
wGBzOxQv0qunCW/QLvCvyFIcP+ZSUl2WsCycB6XBGMxE5tm5WndFR7AAmizbnGS+
cAYvBhLrEPVqPFtada1AjKfPabn8WtwK/bGGb1niZbyoIFnEFVJYb7yGRJ0/n7Xh
L8E3aGo5eakr2Wwzxgj42/da0s56Ii6vF6oEAQRY5xIky/lYmmZsmT2FLAbwWN5S
lwdZdoYIGoXwSGoOI9MHIKpS/Nki+6QHRo6tBaLukioB55JK1eQjcVAQVTDQsFKI
+ZrxI3eZhe1z4HzPfKjQAW9gKrX5flbgpFPxtV7xaE6kvQJMGy0xhTEvfowhFNq8
OsJyrhr9U8fYrknTb7F7fLLceH5FXib5xaSXgCMAWVYCkUk2t8N9PfZNJlvKhojJ
8AiOUn3Wdkicg+LhJrM7J4nhOsAFndbSy4NY7wIDAQABo1QwUjAOBgNVHQ8BAf8E
BAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUS/4mWpTB9jPDg0gm3fPl
sGSyqpUwEAYJKwYBBAGCNxUBBAMCAQAwDQYJKoZIhvcNAQEMBQADggIBAC4DQMoP
CNADTTv/CNgYaUzrG8sDdmEpkoQJooOYeLArWiUjNXUV8APpHmOjwl0BLfz0QEAI
hzXDhec27jlNQcP2eWe5PaJLdOHrvArEtgaXPjzoPY7OpQbZooDOS1iQh9YKDA9J
CWKc5Ggs8dU3Q98o6NMUsYBoWm5OSLtbKA9zsYVMiBXMWpbocJIlSDbdyYcuxu1S
U5RMJJNtQKDq0MVLCR9H9hl42EoUta/aiz8y3+8pHDputoxxpi2VWbowcyyHTZNW
5Yz/VbhlvnCEgcM5DXhDDBbn3C9sYerP6IlJ14nBVrxuxOoqD52smF6x8t0YevFy
54X6c3gs728/yOMjFd/KhqP3AGNjiaV1Lrg/2WyOa0/pUQRJA1tZMRz/HKcJEcBq
KVfPoF9iklLnCCDeJfP66zQxF/E9G+VPgVKoju2eWJ8Qsmvx9GSMJkJ05S0U1Nn1
vjhhvsciK4zIv9Jev8lj1JCAJDbb0v8ju1EkVSz27RlZN0K3uh3KmnAl8xIyDXCY
RhFYPN2PJzPmPmvSdJVJx8rTEhWRPOYfPDrHkUtkMKo6M1KNo9Q6MJoUklL/TWuQ
HttsnHIgZBGUqvGuK0pcKrYWhCzaXqEy1JOolaFJCv4i72jL65HY/ciWNTv4L5Xz
dmojU0k/9m3fjwOEQU6Bva15+rzZFFnWy4m1MQA=
-----END CERTIFICATE-----
Full Certificate Authority Details
Valid # 01/Jun/2048
Serial # 51f431da2c92088a4e29e0d929de4aa7
Thumbnail# cdb9bc34197a5355f652f1583fbd4e9a1d4801f0 
</details>

<details>
<summary>Click to view json output for the full certificate authority</summary>
-----BEGIN CERTIFICATE-----
MIIRKQYJKoZIhvcNAQcCoIIRGjCCERYCAQExADCCBbMGCSqGSIb3DQEHAaCCBaQE
ggWgMIIFnDCCA4SgAwIBAgITMwAAAALA0XtLj5ecNQAAAAAAAjANBgkqhkiG9w0B
AQwFADBpMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
aW9uMTowOAYDVQQDEzFBenVyZSBWaXJ0dWFsIFRQTSBSb290IENlcnRpZmljYXRl
IEF1dGhvcml0eSAyMDIzMB4XDTIzMDYwODE3NTMwNFoXDTI1MTEwMzE3NTMwNFow
JTEjMCEGA1UEAxMaR2xvYmFsIFZpcnR1YWwgVFBNIENBIC0gMDEwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/NqouHGBovTadw1GLMQYNxWrEciPSh7gE
7VxsfbbPCE0SfTO80OF2raLdRYN2gEWE2Dr8+TDUuAb/WBFyczhU1aHFPssg8B3/
DT6pTXlDlohLLPWkjYU+OuT1/Ls7RzjQBe2se/MJyPaIJXI6KgCwePw7EcWFChe8
aCTUMHYBG0Ju4xNlMTUd/tcu6a53CXn6Nq48umwlaJelRh+i1f0vcwB2CY/v+Rli
wb/8DM5Ed9FUHZOKyp5Vnaw9GWloM46sLQT/fdHB0jmugfNZzafkkhQAYiNL3jYN
YFZH5/IgUfYJ/yybwnwoxOdV2NV0Q2i+P5Pcb0WNGaJY47aqOj8BAgMBAAGjggF/
MIIBezASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwICBDAXBgNVHSUE
EDAOBgVngQUIAQYFZ4EFCAMwHQYDVR0OBBYEFP/2zueowUhpKMuKS/LYgYG1bYCB
MB8GA1UdIwQYMBaAFEv+JlqUwfYzw4NIJt3z5bBksqqVMHYGA1UdHwRvMG0wa6Bp
oGeGZWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL0F6dXJlJTIw
VmlydHVhbCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUy
MDIwMjMuY3JsMIGDBggrBgEFBQcBAQR3MHUwcwYIKwYBBQUHMAKGZ2h0dHA6Ly93
d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvQXp1cmUlMjBWaXJ0dWFsJTIw
VFBNJTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAyMy5jcnQw
DQYJKoZIhvcNAQEMBQADggIBAEhTwx26W+Xap7zXExbAwnHYtN6kB4dIGXdgQIiQ
y5OQltsSj2jx7qZ/af5n5OnTBQ+gXM8siVipgaAIdBkbGgOjCb6b6MTe1YpFAH4f
Qv8eVwTVDziBMD0EKI30h0JbFKLdSdKe48O9Lw+T2b0PBXvMFJOSdZT7meGIkpNx
SqmAZ+RNyreLxil9knNjF5ymPT0RcGK52+MwGlElBb/jc+snhr+ZJZ1grjFky9Nz
jCTiE5SG+6H3YgiHCqfXr0L3NRt/QZ5IgkuGkNPeMvn4JjevFwAhXFxBqJYJ7mY6
1MJuWTdyhhoUJgzmZo1hS+GNyuMKaKBLreUwtc1y7LRH3YGGed57HbQ9bmyMdhO7
x8KZNrBDX2/cRLzrCmpSUldmKMu9G4dpzXpde4pFMObiVFrGRq8/9HMOJwZlQvzh
wQp0PUMY/gIU5rf23n1M1M36tM5g5CEzxQUGtVaG9ABTJQ2zijD5wDo840vbznyK
t3ihimrUs+LqpPDNXyxbwvibcZidwSdhu0QmUoyYsgSP2Zff5E8ks53h2xQSM3zz
2qaWVS1vVqG4zC0EfRnO65ogPPfrtK6ZiFmVHSWP9vPkFcUNYDnYQXW/TArO/JCe
2I++GClM7AcDQwWLxcopzskGQdHNM1zMsprRRwYaVpTJH67xeNda6+Y7IOPJYTvy
oXHPoIILVDCCBZwwggOEoAMCAQICEzMAAAACwNF7S4+XnDUAAAAAAAIwDQYJKoZI
hvcNAQEMBQAwaTELMAkGA1UEBhMCVVMxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
b3JhdGlvbjE6MDgGA1UEAxMxQXp1cmUgVmlydHVhbCBUUE0gUm9vdCBDZXJ0aWZp
Y2F0ZSBBdXRob3JpdHkgMjAyMzAeFw0yMzA2MDgxNzUzMDRaFw0yNTExMDMxNzUz
MDRaMCUxIzAhBgNVBAMTGkdsb2JhbCBWaXJ0dWFsIFRQTSBDQSAtIDAxMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvzaqLhxgaL02ncNRizEGDcVqxHIj
0oe4BO1cbH22zwhNEn0zvNDhdq2i3UWDdoBFhNg6/Pkw1LgG/1gRcnM4VNWhxT7L
IPAd/w0+qU15Q5aISyz1pI2FPjrk9fy7O0c40AXtrHvzCcj2iCVyOioAsHj8OxHF
hQoXvGgk1DB2ARtCbuMTZTE1Hf7XLumudwl5+jauPLpsJWiXpUYfotX9L3MAdgmP
7/kZYsG//AzORHfRVB2TisqeVZ2sPRlpaDOOrC0E/33RwdI5roHzWc2n5JIUAGIj
S942DWBWR+fyIFH2Cf8sm8J8KMTnVdjVdENovj+T3G9FjRmiWOO2qjo/AQIDAQAB
o4IBfzCCAXswEgYDVR0TAQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAgQwFwYD
VR0lBBAwDgYFZ4EFCAEGBWeBBQgDMB0GA1UdDgQWBBT/9s7nqMFIaSjLikvy2IGB
tW2AgTAfBgNVHSMEGDAWgBRL/iZalMH2M8ODSCbd8+WwZLKqlTB2BgNVHR8EbzBt
MGugaaBnhmVodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9BenVy
ZSUyMFZpcnR1YWwlMjBUUE0lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBBdXRob3Jp
dHklMjAyMDIzLmNybDCBgwYIKwYBBQUHAQEEdzB1MHMGCCsGAQUFBzAChmdodHRw
Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL0F6dXJlJTIwVmlydHVh
bCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUyMDIwMjMu
Y3J0MA0GCSqGSIb3DQEBDAUAA4ICAQBIU8Mdulvl2qe81xMWwMJx2LTepAeHSBl3
YECIkMuTkJbbEo9o8e6mf2n+Z+Tp0wUPoFzPLIlYqYGgCHQZGxoDowm+m+jE3tWK
RQB+H0L/HlcE1Q84gTA9BCiN9IdCWxSi3UnSnuPDvS8Pk9m9DwV7zBSTknWU+5nh
iJKTcUqpgGfkTcq3i8YpfZJzYxecpj09EXBiudvjMBpRJQW/43PrJ4a/mSWdYK4x
ZMvTc4wk4hOUhvuh92IIhwqn169C9zUbf0GeSIJLhpDT3jL5+CY3rxcAIVxcQaiW
Ce5mOtTCblk3coYaFCYM5maNYUvhjcrjCmigS63lMLXNcuy0R92Bhnneex20PW5s
jHYTu8fCmTawQ19v3ES86wpqUlJXZijLvRuHac16XXuKRTDm4lRaxkavP/RzDicG
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
dmojU0k/9m3fjwOEQU6Bva15+rzZFFnWy4m1MQA=
-----END CERTIFICATE-----
</details>

<details>
<summary>Click to view the intermediate CA</summary>
"Global Virtual TPM CA - XX" (intermediate CA) [.cer], 
-----BEGIN CERTIFICATE-----
MIIFnDCCA4SgAwIBAgITMwAAAALA0XtLj5ecNQAAAAAAAjANBgkqhkiG9w0BAQwF
ADBpMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
MTowOAYDVQQDEzFBenVyZSBWaXJ0dWFsIFRQTSBSb290IENlcnRpZmljYXRlIEF1
dGhvcml0eSAyMDIzMB4XDTIzMDYwODE3NTMwNFoXDTI1MTEwMzE3NTMwNFowJTEj
MCEGA1UEAxMaR2xvYmFsIFZpcnR1YWwgVFBNIENBIC0gMDEwggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQC/NqouHGBovTadw1GLMQYNxWrEciPSh7gE7Vxs
fbbPCE0SfTO80OF2raLdRYN2gEWE2Dr8+TDUuAb/WBFyczhU1aHFPssg8B3/DT6p
TXlDlohLLPWkjYU+OuT1/Ls7RzjQBe2se/MJyPaIJXI6KgCwePw7EcWFChe8aCTU
MHYBG0Ju4xNlMTUd/tcu6a53CXn6Nq48umwlaJelRh+i1f0vcwB2CY/v+Rliwb/8
DM5Ed9FUHZOKyp5Vnaw9GWloM46sLQT/fdHB0jmugfNZzafkkhQAYiNL3jYNYFZH
5/IgUfYJ/yybwnwoxOdV2NV0Q2i+P5Pcb0WNGaJY47aqOj8BAgMBAAGjggF/MIIB
ezASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwICBDAXBgNVHSUEEDAO
BgVngQUIAQYFZ4EFCAMwHQYDVR0OBBYEFP/2zueowUhpKMuKS/LYgYG1bYCBMB8G
A1UdIwQYMBaAFEv+JlqUwfYzw4NIJt3z5bBksqqVMHYGA1UdHwRvMG0wa6BpoGeG
ZWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL0F6dXJlJTIwVmly
dHVhbCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUyMDIw
MjMuY3JsMIGDBggrBgEFBQcBAQR3MHUwcwYIKwYBBQUHMAKGZ2h0dHA6Ly93d3cu
bWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvQXp1cmUlMjBWaXJ0dWFsJTIwVFBN
JTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAyMy5jcnQwDQYJ
KoZIhvcNAQEMBQADggIBAEhTwx26W+Xap7zXExbAwnHYtN6kB4dIGXdgQIiQy5OQ
ltsSj2jx7qZ/af5n5OnTBQ+gXM8siVipgaAIdBkbGgOjCb6b6MTe1YpFAH4fQv8e
VwTVDziBMD0EKI30h0JbFKLdSdKe48O9Lw+T2b0PBXvMFJOSdZT7meGIkpNxSqmA
Z+RNyreLxil9knNjF5ymPT0RcGK52+MwGlElBb/jc+snhr+ZJZ1grjFky9NzjCTi
E5SG+6H3YgiHCqfXr0L3NRt/QZ5IgkuGkNPeMvn4JjevFwAhXFxBqJYJ7mY61MJu
WTdyhhoUJgzmZo1hS+GNyuMKaKBLreUwtc1y7LRH3YGGed57HbQ9bmyMdhO7x8KZ
NrBDX2/cRLzrCmpSUldmKMu9G4dpzXpde4pFMObiVFrGRq8/9HMOJwZlQvzhwQp0
PUMY/gIU5rf23n1M1M36tM5g5CEzxQUGtVaG9ABTJQ2zijD5wDo840vbznyKt3ih
imrUs+LqpPDNXyxbwvibcZidwSdhu0QmUoyYsgSP2Zff5E8ks53h2xQSM3zz2qaW
VS1vVqG4zC0EfRnO65ogPPfrtK6ZiFmVHSWP9vPkFcUNYDnYQXW/TArO/JCe2I++
GClM7AcDQwWLxcopzskGQdHNM1zMsprRRwYaVpTJH67xeNda6+Y7IOPJYTvyoXHP
-----END CERTIFICATE-----
Intermediate Certificate Authority
Thumbprint = db1f3959dcce7091f87c43446be1f4ab2d3415b7
Serial Number = 3300000002c0d17b4b8f979c35000000000002
Valid Until = November 3rd, 2025
</details>

<details>
<summary>Click to view the json output of the intermediate CA</summary>
-----BEGIN CERTIFICATE-----
MIIFnDCCA4SgAwIBAgITMwAAAALA0XtLj5ecNQAAAAAAAjANBgkqhkiG9w0BAQwF
ADBpMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
MTowOAYDVQQDEzFBenVyZSBWaXJ0dWFsIFRQTSBSb290IENlcnRpZmljYXRlIEF1
dGhvcml0eSAyMDIzMB4XDTIzMDYwODE3NTMwNFoXDTI1MTEwMzE3NTMwNFowJTEj
MCEGA1UEAxMaR2xvYmFsIFZpcnR1YWwgVFBNIENBIC0gMDEwggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQC/NqouHGBovTadw1GLMQYNxWrEciPSh7gE7Vxs
fbbPCE0SfTO80OF2raLdRYN2gEWE2Dr8+TDUuAb/WBFyczhU1aHFPssg8B3/DT6p
TXlDlohLLPWkjYU+OuT1/Ls7RzjQBe2se/MJyPaIJXI6KgCwePw7EcWFChe8aCTU
MHYBG0Ju4xNlMTUd/tcu6a53CXn6Nq48umwlaJelRh+i1f0vcwB2CY/v+Rliwb/8
DM5Ed9FUHZOKyp5Vnaw9GWloM46sLQT/fdHB0jmugfNZzafkkhQAYiNL3jYNYFZH
5/IgUfYJ/yybwnwoxOdV2NV0Q2i+P5Pcb0WNGaJY47aqOj8BAgMBAAGjggF/MIIB
ezASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwICBDAXBgNVHSUEEDAO
BgVngQUIAQYFZ4EFCAMwHQYDVR0OBBYEFP/2zueowUhpKMuKS/LYgYG1bYCBMB8G
A1UdIwQYMBaAFEv+JlqUwfYzw4NIJt3z5bBksqqVMHYGA1UdHwRvMG0wa6BpoGeG
ZWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL0F6dXJlJTIwVmly
dHVhbCUyMFRQTSUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0eSUyMDIw
MjMuY3JsMIGDBggrBgEFBQcBAQR3MHUwcwYIKwYBBQUHMAKGZ2h0dHA6Ly93d3cu
bWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvQXp1cmUlMjBWaXJ0dWFsJTIwVFBN
JTIwUm9vdCUyMENlcnRpZmljYXRlJTIwQXV0aG9yaXR5JTIwMjAyMy5jcnQwDQYJ
KoZIhvcNAQEMBQADggIBAEhTwx26W+Xap7zXExbAwnHYtN6kB4dIGXdgQIiQy5OQ
ltsSj2jx7qZ/af5n5OnTBQ+gXM8siVipgaAIdBkbGgOjCb6b6MTe1YpFAH4fQv8e
VwTVDziBMD0EKI30h0JbFKLdSdKe48O9Lw+T2b0PBXvMFJOSdZT7meGIkpNxSqmA
Z+RNyreLxil9knNjF5ymPT0RcGK52+MwGlElBb/jc+snhr+ZJZ1grjFky9NzjCTi
E5SG+6H3YgiHCqfXr0L3NRt/QZ5IgkuGkNPeMvn4JjevFwAhXFxBqJYJ7mY61MJu
WTdyhhoUJgzmZo1hS+GNyuMKaKBLreUwtc1y7LRH3YGGed57HbQ9bmyMdhO7x8KZ
NrBDX2/cRLzrCmpSUldmKMu9G4dpzXpde4pFMObiVFrGRq8/9HMOJwZlQvzhwQp0
PUMY/gIU5rf23n1M1M36tM5g5CEzxQUGtVaG9ABTJQ2zijD5wDo840vbznyKt3ih
imrUs+LqpPDNXyxbwvibcZidwSdhu0QmUoyYsgSP2Zff5E8ks53h2xQSM3zz2qaW
VS1vVqG4zC0EfRnO65ogPPfrtK6ZiFmVHSWP9vPkFcUNYDnYQXW/TArO/JCe2I++
GClM7AcDQwWLxcopzskGQdHNM1zMsprRRwYaVpTJH67xeNda6+Y7IOPJYTvyoXHP
-----END CERTIFICATE-----
</details>

> [!WARNING]
> Do not share the contents of the `.p7b` or `.cert` files with unauthorized parties. Additionally, be cautious when handling the `.json` file as it contains information about the intermediate certificate authority.