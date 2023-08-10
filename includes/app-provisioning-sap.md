The following video provides an overview of on-premises provisioning.

> [!VIDEO https://www.youtube.com/embed/QdfdpaFolys]

## Capabilities supported

> [!div class="checklist"]
> - Create users in SAP ECC 7.0
> - Remove users in SAP ECC 7.0 when they don't need access anymore.
> - Keep user attributes synchronized between Azure AD and SAP ECC 7.0.
> - Discover the schema for SAP ECC 7.0.

## Out of scope
* Other object types including local activity groups, roles, and profiles are not supported. Please use the Microsoft Identity Manager if these objects are required. 
* Password operations are not supported. Please use the Microsoft Identity Manager if password management is required.

## Prerequisites for provisioning to SAP ECC 7.0

### On-premises prerequisites

The computer that runs the provisioning agent should have:

- Connectivity to SAP ECC 7.0 with outbound connectivity to login.microsoftonline.com, [other Microsoft Online Services](/microsoft-365/enterprise/urls-and-ip-address-ranges) and [Azure](../articles/azure-portal/azure-portal-safelist-urls.md) domains. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy. 
- At least 3 GB of RAM, to host a provisioning agent. 
- .NET Framework 4.7.2 
- A Windows Server 2016 or a later version. 

Prior to configuring provisioning, ensure that you:
- Expose the necessary APIs in SAP ECC 7.0 to create, update, and delete users. The [guide](https://www.microsoft.com/download/details.aspx?id=51495) `Deploying SAP NetWeaver AS ABAP 7.pdf` walks through how you can expose the necessary APIs.
- Create a web services connector template for the ECMA host. You can use the [guide](https://www.microsoft.com/download/details.aspx?id=51495) `Authoring SAP ECC 7 Template for ECMA2Host.pdf` as a reference to build your template. The download center provides a template `sapecc.wsconfig` as a reference. Before deploying in production, you will need to customize the template to meet the needs of your specific environment. Make sure that the ServiceName, EndpointName, and the OperationName are correct. 

Configuration of the connection to SAP ECC 7.0 is done using a wizard. Depending on the options you select, some of the wizard screens might not be available and the information might be slightly different. Use the following information to guide you in your configuration.

### Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
 
    [!INCLUDE [active-directory-p1-license.md](active-directory-p1-license.md)]
 - The Hybrid Identity Administrator role for configuring the provisioning agent and the Application Administrator or Cloud Application Administrator roles for configuring provisioning in the Azure portal.
 - The Azure AD users to be provisioned to SAP ECC 7.0 must already be populated with any attributes that will be required by SAP ECC 7.0. 

## 1. Install and configure the Azure AD Connect Provisioning Agent

If you have already downloaded the provisioning agent and configured it for another on-premises application, then continue reading in the next section.

 1. Sign in to the Azure portal.
 2. Go to **Enterprise applications** and select **New application**.
 3. Search for the **On-premises ECMA app** application, give the app a name, and select **Create** to add it to your tenant.
 4. From the menu, navigate to the **Provisioning** page of your application.
 5. Select **Get started**.
 6. On the **Provisioning** page, change the mode to **Automatic**.
 
 :::image type="content" source="media/app-provisioning-sql/configure-7.png" alt-text="Screenshot of selecting Automatic." lightbox="media/app-provisioning-sql/configure-7.png":::

 7. Under **On-premises Connectivity**, select **Download and install**, and select **Accept terms & download**.
 
 8. Leave the portal and open the provisioning agent installer, agree to the terms of service, and select **next**.
 9. Open the provisioning agent wizard.
 10. In the **Select Extension** step, select **On-premises application provisioning** and then select **Next**.

 :::image type="content" source="./media/app-provisioning-sql/sync-agent-select-on-premises.png" alt-text="Screenshot that shows how to select on premises provisioning." lightbox="./media/app-provisioning-sql/sync-agent-select-on-premises.png":::
    
 11. The provisioning agent will use the operating system's web browser to display a popup window for you to authenticate to Azure AD, and potentially also your organization's identity provider.  If you are using Internet Explorer as the browser on Windows Server, then you may need to add Microsoft web sites to your browser's trusted site list to allow JavaScript to run correctly.
 12. Provide credentials for an Azure AD administrator when you're prompted to authorize. The user is required to have the Hybrid Identity Administrator or Global Administrator role.
 13. Select **Confirm** to confirm the setting. Once installation is successful, you can select **Exit**, and also close the Provisioning Agent Package installer.
 
## 4. Configure the On-premises ECMA app

 1. In the portal, on the **On-Premises Connectivity** section, select the agent that you deployed and select **Assign Agent(s)**.

      ![Screenshot that shows how to select and assign an agent.](.\\media\app-provisioning-sql\configure-7a.png)

 2. Keep this browser window open, as you complete the next step of configuration using the configuration wizard.

  
 ## 5. Configure the Azure AD ECMA Connector Host certificate

 1. On the Windows Server where the provisioning agent is installed, right click the **Microsoft ECMA2Host Configuration Wizard** from the start menu, and run as administrator.  Running as a Windows administrator is necessary for the wizard to create the necessary Windows event logs.
 
 1. After the ECMA Connector Host Configuration starts, if it's the first time you have run the wizard, it will ask you to create a certificate. Leave the default port **8585** and select **Generate certificate** to generate a certificate. The autogenerated certificate will be self-signed as part of the trusted root. The certificate SAN matches the host name.

     [![Screenshot that shows configuring your settings.](.\\media\app-provisioning-sql\configure-1.png)](.\\media\app-provisioning-sql\configure-1.png#lightbox)

 3. Select **Save**.

## 5. Configure the generic web services connector

In this section, you will create the connector configuration for SAP ECC 7.0.

### 5.1 Connect the provisioning agent to SAP ECC 7.0

To connect the Azure AD provisioning agent with SAP ECC 7.0, follow these steps:

1. Copy your web service connector [template](https://www.microsoft.com/download/details.aspx?id=51495) sapecc.wsconfig into `C:\Program Files\Microsoft ECMA2Host\Service\ECMA` folder. 
1. Generate a secret token that will be used for authenticating Azure AD to the connector. It should be 12 characters minimum and unique for each application.
1. If you haven't already done so, launch the **Microsoft ECMA2Host Configuration Wizard** from the Windows Start menu.

1. Select **New Connector**.

     [![Screenshot that shows choosing New Connector.](.\\media\app-provisioning-sql\sql-3.png)](.\\media\app-provisioning-sql\sql-3.png#lightbox)


1. On the **Properties** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.

     [![Screenshot that shows entering properties.](.\media\app-provisioning-SAP\sap-properties-1.png)](.\media\app-provisioning-SAP\sap-properties-1.png#lightbox)

     |Property|Value|
     |-----|-----|
     |Name|The name you chose for the connector, which should be unique across all connectors in your environment. For example, if you only have one SAP instance, SAPECC7. |
     |Autosync timer (minutes)|120|
     |Secret Token|Enter the secret token you generated for this connector. The key should be 12 characters minimum.|
     |Extension DLL|For the web services connector, select **Microsoft.IdentityManagement.MA.WebServices.dll**.|

1. On the **Connectivity** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.

     [![Screenshot that shows the Connectivity page.](.\media\app-provisioning-SAP\sap-connectivity-1.png)](.\media\app-provisioning-SAP\sap-connectivity-1.png#lightbox)
     
     |Property|Description|
     |-----|-----|
     |Web Service Project |Your SAP ECC template name, sapecc.|
     |Host|SAP ECC SOAP endpoint host name, e.g. vhcalnplci.dummy.nodomain|
     |Port|SAP ECC SOAP endpoint port, e.g. 8000|


1. On the **Capabilities** page, fill in the boxes with the values specified in the table below and select **Next**.

    | Property | Value |
    | --- | --- |
    | Distinguished Name Style | Generic |
    | Export Type | ObjectReplace |
    | Data Normalization | None |
    | Object Confirmation | Normal |
    | Enable Import | Checked |
    | Enabled Delta Import | Unchecked |
    | Enable Export | Checked |
    | Enable Full Export | Unchecked |
    | Enable Export Password in the First Pass | Checked |
    | No Reference Values in First Export Pass | Unchecked |
    | Enable Object Rename | Unchecked |
    | Delete-Add as Replace | Unchecked |

>[!NOTE]
>If your web services connector template sapecc.wsconfig is opened for editing in the Web Service Configuration Tool, you will get an error.

8. On the **Global** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.

    | Property | Value |
    | --- | --- |
    | ClientCredentialType | Basic |
    | User name | The username of an account with rights to make call BAPIs used in SAP ECC template. |
    | Password | The password of the username provided. |
    | Test Connection | Unchecked, if you have no Test Connection workflow implemented in your template |

1. On the **Partitions** page, select **Next**.

1. On the **Run Profiles** page, keep the **Export** checkbox selected. Select the **Full import** checkbox and select **Next**. The **Export** run profile will be used when the ECMA Connector host needs to send changes from Azure AD to SAP ECC 7, to insert, update and delete records.  The **Full Import** run profile will be used when the ECMA Connector host service starts, to read in the current content of SAP ECC 7.  

    
    | Property | Value |
    | --- | --- |
    | Export | Run profile that will export data to SAP ECC instance. This run profile is required. |
    | Full import | Run profile that will import all data from SAP ECC instance specified earlier. |
    | Delta import | Run profile that will import only changes from SAP ECC instance since the last full or delta import. |

1. On the **Object Types** page, fill in the boxes and select **Next**. Use the table that follows the image for guidance on the individual boxes.   

    - **Anchor** : The values of this attribute should be unique for each object in the target system. The Azure AD provisioning service will query the ECMA connector host by using this attribute after the initial cycle. This value is defined in the web services connector template.
    - **DN** : The Autogenerated option should be selected in most cases. If it isn't selected, ensure that the DN attribute is mapped to an attribute in Azure AD that stores the DN in this format: CN = anchorValue, Object = objectType. For more information on anchors and the DN, see [About anchor attributes and distinguished names](/azure/active-directory/app-provisioning/on-premises-application-provisioning-architecture#about-anchor-attributes-and-distinguished-names).

     
        | Property | Value |
        | --- | --- |
        | Target object | User |
        | Anchor | userName |
        | DN | userName |
        | Autogenerated | Checked |
   

 1. The ECMA connector host discovers the attributes supported by SAP ECC 7.0. You can then choose which of the discovered attributes you want to expose to Azure AD. These attributes can then be configured in the Azure portal for provisioning. On the **Select Attributes** page, add all the attributes in the dropdown list one at a time. The **Attribute** dropdown list shows any attribute that was discovered in SAP ECC 7.0 and *wasn't* chosen on the previous **Select Attributes** page. Once all the relevant attributes have been added, select **Next**.
 
 
     [![Screenshot that shows the Select Attributes page.](.\media\app-provisioning-SAP\sap-select-attributes-1.png)](.\media\app-provisioning-SAP\sap-select-attributes-1.png#lightbox)

 13. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. The attributes selected on the previous page won't be available to select on the Deprovisioning page. Select **Finish**.
 >[!NOTE]
 >If you use the **Set attribute value** be aware that only boolean values are allowed.

 On the **Deprovisioning** page, under Disable flow, select None. You will control user account status with **expirationTime** property. Under Delete flow, select None if you do not want to delete SAP users or Delete if you do. Select **Finish**.
     

## 6. Ensure the ECMA2Host service is running

 1. On the server running the Azure AD ECMA Connector Host, select **Start**.
 2. Enter **run** and enter **services.msc** in the box.
 3. In the **Services** list, ensure that **Microsoft ECMA2Host** is present and running. If not, select **Start**.

     [![Screenshot that shows the service is running.](.\\media\app-provisioning-sql\configure-2.png)](.\\media\app-provisioning-sql\configure-2.png#lightbox)



 1. If you have recently started the service, and have many user objects in the SAP ECC 7.0, then wait several minutes for the connector to establish a connection with SAP ECC 7.0.

## 7. Configure the application connection in the Azure portal

1. Return to the web browser window where you were configuring the application provisioning.

    >[!NOTE]
    >If the window had timed out, then you will need to re-select the agent.

     1. Sign in to the Azure portal.
     1. Go to **Enterprise applications** and the **On-premises ECMA app** application.
     1. Select **Provisioning**.
     1. Select **Get started** and then change the mode to **Automatic**,  on the **On-Premises Connectivity** section, select the agent that you deployed and select **Assign Agent(s)**. Otherwise go to **Edit Provisioning**.

 1. Under the **Admin credentials** section, enter the following URL. Replace the `{connectorName}` portion with the name of the connector on the ECMA connector host, such as **SAPECC7**. The connector name is case sensitive and should be the same case as was configured in the wizard. You can also replace `localhost` with your machine hostname.

    |Property|Value|
    |-----|-----|
    |Tenant URL| `https://localhost:8585/ecma2host_SAPECC7/scim`|

 5. Enter the **Secret Token** value that you defined when you created the connector.
     >[!NOTE]
     >If you just assigned the agent to the application, please wait 10 minutes for the registration to complete. The connectivity test won't work until the registration completes. Forcing the agent registration to complete by restarting the provisioning agent on your server can speed up the registration process. Go to your server, search for **services** in the Windows search bar, identify the **Azure AD Connect Provisioning Agent Service**, right-click the service, and restart.
 1. Select **Test Connection**, and wait one minute.

 1. After the connection test is successful and indicates that the supplied credentials are authorized to enable provisioning, select **Save**.

     ![Screenshot that shows testing an agent.](.\\media\app-provisioning-sql\configure-9.png)

## 8. Configure attribute mappings

Now you will map attributes between the representation of the user in Azure AD and the representation of the user in SAP ECC 7.0.

You'll use the Azure portal to configure the mapping between the Azure AD user's attributes and the attributes that you previously selected in the ECMA Host configuration wizard.

 1. Ensure that the Azure AD schema includes the attributes that are required by SAP ECC 7.0. If it requires users to have an attribute, and that attribute is not already part of your Azure AD schema for a user, then you will need to use the [directory extension feature](../articles/active-directory/app-provisioning/user-provisioning-sync-attributes-for-mapping.md) to add that attribute as an extension.
 1. In the Azure AD portal, under **Enterprise applications**, select the **On-premises ECMA app** application, and then the **Provisioning** page.
 1. Select **Edit provisioning**, and wait 10 seconds.
 1. Expand **Mappings** and select **Provision Azure Active Directory Users**. If this is the first time you've configured the attribute mappings for this application, there will be only one mapping present, for a placeholder.


     ![Screenshot that shows provisioning a user.](.\\media\app-provisioning-sql\configure-10.png)

 5. To confirm that the schema of SAP ECC 7.0 is available in Azure AD, select the **Show advanced options** checkbox and select **Edit attribute list for ScimOnPremises**. Ensure that all the attributes selected in the configuration wizard are listed.  If not, then wait several minutes for the schema to refresh, and then reload the page.  Once you see the attributes listed, then cancel from this page to return to the mappings list.
 6. Now, click on the **userPrincipalName** PLACEHOLDER mapping.  This mapping is added by default when you first configure on-premises provisioning.  
 
:::image type="content" source="./media/app-provisioning-sql/configure-11.png" alt-text="Screenshot of placeholder." lightbox="./media/app-provisioning-sql/configure-11.png":::

 Change the value to match the following:
 
 |Mapping type|Source attribute|Target attribute|
 |-----|-----|-----|
 |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:userName|
 

 7. Now select **Add New Mapping**, and repeat the next step for each mapping.
 

 8. Specify the source and target attributes for each of the mappings in the following table.

     
    | Azure Active Directory Attribute | ScimOnPremises Attribute | Matching precedence | Apply this mapping |
    | --- | --- | --- | --- |
    | ToUpper(Word([userPrincipalName], 1, "@"), ) | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:userName | 1 | Only during object creation |
    | Redact("Pass@w0rd1") | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:export\_password |
    | Only during object creation |
    | city | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:city |
    | Always |
    | companyName | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:company |
    | Always |
    | department | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:department |
    | Always |
    | mail | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:email |
    | Always |
    | Switch([IsSoftDeleted], , "False", "9999-12-31", "True", "1990-01-01") | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:expirationTime |
    | Always |
    | givenName | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:firstName |
    | Always |
    | surname | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:lastName |
    | Always |
    | telephoneNumber | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:telephoneNumber |
    | Always |
    | jobTitle | urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:jobTitle |
    | Always |

 
 9. Once all of the mappings have been added, select **Save**.

## 9. Assign users to the application

Now that you have the Azure AD ECMA Connector Host talking with Azure AD, and the attribute mapping configured, you can move on to configuring who's in scope for provisioning.

>[!IMPORTANT]
>If you were signed in using a Hybrid Identity Administrator role, you need to sign-out and sign-in with an account that has the Application Administrator, Cloud Application Administrator or Global Administrator role, for this section.  The Hybrid Identity Administrator role does not have permissions to assign users to applications.


If there are existing users in the SAP ECC 7.0, then you should create application role assignments for those existing users. To learn more about how to create application role assignments in bulk, see [governing an application's existing users in Azure AD](../articles/active-directory/governance/identity-governance-applications-existing-users.md).

Otherwise, if there are no current users of the application, then select a test user from Azure AD who will be provisioned to the application.

 1. Ensure that the user you will select has all the properties that will be mapped to the required attributes of SAP ECC 7.0.
 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises ECMA app** application.
 3. On the left, under **Manage**, select **Users and groups**.
 4. Select **Add user/group**.

     [![Screenshot that shows adding a user.](.\\media\app-provisioning-sql\app-2.png)](.\\media\app-provisioning-sql\app-2.png#lightbox)

5. Under **Users**, select **None Selected**.

     [![Screenshot that shows None Selected.](.\\media\app-provisioning-sql\app-3.png)](.\\media\app-provisioning-sql\app-3.png#lightbox)

 6. Select users from the right and select the **Select** button.
 
     ![Screenshot that shows Select users.](.\\media\app-provisioning-sql\app-4.png)

 7. Now select **Assign**.

     [![Screenshot that shows Assign users.](.\\media\app-provisioning-sql\app-5.png)](.\\media\app-provisioning-sql\app-5.png#lightbox)
     
## 10. Test provisioning

Now that your attributes are mapped and users are assigned, you can test on-demand provisioning with one of your users.
 
 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises ECMA app** application.
 3. On the left, select **Provisioning**.
 4. Select **Provision on demand**.
 5. Search for one of your test users, and select **Provision**.

     ![Screenshot that shows testing provisioning.](.\\media\app-provisioning-sql\configure-13.png)

 6. After several seconds, then the message **Successfully created user in target system** will appear, with a list of the user attributes.

## 11. Start provisioning users

1. After on-demand provisioning is successful, return to the provisioning configuration page. Ensure that the scope is set to only assigned users and groups, turn provisioning **On**, and select **Save**.
 
    [![Screenshot that shows Start provisioning.](.\\media\app-provisioning-sql\configure-14.png)](.\\media\app-provisioning-sql\configure-14.png#lightbox)

2. Wait up to 40 minutes for the provisioning service to start. After the provisioning job has been completed, as described in the next section, if you're done testing, you can change the provisioning status to **Off**, and select **Save**. This action stops the provisioning service from running in the future.

## Troubleshooting provisioning errors

If an error is shown, then select **View provisioning logs**.  Look in the log for a row in which the Status is **Failure**, and select on that row.

For more information, change to the **Troubleshooting & Recommendations** tab.  
