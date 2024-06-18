---
title: Boot integrity monitoring overview
description: How to use the guest attestation extension to secure boot your VM. How to handle traffic blocking.
author: Howie425
ms.author: howieasmerom
ms.reviewer: jushiman
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 04/10/2024
ms.custom: template-concept
---

# Boot integrity monitoring overview

To help Trusted Launch better prevent malicious rootkit attacks on virtual machines, guest attestation through Microsoft Azure Attestation (MAA) endpoint is used to monitor the boot sequence integrity. This attestation is critical to provide validity of a platform’s states. If your [Azure Trusted Virtual Machines](trusted-launch.md) has Secure Boot and vTPM enabled and attestation extensions installed, Microsoft Defender for Cloud verifies that the status and boot integrity of your VM is set up correctly. To learn more about MDC integration, see the [trusted launch integration with Microsoft Defender for Cloud](trusted-launch.md#microsoft-defender-for-cloud-integration).

> [!IMPORTANT]
> Automatic Extension Upgrade is now available for Boot Integrity Monitoring - Guest Attestation extension. Learn more about [Automatic extension upgrade](automatic-extension-upgrade.md).

## Prerequisites

An Active Azure Subscription + Trusted Launch Virtual Machine

## Enable integrity monitoring

### [Azure portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Select the resource (**Virtual Machines**).
1. Under **Settings**, select **configuration**. In the security type panel, select **integrity monitoring**.

    :::image type="content" source="media/trusted-launch/verify-integrity-boot-on.png" alt-text="Screenshot showing integrity booting selected.":::

1. Save the changes.

Now, under the virtual machines overview page, security type for integrity monitoring should state enabled.

This installs the guest attestation extension, which can be referred through settings within the extensions + applications tab.

### [Template](#tab/template)

You can deploy the guest attestation extension for trusted launch VMs using a quickstart template:

#### Windows

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
#### Linux

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

### [CLI](#tab/cli)


1. Create a virtual machine with Trusted Launch that has Secure Boot + vTPM capabilities through initial deployment of trusted launch virtual machine. To deploy guest attestation extension use (`--enable_integrity_monitoring`). Configuration of virtual machines are customizable by virtual machine owner (`az vm create`).
1. For existing VMs, you can enable boot integrity monitoring settings by updating to make sure enable integrity monitoring is turned on (`--enable_integrity_monitoring`).

> [!NOTE]
> The Guest Attestation Extension needs to be configured explicitly.

### [PowerShell](#tab/powershell)

If Secure Boot and vTPM are ON, boot integrity will be ON.

1. Create a virtual machine with Trusted Launch that has Secure Boot + vTPM capabilities through initial deployment of the trusted launch virtual machine. Configuration of virtual machines is customizable by virtual machine owner.
1. For existing VMs, you can enable boot integrity monitoring settings by updating to make sure both SecureBoot and vTPM are on.

For more information on creation or updating a virtual machine to include the boot integrity monitoring through the guest attestation extension, see [Deploy a VM with trusted launch enabled (PowerShell)](trusted-launch-portal.md#deploy-a-trusted-launch-vm).

---

## Troubleshooting guide for guest attestation extension installation

### Symptoms

The Microsoft Azure Attestation extensions won't properly work when customers set up a network security group or proxy. An error that looks similar to (Microsoft.Azure.Security.WindowsAttestation.GuestAttestation provisioning failed.)

:::image type="content" source="media/trusted-launch/guest-attestation-failing.png" lightbox="./media/trusted-launch/guest-attestation-failing.png" alt-text="Screenshot of an error screen that results from a failed GA Extension.":::

### Solutions

In Azure, Network Security Groups (NSG) are used to help filter network traffic between Azure resources. NSGs contains security rules that either allow or deny inbound network traffic, or outbound network traffic from several types of Azure resources. For the Microsoft Azure Attestation endpoint, it should be able to communicate with the guest attestation extension. Without this endpoint, Trusted Launch can’t access guest attestation, which allows Microsoft Defender for Cloud to monitor the integrity of the boot sequence of your virtual machines.

Unblocking Microsoft Azure Attestation traffic in **Network Security Groups** using service tags.

1. Navigate to the **virtual machine** that you want to allow outbound traffic.
1. Under "Networking" in the left-hand sidebar, select the **networking settings** tab.
1. Then select **create port rule**, and **Add outbound port rule**.  
    :::image type="content" source="./media/trusted-launch/tvm-portrule.png" lightbox="./media/trusted-launch/tvm-portrule.png" alt-text="Screenshot of the add outbound port rule selection.":::
1. To allow Microsoft Azure Attestation, make the destination a **service tag**. This allows for the range of IP addresses to update and automatically set allow rules for Microsoft Azure Attestation. The destination service tag is **AzureAttestation** and action is set to **Allow**.
    :::image type="content" source="media/trusted-launch/unblocking-NSG.png" alt-text="Screenshot showing how to make the destination a service tag.":::

Firewalls protect a virtual network, which contains multiple Trusted Launch virtual machines. To unblock Microsoft Azure Attestation traffic in **Firewall** using application rule collection. 

1. Navigate to the Azure Firewall, that has traffic blocked from the Trusted Launch virtual machine resource. 
2. Under settings, select Rules (classic) to begin unblocking guest attestation behind the Firewall.
3. Select a **network rule collection** and add network rule.
   :::image type="content" source="./media/trusted-launch/firewall-network-rule-collection.png" lightbox="./media/trusted-launch/firewall-network-rule-collection.png" alt-text="Screenshot of the adding application rule":::
5. The user can configure their name, priority, source type, destination ports based on their needs. The name of the service tag is as follows: **AzureAttestation**, and action needs to be set as **allow**.

To unblock Microsoft Azure Attestation traffic in **Firewall** using application rule collection. 

1. Navigate to the Azure Firewall, that has traffic blocked from the Trusted Launch virtual machine resource.
:::image type="content" source="./media/trusted-launch/firewall-rule.png" lightbox="./media/trusted-launch/firewall-rule.png" alt-text="Screenshot of the adding traffic for application rule route."::: The rules collection must contain at least one rule, navigate to Target FQDNs (fully qualified domain names).
2. Select Application Rule collection and add an application rule.
3. Select a name, a numeric priority for your application rules. The action for rule collection is set to ALLOW. To learn more about the application processing and values, read here.
:::image type="content" source="./media/trusted-launch/firewall-application-rule.png" lightbox="./media/trusted-launch/firewall-application-rule.png" alt-text="Screenshot of the adding application rule route.":::
4. Name, source, protocol, are all configurable by the user. Source type for single IP address, select IP group to allow multiple IP address through the firewall. 

### Regional Shared Providers

Azure Attestation provides a [regional shared provider](https://maainfo.azurewebsites.net/) in each available region. Customers can choose to use the regional shared provider for attestation or create their own providers with custom policies. Shared providers can be accessed by any Azure AD user, and the policy associated with it cannot be changed.

> [!NOTE]
> Users can configure their source type, service, destination port ranges, protocol, priority, and name.


## Next steps

Learn more about [trusted launch](trusted-launch.md) and [deploying a trusted virtual machine](trusted-launch-portal.md).
