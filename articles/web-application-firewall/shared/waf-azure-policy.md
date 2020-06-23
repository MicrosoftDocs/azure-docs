---
title: Azure Web Application Firewall and Azure Policy
description: Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources
author: tremansdoerfer
ms.service: web-application-firewall
services: web-application-firewall
ms.topic: concepts
ms.date: 06/23/2020
ms.author: rimansdo
---

# Azure Web Application Firewall and Azure Policy

Azure Web Application Firewall (WAF) combined with Azure Policy can help enforce organizational standards and assess compliance at-scale for WAF resources. Azure policy is a governance tool that provides an aggregated view to evaluate the overall state of the environment, with the ability to drill-down to the per-resource, per-policy granularity. Azure policy also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources.

## Azure Policies for Web Application Firewall

There are several built-in Azure Policies to manage WAF resources. A breakdown of the policies and their functionalities are as follows:

1. **Web Application Firewall should be enabled for Azure Front Door Service or Application Gateway**: Azure Front Door Services and Application Gateways are evaluated on if there is a WAF present on resource creation. The policy has three effects: Audit, Deny, and Disable. Audit tracks when a Azure Front Door Service or Application Gateway does not have a WAF and lets users see what Azure Front Door Service or Application Gateway does not currently comply. Deny prevents any Azure Front Door Service or Application Gateway from being created if a WAF is not attached. Disabled turns off this policy.

2. **Web Application Firewall should be a set mode for Application Gateway and Azure Front Door Service**: Web Application Firewall is evaluated on what mode it is in, either prevention or detection. The policy ensures mode consistency across Web Application Firewalls. The policy has three effects: Audit, Deny, and Disable. Audit tracks when a WAF does not fit the specified mode. Deny prevents any WAF from being created if it is not in the correct mode. Disabled turns off this policy.


## Launch an Azure Policy


1.	On the Azure home page, type Policy in the search bar and click the Azure Policy icon

2.	On the Azure policy service, under **Authoring**, select **Assignments**.

![Azure web application firewall](../media/waf-azure-policy/policy-home.png)

3.	On the Assignments page, select the **Assign policy** icon at the top.

![Azure web application firewall](../media/waf-azure-policy/assign-policy.png)

4.	On the Assign Policy page basics tab, update the following fields:
    1.	**Scope**: Select what Azure subscriptions and resource groups should be impacted by the Azure Policy.
    2.	**Exclusions**: Select any resources from the scope to exclude from the policy 
    3.	**Policy Definition**: Select the Azure Policy to apply to the scope with exclusions. Type “Web Application Firewall” in the search bar to choose the relevant Web Application Firewall Azure Policy.

![Azure web application firewall](../media/waf-azure-policy/policy-listings.png)


5.	Select the **Parameters** tab and update the policies parameters. To further clarify what the parameter does, hover over the info icon next to the parameter name for further clarification.

6.	Select **Review + create** to finalize your Azure policy. The Azure policy will take approximately 15 minutes until it will be active for new resources.
