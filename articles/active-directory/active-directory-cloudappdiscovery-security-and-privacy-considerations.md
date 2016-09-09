<properties
	pageTitle="Cloud App Discovery Security and Privacy Considerations | Microsoft Azure"
	description="This topic describes the security and privacy considerations related to Cloud App Discovery."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="markusvi"/>

# Cloud App Discovery Security and Privacy Considerations

Microsoft is committed to protecting your privacy and securing your data, while delivering software and services that help you manage the security of your organization. <br>
We recognize that when you entrust your data to others, that trust requires rigorous security engineering investments and expertise to back it.
Microsoft adheres to strict compliance and security guidelines from secure software development lifecycle practices to operating a service. <br>
Securing and protecting data is a top priority at Microsoft.

This topic explains how data is collected, processed, and secured within Azure Active Directory Cloud App Discovery




##Overview

Cloud App Discovery is a feature of Azure AD and is hosted in Microsoft Azure. <br>
The Cloud App Discovery endpoint agent is used to collect application discovery data from IT managed machines. <br>
The collected data is sent securely over an encrypted channel to the Azure AD Cloud App Discovery service. <br>
The Cloud App Discovery data for an organization is then visible in the Azure portal. <br>


<center>![How Cloud App Discovery Works](./media/active-directory-cloudappdiscovery-security-and-privacy-considerations/cad01.png) </center> <br>


The following sections follow the flow of information and describe how it is secured as it moves from your organization to the Cloud App Discovery service and ultimately to the Cloud App Discovery portal.



## Collecting data from your organization

In order to use Azure Active Directory’s Cloud App discovery feature to get insights into the applications used by employees in your organization, you need to first deploy the Azure AD Cloud App Discovery endpoint agent to machines in your organization.

Administrators of the Azure Active Directory tenant (or their delegate) can download the agent installation package from the Azure portal. The agent can either be manually installed or installed across multiple machines in the organization using SCCM or Group Policy.

For further instructions on deployment options, see [Cloud App Discovery Group Policy Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30965.cloud-app-discovery-group-policy-deployment-guide.aspx).
<br>

### Data collected by the agent

