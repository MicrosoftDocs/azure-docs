---
title: Disable auto logout in Azure HDInsight Ambari Web UI if the session is inactive.
description: Disable able auto logout from Ambari Web UI.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2022
ms.date: 11/21/2023
---

# Disable auto logout from Ambari Web UI

By default, the auto logout feature is enabled for Ambari UI. With this feature, we set a standard 30 mins before the user is logged out due to inactivity. The user will be presented with an automatic logout dialog 60 seconds prior to auto logout. User can click to remain logged in or if no activity occurs, Ambari UI will automatically log out the user and redirect the application to the login page.

> [!NOTE]
> It is recommended to keep this auto logout feature on enable mode only.
 
To disable the auto logout feature,

1. On the Ambari Server host, open /etc/ambari-server/conf/ambari.properties with a text editor.
1. There are two properties for the inactivity timeout setting.
  
   |Property|Description|
   |---|---|
   |user.inactivity.timeout.default|Sets the inactivity timeout (in seconds) for all users except Read-Only users|
   |user.inactivity.timeout.role.readonly.default|Sets the inactivity timeout (in seconds) for all Read-Only users|
  
1. Modify the values to 0 for both the properties to disable the feature.
1. Save changes and restart the running Ambari Server.
  
**Next steps**
  
* [Optimize clusters with Apache Ambari in Azure HDInsight](./hdinsight-changing-configs-via-ambari.md)
