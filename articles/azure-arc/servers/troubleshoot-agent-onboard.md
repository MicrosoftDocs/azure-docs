---
title: Troubleshoot Azure Arc-enabled servers agent connection issues
description: This article tells how to troubleshoot and resolve issues with the Connected Machine agent that arise with Azure Arc-enabled servers when trying to connect to the service.
ms.date: 07/16/2021
ms.topic: conceptual
---

# Troubleshoot Azure Arc-enabled servers agent connection issues

This article provides information on troubleshooting and resolving issues that may occur while attempting to configure the Azure Arc-enabled servers Connected Machine agent for Windows or Linux. Both the interactive and at-scale installation methods when configuring connection to the service are included. For general information, see [Arc-enabled servers overview](./overview.md).

## Agent error codes

If you receive an error when configuring the Azure Arc-enabled servers agent, the following table can help you identify the probable cause and suggested steps to resolve your problem. You will need the `AZCM0000` ("0000" can be any 4 digit number) error code printed to the console or script output to proceed.

| Error code | Probable cause | Suggested remediation |
|------------|----------------|-----------------------|
| AZCM0000 | The action was successful | N/A |
| AZCM0001 | An unknown error occurred | Contact Microsoft Support for further assistance |
| AZCM0011 | The user canceled the action (CTRL+C) | Retry the previous command |
| AZCM0012 | The access token provided is invalid | Obtain a new access token and try again |
| AZCM0013 | The tags provided are invalid | Check that the tags are enclosed in double quotes, separated by commas, and that any names or values with spaces are enclosed in single quotes: `--tags "SingleName='Value with spaces',Location=Redmond"`
| AZCM0014 | The cloud is invalid | Specify a supported cloud: `AzureCloud` or `AzureUSGovernment` |
| AZCM0015 | The correlation ID specified is not a valid GUID | Provide a valid GUID for `--correlation-id` |
| AZCM0016 | Missing a mandatory parameter | Review the output to identify which parameters are missing |
| AZCM0017 | The resource name is invalid | Specify a name that only uses alphanumeric characters, hyphens and/or underscores. The name cannot end with a hyphen or underscore. |
| AZCM0018 | The command was executed without administrative privileges | Retry the command with administrator or root privileges in an elevated command prompt or console session. |
| AZCM0041 | The credentials supplied are invalid | For device logins, verify the user account specified has access to the tenant and subscription where the server resource will be created. For service principal logins, check the client ID and secret for correctness, the expiration date of the secret, and that the service principal is from the same tenant where the server resource will be created. |
| AZCM0042 | Creation of the Arc-enabled server resource failed | Verify that the user/service principal specified has access to create Arc-enabled server resources in the specified resource group. |
| AZCM0043 | Deletion of the Arc-enabled server resource failed | Verify that the user/service principal specified has access to delete Arc-enabled server resources in the specified resource group. If the resource no longer exists in Azure, use the `--force-local-only` flag to proceed. |
| AZCM0044 | A resource with the same name already exists | Specify a different name for the `--resource-name` parameter or delete the existing Arc-enabled server in Azure and try again. |
| AZCM0061 | Unable to reach the agent service | Verify you are running the command in an elevated user context (administrator/root) and that the HIMDS service is running on your server. |
| AZCM0062 | An error occurred while connecting the server | Review other error codes in the output for more specific information. If the error occurred after the Azure resource was created, you need to delete the Arc server from your resource group before retrying. |
| AZCM0063 | An error occurred while disconnecting the server | Review other error codes in the output for more specific information. If you continue to encounter this error, you can delete the resource in Azure and then run `azcmagent disconnect --force-local-only` on the server to disconnect the agent. |
| AZCM0064 | The agent service is not responding | Check the status of the `himds` service to ensure it is running. Start the service if it is not running. If it is running, wait a minute then try again. |
| AZCM0065 | An internal agent communication error occurred | Contact Microsoft Support for assistance |
| AZCM0066 | The agent web service is not responding or unavailable | Contact Microsoft Support for assistance |
| AZCM0067 | The agent is already connected to Azure | Follow the steps in [disconnect the agent](manage-agent.md#unregister-machine) first, then try again. |
| AZCM0068 | An internal error occurred while disconnecting the server from Azure | Contact Microsoft Support for assistance |
| AZCM0081 | An error occurred while downloading the Azure Active Directory managed identity certificate | If this message is encountered while attempting to connect the server to Azure, the agent won't be able to communicate with the Azure Arc service. Delete the resource in Azure and try connecting again. |
| AZCM0101 | The command was not parsed successfully | Run `azcmagent <command> --help` to review the correct command syntax |
| AZCM0102 | Unable to retrieve the computer hostname | Run `hostname` to check for any system-level error messages, then contact Microsoft Support. |
| AZCM0103 | An error occurred while generating RSA keys | Contact Microsoft Support for assistance |
| AZCM0104 | Failed to read system information | Verify the identity used to run `azcmagent` has administrator/root privileges on the system and try again. |

## Agent verbose log

Before following the troubleshooting steps described later in this article, the minimum information you need is the verbose log. It contains the output of the **azcmagent** tool commands, when the verbose (-v) argument is used. The log files are written to `%ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log` for Windows, and Linux to `/var/opt/azcmagent/log/azcmagent.log`.

### Windows

The following is an example of the command to enable verbose logging with the Connected Machine agent for Windows when performing an interactive installation.

```console
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID" --verbose
```

The following is an example of the command to enable verbose logging with the Connected Machine agent for Windows when performing an at-scale installation using a service principal.

```console
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect `
  --service-principal-id "{serviceprincipalAppID}" `
  --service-principal-secret "{serviceprincipalPassword}" `
  --resource-group "{ResourceGroupName}" `
  --tenant-id "{tenantID}" `
  --location "{resourceLocation}" `
  --subscription-id "{subscriptionID}"
  --verbose
```

### Linux

The following is an example of the command to enable verbose logging with the Connected Machine agent for Linux when performing an interactive installation.

>[!NOTE]
>You must have *root* access permissions on Linux machines to run **azcmagent**.

```bash
azcmagent connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID" --verbose
```

The following is an example of the command to enable verbose logging with the Connected Machine agent for Linux when performing an at-scale installation using a service principal.

```bash
azcmagent connect \
  --service-principal-id "{serviceprincipalAppID}" \
  --service-principal-secret "{serviceprincipalPassword}" \
  --resource-group "{ResourceGroupName}" \
  --tenant-id "{tenantID}" \
  --location "{resourceLocation}" \
  --subscription-id "{subscriptionID}"
  --verbose
```

## Agent connection issues to service

The following table lists some of the known errors and suggestions on how to troubleshoot and resolve them.

|Message |Error |Probable cause |Solution |
|--------|------|---------------|---------|
|Failed to acquire authorization token device flow |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp 40.126.9.7:443: connect: network is unreachable.` |Cannot reach `login.windows.net` endpoint | Verify connectivity to the endpoint. |
|Failed to acquire authorization token device flow |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp 40.126.9.7:443: connect: network is Forbidden`. |Proxy or firewall is blocking access to `login.windows.net` endpoint. | Verify connectivity to the endpoint and it is not blocked by a firewall or proxy server. |
|Failed to acquire authorization token device flow  |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp lookup login.windows.net: no such host`. | Group Policy Object *Computer Configuration\ Administrative Templates\ System\ User Profiles\ Delete user profiles older than a specified number of days on system restart* is enabled. | Verify the GPO is enabled and targeting the affected machine. See footnote <sup>[1](#footnote1)</sup> for further details. |
|Failed to acquire authorization token from SPN |`Failed to execute the refresh request. Error = 'Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/token?api-version=1.0: Forbidden'` |Proxy or firewall is blocking access to `login.windows.net` endpoint. |Verify connectivity to the endpoint and it is not blocked by a firewall or proxy server. |
|Failed to acquire authorization token from SPN |`Invalid client secret is provided` |Wrong or invalid service principal secret. |Verify the service principal secret. |
| Failed to acquire authorization token from SPN |`Application with identifier 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' was not found in the directory 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant` |Incorrect service principal and/or Tenant ID. |Verify the service principal and/or the tenant ID.|
|Get ARM Resource Response |`The client 'username@domain.com' with object id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' does not have authorization to perform action 'Microsoft.HybridCompute/machines/read' over scope '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.HybridCompute/machines/MSJC01' or the scope is invalid. If access was recently granted, please refresh your credentials."}}" Status Code=403` |Wrong credentials and/or permissions |Verify you or the service principal is a member of the **Azure Connected Machine Onboarding** role. |
|Failed to AzcmagentConnect ARM resource |`The subscription is not registered to use namespace 'Microsoft.HybridCompute'` |Azure resource providers are not registered. |Register the [resource providers](./agent-overview.md#register-azure-resource-providers). |
|Failed to AzcmagentConnect ARM resource |`Get https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.HybridCompute/machines/MSJC01?api-version=2019-03-18-preview:  Forbidden` |Proxy server or firewall is blocking access to `management.azure.com` endpoint. |Verify connectivity to the endpoint and it is not blocked by a firewall or proxy server. |

<a name="footnote1"></a><sup>1</sup>If this GPO is enabled and applies to machines with the Connected Machine agent, it deletes the user profile associated with the built-in account specified for the *himds* service. As a result, it also deletes the authentication certificate used to communicate with the service that is cached in the local certificate store for 30 days. Before the 30-day limit, an attempt is made to renew the certificate. To resolve this issue, follow the steps to [unregister the machine](manage-agent.md#unregister-machine) and then re-register it with the service running `azcmagent connect`.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
