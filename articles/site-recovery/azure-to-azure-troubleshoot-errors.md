---
title: Troubleshoot Azure VM replication in Azure Site Recovery - other issues
description: Troubleshoot errors when replicating Azure virtual machines for disaster recovery.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: As a cloud administrator, I want to troubleshoot Azure VM replication errors in Site Recovery so that I can ensure reliable disaster recovery and maintain operational continuity for my organization's virtual machines.
---

# Troubleshoot Azure-to-Azure VM replication errors - other issues

This article describes how to troubleshoot common errors in Azure Site Recovery during replication and recovery of [Azure virtual machines](azure-to-azure-tutorial-enable-replication.md) (VM) from one region to another. For more information about supported configurations, see the [support matrix for replicating Azure VMs](azure-to-azure-support-matrix.md).

## Azure resource quota issues (error code 150097)

Make sure your subscription is enabled to create Azure VMs in the target region that you plan to use as your disaster recovery (DR) region. Your subscription needs sufficient quota to create VMs of the necessary sizes. By default, Site Recovery chooses a target VM size that's the same as the source VM size. If the matching size isn't available, Site Recovery automatically chooses the closest available size.

If there's no size that supports the source VM configuration, the following message is displayed:

```Output
Replication couldn't be enabled for the virtual machine <VmName>.
```

**Possible causes**

- Your subscription ID isn't enabled to create any VMs in the target region location.
- Your subscription ID isn't enabled, or doesn't have sufficient quota, to create specific VM sizes in the target region location.
- No suitable target VM size is found to match the source VM's network interface card (NIC) count (2), for the subscription ID in the target region location.

**Workaround**

Contact [Azure billing support](/azure/azure-portal/supportability/regional-quota-requests) to enable your subscription to create VMs of the required sizes in the target location. Then retry the failed operation.

If the target location has a capacity constraint, disable replication to that location. Then, enable replication to a different location where your subscription has sufficient quota to create VMs of the required sizes.

## Trusted root certificates (error code 151066)

If not all the latest trusted root certificates are present on the VM, your job to enable replication for Site Recovery might fail. Authentication and authorization of Site Recovery service calls from the VM fail without these certificates.

If the enable replication job fails, the following message is displayed:

```Output
Site Recovery configuration failed.
```

**Possible cause**

The trusted root certificates required for authorization and authentication aren't present on the virtual machine.

**Workaround**

# [Windows](#tab/windows)

For a VM running the Windows operating system, install the latest Windows updates so that all the trusted root certificates are present on the VM. Follow the typical Windows update management or certificate update management process in your organization to get the latest root certificates and the updated certificate revocation list on the VMs.

- If you're in a disconnected environment, follow the standard Windows update process in your organization to get the certificates.
- If the required certificates aren't present on the VM, the calls to the Site Recovery service fail for security reasons.

To verify that the issue is resolved, go to `login.microsoftonline.com` from a browser in your VM.

For more information, see [Configure trusted roots and disallowed certificates](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn265983(v=ws.11)).

# [Linux](#tab/linux)

Follow the guidance provided by the distributor of your Linux operating system version to get the latest trusted root certificates and the latest certificate revocation list on the VM.

> [!IMPORTANT]
> For RedHat Linux machines, add the Ca -Trust certificates to the `/etc/pki/ca-trust/` to avoid certificate errors.

Because SUSE Linux uses symbolic links, or symlinks, to maintain a certificate list, follow these steps:

1. Sign in as a **root** user. The hash symbol (`#`) is the default command prompt.

1. To change the directory, run this command:

   `cd /etc/ssl/certs`

1. Check whether the Symantec root CA certificate is present:

   `ls VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem`

   - If the Symantec root CA certificate isn't found, run the following command to download the file. Check for any errors and follow recommended actions for network failures.

     `wget https://docs.broadcom.com/docs-and-downloads/content/dam/symantec/docs/other-resources/verisign-class-3-public-primary-certification-authority-g5-en.pem -O VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem`

1. Check whether the Baltimore root CA certificate is present:

   `ls Baltimore_CyberTrust_Root.pem`

   - If the Baltimore root CA certificate isn't found, run this command to download the certificate:

     `wget https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem -O Baltimore_CyberTrust_Root.pem`

1. Check whether the DigiCert_Global_Root_CA certificate is present:

   `ls DigiCert_Global_Root_CA.pem`

    - If the DigiCert_Global_Root_CA isn't found, run the following commands to download the certificate:

      ```shell
      wget http://www.digicert.com/CACerts/DigiCertGlobalRootCA.crt

      openssl x509 -in DigiCertGlobalRootCA.crt -inform der -outform pem -out DigiCert_Global_Root_CA.pem
      ```

1. To update the certificate subject hashes for the newly downloaded certificates, run the rehash script:

   `c_rehash`

