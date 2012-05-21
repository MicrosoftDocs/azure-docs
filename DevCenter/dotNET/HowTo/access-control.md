<properties umbraconavihide="0" pagetitle="Access Control - How To - .NET - Develop" metakeywords="Azure Access Control Service, Azure ACS, Azure authentication, Azure authentication LiveID, Azure authentication Google, Azure authentication Facebook, Azure authentication .NET, Azure authentication C#" metadescription="Learn how to use Windows Azure Access Control Service (ACS) in your Windows Azure application to authenticate users from identity providers like Windows Live, Google, or Facebook when they try to gain access to a web application." linkid="dev-net-how-to-access-control" urldisplayname="Access Control" headerexpose="" footerexpose="" disquscomments="0"></properties>

# How to Authenticate Web Users with Windows Azure Access Control Service

This guide shows you how to use Windows Azure Access Control Service
(ACS) to authenticate users from identity providers like Windows Live,
Google, or Facebook when they try to gain access to a web application.

## Table of Contents

-   [What is ACS?][]
-   [Concepts][]
-   [Prerequisites][]
-   [Create an ASP.NET Web Application][]
-   [Create an ACS Namespace][]
-   [Add Identity Providers][]
-   [Add a Relying Party Application][]
-   [Create Rules][]
-   [Review the Application Integration Page][]
-   [Configure Trust between ACS and Your ASP.NET Web Application][]
-   [Test the Integration between ACS and Your ASP.NET Web
    Application][]
