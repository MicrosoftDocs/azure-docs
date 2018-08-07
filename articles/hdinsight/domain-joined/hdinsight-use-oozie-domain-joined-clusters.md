---
title: Hadoop Oozie workflows in HDInsight Domain Joined Clusters
description: Use Hadoop Oozie in Linux-based HDInsight Domain Joined Enterprise Security Package. Learn how to define an Oozie workflow and submit an Oozie job.
services: hdinsight
ms.service: hdinsight
author: omidm1
ms.author: omidm
editor: jasonwhowell
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/26/2018
---
#Run Apache Oozie in Domain Joined HDInsight Hadoop clusters
Oozie is a workflow and coordination system that manages Hadoop jobs. Oozie is integrated with the Hadoop stack, and it supports the following jobs:
- Apache MapReduce
- Apache Pig
- Apache Hive
- Apache Sqoop

You can also use Oozie to schedule jobs that are specific to a system, like Java programs or shell scripts.

##Prerequisites:
- A Domain-joined HDInsight Hadoop cluster. See [Configure Domain-joined HDInsight clusters](./apache-domain-joined-configure-using-azure-adds.md)

    > [!NOTE]
    > To see detailed instructions for using Oozie on non-domain joined clusters see [this](../hdinsight-use-oozie-linux-mac.md)

##Connecting to domain joined cluster
For more info on SSH see [Authentication: Domain-joined HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).
- Connect to the HDInsight cluster using SSH:
     ```bash
	ssh [DomainUserName]@<clustername>-ssh.azurehdinsight.net
    ```
To verify if Kerberos authentication was successful, use `klist` command. If not, use `kinit` to initiate Kerberos authentication.

- Log in to HDInsight gateway to register the oAuth token required for accessing Azure Data Lake Store (ADLS)
     ```bash
     curl -I -u [DomainUserName@Domain.com]:[DomainUserPassword] https://<clustername>.azurehdinsight.net
	 ```

    A status response code of _200 OK_ indicates successful registration. Check for the username and password if an unauthorized response is received (401).

## Define the workflow
Oozie workflow definitions are written in Hadoop Process Definition Language (hPDL), which is an XML process definition language. Use the following steps to define the workflow:

-	Setting up domain user’s workspace:
 ```bash
hdfs dfs -mkdir /user/<DomainUser>
cd /home/<DomainUserPath>
cp /usr/hdp/<ClusterVersion>/oozie/doc/oozie-examples.tar.gz .
tar -xvf oozie-examples.tar.gz
hdfs dfs -put examples /user/<DomainUser>/
 ```
Replace `DomainUser` with the domain user name. 
Replace `DomainUserPath` with the home directory path for the domain user. 
Replace `ClusterVersion` with your cluster HDP version.

-	Use the following statement to create and edit a new file:
 ```bash
nano workflow.xml
 ```

- After the nano editor opens, enter the following XML as the file contents:
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
Replace `clustername` with the name of the cluster. 

To save the file, select Ctrl+X, enter `Y`, and then select **Enter**.

