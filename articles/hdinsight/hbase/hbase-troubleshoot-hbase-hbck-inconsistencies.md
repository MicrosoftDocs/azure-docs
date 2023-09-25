---
title: hbase hbck returns inconsistencies in Azure HDInsight
description: hbase hbck returns inconsistencies in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 08/28/2022
---

# Scenario: `hbase hbck` command returns inconsistencies in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters. If you are using hbase-2.x, see [How to use Apache HBase HBCK2 tool](./how-to-use-hbck2-tool.md)

## Issue: Region is not in `hbase:meta`

Region xxx on HDFS, but not listed in `hbase:meta` or deployed on any region server.

### Cause

Varies.

### Resolution

1. Fix the meta table by running:

    ```
    hbase hbck -ignorePreCheckPermission –fixMeta
    ```

1. Assign regions to RegionServers by running:

    ```
    hbase hbck -ignorePreCheckPermission –fixAssignment
    ```
---

## Issue: Region is offline

Region xxx not deployed on any RegionServer. This means the region is in `hbase:meta`, but offline.

### Cause

Varies.

### Resolution

Bring regions online by running:

```
hbase hbck -ignorePreCheckPermission –fixAssignment
```

Alternatively, run `assign <region-hash>` on hbase-shell to force to assign this region

---

## Issue: Regions have the same start/end keys

### Cause

Varies.

### Resolution

Manually merge those overlapped regions. Go to HBase HMaster Web UI table section, select the table link, which has the issue. You will see start key/end key of each region belonging to that table. Then merge those overlapped regions. In HBase shell, do `merge_region 'xxxxxxxx','yyyyyyy', true`. For example:

```
RegionA, startkey:001, endkey:010,

RegionB, startkey:001, endkey:080,

RegionC, startkey:010, endkey:080.
```

In this scenario, you need to merge RegionA and RegionC and get RegionD with the same key range as RegionB, then merge RegionB and RegionD. xxxxxxx and yyyyyy are the hash string at the end of each region name. Be careful here not to merge two discontinuous regions. After each merge, like merge A and C, HBase will start a compaction on RegionD. Wait for the compaction to finish before doing another merge with RegionD. You can find the compaction status on that region server page in HBase HMaster UI.

---

## Issue: Can't load `.regioninfo`

Can't load `.regioninfo` for region `/hbase/data/default/tablex/regiony`.

### Cause

This is most likely due to region partial deletion when RegionServer crashes or VM reboots. Currently, the Azure Storage is a flat blob file system and some file operations are not atomic.

### Resolution

Manually clean up these remaining files and folders:

1. Execute `hdfs dfs -ls /hbase/data/default/tablex/regiony` to check what folders/files are still under it.

1. Execute `hdfs dfs -rmr /hbase/data/default/tablex/regiony/filez` to delete all child files/folders

1. Execute `hdfs dfs -rmr /hbase/data/default/tablex/regiony` to delete the region folder.

---

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
