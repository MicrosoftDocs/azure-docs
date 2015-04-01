<properties 
   pageTitle="HDInsight Connector" 
   description="How to use the HDInsight Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="sutalasi"/>


# Microsoft HDInsight Connector #

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. HDInsight Connector lets you create a Hadoop clusters on Azure and submit various Hadoop jobs such as Hive, Pig, MapReduce and Streaming MapReduce jobs. Azure HDInsight service deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data. The Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system. Using HDInsight connector, you can spin a cluster, submit a job and wait for it to complete.

###Basic Actions
		
- Create Cluster
- Wait For Cluster Creation
- Submit Pig Job
- Submit Hive Job
- Submit MapReduce Job
- Wait For Job Completion
- Delete Cluster


## Create an instance of the HDInsight Connector API App ##

To use the HDInsight Connector, you need to create an instance of the HDInsight Connector API App. The can be done as follows:

1. Open the Azure Marketplace using the '+ NEW' option at the bottom left of the Azure Portal
2. Browse to “Web and Mobile > API apps” and search for “HDInsight Connector”
3. Provide the generic details such as Name, App service plan, and so on in the first blade
4. As part of Package settings, provide the HDInsight cluster user name and password


 ![][1]  

## Certificate Configuration (Optional) ##

Note: This step is required only if you want to perform management operations (create and delete of clusters) in logic app.

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you will see the following behavior. The 'Security' component shows 0 - meaning that there is no management certificate uploaded.

![][2] 

To upload the management certificate to your API App, you need to do the following
1. Click on the 'Security' component
2. Click on the 'Upload certificate' in the 'Security' blade that opens
3. Browse and select the certificate file in the next blade
4. Once the certificate is selected, click on OK.

Once the certificate is successfully uploaded, the certificate details are shown.

![][3] 

Note: In case you want to change the certificate, you can upload another certificate which will replace the existing one.

## Usage in a Logic App ##

HDInsight Connector can be used only as an action in logic app. Let us take a simple logic app which creates a cluster, runs a 'Hive' job and deletes the cluster at the end of job completion.


- When creating/editing a logic app, choose the HDInsight Connector API App created as the action and it shows all the actions available.

![][5] 


- Select 'Create Cluster', provide all the required cluster parameters and click on the ✓.

![][6] 



- The action will now appear as configured in the logic app. The output(s) of the action will be shown and can be used inputs in a subsequent actions. 

![][7] 



- Select the same HDInsight connector from gallery as an action. Select 'Wait For Cluster Creation' action, provide all the required parameters and click on ✓.

![][8] 



- Select the same HDInsight connector from gallery as an action. Select 'Submit Hive Job' action, provide all the required parameters and click on ✓.

![][9] 



- Select the same HDInsight connector from gallery as an action. Select 'Wait For Job Completion' action, provide all the required parameters and click on ✓.

![][10] 



- Select the same HDInsight connector from gallery as an action. Select 'Submit Hive Job' action, provide all the required parameters and click on ✓.

![][11] 


You can click on 'Run' to start the logic app manually to test the scenario.

<!--Image references-->
[1]: ./media/app-service-logic-connector-hdinsight/Create.jpg
[2]: ./media/app-service-logic-connector-hdinsight/CertNotConfigured.jpg
[3]: ./media/app-service-logic-connector-hdinsight/CertConfigured.jpg
[5]: ./media/app-service-logic-connector-hdinsight/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-hdinsight/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-hdinsight/LogicApp3.jpg
[8]: ./media/app-service-logic-connector-hdinsight/LogicApp4.jpg
[9]: ./media/app-service-logic-connector-hdinsight/LogicApp5.jpg
[10]: ./media/app-service-logic-connector-hdinsight/LogicApp6.jpg
[11]: ./media/app-service-logic-connector-hdinsight/LogicApp7.jpg
