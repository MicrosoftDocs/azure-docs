---
title: Configure security analytics for Azure Active Directory B2C data with Microsoft Sentinel
titleSuffix: Azure AD B2C
description: Use Microsoft Sentinel to perform security analytics for Azure Active Directory B2C data.
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 03/03/2023
ms.author: gasinh
ms.subservice: B2C
#Customer intent: As an IT professional, I want to gather logs and audit data using Microsoft Sentinel and Azure Monitor to secure applications that use Azure Active Directory B2C.
---

# Tutorial: Configure security analytics for Azure Active Directory B2C data with Microsoft Sentinel

Increase the security of your Azure Active Directory B2C (Azure AD B2C) environment by routing logs and audit information to Microsoft Sentinel. The scalable Microsoft Sentinel is a cloud-native, security information and event management (SIEM) and security orchestration, automation, and response (SOAR) solution. Use the solution for alert detection, threat visibility, proactive hunting, and threat response for Azure AD B2C.

See, [What is Microsoft Sentinel?](../sentinel/overview.md)

More uses for Microsoft Sentinel, with Azure AD B2C, are:

* Detect previously undetected threats and minimize false positives with analytics and threat intelligence features
* Investigate threats with artificial intelligence (AI)
  * Hunt for suspicious activities at scale, and benefit from the experience of years of cybersecurity work at Microsoft
* Respond to incidents rapidly with common taske orchestration and automation 
* Meet your organization's security and compliance requirements 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Transfer Azure AD B2C logs to a Log Analytics workspace
> * Enable Microsoft Sentinel in a Log Analytics workspace
> * Create a sample rule in Microsoft Sentinel to trigger an incident
> * Configure an automated response

## Configure Azure AD B2C with Azure Monitor Log Analytics

To define where logs and metrics for a resource are sent, 

1. Enable **Diagnostic settings** in Azure AD, in your Azure AD B2C tenant.
2. Configure Azure AD B2C to send logs to Azure Monitor.

Learn more, [Monitor Azure AD B2C with Azure Monitor](./azure-monitor.md).

## Deploy a Microsoft Sentinel instance

After you configure your Azure AD B2C instance to send logs to Azure Monitor, enable an instance of Microsoft Sentinel.

>[!IMPORTANT]
>To enable Microsoft Sentinel, obtain Contributor permissions to the subscription in which the Microsoft Sentinel workspace resides. To use Microsoft Sentinel, use Contributor or Reader permissions on the resource group to which the workspace belongs.

