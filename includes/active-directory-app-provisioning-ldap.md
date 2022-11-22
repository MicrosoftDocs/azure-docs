This document describes the steps you need to perform to automatically provision and deprovision users from Azure Active Directory (Azure AD) into an LDAP directory. The document illustrates how you can provision users into AD LDS as an example LDAP directory, but you can provision into any of the supported LDAP directories mentioned below. Provisioning users into Active Directory Domain Services through this solution is not supported.
 
For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../articles/active-directory/app-provisioning/user-provisioning.md) and [on-premises application provisioning architecture](../articles/active-directory/app-provisioning/on-premises-application-provisioning-architecture.md). The following video provides an overview of on-premises provisioning.


> [!VIDEO https://www.youtube.com/embed/QdfdpaFolys]

## Prerequisites for provisioning users into an LDAP directory

### On-premises prerequisites

 - A target directory, other than Active Directory Domain Services, in which users can be created, updated, and deleted. For example, Active Directory Lightweight Services (AD LDS).  This directory instance should not be a directory that is also used to provision users into Azure AD, because having both scenarios may create a loop with Azure AD Connect.
 - A computer with at least 3 GB of RAM, to host a provisioning agent. The computer should have Windows Server 2016 or a later version of Windows Server, with connectivity to the target directory, and with outbound connectivity to login.microsoftonline.com, [other Microsoft Online Services](/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide) and [Azure](../articles/azure-portal/azure-portal-safelist-urls.md?tabs=public-cloud) domains. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy.
 - The .NET Framework 4.7.2 needs to be installed.
 - Optional:  Although it is not required, it is recommended to download [Microsoft Edge for Windows Server](https://www.microsoft.com/en-us/edge?r=1) and use it in-place of Internet Explorer.

Depending on the options you select, some of the wizard screens might not be available and the information might be slightly different. For purposes of this configuration, the user object type is used. Use the following information to guide you in your configuration. 

#### Supported LDAP directory server

The Connector relies upon various techniques to detect and identify the LDAP server. The Connector uses the Root DSE, vendor name/version, and it inspects the schema to find unique objects and attributes known to exist in certain LDAP servers.

* OpenLDAP
* Microsoft Active Directory Lightweight Directory Services
* 389 Directory Server
* Apache Directory Server
* IBM Tivoli DS
* Isode Directory
* NetIQ eDirectory
* Novell eDirectory
* Open DJ
* Open DS
* Oracle (previously Sun ONE) Directory Server Enterprise Edition
* RadiantOne Virtual Directory Server (VDS)

For more information, see the [Generic LDAP Connector reference](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericldap).

### Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
 
    [!INCLUDE [active-directory-p1-license.md](active-directory-p1-license.md)]
 - The Hybrid Identity Administrator role for configuring the provisioning agent and the Application Administrator or Cloud Application Administrator roles for configuring provisioning in the Azure portal.

### More recommendations and limitations
The following bullet points are more recommendations and limitations.
- It is not recommended to use the same agent for cloud sync and on-premises app provisioning.  Microsoft recommends using a separate agent for cloud sync and one for on-premises app provisioning.
- For AD LDS currently, users cannot be provisioned with passwords.  So you will need to either disable the password policy for AD LDS or provision the users in disabled state.
- Provisioning users from Azure Active Directory to Active Directory Domains Services is not supported.
- Provisioning users from LDAP to Azure AD is not supported.

## Determine how the Azure AD LDAP Connector will interact with your directory

Before deploying the connector to an existing directory server, you'll need to discuss with the directory server operator in your organization how to integrate with their directory server.  The information you'll gather includes the network information of how to connect to the directory server, how the connector should authenticate itself to the directory server, what schema the directory server has selected to model users, the naming context's base distinguished name and directory hierarchy rules, how to associate users in the directory server with users in Azure AD, and what should happen when a user goes out of scope in Azure AD.  Deploying this connector may require changes to the configuration of the directory server as well as configuration changes to Azure AD. For deployments involving integrating Azure AD with a third-party directory server in a production environment, we recommend customers work with their directory server vendor, or a deployment partner for help, guidance, and support for this integration.  This article uses the following sample values for AD LDS.

 |Configuration setting|Where the value is set| Example value|
 |-----|-----|-----|
 | hostname of the directory server | Configuration wizard **Connectivity** page | `APP3` |
 | port number of the directory server| Configuration wizard **Connectivity** page | 636. For LDAP over SSL or TLS (LDAPS), use port 636.  For `Start TLS`, use port 389. |
 | account for the connector to identify itself to the directory server |Configuration wizard **Connectivity** page | `CN=svcAccount,CN=ServiceAccounts,CN=App,DC=contoso,DC=lab`|
 | password for the connector to authenticate itself to the directory server |Configuration wizard **Connectivity** page | |
 | structural object class for a user in the directory server | Configuration wizard **Object Types** page | `User` |
 | auxiliary object classes for a user in the directory server | Azure portal **Provisioning** page attribute mappings | No additional auxiliary classes required |
 | attributes to populate on a new user | Configuration wizard  **Select Attributes** page and Azure portal **Provisioning** page attribute mappings | `msDS-UserAccountDisabled`, `userPrincipalName`, `displayName` |
 | naming hierarchy required by the directory server | Azure portal **Provisioning** page attribute mappings | Set the DN of a newly created user to be immediately below `CN=CloudUsers,CN=App,DC=Contoso,DC=lab` |
 | attributes for correlating users across Azure AD and the directory server | Azure portal **Provisioning** page attribute mappings | not configured as this example is for an initially empty directory |
 | deprovisioning behavior when a user goes out of scope in Azure AD |Configuration wizard **Deprovisioning** page | Delete the user from the directory server |

The network address of a directory server is a hostname and a TCP port number, typically port 389 or 636. Except where the directory server is co-located with the connector on the same system, or you're using network level security, the network connections from the connector to a directory server need to be protected using SSL or TLS.  The connector supports connecting to a directory server on port 389, and using Start TLS to enable TLS within the session.  The connector also supports connecting to a directory server on port 636 for LDAPS - LDAP over TLS.

You'll need to have an identified account for the connector to authenticate to the directory server already configured in the directory server.  This account is typically identified with a distinguished name and has an associated password or client certificate.  To perform import and export operations on the objects in the connected directory, the connector account must have sufficient permissions within the directory's access control model. The connector needs write permissions to be able to export, and read permissions to be able to import. Permission configuration is performed within the management experiences of the target directory itself.

A directory schema specifies the object classes and attributes that represent a real-world entity in the directory. The connector supports a user being represented with a structural object class, such as `inetOrgPerson`, and optionally additional auxiliary object classes.  In order for the connector to be able to provision users into the directory server, you will need to configure mappings from Azure AD to all of the mandatory attributes of the structural object class and the mandatory attributes of any auxiliary object classes.  In addition, you will likely also configure mappings to some of the optional attributes of these.

The directory hierarchy rules implemented by a directory server describe how the objects for each user relate to each other and to existing objects in the directory.  In most deployments, the organization chose to have a flat hierarchy in their directory server, in which each object for a user is located immediately below a common base object.  For example, if the base distinguished name for the naming context in a directory server is `dc=contoso,dc=com` then a new user would have a distinguished name like `cn=alice,dc=contoso,dc=com`.  However, some organizations may have a more complex directory hierarchy, in which case you'll need to implement the rules when specifying the distinguished name mapping for the connector. For example, a directory server may expect users to be in organizational units by department, so a new user would have a distinguished name like `cn=alice,ou=London,dc=contoso,dc=com`. Note that since the connector does not create intermediate objects for organizational units, any intermediate objects the directory server rule hierarchy expects must already exist in the directory server.

Next, you'll need to define the rules for how the connector should determine if there is already a user in the directory server corresponding to an Azure AD user. Every LDAP directory has a distinguished name that is unique for each object in the directory server, however that distinguished name is often not present for users in Azure AD. Instead, an organization may have a different attribute, such as `mail` or `employeeId`, in their directory server schema that is also present on their users in Azure AD.  Then, when the connector is provisioning a new user into a directory server, the connector can search whether there is already a user in that directory that has a specific value of that  attribute, and only create a new user in the directory server if one is not present.

Finally, you'll need to agree on the deprovisioning behavior.  When the connector is configured, and Azure AD has established a link between a user in Azure AD and a user in the directory, either for a user already in the directory or a new user, then Azure AD can provision attribute changes from the Azure AD user into the directory. If a user that is assigned to the application is deleted in Azure AD, then Azure AD will send a delete operation to the directory server. You may also wish to have Azure AD update the directory server when a user goes out of scope of being able to use the application.

## Prepare the LDAP directory

If you do not already have a directory server, and wish to try out this feature, then [Prepare Active Directory Lightweight Directory Services for provisioning from Azure AD](../articles/active-directory/app-provisioning/on-premises-ldap-connector-prepare-directory.md) shows how to create a test AD LDS environment.   If you already have  another directory server deployed, you can skip that article, and continue installing and configuring the ECMA connector host.


## Download, install, and configure the Azure AD Connect Provisioning Agent Package

1. [Download](https://aka.ms/OnPremProvisioningAgent) the provisioning agent and copy it onto the virtual machine or server that has connectivity to your LDAP directory.
     >[!NOTE]
     >Please use different provisioning agents for on-premises application provisioning and Azure AD Connect Cloud Sync / HR-driven provisioning. All three scenarios should not be managed on the same agent. 
 1. Open the provisioning agent installer, agree to the terms of service, and select **next**.
 1. Open the provisioning agent wizard, and select **On-premises provisioning** when prompted for the extension you want to enable.
 1. Provide credentials for an Azure AD administrator when you're prompted to authorize. The Hybrid Identity Administrator or Global Administrator role is required.
 1. Select **Confirm** to confirm the installation was successful.
 1. Sign in to the Azure portal.
 1. Go to **Enterprise applications** > **Add a new application**.
 1. Search for the **On-premises ECMA app** application, and add it to your tenant.
 1. Navigate to the provisioning page of your application.
 1. Select **Get started**.
 1. On the **Provisioning** page, change the mode to **Automatic**.
     ![Screenshot that shows changing the mode to Automatic.](.\media\active-directory-app-provisioning-sql\configure-7.png)</br>
 1. On the **On-Premises Connectivity** section, select the agent that you just deployed and select **Assign Agent(s)**.
 1. Keep this browser window open, as you complete the next step of configuration using the configuration wizard.

 ## Configure the Azure AD ECMA Connector Host certificate
 1. On the Windows Server where the provisioning agent is installed, launch the Microsoft ECMA2Host Configuration Wizard from the start menu.
 2. After the ECMA Connector Host Configuration starts, if this is the first time you have run the wizard, it will ask you to create a certificate. Leave the default port **8585** and select **Generate** to generate a certificate. The autogenerated certificate will be self-signed as part of the trusted root. The SAN matches the host name.
     [![Screenshot that shows configuring your settings.](.\media\active-directory-app-provisioning-sql\configure-1.png)](.\media\active-directory-app-provisioning-sql\configure-1.png#lightbox)
 3. Select **Save**.


## Configure a generic LDAP connector



 1. If you have not already done so, launch the Microsoft ECMA2Host Configuration Wizard from the start menu.
 2. Select **New Connector**.
     [![Screenshot that shows choosing New Connector.](.\media\active-directory-app-provisioning-sql\sql-3.png)](.\media\active-directory-app-provisioning-sql\sql-3.png#lightbox)</br>
 3. On the **Properties** page, fill in the boxes with the values specified in the table that follows the image and select **Next**.
     [![Screenshot that shows entering properties.](.\media\active-directory-app-provisioning-ldap\create-1.png)](.\media\active-directory-app-provisioning-ldap\create-1.png#lightbox)

     |Property|Value|
     |-----|-----|
     |Name|LDAP|
     |Autosync timer (minutes)|120|
     |Secret Token|Enter your own key here. It should be 12 characters minimum.|
     |Extension DLL|For the generic LDAP connector, select **Microsoft.IAM.Connector.GenericLdap.dll**.|
4. On the **Connectivity** page, you will configure how the ECMA Connector Host will communicate with your directory server. Fill in the boxes with the values specified in the table that follows the image and select **Next**.
     [![Screenshot that shows the Connectivity page.](.\media\active-directory-app-provisioning-ldap\create-2.png)](.\media\active-directory-app-provisioning-ldap\create-2.png#lightbox)</br>
     
     |Property|Description|
     |-----|-----|
     |Host|The host name where the LDAP server is located. This sample uses `APP3` as the example hostname.|
     |Port|The TCP port number.  For LDAP over SSL, use port 636.  For `Start TLS`, use port 389.|
     |Connection Timeout|180|
     |Binding|SSL|
     |User Name|How the ECMA Connector will authenticate itself to your directory server. In this sample, the example username is `CN=svcAccount,CN=ServiceAccounts,CN=App,DC=contoso,DC=lab`|
     |Password|The password of the user name specified|

     >[!NOTE]
     >If you experience and issue trying to connect, ensure that the service account in AD LDS or your other directory server is enabled.
     
 5. On the **Global** page, select **Next**.
 6. On the **Partitions** page, keep the default and select **Next**.
 7. On the **Run Profiles** page, keep the **Export** checkbox selected. Select the **Full import** checkbox and select **Next**.
     [![Screenshot that shows the Run Profiles page.](.\media\active-directory-app-provisioning-ldap\create-3.png)](.\media\active-directory-app-provisioning-ldap\create-3.png#lightbox)</br>
     
     |Property|Description|
     |-----|-----|
     |Export|Run profile that will export data to your LDAP directory. This run profile is required.|
     |Full import|Run profile that will import all data from LDAP sources specified earlier.|
     |Delta import|Run profile that will import only changes from LDAP since the last full or delta import.|
 12. On the **Export** page, leave the defaults and click **Next**. 
 13. On the **Full Import** page,  leave the defaults and click **Next**. 
 14. On the **Object Types** page, fill in the boxes and select **Next**. 
      - **Target object**: This object is the target object in the LDAP directory.
      - **Anchor**: This values of attribute should be unique for each object in the target directory. The Azure AD provisioning service will query the ECMA connector host by using this attribute after the initial cycle. You must be using agent version 1.1.846.0 or above for ObjectGUID to work as the anchor.
      - **Query Attribute**: This attribute should be the same as the Anchor.
      - **DN**: The distinguishedName of the target object.
     
     |Property|Description|
     |-----|-----|
     |Target object|User|
     |Anchor|ObjectGUID|
     |Query Attribute|objectGUID|
     |DN|-dn-|
     |Autogenerated|unchecked|      
 15. The ECMA host discovers the attributes supported by the target directory. You can choose which of those attributes you want to expose to Azure AD. These attributes can then be configured in the Azure portal for provisioning.On the **Select Attributes** page, add all the attributes in the dropdown list, one at a time.
     [![Screenshot that shows the Select Attributes page.](.\media\active-directory-app-provisioning-ldap\create-5.png)](.\media\active-directory-app-provisioning-ldap\create-5.png#lightbox)</br>
      The **Attribute** dropdown list shows any attribute that was discovered in the target directory and *wasn't* chosen on the previous **Select Attributes** page.  Once all the relevant attributes have been added, select **Next**.
 
 16. On the **Deprovisioning** page, under **Disable flow**, select **Delete**. The attributes selected on the previous page won't be available to select on the Deprovisioning page. Select **Finish**.

## Ensure ECMA2Host service is running
 1. On the server the running the Azure AD ECMA Connector Host, select **Start**.
 2. Enter **run** and enter **services.msc** in the box.
 3. In the **Services** list, ensure that **Microsoft ECMA2Host** is present and running. If not, select **Start**.
     [![Screenshot that shows the service is running.](.\media\active-directory-app-provisioning-sql\configure-2.png)](.\media\active-directory-app-provisioning-sql\configure-2.png#lightbox)



## Test the application connection
 1. Return to the web browser window where you were configuring the application provisioning.
    >[!NOTE]
    >If the window had timed out, then you will need to re-select the agent.
     1. Sign in to the Azure portal.
     1. Go to **Enterprise applications** and the **On-premises ECMA app** application.
     1. Click on **Provisioning**.
     1. If **Get started** appears, then change the mode to **Automatic**,  on the **On-Premises Connectivity** section, select the agent that you just deployed and select **Assign Agent(s)**, and wait 10 minutes. Otherwise go to **Edit Provisioning**.
 2. Under the **Admin credentials** section, enter the following URL. Replace the `connectorName` portion with the name of the connector on the ECMA host. You can also replace `localhost` with the host name.

    |Property|Value|
    |-----|-----|
    |Tenant URL|https://localhost:8585/ecma2host_connectorName/scim|

 3. Enter the **Secret Token** value that you defined when you created the connector.
     >[!NOTE]
     >If you just assigned the agent to the application, please wait 10 minutes for the registration to complete. The connectivity test won't work until the registration completes. Forcing the agent registration to complete by restarting the provisioning agent on your server can speed up the registration process. Go to your server, search for **services** in the Windows search bar, identify the **Azure AD Connect Provisioning Agent Service**, right-click the service, and restart.
 4. Select **Test Connection**, and wait one minute.
     [![Screenshot that shows assigning an agent.](.\media\active-directory-app-provisioning-ldap\test-1.png)](.\media\active-directory-app-provisioning-ldap\test-1.png#lightbox)
 5. After the connection test is successful and indicates that the supplied credentials are authorized to enable provisioning, select **Save**.</br>
     [![Screenshot that shows testing an agent.](.\media\active-directory-app-provisioning-sql\configure-9.png)](.\media\active-directory-app-provisioning-sql\configure-9.png#lightbox)

## Configure attribute mapping
 1. In the Azure AD portal, under **Enterprise applications**, select the **On-premises ECMA app** application, and then select the **Provisioning** page.
 2. Select **Edit provisioning**.
 3. Expand **Mappings** and select **Provision Azure Active Directory Users**.
 4. Select **Add New Mapping**.
 5. Specify the source and target attributes, and add all the mappings in the following table. Change the distinguished names in the second row to match that of the organizational unit or other container in your target directory. If you are not using AD LDS, then omit provisioning the `msDS-UserAccountDisabled` attribute. Learn more about attribute mapping [here](../articles/active-directory/app-provisioning/customize-application-attributes.md#understanding-attribute-mapping-properties).

     |Mapping type|Source attribute|Target attribute|Matching precedence|
     |-----|-----|-----|-----|
     |Direct|userPrincipalName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:userPrincipalName|1|
     |Expression|Join("", "CN=", Word([userPrincipalName], 1, "@"), ",CN=CloudUsers,CN=App,DC=Contoso,DC=lab")|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:-dn-||
     |Direct|isSoftDeleted|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:msDS-UserAccountDisabled||
     |Direct|displayName|urn:ietf:params:scim:schemas:extension:ECMA2Host:2.0:User:displayName||

 6. Select **Save**.

## Assign users to an application
Now that you have the Azure AD ECMA Connector Host talking with Azure AD, and the attribute mapping configured, you can move on to configuring who's in scope for provisioning. 

>[!IMPORTANT]
>If you were signed in using a Hybrid Identity Administrator role, you need to sign-out and sign-in with an account that has the Application Administrator, Cloud Application Administrator or Global Administrator role, for this section.  The Hybrid Identity Administrator role does not have permissions to assign users to applications.

If there are existing users in the LDAP directory, then you should create application role assignments for those existing users. To learn more about how to create application role assignments in bulk, see [governing an application's existing users in Azure AD](../articles/active-directory/governance/identity-governance-applications-existing-users.md).

Otherwise, if the LDAP directory is empty, then select a test user from Azure AD who will be provisioned to the application.

 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises ECMA app** application.
 3. On the left, under **Manage**, select **Users and groups**.
 4. Select **Add user/group**.
     [![Screenshot that shows adding a user.](.\media\active-directory-app-provisioning-sql\app-2.png)](.\media\active-directory-app-provisioning-sql\app-2.png#lightbox)
5. Under **Users**, select **None Selected**.
     [![Screenshot that shows None Selected.](.\media\active-directory-app-provisioning-sql\app-3.png)](.\media\active-directory-app-provisioning-sql\app-3.png#lightbox)
 6. Select users from the right and select the **Select** button.</br>
     [![Screenshot that shows Select users.](.\media\active-directory-app-provisioning-sql\app-4.png)](.\media\active-directory-app-provisioning-sql\app-4.png#lightbox)
 7. Now select **Assign**.
     [![Screenshot that shows Assign users.](.\media\active-directory-app-provisioning-sql\app-5.png)](.\media\active-directory-app-provisioning-sql\app-5.png#lightbox)




## Test provisioning
Now that your attributes are mapped and users are assigned, you can test on-demand provisioning with one of your users.
 
 1. In the Azure portal, select **Enterprise applications**.
 2. Select the **On-premises ECMA app** application.
 3. On the left, select **Provisioning**.
 4. Select **Provision on demand**.
 5. Search for one of your test users, and select **Provision**.
 [![Screenshot that shows testing on-demand provisioning.](.\media\active-directory-app-provisioning-ldap\test-2.png)](.\media\active-directory-app-provisioning-ldap\test-2.png#lightbox)</br>
 6. After several seconds, then the message **Successfully created user in target system** will appear, with a list of the user attributes.

## Start provisioning users
 1. After on-demand provisioning is successful, change back to the provisioning configuration page. Ensure that the scope is set to only assigned users and groups, turn provisioning **On**, and select **Save**.
 
 2. Wait several minutes for provisioning to start. It might take up to 40 minutes. After the provisioning job has been completed, as described in the next section, if you are done testing with this application, you can change the provisioning status to **Off**, and select **Save**. This action stops the provisioning service from running in the future.

## Troubleshooting provisioning errors

If an error is shown, then select **View provisioning logs**.  Look in the log for a row in which the Status is **Failure**, and click on that row.

If the error message is **Failed to create User**, then check the attributes that are shown against the requirements of the directory schema.

For more information, change to the **Troubleshooting & Recommendations** tab.

For other errors, see [troubleshooting on-premises application provisioning](../articles/active-directory/app-provisioning/on-premises-ecma-troubleshoot.md).

## Check that users were successfully provisioned
After waiting, check your directory to ensure users are being provisioned.  The following instructions illustrate how to check AD LDS.

 1. Open Server Manager and select AD LDS on the left.
 2. Right-click your instance of AD LDS and select ldp.exe from the pop-up.
   [![Screenshot of the Ldp tool location.](media/active-directory-app-provisioning-ldap/ldp-1.png)](media/active-directory-app-provisioning-ldap/ldp-1.png#lightbox)</br>
 3. At the top of ldp.exe, select **Connection** and **Connect**.
 4. Enter the following information and click **OK**.
   - Server:  APP3
   - Port: 636
   - Place a check in the SSL box
   [![Screenshot showing the Ldp connection for checking users.](media/active-directory-app-provisioning-ldap/ldp-2.png)](media/active-directory-app-provisioning-ldap/ldp-2.png#lightbox)</br>
 5. At the top, under **Connection** select **Bind**.
 6. Leave the defaults and click **OK**.
 7. At the top, select **View** and **Tree**
 8. For the BaseDN enter **CN=App,DC=contoso,DC=lab** and click **OK**.
 9. On the left, expand the DN and click on **CN=CloudUsers,CN=App,DC=contoso,DC=lab**.  You should see your users who were provisioned from Azure AD.
  [![Screenshot showing Ldp binding for users.](media/active-directory-app-provisioning-ldap/test-3.png)](media/active-directory-app-provisioning-ldap/test-3.png#lightbox)</br>

