<properties urlDisplayName="Web SSO" pageTitle="Single sign-on with Azure Active Directory (Java)" metaKeywords="Azure Java web app, Azure single sign-on, Azure Java Active Directory" description="Learn how to create a Java web application that uses single sign-on with Azure Active Directory." metaCanonical="" services="active-directory" documentationCenter="Java" title="Web Single Sign-On with Java and Azure Active Directory" authors="mbaldwin" solutions="" manager="mbaldwin" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="Java" ms.topic="article" ms.date="11/24/2014" ms.author="mbaldwin" />






# Web Single Sign-On with Java and Azure Active Directory

<h2><a name="introduction"></a>Introduction</h2>

This tutorial will show Java developers how to leverage Azure Active Directory to enable single sign-on for users of Office 365 customers. You will learn how to:

* Provision the web application in a customer's tenant
* Protect the application using WS-Federation

<h3>Prerequisites</h3>
This tutorial uses a specific application server, but if you are an experienced Java developer, the process described below can be applied to other environments as well. The following development environment prerequisites are required for this tutorial:

* [Java Sample Code for Azure Active Directory]
* [Java Runtime Environment 1.6]
* [JBoss Application Server version 7.1.1.Final]
* [JBoss Developer Studio IDE]
* Internet Information Services (IIS) 7.5 with SSL enabled
* Windows PowerShell
* [Office 365 PowerShell Commandlets]

