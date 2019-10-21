---
title: "include file"
description: "include file"
services: machine-learning
ms.service: machine-learning
ms.custom: "include file"
ms.topic: "include"
author: harper zhang
ms.author: harper zhang
ms.date: 10/18/2019
---

Azure Machine Learning visual interface has been updated to Azure Machine Learning designer with more modules, richer ML pipeline functionality and updated UI. check out how to migrate from visual interface to the designer. 

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com)

2. Update to Enterprise edition.

    [todo] add gif to show upgrade flow

3. After upgrading, all your visual interface experiments will be converted to designer pipeline draft automatically. Your visual interface experiments will show up in the designer homepage -> pipeline draft list. Your visual interface web service can be found in Endpoints -> Real-time endpoints.  

    However, you might need to make additional modifications to make the converted pipeline draft run successfully. Once you click one of the pipeline drafts converted from visual interface, there will show error message to guide you resolve the issues from conversion. Below are known issues you need to solve manually:
        - Update your **Import Data** or **Export Data** sources to datastores.
        
            If you have **Import Data** or **Export Data** module in the visual interface experiment, you will need to update the data source to datastores. Datastores are used to store connection information, check [this article](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-access-data) to learn how to create a datastore. We have copied the cloud storage account information in the comments of Import Data/ Export Data module in the converted pipeline for your quick reference. 
      