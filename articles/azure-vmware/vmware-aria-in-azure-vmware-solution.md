---
title: VMware Aria in Azure VMware Solution 
description: Learn about VMware Aria suite in Azure VMware Solution. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 9/27/2024
ms.custom: engagement-fy23
---

# VMware Aria in Azure VMware Solution

This document provides an overview of VMware Aria suite in Azure VMware Solution (Azure VMware Solution).  

VMware Aria Suite Enterprise includes:
- VMware Aria Suite Lifecycle
- VMware Aria Operations
- VMware Aria Operations for Logs
- VMware Aria Operations for Networks
- VMware Aria Automation
- VMware Aria Automation Orchestrator

You can install the VMware Aria suite on Azure VMware Solution with your VMware Cloud Foundations (VCF) subscription. 

## Before you begin

- Review [Aria product documentation](https://docs.vmware.com/en/VMware-Aria-Suite/2019/Getting-Started-VMware-Aria-Suite/GUID-6531EC71-6AC0-4C22-BF38-1A5CD21825C6.html) to learn about deploying Aria suite. 
-  Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](https://learn.microsoft.com/azure/azure-vmware/tutorial-network-checklist).
- Ensure you understand Azure VMware Solution [identity concepts](https://learn.microsoft.com/azure/azure-vmware/architecture-identity#vcenter-server-access-and-identity) to correctly configure the cloud account in Aria suite.
- Review how to [rotate the CloudAdmin credentials for Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/rotate-cloudadmin-credentials?tabs=azure-portal). 


>[!NOTE] 
> The "CloudAdmin" role in Azure VMware Solution has limited privileges. 

## Known Limitations

### VMware Aria Operations 

- Management VMs are hidden from end-user visibility, hence their CPU, and memory utilization aren't included in the utilization of hosts, clusters, and upper level objects. As a result, the utilization of hosts and clusters might appear lower than expected and capacity remaining may appear higher than expected.
- Cost calculation based on reference database is supported on Azure VMware Solution.
- The end-user on the vCenter Server on Azure VMware Solution has limited privileges. In-guest memory collection using VMware tools isn't supported with virtual machines. Active and consumed memory utilizations continue to work in this case.
- You can't log in to VMware Aria Operations using the credentials of the vCenter Server on Azure VMware Solution.
- The vCenter Server on Azure VMware Solution doesn't support the Aria Operations plugin.
- Workload optimization including pDRS and host-based business intent isn't supported because the end-user doesn't have respective privileges to manage cluster configurations.
 
### VMware Aria Operations for Log 

- The CloudAdmin role doesn't have sufficient privileges to configure syslog settings on ESXi hosts in Azure VMware Solution. However, the privileges are sufficient to collect data from the Azure VMware Solution vCenter server, including events, tasks, and alerts.
- While setting up the NSX content pack, CloudAdmin role can't configure log forwarding from NSX appliances in Azure VMware Solution.

### VMware Aria Operations for Network

- While adding the Azure VMware Solution vCenter Server as a data source, selecting "VMware vCenter" as the data source type leads to the following error: **"Global.settings is missing in CloudAdmin role"** , which prevents adding vCenter Server to VMware Aria Operations for Network. To resolve this error, select "VMC vCenter" as the data source type instead.
- To add Azure VMware Solution NSX Manager as a data source in VMware Aria Operations for Network, go to Settings > Accounts and Data Sources, then click "Add Source." In the VMware Cloud (VMC) category, select "Azure VMware Solution NSX Manager."
- The CloudAdmin role doesn't have write access to NSX IPFIX MP API: **/api/v1/ipfix/collectorconfigs/<id>**. As this API isn't allowed for CloudAdmin, VMware Aria Operations for Networks no longer supports IPFIX flow collection for logical switches created using Advanced Networking tab in NSX. 

### VMware Aria Automation Orchestrator

-  Using "vSphere" as an Authentication mode with VMware Aria automation isn't supported. It results in the following error: **"Error while configuring authentication: com.vmware.vim.sso.admin.exception.NoPermissionException"**. To resolve this issue, use "vRealize Automation" as an authentication mode.

### VMware Aria Suite easy installer 

- If using VMware Aria suite easy installer, you may see error **"User has no administrative privileges. Refer link to check required permission for vCenter user"**. To resolve this issue, select the **Infrastructure type** as **Hyperscaler**  under "Appliance Deployment Target."
