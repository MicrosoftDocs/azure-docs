---
title: Azure Active Directory and SAP SuccessFactors integration reference
description: Technical deep dive into SAP SuccessFactors-HR driven provisioning 
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: reference
ms.workload: identity
ms.date: 07/20/2020
ms.author: chmutali
---

# How Azure Active Directory provisioning integrates with SAP SuccessFactors 

[Azure Active Directory user provisioning service](../app-provisioning/user-provisioning.md) integrates with [SAP SuccessFactors Employee Central](https://www.successfactors.com/products-services/core-hr-payroll/employee-central.html) to manage the identity life cycle of users. Azure Active Directory offers three pre-built integrations: 

* SuccessFactors to on-premises Active Directory user provisioning
* SuccessFactors to Azure Active Directory user provisioning
* SuccessFactors Writeback

This article explains how the integration works and how you can customize the provisioning behavior for different HR scenarios. 

## Establishing connectivity 
Azure AD provisioning engine uses basic authentication to connect to Employee Central OData API endpoints. When setting up the SuccessFactors provisioning app, use the *Tenant URL* parameter in the *Admin Credentials* section to configure the [API data center URL](https://apps.support.sap.com/sap/support/knowledge/en/2215682). 

To further secure the connectivity between Azure AD provisioning service and SuccessFactors, you can add the Azure AD IP ranges in the SuccessFactors IP allow-list using the steps described below:

* Download the [latest IP Ranges](https://www.microsoft.com/download/details.aspx?id=56519) for the Azure Public Cloud 
* Open the file and search for tags **AzureActiveDirectory** and **AzureActiveDirectoryDomainServices** 

  >[!div class="mx-imgBorder"] 
  >![Azure AD IP range](media/sap-successfactors-integration-reference/azure-active-directory-ip-range.png)

* Copy all IP address ranges listed within the element *addressPrefixes* and use the range to build your IP address restriction list.
* Translate the CIDR values to IP ranges.  
* Log in to SuccessFactors admin portal to add IP ranges to the allow-list. Refer to SAP [support note 2253200](https://apps.support.sap.com/sap/support/knowledge/en/2253200). You can now [enter IP ranges](https://answers.sap.com/questions/12882263/whitelisting-sap-cloud-platform-ip-address-range-i.html) in this tool. 

## Supported entities
For every user in SuccessFactors, Azure AD provisioning service retrieves the following entities. Each entity is expanded using the OData API *$expand* query parameter. Refer to the *Retrieval rule* column below. Some entities are expanded by default, while some entities are expanded only if a specific attribute is present in the mapping. 

| \# | SuccessFactors Entity                  | OData Node     | Retrieval rule |
|----|----------------------------------------|------------------------------|------------------|
| 1  | PerPerson                              | *root node*                  | Always           |
| 2  | PerPersonal                            | personalInfoNav              | Always           |
| 3  | PerPhone                               | phoneNav                     | Always           |
| 4  | PerEmail                               | emailNav                     | Always           |
| 5  | EmpEmployment                          | employmentNav                | Always           |
| 6  | User                                   | employmentNav/userNav        | Always           |
| 7  | EmpJob                                 | employmentNav/jobInfoNav     | Always           |
| 8  | EmpEmploymentTermination               | activeEmploymentsCount       | Always           |
| 9  | FOCompany                              | employmentNav/jobInfoNav/companyNav | Only if company or companyId attribute is mapped |
| 10 | FODepartment                           | employmentNav/jobInfoNav/departmentNav | Only if department or departmentId attribute is mapped |
| 11 | FOBusinessUnit                         | employmentNav/jobInfoNav/businessUnitNav | Only if businessUnit or businessUnitId attribute is mapped |
| 12 | FOCostCenter                           | employmentNav/jobInfoNav/costCenterNav | Only if costCenter or costCenterId attribute is mapped |
| 13 | FODivision                             | employmentNav/jobInfoNav/divisionNav  | Only if division or divisionId attribute is mapped |
| 14 | FOJobCode                              | employmentNav/jobInfoNav/jobCodeNav  | Only if jobCode or jobCodeId attribute is mapped |
| 15 | FOPayGrade                             | employmentNav/jobInfoNav/payGradeNav  | Only if payGrade attribute is mapped |
| 16 | FOLocation                             | employmentNav/jobInfoNav/locationNav  | Only if location attribute is mapped |
| 17 | FOCorporateAddressDEFLT                | employmentNav/jobInfoNav/addressNavDEFLT  | If mapping contains one of the following attributes: officeLocationAddress,  officeLocationCity, officeLocationZipCode |
| 18 | FOEventReason                          | employmentNav/jobInfoNav/eventReasonNav  | Only if eventReason attribute is mapped |
| 19 | EmpGlobalAssignment                    | employmentNav/empGlobalAssignmentNav | Only if assignmentType is mapped |
| 20 | EmploymentType Picklist                | employmentNav/jobInfoNav/employmentTypeNav | Only if employmentType is mapped |
| 21 | EmployeeClass Picklist                 | employmentNav/jobInfoNav/employeeClassNav | Only if employeeClass is mapped |
| 22 | EmplStatus Picklist                    | employmentNav/jobInfoNav/emplStatusNav | Only if emplStatus is mapped |
| 23 | AssignmentType Picklist                | employmentNav/empGlobalAssignmentNav/assignmentTypeNav | Only if assignmentType is mapped |

## How full sync works
Based on the attribute mapping, during full sync Azure AD provisioning service sends the following "GET" OData API query to fetch effective data of all active users. 

> [!div class="mx-tdCol2BreakAll"]
>| Parameter | Description |
>| ----------|-------------|
>| OData API Host | Appends https to the *Tenant URL*. Example: `https://api4.successfactors.com` |
>| OData API Endpoint | `/odata/v2/PerPerson` |
>| OData $format query parameter | `json` |
>| OData $filter query parameter | `(personEmpTerminationInfoNav/activeEmploymentsCount ge 1) and (lastModifiedDateTime le <CurrentExecutionTime>)` |
>| OData $expand query parameter | This parameter value depends on the attributes mapped. Example: `employmentNav/userNav,employmentNav/jobInfoNav,personalInfoNav,personEmpTerminationInfoNav,phoneNav,emailNav,employmentNav/jobInfoNav/companyNav/countryOfRegistrationNav,employmentNav/jobInfoNav/divisionNav,employmentNav/jobInfoNav/departmentNav` |
>| OData customPageSize query parameter | `100` |

> [!NOTE]
> During the first initial full sync, Azure AD provisioning service does not pull inactive/terminated worker data.

For each SuccessFactors user, the provisioning service looks for an account in the target (Azure AD/on-premises Active Directory) using the matching attribute defined in the mapping. For example: if *personIdExternal* maps to *employeeId* and is set as the matching attribute, then the provisioning service uses the *personIdExternal* value to search for the user with *employeeId* filter. If a user match is found, then it updates the target attributes. If no match is found, then it creates a new entry in the target. 

To validate the data returned by your OData API endpoint for a specific *personIdExternal*, update the *SuccessFactorsAPIEndpoint* in the API query below with your API data center server URL and use a tool like [Postman](https://www.postman.com/downloads/) to invoke the query. 

```
https://[SuccessFactorsAPIEndpoint]/odata/v2/PerPerson?$format=json&
$filter=(personIdExternal in '[personIdExternalValue]')&
$expand=employmentNav/userNav,employmentNav/jobInfoNav,personalInfoNav,personEmpTerminationInfoNav,
phoneNav,phoneNav/phoneTypeNav,emailNav,employmentNav/jobInfoNav/businessUnitNav,employmentNav/jobInfoNav/companyNav,
employmentNav/jobInfoNav/companyNav/countryOfRegistrationNav,employmentNav/jobInfoNav/costCenterNav,
employmentNav/jobInfoNav/divisionNav,employmentNav/jobInfoNav/departmentNav,employmentNav/jobInfoNav/jobCodeNav,
employmentNav/jobInfoNav/locationNav,employmentNav/jobInfoNav/locationNav/addressNavDEFLT,employmentNav/jobInfoNav/payGradeNav,
employmentNav/empGlobalAssignmentNav,employmentNav/empGlobalAssignmentNav/assignmentTypeNav,employmentNav/jobInfoNav/emplStatusNav,
employmentNav/jobInfoNav/employmentTypeNav,employmentNav/jobInfoNav/employeeClassNav,employmentNav/jobInfoNav/eventReasonNav
```

## How incremental sync works

After full sync, Azure AD provisioning service maintains *LastExecutionTimestamp* and uses it to create delta queries for retrieving incremental changes. The timestamp attributes present in each SuccessFactors entity, such as *lastModifiedDateTime*, *startDate*, *endDate*, and *latestTerminationDate*, are evaluated to see if the change falls between the *LastExecutionTimestamp* and *CurrentExecutionTime*. If yes, then the entry change is considered to be effective and it is processed for sync. 

## Reading attribute data

When Azure AD provisioning service queries SuccessFactors, it retrieves a JSON result set. The JSON result set includes a number of attributes stored in Employee Central. By default, the provisioning schema is configured to retrieve only a subset of those attributes. 

To retrieve additional attributes, follow the steps listed below:
	
* Browse to **Enterprise Applications** -> **SuccessFactors App** -> **Provisioning** -> **Edit Provisioning** -> **Attribute Mapping page**.
* Scroll down and click **Show advanced options**.
* Click on **Edit attribute list for SuccessFactors**. 

> [!NOTE] 
> If the **Edit attribute list for SuccessFactors** option does not show in the Azure portal, use the URL *https://portal.azure.com/?Microsoft_AAD_IAM_forceSchemaEditorEnabled=true* to access the page. 

* The **API expression** column in this view displays the JSONPath expressions used by the connector.
  >[!div class="mx-imgBorder"] 
  >![API-Expression](media/sap-successfactors-integration-reference/jsonpath-api-expressions.png#lightbox)  
* You can either edit an existing JSONPath value or add a new attribute with a valid JSONPath expression to the schema. 

The next section provides a list of common scenarios for editing the JSONPath values. 

## Handling different HR scenarios

JSONPath is a query language for JSON that is similar to XPath for XML. Like XPath, JSONPath allows for the extraction and filtration of data out of a JSON payload.
By using JSONPath transformation, you can customize the behavior of the Azure AD provisioning app to retrieve custom attributes and handle scenarios such as rehire, worker conversion and global assignment. 

This section covers how you can customize the provisioning app for the following HR scenarios: 
* [Retrieving additional attributes](#retrieving-additional-attributes)
* [Retrieving custom attributes](#retrieving-custom-attributes)
* [Handling worker conversion scenario](#handling-worker-conversion-scenario)
* [Handling rehire scenario](#handling-rehire-scenario)
* [Handling global assignment scenario](#handling-global-assignment-scenario)
* [Handling concurrent jobs scenario](#handling-concurrent-jobs-scenario)

### Retrieving additional attributes

The default Azure AD SuccessFactors provisioning app schema ships with [90+ pre-defined attributes](sap-successfactors-attribute-reference.md). 
To add more out-of-the-box SuccessFactors attributes to the provisioning schema, use the steps listed below: 

* Use the OData query below to retrieve data for a valid test user from Employee Central. 

```
    https://[SuccessFactorsAPIEndpoint]/odata/v2/PerPerson?$format=json&
    $filter=(personIdExternal in '[personIdExternalValue]')&
    $expand=employmentNav/userNav,employmentNav/jobInfoNav,personalInfoNav,personEmpTerminationInfoNav,
    phoneNav,phoneNav/phoneTypeNav,emailNav,employmentNav/jobInfoNav/businessUnitNav,employmentNav/jobInfoNav/companyNav,
    employmentNav/jobInfoNav/companyNav/countryOfRegistrationNav,employmentNav/jobInfoNav/costCenterNav,
    employmentNav/jobInfoNav/divisionNav,employmentNav/jobInfoNav/departmentNav,employmentNav/jobInfoNav/jobCodeNav,
    employmentNav/jobInfoNav/locationNav,employmentNav/jobInfoNav/locationNav/addressNavDEFLT,employmentNav/jobInfoNav/payGradeNav,
    employmentNav/empGlobalAssignmentNav,employmentNav/empGlobalAssignmentNav/assignmentTypeNav,employmentNav/jobInfoNav/emplStatusNav,
    employmentNav/jobInfoNav/employmentTypeNav,employmentNav/jobInfoNav/employeeClassNav,employmentNav/jobInfoNav/eventReasonNav
```

* Determine the Employee Central entity associated with the attribute
  * If the attribute is part of *EmpEmployment* entity, then look for the attribute under *employmentNav* node. 
  * If the attribute is part of *User* entity, then look for the attribute under *employmentNav/userNav* node.
  * If the attribute is part of *EmpJob* entity, then look for the attribute under *employmentNav/jobInfoNav* node. 
* Construct the JSON Path associated with the attribute and add this new attribute to the list of SuccessFactors attributes. 
  * Example 1: Let's say you want to add the attribute *okToRehire*, which is part of *employmentNav* entity, then use the JSONPath  `$.employmentNav.results[0].okToRehire`
  * Example 2: Let's say you want to add the attribute *timeZone*, which is part of *userNav* entity, then use the JSONPath `$.employmentNav.results[0].userNav.timeZone`
  * Example 3: Let's say you want to add the attribute *flsaStatus*, which is part of *jobInfoNav* entity, then use the JSONPath `$.employmentNav.results[0].jobInfoNav.results[0].flsaStatus`
* Save the schema. 
* Restart provisioning.

### Retrieving custom attributes

By default, the following custom attributes are pre-defined in the Azure AD SuccessFactors provisioning app: 
* *custom01-custom15* from the User (userNav) entity
* *customString1-customString15* from the EmpEmployment (employmentNav) entity called *empNavCustomString1-empNavCustomString15*
* *customString1-customString15* from the EmpJobInfo (jobInfoNav) entity called *empJobNavCustomString1-empNavJobCustomString15*

Let's say, in your Employee Central instance, *customString35* attribute in *EmpJobInfo* stores the location description. You want to flow this value to Active Directory *physicalDeliveryOfficeName* attribute. To configure attribute mapping for this scenario, use the steps given below: 

* Edit the SuccessFactors attribute list to add a new attribute called *empJobNavCustomString35*.
* Set the JSONPath API expression for this attribute as: 
  `$.employmentNav.results[0].jobInfoNav.results[0].customString35`
* Save and reload the mapping change in the Azure portal.  
* In the attribute mapping blade, map *empJobNavCustomString35* to *physicalDeliveryOfficeName*.
* Save the mapping.

Extending this scenario: 
* If you want to map *custom35* attribute from the *User* entity, then use the JSONPath `$.employmentNav.results[0].userNav.custom35`
* If you want to map *customString35* attribute from the *EmpEmployment* entity, then use the JSONPath `$.employmentNav.results[0].customString35`

### Handling worker conversion scenario

Worker conversion is the process of converting an existing full-time employee to a contractor or vice versa. In this scenario, Employee Central adds a new *EmpEmployment* entity along with a new *User* entity for the same *Person* entity. The *User* entity nested under the previous *EmpEmployment* entity is set to null. To handle this scenario so that the new employment data shows up when a conversion occurs, you can bulk update the provisioning app schema using the steps listed below:  

* Open the attribute mapping blade of your SuccessFactors provisioning app. 
* Scroll down and click **Show advanced options**.
* Click on the link **Review your schema here** to open the schema editor. 
  >![review-schema](media/sap-successfactors-integration-reference/review-schema.png#lightbox)
* Click on the **Download** link to save a copy of the schema before editing. 
  >![download-schema](media/sap-successfactors-integration-reference/download-schema.png#lightbox)
* In the schema editor, press Ctrl-H key to open the find-replace control.
* In the find text box, copy, and paste the value `$.employmentNav.results[0]`
* In the replace text box, copy, and paste the value `$.employmentNav.results[?(@.userNav != null)]`. Note the whitespace surrounding the `!=` operator, which is important for successful processing of the JSONPath expression. 
  >![find-replace-conversion](media/sap-successfactors-integration-reference/find-replace-conversion-scenario.png#lightbox)
* Click on the "replace all" option to update the schema. 
* Save the schema. 
* The above process updates all JSONPath expressions as follows: 
  * Old JSONPath: `$.employmentNav.results[0].jobInfoNav.results[0].departmentNav.name_localized`
  * New JSONPath: `$.employmentNav.results[?(@.userNav != null)].jobInfoNav.results[0].departmentNav.name_localized`
* Restart provisioning. 

### Handling rehire scenario

Usually there are two options to process rehires: 
* Option 1: Create a new person profile in Employee Central
* Option 2: Reuse existing person profile in Employee Central

If your HR process uses Option 1, then no changes are required to the provisioning schema. 
If your HR process uses Option 2, then Employee Central adds a new *EmpEmployment* entity along with a new *User* entity for the same *Person* entity. Unlike the conversion scenario, the previous *EmpEmployment* entity retains the *User* entity and it is not set to null. 

To handle this rehire scenario (option 2), so that the latest employment data shows up for rehire profiles, you can bulk update the provisioning app schema using the steps listed below:  

* Open the attribute mapping blade of your SuccessFactors provisioning app. 
* Scroll down and click **Show advanced options**.
* Click on the link **Review your schema here** to open the schema editor.   
* Click on the **Download** link to save a copy of the schema before editing.   
* In the schema editor, press Ctrl-H key to open the find-replace control.
* In the find text box, copy, and paste the value `$.employmentNav.results[0]`
* In the replace text box, copy, and paste the value `$.employmentNav.results[-1:]`. This JSONPath expression returns the latest *EmpEmployment* record.   
* Click on the "replace all" option to update the schema. 
* Save the schema. 
* The above process updates all JSONPath expressions as follows: 
  * Old JSONPath: `$.employmentNav.results[0].jobInfoNav.results[0].departmentNav.name_localized`
  * New JSONPath: `$.employmentNav.results[-1:].jobInfoNav.results[0].departmentNav.name_localized`
* Restart provisioning. 

### Handling global assignment scenario

When a user in Employee Central is processed for global assignment, SuccessFactors adds a new *EmpEmployment* entity and sets the *assignmentClass* to "GA". It also creates new *User* entity. Thus, the user now has:
* One *EmpEmployment* + *User* entity that corresponds to home assignment with *assignmentClass* set to "ST" and 
* Another *EmpEmployment* + *User* entity that corresponds to the global assignment with *assignmentClass* set to "GA"

To fetch attributes belonging to the standard assignment and global assignment user profile, use the steps listed below: 

* Open the attribute mapping blade of your SuccessFactors provisioning app. 
* Scroll down and click **Show advanced options**.
* Click on the link **Review your schema here** to open the schema editor.   
* Click on the **Download** link to save a copy of the schema before editing.   
* In the schema editor, press Ctrl-H key to open the find-replace control.
* In the find text box, copy, and paste the value `$.employmentNav.results[0]`
* In the replace text box, copy, and paste the value `$.employmentNav.results[?(@.assignmentClass == 'ST')]`. 
* Click on the "replace all" option to update the schema. 
* Save the schema. 
* The above process updates all JSONPath expressions as follows: 
  * Old JSONPath: `$.employmentNav.results[0].jobInfoNav.results[0].departmentNav.name_localized`
  * New JSONPath: `$.employmentNav.results[?(@.assignmentClass == 'ST')].jobInfoNav.results[0].departmentNav.name_localized`
* Reload the attribute mapping blade of the app. 
* Scroll down and click **Show advanced options**.
* Click on **Edit attribute list for SuccessFactors**.
* Add new attributes to fetch global assignment data. For example: if you want to fetch the department name associated with a global assignment profile, you can add the attribute **globalAssignmentDepartment** with the JSONPath expression set to `$.employmentNav.results[?(@.assignmentClass == 'GA')].jobInfoNav.results[0].departmentNav.name_localized`. 
* You can now either flow both department values to Active Directory attributes or selectively flow a value using expression mapping. Example: the below expression sets the value of AD *department* attribute to *globalAssignmentDepartment* if it is present, else it sets the value to *department* associated with standard assignment. 
  * `IIF(IsPresent([globalAssignmentDepartment]),[globalAssignmentDepartment],[department])`
* Save the mapping. 
* Restart provisioning. 

### Handling concurrent jobs scenario

When a user in Employee Central has concurrent/multiple jobs, there are two *EmpEmployment* and *User* entities with *assignmentClass* set to "ST". 
To fetch attributes belonging to both jobs, use the steps listed below: 

* Open the attribute mapping blade of your SuccessFactors provisioning app. 
* Scroll down and click **Show advanced options**.
* Click on **Edit attribute list for SuccessFactors**.
* Let's say you want to pull the department associated with job 1 and job 2. The pre-defined attribute *department* already fetches the value of department for the first job. You can define a new attribute called *secondJobDepartment* and set the JSONPath expression to `$.employmentNav.results[1].jobInfoNav.results[0].departmentNav.name_localized`
* You can now either flow both department values to Active Directory attributes or selectively flow a value using expression mapping. 
* Save the mapping. 
* Restart provisioning. 

## Next steps

* [Learn how to configure SuccessFactors to Active Directory provisioning](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md)
* [Learn how to configure writeback to SuccessFactors](../saas-apps/sap-successfactors-writeback-tutorial.md)
* [Learn more about supported SuccessFactors Attributes for inbound provisioning](sap-successfactors-attribute-reference.md)










