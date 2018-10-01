---
title: Apache Hadoop Oozie workflows in Azure HDInsight clusters with Enterprise Security Package
description: Use Hadoop Oozie in a Linux-based HDInsight Enterprise Security Package. Learn how to define an Oozie workflow and submit an Oozie job.
services: hdinsight
ms.service: hdinsight
author: omidm1
ms.author: omidm
ms.reviewer: mamccrea
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 09/24/2018
---
# Run Apache Oozie in HDInsight Hadoop clusters with Enterprise Security Package
Oozie is a workflow and coordination system that manages Hadoop jobs. Oozie is integrated with the Hadoop stack, and it supports the following jobs:
- Apache MapReduce
- Apache Pig
- Apache Hive
- Apache Sqoop

You can also use Oozie to schedule jobs that are specific to a system, like Java programs or shell scripts.

## Prerequisite
- An Azure HDInsight Hadoop cluster with Enterprise Security Package (ESP). See [Configure HDInsight clusters with ESP](./apache-domain-joined-configure-using-azure-adds.md).

    > [!NOTE]
    > For detailed instructions on using Oozie on non-ESP clusters, see [Use Hadoop Oozie workflows in Linux-based Azure HDInsight](../hdinsight-use-oozie-linux-mac.md).

## Connect to an ESP cluster

