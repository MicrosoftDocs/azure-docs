---
title: Authorization - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: mitigations for threats exposed in the Threat Modeling Tool 
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: security
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib

---

# Security Frame: Authorization | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| **Machine Trust Boundary** | <ul><li>[Ensure that proper ACLs are configured to restrict unauthorized access to data on the device](#acl-restricted-access)</li><li>[Ensure that sensitive user-specific application content is stored in user-profile directory](#sensitive-directory)</li><li>[Ensure that the deployed applications are run with least privileges](#deployed-privileges)</li></ul> |
| **Web Application** | <ul><li>[Enforce sequential step order when processing business logic flows](#sequential-logic)</li><li>[Implement rate limiting mechanism to prevent enumeration](#rate-enumeration)</li><li>[Ensure that proper authorization is in place and principle of least privileges is followed](#principle-least-privilege)</li><li>[Business logic and resource access authorization decisions should not be based on incoming request parameters](#logic-request-parameters)</li><li>[Ensure that content and resources are not enumerable or accessible via forceful browsing](#enumerable-browsing)</li></ul> |
| **Database** | <ul><li>[Ensure that least-privileged accounts are used to connect to Database server](#privileged-server)</li><li>[Implement Row Level Security RLS to prevent tenants from accessing each other's data](#rls-tenants)</li><li>[Sysadmin role should only have valid necessary users](#sysadmin-users)</li></ul> |
| **IoT Cloud Gateway** | <ul><li>[Connect to Cloud Gateway using least-privileged tokens](#cloud-least-privileged)</li></ul> |
| **Azure Event Hub** | <ul><li>[Use a send-only permissions SAS Key for generating device tokens](#sendonly-sas)</li><li>[Do not use access tokens that provide direct access to the Event Hub](#access-tokens-hub)</li><li>[Connect to Event Hub using SAS keys that have the minimum permissions required](#sas-minimum-permissions)</li></ul> |
| **Azure Document DB** | <ul><li>[Use resource tokens to connect to Azure Cosmos DB whenever possible](#resource-docdb)</li></ul> |
| **Azure Trust Boundary** | <ul><li>[Enable fine-grained access management to Azure Subscription using RBAC](#grained-rbac)</li></ul> |
| **Service Fabric Trust Boundary** | <ul><li>[Restrict client's access to cluster operations using RBAC](#cluster-rbac)</li></ul> |
| **Dynamics CRM** | <ul><li>[Perform security modeling and use Field Level Security where required](#modeling-field)</li></ul> |
| **Dynamics CRM Portal** | <ul><li>[Perform security modeling of portal accounts keeping in mind that the security model for the portal differs from the rest of CRM](#portal-security)</li></ul> |
| **Azure Storage** | <ul><li>[Grant fine-grained permission on a range of entities in Azure Table Storage](#permission-entities)</li><li>[Enable Role-Based Access Control (RBAC) to Azure storage account using Azure Resource Manager](#rbac-azure-manager)</li></ul> |
| **Mobile Client** | <ul><li>[Implement implicit jailbreak or rooting detection](#rooting-detection)</li></ul> |
| **WCF** | <ul><li>[Weak Class Reference in WCF](#weak-class-wcf)</li><li>[WCF-Implement Authorization control](#wcf-authz)</li></ul> |
| **Web API** | <ul><li>[Implement proper authorization mechanism in ASP.NET Web API](#authz-aspnet)</li></ul> |
| **IoT Device** | <ul><li>[Perform authorization checks in the device if it supports various actions that require different permission levels](#device-permission)</li></ul> |
| **IoT Field Gateway** | <ul><li>[Perform authorization checks in the Field Gateway if it supports various actions that require different permission levels](#field-permission)</li></ul> |

## <a id="acl-restricted-access"></a>Ensure that proper ACLs are configured to restrict unauthorized access to data on the device

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that proper ACLs are configured to restrict unauthorized access to data on the device|

## <a id="sensitive-directory"></a>Ensure that sensitive user-specific application content is stored in user-profile directory

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that sensitive user-specific application content is stored in user-profile directory. This is to prevent multiple users of the machine from accessing each other's data.|

## <a id="deployed-privileges"></a>Ensure that the deployed applications are run with least privileges

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that the deployed application is run with least privileges. |

## <a id="sequential-logic"></a>Enforce sequential step order when processing business logic flows

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | In order to verify that this stage was run through by a genuine user you want to enforce the application to only process business logic flows in sequential step order, with all steps being processed in realistic human time, and not process out of order, skipped steps, processed steps from another user, or too quickly submitted transactions.|

## <a id="rate-enumeration"></a>Implement rate limiting mechanism to prevent enumeration

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that sensitive identifiers are random. Implement CAPTCHA control on anonymous pages. Ensure that error and exception should not reveal specific data|

## <a id="principle-least-privilege"></a>Ensure that proper authorization is in place and principle of least privileges is followed

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>The principle means giving a user account only those privileges which are essential to that users work. For example, a backup user does not need to install software: hence, the backup user has rights only to run backup and backup-related applications. Any other privileges, such as installing new software, are blocked. The principle applies also to a personal computer user who usually does work in a normal user account, and opens a privileged, password protected account (that is, a superuser) only when the situation absolutely demands it. </p><p>This principle can also be applied to your web-applications. Instead of solely depending on role-based authentication methods using sessions, we rather want to assign privileges to users by means of a Database-Based Authentication system. We still use sessions in order to identify if the user was logged in correctly, only now instead of assigning that user with a specific role we assign him with privileges to verify which actions he is privileged to perform on the system. Also a big pro of this method is, whenever a user has to be assigned fewer privileges your changes will be applied on the fly since the assigning does not depend on the session which otherwise had to expire first.</p>|

## <a id="logic-request-parameters"></a>Business logic and resource access authorization decisions should not be based on incoming request parameters

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Whenever you are checking whether a user is restricted to review certain data, the access restrictions should be processed server-side. The userID should be stored inside of a session variable on login and should be used to retrieve user data from the database |

### Example
```SQL
SELECT data 
FROM personaldata 
WHERE userID=:id < - session var 
```
Now an possible attacker can not tamper and change the application operation since the identifier for retrieving the data is handled server-side.

## <a id="enumerable-browsing"></a>Ensure that content and resources are not enumerable or accessible via forceful browsing

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Sensitive static and configuration files should not be kept in the web-root. For content not required to be public, either proper access controls should be applied or removal of the content itself.</p><p>Also, forceful browsing is usually combined with Brute Force techniques to gather information by attempting to access as many URLs as possible to enumerate directories and files on a server. Attackers may check for all variations of commonly existing files. For example, a password file search would encompass files including psswd.txt, password.htm, password.dat, and other variations.</p><p>To mitigate this, capabilities for detection of brute force attempts should be included.</p>|

## <a id="privileged-server"></a>Ensure that least-privileged accounts are used to connect to Database server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [SQL Database permissions hierarchy](https://msdn.microsoft.com/library/ms191465), [SQL database securables](https://msdn.microsoft.com/library/ms190401) |
| **Steps** | Least-privileged accounts should be used to connect to the database. Application login should be restricted in the database and should only execute selected stored procedures. Application's login should have no direct table access. |

## <a id="rls-tenants"></a>Implement Row Level Security RLS to prevent tenants from accessing each other's data

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Sql Azure, OnPrem |
| **Attributes**              | SQL Version - V12, SQL Version - MsSQL2016 |
| **References**              | [SQL Server Row-Level Security (RLS)](https://msdn.microsoft.com/library/azure/dn765131.aspx) |
| **Steps** | <p>Row-Level Security enables customers to control access to rows in a database table based on the characteristics of the user executing a query (e.g., group membership or execution context).</p><p>Row-Level Security (RLS) simplifies the design and coding of security in your application. RLS enables you to implement restrictions on data row access. For example ensuring that workers can access only those data rows that are pertinent to their department, or restricting a customer's data access to only the data relevant to their company.</p><p>The access restriction logic is located in the database tier rather than away from the data in another application tier. The database system applies the access restrictions every time that data access is attempted from any tier. This makes the security system more reliable and robust by reducing the surface area of the security system.</p><p>|

Please note that RLS as an out-of-the-box database feature is applicable only to SQL Server starting 2016 and Azure SQL database. If the out-of-the-box RLS feature is not implemented, it should be ensured that data access is restricted Using Views and Procedures

## <a id="sysadmin-users"></a>Sysadmin role should only have valid necessary users

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [SQL Database permissions hierarchy](https://msdn.microsoft.com/library/ms191465), [SQL database securables](https://msdn.microsoft.com/library/ms190401) |
| **Steps** | Members of the SysAdmin fixed server role should be very limited and never contain accounts used by applications.  Please review the list of users in the role and remove any unnecessary accounts|

## <a id="cloud-least-privileged"></a>Connect to Cloud Gateway using least-privileged tokens

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Gateway choice - Azure IoT Hub |
| **References**              | [Iot Hub Access Control](https://azure.microsoft.com/documentation/articles/iot-hub-devguide/#Security) |
| **Steps** | Provide least privilege permissions to various components that connect to Cloud Gateway (IoT Hub). Typical example is – Device management/provisioning component uses registryread/write, Event Processor (ASA) uses Service Connect. Individual devices connect using Device credentials|

## <a id="sendonly-sas"></a>Use a send-only permissions SAS Key for generating device tokens

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Event Hub | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Event Hubs authentication and security model overview](https://azure.microsoft.com/documentation/articles/event-hubs-authentication-and-security-model-overview/) |
| **Steps** | A SAS key is used to generate individual device tokens. Use a send-only permissions SAS key while generating the device token for a given publisher|

## <a id="access-tokens-hub"></a>Do not use access tokens that provide direct access to the Event Hub

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Event Hub | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Event Hubs authentication and security model overview](https://azure.microsoft.com/documentation/articles/event-hubs-authentication-and-security-model-overview/) |
| **Steps** | A token that grants direct access to the event hub should not be given to the device. Using a least privileged token for the device that gives access only to a publisher would help identify and blacklist it if found to be a rogue or compromised device.|

## <a id="sas-minimum-permissions"></a>Connect to Event Hub using SAS keys that have the minimum permissions required

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Event Hub | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Event Hubs authentication and security model overview](https://azure.microsoft.com/documentation/articles/event-hubs-authentication-and-security-model-overview/) |
| **Steps** | Provide least privilege permissions to various back-end applications that connect to the Event Hub. Generate separate SAS keys for each back-end application and only provide the required permissions - Send, Receive or Manage to them.|

## <a id="resource-docdb"></a>Use resource tokens to connect to Cosmos DB whenever possible

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Document DB | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | A resource token is associated with an Azure Cosmos DB permission resource and captures the relationship between the user of a database and the permission that user has for a specific Azure Cosmos DB application resource (e.g. collection, document). Always use a resource token to access the Azure Cosmos DB if the client cannot be trusted with handling master or read-only keys - like an end user application like a mobile or desktop client.Use Master key or read-only keys from backend applications which can store these keys securely.|

## <a id="grained-rbac"></a>Enable fine-grained access management to Azure Subscription using RBAC

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Trust Boundary | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Use role assignments to manage access to your Azure subscription resources](https://azure.microsoft.com/documentation/articles/role-based-access-control-configure/)  |
| **Steps** | Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can grant only the amount of access that users need to perform their jobs.|

## <a id="cluster-rbac"></a>Restrict client's access to cluster operations using RBAC

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure |
| **References**              | [Role-based access control for Service Fabric clients](https://azure.microsoft.com/documentation/articles/service-fabric-cluster-security-roles/) |
| **Steps** | <p>Azure Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure.</p><p>Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.</p><p>You specify the two client roles (administrator and client) at the time of cluster creation by providing separate certificates for each.</p>|

## <a id="modeling-field"></a>Perform security modeling and use Field Level Security where required

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Perform security modeling and use Field Level Security where required|

## <a id="portal-security"></a>Perform security modeling of portal accounts keeping in mind that the security model for the portal differs from the rest of CRM

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM Portal | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Perform security modeling of portal accounts keeping in mind that the security model for the portal differs from the rest of CRM|

## <a id="permission-entities"></a>Grant fine-grained permission on a range of entities in Azure Table Storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | StorageType - Table |
| **References**              | [How to delegate access to objects in your Azure storage account using SAS](https://azure.microsoft.com/documentation/articles/storage-security-guide/#_data-plane-security) |
| **Steps** | In certain business scenarios, Azure Table Storage may be required to store sensitive data that caters to different parties. E.g., sensitive data pertaining to different countries/regions. In such cases, SAS signatures can be constructed by specifying the partition and row key ranges, such that a user can access data specific to a particular country/region.| 

## <a id="rbac-azure-manager"></a>Enable Role-Based Access Control (RBAC) to Azure storage account using Azure Resource Manager

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [How to secure your storage account with Role-Based Access Control (RBAC)](https://azure.microsoft.com/documentation/articles/storage-security-guide/#management-plane-security) |
| **Steps** | <p>When you create a new storage account, you select a deployment model of Classic or Azure Resource Manager. The Classic model of creating resources in Azure only allows all-or-nothing access to the subscription, and in turn, the storage account.</p><p>With the Azure Resource Manager model, you put the storage account in a resource group and control access to the management plane of that specific storage account using Azure Active Directory. For example, you can give specific users the ability to access the storage account keys, while other users can view information about the storage account, but cannot access the storage account keys.</p>|

## <a id="rooting-detection"></a>Implement implicit jailbreak or rooting detection

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Mobile Client | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>Application should safeguard its own configuration and user data in case if phone is rooted or jail broken. Rooting/jail breaking implies unauthorized access, which normal users won't do on their own phones. Therefore application should have implicit detection logic on application startup, to detect if the phone has been rooted.</p><p>The detection logic can be simply accessing files which normally only root user can access, for example:</p><ul><li>/system/app/Superuser.apk</li><li>/sbin/su</li><li>/system/bin/su</li><li>/system/xbin/su</li><li>/data/local/xbin/su</li><li>/data/local/bin/su</li><li>/system/sd/xbin/su</li><li>/system/bin/failsafe/su</li><li>/data/local/su</li></ul><p>If the application can access any of these files, it denotes that the application is running as root user.</p>|

## <a id="weak-class-wcf"></a>Weak Class Reference in WCF

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_weak_class_reference) |
| **Steps** | <p>The system uses a weak class reference, which might allow an attacker to execute unauthorized code. The program references a user-defined class that is not uniquely identified. When .NET loads this weakly identified class, the CLR type loader searches for the class in the following locations in the specified order:</p><ol><li>If the assembly of the type is known, the loader searches the configuration file's redirect locations, GAC, the current assembly using configuration information, and the application base directory</li><li>If the assembly is unknown, the loader searches the current assembly, mscorlib, and the location returned by the TypeResolve event handler</li><li>This CLR search order can be modified with hooks such as the Type Forwarding mechanism and the AppDomain.TypeResolve event</li></ol><p>If an attacker exploits the CLR search order by creating an alternative class with the same name and placing it in an alternative location that the CLR will load first, the CLR will unintentionally execute the attacker-supplied code</p>|

### Example
The `<behaviorExtensions/>` element of the WCF configuration file below instructs WCF to add a custom behavior class to a particular WCF extension.
```
<system.serviceModel>
    <extensions>
        <behaviorExtensions>
            <add name=""myBehavior"" type=""MyBehavior"" />
        </behaviorExtensions>
    </extensions>
</system.serviceModel>
```
Using fully qualified (strong) names uniquely identifies a type and further increases security of your system. Use fully qualified assembly names when registering types in the machine.config and app.config files.

### Example
The `<behaviorExtensions/>` element of the WCF configuration file below instructs WCF to add strongly-referenced custom behavior class to a particular WCF extension.
```
<system.serviceModel>
    <extensions>
        <behaviorExtensions>
            <add name=""myBehavior"" type=""Microsoft.ServiceModel.Samples.MyBehaviorSection, MyBehavior,
            Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"" />
        </behaviorExtensions>
    </extensions>
</system.serviceModel>
```

## <a id="wcf-authz"></a>WCF-Implement Authorization control

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_weak_class_reference) |
| **Steps** | <p>This service does not use an authorization control. When a client calls a particular WCF service, WCF provides various authorization schemes that verify that the caller has permission to execute the service method on the server. If authorization controls are not enabled for WCF services, an authenticated user can achieve privilege escalation.</p>|

### Example
The following configuration instructs WCF to not check the authorization level of the client when executing the service:
```
<behaviors>
    <serviceBehaviors>
        <behavior>
            ...
            <serviceAuthorization principalPermissionMode=""None"" />
        </behavior>
    </serviceBehaviors>
</behaviors>
```
Use a service authorization scheme to verify that the caller of the service method is authorized to do so. WCF provides two modes and allows the definition of a custom authorization scheme. The UseWindowsGroups mode uses Windows roles and users and the UseAspNetRoles mode uses an ASP.NET role provider, such as SQL Server, to authenticate.

### Example
The following configuration instructs WCF to make sure that the client is part of the Administrators group before executing the Add service:
```
<behaviors>
    <serviceBehaviors>
        <behavior>
            ...
            <serviceAuthorization principalPermissionMode=""UseWindowsGroups"" />
        </behavior>
    </serviceBehaviors>
</behaviors>
```
The service is then declared as the following:
```
[PrincipalPermission(SecurityAction.Demand,
Role = ""Builtin\\Administrators"")]
public double Add(double n1, double n2)
{
double result = n1 + n2;
return result;
}
```

## <a id="authz-aspnet"></a>Implement proper authorization mechanism in ASP.NET Web API

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic, MVC5 |
| **Attributes**              | N/A, Identity Provider - ADFS, Identity Provider - Azure AD |
| **References**              | [Authentication and Authorization in ASP.NET Web API](https://www.asp.net/web-api/overview/security/authentication-and-authorization-in-aspnet-web-api) |
| **Steps** | <p>Role information for the application users can be derived from Azure AD or ADFS claims if the application relies on them as Identity provider or the application itself might provided it. In any of these cases, the custom authorization implementation should validate the user role information.</p><p>Role information for the application users can be derived from Azure AD or ADFS claims if the application relies on them as Identity provider or the application itself might provided it. In any of these cases, the custom authorization implementation should validate the user role information.</p>

### Example
```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
public class ApiAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
{
        public async override Task OnAuthorizationAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            if (actionContext == null)
            {
                throw new Exception();
            }

            if (!string.IsNullOrEmpty(base.Roles))
            {
                bool isAuthorized = ValidateRoles(actionContext);
                if (!isAuthorized)
                {
                    HandleUnauthorizedRequest(actionContext);
                }
            }

            base.OnAuthorization(actionContext);
        }

public bool ValidateRoles(actionContext)
{
   //Authorization logic here; returns true or false
}

}
```
All the controllers and action methods which needs to protected should be decorated with above attribute.
```csharp
[ApiAuthorize]
public class CustomController : ApiController
{
     //Application code goes here
}
```

## <a id="device-permission"></a>Perform authorization checks in the device if it supports various actions that require different permission levels

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Device | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>The Device should authorize the caller to check if the caller has the required permissions to perform the action requested. For e.g. Lets say the device is a Smart Door Lock that can be monitored from the cloud, plus it provides functionalities like Remotely locking the door.</p><p>The Smart Door Lock provides unlocking functionality only when someone physically comes near the door with a Card. In this case, the implementation of the remote command and control should be done in such a way that it does not provide any functionality to unlock the door as the cloud gateway is not authorized to send a command to unlock the door.</p>|

## <a id="field-permission"></a>Perform authorization checks in the Field Gateway if it supports various actions that require different permission levels

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | The Field Gateway should authorize the caller to check if the caller has the required permissions to perform the action requested. For e.g. there should be different permissions for an admin user interface/API used to configure a field gateway v/s devices that connect to it.|
