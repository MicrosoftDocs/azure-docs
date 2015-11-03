<properties 
	pageTitle="Directory integration between Azure Multi-Factor Authentication and Active Directory" 
	description="This is the Azure Multi-factor authentication page that describes how to integrate the Azure Multi-Factor Authentication Server with Active Directory so you can synchronize the directories." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/24/2015" 
	ms.author="billmath"/>

# Directory integration between Azure MFA Server and Active Directory

The Directory Integration section allows you to configure the server to integrate with Active Directory or another LDAP directory.  It allows you to configure attributes to match the directory schema and set up automatic synchronization of users. 

## Settings
By default, the Azure Multi-Factor Authentication Server is configured to import or synchronize users from Active Directory.  The tab allows you to override the default behavior and to bind to a different LDAP directory, an ADAM directory, or specific Active Directory domain controller.  It also provides for the use of LDAP Authentication to proxy LDAP or for LDAP Bind as a RADIUS target, pre-authentication for IIS Authentication, or primary authentication for User Portal.  The following table describes the individual settings.

![Setttings](./media/multi-factor-authentication-get-started-server-dirint/dirint.png)

| Feature | Description |
| ------- | ----------- |
| Use Active Directory | Select the Use Active Directory option to use Active Directory for importing and synchronization.  This is the default setting. <br>Note:  The computer must be joined to a domain and you must be signed on with a domain account for Active Directory integration to work properly. |
| Include trusted domains | Check the Include Trusted Domains checkbox to have the agent attempt to connect to domains trusted by the current domain, another domain in the forest, or domains involved in a forest trust.  When not importing or synchronizing users from any of the trusted domains, uncheck the checkbox to improve performance.  The default is checked. |
| Use specific LDAP configuration | Select the Use LDAP option to use the LDAP settings specified for importing and synchronization. Note: When Use LDAP is selected, the user interface changes references from Active Directory to LDAP. |
| Edit button | The Edit button allows the current LDAP configuration settings to modified. |
| Use attribute scope queries | Indicates whether attribute scope queries should be used.  Attribute scope queries allow for efficient directory searches qualifying records based on the entries in another record's attribute.  The Azure Multi-Factor Authentication Server uses attribute scope queries to efficiently query the users that are a member of a security group.   <br>Note:  There are some cases where attribute scope queries are supported, but shouldn't be used.  For example, Active Directory can have issues with attribute scope queries when a security group contains members from more than one domain.  In this case the checkbox should be unchecked. |

The following table describes the LDAP configuration settings.

| Feature | Description |
| ------- | ----------- |
| Server | Enter the hostname or IP address of the server running the LDAP directory.  A backup server may also be specified separated by a semi-colon. <br>Note: When Bind Type is SSL, a fully-qualified hostname is generally required. |
| Base DN | Enter the distinguished name of the base directory object from which all directory queries will start.  For example, dc=abc,dc=com. |
| Bind type - Queries | Select the appropriate bind type for use when binding to search the LDAP directory.  This is used for imports, synchronization, and username resolution. <br><br>  Anonymous - An anonymous bind will be performed.  Bind DN and Bind Password will not be used.  This will only work if the LDAP directory allows anonymous binding and permissions allow the querying of the appropriate records and attributes.  <br><br> Simple - Bind DN and Bind Password will be passed as plain text to bind to the LDAP directory.  This should only be used for testing purposes to verify that the server can be reached and that the bind account has the appropriate access.  It is recommended that SSL be used instead after the appropriate cert has been installed.  <br><br> SSL - Bind DN and Bind Password will be encrypted using SSL to bind to the LDAP directory.  This requires that a cert be installed locally that the LDAP directory trusts.  <br><br> Windows - Bind Username and Bind Password will be used to securely connect to an Active Directory domain controller or ADAM directory.  If Bind Username is left blank, the logged-on user's account will be used to bind. |
| Bind type - Authentications | Select the appropriate bind type for use when performing LDAP bind authentication.  See the bind type descriptions under Bind type - Queries.  For example, this allows for Anonymous bind to be used for queries while SSL bind is used to secure LDAP bind authentications. |
| Bind DN or Bind username | Enter the distinguished name of the user record for the account to use when binding to the LDAP directory.<br><br>The bind distinguished name is only used when Bind Type is Simple or SSL.  <br><br>Enter the username of the Windows account to use when binding to the LDAP directory when Bind Type is Windows.  If left blank, the logged-on user's account will be used to bind. |
| Bind Password | Enter the bind password for the Bind DN or username being used to bind to the LDAP directory.  To configure the password for the Multi-Factor Auth Server AdSync Service, synchronization must be enabled and the service must be running on the local machine.  The password will be saved in the Windows Stored Usernames and Passwords under the account the Multi-Factor Auth Server AdSync Service is running as.  The password will also be saved under the account the Multi-Factor Auth Server user interface is running as and under the account the Multi-Factor Auth Server Service is running as.  <br><br> Note:  Since the password is only stored in the local server's Windows Stored Usernames and Passwords, this step will need to be done on each Multi-Factor Auth Server that needs access to the password. |
| Query size limit | Specify the size limit for the maximum number of users that a directory search will return.  This limit should match the configuration on the LDAP directory.  For large searches where paging is not supported, import and synchronization will attempt to retrieve users in batches.  If the size limit specified here is larger than the limit configured on the LDAP directory, some users may be missed. |
| Test button | Click the Test button to test binding to the LDAP server.  <br><br> Note: The Use LDAP option does not need to be selected in order to test binding.  This allows the binding to be tested prior to using the LDAP configuration. |

