---
title: Exception Management - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: mitigations for threats exposed in the Threat Modeling Tool 
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
ms.devlang: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib

---

# Security Frame: Exception Management | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **WCF** | <ul><li>[WCF- Do not include serviceDebug node in configuration file](#servicedebug)</li><li>[WCF- Do not include serviceMetadata node in configuration file](#servicemetadata)</li></ul> |
| **Web API** | <ul><li>[Ensure that proper exception handling is done in ASP.NET Web API](#exception)</li></ul> |
| **Web Application** | <ul><li>[Do not expose security details in error messages](#messages)</li><li>[Implement Default error handling page](#default)</li><li>[Set Deployment Method to Retail in IIS](#deployment)</li><li>[Exceptions should fail safely](#fail)</li></ul> |

## <a id="servicedebug"></a>WCF- Do not include serviceDebug node in configuration file

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_debug_information) |
| **Steps** | Windows Communication Framework (WCF) services can be configured to expose debugging information. Debug information should not be used in production environments. The `<serviceDebug>` tag defines whether the debug information feature is enabled for a WCF service. If the attribute includeExceptionDetailInFaults is set to true, exception information from the application will be returned to clients. Attackers can leverage the additional information they gain from debugging output to mount attacks targeted on the framework, database, or other resources used by the application. |

### Example
The following configuration file includes the `<serviceDebug>` tag: 
```
<configuration> 
<system.serviceModel> 
<behaviors> 
<serviceBehaviors> 
<behavior name=""MyServiceBehavior""> 
<serviceDebug includeExceptionDetailInFaults=""True"" httpHelpPageEnabled=""True""/> 
... 
```
Disable debugging information in the service. This can be accomplished by removing the `<serviceDebug>` tag from your application's configuration file. 

## <a id="servicemetadata"></a>WCF- Do not include serviceMetadata node in configuration file

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Generic, NET Framework 3 |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_service_enumeration) |
| **Steps** | Publicly exposing information about a service can provide attackers with valuable insight into how they might exploit the service. The `<serviceMetadata>` tag enables the metadata publishing feature. Service metadata could contain sensitive information that should not be publicly accessible. At a minimum, only allow trusted users to access the metadata and ensure that unnecessary information is not exposed. Better yet, entirely disable the ability to publish metadata. A safe WCF configuration will not contain the `<serviceMetadata>` tag. |

