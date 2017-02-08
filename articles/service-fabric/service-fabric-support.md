---
title: Learn about Azure Service Fabric Support options | Microsoft Docs
description: Azure Service Fabric cluster versions supported and links to file support tickets.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/07/2016
ms.author: chackdan

---
# Azure Service Fabric support options

To deliver the appropriate support for your Service Fabric clusters that you are running your application work loads on, we have set up various options for you. Depending on the level of support needed and the severity of the issue, you get to pick the right options. 


<a id="getlivesitesupportonazure"></a>

## Report production or live-site issues or request paid support for Azure

For reporting live-site issues on your Service Fabric cluster deployed on Azure, Open a ticket for professional support [on Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)
or [Microsoft support portal](http://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:
 
- [Professional Support from Microsoft for Azure](https://azure.microsoft.com/en-us/support/plans/?b=16.44).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

<a id="getlivesitesupportonprem"></a>

## Report production or live-site issues or request paid support for standalone Service Fabric clusters

For reporting live-site issues on your Service Fabric cluster deployed on premise or on other clouds, open a ticket for professional support on [Microsoft support portal](http://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:

- [Professional Support from Microsoft for on-premise](https://support.microsoft.com/en-us/gp/offerprophone?wa=wsignin1.0).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).


<a id="getsupportonissues"></a>
## Report Azure Service Fabric issues 
We have set up a GitHub repo for reporting Service Fabric issues.  We are also actively monitoring the following forums.

### GitHub repo 
Report Azure Service Fabric Issues on [Service-Fabric-issues git repo](https://github.com/Azure/service-fabric-issues). This repo is intended for reporting and tracking issues with Azure Service Fabric and for making small feature requests. **Do not use this to report live-site issues**.

### StackOverflow and MSDN forums

The [Service Fabric tag on StackOverflow][stackoverflow] and the [Service Fabric forum on MSDN][msdn-forum] are best used for asking questions about how the platform works and how you might accomplish certain tasks with it.

### Azure Feedback forum

The [Azure Feedback Forum for Service Fabric][uservoice-forum] is the best place for submitting big feature ideas you have for the product as we review the most popular requests are part of our medium to long-term planning. We encourage you to rally support for your suggestions within the community.


<a id="releasesuport"></a>
## Supported Service Fabric versions.

Make sure that your cluster is always running a supported Service Fabric version. As and when we announce the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).

Refer to the following documents on details on how to keep your cluster running a supported Service Fabric version.

- [Upgrade Service Fabric version on an Azure cluster ](service-fabric-cluster-upgrade.md)
- [Upgrade Service Fabric version on a standalone windows server cluster ](service-fabric-cluster-upgrade-windows-server.md)
 
Here are the list of the Service Fabric versions that are supported and their support end dates.

| **Service Fabric runtime cluster** | **End of Support Date** |
| --- | --- |
| All cluster versions prior to 5.3.121 |January 20, 2017 |
| 5.3.121.* |February 24, 2017 |
| 5.3.204.* |February 24, 2017 |
| 5.3.301.* |February 24, 2017 |
| 5.3.311.* |February 24, 2017 |
| 5.4.145.* |Current version and so no end date


## Next steps

- [Upgrade service fabric version on an Azure cluster ](service-fabric-cluster-upgrade.md)
- [Upgrade Service Fabric version on a standalone windows server cluster ](service-fabric-cluster-upgrade-windows-server.md)

<!--references-->
[msdn-forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureServiceFabric
[stackoverflow]: http://stackoverflow.com/questions/tagged/azure-service-fabric
[uservoice-forum]: https://feedback.azure.com/forums/293901-service-fabric
[acom-docs]: http://aka.ms/servicefabricdocs
[sample-repos]: http://aka.ms/servicefabricsamples
