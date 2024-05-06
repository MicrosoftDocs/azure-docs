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

Azure Resource Graph (ARG) provides a REST API that can be used to programmatically access vulnerability assessment results for both Azure registry and runtime vulnerabilities recommendations.
Learn more about [ARG references and query examples](../governance/resource-graph/overview.md).

Azure, AWS, and GCP container registry vulnerabilities sub-assessments are published to ARG as part of the security resources. Learn more about [security sub-assessments](../governance/resource-graph/samples/samples-by-category.md?tabs=azure-cli#list-container-registry-vulnerability-assessment-results).

## ARG query examples

To pull specific sub assessments, you need the assessment key.

* For Azure container vulnerability assessment powered by MDVM, the key is `c0b7cfc6-3172-465a-b378-53c7ff2cc0d5`.
* For AWS container vulnerability assessment powered by MDVM, the key is `c27441ae-775c-45be-8ffa-655de37362ce`.
* For GCP container vulnerability assessment powered by MDVM, the key is `5cc3a2c1-8397-456f-8792-fe9d0d4c9145`.

The following is a generic security sub assessment query example that can be used as an example to build queries with. This query pulls the first sub assessment generated in the last hour.

```kql
securityresources 
| where type =~ "microsoft.security/assessments/subassessments" and properties.additionalData.assessedResourceType == "AzureContainerRegistryVulnerability"
| extend assessmentKey=extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id)
| where assessmentKey == "c0b7cfc6-3172-465a-b378-53c7ff2cc0d5"
| extend timeGenerated = properties.timeGenerated
| where timeGenerated > ago(1h)
```

### Query result - Azure sub-assessment

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

### Query result - AWS sub-assessment

```json
[
  {
    "id": "/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroup}/providers/ microsoft.security/ securityconnectors/{SecurityConnectorName}/ securityentitydata/aws-ecr-repository-{RepositoryName}-{Region}/providers/Microsoft.Security/assessments/c27441ae-775c-45be-8ffa-655de37362ce/subassessments/{SubAssessmentId}",
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
      "description": "This vulnerability affects the following vendors: Debian, Fedora, Luatex_Project, Miktex, Oracle, Suse, Tug, Ubuntu. To view more details about this vulnerability please visit the vendor website.",
      "resourceDetails": {
          "id": "544047870946.dkr.ecr.us-east-1.amazonaws.com/mc/va/eastus/verybigimage@sha256:87e18285c301bc09b7f2da126992475eb0c536d38272aa0a7066324b7dda3d87",
          "source": "Aws",
          "connectorId": "649e5f3a-ea19-4057-88fd-58b1f4b774e2",
          "region": "us-east-1",
          "nativeCloudUniqueIdentifier": "arn:aws:ecr:us-east-1:544047870946:image/mc/va/eastus/verybigimage",
          "resourceProvider": "ecr",
          "resourceType": "repository",
          "resourceName": "mc/va/eastus/verybigimage",
          "hierarchyId": "544047870946"
      },
      "additionalData": {
          "assessedResourceType": "AwsContainerRegistryVulnerability",
          "cvssV30Score": 7.8,
          "vulnerabilityDetails": {
              "severity": "High",
              "exploitabilityAssessment": {
                  "exploitStepsPublished": false,
                  "exploitStepsVerified": false,
                  "isInExploitKit": false,
                  "exploitUris": [],
                  "types": []
              },
              "lastModifiedDate": "2023-11-07T00:00:00.0000000Z",
              "publishedDate": "2023-05-16T00:00:00.0000000Z",
              "workarounds": [],
              "weaknesses": {
                  "cwe": []
              },
              "references": [
                  {
                      "title": "CVE-2023-32700",
                      "link": "https://nvd.nist.gov/vuln/detail/CVE-2023-32700"
                  },
                  {
                      "title": "CVE-2023-32700_oval:com.oracle.elsa:def:20233661",
                      "link": "https://linux.oracle.com/security/oval/com.oracle.elsa-all.xml.bz2"
                  },
                  {
                      "title": "CVE-2023-32700_oval:com.ubuntu.bionic:def:61151000000",
                      "link": "https://security-metadata.canonical.com/oval/com.ubuntu.bionic.usn.oval.xml.bz2"
                  },
                  {
                      "title": "CVE-2023-32700_oval:org.debian:def:155787957530144107267311766002078821941",
                      "link": "https://www.debian.org/security/oval/oval-definitions-bullseye.xml"
                  },
                  {
                      "title": "oval:org.opensuse.security:def:202332700",
                      "link": "https://ftp.suse.com/pub/projects/security/oval/suse.linux.enterprise.server.15.xml.gz"
                  },
                  {
                      "title": "texlive-base-20220321-72.fc38",
                      "link": "https://archives.fedoraproject.org/pub/fedora/linux/updates/38/Everything/x86_64/repodata/c7921a40ea935e92e8cfe8f4f0062fbc3a8b55bc01eaf0e5cfc196d51ebab20d-updateinfo.xml.xz"
                  }
              ],
              "cvss": {
                  "2.0": null,
                  "3.0": {
                      "cvssVectorString": "CVSS:3.1/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H",
                      "base": 7.8
                  }
              },
              "cveId": "CVE-2023-32700",
              "cpe": {
                  "language": "*",
                  "softwareEdition": "*",
                  "version": "*",
                  "targetSoftware": "ubuntu_linux_20.04",
                  "targetHardware": "*",
                  "vendor": "ubuntu",
                  "edition": "*",
                  "product": "libptexenc1",
                  "update": "*",
                  "other": "*",
                  "part": "Applications",
                  "uri": "cpe:2.3:a:ubuntu:libptexenc1:*:*:*:*:*:ubuntu_linux_20.04:*:*"
              }
          },
          "artifactDetails": {
              "repositoryName": "mc/va/eastus/verybigimage",
              "registryHost": "544047870946.dkr.ecr.us-east-1.amazonaws.com",
              "lastPushedToRegistryUTC": "2022-06-26T13:24:03.0000000Z",
              "artifactType": "ContainerImage",
              "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
              "digest": "sha256:87e18285c301bc09b7f2da126992475eb0c536d38272aa0a7066324b7dda3d87",
              "tags": [
                  "latest"
              ]
          },
          "softwareDetails": {
              "fixedVersion": "2019.20190605.51237-3ubuntu0.1",
              "language": "",
              "category": "OS",
              "osDetails": {
                  "osPlatform": "linux",
                  "osVersion": "ubuntu_linux_20.04"
              },
              "version": "2019.20190605.51237-3build2",
              "vendor": "ubuntu",
              "packageName": "libptexenc1",
              "fixStatus": "FixAvailable",
              "evidence": [
                  "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^libptexenc1:.* -e .*:libptexenc1: | cut -f 1 -d ':' | xargs dpkg-query -s",
                  "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^libptexenc1:.* -e .*:libptexenc1: | cut -f 1 -d ':' | xargs dpkg-query -s"
              ],
              "fixReference": {
                  "description": "USN-6115-1: TeX Live vulnerability 2023 May 30",
                  "id": "USN-6115-1",
                  "releaseDate": "2023-05-30T00:00:00.0000000Z",
                  "url": "https://ubuntu.com/security/notices/USN-6115-1"
              }
          }
      },
      "timeGenerated": "2023-12-11T13:23:58.4539977Z",
      "displayName": "CVE-2023-32700",
      "remediation": "Create new image with updated package libptexenc1 with version 2019.20190605.51237-3ubuntu0.1 or higher.",
      "status": {
          "severity": "High",
          "code": "Unhealthy"
      },
      "id": "CVE-2023-32700"
    },
    "tags": null,
    "identity": null,
    "zones": null,
    "extendedLocation": null,
    "assessmentKey": "c27441ae-775c-45be-8ffa-655de37362ce",
    "timeGenerated": "2023-12-11T13:23:58.4539977Z"
  }
]
```

### Query result - GCP sub-assessment

```json
[
  {
    "id": "/subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroup}/providers/ microsoft.security/ securityconnectors/{SecurityConnectorName}/securityentitydata/gar-gcp-repository-{RepositoryName}-{Region}/providers/Microsoft.Security/assessments/5cc3a2c1-8397-456f-8792-fe9d0d4c9145/subassessments/{SubAssessmentId}",
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
      "description": "This vulnerability affects the following vendors: Alpine, Debian, Libtiff, Suse, Ubuntu. To view more details about this vulnerability please visit the vendor website.",
      "resourceDetails": {
          "id": "us-central1-docker.pkg.dev/detection-stg-manual-tests-2/hital/nginx@sha256:09e210fe1e7f54647344d278a8d0dee8a4f59f275b72280e8b5a7c18c560057f",
          "source": "Gcp",
          "resourceType": "repository",
          "nativeCloudUniqueIdentifier": "projects/detection-stg-manual-tests-2/locations/us-central1/repositories/hital/dockerImages/nginx@sha256:09e210fe1e7f54647344d278a8d0dee8a4f59f275b72280e8b5a7c18c560057f",
          "resourceProvider": "gar",
          "resourceName": "detection-stg-manual-tests-2/hital/nginx",
          "hierarchyId": "788875449976",
          "connectorId": "40139bd8-5bae-e3e0-c640-2a45cdcd2d0c",
          "region": "us-central1"
      },
      "displayName": "CVE-2017-11613",
      "additionalData": {
          "assessedResourceType": "GcpContainerRegistryVulnerability",
          "vulnerabilityDetails": {
              "severity": "Low",
              "lastModifiedDate": "2023-12-09T00:00:00.0000000Z",
              "exploitabilityAssessment": {
                  "exploitStepsPublished": false,
                  "exploitStepsVerified": false,
                  "exploitUris": [],
                  "isInExploitKit": false,
                  "types": [
                      "PrivilegeEscalation"
                  ]
              },
              "publishedDate": "2017-07-26T00:00:00.0000000Z",
              "workarounds": [],
              "references": [
                  {
                      "title": "CVE-2017-11613",
                      "link": "https://nvd.nist.gov/vuln/detail/CVE-2017-11613"
                  },
                  {
                      "title": "129463",
                      "link": "https://exchange.xforce.ibmcloud.com/vulnerabilities/129463"
                  },
                  {
                      "title": "CVE-2017-11613_oval:com.ubuntu.trusty:def:36061000000",
                      "link": "https://security-metadata.canonical.com/oval/com.ubuntu.trusty.usn.oval.xml.bz2"
                  },
                  {
                      "title": "CVE-2017-11613_oval:org.debian:def:85994619016140765823174295608399452222",
                      "link": "https://www.debian.org/security/oval/oval-definitions-stretch.xml"
                  },
                  {
                      "title": "oval:org.opensuse.security:def:201711613",
                      "link": "https://ftp.suse.com/pub/projects/security/oval/suse.linux.enterprise.server.15.xml.gz"
                  },
                  {
                      "title": "CVE-2017-11613-cpe:2.3:a:alpine:tiff:*:*:*:*:*:alpine_3.9:*:*-3.9",
                      "link": "https://security.alpinelinux.org/vuln/CVE-2017-11613"
                  }
              ],
              "weaknesses": {
                  "cwe": [
                      {
                          "id": "CWE-20"
                      }
                  ]
              },
              "cvss": {
                  "2.0": null,
                  "3.0": {
                      "cvssVectorString": "CVSS:3.0/AV:L/AC:L/PR:N/UI:R/S:U/C:N/I:N/A:L/E:U/RL:U/RC:R",
                      "base": 3.3
                  }
              },
              "cveId": "CVE-2017-11613",
              "cpe": {
                  "version": "*",
                  "language": "*",
                  "vendor": "debian",
                  "softwareEdition": "*",
                  "targetSoftware": "debian_9",
                  "targetHardware": "*",
                  "product": "tiff",
                  "edition": "*",
                  "update": "*",
                  "other": "*",
                  "part": "Applications",
                  "uri": "cpe:2.3:a:debian:tiff:*:*:*:*:*:debian_9:*:*"
              }
          },
          "cvssV30Score": 3.3,
          "artifactDetails": {
              "lastPushedToRegistryUTC": "2023-12-11T08:33:13.0000000Z",
              "repositoryName": "detection-stg-manual-tests-2/hital/nginx",
              "registryHost": "us-central1-docker.pkg.dev",
              "artifactType": "ContainerImage",
              "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
              "digest": "sha256:09e210fe1e7f54647344d278a8d0dee8a4f59f275b72280e8b5a7c18c560057f",
              "tags": [
                  "1.12"
              ]
          },
          "softwareDetails": {
              "version": "4.0.8-2+deb9u2",
              "language": "",
              "fixedVersion": "4.0.8-2+deb9u4",
              "vendor": "debian",
              "category": "OS",
              "osDetails": {
                  "osPlatform": "linux",
                  "osVersion": "debian_9"
              },
              "packageName": "tiff",
              "fixReference": {
                  "description": "DSA-4349-1: tiff security update 2018 November 30",
                  "id": "DSA-4349-1",
                  "releaseDate": "2018-11-30T22:41:54.0000000Z",
                  "url": "https://security-tracker.debian.org/tracker/DSA-4349-1"
              },
              "fixStatus": "FixAvailable",
              "evidence": [
                  "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^tiff:.* -e .*:tiff: | cut -f 1 -d ':' | xargs dpkg-query -s",
                  "dpkg-query -f '${Package}:${Source}:\\n' -W | grep -e ^tiff:.* -e .*:tiff: | cut -f 1 -d ':' | xargs dpkg-query -s"
              ]
          }
      },
      "timeGenerated": "2023-12-11T10:25:43.8751687Z",
      "remediation": "Create new image with updated package tiff with version 4.0.8-2+deb9u4 or higher.",
      "id": "CVE-2017-11613",
      "status": {
          "severity": "Low",
          "code": "Unhealthy"
      }
    },
    "tags": null,
    "identity": null,
    "zones": null,
    "extendedLocation": null,
    "assessmentKey": "5cc3a2c1-8397-456f-8792-fe9d0d4c9145",
    "timeGenerated": "2023-12-11T10:25:43.8751687Z"
  }
]
```

## Definitions

| Name                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| ResourceDetails             | Details of  the Azure resource that was assessed             |
| ContainerRegistryVulnerability      | More  context fields for container registry vulnerability assessment |
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

### ContainerRegistryVulnerability (MDVM)

Other context fields for Azure container registry vulnerability assessment

| **Name**             | **Type**                                     | **Description**               |
| -------------------- | -------------------------------------------- | ----------------------------- |
| assessedResourceType | string: <br> AzureContainerRegistryVulnerability<br> AwsContainerRegistryVulnerability <br> GcpContainerRegistryVulnerability | Subassessment resource type   |
| cvssV30Score         | Numeric                                      | CVSS V3 Score                 |
| vulnerabilityDetails | VulnerabilityDetails                         |                               |
| artifactDetails      | ArtifactDetails                              |                               |
| softwareDetails      | SoftwareDetails                              |                               |

### ArtifactDetails

Context details for the affected container image

| **Name**                   | **Type**                | **Description**                      |
| -------------------------- | ----------------------- | ------------------------------------ |
| repositoryName             | String                  | Repository  name                     |
| RegistryHost               | String                  | Registry  host                       |
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

### ResourceDetails - Azure

Details of the Azure resource that was assessed

| **Name** | **Type**       | **Description**                                  |
| -------- | -------------- | ------------------------------------------------ |
| ID       | string         | Azure resource ID of the assessed resource       |
| source   | string:  Azure | The platform where the assessed resource resides |

### ResourceDetails - AWS / GCP

Details of the AWS/GCP resource that was assessed

| **Name**                    | **Type**        | **Description**                                  |
| --------------------------- | --------------- | ------------------------------------------------ |
| id                          | string          | Azure resource ID of the assessed resource       |
| source                      | string: Aws/Gcp | The platform where the assessed resource resides |
| connectorId                 | string          | Connector ID                                     |
| region                      | string          | Region                                           |
| nativeCloudUniqueIdentifier | string          | Native Cloud's Resource ID of the Assessed resource in |
| resourceProvider            | string: ecr/gar/gcr | The assessed resource provider                   |
| resourceType                | string          | The assessed resource type                       |
| resourceName                | string          | The assessed resource name                       |
| hierarchyId                 | string          | Account ID (Aws) / Project ID (Gcp)              |

### SubAssessmentStatus

Status of the sub-assessment

| **Name** | **Type** | **Description**|
| --------------------------- | --------------- | ------------------------------------------------ |
| cause | String |  Programmatic code for the cause of the assessment status |
| code | SubAssessmentStatusCode | Programmatic code for the status of the assessment|
| description | string | Human readable description of the assessment status |
| severity | severity | The sub-assessment severity level |

### SubAssessmentStatusCode

Programmatic code for the status of the assessment

| **Name** | **Type** | **Description**|
| --------------------------- | --------------- | ------------------------------------------------ |
| Healthy | string | The resource is healthy |
| NotApplicable | string | Assessment for this resource didn't happen |
| Unhealthy | string | The resource has a security issue that needs to be addressed |

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
| properties.resourceDetails | ResourceDetails: <br> [Azure Resource Details](subassessment-rest-api.md#resourcedetails---azure) <br> [AWS/GCP Resource Details](subassessment-rest-api.md#resourcedetails---aws--gcp) | Details of the resource that was assessed           |
| properties.status          | [SubAssessmentStatus](subassessment-rest-api.md#subassessmentstatus) | Status of the subassessment                        |
| properties.timeGenerated   | string                                                       | The date and time the subassessment was generated  |
| type                       | string                                                       | Resource type                                       |

### SecuritySubAssessmentList

List of security subassessments

| **Name** | **Type**                                                     | **Description**                       |
| -------- | ------------------------------------------------------------ | ------------------------------------- |
| nextLink | string                                                       | The URI to fetch the next page.       |
| value    | [SecuritySubAssessment](/rest/api/defenderforcloud/sub-assessments/list?tabs=HTTP#securitysubassessment) | Security subassessment on a resource |
