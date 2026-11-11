---
title: Azure in China checklist
description: This list shows what you need to consider before moving your workloads to Azure in China. 
ms.topic: checklist
ms.date: 07/20/2020
---

# Azure in China checklist

Here's a list designed for Azure customers or partners to look into the aspects you need to check before moving workloads to Azure in China. If you already purchased the Azure global service, please be aware that there are some differences between Azure global and Azure in China. The following table shows some key highlights.

[!INCLUDE [gdpr-intro-sentence.md](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

<table>
　<tr>
　  <th width="25%" bgcolor="#D9D9D9">Category</th>
　  <th width="20%" bgcolor="#D9D9D9">Item</th>
    <th width="20%" bgcolor="#D9D9D9">Azure global</th>
    <th width="25%" bgcolor="#D9D9D9">Azure in China</th>
    <th width="10%" bgcolor="#D9D9D9">Notes</th>
　</tr>
　<tr>
　  <td rowspan="5">Compliance & Regulations</td>
　  <td>Commercial customer eligibility</td>
    <td>Any organization</td>
    <td>Legal entity in China</td>
    <td><a href="/azure/china/concepts-purchase#online-service-premium-agreement-ospa">Online Service Premium Agreement (OSPA)</a></td>
　</tr>
  <tr>
    <td>Legal compliance</td>
    <td>In compliance with local laws</td>
    <td>In compliance with the PRC laws, customers need to follow:<br>
    <a href="/azure/china/overview-sovereignty-and-regulations#real-name-verification">Real name verification</a> for online service users<br>
    <a href="/azure/china/overview-sovereignty-and-regulations#icp-licensing-and-filing">ICP filing</a> for public non-commercial website<br>
    <a href="/azure/china/overview-sovereignty-and-regulations#icp-licensing-and-filing">ICP license</a> for commercial website<br>
    <a href="/azure/china/overview-sovereignty-and-regulations#public-security-registration">Public security registration</a> for public website<br>
    <a href="/azure/china/overview-sovereignty-and-regulations#vpn-and-dedicated-lines">VPN & dedicated line usage in China</a></td>
    <td></td>
  </tr>
  <tr>
    <td>Data sovereignty</td>
    <td>In compliance with local laws</td>
    <td><a href="/azure/china/overview-sovereignty-and-regulations#china-cybersecurity-law">China Cybersecurity Law</a> states that PII and important data of CII operator must be stored domestically.</td>
    <td></td>
  </tr>
  <tr>
    <td>Operator</td>
    <td>Microsoft</td>
    <td><a href="/azure/china/overview-operations#azure-operations-in-china">21Vianet</a></td>
    <td></td>
  </tr>
  <tr>
    <td>Data Subject Requests</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 1."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 2."></td>
    <td><a href="/azure/china/overview-datacenter#azure-data-subject-requests-for-the-gdpr">Data Subject Requests</a></td>
  </tr>
  
  <tr>
    <td rowspan="7">Datacenter</td>
    <td>High availability</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 3."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 4."></td>
    <td><a href="https://docs.azure.cn/zh-cn/advisor/advisor-high-availability-recommendations">Availability Recommendations</a> (in Chinese)</td>
  </tr>
  <tr>
    <td>Remote management</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 5."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 6."></td>
    <td><a href="/azure/china/concepts-management">Remote Management</a></td>
  </tr>
  <tr>
    <td>Networking</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 7."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 8."></td>
    <td><a href="/azure/china/resources-faq#can-i-connect-between-azure-global-regions-and-azure-china-regions">Data Connection</a></td>
  </tr>
  <tr>
    <td>Compliance/Certifications</td>
    <td><a href="https://www.microsoft.com/trustcenter/compliance/complianceofferings">Compliance offerings globally</a></td>
    <td><a href="/azure/china/overview-datacenter#certifications-dedicated-for-china">Certifications acquired for China</a></td>
    <td></td>
  </tr>
  <tr>
    <td>Azure IP Advantage</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 9."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 10."></td>
    <td><a href="/azure/china/overview-datacenter#azure-ip-advantage">Azure IP Advantage</a></td>
  </tr>
  <tr>
    <td>Developer guidance</td>
    <td></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 11."></td>
    <td><a href="/azure/china/resources-developer-guide">Developer Guidance</a></td>
  </tr>
  <tr>
    <td>Network latency</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 12."><br>~3 times latency crossing-border for China</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 13."></td>
    <td><a href="/azure/china/overview-connectivity-and-interoperability#network-latency-in-china">China latency</a></td>
  </tr>
  <tr>
    <td rowspan="4">Multi-National Adoption</td>
    <td>Cross-border connection</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 14."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 15."></td>
    <td><a href="/azure/china/overview-connectivity-and-interoperability#cross-border-connectivity">Cross-border Connection</a></td>
  </tr>
  <tr>
    <td>Cross-tenant Azure Active Directory </td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 16."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 17."> <a href="/azure/china/overview-connectivity-and-interoperability#azure-active-directory-federation"><br>Through Federation</a></td>
    <td></td>
  </tr>
  <tr>
    <td>Cross-border IaaS services</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 18."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 19."></td>
    <td><a href="/azure/china/overview-connectivity-and-interoperability#cross-border-iaas-interoperability">Cross-border IaaS Interoperability</a></td>
  </tr>
    <tr>
    <td>Cross-border PaaS services</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 20."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 21."></td>
    <td><a href="/azure/china/overview-connectivity-and-interoperability#cross-border-paas-interoperability">Cross-border PaaS Interoperability</a></td>
  </tr>
  <tr>
    <td rowspan="9">Services</td>
    <td>Available services</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 22."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 23."></td>
    <td><a href="/azure/china/concepts-service-availability#service-availability-and-roadmaps">Service Availability and Roadmaps</a></td>
  </tr>
  <tr>
    <td>VM reserved instances</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 24."></td>
    <td><img src="media/overview-quickcheck/available-soon.png" alt="available soon"><br><a href="/azure/china/concepts-purchase#reserved-instances--compute-pre-purchase-cpp">Compute Pre-purchase (CPP)</a> is available</td>
    <td></td>
  </tr>
  <tr>
    <td>CDN</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 25."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 26."></td>
    <td><a href="/azure/china/concepts-service-availability#cdn-in-china">CDN in China</a></td>
  </tr>
  <tr>
    <td>ExpressRoute connectivity</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 27."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 28."></td>
    <td></td>
  </tr>
  <tr>
    <td>ExpressRoute cross-region access</td>
    <td>Included in ExpressRoute Premium</td>
    <td><a href="/azure/china/concepts-service-availability#free-circuit-for-expressroute-in-china">Free Circuit for ExpressRoute in China</a> in pairing regions (CN-CN2; CE-CE2)<sup>Exclusive</sup></td>
    <td></td>
  </tr>
  <tr>
    <td>Identity</td>
    <td>Social ID</td>
    <td>Org ID</td>
    <td><a href="/azure/china/concepts-management#work-with-administrator-roles">Work with administrator roles</a></td>
  </tr>
  <tr>
    <td>Azure Stack</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 29."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 30."></td>
    <td><a href="/azure/china/concepts-service-availability#azure-stack">Azure Stack</a></td>
  </tr>
  <tr>
    <td>Azure hybrid benefits (AHB)</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 31."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 32."></td>
    <td><a href="/azure/china/concepts-service-availability#azure-hybrid-benefit-ahb">AHB</a></td>
  </tr>
  <tr>
    <td>Service health dashboard (SHD)</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 33."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 34."></td>
    <td><a href="https://www.azure.cn/support/service-dashboard/">Azure status</a></td>
  </tr>
  <tr>
    <td rowspan="3">Customer Support</td>
    <td>Broad commercial support</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 35."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 36."></td>
    <td><a href="/azure/china/concepts-support">Break-fix support</a></td>
  </tr>
  <tr>
    <td>Premier support</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 49."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 37."></td>
    <td><a href="/azure/china/concepts-support#premier-support">Premier support</a></td>
  </tr>
  <tr>
    <td>Service Level Agreements (SLA)</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 38."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 39."></td>
    <td><a href="https://www.azure.cn/support/legal/sla/">SLA</a></td>
  </tr>
  <tr>
    <td rowspan="4">Contracting</td>
    <td>Online Service Term (OST)</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 40."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 41."></td>
    <td><a href="/azure/china/concepts-purchase#online-service-terms-ost">OST: Global OST vs China</a></td>
  </tr>
  <tr>
    <td>Enterprise agreements (EA)</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 42."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 43."><br><a href="/azure/china/concepts-purchase#online-service-premium-agreement-ospa">Sign Online Service Premium Agreement (OSPA) in China</a></td>
    <td></td>
  </tr>
  <tr>
    <td>EA multi-year monetary credit</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 44."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 45."><br>Case-by-case approval by Business Desk</td>
    <td><a href="/azure/china/concepts-purchase#multi-year-monetary-commitment-mymc">Multi-Year Monetary Commitment (MYMC)</a></td>
  </tr>
    <tr>
    <td>New Commerce Model: 21VCA-E</td>
    <td></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 46."></td>
    <td><a href="/azure/china/concepts-purchase#new-commerce-model-21vca-e">21VCA-E</a></td>
  </tr>
  <tr>
    <td rowspan="2">Resources</td>
    <td>Marketing site & management portal</td>
    <td><a href="https://azure.microsoft.com/">Azure global</a><br>
    <a href="https://portal.azure.com/?l=en.en-us">Azure portal</a></td>
    <td><a href="https://www.azure.cn/">Azure in China</a><br>
    <a href="https://portal.azure.cn/?l=en.en-us">Azure portal</a></td>
    <td></td>
  </tr>
  <tr>
    <td>Marketplace</td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 47."></td>
    <td><img src="media/overview-quickcheck/available.png" alt="Icon that indicates that the item is available 48."></td>
    <td><a href="/azure/china/overview-operations#azure-china-marketplace">Azure in China Marketplace</a></td>
  </tr>
</table>

> [!NOTE]
> ![Icon that indicates that the item is available 48.](media/overview-quickcheck/available.png): available <br>
> ![Icon that indicates the item is available soon.](media/overview-quickcheck/available-soon.png): available soon or available with workarounds.


