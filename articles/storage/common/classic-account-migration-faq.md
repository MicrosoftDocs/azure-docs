---
title: FAQ on migration from classic accounts to Azure Resource Manager
titleSuffix: Azure Storage
description: FAQ - migrate your classic storage accounts to the Azure Resource Manager deployment model. All classic accounts must be migrated by August 31, 2024.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/17/2023
ms.author: tamram
ms.subservice: common
---

# FAQ on migration from classic accounts to Azure Resource Manager

Borrow from VM article

## FAQ

What is affected?
Insert VM doc link

How do I migrate my classic storage accounts to Resource Manager?
If you have a classic VM attached to your account, migrate the classic VMs first. Classic storage accounts must be migrated after classic VM is migrated. Migration can be done either using the Azure portal, with PowerShell or with Azure CLI.
1.	Migrate using PowerShell
2.	Migrate using Azure CLI
3.	Migrate using Azure portal

What is the official date classic storage accounts will be cut off from creation?
Subscriptions created after August 2022 will no longer be able to create classic storage accounts. However, any existing subscription before August 2022 can continue to create and manage classic storage resources until the retirement date of 31 August 2024.
What happens to existing classic storage accounts after 31 August 2024?
Once the deadline arrives you will no longer be able to access your classic storage accounts.
Can Microsoft migrate this data for me?
No, Microsoft cannot migrate user's data on their behalf. Users will have to use the self-serve options listed above.
What is the downtime when migrating my storage account from Classic to Resource Manager?
There is no downtime to migrate classic storage account to Resource Manager. However, there is downtime for other scenarios linked to classic VM Migration. Also, during the migration, management/control plane operations will not be available but operations can still be performed at the data plane level.
Will any connection strings/access keys generated pre-migration continue to work post-migration/when the migration has completed?
Yes, all connection strings/access keys will continue to work as they would pre-migration. No actions will need to be taken to preserve the access keys during the migration
Would my access key be regenerated after migration?
No, as stated above, the access key(s) will remain in place as they were before the migration.
Is there an SLA in place in case of an issue during the migration?
Most issues will be caught in the validation phase. Both copies will be in the prepare phase. Once the migration is in the Prepare phase, it will not fail in the Commit stage. So, there is no need for an SLA in this process
Can additional verbose logging be added as part of the migration process?
No, migration is a service that doesn’t have capabilities to provide additional logging. It is not a standalone tool with the ability to provide additional logging. 
Will my storage account be V1 or V2 after the migration process?
Your storage account will be V1 after the migration process completes.
During the Prepare step, are all data requests routed through ASM or ARM?
Data plane operations are not routed through either ASM or ARM. 
Will there be a difference in cost between classic and the service that it is migrated to (ARM)?
No cost differences. But billing will show as microsoft.storage instead of classic.storage
What is an example of an incompatibility when migrating my Classic Storage Account to ARM?
When there is a dependence on ASM for management plane operations. An application uses classic account APIs and this dependency must be changed. An example would be if a customer is creating a classic account in code, those parts of the code will need to be updated because ARM is now in place. The new APIs will now be called in code. Accessing data or data plane operations will not need to be changed, only management operations (such as creating and deleting storage accounts). 
Will the URL of the storage account remain the same post-migration?


## See also
