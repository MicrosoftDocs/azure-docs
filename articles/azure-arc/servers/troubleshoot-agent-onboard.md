---
title: Troubleshoot Azure Connected Machine agent connection issues
description: This article tells how to troubleshoot and resolve issues with the Connected Machine agent that arise with Azure Arc-enabled servers when trying to connect to the service.
ms.date: 10/13/2022
ms.topic: conceptual
---

# Troubleshoot Azure Connected Machine agent connection issues

This article provides information for troubleshooting issues that might occur while configuring the Azure Connected Machine agent for Windows or Linux. Both the interactive and at-scale installation methods when configuring connection to the service are included. For general information, see [Azure Arc-enabled servers overview](./overview.md).

## Agent error codes

Use the following table to identify and resolve issues when configuring the Azure Connected Machine agent using the `AZCM0000` ("0000" can be any four digit number) error code printed to the console or script output.

| Error code | Probable cause | Suggested remediation |
|------------|----------------|-----------------------|
| AZCM0000 | The action was successful | N/A |
| AZCM0001 | An unknown error occurred | Contact Microsoft Support for assistance. |
| AZCM0011 | The user canceled the action (CTRL+C) | Retry the previous command. |
| AZCM0012 | The access token is invalid | If authenticating via access token, obtain a new token and try again. If authenticating via service principal or device logins, contact Microsoft Support for assistance. |
| AZCM0016 | Missing a mandatory parameter | Review the error message in the output to identify which parameters are missing. For the complete syntax of the command, run `azcmagent <command> --help`. |
| AZCM0018 | The command was executed without administrative privileges | Retry the command in an elevated user context (administrator/root). |
| AZCM0019 | The path to the configuration file is incorrect | Ensure the path to the configuration file is correct and try again. |
| AZCM0023 | The value provided for a parameter (argument) is invalid | Review the error message for more specific information. Refer to the syntax of the command (`azcmagent <command> --help`) for valid values or expected format for the arguments. |
| AZCM0026 | There's an error in network configuration or some critical services are temporarily unavailable | Check if the required endpoints are reachable (for example, hostnames are resolvable, endpoints aren't blocked). If the network is configured for Private Link Scope, a Private Link Scope resource ID must be provided for onboarding using the `--private-link-scope` parameter. |
| AZCM0041 | The credentials supplied are invalid | For device logins, verify that the user account specified has access to the tenant and subscription where the server resource will be created. For service principal logins, check the client ID and secret for correctness, the expiration date of the secret, and that the service principal is from the same tenant where the server resource will be created. |
| AZCM0042 | Creation of the Azure Arc-enabled server resource failed | Review the error message in the output to identify the cause of the failure to create resource and the suggested remediation. For more information, see [Connected Machine agent prerequisites-required permissions](prerequisites.md#required-permissions) for more information. |
| AZCM0043 | Deletion of the Azure Arc-enabled server resource failed | Verify that the user/service principal specified has permissions to delete Azure Arc-enabled server/resources in the specified group. For more information, see [Connected Machine agent prerequisites-required permissions](prerequisites.md#required-permissions). If the resource no longer exists in Azure, use the `--force-local-only` flag to proceed. |
| AZCM0044 | A resource with the same name already exists | Specify a different name for the `--resource-name` parameter or delete the existing Azure Arc-enabled server in Azure and try again. |
| AZCM0062 | An error occurred while connecting the server | Review the error message in the output for more specific information. If the error occurred after the Azure resource was created, delete this resource before retrying. |
| AZCM0063 | An error occurred while disconnecting the server | Review the error message in the output for more specific information. If this error persists, delete the resource in Azure, and then run `azcmagent disconnect --force-local-only` on the server. |
| AZCM0067 | The machine is already connected to Azure | Run `azcmagent disconnect` to remove the current connection, then try again. |
| AZCM0068 | Subscription name was provided, and an error occurred while looking up the corresponding subscription GUID. | Retry the command with the subscription GUID instead of subscription name. |
| AZCM0061<br>AZCM0064<br>AZCM0065<br>AZCM0066<br>AZCM0070<br> | The agent service isn't responding or unavailable | Verify the command is run in an elevated user context (administrator/root). Ensure that the HIMDS service is running (start or restart HIMDS as needed) then try the command again. |
| AZCM0081 | An error occurred while downloading the Microsoft Entra managed identity certificate | If this message is encountered while attempting to connect the server to Azure, the agent won't be able to communicate with the Azure Arc service. Delete the resource in Azure and try connecting again. |
| AZCM0101 | The command wasn't parsed successfully | Run `azcmagent <command> --help` to review the command syntax. |
| AZCM0102 | An error occurred while retrieving the computer hostname | Retry the command and specify a resource name (with parameter --resource-name or –n). Use only alphanumeric characters, hyphens and/or underscores; note that resource name can't end with a hyphen or underscore. |
| AZCM0103 | An error occurred while generating RSA keys | Contact Microsoft Support for assistance. |
| AZCM0105 | An error occurred while downloading the Microsoft Entra ID managed identify certificate | Delete the resource created in Azure and try again. |
| AZCM0147-<br>AZCM0152 | An error occurred while installing Azcmagent on Windows | Review the error message in the output for more specific information. |
| AZCM0127-<br>AZCM0146 | An error occurred while installing Azcmagent on Linux | Review the error message in the output for more specific information. |
| AZCM0150 | Generic failure during installation | Submit a support ticket to get assistance. |
| AZCM0153 | The system platform isn't supported | Review the [prerequisites](prerequisites.md) for supported platforms |
| AZCM0154 | The version of PowerShell installed on the system is too old | Upgrade to PowerShell 4 or later and try again. |
| AZCM0155 | The user running the installation script doesn't have administrator permissions | Re-run the script as an administrator. |
| AZCM0156 | Installation of the agent failed | Confirm that the machine isn't running on Azure. Detailed errors might be found in the installation log at `%TEMP%\installationlog.txt`. |
| AZCM0157 | Unable to download repo metadata for the Microsoft Linux software repository | Check if a firewall is blocking access to `packages.microsoft.com` and try again. |

## Agent verbose log

Before following the troubleshooting steps described later in this article, the minimum information you need is the verbose log. It contains the output of the **azcmagent** tool commands, when the verbose (-v) argument is used. The log files are written to `%ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log` for Windows, and Linux to `/var/opt/azcmagent/log/azcmagent.log`.

### Windows

Following is an example of the command to enable verbose logging with the Connected Machine agent for Windows when performing an interactive installation.

```console
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID" --verbose
```

Following is an example of the command to enable verbose logging with the Connected Machine agent for Windows when performing an at-scale installation using a service principal.

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

Following is an example of the command to enable verbose logging with the Connected Machine agent for Linux when performing an interactive installation.

>[!NOTE]
>You must have *root* access permissions on Linux machines to run **azcmagent**.

```bash
azcmagent connect --resource-group "resourceGroupName" --tenant-id "tenantID" --location "regionName" --subscription-id "subscriptionID" --verbose
```

Following is an example of the command to enable verbose logging with the Connected Machine agent for Linux when performing an at-scale installation using a service principal.

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
|Failed to acquire authorization token device flow |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp 40.126.9.7:443: connect: network is unreachable.` |Can't reach `login.windows.net` endpoint | Run [azcmagent check](azcmagent-check.md) to see if a firewall is blocking access to Microsoft Entra ID. |
|Failed to acquire authorization token device flow |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp 40.126.9.7:443: connect: network is Forbidden`. |Proxy or firewall is blocking access to `login.windows.net` endpoint. | Run [azcmagent check](azcmagent-check.md) to see if a firewall is blocking access to Microsoft Entra ID.|
|Failed to acquire authorization token device flow  |`Error occurred while sending request for Device Authorization Code: Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/devicecode?api-version=1.0:  dial tcp lookup login.windows.net: no such host`. | Group Policy Object *Computer Configuration\ Administrative Templates\ System\ User Profiles\ Delete user profiles older than a specified number of days on system restart* is enabled. | Verify the GPO is enabled and targeting the affected machine. See footnote <sup>[1](#footnote1)</sup> for further details. |
|Failed to acquire authorization token from SPN |`Failed to execute the refresh request. Error = 'Post https://login.windows.net/fb84ce97-b875-4d12-b031-ef5e7edf9c8e/oauth2/token?api-version=1.0: Forbidden'` |Proxy or firewall is blocking access to `login.windows.net` endpoint. |Run [azcmagent check](azcmagent-check.md) to see if a firewall is blocking access to Microsoft Entra ID. |
|Failed to acquire authorization token from SPN |`Invalid client secret is provided` |Wrong or invalid service principal secret. |Verify the service principal secret. |
| Failed to acquire authorization token from SPN |`Application with identifier 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' wasn't found in the directory 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant` |Incorrect service principal and/or Tenant ID. |Verify the service principal and/or the tenant ID.|
|Get ARM Resource Response |`The client 'username@domain.com' with object id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' does not have authorization to perform action 'Microsoft.HybridCompute/machines/read' over scope '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.HybridCompute/machines/MSJC01' or the scope is invalid. If access was recently granted, please refresh your credentials."}}" Status Code=403` |Wrong credentials and/or permissions |Verify you or the service principal is a member of the **Azure Connected Machine Onboarding** role. |
|Failed to AzcmagentConnect ARM resource |`The subscription isn't registered to use namespace 'Microsoft.HybridCompute'` |Azure resource providers aren't registered. |Register the [resource providers](prerequisites.md#azure-resource-providers). |
|Failed to AzcmagentConnect ARM resource |`Get https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.HybridCompute/machines/MSJC01?api-version=2019-03-18-preview:  Forbidden` |Proxy server or firewall is blocking access to `management.azure.com` endpoint. | Run [azcmagent check](azcmagent-check.md) to see if a firewall is blocking access to Azure Resource Manager. |

<a name="footnote1"></a><sup>1</sup>If this GPO is enabled and applies to machines with the Connected Machine agent, it deletes the user profile associated with the built-in account specified for the *himds* service. As a result, it also deletes the authentication certificate used to communicate with the service that is cached in the local certificate store for 30 days. Before the 30-day limit, an attempt is made to renew the certificate. To resolve this issue, follow the steps to [disconnect the agent](azcmagent-disconnect.md) and then re-register it with the service running `azcmagent connect`.

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for more support:

* Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
