---
title: Express configuration Azure PowerShell commands reference
description: In this article, you can review the Express configuration Azure PowerShell commands reference and copy example scripts to use in your environments.
ms.topic: sample
author: ElazarK
ms.author: elkrieger
ms.date: 05/23/2023
---

# Express configuration Azure PowerShell commands reference

- [Set SQL vulnerability assessment baseline on system database](#set-sql-vulnerability-assessment-baseline-on-system-database)
- [Get SQL vulnerability assessment baseline on system database](#get-sql-vulnerability-assessment-baseline-on-system-database)
- [Get List of Sql Vulnerability Assessment Baseline On System Database](#get-list-of-sql-vulnerability-assessment-baseline-on-system-database)
- [Set SQL vulnerability assessment baseline on user database](#set-sql-vulnerability-assessment-baseline-on-user-database)
- [Get SQL vulnerability assessment baseline on user database](#get-sql-vulnerability-assessment-baseline-on-user-database)
- [Get list SQL vulnerability assessment baseline on user database](#get-list-sql-vulnerability-assessment-baseline-on-user-database)
- [Set SQL vulnerability assessment baseline rule on system database](#set-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Get SQL vulnerability assessment baseline rule on system database](#get-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Get list SQL vulnerability assessment baseline rule on system database](#get-list-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Remove SQL vulnerability assessment baseline rule on system database](#remove-sql-vulnerability-assessment-baseline-rule-on-system-database)
- [Set SQL vulnerability assessment baseline rule on user database](#set-sql-vulnerability-assessment-baseline-rule-on-user-database)
- 
- 
- 
- 

## Set SQL vulnerability assessment baseline on system database

**Example 1**:

```azurepowershell
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

```azurepowershell
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

## Get SQL vulnerability assessment baseline on system database

```azurepowershell
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
## Get List of Sql Vulnerability Assessment Baseline On System Database

```azurepowershell
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

## Set SQL vulnerability assessment baseline on user database

**Example 1**:

```azurepowershell
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

```azurepowershell
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

## Get SQL vulnerability assessment baseline on user database

```azurepowershell
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
## Get list SQL vulnerability assessment baseline on user database

```azurepowershell
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

## Set SQL vulnerability assessment baseline rule on system database

```azurepowershell
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

## Get SQL vulnerability assessment baseline rule on system database

```azurepowershell
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

## Get list SQL vulnerability assessment baseline rule on system database

```azurepowershell
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

## Remove SQL vulnerability assessment baseline rule on system database

```azurepowershell
az rest --method Delete --uri /subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/vulnerabilityaseessmenttestRg/providers/Microsoft.Sql/servers/vulnerabilityaseessmenttest/sqlVulnerabilityAssessments/default/baselines/default/rules/$RuleId?api-version=2022-02-01-preview --uri-parameters systemDatabaseName=master
```

## Set SQL vulnerability assessment baseline rule on user database

```azurepowershell
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


## Next steps
