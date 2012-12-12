<properties linkid="develop-java-how-to-guides-web-sso" urlDisplayName="Web SSO" pageTitle="Single sign-on with Windows Azure Active Directory (Java)" metaKeywords="Azure Java web app, Azure single sign-on, Azure Java Active Directory" metaDescription="Learn how to create a Java web application that uses single sign-on with Windows Azure Active Directory." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# How to implement single sign-on with Windows Azure Active Directory - Java Application#

<h2>Table of Contents</h2>
<li>
<a href="#overview">Overview</a>
</li>
<li>
<a href="#prerequisites">Prerequisites</a></li>
<li><a href="#step1">Step 1 - Create a Java web application</a></li>
<li><a href="#step2">Step 2 - Provision the Java web application in Windows Azure Active Directory</a></li>
<li><a href="#step3">Step 3 - Protect the Java web application via WS-Federation and onboard the first customer</a></li>
<li><a href="#step4">Step 4 - Configure the Java web application for single sign-on with multiple tenants</a></li>	<li><a href="#appendix">Appendix: Deploying to JBOSS on Solaris</a></li>

<h2><a name="overview"></a>Overview</h2>

This guide provides instructions for creating a Java web application and configuring it to leverage Windows Azure Active Directory. 

Imagine the following scenario:

- Fabrikam is an independent software vendor with a Java web application

- Awesome Computers has a subscription to Office 365

- Trey Research Inc. has a subscription to Office 365



Awesome Computers wants to provide their users (employees) with the access to the Fabrikam's Java application. After some deliberation, both parties agree to utilize the web single sign-on approach, also called identity federation with the end result being that Awesome Computers' users will be able to access Fabrikam's Java application in exactly the same way they access Office 365 applications. 

This web single sign-on method is made possible with the help of the Windows Azure Active Directory, which is also used by Office 365. Windows Azure Active Directory provides directory, authentication, and authorization services, including a Security Token Service (STS). 

With the web single sign-on approach, Awesome Computers will provide single sign-on access to their users through a federated mechanism that relies on an STS. Since Awesome Computers does not have its own STS, they will rely on the STS provided by Windows Azure Active Directory that was provisioned for them when they acquired Office 365.

In the instructions provided in this guide, we will play the roles of both Fabrikam and Awesome Computers and recreate this scenario by performing the following tasks: 

- Create a simple Java application (performed by Fabrikam)
- Provision a Java web application in Windows Azure Active Directory (performed by Awesome Computers)

	**Note:** As part of this step, Awesome Computers must in turn be provisioned by the Fabrikam as a customer of their Java application. Basically, Fabrikam needs to know that users from the Office 365 tenant with the domain **awesomecomputers.onmicrosoft.com** should be granted access to their Java application.
- Protect the Java application with WS-Federation and onboard the first customer (performed by Fabrikam)
- Modify the Java application to handle single sign-on with multiple tenants (performed by Fabrikam)

**Assets**

