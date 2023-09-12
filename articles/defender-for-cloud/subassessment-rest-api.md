---

title: Container vulnerability assessments powered by Microsoft Defender Vulnerability Management subassessments 
description: Learn about container vulnerability assessments powered by Microsoft Defender Vulnerability Management subassessments 
author: dcurwin
ms.author: dacurwin
ms.date: 09/11/2023
ms.topic: how-to
---

# Container vulnerability assessments powered by Microsoft Defender Vulnerability Management subassessments

API Version:  2019-01-01-preview

Get security subassessments on all your scanned resources inside a scope.

## Overview

You can access vulnerability assessment results pragmatically for both registry and runtime recommendations using the subassessments rest API.

For more information on how to get started with our REST API, see [Azure REST API reference](/rest/api/azure/). Use the following information for specific information for the container vulnerability assessment results powered by Microsoft Defender Vulnerability Management.

## HTTP Requests

### Get

#### GET

`https://management.azure.com/{scope}/providers/Microsoft.Security/assessments/{assessmentName}/subAssessments/{subAssessmentName}?api-version=2019-01-01-preview`

#### URI Parameters

| Name              | In    | Required | Type   | Description                                                  |
| ----------------- | ----- | -------- | ------ | ------------------------------------------------------------ |
| assessmentName    | path  | True     | string | The  Assessment Key - Unique key for the assessment type     |
| scope             | path  | True     | string | Scope of the  query. Can be subscription  (/subscriptions/{SubscriptionID}) or management group  (/providers/Microsoft.Management/managementGroups/mgName). |
| subAssessmentName | path  | True     | string | The  Sub-Assessment Key - Unique key for the subassessment type |
| api-version       | query | True     | string | API version  for the operation                               |

#### Responses

