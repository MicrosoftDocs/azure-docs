---
title: Azure Application Gateway web application firewall CRS rule groups and rules
description: This page provides information on web application firewall CRS rule groups and rules.
documentationcenter: na
services: application-gateway
author: vhorne

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 4/16/2018
ms.author: victorh

---

# List of web application firewall CRS rule groups and rules offered

Application Gateway web application firewall (WAF) protects web applications from common vulnerabilities and exploits. This is done through rules that are defined based on the OWASP core rule sets 2.2.9 or 3.0. These rules can be disabled on a rule by rule basis. This article contains the current rules and rulesets offered.

The following tables are the Rule groups and rules that are available when using Application Gateway with web application firewall.  Each table represents the rules found in a rule group for a specific CRS version.

## <a name="owasp30"></a> OWASP_3.0


### <a name="crs911"></a> <p x-ms-format-detection="none">REQUEST-911-METHOD-ENFORCEMENT</p>

|RuleId|Description|
|---|---|
|911011|Rule 911011|
|911012|Rule 911012|
|911100|Method is not allowed by policy|
|911013|Rule 911013|
|911014|Rule 911014|
|911015|Rule 911015|
|911016|Rule 911016|
|911017|Rule 911017|
|911018|Rule 911018|


### <a name="crs913"></a> <p x-ms-format-detection="none">REQUEST-913-SCANNER-DETECTION</p>

|RuleId|Description|
|---|---|
|913011|Rule 913011|
|913012|Rule 913012|
|913100|Found User-Agent associated with security scanner|
|913110|Found request header associated with security scanner|
|913120|Found request filename/argument associated with security scanner|
|913013|Rule 913013|
|913014|Rule 913014|
|913101|Found User-Agent associated with scripting/generic HTTP client|
|913102|Found User-Agent associated with web crawler/bot|
|913015|Rule 913015|
|913016|Rule 913016|
|913017|Rule 913017|
|913018|Rule 913018|

### <a name="crs920"></a> <p x-ms-format-detection="none">REQUEST-920-PROTOCOL-ENFORCEMENT</p>

|RuleId|Description|
|---|---|
|920011|Rule 920011|
|920012|Rule 920012|
|920100|Invalid HTTP Request Line|
|920130|Failed to parse request body.|
|920140|Multipart request body failed strict validation =     PE %@{REQBODY_PROCESSOR_ERROR}     BQ %@{MULTIPART_BOUNDARY_QUOTED}     BW %@{MULTIPART_BOUNDARY_WHITESPACE}     DB %@{MULTIPART_DATA_BEFORE}     DA %@{MULTIPART_DATA_AFTER}     HF %@{MULTIPART_HEADER_FOLDING}     LF %@{MULTIPART_LF_LINE}     SM %@{MULTIPART_SEMICOLON_MISSING}     IQ %@{MULTIPART_INVALID_QUOTING}     IH %@{MULTIPART_INVALID_HEADER_FOLDING}     FLE %@{MULTIPART_FILE_LIMIT_EXCEEDED}|
|920160|Content-Length HTTP header is not numeric.|
|920170|GET or HEAD Request with Body Content.|
|920180|POST request missing Content-Length Header.|
|920190|Range = Invalid Last Byte Value.|
|920210|Multiple/Conflicting Connection Header Data Found.|
|920220|URL Encoding Abuse Attack Attempt|
|920240|URL Encoding Abuse Attack Attempt|
|920250|UTF8 Encoding Abuse Attack Attempt|
|920260|Unicode Full/Half Width Abuse Attack Attempt|
|920270|Invalid character in request (null character)|
|920280|Request Missing a Host Header|
|920290|Empty Host Header|
|920310|Request Has an Empty Accept Header|
|920311|Request Has an Empty Accept Header|
|920330|Empty User Agent Header|
|920340|Request Containing Content but Missing Content-Type header|
|920350|Host header is a numeric IP address|
|920380|Too many arguments in request|
|920360|Argument name too long|
|920370|Argument value too long|
|920390|Total arguments size exceeded|
|920400|Uploaded file size too large|
|920410|Total uploaded files size too large|
|920420|Request content type is not allowed by policy|
|920430|HTTP protocol version is not allowed by policy|
|920440|URL file extension is restricted by policy|
|920450|HTTP header is restricted by policy (%@{MATCHED_VAR})|
|920013|Rule 920013|
|920014|Rule 920014|
|920200|Range = Too many fields (6 or more)|
|920201|Range = Too many fields for pdf request (35 or more)|
|920230|Multiple URL Encoding Detected|
|920300|Request Missing an Accept Header|
|920271|Invalid character in request (non printable characters)|
|920320|Missing User Agent Header|
|920015|Rule 920015|
|920016|Rule 920016|
|920272|Invalid character in request (outside of printable chars below ascii 127)|
|920017|Rule 920017|
|920018|Rule 920018|
|920202|Range = Too many fields for pdf request (6 or more)|
|920273|Invalid character in request (outside of very strict set)|
|920274|Invalid character in request headers (outside of very strict set)|
|920460|Rule 920460|

