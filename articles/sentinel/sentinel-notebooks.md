---
title: Hunting capabilities using notebooks in Azure Sentinel | Microsoft Docs
description: This article describes how to use notebooks with the Azure Sentinel hunting capabilities.
services: sentinel
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: 1721d0da-c91e-4c96-82de-5c7458df566b
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin
---

# Use notebooks to hunt for anomalies

Azure Sentinel leverages the power of Jupyter interactive notebooks to provide insight and actions to investigate or hunt for security anomalies within your environment. Azure Sentinel comes preloaded with notebooks that were developed by Microsoft's security analysts. Each notebook is purpose built with a self-contained workflow for a specific use case. Visualizations are included in each notebook for faster data exploration and threat hunting.​ You customize the built-in notebooks to meet your needs, create new notebooks from scratch or import notebooks from the Azure Sentinel' GitHub community. Jupyter notebooks are imported as a project in the Azure Notebooks page – this enables user to access all of their Azure Sentinel notebooks in one place. Notebooks can be run with a click of a button or can be configured by user to match their environment.

The fully integrated experience enables notebooks to run on Cloud Compute and Storage with no underlying maintenance overhead. The ability to leverage the existing Jupyter Notebooks ecosystem enables you to crowd source models, without sharing customer data. You have the ability to run notebooks for free or on high-end compute resources. Jupyter notebooks can be cloned to another project or downloaded to run locally.


Each notebook is hosted on the Azure Notebooks (currently in preview), an interactive development environment in the Azure cloud. Notebooks are always accessible, always available from any browser, anywhere in the world.  The Azure Sentinel' built-in notebooks for investigation and hunting are cloned into a project that belongs to you, and which you can modify and tailor to your environment. Either run the notebooks for free or, for better performance, configure a dedicated virtual host to run. Some of the most popular built-in notebooks are:

- **Alert investigation and hunting**: This interactive notebook enables quick triage of different classes of alerts by retrieving related activity and enriching the alert with associated activity and data from which the alert was generated.​

- **Endpoint host guided hunting**: Allows you to hunt for signs of a security breach by drilling down into the security relevant activities associated with an endpoint host.  ​

- **Office sign in guided hunting**: Enables you to hunt for suspicious sign-ins by visualizing geographic locations of suspect logs as well as displaying unusual sign-in patterns derived from  Office 365 data.​

## Run a notebook
In the following example, we run the built-in notebook to search for deep diving into location anomalies to see if anyone in an unexpected location is doing something on your network.

1. In the Azure Sentinel portal, click **Notebooks** and then select **Guided hunt location anomaly**.
  
   ![select notebook](./media/sentinel-notebooks/select-notebook.png)

1. The notebook walks you through the steps for performing the hunting process.  Models, libraries, and other dependencies and configuration for connectivity to Azure Sentinel is automatically imported to enable button-click execution. All code and libraries necessary to run notebook pre-loaded. You can immediately begin executing notebook against their Log Analytics workspace with no configuration.
 
   ![run notebook](./media/sentinel-notebooks/run-notebook.png)


1. Click **Hunting** to open raw logs to begin examining the data. Here you can see raw endpoint activity logs for sign-in activities for users who signed in from anomalous locations. This launches Log Analytics directly from within the Notebook experience. This pivots from within the Jupyter notebook to investigate a specific user. In this example, the environment is queried for any suspicious sign in activity related to the user identified in the prior query. 
In this example, we did not find any suspicious activity, but that doesn’t stop us from investigating further.
  ![run notebook](./media/sentinel-notebooks/notebook-geo.png)

   You can pivot this investigation (or hunt) in many different directions to understand the full scope and extent of the activity. You have multiple investments to not only identify the relationships between these data sets and the entities contained within them, but also to automate traversing the data for the user.


4. You can [add a bookmark](sentinel-bookmarks.md) to save the investigation for later. 
  ![run notebook](./media/sentinel-notebooks/notebook-add-bookmark.png)





## Next steps
In this article, you learned how to run a hunting investigation using notebooks in Azure Sentinel. To learn more about Azure Sentinel, see the following articles:


* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.