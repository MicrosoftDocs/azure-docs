---
title: Sample Azure Sentinel workspace designs | Microsoft Docs
description: Learn from samples of Azure Sentinel architecture designs with multiple tenants, clouds or regions.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 07/18/2021
---

# Azure Sentinel sample workspace designs

This article describes suggested workspace designs for organizations with the following sample requirements:

- Multiple-tenants and regions, with European Data Sovereignty requirements
- Single tenant with multiple clouds
- Multiple tenants, with multiple regions and centralized security

The samples in this article use the [Azure Sentinel workspace design decision tree](design-your-workspace-architecture.md) to determine the best workspace design for each organization. For more information, see [Azure Sentinel workspace architecture best practices](best-practices-workspace-architecture.md).

## Sample 1: Multiple tenants and regions

The Contoso Corporation is a multinational business with headquarters in London. Contoso has offices around the world, with important hubs in New York City and Tokyo. Recently, Contoso has migrated their productivity suite to Office 365, with many workloads migrated to Azure.

### Contoso tenants

Due to an acquisition several years ago, Contoso has two Azure AD tenants: `contoso.onmicrosoft.com` and `wingtip.onmicrosoft.com`. Each tenant has its own Office 365 instance and multiple Azure subscriptions, as shown in the following image:

:::image type="content" source="media/best-practices/contoso-tenants.png" alt-text="Diagram of Contoso tenants, each with separate sets of subscriptions." border="false":::

### Contoso compliance and regional deployment

Contoso currently has Azure resources hosted in three different regions: US East, EU North, and West Japan, and strict requirement to keep all data generated in Europe within Europe regions.

Both of Contoso's Azure AD tenants have resources in all three regions: US East, EU North, and West Japan

### Contoso resource types and collection requirements

Contoso needs to collect events from the following data sources:

-	Office 365
-	Azure AD Sign-in and Audit logs
-	Azure Activity
-	Windows Security Events, from both on-premises and Azure VM sources
-	Syslog, from both on-premises and Azure VM sources
-	CEF, from multiple on-premises networking devices, such as Palo Alto, Cisco ASA, and Cisco Meraki
-	Multiple Azure PaaS resources, such as Azure Firewall, AKS, Key Vault, Azure Storage, and Azure SQL
-	Cisco Umbrella

Azure VMs are mostly located in the EU North region, with only a few in US East and West Japan. Contoso uses Azure Defender for Servers on all their Azure VMs.

Contoso expects to ingest around 300 GB/day from all of their data sources.

### Contoso access requirements

Contoso’s Azure environment already has a single existing Log Analytics workspace used by the Operations team to monitor the infrastructure. This workspace is located in Contoso AAD tenant, within EU North region, and is being used to collect logs from Azure VMs in all regions. They currently ingest around 50 GB/day.

The Contoso Operations team needs to have access to all the logs that they currently have in the workspace, which include several data types not needed by the SOC, such as **Perf**, **InsightsMetrics**, **ContainerLog**, and more. The Operations team must *not* have access to the new logs that will be collected in Azure Sentinel.

### Contoso's solution

The following steps apply the [Azure Sentinel workspace design decision tree](design-your-workspace-architecture.md) to determine the best workspace design for Contoso:

