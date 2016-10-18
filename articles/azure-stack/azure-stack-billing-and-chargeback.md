<properties
	pageTitle="Customer Billing And Chargeback In Azure Stack | Microsoft Azure"
	description="Learn how to retrieve resource usage information from Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="AlfredoPizzirani"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="provider-resource-api"
	ms.date="10/18/2016"
	ms.author="alfredop"/>

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

![](media/image1.png){width="6.5in" height="1.582638888888889in"}

## What usage information can I find, and how?

Azure Stack resource providers generate usage records at hourly
intervals. The records show the amount of each resource that was
consumed, and which subscription consumed the resource. This data is
stored. You can access the data via the REST API.

A service administrator can retrieve usage data for all tenant
subscriptions. Individual tenants can retrieve only their own
information.

Usage records have information about storage, network, and compute
usage. For a list of meters, see (link to FAQ article).

## Retrieve usage information

To generate records, it’s essential that you have resources running and
actively using the system. If you’re unsure whether you have any
resources running, in Azure Stack Marketplace deploy, then run a virtual
machine (VM). Look at the VM monitoring blade to make sure it’s running.

We recommend that you run Windows PowerShell cmdlets to view usage data.
PowerShell calls the Resource Usage APIs.

1.  [Install and configure Azure
    PowerShell](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/).

2.  To sign in to Azure Resource Manager, use the PowerShell cmdlet
    **Login-AzureRmAccount**.

3.  To select the subscription that you used to create resources, type
    **Get-AzureRmSubscription –SubscriptionName “your sub” |
    Select-AzureRmSubscription**.

4.  To retrieve the data, use the PowerShell cmdlet
    [**Get-UsageAggregates**](https://msdn.microsoft.com/en-us/library/mt619285.aspx).
    If usage data is available, it’s returned in PowerShell, as in the
    following example. PowerShell returns 1,000 lines of usage per call.
    You can use the *continuation* argument to retrieve sets of lines
    beyond the first 1,000. For more information about usage data, see
    article.

    ![](media/image2.png){width="6.5in"
    height="3.5256944444444445in"}

## Next steps

[Provider Resource Usage API](provider-resource-usage-api.md)

[Tenant Resource Usage API](tenant-resource-usage-api.md)

[Usage-related FAQ](usage-related-faq.md)
