---
title: How to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc
description: Learn how to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc.
ms.date: 05/22/2024
ms.topic: conceptual
---

# Troubleshoot delivery of Extended Security Updates for Windows Server 2012

This article provides information on troubleshooting and resolving issues that may occur while [enabling Extended Security Updates for Windows Server 2012 and Windows Server 2012 R2 through Arc-enabled servers](deliver-extended-security-updates.md).

## License provisioning issues

If you're unable to provision a Windows Server 2012 Extended Security Update license for Azure Arc-enabled servers, check the following:

- **Permissions:** Verify you have sufficient permissions (Contributor role or higher) within the scope of ESU provisioning and linking.  

- **Core minimums:** Verify you have specified sufficient cores for the ESU License. Physical core-based licenses require a minimum of 16 cores per machine, and virtual core-based licenses require a minimum of 8 cores per virtual machine (VM). 

- **Conventions:** Verify you have selected an appropriate subscription and resource group and provided a unique name for the ESU license.     

## ESU enrollment issues

If you're unable to successfully link your Azure Arc-enabled server to an activated Extended Security Updates license, verify the following conditions are met:

- **Connectivity:** Azure Arc-enabled server is **Connected**. For information about viewing the status of Azure Arc-enabled machines, see [Agent status](overview.md#agent-status).

- **Agent version:** Connected Machine agent is version 1.34 or higher. If the agent version is less than 1.34, you need to update it to this version or higher.

- **Operating system:** Only Azure Arc-enabled servers running the Windows Server 2012 and 2012 R2 operating system are eligible to enroll in Extended Security Updates.

- **Environment:** The connected machine should not be running on Azure Stack HCI, Azure VMware solution (AVS), or as an Azure virtual machine. **In these scenarios, WS2012 ESUs are available for free**. For information about no-cost ESUs through Azure Stack HCI, see [Free Extended Security Updates through Azure Stack HCI](/azure-stack/hci/manage/azure-benefits-esu?tabs=windows-server-2012).

- **License properties:** Verify the license is activated and has been allocated sufficient physical or virtual cores to support the intended scope of servers.

## Resource providers

If you're unable to enable this service offering, review the resource providers registered on the subscription as noted below. If you receive an error while attempting to register the resource providers, validate the role assignment/s on the subscription. Also review any potential Azure policies that may be set with a Deny effect, preventing the enablement of these resource providers.

- **Microsoft.HybridCompute:** This resource provider is essential for Azure Arc-enabled servers, allowing you to onboard and manage on-premises servers in the Azure portal.

- **Microsoft.GuestConfiguration:** Enables Guest Configuration policies, which are used to assess and enforce configurations on your Arc-enabled servers for compliance and security.

- **Microsoft.Compute:** This resource provider is required for Azure Update Management, which is used to manage updates and patches on your on-premises servers, including ESU updates.

- **Microsoft.Security:** Enabling this resource provider is crucial for implementing security-related features and configurations for both Azure Arc and on-premises servers.

- **Microsoft.OperationalInsights:** This resource provider is associated with Azure Monitor and Log Analytics, which are used for monitoring and collecting telemetry data from your hybrid infrastructure, including on-premises servers.

- **Microsoft.Sql:** If you're managing on-premises SQL Server instances and require ESU for SQL Server, enabling this resource provider is necessary.

- **Microsoft.Storage:** Enabling this resource provider is important for managing storage resources, which may be relevant for hybrid and on-premises scenarios.

## ESU patch issues

### ESU patch status

To detect whether your Azure Arc-enabled servers are patched with the most recent Windows Server 2012/R2 Extended Security Updates, use Azure Update Manager or the Azure Policy [Extended Security Updates should be installed on Windows Server 2012 Arc machines-Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F14b4e776-9fab-44b0-b53f-38d2458ea8be/version~/null/scopes~/%5B%22%2Fsubscriptions%2F4fabcc63-0ec0-4708-8a98-04b990085bf8%22%5D), which checks whether the most recent WS2012 ESU patches have been received. Both of these options are available at no additional cost for Azure Arc-enabled servers enrolled in WS2012 ESUs enabled by Azure Arc. 

### ESU prerequisites

Ensure that both the licensing package and servicing stack update (SSU) are downloaded for the Azure Arc-enabled server as documented at [KB5031043: Procedure to continue receiving security updates after extended support has ended on October 10, 2023](https://support.microsoft.com/topic/kb5031043-procedure-to-continue-receiving-security-updates-after-extended-support-has-ended-on-october-10-2023-c1a20132-e34c-402d-96ca-1e785ed51d45). Ensure you are following all of the networking prerequisites as recorded at [Prepare to deliver Extended Security Updates for Windows Server 2012](prepare-extended-security-updates.md?tabs=azure-cloud#networking).

### Error: Trying to check IMDS again (HRESULT 12002 or 12029)

If installing the Extended Security Update enabled by Azure Arc fails with errors such as "ESU: Trying to Check IMDS Again LastError=HRESULT_FROM_WIN32(12029)" or "ESU: Trying to Check IMDS Again LastError=HRESULT_FROM_WIN32(12002)", you may need to update the intermediate certificate authorities trusted by your computer using one of the following methods.

> [!IMPORTANT]
> If you're running the [latest version of the Azure Connected machine agent](agent-release-notes.md), it's not necessary to install the intermediate CA certificates or allow access to the PKI URL.

#### Option 1: Allow access to the PKI URL

Configure your network firewall and/or proxy server to allow access from the Windows Server 2012 (R2) machines to `http://www.microsoft.com/pkiops/certs` and `https://www.microsoft.com/pkiops/certs` (both TCP 80 and 443). This will enable the machines to automatically retrieve any missing intermediate CA certificates from Microsoft.

Once the network changes are made to allow access to the PKI URL, try installing the Windows updates again. You may need to reboot your computer for the automatic installation of certificates and validation of the license to take effect.

#### Option 2: Manually download and install the intermediate CA certificates

If you're unable to allow access to the PKI URL from your servers, you can manually download and install the certificates on each machine.

1. On any computer with internet access, download these intermediate CA certificates:
    1. [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001%20-%20xsign.crt)
    1. [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002%20-%20xsign.crt)
    1. [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005%20-%20xsign.crt)
    1. [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006%20-%20xsign.crt)
    1. [Microsoft Azure RSA TLS Issuing CA 04](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20RSA%20TLS%20Issuing%20CA%2004%20-%20xsign.crt)
1. Copy the certificate files to your Windows Server 2012 (R2) machines.
1. Run any one set of the following commands in an elevated command prompt or PowerShell session to add the certificates to the "Intermediate Certificate Authorities" store for the local computer. The command should be run from the same directory as the certificate files. The commands are idempotent and won't make any changes if you've already imported the certificate:

    ```
    certutil -addstore CA "Microsoft Azure TLS Issuing CA 01 - xsign.crt"
    certutil -addstore CA "Microsoft Azure TLS Issuing CA 02 - xsign.crt"
    certutil -addstore CA "Microsoft Azure TLS Issuing CA 05 - xsign.crt"
    certutil -addstore CA "Microsoft Azure TLS Issuing CA 06 - xsign.crt"
    certutil -addstore CA "Microsoft Azure RSA TLS Issuing CA 04 - xsign.crt"
    ```

1. Try installing the Windows updates again. You may need to reboot your computer for the validation logic to recognize the newly imported intermediate CA certificates.

### Error: Not eligible (HRESULT 1633)

If you encounter the error "ESU: not eligible HRESULT_FROM_WIN32(1633)", follow these steps:

```powershell
Remove-Item "$env:ProgramData\AzureConnectedMachineAgent\Certs\license.json" -Force
Restart-Service himds
```

If you have other issues receiving ESUs after successfully enrolling the server through Arc-enabled servers, or you need additional information related to issues affecting ESU deployment, see [Troubleshoot issues in ESU](/troubleshoot/windows-client/windows-7-eos-faq/troubleshoot-extended-security-updates-issues).