## Filters
Filters allow you to set criteria to qualify records when performing a directory search.  By setting the filter you can scope the objects you want to synchronize.  

![Filters](./media/multi-factor-authentication-get-started-server-dirint/dirint2.png)

Azure Multi-Factor Authentication has the following 3 options.

- **Container filter** - Specify the filter criteria used to qualify container records when performing a directory search.  For Active Directory and ADAM, (|(objectClass=organizationalUnit)(objectClass=container)) is generally used.  For other LDAP directories, filter criteria that qualifies each type of container object should be used depending on the directory schema.  <br>Note:  If left blank, ((objectClass=organizationalUnit)(objectClass=container)) will be used by default.

- **Security group filter** - Specify the filter criteria used to qualify security group records when performing a directory search.  For Active Directory and ADAM, (&(objectCategory=group)(groupType:1.2.840.113556.1.4.804:=-2147483648)) is generally used.  For other LDAP directories, filter criteria that qualifies each type of security group object should be used depending on the directory schema.  <br>Note:  If left blank, (&(objectCategory=group)(groupType:1.2.840.113556.1.4.804:=-2147483648)) will be used by default.

- **User filter** - Specify the filter criteria used to qualify user records when performing a directory search.  For Active Directory and ADAM, (&(objectClass=user)(objectCategory=person)) is generally used.  For other LDAP directories, (objectClass=inetOrgPerson) or something similar should be used depending on the directory schema. <br>Note:  If left blank, (&(objectCategory=person)(objectClass=user)) will be used by default.

## Attributes
Attributes may be customized as necessary for a specific directory.  This allows you to add custom attributes and fine tune the synchronization to only the attributes that you need.  The value for each attribute field should be the name of the attribute as defined in the directory schema.  Use the table below for additional information.

![Attributes](./media/multi-factor-authentication-get-started-server-dirint/dirint3.png)

