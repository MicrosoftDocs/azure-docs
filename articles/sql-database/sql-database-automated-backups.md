<properties
   pageTitle="SQL Database backups - automatic, geo-redundant | Microsoft Azure" 
   description="SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy."
   services="sql-database"
   documentationCenter=""
   authors="anosov1960"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/02/2016"
   ms.author="sashan;carlrab;barbkess"/>

# Learn about SQL Database backups

<!------------------
This topic is annotated with TEMPLATE guidelines for FEATURE TOPICS.

Metadata guidelines

pageTitle
	60 characters or less. Includes name of the feature - primary benefit. Not the same as H1. Its 60 characters or fewer including all characters between the quotes and the Microsoft Azure site identifier.

description
	115-145 characters. Duplicate of the first sentence in the introduction. This is the abstract of the article that displays under the title when searching in Bing or Google. 

	Example: "SQL Database automatically creates a local database backup every few minutes and uses Azure read-access geo-redundant storage for geo-redundancy."

TEMPLATE GUIDELINES for feature topics

The Feature Topic is a one-pager (ok, sometimes longer) that explains a capability of the product or service. It explains what the capability is and characteristics of the capability.  

It is a "learning" topic, not an action topic.

DO explain this:
	• Definition of the feature terminology.  i.e., What is a database backup?
	• Characteristics and capabilities of the feature. (How the feature works)
	• Common uses with links to overview topics that recommend when to use the feature.
	• Reference specifications (Limitations and Restrictions, Permissions, General Remarks, etc.)
	• Next Steps with links to related overviews, features, and tasks.

DON'T explain this:
	• How to steps for using the feature (Tasks)
	• How to solve business problems that incorporate the feature (Overviews)

GUIDELINES for the H1 
	
	The H1 should answer the question "What is in this topic?" Write the H1 heading in conversational language and use search key words as much as possible. Since this is a learning topic, make sure the title indicates that and doesn't mislead people to think this will tell them how to do tasks.  
	
	To help people understand this is a learning topic and not an action topic, start the title with "Learn about ... "

	Heading must use an industry standard term. If your feature is a proprietary name like "Elastic database pools", use a synonym. For example:	"Learn about elastic database pools for multi-tenant databases". In this case multi-tenant database is the industry-standard term that will be an anchor for finding the topic.

GUIDELINES for introduction
	
	The introduction is 1-2 sentences.  It is optimized for search and sets proper expectations about what to expect in the article. It should contain the top key words that you are using throughout the article.The introduction should be brief and to the point of what the feature is, what it is used for, and what's in the article. 

	If the introduction is short enough, your article can pop to the top in Google Instant Answers.

	In this example:

Sentence #1 Explains what the article will cover, which is what the feature is or does. This is also the metadata description. 
	SQL Database automatically creates a database backup every five minutes and uses Azure read-access geo-redundant storage (RA-GRS) to provide geo-redundancy. 

Sentence #2 Explains why I should care about this.  
	Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion.

-------------------->

SQL Database automatically creates a database backups and uses Azure read-access geo-redundant storage (RA-GRS) to provide geo-redundancy. These backups are created automatically and at no additional charge. You don't need to do anything to make them happen. Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. If you want to keep backups in your own storage container you can configure Long-term backup retention policy. For more information, see [Long-term retention](sql-database-long-term-retention.md).

<!-- This image needs work, so not putting it in right now.

This diagram shows SQL Database running in the US East region. It creates a database backup every five minutes, which it stores locally to Azure Read Access Geo-redundant Storage (RA-GRS). Azure uses geo-replication to copy the database backups to a paired data center in the US West region.

![geo-restore](./media/sql-database-geo-restore/geo-restore-1.png)

-->

<!---------------
GUIDELINES for the first ## H2.

	The first ## describes what the feature encompasses and how it is used. It points to related task articles.
	
	For consistency, being the heading with "What is ... "
----------------->

## What is a SQL Database backup?  

<!-- 
	Explains what a SQL Database backup is and answers an important question that people want to know.
-->


<!----------------- 
	Explains first component of the backup feature
------------------>

