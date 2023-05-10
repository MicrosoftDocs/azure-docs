---
title: Apache HBase & Enterprise Security Package - Azure HDInsight
description: Tutorial - Learn how to configure Apache Ranger policies for HBase in Azure HDInsight with Enterprise Security Package.
ms.service: hdinsight
ms.topic: tutorial
ms.date: 05/10/2023
---

# Tutorial: Configure Apache HBase policies in HDInsight with Enterprise Security Package

Learn how to configure Apache Ranger policies for Enterprise Security Package (ESP) Apache HBase clusters. ESP clusters are connected to a domain allowing users to authenticate with domain credentials. In this tutorial, you create two Ranger policies to restrict access to different column-families in an HBase table.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create domain users
> * Create Ranger policies
> * Create tables in an HBase cluster
> * Test Ranger policies

## Before you begin

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Sign in to the [Azure portal](https://portal.azure.com/).

* Create a [HDInsight HBase cluster with Enterprise Security Package](apache-domain-joined-configure-using-azure-adds.md).

## Connect to Apache Ranger Admin UI

1. From a browser, connect to the Ranger Admin user interface using the URL `https://<ClusterName>.azurehdinsight.net/Ranger/`. Remember to change `<ClusterName>` to the name of your HBase cluster.

    > [!NOTE]  
    > Ranger credentials are not the same as Hadoop cluster credentials. To prevent browsers from using cached Hadoop credentials, use a new InPrivate browser window to connect to the Ranger Admin UI.

2. Sign in using your Azure Active Directory (AD) admin credentials. The Azure AD admin credentials aren't the same as HDInsight cluster credentials or Linux HDInsight node SSH credentials.

## Create domain users

Visit [Create a HDInsight cluster with Enterprise Security Package](./apache-domain-joined-configure-using-azure-adds.md), to learn how to create the **sales_user1** and **marketing_user1** domain users. In a production scenario, domain users come from your Active Directory tenant.

## Create HBase tables and import sample data

You can use SSH to connect to HBase clusters and then use [Apache HBase Shell](https://hbase.apache.org/0.94/book/shell.html) to create HBase tables, insert data, and query data. For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

### To use the HBase shell

1. From SSH, run the following HBase command:
   
    ```bash
    hbase shell
    ```

2. Create an HBase table `Customers` with two-column families: `Name` and `Contact`.

    ```hbaseshell   
    create 'Customers', 'Name', 'Contact'
    list
    ```
3. Insert some data:
    
    ```hbaseshell   
    put 'Customers','1001','Name:First','Alice'
    put 'Customers','1001','Name:Last','Johnson'
    put 'Customers','1001','Contact:Phone','333-333-3333'
    put 'Customers','1001','Contact:Address','313 133rd Place'
    put 'Customers','1001','Contact:City','Redmond'
    put 'Customers','1001','Contact:State','WA'
    put 'Customers','1001','Contact:ZipCode','98052'
    put 'Customers','1002','Name:First','Robert'
    put 'Customers','1002','Name:Last','Stevens'
    put 'Customers','1002','Contact:Phone','777-777-7777'
    put 'Customers','1002','Contact:Address','717 177th Ave'
    put 'Customers','1002','Contact:City','Bellevue'
    put 'Customers','1002','Contact:State','WA'
    put 'Customers','1002','Contact:ZipCode','98008'
    ```
4. View the contents of the table:
    
    ```hbaseshell
    scan 'Customers'
    ```

    :::image type="content" source="./media/apache-domain-joined-run-hbase/hbase-shell-scan-table.png" alt-text="HDInsight Hadoop HBase shell output" border="true":::

## Create Ranger policies

Create a Ranger policy for **sales_user1** and **marketing_user1**.

1. Open the **Ranger Admin UI**. Click **\<ClusterName>_hbase** under **HBase**.

   :::image type="content" source="./media/apache-domain-joined-run-hbase/apache-ranger-admin-login.png" alt-text="HDInsight Apache Ranger Admin UI" border="true":::

2. The **List of Policies** screen will display all Ranger policies created for this cluster. One pre-configured policy may be listed. Click **Add New Policy**.

    :::image type="content" source="./media/apache-domain-joined-run-hbase/apache-ranger-hbase-policies-list.png" alt-text="Apache Ranger HBase policies list" border="true":::

3. On the **Create Policy** screen, enter the following values:

   |**Setting**  |**Suggested value**  |
   |---------|---------|
   |Policy Name  |  sales_customers_name_contact   |
   |HBase Table   |  Customers |
   |HBase Column-family   |  Name, Contact |
   |HBase Column   |  * |
   |Select Group  | |
   |Select User  | sales_user1 |
   |Permissions  | Read |

   The following wildcards can be included in the topic name:

   * `*` indicates zero or more occurrences of characters.
   * `?` indicates single character.

   :::image type="content" source="./media/apache-domain-joined-run-hbase/apache-ranger-hbase-policy-create-sales.png" alt-text="Apache Ranger policy create sales" border="true":::

   >[!NOTE]
   >Wait a few moments for Ranger to sync with Azure AD if a domain user is not automatically populated for **Select User**.

4. Click **Add** to save the policy.

5. Click **Add New Policy** and then enter the following values:

   |**Setting**  |**Suggested value**  |
   |---------|---------|
   |Policy Name  |  marketing_customers_contact   |
   |HBase Table   |  Customers |
   |HBase Column-family   |  Contact |
   |HBase Column   |  * |
   |Select Group  | |
   |Select User  | marketing_user1 |
   |Permissions  | Read |

   :::image type="content" source="./media/apache-domain-joined-run-hbase/apache-ranger-hbase-policy-create-marketing.png" alt-text="Apache Ranger policy create marketing" border="true":::  

6. Click **Add** to save the policy.

## Test the Ranger policies

Based on the Ranger policies configured, **sales_user1** can view all of the data for the columns in both the `Name` and `Contact` column families. The **marketing_user1** can only view data in the `Contact` column family.

### Access data as sales_user1

1. Open a new SSH connection to the cluster. Use the following command to sign in to the cluster:

   ```bash
   ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
   ```

1. Use the kinit command to change to the context of our desired user.

   ```bash
   kinit sales_user1
   ```

2. Open the HBase shell and scan the table `Customers`.

   ```hbaseshell
   hbase shell
   scan `Customers`
   ```

3. Notice that the sales user can view all columns of the `Customers` table including the two columns in the `Name` column-family, as well as the five columns in the `Contact` column-family.

    ```hbaseshell
    ROW                                COLUMN+CELL
     1001                              column=Contact:Address, timestamp=1548894873820, value=313 133rd Place
     1001                              column=Contact:City, timestamp=1548895061523, value=Redmond
     1001                              column=Contact:Phone, timestamp=1548894871759, value=333-333-3333
     1001                              column=Contact:State, timestamp=1548895061613, value=WA
     1001                              column=Contact:ZipCode, timestamp=1548895063111, value=98052
     1001                              column=Name:First, timestamp=1548894871561, value=Alice
     1001                              column=Name:Last, timestamp=1548894871707, value=Johnson
     1002                              column=Contact:Address, timestamp=1548894899174, value=717 177th Ave
     1002                              column=Contact:City, timestamp=1548895103129, value=Bellevue
     1002                              column=Contact:Phone, timestamp=1548894897524, value=777-777-7777
     1002                              column=Contact:State, timestamp=1548895103231, value=WA
     1002                              column=Contact:ZipCode, timestamp=1548895104804, value=98008
     1002                              column=Name:First, timestamp=1548894897419, value=Robert
     1002                              column=Name:Last, timestamp=1548894897487, value=Stevens
    2 row(s) in 0.1000 seconds
    ```

### Access data as marketing_user1

1. Open a new SSH connection to the cluster. Use the following command to sign in as **marketing_user1**:

   ```bash
   ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
   ```

1. Use the kinit command to change to the context of our desired user

   ```bash
   kinit marketing_user1
   ```

1. Open the HBase shell and scan the table `Customers`:

    ```hbaseshell
    hbase shell
    scan `Customers`
    ```

1. Notice that the marketing user can only view the five columns of the `Contact` column-family.

    ```hbaseshell
    ROW                                COLUMN+CELL
     1001                              column=Contact:Address, timestamp=1548894873820, value=313 133rd Place
     1001                              column=Contact:City, timestamp=1548895061523, value=Redmond
     1001                              column=Contact:Phone, timestamp=1548894871759, value=333-333-3333
     1001                              column=Contact:State, timestamp=1548895061613, value=WA
     1001                              column=Contact:ZipCode, timestamp=1548895063111, value=98052
     1002                              column=Contact:Address, timestamp=1548894899174, value=717 177th Ave
     1002                              column=Contact:City, timestamp=1548895103129, value=Bellevue
     1002                              column=Contact:Phone, timestamp=1548894897524, value=777-777-7777
     1002                              column=Contact:State, timestamp=1548895103231, value=WA
     1002                              column=Contact:ZipCode, timestamp=1548895104804, value=98008
    2 row(s) in 0.0730 seconds
    ```

1. View the audit access events from the Ranger UI.

   :::image type="content" source="./media/apache-domain-joined-run-hbase/apache-ranger-admin-audit.png" alt-text="HDInsight Ranger UI Policy Audit" border="true":::

## Clean up resources

If you're not going to continue to use this application, delete the HBase cluster that you created with the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the **Search** box at the top, type **HDInsight**. 
1. Select **HDInsight clusters** under **Services**.
1. In the list of HDInsight clusters that appears, click the **...** next to the cluster that you created for this tutorial. 
1. Click **Delete**. Click **Yes**.

## Next steps

> [!div class="nextstepaction"]
> [Get started with an Apache HBase](../hbase/apache-hbase-tutorial-get-started-linux.md)
