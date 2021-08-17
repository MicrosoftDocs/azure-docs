---
title: Azure Web Application Firewall on Azure Front Door DRS rule groups and rules
description: This article  provides information on Web Application Firewall DRS rule groups and rules.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 07/29/2021
ms.author: victorh
ms.topic: conceptual
---

# Web Application Firewall DRS rule groups and rules

Azure Front Door web application firewall (WAF) protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Since such rule sets are managed by Azure, the rules are updated as needed to protect against new attack signatures.


## Default rule sets

Azure-managed Default Rule Set includes rules against the following threat categories:

- Cross-site scripting
- Java attacks
- Local file inclusion
- PHP injection attacks
- Remote command execution
- Remote file inclusion
- Session fixation
- SQL injection protection
- Protocol attackers

The version number of the Default Rule Set increments when new attack signatures are added to the rule set.
Default Rule Set is enabled by default in Detection mode in your WAF policies. You can disable or enable individual rules within the Default Rule Set to meet your application requirements. You can also set specific actions (ALLOW/BLOCK/REDIRECT/LOG) per rule.

Sometimes you may need to omit certain request attributes from a WAF evaluation. A common example is Active Directory-inserted tokens that are used for authentication. You may configure an exclusion list for a managed rule, rule group, or for the entire rule set.  

The Default action is to BLOCK. Additionally, custom rules can be configured in the same WAF policy if you wish to bypass any of the pre-configured rules in the Default Rule Set.

Custom rules are always applied before rules in the Default Rule Set are evaluated. If a request matches a custom rule, the corresponding rule action is applied. The request is either blocked or passed through to the back-end. No other custom rules or the rules in the Default Rule Set are processed. You can also remove the Default Rule Set from your WAF policies.

### Microsoft Threat Intelligence Collection rules

The Microsoft Threat Intelligence Collection rules are written in partnership with the Microsoft Intelligence team to provide increased coverage, patches for specific vulnerabilities, and better false positive reduction.

### Anomaly Scoring mode

OWASP has two modes for deciding whether to block traffic: Traditional mode and Anomaly Scoring mode.

In Traditional mode, traffic that matches any rule is considered independently of any other rule matches. This mode is easy to understand. But the lack of information about how many rules match a specific request is a limitation. So, Anomaly Scoring mode was introduced. It's the default for OWASP 3.*x*.

In Anomaly Scoring mode, traffic that matches any rule isn't immediately blocked when the firewall is in Prevention mode. Rules have a certain severity: *Critical*, *Error*, *Warning*, or *Notice*. That severity affects a numeric value for the request, which is called the Anomaly Score. For example, one *Warning* rule match contributes 3 to the score. One *Critical* rule match contributes 5.

|Severity  |Value  |
|---------|---------|
|Critical     |5|
|Error        |4|
|Warning      |3|
|Notice       |2|

There's a threshold of 5 for the Anomaly Score to block traffic. So, a single *Critical* rule match is enough for the WAF to block a request, even in Prevention mode. But one *Warning* rule match only increases the Anomaly Score by 3, which isn't enough by itself to block the traffic.

### DRS 2.0

DRS 2.0 includes 17 rule groups, as shown in the following table. Each group contains multiple rules, which can be disabled.

> [!NOTE]
> DRS 2.0 is only available on Azure Front Door Premium.

