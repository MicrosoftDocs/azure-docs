--- 
title:  Get started with Azure Automation | Microsoft Docs
description: This article provides an overview of Azure Automation service by reviewing the design and implementation details in preparation to onboard the offering from Azure Marketplace. 
services: automation
documentationcenter: ''
author: georgewallace
manager: carmonm
editor: ''

ms.assetid: 
ms.service: automation
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/31/2017
ms.author: magoedte
---

# Get started with Azure Automation

This article introduces core concepts that are related to the deployment of Azure Automation. Whether you are new to Automation in Azure or have experience with automation workflow software like System Center Orchestrator, learn how to prepare and onboard Automation. After you read this article, you can begin developing runbooks to support your process automation needs. 


## Automation architecture

![Azure Automation overview](media/automation-offering-get-started/automation-infradiagram-networkcomms.png)

Azure Automation is a software as a service (SaaS) application that provides a scalable and reliable multitenant environment. Use Automation to automate processes by using runbooks. You can also manage configuration changes to Windows and Linux systems by using Desired State Configuration (DSC) in Azure, other cloud services, or on-premises. Entities in your Automation account, like runbooks, assets, and Run As accounts, are isolated from other Automation accounts in your subscription, and from other subscriptions.  

Runbooks that you run in Azure are executed on Automation sandboxes. The sandboxes are hosted in Azure platform as a service (PaaS) virtual machines. 

Automation sandboxes provide tenant isolation for all aspects of runbook execution, including modules, storage, memory, network communication, and job streams. This role is managed by the service. You can't access or manage the role from your Azure or Automation account.         

To automate the deployment and management of resources in your local datacenter or other cloud services, after you create an Automation account, you can designate one or more VMs to run the [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md) role. Each Hybrid Runbook Worker requires Microsoft Management Agent to be installed, with a connection to a Log Analytics workspace, and an Automation account. Log Analytics is used to bootstrap the installation, maintain Microsoft Management Agent, and monitor the functionality of the Hybrid Runbook Worker. Azure Automation performs the delivery of runbooks and the instruction to run them.

You can deploy multiple Hybrid Runbook Workers. Use Hybridge Runbook Workers to provide high availability for your runbooks, load-balance runbook jobs, and in some cases, dedicate runbook jobs for specific workloads or environments. Microsoft Monitoring Agent on the Hybrid Runbook Worker initiates communication with the Automation service over TCP port 443. There are no inbound firewall requirements.  

When a runbook is running on a Hybrid Runbook Worker in your environment, you might want the runbook to perform management tasks against other machines or services in that environment. In that scenario, the runbook might also need to access other ports. If your IT security policies don't allow computers on your network to connect to the internet, review the article [OMS Gateway](../log-analytics/log-analytics-oms-gateway.md), which acts as a proxy for the Hybrid Runbook Worker. It collects job status and receives configuration information from your Automation account.

Runbooks running on a Hybrid Runbook Worker run in the context of the local System account on the computer. We recommend security context when you perform administrative actions on the local Windows machine. If you want the runbook to run tasks against resources outside the local machine, you might need to define secure credential assets in the Automation account that you can access from the runbook and use to authenticate with the external resource. You can use [Credential](automation-credentials.md), [Certificate](automation-certificates.md), and [Connection](automation-connections.md) assets in your runbook with cmdlets that you can use to specify credentials so that you can authenticate them.

DSC configurations stored in Azure Automation can be directly applied to Azure virtual machines. Other physical and virtual machines can request configurations from the Azure Automation DSC pull server. For managing configurations of your on-premises physical or virtual Windows and Linux systems, you don't need to deploy any infrastructure to support the Automation DSC pull server. You only need outbound internet access from each system that you will manage by using Automation DSC. Communication occurs over TCP port 443 to the OMS service.   

## Prerequisites

### Automation DSC
You can use Automation DSC to manage these machines:

* Azure virtual machines (classic) running Windows or Linux.
* Azure virtual machines running Windows or Linux.
* Amazon Web Services (AWS) virtual machines running Windows or Linux.
* Physical and virtual Windows computers that are on-premises, or in a cloud other than Azure or AWS.
* Physical and virtual Linux computers that are on-premises, or in a cloud other than Azure or AWS.

