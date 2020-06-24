---
title: Manage Enterprise Security Package clusters - Azure HDInsight
description: Learn how to manage Azure HDInsight clusters with Enterprise Security Package.
author: omidm1
ms.author: omidm
ms.reviewer: jasonh 
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/04/2019
---

# Manage HDInsight clusters with Enterprise Security Package

Learn the users and the roles in HDInsight Enterprise Security Package (ESP), and how to manage ESP clusters.

## Use VSCode to link to domain joined cluster

You can link a normal cluster by using Apache Ambari managed username, also link a security Apache Hadoop cluster by using domain username (such as: `user1@contoso.com`).

1. Open [Visual Studio Code](https://code.visualstudio.com/). Ensure the [Spark & Hive Tools](../hdinsight-for-vscode.md) extension is installed.

1. Follow the steps from [Link a cluster](../hdinsight-for-vscode.md#link-a-cluster) for Visual Studio Code.

## Use IntelliJ to link to domain joined cluster

You can link a normal cluster by using Ambari managed username, also link a security hadoop cluster by using domain username (such as: `user1@contoso.com`).

1. Open IntelliJ IDEA. Ensure all [prerequisites](../spark/apache-spark-intellij-tool-plugin.md#prerequisites) are met.

1. Follow the steps from [Link a cluster](../spark/apache-spark-intellij-tool-plugin.md#link-a-cluster) for IntelliJ.

## Use Eclipse to link to domain joined cluster

You can link a normal cluster by using Ambari managed username, also link a security hadoop cluster by using domain username (such as: `user1@contoso.com`).

1. Open Eclipse. Ensure all [prerequisites](../spark/apache-spark-eclipse-tool-plugin.md#prerequisites) are met.

1. Follow the steps from [Link a cluster](../spark/apache-spark-eclipse-tool-plugin.md#link-a-cluster) for Eclipse.

## Access the clusters with Enterprise Security Package

Enterprise Security Package (previously known as HDInsight Premium) provides multi-user access to the cluster, where authentication is done by Active Directory and authorization by Apache Ranger and Storage ACLs (ADLS ACLs). Authorization provides secure boundaries among multiple users and allows only privileged users to have access to the data based on the authorization policies.

Security and user isolation are important for a HDInsight cluster with Enterprise Security Package. To meet these requirements, SSH access to the cluster with Enterprise Security Package is blocked. The following table shows the recommended access methods for each cluster type:

|Workload|Scenario|Access Method|
|--------|--------|-------------|
|Apache Hadoop|Hive – Interactive Jobs/Queries	|<ul><li>[Beeline](#beeline)</li><li>[Hive View](../hadoop/apache-hadoop-use-hive-ambari-view.md)</li><li>[ODBC/JDBC – Power BI](../hadoop/apache-hadoop-connect-hive-power-bi.md)</li><li>[Visual Studio Tools](../hadoop/apache-hadoop-visual-studio-tools-get-started.md)</li></ul>|
|Apache Spark|Interactive Jobs/Queries, PySpark interactive|<ul><li>[Beeline](#beeline)</li><li>[Zeppelin with Livy](../spark/apache-spark-zeppelin-notebook.md)</li><li>[Hive View](../hadoop/apache-hadoop-use-hive-ambari-view.md)</li><li>[ODBC/JDBC – Power BI](../hadoop/apache-hadoop-connect-hive-power-bi.md)</li><li>[Visual Studio Tools](../hadoop/apache-hadoop-visual-studio-tools-get-started.md)</li></ul>|
|Apache Spark|Batch Scenarios – Spark submit, PySpark|<ul><li>[Livy](../spark/apache-spark-livy-rest-interface.md)</li></ul>|
|Interactive Query (LLAP)|Interactive|<ul><li>[Beeline](#beeline)</li><li>[Hive View](../hadoop/apache-hadoop-use-hive-ambari-view.md)</li><li>[ODBC/JDBC – Power BI](../hadoop/apache-hadoop-connect-hive-power-bi.md)</li><li>[Visual Studio Tools](../hadoop/apache-hadoop-visual-studio-tools-get-started.md)</li></ul>|
|Any|Install Custom Application|<ul><li>[Script Actions](../hdinsight-hadoop-customize-cluster-linux.md)</li></ul>|

   > [!NOTE]  
   > Jupyter is not installed/supported in Enterprise Security Package.

Using the standard APIs helps from security perspective. You also get the following benefits:

- **Management** – You can manage your code and automate jobs using standard APIs – Livy, HS2 etc.
- **Audit** – With SSH, there's no way to audit, which users SSH'd to the cluster. This wouldn’t be the case when jobs are constructed via standard endpoints as they would be executed in context of user.

### <a name="beeline"></a>Use Beeline

Install Beeline on your machine, and connect over the public internet, use the following parameters:

```
- Connection string: -u 'jdbc:hive2://<clustername>.azurehdinsight.net:443/;ssl=true;transportMode=http;httpPath=/hive2'
- Cluster login name: -n admin
- Cluster login password -p 'password'
```

If you have Beeline installed locally, and connect over an Azure Virtual Network, use the following parameters:

```
Connection string: -u 'jdbc:hive2://<headnode-FQDN>:10001/;transportMode=http'
```

To find the fully qualified domain name of a headnode, use the information in the Manage HDInsight using the Ambari REST API document.

## Users of HDInsight clusters with ESP

A non-ESP HDInsight cluster has two user accounts that are created during the cluster creation:

- **Ambari admin**: This account is also known as *Hadoop user* or *HTTP user*. This account can be used to sign in to Ambari at `https://CLUSTERNAME.azurehdinsight.net`. It can also be used to run queries on Ambari views, execute jobs via external tools (for example, PowerShell, Templeton, Visual Studio), and authenticate with the Hive ODBC driver and BI tools (for example, Excel,  Power BI, or Tableau).

A HDInsight cluster with ESP has three new users in addition to Ambari Admin.

- **Ranger admin**:  This account is the local Apache Ranger admin account. It isn't an active directory domain user. This account can be used to setup policies and make other users admins or delegated admins (so that those users can manage policies). By default, the username is *admin* and the password is the same as the Ambari admin password. The password can be updated from the Settings page in Ranger.

- **Cluster admin domain user**: This account is an active directory domain user designated as the Hadoop cluster admin including Ambari and Ranger. You must provide this user’s credentials during cluster creation. This user has the following privileges:
    - Join machines to the domain and place them within the OU that you specify during cluster creation.
    - Create service principals within the OU that you specify during cluster creation.
    - Create reverse DNS entries.

    Note the other AD users also have these privileges.

    There are some end points within the cluster (for example, Templeton) which are not managed by Ranger, and hence aren't secure. These end points are locked down for all users except the cluster admin domain user.

- **Regular**: During cluster creation, you can provide multiple active directory groups. The users in these groups are synced to Ranger and Ambari. These users are domain users and have access to only Ranger-managed endpoints (for example, Hiveserver2). All the RBAC policies and auditing will be applicable to these users.

## Roles of HDInsight clusters with ESP

HDInsight Enterprise Security Package has the following roles:

- Cluster Administrator
- Cluster Operator
- Service Administrator
- Service Operator
- Cluster User

**To see the permissions of these roles**

1. Open the Ambari Management UI.  See [Open the Ambari Management UI](#open-the-ambari-management-ui).
2. From the left menu, select **Roles**.
3. Select the blue question mark to see the permissions:

    ![ESP HDInsight roles permissions](./media/apache-domain-joined-manage/hdinsight-domain-joined-roles-permissions.png)

## Open the Ambari Management UI

1. Navigate to `https://CLUSTERNAME.azurehdinsight.net/` where CLUSTERNAME is the name of your cluster.
1. Sign in to Ambari using the cluster administrator domain user name and password.
1. Select the **admin** dropdown menu from the upper right corner, and then select **Manage Ambari**.

    ![ESP HDInsight manage Apache Ambari](./media/apache-domain-joined-manage/hdinsight-domain-joined-manage-ambari.png)

    The UI looks like:

    ![ESP HDInsight Apache Ambari management UI](./media/apache-domain-joined-manage/hdinsight-domain-joined-ambari-management-ui.png)

## List the domain users synchronized from your Active Directory

1. Open the Ambari Management UI.  See [Open the Ambari Management UI](#open-the-ambari-management-ui).
2. From the left menu, select **Users**. You shall see all the users synced from your Active Directory to the HDInsight cluster.

    ![ESP HDInsight Ambari management UI list users](./media/apache-domain-joined-manage/hdinsight-domain-joined-ambari-management-ui-users.png)

## List the domain groups synchronized from your Active Directory

1. Open the Ambari Management UI.  See [Open the Ambari Management UI](#open-the-ambari-management-ui).
2. From the left menu, select **Groups**. You shall see all the groups synced from your Active Directory to the HDInsight cluster.

    ![ESP HDInsight Ambari management UI list groups](./media/apache-domain-joined-manage/hdinsight-domain-joined-ambari-management-ui-groups.png)

## Configure Hive Views permissions

1. Open the Ambari Management UI.  See [Open the Ambari Management UI](#open-the-ambari-management-ui).
2. From the left menu, select **Views**.
3. Select **HIVE** to show the details.

    ![ESP HDInsight Ambari management UI Hive Views](./media/apache-domain-joined-manage/hdinsight-domain-joined-ambari-management-ui-hive-views.png)

4. Select the **Hive View** link to configure Hive Views.
5. Scroll down to the **Permissions** section.

    ![ESP HDInsight Ambari management UI Hive Views configure permissions](./media/apache-domain-joined-manage/hdinsight-domain-joined-ambari-management-ui-hive-views-permissions.png)

6. Select **Add User** or **Add Group**, and then specify the users or groups that can use Hive Views.

## Configure users for the roles

 To see a list of roles and their permissions, see Roles of HDInsight clusters with ESP.

1. Open the Ambari Management UI.  See [Open the Ambari Management UI](#open-the-ambari-management-ui).
2. From the left menu, select **Roles**.
3. Select **Add User** or **Add Group** to assign users and groups to different roles.

## Next steps

- For configuring a HDInsight cluster with Enterprise Security Package, see [Configure HDInsight clusters with ESP](apache-domain-joined-configure.md).
- For configuring Hive policies and run Hive queries, see [Configure Apache Hive policies for HDInsight clusters with ESP](apache-domain-joined-run-hive.md).
