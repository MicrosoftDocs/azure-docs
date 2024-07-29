---
title: Troubleshoot hibernation on Windows virtual machines
description: Learn how to troubleshoot hibernation on Windows VMs.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/16/2024
ms.author: jainan
ms.reviewer: mattmcinnes
---

# Troubleshooting hibernation on Windows VMs


Hibernating a virtual machine allows you to persist the VM state to the OS disk. This article describes how to troubleshoot issues with the hibernation feature in Windows, issues creating hibernation enabled Windows VMs, and issues with hibernating a Windows VM.

To view the general troubleshooting guide for hibernation, check out [Troubleshoot hibernation in Azure](../hibernate-resume-troubleshooting.md).

## Unable to hibernate a Windows VM

If you're unable to hibernate a VM, first [check whether hibernation is enabled on the VM](../hibernate-resume-troubleshooting.md#unable-to-hibernate-a-vm).

If hibernation is enabled on the VM, check if hibernation is successfully enabled in the guest OS. You can check the status of the Hibernation extension to see if the extension was able to successfully configure the guest OS for hibernation.

:::image type="content" source="../media/hibernate-resume/provisioning-success-windows.png" alt-text="Screenshot of the status and status message reporting that provisioning succeeded for a Windows VM.":::

The VM instance view would have the final output of the extension:
```
"extensions": [
    {
      "name": "AzureHibernateExtension",
      "type": "Microsoft.CPlat.Core.WindowsHibernateExtension",
      "typeHandlerVersion": "1.0.2",
      "statuses": [
        {
          "code": "ProvisioningState/succeeded",
          "level": "Info",
          "displayStatus": "Provisioning succeeded",
          "message": "Enabling hibernate succeeded. Response from the powercfg command: \tThe hiberfile size has been set to: 17178693632 bytes.\r\n"
        }
      ]
    },
```

Additionally, confirm that hibernate is enabled as a sleep state inside the guest. The expected output for the guest should look like this.

```
C:\Users\vmadmin>powercfg /a
    The following sleep states are available on this system:
        Hibernate
        Fast Startup

    The following sleep states are not available on this system:
        Standby (S1)
            The system firmware does not support this standby state.

        Standby (S2)
            The system firmware does not support this standby state.

        Standby (S3)
            The system firmware does not support this standby state.

        Standby (S0 Low Power Idle)
            The system firmware does not support this standby state.

        Hybrid Sleep
            Standby (S3) isn't available.


```

If Hibernate isn't listed as a supported sleep state, there should be a reason associated with it, which should help determine why hibernate isn't supported. This occurs if guest hibernate isn't configured for the VM.

```
C:\Users\vmadmin>powercfg /a
    The following sleep states are not available on this system:
        Standby (S1)
            The system firmware does not support this standby state.

        Standby (S2)
            The system firmware does not support this standby state.

        Standby (S3)
            The system firmware does not support this standby state.

        Hibernate
            Hibernation hasn't been enabled.

        Standby (S0 Low Power Idle)
            The system firmware does not support this standby state.

        Hybrid Sleep
        Standby (S3) is not available.
            Hibernation is not available.

        Fast Startup
            Hibernation is not available.

```

If the extension or the guest sleep state reports an error, you'd need to update the guest configurations as per the error descriptions to resolve the issue. After fixing all the issues, you can validate that hibernation has been enabled successfully inside the guest by running  the 'powercfg /a' command - which should return Hibernate as one of the sleep states.
Also validate that the AzureHibernateExtension returns to a Succeeded state. If the extension is still in a failed state, then update the extension state by triggering [reapply VM API](/rest/api/compute/virtual-machines/reapply?tabs=HTTP)

>[!NOTE]
>If the extension remains in a failed state, you can't hibernate the VM.

Commonly seen issues where the extension fails.

