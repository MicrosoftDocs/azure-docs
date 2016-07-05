<properties
   	pageTitle="Configure Secure HDInsight | Microsoft Azure"
   	description="Learn ...."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="06/30/2016"
   	ms.author="jgao"/>

# Configure Secure HDInsight


## Prerequisites

- Azure subscription
- SSH Tunneling. See [Use SSH Tunneling to access Ambari web UI, ResourceManager, JobHistory, NameNode, Oozie, and other web UI's](hdinsight-linux-ambari-ssh-tunnel.md). 



## HDInsight Security Concepts
When configuring Hadoop security in HDInsight, you should logically breakdown your users in two broad groups:

- **Admin User**: These users have full unrestricted access (with the exception of sudo privileges which are only available to default SSH user) to the cluster. They can SSH into the cluster, configure and administer Ranger policies, access storage key with which the cluster is configured etc. This role is reserved for administrators and, needless to say, new users should be added with utmost care.
- **Cluster User**: These users are restricted to access cluster through approved endpoints only e.g. through Hue, Ambari views, ODBC based tools etc. controlled by Apache Ranger policies. Business analyst in an organization generally belong to this group.

In this limited private preview, 'cluster users' are not prevented from SSHing into the cluster. If they wish so, they can bypass Ranger policies by using tools like 'hive' client after SSHing into the cluster. Support for these tighter controls will be available at public preview time.


## Connect to Apache Ranger

1. From a browser with SSH tunneling configured, connect to Ambari.
2. Click **Ranger** from the left menu.
3. Click **Quick Links**, and then click **Ranger Admin UI**.
4. Login as **admin** with the password **admin**.


## Create Ranger user groups

