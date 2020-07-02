---
title: Azure Government DoD Overview | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 05/18/2017

---
# Department of Defense (DoD) in Azure Government
## Overview
Azure Government is used by Department of Defense (DoD) entities to deploy a broad range of workloads and solutions, including those workloads covered by<a href="https://dl.dod.cyber.mil/wp-content/uploads/cloud/pdf/Cloud_Computing_SRG_v1r3_Revision_History.pdf"> The DoD Cloud Computing Security Requirements Guide, Version 1, Release 3</a> at Impact Level 4 (L4), and Impact Level 5 (L5).

Azure Government is the first and only hyperscale commercial cloud service to be awarded an Information Impact Level 5 DoD Provisional Authorization by the Defense Information Systems Agency. In addition, Azure Government regions dedicated to US Department of Defense customer workloads are now generally available.

One of the key drivers for the DoD in moving to the cloud is to enable organizations to focus on their missions and minimize the distractions of building and managing in-house IT solutions.

Azure Government-based cloud architectures allow DoD personnel to focus on mission objectives, and managing IT commodity services such as SharePoint and other application workloads.  This allows for the realignment of critical IT resources to focus on application development, analytics, and cyber security.

The elasticity and flexibility delivered by Azure provides enormous benefits to DoD customers. It is simpler, quicker, and more cost-effective to scale-up a workload in the cloud than it is to go through traditional hardware and services procurement processes when working on-premises, or in DoD data centers. For example, to procure new multi-server hardware, even for a test environment, may take many months, and require the approval of significant capital expenditure. By contrast, using Azure, a test migration for an existing workload can be configured in weeks or even days, and in a cost-effective manner (when the test is over, the environment can be torn down with no ongoing costs).

This flexibility is significant. By moving to Azure, DoD customers do not just save money; the cloud delivers new opportunities. For example, it is easy to spin up a test environment to gain insights into new technologies, you can migrate an application and test it in Azure before committing to a production deployment in the cloud. Mission owners can explore more cost effective options easier, and without risk.

Security is another key area, and although any cloud deployment requires proper planning to ensure secure and reliable service delivery, in reality most properly configured cloud-based workloads (up to and including L4 workloads) in Azure Government will be more secure than many traditional deployments in DoD locations and data centers. This is because defense agencies have the experience and expertise to physically secure all assets; however, the IT surface areas present different challenges. Cyber security is a rapidly changing space, requiring specialist skills and the ability to rapidly develop and deploy counter-measures as required. The Azure platform, both commercial and Government, now supports hundreds of thousands of customers, and this scale enables Microsoft to quickly detect evolving attack vectors, and then direct its resources onto rapid development and implementation of the appropriate defenses.

## DoD Region Q&A

### What are the Azure Government DoD Regions? 
The US DoD East and US DoD Central regions are physically separated regions of Microsoft Azure architected to meet US Department of Defense (DoD) security requirements for cloud computing, specifically for data designated as DoD Impact Level 5 per the DoD Cloud Computing Security Requirements Guide (SRG).   

### What is the difference between Azure Government and the Azure Government DoD Regions? 
Azure Government is a US government community cloud providing services for Federal, State and Local government customers, tribal, entities subject to ITAR, and solution providers performing work on their behalf. All Azure Government regions are architected and operated to meet the security requirements for DoD Impact Level 5 data and FedRAMP High standards.

The Azure Government DoD regions are architected to support the physical separation requirements for Impact Level 5 data by providing dedicated compute and storage infrastructure for the use of DoD customers only.  

#### What is the difference between Impact Level 4 and Impact Level 5 data?  
Impact Level 4 data is controlled unclassified information (CUI) that may include data subject to export control, privacy information protected health information and other data requiring explicit CUI designation (e.g. For Official Use Only, Law Enforcement Sensitive, Sensitive Security Information).

Impact Level 5 data includes controlled, unclassified information (CUI) that requires a higher level of protection as deemed necessary by the information owner, public law or government regulation.  Impact Level 5 data is inclusive of unclassified National Security Systems.  More information on the SRG impact levels, their distinguishing requirements and characteristics is available in section 3 of the DoD Cloud Computing Security Requirements Guide.  

### What Data is categorized as Impact Level 5? 
Level 5 accommodates controlled unclassified information (CUI) that requires a higher level of protection than that afforded by Level 4 as deemed necessary by the information owner, public law, or other government regulations. Level 5 also supports unclassified National Security Systems (NSSs).  This level accommodates NSS and CUI information categorizations based on CNSSI-1253 up to moderate confidentiality and moderate integrity (M-M-x).

### What is Microsoft doing differently to support Impact Level 5 data? 
Impact Level 5 data by definition can only be processed in a dedicated infrastructure that ensures physical separation of DoD customers from non-Federal government tenants.  In delivering the US DoD East and US DoD Central regions, Microsoft is providing an exclusive service for DoD customers that meets an even higher bar than DoD’s stated requirements and exceeds the level of protection and capability offered by any other hyperscale commercial cloud solution.

