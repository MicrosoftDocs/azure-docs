---
title: Azure Active Directory and Workday integration reference
description: Technical deep dive into Workday-HR driven provisioning in Azure Active Directory
services: active-directory
author: kenwith
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: reference
ms.workload: identity
ms.date: 06/01/2021
ms.author: kenwith
ms.reviewer: arvinh, chmutali
---

# How Azure Active Directory provisioning integrates with Workday

[Azure Active Directory user provisioning service](../app-provisioning/user-provisioning.md) integrates with [Workday HCM](https://www.workday.com) to manage the identity life cycle of users. Azure Active Directory offers three pre-built integrations: 

* [Workday to on-premises Active Directory user provisioning](../saas-apps/workday-inbound-tutorial.md)
* [Workday to Azure Active Directory user provisioning](../saas-apps/workday-inbound-cloud-only-tutorial.md)
* [Workday Writeback](../saas-apps/workday-writeback-tutorial.md)

This article explains how the integration works and how you can customize the provisioning behavior for different HR scenarios. 

## Establishing connectivity 

### Restricting Workday API access to Azure AD endpoints
Azure AD provisioning service uses basic authentication to connect to Workday Web Services API endpoints.  

To further secure the connectivity between Azure AD provisioning service and Workday, you can restrict access so that the designated integration system user only accesses the Workday APIs from allowed Azure AD IP ranges. Please engage your Workday administrator to complete the following configuration in your Workday tenant. 

1. Download the [latest IP Ranges](https://www.microsoft.com/download/details.aspx?id=56519) for the Azure Public Cloud. 
1. Open the file and search for tag **AzureActiveDirectory** 

   >[!div class="mx-imgBorder"] 
   >![Azure AD IP range](media/sap-successfactors-integration-reference/azure-active-directory-ip-range.png)

1. Copy all IP address ranges listed within the element *addressPrefixes* and use the range to build your IP address list.
1. Log in to Workday admin portal. 
1. Access the **Maintain IP Ranges** task to create a new IP range for Azure data centers. Specify the IP ranges (using CIDR notation) as a comma-separated list.  
1. Access the **Manage Authentication Policies** task to create a new authentication policy. In the authentication policy, use the authentication allow list to specify the Azure AD IP range and the security group that will be allowed access from this IP range. Save the changes. 
1. Access the **Activate All Pending Authentication Policy Changes** task to confirm changes.

### Limiting access to worker data in Workday using constrained security groups

The default steps to [configure the Workday integration system user](../saas-apps/workday-inbound-tutorial.md#configure-integration-system-user-in-workday) grants access to retrieve all users in your Workday tenant. In certain integration scenarios, you may want to limit the access, so that users belonging only to certain supervisory organizations are returned by the Get_Workers API call and processed by the Workday Azure AD connector. 

You can fulfill this requirement by working with your Workday admin and configuring constrained integration system security groups. For more information on how this is done, please refer to [this Workday community article](https://community.workday.com/forums/customer-questions/620393) (*Workday Community login credentials are required to access this article*)

This strategy of limiting access using constrained ISSG (Integration System Security Groups) is particularly useful in the following scenarios: 
* **Phased rollout scenario**: You have a large Workday tenant and plan to perform a phased rollout of Workday to Azure AD automated provisioning. In this scenario, rather than excluding users who are not in scope of the current phase with Azure AD scoping filters, we recommend configuring constrained ISSG so that only in-scope workers are visible to Azure AD.
* **Multiple provisioning jobs scenario**: You have a large Workday tenant and multiple AD domains each supporting a different business unit/division/company. To support this topology, you would like to run multiple Workday to Azure AD provisioning jobs with each job provisioning a specific set of workers. In this scenario, rather than using Azure AD scoping filters to exclude worker data, we recommend configuring constrained ISSG so that only the relevant worker data is visible to Azure AD. 

### Workday test connection query

To test connectivity to Workday, Azure AD sends the following *Get_Workers* Workday Web Services request. 

```XML
<!-- Test connection query tries to retrieve one record from the first page -->
<!-- Replace version with Workday Web Services version present in your connection URL -->
<!-- Replace timestamps below with the UTC time corresponding to the test connection event -->
<Get_Workers_Request p1:version="v21.1" xmlns:p1="urn:com.workday/bsvc" xmlns="urn:com.workday/bsvc">
  <p1:Request_Criteria>
    <p1:Transaction_Log_Criteria_Data>
      <p1:Transaction_Date_Range_Data>
        <p1:Updated_From>2021-01-19T02:28:50.1491022Z</p1:Updated_From>
        <p1:Updated_Through>2021-01-19T02:28:50.1491022Z</p1:Updated_Through>
      </p1:Transaction_Date_Range_Data>
    </p1:Transaction_Log_Criteria_Data>
    <p1:Exclude_Employees>true</p1:Exclude_Employees>
    <p1:Exclude_Contingent_Workers>true</p1:Exclude_Contingent_Workers>
    <p1:Exclude_Inactive_Workers>true</p1:Exclude_Inactive_Workers>
  </p1:Request_Criteria>
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-01-19T02:28:50.1491022Z</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-01-19T02:28:50.1491022Z</p1:As_Of_Entry_DateTime>
    <p1:Page>1</p1:Page>
    <p1:Count>1</p1:Count>
  </p1:Response_Filter>
  <p1:Response_Group>
    <p1:Include_Reference>1</p1:Include_Reference>
    <p1:Include_Personal_Information>1</p1:Include_Personal_Information>
  </p1:Response_Group>
</Get_Workers_Request>
```

## How full sync works

**Full sync** in the context of Workday-driven provisioning refers to the process of fetching all identities from Workday and determining what provisioning rules to apply to each worker object. Full sync happens when you turn on provisioning for the first time and also when you *restart provisioning* either from the Azure portal or using Graph APIs. 

Azure AD sends the following *Get_Workers* Workday Web Services request to retrieve worker data. The query looks up the Workday transaction log for all effective dated worker entries as of the time corresponding to the full sync run. 

```XML
<!-- Workday full sync query -->
<!-- Replace version with Workday Web Services version present in your connection URL -->
<!-- Replace timestamps below with the UTC time corresponding to full sync run -->
<!-- Count specifies the number of records to return in each page -->
<!-- Response_Group flags derived from provisioning attribute mapping -->

<Get_Workers_Request p1:version="v21.1" xmlns:p1="urn:com.workday/bsvc" xmlns="urn:com.workday/bsvc">
  <p1:Request_Criteria>
    <p1:Transaction_Log_Criteria_Data>
      <p1:Transaction_Type_References>
        <p1:Transaction_Type_Reference>
          <p1:ID p1:type="Business_Process_Type">Hire Employee</p1:ID>
        </p1:Transaction_Type_Reference>
        <p1:Transaction_Type_Reference>
          <p1:ID p1:type="Business_Process_Type">Contract Contingent Worker</p1:ID>
        </p1:Transaction_Type_Reference>
      </p1:Transaction_Type_References>
    </p1:Transaction_Log_Criteria_Data>
  </p1:Request_Criteria>
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-01-19T02:29:16.0094202Z</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-01-19T02:29:16.0094202Z</p1:As_Of_Entry_DateTime>
    <p1:Count>30</p1:Count>
  </p1:Response_Filter>
  <p1:Response_Group>
    <p1:Include_Reference>1</p1:Include_Reference>
    <p1:Include_Personal_Information>1</p1:Include_Personal_Information>
    <p1:Include_Employment_Information>1</p1:Include_Employment_Information>
    <p1:Include_Organizations>1</p1:Include_Organizations>
    <p1:Exclude_Organization_Support_Role_Data>1</p1:Exclude_Organization_Support_Role_Data>
    <p1:Exclude_Location_Hierarchies>1</p1:Exclude_Location_Hierarchies>
    <p1:Exclude_Cost_Center_Hierarchies>1</p1:Exclude_Cost_Center_Hierarchies>
    <p1:Exclude_Company_Hierarchies>1</p1:Exclude_Company_Hierarchies>
    <p1:Exclude_Matrix_Organizations>1</p1:Exclude_Matrix_Organizations>
    <p1:Exclude_Pay_Groups>1</p1:Exclude_Pay_Groups>
    <p1:Exclude_Regions>1</p1:Exclude_Regions>
    <p1:Exclude_Region_Hierarchies>1</p1:Exclude_Region_Hierarchies>
    <p1:Exclude_Funds>1</p1:Exclude_Funds>
    <p1:Exclude_Fund_Hierarchies>1</p1:Exclude_Fund_Hierarchies>
    <p1:Exclude_Grants>1</p1:Exclude_Grants>
    <p1:Exclude_Grant_Hierarchies>1</p1:Exclude_Grant_Hierarchies>
    <p1:Exclude_Business_Units>1</p1:Exclude_Business_Units>
    <p1:Exclude_Business_Unit_Hierarchies>1</p1:Exclude_Business_Unit_Hierarchies>
    <p1:Exclude_Programs>1</p1:Exclude_Programs>
    <p1:Exclude_Program_Hierarchies>1</p1:Exclude_Program_Hierarchies>
    <p1:Exclude_Gifts>1</p1:Exclude_Gifts>
    <p1:Exclude_Gift_Hierarchies>1</p1:Exclude_Gift_Hierarchies>
    <p1:Include_Management_Chain_Data>1</p1:Include_Management_Chain_Data>
    <p1:Include_Transaction_Log_Data>1</p1:Include_Transaction_Log_Data>
    <p1:Include_Additional_Jobs>1</p1:Include_Additional_Jobs>
  </p1:Response_Group>
</Get_Workers_Request>
```
The *Response_Group* node is used to specify which worker attributes to fetch from Workday. For a description of each flag in the *Response_Group* node, please refer to the Workday [Get_Workers API documentation](https://community.workday.com/sites/default/files/file-hosting/productionapi/Human_Resources/v35.2/Get_Workers.html#Worker_Response_GroupType). 

Certain flag values specified in the *Response_Group* node are calculated based on the attributes configured in the Workday Azure AD provisioning application. Refer to the section on *Supported entities* for the criteria used to set the flag values. 

The *Get_Workers* response from Workday for the above query includes the number of worker records and page count.

```XML
  <wd:Response_Results>
    <wd:Total_Results>509</wd:Total_Results>
    <wd:Total_Pages>17</wd:Total_Pages>
    <wd:Page_Results>30</wd:Page_Results>
    <wd:Page>1</wd:Page>
  </wd:Response_Results>
```
To retrieve the next page of the result set, the next *Get_Workers* query specifies the page number as a parameter in the *Response_Filter*.

```XML
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-01-19T02:29:16.0094202Z</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-01-19T02:29:16.0094202Z</p1:As_Of_Entry_DateTime>
    <p1:Page>2</p1:Page>
    <p1:Count>30</p1:Count>
  </p1:Response_Filter>
```
Azure AD provisioning service processes each page and iterates through the all effective workers during full sync. 
For each worker entry imported from Workday:
* The [XPATH expression](workday-attribute-reference.md) is applied to retrieve attribute values from Workday.
* The attribute mapping and matching rules are applied and 
* The service determines what operation to perform in the target (Azure AD/AD). 

Once the processing is complete, it saves the timestamp associated with the start of full sync as a watermark. This watermark serves as the starting point for the incremental sync cycle. 

## How incremental sync works

After full sync, Azure AD provisioning service maintains `LastExecutionTimestamp` and uses it to create delta queries to retrieve incremental changes. During incremental sync, Azure AD sends the following types of queries to Workday: 

* [Query for manual updates](#query-for-manual-updates)
* [Query for effective-dated updates and terminations](#query-for-effective-dated-updates-and-terminations)
* [Query for future-dated hires](#query-for-future-dated-hires)

### Query for manual updates

The following *Get_Workers* request queries for manual updates that happened between last execution and current execution time. 

```xml
<!-- Workday incremental sync query for manual updates -->
<!-- Replace version with Workday Web Services version present in your connection URL -->
<!-- Replace timestamps below with the UTC time corresponding to last execution and current execution time -->
<!-- Count specifies the number of records to return in each page -->
<!-- Response_Group flags derived from provisioning attribute mapping -->

<Get_Workers_Request p1:version="v21.1" xmlns:p1="urn:com.workday/bsvc" xmlns="urn:com.workday/bsvc">
  <p1:Request_Criteria>
    <p1:Transaction_Log_Criteria_Data>
      <p1:Transaction_Date_Range_Data>
        <p1:Updated_From>2021-01-19T02:29:16.0094202Z</p1:Updated_From>
        <p1:Updated_Through>2021-01-19T02:49:06.290136Z</p1:Updated_Through>
      </p1:Transaction_Date_Range_Data>
    </p1:Transaction_Log_Criteria_Data>
  </p1:Request_Criteria>
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-01-19T02:49:06.290136Z</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-01-19T02:49:06.290136Z</p1:As_Of_Entry_DateTime>
    <p1:Count>30</p1:Count>
  </p1:Response_Filter>
  <p1:Response_Group>
    <p1:Include_Reference>1</p1:Include_Reference>
    <p1:Include_Personal_Information>1</p1:Include_Personal_Information>
    <p1:Include_Employment_Information>1</p1:Include_Employment_Information>
    <p1:Include_Organizations>1</p1:Include_Organizations>
    <p1:Exclude_Organization_Support_Role_Data>1</p1:Exclude_Organization_Support_Role_Data>
    <p1:Exclude_Location_Hierarchies>1</p1:Exclude_Location_Hierarchies>
    <p1:Exclude_Cost_Center_Hierarchies>1</p1:Exclude_Cost_Center_Hierarchies>
    <p1:Exclude_Company_Hierarchies>1</p1:Exclude_Company_Hierarchies>
    <p1:Exclude_Matrix_Organizations>1</p1:Exclude_Matrix_Organizations>
    <p1:Exclude_Pay_Groups>1</p1:Exclude_Pay_Groups>
    <p1:Exclude_Regions>1</p1:Exclude_Regions>
    <p1:Exclude_Region_Hierarchies>1</p1:Exclude_Region_Hierarchies>
    <p1:Exclude_Funds>1</p1:Exclude_Funds>
    <p1:Exclude_Fund_Hierarchies>1</p1:Exclude_Fund_Hierarchies>
    <p1:Exclude_Grants>1</p1:Exclude_Grants>
    <p1:Exclude_Grant_Hierarchies>1</p1:Exclude_Grant_Hierarchies>
    <p1:Exclude_Business_Units>1</p1:Exclude_Business_Units>
    <p1:Exclude_Business_Unit_Hierarchies>1</p1:Exclude_Business_Unit_Hierarchies>
    <p1:Exclude_Programs>1</p1:Exclude_Programs>
    <p1:Exclude_Program_Hierarchies>1</p1:Exclude_Program_Hierarchies>
    <p1:Exclude_Gifts>1</p1:Exclude_Gifts>
    <p1:Exclude_Gift_Hierarchies>1</p1:Exclude_Gift_Hierarchies>
    <p1:Include_Management_Chain_Data>1</p1:Include_Management_Chain_Data>
    <p1:Include_Additional_Jobs>1</p1:Include_Additional_Jobs>
  </p1:Response_Group>
</Get_Workers_Request>
```

### Query for effective-dated updates and terminations

The following *Get_Workers* request queries for effective-dated updates that happened between last execution and current execution time. 

```xml
<!-- Workday incremental sync query for effective-dated updates -->
<!-- Replace version with Workday Web Services version present in your connection URL -->
<!-- Replace timestamps below with the UTC time corresponding to last execution and current execution time -->
<!-- Count specifies the number of records to return in each page -->
<!-- Response_Group flags derived from provisioning attribute mapping -->

<Get_Workers_Request p1:version="v21.1" xmlns:p1="urn:com.workday/bsvc" xmlns="urn:com.workday/bsvc">
  <p1:Request_Criteria>
    <p1:Transaction_Log_Criteria_Data>
      <p1:Transaction_Date_Range_Data>
        <p1:Effective_From>2021-01-19T02:29:16.0094202Z</p1:Effective_From>
        <p1:Effective_Through>2021-01-19T02:49:06.290136Z</p1:Effective_Through>
      </p1:Transaction_Date_Range_Data>
    </p1:Transaction_Log_Criteria_Data>
  </p1:Request_Criteria>
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-01-19T02:49:06.290136Z</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-01-19T02:49:06.290136Z</p1:As_Of_Entry_DateTime>
    <p1:Page>1</p1:Page>
    <p1:Count>30</p1:Count>
  </p1:Response_Filter>
  <p1:Response_Group>
    <p1:Include_Reference>1</p1:Include_Reference>
    <p1:Include_Personal_Information>1</p1:Include_Personal_Information>
    <p1:Include_Employment_Information>1</p1:Include_Employment_Information>
    <p1:Include_Organizations>1</p1:Include_Organizations>
    <p1:Exclude_Organization_Support_Role_Data>1</p1:Exclude_Organization_Support_Role_Data>
    <p1:Exclude_Location_Hierarchies>1</p1:Exclude_Location_Hierarchies>
    <p1:Exclude_Cost_Center_Hierarchies>1</p1:Exclude_Cost_Center_Hierarchies>
    <p1:Exclude_Company_Hierarchies>1</p1:Exclude_Company_Hierarchies>
    <p1:Exclude_Matrix_Organizations>1</p1:Exclude_Matrix_Organizations>
    <p1:Exclude_Pay_Groups>1</p1:Exclude_Pay_Groups>
    <p1:Exclude_Regions>1</p1:Exclude_Regions>
    <p1:Exclude_Region_Hierarchies>1</p1:Exclude_Region_Hierarchies>
    <p1:Exclude_Funds>1</p1:Exclude_Funds>
    <p1:Exclude_Fund_Hierarchies>1</p1:Exclude_Fund_Hierarchies>
    <p1:Exclude_Grants>1</p1:Exclude_Grants>
    <p1:Exclude_Grant_Hierarchies>1</p1:Exclude_Grant_Hierarchies>
    <p1:Exclude_Business_Units>1</p1:Exclude_Business_Units>
    <p1:Exclude_Business_Unit_Hierarchies>1</p1:Exclude_Business_Unit_Hierarchies>
    <p1:Exclude_Programs>1</p1:Exclude_Programs>
    <p1:Exclude_Program_Hierarchies>1</p1:Exclude_Program_Hierarchies>
    <p1:Exclude_Gifts>1</p1:Exclude_Gifts>
    <p1:Exclude_Gift_Hierarchies>1</p1:Exclude_Gift_Hierarchies>
    <p1:Include_Management_Chain_Data>1</p1:Include_Management_Chain_Data>
    <p1:Include_Additional_Jobs>1</p1:Include_Additional_Jobs>
  </p1:Response_Group>
</Get_Workers_Request>
```

### Query for future-dated hires

If any of the above queries returns a future-dated hire, then the following *Get_Workers* request is used to fetch information about a future-dated new hire. The *WID* attribute of the new hire is used to perform the lookup and the effective date is set to the date and time of hire. 

```xml
<!-- Workday incremental sync query to get new hire data effective as on hire date/first day of work -->
<!-- Replace version with Workday Web Services version present in your connection URL -->
<!-- Replace timestamps below hire date/first day of work -->
<!-- Count specifies the number of records to return in each page -->
<!-- Response_Group flags derived from provisioning attribute mapping -->

<Get_Workers_Request p1:version="v21.1" xmlns:p1="urn:com.workday/bsvc" xmlns="urn:com.workday/bsvc">
  <p1:Request_References>
    <p1:Worker_Reference>
      <p1:ID p1:type="WID">7bf6322f1ea101fd0b4433077f09cb04</p1:ID>
    </p1:Worker_Reference>
  </p1:Request_References>
  <p1:Response_Filter>
    <p1:As_Of_Effective_Date>2021-02-01T08:00:00+00:00</p1:As_Of_Effective_Date>
    <p1:As_Of_Entry_DateTime>2021-02-01T08:00:00+00:00</p1:As_Of_Entry_DateTime>
    <p1:Count>30</p1:Count>
  </p1:Response_Filter>
  <p1:Response_Group>
    <p1:Include_Reference>1</p1:Include_Reference>
    <p1:Include_Personal_Information>1</p1:Include_Personal_Information>
    <p1:Include_Employment_Information>1</p1:Include_Employment_Information>
    <p1:Include_Organizations>1</p1:Include_Organizations>
    <p1:Exclude_Organization_Support_Role_Data>1</p1:Exclude_Organization_Support_Role_Data>
    <p1:Exclude_Location_Hierarchies>1</p1:Exclude_Location_Hierarchies>
    <p1:Exclude_Cost_Center_Hierarchies>1</p1:Exclude_Cost_Center_Hierarchies>
    <p1:Exclude_Company_Hierarchies>1</p1:Exclude_Company_Hierarchies>
    <p1:Exclude_Matrix_Organizations>1</p1:Exclude_Matrix_Organizations>
    <p1:Exclude_Pay_Groups>1</p1:Exclude_Pay_Groups>
    <p1:Exclude_Regions>1</p1:Exclude_Regions>
    <p1:Exclude_Region_Hierarchies>1</p1:Exclude_Region_Hierarchies>
    <p1:Exclude_Funds>1</p1:Exclude_Funds>
    <p1:Exclude_Fund_Hierarchies>1</p1:Exclude_Fund_Hierarchies>
    <p1:Exclude_Grants>1</p1:Exclude_Grants>
    <p1:Exclude_Grant_Hierarchies>1</p1:Exclude_Grant_Hierarchies>
    <p1:Exclude_Business_Units>1</p1:Exclude_Business_Units>
    <p1:Exclude_Business_Unit_Hierarchies>1</p1:Exclude_Business_Unit_Hierarchies>
    <p1:Exclude_Programs>1</p1:Exclude_Programs>
    <p1:Exclude_Program_Hierarchies>1</p1:Exclude_Program_Hierarchies>
    <p1:Exclude_Gifts>1</p1:Exclude_Gifts>
    <p1:Exclude_Gift_Hierarchies>1</p1:Exclude_Gift_Hierarchies>
    <p1:Include_Management_Chain_Data>1</p1:Include_Management_Chain_Data>
    <p1:Include_Additional_Jobs>1</p1:Include_Additional_Jobs>
  </p1:Response_Group>
</Get_Workers_Request>
```

## Retrieving worker data attributes

The *Get_Workers* API can return different data sets associated with a worker. Depending on the [XPATH API expressions](workday-attribute-reference.md) configured in the provisioning schema, Azure AD provisioning service determines which data sets to retrieve from Workday. Accordingly, the *Response_Group* flags are set in the *Get_Workers* request. 

The table below provides guidance on mapping configuration to use to retrieve a specific data set. 

| \# | Workday Entity                       | Included by default | XPATH pattern to specify in mapping to fetch non-default entities             |
|----|--------------------------------------|---------------------|-------------------------------------------------------------------------------|
| 1  | Personal Data                        | Yes                 | wd:Worker\_Data/wd:Personal\_Data                                             |
| 2  | Employment Data                      | Yes                 | wd:Worker\_Data/wd:Employment\_Data                                           |
| 3  | Additional Job Data                  | Yes                 | wd:Worker\_Data/wd:Employment\_Data/wd:Worker\_Job\_Data\[@wd:Primary\_Job=0\]|
| 4  | Organization Data                    | Yes                 | wd:Worker\_Data/wd:Organization\_Data                                         |
| 5  | Management Chain Data                | Yes                 | wd:Worker\_Data/wd:Management\_Chain\_Data                                    |
| 6  | Supervisory Organization             | Yes                 | 'SUPERVISORY'                                                                 |
| 7  | Company                              | Yes                 | 'COMPANY'                                                                     |
| 8  | Business Unit                        | No                  | 'BUSINESS\_UNIT'                                                              |
| 9  | Business Unit Hierarchy              | No                  | 'BUSINESS\_UNIT\_HIERARCHY'                                                   |
| 10 | Company Hierarchy                    | No                  | 'COMPANY\_HIERARCHY'                                                          |
| 11 | Cost Center                          | No                  | 'COST\_CENTER'                                                                |
| 12 | Cost Center Hierarchy                | No                  | 'COST\_CENTER\_HIERARCHY'                                                     |
| 13 | Fund                                 | No                  | 'FUND'                                                                        |
| 14 | Fund Hierarchy                       | No                  | 'FUND\_HIERARCHY'                                                             |
| 15 | Gift                                 | No                  | 'GIFT'                                                                        |
| 16 | Gift Hierarchy                       | No                  | 'GIFT\_HIERARCHY'                                                             |
| 17 | Grant                                | No                  | 'GRANT'                                                                       |
| 18 | Grant Hierarchy                      | No                  | 'GRANT\_HIERARCHY'                                                            |
| 19 | Business Site Hierarchy              | No                  | 'BUSINESS\_SITE\_HIERARCHY'                                                   |
| 20 | Matrix Organization                  | No                  | 'MATRIX'                                                                      |
| 21 | Pay Group                            | No                  | 'PAY\_GROUP'                                                                  |
| 22 | Programs                             | No                  | 'PROGRAMS'                                                                    |
| 23 | Program Hierarchy                    | No                  | 'PROGRAM\_HIERARCHY'                                                          |
| 24 | Region                               | No                  | 'REGION\_HIERARCHY'                                                           |
| 25 | Location Hierarchy                   | No                  | 'LOCATION\_HIERARCHY'                                                         |
| 26 | Account Provisioning Data            | No                  | wd:Worker\_Data/wd:Account\_Provisioning\_Data                                |
| 27 | Background Check Data                | No                  | wd:Worker\_Data/wd:Background\_Check\_Data                                    |
| 28 | Benefit Eligibility Data             | No                  | wd:Worker\_Data/wd:Benefit\_Eligibility\_Data                                 |
| 29 | Benefit Enrollment Data              | No                  | wd:Worker\_Data/wd:Benefit\_Enrollment\_Data                                  |
| 30 | Career Data                          | No                  | wd:Worker\_Data/wd:Career\_Data                                               |
| 31 | Compensation Data                    | No                  | wd:Worker\_Data/wd:Compensation\_Data                                         |
| 32 | Contingent Worker Tax Authority Data | No                  | wd:Worker\_Data/wd:Contingent\_Worker\_Tax\_Authority\_Form\_Type\_Data       |
| 33 | Development Item Data                | No                  | wd:Worker\_Data/wd:Development\_Item\_Data                                    |
| 34 | Employee Contracts Data              | No                  | wd:Worker\_Data/wd:Employee\_Contracts\_Data                                  |
| 35 | Employee Review Data                 | No                  | wd:Worker\_Data/wd:Employee\_Review\_Data                                     |
| 36 | Feedback Received Data               | No                  | wd:Worker\_Data/wd:Feedback\_Received\_Data                                   |
| 37 | Worker Goal Data                     | No                  | wd:Worker\_Data/wd:Worker\_Goal\_Data                                         |
| 38 | Photo Data                           | No                  | wd:Worker\_Data/wd:Photo\_Data                                                |
| 39 | Qualification Data                   | No                  | wd:Worker\_Data/wd:Qualification\_Data                                        |
| 40 | Related Persons Data                 | No                  | wd:Worker\_Data/wd:Related\_Persons\_Data                                     |
| 41 | Role Data                            | No                  | wd:Worker\_Data/wd:Role\_Data                                                 |
| 42 | Skill Data                           | No                  | wd:Worker\_Data/wd:Skill\_Data                                                |
| 43 | Succession Profile Data              | No                  | wd:Worker\_Data/wd:Succession\_Profile\_Data                                  |
| 44 | Talent Assessment Data               | No                  | wd:Worker\_Data/wd:Talent\_Assessment\_Data                                   |
| 45 | User Account Data                    | No                  | wd:Worker\_Data/wd:User\_Account\_Data                                        |
| 46 | Worker Document Data                 | No                  | wd:Worker\_Data/wd:Worker\_Document\_Data                                     |

>[!NOTE]
>Each Workday entity listed in the table is protected by a **Domain Security Policy** in Workday. If you are unable to retrieve any attribute associated with the entity after setting the right XPATH, check with your Workday admin to ensure that the appropriate domain security policy is configured for the integration system user associated with the provisioning app. For example, to retrieve *Skill data*, *Get* access is required on the Workday domain *Worker Data: Skills and Experience*. 

Here are some examples on how you can extend the Workday integration to meet specific requirements. 

### Example 1: Retrieving cost center and pay group information

Let's say you want to retrieve the following data sets from Workday and use them in your provisioning rules:

* Cost center
* Cost center hierarchy
* Pay group

The above data sets are not included by default. 
To retrieve these data sets:
1. Login to the Azure portal and open your Workday to AD/Azure AD user provisioning app. 
1. In the Provisioning blade, edit the mappings and open the Workday attribute list from the advanced section. 
1. Add the following attributes definitions and mark them as "Required". These attributes will not be mapped to any attribute in AD or Azure AD. They just serve as signals to the connector to retrieve the Cost Center, Cost Center Hierarchy and Pay Group information. 

     > [!div class="mx-tdCol2BreakAll"]
     >| Attribute Name | XPATH API expression |
     >|---|---|
     >| CostCenterHierarchyFlag  |  wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data[wd:Organization_Data/wd:Organization_Type_Reference/wd:ID[@wd:type='Organization_Type_ID']='COST_CENTER_HIERARCHY']/wd:Organization_Reference/@wd:Descriptor |
     >| CostCenterFlag  |  wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data[wd:Organization_Data/wd:Organization_Type_Reference/wd:ID[@wd:type='Organization_Type_ID']='COST_CENTER']/wd:Organization_Data/wd:Organization_Code/text() |
     >| PayGroupFlag  |  wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data[wd:Organization_Data/wd:Organization_Type_Reference/wd:ID[@wd:type='Organization_Type_ID']='PAY_GROUP']/wd:Organization_Data/wd:Organization_Reference_ID/text() |

1. Once the Cost Center and Pay Group data set is available in the *Get_Workers* response, you can use the below XPATH values to retrieve the cost center name, cost center code and pay group. 

     > [!div class="mx-tdCol2BreakAll"]
     >| Attribute Name | XPATH API expression |
     >|---|---|
     >| CostCenterName  | wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data/wd:Organization_Data[wd:Organization_Type_Reference/@wd:Descriptor='Cost Center']/wd:Organization_Name/text() |
     >| CostCenterCode | wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data/wd:Organization_Data[wd:Organization_Type_Reference/@wd:Descriptor='Cost Center']/wd:Organization_Code/text() |
     >| PayGroup | wd:Worker/wd:Worker_Data/wd:Organization_Data/wd:Worker_Organization_Data/wd:Organization_Data[wd:Organization_Type_Reference/@wd:Descriptor='Pay Group']/wd:Organization_Name/text() |

### Example 2: Retrieving qualification and skills data

Let's say you want to retrieve certifications associated with a user. This information is available as part of the *Qualification Data* set. 
To get this data set as part of the *Get_Workers* response, use the following XPATH: 

`wd:Worker/wd:Worker_Data/wd:Qualification_Data/wd:Certification/wd:Certification_Data/wd:Issuer/text()`

### Example 3: Retrieving provisioning group assignments

Let's say you want to retrieve *Provisioning Groups* assigned to a worker. This information is available as part of the *Account Provisioning Data* set. 
To get this data, as part of the *Get_Workers* response, use the following XPATH: 

`wd:Worker/wd:Worker_Data/wd:Account_Provisioning_Data/wd:Provisioning_Group_Assignment_Data[wd:Status='Assigned']/wd:Provisioning_Group/text()`

## Handling different HR scenarios

### Support for worker conversions

When a worker converts from employee to contingent worker or from contingent worker to employee, the Workday connector automatically detects this change and links the AD account to the active worker profile so that all AD attributes are in sync with the active worker profile. No configuration changes are required to enable this functionality. Here is the description of the provisioning behavior when a conversion happens. 

* Let's say John Smith joins as a contingent worker in January. As there is no AD account associated with John's *WorkerID* (matching attribute), the provisioning service creates a new AD account for the user and links John's contingent worker *WID (WorkdayID)* to his AD account.
* Three months later, John converts to a full-time employee. In Workday, a new worker profile is created for John. Though John's *WorkerID* in Workday stays the same, John now has two *WID*s in Workday, one associated with the contingent worker profile and another associated with the employee worker profile. 
* During incremental sync, when the provisioning service detects two worker profiles for the same WorkerID, it automatically transfers ownership of the AD account to the active worker profile. In this case, it de-links the contingent worker profile from the AD account and establishes a new link between John's active employee worker profile and his AD account. 

>[!NOTE]
>During initial full sync, you may notice a behavior where the attribute values associated with the previous inactive worker profile flow to the AD account of converted workers. This is temporary and as full sync progresses, it will eventually be overwritten by attribute values from the active worker profile. Once the full sync is complete and the provisioning job reaches steady state, it will always pick the active worker profile during incremental sync. 


### Retrieving international job assignments and secondary job details

By default, the Workday connector retrieves attributes associated with the worker's primary job. The connector also supports retrieving *Additional Job Data* associated with international job assignments or secondary jobs. 

Use the steps below to retrieve attributes associated with international job assignments: 

1. Set the Workday connection URL uses Workday Web Service API version 30.0 or above. Accordingly set the [correct XPATH values](workday-attribute-reference.md#xpath-values-for-workday-web-services-wws-api-v30) in your Workday provisioning app. 
1. Use the selector `@wd:Primary_Job=0` on the `Worker_Job_Data` node to retrieve the correct attribute. 
   * **Example 1:** To get `SecondaryBusinessTitle` use the XPATH `wd:Worker/wd:Worker_Data/wd:Employment_Data/wd:Worker_Job_Data[@wd:Primary_Job=0]/wd:Position_Data/wd:Business_Title/text()`
   * **Example 2:** To get `SecondaryBusinessLocation` use the XPATH `wd:Worker/wd:Worker_Data/wd:Employment_Data/wd:Worker_Job_Data[@wd:Primary_Job=0]/wd:Position_Data/wd:Business_Site_Summary_Data/wd:Location_Reference/@wd:Descriptor`

 

## Next steps

* [Learn how to configure Workday to Active Directory provisioning](../saas-apps/workday-inbound-tutorial.md)
* [Learn how to configure write back to Workday](../saas-apps/workday-writeback-tutorial.md)
* [Learn more about supported Workday Attributes for inbound provisioning](workday-attribute-reference.md)

