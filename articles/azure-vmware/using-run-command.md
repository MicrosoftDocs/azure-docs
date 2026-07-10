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
- [Deploy disaster recovery by using JetStream](deploy-disaster-recovery-using-jetstream.md)
- [Use VMware HCX run commands](use-hcx-run-commands.md)

Run commands are executed one at a time in the submitted order.

## View the status of an executed run command

You can view the status of any executed run command, including the output, errors, warnings, and information logs of the cmdlets.

1. Sign in to the [Azure portal](https://portal.azure.com).

   > [!NOTE]
   > If necessary for your situation, you can use the [Azure US Government portal](https://portal.azure.us/).

1. Select **Run command** > **Run execution status**.

   You can sort by the various columns by selecting each column.  

   :::image type="content" source="media/run-command/run-execution-status.png" alt-text="Screenshot that shows the tab for the execution status of run commands." lightbox="media/run-command/run-execution-status.png":::

1. Select the executed run command that you want to view. A pane opens with details about the execution and other tabs for the various types of output that the cmdlet generated:

   - **Details**. Summary of the execution details, such as the name, status, package, cmdlet name, and error if the command failed.

     :::image type="content" source="media/run-command/run-execution-status-example.png" alt-text="Screenshot that shows details of an executed run command.":::

   - **Output**. Messages in cmdlet output, which can include progress or the result of the operation. Not all cmdlets have output.

     :::image type="content" source="media/run-command/run-execution-status-example-output.png" alt-text="Screenshot that shows the output of a run execution.":::

   - **Error**. Error messages generated during execution of the cmdlet, in addition to the terminating error message on the **Details** tab.

     :::image type="content" source="media/run-command/run-execution-status-example-error.png" alt-text="Screenshot that shows the errors detected during the execution of a cmdlet.":::

   - **Warning**. Warning messages generated during execution of the cmdlet.

     :::image type="content" source="media/run-command/run-execution-status-example-warning.png" alt-text="Screenshot that shows the warnings detected during the execution of a cmdlet.":::

   - **Information**. Progress and diagnostic messages generated during execution of the cmdlet.

     :::image type="content" source="media/run-command/run-execution-status-example-information.png" alt-text="Screenshot that shows the overall progress of the cmdlet as it runs.":::

## Cancel and delete a job

### Method 1: Command bar

This method attempts to cancel the execution of a run command, and then deletes the command upon completion.

> [!IMPORTANT]
> This method is irreversible.

1. Select **Run command** > **Run execution status**, and then select the job that you want to cancel and delete.

1. On the command bar, select **Cancel + delete**.

   :::image type="content" source="media/run-command/run-execution-cancel-delete-job-method-1.png" alt-text="Screenshot that shows the option for canceling and deleting a run command.":::

1. Select **Yes** to cancel and remove the job for all users.

### Method 2: Ellipsis

1. Select **Run command** > **Packages** > **Run execution status**.

1. Select the ellipsis (**...**) for the job that you want to cancel and delete. Then select **Cancel + delete**.

   :::image type="content" source="media/run-command/run-execution-cancel-delete-job-method-2.png" alt-text="Screenshot that shows how to cancel and delete a run command by using the ellipsis.":::

1. Select **Yes** to cancel and remove the job for all users.

## Related content

Now that you've learned about the concepts of run commands, you can use the feature to:

- [Configure a storage policy](configure-storage-policy.md). Each virtual machine (VM) deployed to a vSAN datastore is assigned a vSAN storage policy. You can assign a vSAN storage policy in an initial deployment of a VM or when you do other VM operations, such as cloning or migrating.

- [Configure an external identity source for vCenter Server](configure-identity-source-vcenter.md). Configure Active Directory over LDAP or LDAPS for vCenter Server to enable the use of an external identity source. Then, you can add groups from the external identity source to the CloudAdmin role.

- [Deploy disaster recovery by using JetStream](deploy-disaster-recovery-using-jetstream.md). Store data directly to a recovery cluster in vSAN. The data is captured through I/O filters that run within vSphere. The underlying vSphere datastore can be VMFS, vSAN, vVol, or any supported hyperconverged infrastructure (HCI) platform.
