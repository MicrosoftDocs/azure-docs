---
title: Detect new threats using Microsoft Sentinel with Azure Web Application Firewall 
description: This article shows you how to use Microsoft Sentinel with Azure Web Application Firewall (WAF) to detect new threats to your network.
services: web-application-firewall
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.date: 01/19/2024
ms.topic: how-to
---

# Detect new threats using Microsoft Sentinel with Azure Web Application Firewall

Web applications face frequent malicious attacks that exploit well-known vulnerabilities, such as Code Injection and Path Traversal Attacks. These attacks are hard to prevent in the application code, as they require constant maintenance, patching, and monitoring at multiple levels of the application architecture. A Web Application Firewall (WAF) solution can provide faster and centralized security by patching a known vulnerability for all web applications, rather than securing each one individually. Azure Web Application Firewall is a cloud-native service that protects web apps from common web-hacking techniques. It can be deployed quickly to gain full visibility into the web application traffic and block malicious web attacks.

By integrating Azure WAF with Microsoft Sentinel (a cloud native [SIEM](https://www.microsoft.com/en-us/security/business/security-101/what-is-siem) solution), you can automate the detection and response to threats/incidents/alerts and save time and effort updating the WAF policy. This article shows you how to build Analytic rules/detections in Microsoft Sentinel for attacks such as Code Injection.

## Detection queries for web application attacks

The [Azure Network Security GitHub repository](https://github.com/Azure/Azure-Network-Security/tree/9170800bbb0322ca1c904803954fbb477dff8421/Azure%20WAF/Playbook%20-%20Sentinel%20additional%20detections) contains the following pre-built queries that you can use to create analytic rules in Microsoft Sentinel. These analytic rules help with automated detection and response for attacks like Code Injection, Path Traversal and scanner-based attacks.

- **Code Injection attacks (Application Gateway and Front Door WAF)**

   A code injection attack is a type of cyberattack that involves injecting malicious code into an application. The application then interprets or runs the code, affecting the performance and function of the application.
- **Path Traversal attacks (Application Gateway and Front Door WAF)**

   A path traversal attack is a type of cyberattack that involves manipulating the file paths of an application to access files and directories that are stored outside the web root folder. The attacker can use special character sequences, such as `…/` or `…\`, to move up the directory hierarchy and access sensitive or confidential data, such as configuration files, source code, or system files.
- **Scanner-based attacks (Application Gateway WAF)**

   A scanner-based web attack is a type of cyberattack that involves using a web vulnerability scanner to find and exploit security weaknesses in web applications. A web vulnerability scanner is a tool that automatically scans web applications for common vulnerabilities, such as SQL injection, XSS, CSRF, and path traversal. The attacker can use the scanner to identify the vulnerable targets and launch attacks to compromise them.

## Set up analytic rules in Sentinel for web application attacks

The following prerequisites are required to set up analytic rules:

- A working WAF and a Log Analytics Workspace that is configured to receive logs from the respective Azure Application Gateway or Azure Front Door. For more information, see [Resource logs for Azure Web Application Firewall](ag/web-application-firewall-logs.md).
- Additionally, Microsoft Sentinel should be enabled for the Log Analytics Workspace that is being used here. For more information, see [Quickstart: Onboard Microsoft Sentinel](../sentinel/quickstart-onboard.md).

Use the following steps to configure an analytic rule in Sentinel.

1. Navigate to Microsoft Sentinel and select the **Analytics** tab. Select **Create** and then select **Scheduled query rule**.
   :::image type="content" source="media/waf-new-threat-detection/scheduled-query-rule.png" alt-text="Screenshot showing creating a scheduled query rule." lightbox="media/waf-new-threat-detection/scheduled-query-rule.png":::

   The tactics and techniques provided here are informational only and are sourced from [MITRE Attack Knowledgebase](https://attack.mitre.org/) This is a knowledge base of adversary tactics and techniques based on real-world observations.

1. You can use the Analytics rule wizard to set a severity level for this incident. Since these are major attacks, High Severity is selected.

   :::image type="content" source="media/waf-new-threat-detection/analytics-rule-wizard.png" alt-text="Screenshot showing the analytics rule wizard." lightbox="media/waf-new-threat-detection/analytics-rule-wizard.png":::

1. On the **Set rule logic** page, enter the following prebuilt Code Injection query: You can find this query in the [Azure Network Security GitHub repository](https://github.com/Azure/Azure-Network-Security/blob/9170800bbb0322ca1c904803954fbb477dff8421/Azure%20WAF/Playbook%20-%20Sentinel%20additional%20detections/Code-Injection-AppGW-WAF-CRS3-2.json). Likewise, you can use any other query that is available in the repository to create Analytic rules and detect respective attack patterns.

   ```
    let Threshold = 3; 
    AzureDiagnostics
    | where Category == "ApplicationGatewayFirewallLog"
    | where action_s == "Matched"
    | where Message has "Injection" or Message has "File Inclusion"
    | where ruleGroup_s == "REQUEST-932-APPLICATION-ATTACK-RCE" or ruleGroup_s ==    "REQUEST-931-APPLICATION-ATTACK-RFI" or ruleGroup_s == "REQUEST-932-APPLICATION-ATTACK-RCE" or    ruleGroup_s == "REQUEST-933-APPLICATION-ATTACK-PHP" or ruleGroup_s ==    "REQUEST-942-APPLICATION-ATTACK-SQLI" or ruleGroup_s == "REQUEST-921-PROTOCOL-ATTACK" or ruleGroup_s    == "REQUEST-941-APPLICATION-ATTACK-XSS"
    | project transactionId_g, hostname_s, requestUri_s, TimeGenerated, clientIp_s, Message,    details_message_s, details_data_s
    | join kind = inner(
    AzureDiagnostics
    | where Category == "ApplicationGatewayFirewallLog"
    | where action_s == "Blocked") on transactionId_g
    | extend Uri = strcat(hostname_s,requestUri_s)
    | summarize StartTime = min(TimeGenerated), EndTime = max(TimeGenerated), TransactionID = make_set   (transactionId_g,100), Message = make_set(Message,100), Detail_Message = make_set(details_message_s,   100), Detail_Data = make_set(details_data_s,100), Total_TransactionId = dcount(transactionId_g) by    clientIp_s, Uri, action_s
    | where Total_TransactionId >= Threshold
   ```
   :::image type="content" source="media/waf-new-threat-detection/rule-query.png" alt-text="Screenshot showing the rule query." lightbox="media/waf-new-threat-detection/rule-query.png":::
   > [!NOTE]
   > It is important to ensure that the WAF logs are already in the Log Analytics Workspace before you create this Analytical rule. Otherwise, Sentinel will not recognize some of the columns in the query and you will have to add extra input like `| extend action_s = column_ifexists(“action_s”, “”), transactionId_g = column_ifexists(“transactionId_g”, “”)` for each column that gives an error. This input creates the column names manually and assigns them null values. To skip this step, send the WAF logs to the workspace first.

1. On the **Incident Settings** page, Enable the **Create incidents from alerts triggered by this analytics rule.** The alert grouping can be configured as required.
1. Optionally, you can also add any automated response to the incident if needed. See [Automated detection and response for Azure WAF with Microsoft Sentinel](afds/automated-detection-response-with-sentinel.md) for more detailed information on automated response configuration.
1. Finally, select **Save** on the **Review and create** tab.


This analytic rule enables Sentinel to create an incident based on the WAF logs that record any Code Injection attacks. The Azure WAF blocks these attacks by default, but the incident creation provides more support for the security analyst to respond to future threats.

You can configure Analytic Rules in Sentinel for various web application attacks using the pre-built detection queries available in the [Azure Network Security GitHub repository](https://github.com/Azure/Azure-Network-Security/blob/9170800bbb0322ca1c904803954fbb477dff8421/Azure%20WAF/Playbook%20-%20Sentinel%20additional%20detections/Code-Injection-AppGW-WAF-CRS3-2.json). These queries will be added directly to Sentinel Detection Templates. Once added, these queries will be directly available in the Analytic Rule Templates section of Sentinel.

 
## Next steps

- [Learn more about Microsoft Sentinel](../sentinel/overview.md)
- [Learn more about Azure Monitor Workbooks](/azure/azure-monitor/visualize/workbooks-overview)