1. To check whether the subject hashes as symlinks were created for the certificates, run these commands:

   ```shell
   ls -l | grep Baltimore
   ```

   ```Output
   lrwxrwxrwx 1 root root   29 Jan  8 09:48 3ad48a91.0 -> Baltimore_CyberTrust_Root.pem

   -rw-r--r-- 1 root root 1303 Jun  5  2014 Baltimore_CyberTrust_Root.pem
   ```

   ```shell
   ls -l | grep VeriSign_Class_3_Public_Primary_Certification_Authority_G5
   ```

   ```Output
   -rw-r--r-- 1 root root 1774 Jun  5  2014 VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem

   lrwxrwxrwx 1 root root   62 Jan  8 09:48 facacbc6.0 -> VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem
   ```

   ```shell
   ls -l | grep DigiCert_Global_Root
   ```

   ```Output
   lrwxrwxrwx 1 root root   27 Jan  8 09:48 399e7759.0 -> DigiCert_Global_Root_CA.pem

   -rw-r--r-- 1 root root 1380 Jun  5  2014 DigiCert_Global_Root_CA.pem
   ```

1. Create a copy of the file _VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem_ with filename _b204d74a.0_:

   `cp VeriSign_Class_3_Public_Primary_Certification_Authority_G5.pem b204d74a.0`

1. Create a copy of the file _Baltimore_CyberTrust_Root.pem_ with filename _653b494a.0_:

   `cp Baltimore_CyberTrust_Root.pem 653b494a.0`

1. Create a copy of the file _DigiCert_Global_Root_CA.pem_ with filename _3513523f.0_:

   `cp DigiCert_Global_Root_CA.pem 3513523f.0`

1. Check that the files are present:

   ```shell
   ls -l 653b494a.0 b204d74a.0 3513523f.0
   ```

   ```Output
   -rw-r--r-- 1 root root 1774 Jan  8 09:52 3513523f.0

   -rw-r--r-- 1 root root 1303 Jan  8 09:52 653b494a.0

   -rw-r--r-- 1 root root 1774 Jan  8 09:52 b204d74a.0
   ```
---

## Outbound URLs or IP ranges (error code 151037 or 151072)

For Site Recovery replication to work, outbound connectivity to specific URLs is required from the VM. If your VM is behind a firewall or uses network security group (NSG) rules to control outbound connectivity, you might face one of these issues. While we continue to support outbound access via URLs, using an allowlist of IP ranges is no longer supported.

**Possible causes**

- A connection can't be established to Site Recovery endpoints because of a Domain Name System (DNS) resolution failure.
- This problem is more common during reprotection when you have failed over the virtual machine but the DNS server isn't reachable from the disaster recovery (DR) region.

**Workaround**

If you're using custom DNS, make sure that the DNS server is accessible from the disaster recovery region.

To check if the VM uses a custom DNS setting:

1. Open **Virtual machines** and select the VM.
1. Navigate to the VMs **Settings** and select **Networking**.
1. In **Virtual network/subnet**, select the link to open the virtual network's resource page.
1. Go to **Settings** and select **DNS servers**.

Try to access the DNS server from the virtual machine. If the DNS server isn't accessible, make it accessible by either failing over the DNS server or creating the line of site between DR network and DNS.

> [!NOTE]
> If you use private endpoints, ensure that the VMs can resolve the private DNS records.

:::image type="content" source="./media/azure-to-azure-troubleshoot-errors/custom_dns.png" alt-text="com-error.":::

## Issue 2: Site Recovery configuration failed (151196)

**Possible cause**

A connection can't be established to Microsoft 365 authentication and identity IP4 endpoints.

**Workaround**

Azure Site Recovery required access to Microsoft 365 IP ranges for authentication.
If you're using Azure Network Security Group (NSG) rules/firewall proxy to control outbound network connectivity on the VM, ensure that you use [Microsoft Entra service tag](../virtual-network/network-security-groups-overview.md#service-tags) based NSG rule for allowing access to Microsoft Entra ID. We no longer support IP address-based NSG rules.

## Issue 3: Site Recovery configuration failed (151197)

**Possible cause**

A connection can't be established to Azure Site Recovery service endpoints.

**Workaround**

If you're using Azure Network Security Group (NSG) rules/firewall proxy to control outbound network connectivity on the VM, ensure that you use service tags. We no longer support using an allowlist of IP addresses via NSGs for Azure Site Recovery.

## Issue 4: Replication fails when network traffic uses on-premises proxy server (151072)

**Possible cause**

The custom proxy settings are invalid and the Mobility service agent didn't autodetect the proxy settings from Internet Explorer.

**Workaround**

1. The Mobility service agent detects the proxy settings from Internet Explorer on Windows and `/etc/environment` on Linux.
1. If you prefer to set proxy only for the Mobility service, then you can provide the proxy details in _ProxyInfo.conf_ located at:

   - **Linux**: `/usr/local/InMage/config/`
   - **Windows**: `C:\ProgramData\Microsoft Azure Site Recovery\Config`

