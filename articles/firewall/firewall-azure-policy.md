---
title: Use Azure Policy to help secure your Azure Firewall deployments
description: You can use Azure Policy to help secure your Azure Firewall deployments.
author: vhorne
ms.author: victorh
ms.service: azure-firewall
ms.topic: how-to
ms.date: 09/05/2024
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a How-to article pattern. See the
[instructions - How-to](../level4/article-how-to-guide.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

How-to is a procedure-based article pattern that show the user how to complete a task in their own environment. A task is a work activity that has a definite beginning and ending, is observable, consist of two or more definite steps, and leads to a product, service, or decision.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "<verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the task the user will complete.

For example: "Migrate data from regular tables to ledger tables" or "Create a new Azure SQL Database".

* Include only a single H1 in the article.
* Don't start with a gerund.
* Don't include "Tutorial" in the H1.

-->

# Use Azure Policy to help secure your Azure Firewall deployments

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the customer will do. Answer the fundamental “why would I want to do this?” question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don't use a bulleted list of article H2 sections.

Example: In this article, you will migrate your user databases from IBM Db2 to SQL Server by using SQL Server Migration Assistant (SSMA) for Db2.

-->

Azure Policy is a service in Azure that allows you to create, assign, and manage policies. These policies enforce different rules and effects over your resources, so those resources stay compliant with your corporate standards and service level agreements. Azure Policy does this by evaluating your resources for noncompliance with assigned policies. For example, you can have a policy to allow only a certain size of virtual machines in your environment or to enforce a specific tag on resources. 

Azure Policy can be used to govern Azure Firewall configurations by applying policies that define what configurations are allowed or disallowed. This helps ensure that the firewall settings are consistent with organizational compliance requirements and security best practices. 

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->
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
   
   This policy finds all VNETs with a specified tag and checks if there's an Azure Firewall deployed, and flags it as noncompliant if no Azure Firewall exists. 

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

:::image type="content" source="media/firewall-azure-policy/azure-policy.png" lightbox="media/firewall-azure-policy/azure-policy.png" alt-text="Screenshot shown policy create denial.":::

<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Related content

- [What is Azure Policy?](../governance/policy/overview.md)


