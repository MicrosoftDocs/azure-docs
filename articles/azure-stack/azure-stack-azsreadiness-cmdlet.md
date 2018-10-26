---
title:    Start-AzsReadinessChecker cmdlet reference | Microsoft Docs
description: PowerShell cmdlet help for the Azure Stack Readiness Checker module.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/26/2018
ms.author: sethm
ms.reviewer:

---

# Start-AzsReadinessChecker cmdlet reference

Module: Microsoft.AzureStack.ReadinessChecker

This module only contains a single cmdlet.  This cmdlet performs one or more pre-deployment or pre-servicing functions for Azure Stack.

## Syntax
```PowerShell
Start-AzsReadinessChecker
       [-CertificatePath <String>]
       -PfxPassword <SecureString>
       -RegionName <String>
       -FQDN <String>
       -IdentitySystem <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       [-CertificatePath <String>]
       -PfxPassword <SecureString>
       -DeploymentDataJSONPath <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -PaaSCertificates <Hashtable>
       -DeploymentDataJSONPath <String>
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -PaaSCertificates <Hashtable>
       -RegionName <String>
       -FQDN <String>
       -IdentitySystem <String>
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -RegionName <String>
       -FQDN <String>
       -IdentitySystem <String>
       -Subject <OrderedDictionary>
       -RequestType <String>
       [-IncludePaaS]
       -OutputRequestPath <String>
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -PfxPassword <SecureString>
       -PfxPath <String>
       -ExportPFXPath <String>
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```


```PowerShell
Start-AzsReadinessChecker
       -AADServiceAdministrator <PSCredential>
       -AADDirectoryTenantName <String>
       -IdentitySystem <String>
       -AzureEnvironment <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -AADServiceAdministrator <PSCredential>
       -DeploymentDataJSONPath <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -RegistrationAccount <PSCredential>
       -RegistrationSubscriptionID <Guid>
       -AzureEnvironment <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -RegistrationAccount <PSCredential>
       -RegistrationSubscriptionID <Guid>
       -DeploymentDataJSONPath <String>
       [-CleanReport]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```

```PowerShell
Start-AzsReadinessChecker
       -ReportPath <String>
       [-ReportSections <String>]
       [-Summary]
       [-OutputPath <String>]
       [-WhatIf]
       [-Confirm]
       [<CommonParameters>]
```





 ## Description
The **Start-AzsReadinessChecker** cmdlet validates certificates, Azure accounts, Azure subscriptions, and Azure Active Directories. Run validation before deploying Azure Stack, or before Azure Stack servicing actions like Secret Rotation. The cmdlet can also be used to generate Certificate Signing Requests for infrastructure certificates and optionally PaaS certificates.  Finally, the cmdlet can repackage PFX certificates to remediate common packaging issues.

## Examples
**Example: Generate Certificate Signing Request**

```PowerShell
$regionName = 'east'
$externalFQDN = 'azurestack.contoso.com'
$subjectHash = [ordered]@{"OU"="AzureStack";"O"="Microsoft";"L"="Redmond";"ST"="Washington";"C"="US"}
Start-AzsReadinessChecker -regionName $regionName -externalFQDN $externalFQDN -subject $subjectHash -IdentitySystem ADFS -requestType MultipleCSR
```

In this example, Start-AzsReadinessChecker generates multiple Certificate Signing Requests (CSR) for certificates suitable for an ADFS Azure Stack deployment with a region name of “east” and an external FQDN of “azurestack.contoso.com”

**Example: Validate certificates**
```PowerShell
$password = Read-Host -Prompt "Enter PFX Password" -AsSecureString
Start-AzsReadinessChecker -CertificatePath .\Certificates\ -PfxPassword $password -RegionName east -FQDN azurestack.contoso.com -IdentitySystem AAD
```

In this example, the PFX password is prompted for securely and Start-AzsReadinessChecker checks the relative folder “Certificates” for certificates valid for an AAD deployment with a region name of “east” and an external FQDN of “azurestack.contoso.com” 

