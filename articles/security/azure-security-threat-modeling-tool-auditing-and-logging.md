---
title: Auditing and Logging - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
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

# Security Frame: Auditing and Logging | Mitigations 

| Product/Service | Article |
| --------------- | ------- |
| **Dynamics CRM**    | <ul><li>[Identify sensitive entities in your solution and implement change auditing](#sensitive-entities)</li></ul> |
| **Web Application** | <ul><li>[Ensure that auditing and logging is enforced on the application](#auditing)</li><li>[Ensure that log rotation and separation are in place](#log-rotation)</li><li>[Ensure that the application does not log sensitive user data](#log-sensitive-data)</li><li>[Ensure that Audit and Log Files have Restricted Access](#log-restricted-access)</li><li>[Ensure that User Management Events are Logged](#user-management)</li><li>[Ensure that the system has inbuilt defenses against misuse](#inbuilt-defenses)</li><li>[Enable diagnostics logging for web apps in Azure App Service](#diagnostics-logging)</li></ul> |
| **Database** | <ul><li>[Ensure that login auditing is enabled on SQL Server](#identify-sensitive-entities)</li><li>[Enable Threat detection on Azure SQL](#threat-detection)</li></ul> |
| **Azure Storage** | <ul><li>[Use Azure Storage Analytics to audit access of Azure Storage](#analytics)</li></ul> |
| **WCF** | <ul><li>[Implement sufficient Logging](#sufficient-logging)</li><li>[Implement sufficient Audit Failure Handling](#audit-failure-handling)</li></ul> |
| **Web API** | <ul><li>[Ensure that auditing and logging is enforced on Web API](#logging-web-api)</li></ul> |
| **IoT Field Gateway** | <ul><li>[Ensure that appropriate auditing and logging is enforced on Field Gateway](#logging-field-gateway)</li></ul> |
| **IoT Cloud Gateway** | <ul><li>[Ensure that appropriate auditing and logging is enforced on Cloud Gateway](#logging-cloud-gateway)</li></ul> |

## <a id="sensitive-entities"></a>Identify sensitive entities in your solution and implement change auditing

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Dynamics CRM | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | Identify entities in your solution containing sensitive data and implement change auditing on those entities and fields |

## <a id="auditing"></a>Ensure that auditing and logging is enforced on the application

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | Enable auditing and logging on all components. Audit logs should capture user context. Identify all important events and log those events. Implement centralized logging |

## <a id="log-rotation"></a>Ensure that log rotation and separation are in place

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | <p>Log rotation is an automated process used in system administration in which dated log files are archived. Servers which run large applications often log every request: in the face of bulky logs, log rotation is a way to limit the total size of the logs while still allowing analysis of recent events. </p><p>Log separation basically means that you have to store your log files on a different partition as where your OS/application is running on in order to avert a Denial of service attack or the downgrading of your application its performance</p>|

## <a id="log-sensitive-data"></a>Ensure that the application does not log sensitive user data

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | <p>Check that you do not log any sensitive data that a user submits to your site. Check for intentional logging as well as side effects caused by design issues. Examples of sensitive data include:</p><ul><li>User Credentials</li><li>Social Security number or other identifying information</li><li>Credit card numbers or other financial information</li><li>Health information</li><li>Private keys or other data that could be used to decrypt encrypted information</li><li>System or application information that can be used to more effectively attack the application</li></ul>|

## <a id="log-restricted-access"></a>Ensure that Audit and Log Files have Restricted Access

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | <p>Check to ensure access rights to log files are appropriately set. Application accounts should have write-only access and operators and support personnel should have read-only access as needed.</p><p>Administrators accounts are the only accounts which should have full access. Check Windows ACL on log files to ensure they are properly restricted:</p><ul><li>Application accounts should have write-only access</li><li>Operators and support personnel should have read-only access as needed</li><li>Administrators are the only accounts that should have full access</li></ul>|

## <a id="user-management"></a>Ensure that User Management Events are Logged

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | <p>Ensure that the application monitors user management events such as successful and failed user logins, password resets, password changes, account lockout, user registration. Doing this helps to detect and react to potentially suspicious behavior. It also enables to gather operations data; for example, to track who is accessing the application</p>|

## <a id="inbuilt-defenses"></a>Ensure that the system has inbuilt defenses against misuse

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps**                   | <p>Controls should be in place which throw security exception in case of application misuse. E.g., If input validation is in place and an attacker attempts to inject malicious code that does not match the regex, a security exception can be thrown which can be an indicative of system misuse</p><p>For example, it is recommended to have security exceptions logged and actions taken for the following issues:</p><ul><li>Input validation</li><li>CSRF violations</li><li>Brute force (upper limit for number of requests per user per resource)</li><li>File upload violations</li><ul>|

## <a id="diagnostics-logging"></a>Enable diagnostics logging for web apps in Azure App Service

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | EnvironmentType - Azure |
| **References**              | N/A  |
| **Steps** | <p>Azure provides built-in diagnostics to assist with debugging an App Service web app. It also applies to API apps and mobile apps. App Service web apps provide diagnostic functionality for logging information from both the web server and the web application.</p><p>These are logically separated into web server diagnostics and application diagnostics</p>|

## <a id="identify-sensitive-entities"></a>Ensure that login auditing is enabled on SQL Server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Configure Login Auditing](https://msdn.microsoft.com/library/ms175850.aspx) |
| **Steps** | <p>Database Server login auditing must be enabled to detect/confirm password guessing attacks. It is important to capture failed login attempts. Capturing both successful and failed login attempts provides additional benefit during forensic investigations</p>|

## <a id="threat-detection"></a>Enable Threat detection on Azure SQL

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | SQL Azure |
| **Attributes**              | SQL Version - V12 |
| **References**              | [Get Started with SQL Database Threat Detection](https://azure.microsoft.com/documentation/articles/sql-database-threat-detection-get-started/)|
| **Steps** |<p>Threat Detection detects anomalous database activities indicating potential security threats to the database. It provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities.</p><p>Users can explore the suspicious events using Azure SQL Database Auditing to determine if they result from an attempt to access, breach or exploit data in the database.</p><p>Threat Detection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems</p>|

## <a id="analytics"></a>Use Azure Storage Analytics to audit access of Azure Storage

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage | 
| **SDL Phase**               | Deployment |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A |
| **References**              | [Using Storage Analytics to monitor authorization type](https://azure.microsoft.com/documentation/articles/storage-security-guide/#storage-analytics) |
| **Steps** | <p>For each storage account, one can enable Azure Storage Analytics to perform logging and store metrics data. The storage analytics logs provide important information such as authentication method used by someone when they access storage.</p><p>This can be really helpful if you are tightly guarding access to storage. For example, in Blob Storage you can set all of the containers to private and implement the use of an SAS service throughout your applications. Then you can check the logs regularly to see if your blobs are accessed using the storage account keys, which may indicate a breach of security, or if the blobs are public but they shouldn’t be.</p>|

## <a id="sufficient-logging"></a>Implement sufficient Logging

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_insufficient_logging) |
| **Steps** | <p>The lack of a proper audit trail after a security incident can hamper forensic efforts. Windows Communication Foundation (WCF) offers the ability to log successful and/or failed authentication attempts.</p><p>Logging failed authentication attempts can warn administrators of potential brute-force attacks. Similarly, logging successful authentication events can provide a useful audit trail when a legitimate account is compromised. Enable WCF's service security audit feature |

### Example
The following is an example configuration with auditing enabled
```
<system.serviceModel>
    <behaviors>
        <serviceBehaviors>
            <behavior name=""NewBehavior"">
                <serviceSecurityAudit auditLogLocation=""Default""
                suppressAuditFailure=""false"" 
                serviceAuthorizationAuditLevel=""SuccessAndFailure""
                messageAuthenticationAuditLevel=""SuccessAndFailure"" />
                ...
            </behavior>
        </servicebehaviors>
    </behaviors>
</system.serviceModel>
```

## <a id="audit-failure-handling"></a>Implement sufficient Audit Failure Handling

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | .NET Framework |
| **Attributes**              | N/A  |
| **References**              | [MSDN](https://msdn.microsoft.com/library/ff648500.aspx), [Fortify Kingdom](https://vulncat.fortify.com/en/detail?id=desc.config.dotnet.wcf_misconfiguration_insufficient_audit_failure_handling) |
| **Steps** | <p>Developed solution is configured not to generate an exception when it fails to write to an audit log. If WCF is configured not to throw an exception when it is unable to write to an audit log, the program will not be notified of the failure and auditing of critical security events may not occur.</p>|

### Example
The `<behavior/>` element of the WCF configuration file below instructs WCF to not notify the application when WCF fails to write to an audit log.
```
<behaviors>
    <serviceBehaviors>
        <behavior name="NewBehavior">
            <serviceSecurityAudit auditLogLocation="Application"
            suppressAuditFailure="true"
            serviceAuthorizationAuditLevel="Success"
            messageAuthenticationAuditLevel="Success" />
        </behavior>
    </serviceBehaviors>
</behaviors>
```
Configure WCF to notify the program whenever it is unable to write to an audit log. The program should have an alternative notification scheme in place to alert the organization that audit trails are not being maintained. 

## <a id="logging-web-api"></a>Ensure that auditing and logging is enforced on Web API

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Enable auditing and logging on Web APIs. Audit logs should capture user context. Identify all important events and log those events. Implement centralized logging |

## <a id="logging-field-gateway"></a>Ensure that appropriate auditing and logging is enforced on Field Gateway

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | <p>When multiple devices connect to a Field Gateway, ensure that connection attempts and authentication status (success or failure) for individual devices are logged and maintained on the Field Gateway.</p><p>Also, in cases where Field Gateway is maintaining the IoT Hub credentials for individual devices, ensure that auditing is performed when these credentials are retrieved.Develop a process to periodically upload the logs to Azure IoT Hub/storage for long term retention.</p> |

## <a id="logging-cloud-gateway"></a>Ensure that appropriate auditing and logging is enforced on Cloud Gateway

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway | 
| **SDL Phase**               | Build |  
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Introduction to IoT Hub operations monitoring](https://azure.microsoft.com/documentation/articles/iot-hub-operations-monitoring/) |
| **Steps** | <p>Design for collecting and storing audit data gathered through IoT Hub Operations Monitoring. Enable the following monitoring categories:</p><ul><li>Device identity operations</li><li>Device-to-cloud communications</li><li>Cloud-to-device communications</li><li>Connections</li><li>File uploads</li></ul>|