This guide is available together with several code samples and scripts that can help you with some of the most time-consuming tasks. All materials are available at [Azure Active Directory SSO for Java](https://github.com/WindowsAzure/azure-sdk-for-java-samples/) for you to study and modify to fit your environment. 

<h2><a name="prerequisites"></a>Prerequisites</h2>

To complete the tasks in this guide, you will need the following:

**General environment requirements:**

- Internet Information Services (IIS) 7.5 (with SSL enabled)
- Windows PowerShell 2.0
- [Microsoft Online Services Module](http://g.microsoftonline.com/0BX10en/229)

**Java-specific requirements:**
    <li><a href="http://www.oracle.com/technetwork/java/javase/downloads/jre-6u31-download-1501637.html">Java Runtime Environment 1.6</a></li>
    <li>
      <a href=" http://www.jboss.org/jbossas/downloads/">JBoss 7.1.1.Final</a>
    </li>
    <li>
      <a href="https://devstudio.jboss.com/earlyaccess/">JBoss Studio </a>
    </li>


<h2><a name="step1"></a>Step 1 - Create a Java web application</h2>

The instructions in this step demonstrate how to create a simple Java application. In our scenario, this step is performed by Fabrikam.

*NOTE for the non-Java developer: Maven is a dependency manager and build system. JBOSS Developer Studio, which is based on Eclipse, does not offer those capabilities out of the box. *

**To create Java web application:**

1.	Open a new instance of JBoss Developer Studio.
2.	Create a new project: **File** -> **New Project** -> **Maven Project**.
3.	In the first wizard window select the ‘**Create a simple project**’ option and click **Next**.

	![step3] (../../../DevCenter/Java/Media/javastep1step1.jpg)	

4.	Provide a **Group Id**, an **Artifact Id**, and for **Packaging** select war. Click **Finish**.

	![step4] (../../../DevCenter/Java/Media/javastep1step4.jpg)			

5.	Open the pom.xml file in the sample project and add the following xml inside the project node to configure the repositories for the external libraries and plugins and to target the project to Java 1.6.

		<repositories>
			<repository>
				<id>jboss-public-repository-group</id>
				<name>JBoss Public Maven Repository Group</name>
				<url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
				<layout>default</layout>
				<releases>
					<enabled>true</enabled>
					<updatePolicy>never</updatePolicy>
				</releases>
				<snapshots>
					<enabled>true</enabled>
					<updatePolicy>never</updatePolicy>
				</snapshots>
			</repository>
		</repositories>
		
		<pluginRepositories>
			<pluginRepository>
				<id>jboss-public-repository-group</id>
				<name>JBoss Public Maven Repository Group</name>
				<url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
				<layout>default</layout>
				<releases>
					<enabled>true</enabled>
					<updatePolicy>always</updatePolicy>
				</releases>
				<snapshots>
					<enabled>true</enabled>
					<updatePolicy>always</updatePolicy>
				</snapshots>
			</pluginRepository>
		</pluginRepositories>
		
		<build>
			<plugins>
				<plugin>
					<groupId>org.apache.maven.plugins</groupId>
					<artifactId>maven-compiler-plugin</artifactId>
					<version>2.0.2</version>
					<configuration>
						<source>1.6</source>
						<target>1.6</target>
					</configuration>
				</plugin>
			</plugins>
		</build>

6.	Right-click the **sample** project and select **Maven** -> **Update Project Configuration…** to refresh the project and apply **pom.xml** file changes. Select both projects and click **OK**.

	![step6] (../../../DevCenter/Java/Media/javastep1step6.png)		

7.	Select the sample project, right-click and select New -> JSP File (name it index.jsp).

	![step7] (../../../DevCenter/Java/Media/javastep1step7.png)	

8.	Replace the generated code with the following:

		<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
			pageEncoding="ISO-8859-1"%>
		<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Index</title>
		</head>
		<body>
			<h3>Index Page</h3>
		</body>
		</html>

9.	Right-click the sample project and select **Run A**s -> **Run on Server**. 

10.	Open a Powershell console and run the following command to generate a new GUID for the application:

		PS C:\Windows\system32> [guid]::NewGuid()
		Guid
		----
		9a822147-348b-4e0e-8edf-899fe8c117d4

	*Note:* Make sure to record this value. This identifier will be the AppPrincipalId used in further steps in this guide when provisioning this Jav web applicaiton in Office 365. 

<h2><a name="step2"></a>Step 2 - Provision the Java web application in Windows Azure Active Directory</h2>

Instructions in this step demonstrate how you can provision the Java web application in Windows Azure Active Directory. In our scenario, this step is performed by Awesome Computers.  Then Awesome Computers provides the application owner (Fabrikam) with the data Fabrikam needs in order to set up single sign-on access for Awesome Computers's users. 

Note: If you don’t have access to an Office 365 tenant, you can obtain one by applying for a FREE TRIAL subscription on the [Office 365’s Sign-up page](http://www.microsoft.com/en-us/office365/online-software.aspx#fbid=8qpYgwknaWN). 

To provision the Java web application in Windows Azure Active Directory, Awesome Computers creates a new Service Principal for it in the directory. In order to create a new Service principal for the Java application in the directory, Awesome Computers must obtain the following information from Fabrikam:

- The value of the ServicePrincipalName (sample/localhost:8443
- The AppPrincipalId (9a822147-348b-4e0e-8edf-899fe8c117d4)
- The ReplyUrl 

**To provision the Java application in Windows Azure Active Directory**

1.	Download and install a set of [Powershell scripts](https://bposast.vo.msecnd.net/MSOPMW/5164.009/amd64/administrationconfig-en.msi) from the Office 365’s online help page.

2.	Locate the **CreateServicePrincipal.ps1** script in this code example set under WAAD.WebSSO.JAVA/Scripts.

3.	Launch the Microsoft Online Services Module for Windows PowerShell console.

4.	Run the **CreateServicePrincipal.ps1** command from the Microsoft Online Services Module for Windows PowerShell Console.

		PS C:\Windows\system32> ./CreateServicePrincipal.ps1

	When asked to provide a name for your Service Principal, type in a descriptive name that you can remember in case you wish to inspect or remove the Service Principal later on.

	![step4] (../../../DevCenter/Java/Media/ssostep2step45.png)		

5.	When prompted, enter your administration credentials for your Office365 tenant:

	![step5] (../../../DevCenter/Java/Media/ssostep2step5.png)		

6.	If the script runs successfully, your screen will look similar to the figure below. Make sure to record the values of the following for use later in this guide:

- company ID
- AppPrincipal ID
- App Principal Secret
- Audience URI

	![step6] (../../../DevCenter/Java/Media/ssostep2step6.png)		

	*Note: In the command shown here, AppPrincipalId values are those provided by Fabrikam.*

The Fabrikam's application has been successfully provisioned in the directory tenant of Awesome Computers. 

Now Fabrikam must provision Awesome Computers as a customer of the Java application. In other words, Fabrikam must know that users from the Office 365 tenant with domain *awesomecomputers.onmicrosoft.com* should be granted access to the Java applicaiton. How that information reaches Fabrikam depends on how the subscriptions are handled. In this guide, the instructions for this provisioning step are not provided. 

<h2><a name="step3"></a>Step 3 - Protect the Java web application via WS-Federation and onboard the first customer</h2>

The instructions in this step demonstrate how to add support for federated login to the Java web application created in Step 1. In our scenario, this step is performed by Fabrikam. 

This step is performed by using the waad-federation library and adding some extra artifacts, like a login page. With the application ready to authenticate requests using the WS-Federation protocol, we’ll add the Windows Azure Active Directory tenant of Awesome Computers as a trusted provider.

1.	Import the **waad-federation** library from JBoss Developer Studio in the same workspace you created the sample application: **File** -> **Import** -> **Existing Maven Projects**. 

	![step1] (../../../DevCenter/Java/Media/javastep3step1.png)	

2.	Select the folder where the **waad-federation** library is located and click **Finish**.

	![step2] (../../../DevCenter/Java/Media/javastep3step2.png)		

3.	Open the **pom.xml** file in the sample project and add the following xml inside project node to configure the project’s dependencies.

		<dependencies>
			<dependency>
				<groupId>javax.servlet</groupId>
				<artifactId>servlet-api</artifactId>
				<version>3.0-alpha-1</version>
			</dependency>
			<dependency>
				<groupId>com.microsoft.samples.waad.federation</groupId>
				<artifactId>waad-federation</artifactId>
				<version>0.0.1-SNAPSHOT</version>
			</dependency>
		</dependencies>

4.	Right-click the **sample** project and select **Maven** -> **Update Project Configuration…** to refresh the project and apply pom.xml file changes. Select both projects and click **OK**.

	![step4] (../../../DevCenter/Java/Media/javastep3step4.png)		

5.	Create a Filter. Right-click the **sample** project and select **New** -> **Filter**. For “Class name” enter FederationFilter and click **Finish**.
****
	![step5] (../../../DevCenter/Java/Media/javastep3step5.png)		

6.	Replace the generated code with the following:

		import java.io.IOException;
		import javax.servlet.Filter;
		import javax.servlet.FilterChain;
		import javax.servlet.FilterConfig;
		import javax.servlet.ServletException;
		import javax.servlet.ServletRequest;
		import javax.servlet.ServletResponse;
		import javax.servlet.http.HttpServletRequest;
		import javax.servlet.http.HttpServletResponse;
		import java.util.regex.*;
		
		import com.microsoft.samples.federation.FederatedLoginManager;
		import com.microsoft.samples.federation.URLUTF8Encoder;
		
		public class FederationFilter implements Filter {
			private String loginPage;
			private String allowedRegex;
		
			public void init(FilterConfig config) throws ServletException {
				this.loginPage = config.getInitParameter("login-page-url");
				this.allowedRegex = config.getInitParameter("allowed-regex");
			}
		
			public void doFilter(ServletRequest request, ServletResponse response,
					FilterChain chain) throws IOException, ServletException {
		
				if (request instanceof HttpServletRequest) {
					HttpServletRequest httpRequest = (HttpServletRequest) request;
		
					if (!httpRequest.getRequestURL().toString().contains(this.loginPage)) {
						FederatedLoginManager loginManager = FederatedLoginManager.fromRequest(httpRequest);
		
						boolean allowedUrl = Pattern.compile(this.allowedRegex).matcher(httpRequest.getRequestURL().toString()).find();
		
						if (!allowedUrl && ! loginManager.isAuthenticated()) {
							HttpServletResponse httpResponse = (HttpServletResponse) response;
							String encodedReturnUrl = URLUTF8Encoder.encode(httpRequest.getRequestURL().toString());
							httpResponse.setHeader("Location", this.loginPage + "?returnUrl=" + encodedReturnUrl);
							httpResponse.setStatus(302);
							return;
						}
					}
				}
		
				chain.doFilter(request, response);
			}
		
			public void destroy() {
			}
		}

7.	Open the web.xml located in the src/main/webapp/WEB-INF folder. Add the following piece inside the web-app node:

		<filter>
		  <filter-name>FederationFilter</filter-name>
		  <filter-class>FederationFilter</filter-class>
		  <init-param>
		    <param-name>login-page-url</param-name>
		    <param-value>/sample/login.jsp</param-value>
		  </init-param>
		  <init-param>
		    <param-name>allowed-regex</param-name>
		    <param-value>(\/sample\/login.jsp|\/sample\/wsfed-saml|\/sample\/oauth)</param-value>
		  </init-param>
		</filter>
		<filter-mapping>
		  <filter-name>FederationFilter</filter-name>
		  <url-pattern>/*</url-pattern>
		</filter-mapping>

	*Note: The filter will handle the secured and unsecured pages and will also redirect users to the login page (defined as login-page-url filter’s parameter) if they are not authenticated. 

	However, the filter will not apply to the incoming Urls that match the allow-regex regular expression parameter.*

8.	Create a login page. Select the sample project, right-click and select **New** -> **JSP File** (name it login.jsp) 

	![step8] (../../../DevCenter/Java/Media/javastep3step8.png)		

9.	Replace the generated code with the following:

		<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
			pageEncoding="ISO-8859-1"%>
		<%@ page import="com.microsoft.samples.federation.*"%>
		
		<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Login Page</title>
		</head>
		<body>
			<h3>Login Page</h3>
			<a href="<%=FederatedLoginManager.getFederatedLoginUrl(request.getParameter("returnUrl"))%>"><%=FederatedConfiguration.getInstance().getStsFriendlyName()%></a>
		</body>
		</html>

10.	From JBoss Developer Studio, right-click the **src/main/resources** folder in the sample project, select **New** -> **Properties** file, name it federation and provide the following configuration:

	*NOTE: audienceuris= and realm= are the values you retrieved from the PowerShell command above. Remember that you must add spn: to be beginning of this value. Use the audienceuri for both values below.*

		federation.trustedissuers.issuer=https://accounts.accesscontrol.windows.net/v2/wsfederation
		federation.trustedissuers.thumbprint=3F5DFCDF4B3D0EAB9BA49BEFB3CFD760DA9CCCF1
		federation.trustedissuers.friendlyname=Awesome Computers
		federation.audienceuris=spn:9a822147-348b-4e0e-8edf-899fe8c117d4@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7
		federation.realm=spn:9a822147-348b-4e0e-8edf-899fe8c117d4@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7
		federation.reply=https://localhost:8443/sample/wsfed-saml

11.	Create the new Servlet. Right-click the sample project and select **New** -> **Other** -> **Servlet**. Name it **FederationServlet**, click **Next** and then **Finish**.

	![step11] (../../../DevCenter/Java/Media/javastep3step11.png)		

12.	Open the FederationServlet.java file and replace the generated code with the following:

		import java.io.IOException;
		import javax.servlet.ServletException;
		import javax.servlet.http.HttpServlet;
		import javax.servlet.http.HttpServletRequest;
		import javax.servlet.http.HttpServletResponse;
		
		import com.microsoft.samples.federation.FederatedAuthenticationListener;
		import com.microsoft.samples.federation.FederatedLoginManager;
		import com.microsoft.samples.federation.FederatedPrincipal;
		import com.microsoft.samples.federation.FederationException;
		
		public class FederationServlet extends HttpServlet {
			private static final long serialVersionUID = 1L;
				
			protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
				String token = request.getParameter("wresult").toString();
				
				if (token == null) {
					response.sendError(400, "You were supposed to send a wresult parameter with a token");
				}
				
				FederatedLoginManager loginManager = FederatedLoginManager.fromRequest(request, new SampleAuthenticationListener());
		
				try {
					loginManager.authenticate(token, response);
				} catch (FederationException e) {
					response.sendError(500, "Oops! and error occurred.");
				}
			}
			
			private class SampleAuthenticationListener implements FederatedAuthenticationListener {
				@Override
				public void OnAuthenticationSucceed(FederatedPrincipal principal) {
					// ***
					// do whatever you want with the principal object that contains the token's claims
					// ***
				}		
			}
		}

13.	Open the **web.xml** located inside the **src/main/webapp/WEB-INF** folder and replace the url-pattern “/FederationServlet” with “/ws-saml”.

		<servlet>
		    <description></description>
		    <display-name>FederationServlet</display-name>
		    <servlet-name>FederationServlet</servlet-name>
		    <servlet-class>FederationServlet</servlet-class>
		  </servlet>
		  <servlet-mapping>
		    <servlet-name>FederationServlet</servlet-name>
		    <url-pattern>/wsfed-saml</url-pattern>
		  </servlet-mapping>

14.	Open the **index.jsp** file and replace the existing code with the following:

		<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
		<%@ page import="com.microsoft.samples.federation.*"%>
		
		<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
		<html>
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		<title>Index Page</title>
		</head>
		<body>
			<h3>Welcome <strong><%=FederatedLoginManager.fromRequest(request).getPrincipal().getName()%></strong>!</h3>
			
			<h2>Claim list:</h2>
			<ul>
		<%
			for (Claim claim : FederatedLoginManager.fromRequest(request).getClaims()) {
		%>
		          <li><%= claim.toString()%></li>
		<% 	} %>
		      </ul>
		</body>
		</html>

15.	Open the **web.xml** located in the **src/main/webapp/WEB-INF** folder and add this node under web-app to make the application run over SSL:

		<security-constraint>
		  <web-resource-collection>
		    <web-resource-name>SSL Forwarding</web-resource-name>
		    <url-pattern>/*</url-pattern>
		    <http-method>POST</http-method>
		    <http-method>GET</http-method>
		  </web-resource-collection>
		  <user-data-constraint>
		    <transport-guarantee>CONFIDENTIAL</transport-guarantee>
		  </user-data-constraint>
		</security-constraint>

	*NOTE: Ensure that JBoss server is already configured to support SSL.* 

16.	Right-click the **sample** project and select **Run As** -> **Run on Server**, click **Finish** and you should be able to see the login page with the “Awesome Computers” link.

	![step16] (../../../DevCenter/Java/Media/javastep3step16.png)	

17.	Once on the Office 365 identity provider page, you can log in using your awesomecomputers.onmicrosoft.com credentials (e.g. john.doe@awesomecomputers.onmicrosoft.com).

	![step17] (../../../DevCenter/Java/Media/javastep3step17.png)		

18.	Finally, if the login process is successful, you will be redirected to the secured page (sample/index.jsp) as an authenticated user.
	
	![step18] (../../../DevCenter/Java/Media/javastep3step18.png)	


**Important:** If your application is meant to work with a single Windows Azure Active Directory tenant, for example, if you are writing a LoB application, you can stop following the instructions in this guide at this point. By running the three steps above, you have successfully set up Windows Azure AD-enabled single sign-on to a simple Java web application for the users in one tenant.

If, however, you are developing applications that need to be accessed by more than one tenant, the next step can help you modify your code to accommodate multiple tenants.  

<h2><a name="step4"></a>Step 4 - Configure the Java web application for single sign-on with Multiple tenants</h2>

What if Fabrikam wants to provide access to its application to multiple customers? The steps we performed in this guide so far ensure that single sign-on works with only one trusted provider. Fabrikam's developers must make some changes to their Java web application in order to provide single sign-on to whatever future customers they obtain. The main new features needed are:

- Support for multiple identity providers in the login page
- Maintenance of the list of all trusted providers and the audienceURI they will send to the application; That list can be used to determine how to validate incoming tokens

Let's add another fictitious customer to our scenario, Trey research Inc. Trey Research Inc. must register Fabrikam's Java web application in its tenant the same way Awesome Computers have done in Step 2. The following is the list of configuration changes that Fabrikam needs to perform to their Java web application to enable multi-tenant single sign-on, intertwined with the provisioning of Trey Research Inc.

1.	From JBoss Developer Studio, right-click the src/main/resources folder in the sample project, select New -> Xml File and provide “trusted.issuers.xml” as the file name. This file will contain a list of the trusted issuers for the application (in this case with Awesome Computers and Trey Research Inc.) which will be used by the dynamic audience Uri validator.

	![step1] (../../../DevCenter/Java/Media/javastep4step1.png)		

2.	Go to the scripts folder and open the Microsoft.Samples.Waad.Federation.PS link to generate the trusted issuers’ nodes to add to the XML repository. It will ask you for the AppPrincipalId and the AppDomain name to generate the issuer node as depicted below:

	![step2] (../../../DevCenter/Java/Media/javastep4step2.png)		

	*Note: The script retrieves the federation metadata directly from Windows Azure Active Directory to get the issuer identifier for generating the realm’s SPN value.	*

3.	Open the XML file, create an issuers root node and include the output node:
		
		<issuers>
			<issuer name="awesomecomputers.onmicrosoft.com" displayName="awesomecomputers.onmicrosoft.com " realm="spn:9a822147-348b-4e0e-8edf-899fe8c117d4@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7" />
		</issuers>

4.	Repeat Step 2 to generate Trey Research Inc. node. Notice that you can change the display name to show a user-friendly name.

		<issuers>
			<issuer name="awesomecomputers.onmicrosoft.com" displayName="Awesome Computers" realm="spn:9a822147-348b-4e0e-8edf-899fe8c117d4@495c4a5e-38b7-49b9-a90f-4c0050b2d7f7" />
			<issuer name="treyresearchinc.onmicrosoft.com" displayName="Trey Research Inc." realm="spn:9a822147-348b-4e0e-8edf-899fe8c117d4@13292593-4861-4847-8441-6da6751cfb86" />
		</issuers>

5.	Open the login.jsp file and replace the import declaration com.microsoft.samples.federation with com.microsoft.samples.waad.federation.

		<%@ page import="com.microsoft.samples.waad.federation.*"%>

6.	Replace the old link (created for the first trusted issuer) with the following snippet to list all the trusted issuers from the XML repository:

		<ul>
		<%
			TrustedIssuersRepository repository = new TrustedIssuersRepository();
			for (TrustedIssuer trustedIssuer : repository.getTrustedIdentityProviderUrls()) { %>
			<li><a
				href="<%=trustedIssuer.getLoginURL(request.getParameter("returnUrl"))%>"><%=trustedIssuer.getDisplayName()%></a>
			</li>
		<%	} %>
		</ul>

7.	Open the FederationServlet.java file and replace the FederatedLoginManager class with ConfigurableFederatedLoginManager.

		ConfigurableFederatedLoginManager loginManager = ConfigurableFederatedLoginManager.fromRequest(request, new SampleAuthenticationListener());

8.	Also in the FederationServlet.java file, replace the import declaration com.microsoft.samples.federation.FederatedLoginManager with com.microsoft.samples.waad.federation.ConfigurableFederatedLoginManager.

	![step8] (../../../DevCenter/Java/Media/javastep4step8.png)		

9.	Open the FederationFilter.java file and replace the FederatedLoginManager class with ConfigurableFederatedLoginManager.
	
		ConfigurableFederatedLoginManager loginManager = ConfigurableFederatedLoginManager.fromRequest(httpRequest);

10.	Also in the FederationFilter.java file, replace the import declaration com.microsoft.samples.federation.FederatedLoginManager with com.microsoft.samples.waad.federation.ConfigurableFederatedLoginManager.

	![step10] (../../../DevCenter/Java/Media/javastep4step10.png)		

11.	Right-click the sample project and select Run As -> Run on Server, and you should see a list with the links for each trusted identity provider retrieved from the “trusted.issuers.xml” repository.

	![step11] (../../../DevCenter/Java/Media/javastep4step11.png)		

	*Note: The home realm discovery strategy of presenting an explicit list of trusted providers is not always feasible in practice. Here it is used for the sake of simplicity.*

	Once you see the list of the trusted identity providers in your browser, you can navigate to either provider: the authentication flow will unfold in the same way described in the former section. The application will validate the incoming token accordingly. You can try to delete entries in trusted.issuers.xml, as it would happen, for example, once a subscription expires, and verify that the application then will reject authentication attempts from the corresponding provider. 

<h2><a name="appendix"></a>Appendix: Deploying to JBOSS on Solaris</h2>
This sample has been tested on JBOSS 7.1 running on Solaris. 

**To deploy to JBOSS on Solaris:**

1.	Download the Virtualbox Solaris appliance from [http://www.oracle.com/technetwork/server-storage/solaris11/downloads/virtual-machines-1355605.html](http://www.oracle.com/technetwork/server-storage/solaris11/downloads/virtual-machines-1355605.html)

	*Note: you must have an Oracle account to download the bits and accept the license when downloading it.*

2.	Import the Solaris Virtualbox Appliance (README inside the OracleSolaris11_11-11_VM.zip file). 

	*Note: DO NOT INSTALL THE VM ADDITIONS as that might cause serious performance issues*

3.	Once the machine is up and running, open a Terminal window.

4.	Copy WAAD.WebSSO.Java.ZIP to the Downloads folder

5.	Go to the Downloads folder

	cd ~/Downloads

6.	Unzip the contents of the drop:

	unzip ./WAAD.WebSSO.Java.ZIP -d ./ilex

7.	Download JBoss 7.1:

	curl http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip -o ./jboss-as-7.1.1.Final.zip

8.	Unzip the JBoss 7.1 contents 

	unzip ./jboss-as-7.1.1.Final.zip -d ./

9.	Open the standalone configuration file with GEdit from the Teminal:

	gedit ./jboss-as-7.1.1.Final/standalone/configuration/standalone.xml

10.	Locate the node with the urn:jboss:domain:web:1.1 namespace, and replace the node by this one. Replace the user_name value with the current user (username used to login to Solaris VM) 

			<subsystem xmlns="urn:jboss:domain:web:1.1" native="false" default-virtual-server="default-host">
		    <configuration>
		        <jsp-configuration development="true"/>
		    </configuration>
		    <connector name="http" protocol="HTTP/1.1" scheme="http" socket-binding="http" redirect-port="8443"/>
		    <connector name="https" protocol="HTTP/1.1" scheme="https" socket-binding="https" enable-lookups="false" secure="true">
		        <ssl password="Passw0rd!" certificate-key-file="/home/{user_name}/Downloads/ilex/java/assets/https.keystore" protocol="TLSv1" verify-client="false" certificate-file="/home/{user_name}/Downloads/ilex/java/assets/https.keystore"/>
		    </connector>
		    <virtual-server name="default-host" enable-welcome-root="true">
		        <alias name="localhost"/>
		        <alias name="example.com"/>
		    </virtual-server>
		</subsystem>

	
11.	Save the file, close GEdit and return to the Terminal window

12.	Go to the server folder. 

	cd ~/Downloads/jboss-as-7.1.1.Final/bin

13.	Start the server 

	./standalone.sh

**To deploy the WAR file:**

1.	Open a new Terminal window.

2.	Copy in the Download folder the WAR created in the walkthrough

3.	Go to the server folder. 

	cd ~/Downloads/jboss-as-7.1.1.Final/bin

4.	Run the JBoss client to deploy the application.

	./jboss-cli.sh

5.	Connect to the server.

	connect

6.	Deploy the application using the file downloaded in the first step.

	deploy ~/Downloads/sample.war --force

Open a browser and navigate to [https://localhost:8443/sample/](https://localhost:8443/sample/)







