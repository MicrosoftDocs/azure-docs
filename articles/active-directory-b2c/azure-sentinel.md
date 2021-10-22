---
title: Secure Azure AD B2C with Azure Sentinel
titleSuffix: Azure AD B2C
description: Tutorial to perform security analytics for Azure Active Directory B2C data with Azure Sentinel
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/17/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure security analytics for Azure Active Directory B2C data with Azure Sentinel

You can further secure your Azure Active Directory (AD) B2C environment by routing logs and audit information to Azure Sentinel. Azure Sentinel is a cloud-native
Security Information Event Management (SIEM) and Security Orchestration Automated Response (SOAR) solution. Azure Sentinel
provides alert detection, threat visibility, proactive hunting, and threat response for Azure AD B2C.

By using Azure Sentinel with Azure AD B2C, you can:

- Detect previously undetected threats and minimize false positives using Microsoft's analytics and unparalleled threat intelligence.
- Investigate threats with artificial intelligence. Hunt for suspicious activities at scale, tap into years of cybersecurity-related work at Microsoft.
- Respond to incidents rapidly with built-in orchestration and automation of common tasks.
- Meet security and compliance requirements for your organization.

In this tutorial, you'll learn to:

1. [Transfer the Azure AD B2C logs to Azure Monitor logs workspace](#configure-azure-ad-b2c-with-azure-monitor-logs-analytics)
2. [Enable Azure Sentinel on a Log analytics workspace](#deploy-an-azure-sentinel-instance)
3. [Create a sample rule in Azure Sentinel that will trigger an incident](#create-an-azure-sentinel-rule)
4. [Configure automated response](#automated-response)

## Configure Azure AD B2C with Azure Monitor logs analytics

Enable **Diagnostic settings** in Azure AD within your Azure AD B2C tenant to define where logs and metrics for a resource should be sent.

Then after, [configure Azure AD B2C to send logs to Azure Monitor](./azure-monitor.md).

## Deploy an Azure Sentinel instance

>[!IMPORTANT]
>To enable Azure Sentinel, you need **contributor permissions** to the subscription in which the Azure Sentinel workspace resides. To use Azure Sentinel, you need either contributor or reader permissions on the resource group that the workspace belongs to.

Once you've configured your Azure AD B2C instance to send logs to Azure Monitor, you need to enable an Azure Sentinel instance.

1. Go to the [Azure portal](https://portal.azure.com). Select the subscription where the log analytics workspace is created.

2. Search for and select **Azure Sentinel**.

3. Select **Add**.

![image shows search for Azure Sentinel in the Azure portal](./media/azure-sentinel/azure-sentinel-add.png)

4. Select the new workspace.

![image select the sentinel workspace](./media/azure-sentinel/create-new-workspace.png)

5. Select **Add Azure Sentinel**.

>[!NOTE]
>You can [run Azure Sentinel](../sentinel/quickstart-onboard.md) on more than one workspace, but the data is isolated to a single workspace.

## Create an Azure Sentinel rule

>[!NOTE]
>Azure Sentinel provides out-of-the-box, built-in templates to help you create threat detection rules designed by Microsoft's team of security experts and analysts. Rules created from these templates automatically search across your data for any suspicious activity. There are no native Azure AD B2C connectors available at this time. For the example in this tutorial, we'll create our own rule.

Now that you've enabled Azure Sentinel, get notified when something suspicious occurs in your Azure AD B2C tenant.

You can create [custom analytics rules](../sentinel/detect-threats-custom.md) to discover threats and
anomalous behaviors that are present in your environment. These rules search for specific events or sets of events, alert you when certain event thresholds or conditions are reached. Then after, generate incidents for further investigation.

In the following example, we explain the scenario where you receive a notification if someone is trying to force access to your environment but they aren't successful. It could mean a brute-force attack. You want to get notified for two or more non-successful logins within 60 seconds.

1. From the Azure Sentinel navigation menu, select **Analytics**.

2. In the action bar at the top, select **+ Create** and select
   **Scheduled query rule**. This will open the **Analytics rule wizard**.

![image shows select create scheduled query rule](./media/azure-sentinel/create-scheduled-rule.png)

3. In the Analytics rule wizard, go to the **General** tab.

   | Field | Value |
   |:--|:--|
   |Name | B2C non-successful logins |
   |Description | Notify on two or more non-successful logins within 60 seconds |
   | Tactics | Choose from the categories of attacks by which to classify the rule. These categories are based on the tactics of the [MITRE ATT&CK](https://attack.mitre.org/) framework.<BR>For our example, we'll choose `PreAttack` <BR> MITRE ATT&CK® is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations. The ATT&CK knowledge base is used as a foundation for the development of specific threat models and methodologies.
   | Severity | As appropriate |
   | Status | When you create the rule, its Status is `Enabled` by default, which means it will run immediately after you finish creating it. If you don't want it to run immediately, select `Disabled`, and the rule will be added to your Active rules tab and you can enable it from there when you need it.|

![image provide basic rule properties](./media/azure-sentinel/create-new-rule.png)

4.  To define the rule query logic and configure settings, in the **Set rule logic** tab, write a query directly in the
**Rule query** field. This query will alert you when there are two or more non-successful logins within 60 seconds to your Azure AD B2C tenant and will organize by `UserPrincipalName`.

![image shows enter the rule query in the logic tab](./media/azure-sentinel/rule-query.png)

In the Query scheduling section, set the following parameters:

![image set query scheduling parameters](./media/azure-sentinel/query-scheduling.png)

5. Select **Next:Incident settings (Preview)**. You'll configure and add the Automated response later.

6. Go to the **Review and create** tab to review all the
   settings for your new alert rule. When the **Validation passed** message appears, select **Create** to initialize your alert rule.

![image review and create rule](./media/azure-sentinel/review-create.png)

7. View the rule and incidents it generates. Find your newly created custom rule of type **Scheduled** in the table under the **Active rules** tab on the main **Analytics** screen. From this list you can **edit**, **enable**, **disable**, or **delete** rules.

![image analytics screen showing options to edit, enable, disable or delete rules](./media/azure-sentinel/rule-crud.png)

8. View the results of your new Azure AD B2C non-successful logins rule. Go to the **Incidents** page, where you can triage, investigate, and remediate the threats. An incident can include multiple alerts. It's an aggregation of all the relevant evidence for a specific investigation. You can set properties such as severity and status at the incident level.

>[!Note]
>A key feature of Azure Sentinel is [incident investigation](../sentinel/investigate-cases.md).

9. To begin the investigation, select a specific incident. On the
right, you can see detailed information for the incident including its severity, entities involved, the raw events that triggered the incident, and the incident's unique ID.

![image alt-text="incident screen](./media/azure-sentinel/select-incident.png)

10. Select **View full details** in the incident page and review the relevant tabs that summarize the incident information and provides more details.

![image rule 73](./media/azure-sentinel/full-details.png)

11. Select **Evidence** > **Events** > **Link to Log Analytics**. The result will display the `UserPrincipalName` of the identity trying to log in with the number of attempts.

![image details of selected incident](./media/azure-sentinel/logs.png)

## Automated response

Azure Sentinel provides a [robust SOAR capability](../sentinel/automation-in-azure-sentinel.md). Automated actions, called a Playbook in Azure Sentinel can be attached to analytics rules to suit your requirements.

In this example, we add an email notification upon an incident created by the rule. Use an [existing playbook from the Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Incident-Email-Notification) to accomplish this task. Once the playbook is configured, edit the existing rule and select the playbook into the Automation tab.

![image configuration screen for the automated response associated to a rule](./media/azure-sentinel/automation-tab.png)

## Next steps

- [Handle false positives in Azure Sentinel](../sentinel/false-positives.md)

- [Sample workbooks](https://github.com/azure-ad-b2c/siem#workbooks)

- [Azure Sentinel documentation](../sentinel/index.yml)