### <a name="crs921"></a> <p x-ms-format-detection="none">REQUEST-921-PROTOCOL-ATTACK</p>

|RuleId|Description|
|---|---|
|921011|Rule 921011|
|921012|Rule 921012|
|921100|HTTP Request Smuggling Attack.|
|921110|HTTP Request Smuggling Attack|
|921120|HTTP Response Splitting Attack|
|921130|HTTP Response Splitting Attack|
|921140|HTTP Header Injection Attack via headers|
|921150|HTTP Header Injection Attack via payload (CR/LF detected)|
|921160|HTTP Header Injection Attack via payload (CR/LF and header-name detected)|
|921013|Rule 921013|
|921014|Rule 921014|
|921151|HTTP Header Injection Attack via payload (CR/LF detected)|
|921015|Rule 921015|
|921016|Rule 921016|
|921170|Rule 921170|
|921180|HTTP Parameter Pollution (%@{TX.1})|
|921017|Rule 921017|
|921018|Rule 921018|

### <a name="crs930"></a> <p x-ms-format-detection="none">REQUEST-930-APPLICATION-ATTACK-LFI</p>

|RuleId|Description|
|---|---|
|930011|Rule 930011|
|930012|Rule 930012|
|930100|Path Traversal Attack (/../)|
|930110|Path Traversal Attack (/../)|
|930120|OS File Access Attempt|
|930130|Restricted File Access Attempt|
|930013|Rule 930013|
|930014|Rule 930014|
|930015|Rule 930015|
|930016|Rule 930016|
|930017|Rule 930017|
|930018|Rule 930018|

### <a name="crs931"></a> <p x-ms-format-detection="none">REQUEST-931-APPLICATION-ATTACK-RFI</p>

|RuleId|Description|
|---|---|
|931011|Rule 931011|
|931012|Rule 931012|
|931100|Possible Remote File Inclusion (RFI) Attack = URL Parameter using IP Address|
|931110|Possible Remote File Inclusion (RFI) Attack = Common RFI Vulnerable Parameter Name used w/URL Payload|
|931120|Possible Remote File Inclusion (RFI) Attack = URL Payload Used w/Trailing Question Mark Character (?)|
|931013|Rule 931013|
|931014|Rule 931014|
|931130|Possible Remote File Inclusion (RFI) Attack = Off-Domain Reference/Link|
|931015|Rule 931015|
|931016|Rule 931016|
|931017|Rule 931017|
|931018|Rule 931018|

### <a name="crs932"></a> <p x-ms-format-detection="none">REQUEST-932-APPLICATION-ATTACK-RCE</p>

|RuleId|Description|
|---|---|
|932011|Rule 932011|
|932012|Rule 932012|
|932120|Remote Command Execution = Windows PowerShell Command Found|
|932130|Remote Command Execution = Unix Shell Expression Found|
|932140|Remote Command Execution = Windows FOR/IF Command Found|
|932160|Remote Command Execution = Unix Shell Code Found|
|932170|Remote Command Execution = Shellshock (CVE-2014-6271)|
|932171|Remote Command Execution = Shellshock (CVE-2014-6271)|
|932013|Rule 932013|
|932014|Rule 932014|
|932015|Rule 932015|
|932016|Rule 932016|
|932017|Rule 932017|
|932018|Rule 932018|

### <a name="crs933"></a> <p x-ms-format-detection="none">REQUEST-933-APPLICATION-ATTACK-PHP</p>

