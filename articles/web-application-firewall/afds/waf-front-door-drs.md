---
title: Azure Web Application Firewall DRS rule groups and rules
description: This article provides information on Azure Web Application Firewall DRS rule groups and rules.
ms.service: web-application-firewall
author: vhorne
ms.author: victorh
ms.topic: conceptual
ms.date: 10/25/2022
---

# Web Application Firewall DRS rule groups and rules

Azure Web Application Firewall on Azure Front Door protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Because such rule sets are managed by Azure, the rules are updated as needed to protect against new attack signatures.

The Default Rule Set (DRS) also includes the Microsoft Threat Intelligence Collection rules that are written in partnership with the Microsoft Intelligence team to provide increased coverage, patches for specific vulnerabilities, and better false positive reduction.

## Default rule sets

The Azure-managed DRS includes rules against the following threat categories:

- Cross-site scripting
- Java attacks
- Local file inclusion
- PHP injection attacks
- Remote command execution
- Remote file inclusion
- Session fixation
- SQL injection protection
- Protocol attackers

The version number of the DRS increments when new attack signatures are added to the rule set.

DRS is enabled by default in Detection mode in your WAF policies. You can disable or enable individual rules within the DRS to meet your application requirements. You can also set specific actions per rule. The available actions are [Allow, Block, Log, and Redirect](afds-overview.md#waf-actions).

Sometimes you might need to omit certain request attributes from a web application firewall (WAF) evaluation. A common example is Active Directory-inserted tokens that are used for authentication. You might configure an exclusion list for a managed rule, a rule group, or the entire rule set. For more information, see [Azure Web Application Firewall on Azure Front Door exclusion lists](./waf-front-door-exclusion.md).

By default, DRS versions 2.0 and above use anomaly scoring when a request matches a rule. DRS versions earlier than 2.0 block requests that trigger the rules. Also, custom rules can be configured in the same WAF policy if you want to bypass any of the preconfigured rules in the DRS.

Custom rules are always applied before rules in the DRS are evaluated. If a request matches a custom rule, the corresponding rule action is applied. The request is either blocked or passed through to the back end. No other custom rules or the rules in the DRS are processed. You can also remove the DRS from your WAF policies.

### Microsoft Threat Intelligence Collection rules

The Microsoft Threat Intelligence Collection rules are written in partnership with the Microsoft Threat Intelligence team to provide increased coverage, patches for specific vulnerabilities, and better false positive reduction.

Some of the built-in DRS rules are disabled by default because they've been replaced by newer rules in the Microsoft Threat Intelligence Collection rules. For example, rule ID 942440, *SQL Comment Sequence Detected*, has been disabled and replaced by the Microsoft Threat Intelligence Collection rule 99031002. The replaced rule reduces the risk of false positive detections from legitimate requests.

### <a name="anomaly-scoring-mode"></a>Anomaly scoring

When you use DRS 2.0 or later, your WAF uses *anomaly scoring*. Traffic that matches any rule isn't immediately blocked, even when your WAF is in prevention mode. Instead, the OWASP rule sets define a severity for each rule: *Critical*, *Error*, *Warning*, or *Notice*. The severity affects a numeric value for the request, which is called the *anomaly score*. If a request accumulates an anomaly score of 5 or greater, the WAF takes action on the request.

| Rule severity | Value contributed to anomaly score |
|-|-|
| Critical | 5 |
| Error | 4 |
| Warning | 3 |
| Notice | 2 |

When you configure your WAF, you can decide how the WAF handles requests that exceed the anomaly score threshold of 5. The three anomaly score action options are Block, Log, or Redirect. The anomaly score action you select at the time of configuration is applied to all requests that exceed the anomaly score threshold.

For example, if the anomaly score is 5 or greater on a request, and the WAF is in Prevention mode with the anomaly score action set to Block, the request is blocked. If the anomaly score is 5 or greater on a request, and the WAF is in Detection mode, the request is logged but not blocked.

A single *Critical* rule match is enough for the WAF to block a request when in Prevention mode with the anomaly score action set to Block because the overall anomaly score is 5. However, one *Warning* rule match only increases the anomaly score by 3, which isn't enough by itself to block the traffic. When an anomaly rule is triggered, it shows a "matched" action in the logs. If the anomaly score is 5 or greater, there will be a separate rule triggered with the anomaly score action configured for the rule set. Default anomaly score action is Block, which results in a log entry with the action `blocked`.

When your WAF uses an older version of the Default Rule Set (before DRS 2.0), your WAF runs in the traditional mode. Traffic that matches any rule is considered independently of any other rule matches. In traditional mode, you don't have visibility into the complete set of rules that a specific request matched.

The version of the DRS that you use also determines which content types are supported for request body inspection. For more information, see [What content types does WAF support?](waf-faq.yml#what-content-types-does-waf-support-) in the FAQ.

### DRS 2.1

DRS 2.1 rules offer better protection than earlier versions of the DRS. It includes other rules developed by the Microsoft Threat Intelligence team and updates to signatures to reduce false positives. It also supports transformations beyond just URL decoding.

DRS 2.1 includes 17 rule groups, as shown in the following table. Each group contains multiple rules, and you can customize behavior for individual rules, rule groups, or an entire rule set. For more information, see [Tuning Web Application Firewall (WAF) for Azure Front Door](waf-front-door-tuning.md).

> [!NOTE]
> DRS 2.1 is only available on Azure Front Door Premium.

|Rule group|Description|
|---|---|
|[General](#general-21)|General group|
|[METHOD-ENFORCEMENT](#drs911-21)|Lock-down methods (PUT, PATCH)|
|[PROTOCOL-ENFORCEMENT](#drs920-21)|Protect against protocol and encoding issues|
|[PROTOCOL-ATTACK](#drs921-21)|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](#drs930-21)|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](#drs931-21)|Protect against remote file inclusion (RFI) attacks|
|[APPLICATION-ATTACK-RCE](#drs932-21)|Protect again remote code execution attacks|
|[APPLICATION-ATTACK-PHP](#drs933-21)|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-NodeJS](#drs934-21)|Protect against Node JS attacks|
|[APPLICATION-ATTACK-XSS](#drs941-21)|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](#drs942-21)|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-21)|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](#drs944-21)|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](#drs9905-21)|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](#drs9903-21)|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](#drs99031-21)|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](#drs99001-21)|Protect against CVE attacks|

#### Disabled rules

The following rules are disabled by default for DRS 2.1.

|Rule ID  |Rule group|Description  |Details|
|---------|---------|---------|---------|
|942110      |SQLI|SQL Injection Attack: Common Injection Testing Detected |Replaced by MSTIC rule 99031001 |
|942150      |SQLI|SQL Injection Attack|Replaced by MSTIC rule 99031003 |
|942260      |SQLI|Detects basic SQL authentication bypass attempts 2/3 |Replaced by MSTIC rule 99031004 |
|942430      |SQLI|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|Too many false positives|
|942440      |SQLI|SQL Comment Sequence Detected|Replaced by MSTIC rule 99031002 |
|99005006|MS-ThreatIntel-WebShells|Spring4Shell Interaction Attempt|Enable rule to prevent against SpringShell vulnerability|
|99001014|MS-ThreatIntel-CVEs|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|Enable rule to prevent against SpringShell vulnerability|
|99001015|MS-ThreatIntel-WebShells|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|Enable rule to prevent against SpringShell vulnerability|
|99001016|MS-ThreatIntel-WebShells|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|Enable rule to prevent against SpringShell vulnerability|

### DRS 2.0

DRS 2.0 rules offer better protection than earlier versions of the DRS. DRS 2.0 also supports transformations beyond just URL decoding.

DRS 2.0 includes 17 rule groups, as shown in the following table. Each group contains multiple rules. You can disable individual rules and entire rule groups.

> [!NOTE]
> DRS 2.0 is only available on Azure Front Door Premium.

|Rule group|Description|
|---|---|
|[General](#general-20)|General group|
|[METHOD-ENFORCEMENT](#drs911-20)|Lock-down methods (PUT, PATCH)|
|[PROTOCOL-ENFORCEMENT](#drs920-20)|Protect against protocol and encoding issues|
|[PROTOCOL-ATTACK](#drs921-20|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](#drs930-20)|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](#drs931-20)|Protect against remote file inclusion (RFI) attacks|
|[APPLICATION-ATTACK-RCE](#drs932-20)|Protect again remote code execution attacks|
|[APPLICATION-ATTACK-PHP](#drs933-20)|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-NodeJS](#drs934-20)|Protect against Node JS attacks|
|[APPLICATION-ATTACK-XSS](#drs941-20)|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](#drs942-20)|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-20)|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](#drs944-20)|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](#drs9905-20)|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](#drs9903-20)|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](#drs99031-20)|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](#drs99001-20)|Protect against CVE attacks|

### DRS 1.1
|Rule group|Description|
|---|---|
|[PROTOCOL-ATTACK](#drs921-11)|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](#drs930-11)|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](#drs931-11)|Protection against remote file inclusion attacks|
|[APPLICATION-ATTACK-RCE](#drs932-11)|Protection against remote command execution|
|[APPLICATION-ATTACK-PHP](#drs933-11)|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-XSS](#drs941-11)|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](#drs942-11)|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-11)|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](#drs944-11)|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](#drs9905-11)|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](#drs9903-11)|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](#drs99031-11)|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](#drs99001-11)|Protect against CVE attacks|

### DRS 1.0

|Rule group|Description|
|---|---|
|[PROTOCOL-ATTACK](#drs921-10)|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](#drs930-10)|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](#drs931-10)|Protection against remote file inclusion attacks|
|[APPLICATION-ATTACK-RCE](#drs932-10)|Protection against remote command execution|
|[APPLICATION-ATTACK-PHP](#drs933-10)|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-XSS](#drs941-10)|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](#drs942-10)|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](#drs943-10)|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](#drs944-10)|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](#drs9905-10)|Protect against Web shell attacks|
|[MS-ThreatIntel-CVEs](#drs99001-10)|Protect against CVE attacks|

### Bot rules

|Rule group|Description|
|---|---|
|[BadBots](#bot100)|Protect against bad bots|
|[GoodBots](#bot200)|Identify good bots|
|[UnknownBots](#bot300)|Identify unknown bots|

The following rule groups and rules are available when you use Azure Web Application Firewall on Azure Front Door.

# [DRS 2.1](#tab/drs21)

## <a name="drs21"></a> 2.1 rule sets

### <a name="general-21"></a> General
|RuleId|Description|
|---|---|
|200002|Failed to parse request body|
|200003|Multipart request body failed strict validation|


### <a name="drs911-21"></a> Method enforcement
|RuleId|Description|
|---|---|
|911100|Method isn't allowed by policy|

### <a name="drs920-21"></a> Protocol enforcement
|RuleId|Description|
|---|---|
|920100|Invalid HTTP Request Line.|
|920120|Attempted multipart/form-data bypass.|
|920121|Attempted multipart/form-data bypass.|
|920160|Content-Length HTTP header isn't numeric.|
|920170|GET or HEAD Request with Body Content.|
|920171|GET or HEAD Request with Transfer-Encoding.|
|920180|POST request missing Content-Length Header.|
|920181|Content-Length and Transfer-Encoding headers present 99001003.|
|920190|Range: Invalid Last Byte Value.|
|920200|Range: Too many fields (6 or more).|
|920201|Range: Too many fields for pdf request (35 or more).|
|920210|Multiple/Conflicting Connection Header Data Found.|
|920220|URL Encoding Abuse Attack Attempt.|
|920230|Multiple URL Encoding Detected.|
|920240|URL Encoding Abuse Attack Attempt.|
|920260|Unicode Full/Half Width Abuse Attack Attempt.|
|920270|Invalid character in request (null character).|
|920271|Invalid character in request (nonprintable characters).|
|920280|Request Missing a Host Header.|
|920290|Empty Host Header.|
|920300|Request Missing an Accept Header.|
|920310|Request Has an Empty Accept Header.|
|920311|Request Has an Empty Accept Header.|
|920320|Missing User Agent Header.|
|920330|Empty User Agent Header.|
|920340|Request Containing Content, but Missing Content-Type header.|
|920341|Request containing content requires Content-Type header.|
|920350|Host header is a numeric IP address.|
|920420|Request content type isn't allowed by policy.|
|920430|HTTP protocol version isn't allowed by policy.|
|920440|URL file extension is restricted by policy.|
|920450|HTTP header is restricted by policy.|
|920470|Illegal Content-Type header.|
|920480|Request content type charset isn't allowed by policy.|
|920500|Attempt to access a backup or working file.|

### <a name="drs921-21"></a> Protocol attack

|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|
|921190|HTTP Splitting (CR/LF in request filename detected)|
|921200|LDAP Injection Attack|

### <a name="drs930-21"></a> LFI: Local file inclusion
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-21"></a> RFI: Remote file inclusion
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-21"></a> RCE: Remote command execution
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|932120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression or Confluence Vulnerability (CVE-2022-26134) Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Unix Shell Code Found|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-21"></a> PHP attacks
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: Opening/Closing Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|
|933200|PHP Injection Attack: Wrapper scheme detected|
|933210|PHP Injection Attack: Variable Function Call Found|

### <a name="drs934-21"></a> Node JS attacks
|RuleId|Description|
|---|---|
|934100|Node.js Injection Attack|

### <a name="drs941-21"></a> XSS: Cross-site scripting
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection<br />Rule detects requests with a `Referer` header|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blacklist Keywords|
|941190|XSS using style sheets|
|941200|XSS using VML frames|
|941210|XSS using obfuscated JavaScript|
|941220|XSS using obfuscated VB Script|
|941230|XSS using `embed` tag|
|941240|XSS using `import` or `implementation` attribute|
|941250|IE XSS Filters - Attack Detected|
|941260|XSS using `meta` tag|
|941270|XSS using `link` href|
|941280|XSS using `base` tag|
|941290|XSS using `applet` tag|
|941300|XSS using `object` tag|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941330|IE XSS Filters - Attack Detected|
|941340|IE XSS Filters - Attack Detected|
|941350|UTF-7 Encoding IE XSS - Attack Detected|
|941360|JavaScript obfuscation detected|
|941370|JavaScript global variable found|
|941380|AngularJS client side template injection detected|

>[!NOTE]
> This article contains references to the term *blacklist*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

### <a name="drs942-21"></a> SQLI: SQL injection
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection.|
|942110|SQL Injection Attack: Common Injection Testing Detected.|
|942120|SQL Injection Attack: SQL Operator Detected.|
|942140|SQL Injection Attack: Common DB Names Detected.|
|942150|SQL Injection Attack.|
|942160|Detects blind SQLI tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries.|
|942180|Detects basic SQL authentication bypass attempts 1/3.|
|942190|Detects MSSQL code execution and information gathering attempts.|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination.|
|942210|Detects chained SQL injection attempts 1/2.|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash.|
|942230|Detects conditional SQL injection attempts.|
|942240|Detects MySQL charset switch and MSSQL DoS attempts.|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections.|
|942260|Detects basic SQL authentication bypass attempts 2/3.|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others.|
|942280|Detects Postgres pg_sleep injection, wait for delay attacks, and database shutdown attempts.|
|942290|Finds basic MongoDB SQL injection attempts.|
|942300|Detects MySQL comments, conditions, and ch(a)r injections.|
|942310|Detects chained SQL injection attempts 2/2.|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections.|
|942330|Detects classic SQL injection probings 1/2.|
|942340|Detects basic SQL authentication bypass attempts 3/3.|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts.|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts.|
|942361|Detects basic SQL injection based on keyword alter or union.|
|942370|Detects classic SQL injection probings 2/2.|
|942380|SQL Injection Attack.|
|942390|SQL Injection Attack.|
|942400|SQL Injection Attack.|
|942410|SQL Injection Attack.|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12).|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified.|
|942460|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters.|
|942470|SQL Injection Attack.|
|942480|SQL Injection Attack.|
|942500|MySQL in-line comment detected.|
|942510|SQLi bypass attempt by ticks or backticks detected.|

### <a name="drs943-21"></a> Session fixation
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-21"></a> Java attacks
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Detects potential payload execution|
|944120|Possible payload execution and remote command execution|
|944130|Suspicious Java classes|
|944200|Exploitation of Java deserialization Apache Commons|
|944210|Possible use of Java serialization|
|944240|Remote Command Execution: Java serialization and Log4j vulnerability ([CVE-2021-44228](https://www.cve.org/CVERecord?id=CVE-2021-44228), [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046))|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-21"></a> MS-ThreatIntel-WebShells
|RuleId|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005005|Web Shell Interaction Attempt|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs9903-21"></a> MS-ThreatIntel-AppSec
|RuleId|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-21"></a> MS-ThreatIntel-SQLI
|RuleId|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected|
|99031003|SQL Injection Attack|
|99031004|Detects basic SQL authentication bypass attempts 2/3|

### <a name="drs99001-21"></a> MS-ThreatIntel-CVEs
|RuleId|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API exploitation with known credentials|
|99001002|Attempted Citrix NSC_USER directory traversal [CVE-2019-19781](https://www.cve.org/CVERecord?id=CVE-2019-19781)|
|99001003|Attempted Atlassian Confluence Widget Connector exploitation [CVE-2019-3396](https://www.cve.org/CVERecord?id=CVE-2019-3396)|
|99001004|Attempted Pulse Secure custom template exploitation [CVE-2020-8243](https://www.cve.org/CVERecord?id=CVE-2019-8243)|
|99001005|Attempted SharePoint type converter exploitation [CVE-2020-0932](https://www.cve.org/CVERecord?id=CVE-2019-0932)|
|99001006|Attempted Pulse Connect directory traversal [CVE-2019-11510](https://www.cve.org/CVERecord?id=CVE-2019-11510)|
|99001007|Attempted Junos OS J-Web local file inclusion [CVE-2020-1631](https://www.cve.org/CVERecord?id=CVE-2019-1631)|
|99001008|Attempted Fortinet path traversal [CVE-2018-13379](https://www.cve.org/CVERecord?id=CVE-2019-13379)|
|99001009|Attempted Apache struts ognl injection [CVE-2017-5638](https://www.cve.org/CVERecord?id=CVE-2019-5638)|
|99001010|Attempted Apache struts ognl injection [CVE-2017-12611](https://www.cve.org/CVERecord?id=CVE-2019-12611)|
|99001011|Attempted Oracle WebLogic path traversal [CVE-2020-14882](https://www.cve.org/CVERecord?id=CVE-2019-14882)|
|99001012|Attempted Telerik WebUI insecure deserialization exploitation [CVE-2019-18935](https://www.cve.org/CVERecord?id=CVE-2019-18935)|
|99001013|Attempted SharePoint insecure XML deserialization [CVE-2019-0604](https://www.cve.org/CVERecord?id=CVE-2019-0604)|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|

> [!NOTE]
> When you review your WAF's logs, you might see rule ID 949110. The description of the rule might include *Inbound Anomaly Score Exceeded*.
>
> This rule indicates that the total anomaly score for the request exceeded the maximum allowable score. For more information, see [Anomaly scoring](#anomaly-scoring-mode).
> 
> When you tune your WAF policies, you need to investigate the other rules that were triggered by the request so that you can adjust your WAF's configuration. For more information, see [Tuning Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

# [DRS 2.0](#tab/drs20)

## <a name="drs20"></a> 2.0 rule sets

### <a name="general-20"></a> General
|RuleId|Description|
|---|---|
|200002|Failed to parse request body.|
|200003|Multipart request body failed strict validation.|


### <a name="drs911-20"></a> Method enforcement
|RuleId|Description|
|---|---|
|911100|Method isn't allowed by policy.|

### <a name="drs920-20"></a> Protocol enforcement
|RuleId|Description|
|---|---|
|920100|Invalid HTTP Request Line.|
|920120|Attempted multipart/form-data bypass.|
|920121|Attempted multipart/form-data bypass.|
|920160|Content-Length HTTP header isn't numeric.|
|920170|GET or HEAD Request with Body Content.|
|920171|GET or HEAD Request with Transfer-Encoding.|
|920180|POST request missing Content-Length Header.|
|920190|Range: Invalid Last Byte Value.|
|920200|Range: Too many fields (6 or more).|
|920201|Range: Too many fields for pdf request (35 or more).|
|920210|Multiple/Conflicting Connection Header Data Found.|
|920220|URL Encoding Abuse Attack Attempt.|
|920230|Multiple URL Encoding Detected.|
|920240|URL Encoding Abuse Attack Attempt.|
|920260|Unicode Full/Half Width Abuse Attack Attempt.|
|920270|Invalid character in request (null character).|
|920271|Invalid character in request (nonprintable characters).|
|920280|Request Missing a Host Header.|
|920290|Empty Host Header.|
|920300|Request Missing an Accept Header.|
|920310|Request Has an Empty Accept Header.|
|920311|Request Has an Empty Accept Header.|
|920320|Missing User Agent Header.|
|920330|Empty User Agent Header.|
|920340|Request Containing Content, but Missing Content-Type header.|
|920341|Request containing content requires Content-Type header.|
|920350|Host header is a numeric IP address.|
|920420|Request content type isn't allowed by policy.|
|920430|HTTP protocol version isn't allowed by policy.|
|920440|URL file extension is restricted by policy.|
|920450|HTTP header is restricted by policy.|
|920470|Illegal Content-Type header.|
|920480|Request content type charset isn't allowed by policy.|

### <a name="drs921-20"></a> Protocol attack

|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-20"></a> LFI: Local file inclusion
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-20"></a> RFI: Remote file inclusion
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-20"></a> RCE: Remote command execution
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|932120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression or Confluence Vulnerability (CVE-2022-26134) or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)) Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Unix Shell Code Found|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-20"></a> PHP attacks
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: Opening/Closing Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|
|933200|PHP Injection Attack: Wrapper scheme detected|
|933210|PHP Injection Attack: Variable Function Call Found|

### <a name="drs934-20"></a> Node JS attacks
|RuleId|Description|
|---|---|
|934100|Node.js Injection Attack|

### <a name="drs941-20"></a> XSS: Cross-site scripting
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection.|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header.|
|941110|XSS Filter - Category 1: Script Tag Vector.|
|941120|XSS Filter - Category 2: Event Handler Vector.|
|941130|XSS Filter - Category 3: Attribute Vector.|
|941140|XSS Filter - Category 4: JavaScript URI Vector.|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes.|
|941160|NoScript XSS InjectionChecker: HTML Injection.|
|941170|NoScript XSS InjectionChecker: Attribute Injection.|
|941180|Node-Validator Blacklist Keywords.|
|941190|XSS Using style sheets.|
|941200|XSS using VML frames.|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)).|
|941220|XSS using obfuscated VB Script.|
|941230|XSS using `embed` tag.|
|941240|XSS using `import` or `implementation` attribute.|
|941250|IE XSS Filters - Attack Detected.|
|941260|XSS using `meta` tag.|
|941270|XSS using `link` href.|
|941280|XSS using `base` tag.|
|941290|XSS using `applet` tag.|
|941300|XSS using `object` tag.|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941320|Possible XSS Attack Detected - HTML Tag Handler.|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|
|941360|JavaScript obfuscation detected.|
|941370|JavaScript global variable found.|
|941380|AngularJS client side template injection detected.|

>[!NOTE]
> This article contains references to the term *blacklist*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

### <a name="drs942-20"></a> SQLI: SQL injection
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection.|
|942110|SQL Injection Attack: Common Injection Testing Detected.|
|942120|SQL Injection Attack: SQL Operator Detected.|
|942140|SQL Injection Attack: Common DB Names Detected.|
|942150|SQL Injection Attack.|
|942160|Detects blind SQLI tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries.|
|942180|Detects basic SQL authentication bypass attempts 1/3.|
|942190|Detects MSSQL code execution and information gathering attempts.|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination.|
|942210|Detects chained SQL injection attempts 1/2.|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash.|
|942230|Detects conditional SQL injection attempts.|
|942240|Detects MySQL charset switch and MSSQL DoS attempts.|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections.|
|942260|Detects basic SQL authentication bypass attempts 2/3.|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others.|
|942280|Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts.|
|942290|Finds basic MongoDB SQL injection attempts.|
|942300|Detects MySQL comments, conditions, and ch(a)r injections.|
|942310|Detects chained SQL injection attempts 2/2.|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections.|
|942330|Detects classic SQL injection probings 1/2.|
|942340|Detects basic SQL authentication bypass attempts 3/3.|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts.|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts.|
|942361|Detects basic SQL injection based on keyword alter or union.|
|942370|Detects classic SQL injection probings 2/2.|
|942380|SQL Injection Attack.|
|942390|SQL Injection Attack.|
|942400|SQL Injection Attack.|
|942410|SQL Injection Attack.|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12).|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified.|
|942460|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters.|
|942470|SQL Injection Attack.|
|942480|SQL Injection Attack.|
|942500|MySQL in-line comment detected.|
|942510|SQLi bypass attempt by ticks or backticks detected.|

### <a name="drs943-20"></a> Session fixation
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-20"></a> Java attacks
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Detects potential payload execution|
|944120|Possible payload execution and remote command execution|
|944130|Suspicious Java classes|
|944200|Exploitation of Java deserialization Apache Commons|
|944210|Possible use of Java serialization|
|944240|Remote Command Execution: Java serialization and Log4j vulnerability ([CVE-2021-44228](https://www.cve.org/CVERecord?id=CVE-2021-44228), [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046))|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-20"></a> MS-ThreatIntel-WebShells
|RuleId|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs9903-20"></a> MS-ThreatIntel-AppSec
|RuleId|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-20"></a> MS-ThreatIntel-SQLI
|RuleId|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected|

### <a name="drs99001-20"></a> MS-ThreatIntel-CVEs
|RuleId|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)

> [!NOTE]
> When you review your WAF's logs, you might see rule ID 949110. The description of the rule might include *Inbound Anomaly Score Exceeded*.
>
> This rule indicates that the total anomaly score for the request exceeded the maximum allowable score. For more information, see [Anomaly scoring](#anomaly-scoring-mode).
>
> When you tune your WAF policies, you need to investigate the other rules that were triggered by the request so that you can adjust your WAF's configuration. For more information, see [Tuning Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

# [DRS 1.1](#tab/drs11)

## <a name="drs11"></a> 1.1 rule sets

### <a name="drs921-11"></a> Protocol attack
|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-11"></a> LFI: Local file inclusion
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-11"></a> RFI: Remote file inclusion
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-11"></a> RCE: Remote command execution
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|931120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression or Confluence Vulnerability (CVE-2022-26134) or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)) Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-11"></a> PHP attacks
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

### <a name="drs941-11"></a> XSS: Cross-site scripting
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection.|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header.|
|941110|XSS Filter - Category 1: Script Tag Vector.|
|941120|XSS Filter - Category 2: Event Handler Vector.|
|941130|XSS Filter - Category 3: Attribute Vector.|
|941140|XSS Filter - Category 4: JavaScript URI Vector.|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes.|
|941160|NoScript XSS InjectionChecker: HTML Injection.|
|941170|NoScript XSS InjectionChecker: Attribute Injection.|
|941180|Node-Validator Blacklist Keywords.|
|941190|IE XSS Filters - Attack Detected.|
|941200|IE XSS Filters - Attack Detected.|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)) found.|
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
|941320|Possible XSS Attack Detected - HTML Tag Handler.|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|

>[!NOTE]
> This article contains references to the term *blacklist*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

### <a name="drs942-11"></a> SQLI: SQL injection
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection.|
|942110|SQL Injection Attack: Common Injection Testing Detected.|
|942120|SQL Injection Attack: SQL Operator Detected.|
|942140|SQL Injection Attack: Common DB Names Detected.|
|942150|SQL Injection Attack.|
|942160|Detects blind SQLI tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries.|
|942180|Detects basic SQL authentication bypass attempts 1/3.|
|942190|Detects MSSQL code execution and information gathering attempts.|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination.|
|942210|Detects chained SQL injection attempts 1/2.|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash.|
|942230|Detects conditional SQL injection attempts.|
|942240|Detects MySQL charset switch and MSSQL DoS attempts.|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections.|
|942260|Detects basic SQL authentication bypass attempts 2/3.|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others.|
|942280|Detects Postgres pg_sleep injection, waitfor delay attacks and database shutdown attempts.|
|942290|Finds basic MongoDB SQL injection attempts.|
|942300|Detects MySQL comments, conditions and ch(a)r injections.|
|942310|Detects chained SQL injection attempts 2/2.|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections.|
|942330|Detects classic SQL injection probings 1/3.|
|942340|Detects basic SQL authentication bypass attempts 3/3.|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts.|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts.|
|942361|Detects basic SQL injection based on keyword alter or union.|
|942370|Detects classic SQL injection probings 2/3.|
|942380|SQL Injection Attack.|
|942390|SQL Injection Attack.|
|942400|SQL Injection Attack.|
|942410|SQL Injection Attack.|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12).|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified.|
|942470|SQL Injection Attack.|
|942480|SQL Injection Attack.|

### <a name="drs943-11"></a> Session fixation
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-11"></a> Java attacks
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Suspicious Java class detected|
|944110|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|944120|Remote Command Execution: Java serialization (CVE-2015-5842)|
|944130|Suspicious Java class detected|
|944200|Magic bytes Detected, probable Java serialization in use|
|944210|Magic bytes Detected Base64 Encoded, probable Java serialization in use|
|944240|Remote Command Execution: Java serialization and Log4j vulnerability ([CVE-2021-44228](https://www.cve.org/CVERecord?id=CVE-2021-44228), [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046))|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-11"></a> MS-ThreatIntel-WebShells
|RuleId|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs9903-11"></a> MS-ThreatIntel-AppSec
|RuleId|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-11"></a> MS-ThreatIntel-SQLI
|RuleId|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected|

### <a name="drs99001-11"></a> MS-ThreatIntel-CVEs
|RuleId|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|

# [DRS 1.0](#tab/drs10)

## <a name="drs10"></a> 1.0 rule sets

### <a name="drs921-10"></a> Protocol attack
|RuleId|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-10"></a> LFI: Local file inclusion
|RuleId|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-10"></a> RFI: Remote file inclusion
|RuleId|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-10"></a> RCE: Remote command execution
|RuleId|Description|
|---|---|
|932100|Remote Command Execution: Unix Command Injection|
|932105|Remote Command Execution: Unix Command Injection|
|932110|Remote Command Execution: Windows Command Injection|
|932115|Remote Command Execution: Windows Command Injection|
|932120|Remote Command Execution: Windows PowerShell Command Found|
|932130|Remote Command Execution: Unix Shell Expression or Confluence Vulnerability (CVE-2022-26134) or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)) Found|
|932140|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Remote Command Execution: Direct Unix Command Execution|
|932160|Remote Command Execution: Unix Shell Code Found|
|932170|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Restricted File Upload Attempt|

### <a name="drs933-10"></a> PHP attacks
|RuleId|Description|
|---|---|
|933100|PHP Injection Attack: Opening/Closing Tag Found|
|933110|PHP Injection Attack: PHP Script File Upload Found|
|933120|PHP Injection Attack: Configuration Directive Found|
|933130|PHP Injection Attack: Variables Found|
|933140|PHP Injection Attack: I/O Stream Found|
|933150|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|PHP Injection Attack: High-Risk PHP Function Call Found|
|933170|PHP Injection Attack: Serialized Object Injection|
|933180|PHP Injection Attack: Variable Function Call Found|

### <a name="drs941-10"></a> XSS: Cross-site scripting
|RuleId|Description|
|---|---|
|941100|XSS Attack Detected via libinjection.|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header.|
|941110|XSS Filter - Category 1: Script Tag Vector.|
|941120|XSS Filter - Category 2: Event Handler Vector.|
|941130|XSS Filter - Category 3: Attribute Vector.|
|941140|XSS Filter - Category 4: JavaScript URI Vector.|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes.|
|941160|NoScript XSS InjectionChecker: HTML Injection.|
|941170|NoScript XSS InjectionChecker: Attribute Injection.|
|941180|Node-Validator Blacklist Keywords.|
|941190|XSS Using style sheets.|
|941200|XSS using VML frames.|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)).|
|941220|XSS using obfuscated VB Script.|
|941230|XSS using `embed` tag.|
|941240|XSS using `import` or `implementation` attribute.|
|941250|IE XSS Filters - Attack Detected.|
|941260|XSS using `meta` tag.|
|941270|XSS using `link` href.|
|941280|XSS using `base` tag.|
|941290|XSS using `applet` tag.|
|941300|XSS using `object` tag.|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941320|Possible XSS Attack Detected - HTML Tag Handler.|
|941330|IE XSS Filters - Attack Detected.|
|941340|IE XSS Filters - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|

>[!NOTE]
> This article contains references to the term *blacklist*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

### <a name="drs942-10"></a> SQLI: SQL injection
|RuleId|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection.|
|942110|SQL Injection Attack: Common Injection Testing Detected.|
|942120|SQL Injection Attack: SQL Operator Detected.|
|942140|SQL Injection Attack: Common DB Names Detected.|
|942150|SQL Injection Attack.|
|942160|Detects blind SQLI tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries.|
|942180|Detects basic SQL authentication bypass attempts 1/3.|
|942190|Detects MSSQL code execution and information gathering attempts.|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination.|
|942210|Detects chained SQL injection attempts 1/2.|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash.|
|942230|Detects conditional SQL injection attempts.|
|942240|Detects MySQL charset switch and MSSQL DoS attempts.|
|942250|Detects MATCH AGAINST, MERGE and EXECUTE IMMEDIATE injections.|
|942260|Detects basic SQL authentication bypass attempts 2/3.|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others.|
|942280|Detects Postgres pg_sleep injection, wait for delay attacks and database shutdown attempts.|
|942290|Finds basic MongoDB SQL injection attempts.|
|942300|Detects MySQL comments, conditions, and ch(a)r injections.|
|942310|Detects chained SQL injection attempts 2/2.|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections.|
|942330|Detects classic SQL injection probings 1/2.|
|942340|Detects basic SQL authentication bypass attempts 3/3.|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts.|
|942360|Detects concatenated basic SQL injection and SQLLFI attempts.|
|942361|Detects basic SQL injection based on keyword alter or union.|
|942370|Detects classic SQL injection probings 2/2.|
|942380|SQL Injection Attack.|
|942390|SQL Injection Attack.|
|942400|SQL Injection Attack.|
|942410|SQL Injection Attack.|
|942430|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12).|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified.|
|942470|SQL Injection Attack.|
|942480|SQL Injection Attack.|

### <a name="drs943-10"></a> Session fixation
|RuleId|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-10"></a> Java attacks
|RuleId|Description|
|---|---|
|944100|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Detects potential payload execution|
|944120|Possible payload execution and remote command execution|
|944130|Suspicious Java classes|
|944200|Exploitation of Java deserialization Apache Commons|
|944210|Possible use of Java serialization|
|944240|Remote Command Execution: Java serialization and Log4j vulnerability ([CVE-2021-44228](https://www.cve.org/CVERecord?id=CVE-2021-44228), [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046))|
|944250|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-10"></a> MS-ThreatIntel-WebShells
|RuleId|Description|
|---|---|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs99001-10"></a> MS-ThreatIntel-CVEs
|RuleId|Description|
|---|---|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|

# [Bot rules](#tab/bot)

## <a name="bot"></a> Bot manager rule sets

### <a name="bot100"></a> Bad bots
|RuleId|Description|
|---|---|
|Bot100100|Malicious bots detected by threat intelligence|
|Bot100200|Malicious bots that have falsified their identity|
 
 Bot100100 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

### <a name="bot200"></a> Good bots
|RuleId|Description|
|---|---|
|Bot200100|Search engine crawlers|
|Bot200200|Unverified search engine crawlers|

### <a name="bot300"></a> Unknown bots
|RuleId|Description|
|---|---|
|Bot300100|Unspecified identity|
|Bot300200|Tools and frameworks for web crawling and attacks|
|Bot300300|General-purpose HTTP clients and SDKs|
|Bot300400|Service agents|
|Bot300500|Site health monitoring services|
|Bot300600|Unknown bots detected by threat intelligence|
|Bot300700|Other bots|

Bot300600 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

---

## Next steps

- [Custom rules for Azure Web Application Firewall on Azure Front Door](waf-front-door-custom-rules.md)
- [Learn more about Azure network security](../../networking/security/index.yml)
