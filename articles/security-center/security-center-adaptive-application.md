---
title: Adaptive application controls in Azure Security Center | Microsoft Docs
description: This document helps you to use adaptive application control in Azure Security Center to whitelist applications running in Azure VMs.
services: security-center
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: 9268b8dd-a327-4e36-918e-0c0b711e99d2
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/31/2018
ms.author: rkarlin

---
# Adaptive application controls in Azure Security Center
Learn how to configure application control in Azure Security Center using this walkthrough.

## What are adaptive application controls in Security Center?
Adaptive application controls help control which applications can run on your VMs located in Azure, which among other benefits helps harden your VMs against malware. Security Center uses machine learning to analyze the applications running in the VM and helps you apply whitelisting rules using this intelligence. This capability greatly simplifies the process of configuring and maintaining application whitelists, enabling you to:

- Block or alert on attempts to run malicious applications, including those that might otherwise be missed by antimalware solutions
- Comply with your organization's security policy that dictates the use of only licensed software.
- Avoid unwanted software to be used in your environment.
- Avoid old and unsupported apps to run.
- Prevent specific software tools that are not allowed in your organization.
- Enable IT to control the access to sensitive data through app usage.

## How to enable adaptive application controls?
Adaptive application controls help you define a set of applications that are allowed to run on configured groups. This feature is only available for Windows machines (all versions, classic, or Azure Resource Manager). The following steps can be used to configure application whitelisting in Security Center:

1. Open the **Security Center** dashboard.
2. In the left pane, select **Adaptive application controls** located under **Advanced cloud defense**.

	![Defense](./media/security-center-adaptive-application/security-center-adaptive-application-fig1-new.png)

The **Adaptive application controls** page appears.

![controls](./media/security-center-adaptive-application/security-center-adaptive-application-fig2.png)

The **Groups of VMs** section contains three tabs:

* **Configured**: list of groups containing the VMs that were configured with application control.
* **Recommended**:  list of groups for which application control is recommended. Security Center uses machine learning to identify VMs that are good candidates for application control based on whether the VMs consistently run the same applications.
* **No recommendation**: list of groups containing VMs without any application control recommendations. For example, VMs on which applications are always changing, and haven’t reached a steady state.

> [!NOTE]
> Security Center uses a proprietary clustering algorithm to create groups of VMs making sure that similar VMs get the optimal recommended application control policy.
>
>

### Configure a new application control policy
1. Click on the **Recommended** tab for a list of groups with application control recommendations:

  ![Recommended](./media/security-center-adaptive-application/security-center-adaptive-application-fig3.png)

  The list includes:

  - **NAME**: the name of the subscription and group
  - **VMs**: the number of virtual machines in the group
  - **STATE**: the state of the recommendations, which in most cases will be open
  - **SEVERITY**: the severity level of the recommendations

2. Select a group to open the **Create application control rules** option.

  ![Application control rules](./media/security-center-adaptive-application/security-center-adaptive-application-fig4.png)

3. In the **Select VMs**, review the list of recommended VMs and uncheck any you do not want to apply application control to. Next, you see two lists:

  - **Recommended applications**: a list of applications that are frequent on the VMs within this group, and thus recommended for application control rules by Security Center.
  - **More applications**: a list of applications that are either less frequent on the VMs within this group or that are known as Exploitables (see more below), and recommended for review before applying the rules.

4. Review the applications in each of the lists, and uncheck any you do not want to apply. Each list includes:

  - **NAME**: the certificate information of an application or its full application path
  - **FILE TYPES**: the application file type. This can be EXE, Script, or MSI.
  - **EXPLOITABLE**: a warning icon indicates if the applications could be used by an attacker to bypass application whitelisting. It is recommended to review these applications prior to their approval.
  - **USERS**: users that are recommended to be allowed to run an application

5. Once you finish your selections, select **Create**.


> [!NOTE]
> - Security Center relies on a minimum of two weeks of data in order to create a baseline and populate the unique recommendations per group of VMs. New customers of Security Center standard tier should expect a behavior in which at first their groups of VMs appear under the *no recommendation* tab.
> - Adaptive Application Controls from Security Center doesn’t support VMs for which an AppLocker policy is already enabled by either a GPO or a local security policy.
> -  As a security best practice, Security Center will always try to create a publisher rule for the applications that should be whitelisted, and only if an application doesn’t have a publisher information (aka not signed), a path rule will be created for the full path of the specific EXE.
>   

### Editing and monitoring a group configured with application control

