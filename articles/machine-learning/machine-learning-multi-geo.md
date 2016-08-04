<properties
   pageTitle="Multi-Geo Help documentation | Microsoft Azure"
   description="Learn how to create a workspace and publish a web service in an Azure region different from the South Central United States (SCUS) Azure region."
   services="machine-learning"
   documentationCenter=""
   authors="tedway"
   manager="paulettm"
   editor="rmca14"
   tags=""/>

<tags
   ms.service="machine-learning"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/09/2016"
   ms.author="tedway; neerajkh"/>

# Multi-Geo Help documentation

This article describes how you can create a workspace and publish a web service in other Azure regions.

## Create a workspace

1. Sign in to the Azure Classic Portal.

2.  Click **+NEW** > **DATA SERVICES** > **MACHINE LEARNING** > **QUICK CREATE**.  Under **LOCATION** select another region, such as **Southeast Asia**.
![Multi-Geo Help image 1][1]
3. Select the workspace, and then click **Sign-in to ML Studio**.
![Multi-Geo Help image 2][2]

4. You now have a workspace in another region that you may use just like any other workspace. To switch among your workspaces, look to the upper right of your screen. Click the dropdown, select the region, and then select the workspace. Everything is local to the workspace region; for example, all of your web services created from a workspace will be in the same region the workspace is located in.
![Multi-Geo Help image 3][3]

## Open an experiment from Gallery

If you open an experiment from Gallery, you can also select which region you want to copy the experiment to.

![Multi-Geo Help image 4][4a]

## Web service management

To programmatically manage web services, such as for retraining, use the region-specific address:
- https://asiasoutheast.management.azureml.net
- https://europewest.management.azureml.net

### Things to note

1.	You can only copy experiments between workspaces that belong to the same region this way. If you need to copy experiment across workspces in different regions, you can use the [PowerShell](http://aka.ms/amlps) commandlet [*Copy-AmlExperiment*](https://github.com/hning86/azuremlps/blob/master/README.md#copy-amlexperiment) to accomplish that. Another workaround is to publish the experiment into Gallery in unlisted mode, then open it in the workspace from the other region.
2.	The region selector will only show workspaces for one region at a time. In the future, you will be able to see a full list of workspaces you have access to across all regions at the same time.  
3.	A free workspace or Guest Access (anonymous) workspace will be created and hosted in South Central U.S. In the future, you will be able to create Free/Guest Access workspaces in the region that you choose.  
4.	Web services deployed from a workspace in Southeast Asia will also be hosted in Southeast Asia. In the future, you will be able to have the flexibility of creating experiments in one region, and deploying generated web service endpoints into different regions.  

## More information

Ask a question on the [Azure Machine Learning forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=MachineLearning).

<!--Image references-->
[1]: ./media/machine-learning-multi-geo/multi-geo_1.png
[2]: ./media/machine-learning-multi-geo/multi-geo_2.png
[3]: ./media/machine-learning-multi-geo/multi-geo_3.png
[4a]: ./media/machine-learning-multi-geo/multi-geo_4a.png
