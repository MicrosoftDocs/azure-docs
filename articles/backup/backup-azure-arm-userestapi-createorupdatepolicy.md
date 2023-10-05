---
title: Create backup policies using REST API
description: In this article, you'll learn how to create and manage backup policies (schedule and retention) using REST API.
ms.topic: how-to
ms.date: 02/14/2023
ms.assetid: 5ffc4115-0ae5-4b85-a18c-8a942f6d4870
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Create Azure Recovery Services backup policies using REST API

The steps to create a backup policy for an Azure Recovery Services vault are outlined in the [policy REST API document](/rest/api/backup/protection-policies/create-or-update). Let's use this document as a reference to create a policy for Azure VM backup.

## Create or update a policy

To create or update an Azure Backup policy, use the following *PUT* operation

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupPolicies/{policyName}?api-version=2019-05-13
```

The `{policyName}` and `{vaultName}` are provided in the URI. Additional information is provided in the request body.

## Create the request body

For example, to create a policy for Azure VM backup, following are the components of the request body.

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|properties     |   True      |  ProtectionPolicy:[AzureIaaSVMProtectionPolicy](/rest/api/backup/protection-policies/create-or-update#azureiaasvmprotectionpolicy)      | ProtectionPolicyResource properties        |
|tags     |         | Object        |  Resource tags       |

For the complete list of definitions in the request body, refer to the [backup policy REST API document](/rest/api/backup/protection-policies/create-or-update).

### Example request body

#### For Azure VM backup

The following request body defines a standard backup policy for Azure VM backups.

This policy:

- Takes a weekly backup every Monday, Wednesday, Thursday at 10:00 AM Pacific Standard Time.
- Retains the backups taken on every Monday, Wednesday, Thursday for one week.
- Retains the backups taken on every first Wednesday and third Thursday of a month for two months (overrides the previous retention conditions, if any).
- Retains the backups taken on fourth Monday and fourth Thursday in February and November for four years (overrides the previous retention conditions, if any).

```json
{
  "properties": {
    "backupManagementType": "AzureIaasVM",
    "timeZone": "Pacific Standard Time",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Weekly",
      "scheduleRunTimes": [
        "2018-01-24T10:00:00Z"
      ],
      "scheduleRunDays": [
        "Monday",
        "Wednesday",
        "Thursday"
      ]
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Monday",
          "Wednesday",
          "Thursday"
        ],
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 1,
          "durationType": "Weeks"
        }
      },
      "monthlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Wednesday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "First",
            "Third"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        }
      },
      "yearlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "monthsOfYear": [
          "February",
          "November"
        ],
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Monday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "Fourth"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 4,
          "durationType": "Years"
        }
      }
    }
  }
}
```

The following request body defines an enhanced backup policy for Azure VM backups creating multiple backups a day.

This policy:

- Takes a backup every 4 hours from 3:30 PM UTC everyday
- Retains instant recovery snapshot for 7 days
- Retains the daily backups for 180 days
- Retains the backups taken on the Sunday of every week for 12 weeks
- Retains the backups taken on the first Sunday of every month for 12 months

```json
{
	"properties": {
		"backupManagementType": "AzureIaasVM",
		"policyType": "V2",
		"instantRPDetails": {},
		"schedulePolicy": {
			"schedulePolicyType": "SimpleSchedulePolicyV2",
			"scheduleRunFrequency": "Hourly",
			"hourlySchedule": {
				"interval": 4,
				"scheduleWindowStartTime": "2023-02-06T15:30:00Z",
				"scheduleWindowDuration": 24
			}
		},
		"retentionPolicy": {
			"retentionPolicyType": "LongTermRetentionPolicy",
			"dailySchedule": {
				"retentionTimes": [
					"2023-02-06T15:30:00Z"
				],
				"retentionDuration": {
					"count": 180,
					"durationType": "Days"
				}
			},
			"weeklySchedule": {
				"daysOfTheWeek": [
					"Sunday"
				],
				"retentionTimes": [
					"2023-02-06T15:30:00Z"
				],
				"retentionDuration": {
					"count": 12,
					"durationType": "Weeks"
				}
			},
			"monthlySchedule": {
				"retentionScheduleFormatType": "Weekly",
				"retentionScheduleWeekly": {
					"daysOfTheWeek": [
						"Sunday"
					],
					"weeksOfTheMonth": [
						"First"
					]
				},
				"retentionTimes": [
					"2023-02-06T15:30:00Z"
				],
				"retentionDuration": {
					"count": 12,
					"durationType": "Months"
				}
			}
		},
		"tieringPolicy": {
			"ArchivedRP": {
				"tieringMode": "DoNotTier",
				"duration": 0,
				"durationType": "Invalid"
			}
		},
		"instantRpRetentionRangeInDays": 7,
		"timeZone": "UTC",
		"protectedItemsCount": 0
	}
}
```


> [!IMPORTANT]
> The time formats for schedule and retention support only DateTime. They don't support Time format alone.



#### For SQL in Azure VM backup

The following is an example request body for SQL in Azure VM backup.

This policy:

- Takes a full backup everyday at 13:30 UTC and a log backup every 1 hour.
- Retains the daily full backups for 30 days and log backups for 30 days as well.

```json
"properties": {
    "backupManagementType": "AzureWorkload",
    "workLoadType": "SQLDataBase",
    "settings": {
      "timeZone": "UTC",
      "issqlcompression": false,
      "isCompression": false
    },
    "subProtectionPolicy": [
      {
        "policyType": "Full",
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunFrequency": "Daily",
          "scheduleRunTimes": [
            "2022-02-14T13:30:00Z"
          ],
          "scheduleWeeklyFrequency": 0
        },
        "retentionPolicy": {
          "retentionPolicyType": "LongTermRetentionPolicy",
          "dailySchedule": {
            "retentionTimes": [
              "2022-02-14T13:30:00Z"
            ],
            "retentionDuration": {
              "count": 30,
              "durationType": "Days"
            }
          }
        }
      },
      {
        "policyType": "Log",
        "schedulePolicy": {
          "schedulePolicyType": "LogSchedulePolicy",
          "scheduleFrequencyInMins": 60
        },
        "retentionPolicy": {
          "retentionPolicyType": "SimpleRetentionPolicy",
          "retentionDuration": {
            "count": 30,
            "durationType": "Days"
          }
        }
      }
    ],
    "protectedItemsCount": 0
  }
