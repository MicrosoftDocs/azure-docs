---
title: Troubleshoot attribute retrieval issues with HR provisioning
description: Learn how to troubleshoot attribute retrieval issues with HR provisioning
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: troubleshooting
ms.workload: identity
ms.date: 10/27/2021
ms.author: kenwith
ms.reviewer: chmutali
---
# Troubleshoot HR attribute retrieval issues

## Provisioning app is not fetching all Workday attributes
**Applies to:**
* Workday to on-premises Active Directory user provisioning
* Workday to Azure Active Directory user provisioning

| Troubleshooting | Details |
|-- | -- |
| **Issue** | You have just setup the Workday inbound provisioning app and successfully connected to the Workday tenant URL. You ran a test sync and you observed that the provisioning app is not retrieving all attributes from Workday. Only some attributes are read and provisioned to the target. |
| **Cause** | By default, the Workday provisioning app ships with attribute mapping and XPATH definitions that work with Workday Web Services (WWS) v21.1. When configuring connectivity to Workday in the provisioning app, if you explicitly specified the WWS API version (example: `https://wd3-impl-services1.workday.com/ccx/service/contoso4/Human_Resources/v34.0`), then you may run into this issue, because of the mismatch between WWS API version and the XPATH definitions.  |
| **Resolution** | * *Option 1*: Remove the WWS API version information from the URL and use the default WWS API version v21.1 <br> * *Option 2*: Manually update the XPATH API expressions so it is compatible with your preferred WWS API version. Update the **XPATH API expressions** under **Attribute Mapping -> Advanced Options -> Edit attribute list for Workday** referring to the section [Workday attribute reference](../app-provisioning/workday-attribute-reference.md#xpath-values-for-workday-web-services-wws-api-v30)  |

## Provisioning app is not fetching Workday integration system attributes / calculated fields
**Applies to:**
* Workday to on-premises Active Directory user provisioning
* Workday to Azure Active Directory user provisioning

| Troubleshooting | Details |
|-- | -- |
| **Issue** | You have just setup the Workday inbound provisioning app and successfully connected to the Workday tenant URL. You have an integration system configured in Workday and you have configured XPATHs that point to attributes in the Workday Integration System. However, the Azure AD provisioning app is not fetching values associated with these integration system attributes or calculated fields. |
| **Cause** | This is a known limitation. The Workday provisioning app currently does not support fetching calculated fields/integration system attributes.  |
| **Resolution** | There is no workaround for this limitation. |

## Next steps

* [Learn more about Azure AD and Workday integration scenarios and web service calls](workday-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](check-status-user-account-provisioning.md)
