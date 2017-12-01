---
title: Manage performance and connectivity on Azure China 21Vianet | Microsoft Docs
description: When deploying and operating an application or workload on Microsoft Azure China 21Vianet, we recommend performance and network testing. If your Azure application provides services to users outside of China, there are other considerations as well.
services: china
cloud: na
documentationcenter: na
author: v-wimarc
manager: edprice

ms.assetid: na
ms.service: china
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/29/2017
ms.author: v-wimarc

---
# Manage performance and connectivity
When deploying and operating an application or workload on Microsoft Azure operated by 21Vianet (Azure China 21Vianet), we recommend performance and network testing. 
In addition, if your Azure application provides services to users outside of China, consider the following:
- For users in China, host workloads on Microsoft Azure China 21Vianet.
- For users outside of China, deploy workloads to the closest Azure region.

## Performance considerations
To fine-tune and optimize your Azure application, conduct performance tests and consider the following recommendations: 
- Conduct your performance testing in China Standard Time, instead of your own time zone. 
- Conduct testing in mainland China to better reflect the response times and the real user experience.
- Test during the Internet rush hours to measure the performance of your application under high workloads. 

## Network latency in China
The network latency between China and the rest of the world is inevitable given the intermediary technologies that regulate cross-border Internet traffic. Website users and administrators may experience slow performance. These tips may help: 
- For websites with streaming media and other rich media content, the [Azure Content Delivery Network](/azure/china/china-get-started-service-cdn) (CDN) may be able to help improve responsiveness. Under Chinese law, using the CDN service in China may also subject an offshore website to [ICP filing](/azure/china/china-overview-policies). Do not use a global CDN service that does not have a point of presence (PoP) inside mainland China.
- For the best user experience, host a website in China to serve users in China.
- For website administrators outside of China, use Secure Shell (SSH) to connect to your remote server for a faster network connection to Microsoft Azure China 21Vianet. For example, use SSH to access a local Azure virtual machine, and from there, use SSH to connect to an Azure China 21Vianet virtual machine. 

## Global connectivity and interoperability
A hybrid cloud can extend your applications or workloads on Microsoft Azure China 21Vianet and provide global connectivity and interoperability. The following connections are supported:
- Use a virtual private network (VPN) or Azure ExpressRoute to create a direct network connection between Azure and your on-premises private cloud or backend systems within China.
- Set up a site-to-site VPN to connect an Azure site in China to your on-premises location outside of China. ExpressRoute is not supported for direct network connectivity to an external (outside of China) site. Even global Azure is considered external.

> [!NOTE]
> Approval by the Ministry of Industry and Information Technology (MIIT) of the Chinese government is needed to set up a VPN or ExpressRoute connection between your services hosted on Azure, your ICP-registered hosting location, and an outside location. You must register, report, and obtain for approval from the MIIT. Contact [21Vianet](mailto:icpsupport@oe.21vianet.com) for help in the approval process.

For a VPN setup, apply for an exception through 21Vianet and provide the following information:
- Overseas IP address for the overseas VPN endpoint
- VPN protocol and ports
- Location of overseas IP
- Owner of overseas IP
- Relationship between the overseas IP owner and the Azure customer

For more details, please contact [21Vianet](mailto:icpsupport@oe.21vianet.com).

## Next steps
- [Azure Content Delivery Network](/azure/china/china-get-started-service-cdn)
- [ICP filing](/azure/china/china-overview-policies)