```

The following is an example of a policy that takes a differential backup everyday and a full backup once a week.

```json
"properties": {
    "backupManagementType": "AzureWorkload",
    "workLoadType": "SQLDataBase",
    "settings": {
      "timeZone": "UTC",
      "issqlcompression": false,
      "isCompression": false
    },
    "subProtectionPolicy": [
      {
        "policyType": "Full",
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunFrequency": "Weekly",
          "scheduleRunDays": [
            "Sunday"
          ],
          "scheduleRunTimes": [
            "2022-06-13T19:30:00Z"
          ],
          "scheduleWeeklyFrequency": 0
        },
        "retentionPolicy": {
          "retentionPolicyType": "LongTermRetentionPolicy",
          "weeklySchedule": {
            "daysOfTheWeek": [
              "Sunday"
            ],
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 104,
              "durationType": "Weeks"
            }
          },
          "monthlySchedule": {
            "retentionScheduleFormatType": "Weekly",
            "retentionScheduleWeekly": {
              "daysOfTheWeek": [
                "Sunday"
              ],
              "weeksOfTheMonth": [
                "First"
              ]
            },
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 60,
              "durationType": "Months"
            }
          },
          "yearlySchedule": {
            "retentionScheduleFormatType": "Weekly",
            "monthsOfYear": [
              "January"
            ],
            "retentionScheduleWeekly": {
              "daysOfTheWeek": [
                "Sunday"
              ],
              "weeksOfTheMonth": [
                "First"
              ]
            },
            "retentionTimes": [
              "2022-06-13T19:30:00Z"
            ],
            "retentionDuration": {
              "count": 10,
              "durationType": "Years"
            }
          }
        }
      },
      {
        "policyType": "Differential",
        "schedulePolicy": {
          "schedulePolicyType": "SimpleSchedulePolicy",
          "scheduleRunFrequency": "Weekly",
          "scheduleRunDays": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "scheduleRunTimes": [
            "2022-06-13T02:00:00Z"
          ],
          "scheduleWeeklyFrequency": 0
        },
        "retentionPolicy": {
          "retentionPolicyType": "SimpleRetentionPolicy",
          "retentionDuration": {
            "count": 30,
            "durationType": "Days"
          }
        }
      },
      {
        "policyType": "Log",
        "schedulePolicy": {
          "schedulePolicyType": "LogSchedulePolicy",
          "scheduleFrequencyInMins": 120
        },
        "retentionPolicy": {
          "retentionPolicyType": "SimpleRetentionPolicy",
          "retentionDuration": {
            "count": 15,
            "durationType": "Days"
          }
        }
      }
    ],
    "protectedItemsCount": 0
  }
