---
title: Security options for Hive in Azure HDInsight
description: Security options for Hive in Standard and ESP clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/02/2020
---

# Security options for Hive in Azure HDInsight

This document describes the recommended security options for Hive in HDInsight. These options can be configured through Ambari.

![`Security Options for Hive`](./media/hdinsight-security-options-for-hive/security-options-hive.png "Security Options for Hive")

## HiveServer2 authentication

For standard clusters, the recommended setting for HiveServer2 authentication is the default which is none. To enable authentication, we recommend upgrading to an [ESP](https://docs.microsoft.com/azure/hdinsight/domain-joined/hdinsight-security-overview) (Enterprise Security Package) cluster. 

For ESP clusters, [Kerberos](https://web.mit.edu/Kerberos/) authentication is enabled by default. Pluggable Authentication Modules (PAM) and custom authentication schemes are not supported.

## HiveServer2 authorization

For standard clusters, the default setting is None. [SqlStdAuth (SQL Standards Based Authorization)](https://cwiki.apache.org/confluence/display/Hive/SQL+Standard+based+hive+authorization) can be enabled. Authorization through [Apache Ranger](https://ranger.apache.org/) is not supported for standard clusters. We recommend upgrading to an ESP cluster for Ranger Authorization. 

For ESP clusters, authorization through Ranger is enabled by default. 


## SSL Encryption for HiveServer2

Enabling Hiveserver2 SSL is not recommended for either standard or ESP clusters. SSL is enabled on the gateway instead. [Encryption in transit](https://docs.microsoft.com/azure/hdinsight/domain-joined/encryption-in-transit) can be enabled to encrypt communications among the cluster nodes using [Internet Protocol Security (IPSec)](https://en.wikipedia.org/wiki/IPsec).


## Next steps
* [Overview of HiveServer2 Authentication](https://cwiki.apache.org/confluence/display/Hive/Setting+up+HiveServer2#SettingUpHiveServer2-Authentication/SecurityConfiguration)
* [Overview of HiveServer2 Authorization](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Authorization#:~:text=%20Overview%20of%20Authorization%20Modes%20%201%201,and%20Apache%20Sentry%20are%20apache%20projects...%20More%20)
* [Enabling SQL Standards Based Hive Authorization](https://community.cloudera.com/t5/Community-Articles/Getting-started-with-SQLStdAuth/ta-p/244263)
* [Apache Ranger with Hive](https://docs.microsoft.com/azure/hdinsight/domain-joined/apache-domain-joined-run-hive#:~:text=Create%20Hive%20ODBC%20data%20source%20%20%20,Enter%20hiveuser1%40contoso158.onmicrosoft.c%20...%20%205%20more%20rows%20)