**Example: Validate certificates with deployment data (deployment and support)**
```PowerShell
$password = Read-Host -Prompt "Enter PFX Password" -AsSecureString
Start-AzsReadinessChecker -CertificatePath .\Certificates\ -PfxPassword $password -DeploymentDataJSONPath .\deploymentdata.json
```
In this deployment and support example, the PFX password is prompted for securely and Start-AzsReadinessChecker checks the relative folder “Certificates” for certificates valid for a deployment where identity, region and external FQDN are read from the deployment data JSON file generated for deployment. 

**Example: Validate PaaS certificates**
```PowerShell
$PaaSCertificates = @{
    'PaaSDBCert' = @{'pfxPath' = '<Path to DBAdapter PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSDefaultCert' = @{'pfxPath' = '<Path to Default PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSAPICert' = @{'pfxPath' = '<Path to API PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSFTPCert' = @{'pfxPath' = '<Path to FTP PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSSSOCert' = @{'pfxPath' = '<Path to SSO PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
}
Start-AzsReadinessChecker -PaaSCertificates $PaaSCertificates – RegionName east -FQDN azurestack.contoso.com
```

In this example, a hashtable is constructed with paths and passwords to each PaaS certificate. Certificates can be omitted. Start-AzsReadinessChecker checks each PFX Path exists and validates them using the region ‘east’ and external FQDN ‘azurestack.contoso.com’.

**Example: Validate PaaS certificates with deployment data**
```PowerShell
$PaaSCertificates = @{
    'PaaSDBCert' = @{'pfxPath' = '<Path to DBAdapter PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSDefaultCert' = @{'pfxPath' = '<Path to Default PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSAPICert' = @{'pfxPath' = '<Path to API PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSFTPCert' = @{'pfxPath' = '<Path to FTP PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
    'PaaSSSOCert' = @{'pfxPath' = '<Path to SSO PFX>';'pfxPassword' = (ConvertTo-SecureString -String '<Password for PFX>' -AsPlainText -Force)}
}
Start-AzsReadinessChecker -PaaSCertificates $PaaSCertificates -DeploymentDataJSONPath .\deploymentdata.json
```

In this example, a hashtable is constructed with paths and passwords to each PaaS certificate. Certificates can be omitted. Start-AzsReadinessChecker checks each PFX Path exists and validates them using the region and external FQDN read from the deployment data JSON file generated for deployment. 

**Example: Validate Azure identity**
```PowerShell
$serviceAdminCredential = Get-Credential -Message "Enter Credentials for Service Administrator of Azure Active Directory Tenant e.g. serviceadmin@contoso.onmicrosoft.com"
Start-AzsReadinessChecker -AADServiceAdministrator $serviceAdminCredential -AzureEnvironment AzureCloud -AzureDirectoryTenantName azurestack.contoso.com
```

In this example, the Service Admin account credentials are prompted for securely and Start-AzsReadinessChecker checks the Azure account and Azure Active Directory are valid for an AAD deployment with a tenant directory name of “azurestack.contoso.com”


**Example: Validate Azure identity with deployment data (deployment support)**
```PowerSHell
$serviceAdminCredential = Get-Credential -Message "Enter Credentials for Service Administrator of Azure Active Directory Tenant e.g. serviceadmin@contoso.onmicrosoft.com"
Start-AzsReadinessChecker -AADServiceAdministrator $serviceAdminCredential -DeploymentDataJSONPath .\contoso-depploymentdata.json
```

In this example, the Service Admin account credentials are prompted for securely and Start-AzsReadinessChecker checks the Azure account and Azure Active Directory are valid for an AAD deployment where AzureCloud and TenantName are read from the deployment data JSON file generated for the deployment.


**Example: Validate Azure registration**
```PowerShell
$registrationCredential = Get-Credential -Message "Enter Credentials for Subscription Owner"e.g. subscriptionowner@contoso.onmicrosoft.com"
$subscriptionID = "f7c26209-cd2d-4625-86ba-724ebeece794"
Start-AzsReadinessChecker -RegistrationAccount $registrationCredential -RegistrationSubscriptionID $subscriptionID -AzureEnvironment AzureCloud
```

