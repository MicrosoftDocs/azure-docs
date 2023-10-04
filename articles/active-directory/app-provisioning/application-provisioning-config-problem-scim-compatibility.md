---
title: Known issues with System for Cross-Domain Identity Management (SCIM) 2.0 protocol compliance
description: How to solve common protocol compatibility issues faced when adding a non-gallery application that supports SCIM 2.0 to Microsoft Entra ID
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: arvinh
---

# Known issues and resolutions with SCIM 2.0 protocol compliance of the Microsoft Entra user provisioning service

Microsoft Entra ID can automatically provision users and groups to any application or system that is fronted by a web service with the interface defined in the [System for Cross-Domain Identity Management (SCIM) 2.0 protocol specification](https://tools.ietf.org/html/draft-ietf-scim-api-19). 

Microsoft Entra ID support for the SCIM 2.0 protocol is described in [Using System for Cross-Domain Identity Management (SCIM) to automatically provision users and groups from Microsoft Entra ID to applications](use-scim-to-provision-users-and-groups.md), which lists the specific parts of the protocol that it implements in order to automatically provision users and groups from Microsoft Entra ID to applications that support SCIM 2.0.

This article describes current and past issues with the Microsoft Entra user provisioning service's adherence to the SCIM 2.0 protocol, and how to work around these issues.

## Understanding the provisioning job
The provisioning service uses the concept of a job to operate against an application. The jobID can be found in the [progress bar](application-provisioning-when-will-provisioning-finish-specific-user.md#view-the-provisioning-progress-bar). All new provisioning applications are created with a jobID starting with "scim". The scim job represents the current state of the service. Older jobs have the ID "customappsso". This job represents the state of the service in 2018. 

If you are using an application in the gallery, the job generally contains the name of the app (such as zoom snowFlake or dataBricks). You can skip this documentation when using a gallery application. This primarily applies for non-gallery applications with jobID SCIM or customAppSSO.

## SCIM 2.0 compliance issues and status
In the table below, any item marked as fixed means that the proper behavior can be found on the SCIM job. We have worked to ensure backwards compatibility for the changes we have made. We recommend using the new behavior for any new implementations and updating existing implementations. Please note that the customappSSO behavior that was the default prior to December 2018 is not supported anymore. 

> [!NOTE]
> For the changes made in 2018, it is possible to revert back to the customappsso behavior. For the changes made since 2018, you can use the URLs to revert back to the older behavior. We have worked to ensure backwards compatibility for the changes we have made by allowing you to revert back to the old jobID or by using a flag. However, as previously mentioned, we do not recommend implementing old behavior as it is not supported anymore. We recommend using the new behavior for any new implementations and updating existing implementations.

| **SCIM 2.0 compliance issue** |  **Fixed?** | **Fix date**  |  **Backwards compatibility** |
|---|---|---|
| Microsoft Entra ID requires "/scim" to be in the root of the application's SCIM endpoint URL  | Yes  |  December 18, 2018 | downgrade to customappSSO |
| Extension attributes use dot "." notation before attribute names instead of colon ":" notation |  Yes  | December 18, 2018  | downgrade to customappSSO |
| Patch requests for multi-value attributes contain invalid path filter syntax | Yes  |  December 18, 2018  | downgrade to customappSSO |
| Group creation requests contain an invalid schema URI | Yes  |  December 18, 2018  |  downgrade to customappSSO |
| Update PATCH behavior to ensure compliance (e.g. active as boolean and proper group membership removals) | No | TBD| use feature flag |

## Flags to alter the SCIM behavior
Use the flags below in the tenant URL of your application in order to change the default SCIM client behavior.

:::image type="content" source="media/application-provisioning-config-problem-scim-compatibility/scim-flags.png" alt-text="SCIM flags to later behavior.":::

Use the following URL to update PATCH behavior and ensure SCIM compliance. The flag will alter the following behaviors:                
- Requests made to disable users
- Requests to add a single-value string attribute
- Requests to replace multiple attributes
- Requests to remove a group member        

This behavior is currently only available when using the flag, but will become the default behavior over the next few months. Note this feature flag currently does not work with on-demand provisioning. 
  * **URL (SCIM Compliant):** aadOptscim062020
  * **SCIM RFC references:** 
    * https://tools.ietf.org/html/rfc7644#section-3.5.2    

Below are sample requests to help outline what the sync engine currently sends versus the requests that are sent once the feature flag is enabled. 

**Requests made to disable users:**

**Without feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "Replace",
            "path": "active",
            "value": "False"
        }
    ]
  }
  ```

**With feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "replace",
            "path": "active",
            "value": false
        }
    ]
  }
  ```

**Requests made to add a single-value string attribute:**

