---
title: Learn about Azure Service Fabric Support options 
description: Azure Service Fabric cluster versions supported and links to file support tickets
author: pkcsf

ms.topic: troubleshooting
ms.date: 8/24/2018
ms.author: pkc
---
# Azure Service Fabric support options

We have created a number of support request options to serve the needs of managing your Service Fabric clusters and application workloads. Depending on the urgency of support needed and the severity of the issue, you may choose the option that is right for you.

## Report production issues or request paid support for Azure

To report issues related to your Service Fabric cluster running on Azure, open a support ticket [on the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)
or [Microsoft support portal](https://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:
 
- [Support from Microsoft for Azure](https://azure.microsoft.com/support/plans/?b=16.44).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

> [!Note]
> Clusters running on a bronze reliability tier or Single Node Cluster will allow you to run test workloads only. If you experience issues with a cluster running on bronze reliability or Single Node Cluster, the Microsoft support team will assist you in mitigating the issue, but will not perform a Root Cause Analysis. For more information, please refer to [the reliability characteristics of the cluster](./service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster).
>
> For more information about what is required for a production ready cluster, please refer to the [production readiness checklist](./service-fabric-production-readiness-checklist.md).

<a id="getlivesitesupportonprem"></a>

## Report production issues or request paid support for standalone Service Fabric clusters

To report issues related to Service Fabric clusters running on-premises or on other clouds you may open a ticket for professional support on the [Microsoft support portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

Learn more about:

- [Professional Support from Microsoft for on-premises](https://support.microsoft.com/en-us/gp/offerprophone?wa=wsignin1.0).
- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

## Report Azure Service Fabric issues

We have set up a GitHub repo for reporting Service Fabric issues.  We are also actively monitoring the following forums.

### GitHub repo 

Report Azure Service Fabric issues at the [Service Fabric GitHub](https://github.com/microsoft/service-fabric/issues). This repo is intended for reporting and tracking issues as well as making small feature requests related to Azure Service Fabric. **Do not use this medium to report live-site issues**.

### StackOverflow and MSDN forums

The [Service Fabric tag on StackOverflow][stackoverflow] and the [Service Fabric forum on MSDN][msdn-forum] are best used for asking general questions about how the platform works and how you may use it to accomplish certain tasks.

### Azure Feedback forum

The [Azure Feedback Forum for Service Fabric][uservoice-forum] is the best place for submitting significant product feature ideas. We review the most popular requests and this plays a part for our medium to long-term planning. We encourage you to rally support for your suggestions within the community.

## Service Fabric Preview Versions - unsupported for production use

Occasionally we make special preview releases containing significant feature changes for which we would like to survey early feedback. These preview versions should only be used in isolated test environments that do not serve production workloads. Your production cluster should always be running a supported, stable, Service Fabric version. We don't offer a paid support option for these preview releases.

A preview version always begins with a major and minor version number of 255. For example, if you see a Service Fabric version 255.255.5703.949, this version is in preview and is only intended to be used in test clusters. These preview releases are also announced on the [Service Fabric team blog](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) and will have details on the features included. Use one of the options listed under [Report Azure Service Fabric issues](#report-azure-service-fabric-issues) to ask questions or provide feedback.

## Next steps

[Supported Service Fabric versions](service-fabric-versions.md)

<!--references-->
[Microsoft Q&A question page]: /answers/topics/azure-service-fabric.html
[stackoverflow]: https://stackoverflow.com/questions/tagged/azure-service-fabric
[uservoice-forum]: https://feedback.azure.com/forums/293901-service-fabric
[acom-docs]: https://aka.ms/servicefabricdocs
[sample-repos]: https://aka.ms/servicefabricsamples
[msdn-forum]: https://social.msdn.microsoft.com/forums/azure/en-US/home?category=windowsazureplatform