```

#### For SAP HANA in Azure VM backup

The following is an example request body for SQL in Azure VM backup.

This policy:

- Takes a full backup every day at 19:30 UTC and a log backup every 2 hours.
- Retains the daily backups for 180 days.
- Retains the weekly backups for 104 weeks.
- Retains the monthly backups for 60 months.
- Retains the yearly backups for 10 years.
- Retains the log backups for 15 days.

```json
{
  "properties": {
    "backupManagementType": "AzureIaasVM",
    "timeZone": "Pacific Standard Time",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Weekly",
      "scheduleRunTimes": [
        "2018-01-24T10:00:00Z"
      ],
      "scheduleRunDays": [
        "Monday",
        "Wednesday",
        "Thursday"
      ]
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Monday",
          "Wednesday",
          "Thursday"
        ],
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 1,
          "durationType": "Weeks"
        }
      },
      "monthlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Wednesday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "First",
            "Third"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        }
      },
      "yearlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "monthsOfYear": [
          "February",
          "November"
        ],
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Monday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "Fourth"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 4,
          "durationType": "Years"
        }
      }
    }
  }
}
```

The following is an example of a policy that takes a full backup once a week and an incremental backup once a day.

```json

"properties": {
  "backupManagementType": "AzureWorkload",
  "workLoadType": "SAPHanaDatabase",
  "settings": {
    "timeZone": "UTC",
    "issqlcompression": false,
    "isCompression": false
  },
  "subProtectionPolicy": [
    {
      "policyType": "Full",
      "schedulePolicy": {
        "schedulePolicyType": "SimpleSchedulePolicy",
        "scheduleRunFrequency": "Weekly",
        "scheduleRunDays": [
          "Sunday"
        ],
        "scheduleRunTimes": [
          "2022-06-13T19:30:00Z"
        ],
        "scheduleWeeklyFrequency": 0
      },
      "retentionPolicy": {
        "retentionPolicyType": "LongTermRetentionPolicy",
        "weeklySchedule": {
          "daysOfTheWeek": [
            "Sunday"
          ],
          "retentionTimes": [
            "2022-06-13T19:30:00Z"
          ],
          "retentionDuration": {
            "count": 104,
            "durationType": "Weeks"
          }
        },
        "monthlySchedule": {
          "retentionScheduleFormatType": "Weekly",
          "retentionScheduleWeekly": {
            "daysOfTheWeek": [
              "Sunday"
            ],
            "weeksOfTheMonth": [
              "First"
            ]
          },
          "retentionTimes": [
            "2022-06-13T19:30:00Z"
          ],
          "retentionDuration": {
            "count": 60,
            "durationType": "Months"
          }
        },
        "yearlySchedule": {
          "retentionScheduleFormatType": "Weekly",
          "monthsOfYear": [
            "January"
          ],
          "retentionScheduleWeekly": {
            "daysOfTheWeek": [
              "Sunday"
            ],
            "weeksOfTheMonth": [
              "First"
            ]
          },
          "retentionTimes": [
            "2022-06-13T19:30:00Z"
          ],
          "retentionDuration": {
            "count": 10,
            "durationType": "Years"
          }
        }
      }
    },
    {
      "policyType": "Incremental",
      "schedulePolicy": {
        "schedulePolicyType": "SimpleSchedulePolicy",
        "scheduleRunFrequency": "Weekly",
        "scheduleRunDays": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "scheduleRunTimes": [
          "2022-06-13T02:00:00Z"
        ],
        "scheduleWeeklyFrequency": 0
      },
      "retentionPolicy": {
        "retentionPolicyType": "SimpleRetentionPolicy",
        "retentionDuration": {
          "count": 30,
          "durationType": "Days"
        }
      }
    },
    {
      "policyType": "Log",
      "schedulePolicy": {
        "schedulePolicyType": "LogSchedulePolicy",
        "scheduleFrequencyInMins": 120
      },
      "retentionPolicy": {
        "retentionPolicyType": "SimpleRetentionPolicy",
        "retentionDuration": {
          "count": 15,
          "durationType": "Days"
        }
      }
    }
  ],
  "protectedItemsCount": 0
}

