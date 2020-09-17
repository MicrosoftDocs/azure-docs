---
title: Securing access to containers, directories, and files in Azure Data Lake Storage Gen2  | Microsoft Docs
description: Learn how to configure container, directory, and file-level access in accounts that have a hierarchical namespace.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 09/09/2020
ms.author: normesta
ms.reviewer: jamsbak
---

# Setup security

Intro goes here.

## Prerequisites

- To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A **general-purpose v2** storage account. see [Create a storage account](../common/storage-quickstart-create-account.md).

## Set up security heading

1. Ensure you have correct permissions

- Blob data owner if using an AD security principal.
- Contributor can work but only directories and files owned by that entity
- Access key also works. This gives you 'super-user' access, meaning full access to all operations on all resources, including setting owner and changing ACLs.

   > [!NOTE]
   > A guest user can't create a role assignment.

2. Organize security principals for access. See groups section of conceptual

    ACLs should be assigned to AAD groups rather than individual users or service principals. Additionally, nesting groups(groups within groups) can offer even more agility and flexibility as permissions evolve. There are two main reasons for this; i.) changing ACLs can take time to propagate if there are 1000s of files, and ii.) there is a limit of 32 ACLs entries per file or folder.

    32 ACLs (effectively 28 ACLs) per file, 32 ACLs (effectively 28 ACLs) per folder, default and access ACLs each.

Create security groups for the level of permissions you want for an object (typically a directory from what we have seen with our customers) and add them to the ACLs. For specific security principals you want to provide permissions, add them to the security group instead of creating specific ACLs for them. Following this practice will help you minimize the process of managing access for new identities – which would take a really long time if you want to add the new identity to every single file and folder in your container recursively. Let us take an example where you have a directory, /logs, in your data lake with log data from your server. You ingest data into this folder via ADF and also let specific users from the service engineering team upload logs and manage other users to this folder. In addition, you also have various Databricks clusters analyzing the logs. You will create the /logs directory and create two AAD groups LogsWriter and LogsReader with the following permissions. 
LogsWriter added to the ACLs of the /logs folder with rwx permissions.
LogsReader added to the ACLs of the /logs folder with r-x permissions.
The SPNs/MSIs for ADF as well as the users and the service engineering team can be added to the LogsWriter group.
The SPNs/MSIs for Databricks will be added to the LogsReader group.

3. Decide on what combination of RBAC and ACLs make sense for your scenario.
   See the RBAC vs. ACL article to understand the interplay. Also look at the scenarios section in that article.

1. Apply RBAC roles

   Perhaps include links to PowerShell and CLI approaches as well.

   To learn how to assign roles to security principals in the scope of your storage account, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-rbac-portal?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

   Note: RBAC assignments can take up to 5 minutes to propagate and take affect.

1. Set file and directory level permissions by using access control lists
 To set file and directory level permissions, see any of the following articles:

Perhaps break this out to specific sections of those docs and also feature the recursive ACL stuff as well.

| Environment | Article |
|--------|-----------|
|Azure Storage Explorer |[Use Azure Storage Explorer to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-explorer.md#managing-access)|
|.NET |[Use .NET to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-dotnet.md)|
|Java|[Use Java to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-java.md)|
|Python|[Use Python to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-python.md)|
|PowerShell|[Use PowerShell to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-powershell.md)|
|Azure CLI|[Use Azure CLI to manage directories, files, and ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-cli.md)|
|REST API |[Path - Update](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/update)|

> [!IMPORTANT]
> If the security principal is a *service* principal, it's important to use the object ID of the service principal and not the object ID of the related app registration. To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <Your App ID> --query objectId`. make sure to replace the `<Your App ID>` placeholder with the App ID of your app registration.


## Next steps

- [Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration.md)
- [Query acceleration SQL language reference](query-acceleration-sql-reference.md)