|RuleId|Description|
|---|---|
|933011|Rule 933011|
|933012|Rule 933012|
|933100|PHP Injection Attack = Opening/Closing Tag Found|
|933110|PHP Injection Attack = PHP Script File Upload Found|
|933120|PHP Injection Attack = Configuration Directive Found|
|933130|PHP Injection Attack = Variables Found|
|933150|PHP Injection Attack = High-Risk PHP Function Name Found|
|933160|PHP Injection Attack = High-Risk PHP Function Call Found|
|933180|PHP Injection Attack = Variable Function Call Found|
|933013|Rule 933013|
|933014|Rule 933014|
|933151|PHP Injection Attack = Medium-Risk PHP Function Name Found|
|933015|Rule 933015|
|933016|Rule 933016|
|933131|PHP Injection Attack = Variables Found|
|933161|PHP Injection Attack = Low-Value PHP Function Call Found|
|933111|PHP Injection Attack = PHP Script File Upload Found|
|933017|Rule 933017|
|933018|Rule 933018|

### <a name="crs941"></a> <p x-ms-format-detection="none">REQUEST-941-APPLICATION-ATTACK-XSS</p>

|RuleId|Description|
|---|---|
|941011|Rule 941011|
|941012|Rule 941012|
|941100|XSS Attack Detected via libinjection|
|941110|XSS Filter - Category 1 = Script Tag Vector|
|941130|XSS Filter - Category 3 = Attribute Vector|
|941140|XSS Filter - Category 4 = Javascript URI Vector|
|941150|XSS Filter - Category 5 = Disallowed HTML Attributes|
|941180|Node-Validator Blacklist Keywords|
|941190|IE XSS Filters - Attack Detected.|
|941200|IE XSS Filters - Attack Detected.|
|941210|IE XSS Filters - Attack Detected.|
|941220|IE XSS Filters - Attack Detected.|
|941230|IE XSS Filters - Attack Detected.|
|941240|IE XSS Filters - Attack Detected.|
|941260|IE XSS Filters - Attack Detected.|
|941270|IE XSS Filters - Attack Detected.|
|941280|IE XSS Filters - Attack Detected.|
|941290|IE XSS Filters - Attack Detected.|
|941300|IE XSS Filters - Attack Detected.|
|941310|US-ASCII Malformed Encoding XSS Filter - Attack Detected.|
|941350|UTF-7 Encoding IE XSS - Attack Detected.|
|941013|Rule 941013|
|941014|Rule 941014|
|941320|Possible XSS Attack Detected - HTML Tag Handler|
|941015|Rule 941015|
|941016|Rule 941016|
|941017|Rule 941017|
|941018|Rule 941018|

### <a name="crs942"></a> <p x-ms-format-detection="none">REQUEST-942-APPLICATION-ATTACK-SQLI</p>

|RuleId|Description|
|---|---|
|942011|Rule 942011|
|942012|Rule 942012|
|942100|SQL Injection Attack Detected via libinjection|
|942140|SQL Injection Attack = Common DB Names Detected|
|942160|Detects blind sqli tests using sleep() or benchmark().|
|942170|Detects SQL benchmark and sleep injection attempts including conditional queries|
|942230|Detects conditional SQL injection attempts|
|942270|Looking for basic sql injection. Common attack string for mysql oracle and others.|
|942290|Finds basic MongoDB SQL injection attempts|
|942320|Detects MySQL and PostgreSQL stored procedure/function injections|
|942350|Detects MySQL UDF injection and other data/structure manipulation attempts|
|942013|Rule 942013|
|942014|Rule 942014|
|942150|SQL Injection Attack|
|942410|SQL Injection Attack|
|942440|SQL Comment Sequence Detected.|
|942450|SQL Hex Encoding Identified|
|942015|Rule 942015|
|942016|Rule 942016|
|942251|Detects HAVING injections|
|942460|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters|
|942017|Rule 942017|
|942018|Rule 942018|

### <a name="crs943"></a> <p x-ms-format-detection="none">REQUEST-943-APPLICATION-ATTACK-SESSION-FIXATION</p>

