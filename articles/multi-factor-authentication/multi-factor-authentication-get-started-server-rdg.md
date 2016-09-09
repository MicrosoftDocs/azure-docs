<properties 
	pageTitle="Remote Desktop Gateway and Azure Multi-Factor Authentication Server using RADIUS" 
	description="This is the Azure Multi-factor authentication page that will assist in deploying Remote Desktop (RD) Gateway and Azure Multi-Factor Authentication Server using RADIUS." 
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

# Remote Desktop Gateway and Azure Multi-Factor Authentication Server using RADIUS

In many cases, Remote Desktop Gateway uses the local NPS to authenticate users. This document describes how to route RADIUS request out from the Remote Desktop Gateway (through the local NPS) to the Multi-Factor Authentication Server.

The Multi-Factor Authentication Server should be installed on a separate server, which will then proxy the RADIUS request back to the NPS on the Remote Desktop Gateway Server. After NPS validates the username and password, it will return a response to the Multi-Factor Authentication Server which performs the second factor of authentication before returning a result to the gateway.





## Configure the RD Gateway

The RD Gateway must be configured to send RADIUS authentication to an Azure Multi-Factor Authentication Server. Once RD Gateway has been installed, configured and is working, go into the RD Gateway properties. Go to the RD CAP Store tab and change it to use a Central server running NPS instead of Local server running NPS. Add one or more Azure Multi-Factor Authentication Servers as RADIUS servers and specify a shared secret for each server.





## Configure NPS

The RD Gateway uses NPS to send the RADIUS request to Azure Multi-Factor Authentication. A timeout must be changed to prevent the RD Gateway from timing out before multi-factor authentication has completed. Use the following procedure to configure NPS.

1. In NPS, expand the RADIUS Clients and Server menu in the left column and click on Remote RADIUS Server Groups. Go into the properties of the TS GATEWAY SERVER GROUP. Edit the RADIUS Server(s) displayed and go to the Load Balancing tab. Change the “Number of seconds without response before request is considered dropped” and the “Number of seconds between requests when server is identified as unavailable” to 30-60 seconds. Click on the Authentication/Account tab and ensure that the RADIUS ports specified match the ports that the Multi-Factor Authentication Server will be listening on.
2. NPS must also be configured to receive RADIUS authentications back from the Azure Multi-Factor Authentication Server. Click on RADIUS Clients in the left menu. Add the Azure Multi-Factor Authentication Server as a RADIUS client. Choose a Friendly name and specify a shared secret.
3. Expand the Policies section in the left navigation and click on Connection Request Policies. It should contain a Connection Request Policy called TS GATEWAY AUTHORIZATION POLICY that was created when RD Gateway was configured. This policy forwards RADIUS requests to the Multi-Factor Authentication Server.
4. Copy this policy to create a new one. In the new policy, add a condition that matches the Client Friendly Name with the Friendly name set in step 2 above for the Azure Multi-Factor Authentication Server RADIUS client. Change the Authentication Provider to Local Computer. This policy ensures that when a RADIUS request is received from the Azure Multi-Factor Authentication Server, the authentication occurs locally instead of sending a RADIUS request back to the Azure Multi-Factor Authentication Server which would result in a loop condition. To prevent the loop condition, this new policy must be ordered ABOVE the original policy that forwards to the Multi-Factor Authentication Server.

## Configure Azure Multi-Factor Authentication


--------------------------------------------------------------------------------



The Azure Multi-Factor Authentication Server is configured as a RADIUS proxy between RD Gateway and NPS.  It should be installed on a domain-joined server that is separate from the RD Gateway server. Use the following procedure to configure the Azure Multi-Factor Authentication Server.

1. Open the Azure Multi-Factor Authentication Server and click the RADIUS Authentication icon. Check the Enable RADIUS authentication checkbox.
2. On the Clients tab, ensure the ports match what is configured in NPS and click the Add… button. Add the RD Gateway server IP address, application name (optional) and a shared secret. The shared secret will need to be the same on both the Azure Multi-Factor Authentication Server and RD Gateway.
3. Click the Target tab and choose the RADIUS server(s) radio button.
4. Click the Add… button. Enter the IP address, shared secret and ports of the NPS server. Unless using a central NPS, the RADIUS client and RADIUS target will be the same. The shared secret must match the one setup in the RADIUS client section of the NPS server. 

![Radius Authentication](./media/multi-factor-authentication-get-started-server-rdg/radius.png)