-   [What's Next][]

## <a name="what-is"> </a>What is ACS?

Most developers are not identity experts and generally do not want to
spend time developing authentication and authorization mechanisms for
their applications and services. ACS is a Windows Azure service that
provides an easy way of authenticating users who need to access your web
applications and services without having to factor complex
authentication logic into your code.

The following features are available in ACS:

-   Integration with Windows Identity Foundation (WIF).
-   Support for popular web identity providers (IPs) including Windows
    Live ID, Google, Yahoo, and Facebook.
-   Support for Active Directory Federation Services (AD FS) 2.0.
-   An Open Data Protocol (OData)-based management service that provides
    programmatic access to ACS settings.
-   A Management Portal that allows administrative access to the ACS
    settings.

For more information about ACS, see [Access Control Service 2.0][].

## <a name="concepts"> </a>Concepts

Windows Azure ACS is built on the principals of claims-based identity -
a consistent approach to creating authentication mechanisms for
applications running on-premises or in the cloud. Claims-based identity
provides a common way for applications and services to acquire the
identity information they need about users inside their organization, in
other organizations, and on the Internet.

To complete the tasks in this guide, you should understand the following
concepts:

**Client** - In the context of this how-to guide, this is a browser that
is attempting to gain access to your web application.

**Relying party (RP) application** - An RP application is a web site or
service that outsources authentication to one external authority. In
identity jargon, we say that the RP trusts that authority. This guide
explains how to configure your application to trust ACS.

**Token** - A token is a collection of security data that is usually
issued upon successful authentication of a user. It contains a set of
*claims*, attributes of the authenticated user. A claim can represent a
user's name, an identifier for a role a user belongs to, a user's age,
and so on. A token is usually digitally signed, which means it can
always be sourced back to its issuer, and its content cannot be tampered
with. A user gains access to a RP application by presenting a valid
token issued by an authority that the RP application trusts.

**Identity Provider (IP)** - An IP is an authority that authenticates
user identities and issues security tokens. The actual work of issuing
tokens is implemented though a special service called Security Token
Service (STS). Typical examples of IPs include Windows Live ID,
Facebook, business user repositories (like Active Directory), and so on.
When ACS is configured to trust an IP, the system will accept and
validate tokens issued by that IP. ACS can trust multiple IPs at once,
which means that when your application trusts ACS, you can instantly
offer your application to all the authenticated users from all the IPs
that ACS trusts on your behalf.

**Federation Provider (FP)** - IPs have direct knowledge of users,
authenticate them using their credentials and issue claims about what
they know about them. A Federation Provider (FP) is a different kind of
authority: rather than authenticating users directly, it acts as an
intermediary and brokers authentication between one RP and one or more
IPs. Both IPs and FPs issue security tokens, hence they both use
Security Token Services (STS). ACS is one FP.

**ACS Rule Engine** - The logic used to transform incoming tokens from
trusted IPs to tokens meant to be consumed by the RP is codified in form
of simple claims transformation rules. ACS features a rule engine that
takes care of applying whatever transformation logic you specified for
your RP.

**ACS Namespace** - A namespace is a top level partition of ACS that you
use for organizing your settings. A namespace holds a list of IPs you
trust, the RP applications you want to serve, the rules that you expect
the rule engine to process incoming tokens with, and so on. A namespace
exposes various endpoints that will be used by the application and the
developer to get ACS to perform its function.

The following figure shows how ACS authentication works with a web
application:

![][]

1.  The client (in this case a browser) requests a page from the RP.
2.  Since the request is not yet authenticated, the RP redirects the
    user to the authority that it trusts, which is ACS. The ACS presents
    the user with the choice of IPs that were specified for this RP. The
    user selects the appropriate IP.
3.  The client browses to the IP's authentication page, and prompts the
    user to log on.
4.  After the client is authenticated (for example, the identity
    credentials are entered), the IP issues a security token.
5.  After issuing a security token, the IP redirects the client to ACS
    and the client sends the security token issued by the IP to ACS.
6.  ACS validates the security token issued by the IP, inputs the
    identity claims in this token into the ACS rules engine, calculates
    the output identity claims, and issues a new security token that
    contains these output claims.
7.  ACS redirects the client to the RP. The client sends the new
    security token issued by ACS to the RP. The RP validates the
    signature on the security token issued by ACS, validates the claims
    in this token, and returns the page that was originally requested.

## <a name="pre"> </a>Prerequisites

To complete the tasks in this guide, you will need the following:

-   Microsoft Visual Studio 2010
-   [Windows Identity Foundation][]
-   [Windows Identity Foundation SDK][]
-   An active [Windows Azure account][]

## <a name="create-web-app"> </a>Create an ASP.NET Web Application

To demonstrate how ACS does authentication, create a simple ASP.NET web
application, which you will later set up as a Relying Party (RP)
application.

1.  Start Visual Studio 2010.
2.  In Visual Studio, click **File**, and then click **New Project**.
3.  In New Project window, select**Visual C\#/Web** template, and then
    select **ASP.NET Empty Web Application**.
4.  In **Name**, type the name for your application, and then click
    **OK**.
5.  In Solution Explorer, right-click the application name, and then
    select **Properties**.
6.  In the application properties window, select the **Web**tab.
7.  Under **Use Visual Studio Development Server**, click **Specific
    port**, and then change the value to 7777.
8.  Press F5 to run and debug the application you just created. The
    empty ASP.NET web application appears in your web browser.

Now you've created an ASP.NET web application that runs locally on port
7777. Keep Visual Studio open as you complete the rest of the tasks in
this guide. Next, create the ACS namespace.

## <a name="create-namespace"> </a>Create an ACS Namespace

To begin using Access Control Service (ACS) in Windows Azure, you must
create an ACS namespace. The namespace provides a unique scope for
addressing ACS resources from within your application.

1.  Log into the [Windows Azure Management Portal][].

    ![][1]

2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.

    ![Management Portal Service Bus, Access Control, and Caching
    section][]

3.  In the upper left navigation pane of the Management Portal, click
    **Access Control**, and the click **New**.

    ![][2]

4.  In Create a new Service Namespace, enter a namespace, and then to
    make sure that it is unique, click **Check Availability**.

    ![][3]

5.  If it is available, select the country or region in which to use ACS
    (for the best performance, use the same country/region in which you
    are deploying your application), and then click **Create
    Namespace**.

The namespace appears in the Management Portal and takes a few minutes
to activate. Wait until the status is **Active**before moving on to add
IPs to your namespace.

## <a name="add-IP"> </a>Add Identity Providers

In this task, you add IPs to use with your RP application for
authentication. For demonstration purposes, this task shows how to add
Google as an IP, but you could use any of the IPs listed in the ACS
Management Portal.

1.  In the upper left navigation pane of Windows Azure Management
    Portal, click **Access Control**, select the ACS namespace that you
    want to configure, and then click **Access Control Service**.  
    The ACS Management Portal appears. ![][4]
2.  In the left navigation pane of the ACS Management Portal, click
    **Identity providers**.
3.  On the Identity Providers page, click **Add**, select **Google**as
    the IP, and then click **Next**.  
    **Note:** This task uses Google for demonstration purposes only. You
    can pick any of the IPs listed.
4.  The Add Google Identity Provider page prompts you to enter login
    link text (the default is Google) and an image URL. You can change
    this information, but for this exercise, just use the default
    values, and click **Save**.  
    **Note:** When a new ACS namespace is created, Windows Live ID is
    added as a default IP and cannot be deleted.

Google has now been added as an IP for your ACS namespace. Next, you
specify the ASP.NET web application that you created earlier as an RP.

## <a name="add-RP"> </a>Add a Relying Party Application

In this task, you configure ACS to recognize your ASP.NET web
application as a valid RP application.

1.  On the ACS Management Portal, click **Relying party applications**.
2.  On the Relying Party Applications page, click **Add**.
3.  On the Add Relying Party Application page, do the following:
    1.  In Name, type the name of the RP. For example, type **Azure Web
        App**.
    2.  In Mode, select **Enter settings manually**.
    3.  In Realm, type the URI to which the security token issued by ACS
        applies. For this task, type **http://localhost:7777/**
    4.  In Return URL, type the URL to which ACS returns the security
        token. For this task, type **http://localhost:7777/**
    5.  Accept the default values in the rest of the fields.

4.  Click **Save**.

You have now successfully configured the ASP.NET web application (at
http://localhost:7777/) to be an RP in your ACS namespace. Next, create
the rules that ACS uses to process claims for the RP.

## <a name="create-rules"> </a>Create Rules

In this task, you define the rules that drive how claims are passed from
IPs to your RP. For the purpose of this guide, we will simply configure
ACS to copy the input claim types and values directly in the output
token, without filtering of modifying them.

1.  On the ACS Management Portal main page, click **Rule groups**.
2.  On the Rule Groups page, click **Default Rule Group for RPName**
    where **RPName** is the name of your RP application.
3.  On the Edit Rule Group page, click **Generate**.
4.  On the Generate Rules: Default Rule Group for RPName page, accept
    the IPs selected by default (in this walkthrough, Google and Windows
    Live ID), and then click **Generate**.
5.  On the Edit Rule Group page, click **Save**.

Next, review the information in the Application Integration page and
copy the URI that you will need to configure your ASP.NET web
application to use ACS.

## <a name="review-app-int"> </a>Review the Application Integration Page

You can find all the information and the code necessary to configure
your ASP.NET web application (the RP application) to work with ACS on
the Application Integration page of the ACS Management Portal. You will
need this information when configuring your ASP.NET web application for
federated authentication.

1.  On the ACS Management Portal, click **Application Integration**.  
    The ACS URIs that are displayed on the Application Integration page
    are unique to your ACS namespace.
2.  Copy the URI in the **WS-Federation Metadata**field. You will use it
    when adding STS (Security Token Service) Reference in the next task.
    It should look similar to the following:  
    [**https://ACSnamespace.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml**][]
    where **ACSnamespace** is the name of your ACS namespace.

Next, go back to Visual Studio and configure the application to use ACS.

## <a name="config-trust"> </a>Configure Trust between ACS and Your ASP.NET Web Application

This task describes how to integrate ACS with the ASP.NET web
application using the features of the Windows Identity Foundation SDK.

1.  In Visual Studio 2010, in Solution Explorer, right-click the
    application name, and then **select Add STS Reference**.
2.  In the Federation Utility wizard, do the following:
    1.  On the Welcome to the Federation Utility Wizard page, in
        Application URI, enter the application URI and then click
        **Next**. For this demonstration, use
        **http://localhost:7777/**  
        **Note:** The trailing slash is important because it matches the
        value you entered in the ACS Management Portal for your RP.
    2.  A warning pops up: ID 1007: The Application is not hosted on a
        secure https connection. Do you wish to continue? For this demo,
        click **Yes**.  
        **Note:** In a production environment, this warning about using
        SSL is valid, and you should resolve the issue before
        continuing.
    3.  On Security Token Service page, select **Use Existing STS**,
        paste the WS-Federation Metadata URI that you copied from the
        Application Integration page in the ACS Management Portal (see
        [Review the Application Integration Page][] above), and then
        click **Next**.
    4.  On the STS signing certificate chain validation error page,
        click **Next**.
    5.  On the Security token encryption page, click **Next**.
    6.  On the Offered claims page, click **Next**.
    7.  On the Summary page, click **Finish**.

3.  Once you successfully finish running the Federation Utility wizard,
    it adds a reference to the Microsoft.IdentityModel.dll assembly and
    writes values to your Web.config file that configures the Windows
    Identity Foundation (WIF) in your ASP.NET web application.
4.  Open Web.config and locate the main **system.web**element. It might
    look like the following:

        <system.web>
            <authorization>
               <deny users="?" />
            </authorization>

5.  Modify the **system.web**element to enable request validation by
    adding the following code:

        <!--set this value-->
        <httpRuntime requestValidationMode="2.0"/>

      
    After you perform the update, the **system.web**element must look
    like following code:

        <system.web>
        <!--set this value-->
        <httpRuntime requestValidationMode="2.0"/>
           <authorization>
              <deny users="?" />
           </authorization>

6.  In the Solution Explorer, right-click **References** folder, click
    **Add Reference**, select the **.NET**tab, locate and select
    Microsoft.IdentityModel assembly from the list, and then click
    **OK**.
7.  Right-click the application name, click **Add**, click **New Item**,
    and then click **Web form**and name it **default.aspx**.
8.  Select **default.aspx** and press F7.
9.  Add the following using declarations:

        using Microsoft.IdentityModel.Claims; 
        using System.Threading;

10. Add the following code in the **Page\_Load**event handler:

        Response.Write("Claims Received from ACS:"); 
        ClaimsIdentity ci = Thread.CurrentPrincipal.Identity as ClaimsIdentity; foreach (Claim c in ci.Claims) 
        {
           Response.Write("Type: " + c.ClaimType + "- Value: " + c.Value + "");
        }

11. Press Ctrl+S to save your changes.

## <a name="test"> </a>Test the Integration between ACS and Your ASP.NET Web Application

This task describes how you can test the integration between your RP
application and ACS.

1.  In Visual Studio 2010, press F5 to start debugging your ASP.NET web
    application.  
    Instead of opening the default ASP.NET Web Application, your browser
    is redirected to a Home Realm Discovery page hosted by ACS that
    prompts you to choose an IP. Your screen should look similar to
    this:

    ![][5]

2.  Click **Google**or **Windows Live ID**.  
    The browser then loads the Google or Windows Live sign-in page.
3.  Enter your Google or Windows Live ID credentials.

    The browser then posts back to ACS, ACS issues a token, and posts
    that token to your application site. Your screen should look similar
    to this:

    ![][6]

**Note:** if you chose to go with your Windows Live ID credentials, your
name is not be displayed on the welcome page of your ASP.NET web
application.

Congratulations! You have successfully integrated ACS with your ASP.NET
web application. ACS is now handling the authentication of users using
Windows Live ID and Google credentials.

You can also expand on this scenario. For example, you can specify more
IPs for this RP (via the ACS Management Portal, see section [Add
Identity Providers][]) and thus allowing other web identities, such as
Yahoo! or Facebook users, or users registered in enterprise directories,
such as Active Directory Domain Services, access to this ASP.NET web
application.

## <a name="whats-next"> </a>What's Next

To further explore ACS's functionality and to experiment with more
sophisticated scenarios, see [Access Control Service 2.0.][Access
Control Service 2.0]

  [What is ACS?]: #what-is
  [Concepts]: #concepts
  [Prerequisites]: #pre
  [Create an ASP.NET Web Application]: #create-web-app
  [Create an ACS Namespace]: #create-namespace
  [Add Identity Providers]: #add-IP
  [Add a Relying Party Application]: #add-RP
  [Create Rules]: #create-rules
  [Review the Application Integration Page]: #review-app-int
  [Configure Trust between ACS and Your ASP.NET Web Application]: #config-trust
  [Test the Integration between ACS and Your ASP.NET Web Application]: #test
  [What's Next]: #whats-next
  [Access Control Service 2.0]: http://go.microsoft.com/fwlink/?LinkID=212360
  []: ../../../DevCenter/dotNet/Media/acs-01.png
  [Windows Identity Foundation]: http://www.microsoft.com/download/en/details.aspx?id=17331
  [Windows Identity Foundation SDK]: http://www.microsoft.com/download/en/details.aspx?id=4451
  [Windows Azure account]: {localLink:2187} "Free Trial"
  [Windows Azure Management Portal]: http://windows.azure.com
  [1]: ../../../DevCenter/dotNet/Media/acs-02.png
  [Management Portal Service Bus, Access Control, and Caching section]: ../../../DevCenter/dotNet/Media/acs-03.png
  [2]: ../../../DevCenter/dotNet/Media/acs-04.png
  [3]: ../../../DevCenter/dotNet/Media/acs-05.png
  [4]: ../../../DevCenter/dotNet/Media/acs-06.png
  [**https://ACSnamespace.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml**]:
    https://ACSnamespace.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml
  [5]: ../../../DevCenter/dotNet/Media/acs-07.png
  [6]: ../../../DevCenter/dotNet/Media/acs-08.png
