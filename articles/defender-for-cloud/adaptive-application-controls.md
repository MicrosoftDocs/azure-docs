---
title: Adaptive application controls
description: This document helps you use adaptive application control in Microsoft Defender for Cloud to create an allowlist of applications running for Azure machines.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 08/09/2023

---
# Use adaptive application controls to reduce your machines' attack surfaces

Learn about the benefits of Microsoft Defender for Cloud's adaptive application controls and how you can enhance your security with this data-driven, intelligent feature.

## What are adaptive application controls?

Adaptive application controls are an intelligent and automated solution for defining allowlists of known-safe applications for your machines.

Often, organizations have collections of machines that routinely run the same processes. Microsoft Defender for Cloud uses machine learning to analyze the applications running on your machines and create a list of the known-safe software. Allowlists are based on your specific Azure workloads, and you can further customize the recommendations using the following instructions.

When you've enabled and configured adaptive application controls, you'll get security alerts if any application runs other than the ones you've defined as safe.

## What are the benefits of adaptive application controls?

By defining lists of known-safe applications, and generating alerts when anything else is executed, you can achieve multiple oversight and compliance goals:

- Identify potential malware, even any that might be missed by antimalware solutions
- Improve compliance with local security policies that dictate the use of only licensed software
- Identify outdated or unsupported versions of applications
- Identify software that's banned by your organization but is nevertheless running on your machines
- Increase oversight of apps that access sensitive data

No enforcement options are currently available. Adaptive application controls are intended to provide security alerts if any application runs other than the ones you've defined as safe.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
|Supported machines:|:::image type="icon" source="./media/icons/yes-icon.png"::: Azure and non-Azure machines running Windows and Linux<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Azure Arc](../azure-arc/index.yml) machines|
|Required roles and permissions:|**Security Reader** and **Reader** roles can both view groups and the lists of known-safe applications<br>**Contributor** and **Security Admin** roles can both edit groups and the lists of known-safe applications|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts|

## Enable application controls on a group of machines

If Microsoft Defender for Cloud has identified groups of machines in your subscriptions that consistently run a similar set of applications, you'll be prompted with the following recommendation: **Adaptive application controls for defining safe applications should be enabled on your machines**.

Select the recommendation, or open the adaptive application controls page to view the list of suggested known-safe applications and groups of machines.

