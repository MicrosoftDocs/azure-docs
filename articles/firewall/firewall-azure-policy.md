---
title: Use Azure Policy to help secure your Azure Firewall deployments
description: You can use Azure Policy to help secure your Azure Firewall deployments.
author: vhorne
ms.author: victorh
ms.service: azure-firewall
ms.topic: how-to
ms.date: 09/05/2024
---

# Use Azure Policy to help secure your Azure Firewall deployments

Azure Policy is a service in Azure that allows you to create, assign, and manage policies. These policies enforce different rules and effects over your resources, so those resources stay compliant with your corporate standards and service level agreements. Azure Policy does this by evaluating your resources for noncompliance with assigned policies. For example, you can have a policy to allow only a certain size of virtual machines in your environment or to enforce a specific tag on resources. 

Azure Policy can be used to govern Azure Firewall configurations by applying policies that define what configurations are allowed or disallowed. This helps ensure that the firewall settings are consistent with organizational compliance requirements and security best practices. 

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Policies available for Azure Firewall

The following policies are available for Azure Firewall:

- **Enable Threat Intelligence in Azure Firewall Policy**

   This policy makes sure that any Azure Firewall configuration without threat intel enabled is marked as noncompliant. 
- **Deploy Azure Firewall across Multiple Availability Zones**

   The policy restricts Azure Firewall deployment to be only allowed with Multiple Availability Zone configuration. 
- **Upgrade Azure Firewall Standard to Premium**

   This policy recommends upgrading Azure Firewall Standard to Premium so that all the Premium version advanced firewall features can be used. This further enhances the security of the network. 
- **Azure Firewall Policy Analytics should be enabled**

   This policy ensures that the Policy Analytics is enabled on the firewall to effectively tune and optimize firewall rules. 
- **Azure Firewall should only allow Encrypted Traffic**
   
   This policy analyses existing rules and ports in Azure firewall policy and audits firewall policy to make sure that only encrypted traffic is allowed into the environment. 
- **Azure Firewall should have DNS Proxy Enabled**
   
   This Policy Ensures that DNS proxy feature is enabled on Azure Firewall deployments. 
- **Enable IDPS in Azure Firewall Premium Policy**
   
   This policy ensures that the IDPS feature is enabled on Azure Firewall deployments to effectively protect the environment from various threats and vulnerabilities. 
- **Enable TLS inspection on Azure Firewall Policy**
   
   This policy mandates that TLS inspection is enabled to detect, alert, and mitigate malicious activity in HTTPS traffic. 
- **Migrate from Azure Firewall Classic Rules to Firewall Policy**
   
   This policy recommends migrating from Firewall Classic Rules to Firewall Policy. 
- **VNET with specific tag must have Azure Firewall Deployed**
   
   This policy finds all virtual networks with a specified tag and checks if there's an Azure Firewall deployed, and flags it as noncompliant if no Azure Firewall exists. 

The following steps show how you can create an Azure Policy that enforces all Firewall Policies to have the Threat Intelligence feature enabled (either **Alert Only**, or **Alert and deny**). The Azure Policy scope is set to the resource group that you create.

## Create a resource group

This resource group is set as the scope for the Azure Policy, and is where you create the Firewall Policy.

1. From the Azure portal, select **Create a resource**.
1. In the search box, type **resource group** and press Enter.
1. Select **Resource group** from the search results.
1. Select **Create**.
1. Select your subscription.
1. Type a name for your resource group.
1. Select a region.
1. Select **Next : Tags**.
1. Select **Next : Review + create**.
1. Select **Create**.

## Create an Azure Policy

Now create an Azure Policy in your new resource group. This policy ensures that any firewall policies must have Threat Intelligence enabled.

1. From the Azure portal, select **All services**.
1. In the filter box, type **policy** and press Enter.
1. Select **Policy** in the search results.
1. On the Policy page, select **Getting started**.
1. Under **Assign policies**, select **View definitions**.
1. On the Definitions page, type **firewall**, in the search box.
1. Select **Azure Firewall Policy should enable Threat Intelligence**.
1. Select **Assign policy**.
1. For **Scope**, select you subscription and your new resource group.
1. Select **Select**.
1. Select **Next**.
1. On the **Parameters** page, clear the **Only show parameters that need input or review** check box.
1. For **Effect**, select **Deny**.
1. Select **Review + create**.
1. Select **Create**.

## Create a Firewall Policy

Now you attempt to create a Firewall Policy with Threat Intelligence disabled.

1. From the Azure portal, select **Create a resource**.
1. In the search box, type **firewall policy** and press Enter.
1. Select **Firewall Policy** in the search results.
1. Select **Create**.
1. Select your subscription.
1. For **Resource group**, select the resource group that you created previously.
1. In the **Name** text box, type a name for your policy.
1. Select **Next : DNS Settings**.
1. Continue selecting through to the **Threat intelligence** page.
1. For **Threat intelligence mode**, select **Disabled**.
1. Select **Review + create**.

You should see an error that says your resource was disallowed by policy, confirming that your Azure Policy doesn't allow firewall policies that have Threat Intelligence disabled.

:::image type="content" source="media/firewall-azure-policy/azure-policy.png" lightbox="media/firewall-azure-policy/azure-policy.png" alt-text="Screenshot showing policy create denial.":::

## Related content

- [What is Azure Policy?](../governance/policy/overview.md)
- [Govern your Azure Firewall configuration with Azure Policies](https://techcommunity.microsoft.com/t5/azure-network-security-blog/govern-your-azure-firewall-configuration-with-azure-policies/ba-p/4189902)


