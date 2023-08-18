---
title: Deploy Citrix on Azure VMware Solution
description: Learn how to deploy VMware Citrix on Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/24/2022
ms.custom: engagement-fy23
---


# Deploy Citrix on Azure VMware Solution

Citrix Virtual Apps and Desktop service supports Azure VMware Solution. Azure VMware Solution provides cloud infrastructure containing vSphere clusters created by Azure infrastructure. You can leverage the Citrix Virtual Apps and Desktop Service to use Azure VMware Solution for provisioning your [Virtual Delivery Agent (VDA)](https://www.citrix.com/downloads/xendesktop/components/xendesktop-and-xenapp-76-VDA.html) workload in the same way you would using vSphere in on-premises environments. 

[Learn more about Citrix virtual apps and desktops](https://www.citrix.com/products/citrix-virtual-apps-and-desktops/)

[Deployment guide](https://docs.citrix.com/en-us/citrix-virtual-apps-desktops-service/install-configure/resource-location/azure-resource-manager.html#azure-vmware-solution-avs-integration)

[Solution brief](https://www.citrix.com/downloads/citrix-virtual-apps-and-desktops/)

**FAQ (review Q&As)**

- Q. Can I migrate my existing Citrix desktops and apps to Azure VMware Solution, or operate a hybrid environment that consists of on-premises and Azure VMware Solution-based Citrix workloads?

    A. Yes. You can use the same machine images, application packages, and processes you currently use. You’re able to seamlessly link on-premises and Azure VMware Solution-based environments together for a migration.

- Q. Can Citrix be deployed as a standalone environment within Azure VMware Solution?

    A. Yes. You’re free to migrate, operate a hybrid environment, or deploy a standalone directly into Azure VMware Solution.

- Q. Does Azure VMware Solution support both PVS and MCS?

    A. Yes.

- Q. Are GPU-based workloads supported in Citrix on Azure VMware Solution?

    A. Not at this time. However, Citrix workloads on Microsoft Azure support GPU if that use case is important to you.

- Q. Is Azure VMware Solution supported with on-premesis Citrix deployments or LTSR?  

    A. No.  Azure VMware Solution is only supported with the Citrix Virtual Apps and Desktops service offerings.  

- Q. Who do I call for support?

    A. Customers should contact Citrix support www.citrix.com/support  for assistance.

- Q. Can I use my Azure Virtual Desktop benefit from Microsoft with Citrix on Azure VMware Solution?
 
    A. No. Azure Virtual Desktop benefits are applicable to native Microsoft Azure workloads only. Citrix Virtual Apps and Desktops service, as a native Azure offering, can apply your Azure Virtual Desktop benefit alongside your Azure VMware Solution deployment.

- Q. How do I purchase Citrix Virtual Apps and Desktops service to use Azure VMware Solution?
    
    A. You can purchase Citrix offerings via your Citrix partner or directly from the Azure Marketplace.
