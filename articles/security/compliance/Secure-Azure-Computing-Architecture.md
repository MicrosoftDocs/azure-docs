---
# This basic template provides core metadata fields for Markdown articles on docs.microsoft.com.

# Mandatory fields.
title: Secure Azure Computing Architecture
description: This is a reference architecture for an enterprise-level DMZ architecture, utilizing Network Virtual Appliances and other tools. This architecture was designed to meet the Department of Defense's Secure Cloud Computing Architecture Functional Requirements. However, it can be leveraged for any organization. This reference includes two automated options using Citrix or F5 appliances.
author: Jason Henderson
ms.author: jahender # Microsoft employees only
ms.date: 4/9/2019
ms.topic: article-type-from-white-list
# Use ms.service for services or ms.prod for on-prem products. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# ms.prod: product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Secure Azure Computing Architecture

A rapidly increasing number of DoD customers deploying workloads to Azure have been asking for guidance setting up secure virtual networks and configuring the security tools and services stipulated by DoD standards and practice. DISA published the [Secure Cloud Computing Architecture (SCCA) Functional Requirements Document](https://iasecontent.disa.mil/stigs/pdf/SCCA_FRD_v2-9.pdf) in 2017. SCCA describes the functional objectives for securing the Defense Information System Network’s (DISN) and Commercial Cloud Provider connection points and how mission owners secure cloud applications at the connection boundary. It is mandated that every DoD entity that connects to the commercial cloud follows the guidelines set forth in the SCCA FRD.
 
There are four components of the SCCA. The Boundary Cloud Access Point (BCAP), Virtual Datacenter Security Stack (VDSS), Virtual Datacenter Services (VDMS), and Trusted Cloud Credential Manager (TCCM). Microsoft has developed a solution that will meet the SCCA requirements for both IL4 and IL5 workloads running in Azure. This Azure specific solution is called Secure Azure Computing Architecture (SACA). Customers who deploy SACA will be in compliance with the SCCA FRD and will enable DoD customers to move workloads into Azure once connected. 

While SCCA guidance and architectures are specific to DoD customers, the latest revisions to SACA will also help Civilian customers comply with trusted internet connection (TIC) guidance, as well as commercial customers that with to implement a secure DMZ to protect their azure environments. 


## Secure Cloud Computing Architecture Components

**BCAP**

The purpose of the BCAP is to protect the DISN from attacks originating in the cloud environment. BCAP will perform intrusion detection and prevention as well as filter out unauthorized traffic. This component can be co-located with other components of the SCCA. It is highly recommended that this component is deployed using physical hardware. Below you will find the list of BCAP security requirements.

***BCAP Security Requirements***

![BCAP requirements matrix](media/bcapreqs.jpg)


**VDSS**

The purpose of the VDSS is to protect DoD Mission Owner applications that are hosted in Azure. VDSS performs the bulk of the security operations in the SCCA. It will conduct traffic inspection in order to secure the applications running in Azure. This component can be provided within your Azure environment.

***VDSS Security Requirements***

![VDSS requirements matrix](media/vdssreqs.jpg)

**VDMS**

The purpose of VDMS is to provide host security as well as shared data center services. The functions of VDMS can either run in the hub of your SCCA or the mission owner can deploy pieces of it in their own specific Azure subscription. This component can be provided within your Azure environment.

***VDMS Security Requirements***

![VDMS requirements matrix](media/vdmsreqs.jpg)


**TCCM**

TCCM is a business role. This individual will be responsible for managing the SCCA. Their duties include establishing plans and policies for account access to the cloud environment, ensuring identity and access management is operating properly, and to maintain the Cloud Credential Management Plan. This individual is appointed by the Authorizing Official. The BCAP, VDSS, and VDMS will provide the capabilities needed for the TCCM to perform their job function.

***TCCM Security Requirements***

![TCCM requirements matrix](media/tccmreqs.jpg) 

## SACA Components and Planning Considerations 

The SACA reference architecture is designed to deploy the VDSS and VDMS components in azure, as well as enable the TCCM. This architecture is modular, which means that all of the pieces of VDSS and VDMS can live in a centralized hub or some of the controls can be met in the mission owner space or even on-premises. The recommendation of our Microsoft team is to co-locate the VDSS and VDMS components into a central Virtual Net that all Mission Owners can connect through. The diagram below depicts our recommended architecture. 


![SACA Reference Architecture Diagram](media/sacav2generic.jpg)

When planning your SCCA compliancy strategy and technical architecture, there are many things to consider. It is important that the following topics are taken into consideration from the beginning, as every customer will need to cover these. The topics below have been issues that have come up with real DoD customers and tend to slow the planning and execution down. 

- Which BCAP will your organization use?
    - DISA BCAP
        - DISA has two operational BCAPs at the Pentagon, and Camp Roberts CA, with a third coming online soon. 
        - DISA’s BCAPs all have ExpressRoute circuits to Azure, which can be leveraged by DoD customers for connectivity. 
        - DISA already has an enterprise-level Microsoft Peering session for DoD customers who want to subscribe to Microsoft SaaS tools, such as Office 365. By using DISA BCAP, you can enable connectivity and peering to your SACA instance. 
    - Build your own BCAP
        - This would require you to lease space in a co-located data center and setup an ExpressRoute circuit to Azure. 
        - This option will require additional approval 
        - Due to additional approval and a physical build out, this option takes the most time. 
    - Microsoft’s recommendation is to utilize the DISA BCAP. This option is readily available, has built in redundancy, and already has customers operating on it today in production.
- DoD routable IP space
    - You will be required to use DoD routable IP space at your edge. The option to NAT those to private IP space in Azure is available.  
    - Contact DoD NIC to obtain IP space, it will be needed as part of your SNAP submission with DISA. 
    - If you plan to NAT to private address space in Azure, you will need a minimum of a /24 subnet of address space assigned from the NIC for each region you plan to deploy SACA. 
- Redundancy 
    - Microsoft suggests that you deploy a SACA instance to at least two regions. In DoD cloud, this would mean you deploy it to both available DoD regions. 
    - It is also suggested that you connect to at least two BCAPs via separate ExpressRoute circuits. Both Express Routes can then be linked to each region’s SACA instance. 
- DoD component-specific requirements
    - Does your organization have any specific requirements outside the SCCA requirements? (Some organizations have specific IPS requirements)
- SACA is a modular architecture  
    - Use only which components you need for your environment. 
        - Deploy NVAs in a single tier or multi-tier
        - Integrated IPS, or bring your own IPS
- DoD impact level of your applications and data
    - If there is any possibility of applications running in our IL5 regions, it is suggested that you build your SACA instance in IL5. The instance can be used in front of IL4 applications as well as IL5. But, an IL4 SACA instance in front of an IL5 application will most likely not receive accreditation. 
- Which Network Virtual Appliance vendor will you use for VDSS?
    - As mentioned earlier, this SACA reference can be built using a variety of appliances and Azure services. However, we do have automated solution templates to deploy the SACA architecture with both F5 and Citrix. These solutions will be covered in more detail below. 
- Which Azure services will you use?
    - There are Azure services that can meet requirements around log analytics, host-based protection, and IDS functionality. However, it is possible that some services aren’t generally available in our IL5 regions. This may lead to the need to use some 3rd party tools if these Azure services can’t meet your requirement. You will need to look at what tools you are comfortable with and the feasibility of using Azure native tooling. 
    - It is Microsoft’s recommendation that you use as many Azure native tools as possible as they are all built with cloud security in mind and seamlessly integrate with the rest of the Azure platform. Below is a list of Azure native tools that can be leveraged to meet various requirements of SCCA. 
        - [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview )
        - [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) 
        - [Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) 
        - [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) 
        - [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis)
        - [Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)
        - [Azure Firewall](https://docs.microsoft.com/azure/firewall/overview) 
        - [Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-overview)
        - [Security Groups](https://docs.microsoft.com/azure/virtual-network/security-overview)
        - [Azure DDoS Protection](https://docs.microsoft.com/azure/virtual-network/ddos-protection-overview)
        - [Azure Sentinel](https://docs.microsoft.com/azure/sentinel/overview)
- Sizing
    - A sizing exercise will need to be completed. You will need to look at the number of concurrent connections you may have through the SACA instance as well as the network throughput requirements. 
    - This is a critical step as it will help to size the VMs, as well as help to identify the licenses that will be required from the various vendors you will be using in your SACA instance. 
    - A good cost analysis can’t be done without this sizing exercise, it is also important to ensure everything is sized correctly to allow for best performance. 


## Most Common Deployment Scenario

Microsoft has several customers who have already gone through the full deployment or at least planning stages of their SACA environments. This has allowed us to get insight into the most common deployment scenario. The diagram below depicts the most common architecture. 


![SACA Reference Architecture Diagram](media/sacav2commonScenario.jpg) 


As you can see from the diagram, DoD customers typically subscribe to two of the DISA BCAPs, one of these lives on the west coast and the other lives on the east coast. An ExpressRoute Private peer is enabled to Azure at each DISA BCAP location. These ExpressRoute Peers are then linked to the Virtual Network Gateway in the DoD East and DoD Central Azure Regions. A SACA instance is deployed in the DoD East and DoD Central Azure region and all ingress and egress traffic flows through it to and from the Express Route connection to the DISA BCAP. 

Mission Owner applications then choose which Azure region(s) they will deploy their applications in and use Virtual Network Peering to connect their application’s Virtual Network to the SACA Virtual Network. Force Tunneling all their traffic through the VDSS instance. 

This architecture is highly recommended by Microsoft, as it will meet SCCA requirements, it’s highly available, easily scalable, and it simplifies deployment and management.

## Automated SACA Deployment Options

 Earlier we mentioned that Microsoft has partnered with two vendors to create an automated SACA infrastructure template. Both templates will deploy the following Azure components. 

- SACA Virtual Network
    - Management Subnet
        - Where management VMs and services are deployed (jump boxes)
        - VDMS Subnet
            - Where VMs and services used for VDMS are deployed
        - Untrusted and Trusted Subnets 
            - Where virtual appliances are deployed
        - Gateway Subnet
            - Where the ExpressRoute Gateway will be deployed
- Management Jump Box Virtual Machines
    - Used for Out of Band Management of the environment.
- Network Virtual Appliances
    - Either Citrix or F5, depending on which template you deploy.
- Public IPs
    - Used for front end until ExpressRoute is brought online. These IPs will translate to the backend Azure private address space
- Route Tables 
    - Applied during automation, these route tables force-tunnel all traffic through the virtual appliance
- Azure Load Balancers - Standard SKU
    - These are used to load balance traffic across the appliances
- Network Security Groups
    - Used for controlling which types of traffic can traverse to certain endpoints


**Citrix SACA Deployment**

Citrix has created a deployment template that deploys two layers of highly available Citrix ADC appliances. This architecture meets the requirements of VDSS. 

![Citrix SACA Diagram](media/citrixsaca.jpg)


Citrix Documentation and deployment script can be found [here.](https://github.com/citrix/netscaler-azure-templates/tree/master/templates/saca)


 **F5 SACA Deployment**

F5 has created two separate deployment templates covering two different architectures. The first one has only one layer of F5 appliances in an active-active highly available configuration. This architecture meets the requirements for VDSS. The second adds a second layer of active-active highly available F5s. The purpose of this second layer is to allow for customers to add their own IPS separate from F5 in between the F5 layers. Not all DoD components have specific IPS prescribed for use. If that is the case, the single layer of F5 appliances will work for most since that architecture includes IPS on the F5 devices.  

![Citrix SACA Diagram](media/f5saca.jpg)

F5 Documentation and deployment script can be found [here.](https://github.com/f5devcentral/f5-azure-saca) 












