---
title: Azure Operator 5G Core support
description: Learn about Azure Operator 5G Core support services, teams, and response times.
author: SarahBoris
ms.author: sboris
ms.service: azure-operator-5g-core
ms.topic: article 
ms.date: 03/13/2024


---
# Azure Operator 5G Core support

## Overview

This article describes support services that are available from Microsoft for the AO5GC service.

You must have a current Microsoft Unified Support services agreement to support your AO5GC services.  If your Microsoft Unified Support services agreement expires or is terminated, your AO5GC Support Service Level Agreement (SLA)  will be terminated on the same date.

## Overview of support service and deliverables

This section covers the components of the included support service and deliverables.

### Support delivery team

The included support service provides access to the following resources:

A Microsoft Technical Service Manager (TSM) who will provide assistance to the customer for the AO5GC Service.

A Microsoft Technical Customer Lead (TCL) who is a senior support engineer and will be the customer’s primary technical point of contact.

Microsoft Support engineers with deep expertise in Azure Operator 5G Core and familiarity with its deployment.

### Reactive Problem Resolution Support services

You may request Problem Resolution Support (PRS) for covered AO5GC instances in accordance with the terms and conditions of your existing Unified Enterprise Support Services Description (USSD) agreement.

The Severity and situation definitions detailed in the USSD will apply.

All target response, restoration, and resolution times detailed in the following sections are measured as elapsed time from when you notify Microsoft by creating a ticket in the Azure Portal with the appropriate Severity level and a clear description of the problem and its impact on your business.  

The elapsed time may be paused if Microsoft’s attempt to restore service or get to final resolution is impacted based on your inability to provide information or perform an action.

### Advisory support

Advisory Support may include advice, guidance, and knowledge transfer intended to help you deploy and implement AO5GC in ways that avoid common support issues and that can decrease the likelihood of system outages.  Design, solution development and customization scenarios are outside of the scope of these Advisory Services.  Advisory support is limited to short term (six hours or less), based on phone / email or ticket contact.

### Additional services

The following additional services are provided on request and may be discontinued at Microsoft’s discretion.

- **Quarterly Business Reviews** led by the Technical Service Manager

- **Weekly Operational (Ticket) Reviews** led by the designated Technical Customer Lead

These services are optional and will be scheduled by Microsoft in collaboration with you.

### Initial response times, service hours, and submission requirements

Support Service initial response times, service hours, and the submission requirements are as defined in your USSD, including any additional enhanced support services purchased.

### Service restoration and problem resolution

Service restoration and problem resolution targets for issues related to the AO5GC software are detailed in the table below.

Service restoration and problem resolution targets only apply to production deployments that have been audited and verified to be deployed according to documented engineering best practices (see below).

| **Severity** | **Service Restoration/Mitigation** | **Problem Resolution** |
|---|---|---|
| **Severity 1/A - Critical** | 5 hours | Less than 60 days, if required |
| **Severity B - Major** | 10 business days | Less than 90 days, if required |
| **Severity C - Minor** | None committed | Fix considered for next release |
| **Advisory** | None required | Answered within 10 business days |

The purpose of **Service Restoration** is to return the solution to a known working state that restores service for the end user as quickly as possible.  

The **Service Restoration** commitment applies to instances of the Product that are (a) deployed in accordance with Microsoft’s documented best practice and (b) have been operating successfully immediately prior to the reported incident.

Service Restoration applies to live, commercial, services only and not to lab or pre-production services.

Microsoft will continue to work with you to restore service until either (a) service is restored or (b) there is sufficiently strong evidence that the root cause is external to the AO5GC product.

If the root cause is external to the AO5GC product, for example in your network, a hardware component, a third-party component, or the end-user network, it is your responsibility to troubleshoot and resolve the issue.  

If the root cause of a service interruption is attributed to a different Microsoft product deployed by customer, the Support SLA relevant to that product will apply.

