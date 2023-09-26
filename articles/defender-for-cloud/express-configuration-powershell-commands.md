---
title: Express configuration PowerShell commands reference
description: In this article, you can review the Express configuration PowerShell commands reference and copy example scripts to use in your environments.
ms.topic: sample
author: dcurwin
ms.author: dacurwin
ms.date: 06/04/2023
---

# Express configuration PowerShell commands reference

This article lists the PowerShell commands that can be used with SQL vulnerability assessment express configuration.

Make a local copy of the script located on [Express configuration PowerShell wrapper module](express-configuration-sql-commands.md), and save the file with the following file name `SqlVulnerabilityAssessmentCommands.psm1`, which can be referenced with the following commands:


- [Set SQL vulnerability assessment baseline](#set-sql-vulnerability-assessment-baseline)
- [Get SQL vulnerability assessment baseline](#get-sql-vulnerability-assessment-baseline)
- [Set SQL vulnerability assessment baseline rule](#set-sql-vulnerability-assessment-baseline-rule)
- [Remove SQL vulnerability assessment baseline rule](#remove-sql-vulnerability-assessment-baseline-rule)
- [Get SQL vulnerability assessment scan results](#get-sql-vulnerability-assessment-scan-results)
- [Get SQL vulnerability assessment scan](#get-sql-vulnerability-assessment-scan)
- [Invoke SQL vulnerability assessment scan](#invoke-sql-vulnerability-assessment-scan)
- [Get SQL vulnerability assessment server setting](#get-sql-vulnerability-assessment-server-setting)
- [Set SQL vulnerability assessment server setting](#set-sql-vulnerability-assessment-server-setting)
- [Remove SQL vulnerability assessment server setting](#remove-sql-vulnerability-assessment-server-setting)

### Set SQL vulnerability assessment baseline

**Example 1**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Set-SqlVulnerabilityAssessmentBaseline -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -Body '{  "properties": {    "latestScan": true,    "results": {}  }}'

Results:

Headers    : {[Pragma, System.String[]], [x-ms-request-id, System.String[]], [x-ms-ratelimit-remaining-subscription-writes, System.String[]], [x-ms-correlation-request-id, System.String[]]...}
Version    : 1.1
StatusCode : 200
Method     : PUT
Content    : {"properties":{"results":{"VA1143":[["True"]],"VA1219":[["False"]]}},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/serv
             ers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default","name":"Default","type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"}
```

**Example 2**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Set-SqlVulnerabilityAssessmentBaseline -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -Body '{
  "properties": {
    "latestScan": false,
    "results": {
      "VA2062": [
        [
          "AllowAll",
          "0.0.0.0",
          "255.255.255.255"
        ]
      ]
    }
  }
}'

Results:

Headers    : {[Pragma, System.String[]], [x-ms-request-id, System.String[]], [x-ms-ratelimit-remaining-subscription-writes, System.String[]], [x-ms-correlation-request-id, System.String[]]...}
Version    : 1.1
StatusCode : 200
Method     : PUT
Content    : {"properties":{"results":{"VA2062":[["AllowAll","0.0.0.0","255.255.255.255"]]}},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microso
             ft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default","name":"Default","type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baseline
             s"}
```

### Get SQL vulnerability assessment baseline

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentBaseline -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db

Results:

Headers    : {[Pragma, System.String[]], [x-ms-request-id, System.String[]], [x-ms-ratelimit-remaining-subscription-reads, System.String[]], [x-ms-correlation-request-id, System.String[]]...}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"properties":{"results":{"VA1143":[["True"]],"VA1219":[["False"]]}},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/serv
             ers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default","name":"Default","type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"}
```

### Set SQL vulnerability assessment baseline rule

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Set-SqlVulnerabilityAssessmentBaselineRule -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -RuleId VA2062 -Body '{
  "properties": {
     "latestScan": false,
     "results": [
         [
           "AllowAll",
           "0.0.0.0",
           "255.255.255.255"
         ]
     ]
   }
 }'

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : PUT
Content    : {"properties":{"results":[["AllowAll","0.0.0.0","255.255.255.255"]]},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/dat
             abases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2062","name":"VA2062","type":"Mic
             rosoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"}
```

### Get SQL vulnerability assessment baseline rule

**Example 1**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentBaselineRule -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -RuleId VA2062

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"properties":{"results":[["AllowAll","0.0.0.0","255.255.255.255"]]},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/dat
             abases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2062","name":"VA2062","type":"Mic
             rosoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"}
```

**Example 2**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentBaselineRule -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"value":[{"properties":{"results":[["True"]]},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/r
             esourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerab
             ilityAssessments/Default/baselines/default/rules/VA1143","name":"VA1143","type":"Microsoft.Sql/servers/dat
             abases/sqlVulnerabilityAssessments/baselines"},{"properties":{"results":[["False"]]},"id":"/subscriptions/
             00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/m
             igrationsql1/databases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA1219","name":"VA1
             219","type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"},{"properties":{"resul
             ts":[["AllowAll","0.0.0.0","255.255.255.255"]]},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/
             resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnera
             bilityAssessments/Default/baselines/default/rules/VA2062","name":"VA2062","type":"Microsoft.Sql/servers/da
             tabases/sqlVulnerabilityAssessments/baselines"}]}
```

### Remove SQL vulnerability assessment baseline rule

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Remove-SqlVulnerabilityAssessmentBaselineRule -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -RuleId VA2062

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : DELETE
Content    :
```

### Get SQL vulnerability assessment scan results

**Example 1**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentScanResults -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -ScanId latest -RuleId VA2062

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"properties":{"ruleId":"VA2062","status":"NonFinding","errorMessage":null,"isTrimmed":false,"queryResults
             ":[],"remediation":{"description":"Remove database firewall rules that grant excessive access","scripts":[
             ],"automated":false,"portalLink":""},"baselineAdjustedResult":null,"ruleMetadata":{"ruleId":"VA2062","seve
             rity":"High","category":"SurfaceAreaReduction","ruleType":"NegativeList","title":"Database-level firewall
             rules should not grant excessive access","description":"The Azure SQL Database-level firewall helps protec
             t your data by preventing all access to your database until you specify which IP addresses have permission
             . Database-level firewall rules grant access to the specific database based on the originating IP address
             of each request.\n\nDatabase-level firewall rules for master and user databases can only be created and ma
             naged through Transact-SQL (unlike server-level firewall rules which can also be created and managed using
              the Azure portal or PowerShell). For more details please see: https://docs.microsoft.com/en-us/azure/sql-
             database/sql-database-firewall-configure\n\nThis check verifies that each database-level firewall rule doe
             s not grant access to more than 255 IP addresses.","rationale":"Often, administrators add rules that grant
              excessive access as part of a troubleshooting process - to eliminate the firewall as the source of a prob
             lem, they simply create a rule that allows all traffic to pass to the affected database.\n\nGranting exces
             sive access using database firewall rules is a clear security concern, as it violates the principle of lea
             st privilege by allowing unnecessary access to your database. In fact, it's the equivalent of placing the
             database outside of the firewall.","queryCheck":{"query":"SELECT name AS [Firewall Rule Name]\n    ,start_
             ip_address AS [Start Address]\n    ,end_ip_address AS [End Address]\nFROM sys.database_firewall_rules\nWHE
             RE ( \n        (CONVERT(bigint, parsename(end_ip_address, 1)) +\n         CONVERT(bigint, parsename(end_ip
             _address, 2)) * 256 + \n         CONVERT(bigint, parsename(end_ip_address, 3)) * 65536 + \n         CONVER
             T(bigint, parsename(end_ip_address, 4)) * 16777216 ) \n        - \n        (CONVERT(bigint, parsename(star
             t_ip_address, 1)) +\n         CONVERT(bigint, parsename(start_ip_address, 2)) * 256 + \n         CONVERT(b
             igint, parsename(start_ip_address, 3)) * 65536 + \n         CONVERT(bigint, parsename(start_ip_address, 4)
             ) * 16777216 )\n      ) > 255","expectedResult":[],"columnNames":["Firewall Rule Name","Start Address","En
             d Address"]},"benchmarkReferences":[]}},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resource
             Groups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAs
             sessments/Default/scans/VA2062/scanResults/VA2062","name":"VA2062","type":"Microsoft.Sql/servers/databases
             /sqlVulnerabilityAssessments/scans/scanResults"}
```

**Example 2**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentScanResults -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -ScanId latest

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"value":[
            {"properties":{"ruleId":"VA1219","status":"No
             nFinding","errorMessage":null,"isTrimmed":false,"queryResults":[["False"]],"remediation":{"description":"E
             nable TDE on the affected databases","scripts":[],"automated":false,"portalLink":"EnableTDE"},"baselineAdj
             ustedResult":{"baseline":{"expectedResults":[["False"]],"updatedTime":"2023-05-15T08:52:39.3476874+00:00"}
             ,"status":"NonFinding","resultsNotInBaseline":[],"resultsOnlyInBaseline":[]},"ruleMetadata":{"ruleId":"VA1
             219","severity":"Medium","category":"DataProtection","ruleType":"Binary","title":"Transparent data encrypt
             ion should be enabled","description":"Transparent data encryption (TDE) helps to protect the database file
             s against information disclosure by performing real-time encryption and decryption of the database, associ
             ated backups, and transaction log files 'at rest', without requiring changes to the application. This rule
              checks that TDE is enabled on the database.","rationale":"Transparent Data Encryption (TDE) protects data
              'at rest', meaning the data and log files are encrypted when stored on disk.","queryCheck":{"query":"SELE
             CT CASE\n        WHEN EXISTS (\n                SELECT *\n                FROM sys.databases\n
                 WHERE db_name(database_id) = db_name()\n                    AND is_encrypted = 0\n                )\n
                        THEN 1\n        ELSE 0\n        END AS [Violation]","expectedResult":[["0"]],"columnNames":["Vi
             olation"]},"benchmarkReferences":[{"benchmark":"FedRAMP","reference":null}]}},"id":"/subscriptions/f000000
			 00-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/
			 vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/scans/VA1219/scanResults/VA1219","name":"VA1219","
             type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/scanResults"},{"prope
             rties":{"ruleId":"VA1223","status":"NonFinding","errorMessage":null,"isTrimmed":false,"queryResults":[],"r
             emediation":{"description":"Create new certificates, re-encrypt the data/sign-data using the new key, and
             drop the affected keys.","scripts":[],"automated":false,"portalLink":""},"baselineAdjustedResult":null,"ru
             leMetadata":{"ruleId":"VA1223","severity":"High","category":"DataProtection","ruleType":"NegativeList","ti
             tle":"Certificate keys should use at least 2048 bits","description":"Certificate keys are used in RSA and
             other encryption algorithms to protect data. These keys need to be of enough length to secure the user's d
             ata. This rule checks that the key's length is at least 2048 bits for all certificates.","rationale":"Key
             length defines the upper-bound on the encryption algorithm's security. Using short keys in encryption algo
             rithms may lead to weaknesses in data-at-rest protection.","queryCheck":{"query":"SELECT name AS [Certific
             ate Name], thumbprint AS [Thumbprint]\nFROM sys.certificates\nWHERE key_length < 2048","expectedResult":[]
             ,"columnNames":["Certificate Name","Thumbprint"]},"benchmarkReferences":[{"benchmark":"FedRAMP","reference
             ":null}]}},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/p
             roviders/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/scans/VA122
             3/scanResults/VA1223","name":"VA1223","type":"Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/
             scans/scanResults"}]}
```

### Get SQL vulnerability assessment scan

**Example 1**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentScans -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db -ScanId latest

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"properties":{"scanId":"f64d81a1-9d7b-4516-a623-a1bfc845ed7e","triggerType":"OnDemand","state":"Passed","
             startTime":"2023-04-17T12:52:41.4142209Z","endTime":"2023-04-17T12:52:41.5235755Z","server":"vulnerabilityaseessmenttest
             ","database":"db","sqlVersion":"16.0.5100","highSeverityFailedRulesCount":0,"mediumSeverityFailedRulesCou
             nt":0,"lowSeverityFailedRulesCount":0,"totalPassedRulesCount":24,"totalFailedRulesCount":0,"totalRulesCoun
             t":24,"isBaselineApplied":true},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/m
             igrationscripttests/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/vulnerabilityAssessments/D
             efault/scans/f64d81a1-9d7b-4516-a623-a1bfc845ed7e","name":"f64d81a1-9d7b-4516-a623-a1bfc845ed7e","type":"M
             icrosoft.Sql/servers/databases/vulnerabilityAssessments/scans"}
```

**Example 2**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentScans -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"value":[{"properties":{"scanId":"f64d81a1-9d7b-4516-a623-a1bfc845ed7e","triggerType":"OnDemand","state":
             "Passed","startTime":"2023-04-17T12:52:41.4142209Z","endTime":"2023-04-17T12:52:41.5235755Z","server":
			 "vulnerabilityaseessmenttest","database":"db","sqlVersion":"16.0.5100","highSeverityFailedRulesCount":0,"mediumSeverityFail
             edRulesCount":0,"lowSeverityFailedRulesCount":0,"totalPassedRulesCount":24,"totalFailedRulesCount":0,"tota
             lRulesCount":24,"isBaselineApplied":true},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resour
             ceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/vulnerabilityAss
             essments/Default/scans/f64d81a1-9d7b-4516-a623-a1bfc845ed7e","name":"f64d81a1-9d7b-4516-a623-a1bfc845ed7e"
             ,"type":"Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans"}]}
```

### Invoke SQL vulnerability assessment scan

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Invoke-SqlVulnerabilityAssessmentScan -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -DatabaseName db

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [Location, System.String[]], [Retry-After, S
             ystem.String[]]…}
Version    : 1.1
StatusCode : 202
Method     : POST
Content    : {"operation":"ExecuteDatabaseVulnerabilityAssessmentScan","startTime":"2023-05-15T10:58:48.367Z"}
```

### Get SQL vulnerability assessment server setting

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Get-SqlVulnerabilityAssessmentServerSetting -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : GET
Content    : {"properties":{"state":"Enabled"},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups
             /vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default","
             name":"Default","type":"Microsoft.Sql/servers/sqlVulnerabilityAssessments"}
```

### Set SQL vulnerability assessment server setting

**Example 1**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Set-SqlVulnerabilityAssessmentServerSetting -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -State 'Enabled'

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : PUT
Content    : {"properties":{"state":"Enabled"},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups
             /vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default","
             name":"Default","type":"Microsoft.Sql/servers/sqlVulnerabilityAssessments"}
```

**Example 2**:

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Set-SqlVulnerabilityAssessmentServerSetting -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest -State 'Disabled'

Headers    : {[Cache-Control, System.String[]], [Pragma, System.String[]], [x-ms-request-id, System.String[]], [Server,
              System.String[]]…}
Version    : 1.1
StatusCode : 200
Method     : PUT
Content    : {"properties":{"state":"Disabled"},"id":"/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroup
             s/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default",
             "name":"Default","type":"Microsoft.Sql/servers/sqlVulnerabilityAssessments"}
```

### Remove SQL vulnerability assessment server setting

```azurepowershell-interactive
Connect-AzAccount -Subscription 00000000-1111-2222-3333-444444444444
Import-Module .\SqlVulnerabilityAssessmentCommands.psm1
Remove-SqlVulnerabilityAssessmentServerSetting -SubscriptionId 00000000-1111-2222-3333-444444444444 -ResourceGroupName vulnerabilityaseessmenttestRg -ServerName vulnerabilityaseessmenttest


Headers    : {[Pragma, System.String[]], [x-ms-request-id, System.String[]], [x-ms-ratelimit-remaining-subscription-deletes, System.String[]], [x-ms-correlation-request-id, System.String[]]...}
Version    : 1.1
StatusCode : 200
Method     : DELETE
Content    :
```

## Next steps

[Find and remediate vulnerabilities in your Azure SQL databases](sql-azure-vulnerability-assessment-find.md)
