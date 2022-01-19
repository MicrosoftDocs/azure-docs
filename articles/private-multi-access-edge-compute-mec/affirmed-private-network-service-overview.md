---
title: 'What is Affirmed Private Network Service on Azure?'
description: Learn about Affirmed Private Network Service solutions on Azure for private LTE/5G networks.

author: KumudD
ms.service: private-multi-access-edge-compute-mec
ms.topic: overview
ms.date: 06/16/2021
ms.author: hollycl

---
# What is Affirmed Private Network Service on Azure?

The Affirmed Private Network Service (APNS) is a managed network service offering created for managed service providers and mobile network operators to provide private LTE and private 5G solutions to enterprises.

Affirmed has combined its mobile core-technology with Azure’s capabilities to create a complete turnkey solution for private LTE/5G networks to help carriers and enterprises take advantage of managed networks and the mobile edge. The combination of cloud management and automation allows managed service providers to deliver a fully managed infrastructure and also brings a complete end-to-end solution for operators to pick the best of breed Radio Access Network, SIM, and Azure services from a rich ecosystem of partners offered in Azure Marketplace. The solution is composed of five components:

- **Cloud-native Mobile Core**: This component is 3GPP standards compliant and supports network functions for both 4G and 5G and has virtual network probes located natively within the mobile core. The mobile core can be deployed on VMs, physical servers, or on an operator's cloud, eliminating the need for dedicated hardware.

- **Private Network Service Manager - Affirmed Networks**: Private Network Service Manager is the application that operators use to deploy, monitor, and manage private mobile core networks on the Azure platform. It features a complete set of management capabilities including simple self-activation and management of private network resources through a programmatic GUI-driven portal.

- **Azure Network Functions Manager**: Azure Network Functions Manager (NFM) is a fully managed cloud-native orchestration service that enables customers to deploy and provision network functions on Azure Stack Edge Pro with GPU for a consistent hybrid experience using the Azure portal.

- **Azure Cloud**: A public cloud computing platform with solutions including Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS) that can be used for services such as analytics, virtual computing, storage, networking, and much more.

- **Azure Stack Edge**: A cloud-managed, hardware-as-a-service solution shipped by Microsoft. It brings the Azure cloud’s power to a local and robust server that can be deployed virtually anywhere local AI and advanced computing tasks need to be performed.


:::image type="content" source="./media/affirmed-overview/affirmed-private-network-service-solution.png" alt-text="Affirmed private network service solution":::

## Why use the Affirmed Private Network Solution?
APNS provides the following key benefits to operators and their customers:

- **Deployment Flexibility** - APNS employs Control and User Plane Separation technology and supports three types of deployment modes to address a variety of operator desired scenarios for offering to enterprises. By using the Private Network Service Manager, operators can configure the following deployment models:

    - Standalone enables operators to provide a complete standalone private network on premises by delivering the RAN, 5G core on the Azure Stack Edge and the management layer on the centralized cloud.

    - Distributed enables faster processing of data by distributing the user plane closer to the edge of the enterprise on the Azure Stack Edge while the control plane is on the cloud; an example of such a model would be manufacturing facilities.

    - All in Cloud allows for the entire 5G core to be deployed on the cloud while the RAN is on the edge, enabling dynamic allocation of cloud resources to suit the changing demands of the workloads.

- **MNO Integration** - APNS is mobile network operator integrated, which means it provides complete mobility across private and public operator networks with its distributed subscriber core. Operators have the advantage to scale the private mobile network to 1000s of enterprise edge sites.

    - Supports all Spectrum options - MNO Licensed, Private Licensed, CBRS, Shared, Unlicensed.

    - Supports isolated/standalone private networks, multi-site roaming, and macro roaming as it is MNO Integrated.

    - Can provide 99.999% service availability and inter-work with any 3GPP compliant LTE and 5G NR radio. Has Carrier-Grade resiliency for enterprises.

- **Automation and Ease of Management** - The APNS solution can be completely managed remotely through Service Manager on the Azure cloud. Through the Service Manager, end-users have access to their personalized dashboard and can manage, view, and turn on/off devices on the private mobile network. Operators can monitor the status of the networks for network issues and key parameters to ensure optimal performance.

    - Provides secure, reliable, high bandwidth, low latency private mobile networking service that runs on Azure private multi-access edge compute.

    - Supports complete remote management, without needing truck rolls.

    - Provides cloud automation to enable operators to offer managed services to enterprises or to partner with MSPs who in turn can offer managed services.

- **Smarter Network & Business Insights** - Affirmed mobile core has an embedded virtual probe/ packet brokering function that can be used to provide network insight. The operator can use these insights to better drive network decisions while their customers can use these insights to drive smarter monetization decisions.

- **Data Privacy & Security** - APNS uses Azure to deliver security and compliance across private networks and enterprise applications. Operators can confidently deploy the solution for industry use cases that require stringent data privacy laws, such as healthcare, government, public safety, and defense.

## Next steps
- Learn how to [deploy the Affirmed private Network Service solution](deploy-affirmed-private-network-service-solution.md)



