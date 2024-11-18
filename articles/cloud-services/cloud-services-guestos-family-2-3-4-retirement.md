---
title: Guest OS family 2, 3, and 4 retirement notice | Microsoft Docs
description: Information about when the Azure Guest OS Family 2, 3, and 4 retirement happened and how to determine if their retirement affects you.
services: cloud-services
ms.subservice: guest-os-patching
author: raiye
manager: timlt
ms.service: azure-cloud-services-classic
ms.topic: article
ms.date: 07/23/2024
ms.author: raiye
ms.custom: compute-evergreen
---

# Guest OS Family 2, 3, and 4 retirement notice

The retirement of Azure Guest OS Families 2, 3, and 4 was announced in July 2024, with the following end-of-life dates: 
- **Windows Server 2008 R2:** December 2024 
- **Windows Server 2012 and Windows Server 2012 R2:** February 2025 

If you have questions, visit the [Microsoft question page for Cloud Services](/answers/topics/azure-cloud-services.html) or [contact Azure support](https://azure.microsoft.com/support/options/).

## Are you affected?

Your Cloud Services or [Cloud Services Extended Support](../cloud-services-extended-support/overview.md) are affected if any one of the following applies:

1. You have a value of `osFamily` = `2`, `3`, or `4` explicitly specified in the `ServiceConfiguration.cscfg` file for your Cloud Service.
1. The Azure portal lists your Guest Operating System family value as *Windows Server 2008 R2*, *Windows Server 2012*, or *Windows Server 2012 R2*. 

To find which of your cloud services are running which OS Family, you can run the following script in Azure PowerShell, though you must [set up Azure PowerShell](/powershell/azure/) first.

```powershell
foreach($subscription in Get-AzureSubscription) {
    Select-AzureSubscription -SubscriptionName $subscription.SubscriptionName

    $deployments=get-azureService | get-azureDeployment -ErrorAction Ignore | where {$_.SdkVersion -NE ""}

    $deployments | ft @{Name="SubscriptionName";Expression={$subscription.SubscriptionName}}, ServiceName, SdkVersion, Slot, @{Name="osFamily";Expression={(select-xml -content $_.configuration -xpath "/ns:ServiceConfiguration/@osFamily" -namespace $namespace).node.value }}, osVersion, Status, URL
}
```

This retirement affects your cloud services if the `osFamily` column in the script output contains a `2`, `3`, `4`, or is empty. If empty, the default `osFamily` attribute points to `osFamily` `5`. 

## Recommendations

If this retirement affects you, we recommend you migrate your Cloud Service or [Cloud Services Extended Support](../cloud-services-extended-support/overview.md) roles to one of the supported Guest OS Families:

**Guest OS family 7.x** - Windows Server 2022 *(recommended)* 

1. Ensure that your application is using Visual Studio 2019 or newer with Azure Development Workload as selected and your application is targeting .NET framework version 4.8 or newer. 
1. Set the osFamily attribute to "7" in the `ServiceConfiguration.cscfg` file, and redeploy your cloud service. 

**Guest OS family 6.x** - Windows Server 2019 

1. Ensure that your application is using SDK 2.9.6 or later and your application is targeting .NET framework 3.5 or 4.7.2 or newer. 
1. Set the osFamily attribute to "6" in the `ServiceConfiguration.cscfg` file, and redeploy your cloud service. 

## Important clarification regarding support 

The announcement of the retirement of Azure Guest OS Families 2, 3, and 4, effective March 2025, pertains specifically to the operating systems within these families. This retirement doesn't extend the overall support timeline for Azure Cloud Services (classic) beyond the scheduled deprecation in August 2024. [Cloud Services Extended Support](../cloud-services-extended-support/overview.md) continues support with Guest OS Families 5 and newer. 

Customers currently using Azure Cloud Services who wish to continue receiving support beyond August 2024 are encouraged to transition to [Cloud Services Extended Support](../cloud-services-extended-support/overview.md). This separate service offering ensures continued assistance and support. Cloud Services Extended Support requires a distinct enrollment and isn't automatically included with existing Azure Cloud Services subscriptions. 

## Next steps

Review the latest [Guest OS releases](cloud-services-guestos-update-matrix.md).
