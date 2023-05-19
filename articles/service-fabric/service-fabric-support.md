---
title: Learn about Azure Service Fabric Support options 
description: Azure Service Fabric cluster versions supported and links to file support tickets
ms.topic: troubleshooting
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Azure Service Fabric support options

We have created a number of support request options to serve the needs of managing your Service Fabric clusters and application workloads, depending on the urgency of support needed and the severity of the issue.

## Self help troubleshooting
<div class='icon is-large'>
    <img alt='Self help content' src='./media/logos/doc-logo.png'>
</div>

This is the material that is referenced by Customer Support Services when a ticket is created, by Service Fabric Site Reliability Engineers responding to an incident, and by users when discovering resolutions to active system issues.

For a full list of self help troubleshooting content, see [Service Fabric troubleshooting guides](https://github.com/Azure/Service-Fabric-Troubleshooting-Guides)

## Create an Azure support request
<div class='icon is-large'>
    <img alt='Azure support' src='./media/logos/azure-logo.png'>
</div>

To report issues related to your Service Fabric cluster running on Azure, open a support ticket [on the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)
or [Microsoft support portal](https://support.microsoft.com/oas/default.aspx?prid=16146).

Learn more about:

- [Azure support options](https://azure.microsoft.com/support/plans/?b=16.44).
- [Microsoft premier support](https://support.microsoft.com/premier).

> [!Note]
> Clusters running on a bronze reliability tier or Single Node Cluster will allow you to run test workloads only. If you experience issues with a cluster running on bronze reliability or Single Node Cluster, the Microsoft support team will assist you in mitigating the issue, but will not perform a Root Cause Analysis. For more information, please refer to [the reliability characteristics of the cluster](./service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster).
>
> For more information about what is required for a production ready cluster, please refer to the [production readiness checklist](./service-fabric-production-readiness-checklist.md).

<a id="getlivesitesupportonprem"></a>

## Create a support request for standalone Service Fabric clusters
<div class='icon is-large'>
    <img alt='Azure support' src='./media/logos/azure-logo.png'>
</div>

To report issues related to Service Fabric clusters running on-premises or on other clouds, you may open a ticket for professional support on the [Microsoft support portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

Learn more about:

- [Microsoft premier support](https://support.microsoft.com/en-us/premier).

## Post a question to Microsoft Q&A
<div class='icon is-large'>
    <img alt='Microsoft Q&A' src='./media/logos/microsoft-logo.png'>
</div>   

Get answers to Service Fabric questions directly from Microsoft engineers, Azure Most Valuable Professionals (MVPs), and members of our expert community.

[Microsoft Q&A](/answers/topics/azure-service-fabric.html) is Azure's recommended source of community support.

If you can't find an answer to your problem by searching Microsoft Q&A, submit a new question. Be sure to post your question using the [**azure-service-fabric**](/answers/topics/azure-service-fabric.html) tag. Here are some Microsoft Q&A tips for writing [high-quality questions](/answers/articles/24951/how-to-write-a-quality-question.html).

## Open a GitHub issue
<div class='icon is-large'>
    <img alt='GitHub-image' src='./media/logos/github-logo.png'>
</div>

Report Azure Service Fabric issues at the [Service Fabric GitHub](https://github.com/microsoft/service-fabric/issues). This repo is intended for reporting and tracking issues as well as making small feature requests related to Azure Service Fabric. **Do not use this medium to report live-site issues**.

## Check the StackOverflow forum
<div class='icon is-large'>
    <img alt='Stack Overflow' src='./media/logos/stack-overflow-logo.png'>
</div>

The `azure-service-fabric` tag on [StackOverflow][stackoverflow] is used for asking general questions about how the platform works and how you may use it to accomplish certain tasks.

## Service Fabric community Q & A schedule 
Join the community call on the following days to hear about new feature releases and key updates and get answers to the questions from the Service Fabric team.

| Schedule	| 
|---------	|
| March 30, 2023 | 
| May 25, 2023 |
| July 27, 2023|
| September 28, 2023| 
| January 25, 2024	|
| March 28, 2024 |

## Stay informed of updates and new releases

<div class='icon is-large'>
    <img alt='Stay informed' src='./media/logos/updates-logo.png'>
</div>

Learn about important product updates, roadmap, and announcements in [Azure Updates](https://azure.microsoft.com/updates/?product=service-fabric).

For the latest releases and updates to the Service Fabric runtime and SDKs, see [Service Fabric releases](release-notes.md)



## Next steps

[Supported Service Fabric versions](service-fabric-versions.md)

<!--references-->
[Microsoft Q&A question page]: /answers/topics/azure-service-fabric.html
[stackoverflow]: https://stackoverflow.com/questions/tagged/azure-service-fabric
[uservoice-forum]: https://feedback.azure.com/d365community/forum/e622b37a-2225-ec11-b6e6-000d3a4f0f84
[acom-docs]: ./index.yml
[sample-repos]: /samples/browse/?products=azure
