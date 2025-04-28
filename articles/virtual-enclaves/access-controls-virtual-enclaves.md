---
title: Access Control Overview
description: Access Control Overview.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Identity and access controls for Azure Virtual Enclaves

Azure Virtual Enclaves (AVE) provides robust identity and access management (IAM) controls to safeguard your environments while ensuring operational flexibility. This document outlines how Enclave and Workload Administration settings are configured, as well as how Virtual Enclaves integrate with Azure-first identity solutions like Microsoft Entra ID, on-premises Active Directory, Privileged Identity Management (PIM), and the Personnel Portal.

## Enclave Administration and Workload Administration Settings

Azure Virtual Enclaves uses hierarchical IAM settings to define roles and permissions at multiple levels: 

### Enclave Administration Settings
- **Purpose**: Control administrative access to the resources that form the Enclave's managed infrastructure.  
- **Scope**: Applies to the Enclave Managed Resource Group.  
- **Configuration**:  
  Enclave Administration settings define **who can manage and configure enclave-level resources**. AVE users specify these permissions during enclave creation or modification.  
  Common roles assigned include:
  - **Enclave Admin**: Full access to Enclave Managed Resource Group.
  - **Enclave Operator**: Limited permissions for operational tasks such as monitoring logs or restarting services.

  **Resources governed under Enclave Administration settings**:
  - **Virtual Network (vNet) and NSGs**
  - **Azure Bastion**
  - **Private DNS Zones**
  - **Logging and monitoring configurations**

### Workload Administration Settings
- **Purpose**: Define administrative access for workloads deployed into resource groups within the Enclave.  
- **Scope**: Applies to each workload resource group associated with the enclave.  
- **Configuration**:  
  Workload Administration settings ensure **administrators can manage application-specific resources without impacting enclave-wide infrastructure**. These settings are specified when deploying or updating workloads.  
  Common roles assigned include:
  - **Workload Admin**: Full access to the workload resource group for deployment and configuration.
  - **Workload Contributor**: Permissions limited to deploying preapproved resources from the Service Catalog.

  **Resources governed under Workload Administration settings**:
  - Compute (for example, Virtual Machines, Azure Kubernetes Service)
  - Storage (for example, Azure Blob Storage, Azure Files)
  - Managed Services (for example, Azure SQL Database, App Services)


## Identity and Access Control Use Cases

### Scenario 1: Enclave Setup and Administration
- An IT administrator assignment is created **Enclave Admin** role during enclave creation.  
- This administrator configures network security settings, sets up private DNS zones, and monitors logging within the Enclave Managed Resource Group.  
- More operators are granted **Enclave Operator** roles for troubleshooting and operational tasks.

### Scenario 2: Workload Deployment
- A development team is granted **Workload Contributor** role within a specific workload resource group.  
- Team members deploy a preapproved web application from the Service Catalog without requiring access to enclave infrastructure.

### Scenario 3: Dynamic Group Management
- A personnel group for database administrators is created in the Personnel Portal.  
- Membership is dynamically updated in Entra ID to grant administrator access to workloads with Azure SQL resources.  
- Members lose access automatically if they no longer meet compliance requirements.

### Scenario 4: Elevated Access for Emergency Troubleshooting
- A workload admin requests temporary **Enclave Admin** privileges via Azure PIM for emergency troubleshooting.  
- The request is reviewed and approved, granting time-limited permissions.  
- Access is automatically revoked after the defined period.


Azure Virtual Enclaves' identity and access control model ensures robust security, dynamic adaptability, and precise governance across isolated, zero-trust environments. By integrating with Azure-first identity solutions, AVE provides administrators with the tools needed to meet even the most stringent security and compliance requirements.

## Built in RBAC Roles for Azure Virtual Enclaves

Azure Virtual Enclaves (AVE) includes a set of built-in **Role-Based Access Control (RBAC)** roles designed to manage AVE-specific resource types. These roles provide granular permissions to manage AVE objects like Communities and Enclaves, without granting permissions to underlying Azure networking resources such as Virtual WAN (vWAN) or Azure Firewall. 

