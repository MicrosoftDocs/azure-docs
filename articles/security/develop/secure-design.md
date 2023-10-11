---
title: Design secure applications on Microsoft Azure
description: This article discusses best practices to consider during the requirement and design phases of your web application project.
author: TerryLanfear
manager: rkarlin
ms.author: terrylan
ms.date: 09/26/2023
ms.topic: article
ms.service: security
ms.subservice: security-develop
services: azure
ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
---

# Design secure applications on Azure
In this article, we present security activities and controls to consider when you design applications for the cloud. Training resources along with security questions and concepts to consider during the requirements and design phases of the Microsoft [Security Development Lifecycle
(SDL)](/previous-versions/windows/desktop/cc307891(v=msdn.10)) are covered. The goal is to help you define activities and Azure services that you can use to design a more secure application.

The following SDL phases are covered in this article:

* Training
* Requirements
* Design

## Training

Before you begin developing your cloud application, take time to understand security and privacy on Azure. By taking this step, you can reduce the number and severity of exploitable vulnerabilities in your application. You'll be more prepared to react appropriately to the ever-changing threat landscape.

Use the following resources during the training stage to familiarize yourself with the Azure services that are available to developers and with security best practices on Azure:

* [Developer's guide to Azure](https://azure.microsoft.com/campaigns/developer-guide/) shows you how to get started with Azure. The guide shows you which services you can use to run your applications, store your data, incorporate intelligence, build IoT apps, and deploy your solutions in a more efficient and secure way.

* [Get started guide for Azure developers](../../guides/developer/azure-developer-guide.md) provides essential information for developers who are looking to get started using the Azure platform for their development needs.

* [SDKs and tools](/azure/?pivot=sdkstools&product=developer-tools) describes the tools that are available on Azure.

* [Azure DevOps Services](/azure/devops/) provides development collaboration tools. The tools include high-performance pipelines, free Git repositories, configurable Kanban boards, and extensive automated and cloud-based load testing. The [DevOps Resource Center](/azure/devops/learn/) combines our resources for learning DevOps practices, Git version control, agile methods, how we work with DevOps at Microsoft, and how you can assess your own DevOps progression.

* [Top five security items to consider before pushing to production](/training/modules/top-5-security-items-to-consider/index?WT.mc_id=Learn-Blog-tajanca) shows you how to help secure your web applications on Azure and protect your apps against the most common and dangerous web application attacks.

* [Secure DevOps Kit for Azure](https://github.com/azsk/AzTS-docs/#readme) is a collection of scripts, tools, extensions, and automations that cater to the comprehensive Azure subscription and resource security needs of DevOps teams that use extensive automation. The Secure DevOps Kit for Azure can show you how to smoothly integrate security into your native DevOps workflows. The kit addresses tools like security verification tests (SVTs), which can help developers write secure code and test the secure configuration of their cloud applications in the coding and early development stages.

* [Azure security best practices and patterns](../fundamentals/best-practices-and-patterns.md) - A collection of security best practices to use when you design, deploy, and manage cloud solutions by using Azure. Guidance is intended to be a resource for IT pros. This might include designers, architects, developers, and testers who build and deploy secure Azure solutions.

## Requirements

The requirements definition phase is a crucial step in defining what your application is and what it does when it's released. The requirements phase is also a time to think about the security controls that you build into your application. During this phase, you also begin the steps that you take throughout the SDL to ensure that you release and deploy a secure application.

### Consider security and privacy issues

This phase is the best time to consider foundational security and privacy issues. Defining acceptable levels of security and privacy at the start of a project helps a team:

* Understand risks associated with security issues.
* Identify and fix security bugs during development.
* Apply established levels of security and privacy throughout the entire project.

When you write the requirements for your application, be sure to consider security controls that can help keep your application and data safe.

### Ask security questions

Ask security questions like:

* Does my application contain sensitive data?

* Does my application collect or store data that requires me to adhere to industry standards and compliance programs like the [Federal Financial Institution Examination Council (FFIEC)](/previous-versions/azure/security/blueprints/ffiec-analytics-overview) or the [Payment Card Industry Data Security Standards (PCI DSS)](/previous-versions/azure/security/blueprints/pcidss-analytics-overview)?

* Does my application collect or contain sensitive personal or customer data that can be used, either on its own or with other information, to identify, contact, or locate a single person?

* Does my application collect or contain data that can be used to access an individual's medical, educational, financial, or employment information? Identifying the sensitivity of your data during the requirements phase helps you classify your data and identify the data protection method you use for your application.

* Where and how is my data stored? Consider how you monitor the storage services that your application uses for any unexpected changes (such as slower response times). Are you able to influence logging to collect more detailed data and analyze a problem in depth?

* Is my application available to the public (on the internet) or internally only? If your application is available to the public, how do you protect the data that might be collected from being used in the wrong way? If your application is available internally only, consider who in your organization should have access to the application and how long they should have access.

* Do you understand your identity model before you begin designing your application? Can you determine that users are who they say they are and what a user is authorized to do?

* Does my application perform sensitive or important tasks (such as transferring money, unlocking doors, or delivering medicine)? Consider how you validate that the user performing a sensitive task is authorized to perform the task and how you authenticate that the person is who they say they are. Authorization (AuthZ) is the act of granting an authenticated security principal permission to do something. Authentication (AuthN) is the act of challenging a party for legitimate credentials.

* Does my application perform any risky software activities, like allowing users to upload or download files or other data? If your application does perform risky activities, consider how your application protects users from handling malicious files or data.

### Review OWASP top 10

Consider reviewing the [<span class="underline">OWASP Top 10 Application Security Risks</span>](https://owasp.org/www-project-top-ten/). The OWASP Top 10 addresses critical security risks to web applications. Awareness of these security risks can help you make requirement and design decisions that minimize these risks in your application.

Thinking about security controls to prevent breaches is important. However, you also want to [assume a breach](/devops/operate/security-in-devops) will occur. Assuming a breach helps answer some important questions about security in advance, so they don't have to be answered in an emergency:

* How am I going to detect an attack?
* What am I going to do if there's an attack or breach?
* How am I going to recover from the attack like data leaking or tampering?

## Design

The design phase is critical for establishing best practices for design and functional specifications. It also is critical for performing risk analysis that helps mitigate security and privacy issues throughout a project.

When you have security requirements in place and use secure design concepts, you can avoid or minimize opportunities for a security flaw. A security flaw is an oversight in the design of the application that might allow a user to perform malicious or unexpected actions after your application is released.

During the design phase, also think about how you can apply security in layers; one level of defense isn't necessarily enough. What happens if an attacker gets past your web application firewall (WAF)? You want another security control in place to defend against that attack.

With this in mind, we discuss the following secure design concepts and the security controls you should address when you design secure applications:

* Use a secure coding library and a software framework.
* Scan for vulnerable components.
* Use threat modeling during application design.
* Reduce your attack surface.
* Adopt a policy of identity as the primary security perimeter.
* Require reauthentication for important transactions.
* Use a key management solution to secure keys, credentials, and other secrets.
* Protect sensitive data.
* Implement fail-safe measures.
* Take advantage of error and exception handling.
* Use logging and alerting.

### Use a secure coding library and a software framework

For development, use a secure coding library and a software framework
that has embedded security. Developers can use existing, proven features
(encryption, input sanitation, output encoding, keys or connection
strings, and anything else that would be considered a security control)
instead of developing security controls from scratch. This helps guard
against security-related design and implementation flaws.

Be sure that you're using the latest version of your framework and all the security features that are available in the framework. Microsoft offers a comprehensive [set of development tools](https://azure.microsoft.com/product-categories/developer-tools/) for all developers, working on any platform or language, to deliver cloud applications. You can code with the language of your choice by choosing from various [SDKs](https://azure.microsoft.com/downloads/). You can take advantage of full-featured integrated development environments (IDEs) and editors that have advanced debugging capabilities and built-in Azure support.

Microsoft offers various [languages, frameworks, and tools](/azure/?panel=sdkstools-all&pivot=sdkstools&product=popular#languages-and-tools) that you can use to develop applications on Azure. An example is [Azure for .NET and .NET Core developers](/dotnet/azure/). For each language and framework that we offer, you can find quickstarts, tutorials, and API references to help you get started fast.

Azure offers various services you can use to host websites and web applications. These services let you develop in your favorite language, whether that's .NET, .NET Core, Java, Ruby, Node.js, PHP, or Python. [Azure App Service Web Apps](../../app-service/overview.md) (Web Apps) is one of these services.

Web Apps adds the power of Microsoft Azure to your application. It
includes security, load balancing, autoscaling, and automated
management. You can also take advantage of DevOps capabilities in Web
Apps, like package management, staging environments, custom domains,
SSL/TLS certificates, and continuous deployment from Azure DevOps,
GitHub, Docker Hub, and other sources.

Azure offers other services that you can use to host websites and web applications. For most scenarios, Web Apps is the best choice. For a micro service architecture, consider [Azure Service Fabric](../../service-fabric/index.yml). If you need more control over the VMs that your code runs on, consider [Azure Virtual Machines](../../virtual-machines/index.yml). For more information about how to choose between these Azure services, see a [comparison of Azure App Service, Virtual Machines, Service Fabric, and Cloud Services](/azure/architecture/guide/technology-choices/compute-decision-tree).

### Apply updates to components

To prevent vulnerabilities, you should continuously inventory both your
client-side and server-side components (for example, frameworks and
libraries) and their dependencies for updates. New vulnerabilities and
updated software versions are released continuously. Ensure that you
have an ongoing plan to monitor, triage, and apply updates or
configuration changes to the libraries and components you use.

See the [Open Web Application Security Project](https://www.owasp.org/) (OWASP) page on [using components with known vulnerabilities](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities) for tool suggestions. You can also subscribe to email alerts for security vulnerabilities that are related to components you use.

### Use threat modeling during application design

Threat modeling is the process of identifying potential security threats
to your business and application, and then ensuring that proper
mitigations are in place. The SDL specifies that teams should engage in
threat modeling during the design phase, when resolving potential issues
is relatively easy and cost-effective. Using threat modeling in the
design phase can greatly reduce your total cost of development.

To help facilitate the threat modeling process, we designed the [SDL Threat Modeling Tool](threat-modeling-tool.md) with nonsecurity experts in mind. This tool makes threat modeling easier for all developers by providing clear guidance about how to create and analyze threat models.

Modeling the application design and enumerating [STRIDE](https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxzZWN1cmVwcm9ncmFtbWluZ3xneDo0MTY1MmM0ZDI0ZjQ4ZDMy) threats-Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege-across all trust boundaries has proven an effective way to catch design errors early. The following table lists the STRIDE threats and gives some example mitigations that use features provided by Azure. These mitigations don't work in every situation.

| Threat | Security property | Potential Azure platform mitigation |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Spoofing               | Authentication        | [Require HTTPS connections](/aspnet/core/security/enforcing-ssl?tabs=visual-studio). |
| Tampering              | Integrity             | Validate SSL/TLS certificates. Applications that use SSL/TLS must fully verify the X.509 certificates of the entities they connect to. Use Azure Key Vault certificates to [manage your x509 certificates](../../key-vault/general/about-keys-secrets-certificates.md). |
| Repudiation            | Non-repudiation       | Enable Azure [monitoring and diagnostics](/azure/architecture/best-practices/monitoring).|
| Information Disclosure | Confidentiality       | Encrypt sensitive data [at rest](../fundamentals/encryption-atrest.md) and [in transit](../fundamentals/data-encryption-best-practices.md#protect-data-in-transit). |
| Denial of Service      | Availability          | Monitor performance metrics for potential denial of service conditions. Implement connection filters. [Azure DDoS protection](../../ddos-protection/ddos-protection-overview.md), combined with application design best practices, provides defense against DDoS attacks.|
| Elevation of Privilege | Authorization         | Use Azure Active Directory <span class="underline"> </span> [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md).|

### Reduce your attack surface

An attack surface is the total sum of where potential vulnerabilities
might occur. In this paper, we focus on an application's attack surface.
The focus is on protecting an application from attack. A simple and
quick way to minimize your attack surface is to remove unused resources
and code from your application. The smaller your application, the
smaller your attack surface. For example, remove:

* Code for features you haven't released yet.
* Debugging support code.
* Network interfaces and protocols that aren't used or which have been deprecated.
* Virtual machines and other resources that you aren't using.

Doing regular cleanup of your resources and ensuring that you remove
unused code are great ways to ensure that there are fewer opportunities
for malicious actors to attack.

A more detailed and in-depth way to reduce your attack surface is to
complete an attack surface analysis. An attack surface analysis helps
you map the parts of a system that need to be reviewed and tested for
security vulnerabilities.

The purpose of an attack surface analysis is to understand the risk
areas in an application so developers and security specialists are aware
of what parts of the application are open to attack. Then, you can find
ways to minimize this potential, track when and how the attack surface
changes, and what this means from a risk perspective.

An attack surface analysis helps you identify:

* Functions and parts of the system you need to review and test for security vulnerabilities.
* High-risk areas of code that require defense-in-depth protection (parts of the system that you need to defend).
* When you alter the attack surface and need to refresh a threat assessment.

Reducing opportunities for attackers to exploit a potential weak spot or
vulnerability requires you to thoroughly analyze your application's
overall attack surface. It also includes disabling or restricting access
to system services, applying the principle of least privilege, and
employing layered defenses wherever possible.

We discuss [conducting an attack surface review](secure-develop.md#conduct-attack-surface-review) during the verification phase of the SDL.

> [!NOTE]
> **What's the difference between threat modeling and attack surface analysis?**
Threat modeling is the process of identifying potential security threats to your application and ensuring that proper mitigations against the threats are in place. Attack surface analysis identifies high-risk areas of code that are open to attack. It involves finding ways to defend high-risk areas of your application and reviewing and testing those areas of code before you deploy the application.

### Adopt a policy of identity as the primary security perimeter

When you design cloud applications, it's important to expand your
security perimeter focus from a network-centric approach to an
identity-centric approach. Historically, the primary on-premises
security perimeter was an organization's network. Most on-premises
security designs use the network as the primary security pivot. For
cloud applications, you're better served by considering identity as the
primary security perimeter.

Things you can do to develop an identity-centric approach to developing
web applications:

* Enforce multifactor authentication for users.
* Use strong authentication and authorization platforms.
* Apply the principle of least privilege.
* Implement just-in-time access.

#### Enforce multifactor authentication for users

Use two-factor authentication. Two-factor authentication is the current standard for authentication and authorization because it avoids the security weaknesses that are inherent in username and password types of authentication. Access to the Azure management interfaces (Azure portal/remote PowerShell) and to customer-facing services should be designed and configured to use [Azure AD Multifactor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md).

#### Use strong authentication and authorization platforms

Use platform-supplied authentication and authorization mechanisms instead of custom code. This is because developing custom authentication code can be prone to error. Commercial code (for example, from Microsoft) often is extensively reviewed for security. [Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) is the Azure solution for identity and access management. These Azure AD tools and services help with secure development:

* [Microsoft identity platform](../../active-directory/develop/index.yml) is a set of components that developers use to build apps that securely sign in users. The platform assists developers who are building single-tenant, line-of-business (LOB) apps and developers who are looking to develop multitenant apps. In addition to basic sign-in, apps built by using the Microsoft identity platform can call Microsoft APIs and custom APIs. The Microsoft identity platform supports industry-standard protocols like OAuth 2.0 and OpenID Connect.

* [Azure Active Directory B2C](../../active-directory-b2c/index.yml) (Azure AD B2C) is an identity management service you use to customize and control how customers sign up, sign in, and manage their profiles when they use your applications. This includes applications that are developed for iOS, Android, and .NET, among others. Azure AD B2C enables these actions while protecting customer identities.

#### Apply the principle of least privilege

The concept of [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) means giving users the precise level of access and control they need to do their jobs and nothing more.

Would a software developer need domain admin rights? Would an administrative assistant need access to administrative controls on their personal computer? Evaluating access to software is no different. If you use [Azure role-based access control](../../role-based-access-control/overview.md) (Azure RBAC) to give users different abilities and authority in your application, you wouldn't give everyone access to everything. By limiting access to what is required for each role, you limit the risk of a security issue occurring.

Ensure that your application enforces [least privilege](/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models#in-applications) throughout its access patterns.

> [!NOTE]
> The rules of least privilege need to apply to the software and to the people creating the software. Software developers can be a huge risk to IT security if they're given too much access. The consequences can be severe if a developer has malicious intent or is given too much access. We recommend that the rules of least privilege be applied to developers throughout the development lifecycle.

#### Implement just-in-time access

Implement *just-in-time* (JIT) access to further lower the exposure time of privileges. Use [Azure AD Privileged Identity Management](../../active-directory/roles/security-planning.md#stage-3-take-control-of-administrator-activity)
to:

* Give users the permissions they need only JIT.
* Assign roles for a shortened duration with confidence that the privileges are revoked automatically.

### Require reauthentication for important transactions

[Cross-site request forgery](/aspnet/core/security/anti-request-forgery) (also known as *XSRF* or *CSRF*) is an attack against web-hosted apps in which a malicious web app influences the interaction between a client browser and a web app that trusts that browser. Cross-site request forgery attacks are possible because web browsers send some types of authentication tokens automatically with every request to a website. This form of exploitation is also known as a *one-click attack* or *session riding* because the attack takes advantage of the user's previously authenticated session.

The best way to defend against this kind of attack is to ask the user
for something that only the user can provide before every important
transaction, such as a purchase, account deactivation, or a password
change. You might ask the user to reenter their password, complete a
captcha, or submit a secret token that only the user would have. The
most common approach is the secret
token.

### Use a key management solution to secure keys, credentials, and other secrets

Losing keys and credentials is a common problem. The only thing worse
than losing your keys and credentials is having an unauthorized party
gain access to them. Attackers can take advantage of automated and
manual techniques to find keys and secrets that are stored in code
repositories like GitHub. Don't put keys and secrets in these public
code repositories or on any other server.

Always put your keys, certificates, secrets, and connection strings in a key management solution. You can use a centralized solution in which keys and secrets are stored in hardware security modules (HSMs). Azure provides you with an HSM in the cloud with [Azure Key Vault](../../key-vault/general/overview.md).

Key Vault is a *secret store*: it's a centralized cloud service for
storing application secrets. Key Vault keeps your confidential data safe
by keeping application secrets in a single, central location and
providing secure access, permissions control, and access logging.

Secrets are stored in individual *vaults*. Each vault has its own
configuration and security policies to control access. You get to your
data through a REST API or through a client SDK that's available for
most programming languages.

> [!IMPORTANT]
> Azure Key Vault is designed to store configuration secrets for server applications. It's not intended for storing data that belongs to app users. This is reflected in its performance characteristics, API, and cost model.
>
> User data should be stored elsewhere, like in an Azure SQL Database instance that has Transparent Data Encryption (TDE) or in a storage account that uses Azure Storage Service Encryption. Secrets that are used by your application to access these data stores can be kept in Azure Key Vault.

### Protect sensitive data

Protecting data is an essential part of your security strategy.
Classifying your data and identifying your data protection needs helps
you design your app with data security in mind. Classifying
(categorizing) stored data by sensitivity and business impact helps
developers determine the risks that are associated with data.

Label all applicable data as sensitive when you design your data
formats. Ensure that the application treats the applicable data as
sensitive. These practices can help you protect your sensitive data:

* Use encryption.
* Avoid hard-coding secrets like keys and passwords.
* Ensure that access controls and auditing are in place.

#### Use encryption

Protecting data should be an essential part of your security strategy. If your data is stored in a database or if it moves back and forth between locations, use encryption of [data at rest](../fundamentals/encryption-atrest.md) (while in the database) and encryption of [data in transit](../fundamentals/data-encryption-best-practices.md#protect-data-in-transit) (on its way to and from the user, the database, an API, or service endpoint). We recommend that you always use SSL/TLS protocols to exchange data. Ensure that you use the latest version of TLS for encryption (currently, this is version 1.2).

#### Avoid hard-coding

Some things should never be hard-coded in your software. Some examples are hostnames or IP addresses, URLs, email addresses, usernames, passwords, storage account keys, and other cryptographic keys. Consider implementing requirements around what can or can't be hard-coded in your code, including in the comment sections of your code.

When you put comments in your code, ensure that you don't save any sensitive information. This includes your email address, passwords, connection strings, information about your application that would only be known by someone in your organization, and anything else that might give an attacker an advantage in attacking your application or organization.

Basically, assume that everything in your development project is public knowledge when it's deployed. Avoid including sensitive data of any kind in the project.

Earlier, we discussed [Azure Key Vault](../../key-vault/general/overview.md). You can use Key Vault to store secrets like keys and passwords instead of hard-coding them. When you use Key Vault in combination with managed identities for Azure resources, your Azure web app can access secret configuration values easily and securely without storing any secrets in your source control or configuration. To learn more, see [Manage secrets in your server apps with Azure Key Vault](/training/modules/manage-secrets-with-azure-key-vault/).

### Implement fail-safe measures

Your application must be able to handle [errors](/dotnet/standard/exceptions/) that occur during execution in a consistent manner. The application should catch all errors and either fail safe or closed.

You should also ensure that errors are logged with sufficient user context to identify suspicious or malicious activity. Logs should be retained for a sufficient time to allow delayed forensic analysis. Logs should be in a format that is easily consumed by a log management solution. Ensure that alerts for errors related to security are triggered. Insufficient logging and monitoring allow attackers to further attack systems and maintain persistence.

### Take advantage of error and exception handling

Implementing correct error and [exception handling](/dotnet/standard/exceptions/best-practices-for-exceptions) is an important part of defensive coding. Error and exception handling are critical to making a system reliable and secure. Mistakes in error handling can lead to different kinds of security vulnerabilities, such as leaking information to attackers and helping attackers understand more about your platform and design.

Ensure that:

* You handle exceptions in a centralized manner to avoid duplicated [try/catch blocks](/dotnet/standard/exceptions/how-to-use-the-try-catch-block-to-catch-exceptions) in the code.

* All unexpected behaviors are handled inside the application.

* Messages that are displayed to users don't leak critical data but do provide enough information to explain the issue.

* Exceptions are logged and that they provide enough information for forensics or incident response teams to investigate.

[Azure Logic Apps](../../logic-apps/logic-apps-overview.md) provides a first-class experience for [handling errors and exceptions](../../logic-apps/logic-apps-exception-handling.md) caused by dependent systems. You can use Logic Apps to create workflows to automate tasks and processes that integrate apps, data, systems, and services across enterprises and organizations.

### Use logging and alerting

[Log](/aspnet/core/fundamentals/logging/) your security issues for security investigations and trigger alerts about issues to ensure that people know about problems in a timely manner. Enable auditing and logging on all components. Audit logs should capture user context and identify all important events.

Check that you don't log any sensitive data that a user submits to your
site. Examples of sensitive data include:

* User credentials
* Social Security numbers or other identifying information
* Credit card numbers or other financial information
* Health information
* Private keys or other data that can be used to decrypt encrypted information
* System or application information that can be used to more effectively attack the application

Ensure that the application monitors user management events such as
successful and failed user logins, password resets, password changes,
account lockout, and user registration. Logging for these events helps
you detect and react to potentially suspicious behavior. It also allows
you to gather operations data, like who is accessing the application.

## Next steps

In the following articles, we recommend security controls and activities that can help you develop and deploy secure applications.

* [Develop secure applications](secure-develop.md)
* [Deploy secure applications](secure-deploy.md)