In this example, the Subscription Owner credentials are prompted for securely and Start-AzsReadinessChecker then performs validation against the given account and subscription to ensure it can be used for Azure Stack registration. 


**Example: Validate Azure registration with deployment data (deployment team)**
```PowerShell
$registrationCredential = Get-Credential -Message "Enter Credentials for Subscription Owner"e.g. subscriptionowner@contoso.onmicrosoft.com"
$subscriptionID = "f7c26209-cd2d-4625-86ba-724ebeece794"
Start-AzsReadinessChecker -RegistrationAccount $registrationCredential -RegistrationSubscriptionID $subscriptionID -DeploymentDataJSONPath .\contoso-deploymentdata.json
```

In this example, the Subscription Owner credentials are prompted for securely and Start-AzsReadinessChecker then performs validation against the given account and subscription to ensure it can be used for Azure Stack registration where additional details are read from the deployment data JSON file generated for the deployment.

**Example: Import/Export PFX package**
```PowerShell
$password = Read-Host -Prompt "Enter PFX Password" -AsSecureString
Start-AzsReadinessChecker -PfxPassword $password -PfxPath .\certificates\ssl.pfx -ExportPFXPath .\certificates\ssl_new.pfx
```

In this example, the PFX password is prompted for securely. The ssl.pfx file will be imported into the local machine certificate store and re-exported with the same password and saved as ssl_new.pfx.  This procedure is for use when certificate validation flagged that a private key does not have the Local Machine attribute set, the certificate chain is broken, irrelevant certificates are present in the PFX or the certificate chain is in the wrong order.


**Example: View validation report (deployment support)**
```PowerShell
Start-AzsReadinessChecker -ReportPath Contoso-AzsReadinessReport.json
```

In this example, the deployment or support team receive the readiness report from the customer (Contoso) and use Start-AzsReadinessChecker to view the status of the validation executions Contoso performed.

**Example: View validation report summary for certificate validation only (deployment and support)**
```PowerShell
Start-AzsReadinessChecker -ReportPath Contoso-AzsReadinessReport.json -ReportSections Certificate -Summary
```

In this example, the deployment or support team receive the readiness report from the customer Contoso and use Start-AzsReadinessChecker to view a summarized status of the certificate validation executions Contoso performed.



## Required parameters
> -RegionName

Specifies the Azure Stack deployment's region name.
|  |  |
|----------------------------|--------------|
|Type:                       |String        |
|Position:                   |Named         |
|Default value:              |None          |
|Accept pipeline input:      |False         |
|Accept wildcard characters: |False         |

> -FQDN    

Specifies the Azure Stack deployment's external FQDN, also aliased as ExternalFQDN and ExternalDomainName.
|  |  |
|----------------------------|--------------|
|Type:                       |String        |
|Position:                   |Named         |
|Default value:              |ExternalFQDN, ExternalDomainName |
|Accept pipeline input:      |False         |
|Accept wildcard characters: |False         |

 

> -IdentitySystem    

Specifies the Azure Stack deployment's Identity System valid values, AAD or ADFS, for Azure Active Directory and Active Directory Federated Services respectively.
|  |  |
|----------------------------|--------------|
|Type:                       |String        |
|Position:                   |Named         |
|Default value:              |None          |
|Valid values:               |'AAD','ADFS'  |
|Accept pipeline input:      |False         |
|Accept wildcard characters: |False         |

> -PfxPassword    

Specifies the password associated with PFX certificate files.
|  |  |
|----------------------------|---------|
|Type:                       |SecureString |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -PaaSCertificates

Specifies the hashtable containing paths and passwords to PaaS Certificates.
|  |  |
|----------------------------|---------|
|Type:                       |Hashtable |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -DeploymentDataJSONPath

Specifies the Azure Stack deployment data JSON configuration file. This file is generated for deployment.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -PfxPath

Specifies the path to a problematic certificate that requires import/export routine to fix, as indicated by certificate validation in this tool.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -ExportPFXPath  

Specifies the destination path for the resultant PFX file from import/export routine.  
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -Subject

