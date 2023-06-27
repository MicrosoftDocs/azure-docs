---
title: Authentication issues in Azure HDInsight
description: Authentication issues in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/28/2023
---

# Authentication issues in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

On secure clusters backed by Azure Data Lake (Gen1 or Gen2), when domain users sign in to the cluster services through HDI Gateway (like signing in to the Apache Ambari portal), HDI Gateway tries to obtain an OAuth token from Azure Active Directory (Azure AD) first, and then get a Kerberos ticket from Azure AD DS. Authentication can fail in either of these stages. This article is aimed at debugging some of those issues.

When the authentication fails, you gets prompted for credentials. If you cancel this dialog, the error message is printed. Here are some of the common error messages:

## invalid_grant or unauthorized_client, 50126

### Issue

Sign in fails for federated users with error code 50126 (sign in succeeds for cloud users). Error message is similar to:

```
Reason: Bad Request, Detailed Response: {"error":"invalid_grant","error_description":"AADSTS70002: Error validating credentials. AADSTS50126: Invalid username or password\r\nTrace ID: 09cc9b95-4354-46b7-91f1-efd92665ae00\r\n Correlation ID: 4209bedf-f195-4486-b486-95a15b70fbe4\r\nTimestamp: 2019-01-28 17:49:58Z","error_codes":[70002,50126], "timestamp":"2019-01-28 17:49:58Z","trace_id":"09cc9b95-4354-46b7-91f1-efd92665ae00","correlation_id":"4209bedf-f195-4486-b486-95a15b70fbe4"}
```

### Cause

Azure AD error code 50126 means the `AllowCloudPasswordValidation` policy not set by the tenant.

### Resolution

The Global Administrator of the Azure AD tenant should enable Azure AD to use password hashes for ADFS backed users.  Apply the `AllowCloudPasswordValidationPolicy` as shown in the article [Use Enterprise Security Package in HDInsight](../domain-joined/apache-domain-joined-architecture.md).

---

## invalid_grant or unauthorized_client, 50034

### Issue

Sign in fails with error code 50034. Error message is similar to:

```
{"error":"invalid_grant","error_description":"AADSTS50034: The user account Microsoft.AzureAD.Telemetry.Diagnostics.PII doesn't exist in the 0c349e3f-1ac3-4610-8599-9db831cbaf62 directory. To sign into this application, the account must be added to the directory.\r\nTrace ID: bbb819b2-4c6f-4745-854d-0b72006d6800\r\nCorrelation ID: b009c737-ee52-43b2-83fd-706061a72b41\r\nTimestamp: 2019-04-29 15:52:16Z", "error_codes":[50034],"timestamp":"2019-04-29 15:52:16Z","trace_id":"bbb819b2-4c6f-4745-854d-0b72006d6800", "correlation_id":"b009c737-ee52-43b2-83fd-706061a72b41"}
```

### Cause

