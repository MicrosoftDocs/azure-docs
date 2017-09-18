---
title: Custom Alert Rules in Azure Security Center  | Microsoft Docs
description: This document helps you to create custom alert rules in Azure Security Center.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: f335d8c4-0234-4304-b386-6f1ecda07833
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/18/2017
ms.author: yurid

---
# Custom Alert Rules in Azure Security Center (Preview)
This document helps you to create custom alert rules in Azure Security Center.

## What are custom alert rules in Security Center?

Security Center has a set of predefined [security alerts](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts), which are triggered when a threat, or suspicious activity takes place. In some scenarios you may want to create a custom alert to address specific needs of your environment. 

Custom alert rules in Security Center allows you to define new security alerts based on data that is already collected from your environment. You can create queries, and the result of these queries can be used as criteria for the custom rule, and once this criteria is matched, the rule is executed. You can use computers security events, partner's security solution logs or data ingested using APIs to create your custom queries. 

## How to create a custom alert rule in Security Center?

Follow these steps to create a custom alert rule Security Center:

1.	Open **Security Center** dashboard.
2.	In the left pane, under **Detection** click **Custom alert rules (Preview)**. 
3.	In the **Security Center – Custom alert rules (Preview)** page click **New custom alert rule**.

	![Custom alert](./media/security-center-custom-alert/security-center-custom-alert-fig1.png)
	
3. The Create custom alert rule page appears with the following options:
	![Create](./media/security-center-custom-alert/security-center-custom-alert-fig2.png)
5.	Type the name for this custom rule in the **Name** field.
6.	Type a brief description that reflects the intent of this rule in the **Description** field.
7.	Select the severity level (High, Medium, Low) according to your needs in the **Severity** field.
8.	Select the subscription in which this rule is applicable in the **Subscription** field.
9.	Select the workspace that contains the resources that you want to monitor with this rule in the **Workspace** field.
10.	In the **Search Query**  field, the query that you to use to obtain the results. The query’s result will trigger the alert. Notice that when you type a valid query, the green check mark appears in the right corner of this field:
	![Query](./media/security-center-custom-alert/security-center-custom-alert-fig3.png)

11. Select the time span in which the query above will be executed in the **Period** field. Notice that the search result in the bottom of this field will change the according to the time span that you select.

	![Period](./media/security-center-custom-alert/security-center-custom-alert-fig4.png)

12. In the **Evaluation** field select the frequency that this rule should be evaluated and executed.
13. In the **Number of results** field, select the operator greater than, or lower than.
14. In the **Threshold** field type a number that will be used as reference for the operator that was previous selected. 
15. **Enable Suppress Alerts** option if you want to set a time to wait before Security Center sends another alert for this rule.
16. Click **OK** to finish.

After you finish creating the new alert rule, it will appear in the list of custom alert rules. Once the conditions of that rule are met, a new alert will be triggered, and you can see in the **Security Alerts** dashboard.

![Alert](./media/security-center-custom-alert/security-center-custom-alert-fig5.png)

Notice that the parameters (search query, threshold, etc) that were established during the rule creation are available in the alert for this custom rule.

## See also
In this document, you learned how to create a custom alert rule in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Managing and responding to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts, and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understanding security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center Troubleshooting Guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center. 
* [Azure Security Center FAQ](security-center-faq.md). Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.

