---
title: Azure Web Application Firewall and Azure Policy
description: Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources
author: tremansdoerfer
ms.service: web-application-firewall
services: web-application-firewall
ms.topic: conceptual
ms.date: 05/25/2023
ms.author: rimansdo
---

# Azure Web Application Firewall and Azure Policy

Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources. Azure Policy is a governance tool that provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity. Azure Policy also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources.

## Azure Policy for Web Application Firewall

There are multiple built-in Azure Policy definitions to manage WAF resources. A breakdown of the policy definitions and their functionalities are as follows:

### Enable Web Application Firewall (WAF)

- **Azure Web Application Firewall should be enabled for Azure Front Door entry-points**: Azure Front Door Services are evaluated on if there's a WAF present or not. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when an Azure Front Door Service doesn't have a WAF and lets users see what Azure Front Door Service doesn't comply. Deny prevents any Azure Front Door Service from being created if a WAF isn't attached. Disabled turns off the policy assignment.

- **Web Application Firewall (WAF) should be enabled for Application Gateway**: Application Gateways are evaluated on if there's a WAF present on resource creation. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when an Application Gateway doesn't have a WAF and lets users see what Application Gateway doesn't comply. Deny prevents any Application Gateway from being created if a WAF isn't attached. Disabled turns off the policy assignment.

### Mandate Detection or Prevention Mode

- **Web Application Firewall (WAF) should use the specified mode for Azure Front Door Service**: Mandates the use of 'Detection' or 'Prevention' mode to be active on all Web Application Firewall policies for Azure Front Door Service. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when a WAF doesn't fit the specified mode. Deny prevents any WAF from being created if it isn't in the correct mode. Disabled turns off the policy assignment.

- **Web Application Firewall (WAF) should use the specified mode for Application Gateway**: Mandates the use of 'Detection' or 'Prevention' mode to be active on all Web Application Firewall policies for Application Gateway. The policy definition has three effects: Audit, Deny, and Disable. Audit tracks when a WAF doesn't fit the specified mode. Deny prevents any WAF from being created if it isn't in the correct mode. Disabled turns off the policy assignment.

### Require Request Inspection

- **Azure Web Application Firewall on Azure Front Door should have request body inspection enabled**: Ensure that Web Application Firewalls associated to Azure Front Doors have Request body inspection enabled. This functionality allows the WAF to inspect properties within the HTTP body that may not be evaluated in the HTTP headers, cookies, or URI.

- **Azure Web Application Firewall on Azure Application Gateway should have request body inspection enabled**: Ensure that Web Application Firewalls associated to Azure Application Gateways have Request body inspection enabled. This functionality allows the WAF to inspect properties within the HTTP body that may not be evaluated in the HTTP headers, cookies, or URI.

### Require Resource Logs

- **Azure Front Door should have Resource logs enabled**: Mandates the enabling of Resource logs and Metrics on the Azure Front Door classic Service, including WAF. The policy definition has two effects: AuditIfNotExists and Disable. AuditIfNotExists tracks when a Front Door service doesn't have resource logs, metrics enabled and notifies the user that the service doesn't comply. Disabled turns off the policy assignment.

- **Azure Front Door Standard or Premium (Plus WAF) should have resource logs enabled**: Mandates the enabling of Resource logs and Metrics on the Azure Front Door standard and premium Services, including WAF. The policy definition has two effects: AuditIfNotExists and Disable. AuditIfNotExists tracks when a Front Door service doesn't have resource logs, metrics enabled and notifies the user that the service doesn't comply. Disabled turns off the policy assignment.

- **Azure Application Gateway should have Resource logs enabled**: Mandates the enabling of Resource logs and Metrics on all Application Gateways, including WAF. The policy definition has two effects: AuditIfNotExists and Disable. AuditIfNotExists tracks when an Application Gateway doesn't have resource logs, metrics enabled and notifies the user that the Application Gateway doesn't comply. Disabled turns off the policy assignment.

### Recommended WAF Configurations 

- **Azure Front Door profiles should use Premium tier that supports managed WAF rules and private link**: Mandates that all of your Azure Front Door profiles are on the premium tier instead of the standard tier. Azure Front Door Premium is optimized for security, and gives you access to the most up to date WAF rulesets and functionality like bot protection.

- **Enable Rate Limit rule to protect against DDoS attacks on Azure Front Door WAF**: Rate limiting can help protect your application against DDoS attacks. The Azure Web Application Firewall (WAF) rate limit rule for Azure Front Door helps protect against DDoS by controlling the number of requests allowed from a particular client IP address to the application during a rate limit duration.

- **Migrate WAF from WAF Config to WAF Policy on Application Gateway**: If you have WAF Config instead of WAF Policy, then you may want to move to the new WAF Policy. Web Application Firewall (WAF) policies offer a richer set of advanced features over WAF config, provide a higher scale, better performance, and unlike legacy WAF configuration, WAF policies can be defined once and shared across multiple gateways, listeners, and URL paths. Going forward, the latest features and future enhancements are only available via WAF policies.

## Create an Azure Policy

1.	On the Azure home page, type Policy in the search bar and select the Azure Policy icon.

2.	On the Azure Policy service, under **Authoring**, select **Assignments**.

:::image type="content" source="../media/waf-azure-policy/policy-home.png" alt-text="Screenshot of Assignments tab within Azure Policy.":::

3.	On the Assignments page, select the **Assign policy** icon at the top.

   :::image type="content" source="../media/waf-azure-policy/assign-policy.png" alt-text="Screenshot of Basics tab on the Assign Policy page.":::

4.	On the Assign Policy page basics tab, update the following fields:
    1.	**Scope**: Select what Azure subscriptions and resource groups the policies apply to.
    2.	**Exclusions**: Select any resources from the scope to exclude from the policy assignment.
    3.	**Policy Definition**: Select the policy definition to apply to the scope with exclusions. Type "Web Application Firewall" in the search bar to choose the relevant Web Application Firewall Azure Policy.

   :::image type="content" source="../media/waf-azure-policy/policy-listing.png" alt-text="Screenshot that shows the 'Policy Definitions' tab on the 'Available Definitions' page.":::

5.	Select the **Parameters** tab and update the policy assignment parameters. To further clarify what the parameter does, hover over the info icon next to the parameter name for further clarification.

6.	Select **Review + create** to finalize your policy assignment. The policy assignment takes approximately 15 minutes until it's active for new resources.
