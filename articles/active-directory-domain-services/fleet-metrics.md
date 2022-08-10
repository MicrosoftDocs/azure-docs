---
title: Check fleet metrics of Azure Active Directory Domain Services | Microsoft Docs
description: Learn how to check fleet metrics of an Azure Active Directory Domain Services (Azure AD DS) managed domain.
services: active-directory-ds
author: justinha
manager: karenhoran

ms.assetid: 8999eec3-f9da-40b3-997a-7a2587911e96
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 08/10/2022
ms.author: justinha

---
# Check fleet metrics of Azure Active Directory Domain Services

Azure AD Domain Services metrics are implemented through Azure Monitoring and now available to customer as a metrics scope. 

:::image type="content" border="true" source="media/fleet-metrics/select.png" alt-text="Screenshot of how to select Azure AD DS for fleet metrics.":::

The metrics are exposed to customers through Azure Monitor’s Metrics blade and can be accessed from Azure Monitor’s Metrics or on Azure AD Domain Services instance.

:::image type="content" border="true" source="media/fleet-metrics/metrics-scope.png" alt-text="Screenshot of how to select scope for Azure AD DS.":::


:::image type="content" border="true" source="media/fleet-metrics/metrics-instance.png" alt-text="Screenshot of how to select an Azure AD DS instance as the scope for fleet metrics.":::

## Metrics definitions and descriptions

The full list of metrics definition and descriptions can be seen here:
https://msazure.visualstudio.com/One/_git/AzureMonitorResourceProviderOnboarding?path=/src/resourceproviders/microsoft.aad/domainservices/prod/manifest.json


:::image type="content" border="true" source="media/fleet-metrics/descriptions.png" alt-text="Screenshot of fleet metric descriptions.":::

## Azure Monitor Alert

Implementing metrics through Azure Monitor brings us the benefit of metric alert.

Metric alert is just one of the alerts Azure Monitor supports, see https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview for different alert types and mechanisms for alert notifications.

  -	To view and manage Azure Monitor alert, a user needs to be assigned monitoring roles https://docs.microsoft.com/en-us/azure/azure-monitor/roles-permissions-security 
  -	Azure AD Domain Services metrics are now available as an alert signal. Alert can be created from Azure Monitor -> Alert blade (Figure 5), or from “New alert rule” on any of AAD DS Metrics blade (Figure 4).

:::image type="content" border="true" source="media/fleet-metrics/available-alerts.png" alt-text="Screenshot of available alerts.":::

:::image type="content" border="true" source="media/fleet-metrics/define.png" alt-text="Screenshot of how to define a threshold.":::


:::image type="content" border="true" source="media/fleet-metrics/trigger.png" alt-text="Screenshot of alert trigger.":::

:::image type="content" border="true" source="media/fleet-metrics/trigger-details.png" alt-text="Screenshot of alert trigger details.":::

:::image type="content" border="true" source="media/fleet-metrics/resolution.png" alt-text="Screenshot of alert resolution.":::

## Future improvement

It will be interesting to see if there are upvote for our metrics to enable multi-selection so as to correlate with other resource types.

:::image type="content" border="true" source="media/fleet-metrics/upvote.png" alt-text="Screenshot of feature upvote.":::

## Next steps

- [Check the health of an Azure Active Directory Domain Services managed domain](check-health.md)