Microsoft may recommend corrective action to achieve Service Restoration.  If you choose not to implement the recommended corrective action, Microsoft will continue to work with you in good faith to achieve service restoration, but the Service Restoration timer is paused and Microsoft will have no liability to you for losses resulting from your failure to implement the recommended corrective action.

Recommended actions are not limited to, but may include, software restart, reinstall, rollback to a previous version or changes to configuration which may include reversion of recent configuration changes.

In accordance with the Microsoft Security Policy and the data processing agreement (DPA), Microsoft personnel do not have standing access to your environment, AO5GC or any other Microsoft services deployed in your Azure tenant.  As such, you are responsible for taking all corrective actions in your environment.

The included Support Service does not include any hardware support service, any Return Material Authorization (RMA) service or any provision for sourcing replacement hardware.  It is your responsibility to separately purchase any hardware support service, RMA service or replacement hardware that may be required.

Microsoft will provide, on request, a Root Cause Analysis (RCA) for Sev1/A (Critical) and Sev B (Major) incidents related to faults in AO5GC software.  In order to complete the RCA, Microsoft may request that you gather and provide diagnostic data from both Microsoft and any related third-party applications as applicable (such as log files, network traces, or other diagnostic output).

### Escalation management

If the resolution of a technical problem does not progress to your satisfaction, you should in the first instance discuss the issue in detail with the Technical Customer Lead to understand what escalation has taken place within Microsoft.

If you are not satisfied with the progress and steps detailed by the Technical Customer Lead, you should contact your named Technical Service Manager.

If you continue to be unsatisfied with progress, you can request an escalation matrix from the Technical Service Manager.  The escalation matrix includes contact details for the Regional Support Director and the Worldwide Support Leader responsible for AO5GC Support.

## Prerequisites and assumptions

The AO5GC Support SLA requires you to maintain a Unified Enterprise support agreement and in addition to the prerequisites and assumptions outlined in your USSD, delivery of the support service outlined in this Exhibit is based on the following pre-requisites and assumptions:

### General terms

Your right to receive support services as described in this Exhibit, is subject to your compliance with the terms and conditions in the USSD, and this Exhibit.

Our performance of the support services in this Exhibit is dependent on your cooperation, active participation, and timely completion of assigned responsibilities.

The support services are intended to support your use of the Identified Products and Online Services in your environment. We will only provide these services for your internal business purposes. We will not provide these services to your end customers.

_Unless expressly agreed otherwise in writing, all support under this Exhibit will be provided in English._

Local business hours are as defined in your Unified Enterprise support agreement.

Delivery will be remote unless otherwise agreed in writing. Where onsite visits are mutually agreed upon and not pre-paid, Microsoft will bill the customer for reasonable travel and living expenses.

Some problems may occur only briefly and / or infrequently.  In the event Microsoft does not have sufficient information to reproduce or diagnose such a problem, we shall mutually agree a plan to capture sufficient diagnostics upon the next occurrence of the issue to progress the resolution of the problem.

If you deploy a device that interacts with the AO5GC service, you should raise any interoperability issues in the first instance with the supplier of the device who should then take the lead in reproducing, diagnosing and fixing the problem.

### Onboarding and implementation audit

To ensure high availability of service to your end-users and to enable rapid service restoration, all instances of AO5GC must be deployed in a high availability configuration that adheres to Microsoft’s published best practice guidance.  The Service Restore target time does not apply if the AO5GC instances are deployed in a non-redundant (singleton) mode.

To enable Microsoft to meet the commitments in this Exhibit, each instance of AO5GC must go through an onboarding process in which you provide necessary information about the deployment to Microsoft.  In addition, Microsoft will perform an audit (at no additional charge) to validate that the implementation meets Microsoft’s best practice guidance. Microsoft’s performance of the audit is dependent on your cooperation, active participation, and timely completion of assigned responsibilities.  If the audit reveals items of non-compliance, you must address these items before the deployment is eligible for the support services under this AO5GC support SLA, unless we mutually agree an alternative mitigation plan.

