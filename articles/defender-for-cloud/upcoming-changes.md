---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 02/09/2022
---
# Important upcoming changes to Microsoft Defender for Cloud

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).


## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses](#deprecating-a-preview-alert-armmcas_activityfromanonymousipaddresses) | January 2022 |
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013) | January 2022 |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations) | February 2022 |
| [Deprecating the recommendation to use service principals to protect your subscriptions](#deprecating-the-recommendation-to-use-service-principals-to-protect-your-subscriptions) | February 2022 |
| [Deprecating the recommendations to install the network traffic data collection agent](#deprecating-the-recommendations-to-install-the-network-traffic-data-collection-agent) | February 2022 |
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions) | March 2022 |
| [AWS recommendations to GA](#aws-recommendations-to-ga) | March 2022 |
| [Relocation of custom recommendations](#relocation-of-custom-recommendations) | March 2022 |
| [Deprecate Microsoft Defender for IoT device recommendations](#deprecate-microsoft-defender-for-iot-device-recommendations) | March 2022 |
| [Deprecate Microsoft Defender for IoT device alerts](#deprecate-microsoft-defender-for-iot-device-alerts) | March 2022 |
### Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses

**Estimated date for change:** January 2022 

We'll be deprecating the following preview alert:

|Alert name| Description|
|----------------------|---------------------------|
|**PREVIEW - Activity from a risky IP address**<br>(ARM.MCAS_ActivityFromAnonymousIPAddresses)|Users activity from an IP address that has been identified as an anonymous proxy IP address has been detected.<br>These proxies are used by people who want to hide their device's IP address, and can be used for malicious intent. This detection uses a machine learning algorithm that reduces false positives, such as mis-tagged IP addresses that are widely used by users in the organization.<br>Requires an active Microsoft Defender for Cloud Apps license.|
|||

We've created new alerts that provide this information and add to it. In addition, the newer alerts (ARM_OperationFromSuspiciousIP, ARM_OperationFromSuspiciousProxyIP) don't require a license for Microsoft Defender for Cloud Apps (formerly known as Microsoft Cloud App Security).

### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

**Estimated date for change:** January 2022 

The legacy implementation of ISO 27001 will be removed from Defender for Cloud's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Defender for Cloud, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Defender for Cloud's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::


### Multiple changes to identity recommendations

**Estimated date for change:** February 2022

Defender for Cloud includes multiple recommendations for improving the management of users and accounts. In December, we'll be making the changes outlined below.

- **Improved freshness interval** - Currently, the identity recommendations have a freshness interval of 24 hours. This update will reduce that interval to 12 hours.

- **Account exemption capability** - Defender for Cloud has many features for customizing the experience and making sure your secure score reflects your organization's security priorities. The exempt option on security recommendations is one such feature. For a full overview and instructions, see [Exempting resources and recommendations from your secure score](exempt-resource.md). With this update, you'll be able to exempt specific accounts from evaluation by the eight recommendations listed in the following table.

    Typically, you'd exempt emergency “break glass” accounts from MFA recommendations, because such accounts are often deliberately excluded from an organization's MFA requirements. Alternatively, you might have external accounts that you'd like to permit access to but which don't have MFA enabled.

    > [!TIP]
    > When you exempt an account, it won't be shown as unhealthy and also won't cause a subscription to appear  unhealthy.

    |Recommendation| Assessment key|
    |-|-|
    |[MFA should be enabled on accounts with owner permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/94290b00-4d0c-d7b4-7cea-064a9554e681)|94290b00-4d0c-d7b4-7cea-064a9554e681|
    |[MFA should be enabled on accounts with read permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/151e82c5-5341-a74b-1eb0-bc38d2c84bb5)|151e82c5-5341-a74b-1eb0-bc38d2c84bb5|
    |[MFA should be enabled on accounts with write permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/57e98606-6b1e-6193-0e3d-fe621387c16b)|57e98606-6b1e-6193-0e3d-fe621387c16b|
    |[External accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c3b6ae71-f1f0-31b4-e6c1-d5951285d03d)|c3b6ae71-f1f0-31b4-e6c1-d5951285d03d|
    |[External accounts with read permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b)|a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b|
    |[External accounts with write permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/04e7147b-0deb-9796-2e5c-0336343ceb3d)|04e7147b-0deb-9796-2e5c-0336343ceb3d|
    |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e52064aa-6853-e252-a11e-dffc675689c2)|e52064aa-6853-e252-a11e-dffc675689c2|
    |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00c6d40b-e990-6acf-d4f3-471e747a27c4)|00c6d40b-e990-6acf-d4f3-471e747a27c4|
    |||
 
- **Recommendations rename** - From this update, we're renaming two recommendations. We're also revising their descriptions. The assessment keys will remain unchanged. 


    |Property  |Current value  | From the update|
    |---------|---------|---------|
    |Assessment key     | e52064aa-6853-e252-a11e-dffc675689c2        | Unchanged|
    |Name     |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e52064aa-6853-e252-a11e-dffc675689c2)         |Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions        |
    |Description     |User accounts that have been blocked from signing in, should be removed from your subscriptions.<br>These accounts can be targets for attackers looking to find ways to access your data without being noticed.|User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed.<br>Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md).|
    |Related policy     |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2febb62a0c-3560-49e1-89ed-27e074e9f8ad)         |Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions |
    |||

    |Property  |Current value  | From the update|
    |---------|---------|---------|
    |Assessment key     | 00c6d40b-e990-6acf-d4f3-471e747a27c4        | Unchanged|
    |Name     |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00c6d40b-e990-6acf-d4f3-471e747a27c4)|Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions|
    |Description     |User accounts that have been blocked from signing in, should be removed from your subscriptions.<br>These accounts can be targets for attackers looking to find ways to access your data without being noticed.|User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed.<br>Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md).|
    |Related policy     |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6b1cbf55-e8b6-442f-ba4c-7246b6381474)|Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions|
    |||


