---
title: Bring your own ML into Microsoft Sentinel | Microsoft Docs
description: This article explains how to create and use your own machine learning algorithms for data analysis in Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Bring your own Machine Learning (ML) into Microsoft Sentinel

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Machine Learning (ML) is one of the major underpinnings of Microsoft Sentinel, and one of the main attributes that set it apart. Microsoft Sentinel offers ML in several experiences: built-in to the [Fusion](fusion.md) correlation engine and Jupyter notebooks, and the newly available Build-Your-Own ML (BYO ML) platform. 

ML detection models can adapt to individual environments and to changes in user behavior, to reduce [false positives](false-positives.md) and identify threats that wouldn't be found with a traditional approach. Many security organizations understand the value of ML for security, though not many of them have the luxury of professionals who have expertise in both security and ML. We designed the framework presented here for security organizations and professionals to grow with us in their ML journey. Organizations new to ML, or without the necessary expertise, can get significant protection value out of Microsoft Sentinel's built-in ML capabilities.

:::image type="content" source="./media/bring-your-own-ml/machine-learning-framework.png" alt-text="machine learning framework":::


## What is the Bring Your Own Machine Learning (BYO-ML) platform?

For organizations that have ML resources and would like to build customized ML models for their unique business needs, we offer the **BYO-ML platform**. The platform makes use of the [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks)/[Apache Spark](http://spark.apache.org/) environment and Jupyter Notebooks to produce the ML environment. It provides the following components:

- a BYO-ML package, which includes libraries to help you access data and push the results back to Log Analytics (LA), so you can integrate the results with your detection, investigation, and hunting. 

- ML algorithm templates for you to customize to fit specific security problems in your organization. 

- sample notebooks to train the model and schedule the model scoring. 

Besides all this, you can bring your own ML models, and/or your own Spark environment, to integrate with Microsoft Sentinel.

With the BYO-ML platform, you can get a jump start on building your own ML models: 

- The notebook with sample data helps you get hands-on experience end-to-end, without worrying about handling production data.

- The package integrated with the Spark environment reduces the challenges and frictions in managing the infrastructure.

- The libraries support data movements. Training and scoring notebooks demonstrate the end-to-end experience and serve as a template for you to adapt to your environment.

### Use cases
The BYO-ML platform and package significantly reduce the time and effort you'll need to build your own ML detections, and they unleash the capability to address specific security problems in Microsoft Sentinel. The platform supports the following use cases:

**Train an ML algorithm to get a customized model:** You can take an existing ML algorithm (shared by Microsoft or by the user community) and easily train it on your own data to get a customized ML model that better fits your data and environment.

**Modify an ML algorithm template to get customized model:** You can modify an ML algorithm template (shared by Microsoft or by the user community), and train the modified algorithm on your own data, to derive a customized model to fit to your specific problem.

**Create your own model:** Create your own model from scratch using Microsoft Sentinel’s BYO-ML platform and utilities.

**Integrate your Databricks/Spark Environment:** Integrate your existing Databricks/Spark environment into Microsoft Sentinel, and use BYO-ML libraries and templates to build ML models for their unique situations.

**Import your own ML model:** You can import your own ML models and use the BYO-ML platform and utilities to integrate them with Microsoft Sentinel.

**Share an ML algorithm:** Share an ML algorithm for the community to adopt and adapt.

**Use ML to empower SecOps:** use your own custom ML model and results for hunting, detections, investigation, and response.

This article shows you the components of the BYO-ML platform and how to leverage the platform and the Anomalous Resource Access algorithm to deliver a customized ML detection with Microsoft Sentinel.

## Azure Databricks/Spark Environment

[Apache Spark](http://spark.apache.org/) made a leap forward in simplifying big data by providing a unified framework for building data pipelines. Azure Databricks takes this further by providing a zero-management cloud platform built around Spark. We recommend that you use Databricks for your BYO-ML platform, so that you can focus on finding answers that make an immediate impact on your business, rather than tackling the data pipelines and platform issues.

If you already have Databricks or any other Spark environment, and prefer to use the existing setup, the BYO-ML package will work fine on them as well. 

## BYO-ML package

The BYO ML package includes the best practices and research of Microsoft in the front end of the ML for security. In this package, we provide the following list of utilities, Notebooks and algorithm templates for security problems.

| File name | Description |
| --------- | ----------- |
| azure_sentinel_utilities.whl | Contains utilities for reading blobs from Azure and writing to Log Analytics. |
| AnomalousRASampleData | Notebook demonstrates the use of Anomalous Resource Access model in Microsoft Sentinel with generated training and testing sample data. |
| AnomalousRATraining.ipynb | Notebook to train the algorithm, build and save the models. |
| AnomalousRAScoring.ipynb | Notebook to schedule the model to run, visualize the result and write score back to Microsoft Sentinel. |
|

The first ML algorithm template we offer is for [Anomalous Resource Access detection](https://github.com/Azure/Azure-Sentinel/tree/master/BYOML). It's based on a collaborative filtering algorithm and is trained with Windows file share access logs (Security Events with Event ID 5140). The key information you need for this model in the log is the pairing of users and resources accessed. 

## Example Walkthrough: Anomalous File Share Access Detection 

Now that you're acquainted with the key components of the BYO-ML platform, here's an example to show you how to use the platform and components to deliver a customized ML detection.

### Setup the Databricks/Spark Environment

You will need to setup your own Databricks environment if you don’t already have one. Refer to the [Databricks quickstart](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal?tabs=azure-portal) document for instructions.

### Auto-export instruction

To build custom ML models based on your own data in Microsoft Sentinel, you will need to export your data from Log Analytics to a Blob storage or Event hub resource, so that the ML model can access it from Databricks. Learn how to [ingest data into Microsoft Sentinel](connect-data-sources.md).

For this example, you need to have your training data for File Share Access log in the Azure blob storage. The format of the data is documented in the notebook and libraries.

You can automatically export your data from Log Analytics using the [Azure CLI](/cli/azure/monitor/log-analytics). 

You must be assigned the **Contributor** role in your Log Analytics workspace, your Storage account, and your EventHub resource in order to run the commands. 

Here is a sample set of commands to setup automatic exporting:


```azurecli

az –version

# Login with Azure CLI
az login

# List all Log Analytics clusters
az monitor log-analytics cluster list

# Set to specific subscription
az account set --subscription "SUBSCRIPTION_NAME"
 
# Export to Storage - all tables
az monitor log-analytics workspace data-export create --resource-group "RG_NAME" --workspace-name "WS_NAME" -n LAExportCLIStr --destination "DESTINATION_NAME" --enable "true" --tables SecurityEvent
 
# Export to EventHub - all tables
az monitor log-analytics workspace data-export create --resource-group "RG_NAME" --workspace-name "WS_NAME" -n LAExportCLIEH --destination "DESTINATION_NAME" --enable "true" --tables ["SecurityEvent","Heartbeat"]

# List export settings
az monitor log-analytics workspace data-export list --resource-group "RG_NAME" --workspace-name "WS_NAME"

# Delete export setting
az monitor log-analytics workspace data-export delete --resource-group "RG_NAME" --workspace-name "WS_NAME" --name "NAME"
```

### Export custom data

For custom data that is not supported by Log Analytics auto-export, you can use Logic App or other solutions to move your data. You can refer to the [Exporting Log Analytics Data to Blob Store](https://techcommunity.microsoft.com/t5/azure-monitor/log-analytics-data-export-preview/ba-p/1783530) blog and script.

### Correlate with data outside of Microsoft Sentinel

You can also bring data from outside of Microsoft Sentinel to the blob storage or Event Hub and correlate them with the Microsoft Sentinel data to build your ML models.

### Copy and install the related packages

Copy the BYO-ML package from the Microsoft Sentinel GitHub repository mentioned earlier to your Databricks environment. Then open the notebooks and follow the instructions within the notebook to install the required libraries on your clusters.

### Model training and scoring

Follow the instructions in the two notebooks to change the configurations according to your own environment and resources, follow the steps to train and build your model, then schedule the model to score incoming file share access logs.

### Write results to Log Analytics

Once you get the scoring scheduled, you can use the module in the scoring notebook to write the score results to the Log Analytics workspace associated with your Microsoft Sentinel instance.

### Check results in Microsoft Sentinel

In order to see your scored results together with related log details, go back to your Microsoft Sentinel portal. In **Logs** > Custom Logs, you will see the results in the **AnomalousResourceAccessResult_CL** table (or your own custom table name). You can use those results to enhance your investigation and hunting experiences.

:::image type="content" source="./media/bring-your-own-ml/anomalous-resource-access-logs.png" alt-text="anomalous resource access logs":::

### Build custom analytics rule with ML results

Once you have confirmed the ML results are in the custom logs table, and you're satisfied with the fidelity of the scores, you can create a detection based on the results. Go to **Analytics** from the Microsoft Sentinel portal and [create a new detection rule](detect-threats-custom.md). Below is an example showing the query used to create the detection.

:::image type="content" source="./media/bring-your-own-ml/create-byo-ml-analytics-rule.png" alt-text="create custom analytics rule for B Y O M L detections":::

### View and respond to incidents
Once you've set up the analytics rule based on the ML results, if there are results above the threshold you set in the query, an incident will be generated and surfaced on the **Incidents** page on Microsoft Sentinel. 

## Next steps

In this document, you learned how to use Microsoft Sentinel's BYO-ML platform for creating or importing your own machine learning algorithms to analyze data and detect threats.

- See posts about machine learning and lots of other relevant topics in the [Microsoft Sentinel Blog](https://aka.ms/azuresentinelblog).

