---
title: API-driven inbound provisioning with PowerShell script (Public preview)
description: Learn how to implement API-driven inbound provisioning with a PowerShell script.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: cmmdesai
---

# API-driven inbound provisioning with PowerShell script (Public preview)

This tutorial describes how to use a PowerShell script to implement Microsoft Entra ID [API-driven inbound provisioning](inbound-provisioning-api-concepts.md). Using the steps in this tutorial, you can convert a CSV file containing HR data into a bulk request payload and send it to the Microsoft Entra provisioning [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint. The article also provides guidance on how the same integration pattern can be used with any system of record. 

## Integration scenario

### Business requirement

Your system of record periodically generates CSV file exports containing worker data. You want to implement an integration that reads data from the CSV file and automatically provisions user accounts in your target directory (on-premises Active Directory for hybrid users and Microsoft Entra ID for cloud-only users).

### Implementation requirement

From an implementation perspective:

* You want to use an unattended PowerShell script to read data from the CSV file exports and send it to the inbound provisioning API endpoint. 
* In your PowerShell script, you don't want to implement the complex logic of comparing identity data between your system of record and target directory. 
* You want to use Microsoft Entra provisioning service to apply your IT managed provisioning rules to automatically create/update/enable/disable accounts in the target directory (on-premises Active Directory or Microsoft Entra ID).

:::image type="content" source="media/inbound-provisioning-api-powershell/powershell-integration-overview.png" alt-text="Graphic of PowerShell-based integration." lightbox="media/inbound-provisioning-api-powershell/powershell-integration-overview.png":::

### Integration scenario variations

While this tutorial uses a CSV file as a system of record, you can customize the sample PowerShell script to read data from any system of record. Here's a list of enterprise integration scenario variations, where API-driven inbound provisioning can be implemented with a PowerShell script.

|#  |System of record  |Integration guidance on using PowerShell to read source data |
|---------|---------|---------|
|1     |  Database table  | If you're using an Azure SQL database or an on-premises SQL Server, you can use the [Read-SqlTableData](/powershell/module/sqlserver/read-sqltabledata) cmdlet to read data stored in a table of a SQL database. You can use the [Invoke-SqlCmd](/powershell/module/sqlserver/invoke-sqlcmd) cmdlet to run Transact-SQL or XQuery scripts. <br> If you're using an Oracle / MySQL / Postgres database, you can find a PowerShell module either published by the vendor or available in the [PowerShell Gallery](https://www.powershellgallery.com/). Use the module to read data from your database table.   |
|2     |  LDAP server  | Use the `System.DirectoryServices.Protocols` .NET API or one of the LDAP modules available in the [PowerShell Gallery](https://www.powershellgallery.com/packages?q=ldap) to query your LDAP server. Understand the LDAP schema and hierarchy to retrieve user data from the LDAP server. |
|3     |  Any system that exposes REST APIs   | To read data from a REST API endpoint using PowerShell, you can use the [Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod) cmdlet from the `Microsoft.PowerShell.Utility` module. Check the documentation of your REST API and find out what parameters and headers it expects, what format it returns, and what authentication method it uses. You can then adjust your `Invoke-RestMethod` command accordingly.    |
|4     |  Any system that exposes SOAP APIs   | To read data from a SOAP API endpoint using PowerShell, you can use the [New-WebServiceProxy](/powershell/module/microsoft.powershell.management/new-webserviceproxy) cmdlet from the `Microsoft.PowerShell.Management` module. Check the documentation of your SOAP API and find out what parameters and headers it expects, what format it returns, and what authentication method it uses. You can then adjust your `New-WebServiceProxy` command accordingly.  |

After reading the source data, apply your pre-processing rules and convert the output from your system of record into a bulk request that can be sent to the Microsoft Entra provisioning [bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint.

> [!IMPORTANT]
> If you'd like to share your PowerShell integration script with the community, publish it on [PowerShell Gallery](https://www.powershellgallery.com/) and notify us on the GitHub repository [`entra-id-inbound-provisioning`](https://github.com/AzureAD/entra-id-inbound-provisioning), so we can add a reference it. 

## How to use this tutorial

The PowerShell sample script published in the [Microsoft Entra inbound provisioning GitHub repository](https://github.com/AzureAD/entra-id-inbound-provisioning/tree/main/PowerShell/CSV2SCIM) automates several tasks. It has logic for handling large CSV files and chunking the bulk request to send 50 records in each request. Here's how you can test it and customize it per your integration requirements. 

> [!NOTE]
> The sample PowerShell script is provided "as-is" for implementation reference. If you have questions related to the script or if you'd like to enhance it, please use the [GitHub project repository](https://github.com/AzureAD/entra-id-inbound-provisioning).

|# | Automation task | Implementation guidance | Advanced customization |
|---------|---------|---------|----------|
|1 | Read worker data from the CSV file. | [Download the PowerShell script](#download-the-powershell-script). It has out-of-the-box logic to read data from any CSV file. Refer to [CSV2SCIM PowerShell usage details](#csv2scim-powershell-usage-details) to get familiar with the different execution modes of this script.  | If your system of record is different, check guidance provided in the section [Integration scenario variations](#integration-scenario-variations) on how you can customize the PowerShell script. |
|2 | Pre-process and convert data to SCIM format.  | By default, the PowerShell script converts each record in the CSV file to a SCIM Core User + Enterprise User representation. Follow the steps in the section [Generate bulk request payload with standard schema](#generate-bulk-request-payload-with-standard-schema) to get familiar with this process.  | If your CSV file has different fields, tweak the [AttributeMapping.psd file](#attributemappingpsd-file) to generate a valid SCIM user. You can also [generate bulk request with custom SCIM schema](#generate-bulk-request-with-custom-scim-schema). Update the PowerShell script to include any custom CSV data validation logic.|
|3 | Use a certificate for authentication to Microsoft Entra ID. | [Create a service principal that can access](inbound-provisioning-api-grant-access.md) the inbound provisioning API. Refer to steps in the section [Configure client certificate for service principal authentication](#configure-client-certificate-for-service-principal-authentication) to learn how to use client certificate for authentication. | If you'd like to use managed identity instead of a service principal for authentication, then review the use of `Connect-MgGraph` in the sample script and update it to use [managed identities](/powershell/microsoftgraph/authentication-commands#using-managed-identity). |
|4 | Provision accounts in on-premises Active Directory or Microsoft Entra ID.  | Configure [API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md). This generates a unique [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint. Refer to the steps in the section [Generate and upload bulk request payload as admin user](#generate-and-upload-bulk-request-payload-as-admin-user) to learn how to upload data to this endpoint. Validate the attribute flow and customize the attribute mappings per your integration requirements. To run the script using a service principal with certificate-based authentication, refer to the steps in the section [Upload bulk request payload using client certificate authentication](#upload-bulk-request-payload-using-client-certificate-authentication) | If you plan to [use bulk request with custom SCIM schema](#generate-bulk-request-with-custom-scim-schema), then [extend the provisioning app schema](#extending-provisioning-job-schema) to include your custom SCIM schema elements.|
|5 | Scan the provisioning logs and retry provisioning for failed records.  |  Refer to the steps in the section [Get provisioning logs of the latest sync cycles](#get-provisioning-logs-of-the-latest-sync-cycles)  to learn how to fetch and analyze provisioning log data. Identify failed user records and include them in the next upload cycle.  | - |
|6 | Deploy your PowerShell based automation to production.  |  Once you have verified your API-driven provisioning flow and customized the PowerShell script to meet your requirements, you can deploy the automation as a [PowerShell Workflow runbook in Azure Automation](../../automation/learn/automation-tutorial-runbook-textual.md) or as a server process [scheduled to run on a Windows server](/troubleshoot/windows-server/system-management-components/schedule-server-process). | - |


## Download the PowerShell script

1. Access the GitHub repository [`entra-id-inbound-provisioning`](https://github.com/AzureAD/entra-id-inbound-provisioning). 
1. Use the **Code** -> **Clone**  or **Code** -> **Download ZIP** option to copy contents of this repository into your local folder. 
1. Navigate to the folder **PowerShell/CSV2SCIM**. It has the following directory structure:
   - src
     - CSV2SCIM.ps1 (main script)
     - ScimSchemaRepresentations (folder containing standard SCIM schema definitions for validating AttributeMapping.psd1 files)
       - EnterpriseUser.json, Group.json, Schema.json, User.json
   - Samples
     - AttributeMapping.psd1 (sample mapping of columns in CSV file to standard SCIM attributes)
     - csv-with-2-records.csv (sample CSV file with two records)
     - csv-with-1000-records.csv (sample CSV file with 1000 records)
     - Test-ScriptCommands.ps1 (sample usage commands)
     - UseClientCertificate.ps1 (script to generate self-signed certificate and upload it as service principal credential for use in OAuth flow)
     - `Sample1` (folder with more examples of how CSV file columns can be mapped to SCIM standard attributes. If you get different CSV files for employees, contractors, interns, you can create a separate AttributeMapping.psd1 file for each entity.)
1. Download and install the latest version of PowerShell.
1. Run the command to enable execution of remote signed scripts:
    ```powershell
    set-executionpolicy remotesigned
    ```
1. Install the following prerequisite modules:
    ```powershell
    Install-Module -Name Microsoft.Graph.Applications,Microsoft.Graph.Reports
    ```

## Generate bulk request payload with standard schema

This section explains how to generate a bulk request payload with standard SCIM Core User and Enterprise User attributes from a CSV file. 
To illustrate the procedure, let's use the CSV file `Samples/csv-with-2-records.csv`. 

1. Open the CSV file `Samples/csv-with-2-records.csv` in Notepad++ or Excel to check the columns present in the file. 
    :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/columns.png" alt-text="Screenshot of columns in Excel." lightbox="./media/inbound-provisioning-api-powershell/columns.png":::

1. In Notepad++ or a source code editor like Visual Studio Code, open the PowerShell data file `Samples/AttributeMapping.psd1` that enables mapping of CSV file columns to SCIM standard schema attributes. The file that's shipped out-of-the-box already has pre-configured mapping of CSV file columns to corresponding SCIM schema attributes. 
    ```powershell
        @{
        externalId   = 'WorkerID'
        name         = @{
            familyName = 'LastName'
            givenName  = 'FirstName'
        }
        active       = { $_.'WorkerStatus' -eq 'Active' }
        userName     = 'UserID'
        displayName  = 'FullName'
        nickName     = 'UserID'
        userType     = 'WorkerType'
        title        = 'JobTitle'
        addresses    = @(
            @{
                type          = { 'work' }
                streetAddress = 'StreetAddress'
                locality      = 'City'
                postalCode    = 'ZipCode'
                country       = 'CountryCode'
            }
        )
        phoneNumbers = @(
            @{
                type  = { 'work' }
                value = 'OfficePhone'
            }
        )
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" = @{
            employeeNumber = 'WorkerID'
            costCenter     = 'CostCenter'
            organization   = 'Company'
            division       = 'Division'
            department     = 'Department'
            manager        = @{
                value = 'ManagerID'
            }
        }
    }
    ```
1. Open PowerShell and change to the directory **CSV2SCIM\src**.
1. Run the following command to initialize the `AttributeMapping` variable. 

   ```powershell
   $AttributeMapping = Import-PowerShellDataFile '..\Samples\AttributeMapping.psd1'
   ```

1. Run the following command to validate if the `AttributeMapping` file has valid SCIM schema attributes. This command returns **True** if the validation is successful. 

   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -ValidateAttributeMapping
   ```

1. Let's say the `AttributeMapping` file has an invalid SCIM attribute called **userId**, then the `ValidateAttributeMapping` mode displays the following error. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/mapping-error.png" alt-text="Screenshot of a mapping error." lightbox="./media/inbound-provisioning-api-powershell/mapping-error.png":::

1. Once you verified that the `AttributeMapping` file is valid, run the following command to generate a bulk request in the file `BulkRequestPayload.json` that includes the two records present in the CSV file. 


   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping > BulkRequestPayload.json
   ```

1. You can open the contents of the file `BulkRequestPayload.json` to verify if the SCIM attributes are set as per mapping defined in the file `AttributeMapping.psd1`.

1. You can post the file generated above as-is to the [/bulkUpload](/graph/api/synchronization-synchronizationjob-post-bulkupload) API endpoint associated with your provisioning app using Graph Explorer or Postman or cURL. Reference: 

   - [Quick start with Graph Explorer](inbound-provisioning-api-graph-explorer.md) 
   - [Quick start with Postman](inbound-provisioning-api-postman.md)
   - [Quick start with cURL](inbound-provisioning-api-curl-tutorial.md)

1. To directly upload the generated payload to the API endpoint using the same PowerShell script refer to the next section. 


## Generate and upload bulk request payload as admin user

This section explains how to send the generated bulk request payload to your inbound provisioning API endpoint. 

1. Log in to your [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Administrator](https://go.microsoft.com/fwlink/?linkid=2247823).
1. Browse to **Provisioning App** > **Properties** > **Object ID** and copy the `ServicePrincipalId` associated with your provisioning app.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/object-id.png" alt-text="Screenshot of the Object ID." lightbox="./media/inbound-provisioning-api-powershell/object-id.png":::

1. As user with Global Administrator role, run the following command by providing the correct values for `ServicePrincipalId` and `TenantId`. It will prompt you for authentication if an authenticated session doesn't already exist for this tenant. Provide your consent to permissions prompted during authentication.  

   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -ServicePrincipalId <servicePrincipalId> -TenantId "contoso.onmicrosoft.com"
   ```
1. Visit the **Provisioning logs** blade of your provisioning app to verify the processing of the above request. 


## Configure client certificate for service principal authentication

> [!NOTE]
> The instructions here show how to generate a self-signed certificate. Self-signed certificates are not trusted by default and they can be difficult to maintain. Also, they may use outdated hash and cipher suites that may not be strong. For better security, purchase a certificate signed by a well-known certificate authority.

1. Run the following PowerShell script to generate a new self-signed certificate. You can skip this step if you have purchased a certificate signed by a well-known certificate authority. 
    ```powershell
    $ClientCertificate = New-SelfSignedCertificate -Subject 'CN=CSV2SCIM' -KeyExportPolicy 'NonExportable' -CertStoreLocation Cert:\CurrentUser\My
    $ThumbPrint = $ClientCertificate.ThumbPrint
    ```
    The generated certificate is stored **Current User\Personal\Certificates**. You can view it using the **Control Panel** -> **Manage user certificates** option. 
1. To associate this certificate with a valid service principal, log in to your Microsoft Entra admin center as Application Administrator.
1. Open [the service principal you configured](inbound-provisioning-api-grant-access.md#configure-a-service-principal) under **App Registrations**.
1. Copy the **Object ID** from the **Overview** blade. Use the value to replace the string `<AppObjectId>`. Copy the **Application (client) Id**. We will use it later and it is referenced as `<AppClientId>`.
1. Run the following command to upload your certificate to the registered service principal. 
    ```powershell
    Connect-MgGraph -Scopes "Application.ReadWrite.All"
    Update-MgApplication -ApplicationId '<AppObjectId>' -KeyCredentials @{
       Type = "AsymmetricX509Cert"
       Usage = "Verify"
       Key = $ClientCertificate.RawData
    }
    ```
    You should see the certificate under the **Certificates & secrets** blade of your registered app. 
    :::image type="content" source="media/inbound-provisioning-api-powershell/client-certificate.png" alt-text="Screenshot of client certificate." lightbox="media/inbound-provisioning-api-powershell/client-certificate.png":::
1. Add the following two **Application** permission scopes to the service principal app: **Application.Read.All** and **Synchronization.Read.All**. These are required for the PowerShell script to look up the provisioning app by `ServicePrincipalId` and fetch the provisioning `JobId`.

## Upload bulk request payload using client certificate authentication

This section explains how to send the generated bulk request payload to your inbound provisioning API endpoint using a trusted client certificate.

1. Open the API-driven provisioning app that you [configured](inbound-provisioning-api-configure-app.md). Copy the `ServicePrincipalId` associated with your provisioning app from **Provisioning App** > **Properties** > **Object ID**.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/object-id.png" alt-text="Screenshot of the Object ID." lightbox="./media/inbound-provisioning-api-powershell/object-id.png":::

1. Run the following command by providing the correct values for `ServicePrincipalId`, `ClientId` and `TenantId`.  

    ```powershell
    $ClientCertificate = Get-ChildItem -Path cert:\CurrentUser\my\ | Where-Object {$_.Subject -eq "CN=CSV2SCIM"}  
    $ThumbPrint = $ClientCertificate.ThumbPrint

    .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -TenantId "contoso.onmicrosoft.com" -ServicePrincipalId "<ProvisioningAppObjectId>" -ClientId "<AppClientId>" -ClientCertificate (Get-ChildItem Cert:\CurrentUser\My\$ThumbPrint)
    ```
1. Visit the **Provisioning logs** blade of your provisioning app to verify the processing of the above request. 

## Generate bulk request with custom SCIM schema

This section describes how to generate a bulk request with custom SCIM schema namespace consisting of fields in the CSV file. 

1. In Notepad++ or a source code editor like Visual Studio Code, open the PowerShell data file `Samples/AttributeMapping.psd1` that enables mapping of CSV file columns to SCIM standard schema attributes. The file that's shipped out-of-the-box already has pre-configured mapping of CSV file columns to corresponding SCIM schema attributes.  
1. Open PowerShell and change to the directory **CSV2SCIM\src**.
1. Run the following command to initialize the `AttributeMapping` variable. 

   ```powershell
   $AttributeMapping = Import-PowerShellDataFile '..\Samples\AttributeMapping.psd1'
   ```

1. Run the following command to validate if the `AttributeMapping` file has valid SCIM schema attributes. This command returns **True** if the validation is successful. 

   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -ValidateAttributeMapping
   ```

1. In addition to the SCIM Core User and Enterprise User attributes, to get a flat-list of all CSV fields under a custom SCIM schema namespace `urn:ietf:params:scim:schemas:extension:contoso:1.0:User`, run the following command. 
   ```powershell
    .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -AttributeMapping $AttributeMapping -ScimSchemaNamespace "urn:ietf:params:scim:schemas:extension:contoso:1.0:User"  > BulkRequestPayloadWithCustomNamespace.json
   ```
    The CSV fields will show up under the custom SCIM schema namespace. 
    :::image type="content" source="media/inbound-provisioning-api-powershell/user-details-under-custom-schema.png" alt-text="Screenshot of user details under custom schema." lightbox="media/inbound-provisioning-api-powershell/user-details-under-custom-schema.png":::

## Extending provisioning job schema

Often the data file sent by HR teams contains more attributes that don't have a direct representation in the standard SCIM schema. To represent such attributes, we recommend creating a SCIM extension schema and adding attributes under this namespace. 

The CSV2SCIM script provides an execution mode called `UpdateSchema` which reads all columns in the CSV file, adds them under an extension schema namespace, and updates the provisioning app schema. 

> [!NOTE] 
> If the attribute extensions are already present in the provisioning app schema, then this mode only emits a warning that the attribute extension already exists. So, there is no issue running the CSV2SCIM script in the **UpdateSchema** mode if new fields are added to the CSV file and you want to add them as an extension. 

To illustrate the procedure, we'll use the CSV file ```Samples/csv-with-2-records.csv``` present in the **CSV2SCIM** folder. 

1. Open the CSV file ```Samples/csv-with-2-records.csv``` in a Notepad, Excel, or TextPad to check the columns present in the file. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/check-columns.png" alt-text="Screenshot of how to check CSV columns." lightbox="./media/inbound-provisioning-api-powershell/check-columns.png":::

1. Run the following command: 

   ```powershell
   .\CSV2SCIM.ps1 -Path '..\Samples\csv-with-2-records.csv' -UpdateSchema -ServicePrincipalId <servicePrincipalId> -TenantId "contoso.onmicrosoft.com" -ScimSchemaNamespace "urn:ietf:params:scim:schemas:extension:contoso:1.0:User"
   ```

1. You can verify the update to your provisioning app schema by opening the **Attribute Mapping** page and accessing the **Edit attribute list for API** option under **Advanced options**. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/advanced-options.png" alt-text="Screenshot of Attribute Mapping in Advanced options." lightbox="./media/inbound-provisioning-api-powershell/advanced-options.png":::

1. The **Attribute List** shows attributes under the new namespace. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/attribute-list.png" alt-text="Screenshot of the attribute list." lightbox="./media/inbound-provisioning-api-powershell/attribute-list.png":::



## Get provisioning logs of the latest sync cycles

After sending the bulk request, you can query the logs of the latest sync cycles processed by Microsoft Entra ID. You can retrieve the sync statistics and processing details with the PowerShell script and save it for analysis. 

1. To view the log details and sync statistics on the console, run the following command:

   ```powershell
   .\CSV2SCIM.ps1 -ServicePrincipalId <servicePrincipalId> -TenantId "contoso.onmicrosoft.com" -GetPreviousCycleLogs -NumberOfCycles 1
   ```

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/stats.png" alt-text="Screenshot of sync statistics." lightbox="./media/inbound-provisioning-api-powershell/stats.png":::

   > [!NOTE]
   > NumberOfCycles is 1 by default. Specify a number to retrieve more sync cycles.

1. To view sync statistics on the console and save the logs details to a variable, run the following command:

    ```powershell
    $logs=.\CSV2SCIM.ps1 -ServicePrincipalId <servicePrincipalId> -TenantId "contoso.onmicrosoft.com" -GetPreviousCycleLogs
    ```
    
    To run the command using client certificate authentication, run the command by providing the correct values for `ServicePrincipalId`, `ClientId` and `TenantId`: 
    ```powershell
    $ClientCertificate = Get-ChildItem -Path cert:\CurrentUser\my\ | Where-Object {$_.Subject -eq "CN=CSV2SCIM"}  
    $ThumbPrint = $ClientCertificate.ThumbPrint

    $logs=.\CSV2SCIM.ps1 -ServicePrincipalId "<ProvisioningAppObjectId>" -TenantId "contoso.onmicrosoft.com" -ClientId "<AppClientId>" -ClientCertificate (Get-ChildItem Cert:\CurrentUser\My\$ThumbPrint) -GetPreviousCycleLogs -NumberOfCycles 1
    ```

   - To see the details of a specific record we can loop into the collection or select a specific index of it, for example: `$logs[0]`

     :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/index.png" alt-text="Screenshot of a selected index.":::

   - We can also use the `where-object` statement to search for a specific record using the sourceID or DisplayName. In the **ProvisioningLogs** property, we can find all the details of the operation done for that specific record.
       ```powershell
       $user = $logs | where sourceId -eq '1222'
       $user.ProvisioningLogs | fl
       ```
     :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/logs.png" alt-text="Screenshot of provisioning logs.":::

   - We can see the specific user affected properties on the **ModifiedProperties** attribute. `$user.ProvisioningLogs.ModifiedProperties`

     :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/properties.png" alt-text="Screenshot of properties.":::

## Appendix

### CSV2SCIM PowerShell usage details

Here is a list of command-line parameters accepted by the CSV2SCIM PowerShell script.  

```powershell
PS > CSV2SCIM.ps1 -Path <path-to-csv-file> 
[-ScimSchemaNamespace <customSCIMSchemaNamespace>] 
[-AttributeMapping $AttributeMapping] 
[-ServicePrincipalId <spn-guid>] 
[-ValidateAttributeMapping]
[-UpdateSchema]
[-ClientId <client-id>]
[-ClientCertificate <certificate-object>]
[-RestartService]
```

> [!NOTE]
> The `AttributeMapping` and `ValidateAttributeMapping` command-line parameters refer to the mapping of CSV column attributes to the standard SCIM schema elements. 
It doesn't refer to the attribute mappings that you perform in the Microsoft Entra admin center provisioning app between source SCIM schema elements and target Microsoft Entra / on-premises Active Directory attributes. 

| Parameter |    Description | Processing remarks |
|----------|----------------|--------------------|
| Path | The full or relative path to the CSV file. For example: `.\Samples\csv-with-1000-records.csv`    | Mandatory: Yes |
|ScimSchemaNamespace | The custom SCIM Schema namespace to use to send all columns in the CSV file as custom SCIM attributes belonging to specific namespace. For example, `urn:ietf:params:scim:schemas:extension:csv:1.0:User` | Mandatory: Only when you want to:</br>- Update the provisioning app schema or </br>When you want to include custom SCIM attributes in the payload. |
| AttributeMapping | Points to a PowerShell Data (.psd1 extension) file that maps columns in the CSV file to SCIM Core User and Enterprise User attributes. </br>See example: [AttributeMapping.psd file for CSV2SCIM script]().</br> For example: ```powershell $AttributeMapping = Import-PowerShellDataFile '.\Samples\AttributeMapping.psd1'`-AttributeMapping $AttributeMapping``` | Mandatory: Yes </br> The only scenario when you don't need to specify this is when using the `UpdateSchema` switch.|
| ValidateAttributeMapping |Use this Switch flag to validate that the AttributeMapping file contains attributes that comply with the SCIM Core and Enterprise user schema. | Mandatory: No</br>  Recommend using it to ensure compliance. |
| ServicePrincipalId |The GUID value of your provisioning app's service principal ID that you can retrieve from the **Provisioning App** > **Properties** > **Object ID**| Mandatory: Only when you want to: </br>- Update the provisioning app schema, or</br>- Send the generated bulk request to the API endpoint. |
| UpdateSchema |Use this switch to instruct the script to read the CSV columns and add them as custom SCIM attributes in your provisioning app schema.|    
| ClientId |The Client ID of a Microsoft Entra registered app to use for OAuth authentication flow. This app must have valid certificate credentials. | Mandatory: Only when performing certificate-based authentication. |
| ClientCertificate |The Client Authentication Certificate to use during OAuth flow. | Mandatory: Only when performing certificate-based authentication.|
| GetPreviousCycleLogs |To get the provisioning logs of the latest sync cycles. |    
| NumberOfCycles | To specify how many sync cycles should be retrieved. This value is 1 by default.|
| RestartService | With this option, the script temporarily pauses the provisioning job before uploading the data, it uploads the data and then starts the job again to ensure immediate processing of the payload. | Use this option only during testing. |     

### AttributeMapping.psd file

This file is used to map columns in the CSV file to standard SCIM Core User and Enterprise User attribute schema elements. The file also generates an appropriate representation of the CSV file contents as a bulk request payload. 

In the next example, we mapped the following columns in the CSV file to their counterpart SCIM Core User and Enterprise User attributes.

:::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/csv-columns.png" alt-text="Screenshot of CSV columns for mapped attributes." lightbox="./media/inbound-provisioning-api-powershell/csv-columns.png":::

```powershell
    @{
    externalId   = 'WorkerID'
    name         = @{
        familyName = 'LastName'
        givenName  = 'FirstName'
    }
    active       = { $_.'WorkerStatus' -eq 'Active' }
    userName     = 'UserID'
    displayName  = 'FullName'
    nickName     = 'UserID'
    userType     = 'WorkerType'
    title        = 'JobTitle'
    addresses    = @(
        @{
            type          = { 'work' }
            streetAddress = 'StreetAddress'
            locality      = 'City'
            postalCode    = 'ZipCode'
            country       = 'CountryCode'
        }
    )
    phoneNumbers = @(
        @{
            type  = { 'work' }
            value = 'OfficePhone'
        }
    )
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" = @{
        employeeNumber = 'WorkerID'
        costCenter     = 'CostCenter'
        organization   = 'Company'
        division       = 'Division'
        department     = 'Department'
        manager        = @{
            value = 'ManagerID'
        }
    }
}
```

## Next steps
- [Troubleshoot issues with the inbound provisioning API](inbound-provisioning-api-issues.md)
- [API-driven inbound provisioning concepts](inbound-provisioning-api-concepts.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