|Rule group|Description|
|---|---|
|**[General](#general-20)**|General group|
|**[METHOD-ENFORCEMENT](#drs911-20)**|Lock-down methods (PUT, PATCH)|
|**[PROTOCOL-ENFORCEMENT](#drs920-20)**|Protect against protocol and encoding issues|
|**[PROTOCOL-ATTACK](#drs921-20)**|Protect against header injection, request smuggling, and response splitting|
|**[APPLICATION-ATTACK-LFI](#drs930-20)**|Protect against file and path attacks|
|**[APPLICATION-ATTACK-RFI](#drs931-20)**|Protect against remote file inclusion (RFI) attacks|
|**[APPLICATION-ATTACK-RCE](#drs932-20)**|Protect again remote code execution attacks|
|**[APPLICATION-ATTACK-PHP](#drs933-20)**|Protect against PHP-injection attacks|
|**[APPLICATION-ATTACK-NodeJS](#drs934-20)**|Protect against Node JS attacks|
|**[APPLICATION-ATTACK-XSS](#drs941-20)**|Protect against cross-site scripting attacks|
|**[APPLICATION-ATTACK-SQLI](#drs942-20)**|Protect against SQL-injection attacks|
|**[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-20)**|Protect against session-fixation attacks|
|**[APPLICATION-ATTACK-SESSION-JAVA](#drs944-20)**|Protect against JAVA attacks|
|**[MS-ThreatIntel-WebShells](#drs9905-20)**|Protect against Web shell attacks|
|**[MS-ThreatIntel-AppSec](#drs9903-20)**|Protect against AppSec attacks|
|**[MS-ThreatIntel-SQLI](#drs99031-20)**|Protect against SQLI attacks|
|**[MS-ThreatIntel-CVEs](#drs99001-20)**|Protect against CVE attacks|

### DRS 1.1
|Rule group|Description|
|---|---|
|**[PROTOCOL-ATTACK](#drs921-11)**|Protect against header injection, request smuggling, and response splitting|
|**[APPLICATION-ATTACK-LFI](#drs930-11)**|Protect against file and path attacks|
|**[APPLICATION-ATTACK-RFI](#drs931-11)**|Protection against remote file inclusion attacks|
|**[APPLICATION-ATTACK-RCE](#drs932-11)**|Protection against remote command execution|
|**[APPLICATION-ATTACK-PHP](#drs933-11)**|Protect against PHP-injection attacks|
|**[APPLICATION-ATTACK-XSS](#drs941-11)**|Protect against cross-site scripting attacks|
|**[APPLICATION-ATTACK-SQLI](#drs942-11)**|Protect against SQL-injection attacks|
|**[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-11)**|Protect against session-fixation attacks|
|**[APPLICATION-ATTACK-SESSION-JAVA](#drs944-11)**|Protect against JAVA attacks|
|**[MS-ThreatIntel-WebShells](#drs9905-11)**|Protect against Web shell attacks|
|**[MS-ThreatIntel-AppSec](#drs9903-11)**|Protect against AppSec attacks|
|**[MS-ThreatIntel-SQLI](#drs99031-11)**|Protect against SQLI attacks|
|**[MS-ThreatIntel-CVEs](#drs99001-11)**|Protect against CVE attacks|

### DRS 1.0

|Rule group|Description|
|---|---|
|**[PROTOCOL-ATTACK](#drs921-10)**|Protect against header injection, request smuggling, and response splitting|
|**[APPLICATION-ATTACK-LFI](#drs930-10)**|Protect against file and path attacks|
|**[APPLICATION-ATTACK-RFI](#drs931-10)**|Protection against remote file inclusion attacks|
|**[APPLICATION-ATTACK-RCE](#drs932-10)**|Protection against remote command execution|
|**[APPLICATION-ATTACK-PHP](#drs933-10)**|Protect against PHP-injection attacks|
|**[APPLICATION-ATTACK-SQLI](#drs942-10)**|Protect against SQL-injection attacks|
|**[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-10)**|Protect against session-fixation attacks|
|**[APPLICATION-ATTACK-SESSION-JAVA](#drs944-10)**|Protect against JAVA attacks|



### Bot rules

|Rule group|Description|
|---|---|
|**[BadBots](#bot100)**|Protect against bad bots|
|**[GoodBots](#bot200)**|Identify good bots|
|**[UnknownBots](#bot300)**|Identify unknown bots|



The following rule groups and rules are available when using Web Application Firewall on Azure 
Front Door.

# [DRS 2.0](#tab/drs20)

## <a name="drs20"></a> 2.0 rule sets

### <a name="general-20"></a> <p x-ms-format-detection="none">General</p>
|RuleId|Description|
|---|---|
|200002|Failed to parse request body.|
|200003|Multipart request body failed strict validation|


### <a name="drs911-20"></a> <p x-ms-format-detection="none">METHOD ENFORCEMENT</p>
|RuleId|Description|
|---|---|
|911100|Method is not allowed by policy|

### <a name="drs920-20"></a> <p x-ms-format-detection="none">PROTOCOL-ENFORCEMENT</p>
|RuleId|Description|
|---|---|
|920100|Invalid HTTP Request Line|
|920120|Attempted multipart/form-data bypass|
|920121|Attempted multipart/form-data bypass|
|920160|Content-Length HTTP header is not numeric.|
|920170|GET or HEAD Request with Body Content.|
|920171|GET or HEAD Request with Transfer-Encoding.|
|920180|POST request missing Content-Length Header.|
|920190|Range: Invalid Last Byte Value.|
|920200|Range: Too many fields (6 or more)|
|920201|Range: Too many fields for pdf request (35 or more)|
|920210|Multiple/Conflicting Connection Header Data Found.|
|920220|URL Encoding Abuse Attack Attempt|
|920230|Multiple URL Encoding Detected|
|920240|URL Encoding Abuse Attack Attempt|
|920260|Unicode Full/Half Width Abuse Attack Attempt|
|920270|Invalid character in request (null character)|
|920271|Invalid character in request (non printable characters)|
|920280|Request Missing a Host Header|
|920290|Empty Host Header|
|920300|Request Missing an Accept Header|
|920310|Request Has an Empty Accept Header|
|920311|Request Has an Empty Accept Header|
|920320|Missing User Agent Header|
|920330|Empty User Agent Header|
|920340|Request Containing Content, but Missing Content-Type header|
|920341|Request containing content requires Content-Type header|
|920350|Host header is a numeric IP address|
|920420|Request content type is not allowed by policy|
|920430|HTTP protocol version is not allowed by policy|
|920440|URL file extension is restricted by policy|
|920450|HTTP header is restricted by policy|
|920470|Illegal Content-Type header|
|920480|Request content type charset is not allowed by policy|

### <a name="drs921-20"></a> <p x-ms-format-detection="none">PROTOCOL-ATTACK</p>

|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-20"></a> <p x-ms-format-detection="none">LFI - Local File Inclusion</p>
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-20"></a> <p x-ms-format-detection="none">RFI - Remote File Inclusion</p>
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-20"></a> <p x-ms-format-detection="none">RCE - Remote Command Execution</p>
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|932120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Unix Shell Code Found|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-20"></a> <p x-ms-format-detection="none">PHP Attacks</p>
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: Opening/Closing Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933131|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933161|PHP Injection Attack: Low-Value PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|
|933200|PHP Injection Attack: Wrapper scheme detected|
|933210|PHP Injection Attack: Variable Function Call Found|

### <a name="drs934-20"></a> <p x-ms-format-detection="none">Node JS Attacks</p>
|RuleId|Description|
|---|---|
|934100|Node.js Injection Attack|

### <a name="drs941-20"></a> <p x-ms-format-detection="none">XSS - Cross-site Scripting</p>
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection.|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blacklist Keywords|
|941190|XSS Using style sheets|
|941200|XSS using VML frames|
|941210|XSS using obfuscated JavaScript|
|941220|XSS using obfuscated VB Script|
|941230|XSS using 'embed' tag|
|941240|XSS using 'import' or 'implementation' attribute|
|941250|IE XSS Filters - Attack Detected.|
|941260|XSS using 'meta' tag|
|941270|XSS using 'link' href|
|941280|XSS using 'base' tag|
|941290|XSS using 'applet' tag|
|941300|XSS using 'object' tag|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|
|941360|JavaScript obfuscation detected.|
|941370|JavaScript global variable found|
|941380|AngularJS client side template injection detected|


### <a name="drs942-20"></a> <p x-ms-format-detection="none">SQLI - SQL Injection</p>
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942130|SQL Injection Attack: SQL Tautology Detected.|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind sqli tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic sql injection. Common attack string for mysql, oracle, and others.|
|942280|Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts|
|942290|Finds basic MongoDB SQL injection attempts|
|942300|Detects MySQL comments, conditions, and ch(a)r injections|
|942310|Detects chained SQL injection attempts 2/2|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections|
|942330|Detects classic SQL injection probings 1/2|
|942340|Detects basic SQL authentication bypass attempts 3/3|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts|
|942361|Detects basic SQL injection based on keyword alter or union|
|942370|Detects classic SQL injection probings 2/2|
|942380|SQL Injection Attack|
|942390|SQL Injection Attack|
|942400|SQL Injection Attack|
|942410|SQL Injection Attack|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified|
|942460|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|
|942500|MySQL in-line comment detected.|
|942510|SQLi bypass attempt by ticks or backticks detected.|


### <a name="drs943-20"></a> <p x-ms-format-detection="none">SESSION-FIXATION</p>
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-20"></a> <p x-ms-format-detection="none">JAVA Attacks</p>
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Detects potential payload execution|
|944120|Possible payload execution and remote command execution|
|944130|Suspicious Java classes|
|944200|Exploitation of Java deserialization Apache Commons|
|944210|Possible use of Java serialization|
|944240|Remote Command Execution: Java serialization|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-20"></a> <p x-ms-format-detection="none">MS-ThreatIntel-WebShells</p>
|RuleId|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|

### <a name="drs9903-20"></a> <p x-ms-format-detection="none">MS-ThreatIntel-AppSec</p>
|RuleId|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-20"></a> <p x-ms-format-detection="none">MS-ThreatIntel-SQLI</p>
|RuleId|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected.|

### <a name="drs99001-20"></a> <p x-ms-format-detection="none">MS-ThreatIntel-CVEs</p>
|RuleId|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|

# [DRS 1.1](#tab/drs11)

## <a name="drs11"></a> 1.1 rule sets

### <a name="drs921-11"></a> <p x-ms-format-detection="none">PROTOCOL-ATTACK</p>
|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-11"></a> <p x-ms-format-detection="none">LFI - Local File Inclusion</p>
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-11"></a> <p x-ms-format-detection="none">RFI - Remote File Inclusion</p>
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-11"></a> <p x-ms-format-detection="none">RCE - Remote Command Execution</p>
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|931120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-11"></a> <p x-ms-format-detection="none">PHP Attacks</p>
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: PHP Open Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|

### <a name="drs941-11"></a> <p x-ms-format-detection="none">XSS - Cross-site Scripting</p>
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: Javascript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blacklist Keywords|
|941190|IE XSS Filters - Attack Detected.|
|941200|IE XSS Filters - Attack Detected.|
|941210|IE XSS Filters - Attack Detected.|
|941220|IE XSS Filters - Attack Detected.|
|941230|IE XSS Filters - Attack Detected.|
|941240|IE XSS Filters - Attack Detected.|
|941250|IE XSS Filters - Attack Detected.|
|941260|IE XSS Filters - Attack Detected.|
|941270|IE XSS Filters - Attack Detected.|
|941280|IE XSS Filters - Attack Detected.|
|941290|IE XSS Filters - Attack Detected.|
|941300|IE XSS Filters - Attack Detected.|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|

### <a name="drs942-11"></a> <p x-ms-format-detection="none">SQLI - SQL Injection</p>
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind sqli tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic sql injection. Common attack string for mysql, oracle and others.|
|942280|Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts|
|942290|Finds basic MongoDB SQL injection attempts|
|942300|Detects MySQL comments, conditions and ch(a)r injections|
|942310|Detects chained SQL injection attempts 2/2|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections|
|942330|Detects classic SQL injection probings 1/3|
|942340|Detects basic SQL authentication bypass attempts 3/3|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts|
|942361|Detects basic SQL injection based on keyword alter or union|
|942370|Detects classic SQL injection probings 2/3|
|942380|SQL Injection Attack|
|942390|SQL Injection Attack|
|942400|SQL Injection Attack|
|942410|SQL Injection Attack|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|

### <a name="drs943-11"></a> <p x-ms-format-detection="none">SESSION-FIXATION</p>
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-11"></a> <p x-ms-format-detection="none">JAVA Attacks</p>
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Suspicious Java class detected|
|944110|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|944120|Remote Command Execution: Java serialization (CVE-2015-5842)|
|944130|Suspicious Java class detected|
|944200|Magic bytes Detected, probable java serialization in use|
|944210|Magic bytes Detected Base64 Encoded, probable java serialization in use|
|944240|Remote Command Execution: Java serialization (CVE-2015-5842)|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-11"></a> <p x-ms-format-detection="none">MS-ThreatIntel-WebShells</p>
|RuleId|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|

### <a name="drs9903-11"></a> <p x-ms-format-detection="none">MS-ThreatIntel-AppSec</p>
|RuleId|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-11"></a> <p x-ms-format-detection="none">MS-ThreatIntel-SQLI</p>
|RuleId|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected.|

### <a name="drs99001-11"></a> <p x-ms-format-detection="none">MS-ThreatIntel-CVEs</p>
|RuleId|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|

# [DRS 1.0](#tab/drs10)

## <a name="drs10"></a> 1.0 rule sets

### <a name="drs921-10"></a> <p x-ms-format-detection="none">PROTOCOL-ATTACK</p>
|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-10"></a> <p x-ms-format-detection="none">LFI - Local File Inclusion</p>
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-10"></a> <p x-ms-format-detection="none">RFI - Remote File Inclusion</p>
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-10"></a> <p x-ms-format-detection="none">RCE - Remote Command Execution</p>
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|932120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Unix Shell Code Found|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-10"></a> <p x-ms-format-detection="none">PHP Attacks</p>
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: Opening/Closing Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933131|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933161|PHP Injection Attack: Low-Value PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|

### <a name="drs941-10"></a> <p x-ms-format-detection="none">XSS - Cross-site Scripting</p>
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection.|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blacklist Keywords|
|941190|XSS Using style sheets|
|941200|XSS using VML frames|
|941210|XSS using obfuscated JavaScript|
|941220|XSS using obfuscated VB Script|
|941230|XSS using 'embed' tag|
|941240|XSS using 'import' or 'implementation' attribute|
|941250|IE XSS Filters - Attack Detected.|
|941260|XSS using 'meta' tag|
|941270|XSS using 'link' href|
|941280|XSS using 'base' tag|
|941290|XSS using 'applet' tag|
|941300|XSS using 'object' tag|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|

### <a name="drs942-10"></a> <p x-ms-format-detection="none">SQLI - SQL Injection</p>
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind sqli tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic sql injection. Common attack string for mysql, oracle, and others.|
|942280|Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts|
|942290|Finds basic MongoDB SQL injection attempts|
|942300|Detects MySQL comments, conditions, and ch(a)r injections|
|942310|Detects chained SQL injection attempts 2/2|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections|
|942330|Detects classic SQL injection probings 1/2|
|942340|Detects basic SQL authentication bypass attempts 3/3|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts|
|942361|Detects basic SQL injection based on keyword alter or union|
|942370|Detects classic SQL injection probings 2/2|
|942380|SQL Injection Attack|
|942390|SQL Injection Attack|
|942400|SQL Injection Attack|
|942410|SQL Injection Attack|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|

### <a name="drs943-10"></a> <p x-ms-format-detection="none">SESSION-FIXATION</p>
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-10"></a> <p x-ms-format-detection="none">JAVA Attacks</p>
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Detects potential payload execution|
|944120|Possible payload execution and remote command execution|
|944130|Suspicious Java classes|
|944200|Exploitation of Java deserialization Apache Commons|
|944210|Possible use of Java serialization|
|944240|Remote Command Execution: Java serialization|
|944250|Remote Command Execution: Suspicious Java method detected|

# [Bot rules](#tab/bot)

## <a name="bot"></a> Bot Manager rule sets

### <a name="bot100"></a> <p x-ms-format-detection="none">Bad bots</p>
|RuleId|Description|
|---|---|
|Bot100100|Malicious bots detected by threat intelligence|
|Bot100200|Malicious bots that have falsified their identity|

### <a name="bot200"></a> <p x-ms-format-detection="none">Good bots</p>
|RuleId|Description|
|---|---|
|Bot200100|Search engine crawlers|
|Bot200200|Unverified search engine crawlers|

### <a name="bot300"></a> <p x-ms-format-detection="none">Unknown bots</p>
|RuleId|Description|
|---|---|
|Bot300100|Unspecified identity|
|Bot300200|Tools and frameworks for web crawling and attacks|
|Bot300300|General purpose HTTP clients and SDKs|
|Bot300400|Service agents|
|Bot300500|Site health monitoring services|
|Bot300600|Unknown bots detected by threat intelligence|
|Bot300700|Other bots|

---


## Next steps

- [Custom rules for Web Application Firewall with Azure Front Door](waf-front-door-custom-rules.md)
