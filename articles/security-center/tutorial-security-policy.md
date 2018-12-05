---
title: Edit security policies in Azure Policy | Microsoft Docs
description: Edit security policies in Azure Policy.
services: security-center
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: 2d248817-ae97-4c10-8f5d-5c207a8019ea
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/3/2018
ms.author: rkarlin
---

# Edit security policies in Azure Policy
Security Center helps you view the status of security policies and how they are applied across your workloads. Azure Security Center automatically assigns its [built-in security policies](security-center-policy-definitions.md) on each subscription that is onboarded. You can configure them in [Azure Policy](../azure-policy/azure-policy-introduction.md), or using the REST API, which also enables you to set policies across Management groups and across multiple subscriptions. For more information, see [Integrate Security Center security policies with Azure Policy](security-center-azure-policy.md). In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Configure a security policy using the REST API
> * Assess the security of your resources

If you don’t have an Azure subscription, create a  [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites
To step through the features covered in this tutorial, you must be on Security Center’s Standard pricing tier. You can try Security Center Standard at no cost. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/). The quickstart [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through how to upgrade to Standard.

## Configure a security policy using the REST API

As part of the native integration with Azure Policy, Azure Security Center enables you to take advantage Azure Policy’s REST API to create policy assignments. The following instructions walk you through creation of policy assignments, as well as customization of existing assignments. 

Important concepts in Azure Policy: 

- A **policy definition** is a rule 

- An **initiative** is a collection of policy definitions (rules) 

- An **assignment** is an application of an initiative or a policy to a specific scope (management group, subscription, etc.) 

Security Center has a built-in initiative that includes all of its security policies. In order to assess Security Center’s policies on your Azure resources, you should create an assignment on the management group, or subscription you want to assess.  

The built-in initiative has all of Security Center’s policies enabled by default. You can choose to disable certain policies from the built-in initiative, for example you can apply all of Security Center’s policies except **web application firewall**, by changing the value of the policy’s effect parameter to **Disabled**. 

### API examples

In the following examples, replace these variables:

- **{scope}** enter the name of the management group or subscription you are applying the policy to.
- **{poicyAssignmentName}** enter the [name of the relevant policy assignment](#policy-names).
- **{name}** enter your name, or the name of the administrator who approved the policy change.

This example shows you how to assign the built-in Security Center initiative on a subscription or management group
 
    PUT  
    https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 

    Request Body (JSON) 

    { 

      "properties":{ 

    "displayName":"Enable Monitoring in Azure Security Center", 

    "metadata":{ 

    "assignedBy":"{Name}" 

    }, 

    "policyDefinitionId":"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8", 

    "parameters":{}, 

    } 

    } 

This example shows you how to assign the built-in Security Center initiative on a subscription, with the following policies disabled: 

- System updates (“systemUpdatesMonitoringEffect”) 

- Security configurations ("systemConfigurationsMonitoringEffect") 

- Endpoint protection ("endpointProtectionMonitoringEffect") 

 
      PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 

      Request Body (JSON) 

      { 

        "properties":{ 

      "displayName":"Enable Monitoring in Azure Security Center", 

      "metadata":{ 

      "assignedBy":"{Name}" 

      }, 

      "policyDefinitionId":"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8", 

      "parameters":{ 

      "systemUpdatesMonitoringEffect":{"value":"Disabled"}, 

      "systemConfigurationsMonitoringEffect":{"value":"Disabled"}, 

      "endpointProtectionMonitoringEffect":{"value":"Disabled"}, 

      }, 

       } 

      } 

This example shows you how to remove an assignment:

    DELETE   
    https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 


## Policy names reference <a name="policy-names"></a>

|Policy name in Security Center|Policy name displayed in Azure Policy |Policy effect parameter name|
|----|----|----|
|SQL Encryption |Monitor unencrypted SQL database in Azure Security Center |sqlEncryptionMonitoringEffect| 
|SQL Auditing |Monitor unaudited SQL database in Azure Security Center |sqlAuditingMonitoringEffect|
|System updates |Monitor missing system updates in Azure Security Center |systemUpdatesMonitoringEffect|
|Storage encryption |Audit missing blob encryption for storage accounts |storageEncryptionMonitoringEffect|
|JIT Network access |Monitor possible network Just In Time (JIT) access in Azure Security Center |jitNetworkAccessMonitoringEffect |
|Adaptive application controls |Monitor possible app Whitelisting in Azure Security Center |adaptiveApplicationControlsMonitoringEffect|
|Network security groups |Monitor permissive network access in Azure Security Center |networkSecurityGroupsMonitoringEffect| 
|Security configurations |Monitor OS vulnerabilities in Azure Security Center |systemConfigurationsMonitoringEffect| 
|Endpoint protection |Monitor missing Endpoint Protection in Azure Security Center |endpointProtectionMonitoringEffect |
|Disk encryption |Monitor unencrypted VM Disks in Azure Security Center |diskEncryptionMonitoringEffect|
|Vulnerability assessment |Monitor VM Vulnerabilities in Azure Security Center |vulnerabilityAssesmentMonitoringEffect|
|Web application firewall |Monitor unprotected web application in Azure Security Center |webApplicationFirewallMonitoringEffect |
|Next generation firewall |Monitor unprotected network endpoints in Azure Security Center| |





## Next steps
In this article, you learned how to edit security policies in Azure Policy. To learn more about Security Center, see the following articles:

* [Azure Security Center planning and operations guide](security-center-planning-and-operations-guide.md): Learn how to plan and understand the design considerations about Azure Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
* [Manage and respond to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitor partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Gain tenant-wide visibility for Azure Security Center](security-center-management-groups.md): Learn how to set up management groups for Azure Security Center.
* [Azure Security Center FAQ](security-center-faq.md): Get answers to frequently asked questions about using the service.
* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.

To learn more about Azure Policy, see [What is Azure Policy?](../azure-policy/azure-policy-introduction.md)
