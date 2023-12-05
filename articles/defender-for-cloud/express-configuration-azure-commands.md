---
title: Express configuration Azure Command Line Interface (CLI) commands reference
description: In this article, you can review the Express configuration Azure Command Line Interface (CLI) commands reference and copy example scripts to use in your environments.
ms.topic: sample
ms.custom: devx-track-azurecli
author: dcurwin
ms.author: dacurwin
ms.date: 06/04/2023
---

# Express configuration Azure Command Line Interface (CLI) commands reference

This article lists the Azure Command Line Interface (CLI) commands that can be used with SQL vulnerability assessment express configuration.

- [Set SQL vulnerability assessment baseline on system database](#set-sql-vulnerability-assessment-baseline-on-system-database)
- [Get SQL vulnerability assessment baseline on system database](#get-sql-vulnerability-assessment-baseline-on-system-database)
- [Set SQL vulnerability assessment baseline on user database](#set-sql-vulnerability-assessment-baseline-on-user-database)
- [Get SQL vulnerability assessment baseline on user database](#get-sql-vulnerability-assessment-baseline-on-user-database)
- [Set SQL vulnerability assessment baseline rule on system database](#set-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Get SQL vulnerability assessment baseline rule on system database](#get-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Remove SQL vulnerability assessment baseline rule on system database](#remove-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Set SQL vulnerability assessment baseline rule on user database](#set-sql-vulnerability-assessment-baseline-rule-on-user-database)
- [Get SQL vulnerability assessment baseline rule on user database](#get-sql-vulnerability-assessment-baseline-rule-on-user-database)
- [Remove SQL vulnerability assessment baseline rule on user database](#remove-sql-vulnerability-assessment-baseline-rule-on-user-database)
- [Get SQL vulnerability assessment scan results on system database](#get-sql-vulnerability-assessment-scan-results-on-system-database)
- [Get SQL vulnerability assessment scan results on user database](#get-sql-vulnerability-assessment-scan-results-on-user-database)
- [Get SQL vulnerability assessment scans on system database](#get-sql-vulnerability-assessment-scans-on-system-database)
- [Get SQL vulnerability assessment scans on user database](#get-sql-vulnerability-assessment-scans-on-user-database)
- [Invoke SQL vulnerability assessment scan on system database](#invoke-sql-vulnerability-assessment-scan-on-system-database)
- [Invoke SQL vulnerability assessment scan on user database](#invoke-sql-vulnerability-assessment-scan-on-user-database)
- [Get SQL vulnerability assessment server setting](#get-sql-vulnerability-assessment-server-setting)
- [Set SQL vulnerability assessment server setting](#set-sql-vulnerability-assessment-server-setting)
- [Remove SQL vulnerability assessment server setting](#remove-sql-vulnerability-assessment-server-setting)

> [!NOTE]
> For Azure CLI reference for the classic configuration, see [Manage findings in your Azure SQL databases](sql-azure-vulnerability-assessment-manage.md#azure-cli)

## Set SQL vulnerability assessment baseline on system database

**Example 1**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master --body '{  "properties": {    "latestScan": true,    "results": {}  }}'

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/Default",
  "name": "Default",
  "properties": {
    "results": {
      "VA2060": [
        [
          "False"
        ]
      ],
      "VA2061": [
        [
          "True"
        ]
      ]
    }
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master --body '{\"properties\": { \"latestScan\": false, \"results\": {\"VA2063\": [[\"AllowAll\",\"0.0.0.0\",\"255.255.255.255\" ]]}}}'

{
	"id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/Default",
	"name": "Default",
	"properties": {
	  "results": {
		"VA2063": [
		  [
			"AllowAll",
			"0.0.0.0",
			"255.255.255.255"
		  ]
		]
	  }
	},
	"type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
}
```

### Get SQL vulnerability assessment baseline on system database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/master/sqlVulnerabilityAssessments/Default/baselines/Default",
  "name": "Default",
  "properties": {
    "results": {
      "VA2060": [
        [
          "False"
        ]
      ],
      "VA2061": [
        [
          "True"
        ]
      ]
    }
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master
{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/Default",
      "name": "Default",
      "properties": {
        "results": {
          "VA2060": [
            [
              "False"
            ]
          ],
          "VA2061": [
            [
              "True"
            ]
          ]
        }
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
    }
  ]
}
```

### Set SQL vulnerability assessment baseline on user database

**Example 1**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview --body '{  "properties": {    "latestScan": true,    "results": {}  }}'
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default",
  "name": "Default",
  "properties": {
    "results": {
      "VA1143": [
        [
          "True"
        ]
      ],
      "VA1219": [
        [
          "False"
        ]
      ]
    }
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview --body '{\"properties\": { \"latestScan\": false, \"results\": {\"VA2062\": [[\"AllowAll\",\"0.0.0.0\",\"255.255.255.255\" ]]}}}'

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default",
  "name": "Default",
  "properties": {
    "results": {
      "VA2062": [
        [
          "AllowAll",
          "0.0.0.0",
          "255.255.255.255"
        ]
      ]
    }
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

### Get SQL vulnerability assessment baseline on user database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default?api-version=2022-02-01-preview
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default",
  "name": "Default",
  "properties": {
    "results": {
      "VA1143": [
        [
          "True"
        ]
      ],
      "VA1219": [
        [
          "False"
        ]
      ]
    }
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines?api-version=2022-02-01-preview

{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/Default",
      "name": "Default",
      "properties": {
        "results": {
          "VA1143": [
            [
              "True"
            ]
          ],
          "VA1219": [
            [
              "False"
            ]
          ]
        }
      },
      "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
    }
  ]
}
```

### Set SQL vulnerability assessment baseline rule on system database

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master --body '{ \"properties\": {    \"latestScan\": false,    \"results\": [        [          \"AllowAll\",          \"0.0.0.0\",          \"255.255.255.255\"        ]      ]  }}'

{
    "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2065",
	"name": "VA2065",
	"properties": {
	  "results": [
		[
		  "AllowAll",
		  "0.0.0.0",
		  "255.255.255.255"
		]
	  ]
	},
	"type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
  }
```

### Get SQL vulnerability assessment baseline rule on system database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2065",
  "name": "VA2065",
  "properties": {
    "results": [
      [
        "AllowAll",
        "0.0.0.0",
        "255.255.255.255"
      ]
    ]
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default/rules?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2060",
      "name": "VA2060",
      "properties": {
        "results": [
          [
            "False"
          ]
        ]
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2061",
      "name": "VA2061",
      "properties": {
        "results": [
          [
            "True"
          ]
        ]
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2065",
      "name": "VA2065",
      "properties": {
        "results": [
          [
            "AllowAll",
            "0.0.0.0",
            "255.255.255.255"
          ]
        ]
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/baselines"
    }
  ]
}
```

### Remove SQL vulnerability assessment baseline rule on system database

```azurecli
az rest --method Delete --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master
```

### Set SQL vulnerability assessment baseline rule on user database

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview --body '{ \"properties\": {    \"latestScan\": false,    \"results\": [        [          \"AllowAll\",          \"0.0.0.0\",          \"255.255.255.255\"        ]      ]  }}'

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2062",
  "name": "VA2062",
  "properties": {
    "results": [
      [
        "AllowAll",
        "0.0.0.0",
        "255.255.255.255"
      ]
    ]
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

### Get SQL vulnerability assessment baseline rule on user database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA2062",
  "name": "VA2062",
  "properties": {
    "results": [
      [
        "AllowAll",
        "0.0.0.0",
        "255.255.255.255"
      ]
    ]
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default/rules?api-version=2022-02-01-preview

{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA1143",
      "name": "VA1143",
      "properties": {
        "results": [
          [
            "True"
          ]
        ]
      },
      "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/baselines/default/rules/VA1219",
      "name": "VA1219",
      "properties": {
        "results": [
          [
            "False"
          ]
        ]
      },
      "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/baselines"
    }
  ]
}
```

### Remove SQL vulnerability assessment baseline rule on user database

```azurecli
az rest --method Delete --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview
```

### Get SQL vulnerability assessment scan results on system database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/scans/$ScanId/scanresults/$RuleId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/VA2065/scanResults/VA2065",
  "name": "VA2065",
  "properties": {
    "baselineAdjustedResult": null,
    "errorMessage": null,
    "isTrimmed": false,
    "queryResults": [],
    "remediation": {
      "automated": false,
      "description": "Evaluate each of the server-level firewall rules. Remove any rules that grant unnecessary access and set the rest as a baseline. Deviations from the baseline will be identified and brought to your attention in subsequent scans.",
      "portalLink": "ReviewServerFirewallRules",
      "scripts": []
    },
    "ruleId": "VA2065",
    "ruleMetadata": {
      "benchmarkReferences": [],
      "category": "SurfaceAreaReduction",
      "description": "The Azure SQL server-level firewall helps protect your data by preventing all access to your databases until you specify which IP addresses have permission. Server-level firewall rules grant access to all databases that belong to the server based on the originating IP address of each request.\n\nServer-level firewall rules can be created and managed through Transact-SQL as well as through the Azure portal or PowerShell. For more details please see: https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure.\n\nThis check enumerates all the server-level firewall rules so that any changes made to them can be identified and addressed.",
      "queryCheck": {
        "columnNames": [
          "Firewall Rule Name",
          "Start Address",
          "End Address"
        ],
        "expectedResult": [],
        "query": "SELECT name AS [Firewall Rule Name]\n    ,start_ip_address AS [Start Address]\n    ,end_ip_address AS [End Address]\nFROM sys.firewall_rules"
      },
      "rationale": "Firewall rules should be strictly configured to allow access only to client computers that have a valid need to connect to the database server. Any superfluous entries in the firewall may pose a threat by allowing an unauthorized source access to your databases.",
      "ruleId": "VA2065",
      "ruleType": "BaselineExpected",
      "severity": "High",
      "title": "Server-level firewall rules should be tracked and maintained at a strict minimum"
    },
    "status": "NonFinding"
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans/scanResults"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/scans/$ScanId/scanresults?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/VA1223/scanResults/VA1223",
      "name": "VA1223",
      "properties": {
        "baselineAdjustedResult": null,
        "errorMessage": null,
        "isTrimmed": false,
        "queryResults": [],
        "remediation": {
          "automated": false,
          "description": "Create new certificates, re-encrypt the data/sign-data using the new key, and drop the affected keys.",
          "portalLink": "",
          "scripts": []
        },
        "ruleId": "VA1223",
        "ruleMetadata": {
          "benchmarkReferences": [
            {
              "benchmark": "FedRAMP",
              "reference": null
            }
          ],
          "category": "DataProtection",
          "description": "Certificate keys are used in RSA and other encryption algorithms to protect data. These keys need to be of enough length to secure the user's data. This rule checks that the key's length is at least 2048 bits for all certificates.",
          "queryCheck": {
            "columnNames": [
              "Certificate Name",
              "Thumbprint"
            ],
            "expectedResult": [],
            "query": "SELECT name AS [Certificate Name], thumbprint AS [Thumbprint]\nFROM sys.certificates\nWHERE key_length < 2048"
          },
          "rationale": "Key length defines the upper-bound on the encryption algorithm's security. Using short keys in encryption algorithms may lead to weaknesses in data-at-rest protection.",
          "ruleId": "VA1223",
          "ruleType": "NegativeList",
          "severity": "High",
          "title": "Certificate keys should use at least 2048 bits"
        },
        "status": "NonFinding"
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans/scanResults"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/VA2060/scanResults/VA2060",
      "name": "VA2060",
      "properties": {
        "baselineAdjustedResult": {
          "baseline": {
            "expectedResults": [
              [
                "False"
              ]
            ],
            "updatedTime": "2023-05-15T12:36:39.9688256+00:00"
          },
          "resultsNotInBaseline": [],
          "resultsOnlyInBaseline": [],
          "status": "NonFinding"
        },
        "errorMessage": null,
        "isTrimmed": false,
        "queryResults": [
          [
            "False"
          ]
        ],
        "remediation": {
          "automated": false,
          "description": "It is recommended to enable SQL Threat Detection at the server level so that all activities on the server itself and the databases that belong to it are protected.",
          "portalLink": "EnableAds",
          "scripts": []
        },
        "ruleId": "VA2060",
        "ruleMetadata": {
          "benchmarkReferences": [],
          "category": "DataProtection",
          "description": "SQL Threat Detection provides a layer of security, which detects potential vulnerabilities and anomalous activity in databases, such as SQL injection attacks and unusual behavior patterns. When a potential threat is detected, Threat Detection sends an actionable real-time alert by email and in Azure Security Center, which includes clear investigation and remediation steps for the specific threat. For more information please see https://docs.microsoft.com/en-us/azure/sql-database/sql-database-threat-detection.\nThis check verifies that SQL Threat Detection is enabled",
          "queryCheck": {
            "columnNames": [
              "Violation"
            ],
            "expectedResult": [
              [
                "0"
              ]
            ],
            "query": "SELECT CASE WHEN EXISTS\n ( SELECT * FROM sys.audits WHERE name LIKE '%SqlDbThreatDetection_ServerAudit%' ) THEN 0\n ELSE 1\n END AS [Violation]"
          },
          "rationale": "Even when database systems apply thorough security measures, breaches can occur and it is important to have a detection mechanism in place. SQL Threat Detection should be enabled to detect any such potential threats that may compromise the data stored in Azure SQL Databases.",
          "ruleId": "VA2060",
          "ruleType": "Binary",
          "severity": "Medium",
          "title": "SQL Threat Detection should be enabled at the server level"
        },
        "status": "NonFinding"
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans/scanResults"
    },
  ]
}
```

### Get SQL vulnerability assessment scan results on user database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/scans/$ScanId/scanresults/$RuleId?api-version=2022-02-01-preview
{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/scans/VA2062/scanResults/VA2062",
  "name": "VA2062",
  "properties": {
    "baselineAdjustedResult": {
      "baseline": {
        "expectedResults": [
          [
            "AllowAll",
            "0.0.0.0",
            "255.255.255.255"
          ]
        ],
        "updatedTime": "2023-05-15T12:52:17.0297386+00:00"
      },
      "resultsNotInBaseline": [],
      "resultsOnlyInBaseline": [
        [
          "AllowAll",
          "0.0.0.0",
          "255.255.255.255"
        ]
      ],
      "status": "Finding"
    },
    "errorMessage": null,
    "isTrimmed": false,
    "queryResults": [],
    "remediation": {
      "automated": false,
      "description": "Remove database firewall rules that grant excessive access",
      "portalLink": "",
      "scripts": []
    },
    "ruleId": "VA2062",
    "ruleMetadata": {
      "benchmarkReferences": [],
      "category": "SurfaceAreaReduction",
      "description": "The Azure SQL Database-level firewall helps protect your data by preventing all access to your database until you specify which IP addresses have permission. Database-level firewall rules grant access to the specific database based on the originating IP address of each request.\n\nDatabase-level firewall rules for master and user databases can only be created and managed through Transact-SQL (unlike server-level firewall rules which can also be created and managed using the Azure portal or PowerShell). For more details please see: https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure\n\nThis check verifies that each database-level firewall rule does not grant access to more than 255 IP addresses.",
      "queryCheck": {
        "columnNames": [
          "Firewall Rule Name",
          "Start Address",
          "End Address"
        ],
        "expectedResult": [],
        "query": "SELECT name AS [Firewall Rule Name]\n    ,start_ip_address AS [Start Address]\n    ,end_ip_address AS [End Address]\nFROM sys.database_firewall_rules\nWHERE ( \n        (CONVERT(bigint, parsename(end_ip_address, 1)) +\n         CONVERT(bigint, parsename(end_ip_address, 2)) * 256 + \n         CONVERT(bigint, parsename(end_ip_address, 3)) * 65536 + \n         CONVERT(bigint, parsename(end_ip_address, 4)) * 16777216 ) \n        - \n        (CONVERT(bigint, parsename(start_ip_address, 1)) +\n         CONVERT(bigint, parsename(start_ip_address, 2)) * 256 + \n         CONVERT(bigint, parsename(start_ip_address, 3)) * 65536 + \n         CONVERT(bigint, parsename(start_ip_address, 4)) * 16777216 )\n      ) > 255"
      },
      "rationale": "Often, administrators add rules that grant excessive access as part of a troubleshooting process - to eliminate the firewall as the source of a problem, they simply create a rule that allows all traffic to pass to the affected database.\n\nGranting excessive access using database firewall rules is a clear security concern, as it violates the principle of least privilege by allowing unnecessary access to your database. In fact, it's the equivalent of placing the database outside of the firewall.",
      "ruleId": "VA2062",
      "ruleType": "NegativeList",
      "severity": "High",
      "title": "Database-level firewall rules should not grant excessive access"
    },
    "status": "NonFinding"
  },
  "type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/scanResults"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/scans/$ScanId/scanresults?api-version=2022-02-01-preview

{
	"value": [
	  {
		"id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/scans/VA1020/scanResults/VA1020",
		"name": "VA1020",
		"properties": {
		  "baselineAdjustedResult": null,
		  "errorMessage": null,
		  "isTrimmed": false,
		  "queryResults": [],
		  "remediation": {
			"automated": true,
			"description": "Remove the special user GUEST from all roles.",
			"portalLink": "",
			"scripts": []
		  },
		  "ruleId": "VA1020",
		  "ruleMetadata": {
			"benchmarkReferences": [
			  {
				"benchmark": "FedRAMP",
				"reference": null
			  }
			],
			"category": "AuthenticationAndAuthorization",
			"description": "The guest user permits access to a database for any logins that are not mapped to a specific database user. This rule checks that no database roles are assigned to the Guest user.",
			"queryCheck": {
			  "columnNames": [
				"Role"
			  ],
			  "expectedResult": [],
			  "query": "SELECT roles.[name] AS [Role]\nFROM sys.database_role_members AS drms\nINNER JOIN sys.database_principals AS roles ON drms.role_principal_id = roles.principal_id\nINNER JOIN sys.database_principals AS users ON drms.member_principal_id = users.principal_id\nWHERE users.[name] = 'guest'"
			},
			"rationale": "Database Roles are the basic building block at the heart of separation of duties and the principle of least permission. Granting the Guest user membership to specific roles defeats this purpose.",
			"ruleId": "VA1020",
			"ruleType": "NegativeList",
			"severity": "High",
			"title": "Database user GUEST should not be a member of any role"
		  },
		  "status": "NonFinding"
		},
		"type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/scanResults"
	  },
	  {
		"id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/Default/scans/VA1054/scanResults/VA1054",
		"name": "VA1054",
		"properties": {
		  "baselineAdjustedResult": null,
		  "errorMessage": null,
		  "isTrimmed": false,
		  "queryResults": [],
		  "remediation": {
			"automated": false,
			"description": "Revoke unnecessary permissions granted to PUBLIC",
			"portalLink": "",
			"scripts": []
		  },
		  "ruleId": "VA1054",
		  "ruleMetadata": {
			"benchmarkReferences": [
			  {
				"benchmark": "FedRAMP",
				"reference": null
			  }
			],
			"category": "AuthenticationAndAuthorization",
			"description": "Every SQL Server login belongs to the public server role. When a server principal has not been granted or denied specific permissions on a securable object, the user inherits the permissions granted to public on that object. This rule displays a GetList of all securable objects or columns that are accessible to all users through the PUBLIC role.",
			"queryCheck": {
			  "columnNames": [
				"Permission",
				"Schema",
				"Object"
			  ],
			  "expectedResult": [],
			  "query": "SELECT permission_name AS [Permission]\n ,schema_name AS [Schema]\n ,object_name AS [Object]\nFROM (\n    SELECT objs.TYPE COLLATE database_default AS object_type\n        ,schema_name(schema_id) COLLATE database_default AS schema_name\n        ,objs.name COLLATE database_default AS object_name\n        ,user_name(grantor_principal_id) COLLATE database_default AS grantor_principal_name\n        ,permission_name COLLATE database_default AS permission_name\n        ,perms.TYPE COLLATE database_default AS TYPE\n        ,STATE COLLATE database_default AS STATE\n FROM sys.database_permissions AS perms\n INNER JOIN sys.objects AS objs\n ON objs.object_id = perms.major_id\n  WHERE perms.class = 1 -- objects or columns. Other cases are handled by VA1095 which has different remediation syntax\n  AND grantee_principal_id = DATABASE_PRINCIPAL_ID('public')\n  AND [state] IN (\n   'G'\n   ,'W'\n   )\n  AND NOT (\n   -- These permissions are granted by default to public\n   permission_name = 'EXECUTE'\n   AND schema_name(schema_id) = 'dbo'\n   AND STATE = 'G'\n   AND objs.name IN (\n    'fn_sysdac_is_dac_creator'\n    ,'fn_sysdac_is_currentuser_sa'\n    ,'fn_sysdac_is_login_creator'\n    ,'fn_sysdac_get_username'\n    ,'sp_sysdac_ensure_dac_creator'\n    ,'sp_sysdac_add_instance'\n    ,'sp_sysdac_add_history_entry'\n    ,'sp_sysdac_delete_instance'\n    ,'sp_sysdac_upgrade_instance'\n    ,'sp_sysdac_drop_database'\n    ,'sp_sysdac_rename_database'\n    ,'sp_sysdac_setreadonly_database'\n    ,'sp_sysdac_rollback_committed_step'\n    ,'sp_sysdac_update_history_entry'\n    ,'sp_sysdac_resolve_pending_entry'\n    ,'sp_sysdac_rollback_pending_object'\n    ,'sp_sysdac_rollback_all_pending_objects'\n    ,'fn_sysdac_get_currentusername'\n    )\n   OR permission_name = 'SELECT'\n   AND schema_name(schema_id) = 'sys'\n   AND STATE = 'G'\n   AND objs.name IN (\n    'firewall_rules'\n    ,'database_firewall_rules'\n    ,'ipv6_database_firewall_rules'\n    ,'bandwidth_usage'\n    ,'database_usage'\n    ,'external_library_setup_errors'\n    ,'sql_feature_restrictions'\n    ,'resource_stats'\n    ,'elastic_pool_resource_stats'\n    ,'dm_database_copies'\n    ,'geo_replication_links'\n    ,'database_error_stats'\n    ,'event_log'\n    ,'database_connection_stats'\n    )\n   OR permission_name = 'SELECT'\n   AND schema_name(schema_id) = 'dbo'\n   AND STATE = 'G'\n   AND objs.name IN (\n    'sysdac_instances_internal'\n    ,'sysdac_history_internal'\n    ,'sysdac_instances'\n    )\n   )\n\n ) t"
			},
			"rationale": "Database Roles are the basic building block at the heart of separation of duties and the principle of least permission. Granting permissions to principals through the default PUBLIC role defeats this purpose.",
			"ruleId": "VA1054",
			"ruleType": "NegativeList",
			"severity": "Low",
			"title": "Excessive permissions should not be granted to PUBLIC role on objects or columns"
		  },
		  "status": "NonFinding"
		},
		"type": "Microsoft.Sql/servers/databases/sqlVulnerabilityAssessments/scans/scanResults"
	  }
	]
}
```

### Get SQL vulnerability assessment scans on system database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/scans/$ScanId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

 {
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
  "name": "ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
  "properties": {
    "database": "master",
    "endTime": "2023-04-24T07:07:15.4704608Z",
    "highSeverityFailedRulesCount": 0,
    "isBaselineApplied": true,
    "lowSeverityFailedRulesCount": 0,
    "mediumSeverityFailedRulesCount": 0,
    "scanId": "ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
    "server": "vulnerabilityaseessmenttest",
    "sqlVersion": "16.0.5100",
    "startTime": "2023-04-24T07:07:15.4079623Z",
    "state": "Passed",
    "totalFailedRulesCount": 0,
    "totalPassedRulesCount": 9,
    "totalRulesCount": 9,
    "triggerType": "OnDemand"
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/scans?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

{
  "value": [
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
      "name": "ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
      "properties": {
        "database": "master",
        "endTime": "2023-04-24T07:07:15.4704608Z",
        "highSeverityFailedRulesCount": 0,
        "isBaselineApplied": true,
        "lowSeverityFailedRulesCount": 0,
        "mediumSeverityFailedRulesCount": 0,
        "scanId": "ab58a4de-6bd6-4e54-bfa7-1d5e97ece68d",
        "server": "vulnerabilityaseessmenttest",
        "sqlVersion": "16.0.5100",
        "startTime": "2023-04-24T07:07:15.4079623Z",
        "state": "Passed",
        "totalFailedRulesCount": 0,
        "totalPassedRulesCount": 9,
        "totalRulesCount": 9,
        "triggerType": "OnDemand"
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/f3ec698b-104c-40a7-b1eb-251ff83bcf4e",
      "name": "f3ec698b-104c-40a7-b1eb-251ff83bcf4e",
      "properties": {
        "database": "master",
        "endTime": "2023-04-24T07:07:15.4079623Z",
        "highSeverityFailedRulesCount": 0,
        "isBaselineApplied": true,
        "lowSeverityFailedRulesCount": 1,
        "mediumSeverityFailedRulesCount": 1,
        "scanId": "f3ec698b-104c-40a7-b1eb-251ff83bcf4e",
        "server": "vulnerabilityaseessmenttest",
        "sqlVersion": "16.0.5100",
        "startTime": "2023-04-24T07:02:05.6581079Z",
        "state": "Failed",
        "totalFailedRulesCount": 2,
        "totalPassedRulesCount": 7,
        "totalRulesCount": 9,
        "triggerType": "OnDemand"
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans"
    },
    {
      "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default/scans/8c26af1e-79d6-4238-b7cf-bc7941714f34",
      "name": "8c26af1e-79d6-4238-b7cf-bc7941714f34",
      "properties": {
        "database": "master",
        "endTime": "2023-04-24T07:02:05.6581079Z",
        "highSeverityFailedRulesCount": 1,
        "isBaselineApplied": false,
        "lowSeverityFailedRulesCount": 1,
        "mediumSeverityFailedRulesCount": 0,
        "scanId": "8c26af1e-79d6-4238-b7cf-bc7941714f34",
        "server": "vulnerabilityaseessmenttest",
        "sqlVersion": "16.0.5100",
        "startTime": "2023-04-17T12:52:45.2387704Z",
        "state": "Failed",
        "totalFailedRulesCount": 2,
        "totalPassedRulesCount": 7,
        "totalRulesCount": 9,
        "triggerType": "OnDemand"
      },
      "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments/scans"
    }
  ]
}
```

### Get SQL vulnerability assessment scans on user database

**Example 1**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/scans/$ScanId?api-version=2022-02-01-preview

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/vulnerabilityAssessments/Default/scans/f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
  "name": "f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
  "properties": {
    "database": "db",
    "endTime": "2023-04-17T12:52:41.5235755Z",
    "highSeverityFailedRulesCount": 1,
    "isBaselineApplied": true,
    "lowSeverityFailedRulesCount": 0,
    "mediumSeverityFailedRulesCount": 0,
    "scanId": "f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
    "server": "vulnerabilityaseessmenttest",
    "sqlVersion": "16.0.5100",
    "startTime": "2023-04-17T12:52:41.4142209Z",
    "state": "Failed",
    "totalFailedRulesCount": 1,
    "totalPassedRulesCount": 23,
    "totalRulesCount": 24,
    "triggerType": "OnDemand"
  },
  "type": "Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans"
}
```

**Example 2**:

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/scans?api-version=2022-02-01-preview

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/vulnerabilityAssessments/Default/scans/f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
  "name": "f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
  "properties": {
    "database": "db",
    "endTime": "2023-04-17T12:52:41.5235755Z",
    "highSeverityFailedRulesCount": 1,
    "isBaselineApplied": true,
    "lowSeverityFailedRulesCount": 0,
    "mediumSeverityFailedRulesCount": 0,
    "scanId": "f64d81a1-9d7b-4516-a623-a1bfc845ed7e",
    "server": "vulnerabilityaseessmenttest",
    "sqlVersion": "16.0.5100",
    "startTime": "2023-04-17T12:52:41.4142209Z",
    "state": "Failed",
    "totalFailedRulesCount": 1,
    "totalPassedRulesCount": 23,
    "totalRulesCount": 24,
    "triggerType": "OnDemand"
  },
  "type": "Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans"
}
```

### Invoke SQL vulnerability assessment scan on system database

```azurecli
az rest --method Post --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/initiateScan?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master

{
  "operation": "ExecuteDatabaseVulnerabilityAssessmentScan",
  "startTime": "2023-05-15T13:07:56.837Z"
}
```

### Invoke SQL vulnerability assessment scan on user database

```azurecli
az rest --method Post --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/databases/db/sqlVulnerabilityAssessments/default/initiateScan?api-version=2022-02-01-preview

{
  "operation": "ExecuteDatabaseVulnerabilityAssessmentScan",
  "startTime": "2023-05-15T13:07:08.277Z"
}
```

### Get SQL vulnerability assessment server setting

```azurecli
az rest --method Get --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default?api-version=2022-02-01-preview

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default",
  "name": "Default",
  "properties": {
    "state": "Enabled"
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments"
}
```

### Set SQL vulnerability assessment server setting

**Example 1**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default?api-version=2022-02-01-preview --body '{   \"properties\": {     \"state\": \"Enabled\" }}'

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default",
  "name": "Default",
  "properties": {
    "state": "Enabled"
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments"
}
```

**Example 2**:

```azurecli
az rest --method Put --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default?api-version=2022-02-01-preview --body '{   \"properties\": {     \"state\": \"Disabled\" }}'

{
  "id": "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/Default",
  "name": "Default",
  "properties": {
    "state": "Disabled"
  },
  "type": "Microsoft.Sql/servers/sqlVulnerabilityAssessments"
}
```

### Remove SQL vulnerability assessment server setting

```azurecli
az rest --method Delete --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default?api-version=2022-02-01-preview
```

## Next steps

[Find and remediate vulnerabilities in your Azure SQL databases](sql-azure-vulnerability-assessment-find.md)