**Without feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
      {
        "op": "Add",
        "path": "nickName",
        "value": "Babs"
      }
    ]
  }
  ```

**With feature flag**
  ```json
  {
    "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    "Operations": [
      {
        "op": "add",
        "path": "nickName",
        "value": "Babs"
      }
    ]
  }
  ```

**Requests to replace multiple attributes:**

**Without feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "Replace",
            "path": "displayName",
            "value": "Pvlo"
        },
        {
            "op": "Replace",
            "path": "emails[type eq \"work\"].value",
            "value": "TestBcwqnm@test.microsoft.com"
        },
        {
            "op": "Replace",
            "path": "name.givenName",
            "value": "Gtfd"
        },
        {
            "op": "Replace",
            "path": "name.familyName",
            "value": "Pkqf"
        },
        {
            "op": "Replace",
            "path": "externalId",
            "value": "Eqpj"
        },
        {
            "op": "Replace",
            "path": "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber",
            "value": "Eqpj"
        }
    ]
  }
  ```

**With feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "replace",
            "path": "emails[type eq \"work\"].value",
            "value": "TestMhvaes@test.microsoft.com"
        },
        {
            "op": "replace",
            "value": {
                "displayName": "Bjfe",
                "name.givenName": "Kkom",
                "name.familyName": "Unua",
                "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber": "Aklq"
            }
        }
    ]
  }
  ```

**Requests made to remove a group member:**

**Without feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "Remove",
            "path": "members",
            "value": [
                {
                    "value": "u1091"
                }
            ]
        }
    ]
  }
  ```

**With feature flag**
  ```json
  {
    "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"
    ],
    "Operations": [
        {
            "op": "remove",
            "path": "members[value eq \"7f4bc1a3-285e-48ae-8202-5accb43efb0e\"]"
        }
    ]
  }
  ```

  * **Downgrade URL:** Once the new SCIM compliant behavior becomes the default on the non-gallery application, you can use the following URL to roll back to the old, non SCIM compliant behavior: AzureAdScimPatch2017



## Upgrading from the older customappsso job to the SCIM job
Following the steps below will delete your existing customappsso job and create a new SCIM job.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Locate and select your existing SCIM application.
1. In the **Properties** section of your existing SCIM app, copy the **Object ID**.
1. In a new web browser window, go to https://developer.microsoft.com/graph/graph-explorer and sign in as the administrator for the Microsoft Entra tenant where your app is added.
1. In the Graph Explorer, run the command below to locate the ID of your provisioning job. Replace "[object-id]" with the service principal ID (object ID) copied from the third step.

   `GET https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs` 

   ![Get Jobs](media/application-provisioning-config-problem-scim-compatibility/get-jobs.PNG "Get Jobs") 


6. In the results, copy the full "ID" string that begins with either "customappsso" or "scim".
7. Run the command below to retrieve the attribute-mapping configuration, so you can make a backup. Use the same [object-id] as before, and replace [job-id] with the provisioning job ID copied from the last step.

   `GET https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs/[job-id]/schema`

   ![Get Schema](media/application-provisioning-config-problem-scim-compatibility/get-schema.PNG "Get Schema") 

8. Copy the JSON output from the last step, and save it to a text file. The JSON contains any custom attribute-mappings that you added to your old app, and should be approximately a few thousand lines of JSON.
9. Run the command below to delete the provisioning job:

   `DELETE https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs/[job-id]`

10. Run the command below to create a new provisioning job that has the latest service fixes.

 `POST https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs`
 `{   "templateId": "scim"   }`

11. In the results of the last step, copy the full "ID" string that begins with "scim". Optionally, reapply your old attribute-mappings by running the command below, replacing [new-job-id] with the new job ID you copied, and entering the JSON output from step #7 as the request body.

 `PUT https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs/[new-job-id]/schema`
 `{   <your-schema-json-here>   }`

12. Return to the first web browser window, and select the **Provisioning** tab for your application.
13. Verify your configuration, and then start the provisioning job. 

## Downgrading from the SCIM job to the customappsso job (not recommended)
 We allow you to downgrade back to the old behavior but don't recommend it as the customappsso does not benefit from some of the updates we make, and may not be supported forever. 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. In the **Create application** section, create a new **Non-gallery** application.
1. In the **Properties** section of your new custom app, copy the **Object ID**.
1. In a new web browser window, go to https://developer.microsoft.com/graph/graph-explorer and sign in as the administrator for the Microsoft Entra tenant where your app is added.
1. In the Graph Explorer, run the command below to initialize the provisioning configuration for your app.
   Replace "[object-id]" with the service principal ID (object ID) copied from the third step.

   `POST https://graph.microsoft.com/beta/servicePrincipals/[object-id]/synchronization/jobs`
   `{   templateId: "customappsso"   }`

6. Return to the first web browser window, and select the **Provisioning** tab for your application.
7. Complete the user provisioning configuration as you normally would.


## Next steps
[Learn more about provisioning and de-provisioning to SaaS applications](user-provisioning.md)
