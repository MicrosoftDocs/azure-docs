---
title: Troubleshoot VMware mobility agent health errors in Azure Site Recovery 
description: This article describes troubleshooting mobility agent health errors in Azure Site Recovery. 
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 07/11/2024

---
# Troubleshoot mobility agent health errors
 

When you enable replication, Azure Site Recovery tries to install the Mobility service agent on your virtual machine (VM). As part of this process, the configuration server tries to connect with the virtual machine and copy the agent. To enable successful installation, follow the step-by-step troubleshooting guidance. 

This article describes how to troubleshoot mobility agent health errors in your VMware virtual machine.

## Before you start

Before you start troubleshooting, ensure that:

- You understand how to [deploy Azure Site Recovery replication appliance - Modernized](./deploy-vmware-azure-replication-appliance-modernized.md).
- Review the [support requirements for Azure Site Recovery replication appliance](./replication-appliance-support-matrix.md).


## Troubleshoot process

If you see the following error in the appliance health status:

### Troubleshoot certificate renewal

To troubleshoot mobility agent health errors, follow these recommendations:

1. Log in to source machine whose health is critical and check the `svagents_curr<>.log` file.
1. Locate the `svagents_curr<>.log` file in the following location:
    - **Linux**: `/var/log/svagents_curr<>.log`
    - **Windows**: `C:\Program Files (x86)\Microsoft Azure Site Recovery\agent\svagents_curr<>.log`


### Error 1 - ClientCertificateIsInvalidOrExpired

If you get the following error in the `svagents_curr<>.log` file:

# [Error message](#tab/error-message)

**ClientCertificateIsInvalidOrExpired**
**The specified client certificate is invalid or already expired.**

---

#### Full error message

```
<ErrorCategory>ClientError</ErrorCategory>
<ErrorCode> **ClientCertificateIsInvalidOrExpired** </ErrorCode>
<ErrorSeverity>Error</ErrorSeverity>
<IsRcmReportedError>false</IsRcmReportedError>
<IsRetryableError>false</IsRetryableError>
<Message> **The specified client certificate is invalid or already expired.** </Message>
<PossibleCauses>The specified client certificate is valid between '6/23/2024 2:46:05 AM' and '6/24/2024 5:00:00 PM'. The current time is '6/26/2024 9:47:26 AM' which is outside certificate validity window.</PossibleCauses>
```

#### Resolution

