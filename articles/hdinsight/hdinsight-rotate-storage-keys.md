---
title: Update Azure Storage account access key in Azure HDInsight 
description: Learn how to update Azure Storage account access key in Azure HDInsight cluster.
ms.service: hdinsight
ms.topic: how-to
ms.date: 04/26/2023
---

# Update Azure storage account access keys in HDInsight cluster

In this article, you learn how to rotate Azure Storage account access keys for the primary or secondary storage accounts in Azure HDInsight.

>[!CAUTION]
> Directly rotating the access key on the storage side will make the HDInsight cluster inaccessible.

## Prerequisites

* We're going to use an approach to rotate the primary and secondary access keys of the storage account in a staggered, alternating fashion to ensure HDInsight cluster is accessible throughout the process.

    Here's an example of how to use primary and secondary storage access keys and set up rotation policies on them:
    1. Use access key1 on the storage account when creating HDInsight cluster.
    1. Set up rotation policy for access key2 every N day. As part of this rotation update, HDInsight to use access key1 and then rotate access key2 on storage account.
    1. Set up rotation policy for access key1 every N/2 day. As part of this rotation update, HDInsight to use access key2 and then rotate access key1 on storage account.
    1. With approach access key1 will be rotated N/2, 3N/2 etc. days and access key2 will be rotated N, 2N, 3N etc. days.

* To set up periodic rotation of storage account keys, see [Automate the rotation of a secret](../key-vault/secrets/tutorial-rotation-dual.md).

## Update storage account access keys

Use [Script Action](hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster) to update the keys with the following considerations:

|Property | Value |
|---|---|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/update-storage-account-v01.sh`|
|Node type(s)|Head|
|Parameters|`ACCOUNTNAME` `ACCOUNTKEY` `-p` (optional)|

* `ACCOUNTNAME` is the name of the storage account on the HDInsight cluster.
* `ACCOUNTKEY` is the access key for `ACCOUNTNAME`.
* `-p` is optional. If specified, the key isn't encrypted and is stored in the core-site.xml file as plain text.

## Known issues

The preceding script directly updates the access key on the cluster side only and doesn't renew a copy on the HDInsight Resource provider side. Therefore, the script action hosted in the storage account will fail after the access key is rotated.

Workaround:
Use [SAS URIs](hdinsight-storage-sharedaccesssignature-permissions.md) for script actions or make the scripts publicly accessible.

## Next steps

* [Add more storage accounts](hdinsight-hadoop-add-storage.md)
