---
title: Microsoft Defender for SQL
titleSuffix: Azure Synapse Analytics
description: Learn how Microsoft Defender for SQL manages vulnerabilities and detects anomalous activity in Azure Synapse Analytics dedicated SQL pools.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Microsoft Defender for SQL in Azure Synapse Analytics

Microsoft Defender for SQL is a Defender plan in Microsoft Defender for Cloud. Microsoft Defender for SQL includes functionality for surfacing and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate a threat to your Azure Synapse Analytics dedicated SQL pool. It provides a single location for enabling and managing these capabilities.

Microsoft Defender for SQL doesn't apply to serverless SQL pools or Apache Spark pools.

## What are the benefits of Microsoft Defender for SQL?

Microsoft Defender for SQL provides a set of advanced SQL security capabilities, including SQL Vulnerability Assessment and Advanced Threat Protection.

- [Vulnerability Assessment](/azure/defender-for-cloud/sql-azure-vulnerability-assessment-overview) is an easy-to-configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and it includes actionable steps to resolve security issues and enhance your database fortifications.
- [SQL Advanced Threat Protection](threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and it provides immediate security alerts on potential vulnerabilities, SQL injection attacks, and anomalous database access patterns. Advanced Threat Protection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

Enable Microsoft Defender for SQL once to enable all these included features for the databases on your [logical server](logical-servers.md). Enabling or managing Microsoft Defender for SQL settings requires membership in the [SQL Security Manager](/azure/role-based-access-control/built-in-roles#sql-security-manager) role or one of the database or server administrator roles.

For more information about Microsoft Defender for SQL pricing, see the [Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/security-center/).

## Enable Microsoft Defender for SQL

There are multiple ways to enable Microsoft Defender plans. You can enable it at the subscription level (**recommended**) either:

- [In Microsoft Defender for Cloud in the Azure portal](#enable-microsoft-defender-for-sql-at-the-subscription-level-in-microsoft-defender-for-cloud)
- [Programmatically with the REST API, Azure CLI, PowerShell, or Azure Policy](#enable-microsoft-defender-plans-programatically)

Alternatively, you can enable it at the resource level as described in [Enable Microsoft Defender for SQL at the resource level](#enable-microsoft-defender-for-sql-at-the-resource-level).

When you enable the plan at the subscription level, dedicated SQL pools in logical servers in the subscription are protected. Dedicated SQL pools in Azure Synapse Analytics workspaces do not use logical SQL servers. You can then disable individual resources. To manually manage which resources are protected, disable the plan at the subscription level and enable each resource that you want protected.

### Enable Microsoft Defender for SQL at the subscription level in Microsoft Defender for Cloud

To enable Microsoft Defender for SQL at the subscription level from within Microsoft Defender for Cloud:

1. From the [Azure portal](https://portal.azure.com), open **Defender for Cloud**.
1. From Defender for Cloud's menu, select **Environment Settings**.
1. Select the relevant subscription.
1. Change the plan setting to **On**.
1. Select **Save**.

<a id="enable-microsoft-defender-plans-programatically"></a>

### Enable Microsoft Defender plans programmatically

You can use several programmatic methods to enable Microsoft Defender plans in Azure.

Use any of the following tools to enable Microsoft Defender for your subscription:

| Method | Instructions |
| --- | --- |
| REST API | [Pricings API](/rest/api/securitycenter/pricings) |
| Azure CLI | [az security pricing](/cli/azure/security/pricing) |
| PowerShell | [Set-AzSecurityPricing](/powershell/module/az.security/set-azsecuritypricing) |
| Azure Policy | [Bundle Pricings](https://github.com/Azure/Azure-Security-Center/blob/master/Pricing%20%26%20Settings/ARM%20Templates/Set-ASC-Bundle-Pricing.json) |

### Enable Microsoft Defender for SQL at the resource level

Enable Microsoft Defender plans at the subscription level so that new resources are automatically protected. However, if you have an organizational reason to enable Microsoft Defender for Cloud at the resource level, use the following steps:

1. From the [Azure portal](https://portal.azure.com), open your dedicated SQL pool or its logical server.
1. Under the **Security** heading, select **Defender for Cloud**.
1. Select **Enable Microsoft Defender for SQL**.

> [!NOTE]
> A storage account is automatically created and configured to store your **Vulnerability Assessment** scan results. If you already enabled Microsoft Defender for another server in the same resource group and region, the existing storage account is used.
>
> The cost of Microsoft Defender for SQL aligns with Microsoft Defender for Cloud standard tier pricing per node, where a node is the entire logical server. You pay only once for protecting all databases on the server with Microsoft Defender for SQL. You can evaluate Microsoft Defender for Cloud with a free trial.

## Manage Microsoft Defender for SQL settings

To view and manage Microsoft Defender for SQL settings:

1. From the **Security** area of your dedicated SQL pool or logical server, select **Defender for Cloud**.

    On this page, you see whether Microsoft Defender for SQL is enabled.

1. If Microsoft Defender for SQL is enabled, select **Configure** to edit its settings.

1. Make the necessary changes and select **Save**.

## Related content

- [Vulnerability Assessment](/azure/defender-for-cloud/sql-azure-vulnerability-assessment-overview)
- [SQL Advanced Threat Protection for Azure Synapse Analytics](threat-detection-overview.md)
- [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