The information outlined in the list below is collected by the agent when a connection is made to a Web application. The information is only collected for those applications that the administrator has configured for discovery. <br>
You can edit the list of cloud apps that the agent monitors through the Cloud App Discovery blade in the Microsoft [Azure portal](https://portal.azure.com/), under **Settings**->**Data Collection**->**App Collection list**. For more details, see [Getting Started With Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/30962.getting-started-with-cloud-app-discovery.aspx)
<br>
**Information Category**: User information <br>
**Description**: <br>
The Windows user name of the process that made a request to the target Web application (e.g.: DOMAIN\username) as well as the Windows Security Identifier (SID) of the user.


**Information Category**: Process information <br>
**Description**: <br>
The name of the process that made the request to the target Web application (e.g.: “iexplore.exe”)

**Information Category**: Machine information <br>
**Description**: <br>
The machine NetBIOS name on which the agent is installed.

**Information Category**: App traffic information <br>
**Description**: <br>

The following connection information:

- The source (local computer) and destination IP addresses and port numbers

- The public IP address of the organization through which the request goes out.

- The time of the request

- The volume of traffic sent and received

- The IP version (4 or 6)

- For TLS connections only: The target host name from either the Server Name Indication extension or the server certificate.

The following HTTP information:

- Method (GET, POST, etc.)

- Protocol (HTTP/1.1, etc.)

- User agent string

- Hostname

- Target URI (excluding query string)

- Content type information

- Referrer URL information (excluding query string)



> [AZURE.NOTE] The HTTP information above is collected for all non-encrypted connections.
 For TLS connections, this information is only captured when the ‘Deep Inspection’ setting is turned on in the portal. The setting is ‘ON’ by default.
For more details, see below, and [Getting Started With Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/30962.getting-started-with-cloud-app-discovery.aspx)


In addition to the data that the agent collects about the network activity, it also collects anonymous information about the software and hardware configuration, error reports, and information about how the agent is being used.

<br><br>
### How the agent works

The agent installation includes two components:

- A user-mode component

- A kernel-mode driver component (Windows Filtering Platform driver)



When the agent is first installed it stores a machine-specific trusted certificate on the machine which it then uses to establish a secure connection with the Cloud App Discovery service. <br>
The agent periodically retrieves policy configuration from the Cloud App Discovery service over this secure connection. <br>
The policy includes information about which cloud applications to monitor and whether auto-updating should be enabled, among other things.

As Web traffic is sent and received on the machine from Internet Explorer and Chrome, the Cloud App Discovery agent analyzes the traffic and extracts the relevant metadata (see the **Data collected by the agent** section above). <br>
Every minute, the agent uploads the collected metadata to the Cloud App Discovery service over an encrypted channel.

The driver component intercepts the encrypted traffic and inserts itself into the encrypted stream. More details in the **Intercepting data from encrypted connections (Deep inspection)** section below.


### Respecting user privacy

Our goal is to provide administrators the tools to set the balance between detailed optics into application usage and user privacy as appropriate for their organization. To that end, we provide the following knobs in the settings page in the Portal:

- **Data Collection**: Administrators can choose to specify which applications or application categories they want to get discovery data on.

- **Deep Inspection**: Administrators can chose to specify if the agent collects HTTP traffic for SSL/TLS connections (aka **'Deep Inspection'**). More on this in the next section.

- **Consent Options**: Administrators can use the Cloud App Discovery portal to choose whether to notify users of the data collection by the agent, and whether to require user consent before the agent starts collecting user data.

The Cloud App Discovery endpoint agent only collects the information described in the **Data collected by the agent** section above.


### Intercepting data from encrypted connections (Deep inspection)
As we mentioned earlier, administrators can configure the agent to monitor data from encrypted connections ('deep inspection'). TLS ([Transport Layer Security](https://msdn.microsoft.com/library/windows/desktop/aa380516%28v=vs.85%29.aspx)) is one of the most common protocols in use on the Internet today. By encrypting communication with TLS, a client can establish a secure and private communication channel with a web server; TLS provides essential protection for passing authentication credentials and prevent the disclosure of sensitive information.

While the end-to-end secure encrypted channel provided by TLS enables important security and privacy protection, the protocol is often abused for malicious or nefarious purposes. So much so, in fact, that TLS is often referred to as the “universal firewall-bypass protocol”. The root of the problem is that most firewalls are unable to inspect TLS communication because the application-layer data is encrypted with SSL. Knowing this, attackers frequently leverage TLS to deliver malicious payloads to a user confident that even the most intelligent application-layer firewalls are completely blind to TLS and must simply relay TLS communication between hosts. End users frequently leverage TLS to bypass access controls enforced by their corporate firewalls and proxy servers, using it to connect to public proxies and for tunneling non-TLS protocols through the firewall that might otherwise be blocked by policy.

Deep inspection allows the Cloud App Discovery agent to act as a trusted man-in-the-middle. When a client request is made to access an HTTPS protected resource, the Endpoint Agent driver intercepts the connection and establishes a new connection to the destination server to retrieves its SSL certificate on behalf of the client. The agent then verifies that the certificate can be trusted (by checking that it was not revoked, and performing other certificate checks), and if these pass, the Endpoint Agent then copies the information from the server certificate and creates its own server certificate -- known as an interception certificate -- using that information. The interception certificate is signed on-the-fly by the endpoint agent with a root certificate, which is installed in the Windows trusted certificate store. This self-signed root certificate is marked non-exportable and is ACL’d to administrators. It is intended to never leave the machine on which it was created. When the end-user’s client application receives the interception certificate, it will trust it because it can successfully validate the certificate chain all the way to the root certificate. This process is mostly transparent from an end-user’s point of view with a few caveats as described below.

By enabling deep inspection, the Cloud App Discovery Endpoint Agent can decrypt and inspect TLS encrypted communications, allowing the service to reduce noise and provide insights about the usage of the encrypted cloud apps.

#### A word of caution
Before turning on deep inspection, it is strongly suggested that you communicate your intentions to your legal and HR departments and obtain their consent. Inspecting end user’s private encrypted communications can be a sensitive subject, for obvious reasons. Before a production roll-out of deep inspection, make certain that your corporate security and acceptable use policies have been updated to indicate that encrypted communication will be inspected. User notification and exemption of sites deemed sensitive (e.g. banking and medical sites) may also be necessary if you configure Cloud App Discovery to monitor them. As mentioned above, administrators can use the Cloud App Discovery portal to choose whether to notify users of the data collection by the agent, and whether to require user consent before the agent starts collecting user data.

### Known issues and drawbacks
There are a few cases where TLS interception may impact the end user experience:

- Extended Validation (EV) certificates render the address bar of the web browser green to act as a visual clue that you are visiting a trusted web site. TLS inspection cannot duplicate EV in the certificate it issues to the client, so web sites that use EV certificates will work normally but the address bar will not display green.  

- Public key pinning (also known as certificate pinning) are designed to help protect users from man-in-the-middle attacks and rogue certificate authorities. When the root certificate for a pinned site does not match one of the known good CA's, the browser rejects the connection with an error. Since TLS interception is, in fact, a man-in-the-middle, these connections will fail.

- If users click the lock icon in the browser address bar browser to inspect the site information, they will not see a chain ending in the certificate authority used to sign the website certificate, but instead a certificate chain ending with the Windows trusted certificate store.

To reduce the occurrences of these issues, we keep track of cloud services and client applications known to use extended validation or public key pinning and instruct the Endpoint Agent to avoid intercepting impacted connections. Even in these cases, however, you will still receive reports of the use of these cloud apps and the volume of data being transferred, but since they are not deep inspected, no details about how the apps were used will be available.


## Sending data to Cloud App Discovery

Once metadata has been collected by the agent, it is cached on the machine for up to one minute or until the cached data reaches a size of 5MB. It is then compressed and sent over a secure connection to the Cloud App Discovery service.

If the agent is unable to communicate with the Cloud App Discovery service for any reason, the collected metadata is stored in a local file cache that can only be accessed by privileged users on the machine (such as the Administrators group). <br>
The agent automatically attempts to resend the cached metadata until it has successfully been received by the Cloud App Discovery service.



## Receiving the data at the service end

The agents authenticate to the Cloud App Discovery service using the machine specific client authentication certificate referenced above and forwards data over an encrypted channel. <br>
The Cloud App Discovery service’s analytics pipeline processes metadata for each customer separately by logically partitioning it through all stages of the analytics pipeline.
The analyzed metadata drives the various reports in the portal.

The unprocessed metadata and the analyzed metadata are stored for up to 180 days. In addition, customers can choose to capture the analyzed metadata in an Azure blob storage account of their choosing.
This is useful for offline analysis of metadata as well as longer retention of the data.

## Accessing the data using the Azure portal

In an effort to keep the metadata collected secure, by default only global administrators of the tenant have access to the Cloud App Discovery feature in the Azure portal. <br>
However, administrators can choose to delegate this access to other users or groups.



> [AZURE.NOTE] For more details, see [Getting Started With Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/30962.getting-started-with-cloud-app-discovery.aspx)

<br>
Any user accessing the data in the portal, must be licensed with an Azure AD Premium license.



##Additional Resources


* [How can I discover unsanctioned cloud apps that are used within my organization](active-directory-cloudappdiscovery-whatis.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
