---
title: Managed Instance on App Service overview (preview)
description: Managed Instance on Azure App Service is a specialized hosting option that provides isolation, customization, and secure integration with Azure resources, ideal for legacy, and infrastructure-dependent web apps.
keywords: app service, azure app service, managed instance, isolation, vnet integration, registry, COM, RDP, installation scripts, key vault, pv4, pmv4, windows services, GAC, third-party dependencies
ms.topic: overview
ms.date: 01/09/2026
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
ms.custom: references_regions
---

# Managed Instance on Azure App Service (preview)

Managed Instance on Azure App Service (preview) is a plan‑scoped hosting option for Windows web apps that need Operating System (OS) customization, optional private networking, and secure integration with Azure resources. It targets legacy or infrastructure‑dependent workloads (Component Object Model (COM), registry, Microsoft/Windows Installer (MSI)) while retaining App Service’s managed patching, scaling, diagnostics, and identity features.

[!INCLUDE [managed-instance](./includes/managed-instance/preview-note.md)]

## Key capabilities

The following table summarizes the main capabilities that Managed Instance offers:

| Category | Capability |
|-----------|-------------|
| Network isolation | Plan-level virtual network integration (optional, can be added after creation):<br>• Private endpoints and custom routing<br>• Network Security Groups (NSG) support, NAT gateways, and route tables<br>• Private Domain Name Server (DNS) for internal name resolution |
| Compute isolation | • Plan-scoped isolation with full control over network boundaries<br>• Dedicated compute for predictable performance |
| Custom component support | PowerShell install scripts for:<br>• COM components<br>• Registry and persistent registry values<br>• Internet Information Services (IIS Server) configuration and ACLs<br>• MSI installers<br>• Non-Microsoft components and Windows services<br>• Global Assembly Cache (GAC) installations<br>• Windows features (MSMQ client, server roles)<br>• Custom frameworks (customer-managed patching) |
| Registry adapters | Azure Key Vault-backed registry keys for secure configuration |
| Storage flexibility | • Azure Files with Key Vault integration<br>• UNC paths and network share access<br>• Scripted drive mapping<br>• Local temporary storage (2 GB, non-persistent) |
| Managed identity | • System-assigned and user-assigned identities at the plan level<br>• Keyless authentication to Azure resources |
| Operational efficiency | Platform-managed load balancing, patching, and scaling:<br>• Horizontal autoscale (all instances)<br>• Vertical scale (Pv4/Pmv4 only) |
| Remote Desktop Protocol | • Just-in-time RDP via Azure Bastion (requires virtual network)<br>• Access to logs, Event Viewer, and IIS Manager |
| Security and authentication | • TLS and custom domains with certificate binding<br>• App Service Authentication with Microsoft Entra ID |
| Runtime support | • Preinstalled: .NET Framework 3.5, 4.8, and .NET 8<br>• Custom runtimes via install scripts |
| CI/CD integration | GitHub Actions, Azure DevOps, zip deploy, package deploy, run-from-package |

## Configuration options

Managed Instance provides plan-level configuration through:

- **Configuration (install) scripts**: Upload zipped PowerShell scripts to Azure Storage (accessed via managed identity). Scripts run at startup for persistent configuration.  
  - RDP session changes are temporary and lost after restart or platform maintenance.
  - Script execution logs appear in App Service console logs and can be streamed to Azure Monitor.

- **Windows registry adapters**: Define registry keys at the plan level with secret values stored in Azure Key Vault.

- **Storage mounts**: Map storage using custom drive letters with Azure Files or custom UNC paths. Local storage is also available, but limited to 2 GB and not persisted after restarts.

- **RDP access**: Just-in-time Remote Desktop via Azure Bastion (requires virtual network integration).

## Logging and troubleshooting

- Logs for Managed Instance are created at the App Service plan level and not the app level.
- Storage mount and registry adapter events are captured in App Service platform logs. These logs can be streamed via Logstream or integrated with Azure Monitor.
- Configuration (install) script logs are available in App Service console logs and on the instance (for example, C:\InstallScripts\<scriptName>\Install.log). Use Logstream or Azure Monitor for centralized access.
- RDP access requires Azure Bastion and virtual network integration. IIS Manager and Event Viewer are recommended for diagnostics.

## Choosing the Right Hosting Option

### Use Managed Instance when you need:

**Legacy Windows compatibility**
- COM components, registry modifications, and MSI installers
- IIS Manager access and RDP for diagnostics
- Network shares via UNC paths or drive mapping

**Migration with minimal refactoring**
- "Lift and improve" for legacy .NET Framework apps
- Gradual modernization without complete rewrites
- Plan-level network isolation for compliance requirements

**Windows-specific customization**
- PowerShell install scripts for startup configuration
- Windows features like MSMQ or server roles
- Custom non-Microsoft components in the GAC

### Use Standard App Service when you need:

**Modern, cloud-native development**
- Multi-language app support (Python, Node.js, Java, PHP, etc.)
- Linux or containerized workloads
- Platform-managed infrastructure without OS customization
- Broader runtime and framework options

### Use App Service Environment (ASE) when you need:

**Enterprise-scale isolation**
- Fully isolated, dedicated infrastructure
- Deployments supporting 100+ applications
- Complete network boundary control

## Current Limitations (Preview)

| Limitation | Details |
|-----------|---------|
| **Platform** | • Windows only (no Linux/containers)<br>• Not available in ASE |
| **SKUs** | Pv4 and Pmv4 only |
| **Regions** | East Asia, West Central US, North Europe, East US, Australia East |
| **Authentication** | Entra ID and Managed Identity only (no domain join/NTLM/Kerberos) |
| **Workloads** | Web apps only (no WebJobs, TCP/NetPipes) |
| **Configuration** | Persistent changes require scripts (RDP is diagnostics-only) |

## Best practices

- Use configuration scripts (install scripts) for persistent configuration.
- Centralize secrets using Key Vault.
- Validate logging setup in preview environments.
- Test configuration (install) scripts in staging before production rollout.
- Align network rules with dependency inventories.
- Monitor with Microsoft Defender for Cloud for threat detection.

## Next steps

- [Managed Instance Quickstart](quickstart-managed-instance.md)
- [App Service overview](overview.md)
- [Configure Managed Instance](configure-managed-instance.md)
- [App Service Environment comparison](./environment/overview.md)
