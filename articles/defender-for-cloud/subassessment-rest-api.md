---

title: Container vulnerability assessments powered by Microsoft Defender Vulnerability Management subassessments 
description: Learn about container vulnerability assessments powered by Microsoft Defender Vulnerability Management subassessments 
author: dcurwin
ms.author: dacurwin
ms.date: 09/18/2023
ms.topic: how-to
---

# Container vulnerability assessments REST API

## Overview

Azure Resource Graph (ARG) provides a REST API that can be used to pragmatically access vulnerability assessment results for both Azure registry and runtime vulnerabilities recommendations.
Learn more about [ARG references and query examples](/azure/governance/resource-graph/overview).

Azure container registry vulnerabilities sub assessments are published to ARG as part of the security resources. For more information, see:
- [Security Resources ARG Query Samples](/azure/governance/resource-graph/samples/samples-by-category?tabs=azure-cli#list-container-registry-vulnerability-assessment-results)
- [Generic Security Sub Assessment Query](/azure/governance/resource-graph/samples/samples-by-category?tabs=azure-cli#list-container-registry-vulnerability-assessment-results)

## ARG query examples

To pull specific sub assessments, you need the assessment key. For Container vulnerability assessment powered by MDVM the key is `c0b7cfc6-3172-465a-b378-53c7ff2cc0d5`. 

The following is a generic security sub assessment query example that can be used as an example to build queries with. This query pulls the first sub assessment generated in the last hour.
```kql
securityresources 
| where type =~ "microsoft.security/assessments/subassessments" and properties.additionalData.assessedResourceType == "AzureContainerRegistryVulnerability"
| extend assessmentKey=extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id)
| where assessmentKey == "c0b7cfc6-3172-465a-b378-53c7ff2cc0d5"
| extend timeGenerated = properties.timeGenerated
| where timeGenerated > ago(1h)
```
### Query result
```json
[
  {
    "id": "/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroup}/providers/Microsoft.ContainerRegistry/registries/{Registry Name}/providers/Microsoft.Security/assessments/c0b7cfc6-3172-465a-b378-53c7ff2cc0d5/subassessments/{SubAssessmentId}",
    "name": "{SubAssessmentId}",
    "type": "microsoft.security/assessments/subassessments",
    "tenantId": "{TenantId}",
    "kind": "",
    "location": "global",
    "resourceGroup": "{ResourceGroup}",
    "subscriptionId": "{SubscriptionId}",
    "managedBy": "",
    "sku": null,
    "plan": null,
    "properties": {
      "id": "CVE-2022-42969",
      "additionalData": {
        "assessedResourceType": "AzureContainerRegistryVulnerability",
        "vulnerabilityDetails": {
          "severity": "High",
          "exploitabilityAssessment": {
            "exploitStepsPublished": false,
            "exploitStepsVerified": false,
            "isInExploitKit": false,
            "exploitUris": [],
            "types": [
              "Remote"
            ]
          },
          "lastModifiedDate": "2023-09-12T00:00:00Z",
          "publishedDate": "2022-10-16T06:15:00Z",
          "workarounds": [],
          "references": [
            {
              "title": "CVE-2022-42969",
              "link": "https://nvd.nist.gov/vuln/detail/CVE-2022-42969"
            },
            {
              "title": "oval:org.opensuse.security:def:202242969",
              "link": "https://ftp.suse.com/pub/projects/security/oval/suse.linux.enterprise.server.15.xml.gz"
            },
            {
              "title": "oval:com.microsoft.cbl-mariner:def:11166",
              "link": "https://raw.githubusercontent.com/microsoft/CBL-MarinerVulnerabilityData/main/cbl-mariner-1.0-oval.xml"
            },
            {
              "title": "ReDoS in py library when used with subversion ",
              "link": "https://github.com/advisories/GHSA-w596-4wvx-j9j6"
            }
          ],
          "weaknesses": {
            "cwe": [
              {
                "id": "CWE-1333"
              }
            ]
          },
          "cveId": "CVE-2022-42969",
          "cvss": {
            "2.0": null,
            "3.0": {
              "cvssVectorString": "CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H",
              "base": 7.5
            }
          },
          "cpe": {
            "language": "*",
            "softwareEdition": "*",
            "version": "*",
            "targetHardware": "*",
            "targetSoftware": "python",
            "vendor": "py",
            "edition": "*",
            "product": "py",
            "update": "*",
            "other": "*",
            "part": "Applications",
            "uri": "cpe:2.3:a:py:py:*:*:*:*:*:python:*:*"
          }
        },
        "artifactDetails": {
          "lastPushedToRegistryUTC": "2023-09-04T16:05:32.8223098Z",
          "repositoryName": "public/azureml/aifx/stable-ubuntu2004-cu117-py39-torch200",
          "registryHost": "ptebic.azurecr.io",
          "artifactType": "ContainerImage",
          "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
          "digest": "sha256:4af8e6f002401a965bbe753a381af308b40d8947fad2b9e1f6a369aa81abee59",
          "tags": [
            "biweekly.202309.1"
          ]
        },
        "softwareDetails": {
          "category": "Language",
          "language": "python",
          "fixedVersion": "",
          "version": "1.11.0.0",
          "vendor": "py",
          "packageName": "py",
          "osDetails": {
            "osPlatform": "linux",
            "osVersion": "ubuntu_linux_20.04"
          },
          "fixStatus": "FixAvailable",
          "evidence": []
        },
        "cvssV30Score": 7.5
      },
      "description": "This vulnerability affects the following vendors: Pytest, Suse, Microsoft, Py. To view more details about this vulnerability please visit the vendor website.",
      "displayName": "CVE-2022-42969",
      "resourceDetails": {
        "id": "/repositories/public/azureml/aifx/stable-ubuntu2004-cu117-py39-torch200/images/sha256:4af8e6f002401a965bbe753a381af308b40d8947fad2b9e1f6a369aa81abee59",
        "source": "Azure"
      },
      "timeGenerated": "2023-09-12T13:36:15.0772799Z",
      "remediation": "No remediation exists",
      "status": {
        "description": "Disabled parent assessment",
        "severity": "High",
        "code": "NotApplicable",
        "cause": "Exempt"
      }
    },
    "tags": null,
    "identity": null,
    "zones": null,
    "extendedLocation": null,
    "assessmentKey": "c0b7cfc6-3172-465a-b378-53c7ff2cc0d5",
    "timeGenerated": "2023-09-12T13:36:15.0772799Z"
  }
]
```

## Definitions

| Name                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| AzureResourceDetails        | Details of  the Azure resource that was assessed             |
| AzureContainerVulnerability | More  context fields for container registry Vulnerability assessment |
| CVE                         | CVE Details                                                  |
| CVSS                        | CVSS Details                                                 |
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

Other context fields for Azure container registry vulnerability assessment

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
