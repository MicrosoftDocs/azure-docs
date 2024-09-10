---
title: Security overview
description: Basic security information about Azure Arc-enabled servers.
ms.topic: overview
ms.date: 06/06/2024
---

# Security overview for Azure Arc-enabled servers

This article describes the security considerations and controls available when using Azure Arc-enabled servers. Whether you’re a security practitioner or IT operator, the information in this article let's you confidently configure Azure Arc in a way that meets your organization’s security requirements.

## Responsibilities

The security of your Azure Arc-enabled Servers deployment is a shared responsibility between you and Microsoft. Microsoft is responsible for:

- To secure the cloud service that stores system metadata and orchestrate operations for the agents you connect to the service.
- Securing and protecting the privacy of your system metadata stored in Azure.
- Documenting optional security features so you understand the benefits and drawbacks of deployment options.
- Publishing regular agent updates with security, quality, performance, and feature improvements.

You're responsible for:

- Managing and monitoring RBAC access to your Azure Arc-enabled resources in your Azure subscription.
- Protecting and regularly rotating the credentials of any accounts used to manage Azure Arc-enabled servers. This includes any service principal secrets or credentials used to onboard new servers.
- Determining if and how any security features described in this document (for example, extension allowlists) should be applied to the Azure Connected Machine agents you deploy.
- Keeping the Azure Connected Machine agent and extensions up-to-date.
- Determining Azure Arc’s compliance with your organization’s legal, and regulatory, and internal policy obligations.
- Securing the server itself, including the compute, storage, and networking infrastructure used to run the server.

## Architecture overview

Azure Arc-enabled servers is an agent-based service. Your interaction with Azure Arc is primarily through Azure’s APIs, portal, and management experiences. The data you see and actions you take in Azure are relayed via the Azure Connected Machine agent installed on each managed server. Azure is the source of truth for the agent. The only way to tell the agent to do something (for example, install an extension) is to take an action on the Azure representation of the server. This helps ensure that your organization’s RBAC and policy assignments can evaluate the request before any changes are made.

The Azure Connected Machine agent is primarily an enablement platform for other Azure and third-party services. Its core functionalities include:

-	Establishing a relationship between your machine and your Azure subscription
-	Providing a managed identity for the agent and other apps to use when authenticating with Azure
-	Enabling other capabilities (agents, scripts) with extensions
-	Evaluating and enforcing settings on your server

Once the Azure Connected Machine agent is installed, you can enable other Azure services on your server to meet your monitoring, patch management, remote access, or other needs. Azure Arc’s role is to help enable those services to work outside of Azure’s own datacenters.

You can use Azure Policy to limit what your organization’s users can do with Azure Arc. Cloud-based restrictions like Azure Policy are a great way to apply security controls at-scale while retaining flexibility to adjust the restrictions at any time. However, sometimes you need even stronger controls to protect against a legitimately privileged account being used to circumvent security measures (for example, disabling policies). To account for this, the Azure Connected Machine agent also has security controls of its own that take precedence over any restrictions set in the cloud.

:::image type="content" source="media/security-basics/connected-machine-agent-architecuture.png" alt-text="Architecure diagram describing how the Azure Connected Machine agent functions." lightbox="media/security-basics/connected-machine-agent-architecuture.png":::

## Agent services

The Azure Connected Machine agent is a combination of four services/daemons that run on your server and help connect it with Azure. They're installed together as a single application and are managed centrally using the azcmagent command line interface.

### Hybrid Instance Metadata Service

The Hybrid Instance Metadata Service (HIMDS) is the “core” service in the agent and is responsible for registering the server with Azure, ongoing metadata synchronization (heartbeats), managed identity operations, and hosting the local REST API which other apps can query to learn about the device’s connection with Azure. This service is unprivileged and runs as a virtual account (NT SERVICE\himds with SID S-1-5-80-4215458991-2034252225-2287069555-1155419622-2701885083) on Windows or a standard user account (himds) on Linux operating systems.

### Extension manager

The extension manager is responsible for installing, configuring, upgrading, and removing additional software on your machine. Out of the box, Azure Arc doesn’t know how to do things like monitor or patch your machine. Instead, when you choose to use those features, the extension manager downloads and enables those capabilities. The extension manager runs as Local System on Windows and root on Linux because the software it installs may require full system access. You can limit which extensions the extension manager is allowed to install or disable it entirely if you don’t intend to use extensions.

### Guest configuration

The guest configuration service evaluates and enforces Azure machine (guest) configuration policies on your server. These are special Azure policies written in PowerShell Desired State Configuration to check software settings on a server. The guest configuration service regularly evaluates and reports on compliance with these policies and, if the policy is configured in enforce mode, will change settings on your system to bring the machine back into compliance if necessary. The guest configuration service runs as Local System on Windows and root on Linux to ensure it has access to all settings on your system. You can disable the guest configuration feature if you don't intend to use guest configuration policies.

### Azure Arc proxy

The Azure Arc proxy service is responsible for aggregating network traffic from the Azure Connected Machine agent services and any extensions you’ve installed and deciding where to route that data. If you’re using the Azure Arc Gateway to simplify your network endpoints, the Azure Arc Proxy service is the local component that forwards network requests via the Azure Arc Gateway instead of the default route. The Azure Arc proxy runs as Network Service on Windows and a standard user account (arcproxy) on Linux. It's disabled by default until you configure the agent to use the Azure Arc Gateway.

## Security considerations for Tier 0 assets

Tier 0 assets such as an Active Directory Domain Controller, Certificate Authority server, or highly sensitive business application server can be connected to Azure Arc with extra care to ensure only the desired management functions and authorized users can manage the servers. These recommendations are not required but are strongly recommended to maintain the security posture of your Tier 0 assets.

### Dedicated Azure subscription

Access to Azure Arc-enabled servers is often determined by the organizational hierarchy to which it belongs in Azure. You should treat any subscription or management group admin as equivalent to a local administrator on Tier 0 assets because they could use their permissions to add new role assignments to the Azure Arc resource. Additionally, policies applied at the subscription or management group level may also have permission to make changes to the server.

To minimize the number of accounts and policies with access to your Tier 0 assets, consider using a dedicated Azure subscription that can be closely monitored and configured with as few persistent administrators as possible. Review Azure policies in any parent management groups to ensure they are aligned with your intent for these servers.

### Disable unnecessary management features

For a Tier 0 asset, you should use the local agent security controls to disable any unused functionality in the agent to prevent any intentional—or accidental—use of those features to make changes to the server. This includes:

- Disabling remote access capabilities
- Setting an extension allowlist for the extensions you intend to use, or disabling the extension manager if you are not using extensions
- Disabling the machine configuration agent if you don’t intend to use machine configuration policies

The following example shows how to lock down the Azure Connected Machine agent for a domain controller that needs to use the Azure Monitor Agent to collect security logs for Microsoft Sentinel and Microsoft Defender for Servers to protect against malware threats:

```
azcmagent config set incomingconnections.enabled false

azcmagent config set guestconfiguration.enabled false

azcmagent config set extensions.allowlist “Microsoft.Azure.Monitor/AzureMonitorWindowsAgent,Microsoft.Azure.AzureDefenderForServers/MDE.Windows”
```
