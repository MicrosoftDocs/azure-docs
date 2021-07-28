---
title: Tutorial - Configure storage policy
description:  Learn how to configure storage policy for your Azure VMware Solution virtual machines.
ms.topic: tutorial
ms.date: 08/15/2021

#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Configure storage policy




In this tutorial, you learn how to:

> [!div class="checklist"]
> * List all existing storage policies
> * Set storage policy on a VM




## Prerequisites

- Establish connectivity from your on-premises network to your private cloud.

- If you have AD with SSL, download the certificate for AD authentication and upload it to an Azure Storage account as a blob storage.  You must [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md). 

- If you use FQDN, enable DNS resolution on your on-premises AD.

 

## List storage policies

You'll run the `Get-StoragePolicy` cmdlet to list all storage policies for VMs to use.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Get-StoragePolicies**.

   :::image type="content" source="media/run-command/run-command-overview-storage-policy.png" alt-text="Screenshot showing how to access the storage policy run commands available." lightbox="media/run-command/run-command-overview-storage-policy.png":::

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-storage-policy.png" alt-text="Screenshot showing how to list storage policies available. ":::
   
   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Job retention period. The cmdlet output will be stored for these many days. Default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute.  |
   | **Timeout**  | The period after which a cmdlet will exit if a certain task is taking too long to finish.  |

1. Check **Notifications** to see the progress.




## Set storage policy on VM

You'll run the `Set-StoragePolicy` cmdlet to remove all existing external identity sources in bulk. 

1. Select **Run command** > **Packages** > **Set-StoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-set-storage-policy.png" alt-text="Screenshot showing how to set the storage policy. ":::

   | **Field** | **Value** |
   | --- | --- |
   | **StoragePolicyName** |  |
   | **VMName** |  |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. Default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **remove_externalIdentity**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button]()

