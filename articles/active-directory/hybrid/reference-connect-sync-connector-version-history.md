---
title: Connector Version Release History | Microsoft Docs
description: This topic lists all releases of the Connectors for Forefront Identity Manager (FIM) and Microsoft Identity Manager (MIM)
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid: 6a0c66ab-55df-4669-a0c7-1fe1a091a7f9
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/22/2018
ms.component: hybrid
ms.author: billmath

---
# Connector Version Release History
The Connectors for Forefront Identity Manager (FIM) and Microsoft Identity Manager (MIM) are updated frequently.

> [!NOTE]
> This topic is on FIM and MIM only. These Connectors are not supported for install on Azure AD Connect. Released Connectors are preinstalled on AADConnect when upgrading to specified Build.


This topic list all versions of the Connectors that have been released.

Related links:

* [Download Latest Connectors](http://go.microsoft.com/fwlink/?LinkId=717495)
* [Generic LDAP Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericldap) reference documentation
* [Generic SQL Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql) reference documentation
* [Web Services Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-ma-ws) reference documentation
* [PowerShell Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-powershell) reference documentation
* [Lotus Domino Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-domino) reference documentation


## 1.1.830.0

### Fixed issues:
* Resolved ConnectorsLog System.Diagnostics.EventLogInternal.InternalWriteEvent(Message: A device attached to the system is not functioning)
* In this release of connectors you will need to update binding redirect from 3.3.0.0-4.1.3.0 to 4.1.4.0 in miiserver.exe.config
* Generic Web Services:
    * Resolved Valid JSON response could not be saved in configuration tool
* Generic SQL:
    * Export always generates only update query for the operation of deleting. Added to generate a delete query
    * The SQL query which gets objects for the operation of Delta Import,  if ‘Delta Strategy’ is ‘Change Tracking’ was fixed. In this implementation known limitation:  Delta Import with ‘Change Tracking’ mode does not track changes in multi-valued attributes
    * Added possibility to generate a delete query for case, when it is necessary to delete the last value of multivalued attribute and this row does not contain any other data except value which it is necessary to delete.
    * System.ArgumentException handling when implemented OUTPUT parameters by SP 
    * Incorrect query to make the operation of export into field which has varbinary(max) type
    * Issue with parameterList variable was initialized twice (in the functions ExportAttributes and GetQueryForMultiValue)


## 1.1.649.0 (AADConnect 1.1.649.0)

### Fixed issues:

* Lotus Notes:
  * Filtering custom certifiers option
  * Import of the class ImportOperations fixed the definition of what operations can be run in the 'Views' mode and which in the 'Search' mode.
* Generic LDAP:
  * OpenLDAP Directory uses DN as anchor rather than entryUUI. New option to GLDAP connector which allows to modify anchor
* Generic SQL:
  * Fixed export into field which has varbinary(max) type.
  * When adding binary data from a data source to CSEntry object, The DataTypeConversion function failed on zero bytes. Fixed DataTypeConversion function of the CSEntryOperationBase class.




### Enhancements:

* Generic SQL:
  * The ability to configure the mode for execute stored procedure with named
    parameters or not named is added in a configuration window of the Generic
    SQL management agent in the page 'Global Parameters'. In the page
    'Global Parameters' there is check box with the label 'Use named parameters
    to execute a stored procedure' which is responsible for mode for execute
    stored procedure with named parameters or not.
    * Currently, the ability to execute stored procedure with named parameters
    works only for databases IBM DB2 and MSSQL. For databases Oracle and MySQL
    this approach doesn’t work: 
      * The SQL syntaxes of MySQL doesn’t support named parameters in stored
        procedures.
      * The ODBC driver for the Oracle doesn’t support named parameters for
        named parameters in stored procedures)

## 1.1.604.0 (AADConnect 1.1.614.0)


### Fixed issues:

* Generic Web Services:
  * Fixed an issue preventing a SOAP project from being created when there were two or more endpoints.
* Generic SQL:
  * In the operation of import the GSQL was not converting time correctly, when saved to connector space. The default date and time format for connector space of the GSQL was changed from 'yyyy-MM-dd hh:mm:ssZ' to 'yyyy-MM-dd HH:mm:ssZ'.

## 1.1.551.0 (AADConnect 1.1.553.0)

### Fixed issues:

