---
title: Use Azure Policy to help secure your Azure Firewall deployments
description: Govern Azure Firewall configurations by applying Azure Policies that enforce security best practices and organizational compliance standards.
author: duau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
# Customer intent: "As a network administrator, I want to apply Azure Policies to govern Azure Firewall configurations, so that I can ensure compliance with security best practices and organizational standards."
---

# Use Azure Policy to help secure your Azure Firewall deployments

Azure Policy is a service in Azure that you can use to create, assign, and manage policies. These policies enforce different rules and effects over your resources, so those resources stay compliant with your corporate standards and service level agreements. Azure Policy evaluates your resources for noncompliance with assigned policies. For example, you can use a policy to allow only a certain size of virtual machines in your environment or to enforce a specific tag on resources.

You can use Azure Policy to govern Azure Firewall configurations by applying policies that define what configurations are allowed or disallowed. This approach helps ensure that the firewall settings are consistent with organizational compliance requirements and security best practices.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Policies available for Azure Firewall

The following policies are available for Azure Firewall:

| Policy | Description |
|--------|-------------|
| **Enable Threat Intelligence in Azure Firewall Policy** | Marks any Azure Firewall configuration without threat intelligence enabled as noncompliant. |
| **Deploy Azure Firewall across Multiple Availability Zones** | Restricts Azure Firewall deployment to only allow multiple Availability Zone configurations. |
| **Upgrade Azure Firewall Standard to Premium** | Recommends upgrading Azure Firewall Standard to Premium to use advanced Premium features and enhance network security. |
| **Azure Firewall Policy Analytics should be enabled** | Ensures Policy Analytics is enabled on the firewall to effectively tune and optimize firewall rules. |
| **Azure Firewall should only allow Encrypted Traffic** | Audits firewall policy rules and ports to ensure only encrypted traffic is allowed into the environment. |
| **Azure Firewall should have DNS Proxy Enabled** | Ensures the DNS proxy feature is enabled on Azure Firewall deployments. |
| **Enable IDPS in Azure Firewall Premium Policy** | Ensures the IDPS feature is enabled on Azure Firewall deployments to protect against threats and vulnerabilities. |
| **Enable TLS inspection on Azure Firewall Policy** | Requires TLS inspection to be enabled to detect, alert, and mitigate malicious activity in HTTPS traffic. |
| **Enforce Explicit Proxy Configuration for Firewall Policies** | Ensures all Azure Firewall policies have explicit proxy configuration enabled by checking for the `explicitProxy.enableExplicitProxy` field. For the complete policy definition, see [Enforce Explicit Proxy Configuration for Firewall Policies](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Policy%20-%20Azure%20Policy%20Definitions/Policy%20-%20Enforce%20Explicit%20Proxy%20Configuration%20for%20Firewall%20Policies). |
| **Enable PAC file configuration while using Explicit Proxy on Azure Firewall** | Audits firewall policies to ensure that when explicit proxy is enabled (`explicitProxy.enableExplicitProxy` is true), the PAC file (`explicitProxy.enablePacFile`) is also enabled. For the complete policy definition, see [Enable PAC file configuration while using Explicit Proxy on Azure Firewall](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Policy%20-%20Azure%20Policy%20Definitions/Policy%20-%20Enable%20PAC%20file%20configuration%20while%20using%20Explicit%20Proxy%20on%20Azure%20Firewall). |
| **Migrate from Azure Firewall Classic Rules to Firewall Policy** | Recommends migrating from Firewall Classic Rules to Firewall Policy. |
| **VNET with specific tag must have Azure Firewall Deployed** | Checks all virtual networks with a specified tag for an Azure Firewall deployment and flags the configuration as noncompliant if none exists. |

The following steps show how you can create an Azure Policy that enforces all Firewall Policies to have the Threat Intelligence feature enabled (either **Alert Only** or **Alert and deny**). Set the Azure Policy scope to the resource group that you create.

## Create a resource group

Set this resource group as the scope for the Azure Policy. Create the Firewall Policy in this resource group.

1. From the Azure portal, select **Create a resource**, search for `resource group`, and select **Resource group** from the results.
1. Select **Create**, select your subscription, type a name for your resource group, and select a region.
1. Select **Review + create**, and then select **Create**.

## Create an Azure Policy

Now create an Azure Policy in your new resource group. This policy ensures that any firewall policies have Threat Intelligence enabled.

1. From the Azure portal, search for `policy`, and select **Policy** from the results.
1. In the left menu, expand **Authoring** and select **Definitions**.
1. In the search box, type `firewall`, and then select **Azure Firewall Policy should enable Threat Intelligence**.
1. Select **Assign policy**.
1. For **Scope**, select your subscription and your new resource group, and then select **Select**.
1. Select **Next**.
1. On the **Parameters** pane, clear the **Only show parameters that need input or review** check box, and then for **Effect**, select **Deny**.
1. Select **Review + create**, then select **Create**.

## Create a firewall policy

Now, create a firewall policy with Threat Intelligence disabled.

1. From the Azure portal, select **Create a resource**, search for `firewall policy`, and select **Firewall Policy** from the results.
1. Select **Create**, and then select your subscription and the resource group that you created previously.
1. In the **Name** box, type a name for your policy.
1. Go to the **Threat intelligence** tab.
1. For **Threat intelligence mode**, select **Disabled**.
1. Select **Review + create**.

You see an error that says your resource was disallowed by policy, confirming that your Azure Policy doesn't allow firewall policies that have Threat Intelligence disabled.

## Additional Azure Policy definitions

For more Azure Policy definitions specifically designed for Azure Firewall, including policies for explicit proxy configuration, see the [Azure Network Security GitHub repository](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20Firewall/Policy%20-%20Azure%20Policy%20Definitions). This repository contains community-contributed policy definitions that you can deploy in your environment.

## Related content

- [What's Azure Policy?](../governance/policy/overview.md)
- [Govern your Azure Firewall configuration with Azure Policies](https://techcommunity.microsoft.com/t5/azure-network-security-blog/govern-your-azure-firewall-configuration-with-azure-policies/ba-p/4189902)
- [Azure Firewall Explicit proxy (preview)](explicit-proxy.md)


