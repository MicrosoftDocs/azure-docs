---
title: Automated detection and response for Azure WAF with Microsoft Sentinel
description: Use WAF detection templates in Sentinel, deploy a playbook, and configure the detection and response in Sentinel.
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: how-to
ms.date: 09/27/2023
---

# Automated detection and response for Azure WAF with Microsoft Sentinel

Malicious attackers increasingly target web applications by exploiting commonly known vulnerabilities such as SQL injection and Cross-site scripting. Preventing these attacks in application code poses a challenge, requiring rigorous maintenance, patching, and monitoring at multiple layers of the application topology. A Web Application Firewall (WAF) solution can react to a security threat faster by centrally patching a known vulnerability, instead of securing each individual web application. Azure Web Application Firewall (WAF) is a cloud-native service that protects web apps from common web-hacking techniques. You can deploy this service in a matter of minutes to gain complete visibility into the web application traffic and block malicious web attacks.

Integrating Azure WAF with Microsoft Sentinel (a cloud-native SIEM/SOAR solution) for automated detection and response to threats/incidents/alerts is an added advantage and reduces the manual intervention needed to update the WAF policy.

In this article, you learn about WAF detection templates in Sentinel, deploy a playbook, and configure the detection and response in Sentinel using these templates and the playbook. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Front Door deployment with an associated WAF policy. For more information, see [Quickstart: Create a Front Door Standard/Premium using an ARM template](../../frontdoor/create-front-door-template.md), and [Tutorial: Create a WAF policy on Azure Front Door by using the Azure portal](waf-front-door-create-portal.md).
- An Azure Front Door configured to capture logs in a Log Analytics workspace. For more information, see [Configure Azure Front Door logs](../../frontdoor/standard-premium/how-to-logs.md).

## Deploy the playbook
You install a Sentinel playbook named *Block-IPAzureWAF* from a template on GitHub. This playbook runs in response to WAF incidents. The goal is to create or modify a custom rule in a WAF policy to block requests from a certain IP address. This is accomplished using the Azure REST API.

