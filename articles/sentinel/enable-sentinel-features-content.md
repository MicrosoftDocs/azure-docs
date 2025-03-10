---
title: Enable Microsoft Sentinel and initial features and content
description: As the first step of your deployment, you enable Microsoft Sentinel, and then enable the health and audit feature, solutions, and content.
author: cwatson-cat
ms.topic: how-to
ms.date: 06/18/2024
ms.author: cwatson


#Customer intent: As a security operations analyst, I want to enable and configure Microsoft Sentinel and its key features so that I can monitor and secure my organization's environment effectively.

---

# Enable Microsoft Sentinel and initial features and content

To begin your deployment, you need to enable Microsoft Sentinel and set up key features and content. In this article, you learn how to enable Microsoft Sentinel, enable the health and audit feature, and enable the solutions and content you've identified according to your organization's needs. This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Enable features and content

|Step  |Description  |
|---------|---------|
|1. [Enable the Microsoft Sentinel service](quickstart-onboard.md#enable)     | In the Azure portal, enable Microsoft Sentinel to run on the Log Analytics workspace your organization planned as part of your workspace design.    </br></br>To onboard to Microsoft Sentinel by using the API, see the latest supported version of [Sentinel Onboarding States](/rest/api/securityinsights/sentinel-onboarding-states).   |
|2. [Enable health and audit](enable-monitoring.md)     |Enable health and audit at this stage of your deployment to make sure that the service's many moving parts are always functioning as intended and that the service isn't being manipulated by unauthorized actions. Learn more about the [health and audit](health-audit.md) feature.         |
|3. [Enable solutions and content](sentinel-solutions-deploy.md)     |When you planned your deployment, you identified which data sources you need to ingest into Microsoft Sentinel. Now, you want to enable the relevant solutions and content so that the data you need can start flowing into Microsoft Sentinel.         |

## Next steps

In this article, you learned how to enable Microsoft Sentinel, its health and audit feature, and required content.

> [!div class="nextstepaction"]
>>[Configure content](configure-content.md)