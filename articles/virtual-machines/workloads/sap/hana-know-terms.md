---
title: Know the terms of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Know the terms of SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Know the terms

Several common definitions are widely used in the Architecture and Technical Deployment Guide. Note the following terms and their meanings:

- **IaaS**: Infrastructure as a service.
- **PaaS**: Platform as a service.
- **SaaS**: Software as a service.
- **SAP component**: An individual SAP application, such as ERP Central Component (ECC), Business Warehouse (BW), Solution Manager, or Enterprise Portal (EP). SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
- **SAP environment**: One or more SAP components logically grouped to perform a business function, such as development, quality assurance, training, disaster recovery, or production.
- **SAP landscape**: Refers to the entire SAP assets in your IT landscape. The SAP landscape includes all production and non-production environments.
- **SAP system**: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, an SAP BW test system, and an SAP CRM production system. Azure deployments don't support dividing these two layers between on-premises and Azure. An SAP system is either deployed on-premises or it's deployed in Azure. You can deploy the different systems of an SAP landscape into either Azure or on-premises. For example, you can deploy the SAP CRM development and test systems in Azure while you deploy the SAP CRM production system on-premises. For SAP HANA on Azure (Large Instances), it's intended that you host the SAP application layer of SAP systems in VMs and the related SAP HANA instance on a unit in the SAP HANA on Azure (Large Instances) stamp.
- **Large Instance stamp**: A hardware infrastructure stack that is SAP HANA TDI-certified and dedicated to run SAP HANA instances within Azure.
- **SAP HANA on Azure (Large Instances):** Official name for the offer in Azure to run HANA instances in on SAP HANA TDI-certified hardware that's deployed in Large Instance stamps in different Azure regions. The related term *HANA Large Instance* is short for *SAP HANA on Azure (Large Instances)* and is widely used in this technical deployment guide.
- **Cross-premises**: Describes a scenario where VMs are deployed to an Azure subscription that has site-to-site, multi-site, or Azure ExpressRoute connectivity between on-premises data centers and Azure. In common Azure documentation, these kinds of deployments are also described as cross-premises scenarios. The reason for the connection is to extend on-premises domains, on-premises Azure Active Directory/OpenLDAP, and on-premises DNS into Azure. The on-premises landscape is extended to the Azure assets of the Azure subscriptions. With this extension, the VMs can be part of the on-premises domain. 

   Domain users of the on-premises domain can access the servers and run services on those VMs (such as DBMS services). Communication and name resolution between VMs deployed on-premises and Azure-deployed VMs is possible. This scenario is typical of the way in which most SAP assets are deployed. For more information, see [Plan and design for Azure VPN Gateway](../../../vpn-gateway/vpn-gateway-plan-design.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Create a virtual network with a site-to-site connection by using the Azure portal](../../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
- **Tenant**: A customer deployed in HANA Large Instance stamp gets isolated into a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the HANA Large Instance stamp level. A customer can choose to have deployments into different tenants. Even then, there is no communication between tenants on the HANA Large Instance stamp level.
- **SKU category**: For HANA Large Instance, the following two categories of SKUs are offered:
    - **Type I class**: S72, S72m, S144, S144m, S192, S192m, and S192xm
    - **Type II class**: S384, S384m, S384xm, S384xxm, S576m, S576xm, S768m, S768xm, and S960m


A variety of additional resources are available on how to deploy an SAP workload in the cloud. If you plan to execute a deployment of SAP HANA in Azure, you need to be experienced with and aware of the principles of Azure IaaS and the deployment of SAP workloads on Azure IaaS. Before you continue, see [Use SAP solutions on Azure virtual machines](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for more information. 

**Next steps**
- Refer [HLI Certification](hana-certification.md)