1. Open the Workload protections dashboard and from the advanced protection area, select **Adaptive application controls**.

    :::image type="content" source="./media/adaptive-application/opening-adaptive-application-control-new.png" alt-text="Screenshot showing opening adaptive application controls from the Azure Dashboard." lightbox="./media/adaptive-application/opening-adaptive-application-control.png":::

    The **Adaptive application controls** page opens with your VMs grouped into the following tabs:

    - **Configured** - Groups of machines that already have a defined allowlist of applications. For each group, the configured tab shows:
        - the number of machines in the group
        - recent alerts

    - **Recommended** - Groups of machines that consistently run the same applications, and don't have an allowlist configured. We recommend that you enable adaptive application controls for these groups.

      > [!TIP]
      > If you see a group name with the prefix *REVIEWGROUP*, it contains machines with a partially consistent list of applications. Microsoft Defender for Cloud can't see a pattern but recommends reviewing this group to see whether *you* can manually define some adaptive application controls rules as described in [Edit a group's adaptive application controls rule](#edit-a-groups-adaptive-application-controls-rule).
      >
      > You can also move machines from this group to other groups as described in [Move a machine from one group to another](#move-a-machine-from-one-group-to-another).

    - **No recommendation** - Machines without a defined allowlist of applications, and which don't support the feature. Your machine might be in this tab for the following reasons:
      - It's missing a Log Analytics agent
      - The Log Analytics agent isn't sending events
      - It's a Windows machine with a pre-existing [AppLocker](/windows/security/threat-protection/windows-defender-application-control/applocker/applocker-overview) policy enabled by either a GPO or a local security policy
      - AppLocker isn't available (Windows Server Core installations)

      > [!TIP]
      > Defender for Cloud needs at least two weeks of data to define the unique recommendations per group of machines. Machines that have recently been created, or which belong to subscriptions that were only recently protected by Microsoft Defender for Servers, will appear under the **No recommendation** tab.

1. Open the **Recommended** tab. The groups of machines with recommended allowlists appear.

   ![Recommended tab.](./media/adaptive-application/adaptive-application-recommended-tab.png)

1. Select a group.

1. To configure your new rule, review the various sections of this **Configure application control rules** page and the contents, which will be unique to this specific group of machines:

   ![Configure a new rule.](./media/adaptive-application/adaptive-application-create-rule.png)

   1. **Select machines** - By default, all machines in the identified group are selected. Unselect any to remove them from this rule.

   1. **Recommended applications** - Review this list of applications that are common to the machines within this group, and recommended to be allowed to run.

   1. **More applications** - Review this list of applications that are either seen less frequently on the machines within this group, or are known to be exploitable. A warning icon indicates that a specific application could be used by an attacker to bypass an application allowlist. We recommend that you carefully review these applications.

      > [!TIP]
      > Both application lists include the option to restrict a specific application to certain users. Adopt the principle of least privilege whenever possible.
      >
      > Applications are defined by their publishers. If an application doesn't have publisher information (it's unsigned), a path rule is created for the full path of the specific application.

   1. To apply the rule, select **Audit**.

## Edit a group's adaptive application controls rule

You might decide to edit the allowlist for a group of machines because of known changes in your organization.

To edit the rules for a group of machines:

1. Open the **Workload protections dashboard** and from the advanced protection area, select **Adaptive application controls**.

1. From the **Configured** tab, select the group with the rule you want to edit.

1. Review the various sections of the **Configure application control rules** page as described in [Enable adaptive application controls on a group of machines](#enable-application-controls-on-a-group-of-machines).

1. Optionally, add one or more custom rules:

   1. Select **Add rule**.

      ![Add a custom rule.](./media/adaptive-application/adaptive-application-add-custom-rule.png)

   1. If you're defining a known safe path, change the **Rule type** to 'Path' and enter a single path. You can include wildcards in the path. The following screens show some examples of how to use wildcards.

       :::image type="content" source="media/adaptive-application/wildcard-examples.png" alt-text="Screenshot that shows examples of using wildcards." lightbox="media/adaptive-application/wildcard-examples.png":::

      > [!TIP]
      > Some scenarios for which wildcards in a path might be useful:
      >
      > - Using a wildcard at the end of a path to allow all executables within this folder and sub-folders.
      > - Using a wildcard in the middle of a path to enable a known executable name with a changing folder name (for example, personal user folders containing a known executable, automatically generated folder names, etc).

   1. Define the allowed users and protected file types.

   1. When you've finished defining the rule, select **Add**.

1. To apply the changes, select **Save**.

## Review and edit a group's settings

1. To view the details and settings of your group, select **Group settings**.

    This pane shows the name of the group (which can be modified), the OS type, the location, and other relevant details.

    :::image type="content" source="./media/adaptive-application/adaptive-application-group-settings.png" alt-text="Screenshot showing the group settings page for adaptive application controls." lightbox="./media/adaptive-application/adaptive-application-group-settings.png":::

1. Optionally, modify the group's name or file type protection modes.

1. Select **Apply** and **Save**.

## Respond to the "Allowlist rules in your adaptive application control policy should be updated" recommendation

You'll see this recommendation when Defender for Cloud's machine learning identifies potentially legitimate behavior that hasn't previously been allowed. The recommendation suggests new rules for your existing definitions to reduce the number of false positive alerts.

To remediate the issues:

1. From the recommendations page, select the **Allowlist rules in your adaptive application control policy should be updated** recommendation to see groups with newly identified, potentially legitimate behavior.

1. Select the group with the rule you want to edit.

1. Review the various sections of the **Configure application control rules** page as described in [Enable adaptive application controls on a group of machines](#enable-application-controls-on-a-group-of-machines).

1. To apply the changes, select **Audit**.

## Audit alerts and violations

1. Open the **Workload protections dashboard** and from the advanced protection area, select **Adaptive application controls**.

1. To see groups with machines that have recent alerts, review the groups listed in the **Configured** tab.

1. To investigate further, select a group.

    :::image type="content" source="media/adaptive-application/recent-alerts.png" alt-text="Screenshot showing recent alerts.":::

1. For further details, and the list of affected machines, select an alert.

    The security alerts page shows more details of the alerts and provides a **Take action** link with recommendations of how to mitigate the threat.

    :::image type="content" source="media/adaptive-application/adaptive-application-alerts-start-time.png" alt-text="Screenshot of the start time of adaptive application controls alerts showing that the time is when adaptive application controls created the alert.":::

    > [!NOTE]
    > Adaptive application controls calculates events once every twelve hours. The "activity start time" shown in the security alerts page is the time that adaptive application controls created the alert, **not** the time that the suspicious process was active.

## Move a machine from one group to another

When you move a machine from one group to another, the application control policy applied to it changes to the settings of the group that you moved it to. You can also move a machine from a configured group to a non-configured group, which removes any application control rules that were applied to the machine.

1. Open the **Workload protections dashboard** and from the advanced protection area, select **Adaptive application controls**.

1. From the **Adaptive application controls** page, from the **Configured** tab, select the group containing the machine to be moved.

1. Open the list of  **Configured machines**.

1. Open the machine's menu from three dots at the end of the row, and select **Move**. The **Move machine to a different group** pane opens.

1. Select the destination group, and select **Move machine**.

1. To save your changes, select **Save**.

## Manage application controls via the REST API

To manage your adaptive application controls programmatically, use our REST API.

The relevant API documentation is available in [the Adaptive application Controls section of Defender for Cloud's API docs](/rest/api/defenderforcloud/adaptive-application-controls).

Some of the functions available from the REST API include:

- **List** retrieves all your group recommendations and provides a JSON with an object for each group.

- **Get** retrieves the JSON with the full recommendation data (that is, list of machines, publisher/path rules, and so on).

- **Put** configures your rule (use the JSON you retrieved with **Get** as the body for this request).

   > [!IMPORTANT]
   > The **Put** function expects fewer parameters than the JSON returned by the **Get** command contains.
   >
   > Remove the following properties before using the JSON in the **Put** request: recommendationStatus, configurationStatus, issues, location, and sourceSystem.

## Next steps

On this page, you learned how to use adaptive application control in Microsoft Defender for Cloud to define allowlists of applications running on your Azure and non-Azure machines. To learn more about some other cloud workload protection features, see:

- [Understanding just-in-time (JIT) VM access](just-in-time-access-overview.md)
- [Securing your Azure Kubernetes clusters](defender-for-kubernetes-introduction.md)
- View common question about [Adaptive application controls](faq-defender-for-servers.yml)