### Do these regions support classified data requirements? 
These Azure Government DoD regions support only unclassified data up to and including Impact Level 5.  Impact Level 6 data is defined as classified information up to Secret.

### What organizations in the DoD can use the Azure Government DoD Regions? 
The US DoD East and US DoD Central regions are built to support the US Department of Defense customer base.  This includes:
* The Office of the Secretary of Defense
* The Joint Chiefs of Staff
* The Joint Staff
* The Defense Agencies
* Department of Defense Field Activities
* The Department of the Army
* The Department of the Navy (including the United States Marine Corps)
* The Department of the Air Force
* The United States Coast Guard
* The unified combatant commands
* Other offices, agencies, activities, and commands under the control or supervision of any approved entity named above

### Are the DoD regions more secure? 
Microsoft operates all of its Azure datacenters and supporting infrastructure to comply with local and international standards for security and compliance – leading all commercial cloud platforms in compliance investment and achievements.  These new DoD regions will provide specific assurances and commitments to meet the requirements defined in the DoD SRG for Cloud Computing.

### Why are there multiple DoD regions? 
By having multiple DoD regions, Microsoft provides customers with the opportunity to architect their solutions for disaster recovery scenarios across regions to ensure business continuity and satisfy requirements for system accreditation.  In addition, customers may optimize performance by deploying solutions in the geography within closest proximity to their physical location.

### Are these DoD regions connected to the NIPRNet? 
The DoD mandates that commercial cloud services used for CUI must be connected to customers through a Cloud Access Point (CAP).  Therefore, the Azure DoD regions are connected to the NIPRNet through redundant connections to multiple geographically distributed CAPs.  A DoD CAP is a system of network boundary protection and monitoring devices that offer protection to DoD information system network and services.

### What Does General Availability Mean? 
General Availability means that the DoD regions in Azure Government may be used to support production workloads and that financially backed SLAs for all services deployed in the regions and also generally available will be supported.

### How does a DoD customer acquire Azure Government DoD services? 
Azure Government DoD services may be purchased by qualified entities through the same reseller channels as Azure Government.  In keeping with Microsoft’s commitment to make cloud services acquisition planning and cost estimation simple, pricing for Azure Government DoD regions will be included in the Azure Pricing calculator at the time of general availability.  Azure Government DoD services can quickly scale up or down to match demand, so you only pay for what you use.
No contractual modifications will be required for Enterprise Agreement customers already using Azure Government.  

### How are the DoD regions priced? 
The DoD regions utilize region based pricing.  This means that service costs for validated DoD customers will be based on the Azure Government region in which you run your workloads.  For more specific pricing information, please consultant your Microsoft Account Executive.  Pricing for the DoD regions will be provided through the Azure.com calculator at a future date.

### How does a DoD organization get validated for the Azure Government DoD regions? 
In order to gain access to the Azure DoD regions, customers must complete a pre-qualification process for verifying their organization and intended use of the Azure DoD environment.  After successful completion of the pre-qualification process, Microsoft will provide the organizational applicant with further instructions for creating a subscription, accessing the environment and providing role-based access control to other members of the organization.

### Can independent software vendors and solution providers building on Azure deploy solutions in the Azure Government DoD regions? 
Solution providers with cloud service offerings built on Azure may operate DoD-only single tenant and multi-tenant solutions in the Azure Government DoD regions.  These providers must first demonstrate eligibility by providing documented evidence of a contract with an approved DoD entity or have a sponsor letter from an approved DoD entity.  Providers offering services in the Azure Government DoD regions must include computer network defense, incident reporting and screened personnel for operating solutions handling Impact Level 5 information in their offering.  Additional guidance for solution providers may be found in the DoD Cloud Computing Security Requirements Guide.

### Will Office 365 or Microsoft Dynamics 365 be a part of this offering? 
Microsoft is providing Office 365 services for the DoD at Impact Level 5 in conjunction with this offering.  Dynamics 365 is planning to offer Impact Level 5 services from the Azure DoD regions at a future date.

### How do I connect to the DoD Regions once I have a subscription? 
The DoD regions for Azure Government are available through the Azure Government management portal.  DoD customers approved for use will see the regions listed as available options when deploying available services.  For general guidance on managing your Azure Government subscriptions please consult our documentation.

### What services are part of your Impact Level 5 accreditation scope? 
Azure is an evergreen service where new services and capabilities are being added every week, the number of services in scope is regularly expanding.  For the most up-to-date information, please visit our<a href="https://www.microsoft.com/en-us/TrustCenter/Compliance/DISA"> Microsoft Trust Center.

## <a name="Next-steps"></a>Next steps:

<a href="https://www.microsoft.com/en-us/TrustCenter/Compliance/DISA"> Microsoft Trust Center - DoD web page </a>

<a href="https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html"> The DoD Cloud Computing Security Requirements Guide, Version 1, Release 2 </a>

<a href="https://azure.microsoft.com/offers/azure-government/"> Azure Government Reseller Channels

<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

