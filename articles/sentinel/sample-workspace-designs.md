---
title: Sample Microsoft Sentinel workspace designs
description: Learn from samples of Microsoft Sentinel architecture designs with multiple tenants, clouds or regions.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 08/27/2024

#Customer intent: As a security architect, I want to design an optimal workspace architecture for multi-tenant and multi-region environments so that I can ensure compliance, cost efficiency, and effective data segregation.

---

# Sample Log Analytics workspace designs for Microsoft Sentinel

This article describes suggested Log Analytics workspace designs for organizations with the following sample requirements:

- Multiple tenants and regions, with European Data Sovereignty requirements
- Single tenant with multiple clouds
- Multiple tenants, with multiple regions and centralized security

For more information, see [Design a Log Analytics workspace architecture](/azure/azure-monitor/logs/workspace-design?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json).

This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Sample 1: Multiple tenants and regions

The Contoso Corporation is a multinational business with headquarters in London. Contoso has offices around the world, with important hubs in New York City and Tokyo. Recently, Contoso has migrated their productivity suite to Office 365, with many workloads migrated to Azure.

### Contoso tenants

Due to an acquisition several years ago, Contoso has two Microsoft Entra tenants: `contoso.onmicrosoft.com` and `wingtip.onmicrosoft.com`. Each tenant has its own Office 365 instance and multiple Azure subscriptions, as shown in the following image:

:::image type="content" source="media/best-practices/contoso-tenants.png" alt-text="Diagram of Contoso tenants, each with separate sets of subscriptions." border="false" lightbox="media/best-practices/contoso-tenants.png":::

### Contoso compliance and regional deployment

Contoso currently has Azure resources hosted in three different regions: US East, EU North, and West Japan, and strict requirement to keep all data generated in Europe within Europe regions.

Both of Contoso's Microsoft Entra tenants have resources in all three regions: US East, EU North, and West Japan

### Contoso resource types and collection requirements

Contoso needs to collect events from the following data sources:

-	Office 365
-	Microsoft Entra sign-in and audit logs
-	Azure Activity
-	Windows Security Events, from both on-premises and Azure VM sources
-	Syslog, from both on-premises and Azure VM sources
-	CEF, from multiple on-premises networking devices, such as Palo Alto, Cisco ASA, and Cisco Meraki
-	Multiple Azure PaaS resources, such as Azure Firewall, AKS, Key Vault, Azure Storage, and Azure SQL
-	Cisco Umbrella

Azure VMs are mostly located in the EU North region, with only a few in US East and West Japan. Contoso uses Microsoft Defender for servers on all their Azure VMs.

Contoso expects to ingest around 300 GB/day from all of their data sources.

### Contoso access requirements

Contoso’s Azure environment already has a single existing Log Analytics workspace used by the Operations team to monitor the infrastructure. This workspace is located in Contoso Microsoft Entra tenant, within EU North region, and is being used to collect logs from Azure VMs in all regions. They currently ingest around 50 GB/day.

The Contoso Operations team needs to have access to all the logs that they currently have in the workspace, which include several data types not needed by the SOC, such as **Perf**, **InsightsMetrics**, **ContainerLog**, and more. The Operations team must *not* have access to the new logs that are collected in Microsoft Sentinel.

### Contoso's solution

Constoso's solution includes the following considerations:

