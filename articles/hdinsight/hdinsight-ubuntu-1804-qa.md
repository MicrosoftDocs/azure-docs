---
title: Azure HDInsight Ubuntu 18.04 update
description: Learn about Azure HDInsight Ubuntu 18.04 OS changes.
ms.service: hdinsight
ms.topic: conceptual
ms.author: nijelsf
author: reachnijel
ms.date: 07/18/2022
---

# HDInsight Ubuntu 18.04 OS update

This article provides more details for HDInsight Ubuntu 18.04 OS update and potential changes that are needed.

## Update overview

HDInsight has started rolling out the new HDInsight 4.0 cluster image running on Ubuntu 18.04 in May 2021. Newly created HDInsight 4.0 clusters will run on Ubuntu 18.04 by default once available. Existing clusters on Ubuntu 16.04 will run as is with full support.

HDInsight 3.6 will continue to run on Ubuntu 16.04. It will reach the end of standard support by 30 June 2021, and will change to Basic support starting on 1 July 2021. For more information about dates and support options, see [Azure HDInsight versions](./hdinsight-component-versioning.md). Ubuntu 18.04 won't be supported for HDInsight 3.6. If you’d like to use Ubuntu 18.04, you’ll need to migrate your clusters to HDInsight 4.0. Spark 3.0 with HDInsight 4.0 is available only on Ubuntu 16.04. Spark 3.1 with HDInsight 4.0 will be shipping soon and will be available on Ubuntu 18.04.   

Drop and recreate your clusters if you’d like to move existing clusters to Ubuntu 18.04. Plan to create or recreate your cluster. 

## Script actions changes

HDInsight script actions are used to install extra components and change configuration settings. A script action is a Bash script that runs on the nodes in an HDInsight cluster.

There might be some potential changes you need to make for your script actions.

**Change each instance of `xenial` to `bionic` when grabbing your packages wherever needed:**

For example:
- Update `http://packages.treasuredata.com/3/ubuntu/xenial/ xenial contrib` to `http://packages.treasuredata.com/3/ubuntu/bionic/ bionic contrib`.
- Update `http://azure.archive.ubuntu.com/ubuntu/ xenial main restricted` to `http://azure.archive.ubuntu.com/ubuntu/ bionic main restricted`.

**Some package versions are not present for bionic:** 

For example, [Node.js version 4.x](https://deb.nodesource.com/node_4.x/dists/) is not present in the bionic repo. [Node.js version 12.x](https://deb.nodesource.com/node_12.x/dists/bionic/) is present.

Scripts that install old versions that are not present for bionic need to be updated to later versions.

**/etc/rc.local does not exist by default in 18.04:**

Some scripts use `/etc/rc.local` for service startups but it doesn't exist by default in Ubuntu 18.04. It should be converted to a proper systemd unit. 

**Base OS packages have been updated:**

If your scripts rely on an older version package in Ubuntu 16.04, it may not work. SSH to your cluster node and run `dpkg --list` on your cluster node to show the details of all installed packages.
 
**In general Ubuntu 18.04 has stricter rules than 16.04.**

## Custom Applications
Some [third party applications](./hdinsight-apps-install-applications.md) can be installed to the HDInsight cluster. Those applications may not work well with Ubuntu 18.04. To reduce the risk of breaking changes, HDInsight won't roll out the new image for subscriptions that had installed custom applications since 25 February 2021. If you want to try the new image with your test subscriptions, open a support ticket to enable your subscription.

## Edge nodes
With the new image, the OS for cluster edge nodes will also be updated to Ubuntu 18.04. Your existing clients need to be tested with the Ubuntu 18.04. To reduce the risk of breaking changes, HDInsight won't roll out the new image for subscriptions that had used edge nodes since 25 February 2021. If you want to try the new image with your test subscriptions, open a support ticket to enable your subscription.

## References
 - [Ubuntu 18.04 LTS release notes](https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes/)





