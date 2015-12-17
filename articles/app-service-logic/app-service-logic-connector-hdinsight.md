<properties
   pageTitle="Using the HDInsight connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the HDInsight Connector or API app and use it in a logic app in Azure App Service"
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
   ms.date="10/22/2015"
   ms.author="sameerch"/>


# Get started with the HDInsight Connector and add it to your Logic App
HDInsight Connector lets you create a Hadoop cluster on Azure and submit various Hadoop jobs such as Hive, Pig, MapReduce and Streaming MapReduce jobs. Azure HDInsight service deploys and provisions Apache Hadoop clusters in the cloud, providing a software framework designed to manage, analyze, and report on big data. The Hadoop core provides reliable data storage with the Hadoop Distributed File System (HDFS), and a simple MapReduce programming model to process and analyze, in parallel, the data stored in this distributed system. Using HDInsight connector, you can create or delete a cluster, submit a job and wait for it to complete.

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. You can add the HDInsight connector to your business workflow and process data as part of this workflow within a Logic App. 

### Basic Actions

- Create Cluster
- Wait For Cluster Creation
- Submit Pig Job
- Submit Hive Job
- Submit MapReduce Job
- Wait For Job Completion
- Delete Cluster


## Create the HDInsight Connector API App ##

A connector can be created within a logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace: 

1. In the Azure startboard, select **Marketplace**.
2. Search for “HDInsight Connector”, select it, and select **Create**.
3. Enter the Name, App Service Plan, and other properties.
4. In the Package settings, enter the HDInsight cluster user name and password. Select **OK**.
5. Select **Create**:  
![][1]  

## Certificate Configuration (Optional) ##

> [AZURE.NOTE] This step is required only if you want to perform management operations (create and delete of clusters) in logic app.

Browse to the just created HDInsight Connector API App and you will see that the 'Security' component shows 0 - meaning that there is no management certificate uploaded:  
![][2]

To upload the management certificate to your API App:

1. Select the 'Security' component.
2. In the 'Security' blade, select **UPLOAD CERTIFICATE**.
3. Browse and select the certificate file in the next blade.
4. Once the certificate is selected, select **OK**.

Once the certificate is successfully uploaded, the certificate details are shown:  
![][3]

> [AZURE.NOTE] If you want to change the certificate, you can upload another certificate, which replaces the existing certificate.

## Using the connector in a Logic App ##

HDInsight Connector can be used only as an action in a logic app. Let us take a simple logic app which creates a cluster, runs a 'Hive' job and deletes the cluster when the job completes.


1. In the 'Start logic' card, click 'Run this logic manually'.
2. Select the HDInsight Connector API App you created earlier in the gallery (You will find the HDInsight connector you created in the API Apps list on the right of your screen.). Select the black right arrow. The available actions are presented:  
![][12]

3. Select 'Create Cluster', enter all the required cluster parameters, and select the ✓:   
![][6]

4. The action now appears as configured in the logic app. The output(s) of the action are shown and can be used as inputs in any subsequent actions:  
![][7]

5. Select the same HDInsight connector from the gallery as an action. Select the 'Wait For Cluster Creation' action, enter all the required parameters, and select the ✓:  
![][8]

6. Select the same HDInsight connector from the gallery as an action. Select the 'Submit Hive Job' action, enter all the required parameters, and select the ✓:  
![][9]

7. Select the same HDInsight connector from the gallery as an action. Select the 'Wait For Job Completion' action, enter all the required parameters, and select the ✓:  
![][10]

8. Select the same HDInsight connector from the gallery as an action. Select the 'Delete Cluster' action, enter all the required parameters, and select the ✓:  
![][11]

9. Save the logic app using the save command at the top of the designer.

To test the scenario, select **Run Now** to start the logic app manually.

## Do more with your Connector
Now that the connector is created, you can add it to a business workflow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).


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
[12]: ./media/app-service-logic-connector-hdinsight/LogicApp8.PNG
