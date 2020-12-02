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

This article explains how to enable monitoring on existing Cloud Service (extended support) deployments. For more samples on enabling monitoring during deployment, see [Create a Cloud Service (extended support)](sample-create-cloud-service.md)

## Add monitoring rules
1. Sign in to the Azure portal. 
2. Select the Cloud Service (extended support) deployment you want to enable monitoring alerts for. 
3. Select the **Alerts** blade. 

    :::image type="content" source="media/enable-alerts-1.png" alt-text="Image shows selecting the Alerts tab in the Azure portal.":::

4. Select the **New Alert** icon.
     :::image type="content" source="media/enable-alerts-2.png" alt-text="Image shows selecting the add new alert option.":::
5. Input the desired conditions and required actions based on what metrics you are interested in tracking. You can define the rules based on the metrics or the activity log. 

     :::image type="content" source="media/enable-alerts-3.png" alt-text="Image shows where to add conditions to alerts.":::

     :::image type="content" source="media/enable-alerts-4.png" alt-text="Image shows configuring signal logic.":::

     :::image type="content" source="media/enable-alerts-5.png" alt-text="Image shows configuring action group logic.":::

6. When you have finished setting up the monitoring rules and alerts, save the changes and you will begin to see the **Alerts** and **Metrics** sections in your Cloud Services (extended support) blade to populate over time.

## Next steps
See [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)