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

3. After upgrading, all your visual interface experiments will be converted to designer pipeline draft automatically. It will show up in the designer homepage. Your visual interface web service can be found in Endpoints -> Real-time endpoints.  

    However, you might need to make additional modifications to make the converted pipeline draft run successfully. Once you click one of the pipeline drafts converted from visual interface, there could be error info hint you on how to resolve the issues from conversion. Below are possible errors you might see:
        - Update your Import Data or Export Data sources to datastores. For Designer pipelines, data must be in a datastore. Learn how (AKA LINK)

        - Error ():  This visual interface experiment could not be converted to a designer pipeline. To complete the conversion, you must manually rerun this experiment.