### Diagnostics and access

You must have administrative privileges and the rights and ability to access all systems and functions of the end-to-end service, not just the AO5GC instances, including the ability to make configuration changes and/or restart other services as may be needed to restore service or resolve the issue.

If requested and advised by Microsoft, you should enable Microsoft-provided diagnostic capabilities to enable data gathering and capture to assist with troubleshooting.  If you choose not to  enable these capabilities, Microsoft is not bound to the Service Restoration, Problem  Resolution, or RCA commitments and Microsoft will have no liability to you for losses resulting from your failure to enable Microsoft-provided diagnostic capabilities.

You will involve and manage the providers of other network components and functions when requested by Microsoft.  If you do not do so, Microsoft is not bound to the Service Restoration, Problem  Resolution and Microsoft will have no liability to you for losses resulting from your failure to do so.

### Network Functions Virtualization Infrastructure (NFVI) issues

AO5GC is a telecommunications workload that enables you to offer services to consumer and enterprise end-users.  These workloads run on an NFVI layer and may depend on other NFVI services.  The NFVI layer may comprise Cloud NFVI functions (for example, running in Azure Public Cloud) and Edge NFVI functions (for example running on Azure Operator Nexus).  The related services that AO5GC services may depend on in either Cloud NFVI or Edge NFVI are documented in the table below, which may be updated from time to time by Microsoft.

If the root cause of an issue is with a Cloud NFVI or Edge NFVI function, Microsoft will continue to work with you in good faith and with urgency to achieve service restoration, but the Service Restoration and Problem Resolution commitments do not apply.   Instead, the Support SLA relevant to the relevant service will apply.

#### Cloud NFVI services

Azure Cloud NFVi services include:

- **Azure Kubernetes Service (AKS)** provides a managed environment for running AO5GC containerized applications.
- **Azure Virtual Network (VNet)** provides a secure and isolated network for AO5GC components and traffic.
- **Azure Internal Load balancer** provides load balancing of traffic into the virtual network hosting AO5GC functions.
- **Azure ExpressRoute** provides a dedicated and private connection between the operator's network and Azure.
- **Azure Arc:** Provides a unified management and governance platform for AO5GC applications and services across Azure and on-premises environments.
- **Azure Monitor** provides a comprehensive solution for monitoring the performance and health of AO5GC applications and services.
- **Azure Active Directory (AAD)** provides identity and access management for AO5GC users and administrators.
- **Azure Key Vault** provides a secure and centralized store for managing encryption keys and secrets for AO5GC.
- **Azure VPN Gateway** is a service virtual network gateway used to send encrypted traffic between an Azure virtual network and on-premises locations.
- **Azure Bastion** provides secure and seamless remote access via Remote Desktop Protocol (RDP) and SSH to access Azures virtual machines (VMs) without any exposure through public IP addresses.
- **Azure DNS** provides name resolution by using Microsoft Azure infrastructure.
- **Azure Storage** offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud.
- **Azure Container Registry** is a private registry service for building, storing, and managing container images and related artifacts.

#### Edge NFVI services

Azure Edge NFVi services include:

- **Azure Operator Nexus:** Azure Operator Nexus is a carrier-grade, next-generation hybrid cloud platform for telecommunication operators. Azure Operator Nexus is purpose-built for operators' network-intensive workloads and mission-critical applications.
- Any additional hardware and services Azure Operator Nexus may depend on.
- **Azure Arc** provides a unified management and governance platform for AO5GC applications and services across Azure and on-premises environments.
- **Azure Monitor** provides a comprehensive solution for monitoring the performance and health of AO5GC applications and services across Azure and on-premises environments.
- **Azure Active Directory (AAD)** provides identity and access management for AO5GC users and administrators across Azure and on-premises environments.
- **Azure Key Vault** provides a secure and centralized store for managing encryption keys and secrets for AO5GC across Azure and on-premises environments.
