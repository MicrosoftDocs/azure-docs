---
title: 'ECMA Connector Host configuration for Azure AD'
description: This article describes how to configure the ECMA connect host.
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

# Configure the provisioning agent and ECMA connector host
This article provides guidance on how to configure the provisioning agent and the ECMA connector host once you have successfully installed them.


## Configure the provisioning agent
Use the following steps to configure the provisioning agent.

 1. Launch the provisioning agent wizard from your desktop.
 2. When prompted to select an extension, select the "on-prem provisioning" option.
  ![on-prem option](.\media\on-prem-ecma-configure\configure-1.png)
 3. Click authorize and provide Azure AD credentials. The credentials provided should be for a user that is a global administrator or hybrid administrator.
 4. Click confirm.

## Configure the ECMA host
Use the following steps to configure the ECMA Host.
 
 1. Navigate to the start menu and identify the Microsoft ECMA Host application. Open this as an administrator. 
  ![ECMA configuration](.\media\on-prem-ecma-configure\configure-2.png)
 2. Generate the certificate for connectivity to the provisioning agent. 
  ![Generate certificate](.\media\on-prem-ecma-configure\configure-3.png)
 3. A new window will appear with a list of connectors. The first time this is run, no connector configurations will be present. Click New Connector.
  ![New Connector](.\media\on-prem-ecma-configure\configure-4.png)
 4. Walk through the pages of the ECMA host to configure your connector. For more details, see the tutorials linked below:
   - SQL ECMA tutorial
   - Generic SQL MIM tutorial
   - Generic LDAP MIM tutorial

## Configure provisioning in Azure AD


### Establish connectivity between Azure AD and the ECMA Host

  1. Check to ensure that the connector host Windows Service is running. Click on the start menu, and type services. In the services list, scroll to Microsoft ECMA2Host. Ensure that the status is Running. If the status is blank, click Start.
2.  Sign into Azure Portal as an application administrator in the tenant used to register the provisioning agent. The tenant should have Azure AD Premium P1 or Premium P2 (EMS E3 or E5). This is required to be able to provision to an on-prem application.
3. In the Azure Portal, navigate to Azure Active Directory area, navigate to Enterprise Applications, and click on New Application.
4. Search for Provisioning Private Preview Test Application and add it to your tenant.
5. Once the app has been created, click on the Provisioning page.
6. Click get started.
7. Change the Provisioning Mode to Automatic. Additional settings will appear on that screen.
8. In the on-premises connectivity section, select the agent that you just deployed and click assign agent(s).
9. Before performing the next step, wait 10 minutes for the agent registration to complete. Test connection will not succeed until the agent registration is completed. Alternatively, you can force the agent registration to complete by restarting the provisioning agent on your server. Navigating to your server > search for services in the windows search bar > identify the Azure AD Connect Provisioning Agent Service > right click on the service and restart.
10. In the tenant URL field, enter the following URL, replacing "connectorName" with the name of the connector on the ECMA Host.
 https://localhost:8585/ecma2host_connectorName/scim
11. Enter the secret token value that you defined in the ECMA Host in the field Secret Token.
12. Click Test Connection and wait one minute. If you reveive an error message, please review the troubleshooting steps.
13. Once connection test is successful, click save.

### Configure who is in scope for provisioning
Azure AD allows you to scope who should be provisioned based on assignment to an application and / or by filtering on a particular attribute. Determine who should be in scope for provisioning and define your scoping rules as necessary. Most customers will stick with the default scope of "assigned users and groups," without doing any additional scoping configuration.

### Assign users to your application
If you chose scoping based on assignment in the previous step (recommended), please assign users and / or groups to your application.

### Configure your attribute mappings
You will need to map the user attributes in Azure AD to the attributes in the target application. The Azure AD Provisioning service relies on the SCIM standard for provisioning and as a result, the attributes surfaced have the SCIM name space. The example below shows how you can map the country and objectId attributes in Azure AD to the Country and InternalGUID attributes in an application. Note, the default mapping contains userPrincipalName to an attribute name PLACEHOLDER. You will need to change the PLACEHOLDER attribute to one that is found in your application. Learn more about configuring attribute mappings.

|Attribute name in Azure AD|Attribute name in SCIM|Attribute name in target application|
|-----|-----|-----|
|country|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:Country|Country|
|objectId|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:InternalGUID|InternalGUID|

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