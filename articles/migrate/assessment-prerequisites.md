---
title: Assessment prerequisites
description: Lists the prerequisites to perform assessments in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 05/08/2025
monikerRange: migrate
---

# Prerequisites for assessments 
 
Azure Migrate assessments identifies the readiness and right-sized Azure targets using the configuration and performance data collected from the source workloads. The quality of assessments depends on the quality of the data available for assessments. Thus, to get high quality assessments ensure you have all the prerequisites fulfilled. Before creating the assessments, ensure the following: 

- You discovered the inventory of all the workloads and applications you intend to assess. 
- You resolved any data collection issues that your workloads are flagged for.
- You have enough performance data collected before you create the assessment. You can create assessments anytime, but we recommend letting the appliance collect the performance data for at least 24 hours.  
- In the case of appliance-based discovery, for better results. Ensure that the appliances are in a connected state and performance data is flowing. 
- If you have an Enterprise agreement with Microsoft and want to use the negotiated prices to identify the resource cost, ensure that you have access to the required subscriptions. 

## Discovery sources 

The discovery source might vary for different workloads depending on the data required for creating the assessments. You can discover your on-premises servers by using either of the following methods: 

   - [Deploying](tutorial-discover-vmware.md) a light-weight Azure Migrate appliance to perform agentless discovery. 
   - [Importing](tutorial-import-vmware-using-rvtools-xlsx.md) the workload information using predefined templates. 

The recommended discovery source is the Azure Migrate appliance as it provides an in-depth view of your machines and ensures regular flow of configuration and performance data, and accounts for changes in the source environment.  

## What data does the appliance collect? 

If you're using the Azure Migrate appliance for assessment, see [metadata and performance data](discovered-metadata.md) collected as an input for the assessment. 

## Next steps
Migrate [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
