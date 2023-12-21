---
title: Configure Apache Spark policies in HDInsight with ESP 
description: This article describes how to configure Ranger policies for Spark SQL with Enterprise security package 
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 12/21/2023
---

# Configure Apache Spark policies in HDInsight with ESP 

This article describes how to configure Ranger policies for Spark SQL with Enterprise security package 

In this tutorial, you'll learn, 
- Create a Ranger policies 
- Create table using Spark SQL 
- Verify the applied Ranger policies 

## Prerequisities 

An Apache Spark cluster in HDInsight with [Enterprise Security Package](../domain-joined/apache-domain-joined-configure-using-azure-adds.md) 

## Connect to Apache Ranger Admin UI 

1. From a browser, connect to the Ranger Admin user interface using the URL `https://ClusterName.azurehdinsight.net/Ranger/`. Remember to change `ClusterName` to the name of your Spark cluster. Ranger credentials are not the same as Hadoop cluster credentials. To prevent browsers from using cached Hadoop credentials, use a new InPrivate browser window to connect to the Ranger Admin UI. 
1. Sign in using your Microsoft Entra admin credentials. The Microsoft Entra admin credentials aren't the same as HDInsight cluster credentials or Linux HDInsight node SSH credentials. 

:::image type="content" source="./media/ranger-policies-for-spark/microsoft-admin.png" alt-text="Screenshot shows the Create Alert Notification dialog box." lightbox="./media/ranger-policies-for-spark/microsoft-admin.png":::

## Create Domain users 

See [Create a HDInsight cluster with ESP](../domain-joined/apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp), for information on how to create sparkuser1 and sparkuser2. You use the two user accounts in this article. 

## Create Ranger policies 

In this section, you create two Ranger policies for accessing hivesampletable from spark-sql. You give select permission on different set of columns.  

**To create Ranger policies** 

1. Open Ranger Admin UI. See Connect to Apache Ranger Admin UI. 

1. Select **CLUSTERNAME_Hive_and_Spark** or **hive_and_spark**, under **Hadoop SQL**.  

1. Select **Add New Policy**, and then enter the following values: 

     |Property |Value | 

    |---|---| 

    |Policy Name|read-hivesampletable-all| 

    |Hive Database|default| 

    |table|hivesampletable| 

    |Hive Column|*| 

    |Select User|sparkuser1| 

    |Permissions|select| 



    > [!NOTE]   
    > If a domain user is not populated in Select User, wait a few moments for Ranger to sync with AAD. 



1. Select **Add** to save the policy. 



1. Create a table sparksampletable using Jupyter/Zepplin notebook in your cluster 

    - Create table sparksampletable as  `
      `Select clientid, devicemake, country from hivesampletable `

1. Now, Create another policy with the following properties using Ranger Admin UI 

     |Property |Value | 

    |---|---| 

    |Policy Name|read-sparksampletable-devicemake| 

    |Hive Database|default| 

    |Hive table|sparksampletable| 

    |Hive column|querytime| 

    |Select User|sparkuser2| 

    |Permissions|select| 

   |Masking options|Nullify| 



## Verify the applied Ranger policies 

1. Open Jupyter/Zepplin notebook 

1. Run the following command 
  ```
    %sql 
    ```
      Select * from sparksampletable;  

### Limitation 

1. Spark-sql ranger integration will not work if Ranger admin is down. 

1. Ranger DB might be overloaded if >20 spark sessions are launched at a time because of continuous policy pulls. 

1. In Ranger Audit logs, “Resource” column on hover doesn’t show the entire query which got executed 

### Appendix: 

How user sync will work for large data in AD like we faced in centrica – Sairam 

Ranger DB can be shared with multiple cluster pools 

SSH Pod 

CLI 

Portal 

SDK 

https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-ranger-spark.html#emr-ranger-spark-redeploy-service-definition 