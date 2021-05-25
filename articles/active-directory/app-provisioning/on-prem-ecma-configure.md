---
title: 'Azure AD ECMA Connector Host configuration'
description: This article describes how to configure the Azure AD ECMA Connector Host.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/17/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Configure the Azure AD ECMA Connector Host and the provisioning agent.
This article provides guidance on how to configure the Azure AD ECMA Connector Host and the provisioning agent  once you have successfully installed them.


## Configure the Azure AD ECMA Connector Host
Configuring the Azure AD ECMA Connector Host occurs in 2 parts.
    
   - [Configure the settings](#configure-the-settings) - configure the port and certificate for the Azure AD ECMA Connector Host to use.  This is only done the first time the ECMA Connector Host is started.
   - Create a connector - create a connector (for example, SQL or LDAP) to allow the Azure AD ECMA Connector Host to export or import data to a data source.

### Configure the Settings
When you first start the Azure AD ECMA Connector Host you will see a port number which will already be filled out using the default 8585.  

 ![Configure your settings](.\media\on-prem-ecma-configure\configure-1.png)

You will also be asked to select a certificate for the Azure AD ECMA Connector Host to use, or generate a new self-signed certificate.

 >[!NOTE]
 >If you are providing your own certificate, it must be located in the personal store of the local computer account.  This is so that it can be presented when you click Select.


### Create a connector
Now you must create a connector for the Azure AD ECMA Connector Host to use.  This connector will allow the ECMA Connector Host to export (and import if desired) data to the data source for the connector you create.  

The configuration steps for each of the indiviudal connectors are longer and are provided in their own documents.

Use one of the links below to create and configure a connector.

- [Generic SQL connector](on-prem-sql-connector-configure.md) - a connector that will work with SQL databases such as Microsoft SQL or MySQL.
- Generic LDAP connector - a connector that will work with LDAP directories such as OpenLDAP and Active Directory Lightweight Directory Services.


## Establish connectivity between Azure AD and the Azure AD ECMA Connector Host
The following sections will guide you through establishing connectivity with the on-premises Azure AD ECMA Connector Host and Azure AD.

#### Ensure ECMA2Host service is running
1.  On the server the running the Azure AD ECMA Connector Host, click Start.
2. Type run and enter services.msc in the box
3. In the services, ensure that **Microsoft ECMA2Host** is present and running.  If not, click **Start**.

#### Add Enterprise application
1.  Sign-in to the Azure portal as an application administrator
2. In the portal, navigate to Azure Active Directory, Enterpirse Applications.
3. Click on New Application.
4. Locate your application and click **Create**.

### Configure the applicaion and test
 1. Once it has been created, click he **Provisioning page**.
 2. Click **get started**.
 3. On the **Provisioning page**, change the mode to **Automatic**
 4. In the on-premises connectivity section, select the agent that you just deployed and click assign agent(s).
   >[!NOTE]
   >After adding the agent, you need to wait 10 minutes for the registration to complete.  The connectivity test will not work until the registration completes.
   >
   >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Navigating to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right click on the service and restart.
 5.  After 10 minutes, under the **Admin credentials** section, enter the following URL, replacing "connectorName" portion with the name of the connector on the ECMA Host.
 
   https://localhost:8585/ecma2host_connectorName/scim

   For example, if the connector you created was named GenericSQL, the url would be:
 
   https://localhost:8585/ecma2host_GenericSQL/scim

 6. Enter the secret token value that you defined when creating the connector.
 7. Click Test Connection and wait one minute.
 8. Once connection test is successful, click save.

## Configure who is in scope for provisioning
Now that you have the Azure AD ECMA Connector Host talking with Azure AD you can move on to configuring who is in scope for provisioning.  The sections below will provide information on how scope your users.

### Assign users to your application
Azure AD allows you to scope who should be provisioned based on assignment to an application and / or by filtering on a particular attribute. Determine who should be in scope for provisioning and define your scoping rules as necessary.  For more information, see [Manage user assignment for an app in Azure Active Directory](../../active-directory/manage-apps/assign-user-or-group-access-portal.md).

### Configure your attribute mappings
You will need to map the user attributes in Azure AD to the attributes in the target application. The Azure AD Provisioning service relies on the SCIM standard for provisioning and as a result, the attributes surfaced have the SCIM name space. The example below shows how you can map the mail and objectId attributes in Azure AD to the Email and InternalGUID attributes in an application. 

Note, the default mapping contains userPrincipalName to an attribute name PLACEHOLDER. You will need to change the PLACEHOLDER attribute to one that is found in your application. For more information, see [Matching users in the source and target systems](customize-application-attributes.md#matching-users-in-the-source-and-target--systems).

|Attribute name in Azure AD|Attribute name in SCIM|Attribute name in target application|
|-----|-----|-----|
|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|Email|
|objectId|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:InternalGUID|InternalGUID|

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, click he **Provisioning page**.
 2. Click **get started**.
 3. Expand **Mappings** and click **Provision Azure Active Directory Users**
 4. Click **Add new mapping**
 5. Specify the source and target attributes
 6. Click **Save**

For more information on mapping user attributes from applications to Azure AD, see [Tutorial - Customize user provisioning attribute-mappings for SaaS applications in Azure Active Directory](customize-application-attributes.md).

### Test your configuration by provisioning users on demand
To test your configuration, you can use on-demand provisiong of user.  For information on provisiong users on-demand see [On-demand provisioning](provision-on-demand.md)

1. Navigate to the single sign-on blade and then back to the provisioning blade. From the new provisioning overview blade, click on on-demand.
2. Test provisioning a few users on-demand as described here.
3. Once on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and group, turn provisioning On, and click Save.
4.  Wait several minutes for provisioning to start (it may take up to 40 minutes). You can learn more about the provisioning service performance here. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to Off, and click Save. This will stop the provisioning service from running in the future.

### Validating user provisioning from Azure AD has been successful
Azure AD provisioning service will send a GET request with a test user to validate the tenant URL secret token and the format of the response.

Then, once the Azure AD provisioning service has been enabled, the Azure AD provisioning service will send SCIM GET, POST and PATCH operations to the connector host. When the connector host receives one of these, it will begin an export connection, and export one or more changes to the connector. Based on the export result code, the connector host will return success or an error indication to the Azure AD provisioning service.

For example, if a user is assigned to an application, then the Azure AD provisioning service will check if the user already exists, by querying the connector host. If the user already exists, then Azure AD will either continue with the next user, or update that user with a PATCH with the latest attributes, if needed. However, if the user is not already present, then the Azure AD provisioning service will then send a POST request to create the user. A POST request will be transformed by the connector host into a PutExportEntries call with an ObjectModificationType of Add, and the attributes named in the configuration of the connector.

If you are unsure if the Azure AD provisioning service has attempted to contact the connector host, start by checking the Azure AD provisioning logs.. Next, check for any log messages on the ECMA Connector Host at the time of an update – if there are any errors or warnings they will indicate the connector host was unable to transform a request into an ECMA call, or the connector returned an exception, as described for the next section.

### Add additional users to your application
Assign additional users and groups to your [application](../manage-apps/assign-user-or-group-access-portal.md).

### Turn provisioning on
Click start to enable provisioning. The service will then synchronize all users and groups in scope.

## Monitor your deployment

1. Use the provisioning logs to determine which users have been provisioned successfully or unsuccessfully.
2. Build custom alerts, dashboards, and queries using the Azure Monitor integration.
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states here.

## Next Steps

- App provisioning](user-provisioning.md)
- On-premises app provisioning architecture(on-prem-app-prov-arch.md)