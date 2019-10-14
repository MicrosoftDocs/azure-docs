---
title: Discover applications installed on on-premises servers using Azure Migrate: Server Assessment
description: Describes how to discover applications installed, and roles and features enabled on on-premises servers
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: article
ms.date: 10/10/2019
ms.author: snehaa
---

# Discover applications, roles, and features with Azure Migrate Server Assessment

This article describes how to discover applications installed on on-premises servers using Azure Migrate: Server Assessment.

Discovery of application inventory allows you to identify the applications running on your on-premises environment and decide a migration path that suits the requirements of the on-premises workloads. The discovery of applications is done in an agent-less manner by using guest credentials of servers and remotely accessing the servers via WMI and SSH calls.

> [!NOTE]
> This feature is currently supported for VMware VMs only. Additionally, the feature allows to discover installed applications, but no application specific assessment is done in Azure Migrate: Server Assessment. Server Assessment assesses on-premises servers from a lift-and-shift perspective.

## Support matrix

**Support** | **Details**
--- | ---
Hypervisor support | VMware
Operating system of servers | All Windows and Linux versions
Number of credentials supported | One credential for all Windows servers and one credential for all Linux servers.
Number of servers | 10000 per appliance and 35000 per project

## Before you start

- Make sure you've [created](how-to-add-tool-first-time.md) an Azure Migrate project.
- If you've already created a project, make sure you've [added](how-to-assess.md) the Azure Migrate: Server Assessment tool.
- Ensure that you have reviewed and completed the [prerequisites](https://docs.microsoft.com/azure/migrate/tutorial-prepare-vmware) for discovery of on-premises VMWare servers.
- Make sure you have a user account (one each for Windows and Linux servers) that has administrator permissions on the on-premises servers for which you want to discover the installed applications, roles, and features.

## Discover the on-premises servers

You can discover the on-premises VMware VMs using the Azure Migrate appliance.

- [Deploy the VMware appliance](how-to-set-up-appliance-vmware.md) to start discovery of the on-premises environment and their applications.
- In the last step, where you provide the vCenter Server details, ensure that you have added the credentials to access the on-premises VMware VMs. You can add one credential for all Windows servers and one credential for all Linux servers.

Once you have deployed the appliance, provided guest credentials to start the discovery, the appliance starts the discovery of configuration, performance data of on-premises VMs along with discovery of installed applications. The duration
to discover the applications depends on the number of VMs in the environment, it typically takes an hour for discovery of applications for 500 VMs.

## Review and export application inventory

Once the discovery is completed, you can go back to the Azure Migrate portal and review the discovered data.

Download and install the agents on each on-premises machine that you want to visualize with dependency mapping.

1. Go to the Azure Migrate dashboard in Azure portal.
2. In **Azure Migrate - Servers** page, on the **Azure Migrate: Server Assessment** tile, click the icon that displays the count for **Discovered servers**.
3. In the **Discovered servers** page, you will see the list of servers discovered from the on-premises environment.
4. To review the application details per server, in the **Discovered applications** column, click the count that displays the number of applications on the server.

> [!NOTE]
> The option to view application details will only show up if you have provided guest credentials in the appliance and have waited for few hours for the application discovery to complete.

5. To export the application inventory across all the servers, click the gesture **Export application inventory** on the page. This will download the application inventory in an excel format. The first sheet in the excel report, **Application Inventory** lists all the applications discovered across all virtual machines. The roles and features available  

## Next steps

[Create an assessment](how-to-create-assessment.md) for lift and shift migration of the discovered servers.
Assess a SQL Server databases using [Azure Migrate: Database Assessment](https://docs.microsoft.com/sql/dma/dma-assess-sql-data-estate-to-sqldb?view=sql-server-2017).
