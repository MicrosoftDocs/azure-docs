---
title: Security Best Practices for Deploying an Appliance
description: Learn the top security best practices for deploying the Azure Migrate appliance and experiencing a safe and efficient migration process.
author: molishv
ms.author: molir
ms.service: azure-migrate
ms.topic: best-practice
ms.date: 05/13/2025
ms.reviewer: v-uhabiba
ms.custom:
  - build-2025
# Customer intent: As a cloud migration specialist, I want to implement security best practices for deploying the migration appliance, so that I can experience a secure and efficient migration process while protecting sensitive data.
---

# Security best practices for deploying the Azure Migrate appliance

[Azure Migrate](./migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure.

This article summarizes the best practices to follow when you're deploying the Azure Migrate appliance. These best practices help ensure the security of your migration.

## Resource group

Set up a dedicated resource group for your Azure Migrate project. This practice helps in isolating resources, assigning role-based access control (RBAC), and cleaning up Azure Migrate resources.

## Server

To avoid conflicts with other components, deploy the Azure Migrate appliance on a dedicated server. No other applications should be installed on the Azure Migrate appliance server.

## Appliance type

To choose the right type of the Azure Migrate appliance, follow these best practices:

- To discover the VMware estate, use the VMware appliance that supports agentless dependency analysis. You can use the same appliance for agentless migration.

- To discover the Hyper-V estate, use the Hyper-V appliance that supports agentless dependency analysis. You can use the same appliance for migration, but it requires agent installation at Hyper-V hosts.  

- To discover physical, AWS, and GCP servers, use a physical type of the appliance that also supports agentless dependency analysis. For migration, a secondary replication appliance is required, and agents should be installed on the target machines.

## Network

Follow these best practices for networks:

- **Limit outbound connectivity**: The Azure Migrate appliance requires outbound connectivity on selected network endpoints. If you configured a firewall or proxy server on-premises, restrict the outbound connection on the appliance by allowlisting only the [required URLs](https://aka.ms/Migrateapplianceurls).  

- **Use Azure Private Link**: Implement Azure Private Link to discover, assess, and migrate servers over a private network. This practice ensures that traffic remains within the Azure backbone network and doesn't traverse the public internet. [Learn more](how-to-use-azure-migrate-with-private-endpoints.md).

- **Limit port access**: The appliance communicates with:

  - vCenter servers over TCP port 443 by default (customizable).
  - Hyper-V hosts over WinRM port 5986/5985.
  - Linux servers over TCP port 22.

  The appliance server sends the collected metadata to the Azure Migrate Discovery and Assessment tool and the Azure Migrate and Modernize tool over SSL port 443.

## OS image hardening

Follow these recommendations to harden OS images:

- Join the appliance machine to the domain.  

- Deploy the Azure Migrate appliance on the supported version of Windows Server by using either a PowerShell installation script or an OVA/VHD template.  

- Harden the OS image of the Azure Migrate appliance by using [security baselines](/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines). Download the [security compliance toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=55319) to apply security baselines on Azure Migrate appliance machines. By using the toolkit, administrators can:

  - Compare their current Group Policy objects (GPOs) with Microsoft-recommended GPO baselines or other baselines.
  - Edit their GPOs.
  - Store their GPOs in GPO backup file format.
  - Apply GPOs via a domain controller or inject them directly into testbed hosts to test their effects.

## Credentials

All the credentials provided on the appliance configuration manager are stored locally on the appliance server and not sent to Azure. The credentials stored on the appliance server are encrypted through the Data Protection API (DPAPI) protocol.

Follow these recommendations for handling credentials:

- Depending on the workloads that you discover, use least privileged credentials specifically for the scenarios that you plan to use the Azure Migrate appliance for.
- Use a domain account to reduce the total number of accounts required for discovery. This approach reduces the operational overhead in managing multiple user accounts. It also builds agility to update the credentials in the event of a security breach.  

## Identity and access management

To access the appliance configuration manager locally or remotely, you need to have a local or domain user account with administrative privileges on the appliance server. Administrative access to the appliance machine should be restricted to privileged users.  

## Vulnerability protection

The auto-update service is enabled by default on the appliance server to automatically patch all components related to Azure Migrate. Any vulnerabilities reported on the Azure Migrate appliance are addressed through an agent update.

To help protect against vulnerabilities, follow these recommendations:

- Always keep the auto-update service enabled to help ensure that the appliance remains secure.
- Regularly patch Windows Server to help keep the OS layer secure.  

## Related content

- [Learn more](migrate-appliance.md) about the Azure Migrate appliance.
- Deploy an [Azure Migrate appliance](./migrate-appliance-architecture.md) by using a [PowerShell script](deploy-appliance-script.md).
