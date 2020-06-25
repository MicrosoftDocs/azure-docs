---
title: Develop secure applications on Microsoft Azure
description: This article discusses best practices to consider during the implementation and verification phases of your web application project.
author: TerryLanfear
manager: barbkess
ms.author: terrylan
ms.date: 06/12/2019
ms.topic: article
ms.service: security
ms.subservice: security-develop
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
---

# Develop secure applications on Azure
In this article we present security activities and controls to consider when you develop applications for the cloud. Security questions and concepts to consider during the implementation and verification phases of the Microsoft [Security Development Lifecycle
(SDL)](https://msdn.microsoft.com/library/windows/desktop/84aed186-1d75-4366-8e61-8d258746bopq.aspx) are covered. The goal is to help you define activities and Azure services that you can use to develop a more secure application.

The following SDL phases are covered in this article:

- Implementation
- Verification

## Implementation
The focus of the implementation phase is to establish best practices for
early prevention and to detect and remove security issues from the code.
Assume that your application will be used in ways that you didn't intend
it to be used. This helps you guard against accidental or intentional
misuse of your application.

### Perform code reviews

Before you check in code, conduct [code reviews](https://docs.microsoft.com/azure/devops/learn/devops-at-microsoft/code-reviews-not-primarily-finding-bugs) to increase overall code quality and reduce the risk of creating bugs. You can use [Visual Studio](https://docs.microsoft.com/azure/devops/repos/tfvc/get-code-reviewed-vs?view=vsts) to manage the code review process.

### Perform static code analysis

[Static code analysis](https://owasp.org/www-community/controls/Static_Code_Analysis) (also known as *source code analysis*) is usually performed as part of a code review. Static code analysis commonly refers to running static code analysis tools to find potential vulnerabilities in non-running code by using techniques like [taint checking](https://en.wikipedia.org/wiki/Taint_checking) and [data flow analysis](https://en.wikipedia.org/wiki/Data-flow_analysis).

Azure Marketplace offers [developer tools](https://azuremarketplace.microsoft.com/marketplace/apps/category/developer-tools?page=1&search=code%20review) that perform static code analysis and assist with code reviews.

### Validate and sanitize every input for your application

Treat all input as untrusted to protect your application from the most
common web application vulnerabilities. Untrusted data is a vehicle for
injection attacks. Input for your application includes parameters in the
URL, input from the user, data from the database or from an API, and
anything that is passed in that a user could potentially manipulate. An
application should [validate](https://owasp.org/www-project-proactive-controls/v3/en/c5-validate-inputs) that data is syntactically and semantically valid before the application uses the data in any way (including displaying it back to the user).

Validate input early in the data flow to ensure that only properly
formed data enters the workflow. You don't want malformed data
persisting in your database or triggering a malfunction in a downstream
component.

Blacklisting and whitelisting are two general approaches to performing
input syntax validation:

  - Blacklisting attempts to check that a given user input doesn't
    contain "known to be malicious" content.

  - Whitelisting attempts to check that a given user input matches a set
    of "known good" inputs. Character-based whitelisting is a form of
    whitelisting where an application checks that user input contains
    only "known good" characters or that input matches a known format.
    For example, this might involve checking that a username contains
    only alphanumeric characters or that it contains exactly two
    numbers.

Whitelisting is the preferred approach for building secure software.
Blacklisting is prone to error because it's impossible to think of a
complete list of potentially bad input.

Do this work on the server, not on the client side (or on the server and
on the client side).

### Verify your application's outputs

Any output that you present either visually or within a document should
always be encoded and escaped. [Escaping](https://www.owasp.org/index.php/Injection_Theory#Escaping_.28aka_Output_Encoding.29), also known as *output encoding*, is used to help ensure that untrusted data isn't a vehicle for an injection attack. Escaping, combined with data validation, provides layered defenses to increase security of the
system as a whole.

Escaping makes sure that everything is displayed as *output.* Escaping
also lets the interpreter know that the data isn't intended to be
executed, and this prevents attacks from working. This is another common
attack technique called *cross-site scripting* (XSS).

If you are using a web framework from a third party, you can verify your
options for output encoding on websites by using the [OWASP XSS prevention cheat sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md).

### Use parameterized queries when you contact the database

Never create an inline database query "on the fly" in your code and send
it directly to the database. Malicious code inserted into your
application could potentially cause your database to be stolen, wiped,
or modified. Your application could also be used to run malicious
operating system commands on the operating system that hosts your
database.

Instead, use parameterized queries or stored procedures. When you use
parameterized queries, you can invoke the procedure from your code
safely and pass it a string without worrying that it will be treated as
part of the query statement.

### Remove standard server headers

Headers like Server, X-Powered-By, and X-AspNet-Version reveal
information about the server and underlying technologies. We recommend
that you suppress these headers to avoid fingerprinting the application.
See [removing standard server headers on Azure websites](https://azure.microsoft.com/blog/removing-standard-server-headers-on-windows-azure-web-sites/).

### Segregate your production data

Your production data, or "real" data, should not be used for
development, testing, or any other purpose than what the business
intended. A masked ([anonymized](https://en.wikipedia.org/wiki/Data_anonymization)) dataset should be used for all development and testing.

This means fewer people have access to your real data, which reduces
your attack surface. It also means fewer employees see personal data,
which eliminates a potential breach in confidentiality.

### Implement a strong password policy

To defend against brute-force and dictionary-based guessing, you must
implement a strong password policy to ensure that users create a complex
password (for example, 12 characters minimum length and requiring
alphanumeric and special characters).

You can use an identity framework to create and enforce password
policies. Azure AD B2C helps you with password management by providing
[built-in policies](../../active-directory-b2c/tutorial-create-user-flows.md#create-a-password-reset-user-flow),
[self-service password reset](../../active-directory-b2c/user-flow-self-service-password-reset.md), and more.

To defend against attacks on default accounts, verify that all keys and
passwords are replaceable and that they're generated or replaced after
you install resources.

If the application must auto-generate passwords, ensure that the
generated passwords are random and that they have high entropy.

### Validate file uploads

If your application allows [file uploads](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload), consider precautions that you can take for this risky activity. The first step in many attacks is to get some malicious code into a system that is under attack. Using a file upload helps the attacker accomplish this. OWASP offers solutions for validating a file to ensure that the file you're uploading is safe.

Antimalware protection helps identify and remove viruses, spyware, and
other malicious software. You can install [Microsoft Antimalware](../fundamentals/antimalware.md)
or a Microsoft partner's endpoint protection solution ([Trend Micro](https://www.trendmicro.com/azure/),
[Broadcom](https://www.broadcom.com/products),
[McAfee](https://www.mcafee.com/us/products.aspx), [Windows Defender](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-in-windows-10),
and [Endpoint Protection](https://docs.microsoft.com/configmgr/protect/deploy-use/endpoint-protection)).

[Microsoft Antimalware](../fundamentals/antimalware.md)
includes features like real-time protection, scheduled scanning, malware
remediation, signature updates, engine updates, samples reporting, and
exclusion event collection. You can integrate Microsoft Antimalware and
partner solutions with [Azure Security Center](../../security-center/security-center-partner-integration.md)
for ease of deployment and built-in detections (alerts and incidents).

### Don't cache sensitive content

Don't cache sensitive content on the browser. Browsers can store
information for caching and history. Cached files are stored in a folder
like the Temporary Internet Files folder, in the case of Internet
Explorer. When these pages are referred to again, the browser displays
the pages from its cache. If sensitive information (address, credit card
details, Social Security number, username) is displayed to the user, the
information might be stored in the browser's cache and be retrievable by
examining the browser's cache or by simply pressing the browser's
**Back** button.

## Verification
The verification phase involves a comprehensive effort to ensure that
the code meets the security and privacy tenets that were established in
the preceding phases.

### Find and fix vulnerabilities in your application dependencies

You scan your application and its dependent libraries to identify
any known vulnerable components. Products that are available to perform
this scan include [OWASP Dependency Check](https://www.owasp.org/index.php/OWASP_Dependency_Check),[Snyk](https://snyk.io/), and [Black Duck](https://www.blackducksoftware.com/).

Vulnerability scanning powered by [Tinfoil Security](https://www.tinfoilsecurity.com/) is available for Azure App Service Web Apps. [Tinfoil Security scanning through App Service](https://azure.microsoft.com/blog/web-vulnerability-scanning-for-azure-app-service-powered-by-tinfoil-security/) offers developers and administrators a fast, integrated, and economical means of discovering and addressing vulnerabilities before a malicious actor can take advantage of them.

> [!NOTE]
> You can also [integrate Tinfoil Security with Azure AD](../../active-directory/saas-apps/tinfoil-security-tutorial.md). Integrating Tinfoil Security with Azure AD provides you with the
following benefits:
>  - In Azure AD, you can control who has access to Tinfoil Security.
>  - Your users can be automatically signed in to Tinfoil Security (single sign-on) by using their Azure AD accounts.
>  - You can manage your accounts in a single, central location, the Azure portal.

### Test your application in an operating state

Dynamic application security testing (DAST) is a process of testing an
application in an operating state to find security vulnerabilities. DAST
tools analyze programs while they are executing to find security
vulnerabilities such as memory corruption, insecure server
configuration, cross-site scripting, user privilege issues, SQL
injection, and other critical security concerns.

DAST is different from static application security testing (SAST). SAST
tools analyze source code or compiled versions of code when the code is
not executing in order to find security flaws.

Perform DAST, preferably with the assistance of a security professional
(a [penetration tester](../fundamentals/pen-testing.md) or vulnerability assessor). If a security professional isn't available, you can perform DAST yourself with a web proxy scanner and some training. Plug in a DAST scanner early on to ensure that you don't introduce obvious security issues into your code. See the [OWASP](https://owasp.org/www-community/Vulnerability_Scanning_Tools) site for a list of web application vulnerability scanners.

### Perform fuzz testing

In [fuzz testing](https://cloudblogs.microsoft.com/microsoftsecure/2007/09/20/fuzz-testing-at-microsoft-and-the-triage-process/), you induce program failure by deliberately introducing malformed or
random data to an application. Inducing program failure helps reveal
potential security issues before the application is released.

[Security Risk Detection](https://docs.microsoft.com/security-risk-detection/) is the Microsoft unique fuzz testing service for finding security-critical bugs in software.

### Conduct attack surface review

Reviewing the attack surface after code completion helps ensure that any
design or implementation changes to an application or system has been
considered. It helps ensure that any new attack vectors that were
created as a result of the changes, including threat models, has been
reviewed and mitigated.

You can build a picture of the attack surface by scanning the
application. Microsoft offers an attack surface analysis tool called
[Attack Surface Analyzer](https://www.microsoft.com/download/details.aspx?id=24487). You can choose from many commercial dynamic testing and vulnerability scanning tools or services, including
[OWASP Zed Attack Proxy Project](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project),
[Arachni](http://arachni-scanner.com/),
[Skipfish](https://code.google.com/p/skipfish/), and
[w3af](http://w3af.sourceforge.net/). These scanning tools crawl your
app and map the parts of the application that are accessible over the
web. You can also search the Azure Marketplace for similar [developer
tools](https://azuremarketplace.microsoft.com/marketplace/apps/category/developer-tools?page=1).

### Perform security penetration testing

Ensuring that your application is secure is as important as testing any
other functionality. Make [penetration
testing](../fundamentals/pen-testing.md)
a standard part of the build and deployment process. Schedule regular
security tests and vulnerability scanning on deployed applications, and
monitor for open ports, endpoints, and attacks.

### Run security verification tests

[Secure DevOps Kit for Azure](https://azsk.azurewebsites.net/index.html)
(AzSK) contains SVTs for multiple services of the Azure platform. You
run these SVTs periodically to ensure that your Azure
subscription and the different resources that comprise your application
are in a secure state. You can also automate these tests by using the
continuous integration/continuous deployment (CI/CD) extensions feature
of AzSK, which makes SVTs available as a Visual Studio extension.

## Next steps
In the following articles, we recommend security controls and activities that can help you design and deploy secure applications.

- [Design secure applications](secure-design.md)
- [Deploy secure applications](secure-deploy.md)
