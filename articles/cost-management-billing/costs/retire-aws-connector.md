---
title: Retire your Amazon Web Services (AWS) connector
description: This article helps you transition away from the Connector for AWS and it helps you remove it from Cost Management.
author: bandersmsft
ms.author: banders
ms.date: 03/20/2024 
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: shasulin
---

# Retire your AWS connector

The Connector for AWS in the Cost Management service will retire on March 31, 2025. Consider alternative solutions for AWS cost management reporting. This article helps you transition away from the Connector for AWS and it helps you remove the Connector for AWS from the Cost Management service.

Until the Connector for AWS in Cost Management is officially removed, existing connectors for AWS continue to work and are fully supported. On March 15, 2024, the ability to add new connectors for AWS will be disabled. You should transition away from the Connector for AWS at your earliest convenience. Doing so provides time for you to adopt your preferred alternative solution and carry out any necessary testing. After you successfully transition away from the Connector for AWS, you should  remove the Connector for AWS from the Cost Management service. Then delete budgets and alerts created to govern AWS costs in Cost Management, using the following information.

On March 31, 2025, Azure will delete all remaining Connectors for AWS. The AWS connector will no longer be available. AWS cost and usage data stored in the Cost Management service, including historical data will be removed. All associated reports will also stop working.

> [!IMPORTANT]
> - Copies of the AWS CUR file you have stored in your S3 service in AWS will not be deleted.
> - When you transition away from the Connector for AWS, remove the roles you have assigned to Microsoft account number `432263259397` in the AWS console. To review the permissions provided during the Connector for AWS set up, see [Set up and configure AWS Cost and Usage report integration](aws-integration-set-up-configure.md#use-the-create-a-new-role-wizard).

As you migrate off the Connector for AWS, make sure to delete the following items:

- Connector for AWS
- Budgets that monitor AWS charges
- Alerts set up for AWS charges

To delete the connector, use the following information.

## Delete the AWS Connector

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. In the left navigation menu under **Settings**, select **Connectors**.
1. Select all the connectors displayed in the list and then select **Delete**.  
    :::image type="content" source="./media/retire-aws-connector/connectors-page.png" alt-text="Screenshot showing the Connectors page." lightbox="./media/retire-aws-connector/connectors-page.png" :::

## Delete budgets that monitor AWS charges

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. In the left navigation menu, select **Budgets**, and then select the budget you want to delete.  
    :::image type="content" source="./media/retire-aws-connector/budgets-page.png" alt-text="Screenshot showing the Budgets page." lightbox="./media/retire-aws-connector/budgets-page.png" :::
1. Select a budget and review the details, then select **Delete budget**.  
    :::image type="content" source="./media/retire-aws-connector/budgets-details.png" alt-text="Screenshot showing the budget details page." lightbox="./media/retire-aws-connector/budgets-details.png" :::

## Dismiss alerts set up for AWS charges

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. In left navigation menu, select **Cost alerts**.
1. Select all the alerts set up for AWS charges and then select **Dismiss**.  
    :::image type="content" source="./media/retire-aws-connector/cost-alerts.png" alt-text="Screenshot showing the Cost alerts page." lightbox="./media/retire-aws-connector/cost-alerts.png" :::
1. You can select an alert to view more details.

## Frequently asked questions

Question: Who can I reach out to with questions about the Connector for AWS retirement?<br>
Answer: If you have questions about the connector retirement, create a support request in the Azure portal. Select the **Billing** area and then under the **Cost Management** subject, submit a ticket using any of the topics listed with **Connector to AWS** in the content.

## Next steps

- To review the permissions provided during the Connector for AWS setup, see [Set up and configure AWS Cost and Usage report integration](aws-integration-set-up-configure.md#use-the-create-a-new-role-wizard).