---
title: Work with anomaly detection analytics rules in Azure Sentinel | Microsoft Docs
description: This article explains how to view, create, manage, assess, and fine-tune anomaly detection analytics rules in Azure Sentinel.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 04/28/2021
ms.author: yelevin
---
# Work with anomaly detection analytics rules in Azure Sentinel

> [!IMPORTANT]
>
> - Anomaly rules are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## View SOC-ML anomaly rule templates

Azure Sentinel’s [SOC-ML anomalies feature](soc-ml-anomalies.md) provides [built-in anomaly templates](tutorial-detect-threats-built-in.md#anomaly) for immediate value out-of-the-box. These anomaly templates were developed to be robust by using thousands of data sources and millions of events, but this feature also enables you to change thresholds and parameters for the anomalies easily within the user interface. Anomaly rules must be activated before they will generate anomalies, which you can find in the **Anomalies** table in the **Logs** section.

1. From the Azure Sentinel navigation menu, select **Analytics**.

1. In the **Analytics** blade, select the **Rule templates** tab.

1. Filter the list for **Anomaly** templates:

    1. Click the **Rule type** filter, then the drop-down list that appears below.

    1. Unmark **Select all**, then mark **Anomaly**.

    1. If necessary, click the top of the drop-down list to retract it, then click **OK**.

## Activate anomaly rules

When you click on one of the rule templates, you will see the following information in the details pane, along with a **Create rule** button:

- **Description** explains how the anomaly works and the data it requires.

- **Data sources** indicates the type of logs that need to be ingested in order to be analyzed.

- **Tactics** are the MITRE ATT&CK framework tactics covered by the anomaly.

- **Parameters** are the configurable attributes for the anomaly.

- **Threshold** is a configurable value that indicates the degree to which an event must be unusual before an anomaly is created.

- **Rule frequency** is the time between log processing jobs that find the anomalies.

- **Anomaly version** shows the version of the template that is used by a rule. If you want to change the version used by a rule that is already active, you must recreate the rule.

- **Template last updated** is the date the anomaly version was changed.

Complete the following steps to activate a rule:

1. Choose a rule template that is not already labeled **IN USE**. Click the **Create rule** button to open the rule creation wizard.

    The wizard for each rule template will be slightly different, but it has three steps or tabs: **General**, **Configuration**, **Review and create**.

    You can't change any of the values in the wizard; you first have to create and activate the rule.

1. Cycle through the tabs, wait for the "Validation passed" message on the **Review and create** tab, and select the **Create** button.

    You can only create one active rule from each template. Once you complete the wizard, an active anomaly rule is created in the **Active rules** tab, and the template (in the **Rule templates** tab) will be marked **IN USE**.

    > [!NOTE]
    > Assuming the required data is available, the new rule may still take up to 24 hours to appear in the **Active rules** tab. To view the new rules, select the Active rules tab and filter it the same way you filtered the Rule templates list above.

Once the anomaly rule is activated, detected anomalies will be stored in the **Anomalies** table in the **Logs** section of your Azure Sentinel workspace.

Each anomaly rule has a training period, and anomalies will not appear in the table until after that training period. You can find the training period in the description of each anomaly rule.

## Assess the quality of anomalies

You can see how well an anomaly rule is performing by reviewing a sample of the anomalies created by a rule over the last 24-hour period. 

1. From the Azure Sentinel navigation menu, select **Analytics**.

1. In the **Analytics** blade, check that the **Active rules** tab is selected.

1. Filter the list for **Anomaly** rules (as above).

1. Select the rule you want to assess, and copy its name from the top of the details pane to the right.

1. From the Azure Sentinel navigation menu, select **Logs**.

1. If a **Queries** gallery pops up over the top, close it.

1. Select the **Tables** tab on the left pane of the **Logs** blade.

1. Set the **Time range** filter to **Last 24 hours**.

1. Copy the Kusto query below and paste it in the query window (where it says "Type your query here or..."):

    ```kusto
    Anomalies 
    | where AnomalyTemplateName contains "________________________________"
    ```
    Paste the rule name you copied above in place of the underscores between the quotation marks.

1. Click **Run**. 

When you have some results, you can start assessing the quality of the anomalies. If you don’t have results, try increasing the time range.

Expand the results for each anomaly and then expand the **AnomalyReasons** field. This will tell you why the anomaly fired.

The "reasonableness" or "usefulness" of an anomaly may depend on the conditions of your environment, but a common reason for an anomaly rule to produce too many anomalies is that the threshold is too low.

## Tune anomaly rules

While anomaly rules are engineered for maximum effectiveness out of the box, every situation is unique and sometimes anomaly rules need to be tuned.

Since you can't edit an original active rule, you must first duplicate an active anomaly rule and then customize the copy.

The original anomaly rule will keep running until you either disable or delete it.

This is by design, to give you the opportunity to compare the results generated by the original configuration and the new one. Duplicate rules are disabled by default. You can only make one customized copy of any given anomaly rule. Attempts to make a second copy will fail.

1. To change the configuration of an anomaly rule, select the anomaly rule in the **Active rules** tab.

1. Right-click anywhere on the row of the rule, or left-click the ellipsis (...) at the end of the row, then click **Duplicate**.

1. The new copy of the rule will have the suffix " - Customized" in the rule name. To actually customize this rule, select this rule and click **Edit**.

1. The rule opens in the Analytics rule wizard. Here you can change the parameters of the rule and its threshold. The parameters that can be changed vary with each anomaly type and algorithm.

    You can preview the results of your changes in the **Results preview pane**. Click an **Anomaly ID** in the results preview to see why the ML model identifies that anomaly.

1. Enable the customized rule to generate results. Some of your changes may require the rule to re-run, so you must wait for it to finish and come back to check the results on the logs page. The customized anomaly rule runs in **Flighting** (testing) mode by default. The original rule continues to run in **Production** mode by default.

1. To compare the results, go back to the Anomalies table in **Logs** to [assess the new rule as before](#assess-the-quality-of-anomalies), only look for rows with the original rule name as well as the duplicate rule name with " - Customized" appended to it in the **AnomalyTemplateName** column.

    If you are satisfied with the results for the customized rule, you can go back to the **Active rules** tab, click on the customized rule, click the **Edit** button and on the **General** tab switch it from **Flighting** to **Production**. The original rule will automatically change to **Flighting** since you can't have two versions of the same rule in production at the same time. 

## Next steps

In this document, you learned how to work with SOC-ML anomaly detection analytics rules in Azure Sentinel.

- Get some background information about [SOC-ML](soc-ml-anomalies.md).
- Explore other [analytics rule types](tutorial-detect-threats-built-in.md).
