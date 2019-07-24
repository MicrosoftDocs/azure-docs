---
title: Learn about Azure Service Fabric Support options | Microsoft Docs
description: Azure Service Fabric cluster versions supported and links to file support tickets
services: service-fabric
documentationcenter: .net
author: pkcsf
manager: jpconnock
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: troubleshooting
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 8/24/2018
ms.author: pkc

---
# Azure Service Fabric support options

To deliver the appropriate support for your Service Fabric clusters that you are running your application work loads on, we have set up various options for you. Depending on the level of support needed and the severity of the issue, you get to pick the right options. 

## Report production issues or request paid support for Azure

For reporting issues on your Service Fabric cluster deployed on Azure, open a ticket for support [on Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)
or [Microsoft support portal](https://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:
 
- [Support from Microsoft for Azure](https://azure.microsoft.com/support/plans/?b=16.44).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

> [!Note]
> Clusters running on a bronze reliability tier allow you to run test workloads only. If you experience issues with a cluster running on bronze reliability, the Microsoft support team will assist you in mitigating the issue, but will not perform a Root Cause Analysis. Please refer to [the reliability characteristics of the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-reliability-characteristics-of-the-cluster) for more details.
>
> For more information about what is required for a production ready cluster, please refer to the [production readiness checklist](https://docs.microsoft.com/azure/service-fabric/service-fabric-production-readiness-checklist).

<a id="getlivesitesupportonprem"></a>

## Report production issues or request paid support for standalone Service Fabric clusters

For reporting issues on your Service Fabric cluster deployed on-premises or on other clouds, open a ticket for professional support on [Microsoft support portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

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

## Service Fabric Preview Versions - unsupported for production use

From time to time, we release versions that have significant features we want feedback on, which are released as previews. These preview versions should only be used for test purposes. Your production cluster should always be running a supported, stable, Service Fabric version. A preview version always begins with a major and minor version number of 255. For example, if you see a Service Fabric version 255.255.5703.949, that release version is only to be used in test clusters and is in preview. These preview releases are also announced on the [Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric) and will have details on the features included.
There is no paid support option for these preview releases. Use one of the options listed under [Report Azure Service Fabric issues](https://docs.microsoft.com/azure/service-fabric/service-fabric-support#report-azure-service-fabric-issues) to ask questions or provide feedback.

## Next steps

[Supported Service Fabric versions](service-fabric-versions.md)

<!--references-->
[msdn-forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureServiceFabric
[stackoverflow]: https://stackoverflow.com/questions/tagged/azure-service-fabric
[uservoice-forum]: https://feedback.azure.com/forums/293901-service-fabric
[acom-docs]: https://aka.ms/servicefabricdocs
[sample-repos]: https://aka.ms/servicefabricsamples