```


#### For Azure File share backup

The following is an example request body for Azure File share backup.

This policy:

- Takes a backup every day at 15:30 UTC.
- Retains the daily backups for 30 days.
- Retains the backups taken every Sunday for 12 weeks.

```json
"properties": {
    "backupManagementType": "AzureStorage",
    "workloadType": "AzureFileShare",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Daily",
      "scheduleRunTimes": [
        "2022-06-13T15:30:00Z"
      ],
      "scheduleWeeklyFrequency": 0
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "dailySchedule": {
        "retentionTimes": [
          "2022-06-13T15:30:00Z"
        ],
        "retentionDuration": {
          "count": 30,
          "durationType": "Days"
        }
      },
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Sunday"
        ],
        "retentionTimes": [
          "2022-06-13T15:30:00Z"
        ],
        "retentionDuration": {
          "count": 12,
          "durationType": "Weeks"
        }
      }
    },
    "timeZone": "UTC",
    "protectedItemsCount": 0
  }
```



## Responses

The backup policy creation/update is a [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created. Then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |    [Protection PolicyResource](/rest/api/backup/protection-policies/create-or-update#protectionpolicyresource)     |  OK       |
|202 Accepted     |         |     Accepted    |

### Example responses

Once you submit the *PUT* request for policy creation or updating, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operations/00000000-0000-0000-0000-000000000000?api-version=2016-06-01
X-Content-Type-Options: nosniff
x-ms-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-client-request-id: e1f94eef-9b2d-45c4-85b8-151e12b07d03; e1f94eef-9b2d-45c4-85b8-151e12b07d03
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-routing-request-id: SOUTHINDIA:20180521T073907Z:db785be0-bb20-4598-bc9f-70c9428b170b
Cache-Control: no-cache
Date: Mon, 21 May 2018 07:39:06 GMT
Location: https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operationResults/00000000-0000-0000-0000-000000000000?api-version=2019-05-13
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a simple *GET* command.

```http
GET https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1/operationResults/00000000-0000-0000-0000-000000000000?api-version=2019-05-13
```

Once the operation completes, it returns 200 (OK) with the policy content in the response body.

```json
{
  "id": "/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SwaggerTestRg/providers/Microsoft.RecoveryServices/vaults/testVault/backupPolicies/testPolicy1",
  "name": "testPolicy1",
  "type": "Microsoft.RecoveryServices/vaults/backupPolicies",
  "properties": {
    "backupManagementType": "AzureIaasVM",
    "schedulePolicy": {
      "schedulePolicyType": "SimpleSchedulePolicy",
      "scheduleRunFrequency": "Weekly",
      "scheduleRunDays": [
        "Monday",
        "Wednesday",
        "Thursday"
      ],
      "scheduleRunTimes": [
        "2018-01-24T10:00:00Z"
      ],
      "scheduleWeeklyFrequency": 0
    },
    "retentionPolicy": {
      "retentionPolicyType": "LongTermRetentionPolicy",
      "weeklySchedule": {
        "daysOfTheWeek": [
          "Monday",
          "Wednesday",
          "Thursday"
        ],
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 1,
          "durationType": "Weeks"
        }
      },
      "monthlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Wednesday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "First",
            "Third"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 2,
          "durationType": "Months"
        }
      },
      "yearlySchedule": {
        "retentionScheduleFormatType": "Weekly",
        "monthsOfYear": [
          "February",
          "November"
        ],
        "retentionScheduleWeekly": {
          "daysOfTheWeek": [
            "Monday",
            "Thursday"
          ],
          "weeksOfTheMonth": [
            "Fourth"
          ]
        },
        "retentionTimes": [
          "2018-01-24T10:00:00Z"
        ],
        "retentionDuration": {
          "count": 4,
          "durationType": "Years"
        }
      }
    },
    "timeZone": "Pacific Standard Time",
    "protectedItemsCount": 0
  }
}
```

If a policy is already being used to protect an item, any update in the policy will result in [modifying protection](backup-azure-arm-userestapi-backupazurevms.md#changing-the-policy-of-protection) for all such associated items.

## Next steps

[Enable protection for an unprotected Azure VM](backup-azure-arm-userestapi-backupazurevms.md).

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)