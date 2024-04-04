---
title: Switch users through the Ambari UI
description: Known issue affecting image version 5.1.3000.0.2401030422
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 02/22/2024
---

# Switch Users in Ambari UI

**Issue published date**: April, 2nd 2024

In the latest Azure HDInsight release, there is an issue while trying to switch users in Ambari UI, where the new added users are unable to log-in.

> [!IMPORTANT]  
> This issue affects clusters with image version 5.1.3000.0.2308052231 and both Edge and Chrome browsers. Learn how to [view the image version of an HDInsight cluster](./view-hindsight-cluster-image-version.md). 

## Recommended steps

1. Sign-in in Ambari UI
2. Add the users by following the [HDInsight documentation](https://learn.microsoft.com/en-us/azure/hdinsight/hdinsight-authorize-users-to-ambari#add-users)
3. To switch to a different user, clear the browser cache.
4. Lon in into ambari ui with different user on the same browser.
5. Alternatively, users can use Private Browser on incognito window.


## Resources

- [Authorize users for Apache Ambari Views](https://learn.microsoft.com/en-us/azure/hdinsight/hdinsight-authorize-users-to-ambari)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
