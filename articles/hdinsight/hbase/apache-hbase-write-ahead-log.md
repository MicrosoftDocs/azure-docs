---
title: Apache HBase write ahead log
description: Provides an overview of the Apache HBase write ahead log feature and how its used in Azure HDInsight
services: hdinsight
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.topic: conceptual
ms.date: 3/13/2019

---
# Apache HBase Write Ahead Log

The Write Ahead Log (WAL) records all changes to data in HBase, to file-based storage. Under normal operations, the WAL is not needed because data changes move from the MemStore to StoreFiles. However, if a RegionServer crashes or becomes unavailable before the MemStore is flushed, the WAL ensures that the changes to the data can be replayed. If writing to the WAL fails, the entire operation to modify the data fails.

# Write ahead log feature in Azure HDInsight

Bound by latency of underlying storage – then is slows down low latency architecture
Consistency is not great – can be hit or miss
Soln: instead of WAL > Blob, WAL > managed disks. Premium managed disks provide low latency storage, replicated across multiple disks
Also introducing premium blob with much faster reads

## Next steps

* Official Apache HBase documentation on the [write ahead log feature](https://hbase.apache.org/book.html#wal).