Follow these recommendations: 
1. [Upgrade Azure Site Recovery mobility agent](./upgrade-mobility-service-modernized.md) to the latest version available on the source machine. 
1. [Generate Mobility Service configuration](./vmware-physical-mobility-service-overview.md#generate-mobility-service-configuration-file) file and [re-register](./vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized) mobility agents with appliance.


### Error 2 - certificate verification failed

If you get the following error in the `svagents_curr<>.log` file:

# [Error message](#tab/error-message)

handshake: **certificate verify failed** (SSL routines)

---

#### Full error message

```
#~> (06-25-2024 16:17:42):   ERROR  2480 4612 36 TransportStream::Write: Failed to send data with error [at C:\__w\1\s\host\cxpslib\client.h:BasicClient<class HttpTraits>::putFile:609]   (sid: ), remoteName: b0a77692-5c2a-48d5-bb95-35404e10a10d.mon, dataSize: 1048576, moreData: 1, error: [at C:\__w\1\s\host\cxpslib\client.h:BasicClient<class HttpTraits>::connectSocket:1468]   WIN-0LTQUK99R9O : 11001, No such host is known.: handshake: certificate verify failed (SSL routines) [asio.ssl:167772294].  (may want to check server side logs for this sid) cxps
```


#### Resolution

Follow these recommendations:
1. Navigate to the replication appliance where the process server component health is critical and log in into the appliance.
1. [Upgrade](./upgrade-mobility-service-modernized.md#upgrade-appliance) process server on the appliance to the latest version and wait for an hour.
1. Restart the services - *Process Server* and *Process Server Monitor* and wait for an hour.


### Error 3 - SSL peer certificate or SSH remote key wasn't OK

If you get the following error in the `svagents_curr<>.log` file:

# [Error message](#tab/error-message)

**Server certificate expired**

---

#### Full error message

```
#~> (06-20-2024 10:03:51):  ERROR  1688 648 16394 Server certificate expired for URL https://<IPAddress>:443/CallRcmApi
#~> (06-20-2024 10:03:51):   ERROR  1688 648 16395 Could not perform curl. Curl error: (60) SSL peer certificate or SSH remote key was not OK
#~> (06-20-2024 10:03:51):   ERROR  1688 648 16396 Curl internal error : SSL certificate problem: self-signed certificate.
#~> (06-20-2024 10:03:51):   ERROR  1688 648 16397 Curl operation failed with error (60) SSL peer certificate or SSH remote key was not OK
#~> (06-20-2024 10:03:51):   ERROR  1688 648 16398 RcmClientLib::RcmClientProxyImpl::GetRcmProxyResponse: Request failed for URI https://10.150.176.77:443/CallRcmApi, rcmEndPoint: GetOnPremToAzureSourceAgentSettings, ClientRequestId: , ErrorCode: 60
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16399 Could not perform curl. Curl error: (6) Couldn't resolve host name
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16400 Curl internal error : Could not resolve host:.
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16401 Curl operation failed with error (6) Couldn't resolve host name
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16402 RcmClientLib::RcmClientProxyImpl::GetRcmProxyResponse: Request failed for URI https://<Hostname>:443/CallRcmApi, rcmEndPoint: GetOnPremToAzureSourceAgentSettings, ClientRequestId:, ErrorCode: 6
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16403 RCM proxy post call failed for all addresses
#~> (06-20-2024 10:03:53):   ERROR  1688 648 16404 RcmClientLib::RcmConfigurator::PollReplicationSettings: failed to get settings from RCM with error 20501
```

#### Resolution

Follow these recommendations:

1. Navigate to the replication appliance where the Proxy Server component health is critical and log in into the replication appliance. 
1. [Upgrade](./upgrade-mobility-service-modernized.md#upgrade-appliance) proxy server on the appliance to the latest version and wait for an hour.
1. If the proxy server is already on the latest version, try restarting the services *Microsoft Azure RCM Proxy Agent* and *Microsoft Azure RCM Proxy Management Service*  and wait for an hour.
1. [Generate](./vmware-physical-mobility-service-overview.md#generate-mobility-service-configuration-file) mobility service configuration file and [re-register](./vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized) mobility agents with appliance. 


### Error 4 - mismatch of fingerprints received

If you get the following error in the `svagents_curr<>.log` file:


# [Error message](#tab/error-message)

**Mismatch of fingerprints between received:**

---

#### Full error message

```
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 19 Could not perform curl. Curl error: (6) Couldn't resolve host name 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 20 Curl internal error: Could not resolve host: <> 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 21 Curl operation failed with error (6) Couldn't resolve host name 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 22 RcmClientLib::RcmClientProxyImpl::GetServerCert: Request failed for URI https://WIN-PK3OA9GH55Q:443, ErrorCode: 6
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 23 RcmClientLib::RcmClientProxyImpl::GetServerCert: Failed to get SSL Server cert and fingerprint 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 24 Failed to get SSL Server cert and fingerprint for RCM Proxy <>:443 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 25 Mismatch of fingerprints between received: <> and in source config: <> 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 26 Get server cert failed for all rcm proxy address 
#~> (07-01-2024 13:13:34):   ERROR  2952 5016 27 VxService::StartWork: Verify client auth failed with error 4. Waiting for 120 sec before retry.
```

----

#### Resolution

Follow this recommendation:

[Generate](./vmware-physical-mobility-service-overview.md#generate-mobility-service-configuration-file) mobility service configuration file and [re-register](./vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized) mobility agents with appliance. 

## Next steps

If you're still facing issues, contact Microsoft Support for further assistance.