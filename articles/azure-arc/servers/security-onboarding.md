---
title: Security onboarding and updates
description: Azure Arc-enabled servers planning and deployment guidance.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Planning and deployment guidance

The [Azure Arc Landing Zone Accelerator for Hybrid and Multicloud](/azure/cloud-adoption-framework/scenarios/hybrid/enterprise-scale-landing-zone) has a complete set of guidance for you to consider as you plan an Azure Arc-enabled servers deployment. This section contains a selection of that content with security relevance.

## Resource hierarchy and inherited access

The subscription and resource group where you choose to connect your machine will influence which users and accounts in your organization can see and manage the machine from Azure. Generally, you should organize your servers based on the groups of accounts that need to access them. If you have two teams managing two separate sets of servers who shouldn't be able to manage each other’s machines, you should use two resource groups and control access to the servers at the resource group.

## Onboarding credential

When you connect a server to Azure Arc, you need to use an onboarding credential to authorize the machine to create a resource in your Azure subscription. There are three ways to provide credentials:

1. **Interactive logons**, either using the local web browser (Windows-only) or a device login code that can be entered on any computer with internet access.

1. **Service principals**, which are dedicated accounts that can be used for scripted installations of the agent. Service principals consist of a unique application ID and either a plain text secret or a certificate. If you choose to use a service principal, you should use certificates instead of secrets because they can be controlled with Microsoft Entra conditional access policies. Remember to protect access to and regularly rotate the service principal secrets/certificates to minimize the risk of a compromised credential.

1. **Access tokens**, which are short-lived and obtained from another credential.

No matter the type of credential you choose to use, the most important part is to ensure that it has only the required permissions to onboard machines to Azure Arc and nothing extra. The Azure Connected Machine Onboarding role is designed specifically for onboarding credentials and only includes the necessary permissions to create and read Azure Arc-enabled server resources in Azure. You should also limit the scope of the role assignment to only the resource groups or subscriptions necessary to onboard your servers.

The onboarding credential is only needed at the time the azcmagent connect step is run on a server. It's not needed once a server is connected. If the onboarding credential expires or is deleted, the server continues to be connected to Azure.

If a malicious actor gains access to your onboarding credential, they could use the credential to onboard servers outside of your organization to Azure Arc within your subscription/resource group. You can use [private endpoints](security-networking.md#private-endpoints) to protect against such attacks by restricting access to Azure Arc within your network.

## Protecting secrets in onboarding script

The onboarding script contains all the information needed to connect your server to Azure. This includes steps to download, install, and configure the Azure Connected Machine agent on your server. It also includes the onboarding credential used to non-interactively connect that server to Azure. It’s important to protect the onboarding credential so it isn't accidentally captured in logs and end up in the wrong hands.

For production deployments, it’s common to orchestrate the onboarding script using an automation tool such as Microsoft Configuration Manager, Red Hat Ansible, or Group Policy. Check with your automation tool to see if it has a way to protect secrets used in the installation script. If it doesn’t, consider moving the onboarding script parameters to a dedicated configuration file. This prevents secrets from being parsed and potentially logged directly on the command line. The [Group Policy onboarding guidance](onboard-group-policy-powershell.md) includes extra steps to encrypt the configuration file so that only computer accounts can decrypt it, not users or others outside your organization.

If your automation tool copies the configuration file to the server, make sure it also cleans up the file after it's done so the secrets don’t persist longer than necessary.

Additionally, as with all Azure resources, tags for Azure Arc-enabled servers are stored as plain text. Don't put sensitive information in tags.

## Agent updates

A new version of the Azure Connected Machine agent is typically released every month. There isn’t an exact schedule of when the updates are available, but you should check for and apply updates on a monthly basis. Refer to the [list of all the new releases](/azure/azure-arc/servers/agent-release-notes), including what specific changes are included in them. Most updates include security, performance. and quality fixes. Some also include new features and functionality. When a hotfix is required to address an issue with a release, it's released as a new agent version and available via the same means as a regular agent release.

The Azure Connected Machine agent doesn't update itself. You must update it using your preferred update management tool. For Windows machines, updates are delivered through Microsoft Update. Standalone servers should opt-in to Microsoft Updates (using the *receive updates for other Microsoft products* option). If your organization uses Windows Server Update Services to cache and approve updates locally, your WSUS admin must synchronize and approve updates for the Azure Connected Machine agent product.

Linux updates are published to `packages.microsoft.com`. Your package management software (apt, yum, dnf, zypper, etc.) should show “azcmagent” updates alongside your other system packages. Learn more about [upgrading Linux agents](/azure/azure-arc/servers/manage-agent?tabs=linux-apt).

Microsoft recommends staying up to date with the latest agent version whenever possible. If your maintenance windows are less frequent, Microsoft supports all agent versions released within the last 12 months. However, since the agent updates include security fixes, you should update as frequently as possible.

If you're looking for a patch management tool to orchestrate updates of the Azure Connected Machine agent on both Windows and Linux, consider Azure Update Manager. 

## Extension updates

### Automatic extension updates

By default, every extension you deploy to an Azure Arc-enabled server has automatic extension upgrades enabled. If the extension publisher supports this feature, new versions of the extension are automatically installed within 60 days of the new version becoming available. Automatic extension upgrades follow a safe deployment practice, meaning that only a small number of extensions are updated at a time. Rollouts continue slowly across regions and subscriptions until every extension is updated.

There are no granular controls over automatic extension upgrades. You'll always be upgraded to the most recent version of the extension and can’t choose when the upgrade happens. The extension manager has [built-in resource governance](/azure/azure-arc/servers/agent-overview) to ensure an extension upgrade doesn't consume too much of the system’s CPU and interfere with your workloads during the upgrade.

If you don't want to use automatic upgrades for extensions, you can disable them on a per-extension, per-server basis using the [Azure portal, CLI, or PowerShell](/azure/azure-arc/servers/manage-automatic-vm-extension-upgrade?tabs=azure-portal).

### Manual extension updates

For extensions that don’t support automatic upgrades or have automatic upgrades disabled, you can use the Azure portal, CLI, or PowerShell to upgrade extensions to the newest version. The CLI and PowerShell commands also support downgrading an extension, in case you need to revert to an earlier version.

## Using disk encryption

The Azure Connected Machine agent uses public key authentication to communicate with the Azure service. After you onboard a server to Azure Arc, a private key is saved to the disk and used whenever the agent communicates with Azure. If stolen, the private key can be used on another server to communicate with the service and act as if it were the original server. This includes getting access to the system assigned identity and any resources that identity has access to. The private key file is protected to only allow the **himds** account access to read it. To prevent offline attacks, we strongly recommend the use of full disk encryption (for example, BitLocker, dm-crypt, etc.) on the operating system volume of your server.

