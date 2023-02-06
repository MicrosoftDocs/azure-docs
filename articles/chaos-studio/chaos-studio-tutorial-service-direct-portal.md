---
title: Create an experiment that uses a service-direct fault with Azure Chaos Studio
description: Create an experiment that uses a service-direct fault
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 11/01/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Create a chaos experiment that uses a service-direct fault to fail over an Azure Cosmos DB instance

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this guide, you will cause a multi-read, single-write Azure Cosmos DB failover using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against data loss when a failover event occurs.

These same steps can be used to set up and run an experiment for any service-direct fault. A **service-direct** fault runs directly against an Azure resource without any need for instrumentation, unlike agent-based faults, which require installation of the chaos agent.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- An Azure Cosmos DB account. If you do not have an Azure Cosmos DB account, you can [follow these steps to create one](../cosmos-db/sql/create-cosmosdb-resources-portal.md).
- At least one read and one write region setup for your Azure Cosmos DB account.


## Enable Chaos Studio on your Azure Cosmos DB account

Chaos Studio cannot inject faults against a resource unless that resource has been onboarded to Chaos Studio first. You onboard a resource to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Azure Cosmos DB accounts only have one target type (service-direct) and one capability (failover), but other resources may have up to two target types - one for service-direct faults and one for agent-based faults - and many capabilities.

1. Open the [Azure portal](https://portal.azure.com).
2. Search for **Chaos Studio (preview)** in the search bar.
3. Click on **Targets** and navigate to your Azure Cosmos DB account.
![Targets view in the Azure portal](images/tutorial-service-direct-targets.png)
4. Check the box next to your Azure Cosmos DB account and click **Enable targets** then **Enable service-direct targets** from the dropdown menu.
![Enabling targets in the Azure portal](images/tutorial-service-direct-targets-enable.png)
5. A notification will appear indicating that the resource(s) selected were successfully enabled.
![Notification showing target successfully enabled](images/tutorial-service-direct-targets-enable-confirm.png)

You have now successfully onboarded your Azure Cosmos DB account to Chaos Studio. In the **Targets** view you can also manage the capabilities enabled on this resource. Clicking the **Manage actions** link next to a resource will display the capabilities enabled for that resource.

## Create an experiment
With your Azure Cosmos DB account now onboarded, you can create your experiment. A chaos experiment defines the actions you want to take against target resources, organized into steps, which run sequentially, and branches, which run in parallel.

1. Click on the **Experiments** tab in the Chaos Studio navigation. In this view, you can see and manage all of your chaos experiments. Click on **Add an experiment**
![Experiments view in the Azure portal](images/tutorial-service-direct-add.png)
2. Fill in the **Subscription**, **Resource Group**, and **Location** where you want to deploy the chaos experiment. Give your experiment a **Name**. Click **Next : Experiment designer >**
![Adding basic experiment details](images/tutorial-service-direct-add-basics.png)
3. You are now in the Chaos Studio experiment designer. The experiment designer allows you to build your experiment by adding steps, branches, and faults. Give a friendly name to your **Step** and **Branch**, then click **Add fault**.
![Experiment designer](images/tutorial-service-direct-add-designer.png)
4. Select **CosmosDB Failover** from the dropdown, then fill in the **Duration** with the number of minutes you want the failure to last and **readRegion** with the read region of your Azure Cosmos DB account. Click **Next: Target resources >**
![Fault properties](images/tutorial-service-direct-add-fault.png)
5. Select your Azure Cosmos DB account, and click **Next**
![Add a target](images/tutorial-service-direct-add-target.png)
6. Verify that your experiment looks correct, then click **Review + create**, then **Create.**
![Review and create experiment](images/tutorial-service-direct-add-review.png)

## Give experiment permission to your target resource
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully. These steps can be used for any resource and target type by modifying the role assignment in step #3 to match the [appropriate role for that resource and target type](chaos-studio-fault-providers.md).

1. Navigate to your Azure Cosmos DB account and click on **Access control (IAM)**.
![Azure Cosmos DB overview page](images/tutorial-service-direct-access-resource.png)
2. Click **Add** then click **Add role assignment**.
![Access control overview](images/tutorial-service-direct-access-iam.png)
3. Search for **Cosmos DB Operator** and select the role. Click **Next**
![Assigning Azure Cosmos DB Operator role](images/tutorial-service-direct-access-role.png)
4. Click **Select members** and search for your experiment name. Select your experiment and click **Select**. If there are multiple experiments in the same tenant with the same name, your experiment name will be truncated with random characters added.
![Adding experiment to role](images/tutorial-service-direct-access-experiment.png)
5. Click **Review + assign** then **Review + assign**.

## Run your experiment
You are now ready to run your experiment. To see the impact, we recommend opening your Azure Cosmos DB account overview and going to **Replicate data globally** in a separate browser tab. Refreshing periodically during the experiment will show the region swap.

1. In the **Experiments** view, click on your experiment, and click **Start**, then click **OK**.
2. When the **Status** changes to **Running**, click **Details** for the latest run under **History** to see details for the running experiment.

## Next steps
Now that you have run a Azure Cosmos DB service-direct experiment, you are ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
