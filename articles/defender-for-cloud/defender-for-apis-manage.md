---
title: Manage the Defender for APIs plan
description: Manage your Defender for APIs deployment in Microsoft Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 05/29/2023
---

# Manage your Defender for APIs deployment

This article describes how to manage your [Microsoft Defender for APIs](defender-for-apis-introduction.md) plan deployment in Microsoft Defender for Cloud. Management tasks include offboarding APIs from Defender for APIs.

Defender for APIs is currently in preview.

## Offboard an API

1. In the Defender for Cloud portal, select **Workload protections**.
1. Select **API security**.
1. Next to the API you want to offboard from Defender for APIs, select the ***ellipsis*** (...) > **Remove**.

    :::image type="content" source="media/defender-for-apis-manage/api-remove.png" alt-text="Screenshot of the review API information in Cloud Security Explorer." lightbox="media/defender-for-apis-manage/api-remove.png":::

## Query your APIs with the cloud security explorer

You can use the cloud security explorer to run graph-based queries on the cloud security graph. By utilizing the cloud security explorer, you can proactively identify potential security risks to your APIs.

There are three types of APIs you can query:

- **API Collections** - A group of all types of API collections.

- **API Endpoints** - A group of all types of API endpoints.

- **API Management services** - API management services are platforms that provide tools and infrastructure for managing APIs, typically through a web-based interface. They often include features such as: API gateway, API portal, API analytics and API security.

**To query APIs in the cloud security graph**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Cloud Security Explorer**.

1. From the drop down menu, select APIs.

    :::image type="content" source="media/defender-for-apis-manage/cloud-explorer-apis.png" alt-text="Screenshot of Defender for Cloud's cloud security explorer that shows how to select APIs." lightbox="media/defender-for-apis-manage/cloud-explorer-apis.png":::

1. Select all relevant options.

1. Select **Done**.

1. Add any other conditions.

1. Select **Search**.

You can learn more about how to [build queries with cloud security explorer](how-to-manage-cloud-security-explorer.md).

## Next steps

[Learn about](defender-for-apis-introduction.md) Defender for APIs.


