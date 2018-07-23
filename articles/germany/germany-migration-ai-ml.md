---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating AI and ML resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# AI + Machine Learning

## Machine Learning

It is not possible to migrate the content of an Azure ML workspace and web service from Azure Germany to a public Azure region. You will have to pretty much recreate them by hand. The steps are:

- Open an experiment from a workspace in Azure Germany in one browser screen.
- In another browser screen, create a new workspace in a public Azure region (West Europe for example).
- Create a blank new experiment in the new workspace.
- Follow the graph displayed in the Azure Germany workspace, and replicate it manually by dragging and dropping the modules in the new workspace and connect them with lines.
- Press "Run" button to execute the new experiment.
- If you are deploying a web service, press "Create predictive experiment" button to create a predictive experiment from the training experiment.
- Press "Run" again in the auto-generated predictive experiment.
- Press "Deploy" button to deploy a new web service.

### Links

- [How to create an Azure ML Studio workspace](../machine-learning/studio/create-workspace.md)
- [Create your first experiment](../machine-learning/studio/create-experiment.md)
- [Walkthrough: create a predictive analytics solution in ML Studio](../machine-learning/studio/walkthrough-develop-predictive-solution.md)
- [Azure ML Web services: deployment and consumption](../machine-learning/studio/deploy-consume-web-service-guide.md)
