---
title: Apache Ambari directory alerts in Azure HDInsight
description: Discussion and analysis of possible reasons and solutions for Apache Ambari directory alerts in HDInsight.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/07/2023
---

# Scenario: Apache Ambari directory alerts in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

You receive errors from Apache Ambari that are similar to:

```
1/1 local-dirs have errors: [ /mnt/resource/hadoop/yarn/local : Cannot create directory: /mnt/resource/hadoop/yarn/local ]
1/1 log-dirs have errors: [ /mnt/resource/hadoop/yarn/log : Cannot create directory: /mnt/resource/hadoop/yarn/log ]
```

## Cause

The mentioned directories from Ambari alert are missing on affected worker node(s).

## Resolution

Manually create missing directories on the affected worker node(s).

1. SSH to the relevant worker node.

1. Get root user: `sudo su`.

1. Recursively create needed directories.

1. Change owner and group for these directories.

    ```bash
    chown -R yarn /mnt/resource/hadoop/yarn/local
    chgrp -R hadoop /mnt/resource/hadoop/yarn/local
    chown -R yarn /mnt/resource/hadoop/yarn/log
    chgrp -R hadoop /mnt/resource/hadoop/yarn/log
    ```

1. From Apache Ambari UI, disable, and then enable alert.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
