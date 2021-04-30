---
title: Adaptive application controls in Azure Security Center
description: This document helps you use adaptive application control in Azure Security Center to allow list applications running in Azure machines.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 04/21/2021
ms.author: memildin

---
# Use adaptive application controls to reduce your machines' attack surfaces

Learn about the benefits of Azure Security Center's adaptive application controls and how you can enhance your security with this data-driven, intelligent feature.


## What are Security Center's adaptive application controls?

Adaptive application controls are an intelligent and automated solution for defining allow lists of known-safe applications for your machines. 

Often, organizations have collections of machines that routinely run the same processes. Security Center uses machine learning to analyze the applications running on your machines and create a list of the known-safe software. Allow lists are based on your specific Azure workloads, and you can further customize the recommendations using the instructions below.

When you've enabled and configured adaptive application controls, you'll get security alerts if any application runs other than the ones you've defined as safe.


## What are the benefits of adaptive application controls?

By defining lists of known-safe applications, and generating alerts when anything else is executed, you can achieve multiple hardening goals:

- Identify potential malware, even any that might be missed by antimalware solutions
- Improve compliance with local security policies that dictate the use of only licensed software
- Avoid running old or unsupported applications
- Prevent specific software that's banned by your organization
- Increase oversight of apps that access sensitive data

No enforcement options are currently available. Adaptive application controls are intended to provide security alerts if any application runs other than the ones you've defined as safe.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|Requires [Azure Defender for servers](defender-for-servers-introduction.md)|
|Supported machines:|![Yes](./media/icons/yes-icon.png) Azure and non-Azure machines running Windows and Linux<br>![Yes](./media/icons/yes-icon.png) [Azure Arc](../azure-arc/index.yml) machines|
|Required roles and permissions:|**Security Reader** and **Reader** roles can both view groups and the lists of known-safe applications<br>**Contributor** and **Security Admin** roles can both edit groups and the lists of known-safe applications|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||



## Enable application controls on a group of machines

If Security Center has identified groups of machines in your subscriptions that consistently run a similar set of applications, you'll be prompted with the following recommendation: **Adaptive application controls for defining safe applications should be enabled on your machines**.

Select the recommendation, or open the adaptive application controls page to view the list of suggested known-safe applications and groups of machines.

