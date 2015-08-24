<properties 
	pageTitle="RADIUS Authentication and Azure Multi-Factor Authentication Server" 
	description="This is the Azure Multi-factor authentication page that will assist in deploying RADIUS Authentication and Azure Multi-Factor Authentication Server." 
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



# RADIUS Authentication and Azure Multi-Factor Authentication Server

The RADIUS Authentication section allows you to enable and configure RADIUS authentication for the Azure Multi-Factor Authentication Server. RADIUS is a standard protocol to accept authentication requests and to process those requests. The Azure Multi-Factor Authentication Server acts as a RADIUS server and is inserted between your RADIUS client (e.g. VPN appliance) and your authentication target, which could be Active Directory (AD), an LDAP directory or another RADIUS server, in order to add Azure Multi-Factor Authentication. For Azure Multi-Factor Authentication to function, you must configure the Azure Multi-Factor Authentication Server so that it can communicate with both the client servers and the authentication target. The Azure Multi-Factor Authentication Server accepts requests from a RADIUS client, validates credentials against the authentication target, adds Azure Multi-Factor Authentication, and sends a response back to the RADIUS client. The entire authentication will succeed only if the both the primary authentication and the Azure Multi-Factor Authentication succeed.

![Radius Authentication](./media/multi-factor-authentication-get-started-server-rdg/radius.png)

## RADIUS Authentication Configuration

To configure RADIUS authentication, install the Azure Multi-Factor Authentication Server on a Windows server. If you have an Active Directory environment, the server should be joined to the domain inside the network. Use the following procedure to configure the Azure Multi-Factor Authentication Server: 

1. Within the Azure Multi-Factor Authentication Server click the RADIUS Authentication icon in the left menu.
2. Check the Enable RADIUS authentication checkbox.
3. On the Clients tab change the Authentication port(s) and Accounting port(s) if the Azure Multi-Factor Authentication RADIUS service should bind to non-standard ports to listen for RADIUS requests from the clients that will be configured.
4. Click Add… button.
5. In the Add RADIUS Client dialog box, enter the IP address of the appliance/server that will authenticate to the Azure Multi-Factor Authentication Server, an Application name (optional) and a Shared secret. The shared secret will need to be the same on both the Azure Multi-Factor Authentication Server and appliance/server. The Application name appears in Azure Multi-Factor Authentication reports and may be displayed within SMS or Mobile App authentication messages.
6. Check the Require Multi-Factor Authentication user match box if all users have been or will be imported into the Server and subject to multi-factor authentication. If a significant number of users have not yet been imported into the Server and/or will be exempt from multi-factor authentication, leave the box unchecked. See the help file for additional information on this feature.
7. Check the Enable fallback OATH token box if users will use the Azure Multi-Factor Authentication mobile app authentication and you want to use OATH passcodes as a fallback authentication to the out- of-band phone call, SMS or push notification.
8. Click the OK button.
9. You may repeat steps 4 through 8 to add additional RADIUS clients.
10. Click the Target tab.
11. If the Azure Multi-Factor Authentication Server is installed on a domain-joined server in an Active Directory environment, select Windows domain.
12. If users should be authenticated against an LDAP directory, select LDAP bind. When using LDAP bind, you must click the Directory Integration icon and edit the LDAP configuration on the Settings tab so that the Server can bind to your directory. Instructions for configuring LDAP can be found in the LDAP Proxy configuration guide. 
13. If users should be authenticated against another RADIUS server, select RADIUS server(s).
14. Configure the server that the Server will proxy the RADIUS requests to by clicking the Add… button.
15. In the Add RADIUS Server dialog box enter the IP address of the RADIUS server and a Shared secret. The shared secret will need to be the same on both the Azure Multi-Factor Authentication Server and RADIUS server. Change the Authentication port and Accounting port if different ports are used by the RADIUS server.
16. Click the OK button. 
17. You must add the Azure Multi-Factor Authentication Server as a RADIUS client in the other RADIUS server so that it will process access requests sent to it from the Azure Multi-Factor Authentication Server. You must use the same shared secret configured in the Azure Multi-Factor Authentication Server.
18. You may repeat this step to add additional RADIUS servers and configure the order in which the Server should call them with the Move Up and Move Down buttons. This completes the Azure Multi-Factor Authentication Server configuration. The Server is now listening on the configured ports for RADIUS access requests from the configured clients.   


## RADIUS Client Configuration

To configure the RADIUS client, use the guidelines:

- Configure your appliance/server to authenticate via RADIUS to the Azure Multi-Factor Authentication Server’s IP address, which will act as the RADIUS server. 
- Use the same shared secret that was configured above. 
- Configure the RADIUS timeout to 30-60 seconds so that there is time to validate the user’s credentials, perform the multi-factor authentication, receive their response and then respond to the RADIUS access request.

