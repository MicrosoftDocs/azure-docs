---
title: 'How to synchronize attributes for Lifecycle workflows'
description: Describes overview of Lifecycle workflow attributes.
services: active-directory
author: owinfrey
manager: billmath
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 01/20/2022
ms.subservice: compliance
ms.author: owinfrey
ms.collection: M365-identity-device-management
---
# How to synchronize attributes for Lifecycle workflows
Workflows, contain specific tasks, which run automatically against users based on specific conditions or triggers.

These triggers are based on user attributes in Azure AD.  For instance, the classic [on-boarding pre-hire scenario](lifecycle-workflow-templates.md#onboard-pre-hire-employee) uses the `EmployeeHireDate` attribute.

To take full advantage of lifecycle workflows, user provisioning should be automated and the trigger relevant attributes should be synchronized.  You can create custom workflows without the use of these attributes but, in order to use the built-in templates, these attributes need to have values.

The following table shows the trigger relevant attributes and the methods of  synchronization that are supported.

|Attribute|Type|Supported in HR Inbound Provisioning|Support in Azure AD Connect Cloud Sync|Support in Azure AD Connect Sync| 
|-----|-----|-----|-----|-----|
|employeeHireDate|DateTimeOffset|Yes|Yes|Yes|
|employeeLeaveDateTime|DateTimeOffset|Yes|Yes|Not currently|

These attributes **are not** automatically populated using such synchronization methods such as Azure AD Connect or Azure AD Connect cloud sync.

This document explains how to setup synchronization from on-premises Azure AD Connect cloud sync and Azure AD Connect for the required attributes.  This document only demonstrates synchronization for the `EmployeeHireDate` attribute. For more attributes, see the [Lifecycle workflows template](lifecycle-workflow-templates.md) document.

## Understanding EmployeeHireDate and EmployeeLeaveDateTime formatting
The [EmployeeHireDate](/graph/api/resources/user?view=graph-rest-1.0#properties) and EmployeeLeaveDateTime contain dates and times that must be formatted in a specific way.  This means that you may need to use an expression to convert the value of your source attribute to a format that will be accepted by the EmployeeHireDate or EmployeeLeaveDateTime.  The table below outlines the format that is expected and provides an example expression on how to convert the values.

|Scenario|Expression/Format|Target|More Information|
|-----|-----|-----|-----|
|Workday to Active Directory User Provisioning|FormatDateTime([StatusHireDate], , "yyyy-MM-ddzzz", "yyyyMMddHHmmss.fZ")|On-premises AD string attribute|[Attribute mappings for Workday](/azure/active-directory/saas-apps/workday-inbound-tutorial#part-4-configure-attribute-mappings)|
|SuccessFactors to Active Directory User Provisioning|FormatDateTime([endDate], ,"M/d/yyyy hh:mm:ss tt"," yyyyMMddHHmmss.fZ ")|On-premises AD string attribute|[Attribute mappings for SAP Success Factors](/azure/active-directory/saas-apps/sap-successfactors-inbound-provisioning-tutorial#part-4-configure-attribute-mappings)|
|Custom import to Active Directory|Must be in the format "yyyyMMddHHmmss.fZ"|On-premises AD string attribute||
|Microsoft Graph User API|Must be in the format "YYYY-MM-DDThh:mm:ssZ"|EmployeeHireDate and EmployeeLeaveDateTime||
|Workday to Azure AD User Provisioning|Can use a direct mapping.  No expression is needed but may be used to adjust the time portion of EmployeeHireDate and EmployeeLeaveDateTime|EmployeeHireDate and EmployeeLeaveDateTime||
|-	SuccessFactors to Azure AD User Provisioning|Can use a direct mapping.  No expression is needed but may be used to adjust the time portion of EmployeeHireDate and EmployeeLeaveDateTime|EmployeeHireDate and EmployeeLeaveDateTime||

For more information on expressions see [Reference for writing expressions for attribute mappings in Azure Active Directory](../app-provisioning/functions-for-customizing-application-data.md)

The expression examples above use endDate for SAP and StatusHireDate for Workday.  However, you may opt to use different attributes.

For example, you might use StatusContinuesFirstDayOfWork instead of StatusHireDate for Workday.  In this instance your expression would be:  

`FormatDateTime([StatusContinuesFirstDayOfWork], , "yyyy-MM-ddzzz", "yyyyMMddHHmmss.fZ")`


The following table has a list of suggested attributes and their scenario recommendations.

|HR Attribute|HR System|Scenario|Azure AD attribute|
|-----|-----|-----|-----|
|StatusHireDate|Workday|Joiner|EmployeeHireDate|
|StatusContinuousFirstDayOfWork|Workday|Joiner|EmployeeHireDate|	
StatusDateEnteredWorkforce|Workday|Joiner|EmployeeHireDate|
StatusOriginalHireDate|Workday|Joiner|EmployeeHireDate|
|StatusEndEmploymentDate|Workday|Leaver|EmployeeLeaveDateTime|
|StatusResignationDate|Workday|Leaver|EmployeeLeaveDateTime|
|StatusRetirementDate|Workday|Leaver|EmployeeLeaveDateTime|
|StatusTerminationDate|Workday|Leaver|EmployeeLeaveDateTime|
|startDate|SAP SF|Joiner|EmployeeHireDate|
|firstDateWorked|SAP SF|Joiner|EmployeeHireDate|
|lastDateWorked|SAP SF|Leaver|EmployeeLeaveDateTime|
|endDate|SAP SF|Leaver|EmployeeLeaveDateTime|

For more attributes see the [Workday attribute reference](../app-provisioning/workday-attribute-reference.md) and [SAP SuccessFactors attribute reference](../app-provisioning/sap-successfactors-attribute-reference.md)

### Additional information on attributes
Be aware of the following items when working with the datetime attributes.

- Workday and SAP SF will always send the time in Coordinated Universal Time or UTC.
-  if you're in a single time zone it's recommended that you hardcode the time portion to something that works for you.  An example would be 5am for new hire scenarios and 10pm for last day of work scenarios.
- There's no corresponding EmployeeHireDate or EmployeeLeaveDateTime attribute in Active Directory.  If you're importing from on-premises AD, you'll need to identify an attribute in AD that can be used.  This attribute must be a string.
- It is recommended, that if you are using temporary access pass (TAP), that you set the maximum lifetime to 24 hours.  Doing this will help ensure that the TAP has not expired after being sent to an employee who may be in a different timezone.  For more information see [Configure Temporary Access Pass in Azure AD to register Passwordless authentication methods.](../authentication/howto-authentication-temporary-access-pass.md#enable-the-temporary-access-pass-policy)


## Create a custom synch rule in Azure AD Connect cloud sync for EmployeeHireDate
 The following steps will guide you through creating a synchronization rule using cloud sync.
 1.  In the Azure portal, select **Azure Active Directory**.
 2.  Select **Azure AD Connect**.
 3.  Select **Manage cloud sync**.
 4. Under **Configuration**, select your configuration.
 5. Select **Click to edit mappings**.  This link opens the **Attribute mappings** screen.
 6. Select **Add attribute**.
 7. Fill in the following information: 
     - Mapping Type: Direct
     - Source attribute: msDS-cloudExtensionAttribute1
     - Default value: Leave blank
     - Target attribute: employeeHireDate
     - Apply this mapping: Always
     ![Screenshot that shows attribute mapping cloud sync 1](media/how-to-lcw-synch-attributes/cloud-synch-1.png)
 8. Click **Apply**.
 9. Back on the **Attribute mappings** screen, you should see your new attribute mapping.  
 10. Select **Save schema**.

For more information on attributes, see [Attribute mapping in Azure AD Connect cloud sync.](../cloud-sync/how-to-attribute-mapping.md)

## How to create a custom synch rule in Azure AD Connect for EmployeeHireDate
The following example will walk you through setting up a custom synchronization rule that synchronizes the Active Directory attribute to the employeeHireDate attribute in Azure AD.

   1. Open a PowerShell window as administrator and run `Set-ADSyncScheduler -SyncCycleEnabled $false`.
   2. Go to Start\Azure AD Connect\ and open the Synchronization Rules Editor
   3. Ensure the direction at the top is set to **Inbound**.
   4. Click **Add Rule.**
   5. On the **Create Inbound synchronization rule** screen, enter the following information and click **Next**.
      - Name:  In from AD - EmployeeHireDate
      - Connected System:  contoso.com
      - Connected System Object Type: user
      - Metaverse Object Type: person
      - Precedence: 200
     ![Screenshot that shows attribute mapping cloud sync 2.](media/how-to-lcw-synch-attributes/aadc-4.png)
   6. On the **Scoping filter** screen, click **Next.**
   7. On the **Join rules** screen, click **Next**.
   8. On the **Transformations** screen, Under **Add transformations,** enter the following information.
      - FlowType:  Direct
      - Target Attribute: employeeHireDate
      - Source:  msDS-cloudExtensionAttribute1
     ![Screenshot that shows attribute mapping cloud sync 5.](media/how-to-lcw-synch-attributes/aadc-5.png)
   9.  Click **Add**.
   10. In the Synchronization Rules Editor, ensure the direction at the top is set to **Outbound**.
   11. Click **Add Rule.**  
   12. On the **Create Outbound synchronization rule** screen, enter the following information and click **Next**.
       - Name:  Out to AAD - EmployeeHireDate
       - Connected System:  &lt;your tenant&gt;
       - Connected System Object Type: user
       - Metaverse Object Type: person
       - Precedence: 201
     ![Screenshot that shows attribute mapping cloud sync 6.](media/how-to-lcw-synch-attributes/aadc-6.png)
   13. On the **Scoping filter** screen, click **Next.**
   14. On the **Join rules** screen, click **Next**.
   15. On the **Transformations** screen, Under **Add transformations,** enter the following information.
       - FlowType:  Direct
       - Target Attribute: employeeHireDate
       - Source:  employeeHireDate
     ![Screenshot that shows attribute mapping cloud sync 7.](media/how-to-lcw-synch-attributes/aadc-7.png)
   16.  Click **Add**.
   17. Close the Synchronization Rules Editor






For more information, see [How to customize a synchronization rule](../hybrid/how-to-connect-create-custom-sync-rule.md) and [Make a change to the default configuration.](../hybrid/how-to-connect-sync-change-the-configuration.md)



## Next steps
- [What are lifecycle workflows?](what-are-lifecycle-workflows.md)
- [Create a custom workflow using the Azure Portal](tutorial-onboard-custom-workflow-portal.md)
- [Create a Lifecycle workflow](create-lifecycle-workflow.md)