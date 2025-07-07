---
title: Azure Web Application Firewall DRS rule groups and rules
description: Learn about the Azure Web Application Firewall Default Rule Set (DRS) rule groups and rules on Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 04/28/2025
# Customer intent: As a web application administrator, I want to configure and manage the Default Rule Set (DRS) for the Web Application Firewall, so that I can effectively protect my applications from various vulnerabilities and security threats.
---

# Web Application Firewall DRS rule groups and rules

Azure Web Application Firewall on Azure Front Door protects web applications from common vulnerabilities and exploits. Azure-managed rule sets provide an easy way to deploy protection against a common set of security threats. Because Azure manages these rule sets, the rules are updated as needed to protect against new attack signatures.

The Default Rule Set (DRS) also includes the Microsoft Threat Intelligence Collection rules that are written in partnership with the Microsoft Intelligence team to provide increased coverage, patches for specific vulnerabilities, and better false positive reduction.

> [!NOTE]
> When a ruleset version is changed in a WAF Policy, any existing customizations you made to your ruleset will be reset to the defaults for the new ruleset. See: [Upgrading or changing ruleset version](#upgrading-or-changing-ruleset-version).

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

By default, the Microsoft Threat Intelligence Collection rules replace some of the built-in DRS rules, causing them to be disabled. For example, rule ID 942440, *SQL Comment Sequence Detected*, has been disabled and replaced by the Microsoft Threat Intelligence Collection rule 99031002. The replaced rule reduces the risk of false positive detections from legitimate requests.

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

A single *Critical* rule match is enough for the WAF to block a request when in Prevention mode with the anomaly score action set to Block because the overall anomaly score is 5. However, one *Warning* rule match only increases the anomaly score by 3, which isn't enough by itself to block the traffic. When an anomaly rule is triggered, it shows a "matched" action in the logs. If the anomaly score is 5 or greater, there a separate rule is triggered with the anomaly score action configured for the rule set. Default anomaly score action is Block, which results in a log entry with the action `blocked`.

When your WAF uses an older version of the Default Rule Set (before DRS 2.0), your WAF runs in the traditional mode. Traffic that matches any rule is considered independently of any other rule matches. In traditional mode, you don't have visibility into the complete set of rules that a specific request matched.

The version of the DRS that you use also determines which content types are supported for request body inspection. For more information, see [What content types does WAF support](waf-faq.yml#what-content-types-does-waf-support-) in the FAQ.

## Paranoia level

Each rule is assigned in a specific Paranoia Level (PL). Rules configured in Paranoia Level 1 (PL1) are less aggressive and hardly ever trigger a false positive. They provide baseline security with minimal need for fine tuning. Rules in PL2 detect more attacks, but they're expected to trigger false positives which should be fine-tuned.

By default, all DRS rule versions are pre-configured in Paranoia Level 2, including rules assigned in both PL1 and in PL2.
If you want to use WAF exclusively with PL1, you can disable any or all PL2 rules or change their action to 'log'. PL3 and PL4 are currently not supported in Azure WAF.

### Upgrading or changing ruleset version

If you're upgrading, or assigning a new ruleset version, and would like to preserve existing rule overrides and exclusions, it's recommended to use PowerShell, CLI, REST API, or a template to make ruleset version changes. A new version of a ruleset can have newer rules, additional rule groups, and may have updates to existing signatures to enforce better security and reduce false positives. It's recommended to validate changes in a test environment, fine tune if necessary, and then deploy in a production environment.

> [!NOTE]
> If you're using the Azure portal to assign a new managed ruleset to a WAF policy, all the previous customizations from the existing managed ruleset such as rule state, rule actions, and rule level exclusions will be reset to the new managed ruleset's defaults. However, any custom rules, or policy settings will remain unaffected during the new ruleset assignment. You'll need to redefine rule overrides and validate changes before deploying in a production environment.

### DRS 2.1

DRS 2.1 rules offer better protection than earlier versions of the DRS. It includes other rules developed by the Microsoft Threat Intelligence team and updates to signatures to reduce false positives. It also supports transformations beyond just URL decoding.

DRS 2.1 includes 17 rule groups, as shown in the following table. Each group contains multiple rules, and you can customize behavior for individual rules, rule groups, or an entire rule set. DRS 2.1 is baselined off the Open Web Application Security Project (OWASP) Core Rule Set (CRS) 3.3.2 and includes additional proprietary protections rules developed by Microsoft Threat Intelligence team.

For more information, see [Tuning Web Application Firewall (WAF) for Azure Front Door](waf-front-door-tuning.md).

> [!NOTE]
> DRS 2.1 is only available on Azure Front Door Premium.

|Rule group|ruleGroupName|Description|
|---|---|---|
|[General](?tabs=drs21#general-21)|General|General group|
|[METHOD-ENFORCEMENT](?tabs=drs21#drs911-21)|METHOD-ENFORCEMENT|Lock-down methods (PUT, PATCH)|
|[PROTOCOL-ENFORCEMENT](?tabs=drs21#drs920-21)|PROTOCOL-ENFORCEMENT|Protect against protocol and encoding issues|
|[PROTOCOL-ATTACK](?tabs=drs21#drs921-21)|PROTOCOL-ATTACK|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](?tabs=drs21#drs930-21)|LFI|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](?tabs=drs21#drs931-21)|RFI|Protect against remote file inclusion (RFI) attacks|
|[APPLICATION-ATTACK-RCE](?tabs=drs21#drs932-21)|RCE|Protect again remote code execution attacks|
|[APPLICATION-ATTACK-PHP](?tabs=drs21#drs933-21)|PHP|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-NodeJS](?tabs=drs21#drs934-21)|NODEJS|Protect against Node JS attacks|
|[APPLICATION-ATTACK-XSS](?tabs=drs21#drs941-21)|XSS|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](?tabs=drs21#drs942-21)|SQLI|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](?tabs=drs21#drs943-21)|FIX|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](?tabs=drs21#drs944-21)|JAVA|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](?tabs=drs21#drs9905-21)|MS-ThreatIntel-WebShells|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](?tabs=drs21#drs9903-21)|MS-ThreatIntel-AppSec|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](?tabs=drs21#drs99031-21)|MS-ThreatIntel-SQLI|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](?tabs=drs21#drs99001-21)|MS-ThreatIntel-CVEs|Protect against CVE attacks|

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
|99001017|MS-ThreatIntel-CVEs|Attempted Apache Struts file upload exploitation [CVE-2023-50164](https://www.cve.org/CVERecord?id=CVE-2023-50164)|Enable rule to prevent against Apache Struts vulnerability|

### DRS 2.0

DRS 2.0 rules offer better protection than earlier versions of the DRS. DRS 2.0 also supports transformations beyond just URL decoding.

DRS 2.0 includes 17 rule groups, as shown in the following table. Each group contains multiple rules. You can disable individual rules and entire rule groups.

> [!NOTE]
> DRS 2.0 is only available on Azure Front Door Premium.

|Rule group|ruleGroupName|Description|
|---|---|---|
|[General](?tabs=drs20#general-20)|General|General group|
|[METHOD-ENFORCEMENT](?tabs=drs20#drs911-20)|METHOD-ENFORCEMENT|Lock-down methods (PUT, PATCH)|
|[PROTOCOL-ENFORCEMENT](?tabs=drs20#drs920-20)|PROTOCOL-ENFORCEMENT|Protect against protocol and encoding issues|
|[PROTOCOL-ATTACK](?tabs=drs20#drs921-20)|PROTOCOL-ATTACK|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](?tabs=drs20#drs930-20)|LFI|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](?tabs=drs20#drs931-20)|RFI|Protect against remote file inclusion (RFI) attacks|
|[APPLICATION-ATTACK-RCE](?tabs=drs20#drs932-20)|RCE|Protect again remote code execution attacks|
|[APPLICATION-ATTACK-PHP](?tabs=drs20#drs933-20)|PHP|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-NodeJS](?tabs=drs20#drs934-20)|NODEJS|Protect against Node JS attacks|
|[APPLICATION-ATTACK-XSS](?tabs=drs20#drs941-20)|XSS|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](?tabs=drs20#drs942-20)|SQLI|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](?tabs=drs20#drs943-20)|FIX|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](?tabs=drs20#drs944-20)|JAVA|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](?tabs=drs20#drs9905-20)|MS-ThreatIntel-WebShells|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](?tabs=drs20#drs9903-20)|MS-ThreatIntel-AppSec|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](?tabs=drs20#drs99031-20)|MS-ThreatIntel-SQLI|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](?tabs=drs20#drs99001-20)|MS-ThreatIntel-CVEs|Protect against CVE attacks|

### DRS 1.1
|Rule group|ruleGroupName|Description|
|---|---|---|
|[PROTOCOL-ATTACK](?tabs=drs11#drs921-11)|PROTOCOL-ATTACK|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](?tabs=drs11#drs930-11)|LFI|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](?tabs=drs11#drs931-11)|RFI|Protection against remote file inclusion attacks|
|[APPLICATION-ATTACK-RCE](?tabs=drs11#drs932-11)|RCE|Protection against remote command execution|
|[APPLICATION-ATTACK-PHP](?tabs=drs11#drs933-11)|PHP|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-XSS](?tabs=drs11#drs941-11)|XSS|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](?tabs=drs11#drs942-11)|SQLI|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](?tabs=drs11#drs943-11)|FIX|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](?tabs=drs11#drs944-11)|JAVA|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](?tabs=drs11#drs9905-11)|MS-ThreatIntel-WebShells|Protect against Web shell attacks|
|[MS-ThreatIntel-AppSec](?tabs=drs11#drs9903-11)|MS-ThreatIntel-AppSec|Protect against AppSec attacks|
|[MS-ThreatIntel-SQLI](?tabs=drs11#drs99031-11)|MS-ThreatIntel-SQLI|Protect against SQLI attacks|
|[MS-ThreatIntel-CVEs](?tabs=drs11#drs99001-11)|MS-ThreatIntel-CVEs|Protect against CVE attacks|

### DRS 1.0

|Rule group|ruleGroupName|Description|
|---|---|---|
|[PROTOCOL-ATTACK](?tabs=drs10#drs921-10)|PROTOCOL-ATTACK|Protect against header injection, request smuggling, and response splitting|
|[APPLICATION-ATTACK-LFI](?tabs=drs10#drs930-10)|LFI|Protect against file and path attacks|
|[APPLICATION-ATTACK-RFI](?tabs=drs10#drs931-10)|RFI|Protection against remote file inclusion attacks|
|[APPLICATION-ATTACK-RCE](?tabs=drs10#drs932-10)|RCE|Protection against remote command execution|
|[APPLICATION-ATTACK-PHP](?tabs=drs10#drs933-10)|PHP|Protect against PHP-injection attacks|
|[APPLICATION-ATTACK-XSS](?tabs=drs10#drs941-10)|XSS|Protect against cross-site scripting attacks|
|[APPLICATION-ATTACK-SQLI](?tabs=drs10#drs942-10)|SQLI|Protect against SQL-injection attacks|
|[APPLICATION-ATTACK-SESSION-FIXATION](?tabs=drs10#drs943-10)|FIX|Protect against session-fixation attacks|
|[APPLICATION-ATTACK-SESSION-JAVA](?tabs=drs10#drs944-10)|JAVA|Protect against JAVA attacks|
|[MS-ThreatIntel-WebShells](?tabs=drs10#drs9905-10)|MS-ThreatIntel-WebShells|Protect against Web shell attacks|
|[MS-ThreatIntel-CVEs](?tabs=drs10#drs99001-10)|MS-ThreatIntel-CVEs|Protect against CVE attacks|

### Bot Manager 1.0

The Bot Manager 1.0 rule set provides protection against malicious bots and detection of good bots. The rules provide granular control over bots detected by WAF by categorizing bot traffic as Good, Bad, or Unknown bots. 

|Rule group|Description|
|---|---|
|[BadBots](?tabs=bot#bot100)|Protect against bad bots|
|[GoodBots](?tabs=bot#bot200)|Identify good bots|
|[UnknownBots](?tabs=bot#bot300)|Identify unknown bots|

### Bot Manager 1.1

The Bot Manager 1.1 rule set is an enhancement to Bot Manager 1.0 rule set. It provides enhanced protection against malicious bots, and increases good bot detection.

|Rule group|Description|
|---|---|
|[BadBots](?tabs=bot11#bot11-100)|Protect against bad bots|
|[GoodBots](?tabs=bot11#bot11-200)|Identify good bots|
|[UnknownBots](?tabs=bot11#bot11-300)|Identify unknown bots|

The following rule groups and rules are available when you use Azure Web Application Firewall on Azure Front Door.

# [DRS 2.1](#tab/drs21)

## <a name="drs21"></a> 2.1 rule sets

### <a name="general-21"></a> General
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|200002|Critical - 5|1|Failed to parse request body|
|200003|Critical - 5|1|Multipart request body failed strict validation|


### <a name="drs911-21"></a> Method enforcement
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|911100|Critical - 5|1|Method isn't allowed by policy|

### <a name="drs920-21"></a> Protocol enforcement
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|920100|Notice - 2|1|Invalid HTTP Request Line|
|920120|Critical - 5|1|Attempted multipart/form-data bypass|
|920121|Critical - 5|2|Attempted multipart/form-data bypass|
|920160|Critical - 5|1|Content-Length HTTP header isn't numeric|
|920170|Critical - 5|1|GET or HEAD Request with Body Content|
|920171|Critical - 5|1|GET or HEAD Request with Transfer-Encoding|
|920180|Notice - 2|1|POST request missing Content-Length Header|
|920181|Warning - 3|1|Content-Length and Transfer-Encoding headers present 99001003|
|920190|Warning - 3|1|Range: Invalid Last Byte Value|
|920200|Warning - 3|2|Range: Too many fields (6 or more)|
|920201|Warning - 3|2|Range: Too many fields for pdf request (35 or more)|
|920210|Warning - 3|1|Multiple/Conflicting Connection Header Data Found|
|920220|Warning - 3|1|URL Encoding Abuse Attack Attempt|
|920230|Warning - 3|2|Multiple URL Encoding Detected|
|920240|Warning - 3|1|URL Encoding Abuse Attack Attempt|
|920260|Warning - 3|1|Unicode Full/Half Width Abuse Attack Attempt|
|920270|Critical - 5|1|Invalid character in request (null character)|
|920271|Critical - 5|2|Invalid character in request (nonprintable characters)|
|920280|Warning - 3|1|Request Missing a Host Header|
|920290|Warning - 3|1|Empty Host Header|
|920300|Notice - 2|2|Request Missing an Accept Header|
|920310|Notice - 2|1|Request Has an Empty Accept Header|
|920311|Notice - 2|1|Request Has an Empty Accept Header|
|920320|Notice - 2|2|Missing User Agent Header|
|920330|Notice - 2|1|Empty User Agent Header|
|920340|Notice - 2|1|Request Containing Content, but Missing Content-Type header|
|920341|Critical - 5|2|Request containing content requires Content-Type header|
|920350|Warning - 3|1|Host header is a numeric IP address|
|920420|Critical - 5|1|Request content type isn't allowed by policy|
|920430|Critical - 5|1|HTTP protocol version isn't allowed by policy|
|920440|Critical - 5|1|URL file extension is restricted by policy|
|920450|Critical - 5|1|HTTP header is restricted by policy|
|920470|Critical - 5|1|Illegal Content-Type header|
|920480|Critical - 5|1|Request content type charset isn't allowed by policy|
|920500|Critical - 5|1|Attempt to access a backup or working file|

### <a name="drs921-21"></a> Protocol attack

|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|921110|Critical - 5|1|HTTP Request Smuggling Attack|
|921120|Critical - 5|1|HTTP Response Splitting Attack|
|921130|Critical - 5|1|HTTP Response Splitting Attack|
|921140|Critical - 5|1|HTTP Header Injection Attack via headers|
|921150|Critical - 5|1|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|Critical - 5|2|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|Critical - 5|1|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|
|921190|Critical - 5|1|HTTP Splitting (CR/LF in request filename detected)|
|921200|Critical - 5|1|LDAP Injection Attack|

### <a name="drs930-21"></a> LFI: Local file inclusion
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|930100|Critical - 5|1|Path Traversal Attack (/../)|
|930110|Critical - 5|1|Path Traversal Attack (/../)|
|930120|Critical - 5|1|OS File Access Attempt|
|930130|Critical - 5|1|Restricted File Access Attempt|

### <a name="drs931-21"></a> RFI: Remote file inclusion
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|931100|Critical - 5|1|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP address|
|931110|Critical - 5|1|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Critical - 5|1|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Critical - 5|2|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-21"></a> RCE: Remote command execution
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|932100|Critical - 5|1|Remote Command Execution: Unix Command Injection|
|932105|Critical - 5|1|Remote Command Execution: Unix Command Injection|
|932110|Critical - 5|1|Remote Command Execution: Windows Command Injection|
|932115|Critical - 5|1|Remote Command Execution: Windows Command Injection|
|932120|Critical - 5|1|Remote Command Execution: Windows PowerShell Command Found|
|932130|Critical - 5|1|Remote Command Execution: Unix Shell Expression or Confluence Vulnerability (CVE-2022-26134) Found|
|932140|Critical - 5|1|Remote Command Execution: Windows FOR/IF Command Found|
|932150|Critical - 5|1|Remote Command Execution: Direct Unix Command Execution|
|932160|Critical - 5|1|Remote Command Execution: Unix Shell Code Found|
|932170|Critical - 5|1|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932171|Critical - 5|1|Remote Command Execution: Shellshock (CVE-2014-6271)|
|932180|Critical - 5|1|Restricted File Upload Attempt|

### <a name="drs933-21"></a> PHP attacks
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|933100|Critical - 5|1|PHP Injection Attack: Opening/Closing Tag Found|
|933110|Critical - 5|1|PHP Injection Attack: PHP Script File Upload Found|
|933120|Critical - 5|1|PHP Injection Attack: Configuration Directive Found|
|933130|Critical - 5|1|PHP Injection Attack: Variables Found|
|933140|Critical - 5|1|PHP Injection Attack: I/O Stream Found|
|933150|Critical - 5|1|PHP Injection Attack: High-Risk PHP Function Name Found|
|933151|Critical - 5|2|PHP Injection Attack: Medium-Risk PHP Function Name Found|
|933160|Critical - 5|1|PHP Injection Attack: High-Risk PHP Function Call Found|
|933170|Critical - 5|1|PHP Injection Attack: Serialized Object Injection|
|933180|Critical - 5|1|PHP Injection Attack: Variable Function Call Found|
|933200|Critical - 5|1|PHP Injection Attack: Wrapper scheme detected|
|933210|Critical - 5|1|PHP Injection Attack: Variable Function Call Found|

### <a name="drs934-21"></a> Node JS attacks
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|934100|Critical - 5|1|Node.js Injection Attack|

### <a name="drs941-21"></a> XSS: Cross-site scripting
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|941100|Critical - 5|1|XSS Attack Detected via libinjection|
|941101|Critical - 5|2|XSS Attack Detected via libinjection<br />Rule detects requests with a `Referer` header|
|941110|Critical - 5|1|XSS Filter - Category 1: Script Tag Vector|
|941120|Critical - 5|1|XSS Filter - Category 2: Event Handler Vector|
|941130|Critical - 5|1|XSS Filter - Category 3: Attribute Vector|
|941140|Critical - 5|1|XSS Filter - Category 4: JavaScript URI Vector|
|941150|Critical - 5|2|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|Critical - 5|1|NoScript XSS InjectionChecker: HTML Injection|
|941170|Critical - 5|1|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Critical - 5|1|Node-Validator Blocklist Keywords|
|941190|Critical - 5|1|XSS using style sheets|
|941200|Critical - 5|1|XSS using VML frames|
|941210|Critical - 5|1|XSS using obfuscated JavaScript|
|941220|Critical - 5|1|XSS using obfuscated VB Script|
|941230|Critical - 5|1|XSS using `embed` tag|
|941240|Critical - 5|1|XSS using `import` or `implementation` attribute|
|941250|Critical - 5|1|IE XSS Filters - Attack Detected|
|941260|Critical - 5|1|XSS using `meta` tag|
|941270|Critical - 5|1|XSS using `link` href|
|941280|Critical - 5|1|XSS using `base` tag|
|941290|Critical - 5|1|XSS using `applet` tag|
|941300|Critical - 5|1|XSS using `object` tag|
|941310|Critical - 5|1|US-ASCII Malformed Encoding XSS Filter - Attack Detected|
|941320|Critical - 5|2|Possible XSS Attack Detected - HTML Tag Handler|
|941330|Critical - 5|2|IE XSS Filters - Attack Detected|
|941340|Critical - 5|2|IE XSS Filters - Attack Detected|
|941350|Critical - 5|1|UTF-7 Encoding IE XSS - Attack Detected|
|941360|Critical - 5|1|JavaScript obfuscation detected|
|941370|Critical - 5|1|JavaScript global variable found|
|941380|Critical - 5|2|AngularJS client side template injection detected|

### <a name="drs942-21"></a> SQLI: SQL injection
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|942100|Critical - 5|1|SQL Injection Attack Detected via libinjection|
|942110|Warning - 3|2|SQL Injection Attack: Common Injection Testing Detected|
|942120|Critical - 5|2|SQL Injection Attack: SQL Operator Detected|
|942140|Critical - 5|1|SQL Injection Attack: Common DB Names Detected|
|942150|Critical - 5|2|SQL Injection Attack|
|942160|Critical - 5|1|Detects blind SQLI tests using sleep() or benchmark()|
|942170|Critical - 5|1|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Critical - 5|2|Detects basic SQL authentication bypass attempts 1/3|
|942190|Critical - 5|1|Detects MSSQL code execution and information gathering attempts|
|942200|Critical - 5|2|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Critical - 5|2|Detects chained SQL injection attempts 1/2|
|942220|Critical - 5|1|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Critical - 5|1|Detects conditional SQL injection attempts|
|942240|Critical - 5|1|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Critical - 5|1|Detects MATCH AGAINST, MERGE, and EXECUTE IMMEDIATE injections|
|942260|Critical - 5|2|Detects basic SQL authentication bypass attempts 2/3|
|942270|Critical - 5|1|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others|
|942280|Critical - 5|1|Detects Postgres pg_sleep injection, wait for delay attacks, and database shutdown attempts|
|942290|Critical - 5|1|Finds basic MongoDB SQL injection attempts|
|942300|Critical - 5|2|Detects MySQL comments, conditions, and ch(a)r injections|
|942310|Critical - 5|2|Detects chained SQL injection attempts 2/2|
|942320|Critical - 5|1|Detects MySQL and PostgreSQL stored procedure/function injections|
|942330|Critical - 5|2|Detects classic SQL injection probings 1/2|
|942340|Critical - 5|2|Detects basic SQL authentication bypass attempts 3/3|
|942350|Critical - 5|1|Detects MySQL UDF injection and other data/structure manipulation attempts|
|942360|Critical - 5|1|Detects concatenated basic SQL injection and SQLLFI attempts|
|942361|Critical - 5|2|Detects basic SQL injection based on keyword alter or union|
|942370|Critical - 5|2|Detects classic SQL injection probings 2/2|
|942380|Critical - 5|2|SQL Injection Attack|
|942390|Critical - 5|2|SQL Injection Attack|
|942400|Critical - 5|2|SQL Injection Attack|
|942410|Critical - 5|2|SQL Injection Attack|
|942430|Warning - 3|2|Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12)|
|942440|Critical - 5|2|SQL Comment Sequence Detected|
|942450|Critical - 5|2|SQL Hex Encoding Identified|
|942470|Critical - 5|2|SQL Injection Attack|
|942480|Critical - 5|2|SQL Injection Attack|
|942500|Critical - 5|1|MySQL in-line comment detected|
|942510|Critical - 5|2|SQLi bypass attempt by ticks or backticks detected|

### <a name="drs943-21"></a> Session fixation
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|943100|Critical - 5|1|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Critical - 5|1|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Critical - 5|1|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-21"></a> Java attacks
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|944100|Critical - 5|1|Remote Command Execution: Apache Struts, Oracle WebLogic|
|944110|Critical - 5|1|Detects potential payload execution|
|944120|Critical - 5|1|Possible payload execution and remote command execution|
|944130|Critical - 5|1|Suspicious Java classes|
|944200|Critical - 5|2|Exploitation of Java deserialization Apache Commons|
|944210|Critical - 5|2|Possible use of Java serialization|
|944240|Critical - 5|2|Remote Command Execution: Java serialization and Log4j vulnerability ([CVE-2021-44228](https://www.cve.org/CVERecord?id=CVE-2021-44228), [CVE-2021-45046](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-45046))|
|944250|Critical - 5|2|Remote Command Execution: Suspicious Java method detected|

### <a name="drs9905-21"></a> MS-ThreatIntel-WebShells
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|99005002|Critical - 5|2|Web Shell Interaction Attempt (POST)|
|99005003|Critical - 5|2|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Critical - 5|2|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005005|Critical - 5|2|Web Shell Interaction Attempt|
|99005006|Critical - 5|2|Spring4Shell Interaction Attempt|

### <a name="drs9903-21"></a> MS-ThreatIntel-AppSec
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|99030001|Critical - 5|2|Path Traversal Evasion in Headers (/.././../)|
|99030002|Critical - 5|2|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-21"></a> MS-ThreatIntel-SQLI
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|99031001|Warning - 3|2|SQL Injection Attack: Common Injection Testing Detected|
|99031002|Critical - 5|2|SQL Comment Sequence Detected|
|99031003|Critical - 5|2|SQL Injection Attack|
|99031004|Critical - 5|2|Detects basic SQL authentication bypass attempts 2/3|

### <a name="drs99001-21"></a> MS-ThreatIntel-CVEs
|Rule ID|Anomaly score severity|Paranoia Level|Description|
|---|---|--|--|
|99001001|Critical - 5|2|Attempted F5 tmui (CVE-2020-5902) REST API exploitation with known credentials|
|99001002|Critical - 5|2|Attempted Citrix NSC_USER directory traversal [CVE-2019-19781](https://www.cve.org/CVERecord?id=CVE-2019-19781)|
|99001003|Critical - 5|2|Attempted Atlassian Confluence Widget Connector exploitation [CVE-2019-3396](https://www.cve.org/CVERecord?id=CVE-2019-3396)|
|99001004|Critical - 5|2|Attempted Pulse Secure custom template exploitation [CVE-2020-8243](https://www.cve.org/CVERecord?id=CVE-2019-8243)|
|99001005|Critical - 5|2|Attempted SharePoint type converter exploitation [CVE-2020-0932](https://www.cve.org/CVERecord?id=CVE-2019-0932)|
|99001006|Critical - 5|2|Attempted Pulse Connect directory traversal [CVE-2019-11510](https://www.cve.org/CVERecord?id=CVE-2019-11510)|
|99001007|Critical - 5|2|Attempted Junos OS J-Web local file inclusion [CVE-2020-1631](https://www.cve.org/CVERecord?id=CVE-2019-1631)|
|99001008|Critical - 5|2|Attempted Fortinet path traversal [CVE-2018-13379](https://www.cve.org/CVERecord?id=CVE-2019-13379)|
|99001009|Critical - 5|2|Attempted Apache struts ognl injection [CVE-2017-5638](https://www.cve.org/CVERecord?id=CVE-2019-5638)|
|99001010|Critical - 5|2|Attempted Apache struts ognl injection [CVE-2017-12611](https://www.cve.org/CVERecord?id=CVE-2019-12611)|
|99001011|Critical - 5|2|Attempted Oracle WebLogic path traversal [CVE-2020-14882](https://www.cve.org/CVERecord?id=CVE-2019-14882)|
|99001012|Critical - 5|2|Attempted Telerik WebUI insecure deserialization exploitation [CVE-2019-18935](https://www.cve.org/CVERecord?id=CVE-2019-18935)|
|99001013|Critical - 5|2|Attempted SharePoint insecure XML deserialization [CVE-2019-0604](https://www.cve.org/CVERecord?id=CVE-2019-0604)|
|99001014|Critical - 5|2|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Critical - 5|2|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Critical - 5|2|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|
|99001017|Critical - 5|2|Attempted Apache Struts file upload exploitation [CVE-2023-50164](https://www.cve.org/CVERecord?id=CVE-2023-50164)|

> [!NOTE]
> When you review your WAF's logs, you might see rule ID 949110. The description of the rule might include *Inbound Anomaly Score Exceeded*.
>
> This rule indicates that the total anomaly score for the request exceeded the maximum allowable score. For more information, see [Anomaly scoring](#anomaly-scoring-mode).
> 
> When you tune your WAF policies, you need to investigate the other rules that were triggered by the request so that you can adjust your WAF's configuration. For more information, see [Tuning Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

# [DRS 2.0](#tab/drs20)

## <a name="drs20"></a> 2.0 rule sets

### <a name="general-20"></a> General
|Rule ID|Description|
|---|---|
|200002|Failed to parse request body|
|200003|Multipart request body failed strict validation|


### <a name="drs911-20"></a> Method enforcement
|Rule ID|Description|
|---|---|
|911100|Method isn't allowed by policy|

### <a name="drs920-20"></a> Protocol enforcement
|Rule ID|Description|
|---|---|
|920100|Invalid HTTP Request Line|
|920120|Attempted multipart/form-data bypass|
|920121|Attempted multipart/form-data bypass|
|920160|Content-Length HTTP header isn't numeric|
|920170|GET or HEAD Request with Body Content|
|920171|GET or HEAD Request with Transfer-Encoding|
|920180|POST request missing Content-Length Header|
|920190|Range: Invalid Last Byte Value|
|920200|Range: Too many fields (6 or more)|
|920201|Range: Too many fields for pdf request (35 or more)|
|920210|Multiple/Conflicting Connection Header Data Found|
|920220|URL Encoding Abuse Attack Attempt|
|920230|Multiple URL Encoding Detected|
|920240|URL Encoding Abuse Attack Attempt|
|920260|Unicode Full/Half Width Abuse Attack Attempt|
|920270|Invalid character in request (null character)|
|920271|Invalid character in request (nonprintable characters)|
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
|920420|Request content type isn't allowed by policy|
|920430|HTTP protocol version isn't allowed by policy|
|920440|URL file extension is restricted by policy|
|920450|HTTP header is restricted by policy|
|920470|Illegal Content-Type header|
|920480|Request content type charset isn't allowed by policy|

### <a name="drs921-20"></a> Protocol attack

|Rule ID|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-20"></a> LFI: Local file inclusion
|Rule ID|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-20"></a> RFI: Remote file inclusion
|Rule ID|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-20"></a> RCE: Remote command execution
|Rule ID|Description|
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
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|934100|Node.js Injection Attack|

### <a name="drs941-20"></a> XSS: Cross-site scripting
|Rule ID|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blocklist Keywords|
|941190|XSS Using style sheets|
|941200|XSS using VML frames|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889))|
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

### <a name="drs942-20"></a> SQLI: SQL injection
|Rule ID|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind SQLI tests using sleep() or benchmark()|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE, and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others|
|942280|Detects Postgres pg_sleep injection, wait for delay attacks and database shutdown attempts|
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
|942440|SQL Comment Sequence Detected|
|942450|SQL Hex Encoding Identified|
|942460|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|
|942500|MySQL in-line comment detected|
|942510|SQLi bypass attempt by ticks or backticks detected|

### <a name="drs943-20"></a> Session fixation
|Rule ID|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-20"></a> Java attacks
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs9903-20"></a> MS-ThreatIntel-AppSec
|Rule ID|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-20"></a> MS-ThreatIntel-SQLI
|Rule ID|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected|

### <a name="drs99001-20"></a> MS-ThreatIntel-CVEs
|Rule ID|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)
|99001017|Attempted Apache Struts file upload exploitation [CVE-2023-50164](https://www.cve.org/CVERecord?id=CVE-2023-50164)|

> [!NOTE]
> When you review your WAF's logs, you might see rule ID 949110. The description of the rule might include *Inbound Anomaly Score Exceeded*.
>
> This rule indicates that the total anomaly score for the request exceeded the maximum allowable score. For more information, see [Anomaly scoring](#anomaly-scoring-mode).
>
> When you tune your WAF policies, you need to investigate the other rules that were triggered by the request so that you can adjust your WAF's configuration. For more information, see [Tuning Azure Web Application Firewall for Azure Front Door](waf-front-door-tuning.md).

# [DRS 1.1](#tab/drs11)

## <a name="drs11"></a> 1.1 rule sets

### <a name="drs921-11"></a> Protocol attack
|Rule ID|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-11"></a> LFI: Local file inclusion
|Rule ID|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-11"></a> RFI: Remote file inclusion
|Rule ID|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-11"></a> RCE: Remote command execution
|Rule ID|Description|
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
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blocklist Keywords|
|941190|IE XSS Filters - Attack Detected|
|941200|IE XSS Filters - Attack Detected|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889)) found|
|941220|IE XSS Filters - Attack Detected|
|941230|IE XSS Filters - Attack Detected|
|941240|IE XSS Filters - Attack Detected|
|941250|IE XSS Filters - Attack Detected|
|941260|IE XSS Filters - Attack Detected|
|941270|IE XSS Filters - Attack Detected|
|941280|IE XSS Filters - Attack Detected|
|941290|IE XSS Filters - Attack Detected|
|941300|IE XSS Filters - Attack Detected|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941330|IE XSS Filters - Attack Detected|
|941340|IE XSS Filters - Attack Detected|
|941350|UTF-7 Encoding IE XSS - Attack Detected|

### <a name="drs942-11"></a> SQLI: SQL injection
|Rule ID|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind SQLI tests using sleep() or benchmark()|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE, and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others|
|942280|Detects Postgres pg_sleep injection, wait for delay attacks and database shutdown attempts|
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
|942440|SQL Comment Sequence Detected|
|942450|SQL Hex Encoding Identified|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|

### <a name="drs943-11"></a> Session fixation
|Rule ID|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-11"></a> Java attacks
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|99005002|Web Shell Interaction Attempt (POST)|
|99005003|Web Shell Upload Attempt (POST) - CHOPPER PHP|
|99005004|Web Shell Upload Attempt (POST) - CHOPPER ASPX|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs9903-11"></a> MS-ThreatIntel-AppSec
|Rule ID|Description|
|---|---|
|99030001|Path Traversal Evasion in Headers (/.././../)|
|99030002|Path Traversal Evasion in Request Body (/.././../)|

### <a name="drs99031-11"></a> MS-ThreatIntel-SQLI
|Rule ID|Description|
|---|---|
|99031001|SQL Injection Attack: Common Injection Testing Detected|
|99031002|SQL Comment Sequence Detected|

### <a name="drs99001-11"></a> MS-ThreatIntel-CVEs
|Rule ID|Description|
|---|---|
|99001001|Attempted F5 tmui (CVE-2020-5902) REST API Exploitation with known credentials|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|
|99001017|Attempted Apache Struts file upload exploitation [CVE-2023-50164](https://www.cve.org/CVERecord?id=CVE-2023-50164)|

# [DRS 1.0](#tab/drs10)

## <a name="drs10"></a> 1.0 rule sets

### <a name="drs921-10"></a> Protocol attack
|Rule ID|Description|
|---|---|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|

### <a name="drs930-10"></a> LFI: Local file inclusion
|Rule ID|Description|
|---|---|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|

### <a name="drs931-10"></a> RFI: Remote file inclusion
|Rule ID|Description|
|---|---|
|931100|Possible Remote File Inclusion (RFI) Attack: URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack: Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack: URL Payload Used w/Trailing Question Mark Character (?)|
|931130|Possible Remote File Inclusion (RFI) Attack: Off-Domain Reference/Link|

### <a name="drs932-10"></a> RCE: Remote command execution
|Rule ID|Description|
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
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|941100|XSS Attack Detected via libinjection|
|941101|XSS Attack Detected via libinjection.<br />This rule detects requests with a `Referer` header|
|941110|XSS Filter - Category 1: Script Tag Vector|
|941120|XSS Filter - Category 2: Event Handler Vector|
|941130|XSS Filter - Category 3: Attribute Vector|
|941140|XSS Filter - Category 4: JavaScript URI Vector|
|941150|XSS Filter - Category 5: Disallowed HTML Attributes|
|941160|NoScript XSS InjectionChecker: HTML Injection|
|941170|NoScript XSS InjectionChecker: Attribute Injection|
|941180|Node-Validator Blocklist Keywords|
|941190|XSS Using style sheets|
|941200|XSS using VML frames|
|941210|IE XSS Filters - Attack Detected or Text4Shell ([CVE-2022-42889](https://nvd.nist.gov/vuln/detail/CVE-2022-42889))|
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

### <a name="drs942-10"></a> SQLI: SQL injection
|Rule ID|Description|
|---|---|
|942100|SQL Injection Attack Detected via libinjection|
|942110|SQL Injection Attack: Common Injection Testing Detected|
|942120|SQL Injection Attack: SQL Operator Detected|
|942140|SQL Injection Attack: Common DB Names Detected|
|942150|SQL Injection Attack|
|942160|Detects blind SQLI tests using sleep() or benchmark()|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942180|Detects basic SQL authentication bypass attempts 1/3|
|942190|Detects MSSQL code execution and information gathering attempts|
|942200|Detects MySQL comment-/space-obfuscated injections and backtick termination|
|942210|Detects chained SQL injection attempts 1/2|
|942220|Looking for integer overflow attacks, these are taken from skipfish, except 3.0.00738585072007e-308 is the "magic number" crash|
|942230|Detects conditional SQL injection attempts|
|942240|Detects MySQL charset switch and MSSQL DoS attempts|
|942250|Detects MATCH AGAINST, MERGE, and EXECUTE IMMEDIATE injections|
|942260|Detects basic SQL authentication bypass attempts 2/3|
|942270|Looking for basic SQL injection. Common attack string for MySQL, Oracle, and others|
|942280|Detects Postgres pg_sleep injection, wait for delay attacks and database shutdown attempts|
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
|942440|SQL Comment Sequence Detected|
|942450|SQL Hex Encoding Identified|
|942470|SQL Injection Attack|
|942480|SQL Injection Attack|

### <a name="drs943-10"></a> Session fixation
|Rule ID|Description|
|---|---|
|943100|Possible Session Fixation Attack: Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack: SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack: SessionID Parameter Name with No Referrer|

### <a name="drs944-10"></a> Java attacks
|Rule ID|Description|
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
|Rule ID|Description|
|---|---|
|99005006|Spring4Shell Interaction Attempt|

### <a name="drs99001-10"></a> MS-ThreatIntel-CVEs
|Rule ID|Description|
|---|---|
|99001014|Attempted Spring Cloud routing-expression injection [CVE-2022-22963](https://www.cve.org/CVERecord?id=CVE-2022-22963)|
|99001015|Attempted Spring Framework unsafe class object exploitation [CVE-2022-22965](https://www.cve.org/CVERecord?id=CVE-2022-22965)|
|99001016|Attempted Spring Cloud Gateway Actuator injection [CVE-2022-22947](https://www.cve.org/CVERecord?id=CVE-2022-22947)|
|99001017|Attempted Apache Struts file upload exploitation [CVE-2023-50164](https://www.cve.org/CVERecord?id=CVE-2023-50164)|

# [Bot Manager 1.0](#tab/bot)

## <a name="bot"></a> 1.0 rule sets

### <a name="bot100"></a> Bad bots
|Rule ID|Description|
|---|---|
|Bot100100|Malicious bots detected by threat intelligence|
|Bot100200|Malicious bots that have falsified their identity|
 
 Bot100100 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

### <a name="bot200"></a> Good bots
|Rule ID|Description|
|---|---|
|Bot200100|Search engine crawlers|
|Bot200200|Unverified search engine crawlers|

### <a name="bot300"></a> Unknown bots
|Rule ID|Description|
|---|---|
|Bot300100|Unspecified identity|
|Bot300200|Tools and frameworks for web crawling and attacks|
|Bot300300|General-purpose HTTP clients and SDKs|
|Bot300400|Service agents|
|Bot300500|Site health monitoring services|
|Bot300600|Unknown bots detected by threat intelligence|
|Bot300700|Other bots|

Bot300600 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

# [Bot Manager 1.1](#tab/bot11)

## <a name="bot11"></a> 1.1 rule sets

### <a name="bot11-100"></a> Bad bots
|Rule ID|Description|
|---|---|
|Bot100100|Malicious bots detected by threat intelligence|
|Bot100200|Malicious bots that have falsified their identity|
|Bot100300|High risk bots detected by threat intelligence|
 
 Bot100100 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

### <a name="bot11-200"></a> Good bots
|Rule ID|Description|
|---|---|
|Bot200100|Search engine crawlers|
|Bot200200|Verified miscellaneous bots|
|Bot200300|Verified link checker bots|
|Bot200400|Verified social media bots|
|Bot200500|Verified content fetchers|
|Bot200600|Verified feed fetchers|
|Bot200700|Verified advertising bots|

### <a name="bot11-300"></a> Unknown bots
|Rule ID|Description|
|---|---|
|Bot300100|Unspecified identity|
|Bot300200|Tools and frameworks for web crawling and attacks|
|Bot300300|General-purpose HTTP clients and SDKs|
|Bot300400|Service agents|
|Bot300500|Site health monitoring services|
|Bot300600|Unknown bots detected by threat intelligence. This rule also includes IP addresses matched to the Tor network|
|Bot300700|Other bots|

Bot300600 scans both client IP addresses and IPs in the `X-Forwarded-For` header.

---

## Related content

- [Custom rules for Azure Web Application Firewall on Azure Front Door](waf-front-door-custom-rules.md)
- [Learn more about Azure network security](../../networking/security/index.yml)