1. To edit and monitor a group configured with application control, return to the **Adaptive application controls** page and select **CONFIGURED** under **Groups of VMs**:

  ![Groups](./media/security-center-adaptive-application/security-center-adaptive-application-fig5.png)

  The list includes:

  - **NAME**: the name of the subscription and group
  - **VMs**: the number of virtual machines in the group
  - **MODE**: Audit mode will log attempts to run non-whitelisted applications; Enforce will not allow non-whitelisted applications to run
  - **ISSUES**: any current violations

2. Select a group to make changes in the **Edit application control policy** page.

  ![Protection](./media/security-center-adaptive-application/security-center-adaptive-application-fig6.png)

3. Under **Protection mode**, you have the option to select between the following:

  - **Audit**: in this mode, the application control solution does not enforce the rules, and only audits the activity on the protected VMs. This is recommended for scenarios where you want to first observe the overall behavior before blocking an app to run in the target VM.
  - **Enforce**: in this mode, the application control solution does enforce the rules, and makes sure that applications that are not allowed to run are blocked.

  As previously mentioned, by default a new application control policy is always configured in *Audit* mode. Under **Policy extension**, you can add your own application paths that you want to whitelist. Once you add these paths, Security Center creates the proper rules for these applications, in addition to the rules that are already in place.

  In the **Recent Issues** section, any current violations are listed.

  ![Issues](./media/security-center-adaptive-application/security-center-adaptive-application-fig7.png)

  This list includes:
  - **ISSUES**: any violations that were logged, which can include the following:

	  - **ViolationsBlocked**: when the solution is turned on Enforce mode, and an application that is not whitelisted tries to execute.
	  - **ViolationsAudited**: when the solution is turned on Audit mode, and an application that is not whitelisted executes.

 - **NO. OF VMS**: the number of virtual machines with this issue type.

  If you click on each line, you are redirected to [Azure Activity Log](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) page where you can see information about all VMs with this type of violation. If you click on the three dots at the end of each line, you are able to delete that particular entry. The **Configured virtual machines** section lists the VMs to which these rules apply.

  ![Configured virtual machines](./media/security-center-adaptive-application/security-center-adaptive-application-fig8.png)

  Under **Publisher whitelisting rules**, the list contains:

  - **RULE**: applications for which a publisher rule was created based on the certificate information that was found for each application
  - **FILE TYPE**: the file types that are covered by a specific publisher rule. This can be any of the following: EXE, Script, or MSI.
  - **USERS**: number of users allowed to run each application

  See [Understanding Publisher Rules in Applocker](https://docs.microsoft.com/windows/device-security/applocker/understanding-the-publisher-rule-condition-in-applocker) for more information.

  ![Whitelisting rules](./media/security-center-adaptive-application/security-center-adaptive-application-fig9.png)

  If you click on the three dots at the end of each line you can delete that specific rule or edit the allowed users.

  The **Path whitelisting rules** section, lists the entire application path (including the specific file type) for the applications that are not signed with a digital certificate, but are still current in the whitelisting rules.

  > [!NOTE]
  > By default, as a security best practice, Security Center will always try to create a publisher rule for the EXEs that should be whitelisted, and only if an EXE doesn’t have a publisher information (aka not signed), a path rule will be created for the full path of the specific EXE.

  ![Path whitelisting rules](./media/security-center-adaptive-application/security-center-adaptive-application-fig10.png)

  The list contains:
  - **NAME**: the full patch of the executable
  - **FILE TYPE**: the file types that are covered by a specific path rule. This can be any of the following: EXE, Script, or MSI.
  - **USERS**: number of users allowed to run each application

  If you click on the three dots at the end of each line, you can delete that specific rule or edit the allowed users.

4. After making changes on the **Adaptive application controls** page, click the **Save** button. If you decide to not apply the changes, click **Discard**.

### Not recommended list

Security Center only recommends application whitelisting for virtual machines running a stable set of applications. Recommendations are not created if applications on the associated VMs keep changing.

![Recommendation](./media/security-center-adaptive-application/security-center-adaptive-application-fig11.png)

The list contains:
- **NAME**: the name of the subscription and group
- **VMs**: the number of virtual machines in the group

## Next steps
In this document, you learned how to use adaptive application control in Azure Security Center to whitelist applications running in Azure VMs. To learn more about Azure Security Center, see the following:

* [Managing and responding to security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts). Learn how to manage alerts, and respond to security incidents in Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Understanding security alerts in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-alerts-type). Learn about the different types of security alerts.
* [Azure Security Center Troubleshooting Guide](https://docs.microsoft.com/azure/security-center/security-center-troubleshooting-guide). Learn how to troubleshoot common issues in Security Center.
* [Azure Security Center FAQ](security-center-faq.md). Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