For Windows machines, the latest version of Windows Management Framework (WMF) 5 must be installed. For Linux machines, the latest version of the [PowerShell DSC agent for Linux](https://www.microsoft.com/en-us/download/details.aspx?id=49150) must be installed. The PowerShell DSC agent uses WMF 5 to communicate with Automation. 

### Hybrid Runbook Worker  
When you designate a computer to run hybrid runbook jobs, the computer must meet the following prerequisites:

* Windows Server 2012 or later.
* Windows PowerShell 4.0 or later. We recommend installing Windows PowerShell 5.0 on the computer for increased reliability. You can download the new version from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=50395).
* .NET Framework 4.6.2 or later.
* A  minimum of two cores.
* A minimum of 4 GB of RAM.

### Permissions required to create Automation account
To create or update an Automation account, and to complete the tasks described in this article, you must have the following privileges and permissions:   
 
* To create an Automation account, your Azure Active Directory (Azure AD) user account must be added to a role with permissions equivalent to the Owner role for Microsoft.Automation resources. For more information, see [Role-based access control in Azure Automation](automation-role-based-access-control.md).  
* If the app registrations setting is set to **Yes**, non-admin users in your Azure AD tenant can [register Active Directory applications](../azure-resource-manager/resource-group-create-service-principal-portal.md#check-azure-subscription-permissions). If the app registrations setting is set to **No**, the user who performs this action must be a global administrator in Azure AD. 

If you aren't a member of the subscription’s Active Directory instance before you are added to the global administrator/coadministrator role of the subscription, you are added to Active Directory as a guest. In this scenario, you see this message on the **Add Automation Account** page: “You do not have permissions to create." 

If a user was added to the global administrator/coadministrator role first, you can remove them from the subscription's Active Directory instance, and then re-add them to make them a full User in Active Directory.

To verify this situation, in the Azure portal, on the **Azure Active Directory** pane, select **Users and groups**, and then select **All users**. After you select a specific user, select **Profile**. The value of the **User type** attribute under the user's profile should not be **Guest**.

## Plan for authentication
In Azure Automation, you can automate tasks against resources in Azure, on-premises, and with other cloud providers. For a runbook to perform its required actions, it must have permissions to securely access the resources. It must have the minimal rights required within the subscription.  

### What is an Automation account 
All the automation tasks that you perform against resources by using the Azure cmdlets in Azure Automation authenticate to Azure by using Azure Active Directory organizational identity credentials-based authentication.  An Automation account is separate from the account you use to sign in to the portal to configure and use Azure resources. The following resources are included with an Automation account:

* **Certificates**. Contains a certificate that's used for authentication from a runbook or DSC configuration. You can also add certificates.
* **Connections**. Contains authentication and configuration information required to connect to an external service or application from a runbook or DSC configuration.
* **Credentials**. A **PSCredential** object, which contains security credentials such as a username and password. The credentials are required to authenticate from a runbook or DSC configuration.
* **Integration modules**. PowerShell modules that are included with an Azure Automation account for using cmdlets within runbooks and DSC configurations.
* **Schedules**. Contains schedules that start or stop a runbook at a specified time, including recurring frequencies.
* **Variables**. Contain values that are available from a runbook or DSC configuration.
* **DSC Configurations**. PowerShell scripts that describe how to configure an operating system feature or setting, or how to install an application on a Windows or Linux computer.  
* **Runbooks**. A set of tasks that perform an automated process in Azure Automation based on Windows PowerShell.    

The Automation resources for each Automation account are associated with a single Azure region. However, Automation accounts can manage all the resources in your subscription. Create Automation accounts in different regions if you have policies that require data and resources to be isolated to a specific region.

When you create an Automation account in the Azure portal, you automatically create two authentication entities:

* **Run As account**. This account creates a service principal in Azure Active Directory, and a certificate. It also assigns the Contributor Role-Based Access Control (RBAC), which manages Resource Manager resources by using runbooks.
* **Classic Run As account**. This account uploads a management certificate, which is used to manage classic resources by using runbooks.

RBAC is available with Azure Resource Manager to grant permitted actions to an Azure AD user account and Run As account, and to authenticate that service principal. For more information, and for help developing your model for managing Automation permissions, see [Role-based access control in Azure Automation article](automation-role-based-access-control.md).  

#### Authentication methods
The following table summarizes the authentication methods you can use for each environment that is supported by Azure Automation.

| Method | Environment 
| --- | --- | 
| Azure Run As and Classic Run As account |Azure Resource Manager and Azure classic deployment |  
| Azure AD User account |Azure Resource Manager and Azure classic deployment |  
| Windows authentication |Local datacenter or other cloud provider, by using the Hybrid Runbook Worker role |  
| Amazon Web Services (AWS) credentials |AWS |  

In the **How-to, authentication, and security** section, supporting articles provide overview and implementation steps to configure authentication for those environments. The articles describe using an existing and using a new account that you dedicate for that environment. 

For the Azure Run As and Classic Run As account, [Update Automation Run As account](automation-create-runas-account.md) describes how to update your existing Automation account with the Run As accounts from the portal. It also describes how to use PowerShell if the Automation account wasn't originally configured with a Run As or Classic Run As account. You can create a Run As and a Classic Run As account with a certificate that's issued by your enterprise certificate authority (CA). Review this article to learn how to create the accounts by using this configuration.     
 
## Network planning
For the Hybrid Runbook Worker to connect to and register with Microsoft Operations Management Suite (OMS), it must have access to the port number and the URLs described in this section. This is in addition to the [ports and URLs required for the Microsoft Monitoring Agent](../log-analytics/log-analytics-windows-agent.md) to connect to OMS. 

If you use a proxy server for communication between the agent and the OMS service, ensure that the appropriate resources are accessible. If you use a firewall to restrict access to the internet, you must configure your firewall to permit access.

The following port and URLs are required for the Hybrid Runbook Worker role to communicate with Automation:

* Port: Only TCP 443 is required for outbound Internet access.
* Global URL: *.azure-automation.net.

If you have an Automation account that's defined for a specific region, you can restrict communication with that regional datacenter. The following table provides the DNS record for each region.

| **Region** | **DNS record** |
| --- | --- |
| South Central US |scus-jobruntimedata-prod-su1.azure-automation.net |
| East US 2 |eus2-jobruntimedata-prod-su1.azure-automation.net |
| West Central US | wcus-jobruntimedata-prod-su1.azure-automation.net |
| West Europe |we-jobruntimedata-prod-su1.azure-automation.net |
| North Europe |ne-jobruntimedata-prod-su1.azure-automation.net |
| Canada Central |cc-jobruntimedata-prod-su1.azure-automation.net |
| South East Asia |sea-jobruntimedata-prod-su1.azure-automation.net |
| Central India |cid-jobruntimedata-prod-su1.azure-automation.net |
| Japan East |jpe-jobruntimedata-prod-su1.azure-automation.net |
| Australia South East |ase-jobruntimedata-prod-su1.azure-automation.net |
| UK South | uks-jobruntimedata-prod-su1.azure-automation.net |
| US Gov Virginia | usge-jobruntimedata-prod-su1.azure-automation.us |

For a list of IP addresses instead of names, download the [Azure Datacenter IP address](https://www.microsoft.com/download/details.aspx?id=41653) XML file from the Microsoft Download Center. 

> [!NOTE]
> The XML file lists the IP address ranges that are used in the Microsoft Azure datacenters. Compute, SQL, and storage ranges are included in the file. An updated file is posted weekly. The file reflects the currently deployed ranges and any upcoming changes to the IP ranges. New ranges that appear in the file aren't used in the datacenters for at least one week. 
>
> It's a good idea to download the new XML file every week. Then, update your site to correctly identify services running in Azure. Azure ExpressRoute users should note that this file used to update the Border Gateway Protocol (BGP) advertisement of Azure space the first week of each month. 
> 

## Create an Automation account

To create an Automation account in the Azure portal, select one of the options described in the following table. The table introduces each type of deployment experience, and describes the differences between them.  

|Method | Description |
|-------|-------------|
| Select **Automation & Control** in the Marketplace. | An offering creates an Automation account and OMS workspace that are linked. They are in the same resource group and region. Integration with OMS also includes the benefit of using Log Analytics to monitor and analyze runbook job status and job streams over time. You can also use the advanced features in Log Analytics to escalate or investigate issues. The offering also deploys the **Change Tracking** and **Update Management** solutions, which are enabled by default. |
| Select **Automation** in the Marketplace. | Creates an Automation account in a new or existing resource group that is not linked to an OMS workspace and does not include any available solutions from the Automation & Control offering. This is a basic configuration that introduces you to Automation and can help you learn how to write runbooks, DSC configurations, and use the capabilities of the service. |
| Select **Management** solutions | If you select a solution, including [Update Management](../operations-management-suite/oms-solution-update-management.md), [Start/Stop VMs during off hours](automation-solution-vm-management.md), and [Change Tracking](../log-analytics/log-analytics-change-tracking.md), the solution prompts you to select an existing Automation account and OMS workspace. The solution offers you the option to create an Automation account and OMS workspace as required for the solution to be deployed in your subscription. |

This article walks you through the process of creating an Automation account and OMS workspace by onboarding the **Automation & Control** offering. To create a standalone Automation account for testing or to preview the service, see [Create a standalone Automation account](automation-create-standalone-account.md).  

### Create an Automation account integrated with OMS
To onboard Automation, we recommend that you select the **Automation & Control** offering in the Marketplace. Using this method creates an Automation account and establishes the integration with an OMS workspace. With this method, you also have the option to install the management solutions that are available with the offering.  

1. Sign in to the Azure portal with an account that is a member of the Subscription Admins role and a coadministrator of the subscription.

2. Select **New**.<br><br> ![Select the New option in the Azure portal](media/automation-offering-get-started/automation-portal-martketplacestart.png)<br>  

3. Search for **Automation**. In the search results, select **Automation & Control***.<br><br> ![Search and select Automation & Control in the Marketplace](media/automation-offering-get-started/automation-portal-martketplace-select-automationandcontrol.png).<br>   

4. Review the description for the offering, and then select **Create**.  

5. Under **Automation & Control**, select **OMS Workspace**. Under **OMS Workspaces**, select an OMS workspace that is linked to the Azure subscription that the Automation account is in. If you don't have an OMS workspace, select **Create New Workspace**. Under **OMS Workspace**: 
   - For **OMS Workspace**, enter a name for the new workspace.
   - For **Subscription**, select a subscription to link to. If the default selection isn't the subscription you want to use, select from the drop-down list.
   - For **Resource Group**, you can create a resource group, or select an existing resource group.  
   - For **Location**, select a region. For more information, see which [regions Azure Automation is available in](https://azure.microsoft.com/regions/services/).  
   
    Solutions are offered in two tiers: free and Per Node (OMS) tier. The free tier has a limit on the amount of data collected daily, the retention period, and runbook job runtime minutes. The Per Node (OMS) tier doesn't have a limit on the amount of data collected daily.  
   - Select **Automation Account**.  If you create a new OMS workspace, you must also create an Automation account that's associated with the new OMS workspace specified earlier. Include your Azure subscription, resource group, and region. 
   
    - Select **Create an Automation account**.
    - Under **Automation Account**, in the **Name** field, enter the name of the Automation account.

      All other options are automatically populated based on the OMS workspace selected. You can't modify these options. 
    
    - An Azure Run As account is the default authentication method for the offering. After you select **OK**, the configuration options are validated and the Automation account is created. To track its progress, on the menu, select **Notifications**. 

    - Otherwise, select an existing Automation Run As account.  The account you select cannot already be linked to another OMS workspace. If it is, a notification message appears. If the account is already linked to an OMS workspace, select a different Automation Run As account or create one.

    - After you enter or select the required information, select **Create**. The information is verified, and the Automation Account and Run As accounts are created. You are automatically returned to the **OMS workspace** pane.  

6. After you enter or select the required information on the **OMS Workspace** pane, select **Create**.  The information is verified and the workspace is created. To track its progress, on the menu, select **Notifications**. You are returned to the **Add Solution** pane.  

7. Under **Automation & Control** settings, confirm that you want to install the recommended preselected solutions. If you clear any check boxes, you can install them individually later.  

8. To proceed with onboarding Automation and an OMS workspace, select **Create**. All settings are validated, and then Azure attempts to deploy the offering in your subscription. This process might take several seconds. To track its progress, in the menu, select  **Notifications**. 

After the offering is onboarded, you can do the following tasks:
* Begin creating runbooks.
* Work with the management solutions that you enabled.
* Deploy a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md) role.
* Start working with [Log Analytics](https://docs.microsoft.com/azure/log-analytics) to collect data generated by resources in your cloud or on-premises environment.   

## Next steps
* Verify that your new Automation account can authenticate against Azure resources. For more information, see [Test Azure Automation Run As account authentication](automation-verify-runas-authentication.md).
* Learn how to get started with creating runbooks and related considerations before you begin authoring. For more information, see [Automation runbook types](automation-runbook-types.md).