You install the playbook from a template on GitHub.
1. Go to the [GitHub repository](https://github.com/Azure/Azure-Network-Security/tree/master/Azure%20WAF/Playbook%20-%20WAF%20Sentinel%20Playbook%20Block%20IP%20-%20New) and select **Deploy to Azure** to launch the template.
1. Fill in the required parameters. You can get your Front Door ID from the Azure portal. The Front Door ID is the resource ID of the Front Door resource.
   :::image type="content" source="../media/automated-detection-response-with-sentinel/playbook-template.png" alt-text="Screenshot showing the playbook template.":::
1. Select **Review + create** and then **Create**.

## Authorize the API connection

An API connection named *azuresentinel-Block-IPAzureWAF* is created as part of this deployment. You must authorize it with your Azure ID to allow the playbook to make changes to your WAF policy.

1. In the Azure portal, select the *azuresentinel-Block-IPAzureWAF* API connection.
1. Select **Edit API connection**.
1. Under **Display Name**, type your Azure ID.
1. Select **Authorize**.
1. Select **Save**.

:::image type="content" source="../media/automated-detection-response-with-sentinel/authorize-api.png" alt-text="Screenshot showing the API authorization screen."lightbox="../media/automated-detection-response-with-sentinel/authorize-api.png":::

## Configure the Contributor role assignment

The playbook must have the necessary permissions to query and modify the existing WAF policy via the REST API.  You can assign the playbook a system-assigned Managed Identity with Contributor permissions on the Front Door resource along with their associated WAF policies. You can assign permissions only if your account has been assigned Owner or User Access Administrator roles to the underlying resource.

This can be done using the IAM section in the respective resource by adding a new role assignment to this playbook.

1. In the Azure portal, select the Front Door resource.
1. In the left pane, select **Access control (IAM)**.
1. Select **Role assignments**.
1. Select **Add** then **Add role assignment**.
1. Select **Privileged administrator roles**.
1. Select **Contributor** and then select **Next**.
1. Select **Select members**.
1. Search for **Block-IPAzureWAF** and select it. There may be multiple entries for this playbook. The one you recently added usually the last one in the list.
1. Select **Block-IPAzureWAF** and select **Select**.
1. Select **Review + assign**.

Repeat this procedure for the WAF policy resource.

## Add Microsoft Sentinel to your workspace

1. In the Azure portal, search for and then open Microsoft Sentinel.
1. Select **Create**.
1. Select your workspace, and then select **Add**.

## Configure the Logic App Contributor role assignment

Your account must have owner permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Logic App Contributor** role on any resource group containing playbooks you want to run.

1. In the Azure portal, select the resource group that contains the playbook.
1. In the left pane, select **Access control (IAM)**.
1. Select **Role assignments**.
1. Select **Add** then **Add role assignment**.
1. Select search for **Logic App Contributor**, select it, and then select **Next**.
1. Select **Select members**.
1. Search for your account and select it.
1. Select **Select**.
1. Select **Next**.
1. Select **Review + assign**.

## Configure detection and response

There are detection query templates for SQLi and XSS attacks in Sentinel for Azure WAF. You can download these templates from the Content hub. By using these templates, you can create analytic rules that detect specific type of attack patterns in the WAF logs and further notify the security analyst by creating an incident. The automation section of these rules can help you respond to this incident by blocking the source IP of the attacker on the WAF policy, which then stops subsequent attacks upfront from these source IP addresses. Microsoft is continuously working to include more Detection Templates for more detection and response scenarios.

### Install the templates

1. From Microsoft Sentinel, under **Configuration** in the left pane, select **Analytics**.
1. At the top of the page, select **More content at Content hub**.
1. Search for **Azure Web Application Firewall**, select it and then select **Install**.

### Create an analytic rule

1. From Microsoft Sentinel, under **Configuration** in the left pane, select **Analytics**.
1. Select **Rule templates**. It may take a few minutes for the templates to appear.
1. Select the **Front Door Premium WAF - SQLi Detection** template.
1. On the right pane, select **Create rule**.
1. Accept all the defaults and continue through to **Automated response**. You can edit these settings later to customize the rule.
   > [!TIP]
   > If you see an error in the rule query, it might be because you don't have any WAF logs in your workspace. You can generate some logs by sending test traffic to your web app. For example, you can simulate a SQLi attack by sending a request like this: `http://x.x.x.x/?text1=%27OR%27%27=%27`. Replace `x.x.x.x` with your Front Door URL.

1. On the **Automated response** page, select **Add new**.
1. On the **Create new automation rule** page, type a name for the rule.
1. Under **Trigger**, select **When alert is created**.
1. Under **Actions**, select **Manage playbook permissions**.
1. On the **Manage permissions** page, select your resource group and select **Apply**.
1. Back on the **Create new automation rule** page, under **Actions** select the **Block-IPAzureWAF** playbook from the drop down list.
1. Select **Apply**.
1. Select **Next: Review + create**.
1. Select **Save**.

Once the Analytic rule is created with respective Automation rule settings, you're now ready for *Detection and Response*. The following flow of events happens during an attack: 

- Azure WAF logs traffic when an attacker attempts to target one of the web apps behind it. Sentinel then ingests these logs.
- The Analytic/Detection rule that you configured detects the pattern for this attack and generates an incident to notify an analyst. 
- The automation rule that is part of the analytic rule triggers the respective playbook that you configured previously. 
- The playbook creates a custom rule called *SentinelBlockIP* in the respective WAF policy, which includes the source IP of the attacker.
- WAF blocks subsequent attack attempts, and if the attacker tries to use another source IP, it appends the respective source IP to the block rule.

An important point is that by default Azure WAF blocks any malicious web attacks with the help of core ruleset of the Azure WAF engine. However, this automated detection and response configuration further enhances the security by modifying or adding new custom block rules on the Azure WAF policy for the respective source IP addresses. This ensures that the traffic from these source IP addresses gets blocked before it even hits the Azure WAF engine ruleset.

## Related content

- [Using Microsoft Sentinel with Azure Web Application Firewall](../waf-sentinel.md)
