---
title: Troubleshoot - Azure IoT Orchestrator
description: Guidance and suggested steps for troubleshooting an Orchestrator deployment of Azure IoT Operations components.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 10/19/2023

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Troubleshoot Orchestrator deployments

If you need to troubleshoot a deployment, you can find error details in the Azure portal to understand which resources failed or succeeded and why.

1. In the [Azure portal](https://portal.azure.com), navigate to the resource group that contains your Arc-enabled cluster.

1. Select **Deployments** under **Settings** in the navigation menu.

1. If a deployment failed, select **Error details** to get more information about each individual resource in the deployment.

   ![Screenshot of error details for a failed deployment](./media/howto-troubleshoot-deployment/deployment-error-details.png)
