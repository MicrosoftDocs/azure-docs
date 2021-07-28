---
title: Run commands in Azure VMware Solution
description: Learn about using run commands in Azure VMware Solution. 
ms.topic: conceptual 
ms.date: 08/15/2021
---


# Run commands in Azure VMware Solution

In Azure VMware Solution, the CloudAdmin role gives you access to vCenter. You can [view the privileges granted](concepts-identity.md#view-the-vcenter-privileges) to the Azure VMware Solution CloudAdmin role on your Azure VMware Solution private cloud vCenter. Run commands are a collection of PowerShell cmdlets that you do certain operations on vCenter, which requires elevated privileges. 

Azure VMware Solution supports the following operations:

- [Install and uninstall JetStream DR solution](deploy-disaster-recovery-using-jetstream.md) - 

- [Configure an external indentity source](tutorial-configure-identity-source.md) - 

- [View and edit the storage policy](concepts-storage.md#storage-policies-and-fault-tolerance) - 





## View the status of a task

<!-- intro paragraph --> 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Run execution status**.

   You can sort the task by the execution name, package name, package version, command name, start time, end time, and status.  

   :::image type="content" source="media/run-command/run-execution-status.png" alt-text="Screenshot showing Run execution status tab." lightbox="media/run-command/run-execution-status.png":::

1. Select the execution task you want to view.

   :::image type="content" source="media/run-command/run-execution-status-example.png" alt-text="Screenshot showing an example of a run execution task.":::

   You can view more details about the task including the output, errors, warnings, and information.

   - **Details** - 

   - 






1. Provided the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. Default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **remove_externalIdentity**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.





## Cancel or delete a job

<!-- add your content here -->

### Method 1




### Method 2





## Next steps
<!-- Add a context sentence for the following links -->
- 