- Contoso already has an existing workspace, and they'd like to explore enabling Microsoft Sentinel in that same workspace.
- Contoso has [regulatory requirements](/azure/azure-monitor/logs/workspace-design#azure-regions), so we need at least one Log Analytics workspace enabled for Microsoft Sentinel in Europe.
- Most of Contoso's VMs are the EU North region, where they already have a workspace. Therefore, in this case, bandwidth costs aren't a concern.
- Contoso has [two different Microsoft Entra tenants](/azure/azure-monitor/logs/workspace-design#multiple-tenant-strategies), and collects from tenant-level data sources, like Office 365 and Microsoft Entra sign-in and audit logs, and we need at least one workspace per tenant.
- Contoso does need to collect [non-SOC data](/azure/azure-monitor/logs/workspace-design#operational-and-security-data), although there isn't any overlap between SOC and non-SOC data. Also, SOC data accounts for approximately 250 GB/day, so they should use separate workspaces for the sake of cost efficiency.
- Contoso has a single SOC team that will be using Microsoft Sentinel, so no extra separation is needed.
- All members of Contoso's SOC team will have access to all the data, so no extra separation is needed.

The resulting workspace design for Contoso is illustrated in the following image:

:::image type="content" source="media/best-practices/contoso-solution.png" alt-text="Diagram of Contoso's solution, with a separate workspace for the Ops team." border="false" lightbox="media/best-practices/contoso-solution.png":::

The suggested solution includes:

- A separate Log Analytics workspace for the Contoso Operations team. This workspace will only contain data that's not needed by Contoso’s SOC team, such as the **Perf**, **InsightsMetrics**, or **ContainerLog** tables.
- Two Log Analytics workspaces enabled for Microsoft Sentinel, one in each Microsoft Entra tenant, to ingest data from Office 365, Azure Activity, Microsoft Entra ID, and all Azure PaaS services.
- All other data, coming from on-premises data sources, can be routed to one of the two workspaces.


## Sample 2: Single tenant with multiple clouds

Fabrikam is an organization with headquarters in New York City and offices all around the United States. Fabrikam is starting their cloud journey, and still needs to deploy their first Azure landing zone and migrate their first workloads. Fabrikam already has some workloads on AWS, which they intend to monitor using Microsoft Sentinel.

### Fabrikam tenancy requirements

Fabrikam has a single Microsoft Entra tenant.

### Fabrikam compliance and regional deployment

Fabrikam has no compliance requirements. Fabrikam has resources in several Azure regions located in the US, but bandwidth costs across regions aren't a major concern.

### Fabrikam resource types and collection requirements

Fabrikam needs to collect events from the following data sources:

-	Microsoft Entra sign-in and audit logs
-	Azure Activity
-	Security Events, from both on-premises and Azure VM sources
-	Windows Events, from both on-premises and Azure VM sources
-	Performance data, from both on-premises and Azure VM sources
-	AWS CloudTrail
-	AKS audit and performance logs

### Fabrikam access requirements

The Fabrikam Operations team needs to access:

-	Security events and Windows events, from both on-premises and Azure VM sources
-	Performance data, from both on-premises and Azure VM sources
-	AKS performance (Container Insights) and audit logs
-	All Azure Activity data

The Fabrikam SOC team needs to access:
-	Microsoft Entra sign-in and audit logs
-	All Azure Activity data
-	Security events, from both on-premises and Azure VM sources
-	AWS CloudTrail logs
-	AKS audit logs
-	The full Microsoft Sentinel portal

### Fabrikam's solution

Fabrikam's solution includes the following considerations:

- Fabrikam has no existing workspace, so they'll automatically need a new workspace.

- Fabrikam has no regulatory requirements that requires them to keep data separate.

- Fabrikam has a single-tenant environment, and wouldn't need separate workspaces per tenant.

- However, Fabrikam will need separate workspaces for their [SOC and Operations teams](/azure/azure-monitor/logs/workspace-design#operational-and-security-data).

    The Fabrikam Operations team needs to collect performance data, from both VMs and AKS. Since AKS is based on diagnostic settings, they can select specific logs to send to specific workspaces. Fabrikam can choose to send AKS audit logs to the Log Analytics workspace enabled for Microsoft Sentinel, and all AKS logs to a separate workspace, where Microsoft Sentinel isn't enabled. In the workspace where Microsoft Sentinel isn't enabled, Fabrikam will enable the Container Insights solution.

    For Windows VMs, Fabrikam can use the [Azure Monitoring Agent (AMA)](connect-windows-security-events.md#connector-options) to split the logs, sending security events to the workspace, and performance and Windows events to the workspace without Microsoft Sentinel.

    Fabrikam chooses to consider their overlapping data, such as security events and Azure activity events, as SOC data only, and sends this data to the workspace with Microsoft Sentinel.

- Fabrikam needs to control access for overlapping data, including security events and Azure activity events, but there's no row-level requirement. Since security events and Azure activity events aren't custom logs, Fabrikam can use [table-level RBAC](/azure/azure-monitor/logs/workspace-design#data-access-control) to grant access to these two tables for the Operations team.

The resulting workspace design for Fabrikam is illustrated in the following image, including only key log sources for the sake of design simplicity:

:::image type="content" source="media/best-practices/fabrikam-solution.png" alt-text="Diagram of Fabrikam's solution, with a separate workspace for the Ops team." border="false" lightbox="media/best-practices/fabrikam-solution.png":::

The suggested solution includes:

- **Two separate workspaces in the US region**: one for the SOC team with Microsoft Sentinel enabled, and another for the Operations team, without Microsoft Sentinel.
- **The [Azure Monitoring Agent (AMA)](connect-windows-security-events.md#connector-options)**, used to determine which logs are sent to each workspace from Azure and on-premises VMs.
- **Diagnostic settings**, used to determine which logs are sent to each workspace from Azure resources such as AKS.
- **Overlapping data being sent to the Log Analytics workspace enabled for Microsoft Sentinel**, with table-level RBAC to grant access to the Operations team as needed.

## Sample 3: Multiple tenants and regions and centralized security

Adventure Works is a multinational company with headquarters in Tokyo. Adventure Works has 10 different sub-entities, based in different countries/regions around the world.

Adventure Works is Microsoft 365 E5 customer, and already has workloads in Azure.

### Adventure Works tenancy requirements

Adventure Works has three different Microsoft Entra tenants, one for each of the continents where they have sub-entities: Asia, Europe, and Africa. The different sub-entities' countries/regions have their identities in the tenant of the continent they belong to. For example, Japanese users are in the *Asia* tenant, German users are in the *Europe* tenant and Egyptian users are in the *Africa* tenant.

### Adventure Works compliance and regional requirements

Adventure Works currently uses three Azure regions, each aligned with the continent in which the sub-entities reside. Adventure Works doesn't have strict compliance requirements.

### Adventure Works resource types and collection requirements

Adventure Works needs to collect the following data sources for each sub-entity:

-	Microsoft Entra sign-in and audit logs
-	Office 365 logs
-	Microsoft Defender XDR for Endpoint raw logs
-	Azure Activity
-	Microsoft Defender for Cloud
-	Azure PaaS resources, such as from Azure Firewall, Azure Storage, Azure SQL, and Azure WAF
-	Security and windows Events from Azure VMs
-	CEF logs from on-premises network devices

Azure VMs are scattered across the three continents, but bandwidth costs aren't a concern.

### Adventure Works access requirements

Adventure Works has a single, centralized SOC team that oversees security operations for all the different sub-entities.

Adventure Works also has three independent SOC teams, one for each of the continents. Each continent's SOC team should be able to access [only the data generated within its region](/azure/azure-monitor/logs/workspace-design#azure-regions), without seeing data from other continents. For example, the Asia SOC team should only access data from Azure resources deployed in Asia, Microsoft Entra Sign-ins from the Asia tenant, and Defender for Endpoint logs from it’s the Asia tenant.

Each continent's SOC team needs to access the full Microsoft Sentinel portal experience.

Adventure Works’ Operations team runs independently, and has its own workspaces without Microsoft Sentinel.

### Adventure Works solution

The Adventure Works solution includes the following considerations:

- The Adventure Works' Operations team already has its own workspaces, so there's no need to create a new one.

- Adventure Works has no regulatory requirements that requires them to keep data separate.

- Adventure Works has three Microsoft Entra tenants, and needs to collect tenant-level data sources, such as Office 365 logs. Therefore, Adventure Works should create at least one Log Analytics workspace enabled for Microsoft Sentinel in each tenant.

- While all data considered in this decision will be used by the Adventure Works SOC team, they do need to segregate data by ownership, as each SOC team needs to access only data that is relevant to that team. Each SOC team also needs access to the full Microsoft Sentinel portal. Adventure Works doesn't need to control data access by table.

The resulting workspace design for Adventure Works is illustrated in the following image, including only key log sources for the sake of design simplicity:

:::image type="content" source="media/best-practices/adventure-works-solution.png" alt-text="Diagram of Adventure Works's solution, with separate workspaces for each Azure AD tenant." border="false" lightbox="media/best-practices/adventure-works-solution.png":::

The suggested solution includes:

- A separate Log Analytics workspace enabled for Microsoft Sentinel for each Microsoft Entra tenant. Each workspace collects data related to its tenant for all data sources.
- Each continent's SOC team has access only to the workspace in its own tenant, ensuring that only logs generated within the tenant boundary are accessible by each SOC team.
- The central SOC team can still operate from a separate Microsoft Entra tenant, using Azure Lighthouse to access each of the different Microsoft Sentinel environments. If there's no other tenant, the central SOC team can still use Azure Lighthouse to access the remote workspaces.
- The central SOC team can also create another workspace if it needs to store artifacts that remain hidden from the continent SOC teams, or if it wants to ingest other data that isn't relevant to the continent SOC teams.

## Next steps

In this article, you reviewed a set of suggested workspace designs for organizations.

> [!div class="nextstepaction"]
>>[Prepare for multiple workspaces](prepare-multiple-workspaces.md)
