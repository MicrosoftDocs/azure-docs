---
title: Create and edit Azure Policy security policies using the REST API
description: Learn about Azure Policy policy management via a REST API.
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: memildin
---

# Configure a security policy in Azure Policy using the REST API

As part of the native integration with Azure Policy, Azure Security Center enables you to take advantage Azure Policy’s REST API to create policy assignments. The following instructions walk you through creation of policy assignments, as well as customization of existing assignments. 

Important concepts in Azure Policy: 

- A **policy definition** is a rule 

- An **initiative** is a collection of policy definitions (rules) 

- An **assignment** is an application of an initiative or a policy to a specific scope (management group, subscription, etc.) 

Security Center has a built-in initiative that includes all of its security policies. To assess Security Center’s policies on your Azure resources, you should create an assignment on the management group, or subscription you want to assess.

The built-in initiative has all of Security Center’s policies enabled by default. You can choose to disable certain policies from the built-in initiative. For example, to apply all of Security Center’s policies except **web application firewall**, change the value of the policy’s effect parameter to **Disabled**. 

## API examples

In the following examples, replace these variables:

- **{scope}** enter the name of the management group or subscription to which you're applying the policy.
- **{policyAssignmentName}** enter the [name of the relevant policy assignment](#policy-names).
- **{name}** enter your name, or the name of the administrator who approved the policy change.

This example shows you how to assign the built-in Security Center initiative on a subscription or management group
 
 ```
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
 ```

This example shows you how to assign the built-in Security Center initiative on a subscription, with the following policies disabled: 

- System updates (“systemUpdatesMonitoringEffect”) 

- Security configurations ("systemConfigurationsMonitoringEffect") 

- Endpoint protection ("endpointProtectionMonitoringEffect") 

 ```
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
 ```
This example shows you how to remove an assignment:
 ```
    DELETE   
    https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 
 ```

## Policy names reference <a name="policy-names"></a>

|Policy name in Security Center|Policy name displayed in Azure Policy |Policy effect parameter name|
|----|----|----|
|SQL Encryption |Monitor unencrypted SQL database in Azure Security Center |sqlEncryptionMonitoringEffect| 
|SQL Auditing |Monitor unaudited SQL database in Azure Security Center |sqlAuditingMonitoringEffect|
|System updates |Monitor missing system updates in Azure Security Center |systemUpdatesMonitoringEffect|
|Storage encryption |Audit missing blob encryption for storage accounts |storageEncryptionMonitoringEffect|
|JIT Network access |Monitor possible network just-in-time (JIT) access in Azure Security Center |jitNetworkAccessMonitoringEffect |
|Adaptive application controls |Monitor possible app Whitelisting in Azure Security Center |adaptiveApplicationControlsMonitoringEffect|
|Network security groups |Monitor permissive network access in Azure Security Center |networkSecurityGroupsMonitoringEffect| 
|Security configurations |Monitor OS vulnerabilities in Azure Security Center |systemConfigurationsMonitoringEffect| 
|Endpoint protection |Monitor missing Endpoint Protection in Azure Security Center |endpointProtectionMonitoringEffect |
|Disk encryption |Monitor unencrypted VM Disks in Azure Security Center |diskEncryptionMonitoringEffect|
|Vulnerability assessment |Monitor VM Vulnerabilities in Azure Security Center |vulnerabilityAssessmentMonitoringEffect|
|Web application firewall |Monitor unprotected web application in Azure Security Center |webApplicationFirewallMonitoringEffect |
|Next generation firewall |Monitor unprotected network endpoints in Azure Security Center| |


## Next steps

For other related material, see the following articles: 

- [Custom security policies](custom-security-policies.md)
- [Security policy overview](tutorial-security-policy.md)