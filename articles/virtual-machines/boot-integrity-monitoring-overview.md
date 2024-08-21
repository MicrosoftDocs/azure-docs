---
title: Boot integrity monitoring overview
description: Learn how to use the Guest Attestation extension to secure boot your virtual machine and how to handle traffic blocking.
author: Howie425
ms.author: howieasmerom
ms.reviewer: jushiman
ms.service: azure-virtual-machines
ms.subservice: trusted-launch
ms.topic: conceptual
ms.date: 04/10/2024
ms.custom: template-concept
---

# Boot integrity monitoring overview

To help Azure Trusted Launch better prevent malicious rootkit attacks on virtual machines (VMs), guest attestation through an Azure Attestation endpoint is used to monitor the boot sequence integrity. This attestation is critical to provide the validity of a platform's states.

Your [Trusted Launch VM](trusted-launch.md) needs Secure Boot and virtual Trusted Platform Module (vTPM) to be enabled so that the attestation extensions can be installed. Microsoft Defender for Cloud offers reports based on Guest Attestation verifying status and that the boot integrity of your VM is set up correctly. To learn more about Microsoft Defender for Cloud integration, see [Trusted Launch integration with Microsoft Defender for Cloud](trusted-launch.md#microsoft-defender-for-cloud-integration).

> [!IMPORTANT]
> Automatic Extension Upgrade is now available for the Boot Integrity Monitoring - Guest Attestation extension. For more information, see [Automatic Extension Upgrade](automatic-extension-upgrade.md).

## Prerequisites

You need an active Azure subscription and a Trusted Launch VM.

## Enable integrity monitoring

To enable integrity monitoring, follow the steps in this section.

### [Azure portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Select the resource (**Virtual Machines**).
1. Under **Settings**, select **Configuration**. On the **Security type** pane, select **Integrity monitoring**.

    :::image type="content" source="media/trusted-launch/verify-integrity-boot-on.png" alt-text="Screenshot that shows Integrity monitoring selected.":::

1. Save the changes.

On the VM **Overview** page, the security type for integrity monitoring should appear as **Enabled**.

This action installs the Guest Attestation extension, which you can refer to via the settings on the **Extensions + Applications** tab.

### [Template](#tab/template)

You can deploy the Guest Attestation extension for Trusted Launch VMs by using a quickstart template.

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

1. Create a VM with Trusted Launch that has Secure Boot and vTPM capabilities through initial deployment of a Trusted Launch VM. To deploy the Guest Attestation extension, use `--enable-integrity-monitoring`. As the VM owner, you can customize VM configuration by using `az vm create`.
1. For existing VMs, you can enable boot integrity monitoring settings by updating to make sure that integrity monitoring is turned on. You can use `--enable-integrity-monitoring`.

> [!NOTE]
> The Guest Attestation extension must be configured explicitly.

### [PowerShell](#tab/powershell)

If Secure Boot and vTPM are set to **ON**, then boot integrity is also set to **ON**.

1. Create a VM with Trusted Launch that has Secure Boot and vTPM capabilities through initial deployment of a Trusted Launch VM. As the VM owner, you can customize VM configuration.
1. For existing VMs, you can enable boot integrity monitoring settings by updating. Make sure that both Secure Boot and vTPM are set to **ON**.

For more information on creating or updating a VM to include boot integrity monitoring through the Guest Attestation extension, see [Deploy a VM with Trusted Launch enabled (PowerShell)](trusted-launch-portal.md#deploy-a-trusted-launch-vm).

---

## Troubleshooting guide for Guest Attestation extension installation

This section addresses attestation errors and solutions.

### Symptoms

The Azure Attestation extension won't work properly when you set up a network security group (NSG) or a proxy. An error appears that looks similar to "`Microsoft.Azure.Security.WindowsAttestation.GuestAttestation` provisioning failed."

:::image type="content" source="media/trusted-launch/guest-attestation-failing.png" lightbox="./media/trusted-launch/guest-attestation-failing.png" alt-text="Screenshot that shows an error that results from a failed Guest Attestation extension.":::

### Solutions

In Azure, NSGs are used to help filter network traffic between Azure resources. NSGs contain security rules that either allow or deny inbound network traffic, or outbound network traffic from several types of Azure resources. The Azure Attestation endpoint should be able to communicate with the Guest Attestation extension. Without this endpoint, Trusted Launch can't access guest attestation, which allows Microsoft Defender for Cloud to monitor the integrity of the boot sequence of your VMs.

To unblock Azure Attestation traffic in NSGs by using service tags:

1. Go to the VM that you want to allow outbound traffic.
1. On the leftmost pane, under **Networking**, select **Networking settings**.
1. Then select **Create port rule** > **Outbound port rule**.

    :::image type="content" source="./media/trusted-launch/tvm-portrule.png" lightbox="./media/trusted-launch/tvm-portrule.png" alt-text="Screenshot that shows adding the Outbound port rule.":::

1. To allow Azure Attestation, you make the destination a service tag. This setting allows for the range of IP addresses to update and automatically set rules that allow Azure Attestation. Set **Destination service tag** to **AzureAttestation** and set **Action** to **Allow**.

    :::image type="content" source="media/trusted-launch/unblocking-NSG.png" alt-text="Screenshot that shows how to make the destination a service tag.":::

Firewalls protect a virtual network, which contains multiple Trusted Launch VMs. To unblock Azure Attestation traffic in a firewall by using an application rule collection:

1. Go to the Azure Firewall instance that has traffic blocked from the Trusted Launch VM resource.
1. Under **Settings**, select **Rules (classic)** to begin unblocking guest attestation behind the firewall.
1. Under **Network rule collection**, select **Add network rule collection**.

   :::image type="content" source="./media/trusted-launch/firewall-network-rule-collection.png" lightbox="./media/trusted-launch/firewall-network-rule-collection.png" alt-text="Screenshot that shows adding an application rule.":::

1. Configure the name, priority, source type, and destination ports based on your needs. Set **Service tag name** to **AzureAttestation** and set **Action** to **Allow**.

To unblock Azure Attestation traffic in a firewall by using an application rule collection:

1. Go to the Azure Firewall instance that has traffic blocked from the Trusted Launch VM resource.

   :::image type="content" source="./media/trusted-launch/firewall-rule.png" lightbox="./media/trusted-launch/firewall-rule.png" alt-text="Screenshot that shows adding traffic for the application rule route.":::

   The rules collection must contain at least one rule that targets fully qualified domain names (FQDNs).

1. Select the application rule collection and add an application rule.
1. Select a name and a numeric priority for your application rules. Set **Action** for the rule collection to **Allow**.

   :::image type="content" source="./media/trusted-launch/firewall-application-rule.png" lightbox="./media/trusted-launch/firewall-application-rule.png" alt-text="Screenshot that shows adding the application rule route.":::

1. Configure the name, source, and protocol. The source type is for a single IP address. Select the IP group to allow multiple IP addresses through the firewall.

### Regional shared providers

Azure Attestation provides a [regional shared provider](https://maainfo.azurewebsites.net/) in each available region. You can choose to use the regional shared provider for attestation or create your own providers with custom policies. Any Microsoft Entra user can access shared providers. The policy associated with it can't be changed.

> [!NOTE]
> You can configure the source type, service, destination port ranges, protocol, priority, and name.

## Related content

Learn more about [Trusted Launch](trusted-launch.md) and [deploying a Trusted Launch VM](trusted-launch-portal.md).
