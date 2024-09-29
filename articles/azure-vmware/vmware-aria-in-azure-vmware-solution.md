---
title: VMware Aria in Azure VMware Solution 
description: Learn about VMware Aria suite in Azure VMware Solution. 
ms.topic: how-to
ms.service: azure-vmware
ms.date: 9/27/2024
ms.custom: engagement-fy23
---

# VMware Aria in Azure VMware Solution

This document provides an overview of VMware Aria suite in Azure VMware Solution.  

VMware Aria Suite Enterprise includes:
- VMware Aria Suite Lifecycle
- VMware Aria Operations
- VMware Aria Operations for Logs
- VMware Aria Operations for Networks
- VMware Aria Automation
- VMware Aria Automation Orchestrator

You can install the VMware Aria suite on Azure VMware Solution with your VCF subscription. 

# Before you begin

- Review [Aria Product documentation](https://docs.vmware.com/en/VMware-Aria-Suite/2019/Getting-Started-VMware-Aria-Suite/GUID-6531EC71-6AC0-4C22-BF38-1A5CD21825C6.html) to learn about deploying Aria Suite. 
-  Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](https://learn.microsoft.com/en-us/azure/azure-vmware/tutorial-network-checklist).
- Ensure you understand Azure VMware Solution [identity concepts](https://learn.microsoft.com/en-us/azure/azure-vmware/architecture-identity#vcenter-server-access-and-identity) to correctly configure the cloud account in Aria suite.
- Review how to [Rotate the cloudadmin credentials for Azure VMware Solution](https://learn.microsoft.com/en-us/azure/azure-vmware/tutorial-network-checklist). 


>[!NOTE] 
> The "CloudAdmin" role in AVS has limited privileges. 

# Known Limitations

## VMware Aria Operations 

- Management VMs are hidden from end-user visibility, hence their CPU and memory utilization aren't included in the utilization of hosts, clusters and upper level objects. As a result, the utilization of hosts and clusters might appear lower than expected and capacity remaining may appear higher than expected.
- Cost calculation based on reference database is supported on Azure VMware Solution.
- The end-user on the vCenter Server on Azure VMware Solution has limited privileges. In-guest memory collection using VMware tools isn't supported with virtual machines. Active and consumed memory utilizations continue to work in this case.
- You cannot log in to VMware Aria Operations using the credentials of the vCenter Server on Azure VMware Solution.
- The vCenter Server on Azure VMware Solution doesn't support the Aria Operations plugin.
- Workload optimization including pDRS and host-based business intent isn't supported because the end-user doesn't have respective privileges to manage cluster configurations.
 
## VMware Aria Operations for Log 

- The CloudAdmin role doesn't have sufficient privileges to configure syslog settings on ESXi hosts in Azure VMware Solution. However, the privileges are sufficient to collect data from the Azure VMware Solution vCenter server, including events, tasks, and alerts.
- When setting up the NSX content pack, CloudAdmin role cannot configure log forwarding from NSX appliances in Azure VMware Solution.

## VMware Aria Operations for Network

- When adding the Azure VMware Solution vCenter Server as a data source, if you select "VMware vCenter" as the data source type, you will encounter the error: **Global.settings is missing in cloudadmin role** , which prevents adding vCenter Server to VMware Aria Operations for Network. To resolve this error, select "VMC vCenter" as the data source type instead.
- To add Azure VMware Solution NSX Manager as a data source in VMware Aria Operations for Network, go to Settings > Accounts and Data Sources, then click Add Source. In the VMware Cloud (VMC) category, select Azure VMware Solution NSX Manager.
- The CloudAdmin role doesn't have write access to NSX IPFIX MP API: /api/v1/ipfix/collectorconfigs/<id> . As this API is not allowed for CloudAdmin, VMware Aria Operations for Networks will no longer support IPFIX flow collection for logical switches created using Advanced Networking tab in NSX. 

## VMware Aria Automation Orchestrator

-  Using "vSphere" as an Authentication mode with VMware Aria automation is not supported. It will result in error **Error while configuring authentication: com.vmware.vim.sso.admin.exception.NoPermissionException**. To resolve this issue, Use "vRealize Automation" as an authentication mode.

## VMware Aria Suite easy installer 

- If using VMware Aria suite easy installer, you may see error **User has no administrative privileges. Refer link to check required permission for vCenter user**. To resolve this issue, select the **Infrastructure type** as **Hyperscaler**  under Appliance Deployment Target.
