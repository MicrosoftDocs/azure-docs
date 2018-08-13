---
title: Migration from Azure Germany compute resources to global Azure
description: Provides help for migrating AI and ML resources
author: gitralf
ms.author: ralfwi 
ms.date: 8/13/2018
ms.topic: article
ms.custom: bfmigrate
---

# AI + Machine Learning

## Machine Learning

It's not possible to migrate the content of an Azure Machine Learning workspace and web service from Azure Germany to global Azure. You must recreate them by hand. The steps are:

- Open an experiment from a workspace in Azure Germany in one browser screen.
- In another browser screen, create a new workspace in a global Azure region (West Europe for example).
- Create a blank new experiment in the new workspace.
- Follow the graph displayed in the Azure Germany workspace. Replicate it manually by dragging and dropping the modules in the new workspace. Connect them with lines.
- Press *Run* button to execute the new experiment.
- If you deploy a web service, press *Create predictive experiment* to create a predictive experiment from the training experiment.
- Press *Run* again in the auto-generated predictive experiment.
- Press *Deploy* button to deploy a new web service.

### Next steps

- [How to create an Azure ML Studio workspace](../machine-learning/studio/create-workspace.md)
- [Create your first experiment](../machine-learning/studio/create-experiment.md)
- [Walkthrough: create a predictive analytics solution in ML Studio](../machine-learning/studio/walkthrough-develop-predictive-solution.md)
- [Azure ML Web services: deployment and consumption](../machine-learning/studio/deploy-consume-web-service-guide.md)

### References

- [Overview of Azure ML Studio](../machine-learning/studio/what-is-ml-studio.md)
