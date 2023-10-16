---
title: Troubleshoot attribute retrieval issues with HR provisioning
description: Learn how to troubleshoot attribute retrieval issues with HR provisioning
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
# Troubleshoot HR attribute retrieval issues

## Issue fetching Workday attributes


| **Applies to** |
|--|
| * Workday to on-premises Active Directory user provisioning <br> * Workday to Microsoft Entra user provisioning |
| **Issue Description** | 
| You have just configured the Workday inbound provisioning app and successfully connected to the Workday tenant URL. You ran a test sync and you observed that the provisioning app is not retrieving certain attributes from Workday. Only some attributes are read and provisioned to the target. |
| **Probable Cause** | 
| By default, the Workday provisioning app ships with attribute mapping and XPATH definitions that work with Workday Web Services (WWS) v21.1. When configuring connectivity to Workday in the provisioning app, if you explicitly specified the WWS API version (example: `https://wd3-impl-services1.workday.com/ccx/service/contoso4/Human_Resources/v34.0`), then you may run into this issue, because of the mismatch between WWS API version and the XPATH definitions.  |
| **Resolution Options** | 
| * *Option 1*: Remove the WWS API version information from the URL and use the default WWS API version v21.1 <br> * *Option 2*: Manually update the XPATH API expressions so it is compatible with your preferred WWS API version. Update the **XPATH API expressions** under **Attribute Mapping -> Advanced Options -> Edit attribute list for Workday** referring to the section [Workday attribute reference](../app-provisioning/workday-attribute-reference.md#xpath-values-for-workday-web-services-wws-api-v30)  |

## Issue fetching Workday calculated fields

| **Applies to** |
|--|
| * Workday to on-premises Active Directory user provisioning <br> * Workday to Microsoft Entra user provisioning |
| **Issue Description** | 
| You have just configured the Workday inbound provisioning app and successfully connected to the Workday tenant URL. You have an integration system configured in Workday and you have configured XPATHs that point to attributes in the Workday Integration System. However, the Microsoft Entra provisioning app isn't fetching values associated with these integration system attributes or calculated fields. |
| **Cause** | 
| This is a known limitation. The Workday provisioning app currently doesn't support fetching calculated fields/integration system attributes using the *Field_And_Parameter_Criteria_Data* Get_Workers request filter.  |
| **Resolution Options** | 
| You could consider a workaround of either using Workday Provisioning groups or Workday Custom ID field. See details below. |

**Suggested workarounds**
 * **Option 1: Using Workday Provisioning Groups**: Check if the calculated field value can be represented as a provisioning group in Workday. Using the same logic that is used for the calculated field, your Workday Admin may be able to assign a Provisioning Group to the user. Reference Workday doc that requires Workday login: [Set Up Account Provisioning Groups](https://doc.workday.com/reader/3DMnG~27o049IYFWETFtTQ/keT9jI30zCzj4Nu9pJfGeQ). Once configured, this Provisioning Group assignment can be [retrieved in the provisioning job](../app-provisioning/workday-integration-reference.md#example-3-retrieving-provisioning-group-assignments) and used in attribute mappings and scoping filter. 
* **Option 2: Using Workday Custom IDs**: Check if the calculated field value can be represented as a Custom ID on the Worker Profile. Use `Maintain Custom ID Type` task in Workday to define a new type and populate values in this custom ID. Make sure the [Workday ISU account used for the integration](../saas-apps/workday-inbound-tutorial.md#configuring-domain-security-policy-permissions) has domain security permission for `Person Data: ID Information`. 
  * Example 1: Let's say you have a calculated field called Payroll ID. You can define "External_Payroll_ID" as a custom ID in Workday and retrieve it using an XPATH that uses "Custom_ID_Type_ID" as the selecting mechanism:  `wd:Worker/wd:Worker_Data/wd:Personal_Data/wd:Identification_Data/wd:Custom_ID/wd:Custom_ID_Data[string(wd:ID_Type_Reference/wd:ID[@wd:type='Custom_ID_Type_ID']='External_Payroll_ID']/wd:ID/text()`
  * Example 2: Let's say you have a calculated field called Badge ID. You can define "Badge ID" as a custom ID in Workday and retrieve the "Descriptor" attribute corresponding to it with an XPATH that uses "wd:ID_Type_Reference/@wd:Descriptor" as the selecting mechanism:  `wd:Worker/wd:Worker_Data/wd:Personal_Data/wd:Identification_Data/wd:Custom_ID[string(wd:Custom_ID_Data/wd:ID_Type_Reference/@wd:Descriptor)='BADGE ID']/wd:Custom_ID_Reference/@wd:Descriptor`


## Next steps

* [Learn more about Microsoft Entra ID and Workday integration scenarios and web service calls](workday-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](check-status-user-account-provisioning.md)
