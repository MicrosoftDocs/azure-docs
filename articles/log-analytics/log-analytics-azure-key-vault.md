<properties
	pageTitle="Azure Key Vault solution in Log Analytics | Microsoft Azure"
	description="You can use the Azure Key Vault solution in Log Analytics to review Azure Key Vault logs."
	services="log-analytics"
	documentationCenter=""
	authors="richrundmsft"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/05/2016"
	ms.author="richrund"/>

# Azure Key Vault (Preview) solution in Log Analytics

>[AZURE.NOTE] This is a [preview solution](log-analytics-add-solutions.md#log-analytics-preview-solutions-and-features)

You can use the Azure Key Vault solution in Log Analytics to review Azure Key Vault AuditEvent logs.

You can enable logging of Audit Events for Azure Key Vault and these logs are written to blob storage where they can then be indexed by Log Analytics for searching and analysis. 

## Installing and configuring the solution

Use the following instructions to install and configure the Azure Key Vault solution:

1.	Enable [diagnostics logging for the Key Vault](../key-vault/key-vault-logging.md) resources you want to monitor
2.	Configure log analytics to read the logs from blob storage using the process described in [Configure Azure Diagnostics Written to Blob in JSON](log-analytics-powershell-azure-diagnostics-json.md).
3.	Enable the Azure Key Vault solution using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md).  

## Azure Key Vault data collection details

Azure Key Vault solution collects diagnostics logs from Azure blob storage for Azure Key Vault.
No agent is required for data collection.

The following table shows data collection methods and other details about how data is collected for Azure Key Vault.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
|---|---|---|---|---|---|---|
|Azure|![No](./media/log-analytics-azure-keyvault/oms-bullet-red.png)|![No](./media/log-analytics-azure-keyvault/oms-bullet-red.png)|![Yes](./media/log-analytics-azure-keyvault/oms-bullet-green.png)|            ![No](./media/log-analytics-azure-keyvault/oms-bullet-red.png)|![No](./media/log-analytics-azure-keyvault/oms-bullet-red.png)| 10 minutes|

## Use Azure Key Vault

After the solution is installed, you can view the summary of request statuses over time for your monitored Key Vaults by using the **Azure Key Vault** tile on the **Overview** page in Log Analytics.

![image of Azure Key Vault tile](./media/log-analytics-azure-keyvault/log-analytics-keyvault-tile.png)

After clicking on the Overview tile you can view summaries of your logs and then drill-into details for the following categories:

- Volume of all key vault operations over time
- Failed Operation volumes over time
- Average Operational latency by operation
- Quality of service for operations with number of operations taking more than 1000ms and list of operations taking more than 1000ms

![image of Azure Key Vault dashboard](./media/log-analytics-azure-keyvault/log-analytics-keyvault01.png)

![image of Azure Key Vault dashboard](./media/log-analytics-azure-keyvault/log-analytics-keyvault02.png)

### To view details for any operation

1. On the **Overview** page, click the **Azure Key Vault** tile.
2. On the **Azure Key Vault** dashboard, review the summary information in one of the blades and then click one to view detailed information about it in the **log search** page.
3. On any of the log search pages, you can view results by time, detailed results, and your log search history. You can also filter by facets to narrow the results.

## Next steps

- Use [Log searches in Log Analytics](log-analytics-log-searches.md) to view detailed Azure Key Vault data.