User name is incorrect (doesn't exist). The user isn't using the same username that is used in Azure portal.

### Resolution

Use the same user name that works in that portal.

---

## invalid_grant or unauthorized_client, 50053

### Issue

User account is locked out, error code 50053. Error message is similar to:

```
{"error":"unauthorized_client","error_description":"AADSTS50053: You've tried to sign in too many times with an incorrect user ID or password.\r\nTrace ID: 844ac5d8-8160-4dee-90ce-6d8c9443d400\r\nCorrelation ID: 23fe8867-0e8f-4e56-8764-0cdc7c61c325\r\nTimestamp: 2019-06-06 09:47:23Z","error_codes":[50053],"timestamp":"2019-06-06 09:47:23Z","trace_id":"844ac5d8-8160-4dee-90ce-6d8c9443d400","correlation_id":"23fe8867-0e8f-4e56-8764-0cdc7c61c325"}
```

### Cause

Too many sign in attempts with an incorrect password.

### Resolution

Wait for 30 minutes or so, stop any applications that might be trying to authenticate.

---

## invalid_grant or unauthorized_client, 50053 (#2)

### Issue

Password expired, error code 50053. Error message is similar to:

```
{"error":"user_password_expired","error_description":"AADSTS50055: Password is expired.\r\nTrace ID: 241a7a47-e59f-42d8-9263-fbb7c1d51e00\r\nCorrelation ID: c7fe4a42-67e4-4acd-9fb6-f4fb6db76d6a\r\nTimestamp: 2019-06-06 17:29:37Z","error_codes":[50055],"timestamp":"2019-06-06 17:29:37Z","trace_id":"241a7a47-e59f-42d8-9263-fbb7c1d51e00","correlation_id":"c7fe4a42-67e4-4acd-9fb6-f4fb6db76d6a","suberror":"user_password_expired","password_change_url":"https://portal.microsoftonline.com/ChangePassword.aspx"}
```

### Cause

Password is expired.

### Resolution

Change the password in the Azure portal (on your on-premises system) and then wait for 30 minutes for sync to catch up.

---

## interaction_required

### Issue

Receive error message `interaction_required`.

### Cause

The conditional access policy or MFA is being applied to the user. Since interactive authentication isn't supported yet, the user or the cluster needs to be exempted from MFA / Conditional access. If you choose to exempt the cluster (IP address based exemption policy), then make sure that the AD `ServiceEndpoints` are enabled for that vnet.

### Resolution

Use conditional access policy and exempt the HDInsight clusters from MFA as shown in [Configure a HDInsight cluster with Enterprise Security Package by using Azure Active Directory Domain Services](./apache-domain-joined-configure-using-azure-adds.md).

---

## Sign in denied

### Issue

Sign in denied.

### Cause

To get to this stage, your OAuth authentication isn't an issue, but Kerberos authentication is. If this cluster is backed by ADLS, OAuth sign in has succeeded before Kerberos auth is attempted. On WASB clusters, OAuth sign in isn't attempted. There could be many reasons for Kerberos failure - like password hashes are out of sync, user account locked out in Azure AD DS, and so on. Password hashes sync only when the user changes password. When you create the Azure AD DS instance, it will start syncing passwords that are changed after the creation. It can't retroactively sync passwords that were set before its inception.

### Resolution

If you think passwords may not be in sync, try changing the password and wait for a few minutes to sync.

Try to SSH into a You need to try to authenticate (kinit) using the same user credentials, from a machine that is joined to the domain. SSH into the head / edge node with a local user and then run kinit.

---

## kinit fails

### Issue

Kinit fails.

### Cause

Varies.

### Resolution

For kinit to succeed, you need to know your `sAMAccountName` (this is the short account name without the realm). `sAMAccountName` is usually the account prefix (like bob in `bob@contoso.com`). For some users, it could be different. You need the ability to browse / search the directory to learn your `sAMAccountName`.

Ways to find `sAMAccountName`:

* If you can sign in to Ambari using the local Ambari admin, look at the list of users.

* If you have a [domain joined windows machine](../../active-directory-domain-services/tutorial-create-management-vm.md), you can use the standard Windows AD tools to browse. This requires a working account in the domain.

* From the head node, you can use SAMBA commands to search. This requires a valid Kerberos session (successful kinit). net ads search "(userPrincipalName=bob*)"

    The search / browse results should show you the `sAMAccountName` attribute. Also, you could look at other attributes like `pwdLastSet`, `badPasswordTime`, `userPrincipalName` etc. to see if those properties match what you expect.

---

## kinit fails with Preauthentication failure

### Issue

Kinit fails with `Preauthentication` failure.

### Cause

Incorrect username or password.

### Resolution

Check your username and password. Also check for other properties described. To enable verbose debugging, run `export KRB5_TRACE=/tmp/krb.log` from the session before trying kinit.

---

## Job / HDFS command fails due to TokenNotFoundException

### Issue

Job / HDFS command fails due to `TokenNotFoundException`.

### Cause

The required OAuth access token wasn't found for the job / command to succeed. The ADLS / ABFS driver tries to retrieve the OAuth access token from the credential service before making storage requests. This token gets registered when you sign in to the Ambari portal using the same user.

### Resolution

Ensure that you have successfully logged in to the Ambari portal once through the username whose identity is used to run the job.

---

## Error fetching access token

### Issue

User receives error message `Error fetching access token`.

### Cause

This error occurs intermittently when users try to access the ADLS Gen2 using ACLs and the Kerberos token has expired.

### Resolution

* For Azure Data Lake Storage Gen1, clean browser cache and log into Ambari again.

* For Azure Data Lake Storage Gen2, Run `/usr/lib/hdinsight-common/scripts/RegisterKerbTicketAndOAuth.sh <upn>` for the user the user is trying to login as

---

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