1. Open the Azure Defender dashboard and from the advanced protection area, select **Adaptive application controls**.

    :::image type="content" source="./media/security-center-adaptive-application/opening-adaptive-application-control.png" alt-text="Opening adaptive application controls from the Azure Dashboard" lightbox="./media/security-center-adaptive-application/opening-adaptive-application-control.png":::

    The **Adaptive application controls** page opens with your VMs grouped into the following tabs:

    - **Configured** - Groups of machines that already have a defined allow list of applications. For each group, the configured tab shows:
        - the number of machines in the group
        - recent alerts

    - **Recommended** - Groups of machines that consistently run the same applications, and don't have an allow list configured. We recommend that you enable adaptive application controls for these groups.
    
      > [!TIP]
      > If you see a group name with the prefix "REVIEWGROUP", it contains machines with a a partially consistent list of applications. Security Center can't see a pattern but recommends reviewing this group to see whether _you_ can manually define some adaptive application controls rules as described in [Editing a group's adaptive application controls rule](#edit-a-groups-adaptive-application-controls-rule).
      >
      > You can also move machines from this group to other groups as described in [Move a machine from one group to another](#move-a-machine-from-one-group-to-another).

    - **No recommendation** - Machines without a defined allow list of applications, and which don't support the feature. Your machine might be in this tab for the following reasons:
      - It's missing a Log Analytics agent
      - The Log Analytics agent isn't sending events
      - It's a Windows machine with a pre-existing [AppLocker](/windows/security/threat-protection/windows-defender-application-control/applocker/applocker-overview) policy enabled by either a GPO or a local security policy

      > [!TIP]
      > Security Center needs at least two weeks of data to define the unique recommendations per group of machines. Machines that have recently been created, or which belong to subscriptions that were only recently enabled with Azure Defender, will appear under the **No recommendation** tab.


1. Open the **Recommended** tab. The groups of machines with recommended allow lists appears.

   ![Recommended tab](./media/security-center-adaptive-application/adaptive-application-recommended-tab.png)

1. Select a group. 

1. To configure your new rule, review the various sections of this **Configure application control rules** page and the contents, which will be unique to this specific group of machines:

   ![Configure a new rule](./media/security-center-adaptive-application/adaptive-application-create-rule.png)

   1. **Select machines** - By default, all machines in the identified group are selected. Unselect any to removed them from this rule.
   
   1. **Recommended applications** - Review this list of applications that are common to the machines within this group, and recommended to be allowed to run.
   
   1. **More applications** - Review this list of applications that are either seen less frequently on the machines within this group, or are known to be exploitable. A warning icon indicates that a specific application could be used by an attacker to bypass an application allow list. We recommend that you carefully review these applications.

      > [!TIP]
      > Both application lists include the option to restrict a specific application to certain users. Adopt the principle of least privilege whenever possible.
      > 
      > Applications are defined by their publishers, if an application doesn't have publisher information (it's unsigned), a path rule is created for the full path of the specific application.

   1. To apply the rule, select **Audit**. 




## Edit a group's adaptive application controls rule

You might decide to edit the allow list for a group of machines because of known changes in your organization. 

To edit the rules for a group of machines:

1. Open the Azure Defender dashboard and from the advanced protection area, select **Adaptive application controls**.

1. From the **Configured** tab, select the group with the rule you want to edit.

1. Review the various sections of the **Configure application control rules** page as described in [Enable adaptive application controls on a group of machines](#enable-application-controls-on-a-group-of-machines).

1. Optionally, add one or more custom rules:

   1. Select **Add rule**.

      ![Add a custom rule](./media/security-center-adaptive-application/adaptive-application-add-custom-rule.png)

   1. If you're defining a known safe path, change the **Rule type** to 'Path' and enter a single path. You can include wildcards in the path.
   
      > [!TIP]
      > Some scenarios for which wildcards in a path might be useful:
      > 
      > * Using a wildcard at the end of a path to allow all executables within this folder and sub-folders.
      > * Using a wildcard in the middle of a path to enable a known executable name with a changing folder name (for example, personal user folders containing a known executable, automatically generated folder names, etc).
  
   1. Define the allowed users and protected file types.

   1. When you've finished defining the rule, select **Add**.

1. To apply the changes, select **Save**.


## Review and edit a group's settings

1. To view the details and settings of your group, select **Group settings**

    This pane shows the name of the group (which can be modified), the OS type, the location, and other relevant details.

    :::image type="content" source="./media/security-center-adaptive-application/adaptive-application-group-settings.png" alt-text="The group settings page for adaptive application controls" lightbox="./media/security-center-adaptive-application/adaptive-application-group-settings.png":::

1. Optionally, modify the group's name or file type protection modes.

1. Select **Apply** and **Save**.



## Respond to the "Allowlist rules in your adaptive application control policy should be updated" recommendation

You'll see this recommendation when Security Center's machine learning identifies potentially legitimate behavior that hasn't previously been allowed. The recommendation suggests new rules for your existing definitions to reduce the number of false positive alerts.

To remediate the issues:

1. From the recommendations page, select the **Allowlist rules in your adaptive application control policy should be updated** recommendation to see groups with newly identified, potentially legitimate behavior.

1. Select the group with the rule you want to edit.

1. Review the various sections of the **Configure application control rules** page as described in [Enable adaptive application controls on a group of machines](#enable-application-controls-on-a-group-of-machines).

1. To apply the changes, select **Audit**.




## Audit alerts and violations

1. Open the Azure Defender dashboard and from the advanced protection area, select **Adaptive application controls**.

1. To see groups with machines that have recent alerts, review the groups listed in the **Configured** tab.

1. To investigate further, select a group.

   ![Recent alerts](./media/security-center-adaptive-application/recent-alerts.png)

1. For further details, and the list of affected machines, select an alert.

    The alerts page shows the more details of the alerts and provides a **Take action** link with recommendations of how to mitigate the threat.

    :::image type="content" source="media/security-center-adaptive-application/adaptive-application-alerts-start-time.png" alt-text="The start time of adaptive application controls alerts is the ":::

    > [!NOTE]
    > Adaptive application controls calculates events once every twelve hours. The "activity start time" shown in the alerts page is the time that adaptive application controls created the alert, **not** the time that the suspicious process was active.


## Move a machine from one group to another

When you move a machine from one group to another, the application control policy applied to it changes to the settings of the group that you moved it to. You can also move a machine from a configured group to a non-configured group, doing so removes any application control rules that were applied to the machine.

1. Open the Azure Defender dashboard and from the advanced protection area, select **Adaptive application controls**.

1. From the **Adaptive application controls** page, from the **Configured** tab, select the group containing the  machine to be moved.

1. Open the list of  **Configured machines**.

1. Open the machine's menu from three dots at the end of the row, and select **Move**. The **Move machine to a different group** pane opens.

1. Select the destination group, and select **Move machine**.

1. To save your changes, select **Save**.





## Manage application controls via the REST API 

To manage your adaptive application controls programatically, use our REST API. 

The relevant API documentation is available in [the Adaptive Application Controls section of Security Center's API docs](/rest/api/securitycenter/adaptiveapplicationcontrols).

Some of the functions that are available from the REST API:

* **List** retrieves all your group recommendations and provides a JSON with an object for each group.

* **Get** retrieves the JSON with the full recommendation data (that is, list of machines, publisher/path rules, and so on).

* **Put** configures your rule (use the JSON you retrieved with **Get** as the body for this request).
 
   > [!IMPORTANT]
   > The **Put** function expects fewer parameters than the JSON returned by the Get command contains.
   >
   > Remove the following properties before using the JSON in the Put request: recommendationStatus, configurationStatus, issues, location, and sourceSystem.


## FAQ - Adaptive application controls

- [Are there any options to enforce the application controls?](#are-there-any-options-to-enforce-the-application-controls)
- [Why do I see a Qualys app in my recommendeded applications?](#why-do-i-see-a-qualys-app-in-my-recommendeded-applications)

### Are there any options to enforce the application controls?
No enforcement options are currently available. Adaptive application controls are intended to provide **security alerts** if any application runs other than the ones you've defined as safe. They have a range of benefits ([What are the benefits of adaptive application controls?](#what-are-the-benefits-of-adaptive-application-controls)) and are extremely customizable as shown on this page.

### Why do I see a Qualys app in my recommendeded applications?
[Azure Defender for servers](defender-for-servers-introduction.md) includes vulnerability scanning for your machines at no extra cost. You don't need a Qualys license or even a Qualys account - everything's handled seamlessly inside Security Center. For details of this scanner and instructions for how to deploy it, see [Defender's integrated vulnerability assessment solution](deploy-vulnerability-assessment-vm.md).

To ensure no alerts are generated when Security Center deploys the scanner, the adaptive application controls recommended allow list includes the scanner for all machines. 


## Next steps
In this document, you learned how to use adaptive application control in Azure Security Center to define allow lists of applications running on your Azure and non-Azure machines. To learn more about some of Security Center's other cloud workload protection features, see:

* [Understanding just-in-time (JIT) VM access](just-in-time-explained.md)
* [Securing your Azure Kubernetes clusters](defender-for-kubernetes-introduction.md)