Specifies an ordered dictionary of the subject for the certificate request generation.
|  |  |
|----------------------------|---------|
|Type:                       |OrderedDictionary   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -RequestType

Specifies the SAN type of the certificate request. Valid values MultipleCSR, SingleCSR.
- *MultipleCSR* generates multiple certificate requests, one for each service.
- *SingleCSR* generates one certificate request for all services.   

|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Valid values:               |'MultipleCSR','SingleCSR' |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -OutputRequestPath

Specifies the destination path for certificate request files, directory must already exist.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -AADServiceAdministrator

Specifies Azure Active Directory Service Administrator to be used for Azure Stack deployment.
|  |  |
|----------------------------|---------|
|Type:                       |PSCredential   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -AADDirectoryTenantName

Specifies the Azure Active Directory name to be used for Azure Stack deployment.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -AzureEnvironment

Specifies the instance of Azure Services containing the accounts, directories, and subscriptions to be used for Azure Stack deployment and registration.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Valid values:               |'AzureCloud','AzureChinaCloud','AzureGermanCloud' |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -RegistrationAccount

Specifies the Registration Account to be used for Azure Stack registration.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -RegistrationSubscriptionID

Specifies the Registration Subscription ID to be used for Azure Stack registration.
|  |  |
|----------------------------|---------|
|Type:                       |Guid     |
|Position:                   |Named    |
|Default value:              |None     |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |

> -ReportPath

Specifies path for Readiness Report, defaults to current directory and default report name.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |All      |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |



## Optional parameters
> -CertificatePath     

Specifies the path under which only the certificate required certificate folders are present.

Required folders for Azure Stack deployment with Azure Active Directory identity system are:

ACSBlob, ACSQueue, ACSTable, Admin Portal, ARM Admin, ARM Public, KeyVault, KeyVaultInternal, Public Portal

Required folder for Azure Stack deployment with Active Directory Federation Services identity system are:

ACSBlob, ACSQueue, ACSTable, ADFS, Admin Portal, ARM Admin, ARM Public, Graph, KeyVault, KeyVaultInternal, Public Portal


|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |.\Certificates |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |


> -IncludePaaS  

Specifies if PaaS services/hostnames should be added to the certificate request(s).


|  |  |
|----------------------------|------------------|
|Type:                       |SwitchParameter   |
|Position:                   |Named             |
|Default value:              |False             |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |


> -ReportSections        

Specifies whether to only show report summary, omits detail.
|  |  |
|----------------------------|---------|
|Type:                       |String   |
|Position:                   |Named    |
|Default value:              |All      |
|Valid values:               |'Certificate','AzureRegistration','AzureIdentity','Jobs','All' |
|Accept pipeline input:      |False    |
|Accept wildcard characters: |False    |


> -Summary 

Specifies whether to only show report summary, omits detail.
|  |  |
|----------------------------|------------------|
|Type:                       |SwitchParameter   |
|Position:                   |Named             |
|Default value:              |False             |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |


> -CleanReport  

Removes previous execution and validation history and writes validations to a new report.
|  |  |
|----------------------------|------------------|
|Type:                       |SwitchParameter   |
|Aliases:                    |cf                |
|Position:                   |Named             |
|Default value:              |False             |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |


> -OutputPath    

Specifies custom path to save Readiness JSON report and verbose log file.  If the path does not already exist, the tool will attempt to create the directory.
|  |  |
|----------------------------|------------------|
|Type:                       |String            |
|Position:                   |Named             |
|Default value:              |$ENV:TEMP\AzsReadinessChecker  |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |


> -Confirm  

Prompts for confirmation before running the cmdlet.
|  |  |
|----------------------------|------------------|
|Type:                       |SwitchParameter   |
|Aliases:                    |cf                |
|Position:                   |Named             |
|Default value:              |False             |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |


> -WhatIf  

Shows what would happen if the cmdlet runs. The cmdlet is not run.
|  |  |
|----------------------------|------------------|
|Type:                       |SwitchParameter   |
|Aliases:                    |wi                |
|Position:                   |Named             |
|Default value:              |False             |
|Accept pipeline input:      |False             |
|Accept wildcard characters: |False             |

 