<h3>Table of Contents</h3>
* [Introduction][]
* [Step 1: Create a Java Application][]
* [Step 2: Provision the Application in a Company's Directory Tenant][]
* [Step 3: Protect the Application Using WS-Federation for Employee Sign In][]
* [Summary][]

<h2><a name="createapp"></a>Step 1: Create a Java Application</h2>
This step describes how to create a simple Java application that will represent a protected resource. Access to this resource will be granted through federated authentication managed by the company's STS, which is described later in the tutorial.

1. Open a new instance of JBoss Developer Studio.
2. From the **File** menu, click **New**, then click **Project...**. 
3. On the **New Project** dialog, expand the **Maven** folder, click **Maven Project**, then click **Next**.
4. On the **New Maven Project** dialog, check **Create a simple project (skip archetype selection)**, then click **Next**.
5. On the next page of the **New Maven Project** dialog, type *sample* in the **Group Id** and **Artifact Id** text boxes. Then, select the **war** from the **Packaging** drop-down menu and click **Finish**.
6. The new Maven project will be created. In the **Project Explorer** menu on the left, expand the **sample** project, right-click the **pom.xml** file, click **Open With**, then click **Text Editor**.
7. In the **pom.xml** file, add the following XML inside the *&lt;project&gt;* section:

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

	After you have entered this XML, save the **pom.xml** file.

8. Right-click the **sample** project and click **Maven**, then click **Update Maven Project**. In the **Update Maven Project** dialog, click **OK**. This step will update your project with the **pom.xml** changes.

10. Right-click the **sample** project, click **New**, then click **JSP File**. 

11. On the **New JSP File** dialog, change the path for the new file to *sample/src/main/webapp*. Then, name the file **index.jsp** and click **Finish**.

12. The new **index.jsp** file will open automatically. Replace the automatically generated code with the following, then save the file:

		<%@ page language="java" contentType="text/html; charset=ISO-8859-1"  pageEncoding="ISO-8859-1"%>
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

13. Right-click the **sample** project and click **Run As**, then click **Run on Server**.

14. On the **Run On Server** dialog, ensure that **JBoss Enterprise Application Platform 6.x** is selected, then click **Finished**.

<h2><a name="provisionapp"></a>Step 2: Provision the Application in a Company's Directory Tenant</h2>
This step describes how an administrator of an Azure Active Directory customer provisions the Java application in their tenant and configures single sign-on. After this step is accomplished, the company's employees can authenticate to the web application using their Office 365 accounts.

The provisioning process begins by creating a new Service Principal for the application. Service Principals are used by Azure Active Directory to register and authenticate applications to the directory.

1. Download and install the Office 365 PowerShell Commandlets if you haven't done so already.
2. From the **Start** menu, run the **Microsoft Online Services Module for Windows PowerShell** console. This console provides a command-line environment for configuring attributes about your Office 365 tenant, such as creating and modifying Service Principals.
3. To import the required **MSOnlineExtended** module, type the following command and press Enter:

		Import-Module MSOnlineExtended -Force
4. To connect to your Office 365 directory, you will need to provide the company's administrator credentials. Type the following command and press Enter, then enter your credential's at the prompt:

		Connect-MsolService
5. Now you will create a new Service Principal for the application. Type the following command and press Enter:

		New-MsolServicePrincipal -ServicePrincipalNames @("javaSample/localhost") -DisplayName "Federation Sample Website" -Type Symmetric -Usage Verify -StartDate "12/01/2012" -EndDate "12/01/2013" 
This step will output information similar to the following:

		The following symmetric key was created as one was not supplied qY+Drf20Zz+A4t2w e3PebCopoCugO76My+JMVsqNBFc=
		DisplayName           : Federation Sample Java Website
		ServicePrincipalNames : {javaSample/localhost}
		ObjectId              : 59cab09a-3f5d-4e86-999c-2e69f682d90d
		AppPrincipalId        : 7829c758-2bef-43df-a685-717089474505
		TrustedForDelegation  : False
		AccountEnabled        : True
		KeyType               : Symmetric
		KeyId                 : f1735cbe-aa46-421b-8a1c-03b8f9bb3565
		StartDate             : 12/01/2012 08:00:00 a.m.
		EndDate               : 12/01/2013 08:00:00 a.m.
		Usage                 : Verify 
	> [WACOM.NOTE]
    > You should save this output, especially the generated symmetric key. This key is only revealed to you during Service Principal creation, and you will be unable to retrieve it in the future. The other values are required for using the Graph API to read and write information in the directory.

6. The final step sets the reply URL for your application. The reply URL is where responses are sent following authentication attempts. Type the following commands and press enter:

		$replyUrl = New-MsolServicePrincipalAddresses -Address "https://localhost:8443/sample" 

		Set-MsolServicePrincipal -AppPrincipalId "7829c758-2bef-43df-a685-717089474505" -Addresses $replyUrl 
	
The web application has now been provisioned in the directory and it can be used for web single sign-on by company employees.

<h2><a name="protectapp"></a>Step 3: Protect the Application Using WS-Federation for Employee Sign In</h2>
This step shows you how to add support for federated login using Windows Identity Foundation (WIF) and the **waad-federation** library you downloaded as part of the sample code package in the prerequisites. You will also add a login page and configure trust between the application and the directory tenant.

1. In JBoss Developer Studio, click **File**, then click **Import**.

2. On the **Import** dialog, expand the **Maven** folder, click **Existing Maven Projects**, then click **Next**.

3. On the **Import Maven Projects** dialog, set the **Root Directory** path to the location where you downloaded the **waad-federation** library in the sample code. Then, select the checkbox next to the **pom.xml** file from the **waad-federation** project and click **Finish**.

4. Expand the **sample** project, right-click the **pom.xml** file, click **Open With**, then click **Text Editor**.

5. In the **pom.xml** file, add the following XML inside the *&lt;project&gt;* section, then save the file:

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

6. Right-click the **sample** project, click **Maven**, then click **Update Project**. In the **Update Maven Project** dialog, click **OK**. This step will update your project with the **pom.xml** changes.

7. Right-click the **sample** project, click **New**, then click **Filter**.

8. In the **Create Filter** dialog, type *FederationFilter* for the **Class name** entry, then click **Finish**.

9. The automatically generated **FederationFilter.java** file will open. Replace its code with the following code and save the file:

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
		import com.microsoft.samples.federation.FederatedLoginManager; import com.microsoft.samples.federation.URLUTF8Encoder;

		public class FederationFilter implements Filter {
			private String loginPage;
			private String allowedRegex;
			public void init(FilterConfig config) throws ServletException {
				this.loginPage = config.getInitParameter("login-page-url");
				this.allowedRegex = config.getInitParameter("allowed-regex");
			}
			public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
					if (request instanceof HttpServletRequest) { 
						HttpServletRequest httpRequest = (HttpServletRequest) request;
						if (!httpRequest.getRequestURL().toString().contains(this.loginPage)) {
							FederatedLoginManager loginManager = FederatedLoginManager.fromRequest(httpRequest);
							boolean allowedUrl = Pattern.compile(this.allowedRegex).matcher(httpRequest.getRequestURL().toString()).find();
							if (!allowedUrl && !loginManager.isAuthenticated()) {
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

10. In **Project Explorer**, expand the **src**, then **main**, then **webapp** folders. Right-click the **web.xml** file, click **Open With**, then click **Text Editor**.

11. In the **web.xml** file, you will add a filter to handle secured and unsecured pages, and it will also redirect unauthenticated users to the login page (specified as the **login-page-url** filter parameter). However, if a URL matches the regex specified in the **allowed-regex** filter parameter, it will not be filtered. Add the following XML within the *&lt;web-app&gt;* section, then save the **web.xml** file.  


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

12. To create a login page, right-click the **sample** project, click **New**, then click **JSP File**. 

13. On the **New JSP File** dialog, change the path for the new file to *sample/src/main/webapp*. Then, name the file **login.jsp** and click **Finish**.

14. The new **login.jsp** file will open automatically. Replace the automatically generated code with the following, then save the file:

		<%@ page language="java" contentType="text/html; charset=ISO-8859-1"  pageEncoding="ISO-8859-1"%>
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

15. In **Project Explorer**, expand the **/src/main** folder of the **sample** project. Right-click the **resources** folder, click **New**, then click **Other**.

16. From the **New** dialog, expand the **JBoss Tools Web** folder, click **Properties File**, then click **Next**.

17. On the **New File Properties** dialog, name the file **federation**, then click **Finish**.

18. In **Project Explorer**, expand the **src/main/resources** folder of the **sample** project. Right-click the **federation.properties** file, click **Open With**, then click **Text Editor**.

19. In the **federation.properties** file, include the following configuration entries, then save the file:

		federation.trustedissuers.issuer=https://accounts.accesscontrol.windows.net/v2/wsfederation
		federation.trustedissuers.thumbprint=qY+Drf20Zz+A4t2we3PebCopoCugO76My+JMVsqNBFc=
		federation.trustedissuers.friendlyname=Fabrikam
		federation.audienceuris=spn:7829c758-2bef-43df-a685-717089474505
		federation.realm=spn:7829c758-2bef-43df-a685-717089474505
		federation.reply=https://localhost:8443/sample/wsfed-saml 

	> [WACOM.NOTE]
    > The **audienceuris** and **realm** values must be prefaced by "spn:".

20. Now you need to create a new Servlet. Right-click the **sample** project, click **New**, click **Other**, then click **Servlet**. 

21. On the **Create Servlet** dialog, provide a **Class name** of *FederationServlet* and click **Finish**.

22. The **FederationServlet.java** file is automatically opened. Replace its contents with the following code, then save the file:

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


23. In **Project Explorer**, expand the **src/main/webapp/WEB-INF** folder. Right-click the **web.xml** file, click **Open With**, then click **Text Editor**.

24. In the **web.xml** file, replace the **/FederationServlet** setting in the *&lt;url-pattern&gt;* section with **/ws-saml**. For example:

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

25. In **Project Explorer**, expand the **src/main/webapp** folder. Right-click the **index.jsp** file, click **Open With**, then click **Text Editor**.

26. In the **index.jsp** file, replace the existing code with the following code, then save the file:

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
				<% for (Claim claim : FederatedLoginManager.fromRequest(request).getClaims()) { %>
				<li><%= claim.toString()%></li>
				<%  } %>
			</ul>
		</body>
		</html> 

27. In **Project Explorer**, expand the **src/main/webapp/WEB-INF** folder. Right-click the **web.xml** file, click **Open With**, then click **Text Editor**.

28. We will now enable SSL for the application. In the **web.xml** file, insert the following *&lt;security-constraint&gt;* section within the *&lt;web-app&gt;* section, then save the file: 

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

	> [WACOM.NOTE]
    > Before proceeding, ensure that JBoss Server is already configured to support SSL.

29. Now we are ready to run the application end-to-end. Right-click the **sample** project, click **Run As**, then click **Run On Server**. Accept the values that you specified before, and click **Finish**.

30. The JBoss browser will open the login page. If you click on the **Awesome Computers** link, you will be redirected to the Office 365 Identity Provider page, where you can log in using your directory tenant credentials. For example, *john.doe@fabrikam.onmicrosoft.com*.

31. After you have logged in, you will be redirected again to the secured page (**sample/index.jsp**) as an authenticated user.

<h2><a name="summary"></a>Summary</h2>
This tutorial has shown you how to create and configure a single tenant Java application that uses the single sign-on capabilities of Azure Active Directory.

[Introduction]: #introduction
[Step 1: Create a Java Application]: #createapp
[Step 2: Provision the Application in a Company's Directory Tenant]: #provisionapp
[Step 3: Protect the Application Using WS-Federation for Employee Sign In]: #protectapp
[Summary]: #summary
[Developing Multi-Tenant Cloud Applications with Azure Active Directory]: http://g.microsoftonline.com/0AX00en/121
[Windows Identity Foundation 3.5 SDK]: http://www.microsoft.com/en-us/download/details.aspx?id=4451
[Windows Identity Foundation 1.0 Runtime]: http://www.microsoft.com/en-us/download/details.aspx?id=17331
[Office 365 Powershell Commandlets]: http://onlinehelp.microsoft.com/en-us/office365-enterprises/ff652560.aspx
[ASP.NET MVC 3]: http://www.microsoft.com/en-us/download/details.aspx?id=4211
[Java Runtime Environment 1.6]: http://www.oracle.com/technetwork/java/javase/downloads/index.html
[Java Sample Code for Azure Active Directory]: https://github.com/WindowsAzure/azure-sdk-for-java-samples/tree/master/WAAD.WebSSO.JAVA
[JBoss Application Server version 7.1.1.Final]: http://www.jboss.org/jbossas/downloads/
[JBoss Developer Studio IDE]: https://devstudio.jboss.com/earlyaccess/
