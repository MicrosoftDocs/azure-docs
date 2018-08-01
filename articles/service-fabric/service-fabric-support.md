---
title: Learn about Azure Service Fabric Support options | Microsoft Docs
description: Azure Service Fabric cluster versions supported and links to file support tickets
services: service-fabric
documentationcenter: .net
author: pkcsf
manager: timlt
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: troubleshooting
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 7/13/2018
ms.author: pkc

---
# Azure Service Fabric support options

To deliver the appropriate support for your Service Fabric clusters that you are running your application work loads on, we have set up various options for you. Depending on the level of support needed and the severity of the issue, you get to pick the right options. 

## Report production issues or request paid support for Azure

For reporting issues on your Service Fabric cluster deployed on Azure, open a ticket for support [on Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)
or [Microsoft support portal](http://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:
 
- [Support from Microsoft for Azure](https://azure.microsoft.com/support/plans/?b=16.44).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

<a id="getlivesitesupportonprem"></a>

## Report production issues or request paid support for standalone Service Fabric clusters

For reporting issues on your Service Fabric cluster deployed on-premises or on other clouds, open a ticket for professional support on [Microsoft support portal](http://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:

- [Professional Support from Microsoft for on-premises](https://support.microsoft.com/en-us/gp/offerprophone?wa=wsignin1.0).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

## Report Azure Service Fabric issues 
We have set up a GitHub repo for reporting Service Fabric issues.  We are also actively monitoring the following forums.

### GitHub repo 
Report Azure Service Fabric Issues on [Service-Fabric-issues git repo](https://github.com/Azure/service-fabric-issues). This repo is intended for reporting and tracking issues with Azure Service Fabric and for making small feature requests. **Do not use this to report live-site issues**.

### StackOverflow and MSDN forums
The [Service Fabric tag on StackOverflow][stackoverflow] and the [Service Fabric forum on MSDN][msdn-forum] are best used for asking questions about how the platform works and how you might accomplish certain tasks with it.

### Azure Feedback forum
The [Azure Feedback Forum for Service Fabric][uservoice-forum] is the best place for submitting big feature ideas you have for the product as we review the most popular requests are part of our medium to long-term planning. We encourage you to rally support for your suggestions within the community.


## Supported Service Fabric versions.

Make sure that your cluster is always running a supported Service Fabric version. As and when we announce the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).

Refer to the following documents on details on how to keep your cluster running a supported Service Fabric version.

- [Upgrade Service Fabric version on an Azure cluster ](service-fabric-cluster-upgrade.md)
- [Upgrade Service Fabric version on a standalone windows server cluster ](service-fabric-cluster-upgrade-windows-server.md)
 
Here are the list of the Service Fabric versions that are supported and their support end dates.

| **Service Fabric runtime in the cluster** | **Can upgrade directly from cluster version** |**Compatible SDK / NuGet Package Versions** | **End of Support Date** |
| --- | --- |--- | --- |
| All cluster versions prior to 5.3.121 | 5.1.158* |Less than or equal to version  2.3 |January 20, 2017 |
| 5.3.* | 5.1.158.* |Less than or equal to version  2.3 |February 24, 2017 |
| 5.4.* | 5.1.158.* |Less than or equal to version  2.4 |May 10,2017       |
| 5.5.* | 5.4.164.* |Less than or equal to version  2.5 |August 10,2017    |
| 5.6.* | 5.4.164.* |Less than or equal to version  2.6 |October 13,2017   |
| 5.7.* | 5.4.164.* |Less than or equal to version  2.7 |December 15,2017  |
| 6.0.* | 5.6.205.* |Less than or equal to version  2.8 |March 30,2018     | 
| 6.1.* | 5.7.221.* |Less than or equal to version  3.0 |July 15,2018      |
| 6.2.* | 6.0.232.* |Less than or equal to version  3.1 |September 15,2018 |
| 6.3.* | 6.1.480.* |Less than or equal to version  3.2 |Current version and so no end date |

## Service Fabric Preview Versions - unsupported for production use.
From time to time, we release versions that have significant features we want feedback on, which are released as previews. These preview versions should only be used for test purposes. Your production cluster should always be running a supported, stable, Service Fabric version. A preview version always begins with a major and minor version number of 255. For example, if you see a Service Fabric version 255.255.5703.949, that release version is only to be used in test clusters and is in preview. These preview releases are also announced on the [Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric) and will have details on the features included.

There is no paid support option for these preview releases. Use one of the options listed under [Report Azure Service Fabric issues](https://docs.microsoft.com/azure/service-fabric/service-fabric-support#report-azure-service-fabric-issues) to ask questions or provide feedback.

## Next steps

- [Upgrade service fabric version on an Azure cluster ](service-fabric-cluster-upgrade.md)
- [Upgrade Service Fabric version on a standalone windows server cluster ](service-fabric-cluster-upgrade-windows-server.md)

<!--references-->
[msdn-forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureServiceFabric
[stackoverflow]: http://stackoverflow.com/questions/tagged/azure-service-fabric
[uservoice-forum]: https://feedback.azure.com/forums/293901-service-fabric
[acom-docs]: http://aka.ms/servicefabricdocs
[sample-repos]: http://aka.ms/servicefabricsamples
