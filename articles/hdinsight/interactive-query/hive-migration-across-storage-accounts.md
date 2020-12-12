---
title: Hive Workload Migration across Storage Accounts
description: Hive workload migration across Storage Accounts
author: kevxmsft
ms.author: kevx
ms.reviewer: 
ms.service: hdinsight
ms.topic: how-to
ms.date: 12/11/2020
---

# Hive Workload Migration across Storage Accounts

For HDInsight 4.0, see [Hive export/import](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+ImportExport). Script [exporthive_hdi_4_0.sh](https://hdiconfigactions.blob.core.windows.net/hivemetastoreschemaupgrade/exporthive_hdi_4_0.sh) automatically generates export and import statements.

The export storage location must be accessible to both export and import clusters.

See article [Add additional Storage Accounts to HDInsight](../hdinsight-hadoop-add-storage.md).

For HDInsight 3.6, Hive export/import is not supported for ACID tables.

If export/import fails, here are steps you can take to mimic Hive export and import for each table `t`:

* Export table

    1. `create external table t_export as select * from t;`
    1. save DDL of t
    1. save DDL of t_export

    *You can get the DDL with `show create table`. Use `--outputformat=tsv2` for `beeline`.*

* Import table

    1. execute DDL of t, specifying target LOCATION
    1. execute DDL of t_export
    1. `insert overwrite table t select * from t_export`;

    *HDInsight 3.6 Hive requires partition clause when inserting to partitioned table.*
