---
title: Configure Apache Ranger policies for Spark SQL in HDInsight with Enterprise security package. 
description: This article describes how to configure Ranger policies for Spark SQL with Enterprise security package.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 02/12/2024
---

# Configure Apache Ranger policies for Spark SQL in HDInsight with Enterprise security package

This article describes how to configure Ranger policies for Spark SQL with Enterprise security package in HDInsight.

In this tutorial, you'll learn how to,
- Create Apache Ranger policies 
- Verify the applied Ranger policies 
- Guideline for setting Apache Ranger for Spark SQL 

## Prerequisites 

An Apache Spark cluster in HDInsight version 5.1 with [Enterprise security package](../domain-joined/apache-domain-joined-configure-using-azure-adds.md).

## Connect to Apache Ranger Admin UI 

1. From a browser, connect to the Ranger Admin user interface using the URL `https://ClusterName.azurehdinsight.net/Ranger/`.
  
   Remember to change `ClusterName` to the name of your Spark cluster. 
   
1. Sign in using your Microsoft Entra admin credentials. The Microsoft Entra admin credentials aren't the same as HDInsight cluster credentials or Linux HDInsight node SSH credentials. 

    :::image type="content" source="./media/ranger-policies-for-spark/ranger-spark.png" alt-text="Screenshot shows the create alert notification dialog box." lightbox="./media/ranger-policies-for-spark/ranger-spark.png":::

## Create Domain users 

See [Create an HDInsight cluster with ESP](../domain-joined/apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp), for information on how to create **sparkuser**  domain users. In a production scenario, domain users come from your Active Directory tenant.

## Create Ranger policy 

In this section, you create two Ranger policies;  

