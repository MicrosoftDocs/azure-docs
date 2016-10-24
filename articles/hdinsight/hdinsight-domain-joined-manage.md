<properties
   	pageTitle="Manage Domain-joined HDInsight clusters| Microsoft Azure"
   	description="Learn how to manage Domain-joined HDInsight clusters"
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="jhubbard"
   	editor="cgronlun"
	tags=""/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="10/24/2016"
   	ms.author="jgao"/>

# Manage Domain-joined HDInsight clusters (Preview)


## manage multiple users

Learn how to give user the permissions to manage Ambari, and to use Ambari Hive Views.


The domain user name which is provided during cluster creation is an admin on the HDInsight cluster. So, to manage multiple users on the cluster, you will need to sign-in using the cluster admin domain user account.

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open your HDInsight cluster in a blade. See [List and show clusters](hdinsight-administer-use-management-portal.md#list-and-show-clusters).
3. Click **Dashboard** from the top menu to open Ambari.
4. Log on to Ambari using the cluster administrator domain user name and password.
5. 
 

Step 3 – When logged in on Ambari, click on the user name drop down and click on Manage Ambari to manage the users and groups
 

Step 4 – On the manage Ambari dashboard, when you click on users, you will user all users synced  from your Active Directory to the HDInsight cluster.
 
Step 5 – To give users permissions to use Hive views, Click on Views on left pane => Hive View
 
Step 6 – This will load the Hive configuration. Scroll down to Permissions section, where you will give permissions to any user/group to use the Hive Views. You can also give permissions to all users within a certain role (discussed below).
 

Step 7 – To assign certain roles to users, click on Roles on the left pane. Add users to any of the roles desired. 
 







## Next steps:

- For configuring Hive policies and run Hive queries, see [Configure Hive policies for Domain-joined HDInsight clusters](hdinsight-domain-joined-run-hive.md).
- For running Hive queries using SSH on Domain-joined HDInsight clusters, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-domain-joined-hdinsight-cluster).
