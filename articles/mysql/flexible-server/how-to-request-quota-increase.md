---
title: Request quota increases for Azure Database for MySQL
description: Request quota increases for Azure Database for MySQL - Flexible Server resources.
author: karla-escobar # GitHub alias
ms.author: karlaescobar # Microsoft alias
ms.reviewer: maghan
ms.date: 02/29/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: troubleshooting
---

# Request quota increases for Azure Database for MySQL - Flexible Server

The resources in Azure Database for MySQL - Flexible Server have default quotas/limits. However, there might be a case where your workload needs more quota than the default value. In such case, you must reach out to the Azure Database for MySQL - Flexible Server team to request a quota increase. This article explains how to request a quota increase for Azure Database for MySQL - Flexible Server resources.

## Create a new support request

To request a quota increase, you must create a new support request with your workload details. The Azure Database for MySQL flexible server team then processes your request and approves or denies it. Use the following steps to create a new support request from the Azure portal:

1. Sign into the Azure portal.

1. From the left-hand menu, select **Help + support** and then select **Create a support request**.

1. In the **Problem Description** tab, fill the following details:

   - For **Summary**, Provide a short description of your request such as your workload, why the default values aren't sufficient along with any error messages you're observing.
   - For **Issue type**, select **Service and subscription limits (quotas)**
   - For **Subscription**, select the subscription for which you want to increase the quota.
   - For **Quota type**, select **Azure Database for MySQL Flexible Server**

   :::image type="content" source="media/how-to-request-quota-increase/request-quota-increase-mysql-flex.png" alt-text="Screenshot of new support request.":::

1. In the **Additional Details** tab, enter the details corresponding to your quota request. The Information provided on this tab is used to further assess your issue and help the support engineer troubleshoot the problem.
1. Fill the following details in this form:

   - In  **Request details** select **Enter details** and select the relevant **Quota Type**

   provide the requested information for your specific quota request like Location, Series, New Quota.

   - **File upload**: Upload the diagnostic files or any other files that you think are relevant to the support request. To learn more on the file upload guidance, see the [Azure support](../../azure-portal/supportability/how-to-manage-azure-support-request.md#upload-files) article.

   - **Allow collection of advanced ​diagnostic information?​**: Choose Yes or NO

   - **Severity**: Choose one of the available severity levels based on the business impact.

   - **Preferred contact method**: You can either choose to be contacted over **Email** or by **Phone**.

1. Fill out the remaining details such as your availability, support language, contact information, email, and phone number on the form.

1. Select **Next: Review+Create**. Validate the information provided and select **Create** to create a support request.

The Azure Database for MySQL - Flexible Server support team processes all quota requests in 24-48 hours.

## Related content

- [Create an Azure Database for MySQL - Flexible Server instance in the portal](/azure/mysql/flexible-server/quickstart-create-server-portal)
- [Service limitations](/azure/mysql/flexible-server/concepts-limitations)
