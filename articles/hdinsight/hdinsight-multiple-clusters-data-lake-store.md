---
title: Multiple HDInsight clusters & one Azure Data Lake Storage account
description: Learn how to use more than one HDInsight cluster with a single Data Lake Storage account
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/18/2019
---

# Use multiple HDInsight clusters with an Azure Data Lake Storage account

Starting with HDInsight version 3.5, you can create HDInsight clusters with  Azure Data Lake Storage accounts as the default filesystem.
Data Lake Storage supports unlimited storage that makes it ideal not only for hosting large amounts of data; but also for hosting multiple HDInsight clusters that share a single Data Lake Storage Account. For instructions on how to create an HDInsight cluster with Data Lake Storage as the storage, see [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md).

This article provides recommendations to the Data Lake Storage administrator for setting up a single and shared Data Lake Storage Account that can be used across multiple **active** HDInsight clusters. These recommendations apply to hosting multiple secure as well as non-secure Apache Hadoop clusters on a shared Data Lake Storage account.

## Data Lake Storage file and folder level ACLs

The rest of this article assumes that you have a good knowledge of file and folder level ACLs in Azure Data Lake Storage, which is described in detail at [Access control in Azure Data Lake Storage](../data-lake-store/data-lake-store-access-control.md).

## Data Lake Storage setup for multiple HDInsight clusters

Let us take a two-level folder hierarchy to explain the recommendations for using multiple HDInsight clusters with a Data Lake Storage account. Consider you have a Data Lake Storage account with the folder structure **/clusters/finance**. With this structure, all the clusters required by the Finance organization can use /clusters/finance as the storage location. In the future, if another organization, say Marketing, wants to create HDInsight clusters using the same Data Lake Storage account, they could create /clusters/marketing. For now, let's just use **/clusters/finance**.

To enable this folder structure to be effectively used by HDInsight clusters, the Data Lake Storage administrator must assign appropriate permissions, as described in the table. The permissions shown in the table correspond to Access-ACLs, and not Default-ACLs.

|Folder  |Permissions  |Owning user  |Owning group  | Named user | Named user permissions | Named group | Named group permissions |
|---------|---------|---------|---------|---------|---------|---------|---------|
|/ | rwxr-x--x  |admin |admin  |Service principal |--x  |FINGRP   |r-x         |
|/clusters | rwxr-x--x |admin |admin |Service principal |--x  |FINGRP |r-x         |
|/clusters/finance | rwxr-x--t |admin |FINGRP  |Service principal |rwx  |-  |-     |

In the table,

- **admin** is the creator and administrator of the Data Lake Storage account.
- **Service principal** is the Azure Active Directory (AAD) service principal associated with the account.
- **FINGRP** is a user group created in AAD that contains users from the Finance organization.

For instructions on how to create an AAD application (that also creates a Service Principal), see [Create an AAD application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal). For instructions on how to create a user group in AAD, see [Managing groups in Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

Some key points to consider.

- The two level folder structure (**/clusters/finance/**) must be created and provisioned with appropriate permissions by the Data Lake Storage admin **before** using the storage account for clusters. This structure isn't created automatically while creating clusters.
- The example above recommends setting the owning group of **/clusters/finance** as **FINGRP** and permitting **r-x** access to FINGRP to the entire folder hierarchy starting from the root. This ensures that the members of FINGRP can navigate the folder structure starting from root.
- In the case when different AAD Service Principals can create clusters under **/clusters/finance**, the sticky-bit (when set on the **finance** folder) ensures that folders created by one Service Principal cannot be deleted by the other.
- Once the folder structure and permissions are in place, HDInsight cluster creation process creates a cluster-specific storage location under **/clusters/finance/**. For example, the storage for a cluster with the name fincluster01 could be **/clusters/finance/fincluster01**. The ownership and permissions for the folders created by HDInsight cluster is shown in the table here.

    |Folder  |Permissions  |Owning user  |Owning group  | Named user | Named user permissions | Named group | Named group permissions |
    |---------|---------|---------|---------|---------|---------|---------|---------|
    |/clusters/finanace/ fincluster01 | rwxr-x---  |Service Principal |FINGRP  |- |-  |-   |-  |

## Recommendations for job input and output data

We recommend that input data to a job, and the outputs from a job be stored in a folder outside **/clusters**. This ensures that even if the cluster-specific folder is deleted to reclaim some storage space, the job inputs and outputs are still available for future use. In such a case, ensure that the folder hierarchy for storing the job inputs and outputs allows appropriate level of access for the Service Principal.

## Limit on clusters sharing a single storage account

The limit on the number of clusters that can share a single Data Lake Storage account depends on the workload being run on those clusters. Having too many clusters or very heavy workloads on the clusters that share a storage account might cause the storage account ingress/egress to get throttled.

## Support for Default-ACLs

When creating a Service Principal with named-user access (as shown in the table above), we recommend **not** adding the named-user with a default-ACL. Provisioning named-user access using default-ACLs results in the assignment of 770 permissions for owning-user, owning-group, and others. While this default value of 770 doesn't take away permissions from owning-user (7) or owning-group (7), it takes away all permissions for others (0). This results in a known issue with one particular use-case that is discussed in detail in the [Known issues and workarounds](#known-issues-and-workarounds) section.

## Known issues and workarounds

This section lists the known issues for using HDInsight with Data Lake Storage, and their workarounds.

### Publicly visible localized Apache Hadoop YARN resources

When a new Azure Data Lake Storage account is created, the root directory is automatically provisioned with Access-ACL permission bits set to 770. The root folder’s owning user is set to the user that created the account (the Data Lake Storage admin) and the owning group is set to the primary group of the user that created the account. No access is provided for "others".

These settings are known to affect one specific HDInsight use-case captured in [YARN 247](https://hwxmonarch.atlassian.net/browse/YARN-247). Job submissions could fail with an error message similar to this:

    Resource XXXX is not publicly accessible and as such cannot be part of the public cache.

As stated in the YARN JIRA linked earlier, while localizing public resources, the localizer validates that all the requested resources are indeed public by checking their permissions on the remote file-system. Any LocalResource that doesn't fit that condition is rejected for localization. The check for permissions, includes read-access to the file for "others". This scenario doesn't work out-of-the-box when hosting HDInsight clusters on Azure Data Lake, since Azure Data Lake denies all access to "others" at root folder level.

#### Workaround

Set read-execute permissions for **others** through the hierarchy, for example,  at **/**, **/clusters** and **/clusters/finance** as shown in the table above.

## See also

- [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md)
- [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](hdinsight-hadoop-use-data-lake-storage-gen2.md)
