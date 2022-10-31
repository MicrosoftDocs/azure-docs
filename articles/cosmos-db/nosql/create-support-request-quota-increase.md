---
title: How to request quota increase for Azure Cosmos DB resources
description: Learn how to request a quota increase for Azure Cosmos DB resources. You will also learn how to enable a subscription to access a region.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/27/2022
---

# How to request quota increase for Azure Cosmos DB resources
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](../includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The resources in Azure Cosmos DB have [default quotas/limits](../concepts-limits.md). However, there may be a case where your workload needs more quota than the default value. In such case, you must reach out to the Azure Cosmos DB team to request a quota increase. This article explains how to request a quota increase for Azure Cosmos DB resources. You will also learn how to enable a subscription to access a region.

## Create a new support request

To request a quota increase, you must create a new support request with your workload details. The Azure Cosmos DB team will then evaluate your request and approve it. Use the following steps to create a new support request from the Azure portal:

1. Sign into the Azure portal.

1. From the left-hand menu, select **Help + support** and then select **New support request**.

1. In the **Basics** tab fill the following details:

   * For **Issue type**, select **Service and subscription limits (quotas)**
   * For **Subscription**, select the subscription for which you want to increase the quota.
   * For **Quota type**, select **Azure Cosmos DB**

   :::image type="content" source="./media/create-support-request-quota-increase/create-quota-increase-request.png" alt-text="Create a new Azure Cosmos DB support request for quota increase":::

1. In the **Details** tab, enter the details corresponding to your quota request. The Information provided on this tab will be used to further assess your issue and help the support engineer troubleshoot the problem.

1. Fill the following details in this form:

   * **Description**: Provide a short description of your request such as your workload, why the default values aren’t sufficient along with any error messages you are observing.

   * **Quota specific fields** provide the requested information for your specific quota request.

   * **File upload**: Upload the diagnostic files or any other files that you think are relevant to the support request. To learn more on the file upload guidance, see the [Azure support](../../azure-portal/supportability/how-to-manage-azure-support-request.md#upload-files) article.

   * **Severity**: Choose one of the available severity levels based on the business impact.

   * **Preferred contact method**: You can either choose to be contacted over **Email** or by **Phone**.

1. Fill out the remaining details such as your availability, support language, contact information, email, and phone number on the form.

1. Select **Next: Review+Create**. Validate the information provided and select **Create** to create a support request.

Within 24 hours, the Azure Cosmos DB support team will evaluate your request and get back to you.

## Next steps

* See the [Azure Cosmos DB default service quotas](../concepts-limits.md)
