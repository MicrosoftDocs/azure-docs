---
title: Azure facilities, premises, and physical security | Microsoft Docs
description: The article describes the Azure datacenters, including physical infrastructure, security, and compliance offerings.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/27/2018
ms.author: terrylan

---

# Azure facilities, premises, and physical security
Microsoft's cloud is comprised of a [globally distributed datacenter infrastructure](https://azure.microsoft.com/global-infrastructure/) supporting thousands of online services and spanning more than 100 highly secure facilities worldwide.

The infrastructure is designed to bring applications closer to users around the world, preserving data residency, and offering comprehensive compliance and resiliency options for customers. Azure has 52 regions worldwide, and is available in 140 countries.

A region is a set of datacenters that are interconnected via a massive and resilient network. The network includes content distribution, load balancing, redundancy, and encryption by default. With more global regions than any other cloud provider, Azure gives customers the flexibility to deploy applications where they need to.

Azure regions are organized into geographies. An Azure geography ensures that data residency, sovereignty, compliance, and resiliency requirements are honored within geographical boundaries.

Geographies allow customers with specific data-residency and compliance needs to keep their data and applications close. Geographies are fault-tolerant to withstand complete region failure through their connection to our dedicated high-capacity networking infrastructure.

Availability Zones are physically separate locations within an Azure region. Each Availability Zone is made up of one or more datacenters equipped with independent power, cooling, and networking. Availability Zones allow customers to run mission-critical applications with high availability and low-latency replication.

The following figure shows how the Azure global infrastructure pairs region and Availability Zones within the same data residency boundary for high availability, disaster recovery, and backup.

![Data residency boundary][1]

A large geographical distributed footprint of datacenters enables us to be close to customers in order to reduce network latency and allow for geo-redundant backup and failover.

## Physical security
Microsoft designs, builds, and operates datacenters in a way that strictly controls physical access to the areas where customer data is stored. We understand the importance of protecting customer data and are committed to helping secure the datacenters that contain your data. We have an entire division at Microsoft devoted to designing, building, and operating the physical facilities supporting Azure. This team is invested in maintaining state-of-the-art physical security.

We take a layered approach to physical security to reduce the risk of unauthorized users gaining physical access to data and the datacenter resources. Datacenters managed by Microsoft have extensive layers of protection: access approval at the facility’s perimeter, at the building’s perimeter, inside the building, and on the datacenter floor. Layers of physical security are:

- Access request and approval – You must request access prior to arriving at the datacenter. You're required to provide a valid business justification for your visit, such as compliance or auditing purposes. All requests are approved on a need-to-access basis by Microsoft employees. A need-to-access basis helps keep the number of individuals needed to complete a task in our datacenters to the bare minimum. Once permission is granted, an individual only has access to the discrete area of the datacenter based on the approved business justification. Permissions are limited to a certain period of time and expire after the allowed time period.

- Facility’s perimeter - When you arrive at a datacenter, you're required to go through a well-defined access point. Typically, tall fences made of steel and concrete encompass every inch of the perimeter. There are cameras around the datacenters, with a security team monitoring their videos 24/7 and 365 days of the year.

- Building entrance - The datacenter entrance is staffed with professional security officers who have undergone rigorous training and background checks. These security officers also routinely patrol the datacenter while they also monitor the videos of cameras inside the datacenter 24/7 and 365 days a year.

- Inside building - After you enter the building, you must pass two-factor authentication with biometrics to continue moving through the datacenter. If your identity is validated, you can enter the portion of the datacenter that you have approved access to. You can stay there only for the duration of the time approved.

- Datacenter floor – You are only allowed into the floor that you're approved to enter. You must pass a full body metal detection screening. To reduce the risk of unauthorized data entering or leaving the datacenter without our knowledge, only approved devices can make their way into the datacenter floor. Additionally, video cameras monitor the front and back of every server rack. Full body metal detection screening is repeated when you exit the datacenter floor. To leave the datacenter, you're required to pass through an additional security scan.

Visitors are required to surrender badges upon departure from any Microsoft facility.

## Physical security reviews
Physical security reviews of the facilities are performed periodically to ensure the datacenters properly address Microsoft Azure security requirements. The datacenter hosting provider personnel do not provide Microsoft Azure service management. Personnel do not have logon access to Azure systems or physical access to the Azure collocation room and cages.

## Data bearing devices
Microsoft uses best practice procedures and a wiping solution that is [NIST 800-88 compliant](https://csrc.nist.gov/publications/detail/sp/800-88/archive/2006-09-01). For hard drives that can’t be wiped, we use a destruction process that destroys it and renders the recovery of information impossible. Destruction process may be disintegrate, shred, pulverize, or incinerate. The appropriate means of disposal is determined by the asset type. Records of the destruction are retained.  

## Equipment disposal
Microsoft Azure implements this principle on behalf of customers. Upon a system's end-of-life, Microsoft operational personnel follow rigorous data handling and hardware disposal procedures to assure that hardware containing customer data is not made available to untrusted parties. A Secure Erase approach is followed (via hard drive firmware) for drives that support it. For hard drives that can’t be wiped, we use a destruction process that destroys it and renders the recovery of information impossible. Destruction process may be disintegrate, shred, pulverize, or incinerate. The appropriate means of disposal is determined by the asset type. Records of the destruction are retained. All Microsoft Azure services use approved media storage and disposal management services.

## Compliance
The Azure infrastructure is designed and managed to meet a broad set of international and industry-specific compliance standards, such as General Data Protection Regulation (GDPR), ISO 27001, HIPAA, FedRAMP, SOC 1 and SOC 2. Country-specific standards are also met, including Australia IRAP, UK G-Cloud, and Singapore MTCS. Rigorous third-party audits, such as those done by the British Standards Institute, verify Azure’s adherence to the strict security controls these standards mandate.

See our [compliance offerings](https://www.microsoft.com/trustcenter/compliance/complianceofferings) for a full list of compliance standards adhered to by Azure.

## Next steps

<!--Image references-->
[1]: ./media/azure-physical-security/data-residency-boundary.png