1. The _ProxyInfo.conf_ should have the proxy settings in the following _INI_ format.

   ```plaintext
   [proxy]
   Address=http://1.2.3.4
   Port=567
   ```

> [!NOTE]
> The Mobility service agent only supports **unauthenticated proxies**.

### More information

To specify the [required URLs](azure-to-azure-about-networking.md#outbound-connectivity-for-urls) or the [required IP ranges](azure-to-azure-about-networking.md#outbound-connectivity-using-service-tags), follow the guidance in [About networking in Azure to Azure replication](azure-to-azure-about-networking.md).

## COM+ or VSS (error code 151025)

When the COM+ or Volume Shadow Copy Service (VSS) error occurs, the following message is displayed:

```Output
Site Recovery extension failed to install.
```

**Possible causes**

- The COM+ System Application service is disabled.
- The Volume Shadow Copy Service is disabled.

**Workaround**

Set the COM+ System Application and Volume Shadow Copy Service to automatic or manual startup mode.

1. Open the Services console in Windows.
1. Make sure the COM+ System Application and Volume Shadow Copy Service aren't set to **Disabled** as their **Startup Type**.

   :::image type="content" source="./media/azure-to-azure-troubleshoot-errors/com-error.png" alt-text="Check startup type of COM plus System Application and Volume Shadow Copy Service.":::

## Unsupported managed-disk size (error code 150172)

When this error occurs, the following message is displayed:

```Output
Protection couldn't be enabled for the virtual machine as it has <DiskName> with size <DiskSize> that is lesser than the minimum supported size 1024 MB.
```

**Possible cause**

The disk is smaller than the supported size of 1024 MB.

**Workaround**

Make sure that the disk size is within the supported size range, and then retry the operation.

## Mobility service update finished with warnings (error code 151083)

The Site Recovery Mobility service has many components, one of which is called the filter driver. The filter driver is loaded into system memory only during system restart. Whenever a Mobility service update includes filter driver changes, the machine is updated but you still see a warning that some fixes require a restart. The warning appears because the filter driver fixes can take effect only when the new filter driver is loaded, which happens only during a restart.

> [!NOTE]
> This is only a warning. The existing replication continues to work even after the new agent update. You can choose to restart whenever you want the benefits of the new filter driver, but the old filter driver keeps working if you don't restart.
>
> Apart from the filter driver, the benefits of any other enhancements and fixes in the Mobility service update take effect without requiring a restart.

## Protection not enabled if replica managed disk exists

This error occurs when the replica managed disk already exists, without expected tags, in the target resource group.

### Possible cause

This problem can occur if the virtual machine was previously protected, and when replication was disabled, the replica disk wasn't removed.

### Fix the problem

Delete the replica disk identified in the error message and retry the failed protection job.

## Enable protection failed as the installer is unable to find the root disk (error code 151137)

This error occurs for Linux machines where the OS disk is encrypted using Azure Disk Encryption (ADE). This is a valid issue in Agent version 9.35 only.

### Possible Causes

The installer is unable to find the root disk that hosts the root file-system.

### Fix the problem

Perform the following steps to fix this issue.

1. Find the agent bits under the directory _/var/lib/waagent_ on RHEL machines using the below command: <br>

	`# find /var/lib/ -name Micro\*.gz`

   Expected output:

	`/var/lib/waagent/Microsoft.Azure.RecoveryServices.SiteRecovery.LinuxRHEL7-1.0.0.9139/UnifiedAgent/Microsoft-ASR_UA_9.35.0.0_RHEL7-64_GA_30Jun2020_release.tar.gz`

2. Create a new directory and change the directory to this new directory.
3. Extract the Agent file found in the first step here, using the below command:

    `tar -xf <Tar Ball File>`

4. Open the file _prereq_check_installer.json_ and delete the following lines. Save the file after that.

    ```
       {
          "CheckName": "SystemDiskAvailable",
          "CheckType": "MobilityService"
       },
    ```
5. Invoke the installer using the command: <br>

    `./install -d /usr/local/ASR -r MS -q -v Azure`
6. If the installer succeeds, retry the enable replication job.

## ProtectionContainerNameLengthExceeded (error code 150257)

```Output
Protection container name <protectionContainerName> is not valid.
```

### Possible causes

Protection container name exceeds the maximum permissible length of **protectionContainerNameMaxLength** characters.

### Fix the problem

Choose a different name and reattempt the operation.

## Troubleshoot and handle time changes on replicated servers

This error occurs when the source machine's time moves forward and then moves back in short time, to correct the change. You may not notice the change as the time is corrected very quickly.

**Workaround**
To resolve this issue, wait till system time crosses the skewed future time. Another option is to disable and enable replication once again, which is only feasible for forward replication (data replicated from primary to secondary region) and is not applicable for reverse replication (data replicated from secondary to primary region). 

## Next steps

[Replicate Azure VMs to another Azure region](azure-to-azure-how-to-enable-replication.md).
