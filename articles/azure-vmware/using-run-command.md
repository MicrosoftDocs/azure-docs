---
title: Use Run Commands in Azure VMware Solution 
description: Learn about using run commands in Azure VMware Solution. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/09/2026
ms.custom: engagement-fy23
# Customer intent: As a cloud administrator, I want to use run commands in Azure VMware Solution so that I can perform operations that typically require elevated privileges efficiently and manage my virtual environment effectively.
---

# Use run commands in Azure VMware Solution

In Azure VMware Solution, vCenter Server has a built-in local user called *cloudadmin* assigned to the CloudAdmin role. The CloudAdmin role has vCenter Server [privileges](architecture-identity.md#vcenter-server-access-and-identity) that differ from other VMware cloud solutions and on-premises deployments. You can use a run command to perform operations that normally require elevated privileges through a collection of PowerShell cmdlets.

Azure VMware Solution supports the following operations:

- [Configure an external identity source](configure-identity-source-vcenter.md)
- [View and set storage policies](configure-storage-policy.md)
- [Deploy disaster recovery using JetStream](deploy-disaster-recovery-using-jetstream.md)
- [Use VMware HCX Run Commands](use-hcx-run-commands.md)

Additional Run Command packages include the following: Each of these Run Command Packages has a list of cmdlets allowing a customer to execute specific privileges operations: 

- `PureStorage.AzureNative.Tools`: Integrates Pure Storage arrays and workflows with Azure VMware Solution operations.
- `PureStorage.CBS.AVS`: Supports Pure Cloud Block Store appliance workflows for AVS environments.
- `Microsoft.AVS.VMFS`: Manages VMFS datastore lifecycle and related datastore operations.
- `Microsoft.AVS.NFS`: Manages NFS datastore workflows used for specialized validation and testing scenarios.
- `Microsoft.AVS.Management`: Provides general AVS operational and triage-focused management commands.
- `NetApp.CBS.AVS`: Supports NetApp Cloud Block Store appliance management tasks.
- `VMware.VCDA.AVS`: Manages Broadcom VMware Cloud Director Availability (VCDA) appliance workflows.
- `ZertoAVSModule`: Supports Zerto disaster recovery appliance management operations.

>[!NOTE]
>Run Commands are executed one at a time in the order submitted.

## Use Run Command

Run Command can be accessed from the Private Cloud Portal View under Operations.

:::image type="content" source="media/run-command/run-command-home-page.png" alt-text="Screenshot showing where to find the run command page from the private cloud portal view." lightbox="media/run-command/run-command-home-page.png":::

[Next you can execute a Run Command Cmdlet and check execution status](troubleshoot-run-command.md).
