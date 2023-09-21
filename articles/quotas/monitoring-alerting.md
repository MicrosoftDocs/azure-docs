---
title:  Quota Monitoring & Alerting
description: Monitoring and Alerting for Quota Usages.
ms.date: 30/09/2023
ms.topic: Overview
---

# Quota Monitoring and Alerting

**Monitoring and Alerting** in Azure provides real-time insights into resource utilization, enabling proactive issue resolution and resource optimization.It helps detect anomalies and potential issues before they impact services, ensuring uninterrupted operations. 

To view the features on **Quotas** page, sign in to the [Azure portal](https://portal.azure.com) and enter "quotas" into the search box, then select **Quotas**.

> [!NOTE]
> When Monitoring & Alerting is enabled for your account, the Quotas in **MyQuotas** will be highlighted and clickable. 

## Monitoring 

**Monitoring for quotas** empowers users to proactively manage their resources in Azure. Azure sets predefined limits, or quotas, for various resources like **Compute**, **Azure Machine Learning**, and **HPC Cache**. This monitoring involves continuous tracking of resource usage to ensure it remains within allocated limits, with users receiving notifications when these limits are approached or reached. 

## Alerting 

**Quota alerts** in Azure are notifications triggered when the usage of a specific Azure resource nears the **predefined quota limit**. These alerts are crucial for informing Azure users and administrators about resource consumption, facilitating proactive resource management. Azure’s alert rule capabilities allow you to create multiple alert rules for a given quota or across quotas in your subscription.  

> [!NOTE]
> [General Role based access control](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview#azure-role-based-access-control-for-alerts) applies while creating alerts.  


## Next steps

- Learn how to [Create Quota alert](how-to-monitoring-alerting.md).
- Learn more about [Alerts](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview)
- Learn about [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/overview)

