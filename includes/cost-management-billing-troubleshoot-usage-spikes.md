---
title: include file
description: include file
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: include
ms.date: 02/09/2021
ms.author: banders
ms.reviewer: isvargas
ms.custom: include file
---

## Troubleshoot usage spikes

This section helps you understand how a usage spike appears in your Azure usage file, how to prevent usage spikes, monitor your resources, and when to contact Azure support. It's intended for customers with an Enterprise Agreement (EA) or a Microsoft Customer Agreement. They must have EA Admin or Billing administrator roles. For more information about permissions, see [Download or view your Azure billing invoice and daily usage data](../articles/cost-management-billing/manage/download-azure-invoice-daily-usage-date.md).

A spike in your Azure usage or unexpected charges for a particular service or resource is often caused by either an incident or unintentional misuse.

In either case, you need to narrow down the affected services and resources before you contact support so that you can choose the right support area.

It's important to understand that it's unlikely that Microsoft can determine the root cause of increased usage and associated charges. So, customers can download their own detailed usage data in the Azure portal.

Microsoft doesn't monitor your deployed Azure resources like virtual machines, networks, or data transfers because of security concerns and customer privacy. However, Microsoft tries to inform you about how you can monitor your Azure usage. Ultimately, it's your responsibility to monitor your own usage.

### What a spike looks like in the usage file

After you've applied the filters described in the preceding sections, you can look for abnormal. For example, you might be troubleshooting a spike for the **Bandwidth** Meter Category).

Place **Product** and **Instance ID** (Resource ID for a Microsoft Customer Agreement) in the Rows section of the pivot table tool. Then add **Cost** in Values, **Subscription ID** in Filters and **Date** in Columns. Then filter to show only data for a subscription ID. For example, `111111111111-1111-1111-111111111111`.

The following image shows what a spike in Bandwidth (Data Transfers) looks like.

:::image type="content" source="./media/cost-management-billing-troubleshoot-usage-spikes/data-usage-spike.png" alt-text="Screenshot of Excel showing a usage spike." lightbox="./media/cost-management-billing-troubleshoot-usage-spikes/data-usage-spike.png" :::

The spike is for a particular resource. In this case, row 7 in the Excel file shows the cost values for the Storage account **storageaccountnameazurefile1**. On October 1 2020, the cost has a value near zero (0) USD (2.23043E-06, which equals to 0.000002230431449). You can see a large spike on October 2 2020 and October 3 2020, when the cost goes to 10,000 and 28,000 USD. Costs returned to normal on October 4 2020 (9.29E-07).

In this example, you identified the resource that incurred a large bandwidth charge, the dates it occurred, and the specific product (Inter-region – Data Transfer Out – Europe). Determine if the spike resulted from a large data transfer. Use the information in the preceding sections to verify your affected resource.

If you determine that there were no transfers from the resource for the mentioned dates, then engage an Azure technical team. The team can help determine if there's a bug or incident causing the problem. In this example, the affected resource is a Storage account. So, you'd contact the Azure Storage technical team. Similarly, if the spike affected a virtual machine, you'd contact the Azure Virtual Machines technical team to determine if there's an ongoing incident affecting the Virtual Machine service.

If there's an ongoing incident, the Azure technical team would coordinate with the Azure Billing team to review a refund request.

### Tools to monitor Azure usage

You can always manage your costs with Azure Cost Management and create budgets. For more information, see:

- [Manage costs with Azure Budgets](../articles/cost-management-billing/manage/cost-management-budget-scenario.md)
- [Tutorial: Create and manage Azure budgets](../articles/cost-management-billing/costs/tutorial-acm-create-budgets.md)

For Storage usage, we recommend that you use the Storage Analytics tool. It allows you to use per-transaction logging. The logs are detailed, but you can do comprehensive tracing and debugging on your own. For more information, see:

- [Storage Analytics](../articles/storage/common/storage-analytics.md)
- [Storage Analytics log format](/rest/api/storageservices/Storage-Analytics-Log-Format)
- [Enable and manage Azure Storage Analytics logs (classic)](../articles/storage/common/manage-storage-analytics-logs.md)

For network-related usage, you can use network capture tools like [Network Monitor](https://www.microsoft.com/download/details.aspx?id=4865)or Fiddler.

For issues related to Virtual Machines with a Windows operating system image, you can use the [Windows Event Log](/windows/win32/wes/windows-event-log).

For Platform as a Service (PaaS) deployments, [enable Azure diagnostics](../articles/cloud-services/cloud-services-dotnet-diagnostics.md) in the application.

For Infrastructure as a Service (IaaS) deployments, enable [Windows Communication Foundation tracing](/dotnet/framework/wcf/diagnostics/tracing/configuring-tracing).

Enable [Enhanced Logging for IIS 8.5](/iis/get-started/whats-new-in-iis-85/enhanced-logging-for-iis85).

[Enable diagnostics logging for web apps in Azure App Service](../articles/app-service/troubleshoot-diagnostic-logs.md).

For more details and advice for your situation, contact your Microsoft Customer Success Account Manager to request assistance from a Cloud Solution Architect.