1. Go to the [Azure portal](https://portal.azure.com). 
2. Select the subscription where the Log Analytics workspace is created.
3. Search for and select **Microsoft Sentinel**.

   ![Screenshot of Azure Sentinel entered into the search field and the Azure Sentinel option that appears.](./media/azure-sentinel/azure-sentinel-add.png)

3. Select **Add**.
4. In the **search workspaces** field, select the new workspace.

   ![Screenshot of the search workspaces field under Choose a workspace to add to Azure Sentinel.](./media/azure-sentinel/create-new-workspace.png)

5. Select **Add Microsoft Sentinel**.

>[!NOTE]
>It's possible to run Microsoft Sentinel on more than one workspace, however data is isolated in a single workspace.</br> See, [Quickstart: Onboard Microsoft Sentinel](../sentinel/quickstart-onboard.md)

## Create a Microsoft Sentinel rule

After you enable Microsoft Sentinel, get notified when something suspicious occurs in your Azure AD B2C tenant.

You can create custom analytics rules to discover threats and anomalous behaviors in your environment. These rules search for specific events, or event sets, and alert you when event thresholds or conditions are met. Then incidents are generated for investigation.

See, [Create custom analytics rules to detect threats](../sentinel/detect-threats-custom.md)

>[!NOTE]
>Microsoft Sentinel has templates to create threat detection rules that search your data for suspicious activity. There are no native Azure AD B2C connectors at this time. For this tutorial, you create a rule.

### Notification rule for unsuccessful forced access

Use the following steps to receive notification about two or more unsuccessful, forced access attempts into your environment. An example is brute-force attack. 

1. In Microsoft Sentinel, from the left menu, select **Analytics**.
2. On the top bar, select **+ Create** > **Scheduled query rule**. 

   ![Screenshot of the Create option under Analytics.](./media/azure-sentinel/create-scheduled-rule.png)

3. In the Analytics Rule wizard, go to the **General**.
4. For **Name**, enter a name for unsuccessful logins.
5. For **Description**, indicate the rule notifies for two or more unsuccessful sign-ins, within 60 seconds
6. For **Tactics**, select a category. For example, select **PreAttack**.
7. For **Severity**, select a severity level.
8. **Status** is **Enabled** by default. To change a rule, go to the **Active rules** tab.

   ![Screenshot of Create new rule with options and selections.](./media/azure-sentinel/create-new-rule.png)

4. Select the **Set rule logic** tab.
5. Enter a query in the **Rule query** field. The query example organizes the sign-ins by `UserPrincipalName`.

    ![Screenshot of query text in the Rule query field under Set rule logic.](./media/azure-sentinel/rule-query.png)

5. Go to **Query scheduling**.
6. For **Run query every**, enter **5** and **Minutes**.
7. For **Lookup data from the last**, enter **5** and **Minutes**.
8. For **Generate alert when number of query results**, select **Is greater than**, and **0**.
9. For **Event grouping**, select **Group all events into a single alert**. 
10. For **Stop running query after alert is generated**, select **Off**.
11. Select **Next: Incident settings (Preview)**. 

   ![Screenshot of Query scheduling selections and options.](./media/azure-sentinel/query-scheduling.png)

12. Go to the **Review and create** tab to review rule settings. 
13. When the **Validation passed** banner appears, select **Create**.

    ![Screenshot of selected settings, the Validation passed banner, and the Create option.](./media/azure-sentinel/review-create.png)

8. View the rule and the incidents that it generates. Find your newly created custom rule of type **Scheduled** in the table under the **Active rules** tab on the main **Analytics** screen. From this list, you can edit, enable, disable, or delete rules by using the corresponding buttons.

    ![Screenshot that shows active rules with options to edit, enable, disable or delete.](./media/azure-sentinel/rule-crud.png)

9. View the results of your new rule for Azure AD B2C unsuccessful logins. Go to the **Incidents** page, where you can triage, investigate, and remediate the threats. 

    An incident can include multiple alerts. It's an aggregation of all the relevant evidence for a specific investigation. You can set properties such as severity and status at the incident level.

    > [!NOTE]
    > A key feature of Microsoft Sentinel is [incident investigation](../sentinel/investigate-cases.md).
    
10. To begin an investigation, select a specific incident. 

    On the right, you can see detailed information for the incident. This information includes severity, entities involved, the raw events that triggered the incident, and the incident's unique ID.

    ![Screenshot that shows incident information.](./media/azure-sentinel/select-incident.png)

11. Select **View full details** on the incident pane. Review the tabs that summarize the incident information and provide more details.

    ![Screenshot that shows tabs for incident information.](./media/azure-sentinel/full-details.png)

12. Select **Evidence** > **Events** > **Link to Log Analytics**. The result displays the `UserPrincipalName` value of the identity that's trying to log in with the number of attempts.

    ![Screenshot that shows full details of a selected incident.](./media/azure-sentinel/logs.png)

## Automated response

Microsoft Sentinel provides a [robust SOAR capability](../sentinel/automation-in-azure-sentinel.md). Automated actions, called a *playbook* in Microsoft Sentinel, can be attached to analytics rules to suit your requirements.

In this example, we add an email notification for an incident that the rule creates. To accomplish this task, use an [existing playbook from the Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Incident-Email-Notification). After the playbook is configured, edit the existing rule and select the playbook on the **Automated response** tab.

![Screenshot that shows the image configuration screen for the automated response associated with a rule.](./media/azure-sentinel/automation-tab.png)

## Related information

For more information about Microsoft Sentinel and Azure AD B2C, see:

- [Sample workbooks](https://github.com/azure-ad-b2c/siem#workbooks)

- [Microsoft Sentinel documentation](../sentinel/index.yml)

## Next steps

> [!div class="nextstepaction"]
> [Handle false positives in Microsoft Sentinel](../sentinel/false-positives.md)
