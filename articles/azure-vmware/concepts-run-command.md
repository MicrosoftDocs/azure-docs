---
title: Concepts - Run commands in Azure VMware Solution 
description: Learn about using run commands in Azure VMware Solution. 
ms.topic: conceptual 
ms.date: 08/23/2021
---


# Run commands in Azure VMware Solution

In Azure VMware Solution, you'll get vCenter access with CloudAdmin role. You can [view the privileges granted](concepts-identity.md#view-the-vcenter-privileges) to the Azure VMware Solution CloudAdmin role on your Azure VMware Solution private cloud vCenter. Run commands are a collection of PowerShell cmdlets that you do certain operations on vCenter, which requires elevated privileges. 

Azure VMware Solution supports the following operations:


- [Configure an external identity source](tutorial-configure-identity-source-vcenter.md)

- [View and edit the storage policy](tutorial-configure-storage-policy.md) 


## View the status of a task

You can view the status of any run command executed including the output, errors, warnings, and information.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Run execution status**.

   You can sort the task by the execution name, package name, package version, command name, start time, end time, and status.  

   :::image type="content" source="media/run-command/run-execution-status.png" alt-text="Screenshot showing Run execution status tab." lightbox="media/run-command/run-execution-status.png":::

1. Select the execution task you want to view.

   :::image type="content" source="media/run-command/run-execution-status-example.png" alt-text="Screenshot showing an example of a run execution task.":::

   You can view more details about the task including the output, errors, warnings, and information.

   - **Details** - Shows the summary of the task details, such as the name of the task, status, package, and command name ran. 

   - **Output** - Shows the output of the cmdlet.  Not all cmdlets have output.

      :::image type="content" source="media/run-command/run-execution-status-example-output.png" alt-text="Screenshot showing the output of a run execution task.":::

   - **Error** - Shows any errors encountered during the execution of the cmdlet. The minimal requirements for the script not met resulting in the task failing.   

      :::image type="content" source="media/run-command/run-execution-status-example-error.png" alt-text="Screenshot showing the errors detected during the execution of a task.":::

   - **Warning** - Shows any warnings encountered during the execution of the cmdlet.  The minimal requirements were met but the environment changed during execution. For example, the VM was rebooted during execution triggering the cmdlet to stop resulting in the task failing. 

      :::image type="content" source="media/run-command/run-execution-status-example-warning.png" alt-text="Screenshot showing the warnings detected during the execution of a task.":::

   - **Information** - Shows the overall real-time progress of the cmdlet as it runs. 

      :::image type="content" source="media/run-command/run-execution-status-example-information.png" alt-text="Screenshot showing the overall real-time progress of the cmdlet as it runs.":::



## Cancel or delete a job



### Method 1

>[!NOTE]
>Method 1 is irreversible.

1. Select **Run command** > **Run execution status** and then select the job you want to cancel.

   :::image type="content" source="media/run-command/run-execution-cancel-delete-job-method-1.png" alt-text="Screenshot showing how to cancel and delete a run command.":::

2. Select **Yes** to cancel and remove the job for all users.



### Method 2

1. Select **Run command** > **Packages** > **Run execution status**.

2. Select the **More** (...) button of the job you want to cancel and delete.

   :::image type="content" source="media/run-command/run-execution-cancel-delete-job-method-2.png" alt-text="Screenshot showing how to cancel and delete a run command using the ellipsis.":::

3. Select **Yes** to cancel and remove the job for all users.



## Next steps

Now that you've learned about the Run command concepts, you can use the Run command feature to:

- [Configure storage policy](tutorial-configure-storage-policy.md) - Each VM deployed to a vSAN datastore is assigned at least one VM storage policy. You can assign a VM storage policy in an initial deployment of a VM or when you perform other VM operations, such as cloning or migrating.

- [Configure external identity source for vCenter](tutorial-configure-identity-source-vcenter.md) - vCenter has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). With the Run command feature, you can configure Active Directory over LDAP or LDAPS for vCenter as an external identity source.


