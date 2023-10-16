---
title: Configuration management for the Microsoft Threat Modeling Tool 
titleSuffix: Azure
description: Learn about configuration management for the Threat Modeling Tool. See mitigation information and view code examples.
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: security
ms.subservice: security-develop
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib
ms.custom: "devx-track-js, devx-track-csharp"
---

# Security Frame: Configuration Management | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **Web Application** | <ul><li>[Implement Content Security Policy (CSP), and disable inline JavaScript](#csp-js)</li><li>[Enable browser's XSS filter](#xss-filter)</li><li>[ASP.NET applications must disable tracing and debugging prior to deployment](#trace-deploy)</li><li>[Access third-party JavaScripts from trusted sources only](#js-trusted)</li><li>[Ensure that authenticated ASP.NET pages incorporate UI Redressing or click-jacking defenses](#ui-defenses)</li><li>[Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web Applications](#cors-aspnet)</li><li>[Enable ValidateRequest attribute on ASP.NET Pages](#validate-aspnet)</li><li>[Use locally hosted latest versions of JavaScript libraries](#local-js)</li><li>[Disable automatic MIME sniffing](#mime-sniff)</li><li>[Remove standard server headers on Windows Azure Web Sites to avoid fingerprinting](#standard-finger)</li></ul> |
| **Database** | <ul><li>[Configure a Windows Firewall for Database Engine Access](#firewall-db)</li></ul> |
| **Web API** | <ul><li>[Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web API](#cors-api)</li><li>[Encrypt sections of Web API's configuration files that contain sensitive data](#config-sensitive)</li></ul> |
| **IoT Device** | <ul><li>[Ensure that all admin interfaces are secured with strong credentials](#admin-strong)</li><li>[Ensure that unknown code cannot execute on devices](#unknown-exe)</li><li>[Encrypt OS and other partitions of IoT Device with BitLocker](#partition-iot)</li><li>[Ensure that only the minimum services/features are enabled on devices](#min-enable)</li></ul> |
| **IoT Field Gateway** | <ul><li>[Encrypt OS and other partitions of IoT Field Gateway with BitLocker](#field-bit-locker)</li><li>[Ensure that the default login credentials of the field gateway are changed during installation](#default-change)</li></ul> |
| **IoT Cloud Gateway** | <ul><li>[Ensure that the Cloud Gateway implements a process to keep the connected devices firmware up to date](#cloud-firmware)</li></ul> |
| **Machine Trust Boundary** | <ul><li>[Ensure that devices have end-point security controls configured as per organizational policies](#controls-policies)</li></ul> |
| **Azure Storage** | <ul><li>[Ensure secure management of Azure storage access keys](#secure-keys)</li><li>[Ensure that only trusted origins are allowed if CORS is enabled on Azure storage](#cors-storage)</li></ul> |
| **WCF** | <ul><li>[Enable WCF's service throttling feature](#throttling)</li><li>[WCF-Information disclosure through metadata](#info-metadata)</li></ul> | 

## <a id="csp-js"></a>Implement Content Security Policy (CSP), and disable inline JavaScript

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [An Introduction to Content Security Policy](https://www.html5rocks.com/en/tutorials/security/content-security-policy/), [Content Security Policy Reference](https://content-security-policy.com/), [Security features](https://developer.microsoft.com/microsoft-edge/platform/documentation/dev-guide/security/), [Introduction to content security policy](https://github.com/webplatform/webplatform.github.io/tree/master/docs/tutorials/content-security-policy), [Can I use CSP?](https://caniuse.com/#feat=contentsecuritypolicy) |
| **Steps** | <p>Content Security Policy (CSP) is a defense-in-depth security mechanism, a W3C standard, that enables web application owners to have control on the content embedded in their site. CSP is added as an HTTP response header on the web server and is enforced on the client side by browsers. It is an allowed list-based policy - a website can declare a set of trusted domains from which active content such as JavaScript can be loaded.</p><p>CSP provides the following security benefits:</p><ul><li>**Protection against XSS:** If a page is vulnerable to XSS, an attacker can exploit it in two ways:<ul><li>Inject `<script>malicious code</script>`. This exploit will not work due to CSP's Base Restriction-1</li><li>Inject `<script src="http://attacker.com/maliciousCode.js"/>`. This exploit will not work since the attacker-controlled domain will not be in CSP's allowed list of domains</li></ul></li><li>**Control over data exfiltration:** If any malicious content on a webpage attempts to connect to an external website and steal data, the connection will be aborted by CSP. This is because the target domain will not be in CSP's allowed list</li><li>**Defense against click-jacking:** click-jacking is an attack technique using which an adversary can frame a genuine website and force users to click on UI elements. Currently defense against click-jacking is achieved by configuring a response header- X-Frame-Options. Not all browsers respect this header and going forward CSP will be a standard way to defend against click-jacking</li><li>**Real-time attack reporting:** If there is an injection attack on a CSP-enabled website, browsers will automatically trigger a notification to an endpoint configured on the webserver. This way, CSP serves as a real-time warning system.</li></ul> |

### Example
Example policy: 
```csharp
Content-Security-Policy: default-src 'self'; script-src 'self' www.google-analytics.com 
```
This policy allows scripts to load only from the web application's server and google analytics server. Scripts loaded from any other site will be rejected. When CSP is enabled on a website, the following features are automatically disabled to mitigate XSS attacks. 

### Example
Inline scripts will not execute. Following are examples of inline scripts 
```JavaScript
<script> some JavaScript code </script>
Event handling attributes of HTML tags (for example, <button onclick="function(){}">
javascript:alert(1);
```

### Example
Strings will not be evaluated as code. 
```JavaScript
Example: var str="alert(1)"; eval(str);
```

## <a id="xss-filter"></a>Enable browser's XSS filter

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [XSS Protection Filter](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| **Steps** | <p>X-XSS-Protection response header configuration controls the browser's cross site script filter. This response header can have following values:</p><ul><li>`0:` This will disable the filter</li><li>`1: Filter enabled` If a cross-site scripting attack is detected, in order to stop the attack, the browser will sanitize the page</li><li>`1: mode=block : Filter enabled`. Rather than sanitize the page, when an XSS attack is detected, the browser will prevent rendering of the page</li><li>`1: report=http://[YOURDOMAIN]/your_report_URI : Filter enabled`. The browser will sanitize the page and report the violation.</li></ul><p>This is a Chromium function utilizing CSP violation reports to send details to a URI of your choice. The last two options are considered safe values.</p>|

## <a id="trace-deploy"></a>ASP.NET applications must disable tracing and debugging prior to deployment

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [ASP.NET Debugging Overview](/previous-versions/ms227556(v=vs.140)), [ASP.NET Tracing Overview](/previous-versions/bb386420(v=vs.140)), [How to: Enable Tracing for an ASP.NET Application](/previous-versions/0x5wc973(v=vs.140)), [How to: Enable Debugging for ASP.NET Applications](https://msdn.microsoft.com/library/e8z01xdh(VS.80).aspx) |
| **Steps** | When tracing is enabled for the page, every browser requesting it also obtains the trace information that contains data about internal server state and workflow. That information could be security sensitive. When debugging is enabled for the page, errors happening on the server result in a full stack trace data presented to the browser. That data may expose security-sensitive information about the server's workflow. |

## <a id="js-trusted"></a>Access third-party JavaScripts from trusted sources only

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Third-party JavaScripts should be referenced only from trusted sources. The reference endpoints should always be on TLS. |

## <a id="ui-defenses"></a>Ensure that authenticated ASP.NET pages incorporate UI Redressing or click-jacking defenses

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [OWASP click-jacking Defense Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html), [IE Internals - Combating click-jacking With X-Frame-Options](/archive/blogs/ieinternals/combating-clickjacking-with-x-frame-options) |
| **Steps** | <p>Click-jacking, also known as a "UI redress attack", is when an attacker uses multiple transparent or opaque layers to trick a user into clicking on a button or link on another page when they were intending to click on the top-level page.</p><p>This layering is achieved by crafting a malicious page with an iframe, which loads the victim's page. Thus, the attacker is "hijacking" clicks meant for their page and routing them to another page, most likely owned by another application, domain, or both. To prevent click-jacking attacks, set the proper X-Frame-Options HTTP response headers that instruct the browser to not allow framing from other domains</p>|

### Example
The X-FRAME-OPTIONS header can be set via IIS web.config. Web.config code snippet for sites that should never be framed: 
```csharp
    <system.webServer>
        <httpProtocol>
            <customHeader>
                <add name="X-FRAME-OPTIONS" value="DENY"/>
            </customHeaders>
        </httpProtocol>
    </system.webServer>
```

### Example
Web.config code for sites that should only be framed by pages in the same domain: 
```csharp
    <system.webServer>
        <httpProtocol>
            <customHeader>
                <add name="X-FRAME-OPTIONS" value="SAMEORIGIN"/>
            </customHeaders>
        </httpProtocol>
    </system.webServer>
```

## <a id="cors-aspnet"></a>Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web Applications

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Web Forms, MVC5 |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Browser security prevents a web page from making AJAX requests to another domain. This restriction is called the same-origin policy, and prevents a malicious site from reading sensitive data from another site. However, sometimes it might be required to expose APIs securely which other sites can consume. Cross Origin Resource Sharing (CORS) is a W3C standard that allows a server to relax the same-origin policy. Using CORS, a server can explicitly allow some cross-origin requests while rejecting others.</p><p>CORS is safer and more flexible than earlier techniques such as JSONP. At its core, enabling CORS translates to adding a few HTTP response headers (Access-Control-*) to the web application and this can be done in a couple of ways.</p>|

### Example
If access to Web.config is available, then CORS can be added through the following code: 
```xml
<system.webServer>
    <httpProtocol>
      <customHeaders>
        <clear />
        <add name="Access-Control-Allow-Origin" value="https://example.com" />
      </customHeaders>
    </httpProtocol>
```

### Example
If access to web.config is not available, then CORS can be configured by adding the following C# code: 
```csharp
HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", "https://example.com")
```

Note that it is critical to ensure that the list of origins in "Access-Control-Allow-Origin" attribute is set to a finite and trusted set of origins. Failing to configure this inappropriately (for example, setting the value as '*') will allow malicious sites to trigger cross origin requests to the web application >without any restrictions, thereby making the application vulnerable to CSRF attacks. 

## <a id="validate-aspnet"></a>Enable ValidateRequest attribute on ASP.NET Pages

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Web Forms, MVC5 |
| **Attributes**              | N/A  |
| **References**              | [Request Validation - Preventing Script Attacks](https://www.asp.net/whitepapers/request-validation) |
| **Steps** | <p>Request validation, a feature of ASP.NET since version 1.1, prevents the server from accepting content containing un-encoded HTML. This feature is designed to help prevent some script-injection attacks whereby client script code or HTML can be unknowingly submitted to a server, stored, and then presented to other users. We still strongly recommend that you validate all input data and HTML encode it when appropriate.</p><p>Request validation is performed by comparing all input data to a list of potentially dangerous values. If a match occurs, ASP.NET raises an `HttpRequestValidationException`. By default, Request Validation feature is enabled.</p>|

### Example
However, this feature can be disabled at page level: 
```xml
<%@ Page validateRequest="false" %> 
```
or, at application level 
```xml
<configuration>
   <system.web>
      <pages validateRequest="false" />
   </system.web>
</configuration>
```
Note that Request Validation feature is not supported, and is not part of MVC6 pipeline. 

## <a id="local-js"></a>Use locally-hosted latest versions of JavaScript libraries

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Developers using standard JavaScript libraries like JQuery must use approved versions of common JavaScript libraries that do not contain known security flaws. A good practice is to use the most latest version of the libraries, since they contain security fixes for known vulnerabilities in their older versions.</p><p>If the most recent release cannot be used due to compatibility reasons, the below minimum versions should be used.</p><p>Acceptable minimum versions:</p><ul><li>**JQuery**<ul><li>JQuery 1.7.1</li><li>JQueryUI 1.10.0</li><li>JQuery Validate 1.9</li><li>JQuery Mobile 1.0.1</li><li>JQuery Cycle 2.99</li><li>JQuery DataTables 1.9.0</li></ul></li><li>**Ajax Control Toolkit**<ul><li>Ajax Control Toolkit 40412</li></ul></li><li>**ASP.NET Web Forms and Ajax**<ul><li>ASP.NET Web Forms and Ajax 4</li><li>ASP.NET Ajax 3.5</li></ul></li><li>**ASP.NET MVC**<ul><li>ASP.NET MVC 3.0</li></ul></li></ul><p>Never load any JavaScript library from external sites such as public CDNs</p>|

## <a id="mime-sniff"></a>Disable automatic MIME sniffing

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [IE8 Security Part V: Comprehensive Protection](/archive/blogs/ie/ie8-security-part-v-comprehensive-protection), [MIME type](https://en.wikipedia.org/wiki/Mime_type) |
| **Steps** | The X-Content-Type-Options header is an HTTP header that allows developers to specify that their content should not be MIME-sniffed. This header is designed to mitigate MIME-Sniffing attacks. For each page that could contain user controllable content, you must use the HTTP Header X-Content-Type-Options:nosniff. To enable the required header globally for all pages in the application, you can do one of the following|

### Example
Add the header in the web.config file if the application is hosted by Internet Information Services (IIS) 7 onwards. 
```xml
<system.webServer>
<httpProtocol>
<customHeaders>
<add name="X-Content-Type-Options" value="nosniff"/>
</customHeaders>
</httpProtocol>
</system.webServer>
```

### Example
Add the header through the global Application\_BeginRequest 
```csharp
void Application_BeginRequest(object sender, EventArgs e)
{
this.Response.Headers["X-Content-Type-Options"] = "nosniff";
}
```

### Example
Implement custom HTTP module 
```csharp
public class XContentTypeOptionsModule : IHttpModule
{
#region IHttpModule Members
public void Dispose()
{
}
public void Init(HttpApplication context)
{
context.PreSendRequestHeaders += newEventHandler(context_PreSendRequestHeaders);
}
#endregion
void context_PreSendRequestHeaders(object sender, EventArgs e)
{
HttpApplication application = sender as HttpApplication;
if (application == null)
  return;
if (application.Response.Headers["X-Content-Type-Options "] != null)
  return;
application.Response.Headers.Add("X-Content-Type-Options ", "nosniff");
}
}
```

### Example
You can enable the required header only for specific pages by adding it to individual responses: 

```csharp
this.Response.Headers["X-Content-Type-Options"] = "nosniff";
```

## <a id="standard-finger"></a>Remove standard server headers on Windows Azure Web Sites to avoid fingerprinting

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | EnvironmentType - Azure |
| **References**              | [Removing standard server headers on Windows Azure Web Sites](https://azure.microsoft.com/blog/removing-standard-server-headers-on-windows-azure-web-sites/) |
| **Steps** | Headers such as Server, X-Powered-By, X-AspNet-Version reveal information about the server and the underlying technologies. It is recommended to suppress these headers thereby preventing fingerprinting the application |

## <a id="firewall-db"></a>Configure a Windows Firewall for Database Engine Access

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | SQL Azure, OnPrem |
| **Attributes**              | N/A, SQL Version - V12 |
| **References**              | [How to configure an Azure SQL Database firewall](/azure/azure-sql/database/firewall-configure), [Configure a Windows Firewall for Database Engine Access](/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access) |
| **Steps** | Firewall systems help prevent unauthorized access to computer resources. To access an instance of the SQL Server Database Engine through a firewall, you must configure the firewall on the computer running SQL Server to allow access |

## <a id="cors-api"></a>Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web API

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC 5 |
| **Attributes**              | N/A  |
| **References**              | [Enabling Cross-Origin Requests in ASP.NET Web API 2](https://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api), [ASP.NET Web API - CORS Support in ASP.NET Web API 2](/archive/msdn-magazine/2013/december/asp-net-web-api-cors-support-in-asp-net-web-api-2) |
| **Steps** | <p>Browser security prevents a web page from making AJAX requests to another domain. This restriction is called the same-origin policy, and prevents a malicious site from reading sensitive data from another site. However, sometimes it might be required to expose APIs securely which other sites can consume. Cross Origin Resource Sharing (CORS) is a W3C standard that allows a server to relax the same-origin policy.</p><p>Using CORS, a server can explicitly allow some cross-origin requests while rejecting others. CORS is safer and more flexible than earlier techniques such as JSONP.</p>|

### Example
In the App_Start/WebApiConfig.cs, add the following code to the WebApiConfig.Register method 
```csharp
using System.Web.Http;
namespace WebService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // New code
            config.EnableCors();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
```

### Example
EnableCors attribute can be applied to action methods in a controller as follows: 

```csharp
public class ResourcesController : ApiController
{
  [EnableCors("http://localhost:55912", // Origin
              null,                     // Request headers
              "GET",                    // HTTP methods
              "bar",                    // Response headers
              SupportsCredentials=true  // Allow credentials
  )]
  public HttpResponseMessage Get(int id)
  {
    var resp = Request.CreateResponse(HttpStatusCode.NoContent);
    resp.Headers.Add("bar", "a bar value");
    return resp;
  }
  [EnableCors("http://localhost:55912",       // Origin
              "Accept, Origin, Content-Type", // Request headers
              "PUT",                          // HTTP methods
              PreflightMaxAge=600             // Preflight cache duration
  )]
  public HttpResponseMessage Put(Resource data)
  {
    return Request.CreateResponse(HttpStatusCode.OK, data);
  }
  [EnableCors("http://localhost:55912",       // Origin
              "Accept, Origin, Content-Type", // Request headers
              "POST",                         // HTTP methods
              PreflightMaxAge=600             // Preflight cache duration
  )]
  public HttpResponseMessage Post(Resource data)
  {
    return Request.CreateResponse(HttpStatusCode.OK, data);
  }
}
```

Note that it is critical to ensure that the list of origins in EnableCors attribute is set to a finite and trusted set of origins. Failing to configure this inappropriately (for example, setting the value as '*') will allow malicious sites to trigger cross origin requests to the API without any restrictions, >thereby making the API vulnerable to CSRF attacks. EnableCors can be decorated at controller level. 

### Example
To disable CORS on a particular method in a class, the DisableCors attribute can be used as shown below: 
```csharp
[EnableCors("https://example.com", "Accept, Origin, Content-Type", "POST")]
public class ResourcesController : ApiController
{
  public HttpResponseMessage Put(Resource data)
  {
    return Request.CreateResponse(HttpStatusCode.OK, data);
  }
  public HttpResponseMessage Post(Resource data)
  {
    return Request.CreateResponse(HttpStatusCode.OK, data);
  }
  // CORS not allowed because of the [DisableCors] attribute
  [DisableCors]
  public HttpResponseMessage Delete(int id)
  {
    return Request.CreateResponse(HttpStatusCode.NoContent);
  }
}
```

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC 6 |
| **Attributes**              | N/A  |
| **References**              | [Enabling Cross-Origin Requests (CORS) in ASP.NET Core 1.0](https://docs.asp.net/en/latest/security/cors.html) |
| **Steps** | <p>In ASP.NET Core 1.0, CORS can be enabled either using middleware or using MVC. When using MVC to enable CORS the same CORS services are used, but the CORS middleware is not.</p>|

**Approach-1**
Enabling CORS with middleware: To enable CORS for the entire application add the CORS middleware to the request pipeline using the UseCors extension method. A cross-origin policy can be specified when adding the CORS middleware using the CorsPolicyBuilder class. There are two ways to do this:

### Example
The first is to call UseCors with a lambda. The lambda takes a CorsPolicyBuilder object: 
```csharp
public void Configure(IApplicationBuilder app)
{
    app.UseCors(builder =>
        builder.WithOrigins("https://example.com")
        .WithMethods("GET", "POST", "HEAD")
        .WithHeaders("accept", "content-type", "origin", "x-custom-header"));
}
```

### Example
The second is to define one or more named CORS policies, and then select the policy by name at run time. 
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            builder => builder.WithOrigins("https://example.com"));
    });
}
public void Configure(IApplicationBuilder app)
{
    app.UseCors("AllowSpecificOrigin");
    app.Run(async (context) =>
    {
        await context.Response.WriteAsync("Hello World!");
    });
}
```

**Approach-2**
Enabling CORS in MVC: Developers can alternatively use MVC to apply specific CORS per action, per controller, or globally for all controllers.

### Example
Per action: To specify a CORS policy for a specific action add the [EnableCors] attribute to the action. Specify the policy name. 
```csharp
public class HomeController : Controller
{
    [EnableCors("AllowSpecificOrigin")] 
    public IActionResult Index()
    {
        return View();
    }
```

### Example
Per controller: 
```csharp
[EnableCors("AllowSpecificOrigin")]
public class HomeController : Controller
{
```

### Example
Globally: 
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.Configure<MvcOptions>(options =>
    {
        options.Filters.Add(new CorsAuthorizationFilterFactory("AllowSpecificOrigin"));
    });
}
```
Note that it is critical to ensure that the list of origins in EnableCors attribute is set to a finite and trusted set of origins. Failing to configure this inappropriately (for example, setting the value as '*') will allow malicious sites to trigger cross origin requests to the API without any restrictions, >thereby making the API vulnerable to CSRF attacks. 

### Example
To disable CORS for a controller or action, use the [DisableCors] attribute. 
```csharp
[DisableCors]
    public IActionResult About()
    {
        return View();
    }
```

## <a id="config-sensitive"></a>Encrypt sections of Web API's configuration files that contain sensitive data

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [How To: Encrypt Configuration Sections in ASP.NET 2.0 Using DPAPI](/previous-versions/msp-n-p/ff647398(v=pandp.10)), [Specifying a Protected Configuration Provider](/previous-versions/68ze1hb2(v=vs.140)), [Using Azure Key Vault to protect application secrets](/azure/architecture/multitenant-identity/web-api) |
| **Steps** | Configuration files such as the Web.config, appsettings.json are often used to hold sensitive information, including user names, passwords, database connection strings, and encryption keys. If you do not protect this information, your application is vulnerable to attackers or malicious users obtaining sensitive information such as account user names and passwords, database names and server names. Based on the deployment type (azure/on-prem), encrypt the sensitive sections of config files using DPAPI or services like Azure Key Vault. |

## <a id="admin-strong"></a>Ensure that all admin interfaces are secured with strong credentials

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Any administrative interfaces that the device or field gateway exposes should be secured using strong credentials. Also, any other exposed interfaces like WiFi, SSH, File shares, FTP should be secured with strong credentials. Default weak passwords should not be used. |

## <a id="unknown-exe"></a>Ensure that unknown code cannot execute on devices

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Enabling Secure Boot and BitLocker Device Encryption on Windows 10 IoT Core](/windows/iot-core/secure-your-device/securebootandbitlocker) |
| **Steps** | UEFI Secure Boot restricts the system to only allow execution of binaries signed by a specified authority. This feature prevents unknown code from being executed on the platform and potentially weakening the security posture of it. Enable UEFI Secure Boot and restrict the list of certificate authorities that are trusted for signing code. Sign all code that is deployed on the device using one of the trusted authorities. |

## <a id="partition-iot"></a>Encrypt OS and other partitions of IoT Device with BitLocker

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Windows 10 IoT Core implements a lightweight version of BitLocker Device Encryption, which has a strong dependency on the presence of a TPM on the platform, including the necessary preOS protocol in UEFI that conducts the necessary measurements. These preOS measurements ensure that the OS later has a definitive record of how the OS was launched.Encrypt OS partitions using BitLocker and any other partitions also in case they store any sensitive data. |

## <a id="min-enable"></a>Ensure that only the minimum services/features are enabled on devices

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Do not enable or turn off any features or services in the OS that is not required for the functioning of the solution. For example, if the device does not require a UI to be deployed, install Windows IoT Core in headless mode. |

## <a id="field-bit-locker"></a>Encrypt OS and other partitions of IoT Field Gateway with BitLocker

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Windows 10 IoT Core implements a lightweight version of BitLocker Device Encryption, which has a strong dependency on the presence of a TPM on the platform, including the necessary preOS protocol in UEFI that conducts the necessary measurements. These preOS measurements ensure that the OS later has a definitive record of how the OS was launched.Encrypt OS partitions using BitLocker and any other partitions also in case they store any sensitive data. |

## <a id="default-change"></a>Ensure that the default login credentials of the field gateway are changed during installation

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that the default login credentials of the field gateway are changed during installation |

## <a id="cloud-firmware"></a>Ensure that the Cloud Gateway implements a process to keep the connected devices firmware up to date

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Gateway choice - Azure IoT Hub |
| **References**              | [IoT Hub Device Management Overview](../../iot-hub-device-update/device-update-agent-overview.md),[Device Update for Azure IoT Hub tutorial using the Raspberry Pi 3 B+ Reference Image](../../iot-hub-device-update/device-update-raspberry-pi.md). |
| **Steps** | LWM2M is a protocol from the Open Mobile Alliance for IoT Device Management. Azure IoT device management allows to interact with physical devices using device jobs. Ensure that the Cloud Gateway implements a process to routinely keep the device and other configuration data up to date using Azure IoT Hub Device Management. |

## <a id="controls-policies"></a>Ensure that devices have end-point security controls configured as per organizational policies

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that devices have end-point security controls such as BitLocker for disk-level encryption, anti-virus with updated signatures, host-based firewall, OS upgrades, group policies etc. are configured as per organizational security policies. |

## <a id="secure-keys"></a>Ensure secure management of Azure storage access keys

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Azure Storage security guide - Managing Your Storage Account Keys](../../storage/blobs/security-recommendations.md#identity-and-access-management) |
| **Steps** | <p>Key Storage: It is recommended to store the Azure Storage access keys in Azure Key Vault as a secret and have the applications retrieve the key from key vault. This is recommended due to the following reasons:</p><ul><li>The application will never have the storage key hardcoded in a configuration file, which removes that avenue of somebody getting access to the keys without specific permission</li><li>Access to the keys can be controlled using Microsoft Entra ID. This means an account owner can grant access to the handful of applications that need to retrieve the keys from Azure Key Vault. Other applications will not be able to access the keys without granting them permission specifically</li><li>Key Regeneration: It is recommended to have a process in place to regenerate Azure storage access keys for security reasons. Details on why and how to plan for key regeneration are documented in the Azure Storage Security Guide reference article</li></ul>|

## <a id="cors-storage"></a>Ensure that only trusted origins are allowed if CORS is enabled on Azure storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [CORS Support for the Azure Storage Services](/rest/api/storageservices/Cross-Origin-Resource-Sharing--CORS--Support-for-the-Azure-Storage-Services) |
| **Steps** | Azure Storage allows you to enable CORS – Cross Origin Resource Sharing. For each storage account, you can specify domains that can access the resources in that storage account. By default, CORS is disabled on all services. You can enable CORS by using the REST API or the storage client library to call one of the methods to set the service policies. |

## <a id="throttling"></a>Enable WCF's service throttling feature

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)), [Fortify Kingdom](https://vulncat.fortify.com) |
| **Steps** | <p>Not placing a limit on the use of system resources could result in resource exhaustion and ultimately a denial of service.</p><ul><li>**EXPLANATION:** Windows Communication Foundation (WCF) offers the ability to throttle service requests. Allowing too many client requests can flood a system and exhaust its resources. On the other hand, allowing only a small number of requests to a service can prevent legitimate users from using the service. Each service should be individually tuned to and configured to allow the appropriate amount of resources.</li><li>**RECOMMENDATIONS** Enable WCF's service throttling feature and set limits appropriate for your application.</li></ul>|

### Example
The following is an example configuration with throttling enabled:
```
<system.serviceModel> 
  <behaviors>
    <serviceBehaviors>
    <behavior name="Throttled">
    <serviceThrottling maxConcurrentCalls="[YOUR SERVICE VALUE]" maxConcurrentSessions="[YOUR SERVICE VALUE]" maxConcurrentInstances="[YOUR SERVICE VALUE]" /> 
  ...
</system.serviceModel> 
```

## <a id="info-metadata"></a>WCF-Information disclosure through metadata

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)), [Fortify Kingdom](https://vulncat.fortify.com) |
| **Steps** | Metadata can help attackers learn about the system and plan a form of attack. WCF services can be configured to expose metadata. Metadata gives detailed service description information and should not be broadcast in production environments. The `HttpGetEnabled` / `HttpsGetEnabled` properties of the ServiceMetaData class defines whether a service will expose the metadata | 

### Example
The code below instructs WCF to broadcast a service's metadata
```
ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
smb.HttpGetEnabled = true; 
smb.HttpGetUrl = new Uri(EndPointAddress); 
Host.Description.Behaviors.Add(smb); 
```
Do not broadcast service metadata in a production environment. Set the HttpGetEnabled / HttpsGetEnabled properties of the ServiceMetaData class to false. 

### Example
The code below instructs WCF to not broadcast a service's metadata. 
```
ServiceMetadataBehavior smb = new ServiceMetadataBehavior(); 
smb.HttpGetEnabled = false; 
smb.HttpGetUrl = new Uri(EndPointAddress); 
Host.Description.Behaviors.Add(smb);
```