|RuleId|Description|
|---|---|
|943011|Rule 943011|
|943012|Rule 943012|
|943100|Possible Session Fixation Attack = Setting Cookie Values in HTML|
|943110|Possible Session Fixation Attack = SessionID Parameter Name with Off-Domain Referrer|
|943120|Possible Session Fixation Attack = SessionID Parameter Name with No Referrer|
|943013|Rule 943013|
|943014|Rule 943014|
|943015|Rule 943015|
|943016|Rule 943016|
|943017|Rule 943017|
|943018|Rule 943018|

## <a name="owasp229"></a> OWASP_2.2.9

### <a name="crs20"></a> crs_20_protocol_violations

|RuleId|Description|
|---|---|
|960911|Invalid HTTP Request Line|
|981227|Apache Error = Invalid URI in Request.|
|960912|Failed to parse request body.|
|960914|Multipart request body failed strict validation =     PE %@{REQBODY_PROCESSOR_ERROR}     BQ %@{MULTIPART_BOUNDARY_QUOTED}     BW %@{MULTIPART_BOUNDARY_WHITESPACE}     DB %@{MULTIPART_DATA_BEFORE}     DA %@{MULTIPART_DATA_AFTER}     HF %@{MULTIPART_HEADER_FOLDING}     LF %@{MULTIPART_LF_LINE}     SM %@{MULTIPART_SEMICOLON_MISSING}     IQ %@{MULTIPART_INVALID_QUOTING}     IH %@{MULTIPART_INVALID_HEADER_FOLDING}     FLE %@{MULTIPART_FILE_LIMIT_EXCEEDED}|
|960915|Multipart parser detected a possible unmatched boundary.|
|960016|Content-Length HTTP header is not numeric.|
|960011|GET or HEAD Request with Body Content.|
|960012|POST request missing Content-Length Header.|
|960902|Invalid Use of Identity Encoding.|
|960022|Expect Header Not Allowed for HTTP 1.0.|
|960020|Pragma Header requires Cache-Control Header for HTTP/1.1 requests.|
|958291|Range = field exists and begins with 0.|
|958230|Range = Invalid Last Byte Value.|
|958295|Multiple/Conflicting Connection Header Data Found.|
|950107|URL Encoding Abuse Attack Attempt|
|950109|Multiple URL Encoding Detected|
|950108|URL Encoding Abuse Attack Attempt|
|950801|UTF8 Encoding Abuse Attack Attempt|
|950116|Unicode Full/Half Width Abuse Attack Attempt|
|960901|Invalid character in request|
|960018|Invalid character in request|

### <a name="crs21"></a> crs_21_protocol_anomalies

|RuleId|Description|
|---|---|
|960008|Request Missing a Host Header|
|960007|Empty Host Header|
|960015|Request Missing an Accept Header|
|960021|Request Has an Empty Accept Header|
|960009|Request Missing a User Agent Header|
|960006|Empty User Agent Header|
|960904|Request Containing Content but Missing Content-Type header|
|960017|Host header is a numeric IP address|

### <a name="crs23"></a> crs_23_request_limits

|RuleId|Description|
|---|---|
|960209|Argument name too long|
|960208|Argument value too long|
|960335|Too many arguments in request|
|960341|Total arguments size exceeded|
|960342|Uploaded file size too large|
|960343|Total uploaded files size too large|

### <a name="crs30"></a> crs_30_http_policy

|RuleId|Description|
|---|---|
|960032|Method is not allowed by policy|
|960010|Request content type is not allowed by policy|
|960034|HTTP protocol version is not allowed by policy|
|960035|URL file extension is restricted by policy|
|960038|HTTP header is restricted by policy|

### <a name="crs35"></a> crs_35_bad_robots

|RuleId|Description|
|---|---|
|990002|Request Indicates a Security Scanner Scanned the Site|
|990901|Request Indicates a Security Scanner Scanned the Site|
|990902|Request Indicates a Security Scanner Scanned the Site|
|990012|Rogue web site crawler|

### <a name="crs40"></a> crs_40_generic_attacks