## <a id="exception"></a>Ensure that proper exception handling is done in ASP.NET Web API

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | MVC 5, MVC 6 |
| **Attributes**              | N/A  |
| **References**              | [Exception Handling in ASP.NET Web API](https://www.asp.net/web-api/overview/error-handling/exception-handling), [Model Validation in ASP.NET Web API](https://www.asp.net/web-api/overview/formats-and-model-binding/model-validation-in-aspnet-web-api) |
| **Steps** | By default, most uncaught exceptions in ASP.NET Web API are translated into an HTTP response with status code `500, Internal Server Error`|

### Example
To control the status code returned by the API, `HttpResponseException` can be used as shown below: 
```csharp
public Product GetProduct(int id)
{
    Product item = repository.Get(id);
    if (item == null)
    {
        throw new HttpResponseException(HttpStatusCode.NotFound);
    }
    return item;
}
```

### Example
For further control on the exception response, the `HttpResponseMessage` class can be used as shown below: 
```csharp
public Product GetProduct(int id)
{
    Product item = repository.Get(id);
    if (item == null)
    {
        var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
        {
            Content = new StringContent(string.Format("No product with ID = {0}", id)),
            ReasonPhrase = "Product ID Not Found"
        }
        throw new HttpResponseException(resp);
    }
    return item;
}
```
To catch unhandled exceptions that are not of the type `HttpResponseException`, Exception Filters can be used. Exception filters implement the `System.Web.Http.Filters.IExceptionFilter` interface. The simplest way to write an exception filter is to derive from the `System.Web.Http.Filters.ExceptionFilterAttribute` class and override the OnException method. 

### Example
Here is a filter that converts `NotImplementedException` exceptions into HTTP status code `501, Not Implemented`: 
```csharp
namespace ProductStore.Filters
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http.Filters;

    public class NotImplExceptionFilterAttribute : ExceptionFilterAttribute 
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is NotImplementedException)
            {
                context.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }
        }
    }
}
```

There are several ways to register a Web API exception filter:
- By action
- By controller
- Globally

### Example
To apply the filter to a specific action, add the filter as an attribute to the action: 
```csharp
public class ProductsController : ApiController
{
    [NotImplExceptionFilter]
    public Contact GetContact(int id)
    {
        throw new NotImplementedException("This method is not implemented");
    }
}
```
### Example
To apply the filter to all of the actions on a `controller`, add the filter as an attribute to the `controller` class: 

```csharp
[NotImplExceptionFilter]
public class ProductsController : ApiController
{
    // ...
}
```

### Example
To apply the filter globally to all Web API controllers, add an instance of the filter to the `GlobalConfiguration.Configuration.Filters` collection. Exception filters in this collection apply to any Web API controller action. 
```csharp
GlobalConfiguration.Configuration.Filters.Add(
    new ProductStore.NotImplExceptionFilterAttribute());
```

### Example
For model validation, the model state can be passed to CreateErrorResponse method as shown below: 
```csharp
public HttpResponseMessage PostProduct(Product item)
{
    if (!ModelState.IsValid)
    {
        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
    }
    // Implementation not shown...
}
```

Check the links in the references section for additional details about exceptional handling and model validation in ASP.NET Web API 

## <a id="messages"></a>Do not expose security details in error messages

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Generic error messages are provided directly to the user without including sensitive application data. Examples of sensitive data include:</p><ul><li>Server names</li><li>Connection strings</li><li>Usernames</li><li>Passwords</li><li>SQL procedures</li><li>Details of dynamic SQL failures</li><li>Stack trace and lines of code</li><li>Variables stored in memory</li><li>Drive and folder locations</li><li>Application install points</li><li>Host configuration settings</li><li>Other internal application details</li></ul><p>Trapping all errors within an application and providing generic error messages, as well as enabling custom errors within IIS will help prevent information disclosure. SQL Server database and .NET Exception handling, among other error handling architectures, are especially verbose and extremely useful to a malicious user profiling your application. Do not directly display the contents of a class derived from the .NET Exception class, and ensure that you have proper exception handling so that an unexpected exception isn't inadvertently raised directly to the user.</p><ul><li>Provide generic error messages directly to the user that abstract away specific details found directly in the exception/error message</li><li>Do not display the contents of a .NET exception class directly to the user</li><li>Trap all error messages and if appropriate inform the user via a generic error message sent to the application client</li><li>Do not expose the contents of the Exception class directly to the user, especially the return value from `.ToString()`, or the values of the Message or StackTrace properties. Securely log this information and display a more innocuous message to the user</li></ul>|

## <a id="default"></a>Implement Default error handling page

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Edit ASP.NET Error Pages Settings Dialog Box](https://technet.microsoft.com/library/dd569096(WS.10).aspx) |
| **Steps** | <p>When an ASP.NET application fails and causes an HTTP/1.x 500 Internal Server Error, or a feature configuration (such as Request Filtering) prevents a page from being displayed, an error message will be generated. Administrators can choose whether or not the application should display a friendly message to the client, detailed error message to the client, or detailed error message to localhost only. The `<customErrors>` tag in the web.config has three modes:</p><ul><li>**On:** Specifies that custom errors are enabled. If no defaultRedirect attribute is specified, users see a generic error. The custom errors are shown to the remote clients and to the local host</li><li>**Off:** Specifies that custom errors are disabled. The detailed ASP.NET errors are shown to the remote clients and to the local host</li><li>**RemoteOnly:** Specifies that custom errors are shown only to the remote clients, and that ASP.NET errors are shown to the local host. This is the default value</li></ul><p>Open the `web.config` file for the application/site and ensure that the tag has either `<customErrors mode="RemoteOnly" />` or `<customErrors mode="On" />` defined.</p>|

## <a id="deployment"></a>Set Deployment Method to Retail in IIS

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [deployment Element (ASP.NET Settings Schema)](https://msdn.microsoft.com/library/ms228298(VS.80).aspx) |
| **Steps** | <p>The `<deployment retail>` switch is intended for use by production IIS servers. This switch is used to help applications run with the best possible performance and least possible security information leakages by disabling the application's ability to generate trace output on a page, disabling the ability to display detailed error messages to end users, and disabling the debug switch.</p><p>Often times, switches and options that are developer-focused, such as failed request tracing and debugging, are enabled during active development. It is recommended that the deployment method on any production server be set to retail. open the machine.config file and ensure that `<deployment retail="true" />` remains set to true.</p>|

## <a id="fail"></a>Exceptions should fail safely

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Fail securely](https://owasp.org/www-community/Fail_securely) |
| **Steps** | Application should fail safely. Any method that returns a Boolean value, based on which certain decision is made, should have exception block carefully created. There are lot of logical errors due to which security issues creep in, when the exception block is written carelessly.|

### Example
```csharp
        public static bool ValidateDomain(string pathToValidate, Uri currentUrl)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(pathToValidate))
                {
                    var domain = RetrieveDomain(currentUrl);
                    var replyPath = new Uri(pathToValidate);
                    var replyDomain = RetrieveDomain(replyPath);

                    if (string.Compare(domain, replyDomain, StringComparison.OrdinalIgnoreCase) != 0)
                    {
                        //// Adding additional check to enable CMS urls if they are not hosted on same domain.
                        if (!string.IsNullOrWhiteSpace(Utilities.CmsBase))
                        {
                            var cmsDomain = RetrieveDomain(new Uri(Utilities.Base.Trim()));
                            if (string.Compare(cmDomain, replyDomain, StringComparison.OrdinalIgnoreCase) != 0)
                            {
                                return false;
                            }
                            else
                            {
                                return true;
                            }
                        }

                        return false;
                    }
                }

                return true;
            }
            catch (UriFormatException ex)
            {
                LogHelper.LogException("Utilities:ValidateDomain", ex);
                return true;
            }
        }
```
The above method will always return True, if some exception happens. If the end user provides a malformed URL, that the browser respects, but the `Uri()` constructor doesn't, this will throw an exception, and the victim will be taken to the valid but malformed URL. 
