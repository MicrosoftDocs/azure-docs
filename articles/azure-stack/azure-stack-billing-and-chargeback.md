---
title: Customer Billing And Chargeback In Azure Stack | Microsoft Docs
description: Learn how to retrieve resource usage information from Azure Stack.
services: azure-stack
documentationcenter: ''
author: AlfredoPizzirani
manager: byronr
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: alfredop

---
# Customer billing and chargeback in Azure Stack
Now that you’re using Azure Stack, it’s a good idea to think about how
to track usage. Service providers rely on usage information to bill
their customers, and to understand the cost of providing services.
Enterprises, too, typically track usage by department.

Azure Stack is not a billing system. It won’t charge your tenants for
the resources they use. But, Azure Stack does have the infrastructure to
collect and aggregate usage data for every single resource provider. You
can access this data and export it to a billing system by using a
billing adapter, or export it to a business intelligence tool like
Microsoft Power BI.

![Conceptual model of a billing adapter connecting Azure Stack to a Billing application](media/azure-stack-billing-and-chargeback/image1.png)

## What usage information can I find, and how?
Azure Stack resource providers generate usage records at hourly
intervals. The records show the amount of each resource that was
consumed, and which subscription consumed the resource. This data is
stored. You can access the data via the REST API.

A service administrator can retrieve usage data for all tenant
subscriptions. Individual tenants can retrieve only their own
information.

Usage records have information about storage, network, and compute
usage. For a list of meters, see [this article](azure-stack-usage-related-faq.md).

## Retrieve usage information
To generate records, it’s essential that you have resources running and
actively using the system. If you’re unsure whether you have any
resources running, in Azure Stack Marketplace deploy, then run a virtual
machine (VM). Look at the VM monitoring blade to make sure it’s running.

We recommend that you run Windows PowerShell cmdlets to view usage data.
PowerShell calls the Resource Usage APIs.

1. [Install and configure Azure
   PowerShell](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/).
2. To sign in to Azure Resource Manager, use the PowerShell cmdlet
   **Login-AzureRmAccount**.
3. To select the subscription that you used to create resources, type
   **Get-AzureRmSubscription –SubscriptionName “your sub” |
   Select-AzureRmSubscription**.
4. To retrieve the data, use the PowerShell cmdlet
   [**Get-UsageAggregates**](https://msdn.microsoft.com/en-us/library/mt619285.aspx).
   If usage data is available, it’s returned in PowerShell, as in the
   following example. PowerShell returns 1,000 lines of usage per call.
   You can use the *continuation* argument to retrieve sets of lines
   beyond the first 1,000. For more information about usage data, see
   the [Resource Usage API reference](azure-stack-provider-resource-api.md).
   
   ![](media/azure-stack-billing-and-chargeback/image2.png)

## Next steps
[Provider Resource Usage API](azure-stack-provider-resource-api.md)

[Tenant Resource Usage API](azure-stack-tenant-resource-usage-api.md)

[Usage-related FAQ](azure-stack-usage-related-faq.md)