### AVE Built in Roles

The built-in roles are scoped specifically for AVE and don't overlap with permissions for Azure networking, firewall, or virtual WAN components. The key AVE RBAC roles and their descriptions:

#### Community-Level Roles
**Community Owner**  
  Grants full control over the AVE Community resource. This role allows the user to configure community-level settings and manage associated enclaves but doesn't permit direct modification of the underlying Azure networking resources (for example, vWAN or firewall).  
  **Example Permissions**:  
  - Create, delete, or update an AVE Community.  
  - Configure endpoints and transit hub connections for the Community.  

**Community Contributor**  
  Provides permissions to manage community configurations but doesn't include the ability to delete the resource.  
  **Example Permissions**:  
  - Modify existing endpoint rules or transit hub configurations.  

**Community Reader**  
  Grants read-only access to view the AVE Community and its settings, such as networking endpoints and diagnostics configurations.  

#### Enclave-Level Roles
**Enclave Owner**  
  Grants full control over the AVE Enclave resource. Users can manage the enclave’s configuration, including endpoints and workload associations, but can't modify the underlying infrastructure (for example, virtual network or NSGs).  
  **Example Permissions**:  
  - Create, update, or delete an Enclave.  
  - Associate workloads and manage enclave connection rules.  

**Enclave Contributor**  
  Provides permissions to manage enclave configurations without the ability to delete the resource.  
  **Example Permissions**:  
  - Modify enclave endpoints or workload settings.  

**Enclave Reader**  
  Grants read-only access to view enclave settings and associated workloads.  

#### Role Assignment Levels


### Example Scenario

Consider a scenario where an organization is managing an AVE environment. Azure RBAC is managed at four levels - Management Group, Subscription, Resource Group, and Individual Resource. RBAC Role Assignments can be made at any of these levels.

Environment Structure:

**Management Group Administration**
  - **Owner** role assignment is created for the owner of Fabrikam, Inc.
  - **Contributor** role assignment is created for Fabrikam IT Managers.
  - **Viewer** role assignment is created for Fabrikam Security Auditors.

**Subscription Administration**
  - **Owner** role assignments are created for the owner each Fabrikam subscript.
  - **Contributor** role assignment is created for Fabrikam IT Managers.
  - **Viewer** role assignment is created for Fabrikam Security Auditors.

**Community Administration**: 
  - **Community Owner** role assignment is created at the Subscription Level for each individual subscription to enable the deployment of Communities and Enclaves within those subscriptions. 
  - **Community Approver** role assignment is created at the Security Administrator to review and authorized connections to/from external destinations.
  - **Community Viewer** role assignment is created at the Community-Level Security Auditor to view/analyze endpoints and connections within the Community.
  - **Azure Firewall Contributor** role assignment is created at the Security Administrator for configuring firewall policies.

**Enclave Administration** - AVE Built-in role assignments set the:  
  - **Enclave Owner** Mission/Network Owners that need to deploy workloads, endpoints, and connections for one or more enclaves.
  - **Enclave Viewer** Security Auditor to view and analyze endpoints and connections within the enclave.
  - **Network Contributor** Network Engineer for updating underlying NSG rules within the enclave’s virtual network in a break-glass scenario.

**Workload Administration**:
  - **Virtual Machine Contributor** Platforms Engineers to deploy and configure virtual machines.
  - **Storage Blob Contributor** Data Engineers to store and process sensitive data.
  - **Viewer** Security Auditors to analyze and validate an individual workloads output.

**Workload Administration**
  - **User Access Administrator** role to manage user access to Azure resources.

AVEs built-in RBAC roles streamline permissions for managing AVE-specific resources while Azure’s existing roles provide the necessary access for the underlying infrastructure. This separation ensures clear boundaries and simplifies role assignments across your organization.
