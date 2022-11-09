---
title: Acquiring a user token in Azure Cloud Shell
description: How to acquire a token for the authenticated user in Azure Cloud Shell 
services: azure
author: maertendMSFT
ms.author: damaerte
tags: azure-resource-manager
ms.service: cloud-shell
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.date: 09/29/2021
---

# Acquire a token in Azure Cloud Shell

Azure Cloud Shell provides an endpoint that will automatically authenticate the user logged into the Azure portal. Use this endpoint to acquire access tokens to interact with Azure services.

## Authenticating in the Cloud Shell
The Azure Cloud Shell has its own endpoint that interacts with your browser to automatically log you in. When this endpoint receives a request, it sends the request back to your browser, which forwards it to the parent Portal frame. The Portal window makes a request to Azure Active Directory, and the resulting token is returned.

If you want to authenticate with different credentials, you can do so using `az login` or `Connect-AzAccount`

## Acquire and use access token in Cloud Shell

### Acquire token

Execute the following commands to set your user access token as an environment variable, `access_token`.
```
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The access token is $access_token
```

### Use token

Execute the following command to get a list of all Virtual Machines in your account, using the token you acquired in the previous step.

```
curl https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2021-07-01 -H "Authorization: Bearer $access_token" -H "x-ms-version: 2019-02-02"
```

## Handling token expiration

The local authentication endpoint caches tokens. You can call it as often as you like, and an authentication call to Azure Active Directory will only happen if there's no token stored in the cache, or the token is expired.

## Limitations
- There's an allowlist of resources that Cloud Shell tokens can be provided for. If you run a command and receive a message similar to `"error":{"code":"AudienceNotSupported","message":"Audience https://newservice.azure.com/ is not a supported MSI token audience...."}`, you've come across this limitation. You can file an issue on [GitHub](https://github.com/Azure/CloudShell/issues) to request that this service is added to the allowlist.
- If you log in explicitly using the `az login` command, any Conditional Access rules your company may have in place will be evaluated based on the Cloud Shell container rather than the machine where your browser runs. The Cloud Shell container doesn’t count as a managed device for these policies so rights may be limited by the policy.
- Azure Managed Identities aren't available in the Azure Cloud Shell. [Read more about Azure Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).
