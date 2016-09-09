<properties 
	pageTitle="LDAP Authentication and Azure Multi-Factor Authentication Server" 
	description="This is the Azure Multi-factor authentication page that will assist in deploying LDAP Authentication and Azure Multi-Factor Authentication Server." 
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
	ms.topic="get-started-article" 
	ms.date="08/04/2016" 
	ms.author="billmath"/>

# LDAP Authentication and Azure Multi-Factor Authentication Server 


By default, the Azure Multi-Factor Authentication Server is configured to import or synchronize users from Active Directory. However, it can be configured to bind to different LDAP directories, such as an ADAM directory, or specific Active Directory domain controller. When configured to connect to a directory via LDAP, the Azure Multi-Factor Authentication Server can be configured to act as an LDAP proxy to perform authentications. It also allows for the use of LDAP bind as a RADIUS target, for pre-authentication of users when using IIS Authentication, or for primary authentication in the Azure Multi-Factor Authentication User Portal.

When using Azure Multi-Factor Authentication as an LDAP proxy, the Azure Multi-Factor Authentication Server is inserted between the LDAP client (e.g. VPN appliance, application) and the LDAP directory server in order to add multi-factor authentication. For Azure Multi-Factor Authentication to function, the Azure Multi-Factor Authentication Server must be configured to communicate with both the client servers and the LDAP directory. In this configuration, the Azure Multi-Factor Authentication Server accepts LDAP requests from client servers and applications and forwards them to the target LDAP directory server to validate the primary credentials. If the response from the LDAP directory shows that they primary credentials are valid, Azure Multi-Factor Authentication performs second-factor authentication and sends a response back to the LDAP client. The entire authentication will succeed only if both the authentication to the LDAP server and the multi-factor authentication succeed. 





## LDAP Authentication Configuration


To configure LDAP authentication, install the Azure Multi-Factor Authentication Server on a Windows server. Use the following procedure: 

1. Within the Azure Multi-Factor Authentication Server click the LDAP Authentication icon in the left menu.
2. Check the Enable LDAP Authentication checkbox.![LDAP Authentication](./media/multi-factor-authentication-get-started-server-ldap/ldap2.png) 
3. On the Clients tab change the TCP port and SSL port if the Azure Multi-Factor Authentication LDAP service should bind to non-standard ports to listen for LDAP requests from the clients that will be configured.
4. If you plan to use LDAPS from the client to the Azure Multi-Factor Authentication Server, an SSL certificate must be installed on the server that the Server is running on. Click the Browse… button next to the SSL certificate box and select the installed certificate that will be used for the secure connection. 
5. Click Add… button.
6. In the Add LDAP Client dialog box, enter the IP address of the appliance, server or application that will authenticate to the Server and an Application name (optional). The Application name appears in Azure Multi-Factor Authentication reports and may be displayed within SMS or Mobile App authentication messages.
7. Check the Require Azure Multi-Factor Authentication user match box if all users have been or will be imported into the Server and subject to mutli-factor authentication. If a significant number of users have not yet been imported into the Server and/or will be exempt from mutli-factor authentication, leave the box unchecked. See the help file for additional information on this feature. 
8. You may repeat steps 5 through 7 to add additional LDAP clients.
9. When the Azure Multi-Factor Authentication is configured to receive LDAP authentications, it must proxy those authentications to the LDAP directory. Therefore, the Target tab only displays a single, grayed out option to use an LDAP target. To configure the LDAP directory connection, click the Directory Integration icon. 
10. On the Settings tab, select the Use specific LDAP configuration radio button.
11. Click the Edit… button.
12. In the Edit LDAP Configuration dialog box, populate the fields with the information required to connect to the LDAP directory. Descriptions of the fields are included in the table below. Note: This information is also included in the Azure Multi-Factor Authentication Server help file.![Directory Integration](./media/multi-factor-authentication-get-started-server-ldap/ldap.png) 
13. Test the LDAP connection by clicking the Test button.
14. If the LDAP connection test was successful, click the OK button. 
15. Click the Filters tab. The Server is pre-configured to load containers, security groups and users from Active Directory. If binding to a different LDAP directory, you will likely need to edit the filters displayed. Click the Help link for more information on filters.
16. Click Attributes tab. The Server is pre-configured to map attributes from Active Directory.
17. If binding to a different LDAP directory or to change the pre-configured attribute mappings, click the Edit… button.
18. In the Edit Attributes dialog box, modify the LDAP attribute mappings for your directory. Attribute names can be typed in or selected by clicking the … button next to each field.
19. Click the Help link for more information on attributes.
20. Click the OK button.
21. Click the Company Settings icon and select the Username Resolution tab.
22.If connecting to Active Directory from a domain-joined server, you should be able to leave the Use Windows security identifiers (SIDs) for matching usernames radio button selected. Otherwise, select the Use LDAP unique identifier attribute for matching usernames radio button. When selected, the Azure Multi-Factor Authentication Server will attempt to resolve each username to a unique identifier in the LDAP directory. An LDAP search will be performed on the Username attributes defined in the Directory Integration -> Attributes tab. When a user authenticates, the username will be resolved to the unique identifier in the LDAP directory and the unique identifier will be used for matching the user in the Azure Multi-Factor Authentication data file. This allows for case-insensitive comparisons, as well as long and short username formats This completes the Azure Multi-Factor Authentication Server configuration. The Server is now listening on the configured ports for LDAP access requests from the configured clients, and set to proxy those requests to the LDAP directory for authentication.


## LDAP Client Configuration

To configure the LDAP client, use the guidelines:

- Configure your appliance, server or application to authenticate via LDAP to the Azure Multi-Factor Authentication Server as though it were your LDAP directory. You should use the same settings that you would normally use to connect directly to your LDAP directory, except for the server name or IP address which will be that of the Azure Multi-Factor Authentication Server. 
- Configure the LDAP timeout to 30-60 seconds so that there is time to validate the user’s credentials with the LDAP directory, perform the second-factor authentication, receive their response and then respond to the LDAP access request. 
- If using LDAPS, the appliance or server making the LDAP queries must trust the SSL certificate installed on the Azure Multi-Factor Authentication Server.

