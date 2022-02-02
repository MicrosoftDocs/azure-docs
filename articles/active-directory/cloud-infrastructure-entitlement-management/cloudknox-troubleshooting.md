---
title: Troubleshoot issues with CloudKnox Permissions Management 
description: Troubleshoot issues with CloudKnox Permissions Management
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: faq
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Troubleshoot issues with CloudKnox Permissions Management

This section answers troubleshoot issues with CloudKnox Permissions Management (CloudKnox).

## One Time Passcode (OTP) email

### The user did not receive the OTP email.

- Check your junk or Spam mail folder for the email.  

## Reports

### The individual files are generated according to the authorization system (subscription/account/project).

- Select the **Collate** option in the **Custom report** screen in the CloudKnox **Reports** tab.  

## Data collection in AWS

### Data collection > AWS Authorization system data collection status is offline. Upload and transform is also offline. 

- Check the CloudKnox-related role that exists in these accounts. 
- Validate the trust relationship with the OpenID Connect (OIDC) role. 





<!---## Next steps--->

<!---## One Time Passcode (OTP) email

### The user did not receive the OTP email.

- Check the Kibana Special Event Server proxy (**SESProxy**) and the **athena-fe** service for any errors related to the email sending service.

## Permissions on-demand (POD) in Azure

### Azure POD success or failure

- Check the ATTACH_ROLE_POLICY in Kibana.

## Permissions on-demand (POD) in AWS

### AWS POD success or failure

- Check the CREATE_AND_ATTACH_POLICY OR POD in Kibana.

## Data collection

### Data collection > Authorization system data collection uploads are online but transform is offline.

- Check Kibana for the **Task Derivation** and **<account/subscription/project>** for the **Vulcan** service.

## Data collection in Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP)

### Successful data collection of the AWS account / Azure subscription / GCP project.

- Check that the **Entitlements** job in Kibana has completed successfully for the AWS account. - Check the <account/subscription/project> and ENTITLEMENTS for a **Completed Collection** status in the **sentryaws** service.

### Data collector update was done by the admin.

- Check Kibana for the **Update data collector** configuration.	
- Kibana must display O0rYvL1WCjpnQFrJ969pODqbBnfnM5Jd and update the	**athena-fe** service.

## Data collection in AWS

### Sentry is uploading the data collection	

- Check Kibana for the **Entitlements data collection** status of the  AWS account.
- Check **ENTITLEMENTS**, **<account/subscription/project>**, and **handleUpload** in the **poseidon-2** service.

### Jobs scheduled for the data collection	

- Check Kibana for the **Entitlements** job scheduled for the data collection of the AWS account. 
- Kibana should display a **Successfully Scheduled Entitlements Job** message and **<account/subscription/project>** in the **athena-jobs** service.
--->