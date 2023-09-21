---
title: Troubleshoot manager update issues with HR provisioning
description: Learn how to troubleshoot manager update issues with HR provisioning
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

# Troubleshoot HR manager update issues

**Applies to:**
* Workday to on-premises Active Directory user provisioning
* Workday to Microsoft Entra user provisioning
* SAP SuccessFactors to on-premises Active Directory user provisioning
* SAP SuccessFactors to Microsoft Entra user provisioning

## Understanding how manager reference resolution works
The Microsoft Entra provisioning service automatically updates manager information so that the user-manager relationship in Microsoft Entra ID is always in sync with your HR data. It uses a process called *manager reference resolution* to accurately update the *manager* attribute. Before going into the process details, it is important to understand how manager information is stored in Microsoft Entra ID and on-premises Active Directory. 

* In **on-premises Active Directory**, the *manager* attribute stores the *distinguishedName (dn)* of the manager's account in AD. 
* In **Microsoft Entra ID**, the *manager* attribute is a DirectoryObject navigation property in Microsoft Entra ID. When you view the user record in the Microsoft Entra admin center, it shows the *displayName* of the manager record in Microsoft Entra ID. 

The *manager reference resolution* is a two step-process: 
* Step 1: Link the manager's HR source record with the manager's target account record using a pair of attributes referred to as *source anchor* and *target anchor*. 
* Step 2: Use the manager reference attributes defined in the schema to update the manager attribute in the target in the required format. 

The default anchor attributes and reference attributes for each app is listed below. 

| App Name | Anchor attribute | Reference attribute in user profile | 
|--|--|--| 
| Workday | WID | ManagerReference (which points to the WID of the manager record) |
| SAP SuccessFactors | personIdExternal | manager (which points to the personIdExternal of the manager record) |
| On-premises Active Directory | objectGUID | manager (which points to DN of the manager record) |
| Microsoft Entra ID | objectId | manager (which points to the manager's Microsoft Entra ID record) |

## Prerequisites for successful manager update
In order for *manager reference resolution* to work successfully, the following pre-requisites should be met: 
* Your provisioning app should be configured to use the default source and target anchors as listed above. Do not change the metadata properties (data type, API expression) associated with these anchor and reference attributes. 
* The API expressions (XPATH for Workday and JSONPath for SuccessFactors) associated with the manager attribute resolve to a valid non-null value. 
   * Workday ManagerReference default XPATH API expression: `wd:Worker/wd:Worker_Data/wd:Management_Chain_Data/wd:Worker_Supervisory_Management_Chain_Data[position()=1]/wd:Management_Chain_Data[last()=position()]/wd:Manager_Reference/wd:ID[@wd:type='WID']/text()`
   * SuccessFactors manager default JSONPath API expression: `$.employmentNav.results[0].userNav.manager.empInfo.personIdExternal`
* The manager record must also be in scope of the provisioning job. 
* The provisioning app should have processed the manager record prior to processing the user record. 

## Provision-on-demand does not update manager attribute
| Troubleshooting | Details |
|--|--|
| **Issue** | You have successfully configured the inbound provisioning app. You are testing sync with provision-on-demand. It does not update the manager attribute and you get an error message *"Invalid value"*.  |
| **Cause** | Your provisioning job is not meeting one of the [prerequisites for successful manager update](#prerequisites-for-successful-manager-update)  |
| **Resolution** | *  If you have changed the default manager attribute mapping, restore the default mapping. <br> * Ensure that the manager record is in scope and the manager API expression resolves to a valid value. <br> * Run provision-on-demand for the manager's record first and then run provision-on-demand for the user's record.  |

## Full sync does not update manager attribute
| Troubleshooting | Details |
|--|--|
| **Issue** | You have successfully configured the inbound provisioning app. You are using a scoping filter to process only certain HR records. You observe that the manager resolution is not happening for some users.  |
| **Cause** | If you are using scoping filters, most likely the manager record is not in scope.  |
| **Resolution** | Update the scoping filter to add the manager record in scope  |

## Next steps

* [Learn more about Microsoft Entra ID and Workday integration scenarios and web service calls](workday-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](check-status-user-account-provisioning.md)
