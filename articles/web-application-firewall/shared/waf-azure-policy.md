---
title: Azure Web Application Firewall and Azure Policy
description: Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources
author: tremansdoerfer
ms.service: web-application-firewall
services: web-application-firewall
ms.topic: conceptual
ms.date: 07/07/2020
ms.author: rimansdo
---

# Azure Web Application Firewall and Azure Policy

Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources. Azure Policy is a governance tool that provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity. Azure Policy also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources.

## Azure Policy for Web Application Firewall

There are several built-in Azure Policy definitions to manage WAF resources. A breakdown of the policy definitions and their functionalities are as follows:

1. **Azure Web Application Firewall should be enabled for Azure Front Door entry-points**: Azure Front Door Services are evaluated on if there is a WAF present on resource creation. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when an Azure Front Door Service does not have a WAF and lets users see what Azure Front Door Service does not comply. Deny prevents any Azure Front Door Service from being created if a WAF is not attached. Disabled turns off the policy assignment.

2. **Web Application Firewall (WAF) should be enabled for Application Gateway**: Application Gateways are evaluated on if there is a WAF present on resource creation. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when an Application Gateway does not have a WAF and lets users see what Application Gateway does not comply. Deny prevents any Application Gateway from being created if a WAF is not attached. Disabled turns off the policy assignment.

3. **Web Application Firewall (WAF) should use the specified mode for Azure Front Door Service**: Mandates the use of 'Detection' or 'Prevention' mode to be active on all Web Application Firewall policies for Azure Front Door Service. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when a WAF does not fit the specified mode. Deny prevents any WAF from being created if it is not in the correct mode. Disabled turns off the policy assignment.

4. **Web Application Firewall (WAF) should use the specified mode for Application Gateway**: Mandates the use of 'Detection' or 'Prevention' mode to be active on all Web Application Firewall policies for Application Gateway. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when a WAF does not fit the specified mode. Deny prevents any WAF from being created if it is not in the correct mode. Disabled turns off the policy assignment.

5. **Azure Application Gateway should have Resource logs enabled**: Mandates the enabling of Resource logs on all Application Gateways (Plus WAF). The policy definition has two effects: AuditIfNotExists and Disable. AuditIfNotExists tracks when an Application Gateway does not have resource logs enabled and notifies the user that the Application Gateway does not comply. Disabled turns off the policy assignment.

6. **Azure Front Door should have Resource logs enabled**: Mandates the enabling of Resource logs on Azure Front Door Service (Plus WAF). The policy definition has two effects: AuditIfNotExists and Disable. AuditIfNotExists tracks when a Front Door service does not have resource logs enabled and notifies the user that the service does not comply. Disabled turns off the policy assignment.

## Launch an Azure Policy

1.	On the Azure home page, type Policy in the search bar and click the Azure Policy icon

2.	On the Azure Policy service, under **Authoring**, select **Assignments**.

:::image type="content" source="../media/waf-azure-policy/policy-home.png" alt-text="Assignments tab within Azure Policy":::

3.	On the Assignments page, select the **Assign policy** icon at the top.

:::image type="content" source="../media/waf-azure-policy/assign-policy.png" alt-text="Basics tab on the Assign Policy page":::

4.	On the Assign Policy page basics tab, update the following fields:
    1.	**Scope**: Select what Azure subscriptions and resource groups should be impacted by the policy definition.
    2.	**Exclusions**: Select any resources from the scope to exclude from the policy assignment.
    3.	**Policy Definition**: Select the policy definition to apply to the scope with exclusions. Type "Web Application Firewall" in the search bar to choose the relevant Web Application Firewall Azure Policy.

:::image type="content" source="../media/waf-azure-policy/policy-listing.png" alt-text="Screenshot that shows the 'Policy Definitions' tab on the 'Available Definitions' page.":::

5.	Select the **Parameters** tab and update the policy assignment parameters. To further clarify what the parameter does, hover over the info icon next to the parameter name for further clarification.

6.	Select **Review + create** to finalize your policy assignment. The policy assignment takes approximately 15 minutes until it is active for new resources.