For more information on Secure Shell (SSH), see [Connect to HDInsight (Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

1. Connect to the HDInsight cluster by using SSH:  
 ```bash
ssh [DomainUserName]@<clustername>-ssh.azurehdinsight.net
 ```

2. To verify successful Kerberos authentication, use the `klist` command. If not, use `kinit` to start Kerberos authentication.

3. Sign in to the HDInsight gateway to register the OAuth token required to access Azure Data Lake Storage:   
     ```bash
     curl -I -u [DomainUserName@Domain.com]:[DomainUserPassword] https://<clustername>.azurehdinsight.net
	 ```

    A status response code of **200 OK** indicates successful registration. Check the username and password if an unauthorized response is received, such as 401.

## Define the workflow
Oozie workflow definitions are written in Hadoop Process Definition Language (hPDL). hPDL is an XML process definition language. Take the following steps to define the workflow:

1.	Set up a domain user’s workspace:
 ```bash
hdfs dfs -mkdir /user/<DomainUser>
cd /home/<DomainUserPath>
cp /usr/hdp/<ClusterVersion>/oozie/doc/oozie-examples.tar.gz .
tar -xvf oozie-examples.tar.gz
hdfs dfs -put examples /user/<DomainUser>/
 ```
Replace `DomainUser` with the domain user name. 
Replace `DomainUserPath` with the home directory path for the domain user. 
Replace `ClusterVersion` with your cluster Hortonworks Data Platform (HDP) version.

2.	Use the following statement to create and edit a new file:
 ```bash
nano workflow.xml
 ```

3. After the nano editor opens, enter the following XML as the file contents:
 ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <workflow-app xmlns="uri:oozie:workflow:0.4" name="map-reduce-wf">
       <credentials>
          <credential name="metastore_token" type="hcat">
             <property>
                <name>hcat.metastore.uri</name>
                <value>thrift://hn0-<clustername>.<Domain>.com:9083</value>
             </property>
             <property>
                <name>hcat.metastore.principal</name>
                <value>hive/_HOST@<Domain>.COM</value>
             </property>
          </credential>
          <credential name="hs2-creds" type="hive2">
             <property>
                <name>hive2.server.principal</name>
                <value>${jdbcPrincipal}</value>
             </property>
             <property>
                <name>hive2.jdbc.url</name>
                <value>${jdbcURL}</value>
             </property>
          </credential>
       </credentials>
       <start to="mr-test" />
       <action name="mr-test">
          <map-reduce>
             <job-tracker>${jobTracker}</job-tracker>
             <name-node>${nameNode}</name-node>
             <prepare>
                <delete path="${nameNode}/user/${wf:user()}/examples/output-data/mrresult" />
             </prepare>
             <configuration>
                <property>
                   <name>mapred.job.queue.name</name>
                   <value>${queueName}</value>
                </property>
                <property>
                   <name>mapred.mapper.class</name>
                   <value>org.apache.oozie.example.SampleMapper</value>
                </property>
                <property>
                   <name>mapred.reducer.class</name>
                   <value>org.apache.oozie.example.SampleReducer</value>
                </property>
                <property>
                   <name>mapred.map.tasks</name>
                   <value>1</value>
                </property>
                <property>
                   <name>mapred.input.dir</name>
                   <value>/user/${wf:user()}/${examplesRoot}/input-data/text</value>
                </property>
                <property>
                   <name>mapred.output.dir</name>
                   <value>/user/${wf:user()}/${examplesRoot}/output-data/mrresult</value>
                </property>
             </configuration>
          </map-reduce>
          <ok to="myHive2" />
          <error to="fail" />
       </action>
       <action name="myHive2" cred="hs2-creds">
          <hive2 xmlns="uri:oozie:hive2-action:0.2">
             <job-tracker>${jobTracker}</job-tracker>
             <name-node>${nameNode}</name-node>
             <jdbc-url>${jdbcURL}</jdbc-url>
             <script>${hiveScript2}</script>
             <param>hiveOutputDirectory2=${hiveOutputDirectory2}</param>
          </hive2>
          <ok to="myHive" />
          <error to="fail" />
       </action>
       <action name="myHive" cred="metastore_token">
          <hive xmlns="uri:oozie:hive-action:0.2">
             <job-tracker>${jobTracker}</job-tracker>
             <name-node>${nameNode}</name-node>
             <configuration>
                <property>
                   <name>mapred.job.queue.name</name>
                   <value>${queueName}</value>
                </property>
             </configuration>
             <script>${hiveScript1}</script>
             <param>hiveOutputDirectory1=${hiveOutputDirectory1}</param>
          </hive>
          <ok to="end" />
          <error to="fail" />
       </action>
       <kill name="fail">
          <message>Oozie job failed, error message[${wf:errorMessage(wf:lastErrorNode())}]</message>
       </kill>
       <end name="end" />
    </workflow-app>
 ```
4. Replace `clustername` with the name of the cluster. 

5. To save the file, select Ctrl+X. Enter `Y`. Then select **Enter**.

    The workflow is divided into two parts:
    *	**Credential section.** This section takes in the credentials that are used for authenticating Oozie actions:

       This example uses authentication for Hive actions. To learn more, see [Action Authentication](https://oozie.apache.org/docs/4.2.0/DG_ActionAuthentication.html).

       The credential service allows Oozie actions to impersonate the user for accessing Hadoop services.

    *	**Action section.** This section has three actions: map-reduce, Hive server 2, and Hive server 1:

      - The map-reduce action runs an example from an Oozie package for map-reduce that outputs the aggregated word count.

       - The Hive server 2 and Hive server 1 actions run a query on a sample Hive table provided with HDInsight.

        The Hive actions use the credentials defined in the credentials section for authentication by using the keyword `cred` in the action element.

6. Use the following command to copy the `workflow.xml` file to `/user/<domainuser>/examples/apps/map-reduce/workflow.xml`:
     ```bash
    hdfs dfs -put workflow.xml /user/<domainuser>/examples/apps/map-reduce/workflow.xml
     ```

7. Replace `domainuser` with your username for the domain.

## Define the properties file for the Oozie job

1. Use the following statement to create and edit a new file for job properties:

   ```bash
   nano job.properties
   ```

2. After the nano editor opens, use the following XML as the contents of the file:

   ```bash
       nameNode=adl://home
       jobTracker=headnodehost:8050
       queueName=default
       examplesRoot=examples
       oozie.wf.application.path=${nameNode}/user/[domainuser]/examples/apps/map-reduce/workflow.xml
       hiveScript1=${nameNode}/user/${user.name}/countrowshive1.hql
       hiveScript2=${nameNode}/user/${user.name}/countrowshive2.hql
       oozie.use.system.libpath=true
       user.name=[domainuser]
       jdbcPrincipal=hive/hn0-<ClusterShortName>.<Domain>.com@<Domain>.COM
       jdbcURL=[jdbcurlvalue]
       hiveOutputDirectory1=${nameNode}/user/${user.name}/hiveresult1
       hiveOutputDirectory2=${nameNode}/user/${user.name}/hiveresult2
   ```
  
   a. Replace `domainuser` with your username for the domain.  
   b. Replace `ClusterShortName` with the short name for the cluster. For example, if the cluster name is https:// *[example link]* sechadoopcontoso.azurehdisnight.net, the `clustershortname` is the first six characters of the cluster: **sechad**.  
   c. Replace `jdbcurlvalue` with the JDBC URL from the Hive configuration. An example is jdbc:hive2://headnodehost:10001/;transportMode=http.      
   d. To save the file, select Ctrl+X, enter `Y`, and then select **Enter**.

   This properties file needs to be present locally when running Oozie jobs.

## Create custom Hive scripts for Oozie jobs
You can create the two Hive scripts for Hive server 1 and Hive server 2 as shown in the following sections.
### Hive server 1 file
1.	Create and edit a file for Hive server 1 actions:
    ```bash
    nano countrowshive1.hql
    ```

2.	Create the script:
    ```sql
    INSERT OVERWRITE DIRECTORY '${hiveOutputDirectory1}' 
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    select devicemake from hivesampletable limit 2;
    ```

3.	Save the file to Hadoop Distributed File System (HDFS):
    ```bash
    hdfs dfs -put countrowshive1.hql countrowshive1.hql
    ```

### Hive server 2 file
1.	Create and edit a field for Hive server 2 actions:
    ```bash
    nano countrowshive2.hql
    ```

2.	Create the script:
    ```sql
    INSERT OVERWRITE DIRECTORY '${hiveOutputDirectory1}' 
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    select devicemodel from hivesampletable limit 2;
    ```

3.	Save the file to HDFS:
    ```bash
    hdfs dfs -put countrowshive2.hql countrowshive2.hql
    ```

## Submit Oozie jobs
Submitting Oozie jobs for ESP clusters is like submitting Oozie jobs in non-ESP clusters.

For more information, see [Use Oozie with Hadoop to define and run a workflow on Linux-based Azure HDInsight](../hdinsight-use-oozie-linux-mac.md).

## Results from an Oozie job submission
Oozie jobs are run for the user. So both Apache YARN and Apache Ranger audit logs show the jobs being run as the impersonated user. The command-line interface output of an Oozie job looks like the following code:


```bash
    Job ID : 0000015-180626011240801-oozie-oozi-W
    ------------------------------------------------------------------------------------------------
    Workflow Name : map-reduce-wf
    App Path      : adl://home/user/alicetest/examples/apps/map-reduce/wf.xml
    Status        : SUCCEEDED
    Run           : 0
    User          : alicetest
    Group         : -
    Created       : 2018-06-26 19:25 GMT
    Started       : 2018-06-26 19:25 GMT
    Last Modified : 2018-06-26 19:30 GMT
    Ended         : 2018-06-26 19:30 GMT
    CoordAction ID: -
    
    Actions
    ------------------------------------------------------------------------------------------------
    ID						Status	Ext ID			ExtStatus	ErrCode
    ------------------------------------------------------------------------------------------------
    0000015-180626011240801-oozie-oozi-W@:start:	OK	-			OK		-
    ------------------------------------------------------------------------------------------------
    0000015-180626011240801-oozie-oozi-W@mr-test	OK	job_1529975666160_0051	SUCCEEDED	-
    ------------------------------------------------------------------------------------------------
    0000015-180626011240801-oozie-oozi-W@myHive2	OK	job_1529975666160_0053	SUCCEEDED	-
    ------------------------------------------------------------------------------------------------
    0000015-180626011240801-oozie-oozi-W@myHive	OK	job_1529975666160_0055	SUCCEEDED	-
    ------------------------------------------------------------------------------------------------
    0000015-180626011240801-oozie-oozi-W@end	OK	-			OK		-
    -----------------------------------------------------------------------------------------------
```

The Ranger audit logs for Hive server 2 actions show Oozie running the action for the user. The Ranger and YARN views are visible only to the cluster admin.

## Configure user authorization in Oozie
Oozie by itself has a user authorization configuration that can block users from stopping or deleting other users' jobs. To enable this configuration, set the `oozie.service.AuthorizationService.security.enabled` to `true`. 

For more information, see [Oozie Installation and Configuration](https://oozie.apache.org/docs/3.2.0-incubating/AG_Install.html).

For components like Hive server 1 where the Ranger plug-in isn't available or supported, only coarse-grained HDFS authorization is possible. Fine-grained authorization is available only through Ranger plug-ins.

## Get the Oozie web UI
The Oozie web UI provides a web-based view into the status of Oozie jobs on the cluster. To get the web UI, take the following steps in ESP clusters:

1. Add an [edge node](../hdinsight-apps-use-edge-node.md) and enable [SSH Kerberos authentication](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. Follow the [Oozie web UI](../hdinsight-use-oozie-linux-mac.md) steps to enable SSH tunneling to the edge node and access the web UI.

## Next steps
* [Use Oozie with Hadoop to define and run a workflow on Linux-based Azure HDInsight](../hdinsight-use-oozie-linux-mac.md).
* [Use time-based Oozie coordinator](../hdinsight-use-oozie-coordinator-time.md).
* [Connect to HDInsight (Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).
