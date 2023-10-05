---
title: Security options for Hive in Azure HDInsight
description: Security options for Hive in Standard and ESP clusters.
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/27/2023
---

# Security options for Hive in Azure HDInsight

This document describes the recommended security options for Hive in HDInsight. These options can be configured through Ambari.

:::image type="content" source="./media/hdinsight-security-options-for-hive/security-options-hive.png " alt-text="`Security Options for Hive`" border="true":::

## HiveServer2 authentication

For standard clusters, the recommended setting for HiveServer2 authentication is the default, which is none. To enable authentication, we recommend upgrading to an [ESP](../domain-joined/hdinsight-security-overview.md) (Enterprise Security Package) cluster. 

For ESP clusters, [Kerberos](https://web.mit.edu/Kerberos/) authentication is enabled by default. Pluggable Authentication Modules (PAM) and custom authentication schemes aren't supported.

## HiveServer2 authorization

For standard clusters, the default setting is None. [SqlStdAuth (SQL Standards Based Authorization)](https://cwiki.apache.org/confluence/display/Hive/SQL+Standard+based+hive+authorization) can be enabled. Authorization through [Apache Ranger](https://ranger.apache.org/) isn't supported for standard clusters. We recommend upgrading to an ESP cluster for Ranger Authorization. 

For ESP clusters, authorization through Ranger is enabled by default. 


## SSL Encryption for HiveServer2

Enabling Hiveserver2 SSL isn't recommended for either standard or ESP clusters. SSL is enabled on the gateway instead. [Encryption in transit](../domain-joined/encryption-in-transit.md) can be enabled to encrypt communications among the cluster nodes using [Internet Protocol Security (IPSec)](https://en.wikipedia.org/wiki/IPsec).


## Next steps
* [Overview of HiveServer2 Authentication](https://cwiki.apache.org/confluence/display/Hive/Setting+up+HiveServer2#SettingUpHiveServer2-Authentication/SecurityConfiguration)
* [Overview of HiveServer2 Authorization](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Authorization)
* [Enabling SQL Standards Based Hive Authorization](https://community.cloudera.com/t5/Community-Articles/Getting-started-with-SQLStdAuth/ta-p/244263)
* [Apache Ranger with Hive](../domain-joined/apache-domain-joined-run-hive.md)