### Deprecating the recommendation to use service principals to protect your subscriptions

**Estimated date for change:** February 2022

As organizations are moving away from using management certificates to manage their subscriptions, and [our recent announcement that we're retiring the Cloud Services (classic) deployment model](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/), we'll be deprecating the following Defender for Cloud recommendation and its related policy:

|Recommendation |Description |Severity |
|---|---|---|
|[Service principals should be used to protect your subscriptions instead of Management Certificates](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2acd365d-e8b5-4094-bce4-244b7c51d67c) |Management certificates allow anyone who authenticates with them to manage the subscription(s) they are associated with. To manage subscriptions more securely, using service principals with Resource Manager is recommended to limit the blast radius in the case of a certificate compromise. It also automates resource management. <br />(Related policy: [Service principals should be used to protect your subscriptions instead of management certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6646a0bd-e110-40ca-bb97-84fcee63c414)) |Medium |
|||

Learn more:

- [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)
- [Overview of Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md)
- [Workflow of Windows Azure classic VM Architecture - including RDFE workflow basics](../cloud-services/cloud-services-workflow-process.md)


### Deprecating the recommendations to install the network traffic data collection agent

**Estimated date for change:** February 2022

Changes in our roadmap and priorities have removed the need for the network traffic data collection agent. Consequently, we'll be deprecating the following two recommendations and their related policies.  

|Recommendation |Description |Severity |
|---|---|---|
|[Network traffic data collection agent should be installed on Linux virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8c3e93d3-0276-4d06-b20a-9a9f3012742c) |Defender for Cloud uses the Microsoft Dependency agent to collect network traffic data from your Azure virtual machines to enable advanced network protection features such as traffic visualization on the network map, network hardening recommendations and specific network threats.<br />(Related policy: [Network traffic data collection agent should be installed on Linux virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f04c4380f-3fae-46e8-96c9-30193528f602)) |Medium |
|[Network traffic data collection agent should be installed on Windows virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/24d8af06-d441-40b4-a49c-311421aa9f58) |Defender for Cloud uses the Microsoft Dependency agent to collect network traffic data from your Azure virtual machines to enable advanced network protection features such as traffic visualization on the network map, network hardening recommendations, and specific network threats.<br />(Related policy: [Network traffic data collection agent should be installed on Windows virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2f2ee1de-44aa-4762-b6bd-0893fc3f306d)) |Medium |
|||




### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** March 2022

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, see [the release note](release-notes.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines (key: 83f577bd-a1b6-b7e1-0891-12ca19d1e6df)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines (key: 383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)

- **Endpoint protection health issues should be resolved on your machines** will replace the existing recommendation that has the same name. The two recommendations have different assessment keys:
    - Assessment key for the **preview** recommendation: 37a3689a-818e-4a0e-82ac-b1392b9bb000
    - Assessment key for the **GA** recommendation: 3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a

Learn more:
- [Defender for Cloud's supported endpoint protection solutions](supported-machines-endpoint-solutions-clouds.md#endpoint-supported)
- [How these recommendations assess the status of your deployed solutions](endpoint-protection-recommendations-technical.md)

### AWS recommendations to GA

**Estimated date for change:** March 2022

There are currently AWS recommendations in the preview stage. These recommendations come from the AWS Foundational Security Best Practices standard which is assigned by default. All of the recommendations will become Generally Available (GA) in March 2022.

When these recommendations go live, their impact will be included in the calculations of your secure score. Expect changes to your secure score.

**To find these recommendations**:

1. Navigate to **Environment settings** > **`AWS connector`** > **Standards (preview)**.
1. Right click on **AWS Foundational Security Best Practices (preview)**, and select **view assessments**.

:::image type="content" source="media/release-notes/aws-foundational.png" alt-text="Screenshot showing the location of the AWS Foundational Security Best Practices (preview).":::

### Relocation of custom recommendations

**Estimated date for change:** March 2022

Custom recommendation are those created by a user, and have no impact on the secure score. Therefore, the custom recommendations are being relocated from the Secure score recommendations tab to the All recommendations tab.

When the move occurs, the custom recommendations will be found via a new "recommendation type" filter.

Learn more: 
- [Create custom security initiatives and policies](custom-security-policies.md).

### Deprecate Microsoft Defender for IoT device recommendations

**Estimated date for change:** March 2022 

Microsoft Defender for IoT device recommendations will no longer be visible in Microsoft Defender for Cloud. These recommendations will still be available on the Microsoft Defender for IoT's Recommendations page, and in Sentinel.

The following recommendation types will be deprecated:

| Recommendation | Description|
|--|--|
| 1a36f14a-8bd8-45f5-abe5-eef88d76ab5b: IoT Devices | Open Ports On Device |
| ba975338-f956-41e7-a9f2-7614832d382d: IoT Devices | Permissive firewall rule in the input chain was found |
| beb62be3-5e78-49bd-ac5f-099250ef3c7c: IoT Devices | Permissive firewall policy in one of the chains was found |
| d5a8d84a-9ad0-42e2-80e0-d38e3d46028a: IoT Devices | Permissive firewall rule in the output chain was found |
| 5f65e47f-7a00-4bf3-acae-90ee441ee876: IoT Devices | Operating system baseline validation failure |
|a9a59ebb-5d6f-42f5-92a1-036fd0fd1879: IoT Devices | Agent sending underutilized messages |
| 2acc27c6-5fdb-405e-9080-cb66b850c8f5: IoT Devices | TLS cipher suite upgrade needed |
|d74d2738-2485-4103-9919-69c7e63776ec: IoT Devices | Auditd process stopped sending events |

### Deprecate Microsoft Defender for IoT device alerts

**Estimated date for change:** March 2022 

Microsoft Defender for IoT device alerts will no longer be visible in Microsoft Defender for Cloud. These alerts will still be available on the Microsoft Defender for IoT's Alert page, and in Sentinel.

| Alert types | |  |  |
|--|--|--|--|
|IoT.Devices_ARPHostScanDetection|IoT.Devices_ASDUWhiteList|IoT.Devices_AccessingHtaccessFile|IoT.Devices_AddressRange|
|IoT.Devices_AgentDroppedEvents|IoT.Devices_AgentFailedToParseConfiguration|IoT.Devices_ApipaAddressDetection|IoT.Devices_AuthenticationErrorDetect|
|IoT.Devices_BackupDetection|IoT.Devices_BadMessageTypes|IoT.Devices_BinaryCommandLine|IoT.Devices_BlackEnergyMalware|
|IoT.Devices_BlackListExceptionCommand|IoT.Devices_BruteForceDetectionByLoginFailures|IoT.Devices_Bruteforce|IoT.Devices_BruteforceFail|
|IoT.Devices_BruteforceSuccess|IoT.Devices_BufferOverflowFunction|IoT.Devices_CertExpired|IoT.Devices_CertPrintMismatch|
|IoT.Devices_ChannelBandwidthWhitelist|IoT.Devices_ChannelBasedBruteforceDetection|IoT.Devices_ClearHistoryFile|IoT.Devices_ClientServerProgramWhiteList|
|IoT.Devices_ClientServerServiceTypeWhiteList|IoT.Devices_ColdRestartDetect|IoT.Devices_CommissioningRequirementDetection|IoT.Devices_CommonBots|
|IoT.Devices_ConfickerMalware|IoT.Devices_ConfigCorruptDetect|IoT.Devices_ConfigurationChangeDetect|IoT.Devices_CredentialAccessTools|
|IoT.Devices_CryptoMiner|IoT.Devices_CryptoMinerContainer|IoT.Devices_CustomActiveConnectionsNotInAllowedRange|IoT.Devices_CustomAmqpC2DMessagesNotInAllowedRange|
|IoT.Devices_CustomAmqpC2DRejectedMessagesNotInAllowedRange|IoT.Devices_CustomAmqpD2CMessagesNotInAllowedRange|IoT.Devices_CustomConnectionToIpNotAllowed|IoT.Devices_CustomDirectMethodInvokesNotInAllowedRange|
|IoT.Devices_CustomFailedLocalLoginsNotInAllowedRange|IoT.Devices_CustomFileUploadsNotInAllowedRange|IoT.Devices_CustomHttpC2DMessagesNotInAllowedRange|IoT.Devices_CustomHttpC2DRejectedMessagesNotInAllowedRange|
|IoT.Devices_CustomHttpD2CMessagesNotInAllowedRange|IoT.Devices_CustomLocalUserNotAllowed|IoT.Devices_CustomMqttC2DMessagesNotInAllowedRange|IoT.Devices_CustomMqttC2DRejectedMessagesNotInAllowedRange|
|IoT.Devices_CustomMqttD2CMessagesNotInAllowedRange|IoT.Devices_CustomProcessNotAllowed|IoT.Devices_CustomProtocolAlertHigh|IoT.Devices_CustomProtocolAlertLow|
|IoT.Devices_CustomProtocolAlertMedium|IoT.Devices_CustomQueuePurgesNotInAllowedRange|IoT.Devices_CustomTwinUpdatesNotInAllowedRange|IoT.Devices_CustomUnauthorizedOperationsNotInAllowedRange|
|IoT.Devices_DNSConfickerDetection|IoT.Devices_DarkCometMalware|IoT.Devices_DeprecatedSaveConfigDetect|IoT.Devices_DeviceFirmwareDetection|
|IoT.Devices_DeviceSilent|IoT.Devices_DeviceTroubleDetect|IoT.Devices_DisableAuditdLogging|IoT.Devices_DisableFirewall|
|IoT.Devices_DisconnectionSuspection|IoT.Devices_DownloadFileThenRun|IoT.Devices_DuquMalware|IoT.Devices_ENAPBadControlStatus|
|IoT.Devices_ENAPFirmwareWhiteList|IoT.Devices_EgressData|IoT.Devices_EicarTest|IoT.Devices_EmersonROCFirmwareVersionChanged|
|IoT.Devices_EmersonROCOperationsWhitelist|IoT.Devices_EndpointFilesWhitelist|IoT.Devices_ErrorResponseDetection|IoT.Devices_ErrorStatusDetection|
|IoT.Devices_EventBufferOverflowDetect|IoT.Devices_ExceptionDetection|IoT.Devices_ExcessiveARPMessaging|IoT.Devices_ExcessiveChannelMalformedDetection|
|IoT.Devices_ExcessiveColdRestart|IoT.Devices_ExcessiveDeviceRestart|IoT.Devices_ExcessiveExceptionsRate|IoT.Devices_ExcessiveICMPMessaging|
|IoT.Devices_ExcessiveStopAppl|IoT.Devices_ExecuteFileWithTrailingSpace|IoT.Devices_ExpiredSASToken|IoT.Devices_ExposedDocker|
|IoT.Devices_ExternalAddressesChannelDetection|IoT.Devices_FTPAuthenticationFailure|IoT.Devices_FailedLocalLogin|IoT.Devices_FairwareMalware|
|IoT.Devices_FirmwareUpdateDetection|IoT.Devices_FlameMalware|IoT.Devices_FuncCodeNotSupportedDetect|IoT.Devices_FunctionCodesRangeCheck|
|IoT.Devices_FunctionCodesWhiteListValidation|IoT.Devices_FutureUseReservedBits|IoT.Devices_GooseConfValidation|IoT.Devices_GooseSettingsWhiteList|
|IoT.Devices_HavexMalware|IoT.Devices_HorizonFirmwareScenario|IoT.Devices_HorizonWhitelistScenario_AMSIndexGroup|IoT.Devices_HorizonWhitelistScenario_AMSIndexOffset|
|IoT.Devices_HorizonWhitelistScenario_AMSProtocolCommand|IoT.Devices_HorizonWhitelistScenario_ASTMEndpoint|IoT.Devices_HorizonWhitelistScenario_ASTMSenderID|IoT.Devices_HorizonWhitelistScenario_CIPClass|
|IoT.Devices_HorizonWhitelistScenario_CIPClassService|IoT.Devices_HorizonWhitelistScenario_CIPPCCCCCommand|IoT.Devices_HorizonWhitelistScenario_CIPSymbol|IoT.Devices_HorizonWhitelistScenario_DeltaVMessageType|
|IoT.Devices_HorizonWhitelistScenario_DeltaVRemoteOperationsControllerOperation|IoT.Devices_HorizonWhitelistScenario_EtherNetIPIO|IoT.Devices_HorizonWhitelistScenario_EtherNetIPProtocolCommand|IoT.Devices_HorizonWhitelistScenario_FoxboroIA|
|IoT.Devices_HorizonWhitelistScenario_GESRTPFileAccess|IoT.Devices_HorizonWhitelistScenario_GESRTPProtocolCommand|IoT.Devices_HorizonWhitelistScenario_GESRTPSystemMemoryOperation|IoT.Devices_HorizonWhitelistScenario_GSMMessageCode|
|IoT.Devices_HorizonWhitelistScenario_HL7SendersInformation|IoT.Devices_HorizonWhitelistScenario_LonTalkCommandCodes|IoT.Devices_HorizonWhitelistScenario_LonTalkNetworkVariable|IoT.Devices_HorizonWhitelistScenario_MQIsdpPublishInformation|
|IoT.Devices_HorizonWhitelistScenario_MQIsdpSubscriptionInformation|IoT.Devices_HorizonWhitelistScenario_MitsubishiMELSECCommand|IoT.Devices_HorizonWhitelistScenario_OmronFINSCommand|IoT.Devices_HorizonWhitelistScenario_OvationDataRequest|
|IoT.Devices_HorizonWhitelistScenario_ProfinetFrameType|IoT.Devices_HorizonWhitelistScenario_RPCMessageType|IoT.Devices_HorizonWhitelistScenario_RPCProcedureInvocation|IoT.Devices_HorizonWhitelistScenario_SICAMCommand|
|IoT.Devices_HorizonWhitelistScenario_SuitelinkProtocolCommand|IoT.Devices_HorizonWhitelistScenario_SuitelinkProtocolSessions|IoT.Devices_HorizonWhitelistScenario_YokogawaVNetIPCommand|IoT.Devices_HostScansDetection|
|IoT.Devices_HttpAgentsWhitelist|IoT.Devices_HttpClientErrors|IoT.Devices_HttpHeaderDataValidation|IoT.Devices_HttpHeaderParametersCountWhitelist|
|IoT.Devices_HttpHeadersLengthWhitelist|IoT.Devices_HttpServersWhitelist|IoT.Devices_HttpUriSOAPWhitelist|IoT.Devices_HttpUriWhitelist|
|IoT.Devices_HttpWhiteListValidation|IoT.Devices_HwAddressWhitelist|IoT.Devices_IINWhiteList|IoT.Devices_IlegalSMBTransactionCommandSequence|
|IoT.Devices_IllegalASDUType|IoT.Devices_IllegalCOT|IoT.Devices_IllegalCommonAddress|IoT.Devices_IllegalDataAddressDetection|
|IoT.Devices_IllegalDataValueDetection|IoT.Devices_IllegalFunctionDetection|IoT.Devices_IllegalInformationObjectAddress|IoT.Devices_IllegalMessage|
|IoT.Devices_IllegalProtocolValue|IoT.Devices_IllegalSMBDetection|IoT.Devices_IllegalSMBParameterCount|IoT.Devices_IntegrityPollWhiteList|
|IoT.Devices_InternetConnectionValidation|IoT.Devices_InvalidIpValidation|IoT.Devices_InvalidSASToken|IoT.Devices_KaraganyMalware|
|IoT.Devices_KnownAttackTools|IoT.Devices_KnownServicesDetection|IoT.Devices_LightsoutMalware|IoT.Devices_LinuxBackdoor|
|IoT.Devices_LinuxReconnaissance|IoT.Devices_LocalUserAddedToGroupChange|IoT.Devices_LocalUserDeletedFromGroupChange|IoT.Devices_LocalUserWasDeleted|
|IoT.Devices_LongHostScansDetection|IoT.Devices_MMSServiceRequestFailed|IoT.Devices_MMSVMDPhysicalStatusError|IoT.Devices_MalewareDetected|
|IoT.Devices_MaliciousIpDetection|IoT.Devices_MaliciousNameQueriesDetection|IoT.Devices_MasterRequestConfirmation|IoT.Devices_MasterToSlaveWhiteList|
|IoT.Devices_MelsecFirmwareWhitelist|IoT.Devices_MisleadingFunctionCode|IoT.Devices_ModbusFirmwareChangesDetection|IoT.Devices_MultipleLoginFailuresDetection|
|IoT.Devices_NewCountryForExisitingDevice|IoT.Devices_NewIpForExistingDevice|IoT.Devices_NewLocalUser|IoT.Devices_NoBandwidthChannel|
|IoT.Devices_NonUnicastTrafficDetection|IoT.Devices_OPCEndPointsWhiteList|IoT.Devices_OPCUAHighSeverityEventDetection|IoT.Devices_OPCUARequestTypeWhiteList|
|IoT.Devices_OPCUAServiceRequestFailedDetection|IoT.Devices_ObjectServiceWhiteList|IoT.Devices_ObjectUnknownDetect|IoT.Devices_ObsoleteInitialDataCodeDetection|
|IoT.Devices_OperatingSystemProcessesPortsDetection|IoT.Devices_OperatingSystemServicesDetection|IoT.Devices_OracleOraDetection|IoT.Devices_OutgoingSMBConnection|
|IoT.Devices_OverrideLinuxFiles|IoT.Devices_PLCAddressScan|IoT.Devices_PLCConfigurationChange|IoT.Devices_PLCConfigurationRead|
|IoT.Devices_PLCProgrammUpload|IoT.Devices_PLCResetDetection|IoT.Devices_PLCStopDetection|IoT.Devices_PLCUpdateValidation|
|IoT.Devices_PMUConfigurationChange|IoT.Devices_ParamterErrorDetect|IoT.Devices_PasswordGuessAttemptDetection|IoT.Devices_PeriodicProcessesScenario|
|IoT.Devices_PoisonIvyMalware|IoT.Devices_PortForwarding|IoT.Devices_PortScansDetection|IoT.Devices_PortTrafficConfiguration|
|IoT.Devices_PossibleMalware|IoT.Devices_PrivilegedContainer|IoT.Devices_ProfinetDCPFailureCode|IoT.Devices_ProfinetDeviceFactoryReset|
|IoT.Devices_PropertiesChangeDetection|IoT.Devices_ProtocolAddressWhitelist|IoT.Devices_ProtocolOutstationViolation|IoT.Devices_PsExecDetection|
|IoT.Devices_RPCFaultRejectDetection|IoT.Devices_Ransomware|IoT.Devices_ReadHistoryFile|IoT.Devices_ReginMalware|
|IoT.Devices_RemoteLogin|IoT.Devices_RemovelOfSystemLogs|IoT.Devices_ReservedFunctionCode|IoT.Devices_ResponsiveInternetConnectionValidation|
|IoT.Devices_ReverseShell|IoT.Devices_RouteWhitelist|IoT.Devices_RuleEngineAlertsCreator|IoT.Devices_S7CommpOpcodeFuncClassWhiteList|
|IoT.Devices_S7FunctionWhitelist|IoT.Devices_S7PlusConfigurationOperationsWhiteList|IoT.Devices_S7PlusFirmwareChangesDetection|IoT.Devices_S7PlusProgramOperationsWhiteList|
|IoT.Devices_S7ReadVarWhitelist|IoT.Devices_S7StopPLCDetection|IoT.Devices_S7SubFuncWhitelist|IoT.Devices_SBusSAIAWhiteList|
|IoT.Devices_SMBLoginAccountWhiteList|IoT.Devices_SNMPDataVariableWhiteList|IoT.Devices_SQLCommandsWhitelist|IoT.Devices_SQLUsersWhitelist|
|IoT.Devices_SVConfValidation|IoT.Devices_SVSettingsWhiteList|IoT.Devices_ScriptInterpreterMismatch|IoT.Devices_ServiceResponseErrorStatusDetection|
|IoT.Devices_SprayAttack|IoT.Devices_StopPLCDetection|IoT.Devices_StuxnetMalware|IoT.Devices_SucessfulLocalLogin|
|IoT.Devices_SuitelinkTagNameWhiteList|IoT.Devices_SuspiciousCompilation|IoT.Devices_SuspiciousNohup|IoT.Devices_SuspiciousProcess|
|IoT.Devices_SuspiciousTraffic|IoT.Devices_SuspiciousUseradd|IoT.Devices_SvcctlDetection|IoT.Devices_SynFloodDetection|
|IoT.Devices_TiConnection|IoT.Devices_ToshibaUnauthorizedCommand|IoT.Devices_TotalBandwidthAnamolyDetection|IoT.Devices_TotalflowApplicationWhitelist|
|IoT.Devices_TotalflowFileWhitelist|IoT.Devices_TotalflowFirmwareChangeDetection|IoT.Devices_TrafficResumedDetection|IoT.Devices_TrafficStoppedDetection|
|IoT.Devices_TwinCATFirmwareChangesDetection|IoT.Devices_UnauthorizedDeviceDetection|IoT.Devices_UnauthorizedQueriesDetection|IoT.Devices_UnexpectedTextLengthDetection|
|IoT.Devices_UnitySubfunctionWhitelist|IoT.Devices_UnrecoverableCommand|IoT.Devices_UnresponsiveCommand|IoT.Devices_UserDefinedAlert|
|IoT.Devices_ValidRequestsFunctionCodeRange|IoT.Devices_WannacryMalwareDetection|IoT.Devices_WebShell|IoT.Devices_WhiteListViolations|
|IoT.Devices_WhitelistCustomProtocolAlert|IoT.Devices_ZeroPortUsageDetection| | |

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md)