SQL Database uses SQL Server technology to create [full](https://msdn.microsoft.com/library/ms186289.aspx), [differential](https://msdn.microsoft.com/library/ms175526.aspx), and [transaction log](https://msdn.microsoft.com/library/ms191429.aspx) backups. The transaction log backups generall happen every 5 - 10 minutes, with the frequency based on the performance level and amount of database activity. Transaction log backups in conjunction with full and differential backups allows you to do a point-in-time restore to the same server that hosts the database. When you restore a database, the service figures out which full, differential, and transaction log backups need to be restored.

<!--------------- 
	Explicit list of what to do with a local backup. "Use a ..." helps people to scan the topic and find the uses quickly.
---------------->

You can use these backups to:

- Restore a database to a point-in-time within the retention period. This operation will create a new database in the same server as the original database.
- Restore a a deleted database to the time it was deleted or any time within the retention period. The deleted database can only be restored in the same server where the original database was created.
- Restore a database to another geographical region. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new database in any existing server anywhere in the world. 
-  Restore a database from a specific backup stored in your Azure Backup Services Vault. This allows you to restore an old version of the database to satisfy a compliance request or to run an old version of the application.
- To perform a restore, see [restore database from backups](sql-database-recovery-using-backups.md).

<!----------------- 
	Explains first component of the backup feature
------------------>

<!--------------- 
	Explicit list of what to do with a geo-redundant backup. "Use a ..." helps people to scan the topic and find the uses quickly.
---------------->

>[AZURE.NOTE] In Azure storage, the term *replication* refers to copying files from one location to another. SQL's *database replication* refers to keeping to multiple secondary databases synchronized with a primary database. 

<!----------------
	The next ## H2's discuss key characteristics of how the feature works. The title is in conversational language and asks the question that will be answered.
------------------->
## How much backup storage is included at no cost?

SQL Database provides up to 200% of your maximum provisioned database storage as backup storage at no additional cost. For example, if you have a Standard DB instance with a provisioned DB size of 250 GB, you have 500 GB of backup storage at no additional charge. If your database exceeds the provided backup storage, you can choose to reduce the retention period by contacting Azure Support. Another option is to pay for extra backup storage that is billed at the standard Read-Access Geographically Redundant Storage (RA-GRS) rate. 

## How often do backups happen?

Full database backups happen weekly, differential database backups generally happen every few hours, and transaction log backups generally happen every 5 - 10 minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the SQL Database service as it balances the overall system workload. 

The backup storage geo-replication occurs based on the Azure Storage replication schedule.

## How long do you keep my backups?

Each SQL Database backup has a retention period that is based on the [service-tier](sql-database-service-tiers.md) of the database. The retention period for a database in the:

<!------------------

	Using a list so the information is easy to find when scanning.
------------------->

- Basic service tier is seven days.
- Standard service tier is 35 days.
- Premium service tier is 35 days.


If you downgrade your database from the Standard or Premium service tiers to Basic, the backups are saved for seven days. All existing backups older than seven days are no longer available. 

If you upgrade your database from the Basic service tier to Standard or Premium, SQL Database keeps existing backups until they are 35 days old. It keeps new backups as they occur for 35 days.
 
If you delete a database, SQL Database keeps the backups in the same way it would for an online database. For example, suppose you delete a Basic database that has a retention period of seven days. A backup that is four days old is saved for three more days.

>[AZURE.IMPORTANT]
	If you delete the Azure SQL server that hosts SQL Databases, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.

##How to extend the backup retention period?

If your application requires that the backups are available for longer period of time you can extend the built-in retention period by configuring the Long-term backup retention policy for individual databases (LTR policy). This allows you to extend the built-it retention period from 35 days to up to 10 years. For more information, see [Long-term retention](sql-database-long-term-retention.md).

Once you add the LTR policy to a database using Azure Portal or API, the weekly full database backups will be automatically copied to your own Azure Backup Service Vault. If your database is encrypted with TDE the backups are automatically encrypted at rest.  The Services Vault will automatically delete your expired backups based on their timestamp and the LTR policy.  So you don’t need to manage the backup schedule or worry about the cleanup of the old files. 
The restore API supports backups stored in the vault as long as the vault is in the same subscription as your SQL database. You can use Portal or PowerShell to access these backups.

<!-------------------
OPTIONAL section
## Best practices 
--------------------->

<!-------------------
OPTIONAL section
## General remarks
--------------------->

<!-------------------
OPTIONAL section
## Limitations and restrictions
--------------------->

<!-------------------
OPTIONAL section
## Metadata
--------------------->

<!-------------------
OPTIONAL section
## Performance
--------------------->

<!-------------------
OPTIONAL section
## Permissions
--------------------->

<!-------------------
OPTIONAL section
## Security
--------------------->

<!-------------------
GUIDELINES for Next Steps

	The last section is Next Steps. Give a next step that would be relevant to the customer after they have learned about the feature and the tasks associated with it.  Perhaps point them to one or two key scenarios that use this feature.

	You don't need to repeat links you have already given them.
--------------------->

## Next steps

Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).