* Generic Web Services:
  * The Wsconfig tool did not convert correctly the Json array from "sample request" for the REST service method. This caused problems with serialization this Json array for the REST request.
  * Web Service Connector Configuration Tool does not support usage of space symbols in JSON attribute names 
    * A Substitution pattern can be added manually to the WSConfigTool.exe.config file, e.g. ```<appSettings> <add key=”JSONSpaceNamePattern” value="__" /> </appSettings>```
> [!NOTE]
> JSONSpaceNamePattern key is required as for export you will recieve the following error: Message: Empty name is not legal. 

* Lotus Notes:
  * When the option **Allow custom certifiers for Organization/Organizational Units** is disabled then the connector fails during export (Update) After the export flow all attributes are exported to Domino but at the time of export a KeyNotFoundException is returned to Sync. 
    * This happens because the rename operation fails when it tries to change DN (UserName attribute) by changing one of the attributes below:  
      - LastName
      - FirstName
      - MiddleInitial
      - AltFullName
      - AltFullNameLanguage
      - ou
      - altcommonname

  * When **Allow custom certifiers for Organization/Organizational Units** option is enabled, but required certifiers are still empty, then KeyNotFoundException occurs.

### Enhancements:

* Generic SQL:
  * **Scenario: redesigned Implemented:** "*" feature
  * **Solution description:** Changed approach for [multi-valued reference attributes handling](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql).


### Fixed issues:

* Generic Web Services:
  * Can’t import Server configuration if WebService Connector is present
  * WebService Connector is not working with multiple  Web Services

* Generic SQL:
  * No object types are listed for single value referenced attribute
  * Delta import on Change Tracking strategy deletes object when value is removed from multi-value table
  * OverflowException in GSQL connector with DB2 on AS/400

Lotus:
  * Added option to enable\disable searching OUs before opening GlobalParameters page

## 1.1.443.0

Released: 2017 March

### Enhancements

* Generic SQL:</br>
  **Scenario Symptoms:**  It is a well-known limitation with the SQL Connector where we only allow a reference to one object type and require cross reference with members. </br>
  **Solution description:** In the processing step for references were "*" option is chosen, ALL combinations of object types will be returned back to the sync engine.

>[!Important]
- This will create many placeholders
- It is required to make sure the naming is unique cross object types.


* Generic LDAP:</br>
 **Scenario:**
When only few containers are selected in specific partition, then the search still will be done in whole partition. Specific will be filtered by Synchronization
Service, but not by MA which might cause performance degradation. </br>

 **Solution description:** Changed GLDAP connector's code to make it possible go through all containers and search objects in each of them, instead of searching in the whole partition.


* Lotus Domino:

  **Scenario:** Domino mail deletion support for a person removal during an export. </br>
  **Solution:** Configurable mail deletion support for a person removal during an export.

### Fixed issues:
* Generic Web Services:
 * When changing the service URL in Default SAP wsconfig projects through WebService Configuration Tool then the following error happens:
Could not find a part of the path

      ``'C:\Users\cstpopovaz\AppData\Local\Temp\2\e2c9d9b0-0d8a-4409-b059-dceeb900a2b3\b9bedcc0-88ac-454c-8c69-7d6ea1c41d17\cfg.config\cloneconfig.xml'. ``

* Generic LDAP:
 * GLDAP Connector does not see all attributes in AD LDS
 * Wizard breaks when no UPN attributes are detected from the LDAP directory schema
 * Delta Imports Failing with discovery errors not present during full import, when "objectclass" attribute is not selected
 * A "Configure Partitions and Hierarchies” configuration page, doesn’t show any objects which type is equal to the partition for Novel servers in the Generic  
LDAP MA. They showed only objects from RootDSE partition.


* Generic SQL:
 * Fix for Generic SQL watermark Delta Import multivalued attribute not imported bug
 * When exporting deleted\added values of multivalued attribute, they are not deleted\added in data source.  


