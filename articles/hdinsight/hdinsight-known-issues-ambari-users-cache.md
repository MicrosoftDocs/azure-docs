---
title: Switch users through the Ambari UI
description: Known issue affecting HDInsight 5.1 clusters.
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 04/05/2024
---

# Switch Users in Ambari UI

**Issue published date**: April, 02 2024.

In the latest Azure HDInsight release, there's an issue while trying to switch users in Ambari UI, where the new added users are unable to log in.

> [!IMPORTANT]  
> This issue affects HDInsight 5.1 clusters and both Edge and Chrome browsers. 

## Recommended steps

1. Sign-in in Ambari UI
2. Add the users by following the [HDInsight documentation](./hdinsight-authorize-users-to-ambari.md#add-users)
3. To switch to a different user, clear the browser cache.
4. Lon in into Ambari ui with different user on the same browser.
5. Alternatively, users can use Private Browser on incognito window.


## Resources

- [Authorize users for Apache Ambari Views](./hdinsight-authorize-users-to-ambari.md).
- [Supported HDInsight versions](./hdinsight-component-versioning.md#supported-hdinsight-versions).
