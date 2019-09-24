---
title: Troubleshoot backend health issues in Azure Application Gateway
description: Describes how to troubleshoot backend health issues for Azure Application Gateway
services: application-gateway
author: surajmb
ms.service: application-gateway
ms.topic: article
ms.date: 08/30/2019
ms.author: surmb
---

Troubleshoot backend health issues in Application Gateway
==================================================

Overview
--------

By default, Microsoft Azure Application Gateway probes backend servers to check their health status and whether they're ready to serve requests. Users can also create custom probes to mention the hostname, the path to be probed, and the status codes to be accepted as _healthy_. In each case, if the
backend server doesn't respond successfully, Application Gateway marks the server as _unhealthy_ and stops forwarding requests to the server. After the server starts responding
successfully, it resumes serving the requests.

### How to check backend health

To check the health of your backend pool, you can use the
**Backend Health** page on the Azure portal. Or, you can use [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.network/get-azapplicationgatewaybackendhealth?view=azps-2.6.0), [CLI](https://docs.microsoft.com/cli/azure/network/application-gateway?view=azure-cli-latest#az-network-application-gateway-show-backend-health), or [REST API](https://docs.microsoft.com/rest/api/application-gateway/applicationgateways/backendhealth). To get more information, check the linked article against each method.

The status retrieved by any of these methods can be any one of the following:

- Healthy

- Unhealthy

- Unknown

If the backend health status for a server is healthy, it signifies that Application Gateway will forward the requests
to that server. But if the backend
health for all the servers in a backend pool is unhealthy or unknown, you might encounter problems when you try to access
applications. This article describes the symptoms, cause, and resolution for each of the errors shown.

Backend health status: unhealthy
-------------------------------

If the backend health status is unhealthy, the portal view will resemble the following screenshot:

![Application Gateway Backend Health - Unhealthy](./media/application-gateway-backend-health-troubleshooting/appgwunhealthy.png)

Or if you're using Azure PowerShell, CLI, or Azure REST API query, you'll get a response that resembles the following:
```azurepowershell
PS C:\Users\testuser\> Get-AzApplicationGatewayBackendHealth -Name "appgw1" -ResourceGroupName "rgOne"
BackendAddressPools :
{Microsoft.Azure.Commands.Network.Models.PSApplicationGatewayBackendHealthPool}
BackendAddressPoolsText : [
{
                              "BackendAddressPool": {
                                "Id": "/subscriptions/536d30b8-665b-40fc-bd7e-68c65f816365/resourceGroups/rgOne/providers/Microsoft.Network/applicationGateways/appgw1/b
                          ackendAddressPools/appGatewayBackendPool"
                              },
                              "BackendHttpSettingsCollection": [
                                {
                                  "BackendHttpSettings": {
                                    "TrustedRootCertificates": [],
                                    "Id": "/subscriptions/536d30b8-665b-40fc-bd7e-68c65f816365/resourceGroups/rgOne/providers/Microsoft.Network/applicationGateways/appg
                          w1/backendHttpSettingsCollection/appGatewayBackendHttpSettings"
                                  },
                                  "Servers": [
                                    {
                                      "Address": "10.0.0.5",
                                      "Health": "Healthy"
                                    },
                                    {
                                      "Address": "10.0.0.6",
                                      "Health": "Unhealthy"
                                    }
                                  ]
                                }
                              ]
                            }
                        ]
```
After you receive an "unhealthy" backend server status for all the servers in a backend pool, the requests aren't forwarded to the servers, and Application Gateway returns a "502 Bad Gateway" error to the requesting client. To troubleshoot this issue, check the **Details** column on the **Backend Health** tab.

The message displayed in the **Details** column provides more detailed insights about the issue, and based on those, you can start troubleshooting the issue.

> [!NOTE]
> The default probe request is sent in the format of
\<protocol\>://127.0.0.1:\<port\>/. For example, <http://127.0.0.1/> for
an http probe on port 80. Only HTTP status codes of 200 through 399 are considered healthy. The protocol and destination port are inherited from the HTTP settings. If you want Application Gateway to probe on a different protocol, hostname, or path and to recognize a different status code as healthy, configure a custom probe and associate it with the HTTP settings.

Error messages
------------------------
#### Backend server timeout

**Message:** Time taken by the backend to respond to application
gateway\'s health probe is more than the timeout threshold in the probe
setting.

**Cause:** After Application Gateway sends an HTTP(S) probe request to the
backend server, it waits for a response from the backend server for a configured period. If the backend server doesn't
respond within the configured period (the timeout value), it's marked unhealthy until it starts responding within the configured timeout period again.

**Resolution:** Check why the backend server or application isn't responding within the configured timeout period, and also check the application dependencies. For example, check whether the database has any issues that might trigger the delay in response. If you're aware of the application's behavior and it should respond only after the timeout value, increase the timeout value from the custom probe settings. You need to have a custom probe to change the value of the timeout. If you
want to know how to configure a custom probe, [check the documentation page](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-probe-portal).

To increase the timeout, follow these steps:

1.  Access the backend server directly and check the time taken for the
    server to respond on that page. You can use any tool to access,
    including a browser using the developer tools.

1.  After you've figured out the time taken for the application to respond, click the Health Probes tab and select the probe that is associated to your HTTP settings.

1.  Enter any higher timeout value than the application response time, in seconds.

1.  Save the custom probe settings and check the backend health if it shows as Healthy now.

#### DNS resolution error

**Message:** Application Gateway could not create a probe for this
backend. This usually happens when the FQDN of the backend has not been
entered correctly. 

**Cause:** If the backend pool is of type IP Address/FQDN or App
Service, Application Gateway resolves to the IP address of the FQDN
entered using DNS Server (custom or Azure default) and tries to connect
to the server on the TCP port mentioned in the HTTP Settings. But if
this message is displayed, it suggests that Application Gateway was not
able to successfully resolve the IP address of the FQDN entered.

**Resolution:**

1.  Verify if the FQDN entered in the backend pool is correct and if it
    is a public domain, try to resolve it from your local machine.

1.  If you can resolve the IP address, there could be something wrong
    with the DNS configuration in the VNet.

1.  Check if the VNet is configured with a custom DNS server. If so,
    check on the DNS server on why it is not being able to resolve to
    the IP address of the given FQDN.

1.  If it is Azure default DNS, check with your domain name registrar if
    proper A record or CNAME record mapping has been done.

1.  If the domain is private/internal, try to resolve it from a VM in
    the same VNet and if you are able to resolve to it, restart
    Application Gateway and check again. To restart Application Gateway,
    you need to
    [Stop](https://docs.microsoft.com/powershell/module/azurerm.network/stop-azurermapplicationgateway?view=azurermps-6.13.0)
    and
    [Start](https://docs.microsoft.com/powershell/module/azurerm.network/start-azurermapplicationgateway?view=azurermps-6.13.0)
    using the PowerShell commands given in the respective document
    links.

#### TCP connect error

**Message:** Application gateway could not connect to the backend.
Please check that the backend responds on the port used for the probe.
Also check whether any NSG/UDR/Firewall is blocking access to the Ip and
port of this backend

**Cause:** After the DNS resolution phase, Application Gateway tries to
connect to the backend server on the TCP port that is configured in the
HTTP Settings. If Application Gateway is not able to establish a TCP
session on the port specified, the probe is marked as unhealthy with
this message.

**Solution:** If you see this error, check the following:

1.  Check if you can connect to the backend server on the port mentioned
    in the HTTP Settings using a browser or using PowerShell, for
    example, you can use the command: Test-NetConnection -ComputerName
    www.bing.com -Port 443

1.  If the port mentioned is not the desired port, enter the correct
    port number for Application Gateway to connect to the backend server

1.  If you can't connect on the port from your local machine as well,
    then:

    1.  Check the NSG settings of the backend server's NIC and Subnet and check whether the inbound connections to the configured port are allowed. If they aren't allowed, create a new rule to allow the connections. To learn how to create NSG rules, [check the documentation page](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic#create-security-rules).

    1.  Check the NSG settings of Application Gateway's subnet if outbound public and private traffic is allowed, so that the connection can be made. Check the document linked in (a) to know more about how to create NSG rules.
    ```azurepowershell
            $vnet = Get-AzVirtualNetwork -Name "vnetName" -ResourceGroupName "rgName"
            Get-AzVirtualNetworkSubnetConfig -Name appGwSubnet -VirtualNetwork $vnet
    ```

    1.  Check the UDR settings of Application Gateway and the backend server's subnet for any routing anomalies. Make sure that the UDR isn't directing the traffic away from the backend subnet. For example, check for routes to network virtual appliances or default routes being advertised to the Application Gateway subnet via ExpressRoute/VPN.

    1.  To check the effective routes and rules for an NIC, you can use the following PowerShell commands.
    ```azurepowershell
            Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName "nic1" -ResourceGroupName "testrg"
            Get-AzEffectiveRouteTable -NetworkInterfaceName "nic1" -ResourceGroupName "testrg"
    ```
1.  If you don't find any issues with NSG or UDR, check your backend server for application-related issues due to which clients can't establish a TCP session on the port(s) configured. A few things to check:

    1.  Open command prompt (Win+R -\> cmd) and enter netstat and press
        enter

    1.  Check if the server is listening on the port that is configured.
        For example:
    ```
            Proto Local Address Foreign Address State PID
            TCP 0.0.0.0:80 0.0.0.0:0 LISTENING 4
    ```
    1.  If it's not, check on your web server settings, for example
        site bindings in IIS, server block in NGINX and virtual host in
        Apache

    1.  Check your OS firewall settings to make sure that incoming
        traffic to the port is allowed

#### HTTP status code mismatch

**Message:** Status code of the backend\'s HTTP response did not match
the probe setting. Expected:{HTTPStatusCode0} Received:{HTTPStatusCode1}.

**Cause:** After the TCP connection has been established and SSL
handshake is done (if SSL is enabled), Application Gateway will send the
probe as an HTTP GET request to the backend server. As mentioned above,
the default probe will be to \<protocol\>://127.0.0.1:\<port\>/, and it
considers response status codes in the rage 200-399 as healthy. If the
server returns any other status code, it will be marked as unhealthy
with this message.

**Solution:** Depending on the backend server's response code, you can
take the following steps. A few of the common status codes are listed
here:

| **Error** | **Actions** |
| --- | --- |
| Probe status code mismatch: Received 401 | Check whether the back-end server requires authentication. Application gateway probes can't pass credentials for authentication at this point. Either allow \"HTTP 401\" in a probe status code match or probe to a path where the server does not require authentication. | |
| Probe status code mismatch: Received 403 | Access forbidden. Check whether access to the path is allowed on the back-end server. | |
| Probe status code mismatch: Received 404 | Page not found. Check the hostname path if it is accessible on the back-end server. Change the hostname or path parameter to an accessible value. | |
| Probe status code mismatch: Received 405 | Application Gateway's probe requests use HTTP GET method. Check whether your server allows it. | |
| Probe status code mismatch: Received 500 | Internal server error. Check on the backend server's health and if the services are running. | |
| Probe status code mismatch: Received 503 | Service unavailable. Check on the backend server's health and if the services are running. | |

Or, if you think that the response is legit and you want Application
Gateway to accept other status codes as healthy, you can create a custom
probe. Modifying this will be useful in situations where the backend website needs
authentication and since the probe requests do not carry any user
credentials, they will fail, and an HTTP 401 status code will be returned
by the backend server.

To create a custom probe, follow the steps listed
[here](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-probe-portal).

#### HTTP response body mismatch

**Message:** Body of the backend\'s HTTP response did not match the
probe setting. Received response body does not contain {string}.

**Cause:** When you create a custom probe, you have an option to mark a
backend server healthy by matching a string from the response body. For
example, you can configure Application Gateway to accept "unauthorized"
as a string to match. If the backend server response for the probe
request contains the string **unauthorized**, it will be marked healthy. Otherwise, it will be marked unhealthy with this message.

**Solution:** You can resolve this issue by following thes steps:

1.  Access the backend server locally or from a client machine on the
    probe path and check the response body.

1.  Check Application Gateway custom probe configuration to verify if
    the response body matches with what's configured.

1.  If they don't match, change the probe configuration with the correct
    string value to accept.

You can read more about Application Gateway probe matching
[here](https://docs.microsoft.com/azure/application-gateway/application-gateway-probe-overview#probe-matching).

#### Backend server certificate invalid CA

**Message:** The server certificate used by the backend is not signed by
a well-known Certificate Authority (CA). Whitelist the backend on the
application gateway by uploading the root certificate of the server
certificate used by the backend.

**Cause:** End-to-End SSL with Application Gateway v2 requires the
backend server's certificate to be verified to deem the server healthy.
For an SSL certificate to be trusted, that certificate of the backend
server must have been issued by a CA that is included in the trusted
store of Application Gateway. If the certificate was not issued by a
trusted CA, for example, self-signed certificates, users should upload
the issuer's certificate to Application Gateway.

**Solution:** Follow the steps below to export and upload the trusted
root certificate to Application Gateway (The steps provided
below are for Windows clients)

1.  Sign in to the machine where your application is hosted.

1.  Open Run by pressing Win+R or right-clicking Start button and selecting Run.

1.  Enter certmgr.msc and press Enter. You can also search for
    Certificate Manager in the Start menu.

1.  Locate the certificate, typically in \'Certificates - Current
    User\\Personal\\Certificates\', and open the certificate.

1.  Select the root certificate and select "View Certificate" option.

1.  In the Certificate properties, switch to the Details tab.

1.  In the Details tab, select the "Copy to File" option and save the file in the Base-64 encoded X.509 (.CER) format.

1.  After it's saved, open the Application Gateway HTTP **Settings** page in the Azure portal.

1. Open the HTTP Settings and click "Add Certificate" and locate the certificate file that we saved recently.

1. Click **Save** to save the HTTP settings.

Alternatively, you can export the root certificate from a client machine by directly accessing the server (bypassing Application Gateway) using a browser and exporting the root certificate from the browser.

For detailed steps on extracting and uploading Trusted Root Certificates in Application Gateway, see
[here](https://docs.microsoft.com/azure/application-gateway/certificates-for-backend-authentication#export-trusted-root-certificate-for-v2-sku).

#### Trusted root certificate mismatch

**Message:** The root certificate of the server certificate used by the
backend does not match the trusted root certificate added to the
application gateway. Ensure that you add the correct root certificate to
whitelist the backend

**Cause:** End-to-End SSL with Application Gateway v2 requires the
backend server's certificate to be verified to deem the server healthy.
For an SSL certificate to be trusted, that certificate of the backend
server must have been issued by a CA that is included in the trusted
store of Application Gateway. If the certificate was not issued by a
trusted CA, for example, self-signed certificates, users should upload
the issuer's certificate to Application Gateway.

The certificate that has been uploaded to Application Gateway HTTP settings must match with the root certificate of the backend server
certificate.

**Solution:** If you see the above mentioned error message, it means that there is a
mismatch between the certificate that has been uploaded to the
Application Gateway and the one uploaded to the backend server.

Follow steps 1-11 in the preceding method to upload the right trusted root certificate to Application Gateway.

For detailed steps on extracting and uploading Trusted Root Certificates in Application Gateway, see
[here](https://docs.microsoft.com/azure/application-gateway/certificates-for-backend-authentication#export-trusted-root-certificate-for-v2-sku).
> [!NOTE]
> The error mentioned could also occur if the backend server is not exchanging the complete chain of the cert including the Root -> Intermediate (if applicable) -> Leaf during the TLS handshake. To verify, you can use OpenSSL commands from any client and connect to the backend server using the configured settings in the Application Gateway probe.

For example,
```
OpenSSL> s_client -connect 10.0.0.4:443 -servername www.example.com -showcerts
```
If the output does not show the complete chain of the certificate being returned, export the certificate again with the complete chain including the root certificate and configure that in your backend server. 

CONNECTED(00000188)\
depth=0 OU = Domain Control Validated, CN = \*.example.com\
verify error:num=20:unable to get local issuer certificate\
verify return:1\
depth=0 OU = Domain Control Validated, CN = \*.example.com\
verify error:num=21:unable to verify the first certificate\
verify return:1\
\-\-\-\
Certificate chain\
 0 s:/OU=Domain Control Validated/CN=*.example.com\
   i:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./OU=http://certs.godaddy.com/repository//CN=Go Daddy Secure Certificate Authority - G2\
\-----BEGIN CERTIFICATE-----\
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\
\-----END CERTIFICATE-----

#### Backend certificate invalid common name (CN)

**Message:** The Common Name (CN) of the backend certificate does not
match the host header of the probe.

**Cause:** Application Gateway validates if the Hostname specified in the backend http setting matches that of the Common Name (CN) presented by the backend server’s SSL certificate. This is only a Standard_v2 and WAF_v2 SKU behavior. The Standard and WAF SKU’s SNI is set as the FQDN in the backend pool address.

In the v2 SKU, if there is default probe (no custom probe configured/associated), SNI will be set from the Hostname mentioned in the HTTP Settings or if “Pick hostname from backend address” is mentioned in the HTTP Settings, where the backend address pool contains a valid FQDN.

If there is a Custom probe associated to the HTTP Settings, SNI will be set from the Hostname mentioned in the Custom probe configuration or if “Pick hostname from backend HTTP settings” is checked in the Custom probe, it will be set from the hostname mentioned in the HTTP Settings.

In case, “Pick hostname from backend address” is set in the HTTP Settings, the backend address pool must contain a valid FQDN.

If you see the above mentioned error message, it means that the Common Name (CN) of the backend certificate does not match the hostname configured in the custom probe or the HTTP Settings (in case “Pick Hostname from Backend HTTP Settings” is chosen). If you are using a default probe, the hostname would be set as “127.0.0.1”. If that’s not a desired value, you should create a custom probe and associate it to the HTTP Settings.

**Solution:**

To resolve the issue, follow the steps below:

For Windows:

1.  Sign in to the machine where your application is hosted

1.  Open Run by pressing Win+R or right-clicking Start button and
    selecting Run

1.  Enter certmgr.msc and press Enter. You can also search for
    Certificate Manager in the Start menu.

1.  Locate the certificate, typically in \'Certificates - Current
    User\\Personal\\Certificates\', and open the certificate

1.  In the Details tab, check the Subject of the certificate

1.  Verify the CN of the certificate from the details and enter the same
    in the hostname field of the custom probe or the HTTP Settings (in
    case "Pick Hostname from Backend HTTP Settings" is chosen). If
    that's not the desired hostname for your website, you must get a
    certificate for that domain or enter the right hostname in the
    custom probe/http setting configuration.

For Linux using OpenSSL

1.  Run this command in OpenSSL 
```
openssl x509 -in certificate.crt -text -noout
```

1.  From the properties displayed, find the CN of the certificate and
    enter the same in the hostname field of the http settings. If that's
    not the desired hostname for your website, you must get a
    certificate for that domain or enter the right hostname in the
    custom probe/http setting configuration.

#### Backend certificate is invalid

**Message:** Backend certificate is invalid. Current date is not within
the \"Valid from\" and \"Valid to\" date range on the certificate.

**Cause:** Every certificate comes with a validity and the HTTPS
connection won't be secure unless the server's SSL certificate is valid.
The current data must be within the valid from and valid to range. If
not, the certificate will be considered invalid and it will be a
security concern. At this point, Application Gateway will mark the
backend server as unhealthy.

**Solution:** If your SSL certificate is expired, renew the certificate
with your vendor and update the server settings with the new
certificate. If it is a self-signed certificate, you need to generate a
valid certificate and upload the root certificate to the Application Gateway HTTP settings. To do that, follow these steps:

1.  Open your Application Gateway HTTP Settings in the portal

1.  Select the HTTP Settings that has the expired certificate, select
    Add Certificate and open the new certificate file

1.  Remove the old certificate using the delete icon next to the
    certificate and click Save

#### Certificate verification failed

**Message:** The validity of the backend certificate could not be
verified. To find out the reason, check Open SSL diagnostics for the
message associated with error code {errorCode}

**Cause:** This error occurs when Application Gateway is not able to
verify the validity of the certificate.

**Solution:** To resolve this issue, check the certificate on your
server if it is properly created. For example, you can use
[OpenSSL](https://www.openssl.org/docs/man1.0.2/man1/verify.html) to
verify the certificate and its properties and try reuploading the
certificate to the Application Gateway HTTP settings.

Backend health status: unknown
-------------------------------
If the backend health is shown as Unknown, it will be displayed in the portal like the screenshot below:

![Application Gateway Backend Health - Unknown](./media/application-gateway-backend-health-troubleshooting/appgwunknown.png)

In case the backend health is shown as Unknown, it could be because of one or more of the following reasons:

1.	NSG on the Application Gateway subnet is blocking inbound access to the ports 65503-65534 (v1 SKU) or 65200-65535 (v2 SKU) from “Internet”
1.	UDR on the Application Gateway subnet with default route (0.0.0.0/0) with next hop not as Internet
1.	Default route advertised by ExpressRoute/VPN connection to the VNet over BGP
1.	Custom DNS Server is configured in the VNet that is not able to resolve public domain names
1. 	Application Gateway is in an unhealthy state

**Solution:**

1.	Check if your NSG is blocking access to the ports 65503-65534 (v1 SKU) or 65200-65535 (v2 SKU) from “Internet”

    a.	On the Application Gateway **Overview** tab, select the Virtual Network/Subnet link.

    b.	In the Subnets tab of your Virtual Network, select the subnet where Application Gateway has been deployed.

    c.	Check if there is any NSG configured.

    d.	If there is one, search for that NSG resource in the search tab or under All resources.

    e.	In Inbound Rules section, add an inbound rule to allow Destination Port range 65503-65534 for v1 SKU or 65200-65535 v2 SKU with Source as Any or Internet.

    f.	Click Save and verify if you can view the backend healthy successfully.

    g.	Alternatively, you can do it through [PowerShell/CLI](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group).

1.	Check if your UDR is having a default route (0.0.0.0/0) with next hop not as Internet.
    
    a.	Follow steps 1.a and 1.b to determine your subnet

    b.	Check if there are any UDR configured. If there is one, search for the resource in the search bar or under All resources.

    c.	Check if there are any default routes (0.0.0.0/0) with next hop not as Internet. If it is either Virtual Appliance or Virtual Network Gateway, you need to make sure that your virtual appliance or the on-premises device will be able to properly route the packet back to internet destination without modifying the packet.

    d.	Otherwise, change the next hop to Internet, click Save, and verify the backend health.

1.	Default route advertised by ExpressRoute/VPN connection to the VNet over BGP.

    a.	If you have an ExpressRoute/VPN connection to the VNet over BGP and if you are advertising default route, you need to make sure that the packet is routed back to the internet destination without modifying it.

    b.	You can verify by using “Connection Troubleshoot” option in Application Gateway portal.

    c.	Choose the destination manually as any internet routable IP address like "1.1.1.1" and destination port as anything and check the connectivity.

    d.	If the next hop is Virtual Network Gateway, then there might be a default route advertised over ExpressRoute or VPN.

1.	If there is a custom DNS server configured in the VNet, verify if the server(s) can resolve public domains. Public domain name resolution might be required in scenarios where Application Gateway must reach out to external domains like OCSP servers or to check the certificate’s revocation status, etc.

1.	To verify that Application Gateway is healthy and running, go to Resource Health option in the portal and verify if it is “Healthy”. If you are seeing Unhealthy or Degraded state, [contact support](https://azure.microsoft.com/support/options/).

Next steps
----------

To learn more about Application Gateway diagnostics and logging, see
[here](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics).
