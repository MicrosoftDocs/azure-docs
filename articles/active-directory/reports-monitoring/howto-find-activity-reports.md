---

title: Find Azure Active Directory user activity reports in Azure portal | Microsoft Docs
description: Learn where the Azure Active Directory user activity reports are in the Azure portal.
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk 

---

# Find activity reports in the Azure portal

In this article, you learn how to find Azure Active Directory (Azure AD) user activity reports in the Azure portal.

## Audit logs report

The audit logs report combines several reports around application activities into a single view for context-based reporting. To access the audit logs report:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select your directory from the top-right corner, then select the **Azure Active Directory** blade from the left navigation pane.
3. Select **Audit logs** from the **Activity** section of the Azure Active Directory blade. 

    ![Audit logs](./media/howto-find-activity-reports/482.png "Audit logs")

The audit logs report consolidates the following reports:

* Audit report
* Password reset activity
* Password reset registration activity
* Self-service groups activity
* Office365 Group Name Changes
* Account provisioning activity
* Password rollover status
* Account provisioning errors

### Filtering on audit logs

You can use advanced filtering in the audit report to access a specific category of audit data, by specifying it in the **Activity category** filter. For example, to view all activities related to self-service password reset, select the **Self-service password management** category. 

    ![Category options on the Filter Audit Logs page](./media/howto-find-activity-reports/06.png "Category options on the Filter Audit Logs page")

Activity categories include:

- Core Directory
- Self-service Password Management
- Self-service Group Management
- Account Provisioning


## Sign-ins report 

The **Sign-ins** view includes all user sign-ins, as well as the **Application Usage** report. You also can view application usage information in the **Manage** section of the **Enterprise applications** overview.

    ![Enterprise applications](./media/howto-find-activity-reports/484.png "Enterprise applications")

To access the sign-ins report:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Select your directory from the top-right corner, then select the **Azure Active Directory** blade from the left navigation pane.
3. Select **Signins** from the **Activity** section of the Azure Active Directory blade. 

    ![Sign-ins view](./media/howto-find-activity-reports/483.png "Sign-ins view")


### Filtering on application name

You can use the sign-ins report to view details about application usage, by filtering on user name or application name.

![Filter Sign-In Events page](./media/howto-find-activity-reports/07.png "Filter Sign-In Events page")

## Security reports

### Anomalous activity reports

Anomalous activity reports provide information on security-related risk events that Azure AD can detect and report on.

The following table lists the Azure AD anomalous activity security reports, and corresponding risk event types in the Azure portal. For more information, see
[Azure Active Directory risk events](concept-risk-events.md).  


| Azure AD anomalous activity report |  Identity protection risk event type|
| :--- | :--- |
| Users with leaked credentials | Leaked credentials |
| Irregular sign-in activity | Impossible travel to atypical locations |
| Sign-ins from possibly infected devices | Sign-ins from infected devices|
| Sign-ins from unknown sources | Sign-ins from anonymous IP addresses |
| Sign-ins from IP addresses with suspicious activity | Sign-ins from IP addresses with suspicious activity |
| - | Sign-ins from unfamiliar locations |

The following Azure AD anomalous activity security reports are not included as risk events in the Azure portal:

* Sign-ins after multiple failures
* Sign-ins from multiple geographies


### Detected risk events

You can access reports about detected risk events in the **Security** section of the **Azure Active Directory** blade in the [Azure portal](https://portal.azure.com). Detected risk events are tracked in the following reports:   

- [Users at risk](concept-user-at-risk.md)
- [Risky sign-ins](concept-risky-sign-ins.md)

    ![Security reports](./media/howto-find-activity-reports/04.png "Security reports")

## Next steps

* [Audit logs overview](concept-audit-logs.md)
* [Sign-ins overview](concept-sign-ins.md)
* [Risky events overview](concept-risk-events.md)
