<properties 
   pageTitle="Guest OS family 1 retirement notice | Azure" 
   description="Provides information about when the Azure Guest OS Family 1 retirement happened and how to determine if you are affected" 
   services="cloud-services" 
   documentationCenter="na" 
   authors="Thraka" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd" 
   ms.date="02/27/2015"
   ms.author="adegeo"/>



# Guest OS Family 1 Retirement Notice

The retirement of OS Family 1 was first announced on June 1, 2013.

**Sept 2, 2014** The Azure Guest operating system (Guest OS) Family 1.x, which is based on the Windows Server 2008 operating system, was officially retired. All attempts to deploy new services or upgrade existing services using Family 1 will fail with an error message informing you that the Guest OS Family 1 has been retired. 

**November 3, 2014** Extended support for Guest OS Family 1 ended and it is fully retired. All services still on Family 1 will be impacted. We may stop those services at any time. There is no guarantee your services will continue to run unless you manually upgrade them yourself.

If you have additional questions, please visit the [Cloud Services Forums](http://social.msdn.microsoft.com/Forums/home?forum=windowsazuredevelopment&filter=alltypes&sort=lastpostdesc) or [contact Azure support](http://azure.microsoft.com/support/options/).




## Are you affected?

Your Cloud Services are affected if any one of the following applies:

1. You have a value of "osFamily = "1" explicitly specified in the ServiceConfiguration.cscfg file for your Cloud Service. 
2. You do not have a value for osFamily explicitly specified in the ServiceConfiguration.cscfg file for your Cloud Service. Currently, the system uses the default value of "1" in this case.
3. The Azure Management Portal lists your Guest Operating System family value as "Windows Server 2008". See [this](https://msdn.microsoft.com/library/azure/gg456325.aspx) to locate this value.

To find which of your cloud services are running which OS Family, you can run the script below in Azure PowerShell, though you must [set up Azure PowerShell](install-configure-powershell.md) first. For additional details on the script, see [Azure Guest OS Family 1 End of Life: June 2014](http://blogs.msdn.com/b/ryberry/archive/2014/04/02/azure-guest-os-family-1-end-of-life-june-2014.aspx). 

```Powershell
foreach($subscription in Get-AzureSubscription) {
    Select-AzureSubscription -SubscriptionName $subscription.SubscriptionName 
    
    $deployments=get-azureService | get-azureDeployment -ErrorAction Ignore | where {$_.SdkVersion -NE ""} 

    $deployments | ft @{Name="SubscriptionName";Expression={$subscription.SubscriptionName}}, ServiceName, SdkVersion, Slot, @{Name="osFamily";Expression={(select-xml -content $_.configuration -xpath "/ns:ServiceConfiguration/@osFamily" -namespace $namespace).node.value }}, osVersion, Status, URL
}
```

Your cloud services will be impacted by OS Family 1 retirement if the osFamily column in the script output is empty or contains a "1". 

## Recommendations if you are affected

We recommend you migrate your Cloud Service roles to one of the supported Guest OS Families:

**Guest OS family 4.x** - Windows Server 2012 R2 *(recommended)*

1. Ensure that your application is using SDK 2.1 or later with .NET framework 4.0, 4.5 or 4.5.1.
2. Set the osFamily attribute to “4” in the ServiceConfiguration.cscfg file, and redeploy your cloud service.


**Guest OS family 3.x** - Windows Server 2012

1. Ensure that your application is using SDK 1.8 or later with .NET framework 4.0 or 4.5. 
2. Set the osFamily attribute to “3” in the ServiceConfiguration.cscfg file, and redeploy your cloud service.


**Guest OS family 2.x** - Windows Server 2008 R2

1. Ensure that your application is using SDK 1.3 and above with .NET framework 3.5 or 4.0. 
2. Set the osFamily attribute to "2" in the ServiceConfiguration.cscfg file, and redeploy your cloud service.


## Extended Support for Guest OS Family 1 ended Nov 3, 2014
Cloud services on Guest OS family 1 are no longer supported. Please migrate off family 1 as soon as possible to avoid service disruption. 