---
title: Security Best Practices for Deploying Azure Migrate Appliance.
description: Learn the top security best practices for deploying the Azure Migrate appliance. This guide covers tips on resource group isolation, RBAC, and securing your Azure Migrate project to ensure a safe and efficient migration process.
author: molishv
ms.author: molir
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/13/2025
monikerRange: migrate
ms.custom:
  - build-2025
# Customer intent: As a cloud migration specialist, I want to implement security best practices for deploying the migration appliance, so that I can ensure a secure and efficient migration process while protecting sensitive data.
---

# Appliance-Security best practices to deploy Azure Migrate Appliance

[Azure Migrate](./migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and non-Microsoft independent software vendor (ISV) offerings.

This article summarizes the best security practices when deploying the Azure Migrate appliance. 
Ensure you follow these best practices to ensure security.

## Use a dedicated Resource Group for Azure Migrate project

Set up a dedicated resource group for your Azure Migrate project. This helps in isolating resources, assigning RBAC (Role-based access control), and cleaning up Azure migrate resources.  

### Choose the right stack of Migrate Appliance

- To discover the VMware estate, we recommend using the VMware appliance that supports agentless dependency analysis. The same appliance can be used for agentless migration. 

- To discover the Hyper-V estate, we recommend using Hyper-V appliance that supports agentless dependency analysis, and the same appliance can be used for migration but it requires agent installation at Hyper-V hosts.  

- To discover physical, AWS, and GCP servers, we recommend using physical stack of appliance that also supports agentless dependency analysis. For migration, a secondary replication appliance is required, and agents should be installed on the target machines.  

**Use a dedicated Server for Azure Migrate appliance** - To avoid conflicts with other components, deploy the Azure Migrate appliance on a dedicated server. No other applications should be installed on the Migrate appliance server. 

## Networking best practices

Follow these networking best practices.

- **Limit outbound connectivity** - Azure Migrate appliance requires outbound connectivity on selective network endpoints. If you have configured firewall or Proxy Server on-premises, restrict the outbound connection on the appliance by allowlisting only the [required URLs](https://aka.ms/Migrateapplianceurls).  

- **Use Azure Private Link** - Implement Azure Private Link to discover, assess, and migrate servers over a private network. This ensures that traffic remains within the Azure backbone network and doesn’t traverse the public internet. [Learn more](how-to-use-azure-migrate-with-private-endpoints.md) 

- **Limit port access** - Appliance communicates with vCenter server over TCP port 443 by default (customizable), with Hyper-V hosts over WinRM port 5986/5985 and Linux servers over TCP port 22. The appliance server sends the collected metadata to Azure Migrate: Discovery and assessment, and Migration and modernization tools over SSL port 443. 

## OS Image hardening best practices

We recommend joining the appliance machine to the domain.  

- The Migrate appliance can be deployed on the supported version of Windows Servers either using a PowerShell installation script or OVA/VHD template.  

- **Security baseline** - We recommend hardening the OS image of Migrate appliance using [security baselines](/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines). Download the [security compliance toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=55319) to apply security baselines on Migrate Appliance machine. Using the toolkit, administrators can compare their current GPOs with Microsoft-recommended GPO baselines or other baselines, edit them, store them in GPO backup file format, and apply them via a domain controller or inject them directly into testbed hosts to test their effects.  

## Credentials handling best practices

- Depending on the workloads that you discover, we recommend using least privileged credentials specifically for the scenarios you plan to use Azure Migrate Appliance for.
- All the credentials provided on the appliance configuration manager are stored locally on the appliance server and not sent to Azure. 
- The credentials stored on the appliance server are encrypted using secure Data Protection API (DPAPI) protocol. 
- We recommend using domain account to reduce the total number of accounts required for discovery. This approach reduces the operational overhead in managing multiple user accounts and builds agility to update the credentials in the event of a security breach.  

## Identity and access management best practices 

- To access the appliance configuration manager locally or remotely, you need to have a local or domain user account with administrative privileges on the appliance server. Administrative access to the Appliance machine should be restricted to privileged users.  

## Vulnerability protection best practices

- The Auto-update service is enabled by default on Appliance server to automatically patch all Azure Migrate related components. Any vulnerabilities reported on the Migrate appliance are addressed through an agent update. We recommend keeping the Auto-update service enabled always to ensure the appliance remains secure. Additionally, regularly patch the Windows Server to keep the OS layer secure.  

## Next steps
- [Learn more](migrate-appliance.md) about the Migrate appliance.
- Deploy an [Azure Migrate appliance](./migrate-appliance-architecture.md) using a [PowerShell script](deploy-appliance-script.md).