| Feature | Description |
| ------- | ----------- |
| Unique identifier | Enter the attribute name of the attribute that serves as the unique identifier of container, security group, and user records.  In Active Directory, this is usually objectGUID.  In other LDAP implementations, it may be entryUUID or something similar.  The default is objectGUID. |
| ... (Select Attribute) buttons | Each attribute field has a "..." button next to it that will display the Select Attribute dialog allowing an attribute to be selected from a list. <br><br>Select Attribute dialog.<br><br>Note:  Attributes may be entered manually and are not required to match an attribute in the attribute  list. |
| Unique identifier type | Select the type of the unique identifier attribute.  In Active Directory, the objectGUID attribute is of type GUID.  In other LDAP implementations, it may be of type ASCII Byte Array or String.  The default is GUID. <br><br>Note:  It is important to set this correctly since Synchronization Items are referenced by their Unique Identifier and the Unique Identifier Type is used to directly find the object in the directory.  Setting this to String when the directory actually stores the value as a byte array of ASCII characters will prevent synchronization from functioning properly. |
| Distinguished name | Enter the attribute name of the attribute that contains the distinguished name for each record.  In Active Directory, this is usually distinguishedName.  In other LDAP implementations, it may be entryDN or something similar.  The default is distinguishedName. <br><br>Note:  If an attribute containing just the distinguished name doesn't exist, the adspath attribute may be used.  The "LDAP://<server>/" portion of the path will be automatically stripped off leaving just the distinguished name of the object. |
| Container name | Enter the attribute name of the attribute that contains the name in a container record.  The value of this attribute will be displayed in the Container Hierarchy when importing from Active Directory or adding synchronization items.  The default is name. <br><br>Note:  If different containers use different attributes for their names, multiple container name attributes may be specified in separated by semi-colons.  The first container name attribute found on a container object will be used to display its name. |
| Security group name | Enter the attribute name of the attribute that contains the name in a security group record.  The value of this attribute will be displayed in the Security Group list when importing from Active Directory or adding synchronization items.  The default is name. |
| Users | The following attributes are used for searching for, displaying, importing, and synchronizing user information from the directory. |
| Username | Enter the attribute name of the attribute that contains the username in a user record.  The value of this attribute will be used as the Multi-Factor Auth Server username.  A second attribute may be specified as a backup to the first.  The second attribute will only be used if the first attribute does not contain a value for the user.  The defaults are userPrincipalName and sAMAccountName. |
| First name | Enter the attribute name of the attribute that contains the first name in a user record.  The default is givenName. |
| Last name | Enter the attribute name of the attribute that contains the last name in a user record.  The default is sn. |
| Email address | Enter the attribute name of the attribute that contains the email address in a user record.  Email address will be used to send welcome and update emails to the user.  The default is mail. |
| User group | Enter the attribute name of the attribute that contains the user group in a user record.  User group can be used to filter users in the agent and on reports in the Multi-Factor Auth Server Management Portal. |
| Description | Enter the attribute name of the attribute that contains the description in a user record.  Description is only used for searching.  The default is description. |
| Voice call language | Enter the attribute name of the attribute that contains the short name of the language to use for voice calls for the user. |
| SMS text language | Enter the attribute name of the attribute that contains the short name of the language to use for SMS text messages for the user. |
| Phone app language | Enter the attribute name of the attribute that contains the short name of the language to use for phone app text messages for the user. |
| OATH token language | Enter the attribute name of the attribute that contains the short name of the language to use for OATH token text messages for the user. |
| Phones | The following attributes are used to import or synchronize user phone numbers.  If an attribute name is not specified for phone type, the phone type will not be available when importing from Active Directory or adding synchronization items. |
| Business | Enter the attribute name of the attribute that contains the business phone number in a user record.  The default is telephoneNumber. |
| Home | Enter the attribute name of the attribute that contains the home phone number in a user record.  The default is homePhone. |
| Pager | Enter the attribute name of the attribute that contains the pager number in a user record.  The default is pager. |
| Mobile | Enter the attribute name of the attribute that contains the mobile phone number in a user record.  The default is mobile. |
| Fax | Enter the attribute name of the attribute that contains the fax number in a user record.  The default is facsimileTelephoneNumber. |
| IP phone | Enter the attribute name of the attribute that contains the IP phone number in a user record.  The default is ipPhone. |
| Custom | Enter the attribute name of the attribute that contains a custom phone number in |
|  | a user record.  The default is blank. |
| Extension | Enter the attribute name of the attribute that contains the phone number extension in a user record.  The value of the extension field will be used as the extension to the primary phone number only.  The default is blank. <br><br>Note: If the Extension attribute is not specified, extensions can be included as part of the phone attribute.  The extension should be preceded with an 'x' so it can be parsed.  For example 555-123-4567 x890 would result in 555-123-4567 as the phone number and 890 as the extension. |
| Restore Defaults button | Click the Restore Defaults button to return all attributes back to their default value.  The defaults should work properly with the normal Active Directory or ADAM schema. |

To edit attributes, simply click the edit button on the Attributes tab.  This will bring up a windows that allows you to edit the attributes.

![Edit Attributes](./media/multi-factor-authentication-get-started-server-dirint/dirint4.png)

## Synchronization
Synchronization keeps the Azure Multi-Factor user database synchronized with the users in Active Directory or another Lightweight Directory Access Protocol (LDAP)  Lightweight Directory Access Protocol directory.  The process is similar to importing users manually from Active Directory, but periodically polls for Active Directory user and security group changes to process.  It also provides for disabling or removing users removed from a container or security group and removing users deleted from Active Directory.

The Multi-Factor Auth ADSync service is a Windows service that performs the periodic polling of Active Directory.  This is not to be confused with Azure AD Sync or Azure AD Connect.  the Multi-Factor Auth ADSync, although built on a similar code base, is specific to the Azure Multi-Factor Authentication Server.  It is installed in a Stopped state and is started by the Multi-Factor Auth Server service when configured to run.  If you have a multi-server Multi-Factor Auth Server configuration, the Multi-Factor Auth ADSync may only be run on a single server.

