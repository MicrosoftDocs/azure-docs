---
title: Troubleshoot user creation issues with HR provisioning
description: Learn how to troubleshoot user creation issues with HR provisioning
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: troubleshooting
ms.workload: identity
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: chmutali
---

# Troubleshoot HR user creation issues

## Creation fails due to null / empty values 

**Applies to:**
* Workday to on-premises Active Directory user provisioning
* Workday to Microsoft Entra user provisioning
* SAP SuccessFactors to on-premises Active Directory user provisioning
* SAP SuccessFactors to Microsoft Entra user provisioning

| Troubleshooting | Details |
|-- | -- |
| **Issue** | You have successfully configured the inbound provisioning app. You are getting null or empty value from the HR app. The create operation fails with the error message: `InvalidAttributeSyntax-LdapErr: The syntax is invalid. The parameter is incorrect. Error in attribute conversion operation, data 0, v3839` |
| **Cause** | The provisioning service does not have a default logic for null value processing. When the provisioning service gets an empty string from the source app, it tries to flow the value "as-is" to the target app. In this case, on-premises Active Directory does not support setting empty string values and hence you see the above error. |
| **Resolution** | Check the provisioning logs. Identify attributes in the target Active Directory that are receiving null or empty string values. Update the attribute mapping for such attributes to use an expression mapping. See recommended resolutions below. |

**Recommended resolutions**

  Let's say the attribute `BusinessTitle` mapped to AD attribute `jobTitle` may be null or empty in Workday. 
  * Option 1: Define an expression to check for empty or null values using functions like [IIF](functions-for-customizing-application-data.md#iif), [IsNullOrEmpty](functions-for-customizing-application-data.md#isnullorempty), [Coalesce](functions-for-customizing-application-data.md#coalesce) or [IsPresent](functions-for-customizing-application-data.md#ispresent) and pass a non-blank literal value. 
  
     `IIF(IsNullOrEmpty([BusinessTitle]),"N/A",[BusinessTitle])`

  * Option 2: Use the function [IgnoreFlowIfNullOrEmpty](functions-for-customizing-application-data.md#ignoreflowifnullorempty) to drop empty or null attributes in the payload sent to on-premises Active Directory / Microsoft Entra ID. 
  
     `IgnoreFlowIfNullOrEmpty([BusinessTitle])` 


## Next steps

* [Learn more about Microsoft Entra ID and Workday integration scenarios and web service calls](workday-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](check-status-user-account-provisioning.md)