|RuleId|Description|
|---|---|
|960024|Meta-Character Anomaly Detection Alert - Repetitive Non-Word Characters|
|950008|Injection of Undocumented ColdFusion Tags|
|950010|LDAP Injection Attack|
|950011|SSI injection Attack|
|950018|Universal PDF XSS URL Detected.|
|950019|Email Injection Attack|
|950012|HTTP Request Smuggling Attack.|
|950910|HTTP Response Splitting Attack|
|950911|HTTP Response Splitting Attack|
|950117|Remote File Inclusion Attack|
|950118|Remote File Inclusion Attack|
|950119|Remote File Inclusion Attack|
|950120|Possible Remote File Inclusion (RFI) Attack = Off-Domain Reference/Link|
|981133|Rule 981133|
|981134|Rule 981134|
|950009|Session Fixation Attack|
|950003|Session Fixation|
|950000|Session Fixation|
|950005|Remote File Access Attempt|
|950002|System Command Access|
|950006|System Command Injection|
|959151|PHP Injection Attack|
|958976|PHP Injection Attack|
|958977|PHP Injection Attack|

### <a name="crs41sql"></a> crs_41_sql_injection_attacks

|RuleId|Description|
|---|---|
|981231|SQL Comment Sequence Detected.|
|981260|SQL Hex Encoding Identified|
|981320|SQL Injection Attack = Common DB Names Detected|
|981300|Rule 981300|
|981301|Rule 981301|
|981302|Rule 981302|
|981303|Rule 981303|
|981304|Rule 981304|
|981305|Rule 981305|
|981306|Rule 981306|
|981307|Rule 981307|
|981308|Rule 981308|
|981309|Rule 981309|
|981310|Rule 981310|
|981311|Rule 981311|
|981312|Rule 981312|
|981313|Rule 981313|
|981314|Rule 981314|
|981315|Rule 981315|
|981316|Rule 981316|
|981317|SQL SELECT Statement Anomaly Detection Alert|
|950007|Blind SQL Injection Attack|
|950001|SQL Injection Attack|
|950908|SQL Injection Attack.|
|959073|SQL Injection Attack|
|981272|Detects blind sqli tests using sleep() or benchmark().|
|981250|Detects SQL benchmark and sleep injection attempts including conditional queries|
|981241|Detects conditional SQL injection attempts|
|981276|Looking for basic sql injection. Common attack string for mysql oracle and others.|
|981270|Finds basic MongoDB SQL injection attempts|
|981253|Detects MySQL and PostgreSQL stored procedure/function injections|
|981251|Detects MySQL UDF injection and other data/structure manipulation attempts|

### <a name="crs41xss"></a> crs_41_xss_attacks

