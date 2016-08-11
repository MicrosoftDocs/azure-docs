<properties
   	pageTitle="Secure HDInsight Overview| Microsoft Azure"
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
   	ms.date="06/03/2016"
   	ms.author="jgao"/>

# Introduce Secure HDInsight

[a short intro here]

- Protect your enterprise data lake
- Audit access by users to resource on Hive from a centralized Security Administration console (Ranger)


[jgao questions:] 

- Public preview ETA: Setp 22, 2016
- Only Hive and Yarn will be supported by public preview
- The Names: Ranger admin UI (found on Ambari) vs Ranger administration console (HDP name) vs. Policy Manager.


## Benefits

At a high level, there are four pillars of security and governance in Hadoop. This section briefly describes each pillar and outlines the capabilities present in the current preview to support that pillar. 

- **Authentication**
This pillar deals with allowing only the users that belong to the organization access the Hadoop resources. Anyone outside the organization cannot log in or access cluster resources. This is accomplished by integrating with the organization’s identity management system. 
HDInsight supports integrating with Azure Active Directory to provide strong authentication through the use of Active Directory Domain Services (ADDS). 

- **Authorization**
Proper authorization ensures that only the users allowed to access a Hadoop resource are able to access it. For example, within an organization, not everyone may have the same level of privileges to access financial or HR data. For those cases, an administrator in the organization should be able to define and administer access control policies on all Hadoop resources. 
HDInsight supports defining role based access control (RBAC) policies using Apache Ranger. 

- **Auditing**
Hadoop administrators or auditors should be able to audit how the cluster resources were accessed and used by different members of the organization. This may be needed for compliance and governance reasons. 
HDInsight supports auditing through Apache Ranger. 

- **Data Protection**
This pillar deals with the encryption of data and the associated key management. HDInsight customers with data in Azure Storage can leverage the transparent server-side encryption capability that was recently announced in public preview. https://azure.microsoft.com/en-us/documentation/articles/storage-service-encryption/

## Azure AD


## Apache Ranger

- http://hortonworks.com/hadoop-tutorial/securing-data-lake-auditing-user-access-using-hdp-security/ 

[jgao: ranger architecture diagram here]

## Configure Secure HDInsight environment

See [Configure Secure HDInsight](hdinsight-secure-setup.md)

## Run a Hive job 

See [Run a Hive job using Secure HDInsight](hdinsight-secure-run-hive.md)

## Use Yarn in secure HDInsight

See ...