| Name                | Type                                                         | Description                                          |
| ------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 200 OK              | [SecuritySubAssessment](/rest/api/defenderforcloud/sub-assessments/get#securitysubassessment) | OK                                                   |
| Other Status  Codes | [CloudError](/rest/api/defenderforcloud/sub-assessments/get#clouderror) | Error  response describing why the operation failed. |

### List

#### GET

`https://management.azure.com/{scope}/providers/Microsoft.Security/assessments/{assessmentName}/subAssessments?api-version=2019-01-01-preview`

#### URI parameters

| **Name**           | **In** | **Required** | **Type** | **Description**                                              |
| ------------------ | ------ | ------------ | -------- | ------------------------------------------------------------ |
| **assessmentName** | path   | True         | string   | The  Assessment Key - Unique key for the assessment type     |
| **scope**          | path   | True         | string   | Scope of the  query. The scope for AzureContainerVulnerability is the registry itself. |
| **api-version**    | query  | True         | string   | API version  for the operation                               |

#### Responses

| Name               | Type                                                         | Description                                         |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| 200 OK             | [SecuritySubAssessmentList](/rest/api/defenderforcloud/sub-assessments/list#securitysubassessmentlist) | OK                                                  |
| Other Status Codes | [CloudError](/rest/api/defenderforcloud/sub-assessments/list#clouderror) | Error response describing why the operation failed. |

## Security

### azure_auth

Azure Active Directory OAuth2 Flow

Type: oauth2
Flow: implicit
Authorization URL: `https://login.microsoftonline.com/common/oauth2/authorize`

Scopes

| Name               | Description                   |
| ------------------ | ----------------------------- |
| user_impersonation | impersonate your user account |

### Example

### HTTP

#### GET

`https://management.azure.com/subscriptions/{SubscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/providers/Microsoft.Security/assessments/{SubscriptionID}/subAssessments?api-version=2019-01-01-preview`

#### Sample Response

```json
{
    "value": [
        {
            "type": "Microsoft.Security/assessments/subAssessments",
            "id": "/subscriptions/{SubscriptionID}/resourceGroups/PytorchEnterprise/providers/Microsoft.ContainerRegistry/registries/ptebic/providers/Microsoft.Security/assessments/c0b7cfc6-3172-465a-b378-53c7ff2cc0d5/subassessments/3f069764-2777-3731-9698-c87f23569a1d",
            "name": "{name}",
            "properties": {
                "id": "CVE-2021-39537",
                "displayName": "CVE-2021-39537",
                "status": {
                    "code": "NotApplicable",
                    "severity": "High",
                    "cause": "Exempt",
                    "description": "Disabled parent assessment"
                },
                "remediation": "Create new image with updated package libncursesw5 with version 6.2-0ubuntu2.1 or higher.",
                "description": "This vulnerability affects the following vendors: Gnu, Apple, Red_Hat, Ubuntu, Debian, Suse, Amazon, Microsoft, Alpine. To view more details about this vulnerability please visit the vendor website.",
                "timeGenerated": "2023-08-08T08:14:13.742742Z",
                "resourceDetails": {
                    "source": "Azure",
                    "id": "/repositories/public/azureml/aifx/stable-ubuntu2004-cu116-py39-torch1121/images/sha256:7f107db187ff32acfbc47eaa262b44d13d725f14dd08669a726a81fba87a12d6"
                },
                "additionalData": {
                    "assessedResourceType": "AzureContainerRegistryVulnerability",
                    "artifactDetails": {
                        "repositoryName": "public/azureml/aifx/stable-ubuntu2004-cu116-py39-torch1121",
                        "registryHost": "ptebic.azurecr.io",
                        "digest": "sha256:7f107db187ff32acfbc47eaa262b44d13d725f14dd08669a726a81fba87a12d6",
                        "tags": [
                            "biweekly.202305.2"
                        ],
                        "artifactType": "ContainerImage",
                        "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
                        "lastPushedToRegistryUTC": "2023-05-15T16:00:40.2938142Z"
                    },
                    "softwareDetails": {
                        "osDetails": {
                            "osPlatform": "linux",
                            "osVersion": "ubuntu_linux_20.04"
                        },
                        "packageName": "libncursesw5",
                        "category": "OS",
                        "fixReference": {
                            "id": "USN-6099-1",
                            "url": "https://ubuntu.com/security/notices/USN-6099-1",
                            "description": "USN-6099-1: ncurses vulnerabilities 2023 May 23",
                            "releaseDate": "2023-05-23T00:00:00+00:00"
                        },
                        "vendor": "ubuntu",
                        "version": "6.2-0ubuntu2",
                        "evidence": [
                            "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^libncursesw5:.* -e .*:libncursesw5: | cut -f 1 -d ':' | xargs dpkg-query -s",
                            "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^libncursesw5:.* -e .*:libncursesw5: | cut -f 1 -d ':' | xargs dpkg-query -s"
                        ],
                        "language": "",
                        "fixedVersion": "6.2-0ubuntu2.1",
                        "fixStatus": "FixAvailable"
                    },
                    "vulnerabilityDetails": {
                        "cveId": "CVE-2021-39537",
                        "references": [
                            {
                                "title": "CVE-2021-39537",
                                "link": "https://nvd.nist.gov/vuln/detail/CVE-2021-39537"
                            }
                        ],
                        "cvss": {
                            "2.0": null,
                            "3.0": {
                                "base": 7.8,
                                "cvssVectorString": "CVSS:3.0/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H/E:P/RL:U/RC:R"
                            }
                        },
                        "workarounds": [],
                        "publishedDate": "2020-08-04T00:00:00",
                        "lastModifiedDate": "2023-07-07T00:00:00",
                        "severity": "High",
                        "cpe": {
                            "uri": "cpe:2.3:a:ubuntu:libncursesw5:*:*:*:*:*:ubuntu_linux_20.04:*:*",
                            "part": "Applications",
                            "vendor": "ubuntu",
                            "product": "libncursesw5",
                            "version": "*",
                            "update": "*",
                            "edition": "*",
                            "language": "*",
                            "softwareEdition": "*",
                            "targetSoftware": "ubuntu_linux_20.04",
                            "targetHardware": "*",
                            "other": "*"
                        },
                        "weaknesses": {
                            "cwe": [
                                {
                                    "id": "CWE-787"
                                }
                            ]
                        },
                        "exploitabilityAssessment": {
                            "exploitStepsVerified": false,
                            "exploitStepsPublished": false,
                            "isInExploitKit": false,
                            "types": [],
                            "exploitUris": []
                        }
                    },
                    "cvssV30Score": 7.8
                }
            }
        }
    ]
}
```

## Definitions

| Name                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| AzureResourceDetails        | Details of  the Azure resource that was assessed             |
| CloudError                  | Common error  response for all Azure Resource Manager APIs to return error details for  failed operations. (This definition also follows the OData error response format.). |
| CloudErrorBody              | The error  detail                                            |
| AzureContainerVulnerability | More  context fields for container registry Vulnerability assessment |
| CVE                         | CVE Details                                                  |
| CVSS                        | CVSS Details                                                 |
| ErrorAdditionalInfo         | The resource  management error additional info.              |
| SecuritySubAssessment       | Security  subassessment on a resource                       |
| SecuritySubAssessmentList   | List of  security subassessments                            |
| ArtifactDetails             | Details for  the affected container image                    |
| SoftwareDetails             | Details for  the affected software package                   |
| FixReference                | Details on  the fix, if available                            |
| OS Details                  | Details on  the os information                               |
| VulnerabilityDetails        | Details on  the detected vulnerability                       |
| CPE                         | Common  Platform Enumeration                                 |
| Cwe                         | Common  weakness enumeration                                 |
| VulnerabilityReference      | Reference  links to vulnerability                            |
| ExploitabilityAssessment    | Reference  links to an example exploit                       |

### AzureContainerRegistryVulnerability (MDVM)

Additional context fields for Azure container registry vulnerability assessment

| **Name**             | **Type**                                     | **Description**               |
| -------------------- | -------------------------------------------- | ----------------------------- |
| assessedResourceType | string:  AzureContainerRegistryVulnerability | Subassessment  resource type |
| cvssV30Score         | Numeric                                      | CVSS V3 Score                 |
| vulnerabilityDetails | VulnerabilityDetails                         |                               |
| artifactDetails      | ArtifactDetails                              |                               |
| softwareDetails      | SoftwareDetails                              |                               |

### ArtifactDetails

Context details for the affected container image

| **Name**                   | **Type**                | **Description**                      |
| -------------------------- | ----------------------- | ------------------------------------ |
| repositoryName             | String                  | Repository  name                     |
| RepositoryHost             | String                  | Repository  host                     |
| lastPublishedToRegistryUTC | Timestamp               | UTC timestamp  for last publish date |
| artifactType               | String:  ContainerImage |                                      |
| mediaType                  | String                  | Layer media type                     |
| Digest                     | String                  | Digest of vulnerable  image          |
| Tags                       | String                  | Tags of  vulnerable image            |

### Software Details

Details for the affected software package

| **Name**     | **Type**     | **Description**                                              |
| ------------ | ------------ | ------------------------------------------------------------ |
| fixedVersion | String       | Fixed Version                                                |
| category     | String       | Vulnerability  category – OS or Language                     |
| osDetails    | OsDetails    |                                                              |
| language     | String       | Language of  affected package (for example, Python, .NET) could also be empty |
| version      | String       |                                                              |
| vendor       | String       |                                                              |
| packageName  | String       |                                                              |
| fixStatus    | String       | Unknown,      FixAvailable,      NoFixAvailable,      Scheduled,      WontFix |
| evidence     | String       | Evidence for  the package                                    |
| fixReference | FixReference |                                                              |

### FixReference

Details on the fix, if available

| **Name**    | **Type**  | **description**          |
| ----------- | --------- | ------------------------ |
| ID          | String    | Fix ID                   |
| Description | String    | Fix  Description         |
| releaseDate | Timestamp | Fix timestamp            |
| url         | String    | URL to fix  notification |

### OS Details

Details on the os information

| **Name**   | **Type** | **Description**      |
| ---------- | -------- | -------------------- |
| osPlatform | String   | For example: Linux,  Windows |
| osName     | String   | For example: Ubuntu          |
| osVersion  | String   |                      |

### VulnerabilityDetails

Details on the detected vulnerability

| **Severity**             | **Severity**               | **The sub-assessment severity level**                |
| ------------------------ | -------------------------- | ---------------------------------------------------- |
| LastModifiedDate         | Timestamp                  |                                                      |
| publishedDate            | Timestamp                  | Published  date                                      |
| ExploitabilityAssessment | ExploitabilityAssessment   |                                                      |
| CVSS                     | Dictionary  <string, CVSS> | Dictionary  from cvss version to cvss details object |
| Workarounds              | Workaround                 | Published  workarounds for vulnerability             |
| References               | VulnerabilityReference      |                                                      |
| Weaknesses               | Weakness                   |                                                      |
| cveId                    | String                     | CVE ID                                               |
| Cpe                      | CPE                        |                                                      |

### CPE (Common Platform Enumeration)

| **Name**        | **Type** | **Description**                         |
| --------------- | -------- | --------------------------------------- |
| language        | String   | Language tag                            |
| softwareEdition | String   |                                         |
| Version         | String   | Package  version                        |
| targetSoftware  | String   | Target  Software                        |
| vendor          | String   | Vendor                                  |
| product         | String   | Product                                 |
| edition         | String   |                                         |
| update          | String   |                                         |
| other           | String   |                                         |
| part            | String   | Applications  Hardware  OperatingSystems |
| uri             | String   | CPE 2.3  formatted uri                  |

### Weakness

| **Name** | **Type** | **Description** |
| -------- | -------- | --------------- |
| Cwe      | Cwe      |                 |

### Cwe (Common weakness enumeration)

CWE details

| **Name** | **Type** | **description** |
| -------- | -------- | --------------- |
| ID       | String   | CWE ID          |

### VulnerabilityReference

Reference links to vulnerability

| **Name** | **Type** | **Description**  |
| -------- | -------- | ---------------- |
| link     | String   | Reference url    |
| title    | String   | Reference  title |

### ExploitabilityAssessment

Reference links to an example exploit

| **Name**              | **Type** | **Description**                                              |
| --------------------- | -------- | ------------------------------------------------------------ |
| exploitUris           | String   |                                                              |
| exploitStepsPublished | Boolean  | Had the  exploits steps been published                       |
| exploitStepsVerified  | Boolean  | Had the  exploit steps verified                              |
| isInExploitKit        | Boolean  | Is part of  the exploit kit                                  |
| types                 | String   | Exploit  types, for example: NotAvailable, Dos, Local, Remote, WebApps, PrivilegeEscalation |

### AzureResourceDetails

Details of the Azure resource that was assessed

| **Name** | **Type**       | **Description**                                  |
| -------- | -------------- | ------------------------------------------------ |
| ID       | string         | Azure resource ID of the assessed resource       |
| source   | string:  Azure | The platform where the assessed resource resides |

### CloudError

Common error response for all Azure Resource Manager APIs to return error details for failed operations. (This response also follows the OData error response format.).

| **Name**             | **Type**                                                     | **Description**            |
| -------------------- | ------------------------------------------------------------ | -------------------------- |
| error.additionalInfo | [ErrorAdditionalInfo](/rest/api/defenderforcloud/sub-assessments/list#erroradditionalinfo) | The error additional info. |
| error.code           | string                                                       | The error code.            |
| error.details        | [CloudErrorBody](/rest/api/defenderforcloud/sub-assessments/list?tabs=HTTP#clouderrorbody) | The error details.         |
| error.message        | string                                                       | The error message.         |
| error.target         | string                                                       | The error target.          |

### CloudErrorBody

The error detail.

| **Name**       | **Type**                                                     | **Description**            |
| -------------- | ------------------------------------------------------------ | -------------------------- |
| additionalInfo | [ErrorAdditionalInfo](/rest/api/defenderforcloud/sub-assessments/list#erroradditionalinfo) | The error additional info. |
| code           | string                                                       | The error code.            |
| details        | [CloudErrorBody](/rest/api/defenderforcloud/sub-assessments/list#clouderrorbody) | The error details.         |
| message        | string                                                       | The error message.         |
| target         | string                                                       | The error target.          |

### ErrorAdditionalInfo

The resource management error additional info.

| **Name** | **Type** | **Description**           |
| -------- | -------- | ------------------------- |
| info     | object   | The additional info.      |
| type     | string   | The additional info type. |

### SecuritySubAssessment

Security subassessment on a resource

| **Name**                   | **Type**                                                     | **Description**                                     |
| -------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| ID                         | string                                                       | Resource ID                                         |
| name                       | string                                                       | Resource name                                       |
| properties.additionalData  | AdditionalData: AzureContainerRegistryVulnerability          | Details of the subassessment                       |
| properties.category        | string                                                       | Category of the subassessment                      |
| properties.description     | string                                                       | Human readable description of the assessment status |
| properties.displayName     | string                                                       | User friendly display name of the subassessment    |
| properties.id              | string                                                       | Vulnerability ID                                    |
| properties.impact          | string                                                       | Description of the impact of this subassessment    |
| properties.remediation     | string                                                       | Information on how to remediate this subassessment |
| properties.resourceDetails | ResourceDetails:     [AzureResourceDetails](/rest/api/defenderforcloud/sub-assessments/list#azureresourcedetails) | Details of the resource that was assessed           |
| properties.status          | [SubAssessmentStatus](/rest/api/defenderforcloud/sub-assessments/list#subassessmentstatus) | Status of the subassessment                        |
| properties.timeGenerated   | string                                                       | The date and time the subassessment was generated  |
| type                       | string                                                       | Resource type                                       |

### SecuritySubAssessmentList

List of security subassessments

| **Name** | **Type**                                                     | **Description**                       |
| -------- | ------------------------------------------------------------ | ------------------------------------- |
| nextLink | string                                                       | The URI to fetch the next page.       |
| value    | [SecuritySubAssessment](/rest/api/defenderforcloud/sub-assessments/list?tabs=HTTP#securitysubassessment) | Security subassessment on a resource |