* Lotus Notes:
 * A specific field "Full Name" is shown in the metaverse correctly however when exporting to Notes the value for the attribute is Null or Empty.
 * Fix for duplicate Certifier error
 * When the Object without any data is selected on the Lotus Domino Connector with other objects then we receive the Discovery error while performing Full-Import.
 * When Delta Import is being running on the Lotus Domino Connector, at the end of that run, the Microsoft.IdentityManagement.MA.LotusDomino.Service.exe service sometimes returns an Application Error.
 * Group membership overall works fine and is maintained, except when running the export to try to remove a user from membership it shows as successful with an update, but the user doesn’t actually get removed from membership in Lotus Notes.
 * An opportunity to choose mode of export as “Append Item at bottom” was added in configuration GUI of Lotus MA to append new items at bottom during the export for multi-valued attributes.
 * Connector will add the needed logic to delete the file from the Mail Folder and ID Vault.
 * Delete membership not working for cross NAB member.
 * Values should be successfully deleted from multi-valued attribute

## 1.1.117.0
Released: 2016 March

**New Connector**  
Initial release of the [Generic SQL Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql).

**New features:**

* Generic LDAP Connector:
  * Added support for delta import with Isode.
* Web Services Connector:
  * Updated the csEntryChangeResult activity and setImportErrorCode activity to allow object level errors to be returned back to the sync engine.
  * Updated the SAP6 and SAP6User templates to use the new object level error functionality.
* Lotus Domino Connector:
  * For export, you need one certifier per address book. You can now use the same password for all certifiers to make the management easier.

**Fixed issues:**

* Generic LDAP Connector:
  * For IBM Tivoli DS, some reference attributes were not detected correctly.
  * For Open LDAP during a delta import, whitespaces at the beginning and end of strings were truncated.
  * For Novell and NetIQ, an export that moved an object between OUs/containers and at the same time renamed the object failed.
* Web Services Connector:
  * If the web service had multiple end-points for same binding, then the Connector did not correctly discover these end-points.
* Lotus Domino Connector:
  * An export of the fullName attribute to a mail-in database did not work.
  * An export which both added and removed member from a group only exported the added members.
  * If a Notes Document is invalid (the attribute isValid set to false), then the Connector fails.

## Older releases
Before March 2016, the Connectors were released as support topics.

**Generic LDAP**

* [KB3078617](https://support.microsoft.com/kb/3078617) - 1.0.0597, 2015 September
* [KB3044896](https://support.microsoft.com/kb/3044896) - 1.0.0549, 2015 March
* [KB3031009](https://support.microsoft.com/kb/3031009) - 1.0.0534, 2015 January
* [KB3008177](https://support.microsoft.com/kb/3008177) - 1.0.0419, 2014 September
* [KB2936070](https://support.microsoft.com/kb/2936070) - 4.3.1082, 2014 March

**WebServices**

* [KB3008178](https://support.microsoft.com/kb/3008178) - 1.0.0419, 2014 September

**PowerShell**

* [KB3008179](https://support.microsoft.com/kb/3008179) - 1.0.0419, 2014 September

**Lotus Domino**

* [KB3096533](https://support.microsoft.com/kb/3096533) - 1.0.0597, 2015 September
* [KB3044895](https://support.microsoft.com/kb/3044895) - 1.0.0549, 2015 March
* [KB2977286](https://support.microsoft.com/kb/2977286) - 5.3.0712, 2014 August
* [KB2932635](https://support.microsoft.com/kb/2932635) - 5.3.1003, 2014 February  
* [KB2899874](https://support.microsoft.com/kb/2899874) - 5.3.0721, 2013 October
* [KB2875551](https://support.microsoft.com/kb/2875551) - 5.3.0534, 2013 August

## Troubleshooting 

> [!NOTE]
> When updating Microsoft Identity Manager or AADConnect with use of any of ECMA2 connectors. 

You must refresh the connector definition upon upgrade to match or you will receive the following error in the application event log start to report warning ID 6947: "Assembly version in AAD Connector configuration ("X.X.XXX.X") is earlier than the actual version ("X.X.XXX.X") of "C:\Program Files\Microsoft Azure AD Sync\Extensions\Microsoft.IAM.Connector.GenericLdap.dll".

To refresh the definition:
* Open the Properties for the Connector instance
* Click the Connection / Connect to tab
  * Enter the password for the Connector account
* Click each of the property tabs, in turn
  * If this Connector type has a Partitions tab, with a Refresh button, click the Refresh button while on that tab
* After all property tabs have been accessed, click the OK button to save the changes.


## Next steps
Learn more about the [Azure AD Connect sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
