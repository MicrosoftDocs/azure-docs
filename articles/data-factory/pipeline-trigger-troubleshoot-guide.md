---
title: Troubleshooting pipeline orchastration and triggers in ADF
description: Use difrent methods to troublshoot pipeline trigger issues in ADF 
author: ssabat
ms.author: susabat
ms.reviewer: susabat
ms.topic: general
ms.date: 11/26/2020

---

# Troubleshooting pipeline orchastration and triggers in ADF

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A pipeline run in Azure Data Factory defines an instance of a pipeline execution. For example, say you have a pipeline that executes at 8:00 AM, 9:00 AM, and 10:00 AM. In this case, there are three separate runs of the pipeline or pipeline runs. Each pipeline run has a unique pipeline run ID. A run ID is a GUID that uniquely defines that particular pipeline run.

Pipeline runs are typically instantiated by passing arguments to parameters that you define in the pipeline. You can execute a pipeline either manually or by using a trigger. For more details, please review [Pipeline execution and triggers in Azure Data Factory](https://docs.microsoft.com/azure/data-factory/concepts-pipeline-execution-triggers)
