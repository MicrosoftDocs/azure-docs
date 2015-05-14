<properties 
   pageTitle="Supportability and retirement policy guide for Azure Guest OS | Azure" 
   description="Provides information about what Microsoft will support as regards to the Azure Guest OS used by Cloud Services." 
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
   ms.date="02/23/2015"
   ms.author="adegeo"/>

# Azure Guest OS Supportability and Retirement Policy
The information on this page relates to the Azure Guest operating system ([Guest OS](https://msdn.microsoft.com/library/azure/ff729422.aspx)) for Cloud Services worker and web roles (PaaS). It does not apply to Virtual Machines (IaaS). 

Microsoft has a published [support policy for the Guest OS](http://support.microsoft.com/gp/azure-cloud-lifecycle-faq). The page you are reading now describes how the policy is implemented.

The policy is 

1. Microsoft will support **at least the latest two families of the Guest OS**. When a family is retired, customers have 12 months from the official retirement date to update to a newer supported Guest OS family.
2. Microsoft will support the **at least the latest two versions of the supported Guest OS families**. 
3. Microsoft will support the at **least the latest two versions of the Azure SDK**. When a version of the SDK is retired, customers will have 12 months from the official retirement date to update to a newer version. 

At times more than two families or releases may be supported. Official Guest OS support information will appear on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).


## When a Guest OS family or version is retired 


A new Guest OS **family** is introduced sometime after the release of a new official version of the Windows Server operating system. Whenever a new Guest OS family is introduced, Microsoft will retire the oldest Guest OS family. 

New Guest OS **versions** are introduced about every month to incorporate the latest MSRC updates. Because of the regular monthly updates, a Guest OS version is normally disabled 60 days after its release. This keeps at least two Guest OS versions for each family available for use. 

### Process during a Guest OS family retirement 


Once the retirement is announced, customers have a 12 month "transition" period before the older family is officially removed from service. This transition time may be extended at the discretion of Microsoft. Updates will be posted on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

A gradual retirement process will begin 6 months into the transition period. During this time:

1. Microsoft will notify customers of the retirement. 
2. The newer version of the Azure SDK won’t support the retired Guest OS family.
3. New deployments and redeployments of Cloud Services will not be allowed on the retired family

Microsoft will continue to introduce new Guest OS version incorporating the latest MSRC updates until the last day of the transition period, known as the "expiration date". At that time, the any Cloud Services still running will be unsupported under the Azure SLA. Microsoft has the discretion to force upgrade, delete or stop those services after that date.



### Process during a Guest OS Version retirement 
If customers set their Guest OS to automatically update, they never have to worry about dealing with Guest OS versions. They will always be using the latest Guest OS version.

Guest OS Versions are released every month. Because of the rate of regular releases, each version has a fixed lifespan.

At 60 days into the lifespan a version is "*disabled*". "Disabled" means that the version is removed from the Azure Management Portal. It also can no longer be set from the CSCFG configuration file. Existing deployments are left running, but new deployments and code and configuration updates to existing deployments will not be allowed. 

At a later time, the Guest OS version "*expires*" and any installations still running that version are force upgraded and set to automatically update the Guest OS in the future. Expiration is done in batches so the period of time from disablement to expiration can vary. 

These periods may be made longer at Microsoft's discretion to ease customer transitions. Any changes will be communicated on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).



### Notifications during retirement 

* **Family retirement** <br>Microsoft will use blog posts and management portal notification. Customers who are still using a retired Guest OS family will be notified through direct communication (email, portal messages, phone call) to assigned service administrators. All changes will be posted to this page and the RSS feed listed at the beginning of this page. 


* **Version Retirement** <br>All changes will be posted to this page and the RSS feed listed at the beginning of this page, including the release, disabled and expiration dates. Services admins will receive emails if they have deployments running on a disabled Guest OS version or family. The timing of these emails can vary. Generally they are at least a month before disablement, though this timing is not an official SLA. 


## Frequently asked questions

**How can I mitigate the impacts of migration?**

You should use latest Guest OS family for designing your Cloud Services. 

1. Start planning your migration to a newer family early. 
2. Set up temporary test deployments to test your Cloud Service running on the new family. 
3. [Set your Guest OS version](https://msdn.microsoft.com/library/azure/gg433101.aspx) to "Automatic" (osVersion=* in the [.CSCFG](https://msdn.microsoft.com/library/azure/gg456324.aspx) file) so the migration to new Guest OS versions occurs automatically.

**What if my web application requires deeper integration with the OS?**

If your web application architecture requires deeper dependency on the underlying operating system, use platform supported capabilities such as "[Startup Tasks](https://msdn.microsoft.com/library/windowsazure/gg456327.aspx)" or other extensibility mechanisms which may exist in the future. Alternatively, you can also use [Azure Virtual Machines](http://www.windowsazure.com/home/scenarios/virtual-machines/) (IaaS – Infrastructure as a Service), where you are responsible for maintaining the underlying operating system.