The Multi-Factor Auth ADSync service uses the DirSync LDAP server extension provided by Microsoft to efficiently poll for changes.  This DirSync control caller must have the "directory get changes" right and DS-Replication-Get-Changes extended control access right.  By default, these rights are assigned to the Administrator and LocalSystem accounts on domain controllers.  The Multi-Factor Auth AdSync service is configured to run as LocalSystem by default.  Therefore it is simplest to run the service on a domain controller.  The service can run as an account with lesser permissions if you configure it to always perform a full synchronization.  This is less efficient, but requires less account privileges.

If configured to use LDAP and the LDAP directory supports the DirSync control, then polling for user and security group changes will work the same as it does with Active Directory.  If the LDAP directory does not support the DirSync control, then a full synchronization will be performed during each cycle.

![Synchronization](./media/multi-factor-authentication-get-started-server-dirint/dirint5.png)

Use the table below for additional information on each of the individual settings on the Synchronization tab.

| Feature | Description |
| ------- | ----------- |
| Enable synchronization with Active Directory | When checked, the Multi-Factor Auth Server service will be started to periodically poll Active Directory for changes. <br><br>Note: At least one Synchronization Item must be added and a Synchronize Now must be performed before the Multi-Factor Auth Server service will start processing changes. |
| Synchronize every | Specify the time interval the Multi-Factor Auth Server service will wait between polling and processing changes. <br><br> Note: The interval specified is the time between the beginning of each cycle.  If the time processing changes exceeds the interval, the service will poll again immediately. |
| Remove users no longer in Active Directory | When checked, the Multi-Factor Auth Server service will process Active Directory deleted user tombstones and remove the related Multi-Factor Auth Server user. |
| Always perform a full synchronization | When checked, the Multi-Factor Auth Server service will always perform a full synchronization.  When unchecked, the Multi-Factor Auth Server service will perform an incremental synchronization by only querying users that have changed.  The default is unchecked. <br><br> Note:  When unchecked, an incremental synchronization can only be performed when the directory supports the DirSync control and the account being used to bind to the directory has the appropriate permissions to perform DirSync incremental queries.  If the account does not have the appropriate permissions or multiple domains are involved in the synchronization, perform a full synchronization is recommended. |
| Require administrator approval when more than X users will be disabled or removed | Synchronization items can be configured to disable or remove users who are no longer a member of the item's container or security group.  As a safeguard, administrator approval can be required when the number of users to disable or remove exceeds a threshold.  When checked, approval will be required for specified threshold.  The default is 5 and the range is 1 to 999. <br><br> Approval is facilitated by first sending an email notification to administrators. The email notification gives instructions for reviewing and approving the disabling and removal of users.  When the Multi-Factor Auth Server user interface is launched, it will prompt for approval. |

The **Synchronize Now** button allows you to run a full synchronization for the synchronization items specified.  A full synchronization is required whenever synchronization items are added, modified, removed, or reordered.  It is also required before the Multi-Factor Auth AdSync service will be operational since it sets the starting point from which the service will poll for incremental changes.  If changes have been made to synchronization items and a full synchronization has not been performed, you will be prompted to Synchronize Now when navigating to another section or when closing the user interface.

The **Remove** button allows the administrator to delete one or more synchronization items from the Multi-Factor Auth Server synchronization item list.

>[AZURE.WARNING]Once a synchronization item record has been removed, it cannot be recovered. You will need to re-add the synchronization item record if you deleted it by mistake.

The synchronization item or synchronization items have been removed from Multi-Factor Auth Server.  The Multi-Factor Auth Server service will no longer process the synchronization items. 

The Move Up and Move Down buttons allow the administrator to change the order of the synchronization items.  The order is important since the same user may be a member of more than one synchronization item (e.g. a container and a security group).  The settings applied to the user during synchronization will come from the first synchronization item in the list to which the user is associated.  Therefore, the synchronization items should be put in priority order.

>[AZURE.TIP]A full synchronization should be performed after removing synchronization items.  A full synchronization should be performed after ordering synchronization items.  Click the Synchronize Now button to perform a full synchronization.

## Multi-Factor Auth Servers
Additional Multi-Factor Auth Servers may be set up to serve as a backup RADIUS proxy, LDAP proxy, or for IIS Authentication. The Synchronization configuration will be shared among all of the agents. However, only one of these agents may have the Multi-Factor Auth Server service running. This tab allows you to select the Multi-Factor Auth Server that should be enabled for synchronization.

![Multi-Factor-Auth Servers](./media/multi-factor-authentication-get-started-server-dirint/dirint6.png)