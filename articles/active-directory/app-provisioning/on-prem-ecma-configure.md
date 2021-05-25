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

For the preview, you will need to generate a new self-signed certificate.

 >[!NOTE]
 >This preview uses a time-sensitive cerfiticate. The auto-generated certificate will be self-signed, part of the trusted root and the SAN matches the hostname.


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
 ![Service is running](.\media\on-prem-ecma-configure\configure-2.png)

#### Add Enterprise application
1.  Sign-in to the Azure portal as an application administrator
2. In the portal, navigate to Azure Active Directory, **Enterpirse Applications**.
3. Click on **New Application**.
 ![Add new application](.\media\on-prem-ecma-configure\configure-4.png)
4. Locate your application and click **Create**.

### Configure the applicaion and test
 1. Once it has been created, click he **Provisioning page**.
 2. Click **get started**.
 ![get started](.\media\on-prem-ecma-configure\configure-6.png)
 3. On the **Provisioning page**, change the mode to **Automatic**
   ![Change mode](.\media\on-prem-ecma-configure\configure-7.png)
 4. In the on-premises connectivity section, select the agent that you just deployed and click assign agent(s).
   >[!NOTE]
   >After adding the agent, you need to wait 10 minutes for the registration to complete.  The connectivity test will not work until the registration completes.
   >
   >Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Navigating to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right click on the service and restart.
   
   ![Assign an agent](.\media\on-prem-ecma-configure\configure-8.png)
 7.  After 10 minutes, under the **Admin credentials** section, enter the following URL, replacing "connectorName" portion with the name of the connector on the ECMA Host.
 
   https://localhost:8585/ecma2host_connectorName/scim

   For example, if the connector you created was named SQL, the url would be:
 
   https://localhost:8585/ecma2host_SQL/scim
  
  
 6. Enter the secret token value that you defined when creating the connector.
 7. Click Test Connection and wait one minute.
  ![Test the connection](.\media\on-prem-ecma-configure\configure-5.png)
 9. Once connection test is successful, click **save**.
 ![Successful test](.\media\on-prem-ecma-configure\configure-9.png)

## Configure who is in scope for provisioning
Now that you have the Azure AD ECMA Connector Host talking with Azure AD you can move on to configuring who is in scope for provisioning.  The sections below will provide information on how scope your users.

### Assign users to your application
Azure AD allows you to scope who should be provisioned based on assignment to an application and / or by filtering on a particular attribute. Determine who should be in scope for provisioning and define your scoping rules as necessary.  For more information, see [Manage user assignment for an app in Azure Active Directory](../../active-directory/manage-apps/assign-user-or-group-access-portal.md).

### Configure your attribute mappings
You will need to map the user attributes in Azure AD to the attributes in the target application. The Azure AD Provisioning service relies on the SCIM standard for provisioning and as a result, the attributes surfaced have the SCIM name space. The example below shows how you can map the mail and objectId attributes in Azure AD to the Email and InternalGUID attributes in an application. 

>[!NOTE]
>The default mapping contains userPrincipalName to an attribute name PLACEHOLDER. You will need to change the PLACEHOLDER attribute to one that is found in your application. For more information, see [Matching users in the source and target systems](customize-application-attributes.md#matching-users-in-the-source-and-target--systems).

|Attribute name in Azure AD|Attribute name in SCIM|Attribute name in target application|
|-----|-----|-----|
|mail|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Email|Email|
|objectId|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:InternalGUID|InternalGUID|

#### Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, click he **Provisioning page**.
 2. Click **get started**.
 3. Expand **Mappings** and click **Provision Azure Active Directory Users**
   ![provision a user](.\media\on-prem-ecma-configure\configure-10.png)
 5. Click **Add new mapping**
   ![Add a mapping](.\media\on-prem-ecma-configure\configure-11.png)
 7. Specify the source and target attributes
   ![Edit attributes](.\media\on-prem-ecma-configure\configure-12.png)
 9. Click **Save**

For more information on mapping user attributes from applications to Azure AD, see [Tutorial - Customize user provisioning attribute-mappings for SaaS applications in Azure Active Directory](customize-application-attributes.md).

### Test your configuration by provisioning users on demand
To test your configuration, you can use on-demand provisiong of user.  For information on provisiong users on-demand see [On-demand provisioning](provision-on-demand.md).

 1. Navigate to the single sign-on blade and then back to the provisioning blade. From the new provisioning overview blade, click on on-demand.
 2. Test provisioning a few users on-demand as described [here](provision-on-demand.md).
   ![Test provisioning](.\media\on-prem-ecma-configure\configure-13.png)

### Start provisioning users
 1. Once on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and group, turn **provisioning On**, and click **Save**.
   ![Start provisioning](.\media\on-prem-ecma-configure\configure-14.png)
  2.  Wait several minutes for provisioning to start (it may take up to 40 minutes). You can learn more about the provisioning service performance here. After the provisioning job has been completed, as described in the next section, you can change the provisioning status to Off, and click Save. This will stop the provisioning service from running in the future.

### Verify users have been successfully provisioned
After waiting, check your data source to see if new users are being provisioned.
 ![Verify users are provisioned](.\media\on-prem-ecma-configure\configure-15.png)

## Monitor your deployment

1. Use the provisioning logs to determine which users have been provisioned successfully or unsuccessfully.
2. Build custom alerts, dashboards, and queries using the Azure Monitor integration.
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states here.

## Next Steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-prem-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host installation](on-prem-ecma-install.md)
- [Generic SQL Connector](on-prem-sql-connector-configure.md)