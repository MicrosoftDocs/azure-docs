---
title: Boot integrity monitoring (guest attestation) overview
description: How to use the guest attestation extension to secure boot your VM. How to handle traffic blocking.
author: Howie425
ms.author: howieasmerom
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual 
ms.date: 04/25/2023
ms.custom: template-concept 
---

# Boot integrity monitoring (guest attestation) overview

To help Trusted Launch better prevent malicious rootkit attacks on virtual machines, guest attestation through Microsoft Azure Attestation (MAA) endpoint is used to monitor the boot sequence integrity. This attestation is critical to provide validity of a platform’s states. If your [Azure Trusted Virtual Machines](trusted-launch.md) has Secure Boot and vTPM enabled and attestation extensions installed, Microsoft Defender for Cloud will verify that the status and boot integrity of your VM is set up correctly. To learn more about MDC integration, see the [trusted launch integration with Microsoft Defender for Cloud](trusted-launch.md#microsoft-defender-for-cloud-integration).

## Prerequisites

An Active Azure Subscription + Trusted Launch Virtual Machine

## Enable integrity monitoring

# [Azure portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Select the resource (**Virtual Machines**).
1. Under **Settings**, select **configuration**. In the security type panel, select **integrity monitoring**.

    :::image type="content" source="media/trusted-launch/verify-integrity-boot-on.png" alt-text="Screenshot showing integrity booting selected.":::

1. Save the changes.

Now, under the virtual machines overview page, security type for integrity monitoring should state enabled.

This installs the guest attestation extension, which can be referred through settings within the extensions + applications tab.

# [Template](#tab/template)

You can deploy the guest attestation extension for trusted launch VMs using a quickstart template:

### Windows

```json
 {
    "name": "[concat(parameters('virtualMachineName1'),'/GuestAttestation')]",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "apiVersion": "2018-10-01",
    "location": "[parameters('location')]",
    "properties": {
        "publisher": "Microsoft.Azure.Security.WindowsAttestation",
        "type": "GuestAttestation",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion":true, 
        "enableAutomaticUpgrade":true,
        "settings": {
            "AttestationConfig": {
                "MaaSettings": {
                    "maaEndpoint": "",
                    "maaTenantName": "GuestAttestation"
                },
                "AscSettings": {
                    "ascReportingEndpoint": "",
                    "ascReportingFrequency": ""
                },
                "useCustomToken": "false",
                "disableAlerts": "false"
            }
        }
    },
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('virtualMachineName1'))]"
    ]
}       
```
### Linux

```json
 {
    "name": "[concat(parameters('virtualMachineName1'),'/GuestAttestation')]",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "apiVersion": "2018-10-01",
    "location": "[parameters('location')]",
    "properties": {
        "publisher": "Microsoft.Azure.Security.LinuxAttestation",
        "type": "GuestAttestation",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion":true, 
        "enableAutomaticUpgrade":true,
        "settings": {
            "AttestationConfig": {
                "MaaSettings": {
                    "maaEndpoint": "",
                    "maaTenantName": "GuestAttestation"
                },
                "AscSettings": {
                    "ascReportingEndpoint": "",
                    "ascReportingFrequency": ""
                },
                "useCustomToken": "false",
                "disableAlerts": "false"
            }
        }
    },
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('virtualMachineName1'))]"
    ]
}       

```

# [CLI](#tab/cli)

If Secure Boot and vTPM are ON, boot integrity will be ON.

1. Create a virtual machine with Trusted Launch with Secure Boot + vTPM capabilities through initial deployment of the TL virtual machines. Configuration of the virtual machines are customizable by virtual machine owner (az vm create).

1. For existing VMs, you can enable boot integrity monitoring settings. By updating settings to make sure both Secure Boot and vTPM are on (az vm update).

See [Deploy a VM with trusted launch enabled (CLI)](trusted-launch-portal.md#deploy-a-trusted-launch-vm) for more information on creation or updating a virtual machine to include the boot integrity monitoring through the guest attestation extension.

# [PowerShell](#tab/powershell)

If Secure Boot and vTPM are ON, boot integrity will be ON.

1. Create a virtual machine with Trusted Launch with Secure Boot + vTPM capabilities through initial deployment of the the virtual machines. Configuration of the virtual machines are customizable by virtual machine owner.

1. For existing VMs, you can enable boot integrity monitoring settings. By updating settings to make sure both SecureBoot and vTPM are on(Set-AzVmUefi).

See [Deploy a VM with trusted launch enabled (Powershell)](trusted-launch-portal.md#deploy-a-trusted-launch-vm) for more information on creation or updating a virtual machines to include the boot integrity monitoring through the guest attestation extension.

---

## Troubleshooting guide for guest attestation extension installation

### Symptoms

The Microsoft Azure Attestation extensions won't properly work when customers set up a network security group or proxy. An error that looks similar to (Microsoft.Azure.Security.WindowsAttestation.GuestAttestation provisioning failed.)

:::image type="content" source="media/trusted-launch/guest-attestation-failing.png" lightbox="./media/trusted-launch/guest-attestation-failing.png" alt-text="Screenshot of an error screen that results from a failed GA Extension":::

### Solutions

In Azure, Network Security Groups (NSG) are used to help filter network traffic between Azure resources. NSGs contains security rules that either allow or deny inbound network traffic, or outbound network traffic from several types of Azure resources. For the Microsoft Azure Attestation endpoint, it should be able to communicate with the guest attestation extension. Without this endpoint, Trusted Launch can’t access guest attestation, which allows Microsoft Defender for Cloud to monitor the integrity of the boot sequence of your virtual machines.

To unblock traffic using an NSG with service tags, set allow rules for Microsoft Azure Attestation.

1. Navigate to the **virtual machine** that you want to allow outbound traffic.
1. Under "Networking" in the left-hand sidebar, select the **networking settings** tab.
1. Then select **create port rule**, and **Add outbound port rule**.  
    :::image type="content" source="./media/trusted-launch/tvm-portrule.png" lightbox="./media/trusted-launch/tvm-portrule.png" alt-text="Screenshot of the add outbound port rule selection":::
1. To allow Microsoft Azure Attestation, make the destination a **service tag**. This allows for the range of IP addresses to update and automatically set allow rules for Microsoft Azure Attestation. The destination service tag is **AzureAttestation** and action is set to **Allow**.
    :::image type="content" source="media/trusted-launch/unblocking-NSG.png" alt-text="Screenshot showing how to make the destination a service tag":::

> [!NOTE]
> Users can configure their source type, service, destination port ranges, protocol, priority, and name.

This service tag is a global endpoint that unblocks Microsoft Azure Attestation traffic in any region.  

## Next steps

Learn more about [trusted launch](trusted-launch.md) and [deploying a trusted virtual machine](trusted-launch-portal.md).