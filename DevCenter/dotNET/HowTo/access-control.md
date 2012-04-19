<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties umbracoNaviHide="0" pageTitle="Access Control - How To - .NET - Develop" metaKeywords="Azure Access Control Service, Azure ACS, Azure authentication, Azure authentication LiveID, Azure authentication Google, Azure authentication Facebook, Azure authentication .NET, Azure authentication C#" metaDescription="Learn how to use Windows Azure Access Control Service (ACS) in your Windows Azure application to authenticate users from identity providers like Windows Live, Google, or Facebook when they try to gain access to a web application." linkid="dev-net-how-to-access-control" urlDisplayName="Access Control" headerExpose="" footerExpose="" disqusComments="0" />
  <h1>How to Authenticate Web Users with Windows Azure Access Control Service</h1>
  <p>This guide shows you how to use Windows Azure Access Control Service (ACS) to authenticate users from identity providers like Windows Live, Google, or Facebook when they try to gain access to a web application.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#what-is">What is ACS?</a>
    </li>
    <li>
      <a href="#concepts">Concepts</a>
    </li>
    <li>
      <a href="#pre">Prerequisites</a>
    </li>
    <li>
      <a href="#create-web-app">Create an ASP.NET Web Application</a>
    </li>
    <li>
      <a href="#create-namespace">Create an ACS Namespace</a>
    </li>
    <li>
      <a href="#add-IP">Add Identity Providers</a>
    </li>
    <li>
      <a href="#add-RP">Add a Relying Party Application</a>
    </li>
    <li>
      <a href="#create-rules">Create Rules</a>
    </li>
    <li>
      <a href="#review-app-int">Review the Application Integration Page</a>
    </li>
    <li>
      <a href="#config-trust">Configure Trust between ACS and Your ASP.NET Web Application</a>
    </li>
    <li>
      <a href="#test">Test the Integration between ACS and Your ASP.NET Web Application</a>
    </li>
    <li>
      <a href="#whats-next">What's Next</a>
    </li>
  </ul>
  <h2>
    <a name="what-is">
    </a>What is ACS?</h2>
  <p>Most developers are not identity experts and generally do not want to spend time developing authentication and authorization mechanisms for their applications and services. ACS is a Windows Azure service that provides an easy way of authenticating users who need to access your web applications and services without having to factor complex authentication logic into your code.</p>
  <p>The following features are available in ACS:</p>
  <ul>
    <li>Integration with Windows Identity Foundation (WIF).</li>
    <li>Support for popular web identity providers (IPs) including Windows Live ID, Google, Yahoo, and Facebook.</li>
    <li>Support for Active Directory Federation Services (AD FS) 2.0.</li>
    <li>An Open Data Protocol (OData)-based management service that provides programmatic access to ACS settings.</li>
    <li>A Management Portal that allows administrative access to the ACS settings.</li>
  </ul>
  <p>For more information about ACS, see <a href="http://go.microsoft.com/fwlink/?LinkID=212360">Access Control Service 2.0</a>.</p>
  <h2>
    <a name="concepts">
    </a>Concepts</h2>
  <p>Windows Azure ACS is built on the principals of claims-based identity - a consistent approach to creating authentication mechanisms for applications running on-premises or in the cloud. Claims-based identity provides a common way for applications and services to acquire the identity information they need about users inside their organization, in other organizations, and on the Internet.</p>
  <p>To complete the tasks in this guide, you should understand the following concepts:</p>
  <p>
    <strong>Client</strong> - In the context of this how-to guide, this is a browser that is attempting to gain access to your web application.</p>
  <p>
    <strong>Relying party (RP) application</strong> - An RP application is a web site or service that outsources authentication to one external authority. In identity jargon, we say that the RP trusts that authority. This guide explains how to configure your application to trust ACS.</p>
  <p>
    <strong>Token</strong> - A token is a collection of security data that is usually issued upon successful authentication of a user. It contains a set of <em>claims</em>, attributes of the authenticated user. A claim can represent a user's name, an identifier for a role a user belongs to, a user's age, and so on. A token is usually digitally signed, which means it can always be sourced back to its issuer, and its content cannot be tampered with. A user gains access to a RP application by presenting a valid token issued by an authority that the RP application trusts.</p>
  <p>
    <strong>Identity Provider (IP)</strong> - An IP is an authority that authenticates user identities and issues security tokens. The actual work of issuing tokens is implemented though a special service called Security Token Service (STS). Typical examples of IPs include Windows Live ID, Facebook, business user repositories (like Active Directory), and so on. When ACS is configured to trust an IP, the system will accept and validate tokens issued by that IP. ACS can trust multiple IPs at once, which means that when your application trusts ACS, you can instantly offer your application to all the authenticated users from all the IPs that ACS trusts on your behalf.</p>
  <p>
    <strong>Federation Provider (FP)</strong> - IPs have direct knowledge of users, authenticate them using their credentials and issue claims about what they know about them. A Federation Provider (FP) is a different kind of authority: rather than authenticating users directly, it acts as an intermediary and brokers authentication between one RP and one or more IPs. Both IPs and FPs issue security tokens, hence they both use Security Token Services (STS). ACS is one FP.</p>
  <p>
    <strong>ACS Rule Engine</strong> - The logic used to transform incoming tokens from trusted IPs to tokens meant to be consumed by the RP is codified in form of simple claims transformation rules. ACS features a rule engine that takes care of applying whatever transformation logic you specified for your RP.</p>
  <p>
    <strong>ACS Namespace</strong> - A namespace is a top level partition of ACS that you use for organizing your settings. A namespace holds a list of IPs you trust, the RP applications you want to serve, the rules that you expect the rule engine to process incoming tokens with, and so on. A namespace exposes various endpoints that will be used by the application and the developer to get ACS to perform its function.</p>
  <p>The following figure shows how ACS authentication works with a web application:</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/acs-01.png" />
  </p>
  <ol>
    <li>The client (in this case a browser) requests a page from the RP.</li>
    <li>Since the request is not yet authenticated, the RP redirects the user to the authority that it trusts, which is ACS. The ACS presents the user with the choice of IPs that were specified for this RP. The user selects the appropriate IP.</li>
    <li>The client browses to the IP's authentication page, and prompts the user to log on.</li>
    <li>After the client is authenticated (for example, the identity credentials are entered), the IP issues a security token.</li>
    <li>After issuing a security token, the IP redirects the client to ACS and the client sends the security token issued by the IP to ACS.</li>
    <li>ACS validates the security token issued by the IP, inputs the identity claims in this token into the ACS rules engine, calculates the output identity claims, and issues a new security token that contains these output claims.</li>
    <li>ACS redirects the client to the RP. The client sends the new security token issued by ACS to the RP. The RP validates the signature on the security token issued by ACS, validates the claims in this token, and returns the page that was originally requested.</li>
  </ol>
  <h2>
    <a name="pre">
    </a>Prerequisites</h2>
  <p>To complete the tasks in this guide, you will need the following:</p>
  <ul>
    <li>Microsoft Visual Studio 2010</li>
    <li>
      <a href="http://www.microsoft.com/download/en/details.aspx?id=17331">Windows Identity Foundation</a>
    </li>
    <li>
      <a href="http://www.microsoft.com/download/en/details.aspx?id=4451">Windows Identity Foundation SDK</a>
    </li>
    <li>An active <a href="{localLink:2187}" title="Free Trial">Windows Azure account</a></li>
  </ul>
  <h2>
    <a name="create-web-app">
    </a>Create an ASP.NET Web Application</h2>
  <p>To demonstrate how ACS does authentication, create a simple ASP.NET web application, which you will later set up as a Relying Party (RP) application.</p>
  <ol>
    <li>Start Visual Studio 2010.</li>
    <li>In Visual Studio, click <strong>File</strong>, and then click <strong>New Project</strong>.</li>
    <li>In New Project window, select<strong> Visual C#/Web</strong> template, and then select <strong>ASP.NET Empty Web Application</strong>.</li>
    <li>In <strong>Name</strong>, type the name for your application, and then click <strong>OK</strong>.</li>
    <li>In Solution Explorer, right-click the application name, and then select <strong>Properties</strong>.</li>
    <li>In the application properties window, select the <strong>Web </strong>tab.</li>
    <li>Under <strong>Use Visual Studio Development Server</strong>, click <strong>Specific port</strong>, and then change the value to 7777.</li>
    <li>Press F5 to run and debug the application you just created. The empty ASP.NET web application appears in your web browser.</li>
  </ol>
  <p>Now you've created an ASP.NET web application that runs locally on port 7777. Keep Visual Studio open as you complete the rest of the tasks in this guide. Next, create the ACS namespace.</p>
  <h2>
    <a name="create-namespace">
    </a>Create an ACS Namespace</h2>
  <p>To begin using Access Control Service (ACS) in Windows Azure, you must create an ACS namespace. The namespace provides a unique scope for addressing ACS resources from within your application.</p>
  <ol>
    <li>
      <p>Log into the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-02.png" />
      </p>
    </li>
    <li>
      <p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-03.png" alt="Management Portal Service Bus, Access Control, and Caching section" />
      </p>
    </li>
    <li>
      <p>In the upper left navigation pane of the Management Portal, click <strong>Access Control</strong>, and the click <strong>New</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-04.png" />
      </p>
    </li>
    <li>
      <p>In Create a new Service Namespace, enter a namespace, and then to make sure that it is unique, click <strong>Check Availability</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-05.png" />
      </p>
    </li>
    <li>If it is available, select the country or region in which to use ACS (for the best performance, use the same country/region in which you are deploying your application), and then click <strong>Create Namespace</strong>.</li>
  </ol>
  <p>The namespace appears in the Management Portal and takes a few minutes to activate. Wait until the status is <strong>Active </strong>before moving on to add IPs to your namespace.</p>
  <h2>
    <a name="add-IP">
    </a>Add Identity Providers</h2>
  <p>In this task, you add IPs to use with your RP application for authentication. For demonstration purposes, this task shows how to add Google as an IP, but you could use any of the IPs listed in the ACS Management Portal.</p>
  <ol>
    <li>In the upper left navigation pane of Windows Azure Management Portal, click <strong>Access Control</strong>, select the ACS namespace that you want to configure, and then click <strong>Access Control Service</strong>.<br />The ACS Management Portal appears. <img src="../../../DevCenter/dotNet/media/acs-06.png" /></li>
    <li>In the left navigation pane of the ACS Management Portal, click <strong>Identity providers</strong>.</li>
    <li>On the Identity Providers page, click <strong>Add</strong>, select <strong>Google </strong>as the IP, and then click <strong>Next</strong>.<br /><strong>Note:</strong> This task uses Google for demonstration purposes only. You can pick any of the IPs listed.</li>
    <li>The Add Google Identity Provider page prompts you to enter login link text (the default is Google) and an image URL. You can change this information, but for this exercise, just use the default values, and click <strong>Save</strong>.<br /><strong>Note:</strong> When a new ACS namespace is created, Windows Live ID is added as a default IP and cannot be deleted.</li>
  </ol>
  <p>Google has now been added as an IP for your ACS namespace. Next, you specify the ASP.NET web application that you created earlier as an RP.</p>
  <h2>
    <a name="add-RP">
    </a>Add a Relying Party Application</h2>
  <p>In this task, you configure ACS to recognize your ASP.NET web application as a valid RP application.</p>
  <ol>
    <li>On the ACS Management Portal, click <strong>Relying party applications</strong>.</li>
    <li>On the Relying Party Applications page, click <strong>Add</strong>.</li>
    <li>On the Add Relying Party Application page, do the following:<ol><li>In Name, type the name of the RP. For example, type <strong>Azure Web App</strong>.</li><li>In Mode, select <strong>Enter settings manually</strong>.</li><li>In Realm, type the URI to which the security token issued by ACS applies. For this task, type <strong>http://localhost:7777/</strong></li><li>In Return URL, type the URL to which ACS returns the security token. For this task, type <strong>http://localhost:7777/</strong></li><li>Accept the default values in the rest of the fields.</li></ol></li>
    <li>Click <strong>Save</strong>.</li>
  </ol>
  <p>You have now successfully configured the ASP.NET web application (at http://localhost:7777/) to be an RP in your ACS namespace. Next, create the rules that ACS uses to process claims for the RP.</p>
  <h2>
    <a name="create-rules">
    </a>Create Rules</h2>
  <p>In this task, you define the rules that drive how claims are passed from IPs to your RP. For the purpose of this guide, we will simply configure ACS to copy the input claim types and values directly in the output token, without filtering of modifying them.</p>
  <ol>
    <li>On the ACS Management Portal main page, click <strong>Rule groups</strong>.</li>
    <li>On the Rule Groups page, click <strong>Default Rule Group for RPName</strong> where <strong>RPName</strong> is the name of your RP application.</li>
    <li>On the Edit Rule Group page, click <strong>Generate</strong>.</li>
    <li>On the Generate Rules: Default Rule Group for RPName page, accept the IPs selected by default (in this walkthrough, Google and Windows Live ID), and then click <strong>Generate</strong>.</li>
    <li>On the Edit Rule Group page, click <strong>Save</strong>.</li>
  </ol>
  <p>Next, review the information in the Application Integration page and copy the URI that you will need to configure your ASP.NET web application to use ACS.</p>
  <h2>
    <a name="review-app-int">
    </a>Review the Application Integration Page</h2>
  <p>You can find all the information and the code necessary to configure your ASP.NET web application (the RP application) to work with ACS on the Application Integration page of the ACS Management Portal. You will need this information when configuring your ASP.NET web application for federated authentication.</p>
  <ol>
    <li>On the ACS Management Portal, click <strong>Application Integration</strong>.<br />The ACS URIs that are displayed on the Application Integration page are unique to your ACS namespace.</li>
    <li>Copy the URI in the <strong>WS-Federation Metadata </strong>field. You will use it when adding STS (Security Token Service) Reference in the next task. It should look similar to the following:<br /><a href="https://ACSnamespace.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml"><strong>https://ACSnamespace.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml</strong></a> where <strong>ACSnamespace</strong> is the name of your ACS namespace.</li>
  </ol>
  <p>Next, go back to Visual Studio and configure the application to use ACS.</p>
  <h2>
    <a name="config-trust">
    </a>Configure Trust between ACS and Your ASP.NET Web Application</h2>
  <p>This task describes how to integrate ACS with the ASP.NET web application using the features of the Windows Identity Foundation SDK.</p>
  <ol>
    <li>In Visual Studio 2010, in Solution Explorer, right-click the application name, and then <strong>select Add STS Reference</strong>.</li>
    <li>In the Federation Utility wizard, do the following:<ol><li>On the Welcome to the Federation Utility Wizard page, in Application URI, enter the application URI and then click <strong>Next</strong>. For this demonstration, use <strong>http://localhost:7777/</strong><br /><strong>Note:</strong> The trailing slash is important because it matches the value you entered in the ACS Management Portal for your RP.</li><li>A warning pops up: ID 1007: The Application is not hosted on a secure https connection. Do you wish to continue? For this demo, click <strong>Yes</strong>.<br /><strong>Note:</strong> In a production environment, this warning about using SSL is valid, and you should resolve the issue before continuing.</li><li>On Security Token Service page, select <strong>Use Existing STS</strong>, paste the WS-Federation Metadata URI that you copied from the Application Integration page in the ACS Management Portal (see <a href="#review-app-int">Review the Application Integration Page</a> above), and then click <strong>Next</strong>.</li><li>On the STS signing certificate chain validation error page, click <strong>Next</strong>.</li><li>On the Security token encryption page, click <strong>Next</strong>.</li><li>On the Offered claims page, click <strong>Next</strong>.</li><li>On the Summary page, click <strong>Finish</strong>.</li></ol></li>
    <li>Once you successfully finish running the Federation Utility wizard, it adds a reference to the Microsoft.IdentityModel.dll assembly and writes values to your Web.config file that configures the Windows Identity Foundation (WIF) in your ASP.NET web application.</li>
    <li>Open Web.config and locate the main <strong>system.web</strong>element. It might look like the following:
<pre class="prettyprint">&lt;system.web&gt;
    &lt;authorization&gt;
       &lt;deny users="?" /&gt;
    &lt;/authorization&gt;</pre></li>
    <li>Modify the <strong>system.web</strong>element to enable request validation by adding the following code:
<pre class="prettyprint">&lt;!--set this value--&gt;
&lt;httpRuntime requestValidationMode="2.0"/&gt;
</pre><br />After you perform the update, the <strong>system.web</strong>element must look like following code:
<pre class="prettyprint">&lt;system.web&gt;
&lt;!--set this value--&gt;
&lt;httpRuntime requestValidationMode="2.0"/&gt;
   &lt;authorization&gt;
      &lt;deny users="?" /&gt;
   &lt;/authorization&gt;
</pre></li>
    <li>In the Solution Explorer, right-click <strong>References</strong> folder, click <strong>Add Reference</strong>, select the <strong>.NET </strong>tab, locate and select Microsoft.IdentityModel assembly from the list, and then click <strong>OK</strong>.</li>
    <li>Right-click the application name, click <strong>Add</strong>, click <strong>New Item</strong>, and then click <strong>Web form </strong>and name it <strong>default.aspx</strong>.</li>
    <li>Select <strong>default.aspx</strong> and press F7.</li>
    <li>Add the following using declarations:
<pre class="prettyprint">using Microsoft.IdentityModel.Claims; 
using System.Threading;
</pre></li>
    <li>Add the following code in the <strong>Page_Load</strong>event handler:
<pre class="prettyprint">Response.Write("Claims Received from ACS:<br /><br />"); 
ClaimsIdentity ci = Thread.CurrentPrincipal.Identity as ClaimsIdentity; foreach (Claim c in ci.Claims) 
{
   Response.Write("Type: " + c.ClaimType + "- Value: " + c.Value + "<br />");
}
</pre></li>
    <li>Press Ctrl+S to save your changes.</li>
  </ol>
  <h2>
    <a name="test">
    </a>Test the Integration between ACS and Your ASP.NET Web Application</h2>
  <p>This task describes how you can test the integration between your RP application and ACS.</p>
  <ol>
    <li>
      <p>In Visual Studio 2010, press F5 to start debugging your ASP.NET web application.<br />Instead of opening the default ASP.NET Web Application, your browser is redirected to a Home Realm Discovery page hosted by ACS that prompts you to choose an IP. Your screen should look similar to this:</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-07.png" />
      </p>
    </li>
    <li>Click <strong>Google </strong>or <strong>Windows Live ID</strong>.<br />The browser then loads the Google or Windows Live sign-in page.</li>
    <li>
      <p>Enter your Google or Windows Live ID credentials.</p>
      <p>The browser then posts back to ACS, ACS issues a token, and posts that token to your application site. Your screen should look similar to this:</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/acs-08.png" />
      </p>
    </li>
  </ol>
  <p>
    <strong>Note:</strong> if you chose to go with your Windows Live ID credentials, your name is not be displayed on the welcome page of your ASP.NET web application.</p>
  <p>Congratulations! You have successfully integrated ACS with your ASP.NET web application. ACS is now handling the authentication of users using Windows Live ID and Google credentials.</p>
  <p>You can also expand on this scenario. For example, you can specify more IPs for this RP (via the ACS Management Portal, see section <a href="#add-IP">Add Identity Providers</a>) and thus allowing other web identities, such as Yahoo! or Facebook users, or users registered in enterprise directories, such as Active Directory Domain Services, access to this ASP.NET web application.</p>
  <h2>
    <a name="whats-next">
    </a>What's Next</h2>
  <p>To further explore ACS's functionality and to experiment with more sophisticated scenarios, see <a href="http://go.microsoft.com/fwlink/?LinkID=212360">Access Control Service 2.0.</a></p>
</body>