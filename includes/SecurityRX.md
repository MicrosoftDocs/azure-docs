#Azure Security Guidance

##Abstract

When developing applications for Azure, identity and
access are the primary security concerns that you need to keep in mind.
This topic explains the key security concerns related to identity and access in the cloud and how you
can best protect your cloud applications.

##Overview

An application's security is a function of its surface. The more surface
that the application exposes the greater the security concerns. For
example, an application that runs as an unattended batch process exposes
less, from a security perspective, than a publically available website.

When you move to the cloud you gain a certain peace of mind about
infrastructure and networking since these are managed in data centers
with world-class security practices, tools, technology. On the other
hand, the cloud intrinsically exposes more surface area for your
application that can be potentially exploited by attackers. This is
because many cloud technologies and services are exposed as end points
vs. in-memory components. Azure storage, Service Bus, SQL
Database (formerly SQL Azure), and many other services are accessible
via their endpoints over the wire.

In cloud applications more responsibility lays on the shoulders of the
application developers to design, develop, and maintain their cloud
applications to high security standards to keep attackers at bay.
Consider the following diagram (from J.D. Meier's [Azure Security
Notes PDF](http://blogs.msdn.com/b/jmeier/archive/2010/08/03/now-available-azure-security-notes-pdf.aspx)): notice how the infrastructure part is being addressed by the
cloud provider--in our case by Azure--leaving more security work
to the application developers:

![Securing the application][01]

The good news is that all of the security development practices,
principles, and techniques you already know still apply when developing
cloud applications. Consider the following key areas that must be
addressed:

-   All input is validated for type, length, range, and string patterns
    to avoid injection attacks, and all the data your app echoes back is
    properly sanitized.
-   Sensitive data should be protected at rest and on the wire to
    mitigate information disclosure and data tampering threats.
-   Auditing and logging must be properly implemented to mitigate non
    repudiation threats.
-   Authentication and Authorization should be implemented using proven
    mechanisms offered by the platform to prevent identity spoofing and
    elevation of privileges threats.

For a complete list of threats, attacks, vulnerabilities, and
countermeasures refer to patterns & practices' [Cheat Sheet: Web
Application Security Frame](http://msdn.microsoft.com/library/ff649461.aspx) and [Security Guidance for Applications Index](http://msdn.microsoft.com/library/ff650760.aspx).

In the cloud, authentication and access control mechanisms are very
different than those available for on-premises applications. There are
many more authentication and access options offered for cloud
applications that can lead to confusion, and as a result, to flawed
implementations. More confusion is introduced when defining what a cloud
app is. For example, the application could be deployed to the cloud yet
its authentication mechanism might be provided by Active Directory. On
other hand, the application could be deployed on-premises but with
authentication mechanisms in the cloud (for example, by Azure
Active Directory Access Control (previously known as Access Control
Service or ACS)).

##Threats, Vulnerabilities, and Attacks

A threat is a potential bad outcome that you want to avoid such as the
disclosure of sensitive information or a service becoming unavailable.
It is common practice to classify threats by using the acronym "STRIDE":

-   **S**poofing or identity theft
-   **T**ampering with data
-   **R**epudiation of actions
-   **I**nformation disclosure
-   **D**enial of service
-   **E**levation of privileges

Vulnerabilities are bugs that we, as developers, introduce into the code
that make an application exploitable by attackers. For example, sending
sensitive data in clear text makes an information disclosure threat
possible by a traffic sniffing attack.

Attacks are the exploitation of those vulnerabilities to cause harm to
an application. For example, a Cross Site Scripting, or XSS, is an
attack that exploits unsanitized output. Another example is
eavesdropping on the wire to capture credentials sent in clear. These
attacks can lead to an identity spoof threat being realized. To make it
simple consider threats, vulnerabilities, and attacks as bad things.
Consider the following diagrams as a balcony view of the bad things
related to a Web application deployed to Azure (from J.D.
Meier's [Azure Security Notes PDF](http://blogs.msdn.com/b/jmeier/archive/2010/08/03/now-available-azure-security-notes-pdf.aspx)):

![Threats Vulnerabilities and Attacks][02]

You, as a developer, have control over the vulnerabilities. The fewer
vulnerabilities that you introduce, the fewer options that are left to
attacker to exploit.

Identity and access related vulnerabilities leave you open to all
threats in the STRIDE model. For example, an improperly implemented
authentication mechanism may lead to an identity spoof and, as a result,
information disclosure, data tampering, elevated privileges operations,
or even shutting down the service altogether. Consider the following
questions that may point to potential vulnerabilities in your cloud
app's identity and access implementation:

-   Are you sending credentials in clear over the wire to your
    Azure services?
-   Do you store Azure services credentials in clear?
-   Do your Azure services credentials follow strong password
    policies?
-   Do you rely on Azure to verify credentials vs.
    using custom verification mechanisms?
-   Do you limit Azure services authentication sessions or token
    lifetime to a reasonable time window?
-   Do you verify permissions for each Azure entry point of your
    distributed cloud app?
-   Does your authorization mechanism fail securely without exposing
    sensitive information, or without allowing limitless access?

##Countermeasures

The best countermeasure against an attack is by using the identity and
access mechanisms offered by the platform rather than implementing your
own. Consider the following prominent identity and access technologies:

**Windows Identity Foundation (WIF).** WIF is a .NET runtime library
included with the .NET Framework 4.5 (it is also available as separate
download for .NET 3.5/4.0). WIF does the heavy lifting for handling
protocols such as WS-Federation and WS-Trust and tokens handling such as
Security Assertion Markup Language (SAML) so you don't need to write
very complex security-related code in your application. The following
resources provide in-depth information about WIF:

-   [Windows Identity Foundation 4.5 Samples](http://code.msdn.microsoft.com/site/search?f%5B0%5D.Type=SearchText&f%5B0%5D.Value=wif&f%5B1%5D.Type=Topic&f%5B1%5D.Value=claims-based%20authentication) on MSDN Code Gallery.
-   [Windows Identity Foundation 4.5 tools for Visual Studio 11 Beta](http://visualstudiogallery.msdn.microsoft.com/e21bf653-dfe1-4d81-b3d3-795cb104066e) on
    MSDN Code Gallery.
-   [Windows Identity Foundation runtime (.Net 3.5/4.0)](http://www.microsoft.com/download/details.aspx?id=17331) on MSDN.
-   [Windows Identity Foundation 3.5/4.0 samples and Visual Studio
    2008/2010 templates](http://www.microsoft.com/download/details.aspx?displaylang=en&id=4451) on MSDN.

**Azure AD Access Control (previously known as ACS)**. 
Azure AD Access Control is a cloud service that provides Security Token
Service (STS) and allows federation with different identity providers
(IdPs) such as a corporate Active Directory or Internet IdPs such as
Windows Live ID / Microsoft Account, Facebook, Google, Yahoo!, and Open
ID 2.0 identity providers. The following resources provide in-depth
information about Azure AD Access Control:

-   [Access Control Service 2.0](http://msdn.microsoft.com/library/gg429786.aspx) 
-   [Scenarios and Solutions Using ACS](http://msdn.microsoft.com/library/gg185920.aspx)
-   [ACS How To's](http://msdn.microsoft.com/library/windowsazure/gg185939.aspx)
-   [A Guide to Claims-Based Identity and Access Control](http://msdn.microsoft.com/library/ff423674.aspx)
-   [Identity Developer Training Kit](http://www.microsoft.com/download/details.aspx?id=14347)
-   [MSDN-hosted Identity Developer Training Course](http://msdn.microsoft.com/IdentityTrainingCourse)

**Active Directory Federation Services (AD FS).**Active Directory
Federation Services (AD FS) 2.0 provides support for claims-aware
identity solutions that involve Windows Server?? and Active Directory
technology. AD FS 2.0 supports the WS-Trust, WS-Federation, and SAML
protocols. The following resources provide in-depth information about AD
FS:

-   [AD FS 2.0 Content Map](http://social.technet.microsoft.com/wiki/contents/articles/2735.ad-fs-2-0-content-map.aspx)
-   [Web SSO Design][Web SSO Design]
-   [Federated Web SSO Design][Federated Web SSO Design]

**Azure Shared Access Signatures.** Shared Access Signatures
enable you to fine-tune access to a blob or container resource. The
following resources provide in-depth information about Shared Access
Signatures.

-   [Managing Access to Blobs and Containers](http://msdn.microsoft.com/library/ee393343.aspx)
-   [New Storage Feature: Shared Access Signatures](http://blog.smarx.com/posts/new-storage-feature-signed-access-signatures)
-   [Shared Access Signatures Are Easy These Days](http://blog.smarx.com/posts/shared-access-signatures-are-easy-these-days)

##Scenarios Map

This section briefly outlines the key scenarios covered in this topic.
Use it as a map to determine the right identity solution for your
application.

-   **ASP.NET Web Form Application with Federated Authentication.** In
    this scenario you control access to your ASP.NET Web Forms app using
    either Internet identity such as Live ID / Microsoft Account or
    corporate identity managed in Windows Server Active Directory.
-   **WCF (SOAP) Service with Federated Authentication.**In this
    scenario you control access to your WCF (SOAP) service using Service
    Identities managed by Azure AD Access Control.
-   **WCF (SOAP) Service with Federated Authentication, Identities in
    Active Directory.** In this scenario you control access to your WCF
    (SOAP) web service using identities managed by corporate Windows
    Server Active Directory.
-   **WCF (REST) Service With Federated Authentication.**In this
    scenario you control access to your WCF (REST) service using Service
    Identities managed by Azure AD Access Control.
-   **WCF (REST) Service With Live ID / Microsoft Account, Facebook,
    Google, Yahoo!, Open ID.** In this scenario you control access to
    your WCF (REST) service using Internet identity such as Live ID /
    Microsoft Account.
-   **ASP.NET Web App to REST WCF Service Using Shared SWT Token.** In
    this scenario you have distributed application with front end
    ASP.NET web app and downstream REST service and you want to flow end
    user's context through physical tiers.
-   **Role-Based Access Control (RBAC) Authorization In Claims-Aware
    Applications and Services.** In this scenario you want to implement
    authorization logic in your app based on roles.
-   **Claims-Based Authorization In Claims-Aware Applications and
    Services.** In this scenario you want to implement authorization
    logic in your app based on complex authorization rules.
-   **Azure Storage Service Identity and Access Scenarios.**In
    this scenario you need to securely share access to Azure
    storage blobs and containers.
-   **Azure SQL Database Identity and Access Scenarios.**SQL
    Database supports only SQL Server Authentication. Windows
    Authentication (integrated security) is not supported. Users must
    provide credentials (login and password) every time they connect to
    SQL Database.
-   **Azure Service Bus Identity and Access Scenarios.**In this
    scenario you need securely access Azure Service Bus queues.
-   **In-Memory Cache Identity and Access Scenarios.**In this scenario
    you need to securely access data managed by in-memory cache.
-   **Azure Marketplace Identity and Access Scenarios.**In this
    scenario you need to securely access Azure Marketplace
    datasets.

##Azure Identity and Access Scenarios

This section outlines common identity and access scenarios for different
application architectures. Use the Scenarios Map for a quick
orientation.

###ASP.NET Web Form Application with Federated Authentication

In this application architecture scenario your web application may be
deployed to Azure or on-premises. The application requires that
its users will be authenticated by either corporate Active Directory or
Internet identity providers.

To solve this scenarios use Azure AD Access control and Windows
Identity Foundation.

![Azure Active Directory Access control][03]

Refer to the following resources to implement this scenario:

-   [How To: Create My First Claims-Aware ASP.NET Application Using ACS](http://msdn.microsoft.com/library/gg429779.aspx)
-   [How To: Host Login Pages in Your ASP.NET Web Application](http://msdn.microsoft.com/library/gg185926.aspx)
-   [How To: Implement Claims Authorization in a Claims-Aware ASP.NET Application Using WIF and ACS](http://msdn.microsoft.com/library/gg185907.aspx)    
-   [How To: Implement Role Based Access Control (RBAC) in a Claims-Aware
    ASP.NET Application Using WIF and ACS](http://msdn.microsoft.com/library/gg185914.aspx)
-   [How To: Configure Trust Between ACS and ASP.NET Web Applications
    Using X.509 Certificates](http://msdn.microsoft.com/library/gg185947.aspx)
-   [Code Sample: ASP.NET Simple Forms](http://msdn.microsoft.com/library/gg185938.aspx)

###WCF (SOAP) Service with Service Identity

In this application architecture scenario your WCF (SOAP) service may be
deployed to Azure or on-premises. The service is being accessed
as a downstream service by a web application or even by another web
service. You need to control access to it using application specific
identity. Think of it in terms of the type of app pool account that you
used in IIS - although the technology is different, the approaches are
similar in that the service is accessed using an application scope
account vs. end user account.

Use the Service Identity feature in Azure AD Access control.
This is similar to the IIS app pool account you were using when
deploying your apps to Windows Server and IIS. Configure Azure
AD Access Control to issue SAML tokens that will be handled by WIF at
the WCF (SOAP) service.

![WCF (SOAP) Service][04]


Refer to the following resources to implement this scenario:

-   [How To: Add Service Identities with an X.509 Certificate, Password,
    or Symmetric Key](http://msdn.microsoft.com/library/gg185924.aspx)
-   [How To: Authenticate with a Client Certificate to a WCF Service
    Protected by ACS](http://msdn.microsoft.com/library/hh289316.aspx)
-   [How To: Authenticate with a Username and Password to a WCF Service
    Protected by ACS](http://msdn.microsoft.com/library/gg185954.aspx)
-   [Code Sample: WCF Certificate Authentication](http://msdn.microsoft.com/library/gg185952.aspx)
-   [Code Sample: WCF Username Authentication](http://msdn.microsoft.com/library/gg185927.aspx)

###WCF (SOAP) Service With Federated Authentication, Identities In Active Directory

In this application architecture scenario your WCF (SOAP) service may be
deployed to Azure or on-premises. You need to control access to
it by using an identity that is managed by a corporate Windows Server
Active Directory (AD).

Use Azure AD Access Control configured for federation with
Windows Server AD FS. In this case you do not need to configure Service
Identity with Azure AD Access Control. The agent that needs to
access the WCF (SOAP) service provides credentials to AD FS and upon
successful authentication is issued the token by AD FS. The token is
then submitted to Azure AD Access Control and reissued back to
the agent. The agent uses the token to submit request to the WCF (SOAP)
service.

![WCF (SOAP) Service With AD][05]

Refer to the following resources to implement this scenario:

-   [How To: Add Service Identities with an X.509 Certificate, Password,
    or Symmetric Key](http://msdn.microsoft.com/library/gg185924.aspx)
-   [How To: Configure AD FS 2.0 as an Identity Provider](http://msdn.microsoft.com/library/gg185961.aspx)
-   [How To: Use Management Service to Configure AD FS 2.0 as an
    Enterprise Identity Provider](http://msdn.microsoft.com/library/gg185905.aspx)
-   [Code Sample: WCF Federated Authentication With AD FS 2.0
](http://msdn.microsoft.com/library/hh127796.aspx)

###WCF (REST) Service With Service Identities

In this scenario your WCF (REST) service may be deployed to 
Azure or on-premises. The service is accessed as a downstream service by
a web application or by another web service. You need to control access
to it using an application-specific identity Think of it in terms of the
type of app pool account that you used in IIS - although the technology
is different, the approaches are similar in that the service is accessed
using an application scope account vs. end user account.

Use the Service Identity feature in Azure AD Access Control.
Configure Azure AD Access Control to issue Simple Web Token
(SWT) tokens. To handle the SWT token on the REST service side, you can
either implement a custom token handler and plug it into the WIF
pipeline, or you can parse it "manually" without using the WIF
infrastructure.

Consider the following diagram (WIF is optional):

![REST Service][06]

Refer to the following resources to implement this scenario:

-   [How To: Configure Trust Between ACS and WCF Service Using Symmetric
    Keys](http://msdn.microsoft.com/library/gg185958.aspx)
-   [How To: Authenticate to a REST WCF Service Deployed to Azure
    Using ACS](http://msdn.microsoft.com/library/hh289317.aspx)
-   [Code Sample: ASP.NET Web Service](http://msdn.microsoft.com/library/gg983271.aspx)
-   [Code Sample: Windows Phone 7 Application](http://msdn.microsoft.com/library/gg983271.aspx)
-   [REST WCF With SWT Token Issued By Azure Access Control
    Service (ACS)](http://code.msdn.microsoft.com/REST-WCF-With-SWT-Token-123d93c0)

###WCF (REST) Service with Live ID / Microsoft Account, Facebook, Google, Yahoo!, Open ID

In this scenario, your WCF (REST) service can be deployed to 
Azure or on-premises. You need to control access to it using a public
Internet identity, such as Live ID / Microsoft Account or Facebook.

Use Azure AD Access Control to issue SWT tokens. To handle the
SWT token on the REST service side, you can implement a custom token
handler and plug it into a WIF pipeline, or you can parse it "manually"
without using the WIF infrastructure.

It is important to note that in order to implement this scenario, the
application needs to use web browser control to collect end user
credentials. This makes it unsuitable for scenarios in which the REST
service is accessed from an ASP.NET web app. It is only suitable for
scenarios in which the REST service is being accessed by the user's
client application, such as a Windows Phone 7 app or a rich desktop
client. The key reason for popping the web browser control is that
Internet identities don't natively support active profile scenarios (web
services scenario). Internet identities mainly support passive profile
scenarios (web apps) that rely on browser redirects: this is where web
browser control comes handy.

Consider the following diagram (WIF is optional, and thus not shown):

![WIF is optional][07]

Refer to the following resources to implement this scenario:

-   [How To: Authenticate to a REST WCF Service Deployed to Azure Using ACS](http://msdn.microsoft.com/library/hh289317.aspx)
-   [How To: Configure Google as an Identity Provider](http://msdn.microsoft.com/library/gg185976.aspx)
-   [How To: Configure Facebook as an Identity Provider](http://msdn.microsoft.com/library/gg185919.aspx)
-   [How To: Configure Yahoo! as an Identity Provider](http://msdn.microsoft.com/library/gg185977.aspx)
-  [ Code Sample: Windows Phone 7 Application](http://msdn.microsoft.com/library/gg983271.aspx)
-   [REST WCF With SWT Token Issued By Azure Access Control
    Service (ACS)](http://code.msdn.microsoft.com/REST-WCF-With-SWT-Token-123d93c0)


###ASP.NET Web App to REST WCF Service Using Shared SWT Token

In this scenario you have a distributed application with a front-end
ASP.NET web app and a downstream REST service and you want to maintain
the end user's context across physical tiers. This is sometimes needed
when implementing authorization logic or logging based on the end user's
identity in the downstream REST service.

Configure Azure AD Access Control to issue SWT token. The SWT
token is issued to the front-end ASP.NET web app and then shared with
the downstream REST service. In this case, there is only one relying
party configured in Azure AD Access Control. However, there are
several caveats:

-   Since WIF does not provide a SWT token handler out of the box you
    need to implement a custom token handler to be used with the ASP.NET
    web app. You should rely on the heavy lifting that WIF does to
    support the WS-Federation protocol that relies on browser redirects
    vs. implementing it yourself.
-   When implementing a SWT custom token handler, make sure the
    bootstrap token is being addressed to make sure it's retained.
    Otherwise you won't be able to share it and send it to the
    downstream REST service.
-   You don't have to use WIF on a REST service; rather, you can parse
    the token "manually" since there is no need to handle redirects in
    this case.

![ASP.NET Web Application][08]

Refer to the following resources to implement this scenario:

-   [How To: Configure Google as an Identity Provider](http://msdn.microsoft.com/library/gg185976.aspx)
-   [How To: Configure Facebook as an Identity Provider](http://msdn.microsoft.com/library/gg185919.aspx)
-   [How To: Configure Yahoo! as an Identity Provider](http://msdn.microsoft.com/library/gg185977.aspx)
-   [ASP.NET Web App To REST WCF Service Delegation Using Shared SWT
    Token](http://code.msdn.microsoft.com/ASPNET-Web-App-To-REST-WCF-b2b95f82)

###Role-Based Access Control (RBAC) In Claims-Aware Applications and Services

In this scenario you need to implement authorization in your web
application or service based on user roles: user with required roles get
access and those that don't have required roles are denied. Simply put,
your application needs to answer simple question - is the user in role
X?

There are several ways to solve this scenario. You can use Azure
AD Access Control, WIF Claims Authentication Manager,
samlSecurityTokenRequirement mapping, or Customer Role Manager.

WIF is used in all cases. WIF supports the IPrincipal.IsInRole("MyRole")
method. In most of the cases the key is to make sure there is role type
claim with URI of
http://schemas.microsoft.com/ws/2008/06/identity/claims/role in the
token so that WIF can successfully verify role membership when the
IsInRole method is called.

**Azure AD Access Control**. In this implementation the 
Azure AD Access Control claims transformation rule engine is used. Using
the claims transformation rule engine rules you can transform any
incoming claim into a role type claim so that when the token hits the
application or a service WIF can parse this role claim to make sure
IsInRole method call is succesful.

![][09]

**WIF ClaimsAuthenticationManager**. In this implementation use
ClaimsAuthenticationManager as WIF's extensibility point. Using this
approach you transform any arbitrary incoming claims to a role claim
type at the application. The complexity of the transformation is only
limited by the code you write.

![][10]

**samlSecurityTokenRequriement mapping**. In this implementation you use
the samlSecurityTokenRequirement configuration in web.config to tell WIF
which claim types behave as if they were role claim types. For example,
if the token carries a claim of group type, you can map it to role claim
type. You can achieve only simple mappings using this approach.

![][11]

**Custom RoleManager.** In this implementation you implement custom
RoleManger. WIF is used to inspect the incoming claims when implementing
custom RoleManager interface methods such as GetAllRoles().

![][12]

Refer to the following resources to implement this scenario:

-   [How To: Implement Role Based Access Control (RBAC) in a Claims-Aware
    ASP.NET Application Using WIF and ACS](http://msdn.microsoft.com/library/gg185914.aspx)
-   [How To: Implement Token Transformation Logic Using Rules](http://msdn.microsoft.com/library/gg185955.aspx)
-   [Authorization With RoleManager For Claims Aware (WIF) ASP.NET Web
    Applications](http://blogs.msdn.com/b/alikl/archive/2010/11/18/authorization-with-rolemanager-for-claims-aware-wif-asp-net-web-applications.aspx)
-   Code Sample: Using Claims In IsInRole in [Windows Identity Foundation
    SDK](http://www.microsoft.com/downloads/details.aspx?FamilyID=c148b2df-c7af-46bb-9162-2c9422208504)

###Claims-Based Authorization In Claims-Aware Applications and Services

In this scenario you need to implement complex authorization logic in
your web application or service and the IsInRole() method is not
satisfactory for your authorization needs. If your authorization
approach relies on roles then consider implementing role-based access
control outlined in previous section.

Use ClaimsAuthorizationManager as the WIF extensibility point.
ClaimsAuthorizationManager allows external access check calls so that
your application code looks cleaner and more maintainable than when
access checks implemented in the application's code.

![][13]

Refer to the following resources to implement this scenario:

-   [How To: Implement Token Transformation Logic Using Rules](http://msdn.microsoft.com/library/gg185955.aspx)
-   [How To: Implement Claims Authorization in a Claims-Aware ASP.NET
    Application Using WIF and ACS](http://msdn.microsoft.com/library/gg185907.aspx)
-   Code Sample: Claims based Authorization in [Windows Identity
    Foundation SDK](http://www.microsoft.com/downloads/details.aspx?FamilyID=c148b2df-c7af-46bb-9162-2c9422208504)


##Azure Storage Service Identity and Access Scenarios

In this scenario you need to securely share access to Azure
storage blobs and containers.

Use Shared Access Signatures. To access your storage service account
from your own application, use the shared hash that is available through
Azure portal when you configure and manage your storage service
accounts. When you want to give someone else access to the blobs and
containers in your storage service account use Shared Access Signatures
URL's.

Pay special attention to securely managing the information to avoid its
exposure; also, pay special attention to the lifetime of the Shared
Access Signatures.

![][14]

Refer to the following resources to solve this scenario

-   [Managing Access to Blobs and Containers](http://msdn.microsoft.com/library/ee393343.aspx)
-   [New Storage Feature: Shared Access Signatures](http://blog.smarx.com/posts/new-storage-feature-signed-access-signatures)
-   [Shared Access Signatures Are Easy These Days](http://blog.smarx.com/posts/shared-access-signatures-are-easy-these-days)


##Azure SQL Database Identity and Access Scenarios

SQL Database only supports SQL Server Authentication. Windows
Authentication (integrated security) is not supported. Users must
provide credentials (login and password) every time they connect to a
SQL Database. Pay special attention when managing your username and
password to avoid information disclosure.

![][15]

Refer to the following resources to solve this scenario:

-   [Security Guidelines and Limitations (SQL Database)](http://msdn.microsoft.com/library/windowsazure/ff394108.aspx#authentication)
-   [How to: Connect to SQL Database Using sqlcmd](http://msdn.microsoft.com/library/windowsazure/ee336280.aspx)
-   [How to: Connect to SQL Database Using ADO.NET](http://msdn.microsoft.com/library/windowsazure/ee336243.aspx)
-   [How to: Connect to SQL Database Through ASP.NET](http://msdn.microsoft.com/library/windowsazure/ee621781.aspx)
-   [How to: Connect to SQL Database Through WCF Data Services](http://msdn.microsoft.com/library/windowsazure/ee621789.aspx)
-  [ How to: Connect to SQL Database Using PHP](http://msdn.microsoft.com/library/windowsazure/ff394110.aspx)
-   [How to: Connect to SQL Database Using JDBC](http://msdn.microsoft.com/library/windowsazure/gg715284.aspx)
-   [How to: Connect to SQL Database Using the ADO.NET Entity Framework](http://msdn.microsoft.com/library/windowsazure/ff951633.aspx)

##Azure Service Bus Identity and Access Scenarios

The Service Bus and Azure AD Access Control have a special
relationship in that each Service Bus service namespace is paired with a
matching Access Control service namespace of the same name, with the
suffix "-sb". The reason for this special relationship is in the way
that Service Bus and Access Control manage their mutual trust
relationship and the associated cryptographic secrets. Refer to the
resources listed below for more details.

![][16]

Refer to the following resources to solve this scenario:

-   [Securing Service Bus with ACS](http://channel9.msdn.com/posts/Securing-Service-Bus-with-ACS) (Video)
-   [Securing Service Bus with ACS](https://skydrive.live.com/view.aspx?cid=123CCD2A7AB10107&resid=123CCD2A7AB10107%211849) (Slides)
-   [Service Bus Authentication and Authorization with the Access Control
    Service](http://msdn.microsoft.com/library/hh403962.aspx)

##In-Memory Cache Identity and Access Scenarios

In-memory cache (formerly known as Azure Cache) relies on
Azure AD Access Control for authentication. It uses shared keys
available through the management portal. Use the keys in your code or
configuration files when accessing the cache. Be sure to store the keys
securely so as to avoid information disclosure.

![][17]


Refer to the following resources to solve this scenario:

-   [How to: Configure a Cache Client Programmatically for Azure
    Caching](http://msdn.microsoft.com/library/windowsazure/gg618003.aspx)
-   [How to: Configure a Cache Client using the Application Configuration
    File for Azure Caching](http://msdn.microsoft.com/library/windowsazure/gg278346.aspx)
-   [Azure Service Bus and Caching Samples](http://msdn.microsoft.com/library/ee706741.aspx) (Caching Samples
    section)

##Azure Marketplace Identity and Access Scenarios

Every access to an Azure Marketplace dataset, whether free or
paid, must authenticate the user before access is granted. When you
create an application the authentication process must be included in
your code. Consider the following common scenarios:

###I Access My Dataset

In this scenario you are building an application that consumes datasets
in your Marketplace subscription. You are the user of the application.
The application can be deployed either to Azure, on-premises, or Marketplace.

Use the shared key that's available through your Marketplace
subscription. You obtain the shared key using the Marketplace portal.

![][18]

Refer to the following resources to solve this scenario:

-   [Use HTTP Basic Auth in your Marketplace App](http://msdn.microsoft.com/library/gg193417.aspx)

###Users Access My Datasets

In this scenario you are building an application that allows users to
access your dataset. The application can be deployed on Azure,
on-premises, or Marketplace.

To solve this scenario, use OAuth delegation. Users will be prompted to
provide their Live ID / Microsoft Account credentials, and then they
will be taken through the consent process.

![][19]

Refer to the following resources to solve this scenario:

-   [OAuth Web Client Example](http://go.microsoft.com/fwlink/?LinkId=219162)
-   [OAuth Rich Client Example](http://go.microsoft.com/fwlink/?LinkId=219163)

###Application Access Marketplace API

In this scenario you are building an application that accesses the
Marketplace API. The Marketplace API requires authentication to
successfully accomplish calls to it. The application is deployed to
Azure Marketplace.

![][20]

Consult the Marketplace publishing kit for details about the
authentication implementation.

Refer to the following resources to solve this scenario:

-   [Download the App Publishing Kit](http://go.microsoft.com/fwlink/?LinkId=221323)
-   [Introduction to Azure Marketplace for Applications](https://datamarket.azure.com/)

##Security Knobs

This section outlines security knobs for Windows Identity Foundation and
Azure AD Access Control. Use it as a basic security checklist
for these technologies when designing and deploying your application.

###Windows Identity Foundation

The following are key security knobs of WIF. The information below is a
digest from [WIF Design Considerations](http://msdn.microsoft.com/library/ee517298.aspx) and [Windows Identity Foundation
(WIF) Security for ASP.NET Web Applications - Threats & Countermeasures](http://blogs.msdn.com/b/alikl/archive/2010/12/02/windows-identity-foundation-wif-security-for-asp-net-web-applications-threats-amp-countermeasures.aspx)
.

-   **IssuerNameRegistry**. Specifies trusted Security Token Services
    (STS's). Make sure only trusted STS are listed.
-   **cookieHandler requireSsl="true"**. Specifies whether session
    cookies transferred over the SSL protocol.
-   **wsFederation's requireHttps="true"**. Specifies whether the
    federation protocol communication with identity provider performed
    over SSL protocol.
-   **tokenReplayDetection enabled="true"**. Specifies whether token
    replay detection feature is enabled. Be aware that this feature
    creates server affinity as it manages local copies of used tokens.
-   **audienceUris**. Specifies intended audience of the token. If your
    application receives a token that was not intended for your app it
    will be rejected by WIF.
-   **requestValidation** and **httpRuntime requestValidationType**.
    Enables/disables ASP.NET validation feature. See guidance as
    outlined in [Windows Identity Foundation (WIF): A Potentially
    Dangerous Request.Form Value Was Detected from the Client](http://social.technet.microsoft.com/wiki/contents/articles/1725.windows-identity-foundation-wif-a-potentially-dangerous-request-form-value-was-detected-from-the-client-wresult-t-requestsecurityto.aspx)

###Azure AD Access Control

Consider the following security knobs in Azure AD Access Control
deployment. The information below is a digest from [ACS Security
Guidelines](http://msdn.microsoft.com/library/gg185962.aspx) and [Certificates and Keys Management Guidelines](http://msdn.microsoft.com/library/hh204521.aspx).

-   **STS tokens expiration**. Use Azure AD Access Control
    management portal to set aggressive token expiration.
-   **Data validation when using the Error URL feature**. Azure
    AD Access Control Error URL feature requires anonymous access to the
    app's page where it sends error messages. Assume all data coming to
    this page as dangerous from untrusted source.
-   **Encrypting tokens for highly sensitive scenarios**. To mitigate
    threat of information disclosure that available in the token
    consider encrypting the tokens.
-   **Encrypting cookies using RSA when deploying to Azure**.
    WIF encrypts cookies using DPAPI by default. It creates server
    affinity and may result in exceptions when deployed to web farm and
    Azure environments. Use RSA instead in web farm and 
    Azure scenarios.
-   **Token signing certificates**. Renew token signing certificates
    periodically to avoid denial of service. Azure AD Access
    Control signs all security tokens it issues. X.509 certificates are
    used for signing when you build an application that consumes SAML
    tokens issued by ACS. When signing certificates expire you will
    receive errors when trying to request a token.
-   **Token signing keys**. Renew token signing keys periodically to
    avoid denial of service. Azure AD Access Control signs all
    security tokens it issues. 256-bit symmetric signing keys are used
    when you build an application that consumes SWT tokens issued by
    ACS. When signing keys expire you will receive errors when trying to
    request a token.
-   **Token encryption certificates**. Renew token encryption
    certificates periodically to avoid denial of service. Token
    encryption is required if a relying party application is a web
    service using proof-of-possession tokens over the WS-Trust protocol,
    in other cases token encryption is optional. When encryption
    certificates expire you will receive errors when trying to request a
    token.
-   **Token decryption certificates**. Renew token decryption
    certificates periodically to avoid denial of service. Azure
    AD Access Control can accept encrypted tokens from WS-Federation
    identity providers (for example, AD FS 2.0). An X.509 certificate
    hosted in Azure AD Access Control is used for decryption.
    When decryption certificates expire you will receive errors when
    trying to request a token.
-   **Service identity credentials**. Renew Service Identity credentials
    periodically to avoid denial of service. Service identities use
    credentials that are configured globally for your Azure AD
    Access Control namespace that allow applications or clients to
    authenticate directly with Azure AD Access Control and
    receive a token. There are three credential types that Azure
    AD Access Control service identity can be associated with: Symmetric
    key, Password, and X.509 certificate. You will start receiving
    exception when the credentials are expired.
-   **Azure AD Access Control Management Service account
    credentials**. Renew Management service credentials periodically to
    avoid denial of service. The Azure AD Access Control
    Management Service is a key component that allows you to
    programmatically manage and configure settings for your 
    Azure AD Access Control namespace. There are three credential types
    that the Management service account can be associated with. These
    are symmetric key, password, and an X.509 certificate. You will
    start receiving exception when the credentials are expired.
-   **WS-Federation identity provider signing and encryption
    certificates**. Query for WS-Federation identity provider's
    certificate validity to avoid denial of service. WS-Federation
    identity provider certificate is available through its metadata.
    When configuring WS-Federation identity provider, such as AD FS, the
    WS-Federation signing certificate is configured through
    WS-Federation metadata available via URL or as a file. After the
    WS-Federation identity provider configured use Azure AD
    Access Control management service to query it for its certificates
    validness. When the certificate expires you will start receiving
    exceptions.

##Shared Hosting Using Azure Websites

All scenarios and solutions outlined in this topic are valid when the
application is hosted on Azure Websites.

##Azure Virtual Machines

All scenarios and solutions outlined in this topic are valid when the
application is hosted on Azure Virtual Machines.

##Resources

-   [Identity Developer Training Kit](http://go.microsoft.com/fwlink/?LinkId=214555)
-   [MSDN-hosted Identity Developer Training Course](http://go.microsoft.com/fwlink/?LinkId=214561)
-   [A Guide to Claims-based Identity and Access Control](http://go.microsoft.com/fwlink/?LinkId=214562)
-   [Access Control Service](http://msdn.microsoft.com/library/windowsazure/gg429786.aspx)
-   [ACS How To's](http://msdn.microsoft.com/library/windowsazure/gg185939.aspx)
-   [Secure Azure Web Role ASP.NET Web Application Using Access Control Service v2.0](http://social.technet.microsoft.com/wiki/contents/articles/2590.aspx)
-   [Azure AD Access Control Service (ACS) Academy Videos](http://social.technet.microsoft.com/wiki/contents/articles/2777.aspx)
-   [Microsoft Security Development Lifecycle](http://www.microsoft.com/security/sdl/default.aspx)
-   [SDL Threat Modeling Tool 3.1.8](http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=2955)
-   [Security and Privacy Blogs](http://www.microsoft.com/about/twc/en/us/blogs.aspx)
-   [Security Response Center](http://www.microsoft.com/security/msrc/default.aspx)
-   [Security Intelligence Report](http://www.microsoft.com/security/sir/)
-   [Security Development Lifecycle](http://www.microsoft.com/security/sdl/default.aspx)
-   [Security Developer Center (MSDN)](http://msdn.microsoft.com/security/)


[01]:./media/SecurityRX/01_SecuringTheApplication.gif
[02]:./media/SecurityRX/02_ThreatsVulnerabilitiesandAttacks.gif
[03]:./media/SecurityRX/03_WindowsAzureADAccesscontrol.gif
[04]:./media/SecurityRX/04_WCF(SOAP)Service.gif
[05]:./media/SecurityRX/05_AzureADAccessControl.gif
[06]:./media/SecurityRX/06_RESTService.gif
[07]:./media/SecurityRX/07_WIFisOptional.gif
[08]:./media/SecurityRX/08_ASPNETWebApptoREST.gif
[09]:./media/SecurityRX/09_RBAC.gif
[10]:./media/SecurityRX/10_WIFClaimsAuthenticationManager.gif
[11]:./media/SecurityRX/11_SecurityTokenRequriementmapping.gif
[12]:./media/SecurityRX/12_CustomRoleManager.gif
[13]:./media/SecurityRX/13_ClaimsAuthorizationManager.gif
[14]:./media/SecurityRX/14_WindowsAzurestorage.gif
[15]:./media/SecurityRX/15_SQLAzureIdentityandAccessScenarios.gif
[16]:./media/SecurityRX/16_WindowsAzureServiceBusIdentity.gif
[17]:./media/SecurityRX/17_WindowsAzureCacheIdentity.gif
[18]:./media/SecurityRX/18_IAccessMyDataset.gif
[19]:./media/SecurityRX/19_UsersAccessMyDatasets.gif
[20]:./media/SecurityRX/20_ApplicationAccessMarketplaceAPI.gif

[Web SSO Design]: http://technet.microsoft.com/library/dd807033(WS.10).aspx
[Federated Web SSO Design]: http://technet.microsoft.com/library/dd807050(WS.10).aspx
