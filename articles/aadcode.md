<properties 
   pageTitle="Azure Active Directory Code Samples" 
   description="Article description that will be displayed on landing pages and in some search results" 
   services="active-directory" 
   documentationCenter="dev-center-name" 
   authors="msmbaldwin" 
   manager="mbaldwin" 
   editor=""/>

<tags
   ms.service="azure"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity" 
   ms.date="02/04/2015"
   ms.author="mbaldwin"/>

# Azure Active Directory Code Samples 


You can use Microsoft Azure Active Directory (Azure AD) to add authentication and authorization to your web applications and web APIs. This section links you to code samples that show you how it's done and code snippets that you can use in your applications. On the code sample page, you'll find detailed read-me topics that help with requirements, installation and set-up. And the code is commented to help you understand the critical sections.

To understand the basic scenario for each sample type, see Authentication Scenarios for Azure AD.

Contribute to our samples on GitHub: [Microsoft Azure Active Directory Samples and Documentation](https://github.com/AzureADSamples).

## Web Browser to Web Application 

These samples show how to write a web application directs the user’s browser to sign them in to Azure AD.

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-OpenIDConnect-DotNet">WebApp-OpenIDConnect-DotNet</a>
              </p>
            </td>
            <td>
              <p>Use OpenID Connect (ASP.Net OpenID Connect OWIN middleware) to authenticate users from an Azure AD tenant.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-MultiTenant-OpenIdConnect-DotNet">WebApp-MultiTenant-OpenIdConnect-DotNet</a>
              </p>
            </td>
            <td>
              <p>A multi-tenant .NET MVC web application that uses OpenID Connect (ASP.Net OpenID Connect OWIN middleware) to authenticate users from multiple Azure AD tenants.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-WSFederation-DotNet">WebApp-WSFederation-DotNet</a>
              </p>
            </td>
            <td>
              <p>Use WS-Federation (ASP.Net WS-Federation OWIN middleware) to authenticate users from an Azure AD tenant.</p>
            </td>
          </tr>
        </table>



## Single Page Application (SPA)

This sample shows how to write a single page application secured with Azure AD.  

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>JavaScript, C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/SinglePageApp-DotNet">SinglePageApp-DotNet</a>
              </p>
            </td>
            <td>
              <p>Use ADAL for JavaScript and Azure AD to secure an AngularJS-based single page app implemented with an ASP.NET web API back end.</p>
            </td>
          </tr>
        </table>

## Native Application to Web API
 
These code samples show how to build native client applications that call web APIs that are secured by Azure AD. They use [Azure AD Authentication Library (ADAL)](http://go.microsoft.com/fwlink/?LinkID=258232) and [OAuth 2.0 in Azure AD](https://msdn.microsoft.com/en-us/library/azure/dn645545.aspx).
 
<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-DotNet">NativeClient-DotNet</a>
              </p>
            </td>
            <td>
              <p>A .NET WPF application that calls a web API that is secured by using Azure AD. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-WindowsStore">NativeClient-WindowsStore</a>
              </p>
            </td>
            <td>
              <p>A Windows Store application that calls a web API that is secured with Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/NativeClient-WebAPI-MultiTenant-WindowsStore">NativeClient-WebAPI-MultiTenant-WindowsStore</a>
              </p>
            </td>
            <td>
              <p>A Windows Store application calling a multi-tenant web API that is secured with Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebAPI-OnBehalfOf-DotNet">WebAPI-OnBehalfOf-DotNet</a>
              </p>
            </td>
            <td>
              <p>A native client application that calls a web API, which gets a token to act on behalf of the original user, and then uses the token to call another web API.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/NativeClient-WindowsPhone8.1">NativeClient-WindowsPhone8.1</a>
              </p>
            </td>
            <td>
              <p>A Windows Store application for Windows Phone 8.1 that calls a web API that is secured by Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>ObjC</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-iOS">NativeClient-iOS</a>
              </p>
            </td>
            <td>
              <p>An iOS application that calls a web API that requires Azure AD for authentication.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebAPI-ManuallyValidateJwt-DotNet">WebAPI-ManuallyValidateJwt-DotNet</a>
              </p>
            </td>
            <td>
              <p>A native client application that includes logic to process a JWT token in a web API, instead of using OWIN middleware.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/Xamarin</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/NativeClient-Xamarin-Android">NativeClient-Xamarin-Android</a>
              </p>
            </td>
            <td>
              <p>A Xamarin binding to the native Azure AD Authentication Library (ADAL) for the Android library.e</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/Xamarin</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-Xamarin-iOS">NativeClient-Xamarin-iOS</a>
              </p>
            </td>
            <td>
              <p>A Xamarin binding to the native Azure AD Authentication Library (ADAL) for iOS.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/Xamarin</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-MultiTarget-DotNet">NativeClient-MultiTarget-DotNet</a>
              </p>
            </td>
            <td>
              <p>A Xamarin project that targets five platforms and calls a web API that is secured by Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/NativeClient-Headless-DotNet">NativeClient-Headless-DotNet</a>
              </p>
            </td>
            <td>
              <p>A native application that performs non-interactive authentication and calls a web API that is secured by Azure AD.</p>
            </td>
          </tr>
        </table>

## Web Application to Web API

These code samples show how use [OAuth 2.0 in Azure AD](https://msdn.microsoft.com/en-us/library/azure/dn645545.aspx) to build web applications that call web APIs that are secured by Azure AD.

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet">WebApp-WebAPI-OpenIDConnect-DotNet</a>
              </p>
            </td>
            <td>
              <p>Call a web API with the signed-in user's permissions.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-WebAPI-OAuth2-AppIdentity-DotNet">WebApp-WebAPI-OAuth2-AppIdentity-DotNet</a>
              </p>
            </td>
            <td>
              <p>Call a web API with the application's permissions.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-WebAPI-OAuth2-UserIdentity-Dotnet">WebApp-WebAPI-OAuth2-UserIdentity-Dotnet</a>
              </p>
            </td>
            <td>
              <p>Add authorization with <a href="https://msdn.microsoft.com/en-us/library/azure/dn645545.aspx">OAuth 2.0 in Azure AD</a> to an existing web application so it can call a web API.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>JavaScript</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebAPI-Nodejs">WebAPI-Nodejs</a>
              </p>
            </td>
            <td>
              <p>Set up a REST API service that's integrated with Azure AD for API protection. Includes a Node.js server with a Web API.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet">WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet</a>
              </p>
            </td>
            <td>
              <p>A multi-tenant MVC web application that uses OpenID Connect (ASP.Net OpenID Connect OWIN middleware) to authenticate users from an Azure AD tenant. Uses an authorization code to invoke the Graph API.</p>
            </td>
          </tr>
        </table>

## Server or Daemon Application to Web API

These code samples show how to build a daemon or server application that gets resources from a web API by using [Azure AD Authentication Library (ADAL)](http://go.microsoft.com/fwlink/?LinkID=258232) and [OAuth 2.0 in Azure AD](https://msdn.microsoft.com/en-us/library/azure/dn645545.aspx).

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/Daemon-DotNet">Daemon-DotNet</a>
              </p>
            </td>
            <td>
              <p>A console application calls a web API. The client credential is a password.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/Daemon-CertificateCredential-DotNet">Daemon-CertificateCredential-DotNet</a>
              </p>
            </td>
            <td>
              <p>A console application that calls a web API. The client credential is a certificate.</p>
            </td>
          </tr>
        </table>

## Calling Azure AD Graph API

These code sample show how to build applications that call the Azure AD Graph API to read and write directory data.

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>Java</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-GraphAPI-Java">WebApp-GraphAPI-Java</a>
              </p>
            </td>
            <td>
              <p>A web application that uses the Graph API to access Azure AD directory data.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>PHP</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-GraphAPI-PHP">WebApp-GraphAPI-PHP</a>
              </p>
            </td>
            <td>
              <p>A web application that uses the Graph API to access Azure AD directory data.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://github.com/AzureADSamples/WebApp-GraphAPI-DotNet">WebApp-GraphAPI-DotNet</a>
              </p>
            </td>
            <td>
              <p>A web application that uses the Graph API to access Azure AD directory data.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/ConsoleApp-GraphAPI-DotNet">ConsoleApp-GraphAPI-DotNet</a>
              </p>
            </td>
            <td>
              <p>This console app demonstrates common Read and Write calls to the Graph API, and shows how to execute user license assignment and update a user's thumbnail photo and links.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/ConsoleApp-GraphAPI-DiffQuery-DotNet">ConsoleApp-GraphAPI-DiffQuery-DotNet</a>
              </p>
            </td>
            <td>
              <p>A console application that uses the differential query in the Graph API to get periodic changes to user objects in an Azure AD tenant.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-GraphAPI-DirectoryExtensions-DotNet">WebApp-GraphAPI-DirectoryExtensions-DotNet</a>
              </p>
            </td>
            <td>
              <p>An MVC application uses Graph API queries to generate a simple company organizational chart.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>PHP</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-GraphAPI-DirectoryExtensions-PHP">WebApp-GraphAPI-DirectoryExtensions-PHP</a>
              </p>
            </td>
            <td>
              <p>A PHP application that calls the Graph API to register an extension and then read, update, and delete values in the extension attribute.</p>
            </td>
          </tr>
        </table>

## Authorization

These code samples show how to use Azure AD for authorization.

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Sample
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-GroupClaims-DotNet">WebApp-GroupClaims-DotNet</a>
              </p>
            </td>
            <td>
              <p>Perform role based access control (RBAC) using Azure Active Directory group claims in an application that is integrated with Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://github.com/AzureADSamples/WebApp-RoleClaims-DotNet">WebApp-RoleClaims-DotNet</a>
              </p>
            </td>
            <td>
              <p>Perform role based access control (RBAC) using Azure Active Directory application roles in an application that is integrated with Azure AD.</p>
            </td>
          </tr>
        </table>

## Legacy Walkthroughs

These walkthroughs use slightly older technology, but still might be of interest.

<table>
          <tr>
            <th>
									Language/Platform
								</th>
            <th>
									Name
								</th>
            <th>
									Description
								</th>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=331694">Role-Based and ACL-Based Authorization in a Windows Azure AD Application</a>
              </p>
            </td>
            <td>
              <p>Perform role-based authorization (RBAC) and ACL-based authorization in an application that is integrated with Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=330605">AAL - Windows Store app to REST service - Authentication</a>
              </p>
            </td>
            <td>
              <p>Use <a href="http://go.microsoft.com/fwlink/?LinkID=258232">Azure AD Authentication Library (ADAL)</a> (formerly AAL) for Windows Store Beta to add user authentication capabilities to a Windows Store app.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=259814">ADAL - Native App to REST service - Authentication with AAD via Browser Dialog</a>
              </p>
            </td>
            <td>
              <p>Use <a href="http://go.microsoft.com/fwlink/?LinkID=258232">Azure AD Authentication Library (ADAL)</a> to add user authentication capabilities to a WPF client.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://code.msdn.microsoft.com/AAL-Native-App-to-REST-de57f2cc">ADAL - Native App to REST service - Authentication with ACS via Browser Dialog</a>
              </p>
            </td>
            <td>
              <p>Use <a href="http://go.microsoft.com/fwlink/?LinkID=258232">Azure AD Authentication Library (ADAL)</a> and <a href="http://msdn.microsoft.com/library/azure/hh147631.aspx">Access Control Service 2.0 (ACS)</a> to add user authentication capabilities to a WPF client.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=259816">ADAL - Server to Server Authentication</a>
              </p>
            </td>
            <td>
              <p>Use <a href="http://go.microsoft.com/fwlink/?LinkID=258232">Azure AD Authentication Library (ADAL)</a> to secure service calls from a server side process to an MVC4 Web API REST service.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://msdn.microsoft.com/en-us/library/azure/dn151790.aspx">Adding Sign-On to Your Web Application Using Azure AD</a>
              </p>
            </td>
            <td>
              <p>Configure a .NET application to perform web single sign-on against your Azure AD enterprise directory.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://msdn.microsoft.com/en-us/library/azure/dn151789.aspx">Developing Multi-Tenant Web Applications with Azure AD</a>
              </p>
            </td>
            <td>
              <p>Use Azure AD to add to the single sign-on and directory access capabilities of one .NET application to work across multiple organizations.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>JAVA</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=263969">Java Sample App for Azure AD Graph API</a>
              </p>
            </td>
            <td>
              <p>Use the Graph API to access directory data from Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>PHP</p>
            </td>
            <td>
              <p>
                <a href="http://code.msdn.microsoft.com/PHP-Sample-App-For-Windows-228c6ddb">PHP Sample App for Azure AD Graph API</a>
              </p>
            </td>
            <td>
              <p>Use the Graph API to access directory data from Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkID=262648">Sample App for Azure AD Graph API</a>
              </p>
            </td>
            <td>
              <p>Use the Graph API to access directory data from Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=275398">Sample App for Azure AD Graph Differential Query</a>
              </p>
            </td>
            <td>
              <p>Use the differential query in the Graph API to get periodic changes to user objects in an Azure AD tenant.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="http://go.microsoft.com/fwlink/?LinkId=275397">Sample App for Integrating Multi-Tenant Cloud Application for Azure AD</a>
              </p>
            </td>
            <td>
              <p>Integrate a multi-tenant application into Azure AD.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://msdn.microsoft.com/en-us/library/azure/dn169448.aspx">Securing a Windows Store Application and REST Web Service Using Azure AD (Preview)</a>
              </p>
            </td>
            <td>
              <p>Create a simple web API resource and a Windows Store client application using Azure AD and the <a href="http://go.microsoft.com/fwlink/?LinkID=258232">Azure AD Authentication Library (ADAL)</a>.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>C#/.NET</p>
            </td>
            <td>
              <p>
                <a href="https://msdn.microsoft.com/en-us/library/azure/dn151791.aspx">Using the Graph API to Query Azure AD</a>
              </p>
            </td>
            <td>
              <p>Configure a Microsoft .NET application to use the Azure AD Graph API to access data from an Azure AD tenant directory.</p>
            </td>
          </tr>
        </table>


## See also

##### Other Resources


[Azure AD Graph API Helper Library](http://code.msdn.microsoft.com/Windows-Azure-AD-Graph-API-a8c72e18) 

[Developing Modern Applications using OAuth and Active Directory Federation Services](http://msdn.microsoft.com/en-us/library/dn633593.aspx)