|RuleId|Description|
|---|---|
|973336|XSS Filter - Category 1 = Script Tag Vector|
|973338|XSS Filter - Category 3 = Javascript URI Vector|
|981136|Rule 981136|
|981018|Rule 981018|
|958016|Cross-site Scripting (XSS) Attack|
|958414|Cross-site Scripting (XSS) Attack|
|958032|Cross-site Scripting (XSS) Attack|
|958026|Cross-site Scripting (XSS) Attack|
|958027|Cross-site Scripting (XSS) Attack|
|958054|Cross-site Scripting (XSS) Attack|
|958418|Cross-site Scripting (XSS) Attack|
|958034|Cross-site Scripting (XSS) Attack|
|958019|Cross-site Scripting (XSS) Attack|
|958013|Cross-site Scripting (XSS) Attack|
|958408|Cross-site Scripting (XSS) Attack|
|958012|Cross-site Scripting (XSS) Attack|
|958423|Cross-site Scripting (XSS) Attack|
|958002|Cross-site Scripting (XSS) Attack|
|958017|Cross-site Scripting (XSS) Attack|
|958007|Cross-site Scripting (XSS) Attack|
|958047|Cross-site Scripting (XSS) Attack|
|958410|Cross-site Scripting (XSS) Attack|
|958415|Cross-site Scripting (XSS) Attack|
|958022|Cross-site Scripting (XSS) Attack|
|958405|Cross-site Scripting (XSS) Attack|
|958419|Cross-site Scripting (XSS) Attack|
|958028|Cross-site Scripting (XSS) Attack|
|958057|Cross-site Scripting (XSS) Attack|
|958031|Cross-site Scripting (XSS) Attack|
|958006|Cross-site Scripting (XSS) Attack|
|958033|Cross-site Scripting (XSS) Attack|
|958038|Cross-site Scripting (XSS) Attack|
|958409|Cross-site Scripting (XSS) Attack|
|958001|Cross-site Scripting (XSS) Attack|
|958005|Cross-site Scripting (XSS) Attack|
|958404|Cross-site Scripting (XSS) Attack|
|958023|Cross-site Scripting (XSS) Attack|
|958010|Cross-site Scripting (XSS) Attack|
|958411|Cross-site Scripting (XSS) Attack|
|958422|Cross-site Scripting (XSS) Attack|
|958036|Cross-site Scripting (XSS) Attack|
|958000|Cross-site Scripting (XSS) Attack|
|958018|Cross-site Scripting (XSS) Attack|
|958406|Cross-site Scripting (XSS) Attack|
|958040|Cross-site Scripting (XSS) Attack|
|958052|Cross-site Scripting (XSS) Attack|
|958037|Cross-site Scripting (XSS) Attack|
|958049|Cross-site Scripting (XSS) Attack|
|958030|Cross-site Scripting (XSS) Attack|
|958041|Cross-site Scripting (XSS) Attack|
|958416|Cross-site Scripting (XSS) Attack|
|958024|Cross-site Scripting (XSS) Attack|
|958059|Cross-site Scripting (XSS) Attack|
|958417|Cross-site Scripting (XSS) Attack|
|958020|Cross-site Scripting (XSS) Attack|
|958045|Cross-site Scripting (XSS) Attack|
|958004|Cross-site Scripting (XSS) Attack|
|958421|Cross-site Scripting (XSS) Attack|
|958009|Cross-site Scripting (XSS) Attack|
|958025|Cross-site Scripting (XSS) Attack|
|958413|Cross-site Scripting (XSS) Attack|
|958051|Cross-site Scripting (XSS) Attack|
|958420|Cross-site Scripting (XSS) Attack|
|958407|Cross-site Scripting (XSS) Attack|
|958056|Cross-site Scripting (XSS) Attack|
|958011|Cross-site Scripting (XSS) Attack|
|958412|Cross-site Scripting (XSS) Attack|
|958008|Cross-site Scripting (XSS) Attack|
|958046|Cross-site Scripting (XSS) Attack|
|958039|Cross-site Scripting (XSS) Attack|
|958003|Cross-site Scripting (XSS) Attack|
|973300|Possible XSS Attack Detected - HTML Tag Handler|
|973301|XSS Attack Detected|
|973302|XSS Attack Detected|
|973303|XSS Attack Detected|
|973304|XSS Attack Detected|
|973305|XSS Attack Detected|
|973306|XSS Attack Detected|
|973307|XSS Attack Detected|
|973308|XSS Attack Detected|
|973309|XSS Attack Detected|
|973311|XSS Attack Detected|
|973313|XSS Attack Detected|
|973314|XSS Attack Detected|
|973331|IE XSS Filters - Attack Detected.|
|973315|IE XSS Filters - Attack Detected.|
|973330|IE XSS Filters - Attack Detected.|
|973327|IE XSS Filters - Attack Detected.|
|973326|IE XSS Filters - Attack Detected.|
|973346|IE XSS Filters - Attack Detected.|
|973345|IE XSS Filters - Attack Detected.|
|973324|IE XSS Filters - Attack Detected.|
|973323|IE XSS Filters - Attack Detected.|
|973348|IE XSS Filters - Attack Detected.|
|973321|IE XSS Filters - Attack Detected.|
|973320|IE XSS Filters - Attack Detected.|
|973318|IE XSS Filters - Attack Detected.|
|973317|IE XSS Filters - Attack Detected.|
|973329|IE XSS Filters - Attack Detected.|
|973328|IE XSS Filters - Attack Detected.|

### <a name="crs42"></a> crs_42_tight_security

|RuleId|Description|
|---|---|
|950103|Path Traversal Attack|

### <a name="crs45"></a> crs_45_trojans

|RuleId|Description|
|---|---|
|950110|Backdoor access|
|950921|Backdoor access|
|950922|Backdoor access|

## Next steps

Learn how to disable WAF rules by visiting: [Customize WAF rules](application-gateway-customize-waf-rules-portal.md)

[1]: ./media/application-gateway-integration-security-center/figure1.png
