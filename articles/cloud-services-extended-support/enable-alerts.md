---
title: Enable Monitoring in Cloud Services (extended support) using the Azure portal
description: Enable monitoring for Cloud Services (extended support) instances using the Azure portal
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Enable monitoring for Cloud Services (extended support) using the Azure portal

This article explains how to enable alerts on existing Cloud Service (extended support) deployments. 

## Add monitoring rules
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the Cloud Service (extended support) deployment you want to enable alerts for. 
3. Select the **Alerts** blade. 

    :::image type="content" source="media/enable-alerts-1.png" alt-text="Image shows selecting the Alerts tab in the Azure portal.":::

4. Select the **New Alert** icon.
     :::image type="content" source="media/enable-alerts-2.png" alt-text="Image shows selecting the add new alert option.":::

5. Input the desired conditions and required actions based on what metrics you are interested in tracking. You can define the rules based on individual metrics or the activity log. 

     :::image type="content" source="media/enable-alerts-3.png" alt-text="Image shows where to add conditions to alerts.":::

     :::image type="content" source="media/enable-alerts-4.png" alt-text="Image shows configuring signal logic.":::

     :::image type="content" source="media/enable-alerts-5.png" alt-text="Image shows configuring action group logic.":::

6. When you have finished setting up alerts, save the changes and based on the metrics configured you will begin to see the **Alerts** blade populate over time.

## Next steps 
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).