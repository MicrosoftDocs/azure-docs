---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 09/12/2022
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure NetApp Files SMB Volumes should use SMB3 encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fddcf4b94-9dfa-4a80-aca6-22bb654fde72) |Disallow the creation of SMB Volumes without SMB3 encryption to ensure data integrity and data privacy. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ANF_SMBVolumesShouldUseSMB3Encryption.json) |
|[Azure NetApp Files Volumes of type NFSv4.1 should use Kerberos data encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c6c7139-7d8e-45d0-9d94-72386a61308b) |Only allow the use of Kerberos privacy (5p) security mode to ensure data is encrypted. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ANF_VolumesShouldUseKerberosEncryption.json) |
|[Azure NetApp Files Volumes of type NFSv4.1 should use Kerberos data integrity or data privacy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16f4af95-96b1-4220-805a-367ca59cd72e) |Ensure that at least either Kerberos integrity (krb5i) or Kerberos privacy (krb5p) is selected to ensure data integrity and data privacy. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ANF_VolumesShouldUseKerberosIntegrityPrivacy.json) |
|[Azure NetApp Files Volumes should not use NFSv3 protocol type](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd558e1a6-296d-4fbb-81a5-ea25822639f6) |Disallow the use of NFSv3 protocol type to prevent unsecure access to volumes. NFSv4.1 with Kerberos protocol should be used to access NFS volumes to ensure data integrity and encryption. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ANF_VolumesShouldNotUseNFSv3.json) |
