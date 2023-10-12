---
title: Microsoft Entra Cloud Sync error codes and descriptions
description: reference article for cloud sync error codes
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 01/18/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra Cloud Sync error codes and descriptions
The following is a list of error codes and their description


## Error codes

|Error code|Details|Scenario|Resolution|
|-----|-----|-----|-----|
|TimeOut|Error Message: We've detected a request timeout error when contacting the on-premises agent and synchronizing your configuration. For additional issues related to your cloud sync agent, please see our troubleshooting guidance.|Request to HIS timed out. Current Timeout value is 10 minutes.|See our [troubleshooting guidance](how-to-troubleshoot.md)|
|HybridSynchronizationActiveDirectoryInternalServerError|Error Message: We were unable to process this request at this point. If this issue persists, please contact support and provide the following job identifier: AD2AADProvisioning.30b500eaf9c643b2b78804e80c1421fe.5c291d3c-d29f-4570-9d6b-f0c2fa3d5926. Additional details: Processing of the HTTP request resulted in an exception. |Couldn't process the parameters received in SCIM request to a Search request.|Please see the HTTP response returned by the 'Response' property of this exception for details.|
|HybridIdentityServiceNoAgentsAssigned|Error Message: We're unable to find an active agent for the domain you're trying to sync. Please check to see if the agents have been removed. If so, re-install the agent again.|There are no agents running. Probably agents have been removed. Register a new agent.|"In this case, you won't see any agent assigned to the domain in portal.|
|HybridIdentityServiceNoActiveAgents|Error Message: We're unable to find an active agent for the domain you're trying to sync. Please check to see if the agent is running by going to the server, where the agent is installed, and check to see if **Microsoft Entra Connect cloud sync agent** under Services is running.|"Agents aren't listening to the ServiceBus endpoint. [The agent is behind a firewall that doesn't allow connections to service bus](../../app-proxy/application-proxy-configure-connectors-with-proxy-servers.md#use-the-outbound-proxy-server)|
|HybridIdentityServiceInvalidResource|Error Message: We were unable to process this request at this point. If this issue persists, please contact support and provide the following job identifier: AD2AADProvisioning.3a2a0d8418f34f54a03da5b70b1f7b0c.d583d090-9cd3-4d0a-aee6-8d666658c3e9. Additional details: There seems to be an issue with your cloud sync setup. Please re-register your cloud sync agent on your on-premises AD domain and restart configuration from portal.|The resource name must be set so HIS knows which agent to contact.|Please re-register your cloud sync agent on your on-premises AD domain and restart configuration from portal.|
|HybridIdentityServiceAgentSignalingError|Error Message: We were unable to process this request at this point. If this issue persists, please contact support and provide the following job identifier: AD2AADProvisioning.92d2e8750f37407fa2301c9e52ad7e9b.efb835ef-62e8-42e3-b495-18d5272eb3f9. Additional details: We were unable to process this request at this point. If this issue persists, please contact support with Job ID (from status pane of your configuration).|Service Bus isn't able to send a message to the agent. Could be an outage in service bus, or the agent isn't responsive.|If this issue persists, please contact support with Job ID (from status pane of your configuration).|
|AzureDirectoryServiceServerBusy|Error Message: An error occurred. Error Code: 81. Error Description: Microsoft Entra ID is currently busy. This operation will be retried automatically. If this issue persists for more than 24 hours, contact Technical Support. Tracking ID: 8a4ab3b5-3664-4278-ab64-9cff37fd3f4f Server Name:|Microsoft Entra ID is currently busy.|If this issue persists for more than 24 hours, contact Technical Support.|
|AzureActiveDirectoryInvalidCredential|Error Message: We found an issue with the service account that is used to run Microsoft Entra Cloud Sync. You can repair the cloud service account by following the instructions at [here](./how-to-troubleshoot.md). If the error persists, please contact support with Job ID (from status pane of your configuration). Additional Error Details: CredentialsInvalid AADSTS50034: The user account {EmailHidden} doesn't exist in the skydrive365.onmicrosoft.com directory. To sign into this application, the account must be added to the directory. Trace ID: 14b63033-3bc9-4bd4-b871-5eb4b3500200 Correlation ID: 57d93ed1-be4d-483c-997c-a3b6f03deb00 Timestamp: 2021-01-12 21:08:29Z |This error is thrown when the sync service account ADToAADSyncServiceAccount doesn't exist in the tenant. It can be due to accidental deletion of the account.|Use [Repair-AADCloudSyncToolsAccount](reference-powershell.md#repair-aadcloudsynctoolsaccount) to fix the service account.|
|AzureActiveDirectoryExpiredCredentials|Error Message: We were unable to process this request at this point. If this issue persists, please contact support with Job ID (from status pane of your configuration). Additional Error Details: CredentialsExpired AADSTS50055: The password is expired. Trace ID: 989b1841-dbe5-49c9-ab6c-9aa25f7b0e00 Correlation ID: 1c69b196-1c3a-4381-9187-c84747807155 Timestamp: 2021-01-12 20:59:31Z | Response status code doesn't indicate success: 401 (Unauthorized).<br> Azure AD Sync service account credentials are expired.|You can repair the cloud service account by following the instructions at https://go.microsoft.com/fwlink/?linkid=2150988. If the error persists, please contact support with Job ID (from status pane of your configuration). Additional Error Details: Your administrative Microsoft Entra tenant credentials were exchanged for an OAuth token that has since expired."|
|AzureActiveDirectoryAuthenticationFailed|Error Message: We were unable to process this request at this point. If this issue persists, please contact support and provide the following job identifier: AD2AADProvisioning.60b943e88f234db2b887f8cb91dee87c.707be0d2-c6a9-405d-a3b9-de87761dc3ac. Additional details: We were unable to process this request at this point. If this issue persists, please contact support with Job ID (from status pane of your configuration). Additional Error Details: UnexpectedError.|Unknown error.|If this issue persists, please contact support with Job ID (from status pane of your configuration).|

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Cloud Sync?](what-is-cloud-sync.md)
