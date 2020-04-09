---

title: Find user activity reports in Azure portal | Microsoft Docs
description: Learn where the Azure Active Directory user activity reports are in the Azure portal.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: dhanyahk 

ms.collection: M365-identity-device-management
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

You can use advanced filtering in the audit report to access a specific category of audit data, by specifying it in the **Category** filter. For example, to view all activities related to users, select the **UserManagement** category. 

Categories include:

- All
- AdministrativeUnit
- ApplicationManagement
- Authentication
- Authorization
- Contact
- Device
- DeviceConfiguration
- DirectoryManagement
- EntitlementManagement
- GroupManagement
- Other
- Policy
- ResourceManagement
- RoleManagement
- UserManagement

You can also filter on a specific service using the **Service** dropdown filter. For example, to get all audit events related to self-service password management, select the **Self-service Password Management** filter.

Services include:

- All
- Access Reviews
- Account Provisioning 
- Application SSO
- Authentication Methods
- B2C
- Conditional Access
- Core Directory
- Entitlement Management
- Identity Protection
- Invited Users
- PIM
- Self-service Group Management
- Self-service Password Management
- Terms of Use

## Sign-ins report 

The **Sign-ins** view includes all user sign-ins, as well as the **Application Usage** report. You also can view application usage information in the **Manage** section of the **Enterprise applications** overview.

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

Anomalous activity reports provide information on security-related risk detections that Azure AD can detect and report on.

The following table lists the Azure AD anomalous activity security reports, and corresponding risk detection types in the Azure portal. For more information, see
[Azure Active Directory risk detections](concept-risk-events.md).  


| Azure AD anomalous activity report |  Identity protection risk detection type|
| :--- | :--- |
| Users with leaked credentials | Leaked credentials |
| Irregular sign-in activity | Impossible travel to atypical locations |
| Sign-ins from possibly infected devices | Sign-ins from infected devices|
| Sign-ins from unknown sources | Sign-ins from anonymous IP addresses |
| Sign-ins from IP addresses with suspicious activity | Sign-ins from IP addresses with suspicious activity |
| - | Sign-ins from unfamiliar locations |

The following Azure AD anomalous activity security reports are not included as risk detections in the Azure portal:

* Sign-ins after multiple failures
* Sign-ins from multiple geographies


### Detected risk detections

You can access reports about detected risk detections in the **Security** section of the **Azure Active Directory** blade in the [Azure portal](https://portal.azure.com). Detected risk detections are tracked in the following reports:   

- [Users at risk](concept-user-at-risk.md)
- [Risky sign-ins](concept-risky-sign-ins.md)

    ![Security reports](./media/howto-find-activity-reports/04.png "Security reports")

## Troubleshoot issues with activity reports

### Missing data in the downloaded activity logs

#### Symptoms 

I downloaded the activity logs (audit or sign-ins) and I don’t see all the records for the time I chose. Why? 

 ![Reporting](./media/troubleshoot-missing-data-download/01.png)
 
#### Cause

When you download activity logs in the Azure portal, we limit the scale to 250000 records, sorted by most recent first. 

#### Resolution

You can leverage [Azure AD Reporting APIs](concept-reporting-api.md) to fetch up to a million records at any given point.

### Missing audit data for recent actions in the Azure portal

#### Symptoms

I performed some actions in the Azure portal and expected to see the audit logs for those actions in the `Activity logs > Audit Logs` blade, but I can’t find them.

 ![Reporting](./media/troubleshoot-missing-audit-data/01.png)
 
#### Cause

Actions don’t appear immediately in the activity logs. The table below enumerates our latency numbers for activity logs. 

| Report | &nbsp; | Latency (P95) | Latency (P99) |
|--------|--------|---------------|---------------|
| Directory audit | &nbsp; | 2 mins | 5 mins |
| Sign-in activity | &nbsp; | 2 mins | 5 mins | 

#### Resolution

Wait for 15 minutes to two hours and see if the actions appear in the log. If you don’t see the logs even after two hours, please [file a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) and we will look into it.

### Missing logs for recent user sign-ins in the Azure AD sign-ins activity log

#### Symptoms

I recently signed into the Azure portal and expected to see the sign-in logs for those actions in the `Activity logs > Sign-ins` blade, but I can’t find them.

 ![Reporting](./media/troubleshoot-missing-audit-data/02.png)
 
#### Cause

Actions don’t appear immediately in the activity logs. The table below enumerates our latency numbers for activity logs. 

| Report | &nbsp; | Latency (P95) | Latency (P99) |
|--------|--------|---------------|---------------|
| Directory audit | &nbsp; | 2 mins | 5 mins |
| Sign-in activity | &nbsp; | 2 mins | 5 mins | 

#### Resolution

Wait for 15 minutes to two hours and see if the actions appear in the log. If you don’t see the logs even after two hours, please [file a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) and we will look into it.

### I can't view more than 30 days of report data in the Azure portal

#### Symptoms

I can't view more than 30 days of sign-in and audit data from the Azure portal. Why? 

 ![Reporting](./media/troubleshoot-missing-audit-data/03.png)

#### Cause

Depending on your license, Azure Active Directory Actions stores activity reports for the following durations:

| Report           | &nbsp; |  Azure AD Free | Azure AD Premium P1 | Azure AD Premium P2 |
| ---              | ----   |  ---           | ---                 | ---                 |
| Directory Audit  | &nbsp; |	7 days	   | 30 days             | 30 days             |
| Sign-in Activity | &nbsp; | Not available. You can access your own sign-ins for 7 days from the individual user profile blade | 30 days | 30 days             |

For more information, see [Azure Active Directory report retention policies](reference-reports-data-retention.md).  

#### Resolution

You have two options to retain the data for longer than 30 days. You can use the [Azure AD Reporting APIs](concept-reporting-api.md) to retrieve the data programmatically and store it in a database. Alternatively, you can integrate audit logs into a third party SIEM system like Splunk or SumoLogic.

## Next steps

* [Audit logs overview](concept-audit-logs.md)
* [Sign-ins overview](concept-sign-ins.md)
* [Risky events overview](concept-risk-events.md)
