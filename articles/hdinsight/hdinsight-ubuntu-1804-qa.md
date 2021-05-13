---
title: Azure HDInsight Ubuntu 18.04 update
description: Learn about Azure HDInsight Ubuntu 18.04 OS changes.
ms.service: hdinsight
ms.topic: conceptual
ms.author: yanacai
author: yanancai
ms.date: 04/19/2021
---

# HDInsight Ubuntu 18.04 OS update

This artical provides more details for HDInsight Ubuntu 18.04 OS update and script actions changes that are needed.

## Update overview

HDInsight clusters are currently running on Ubuntu 16.04 LTS. As referenced in Ubuntu’s release cycle, the Ubuntu 16.04 kernel will reach End of Life (EOL) in April 2021. HDInsight will start rolling out the new HDInsight 4.0 cluster image running on Ubuntu 18.04 in May 2021. Newly created HDInsight 4.0 clusters will run on Ubuntu 18.04 by default once available. Existing clusters on Ubuntu 16.04 will run as is with full support.

HDInsight 3.6 will continue to run on Ubuntu 16.04. It will reach the end of standard support by 30 June 2021, and will change to Basic support starting on 1 July 2021. For more information about dates and support options, see Azure HDInsight versions. Ubuntu 18.04 will not be supported for HDInsight 3.6. If you’d like to use Ubuntu 18.04, you’ll need to migrate your clusters to HDInsight 4.0.

You need to drop and recreate your clusters if you’d like to move existing clusters to Ubuntu 18.04. Please plan to create or recreate your cluster after Ubuntu 18.04 support becomes available. We’ll send another notification after the new image becomes available in all regions.

## Script actions changes

HDInsgiht script actions are used to install additional components and change configuration settings. A script action is Bash script that runs on the nodes in an HDInsight cluster.

There are some potential changes you need to make for your script actions.

**Change each instance of "xenial" to "bionic" when grabbing your packages wherever needed.**

For example:
- Update `http://packages.treasuredata.com/3/ubuntu/xenial/ xenial contrib` to `http://packages.treasuredata.com/3/ubuntu/bionic/ bionic contrib`.
- Update `http://azure.archive.ubuntu.com/ubuntu/ xenial main restricted` to `http://azure.archive.ubuntu.com/ubuntu/ bionic main restricted`.

**Some package versions are not present for bionic.** 

For example, [Node.js version 4.x](https://deb.nodesource.com/node_4.x/dists/) is not present in the bionic repo, whereas [Node.js version 12.x](https://deb.nodesource.com/node_12.x/dists/bionic/) is present.

Scripts that install old versions that are not present for bionic need to be updated to later versions.

**/etc/rc.local does not exist by default in 18.04.**

Some scripts use `/etc/rc.local` for service startups but it doesn't exist by default in Ubuntu 18.04. It should be converted to a proper systemd unit. 

**Base OS packages have been updated.**

If your scripts rely on an older version package, it might not work. Or you might need to update the packages in your app. 
 
**In general Ubuntu 18.04 has stricter rules than 16.04.**

## References
 - [Ubuntu 18.04 LTS release notes](https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes/)