The workflow is divided into two parts:
*	Credential Section: The credential section takes in the credentials that will be used for authenticating oozie actions:

    In this example, authentication for Hive actions is used. To learn more, see [this]( https://oozie.apache.org/docs/4.2.0/DG_ActionAuthentication.html).

    The credential service allows oozie actions to impersonate the user for accessing Hadoop services.

*	Action Section: We have three actions here- map-reduce, hive server 2 action and a hive server 1 action:

    The map-reduce runs an example from oozie package for map-reduce which outputs the aggregated word count.

    The hive server 2 and hive server 1 actions executes a simple query on hivesample table provided with HDInsight.

    The hive actions use the credentials defined in the credentials section for authentication using the keyword `cred` in the action element

- Use the following command to copy the `workflow.xml` file to `/user/<domainuser>/examples/apps/map-reduce/workflow.xml`:
     ```bash
    hdfs dfs -put workflow.xml /user/<domainuser>/examples/apps/map-reduce/workflow.xml
     ```

    Replace `domainuser` with your username for the domain.

## Define the properties file for the Oozie job

1.	Use the following statement to create and edit a new file for job properties:
     ```bash
    nano job.properties
     ```

2.	 After the nano editor opens, use the following XML as the contents of the file:

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
    

   * Replace `domainuser` with your username for the domain.
   * Replace `ClusterShortName` with shortname for the cluster. If the clustername is https://sechadoopcontoso.azurehdisnight.net, the `clustershortname` is the first six letters for the cluster: sechad
   * Replace `jdbcurlvalue` with JDBC url from hive config. For example, jdbc:hive2://headnodehost:10001/;transportMode=http .
    
   * To save the file, select Ctrl+X, enter `Y`, and then select **Enter**.

   * This properties file needs to be present locally when running oozie jobs

## Creating custom hive scripts for the Oozie job
The 2 hive scripts for hive server 1 and hive server 2 can be created as following:
-	Hive Server 1 file:
1.	Use the following statement to create and edit a file for hive server 1 action:
    ```bash
    nano countrowshive1.hql
    ```

2.	Create the script
    ```sql
    INSERT OVERWRITE DIRECTORY '${hiveOutputDirectory1}' 
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    select devicemake from hivesampletable limit 2;
    ```

3.	Save the file to Hdfs
    ```bash
    hdfs dfs -put countrowshive1.hql countrowshive1.hql
    ```

-	Hive Server 2 file:
1.	Use the following statement to create and edit a field for hive server 2 action:
    ```bash
    nano countrowshive2.hql
    ```

2.	Create the script
    ```sql
    INSERT OVERWRITE DIRECTORY '${hiveOutputDirectory1}' 
    ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
    select devicemodel from hivesampletable limit 2;
    ```

3.	Save the file to Hdfs
    ```bash
    hdfs dfs -put countrowshive2.hql countrowshive2.hql
    ```

## Submission of Oozie jobs
Submitting oozie jobs for domain joined clusters is similar to submitting oozie jobs in non-domain joined clusters.

For more info please see [submit and manage the job](../hdinsight-use-oozie-linux-mac.md).

## Results from Oozie job submission
Since oozie jobs are run on-behalf of the user, both Yarn and Ranger audit logs show the jobs being executed as the impersonated user. The CLI output of the oozie job look like below:


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

*    The Ranger audit logs for hive server 2 actions shows oozie executing the action on behalf of the user. The ranger and Yarn view is only visible to the cluster admin.

## Configuration of User Authorization in Oozie
Oozie by itself has a User Authorization configuration, which can block users from stopping, killing other user’s jobs. This is enabled by setting the `oozie.service.AuthorizationService.security.enabled` to `true`. 

More details on this can be found in Oozie documentation section- [User Authorization Configuration]( https://oozie.apache.org/docs/3.2.0-incubating/AG_Install.html):

For components such as hive server 1 where Ranger plugin is not available/supported, only coarse-grained hdfs authorization is possible. Fine grained authorization is only available through ranger plugins.

## Oozie web UI
The Oozie web UI provides a web-based view into the status of Oozie jobs on the cluster. In domain joined clusters you need to:

1. Add an [edge node](../hdinsight-apps-use-edge-node.md) and enable [SSH Kerberos authentication](../hdinsight-hadoop-linux-use-ssh-unix.md)

2. Follow the [Oozie web UI](../hdinsight-use-oozie-linux-mac.md) steps to enable SSH tunneling to the edge node and access the web UI.

## Next steps
* [Use Oozie with Hadoop to define and run a workflow on Linux-based Azure HDInsight](../hdinsight-use-oozie-linux-mac.md)
* [Use time-based Oozie coordinator](../hdinsight-use-oozie-coordinator-time.md)
* [Running Hive queries using SSH on Domain-joined HDInsight clusters](../hdinsight-hadoop-linux-use-ssh-unix.md#domainjoined).