| Issue | Action |
|--|--|
| Page file is in temp disk. Move it to OS disk to enable hibernation. | Move page file to the C: drive and trigger reapply on the VM to rerun the extension |
| Windows failed to configure hibernation due to insufficient space for the hiberfile | Ensure that C: drive has sufficient space. You can try expanding your OS disk, your C: partition size to overcome this issue. Once you have sufficient space, trigger the Reapply operation so that the extension can retry enabling hibernation in the guest and succeeds. |
| Extension error message: "A device attached to the system isn't functioning" | Ensure that C: drive has sufficient space. You can try expanding your OS disk, your C: partition size to overcome this issue. Once you have sufficient space, trigger the Reapply operation so that the extension can retry enabling hibernation in the guest and succeeds. |
| Hibernation is no longer supported after Virtualization Based Security (VBS) was enabled inside the guest | Enable Virtualization in the guest to get VBS capabilities along with the ability to hibernate the guest. [Enable virtualization in the guest OS.](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v#enable-hyper-v-using-powershell) |
| Enabling hibernate failed. Response from the powercfg command. Exit Code: 1. Error message: Hibernation failed with the following error: The request isn't supported. The following items are preventing hibernation on this system. The current Device Guard configuration disables hibernation. An internal system component disabled hibernation. Hypervisor | Enable Virtualization in the guest to get VBS capabilities along with the ability to hibernate the guest. To enable virtualization in the guest, refer to [this document](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v#enable-hyper-v-using-powershell) |

## Guest Windows VMs unable to hibernate

If a hibernate operation succeeds, the following events are seen in the guest: 
```
Guest responds to the hibernate operation (note that the following event is logged on the guest on resume)

    Log Name:      System
    Source:        Kernel-Power
    Event ID:      42
    Level:         Information
    Description:
    The system is entering sleep

```

If the guest fails to hibernate, then all or some of these events are missing.
Commonly seen issues: 

| Issue | Action |
|--|--|
| Guest fails to hibernate because Hyper-V Guest Shutdown Service is disabled. You can check this by running *sc query vmicshutdown*.  | [Ensure that Hyper-V Guest Shutdown Service isn't disabled](/virtualization/hyper-v-on-windows/reference/integration-services#hyper-v-guest-shutdown-service). Enabling this service should resolve the issue. |
| Guest fails to hibernate because Power Service is disabled. You can check this by running *sc query power*. | Ensure that Power Service isn't disabled. [Enabling this service should resolve the issue](/powershell/module/microsoft.powershell.management/set-service#example-2-change-the-startup-type-of-services). |
| Guest fails to hibernate because HVCI (Memory integrity) is enabled. | If Memory Integrity is enabled in the guest and you're trying to hibernate the VM, then ensure your guest is running the minimum OS build required to support hibernation with Memory Integrity. <br /> <br /> Win 11 22H2 – Minimum OS Build - 22621.2134 <br /> Win 11 21H1 - Minimum OS Build - 22000.2295 <br /> Win 10 22H2 - Minimum OS Build - 19045.3324 |

Logs needed for troubleshooting:

If you encounter an issue outside of these known scenarios, the following logs can help Azure troubleshoot the issue: 
- Relevant event logs on the guest: Microsoft-Windows-Kernel-Power, Microsoft-Windows-Kernel-General, Microsoft-Windows-Kernel-Boot.
- During a bug check, a guest crash dump is helpful.

## Unable to resume a Windows VM
When you start a VM from a hibernated state, you can use the VM instance view to get more details on whether the guest successfully resumed from its previous hibernated state or if it failed to resume and instead did a cold boot. 

VM instance view output when the guest successfully resumes: 
```
{
  "computerName": "myVM",
  "osName": "Windows 11 Enterprise",
  "osVersion": "10.0.22000.1817",
  "vmAgent": {
    "vmAgentVersion": "2.7.41491.1083",
    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": "Info",
        "displayStatus": "Ready",
        "message": "GuestAgent is running and processing the extensions.",
        "time": "2023-04-25T04:41:17.296+00:00"
      }
    ],
    "extensionHandlers": [
      {
        "type": "Microsoft.CPlat.Core.RunCommandWindows",
        "typeHandlerVersion": "1.1.15",
        "status": {
          "code": "ProvisioningState/succeeded",
          "level": "Info",
          "displayStatus": "Ready"
        }
      },
      {
        "type": "Microsoft.CPlat.Core.WindowsHibernateExtension",
        "typeHandlerVersion": "1.0.3",
        "status": {
          "code": "ProvisioningState/succeeded",
          "level": "Info",
          "displayStatus": "Ready"
        }
      }
    ]
  },  
  "extensions": [
    {
      "name": "AzureHibernateExtension",
      "type": "Microsoft.CPlat.Core.WindowsHibernateExtension",
      "typeHandlerVersion": "1.0.3",
      "substatuses": [
        {
          "code": "ComponentStatus/VMBootState/Resume/succeeded",
          "level": "Info",
          "displayStatus": "Provisioning succeeded",
          "message": "Last guest resume was successful."
        }
      ],
      "statuses": [
        {
          "code": "ProvisioningState/succeeded",
          "level": "Info",
          "displayStatus": "Provisioning succeeded",
          "message": "Enabling hibernate succeeded. Response from the powercfg command: \tThe hiberfile size has been set to: XX bytes.\r\n"
        }
      ]
    }
  ],
  "statuses": [
    {
      "code": "ProvisioningState/succeeded",
      "level": "Info",
      "displayStatus": "Provisioning succeeded",
      "time": "2023-04-25T04:41:17.8996086+00:00"
    },
    {
      "code": "PowerState/running",
      "level": "Info",
      "displayStatus": "VM running"
    }
  ]
}


```
If the Windows guest fails to resume from its previous state and cold boots, then the VM instance view response is:
```
  "extensions": [
    {
      "name": "AzureHibernateExtension",
      "type": "Microsoft.CPlat.Core.WindowsHibernateExtension",
      "typeHandlerVersion": "1.0.3",
      "substatuses": [
        {
          "code": "ComponentStatus/VMBootState/Start/succeeded",
          "level": "Info",
          "displayStatus": "Provisioning succeeded",
          "message": "VM booted."
        }
      ],
      "statuses": [
        {
          "code": "ProvisioningState/succeeded",
          "level": "Info",
          "displayStatus": "Provisioning succeeded",
          "message": "Enabling hibernate succeeded. Response from the powercfg command: \tThe hiberfile size has been set to: XX bytes.\r\n"
        }
      ]
    }
  ],
  "statuses": [
    {
      "code": "ProvisioningState/succeeded",
      "level": "Info",
      "displayStatus": "Provisioning succeeded",
      "time": "2023-04-19T17:18:18.7774088+00:00"
    },
    {
      "code": "PowerState/running",
      "level": "Info",
      "displayStatus": "VM running"
    }
  ]
}

```

## Windows guest events while resuming
If a guest successfully resumes, the following guest events are available: 
```
Log Name:      System
    Source:        Kernel-Power
    Event ID:      107
    Level:         Information
    Description:
    The system has resumed from sleep. 

```
If the guest fails to resume, all or some of these events are missing. To troubleshoot why the guest failed to resume, the following logs are needed: 
- Event logs on the guest: Microsoft-Windows-Kernel-Power, Microsoft-Windows-Kernel-General, Microsoft-Windows-Kernel-Boot.
- On bugcheck, a guest crash dump is needed.
