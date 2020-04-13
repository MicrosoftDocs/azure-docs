---
title: Disaster recovery for FarmBeats
description: This article describes how data recovery protects from losing your data.
author: uhabiba04
ms.topic: article
ms.date: 04/13/2020
ms.author: v-umha
---

# Disaster recovery for FarmBeats

Data recovery protects you from losing your data in an unfortunate event like collapse of Azure region. In such event, you can start failover and recover data stored in your FarmBeats deployment. By default, FarmBeats doesn't configure for data recovery or availability of service, if underlying Azure services or region in which FarmBeats is deployed goes down. However, customers can configure certain Azure resources used by FarmBeats to store data in an Azure paired region and use Active-Passive approach to enable disaster recovery.

## Enable data redundancy

FarmBeats stores data in three Azure first party services, which are **Azure storage**, **Cosmos DB** and **Time Series Insights**. Below are the steps to enable data redundancy for these services to a paired Azure region:

1.	**Azure Storage** - Follow this guideline to enable data redundancy for each storage account in your FarmBbeats deployment.
2.	**Azure Cosmos DB** - Follow this guideline to enable data redundancy for Cosmos DB account your FarmBeats deployment.
3.	**Azure Time Series Insights (TSI)** - TSI currently doesn't offer data redundancy. To recover Time Series Insights data, go to your sensor/weather partner and push the data again to FarmBeats deployment.

## Restoring service from online backup

You can initiate failover and recover data stored for which, each of the above mentioned data stores for your FarmBeats deployment. Once you've recovered the data for Azure storage and Cosmos DB, create another FarmBeats deployment in the Azure paired region and then configure the new deployment to use data from restored data stores (i.e. Azure Storage and Cosmos DB) by using the below steps:

1.	**Configure Cosmos DB** - Copy the access key of the restored Cosmos DB and update the new FarmBeats Datahub Key Vault.


  ![Disaster Recovery](./media/disaster-recovery-for-farmbeats/keyvault-secrets.png)

> [!NOTE]
> Copy the URL of restored Cosmos DB and update it in the new FarmBeats Datahub App Service Configuration. You can now delete Cosmos DB account in the new FarmBeats deployment.

  ![Disaster Recovery](./media/disaster-recovery-for-farmbeats/northeu-ehub-api-configuration.png)

2. **Configure Storage Account** - Copy the access key of the restored storage account and update it in the new FarmBeats Datahub Key Vault.

![Disaster Recovery](./media/disaster-recovery-for-farmbeats/keyvault-7udqm-secrets.png)

>[!NOTE]
> Update Storage Account name in the new FarmBeats Batch VM config file.

![Disaster Recovery](./media/disaster-recovery-for-farmbeats/batch-prep-files.png)

Similarly, if you have enabled data recovery for your Accelerator storage account,  follow the step 2 to update the accelerator Storage Account access key and name, in the new FarmBeats instance.
