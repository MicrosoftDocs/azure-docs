---
title: Upgrade to Apache Ranger in Azure HDInsight 
description: Learn how to upgrade to Apache Ranger in Azure HDInsight 
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 09/10/2024
---

# Upgrade to Apache Ranger in Azure HDInsight 

HDInsight 5.1 has Apache Ranger version 2.3.0, which is major version upgrade from 1.2.0 HDI 4.1. [Ranger 2.3.0](https://cwiki.apache.org/confluence/display/RANGER/Apache+Ranger+2.3.0+-+Release+Notes) has multiple improvements, features, and DB schema changes.

## Behavioral changes

Hive Ranger permissions - In 5.1 stack for hive, default hive ranger policies have been added which allow all users to

* Create a database.
* Provide all privileges on default database tables and columns.  

This is different from 4.0 stack where these default policies aren't present. 
 
This change has been introduced in OSS (open-source software) ranger: [Create Default Policies for Hive Databases - default, Information_schema](https://issues.apache.org/jira/browse/RANGER-2539).

Ranger User Interface in HDInsight 4.0 and earlier versions:

:::image type="content" source="./media/hdinsight-ranger-5-1-migration/ranger-user-interface.png" alt-text="Screenshot showing Ranger User Interface in HDInsight 4.0." border="true" lightbox="./media/hdinsight-ranger-5-1-migration/ranger-user-interface.png":::

Ranger User Interface in HDInsight 5.1:

:::image type="content" source="./media/hdinsight-ranger-5-1-migration/ranger-user-interface-new.png" alt-text="Screenshot showing Ranger User Interface in HDInsight 5.1." border="true" lightbox="./media/hdinsight-ranger-5-1-migration/ranger-user-interface-new.png":::

> [!NOTE]
> The default policy **all databases** have public group access enabled by default from HDInsight 5.1.

### What does this mean for customers onboarding to 5.1

They'll start seeing that new users added to the cluster via LDAP sync via AADS or internal users to the cluster have privileges to create a new database and read write privileges on default database tables and columns.  

This behavior Is different from 4.0 clusters. Hence if they need to disallow this behavior and have the default permissions same as 4.0, it's required to:

* Disable the **all-databases** policy on ranger UI or edit **all-database** policy to remove **public** group from policy.
* Remove **public** group from **default database tables columns** policy on ranger UI.  


Ranger UI is available by clicking on navigating to ranger component and clicking on ranger UI on right side.

### User Interface differences

* Ranger admin URL has new UI and looks & feel. There's option to switch to the classic Ranger 1.2.0 UI as well.

* Root Service of Hive renamed to Hadoop SQL.

* Hive/Hadoop SQL also has new capabilities of adding roles under Ranger.

## Migration method recommendations

As migration path to HDInsight 5.1, the Ranger policies migration between the clusters is recommended only through Ranger import/export options.

> [!NOTE]
> Reuse of HDInsight 4.1 Ranger database in HDInsight 5.1 Ranger service configurations isn't recommended. Ranger service would fail to restart with following exception due to differences in db schema.

```
2023-11-01 12:47:20,295  [JISQL] /usr/lib/jvm/lib/mssql-jdbc-7.4.1.jre8.jar:/usr/hdp/current/ranger-admin/jisql/lib/\* org.apache.util.sql.Jisql -user ranger -p '\*\*\*\*\*\*\*\*' -driver mssql -cstring jdbc:sqlserver://xxx\;databaseName=ranger -noheader -trim -c \;  -query "delete from x\_db\_version\_h where version = '040' and active = 'N' and updated\_by=xxx.com';"
2023-11-01 12:47:21,095  [E] 040-modify-unique-constraint-on-policy-table.sql import failed!
```

## Migration steps

Steps to import/export.

1. Go to the older adults 4.0 clusters ranger page and select on export.

1. Save the file.

1. On new 5.1 cluster, open ranger and import the same file created in step 2.

1. Map the services appropriately and set the override flag.