1. Contoso already has an existing workspace, so we can explore enabling Azure Sentinel in that same workspace.

    Non-SOC data ingestion is less than 100 GB/day, so we can continue to [step 2](design-your-workspace-architecture.md#step-2-keeping-data-in-different-azure-geographies), and making sure to select the relevant option in [step 5](design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).

1.	Contoso has regulatory requirements, so we need at least one Azure Sentinel workspace in Europe.

1.	Contoso has two different Azure AD tenants, and collects from tenant-level data sources, like Office 365 and Azure AD Sign-in and Audit logs, so we need at least one workspace per tenant.

1.	Contoso does not need [charge-back](design-your-workspace-architecture.md#step-4-splitting-billing--charge-back), so we can continue with [step 5](design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).

1.	Contoso does need to collect non-SOC data, although there isn't any overlap between SOC and non-SOC data. Also, SOC data accounts for approximately 250 GB/day, so they should use separate workspaces for the sake of cost efficiency.

1.	The majority of Contoso's VMs are the EU North region, where they already have a workspace. Therefore, in this case, bandwidth costs are not a concern.

1.	Contoso has a single SOC team that will be using Azure Sentinel, so no extra separation is needed.

1.	All members of Contoso's SOC team will have access to all the data, so no extra separation is needed.

The resulting Azure Sentinel workspace design for Contoso is illustrated in the following image:

:::image type="content" source="media/best-practices/contoso-solution.png" alt-text="Diagram of Contoso's solution, with a separate workspace for the Ops team." border="false":::

The suggested solution includes:

- A separate Log Analytics workspace for the Contoso Operations team. This workspace will only contain data that's not needed by Contoso’s SOC team, such as the **Perf**, **InsightsMetrics**, or **ContainerLog** tables.

- Two Azure Sentinel workspaces, one in each Azure AD tenant, to ingest data from Office 365, Azure Activity, Azure AD, and all Azure PaaS services.

- All other data, coming from on-premises data sources, can be routed to one of the two Azure Sentinel workspaces.


## Sample 2: Single tenant with multiple clouds

Fabrikam is an organization with headquarters in New York City and offices all around the United States. Fabrikam is starting their cloud journey, and still needs to deploy their first Azure landing zone and migrate their first workloads. Fabrikam already has some workloads on AWS, which they intend to monitor using Azure Sentinel.

### Fabrikam tenancy requirements

Fabrikam has a single Azure AD tenant.

### Fabrikam compliance and regional deployment

Fabrikam has no compliance requirements. Fabrikam has resources in several Azure regions located in the US, but bandwidth costs across regions is not a major concern.

### Fabrikam resource types and collection requirements

Fabrikam needs to collect events from the following data sources:

-	Azure AD Sign-in and Audit logs
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
-	Azure AD Signin and Audit logs
-	All Azure Activity data
-	Security events, from both on-premises and Azure VM sources
-	AWS CloudTrail logs
-	AKS audit logs
-	The full Azure Sentinel portal

### Fabrikam's solution

The following steps apply the [Azure Sentinel workspace design decision tree](design-your-workspace-architecture.md) to determine the best workspace design for Fabrikam:

1.	Fabrikam has no existing workspace, so continue to [step 2](design-your-workspace-architecture.md#step-2-keeping-data-in-different-azure-geographies).

1.	Fabrikam has no regulatory requirements, so continue to [step 3](design-your-workspace-architecture.md#step-3-do-you-have-multiple-azure-tenants).

1.	Fabrikam has a single-tenant environment. so continue to [step 4](design-your-workspace-architecture.md#step-4-splitting-billing--charge-back).

1.	Fabrikam has no need to split up charges, so continue to [step 5](design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).

1.	Fabrikam will need separate workspaces for their SOC and Operations teams:

    The Fabrikam Operations team needs to collect performance data, from both VMs and AKS. Since AKS is based on diagnostic settings, they can select specific logs to send to specific workspaces. Fabrikam can choose to send AKS audit logs to the Azure Sentinel workspace, and all AKS logs to a separate workspace, where Azure Sentinel is not enabled. In the workspace where Azure Sentinel is not enabled, Fabrikam will enable the Container Insights solution.

    For Windows VMs, Fabrikam can use the [Azure Monitoring Agent (AMA)](connect-windows-security-events.md#connector-options) to split the logs, sending security events to the Azure Sentinel workspace, and performance and Windows events to the workspace without Azure Sentinel.

    Fabrikam chooses to consider their overlapping data, such as security events and Azure activity events, as SOC data only, and sends this data to the workspace with Azure Sentinel.

1.	Bandwidth costs are not a major concern for Fabrikam, so continue with [step 7](design-your-workspace-architecture.md#step-7-segregating-data-or-defining-boundaries-by-ownership).

1.	Fabrikam has already decided to use separate workspaces for the SOC and Operations teams. No further separation is needed.

1.	Fabrikam does need to control access for overlapping data, including security events and Azure activity events, but there is no row-level requirement.

    Neither security events nor Azure activity events are custom logs, so Fabrikam can use table-level RBAC to grant access to these two tables for the Operations team.

The resulting Azure Sentinel workspace design for Fabrikam is illustrated in the following image, including only key log sources for the sake of design simplicity:

:::image type="content" source="media/best-practices/fabrikam-solution.png" alt-text="Diagram of Fabrikam's solution, with a separate workspace for the Ops team." border="false" :::

The suggested solution includes:

- Two separate workspaces in the US region: one for the SOC team with Azure Sentinel enabled, and another for the Operations team, without Azure Sentinel.

- The [Azure Monitoring Agent (AMA)](connect-windows-security-events.md#connector-options), used to determine which logs are sent to each workspace from Azure and on-premises VMs.

- Diagnostic settings, used to determine which logs are sent to each workspace from Azure resources such as AKS.

- Overlapping data being sent to the Azure Sentinel workspace, with table-level RBAC to grant access to the Operations team as needed.

## Sample 3: Multiple tenants and regions and centralized security

Adventure Works is a multinational company with headquarters in Tokyo. Adventure Works has 10 different sub-entities ,based in different countries around the world.

Adventure Works is Microsoft 365 E5 customer, and already has workloads in Azure.

### Adventure Works tenancy requirements

Adventure Works has three different Azure AD tenants, one for each of the continents where they have sub-entities: Asia, Europe, and Africa. The different sub-entities' countries have their identities in the tenant of the continent they belong to. For example, Japanese users are in the *Asia* tenant, German users are in the *Europe* tenant and Egyptian users are in the *Africa* tenant.

### Adventure Works compliance and regional requirements

Adventure Works currently uses three Azure regions, each aligned with the continent in which the sub-entities reside. Adventure Works doesn't have strict compliance requirements.

### Adventure Works resource types and collection requirements

Adventure Works needs to collect the following data sources for each sub-entity:

-	Azure AD Sign-in and Audit logs
-	Office 365 logs
-	Microsoft 365 Defender for Endpoint raw logs
-	Azure Activity
-	Azure Defender
-	Azure PaaS resources, such as from Azure Firewall, Azure Storage, Azure SQL, and Azure WAF
-	Security and windows Events from Azure VMs
-	CEF logs from on-premises network devices

Azure VMs are scattered across the three continents, but bandwidth costs are not a concern.

### Adventure Works access requirements

Adventure Works has a single, centralized SOC team that oversees security operations for all the different sub-entities.

Adventure Works also has three independent SOC teams, one for each of the continents. Each continent's SOC team should be able to access only the data generated within its region, without seeing data from other continents. For example, the Asia SOC team should only access data from Azure resources deployed in Asia, AAD Sign-ins from the Asia tenant, and Defender for Endpoint logs from it’s the Asia tenant.

Each continent's SOC team needs to access the full Azure Sentinel portal experience.

Adventure Works’ Operations team runs independently, and has its own workspaces without Azure Sentinel.

### Adventure Works solution

The following steps apply the [Azure Sentinel workspace design decision tree](design-your-workspace-architecture.md) to determine the best workspace design for Adventure Works:

1.	Adventure Works' Operations team has it's own workspaces, so continue to [step 2](design-your-workspace-architecture.md#step-2-keeping-data-in-different-azure-geographies).

1.	Adventure Works has no regulatory requirements, so continue to [step 3](design-your-workspace-architecture.md#step-3-do-you-have-multiple-azure-tenants).

1.	Adventure Works has three Azure AD tenants, and needs to collect tenant-level data sources, such as Office 365 logs. Therefore, Adventure Works should create at least Azure Sentinel workspaces, one for each tenant.

1.	Adventure Works has no need to split up charges, so continue to [step 5](design-your-workspace-architecture.md#step-5-collecting-any-non-soc-data).

1.	Since Adventure Works' Operations team has its own workspaces, all data considered in this decision will be used by the Adventure Works SOC team.

1.	Bandwidth costs are not a major concern for Adventure Works, so continue with [step 7](design-your-workspace-architecture.md#step-7-segregating-data-or-defining-boundaries-by-ownership).

1.	Adventure Works does need to segregate data by ownership, as each content's SOC team needs to access only data that is relevant to that content. However, each continent's SOC team also needs access to the full Azure Sentinel portal.

1.	Adventure Works does not need to control data access by table.

The resulting Azure Sentinel workspace design for Adventure Works is illustrated in the following image, including only key log sources for the sake of design simplicity:

:::image type="content" source="media/best-practices/adventure-works-solution.png" alt-text="Diagram of Adventure Works's solution, with a separate workspaces for each Azure AD tenant." border="false":::

The suggested solution includes:

- A separate Azure Sentinel workspace for each Azure AD tenant. Each workspace collects data related to its tenant for all data sources.

- Each continent's SOC team has access only to the workspace in its own tenant, ensuring that only logs generated within the tenant boundary are accessible by each SOC team.

- The central SOC team can still operate from a separate Azure AD tenant, using Azure Lighthouse to access each of the different Azure Sentinel environments. If there is no additional tenant, the central SOC team can still use Azure Lighthouse to access the remote workspaces.

- The central SOC team can also create an additional workspace if it needs to store artifacts that remain hidden from the continent SOC teams, or if it wants to ingest other data that is not relevant to the continent SOC teams.



## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](get-visibility.md)