- [Access policy for accessing “hivesampletable” from spark-sql](./ranger-policies-for-spark.md#create-ranger-access-policies)
- [Masking policy for obfuscating the columns in hivesampletable](./ranger-policies-for-spark.md#create-ranger-masking-policy)

### Create Ranger Access policies

1. Open Ranger Admin UI. 

1. Select  **hive_and_spark**, under **Hadoop SQL**.

   :::image type="content" source="./media/ranger-policies-for-spark/ranger-spark.png" alt-text="Screenshot shows select  hive and spark." lightbox="./media/ranger-policies-for-spark/ranger-spark.png":::

1. Select **Add New Policy** under **Access** tab, and then enter the following values:

   :::image type="content" source="./media/ranger-policies-for-spark/add-new-policy-screenshot.png" alt-text="Screenshot shows select  hive." lightbox="./media/ranger-policies-for-spark/add-new-policy-screenshot.png":::

   | Property | Value | 
    |---|---| 
    | Policy Name | read-hivesampletable-all | 
    | Hive Database | default | 
    | table | hivesampletable | 
    | Hive Column | * | 
    | Select User | sparkuser |  
    | Permissions | select | 

     :::image type="content" source="./media/ranger-policies-for-spark/sample-policy-details.png" alt-text="Screenshot shows sample policy details." lightbox="./media/ranger-policies-for-spark/sample-policy-details.png":::

   Wait a few moments for Ranger to sync with Microsoft Entra ID if a domain user is not automatically populated for Select User. 

1. Select **Add** to save the policy. 

1. Open Zeppelin notebook and run the following command to verify the policy. 
 
   ```
        %sql 
        select * from hivesampletable limit 10;
   ```

     Result before policy was saved:
   
    :::image type="content" source="./media/ranger-policies-for-spark/result-before-access-policy.png" alt-text="Screenshot shows result before access policy." lightbox="./media/ranger-policies-for-spark/result-before-access-policy.png":::

     Result after policy is applied:

   :::image type="content" source="./media/ranger-policies-for-spark/result-after-access-policy.png" alt-text="Screenshot shows result after access policy." lightbox="./media/ranger-policies-for-spark/result-after-access-policy.png":::

#### Create Ranger masking policy 
 

The following example explains how to create a policy to mask a column. 

1. Create another policy under **Masking** tab with the following properties using Ranger Admin UI 

   :::image type="content" source="./media/ranger-policies-for-spark/add-new-masking-policy-screenshot.png" alt-text="Screenshot shows add new masking policy screenshot." lightbox="./media/ranger-policies-for-spark/add-new-masking-policy-screenshot.png":::
 

    |Property |Value | 
    |---|---| 
    |Policy Name| mask-hivesampletable | 
    |Hive Database|default| 
    |Hive table| hivesampletable| 
    |Hive column|devicemake| 
    |Select User|sparkuser| 
    |Permissions|select| 
   |Masking options|hash| 

 

     :::image type="content" source="./media/ranger-policies-for-spark/masking-policy-details.png" alt-text="Screenshot shows masking policy details." lightbox="./media/ranger-policies-for-spark/masking-policy-details.png":::
 

1. Select **Save** to save the policy. 

1. Open Zeppelin notebook and run the following command to verify the policy. 

    ``` 
        %sql
        select clientId, deviceMake from hivesampletable; 
   ```
     :::image type="content" source="./media/ranger-policies-for-spark/open-zipline-notebook.png" alt-text="Screenshot shows open zeppelin notebook." lightbox="./media/ranger-policies-for-spark/open-zipline-notebook.png":::

 

> [!NOTE]   
> By default, the policies for hive and spark-sql will be common in Ranger. 


  
## Guideline for setting up Apache Ranger for Spark-sql 
 
**Scenario 1**: Using new Ranger database while creating HDInsight 5.1 Spark cluster.
 
When the cluster is created, the relevant Ranger repo containing the Hive and Spark Ranger policies are created under the name <hive_and_spark> in the Hadoop SQL service on the Ranger DB. 
 
:::image type="content" source="./media/ranger-policies-for-spark/ranger-spark.png" alt-text="Screenshot shows select  hive and spark." lightbox="./media/ranger-policies-for-spark/ranger-spark.png":::

 

You can edit the policies and these policies gets applied to both Hive and Spark. 
 
Points to consider: 

1. In case you have two metastore databases with the same name used for both hive (for example, DB1) and spark (for example, DB1) catalogs.  
   - If spark uses spark catalog (metastore.catalog.default=spark), the policy applies to the DB1 of the spark catalog.  
   - If spark uses hive catalog (metastore.catalog.default=hive), the policies get applied to the DB1 of the hive catalog. 
       
   There is no way of differentiating between DB1 of hive and spark catalog from the perspective of Ranger. 
   
    
   In such cases, it is recommended to either use ‘hive’ catalog for both Hive and Spark or maintain different database, table and column names for both Hive and Spark catalogs so that the policies are not applied to databases across catalogs. 
      

1. In case you use ‘hive’ catalog for both Hive and Spark.  

    Let’s say you create a table **table1**  through Hive with current ‘xyz’ user. It creates an HDFS file called **table1.db** whose owner is ‘xyz’ user.  
     
     - Now consider, the user ‘abc’ is used while launching the Spark Sql session. In this session of user ‘abc’, if you try to write anything to **table1**, it is bound to fail since the table owner is ‘xyz’.  
     - In such case, it is recommended to use the same user in Hive and Spark SQL for updating the table and that user should have sufficient privileges to perform update operations. 

**Scenario 2**: Using existing Ranger database (with existing policies) while creating HDInsight 5.1 Spark cluster. 

   - In this case when the HDI 5.1 cluster is created using existing Ranger database then, new Ranger repo gets created again on this database with the name of the new cluster in this format - <hive_and_spark>. 


   :::image type="content" source="./media/ranger-policies-for-spark/new-repo-old-ranger-database.png" alt-text="Screenshot shows new repo old ranger database." lightbox="./media/ranger-policies-for-spark/new-repo-old-ranger-database.png":::

  Let’s say you have the policies defined in the Ranger repo already under the name <oldclustername_hive> on the existing Ranger database inside Hadoop SQL service and you want to share the same policies in the new HDInsight 5.1 Spark cluster. To achieve this, follow the steps given below: 
 
> [!NOTE]   
> Config updates can be performed by the user with Ambari admin privileges. 

1. Open Ambari UI from your new HDInsight 5.1 cluster. 

1. Go to Spark 3 service -> Configs. 

1. Open “ranger-spark-security” security config. 

 

     Or Open “ranger-spark-security” security config in /etc/spark3/conf using SSH.
      
      :::image type="content" source="./media/ranger-policies-for-spark/ambari-config-ranger-security.png" alt-text="Screenshot shows Ambari config ranger security." lightbox="./media/ranger-policies-for-spark/ambari-config-ranger-security.png":::

 

1. Edit two configurations “ranger.plugin.spark.service.name“ and “ranger.plugin.spark.policy.cache.dir" to point to old policy repo “oldclustername_hive” and “Save” the configurations. 

     Ambari: 
     
     :::image type="content" source="./media/ranger-policies-for-spark/config-update-service-name-ambari.png" alt-text="Screenshot shows config update service name Ambari." lightbox="./media/ranger-policies-for-spark/config-update-service-name-ambari.png":::
      
     XML file: 

      :::image type="content" source="./media/ranger-policies-for-spark/config-update-xml.png" alt-text="Screenshot shows config update xml." lightbox="./media/ranger-policies-for-spark/config-update-xml.png":::
    
 

1. Restart Ranger and Spark services from Ambari. 

     The policies get applied on databases in the spark catalog. If you want to access the databases under hive catalog,  go to Ambari -> SPARK3 -> Configs -> Change “metastore.catalog.default” from spark to hive. 
 
      :::image type="content" source="./media/ranger-policies-for-spark/change-metastore-config.png" alt-text="Screenshot shows change metastore config." lightbox="./media/ranger-policies-for-spark/change-metastore-config.png":::


### Known issues 
 
- Apache Ranger Spark-sql integration not works if Ranger admin is down. 
- Ranger DB could be overloaded if >20 spark sessions are launched concurrently because of continuous policy pulls. 
- In Ranger Audit logs, “Resource” column, on hover, doesn’t show the entire query which got executed. 
 

 
   
