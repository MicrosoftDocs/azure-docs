---
title: How to request quota increase for Azure Database PostgreSQL Flexible Server resources
description: Learn how to request a quota increase for Azure Database for PostgreSQL Flexible Server. You will also learn how to enable a subscription to access a region..
ms.service: postgresql
ms.subservice: flexible-server
ms.author: kabharati
author: kabharati
ms.reviewer: maghan
ms.topic: how-to
ms.date: 03/31/2023
---

# Request quota increases for Azure Database PostgreSQL Flexible Server
[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

The resources in Azure Database for PostgreSQL Flexible Server have default quotas/limits. However, there may be a case where your workload needs more quota than the default value. In such case, you must reach out to the Azure PostgreSQL DB team to request a quota increase. This article explains how to request a quota increase for Azure Database for PostgreSQL FLexible Server resources. 

## Create a new support request

To request a quota increase, you must create a new support request with your workload details. The Azure Database for PostgreSQL Flexible Server team will then process your request and approve or deny it. Use the following steps to create a new support request from the Azure portal:

1. Sign into the Azure portal.

2. From the left-hand menu, select **Help + support** and then select **Create a support request**.

3. In the **Problem Description** tab, fill the following details:

   * For **Summary**, Provide a short description of your request such as your workload, why the default values aren’t sufficient along with any error messages you're observing.
   * For **Issue type**, select **Service and subscription limits (quotas)**
   * For **Subscription**, select the subscription for which you want to increase the quota.
   * For **Quota type**, select **Azure Database for PostgreSQL Flexible Server**

   :::image type="content" source="./media/how-to-create-support-request-quota-increase/create-quota-increase-request.png" alt-text="Create a new Azure Flexible Server request for quota increase":::

4. In the **Additional Details** tab, enter the details corresponding to your quota request. The Information provided on this tab will be used to further assess your issue and help the support engineer troubleshoot the problem.

   
5. Fill the following details in this form:

   *    In  **Request details** click **Enter details** and select the relevant **Quota Type**

   provide the requested information for your specific quota request like Location, Series, New Quota.

   * **File upload**: Upload the diagnostic files or any other files that you think are relevant to the support request. To learn more on the file upload guidance, see the [Azure support](../../azure-portal/supportability/how-to-manage-azure-support-request.md#upload-files) article.

   * **Allow collection of advanced ​diagnostic information?​**: Choose Yes or NO

   * **Severity**: Choose one of the available severity levels based on the business impact.

   * **Preferred contact method**: You can either choose to be contacted over **Email** or by **Phone**.

6. Fill out the remaining details such as your availability, support language, contact information, email, and phone number on the form.

7. Select **Next: Review+Create**. Validate the information provided and select **Create** to create a support request.

The Azure Database for PostgreSQL Flexible Server DB support team process all quota requests in 24-48 hours.




## Next steps

- Learn how to [create a PostgreSQL server in the portal](how-to-manage-server-portal.md).
- Learn about [service limits](concepts-limits.md).
